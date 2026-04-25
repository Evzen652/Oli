/**
 * Multi-step exercise format.
 *
 * Pro úlohy SŠ úrovně, kde žák řeší vícekrokově:
 * - Kvadratické rovnice (diskriminant → kořeny)
 * - Slovní úlohy (sestav rovnici → vyřeš → odpověz)
 * - Geometrické konstrukce
 * - Chemické rovnice (vyvážit)
 *
 * Žák odpovídá krok za krokem, systém validuje každý krok zvlášť
 * a poskytuje cílenou nápovědu.
 *
 * Tato vrstva je **doplněk** k současnému PracticeTask (nepřepisuje ho).
 * MultiStepTask se rozpouští do několika "virtuálních" PracticeTask
 * v rámci jedné session.
 */

import type { PracticeTask } from "./types";

export interface MultiStepHint {
  /** Krátký nudge */
  nudge?: string;
  /** Detailnější vysvětlení (až po několika pokusech) */
  detail?: string;
  /** Vzorec / pravidlo k aplikaci */
  formula?: string;
}

export interface MultiStep {
  id: string;
  /** Co po žákovi v tomto kroku chceme */
  prompt: string;
  /** Správná odpověď pro tento krok */
  correctAnswer: string;
  /** Validátor — jak zkontrolovat (string_exact, numeric_tolerance, ...) */
  validatorId?: string;
  /** Progresivní nápovědy */
  hints?: MultiStepHint[];
  /** Vysvětlení po dokončení kroku */
  explanation?: string;
  /** Volitelný kontext z předchozích kroků (např. "víme: a=1, b=-3, c=2") */
  contextFromPrevious?: (previousAnswers: string[]) => string;
}

export interface MultiStepTask {
  id: string;
  /** Hlavní zadání úlohy */
  problem: string;
  /** Posloupnost kroků */
  steps: MultiStep[];
  /** Metadata */
  meta?: {
    skillId?: string;
    level?: number;
    subject?: string;
  };
}

/**
 * Rozloží MultiStepTask na sekvenci PracticeTask pro session orchestrátor.
 * Každý krok = jeden PracticeTask.
 *
 * Pokud žák odpoví špatně na krok N, můžeme:
 * - Dát nápovědu (z hints[])
 * - Přeskočit (přijdou ho další kroky)
 * - Ukončit úlohu
 */
export function explodeMultiStep(task: MultiStepTask, previousAnswers: string[] = []): PracticeTask[] {
  return task.steps.map((step, idx) => {
    const ctx = step.contextFromPrevious?.(previousAnswers) ?? "";
    const fullQuestion = idx === 0
      ? `${task.problem}\n\n${step.prompt}`
      : ctx
        ? `${ctx}\n\n${step.prompt}`
        : step.prompt;

    return {
      question: fullQuestion,
      correctAnswer: step.correctAnswer,
      hints: step.hints?.map((h) => h.nudge ?? h.detail ?? h.formula ?? "").filter(Boolean),
      solutionSteps: step.explanation ? [step.explanation] : undefined,
    };
  });
}

// ─── Příklad: kvadratická rovnice ────────────────────────────────────
/**
 * Generuje kvadratickou rovnici jako multi-step úlohu.
 * Pro úroveň 1: jednoduché celočíselné kořeny.
 */
export function generateQuadraticEquation(level: number = 1): MultiStepTask {
  // Pro úroveň 1: vytvoř rovnici s celočíselnými kořeny x1, x2
  // (x - x1)(x - x2) = 0  →  x² - (x1+x2)x + x1*x2 = 0
  const range = level === 1 ? 5 : level === 2 ? 10 : 20;
  const x1 = Math.floor(Math.random() * (range * 2 + 1)) - range;
  const x2 = Math.floor(Math.random() * (range * 2 + 1)) - range;
  const a = 1;
  const b = -(x1 + x2);
  const c = x1 * x2;
  const D = b * b - 4 * a * c;

  const formatTerm = (coef: number, sym: string, isFirst: boolean): string => {
    if (coef === 0) return "";
    const sign = coef > 0 ? (isFirst ? "" : " + ") : " - ";
    const abs = Math.abs(coef);
    const num = abs === 1 && sym ? "" : String(abs);
    return `${sign}${num}${sym}`;
  };
  const eq = `${formatTerm(a, "x²", true)}${formatTerm(b, "x", false)}${formatTerm(c, "", false)} = 0`.trim();

  return {
    id: `quadratic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    problem: `Vyřeš kvadratickou rovnici: ${eq}`,
    meta: { skillId: "math-quadratic-equation", level, subject: "matematika" },
    steps: [
      {
        id: "discriminant",
        prompt: "Vypočti diskriminant D = b² - 4ac",
        correctAnswer: String(D),
        validatorId: "numeric_tolerance",
        hints: [
          { nudge: "Dosaď a, b, c z rovnice." },
          { detail: `Tady a=${a}, b=${b}, c=${c}` },
          { formula: `D = ${b}² - 4·${a}·${c}` },
        ],
        explanation: `D = ${b}² - 4·${a}·${c} = ${b * b} - ${4 * a * c} = ${D}`,
      },
      {
        id: "x1",
        prompt: "Vypočti první kořen x₁ = (-b - √D) / (2a)",
        correctAnswer: String(Math.min(x1, x2)),
        validatorId: "numeric_tolerance",
        hints: [
          { nudge: "Použij vzorec pro kořeny." },
          { formula: "x₁,₂ = (-b ± √D) / (2a)" },
        ],
        contextFromPrevious: (prev) => `Z předchozího kroku víme: D = ${prev[0]}`,
      },
      {
        id: "x2",
        prompt: "Vypočti druhý kořen x₂ = (-b + √D) / (2a)",
        correctAnswer: String(Math.max(x1, x2)),
        validatorId: "numeric_tolerance",
        hints: [{ nudge: "Stejný vzorec, jen + místo -." }],
      },
    ],
  };
}
