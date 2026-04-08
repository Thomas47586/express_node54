import { BadRequestException } from "../common/helper/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import bcrypt from "bcrypt";
import { tokenService } from "./token.service.js";

export const authService = {
  async register(req) {
    const { email, password, fullName } = req.body;
    console.log({ email, password, fullName });

    const userExits = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (userExits) {
      throw new BadRequestException("Người dùng đã tồn tại");
    }

    // HASH: Băm
    // Không thể dịch ngược => Chỉ có thể so sánh
    // Hacker dùng brute-fore để mò password
    // Sử dụng thư viện bcrypt

    const passwordHash = bcrypt.hashSync(password, 10);

    // ENCRYPT: Mã hoá
    // Dịch ngược

    const userNew = await prisma.users.create({
      data: {
        email: email,
        password: passwordHash,
        fullName: fullName,
      },
    });

    console.log({ email, password, fullName, userExits, userNew });

    return true;
  },

  async login(req) {
    const { email, password } = req.body;

    // Kiểm tra email xem tồn tại chưa
    // Nếu chưa tồn tại => Từ chối kêu người dùng đăng ký
    // Nếu mà tồn tại => đi xử lý tiếp
    const userExits = await prisma.users.findUnique({
      where: {
        email: email,
      },
      omit: { password: false },
    });

    if (!userExits) {
      //   throw new BadRequestException("Account Invalid");
      throw new BadRequestException(
        "Người dùng chưa tồn tại, vui lòng đăng ký",
      );
    }

    userExits;
    const isPassword = bcrypt.compareSync(password, userExits.password);

    if (!isPassword) {
      // throw new BadRequestException("Account Invalid.");
      throw new BadRequestException("Mật khẩu không đúng");
    }

    const accessToken = tokenService.createAccessToken(userExits.id);
    const refreshToken = tokenService.createRefreshToken(userExits.id);

    // console.log({ email, password, userExits, isPassword });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },

  // Data user có trong Protect ở Middleware
  async getInfo(req) {
    // console.log("getInfo service", req.user);

    return req.user;
  },

  // Khi FE gọi accessToken đang bị hết hạn
  async refreshToken(req) {
    // TOKEN đã xử lý ở middleware Protect
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken) {
      throw new BadRequestException("Access token not found");
    }

    if (!refreshToken) {
      throw new BadRequestException("Refresh token not found");
    }

    // ignoreExpiration => khong kiem tra het han vì accessToken đang bị hết hạn FE đang muốn làm mới
    // Cho nên không được kiểm tra hạn của accessToken
    const decodeAccessToken = tokenService.verifyAccessToken(accessToken, {
      ignoreExpiration: true,
    });
    const decodeRefreshToken = tokenService.verifyRefreshToken(refreshToken);

    if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
      throw new BadRequestException("Token invalid..");
    }

    const userExits = await prisma.users.findUnique({
      where: {
        id: decodeAccessToken.userId,
      },
    });

    const accessTokenNew = tokenService.createAccessToken(userExits.id);
    const refreshTokenNew = tokenService.createRefreshToken(userExits.id);

    // Trường hợp 1: Trả về cả cặp 2 token (rotate)
    // RefreshToken luôn được làm mới: Tự động gia hạn thời gian Login
    // Nếu trong 1 ngày , người dùng không sử dụng => Refresh Token không được gia hạn => Logout

    // Trường hợp 2: Trả về 1 access token
    // RefreshTOken sẽ không được gia hạn
    // Đúng 1 ngày người dùng sẽ luôn phải login lại
    // Nếu trong 1 ngày, người dùng sử dụng => Refresh Token được gia hạn => Duy trì đăng nhập

    // console.log({
    //   accessToken,
    //   refreshToken,
    //   decodeAccessToken,
    //   decodeRefreshToken,
    //   userExits,
    // });

    return {
      accessToken: accessTokenNew,
      refreshToken: refreshTokenNew,
    };
  },
};
