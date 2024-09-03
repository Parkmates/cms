const ReviewModels = require("@/db/models/review");

async function GET(req) {
  try {
    const { spotId } = await req.json()
    const result = await ReviewModels.getAll(spotId)
    return Response.json(result)
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = {
    
}
