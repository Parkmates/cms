const UserModels = require("@/db/models/user")

async function GET() {
    try {
        const result = await UserModels.getAll()
        return Response.json(result)
    } catch (error) {
        console.log(error)
        Response.json(error)
    }
}

module.exports = {
    GET
}