import Anthropic from "@anthropic-ai/sdk";
import {
  SUMMARIZER_SYSTEM_PROMPT,
  SUMMARIZER_USER_PROMPT,
  PROCESSOR_SYSTEM_PROMPT,
  PROCESSOR_USER_PROMPT,
} from "../../../shared/src/prompts/index.ts";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 1024;

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) _client = new Anthropic({ apiKey: process.env["ANTHROPIC_API_KEY"] });
  return _client;
}

export interface SummaryResult {
  summary_short: string;
  summary_medium: string;
  summary_long: string;
}

export interface ProcessResult {
  relevance_score: number;
  impact_level: "high" | "medium" | "low";
  impact_reason: string;
  tags: string[];
  is_breaking: boolean;
}

export async function summarizeArticle(
  title: string,
  content: string,
  industry: string,
): Promise<SummaryResult> {
  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SUMMARIZER_SYSTEM_PROMPT,
    messages: [{ role: "user", content: SUMMARIZER_USER_PROMPT(title, content || title, industry) }],
  });

  const text = extractText(msg);
  return parseJson<SummaryResult>(text, {
    summary_short: title.slice(0, 120),
    summary_medium: title,
    summary_long: title,
  });
}

export async function processArticle(
  title: string,
  summary: string,
  industry: string,
  tagsTaxonomy: Record<string, string[]>,
): Promise<ProcessResult> {
  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: PROCESSOR_SYSTEM_PROMPT,
    messages: [{ role: "user", content: PROCESSOR_USER_PROMPT(title, summary, industry, tagsTaxonomy) }],
  });

  const text = extractText(msg);
  return parseJson<ProcessResult>(text, {
    relevance_score: 50,
    impact_level: "low",
    impact_reason: "",
    tags: [],
    is_breaking: false,
  });
}

function extractText(msg: Anthropic.Message): string {
  const block = msg.content[0];
  return block?.type === "text" ? block.text : "";
}

function parseJson<T>(text: string, fallback: T): T {
  // Strip optional markdown code fences
  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(clean) as T;
  } catch {
    // Try to extract JSON object from surrounding text
    const match = clean.match(/\{[\s\S]+\}/);
    if (match) {
      try { return JSON.parse(match[0]) as T; } catch { /* fall through */ }
    }
    return fallback;
  }
}
