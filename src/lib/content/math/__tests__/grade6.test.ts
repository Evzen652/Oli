import { describe, it, expect } from "vitest";
import { DECIMAL_OPS_TOPICS } from "../decimalOps";
import { DECIMAL_MUL_DIV_TOPICS } from "../decimalMulDiv";
import { DIVISIBILITY_TOPICS } from "../divisibility";
import { NSD_NSN_TOPICS } from "../nsdNsn";
import { ANGLES_6_TOPICS } from "../angles6";
import { TRIANGLES_6_TOPICS } from "../triangles6";

/**
 * Unit testy pro všech 6 generátorů 6. ročníku matematiky.
 */

const parseCs = (s: string): number => parseFloat(s.replace(/\s/g, "").replace(",", "."));
function gcd(a: number, b: number): number { while (b) [a, b] = [b, a % b]; return a; }
function lcm(a: number, b: number): number { return (a * b) / gcd(a, b); }
function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

// ══════════════════════════════════════════════════════════════════════════
// 1. Desetinná +/−
// ══════════════════════════════════════════════════════════════════════════
describe("decimalOps — +/− desetinných", () => {
  const [t] = DECIMAL_OPS_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: správný součet/rozdíl`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const m = task.question.match(/^([\d,]+)\s+([+−])\s+([\d,]+)\s*=/);
        expect(m).not.toBeNull();
        if (!m) continue;
        const a = parseCs(m[1]);
        const b = parseCs(m[3]);
        const expected = m[2] === "+" ? a + b : a - b;
        expect(Math.abs(parseCs(task.correctAnswer) - expected)).toBeLessThan(0.01);
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 2. Desetinná ×/÷
// ══════════════════════════════════════════════════════════════════════════
describe("decimalMulDiv — ×/÷ desetinných", () => {
  const [t] = DECIMAL_MUL_DIV_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: správný násob/podíl`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const mMul = task.question.match(/^([\d,]+)\s+×\s+(\d+)\s*=/);
        if (mMul) {
          const a = parseCs(mMul[1]);
          const b = +mMul[2];
          expect(Math.abs(parseCs(task.correctAnswer) - a * b)).toBeLessThan(0.01);
          continue;
        }
        const mDiv = task.question.match(/^(\d+)\s+÷\s+(\d+)\s*=/);
        if (mDiv) {
          const a = +mDiv[1];
          const b = +mDiv[2];
          expect(Math.abs(parseCs(task.correctAnswer) - a / b)).toBeLessThan(0.01);
        }
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 3. Dělitelnost
// ══════════════════════════════════════════════════════════════════════════
describe("divisibility — dělitelé/prvočísla/znaky", () => {
  const [t] = DIVISIBILITY_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: všechny 3 typy úloh, správné výsledky`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      let hasDiv = false, hasMark = false, hasPrime = false;

      for (const task of tasks) {
        // Dělitelé
        const mDiv = task.question.match(/čísla (\d+)\)/);
        if (mDiv) {
          hasDiv = true;
          const n = +mDiv[1];
          const expected: number[] = [];
          for (let i = 1; i <= n; i++) if (n % i === 0) expected.push(i);
          expect(task.correctAnswer).toBe(expected.join(","));
          continue;
        }
        // Znak dělitelnosti
        const mMark = task.question.match(/Je (\d+) dělitelné (\d+)\?/);
        if (mMark) {
          hasMark = true;
          const n = +mMark[1];
          const d = +mMark[2];
          expect(task.correctAnswer).toBe(n % d === 0 ? "ANO" : "NE");
          continue;
        }
        // Prvočísla
        if (task.question.includes("prvočísla")) {
          hasPrime = true;
          const pool = task.options.map(Number);
          const expected = pool.filter(isPrime);
          expect(task.correctAnswer).toBe(expected.join(","));
        }
      }
      expect(hasDiv).toBe(true);
      expect(hasMark).toBe(true);
      expect(hasPrime).toBe(true);
    });
  }
  it("metadata je multi_select", () => {
    expect(t.inputType).toBe("multi_select");
  });
});

// ══════════════════════════════════════════════════════════════════════════
// 4. NSD/NSN
// ══════════════════════════════════════════════════════════════════════════
describe("nsdNsn — NSD a NSN", () => {
  const [t] = NSD_NSN_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: správný NSD/NSN`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        const m = task.question.match(/čísel (\d+) a (\d+)/);
        expect(m).not.toBeNull();
        if (!m) continue;
        const a = +m[1];
        const b = +m[2];
        const expected = task.question.includes("NSD") ? gcd(a, b) : lcm(a, b);
        expect(+task.correctAnswer).toBe(expected);
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 5. Úhly
// ══════════════════════════════════════════════════════════════════════════
describe("angles6 — úhly", () => {
  const [t] = ANGLES_6_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: druhy/vrcholové/vedlejší/trojúhelník`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        // Typ úhlu
        const mType = task.question.match(/velikost (\d+)°\. Jakého druhu/);
        if (mType) {
          const s = +mType[1];
          let exp: string;
          if (s === 90) exp = "pravý";
          else if (s === 180) exp = "přímý";
          else if (s < 90) exp = "ostrý";
          else exp = "tupý";
          expect(task.correctAnswer).toBe(exp);
          continue;
        }
        // Vrcholový
        const mVrch = task.question.match(/velikost (\d+)°\. Jaká je velikost jeho VRCHOLOVÉHO/);
        if (mVrch) {
          expect(+task.correctAnswer).toBe(+mVrch[1]);
          continue;
        }
        // Vedlejší
        const mVed = task.question.match(/velikost (\d+)°\. Jaká je velikost jeho VEDLEJŠÍHO/);
        if (mVed) {
          expect(+task.correctAnswer).toBe(180 - +mVed[1]);
          continue;
        }
        // Třetí úhel
        const mTri = task.question.match(/dva úhly (\d+)° a (\d+)°/);
        if (mTri) {
          expect(+task.correctAnswer).toBe(180 - +mTri[1] - +mTri[2]);
        }
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// 6. Trojúhelníky
// ══════════════════════════════════════════════════════════════════════════
describe("triangles6 — druhy trojúhelníků", () => {
  const [t] = TRIANGLES_6_TOPICS;
  for (const level of [1, 2, 3]) {
    it(`level ${level}: správné určení podle stran/úhlů/nerovnost`, () => {
      const tasks = t.generator(level);
      expect(tasks.length).toBeGreaterThan(30);
      for (const task of tasks) {
        // Podle stran
        const mStr = task.question.match(/strany (\d+), (\d+) a (\d+).*podle stran/);
        if (mStr) {
          const [a, b, c] = [+mStr[1], +mStr[2], +mStr[3]];
          let exp: string;
          if (a === b && b === c) exp = "rovnostranný";
          else if (a === b || b === c || a === c) exp = "rovnoramenný";
          else exp = "obecný";
          expect(task.correctAnswer).toBe(exp);
          continue;
        }
        // Podle úhlů
        const mUhl = task.question.match(/úhly (\d+)°, (\d+)° a (\d+)°.*podle úhlů/);
        if (mUhl) {
          const [a, b, c] = [+mUhl[1], +mUhl[2], +mUhl[3]];
          const maxAng = Math.max(a, b, c);
          let exp: string;
          if (maxAng === 90) exp = "pravoúhlý";
          else if (maxAng > 90) exp = "tupoúhlý";
          else exp = "ostroúhlý";
          expect(task.correctAnswer).toBe(exp);
          continue;
        }
        // Nerovnost
        const mNer = task.question.match(/se stranami (\d+), (\d+) a (\d+) cm/);
        if (mNer) {
          const [a, b, c] = [+mNer[1], +mNer[2], +mNer[3]];
          const valid = a + b > c && a + c > b && b + c > a;
          expect(task.correctAnswer).toBe(valid ? "ANO" : "NE");
        }
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// Společné
// ══════════════════════════════════════════════════════════════════════════
describe("Grade 6 — společné kontroly", () => {
  const allTopics = [
    ...DECIMAL_OPS_TOPICS,
    ...DECIMAL_MUL_DIV_TOPICS,
    ...DIVISIBILITY_TOPICS,
    ...NSD_NSN_TOPICS,
    ...ANGLES_6_TOPICS,
    ...TRIANGLES_6_TOPICS,
  ];
  it("všech 6 topiců začíná 6. ročníkem", () => {
    for (const t of allTopics) {
      expect(t.gradeRange[0], `${t.id}`).toBe(6);
    }
  });
  it("všech 6 má RVP, prerekvizity, helpTemplate, visualExamples", () => {
    for (const t of allTopics) {
      expect(t.rvpReference, `${t.id}`).toMatch(/^M-6-/);
      expect((t.prerequisites || []).length).toBeGreaterThan(0);
      expect(t.helpTemplate.visualExamples?.length ?? 0).toBeGreaterThan(0);
    }
  });
  it("používá alespoň 3 input typy včetně multi_select", () => {
    const types = new Set(allTopics.map((t) => t.inputType));
    expect(types.size).toBeGreaterThanOrEqual(3);
    expect(types.has("multi_select")).toBe(true);
  });
});
