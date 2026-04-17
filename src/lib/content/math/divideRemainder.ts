import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Dělení se zbytkem — 4. ročník ZŠ
 * Např.: 23 ÷ 4 = 5, zbytek 3.
 *
 * Generátor vybere dělitel (1–9) a kvocient tak, aby výsledek byl celé číslo
 * s libovolným zbytkem 0–(dělitel−1).
 */

function genDivideRemainder(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 60; i++) {
    let divisor: number;
    let quotient: number;

    if (level === 1) {
      // Malé dělitele, malé kvocienty
      divisor = Math.floor(Math.random() * 4) + 2; // 2–5
      quotient = Math.floor(Math.random() * 6) + 2; // 2–7
    } else if (level === 2) {
      // Střední
      divisor = Math.floor(Math.random() * 6) + 3; // 3–8
      quotient = Math.floor(Math.random() * 10) + 3; // 3–12
    } else {
      // Větší
      divisor = Math.floor(Math.random() * 7) + 3; // 3–9
      quotient = Math.floor(Math.random() * 15) + 5; // 5–19
    }

    // Zbytek 0 až (divisor − 1); občas zbytek 0 (přesné dělení)
    const remainder = Math.random() < 0.2 ? 0 : Math.floor(Math.random() * (divisor - 1)) + 1;
    const dividend = divisor * quotient + remainder;

    // Distraktory
    const distractors = new Set<string>();
    distractors.add(`${quotient + 1} zb. ${remainder}`);
    distractors.add(`${quotient - 1} zb. ${remainder}`);
    distractors.add(`${quotient} zb. ${remainder + 1}`);
    distractors.add(`${quotient} zb. ${Math.max(0, remainder - 1)}`);
    if (remainder !== 0) distractors.add(`${quotient + 1} zb. 0`);

    const correctStr = remainder === 0 ? `${quotient}` : `${quotient} zb. ${remainder}`;
    distractors.delete(correctStr);

    const filtered = [...distractors].filter((d) => d !== correctStr).slice(0, 3);
    while (filtered.length < 3) filtered.push(`${quotient + filtered.length + 2}`);

    const options = [correctStr, ...filtered].sort(() => Math.random() - 0.5);

    tasks.push({
      question: `${dividend} ÷ ${divisor} =`,
      correctAnswer: correctStr,
      options,
      solutionSteps: [
        `Hledám největší násobek ${divisor}, který se vejde do ${dividend}.`,
        `${divisor} × ${quotient} = ${divisor * quotient}. A ${divisor} × ${quotient + 1} = ${divisor * (quotient + 1)} — to už je moc.`,
        remainder === 0
          ? `${dividend} ÷ ${divisor} = ${quotient} (beze zbytku).`
          : `Zbytek = ${dividend} − ${divisor * quotient} = ${remainder}.`,
        remainder === 0
          ? `Výsledek: ${quotient}.`
          : `Výsledek: ${quotient}, zbytek ${remainder}.`,
      ],
      hints: [
        `Kolikrát se ${divisor} vejde do ${dividend}?`,
        `Zkus: ${divisor} × ? ≤ ${dividend}. Co zbyde na konci?`,
      ],
    });
  }
  return tasks;
}

const HELP_DIVIDE_REMAINDER: HelpData = {
  hint:
    "Dělení se zbytkem = hledáš, kolikrát se menší číslo VEJDE do většího. A co zbyde, je zbytek.",
  steps: [
    "Podívej se na dělenec (velké číslo) a dělitel (malé číslo).",
    "Hledej největší násobek dělitele, který se vejde do dělence.",
    "Spočítej, kolik zbylo — to je zbytek.",
    "Zbytek musí být VŽDY menší než dělitel!",
  ],
  commonMistake:
    "Zbytek nesmí být roven nebo větší než dělitel. Když ti vyjde 23 ÷ 4 = 4, zbytek 7, víš, že je to špatně — 7 je větší než 4. Správně: 5, zbytek 3.",
  example:
    "23 ÷ 4 = ?\n4 × 5 = 20, 4 × 6 = 24 — to je moc.\nTakže 23 ÷ 4 = 5, zbytek 3.\nKontrola: 5 × 4 + 3 = 23 ✓",
  visualExamples: [
    {
      label: "Rozdělení bonbónů",
      illustration:
        "Máš 23 bonbónů, rozděl je do 4 sáčků stejně:\n\n🍬🍬🍬🍬🍬  (5 v prvním sáčku)\n🍬🍬🍬🍬🍬  (5 ve druhém)\n🍬🍬🍬🍬🍬  (5 ve třetím)\n🍬🍬🍬🍬🍬  (5 ve čtvrtém)\n🍬🍬🍬     (3 zbyly)\n\n23 ÷ 4 = 5, zbytek 3",
      conclusion: "Každý sáček má 5, ale 3 bonbóny nám zbyly.",
    },
    {
      label: "Pravidlo o zbytku",
      illustration:
        "❌ 23 ÷ 4 = 4, zbytek 7   — špatně! 7 je větší než 4.\n✅ 23 ÷ 4 = 5, zbytek 3   — správně, 3 < 4.\n\nKONTROLA:  5 × 4 + 3 = 23 ✓",
      conclusion: "Zbytek je vždy menší než dělitel. Pokud ne, dělil jsi málo.",
    },
    {
      label: "Kontrola násobením",
      illustration:
        "Pokud máš 37 ÷ 5 = 7, zbytek 2,\nzkontroluj:  7 × 5 + 2 = 35 + 2 = 37 ✓\n\nKdyž kontrola nesedí, hledej chybu.",
      conclusion: "kvocient × dělitel + zbytek = dělenec. Vždy.",
    },
  ],
};

export const DIVIDE_REMAINDER_TOPICS: TopicMetadata[] = [
  {
    id: "math-divide-remainder-4",
    title: "Dělení se zbytkem",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Dělení se zbytkem",
    topicDescription: "Dělení přirozených čísel, kde výsledek má zbytek.",
    briefDescription:
      "Naučíš se dělit se zbytkem — třeba 23 : 4. Vyjde ti kvocient a zbytek. Zbytek je vždy menší než dělitel.",
    keywords: ["dělení se zbytkem", "zbytek", "dělit", "zb", "dělení zbytek"],
    goals: [
      "Vyděl přirozené číslo jednociferným dělitelem se zbytkem.",
      "Najdeš největší násobek dělitele, který se vejde do dělence.",
      "Určíš zbytek (vždy menší než dělitel).",
      "Zkontroluješ výsledek: kvocient × dělitel + zbytek = dělenec.",
    ],
    boundaries: [
      "Dělitel je 2–9.",
      "Dělenec je do 200.",
      "Pouze kladná celá čísla.",
    ],
    gradeRange: [4, 5],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genDivideRemainder,
    helpTemplate: HELP_DIVIDE_REMAINDER,
    contentType: "algorithmic",
    prerequisites: ["math-multiply", "math-divide"],
    rvpReference: "M-5-1-04",
  },
];
