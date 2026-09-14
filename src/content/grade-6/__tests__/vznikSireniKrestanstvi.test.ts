import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { VZNIK_SIRENI_KRESTANSTVI } from "../dejepis/vznikSireniKrestanstvi";
import type { PracticeTask } from "@/lib/types";

/**
 * Vznik a šíření křesťanství — FAKTICKÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta), pole `correct` z banky nepoužívá:
 *  (A) ROLE — tabulka osoba → kotva v zadání. U úloh, kde jsou všechny možnosti
 *      jména osob, solver najde kotvu (edikt, požár, misijní cesty…) a odvodí osobu.
 *  (B) ROK — tabulka událost → přibližný rok. Řadí posloupnosti se šipkami,
 *      ověřuje tvrzení „X předcházelo Y“ a hledá krok, který musel přijít dřív.
 *  (C) STOLETÍ — anachronismus: jediná možnost, která do 1. století patřit nemůže.
 *  (D) POČET — kolik evangelií (4) z vlastní tabulky.
 *  (E) FAKTORY — který faktor šíření neplatil (silnice, jazyk a mír platily).
 *  (F) FAKTA — ostatní úlohy: kotva otázky → znak jediné připustné možnosti.
 * Plus strukturní kontroly podle specifikace.
 */
const topic = VZNIK_SIRENI_KRESTANSTVI[0];

// (A) osoba → kotva v otázce (zapsáno nezávisle na generátoru)
const ROLE: [string, RegExp][] = [
  ["Pavel", /misijní cesty|psal listy/i],
  ["Petr", /prvního římského biskupa/i],
  ["Nero", /požáru Říma/i],
  ["Konstantin", /Milánský edikt/i],
  ["Pontius Pilát", /místodržitel/i],
];
const OSOBY = new Set([
  "Ježíš", "Petr", "Pavel", "Jidáš", "Tomáš", "Ondřej", "Nero", "Konstantin", "Theodosius",
  "Dioklecián", "Augustus", "Oktavián Augustus", "Julius Caesar", "Herodes Veliký", "Pontius Pilát",
]);

// (B) událost → přibližný rok
const ROK: [RegExp, number][] = [
  [/ukřižov/i, 30],
  [/nera|požár/i, 64],
  [/dioklecián/i, 303],
  [/milánsk|povolení víry/i, 313],
  [/státní/i, 380],
  [/západořím/i, 476],
  [/slovan/i, 863],
  [/rozdělení církve/i, 1054],
];
const rok = (s: string): number => {
  const hit = ROK.find(([r]) => r.test(s));
  expect(hit, `ROK nezná „${s}“`).toBeDefined();
  return hit![1];
};

// (C) jev → století, ve kterém mohl nastat nejdřív
const STOLETI: [RegExp, number][] = [
  [/kostel|povolen/i, 4],
  [/pavel/i, 1],
  [/nera/i, 1],
  [/ryb/i, 1],
  [/jeruzal/i, 1],
];
const stoleti = (s: string): number => {
  const hit = STOLETI.find(([r]) => r.test(s));
  expect(hit, `STOLETI nezná „${s}“`).toBeDefined();
  return hit![1];
};

// (D) počty
const POCET_EVANGELII = 4;

// (E) faktory, které šíření víry opravdu vysvětlují
const PLATNE_FAKTORY = /silnic|jazyk|mír/i;

interface Fakt { pojem: string; otazka: RegExp[]; moznost: RegExp | ((o: string) => boolean) }
const FAKTA: Fakt[] = [
  // L1
  { pojem: "kraj působení", otazka: [/části Římské říše působil/i], moznost: /palestin/i },
  { pojem: "město ukřižování", otazka: [/ve kterém městě byl Ježíš ukřižován/i], moznost: /jeruzal/i },
  { pojem: "původ víry", otazka: [/z jakého náboženství/i], moznost: /judais/i },
  { pojem: "část Bible", otazka: [/druhá část Bible/i], moznost: /^nový zákon$/i },
  { pojem: "evangelium", otazka: [/co znamená slovo evangelium/i], moznost: /radostn/i },
  { pojem: "znamení", otazka: [/které zvíře/i], moznost: /^rybu$/i },
  { pojem: "pohřbívání", otazka: [/pohřbívali své mrtvé/i], moznost: /katakomb/i },
  { pojem: "apoštol", otazka: [/^kdo byl apoštol/i], moznost: /učedník/i },
  { pojem: "počet bohů", otazka: [/kolik bohů/i], moznost: /^jediného/i },
  { pojem: "biskup Říma", otazka: [/nazývá biskup Říma/i], moznost: /^papež$/i },
  // L2
  { pojem: "důvod pronásledování", otazka: [/proč Římané křesťany pronásledovali/i], moznost: (o) => /obětovat/i.test(o) && /císaře/i.test(o) },
  { pojem: "edikt přinesl", otazka: [/co přinesl Milánský edikt/i], moznost: /svobodně/i },
  { pojem: "otroci a chudí", otazka: [/otroky a chudé/i], moznost: /rovni/i },
  { pojem: "tajná setkání", otazka: [/scházeli tajně/i], moznost: /hrozil trest/i },
  { pojem: "Theodosius", otazka: [/Theodosius kolem roku 380/i], moznost: /státním náboženstvím/i },
  { pojem: "Pavlovy listy", otazka: [/Pavel psal listy/i], moznost: /spojení/i },
  { pojem: "proč ryba", otazka: [/tajné znamení rybu/i], moznost: /zkratku/i },
  { pojem: "rozdíl od Říma", otazka: [/nejvíc lišilo/i], moznost: /jediného Boha/i },
  { pojem: "Nerovo obvinění", otazka: [/Nero obvinil/i], moznost: /svalit vinu/i },
  { pojem: "silnice", otazka: [/římské silnice/i], moznost: /rychle dostali/i },
  { pojem: "role Petra", otazka: [/apoštol Petr tak důležitý/i], moznost: /první biskup/i },
  { pojem: "naděje", otazka: [/naději/i], moznost: /spásu/i },
  { pojem: "Dioklecián", otazka: [/Diokleciána/i], moznost: /^poslední/i },
  { pojem: "všem národům", otazka: [/nejen Židům/i], moznost: /všech národů/i },
  // L3
  { pojem: "soud 2. století", otazka: [/odmítl obětovat u sochy/i], moznost: (o) => /^trest/i.test(o) && /neúct/i.test(o) },
  { pojem: "List Římanům", otazka: [/List Římanům/], moznost: /existovala dřív/i },
  { pojem: "nález v podzemí", otazka: [/podzemní chodbě/i], moznost: /křesťané$/i },
  { pojem: "Pavel občan", otazka: [/římský občan a mluvil řecky/i], moznost: /rozuměli/i },
  { pojem: "centrum církve", otazka: [/centrem církve/i], moznost: /hlavním městem/i },
  { pojem: "bez ediktu", otazka: [/edikt nevydal/i], moznost: /hrozba trestu/i },
  { pojem: "Tacitus", otazka: [/Tacitus/i], moznost: /svedl vinu/i },
  { pojem: "chyba spolužáka", otazka: [/spolužák tvrdí/i], moznost: /pozdější stav/i },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function vyres(t: PracticeTask): string {
  const q = t.question;
  const opts = t.options!;
  // (A) role osob
  if (opts.every((o) => OSOBY.has(o))) {
    const osoby = ROLE.filter(([, r]) => r.test(q)).map(([o]) => o);
    expect(osoby, `solver A: nejednoznačná kotva v: ${q}`).toHaveLength(1);
    expect(opts, `solver A: ${q}`).toContain(osoby[0]);
    return osoby[0];
  }
  // (B1) posloupnost se šipkami
  if (opts.every((o) => o.includes("→"))) {
    const hit = opts.filter((o) => {
      const r = o.split("→").map((x) => rok(x));
      return r.every((v, i) => i === 0 || r[i - 1] < v);
    });
    expect(hit, `solver B1: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (B2) tvrzení „X předcházelo Y“
  if (opts.every((o) => / předcházel[oa]? /.test(o))) {
    const hit = opts.filter((o) => {
      const m = /^(.+?) předcházel[oa]? (.+)$/.exec(o)!;
      return rok(m[1]) < rok(m[2]);
    });
    expect(hit, `solver B2: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (B3) krok, který musel přijít dřív než státní náboženství
  if (/musel přijít dřív/i.test(q)) {
    const hit = opts.filter((o) => rok(o) < rok("státní"));
    expect(hit, `solver B3: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (C) anachronismus vůči 1. století
  if (/nemohlo platit v 1\. století/i.test(q)) {
    const hit = opts.filter((o) => stoleti(o) > 1);
    expect(hit, `solver C: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (D) počet evangelií
  if (/kolik evangelií/i.test(q)) {
    const hit = opts.filter((o) => o.startsWith(`${POCET_EVANGELII} `));
    expect(hit, `solver D: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (E) faktor, který šíření nevysvětluje
  if (/NEvysvětluje/.test(q)) {
    const hit = opts.filter((o) => !PLATNE_FAKTORY.test(o));
    expect(hit, `solver E: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (F) fakta
  const fakty = FAKTA.filter((f) => f.otazka.every((r) => r.test(q)));
  expect(fakty.map((f) => f.pojem), `solver F: nejednoznačný/žádný fakt pro: ${q}`).toHaveLength(1);
  const m = fakty[0].moznost;
  const ok = opts.filter((o) => (typeof m === "function" ? m(o) : m.test(o)));
  expect(ok, `solver F (${fakty[0].pojem}): nepřipouští právě 1 možnost v: ${q}`).toHaveLength(1);
  return ok[0];
}

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator!(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);

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

describe("Křesťanství — metadata", () => {
  it("dějepis g6, select_one, factual, category/topic znak po znaku dle RVP", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Antika - Řím");
    expect(topic.studentTitle).toBe("Jak se šířilo křesťanství");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });

  it("číslo + podstatné jméno jen přes helper (žádné inline „4 evangelia“)", () => {
    const src = readFileSync(join(process.cwd(), "src/content/grade-6/dejepis/vznikSireniKrestanstvi.ts"), "utf8");
    const kod = src.split("\n").filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l)).join("\n");
    expect(/\d+\s+(evangeli|apoštol)/i.test(kod)).toBe(false);
  });
});

describe.each(LEVELS)("Křesťanství — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, deterministicky, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    expect(topic.generator!(level).map((t) => t.question).sort()).toEqual(tasks.map((t) => t.question).sort());
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
      if (new Set(jine).size === 1 && jine[0].length >= 3) {
        expect(prvni(t.correctAnswer), `klíč vyčnívá: ${t.question}`).toBe(jine[0]);
      }
    }
  });
});

describe("Křesťanství — napříč tématem", () => {
  it("klíč není systematicky nejdelší", () => {
    let nejdelsi = 0;
    let vyrazne = 0;
    let sumKlic = 0;
    let sumDistr = 0;
    for (const t of all) {
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0] === t.correctAnswer && s[0].length > s[1].length) nejdelsi++;
      if (s[0] === t.correctAnswer && s[0].length >= s[1].length * 1.25) vyrazne++;
      const d = t.options!.filter((o) => o !== t.correctAnswer);
      sumKlic += t.correctAnswer.length;
      sumDistr += d.reduce((a, o) => a + o.length, 0) / d.length;
    }
    expect(nejdelsi / all.length, `klíč nejdelší v ${nejdelsi}/${all.length}`).toBeLessThanOrEqual(0.4);
    expect(vyrazne / all.length, `klíč výrazně nejdelší v ${vyrazne}/${all.length}`).toBeLessThanOrEqual(0.1);
    expect(sumKlic / sumDistr).toBeLessThanOrEqual(1.15);
  });

  it("L1 ∩ L3 = ∅ (znění otázek)", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    expect(tasksBy[3].map((t) => t.question).filter((q) => q1.has(q))).toHaveLength(0);
  });

  it("nápovědy unikátní napříč úlohami", () => {
    expect(new Set(all.map((t) => t.hints![0])).size).toBe(all.length);
    expect(new Set(all.map((t) => t.hints![1])).size).toBe(all.length);
  });

  it("povolení × státní náboženství se nikdy nezamění v klíči", () => {
    for (const t of all) {
      if (/edikt/i.test(t.question) && !/Theodosius/i.test(t.question)) {
        expect(/státní|jediným povoleným/i.test(t.correctAnswer), t.question).toBe(false);
      }
      expect(/1054/.test(t.correctAnswer), t.question).toBe(false);
    }
  });

  it("žádné rodové lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
    }
  });
});
