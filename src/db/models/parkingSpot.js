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
    if(!parkingSpot) throw {name: "ParkingSpotNotFound"}
    return parkingSpot;
  }
}

module.exports = ParkingSpotModels;
