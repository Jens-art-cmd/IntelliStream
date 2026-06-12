import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DistillFeed — KI-Brancheninformationen",
    template: "%s | DistillFeed",
  },
  description:
    "Tagesaktuelle, KI-aufbereitete Fachinformationen aus 20 Branchen. Personalisiert, quellentransparent, bezahlbar.",
  openGraph: {
    siteName: "DistillFeed",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="bg-neutral-25 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
