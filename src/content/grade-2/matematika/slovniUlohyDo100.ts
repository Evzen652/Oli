import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PoolItem {
  question: string;
  correct: number;
}

const POOL: PoolItem[] = [
  // Peníze
  { question: "Máš 35 Kč. Koupíš za 12 Kč. Zbyde:", correct: 23 },
  { question: "Máš 50 Kč. Koupíš za 27 Kč. Zbyde:", correct: 23 },
  { question: "Máš 40 Kč. Koupíš za 15 Kč. Zbyde:", correct: 25 },
  { question: "Máš 60 Kč. Koupíš za 34 Kč. Zbyde:", correct: 26 },
  { question: "Máš 20 Kč. Koupíš za 8 Kč. Zbyde:", correct: 12 },
  { question: "Máš 45 Kč a dostaneš 10 Kč. Máš celkem:", correct: 55 },
  { question: "Máš 30 Kč a dostaneš 25 Kč. Máš celkem:", correct: 55 },
  // Příroda
  { question: "V lese je 24 stromů. Přibyde 8. Celkem:", correct: 32 },
  { question: "Na stromě sedí 15 ptáků. 7 odletí. Zbyde:", correct: 8 },
  { question: "V zahradě je 18 květin. 6 uschne. Zbyde:", correct: 12 },
  { question: "V řece je 30 ryb. Připluje 14. Celkem:", correct: 44 },
  { question: "Na louce je 25 motýlů. Odletí 9. Zbyde:", correct: 16 },
  { question: "Na větvi sedí 12 ptáků. Přiletí 5. Celkem:", correct: 17 },
  // Hry
  { question: "Máš 17 kartiček. Vyhraješ 8. Máš celkem:", correct: 25 },
  { question: "Máš 20 kartiček. Prohraješ 7. Zbyde:", correct: 13 },
  { question: "Hodíš kostkou 4 a 6. Celkem:", correct: 10 },
  { question: "Skóre: 15 bodů + 23 bodů. Celkem:", correct: 38 },
  { question: "Máš 50 bodů. Ztratíš 18. Zbyde:", correct: 32 },
  // Jídlo
  { question: "Je 24 jablek. Sní se 9. Zbyde:", correct: 15 },
  { question: "Je 16 rohlíků. Přijde 7 nových. Celkem:", correct: 23 },
  { question: "Je 30 bonbónů. Dáš 12 kamarádovi. Zbyde:", correct: 18 },
  { question: "Je 45 jahod. Sní se 17. Zbyde:", correct: 28 },
  { question: "Je 20 sušenek. Přibyde 15. Celkem:", correct: 35 },
  // Škola / ostatní
  { question: "Ve třídě je 26 žáků. Přijdou 4 noví. Celkem:", correct: 30 },
  { question: "Ve třídě je 28 žáků. 3 onemocní. Zbyde:", correct: 25 },
  { question: "V knihovně je 33 knih. Přibyde 7. Celkem:", correct: 40 },
  { question: "Autobus má 40 míst. Sedí 27 lidí. Volných:", correct: 13 },
  { question: "Na zastávce čeká 8 lidí. Přijde 14 dalších. Celkem:", correct: 22 },
  { question: "Ujedeš 56 km. Pak jedeš 18 km. Celkem:", correct: 74 },
  { question: "Do cíle zbývá 63 km. Ujedeš 27 km. Zbývá:", correct: 36 },
];

function gen(level: number): PracticeTask[] {
  const shuffled = shuffle(POOL);
  const selected = shuffled.slice(0, 25);

  return selected.map(item => {
    const c = item.correct;
    const d1 = c + 1;
    const d2 = c - 1 >= 0 ? c - 1 : c + 2;
    const d3 = c + 10 <= 100 ? c + 10 : c - 10;

    const opts = shuffle(
      [String(c), String(d1), String(d2), String(d3)]
        .filter((v, i, a) => a.indexOf(v) === i && Number(v) >= 0)
        .slice(0, 4)
    );

    return {
      question: item.question,
      correctAnswer: String(c),
      options: opts,
      hints: [`Přečti otázku znovu. Co přidáváme nebo ubíráme?`],
      solutionSteps: [`Odpověď: ${c}`],
    };
  });
}

export const SLOVNIULOHYDO100: TopicMetadata[] = [
  {
    id: "g2-mat-slovni-ulohy-100",
    rvpNodeId:
      "g2-matematika-nestandardni-aplikacni-ulohy-a-problemy-slovni-ulohy-slovni-ulohy-se-vsemi-typy-operaci-do-100",
    title: "Slovní úlohy se všemi typy operací do 100",
    studentTitle: "Slovní úlohy",
    subject: "matematika",
    category: "Nestandardní aplikační úlohy a problémy",
    topic: "Slovní úlohy",
    briefDescription: "Řešíš krátké příklady ze života do 100.",
    keywords: ["slovní úloha", "příklad", "počítání", "sčítání", "odčítání", "Kč"],
    goals: [
      "Pochopit zadání krátké slovní úlohy.",
      "Vybrat správnou operaci (sčítání nebo odčítání).",
      "Spočítat výsledek v oboru do 100.",
    ],
    boundaries: ["Pouze sčítání a odčítání.", "Čísla do 100."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Přečti, co přibývá nebo ubývá — to ti řekne, zda sčítat nebo odčítat.",
      steps: [
        "Přečti otázku.",
        "Přibývá? → Sčítej. Ubývá? → Odčítej.",
        "Spočítej a zkontroluj.",
      ],
      commonMistake: "Záměna sčítání a odčítání — slova 'zbyde', 'odletí', 'prohraješ' = odčítání.",
      example: "Máš 35 Kč, koupíš za 12 Kč. Zbyde: 35 − 12 = 23 Kč.",
    },
  },
];
