import { createServer } from "http";
import { Server } from "socket.io";
import { tokenService } from "../../services/token.service.js";
import { prisma } from "../../common/prisma/connect.prisma.js"; // prisma

export const initSocket = (app) => {
  // SOCKET
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    /* options */
  });

  io.on("connection", (socket) => {
    console.log("socket", socket.id);

    // Socket này chỉ dành cho khi chưa có ChatGroup
    // Trạng thái ban đầu, mà user muốn nhắn tin với một người mới hoàn toàn
    // Hỗ trợ tạo chatGroup
    // FE bắn lên sự kiện CREATE ROOM
    socket.on("CREATE_ROOM", async (data, cb) => {
      try {
        const { targetUserIds, accessToken, name } = data;

        const { userId } = tokenService.verifyAccessToken(accessToken);
        const userExits = await prisma.users.findUnique({
          where: {
            id: userId,
          },
        });

        if (!userExits) {
          throw new Error("User not found");
        }

        const setTargetUserIdsUnique = new Set([
          ...targetUserIds,
          userExits.id,
        ]);
        const targetUserIdsUnique = Array.from(setTargetUserIdsUnique);

        if (targetUserIdsUnique.length === 2) {
          // Chat 1-1
          // chatGroup đã tồn tại hay chưa?
          let chatGroup = await prisma.chatGroups.findFirst({
            where: {
              ChatGroupsMembers: {
                // Every: Tất cả bản ghi liên quan đều phải thoả điều kiện
                // None: Không có bản ghi nào thoả điều kiện
                // Some: có ít nhất một bản ghi thoả điều kiện
                every: {
                  userId: {
                    in: targetUserIdsUnique,
                  },
                },
              },
            },
          });

          // Nếu chưa tồn tại => tạo mới
          if (!chatGroup) {
            chatGroup = await prisma.chatGroups.create({
              data: {
                ownerId: userExits.id,
              },
            });

            const memberResult = await prisma.chatGroupsMembers.createMany({
              data: [
                { userId: targetUserIdsUnique[0], chatGroupId: chatGroup.id },
                { userId: targetUserIdsUnique[1], chatGroupId: chatGroup.id },
              ],
            });
            console.log("7. Kết quả tạo Members:", memberResult); // Log 7
          }
          // Nếu đã tồn tại => đi tiếp
          socket.join(`chat:${chatGroup.id}`);

          cb({
            status: "success",
            message: "Join room success",
            data: {
              chatGroupId: chatGroup.id,
            },
          });

          // Check join
          console.log("room", io.sockets.adapter.rooms);
          console.log("CREATE_ROOM", {
            targetUserIds,
            accessToken,
            targetUserIdsUnique,
            userId,
            chatGroup,
          });
        } else {
          // Chat nhóm
          const chatGroup = await prisma.chatGroups.create({
            data: {
              name: name,
              ownerId: userExits.id,
            },
          });

          await prisma.chatGroupsMembers.createMany({
            data: targetUserIdsUnique.map((userId) => {
              return {
                userId: userId,
                chatGroupId: chatGroup.id,
              };
            }),
          });

          socket.join(`chat:${chatGroup.id}`);

          cb({
            status: "success",
            message: "create room success",
            data: {
              chatGroupId: chatGroup.id,
            },
          });
        }
      } catch (error) {
        // Catch đã bao phủ toàn bộ logic phía trên
        cb({
          status: "error",
          data: null,
          message: error.message || "Something went wrong",
        });
      }
    });

    // Khi đã có ChatGroup rồi
    // User click vào một ChatGroup (1box chat)
    socket.on("JOIN_ROOM", async (data, cb) => {
      const { chatGroupId, accessToken } = data;

      const { userId } = tokenService.verifyAccessToken(accessToken);
      const userExits = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });

      if (!userExits) {
        throw new Error("User not found");
      }
      socket.join(`chat:${chatGroupId}`);
      console.log("Tất cả các room", io.sockets.adapter.rooms);

      console.log("JOIN_ROOM", { chatGroupId, accessToken });
    });

    // Người dùng nhắn tin lên
    socket.on("SEND_MESSAGE", async (data, cb) => {
      const { chatGroupId, accessToken, message } = data;

      const { userId } = tokenService.verifyAccessToken(accessToken);

      // Muốn chat nhanh tốc độ thì tối ưu await của prisma.users.findUnique
      // 1. Lưu thông tin user vào Cache Redis 5s => Chủ yếu để giảm số lần query vào DB. Vì khi query vào DB sẽ tốn thời gian
      const userExits = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });

      if (!userExits) {
        throw new Error("User not found");
      }

      const createdAt = new Date().toISOString();

      // Cần phải chạy nhanh nhất có thể
      io.to(`chat:${chatGroupId}`).emit("SEND_MESSAGE", {
        messageText: message,
        userIdSender: userExits.id,
        chatGroupId: chatGroupId,
        createdAt: createdAt,
      });

      // Để sau io.to => Để đạtt ốc độ tốt nhất
      await prisma.chatMessages.create({
        data: {
          chatGroupId: chatGroupId,
          messageText: message,
          userIdSender: userExits.id,
          createdAt: createdAt,
        },
      });

      console.log("SEND_MESSAGE", { chatGroupId, accessToken, message });
    });

    // --------------
  });

  return httpServer;
};
