const ParkingSpotModels = require("@/db/models/parkingSpot");

async function GET() {
    try {
        const result = await ParkingSpotModels.getBestParkSpot();

        return Response.json(result)
    } catch (error) {
        console.log(error)
        return Response.json(error)
    }
}

module.exports = { GET }