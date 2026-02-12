import express from "express";
import rootRouter from "./src/routers/root.router.js";

const app = express();

// Tạo API
// request là object chứa thông tin request từ frontEnd gửi lên
// response là object chứa thông tin từ backEnd trả ngược lại
// Next là hàm để chuyển sang middleware tiếp theo (nếu có)
app.get("", (request, response, next) => {
  response.json("hello world");
});

// Get Router
// Gọi user => bắt toàn bộ API
// rootRouter là 1 callback function
// app/api/auth/login | register
app.use("/api", rootRouter);

//  Hàm Listen online 1 cổng
// Ở đây mình sử dụng cổng 3000
// Callback chỉ chạy khi backend online thành công => listen thành công
// Nên để listen ở cuối file
const PORT = 3069;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
