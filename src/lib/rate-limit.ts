// In-memory — resetea al redeploy. Migrar a Upstash Redis en prod si escala (ver F10).

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

/**
 * Minimal in-memory fixed-window rate limiter.
 * Lazy cleanup: entry resets when now > resetAt. No setInterval.
 * Key MUST be stable per-user (e.g. `progress:${userId}`) — not IP alone behind Vercel proxy.
 */
export function checkRateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000,
): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count < limit) {
    entry.count += 1;
    return { ok: true };
  }

  const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
  return { ok: false, retryAfter: Math.max(1, retryAfter) };
}
