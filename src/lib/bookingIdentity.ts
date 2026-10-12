const BROWSER_ID_KEY = "browserId";

export function getOrCreateBrowserId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existingBrowserId = window.localStorage.getItem(BROWSER_ID_KEY);
  if (existingBrowserId) {
    return existingBrowserId;
  }

  const generatedBrowserId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `browser-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  window.localStorage.setItem(BROWSER_ID_KEY, generatedBrowserId);
  return generatedBrowserId;
}

export function readBrowserId() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(BROWSER_ID_KEY) ?? "";
}
