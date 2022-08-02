let indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

const dbName = "mineMap";

export default class MineDB {
  constructor() {
    this.request = null;
    this.db = null;
    this.open();
  }

  open() {
    return new Promise((resolve, reject) => {
      this.request = indexedDB.open(dbName);
      this.request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      this.request.onerror = (e) => {
        reject(e);
      };
      this.request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(dbName)) {
          let objectStore = db.createObjectStore(dbName, { keyPath: "id" });
          objectStore.createIndex("name", "name", { unique: false });
          objectStore.createIndex("headImg", "headImg", { unique: false });
          objectStore.createIndex("mapData", "mapData", { unique: false });
          objectStore.createIndex("mineData", "mineData", { unique: false });
        }
      };
    });
  }

  async getList() {
    if (this.db) {
      return new Promise((resolve, reject) => {
        const request = this.db
          .transaction(dbName, "readwrite")
          .objectStore(dbName)
          .getAll();
        request.onsuccess = (res) => {
          resolve(res.target.result);
        };
        request.onerror = (err) => {
          reject(err);
        };
      });
    } else {
      await this.open();
      return this.getList();
    }
  }

  addOne(params) {
    return new Promise((resolve, reject) => {
      const { id, name, headImg, mapData, mineData } = params;
      const request = this.db
        .transaction(dbName, "readwrite")
        .objectStore(dbName)
        .add({
          id,
          name,
          headImg,
          mapData,
          mineData,
        });
      request.onsuccess = (res) => {
        resolve(res);
      };
      request.onerror = (err) => {
        reject(err);
      };
    });
  }

  deleteOne() {}
}
