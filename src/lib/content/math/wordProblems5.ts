import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { PLURALS } from "../czechPlural";

/**
 * Slovní úlohy — 5. ročník ZŠ
 * RVP M-5-1-06: "Řeší a tvoří úlohy, ve kterých aplikuje osvojené početní
 *                operace v oboru přirozených čísel."
 *
 * Framework pro generování slovních úloh z šablon.
 * Každý template = (level) → { question, answer, steps, hints }.
 *
 * 3 typy úloh:
 *   A) Cena (nákup, sleva, vrácení)
 *   B) Čas (cestování, trvání, rozvrh)
 *   C) Množství (rozdělování, skupiny, opakované sčítání)
 */

// ══════════════════════════════════════════════════════════════════════════
// Framework types
// ══════════════════════════════════════════════════════════════════════════

interface WordProblemResult {
  question: string;
  answer: number;
  steps: string[];
  hints: [string, string];
}

interface WordProblemTemplate {
  id: string;
  category: "cena" | "cas" | "mnozstvi";
  difficulty: 1 | 2 | 3;
  /** Funkce, která vyrobí jednu úlohu (včetně náhodných parametrů). */
  generate: (level: number) => WordProblemResult;
}

function randBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ══════════════════════════════════════════════════════════════════════════
// A) Úlohy o CENĚ
// ══════════════════════════════════════════════════════════════════════════

const NAKUP_TEMPLATES: WordProblemTemplate[] = [
  {
    id: "nakup-vraceni",
    category: "cena",
    difficulty: 1,
    generate: (level) => {
      const price = randBetween(8, level === 1 ? 40 : 80) * 5; // dělitelné 5 (celá čísla Kč)
      const given = Math.ceil((price + 50) / 100) * 100; // zaplatí 100-nás.
      const back = given - price;
      const item = pick(["kniha", "hračka", "svačina", "pravítko", "sešit", "tričko"]);
      return {
        question: `Lenka koupila ${item} za ${price} Kč a zaplatila bankovkou za ${given} Kč. Kolik dostala zpátky?`,
        answer: back,
        steps: [
          `Celkem zaplatila ${given} Kč.`,
          `${item.charAt(0).toUpperCase() + item.slice(1)} stála ${price} Kč.`,
          `Vrácení = ${given} − ${price} = ${back} Kč.`,
        ],
        hints: [
          `Máš dvě částky — kolik zaplatila a kolik stála věc. Co z toho je vrácení?`,
          `Od zaplacené částky odečti cenu: ${given} − ${price} = ?`,
        ],
      };
    },
  },
  {
    id: "nakup-vice-kusu",
    category: "cena",
    difficulty: 2,
    generate: (level) => {
      const unit = randBetween(12, 60);
      const qty = randBetween(3, level === 1 ? 5 : 8);
      const total = unit * qty;
      const item = pick(["sešit", "rohlík", "pastelka", "kniha", "vstupenka"]);
      return {
        question: `Táta koupil ${qty} ${qty === 1 ? item : qty >= 2 && qty <= 4 ? item + "y" : item + "ů"} po ${unit} Kč. Kolik zaplatil celkem?`,
        answer: total,
        steps: [
          `Jeden kus stojí ${unit} Kč.`,
          `Kusů je ${qty}.`,
          `Celkem: ${qty} × ${unit} = ${total} Kč.`,
        ],
        hints: [
          `Máš cenu za JEDEN kus a VÍC kusů. Co máš spočítat?`,
          `Vynásob: počet kusů × cena za kus.`,
        ],
      };
    },
  },
  {
    id: "nakup-sleva",
    category: "cena",
    difficulty: 3,
    generate: (level) => {
      const original = randBetween(10, 50) * 10; // násobek 10
      const sleva = randBetween(3, 9) * 10;
      const nova = original - sleva;
      const item = pick(["batoh", "bunda", "kolo", "mobil"]);
      return {
        question: `${item.charAt(0).toUpperCase() + item.slice(1)} stojí původně ${original} Kč. Obchod dává slevu ${sleva} Kč. Kolik zaplatíš?`,
        answer: nova,
        steps: [
          `Původní cena: ${original} Kč.`,
          `Sleva: ${sleva} Kč.`,
          `Nová cena = ${original} − ${sleva} = ${nova} Kč.`,
        ],
        hints: [
          `Sleva = snížení ceny. Jak ji aplikovat?`,
          `Od původní ceny odečti slevu.`,
        ],
      };
    },
  },
];

// ══════════════════════════════════════════════════════════════════════════
// B) Úlohy o ČASE
// ══════════════════════════════════════════════════════════════════════════

const CAS_TEMPLATES: WordProblemTemplate[] = [
  {
    id: "cesta-rychlost",
    category: "cas",
    difficulty: 2,
    generate: (level) => {
      const rychlost = randBetween(40, 100);
      const cas = randBetween(2, level === 1 ? 4 : 7);
      const vzdal = rychlost * cas;
      return {
        question: `Auto jede rychlostí ${rychlost} km/h. Za kolik kilometrů urazí za ${cas} ${PLURALS.hodina(cas)}?`,
        answer: vzdal,
        steps: [
          `Rychlost: ${rychlost} km za 1 hodinu.`,
          `Čas: ${cas} ${PLURALS.hodina(cas)}.`,
          `Vzdálenost = rychlost × čas = ${rychlost} × ${cas} = ${vzdal} km.`,
        ],
        hints: [
          `Rychlost říká, kolik km urazí za 1 hodinu. Co se stane, když pojede ${cas} ${PLURALS.hodina(cas)}?`,
          `Vynásob rychlost × čas.`,
        ],
      };
    },
  },
  {
    id: "doba-trvani",
    category: "cas",
    difficulty: 2,
    generate: (_level) => {
      const startH = randBetween(8, 14);
      const trvaniH = randBetween(2, 5);
      const konecH = startH + trvaniH;
      return {
        question: `Film začíná v ${startH}:00 a trvá ${trvaniH} ${PLURALS.hodina(trvaniH)}. Kdy skončí?`,
        answer: konecH,
        steps: [
          `Začátek: ${startH}:00.`,
          `Trvání: ${trvaniH} ${PLURALS.hodina(trvaniH)}.`,
          `Konec = ${startH} + ${trvaniH} = ${konecH}:00.`,
        ],
        hints: [
          `Přičti dobu trvání k času začátku.`,
          `Začátek + trvání = konec.`,
        ],
      };
    },
  },
  {
    id: "prevod-minut",
    category: "cas",
    difficulty: 1,
    generate: (_level) => {
      const hodin = randBetween(2, 8);
      const minut = hodin * 60;
      return {
        question: `Kolik minut je ${hodin} ${PLURALS.hodina(hodin)}?`,
        answer: minut,
        steps: [
          `1 hodina = 60 minut.`,
          `${hodin} ${PLURALS.hodina(hodin)} = ${hodin} × 60 = ${minut} minut.`,
        ],
        hints: [
          `Kolik minut je v jedné hodině?`,
          `Vynásob počet hodin × 60.`,
        ],
      };
    },
  },
];

// ══════════════════════════════════════════════════════════════════════════
// C) Úlohy o MNOŽSTVÍ (rozdělování, skupiny)
// ══════════════════════════════════════════════════════════════════════════

const MNOZSTVI_TEMPLATES: WordProblemTemplate[] = [
  {
    id: "skupiny",
    category: "mnozstvi",
    difficulty: 1,
    generate: (level) => {
      const poSkupin = randBetween(4, 10);
      const skupin = randBetween(3, level === 1 ? 5 : 9);
      const celkem = poSkupin * skupin;
      return {
        question: `Na výlet jede ${skupin} ${PLURALS.skupinka(skupin)} po ${poSkupin} dětech. Kolik dětí jede celkem?`,
        answer: celkem,
        steps: [
          `Jedna skupinka: ${poSkupin} dětí.`,
          `Skupinek: ${skupin}.`,
          `Celkem: ${skupin} × ${poSkupin} = ${celkem} dětí.`,
        ],
        hints: [
          `Máš velikost jedné skupinky a kolik skupinek. Jak zjistíš celek?`,
          `Vynásob: ${skupin} × ${poSkupin}.`,
        ],
      };
    },
  },
  {
    id: "rozdeleni-zbytek",
    category: "mnozstvi",
    difficulty: 2,
    generate: (_level) => {
      const divisor = randBetween(4, 8);
      const quotient = randBetween(6, 20);
      const remainder = randBetween(1, divisor - 1);
      const total = divisor * quotient + remainder;
      return {
        question: `Učitelka má ${total} bonbonů a chce je rozdělit ${divisor} dětem rovnoměrně. Kolik bonbonů dostane každé dítě a kolik zbyde?`,
        answer: quotient, // Focus on the quotient; remainder would need different input type
        steps: [
          `${total} ÷ ${divisor} = ?`,
          `${divisor} × ${quotient} = ${divisor * quotient}, zbývá ${remainder}.`,
          `Každé dítě dostane ${quotient} bonbonů, zbyde ${remainder}.`,
        ],
        hints: [
          `Dělení se zbytkem: kolikrát se ${divisor} vejde do ${total}?`,
          `${divisor} × ? ≤ ${total}. Co zbyde?`,
        ],
      };
    },
  },
  {
    id: "vicekrokove",
    category: "mnozstvi",
    difficulty: 3,
    generate: (_level) => {
      const ma = randBetween(50, 200);
      const koupil = randBetween(20, 80);
      const vydal = randBetween(10, 40);
      const zustatek = ma + koupil - vydal;
      return {
        question: `Honza měl ${ma} korálků. Koupil si ${koupil} dalších a ${vydal} věnoval kamarádovi. Kolik korálků má teď?`,
        answer: zustatek,
        steps: [
          `Na začátku: ${ma} korálků.`,
          `Koupil: +${koupil} → ${ma + koupil}.`,
          `Věnoval: −${vydal} → ${ma + koupil - vydal}.`,
          `Výsledek: ${zustatek} korálků.`,
        ],
        hints: [
          `Úlohu si rozlož na kroky: co přibývá a co ubývá?`,
          `Postup: výchozí + přibylo − ubyto = výsledek.`,
        ],
      };
    },
  },
];

// ══════════════════════════════════════════════════════════════════════════
// Generator
// ══════════════════════════════════════════════════════════════════════════

const ALL_TEMPLATES: WordProblemTemplate[] = [
  ...NAKUP_TEMPLATES,
  ...CAS_TEMPLATES,
  ...MNOZSTVI_TEMPLATES,
];

function genWordProblems5(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  // Filter templates by difficulty appropriate for level
  const eligible = ALL_TEMPLATES.filter((t) =>
    level === 1 ? t.difficulty === 1 : level === 2 ? t.difficulty <= 2 : true,
  );

  for (let i = 0; i < 60; i++) {
    const tmpl = pick(eligible);
    const result = tmpl.generate(level);

    // Distraktory — typické chyby
    const distractors = new Set<number>();
    distractors.add(result.answer + 10);
    distractors.add(result.answer - 10);
    distractors.add(result.answer * 2);
    distractors.add(Math.abs(result.answer - 1));
    distractors.delete(result.answer);
    distractors.delete(0);

    const filtered = [...distractors].filter((d) => d > 0).slice(0, 3).map(String);
    while (filtered.length < 3) filtered.push(String(result.answer + (filtered.length + 1) * 7));
    const options = [String(result.answer), ...filtered].sort(() => Math.random() - 0.5);

    tasks.push({
      question: result.question,
      correctAnswer: String(result.answer),
      options,
      solutionSteps: result.steps,
      hints: result.hints,
    });
  }
  return tasks;
}

const HELP_WORD_PROBLEMS_5: HelpData = {
  hint:
    "Slovní úloha — nejdřív si pozorně přečti ZADÁNÍ a ujasni si, CO hledáš. Pak najdi čísla a rozhodni, jakou operaci potřebuješ.",
  steps: [
    "Přečti si celou úlohu pozorně. Případně dvakrát.",
    "Ujasni si, CO máš najít (kolik zbyde? kolik celkem? kolik dostane každý?).",
    "Najdi čísla v zadání.",
    "Rozhodni se: sčítám? odčítám? násobím? dělím?",
    "Spočítej. Zkontroluj, jestli odpověď dává smysl.",
  ],
  commonMistake:
    "NEČÍST pozorně! Často stačí přepsat otázku jinými slovy. Např. „kolik zbyde“ = odčítání, „kolik celkem“ = sčítání, „po kolik dostane každý“ = dělení.",
  example:
    "Úloha: Lenka koupila knihu za 150 Kč a zaplatila 200 Kč. Kolik dostala zpátky?\n\n• Co hledám: kolik zpátky (vrácení).\n• Čísla: 150 Kč (cena), 200 Kč (zaplatila).\n• Operace: zaplacené mínus cena = vrácení.\n• Výpočet: 200 − 150 = 50 Kč.\n• Kontrola: 150 + 50 = 200 ✓.",
  visualExamples: [
    {
      label: "Klíčová slova v úlohách",
      illustration:
        "   „kolik celkem“       → SČÍTÁM nebo NÁSOBÍM\n   „kolik zbyde“         → ODČÍTÁM nebo DĚLÍM se zbytkem\n   „kolik dostane každý“ → DĚLÍM\n   „kolikrát víc“        → DĚLÍM (větší ÷ menší)\n   „o kolik víc“         → ODČÍTÁM\n   „po ... Kč“           → většinou NÁSOBÍM",
      conclusion: "Rozluš, co slova znamenají matematicky.",
    },
    {
      label: "Rozložení úlohy na kroky",
      illustration:
        "Vícekroková úloha:\n  „Honza měl 100. Koupil 30. Věnoval 10. Kolik má teď?“\n\n  Krok 1:  100 + 30 = 130  (koupil = přibylo)\n  Krok 2:  130 − 10 = 120  (věnoval = ubylo)\n\n  Výsledek: 120.\n\nRozložení úlohy na menší kroky ti pomůže udržet přehled.",
      conclusion: "Složitou úlohu rozděl na menší kroky. Každý krok = jedna operace.",
    },
    {
      label: "Kontrola odpovědi",
      illustration:
        "Po vyřešení úlohy si POLOŽ otázku:\n  „Dává odpověď smysl?“\n\n• Koupil auto za 5 Kč? ❌ (nedává smysl)\n• Rozdělil 20 dětem po 100? ❌ (to nejde — měl by 2000 dětí)\n• Půjčil knihu za 15 minut, má přečíst 300 stran? ❌ (nemožné)\n\nRychlý odhad = první kontrola.",
      conclusion: "Neber první vypočítaný výsledek za hotový. Zeptej se: dává to smysl?",
    },
  ],
};

export const WORD_PROBLEMS_5_TOPICS: TopicMetadata[] = [
  {
    id: "math-word-problems-5",
    title: "Slovní úlohy",
    subject: "matematika",
    category: "Slovní úlohy",
    topic: "Slovní úlohy",
    topicDescription:
      "Řešení slovních úloh — cena, čas, množství. Aplikace sčítání, odčítání, násobení a dělení v reálných situacích.",
    briefDescription:
      "Naučíš se řešit slovní úlohy — nákupy, čas, rozdělování. Klíč: přečíst, najít operaci, spočítat, zkontrolovat.",
    keywords: [
      "slovní úlohy",
      "slovní úloha",
      "cena",
      "sleva",
      "vrácení",
      "skupiny",
      "rozdělování",
      "kolik zbyde",
      "kolik celkem",
    ],
    goals: [
      "Přečteš slovní úlohu a najdeš, co se hledá.",
      "Rozhodneš, jakou početní operaci potřebuješ.",
      "Vyřešíš úlohu s jednou i více kroky.",
      "Zkontroluješ, zda odpověď dává smysl.",
    ],
    boundaries: [
      "Pouze přirozená čísla (bez záporných a desetinných).",
      "Maximálně 3 kroky (složitější úlohy jsou 6. roč.).",
      "Žádné procenta (7. roč.).",
    ],
    gradeRange: [5, 6],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genWordProblems5,
    helpTemplate: HELP_WORD_PROBLEMS_5,
    contentType: "algorithmic",
    prerequisites: [
      "math-add-sub-10k-4",
      "math-mult-written-4",
      "math-divide-remainder-4",
    ],
    rvpReference: "M-5-1-06",
  },
];
