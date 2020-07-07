import express from "express";
import { RefreshToken } from "./../db/models";
import generateTokens from "./../utils/auth/tokens";

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

      // create jwt and refresh token
      const tokens = await generateTokens(user, true);
      refreshToken.replacedByToken = tokens.refreshToken;
      await refreshToken.save();

      return res.status(201).json({
        authenticated: true,
        teacher: true,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken
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

      // create jwt and refresh token
      const tokens = await generateTokens(user, false);

      refreshToken.replacedByToken = tokens.refreshToken;
      await refreshToken.save();

      return res.status(201).json({
        authenticated: true,
        teacher: false,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Reject token endpoint
 * @route DELETE api/token/reject
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
