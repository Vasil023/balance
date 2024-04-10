import { defineStore } from "pinia";

export const useErrorStore = defineStore({
  id: "error",

  state: () => ({
    error: null,
  }),

  actions: {
    setError(errorMessage) {
      this.error = errorMessage;
    },
    clearError() {
      this.error = null;
    },
  },
});
