const ParkingSpotModels = require("@/db/models/parkingSpot");
const { z } = require("zod");

async function GET(req, res) {
  try {
    const { id } = res.params;
    const authorId = req.headers.get("x-id");
    const role = req.headers.get("x-role");

    const result = await ParkingSpotModels.getById({ id, authorId, role });
    return Response.json(result);
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error instanceof z.ZodError) {
      msgError = error.errors[0].path[0] + " " + error.errors[0].message;
      status = 400;
    }
    if (error.name === "NotFound") {
      status = 404
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

async function PUT(req, res) {
  try {
    const { id } = res.params;
    const role = req.headers.get("x-role");

    const { name, address, imgUrl } =
      await req.json();

    const result = await ParkingSpotModels.updateParkingSpot({
      id,
      name,
      address,
      imgUrl,
      role,
    });

    return Response.json({ msg: result });
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
    const { id } = res.params;
    const authorId = req.headers.get("x-id");
    const role = req.headers.get("x-role");

    const result = await ParkingSpotModels.deleteParkingSpot({
      id,
      authorId,
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

async function POST(req, res) {
  try {
    const { id } = res.params
    const role = req.headers.get("x-role")
    const { type, quantity, fee, floor, area } = await req.json()

    const result = await ParkingSpotModels.createSpotDetail({ type, quantity, fee, floor, area, id, role })

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
  GET,
  PUT,
  DELETE,
  POST
};
