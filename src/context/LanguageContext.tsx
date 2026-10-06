import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getT, type Language, type Translations } from "@/i18n/translations";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem("preferred-language");
    if (saved === "en" || saved === "es") return saved;
  } catch {
    // localStorage unavailable — fall through to browser language
  }
  if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("es")) {
    return "es";
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(readInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem("preferred-language", next);
    } catch {
      // localStorage unavailable — choice just won't persist
    }
  };

  const value: LanguageContextValue = { lang, setLang, t: getT(lang) };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
