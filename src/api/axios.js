import axios from "axios";
import { toast } from "vue3-toastify";

// Change baseURL to point to our server instead of Monobank directly
const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
axios.defaults.baseURL = serverUrl;

// Remove the token since authentication will be handled by the server
// axios.defaults.headers = {
//   "X-Token": "uMxDeozD0-vaYzE9RNNyM5vvyV9ODnij5bDJ3Wbk_p30",
// };

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let message = "";

    if (error.response) {
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
    } else {
      message = "Помилка з'єднання з сервером";
    }

    toast(message, {
      theme: "colored",
      type: "error",
      position: "top-center",
      autoClose: 5000,
      dangerouslyHTMLString: true,
    });

    return Promise.reject(error);
  }
);

export default axios;
