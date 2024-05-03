/* eslint-disable no-console */

import { register } from "register-service-worker";

if (import.meta.env.PROD) {
  register(`${import.meta.env.VITE_BASE_URL}registerSW.js`, {
    offline() {
      console.log("App is now offline");
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated() {
      console.log("New content is available; please refresh.");
    },
    error(error) {
      console.error("Error during service worker registration:", error);
      console.log(
        import.meta.env.PROD ? "App is running in production mode" : "App is running in development mode"
      );
    },
  });
}
