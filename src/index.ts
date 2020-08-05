import express from "express";
import bodyparser from "body-parser";
import logger from "morgan";
import passport from "passport";
import { port } from "./utils/config/keys";
import "./utils/config/passport";
import connectToDatabase from "./utils/config/database";
import { auth, teachers, students, tokens, google } from "./routes/index";

(async () => {
  try {
    // Initialize Express
    const app = express();
    app.set("port", port);

    // Middleware
    app.use(bodyparser.urlencoded({ extended: false }));
    app.use(bodyparser.json());
    app.use(passport.initialize());

    if (process.env.NODE_ENV !== "production") {
      app.use(logger("dev"));
      app.use(function (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) {
        res.header("Access-Control-Allow-Origin", `http://localhost:3000`);
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
      });
    }

    // Database
    await connectToDatabase();

    // Routes
    app.get("/", (req: express.Request, res: express.Response) => {
      return res.send("JumplED server up and running");
    });

    app.use("/api/auth", auth);
    app.use("/api/token", tokens);
    app.use("/api/googlelogin", google);
    app.use("/api/teachers", teachers);
    app.use("/api/students", students);

    // Launch Server
    app.listen(port, () => {
      console.log(`📡 Server up! 📡 Listening on  http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
