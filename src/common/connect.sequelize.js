import "dotenv/config";
import { Sequelize } from "sequelize";
import { DATABASE_URL } from "./constant/app.constant.js";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "mysql",
});

try {
  await sequelize.authenticate();
  // console.log("✅ [SEQUELIZE]Connection has been established successfully.");
} catch (error) {
  // console.error("❌ [SEQUELIZE]Unable to connect to the database:", error);
}

export default sequelize;
