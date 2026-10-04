import { Mail, PhoneCall, CalendarHeart } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export default function ContactBanner() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="contact-banner" className="py-20 md:py-28 bg-sage-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div
        ref={ref}
        className={`relative max-w-4xl mx-auto px-6 text-center reveal ${visible ? "visible" : ""}`}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 mb-6">
          <CalendarHeart className="w-8 h-8 text-gold-300" />
        </div>

        <h2 className="font-serif text-3xl md:text-5xl text-cream-50 font-light mb-6 leading-tight">
          Book Your Appointment by Email
        </h2>

        <p className="text-cream-100/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-8">
          Norma dedicates her full attention to each client during treatments and is unable to answer phone calls throughout the day.
        </p>

        <div className="bg-sage-800/50 border border-sage-600/50 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mb-10 text-left">
          <p className="text-cream-100/90 text-base md:text-lg leading-relaxed mb-5">
            To request an appointment, please email with your preferred treatment, a few date and time options that work for you, and a brief note about your skin goals. Norma will personally return your call to confirm and schedule your visit.
          </p>
          <div className="flex items-center gap-3 text-gold-200">
            <PhoneCall className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm md:text-base font-light">
              Email your request — Norma will call you back to finalize the booking.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:skincarenpsa@gmail.com?subject=Appointment%20Request"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 text-white text-sm font-medium tracking-wide rounded-full hover:bg-gold-600 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Mail className="w-5 h-5" />
            Email Norma Directly
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-cream-100/40 text-cream-50 text-sm font-medium tracking-wide rounded-full hover:bg-cream-50/10 transition-all duration-300 hover:scale-105"
          >
            Use the Appointment Form
          </a>
        </div>

        <p className="text-cream-100/50 text-xs tracking-wide mt-8">
          Appointments are available by reservation only — no walk-ins, so every client receives undivided attention.
        </p>
      </div>
    </section>
  );
}
