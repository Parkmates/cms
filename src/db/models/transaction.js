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
    if (!transaction) throw { name: "TransactionNotFound" };

    return transaction;
  }

  static async createTransaction({ spotId, userId }) {
    const spotValidate = await database.collection("transactions").findOne({
      $and: [
        { spotId: new ObjectId(String(spotId)) },
        { userId: new ObjectId(String(userId)) },
      ],
    });
    if (spotValidate) throw { name: "AlreadyBookSpot" };

    const result = await database.collection("transactions").insertOne({
      userId: new ObjectId(String(userId)),
      spotId: new ObjectId(String(spotId)),
      isActive: true,
      isCheckin: false,
      createdAt: new Date(),
    });
    return "Transaction success";
  }

  static async checkInTransaction({ id, userId }) {
    const transaction = await database.collection("transactions").updateOne(
      {
        $and: [
          { _id: new ObjectId(String(id)) },
          { userId: new ObjectId(String(userId)) },
        ],
      },
      {
        $set: { isCheckin: true },
      }
    );
    if (!transaction.modifiedCount) throw { name: "CheckinFailed" };

    return "Check-In Success";
  }

  static async checkOutTransaction({ id, userId }) {
    const transaction = await database.collection("transactions").updateOne(
      {
        $and: [
          { _id: new ObjectId(String(id)) },
          { userId: new ObjectId(String(userId)) },
        ],
      },
      {
        $set: { isActive: false },
      }
    );
    if (!transaction.modifiedCount) throw { name: "CheckoutFailed" };

    return "Check-Out Success";
  }

  static async cancelTransaction({ id, userId }) {
    const transaction = await database.collection("transactions").updateOne(
      {
        $and: [
          { _id: new ObjectId(String(id)) },
          { userId: new ObjectId(String(userId)) },
        ],
      },
      {
        $set: { isActive: false, isCheckin: false },
      }
    );
    if (!transaction.modifiedCount) throw { name: "CancelFailed" };

    return "Cancel Success";
  }
}

module.exports = TransactionModels;
