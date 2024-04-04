import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

dayjs.extend(quarterOfYear);

function getAllMonthsInYearWithTimestamps(year) {
  const months = [];
  for (let month = 0; month < 12; month++) {
    const unixTimestamp = new Date(Date.UTC(year, month, 1)).getTime() / 1000 + 3600; // Convert to Unix timestamp

    months.push({ month: month + 1, year, unixTimestamp }); // Adding 1 to month because month indices are zero-based
  }
  return months;
}

// Function to convert Unix timestamp to human-readable date
function convertUnixTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  return `${month}`;
}

function convertUnixTimestampToNormalDate(unixTimestamp) {
  // Create a new Date object and pass the Unix timestamp multiplied by 1000 to convert it to milliseconds
  const date = new Date(unixTimestamp * 1000);

  // Get the components of the date (year, month, day, hours, minutes, seconds)
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 2)).slice(-2); // Adding 1 because months are zero-based
  const day = ("0" + date.getDate()).slice(-2);

  // Construct a string representing the date and time in a desired format
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

// Example usage:
const year = 2024;
const allMonths = getAllMonthsInYearWithTimestamps(year);
export const formattedMonths = allMonths.map((month) => ({
  ...month,
  fullDate: dayjs(convertUnixTimestampToNormalDate(month.unixTimestamp)).valueOf(),
  quarter: dayjs(convertUnixTimestamp(month.unixTimestamp)).quarter(),
}));

console.log(formattedMonths);
