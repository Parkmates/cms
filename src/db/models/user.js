const { comparePass, hashPass } = require("@/helpers/bcrypt")
const database = require("../config/mongodb")
const { signToken } = require("@/helpers/jwt")

class UserModels {
    static async login({ email, password }) {
        const user = await database.collection("users").findOne({
            email
        })
        if (!user) throw { name: "UserNotFound" }

        const checkPass = comparePass(password, user.password)
        if (!checkPass) throw { name: "WrongPass" }

        const token = signToken({ id: String(user._id), role: user.role })
        return token
    }

    static async register({ name, username, email, password }) {
        const user = await database.collection("users").insertOne({
            name,
            username,
            email,
            role: "user",
            password: hashPass(password),
        });
        return user
    }

    static async getAll() {
        const user = await database
            .collection("users")
            .find()
            .toArray();
        return user;
    }
}

module.exports = UserModels