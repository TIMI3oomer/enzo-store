import { createClient } from "@supabase/supabase-js";

// -----------------------------------------------------------------------
// CHECKPOINT NOTE — ACTION REQUIRED
// File: src/lib/supabaseClient.js
//
// 1. Create a project at https://supabase.com
// 2. Run the SQL in /supabase/schema.sql (SQL editor) to create the tables
//    and Row Level Security policies.
// 3. Copy your Project URL and anon/public API key from
//    Project Settings -> API, and put them in a ".env" file at the project
//    root (copy .env.example to .env and fill in the two values).
// 4. Never commit the "service_role" key to the frontend — only the
//    "anon" key belongs here. The service_role key must only be used in a
//    secure server/edge function (see note in schema.sql about RLS).
// -----------------------------------------------------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev instead of silently breaking every data call.
  console.error(
    "[ENZO] Missing Supabase env vars. Copy .env.example to .env and fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist the admin session in localStorage so refreshing the admin
    // dashboard doesn't log the store owner out.
    persistSession: true,
    autoRefreshToken: true,
  },
});
