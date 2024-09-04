const TransactionModels = require("@/db/models/transaction");

async function PUT(req, res) {
  try {
    const { id } = res.params;

    const result = await TransactionModels.checkOutTransaction(id);
    return Response.json({ msg: result })
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error.name === "CheckoutFailed") {
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
  PUT
}
