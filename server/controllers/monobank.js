const monobankService = require("../services/monobank");

exports.getClientInfo = async (req, res) => {
  try {
    const clientInfo = await monobankService.getClientInfo();
    res.json(clientInfo);
  } catch (error) {
    console.error("Error fetching client info:", error);
    res.status(error.status || 500).json({
      error: error.message || "Failed to fetch client info",
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { account, from, to } = req.params;

    if (!account || !from) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const transactions = await monobankService.getTransactions(account, from, to);
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(error.status || 500).json({
      error: error.message || "Failed to fetch transactions",
    });
  }
};

exports.setupWebhook = async (req, res) => {
  try {
    const { webHookUrl } = req.body;

    if (!webHookUrl) {
      return res.status(400).json({ error: "Missing webHookUrl parameter" });
    }

    const result = await monobankService.setupWebhook(webHookUrl);
    res.json(result);
  } catch (error) {
    console.error("Error setting up webhook:", error);
    res.status(error.status || 500).json({
      error: error.message || "Failed to setup webhook",
    });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const data = req.body;

    // Process incoming webhook data
    // According to Monobank API, this will include transaction data
    console.log("Received webhook:", JSON.stringify(data));

    // Check if it's an income transaction to ФОП account
    if (data.data && data.data.account && data.data.statementItem && data.data.statementItem.amount > 0) {
      // Here you can handle the income transaction
      // For example, store it in a database or trigger a notification
      console.log("Received income transaction:", data.data.statementItem);
    }

    // Monobank expects a 200 OK response within 5 seconds
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error handling webhook:", error);
    // Still return 200 to avoid retries
    res.status(200).json({ status: "error", message: error.message });
  }
};
