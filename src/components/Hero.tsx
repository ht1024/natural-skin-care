import { Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/37229304/pexels-photo-37229304.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Spa facial treatment"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/70" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-20">
        <p className="text-gold-300 text-sm md:text-base tracking-[0.3em] uppercase mb-4 animate-fade-in">
          {t.hero.eyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-light leading-tight mb-6 animate-fade-in-up">
          {t.hero.title1}
          <br />
          <span className="italic text-gold-200">{t.hero.title2}</span>
        </h1>
        <p className="text-white/85 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {t.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <a
            href="#contact"
            className="px-8 py-3.5 bg-gold-500 text-white text-sm font-medium tracking-wide rounded-full hover:bg-gold-600 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href="#services"
            className="px-8 py-3.5 border border-white/50 text-white text-sm font-medium tracking-wide rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-14 text-white/70 text-xs tracking-wide animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold-300" /> {t.hero.location}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-300" /> {t.hero.reservation}
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-px h-12 bg-white/30" />
      </div>
    </section>
  );
}
