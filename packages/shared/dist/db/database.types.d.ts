export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export type ImpactLevelDb = "high" | "medium" | "low";
export type PlanTypeDb = "free" | "starter" | "pro" | "enterprise";
export type NewsletterFrequencyDb = "daily" | "weekly" | "realtime";
export type SourceTypeDb = "rss" | "api" | "crawler" | "email";
export type TrustLevelDb = "official" | "media" | "blog";
export type SummaryLengthDb = "short" | "medium" | "long";
export type AlertChannelDb = "email" | "push" | "both";
export type InteractionEventDb = "open" | "click" | "read" | "skip" | "thumbs_up" | "thumbs_down" | "bookmark" | "share";
type IndustryRow = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    sources: Json;
    tags_taxonomy: Json;
    crawl_interval_minutes: number;
    is_active: boolean;
    created_at: string;
};
type IndustryInsert = Omit<IndustryRow, "created_at"> & {
    created_at?: string;
};
type SourceRow = {
    id: string;
    industry_id: number;
    name: string;
    url: string;
    type: SourceTypeDb;
    trust_level: TrustLevelDb;
    is_active: boolean;
    last_crawled: string | null;
    articles_per_day_avg: number | null;
    config: Json;
    created_at: string;
};
type SourceInsert = Omit<SourceRow, "id" | "created_at"> & {
    id?: string;
    created_at?: string;
};
type ArticleRow = {
    id: string;
    source_url: string;
    title: string;
    full_text: string | null;
    summary_short: string | null;
    summary_medium: string | null;
    summary_long: string | null;
    industry_id: number;
    source_id: string | null;
    tags: string[];
    relevance_score: number | null;
    impact_level: ImpactLevelDb | null;
    impact_reason: string | null;
    trust_score: number | null;
    published_at: string | null;
    ingested_at: string;
    processed_at: string | null;
    embedding: number[] | null;
    language: string;
    is_breaking: boolean;
};
type ArticleInsert = {
    id?: string;
    source_url: string;
    title: string;
    full_text?: string | null;
    summary_short?: string | null;
    summary_medium?: string | null;
    summary_long?: string | null;
    industry_id: number;
    source_id?: string | null;
    tags?: string[];
    relevance_score?: number | null;
    impact_level?: ImpactLevelDb | null;
    impact_reason?: string | null;
    trust_score?: number | null;
    published_at?: string | null;
    ingested_at?: string;
    processed_at?: string | null;
    embedding?: number[] | null;
    language?: string;
    is_breaking?: boolean;
};
type UserRow = {
    id: string;
    email: string;
    name: string | null;
    plan: PlanTypeDb;
    industry_subscriptions: number[];
    newsletter_frequency: NewsletterFrequencyDb;
    newsletter_time: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    newsletter_opt_in: boolean;
    newsletter_opt_in_at: string | null;
    deletion_requested_at: string | null;
    created_at: string;
    updated_at: string;
};
type UserInsert = {
    id: string;
    email: string;
    name?: string | null;
    plan?: PlanTypeDb;
    industry_subscriptions?: number[];
    newsletter_frequency?: NewsletterFrequencyDb;
    newsletter_time?: string;
    stripe_customer_id?: string | null;
    stripe_subscription_id?: string | null;
    newsletter_opt_in?: boolean;
    newsletter_opt_in_at?: string | null;
    deletion_requested_at?: string | null;
    created_at?: string;
    updated_at?: string;
};
type UserUpdate = Partial<Omit<UserRow, "id" | "created_at">>;
type UserProfileRow = {
    user_id: string;
    interest_vector: number[] | null;
    preferred_tags: string[];
    excluded_tags: string[];
    avg_read_depth: number;
    preferred_summary_length: SummaryLengthDb;
    updated_at: string;
};
type UserProfileInsert = {
    user_id: string;
} & Partial<Omit<UserProfileRow, "user_id">>;
type UserProfileUpdate = Partial<Omit<UserProfileRow, "user_id">>;
type UserAlertRow = {
    id: string;
    user_id: string;
    name: string;
    keywords: string[];
    companies: string[];
    laws: string[];
    min_impact: ImpactLevelDb;
    channel: AlertChannelDb;
    is_active: boolean;
    created_at: string;
};
type UserAlertInsert = Omit<UserAlertRow, "id" | "created_at"> & {
    id?: string;
    created_at?: string;
};
type UserAlertUpdate = Partial<Omit<UserAlertRow, "id" | "user_id" | "created_at">>;
type InteractionRow = {
    id: string;
    user_id: string;
    article_id: string;
    event_type: InteractionEventDb;
    read_duration_seconds: number | null;
    scroll_depth: number | null;
    occurred_at: string;
};
type InteractionInsert = Omit<InteractionRow, "id" | "occurred_at"> & {
    id?: string;
    occurred_at?: string;
};
type NewsletterRow = {
    id: string;
    user_id: string;
    sent_at: string;
    article_ids: string[];
    subject_line: string;
    html_content: string;
    variant: string | null;
    open_rate: number | null;
    click_rate: number | null;
    bounced: boolean;
};
type NewsletterInsert = Omit<NewsletterRow, "id" | "sent_at"> & {
    id?: string;
    sent_at?: string;
};
type NewsletterOptInTokenRow = {
    token: string;
    user_id: string;
    expires_at: string;
    used_at: string | null;
};
type NewsletterOptInTokenInsert = Omit<NewsletterOptInTokenRow, "token" | "expires_at"> & {
    token?: string;
    expires_at?: string;
};
export type Database = {
    public: {
        Tables: {
            industries: {
                Row: IndustryRow;
                Insert: IndustryInsert;
                Update: Partial<IndustryInsert>;
                Relationships: [];
            };
            sources: {
                Row: SourceRow;
                Insert: SourceInsert;
                Update: Partial<SourceInsert>;
                Relationships: [{
                    foreignKeyName: "sources_industry_id_fkey";
                    columns: ["industry_id"];
                    isOneToOne: false;
                    referencedRelation: "industries";
                    referencedColumns: ["id"];
                }];
            };
            articles: {
                Row: ArticleRow;
                Insert: ArticleInsert;
                Update: Partial<ArticleInsert>;
                Relationships: [
                    {
                        foreignKeyName: "articles_industry_id_fkey";
                        columns: ["industry_id"];
                        isOneToOne: false;
                        referencedRelation: "industries";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "articles_source_id_fkey";
                        columns: ["source_id"];
                        isOneToOne: false;
                        referencedRelation: "sources";
                        referencedColumns: ["id"];
                    }
                ];
            };
            users: {
                Row: UserRow;
                Insert: UserInsert;
                Update: UserUpdate;
                Relationships: [];
            };
            user_profiles: {
                Row: UserProfileRow;
                Insert: UserProfileInsert;
                Update: UserProfileUpdate;
                Relationships: [{
                    foreignKeyName: "user_profiles_user_id_fkey";
                    columns: ["user_id"];
                    isOneToOne: true;
                    referencedRelation: "users";
                    referencedColumns: ["id"];
                }];
            };
            user_alerts: {
                Row: UserAlertRow;
                Insert: UserAlertInsert;
                Update: UserAlertUpdate;
                Relationships: [{
                    foreignKeyName: "user_alerts_user_id_fkey";
                    columns: ["user_id"];
                    isOneToOne: false;
                    referencedRelation: "users";
                    referencedColumns: ["id"];
                }];
            };
            interactions: {
                Row: InteractionRow;
                Insert: InteractionInsert;
                Update: Partial<InteractionInsert>;
                Relationships: [
                    {
                        foreignKeyName: "interactions_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "interactions_article_id_fkey";
                        columns: ["article_id"];
                        isOneToOne: false;
                        referencedRelation: "articles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            newsletters: {
                Row: NewsletterRow;
                Insert: NewsletterInsert;
                Update: Partial<NewsletterInsert>;
                Relationships: [{
                    foreignKeyName: "newsletters_user_id_fkey";
                    columns: ["user_id"];
                    isOneToOne: false;
                    referencedRelation: "users";
                    referencedColumns: ["id"];
                }];
            };
            newsletter_opt_in_tokens: {
                Row: NewsletterOptInTokenRow;
                Insert: NewsletterOptInTokenInsert;
                Update: Partial<NewsletterOptInTokenInsert>;
                Relationships: [{
                    foreignKeyName: "newsletter_opt_in_tokens_user_id_fkey";
                    columns: ["user_id"];
                    isOneToOne: false;
                    referencedRelation: "users";
                    referencedColumns: ["id"];
                }];
            };
        };
        Functions: {
            search_articles: {
                Args: {
                    query_embedding: number[];
                    industry_ids?: number[] | null;
                    match_threshold?: number;
                    match_count?: number;
                    offset_count?: number;
                };
                Returns: Array<{
                    id: string;
                    title: string;
                    summary_medium: string | null;
                    industry_id: number;
                    tags: string[];
                    relevance_score: number | null;
                    impact_level: ImpactLevelDb | null;
                    published_at: string | null;
                    similarity: number;
                }>;
            };
            get_personalized_feed: {
                Args: {
                    p_user_id: string;
                    p_industry_ids: number[];
                    p_limit?: number;
                    p_offset?: number;
                    p_days_back?: number;
                };
                Returns: Array<{
                    id: string;
                    title: string;
                    summary_short: string | null;
                    summary_medium: string | null;
                    industry_id: number;
                    tags: string[];
                    relevance_score: number | null;
                    impact_level: ImpactLevelDb | null;
                    trust_score: number | null;
                    published_at: string | null;
                    is_breaking: boolean;
                    personalized_score: number;
                }>;
            };
            search_articles_fulltext: {
                Args: {
                    query_text: string;
                    industry_ids?: number[] | null;
                    match_count?: number;
                    offset_count?: number;
                };
                Returns: Array<{
                    id: string;
                    title: string;
                    summary_medium: string | null;
                    industry_id: number;
                    tags: string[];
                    relevance_score: number | null;
                    impact_level: ImpactLevelDb | null;
                    published_at: string | null;
                    rank: number;
                }>;
            };
        };
        Views: Record<string, {
            Row: Record<string, unknown>;
            Relationships: [];
        }>;
        Enums: Record<string, string[]>;
        CompositeTypes: Record<string, Record<string, string | null>>;
    };
};
export {};
