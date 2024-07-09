import axios from "axios";
import { toast } from "vue3-toastify";

axios.defaults.baseURL = "https://api.monobank.ua";
axios.defaults.headers = {
  "X-Token": "uXEb3eNHThCxm6ajZ1LlV1QzMucAg5Pu8nyWRsipx0cY",
};

axios.interceptors.response.use(
  function (response) {
    // Любой код состояния, находящийся в диапазоне 2xx, вызывает срабатывание этой функции
    // Здесь можете сделать что-нибудь с ответом

    return response;
  },
  function (error) {
    // Любые коды состояния, выходящие за пределы диапазона 2xx, вызывают срабатывание этой функции
    // Здесь можете сделать что-то с ошибкой ответа
    let message = "";

    switch (error.response.status) {
      case 400:
        message = "Помилка запиту";
        break;
      case 429:
        message = "Перевищено ліміт запитів спробуйте через 1 хвилину";
        break;
      case 500:
        message = "Помилка сервера";
        break;
      default:
        message = error.message;
    }

    toast(message, {
      theme: "colored",
      type: "error",
      position: "top-center",
      autoClose: 5000,
      dangerouslyHTMLString: true,
    });
  }
);

export default axios;
