import { buildQueryPrisma } from "../common/helper/build-query-prisma.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";

export const chatMessagesService = {
  async create(req) {
    return `This action create`;
  },

  async findAll(request) {
    // QUERY:
    // Thường dùng phân trang, lọc, tìm kiếm

    // sequelize
    // const resultSequelize = await Article.findAll();

    const { page, pageSize, index, where } = buildQueryPrisma(request);

    const resultPrismaPromise = await prisma.chatMessages.findMany({
      where: where,
      skip: index, // Skip tương đương OFFSET
      take: pageSize, // Take tương đương với LIMIT
      include: {
        Users: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalItemsPromise = await prisma.chatMessages.count({
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
};
