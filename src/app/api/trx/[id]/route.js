const TransactionModels = require("@/db/models/transaction");

async function GET(req, res) {
  try {
    const { id } = res.params;
    const userId = req.headers.get("x-id");

    const result = await TransactionModels.getById({ id, userId });

    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = {
  GET,
};
