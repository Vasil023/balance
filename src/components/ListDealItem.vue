<script setup>
import { formatNumber } from "@/utils/formatNumber.js";

const props = defineProps({
  data: Array,
});

const ECV = import.meta.env.VITE_ECV;
</script>

<template>
  <li class="flex justify-between align-middle mt-3">
    <div class="sm:w-auto w-64">
      <!-- <img src="" alt=""> -->
      <p>{{ props.data.description }}</p>
      <span class="text-sm text-gray-300 leading-3">{{ props.data.comment }}</span>
    </div>
    <div class="flex flex-col">
      <div class="text-[#6CCE8C]">&#x20b4; {{ formatNumber(props.data.operationAmount) }}</div>
      <span class="text-sm text-right text-gray-300">
        &#x20b4; {{ formatNumber(props.data.operationAmount * 0.05 + ECV / 3) }}</span
      >
      <span class="text-sm text-right text-gray-300"
        >&#x20b4;
        {{ formatNumber(props.data.operationAmount - (props.data.operationAmount * 0.05 + ECV / 3)) }}</span
      >
    </div>
  </li>
</template>
