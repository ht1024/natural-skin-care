import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TURNSTILE_SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_API_URL = "https://api.resend.com/emails";
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") ?? "skincarenpsa@gmail.com";
const EMAIL_FROM = "Natural Skin Care SA <appointments@naturalskincaresa.com>";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

type AppointmentPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  service?: unknown;
  preferredDate?: unknown;
  preferredTime?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
};

function asString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendNotificationEmail(row: {
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
}): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY not configured; skipping email notification");
    return;
  }

  const fields: Array<[string, string]> = [
    ["Name", row.name],
    ["Email", row.email],
    ["Phone", row.phone ?? "—"],
    ["Service", row.service ?? "—"],
    ["Preferred date", row.preferred_date ?? "—"],
    ["Preferred time", row.preferred_time ?? "—"],
    ["Message", row.message ?? "—"],
  ];

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333">
    <h2 style="font-weight:600;margin-bottom:12px">New appointment request</h2>
    ${fields
      .map(
        ([label, value]) =>
          `<p style="margin:4px 0"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
      )
      .join("")}
  </div>`;

  const text = fields.map(([label, value]) => `${label}: ${value}`).join("\n");

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [NOTIFICATION_EMAIL],
      reply_to: row.email,
      subject: `New appointment request from ${row.name}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`Email send failed (${res.status}): ${detail}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const payload = (await req.json()) as AppointmentPayload;

    const { data: testMode, error: testModeError } = await supabaseAdmin.rpc(
      "get_turnstile_test_mode"
    );
    if (testModeError) {
      console.error("Test mode lookup failed:", testModeError.message);
    }

    const turnstileToken = asString(payload.turnstileToken, 2048);
    if (!testMode && !turnstileToken) {
      return json({ error: "Verification failed. Please refresh the page and try again." }, 400);
    }

    if (!testMode) {
      const { data: secret, error: secretError } = await supabaseAdmin.rpc(
        "get_turnstile_secret"
      );
      if (secretError || !secret) {
        console.error("Secret lookup failed:", secretError?.message);
        return json({ error: "Server is not configured to verify submissions." }, 500);
      }

      const verifyRes = await fetch(TURNSTILE_SITEVERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: String(secret),
          response: turnstileToken,
        }),
      });

      if (!verifyRes.ok) {
        return json({ error: "Verification service unavailable. Please try again." }, 502);
      }

      const verification = (await verifyRes.json()) as {
        success?: boolean;
        "error-codes"?: string[];
        hostname?: string;
      };
      if (verification.success !== true) {
        console.error(
          "Turnstile verification rejected:",
          JSON.stringify({
            codes: verification["error-codes"] ?? [],
            hostname: verification.hostname ?? null,
          })
        );
        return json({ error: "Verification failed. Please refresh the page and try again." }, 403);
      }
    }

    const name = asString(payload.name, 120);
    const email = asString(payload.email, 254);
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Please provide your name and a valid email address." }, 400);
    }

    const row = {
      name,
      email,
      phone: asString(payload.phone, 40) || null,
      service: asString(payload.service, 120) || null,
      preferred_date: asString(payload.preferredDate, 60) || null,
      preferred_time: asString(payload.preferredTime, 60) || null,
      message: asString(payload.message, 2000) || null,
    };

    const { error: insertError } = await supabaseAdmin
      .from("appointment_requests")
      .insert(row);

    if (insertError) {
      console.error("Insert failed:", insertError.message);
      return json({ error: "We couldn't save your request. Please try again." }, 500);
    }

    try {
      await sendNotificationEmail(row);
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr instanceof Error ? emailErr.message : emailErr);
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error("submit-appointment error:", err instanceof Error ? err.message : err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
