import express from "express";
import { chatMessagesController } from "../controller/chat-message.controller.js";

const chatMessagesRouter = express.Router();

// Tạo route CRUD
chatMessagesRouter.post("/", chatMessagesController.create);
chatMessagesRouter.get("/", chatMessagesController.findAll);
chatMessagesRouter.get("/:id", chatMessagesController.findOne);
chatMessagesRouter.patch("/:id", chatMessagesController.update);
chatMessagesRouter.delete("/:id", chatMessagesController.remove);

export default chatMessagesRouter;
