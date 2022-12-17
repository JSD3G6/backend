const fs = require("fs");
const validator = require("validator");

const ActivityModel = require("../models/Activity");
const AppError = require("../utils/appError");
const ACTIVITY_CONST = require("../constant/activityType");
const UploadServices = require("../services/UploadServices");
const validateUtils = require("../utils/validate");

// util for Validate
const validateMandatory = (activityObj) => {
  let { type, durationMin, dateTime } = activityObj; // mandatory
  let errorMessage = "";
  // #1A Validate , have,don't have
  if (!type) errorMessage = "type of activity is required";
  if (!durationMin) errorMessage = "duration in minutes of activity is required";
  if (!dateTime) errorMessage = "date-time of activity is required";
  return { errorMessage };
};

const validateType = (type) => {
  console.log("TYPE", type);
  if (!ACTIVITY_CONST.NAME.includes(type)) return { errorMessage: "invalid activity type" };
  return { errorMessage: "" };
};
const validateDurationMin = (durationMin) => {
  console.log("DurationMin", durationMin);
  const isDurationMinNum = validator.isNumeric(String(durationMin));
  if (!isDurationMinNum) return { errorMessage: "invalid durationMin" };
  return { errorMessage: "" };
};
const validateDateTime = (dateTime) => {
  const isDateTime = validator.isISO8601(dateTime, { strictSeparator: true });
  const [, time] = dateTime.split("T"); // ["2022-12-17","06:23:32.367Z"]

  if (!isDateTime || !time) return { errorMessage: "invalid date-time" };
  return { errorMessage: "" };
};
const validateDistanceInKM = (distanceKM) => {
  let isNum = validator.isNumeric(String(distanceKM));
  if (!isNum) return { errorMessage: "invalid distance in KM" };
  return { errorMessage: "" };
};

const calculateMETs = (activityType, durationMin, weight) => {
  const matchedObj = ACTIVITY_CONST.METs.find((item) => item.type === activityType);
  if (!matchedObj) return { errorMessage: "invalid activity type", caloriesBurnedCal: 0 };
  const MET = matchedObj.METs;
  // const { weight, _id: userId } = user.toObject();
  const caloriesBurnedCal = (1 / 60) * MET * durationMin * weight;
  return { errorMessage: "", caloriesBurnedCal };
};
exports.createActivity = async (req, res, next) => {
  try {
    let { type, durationMin, dateTime, title } = req.body; // mandatory
    let { details, distanceKM } = req.body; // optional
    const { weight, _id: userId } = req.user.toObject();

    // #1 Validate:  Mandatory
    let { errorMessage: e1 } = validateMandatory(req.body);
    if (e1) throw new AppError(e1, 400);

    // #1B : Validate format
    let { errorMessage: e2 } = validateType(type);
    let { errorMessage: e3 } = validateDurationMin(durationMin);
    let { errorMessage: e4 } = validateDateTime(dateTime);
    if (e2) throw new AppError(e2, 400);
    if (e3) throw new AppError(e3, 400);
    if (e4) throw new AppError(e4, 400);

    if (distanceKM) {
      let { errorMessage: e5 } = validateDistanceInKM(distanceKM);
      if (e5) throw new AppError(e5, 400);
    }

    // #1C : didn't send type
    if (!title) title = type;

    // #2 cal CAL
    let calMETs = calculateMETs(type, durationMin, weight);
    if (calMETs.errorMessage) throw new AppError(calMETs.errorMessage, 400);

    // #3A create new Activity
    const newActivity = new ActivityModel({
      userId,
      type,
      durationMin,
      dateTime,
      title,
      caloriesBurnedCal: Math.round(calMETs.caloriesBurnedCal),
      weight,
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
  try {
    const { activityId } = req.params;
    const { ...changeActivityDetail } = req.body;
    const { type, durationMin, dateTime, distanceKM } = req.body;
    // const { weight } = req.user.toObject(); // oldW not currentW

    // #1 Validate INPUT
    if (type) {
      console.log("TYPE VALIDATE");
      let { errorMessage } = validateType(type);
      if (errorMessage) throw new AppError(errorMessage, 400);
    }
    if (durationMin) {
      let { errorMessage } = validateDurationMin(durationMin);
      if (errorMessage) throw new AppError(errorMessage, 400);
    }
    if (dateTime) {
      let { errorMessage } = validateDateTime(dateTime);
      if (errorMessage) throw new AppError(errorMessage, 400);
    }
    if (distanceKM) {
      let { errorMessage } = validateDistanceInKM(distanceKM);
      if (errorMessage) throw new AppError(errorMessage, 400);
    }

    // #2 Intermediate : find Old Activity
    const activity = await ActivityModel.findById(activityId);
    if (!activity) throw new AppError("cannot get activity", 404);

    // #3 Calc New METs When Need
    let isTypeChange = activity.toObject().type !== type;
    let isDurationChange = activity.toObject().durationMin !== Number(durationMin);

    let currentType = type ? type : activity.toObject().type;
    let currentDurationMin = durationMin ? durationMin : activity.toObject().durationMin;

    if (isTypeChange || isDurationChange) {
      console.log("NEW CAL");
      let calMETs = calculateMETs(currentType, currentDurationMin, activity.toObject().weight);
      if (calMETs.errorMessage) throw new AppError(calMETs.errorMessage, 400);
      changeActivityDetail.caloriesBurnedCal = Math.round(calMETs.caloriesBurnedCal);
    }

    // #4B Modify for PHOTO
    let secureUrl;
    if (req.file) {
      let oldPhotoUrl = activity.photo;
      let publicId; // undefined
      if (oldPhotoUrl) {
        publicId = UploadServices.getPublicId(oldPhotoUrl); // cr4mxeqx5zb8rlakpfkg, ""
      }
      secureUrl = await UploadServices.upload(req.file.path, publicId);
    }
    if (secureUrl) {
      changeActivityDetail.photo = secureUrl;
    }

    // #5 update and save to database
    const updatedActivity = Object.assign(activity, changeActivityDetail);
    await updatedActivity.save();

    // #6 response
    res.status(200).json(updatedActivity);
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
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
  try {
    const { activityId } = req.params;

    // # 1  Validate MongoId
    // const obj = mongoose.Types.ObjectId(activityId);
    // let validId = validator.isMongoId(obj._id);
    // if (validId) throw new AppError("invalid activityId", 400);

    // # 2 Query
    const activity = await ActivityModel.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "cannot find activity", error: false });
    }
    res.status(200).json({ message: "success", error: false, activityDetail: activity });
  } catch (error) {
    next(error);
  }
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

    res
      .status(200)
      .json({ message: "success", error: false, activities: query, pageNumber: +page });
  } catch (error) {
    next(error);
  }
};
