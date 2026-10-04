import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { serviceOptions } from "@/data/services";
import { useReveal } from "@/hooks/useReveal";
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const service = formData.get("service") as string;
    const preferredDate = formData.get("preferredDate") as string;
    const preferredTime = formData.get("preferredTime") as string;
    const message = formData.get("message") as string;

    try {
      const { error } = await supabase.from("appointment_requests").insert({
        name,
        email,
        phone: phone || null,
        service: service || null,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
        message: message || null,
      });

      if (error) throw error;

      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try emailing Norma directly."
      );
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-cream-50">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto px-6 reveal ${visible ? "visible" : ""}`}
      >
        <div className="text-center mb-12">
          <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-4">Get in Touch</p>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light mb-4">
            Request an Appointment
          </h2>
          <p className="text-charcoal/60 text-base max-w-2xl mx-auto leading-relaxed">
            Fill out the form below and Norma will personally call you back to confirm your appointment. Please include a few date and time options that work best for you.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Info sidebar */}
          <div className="md:col-span-2 bg-sage-700 rounded-2xl p-8 text-cream-50 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-2xl font-light mb-6">Contact Details</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-cream-100/60 uppercase tracking-wide mb-1">Email</p>
                    <a
                      href="mailto:skincarenpsa@gmail.com"
                      className="text-cream-50 text-sm hover:text-gold-200 transition-colors"
                    >
                      skincarenpsa@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-cream-100/60 uppercase tracking-wide mb-1">Address</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=18834+Stone+Oak+Pkwy+Suite+104+San+Antonio+TX+78258"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream-50 text-sm hover:text-gold-200 transition-colors"
                    >
                      18834 Stone Oak Pkwy
                      <br />
                      Suite 104, San Antonio, TX 78258
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-sage-600">
              <p className="text-cream-100/70 text-xs leading-relaxed">
                Norma is unable to answer calls during treatments. Email is the best way to reach her — she will return your call to schedule.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-lg">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-sage-500 mb-4" />
                <h3 className="font-serif text-2xl text-charcoal font-light mb-2">
                  Request Received
                </h3>
                <p className="text-charcoal/60 text-sm max-w-sm mb-6">
                  Thank you for reaching out. Norma will personally call you back to confirm your appointment.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-2.5 text-sm font-medium text-gold-600 border border-gold-400 rounded-full hover:bg-gold-50 transition-colors"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-cream-100/50 border border-cream-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-gold-400 focus:bg-white transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-cream-100/50 border border-cream-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-gold-400 focus:bg-white transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      Phone (optional)
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full px-4 py-3 bg-cream-100/50 border border-cream-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-gold-400 focus:bg-white transition-colors"
                      placeholder="(210) 555-0100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      Service
                    </label>
                    <select
                      name="service"
                      className="w-full px-4 py-3 bg-cream-100/50 border border-cream-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-gold-400 focus:bg-white transition-colors"
                    >
                      <option value="">Select a service</option>
                      {serviceOptions.map((s) => (
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
                      Preferred Date
                    </label>
                    <input
                      name="preferredDate"
                      className="w-full px-4 py-3 bg-cream-100/50 border border-cream-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-gold-400 focus:bg-white transition-colors"
                      placeholder="e.g. Mon, Oct 14"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                      Preferred Time
                    </label>
                    <input
                      name="preferredTime"
                      className="w-full px-4 py-3 bg-cream-100/50 border border-cream-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-gold-400 focus:bg-white transition-colors"
                      placeholder="e.g. Morning, 10am"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-charcoal/60 uppercase tracking-wide mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-cream-100/50 border border-cream-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-gold-400 focus:bg-white transition-colors resize-none"
                    placeholder="Tell Norma about your skin goals or any specific concerns..."
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-start gap-2 text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
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
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Appointment Request
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
