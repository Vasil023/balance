import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { useLocalStorage } from "@vueuse/core";

dayjs.extend(quarterOfYear);

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

  useLocalStorage("quarter", quarter);

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
