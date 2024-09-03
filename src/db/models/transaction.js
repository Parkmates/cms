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
    if (!transaction) throw { name: "TransactionNotFound" };

    return transaction;
  }

  static async createTransaction({ spotId }) {
    const spotValidate = await database
      .collection("transactions")
      .findOne({ spotId: new ObjectId(String(spotId)) });
    if (spotValidate) throw { name: "AlreadyBookSpot" };

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
    if (!transaction.modifiedCount) throw { name: "CheckinFailed" };

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
      if (!transaction.modifiedCount) throw { name: "CheckoutFailed" };
  
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
      if (!transaction.modifiedCount) throw { name: "CancelFailed" };
  
      return "Cancel Success";
  }
}

module.exports = TransactionModels;