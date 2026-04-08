import { tokenService } from "../../services/token.service.js";
import { UnauthorizedException } from "../helper/exception.helper.js";
import { prisma } from "../prisma/connect.prisma.js";

export const protect = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    // UnauthorizedException báo lỗi 401 và logout luôn
    throw new UnauthorizedException("Access token not found");
  }

  // Kiểm tra Token xem hợp lý chưa
  const decode = tokenService.verifyAccessToken(accessToken);

  // Kiểm tra người dùng có trong db không
  const userExits = await prisma.users.findUnique({
    where: {
      id: decode.userId,
    },
  });

  // Nếu access token hợp lý không có thì thông báo User Not found
  if (!userExits) {
    throw new UnauthorizedException("User not found");
  }

  req.user = userExits;
  //   console.log({ accessToken, decode });
  next();
};
