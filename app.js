require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const mongodb = require("./mongodb/connection");
const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
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
app.use("/auth", authRoute);
app.use("/profile", authenticate, profileRoute);

// Error Middleware
app.use(errorMiddleware);

// at first when start server && after send response : Ready listen for next Request
const port = process.env.DEV_PORT || 8000;
app.listen(port, () => console.log(`app is running in port ${port}`));
