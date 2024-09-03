const ParkingSpotModels = require("@/db/models/parkingSpot");

async function GET() {
  try {
    const result = await ParkingSpotModels.getAll();
    return Response.json(result);
  } catch (error) {
    console.log(error);
<<<<<<< Updated upstream
    return Response.json(error);
=======
    Response.json(error);
>>>>>>> Stashed changes
  }
}

async function POST(req) {
  try {
<<<<<<< Updated upstream
    const { name, address, imgUrl, motorSpot, carSpot, motorFee, carFee } = await req.json();
    if (!name) throw { name: "RequiredName" };
    if (!address) throw { name: "RequiredAddress" };
    if (!imgUrl) throw { name: "RequiredImgUrl" };
    if (!motorSpot) throw { name: "RequiredMotorSpot" };
    if (!carSpot) throw { name: "RequiredCarSpot" };
    if (!motorFee) throw { name: "RequiredMotorFee" };
    if (!carFee) throw { name: "RequiredCarFee" };
=======
    const { name, address, imgUrl, motorSpot, carSpot } = req.json();
    if (!name) throw { name: "RequiredName" };
    if (!address) throw { name: "RequiredName" };
    if (!imgUrl) throw { name: "RequiredName" };
    if (!motorSpot) throw { name: "RequiredName" };
    if (!carSpot) throw { name: "RequiredName" };
>>>>>>> Stashed changes

    const result = await ParkingSpotModels.createParkingSpot({
      name,
      address,
      imgUrl,
      motorSpot,
<<<<<<< Updated upstream
      carSpot,
      motorFee,
      carFee
=======
      CarSpot,
>>>>>>> Stashed changes
    });

    return Response.json({ msg: result });
  } catch (error) {
    console.log(error);
<<<<<<< Updated upstream
    return Response.json(error);
=======
    Response.json(error);
>>>>>>> Stashed changes
  }
}

module.exports = {
  GET,
  POST,
};
