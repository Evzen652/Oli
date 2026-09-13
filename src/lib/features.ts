/**
 * Feature flags — centrální místo pro postupné zavádění funkcí.
 *
 * Použití:
 *   import { FEATURES } from "@/lib/features";
 *   if (FEATURES.adminAiContentCreator) { ... }
 *
 * Produkční hodnoty jsou nastaveny zde. Pro dev/test override:
 *   localStorage.setItem("oli_features", JSON.stringify({ adminAiContentCreator: true }))
 *
 * ⚠️ **Co chrání slib daný rodičům, sem nepatří.** Přepsat hodnotu z konzole
 * (`localStorage`) zvládne kdokoli, takže flag není ochrana — je to jen skrytí.
 * Konverzační tutor (`studentChat`) odsud proto 13. 9. zmizel úplně i s komponentou:
 * zásady soukromí rodičům tvrdí „v aplikaci není chat" (`Privacy.tsx`), a to nesmí
 * být pravda jen podle hodnoty, kterou si někdo přepne. Vlastnost, která posílá text
 * dítěte ven, v kódu buď je, nebo není. Hlídá `src/test/child-surface.test.ts`.
 */

const DEFAULTS = {
  /**
   * Odcházející AI featury v admin panelu — vstupní body skryté za tímto flagem:
   * „Tvořit obsah" / „Vytvořit s AI" / „Navrhnout s AI" (ai-curriculum, Curriculum
   * Wizard) a „Pedagogický audit" (exercise-validator). Zastaralé — obsah se tvoří
   * přes Claude Chat + Claude Code, ne za běhu. Kód i edge funkce zachovány pro
   * případ návratu; zapnutí: localStorage oli_features {"adminAiContentCreator":true}.
   */
  adminAiContentCreator: false,

  /**
   * Runtime AI generátor cvičení v admin detailu podtématu (Level II a III).
   * Vypnutý — obsah Level II a III se tvoří přes Claude Chat + Claude Code.
   * Viz AuthoringLauncher komponenta.
   */
  adminRuntimeAiGenerator: false,

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
