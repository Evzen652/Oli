/**
 * Úlohy na řazení podle pravidla (drag_order), které nejsou chronologií —
 * planety od Slunce, fáze Měsíce, průběh dne (2026-09-11, audit 5. ročníku).
 *
 * Každá řada patří k jedné úrovni (`uroven` = úroveň, na které se ukazuje),
 * úloha z ní vybere `kolik` položek a zachová jejich pořadí. Malá nápověda
 * jmenuje všechny položky úlohy, velká přidá pravidlo řazení a jednu kotvu.
 */
import type { PracticeTask } from "@/lib/types";
import { doplnVelkou, pick, shuffle, unikatni, type SUrovni } from "./_shared";

export interface Rada extends SUrovni {
  /** Zadání úlohy; u každé úrovně jiné, aby se úrovně nepřekrývaly. */
  zadani: string;
  /** Podle čeho se řadí — jde do nápovědy i vysvětlení. */
  pravidlo: string;
  /** Položky ve správném pořadí. */
  polozky: { text: string; proc: string }[];
  /** Kolik položek úloha ukáže. */
  kolik: number;
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const vyjmenuj = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} a ${xs[xs.length - 1]}`);

export function poradi(rady: Rada[], level: number, pocet = 30): PracticeTask[] {
  const moje = rady.filter((r) => r.uroven === level);
  if (!moje.length) return [];
  return unikatni(pocet, () => {
    const r = pick(moje);
    const indexy = shuffle(r.polozky.map((_, i) => i)).slice(0, r.kolik).sort((a, b) => a - b);
    const xs = indexy.map((i) => r.polozky[i]);
    const [a, b, ...zbytek] = shuffle(xs);
    const h0 = `Co přijde dřív: „${a.text}“, nebo „${b.text}“? A kam patří ${vyjmenuj(zbytek.map((x) => `„${x.text}“`))}?`;
    const kotva = pick(xs.slice(1));
    const h1 = `${r.pravidlo} Pomůže i tohle: ${kotva.text} — ${kotva.proc}`;
    return {
      question: r.zadani,
      correctAnswer: "order",
      items: xs.map((x) => x.text),
      hints: [h0, doplnVelkou(h0, h1, xs.map((x) => `${cap(x.text)}: ${x.proc}`))],
      explanation: `Správné pořadí: ${xs.map((x) => x.text).join(" → ")}. ${xs.map((x) => `${cap(x.text)}: ${x.proc}`).join(" ")}`,
    };
  }, (t) => `${t.question}|${JSON.stringify(t.items)}`);
}
