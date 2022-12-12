const express = require("express");
const cors = require("cors");
const authRoute = require("./routers/authRoute");

const app = express();

// Allow,Parser
app.use(cors());
app.use(express.json()); // middleware help your parse json format & attach that json in req.body
app.use(express.urlencoded({ extended: false }));

// Service
app.use("/auth", authRoute);

// Ready listen
app.listen(8000, () => console.log("app is running in port 8000"));
