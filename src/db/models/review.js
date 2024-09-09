const { ObjectId } = require("mongodb")
const database = require("../config/mongodb");
const { z } = require("zod");

class ReviewModels {
    static async getAll(spotId) {
        const reviews = await database.collection("reviews").find({
            spotId
        }).toArray()
        return reviews
    }

    static async createReview({ spotId, rating, comment, userId }) {
        const validation = z
            .object({
                rating: z.string().min(1, "is required"),
            })
            .safeParse({ rating });
        if (!validation.success) throw validation.error;
        const result = await database.collection("reviews").insertOne({
            userId: new ObjectId(String(userId)),
            spotId: new ObjectId(String(spotId)),
            rating, 
            comment: comment || "",
            createdAt: new Date()
        })

        return "Create review success"
    }
}

module.exports = ReviewModels