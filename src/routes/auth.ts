import express from "express";
import { Teacher, Student, Class } from "./../db/models";
import registrationSchema from "./../utils/auth/schemas";
import generateTokens from "./../utils/auth/tokens";

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

      if (!(await teacher.comparePassword(req.body.password)))
        return res
          .status(404)
          .json({ error: "Password and email do not match" });

      const { accessToken, refreshToken } = await generateTokens(teacher, true);

      return res.status(200).json({
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

      if (!(await student.comparePassword(req.body.password)))
        return res
          .status(404)
          .json({ error: "Password and email do not match" });

      const { accessToken, refreshToken } = await generateTokens(
        student,
        false
      );

      return res.status(200).json({
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

/**
 *  Delete account endpoint
 *  @route DELETE api/auth/delete/teachers
 *  @desc delete a teacher's account
 *  @access Public
 */
router.delete(
  "/delete/teachers",
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
 *  @route DELETE api/auth/delete/students
 *  @desc delete a student's account
 *  @access Public
 */
router.delete(
  "/delete/students",
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
