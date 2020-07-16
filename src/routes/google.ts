import express from "express";
import { Teacher, Student } from "./../db/models";
import generateTokens from "./../utils/auth/tokens";

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
      const { accessToken, refreshToken } = await generateTokens(user, true);

      // create user and send to save in database
      return res.status(201).json({
        success: true,
        authenticated: true,
        teacher: true,
        token: accessToken,
        refreshToken: refreshToken
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
      // if user not in db...
      // Create new user
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
      const { accessToken, refreshToken } = await generateTokens(user, false);

      return res.status(201).json({
        success: true,
        authenticated: true,
        teacher: false,
        token: accessToken,
        refreshToken: refreshToken
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
