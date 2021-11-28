import { PrismaClient } from "@prisma/client";
import { register, userExists } from "../app/utils/session.server";
let db = new PrismaClient();

async function seed() {
  if (await userExists("eugen")) return;
  const user = await register({ username: "eugen", password: "1234" });
  await db.tweet.create({ data: { text: "Hello World", userId: user.id } });
}

seed();
