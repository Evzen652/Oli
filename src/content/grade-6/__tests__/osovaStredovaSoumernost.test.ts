import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { OSOVA_STREDOVA_SOUMERNOST } from "../matematika/osovaStredovaSoumernost";

/**
 * Osová a středová souměrnost — test s NEZÁVISLÝM SOLVEREM.
 *
 * Solver nečte parametry generátoru a nepoužívá jeho vzorce (2k − x).
 * Ze znění otázky vytáhne body „[a; b]“, osu („sloupcem k“ / „řádkem k“)
 * a střed „S [p; q]“ a u každé možnosti ověří VLASTNOST souměrnosti:
 *  • osová: bod a obraz mají stejný řádek (svislá osa) / sloupec (vodorovná)
 *    a střed jejich spojnice leží na ose,
 *  • středová: střed spojnice bodu a obrazu je S.
 * Dvě zobrazení za sebou simuluje krok po kroku („o kolik před osou, o tolik
 * za ní“). L1 řeší vlastní tabulkou písmen a útvarů. Vlastnost musí splňovat
 * PRÁVĚ jedna možnost, a to ta v correctAnswer.
 */
const topic = OSOVA_STREDOVA_SOUMERNOST[0];

type Bod = [number, number];
const BOD = /\[(\d+); (\d+)\]/g;
const cti = (s: string): Bod | null => {
  const m = s.match(/^\[(\d+); (\d+)\]$/);
  return m ? [Number(m[1]), Number(m[2])] : null;
};

// ── Tabulky pro L1 (vlastní, ne z generátoru) ──────────────────────────────
const JEN_OSOVE = new Set("AMTUVWYEBCDK".split(""));
const JEN_STREDOVE = new Set("NSZ".split(""));
const OBOJI = new Set("HIOX".split(""));
const NIC = new Set("FGJLPQR".split(""));
const SPORNE = new Set("KBECDWY".split(""));

const UTVARY: Record<string, { osy: number; stred: boolean }> = {
  "čtverec": { osy: 4, stred: true },
  "obdélník": { osy: 2, stred: true },
  "obdélník, který není čtverec": { osy: 2, stred: true },
  "rovnostranný trojúhelník": { osy: 3, stred: false },
  "rovnoramenný trojúhelník": { osy: 1, stred: false },
  "rovnoramenný trojúhelník, který není rovnostranný": { osy: 1, stred: false },
  "kosodélník": { osy: 0, stred: true },
  "kosočtverec": { osy: 2, stred: true },
  "kosočtverec, který není čtverec": { osy: 2, stred: true },
  "rovnoramenný lichoběžník": { osy: 1, stred: false },
  "pravidelný šestiúhelník": { osy: 6, stred: true },
  "velké tiskací písmeno H": { osy: 2, stred: true },
  "velké tiskací písmeno T": { osy: 1, stred: false },
  "velké tiskací písmeno A": { osy: 1, stred: false },
  "velké tiskací písmeno Z": { osy: 0, stred: true },
  "velké tiskací písmeno N": { osy: 0, stred: true },
};

function tvarOs(n: number): string {
  return n === 1 ? "osa" : n >= 2 && n <= 4 ? "osy" : "os";
}

// ── Solver ─────────────────────────────────────────────────────────────────
type Druh = "L1osy" | "L1pismeno" | "L1utvar" | "vzdalenost" | "stred" | "osa" | "dvaKroky" | "obraz";

function druh(q: string): Druh {
  if (/^Kolik os souměrnosti má /.test(q)) return "L1osy";
  if (/^Které .*písm/.test(q)) return "L1pismeno";
  if (/^Který (útvar|čtyřúhelník)/.test(q)) return "L1utvar";
  if (/Jak daleko/.test(q)) return "vzdalenost";
  if (/Kde leží střed souměrnosti S\?$/.test(q)) return "stred";
  if (/Kterým sloupcem nebo řádkem prochází osa/.test(q)) return "osa";
  if (/výsledný bod\?$/.test(q)) return "dvaKroky";
  if (/souměrn/.test(q) && q.match(BOD)) return "obraz";
  throw new Error(`solver nepoznal úlohu: ${q}`);
}

type Operace = { typ: "osa"; svisla: boolean; k: number } | { typ: "stred"; S: Bod };

interface Rozbor {
  body: Bod[];
  ops: Operace[];
}

function rozeber(q: string): Rozbor {
  const ops: { i: number; op: Operace }[] = [];
  for (const m of q.matchAll(/(sloupcem|řádkem) (\d+)/g)) {
    ops.push({ i: m.index!, op: { typ: "osa", svisla: m[1] === "sloupcem", k: Number(m[2]) } });
  }
  const sM = q.match(/S \[(\d+); (\d+)\]/);
  let bezS = q;
  if (sM) {
    ops.push({ i: sM.index!, op: { typ: "stred", S: [Number(sM[1]), Number(sM[2])] } });
    bezS = q.replace(sM[0], "S");
  }
  const body = [...bezS.matchAll(BOD)].map((m) => [Number(m[1]), Number(m[2])] as Bod);
  return { body, ops: ops.sort((a, b) => a.i - b.i).map((x) => x.op) };
}

/** Obraz jedné souřadnice: o kolik je před středem, o tolik bude za ním. */
function zrcadli(v: number, stred: number): number {
  const vzd = stred - v;
  return stred + vzd;
}

function proved(b: Bod, op: Operace): Bod {
  if (op.typ === "stred") return [zrcadli(b[0], op.S[0]), zrcadli(b[1], op.S[1])];
  return op.svisla ? [zrcadli(b[0], op.k), b[1]] : [b[0], zrcadli(b[1], op.k)];
}

/** Je `O` obrazem `P` v dané souměrnosti? Kontrola vlastnosti, ne vzorce. */
function jeObraz(P: Bod, O: Bod, op: Operace): boolean {
  if (op.typ === "stred") return (P[0] + O[0]) / 2 === op.S[0] && (P[1] + O[1]) / 2 === op.S[1];
  if (op.svisla) return P[1] === O[1] && (P[0] + O[0]) / 2 === op.k;
  return P[0] === O[0] && (P[1] + O[1]) / 2 === op.k;
}

function vyhovuje(t: PracticeTask, o: string): boolean {
  const q = t.question;
  const d = druh(q);
  if (d === "L1osy") {
    const nazev = q.match(/^Kolik os souměrnosti má (.+)\?$/)![1];
    const u = UTVARY[nazev];
    expect(u, `neznámý útvar ${nazev}`).toBeDefined();
    const m = o.match(/^(\d+) (osa|osy|os)$/);
    expect(m, o).toBeTruthy();
    expect(m![2], `gramatika „${o}“`).toBe(tvarOs(Number(m![1])));
    return Number(m![1]) === u.osy;
  }
  if (d === "L1pismeno") {
    expect(o, q).toMatch(/^[A-Z]$/);
    expect(SPORNE.has(o) || OBOJI.has(o), `sporné / oboje písmeno ${o}`).toBe(false);
    const stredova = /středov|otočíš|střed souměrnosti/.test(q);
    return stredova ? JEN_STREDOVE.has(o) || OBOJI.has(o) : JEN_OSOVE.has(o) || OBOJI.has(o);
  }
  if (d === "L1utvar") {
    const u = UTVARY[o];
    expect(u, `neznámý útvar ${o}`).toBeDefined();
    if (/čtyřúhelník/.test(q)) expect(o, q).not.toMatch(/trojúhelník/);
    if (/má osu souměrnosti, ale není středově/.test(q)) return u.osy > 0 && !u.stred;
    if (/osově i středově souměrný/.test(q)) return u.osy > 0 && u.stred;
    return u.stred && u.osy === 0;
  }
  if (d === "vzdalenost") {
    const m = q.match(/(\d+(?:,\d+)?) (cm|m)\b/)!;
    const vzd = Number(m[1].replace(",", "."));
    // bod a obraz jsou každý na jedné straně, stejně daleko
    const celkem = vzd + vzd;
    return o === `${String(celkem).replace(".", ",")} ${m[2]}`;
  }
  const r = rozeber(q);
  if (d === "osa") {
    expect(r.body, q).toHaveLength(2);
    const [P, P2] = r.body;
    const m = o.match(/^(sloupec|řádek) (\d+)$/);
    expect(m, o).toBeTruthy();
    const op: Operace = { typ: "osa", svisla: m![1] === "sloupec", k: Number(m![2]) };
    return jeObraz(P, P2, op) && !(P[0] === P2[0] && P[1] === P2[1]);
  }
  const O = cti(o);
  expect(O, `možnost není bod: ${o}`).toBeTruthy();
  if (d === "stred") {
    expect(r.body, q).toHaveLength(2);
    return jeObraz(r.body[0], r.body[1], { typ: "stred", S: O! });
  }
  if (d === "dvaKroky") {
    expect(r.body, q).toHaveLength(1);
    expect(r.ops, q).toHaveLength(2);
    const vysledek = r.ops.reduce(proved, r.body[0]);
    return vysledek[0] === O![0] && vysledek[1] === O![1];
  }
  // obraz / vzor jedním krokem (souměrnost je sama sobě obrácená)
  expect(r.body, q).toHaveLength(1);
  expect(r.ops, q).toHaveLength(1);
  const P = r.body[0];
  if (P[0] === O![0] && P[1] === O![1]) return false;
  return jeObraz(P, O!, r.ops[0]);
}

function vzorky(level: number, min = 300): PracticeTask[] {
  const out: PracticeTask[] = [];
  while (out.length < min) out.push(...topic.generator(level));
  return out;
}

const vsechnaCisla = (s: string): number[] => [...s.matchAll(BOD)].flatMap((m) => [Number(m[1]), Number(m[2])]);

describe("Osová a středová souměrnost — metadata", () => {
  it("matematika g6, select_one, RVP zařazení znak po znaku", () => {
    expect(topic.id).toBe("g6-mat-osova-stredova-soumernost-6");
    expect(topic.rvpNodeId).toBe(
      "g6-matematika-geometrie-v-rovine-a-v-prostoru-osova-a-stredova-soumernost-osova-soumernost-rozsireni-stredova-soumernost",
    );
    expect(topic.subject).toBe("matematika");
    expect(topic.category).toBe("Geometrie v rovině a v prostoru");
    expect(topic.topic).toBe("Osová a středová souměrnost");
    expect(topic.studentTitle).toBe("Zrcadlení podle osy a podle středu");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Osová a středová souměrnost — level %i", (level) => {
  const tasks = vzorky(level);

  it("(1) právě jedna možnost splňuje vlastnost a je to klíč", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      const spravne = t.options!.filter((o) => vyhovuje(t, o));
      expect(spravne, t.question).toEqual([t.correctAnswer]);
    }
  });

  it("(2) všechny souřadnice jsou celá čísla 0–12, žádná záporná čísla", () => {
    for (const t of tasks) {
      for (const s of [t.question, ...t.options!]) {
        for (const c of vsechnaCisla(s)) {
          expect(c, s).toBeGreaterThanOrEqual(0);
          expect(c, s).toBeLessThanOrEqual(12);
        }
        expect(s, s).not.toMatch(/[−-]\s?\d/);
      }
      for (const o of t.options!) {
        const m = o.match(/^(?:sloupec|řádek) (\d+)$/);
        if (m) expect(Number(m[1]), o).toBeLessThanOrEqual(12);
      }
    }
  });

  it("(3) klíč není v zadání, každý distraktor má feedback, klíč ne", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), t.question).toBe(false);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("(4) ≥ 12 různých otázek v jednom běhu generátoru", () => {
    for (let i = 0; i < 20; i++) {
      const qs = new Set(topic.generator(level).map((t) => t.question));
      expect(qs.size).toBeGreaterThanOrEqual(12);
    }
  });

  it("(5) dvě různé nápovědy, žádná neprozrazuje klíč", () => {
    for (const t of tasks) {
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        if (/^[A-Z]$/.test(t.correctAnswer)) {
          expect(h, `hint leak ${t.correctAnswer}: ${h}`).not.toMatch(new RegExp(`(^|[^\\p{L}])${t.correctAnswer}([^\\p{L}]|$)`, "u"));
        } else {
          expect(h.includes(t.correctAnswer), `hint leak: ${h}`).toBe(false);
        }
        const num = t.correctAnswer.match(/^(\d+(?:,\d+)?) (?:cm|m)$/);
        if (num) expect(h, `hint leak: ${h}`).not.toMatch(new RegExp(`(^|[^\\d,])${num[1]}([^\\d,]|$)`));
      }
    }
  });

  it("(6) postup, vysvětlení a česká gramatika čísel", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps?.length ?? 0, t.question).toBeGreaterThanOrEqual(2);
      const texty = [t.question, ...t.options!, ...t.hints!, ...(t.solutionSteps ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) {
        expect(s, s).not.toMatch(/(^|[^\d,])1 (políčka|políček|osy|os)\b/);
        expect(s, s).not.toMatch(/(^|[^\d,])[2-4] (políčko|políček|osa|os)\b/);
        expect(s, s).not.toMatch(/(^|[^\d,])([05-9]|1[0-9]) (políčko|políčka|osa|osy)\b/);
        expect(s, s).not.toMatch(/\p{L}\/\p{L}/u);
        expect(s, s).not.toMatch(/mocnin|[²³]|undefined|NaN/);
      }
    }
  });

  it("(7) klíč není systematicky nejdelší možnost", () => {
    const nejdelsi = tasks.filter((t) => t.options!.every((o) => o === t.correctAnswer || o.length < t.correctAnswer.length));
    expect(nejdelsi.length / tasks.length).toBeLessThan(0.5);
  });
});

describe("Osová a středová souměrnost — gradace a vyváženost", () => {
  it("L1 začíná Kolik/Které/Který, bez bodů a souřadnic; L3 je s L1 disjunktní", () => {
    const l1 = vzorky(1).map((t) => t.question);
    const l3 = vzorky(3).map((t) => t.question);
    for (const q of l1) {
      expect(q, q).toMatch(/^(Kolik|Které|Který) /);
      expect(q, q).not.toMatch(/\bbod|souřadnic|\[/);
    }
    for (const q of l3) {
      expect(q, q).not.toMatch(/^(Kolik|Které|Který) /);
      expect(vsechnaCisla(q).length, `L3 má aspoň dva zápisy polohy: ${q}`).toBeGreaterThanOrEqual(2);
    }
    expect(l1.filter((q) => l3.includes(q))).toHaveLength(0);
  });

  it("L3 obsahuje hledání středu, osy, vzoru i dvě zobrazení", () => {
    const druhy = new Set(vzorky(3).map((t) => druh(t.question)));
    expect([...druhy].sort()).toEqual(["dvaKroky", "obraz", "osa", "stred"]);
  });

  it("šablony se střídají rovnoměrně (každá aspoň 4× z 24)", () => {
    const skupina = (q: string, level: number): string => {
      const d = druh(q);
      if (d !== "obraz" || level === 3) return d;
      const r = rozeber(q);
      const op = r.ops[0];
      return op.typ === "stred" ? "obraz-stred" : op.svisla ? "obraz-svisla" : "obraz-vodorovna";
    };
    const ocekavane: Record<number, number> = { 1: 4, 2: 4, 3: 4 };
    for (const level of [1, 2, 3]) {
      for (let i = 0; i < 10; i++) {
        const tasks = topic.generator(level);
        const pocty = new Map<string, number>();
        if (level > 1) for (const t of tasks) pocty.set(skupina(t.question, level), (pocty.get(skupina(t.question, level)) ?? 0) + 1);
        const L1typ = (q: string) => (/^Kolik/.test(q) ? "osy" : /^Který/.test(q) ? "utvar" : /středov|otočíš|střed souměrnosti/.test(q) ? "p-stred" : "p-osa");
        if (level === 1) {
          const p1 = new Map<string, number>();
          for (const t of tasks) p1.set(L1typ(t.question), (p1.get(L1typ(t.question)) ?? 0) + 1);
          expect(p1.size).toBe(4);
          for (const n of p1.values()) expect(n).toBeGreaterThanOrEqual(ocekavane[1]);
        } else {
          expect(pocty.size, [...pocty.keys()].join(",")).toBe(4);
          for (const n of pocty.values()) expect(n).toBeGreaterThanOrEqual(ocekavane[level]);
        }
      }
    }
  });

  it("L3: klíč není systematicky největší ani nejmenší možnost", () => {
    const tasks = vzorky(3, 600);
    const hodnota = (o: string): number => {
      const b = cti(o);
      if (b) return b[0] + b[1];
      return Number(o.match(/\d+/)![0]);
    };
    const lex = (o: string): number => {
      const b = cti(o);
      return b ? b[0] * 100 + b[1] : Number(o.match(/\d+/)![0]);
    };
    for (const f of [hodnota, lex]) {
      const max = tasks.filter((t) => t.options!.every((o) => o === t.correctAnswer || f(o) < f(t.correctAnswer)));
      const min = tasks.filter((t) => t.options!.every((o) => o === t.correctAnswer || f(o) > f(t.correctAnswer)));
      expect(max.length / tasks.length).toBeLessThan(0.5);
      expect(min.length / tasks.length).toBeLessThan(0.5);
    }
  });

  it("L3 hledání vzoru: klíč se neshoduje se středem ani s obrazem", () => {
    for (const t of vzorky(3).filter((x) => druh(x.question) === "obraz")) {
      const r = rozeber(t.question);
      const K = cti(t.correctAnswer)!;
      for (const b of r.body) expect(b[0] === K[0] && b[1] === K[1], t.question).toBe(false);
      for (const op of r.ops) if (op.typ === "stred") expect(op.S[0] === K[0] && op.S[1] === K[1], t.question).toBe(false);
    }
  });

  it("nápovědy nemají automatický dodatek „Čísla ze zadání“", () => {
    for (const level of [1, 2, 3]) {
      for (const t of vzorky(level)) for (const h of t.hints!) expect(h, h).not.toMatch(/Čísla ze zadání/);
    }
  });

  it("L1: vysvětlení bez „Má tedy 1 osa“, bez lichoběžníku; kosodélník není klíčem často", () => {
    const l1 = vzorky(1, 600);
    for (const t of l1) {
      expect(t.explanation ?? "", t.question).not.toMatch(/Má tedy 1 osa/);
      for (const s of [t.question, ...t.options!, t.explanation ?? ""]) expect(s, s).not.toMatch(/lichoběžník/);
    }
    const kos = l1.filter((t) => t.correctAnswer === "kosodélník").length;
    expect(kos / l1.length).toBeLessThan(0.15);
    const klice = new Set(l1.filter((t) => /^Který (útvar|čtyřúhelník)/.test(t.question)).map((t) => t.correctAnswer));
    expect(klice.size).toBeGreaterThanOrEqual(4);
  });

  it("L2 středová souměrnost: věta má výslovný podmět", () => {
    for (const t of vzorky(2)) {
      expect(t.question, t.question).not.toMatch(/Zobrazuje se/);
      if (/S \[/.test(t.question)) expect(t.question, t.question).toMatch(/(Bod A|Vrchol L) se zobrazí|Druhá .* má (stát|růst) souměrně s první podle středu S/);
    }
  });

  it("L2 vzdálenost: žádný distraktor 4 · d", () => {
    for (const t of vzorky(2).filter((x) => druh(x.question) === "vzdalenost")) {
      const m = t.question.match(/(\d+(?:,\d+)?) (cm|m)\b/)!;
      const d = Number(m[1].replace(",", "."));
      expect(t.options, t.question).not.toContain(`${String(4 * d).replace(".", ",")} ${m[2]}`);
    }
  });

  it("L3 osa a pak střed: zpětná vazba k záměně osy uvádí mezivýsledek v síti", () => {
    for (const t of vzorky(3, 600).filter((x) => druh(x.question) === "dvaKroky")) {
      for (const f of Object.values(t.optionFeedback ?? {})) {
        if (!/změnil .* místo/.test(f)) continue;
        expect(f, f).toMatch(/vznikl bod \[\d+; \d+\]/);
        for (const c of vsechnaCisla(f)) expect(c, f).toBeLessThanOrEqual(12);
      }
    }
  });

  it("L2 vzdálenost: možnosti mají stejnou jednotku a nejvýš 2 desetinná místa", () => {
    for (const t of vzorky(2).filter((x) => druh(x.question) === "vzdalenost")) {
      const jednotky = new Set(t.options!.map((o) => o.split(" ")[1]));
      expect(jednotky.size, t.question).toBe(1);
      for (const o of t.options!) expect(o, o).toMatch(/^\d+(,\d{1,2})? (cm|m)$/);
    }
  });
});
