import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const LIGHT_HERO_IMAGES = [
  {
    src: "https://images.pexels.com/photos/36930756/pexels-photo-36930756.png?auto=compress&cs=tinysrgb&w=1920",
    alt: "Woman with glowing skin against a soft lavender backdrop",
  },
  {
    src: "https://images.pexels.com/photos/6186752/pexels-photo-6186752.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "Rolled towels and candlelight on a wooden shelf",
  },
  {
    src: "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "Candles, orchids and spa stones",
  },
  {
    src: "https://images.pexels.com/photos/7795393/pexels-photo-7795393.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "Candles and skincare products on a wooden tray",
  },
];

const SLIDE_INTERVAL_MS = 6000;

export default function Hero() {
  const { t } = useLanguage();
  const [isDark, setIsDark] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isDark) return;
    const id = window.setInterval(
      () => setActiveIndex((i) => (i + 1) % LIGHT_HERO_IMAGES.length),
      SLIDE_INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [isDark]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {isDark ? (
          <picture>
            <source media="(min-width: 1024px)" srcSet="/images/hero.jpg" />
            <source media="(min-width: 640px)" srcSet="/images/hero-tablet.jpg" />
            <img
              src="/images/hero-mobile.jpg"
              alt="Woman with glowing skin against a soft lavender backdrop"
              className="w-full h-full object-cover animate-slow-zoom"
            />
          </picture>
        ) : (
          <>
            {LIGHT_HERO_IMAGES.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === activeIndex ? "opacity-100 animate-slow-zoom" : "opacity-0"
                }`}
              />
            ))}
          </>
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-b transition-opacity duration-500 ${
            isDark
              ? "from-charcoal/60 via-charcoal/40 to-charcoal/70"
              : "from-charcoal/40 via-charcoal/25 to-charcoal/50"
          }`}
        />
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
