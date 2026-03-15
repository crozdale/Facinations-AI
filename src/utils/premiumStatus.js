const KEY = "facinations_premium_pending";

export function setPremiumPending(txHash) {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      txHash,
      timestamp: Date.now(),
    })
  );
}

export function getPremiumPending() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearPremiumPending() {
  localStorage.removeItem(KEY);
}
