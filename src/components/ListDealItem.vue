<script setup>
const props = defineProps({
  data: Array,
});
</script>

<template>
  <li class="flex justify-between align-middle mt-3">
    <div>
      <!-- <img src="" alt=""> -->
      <p>{{ props.data.description }}</p>
      <span class="text-sm text-gray-300">{{ props.data.comment }}</span>
    </div>
    <div class="text-[#6CCE8C]">+ {{ props.data.operationAmount }} грн</div>
  </li>
</template>
