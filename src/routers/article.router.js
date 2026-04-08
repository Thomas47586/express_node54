import express from "express";
import { articleController } from "../controller/article.controller.js";
import { responseSuccess } from "../common/helper/response.helper.js";
import {
  BadRequestException,
  NotFoundException,
} from "../common/helper/exception.helper.js";

const articleRouter = express.Router();

// READ
// --- Endpoint API đặt ở đây ---
// Endpoint API đặt ở đây
// "" rỗng là không cần nối => ra list luôn
articleRouter.get(
  "",
  (req, res, next) => {
    console.log("Middleware 1");

    const payload = "dữ liệu của mid 1";

    // req là một object khi chấm đến key nếu có thì ghi đè, nếu không có thì tạo mới
    req.payload = payload;

    if (false) {
      const response = responseSuccess(
        null,
        "Người dùng không có quyền truy cập",
      );
      res.status(response.statusCode).json(response);
    } else {
      next();
    }
  },

  (req, res, next) => {
    console.log("Middleware 2");
    console.log("Payload của mid 1: ", req.payload);

    // throw new NotFoundException("Pass không tìm thấy");

    next();
  },

  (req, res, next) => {
    console.log("Middleware 3");
    console.log("Payload của mid 1: ", req.payload);
    next();
  },

  articleController.findAll,
);

// CREATE
articleRouter.post("/", articleController.create);
// UPDATE (Patch / Put)
articleRouter.put("/:articleId", articleController.update);
// DELETE
articleRouter.delete("/:articleId", articleController.delete);

export default articleRouter;
