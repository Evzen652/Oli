/**
 * Doplňování i/í × y/ý pro 3. ročník (2026-09-11, audit 3. ročníku).
 *
 * Možnosti jsou jen sporný grafém (y, ý, i, í) — nikdy celé chybně napsané
 * slovo. Zpětná vazba rozliší dvě chyby: špatné i × y (slovo je / není
 * vyjmenované nebo z rodiny vyjmenovaného) a špatnou délku samohlásky.
 */
import type { PracticeTask } from "@/lib/types";
import { choice, type Distractor } from "./_shared";

export type Grafem = "y" | "ý" | "i" | "í";
const GRAFEMY: Grafem[] = ["y", "ý", "i", "í"];
const tvrde = (g: Grafem) => g === "y" || g === "ý";
const dlouhe = (g: Grafem) => g === "ý" || g === "í";

export interface Dopln {
  /** Věta s jedním podtržítkem v místě sporné samohlásky. */
  veta: string;
  /** Celé slovo, jak se správně píše. */
  slovo: string;
  g: Grafem;
  /** Obojetná souhláska před sporným místem (B, L, M, P, S, V, Z). */
  s: string;
  /** Proč se slovo píše tak, jak se píše — jde do vysvětlení. */
  proc: string;
}

export function doplnIY(d: Dopln, hints: [string, string]): PracticeTask {
  if ((d.veta.match(/_/g) ?? []).length !== 1) throw new Error(`Věta musí mít právě jedno podtržítko: ${d.veta}`);
  const why = (x: Grafem): string => {
    if (tvrde(x) !== tvrde(d.g)) {
      return tvrde(d.g)
        ? `„${d.slovo}“ patří k vyjmenovaným slovům po ${d.s}, proto se píše y/ý.`
        : `„${d.slovo}“ mezi vyjmenovaná slova ani do jejich rodiny nepatří, proto se píše i/í.`;
    }
    return `Písmeno sedí, ale samohláska ve slově „${d.slovo}“ je ${dlouhe(d.g) ? "dlouhá" : "krátká"} — zkus ho pomalu vyslovit.`;
  };
  const distraktory = GRAFEMY.filter((x) => x !== d.g).map((x) => ({ value: x, why: why(x) })) as [Distractor, Distractor, Distractor];
  return choice(`Doplň i/í, nebo y/ý: „${d.veta}“`, d.g, distraktory, { hints, explanation: d.proc });
}
