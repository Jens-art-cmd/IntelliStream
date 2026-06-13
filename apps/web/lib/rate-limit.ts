/**
 * Einfacher In-Memory Rate Limiter (Sliding Window)
 *
 * Funktioniert pro Serverless-Instanz (Vercel Lambda Warm-Start).
 * Schützt kritische Endpunkte vor einfachem Missbrauch.
 *
 * Für verteiltes Rate-Limiting (multi-instance) → Upstash Redis.
 */

interface RateLimitEntry {
  count:     number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Speicher periodisch bereinigen (alle 5 Min)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now - entry.windowStart > 3_600_000) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

interface RateLimitOptions {
  /** Max. Anfragen im Zeitfenster */
  limit:       number;
  /** Zeitfenster in Sekunden */
  windowSecs:  number;
}

interface RateLimitResult {
  allowed:    boolean;
  remaining:  number;
  resetAfter: number; // Sekunden bis Reset
}

/**
 * Prüft ob eine IP das Rate Limit überschritten hat.
 * @param ip   IP-Adresse des Requestors
 * @param key  Eindeutiger Schlüssel für den Endpunkt (z.B. "newsletter:subscribe")
 */
export function checkRateLimit(
  ip: string,
  key: string,
  { limit, windowSecs }: RateLimitOptions,
): RateLimitResult {
  const storeKey = `${key}:${ip}`;
  const now      = Date.now();
  const windowMs = windowSecs * 1000;

  const entry = store.get(storeKey);

  if (!entry || now - entry.windowStart >= windowMs) {
    // Neues Fenster starten
    store.set(storeKey, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, resetAfter: windowSecs };
  }

  if (entry.count >= limit) {
    const resetAfter = Math.ceil((windowMs - (now - entry.windowStart)) / 1000);
    return { allowed: false, remaining: 0, resetAfter };
  }

  entry.count++;
  const remaining  = limit - entry.count;
  const resetAfter = Math.ceil((windowMs - (now - entry.windowStart)) / 1000);
  return { allowed: true, remaining, resetAfter };
}

/**
 * Liest die Client-IP aus den Next.js Request Headers.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
