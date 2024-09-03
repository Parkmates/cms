const ParkingSpotModels = require("@/db/models/parkingSpot")

async function GET() {
    try {
        const result = await ParkingSpotModels.getAll()
        return Response.json(result)
    } catch (error) {
        console.log(error)
        Response.json(error)
    }
}

module.exports = {
    GET
}