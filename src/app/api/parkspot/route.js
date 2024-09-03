const ParkingSpotModels = require("@/db/models/parkingSpot");

async function GET() {
  try {
    const result = await ParkingSpotModels.getAll();
    return Response.json(result);
  } catch (error) {
    console.log(error);
    Response.json(error);
  }
}

async function POST(req) {
  try {
    const { name, address, imgUrl, motorSpot, carSpot } = await req.json();
    if (!name) throw { name: "RequiredName" };
    if (!address) throw { name: "RequiredAddress" };
    if (!imgUrl) throw { name: "RequiredImgUrl" };
    if (!motorSpot) throw { name: "RequiredMotorSpot" };
    if (!carSpot) throw { name: "RequiredCarSpot" };

    const result = await ParkingSpotModels.createParkingSpot({
      name,
      address,
      imgUrl,
      motorSpot,
      carSpot,
    });

    return Response.json({ msg: result });
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = {
  GET,
  POST,
};
