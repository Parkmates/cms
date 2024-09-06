const TransactionModels = require("@/db/models/transaction");

async function GET(req, res) {
  try {
    const userId = req.headers.get("x-id");
    const result = await TransactionModels.getAll(userId);
    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

async function POST(req) {
  try {
    const { spotDetailId } = await req.json();
    // if (!spotId) throw { name: "ParkingSpotNotFound" };

    const userId = req.headers.get("x-id");

    const result = await TransactionModels.createTransaction({
      spotDetailId,
      userId,
    });

    return Response.json({ msg: result });
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
