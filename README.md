# Natural Skin Care SA

Bilingual (English / Spanish) marketing site with an appointment-request form for Natural Skin Care SA by Norma Perry, San Antonio TX.

- **Stack:** Vite + React + TypeScript + Tailwind CSS
- **Backend:** Supabase (Postgres database + Edge Function)
- **Form protection:** Cloudflare Turnstile (server-side verification)
- **Email notifications:** Resend

## How the appointment form works (end to end)

1. Visitor fills the form on the site (`src/components/ContactForm.tsx`).
   - The Turnstile widget is loaded by `src/hooks/useTurnstile.ts` using the site key from `VITE_TURNSTILE_SITE_KEY`.
   - Form input is saved as a draft in the browser (localStorage) so a refresh does not lose it.
   - Text auto-fills back in the visitor's language (EN/ES) via `src/context/LanguageContext.tsx`.
2. The form POSTs JSON to the `submit-appointment` Edge Function (`supabase/functions/submit-appointment/index.ts`).
3. The Edge Function:
   - Checks the server-side test-mode flag (`get_turnstile_test_mode()`). If ON, Turnstile verification is skipped.
   - Otherwise verifies the Turnstile token with Cloudflare's `siteverify` API, using the secret read from the database vault via `get_turnstile_secret()`.
   - Validates and trims all fields (server-side, regardless of the widget).
   - Inserts the request into the `appointment_requests` table.
   - Sends a notification email through Resend (reply-to = visitor's email) to `NOTIFICATION_EMAIL`.
   - Email failure never blocks saving the request; it is only logged.
4. Response codes: `200 {ok:true}` on success; `400/403` for bad/missing verification, `500` for insert failure. All responses carry CORS headers.

## Database (Supabase project `neerzwcgfpufuutuitaq`)

### Table: `appointment_requests` (migration `20260910222406_create_appointment_requests.sql`)

Columns: `name`, `email`, `phone`, `service`, `preferred_date`, `preferred_time`, `message`, `created_at`.
Row Level Security is enabled with no public policies — **only the service role can write**, which is why the Edge Function uses the service role key to insert.

### Security helper functions

- `public.get_turnstile_secret()` (migration `20261005200227`)
  SECURITY DEFINER; reads the decrypted Turnstile secret from `vault.decrypted_secrets` where `name = 'TURNSTILE_SECRET_KEY'`.
  `EXECUTE` revoked from `PUBLIC/anon/authenticated`, granted to `service_role` only.
- `public.get_turnstile_test_mode()` (migrations `20261006001435`, superseded by `20261006032524`)
  SECURITY DEFINER; same privilege model. Reads the flag from `private.turnstile_settings` (a table in the `private` schema, not exposed through the Data API).

## Test mode — IMPORTANT

Turnstile verification is currently **disabled server-side** while the widget's domain allowlist is being fixed:

- Control row: `private.turnstile_settings` → name `turnstile_test_mode`, value `1` = skip verification, `0` = enforce verification.
- To re-enable real verification, set that value to `0` (SQL below). No code change is needed.

```sql
UPDATE private.turnstile_settings SET value = '0' WHERE name = 'turnstile_test_mode';
```

Client side: if the Turnstile widget fails to load (e.g. domain not allowlisted), the form still submits and the server decides based on the flag — visitors are never hard-blocked by a broken widget.

## Secrets and environment variables

Never commit real values. Variables only, stored in `.env` (frontend) and Supabase Edge Function secrets / vault (backend):

| Variable | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Frontend `.env` | Supabase client |
| `VITE_TURNSTILE_SITE_KEY` | Frontend `.env` | Public Turnstile widget key |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Auto-injected in Edge Functions | Server-side DB access |
| `TURNSTILE_SECRET_KEY` | DB vault (name `TURNSTILE_SECRET_KEY`) | Secret half of Turnstile |
| `RESEND_API_KEY` | Edge Function secret | Sending notification emails |
| `NOTIFICATION_EMAIL` | Edge Function secret | Where requests are emailed (falls back to `skincarenpsa@gmail.com`) |

## Edge Function deployment

The function is declared in `supabase/config.toml` (`verify_jwt = false` because the form is public). Deploy from the Supabase MCP tooling (`deploy_edge_functions`); do not use the Supabase CLI here.

## Local development

```bash
npm install
npm run dev
```

Build for production: `npm run build` (output in `dist/`, used for static hosting such as S3/CloudFront).

## GitHub sync

The repo `ht1024/natural-skin-care` mirrors this project. `.env` is git-ignored and never pushed.
