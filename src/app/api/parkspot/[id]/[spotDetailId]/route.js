const ParkingSpotModels = require("@/db/models/parkingSpot");

async function PUT(req, res) {
  try {
    const { id, spotDetailId } = res.params;
    const role = req.headers.get("x-role");
    const { type, quantity, fee, floor, area } = await req.json();

    const result = await ParkingSpotModels.updateSpotDetail({
      type,
      quantity,
      fee,
      floor,
      area,
      id,
      spotDetailId,
      role,
    });

    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

async function DELETE(req, res) {
  try {
    const { id, spotDetailId } = res.params;
    const role = req.headers.get("x-role");

    const result = await ParkingSpotModels.deleteSpotDetail({
      id,
      spotDetailId,
      role,
    });

    return Response.json(result)
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = {
  PUT,
  DELETE,
};
