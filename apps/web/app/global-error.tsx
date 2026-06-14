"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="de">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", background: "#FAF8F4", color: "#1A1813" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#E08900", marginBottom: "0.75rem" }}>
          DistillFeed
        </p>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 400, marginBottom: "0.5rem" }}>Ein Fehler ist aufgetreten</h1>
        <p style={{ color: "#57534A", fontSize: "14px", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Bitte lade die Seite neu. Tritt der Fehler erneut auf, schreib uns an{" "}
          <a href="mailto:support@distillfeed.eu" style={{ color: "#E08900" }}>support@distillfeed.eu</a>.
        </p>
        {error?.digest && (
          <p style={{ color: "#C8C2B6", fontSize: "11px", marginBottom: "1.5rem" }}>
            Ref: {error.digest}
          </p>
        )}
        <button
          onClick={() => location.reload()}
          style={{ padding: "0.6rem 1.5rem", cursor: "pointer", background: "#FFB300", color: "#1A1100", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px" }}
        >
          Seite neu laden
        </button>
      </body>
    </html>
  );
}
