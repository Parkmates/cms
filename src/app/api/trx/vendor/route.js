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

module.exports = { GET }