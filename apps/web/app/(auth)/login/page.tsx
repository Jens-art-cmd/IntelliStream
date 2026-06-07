import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Anmelden" };

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-25 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-extrabold tracking-tighter-xl">
            IS
          </div>
          <span className="text-lg font-bold tracking-tighter-lg text-neutral-900">IntelliStream</span>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
