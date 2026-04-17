import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { PLURALS } from "../czechPlural";

/**
 * Převody jednotek — 4. ročník ZŠ
 * Délka, hmotnost, objem, čas.
 *
 * Úlohy tvoří: otázka typu "Kolik mm je 3 cm?" + výběr z možností.
 */

interface UnitConversion {
  from: string;       // symbol (cm, kg, ...) nebo slovo (den)
  to: string;
  factor: number;     // kolikrát větší je 1 from než 1 to
  category: "délka" | "hmotnost" | "čas" | "objem";
  note?: string;
  /** Plural helper — pokud je "from" české slovo (den/hodina/…), funkce vrátí správný tvar. */
  fromPlural?: (n: number) => string;
  toPlural?: (n: number) => string;
}

const CONVERSIONS: UnitConversion[] = [
  // Délka (zkratky — bez skloňování)
  { from: "m",  to: "cm", factor: 100,  category: "délka" },
  { from: "cm", to: "mm", factor: 10,   category: "délka" },
  { from: "km", to: "m",  factor: 1000, category: "délka" },
  { from: "dm", to: "cm", factor: 10,   category: "délka" },
  // Hmotnost
  { from: "kg", to: "g",  factor: 1000, category: "hmotnost" },
  { from: "t",  to: "kg", factor: 1000, category: "hmotnost", note: "1 tuna = 1 000 kg" },
  { from: "dkg", to: "g", factor: 10,   category: "hmotnost" },
  // Objem
  { from: "l",  to: "ml", factor: 1000, category: "objem" },
  { from: "hl", to: "l",  factor: 100,  category: "objem", note: "1 hektolitr = 100 litrů" },
  // Čas — plné české tvary vyžadují skloňování
  { from: "h",   to: "min", factor: 60, category: "čas" },
  { from: "min", to: "s",   factor: 60, category: "čas" },
  { from: "den", to: "h",   factor: 24, category: "čas",
    fromPlural: PLURALS.den },
];

function genUnits4(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 60; i++) {
    const conv = CONVERSIONS[Math.floor(Math.random() * CONVERSIONS.length)];
    // Náhodně zvolíme směr: větší→menší (×) nebo menší→větší (÷)
    const isExpanding = Math.random() > 0.3; // častěji expanze (je srozumitelnější)

    // Číslo — zvolíme tak, aby výpočet byl "hezký"
    const coeff =
      level === 1
        ? Math.floor(Math.random() * 8) + 2 // 2–9
        : level === 2
        ? Math.floor(Math.random() * 15) + 2 // 2–16
        : Math.floor(Math.random() * 40) + 2; // 2–41

    let question: string;
    let correctNum: number;
    let fromUnit: string;
    let toUnit: string;

    // Render jednotky — pokud je to plné slovo (den), skloňuj; jinak zkratka beze změny
    const renderFrom = (n: number) =>
      conv.fromPlural ? conv.fromPlural(n) : conv.from;
    const renderTo = (n: number) =>
      conv.toPlural ? conv.toPlural(n) : conv.to;

    if (isExpanding) {
      // Z větší na menší: "6 dnů = ? h" nebo "3 m = ? cm"
      const largerValue = coeff * conv.factor;
      question = `${coeff} ${renderFrom(coeff)} = ? ${renderTo(largerValue)}`;
      correctNum = largerValue;
      fromUnit = conv.from;
      toUnit = conv.to;
    } else {
      // Z menší na větší: "144 h = ? dnů" nebo "300 cm = ? m"
      const largerValue = coeff * conv.factor;
      question = `${largerValue} ${renderTo(largerValue)} = ? ${renderFrom(coeff)}`;
      correctNum = coeff;
      fromUnit = conv.to;
      toUnit = conv.from;
    }

    // Distraktory — typické chyby
    const distractors = new Set<number>();
    distractors.add(correctNum * 10);         // chybný řád
    distractors.add(Math.floor(correctNum / 10));
    distractors.add(correctNum + conv.factor);
    distractors.add(correctNum - 1);
    distractors.add(correctNum + 100);
    distractors.delete(correctNum);

    const filtered = [...distractors].filter((d) => d > 0).slice(0, 3).map(String);
    while (filtered.length < 3) filtered.push(String(correctNum + (filtered.length + 1) * 7));

    const options = [String(correctNum), ...filtered].sort(() => Math.random() - 0.5);

    // Pro solution steps použij "1 den = 24 h", "1 m = 100 cm" — vždy singulár u jednotek
    const oneUnitFrom = conv.fromPlural ? conv.fromPlural(1) : conv.from;
    const factorUnitTo = conv.toPlural ? conv.toPlural(conv.factor) : conv.to;
    const solutionSteps: string[] = [
      `1 ${oneUnitFrom} = ${conv.factor} ${factorUnitTo}.${conv.note ? " (" + conv.note + ")" : ""}`,
      isExpanding
        ? `Z větší jednotky na menší NÁSOBÍM: ${coeff} × ${conv.factor} = ${correctNum}.`
        : `Z menší jednotky na větší DĚLÍM: ${coeff * conv.factor} ÷ ${conv.factor} = ${correctNum}.`,
      `Výsledek: ${correctNum} ${conv.toPlural ? conv.toPlural(correctNum) : toUnit}.`,
    ];

    tasks.push({
      question,
      correctAnswer: String(correctNum),
      options,
      solutionSteps,
      hints: [
        `Převádíš mezi ${fromUnit} a ${toUnit}. 1 ${oneUnitFrom} = ${conv.factor} ${factorUnitTo}.`,
        isExpanding
          ? `Jdu z větší jednotky na menší — čísla porostou. Násobím ${conv.factor}.`
          : `Jdu z menší jednotky na větší — čísla klesnou. Dělím ${conv.factor}.`,
      ],
    });
  }
  return tasks;
}

const HELP_UNITS_4: HelpData = {
  hint:
    "Převody jednotek — pamatuj: z VĚTŠÍ jednotky na MENŠÍ vždy NÁSOBÍM (čísla rostou), z MENŠÍ na VĚTŠÍ DĚLÍM (čísla klesají).",
  steps: [
    "Rozpoznej, z čeho na co převádíš (délka? hmotnost? čas?).",
    "Vzpomeň si nebo se podívej: kolikrát se ta menší vejde do té větší?",
    "Pokud jdeš z VĚTŠÍ na MENŠÍ → NÁSOB.",
    "Pokud jdeš z MENŠÍ na VĚTŠÍ → DĚL.",
    "Zkontroluj, jestli čísla dávají smysl (metr je delší než centimetr, tedy 3 m je víc než 3 cm).",
  ],
  commonMistake:
    "NEPLÉST směr! 5 m = ? cm → 500 cm (správně, m je větší než cm, NÁSOBÍM). Ne 0,05 cm — to by byl chybný směr.",
  example:
    "3 m = ? cm\n1 m = 100 cm\n3 × 100 = 300\nTakže 3 m = 300 cm ✓\n\n5 000 g = ? kg\n1 kg = 1 000 g\n5 000 ÷ 1 000 = 5\nTakže 5 000 g = 5 kg ✓",
  visualExamples: [
    {
      label: "Žebřík jednotek délky",
      illustration:
        "  km\n   │ ×1000 ↓ (kolem přes m je to jiný příběh — přeskoč dm/cm)\n   m\n   │ ×10 ↓\n   dm\n   │ ×10 ↓\n   cm\n   │ ×10 ↓\n   mm\n\n• 1 km = 1 000 m = 10 000 dm = 100 000 cm = 1 000 000 mm\n• Jdu-li DOLŮ (k menším), NÁSOBÍM.\n• Jdu-li NAHORU (k větším), DĚLÍM.",
      conclusion: "Představ si žebřík — každý příčel znamená ×10 (u délky) nebo ×1000 (u hmotnosti, objemu).",
    },
    {
      label: "Převody jednotek hmotnosti",
      illustration:
        "tuna (t)\n   │ ×1 000 ↓\nkilogram (kg)\n   │ ×100 ↓\ndekagram (dkg)\n   │ ×10 ↓\ngram (g)\n\n• 1 t = 1 000 kg\n• 1 kg = 100 dkg = 1 000 g\n• 1 dkg = 10 g\n\nPříklad: 2,5 kg bonbónů = 2 500 g. Jeden bonbón váží 5 g → kolik jich je? 500.",
    },
    {
      label: "Kontrola: čas a jiné jednotky",
      illustration:
        "Čas je jiný — ne po 10, ale:\n• 1 minuta = 60 sekund\n• 1 hodina = 60 minut = 3 600 sekund\n• 1 den = 24 hodin\n\nPříklad: 2 hodiny = 120 minut = 7 200 sekund.",
      conclusion: "Čas používá 60 a 24, ne desítkové. Dávej pozor.",
    },
  ],
};

export const UNITS_4_TOPICS: TopicMetadata[] = [
  {
    id: "math-units-4",
    title: "Převody jednotek",
    subject: "matematika",
    category: "Měření",
    topic: "Převody jednotek",
    topicDescription: "Délka, hmotnost, objem a čas — převody mezi jednotkami.",
    briefDescription:
      "Naučíš se převádět mezi jednotkami: m ↔ cm, kg ↔ g, l ↔ ml, h ↔ min. Větší → menší: násobím. Menší → větší: dělím.",
    keywords: [
      "jednotky",
      "převody",
      "převeď",
      "metr",
      "kilogram",
      "litr",
      "hodiny",
      "minuty",
      "gramy",
      "centimetry",
    ],
    goals: [
      "Převedeš délku (mm, cm, dm, m, km).",
      "Převedeš hmotnost (g, dkg, kg, t).",
      "Převedeš objem (ml, l, hl).",
      "Převedeš čas (s, min, h, den).",
      "Rozpoznáš, kdy násobit a kdy dělit.",
    ],
    boundaries: [
      "Pouze celá čísla (žádné desetinné).",
      "Žádné jednotky obsahu a objemu tělesa (cm², cm³).",
    ],
    gradeRange: [4, 5],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genUnits4,
    helpTemplate: HELP_UNITS_4,
    contentType: "algorithmic",
    prerequisites: ["math-measurement", "math-multiply", "math-divide"],
    rvpReference: "M-5-1-04",
  },
];
