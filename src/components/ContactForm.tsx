import { useEffect, useRef, useState } from "react";
import { SUBMIT_APPOINTMENT_URL, VITE_SUPABASE_ANON_KEY } from "@/lib/supabase";
import { serviceOptions } from "@/data/services";
import { useReveal } from "@/hooks/useReveal";
import { useTurnstile } from "@/hooks/useTurnstile";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

const DRAFT_KEY = "appointment-form-draft";

export default function ContactForm() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const { containerRef, tokenRef, state: turnstileState, reset: resetTurnstile } =
    useTurnstile("appointment-request");
  const { lang, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    // The server decides whether verification is required; a missing token
    // is still sent so the server can enforce its own policy. A broken
    // widget (e.g. domain allowlist mismatch) must not block submission,
    // the server verifies tokens when its policy requires them.
    if (turnstileState === "loading") {
      setStatus("error");
      setErrorMsg(t.form.turnstileLoading);
      return;
    }
    if (turnstileState === "error") {
      console.warn("Turnstile widget failed; submitting anyway for server-side policy check");
    }

    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      preferredDate: formData.get("preferredDate"),
      preferredTime: formData.get("preferredTime"),
      message: formData.get("message"),
      turnstileToken: tokenRef.current,
    };

    try {
      const response = await fetch(SUBMIT_APPOINTMENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.error || t.form.genericError);
      }

      setStatus("success");
      formRef.current?.reset();
      localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : t.form.genericError
      );
    } finally {
      resetTurnstile();
    }
  };

  const saveDraft = () => {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const draft: Record<string, string> = {};
    data.forEach((value, key) => {
      if (typeof value === "string" && value) draft[key] = value;
    });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  useEffect(() => {
    if (status === "success") return;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const values = JSON.parse(raw) as Record<string, string>;
      const form = formRef.current;
      if (!form) return;
      for (const [key, value] of Object.entries(values)) {
        const el = form.elements.namedItem(key);
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement ||
          el instanceof HTMLSelectElement
        ) {
          el.value = value;
        }
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [lang, status]);

  const inputClasses =
    "w-full px-4 py-3 bg-cream-100/50 border border-cream-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-gold-400 focus:bg-white transition-colors";

  return (
    <section id="contact" className="py-20 md:py-28 bg-cream-50">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto px-6 reveal ${visible ? "visible" : ""}`}
      >
        <div className="text-center mb-12">
          <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-4">{t.form.eyebrow}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light mb-4">
            {t.form.title}
          </h2>
          <p className="text-charcoal/60 text-base max-w-2xl mx-auto leading-relaxed">
            {t.form.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Info sidebar */}
          <div className="md:col-span-2 bg-sage-700 rounded-2xl p-8 text-cream-50 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-2xl font-light mb-6">{t.form.contactTitle}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-cream-100/60 uppercase tracking-wide mb-1">{t.form.addressLabel}</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=18834+Stone+Oak+Pkwy+Suite+104+San+Antonio+TX+78258"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream-50 text-sm hover:text-gold-200 transition-colors"
                    >
                      {t.form.address1}
                      <br />
                      {t.form.address2}
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-xl overflow-hidden border border-sage-600/60 shadow-lg">
                <iframe
                  src="https://www.google.com/maps?q=18834+Stone+Oak+Pkwy+Ste+104,+San+Antonio,+TX+78258&output=embed"
                  title="Natural Skin Care SA location on Google Maps"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-56 border-0"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-sage-600">
              <p className="text-cream-100/70 text-xs leading-relaxed">
                {t.form.sidebarNote}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-lg">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-sage-500 mb-4" />
                <h3 className="font-serif text-2xl text-charcoal font-light mb-2">
                  {t.form.successTitle}
                </h3>
                <p className="text-charcoal/60 text-sm max-w-sm mb-6">
                  {t.form.successBody}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-2.5 text-sm font-medium text-gold-600 border border-gold-400 rounded-full hover:bg-gold-50 transition-colors"
                >
                  {t.form.successButton}
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                onChange={saveDraft}
                className="space-y-5"
                key={lang}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      {t.form.nameLabel}
                    </label>
                    <input
                      name="name"
                      required
                      className={inputClasses}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      {t.form.emailLabel}
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className={inputClasses}
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      {t.form.phoneLabel}
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className={inputClasses}
                      placeholder="(210) 555-0100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      {t.form.serviceLabel}
                    </label>
                    <select name="service" className={inputClasses} defaultValue="">
                      <option value="" disabled>
                        {t.form.servicePlaceholder}
                      </option>
                      {serviceOptions[lang].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      {t.form.dateLabel}
                    </label>
                    <input
                      name="preferredDate"
                      className={inputClasses}
                      placeholder={t.form.datePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      {t.form.timeLabel}
                    </label>
                    <input
                      name="preferredTime"
                      className={inputClasses}
                      placeholder={t.form.timePlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                    {t.form.messageLabel}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className={`${inputClasses} resize-none`}
                    placeholder={t.form.messagePlaceholder}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-start gap-2 text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div ref={containerRef} aria-hidden="true" />

                {turnstileState === "error" && (
                  <div className="text-xs text-charcoal/50 px-1">
                    The security check could not load. You can still submit your request below.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gold-500 text-white text-sm font-medium tracking-wide rounded-full hover:bg-gold-600 transition-all duration-300 hover:scale-[1.02] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.form.submitting}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t.form.submit}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
