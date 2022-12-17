const fs = require("fs");
const validator = require("validator");

const ActivityModel = require("../models/Activity");
const AppError = require("../utils/appError");
const ACTIVITY_CONST = require("../constant/activityType");
const UploadServices = require("../services/UploadServices");
const validateUtils = require("../utils/validate");

exports.createActivity = async (req, res, next) => {
  try {
    let { type, durationMin, dateTime, title } = req.body; // mandatory
    let { details, distanceKM } = req.body; // optional
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
    if (distanceKM) {
      let isNum = validator.isNumeric(String(distanceKM));
      if (!isNum) throw new AppError("invalid distance in KM", 400);
    }

    // #1C : didn't send type
    if (!title) title = type;

    // #2 cal CAL
    const matchedObj = ACTIVITY_CONST.METs.find((item) => item.type === type);
    if (!matchedObj) throw new AppError("invalid activity type", 400);
    const MET = matchedObj.METs;

    const { weight, _id: userId } = req.user.toObject();

    const caloriesBurnedCal = (1 / 60) * MET * durationMin * weight;

    // #3A create new Activity
    const newActivity = new ActivityModel({
      userId,
      type,
      durationMin,
      dateTime,
      title,
      caloriesBurnedCal,
    });
    if (!newActivity) throw new AppError("cannot create activity", 500);

    // #3B : Option Part
    if (details) newActivity.details = details;
    if (distanceKM) newActivity.distanceKM = distanceKM;

    // #3C : Photo
    let secureUrl;
    if (req.file) {
      secureUrl = await UploadServices.upload(req.file.path);
    }
    if (secureUrl) {
      newActivity.photo = secureUrl;
    }

    // #4 save to database
    await newActivity.save();

    // #5
    res.status(201).json(newActivity);
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.updateActivity = async (req, res, next) => {
  res.status(200).json({ message: "updateActivity" });
};

exports.deleteActivity = async (req, res, next) => {
  try {
    const { activityId } = req.params; // belong test7@gmail.com
    const { _id: userId } = req.user.toObject(); // test6@gmail.com

    // # 1
    const result = await ActivityModel.findOneAndDelete({ _id: activityId, userId: userId });
    if (!result) {
      res.status(403).json({ message: "cannot delete" });
    }
    // # 2
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.getActivity = async (req, res, next) => {
  res.status(200).json({ message: "getActivity" });
};

exports.getAllActivity = async (req, res, next) => {
  try {
    // #1 Accept GET INPUT
    const { userId } = req.params;
    const { activityType, sort_by, page = 1, pageSize = 10 } = req.query;
    const user = req.user;

    // #2 Validate
    const isValid = validateUtils.checkUserWithUserID(user, userId);
    if (!isValid) throw new AppError("forbidden", 403);
    if (page < 1) throw new AppError("invalid query", 400);

    // #3
    // DESC : z-a : new -> old == -1 ,ASC : a-z : old -> new == 1
    // filter option : type
    let filterCondition = {};
    if (activityType) filterCondition["type"] = activityType;
    let sortOrder = sort_by === "asc" ? 1 : -1; // by default == desc (new -> old)
    let skipItems = (page - 1) * pageSize;

    // #4 Query from database
    let query = await ActivityModel.find(filterCondition)
      .sort({ dateTime: sortOrder })
      .skip(skipItems)
      .limit(pageSize);

    res.status(200).json({ message: "getAllActivity", activities: query, pageNumber: +page });
  } catch (error) {
    next(error);
  }
};
