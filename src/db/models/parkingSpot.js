const database = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class ParkingSpotModels {
  static async getAll() {
    const parkSpots = await database
      .collection("parkingSpots")
      .find()
      .toArray();
    return parkSpots;
  }

  static async getById(id) {
    const parkingSpot = await database
      .collection("parkingSpots")
      .findOne({ _id: new ObjectId(String(id)) });
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
  }) {
    const result = await database.collection("parkingSpots").insertOne({
      name,
      address,
      imgUrl,
      motorSpot,
      carSpot,
      motorFee,
      carFee,
      authorId: new ObjectId(String("66d6d3d0cf201705437e09cc")),
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
  }) {
    const result = await database.collection("parkingSpots").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      { $set: { name, address, imgUrl, motorSpot, carSpot, motorFee, carFee } }
    );
    return "Success update parking spot";
  }

  static async deleteParkingSpot(id) {
    const result = await database.collection("parkingSpots").deleteOne(
      {
        _id: new ObjectId(String(id)),
      }
    )
    return { result: "Success delete parking spot" };
  }
}

module.exports = ParkingSpotModels;
