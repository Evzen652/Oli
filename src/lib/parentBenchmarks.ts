/**
 * Benchmark konstanty pro rodičovský dashboard.
 *
 * ZÁMĚR: srovnání vs. doporučený standard (pedagogicky validovaný),
 * NIKDY vs. ostatní děti. Srovnání s vrstevníky je při malé bázi
 * zkreslené a může být demotivační.
 */

export const PARENT_BENCHMARKS = {
  /**
   * Optimální počet sezení za týden.
   * Pod min: příliš málo pro udržení progress.
   * Nad max: riziko přetížení; kratší, ale pravidelné je lepší.
   */
  optimalSessionsPerWeek: { min: 4, max: 5 },

  /**
   * Optimální pásmo úspěšnosti (0–1).
   * 60–75 %: dítě je vyzvané, ale ne přetížené.
   * Pod 60 %: materiál je příliš těžký nebo téma potřebuje opakování.
   * Nad 75 %: téma je dobře zvládnuté, čas na nové výzvy.
   */
  optimalSuccessRate: { min: 0.6, max: 0.75 },

  /**
   * Optimální délka sezení v minutách.
   * Kratší = méně únava, lepší focus (princip efektivity Oli).
   */
  optimalSessionMinutes: { min: 8, max: 12 },

  /**
   * Minimální počet úloh v minulém období pro zobrazení trendu.
   * Pod touto hodnotou trend neukazujeme (nedostatek dat = zkreslení).
   */
  minTasksForTrend: 5,
} as const;

export type BenchmarkStatus = "below" | "optimal" | "above";

/** Vyhodnotí, zda je hodnota v optimálním pásmu, pod ním nebo nad ním. */
export function getBenchmarkStatus(
  value: number,
  benchmark: { min: number; max: number }
): BenchmarkStatus {
  if (value < benchmark.min) return "below";
  if (value > benchmark.max) return "above";
  return "optimal";
}

/** Vrátí lidsky srozumitelný text k hodnotě úspěšnosti pro rodiče. */
export function getSuccessRateInterpretation(successRate: number): string {
  const pct = Math.round(successRate * 100);
  if (successRate >= PARENT_BENCHMARKS.optimalSuccessRate.max) {
    return `${pct} % — výborné zvládnutí, vhodné zkusit těžší téma.`;
  }
  if (successRate >= PARENT_BENCHMARKS.optimalSuccessRate.min) {
    return `${pct} % — optimální pásmo. Dítě je vyzvané, ale ne přetížené.`;
  }
  if (successRate >= 0.4) {
    return `${pct} % — téma je zatím obtížnější. Doporučujeme opakování.`;
  }
  return `${pct} % — téma potřebuje více procvičení nebo vysvětlení.`;
}

/** Vrátí interpretaci počtu sezení za týden. */
export function getSessionFrequencyInterpretation(
  sessionsPerWeek: number,
  childName?: string
): string {
  const name = childName ?? "Dítě";
  const status = getBenchmarkStatus(
    sessionsPerWeek,
    PARENT_BENCHMARKS.optimalSessionsPerWeek
  );
  if (status === "optimal") {
    return `${name} procvičuje ${sessionsPerWeek}× týdně — dobré tempo.`;
  }
  if (status === "below") {
    return `${name} procvičuje ${sessionsPerWeek}× týdně. Pro nejlepší výsledky doporučujeme 4–5× týdně.`;
  }
  return `${name} procvičuje ${sessionsPerWeek}× týdně — velmi aktivní!`;
}
