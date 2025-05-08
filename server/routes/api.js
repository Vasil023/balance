const express = require("express");
const monobankController = require("../controllers/monobank");

const router = express.Router();

// Client info endpoint
router.get("/personal/client-info", monobankController.getClientInfo);

// Transactions endpoint
router.get("/personal/statement/:account/:from/:to", monobankController.getTransactions);

// Webhook setup endpoint
router.post("/personal/webhook", monobankController.setupWebhook);

// Webhook receiver endpoint
router.post("/webhook/mono", monobankController.handleWebhook);

module.exports = router;
