import sequelize from "../common/connect.sequelize.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import Article from "../models/article.model.js";
import { buildQueryPrisma } from "../common/helper/build-query-prisma.helper.js";

export const acticleService = {
  // CHỉ return về kết quả, không cần biết là kết quả gì
  async findAll(request) {
    // QUERY:
    // Thường dùng phân trang, lọc, tìm kiếm

    // sequelize
    // const resultSequelize = await Article.findAll();

    const { page, pageSize, index, where } = buildQueryPrisma(request);

    const resultPrismaPromise = await prisma.articles.findMany({
      where: where,
      skip: index, // Skip tương đương OFFSET
      take: pageSize, // Take tương đương với LIMIT
    });

    const totalItemsPromise = await prisma.articles.count({
      where: where,
    });

    // Chạy đồng thời
    const [resultPrisma, totalItems] = await Promise.all([
      resultPrismaPromise,
      totalItemsPromise,
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      totalItems: totalItems,
      totalPages: totalPages,
      page: page,
      pageSize: pageSize,
      items: resultPrisma,
    };
  },

  // Để nhận được body phải thiết lập middleware JSON ở server.js
  // app.use(express.json());
  async create(request) {
    const body = request.body;

    // Prisma gọi đến database là một server riêng nên phải có await để chờ kết quả trả về
    const articleNew = await prisma.articles.create({
      data: {
        title: body.title,
        content: body.content,
        userId: 1, // Tạm thời để userId là 1, sau này sẽ lấy từ token đăng nhập
      },
    });
    return articleNew;
  },

  // UPDATE
  async update(request) {
    const { articleId } = request.params;
    const body = request.body;

    const articleUpdate = await prisma.articles.update({
      where: {
        id: Number(articleId),
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return true;
  },

  // DELETE
  async delete(request) {
    const { articleId } = request.params;

    // Delete thật trong DB không nên dùng
    // await prisma.articles.delete({
    //   where: {
    //     id: articleId,
    //   },
    // });

    await prisma.articles.update({
      where: {
        id: +articleId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBY: 1,
      },
    });

    return true;
  },
};
