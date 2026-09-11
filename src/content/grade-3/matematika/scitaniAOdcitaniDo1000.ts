import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { doplnVelkou, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (inventura obsahu): všechny úlohy měly stejné dvě
// nápovědy, chybné možnosti byly jen ±1/±10/±100 bez zpětné vazby a postup
// řešení byl jen „a + b = c“. Teď každá chybná možnost vzniká z konkrétní
// typické chyby (ztracený přenos, odčítání „menší od většího“, neubraná
// rozměněná desítka, číslo zapsané o řád vlevo, záměna operace) a postup
// řešení počítá po řádech, včetně zkoušky.
// L1 bez přechodu přes desítku/stovku · L2 s přechodem (přenos, rozměňování)
// · L3 chybějící číslo (obrácená úloha) a dva kroky za sebou.

const RADY = ["Stovky", "Desítky", "Jednotky"];
const cif = (n: number) => [Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10];

function rnd(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

const DOPLNKY = [
  "Čísla si napiš pod sebe, jednotky pod jednotky.",
  "Na konci si výsledek ověř zkouškou opačnou operací.",
];

/** Tři různé chybné možnosti v oboru 0–999, odlišné od klíče (dedup po vygenerování). */
function tri(correct: string, kandidati: Distractor[]): [Distractor, Distractor, Distractor] {
  const seen = new Set([correct]);
  const out: Distractor[] = [];
  for (const k of kandidati) {
    const v = Number(k.value);
    if (seen.has(k.value) || v < 0 || v > 999) continue;
    seen.add(k.value);
    out.push(k);
    if (out.length === 3) return out as [Distractor, Distractor, Distractor];
  }
  throw new Error(`Málo chybných možností pro klíč ${correct}`);
}

function uloha(question: string, answer: number, kandidati: Distractor[], h0: string, h1: string, steps: string[]): PracticeTask {
  const correct = String(answer);
  const d = tri(correct, kandidati);
  const optionFeedback: Record<string, string> = {};
  for (const x of d) optionFeedback[x.value] = x.why;
  return {
    question,
    correctAnswer: correct,
    options: shuffle([correct, ...d.map((x) => x.value)]),
    optionFeedback,
    hints: [h0, doplnVelkou(h0, h1, DOPLNKY)],
    solutionSteps: steps,
  };
}

/** Nápověda nesmí obsahovat klíč jako samostatné číslo (kontrola úniku). */
function unik(t: PracticeTask): boolean {
  const re = new RegExp(`(^|[^\\d.,])${t.correctAnswer}([^\\d.,]|$)`);
  return (t.hints ?? []).some((h) => re.test(h.replace(/[;:!?"'„“()]/g, " ")) || h.includes(`= ${t.correctAnswer}`));
}

function prenosy(a: number, b: number) {
  const A = cif(a), B = cif(b);
  const cu = A[2] + B[2] >= 10;
  const ct = A[1] + B[1] + (cu ? 1 : 0) >= 10;
  return { cu, ct };
}

function rozmenovani(a: number, b: number) {
  const A = cif(a), B = cif(b);
  const bu = A[2] < B[2];
  const bt = A[1] - (bu ? 1 : 0) < B[1];
  return { bu, bt };
}

// ── Postup po řádech ────────────────────────────────────────────────────────

function krokySecti(a: number, b: number): string[] {
  const A = cif(a), B = cif(b);
  const steps: string[] = [];
  let carry = 0;
  for (let p = 2; p >= 0; p--) {
    const bezB = p === 0 && b < 100;
    if (bezB && !carry) { steps.push(`Stovky: ${A[0]} se jen opíšou.`); continue; }
    const s = A[p] + (bezB ? 0 : B[p]) + carry;
    const cleny = [String(A[p]), ...(bezB ? [] : [String(B[p])]), ...(carry ? ["1 přenesená"] : [])];
    let line = `${RADY[p]}: ${cleny.join(" + ")} = ${s}`;
    if (s >= 10 && p > 0) {
      line += ` → píšu ${s - 10}, 1 ${p === 2 ? "desítku" : "stovku"} přenáším.`;
      carry = 1;
    } else {
      line += ".";
      carry = 0;
    }
    steps.push(line);
  }
  steps.push(`Výsledek: ${a} + ${b} = ${a + b}. Zkouška: ${a + b} − ${b} = ${a}.`);
  return steps;
}

function krokyOdecti(a: number, b: number): string[] {
  const A = cif(a), B = cif(b);
  const steps: string[] = [];
  let borrow = 0;
  for (let p = 2; p >= 0; p--) {
    const bezB = p === 0 && b < 100;
    if (bezB && !borrow) { steps.push(`Stovky: ${A[0]} se jen opíšou.`); continue; }
    const top = A[p] - borrow;
    const bot = bezB ? 0 : B[p];
    const horni = borrow ? `${A[p]} − 1 půjčená` : `${A[p]}`;
    const zapis = bezB ? horni : `${horni} − ${bot}`;
    if (top >= bot) {
      steps.push(`${RADY[p]}: ${zapis} = ${top - bot}.`);
      borrow = 0;
    } else {
      steps.push(`${RADY[p]}: ${zapis} nejde, rozměním 1 ${p === 2 ? "desítku" : "stovku"}: ${top + 10} − ${bot} = ${top + 10 - bot}.`);
      borrow = 1;
    }
  }
  steps.push(`Výsledek: ${a} − ${b} = ${a - b}. Zkouška: ${a - b} + ${b} = ${a}.`);
  return steps;
}

// ── Chybové modely ──────────────────────────────────────────────────────────

function chybySecti(a: number, b: number): Distractor[] {
  const A = cif(a), B = cif(b), c = a + b;
  const { cu, ct } = prenosy(a, b);
  const out: Distractor[] = [];
  if (cu || ct) {
    const bezPrenosu = ((A[0] + B[0]) % 10) * 100 + ((A[1] + B[1]) % 10) * 10 + ((A[2] + B[2]) % 10);
    out.push({
      value: String(bezPrenosu),
      why: `Ztratil se přenos: ${cu ? `jednotky ${A[2]} + ${B[2]}` : `desítky ${A[1]} + ${B[1]}`} dají víc než 9, a tak se 1 musí přičíst k vyššímu řádu.`,
    });
  }
  if (cu) out.push({ value: String(c - 10), why: `Jednotky ${A[2]} + ${B[2]} dají víc než 9. Přenesená desítka se ale nepřičetla k desítkám.` });
  if (ct) out.push({ value: String(c - 100), why: "Desítky dají víc než 9. Přenesená stovka se ale nepřičetla ke stovkám." });
  if (b < 100) out.push({ value: String(a + b * 10), why: `Číslo ${b} je zapsané o řád vlevo. Jeho jednotky patří pod jednotky čísla ${a}, ne pod desítky.` });
  if (a > b) out.push({ value: String(a - b), why: `Tohle je rozdíl ${a} − ${b}. Úloha chce součet.` });
  out.push(
    { value: String(c + 10), why: cu ? "Přenesená desítka se přičetla dvakrát." : `Chyba v desítkách: sečti znovu ${A[1]} + ${B[1]}.` },
    { value: String(c + 100), why: ct ? "Přenesená stovka se přičetla dvakrát." : `Chyba ve stovkách: sečti znovu ${A[0]} + ${B[0]}.` },
    { value: String(c - 1), why: `Chyba v jednotkách: sečti znovu ${A[2]} + ${B[2]}.` },
    { value: String(c - 10), why: `Chyba v desítkách: sečti znovu ${A[1]} + ${B[1]}.` },
    { value: String(c - 100), why: `Chyba ve stovkách: sečti znovu ${A[0]} + ${B[0]}.` },
    { value: String(c + 1), why: `Chyba v jednotkách: sečti znovu ${A[2]} + ${B[2]}.` },
  );
  return out;
}

function chybyOdecti(a: number, b: number): Distractor[] {
  const A = cif(a), B = cif(b), r = a - b;
  const { bu, bt } = rozmenovani(a, b);
  const out: Distractor[] = [];
  if (bu || bt) {
    const obracene = Math.abs(A[0] - B[0]) * 100 + Math.abs(A[1] - B[1]) * 10 + Math.abs(A[2] - B[2]);
    out.push({
      value: String(obracene),
      why: bu
        ? `V jednotkách ${A[2]} − ${B[2]} nejde, a tak se odečetlo obráceně ${B[2]} − ${A[2]}. Správně se rozmění 1 desítka.`
        : "V desítkách se odečetlo obráceně, menší číslice od větší. Správně se rozmění 1 stovka.",
    });
  }
  if (bu) out.push({ value: String(r + 10), why: "Desítka se rozměnila na jednotky, ale v desítkách se o ni neubralo." });
  if (bt) out.push({ value: String(r + 100), why: "Stovka se rozměnila na desítky, ale ve stovkách se o ni neubralo." });
  if (b < 100) out.push({ value: String(a - b * 10), why: `Číslo ${b} je zapsané o řád vlevo. Jeho jednotky patří pod jednotky čísla ${a}, ne pod desítky.` });
  out.push({ value: String(a + b), why: `Tohle je součet ${a} + ${b}. Úloha chce rozdíl.` });
  out.push(
    { value: String(r - 10), why: bu ? "Rozměněná desítka se ubrala dvakrát." : `Chyba v desítkách: odečti znovu ${A[1]} − ${B[1]}.` },
    { value: String(r - 100), why: bt ? "Rozměněná stovka se ubrala dvakrát." : `Chyba ve stovkách: odečti znovu ${A[0]} − ${B[0]}.` },
    { value: String(r + 1), why: `Chyba v jednotkách: odečti znovu ${A[2]} − ${B[2]}.` },
    { value: String(r + 10), why: `Chyba v desítkách: odečti znovu ${A[1]} − ${B[1]}.` },
    { value: String(r + 100), why: `Chyba ve stovkách: odečti znovu ${A[0]} − ${B[0]}.` },
    { value: String(r - 1), why: `Chyba v jednotkách: odečti znovu ${A[2]} − ${B[2]}.` },
  );
  return out;
}

// ── L1: bez přechodu ────────────────────────────────────────────────────────

function scitaniL1(): PracticeTask {
  for (;;) {
    const a = rnd(101, 899);
    const b = Math.random() < 0.4 ? rnd(11, 99) : rnd(101, 899);
    const { cu, ct } = prenosy(a, b);
    if (cu || ct || a + b > 999 || b % 10 === 0) continue;
    const A = cif(a), B = cif(b);
    return uloha(`${a} + ${b} = ?`, a + b, chybySecti(a, b),
      `U příkladu ${a} + ${b} začni jednotkami: kolik je ${A[2]} + ${B[2]}?`,
      `Sčítej každý řád zvlášť: jednotky ${A[2]} + ${B[2]}, desítky ${A[1]} + ${B[1]}${b >= 100 ? ` a stovky ${A[0]} + ${B[0]}` : ` a stovky ${A[0]} jen opiš`}. Žádný řád tady nepřesáhne 9, takže nic nepřenášíš.`,
      krokySecti(a, b));
  }
}

function odcitaniL1(): PracticeTask {
  for (;;) {
    const a = rnd(201, 999);
    const b = Math.random() < 0.4 ? rnd(11, 99) : rnd(101, 899);
    const { bu, bt } = rozmenovani(a, b);
    if (bu || bt || a - b < 100 || b % 10 === 0 || a < b) continue;
    const A = cif(a), B = cif(b);
    return uloha(`${a} − ${b} = ?`, a - b, chybyOdecti(a, b),
      `U příkladu ${a} − ${b} začni jednotkami: kolik je ${A[2]} − ${B[2]}?`,
      `Odečítej každý řád zvlášť: jednotky ${A[2]} − ${B[2]}, desítky ${A[1]} − ${B[1]}${b >= 100 ? ` a stovky ${A[0]} − ${B[0]}` : ` a stovky ${A[0]} jen opiš`}. Nahoře je v každém řádu větší číslice, takže nic nerozměňuješ.`,
      krokyOdecti(a, b));
  }
}

// ── L2: s přechodem ─────────────────────────────────────────────────────────

function scitaniL2(): PracticeTask {
  for (;;) {
    const a = rnd(101, 899);
    const b = Math.random() < 0.3 ? rnd(11, 99) : rnd(101, 899);
    const { cu, ct } = prenosy(a, b);
    if (!(cu || ct) || a + b > 999) continue;
    const A = cif(a), B = cif(b);
    const kde = cu && ct ? "z jednotek do desítek i z desítek do stovek" : cu ? "z jednotek do desítek" : "z desítek do stovek";
    return uloha(`${a} + ${b} = ?`, a + b, chybySecti(a, b),
      `U příkladu ${a} + ${b} začni jednotkami: ${A[2]} + ${B[2]}. Vejde se součet do jedné číslice?`,
      `Napiš ${a} a ${b} pod sebe, jednotky pod jednotky. Když součet v řádu přesáhne 9, zapiš jen jeho poslední číslici a 1 přenes do vyššího řádu. Tady přenášíš ${kde}.`,
      krokySecti(a, b));
  }
}

function odcitaniL2(): PracticeTask {
  for (;;) {
    const a = rnd(201, 999);
    const b = Math.random() < 0.3 ? rnd(11, 99) : rnd(101, 899);
    const { bu, bt } = rozmenovani(a, b);
    if (!(bu || bt) || a - b < 100) continue;
    const A = cif(a), B = cif(b);
    const kde = bu && bt ? "desítku i stovku" : bu ? "desítku" : "stovku";
    return uloha(`${a} − ${b} = ?`, a - b, chybyOdecti(a, b),
      `U příkladu ${a} − ${b} začni jednotkami: dá se od ${A[2]} odečíst ${B[2]}?`,
      `Napiš ${a} a ${b} pod sebe. Když je nahoře menší číslice než dole, rozměň 1 z vyššího řádu na 10 a nezapomeň ji tam pak ubrat. Tady rozměňuješ ${kde}.`,
      krokyOdecti(a, b));
  }
}

// ── L3: obrácené úlohy a dva kroky ──────────────────────────────────────────

function chybiScitanec(): PracticeTask {
  for (;;) {
    const a = rnd(101, 699), x = rnd(101, 699);
    const c = a + x;
    const { cu, ct } = prenosy(a, x);
    if (!(cu || ct) || c > 999) continue;
    return uloha(`Které číslo chybí? ${a} + ___ = ${c}`, x, [
      { value: String(c + a), why: `Tohle je součet ${c} + ${a}. Chybějící sčítanec se najde odčítáním.` },
      ...chybyOdecti(c, a),
    ],
    `Kolik chybí od ${a} do ${c}?`,
    `Chybějící sčítanec najdeš odčítáním: od výsledku ${c} odečti známé číslo ${a}. Počítej po řádech od jednotek a hlídej rozměňování.`,
    [`Chybějící sčítanec = výsledek − známý sčítanec, tedy ${c} − ${a}.`, ...krokyOdecti(c, a)]);
  }
}

function chybiMensenec(): PracticeTask {
  for (;;) {
    const r = rnd(101, 699), b = rnd(101, 699);
    const x = r + b;
    const { cu, ct } = prenosy(r, b);
    if (!(cu || ct) || x > 999) continue;
    return uloha(`Které číslo chybí? ___ − ${b} = ${r}`, x, [
      { value: String(Math.abs(r - b)), why: `Tohle je rozdíl čísel ${r} a ${b}. Hledané číslo musí být větší než ${r}, protože se od něj odčítalo — sečti.` },
      ...chybySecti(r, b),
    ],
    `Od kterého čísla musíš odečíst ${b}, aby zbylo ${r}?`,
    `Hledané číslo je větší než ${r}, protože odečtením ${b} se zmenšilo. Najdeš ho sčítáním ${r} + ${b}. Počítej po řádech a hlídej přenos.`,
    [`Když od hledaného čísla odečteme ${b} a zbude ${r}, je hledané číslo ${r} + ${b}.`, ...krokySecti(r, b)]);
  }
}

function chybiMensitel(): PracticeTask {
  for (;;) {
    const a = rnd(301, 999), r = rnd(101, 699);
    const x = a - r;
    if (x < 101) continue;
    const { bu, bt } = rozmenovani(a, r);
    if (!(bu || bt)) continue;
    return uloha(`Které číslo chybí? ${a} − ___ = ${r}`, x, [
      { value: String(a + r), why: `Tohle je součet ${a} + ${r}. Odečítané číslo najdeš odčítáním ${a} − ${r}.` },
      ...chybyOdecti(a, r),
    ],
    `Kolik musíš odečíst od ${a}, aby zbylo ${r}?`,
    `Odečítané číslo je rozdíl mezi ${a} a ${r}. Počítej ${a} − ${r} po řádech od jednotek a hlídej rozměňování.`,
    [`Odečítané číslo = ${a} − ${r}, protože ${a} − (odečítané číslo) má dát ${r}.`, ...krokyOdecti(a, r)]);
  }
}

function dvaKroky(): PracticeTask {
  for (;;) {
    const a = rnd(101, 599), b = rnd(101, 399), c = rnd(101, 499);
    const s = a + b, r = s - c;
    if (s > 999 || r < 101) continue;
    const { cu, ct } = prenosy(a, b);
    const { bu, bt } = rozmenovani(s, c);
    if (!(cu || ct) || !(bu || bt)) continue;
    const A = cif(a), B = cif(b);
    const bezPrenosu = ((A[0] + B[0]) % 10) * 100 + ((A[1] + B[1]) % 10) * 10 + ((A[2] + B[2]) % 10);
    return uloha(`${a} + ${b} − ${c} = ?`, r, [
      { value: String(s + c), why: `Poslední číslo se přičetlo. Znaménko minus znamená ${c} odečíst.` },
      { value: String(bezPrenosu - c), why: `V prvním kroku se ztratil přenos, a tak vyšel špatný mezivýsledek. ${a} + ${b} počítej znovu po řádech.` },
      { value: String(s), why: `Tohle je jen mezivýsledek ${a} + ${b}. Ještě od něj musíš odečíst ${c}.` },
      ...chybyOdecti(s, c),
    ],
    `Počítej postupně zleva: nejdřív ${a} + ${b}, potom odečti ${c}.`,
    `Úloha má dva kroky. Nejdřív sečti ${a} a ${b} po řádech a hlídej přenos. Mezivýsledek si zapiš a pak od něj odečti ${c} — hlídej rozměňování.`,
    [`1. krok: ${a} + ${b} = ${s}.`, `2. krok: ${s} − ${c} = ${r}.`, `Zkouška: ${r} + ${c} = ${s} a ${s} − ${b} = ${a}.`]);
  }
}

// ── Generátor ───────────────────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  const typy = level === 1
    ? [scitaniL1, odcitaniL1]
    : level === 2
      ? [scitaniL2, odcitaniL2]
      : [chybiScitanec, chybiMensenec, chybiMensitel, dvaKroky];
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 24; i++) {
    let t = typy[i % typy.length]();
    while (unik(t)) t = typy[i % typy.length]();
    tasks.push(t);
  }
  return shuffle(tasks);
}

export const SCITANIAODCITANIDO1000: TopicMetadata[] = [
  {
    id: "g3-mat-scitani-odcitani-1000",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-ciselny-obor-0-1000-scitani-a-odcitani-do-1000-pametne-i-pisemne",
    title: "Sčítání a odčítání do 1000 (pamětné i písemné)",
    studentTitle: "Počítám do 1000",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–1000",
    briefDescription: "Sečteš a odečteš čísla až do tisíce zpaměti i písemně.",
    keywords: ["sčítání", "odčítání", "do 1000", "pamětný počet", "písemný počet", "přechod přes stovku"],
    goals: [
      "Sčítat čísla do 1000 pamětně i písemně.",
      "Odčítat čísla do 1000 pamětně i písemně.",
      "Zvládnout přechod přes desítku a stovku.",
    ],
    boundaries: ["Čísla do 1000.", "Nezahrnuje násobení ani dělení."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Při sčítání začni od jednotek, pak desítky, pak stovky. Dávej pozor na přechod přes 10 nebo 100.",
      steps: [
        "Zapiš čísla pod sebe (jednotky pod jednotky, desítky pod desítky).",
        "Sčítej/odčítej jednotky.",
        "Sčítej/odčítej desítky (nezapomeň na přenos z jednotek).",
        "Sčítej/odčítej stovky.",
      ],
      commonMistake: "Zapomenutí na přenos: 358 + 64 = 422 (ne 3112).",
      example: "247 + 135: jednotky 7+5=12 (zapíšeme 2, přeneseme 1), desítky 4+3+1=8, stovky 2+1=3 → 382.",
    },
  },
];
