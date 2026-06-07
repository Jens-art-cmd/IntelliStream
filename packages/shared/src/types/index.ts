import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const PlanType = z.enum(["free", "starter", "pro", "enterprise"]);
export const NewsletterFrequency = z.enum(["daily", "weekly", "realtime"]);
export const ImpactLevel = z.enum(["high", "medium", "low"]);
export const SourceType = z.enum(["rss", "api", "crawler", "email"]);
export const TrustLevel = z.enum(["official", "media", "blog"]);
export const SummaryLength = z.enum(["short", "medium", "long"]);
export const AlertChannel = z.enum(["email", "push", "both"]);
export const InteractionEvent = z.enum([
  "open", "click", "read", "skip",
  "thumbs_up", "thumbs_down", "bookmark", "share",
]);

export type PlanType = z.infer<typeof PlanType>;
export type NewsletterFrequency = z.infer<typeof NewsletterFrequency>;
export type ImpactLevel = z.infer<typeof ImpactLevel>;
export type SourceType = z.infer<typeof SourceType>;
export type TrustLevel = z.infer<typeof TrustLevel>;
export type SummaryLength = z.infer<typeof SummaryLength>;
export type AlertChannel = z.infer<typeof AlertChannel>;
export type InteractionEvent = z.infer<typeof InteractionEvent>;

// ─── Domain schemas ────────────────────────────────────────────────────────────

export const IndustrySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  sources: z.array(z.record(z.unknown())),
  tags_taxonomy: z.record(z.array(z.string())),
  crawl_interval_minutes: z.number().int(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
});

export const ArticleSchema = z.object({
  id: z.string().uuid(),
  source_url: z.string().url(),
  title: z.string(),
  full_text: z.string().nullable(),
  summary_short: z.string().nullable(),
  summary_medium: z.string().nullable(),
  summary_long: z.string().nullable(),
  industry_id: z.number().int(),
  source_id: z.string().uuid().nullable(),
  tags: z.array(z.string()),
  relevance_score: z.number().min(0).max(100).nullable(),
  impact_level: ImpactLevel.nullable(),
  impact_reason: z.string().nullable(),
  trust_score: z.number().min(0).max(1).nullable(),
  published_at: z.string().datetime().nullable(),
  ingested_at: z.string().datetime(),
  processed_at: z.string().datetime().nullable(),
  language: z.string(),
  is_breaking: z.boolean(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  plan: PlanType,
  industry_subscriptions: z.array(z.number().int()),
  newsletter_frequency: NewsletterFrequency,
  newsletter_time: z.string(),
  stripe_customer_id: z.string().nullable(),
  newsletter_opt_in: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const UserProfileSchema = z.object({
  user_id: z.string().uuid(),
  preferred_tags: z.array(z.string()),
  excluded_tags: z.array(z.string()),
  avg_read_depth: z.number().min(0).max(1),
  preferred_summary_length: SummaryLength,
  updated_at: z.string().datetime(),
});

export const UserAlertSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  keywords: z.array(z.string()),
  companies: z.array(z.string()),
  laws: z.array(z.string()),
  min_impact: ImpactLevel,
  channel: AlertChannel,
  is_active: z.boolean(),
  created_at: z.string().datetime(),
});

export const InteractionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  article_id: z.string().uuid(),
  event_type: InteractionEvent,
  read_duration_seconds: z.number().int().nullable(),
  scroll_depth: z.number().min(0).max(1).nullable(),
  occurred_at: z.string().datetime(),
});

// ─── API request/response schemas ─────────────────────────────────────────────

export const FeedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  industry_ids: z.string().transform(s => s.split(",").map(Number)).optional(),
  impact: ImpactLevel.optional(),
  days_back: z.coerce.number().int().min(1).max(90).default(7),
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  industry_ids: z.string().transform(s => s.split(",").map(Number)).optional(),
  mode: z.enum(["semantic", "fulltext", "hybrid"]).default("hybrid"),
});

export const CreateAlertSchema = UserAlertSchema.omit({
  id: true, user_id: true, created_at: true,
});

export const UpdateProfileSchema = UserProfileSchema.pick({
  preferred_tags: true,
  excluded_tags: true,
  preferred_summary_length: true,
}).partial();

export const UpdateUserSchema = UserSchema.pick({
  name: true,
  industry_subscriptions: true,
  newsletter_frequency: true,
  newsletter_time: true,
}).partial();

// ─── Agent pipeline types ──────────────────────────────────────────────────────

export const RawArticleSchema = z.object({
  source_url: z.string().url(),
  title: z.string(),
  full_text: z.string().optional(),
  published_at: z.string().optional(),
  industry_id: z.number().int(),
  source_id: z.string().uuid().optional(),
  language: z.string().default("de"),
});

export const ProcessedArticleSchema = RawArticleSchema.extend({
  summary_short: z.string(),
  summary_medium: z.string(),
  summary_long: z.string(),
  tags: z.array(z.string()),
  relevance_score: z.number().min(0).max(100),
  impact_level: ImpactLevel,
  impact_reason: z.string(),
  trust_score: z.number().min(0).max(1),
  embedding: z.array(z.number()).length(1536),
});

export type Industry = z.infer<typeof IndustrySchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserAlert = z.infer<typeof UserAlertSchema>;
export type Interaction = z.infer<typeof InteractionSchema>;
export type RawArticle = z.infer<typeof RawArticleSchema>;
export type ProcessedArticle = z.infer<typeof ProcessedArticleSchema>;
export type FeedQuery = z.infer<typeof FeedQuerySchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
