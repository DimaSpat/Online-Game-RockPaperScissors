var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
var fs = require("fs");
var session = require("express-session");
var config = require("./config");
var MongoStore = require("connect-mongo");

var homeRouter = require("./routes/home-router");
var userRouter = require("./routes/user-router");
var gameRouter = require("./routes/game-router");

var app = express();

const logStream = fs.createWriteStream(path.join(__dirname, "logs.log"), {
  flags: "a",
});

const sessionMiddleware = session({
  secret: "webgame2734",
  store: MongoStore.create({
    mongoUrl: config.get("mongodb"),
  }),
});

app.use(sessionMiddleware);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger(config.get("log_format"), { stream: logStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

app.set("layout", "./layouts/main-layout");

app.use("/", homeRouter);
app.use("/users", userRouter);
app.use("/game", gameRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, "Page not found."));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = {app, sessionMiddleware};
