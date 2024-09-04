const UserModels = require("@/db/models/user");
const { z } = require("zod");

async function POST(req) {
    try {
        const { name, username, email, password } = await req.json();
        // if (!name) throw { name: "RequiredName" };
        // if (!username) throw { name: "RequiredUsername" };
        // if (!email) throw { name: "RequiredEmail" };
        // if (!password) throw { name: "RequiredPassword" };

        const result = await UserModels.addVendor({ name, username, email, password })
        return Response.json(result)
    } catch (error) {
        console.log(error)
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

module.exports = {
    POST
}