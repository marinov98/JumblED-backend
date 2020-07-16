import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Teacher, Student } from "../../db/models";
import { jwtSecret, issuer, audience } from "./keys";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
  issuer: issuer,
  audience: audience
};

passport.use(
  new Strategy(
    options,
    async (payload: any, done: Function): Promise<void> => {
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
