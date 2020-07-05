import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { jwtSecret } from "./../utils/config/keys";
import { RefreshToken } from "./../db/models";

const router = express.Router();

/**
 * Token endpoint
 * @route POST api/token/teachers
 * @desc Refresh a teacher's token
 * @access Public
 */
router.post(
  "/teachers",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const refreshToken = await RefreshToken.findOne({
        token: req.body.refreshToken
      }).populate("owner");

      if (!refreshToken || refreshToken.isExpired()) return res.sendStatus(401);

      // owner is now Teacher object but typescript does not catch it
      const user: any = refreshToken.owner;

      // create refresh token
      const newRefreshToken = {
        owner: user._id,
        token: crypto.randomBytes(40).toString("hex"),
        created: Date.now(),
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // expires in 7 days
        onModel: "Teacher"
      };

      await RefreshToken.create(newRefreshToken);

      // update previous refresh token
      refreshToken.replacedByToken = newRefreshToken.token;
      await refreshToken.save();

      const payload = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        tests: user.tests,
        classes: user.classes
      };

      // refresh the main jwt token
      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: "300m"
      });

      return res.status(201).json({
        authenticated: true,
        teacher: true,
        token: token,
        refreshToken: newRefreshToken.token
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Token endpoint
 * @route POST api/token/students
 * @desc Refresh a student's token
 * @access Public
 */
router.post(
  "/students",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const refreshToken = await RefreshToken.findOne({
        token: req.body.refreshToken
      }).populate("owner");

      if (!refreshToken || refreshToken.isExpired()) return res.sendStatus(401);

      // owner is now Student object but typescript does not catch it
      const user: any = refreshToken.owner;

      // create refresh token
      const newRefreshToken = {
        owner: user._id,
        token: crypto.randomBytes(40).toString("hex"),
        created: Date.now(),
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // expires in 7 days
        onModel: "Student"
      };

      await RefreshToken.create(newRefreshToken);

      // update previous refresh token
      refreshToken.replacedByToken = newRefreshToken.token;
      await refreshToken.save();

      const payload = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        classes: user.classes
      };

      // refresh the main jwt token
      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: "300m"
      });

      return res.status(201).json({
        authenticated: true,
        teacher: false,
        token: token,
        refreshToken: newRefreshToken.token
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Reject token endpoint
 * @route DELETE api/token/reject/:userId
 * @desc delete all the refresh tokens of the user
 * @access Public
 */
router.delete(
  "/reject",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // delete all refresh tokens of the owner
      await RefreshToken.deleteMany({ owner: req.body.id });

      return res
        .status(201)
        .json({ message: "all refresh tokens from current user removed" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
