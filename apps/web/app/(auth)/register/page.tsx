import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = { title: "Registrieren · IntelliStream" };

export default function RegisterPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#0d1424" }}
    >
      {/* Subtle glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #ffb300 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 shadow-md"
            style={{ background: "linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)" }}
          >
            <span className="text-sm font-black text-white tracking-tight">IS</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">IntelliStream</span>
        </div>

        <Suspense>
          <RegisterForm />
        </Suspense>

        <p className="text-center text-xs text-slate-600 mt-6">
          <Link href="/" className="hover:text-slate-400 transition-colors">← Zurück zur Startseite</Link>
        </p>
      </div>
    </main>
  );
}
