// FE đã sử dụng format rồi thì
// Không nên thay đổi key
// Không nên xoá key
// CHỉ nên thêm key

// Nếu làm sẽ bị trắng FE => BE phải chịu trách nhiệm
import { statusCodes } from "./status-code.helper.js";

export const responseSuccess = (
  data,
  message = "OK",
  statusCode = statusCodes.OK,
) => {
  return {
    status: "success",
    statusCode: statusCode,
    message: message,
    data: data,
    doc: "swagger.com",
  };
};

export const responseError = (
  message = "Lỗi không xác định",
  statusCode = statusCodes.INTERNAL_SERVER_ERROR,
  stack,
) => {
  return {
    status: "error",
    statusCode: statusCode,
    message: message,
    stack: stack, // Lỗi này chỉ có ở môi trường dev, khi deploy lên prod thì sẽ không có stack nữa
    data: null,
    doc: "swagger.com",
  };
};
