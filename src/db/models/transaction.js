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

    const parkSpot = await database.collection("parkingSpots").findOne({
      _id: new ObjectId(String(spotDetail.parkingSpotId)),
    });

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
      vendorId: new ObjectId(String(parkSpot.authorId)),
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
      error.name = "checkinFailed";
      throw error;
    }
    return "Check-In Success";
  }

  static async checkOutTransaction({ id, userId }) {
    const trx = await database
      .collection("transactions")
      .findOne({ _id: new ObjectId(String(id)) });

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
      error.name = "checkoutFailed";
      throw error;
    }

    await database.collection("spotDetails").updateOne(
      {
        _id: new ObjectId(String(trx.spotDetailId)),
      },
      {
        $inc: { quantity: +1 },
      }
    );

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
      error.name = "cancelFailed";
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
    } else if (type === "failed" || type === "expire") {
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

    let book = {
      status: status,
      bookAt: new Date(),
    };

    let pay = {
      status: status,
      paymentFee: Number(trx.paymentFee) + Number(amount),
      paymentAt: new Date(),
    };

    let toSet = bookAt !== "" ? book : pay;

    const transaction = await database.collection("transactions").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      {
        $set: toSet,
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
  // get all trx untuk ambil trx yang status nya booking successfull,
  // tapi dalam 1 jam belom parking

  // update status nya jadi cancelled

  static async checkInStatusUpdater() {
    const data = await database
      .collection("transactions")
      .find({
        // status: "bookingSuccessfull",
        $and: [
          { status: "bookingSuccessfull" },
          // { bookAt: { $lt: new Date(Date.now() - 1000 * 60 * 60) } }, //kalo 1 jam dari sekarang
          { bookAt: { $lt: new Date(Date.now() - 1000 * 60) } }, // 1 menit dari sekarang TESTING
        ],
      })
      .toArray();

    // update status nya jadi cancelled
    await database.collection("transactions").updateMany(
      {
        status: "bookingSuccessfull",
      },
      {
        $set: { status: "canceled" },
      }
    );

    console.log(data);

    //tambahin lagi stock nya
    data.forEach(async (item) => {
      await database.collection("spotDetails").updateOne(
        {
          _id: new ObjectId(String(item.spotDetailId)),
        },
        {
          $inc: { quantity: +1 },
        }
      );
    });
    return data;
  }
  static async checkOutStatusUpdater() {
    const data = await database
      .collection("transactions")
      .find({
        // status: "checkoutPending",
        $and: [
          { status: "checkoutPending" },
          // { paymentAt: { $lt: new Date(Date.now() - 1000 * 60 * 60) } }, //kalo 1 jam dari sekarang
          { paymentAt: { $lt: new Date(Date.now() - 1000 * 60) } }, // 1 menit dari sekarang TESTING
        ],
      })
      .toArray();

    // update status nya jadi cancelled
    await database.collection("transactions").updateMany(
      {
        status: "checkoutPending",
      },
      {
        $set: { status: "parking" },
      }
    );
    return data;
  }

  static async getHistoryForVendor({ role, userId, limit, page, search }) {
    const pageSize = limit ? parseInt(limit, 10) : Infinity;
    page = Math.max(1, +page);

    const matchStage = {
      vendorId: new ObjectId(String(userId)),
      status: { $in: ["checkoutSuccessfull", "failed", "canceled"] },
    };

    if (search) {
      const searchId = new ObjectId(String(search));
      matchStage._id = searchId;
    }

    const agg = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "spotDetails",
          localField: "spotDetailId",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "parkingSpots",
                localField: "parkingSpotId",
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
          ],
          as: "spotDetail",
        },
      },
      {
        $unwind: {
          path: "$spotDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const totalCount = await database
      .collection("transactions")
      .countDocuments(matchStage);

    const totalPages =
      pageSize === Infinity ? null : Math.ceil(totalCount / pageSize);

    const resultQuery = database.collection("transactions").aggregate(agg);

    const result =
      pageSize === Infinity
        ? await resultQuery.toArray()
        : await resultQuery
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            .toArray();

    return {
      data: result,
      totalPages,
    };
  }
}

module.exports = TransactionModels;
