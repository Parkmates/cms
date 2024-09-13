const UserModels = require("@/db/models/user");
const { z } = require("zod");

async function GET(req) {
  try {
    const currentUserrole = req.headers.get("x-role");
    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get("role");

    const result = await UserModels.getAll({ currentUserrole, role });
    return Response.json(result);
  } catch (error) {
    let msgError = error.message || "Internal server error";
    let status = 500;

    if (error.name === "unauthorized") {
      status = 403;
    }
    if (error.name === "invalidUsername" || "invalidEmail") {
      status = 400
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
};
