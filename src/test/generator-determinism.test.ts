/**
 * Generátor musí být při stejném seedu deterministický — i když se volá
 * opakovaně ve stejném procesu.
 *
 * Proč: zámek obsahu (`frozen-content-unchanged.test.ts`) otiskuje úlohy
 * pod pevným seedem. Téma, které si drží stav mezi voláními (počítadlo
 * rotace šablon na úrovni modulu), dá při druhém volání jiné úlohy a zámek
 * padá náhodně podle toho, kolikrát ho v běhu někdo zavolal před ním.
 * Tak to 2026-09-16 udělalo `g6-mat-trojuhelniky-uhly-vyska-teznice-6`:
 * samotný zámek prošel, v celé sadě spadl.
 *
 * Tenhle test to chytí vždy: volá každý generátor dvakrát se stejným
 * seedem a mezi tím posune globální stav.
 */
import { describe, expect, it } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";

function seeded(seed = 0x9e3779b9): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function otisk(gen: (level: number) => { question: string; correctAnswer?: unknown }[]): string {
  const puvodni = Math.random;
  Math.random = seeded();
  try {
    return JSON.stringify([1, 2, 3].map((l) => (gen(l) ?? []).map((t) => [t.question, t.correctAnswer])));
  } finally {
    Math.random = puvodni;
  }
}

describe("generator_determinism", () => {
  it("dvě volání se stejným seedem dají stejné úlohy", () => {
    const vadna: string[] = [];
    for (const t of getAllTopics()) {
      if (!t.generator) continue;
      const prvni = otisk(t.generator);
      for (let i = 0; i < 7; i++) Math.random();
      if (otisk(t.generator) !== prvni) vadna.push(t.id);
    }
    expect(vadna, "Generátor si drží stav mezi voláními — nastav ho na začátku gen()").toEqual([]);
  });
});
