<script setup>
import { onMounted, onUnmounted } from "vue";
import { useBankStore } from "@/stores/useBankStore";

import TotalBalance from "@/components/TotalBalance.vue";
import TotalSum from "@/components/TotalSum.vue";
import ListDeals from "@/components/ListDeals.vue";
import SceletonLoading from "@/components/SceletonLoading.vue";

const store = useBankStore();

// store.getInfo();

store.run();

// Останавливаем таймер при уничтожении компонента
onUnmounted(() => {
  store.stopTimer();
});
</script>

<template>
  <section>
    <div v-if="store.loading">
      <div class="container">
        <!-- Total balance -->
        <total-balance :data="store.getSum" />
        <!-- Nalog -->
        <total-sum :data="store.getSumWithTaxPercent" :precent="store.getTaxFivePercent" />
      </div>
      <!-- Виписка -->
      <list-deals :data="store.filterData" />
    </div>
    <SceletonLoading v-else />
  </section>
</template>

<style></style>
