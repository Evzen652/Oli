/**
 * Session utilities — pure pomocné funkce.
 * Žádný network, DB ani side-efekty.
 */

import type { SessionData } from "./types";

/**
 * Vypočítá výkon žáka v sezení jako číslo 0–1.
 *
 * Vzorec:
 *   raw = 1 - (chyby + nápověda × 0.5) / počet_úloh
 *   score = clamp(raw, 0, 1)
 *
 * Nápověda = poloviční penalizace (žák věděl, ale potřeboval pomoc).
 */
export function calcSessionScore(session: SessionData): number {
  const total = session.currentTaskIndex; // kolik úloh žák prošel
  if (total === 0) return 0;

  const errors = session.errorCount;
  const helpPenalty = session.helpUsedCount * 0.5;
  const raw = 1 - (errors + helpPenalty) / total;

  return Math.max(0, Math.min(1, raw));
}
