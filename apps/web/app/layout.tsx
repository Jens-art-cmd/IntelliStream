import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IntelliStream — KI-Brancheninformationen",
    template: "%s | IntelliStream",
  },
  description:
    "Tagesaktuelle, KI-aufbereitete Fachinformationen aus 20 Branchen. Personalisiert, quellentransparent, bezahlbar.",
  openGraph: {
    siteName: "IntelliStream",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
