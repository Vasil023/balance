export default class IndexedDBManager {
  constructor(dbName, version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  // Відкриття бази даних
  open() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("Ваш браузер не підтримує IndexedDB"));
        return;
      }

      const request = window.indexedDB.open(this.dbName, this.version);

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        this.setupObjectStores(db);
      };
    });
  }

  // Налаштування об'єктних сховищ
  setupObjectStores(db) {
    if (!db.objectStoreNames.contains("transactions")) {
      db.createObjectStore("transactions", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("clientInfo")) {
      db.createObjectStore("clientInfo", { keyPath: "clientId" });
    }
  }

  // Додавання даних
  add(storeName, data) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("База даних не відкрита"));
        return;
      }

      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Оновлення даних
  update(storeName, data) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("База даних не відкрита"));
        return;
      }

      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Отримання даних за ключем
  get(storeName, key) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("База даних не відкрита"));
        return;
      }

      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Отримання всіх даних
  getAll(storeName) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("База даних не відкрита"));
        return;
      }

      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Очищення сховища
  clear(storeName) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("База даних не відкрита"));
        return;
      }

      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Закриття бази даних
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
