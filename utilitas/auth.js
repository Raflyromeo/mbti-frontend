export function bersihkanHashOAuth() {
  if (typeof window === "undefined") return;
  if (!window.location.hash) return;
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

export function adaHashOAuth() {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash;
  return hash.includes("access_token") || hash.includes("refresh_token");
}
