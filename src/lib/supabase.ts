import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const TURNSTILE_SITE_KEY = siteKey;
export const SUBMIT_APPOINTMENT_URL = `${supabaseUrl}/functions/v1/submit-appointment`;
export const VITE_SUPABASE_ANON_KEY = supabaseAnonKey;
