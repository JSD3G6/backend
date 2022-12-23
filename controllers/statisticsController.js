const ActivityModel = require("../models/Activity");
const AppError = require("../utils/appError");
const validateUtils = require("../utils/validate");
const dateUtils = require("../utils/date");
const statisticsUtils = require("../utils/statistics");

exports.getStatistics = async (req, res, next) => {
  try {
    const user = req.user.toObject();
    const { activityType, duration = "week", date } = req.query; // activityType = undefined === allType

    let filterCondition = { userId: user._id };

    if (activityType) {
      let { errorMessage } = validateUtils.validateType(activityType);
      if (errorMessage) throw new AppError(errorMessage, 400);
      filterCondition.type = activityType; //{type:"running"}
    }
    let durationArr = ["week", "month", "year"];
    if (!durationArr.includes(duration)) {
      throw new AppError("invalid query in duration", 400);
    }

    let start, end;
    let searchDayObj = date ? new Date(date) : new Date(); // UTC:000 : UTC with SpecificTime
    // searchDay = searchDay.toISOString().split("T")[0]; // YYYY-MM-DD
    if (duration === "week") {
      [start, end] = dateUtils.findWeekInterval(searchDayObj);
    } else if (duration === "month") {
      [start, end] = dateUtils.findMonthInterval(searchDayObj);
    } else if (duration === "year") {
      [start, end] = dateUtils.findYearInterval(searchDayObj);
    }
    console.log("START", start);
    console.log("END", end);
    filterCondition.dateTime = {
      $gte: new Date(`${start}T00:00:00.000+0700`), // 2022-12-15T00:00:00
      $lt: new Date(`${end}T00:00:00.000+0700`),
    };

    const activityLists = await ActivityModel.find(filterCondition).sort({ dateTime: 1 });
    // activityLists.agg;
    let summarizeData = [];
    let totalDurationMin = 0;
    let totalCaloriesBurnedCal = 0;
    let totalCount = 0;
    let totalDistanceKM = 0;
    // #### FOR ICON CHART
    if (activityLists.length > 0) {
      const data = activityLists.reduce((acc, item) => {
        let { type, durationMin, caloriesBurnedCal, distanceKM } = item;
        console.log(type, durationMin, caloriesBurnedCal, distanceKM);
        const matchIndex = acc.findIndex((obj) => obj.type === type);
        if (matchIndex !== -1) {
          acc[matchIndex] = {
            ...acc[matchIndex],
            count: acc[matchIndex]["count"] + 1,
            duration: acc[matchIndex]["duration"] + durationMin,
          };
        } else {
          acc.push({ type: type, count: 1, duration: durationMin });
        }
        totalCount++;
        totalDurationMin += durationMin;
        totalCaloriesBurnedCal += caloriesBurnedCal;
        totalDistanceKM += distanceKM;
        return acc;
      }, []);

      //#### FOR TOTAL VALUE
      summarizeData = data.map((item) => ({
        ...item,
        percent: +((item.count / totalCount) * 100).toFixed(2),
      }));
    }

    // #### FOR LINEAR-CHART
    let linearChartArr = statisticsUtils.genArrayLinearChart(duration, start);

    const linearSummarize = activityLists.reduce((acc, item) => {
      console.log("DD", item.dateTime);
      let timePoint = dateUtils.findTimePoint(item.dateTime, duration);
      let gapIndex = timePoint - 1;
      if (duration == "week") {
        console.log(start.split("T"));
        gapIndex = timePoint - start.split("-")[2];
      }
      let oldDurationMin = acc[gapIndex];
      acc[gapIndex] = oldDurationMin + item.durationMin;
      return acc;
    }, linearChartArr);

    // SEND
    let sendObject = {
      summary: {
        type: summarizeData,
        linear: linearSummarize,
        totalCount,
        totalCaloriesBurnedCal,
        totalDurationMin,
        totalDistanceKM,
      },
    };
    res.status(200).json(sendObject);
  } catch (error) {
    next(error);
  }
};
