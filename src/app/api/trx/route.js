const TransactionModels = require("@/db/models/transaction");

async function GET() {
  try {
    const result = await TransactionModels.getAll();
    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

async function POST(req) {
  try {
    const { spotId } = await req.json();
    // if (!spotId) throw { name: "ParkingSpotNotFound" };

    const result = await TransactionModels.createTransaction({ spotId });

    return Response.json({ msg: result })
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error.name === "AlreadyBookSpot") {
      status = 409;
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
