import Anthropic from "@anthropic-ai/sdk";
import {
  COMBINED_SYSTEM_PROMPT,
  COMBINED_USER_PROMPT,
  INDUSTRY_IMPACT_CRITERIA,
} from "../../../shared/src/prompts/index.ts";

// claude-haiku: günstigstes Modell — ausreichend für Zusammenfassung + Scoring
const MODEL      = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 1024;

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) _client = new Anthropic({ apiKey: process.env["ANTHROPIC_API_KEY"] });
  return _client;
}

// Kombiniertes Ergebnis aus einem einzigen API-Call
export interface CombinedResult {
  summary_short:   string;
  summary_medium:  string;
  summary_long:    string;
  action_required: string;       // "Was muss ich jetzt tun?"
  affected_roles:  string;       // "Compliance-Beauftragter, IT-Leiter"
  deadline_hint:   string | null; // "Frist: 17.01.2025" oder null
  relevance_score: number;
  impact_level:    "high" | "medium" | "low";
  impact_reason:   string;
  tags:            string[];
  is_breaking:     boolean;
}

/**
 * Ein einziger Claude-API-Call pro Artikel.
 * Erstellt Zusammenfassungen + Relevanz-Score + Tags + Impact-Level gleichzeitig.
 * Spart ~50% API-Kosten gegenüber zwei separaten Calls.
 */
export async function processArticleCombined(
  title: string,
  content: string,
  industry: string,
  tagsTaxonomy: Record<string, string[]>,
): Promise<CombinedResult> {
  const criteria = buildImpactCriteria(industry);

  const msg = await getClient().messages.create({
    model:      MODEL,
    max_tokens: MAX_TOKENS,
    system:     COMBINED_SYSTEM_PROMPT,
    messages: [{
      role:    "user",
      content: COMBINED_USER_PROMPT(title, content || title, industry, criteria, tagsTaxonomy),
    }],
  });

  const text = extractText(msg);
  return parseJson<CombinedResult>(text, {
    summary_short:   title.slice(0, 120),
    summary_medium:  title,
    summary_long:    title,
    action_required: "Zur Kenntnis nehmen.",
    affected_roles:  "",
    deadline_hint:   null,
    relevance_score: 50,
    impact_level:    "low",
    impact_reason:   "",
    tags:            [],
    is_breaking:     false,
  });
}

// ── Hilfsfunktionen ────────────────────────────────────────────────────────────

function buildImpactCriteria(industry: string): string {
  const c = INDUSTRY_IMPACT_CRITERIA[industry];
  if (!c) {
    return `Impact-Level:
- high:   Sofortige Reaktion notwendig (neue Pflichten, Fristen, Bußgelder)
- medium: Sollte innerhalb der Woche beachtet werden
- low:    Für Überblick relevant, kein sofortiger Handlungsbedarf`;
  }
  return `Impact-Level für "${industry}":
- high:   ${c.high}
- medium: ${c.medium}
- low:    ${c.low}`;
}

function extractText(msg: Anthropic.Message): string {
  const block = msg.content[0];
  return block?.type === "text" ? block.text : "";
}

function parseJson<T>(text: string, fallback: T): T {
  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(clean) as T;
  } catch {
    const match = clean.match(/\{[\s\S]+\}/);
    if (match) {
      try { return JSON.parse(match[0]) as T; } catch { /* fall through */ }
    }
    return fallback;
  }
}
