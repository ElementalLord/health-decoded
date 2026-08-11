export type LocalStorageReadResult =
  | { readonly ok: true; readonly value: string | null }
  | { readonly ok: false; readonly value: null };

export function readLocalStorage(key: string): LocalStorageReadResult {
  try {
    return { ok: true, value: window.localStorage.getItem(key) };
  } catch {
    return { ok: false, value: null };
  }
}

export function safeGetLocalStorage(key: string) {
  return readLocalStorage(key).value;
}

export function safeSetLocalStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveLocalStorage(key: string) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
