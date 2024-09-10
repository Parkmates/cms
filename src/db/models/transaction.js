const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class TransactionModels {
  static async getAll(userId) {
    const transactions = await database
      .collection("transactions")
      .aggregate([
        {
          $match: {
            userId: new ObjectId(String(userId)),
          },
        },
        {
          $lookup: {
            from: "spotDetails",
            localField: "spotDetailId",
            foreignField: "_id",
            as: "spotDetail",
          },
        },
        {
          $unwind: {
            path: "$spotDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "parkingSpots",
            localField: "spotDetail.parkingSpotId",
            foreignField: "_id",
            as: "parkingSpot",
          },
        },
        {
          $unwind: {
            path: "$parkingSpot",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    return transactions;
  }

  static async getById({ id, userId }) {
    const transaction = await database
      .collection("transactions")
      .aggregate([
        {
          $match: {
            _id: new ObjectId(new ObjectId(String(id))),
            userId: new ObjectId(new ObjectId(String(userId))),
          },
        },
        {
          $lookup: {
            from: "spotDetails",
            localField: "spotDetailId",
            foreignField: "_id",
            as: "spotDetail",
          },
        },
        {
          $unwind: {
            path: "$spotDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "parkingSpots",
            localField: "spotDetail.parkingSpotId",
            foreignField: "_id",
            as: "parkingSpot",
          },
        },
        {
          $unwind: {
            path: "$parkingSpot",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
    if (!transaction) {
      let error = new Error();
      error.message = "transaction Not Found";
      error.name = "NotFound";
      throw error;
    }

    return transaction;
  }

  static async createTransaction({ spotDetailId, userId }) {
    const spotValidate = await database.collection("transactions").findOne({
      $and: [
        { spotDetailId: new ObjectId(String(spotDetailId)) },
        { userId: new ObjectId(String(userId)) },
        { status: "bookingPending" },
      ],
    });

    if (spotValidate) {
      let error = new Error();
      error.message = "Already BookSpot";
      error.name = "AlreadyBookSpot";
      throw error;
    }

    // cari spot detail untuk ambil type nya
    // jadi mobile gausah kirim type kendaraan nya
    const spotDetail = await database.collection("spotDetails").findOne({
      _id: new ObjectId(String(spotDetailId)),
    });

    if (!spotDetail) {
      let error = new Error();
      error.message = "Spot Not Found";
      error.name = "NotFound";
      throw error;
    }
    const type = spotDetail.type;

    if (spotDetail.quantity == 0) {
      let error = new Error();
      error.message = "Full Booked";
      error.name = "FullBooked";
      throw error;
    }

    await database.collection("spotDetails").updateOne(
      {
        _id: new ObjectId(String(spotDetailId)),
      },
      {
        $inc: { quantity: -1 },
      }
    );

    const data = await database.collection("transactions").insertOne({
      userId: new ObjectId(String(userId)),
      spotDetailId: new ObjectId(String(spotDetailId)),
      status: "bookingPending",
      paymentUrl: "",
      bookingFee: type === "car" ? 10000 : 5000,
      paymentFee: 0,
      checkoutAt: "",
      checkinAt: "",
      bookAt: "",
      paymentAt: "",
      createdAt: new Date(),
    });

    return data.insertedId;
  }

  static async checkInTransaction({ id, userId }) {
    // kita cek dulu status nya, kalo "parking",
    // berarti gausah checkin lagi
    // jadi kalo ada user yang nakal, mau checkin pake qr code yang sama, gabisa
    const trx = await database.collection("transactions").findOne({
      _id: new ObjectId(String(id)),
    });
    if (trx.status === "parking") {
      let error = new Error();
      error.message = "Already Checkin";
      error.name = "alreadyCheckIn";
      throw error;
    }

    const transaction = await database.collection("transactions").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      {
        $set: { status: "parking", checkinAt: new Date() },
      }
    );
    if (!transaction.modifiedCount) {
      let error = new Error();
      error.message = "Checkin Failed";
      throw error;
    }
    return "Check-In Success";
  }

  static async checkOutTransaction({ id, userId }) {
    const trx = await database
      .collection("transactions")
      .findOne({ _id: new ObjectId(String(id)) });

    await database.collection("spotDetails").updateOne(
      {
        _id: new ObjectId(String(trx.spotDetailId)),
      },
      {
        $inc: { quantity: +1 },
      }
    );

    const transaction = await database.collection("transactions").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      {
        $set: { status: "checkoutSuccessfull", checkoutAt: new Date() },
      }
    );
    if (!transaction.modifiedCount) {
      let error = new Error();
      error.message = "Checkout Failed";
      error.name = "CheckoutFailed";
      throw error;
    }
    return "Check-Out Success";
  }

  static async cancelTransaction({ id, userId }) {
    // kalo user mau cancel, status nya jadi apa?
    const transaction = await database.collection("transactions").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      {
        $set: { status: "canceled" },
      }
    );
    if (!transaction.modifiedCount) {
      let error = new Error();
      error.message = "Cancel Failed";
      error.name = "CancelFailed";
      throw error;
    }

    const trx = await database
      .collection("transactions")
      .findOne({ _id: new ObjectId(String(id)) });

    await database.collection("spotDetails").updateOne(
      {
        _id: new ObjectId(String(trx.spotDetailId)),
      },
      {
        $inc: { quantity: +1 },
      }
    );

    return "Cancel Success";
  }

  static async updateStatus({
    id,
    type,
    amount = 0,
    bookAt = "",
    paymentAt = "",
  }) {
    let status = "";
    if (type === "bookingPaymentSuccess") {
      status = "bookingSuccessfull";
    } else if (type === "failed" || type === "expired") {
      status = "failed";
    } else if (type === "paymentSuccess") {
      status = "checkoutPending";
    }

    const trx = await database.collection("transactions").findOne({
      _id: new ObjectId(String(id)),
    });
    if (!trx) {
      let error = new Error();
      error.message = "transaction not found";
      throw error;
    }

    const transaction = await database.collection("transactions").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      {
        $set: {
          status: status,
          paymentFee: Number(trx.paymentFee) + Number(amount),
          bookAt: bookAt,
          paymentAt: paymentAt,
        },
      }
    );
    if (!transaction.modifiedCount) {
      let error = new Error();
      error.message = "cb midtrans failed";
      error.name = "cbMidtransFailed";
      throw error;
    }
    return "ok";
  }

  static async updatePaymentUrl({ id, url }) {
    const trx = await database.collection("transactions").findOne({
      _id: new ObjectId(String(id)),
    });
    if (!trx) {
      let error = new Error();
      error.message = "transaction not found";
      throw error;
    }

    const transaction = await database.collection("transactions").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      {
        $set: { paymentUrl: url },
      }
    );
    if (!transaction.modifiedCount) {
      let error = new Error();
      error.message = "Failed";
      error.name = "Failed";
      throw error;
    }
    return "ok";
  }

  // KHUSUS UNTUK CRON JOB
  // untuk get all trx
}

module.exports = TransactionModels;
