const UserModels = require("@/db/models/user");
const { z, ZodError } = require("zod");

async function POST(req) {
    try {
        const { name, username, email, password } = await req.json();
        const result = await UserModels.register({ name, username, email, password })
        return Response.json(result)
    } catch (error) {
        // console.log(error)
        let msgError = error.message || "Internal server error";
        let status = 500;

        if (error instanceof z.ZodError) {
            msgError = error.errors[0].path[0] + " " + error.errors[0].message;
            status = 400;
        }
        if (error.name === "invalidUsername" ||  "invalidEmail") {
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
    POST
}