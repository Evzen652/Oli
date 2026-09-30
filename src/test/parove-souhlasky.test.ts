import { describe, it, expect } from "vitest";
import { PAROVE_SOUHLASKY } from "@/content/grade-2/cjl/paroveSouhlasky";
import type { PracticeTask } from "@/lib/types";

/**
 * Párové souhlásky (2. ročník).
 *
 * NEZÁVISLÝ SOLVER — nic nebere z generátoru:
 *  (1) vlastní tabulka párů a znělosti pro L1,
 *  (2) vlastní slovník správně napsaných slov pro L2/L3: do každé mezery
 *      zkusí obě písmena páru a nechá to, které dá slovo ze slovníku.
 * Právě jedna kombinace musí dát dvě slova ze slovníku a ta = klíč.
 */
const topic = PAROVE_SOUHLASKY[0];

const PAR: Record<string, string> = {
  b: "p", p: "b", d: "t", t: "d", ď: "ť", ť: "ď", v: "f", f: "v",
  z: "s", s: "z", ž: "š", š: "ž", h: "ch", ch: "h", g: "k", k: "g",
};
const ZNELE = new Set(["b", "d", "ď", "v", "z", "ž", "h", "g"]);

// Slovník psaný ručně, nezávisle na větách generátoru.
const SLOVNIK = new Set([
  "hrad", "les", "sníh", "led", "chléb", "med", "dub", "holub", "pes", "nos", "drak", "pták",
  "nůž", "koš", "zeď", "myš", "loď", "labuť", "mráz", "rybník", "pouť", "perník", "lev", "hlas",
  "mrkev", "hrách", "sloup", "sup", "plot", "sad", "vůz", "kus",
  "rybka", "žabka", "zahrádce", "lavičce", "klobouk", "hádku", "sladký", "lehký", "nízká", "úzká",
  "košík", "hříbků", "kresbě", "prosbu", "kapku", "kartáček", "zoubky", "chaloupka", "drápky", "hebký",
]);

function resDoplnovani(t: PracticeTask): string {
  const veta = t.question.match(/„(.+)“$/u)![1];
  const slova = veta.split(/\s+/).filter((w) => w.includes("_")).map((w) => w.replace(/[.,!?:]/g, "").toLowerCase());
  expect(slova, veta).toHaveLength(2);
  // Která dvě písmena se do i-té mezery nabízejí (z možností úlohy); musí to být pár.
  const nabidka = (i: number) => [...new Set(t.options!.map((o) => o.split(", ")[i]))];
  const moznost = (w: string, i: number): string => {
    const dvojice = nabidka(i);
    expect(dvojice, `${veta}: mezera ${i + 1}`).toHaveLength(2);
    expect(PAR[dvojice[0]], `${veta}: nabídka není párová dvojice`).toBe(dvojice[1]);
    const hodi = dvojice.filter((g) => SLOVNIK.has(w.replace("_", g)));
    expect(hodi, `slovo „${w}“: ze slovníku musí sedět právě jedno písmeno`).toHaveLength(1);
    return hodi[0];
  };
  return `${moznost(slova[0], 0)}, ${moznost(slova[1], 1)}`;
}

function resL1(t: PracticeTask): string {
  const q = t.question;
  const mp = q.match(/pár se souhláskou „(.+)“\?$/u);
  if (mp) return PAR[mp[1]];
  const mz = q.match(/^Která souhláska je (znělá|neznělá): (.+)\?$/u)!;
  const hledam = mz[1] === "znělá";
  const vyhovuje = mz[2].split(", ").filter((x) => ZNELE.has(x) === hledam);
  expect(vyhovuje, q).toHaveLength(1);
  return vyhovuje[0];
}

describe.each([1, 2, 3])("Párové souhlásky — L%i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh; 4 různé možnosti, právě jedna správná; feedback u distraktorů", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) {
      expect(t.options).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      for (const o of t.options!) {
        if (o === t.correctAnswer) expect(t.optionFeedback?.[o]).toBeUndefined();
        else expect(t.optionFeedback?.[o], `${t.question} / ${o}`).toBeTruthy();
      }
      expect(t.explanation).toBeTruthy();
    }
  });

  it("NEZÁVISLÝ SOLVER souhlasí s klíčem", () => {
    for (const t of tasks) {
      expect(t.correctAnswer, t.question).toBe(level === 1 ? resL1(t) : resDoplnovani(t));
    }
  });

  it("možnosti jsou jen sporná písmena, nikdy celé slovo", () => {
    for (const t of tasks) {
      for (const o of t.options!) {
        for (const g of o.split(", ")) expect(Object.keys(PAR).concat(["m", "n", "ň", "c", "č", "r", "j"]), `${t.question} / ${o}`).toContain(g);
      }
    }
  });

  it("nápovědy: dvě, různé, unikátní v úrovni a neprozrazují klíč", () => {
    const h0 = new Set<string>();
    const h1 = new Set<string>();
    for (const t of tasks) {
      expect(t.hints).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(h0.has(t.hints![0]), t.hints![0]).toBe(false);
      expect(h1.has(t.hints![1]), t.hints![1]).toBe(false);
      h0.add(t.hints![0]);
      h1.add(t.hints![1]);
      expect(t.hints![1].length).toBeGreaterThan(t.hints![0].length);
      // Velká nápověda má být dost dlouhá sama; jinak `choice()` přilepí
      // obecnou radu „škrtni možnost, která nesouvisí", která tu nesedí.
      expect(t.hints![1], t.question).not.toContain("škrtni");
      if (level > 1) expect(t.explanation, "slovo z počátku věty velkým písmenem uprostřed vysvětlení").not.toMatch(/^Píšeme \p{Lu}/u);
      if (level > 1) {
        // doplněné slovo celé nesmí v nápovědě stát
        const veta = t.question.match(/„(.+)“$/u)![1];
        const [a, b] = t.correctAnswer.split(", ");
        const cela = veta.split(/\s+/).filter((w) => w.includes("_")).map((w, i) => w.replace(/[.,!?:]/g, "").replace("_", i === 0 ? a : b));
        for (const h of t.hints!) for (const w of cela) expect(h.includes(`„${w}“`), `${h} prozrazuje ${w}`).toBe(false);
      }
    }
  });
});

describe("Párové souhlásky — gradace", () => {
  it("znění úrovní jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) {
      expect([...q[a]].filter((x) => q[b].has(x))).toEqual([]);
    }
  });

  it("L2 = mezery na konci slova, L3 = aspoň jedna mezera uprostřed slova", () => {
    const mezery = (t: PracticeTask) =>
      t.question.match(/„(.+)“$/u)![1].split(/\s+/).filter((w) => w.includes("_")).map((w) => w.replace(/[.,!?:]/g, ""));
    for (const t of topic.generator(2)) for (const w of mezery(t)) expect(w.endsWith("_"), t.question).toBe(true);
    for (const t of topic.generator(3)) expect(mezery(t).some((w) => !w.endsWith("_")), t.question).toBe(true);
  });

  it("L1 pokrývá všech 8 párů oběma směry", () => {
    const l1 = topic.generator(1);
    for (const x of Object.keys(PAR)) {
      expect(l1.some((t) => t.question === `Která souhláska tvoří pár se souhláskou „${x}“?`), x).toBe(true);
    }
  });
});
