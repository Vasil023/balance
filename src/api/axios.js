import axios from "axios";

axios.defaults.baseURL = "https://api.monobank.ua/personal";
axios.defaults.headers = {
  "X-Token": "uXEb3eNHThCxm6ajZ1LlV1QzMucAg5Pu8nyWRsipx0cY",
};

export default axios;
