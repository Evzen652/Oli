import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[] }[] = [
  // Rod
  { q: "Jaký rod má slovo 'pes'?", a: "Mužský (ten pes)", opts: ["Mužský (ten pes)", "Ženský (ta pes)", "Střední (to pes)", "Neurčitý"] },
  { q: "Jaký rod má slovo 'kočka'?", a: "Ženský (ta kočka)", opts: ["Ženský (ta kočka)", "Mužský (ten kočka)", "Střední (to kočka)", "Neurčitý"] },
  { q: "Jaký rod má slovo 'okno'?", a: "Střední (to okno)", opts: ["Střední (to okno)", "Mužský (ten okno)", "Ženský (ta okno)", "Neurčitý"] },
  { q: "Jak poznáme rod podstatného jména?", a: "Přidáme 'ten/ta/to' před slovo", opts: ["Přidáme 'ten/ta/to' před slovo", "Podíváme se na délku slova", "Přidáme 'velký/velká/velké'", "Spočítáme písmena"] },
  { q: "Slovo 'dívka' je rodu:", a: "Ženského (ta dívka)", opts: ["Ženského (ta dívka)", "Mužského (ten dívka)", "Středního (to dívka)", "Neurčitého"] },
  { q: "Slovo 'auto' je rodu:", a: "Středního (to auto)", opts: ["Středního (to auto)", "Mužského (ten auto)", "Ženského (ta auto)", "Neurčitého"] },
  // Číslo
  { q: "Slovo 'stromy' je v čísle:", a: "Množném (množné číslo = více věcí)", opts: ["Množném (množné číslo = více věcí)", "Jednotném (jedno)", "Středním", "Neurčitém"] },
  { q: "Slovo 'strom' je v čísle:", a: "Jednotném (jeden strom)", opts: ["Jednotném (jeden strom)", "Množném (více stromů)", "Středním", "Neurčitém"] },
  { q: "Jak tvoříme množné číslo od 'pes'?", a: "psi / psy", opts: ["psi / psy", "pesy", "pesové", "pesy"] },
  { q: "Jak tvoříme množné číslo od 'dívka'?", a: "dívky", opts: ["dívky", "dívki", "dívkové", "dívkám"] },
  // Pád
  { q: "Otázka 'Kdo? Co?' patří k pádu:", a: "1. pád (nominativ)", opts: ["1. pád (nominativ)", "2. pád (genitiv)", "3. pád (dativ)", "4. pád (akuzativ)"] },
  { q: "Otázka 'Koho? Co?' patří k pádu:", a: "4. pád (akuzativ)", opts: ["4. pád (akuzativ)", "1. pád (nominativ)", "2. pád (genitiv)", "3. pád (dativ)"] },
  { q: "Otázka 'Komu? Čemu?' patří k pádu:", a: "3. pád (dativ)", opts: ["3. pád (dativ)", "1. pád", "2. pád", "4. pád"] },
  { q: "Otázka 'Koho? Čeho?' patří k pádu:", a: "2. pád (genitiv)", opts: ["2. pád (genitiv)", "1. pád", "3. pád", "4. pád"] },
  { q: "Ve větě 'Dám knihu bratříčkovi.' je slovo 'bratříčkovi' v pádu:", a: "3. pád (komu? — dativ)", opts: ["3. pád (komu? — dativ)", "1. pád (kdo?)", "2. pád (koho?)", "4. pád (koho?)"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 8) : level === 2 ? POOL.slice(0, 12) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Rod: ten = mužský, ta = ženský, to = střední.", "Pád poznáme otázkou: kdo/co = 1. pád; koho/co = 4. pád; koho/čeho = 2. pád."],
    solutionSteps: ["Ptám se na slovo správnou otázkou.", `Odpověď: ${a}`],
  }));
}

export const PODSTATNAROD: TopicMetadata[] = [
  {
    id: "g3-cjl-podstatna-jmena-rod-cislo-pad",
    rvpNodeId: "g3-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-rod-cislo-pad-uvod",
    title: "Podstatná jména - rod, číslo, pád (úvod)",
    studentTitle: "Rod, číslo, pád",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Určíš rod, číslo a pád podstatného jména.",
    keywords: ["podstatné jméno", "rod", "číslo", "pád", "mužský ženský střední", "jednotné množné"],
    goals: ["Určit rod podstatného jména (ten/ta/to).", "Rozlišit číslo jednotné a množné.", "Určit základní pády (1.–4.) pomocí otázek."],
    boundaries: ["Rody a základní 4 páry. Bez skloňování vzorů."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Rod: přidej ten/ta/to. Číslo: jedno nebo víc? Pád: zeptej se na otázku (kdo? co? koho? čeho? komu? čemu?).",
      steps: ["Rod: ten pes (M), ta kočka (Ž), to auto (S).", "Číslo: pes (jedn.) / psi (mn.).", "Pád: Kdo? = 1. / Koho-čeho? = 2. / Komu-čemu? = 3. / Koho-co? = 4."],
      commonMistake: "Záměna 2. a 4. pádu: 'Koho?' se ptáme na oba — ale 2. pád = bez slovesa, 4. pád = s pohybovým slovesem.",
      example: "kniha: ta → ženský rod, jedna → jednotné číslo, Vidím koho/co? knihu → 4. pád.",
    },
  },
];
