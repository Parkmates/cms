const TransactionModels = require("@/db/models/transaction");

async function GET() {
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
    const { spotId } = await req.json();
    if (!spotId) throw { name: "ParkingSpotNotFound" };

    const userId = req.headers.get("x-id");

    const result = await TransactionModels.createTransaction({
      spotId,
      userId,
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
