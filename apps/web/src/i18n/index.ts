import en from "./en.json";
import ru from "./ru.json";

export type Locale = "ru" | "en";

export type TFunction = (key: string) => string;
type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = {
  ru,
  en,
};

const STORAGE_KEY = "sb.locale";
let currentLocale: Locale = "ru";

const validateLocaleKeys = (): void => {
  const ruKeys = new Set(Object.keys(dictionaries.ru));
  const enKeys = new Set(Object.keys(dictionaries.en));

  for (const key of ruKeys) {
    if (!enKeys.has(key)) {
      throw new Error(`Missing key "${key}" in en locale`);
    }
  }

  for (const key of enKeys) {
    if (!ruKeys.has(key)) {
      throw new Error(`Missing key "${key}" in ru locale`);
    }
  }
};

validateLocaleKeys();

const coerceLocale = (value: string | null | undefined): Locale => {
  if (value === "en") {
    return "en";
  }

  return "ru";
};

export const getLocale = (): Locale => currentLocale;

export const initLocale = (): Locale => {
  if (typeof window !== "undefined") {
    currentLocale = coerceLocale(window.localStorage.getItem(STORAGE_KEY));
  }

  return currentLocale;
};

export const setLocale = (locale: Locale): Locale => {
  currentLocale = locale;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }

  return currentLocale;
};

export const t = (key: string): string => {
  const active = dictionaries[currentLocale][key];
  if (active) {
    return active;
  }

  const fallback = dictionaries.en[key];
  if (fallback) {
    return fallback;
  }

  return key;
};
