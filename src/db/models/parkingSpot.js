const { z } = require("zod");
const database = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class ParkingSpotModels {
  static async getAll({ role, authorId, name }) {
    let opt = {};
    if (role === "vendor") {
      opt = {
        $and: [{ authorId: new ObjectId(String(authorId)) }],
      };
    }

    if (name) {
      opt.name = {
        $regex: name || "",
        $options: "i",
      };
    }

    const parkSpots = await database
      .collection("parkingSpots")
      .find(opt)
      .toArray();
    return parkSpots;
  }

  static async getById({ id, authorId, role }) {
    const agg = [
      {
        $match: {
          _id: new ObjectId(String(id)),
        },
      },
      ...(role === "vendor"
        ? [
          {
            $match: {
              authorId: new ObjectId(String(authorId)),
            },
          },
        ]
        : []),
      {
        $lookup: {
          from: "spotDetails",
          localField: "_id",
          foreignField: "parkingSpotId",
          as: "spotList",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "spotId",
          as: "reviews"
        },
      }
    ];

    const parkingSpot = await database
      .collection("parkingSpots")
      .aggregate(agg)
      .toArray();

    if (!parkingSpot) {
      let error = new Error();
      error.message = "Parking Spot NotFound";
      error.name = "NotFound";
      throw error;
    }
    return parkingSpot[0];
  }

  static async createParkingSpot({ name, address, imgUrl, authorId, role }) {
    if (role === "user") {
      let error = new Error();
      error.message = "Can not access, sorry";
      error.name = "unauthorized";
      throw error;
    }

    const validation = z
      .object({
        name: z.string().min(1, "is required"),
        address: z.string().min(1, "is required"),
        // imgUrl: z.string().min(1, "is required"),
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

  static async updateParkingSpot({ id, name, address, imgUrl, role }) {
    if (role === "user") {
      let error = new Error();
      error.message = "Can not access, sorry";
      error.name = "unauthorized";
      throw error;
    }
    const validation = z
      .object({
        name: z.string().min(1, "is required"),
        address: z.string().min(1, "is required"),
        // imgUrl: z.string().min(1, "is required"),
      })
      .safeParse({
        name,
        address,
        imgUrl,
      });
    if (!validation.success) throw validation.error;
    const result = await database.collection("parkingSpots").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      { $set: { name, address, imgUrl } }
    );
    return "Success update parking spot";
  }

  static async deleteParkingSpot({ id, authorId, role }) {
    if (role === "user") {
      let error = new Error();
      error.message = "Can not access, sorry";
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

  static async getSpotDetailById({ id, spotDetailId }) {
    const spotDetail = await database.collection("spotDetails").findOne({
      _id: new ObjectId(String(spotDetailId)),
      parkingSpotId: new ObjectId(String(id)),
    });

    if (!spotDetail) {
      let error = new Error();
      error.message = "Spot Detail NotFound";
      throw error;
    }
    return spotDetail;
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
      error.message = "Can not access, sorry";
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
      error.message = "Can not access, sorry";
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

  static async deleteSpotDetail({ id, spotDetailId, role }) {
    if (role === "user") {
      let error = new Error();
      error.message = "Can not access, sorry";
      error.name = "unauthorized";
      throw error;
    }

    const result = await database.collection("spotDetails").deleteOne({
      $and: [
        { _id: new ObjectId(String(spotDetailId)) },
        { parkingSpotId: new ObjectId(String(id)) },
      ],
    });

    return "Success delete spot detail";
  }

  static async getBestParkSpot() {
    const agg = [
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "spotId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          ratingList: "$reviews.rating",
        },
      },
      {
        $addFields: {
          totalRating: {
            $sum: "$ratingList",
          },
        },
      },
      {
        $sort: {
          totalRating: -1,
        },
      },
      {
        $limit: 3,
      },
      {
        $project: {
          ratingList: 0,
        },
      },
    ];

    const result = await database
      .collection("parkingSpots")
      .aggregate(agg)
      .toArray();

    return result;
  }
}

module.exports = ParkingSpotModels;
