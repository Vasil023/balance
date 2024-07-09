import axios from "@/api/axios";

const getInfoClient = () => {
  return axios.get("/personal/client-info");
};

const getTransactions = (walletId, from, to = "") => {
  return axios.get(`/personal/statement/${walletId}/${from}/${to}`);
};

const webHook = () => {
  return axios.get("/bank/currency");
};

export default {
  getInfoClient,
  getTransactions,
  webHook,
};
