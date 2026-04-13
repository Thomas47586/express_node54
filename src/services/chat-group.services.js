import { prisma } from "../common/prisma/connect.prisma.js";
import { buildQueryPrisma } from "../common/helper/build-query-prisma.helper.js";

export const chatGroupService = {
  async create(req) {
    return `This action create`;
  },

  async findAll(request) {
    // QUERY:
    // Thường dùng phân trang, lọc, tìm kiếm

    // sequelize
    // const resultSequelize = await Article.findAll();

    const { page, pageSize, index, where } = buildQueryPrisma(request);

    const resultPrismaPromise = await prisma.chatGroups.findMany({
      where: {
        ChatGroupsMembers: {
          some: {
            userId: request.user.id,
          },
        },
      },
      skip: index, // Skip tương đương OFFSET
      take: pageSize, // Take tương đương với LIMIT
      include: {
        ChatGroupsMembers: {
          include: {
            Users: true,
          },
        },
      },
    });

    const totalItemsPromise = await prisma.chatGroups.count({
      where: where,
    });

    // Chạy đồng thời
    const [resultPrisma, totalItems] = await Promise.all([
      resultPrismaPromise,
      totalItemsPromise,
    ]);

    const totalPage = Math.ceil(totalItems / pageSize);

    // CHỈNH SỬA TẠI ĐÂY ĐỂ KHỚP VỚI FE
    const formattedItems = resultPrisma.map((group) => {
      const { ChatGroupsMembers, ...rest } = group;
      return {
        ...rest,
        ChatGroupMembers: ChatGroupsMembers, // Đổi tên từ có 's' sang không có 's'
      };
    });

    return {
      totalItems: totalItems,
      totalPage: totalPage,
      page: page,
      pageSize: pageSize,
      items: formattedItems,
    };
  },
};
