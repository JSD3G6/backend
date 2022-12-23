// UTIL
const calAge = (dateObj) => {
  console.log(dateObj);
  let DOB = new Date(dateObj);
  let monthDiff = Date.now() - DOB.getTime();
  let ageUTC = new Date(monthDiff);
  let year = ageUTC.getUTCFullYear();
  let age = Math.abs(year - 1970);
  return age;
};

const convertDateObjToDateString = (dateObj) => {
  let [m, d, y] = dateObj.toLocaleDateString().split("/");
  d = d.length === 1 ? "0" + d : "" + d;
  m = m.length === 1 ? "0" + m : "" + m;
  return `${y}-${m}-${d}`;
};

const daysInMonth = (month, year) => {
  console.log(month);
  switch (month) {
    case "01":
    case "03":
    case "05":
    case "07":
    case "08":
    case "10":
    case "12":
      return "31";
    case "02":
      return isLeapYear(year) ? "29" : "28";
    default:
      return "30";
  }
};

function findTimePoint(date, type) {
  // date in yyyy-mm-dd
  console.log(`${date}`);
  const t = convertDateObjToDateString(date);
  let timePoint = t.split("-");
  if (type === "week") return timePoint[2];
  if (type === "month") return timePoint[2];
  if (type === "year") return timePoint[1];
}

const findEndDayOfMonth = (date) => {
  // date in yyyy-mm-dd
  let year = date.split("-")[0];
  let month = date.split("-")[1];
  let dayCount = daysInMonth(month, year);
  return dayCount;
};

// MAIN FN
const findYearInterval = (dateObj) => {
  let utilizeDate = convertDateObjToDateString(dateObj);
  let arrDate = utilizeDate.split("-");
  let year = arrDate[0];

  let startYear = `${year}-01-01`;
  let endYear = `${+year + 1}-01-01`;
  return [startYear, endYear];
};
const findMonthInterval = (dateObj) => {
  let utilizeDate = convertDateObjToDateString(dateObj);
  let arrDate = utilizeDate.split("-");
  let month = arrDate[1];
  let year = arrDate[0];

  let canNextMonth = month != 12;
  let newNextMonth;
  if (canNextMonth) {
    newNextMonth = "0" + (Number(month) + 1);
  }
  let summarizeEndYear = canNextMonth ? year : +year + 1;
  let summarizeEndMonth = canNextMonth ? newNextMonth : "01";
  // let lastDayOfMonth = daysInMonth(month, year);
  let startMonth = `${year}-${month}-01`;
  let endMonth = `${summarizeEndYear}-${summarizeEndMonth}-01`;
  return [startMonth, endMonth];
};

const findWeekInterval = (dateObj) => {
  const MS_IN_DAY = 86400 * 1000;

  // BASE : LOCALE DAY
  let dayInWeek = dateObj.getDay(); // 3 เขยิบมา 3 วัน

  // BASE : UNIX
  const mySundayTime = dateObj.getTime() - MS_IN_DAY * dayInWeek;
  const mySaturdayTime = dateObj.getTime() + MS_IN_DAY * (7 - dayInWeek);
  const sunday = new Date(mySundayTime); // gte
  const saturday = new Date(mySaturdayTime); // lte

  // toLocale UNIX -> LOCALE
  let start = convertDateObjToDateString(sunday);
  let end = convertDateObjToDateString(saturday);
  return [start, end];
};

const calAgeByBirthDate = (birthDate) => {
  const now = new Date();
  const nowYr = now.getFullYear();

  const birth = new Date(birthDate);
  const birthYr = birth.getFullYear();
  const age = nowYr - birthYr;
  return age;
};
module.exports = {
  calAge,
  findWeekInterval,
  findMonthInterval,
  findYearInterval,
  calAgeByBirthDate,
  findEndDayOfMonth,
  findTimePoint,
};
