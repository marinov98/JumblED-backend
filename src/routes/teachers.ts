import express from "express";
import passport from "passport";
import IUser from "./../db/interfaces/user";
import { Teacher, Class, Test, Question, Student } from "./../db/models";

const router = express.Router();
/**
 *  Get tests endpoint
 *  @route GET api/teachers/classes/:email
 *  @desc grab the classes that the specified teacher teaches
 *  @access Protected
 */
router.get(
  "/classes",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = req.user as IUser;
      // check to ensure user is a teacher
      const teacher = await Teacher.findOne({
        email: user.email
      }).populate("classes");

      if (!teacher) return res.status(404).json({ error: "teacher not found" });

      return res.status(200).json(teacher.classes);
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Get tests endpoint
 *  @route GET api/teachers/tests
 *  @desc grab the quetions from a test
 *  @access Protected
 */
router.get(
  "/tests/",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = req.user as IUser;
      const teacher = await Teacher.findOne({
        email: user.email
      }).populate("tests");

      if (!teacher) return res.status(404).json({ error: "teacher not found" });

      return res.status(200).json(teacher.tests);
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Get students from specific class
 *  @route GET api/teachers/tests
 *  @desc grab the quetions from a test
 *  @access Protected
 */
router.get(
  "/classes/:classId",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const classToGet = await Class.findById(req.params.classId).populate(
        "students"
      );

      if (!classToGet)
        return res.status(404).json({ error: "Class not found" });

      return res.status(200).json(classToGet.students);
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Get all students
 *  @route GET api/teachers/classes/all
 *  @desc grab all the students that a teacher teaches
 *  @access Protected
 */
router.get(
  "/classes/all",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = req.user as IUser;
      const classes: Array<any> = await Class.find({
        teacher: user._id
      }).populate("students");

      const students: Array<any> = [];
      for (let i: number = 0; i < classes.length; i++) {
        students.push(classes[i].students);
      }

      return res.status(200).json({ students });
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Get test questions endpoint
 *  @route PATCH api/teachers/tests/questions/:testId
 *  @desc grab the test with questions and update code
 *  @access Protected
 */
router.patch(
  "/tests/questions/:testId",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const test = await Test.findById(req.params.testId).populate("questions");

      if (!test) return res.status(404).json({ error: "test not found" });

      test.code =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      test.activation = Date.now();

      await test.save();

      return res.status(200).json(test);
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Create a class endpoint
 *  @route POST api/teachers/classes/
 *  @desc grab the quetions from a test
 *  @access Public
 */
router.post(
  "/classes",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = req.user as IUser;
      const teacher = await Teacher.findOne({
        email: user.email
      });

      if (!teacher) return res.status(404).json({ error: "teacher not found" });

      const newClass = await Class.create(req.body);
      await newClass.save();

      teacher.classes.push(newClass._id);
      await teacher.save();

      return res.status(200).json(newClass);
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Add student to a class
 *  @route PATCH api/teachers/classes/:studentEmail/:classId
 *  @desc grab the questions from a test
 *  @access Public
 */
router.patch(
  "/classes/:studentEmail/:classId",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const classToUpdate = await Class.findById(req.params.classId);

      if (!classToUpdate)
        return res.status(404).json({ error: "Class not found" });

      const studentToBeAdded = await Student.findOne({
        email: req.params.email
      });

      if (!studentToBeAdded)
        return res.status(404).json({ error: "Student not found" });

      classToUpdate.students.push(studentToBeAdded._id);
      await classToUpdate.save();

      return res.status(200).json(classToUpdate);
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Add a question to a test
 *  @route PATCH api/teachers/tests/questions
 *  @desc update a test with a new question
 *  @access Protected
 */
router.patch(
  "/tests/questions/:testId",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const testToUpdate = await Test.findById(req.params.testId);

      if (!testToUpdate)
        return res.status(404).json({ error: "Test not found" });

      const questionToBeAdded = await Question.create(req.body);

      testToUpdate.questions.push(questionToBeAdded._id);
      await testToUpdate.save();

      return res.status(200).json(testToUpdate);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
