import type { Language } from "./translations";

export function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "en";

  const languages =
    navigator.languages?.length > 0
      ? navigator.languages
      : [navigator.language];

  for (const tag of languages) {
    if (tag.toLowerCase().startsWith("ja")) return "ja";
  }

  return "en";
}
