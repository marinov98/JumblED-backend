import { jwtSecret } from "./../config/keys";
import { RefreshToken } from "./../../db/models";
import IUser from "./../../db/interfaces/user";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export default async function generateTokens(user: IUser, isTeacher: boolean) {
  const payload = {
    id: user._id,
    email: user.email
  };

  const accessToken: string = jwt.sign(payload, jwtSecret, {
    expiresIn: "300m",
    issuer: "JumblED",
    audience: "JumblED Users"
  });

  // refresh token logic:
  const newRefreshToken = {
    owner: user._id,
    token: crypto.randomBytes(40).toString("hex"),
    created: Date.now(),
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // expires in 7 days
    onModel: isTeacher ? "Teacher" : "Student"
  };

  const { token } = await RefreshToken.create(newRefreshToken);

  return { accessToken, refreshToken: token };
}
