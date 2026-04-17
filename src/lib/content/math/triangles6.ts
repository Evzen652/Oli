import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Trojúhelníky — 6. ročník ZŠ
 * RVP M-6-3
 *
 * Typy úloh:
 *   1) Druh trojúhelníku podle stran (rovnoramenný, rovnostranný, obecný)
 *   2) Druh podle úhlů (ostroúhlý, pravoúhlý, tupoúhlý)
 *   3) Trojúhelníková nerovnost (a + b > c)
 */

function genByStrany(_level: number): PracticeTask {
  const variant = Math.random();
  let a: number, b: number, c: number;
  let correct: string;
  if (variant < 0.33) {
    // Rovnostranný
    a = b = c = 3 + Math.floor(Math.random() * 10);
    correct = "rovnostranný";
  } else if (variant < 0.67) {
    // Rovnoramenný (2 stejné strany)
    a = 3 + Math.floor(Math.random() * 10);
    b = a;
    c = Math.max(2, a + Math.floor(Math.random() * 7) - 3);
    if (c === a) c = a + 1;
    correct = "rovnoramenný";
  } else {
    // Obecný — všechny různé
    a = 4 + Math.floor(Math.random() * 6);
    b = a + 1 + Math.floor(Math.random() * 4);
    c = b + 1 + Math.floor(Math.random() * 4);
    correct = "obecný";
  }

  return {
    question: `Trojúhelník má strany ${a}, ${b} a ${c} cm. Jaký je to trojúhelník podle stran?`,
    correctAnswer: correct,
    options: ["rovnostranný", "rovnoramenný", "obecný"],
    solutionSteps: [
      a === b && b === c
        ? `Všechny tři strany jsou ROVNÉ (${a} = ${b} = ${c}) → rovnostranný.`
        : a === b || b === c || a === c
          ? `Dvě strany jsou rovné → rovnoramenný.`
          : `Všechny tři strany jsou RŮZNÉ → obecný.`,
    ],
    hints: [
      `Porovnej délky stran — kolik je STEJNÝCH?`,
      `3 stejné = rovnostranný. 2 stejné = rovnoramenný. 0 stejných = obecný.`,
    ],
  };
}

function genByUhly(_level: number): PracticeTask {
  const variant = Math.random();
  let a: number, b: number, c: number;
  let correct: string;
  if (variant < 0.3) {
    // Ostroúhlý — všechny < 90°
    a = 30 + Math.floor(Math.random() * 40);
    b = 30 + Math.floor(Math.random() * (89 - a));
    c = 180 - a - b;
    while (c < 30 || c > 89) {
      a = 30 + Math.floor(Math.random() * 40);
      b = 30 + Math.floor(Math.random() * (89 - a));
      c = 180 - a - b;
    }
    correct = "ostroúhlý";
  } else if (variant < 0.6) {
    // Pravoúhlý — jeden 90°
    a = 90;
    b = 20 + Math.floor(Math.random() * 60);
    c = 180 - a - b;
    correct = "pravoúhlý";
  } else {
    // Tupoúhlý — jeden > 90°
    a = 95 + Math.floor(Math.random() * 50);
    b = 20 + Math.floor(Math.random() * (179 - a - 20));
    c = 180 - a - b;
    correct = "tupoúhlý";
  }

  return {
    question: `Trojúhelník má úhly ${a}°, ${b}° a ${c}°. Jaký je to trojúhelník podle úhlů?`,
    correctAnswer: correct,
    options: ["ostroúhlý", "pravoúhlý", "tupoúhlý"],
    solutionSteps: [
      `Zkontroluj úhly: ${a}°, ${b}°, ${c}°.`,
      correct === "pravoúhlý"
        ? `Jeden úhel je 90° → pravoúhlý.`
        : correct === "tupoúhlý"
          ? `Jeden úhel je VĚTŠÍ než 90° → tupoúhlý.`
          : `Všechny úhly jsou MENŠÍ než 90° → ostroúhlý.`,
    ],
    hints: [
      `Hledej největší úhel. Je roven 90°? Větší? Menší?`,
      `90° = pravoúhlý. >90° = tupoúhlý. Všechny <90° = ostroúhlý.`,
    ],
  };
}

function genNerovnost(_level: number): PracticeTask {
  // Otestuj, zda lze z daných stran sestrojit trojúhelník
  const a = 3 + Math.floor(Math.random() * 10);
  const b = 3 + Math.floor(Math.random() * 10);
  let c: number;
  let valid: boolean;
  if (Math.random() > 0.5) {
    // Platí nerovnost (c < a+b)
    c = Math.max(1, Math.abs(a - b) + 1 + Math.floor(Math.random() * (a + b - Math.abs(a - b) - 2)));
    valid = true;
  } else {
    // Nevalidní (c ≥ a+b)
    c = a + b + Math.floor(Math.random() * 5);
    valid = false;
  }

  return {
    question: `Lze sestrojit trojúhelník se stranami ${a}, ${b} a ${c} cm?`,
    correctAnswer: valid ? "ANO" : "NE",
    options: ["ANO", "NE"],
    solutionSteps: [
      `Trojúhelníková nerovnost: součet dvou stran MUSÍ BÝT VĚTŠÍ než třetí.`,
      `${a} + ${b} = ${a + b}. Je to > ${c}? ${a + b > c ? "ANO" : "NE"}.`,
      `${a} + ${c} = ${a + c}. Je to > ${b}? ${a + c > b ? "ANO" : "NE"}.`,
      `${b} + ${c} = ${b + c}. Je to > ${a}? ${b + c > a ? "ANO" : "NE"}.`,
      valid
        ? `Všechny nerovnosti platí → trojúhelník LZE sestrojit.`
        : `Alespoň jedna nerovnost NEPLATÍ → trojúhelník NELZE sestrojit.`,
    ],
    hints: [
      `Pravidlo: součet KAŽDÝCH dvou stran MUSÍ BÝT VĚTŠÍ než třetí.`,
      `Zkontroluj: ${a} + ${b} > ${c}? Pokud ne, není trojúhelník.`,
    ],
  };
}

function genTriangles6(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 25; i++) tasks.push(genByStrany(level));
  for (let i = 0; i < 20; i++) tasks.push(genByUhly(level));
  for (let i = 0; i < 15; i++) tasks.push(genNerovnost(level));
  return tasks.sort(() => Math.random() - 0.5);
}

const HELP_TRIANGLES_6: HelpData = {
  hint:
    "Trojúhelník rozeznáváme podle STRAN (rovnostranný/rovnoramenný/obecný) a podle ÚHLŮ (ostro-/pravo-/tupoúhlý). Navíc musí platit trojúhelníková nerovnost.",
  steps: [
    "Podle stran: spočítej, kolik stran je stejných (3/2/0).",
    "Podle úhlů: najdi největší úhel (=/>/< 90°).",
    "Trojúhelníková nerovnost: součet dvou stran > třetí.",
    "Součet úhlů: VŽDY 180°.",
  ],
  commonMistake:
    "Rovnostranný trojúhelník je zároveň rovnoramenný (má 2 rovné strany — dokonce 3).\nPravoúhlý trojúhelník může být zároveň rovnoramenný (45°-45°-90°).",
  example:
    "Strany 5, 5, 5 → rovnostranný (i rovnoramenný).\nStrany 4, 4, 6 → rovnoramenný.\nStrany 3, 4, 5 → obecný + pravoúhlý (3² + 4² = 5²).\nStrany 2, 3, 8 → NELZE! (2+3=5, ale 5 < 8)",
  visualExamples: [
    {
      label: "Trojúhelníky podle stran",
      illustration:
        "  Rovnostranný      Rovnoramenný        Obecný\n  (3 stejné)       (2 stejné)          (všechny různé)\n\n       △                △                    △\n      ╱ ╲              ╱ ╲                  ╱   ╲\n     ╱   ╲            ╱   ╲                ╱     ╲\n    ╱_____╲          ╱_____╲              ╱_______╲\n\n     5 5 5            5 5 3                4 5 6",
      conclusion: "Spočítej stejné strany → to rozhodne.",
    },
    {
      label: "Trojúhelníky podle úhlů",
      illustration:
        "  Ostroúhlý       Pravoúhlý       Tupoúhlý\n  (všechny <90°)   (jeden =90°)    (jeden >90°)\n\n     60°               90°              120°\n    ╱   ╲             │ ╲               ╱─────\n   ╱     ╲            │  ╲             ╱\n  ╱_______╲           │___╲           ╱─",
      conclusion: "Největší úhel rozhodne.",
    },
    {
      label: "Trojúhelníková nerovnost",
      illustration:
        "Strany 3, 4, 5:\n  3 + 4 = 7 > 5  ✓\n  3 + 5 = 8 > 4  ✓\n  4 + 5 = 9 > 3  ✓\n  → trojúhelník LZE sestrojit\n\nStrany 2, 3, 8:\n  2 + 3 = 5, ale 5 < 8 ✗\n  → trojúhelník NELZE sestrojit\n  (dvě krátké strany nedosáhnou na sebe)",
      conclusion: "Součet každých dvou stran MUSÍ BÝT VĚTŠÍ než třetí.",
    },
  ],
};

export const TRIANGLES_6_TOPICS: TopicMetadata[] = [
  {
    id: "math-triangles-6",
    title: "Trojúhelníky",
    subject: "matematika",
    category: "Geometrie",
    topic: "Trojúhelníky",
    topicDescription:
      "Druhy trojúhelníků podle stran a podle úhlů, trojúhelníková nerovnost.",
    briefDescription:
      "Naučíš se druhy trojúhelníků (rovnostranný, rovnoramenný, obecný; ostro-, pravo-, tupoúhlý) a kdy vůbec trojúhelník existuje.",
    keywords: [
      "trojúhelník",
      "rovnostranný",
      "rovnoramenný",
      "ostroúhlý",
      "pravoúhlý",
      "tupoúhlý",
      "trojúhelníková nerovnost",
    ],
    goals: [
      "Rozpoznáš druh trojúhelníku podle stran.",
      "Rozpoznáš druh trojúhelníku podle úhlů.",
      "Použiješ trojúhelníkovou nerovnost.",
    ],
    boundaries: [
      "Bez konstrukce (rýsování).",
      "Bez Pythagorovy věty (to je 8. roč.).",
    ],
    gradeRange: [6, 7],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genTriangles6,
    helpTemplate: HELP_TRIANGLES_6,
    contentType: "algorithmic",
    prerequisites: ["math-angles-6", "math-perimeter-4"],
    rvpReference: "M-6-3-02",
  },
];
