// Extend Error: Kế thừa lại từ class Error có sẵn của JS
import { statusCodes } from "./status-code.helper.js";

// Custom Exception: Tạo ra một class lỗi riêng để có thể phân biệt được lỗi nào là lỗi do mình tạo ra, lỗi nào là lỗi hệ thống
// Cái này dùng cho Error

// 400
export class BadRequestException extends Error {
  code = statusCodes.BAD_REQUEST;
  name = "BadRequestException";
  constructor(message = "BadRequestException") {
    // Gọi constructor của class Error để kế thừa message, name, stack
    super(message);
  }
}

// 401: quy định với FE là khi gặp thì logout
// 40001: lỗi do FE gửi lên QUY ĐỊNH RIÊNG
export class UnauthorizedException extends Error {
  code = statusCodes.UNAUTHORIZED;
  name = "UnauthorizedException";
  constructor(message = "UnauthorizedException") {
    // Gọi constructor của class Error để kế thừa message, name, stack
    super(message);
  }
}

// 403: quy định với FE là khi gặp thì không cho truy cập vào tài nguyên đó nữa
export class ForbiddenException extends Error {
  code = statusCodes.FORBIDDEN;
  name = "ForbiddenException";
  constructor(message = "ForbiddenException") {
    // Gọi constructor của class Error để kế thừa message, name, stack
    super(message);
  }
}

// 404: quy định với FE là khi gặp thì refresh token
export class NotFoundException extends Error {
  code = statusCodes.NOT_FOUND;
  name = "NotFoundException";
  constructor(message = "NotFoundException") {
    // Gọi constructor của class Error để kế thừa message, name, stack
    super(message);
  }
}
