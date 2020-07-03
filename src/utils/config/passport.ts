import JWT from "passport-jwt";
import { Teacher, Student } from "../../db/models";
import passport from "passport";
import { jwtSecret, googleSecret } from "./keys";

const options = {
  jwtFromRequest: JWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
};

passport.use(
  new JWT.Strategy(
    options,
    async (payload, done): Promise<void> => {
      try {
        const teacher = await Teacher.findOne({ email: payload.email });

        if (teacher) {
          done(null, teacher);
        } else {
          const student = await Student.findOne({ email: payload.email });

          if (!student) done(null, false);
          else done(null, student);
        }
      } catch (err) {
        done(err);
      }
    }
  )
);
