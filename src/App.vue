<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useUserStore } from "./stores/user";
import Home from "./views/Home.vue";
import Register from "./views/Register.vue";

const store = useUserStore();

onMounted(() => {
  store.checkSession();
  // console.log(store.checkUser, "user");
  // console.log(user);
  // check session
  // supabase.auth.onAuthStateChange((_, _session) => {});
});
</script>

<template>
  <div class="wrapper">
    <!-- <home v-if="store.checkUser" /> -->
    <RouterView />
  </div>
</template>

<style scoped>
.wrapper {
  width: 640px;
  height: 100vh;
  margin: 0 auto;
  padding-top: 50px;
  background: #f4f4f8;
}
</style>
