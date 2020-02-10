import "reflect-metadata";
import * as createError from "http-errors";
import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as lessMiddleware from "less-middleware";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import { url } from "$config/db";
import mainRouter from "./routes/main";
import { createConnection } from "typeorm";
import { CONFIG } from "$config/server";

const app = express();

createConnection({
  type: "mysql",
  url,
  synchronize: true,
  database: CONFIG.DB.DATABASE,
  entities: [
    "./src/entity/*.ts"
  ],
  logging: true,
}).then(() => {
  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(lessMiddleware(path.join(__dirname, "public")));
  app.use(express.static(path.join(__dirname, "public")));
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use(bodyParser.json());
  app.use(express.json());

  app.use("/", mainRouter);

  app.use((req, res, next) => next(createError(404)));

  // error handler
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
});

module.exports = app;

export default app;
