<script setup>
import { formatNumber } from "@/utils/formatNumber.js";

const props = defineProps({
  data: Object, // Змінено з Array на Object для окремої транзакції
});

const ECV = import.meta.env.VITE_ECV;

// Функція для форматування дати
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("uk-UA");
};
</script>

<template>
  <li class="flex justify-between align-middle mt-3">
    <div class="sm:w-auto w-64">
      <p>{{ props.data.description }}</p>
      <span class="text-sm text-gray-300 leading-3">
        {{ formatDate(props.data.time) }} - {{ props.data.comment || "Без коментаря" }}
      </span>
    </div>
    <div class="flex flex-col">
      <div :class="props.data.amount > 0 ? 'text-[#6CCE8C]' : 'text-red-500'">
        &#x20AC; {{ formatNumber(props.data.amount) }}
      </div>
      <span v-if="props.data.amount > 0" class="text-sm text-right text-gray-300">
        Податок: &#x20AC; {{ formatNumber(props.data.amount * 0.06 + ECV / 3) }}
      </span>
      <span v-if="props.data.amount > 0" class="text-sm text-right text-gray-300">
        Чисто: &#x20AC; {{ formatNumber(props.data.amount - (props.data.amount * 0.06 + ECV / 3)) }}
      </span>
    </div>
  </li>
</template>
