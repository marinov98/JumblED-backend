import express from "express";
import { Teacher, Class, Test, Question, Student } from "./../db/models";

const router = express.Router();
/**
 *  Get tests endpoint
 *  @route GET api/teachers/classes/:email
 *  @desc grab the classes that the specified teacher teaches
 *  @access Public
 */
router.get(
  "/classes/:email",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const teacher = await Teacher.findOne({
        email: req.params.email
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
 *  @route GET api/teachers/tests/:email
 *  @desc grab the quetions from a test
 *  @access Public
 */
router.get(
  "/tests/:email",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const teacher = await Teacher.findOne({
        email: req.params.email
      }).populate("tests");

      if (!teacher) return res.status(404).json({ error: "teacher not found" });

      return res.status(200).json(teacher.tests);
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Get test questions endpoint
 *  @route GET api/teachers/tests/questions/:testId
 *  @desc grab the quetions from a test
 *  @access Public
 */
router.get(
  "/tests/questions/:testId",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const test = await Test.findById(req.params.testId).populate("questions");

      if (!test) return res.status(404).json({ error: "test not found" });

      return res.status(200).json(test.questions);
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
  "/classes/:email",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const newClass = await Class.create(req.body);
      await newClass.save();

      const teacher = await Teacher.findOne({
        email: req.params.email
      });

      if (!teacher) return res.status(404).json({ error: "teacher not found" });

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
 *  @route PUT api/teachers/classes/student/:classId
 *  @desc grab the quetions from a test
 *  @access Public
 */
router.put(
  "/classes/:studentEmail/:classId",
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

export default router;
