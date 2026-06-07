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

// Browser client lives in apps/web/lib/supabase.ts (imports from @supabase/ssr)
// Not part of the shared server-side client — agents must not load NEXT_PUBLIC_* env vars.
