const ParkingSpotModels = require("@/db/models/parkingSpot");

async function GET() {
    try {
        const result = await ParkingSpotModels.getBestParkSpot();

        return Response.json(result)
    } catch (error) {
        let msgError = error.message || "Internal server error";
        let status = 500;
        return Response.json(
          {
            msg: msgError,
          },
          {
            status: status,
          }
        );
    }
}

module.exports = { GET }