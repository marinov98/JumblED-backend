import express from "express";
import passport from "passport";
import { Student, Test } from "./../db/models";

const router = express.Router();

/**
 *  Get test
 *  @route PATCH api/students/tests/:code
 *  @desc grab the test with questions
 *  @access Protected
 */
router.get(
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

export default router;
