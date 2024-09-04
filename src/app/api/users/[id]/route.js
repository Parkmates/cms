const UserModels = require("@/db/models/user")
const { z } = require("zod")


async function GET(req, res) {
    try {
        const { id } = res.params

        const result = await UserModels.getById(id)
        return Response.json(result)
    } catch (error) {
        console.log(error)
        return Response.json(error)
    }
}

async function PUT(req, res) {
    try {
        const { id } = res.params;
        const { name, username, email } = await req.json();
        // if (!name) throw { name: "RequiredName" };
        // if (!username) throw { name: "RequiredUsername" };
        // if (!email) throw { name: "RequiredEmail" };
        const result = await UserModels.updateUser({
            id,
            name,
            username,
            email
        });

        return Response.json(result)
    } catch (error) {
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

async function DELETE(req, res) {
    try {
        const { id } = res.params;

        const result = await UserModels.deleteUser(id)
        return Response.json(result)
    } catch (error) {
        console.log(error);
        return Response.json(error);
    }
}

module.exports = {
    GET,
    PUT,
    DELETE
}