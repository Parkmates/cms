const UserModels = require("@/db/models/user");

async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email) throw { name: "RequiredEmail" };
    if (!password) throw { name: "RequiredPassword" };

    const result = await UserModels.login({ email, password });

    return Response.json({ access_token: result });
  } catch (error) {
    console.log(error);
    return Response.json(error)
  }
}

module.exports = {
    POST
};
