const TransactionModels = require("@/db/models/transaction");

async function GET(req, res) {
  try {
    const role = req.headers.get("x-role");
    const userId = req.headers.get("x-id");
    const result = await TransactionModels.getHistoryForVendor({
      role,
      userId,
    });

    return Response.json(result)
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = { GET }