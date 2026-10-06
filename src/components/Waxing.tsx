import { waxingServices } from "@/data/services";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";
import { Check } from "lucide-react";

export default function Waxing() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { lang, t } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-sage-50">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto px-6 text-center reveal ${visible ? "visible" : ""}`}
      >
        <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-4">{t.waxing.eyebrow}</p>
        <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light mb-4">
          {t.waxing.title}
        </h2>
        <p className="text-charcoal/60 text-base max-w-xl mx-auto mb-12">
          {t.waxing.subtitle}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {waxingServices.map((service) => (
            <div
              key={service.en}
              className="flex items-center gap-3 bg-cream-50 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <Check className="w-4 h-4 text-sage-500 flex-shrink-0" />
              <span className="text-sm text-charcoal font-medium text-left">{service[lang]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
