import { axiosMono, axiosPrivat } from "@/api/axios";

const getInfoClient = () => {
  return axiosMono.get("/client-info");
};

const getTransactions = (walletId, from, to = "") => {
  return axiosMono.get(`/statement/${walletId}/${from}/${to}`);
};

const getExchangeRates = (date) => {
  return axiosPrivat.get();
};

const webHook = () => {
  return axiosMono.post("/webhook");
};

export default {
  getInfoClient,
  getTransactions,
  getExchangeRates,
  webHook,
};
