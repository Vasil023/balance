import axios from "@/api/axios";

const getInfoClient = () => {
  return axios.get("/client-info");
};

const getTransactions = (walletId, from, to = "") => {
  return axios.get(`/statement/${walletId}/${from}/${to}`);
};

const webHook = () => {
  return axios.post("/webhook");
};

export default {
  getInfoClient,
  getTransactions,
  webHook,
};
