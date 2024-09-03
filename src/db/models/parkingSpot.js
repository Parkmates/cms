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
  }) {
    const result = await database.collection("parkingSpots").insertOne({
      name,
      address,
      imgUrl,
      motorSpot,
      carSpot,
      authorId: new ObjectId(String("66d6d3d0cf201705437e09cc")),
    });
    return "Success create parking spot";
  }
}

module.exports = ParkingSpotModels;
