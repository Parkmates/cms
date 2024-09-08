const UserModels = require("@/db/models/user");
const { z } = require("zod");

async function POST(req) {
  try {
    const { email, password } = await req.json();

    const result = await UserModels.login({ email, password });

    return Response.json({ access_token: result });
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error instanceof z.ZodError) {
      msgError = error.errors[0].path[0] + " " + error.errors[0].message;
      status = 400;
    }
    if (error.name === "Invalid Email/Password") {
      status = 400
    }
    if (error.name === "NotFound") {
      status = 404
    }
    // if (error.name === "Unauthorized") {
    //   status = 401
    // }
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
  POST
};
