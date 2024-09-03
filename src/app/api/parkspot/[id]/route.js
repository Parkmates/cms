const ParkingSpotModels = require("@/db/models/parkingSpot")

async function GET(req, res) {
    try {
        const { id } = res.params
        const result = await ParkingSpotModels.getById(id)
        return Response.json(result)
    } catch (error) {
        console.log(error)
        return Response.json(error)
    }
}

module.exports = {
    GET
}