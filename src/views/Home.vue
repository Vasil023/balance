<script setup>
import { onMounted, onUnmounted } from "vue";
import { useBankStore } from "@/stores/useBankStore";

import TotalBalance from "@/components/TotalBalance.vue";
import TotalSum from "@/components/TotalSum.vue";
import ListDeals from "@/components/ListDeals.vue";
import SceletonLoading from "@/components/SceletonLoading.vue";

const store = useBankStore();

// Запуск роботи магазину при монтуванні компонента
onMounted(async () => {
  await store.run();
});

// Останавливаем таймер при уничтожении компонента
onUnmounted(() => {
  store.stopTimer();
});
</script>

<template>
  <section>
    <div v-if="store.loading">
      <!-- Показуємо індикатор завантаження під час отримання транзакцій -->
      <div v-if="store.isTransactionsLoading" class="container mb-4">
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="text-center text-gray-600 mb-2">
            Завантаження транзакцій за 90 днів: {{ store.getTransactionLoadProgress }}%
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full"
              :style="{ width: `${store.getTransactionLoadProgress}%` }"
            ></div>
          </div>
        </div>
      </div>

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
