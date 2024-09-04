const { comparePass, hashPass } = require("@/helpers/bcrypt")
const database = require("../config/mongodb")
const { signToken } = require("@/helpers/jwt")
const { ObjectId } = require("mongodb")
const { cookies } = require("next/headers")

class UserModels {
    static async login({ email, password }) {
        const user = await database.collection("users").findOne({
            email
        })
        if (!user) throw { name: "UserNotFound" }

        const checkPass = comparePass(password, user.password)
        if (!checkPass) throw { name: "WrongPass" }

        const token = signToken({ id: String(user._id), role: user.role })
        cookies().set("Authorization", "Bearer " + token);

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
        
        return { user: "success create user" }
    }

    static async addVendor({ name, username, email, password, userRole }) {
        if(userRole !== "admin") throw { name: "Unauthorized" }
        const user = await database.collection("users").insertOne({
            name,
            username,
            email,
            role: "vendor",
            password: hashPass(password),
        });
        
        return { user: "success create vendor" }
    }

    static async getAll({role}) {
        if(role !== "admin") throw { name: "Unauthorized" }
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

    static async updateUser({
        id,
        name,
        username,
        email
    }) {
        const result = await database.collection("users").updateOne(
            {
                _id: new ObjectId(String(id)),
            },
            { $set: { name, username, email } }
        );
        return { result: "Success update" };
    }

    static async deleteUser({id, role}) {
        if (role !== "admin") throw { name: "Unauthorized" }
        const result = await database.collection("users").deleteOne(
            {
                _id: new ObjectId(String(id)),
            }
        )
        return { result: "Success delete" };
    }
}

module.exports = UserModels