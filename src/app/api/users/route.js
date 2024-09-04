const UserModels = require("@/db/models/user")

async function GET(req) {
    try {
        const role = req.headers.get("x-role")
        const result = await UserModels.getAll({role})
        return Response.json(result)
    } catch (error) {
        console.log(error)
        Response.json(error)
    }
}

module.exports = {
    GET
}