const ReviewModels = require("@/db/models/review");
const { z } = require("zod");

async function GET(req) {
  try {
    const { spotId } = await req.json();

    const result = await ReviewModels.getAll(spotId);

    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

async function POST(req) {
  try {
    const userId = req.headers.get("x-id")
    const { spotId, rating, comment } = await req.json();
    // if (!rating) throw { name: "RatingRequired" }

    const result = await ReviewModels.createReview({ spotId, rating, comment, userId });
    
    return Response.json({ msg: result});
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
