const ReviewModels = require("@/db/models/review");
const { z } = require("zod");

async function GET(req) {
  try {
    const { spotId } = await req.json();

    const result = await ReviewModels.getAll(spotId);

    return Response.json(result);
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;
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
    const userId = req.headers.get("x-id")
    const { spotId, rating, comment } = await req.json();

    const result = await ReviewModels.createReview({ spotId, rating, comment, userId });

    return Response.json({ msg: result });
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;
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
