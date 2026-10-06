/*
# Temporary Turnstile test-mode lookup

1. Purpose
- Adds a server-side helper `get_turnstile_test_mode()` that returns TRUE only when a
  vault secret named `TURNSTILE_TEST_MODE` exists with the value `1`.
- The `submit-appointment` edge function uses this to temporarily skip Turnstile
  verification while the widget's domain allowlist is being fixed.

2. Security
- SECURITY DEFINER so the edge function (service role) can read the vault.
- Returns only a boolean; never exposes secret values.
- Re-enable verification by deleting the `TURNSTILE_TEST_MODE` vault secret;
  no code change needed.
*/

CREATE OR REPLACE FUNCTION get_turnstile_test_mode()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, vault
AS $$
  SELECT EXISTS (
    SELECT 1 FROM vault.decrypted_secrets
    WHERE name = 'TURNSTILE_TEST_MODE' AND decrypted_secret = '1'
  );
$$;
