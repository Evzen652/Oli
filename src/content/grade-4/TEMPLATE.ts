/**
 * ŠABLONA pro nový topic v grade-4. Architekt vlastní šablonu, grade-4 ji KOPÍRUJE.
 *
 * Postup:
 *   1. Najdi si RVP uzel: `getNodesByGradeSubject(4, 'matematika')` v `src/content/curriculum.ts`
 *   2. Zkopíruj tento soubor jako `src/content/grade-4/matematika/{tema-slug}.ts`
 *   3. Vyplň všechny `TODO:` značky podle reálného obsahu
 *   4. Napiš unit testy do `src/content/grade-4/__tests__/{tema-slug}.test.ts`
 *   5. Přidej export do `src/content/grade-4/index.ts` (do `GRADE_4_TOPICS`)
 *
 * NESMÍŠ: měnit `TopicMetadata`/`PracticeTask` v `src/lib/types.ts`,
 * měnit jiné než svoje soubory v grade-4/. Vše ostatní → `docs/PENDING_CHANGES.md`.
 */

import type { TopicMetadata, PracticeTask, HelpData } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────
// Generátor — PURE funkce. Žádný network, AI, DB, Math.random bez seedu.
// (Math.random je tu povolen — existující generátory ho používají.
//  Pokud potřebuješ deterministicky, použij vlastní seeded RNG.)
// ─────────────────────────────────────────────────────────────────

function genTemplateTopic(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // TODO: vygeneruj 30-60 úloh podle obtížnosti (level 1/2/3)
  // Příklad pro multiple choice:
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const correct = a + b;

    tasks.push({
      question: `${a} + ${b} = ?`,
      correctAnswer: String(correct),
      // pro select_one (multiple choice):
      options: [
        String(correct),
        String(correct + 1),
        String(correct - 1),
        String(correct + 2),
      ].sort(() => Math.random() - 0.5),
      hints: [
        `Začni s ${a}.`,
        `Přičti ${b}.`,
      ],
      solutionSteps: [
        `Sčítáme ${a} + ${b}.`,
        `Výsledek je ${correct}.`,
      ],
    });
  }

  return tasks;
}

// ─────────────────────────────────────────────────────────────────
// Help data — statické nápovědy zobrazené žákovi
// ─────────────────────────────────────────────────────────────────

const helpTemplate: HelpData = {
  hint: "TODO: krátká nápověda jednou větou",
  steps: [
    "TODO: 1. krok řešení",
    "TODO: 2. krok řešení",
    "TODO: 3. krok řešení",
  ],
  commonMistake: "TODO: co děti často dělají špatně",
  example: "TODO: konkrétní vzorový příklad",
};

// ─────────────────────────────────────────────────────────────────
// Topic metadata — co o tomto cvičení musí vědět zbytek aplikace
// ─────────────────────────────────────────────────────────────────

export const TEMPLATE_TOPIC: TopicMetadata[] = [
  {
    // ⚠️ id = krátký interní slug, dlouhodobě stabilní (DB skill_id se ho drží)
    // Pattern: "{predmet}-{kratky-popis}-{rocnik}". Příklad: "math-zlomky-intro-4"
    id: "TODO-template-topic-4",

    // ⚠️ rvpNodeId = stabilní ID z RVP datasetu. Najdi si přes:
    //    getNodesByGradeSubject(4, 'matematika').find(n => n.labels.subtopic === 'TODO')
    rvpNodeId: "g4-matematika-TODO-area-TODO-topic-TODO-subtopic",

    title: "TODO: lidsky čitelný název cvičení",
    subject: "matematika", // "matematika" | "čeština" | "vlastivěda" | "přírodověda" | "informatika"
    category: "TODO: oblast (např. 'Zlomky')",
    topic: "TODO: téma uvnitř category (např. 'Úvod do zlomků')",
    briefDescription: "TODO: 1-2 věty co se naučíš (2. osoba, mluv přímo k žákovi — např. 'Naučíš se...', 'Pochopíš...')",
    keywords: ["TODO", "klíčová", "slova", "pro", "matching"],
    goals: [
      "TODO: cíl 1",
      "TODO: cíl 2",
    ],
    boundaries: [
      "TODO: co cvičení NEPokrývá (např. 'nezahrnuje desetinná čísla')",
    ],
    gradeRange: [4, 4],
    inputType: "select_one", // viz src/lib/types.ts InputType pro všechny možnosti
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: genTemplateTopic,
    helpTemplate,
    contentType: "algorithmic", // algorithmic | factual | conceptual | mixed
  },
];
