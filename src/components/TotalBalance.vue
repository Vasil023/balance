<template>
  <swiper :slides-per-view="1" :space-between="50" @swiper="onSwiper" @slideChange="onSlideChange">
    <swiper-slide v-for="i in 3" :key="i">
      <div class="flex bg-white shadow-gray-300 rounded-xl p-4">
        <div class="flex justify-between w-full">
          <div class="flex-col">
            <p class="text-[#B8B8B8] text-sm">Січ-Бер</p>
            <p class="text-base">Квартал 1</p>
          </div>
          <div>
            <p class="text-[#B8B8B8] text-sm">Оподаткований дохід</p>
            <p class="text-[#6CCE8C] text-base text-right">
              {{ formatNumber(data) }}
            </p>
            {{ balance }}
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>
<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { formatNumber } from "@/utils/formatNumber.js";
import "swiper/css";

const props = defineProps({
  data: Array,
});

const onSwiper = (swiper) => {
  // console.log(swiper);
};

const onSlideChange = (swiper) => {
  console.log("slide change +1", swiper);
};
</script>
