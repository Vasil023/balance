/**
 * Функція для очищення об'єкта від некопіюваних властивостей
 * @param {Object} data - Об'єкт для санітизації
 * @returns {Object} - Очищений об'єкт
 */
export function sanitizeData(data) {
  if (!data) return null;

  // Якщо це примітивний тип - повертаємо як є
  if (typeof data !== "object") return data;

  // Якщо це масив - обробляємо кожен елемент рекурсивно
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  // Для об'єктів створюємо нову копію без функцій та циклічних посилань
  const cleanObject = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Пропускаємо функції
      if (typeof data[key] === "function") continue;

      // Обробляємо вкладені об'єкти рекурсивно
      cleanObject[key] = sanitizeData(data[key]);
    }
  }

  return cleanObject;
}
