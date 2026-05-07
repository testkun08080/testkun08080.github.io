import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Language, MessageKey } from "./translations";
import { messages } from "./translations";

type TranslationValue = string | readonly string[];

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: MessageKey) => TranslationValue;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      toggleLanguage: () => {
        setLanguage((prev) => (prev === "ja" ? "en" : "ja"));
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
