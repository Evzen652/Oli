/**
 * Feature flags — centrální místo pro postupné zavádění funkcí.
 *
 * Použití:
 *   import { FEATURES } from "@/lib/features";
 *   if (FEATURES.studentChat) { ... }
 *
 * Produkční hodnoty jsou nastaveny zde. Pro dev/test override:
 *   localStorage.setItem("oli_features", JSON.stringify({ studentChat: true }))
 */

const DEFAULTS = {
  /**
   * Konverzační tutor ("Zeptat se Oli") v dětském sezení.
   * Vypnutý pro grade 1–7 (příliš komplikované, porušuje efektivní princip).
   * Zapnout až po UX testu se staršími žáky (grade 8–9).
   */
  studentChat: false,

  /**
   * Bodové ohodnocení (%) v dětské historii procvičování.
   * Vypnuté — nahrazeno pozitivními labely (Výborně!, Pěkně!, ...).
   */
  studentPercentageScore: false,

  /**
   * Filtry podle školních známek 1–5 v dětském UI.
   * Vypnuté — demotivační, dítě nepotřebuje filtrovat vlastní historii.
   */
  studentGradeFilters: false,
} as const;

type FeatureFlags = typeof DEFAULTS;

function loadOverrides(): Partial<FeatureFlags> {
  try {
    const raw = typeof window !== "undefined"
      ? window.localStorage?.getItem("oli_features")
      : null;
    if (raw) return JSON.parse(raw) as Partial<FeatureFlags>;
  } catch {
    // ignore malformed JSON
  }
  return {};
}

/** Aktivní feature flags (defaults + localStorage overrides). */
export const FEATURES: FeatureFlags = {
  ...DEFAULTS,
  ...loadOverrides(),
};
