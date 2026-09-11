/**
 * Sdílené stavební bloky pro 5. ročník (2026-09-11, audit před zveřejněním).
 *
 * Kopie vzoru z `grade-4/_shared.ts` a `grade-6/dejepis/_shared.ts`, ne import:
 * každý ročník vlastní jen svou složku (docs/SESSION_OWNERSHIP.md).
 *
 * Proč: do 2026-09-11 měly úlohy 5. ročníku jedinou nápovědu, žádné
 * vysvětlení ani zpětnou vazbu k chybným možnostem a témata z pevných poolů
 * měla na úrovni jen 4–10 různých úloh. Buildery níž vynucují úplnou
 * dokumentaci (CONTENT_AUTHORING §0) už tvarem volání a z banky faktů skládají
 * dost různých úloh. Úroveň určuje `uroven` položky banky: úloha na úrovni N
 * obsahuje jen položky do N a aspoň jednu přesně N — úrovně jsou tak
 * disjunktní a přísně vzestupné (CONTENT_CONTRACT.md).
 */
import type { PracticeTask } from "@/lib/types";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Distraktor = konkrétní typická chyba + vysvětlení, proč to tak není. */
export interface Distractor {
  value: string;
  why: string;
}

export interface TaskDocs {
  /** [malá, velká] — obě k TÉHLE úloze, velká o kus konkrétnější. */
  hints: [string, string];
  /** Proč je správná odpověď správná — ne jen co je správně. */
  explanation: string;
}

/**
 * select_one úloha s chybovým modelem. Možnosti se zamíchají, optionFeedback
 * se naplní z `why` každého distraktoru; správná odpověď feedback nemá
 * (po chybě se ukáže `explanation`).
 */
export function choice(
  question: string,
  correct: string,
  distractors: [Distractor, Distractor, Distractor],
  docs: TaskDocs,
): PracticeTask {
  const optionFeedback: Record<string, string> = {};
  for (const d of distractors) optionFeedback[d.value] = d.why;
  return {
    question,
    correctAnswer: correct,
    options: shuffle([correct, ...distractors.map((d) => d.value)]),
    optionFeedback,
    // Velká nápověda má být o pětinu delší než malá; krátkou dorovná rada k vylučování.
    hints: [docs.hints[0], doplnVelkou(docs.hints[0], docs.hints[1], STRATEGIE_VYBER)],
    explanation: docs.explanation,
  };
}

// ── Banky s úrovní ───────────────────────────────────────────────────────────

export interface SUrovni {
  /** Nejnižší úroveň, na které se položka smí objevit. */
  uroven: 1 | 2 | 3;
}

/**
 * Vybere n položek pro úroveň: všechny s `uroven` ≤ level a aspoň jednu
 * přesně na level. `ok` může výběr odmítnout (např. dvě události ze stejného roku).
 */
function vyberProUroven<T extends SUrovni>(bank: T[], level: number, n: number, ok: (xs: T[]) => boolean): T[] | null {
  const dostupne = bank.filter((b) => b.uroven <= level);
  const nove = dostupne.filter((b) => b.uroven === level);
  if (!nove.length || dostupne.length < n) return null;
  for (let pokus = 0; pokus < 50; pokus++) {
    const prvni = pick(nove);
    const xs = shuffle([prvni, ...shuffle(dostupne.filter((b) => b !== prvni)).slice(0, n - 1)]);
    if (ok(xs)) return xs;
  }
  return null;
}

/** Nasbírá až `pocet` různých úloh (podle klíče), duplicity zahodí. */
export function unikatni(pocet: number, tvor: () => PracticeTask | null, klic: (t: PracticeTask) => string): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < pocet * 6 && out.size < pocet; i++) {
    const t = tvor();
    if (!t) continue;
    const k = klic(t);
    if (!out.has(k)) out.set(k, t);
  }
  return [...out.values()];
}

/** Obecné rady, kterými se velká nápověda dorovná, když souvislosti z banky nestačí. */
const STRATEGIE_VYBER = ["Vyřaď nejdřív možnosti, které určitě neplatí.", "Zbylé možnosti porovnej s tím, co už víš."];
const STRATEGIE_RAZENI = ["Nejdřív najdi úplně první a úplně poslední událost, zbylé pak zařaď mezi ně.", "Ptej se: co se muselo stát dřív, aby mohlo přijít to další?"];
const STRATEGIE_PAROVANI = ["Každá položka vlevo má právě jednu dvojici vpravo.", "Začni tou dvojicí, kterou znáš nejlíp, a zbytek vylučuj."];
const STRATEGIE_TRIDENI = ["U každé položky se ptej, podle jakého znaku do skupiny patří.", "Když si nejsi jistý nebo jistá, začni položkami, které znáš nejlíp."];

/** Velká nápověda má být aspoň o pětinu delší než malá (audit hint_progression). */
export function doplnVelkou(h0: string, h1: string, doplnky: string[]): string {
  let out = h1;
  for (const d of doplnky) {
    if (out.length >= h0.length * 1.2) break;
    if (!out.includes(d)) out = `${out} ${d}`;
  }
  return out;
}

// ── Chronologie (drag_order) ─────────────────────────────────────────────────

export interface Udalost extends SUrovni {
  /** Co se stalo — bez data. */
  co: string;
  /** Zobrazené datum: „1939“, „15. 3. 1939“, „1945–1946“. */
  kdy: string;
  /** Řadicí klíč: rok, u blízkých událostí s měsícem a dnem (1939.0315). */
  klic: number;
  /** Souvislost — proč se to stalo právě tehdy. Jde do nápovědy i vysvětlení. */
  proc: string;
}

/**
 * Chronologické úlohy z banky událostí.
 *  L1: tři události s datem · L2: čtyři události s datem
 *  L3: čtyři události BEZ data — pořadí se odvozuje ze souvislostí.
 * V jedné úloze nejsou dvě události se stejným klíčem (na L3 se stejným rokem).
 */
export function chronologie(udalosti: Udalost[], level: number, oCem: string, pocet = 30): PracticeTask[] {
  const n = level === 1 ? 3 : 4;
  const sDatem = level < 3;
  const popis = (u: Udalost) => (sDatem ? `${u.co} (${u.kdy})` : u.co);
  return unikatni(pocet, () => {
    const xs = vyberProUroven(udalosti, level, n, (ys) =>
      new Set(ys.map((y) => (sDatem ? y.klic : Math.floor(y.klic)))).size === ys.length);
    if (!xs) return null;
    const serazene = [...xs].sort((a, b) => a.klic - b.klic);
    const [a, b, ...zbytek] = shuffle(xs);
    const kotva = pick(serazene.slice(1));
    // Malá nápověda jmenuje všechny události úlohy — je tak unikátní pro celou sadu.
    const h0 = `Která událost byla dřív: „${a.co}“, nebo „${b.co}“? A kam patří ${zbytek.map((u) => `„${u.co}“`).join(" a ")}?`;
    const h1 = sDatem
      ? `Porovnej data v závorkách a začni tím nejstarším. ${kotva.proc}`
      : `Pomůže kotva: „${kotva.co}“ je z doby ${kotva.kdy}. ${kotva.proc} Ostatní události zařaď před ni, nebo za ni.`;
    return {
      question: sDatem
        ? `Seřaď ${n === 3 ? "tři" : "čtyři"} události ${oCem} od nejstarší po nejnovější.`
        : `Seřaď čtyři události ${oCem} od nejstarší po nejnovější. Data tentokrát nejsou uvedená.`,
      correctAnswer: "order",
      items: serazene.map(popis),
      hints: [h0, doplnVelkou(h0, h1, [...serazene.map((u) => u.proc), ...STRATEGIE_RAZENI])],
      explanation: `Správné pořadí: ${serazene.map((u) => `${u.co} (${u.kdy})`).join(" → ")}. ${serazene.map((u) => u.proc).join(" ")}`,
    };
  }, (t) => JSON.stringify(t.items));
}

// ── Přiřazování (match_pairs) ────────────────────────────────────────────────

export interface Dvojice extends SUrovni {
  levy: string;
  pravy: string;
  /** Proč k sobě patří — jde do nápovědy a vysvětlení. */
  proc: string;
}

/** Přiřazovací úlohy z banky dvojic: L1 tři dvojice, L2 čtyři, L3 pět. */
export function parovani(bank: Dvojice[], level: number, zadani: string, pocet = 30): PracticeTask[] {
  const n = level === 1 ? 3 : level === 2 ? 4 : 5;
  return unikatni(pocet, () => {
    const xs = vyberProUroven(bank, level, n, (ys) =>
      new Set(ys.map((y) => y.levy)).size === n && new Set(ys.map((y) => y.pravy)).size === n);
    if (!xs) return null;
    const [, b] = xs;
    // Malá nápověda jmenuje všechny levé strany — je tak unikátní pro celou sadu.
    const h0 = `Začni dvojicí, kterou znáš jistě. Kam patří ${xs.map((x) => `„${x.levy}“`).join(", ")}?`;
    const h1 = `Nápověda k „${b.levy}“: ${b.proc} Zbylé dvojice pak doplň vylučováním.`;
    return {
      question: `${zadani} (${n === 3 ? "tři dvojice" : n === 4 ? "čtyři dvojice" : "pět dvojic"})`,
      correctAnswer: "match",
      pairs: xs.map((x) => ({ left: x.levy, right: x.pravy })),
      hints: [h0, doplnVelkou(h0, h1, [...xs.slice(2).map((x) => x.proc), ...STRATEGIE_PAROVANI])],
      explanation: xs.map((x) => `${x.levy} → ${x.pravy}: ${x.proc}`).join(" "),
    };
  }, (t) => JSON.stringify([...(t.pairs ?? [])].sort((p, q) => p.left.localeCompare(q.left))));
}

// ── Třídění (categorize) ─────────────────────────────────────────────────────

export interface Zarazeni extends SUrovni {
  polozka: string;
  skupina: string;
  /** Rozlišovací znak — podle čeho položka patří do skupiny. */
  proc: string;
}

/** Třídicí úlohy z banky: L1 čtyři položky, L2 pět, L3 šest; vždy aspoň dvě skupiny. */
export function trideni(bank: Zarazeni[], level: number, zadani: string, pocet = 30): PracticeTask[] {
  const n = level === 1 ? 4 : level === 2 ? 5 : 6;
  return unikatni(pocet, () => {
    const xs = vyberProUroven(bank, level, n, (ys) => new Set(ys.map((y) => y.skupina)).size >= 2);
    if (!xs) return null;
    const skupiny = [...new Set(xs.map((x) => x.skupina))].sort((p, q) => p.localeCompare(q));
    const [, b] = xs;
    const h0 = `Rozhodni u každé položky (${xs.map((x) => x.polozka).join(", ")}), podle čeho do skupiny patří.`;
    const h1 = `Nápověda k „${b.polozka}“: ${b.proc} Stejně rozhodni i u ostatních položek.`;
    return {
      question: `${zadani} (${n === 4 ? "čtyři položky" : n === 5 ? "pět položek" : "šest položek"})`,
      correctAnswer: "categorize",
      categories: skupiny.map((s) => ({ name: s, items: xs.filter((x) => x.skupina === s).map((x) => x.polozka) })),
      hints: [h0, doplnVelkou(h0, h1, [...xs.slice(2).map((x) => x.proc), ...STRATEGIE_TRIDENI])],
      explanation: xs.map((x) => `${x.polozka} → ${x.skupina}: ${x.proc}`).join(" "),
    };
  }, (t) => JSON.stringify((t.categories ?? []).map((c) => [c.name, [...c.items].sort()])));
}
