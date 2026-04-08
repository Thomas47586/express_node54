import { DataTypes, Sequelize } from "sequelize";
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
      defaultValue: 0,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "id",
        model: "Users", // Phải trùng với tên table trong database, không phải tên model trong sequelize
      },
    },

    deletedBy: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    isDeleted: {
      type: DataTypes.BOOLEAN, // tiny (1): chỉ chứa đúng 2 giá trị 0 hoặc 1
      defaultValue: 0, // 0: false, 1: true
    },

    deletedAt: {
      type: "TIMESTAMP",
      defaultValue: null,
      allowNull: true,
    },

    createdAt: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Mặc định sẽ lấy thời gian hiện tại khi tạo mới bản ghi
    },

    updatedAt: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      ), // Mặc định sẽ lấy thời gian hiện tại khi tạo mới bản ghi, và tự động cập nhật thời gian khi có bất kỳ thay đổi nào xảy ra với bản ghi
    },
  },
  {
    // Other model options go here
    tableName: "Articles",
    timestamps: false, // Không sử dụng 2 cột createdAt & updatedAt
  },
);

// CODE FIRST: Code trước rồi đẩy vào database
// Database FIRST: Database đã có sẵn rồi mới code => Thích cái này hơn
await Article.sync();

export default Article;
