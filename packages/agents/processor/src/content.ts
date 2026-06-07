const TIMEOUT_MS = 15_000;
const MAX_CHARS = 6_000;

export async function fetchArticleText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "IntelliStream-Processor/1.0",
        "Accept": "text/html,application/xhtml+xml",
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
    // Remove script / style blocks
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, " ")
    // Replace block-level tags with newlines
    .replace(/<\/(p|div|h[1-6]|li|blockquote|article|section)>/gi, "\n")
    // Strip remaining tags
    .replace(/<[^>]+>/g, " ")
    // Decode common HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8222;/g, "„")
    .replace(/&#8220;/g, "“")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/&[a-z]+;/g, " ")
    // Collapse whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
