import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// L1 zůstává klasické (Tvrdá/Měkká/Obojetná) — testuje znalost typů souhlásek.
interface L1Item {
  question: string;
  correct: string;
  distractors: string[];
  emoji: string;
  hint: string;
  solution: string;
}

// L2/L3: PED-1 — možnosti jsou POUZE sporný grafém (i/í/y/ý), NE celá chybná slova.
// Zobrazování chybných slov („riba", „šypek") je pedagogicky problematické —
// dítě si je zapamatuje. Otázka teď má jen jeden neznámý grafém a možnosti [y, ý, i, í].
type Grapheme = "y" | "ý" | "i" | "í";
interface GraphemeItem {
  /** Slovo s podtržítkem místo sporného grafému, např. "r_ba". */
  stem: string;
  correct: Grapheme;
  /** Slovo celé pro vysvětlení, např. "ryba". */
  word: string;
  emoji: string;
  /** Souhláska před grafémem (pro nápovědu), např. "R". */
  consonant: string;
  consonantType: "tvrdá" | "měkká";
}

// L1 — Identifikace souhlásek a pravidel
const POOL_L1: L1Item[] = [
  { question: "Jaká souhláska je 'r'?", correct: "Tvrdá", distractors: ["Měkká", "Obojetná"], emoji: "📝", hint: "Tvrdé souhlásky jsou: h, ch, k, r. Je R v tomto seznamu?", solution: "R je tvrdá souhláska — patří do skupiny h, ch, k, r. Po tvrdé souhlásce vždy píšeme Y, proto 'ryba', ne 'riba'." },
  { question: "Jaká souhláska je 'k'?", correct: "Tvrdá", distractors: ["Měkká", "Obojetná"], emoji: "📝", hint: "Tvrdé souhlásky jsou: h, ch, k, r. Je K v tomto seznamu?", solution: "K je tvrdá souhláska — patří do skupiny h, ch, k, r. Po K vždy píšeme Y, proto 'kytara', ne 'kitara'." },
  { question: "Jaká souhláska je 'č'?", correct: "Měkká", distractors: ["Tvrdá", "Obojetná"], emoji: "📝", hint: "Měkké souhlásky jsou: ž, š, č, ř, c, j. Je Č v tomto seznamu?", solution: "Č je měkká souhláska — patří do skupiny ž, š, č, ř, c, j. Po Č vždy píšeme I nebo Í, proto 'číst', ne 'čyst'." },
  { question: "Jaká souhláska je 'š'?", correct: "Měkká", distractors: ["Tvrdá", "Obojetná"], emoji: "📝", hint: "Měkké souhlásky jsou: ž, š, č, ř, c, j. Je Š v tomto seznamu?", solution: "Š je měkká souhláska — po Š vždy píšeme I nebo Í, proto 'šípek', ne 'šypek'." },
  { question: "Co píšeme po tvrdé souhlásce?", correct: "Vždy Y", distractors: ["Vždy I", "Záleží na slově"], emoji: "📝", hint: "Tvrdé souhlásky (h, ch, k, r) mají v tomto pravidle jen jednu možnost — Y, nebo I?", solution: "Po tvrdé souhlásce vždy píšeme Y — proto 'ryba', 'kytara', 'chyba'. Tvrdá souhláska si vždy 'chce' Y." },
  { question: "Co píšeme po měkké souhlásce?", correct: "Vždy I nebo Í", distractors: ["Vždy Y nebo Ý", "Záleží na délce"], emoji: "📝", hint: "Měkké souhlásky (ž, š, č, ř, c, j) mají v tomto pravidle jen jednu možnost — Y, anebo I?", solution: "Po měkké souhlásce vždy píšeme I nebo Í — proto 'žízeň', 'šípek', 'číst'. Měkká souhláska si vždy 'chce' I." },
  { question: "Jaká souhláska je 'h'?", correct: "Tvrdá", distractors: ["Měkká", "Obojetná"], emoji: "📝", hint: "Tvrdé souhlásky jsou: h, ch, k, r. Je H v tomto seznamu?", solution: "H je tvrdá souhláska — patří do skupiny h, ch, k, r. Po H vždy píšeme Y, proto 'hy' a nikdy 'hi'." },
  { question: "Jaká souhláska je 'ž'?", correct: "Měkká", distractors: ["Tvrdá", "Obojetná"], emoji: "📝", hint: "Měkké souhlásky jsou: ž, š, č, ř, c, j. Je Ž v tomto seznamu?", solution: "Ž je měkká souhláska — patří do skupiny ž, š, č, ř, c, j. Po Ž vždy píšeme I nebo Í, proto 'žízeň', ne 'žyzeň'." },
];

// L2 — Doplňování Y/Ý po tvrdých souhláskách
const POOL_L2: GraphemeItem[] = [
  { stem: "r_ba", correct: "y", word: "ryba", emoji: "🐟", consonant: "R", consonantType: "tvrdá" },
  { stem: "k_tara", correct: "y", word: "kytara", emoji: "🎸", consonant: "K", consonantType: "tvrdá" },
  { stem: "ch_ba", correct: "y", word: "chyba", emoji: "❌", consonant: "CH", consonantType: "tvrdá" },
  { stem: "k_blík", correct: "y", word: "kyblík", emoji: "🪣", consonant: "K", consonantType: "tvrdá" },
  { stem: "ch_trý", correct: "y", word: "chytrý", emoji: "🦊", consonant: "CH", consonantType: "tvrdá" },
  { stem: "r_že", correct: "ý", word: "rýže", emoji: "🍚", consonant: "R", consonantType: "tvrdá" },
  { stem: "h_drant", correct: "y", word: "hydrant", emoji: "🚒", consonant: "H", consonantType: "tvrdá" },
  { stem: "k_nout", correct: "y", word: "kynout", emoji: "🙋", consonant: "K", consonantType: "tvrdá" },
];

// L3 — Doplňování I/Í po měkkých souhláskách
const POOL_L3: GraphemeItem[] = [
  { stem: "ž_zeň", correct: "í", word: "žízeň", emoji: "💧", consonant: "Ž", consonantType: "měkká" },
  { stem: "š_pek", correct: "í", word: "šípek", emoji: "🌹", consonant: "Š", consonantType: "měkká" },
  { stem: "č_slo", correct: "í", word: "číslo", emoji: "🔢", consonant: "Č", consonantType: "měkká" },
  { stem: "j_st", correct: "í", word: "jíst", emoji: "🍽️", consonant: "J", consonantType: "měkká" },
  { stem: "c_l", correct: "í", word: "cíl", emoji: "🎯", consonant: "C", consonantType: "měkká" },
  { stem: "ř_ká", correct: "í", word: "říká", emoji: "🗣️", consonant: "Ř", consonantType: "měkká" },
  { stem: "š_roký", correct: "i", word: "široký", emoji: "↔️", consonant: "Š", consonantType: "měkká" },
  { stem: "č_st", correct: "í", word: "číst", emoji: "📖", consonant: "Č", consonantType: "měkká" },
];

const ALL_GRAPHEMES: readonly Grapheme[] = ["y", "ý", "i", "í"] as const;

function makeGraphemeTask(item: GraphemeItem): PracticeTask {
  const rule =
    item.consonantType === "tvrdá"
      ? `${item.consonant} je tvrdá souhláska → píšeme Y/Ý.`
      : `${item.consonant} je měkká souhláska → píšeme I/Í.`;
  const graphemeLabel = item.correct.toUpperCase();
  return {
    question: `Doplň chybějící písmeno do slova: "${item.stem}"`,
    correctAnswer: item.correct,
    // Vždy stejná sada 4 grafémů → dítě vidí konzistentní volbu Y/Ý/I/Í.
    options: [...ALL_GRAPHEMES],
    emoji: item.emoji,
    hints: [
      rule,
      `Ptej se: po ${item.consonant} patří tvrdé, nebo měkké písmeno? A je krátké, nebo dlouhé?`,
    ],
    explanation: `Správně je „${item.word}" (${graphemeLabel}). ${rule}`,
  };
}

function gen(level: number): PracticeTask[] {
  if (level === 1) {
    return shuffle(POOL_L1).map((item) => ({
      question: item.question,
      correctAnswer: item.correct,
      options: shuffle([item.correct, ...item.distractors]),
      emoji: item.emoji,
      hints: [item.hint],
      explanation: item.solution,
    }));
  }
  const pool = level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).map(makeGraphemeTask);
}

export const PRAVOPISIY: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-pravopis-tvrdych-a-mekkych-souhlasek-i-y-po-souhlaskach",
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-pravopis-tvrdych-a-mekkych-souhlasek-i-y-po-souhlaskach",
    title: "Pravopis tvrdých a měkkých souhlásek (i/y po souhláskách)",
    studentTitle: "Y nebo I?",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Naučíš se, kdy psát Y a kdy I.",
    keywords: ["pravopis", "tvrdé souhlásky", "měkké souhlásky", "y", "i", "ryba", "číst"],
    goals: [
      "Rozlišit tvrdé a měkké souhlásky.",
      "Vědět, že po tvrdé souhlásce píšeme Y.",
      "Vědět, že po měkké souhlásce píšeme I nebo Í.",
    ],
    boundaries: ["Pouze tvrdé a měkké souhlásky.", "Bez obojetných souhlásek."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Tvrdé (h, ch, k, r) → Y. Měkké (ž, š, č, ř, c, j) → I nebo Í.",
      steps: ["Najdi souhlásku před prázdným místem.", "Je tvrdá nebo měkká?", "Tvrdá → Y, měkká → I."],
      commonMistake: "Záměna tvrdé a měkké souhlásky — CH je tvrdá (chyba), Č je měkká (číst).",
      example: "Ryba: R je tvrdá → Y. Číst: Č je měkká → Í.",
    },
  },
];
