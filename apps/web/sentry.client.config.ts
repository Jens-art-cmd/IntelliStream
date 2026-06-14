/**
 * Sentry — Client-Side Konfiguration (Browser)
 *
 * Wird automatisch von @sentry/nextjs beim App-Start geladen.
 * Env-Var: NEXT_PUBLIC_SENTRY_DSN (muss in Vercel gesetzt sein)
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],

  // Nur in Production aktiv tracen
  enabled: process.env["NODE_ENV"] === "production",

  // Performance-Sampling: 10 % der Requests tracen (anpassen bei mehr Traffic)
  tracesSampleRate: 0.1,

  // Session-Replay: 1 % normal, 100 % bei Errors — nützlich für Bug-Reproduktion
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Source Maps hochladen via withSentryConfig in next.config.mjs
  // → Stack Traces zeigen originalen TypeScript-Code statt minified JS
});
