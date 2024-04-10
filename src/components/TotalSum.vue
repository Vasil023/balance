<script setup>
import { formatNumber } from "@/utils/formatNumber.js";

const props = defineProps({
  data: Array,
});
</script>

<template>
  <div class="bg-[#5B606E] shadow-gray-300 rounded-xl flex flex-col text-center mt-5 text-white p-5">
    <div class="text-sm">Загальна сума податку</div>
    <div class="text-3xl">{{ formatNumber(props.data) }} грн</div>
  </div>
</template>
