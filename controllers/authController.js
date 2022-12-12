const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const AppError = require("../utils/appError");

exports.login = (req, res, next) => {
  res.status(200).json({ message: "you call /auth/login from Controller" });
};

exports.register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      weight,
      height,
      gender,
      birthDate,
    } = req.body;

    // #1 validate all of mandatory field : GUARD CLAUSE
    const isEmail = validator.isEmail(email);
    const isWeightNum = validator.isNumeric(String(weight));
    const isHeightNum = validator.isNumeric(String(height));
    const isDate = validator.isDate(birthDate);

    if (!isEmail) {
      throw new AppError("email address is not correct", 400);
    }
    if (!isWeightNum || !isHeightNum) {
      throw new AppError("weight or height is not a number", 400);
    }
    if (firstName.trim() === "") {
      throw new AppError("firstName is required", 400);
    }
    if (lastName.trim() === "") {
      throw new AppError("lastName is required", 400);
    }
    if (gender.trim() === "") {
      throw new AppError("gender is required", 400);
    }
    if (!isDate) {
      throw new AppError("invalid date format", 400);
    }
    if (password !== confirmPassword) {
      throw new AppError("password and confirm password didn't match", 400);
    }

    // #2 Check Exist User
    const user = await UserModel.findOne({ email }); // key : email , value : email variable
    if (user) {
      throw new AppError("this email is already taken", 400);
    }

    // #3 Hashed Password :  by Bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // #4 Register
    const newUser = new UserModel({
      password: hashedPassword,
      email,
      firstName,
      lastName,
      weight,
      height,
      gender,
      birthDate,
    });
    await newUser.save();

    // #5 Generate Token
    const payload = { userId: newUser._id, firstName, lastName };
    const privateKey = process.env.JWT_SECRET_KEY || "S3c12et";
    const options = { expiresIn: "1 days" };
    const token = jwt.sign(payload, privateKey, options);

    // #6 Response
    res
      .status(201)
      .json({ userId: newUser._id, token, message: "create user success", error: false });
  } catch (error) {
    next(error);
  }
};
