import { Fraunces, Hanken_Grotesk, Space_Mono } from "next/font/google";
import LandingClient from "./LandingClient";

// Editorial display serif — Fraunces (variable, optical sizing)
const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
});

// Body sans — Hanken Grotesk (variable, humanist, quiet)
const body = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Data / metrics mono — Space Mono
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
});

export default function LandingPage() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <LandingClient />
    </div>
  );
}
