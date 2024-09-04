const ParkingSpotModels = require("@/db/models/parkingSpot");
const { z } = require("zod");

async function GET() {
  try {
    const result = await ParkingSpotModels.getAll();
    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

async function POST(req) {
  try {
    const { name, address, imgUrl, motorSpot, carSpot, motorFee, carFee } = await req.json();
    // if (!name) throw { name: "RequiredName" };
    // if (!address) throw { name: "RequiredAddress" };
    // if (!imgUrl) throw { name: "RequiredImgUrl" };
    // if (!motorSpot) throw { name: "RequiredMotorSpot" };
    // if (!carSpot) throw { name: "RequiredCarSpot" };
    // if (!motorFee) throw { name: "RequiredMotorFee" };
    // if (!carFee) throw { name: "RequiredCarFee" };

    const result = await ParkingSpotModels.createParkingSpot({
      name,
      address,
      imgUrl,
      motorSpot,
      carSpot,
      motorFee,
      carFee
    });

    return Response.json({ msg: result });
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

module.exports = {
  GET,
  POST,
};
