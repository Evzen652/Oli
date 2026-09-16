import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import { ZNAKY_DELITELNOSTI } from "../matematika/znakyDelitelnosti";

/**
 * Znaky dělitelnosti — test s NEZÁVISLÝM SOLVEREM.
 *
 * Solver čte jen text otázky a možnosti, nikdy parametry generátoru. Klíč počítá
 * operátorem zbytku (x % d), tedy jinou cestou než generátor, který pracuje se
 * znaky (poslední číslice, dvojčíslí, ciferný součet).
 */
const topic = ZNAKY_DELITELNOSTI[0];
const BEHU = 15;

const num = (s: string): number => {
  const t = s.replace(/[\s ]/g, "");
  expect(t, `není celé číslo: "${s}"`).toMatch(/^\d+$/);
  return Number(t);
};

type Sablona = {
  id: string;
  re: RegExp;
  /** Vrátí množinu možností, které splňují zadání (musí být právě jedna). */
  splnuje: (m: RegExpMatchArray, options: string[]) => string[];
  /** Text, který se z otázky vyřízne před kontrolou „klíč není v otázce“. */
  vzor?: (m: RegExpMatchArray) => string;
};

const SABLONY: Record<1 | 2 | 3, Sablona[]> = {
  1: [
    {
      id: "L1-znak",
      re: /^Které z čísel je dělitelné číslem (\d+)\?$/,
      splnuje: (m, o) => o.filter((x) => num(x) % Number(m[1]) === 0),
    },
  ],
  2: [
    {
      id: "L2-nasobek",
      re: /^Právě jedno z nabízených čísel je násobkem čísla (\d+)\. Které to je\?$/,
      splnuje: (m, o) => o.filter((x) => num(x) % Number(m[1]) === 0),
    },
    {
      id: "L2-delitel",
      re: /^Které z těchto čísel patří mezi dělitele čísla ([\d ]+)\?$/,
      splnuje: (m, o) => o.filter((x) => num(m[1]) % num(x) === 0),
    },
  ],
  3: [
    {
      id: "L3-hvezdicka",
      re: /^Kterou (nejmenší číslici musíš|největší číslici můžeš) dosadit za hvězdičku (ve čtyřmístném|v pětimístném) čísle ([\d *]+), aby bylo dělitelné číslem (\d+)\?$/,
      splnuje: (m, o) => {
        const vzor = m[3].replace(/ /g, "");
        const d = Number(m[4]);
        expect(vzor.split("*").length - 1, "právě jedna hvězdička").toBe(1);
        expect(vzor.length, `počet míst sedí se zněním: ${m[0]}`).toBe(m[2] === "ve čtyřmístném" ? 4 : 5);
        const vyhovuji: number[] = [];
        for (let c = 0; c <= 9; c++) {
          const s = vzor.replace("*", String(c));
          if (s[0] === "0") continue;
          if (Number(s) % d === 0) vyhovuji.push(c);
        }
        expect(vyhovuji.length, `bez řešení: ${m[0]}`).toBeGreaterThan(0);
        const hledana = m[1].startsWith("nejmenší") ? vyhovuji[0] : vyhovuji[vyhovuji.length - 1];
        return o.filter((x) => num(x) === hledana);
      },
      vzor: (m) => m[3],
    },
    {
      id: "L3-kombinace",
      re: /^Které číslo je dělitelné číslem (\d+), ale není dělitelné číslem (\d+)\?$/,
      splnuje: (m, o) => {
        const p = Number(m[1]), q = Number(m[2]);
        return o.filter((x) => num(x) % p === 0 && num(x) % q !== 0);
      },
    },
  ],
};

const tokeny = (text: string): string[] =>
  (text.match(/\d{1,3}(?: \d{3})*/g) ?? []).map((t) => t.trim());

function vyres(level: 1 | 2 | 3, t: PracticeTask): Sablona {
  const s = SABLONY[level].find((x) => x.re.test(t.question));
  expect(s, `L${level}: otázka neodpovídá žádné šabloně své úrovně: "${t.question}"`).toBeDefined();
  const m = t.question.match(s!.re)!;
  const ok = s!.splnuje(m, t.options!);
  expect(ok, `L${level}: podmínku musí splnit právě jedna možnost: "${t.question}" [${t.options}]`).toHaveLength(1);
  expect(ok[0], `L${level}: klíč nesouhlasí se solverem: "${t.question}"`).toBe(t.correctAnswer);
  return s!;
}

describe("Znaky dělitelnosti — metadata", () => {
  it("je matematika 6. ročníku, select_one, RVP labely znak po znaku", () => {
    expect(topic.id).toBe("g6-mat-znaky-delitelnosti-6");
    expect(topic.subject).toBe("matematika");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.rvpNodeId).toBe(
      "g6-matematika-cislo-a-promenna-delitelnost-prirozenych-cisel-nasobek-delitel-znaky-delitelnosti-2-3-4-5-6-9-10",
    );
    expect(topic.category).toBe("Číslo a proměnná");
    expect(topic.topic).toBe("Dělitelnost přirozených čísel");
    expect(topic.studentTitle).toBe("Znaky dělitelnosti");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3] as const)("Znaky dělitelnosti — L%i", (level) => {
  const behy = Array.from({ length: BEHU }, () => topic.generator(level));
  const vse = behy.flat();

  it("nezávislý solver: klíč sedí a podmínku splňuje právě jedna možnost", () => {
    for (const t of vse) vyres(level, t);
  });

  it("≥12 unikátních úloh v každém běhu", () => {
    for (const tasks of behy) expect(pocetUnikatnich(tasks)).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, klíč mezi nimi, feedback u každého distraktoru", () => {
    for (const t of vse) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options).toContain(t.correctAnswer);
      const fb = t.optionFeedback ?? {};
      expect(Object.keys(fb)).not.toContain(t.correctAnswer);
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
        expect(fb[o], `chybí feedback pro "${o}": ${t.question}`).toBeTruthy();
      }
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps!.length, t.question).toBeGreaterThanOrEqual(2);
    }
  });

  it("klíč není ve znění otázky", () => {
    for (const t of vse) {
      const s = vyres(level, t);
      const m = t.question.match(s.re)!;
      const bezVzoru = s.vzor ? t.question.replace(s.vzor(m), "") : t.question;
      expect(tokeny(bezVzoru), t.question).not.toContain(t.correctAnswer);
    }
  });

  it("nápovědy neprozradí klíč ani nevyjmenují možnosti", () => {
    for (const t of vse) {
      expect(t.hints, t.question).toHaveLength(2);
      const vOtazce = new Set(tokeny(t.question.replace(/\*/g, " ")));
      for (const h of t.hints!) {
        const hTok = tokeny(h);
        expect(hTok, `hint obsahuje klíč: ${h}`).not.toContain(t.correctAnswer);
        for (const o of t.options!) {
          if (vOtazce.has(o)) continue; // číslo ze zadání (dělitel, část vzoru) smí nápověda zopakovat
          expect(hTok, `hint obsahuje možnost "${o}": ${h}`).not.toContain(o);
        }
      }
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsi = vse.filter((t) =>
      t.options!.every((o) => o === t.correctAnswer || o.length < t.correctAnswer.length),
    ).length;
    expect(nejdelsi / vse.length).toBeLessThan(0.5);
  });

  it("čísla ≥ 1 000 mají mezeru v tisících (výstup cis())", () => {
    for (const t of vse) {
      const texty = [
        t.question, ...t.options!, ...t.hints!, ...(t.solutionSteps ?? []), t.explanation ?? "",
        ...Object.values(t.optionFeedback ?? {}),
      ];
      for (const x of texty) expect(x, `číslo bez mezery v tisících: ${x}`).not.toMatch(/\d{4,}/);
    }
  });
});

describe("Znaky dělitelnosti — gradace", () => {
  it("šablony L1, L2 a L3 jsou disjunktní a každá úroveň používá všechny své šablony", () => {
    const pouzite: Record<number, Set<string>> = { 1: new Set(), 2: new Set(), 3: new Set() };
    const otazky: Record<number, Set<string>> = { 1: new Set(), 2: new Set(), 3: new Set() };
    for (const level of [1, 2, 3] as const) {
      for (let i = 0; i < BEHU; i++) {
        for (const t of topic.generator(level)) {
          pouzite[level].add(vyres(level, t).id);
          otazky[level].add(t.question);
        }
      }
      expect([...pouzite[level]].sort()).toEqual(SABLONY[level].map((s) => s.id).sort());
    }
    // Žádná otázka jedné úrovně neodpovídá šabloně jiné úrovně.
    for (const a of [1, 2, 3] as const) {
      for (const b of [1, 2, 3] as const) {
        if (a === b) continue;
        for (const q of otazky[a]) {
          expect(SABLONY[b].some((s) => s.re.test(q)), `L${a} otázka pasuje na L${b}: ${q}`).toBe(false);
        }
      }
    }
  });

  it("L1 používá jen jednoduché znaky 2, 3, 5, 10; L2 složitější 4, 6, 9", () => {
    for (let i = 0; i < BEHU; i++) {
      for (const t of topic.generator(1)) {
        expect([2, 3, 5, 10]).toContain(Number(t.question.match(/číslem (\d+)/)![1]));
      }
      for (const t of topic.generator(2)) {
        const m = t.question.match(/násobkem čísla (\d+)/);
        if (m) expect([4, 6, 9]).toContain(Number(m[1]));
      }
    }
  });

  it("nápovědy nemají automatický dodatek „Čísla ze zadání“", () => {
    for (const level of [1, 2, 3] as const) {
      for (const t of topic.generator(level)) {
        for (const h of t.hints!) expect(h).not.toMatch(/Čísla ze zadání/);
      }
    }
  });

  it("L2 dělitelé: jen jeden distraktor větší než číslo, ostatní nejvýš jeho polovina", () => {
    for (let i = 0; i < BEHU; i++) {
      for (const t of topic.generator(2)) {
        const m = t.question.match(/dělitele čísla ([\d ]+)\?$/);
        if (!m) continue;
        const n = num(m[1]);
        const dis = t.options!.filter((o) => o !== t.correctAnswer).map(num);
        expect(dis.filter((x) => x > n), t.question).toHaveLength(1);
        for (const x of dis.filter((x) => x <= n)) expect(x, t.question).toBeLessThanOrEqual(n / 2);
      }
    }
  });

  it("L3: dvojice (5, 10) se nepoužívá; hvězdička u 4 nemá jediný klíč", () => {
    const klice4 = new Set<string>();
    for (let i = 0; i < BEHU * 2; i++) {
      for (const t of topic.generator(3)) {
        expect(t.question).not.toMatch(/číslem 5, ale není dělitelné číslem 10/);
        if (/hvězdičku.*číslem 4\?$/.test(t.question)) klice4.add(t.correctAnswer);
      }
    }
    expect(klice4.size).toBeGreaterThanOrEqual(3);
  });

  it("tokenizér čísel rozliší 15 a 150 i mezeru v tisících", () => {
    expect(tokeny("dělitele čísla 150")).not.toContain("15");
    expect(tokeny("číslo 1 234")).toEqual(["1 234"]);
  });
});
