<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";

const email = ref("");
const password = ref("");

const store = useUserStore();
</script>

<template>
  <main class="w-full h-screen flex flex-col items-center justify-center px-4">
    <div class="max-w-sm w-full text-gray-600">
      <div class="text-center">
        <img src="https://floatui.com/logo.svg" width="150" class="mx-auto" />
        <div class="mt-5 space-y-2">
          <h3 class="text-gray-800 text-2xl font-bold sm:text-3xl">Register account</h3>
          <p class="">
            You have an account?
            <router-link :to="{ name: 'login' }" class="font-medium text-indigo-600 hover:text-indigo-500"
              >Sign up</router-link
            >
          </p>
        </div>
      </div>
      <form @submit.prevent="store.Register(email, password)" class="mt-8 space-y-5">
        <div>
          <label class="font-medium"> Email </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
        </div>
        <div>
          <label class="font-medium"> Password </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
        </div>
        <button
          class="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
        >
          Register
        </button>
        <div class="text-center">
          <a href="javascript:void(0)" class="hover:text-indigo-600">Forgot password?</a>
        </div>
      </form>
    </div>
  </main>
</template>
