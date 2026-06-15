import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, Mail } from "lucide-react";

export const metadata: Metadata = { title: "Newsletter · DistillFeed" };

type Status = "success" | "already" | "expired" | "invalid" | "error" | "unsubscribed";

const STATES: Record<Status, {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  body: string;
  cta: string;
  ctaHref: string;
}> = {
  success: {
    icon: <CheckCircle size={28} strokeWidth={1.5} color="#2D7553" />,
    iconBg: "#E8F5EE",
    title: "Weekly Briefing aktiviert",
    body: "Du erhältst ab jetzt jeden Montag dein personalisiertes Weekly Briefing — die Top 5 Meldungen aus deinen Branchen, KI-kuratiert und impact-gerankt.",
    cta: "Zum Feed →",
    ctaHref: "/dashboard/feed",
  },
  already: {
    icon: <CheckCircle size={28} strokeWidth={1.5} color="#2D7553" />,
    iconBg: "#E8F5EE",
    title: "Bereits abonniert",
    body: "Dein Weekly Briefing ist bereits aktiv. Du erhältst es weiterhin jeden Montag.",
    cta: "Zu den Einstellungen →",
    ctaHref: "/dashboard/settings",
  },
  expired: {
    icon: <Clock size={28} strokeWidth={1.5} color="#E08900" />,
    iconBg: "#FFF6E0",
    title: "Link abgelaufen",
    body: "Der Bestätigungslink ist nicht mehr gültig (24-Stunden-Frist überschritten). Bitte fordere in den Einstellungen einen neuen Link an.",
    cta: "Neuen Link anfordern →",
    ctaHref: "/dashboard/settings",
  },
  invalid: {
    icon: <XCircle size={28} strokeWidth={1.5} color="#DC2626" />,
    iconBg: "#FEF2F2",
    title: "Ungültiger Link",
    body: "Dieser Bestätigungslink ist nicht gültig oder wurde bereits verwendet.",
    cta: "Zu den Einstellungen →",
    ctaHref: "/dashboard/settings",
  },
  error: {
    icon: <XCircle size={28} strokeWidth={1.5} color="#DC2626" />,
    iconBg: "#FEF2F2",
    title: "Fehler aufgetreten",
    body: "Bei der Bestätigung ist ein Fehler aufgetreten. Bitte versuche es erneut oder kontaktiere unseren Support.",
    cta: "Erneut versuchen →",
    ctaHref: "/dashboard/settings",
  },
  unsubscribed: {
    icon: <Mail size={28} strokeWidth={1.5} color="#8C887E" />,
    iconBg: "#F1EDE4",
    title: "Erfolgreich abgemeldet",
    body: "Du hast dich vom Weekly Briefing abgemeldet. Du kannst dich jederzeit in den Einstellungen wieder anmelden.",
    cta: "Zu den Einstellungen →",
    ctaHref: "/dashboard/settings",
  },
};

export default async function NewsletterBestaetigt({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; token?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status: Status = (rawStatus as Status) in STATES ? (rawStatus as Status) : "invalid";
  const state = STATES[status];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#FAF8F4" }}
    >
      <div className="w-full max-w-md">

        {/* Logo eyebrow */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <span className="block w-5 h-px" style={{ background: "#E08900" }} />
          <span
            className="text-[10px] font-bold uppercase"
            style={{ letterSpacing: "0.2em", color: "#E08900" }}
          >
            DistillFeed
          </span>
          <span className="block w-5 h-px" style={{ background: "#E08900" }} />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "#FFFFFF", border: "1px solid #E2DDD2" }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: state.iconBg }}
          >
            {state.icon}
          </div>

          {/* Title */}
          <h1
            className="text-xl font-light mb-3 leading-tight"
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              color: "#1A1813",
              letterSpacing: "-0.01em",
            }}
          >
            {state.title}
          </h1>

          {/* Body */}
          <p className="text-sm leading-relaxed mb-7" style={{ color: "#57534A" }}>
            {state.body}
          </p>

          {/* CTA */}
          <Link
            href={state.ctaHref}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-px"
            style={{ background: "#FFB300", color: "#1A1100", boxShadow: "0 2px 8px rgba(224,137,0,0.2)" }}
          >
            {state.cta}
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-5" style={{ color: "#C8C2B6" }}>
          Fragen?{" "}
          <a href="mailto:support@distillfeed.eu" className="hover:underline" style={{ color: "#8C887E" }}>
            support@distillfeed.eu
          </a>
        </p>

      </div>
    </div>
  );
}
