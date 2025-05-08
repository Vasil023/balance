import { defineStore } from "pinia";
import bankApi from "@/api/bank-axios";
import { getQuarterMonths } from "@/utils/formatedDate";
import { useLocalStorage } from "@vueuse/core";
import { toast } from "vue3-toastify";
import IndexedDBManager from "@/utils/indexedDB";
import { sanitizeData } from "@/utils/sanitizeData";

export const useBankStore = defineStore("bank", {
  state: () => ({
    client: null,
    transactions: [],
    filteredTransactions: [],
    currentQuarter: 1,
    loading: false,
    timer: null,
    dbManager: new IndexedDBManager("MonobankDB", 1),
    isLoadingTransactions: false,
    transactionLoadProgress: 0,
    webhookSetup: false,
  }),

  actions: {
    async initDB() {
      try {
        await this.dbManager.open();
      } catch (error) {
        console.error("Помилка ініціалізації IndexedDB:", error);
        toast("Помилка доступу до локального сховища", {
          type: "error",
        });
      }
    },

    async getInfo() {
      try {
        this.loading = false;
        // Спробуємо спочатку отримати дані з API
        const response = await bankApi.getInfoClient();
        this.client = response.data;

        // Зберігаємо ID гаманця для подальшого використання
        if (this.client.accounts && this.client.accounts.length > 0) {
          // Спочатку шукаємо акаунт з типом 'fop' (ФОП) і позитивним балансом
          const fopAccountWithBalance = this.client.accounts.find(
            (account) => account.type === "fop" && account.balance > 0
          );

          // Якщо знайдено гаманець ФОП з позитивним балансом
          if (fopAccountWithBalance) {
            useLocalStorage("wallet", fopAccountWithBalance.id);
            console.log("Знайдено гаманець ФОП з позитивним балансом:", fopAccountWithBalance.id);
          } else {
            // Шукаємо будь-який гаманець з позитивним балансом
            const anyAccountWithBalance = this.client.accounts.find((account) => account.balance > 0);

            if (anyAccountWithBalance) {
              useLocalStorage("wallet", anyAccountWithBalance.id);
              console.log("Використовується гаманець з позитивним балансом:", anyAccountWithBalance.id);
            } else {
              // Якщо немає гаманців з позитивним балансом, використовуємо перший
              useLocalStorage("wallet", this.client.accounts[0].id);
              console.log(
                "Усі гаманці мають нульовий баланс, використовується перший гаманець:",
                this.client.accounts[0].id
              );
            }
          }
        }

        // Зберігаємо інформацію клієнта в IndexedDB
        await this.saveClientInfoToIndexedDB(this.client);

        return this.client;
      } catch (error) {
        console.error("Помилка отримання інформації клієнта:", error);
        toast("Помилка отримання інформації клієнта", {
          type: "error",
        });

        // У разі помилки спробуємо отримати дані з IndexedDB
        await this.getClientInfoFromIndexedDB();
      } finally {
        this.loading = true;
      }
    },

    async saveClientInfoToIndexedDB(clientInfo) {
      try {
        if (!this.dbManager.db) {
          await this.initDB();
        }

        // Санітизація даних для безпечного збереження в IndexedDB
        const sanitizedData = sanitizeData(clientInfo);

        // Додаємо унікальний ідентифікатор для сховища
        const clientData = {
          ...sanitizedData,
          clientId: sanitizedData.clientId || "default",
        };

        // Оновлюємо або додаємо інформацію про клієнта
        await this.dbManager.update("clientInfo", clientData);

        // Зберігаємо час останнього оновлення
        localStorage.setItem("lastClientInfoUpdate", Date.now().toString());
      } catch (error) {
        console.error("Помилка збереження інформації клієнта в IndexedDB:", error);
      }
    },

    async getClientInfoFromIndexedDB() {
      try {
        if (!this.dbManager.db) {
          await this.initDB();
        }

        const clientInfo = await this.dbManager.get("clientInfo", "default");
        if (clientInfo) {
          this.client = clientInfo;
        }
      } catch (error) {
        console.error("Помилка отримання інформації клієнта з IndexedDB:", error);
      }
    },

    /**
     * Розбиває запит до API на менші періоди, щоб обійти обмеження Monobank API
     * @param {string} walletId - ID гаманця
     * @param {number} startDate - Початкова дата (в секундах)
     * @param {number} endDate - Кінцева дата (в секундах)
     * @returns {Promise<Array>} - Об'єднаний масив транзакцій
     */
    async getTransactionsWithPagination(walletId, startDate, endDate) {
      // Розмір одного часового інтервалу в секундах (30 днів)
      const chunkSize = 30 * 24 * 60 * 60;

      // Масив для зберігання всіх транзакцій
      let allTransactions = [];

      // Масив для зберігання проміжків часу
      const timeChunks = [];

      // Розбиваємо діапазон дат на інтервали по 30 днів
      for (let currentTime = startDate; currentTime < endDate; currentTime += chunkSize) {
        // Обчислюємо кінцеву дату для поточного інтервалу
        const chunkEndTime = Math.min(currentTime + chunkSize, endDate);
        timeChunks.push({ from: currentTime, to: chunkEndTime });
      }

      // Загальна кількість запитів
      const totalChunks = timeChunks.length;

      // Скидаємо прогрес
      this.transactionLoadProgress = 0;
      this.isLoadingTransactions = true;

      try {
        // Виконуємо запити послідовно для кожного інтервалу
        for (let i = 0; i < timeChunks.length; i++) {
          const { from, to } = timeChunks[i];

          try {
            const response = await bankApi.getTransactions(walletId, from, to);

            // Якщо є результати - додаємо їх до загального масиву
            if (response.data && Array.isArray(response.data)) {
              // Перевіряємо на дублікати перед додаванням
              const uniqueTransactions = response.data.filter(
                (newTx) => !allTransactions.some((existingTx) => existingTx.id === newTx.id)
              );

              allTransactions = [...allTransactions, ...uniqueTransactions];
            }

            // Оновлюємо прогрес
            this.transactionLoadProgress = Math.floor(((i + 1) / totalChunks) * 100);

            // Невелика затримка між запитами, щоб не перевантажувати API
            if (i < timeChunks.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          } catch (error) {
            console.error(
              `Помилка при отриманні транзакцій за період ${new Date(
                from * 1000
              ).toLocaleDateString()} - ${new Date(to * 1000).toLocaleDateString()}:`,
              error
            );
            // Продовжуємо виконання для інших інтервалів
            toast(
              `Не вдалося отримати деякі дані за період ${new Date(
                from * 1000
              ).toLocaleDateString()} - ${new Date(to * 1000).toLocaleDateString()}`,
              {
                type: "warning",
              }
            );
          }
        }

        // Сортуємо транзакції за датою (від нової до старої)
        allTransactions.sort((a, b) => b.time - a.time);

        return allTransactions;
      } finally {
        this.isLoadingTransactions = false;
        this.transactionLoadProgress = 0;
      }
    },

    async getTransactions() {
      try {
        this.loading = false;
        const walletId = localStorage.getItem("wallet") || "";

        if (!walletId) {
          await this.getInfo(); // Якщо немає ID гаманця, отримуємо інформацію клієнта
        }

        // Отримання ендпоінтів для 90 днів
        const now = Math.floor(Date.now() / 1000);
        const ninetyDaysAgo = now - 90 * 24 * 60 * 60;

        // Використовуємо пагінацію, щоб отримати транзакції за 90 днів
        const allTransactions = await this.getTransactionsWithPagination(walletId, ninetyDaysAgo, now);

        // Фільтруємо тільки надходження (позитивні суми)
        this.transactions = allTransactions.filter((transaction) => transaction.amount > 0);

        // Зберігаємо транзакції в IndexedDB
        await this.saveTransactionsToIndexedDB(this.transactions);

        // Фільтруємо транзакції для поточного кварталу
        this.filterTransactionsByQuarter(this.currentQuarter);

        return this.transactions;
      } catch (error) {
        console.error("Помилка отримання транзакцій:", error);
        toast("Помилка отримання виписки. Використовуємо збережені дані.", {
          type: "warning",
        });

        // У разі помилки спробуємо отримати дані з IndexedDB
        await this.getTransactionsFromIndexedDB();
      } finally {
        this.loading = true;
      }
    },

    async getTransactionsToQuarter(quarter) {
      this.currentQuarter = quarter;
      this.filterTransactionsByQuarter(quarter);
    },

    filterTransactionsByQuarter(quarter) {
      // Отримуємо місяці для вказаного кварталу
      const currentDate = new Date();
      const currentTimestamp = Math.floor(currentDate.getTime() / 1000);
      const quarterMonths = getQuarterMonths(currentTimestamp);

      // Фільтруємо транзакції, які відносяться до вказаного кварталу
      const quarterData = quarterMonths.find((q) => q.quarter === parseInt(quarter));

      if (quarterData) {
        this.filteredTransactions = this.transactions.filter(
          (transaction) => transaction.time >= quarterData.start && transaction.time <= quarterData.end
        );
      }
    },

    // Метод для збереження транзакцій в IndexedDB
    async saveTransactionsToIndexedDB(transactions) {
      try {
        if (!this.dbManager.db) {
          await this.initDB();
        }

        // Очищаємо сховище перед додаванням нових даних
        await this.dbManager.clear("transactions");

        // Санітизуємо масив транзакцій
        const sanitizedTransactions = sanitizeData(transactions);

        // Фільтруємо тільки транзакції з позитивною сумою (надходження)
        const positiveTransactions = sanitizedTransactions.filter((transaction) => transaction.amount > 0);

        // Додаємо кожну транзакцію окремо
        for (const transaction of positiveTransactions) {
          // Додаємо унікальний ідентифікатор, якщо його немає
          const transactionWithId = {
            ...transaction,
            id: transaction.id || `${transaction.time}_${Math.random().toString(36).substr(2, 9)}`,
          };
          await this.dbManager.add("transactions", transactionWithId);
        }

        // Зберігаємо час останнього оновлення
        localStorage.setItem("lastTransactionsUpdate", Date.now().toString());
      } catch (error) {
        console.error("Помилка збереження транзакцій в IndexedDB:", error);
      }
    },

    // Метод для отримання транзакцій з IndexedDB
    async getTransactionsFromIndexedDB() {
      try {
        if (!this.dbManager.db) {
          await this.initDB();
        }

        this.transactions = await this.dbManager.getAll("transactions");
        this.filterTransactionsByQuarter(this.currentQuarter);
      } catch (error) {
        console.error("Помилка отримання транзакцій з IndexedDB:", error);
        this.transactions = [];
        this.filteredTransactions = [];
      }
    },

    async setupWebhook() {
      try {
        // Setup webhook for ФОП account
        const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || window.location.origin + "/api/webhook/mono";
        await bankApi.setupWebhook(webhookUrl);
        this.webhookSetup = true;
        toast("Webhook налаштовано успішно", { type: "success" });
      } catch (error) {
        console.error("Помилка налаштування webhook:", error);
        toast("Не вдалося налаштувати webhook", { type: "error" });
      }
    },

    // Метод для періодичного оновлення даних
    async run() {
      await this.initDB();

      await this.getInfo();
      await this.getTransactions();

      // Setup webhook if not already done
      if (!this.webhookSetup) {
        await this.setupWebhook();
      }

      // Запускаємо таймер для оновлення даних кожні 5 хвилин
      // this.timer = setInterval(() => {
      //   this.getTransactions();
      // }, 5 * 60 * 1000);
    },

    // Зупинка таймера
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      // Закриваємо з'єднання з базою даних
      this.dbManager.close();
    },
  },

  getters: {
    // Отримання загальної суми транзакцій
    getSum() {
      return this.filteredTransactions.reduce((sum, transaction) => {
        // Додавати до суми тільки позитивні транзакції (надходження)
        return sum + (transaction.amount > 0 ? transaction.amount : 0);
      }, 0);
    },

    // Отримання податку 5% від суми
    getTaxFivePercent() {
      return this.getSum * 0.05;
    },

    // Отримання суми з урахуванням податку
    getSumWithTaxPercent() {
      const ECV = parseInt(import.meta.env.VITE_ECV || "0");
      return this.getTaxFivePercent + ECV;
    },

    // Фільтровані дані
    filterData() {
      return this.filteredTransactions;
    },

    // Прогрес завантаження транзакцій у відсотках
    getTransactionLoadProgress() {
      return this.transactionLoadProgress;
    },

    // Чи відбувається зараз завантаження транзакцій
    isTransactionsLoading() {
      return this.isLoadingTransactions;
    },
  },
});
