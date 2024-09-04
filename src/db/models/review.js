const { ObjectId } = require("mongodb")
const database = require("../config/mongodb")

class ReviewModels {
    static async getAll(spotId) {
        const reviews = await database.collection("reviews").find({
            spotId
        }).toArray()
        return reviews
    }

    static async createReview({ spotId, rating, comment, userId }) {
        const result = await database.collection("reviews").insertOne({
            userId: new ObjectId(String(userId)),
            spotId,
            rating, 
            comment: comment || "",
            createdAt: new Date()
        })

        return "Create review success"
    }
}

module.exports = ReviewModels