import type { Database } from "./database.types.js";
export declare function createServiceClient(): import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
    Tables: {
        industries: {
            Row: {
                id: number;
                name: string;
                slug: string;
                description: string | null;
                sources: import("./database.types.js").Json;
                tags_taxonomy: import("./database.types.js").Json;
                crawl_interval_minutes: number;
                is_active: boolean;
                created_at: string;
            };
            Insert: Omit<{
                id: number;
                name: string;
                slug: string;
                description: string | null;
                sources: import("./database.types.js").Json;
                tags_taxonomy: import("./database.types.js").Json;
                crawl_interval_minutes: number;
                is_active: boolean;
                created_at: string;
            }, "created_at"> & {
                created_at?: string;
            };
            Update: Partial<Omit<{
                id: number;
                name: string;
                slug: string;
                description: string | null;
                sources: import("./database.types.js").Json;
                tags_taxonomy: import("./database.types.js").Json;
                crawl_interval_minutes: number;
                is_active: boolean;
                created_at: string;
            }, "created_at"> & {
                created_at?: string;
            }>;
            Relationships: [];
        };
        sources: {
            Row: {
                id: string;
                industry_id: number;
                name: string;
                url: string;
                type: import("./database.types.js").SourceTypeDb;
                trust_level: import("./database.types.js").TrustLevelDb;
                is_active: boolean;
                last_crawled: string | null;
                articles_per_day_avg: number | null;
                config: import("./database.types.js").Json;
                created_at: string;
            };
            Insert: Omit<{
                id: string;
                industry_id: number;
                name: string;
                url: string;
                type: import("./database.types.js").SourceTypeDb;
                trust_level: import("./database.types.js").TrustLevelDb;
                is_active: boolean;
                last_crawled: string | null;
                articles_per_day_avg: number | null;
                config: import("./database.types.js").Json;
                created_at: string;
            }, "id" | "created_at"> & {
                id?: string;
                created_at?: string;
            };
            Update: Partial<Omit<{
                id: string;
                industry_id: number;
                name: string;
                url: string;
                type: import("./database.types.js").SourceTypeDb;
                trust_level: import("./database.types.js").TrustLevelDb;
                is_active: boolean;
                last_crawled: string | null;
                articles_per_day_avg: number | null;
                config: import("./database.types.js").Json;
                created_at: string;
            }, "id" | "created_at"> & {
                id?: string;
                created_at?: string;
            }>;
            Relationships: [{
                foreignKeyName: "sources_industry_id_fkey";
                columns: ["industry_id"];
                isOneToOne: false;
                referencedRelation: "industries";
                referencedColumns: ["id"];
            }];
        };
        articles: {
            Row: {
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
                impact_level: import("./database.types.js").ImpactLevelDb | null;
                impact_reason: string | null;
                trust_score: number | null;
                published_at: string | null;
                ingested_at: string;
                processed_at: string | null;
                embedding: number[] | null;
                language: string;
                is_breaking: boolean;
            };
            Insert: {
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
                impact_level?: import("./database.types.js").ImpactLevelDb | null;
                impact_reason?: string | null;
                trust_score?: number | null;
                published_at?: string | null;
                ingested_at?: string;
                processed_at?: string | null;
                embedding?: number[] | null;
                language?: string;
                is_breaking?: boolean;
            };
            Update: Partial<{
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
                impact_level?: import("./database.types.js").ImpactLevelDb | null;
                impact_reason?: string | null;
                trust_score?: number | null;
                published_at?: string | null;
                ingested_at?: string;
                processed_at?: string | null;
                embedding?: number[] | null;
                language?: string;
                is_breaking?: boolean;
            }>;
            Relationships: [{
                foreignKeyName: "articles_industry_id_fkey";
                columns: ["industry_id"];
                isOneToOne: false;
                referencedRelation: "industries";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "articles_source_id_fkey";
                columns: ["source_id"];
                isOneToOne: false;
                referencedRelation: "sources";
                referencedColumns: ["id"];
            }];
        };
        users: {
            Row: {
                id: string;
                email: string;
                name: string | null;
                plan: import("./database.types.js").PlanTypeDb;
                industry_subscriptions: number[];
                newsletter_frequency: import("./database.types.js").NewsletterFrequencyDb;
                newsletter_time: string;
                stripe_customer_id: string | null;
                stripe_subscription_id: string | null;
                newsletter_opt_in: boolean;
                newsletter_opt_in_at: string | null;
                deletion_requested_at: string | null;
                created_at: string;
                updated_at: string;
            };
            Insert: {
                id: string;
                email: string;
                name?: string | null;
                plan?: import("./database.types.js").PlanTypeDb;
                industry_subscriptions?: number[];
                newsletter_frequency?: import("./database.types.js").NewsletterFrequencyDb;
                newsletter_time?: string;
                stripe_customer_id?: string | null;
                stripe_subscription_id?: string | null;
                newsletter_opt_in?: boolean;
                newsletter_opt_in_at?: string | null;
                deletion_requested_at?: string | null;
                created_at?: string;
                updated_at?: string;
            };
            Update: Partial<Omit<{
                id: string;
                email: string;
                name: string | null;
                plan: import("./database.types.js").PlanTypeDb;
                industry_subscriptions: number[];
                newsletter_frequency: import("./database.types.js").NewsletterFrequencyDb;
                newsletter_time: string;
                stripe_customer_id: string | null;
                stripe_subscription_id: string | null;
                newsletter_opt_in: boolean;
                newsletter_opt_in_at: string | null;
                deletion_requested_at: string | null;
                created_at: string;
                updated_at: string;
            }, "id" | "created_at">>;
            Relationships: [];
        };
        user_profiles: {
            Row: {
                user_id: string;
                interest_vector: number[] | null;
                preferred_tags: string[];
                excluded_tags: string[];
                avg_read_depth: number;
                preferred_summary_length: import("./database.types.js").SummaryLengthDb;
                updated_at: string;
            };
            Insert: {
                user_id: string;
            } & Partial<Omit<{
                user_id: string;
                interest_vector: number[] | null;
                preferred_tags: string[];
                excluded_tags: string[];
                avg_read_depth: number;
                preferred_summary_length: import("./database.types.js").SummaryLengthDb;
                updated_at: string;
            }, "user_id">>;
            Update: Partial<Omit<{
                user_id: string;
                interest_vector: number[] | null;
                preferred_tags: string[];
                excluded_tags: string[];
                avg_read_depth: number;
                preferred_summary_length: import("./database.types.js").SummaryLengthDb;
                updated_at: string;
            }, "user_id">>;
            Relationships: [{
                foreignKeyName: "user_profiles_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: true;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        user_alerts: {
            Row: {
                id: string;
                user_id: string;
                name: string;
                keywords: string[];
                companies: string[];
                laws: string[];
                min_impact: import("./database.types.js").ImpactLevelDb;
                channel: import("./database.types.js").AlertChannelDb;
                is_active: boolean;
                created_at: string;
            };
            Insert: Omit<{
                id: string;
                user_id: string;
                name: string;
                keywords: string[];
                companies: string[];
                laws: string[];
                min_impact: import("./database.types.js").ImpactLevelDb;
                channel: import("./database.types.js").AlertChannelDb;
                is_active: boolean;
                created_at: string;
            }, "id" | "created_at"> & {
                id?: string;
                created_at?: string;
            };
            Update: Partial<Omit<{
                id: string;
                user_id: string;
                name: string;
                keywords: string[];
                companies: string[];
                laws: string[];
                min_impact: import("./database.types.js").ImpactLevelDb;
                channel: import("./database.types.js").AlertChannelDb;
                is_active: boolean;
                created_at: string;
            }, "id" | "created_at" | "user_id">>;
            Relationships: [{
                foreignKeyName: "user_alerts_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        interactions: {
            Row: {
                id: string;
                user_id: string;
                article_id: string;
                event_type: import("./database.types.js").InteractionEventDb;
                read_duration_seconds: number | null;
                scroll_depth: number | null;
                occurred_at: string;
            };
            Insert: Omit<{
                id: string;
                user_id: string;
                article_id: string;
                event_type: import("./database.types.js").InteractionEventDb;
                read_duration_seconds: number | null;
                scroll_depth: number | null;
                occurred_at: string;
            }, "id" | "occurred_at"> & {
                id?: string;
                occurred_at?: string;
            };
            Update: Partial<Omit<{
                id: string;
                user_id: string;
                article_id: string;
                event_type: import("./database.types.js").InteractionEventDb;
                read_duration_seconds: number | null;
                scroll_depth: number | null;
                occurred_at: string;
            }, "id" | "occurred_at"> & {
                id?: string;
                occurred_at?: string;
            }>;
            Relationships: [{
                foreignKeyName: "interactions_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "interactions_article_id_fkey";
                columns: ["article_id"];
                isOneToOne: false;
                referencedRelation: "articles";
                referencedColumns: ["id"];
            }];
        };
        newsletters: {
            Row: {
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
            Insert: Omit<{
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
            }, "id" | "sent_at"> & {
                id?: string;
                sent_at?: string;
            };
            Update: Partial<Omit<{
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
            }, "id" | "sent_at"> & {
                id?: string;
                sent_at?: string;
            }>;
            Relationships: [{
                foreignKeyName: "newsletters_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        newsletter_opt_in_tokens: {
            Row: {
                token: string;
                user_id: string;
                expires_at: string;
                used_at: string | null;
            };
            Insert: Omit<{
                token: string;
                user_id: string;
                expires_at: string;
                used_at: string | null;
            }, "token" | "expires_at"> & {
                token?: string;
                expires_at?: string;
            };
            Update: Partial<Omit<{
                token: string;
                user_id: string;
                expires_at: string;
                used_at: string | null;
            }, "token" | "expires_at"> & {
                token?: string;
                expires_at?: string;
            }>;
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
                impact_level: import("./database.types.js").ImpactLevelDb | null;
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
                impact_level: import("./database.types.js").ImpactLevelDb | null;
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
                impact_level: import("./database.types.js").ImpactLevelDb | null;
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
}, {
    PostgrestVersion: "12";
}>;
export declare function createServerClient(accessToken?: string): import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
    Tables: {
        industries: {
            Row: {
                id: number;
                name: string;
                slug: string;
                description: string | null;
                sources: import("./database.types.js").Json;
                tags_taxonomy: import("./database.types.js").Json;
                crawl_interval_minutes: number;
                is_active: boolean;
                created_at: string;
            };
            Insert: Omit<{
                id: number;
                name: string;
                slug: string;
                description: string | null;
                sources: import("./database.types.js").Json;
                tags_taxonomy: import("./database.types.js").Json;
                crawl_interval_minutes: number;
                is_active: boolean;
                created_at: string;
            }, "created_at"> & {
                created_at?: string;
            };
            Update: Partial<Omit<{
                id: number;
                name: string;
                slug: string;
                description: string | null;
                sources: import("./database.types.js").Json;
                tags_taxonomy: import("./database.types.js").Json;
                crawl_interval_minutes: number;
                is_active: boolean;
                created_at: string;
            }, "created_at"> & {
                created_at?: string;
            }>;
            Relationships: [];
        };
        sources: {
            Row: {
                id: string;
                industry_id: number;
                name: string;
                url: string;
                type: import("./database.types.js").SourceTypeDb;
                trust_level: import("./database.types.js").TrustLevelDb;
                is_active: boolean;
                last_crawled: string | null;
                articles_per_day_avg: number | null;
                config: import("./database.types.js").Json;
                created_at: string;
            };
            Insert: Omit<{
                id: string;
                industry_id: number;
                name: string;
                url: string;
                type: import("./database.types.js").SourceTypeDb;
                trust_level: import("./database.types.js").TrustLevelDb;
                is_active: boolean;
                last_crawled: string | null;
                articles_per_day_avg: number | null;
                config: import("./database.types.js").Json;
                created_at: string;
            }, "id" | "created_at"> & {
                id?: string;
                created_at?: string;
            };
            Update: Partial<Omit<{
                id: string;
                industry_id: number;
                name: string;
                url: string;
                type: import("./database.types.js").SourceTypeDb;
                trust_level: import("./database.types.js").TrustLevelDb;
                is_active: boolean;
                last_crawled: string | null;
                articles_per_day_avg: number | null;
                config: import("./database.types.js").Json;
                created_at: string;
            }, "id" | "created_at"> & {
                id?: string;
                created_at?: string;
            }>;
            Relationships: [{
                foreignKeyName: "sources_industry_id_fkey";
                columns: ["industry_id"];
                isOneToOne: false;
                referencedRelation: "industries";
                referencedColumns: ["id"];
            }];
        };
        articles: {
            Row: {
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
                impact_level: import("./database.types.js").ImpactLevelDb | null;
                impact_reason: string | null;
                trust_score: number | null;
                published_at: string | null;
                ingested_at: string;
                processed_at: string | null;
                embedding: number[] | null;
                language: string;
                is_breaking: boolean;
            };
            Insert: {
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
                impact_level?: import("./database.types.js").ImpactLevelDb | null;
                impact_reason?: string | null;
                trust_score?: number | null;
                published_at?: string | null;
                ingested_at?: string;
                processed_at?: string | null;
                embedding?: number[] | null;
                language?: string;
                is_breaking?: boolean;
            };
            Update: Partial<{
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
                impact_level?: import("./database.types.js").ImpactLevelDb | null;
                impact_reason?: string | null;
                trust_score?: number | null;
                published_at?: string | null;
                ingested_at?: string;
                processed_at?: string | null;
                embedding?: number[] | null;
                language?: string;
                is_breaking?: boolean;
            }>;
            Relationships: [{
                foreignKeyName: "articles_industry_id_fkey";
                columns: ["industry_id"];
                isOneToOne: false;
                referencedRelation: "industries";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "articles_source_id_fkey";
                columns: ["source_id"];
                isOneToOne: false;
                referencedRelation: "sources";
                referencedColumns: ["id"];
            }];
        };
        users: {
            Row: {
                id: string;
                email: string;
                name: string | null;
                plan: import("./database.types.js").PlanTypeDb;
                industry_subscriptions: number[];
                newsletter_frequency: import("./database.types.js").NewsletterFrequencyDb;
                newsletter_time: string;
                stripe_customer_id: string | null;
                stripe_subscription_id: string | null;
                newsletter_opt_in: boolean;
                newsletter_opt_in_at: string | null;
                deletion_requested_at: string | null;
                created_at: string;
                updated_at: string;
            };
            Insert: {
                id: string;
                email: string;
                name?: string | null;
                plan?: import("./database.types.js").PlanTypeDb;
                industry_subscriptions?: number[];
                newsletter_frequency?: import("./database.types.js").NewsletterFrequencyDb;
                newsletter_time?: string;
                stripe_customer_id?: string | null;
                stripe_subscription_id?: string | null;
                newsletter_opt_in?: boolean;
                newsletter_opt_in_at?: string | null;
                deletion_requested_at?: string | null;
                created_at?: string;
                updated_at?: string;
            };
            Update: Partial<Omit<{
                id: string;
                email: string;
                name: string | null;
                plan: import("./database.types.js").PlanTypeDb;
                industry_subscriptions: number[];
                newsletter_frequency: import("./database.types.js").NewsletterFrequencyDb;
                newsletter_time: string;
                stripe_customer_id: string | null;
                stripe_subscription_id: string | null;
                newsletter_opt_in: boolean;
                newsletter_opt_in_at: string | null;
                deletion_requested_at: string | null;
                created_at: string;
                updated_at: string;
            }, "id" | "created_at">>;
            Relationships: [];
        };
        user_profiles: {
            Row: {
                user_id: string;
                interest_vector: number[] | null;
                preferred_tags: string[];
                excluded_tags: string[];
                avg_read_depth: number;
                preferred_summary_length: import("./database.types.js").SummaryLengthDb;
                updated_at: string;
            };
            Insert: {
                user_id: string;
            } & Partial<Omit<{
                user_id: string;
                interest_vector: number[] | null;
                preferred_tags: string[];
                excluded_tags: string[];
                avg_read_depth: number;
                preferred_summary_length: import("./database.types.js").SummaryLengthDb;
                updated_at: string;
            }, "user_id">>;
            Update: Partial<Omit<{
                user_id: string;
                interest_vector: number[] | null;
                preferred_tags: string[];
                excluded_tags: string[];
                avg_read_depth: number;
                preferred_summary_length: import("./database.types.js").SummaryLengthDb;
                updated_at: string;
            }, "user_id">>;
            Relationships: [{
                foreignKeyName: "user_profiles_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: true;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        user_alerts: {
            Row: {
                id: string;
                user_id: string;
                name: string;
                keywords: string[];
                companies: string[];
                laws: string[];
                min_impact: import("./database.types.js").ImpactLevelDb;
                channel: import("./database.types.js").AlertChannelDb;
                is_active: boolean;
                created_at: string;
            };
            Insert: Omit<{
                id: string;
                user_id: string;
                name: string;
                keywords: string[];
                companies: string[];
                laws: string[];
                min_impact: import("./database.types.js").ImpactLevelDb;
                channel: import("./database.types.js").AlertChannelDb;
                is_active: boolean;
                created_at: string;
            }, "id" | "created_at"> & {
                id?: string;
                created_at?: string;
            };
            Update: Partial<Omit<{
                id: string;
                user_id: string;
                name: string;
                keywords: string[];
                companies: string[];
                laws: string[];
                min_impact: import("./database.types.js").ImpactLevelDb;
                channel: import("./database.types.js").AlertChannelDb;
                is_active: boolean;
                created_at: string;
            }, "id" | "created_at" | "user_id">>;
            Relationships: [{
                foreignKeyName: "user_alerts_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        interactions: {
            Row: {
                id: string;
                user_id: string;
                article_id: string;
                event_type: import("./database.types.js").InteractionEventDb;
                read_duration_seconds: number | null;
                scroll_depth: number | null;
                occurred_at: string;
            };
            Insert: Omit<{
                id: string;
                user_id: string;
                article_id: string;
                event_type: import("./database.types.js").InteractionEventDb;
                read_duration_seconds: number | null;
                scroll_depth: number | null;
                occurred_at: string;
            }, "id" | "occurred_at"> & {
                id?: string;
                occurred_at?: string;
            };
            Update: Partial<Omit<{
                id: string;
                user_id: string;
                article_id: string;
                event_type: import("./database.types.js").InteractionEventDb;
                read_duration_seconds: number | null;
                scroll_depth: number | null;
                occurred_at: string;
            }, "id" | "occurred_at"> & {
                id?: string;
                occurred_at?: string;
            }>;
            Relationships: [{
                foreignKeyName: "interactions_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "interactions_article_id_fkey";
                columns: ["article_id"];
                isOneToOne: false;
                referencedRelation: "articles";
                referencedColumns: ["id"];
            }];
        };
        newsletters: {
            Row: {
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
            Insert: Omit<{
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
            }, "id" | "sent_at"> & {
                id?: string;
                sent_at?: string;
            };
            Update: Partial<Omit<{
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
            }, "id" | "sent_at"> & {
                id?: string;
                sent_at?: string;
            }>;
            Relationships: [{
                foreignKeyName: "newsletters_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        newsletter_opt_in_tokens: {
            Row: {
                token: string;
                user_id: string;
                expires_at: string;
                used_at: string | null;
            };
            Insert: Omit<{
                token: string;
                user_id: string;
                expires_at: string;
                used_at: string | null;
            }, "token" | "expires_at"> & {
                token?: string;
                expires_at?: string;
            };
            Update: Partial<Omit<{
                token: string;
                user_id: string;
                expires_at: string;
                used_at: string | null;
            }, "token" | "expires_at"> & {
                token?: string;
                expires_at?: string;
            }>;
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
                impact_level: import("./database.types.js").ImpactLevelDb | null;
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
                impact_level: import("./database.types.js").ImpactLevelDb | null;
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
                impact_level: import("./database.types.js").ImpactLevelDb | null;
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
}, {
    PostgrestVersion: "12";
}>;
