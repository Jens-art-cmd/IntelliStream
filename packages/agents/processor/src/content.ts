const TIMEOUT_MS = 20_000;
const MAX_CHARS  = 12_000;  // Jina liefert sauberes Markdown — mehr ist besser als Rauschen

const JINA_BASE = "https://r.jina.ai/";

/**
 * Lädt den Volltext eines Artikels.
 *
 * Strategie:
 *  1. Jina Reader API  → sauberes Markdown, kein Boilerplate
 *  2. Fallback: eigener HTML-Scraper  (z.B. wenn Jina eine URL blockiert)
 */
export async function fetchArticleText(url: string): Promise<string> {
  const jina = await fetchViaJina(url);
  if (jina.length > 200) return jina;          // Jina hat etwas Sinnvolles geliefert

  // Fallback — lieber etwas als nichts
  const fallback = await fetchViaHtml(url);
  return fallback;
}

// ---------------------------------------------------------------------------
// Jina Reader  (r.jina.ai)
// ---------------------------------------------------------------------------

async function fetchViaJina(url: string): Promise<string> {
  try {
    const apiKey = process.env["JINA_API_KEY"];
    const headers: Record<string, string> = {
      "Accept":     "text/plain",
      "X-Timeout":  "15",
    };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const res = await fetch(`${JINA_BASE}${url}`, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return "";

    const text = await res.text().then(t => t.slice(0, MAX_CHARS).trim());

    // Erkenne Cookie-Walls, Login-Walls und Jina-Fehler → Fallback
    if (isBlockedContent(text)) return "";

    return text;
  } catch {
    return "";
  }
}

/** Erkennt Seiten, die statt Artikelinhalt eine Schranke zurückgeben */
function isBlockedContent(text: string): boolean {
  const preview = text.slice(0, 600).toLowerCase();
  const blockers = [
    "cookies zustimmen",
    "cookie-einstellungen",
    "bevor sie weiterlesen",
    "um fortzufahren, aktivieren sie",
    "please enable cookies",
    "access denied",
    "subscribe to read",
    "warning: target url returned error",
    "login to continue",
    "sign in to read",
  ];
  return blockers.some(phrase => preview.includes(phrase));
}

// ---------------------------------------------------------------------------
// Fallback: HTML-Scraper
// ---------------------------------------------------------------------------

async function fetchViaHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "IntelliStream-Processor/1.0",
        "Accept":     "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return "";

    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html") && !ct.includes("text/plain")) return "";

    const html = await res.text();
    return extractText(html).slice(0, MAX_CHARS);
  } catch {
    return "";
  }
}

function extractText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|h[1-6]|li|blockquote|article|section)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8222;/g, "„")
    .replace(/&#8220;/g, "“")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
