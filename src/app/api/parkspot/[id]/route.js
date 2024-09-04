const ParkingSpotModels = require("@/db/models/parkingSpot");
const { z } = require("zod");

async function GET(req, res) {
  try {
    const { id } = res.params;
    const result = await ParkingSpotModels.getById(id);
    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

async function PUT(req, res) {
  try {
    const { id } = res.params;
    const { name, address, imgUrl, motorSpot, carSpot, motorFee, carFee } =
      await req.json();

    const result = await ParkingSpotModels.updateParkingSpot({
      id,
      name,
      address,
      imgUrl,
      motorSpot,
      carSpot,
      motorFee,
      carFee,
    });

    return Response.json({ msg: result })
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error instanceof z.ZodError) {
      msgError = error.errors[0].path[0] + " " + error.errors[0].message;
      status = 400;
    }
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

async function DELETE(req, res) {
  try {
    const { id } = res.params;

    const result = await ParkingSpotModels.deleteParkingSpot(id)

    return Response.json(result)
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = {
  GET,
  PUT,
  DELETE
};
