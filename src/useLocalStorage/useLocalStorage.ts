import { useState, useEffect, useCallback } from "react";

type SetValue<T> = T | ((prevValue: T) => T);
const getFromLocalStorage = <T>(key: string, defaultValue: T) => {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    } else {
      // Save default value to localStorage when it doesn't exist
      window.localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: SetValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(
    getFromLocalStorage(key, defaultValue),
  );

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  const createStorageHandler = (storageKey: string) => (e: StorageEvent) => {
    if (e.key === storageKey && e.newValue !== null) {
      try {
        setStoredValue(JSON.parse(e.newValue));
      } catch (error) {
        console.warn(`Error parsing localStorage key "${storageKey}":`, error);
      }
    }
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handler = createStorageHandler(key);
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    }
  }, [key]);

  return [storedValue, setValue];
}

