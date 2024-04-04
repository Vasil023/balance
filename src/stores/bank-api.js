import { defineStore } from "pinia";
import { supabase } from "@/lib/supabaseClient";
import api from "@/api/bank-axios.js";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { formattedMonths } from "@/utils/formatedDate";
import { isNonNegative } from "@/utils/isNonNegative";
import { useLocalStorage } from "@vueuse/core";

dayjs.extend(quarterOfYear);

export const useBankStore = defineStore("bank", {
  state: () => ({
    data: [],
    amount: null,
    loading: false,
    keys: [],
    index: localStorage.getItem("index") || 0,
    timer: null,
  }),

  actions: {
    async run() {
      await this.getTransactionsForDataBase();
    },

    async getTransactionsForDataBase() {
      this.data = [];

      let { data: Balance, error } = await supabase.from("Balance").select("*");

      switch (Balance.length) {
        case 0:
          localStorage.removeItem("index");
          console.log("База данных пуста");
          break;
      }

      this.data = Balance;

      await this.startTimer();
    },

    startTimer() {
      this.keys = Object.keys(formattedMonths);
      this.index = localStorage.getItem("index") || 0;
      this.timer = setInterval(this.printNextElement, 10000);
      this.printNextElement(); // Начать вывод первого элемента сразу
    },

    stopTimer() {
      clearInterval(this.timer); // Остановить интервал после вывода всех элементов
    },

    /**
     * Prints the next element if available. If all elements are printed, stops the timer.
     */
    async printNextElement() {
      if (this.index <= dayjs().month()) {
        const { month, unixTimestamp, fullDate, quarter } = formattedMonths[this.keys[this.index]];

        await this.getAllTransactions(unixTimestamp, fullDate - 86400, quarter);

        this.index++;
      } else {
        this.upsertData();
        this.stopTimer();
        useLocalStorage("index", this.index);
      }
    },

    async upsertData() {
      const { data, error } = await supabase.from("Balance").insert(this.data).select();

      if (error) throw error;
    },

    async getAllTransactions(currentYear, nextYear, quarter) {
      const res = await (async () => {
        try {
          return await api.getTransactions("_3xe8hv_38-86EWSbvZFyA", currentYear, nextYear);
        } catch (error) {
          this.stopTimer();
          throw error;
        }
      })();

      const transactions = res.data.filter((i) => isNonNegative(i.operationAmount));
      this.data.push(
        ...transactions.map((i) => ({
          operationAmount: i.operationAmount,
          description: i.description,
          comment: i.comment,
          quarter,
        }))
      );
    },
  },

  getters: {
    getSum: (state) =>
      state.data.filter((i) => i.quarter === 1).reduce((acc, item) => acc + item.operationAmount, 0),

    getTransactionsToQuarter: (state) => state.data.filter((i) => i.quarter === 1),
  },
});
