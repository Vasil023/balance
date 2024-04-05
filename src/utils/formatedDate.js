import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

dayjs.extend(quarterOfYear);

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

export function getQuarterMonths(monthTimestamp) {
  // Перевірка чи час переданий в мілісекундах і конвертація, якщо потрібно
  if (String(monthTimestamp).length === 13) {
    monthTimestamp /= 1000; // Конвертація мілісекунд в секунди
  }

  const startOfMonth = dayjs(monthTimestamp * 1000).startOf("month");
  const endOfMonth = dayjs(monthTimestamp * 1000).endOf("month");

  const quarterStart = startOfMonth.startOf("quarter");
  const quarterEnd = endOfMonth.endOf("quarter");

  const result = [];
  const quarter = quarterStart.quarter(); // Номер кварталу

  for (let month = 0; month < 3; month++) {
    const start = quarterStart.add(month, "month").unix();
    const end = quarterStart
      .add(month + 1, "month")
      .subtract(1, "second")
      .unix();
    const monthNumber = quarterStart.add(month, "month").month() + 1; // Номер місяця
    result.push({ quarter, month: monthNumber, start, end });
  }
  return result;
}
