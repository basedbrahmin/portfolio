// Render's free tier spins a service down after 15 minutes without inbound traffic.
// Requesting our own public URL goes through Render's proxy, so it counts as traffic.
const INTERVAL_MS = 10 * 60 * 1000;

export function startKeepAlive(baseUrl) {
  if (!baseUrl) return;
  const url = `${baseUrl.replace(/\/$/, '')}/api/health`;
  console.log(`[keep-alive] pinging ${url} every ${INTERVAL_MS / 60000} min`);

  setInterval(async () => {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!res.ok) console.warn(`[keep-alive] ${res.status}`);
    } catch (err) {
      console.warn('[keep-alive] ping failed:', err.message);
    }
  }, INTERVAL_MS);
}
