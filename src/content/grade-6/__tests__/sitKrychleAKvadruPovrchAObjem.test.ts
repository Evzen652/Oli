import { describe, it, expect } from "vitest";
import { SIT_KRYCHLE_A_KVADRU_POVRCH_A_OBJEM } from "../matematika/sitKrychleAKvadruPovrchAObjem";
import type { PracticeTask } from "@/lib/types";

/**
 * Krychle a kvádr: síť, povrch a objem — NEZÁVISLÝ SOLVER.
 *
 * Solver nepoužívá nic z generátoru. Rozměry a klíčová slova („bez víka“,
 * „slepí“, „litrů“, „zvětšila … dvakrát“) PARSUJE ze znění otázky a klíč
 * počítá jinou cestou než generátor, v přesné zlomkové aritmetice (BigInt):
 *  • objem jako součet vrstev tloušťky 0,1 (ne a · b · c),
 *  • povrch výčtem šesti stěn, ze kterého se škrtnou chybějící,
 *  • litry dělením 10 · 10 · 10,
 *  • inverze hrubou silou (zkouší hranu, dokud objem / povrch nesedí),
 *  • zvětšení porovnáním dvou konkrétních krychlí,
 *  • slepené kostky jako kvádr n·a × a × a,
 *  • počet kostek v krabici skutečným skládáním po řadách.
 */
const topic = SIT_KRYCHLE_A_KVADRU_POVRCH_A_OBJEM[0];

// ── Zlomková aritmetika ────────────────────────────────────────────────────
type Q = { p: bigint; q: bigint };
const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b));
const norm = (p: bigint, q: bigint): Q => {
  const g = gcd(p, q) || 1n;
  return { p: p / g, q: q / g };
};
const Z = (n: number | bigint): Q => ({ p: BigInt(n), q: 1n });
const add = (a: Q, b: Q): Q => norm(a.p * b.q + b.p * a.q, a.q * b.q);
const sub = (a: Q, b: Q): Q => norm(a.p * b.q - b.p * a.q, a.q * b.q);
const mul = (a: Q, b: Q): Q => norm(a.p * b.p, a.q * b.q);
const div = (a: Q, b: Q): Q => norm(a.p * b.q, a.q * b.p);
const eq = (a: Q, b: Q): boolean => a.p * b.q === b.p * a.q;
const lt = (a: Q, b: Q): boolean => a.p * b.q < b.p * a.q;
const sum = (xs: Q[]): Q => xs.reduce(add, Z(0));

const CISLO_RE = /\d{1,3}(?: \d{3})*(?:,\d+)?/;
/** „1 050,25“ → 105025/100. */
function parse(s: string): Q {
  const t = s.replace(/\s/g, "");
  expect(t, `nečitelné číslo „${s}“`).toMatch(/^\d+(?:,\d+)?$/);
  const [w, f = ""] = t.split(",");
  return norm(BigInt(w + f), 10n ** BigInt(f.length));
}
const cisla = (s: string): Q[] => (s.match(new RegExp(CISLO_RE, "g")) ?? []).map(parse);

/** Objem jako součet vrstev tloušťky 0,1: podstava a · b se přičte (10 · c)krát. */
function objemVrstvy(a: Q, b: Q, c: Q): Q {
  const vrstev = mul(c, Z(10));
  expect(vrstev.q, "výška má víc než 1 desetinné místo").toBe(1n);
  const podstava = mul(a, b);
  let acc = Z(0);
  for (let i = 0n; i < vrstev.p; i++) acc = add(acc, podstava);
  return div(acc, Z(10));
}

interface Stena { nazev: string; obsah: Q }
/** Výčet šesti stěn kvádru a × b × h (dno/víko = a × b). */
function stenyKvadru(a: Q, b: Q, h: Q): Stena[] {
  return [
    { nazev: "dno", obsah: mul(a, b) },
    { nazev: "víko", obsah: mul(a, b) },
    { nazev: "přední", obsah: mul(a, h) },
    { nazev: "zadní", obsah: mul(a, h) },
    { nazev: "levá", obsah: mul(b, h) },
    { nazev: "pravá", obsah: mul(b, h) },
  ];
}
const povrchVyctem = (st: Stena[]): Q => sum(st.map((s) => s.obsah));
const bezCm = (s: string): Q => parse(s.replace(/\s*(cm|m)$/, ""));
const LITR_V_CM3 = mul(mul(Z(10), Z(10)), Z(10));
const KRAT: Record<string, number> = { dvakrát: 2, třikrát: 3, čtyřikrát: 4, pětkrát: 5, desetkrát: 10 };

type Reseni = { kind: "value"; value: Q };

function solve(question: string): Reseni {
  const v = (value: Q): Reseni => ({ kind: "value", value });
  let m: RegExpMatchArray | null;

  // ── L1 ──
  if ((m = question.match(/^Urči, kolik (stěn|hran|vrcholů) má kvádr s rozměry/))) {
    // vrcholy = všechny kombinace (0/1, 0/1, 0/1); hrana = dvojice vrcholů lišících se v jedné souřadnici;
    // stěna = pevná jedna souřadnice (0 nebo 1).
    const vrch: number[][] = [];
    for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) vrch.push([x, y, z]);
    let hran = 0;
    for (let i = 0; i < vrch.length; i++)
      for (let j = i + 1; j < vrch.length; j++)
        if (vrch[i].filter((c, k) => c !== vrch[j][k]).length === 1) hran++;
    let sten = 0;
    for (let osa = 0; osa < 3; osa++) for (let hod = 0; hod < 2; hod++) if (vrch.filter((p) => p[osa] === hod).length === 4) sten++;
    return v(Z(m[1] === "stěn" ? sten : m[1] === "hran" ? hran : vrch.length));
  }
  if ((m = question.match(/^Urči, kolik stěn v síti kvádru s rozměry (.+?) × (.+?) × (.+?) má tvar obdélníku (.+?) × (.+?)\.$/))) {
    const [a, b, c, x, y] = m.slice(1, 6).map(bezCm);
    const obd = [[a, b], [a, b], [a, c], [a, c], [b, c], [b, c]];
    const shoda = obd.filter(([p, q]) => (eq(p, x) && eq(q, y)) || (eq(p, y) && eq(q, x)));
    return v(Z(shoda.length));
  }
  if (/^Urči objem kvádru s rozměry/.test(question)) {
    const [a, b, c] = cisla(question);
    return v(objemVrstvy(a, b, c));
  }
  if (/^Urči objem krychle s hranou/.test(question)) {
    const [a] = cisla(question);
    return v(objemVrstvy(a, a, a));
  }
  if (/^Urči povrch krychle s hranou/.test(question)) {
    const [a] = cisla(question);
    return v(povrchVyctem(stenyKvadru(a, a, a)));
  }

  // ── L2 ──
  if (/^Vypočítej povrch kvádru s délkou/.test(question)) {
    const [a, b, c] = cisla(question);
    return v(povrchVyctem(stenyKvadru(a, b, c)));
  }
  if (/^Vypočítej objem (kvádru|krabice tvaru kvádru) s rozměry/.test(question)) {
    const [a, b, c] = cisla(question);
    const V = objemVrstvy(a, b, c);
    return v(/v dm³/.test(question) ? div(V, LITR_V_CM3) : V);
  }
  if (/^Kolik litrů vody se vejde/.test(question)) {
    const [a, b, c] = cisla(question);
    return v(div(objemVrstvy(a, b, c), LITR_V_CM3));
  }
  if (/^Síť kvádru se skládá/.test(question)) {
    const obd = [...question.matchAll(/dvou obdélníků (\S+) cm × (\S+) cm/g)].map((x) => [parse(x[1]), parse(x[2])]);
    expect(obd.length, question).toBe(3);
    const [e1, e2] = obd[0];
    const e3 = obd[1].find((x) => !eq(x, e1) && !eq(x, e2))!;
    expect(e3, question).toBeDefined();
    // třetí obdélník musí být zbývající dvojice
    const zbyva = obd[2];
    const ocekavane = obd[1].some((x) => eq(x, e1)) ? [e2, e3] : [e1, e3];
    expect(
      (eq(zbyva[0], ocekavane[0]) && eq(zbyva[1], ocekavane[1])) || (eq(zbyva[0], ocekavane[1]) && eq(zbyva[1], ocekavane[0])),
      `síť nejde složit: ${question}`,
    ).toBe(true);
    if (/Kolik cm² papíru/.test(question)) return v(sum(obd.map(([p, q]) => mul(Z(2), mul(p, q)))));
    expect(question).toMatch(/Jaký objem má kvádr/);
    return v(objemVrstvy(e1, e2, e3));
  }

  // ── L3 ──
  if (/nemá dno ani víko|bez víka|podlahu ne|dno i stěny/.test(question)) {
    const [a, b, h] = cisla(question);
    const skrtnout = /nemá dno ani víko/.test(question) ? ["dno", "víko"]
      : /podlahu ne/.test(question) ? ["dno"] // podlaha = dolní stěna
      : ["víko"]; // bez víka / bazén shora otevřený
    return v(povrchVyctem(stenyKvadru(a, b, h).filter((s) => !skrtnout.includes(s.nazev))));
  }
  if (/krychle/.test(question) && /Jaký objem má (krabička|kostka)\?/.test(question)) {
    const S = parse(question.match(/(\d[\d ]*) cm²/)![1]);
    for (let a = 1; a <= 30; a++) {
      if (eq(povrchVyctem(stenyKvadru(Z(a), Z(a), Z(a))), S)) return v(objemVrstvy(Z(a), Z(a), Z(a)));
    }
    throw new Error(`hrana nenalezena: ${question}`);
  }
  if (/Jak (vysoká|hluboký|vysoké) je|Jak je bazén hluboký/.test(question)) {
    let a: Q, b: Q, V: Q;
    if ((m = question.match(/dno (\S+) cm × (\S+) cm a vejde se do něj (.+?) litr/))) {
      [a, b] = [parse(m[1]), parse(m[2])];
      V = mul(parse(m[3]), LITR_V_CM3);
    } else if ((m = question.match(/s objemem (.+?) cm³\. Dno krabice má rozměry (\S+) cm × (\S+) cm/))) {
      [V, a, b] = [parse(m[1]), parse(m[2]), parse(m[3])];
    } else if ((m = question.match(/pojme, když je plný až po okraj, (.+?) m³ vody\. Je dlouhý (\S+) m a široký (\S+) m/))) {
      [V, a, b] = [parse(m[1]), parse(m[2]), parse(m[3])];
    } else throw new Error(`neznámá inverze: ${question}`);
    for (let t = 1; t <= 1000; t++) {
      const x = div(Z(t), Z(10));
      if (eq(objemVrstvy(a, b, x), V)) return v(x);
    }
    throw new Error(`výška nenalezena: ${question}`);
  }
  if ((m = question.match(/Kolikrát (?:větší|se zvětšil) (objem|povrch)/))) {
    let e1: number, e2: number;
    let mm: RegExpMatchArray | null;
    if ((mm = question.match(/s hranou (\d+) cm\. Pak vyrobí větší krychli s hranou (\d+) cm/))) {
      e1 = Number(mm[1]);
      e2 = Number(mm[2]);
    } else if ((mm = question.match(/měřila (\d+) cm\. Pak se zvětšila (\S+)\./))) {
      e1 = Number(mm[1]);
      expect(KRAT[mm[2]], question).toBeDefined();
      e2 = e1 * KRAT[mm[2]];
    } else throw new Error(`neznámé zvětšení: ${question}`);
    const vel = (e: number) =>
      m![1] === "objem" ? objemVrstvy(Z(e), Z(e), Z(e)) : povrchVyctem(stenyKvadru(Z(e), Z(e), Z(e)));
    return v(div(vel(e2), vel(e1)));
  }
  if ((m = question.match(/slepí (dvě|tři) stejné kostky tvaru krychle s hranou (\d+) cm/))) {
    const n = m[1] === "dvě" ? 2 : 3;
    const a = Z(Number(m[2]));
    return v(povrchVyctem(stenyKvadru(mul(Z(n), a), a, a)));
  }
  if ((m = question.match(/kost(?:ek|ky) s hranou (\d+) cm/))) {
    const e = Number(m[1]);
    let dims: number[];
    let mm: RegExpMatchArray | null;
    if ((mm = question.match(/dlouhá (\d+) cm, vysoká (\d+) cm a silná (\d+) cm/))) dims = mm.slice(1, 4).map(Number);
    else if ((mm = question.match(/rozměry (\d+) cm × (\d+) cm × (\d+) cm/))) dims = mm.slice(1, 4).map(Number);
    else throw new Error(`neznámé skládání: ${question}`);
    // skládání po řadách: kostka se položí, dokud se vejde
    let pocet = 0;
    for (let x = 0; x + e <= dims[0]; x += e)
      for (let y = 0; y + e <= dims[1]; y += e)
        for (let z = 0; z + e <= dims[2]; z += e) pocet++;
    return v(Z(pocet));
  }
  if ((m = question.match(/dno (\S+) cm × (\S+) cm a je vysoké (\S+) cm\. .* do výšky (\S+) cm/))) {
    const [a, b, , h] = m.slice(1, 5).map(parse);
    return v(div(objemVrstvy(a, b, h), LITR_V_CM3));
  }
  throw new Error(`neznámá šablona: ${question}`);
}

/** Hodnota a jednotka možnosti („7 900 cm²“ → 7900, „cm²“; „8krát“ → 8, „krát“). */
function moznost(o: string): { value: Q; unit: string } {
  const m = o.match(new RegExp(`^(${CISLO_RE.source})\\s?(.*)$`));
  expect(m, `možnost nezačíná číslem: ${o}`).toBeTruthy();
  const unit = m![2]
    .replace(/^(stěna|stěny|stěn)$/, "stěn")
    .replace(/^(hrana|hrany|hran)$/, "hran")
    .replace(/^(vrchol|vrcholy|vrcholů)$/, "vrcholů")
    .replace(/^(kostka|kostky|kostek)$/, "kostek");
  return { value: parse(m![1]), unit };
}

function vzorky(level: number, n = 240): PracticeTask[] {
  const out: PracticeTask[] = [];
  while (out.length < n) out.push(...topic.generator(level));
  return out;
}

/** Klíč jako samostatné číslo (krátký klíč) nebo podřetězec (delší). */
const klicVTextu = (text: string, klic: string) =>
  klic.length >= 3
    ? text.includes(klic)
    : new RegExp(`(?<![\\d,])${klic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\d]|,\\d)`).test(text);

const vsechnyTexty = (t: PracticeTask): string[] => [
  t.question,
  ...(t.options ?? []),
  ...(t.hints ?? []),
  ...(t.solutionSteps ?? []),
  t.explanation ?? "",
  ...Object.values(t.optionFeedback ?? {}),
];

describe("Krychle a kvádr — metadata", () => {
  it("matematika g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-mat-sit-krychle-a-kvadru-povrch-a-objem-6");
    expect(topic.rvpNodeId).toBe("g6-matematika-geometrie-v-rovine-a-v-prostoru-krychle-a-kvadr-sit-krychle-a-kvadru-povrch-a-objem");
    expect(topic.subject).toBe("matematika");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Geometrie v rovině a v prostoru");
    expect(topic.topic).toBe("Krychle a kvádr");
    expect(topic.studentTitle).toBe("Krychle a kvádr: síť, povrch a objem");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Krychle a kvádr — L%i", (level) => {
  const tasks = vzorky(level);

  it("klíč = nezávislý solver, právě jedna správná možnost ze čtyř", () => {
    for (const t of tasks) {
      const o = t.options!;
      expect(o.length, t.question).toBe(4);
      expect(new Set(o).size, t.question).toBe(4);
      expect(o).toContain(t.correctAnswer);
      const r = solve(t.question);
      const klic = moznost(t.correctAnswer);
      expect(eq(klic.value, r.value), `${t.question} → ${t.correctAnswer}`).toBe(true);
      expect(100n % r.value.q, `klíč má víc než 2 desetinná místa: ${t.question}`).toBe(0n);
      const hodnoty = o.map((x) => moznost(x).value);
      expect(hodnoty.filter((x) => eq(x, r.value)).length, `víc správných: ${t.question}`).toBe(1);
      // čtyři různé hodnoty (ne jen různé řetězce)
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) expect(eq(hodnoty[i], hodnoty[j]), t.question).toBe(false);
    }
  });

  it("stejná jednotka ve všech možnostech, český zápis čísel", () => {
    for (const t of tasks) {
      const jednotky = t.options!.map((x) => moznost(x).unit);
      expect(new Set(jednotky).size, `${t.question} → ${t.options!.join(" | ")}`).toBe(1);
      for (const x of t.options!) {
        expect(x, t.question).not.toMatch(/\./);
        expect(x, t.question).not.toMatch(/\d{4}/); // tisíce oddělené mezerou
        expect(x, t.question).not.toMatch(/,\d*0(?!\d)/); // žádné koncové nuly za čárkou
      }
    }
  });

  it("každý distraktor má optionFeedback, klíč ne", () => {
    for (const t of tasks) {
      for (const d of t.options!.filter((x) => x !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("nápovědy: dvě, různé, bez klíče; klíč není v zadání; je vysvětlení i postup", () => {
    for (const t of tasks) {
      const h = t.hints ?? [];
      expect(h.length, t.question).toBe(2);
      expect(h[0]).not.toBe(h[1]);
      for (const x of h) expect(klicVTextu(x, t.correctAnswer), `leak v nápovědě: ${t.question} / ${x}`).toBe(false);
      expect(klicVTextu(t.question, t.correctAnswer), `klíč v zadání: ${t.question}`).toBe(false);
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps!.length, t.question).toBeGreaterThanOrEqual(2);
    }
  });

  it("žádná mocnina mimo jednotky (² a ³ jen v cm², m³ …)", () => {
    for (const t of tasks) {
      for (const s of vsechnyTexty(t)) {
        expect(s.replace(/(cm|dm|m)[²³]/g, ""), `mocnina: ${s}`).not.toMatch(/[²³]/);
        expect(s, s).not.toMatch(/\^/);
      }
    }
  });

  it("≥ 12 různých úloh v jednom běhu", () => {
    expect(new Set(topic.generator(level).map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
  });

  it("klíč není systematicky výrazně nejdelší možnost", () => {
    let klic = 0;
    for (const t of tasks) {
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0].length >= 1.25 * s[1].length && s[0] === t.correctAnswer) klic++;
    }
    expect(klic / tasks.length).toBeLessThan(0.35);
  });

  it("klíč není vždy největší ani vždy nejmenší číslo", () => {
    let max = 0, min = 0;
    for (const t of tasks) {
      const k = moznost(t.correctAnswer).value;
      const ostatni = t.options!.filter((x) => x !== t.correctAnswer).map((x) => moznost(x).value);
      if (ostatni.every((x) => lt(x, k))) max++;
      if (ostatni.every((x) => lt(k, x))) min++;
    }
    const mez = level === 3 ? 0.5 : 0.8;
    expect(max / tasks.length, "klíč je příliš často největší").toBeLessThan(mez);
    expect(min / tasks.length, "klíč je příliš často nejmenší").toBeLessThan(mez);
  });
});

describe("Krychle a kvádr — gradace a rozsah", () => {
  const l1 = vzorky(1, 400);
  const l2 = vzorky(2, 400);
  const l3 = vzorky(3, 600);

  it("L1 začíná „Urči“, L2 ne; L1 a L3 mají disjunktní zadání", () => {
    expect(l1.every((t) => t.question.startsWith("Urči"))).toBe(true);
    expect(l2.some((t) => t.question.startsWith("Urči"))).toBe(false);
    expect(l2.every((t) => /^(Vypočítej|Kolik|Síť kvádru)/.test(t.question))).toBe(true);
    expect(l3.some((t) => t.question.startsWith("Urči"))).toBe(false);
    const q1 = new Set(l1.map((t) => t.question));
    expect(l3.filter((t) => q1.has(t.question))).toEqual([]);
  });

  it("L1 nemá desetinná čísla, L2 v každé úloze se ne-převodem ano, L2 bez krychlí", () => {
    for (const t of l1) {
      expect(t.question, t.question).not.toMatch(/\d,\d/);
      for (const o of t.options!) expect(o, t.question).not.toMatch(/\d,\d/);
    }
    for (const t of l2) {
      expect(t.question).not.toMatch(/krychl/);
      if (!/litrů|dm³/.test(t.question)) expect(t.question, t.question).toMatch(/\d,\d/);
    }
  });

  it("L1 nemá krychli s hranou 6 cm (povrch = objem)", () => {
    expect(l1.filter((t) => /krychle s hranou 6 cm/.test(t.question))).toEqual([]);
  });

  it("L1 střídá tři šablony rovnoměrně", () => {
    const n = l1.length;
    const prvky = l1.filter((t) => /^Urči, kolik/.test(t.question)).length / n;
    const objem = l1.filter((t) => /^Urči objem/.test(t.question)).length / n;
    const povrch = l1.filter((t) => /^Urči povrch/.test(t.question)).length / n;
    for (const p of [prvky, objem, povrch]) expect(p).toBeGreaterThan(0.2);
  });

  it("L2 pokrývá povrch, objem, převod a síť", () => {
    const q = l2.map((t) => t.question);
    expect(q.some((x) => /^Vypočítej povrch kvádru/.test(x))).toBe(true);
    expect(q.some((x) => /^Vypočítej objem kvádru/.test(x))).toBe(true);
    expect(q.some((x) => /^Kolik litrů/.test(x))).toBe(true);
    expect(q.some((x) => /v dm³/.test(x))).toBe(true);
    expect(q.some((x) => /^Síť kvádru.*Kolik cm² papíru/.test(x))).toBe(true);
    expect(q.some((x) => /^Síť kvádru.*Jaký objem/.test(x))).toBe(true);
  });

  it("L3 pokrývá všechny šablony a aspoň 4 kontexty", () => {
    const q = l3.map((t) => t.question);
    expect(q.some((x) => /bez víka/.test(x))).toBe(true);
    expect(q.some((x) => /nemá dno ani víko/.test(x))).toBe(true);
    expect(q.some((x) => /Jak (vysoká|hluboký|vysoké) je|Jak je bazén hluboký/.test(x))).toBe(true);
    expect(q.some((x) => /Jaký objem má (krabička|kostka)/.test(x))).toBe(true);
    expect(q.some((x) => /Kolikrát .*objem/.test(x))).toBe(true);
    expect(q.some((x) => /Kolikrát .*povrch/.test(x))).toBe(true);
    expect(q.some((x) => /slepí/.test(x))).toBe(true);
    expect(q.some((x) => /kostek s hranou|kostky s hranou/.test(x))).toBe(true);
    expect(q.some((x) => /do výšky/.test(x))).toBe(true);
    const kontexty = ["akvárium", "krabic", "pokoj", "Bazén", "Pískoviště", "zeď", "krabičk"]
      .filter((k) => q.some((x) => x.includes(k)));
    expect(kontexty.length).toBeGreaterThanOrEqual(4);
  });
});

describe("Krychle a kvádr — opravy z review", () => {
  const vse = [1, 2, 3].flatMap((l) => vzorky(l, 300));

  it("výčet čísel v malé nápovědě obsahuje všechny rozměry i s jednotkou", () => {
    for (const t of vse) {
      const m = t.hints![0].match(/Čísla ze zadání: (.*)\.$/);
      if (!m) continue;
      for (const z of m[1].split("; ")) expect(z, `${t.question} / ${t.hints![0]}`).toMatch(/\d\s?\S*[a-zA-Z²³]/);
      const zadani = t.question.match(/\d+(?:,\d+)? (?:cm|m)(?![²³\p{L}])/gu) ?? [];
      for (const z of zadani) expect(m[1].split("; "), `${t.question} / ${t.hints![0]}`).toContain(z);
    }
  });

  it("u počítání stěn, hran a vrcholů není rada o zkoušce ani odhadu", () => {
    for (const t of vse.filter((x) => /^Urči, kolik/.test(x.question))) {
      expect(t.hints![1], t.question).not.toMatch(/zkouš|odhad/i);
      expect(t.hints![1], t.question).toMatch(/krabičce/);
    }
  });

  it("zkouška u výšky bez mezikroku ,0", () => {
    for (const t of vse) for (const s of (t.solutionSteps ?? []).filter((x) => x.startsWith("Zkouška"))) expect(s, s).not.toMatch(/,0 = /);
  });

  it("v šestiúlohové sérii L3 se typ úlohy neopakuje", () => {
    const typ = (q: string) =>
      /bez víka|nemá dno ani víko|podlahu ne|dno i stěny/.test(q) ? "stena"
      : /Jak (vysoká|vysoké) je|Jak je bazén hluboký/.test(q) ? "vyska"
      : /Jaký objem má (krabička|kostka)/.test(q) ? "krychle"
      : /Kolikrát/.test(q) ? "zvetseni"
      : /slepí/.test(q) ? "slepeni"
      : /do výšky/.test(q) ? "voda"
      : "kostky";
    for (let i = 0; i < 30; i++) {
      const serie = topic.generator(3).slice(0, 6).map((t) => typ(t.question));
      expect(new Set(serie).size, serie.join(", ")).toBe(6);
    }
  });
});
