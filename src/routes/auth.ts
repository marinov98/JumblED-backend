import express from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "./../utils/config/keys";
import { Teacher, Student } from "./../db/models";
import registrationSchema from "./../utils/validation/schemas";

const router = express.Router();

/**
 *  Register endpoint
 *  @route POST api/auth/register/teachers
 *  @desc Register user
 *  @access Public
 */
router.post(
  "/register/teachers",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // check if body has valid information
      const { error } = registrationSchema.validate(req.body);

      if (error)
        return res.status(404).json({ error: error.details[0].message });

      // check if a user exists with the same email
      const userWithSameEmail = await Teacher.findOne({
        email: req.body.email
      });

      if (userWithSameEmail)
        return res.status(409).json({ error: "Email already exists!" });

      const userToBeCreated = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        tests: [],
        classes: []
      };

      await Teacher.create(userToBeCreated);

      return res.status(201).json({ message: "New user created!" });
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Register endpoint
 *  @route POST api/auth/register/students
 *  @desc Register user
 *  @access Public
 */
router.post(
  "/register/students",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // check if body has valid information
      const { error } = registrationSchema.validate(req.body);

      if (error)
        return res.status(404).json({ error: error.details[0].message });

      // check if a user exists with the same email
      const userWithSameEmail = await Student.findOne({
        email: req.body.email
      });

      if (userWithSameEmail)
        return res.status(409).json({ error: "Email already exists!" });

      const userToBeCreated = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        classes: []
      };

      await Student.create(userToBeCreated);

      return res.status(201).json({ message: "New user created!" });
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Login endpoint
 *  @route POST api/auth/login/teachers
 *  @desc Login user
 *  @access Public
 */
router.post(
  "/login/teachers",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const teacher = await Teacher.findOne({ email: req.body.email });

      if (!teacher) return res.status(404).json({ error: "Invalid email!" });

      const isMatch = await teacher.comparePassword(req.body.password);

      if (!isMatch)
        return res
          .status(404)
          .json({ error: "Password and email do not match" });

      const payload = {
        id: teacher._id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        classes: teacher.classes,
        tests: teacher.tests
      };

      const accessToken = jwt.sign(payload, jwtSecret, {
        expiresIn: "300m"
      });

      return res.status(200).json({
        authenticated: true,
        teacher: true,
        token: accessToken
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Login endpoint
 *  @route POST api/auth/login/students
 *  @desc Login user
 *  @access Public
 */
router.post(
  "/login/students",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const student = await Student.findOne({ email: req.body.email });

      if (!student) return res.status(404).json({ error: "Invalid email!" });

      const isMatch = await student.comparePassword(req.body.password);

      if (!isMatch)
        return res
          .status(404)
          .json({ error: "Password and email do not match" });

      const payload = {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        classes: student.classes
      };

      const accessToken = jwt.sign(payload, jwtSecret, {
        expiresIn: "300m"
      });

      return res.status(200).json({
        authenticated: true,
        teacher: false,
        token: accessToken
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Google login endpoint
 *  @route POST api/auth/googlelogin
 *  @desc Login user if they exist, if not, create new user and login
 *  @access Public
 */

export default router;
