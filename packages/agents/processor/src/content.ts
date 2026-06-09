const TIMEOUT_MS = 20_000;
const MAX_CHARS  = 5_000;

// Mindestlänge: RSS-Description muss wenigstens diesen Wert haben,
// um als ausreichend für das Scoring zu gelten (sonst Jina-Fallback).
const MIN_DESCRIPTION_CHARS = 150;

const JINA_BASE = "https://r.jina.ai/";

/**
 * Liefert den Artikelinhalt für den Processor.
 *
 * Kosten-optimierte Strategie (Priorität absteigend):
 *  1. RSS-Description  — kostenlos, bereits in DB vorhanden, ~150–800 Zeichen
 *  2. Jina Reader API  — sauberes Markdown, ~5.000 Zeichen (nur wenn Description fehlt)
 *  3. HTML-Scraper     — letzter Fallback
 *
 * Faustformel: ~85 % aller Artikel werden allein via RSS-Description verarbeitet.
 * Jina wird nur für Artikel ohne sinnvolle Feed-Beschreibung aufgerufen.
 */
export async function fetchArticleContent(
  url: string,
  rssDescription: string | null,
): Promise<string> {
  // ── Stufe 1: RSS-Description (gratis, bereits vorhanden) ──────────────────
  if (rssDescription && rssDescription.length >= MIN_DESCRIPTION_CHARS) {
    // HTML-Entities und Tags aus RSS-Description bereinigen
    const clean = stripHtml(rssDescription).slice(0, MAX_CHARS);
    if (clean.length >= MIN_DESCRIPTION_CHARS) return clean;
  }

  // ── Stufe 2: Jina Reader (Fallback für kurze / leere Descriptions) ────────
  const jina = await fetchViaJina(url);
  if (jina.length > 200) return jina;

  // ── Stufe 3: Direkter HTML-Scraper ────────────────────────────────────────
  return await fetchViaHtml(url);
}

// ---------------------------------------------------------------------------
// Jina Reader  (r.jina.ai)
// ---------------------------------------------------------------------------

async function fetchViaJina(url: string): Promise<string> {
  try {
    const apiKey = process.env["JINA_API_KEY"];
    const headers: Record<string, string> = {
      "Accept":    "text/plain",
      "X-Timeout": "15",
    };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const res = await fetch(`${JINA_BASE}${url}`, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return "";
    const text = await res.text().then(t => t.slice(0, MAX_CHARS).trim());
    if (isBlockedContent(text)) return "";
    return text;
  } catch {
    return "";
  }
}

function isBlockedContent(text: string): boolean {
  const preview = text.slice(0, 600).toLowerCase();
  const blockers = [
    "cookies zustimmen", "cookie-einstellungen", "bevor sie weiterlesen",
    "um fortzufahren, aktivieren sie", "please enable cookies",
    "access denied", "subscribe to read",
    "warning: target url returned error", "login to continue", "sign in to read",
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
    return stripHtml(html).slice(0, MAX_CHARS);
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// HTML → Plaintext
// ---------------------------------------------------------------------------

function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|h[1-6]|li|blockquote|article|section)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#8222;/g, "„").replace(/&#8220;/g, "“")
    .replace(/&nbsp;/g, " ").replace(/&#\d+;/g, " ").replace(/&[a-z]+;/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
