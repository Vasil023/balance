<template>
  <swiper :slides-per-view="1" :space-between="50" @swiper="onSwiper" @slideChange="onSlideChange">
    <swiper-slide v-for="i in 3" :key="i">
      <div class="flex bg-white shadow-gray-300 rounded-xl p-4">
        <div class="flex justify-between w-full">
          <div class="flex-col">
            <p class="text-[#B8B8B8] text-sm">Січ-Бер</p>
            <p class="text-xl">Квартал 1</p>
          </div>
          <div>
            <p class="text-[#B8B8B8] text-sm">Оподаткований дохід</p>
            <p class="text-[#6CCE8C] text-xl text-right">{{ data }} грн</p>
            {{ balance }}
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },

  props: {
    data: Array,
  },

  setup() {
    const onSwiper = (swiper) => {
      // console.log(swiper);
    };
    const onSlideChange = (swiper) => {
      console.log("slide change +1", swiper);
    };

    return {
      onSwiper,
      onSlideChange,
    };
  },
};
</script>
