import type { Locale } from "./locales";
import en from "./dictionaries/en";
import es from "./dictionaries/es";

const dictionaries = { en, es };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}
