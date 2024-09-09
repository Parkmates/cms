const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class TransactionModels {
  static async getAll(userId) {
    const transactions = await database
      .collection("transactions")
      .find({ userId: new ObjectId(String(userId)) })
      .toArray();
    return transactions;
  }

  static async getById({ id, userId }) {
    const transaction = await database.collection("transactions").findOne({
      $and: [
        { _id: new ObjectId(String(id)) },
        { userId: new ObjectId(String(userId)) },
      ],
    });
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
        { status: "booking pending" },
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
      throw error;
    }
    const type = spotDetail.type;

    await database.collection("transactions").insertOne({
      userId: new ObjectId(String(userId)),
      spotDetailId: new ObjectId(String(spotDetailId)),
      status: "booking pending",
      paymentUrl: "",
      bookingFee: type === "car" ? 10000 : 5000,
      paymentFee: 0,
      CheckinAt: "",
      CheckoutAt: "",
      createdAt: new Date(),
    });
    return "Transaction success";
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
      throw error;
    }

    const transaction = await database.collection("transactions").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      {
        $set: { status: "parking" },
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
    const transaction = await database.collection("transactions").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      {
        $set: { status: "checkout successfull" },
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
        $set: { isActive: false, isCheckin: false },
      }
    );
    if (!transaction.modifiedCount) {
      let error = new Error();
      error.message = "Cancel Failed";
      error.name = "CancelFailed";
      throw error;
    }
    return "Cancel Success";
  }

  static async updateStatus({ id, type, amount }) {
    let status = "";
    if (type === "bookingPaymentSuccess") {
      status = "booking successfull";
    } else if (type === "failed") {
      status = "failed";
    } else if (type === "paymentSuccess") {
      status = "checkout pending";
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
}

module.exports = TransactionModels;
