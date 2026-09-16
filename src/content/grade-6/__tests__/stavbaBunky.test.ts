import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { STAVBA_BUNKY } from "../prirodopis/stavbaBunky";
import type { PracticeTask } from "@/lib/types";

/**
 * Stavba rostlinné a živočišné buňky — FAKTICKÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta) — z generátoru nebere žádná data, jen text úlohy:
 *  • SOUCASTI: součást → rostlinná / živočišná, poznávací znaky v zadání (DEF)
 *    a znaky funkce v textu možnosti (FCE).
 *  • BUNKY: konkrétní buňka → typ + zda je zelená (má chloroplasty).
 *  • ZDROJE: možnost „Z … “ u preparátu → má stěnu? je zelená?
 *  • Z textu otázky se pozná šablona, vytáhnou se buňky/znaky a z tabulek
 *    se odvodí právě jedna vyhovující možnost.
 */
const topic = STAVBA_BUNKY[0];

interface Soucast { rost: boolean; ziv: boolean; zelenaJen?: boolean; def: RegExp; fce: RegExp }
const SOUCASTI: Record<string, Soucast> = {
  "Jádro": { rost: true, ziv: true, def: /dědičn|potomk/i, fce: /řídí činnost|dědičné informace/i },
  "Cytoplazma": { rost: true, ziv: true, def: /rosolovit/i, fce: /^vyplňuje/i },
  "Cytoplazmatická membrána": { rost: true, ziv: true, def: /propouští/i, fce: /propouští do ní|odděluje/i },
  "Buněčná stěna": { rost: true, ziv: false, def: /celulóz/i, fce: /^zpevňuje buňku a dává jí stálý/i },
  "Chloroplasty": { rost: true, ziv: false, zelenaJen: true, def: /pomocí světla/i, fce: /^vyrábějí pomocí světla živiny pro rostlinu/i },
  "Vakuola": { rost: true, ziv: false, def: /šťáv/i, fce: /uchovává buněčnou šťávu/i },
  "Velká vakuola": { rost: true, ziv: false, def: /šťáv/i, fce: /uchovává buněčnou šťávu/i },
  "Mitochondrie": { rost: true, ziv: true, def: /dýchání/i, fce: /^uvolňují z živin energii pro činnost/i },
  "Chlorofyl": { rost: true, ziv: false, def: /$^/, fce: /zachycuje světlo/i },
};

/** Buňka ze zadání → typ a zda má chloroplasty. */
const BUNKY: [RegExp, { rost: boolean; zelena: boolean }][] = [
  [/^listu$/, { rost: true, zelena: true }],
  [/cibule/, { rost: true, zelena: false }],
  [/rajčete/, { rost: true, zelena: false }],
  [/mrkve/, { rost: true, zelena: false }],
  [/kůže|sliznice|svalu/, { rost: false, zelena: false }],
];
const bunka = (s: string) => {
  const hit = BUNKY.find(([r]) => r.test(s.trim()));
  expect(hit, `neznámá buňka „${s}“`).toBeDefined();
  return hit![1];
};
const ma = (nazev: string, b: { rost: boolean; zelena: boolean }) => {
  const s = SOUCASTI[nazev];
  expect(s, `neznámá součást „${nazev}“`).toBeDefined();
  if (s.zelenaJen) return b.zelena;
  return b.rost ? s.rost : s.ziv;
};

/** Preparát → má stěnu, je zelený. */
const ZDROJE: [RegExp, { stena: boolean; zelena: boolean }][] = [
  [/cibule/, { stena: true, zelena: false }],
  [/mechu/, { stena: true, zelena: true }],
  [/mrkve/, { stena: true, zelena: false }],
  [/sliznice|svalu/, { stena: false, zelena: false }],
];
const zdroj = (o: string) => {
  const hit = ZDROJE.find(([r]) => r.test(o));
  expect(hit, `neznámý preparát „${o}“`).toBeDefined();
  return hit![1];
};

/** Chybějící součást → regex důsledku v možnosti. */
const DUSLEDEK: [RegExp, RegExp][] = [
  [/chyběly chloroplasty/, /živiny pomocí světla/i],
  [/vakuoly .*zmenšily/, /zvadnou/i],
  [/chybělo jádro/, /rozdělit se/i],
  [/chyběly mitochondrie/, /energii/i],
  [/chyběla buněčná stěna/, /neudržel tvar/i],
  [/chyběla cytoplazmatická membrána/, /nehlídala/i],
];

/** Znak → funkce pro organismus a „proč“ úlohy L2. */
const PROC: [RegExp[], (o: string) => boolean][] = [
  [[/nejsou (pod mikroskopem )?zelené|zelené, ale/], (o) => /chloroplast/i.test(o) && /světl|pod zemí|tma/i.test(o) && !/^chloroplasty (mají|v kořeni jsou|jsou i)/i.test(o)],
  [[/kostru/], (o) => /stěny/i.test(o) && !/vzduch/i.test(o)],
  [[/horní straně listu/], (o) => /světla/i.test(o)],
  [[/mitochondrií než/], (o) => /energie/i.test(o)],
  [[/napřímí/], (o) => /vakuoly/i.test(o) && /vodou/i.test(o)],
  [[/drží tvar/], (o) => /kostra/i.test(o)],
];

function vyres(t: PracticeTask): string {
  const q = t.question;
  const opts = t.options!;
  const jedna = (hit: string[], co: string) => {
    expect(hit, `${co}: ${q} | ${opts.join(" / ")}`).toHaveLength(1);
    return hit[0];
  };
  // L1a — definice → součást
  if (/^Která součást buňky/.test(q)) {
    return jedna(opts.filter((o) => SOUCASTI[o]?.def.test(q)), "L1a");
  }
  // L1b — součást → funkce
  let m = /^K čemu slouží (.+?)( buňky| v rostlinné buňce)?\?$/.exec(q);
  if (m) {
    const jm = m[1].replace(/^zelené barvivo /, "");
    const nazev = Object.keys(SOUCASTI).find((k) => k.toLowerCase() === jm.toLowerCase());
    expect(nazev, `L1b: neznámá součást „${jm}“`).toBeDefined();
    return jedna(opts.filter((o) => SOUCASTI[nazev!].fce.test(o)), "L1b");
  }
  // L2a — má P, nemá A
  m = /^Kterou součást má buňka (.+), ale buňka (.+) ji nemá\?$/.exec(q)
    ?? /^Rostlinná buňka (.+) má součást, která živočišné buňce (.+) chybí\. Kterou\?$/.exec(q);
  const m2 = /^Kterou součást NEMÁ buňka (.+), přestože ji buňka (.+) má\?$/.exec(q);
  if (m || m2) {
    const p = bunka(m ? m[1] : m2![2]);
    const a = bunka(m ? m[2] : m2![1]);
    return jedna(opts.filter((o) => ma(o, p) && !ma(o, a)), "L2a");
  }
  // L2b — v obou
  m = /^Kterou součást najdeš v buňce (.+) i v buňce (.+)\?$/.exec(q)
    ?? /^Kterou součást má živočišná buňka (.+) stejně jako rostlinná buňka (.+)\?$/.exec(q)
    ?? /^Buňka (.+) a buňka (.+) se v mnohém liší\. Kterou součást ale mají obě\?$/.exec(q);
  if (m) {
    const p = bunka(m[1]);
    const a = bunka(m[2]);
    return jedna(opts.filter((o) => ma(o, p) && ma(o, a)), "L2b");
  }
  // L3a — dvojice buněk v atlase
  if (/první má stěnu a velkou vakuolu, druhá nemá/.test(q)) {
    return jedna(opts.filter((o) => {
      const r = /^První z (\S+), druhá ze? (\S+)$/.exec(o);
      return !!r && /list/.test(r[1]) && /sval/.test(r[2]);
    }), "L3 dvojice");
  }
  // L3a — preparát podle znaků
  if (/Z čeho mohl být preparát|Odkud mohly být/.test(q)) {
    const stena = /pevnou stěnou/.test(q) && !/nemají stěnu/.test(q);
    const zelena = /plné zelených/.test(q) && !/bez zelených|ani zelená/.test(q);
    return jedna(opts.filter((o) => {
      const z = zdroj(o);
      return z.stena === stena && z.zelena === zelena;
    }), "L3 preparát");
  }
  // L3b — chybějící součást
  const d = DUSLEDEK.find(([r]) => r.test(q));
  if (d) return jedna(opts.filter((o) => d[1].test(o)), "L3 chybí");
  // L2c / L3c — proč
  const p = PROC.filter(([rs]) => rs.every((r) => r.test(q)));
  expect(p, `solver: neznámá šablona: ${q}`).toHaveLength(1);
  return jedna(opts.filter(p[0][1]), "proč");
}

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator!(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function najdiUzel(n: unknown, id: string): { labels?: { area: string; topic: string } } | undefined {
  if (Array.isArray(n)) {
    for (const x of n) { const r = najdiUzel(x, id); if (r) return r; }
  } else if (n && typeof n === "object") {
    const o = n as Record<string, unknown>;
    if (o.id === id && o.labels) return o as { labels: { area: string; topic: string } };
    for (const v of Object.values(o)) { const r = najdiUzel(v, id); if (r) return r; }
  }
  return undefined;
}

describe("Stavba buňky — metadata", () => {
  it("přírodopis g6, select_one, factual, category/topic znak po znaku dle RVP", () => {
    expect(topic.id).toBe("g6-pri-stavba-bunky-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Stavba buňky — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, deterministicky, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    expect(topic.generator!(level).map((t) => t.question)).toEqual(tasks.map((t) => t.question));
    for (const t of tasks) expect(Array.isArray(t.options), t.question).toBe(true);
  });

  it("4 unikátní možnosti, klíč právě jednou, feedback pro každý distraktor", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("nezávislý solver dojde ke stejnému klíči", () => {
    for (const t of tasks) expect(t.correctAnswer, t.question).toBe(vyres(t));
  });

  it("klíč není v otázce ani v nápovědách; hints[0] ≠ hints[1]", () => {
    for (const t of tasks) {
      const k = norm(t.correctAnswer);
      expect(norm(t.question).includes(k), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) expect(norm(h).includes(k), `nápověda prozrazuje: ${h}`).toBe(false);
    }
  });

  it("klíč nevyčnívá prvním slovem", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(jine).size === 1) expect(prvni(t.correctAnswer), `klíč vyčnívá: ${t.question}`).toBe(jine[0]);
    }
  });
});

describe("Stavba buňky — napříč tématem", () => {
  it("klíč není systematicky nejdelší", () => {
    let nejdelsi = 0;
    let vyrazne = 0;
    for (const t of all) {
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0] === t.correctAnswer && s[0].length > s[1].length) nejdelsi++;
      if (s[0] === t.correctAnswer && s[0].length >= s[1].length * 1.25) vyrazne++;
    }
    expect(nejdelsi / all.length, `klíč nejdelší v ${nejdelsi}/${all.length}`).toBeLessThanOrEqual(0.4);
    expect(vyrazne / all.length, `klíč výrazně nejdelší v ${vyrazne}/${all.length}`).toBeLessThanOrEqual(0.1);
  });

  it("L1 ∩ L3 = ∅ a formulace L1 se na L2/L3 neobjevují", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    expect(tasksBy[3].map((t) => t.question).filter((q) => q1.has(q))).toHaveLength(0);
    for (const t of [...tasksBy[2], ...tasksBy[3]]) {
      expect(/Která součást buňky|K čemu slouží/.test(t.question), t.question).toBe(false);
    }
  });

  it("šablony L1 se střídají rovnoměrně", () => {
    const a = tasksBy[1].filter((t) => t.question.startsWith("Která součást buňky")).length;
    const b = tasksBy[1].filter((t) => t.question.startsWith("K čemu slouží")).length;
    expect(a + b).toBe(tasksBy[1].length);
    expect(Math.abs(a - b)).toBeLessThanOrEqual(1);
  });

  it("nápovědy unikátní napříč úlohami", () => {
    expect(new Set(all.map((t) => t.hints![0])).size).toBe(all.length);
    expect(new Set(all.map((t) => t.hints![1])).size).toBe(all.length);
  });

  it("žádná červená krvinka, žádná houba, žádné organely nad rámec 6. ročníku", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) {
        expect(/krvink|houb|ribozom|retikul|golgi|centriol/i.test(s), s).toBe(false);
        expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
      }
    }
  });
});
