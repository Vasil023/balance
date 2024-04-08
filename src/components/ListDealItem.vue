<script setup>
import { formatNumber } from "@/utils/formatNumber.js";

const props = defineProps({
  data: Array,
});
</script>

<template>
  <li class="flex justify-between align-middle mt-3">
    <div class="w-64">
      <!-- <img src="" alt=""> -->
      <p>{{ props.data.description }}</p>
      <span class="text-sm text-gray-300 leading-3">{{ props.data.comment }}</span>
    </div>
    <div class="text-[#6CCE8C]">&#x20b4; {{ formatNumber(props.data.operationAmount) }}</div>
  </li>
</template>
