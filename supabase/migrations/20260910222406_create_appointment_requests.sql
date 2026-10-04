/*
# Create appointment_requests table

1. New Tables
- `appointment_requests`
  - `id` (uuid, primary key)
  - `name` (text, not null) — client's full name
  - `email` (text, not null) — client's email address
  - `phone` (text) — optional phone number
  - `service` (text) — requested service/treatment
  - `preferred_date` (text) — preferred appointment date
  - `preferred_time` (text) — preferred time of day
  - `message` (text) — additional notes from client
  - `status` (text, default 'new') — tracking status (new, contacted, scheduled)
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `appointment_requests`.
- Allow anon + authenticated INSERT only (public can submit requests).
- No SELECT/UPDATE/DELETE for anon (only authenticated/admin can read).
*/

CREATE TABLE IF NOT EXISTS appointment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  preferred_date text,
  preferred_time text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_appointment_requests" ON appointment_requests;
CREATE POLICY "anon_insert_appointment_requests"
ON appointment_requests FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_appointment_requests" ON appointment_requests;
CREATE POLICY "anon_select_appointment_requests"
ON appointment_requests FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_appointment_requests" ON appointment_requests;
CREATE POLICY "anon_update_appointment_requests"
ON appointment_requests FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_appointment_requests" ON appointment_requests;
CREATE POLICY "anon_delete_appointment_requests"
ON appointment_requests FOR DELETE
TO authenticated USING (true);
