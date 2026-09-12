import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad, form, agree } from "@/lib/czechGrammar";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Systémové dluhy Balík 1C (2026-07-10): parametrizace z rozsahu čísel místo
 * pevného seznamu 24 vět (CONTENT_AUTHORING.md 5.3). `_level` byl dřív úplně
 * ignorován (žádná gradace). Teď disjunktní podle dovednosti:
 *
 *   L1 — součet dvou hodnot z tabulky, čísla do 20.
 *   L2 — chybějící hodnota (dáno celkem + 1 část, dopočítej druhou), čísla do 50.
 *   L3 — tabulka se 3 řádky (součet tří hodnot) NEBO porovnání "o kolik víc"
 *        (dvoukrokové: najdi rozdíl), čísla do 100.
 *
 * Doplněno 2026-09-11 (inventura obsahu): distraktory z chybového modelu
 * (odečetl místo sečetl, vynechal řádek, obrácené jednotky, desítka navíc…)
 * se zpětnou vazbou u každé chybné možnosti, druhá nápověda s postupem pro
 * konkrétní čísla a malá nápověda unikátní i mezi kontexty (nese podstatné jméno).
 */

/** Chybná možnost = konkrétní typická chyba + vysvětlení, proč to tak není. */
interface Cand {
  value: number;
  why: string;
}

/** Nouzové distraktory, kdyby se chybový model po dosazení překryl s klíčem. */
function fallbacks(correct: number): Cand[] {
  return [
    { value: correct + 2, why: "O dvě víc — přepočítej příklad ještě jednou po krocích." },
    { value: correct - 2, why: "O dvě méně — přepočítej příklad ještě jednou po krocích." },
    { value: correct + 5, why: "O pět víc — zkontroluj, jestli jsi správně přečetl obě čísla." },
  ];
}

/** 4 různé možnosti, právě 1 správná; dedup až nad konkrétními čísly. */
function makeOptions(correct: number, cands: Cand[]): { options: string[]; optionFeedback: Record<string, string> } {
  const picked: Cand[] = [];
  for (const c of [...cands, ...fallbacks(correct)]) {
    if (c.value < 1 || c.value === correct || picked.some((p) => p.value === c.value)) continue;
    picked.push(c);
    if (picked.length === 3) break;
  }
  const optionFeedback: Record<string, string> = {};
  for (const p of picked) optionFeedback[String(p.value)] = p.why;
  return { options: shuffle([String(correct), ...picked.map((p) => String(p.value))]), optionFeedback };
}

/** Obsahuje text číslo `n` jako samostatné číslo (ne jako část většího)? */
function mentions(text: string, n: number): boolean {
  return new RegExp(`(^|\\D)${n}(\\D|$)`).test(text);
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// ── L1 — součet dvou hodnot ──────────────────────────────────────────────────

/**
 * Šablony vět s dvěma zástupnými značkami:
 *   `{V}` — přísudek, dosadí `agree()` podle počtu a rodu
 *   `{N}` — číslo se substantivem, dosadí `pad()`
 *
 * `verb` je vždy tvar ve **středním rodě jednotného čísla** („bylo", „stálo",
 * „přijelo"). Dřív bylo sloveso natvrdo v textu, takže při počtu 2–4 vznikaly
 * věty jako **„Ve třídě bylo 3 žáci"** místo „Ve třídě byli 3 žáci". Počet je
 * v rozsahu 2–12, špatně tedy byla zhruba čtvrtina úloh.
 *
 * Šablona bez `{V}` je záměr: „přidali jsme ještě 3 kostky" má podmět „my",
 * takže se sloveso s číslovkou neshoduje a měnit se nesmí.
 */
const L1_CONTEXTS: {
  tpl1: string;
  verb1: string;
  tpl2: string;
  verb2?: string;
  noun: string;
}[] = [
  { tpl1: "V pondělí {V} {N}", verb1: "bylo", tpl2: "v úterý {N}", noun: "JABLKO" },
  { tpl1: "Ve třídě {V} {N}", verb1: "bylo", tpl2: "ve vedlejší třídě {V} {N}", verb2: "bylo", noun: "ŽÁK" },
  { tpl1: "Na parkovišti {V} {N}", verb1: "stálo", tpl2: "{V} ještě {N}", verb2: "přijelo", noun: "AUTO" },
  { tpl1: "V krabici {V} {N}", verb1: "bylo", tpl2: "přidali jsme ještě {N}", noun: "KOSTKA" },
  { tpl1: "V pytlíku {V} {N}", verb1: "bylo", tpl2: "dokoupili jsme ještě {N}", noun: "KULIČKA" },
];

/** Dosadí do šablony přísudek ve správném tvaru a číslo se substantivem. */
function fillTemplate(tpl: string, n: number, noun: string, verb?: string): string {
  return tpl.replace("{V}", verb ? agree(n, noun, verb) : "").replace("{N}", pad(n, noun));
}

function makeL1Task(): PracticeTask {
  const ctx = L1_CONTEXTS[randInt(0, L1_CONTEXTS.length - 1)];
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  const correct = a + b;
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const part1 = fillTemplate(ctx.tpl1, a, ctx.noun, ctx.verb1);
  const part2 = fillTemplate(ctx.tpl2, b, ctx.noun, ctx.verb2);
  const question = `${part1}, ${part2}. Kolik ${form(5, ctx.noun)} bylo celkem?`;
  const hint2 = a === b
    ? `Obě čísla jsou stejná. Sečti ${a} a ještě jednou ${a} — je to jako vzít ${a} dvakrát.`
    : big < 10 && correct > 10
      ? `Začni u většího čísla ${big}. Nejdřív ho doplň do deseti (přičti ${10 - big}), pak přičti, co ti z čísla ${small} zbylo.`
      : `Začni u většího čísla ${big} a připočítej k němu ${small}, klidně po jedné na prstech.`;
  const cands: Cand[] = [
    ...(a !== b ? [{ value: big - small, why: `Odečetl jsi ${big} − ${small}. Slovo „celkem“ znamená, že obě čísla sečteš.` }] : []),
    { value: correct + 1, why: "O jednu víc — při počítání po jedné jsi započítal i číslo, od kterého jsi začínal." },
    { value: correct - 1, why: "O jednu méně — při počítání po jedné ti jeden krok vypadl." },
    ...(big < 10 && correct > 10
      ? [{ value: correct + 10, why: "O deset víc — při přechodu přes desítku jsi přidal desítku navíc." }]
      : []),
  ];
  return {
    question,
    correctAnswer: String(correct),
    ...makeOptions(correct, cands),
    hints: [`Kolik ${form(5, ctx.noun)} je dohromady ${a} a ${b}? Spočítej ${a} + ${b}.`, hint2],
    solutionSteps: ["Slovo „celkem“ znamená, že obě části sečteš.", `${a} + ${b} = ${correct}.`],
  };
}

// ── L2 — chybějící hodnota (celkem − část = druhá část) ─────────────────────

interface L2Category {
  totalNoun: string;
  part1: string;
  part2: string;
}

const L2_CATEGORIES: L2Category[] = [
  { totalNoun: "KULIČKA", part1: "Modrých", part2: "červených" },
  { totalNoun: "ŽÁK", part1: "Kluků", part2: "dívek" },
  { totalNoun: "AUTO", part1: "Osobních", part2: "nákladních" },
  { totalNoun: "KRABICE", part1: "Velkých", part2: "malých" },
];

function makeL2Task(): PracticeTask {
  const cat = L2_CATEGORIES[randInt(0, L2_CATEGORIES.length - 1)];
  const total = randInt(20, 50);
  const part = randInt(5, total - 5);
  const correct = total - part;
  const question = `Celkem je ${pad(total, cat.totalNoun)}. ${cat.part1} je ${part}. Kolik je ${cat.part2}?`;

  const tt = Math.floor(total / 10);
  const to = total % 10;
  const pt = Math.floor(part / 10);
  const po = part % 10;
  const borrow = po > to;

  // Velká nápověda: odčítání po částech pro tato konkrétní čísla, bez výsledku.
  let hint2 = pt > 0 && po > 0
    ? `Odčítej po částech: od ${total} nejdřív uber desítky (${pt * 10}), potom jednotky (${po}). Kontrola: výsledek a ${part} musí dát dohromady ${total}.`
    : pt > 0
      ? `Od ${total} uber ${part} — to jsou celé desítky, takže se změní jen desítky a jednotky zůstanou stejné.`
      : `Od ${total} odečti ${part}: nejdřív uber tolik, abys došel na celou desítku, a pak ještě zbytek.`;
  if (mentions(hint2, correct)) {
    hint2 = `Zkus to přičítáním: kolik musíš k číslu ${part} přidat, abys došel na ${total}? Přidávej nejdřív po desítkách, pak po jednotkách.`;
  }

  const cands: Cand[] = [
    { value: total + part, why: `Sečetl jsi ${total} + ${part}. Celek už znáš, hledáš jeho druhou část — proto odečítáš.` },
    ...(borrow
      ? [
          { value: (tt - pt) * 10 + (po - to), why: `V jednotkách jsi odečítal obráceně (${po} − ${to}). Když jednotek nestačí, musíš si půjčit desítku.` },
          { value: correct + 10, why: "O deset víc — při přechodu přes desítku jsi zapomněl ubrat půjčenou desítku." },
        ]
      : []),
    { value: correct + 1, why: "O jednu víc — zkontroluj odčítání jednotek." },
    { value: correct - 1, why: "O jednu méně — zkontroluj odčítání jednotek." },
    { value: correct - 10, why: "O deset méně — spletl ses v desítkách, ubral jsi jednu navíc." },
  ];
  return {
    question,
    correctAnswer: String(correct),
    ...makeOptions(correct, cands),
    hints: [`Celkem ${total}, ${cat.part1.toLowerCase()} ${part}. Odečti: ${total} − ${part} = ?`, hint2],
    solutionSteps: [
      "Celek se skládá ze dvou částí. Když jednu znáš, druhou najdeš odečtením od celku.",
      `${total} − ${part} = ${correct}.`,
    ],
  };
}

// ── L3 — tabulka o 3 řádcích (součet) NEBO rozdíl ("o kolik víc") ───────────

const L3_TABLE_NOUNS = ["ŽÁK", "AUTO", "JABLKO", "KULIČKA"];
const L3_DAYS = ["pondělí", "úterý", "středa"];

function makeL3SumTask(): PracticeTask {
  const noun = L3_TABLE_NOUNS[randInt(0, L3_TABLE_NOUNS.length - 1)];
  const a = randInt(5, 30);
  const b = randInt(5, 30);
  const c = randInt(5, 30);
  const correct = a + b + c;
  const question = `V tabulce: ${L3_DAYS[0]} ${a}, ${L3_DAYS[1]} ${b}, ${L3_DAYS[2]} ${c} ${form(5, noun)}. Kolik jich bylo celkem?`;
  const cands: Cand[] = [
    { value: a + b, why: `Sečetl jsi jen pondělí a úterý. Zapomněl jsi přičíst ještě středu (${c}).` },
    {
      value: correct - 10,
      why: (a % 10) + (b % 10) + (c % 10) >= 10
        ? "O deset méně — jednotky dohromady přešly přes desítku a tu jsi zapomněl přičíst."
        : "O deset méně — při sčítání desítek ti jedna desítka vypadla.",
    },
    { value: b + c, why: `Vynechal jsi pondělí (${a}). Sečíst musíš všechny tři dny.` },
    { value: correct + 10, why: "O deset víc — při sčítání desítek sis přidal jednu navíc." },
    { value: correct + 1, why: "O jednu víc — zkontroluj sčítání jednotek." },
  ];
  return {
    question,
    correctAnswer: String(correct),
    ...makeOptions(correct, cands),
    hints: [
      `Kolik ${form(5, noun)} je v tabulce za všechny tři dny? Sečti ${a} + ${b} + ${c}.`,
      `Sčítej postupně: nejdřív ${a} + ${b}, k tomu pak přičti ${c}. Pomůže sčítat zvlášť desítky a zvlášť jednotky. Nezapomeň na žádný den.`,
    ],
    solutionSteps: [
      `Nejdřív sečti první dva dny: ${a} + ${b} = ${a + b}.`,
      `Pak přičti třetí den: ${a + b} + ${c} = ${correct}.`,
    ],
  };
}

const L3_NAMES: [string, string][] = [
  ["Jan", "Eva"],
  ["Petr", "Tereza"],
  ["Filip", "Karolína"],
  ["Adam", "Barbora"],
];

function makeL3DiffTask(): PracticeTask {
  const [name1, name2] = L3_NAMES[randInt(0, L3_NAMES.length - 1)];
  const p1 = randInt(10, 60);
  const p2 = p1 + randInt(3, 30);
  const correct = p2 - p1;
  const borrow = p1 % 10 > p2 % 10;
  const question = `${name1} má ${pad(p1, "BOD")}, ${name2} má ${pad(p2, "BOD")}. O kolik ${form(5, "BOD")} má ${name2} víc?`;
  const cands: Cand[] = [
    { value: p1 + p2, why: "Sečetl jsi body obou dětí. Otázka „o kolik víc“ se ptá na rozdíl, proto odečítáš." },
    { value: p2, why: `To je, kolik bodů má ${name2} celkem. Ptáme se, o kolik má víc než ${name1}.` },
    ...(borrow ? [{ value: correct + 10, why: "O deset víc — při odčítání přes desítku jsi zapomněl ubrat půjčenou desítku." }] : []),
    { value: correct + 1, why: "O jednu víc — zkontroluj odčítání jednotek." },
    { value: correct - 1, why: "O jednu méně — zkontroluj odčítání jednotek." },
  ];
  return {
    question,
    correctAnswer: String(correct),
    ...makeOptions(correct, cands),
    hints: [
      `Odečti: ${p2} − ${p1} = ? Tolik bodů má ${name2} navíc.`,
      `Přičítej od menšího čísla: začni u ${p1} a přidávej, dokud nedojdeš na ${p2} — nejdřív po desítkách, pak po jednotkách. Co jsi přidal, to je rozdíl.`,
    ],
    solutionSteps: [
      "Otázka „o kolik víc“ se ptá na rozdíl, proto odečítáš menší číslo od většího.",
      `${p2} − ${p1} = ${correct}, takže ${name2} má o ${pad(correct, "BOD")} víc než ${name1}.`,
    ],
  };
}

/**
 * Losované úlohy se musí lišit i uvnitř jedné úrovně: sezení bere úlohy
 * z tohoto seznamu, takže dvě stejné věty v něm znamenají, že dítě může
 * dostat tutéž úlohu dvakrát za sebou. (Kontrola 2026-09-12 našla v L1
 * dvakrát „V pondělí byla 2 jablka, v úterý 4 jablka.“) Pooly mají 90+
 * kombinací, takže na 20 různých vět stačí pár pokusů navíc.
 */
function distinct(make: () => PracticeTask, count: number): PracticeTask[] {
  const out: PracticeTask[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < count * 25 && out.length < count; i++) {
    const task = make();
    if (seen.has(task.question)) continue;
    seen.add(task.question);
    out.push(task);
  }
  return out;
}

function gen(level: number): PracticeTask[] {
  const count = 20;
  if (level === 1) return distinct(makeL1Task, count);
  if (level === 2) return distinct(makeL2Task, count);
  return distinct(() => (Math.random() < 0.5 ? makeL3SumTask() : makeL3DiffTask()), count);
}

export const TABULKYAJEDNODUCHASHEMA: TopicMetadata[] = [
  {
    id: "g2-mat-tabulky",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-tabulky-a-jednoducha-schemata",
    title: "Tabulky a jednoduchá schémata",
    studentTitle: "Kolik dohromady?",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Přečteš data z tabulky a spočítáš výsledek.",
    keywords: ["tabulka", "schéma", "data", "čtení tabulky", "součet"],
    goals: [
      "Přečíst hodnoty z jednoduché tabulky.",
      "Sečíst nebo odečíst hodnoty z tabulky.",
      "Najít chybějící hodnotu v tabulce.",
    ],
    boundaries: ["Pouze 2–3 řádky.", "Čísla do 100."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Podle otázky poznáš, co počítat: „celkem“ a „dohromady“ znamená sčítat všechny hodnoty, „kolik zbývá“ a „o kolik víc“ znamená odečítat.",
      steps: [
        "Přečti všechna čísla v tabulce.",
        "Urči, zda sčítáš nebo hledáš rozdíl.",
        "Spočítej.",
      ],
      commonMistake: "Přehlédnutí jedné hodnoty — pročti tabulku znovu.",
      example: "Pondělí: 3, Úterý: 5. Celkem: 3 + 5 = 8.",
    },
  },
];
