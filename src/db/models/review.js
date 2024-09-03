const database = require("../config/mongodb")

class ReviewModels {
    static async getAll(spotId) {
        const reviews = await database.collection("reviews").find({
            spotId
        }).toArray()
        return reviews
    }
}

module.exports = ReviewModels