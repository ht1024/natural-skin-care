import { useEffect, useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { key: "home", href: "#home" },
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
  { key: "contact", href: "#contact" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream-50/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-3">
        <a href="#home" className="flex items-center gap-2 group">
          <Leaf
            className={`w-6 h-6 transition-colors duration-300 ${
              scrolled ? "text-sage-600" : "text-white"
            }`}
          />
          <span
            className={`font-serif text-xl font-semibold tracking-wide transition-colors duration-300 hidden sm:inline ${
              scrolled ? "text-charcoal" : "text-white"
            }`}
          >
            {t.nav.brand}
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-gold-500 ${
                  scrolled ? "text-charcoal" : "text-white/90"
                }`}
              >
                {t.nav[link.key]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          <div
            className={`flex items-center rounded-full border transition-colors duration-300 overflow-hidden ${
              scrolled ? "border-cream-300" : "border-white/40"
            }`}
          >
            <button
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              aria-label="Switch to English"
              className={`px-2.5 py-1 text-xs font-medium transition-colors duration-300 ${
                lang === "en"
                  ? "bg-gold-500 text-white"
                  : scrolled
                    ? "text-charcoal hover:bg-cream-200"
                    : "text-white hover:bg-white/10"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              aria-pressed={lang === "es"}
              aria-label="Cambiar a Español"
              className={`px-2.5 py-1 text-xs font-medium transition-colors duration-300 ${
                lang === "es"
                  ? "bg-gold-500 text-white"
                  : scrolled
                    ? "text-charcoal hover:bg-cream-200"
                    : "text-white hover:bg-white/10"
              }`}
            >
              ES
            </button>
          </div>

          <a
            href="#contact"
            className="hidden md:inline-block px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: scrolled ? "#8F5F78" : "rgba(255,255,255,0.5)",
              color: scrolled ? "#8F5F78" : "#fff",
            }}
          >
            {t.nav.book}
          </a>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className={`w-6 h-6 ${scrolled ? "text-charcoal" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? "text-charcoal" : "text-white"}`} />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-cream-50 border-t border-cream-200 mt-3">
          <ul className="flex flex-col py-4 px-6 gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-charcoal text-sm font-medium tracking-wide hover:text-gold-500 transition-colors"
                >
                  {t.nav[link.key]}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="inline-block px-5 py-2.5 text-sm font-medium rounded-full border border-gold-500 text-gold-600"
              >
                {t.nav.book}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
