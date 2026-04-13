import { BadRequestException } from "../common/helper/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { buildQueryPrisma } from "../common/helper/build-query-prisma.helper.js";

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,

  // Không cần cung cấp vì file .env đã có CLOUDINARY_URL
  // CLOUDINARY_URL tự đọc: api_key, api_secret, cloud_name
});

export const userService = {
  async findAll(req) {
    // QUERY:
    // Thường dùng phân trang, lọc, tìm kiếm

    // sequelize
    // const resultSequelize = await Article.findAll();

    const { page, pageSize, index, where } = buildQueryPrisma(req);

    const resultPrismaPromise = await prisma.users.findMany({
      where: where,
      skip: index, // Skip tương đương OFFSET
      take: pageSize, // Take tương đương với LIMIT
    });

    const totalItemsPromise = await prisma.users.count({
      where: where,
    });

    // Chạy đồng thời
    const [resultPrisma, totalItems] = await Promise.all([
      resultPrismaPromise,
      totalItemsPromise,
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      totalItems: totalItems,
      totalPages: totalPages,
      page: page,
      pageSize: pageSize,
      items: resultPrisma,
    };
  },

  async findOne(req) {
    const { id } = req.params;
    const result = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });
    return result;
  },

  async avatarLocal(req) {
    if (!req.file) {
      throw new BadRequestException("File not found");
    }

    // Vì 1 user chỉ 1 avatar nên phải xoá hình cũ nếu có
    if (req.user.avatar) {
      // WIN: \\
      // Mac: //
      const oldFilePaht = path.join("public/images", req.user.avatar);
      if (fs.existsSync(oldFilePaht)) {
        fs.unlinkSync(oldFilePaht);
      }

      cloudinary.uploader.destroy(req.user.avatar);
    }

    await prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        avatar: req.file.filename,
      },
    });

    return `http://localhost:3069/images/${req.file.filename}`;
  },

  async avatarCloud(req) {
    if (!req.file) {
      throw new BadRequestException("File not found");
    }
    // đảm bảo user chỉ có 1 tấm hình cô 1 avatar
    if (req.user.avatar) {
      const oldFilePaht = path.join("public/images", req.user.avatar);
      if (fs.existsSync(oldFilePaht)) {
        fs.unlinkSync(oldFilePaht);
      }

      cloudinary.uploader.destroy(req.user.avatar);
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "node_54" }, (error, uploadResult) => {
          if (error) {
            return reject(error);
          }
          return resolve(uploadResult);
        })
        .end(req.file.buffer);
    });

    await prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        avatar: uploadResult.public_id,
      },
    });

    console.log({
      "req.file": req.file,
      "req.body": req.body,
      "req.user": req.user,
      uploadResult: uploadResult.secure_url,
    });
    return uploadResult.secure_url;
  },
};
