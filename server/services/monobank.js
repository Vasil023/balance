const axios = require("axios");

// Monobank API base URL
const MONOBANK_API_URL = "https://api.monobank.ua";

// Create axios instance for Monobank API
const monobankApi = axios.create({
  baseURL: MONOBANK_API_URL,
  headers: {
    "X-Token": process.env.MONOBANK_TOKEN,
  },
});

// Handle Monobank API errors
monobankApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      let message = "";

      switch (status) {
        case 400:
          message = "Bad Request";
          break;
        case 403:
          message = "Forbidden - Invalid token";
          break;
        case 429:
          message = "Too Many Requests - Rate limit exceeded";
          break;
        case 500:
          message = "Internal Server Error";
          break;
        default:
          message = error.response.data?.errorDescription || "Unknown error";
      }

      const customError = new Error(message);
      customError.status = status;
      throw customError;
    }
    throw error;
  }
);

/**
 * Get client information
 * @returns {Promise<Object>} Client information
 */
exports.getClientInfo = async () => {
  return await monobankApi.get("/personal/client-info");
};

/**
 * Get account transactions
 * @param {string} account - Account ID
 * @param {number} from - Start time (unix timestamp)
 * @param {number} to - End time (unix timestamp), optional
 * @returns {Promise<Array>} List of transactions
 */
exports.getTransactions = async (account, from, to = "") => {
  const endpoint = to
    ? `/personal/statement/${account}/${from}/${to}`
    : `/personal/statement/${account}/${from}`;

  return await monobankApi.get(endpoint);
};

/**
 * Setup webhook for incoming transactions
 * @param {string} webHookUrl - URL to receive webhook notifications
 * @returns {Promise<Object>} Result
 */
exports.setupWebhook = async (webHookUrl) => {
  return await monobankApi.post("/personal/webhook", { webHookUrl });
};
