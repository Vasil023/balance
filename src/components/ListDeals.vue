<script setup>
import ListDealItem from "./ListDealItem.vue";

const props = defineProps({
  data: Array,
});
</script>

<template>
  <div class="bg-white min-h-screen mt-8 p-4 rounded-t-xl w-full">
    <ul class="container">
      <list-deal-item v-for="(item, i) in props.data" :key="i" :data="item" />

      <div v-if="props.data.length === 0" class="text-center text-gray-400">У вас немає транзакцій</div>
    </ul>
  </div>
</template>
