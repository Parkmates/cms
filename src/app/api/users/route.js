const UserModels = require("@/db/models/user");

async function GET(req) {
  try {
    const currentUserrole = req.headers.get("x-role");
    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get("role");

    const result = await UserModels.getAll({ currentUserrole, role });
    return Response.json(result);
  } catch (error) {
    console.log(error);
    Response.json(error);
  }
}

module.exports = {
  GET,
};
