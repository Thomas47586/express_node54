import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../constant/app.constant.js";
import { prisma } from "../prisma/connect.prisma.js";
import { tokenService } from "../../services/token.service.js";

// var GoogleStrategy = require("passport-google-oauth20").Strategy;

// Function này chỉ chạy 1 lần khi server start
export const initLoginGooglePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3069/api/auth/google/callback",
      },
      async function (accessTokenGG, refreshTokenGG, profile, cb) {
        const fullName = profile.displayName;
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const isEmailVerified = profile.emails[0].verified;
        const avatar = profile.photos[0].value;

        console.log({ fullName, googleId, email, isEmailVerified, avatar });

        if (!isEmailVerified) {
          // Không hợp lệ
          return cb(new Error("Email chưa verify"), "null");
        }
        let userExits = await prisma.users.findUnique({
          where: {
            email,
          },
        });

        if (!userExits) {
          userExits = await prisma.users.create({
            data: {
              email,
              fullName,
              avatar,
              googleId,
            },
          });
        }
        const accessToken = tokenService.createAccessToken(userExits.id);
        const refreshToken = tokenService.createRefreshToken(userExits.id);
        // cb = call back
        // hợp lệ
        return cb(null, {
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      },
    ),
  );
};
