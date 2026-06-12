import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface TrueFalseItem {
  question: string;
  correct: boolean;
}

const POOL: TrueFalseItem[] = [
  // Přímka
  { question: "Přímka nemá konec. Pravda?", correct: true },
  { question: "Přímka jde oběma směry do nekonečna. Pravda?", correct: true },
  { question: "Přímka má 2 konce. Pravda?", correct: false },
  { question: "Přímka je část úsečky. Pravda?", correct: false },
  // Úsečka
  { question: "Úsečka má 2 konce. Pravda?", correct: true },
  { question: "Úsečka má konečnou délku. Pravda?", correct: true },
  { question: "Úsečka AB je stejná jako úsečka BA. Pravda?", correct: true },
  { question: "Úsečka nemá žádný konec. Pravda?", correct: false },
  { question: "Úsečka je nekonečně dlouhá. Pravda?", correct: false },
  // Bod
  { question: "Bod je místo v prostoru. Pravda?", correct: true },
  { question: "Bod označujeme velkým písmenem. Pravda?", correct: true },
  { question: "Bod je větší než tečka. Pravda?", correct: false },
  { question: "Bod má délku i šířku. Pravda?", correct: false },
  // Polopřímka
  { question: "Polopřímka má 1 konec. Pravda?", correct: true },
  { question: "Polopřímka začíná v bodě a jde do nekonečna. Pravda?", correct: true },
  { question: "Polopřímka má 2 konce jako úsečka. Pravda?", correct: false },
  // Kombinace
  { question: "Přímka i úsečka jsou rovné čáry. Pravda?", correct: true },
  { question: "Úsečka je část přímky. Pravda?", correct: true },
  { question: "Polopřímka je kratší než úsečka. Pravda?", correct: false },
  { question: "Bod leží na přímce. Pravda?", correct: true },
];

function gen(_level: number): PracticeTask[] {
  const shuffled = shuffle(POOL);
  return shuffled.slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? "Pravda" : "Nepravda",
    options: ["Pravda", "Nepravda"],
    hints: [`Přímka = bez konce. Úsečka = 2 konce. Polopřímka = 1 konec.`],
    solutionSteps: [item.correct ? "Ano, je to pravda." : "Ne, není to pravda."],
  }));
}

export const BODPRIMKAUSECKA: TopicMetadata[] = [
  {
    id: "g2-mat-bod-primka-usecka",
    rvpNodeId:
      "g2-matematika-geometrie-v-rovine-a-v-prostoru-body-primky-usecky-bod-primka-poloprimka-usecka",
    title: "Bod, přímka, polopřímka, úsečka",
    studentTitle: "Bod, přímka, úsečka",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Body, přímky, úsečky",
    briefDescription: "Poznáš rozdíl mezi přímkou, úsečkou a bodem.",
    keywords: ["bod", "přímka", "úsečka", "polopřímka", "geometrie"],
    goals: [
      "Rozlišit bod, přímku, polopřímku a úsečku.",
      "Vědět, že přímka nemá konec a úsečka má 2 konce.",
      "Pochopit, že polopřímka má 1 konec.",
    ],
    boundaries: ["Pouze definice a vlastnosti.", "Bez rýsování."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Přímka = nekonečná. Úsečka = 2 konce. Polopřímka = 1 konec.",
      steps: [
        "Přímka jde do nekonečna oběma směry.",
        "Úsečka má pevný začátek i konec (2 body).",
        "Polopřímka začíná v bodě a jde jedním směrem do nekonečna.",
      ],
      commonMistake: "Záměna přímky a úsečky — přímka NEMÁ konce, úsečka MÁ 2 konce.",
      example: "Silnice na mapě = úsečka (má začátek a konec). Světelný paprsek = polopřímka.",
    },
  },
];
