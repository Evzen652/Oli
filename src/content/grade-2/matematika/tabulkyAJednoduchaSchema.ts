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
  hint: string;
  solution: string;
}

const POOL: PoolItem[] = [
  // Součet dvou hodnot
  { question: "V pondělí bylo 3 jablka, v úterý 5 jablek. Kolik jablek bylo celkem?", correct: 8, hint: "Přidej 3 a 5 dohromady. Kolik je 3 + 5?", solution: "3 jablka + 5 jablek = 8 jablek celkem." },
  { question: "Modrých kuliček je 4 a červených 6. Kolik jich je celkem?", correct: 10, hint: "Přidej 4 a 6 dohromady. Kolik je 4 + 6?", solution: "4 modré + 6 červených = 10 kuliček celkem." },
  { question: "V pondělí bylo 7 knih, ve středu 4 knihy. Kolik knih bylo celkem?", correct: 11, hint: "Přidej 7 a 4 dohromady. Kolik je 7 + 4?", solution: "7 knih + 4 knihy = 11 knih celkem." },
  { question: "Ve třídě je 12 dívek a 14 chlapců. Kolik žáků je celkem?", correct: 26, hint: "Přidej 12 a 14 dohromady. Kolik je 12 + 14?", solution: "12 dívek + 14 chlapců = 26 žáků celkem." },
  { question: "Malých krabic je 8 a velkých 9. Kolik krabic je celkem?", correct: 17, hint: "Přidej 8 a 9 dohromady. Kolik je 8 + 9?", solution: "8 malých + 9 velkých = 17 krabic celkem." },
  { question: "Ranní směna má 15 žáků a odpolední 13. Kolik žáků je celkem?", correct: 28, hint: "Přidej 15 a 13 dohromady. Kolik je 15 + 13?", solution: "15 žáků + 13 žáků = 28 žáků celkem." },
  { question: "V košíku je 18 jahod a 7 borůvek. Kolik ovoce je celkem?", correct: 25, hint: "Přidej 18 a 7 dohromady. Kolik je 18 + 7?", solution: "18 jahod + 7 borůvek = 25 kusů ovoce celkem." },
  { question: "Pes má 4 tlapy a kočka má 4 tlapy. Kolik tlapek mají dohromady?", correct: 8, hint: "Přidej 4 a 4 dohromady. Kolik je 4 + 4?", solution: "4 tlapy + 4 tlapy = 8 tlapek dohromady." },
  { question: "Červených aut je 9 a žlutých 11. Kolik aut je celkem?", correct: 20, hint: "Přidej 9 a 11 dohromady. Kolik je 9 + 11?", solution: "9 červených + 11 žlutých = 20 aut celkem." },
  { question: "Ve středu bylo 6 úloh a v pátek 8. Kolik úloh bylo celkem?", correct: 14, hint: "Přidej 6 a 8 dohromady. Kolik je 6 + 8?", solution: "6 úloh + 8 úloh = 14 úloh celkem." },
  // Chybějící hodnota
  { question: "Celkem je 10 kuliček. Modrých je 4. Kolik je červených?", correct: 6, hint: "Celkem 10, modrých 4. Odečti: 10 − 4 = ?", solution: "10 kuliček celkem − 4 modré = 6 červených." },
  { question: "V košíku je celkem 15 kusů ovoce. Jablek je 7. Kolik je hrušek?", correct: 8, hint: "Celkem 15, jablek 7. Odečti: 15 − 7 = ?", solution: "15 kusů celkem − 7 jablek = 8 hrušek." },
  { question: "Ve třídě je celkem 20 žáků. Kluků je 9. Kolik je dívek?", correct: 11, hint: "Celkem 20, kluků 9. Odečti: 20 − 9 = ?", solution: "20 žáků celkem − 9 kluků = 11 dívek." },
  { question: "Celkem je 12 krabic. Velkých je 5. Kolik je malých?", correct: 7, hint: "Celkem 12, velkých 5. Odečti: 12 − 5 = ?", solution: "12 krabic celkem − 5 velkých = 7 malých." },
  { question: "Za dva dny bylo celkem 25 žáků. V pondělí jich bylo 13. Kolik jich bylo v úterý?", correct: 12, hint: "Celkem 25, pondělí 13. Odečti: 25 − 13 = ?", solution: "25 celkem − 13 v pondělí = 12 v úterý." },
  { question: "Celkem je 30 kuliček. Červených je 18. Kolik je zelených?", correct: 12, hint: "Celkem 30, červených 18. Odečti: 30 − 18 = ?", solution: "30 celkem − 18 červených = 12 zelených." },
  { question: "Na dvorku je celkem 16 zvířat. Psů je 7. Kolik je koček?", correct: 9, hint: "Celkem 16, psů 7. Odečti: 16 − 7 = ?", solution: "16 zvířat celkem − 7 psů = 9 koček." },
  { question: "Ve třídě je celkem 22 žáků. Chlapců je 10. Kolik je dívek?", correct: 12, hint: "Celkem 22, chlapců 10. Odečti: 22 − 10 = ?", solution: "22 žáků celkem − 10 chlapců = 12 dívek." },
  { question: "Na parkovišti je celkem 18 vozidel. Aut je 11. Kolik je motorek?", correct: 7, hint: "Celkem 18, aut 11. Odečti: 18 − 11 = ?", solution: "18 vozidel celkem − 11 aut = 7 motorek." },
  { question: "Za dva dny bylo celkem 24 příkladů. V pondělí jich bylo 9. Kolik jich bylo v úterý?", correct: 15, hint: "Celkem 24, pondělí 9. Odečti: 24 − 9 = ?", solution: "24 celkem − 9 v pondělí = 15 v úterý." },
  // Čtení z tabulky
  { question: "V tabulce: pondělí 5, úterý 8, středa 3 žáků. Kolik jich bylo celkem?", correct: 16, hint: "Přidej 5 + 8 + 3 dohromady. Kolik je to celkem?", solution: "5 + 8 + 3 = 16 žáků celkem." },
  { question: "Jan má 4 body, Eva má 7 bodů. O kolik bodů má Eva víc?", correct: 3, hint: "Odečti: 7 − 4 = ? Tolik bodů má Eva navíc.", solution: "7 − 4 = 3 — Eva má o 3 body víc než Jan." },
  { question: "V tabulce: skupina A má 6 žáků, skupina B má 9. Kolik žáků je celkem?", correct: 15, hint: "Přidej 6 a 9 dohromady. Kolik je 6 + 9?", solution: "6 žáků + 9 žáků = 15 žáků celkem." },
  { question: "V tabulce: ráno přišlo 12 žáků, večer 8. Kolik přišlo celkem?", correct: 20, hint: "Přidej 12 a 8 dohromady. Kolik je 12 + 8?", solution: "12 ráno + 8 večer = 20 žáků celkem." },
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
      hints: [item.hint],
      solutionSteps: [item.solution],
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
