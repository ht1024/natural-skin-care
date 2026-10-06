import { Leaf, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal text-cream-100/60 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-gold-400" />
            <span className="font-serif text-lg text-cream-50 font-medium">
              Natural Skin Care SA
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm">
            <a
              href="https://www.google.com/maps/search/?api=1&query=18834+Stone+Oak+Pkwy+Suite+104+San+Antonio+TX+78258"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold-300 transition-colors"
            >
              <MapPin className="w-4 h-4" /> {t.footer.location}
            </a>
          </div>
        </div>

        <div className="border-t border-cream-100/10 mt-8 pt-6 text-center text-xs text-cream-100/40">
          &copy; {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
