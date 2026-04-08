import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Có thể xử lý logic ở đây trước khi lưu trữ
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);

    console.log({ file, fileExt });
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, "local" + "-" + uniqueSuffix + fileExt);
  },
});

export const uploadDiskStorage = multer({ storage: storage });
