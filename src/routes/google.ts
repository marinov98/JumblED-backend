import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Teacher, Student, RefreshToken } from "./../db/models";
import { jwtSecret } from "./../utils/config/keys";

const router = express.Router();

/**
 *  Google login endpoint
 *  @route POST api/googlelogin/teachers
 *  @desc Login user if they exist, if not, create new user and login
 *  @access Public
 */
router.post(
  "/teachers",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Check whether user in db based on email
    try {
      let user = await Teacher.findOne({ email: req.body.email });
      // if user not in db...
      // create the user
      if (!user) {
        const userToBeCreated = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
          email: req.body.email,
          tests: [],
          classes: [],
          googleId: req.body.id
        };
        user = await Teacher.create(userToBeCreated);
      }

      // create jwt and refresh token
      const payload = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        tests: user.tests,
        classes: user.classes
      };

      const accessToken: string = jwt.sign(payload, jwtSecret, {
        expiresIn: "300m"
      });

      const newRefreshToken = {
        owner: user._id,
        token: crypto.randomBytes(40).toString("hex"),
        created: Date.now(),
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        onModel: "Teacher"
      };

      await RefreshToken.create(newRefreshToken);

      // create user and send to save in database
      return res.status(201).json({
        success: true,
        authenticated: true,
        teacher: true,
        token: accessToken,
        refreshToken: newRefreshToken.token
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Google login endpoint
 *  @route POST api/googlelogin/Students
 *  @desc Login user if they exist, if not, create new user and login
 *  @access Public
 */
router.post(
  "/students",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Check whether user in db based on email
    try {
      let user = await Student.findOne({ email: req.body.email });
      // if user in db...
      // send back success and token
      if (!user) {
        // create user and send to save in database
        const userToBeCreated = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
          email: req.body.email,
          classes: [],
          googleId: req.body.id
        };

        user = await Student.create(userToBeCreated);
      }

      // create jwt and refresh token
      const payload = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        classes: user.classes
      };

      const accessToken: string = jwt.sign(payload, jwtSecret, {
        expiresIn: "300m"
      });

      const newRefreshToken = {
        owner: user._id,
        token: crypto.randomBytes(40).toString("hex"),
        created: Date.now(),
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        onModel: "Student"
      };

      await RefreshToken.create(newRefreshToken);

      return res.status(201).json({
        success: true,
        authenticated: true,
        teacher: false,
        token: accessToken,
        refreshToken: newRefreshToken.token
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
