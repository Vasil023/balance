import { defineStore } from "pinia";
import { supabase } from "@/lib/supabaseClient";
import api from "@/api/bank-axios.js";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { formattedMonths } from "@/utils/formatedDate";
import { isNonNegative } from "@/utils/isNonNegative";

dayjs.extend(quarterOfYear);

export const useBankStore = defineStore("bank", {
  state: () => ({
    data: [],
    amount: null,
    loading: false,
    keys: [],
    index: 0,
    timer: null,
  }),

  actions: {
    async run() {
      await this.getTransactionsForDataBase();

      // await this.startTimer();
    },

    async getTransactionsForDataBase() {
      let { data: Balance, error } = await supabase.from("Balance").select("*");

      this.data = Balance;
    },

    /**
     * Start the timer and initialize necessary variables.
     *
     * @return {void}
     */
    startTimer() {
      this.keys = Object.keys(formattedMonths);
      this.index = 0;
      this.timer = setInterval(this.printNextElement, 2000);
      this.printNextElement(); // Начать вывод первого элемента сразу
      this.data = [];
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

        if (this.data.length !== 0) return;
        console.log("startTimer");
        // await this.getAllTransactions(unixTimestamp, fullDate, quarter);

        this.index++;
      } else {
        this.upsertData();
        this.stopTimer();
      }
    },

    async upsertData() {
      const { data, error } = await supabase.from("Balance").insert(this.data).select();

      if (error) throw error;
    },

    /**
     * Retrieves all transactions for the specified year range and quarter.
     *
     * @param {number} currentYear - The current year for transactions.
     * @param {number} nextYear - The next year for transactions.
     * @param {string} quarter - The quarter for transactions.
     */
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
      state.data.forEach((i) => {
        i;
      }),
  },
});
