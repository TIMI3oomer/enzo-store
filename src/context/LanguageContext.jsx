import { createContext, useContext, useEffect, useMemo, useState } from "react";
import i18n from "../i18n";

const LanguageContext = createContext(null);

// CHECKPOINT NOTE (LanguageContext.jsx):
// This is the single source of truth for language + direction across the
// whole site. It:
//  1. Reads the saved language from localStorage on load (defaults to "ar").
//  2. Sets <html lang="ar|en" dir="rtl|ltr"> whenever it changes — this is
//     what makes the ENTIRE layout flip (flexbox/grid direction, text-align,
//     scrollbars, etc.), not just the visible text.
//  3. Persists the choice so it survives refresh and page navigation.
//  4. Never resets the cart or current product — those live in their own
//     contexts/localStorage keys and are untouched by a language switch.
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem("enzo_lang") || "ar"
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    i18n.changeLanguage(lang);
    localStorage.setItem("enzo_lang", lang);
  }, [lang, dir]);

  const setLang = (next) => {
    if (next === "ar" || next === "en") setLangState(next);
  };

  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  const value = useMemo(
    () => ({ lang, dir, setLang, toggleLang, isRtl: dir === "rtl" }),
    [lang, dir]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

// Small helper used everywhere we render a localized DB field like
// product.name = { ar: "...", en: "..." }
export function useLocalizedField() {
  const { lang } = useLanguage();
  return (field) => {
    if (!field) return "";
    if (typeof field === "string") return field; // already a plain string
    return field[lang] ?? field.ar ?? field.en ?? "";
  };
}
