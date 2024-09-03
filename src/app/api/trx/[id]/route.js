const TransactionModels = require("@/db/models/transaction");

async function GET(req, res) {
  try {
    const { id } = res.params
    
    const result = await TransactionModels.getById(id)
    
    return Response.json(result)
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

module.exports = {
    GET
}
