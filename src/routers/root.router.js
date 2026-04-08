import express from "express";
import articleRouter from "./article.router.js";
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";

// Router gom các module lại với nhau
const rootRouter = express.Router();

// Phân tầng Module bằng đường dẫn
rootRouter.use("/article", articleRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);

export default rootRouter;
