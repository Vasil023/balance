import { defineStore } from "pinia";
import { supabase } from "@/lib/supabaseClient";
import { useLocalStorage } from "@vueuse/core";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loading: false,
  }),

  actions: {
    async handleLogin(email, password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // persist state in localStorage
        useLocalStorage("token", {
          token: data.session.access_token,
        });

        this.router.push("/");
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      } finally {
        this.router.push("/");
      }
    },

    async Register(email, password) {
      try {
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (error) throw error;
        this.router.push("/check-email");
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      } finally {
        loading.value = false;
      }
    },

    checkSession() {
      supabase.auth.onAuthStateChange((_, _session) => {
        this.user = _session;
      });
    },
  },

  getters: {
    checkUser: (state) => state.user,
  },
});
