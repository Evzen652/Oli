/**
 * Pozitivní hodnocení výkonu žáka — pro dětské UI.
 *
 * Záměrně vyhýbáme se:
 * - Číslům chyb v červené barvě
 * - Školním známkám
 * - Porovnávání s ostatními
 *
 * Mapujeme úspěšnost na krátký, pozitivní text (1-3 slova).
 */

export type StudentLabelTier =
  | "excellent"   // 90–100 %
  | "good"        // 75–89 %
  | "passing"     // 60–74 %
  | "partial"     // 40–59 %
  | "retry";      // < 40 %

/** Vrátí tier (kategorie) pro danou úspěšnost. */
export function getStudentLabelTier(successRate: number): StudentLabelTier {
  if (successRate >= 0.9) return "excellent";
  if (successRate >= 0.75) return "good";
  if (successRate >= 0.6) return "passing";
  if (successRate >= 0.4) return "partial";
  return "retry";
}

/** Vrátí krátký pozitivní text (1–3 slova) pro danou úspěšnost. */
export function getStudentLabel(successRate: number): string {
  const tier = getStudentLabelTier(successRate);
  switch (tier) {
    case "excellent": return "Výborně!";
    case "good":      return "Pěkně!";
    case "passing":   return "Zvládl/a";
    case "partial":   return "Skoro to bylo";
    case "retry":     return "Zkus to znovu";
  }
}

/** Vrátí emoji pro danou úspěšnost. */
export function getStudentEmoji(successRate: number): string {
  const tier = getStudentLabelTier(successRate);
  switch (tier) {
    case "excellent": return "✨";
    case "good":      return "✓";
    case "passing":   return "✓";
    case "partial":   return "~";
    case "retry":     return "↩";
  }
}

/**
 * Vrátí tailwind barvu textu pro label.
 * Žádná červená — "retry" dostane amber (oranžová), ne červenou.
 */
export function getStudentLabelColor(successRate: number): string {
  const tier = getStudentLabelTier(successRate);
  switch (tier) {
    case "excellent": return "text-emerald-600";
    case "good":      return "text-green-600";
    case "passing":   return "text-blue-600";
    case "partial":   return "text-amber-600";
    case "retry":     return "text-amber-500";
  }
}
