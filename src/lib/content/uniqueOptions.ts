/**
 * Sdílený helper pro garanci unikátních možností v select_one úlohách.
 *
 * Problém, který řeší: naivně generované distraktory (`num+1`, `den-num`,
 * `smaller/den`) se u některých kombinací shodují mezi sebou nebo se
 * správnou odpovědí → žák vidí duplicitní tlačítka, případně dva "správně".
 *
 * `buildUniqueOptions` deduplikuje distraktory oproti `correct`, doplní
 * z volitelného `fallbackPool` až do cílového počtu a hodí, pokud se ani
 * tam neshromáždí požadovaný počet různých hodnot.
 */

export interface UniqueOptionsResult {
  /** Cílový počet různých možností (default 4). */
  options: string[];
  /** True, pokud musely být tažené fallback distraktory. */
  usedFallback: boolean;
}

export function buildUniqueOptions(
  correct: string,
  distractors: string[],
  fallbackPool: string[] = [],
  targetCount = 4,
): UniqueOptionsResult {
  const seen = new Set<string>([correct]);
  const out: string[] = [correct];

  for (const d of distractors) {
    if (out.length >= targetCount) break;
    if (!seen.has(d)) {
      seen.add(d);
      out.push(d);
    }
  }

  let usedFallback = false;
  for (const f of fallbackPool) {
    if (out.length >= targetCount) break;
    if (!seen.has(f)) {
      seen.add(f);
      out.push(f);
      usedFallback = true;
    }
  }

  if (out.length < targetCount) {
    throw new Error(
      `buildUniqueOptions: nelze sestavit ${targetCount} unikátních možností ` +
        `(correct="${correct}", distractors=[${distractors.join(",")}], ` +
        `fallback=[${fallbackPool.join(",")}]) — doplň fallback pool.`,
    );
  }

  return { options: out, usedFallback };
}

/** Shuffle nezávislý na exportovaném helperu — pole nemodifikuje. */
export function shuffleOptions<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
