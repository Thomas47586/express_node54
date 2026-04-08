import { responseError } from "./response.helper.js";
import jwt from "jsonwebtoken";
import { statusCodes } from "./status-code.helper.js";

export const appError = (err, req, res, next) => {
  console.log("Middleware Error", err);

  if (err instanceof jwt.JsonWebTokenError) {
    // Class JsonWebTokenError: bắt tất cả lỗi liên quan đến Token
    err.code = statusCodes.UNAUTHORIZED; //401 FE sẽ logout user
  }

  if (err instanceof jwt.TokenExpiredError) {
    // Class TokenExpiredError: Chỉ bắt lỗi hết hạn Token
    err.code = statusCodes.FORBIDDEN; // 403 FE sẽ gọi API refresh token
  }

  // console.log({
  //   cause: err?.cause,
  //   message: err?.message,
  //   name: err?.name,
  //   code: err?.code,
  // });

  const response = responseError(err?.message, err?.code, err?.stack);

  res.status(response.statusCode).json(response);
};
