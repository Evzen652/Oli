import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Záporná čísla — úvod — 5. ročník ZŠ
 * RVP M-5-1-10
 *
 * Cíle:
 *   • Pochopit znaménko "−" u zápisu záporného čísla
 *   • Umět záporné číslo ukázat na číselné ose
 *   • Porovnávat kladná a záporná čísla
 *
 * NEzahrnuje: operace (sčítání/násobení se zápornými) — to je 7. ročník.
 *
 * Input type: comparison
 */

function genCompareSigned(_level: number): PracticeTask {
  const range = 15;
  let a: number;
  let b: number;

  const variant = Math.random();
  if (variant < 0.3) {
    // Záporné vs kladné
    a = -(Math.floor(Math.random() * range) + 1);
    b = Math.floor(Math.random() * range) + 1;
  } else if (variant < 0.6) {
    // Dvě záporná
    a = -(Math.floor(Math.random() * range) + 1);
    b = -(Math.floor(Math.random() * range) + 1);
  } else if (variant < 0.8) {
    // Jedno je 0
    a = Math.random() > 0.5 ? 0 : -(Math.floor(Math.random() * range) + 1);
    b = a === 0 ? -(Math.floor(Math.random() * range) + 1) : 0;
  } else {
    // Dvě kladná pro refresh
    a = Math.floor(Math.random() * range) + 1;
    b = Math.floor(Math.random() * range) + 1;
  }

  if (Math.random() < 0.15) b = a;

  const correct = a < b ? "<" : a > b ? ">" : "=";

  const fmt = (n: number) => (n < 0 ? `(${n})` : `${n}`);

  return {
    question: `Porovnej: ${fmt(a)} ○ ${fmt(b)}`,
    correctAnswer: correct,
    options: ["<", "=", ">"],
    solutionSteps: [
      `Představ si čísla na číselné ose.`,
      a < 0 && b < 0
        ? `Obě záporná. Pozor: −10 je MENŠÍ než −3 (dál vlevo od nuly).`
        : a < 0 && b > 0
          ? `Záporné číslo (${a}) je vždy menší než kladné (${b}).`
          : a > 0 && b < 0
            ? `Kladné číslo (${a}) je vždy větší než záporné (${b}).`
            : a === 0 || b === 0
              ? `Nula je větší než každé záporné, menší než každé kladné.`
              : `Obě kladná — větší je to, co ukazuje vpravo.`,
      `Odpověď: ${correct}.`,
    ],
    hints: [
      `Zakresli si obě čísla na osu. Které je víc vlevo?`,
      `Pamatuj: čím dál vlevo na ose, tím MENŠÍ číslo. −5 < −2 (i když 5 > 2 u absolutních hodnot).`,
    ],
  };
}

function genNegativeIntro(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 60; i++) tasks.push(genCompareSigned(level));
  return tasks;
}

const HELP_NEGATIVE_INTRO: HelpData = {
  hint:
    "Záporné číslo zapisujeme se znaménkem − vepředu. Na číselné ose je vlevo od nuly. Čím dál vlevo, tím menší hodnota.",
  steps: [
    "Představ si číselnou osu: vlevo záporná, vpravo kladná, uprostřed 0.",
    "Kladné > Nula > Záporné (vždy).",
    "Mezi dvěma zápornými: to BLÍŽE k nule je větší. −2 > −5.",
    "Čti zápis: −5 jako „mínus pět“ nebo „záporné pět“.",
  ],
  commonMistake:
    "Chybný instinkt: „5 > 2, takže −5 > −2“ — NE! U záporných je to OBRÁCENĚ: −5 < −2.\nMysli si to jako teplotu: −5 °C je studenější než −2 °C. Studenější = menší.",
  example:
    "Porovnání:\n  5 > 2   (kladná — snadné)\n  0 > −3  (nula > záporné)\n  −1 > −8 (bliž k nule je větší)\n  −5 < 3  (záporné je vždy menší než kladné)",
  visualExamples: [
    {
      label: "Číselná osa",
      illustration:
        "   ← menší                    větší →\n\n  … −5  −4  −3  −2  −1   0   1   2   3   4   5 …\n         ←── záporná ──┤├── kladná ──→\n\n  Pravidla:\n  • Vpravo = větší.\n  • Vlevo = menší.\n  • U záporných: čím MENŠÍ absolutní hodnota, tím VĚTŠÍ číslo.",
      conclusion: "Na ose čti pozici. Vpravo je větší, vlevo je menší. Vždy.",
    },
    {
      label: "Teplota jako příklad",
      illustration:
        "V zimě venku:\n  +5 °C  ← teplo jako kostelník\n   0 °C  ← voda mrzne\n  −2 °C  ← trochu chladno\n  −5 °C  ← mráz\n  −10 °C ← pořádný mráz\n\nČím menší číslo, tím větší zima.\n−10 je menší než −2 (větší zima).",
      conclusion: "Pro záporná čísla: MENŠÍ = „víc záporné“.",
    },
    {
      label: "Záporné v bance",
      illustration:
        "Zůstatek na účtu:\n   +500 Kč ← máš peníze\n      0 Kč ← nemáš nic, ale nedlužíš\n   −200 Kč ← jsi v mínusu, dlužíš 200\n   −500 Kč ← dlužíš 500 (horší!)\n\n−500 < −200 (větší dluh je menší zůstatek).",
      conclusion: "Záporná čísla popisují „dluh“, „chlad“, „pod hladinou“.",
    },
  ],
};

export const NEGATIVE_INTRO_TOPICS: TopicMetadata[] = [
  {
    id: "math-negative-intro-5",
    title: "Záporná čísla — úvod",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Záporná čísla",
    topicDescription: "Pojem záporné číslo, zobrazení na ose, porovnávání.",
    briefDescription:
      "Naučíš se pracovat se zápornými čísly — co znamenají, jak je čteš a jak je porovnáváš.",
    keywords: [
      "záporná čísla",
      "mínus",
      "pod nulou",
      "záporné",
      "porovnávání",
      "teplota",
    ],
    goals: [
      "Pochopíš význam znaku − před číslem.",
      "Ukážeš záporné číslo na číselné ose.",
      "Porovnáš záporné a kladné čísla.",
      "Pochopíš praktické použití (teplota, dluhy, hladina moře).",
    ],
    boundaries: [
      "Pouze POROVNÁVÁNÍ a čtení.",
      "Žádné sčítání/odčítání se zápornými (to je 7. ročník).",
      "Žádné násobení se zápornými (7. ročník).",
    ],
    gradeRange: [5, 7],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "comparison",
    generator: genNegativeIntro,
    helpTemplate: HELP_NEGATIVE_INTRO,
    contentType: "algorithmic",
    prerequisites: ["math-compare-natural-numbers-100"],
    rvpReference: "M-5-1-10",
  },
];
