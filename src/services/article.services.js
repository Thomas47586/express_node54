import sequelize from "../common/connect.sequelize.js";
import Article from "../models/article.model.js";

export const acticleService = {
  // CHỉ return về kết quả, không cần biết là kết quả gì
  async findAll() {
    // sequelize
    const resultSequelize = await Article.findAll();
    return resultSequelize;
  },
};
