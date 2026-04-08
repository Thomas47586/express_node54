import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client.ts";
import { DATABASE_URL } from "../constant/app.constant.js";

const url = new URL(DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.substring(1), // Loại bỏ dấu "/" ở đầu chuỗi
  port: url.port, // code mẫu không có sẵn port, LƯU Ý PHẢI THÊM PORT
  connectionLimit: 5,
});
const prisma = new PrismaClient({
  adapter,
  omit: { users: { password: true } },
});

try {
  await prisma.$queryRaw`SELECT 1+1 AS result`;
  // console.log("✅ [PRISMA]Connection has been established successfully.");
} catch (error) {
  // console.error("❌ [PRISMA]Unable to connect to the database:", error);
}

export { prisma };
