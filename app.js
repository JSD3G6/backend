require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongodb = require("./mongodb/connection");
const authRoute = require("./routers/authRoute");

const app = express();
mongodb.connect();

// SANDBOX
// const createUser = async () => {
//   let registerObject = {
//     email: "test1@gmail.com",
//     password: "12345678",
//     firstName: "test",
//     lastName: "test",
//     weight: 80,
//     height: 180,
//     gender: "female",
//     birthDate: Date.now(),
//   };
//   try {
//     const newUser = await UserModel.create(registerObject);
//     //  newUser.password = "qwerty"
//     newUser.save(); // save to database
//     console.log("Create Success");
//   } catch (error) {
//     console.log("Create new user Error");
//     console.log(error);
//   }
// };
// createUser();

// Allow,Parser
app.use(cors());
app.use(express.json()); // middleware help your parse json format & attach that json in req.body
app.use(express.urlencoded({ extended: false }));

// Service
app.use("/auth", authRoute);

// at first when start server && after send response : Ready listen for next Request
const port = process.env.DEV_PORT || 8000;
app.listen(port, () => console.log(`app is running in port ${port}`));
