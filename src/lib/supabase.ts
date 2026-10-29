const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? "";
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? "";
const siteKey =
  (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() ?? "";

export const TURNSTILE_SITE_KEY = siteKey;
export const VITE_SUPABASE_ANON_KEY = supabaseAnonKey;
export const SUBMIT_APPOINTMENT_URL = supabaseUrl
  ? `${supabaseUrl}/functions/v1/submit-appointment`
  : "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
