const UserModels = require("@/db/models/user");
const { z } = require("zod");

async function POST(req) {
  try {
    const userRole = req.headers.get("x-role");
    const { name, username, email, password } = await req.json();
    const result = await UserModels.addVendor({
      name,
      username,
      email,
      password,
      userRole,
    });
    return Response.json(result);
  } catch (error) {
    console.log(error);
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error instanceof z.ZodError) {
      msgError = error.errors[0].path[0] + " " + error.errors[0].message;
      status = 400;
    }
    if (error.name === "unauthorized") {
      status = 403;
    }
    if (error.name === "invalidUsername" || "invalidEmail") {
      status = 400
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
  POST,
};
