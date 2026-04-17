import { atom } from 'nanostores';

/**
 * Minimal persistent atom for client-side only.
 * Reads initial value from localStorage on first access in the browser.
 */
export function persistentAtom<T>(key: string, fallback: T) {
  const store = atom<T>(fallback);
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) store.set(JSON.parse(raw) as T);
    } catch {
      /* ignore malformed json */
    }
    store.listen((value) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* ignore quota errors */
      }
    });
  }
  return store;
}
