import { createApp } from "vue";

export function handleError(error, vm, info) {
  console.error("Vue.js Error:", error, vm, info);

  // Handle Axios errors specifically (if applicable)
  if (error.isAxiosError) {
    if (error.response) {
      // Server-side error
      console.error("Axios Server Error:", error.response.data, error.response.status);
      // Display a user-friendly message based on the status code
      vm.$toasted.error("An error occurred on the server. Please try again later.");
    } else if (error.request) {
      // Network error
      console.error("Axios Network Error:", error.request);
      vm.$toasted.error("A network error occurred. Please check your connection and try again.");
    } else {
      // Other Axios error
      console.error("Other Axios Error:", error.message);
      vm.$toasted.error("An unexpected error occurred. Please try again later.");
    }
  } else {
    // Handle other application errors (if needed)
    vm.$toasted.error("An unexpected error occurred in the application.");
  }
}
