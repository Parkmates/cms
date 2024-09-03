import { comparePass } from "../../helpers/bcrypt";
import { signToken } from "../../helpers/jwt";
import database from "../config/mongodb";


export default class UserModels {
  static async login({ email, password }: {email: string, password: string}) {
    const user = await database.collection("users").findOne({
      email,
    });
    if (!user) throw { name: "UserNotFound" };

    const checkPass = comparePass(password, user.password);
    if (!checkPass) throw { name: "WrongPass" };

    const token = signToken({ id: String(user._id), role: user.role });

    return token;
  }
}
