import { BadRequestException } from "../common/helper/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,

  // Không cần cung cấp vì file .env đã có CLOUDINARY_URL
  // CLOUDINARY_URL tự đọc: api_key, api_secret, cloud_name
});

export const userService = {
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
