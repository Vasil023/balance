<script setup>
import ListDealItem from "./ListDealItem.vue";
</script>

<template>
  <div class="bg-white min-h-screen mt-8 p-4 rounded-t-xl w-full">
    <ul class="container">
      <list-deal-item v-for="i in 3" :key="i" />
    </ul>
  </div>
</template>
