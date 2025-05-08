import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";
import CheckEmail from "../views/CheckEmail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/check-email",
      name: "check-email",
      component: CheckEmail,
    },
  ],
});

export default router;
