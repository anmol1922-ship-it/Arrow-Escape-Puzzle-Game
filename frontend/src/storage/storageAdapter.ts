export interface StorageAdapter {
  read<T>(key: string): T | null;
  write<T>(key: string, value: T): void;
  remove(key: string): void;
}

export const memoryStorageAdapter: StorageAdapter = {
  read: () => null,
  write: () => undefined,
  remove: () => undefined,
};

export function createBrowserStorageAdapter(): StorageAdapter {
  if (typeof window === "undefined" || !window.localStorage)
    return memoryStorageAdapter;
  return {
    read<T>(key: string): T | null {
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
      } catch {
        return null;
      }
    },
    write<T>(key: string, value: T): void {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage failure must never interrupt gameplay.
      }
    },
    remove(key: string): void {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Storage failure must never interrupt gameplay.
      }
    },
  };
}
