const ParkingSpotModels = require("@/db/models/parkingSpot");
const { z } = require("zod");

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
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error instanceof z.ZodError) {
      msgError = error.errors[0].path[0] + " " + error.errors[0].message;
      status = 400;
    }
    if (error.name === "unauthorized") {
      status = 403
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
    const { id, spotDetailId } = res.params;
    const role = req.headers.get("x-role");

    const result = await ParkingSpotModels.deleteSpotDetail({
      id,
      spotDetailId,
      role,
    });

    return Response.json(result)
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error instanceof z.ZodError) {
      msgError = error.errors[0].path[0] + " " + error.errors[0].message;
      status = 400;
    }
    if (error.name === "unauthorized") {
      status = 403
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

module.exports = {
  PUT,
  DELETE,
};
