import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import React from "react";
import cs, { type LocaleKey } from "./cs";

export type Locale = "cs" | "pl" | "de";

const dictionaries: Record<Locale, Record<string, string>> = {
  cs,
  // Future: pl and de will be added here
  pl: cs, // fallback to cs until translated
  de: cs, // fallback to cs until translated
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: LocaleKey) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "cs",
  setLocale: () => {},
  t: (key) => cs[key] ?? key,
});

export function LocaleProvider({ children, initialLocale = "cs" }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const t = useCallback(
    (key: LocaleKey): string => {
      const dict = dictionaries[locale];
      return dict[key] ?? cs[key] ?? key;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return React.createElement(LocaleContext.Provider, { value }, children);
}

export function useT() {
  return useContext(LocaleContext).t;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}

export type { LocaleKey };
