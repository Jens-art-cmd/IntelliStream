"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="de">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", background: "#fff", color: "#111" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Ein Fehler ist aufgetreten</h1>
        <p style={{ color: "#555", marginTop: "0.5rem" }}>
          Bitte lade die Seite neu. Tritt der Fehler erneut auf, wende dich an den Support.
        </p>
        {error?.digest && <p style={{ color: "#999", fontSize: "12px", marginTop: "0.5rem" }}>Ref: {error.digest}</p>}
        <button onClick={() => location.reload()} style={{ marginTop: "1.5rem", padding: "0.5rem 1.25rem", cursor: "pointer", background: "#0171c4", color: "#fff", border: "none", borderRadius: "6px" }}>
          Neu laden
        </button>
      </body>
    </html>
  );
}
