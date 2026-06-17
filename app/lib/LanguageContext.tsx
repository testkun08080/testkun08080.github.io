import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { detectBrowserLanguage } from "./detectLanguage";
import type { Language, MessageKey } from "./translations";
import { messages } from "./translations";

const STORAGE_KEY = "site-language";

type TranslationValue = string | readonly string[];

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: MessageKey) => TranslationValue;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLanguage(): Language | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "ja" || stored === "en") return stored;

  return null;
}

function persistLanguage(language: Language) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, language);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(
    () => readStoredLanguage() ?? "en",
  );

  useEffect(() => {
    if (readStoredLanguage() !== null) return;

    const detected = detectBrowserLanguage();
    if (detected === "ja") {
      setLanguage("ja");
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      toggleLanguage: () => {
        setLanguage((prev) => {
          const next = prev === "ja" ? "en" : "ja";
          persistLanguage(next);
          return next;
        });
      },
      t: (key) => messages[language][key] ?? messages.ja[key] ?? key,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
