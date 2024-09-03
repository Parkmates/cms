const UserModels = require("@/db/models/user")
const { ObjectId } = require("mongodb")


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
        if (!name) throw { name: "RequiredName" };
        if (!username) throw { name: "RequiredUsername" };
        if (!email) throw { name: "RequiredEmail" };

        const result = await UserModels.updateUser({
            id,
            name,
            username,
            email
        });

        return Response.json(result)
    } catch (error) {
        console.log(error);
        return Response.json(error);
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