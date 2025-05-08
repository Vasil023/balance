import axios from "@/api/axios";

const getInfoClient = () => {
  return axios.get("/personal/client-info");
};

const getTransactions = (walletId, from, to) => {
  // Перевіряємо, чи передані параметри є числами
  if (!walletId || isNaN(from)) {
    throw new Error("Невірні параметри запиту");
  }

  // Якщо кінцева дата не вказана, використовуємо поточний час
  to = to || Math.floor(Date.now() / 1000);

  // Перевіряємо, чи не перевищує інтервал 31 день (в секундах)
  const maxInterval = 30 * 24 * 60 * 60; // 30 днів в секундах
  if (to - from > maxInterval) {
    console.warn("Інтервал перевищує 30 днів, API може повернути помилку");
  }

  return axios.get(`/personal/statement/${walletId}/${from}/${to}`);
};

// Add webhook setup function
const setupWebhook = (webhookUrl) => {
  return axios.post("/personal/webhook", { webHookUrl: webhookUrl });
};

export default {
  getInfoClient,
  getTransactions,
  setupWebhook,
};
