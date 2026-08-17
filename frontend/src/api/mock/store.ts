/** Thin localStorage-backed persistence so admin CRUD survives a page refresh without a real backend. */
export function loadStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveStore<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private browsing, quota) — fail silently, in-memory state still works.
  }
}
