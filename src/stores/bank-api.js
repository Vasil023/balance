import { defineStore } from "pinia";
import { supabase } from "@/lib/supabaseClient";
import api from "@/api/bank-axios.js";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { getQuarterMonths } from "@/utils/formatedDate";
import { isNonNegative } from "@/utils/isNonNegative";
import { useLocalStorage } from "@vueuse/core";

dayjs.extend(quarterOfYear);

export const useBankStore = defineStore("bank", {
  state: () => ({
    data: [],
    amount: null,
    loading: false,
    index: 0,
    timer: null,
    mount: [],
  }),

  actions: {
    async run() {
      await this.getTransactionsForDataBase();
    },

    async getTransactionsForDataBase() {
      this.data = [];

      let { data: Balance, error } = await supabase.from("Balance").select("*");

      if (error) {
        // Обробка помилки
        throw error;
      }

      this.data = Balance;
      this.startTimer();
    },

    startTimer() {
      this.mount = getQuarterMonths(
        this.data.length
          ? this.data[this.data.length - 1].time
          : JSON.parse(localStorage.getItem("trust:cache:timestamp")).timestamp
      );
      this.timer = setInterval(this.printNextElement, 2000);
      this.printNextElement();
    },

    async stopTimer() {
      clearInterval(this.timer);
    },

    async printNextElement() {
      if (this.index < this.mount.length) {
        const { start, end, quarter } = this.mount[this.index];
        await this.getAllTransactions(start, end, quarter);
        this.index++;
      } else {
        this.upsertData();
        this.stopTimer();
      }
    },

    async upsertData() {
      const { data, error } = await supabase.from("Balance").insert(this.data).select();

      if (error) {
        // Обробка помилки
        throw error;
      }
    },

    async getAllTransactions(currentYear, nextYear, quarter) {
      try {
        const res = await api.getTransactions("_3xe8hv_38-86EWSbvZFyA", currentYear, nextYear);

        if (res.data.length === 0) {
          this.upsertData();
          this.stopTimer();
        }

        const transactions = res.data.filter((i) => isNonNegative(i.operationAmount));
        this.data.push(
          ...transactions.map((i) => ({
            operationAmount: i.operationAmount,
            description: i.description,
            comment: i.comment,
            time: i.time,
            quarter,
          }))
        );
      } catch (error) {
        this.stopTimer();
        throw error;
      }
    },
  },

  getters: {
    getSum: (state) =>
      state.data.filter((i) => i.quarter === 2).reduce((acc, item) => acc + item.operationAmount, 0),

    getTransactionsToQuarter: (state) => state.data.filter((i) => i.quarter === 2),
  },
});
