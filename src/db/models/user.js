const { comparePass, hashPass } = require("@/helpers/bcrypt");
const database = require("../config/mongodb");
const { signToken } = require("@/helpers/jwt");
const { ObjectId } = require("mongodb");
const { cookies } = require("next/headers");
const { z } = require("zod");

class UserModels {
  static async login({ email, password }) {
    const validation = z
      .object({
        email: z.string().min(1, "is required").email({ message: "invalid" }),
        password: z
          .string()
          .min(5, { message: "Must be 5 or more characters long" }),
      })
      .safeParse({ email, password });
    if (!validation.success) throw validation.error;
    const user = await database.collection("users").findOne({
      email,
    });
    if (!user) {
      let error = new Error();
      error.message = "User Not Found";
      error.name = "NotFound";
      throw error;
    }

    const checkPass = comparePass(password, user.password);
    if (!checkPass) {
      let error = new Error();
      error.message = "Invalid Email/Password";
      error.name = "Invalid Email/Password";
      throw error;
    }

    const token = signToken({ id: String(user._id), role: user.role });
    cookies().set("Authorization", "Bearer " + token);

    return token;
  }

  static async register({ name, username, email, password }) {
    const validation = z
      .object({
        username: z.string().min(1, "is required"),
        email: z.string().min(1, "is required").email({ message: "invalid" }),
        password: z
          .string()
          .min(5, { message: "Must be 5 or more characters long" }),
      })
      .safeParse({ name, username, email, password });
    if (!validation.success) throw validation.error;

    // ? cek di db email udah ada atau belum
    const existsEmail = await this.findByEmail(email);
    if (existsEmail) {
      let error = new Error();
      error.message = "Email already exists";
      error.name = "invalidEmail";
      throw error;
    }
    // ? cek di db username udah ada atau belum
    const existsUsername = await this.findByUsername(username);
    if (existsUsername) {
      let error = new Error();
      error.message = "Username already exists";
      error.name = "invalidUsername";
      throw error;
    }

    const user = await database.collection("users").insertOne({
      name,
      username,
      email,
      role: "user",
      password: hashPass(password),
    });

    return { user: "success create user" };
  }

  static async addVendor({ name, username, email, password, userRole }) {
    if (userRole !== "admin") {
      let error = new Error();
      error.message = "Unauthorized";
      error.name = "unauthorized";
      throw error;
    }
    const validation = z
      .object({
        name: z.string().min(1, "is required"),
        username: z.string().min(1, "is required"),
        email: z.string().min(1, "is required").email({ message: "invalid" }),
        password: z
          .string()
          .min(5, { message: "Must be 5 or more characters long" }),
      })
      .safeParse({ name, username, email, password });
    if (!validation.success) throw validation.error;
    const user = await database.collection("users").insertOne({
      name,
      username,
      email,
      role: "vendor",
      password: hashPass(password),
    });

    return { user: "success create vendor" };
  }

  static async getAll({ currentUserrole, role }) {
    if (currentUserrole !== "admin") {
      let error = new Error();
      error.message = "Unauthorized";
      error.name = "unauthorized";
      throw error;
    }
    const agg = [
      {
        $project: {
          password: 0,
        },
      },
    ];

    if (role) {
      agg.push({
        $match: {
          role: role,
        },
      });
    }

    const user = database.collection("users");
    const cursor = user.aggregate(agg);
    const result = await cursor.toArray();
    return result;
  }

  static async getById(id) {
    const agg = [
      {
        $match: { _id: new ObjectId(String(id)) },
      },
      {
        $project: {
          password: 0,
        },
      },
    ];

    const cursor = database.collection("users").aggregate(agg);
    const result = await cursor.toArray();

    if (result.length === 0) {
      let error = new Error();
      error.message = "User Not Found";
      error.name = "NotFound";
      throw error;
    }

    return result[0];
  }

  static async findByEmail(email) {
    const collection = database.collection("users");
    const selectedUser = await collection.findOne({ email });
    return selectedUser;
  }

  static async findByUsername(username) {
    const collection = database.collection("users");
    const selectedUser = await collection.findOne({ username });
    return selectedUser;
  }

  static async updateUser({ id, name, username, email }) {
    const validation = z
      .object({
        name: z.string().min(1, "is required"),
        username: z.string().min(1, "is required"),
        email: z.string().min(1, "is required").email({ message: "invalid" }),
      })
      .safeParse({ name, username, email });
    if (!validation.success) throw validation.error;
    const result = await database.collection("users").updateOne(
      {
        _id: new ObjectId(String(id)),
      },
      { $set: { name, username, email } }
    );
    return { result: "Success update" };
  }

  static async deleteUser({ id, role }) {
    if (role !== "admin") throw { name: "Unauthorized" };
    const result = await database.collection("users").deleteOne({
      _id: new ObjectId(String(id)),
    });
    return { result: "Success delete" };
  }
}

module.exports = UserModels;
