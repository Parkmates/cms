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
        { spotId: new ObjectId(String(spotId)) },
        { userId: new ObjectId(String(userId)) },
      ],
    });
    if (spotValidate) {
      let error = new Error();
      error.message = "Already BookSpot";
      error.name = "AlreadyBookSpot";
      throw error;
    }
    const result = await database.collection("transactions").insertOne({
      userId: new ObjectId(String(userId)),
      spotDetailId: new ObjectId(String(spotDetailId)),
      isActive: true,
      isCheckin: false,
      createdAt: new Date(),
    });
    return "Transaction success";
  }

  static async checkInTransaction({ id, userId }) {
    // kita cek dulu status isCheckin nya, kalo true, berarti gausah checkin lagi
    const status = await database.collection("transactions").findOne({
      _id: new ObjectId(String(id)),
    });
    if (status.isCheckin) {
      let error = new Error();
      error.message = "Already Checkin";
      throw error;
    }

    const transaction = await database.collection("transactions").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      {
        $set: { isCheckin: true },
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
    const status = await database.collection("transactions").findOne({
      _id: new ObjectId(String(id)),
    });
    if (!status.isCheckin) {
      let error = new Error();
      error.message = "You haven't checked in";
      throw error;
    }

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
      error.message = "Checkout Failed";
      error.name = "CheckoutFailed";
      throw error;
    }
    return "Check-Out Success";
  }

  static async cancelTransaction({ id, userId }) {
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
}

module.exports = TransactionModels;
