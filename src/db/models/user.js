const { comparePass } = require("@/helpers/bcrypt")
const database = require("../config/mongodb")
const { signToken } = require("@/helpers/jwt")

class UserModels {
    static async login({email, password}) {
        const user = await database.collection("users").findOne({
            email
        })
        if(!user) throw {name: "UserNotFound"}

        const checkPass = comparePass(password, user.password)
        if(!checkPass) throw {name: "WrongPass"}

        const token = signToken({id: String(user._id), role: user.role})
        return token
    }
}

module.exports = UserModels