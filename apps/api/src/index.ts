import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";
import { createServerClient } from "@intellistream/shared";
import type { User } from "@supabase/supabase-js";

import articlesRoutes from "./routes/articles.js";
import feedRoutes from "./routes/feed.js";
import searchRoutes from "./routes/search.js";
import userRoutes from "./routes/user.js";
import alertsRoutes from "./routes/alerts.js";
import webhooksRoutes from "./routes/webhooks.js";

export type AppSupabaseClient = ReturnType<typeof createServerClient>;

// ─── Type augmentation ────────────────────────────────────────────────────────
declare module "fastify" {
  interface FastifyRequest {
    user: User;
    supabase: AppSupabaseClient;
  }
}

// ─── App setup ────────────────────────────────────────────────────────────────

const isDev = process.env["NODE_ENV"] !== "production";

const app = Fastify({
  logger: isDev
    ? { level: process.env["LOG_LEVEL"] ?? "info", transport: { target: "pino-pretty", options: { colorize: true } } }
    : { level: process.env["LOG_LEVEL"] ?? "info" },
  trustProxy: true,
});

// ─── Plugins ──────────────────────────────────────────────────────────────────

await app.register(sensible);

await app.register(cors, {
  origin: process.env["ALLOWED_ORIGINS"]?.split(",") ?? ["http://localhost:3000"],
  credentials: true,
});

await app.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: "1 minute",
  keyGenerator: (req) => (req.headers["x-user-id"] as string | undefined) ?? req.ip,
});

// ─── Auth hook ────────────────────────────────────────────────────────────────

const OPEN_PATHS = ["/health", "/webhooks/stripe"];

app.addHook("onRequest", async (request, reply) => {
  if (OPEN_PATHS.some((p) => request.routerPath?.startsWith(p))) return;

  const authHeader = request.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return reply.unauthorized("Missing auth token");
  }

  const token = authHeader.slice(7);
  const supabase = createServerClient(token);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return reply.unauthorized("Invalid token");

  request.user = user;
  request.supabase = supabase;
});

// ─── Routes ───────────────────────────────────────────────────────────────────

await app.register(articlesRoutes, { prefix: "/articles" });
await app.register(feedRoutes,     { prefix: "/feed" });
await app.register(searchRoutes,   { prefix: "/search" });
await app.register(userRoutes,     { prefix: "/user" });
await app.register(alertsRoutes,   { prefix: "/alerts" });
await app.register(webhooksRoutes, { prefix: "/webhooks" });

app.get("/health", async () => ({ status: "ok", ts: new Date().toISOString() }));

// ─── Start ────────────────────────────────────────────────────────────────────

const port = Number(process.env["PORT"] ?? 4000);
await app.listen({ port, host: "0.0.0.0" });
