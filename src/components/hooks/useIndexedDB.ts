// IndexedDB 自动备份服务
// 作为 localStorage 的安全镜像，防止数据意外丢失

const DB_NAME = 'LifeOSBackup';
const DB_VERSION = 1;
const STORE_NAME = 'entries';

export class IndexedDBBackup {
  private db: IDBDatabase | null = null;

  // 初始化数据库
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB打开失败:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB自动备份已启用');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建对象存储（如果不存在）
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          console.log('📦 IndexedDB存储空间已创建');
        }
      };
    });
  }

  // 保存所有数据到IndexedDB（自动备份）
  async saveAll(entries: any[]): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // 先清空现有数据
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        // 批量添加新数据
        entries.forEach(entry => {
          store.add(entry);
        });
      };

      transaction.oncomplete = () => {
        console.log(`💾 IndexedDB自动备份完成 (${entries.length}条)`);
        resolve();
      };

      transaction.onerror = () => {
        console.error('IndexedDB备份失败:', transaction.error);
        reject(transaction.error);
      };
    });
  }

  // 从IndexedDB恢复所有数据
  async loadAll(): Promise<any[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        console.log(`📥 从IndexedDB恢复了${request.result.length}条数据`);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('IndexedDB读取失败:', request.error);
        reject(request.error);
      };
    });
  }

  // 清空IndexedDB备份
  async clear(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('🗑️ IndexedDB备份已清空');
        resolve();
      };

      request.onerror = () => {
        console.error('IndexedDB清空失败:', request.error);
        reject(request.error);
      };
    });
  }

  // 获取备份时间（通过读取第一条记录的时间戳）
  async getLastBackupTime(): Promise<Date | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const entries = request.result;
        if (entries.length > 0) {
          // 找到最新的createdAt时间
          const latest = entries.reduce((latest, entry) => {
            const entryDate = new Date(entry.createdAt);
            return entryDate > latest ? entryDate : latest;
          }, new Date(0));
          resolve(latest);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('IndexedDB读取失败:', request.error);
        reject(request.error);
      };
    });
  }
}

// 单例模式
export const indexedDBBackup = new IndexedDBBackup();
