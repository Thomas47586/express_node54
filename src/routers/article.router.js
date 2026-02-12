import express from "express";
import { articleController } from "../controller/article.controller.js";

const articleRouter = express.Router();

// Endpoint API đặt ở đây
// "" rỗng là không cần nối => ra list luôn
articleRouter.get("", articleController.findAll);

export default articleRouter;
