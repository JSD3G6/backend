const validator = require("validator");
const ActivityModel = require("../models/Activity");
const AppError = require("../utils/appError");
const ACTIVITY_CONST = require("../constant/activityType");

exports.createActivity = async (req, res, next) => {
  try {
    let { type, durationMin, dateTime, title } = req.body;
    // #1A Validate , have,don't have
    if (!type) throw new AppError("type of activity is required", 400);
    if (!durationMin) throw new AppError("duration in minutes of activity is required", 400);
    if (!dateTime) throw new AppError("date-time of activity is required", 400);

    // #1B Correct Format
    const isDurationMinNum = validator.isNumeric(String(durationMin));
    const isDateTime = validator.isISO8601(dateTime, { strictSeparator: true });
    const [, time] = dateTime.split("T"); // ["2022-12-17","06:23:32.367Z"]
    if (!ACTIVITY_CONST.NAME.includes(type)) throw new AppError("invalid activity type", 400);
    if (!isDurationMinNum) throw new AppError("invalid durationMin", 400);
    if (!isDateTime || !time) throw new AppError("invalid date-time", 400);

    // #1C : didn't send type
    if (!title) title = type;

    // #2 cal CAL
    const matchedObj = ACTIVITY_CONST.METs.find((item) => item.type === type);
    if (!matchedObj) throw new AppError("invalid activity type", 400);
    const MET = matchedObj.METs;

    const { weight } = req.user.toObject();

    const caloriesBurnedCal = (1 / 60) * MET * durationMin * weight;

    // #3 create new Activity
    const newActivity = new ActivityModel({
      type,
      durationMin,
      dateTime,
      title,
      caloriesBurnedCal,
    });
    if (!newActivity) throw new AppError("cannot create activity", 500);
    await newActivity.save();

    // #4 save to database

    // #5
    res.status(201).json(newActivity);
  } catch (error) {
    next(error);
  }
};

exports.updateActivity = async (req, res, next) => {
  res.status(200).json({ message: "updateActivity" });
};

exports.deleteActivity = async (req, res, next) => {
  res.status(204).send();
};

exports.getActivity = async (req, res, next) => {
  res.status(200).json({ message: "getActivity" });
};

exports.getAllActivity = async (req, res, next) => {
  res.status(200).json({ message: "getAllActivity" });
};
