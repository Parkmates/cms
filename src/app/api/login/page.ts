import { cookies } from "next/headers";
import UserModels from "../../../db/models/user";


export default async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email) throw { name: "EmailRequired" };
    if (!password) throw { name: "PasswordRequired" };

    const result = await UserModels.login({ email, password });

    cookies().set("Authorization", "Bearer " + result);

    return Response.json({ access_token: result})
  } catch (error) {
    console.log(error);
  }
}

