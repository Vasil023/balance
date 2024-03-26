<script setup>
import { onMounted, computed, ref } from "vue";
import axios from "axios";

import TotalBalance from "@/components/TotalBalance.vue";
import TotalSum from "@/components/TotalSum.vue";

const data = ref({});
const list = ref(0);

onMounted(() => {
  // console.log(dayjs("2010-04-01").quarter(), dayjs("2010-04-01").quarter(2));
  // axios
  //   .get("https://api.monobank.ua/personal/client-info", {
  //     headers: {
  //       "X-Token": "uXEb3eNHThCxm6ajZ1LlV1QzMucAg5Pu8nyWRsipx0cY",
  //     },
  //   })
  //   .then((res) => (data.value = res.data.accounts.filter((i) => i.type === "fop")));
  // axios
  //   .get("https://api.monobank.ua/personal/statement/_3xe8hv_38-86EWSbvZFyA/1709244000", {
  //     headers: {
  //       "X-Token": "uXEb3eNHThCxm6ajZ1LlV1QzMucAg5Pu8nyWRsipx0cY",
  //     },
  //   })
  //   .then((res) => (list.value = res.data.filter((i) => i.invoiceId)));
});
</script>

<template>
  <div class="container">
    <!-- Total balance -->
    <total-balance />
    <!-- Nalog -->
    <total-sum />
    <!-- Виписка -->
  </div>
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
