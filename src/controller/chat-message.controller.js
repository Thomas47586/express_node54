import { responseSuccess } from "../common/helper/response.helper.js";
import { chatMessagesService } from "../services/chat-message.services.js";

export const chatMessagesController = {
  async create(req, res, next) {
    const result = await chatMessagesService.create(req);
    const response = responseSuccess(
      result,
      `Create chatMessages successfully`,
    );
    res.status(response.statusCode).json(response);
  },

  async findAll(req, res, next) {
    const result = await chatMessagesService.findAll(req);
    const response = responseSuccess(
      result,
      `Get all chatMessagess successfully`,
    );
    res.status(response.statusCode).json(response);
  },

  async findOne(req, res, next) {
    const result = await chatMessagesService.findOne(req);
    const response = responseSuccess(
      result,
      `Get chatMessages #${req.params.id} successfully`,
    );
    res.status(response.statusCode).json(response);
  },

  async update(req, res, next) {
    const result = await chatMessagesService.update(req);
    const response = responseSuccess(
      result,
      `Update chatMessages #${req.params.id} successfully`,
    );
    res.status(response.statusCode).json(response);
  },

  async remove(req, res, next) {
    const result = await chatMessagesService.remove(req);
    const response = responseSuccess(
      result,
      `Remove chatMessages #${req.params.id} successfully`,
    );
    res.status(response.statusCode).json(response);
  },
};
