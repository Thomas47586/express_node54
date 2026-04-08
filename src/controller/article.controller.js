import { responseSuccess } from "../common/helper/response.helper.js";
import { acticleService } from "../services/article.services.js";
import { statusCodes } from "../common/helper/status-code.helper.js";

// Controller có 2 nhiệm vụ nhận và trả dữ liệu
export const articleController = {
  // Phương thức (method) để lấy danh sách bài viết
  async findAll(request, res, next) {
    // console.log("articleController", request.payload);

    // Call services => Trả ra kết quả Article - List
    const result = await acticleService.findAll(request);
    const response = responseSuccess(
      result,
      "Lấy danh sách Article thành công",
    );
    res.status(response.statusCode).json(response);
  },

  // Phương thức (method) để tạo bài viết mới
  async create(request, res, next) {
    // Call services => Trả ra kết quả Article - Object
    const result = await acticleService.create(request);
    const response = responseSuccess(
      result,
      "Tạo Article thành công",
      statusCodes.CREATED,
    );
    res.status(response.statusCode).json(response);
  },

  // Phương thức update
  async update(request, res, next) {
    // Call services => Trả ra kết quả Article - Object
    const result = await acticleService.update(request);
    const response = responseSuccess(
      result,
      "Cập nhật Article thành công",
      statusCodes.UPDATED,
    );
    res.status(response.statusCode).json(response);
  },

  // Phương thức delete
  async delete(request, res, next) {
    // Call services => Trả ra kết quả Article - Object
    const result = await acticleService.delete(request);
    const response = responseSuccess(
      result,
      "Xoá Article thành công",
      statusCodes.DELETED,
    );
    res.status(response.statusCode).json(response);
  },
};
