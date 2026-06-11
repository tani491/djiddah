import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Bucket name used for product & hero slide images
export const STORAGE_BUCKET = "products";

// Lazy-initialized Supabase client — won't crash at build time if env vars are missing
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
      );
    }

    _supabase = createClient(url, key);
  }
  return _supabase;
}
