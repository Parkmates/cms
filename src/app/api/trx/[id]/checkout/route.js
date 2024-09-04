const TransactionModels = require("@/db/models/transaction");

async function PUT(req, res) {
  try {
    const { id } = res.params;
    const userId = req.headers.get("x-id")

    const result = await TransactionModels.checkOutTransaction({id, userId});
    return Response.json({ msg: result })
} catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = {
    PUT
}
