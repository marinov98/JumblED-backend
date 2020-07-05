import express from "express";
import { Teacher, Student } from "./../db/models";

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
      const user = await Teacher.findOne({ email: req.body.email });
      // if user in db...
      // send back success and token
      if (user)
        return res.status(200).json({
          success: true,
          authenticated: true,
          teacher: true,
          token: req.body.token
        });

      // create user and send to save in database
      const userToBeCreated = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        tests: [],
        classes: [],
        googleId: req.body.id
      };
      await Teacher.create(userToBeCreated);
      return res.status(201).json({
        success: true,
        authenticated: true,
        teacher: true,
        token: req.body.token
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
      const user = await Student.findOne({ email: req.body.email });
      // if user in db...
      // send back success and token
      if (user)
        return res.status(200).json({
          sucess: true,
          authenticated: true,
          teacher: false,
          token: req.body.token
        });

      // create user and send to save in database
      const userToBeCreated = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        tests: [],
        classes: [],
        googleId: req.body.id
      };

      await Student.create(userToBeCreated);
      return res.status(201).json({
        success: true,
        authenticated: true,
        teacher: false,
        token: req.body.token
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
