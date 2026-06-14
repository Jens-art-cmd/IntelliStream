import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  transpilePackages: ["@intellistream/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry-Projekt-Slug und Org aus sentry.io-Dashboard
  org:     process.env["SENTRY_ORG"],
  project: process.env["SENTRY_PROJECT"],

  // Auth-Token für Source-Map-Upload (nur im Build benötigt)
  // In Vercel als SENTRY_AUTH_TOKEN setzen
  authToken: process.env["SENTRY_AUTH_TOKEN"],

  // Source Maps in Production hochladen (Stack Traces zeigen originalen TS-Code)
  sourcemaps: {
    disable: false,
  },

  // Sentry-Tunneling: verhindert Ad-Blocker-Probleme
  // Leitet /api/monitoring an Sentry weiter
  tunnelRoute: "/api/monitoring",

  // Hält Bundle-Größe klein (Tree-Shaking)
  disableLogger: true,

  // Verhindert zu viele automatische Spans für kleine Projekte
  automaticVercelMonitors: false,
});
