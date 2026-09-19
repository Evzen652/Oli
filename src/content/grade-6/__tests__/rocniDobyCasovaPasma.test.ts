import { describe, it, expect } from "vitest";
import { ROCNI_DOBY_CASOVA_PASMA } from "../zemepis/rocniDobyCasovaPasma";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Roční doby, časová pásma — select_one, fakta + výpočet časového posunu.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta):
 *  • výpočty: z textu otázky vyparsuje délky (v. d. kladně, z. d. záporně),
 *    časy a délku letu a posun spočítá jako (λ2 − λ1) / 15 se znaménkem —
 *    generátor naopak pracuje se stranami od poledníku a součtem/rozdílem;
 *  • inverze: zkusí všechny násobky 15° od −180 do 180 a ověří, že podmínce
 *    vyhovuje právě jedna délka a je to klíč;
 *  • fakta: vlastní tabulka fakt a pravidlo „jih = sever + 6 měsíců“.
 */
const topic = ROCNI_DOBY_CASOVA_PASMA[0];

function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeed<T>(seed: number, fn: () => T): T {
  const orig = Math.random;
  Math.random = seeded(seed);
  try {
    return fn();
  } finally {
    Math.random = orig;
  }
}

const mod24 = (h: number) => ((h % 24) + 24) % 24;
const delky = (q: string) => [...q.matchAll(/(\d+)° ([vz])\. d\./g)].map((m) => (m[2] === "v" ? 1 : -1) * +m[1]);
const casy = (q: string) => [...q.matchAll(/(\d{1,2}):(\d{2})/g)].map((m) => +m[1] + +m[2] / 60);
const parseCas = (s: string) => {
  const m = s.match(/^(\d{1,2}):(\d{2})$/);
  return m ? +m[1] + +m[2] / 60 : NaN;
};
const fmtDelka = (x: number) => `${Math.abs(x)}° ${x < 0 ? "z. d." : "v. d."}`;

const MESIC: Record<string, number> = {
  "v lednu": 1, "v únoru": 2, "v březnu": 3, "v dubnu": 4, "v květnu": 5, "v červnu": 6,
  "v červenci": 7, "v srpnu": 8, "v září": 9, "v říjnu": 10, "v listopadu": 11, "v prosinci": 12,
};
/** Meteorologické roční doby severní polokoule. */
const dobaSever = (m: number) => (m === 12 || m <= 2 ? "zima" : m <= 5 ? "jaro" : m <= 8 ? "léto" : "podzim");
const SEVER = ["v Česku", "v Německu"];
const JIH = ["v Argentině", "v Austrálii", "v Jihoafrické republice", "na Novém Zélandu"];

type Vysledek = { kind: "vypocet" | "fakt"; ok: boolean; detail?: string };

function solve(t: PracticeTask): Vysledek | null {
  const q = t.question;
  const key = t.correctAnswer;
  let m: RegExpMatchArray | null;

  // ── výpočty ──
  if (/^Letadlo/.test(q)) {
    const [l1, l2] = delky(q);
    const [h1] = casy(q);
    const n = +q.match(/poletí (\d+) hodin/)![1];
    const exp = mod24(h1 + n + (l2 - l1) / 15);
    return { kind: "vypocet", ok: parseCas(key) === exp, detail: `let: čekám ${exp}` };
  }
  if (/Na jaké zeměpisné délce leží místo B/.test(q)) {
    const [l1] = delky(q);
    const [h1, h2] = casy(q);
    const vyhovuji: number[] = [];
    for (let c = -180; c <= 180; c += 15) {
      if (c === 0) continue;
      if (mod24(h1 + (c - l1) / 15 - h2) === 0) vyhovuji.push(c);
    }
    return {
      kind: "vypocet",
      ok: vyhovuji.length === 1 && fmtDelka(vyhovuji[0]) === key,
      detail: `inverze: vyhovují ${vyhovuji.join(", ")}`,
    };
  }
  if (/Kolik je ve stejném okamžiku hodin/.test(q)) {
    const [l1, l2] = delky(q);
    const [h1] = casy(q);
    const exp = mod24(h1 + (l2 - l1) / 15);
    return { kind: "vypocet", ok: parseCas(key) === exp, detail: `čas: čekám ${exp}` };
  }
  if ((m = q.match(/liší o (\d+)°/))) {
    const exp = +m[1] / 15;
    return { kind: "vypocet", ok: parseInt(key, 10) === exp && /hodin/.test(key), detail: `hodiny: ${exp}` };
  }
  if ((m = q.match(/časový rozdíl (\d+) hodin/))) {
    return { kind: "vypocet", ok: key === `${+m[1] * 15}°`, detail: "stupně" };
  }

  // ── fakta ──
  const f = (ok: boolean): Vysledek => ({ kind: "fakt", ok });
  if (/příčinou střídání ročních dob/.test(q)) return f(/sklon zemské osy/.test(key));
  if (/svírá zemská osa s kolmicí/.test(q)) return f(key === "asi 23,5°");
  if (/leží obratník Raka/.test(q)) return f(key === "23,5°");
  if (/leží severní a jižní polární kruh/.test(q)) return f(key === "66,5°");
  if ((m = q.match(/Kdy je přibližně (.+) na severní polokouli/))) {
    const tab: Record<string, string> = {
      "letní slunovrat": "21. června", "zimní slunovrat": "21. prosince",
      // rovnodennost kolísá mezi dvěma dny, klíč proto uvádí rozsah
      "jarní rovnodennost": "20.–21. března", "podzimní rovnodennost": "22.–23. září",
    };
    return f(tab[m[1]] === key);
  }
  if (/připadá na jedno časové pásmo/.test(q)) return f(key === `${360 / 24}°`);
  if (/Kolik časových pásem má Země podle teoretického rozdělení/.test(q)) return f(key === "24");
  if (/na východ od nás/.test(q)) return f(/později/.test(key));
  if (/^Co je polární den/.test(q)) return f(/nezapadne/.test(key));
  if (/^Co je rovnodennost/.test(q)) return f(/stejně dlouhé/.test(key));
  if ((m = q.match(/^Jaká roční doba je (v \S+) (.+)\?$/))) {
    const mes = MESIC[m[1]];
    expect(JIH, q).toContain(m[2]);
    return f(key === dobaSever(((mes + 6 - 1) % 12) + 1));
  }
  if ((m = q.match(/^Na které polokouli je kolem 21\. (června|prosince) (nejdelší|nejkratší) den/))) {
    const sever = (m[1] === "června") === (m[2] === "nejdelší");
    return f(key === (sever ? "na severní polokouli" : "na jižní polokouli"));
  }
  if ((m = q.match(/^Co nastává kolem 21\. (června|prosince) za (severním|jižním) polárním kruhem/))) {
    const leto = (m[1] === "června") === (m[2] === "severním");
    return f(key.startsWith(leto ? "polární den" : "polární noc"));
  }
  if (/nebyla vůbec skloněná/.test(q)) return f(/zmizelo/.test(key));
  if (/nejblíž na začátku ledna/.test(q)) return f(/nezpůsobuje/.test(key));
  if (/skloněná víc než dnes/.test(q)) return f(/blíž k rovníku/.test(key));
  if (/skloněná méně než dnes/.test(q)) return f(/blíž k rovníku/.test(key));
  if (/otočila kolem své osy za 12 hodin/.test(q)) return f(key === `${360 / 12}°`);
  if (/^Na rovníku trvá den/.test(q)) return f(/osvětlený vždy z poloviny/.test(key));
  if ((m = q.match(/^Kolem 21\. (června|prosince) — porovnej délku dne (.+?) a (.+?)\. Která dvojice platí\?$/))) {
    const [, mesic, prvni, druhy] = m;
    const severNejdelsi = mesic === "června";
    const mista = [...SEVER, ...JIH];
    expect(mista, q).toContain(prvni);
    expect(mista, q).toContain(druhy);
    // Dvojice musí být z opačných polokoulí, jinak úloha nemá co porovnávat.
    expect(SEVER.includes(prvni), q).not.toBe(SEVER.includes(druhy));
    const den = (loc: string) => (SEVER.includes(loc) === severNejdelsi ? "nejdelší" : "nejkratší");
    const exp = `${prvni[0].toUpperCase()}${prvni.slice(1)} ${den(prvni)} den, ${druhy} ${den(druhy)} den`;
    return f(key === exp);
  }
  return null;
}

const levels = [1, 2, 3] as const;
const vzorky = Object.fromEntries(
  levels.map((l) => [l, [11, 22, 33, 44, 55].flatMap((s) => withSeed(s, () => topic.generator(l)))]),
) as Record<1 | 2 | 3, PracticeTask[]>;

describe("Roční doby, časová pásma — metadata", () => {
  it("zeměpis g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-zem-rocni-doby-casova-pasma-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Přírodní obraz Země");
    expect(topic.topic).toBe("Vesmír a Země");
    expect(topic.rvpNodeId).toBe("g6-zemepis-prirodni-obraz-zeme-vesmir-a-zeme-rocni-doby-casova-pasma");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(levels)("Roční doby, časová pásma — L%i", (level) => {
  const tasks = vzorky[level];

  it("nezávislý solver potvrdí každý klíč", () => {
    for (const t of tasks) {
      const r = solve(t);
      expect(r, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      expect(r!.ok, `${t.question} → ${t.correctAnswer} (${r!.detail ?? ""})`).toBe(true);
    }
  });

  it("4 různé možnosti, právě 1 správná, feedback ke každému distraktoru", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer).length).toBe(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
    }
  });

  it("klíč není ve znění ani v nápovědě, nápovědy se liší", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), t.question).toBe(false);
      expect(t.hints!.length).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(h.includes(t.correctAnswer), `hint leak: ${t.question}`).toBe(false);
        // výpočetní úlohy s časem: nápověda neobsahuje žádný čas
        if (/^\d{1,2}:\d{2}$/.test(t.correctAnswer)) expect(h, t.question).not.toMatch(/\d{1,2}:\d{2}/);
        // číselný klíč (L1): nápověda neobsahuje jeho číslo
        const num = t.correctAnswer.match(/^(?:asi )?(\d+(?:,\d+)?)°?$/)?.[1];
        if (num) expect(h, `hint obsahuje ${num}: ${t.question}`).not.toMatch(new RegExp(`(^|[^\\d,])${num}(?![\\d,])`));
      }
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("časy jsou celé hodiny, žádná mapa, obrázek ani letní čas v klíči", () => {
    for (const t of tasks) {
      for (const tm of casy(t.question)) expect(Number.isInteger(tm)).toBe(true);
      if (/^\d{1,2}:\d{2}$/.test(t.correctAnswer)) expect(t.correctAnswer.endsWith(":00")).toBe(true);
      expect(t.question).not.toMatch(/mapě|mapu|obrázk/);
      expect(t.question.replace(/bez letního času/g, "")).not.toMatch(/letní\S* čas/);
    }
  });

  it("≥ 12 různých úloh na jedno volání a obě šablony (fakt i výpočet)", () => {
    const jedno = withSeed(7, () => topic.generator(level));
    expect(pocetUnikatnich(jedno)).toBeGreaterThanOrEqual(12);
    const vyp = jedno.filter((t) => solve(t)?.kind === "vypocet").length;
    const fak = jedno.filter((t) => solve(t)?.kind === "fakt").length;
    expect(vyp, "výpočet").toBeGreaterThanOrEqual(4);
    expect(fak, "fakt").toBeGreaterThanOrEqual(4);
  });

  it("výpočetní úlohy mají solutionSteps", () => {
    for (const t of tasks) {
      if (solve(t)?.kind === "vypocet") expect(t.solutionSteps!.length, t.question).toBeGreaterThanOrEqual(2);
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsi = tasks.filter((t) => {
      const others = t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length);
      return t.correctAnswer.length > Math.max(...others);
    }).length;
    expect(nejdelsi / tasks.length).toBeLessThan(0.5);
  });
});

describe("Roční doby, časová pásma — gradace a determinismus", () => {
  it("L1 začíná Kolik / Co je / Kdy; L1 a L3 mají disjunktní znění", () => {
    for (const t of vzorky[1]) expect(t.question, t.question).toMatch(/^(Kolik|Co je|Kdy)/);
    const l1 = new Set(vzorky[1].map((t) => t.question));
    expect(vzorky[3].filter((t) => l1.has(t.question))).toEqual([]);
  });

  it("L3 má dvě místa se souřadnicemi, nebo hypotézu či protiklad", () => {
    for (const t of vzorky[3]) {
      const ok = delky(t.question).length >= 2
        || /Na jaké zeměpisné délce/.test(t.question)
        || /^Kdyby|nejblíž na začátku ledna|^Kolem 21\.|^Na rovníku trvá den/.test(t.question);
      expect(ok, t.question).toBe(true);
    }
  });

  it("gen() je deterministický a bez stavu modulu", () => {
    const otisk = () => JSON.stringify(levels.map((l) => topic.generator(l).map((t) => [t.question, t.correctAnswer])));
    const a = withSeed(123, otisk);
    Math.random(); Math.random();
    const b = withSeed(123, otisk);
    expect(b).toBe(a);
  });
});
