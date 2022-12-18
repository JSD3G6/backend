const ActivityModel = require("../models/Activity");
const AppError = require("../utils/appError");
const validateUtils = require("../utils/validate");
const dateUtils = require("../utils/date");

exports.getStatistics = async (req, res, next) => {
  try {
    const user = req.user.toObject();
    const { activityType, duration = "week" } = req.query; // activityType = undefined === allType

    let filterCondition = { userId: user._id };

    if (activityType) {
      let { errorMessage } = validateUtils.validateType(activityType);
      if (errorMessage) throw new AppError(errorMessage, 400);
      filterCondition.type = activityType; //{type:"running"}
    }

    const now = new Date();
    const [start, end] = dateUtils.findWeekInterval(now);
    filterCondition.dateTime = {
      $gte: new Date(start),
      $lte: new Date(end),
    };
    // filter condition
    // 1.belong to userId
    // 2.time {dateTime : {$gte: "2022-10-12", $lte: new Date()}}
    // 3.type

    const activityLists = await ActivityModel.find(filterCondition);
    res.status(200).json({ message: "get stat", activityLists });
  } catch (error) {
    next(error);
  }
};
