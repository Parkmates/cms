const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class TransactionModels {
  static async getAll() {
    const transactions = await database
      .collection("transactions")
      .find()
      .toArray();
    return transactions;
  }

  static async getById(id) {
    const transaction = await database
      .collection("transactions")
      .findOne({ _id: new ObjectId(String(id)) });
    if (!transaction) {
      let error = new Error();
      error.message = "transaction Not Found";
      error.name = "NotFound"
      throw error;
    }

    return transaction;
  }

  static async createTransaction({ spotId }) {
    const spotValidate = await database
      .collection("transactions")
      .findOne({ spotId: new ObjectId(String(spotId)) });
    // if (spotValidate) throw { name: "AlreadyBookSpot" };
    if (spotValidate) {
      let error = new Error();
      error.message = "Already BookSpot";
      error.name = "AlreadyBookSpot"
      throw error;
    }
    const result = await database.collection("transactions").insertOne({
      userId: new ObjectId("66d6d3d0cf201705437e09cc"),
      spotId: new ObjectId(String(spotId)),
      isActive: true,
      isCheckin: false,
      createdAt: new Date(),
    });
    return "Transaction success";
  }

  static async checkInTransaction(id) {
    const transaction = await database.collection("transactions").updateOne(
      {
        $and: [
          { _id: new ObjectId(String(id)) },
          { userId: new ObjectId(String("66d6d3d0cf201705437e09cd")) },
        ],
      },
      {
        $set: { isCheckin: true },
      }
    );
    console.log(transaction);
    // if (!transaction.modifiedCount) throw { name: "CheckinFailed" };
    if (!transaction.modifiedCount) {
      let error = new Error();
      error.message = "Checkin Failed";
      error.name = "CheckinFailed"
      throw error;
    }
    return "Check-In Success";
  }

  static async checkOutTransaction(id) {
    const transaction = await database.collection("transactions").updateOne(
      {
        $and: [
          { _id: new ObjectId(String(id)) },
          { userId: new ObjectId(String("66d6d3d0cf201705437e09cc")) },
        ],
      },
      {
        $set: { isActive: false },
      }
    );
    console.log(transaction);
    // if (!transaction.modifiedCount) throw { name: "CheckoutFailed" };
    if (!transaction.modifiedCount) {
      let error = new Error();
      error.message = "Checkout Failed";
      error.name = "CheckoutFailed"
      throw error;
    }
    return "Check-Out Success";
  }

  static async cancelTransaction(id) {
    const transaction = await database.collection("transactions").updateOne(
      {
        $and: [
          { _id: new ObjectId(String(id)) },
          { userId: new ObjectId(String("66d6d3d0cf201705437e09cc")) },
        ],
      },
      {
        $set: { isActive: false, isCheckin: false },
      }
    );
    console.log(transaction);
    // if (!transaction.modifiedCount) throw { name: "CancelFailed" };
    if (!transaction.modifiedCount) {
      let error = new Error();
      error.message = "Cancel Failed";
      error.name = "CancelFailed"
      throw error;
    }
    return "Cancel Success";
  }
}

module.exports = TransactionModels;
