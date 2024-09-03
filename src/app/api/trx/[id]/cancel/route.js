const TransactionModels = require("@/db/models/transaction");

async function PUT(req, res) {
  try {
    const { id } = res.params;

    const result = await TransactionModels.cancelTransaction(id);
    return Response.json({ msg: result })
} catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = {
    PUT
}
