import { responseSuccess } from "../common/helper/response.helper.js";
import { authService } from "../services/auth.services.js";

export const authController = {
  async register(req, res, next) {
    const result = await authService.register(req);
    const response = responseSuccess(result, `register auth successfully`);
    res.status(response.statusCode).json(response);
  },

  async login(req, res, next) {
    const result = await authService.login(req);

    const response = responseSuccess(true, `Login auths successfully`);

    res.cookie("accessToken", result.accessToken);
    res.cookie("refreshToken", result.refreshToken);

    res.status(response.statusCode).json(response);
  },

  async getInfo(req, res, next) {
    // console.log("getInfo", req.user);

    const result = await authService.getInfo(req);
    const response = responseSuccess(result, `getInfo auth successfully`);
    res.status(response.statusCode).json(response);
  },

  async refreshToken(req, res, next) {
    const result = await authService.refreshToken(req);

    const response = responseSuccess(true, `refreshToken auths successfully`);

    res.cookie("accessToken", result.accessToken);
    res.cookie("refreshToken", result.refreshToken);

    res.status(response.statusCode).json(response);
  },

  async googleCallback(req, res, next) {
    res.cookie("accessToken", req.user.accessToken);
    res.cookie("refreshToken", req.user.refreshToken);

    // Nối vào trang mà FE đã tạo ra
    res.redirect("http://localhost:3000/login-callback");
  },
};
