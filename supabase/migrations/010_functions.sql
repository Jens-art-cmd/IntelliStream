-- Semantic similarity search function
create or replace function search_articles(
  query_embedding   vector(1536),
  industry_ids      integer[]  default null,
  match_threshold   float      default 0.7,
  match_count       integer    default 20,
  offset_count      integer    default 0
)
returns table (
  id              uuid,
  title           text,
  summary_medium  text,
  industry_id     integer,
  tags            text[],
  relevance_score float,
  impact_level    impact_level,
  published_at    timestamptz,
  similarity      float
)
language sql stable as $$
  select
    a.id,
    a.title,
    a.summary_medium,
    a.industry_id,
    a.tags,
    a.relevance_score,
    a.impact_level,
    a.published_at,
    1 - (a.embedding <=> query_embedding) as similarity
  from articles a
  where
    a.embedding is not null
    and (industry_ids is null or a.industry_id = any(industry_ids))
    and 1 - (a.embedding <=> query_embedding) > match_threshold
  order by a.embedding <=> query_embedding
  limit match_count
  offset offset_count;
$$;

-- Personalized feed function: relevance_score * profile similarity * recency
create or replace function get_personalized_feed(
  p_user_id       uuid,
  p_industry_ids  integer[],
  p_limit         integer  default 20,
  p_offset        integer  default 0,
  p_days_back     integer  default 7
)
returns table (
  id              uuid,
  title           text,
  summary_short   text,
  summary_medium  text,
  industry_id     integer,
  tags            text[],
  relevance_score float,
  impact_level    impact_level,
  trust_score     float,
  published_at    timestamptz,
  is_breaking     boolean,
  personalized_score float
)
language sql stable security definer as $$
  with user_vec as (
    select interest_vector from user_profiles where user_id = p_user_id
  ),
  scored as (
    select
      a.id,
      a.title,
      a.summary_short,
      a.summary_medium,
      a.industry_id,
      a.tags,
      a.relevance_score,
      a.impact_level,
      a.trust_score,
      a.published_at,
      a.is_breaking,
      -- Combined score: relevance * profile match * recency decay
      coalesce(a.relevance_score, 50) / 100.0
      * case when uv.interest_vector is not null and a.embedding is not null
             then (1 - (a.embedding <=> uv.interest_vector))
             else 0.5 end
      * exp(-extract(epoch from (now() - a.published_at)) / 86400.0 / 3)
      as personalized_score
    from articles a
    cross join user_vec uv
    where
      a.industry_id = any(p_industry_ids)
      and a.published_at >= now() - (p_days_back || ' days')::interval
      and a.summary_medium is not null
  )
  select * from scored
  order by personalized_score desc
  limit p_limit
  offset p_offset;
$$;

-- Full-text search (German stemming)
create or replace function search_articles_fulltext(
  query_text      text,
  industry_ids    integer[]  default null,
  match_count     integer    default 20,
  offset_count    integer    default 0
)
returns table (
  id              uuid,
  title           text,
  summary_medium  text,
  industry_id     integer,
  tags            text[],
  relevance_score float,
  impact_level    impact_level,
  published_at    timestamptz,
  rank            float
)
language sql stable as $$
  select
    a.id,
    a.title,
    a.summary_medium,
    a.industry_id,
    a.tags,
    a.relevance_score,
    a.impact_level,
    a.published_at,
    ts_rank(to_tsvector('german', a.title || ' ' || coalesce(a.summary_long, '')),
            plainto_tsquery('german', query_text)) as rank
  from articles a
  where
    (industry_ids is null or a.industry_id = any(industry_ids))
    and to_tsvector('german', a.title || ' ' || coalesce(a.summary_long, ''))
        @@ plainto_tsquery('german', query_text)
  order by rank desc
  limit match_count
  offset offset_count;
$$;
