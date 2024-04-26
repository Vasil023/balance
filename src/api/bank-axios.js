import { axiosMono, axiosPrivat } from "@/api/axios";

const getInfoClient = () => {
  return axiosMono.get("/personal/client-info");
};

const getTransactions = (walletId, from, to = "") => {
  return axiosMono.get(`/personal/statement/${walletId}/${from}/${to}`);
};

const getExchangeRates = (date) => {
  return axiosPrivat.get(`/pubinfo?exchange&coursid=5`);
};

const webHook = () => {
  return axiosMono.get("/bank/currency");
};

export default {
  getInfoClient,
  getTransactions,
  getExchangeRates,
  webHook,
};
