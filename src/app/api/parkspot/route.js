const ParkingSpotModels = require("@/db/models/parkingSpot");
const { z } = require("zod");

async function GET(req, res) {
  try {
    const role = req.headers.get("x-role");
    const authorId = req.headers.get("x-id");
    const name = req.nextUrl.searchParams.get("name")

    const result = await ParkingSpotModels.getAll({ role, authorId, name });
    return Response.json(result);
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

async function POST(req) {
  try {
    const authorId = req.headers.get("x-id");
    const role = req.headers.get("x-role");

    const { name, address, imgUrl } =
      await req.json();

    const result = await ParkingSpotModels.createParkingSpot({
      name,
      address,
      imgUrl,
      authorId,
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

module.exports = {
  GET,
  POST,
};
