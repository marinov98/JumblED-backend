import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { jwtSecret } from "./../utils/config/keys";
import { Teacher, Student, Class, RefreshToken } from "./../db/models";
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
      const teacherWithSameEmail = await Teacher.findOne({
        email: req.body.email
      });

      const studentWithSameEmail = await Student.findOne({
        email: req.body.email
      });

      if (teacherWithSameEmail || studentWithSameEmail)
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
      const studentWithSameEmail = await Student.findOne({
        email: req.body.email
      });

      const teacherWithSameEmail = await Teacher.findOne({
        email: req.body.email
      });

      if (studentWithSameEmail || teacherWithSameEmail)
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

      const isMatch: boolean = await teacher.comparePassword(req.body.password);

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

      const accessToken: string = jwt.sign(payload, jwtSecret, {
        expiresIn: "300m"
      });

      // refresh token logic:
      const newRefreshToken = {
        owner: teacher._id,
        token: crypto.randomBytes(40).toString("hex"),
        created: Date.now(),
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // expires in 7 days
        onModel: "Teacher"
      };

      await RefreshToken.create(newRefreshToken);

      return res.status(200).json({
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

      const isMatch: boolean = await student.comparePassword(req.body.password);

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

      // refresh token logic:
      const newRefreshToken = {
        owner: student._id,
        token: crypto.randomBytes(40).toString("hex"),
        created: Date.now(),
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // expires in 7 days
        onModel: "Student"
      };

      await RefreshToken.create(newRefreshToken);

      return res.status(200).json({
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

/**
 *  Delete account endpoint
 *  @route DELETE api/auth/delete/teachers
 *  @desc delete a teacher's account
 *  @access Public
 */
router.delete(
  "/delete/teachers/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await Teacher.findByIdAndDelete(req.body.id);
      // delete every class the teacher has made
      await Class.deleteMany({ teacher: req.body.id });

      return res
        .status(201)
        .json({ message: "Teacher account successfully deleted" });
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Delete account endpoint
 *  @route DELETE api/auth/delete/teachers
 *  @desc delete a teacher's account
 *  @access Public
 */
router.delete(
  "/delete/teachers/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const studentToDelete = await Student.findById(req.body.id);

      if (studentToDelete) {
        // delete student from every class they are registered for
        for (let i: number = 0; i < studentToDelete?.classes.length; i++) {
          let currClass = await Class.findById(studentToDelete.classes[i]);

          if (currClass) {
            currClass.students.filter(
              studentId => studentId.toString() !== req.body.id.toString()
            );
            await currClass.save();
          }
        }
      }

      return res
        .status(201)
        .json({ message: "Student account successfully deleted" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
