const TransactionModels = require("@/db/models/transaction");

async function GET(req, res) {
  try {
    const { id } = res.params;
    const userId = req.headers.get("x-id");

    const result = await TransactionModels.getById({ id, userId });

    return Response.json(result);
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error.name === "NotFound") {
      status = 404;
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
};
