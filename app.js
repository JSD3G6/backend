require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const mongodb = require("./mongodb/connection");
const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const activityRoute = require("./routes/activityRoute");
const statisticsRoute = require("./routes/statisticsRoute");
const errorMiddleware = require("./middleware/errorMiddleware");
const authenticate = require("./middleware/authenticateMiddleware");

const app = express();
mongodb.connect();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Allow,Parser
app.use(cors());
app.use(express.json()); // middleware help your parse json format & attach that json in req.body
app.use(express.urlencoded({ extended: false }));

// Service
app.get("/", (req, res, next) => {
  res.send("Elite Move API V.1");
});
app.use("/auth", authRoute);
app.use("/profile", authenticate, profileRoute);
app.use("/activity", authenticate, activityRoute);
app.use("/statistics", authenticate, statisticsRoute);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
