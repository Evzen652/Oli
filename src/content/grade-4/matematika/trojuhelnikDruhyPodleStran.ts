import type { TopicMetadata, PracticeTask } from "@/lib/types";

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // level 1: rozpoznání druhu trojúhelníku ze zadaných délek stran
  // level 2: vlastnosti + výpočet obvodu
  // level 3: mix + určení druhu z nerovnosti stran

  for (let i = 0; i < 40; i++) {
    const typeIdx = i % 3; // 0=rovnostranný, 1=rovnoramenný, 2=různostranný

    if (level === 1) {
      // Zadány délky → druh
      const specs = [
        { sides: [5, 5, 5] as [number, number, number], kind: "Rovnostranný" },
        { sides: [6, 6, 4] as [number, number, number], kind: "Rovnoramenný" },
        { sides: [3, 5, 7] as [number, number, number], kind: "Různostranný" },
      ][typeIdx];
      tasks.push({
        question: `Trojúhelník má strany ${specs.sides.join(" cm, ")} cm. Jak se jmenuje?`,
        correctAnswer: specs.kind,
        options: ["Rovnostranný", "Rovnoramenný", "Různostranný", "Pravúhlý"],
        hints: [
          "Rovnostranný = všechny 3 strany stejně dlouhé.",
          "Rovnoramenný = právě 2 strany stejně dlouhé.",
          "Různostranný = všechny strany různě dlouhé.",
        ],
        solutionSteps: [
          `Strany: ${specs.sides.join(", ")} cm.`,
          `${specs.kind === "Rovnostranný" ? "Všechny strany stejné." : specs.kind === "Rovnoramenný" ? "Dvě strany stejné." : "Všechny strany různé."}`,
          `→ ${specs.kind}.`,
        ],
      });
    } else if (level === 2) {
      // Obvod trojúhelníku + druh
      const a = Math.floor(Math.random() * 10) + 3;
      const configs: { sides: [number, number, number]; kind: string }[] = [
        { sides: [a, a, a], kind: "Rovnostranný" },
        { sides: [a, a, Math.floor(a * 0.8)], kind: "Rovnoramenný" },
        { sides: [a, a + 2, a + 4], kind: "Různostranný" },
      ];
      const cfg = configs[typeIdx];
      const obvod = cfg.sides.reduce((s, x) => s + x, 0);
      const isObvodQ = Math.random() < 0.6;
      if (isObvodQ) {
        tasks.push({
          question: `${cfg.kind} trojúhelník má strany ${cfg.sides.join(" cm, ")} cm. Jaký je jeho obvod?`,
          correctAnswer: String(obvod),
          options: shuffle([String(obvod), String(obvod + a), String(obvod - 1), String(a * 3)].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4)),
          hints: ["Obvod trojúhelníku = součet všech tří stran."],
          solutionSteps: [`O = ${cfg.sides.join(" + ")} = ${obvod} cm`],
        });
      } else {
        tasks.push({
          question: `Jaký druh trojúhelníku má strany ${cfg.sides.join(" cm, ")} cm?`,
          correctAnswer: cfg.kind,
          options: ["Rovnostranný", "Rovnoramenný", "Různostranný"],
          hints: ["Porovnej délky stran."],
          solutionSteps: [`${cfg.sides.join(", ")} → ${cfg.kind}.`],
        });
      }
    } else {
      // Neurčen druh — žák musí odvodit z nerovnosti
      const questions = [
        { q: "Může mít trojúhelník dvě stejné strany a jednu delší?", a: "Ano — rovnoramenný trojúhelník." },
        { q: "Má rovnostranný trojúhelník všechny úhly stejné?", a: "Ano — každý úhel je 60°." },
        { q: "Může mít různostranný trojúhelník dvě strany stejně dlouhé?", a: "Ne — pak by byl rovnoramenný." },
        { q: "Kolik os souměrnosti má rovnostranný trojúhelník?", a: "3" },
        { q: "Kolik os souměrnosti má rovnoramenný trojúhelník?", a: "1" },
        { q: "Kolik os souměrnosti má různostranný trojúhelník?", a: "0" },
      ];
      const q = questions[i % questions.length];
      const others = questions.filter(x => x.a !== q.a).map(x => x.a).slice(0, 3);
      tasks.push({
        question: q.q,
        correctAnswer: q.a,
        options: shuffle([q.a, ...others].slice(0, 4)),
        hints: ["Vzpomeň si na definici rovnostranného, rovnoramenného a různostranného trojúhelníku."],
        solutionSteps: [q.a],
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

export const TROJUHELNIK_DRUHY: TopicMetadata[] = [
  {
    id: "g4-mat-trojuhelnik-druhy-stran-4",
    rvpNodeId: "g4-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-trojuhelnik-druhy-podle-stran",
    title: "Trojúhelník — druhy podle stran",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Rozlišíš rovnostranný, rovnoramenný a různostranný trojúhelník — poznáš jeho druh podle délek stran a spočítáš obvod.",
    keywords: [
      "trojúhelník", "rovnostranný", "rovnoramenný", "různostranný",
      "strany trojúhelníku", "obvod trojúhelníku",
    ],
    goals: [
      "Rozlišit trojúhelníky podle délek stran: rovnostranný, rovnoramenný, různostranný.",
      "Vypočítat obvod trojúhelníku.",
      "Určit počet os souměrnosti každého druhu trojúhelníku.",
    ],
    boundaries: [
      "Pouze třídění podle stran (ne podle úhlů).",
      "Nezahrnuje výpočet obsahu trojúhelníku.",
      "Nezahrnuje Pythagorovu větu.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Rovnostranný = všechny 3 strany stejně dlouhé. Rovnoramenný = právě 2 strany stejné. Různostranný = všechny strany různé.",
      steps: [
        "Zapiš délky všech tří stran.",
        "Porovnej: jsou všechny 3 stejné? → Rovnostranný.",
        "Jsou právě 2 stejné? → Rovnoramenný.",
        "Jsou všechny různé? → Různostranný.",
      ],
      commonMistake: "Záměna rovnostranného a rovnoramenného — rovnostranný má VŠECHNY 3 strany stejné.",
      example: "Strany 5, 5, 5 cm → rovnostranný. Strany 7, 7, 4 cm → rovnoramenný. Strany 3, 5, 6 cm → různostranný.",
    },
  },
];
