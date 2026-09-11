import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { choice, shuffle, type Distractor } from "../_shared";

/**
 * PED-2 kalibrace L1 < L2 < L3 (disjunktní otázky, rozdíl množin drží gradaci).
 *
 *   L1 — násobky **6, 7 a 10** (prvně učené řady; desítková řada je nejsnazší).
 *   L2 — násobky **8 a 9** (těžší, méně vídané řady).
 *   L3 — **INVERZE** „? × t = c" pro t ∈ [6..10] — hledání chybějícího činitele
 *        vyžaduje dělení (obrácená operace).
 *
 * Oprava 2026-09-11 (inventura obsahu): každá chybná možnost má zpětnou vazbu
 * z chybového modelu (sousední spoj, záměna řady, sečtení místo násobení),
 * nápovědy jsou odstupňované a počítají s konkrétními čísly úlohy. Desítková
 * řada se přesunula z L3 do L1 — jako přímý příklad byla snazší než L2.
 */

/** Vybere první tři různé kladné distraktory, které se neshodují s klíčem. */
function prvni3(kandidati: Distractor[], spravne: string): [Distractor, Distractor, Distractor] {
  const videno = new Set([spravne]);
  const out: Distractor[] = [];
  for (const k of kandidati) {
    if (Number(k.value) <= 0 || videno.has(k.value)) continue;
    videno.add(k.value);
    out.push(k);
    if (out.length === 3) break;
  }
  if (out.length < 3) throw new Error(`Málo distraktorů pro ${spravne}`);
  return out as [Distractor, Distractor, Distractor];
}

/** Nápovědy a vysvětlení pro `t × n` podle toho, jak se příklad nejlépe počítá. */
function postup(t: number, n: number): { h0: string; h1: string; expl: string } {
  const x = t * n;
  if (n === 1) {
    return {
      h0: `Kolik je číslo ${t} vzaté jen jednou?`,
      h1: `Násobit jedničkou znamená vzít číslo jen jednou — nic se nepřidá ani neubere. Co tedy zbude z čísla ${t}?`,
      expl: `Násobit jedničkou znamená vzít číslo jednou, proto ${t} × 1 = ${x}.`,
    };
  }
  if (t === 10) {
    return {
      h0: `10 × ${n} je totéž jako ${pad(n, "DESÍTKA")}.`,
      h1: `Když násobíš deseti, napiš číslo ${n} a připiš za něj nulu — tak zapíšeš ${pad(n, "DESÍTKA")} jedním číslem.`,
      expl: `10 × ${n} je ${pad(n, "DESÍTKA")}, a to je ${x}. Při násobení deseti se k číslu ${n} jen připíše nula.`,
    };
  }
  if (n === 10) {
    return {
      h0: `Násobit deseti je snadné: ${t} × 10 je ${pad(t, "DESÍTKA")}.`,
      h1: `K číslu ${t} připiš nulu — tak zapíšeš ${pad(t, "DESÍTKA")} jedním číslem. Záměnnost: ${t} × 10 = 10 × ${t}.`,
      expl: `${t} × 10 je ${pad(t, "DESÍTKA")}, a to je ${x}. Při násobení deseti se k číslu ${t} jen připíše nula.`,
    };
  }
  if (n === 5) {
    return {
      h0: `${t} × 5 je polovina z ${t} × 10.`,
      h1: `Nejdřív spočítej ${t} × 10 (připiš k číslu ${t} nulu) a pak to číslo rozděl na dvě stejné poloviny.`,
      expl: `${t} × 10 = ${t * 10} a polovina z ${t * 10} je ${x}, proto ${t} × 5 = ${x}.`,
    };
  }
  const soucet = Array.from({ length: n }, () => t).join(" + ");
  if (n < 5) {
    return {
      h0: `${t} × ${n} znamená ${n}krát sečíst číslo ${t}.`,
      h1: `Sečti postupně ${soucet}. Začni u čísla ${t} a pokaždé přičti dalších ${t}.`,
      expl: `${t} × ${n} znamená sečíst ${n}krát číslo ${t}: ${soucet} = ${x}.`,
    };
  }
  const zbytek = n - 5;
  return {
    h0: `Vyjdi z příkladu, který znáš (${t} × 5 = ${t * 5}), a dopočítej ${t} × ${n}.`,
    h1: zbytek === 1
      ? `${t} × ${n} je o jedno číslo ${t} víc než ${t} × 5. K číslu ${t * 5} tedy přičti ještě jednou ${t}.`
      : `${t} × ${n} je totéž co ${t} × 5 a k tomu ${t} × ${zbytek}. K číslu ${t * 5} tedy přičti ještě ${zbytek}krát číslo ${t}.`,
    expl: `${t} × 5 = ${t * 5} a ${t} × ${zbytek} = ${t * zbytek}. Dohromady ${t * 5} + ${t * zbytek} = ${x}, proto ${t} × ${n} = ${x}.`,
  };
}

/** `t × n = ?` — standardní tvar. */
function makeForward(t: number, n: number): PracticeTask {
  const x = t * n;
  const d = prvni3([
    ...(n < 10 ? [{ value: String(t * (n + 1)), why: `To je ${t} × ${n + 1}, tedy o ${t} víc, než má vyjít.` }] : []),
    ...(n > 1 ? [{ value: String(t * (n - 1)), why: `To je ${t} × ${n - 1}, tedy o ${t} méně, než má vyjít.` }] : []),
    { value: String((t - 1) * n), why: `To je ${t - 1} × ${n} — spletl ses v řadě, násobíš číslem ${t}.` },
    { value: String(t + n), why: `Čísla ${t} a ${n} jsi sečetl, ale máš je vynásobit.` },
    { value: String(x + 1), why: `${x + 1} v řadě násobků čísla ${t} vůbec není — výsledek musí být jejím členem.` },
  ], String(x));
  const p = postup(t, n);
  return choice(`${t} × ${n} = ?`, String(x), d, { hints: [p.h0, p.h1], explanation: p.expl });
}

/** `? × t = c` — inverzní tvar, nutí dítě dělit. */
function makeInverse(t: number, n: number): PracticeTask {
  const c = t * n;
  const d = prvni3([
    { value: String(n + 1), why: `Zkouška: ${n + 1} × ${t} = ${(n + 1) * t}, to je víc než ${c}.` },
    { value: String(n - 1), why: `Zkouška: ${n - 1} × ${t} = ${(n - 1) * t}, to je méně než ${c}.` },
    { value: String(c - t), why: `Číslo ${t} jsi od ${c} odečetl. Máš ale zjistit, kolikrát se ${t} vejde do ${c}.` },
    { value: String(n + 2), why: `Zkouška: ${n + 2} × ${t} = ${(n + 2) * t}, to je víc než ${c}.` },
  ], String(n));
  return choice(`? × ${t} = ${c}`, String(n), d, {
    hints: [
      `Kolikrát musíš vzít číslo ${t}, abys dostal ${c}?`,
      `Říkej násobky čísla ${t} — ${t}, ${2 * t}, ${3 * t}, … — a na prstech počítej, kolikátý v řadě je ${c}. Stejně dobře můžeš dělit: ${c} ÷ ${t}.`,
    ],
    explanation: `Chybějící číslo najdeš dělením: ${c} ÷ ${t} = ${n}. Zkouška: ${n} × ${t} = ${c}, takže to sedí.`,
  });
}

const N10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function gen(level: number): PracticeTask[] {
  if (level === 1) {
    // L1 — řady 6, 7 a 10 (prvně naučené + nejsnazší desítková)
    const tasks = [6, 7, 10].flatMap((t) => N10.map((n) => makeForward(t, n)));
    return shuffle(tasks).slice(0, 20);
  }
  if (level === 2) {
    // L2 — řady 8 a 9 (těžší, méně vídané)
    return shuffle([8, 9].flatMap((t) => N10.map((n) => makeForward(t, n))));
  }
  // L3 — INVERZE napříč řadami 6–10
  const inverse = [6, 7, 8, 9, 10].flatMap((t) => N10.slice(1).map((n) => makeInverse(t, n)));
  return shuffle(inverse).slice(0, 20);
}

export const NASOBILKA6789A10: TopicMetadata[] = [
  {
    id: "g3-mat-nasobilka-6-10",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-nasobilka-nasobilka-6-7-8-9-10-cela-mala-nasobilka",
    title: "Násobilka 6, 7, 8, 9, 10 (celá malá násobilka)",
    studentTitle: "Násobilka 6–10",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobilka",
    briefDescription: "Procvičíš násobilku 6, 7, 8, 9 a 10 zpaměti.",
    keywords: ["násobilka", "násobení", "6", "7", "8", "9", "10", "malá násobilka"],
    goals: [
      "Zpaměti ovládat násobilku 6 až 10.",
      "Rychle odpovídat na příklady typu 7 × 8.",
      "Rozpoznat výsledek v obou pořadích (8 × 7 = 7 × 8).",
      "Najít chybějící činitel v příkladu (? × 7 = 56).",
    ],
    boundaries: ["Pouze násobilka 6–10.", "Nezahrnuje písemné násobení ani velkou násobilku."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Každý příklad v násobilce se dá spočítat opakovaným sčítáním: 6 × 4 = 6+6+6+6 = 24. U inverzních úloh (? × 7 = 56) se ptej: kolikrát vezmu 7, abych dostal 56?",
      steps: [
        "Nauč se násobilku 6, pak 7, pak 8, 9, 10.",
        "Pomáhá rytmické odříkávání: 6, 12, 18, 24, 30…",
        "Záměnnost: 6 × 7 = 7 × 6 — vyber tu, co znáš lépe.",
        "Inverze: ? × 7 = 56 → hledám ekvivalent 56 ÷ 7.",
      ],
      commonMistake: "Záměna výsledků 7×8=56 a 8×8=64 — jsou blízko u sebe.",
      example: "7 × 8: 7+7=14, 14+7=21, 21+7=28, 28+7=35, 35+7=42, 42+7=49, 49+7=56. Výsledek: 56.",
    },
  },
];
