import { defineStore } from "pinia";
import { supabase } from "@/lib/supabaseClient";
import api from "@/api/bank-axios.js";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { getQuarterMonths } from "@/utils/formatedDate";
import { isNonNegative } from "@/utils/isNonNegative";

dayjs.extend(quarterOfYear);

export const useBankStore = defineStore("bank", {
  state: () => ({
    data: [],
    filterData: [],
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

      this.getTransactionsToQuarter(+localStorage.getItem("quarter"));

      this.startTimer();
    },

    startTimer() {
      // this.mount = getQuarterMonths(
      //   this.data.length
      //     ? this.data[this.data.length - 1].time
      //     : JSON.parse(localStorage.getItem("trust:cache:timestamp")).timestamp
      // );
      this.mount = getQuarterMonths(1675950305);
      this.timer = setInterval(this.printNextElement, 60000);
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
        // this.upsertData();
        this.stopTimer();
      }
    },

    async getAllTransactions(currentYear, nextYear, quarter) {
      try {
        const { data } = await api.getTransactions("_3xe8hv_38-86EWSbvZFyA", currentYear, nextYear);

        if (data.length === 0) return;

        const filteredTransactions = data
          .filter((i) => isNonNegative(i.operationAmount))
          .map(({ operationAmount, description, comment, time }) => ({
            operationAmount,
            description,
            comment,
            time,
            quarter,
          }));

        this.upsertData(filteredTransactions);
      } catch (error) {
        this.stopTimer();
        throw error;
      }
    },

    async upsertData(obg) {
      const { data, error } = await supabase.from("Balance").insert(obg).select();

      if (error) {
        // throw error;
        console.log("error");
      }

      if (data === null) return;

      data.forEach((i) => {
        this.data.push(i);
      });
    },

    getTransactionsToQuarter(index) {
      console.log(index);
      const res = this.data.filter((i) => i?.quarter === index);

      return (this.filterData = res);
    },
  },

  getters: {
    getSum: (state) => state.filterData.reduce((acc, item) => acc + item.operationAmount, 0),

    getSumWithTaxPercent(state) {
      const quarterTotal = state.filterData.reduce(
        (sum, transaction) => sum + transaction.operationAmount,
        0
      );

      // const tax = quarterTotal * 0.05;

      return quarterTotal ? quarterTotal * 0.05 + 468600 : 0;
    },
  },
});
