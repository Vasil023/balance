<template>
  <div class="relative">
    <div role="status" class="loading space-y-8 animate-pulse rtl:space-x-reverse">
      <div class="container">
        <div class="sm:w-[calc(100%-32px)] w-full h-[74px] bg-gray-300 rounded-xl dark:bg-gray-700"></div>
        <div
          class="sm:w-[calc(100%-32px)] w-full h-[170px] bg-gray-300 rounded-xl dark:bg-gray-700 mt-5"
        ></div>
      </div>

      <div class="w-full bg-white min-h-screen mt-8 p-4 rounded-t-xl">
        <div class="container">
          <div class="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 mt-12"></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>

          <!-- Прогрес-бар для відображення процесу завантаження транзакцій -->
          <div v-if="store.isTransactionsLoading" class="mt-8">
            <div class="text-center text-gray-600 mb-2">
              Завантаження транзакцій: {{ store.getTransactionLoadProgress }}%
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                class="bg-blue-600 h-2.5 rounded-full"
                :style="{ width: `${store.getTransactionLoadProgress}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="">
        <div class="container">
          <div class="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 mt-4"></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
        </div>
      </div>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script setup>
import { useBankStore } from "@/stores/useBankStore";

const store = useBankStore();
</script>

<style scoped>
.loading {
  z-index: 999;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}
</style>
