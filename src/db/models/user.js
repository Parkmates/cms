const { comparePass, hashPass } = require("@/helpers/bcrypt")
const database = require("../config/mongodb")
const { signToken } = require("@/helpers/jwt")
const { ObjectId } = require("mongodb")

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
        return { user: "success create user"}
    }

    static async getAll() {
        const agg = [
            {
                '$project': {
                    'password': 0
                }
            }
        ]

        const user = database.collection("users");
        const cursor = user.aggregate(agg);
        const result = await cursor.toArray();
        return result;
    }

    static async getById(id) {
        const agg = [
            {
                '$match': { _id: new ObjectId(String(id)) }
            },
            {
                '$project': {
                    'password': 0
                }
            }
        ];
    
        const cursor = database.collection("users").aggregate(agg);
        const result = await cursor.toArray();
    
        if (result.length === 0) {
            throw { name: "UserNotFound" };
        }
    
        return result[0];
    }
}

module.exports = UserModels