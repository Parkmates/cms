const TransactionModels = require("@/db/models/transaction");
const { z } = require("zod");

async function GET(req, res) {
  try {
    const userId = req.headers.get("x-id");
    const result = await TransactionModels.getAll(userId);
    return Response.json(result);
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error instanceof z.ZodError) {
      msgError = error.errors[0].path[0] + " " + error.errors[0].message;
      status = 400;
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

async function POST(req) {
  try {
    const { spotDetailId } = await req.json();

    const userId = req.headers.get("x-id");

    const result = await TransactionModels.createTransaction({
      spotDetailId,
      userId,
    });

    return Response.json({ msg: result });
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error.name === "AlreadyBookSpot" || "FullBooked") {
      status = 409;
    }
    if (error.name === "NotFound") {
      status = 404;
    }
    if (error instanceof z.ZodError) {
      msgError = error.errors[0].path[0] + " " + error.errors[0].message;
      status = 400;
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
  POST,
};
