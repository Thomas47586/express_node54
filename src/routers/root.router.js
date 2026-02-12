import express from "express";
import articleRouter from "./article.router.js";

// Router gom các module lại với nhau
const rootRouter = express.Router();

// Phân tầng Module bằng đường dẫn
rootRouter.use("/article", articleRouter);

export default rootRouter;
