import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { OAuth2Strategy } from "passport-google-oauth";
import { Teacher, Student } from "../../db/models";
import { jwtSecret, googleSecret, googleClientId } from "./keys";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
};

passport.use(
  new Strategy(
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

const googleOptions = {
  clientID: googleClientId,
  clientSecret: googleSecret,
  callbackURL: "http://www.example.com/auth/google/callback"
};

passport.use(
  new OAuth2Strategy(
    googleOptions,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const teacher = await Teacher.findOne({ googleId: profile.id });

        if (teacher) {
          return done(null, teacher);
        } else {
          const student = await Student.findOne({ googleId: profile.id });

          if (!student) return done(null, false);
          else return done(null, student);
        }
      } catch (err) {
        done(err);
      }
    }
  )
);
