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
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";

/** Všechny .ts soubory obsahu (bez testů). */
function souboryObsahu(dir = "src/content"): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const cesta = join(dir, e.name);
    if (e.isDirectory()) return e.name === "__tests__" ? [] : souboryObsahu(cesta);
    return e.name.endsWith(".ts") ? [cesta] : [];
  });
}

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

  /**
   * Losování při NAČTENÍ modulu předchozí test nechytí: hodnota se v rámci
   * procesu nemění, takže dvě volání gen() vyjdou stejně — jiná je až v dalším
   * běhu. Přesně tak padal zámek obsahu u trojúhelníků (`const k2 =
   * Math.floor(Math.random() * 4)` mimo gen()), a to jen v jednom běhu ze čtyř.
   * Proto se sem dívá zdroják: `Math.random` smí být jen uvnitř funkce.
   */
  it("žádné téma nelosuje při načtení modulu", () => {
    const soubory = souboryObsahu();
    const vadna: string[] = [];
    for (const soubor of soubory) {
      readFileSync(soubor, "utf8")
        .split("\n")
        .forEach((radek, i) => {
          if (!/\bMath\.random\b/.test(radek)) return;
          if (/^\s/.test(radek)) return; // odsazení = tělo funkce
          if (/^\s*(\/\/|\/\*|\*)/.test(radek)) return; // komentář o Math.random není losování
          // Šipková funkce hodnotu jen předpisuje, nevolá: `const rnd = () => Math.random()`.
          if (/=>/.test(radek.slice(0, radek.indexOf("Math.random")))) return;
          if (/^\s*(export\s+)?(function|async function)/.test(radek)) return;
          vadna.push(`${soubor}:${i + 1} ${radek.trim()}`);
        });
    }
    expect(vadna, "Math.random na úrovni modulu — přesuň losování dovnitř gen()").toEqual([]);
  });
});
