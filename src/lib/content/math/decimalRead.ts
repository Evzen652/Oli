import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Desetinná čísla — čtení a zobrazení na ose — 5. ročník ZŠ
 * RVP M-5-1-09: "přečte zápis desetinného čísla a vyznačí na číselné ose
 *                desetinné číslo dané hodnoty"
 *
 * Input type: select_one
 * Úlohy:
 *  1) Jaké číslo představuje "tři celé čtyřicet pět setin"? → 3,45
 *  2) Které číslo je na ose mezi 2 a 3 blíže k 3? → 2,8
 */

const ONES_WORDS: Record<number, string> = {
  0: "nula", 1: "jedna", 2: "dva", 3: "tři", 4: "čtyři",
  5: "pět", 6: "šest", 7: "sedm", 8: "osm", 9: "devět", 10: "deset",
};

function oneWord(n: number): string {
  return ONES_WORDS[n] ?? String(n);
}

function fmt(n: number, places: number): string {
  return n.toFixed(places).replace(".", ",");
}

/** Převede desetinné číslo na slovní zápis pro žáka. */
function toWords(whole: number, frac: number, places: number): string {
  const wholeWord = oneWord(whole);
  const wholePrefix = whole === 1 ? "jedna celá" :
                     whole >= 2 && whole <= 4 ? `${wholeWord} celé` :
                     `${wholeWord} celých`;
  if (frac === 0) {
    return `${wholePrefix} ${places === 1 ? "nula desetin" : places === 2 ? "nula setin" : "nula tisícin"}`;
  }
  const unit = places === 1 ? (frac === 1 ? "desetina" : frac >= 2 && frac <= 4 ? "desetiny" : "desetin")
             : places === 2 ? (frac === 1 ? "setina" : frac >= 2 && frac <= 4 ? "setiny" : "setin")
             : (frac === 1 ? "tisícina" : frac >= 2 && frac <= 4 ? "tisíciny" : "tisícin");
  return `${wholePrefix} ${frac} ${unit}`;
}

/** Úloha A: slovní zápis → číslice */
function genWordsToDigits(level: number): PracticeTask {
  const whole = Math.floor(Math.random() * 10);
  const places = level === 1 ? 1 : level === 2 ? (Math.random() > 0.5 ? 1 : 2) : 2;
  const max = Math.pow(10, places);
  const frac = Math.floor(Math.random() * max);
  const value = whole + frac / max;
  const correctStr = fmt(value, places);

  // Distraktory
  const distractors = new Set<string>();
  distractors.add(fmt(value + 0.1, places));
  distractors.add(fmt(Math.max(0, value - 0.1), places));
  if (places === 2) {
    distractors.add(fmt(whole + frac / 10, places)); // zaměněné řády
  }
  distractors.add(fmt(value + 1, places));
  distractors.delete(correctStr);

  const options = [correctStr, ...[...distractors].slice(0, 3)].sort(() => Math.random() - 0.5);

  return {
    question: `Jak zapíšeš „${toWords(whole, frac, places)}“ číslicemi?`,
    correctAnswer: correctStr,
    options,
    solutionSteps: [
      `Celá část: ${whole}.`,
      places === 1
        ? `Desetiny: ${frac} (jedna číslice za čárkou).`
        : places === 2
          ? `Setiny: ${frac} (dvě číslice za čárkou; pokud je jen jedna — doplň nulu zleva).`
          : `Tisíciny: ${frac} (tři číslice za čárkou).`,
      `Zápis: ${correctStr}.`,
    ],
    hints: [
      `"Celá" = část před čárkou. "Desetiny/setiny" = číslice za čárkou.`,
      `Setiny = dvě pozice za čárkou. Pokud je číslice jen jedna, doplň nulu zleva (např. 5 setin = ,05).`,
    ],
  };
}

/** Úloha B: číselná osa — "které číslo je mezi X a Y" */
function genOnAxis(_level: number): PracticeTask {
  const lo = Math.floor(Math.random() * 9);
  const hi = lo + 1;
  // Vyber "cílové" místo na ose
  const target = lo + (Math.floor(Math.random() * 9) + 1) / 10;
  const targetStr = fmt(target, 1);

  // Distraktory
  const distractors = new Set<string>();
  distractors.add(fmt(lo, 1)); // krajní hodnota
  distractors.add(fmt(hi, 1));
  distractors.add(fmt(target + 1, 1));
  const alt = target - Math.floor(target) < 0.5 ? hi - 0.1 : lo + 0.1;
  distractors.add(fmt(alt, 1));
  distractors.delete(targetStr);

  const options = [targetStr, ...[...distractors].slice(0, 3)].sort(() => Math.random() - 0.5);

  // Rozdělení na desetiny — popis pozice
  const decimalPart = Math.round((target - lo) * 10);
  const nearer = decimalPart < 5 ? lo : hi;

  return {
    question: `Jaké desetinné číslo leží mezi ${lo} a ${hi} — ${decimalPart} desetin za ${lo}?`,
    correctAnswer: targetStr,
    options,
    solutionSteps: [
      `Rozděl úsek od ${lo} do ${hi} na 10 stejných dílků.`,
      `Každý dílek má hodnotu 0,1.`,
      `${decimalPart} dílků od ${lo} = ${lo} + ${decimalPart}·0,1 = ${targetStr}.`,
      decimalPart === 5
        ? `To je přesně v polovině mezi ${lo} a ${hi}.`
        : `Je blíž k ${nearer} (${Math.abs(decimalPart - (decimalPart < 5 ? 0 : 10))} dílků).`,
    ],
    hints: [
      `Úsek ${lo}–${hi} rozdělíš na 10 dílků. Každý dílek = 0,1.`,
      `Odpočítej ${decimalPart} dílků od ${lo} směrem k ${hi}.`,
    ],
  };
}

function genDecimalRead(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  // Mix: 60 % slova → číslice, 40 % osy
  for (let i = 0; i < 36; i++) tasks.push(genWordsToDigits(level));
  for (let i = 0; i < 24; i++) tasks.push(genOnAxis(level));
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_DECIMAL_READ: HelpData = {
  hint:
    "Desetinné číslo má celou část (před čárkou) a desetinnou část (za čárkou). Každá pozice za čárkou = 10× menší (desetiny, setiny, tisíciny).",
  steps: [
    "Najdi desetinnou čárku — odděluje celou a zlomkovou část.",
    "Před čárkou je celá hodnota (jednotky, desítky, stovky).",
    "Za čárkou jsou desetiny (1. pozice), setiny (2. pozice), tisíciny (3. pozice).",
    "Při čtení říkej: „celých“ a pak slovem počet desetin / setin.",
  ],
  commonMistake:
    "ČTENÍ: 3,45 NENÍ „tři celé čtyřicet pět“! Správně „tři celé čtyřicet pět SETIN“. Vždy řekni jednotku (desetiny / setiny / tisíciny).",
  example:
    "2,7 = dvě celé sedm desetin\n3,45 = tři celé čtyřicet pět setin\n5,08 = pět celých osm setin\n0,125 = nula celých sto dvacet pět tisícin",
  visualExamples: [
    {
      label: "Řády desetinného čísla",
      illustration:
        "     Jed. , Des.  Set. Tis.\n      3   ,  4    5   7\n\n  3,457 =\n    3     (celých)\n  + 4/10  (4 desetiny)\n  + 5/100 (5 setin)\n  + 7/1000 (7 tisícin)\n\n  Celkem: 3,457",
      conclusion: "Každá pozice za čárkou má 10× menší hodnotu.",
    },
    {
      label: "Číselná osa s desetinami",
      illustration:
        "  0─┼──┼──┼──┼──┼──┼──┼──┼──┼──┼─1\n     0,1  0,3  0,5  0,7  0,9\n        0,2 0,4  0,6 0,8\n\nÚsek 0–1 rozdělíš na 10 stejných dílků.\nKaždý dílek = 0,1 (jedna desetina).",
      conclusion: "Na ose je mezi 0 a 1 přesně 9 desetinných čísel (0,1 až 0,9).",
    },
  ],
};

export const DECIMAL_READ_TOPICS: TopicMetadata[] = [
  {
    id: "math-decimal-read-5",
    title: "Desetinná čísla — čtení a osa",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Desetinná čísla",
    topicDescription: "Čtení desetinných čísel a jejich zobrazení na číselné ose.",
    briefDescription:
      "Naučíš se číst desetinná čísla (jako „tři celé čtyřicet pět setin“) a najít je na číselné ose.",
    keywords: [
      "desetinná čísla",
      "desetinné",
      "čárka",
      "desetiny",
      "setiny",
      "číselná osa",
      "čtení desetinných",
    ],
    goals: [
      "Přečteš desetinné číslo s jednotkami (desetiny/setiny/tisíciny).",
      "Zapíšeš slovní popis jako číslici.",
      "Najdeš desetinné číslo na číselné ose.",
    ],
    boundaries: [
      "Pouze čtení a orientace na ose.",
      "Žádné porovnávání (to je rozhraní 5./6. roč.).",
      "Žádné operace (+, −, ×, ÷ přijdou v 6. ročníku).",
    ],
    gradeRange: [5, 6],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genDecimalRead,
    helpTemplate: HELP_DECIMAL_READ,
    contentType: "algorithmic",
    prerequisites: ["math-numbers-million-5", "math-frac-intro-4"],
    rvpReference: "M-5-1-09",
  },
];
