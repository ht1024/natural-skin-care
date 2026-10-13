# Natural Skin Care SA

A website for a natural skincare studio in Stone Oak, San Antonio, TX. Built with Vite, React 18, TypeScript, and Tailwind CSS.

## Features

- **Bilingual (EN/ES)** — every section is translated; visitors switch with one click.
- **Dark & light modes** — dark plum palette by default, warm sage/gold in light mode, with the choice remembered between visits.
- **Hero** — responsive dark-mode imagery with dedicated desktop/tablet/mobile files, plus a rotating light-mode carousel.
- **Services** — featured treatments and waxing services with photos, durations, and prices.
- **Appointment form** — requests are saved to a Supabase database, with Cloudflare Turnstile verification and an email notification sent via Resend.
- **Contact banner** — booking instructions and a Google Maps link to the studio.

## Local development

```bash
npm install
npm run dev
```

Environment variables are read from `.env` (not committed):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Supabase

- `supabase/functions/submit-appointment` — edge function that validates the request, verifies the Turnstile token, stores the appointment in `appointment_requests`, and emails a notification.
- `supabase/migrations/` — table and RLS setup for `appointment_requests`, plus secure Turnstile secret/test-mode lookups.
- Edge function secrets (`RESEND_API_KEY`, etc.) are configured in the Supabase dashboard, not in this repo.

## Build

```bash
npm run build
```
