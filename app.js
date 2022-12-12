require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongodb = require("./mongodb/connection");
const authRoute = require("./routers/authRoute");

const app = express();
mongodb.connect();

// process == app == global object in node
// window == app == global object in browser
console.log("############# DB_ENDPOINT", process.env.DB_ENDPOINT);

// Allow,Parser
app.use(cors());
app.use(express.json()); // middleware help your parse json format & attach that json in req.body
app.use(express.urlencoded({ extended: false }));

// Service
app.use("/auth", authRoute);

// at first when start server && after send response : Ready listen for next Request
const port = process.env.DEV_PORT || 8000;
app.listen(port, () => console.log(`app is running in port ${port}`));
