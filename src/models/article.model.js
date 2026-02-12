import { DataTypes } from "sequelize";
import sequelize from "../common/connect.sequelize.js";

const Article = sequelize.define(
  "Article", // Tên cục bổ chỉ sử dụng trong sequelize
  // Mô phỏng lại tất cả các cột - code first
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
    },

    content: {
      type: DataTypes.TEXT,
    },

    imageUrl: {
      type: DataTypes.STRING,
    },

    views: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // Other model options go here
    tableName: "Articles",
    timestamps: false, // Không sử dụng 2 cột createdAt & updatedAt
  },
);

export default Article;
