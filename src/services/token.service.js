import jwt from "jsonwebtoken";
import { BadRequestException } from "../common/helper/exception.helper.js";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../common/constant/app.constant.js";

export const tokenService = {
  // AccessToken
  createAccessToken(userId) {
    if (!userId) {
      throw new BadRequestException("Không có userId để tạo AccessToken");
    }

    // AT = Access Token
    const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return accessToken;
  },

  // RefreshToken
  createRefreshToken(userId) {
    if (!userId) {
      throw new BadRequestException("Không có userId để tạo RefreshToken");
    }

    // RT = Refresh Token
    const refreshToken = jwt.sign({ userId: userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return refreshToken;
  },

  verifyAccessToken(accessToken, option) {
    return jwt.verify(accessToken, ACCESS_TOKEN_SECRET, option);
  },

  verifyRefreshToken(refreshToken, option) {
    const decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, option);
    return decode;
  },
};
