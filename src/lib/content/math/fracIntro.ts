import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Zlomek jako část celku — úvod, 4. ročník ZŠ
 * Klíčový prerekvizit pro 5.–6. ročník (operace se zlomky).
 *
 * Dvě typické úlohy:
 *   1) "Kolik je 1/4 z 20?" — výpočet části z celku
 *   2) "Obrázek má 8 dílů, 3 jsou zbarvené — jaký zlomek je zbarvený?" — z obrázku
 */

function genFracIntro(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // Jednoduché zlomky pro 4. ročník
  const fracts =
    level === 1
      ? [{ n: 1, d: 2 }, { n: 1, d: 3 }, { n: 1, d: 4 }]
      : level === 2
      ? [{ n: 1, d: 2 }, { n: 1, d: 3 }, { n: 1, d: 4 }, { n: 1, d: 5 }, { n: 2, d: 3 }, { n: 2, d: 5 }, { n: 3, d: 4 }]
      : [{ n: 1, d: 3 }, { n: 2, d: 3 }, { n: 1, d: 4 }, { n: 3, d: 4 }, { n: 1, d: 5 }, { n: 2, d: 5 }, { n: 3, d: 5 }, { n: 4, d: 5 }, { n: 1, d: 6 }, { n: 5, d: 6 }, { n: 3, d: 8 }, { n: 5, d: 8 }];

  for (let i = 0; i < 60; i++) {
    const frac = fracts[Math.floor(Math.random() * fracts.length)];
    // Výběr celku tak, aby výsledek byl celé číslo
    const whole = frac.d * (Math.floor(Math.random() * (level === 1 ? 5 : level === 2 ? 8 : 12)) + 2);
    const part = (whole / frac.d) * frac.n;

    const distractors = new Set<number>();
    distractors.add(whole / frac.d);       // jen jedna část
    distractors.add(whole - part);         // zbytek
    distractors.add(whole);                // celek
    distractors.add(part + frac.d);
    distractors.add(part + 2);
    distractors.delete(part);

    const filtered = [...distractors].filter((d) => d > 0).slice(0, 3).map(String);
    while (filtered.length < 3) filtered.push(String(part + filtered.length + 5));

    const options = [String(part), ...filtered].sort(() => Math.random() - 0.5);

    tasks.push({
      question: `Kolik je ${frac.n}/${frac.d} z ${whole}?`,
      correctAnswer: String(part),
      options,
      solutionSteps: [
        `Zlomek ${frac.n}/${frac.d} znamená: celek rozděl na ${frac.d} stejných částí a vezmi ${frac.n}.`,
        `${whole} ÷ ${frac.d} = ${whole / frac.d} (jedna část).`,
        frac.n === 1
          ? `Vezmu jednu část: ${whole / frac.d}.`
          : `Vezmu ${frac.n} části: ${frac.n} × ${whole / frac.d} = ${part}.`,
        `Výsledek: ${part}.`,
      ],
      hints: [
        `Nejdřív rozděl ${whole} na ${frac.d} stejných částí.`,
        `Potom vezmi ${frac.n} ${frac.n === 1 ? "z nich" : "z nich dohromady"}.`,
      ],
    });
  }
  return tasks;
}

const HELP_FRAC_INTRO: HelpData = {
  hint:
    "Zlomek vypadá jako 3/4 — číslo nahoře (čitatel) říká, kolik KOUSKŮ si vezmeš, číslo dole (jmenovatel) říká, na kolik stejných částí je celek ROZDĚLEN.",
  steps: [
    "Podívej se na jmenovatel — na kolik dílků rozdělit celek?",
    "Vyděl celek jmenovatelem. Dostaneš velikost jedné části.",
    "Podívej se na čitatel — kolik takových dílků si vezmeš?",
    "Vynásob velikost jedné části čitatelem.",
  ],
  commonMistake:
    "NEPLÉST si čitatel a jmenovatel! U zlomku 3/4 je čitatel 3 (kolik kousků máš) a jmenovatel 4 (na kolik je celek rozdělen). 3 kousky ze 4. Ne obráceně.",
  example:
    "Kolik je 3/4 z 20?\n• Jmenovatel 4: rozdělím 20 na 4 stejné části.\n• 20 ÷ 4 = 5 (jedna čtvrtina).\n• Čitatel 3: vezmu 3 čtvrtiny.\n• 3 × 5 = 15 ✓",
  visualExamples: [
    {
      label: "Pizza rozdělená na 4",
      fractionBars: [{ fraction: "1/4", numerator: 1, denominator: 4 }],
      illustration:
        "🍕 Pizza:\n┌───┬───┬───┬───┐\n│ ● │   │   │   │\n└───┴───┴───┴───┘\n    ↑ jeden díl = 1/4\n\nKdyž vezmu 3 díly:\n┌───┬───┬───┬───┐\n│ ● │ ● │ ● │   │\n└───┴───┴───┴───┘\n   3 ze 4 = 3/4",
      conclusion: "Jmenovatel 4 = pizza je nakrájená na 4 kousky. Čitatel = kolik sním.",
    },
    {
      label: "1/4 z 20 = ?",
      illustration:
        "20 jablek rozděl na 4 stejné hromádky:\n\n🍎🍎🍎🍎🍎 │ 🍎🍎🍎🍎🍎 │ 🍎🍎🍎🍎🍎 │ 🍎🍎🍎🍎🍎\n   (5)           (5)           (5)           (5)\n\nJedna hromádka = 1/4 z 20 = 5.\nTři hromádky = 3/4 z 20 = 15.",
      conclusion: "Vyděl celek jmenovatelem a potom vynásob čitatelem.",
    },
    {
      label: "Zlomky v běžném životě",
      illustration:
        "• Půlka jablka = 1/2\n• Čtvrt hodiny = 1/4 hodiny = 15 minut\n• Třetina třídy jede na výlet = 1/3\n• Dvě třetiny týdne = 2/3 × 7 dní ≈ přes 4 dny",
      conclusion: "Zlomky používáš denně — dej si pozor, co je čitatel a co jmenovatel.",
    },
  ],
};

export const FRAC_INTRO_TOPICS: TopicMetadata[] = [
  {
    id: "math-frac-intro-4",
    title: "Zlomek jako část celku",
    subject: "matematika",
    category: "zlomky (úvod)",
    topic: "zlomek jako část celku",
    topicDescription: "Zlomek jako způsob, jak pojmenovat část celku.",
    briefDescription:
      "Naučíš se počítat zlomky — co je čitatel, co jmenovatel, a kolik je třeba 3/4 z 20.",
    keywords: [
      "zlomek",
      "zlomky úvod",
      "část celku",
      "čitatel",
      "jmenovatel",
      "polovina",
      "čtvrtina",
      "třetina",
    ],
    goals: [
      "Rozpoznáš čitatel a jmenovatel zlomku.",
      "Vypočítáš část celku (1/2, 1/3, 1/4, 2/3, 3/4 …) z daného čísla.",
      "Pochopíš vztah zlomku a dělení.",
      "Použiješ zlomky v běžných situacích (čas, pizza, rozdělování).",
    ],
    boundaries: [
      "Pouze kladná celá čísla.",
      "Žádné sčítání ani odčítání zlomků (to je 6. ročník).",
      "Celek je vždy dělitelný jmenovatelem — výsledek je celé číslo.",
    ],
    gradeRange: [4, 5],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genFracIntro,
    helpTemplate: HELP_FRAC_INTRO,
    contentType: "algorithmic",
    prerequisites: ["math-divide", "math-multiply"],
    rvpReference: "M-5-1-07",
  },
];
