const ReviewModels = require("@/db/models/review");

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
    const { spotId, rating, comment } = await req.json();
    if(!rating) throw { name: "RatingRequired"}

    const result = await ReviewModels.createReview({ spotId, rating, comment });
    
    return Response.json({ msg: result});
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = {
  GET,
  POST,
};
