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
}

module.exports = TransactionModels;
