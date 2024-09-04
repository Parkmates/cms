const UserModels = require("@/db/models/user");

async function POST(req) {
    try {
        const { name, username, email, password } = await req.json();
        if (!name) throw { name: "RequiredName" };
        if (!username) throw { name: "RequiredUsername" };
        if (!email) throw { name: "RequiredEmail" };
        if (!password) throw { name: "RequiredPassword" };

        const result = await UserModels.addVendor({ name, username, email, password, role })
        return Response.json(result)
    } catch (error) {
        console.log(error);
        return Response.json(error)
    }
}

module.exports = {
    POST
}