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
  // Součet dvou hodnot
  { question: "Pondělí: 3 jablka. Úterý: 5 jablek. Celkem:", correct: 8 },
  { question: "Modrých: 4. Červených: 6. Celkem:", correct: 10 },
  { question: "Pondělí: 7 knih. Středa: 4 knihy. Celkem:", correct: 11 },
  { question: "Dívky: 12. Chlapci: 14. Celkem:", correct: 26 },
  { question: "Malých: 8. Velkých: 9. Celkem:", correct: 17 },
  { question: "Ranní: 15 žáků. Odpolední: 13 žáků. Celkem:", correct: 28 },
  { question: "Jahody: 18. Borůvky: 7. Celkem:", correct: 25 },
  { question: "Pes: 4 tlapy. Kočka: 4 tlapy. Celkem:", correct: 8 },
  { question: "Červené: 9. Žluté: 11. Celkem:", correct: 20 },
  { question: "Středa: 6 úloh. Pátek: 8 úloh. Celkem:", correct: 14 },
  // Rozdíl — chybějící hodnota
  { question: "Celkem 10. Modrých 4. Červených:", correct: 6 },
  { question: "Celkem 15. Jablek 7. Hrušek:", correct: 8 },
  { question: "Celkem 20. Kluků 9. Dívek:", correct: 11 },
  { question: "Celkem 12. Velkých 5. Malých:", correct: 7 },
  { question: "Celkem 25. Pondělí 13. Úterý:", correct: 12 },
  { question: "Celkem 30. Červených 18. Zelených:", correct: 12 },
  { question: "Celkem 16. Psů 7. Koček:", correct: 9 },
  { question: "Celkem 22. Chlapců 10. Dívek:", correct: 12 },
  { question: "Celkem 18. Aut 11. Motorek:", correct: 7 },
  { question: "Celkem 24. Pondělí 9. Úterý:", correct: 15 },
  // Čtení z tabulky
  { question: "Pondělí: 5, Úterý: 8, Středa: 3. Celkem:", correct: 16 },
  { question: "Jan: 4 body. Eva: 7 bodů. Kdo má víc? (zadej rozdíl)", correct: 3 },
  { question: "Tabulka: A=6, B=9. Celkem A+B:", correct: 15 },
  { question: "Tabulka: Ráno 12, Večer 8. Celkem:", correct: 20 },
];

function gen(_level: number): PracticeTask[] {
  const shuffled = shuffle(POOL);
  return shuffled.slice(0, 20).map(item => {
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
      hints: [`Sečti nebo odečti čísla z tabulky.`],
      solutionSteps: [`Odpověď: ${c}`],
    };
  });
}

export const TABULKYAJEDNODUCHASHEMA: TopicMetadata[] = [
  {
    id: "g2-mat-tabulky",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-tabulky-a-jednoducha-schemata",
    title: "Tabulky a jednoduchá schémata",
    studentTitle: "Tabulky",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Přečteš data z tabulky a spočítáš výsledek.",
    keywords: ["tabulka", "schéma", "data", "čtení tabulky", "součet"],
    goals: [
      "Přečíst hodnoty z jednoduché tabulky.",
      "Sečíst nebo odečíst hodnoty z tabulky.",
      "Najít chybějící hodnotu v tabulce.",
    ],
    boundaries: ["Pouze 2–3 řádky.", "Čísla do 100."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Najdi čísla v tabulce a sečti nebo odečti.",
      steps: [
        "Přečti všechna čísla v tabulce.",
        "Urči, zda sčítáš nebo hledáš rozdíl.",
        "Spočítej.",
      ],
      commonMistake: "Přehlédnutí jedné hodnoty — pročti tabulku znovu.",
      example: "Pondělí: 3, Úterý: 5. Celkem: 3 + 5 = 8.",
    },
  },
];
