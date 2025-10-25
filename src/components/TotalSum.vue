<script setup>
import { formatNumber } from "@/utils/formatNumber.js";

const props = defineProps({
  data: Array,
  precent: Number,
});

const ECV = import.meta.env.VITE_ECV;
</script>

<template>
  <div class="bg-[#5B606E] shadow-gray-300 rounded-xl flex flex-col text-center mt-5 text-white p-5">
    <div class="text-lg">Загальна сума податку</div>
    <div class="text-3xl">{{ formatNumber(props.data) }} грн</div>

    <div class="sm:flex sm:justify-center">
      <div class="mt-5 overflow-x-auto flex justify-between text-lg sm:w-80">
        <div class="text-left">
          <p class="text-gray-400">ЄСВ</p>
          <span>{{ formatNumber(ECV) }} &#x20b4;</span>
        </div>
        <div class="text-left">
          <p class="text-gray-400">Податок на прибуток</p>
          <span>{{ formatNumber(precent) }} &#x20AC; </span>
        </div>
      </div>
    </div>
  </div>
</template>
