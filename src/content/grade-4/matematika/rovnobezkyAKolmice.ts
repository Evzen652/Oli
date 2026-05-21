import type { TopicMetadata, PracticeTask } from "@/lib/types";

// Factual / conceptual topic — úlohy testují porozumění pojmům.

const ROVNOBEZNE_PRIKLADY = [
  "koleje", "linky na zápisníku", "okraje stránky", "opačné stěny pokoje",
  "jízdní pruhy na dálnici", "vodorovné trámky žebříku",
];

const KOLME_PRIKLADY = [
  "rohy čtverce", "trámy a podlaha", "písmeno T", "kříž",
  "svislá zeď a vodorovná podlaha", "sloupek a příčka plotu",
];

const NECO_JINEHO = [
  "šikmé tyče plotu", "nepravidelné čáry", "hvězdné paprsky v různých úhlech",
  "vlnky na vodě", "schodišťové stupně (svislice a vodorovnice jsou kolmé, stupně šikmé)",
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 40; i++) {
    const type = i % 3; // 0=rovnoběžky, 1=kolmice, 2=ani-nor

    if (level === 1) {
      // Definice
      if (type === 0) {
        const ex = ROVNOBEZNE_PRIKLADY[i % ROVNOBEZNE_PRIKLADY.length];
        tasks.push({
          question: `Co platí o rovnoběžkách?`,
          correctAnswer: "Jsou stejně daleko od sebe a nikdy se neprotnou.",
          options: shuffle([
            "Jsou stejně daleko od sebe a nikdy se neprotnou.",
            "Svírají pravý úhel (90°).",
            "Vždy se protínají v jednom bodě.",
            "Jsou to přímky, které se kříží pod libovolným úhlem.",
          ]),
          hints: [`Rovnoběžky — myslíš na ${ex}.`],
          solutionSteps: ["Rovnoběžky = přímky ve stejné rovině, které se nikdy neprotnou a jsou všude stejně daleko."],
        });
      } else if (type === 1) {
        tasks.push({
          question: `Co platí o kolmicích?`,
          correctAnswer: "Svírají pravý úhel (90°).",
          options: shuffle([
            "Svírají pravý úhel (90°).",
            "Jsou stejně daleko od sebe a nikdy se neprotnou.",
            "Svírají úhel 45°.",
            "Nikdy se neprotnou.",
          ]),
          hints: ["Kolmice = dvě přímky, které se protínají pod pravým úhlem."],
          solutionSteps: ["Kolmice svírají úhel 90°. Označujeme: p ⊥ q."],
        });
      } else {
        tasks.push({
          question: `Jsou rovnoběžky a kolmice totéž?`,
          correctAnswer: "Ne — rovnoběžky se neprotnou, kolmice svírají 90°.",
          options: shuffle([
            "Ne — rovnoběžky se neprotnou, kolmice svírají 90°.",
            "Ano, oba pojmy znamenají totéž.",
            "Ano, pokud jsou obě přímky stejně dlouhé.",
            "Ne — rovnoběžky se protínají pod 45°.",
          ]),
          hints: ["Vzpomeň si: rovnoběžky nikdy neprotnou, kolmice svírají pravý úhel."],
          solutionSteps: ["Rovnoběžky ≠ kolmice. Jsou to různé vztahy mezi přímkami."],
        });
      }
    } else if (level === 2) {
      // Rozpoznání z příkladů
      const pool = [
        { example: ROVNOBEZNE_PRIKLADY[i % ROVNOBEZNE_PRIKLADY.length], correct: "Rovnoběžky" },
        { example: KOLME_PRIKLADY[i % KOLME_PRIKLADY.length], correct: "Kolmice" },
        { example: NECO_JINEHO[i % NECO_JINEHO.length], correct: "Ani rovnoběžky, ani kolmice" },
      ][type];
      tasks.push({
        question: `Jaký vztah mají přímky v tomto příkladu: „${pool.example}"?`,
        correctAnswer: pool.correct,
        options: ["Rovnoběžky", "Kolmice", "Ani rovnoběžky, ani kolmice", "Různoběžky (svírají jiný úhel)"],
        hints: ["Rovnoběžky = nikdy se neprotnou. Kolmice = protínají se pod 90°."],
        solutionSteps: [`„${pool.example}" → ${pool.correct}.`],
      });
    } else {
      // Úhel a počet os
      const angles = [90, 60, 45, 30, 120];
      const angle = angles[i % angles.length];
      tasks.push({
        question: `Dvě přímky se protínají pod úhlem ${angle}°. Jsou to kolmice?`,
        correctAnswer: angle === 90 ? "Ano" : "Ne",
        options: ["Ano", "Ne"],
        hints: ["Kolmice svírají přesně 90°."],
        solutionSteps: [angle === 90 ? "90° = pravý úhel → Ano, jsou to kolmice." : `${angle}° ≠ 90° → Ne.`],
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

export const ROVNOBEZKY_KOLMICE: TopicMetadata[] = [
  {
    id: "g4-mat-rovnobezky-kolmice-4",
    rvpNodeId: "g4-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-rovnobezky-a-kolmice",
    title: "Rovnoběžky a kolmice",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Rozlišíš rovnoběžky (přímky, které se nikdy neprotnou) a kolmice (přímky svírající pravý úhel 90°) — poznáš je v příkladech ze svého okolí.",
    keywords: [
      "rovnoběžky", "kolmice", "pravý úhel", "přímky", "90°",
      "geometrie", "průsečík",
    ],
    goals: [
      "Definovat rovnoběžky a kolmice.",
      "Rozpoznat rovnoběžky a kolmice v okolí (na předmětech, budovách).",
      "Určit, zda dvě přímky jsou rovnoběžné, kolmé nebo různoběžné.",
    ],
    boundaries: [
      "Pouze přímky v rovině (2D).",
      "Nezahrnuje prostorovou geometrii.",
      "Nezahrnuje konstrukci pravého úhlu kružítkem.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Rovnoběžky jsou jako koleje — nikdy se neprotnou a jsou všude stejně daleko. Kolmice jsou jako rohy místnosti — svírají přesně 90°.",
      steps: [
        "Rovnoběžky: stejný směr, konstantní vzdálenost, průsečík neexistuje.",
        "Kolmice: protínají se pod pravým úhlem (90°).",
        "Různoběžky: protínají se, ale ne pod 90°.",
      ],
      commonMistake: "Záměna rovnoběžek a kolmic — rovnoběžky se NEPROTNOU, kolmice se PROTNOU pod 90°.",
      example: "Koleje tramvaje = rovnoběžky. Roh pokoje (stěna a podlaha) = kolmice.",
    },
  },
];
