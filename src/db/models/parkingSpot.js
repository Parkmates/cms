const { z } = require("zod");
const database = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class ParkingSpotModels {
  static async getAll({ role, authorId }) {
    let opt = {};
    if (role === "vendor") {
      opt = {
        authorId: new ObjectId(String(authorId)),
      };
    }

    const parkSpots = await database
      .collection("parkingSpots")
      .find(opt)
      .toArray();
    return parkSpots;
  }

  static async getById({ id, authorId, role }) {
    const agg = role === "vendor" ? [
      {
        '$match': {
          '_id': new ObjectId(String(id))
        }
      }, {
        '$match': {
          'authorId': new ObjectId(String(authorId))
        }
      }, {
        '$lookup': {
          'from': 'spotDetails', 
          'localField': '_id', 
          'foreignField': 'parkingSpotId', 
          'as': 'spotList'
        }
      }
    ] : [{
      '$match': {
        '_id': new ObjectId(String(id))
      }
    }]

    const parkingSpot = await database.collection("parkingSpots").aggregate(agg).toArray();

    if (!parkingSpot) throw { name: "ParkingSpotNotFound" };
    return parkingSpot[0];
  }

  static async createParkingSpot({
    name,
    address,
    imgUrl,
    authorId,
    role,
  }) {
    if (role === "user") {
      let error = new Error();
      error.message = "Unauthorized";
      error.name = "unauthorized";
      throw error;
    }

    const validation = z
      .object({
        name: z.string().min(1, "is required"),
        address: z.string().min(1, "is required"),
        imgUrl: z.string().min(1, "is required"),
      })
      .safeParse({
        name,
        address,
        imgUrl,
      });
    if (!validation.success) throw validation.error;
    await database.collection("parkingSpots").insertOne({
      name,
      address,
      imgUrl,
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
    if (role === "user") {
      let error = new Error();
      error.message = "Unauthorized";
      error.name = "unauthorized";
      throw error;
    }
    const validation = z
      .object({
        name: z.string().min(1, "is required"),
        address: z.string().min(1, "is required"),
        imgUrl: z.string().min(1, "is required"),
        motorSpot: z.string().min(1, "is required"),
        carSpot: z.string().min(1, "is required"),
        motorFee: z.string().min(1, "is required"),
        carFee: z.string().min(1, "is required"),
      })
      .safeParse({
        name,
        address,
        imgUrl,
        motorSpot,
        carSpot,
        motorFee,
        carFee,
      });
    if (!validation.success) throw validation.error;
    const result = await database.collection("parkingSpots").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      { $set: { name, address, imgUrl, motorSpot, carSpot, motorFee, carFee } }
    );
    return "Success update parking spot";
  }

  static async deleteParkingSpot({ id, authorId, role }) {
    console.log(id, authorId, role);

    if (role === "user") {
      let error = new Error();
      error.message = "Unauthorized";
      error.name = "unauthorized";
      throw error;
    }
    const result = await database.collection("parkingSpots").deleteOne({
      $and: [
        { _id: new ObjectId(String(id)) },
        { authorId: new ObjectId(String(authorId)) },
      ],
    });
    return { result: "Success delete parking spot" };
  }

  static async createSpotDetail({
    type,
    quantity,
    fee,
    floor,
    area,
    id,
    role,
  }) {
    if (role === "user") {
      let error = new Error();
      error.message = "Unauthorized";
      error.name = "unauthorized";
      throw error;
    }
    const result = await database.collection("spotDetails").insertOne({
      parkingSpotId: new ObjectId(String(id)),
      type,
      quantity,
      fee,
      floor,
      area,
    });

    return "Success create spot detail";
  }

  static async updateSpotDetail({
    type,
    quantity,
    fee,
    floor,
    area,
    id,
    spotDetailId,
    role,
  }) {
    if (role === "user") {
      let error = new Error();
      error.message = "Unauthorized";
      error.name = "unauthorized";
      throw error;
    }
    const result = await database.collection("spotDetails").updateOne(
      {
        $and: [
          { _id: new ObjectId(String(spotDetailId)) },
          { parkingSpotId: new ObjectId(String(id)) },
        ],
      },
      { $set: { type, quantity, fee, floor, area } }
    );

    return "Success update spot detail";
  }

  static async deleteSpotDetail({id,
    spotDetailId,
    role,}) {
      if (role === "user") {
        let error = new Error();
        error.message = "Unauthorized";
        error.name = "unauthorized";
        throw error;
      }

      const result = await database.collection("spotDetails").deleteOne({
        $and: [
          { _id: new ObjectId(String(spotDetailId)) },
          { parkingSpotId: new ObjectId(String(id)) },
        ],
      })

      return "Success delete spot detail"
    }
}

module.exports = ParkingSpotModels;
