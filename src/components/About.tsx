import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-28 bg-cream-50">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center reveal ${visible ? "visible" : ""}`}
      >
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.pexels.com/photos/5912003/pexels-photo-5912003.jpeg?auto=compress&cs=tinysrgb&w=940"
              alt="Natural skincare products"
              referrerPolicy="no-referrer"
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-gold-500 text-white px-8 py-6 rounded-2xl shadow-xl hidden md:block">
            <p className="font-serif text-3xl font-light">{t.about.founderName}</p>
            <p className="text-sm tracking-wide text-gold-100">{t.about.founderTitle}</p>
          </div>
        </div>

        <div>
          <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-4">{t.about.eyebrow}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-light leading-tight mb-6">
            {t.about.title}
          </h2>
          <p className="text-charcoal/70 text-base leading-relaxed mb-5">
            {t.about.p1}
          </p>
          <p className="text-charcoal/70 text-base leading-relaxed mb-5">
            {t.about.p2}
          </p>
          <div className="flex gap-8 mt-8">
            <div>
              <p className="font-serif text-3xl text-sage-600 font-light">100%</p>
              <p className="text-xs text-charcoal/50 tracking-wide uppercase mt-1">{t.about.stat1}</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-sage-600 font-light">1-on-1</p>
              <p className="text-xs text-charcoal/50 tracking-wide uppercase mt-1">{t.about.stat2}</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-sage-600 font-light">By Res.</p>
              <p className="text-xs text-charcoal/50 tracking-wide uppercase mt-1">{t.about.stat3}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
