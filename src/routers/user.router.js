import express from "express";
import { userController } from "../controller/user.controller.js";
import { uploadDiskStorage } from "../common/multer/disk-storage.multer.js";
import { protect } from "../common/middlewares/protect.middleware.js";
import { uploadMemoryStorage } from "../common/multer/memory-storage.multer.js";

const userRouter = express.Router();

// Tạo route CRUD
userRouter.post(
  "/avatar-local",
  protect,
  uploadDiskStorage.single("avatar"),
  userController.avatarLocal,
);

//
userRouter.post(
  "/avatar-cloud",
  protect,
  uploadMemoryStorage.single("avatar"),

  userController.avatarCloud,
);

userRouter.get("", protect, userController.findAll);
userRouter.get("/:id", protect, userController.findOne);

export default userRouter;
