import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { phrase, pad } from "@/lib/czechGrammar";

// Otázky testují porozumění zlomku jako části celku.
// Žádné obrázky — odpověď je slovní/číselná.

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // level 1: jednoduchý zlomek (1/2, 1/3, 1/4, 3/4 …) — co je to za část celku
  // level 2: porovnání dvou zlomků se stejným jmenovatelem
  // level 3: určení zlomku ze slovní úlohy (část pizzy, tyčinky…)

  const jmenovatele = [2, 3, 4, 5, 6, 8, 10];

  for (let i = 0; i < 40; i++) {
    const den = jmenovatele[Math.floor(Math.random() * jmenovatele.length)];
    const num = Math.floor(Math.random() * (den - 1)) + 1; // 1 až den-1

    if (level === 1) {
      // "Kolik částí je zbarveno, pokud je celek rozdělen na {den} dílů a zbarveno je {num} dílů?"
      const correct = `${num}/${den}`;
      const d1 = `${num + 1}/${den}`;
      const d2 = `${num}/${den + 1}`;
      const d3 = `${den}/${num}`;

      tasks.push({
        question: `Celek je rozdělen na ${phrase(den, "STEJNÝ", "DÍL")}. Zbarveno ${num === 1 ? "je" : "jsou"} ${pad(num, "DÍL")}. Jaký zlomek představují zbarvené díly?`,
        correctAnswer: correct,
        options: shuffle([correct, d1, d2, d3]),
        hints: [
          `Zlomek = (počet zbarvených dílů) / (celkový počet dílů).`,
          `Čitatel je nahoře (zbarvené), jmenovatel dole (celkový počet).`,
        ],
        solutionSteps: [
          `Zbarveno: ${pad(num, "DÍL")} z celkových ${den}.`,
          `Zlomek = ${num}/${den}.`,
        ],
      });
    } else if (level === 2) {
      // Porovnání: který zlomek je větší?
      let num2 = Math.floor(Math.random() * (den - 1)) + 1;
      if (num2 === num) num2 = num === 1 ? 2 : num - 1;
      const [bigger, smaller] = num > num2 ? [num, num2] : [num2, num];
      const correct = `${bigger}/${den}`;

      tasks.push({
        question: `Který zlomek je větší: ${num}/${den} nebo ${num2}/${den}?`,
        correctAnswer: correct,
        options: shuffle([`${num}/${den}`, `${num2}/${den}`, `${den}/${bigger}`, `${smaller}/${den}`]),
        hints: [
          `Mají stejný jmenovatel (${den}) — srovnáváme jen čitatele.`,
          `Větší čitatel = větší část celku.`,
        ],
        solutionSteps: [
          `Jmenovatel ${den} je shodný.`,
          `${bigger} > ${smaller} → ${bigger}/${den} > ${smaller}/${den}.`,
        ],
      });
    } else {
      // Slovní úloha
      const items = [
        { name: "pizzy", action: "snědl" },
        { name: "čokolády", action: "snědl" },
        { name: "tyčinky", action: "snědl" },
        { name: "lentilkového sáčku", action: "vysypal" },
      ];
      const item = items[Math.floor(Math.random() * items.length)];
      const correct = `${num}/${den}`;
      const d1 = `${den - num}/${den}`;
      const d2 = `${num + 1}/${den}`;
      const d3 = `${num}/${den + 1}`;

      tasks.push({
        question: `Petr ${item.action} ${pad(num, "DÍL")} ${item.name} ${num === 1 ? "rozdělený" : "rozdělené"} na ${phrase(den, "STEJNÝ", "DÍL")}. Jaký zlomek ${item.name} snědl?`,
        correctAnswer: correct,
        options: shuffle([correct, d1, d2, d3]),
        hints: [
          `Jaký je celkový počet dílů? Kolik z nich snědl?`,
          `Zlomek = snědené díly / celkový počet dílů.`,
        ],
        solutionSteps: [
          `Celkem dílů: ${den}. Snězeno: ${num}.`,
          `Zlomek = ${num}/${den}.`,
        ],
      });
    }
  }

  return tasks;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ZLOMEK_CAST_CELKU: TopicMetadata[] = [
  {
    id: "g4-mat-zlomek-cast-celku-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-zlomky-zlomek-jako-cast-celku-znazorneni-zlomku",
    displayName: "Co je zlomek",
    title: "Zlomek jako část celku",
    studentTitle: "Co je zlomek",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Zlomky",
    briefDescription: "Pochopíš, co je zlomek — část celku.",
    keywords: [
      "zlomek", "čitatel", "jmenovatel", "část celku",
      "znázornění zlomku", "porovnání zlomků",
    ],
    goals: [
      "Zapsat zlomek z grafického nebo slovního rozdělení celku.",
      "Vysvětlit, co znamená čitatel a jmenovatel.",
      "Porovnat zlomky se stejným jmenovatelem.",
    ],
    boundaries: [
      "Pouze zlomky menší než 1 (vlastní zlomky).",
      "Nezahrnuje sčítání ani odčítání zlomků (to je samostatný topic).",
      "Nezahrnuje různé jmenovatele při porovnávání.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-mat-zlomky-scitani-odcitani-stejny-jmenovatel-4"],
    generator: gen,
    helpTemplate: {
      hint: "Zlomek a/b říká: vzal jsem a dílů z b stejných dílů celku. Čitatel (a) = kolik jsem vzal, jmenovatel (b) = na kolik dílů je celek rozdělen.",
      steps: [
        "Zjisti, na kolik stejných dílů je celek rozdělen → jmenovatel.",
        "Zjisti, kolik dílů tě zajímá → čitatel.",
        "Zapiš zlomek: čitatel / jmenovatel.",
      ],
      commonMistake: "Záměna čitatele a jmenovatele — děti píší dělení celkový/zbarvený místo zbarvený/celkový.",
      example: "Pizza je rozdělena na 8 dílů, Anička snědla 3 díly → snědla 3/8 pizzy.",
    },
  },
];
