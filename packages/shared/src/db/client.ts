import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.js";

// Server-side client with service role (bypasses RLS — agents only)
export function createServiceClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_KEY"];
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY required");
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}

// Server-side client with anon key (respects RLS)
export function createServerClient(accessToken?: string) {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY required");
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : {},
  });
  return client;
}

// Browser client (used in Next.js client components)
export function createBrowserClient() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const key = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY required");
  return createClient<Database>(url, key);
}
