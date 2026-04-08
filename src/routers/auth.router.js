import express from "express";
import { authController } from "../controller/auth.controller.js";
import { protect } from "../common/middlewares/protect.middleware.js";
import passport from "passport";

const authRouter = express.Router();

// Tạo route CRUD
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
// Protect là middleware tự xây thêm
authRouter.get("/get-info", protect, authController.getInfo);
authRouter.post("/refresh-token", authController.refreshToken);

// Google
// Khi người dùng click nút login google sẽ gọi api get bằng thanh url
// passport sẽ được kích hoạt và chuyển người dùng tới trang chọn tài khoản gmail và đồng ý scope mà mình đã yêu cầu
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.googleCallback,
);

export default authRouter;
