/**
 * Sentry — Server-Side Konfiguration (API Routes, RSC, SSR)
 *
 * Wird über instrumentation.ts beim Server-Start geladen.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],

  enabled: process.env["NODE_ENV"] === "production",

  // Server-Side Tracing: alle Requests tracen (kein Browser-Overhead)
  tracesSampleRate: 0.2,
});
