const UserModels = require("@/db/models/user");
const { z } = require("zod");

async function GET(req, res) {
  try {
    const userId = req.headers.get("x-id");
    const result = await UserModels.getUserProfile(userId);
    return Response.json(result);
  } catch (error) {
    console.log(error);
    let msgError = error.message || "Internal server error";
    let status = 500;

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

module.exports = { GET };
