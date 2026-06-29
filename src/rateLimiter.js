const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

// Map<userId, number[]> — stores request timestamps within the current window
const windows = new Map();

function isAllowed(userId) {
  const now = Date.now();
  const timestamps = (windows.get(userId) || []).filter(t => t > now - WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    windows.set(userId, timestamps);
    return false;
  }

  timestamps.push(now);
  windows.set(userId, timestamps);
  return true;
}

module.exports = { isAllowed };
