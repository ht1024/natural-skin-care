# Natural Skin Care SA

Marketing site for Natural Skin Care SA by Norma Perry (San Antonio, TX) — services overview, treatment details, and an appointment request form. Bilingual (English / Spanish).

> Note: This README contains no credentials or private configuration values.

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Framework  | React 18 + TypeScript (Vite) |
| Styling    | Tailwind CSS with a custom palette (cream / sage / gold / charcoal), theme set via a `dark` class on `<html>` before first paint |
| Icons      | lucide-react |
| Backend    | Supabase (PostgreSQL + Edge Functions) |
| Form spam protection | Cloudflare Turnstile (verified server-side) |

The site is a static single-page app. All dynamic behavior is limited to the appointment request form; there is no client-side authentication and no visitor-facing database reads.

## Project Structure

```
index.html                 Page shell, meta tags, analytics snippets, canonical URL, theme bootstrap
src/
  main.tsx                 React entry point
  App.tsx                  Page composition + lazy loading of below-the-fold sections
  components/              Hero, Navbar, About, Services, Waxing, ContactBanner,
                           ContactForm, Footer, ThemeToggle
  context/LanguageContext  EN/ES language switching (default: English)
  data/services.ts         Service catalog and pricing used by Services/Waxing/form
  hooks/useReveal.ts       Scroll-reveal animation hook (IntersectionObserver)
  hooks/useTurnstile.ts    Loads and manages the Turnstile widget
  lib/supabase.ts          Supabase client + Edge Function URL from env vars
  i18n/translations.ts     All UI copy, EN and ES
supabase/
  config.toml              Supabase project config (Edge Function declarations)
  functions/submit-appointment/  Edge Function: validates + stores appointment requests,
                                 verifies Turnstile tokens server-side, sends email notification
  migrations/              SQL migrations (appointment_requests table, Turnstile settings)
public/images/             Responsive hero images (desktop / tablet / mobile)
```

## Build & Development

```bash
npm install       # install dependencies
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run typecheck # TypeScript check
npm run lint      # ESLint
```

The production build outputs static files to `dist/` (including a `_redirects` file for SPA hosting). No server-side rendering.

## Code Splitting

Below-the-fold sections are lazy-loaded so the initial page load stays small:

- The entry bundle contains only the hero, navbar, language system, and the loader logic (~53 kB gzipped).
- The appointment form loads on demand — when the contact section scrolls into view or when a "Book Appointment" link is clicked — and is the only chunk containing the Supabase client, the form submission code, and the Turnstile integration.
- While the form chunk downloads, the contact section reserves its height with an invisible placeholder so the page does not jump.

Chunk names and sizes change per build; check the `vite build` output for the current values.

## Environment Variables

Required at build time (values are not stored in this repo):

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — public anonymous key (safe for browser use; access is controlled server-side by the Edge Function and database policies)
- `VITE_TURNSTILE_SITE_KEY` — Cloudflare Turnstile widget site key

Secrets (Turnstile secret key, Resend API key, notification email) live in Supabase Edge Function secrets / the database vault, never in the frontend.

## Appointment Requests Flow

1. Visitor fills the form (name, email, phone, service, preferred date/time, message). A draft is saved to `localStorage` so nothing is lost on reload.
2. The Turnstile widget runs invisibly; a broken widget does not block submission — the server enforces its own policy.
3. The form POSTs JSON to the `submit-appointment` Edge Function, which verifies the Turnstile token (when policy requires it), inserts the request into the `appointment_requests` table, and sends an email notification via Resend.
4. Row-level security policies on the table prevent public reads/writes; only the Edge Function (service role) writes rows.

## Deployment Notes

- **Deploy path:** push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds with Vite, syncs `dist/` to S3, then invalidates CloudFront. Do not delete or empty that workflow file — without it, pushes stop going live.
- Treat `.github/workflows/deploy.yml` as production infrastructure. Do not remove it in “cleanup” or “remove old site” commits.
- Hero images are stored in S3 only (`public/images/` is gitignored); the deploy job syncs `dist/` with `--exclude "images/*"` so those files are not wiped.
- Optional hardening: add a branch protection rule and/or a `CODEOWNERS` entry so changes to `.github/workflows/` require review.
- After any “remove old files” PR merges, confirm the next `main` push still shows a **Deploy static site to S3** run under GitHub Actions.
- Canonical URL: `https://naturalskincaresa.com/` (set via `<link rel="canonical">` in `index.html`).
- Hero images are served responsively via `<picture>` with separate desktop/tablet/mobile sources.
- The `referrer` meta is set to `no-referrer`.
- Analytics (Google Tag Manager, LogRocket) are configured directly in `index.html`.
