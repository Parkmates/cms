const database = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class ParkingSpotModels {
  static async getAll({ role, authorId }) {
    let opt = {};
    if (role === "vendor") {
      opt = {
        authorId,
      };
    }

    const parkSpots = await database
      .collection("parkingSpots")
      .find(opt)
      .toArray();
    return parkSpots;
  }

  static async getById({ id, authorId, role }) {
    let opt = { _id: new ObjectId(String(id)) };
    if (role === "vendor") {
      opt["$and"] = [{ authorId: new ObjectId(String(authorId)) }];
    }

    const parkingSpot = await database.collection("parkingSpots").findOne(opt);
    if (!parkingSpot) throw { name: "ParkingSpotNotFound" };
    return parkingSpot;
  }

  static async createParkingSpot({
    name,
    address,
    imgUrl,
    motorSpot,
    carSpot,
    motorFee,
    carFee,
    authorId,
    role,
  }) {
    if (role !== "vendor")
      throw { name: "Your account unauthorized to create parking spot" };
    const result = await database.collection("parkingSpots").insertOne({
      name,
      address,
      imgUrl,
      motorSpot,
      carSpot,
      motorFee,
      carFee,
      authorId: new ObjectId(String(authorId)),
    });
    return "Success create parking spot";
  }

  static async updateParkingSpot({
    id,
    name,
    address,
    imgUrl,
    motorSpot,
    carSpot,
    motorFee,
    carFee,
    role,
  }) {
    if (role !== "vendor")
      throw { name: "Your account unauthorized to update parking spot data" };
    const result = await database.collection("parkingSpots").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      { $set: { name, address, imgUrl, motorSpot, carSpot, motorFee, carFee } }
    );
    return "Success update parking spot";
  }

  static async deleteParkingSpot({ id, authorId, role }) {
    if (role !== "vendor")
      throw { name: "Your account unauthorized to delete parking spot" };
    const result = await database.collection("parkingSpots").deleteOne({
      $and: [
        { _id: new ObjectId(String(id)) },
        { authorId: new ObjectId(String(authorId)) },
      ],
    });
    return { result: "Success delete parking spot" };
  }
}

module.exports = ParkingSpotModels;
