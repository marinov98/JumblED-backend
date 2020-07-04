import express from "express";
import passport from "passport";
import IUser from "./../db/interfaces/user";
import { Test, Class } from "./../db/models";

const router = express.Router();
/**
 *  Get classes
 *  @route PATCH api/students/classes
 *  @desc grab all the classes
 *  @access Protected
 */
router.patch(
  "/classes",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const classes: Array<any> = await Class.find().populate("teacher");

      if (!classes) return res.status(404).json({ error: "No classes found!" });

      return res.status(201).json(classes);
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Get test
 *  @route PATCH api/students/tests/:code
 *  @desc grab the test with questions
 *  @access Protected
 */
router.patch(
  "/tests/:code",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const testToTake = await Test.findOne({ code: req.params.code }).populate(
        "questions"
      );

      if (!testToTake) return res.status(404).json({ error: "Test not found" });

      return res.status(201).json(testToTake);
    } catch (err) {
      next(err);
    }
  }
);

/**
 *  Register for a class
 *  @route PATCH api/students/classes
 *  @desc grab the test with questions
 *  @access Protected
 */
router.patch(
  "/classes/:classid",
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const classToUpdate = await Class.findById(req.params.classid);
      if (!classToUpdate)
        return res.status(404).json({ error: "Class not found" });

      const user = req.user as IUser;
      classToUpdate.students.push(user._id);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
