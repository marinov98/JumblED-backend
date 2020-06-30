import express from "express";
import bodyparser from "body-parser";
import logger from "morgan";
import passport from "passport";
import { port } from "./utils/config/keys";
import connectToDatabase from "./utils/config/database";

(async () => {
  // Initialize express
  const app = express();
  app.set("port", port);

  // middleware
  if (process.env.NODE_ENV != "production") {
    app.use(logger("dev"));
  }
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  app.use(passport.initialize());

  // Database
  await connectToDatabase();

  // Routes

  // single home route
  app.get("/", (req: express.Request, res: express.Response) => {
    return res.send("Budgie server up and running");
  });

  // other routes go here

  // launch server
  app.listen(port, () => {
    console.log(`📡 Server up! 📡 Listening on  http://localhost:${port}`);
  });
})();
