/**
 * Auto-Recovery für fehlerhafte RSS-Feed-URLs
 *
 * Wenn ein Scout-Lauf 3x hintereinander für eine Quelle fehlschlägt,
 * versucht dieser Modul automatisch die korrekte URL zu finden:
 *
 * Stufe 1: Homepage-Scan  — sucht <link rel="alternate" type="application/rss+xml">
 * Stufe 2: Sitemap-Scan   — sucht Feed-URLs in /sitemap.xml
 * Stufe 3: Pfad-Guessing  — probiert gängige RSS-Pfade (/feed, /rss.xml, …)
 * Stufe 4: Subdomain-Scan — versucht /news, /presse, /aktuelles + Feed-Pfade
 *
 * Jede Kandidaten-URL wird validiert (muss mind. 1 Feed-Item liefern).
 * Falls eine URL gefunden wird → sources.url + last_error aktualisieren.
 * Falls keine gefunden → health_status = 'broken'.
 */

const TIMEOUT = 10_000;

// Gängige RSS-Pfade, sortiert nach Häufigkeit
const COMMON_PATHS = [
  "/feed", "/feed/", "/rss", "/rss/", "/rss.xml", "/feed.xml",
  "/atom.xml", "/news/feed", "/news/feed/", "/news.xml",
  "/presse/feed", "/presse/rss.xml",
  "/aktuelles/feed", "/aktuelles/rss.xml",
  "/pressemitteilungen/feed",
  // TYPO3 Behörden-CMS-Muster
  "/SiteGlobals/Functions/RSSFeed/RSSNewsfeed/RSS_Pressemitteilungen.xml",
  "/SiteGlobals/Functions/RSSFeed/DE/Presse/RSSNewsfeed_Presse.xml",
  "/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed_Aktuelles.xml",
];

/** Hauptfunktion: versucht eine neue URL für die kaputte Quelle zu finden */
export async function discoverNewFeedUrl(
  name: string,
  brokenUrl: string,
  log: (msg: string) => void,
): Promise<string | null> {
  let origin: string;
  try {
    origin = new URL(brokenUrl).origin;
  } catch {
    log(`[Recovery] Ungültige URL: ${brokenUrl}`);
    return null;
  }

  log(`[Recovery] Starte Auto-Recovery für "${name}" (${origin})`);

  // Stufe 1: Homepage-Scan
  const homepageUrl = await scanHomepageForFeeds(origin, log);
  if (homepageUrl) return homepageUrl;

  // Stufe 2: Sitemap-Scan
  const sitemapUrl = await scanSitemapForFeeds(origin, log);
  if (sitemapUrl) return sitemapUrl;

  // Stufe 3: Gängige Pfade durchprobieren
  for (const path of COMMON_PATHS) {
    const candidate = `${origin}${path}`;
    if (candidate === brokenUrl) continue; // nicht nochmal dieselbe probieren
    if (await validateFeed(candidate)) {
      log(`[Recovery] ✓ Gefunden via Pfad-Guessing: ${candidate}`);
      return candidate;
    }
  }

  // Stufe 4: Unterseiten nach Feeds absuchen (news, presse, aktuelles)
  const subpages = ["/news", "/presse", "/aktuelles", "/pressemitteilungen", "/meldungen"];
  for (const sub of subpages) {
    const found = await scanPageForFeeds(`${origin}${sub}`, log);
    if (found) return found;
  }

  log(`[Recovery] ✗ Keine neue URL gefunden für "${name}"`);
  return null;
}

/** Seite laden und nach <link rel="alternate" type="application/rss+xml"> suchen */
async function scanHomepageForFeeds(origin: string, log: (m: string) => void): Promise<string | null> {
  return scanPageForFeeds(origin, log);
}

async function scanPageForFeeds(url: string, log: (m: string) => void): Promise<string | null> {
  try {
    const html = await fetchText(url);
    if (!html) return null;

    // <link rel="alternate" type="application/rss+xml" href="...">
    const linkPattern = /<link[^>]+type=["']application\/(?:rss|atom)\+xml["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
    // auch umgekehrte Attributreihenfolge
    const linkPattern2 = /<link[^>]+href=["']([^"']+)["'][^>]*type=["']application\/(?:rss|atom)\+xml["'][^>]*>/gi;

    const candidates: string[] = [];
    for (const pattern of [linkPattern, linkPattern2]) {
      let m: RegExpExecArray | null;
      while ((m = pattern.exec(html)) !== null) {
        const href = m[1];
        const abs = href.startsWith("http") ? href : `${new URL(url).origin}${href.startsWith("/") ? "" : "/"}${href}`;
        candidates.push(abs);
      }
    }

    for (const candidate of [...new Set(candidates)]) {
      if (await validateFeed(candidate)) {
        log(`[Recovery] ✓ Gefunden via Link-Tag auf ${url}: ${candidate}`);
        return candidate;
      }
    }
  } catch { /* ignorieren */ }
  return null;
}

/** /sitemap.xml laden und nach Feed-URLs suchen */
async function scanSitemapForFeeds(origin: string, log: (m: string) => void): Promise<string | null> {
  try {
    const xml = await fetchText(`${origin}/sitemap.xml`);
    if (!xml) return null;

    const urlPattern = /<loc>\s*(https?[^<]+(?:feed|rss|atom)[^<]*)\s*<\/loc>/gi;
    let m: RegExpExecArray | null;
    while ((m = urlPattern.exec(xml)) !== null) {
      const candidate = m[1].trim();
      if (await validateFeed(candidate)) {
        log(`[Recovery] ✓ Gefunden via sitemap.xml: ${candidate}`);
        return candidate;
      }
    }
  } catch { /* ignorieren */ }
  return null;
}

/** Prüft ob eine URL tatsächlich einen validen RSS/Atom-Feed liefert */
export async function validateFeed(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "DistillFeed-Scout/1.0 (+https://distillfeed.eu)" },
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) return false;
    const text = await res.text();
    // Mindestanforderung: Feed-Root-Element + mindestens 1 Item/Entry
    const hasRoot  = /<rss[\s>]/.test(text) || /<feed[\s>]/.test(text);
    const hasItems = /<item[\s>]/.test(text) || /<entry[\s>]/.test(text);
    return hasRoot && hasItems;
  } catch {
    return false;
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "DistillFeed-Scout/1.0 (+https://distillfeed.eu)" },
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}
