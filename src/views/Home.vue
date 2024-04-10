<script setup>
import { onMounted, onUnmounted } from "vue";
import { useBankStore } from "@/stores/bank-api.js";

import TotalBalance from "@/components/TotalBalance.vue";
import TotalSum from "@/components/TotalSum.vue";
import ListDeals from "@/components/ListDeals.vue";

const store = useBankStore();

// store.getInfo();

store.run();

// Останавливаем таймер при уничтожении компонента
onUnmounted(() => {
  store.stopTimer();
});
</script>

<template>
  <div class="container">
    <!-- Total balance -->
    <total-balance :data="store.getSum" />
    <!-- Nalog -->
    <total-sum :data="store.getSumWithTaxPercent" :precent="store.getTaxFivePercent" />
  </div>
  <!-- Виписка -->
  <list-deals :data="store.filterData" />
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
