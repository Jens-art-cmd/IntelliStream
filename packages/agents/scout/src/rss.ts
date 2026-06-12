import { XMLParser } from "fast-xml-parser";

export interface FeedItem {
  title: string;
  url: string;
  publishedAt: Date | null;
  description: string | null;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  processEntities: false,
  htmlEntities: true,
});

export async function fetchRssFeed(feedUrl: string): Promise<FeedItem[]> {
  const res = await fetch(feedUrl, {
    headers: { "User-Agent": "DistillFeed-Scout/1.0 (+https://distillfeed.eu)" },
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} from ${feedUrl}`);

  const xml = await decodeResponse(res);
  const doc = parser.parse(xml);

  // RSS 2.0
  if (doc?.rss?.channel) {
    const ch = doc.rss.channel;
    const items = Array.isArray(ch.item) ? ch.item : ch.item ? [ch.item] : [];
    return items.map(toFeedItem).filter(isValid);
  }

  // Atom
  if (doc?.feed) {
    const entries = Array.isArray(doc.feed.entry) ? doc.feed.entry : doc.feed.entry ? [doc.feed.entry] : [];
    return entries.map(toAtomItem).filter(isValid);
  }

  throw new Error(`Unrecognized feed format from ${feedUrl}`);
}

function toFeedItem(item: Record<string, unknown>): FeedItem {
  return {
    title: String(item["title"] ?? "").trim(),
    url: extractRssLink(item),
    publishedAt: parseDate(item["pubDate"] ?? item["dc:date"]),
    description: extractText(item["description"] ?? item["content:encoded"]),
  };
}

function toAtomItem(entry: Record<string, unknown>): FeedItem {
  return {
    title: extractText(entry["title"]) ?? "",
    url: extractAtomLink(entry),
    publishedAt: parseDate(entry["updated"] ?? entry["published"]),
    description: extractText(entry["summary"] ?? entry["content"]),
  };
}

function extractRssLink(item: Record<string, unknown>): string {
  const link = item["link"];
  if (typeof link === "string") return link.trim();
  if (typeof link === "object" && link !== null) {
    const obj = link as Record<string, unknown>;
    return String(obj["#text"] ?? obj["@_href"] ?? "").trim();
  }
  return String(item["guid"] ?? "").trim();
}

function extractAtomLink(entry: Record<string, unknown>): string {
  const link = entry["link"];
  if (typeof link === "string") return link.trim();
  if (Array.isArray(link)) {
    const alt = (link as Record<string, unknown>[]).find(l => l["@_rel"] === "alternate" || !l["@_rel"]);
    return String(alt?.["@_href"] ?? "").trim();
  }
  if (typeof link === "object" && link !== null) {
    return String((link as Record<string, unknown>)["@_href"] ?? "").trim();
  }
  return "";
}

function extractText(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "string") return val.trim() || null;
  if (typeof val === "object") {
    const o = val as Record<string, unknown>;
    return String(o["#text"] ?? o["_"] ?? "").trim() || null;
  }
  return null;
}

function parseDate(raw: unknown): Date | null {
  if (!raw) return null;
  const d = new Date(String(raw));
  return isNaN(d.getTime()) ? null : d;
}

function isValid(item: FeedItem): boolean {
  return item.title.length > 0 && item.url.startsWith("http");
}

// ---------------------------------------------------------------------------
// Encoding-aware response decoder
// Feeds wie Golem.de liefern ISO-8859-1 ohne expliziten Charset-Header.
// res.text() würde dann UTF-8 annehmen und Umlaute zerstören.
// ---------------------------------------------------------------------------

async function decodeResponse(res: Response): Promise<string> {
  const buffer = await res.arrayBuffer();

  // 1. Charset aus Content-Type Header
  const ct = res.headers.get("content-type") ?? "";
  const ctCharset = ct.match(/charset=([^\s;]+)/i)?.[1];
  if (ctCharset) return decode(buffer, ctCharset);

  // 2. Charset aus XML-Deklaration (<?xml ... encoding="ISO-8859-1"?>)
  const ascii = new TextDecoder("ascii", { fatal: false }).decode(new Uint8Array(buffer).slice(0, 300));
  const xmlCharset = ascii.match(/<?xml[^>]+encoding=["']([^"']+)["']/i)?.[1];
  if (xmlCharset) return decode(buffer, xmlCharset);

  // 3. Fallback UTF-8
  return new TextDecoder("utf-8").decode(buffer);
}

function decode(buffer: ArrayBuffer, charset: string): string {
  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return new TextDecoder("utf-8").decode(buffer);
  }
}
