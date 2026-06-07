# IntelliStream — Entwicklungskontext

## Projekt
KI-betriebene Fachinformationsplattform für 20 Branchen. SaaS B2B/B2C.
Konzept: `IntelliStream_Platform_Konzept.pdf` (24 Seiten, vollständige Spezifikation).

## Monorepo-Struktur
```
apps/web          Next.js 14 Frontend (App Router, Tailwind, Supabase Auth)
apps/api          Fastify 4 REST-API (Port 4000)
packages/shared   Zod-Schemas, Supabase-Client, Claude-Prompts, DB-Types
packages/agents/  n8n-kompatible Agent-Workflows (scout, processor, personalizer, delivery)
supabase/         SQL-Migrationen (001–011)
n8n/workflows/    Exportierte n8n-JSON-Workflows
```

## Tech-Entscheidungen (aus Konzept)
- TypeScript überall
- Zod für alle Schemas — nur aus `packages/shared`
- Supabase-Client nur in `packages/shared/src/db` (nie direkt in Komponenten)
- Alle Claude-Prompts in `packages/shared/src/prompts` als exportierte Konstanten
- n8n-Workflows als JSON in `/n8n/workflows` versioniert
- Feed-Queries immer Limit 20 + Pagination
- Claude API: max. 3 Calls pro Artikel (Summary + Score + Tags in einem Prompt kombinieren)

## DSGVO-Pflichten
- Kein Full-Text-Speicher bei urheberrechtlich geschützten Quellen (nur Summary + URL)
- Alle User-Daten EU-Server (Supabase Frankfurt)
- Double-Opt-In für Newsletter (§7 UWG) — Token-Tabelle vorhanden
- DSGVO-Löschfunktion: `DELETE /user/me` setzt `deletion_requested_at`

## Datenbankschema (Supabase/PostgreSQL + pgvector)
Tabellen: `industries`, `sources`, `articles`, `users`, `user_profiles`,
`user_alerts`, `interactions`, `newsletters`, `newsletter_opt_in_tokens`

RPC-Funktionen:
- `get_personalized_feed(p_user_id, p_industry_ids, ...)` — Cosinus-Similarity + Recency
- `search_articles(query_embedding, ...)` — Semantische Vektorsuche
- `search_articles_fulltext(query_text, ...)` — Postgres FTS Deutsch

## Umgebungsvariablen
Siehe `.env.example` in `apps/web/` und `apps/api/`.

## Phase-Plan (Kapitel 12)
- Phase 1 ✅ Woche 1-2: Infrastruktur & Datenbanksetup
- Phase 2 Woche 3-5: Agenten-Kern (Source-Scout, Summarizer, Scorer)
- Phase 3 Woche 6-7: Backend API + Auth
- Phase 4 Woche 8-10: Frontend Dashboard MVP
- Phase 5 Woche 11-12: Newsletter + Personalisierung
- Phase 6 Woche 13-16: Alle 20 Branchen + Launch

## Nächste Tasks (Kapitel 14)
- Task 2: Source-Scout-Agent (Pilotbranche Energie) — n8n-Workflow + BNetzA/BMWK/EPEX
- Task 3: Summarizer-Agent — Claude API Prompts, Relevance-Scorer, Embedding-Pipeline
- Task 4: REST-API Grundgerüst — bereits implementiert, fehlend: Stripe-Integration
- Task 5: Next.js Dashboard — bereits implementiert, fehlend: Alert-Manager, Newsletter-Settings
