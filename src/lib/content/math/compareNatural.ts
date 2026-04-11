import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

function genCompareNatural100(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const max = level === 1 ? 20 : 100;
  for (let i = 0; i < 60; i++) {
    const a = Math.floor(Math.random() * max);
    let b = Math.floor(Math.random() * max);
    if (i === 2) b = a;
    const answer = a < b ? "<" : a > b ? ">" : "=";
    tasks.push({ question: `${a} ___ ${b}`, correctAnswer: answer, hints: [`Podívej se na čísla ${a} a ${b} — představ si je na číselné ose.`, `Které z nich je víc vpravo? ${a} nebo ${b}?`] });
  }
  return tasks;
}

const HELP_COMPARE_NAT_100: HelpData = {
  hint: "Představ si čísla na pravítku — které číslo je víc vpravo, to je větší.",
  steps: [
    "Přečti si obě čísla.",
    "Představ si je na pravítku nebo na číselné ose.",
    "Které je víc vpravo, to je větší. Které je víc vlevo, to je menší.",
  ],
  commonMistake: "Pozor na znaménka < a >. Představ si je jako zobáček — ten vždycky ukazuje k menšímu číslu. Třeba 5 > 3 — zobáček ukazuje ke trojce, která je menší.",
  example: "42 a 37 → 42 je víc vpravo, takže 42 > 37.",
  visualExamples: [
    {
      label: "Číselná osa — které číslo je víc vpravo?",
      illustration: "◀── 0 ── 10 ── 20 ── 30 ── 37 ── 42 ── 50 ──▶\n                              🔴       🟢\n                            menší    větší\n\n37 je víc vlevo → je menší\n42 je víc vpravo → je větší → 42 > 37",
    },
  ],
};

export const COMPARE_NATURAL_TOPICS: TopicMetadata[] = [
  {
    id: "math-compare-natural-numbers-100",
    title: "Porovnávání přirozených čísel do 100",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Porovnávání přirozených čísel do 100",
    briefDescription: "Procvičíš si, které ze dvou čísel do 100 je větší a které menší.",
    keywords: [
      "porovnávání", "porovnat", "větší", "menší", "rovná se",
      "větší než", "menší než", "které číslo je větší",
      "které číslo je menší", "porovnej",
    ],
    goals: ["Naučíš se správně určit, které ze dvou čísel do 100 je větší, menší, nebo jestli jsou stejná."],
    boundaries: [
      "Pouze čísla v rozsahu 0–100", "Porovnání právě dvou čísel",
      "Žádné sčítání, odčítání, násobení ani dělení",
      "Žádná záporná čísla", "Žádná desetinná čísla", "Žádné slovní úlohy",
      "Žádné číselné řady", "Žádné více než dvě čísla najednou",
      "Žádné vysvětlování pomocí jiných matematických témat",
    ],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "comparison",
    generator: genCompareNatural100,
    helpTemplate: HELP_COMPARE_NAT_100,
  },
];
