/**
 * Doplňovací diktát — sdílené jádro pro všechny ročníky (2026-09-26).
 *
 * Proč zvlášť, a ne jako další pravopisné téma: v běžném pravopisném cvičení
 * dítě předem ví, jaké pravidlo platí (je v názvu tématu). V diktátu to
 * **musí nejdřív poznat** — a právě to je dovednost, kterou diktát trénuje.
 * Odtud i stavba úrovní: L1 jedno pravidlo, L2 promíchaná pravidla,
 * L3 dvojice, kde o zápisu rozhoduje význam.
 *
 * Distraktory se u rodin pravidel dopočítávají (`iy`, `skupina`), aby se
 * u dvou set položek nedala rozejít zpětná vazba. Ruční `polozka` zůstává
 * pro jevy, kde jsou chyby specifické.
 *
 * Historie: do 26. 9. existoval legacy `cz-diktat`
 * (`src/lib/content/czech/diktat.ts`) se společným zásobníkem 353 vět. Byl
 * roky nedostupný — `CZECH_TOPICS` jsou v `src/lib/content/index.ts`
 * zakomentované — a jeho generátor ignoroval úroveň, takže L1 = L2 = L3.
 * Tohle je náhrada, ne jeho zapnutí.
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

/** Distraktor = konkrétní typická chyba + vysvětlení, proč to tak není. */
export interface Distractor {
  value: string;
  why: string;
}

/** Jedna položka diktátu: věta s právě jedním podtržítkem. */
export interface Polozka {
  /** Věta s právě jedním podtržítkem na místě sporného zápisu. */
  veta: string;
  /** Celé slovo, jak se správně píše — jde do zpětné vazby a vysvětlení. */
  slovo: string;
  /** Co se do mezery doplňuje. */
  spravne: string;
  /** Dvě až tři typické chyby. */
  chybne: Distractor[];
  /** Krátký název pravidla. V diktátu ho žák musí poznat, proto NEPATŘÍ do zadání. */
  pravidlo: string;
  /** Proč se slovo píše tak, jak se píše. */
  proc: string;
}

const STRATEGIE = [
  "Přečti si celou větu nahlas — ze smyslu často poznáš, o jaké slovo jde.",
  "Když si nejsi jistý nebo jistá, zkus slovo obměnit v jiném tvaru.",
];

/**
 * Velká nápověda musí být aspoň o pětinu delší než malá (audit
 * `hint_progression`). Stejný postup jako v `grade-3/_shared.ts`.
 */
function doplnVelkou(h0: string, h1: string): string {
  let out = h1;
  for (const d of STRATEGIE) {
    if (out.length >= h0.length * 1.2) break;
    if (!out.includes(d)) out = `${out} ${d}`;
  }
  return out;
}

function uloha(p: Polozka, hints: [string, string]): PracticeTask {
  if ((p.veta.match(/_/g) ?? []).length !== 1) {
    throw new Error(`Věta diktátu musí mít právě jedno podtržítko: ${p.veta}`);
  }
  const optionFeedback: Record<string, string> = {};
  for (const d of p.chybne) optionFeedback[d.value] = d.why;
  return {
    question: `Doplň: „${p.veta}“`,
    correctAnswer: p.spravne,
    options: shuffle([p.spravne, ...p.chybne.map((d) => d.value)]),
    optionFeedback,
    hints: [hints[0], doplnVelkou(hints[0], hints[1])],
    explanation: p.proc,
  };
}

// ── Rodina: i/í × y/ý ────────────────────────────────────────────────

export type Grafem = "y" | "ý" | "i" | "í";
const GRAFEMY: Grafem[] = ["y", "ý", "i", "í"];
const tvrdy = (g: Grafem) => g === "y" || g === "ý";
const dlouhy = (g: Grafem) => g === "ý" || g === "í";

/**
 * Položka s volbou i/í × y/ý. Možnosti jsou vždy všechny čtyři grafémy —
 * nikdy celé chybně napsané slovo (CONTENT_AUTHORING: pravopis 1. stupně).
 * Zpětná vazba rozliší dvě různé chyby: špatné i × y a špatnou délku.
 */
export function iy(veta: string, slovo: string, g: Grafem, pravidlo: string, proc: string): Polozka {
  const why = (x: Grafem): string =>
    tvrdy(x) !== tvrdy(g)
      ? `Ve slově „${slovo}“ se píše ${tvrdy(g) ? "y/ý" : "i/í"} — ${pravidlo}.`
      : `Písmeno sedí, ale samohláska ve slově „${slovo}“ je ${dlouhy(g) ? "dlouhá" : "krátká"}. Vyslov ho pomalu.`;
  return {
    veta,
    slovo,
    spravne: g,
    chybne: GRAFEMY.filter((x) => x !== g).map((x) => ({ value: x, why: why(x) })),
    pravidlo,
    proc,
  };
}

// ── Rodina: sporná skupina písmen ────────────────────────────────────

/**
 * Položka, kde se doplňuje celá sporná skupina (dě × dje, mě × mně,
 * s × z, velké × malé písmeno). Chybné zápisy se předávají ručně —
 * u každého jevu jsou jiné.
 */
export function skupina(
  veta: string,
  slovo: string,
  spravne: string,
  chybne: [string, string][] | [string, string, string][],
  pravidlo: string,
  proc: string,
): Polozka {
  return {
    veta,
    slovo,
    spravne,
    chybne: (chybne as [string, string][]).map(([value, why]) => ({ value, why })),
    pravidlo,
    proc,
  };
}

// ── Rodina: shoda přísudku s podmětem ────────────────────────────────

const ROD: Record<string, string> = {
  i: "koncovku -i má přísudek u podmětu rodu mužského životného (chlapci, psi, ptáci)",
  y: "koncovku -y má přísudek u podmětu rodu ženského nebo mužského neživotného (dívky, stromy)",
  a: "koncovku -a má přísudek u podmětu rodu středního (koťata, okna)",
};

/**
 * Shoda přísudku s podmětem: -i × -y × -a. Sdílené, protože stejný jev
 * řeší 5. i 6. ročník — v pětce se zavádí, v šestce se opakuje vedle
 * skloňování.
 */
export function shoda(veta: string, tvar: string, spravne: "i" | "y" | "a", proc: string): Polozka {
  return skupina(
    veta,
    tvar,
    spravne,
    (["i", "y", "a"] as const)
      .filter((x) => x !== spravne)
      .map((x) => [x, `Tady ne: ${ROD[x]}.`] as [string, string]) as [string, string][],
    "shoda přísudku s podmětem",
    proc,
  );
}

// ── Sestavení úrovní ─────────────────────────────────────────────────

/**
 * L1 — pravidlo je v celé úrovni jedno, dítě ho jen použije.
 * Nápověda ho smí pojmenovat: rozpoznání tu není cílem.
 */
export function urovenJednoPravidlo(pool: Polozka[], pravidloVeObecne: string): PracticeTask[] {
  return shuffle(pool).map((p) =>
    uloha(p, [
      `Ve větě „${p.veta}“ chybí jedno písmeno. ${pravidloVeObecne}`,
      `Nejdřív se podívej na písmeno TĚSNĚ PŘED mezerou — podle něj se pravidlo pozná. Pak teprve doplň.`,
    ]),
  );
}

/**
 * L2 — pravidla jsou promíchaná. Nápověda proto pravidlo NEPOJMENUJE,
 * jen navede, jak ho poznat: to je ta dovednost navíc oproti L1.
 */
export function urovenMix(pool: Polozka[]): PracticeTask[] {
  return shuffle(pool).map((p) =>
    uloha(p, [
      `V diktátu se pravidla střídají. U věty „${p.veta}“ si nejdřív odpověz: o jaký pravopisný jev tady vlastně jde?`,
      `Postupuj ve dvou krocích. Nejdřív urči jev — podle písmene před mezerou nebo podle toho, jestli jde o jméno. Teprve potom použij pravidlo, které k tomu jevu patří.`,
    ]),
  );
}

/**
 * L3 — slovo zní stejně jako jiné, ale píše se jinak; rozhoduje význam ve
 * větě (nebo u tvrdých d, t, n výslovnost). Nápověda se proto ptá na to,
 * CO slovo znamená — pojmenovat pravidlo by tady odpověď prozradilo.
 */
export function urovenVyznam(pool: Polozka[]): PracticeTask[] {
  return shuffle(pool).map((p) =>
    uloha(p, [
      `Ve větě „${p.veta}“ nerozhoduje jen pravidlo, ale hlavně smysl. Co to slovo na tom místě znamená?`,
      `Jsou slova, která se vyslovují skoro stejně, ale píšou se jinak, protože znamenají něco jiného. Dosaď si do věty obě možnosti a zeptej se, která tam dává smysl.`,
    ]),
  );
}
