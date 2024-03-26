import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";
import RegisterView from "../views/Register.vue";
import LoginView from "../views/Login.vue";
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
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/check-email",
      name: "check-email",
      component: CheckEmail,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  console.log(to.name);
  // If logged in, or going to the Login page.
  if (token || to.name === "login" || to.name === "register") {
    // Continue to page.
    next();
  } else {
    // Not logged in, redirect to login.
    next({ name: "login" });
  }
});

export default router;
