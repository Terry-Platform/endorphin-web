const memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    const key = '__storage_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

const useLocalStorage = isLocalStorageAvailable();

export function getItem(key: string): string | null {
  if (useLocalStorage) {
    return localStorage.getItem(key);
  }
  return memoryStore[key] ?? null;
}

export function setItem(key: string, value: string): void {
  if (useLocalStorage) {
    localStorage.setItem(key, value);
  }
  memoryStore[key] = value;

  // Notify parent frame if embedded in iframe
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'AUTH_TOKEN_UPDATE', key, value }, '*');
  }
}

export function removeItem(key: string): void {
  if (useLocalStorage) {
    localStorage.removeItem(key);
  }
  delete memoryStore[key];
}
