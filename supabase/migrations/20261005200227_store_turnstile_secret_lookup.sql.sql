/*
# Secure Turnstile secret storage

1. Purpose
- Store the Cloudflare Turnstile secret key in the database's encrypted vault
  so the submit-appointment edge function can read it server-side.
- The secret itself is inserted outside this migration; this migration creates
  the lookup function used by the edge function.

2. New objects
- `private` schema: holds sensitive lookups away from the public Data API.
- `public.get_turnstile_secret()` (SECURITY DEFINER): returns the decrypted
  Turnstile secret from the vault by name.

3. Security
- The function is SECURITY DEFINER with an empty search_path (no injection).
- EXECUTE is revoked from public/anon/authenticated and granted only to the
  service_role used by the edge function, so website visitors can never call it.
*/

CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION public.get_turnstile_secret()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT decrypted_secret
  FROM vault.decrypted_secrets
  WHERE name = 'TURNSTILE_SECRET_KEY'
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.get_turnstile_secret() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_turnstile_secret() TO service_role;
