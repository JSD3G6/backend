const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const AppError = require("../utils/appError");
const UserServices = require("../services/UserServices");

const genToken = (payload) => {
  const privateKey = process.env.JWT_SECRET_KEY || "S3c12et";
  const options = { expiresIn: 60 * 60 * 6 }; //1s
  const token = jwt.sign(payload, privateKey, options);
  return token;
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // #1 validate
    const isEmail = validator.isEmail(email);
    if (email.trim() === "" || password.trim() === "") {
      throw new AppError("email or password is required", 400);
    }
    if (!isEmail) {
      throw new AppError("invalid email address", 400);
    }

    // #2 findUserByEmail
    // const foundedUser = await UserModel.findOne({ email }); // => userObject,null
    const foundedUser = await UserServices.getUserByEmail(email); // async () => Promise
    console.log(foundedUser);
    if (!foundedUser) {
      throw new AppError("email or password is not correct", 403);
    }

    // #3 Compare password
    const hashedPassword = foundedUser.password;
    console.log(hashedPassword);
    const isCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isCorrect) {
      throw new AppError("email or password is not correct", 403);
    }
    console.log(isCorrect);
    // # 4 genToken
    const { _id: id, firstName, lastName } = foundedUser;
    const payload = { userId: id, firstName, lastName };
    const token = genToken(payload);

    // # 4B Build UserObject
    const user = {
      _id: id,
      email: foundedUser.email,
      firstName: foundedUser.firstName,
      lastName: foundedUser.lastName,
    };
    // # 5 Send Response
    res.status(200).json({
      userId: foundedUser._id,
      user: user,
      token,
      message: "login success",
      error: false,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
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
    const user = await UserServices.getUserByEmail(email); // key : email , value : email variable
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
    const token = genToken(payload);

    // #6 Response
    res
      .status(201)
      .json({ userId: newUser._id, token, message: "create user success", error: false });
  } catch (error) {
    next(error);
  }
};
