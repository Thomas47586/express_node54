import { acticleService } from "../services/article.services.js";

// Controller có 2 nhiệm vụ nhận và trả dữ liệu
export const articleController = {
  // Phương thức (method) để lấy danh sách bài viết
  async findAll(request, response, next) {
    // Call services => Trả ra kết quả Article - List
    const result = await acticleService.findAll();
    response.json(result);
  },
};
