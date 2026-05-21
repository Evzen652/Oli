import type { TopicMetadata, PracticeTask } from "@/lib/types";

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // level 1: sčítání, jmenovatel 4–8, výsledek < 1
  // level 2: odčítání i sčítání, jmenovatel 5–12, výsledek může být roven 1
  // level 3: mix, výsledek jako smíšené číslo nebo 1, zjednodušení

  const jmenovatele = [
    ...(level === 1 ? [4, 5, 6, 8] : []),
    ...(level >= 2 ? [5, 6, 8, 10, 12] : []),
    ...(level === 3 ? [3, 7, 9] : []),
  ];

  for (let i = 0; i < 40; i++) {
    const den = jmenovatele[Math.floor(Math.random() * jmenovatele.length)];
    const isAdd = level === 1 ? true : Math.random() < 0.5;

    let num1: number, num2: number;

    if (isAdd) {
      num1 = Math.floor(Math.random() * (den - 2)) + 1; // 1..den-2
      const maxNum2 = level === 1 ? den - num1 - 1 : den - num1;
      num2 = Math.floor(Math.random() * maxNum2) + 1;
    } else {
      num1 = Math.floor(Math.random() * (den - 1)) + 2; // 2..den
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1..num1-1
    }

    const resultNum = isAdd ? num1 + num2 : num1 - num2;
    const op = isAdd ? "+" : "−";

    // Výsledek jako zlomek nebo 1 nebo zjednodušený
    let correctStr: string;
    if (resultNum === den) {
      correctStr = "1";
    } else if (resultNum === 0) {
      correctStr = "0";
    } else {
      const g = gcd(resultNum, den);
      correctStr = g > 1 ? `${resultNum / g}/${den / g}` : `${resultNum}/${den}`;
    }

    // Distraktory
    const d1 = `${resultNum + 1}/${den}`;
    const d2 = `${resultNum}/${den + 1}`;
    const d3 = isAdd ? `${num1 * num2}/${den * den}` : `${num1 + num2}/${den}`;

    tasks.push({
      question: `${num1}/${den} ${op} ${num2}/${den} = ?`,
      correctAnswer: correctStr,
      options: shuffle([correctStr, d1, d2, d3].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
      hints: [
        `Jmenovatel (${den}) zůstane stejný — pracujeme jen s čitateli.`,
        isAdd
          ? `Sečteme čitatele: ${num1} + ${num2} = ${resultNum}.`
          : `Odečteme čitatele: ${num1} − ${num2} = ${resultNum}.`,
      ],
      solutionSteps: [
        `${num1}/${den} ${op} ${num2}/${den}`,
        `= (${num1} ${op} ${num2}) / ${den}`,
        `= ${resultNum}/${den}${correctStr !== `${resultNum}/${den}` ? ` = ${correctStr}` : ""}`,
      ],
    });
  }

  return tasks;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const SCITANI_ODCITANI_ZLOMKU: TopicMetadata[] = [
  {
    id: "g4-mat-zlomky-scitani-odcitani-stejny-jmenovatel-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-zlomky-scitani-a-odcitani-zlomku-se-stejnym-jmenovatelem",
    title: "Sčítání a odčítání zlomků se stejným jmenovatelem",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Zlomky",
    briefDescription: "Žák sčítá a odčítá zlomky se stejným jmenovatelem — jmenovatel zachová, operaci provede jen s čitateli, výsledek případně zjednodušní.",
    keywords: [
      "zlomky", "sčítání zlomků", "odčítání zlomků",
      "stejný jmenovatel", "čitatel", "jmenovatel", "zjednodušení",
    ],
    goals: [
      "Sečíst dvě lomeniny se stejným jmenovatelem.",
      "Odečíst dvě lomeniny se stejným jmenovatelem.",
      "Zjednodušit výsledný zlomek (je-li to možné).",
    ],
    boundaries: [
      "Pouze zlomky se stejným jmenovatelem.",
      "Nezahrnuje zlomky s různým jmenovatelem.",
      "Nezahrnuje násobení ani dělení zlomků.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Při sčítání/odčítání zlomků se stejným jmenovatelem: jmenovatel nechej stejný, sečti/odečti jen čitatele.",
      steps: [
        "Zkontroluj, že oba zlomky mají stejný jmenovatel.",
        "Sečti nebo odečti čitatele.",
        "Jmenovatel zůstane beze změny.",
        "Pokud lze výsledný zlomek zjednodušit (čitatel i jmenovatel dělitelné stejným číslem), zjednodušíme.",
      ],
      commonMistake: "Sčítání jmenovatelů: žáci píší 1/4 + 1/4 = 2/8 místo 2/4.",
      example: "3/8 + 2/8 = (3+2)/8 = 5/8. Nebo: 5/6 − 2/6 = 3/6 = 1/2.",
    },
  },
];
