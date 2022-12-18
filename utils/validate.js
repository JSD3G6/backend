const ACTIVITY_CONST = require("../constant/activityType");
const checkUserWithUserID = (user, checkId) => {
  let id = user._id.toString();
  if (id !== checkId) {
    return false;
  }
  return true;
};

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

module.exports = {
  checkUserWithUserID,
  validateMandatory,
  validateType,
  validateDurationMin,
  validateDateTime,
  validateDistanceInKM,
};
