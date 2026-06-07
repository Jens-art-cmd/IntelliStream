-- Enable required PostgreSQL extensions
create extension if not exists "pgvector" with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pg_trgm" with schema extensions; -- for full-text search

-- Expose extensions to public schema
create extension if not exists "pgvector";
