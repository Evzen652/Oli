/**
 * Matematika 6. ročník — Početní operace s desetinnými čísly (komplexně).
 *
 * Každá úloha má aspoň dvě operace (izolované násobení a dělení patří
 * sesterskému podtématu). Stavba podle výpočetního vzoru `fyzika/mereniDelky.ts`:
 *  • L1 = výraz o dvou operacích bez závorek (přednost násobení a dělení),
 *  • L2 = výraz se závorkami / třemi operacemi s desetinným činitelem
 *         a dvoukroková slovní úloha (nákup, litry nebo metry dohromady),
 *  • L3 = tříkroková slovní úloha (vrácené peníze, cena kusu po odečtech,
 *         cena 1 kg nebo 1 l ve dvou baleních, délka nebo objem jednoho dílu).
 *
 * Všechno se počítá v SETINÁCH jako celá čísla, takže nevznikne chyba
 * plovoucí čárky. Distraktor = výsledek jednoho konkrétního chybného postupu
 * z týchž čísel. Kandidát, který nevyjde kladný nebo má víc než dvě desetinná
 * místa, se zahodí; když zbydou méně než tři, úloha se losuje znovu.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pastTense, phrase, plural } from "@/lib/czechGrammar";
import { cis, rnd, pick, buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

// ── Formátování a pomocníci ────────────────────────────────────────────────
/** Hodnota v setinách → české číslo („13,7“, „0,85“). */
const h = (s: number) => cis(s / 100);
/** Cena v setinách → „47,20“ nebo „124“ (haléře vždy na dvě místa). */
const kc = (s: number) => (s % 100 === 0 ? cis(s / 100) : s % 10 === 0 ? `${cis(s / 100)}0` : cis(s / 100));

/** Kandidát na distraktor: hodnota v setinách a vysvětlení chyby. */
interface Kand {
  s: number;
  why: string;
}

/** Nechá jen kladné kandidáty s nejvýš dvěma desetinnými místy. */
function kandidati(k: Kand[], fmt: (s: number) => string): Distractor[] {
  return k.filter((x) => Number.isInteger(x.s) && x.s > 0).map((x) => ({ value: fmt(x.s), why: x.why }));
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Obsahuje text číslo `num` jako samostatné číslo (ne jako kus jiného)? */
function obsahujeCislo(text: string, num: string): boolean {
  return new RegExp(`(?<![\\d,])${esc(num)}(?!\\d|,\\d)`).test(text);
}

/** Úloha, jejíž klíč nesmí být ve znění otázky ani v nápovědách. */
function uloha(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: string[]; solutionSteps: string[]; explanation: string },
): PracticeTask | null {
  const cislo = correct.replace(/\s*(Kč|m|l)$/, "");
  if (obsahujeCislo(question, cislo)) return null;
  const t = buildChoiceTask(question, correct, distractors, parts);
  if (!t) return null;
  // Nápovědy skládáme sami: sdílený seznam „Čísla ze zadání“ slévá desetinné
  // čárky s oddělovačem a vynechává čísla obsažená v klíči (tím ho prozrazuje).
  const [h0, h1Zaklad] = parts.hints;
  let h1 = h1Zaklad;
  if (h1.length < h0.length * 1.2 && !/Zkouška:|Odhadni/.test(h1)) h1 = `${h1} ${STRATEGIE}`;
  t.hints = [h0, h1];
  // Klíč nesmí být v nápovědě ani jako kus jiného čísla (brána hledá podřetězec: „7,2“ v „27,2“).
  if (t.hints!.some((x) => x.includes(cislo))) return null;
  if (t.hints![0] === t.hints![1]) return null;
  return t;
}

const STRATEGIE = "Nakonec porovnej výsledek s odhadem: dává takové číslo smysl?";
/** Přednost operací ve výrazu BEZ závorek. */
const PORADI = "Násobení a dělení mají přednost před sčítáním a odčítáním.";
/** Přednost operací ve výrazu SE závorkami. */
const PORADI_Z = "Závorka se počítá úplně nejdřív, pak násobení a dělení, nakonec sčítání a odčítání.";
/** Čárka v součinu (činitel desetinné číslo, druhý přirozené nebo desetinné). */
const CARKA_SOUCIN = "Součin má tolik desetinných míst, kolik jich mají oba činitelé dohromady.";
const carkaKrat = (c: number) =>
  c >= 10
    ? `Násobit číslem ${c} znamená posunout čárku o ${c === 10 ? "jedno místo" : "dvě místa"} doprava.`
    : CARKA_SOUCIN;
/** Čárka v podílu při dělení přirozeným číslem. */
const CARKA_PODIL = "Při dělení přirozeným číslem napiš čárku do podílu ve chvíli, kdy ji v dělenci překročíš.";
const carkaDeleno = (c: number) =>
  c === 10 ? "Dělit deseti znamená posunout čárku o jedno místo doleva." : CARKA_PODIL;
/** Čárka při dělení desetinným číslem. */
const CARKA_DES_DELITEL =
  "Když dělíš desetinným číslem, posuň čárku u dělitele i u dělence o stejný počet míst doprava, aby byl dělitel přirozené číslo.";
const KROK = "Počet kusů se vztahuje k ceně jednoho kusu. Nejdřív spočítej, kolik stojí všechny kusy dohromady.";
const OTAZKA = "Přečti si znovu, na co se otázka ptá.";

/** Desetinné číslo s jedním desetinným místem (v desetinách, bez nuly na konci). */
function desetiny(min: number, max: number): number {
  let t = rnd(min, max);
  while (t % 10 === 0) t = rnd(min, max);
  return t;
}

// ── Generátor ──────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── L1 — dvě operace bez závorek, rozhoduje přednost ──────────────────────
const L1 = "Vypočítej výraz bez závorek:";

function genL1(): PracticeTask | null {
  const tvar = pick(["plus", "minus", "deleni", "minusDeleni", "kratDeleni"] as const);
  if (tvar === "plus") return l1Plus();
  if (tvar === "minus") return l1Minus();
  if (tvar === "minusDeleni") return l1MinusDeleni();
  if (tvar === "kratDeleni") return l1KratDeleni();
  return l1Deleni();
}

/** a − b : c — dělení až na druhém místě, ale počítá se první. */
function l1MinusDeleni(): PracticeTask | null {
  const c = pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const bT = c === 10 ? desetiny(11, 99) : rnd(2, 19) * c;
  if (bT % 10 === 0) return null;
  const aT = desetiny(bT + 5, bT + 150);
  if (((aT - bT) * 10) % c !== 0) return null;
  const a = aT * 10, b = bT * 10;
  const podil = b / c;
  const key = a - podil;
  return uloha(
    `${L1} ${h(a)} − ${h(b)} : ${c}`,
    h(key),
    kandidati(
      [
        { s: (a - b) / c, why: `Tahle možnost vyjde při počítání zleva doprava: (${h(a)} − ${h(b)}) : ${c}. ${PORADI}` },
        { s: a - podil / 10, why: `Čárka v podílu ${h(b)} : ${c} je o jedno místo vlevo. ${carkaDeleno(c)}` },
        { s: a - podil * 10, why: `Čárka v podílu ${h(b)} : ${c} je o jedno místo vpravo. ${carkaDeleno(c)}` },
        { s: a - b * c, why: `Tady se místo dělení násobilo: ${h(b)} · ${c}. Znak : znamená dělení.` },
        { s: a + podil, why: `Tady se podíl ${h(b)} : ${c} přičetl. Znak − znamená, že se podíl odečítá.` },
      ],
      h,
    ),
    {
      hints: [
        `Nejdřív vyděl ${h(b)} : ${c}, teprve potom podíl odečti od ${h(a)}.`,
        `${c === 10 ? `Dělit deseti znamená posunout čárku v čísle ${h(b)} o jedno místo doleva.` : `Při dělení čísla ${h(b)} číslem ${c} napiš čárku do podílu ve chvíli, kdy ji v dělenci překročíš.`} Při odčítání piš čárku pod čárku.`,
      ],
      solutionSteps: [`${h(b)} : ${c} = ${h(podil)}`, `${h(a)} − ${h(podil)} = ${h(key)}`],
      explanation: `Dělení má přednost před odčítáním, proto nejdřív ${h(b)} : ${c} = ${h(podil)} a teprve potom ${h(a)} − ${h(podil)} = ${h(key)}.`,
    },
  );
}

/** a · c − b : d — dvě přednostní operace a mezi nimi odčítání. */
function l1KratDeleni(): PracticeTask | null {
  const c = pick([2, 3, 4, 5, 6, 7, 8, 9]);
  const d = pick([2, 3, 4, 5, 6, 8]);
  const aT = desetiny(11, 99);
  const bT = rnd(2, 19) * d;
  if (bT % 10 === 0) return null;
  const a = aT * 10, b = bT * 10;
  const soucin = a * c;
  const podil = b / d;
  const key = soucin - podil;
  // Chyba „zleva doprava“ ((a · c − b) : d) musí vyjít kladná a beze zbytku.
  if (key <= 0 || soucin <= b || (soucin - b) % d !== 0) return null;
  return uloha(
    `${L1} ${h(a)} · ${c} − ${h(b)} : ${d}`,
    h(key),
    kandidati(
      [
        { s: (soucin - b) / d, why: `Tahle možnost vyjde při počítání zleva doprava: (${h(a)} · ${c} − ${h(b)}) : ${d}. ${PORADI}` },
        { s: soucin / 10 - podil, why: `Čárka v součinu ${h(a)} · ${c} je o jedno místo vlevo. ${CARKA_SOUCIN}` },
        { s: soucin - podil / 10, why: `Čárka v podílu ${h(b)} : ${d} je o jedno místo vlevo. ${CARKA_PODIL}` },
        { s: soucin * 10 - podil, why: `Čárka v součinu ${h(a)} · ${c} je o jedno místo vpravo. ${CARKA_SOUCIN}` },
      ],
      h,
    ),
    {
      hints: [
        `Nejdřív vyřeš součin ${h(a)} · ${c} i podíl ${h(b)} : ${d}. Teprve potom podíl od součinu odečti.`,
        `${nasobHint(aT, c)} Při dělení čísla ${h(b)} číslem ${d} napiš čárku do podílu, když ji v dělenci překročíš.`,
      ],
      solutionSteps: [
        `${h(a)} · ${c} = ${h(soucin)}`,
        `${h(b)} : ${d} = ${h(podil)}`,
        `${h(soucin)} − ${h(podil)} = ${h(key)}`,
      ],
      explanation: `Násobení i dělení mají přednost před odčítáním. Proto nejdřív ${h(a)} · ${c} = ${h(soucin)} a ${h(b)} : ${d} = ${h(podil)}, teprve potom ${h(soucin)} − ${h(podil)} = ${h(key)}.`,
    },
  );
}

function nasobHint(bT: number, c: number): string {
  return c >= 10
    ? `Násobit číslem ${c} znamená posunout čárku v čísle ${h(bT * 10)} o ${c === 10 ? "jedno místo" : "dvě místa"} doprava.`
    : `Číslo ${h(bT * 10)} má jedno desetinné místo, a proto ho má i součin ${h(bT * 10)} · ${c}, pokud nekončí nulou.`;
}

function l1Plus(): PracticeTask | null {
  const c = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 100]);
  const a = desetiny(11, 99) * 10;
  const bT = desetiny(11, 49);
  const b = bT * 10;
  const soucin = b * c;
  const key = a + soucin;
  const q = `${L1} ${h(a)} + ${h(b)} · ${c}`;
  return uloha(
    q,
    h(key),
    kandidati(
      [
        { s: (a + b) * c, why: `Tahle možnost vyjde při počítání zleva doprava: (${h(a)} + ${h(b)}) · ${c}. ${PORADI}` },
        { s: a + soucin / 10, why: `Čárka v součinu ${h(b)} · ${c} je o jedno místo vlevo. ${carkaKrat(c)}` },
        { s: a + soucin * 10, why: `Čárka v součinu ${h(b)} · ${c} je o jedno místo vpravo. ${carkaKrat(c)}` },
        { s: a + b + c * 100, why: `Tady se místo násobení sčítalo: ${h(b)} + ${c}. Znak · znamená násobení.` },
      ],
      h,
    ),
    {
      hints: [
        `Nejdřív vyřeš součin ${h(b)} · ${c}, teprve potom přičti ${h(a)}.`,
        `${nasobHint(bT, c)} Při sčítání piš čárku pod čárku.`,
      ],
      solutionSteps: [`${h(b)} · ${c} = ${h(soucin)}`, `${h(a)} + ${h(soucin)} = ${h(key)}`],
      explanation: `Násobení má přednost před sčítáním, proto nejdřív ${h(b)} · ${c} = ${h(soucin)} a teprve potom ${h(a)} + ${h(soucin)} = ${h(key)}.`,
    },
  );
}

function l1Minus(): PracticeTask | null {
  const c = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 100]);
  const bT = c === 100 ? rnd(1, 9) : desetiny(12, 49);
  const r = desetiny(11, 99);
  const aT = bT * c + r;
  if (aT % 10 === 0) return null;
  const a = aT * 10, b = bT * 10;
  const soucin = b * c;
  const key = a - soucin;
  const q = `${L1} ${h(a)} − ${h(b)} · ${c}`;
  return uloha(
    q,
    h(key),
    kandidati(
      [
        { s: (a - b) * c, why: `Tahle možnost vyjde při počítání zleva doprava: (${h(a)} − ${h(b)}) · ${c}. ${PORADI}` },
        { s: a - soucin / 10, why: `Čárka v součinu ${h(b)} · ${c} je o jedno místo vlevo. ${carkaKrat(c)}` },
        { s: a - soucin * 10, why: `Čárka v součinu ${h(b)} · ${c} je o jedno místo vpravo. ${carkaKrat(c)}` },
        { s: a - b - c * 100, why: `Tady se místo násobení sčítalo: ${h(b)} + ${c}. Znak · znamená násobení.` },
      ],
      h,
    ),
    {
      hints: [
        `Nejdřív vyřeš součin ${h(b)} · ${c}, teprve potom ho odečti od ${h(a)}.`,
        `${nasobHint(bT, c)} Při odčítání piš čárku pod čárku.`,
      ],
      solutionSteps: [`${h(b)} · ${c} = ${h(soucin)}`, `${h(a)} − ${h(soucin)} = ${h(key)}`],
      explanation: `Násobení má přednost před odčítáním, proto nejdřív ${h(b)} · ${c} = ${h(soucin)} a teprve potom ${h(a)} − ${h(soucin)} = ${h(key)}.`,
    },
  );
}

function l1Deleni(): PracticeTask | null {
  const c = pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const bT = c === 10 ? desetiny(11, 99) : rnd(2, 19) * c;
  if (bT % 10 === 0) return null;
  const aT = desetiny(11, 99);
  if (((aT + bT) * 10) % c !== 0) return null;
  const a = aT * 10, b = bT * 10;
  const podil = b / c;
  const key = a + podil;
  const q = `${L1} ${h(a)} + ${h(b)} : ${c}`;
  return uloha(
    q,
    h(key),
    kandidati(
      [
        { s: (a + b) / c, why: `Tahle možnost vyjde při počítání zleva doprava: (${h(a)} + ${h(b)}) : ${c}. ${PORADI}` },
        { s: a + podil * 10, why: `Čárka v podílu ${h(b)} : ${c} je o jedno místo vpravo. ${carkaDeleno(c)}` },
        { s: a + podil / 10, why: `Čárka v podílu ${h(b)} : ${c} je o jedno místo vlevo. ${carkaDeleno(c)}` },
        { s: a + b * c, why: `Tady se místo dělení násobilo: ${h(b)} · ${c}. Znak : znamená dělení.` },
      ],
      h,
    ),
    {
      hints: [
        `Nejdřív vyděl ${h(b)} : ${c}, teprve potom přičti ${h(a)}.`,
        c === 10
          ? `Dělit deseti znamená posunout čárku v čísle ${h(b)} o jedno místo doleva. Při sčítání piš čárku pod čárku.`
          : `Při dělení čísla ${h(b)} číslem ${c} napiš čárku do podílu ve chvíli, kdy ji v dělenci překročíš. Při sčítání piš čárku pod čárku.`,
      ],
      solutionSteps: [`${h(b)} : ${c} = ${h(podil)}`, `${h(a)} + ${h(podil)} = ${h(key)}`],
      explanation: `Dělení má přednost před sčítáním, proto nejdřív ${h(b)} : ${c} = ${h(podil)} a teprve potom ${h(a)} + ${h(podil)} = ${h(key)}.`,
    },
  );
}

// ── L2 — závorky, tři operace, desetinný činitel; nákup ve dvou krocích ────
const L2Z = "Vypočítej výraz se závorkami:";
const L2T = "Vypočítej výraz se třemi operacemi:";
/** Desetinné činitele a dělitele v desetinách: 0,2 · 0,4 · 0,5 · … · 2,5. */
const CINITEL = [2, 4, 5, 6, 8, 12, 15, 25];
const DELITEL = [2, 4, 5, 12, 15, 25];

const dveMista = (c: string) =>
  `Součin má tolik desetinných míst, kolik mají oba činitelé dohromady. U čísla ${c} a čísla s jedním desetinným místem počítej se dvěma (nulu na konci pak smíš vynechat).`;

function genL2(): PracticeTask | null {
  const r = Math.random();
  if (r < 0.13) return l2RozdilKrat();
  if (r < 0.26) return l2KratSoucet();
  if (r < 0.39) return l2SoucetDeleno();
  if (r < 0.52) return l2TriOperace();
  if (r < 0.76) return l2Nakup();
  return l2Mnozstvi();
}

function l2RozdilKrat(): PracticeTask | null {
  const cT = pick(CINITEL);
  const aT = desetiny(21, 99);
  const bT = desetiny(11, aT - 5);
  // Chyba „bez závorky“ (a − b · c) musí vyjít kladná, jinak by v nabídce chyběla.
  if (aT * 10 <= bT * cT) return null;
  const dT = aT - bT;
  const key = dT * cT;
  const [a, b, c, d] = [aT * 10, bT * 10, cT * 10, dT * 10];
  return uloha(
    `${L2Z} (${h(a)} − ${h(b)}) · ${h(c)}`,
    h(key),
    kandidati(
      [
        { s: a - bT * cT, why: `Tahle možnost vyjde, když se závorka vynechá: ${h(a)} − ${h(b)} · ${h(c)}. ${PORADI_Z}` },
        { s: key * 10, why: `Čárka v součinu ${h(d)} · ${h(c)} je o jedno místo vpravo. ${CARKA_SOUCIN}` },
        { s: key / 10, why: `Čárka v součinu ${h(d)} · ${h(c)} je o jedno místo vlevo. ${CARKA_SOUCIN}` },
        { s: aT * cT - b, why: `Číslem ${h(c)} se násobí celá závorka, ne jen ${h(a)}. ${PORADI_Z}` },
      ],
      h,
    ),
    {
      hints: [
        `Nejdřív spočítej rozdíl v závorce ${h(a)} − ${h(b)}, teprve potom ho vynásob číslem ${h(c)}.`,
        dveMista(h(c)),
      ],
      solutionSteps: [`${h(a)} − ${h(b)} = ${h(d)}`, `${h(d)} · ${h(c)} = ${h(key)}`],
      explanation: `Závorka se počítá nejdřív: ${h(a)} − ${h(b)} = ${h(d)}. Pak ${h(d)} · ${h(c)} = ${h(key)}, součin má dvě desetinná místa, protože oba činitelé mají po jednom.`,
    },
  );
}

function l2KratSoucet(): PracticeTask | null {
  const aT = pick(CINITEL);
  const bT = desetiny(11, 69);
  const cT = desetiny(11, 69);
  const sT = bT + cT;
  const key = aT * sT;
  const [a, b, c, s] = [aT * 10, bT * 10, cT * 10, sT * 10];
  return uloha(
    `${L2Z} ${h(a)} · (${h(b)} + ${h(c)})`,
    h(key),
    kandidati(
      [
        { s: aT * bT + c, why: `Tahle možnost vyjde, když se závorka vynechá: ${h(a)} · ${h(b)} + ${h(c)}. ${PORADI_Z}` },
        { s: key * 10, why: `Čárka v součinu ${h(a)} · ${h(s)} je o jedno místo vpravo. ${CARKA_SOUCIN}` },
        { s: key / 10, why: `Čárka v součinu ${h(a)} · ${h(s)} je o jedno místo vlevo. ${CARKA_SOUCIN}` },
        { s: a + b + c, why: `Tady se místo násobení sčítalo: ${h(a)} + ${h(s)}. Znak · znamená násobení.` },
      ],
      h,
    ),
    {
      hints: [
        `Nejdřív sečti čísla v závorce ${h(b)} + ${h(c)}, teprve potom součet vynásob číslem ${h(a)}.`,
        dveMista(h(a)),
      ],
      solutionSteps: [`${h(b)} + ${h(c)} = ${h(s)}`, `${h(a)} · ${h(s)} = ${h(key)}`],
      explanation: `Závorka se počítá nejdřív: ${h(b)} + ${h(c)} = ${h(s)}. Pak ${h(a)} · ${h(s)} = ${h(key)}, součin má dvě desetinná místa, protože oba činitelé mají po jednom.`,
    },
  );
}

function l2SoucetDeleno(): PracticeTask | null {
  const cT = pick(DELITEL);
  const vysl = rnd(2, 30);
  const sT = cT * vysl;
  const m = rnd(1, vysl - 1);
  const bT = cT * m;
  const aT = sT - bT;
  if (aT <= 0 || aT === bT || (aT % 10 === 0 && bT % 10 === 0)) return null;
  const key = vysl * 100;
  const [a, b, c, s] = [aT * 10, bT * 10, cT * 10, sT * 10];
  return uloha(
    `${L2Z} (${h(a)} + ${h(b)}) : ${h(c)}`,
    h(key),
    kandidati(
      [
        { s: a + m * 100, why: `Tahle možnost vyjde, když se závorka vynechá: ${h(a)} + ${h(b)} : ${h(c)}. ${PORADI_Z}` },
        { s: key * 10, why: `Čárka se posunula jen u dělence ${h(s)}, u dělitele ${h(c)} ne. ${CARKA_DES_DELITEL}` },
        { s: key / 10, why: `Čárka se posunula jen u dělitele ${h(c)}, u dělence ${h(s)} ne. ${CARKA_DES_DELITEL}` },
        { s: sT * cT, why: `Tady se součet ${h(s)} číslem ${h(c)} násobil místo dělil. Znak : znamená dělení.` },
      ],
      h,
    ),
    {
      hints: [
        `Nejdřív sečti čísla v závorce ${h(a)} + ${h(b)}, teprve potom součet vyděl číslem ${h(c)}.`,
        `Dělíš desetinným číslem ${h(c)}. Posuň čárku o jedno místo doprava u dělitele i u dělence, aby byl dělitel přirozené číslo.`,
      ],
      solutionSteps: [
        `${h(a)} + ${h(b)} = ${h(s)}`,
        `${h(s)} : ${h(c)} = ${cis(sT)} : ${cis(cT)} = ${h(key)}`,
      ],
      explanation: `Závorka se počítá nejdřív: ${h(a)} + ${h(b)} = ${h(s)}. Dělitel ${h(c)} převedeme na přirozené číslo posunutím čárky o jedno místo u obou čísel: ${cis(sT)} : ${cis(cT)} = ${h(key)}.`,
    },
  );
}

function l2TriOperace(): PracticeTask | null {
  const cT = pick(CINITEL);
  const bT = desetiny(11, 49);
  const prod = bT * cT; // setiny
  const aT = Math.max(Math.ceil(prod / 10), bT) + rnd(5, 60);
  if (aT % 10 === 0) return null;
  const dT = desetiny(11, 59);
  const [a, b, c, d] = [aT * 10, bT * 10, cT * 10, dT * 10];
  const rozdil = a - prod;
  const key = rozdil + d;
  return uloha(
    `${L2T} ${h(a)} − ${h(b)} · ${h(c)} + ${h(d)}`,
    h(key),
    kandidati(
      [
        { s: (aT - bT) * cT + d, why: `Tahle možnost vyjde při počítání zleva doprava: (${h(a)} − ${h(b)}) · ${h(c)} + ${h(d)}. ${PORADI}` },
        { s: a - prod * 10 + d, why: `Čárka v součinu ${h(b)} · ${h(c)} je o jedno místo vpravo. ${CARKA_SOUCIN}` },
        { s: a - prod / 10 + d, why: `Čárka v součinu ${h(b)} · ${h(c)} je o jedno místo vlevo. ${CARKA_SOUCIN}` },
        { s: a - prod - d, why: `Číslo ${h(d)} se přičítá, neodečítá. Odčítá se jen součin ${h(b)} · ${h(c)}.` },
      ],
      h,
    ),
    {
      hints: [
        `Nejdřív vyřeš součin ${h(b)} · ${h(c)}. Pak ho odečti od ${h(a)} a nakonec přičti ${h(d)}.`,
        `${dveMista(h(c))} Sčítání a odčítání pak počítej zleva doprava.`,
      ],
      solutionSteps: [
        `${h(b)} · ${h(c)} = ${h(prod)}`,
        `${h(a)} − ${h(prod)} = ${h(rozdil)}`,
        `${h(rozdil)} + ${h(d)} = ${h(key)}`,
      ],
      explanation: `Násobení má přednost, proto nejdřív ${h(b)} · ${h(c)} = ${h(prod)}. Sčítání a odčítání se pak počítá zleva doprava: ${h(a)} − ${h(prod)} = ${h(rozdil)} a ${h(rozdil)} + ${h(d)} = ${h(key)}.`,
    },
  );
}

// Jména s rodem pro minulý čas (tvar se odvodí přes pastTense, žádné „koupil/a“).
const JMENA: { jm: string; g: "m" | "f" }[] = [
  { jm: "Ema", g: "f" }, { jm: "Petr", g: "m" }, { jm: "Jana", g: "f" }, { jm: "Tomáš", g: "m" },
  { jm: "Lucie", g: "f" }, { jm: "Ondřej", g: "m" }, { jm: "Klára", g: "f" }, { jm: "Marek", g: "m" },
];
const v = (sloveso: string, g: "m" | "f") => pastTense(sloveso, g);

// Zboží na kusy: tvary 4. pádu (množné číslo) a 2. pádu mn. č. pro „cenu všech …“.
const KUSOVE: { few: string; many: string; pripona: string; od: number; do: number }[] = [
  { few: "sešity", many: "sešitů", pripona: "", od: 9, do: 24 },
  { few: "jogurty", many: "jogurtů", pripona: "", od: 12, do: 24 },
  { few: "rohlíky", many: "rohlíků", pripona: "", od: 3, do: 6 },
  { few: "krabice", many: "krabic", pripona: " mléka", od: 19, do: 29 },
  { few: "kostky", many: "kostek", pripona: " másla", od: 39, do: 59 },
  { few: "tužky", many: "tužek", pripona: "", od: 8, do: 15 },
];
// Jedna položka ve 4. pádu jednotného čísla.
const JEDNOTLIVE: { co: string; od: number; do: number }[] = [
  { co: "pravítko", od: 6, do: 12 },
  { co: "chléb", od: 39, do: 54 },
  { co: "sýr", od: 29, do: 49 },
  { co: "lepidlo", od: 24, do: 39 },
  { co: "balíček kapesníků", od: 15, do: 29 },
  { co: "pytlík bonbonů", od: 19, do: 35 },
];
const cena = (od: number, doK: number) => rnd(od, doK) * 100 + pick([0, 20, 40, 50, 90]);
/** Cena s nenulovými haléři — násobí se vždy desetinné číslo. */
const cenaHal = (od: number, doK: number) => rnd(od, doK) * 100 + pick([20, 40, 50, 90]);

/** L2 bez peněz: kolik litrů nebo metrů dohromady (n stejných kusů + jeden jiný). */
function l2Mnozstvi(): PracticeTask | null {
  const { jm, g } = pick(JMENA);
  const litry = Math.random() < 0.5;
  const n = rnd(2, 7);
  // litry: jedno desetinné místo (4,5 l); metry: dvě (0,75 m)
  const p = litry ? desetiny(15, 95) * 10 : rnd(3, 30) * 5;
  if (!litry && p % 10 === 0) return null;
  const q = desetiny(11, 59) * 10;
  const vsechny = n * p;
  const key = vsechny + q;
  const j = litry ? "l" : "m";
  const kusy = litry
    ? `${n} ${plural(n, "", "konve", "konví")} vody`
    : `${n} ${plural(n, "", "kusy", "kusů")} provázku`;
  const question = litry
    ? `Slovní úloha: ${jm} ${v("zaléval", g)} zahradu. ${v("Přinesl", g)} ${kusy} po ${h(p)} l a ještě jeden kbelík s ${h(q)} l. Kolik litrů vody ${v("spotřeboval", g)} celkem?`
    : `Slovní úloha: ${jm} ${v("ustřihl", g)} ${kusy} po ${h(p)} m a ještě jeden kus dlouhý ${h(q)} m. Kolik metrů provázku ${v("ustřihl", g)} celkem?`;
  const fmt = (s: number) => `${h(s)} ${j}`;
  return uloha(
    question,
    fmt(key),
    kandidati(
      [
        { s: p + q, why: `Tady se ${h(p)} ${j} nevynásobilo počtem ${n}. Nejdřív spočítej, ${litry ? "kolik vody bylo ve všech konvích" : "kolik měří všechny stejné kusy"} dohromady.` },
        { s: vsechny, why: `${litry ? "Tohle je jen voda z konví, chybí ještě kbelík." : "Tohle je jen délka stejně dlouhých kusů, chybí ještě poslední kus."} ${OTAZKA}` },
        { s: (p + q) * n, why: `Počtem ${n} se tu násobilo i ${h(q)} ${j}, ${litry ? "kbelík" : "ten kus"} je ale jen jeden.` },
        { s: vsechny * 10 + q, why: `Čárka v součinu ${n} · ${h(p)} je o jedno místo vpravo. ${CARKA_SOUCIN}` },
        { s: vsechny / 10 + q, why: `Čárka v součinu ${n} · ${h(p)} je o jedno místo vlevo. ${CARKA_SOUCIN}` },
      ],
      fmt,
    ),
    {
      hints: [
        litry
          ? `Nejdřív spočítej, kolik vody bylo ve všech konvích: ${n} · ${h(p)} l. Potom přičti ${h(q)} l z kbelíku.`
          : `Nejdřív spočítej, kolik měří dohromady stejně dlouhé kusy: ${n} · ${h(p)} m. Potom přičti ${h(q)} m.`,
        litry
          ? `Číslo ${h(p)} má jedno desetinné místo, a proto ho má i součin ${n} · ${h(p)}, pokud nekončí nulou. Při sčítání piš čárku pod čárku.`
          : `Číslo ${h(p)} má dvě desetinná místa, a proto je má i součin ${n} · ${h(p)} (nuly na konci smíš vynechat). Při sčítání piš čárku pod čárku.`,
      ],
      solutionSteps: [`${n} · ${h(p)} = ${fmt(vsechny)}`, `${h(vsechny)} + ${h(q)} = ${fmt(key)}`],
      explanation: litry
        ? `Po ${h(p)} l bylo v každé z ${n} konví, proto se nejdřív násobí: ${n} · ${h(p)} = ${fmt(vsechny)}. Pak se přičte kbelík: ${h(vsechny)} + ${h(q)} = ${fmt(key)}.`
        : `Délku ${h(p)} m má každý z ${n} stejných kusů, proto se nejdřív násobí: ${n} · ${h(p)} = ${fmt(vsechny)}. Pak se přičte poslední kus: ${h(vsechny)} + ${h(q)} = ${fmt(key)}.`,
    },
  );
}

function l2Nakup(): PracticeTask | null {
  const { jm, g } = pick(JMENA);
  const z = pick(KUSOVE);
  const j = pick(JEDNOTLIVE);
  const n = rnd(2, 6);
  const p = cenaHal(z.od, z.do);
  const q = cena(j.od, j.do);
  const vsechny = n * p;
  const key = vsechny + q;
  const kus = `${n} ${plural(n, "", z.few, z.many)}${z.pripona}`;
  const question = `Slovní úloha: ${jm} ${v("koupil", g)} ${kus} po ${kc(p)} Kč a ${j.co} za ${kc(q)} Kč. Kolik ${v("zaplatil", g)} celkem?`;
  return uloha(
    question,
    `${kc(key)} Kč`,
    kandidati(
      [
        { s: p + q, why: `Tady se cena ${kc(p)} Kč nevynásobila počtem ${n}. ${KROK}` },
        { s: vsechny, why: `Tohle je jen cena za ${kus}, chybí ještě ${j.co}. ${OTAZKA}` },
        { s: (p + q) * n, why: `Počtem ${n} se tu násobila i druhá položka za ${kc(q)} Kč, ta je ale jen jedna. ${KROK}` },
        { s: vsechny * 10 + q, why: `Čárka v součinu ${n} · ${kc(p)} je o jedno místo vpravo. ${CARKA_SOUCIN}` },
      ],
      (s) => `${kc(s)} Kč`,
    ),
    {
      hints: [
        `Nejdřív spočítej cenu všech ${z.many}${z.pripona}: ${n} · ${kc(p)} Kč. Potom přičti cenu druhé položky.`,
        `Cena ${kc(p)} Kč má dvě desetinná místa. Vynásob ${n} · ${cis(p)}, jako by tam čárka nebyla, a ve výsledku pak odděl čárkou dvě místa zprava. Odhadni si výsledek se zaokrouhlenými cenami, ať poznáš, jestli je čárka na správném místě.`,
      ],
      solutionSteps: [
        `${n} · ${kc(p)} = ${kc(vsechny)} Kč`,
        `${kc(vsechny)} + ${kc(q)} = ${kc(key)} Kč`,
      ],
      explanation: `Cena ${kc(p)} Kč platí pro jeden kus, proto se nejdřív násobí: ${n} · ${kc(p)} = ${kc(vsechny)} Kč. K tomu se přičte druhá položka: ${kc(vsechny)} + ${kc(q)} = ${kc(key)} Kč.`,
    },
  );
}

// ── L3 — tříkrokové slovní úlohy ──────────────────────────────────────────
const L3 = "Slovní úloha o více krocích:";

function genL3(): PracticeTask | null {
  const r = Math.random();
  if (r < 0.25) return l3Vraceno();
  if (r < 0.5) return l3CenaKusu();
  if (r < 0.75) return l3Baleni();
  return l3Dily();
}

// Zboží na váhu s realistickým rozsahem ceny za 1 kg.
const KG_ZBOZI: { co: string; od: number; do: number }[] = [
  { co: "jablek", od: 25, do: 45 },
  { co: "brambor", od: 15, do: 29 },
  { co: "hrušek", od: 35, do: 59 },
  { co: "mandarinek", od: 29, do: 49 },
  { co: "rajčat", od: 39, do: 79 },
  { co: "švestek", od: 35, do: 65 },
];

function l3Vraceno(): PracticeTask | null {
  const { jm, g } = pick(JMENA);
  const B = pick([200, 500]);
  const mT = pick([5, 8, 12, 15, 20, 25, 30]);
  const { co: zb, od, do: doK } = pick(KG_ZBOZI);
  const u = rnd(od, doK) * 100 + pick([0, 20, 40, 50, 80, 90]);
  if ((mT * u) % 10 !== 0) return null;
  const j = pick(JEDNOTLIVE);
  const q = cena(j.od, j.do);
  const zaKg = (mT * u) / 10;
  const utrata = zaKg + q;
  // V hotovosti se platí jen celé koruny (haléřové mince zmizely v roce 2008,
  // výsledná částka se zaokrouhluje). „Vrátili 139,76 Kč" by dítě právem
  // nebralo vážně, proto útrata musí vyjít na celé koruny.
  if (utrata % 100 !== 0) return null;
  const key = B * 100 - utrata;
  if (key < 500) return null;
  const mu = g === "f" ? "jí" : "mu";
  const m = mT * 10;
  const question = `${L3} ${jm} ${v("zaplatil", g)} bankovkou ${B} Kč nákup: ${h(m)} kg ${zb} po ${kc(u)} Kč za kilogram a ${j.co} za ${kc(q)} Kč. Kolik ${mu} vrátili?`;
  return uloha(
    question,
    `${kc(key)} Kč`,
    kandidati(
      [
        { s: utrata, why: `Tohle je útrata za celý nákup, ne vrácené peníze. Zbývá ji ještě odečíst od bankovky.` },
        { s: B * 100 - (u + q), why: `Cena ${kc(u)} Kč platí za 1 kg, ale kupovalo se ${h(m)} kg. Cenu je potřeba vynásobit hmotností.` },
        { s: B * 100 - zaKg, why: `Od bankovky se odečetla jen cena ${zb}, druhá položka za ${kc(q)} Kč chybí. Útrata je součet obou položek.` },
        { s: B * 100 - (zaKg / 10 + q), why: `Čárka v součinu ${h(m)} · ${kc(u)} je o jedno místo vlevo. ${CARKA_SOUCIN}` },
      ],
      (s) => `${kc(s)} Kč`,
    ),
    {
      hints: [
        `Nejdřív spočítej cenu ${zb}: ${h(m)} · ${kc(u)} Kč. Pak přičti druhou položku a celou útratu odečti od bankovky.`,
        `Součin ${h(m)} · ${kc(u)} má tolik desetinných míst, kolik mají oba činitelé dohromady. Odhadni: vrácené peníze musí být méně než ${B} Kč.`,
      ],
      solutionSteps: [
        `${h(m)} · ${kc(u)} = ${kc(zaKg)} Kč`,
        `${kc(zaKg)} + ${kc(q)} = ${kc(utrata)} Kč`,
        `${B} − ${kc(utrata)} = ${kc(key)} Kč`,
      ],
      explanation: `Vrátí se rozdíl mezi bankovkou a útratou. Útrata se skládá z ceny ${zb} (${h(m)} · ${kc(u)} = ${kc(zaKg)} Kč) a druhé položky za ${kc(q)} Kč, dohromady ${kc(utrata)} Kč. Vráceno: ${B} − ${kc(utrata)} = ${kc(key)} Kč.`,
    },
  );
}

// Objednávané zboží: 4. pád mn. č., 2. pád mn. č. a „jeden kus“ s tvarem slovesa.
const OBJEDNAVKA: { few: string; many: string; jeden: string; stal: string; od: number; do: number }[] = [
  { few: "trička", many: "triček", jeden: "jedno tričko", stal: "stálo", od: 129, do: 349 },
  { few: "knížky", many: "knížek", jeden: "jedna knížka", stal: "stála", od: 149, do: 399 },
  { few: "hrnky", many: "hrnků", jeden: "jeden hrnek", stal: "stál", od: 89, do: 199 },
  { few: "sady pastelek", many: "sad pastelek", jeden: "jedna sada pastelek", stal: "stála", od: 79, do: 189 },
  { few: "deskové hry", many: "deskových her", jeden: "jedna desková hra", stal: "stála", od: 249, do: 599 },
];

function l3CenaKusu(): PracticeTask | null {
  const { jm, g } = pick(JMENA);
  const o = pick(OBJEDNAVKA);
  const n = rnd(2, 5);
  // Nenulové haléře: úloha musí počítat s desetinným číslem.
  const x = rnd(o.od, o.do) * 100 + pick([20, 50, 90]);
  const D = pick([59, 69, 79, 89, 99, 65, 75]) * 100;
  const E = pick([1500, 1990, 2000, 2490, 2500, 3000, 3500]);
  const vsechny = n * x;
  const T = vsechny + D + E;
  const key = x;
  const question = `${L3} ${jm} ${v("objednal", g)} na internetu ${n} ${plural(n, "", o.few, o.many)} a ${v("zaplatil", g)} celkem ${kc(T)} Kč. V částce je dopravné ${kc(D)} Kč a dárkové balení za ${kc(E)} Kč. Kolik ${o.stal} ${o.jeden}?`;
  return uloha(
    question,
    `${kc(key)} Kč`,
    kandidati(
      [
        { s: T - D - E, why: `Tohle je cena všech ${o.many} dohromady. Zbývá ji ještě vydělit počtem ${n}.` },
        { s: (T - D) / n, why: `Od celkové částky se odečetlo jen dopravné, dárkové balení za ${kc(E)} Kč v ní zůstalo.` },
        { s: T / n - D - E, why: `Tady se dělilo dřív, než se odečetlo. Počtem ${n} se dělí jen cena zboží, ne dopravné a balení.` },
        { s: key * 10, why: `Čárka v podílu je o jedno místo vpravo. ${CARKA_PODIL}` },
        { s: key / 10, why: `Čárka v podílu je o jedno místo vlevo. ${CARKA_PODIL}` },
      ],
      (s) => `${kc(s)} Kč`,
    ),
    {
      hints: [
        `Nejdřív od částky ${kc(T)} Kč odečti dopravné i dárkové balení. Teprve zbytek vyděl počtem ${n}.`,
        `Zkouška: cena jednoho kusu krát ${n}, plus ${kc(D)} Kč a ${kc(E)} Kč musí dát přesně ${kc(T)} Kč. Při odčítání piš čárku pod čárku.`,
      ],
      solutionSteps: [
        `${kc(T)} − ${kc(D)} = ${kc(T - D)} Kč`,
        `${kc(T - D)} − ${kc(E)} = ${kc(vsechny)} Kč`,
        `${kc(vsechny)} : ${n} = ${kc(key)} Kč`,
      ],
      explanation: `V částce ${kc(T)} Kč jsou i věci, které se mezi kusy nedělí. Proto se nejdřív odečte dopravné a balení a zbyde cena zboží ${kc(vsechny)} Kč. Tu teprve vydělíme počtem kusů: ${kc(vsechny)} : ${n} = ${kc(key)} Kč.`,
    },
  );
}

// „jiný/různý“ se shoduje s rodem veličiny (jinou hmotnost × jiný objem), proto celé tvary.
const HMOTNOST = { jiny: "jinou hmotnost", ruzny: "různou hmotnost" };
const OBJEM = { jiny: "jiný objem", ruzny: "různý objem" };
const BALENI: { co: string; j: "kg" | "l"; mn: { jiny: string; ruzny: string } }[] = [
  { co: "rýži", j: "kg", mn: HMOTNOST },
  { co: "mouku", j: "kg", mn: HMOTNOST },
  { co: "ovesné vločky", j: "kg", mn: HMOTNOST },
  { co: "jablečnou šťávu", j: "l", mn: OBJEM },
  { co: "mléko", j: "l", mn: OBJEM },
  { co: "pomerančový džus", j: "l", mn: OBJEM },
];

function l3Baleni(): PracticeTask | null {
  const b = pick(BALENI);
  const m1T = pick([2, 4, 5]);
  const m2T = pick([15, 20, 25, 30, 50]);
  const u1 = rnd(30, 90) * 100 + pick([0, 50]);
  const diff = rnd(2, 15) * 100 + pick([0, 0, 50]);
  const u2 = u1 - diff;
  if ((m1T * u1) % 10 !== 0 || (m2T * u2) % 10 !== 0) return null;
  const p1 = (m1T * u1) / 10;
  const p2 = (m2T * u2) / 10;
  const [m1, m2] = [m1T * 10, m2T * 10];
  const key = diff;
  const question = `${L3} Obchod prodává ${b.co} ve dvou baleních. Menší balení ${h(m1)} ${b.j} stojí ${kc(p1)} Kč, větší balení ${h(m2)} ${b.j} stojí ${kc(p2)} Kč. O kolik korun je 1 ${b.j} levnější ve větším balení?`;
  return uloha(
    question,
    `${kc(key)} Kč`,
    kandidati(
      [
        { s: Math.abs(p2 - p1), why: `Tady se porovnaly ceny celých balení. Každé balení má ale ${b.mn.jiny}, porovnávat se musí cena za 1 ${b.j}.` },
        { s: u1, why: `Tohle je cena 1 ${b.j} v menším balení. Zbývá od ní ještě odečíst cenu 1 ${b.j} ve větším balení.` },
        { s: u2, why: `Tohle je cena 1 ${b.j} ve větším balení. Zbývá ji ještě odečíst od ceny 1 ${b.j} v menším balení.` },
        { s: key * 10, why: `Čárka je o jedno místo vpravo. ${CARKA_DES_DELITEL}` },
      ],
      (s) => `${kc(s)} Kč`,
    ),
    {
      hints: [
        `Nejdřív zjisti cenu 1 ${b.j} v každém balení zvlášť: ${kc(p1)} : ${h(m1)} a ${kc(p2)} : ${h(m2)}. Nakonec obě ceny odečti.`,
        `Když dělíš desetinným číslem ${h(m1)}, posuň čárku o jedno místo doprava u dělitele i u dělence. Ceny celých balení nesrovnávej, každé má ${b.mn.jiny}.`,
      ],
      solutionSteps: [
        `${kc(p1)} : ${h(m1)} = ${kc(u1)} Kč za 1 ${b.j}`,
        `${kc(p2)} : ${h(m2)} = ${kc(u2)} Kč za 1 ${b.j}`,
        `${kc(u1)} − ${kc(u2)} = ${kc(key)} Kč`,
      ],
      explanation: `Balení mají ${b.mn.ruzny}, proto se srovnává cena za 1 ${b.j}. Menší balení: ${kc(p1)} : ${h(m1)} = ${kc(u1)} Kč, větší: ${kc(p2)} : ${h(m2)} = ${kc(u2)} Kč. Rozdíl ${kc(u1)} − ${kc(u2)} = ${kc(key)} Kč.`,
    },
  );
}

function l3Dily(): PracticeTask | null {
  const { jm, g } = pick(JMENA);
  const litry = Math.random() < 0.5;
  const k = rnd(2, 4);
  const n = rnd(litry ? 2 : 3, 6);
  const s = litry ? rnd(30, 95) * 10 : rnd(7, 19) * 5;
  const x = litry ? rnd(3, 24) * 25 : rnd(12, 80) * 5;
  const odebrano = k * s;
  const zbytek = n * x;
  const L = zbytek + odebrano;
  const j = litry ? "l" : "m";
  const question = litry
    ? `${L3} V sudu je ${h(L)} l vody. ${jm} z něj ${v("nabral", g)} ${k} ${plural(k, "konev", "konve", "konví")} po ${h(s)} l a zbytek ${v("rozlil", g)} rovným dílem do ${n} ${plural(n, "lahve", "lahví", "lahví")}. Kolik litrů bude v jedné lahvi?`
    : `${L3} Stuha je dlouhá ${h(L)} m. ${jm} z ní ${v("odstřihl", g)} ${k} ${plural(k, "kus", "kusy", "kusů")} po ${h(s)} m a zbytek ${v("rozdělil", g)} na ${phrase(n, "STEJNÝ", "DÍL")}. Kolik metrů měří jeden díl?`;
  const celek = litry ? "vody v sudu" : "délky stuhy";
  const cast = litry ? "nabraná voda" : "odstřižené kusy";
  return uloha(
    question,
    `${h(x)} ${j}`,
    kandidati(
      [
        {
          s: zbytek,
          why: `Tohle je celý zbytek po odebrání. Zbytek je potřeba ještě ${litry ? `rozlít do ${n} ${plural(n, "lahve", "lahví", "lahví")}` : `rozdělit na ${phrase(n, "STEJNÝ", "DÍL")}`}.`,
        },
        {
          s: (L - s) / n,
          why: `Odečetlo se jen jednou ${h(s)} ${j}, ale ${litry ? "nabíralo" : "stříhalo"} se ${k}krát. Nejdřív spočítej ${k} · ${h(s)}.`,
        },
        { s: L / n - odebrano, why: `Tady se dělilo dřív, než se odečetlo. Na ${n} se dělí jen zbytek, ne celé množství.` },
        { s: x * 10, why: `Čárka v podílu je o jedno místo vpravo. ${CARKA_PODIL}` },
        { s: x / 10, why: `Čárka v podílu je o jedno místo vlevo. ${CARKA_PODIL}` },
      ],
      (v2) => `${h(v2)} ${j}`,
    ),
    {
      hints: [
        `Nejdřív spočítej, kolik se odebralo: ${k} · ${h(s)} ${j}. Odečti to od ${celek} a teprve zbytek vyděl číslem ${n}.`,
        `Zkouška: ${litry ? "obsah jedné lahve" : "jeden díl"} krát ${n} plus ${cast} musí dát ${h(L)} ${j}. Při odčítání piš čárku pod čárku.`,
      ],
      solutionSteps: [
        `${k} · ${h(s)} = ${h(odebrano)} ${j}`,
        `${h(L)} − ${h(odebrano)} = ${h(zbytek)} ${j}`,
        `${h(zbytek)} : ${n} = ${h(x)} ${j}`,
      ],
      explanation: `Dělí se jen to, co zbylo. Nejdřív ${k} · ${h(s)} = ${h(odebrano)} ${j}, pak ${h(L)} − ${h(odebrano)} = ${h(zbytek)} ${j} a nakonec ${h(zbytek)} : ${n} = ${h(x)} ${j}.`,
    },
  );
}

// ── Topic ────────────────────────────────────────────────────────────────
export const POCETNI_OPERACE_DESETINNA_KOMPLEXNE: TopicMetadata[] = [
  {
    id: "g6-mat-pocetni-operace-desetinna-komplexne-6",
    rvpNodeId: "g6-matematika-cislo-a-promenna-desetinna-cisla-pocetni-operace-s-desetinnymi-cisly-komplexne",
    displayName: "Počítáme s desetinnými čísly",
    title: "Početní operace s desetinnými čísly - komplexně",
    studentTitle: "Počítáme s desetinnými čísly",
    subject: "matematika",
    category: "Číslo a proměnná",
    topic: "Desetinná čísla",
    briefDescription: "Pořadí operací, závorky a slovní úlohy s desetinnými čísly.",
    keywords: [
      "desetinná čísla", "pořadí operací", "přednost násobení", "závorky",
      "slovní úloha", "nákup", "vrácené peníze", "cena za kilogram", "desetinná čárka",
    ],
    goals: [
      "Spočítat výraz s desetinnými čísly se správným pořadím operací.",
      "Umístit desetinnou čárku správně v každém mezivýsledku.",
      "Sestavit postup víckrokové slovní úlohy a dojít až k tomu, na co se ptá.",
    ],
    boundaries: [
      "Každá úloha má aspoň dvě operace (samostatné násobení a dělení je jiné podtéma).",
      "Bez zlomků, procent, záporných čísel a rovnic.",
      "Výsledky mají nejvýš dvě desetinná místa a dělí se vždy beze zbytku.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Nejdřív závorky, pak násobení a dělení, nakonec sčítání a odčítání. Součin má tolik desetinných míst, kolik mají oba činitelé dohromady.",
      steps: [
        "Najdi závorky a spočítej je jako první.",
        "Potom vyřeš násobení a dělení, teprve nakonec sčítání a odčítání.",
        "U slovní úlohy si napiš, co spočítáš v každém kroku, a zkontroluj, na co se otázka ptá.",
      ],
      commonMistake: "Počítat zleva doprava bez ohledu na přednost násobení nebo zapsat čárku v součinu o místo vedle.",
      example: "4,5 + 2,3 · 4 = 4,5 + 9,2 = 13,7 (ne (4,5 + 2,3) · 4 = 27,2).",
    },
  },
];
