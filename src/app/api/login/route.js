const UserModels = require("@/db/models/user");
const { cookies } = require("next/headers");

async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email) throw { name: "RequiredEmail" };
    if (!password) throw { name: "RequiredPassword" };

    const result = await UserModels.login({ email, password });

    cookies().set("Authorization", "Bearer " + result);
    return Response.json({ access_token: result });
  } catch (error) {
    console.log(error);
    return Response.json(error)
  }
}

module.exports = {
    POST
};
