<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useUserStore } from "./stores/user";
import ErrorDisplay from "./components/ErrorDisplay.vue";

const store = useUserStore();

onMounted(() => {
  store.checkSession();
});
</script>

<template>
  <div class="wrapper">
    <!-- <home v-if="store.checkUser" /> -->
    <error-display />
    <RouterView />
  </div>
</template>

<style scoped>
.wrapper {
  /* width: 640px; */
  position: relative;
  height: 100vh;
  margin: 0 auto;
  padding-top: 50px;
  background: #f4f4f8;
}
</style>
