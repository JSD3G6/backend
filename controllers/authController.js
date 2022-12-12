const UserModel = require("../models/User");
const AppError = require("../utils/appError");

exports.login = (req, res, next) => {
  console.log("Accept request");
  console.log(req.body);
  res.status(200).json({ message: "you call /auth/login from Controller" });
};

exports.register = async (req, res, next) => {
  console.log("Accept POST request");
  console.log(req.body);
  try {
    const { email, password, firstName, lastName, weight, height, gender, birthDate } = req.body;
    const newUser = new UserModel({
      email,
      password,
      firstName,
      lastName,
      weight,
      height,
      gender,
      birthDate,
    });

    await newUser.save(); // save newUser to MongoDB
    res.status(200).json({ message: "create user success" });
    // for try to create new User
  } catch (error) {
    // if fail
    const myCustomError = new AppError("cannot register !!", 401);
    // const myCustomError = new Error("cannot register");
    // {message:""cannot register",................}
    next(myCustomError);
  }
};
