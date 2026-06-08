/**
 * Seedovaný (deterministický) generátor náhodných čísel.
 *
 * Použití: dočasně přepíše `Math.random` deterministickou variantou,
 * aby generátory cvičení (které volají Math.random) vyprodukovaly
 * VŽDY STEJNÉ úlohy pro stejný seed. Po dokončení se Math.random vrátí.
 *
 * Typický scénář: náhled ukázek v adminu — ať „neskáče" při každém renderu.
 */

/** FNV-1a hash stringu → 32bit unsigned int. Stabilní seed z např. skill.id. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 PRNG — rychlý, deterministický, vrací 0..1. */
export function makeSeededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Spustí `fn` s dočasně přepsaným Math.random na deterministickou variantu
 * odvozenou ze `seed`. Math.random je vždy obnoven (i při výjimce).
 */
export function withSeededRandom<T>(seed: number, fn: () => T): T {
  const orig = Math.random;
  Math.random = makeSeededRandom(seed);
  try {
    return fn();
  } finally {
    Math.random = orig;
  }
}
