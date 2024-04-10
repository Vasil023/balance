<template>
  <div v-if="error" class="error">{{ error }}</div>
</template>

<script>
import { defineComponent } from "vue";
import { useErrorStore } from "@/stores/error";

export default defineComponent({
  setup() {
    const errorStore = useErrorStore();
    const error = errorStore.error;

    return { error };
  },
});
</script>

<style>
.error {
  color: red;
}
</style>
