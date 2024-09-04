const ParkingSpotModels = require("@/db/models/parkingSpot");

async function GET(req, res) {
  try {
    const { id } = res.params;
    const authorId = req.headers.get("x-id");
    const role = req.headers.get("x-role");

    const result = await ParkingSpotModels.getById({ id, authorId, role });
    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

async function PUT(req, res) {
  try {
    const { id } = res.params;
    const role = req.headers.get("x-role");

    const { name, address, imgUrl, motorSpot, carSpot, motorFee, carFee } =
      await req.json();
    if (!name) throw { name: "RequiredName" };
    if (!address) throw { name: "RequiredAddress" };
    if (!imgUrl) throw { name: "RequiredImgUrl" };
    if (!motorSpot) throw { name: "RequiredMotorSpot" };
    if (!carSpot) throw { name: "RequiredCarSpot" };
    if (!motorFee) throw { name: "RequiredMotorFee" };
    if (!carFee) throw { name: "RequiredCarFee" };

    const result = await ParkingSpotModels.updateParkingSpot({
      id,
      name,
      address,
      imgUrl,
      motorSpot,
      carSpot,
      motorFee,
      carFee,
      role
    });

    return Response.json({ msg: result });
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

async function DELETE(req, res) {
  try {
    const { id } = res.params;
    const authorId = req.headers.get("x-id");
    const role = req.headers.get("x-role");

    const result = await ParkingSpotModels.deleteParkingSpot({id, authorId, role});

    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = {
  GET,
  PUT,
  DELETE,
};
