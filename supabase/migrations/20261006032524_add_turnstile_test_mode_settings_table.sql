/*
# Turnstile test-mode flag via private table

1. Purpose
- Replaces the vault-based get_turnstile_test_mode() with a lookup against a
  private table, because vault inserts are not permitted from this tooling.
- When the row `turnstile_test_mode` exists with value '1', the
  submit-appointment edge function skips Turnstile verification while the
  widget's domain allowlist is being fixed.

2. Security
- Table lives in the `private` schema, which the Data API does not expose.
- The function stays SECURITY DEFINER with a locked search_path and is
  executable only by service_role, so visitors can never flip the flag.
- Re-enable verification by setting the value to '0' (no code change needed).
*/

CREATE TABLE IF NOT EXISTS private.turnstile_settings (
  name text PRIMARY KEY,
  value text NOT NULL
);

INSERT INTO private.turnstile_settings (name, value)
VALUES ('turnstile_test_mode', '1')
ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value;

CREATE OR REPLACE FUNCTION public.get_turnstile_test_mode()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = private
AS $$
  SELECT EXISTS (
    SELECT 1 FROM private.turnstile_settings
    WHERE name = 'turnstile_test_mode' AND value = '1'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.get_turnstile_test_mode() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_turnstile_test_mode() TO service_role;
