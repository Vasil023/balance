<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { formatNumber } from "@/utils/formatNumber.js";
import { useBankStore } from "@/stores/useBankStore";
import "swiper/css";

const props = defineProps({
  data: Array,
});

const store = useBankStore();
const quarter = localStorage.getItem("quarter");

const index = ref(quarter);
const quarters = ref([
  {
    name: "Січ-Бер",
    quarter: 1,
  },
  {
    name: "Квіт-Чер",
    quarter: 2,
  },
  {
    name: "Серп-Вер",
    quarter: 3,
  },
  {
    name: "Жовт-Груд",
    quarter: 4,
  },
]);

const onSlideChange = (swiper) => {
  store.getTransactionsToQuarter(swiper.realIndex + 1);
};
</script>

<template>
  <swiper :slides-per-view="1" :space-between="50" @slideChangeTransitionEnd="onSlideChange" ref="swiper">
    <swiper-slide v-for="i in quarters" :key="i">
      <div class="flex bg-white shadow-gray-300 rounded-xl p-4">
        <div class="flex justify-between w-full">
          <div class="flex-col">
            <p class="text-[#B8B8B8] text-sm">{{ i.name }}</p>
            <p class="text-base">Квартал {{ i.quarter }}</p>
          </div>
          <div>
            <p class="text-[#B8B8B8] text-sm">Оподаткований дохід</p>
            <p class="text-[#6CCE8C] text-base text-right">&#x20b4; {{ formatNumber(data) }}</p>
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>
