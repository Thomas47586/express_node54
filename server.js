import express from "express";
import rootRouter from "./src/routers/root.router.js";
import { appError } from "./src/common/helper/app-error.helper.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logApi } from "./src/common/middlewares/log-api.middleware.js";
import { initLoginGooglePassport } from "./src/common/passport/login-google.passport.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./src/common/swagger/init.swagger.js";
import { initSocket } from "./src/common/socket/init.socket.js";

const app = express();

// XỬ LÝ CORS bằng cơm
// app.use((req, res, next) => {

//   res.setHeader(
//     "access-control-allow-methods",
//     "GET, HEAD, POST, PUT, DELETE, PATCH",
//   );
//   res.setHeader("access-control-allow-headers", "content-type");
//   res.setHeader("access-control-allow-origin", "*");

//   next();
// });

app.use(cors({ origin: ["http://localhost:3000", "google.com"] }));

// Tạo API
// request là object chứa thông tin request từ frontEnd gửi lên
// response là object chứa thông tin từ backEnd trả ngược lại
// Next là hàm để chuyển sang middleware tiếp theo (nếu có)

// Middleware xử lý dữ liệu đầu vào (body) từ request gửi lên JSON
// Để lấy được body phải thiết lập middleware JSON ở server.js
app.use(express.json());

// Lấy cookie
app.use(cookieParser());

app.use(logApi("Product"));

// Google Authentic Login
initLoginGooglePassport();

//Public Image Folder => Kể từ folder Public trở đi mới nhìn thấy
app.use(express.static("public"));

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Get Router
// Gọi user => bắt toàn bộ API
// rootRouter là 1 callback function
// app/api/auth/login | register
app.use("/api", rootRouter);

// Middleware xử lý lỗi
app.use(appError);

const httpServer = initSocket(app);

//  Hàm Listen online 1 cổng
// Ở đây mình sử dụng cổng 3000
// Callback chỉ chạy khi backend online thành công => listen thành công
// Nên để listen ở cuối file
const PORT = 3069;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// npx prisma db pull: Kéo database vào code và tạo ra model tương ứng
// npx prisma generate: Tạo ra object CLIENT để sử dụng trong code, sau khi đã có model rồi thì mới dùng được object này

// Express version < 5: Phải bắt try catch ở controller để bắt lỗi
