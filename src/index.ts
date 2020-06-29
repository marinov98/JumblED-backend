import express from "express";
import bodyparser from "body-parser";
import logger from "morgan";
import { port, dbUrl } from "./utils/config/keys";

(async () => {
  // Initialize express
  const app = express();
  app.set("port", port);

  // middleware
  app.use(logger("dev"));
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());

  // Database

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
