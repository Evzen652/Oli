import type { PracticeTask } from "../types";

export type QPool = { question: string; correct: string; options: string[]; hints: string[] };

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffleArray(arr).slice(0, count);
}

/** Standard QPool → PracticeTask mapper for select_one topics */
export function mapQPoolToTasks(questions: QPool[]): PracticeTask[] {
  return pickRandom(questions, questions.length).map((q) => ({
    question: q.question,
    correctAnswer: q.correct,
    options: shuffleArray(q.options),
    hints: q.hints,
  }));
}
