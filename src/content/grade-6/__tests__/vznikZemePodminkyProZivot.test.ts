import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { VZNIK_ZEME_PODMINKY_PRO_ZIVOT, PARY_L2 } from "../prirodopis/vznikZemePodminkyProZivot";
import type { PracticeTask } from "@/lib/types";

/**
 * Vznik Země, podmínky pro život — faktický select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta), banku generátoru neimportuje:
 *  (A) KLÍČOVÁ SLOVA → PODMÍNKA. Když se otázka ptá „která podmínka / co / který
 *      plyn…“, solver ze ZNĚNÍ určí pojem (UV → ozon, dýchat → kyslík,
 *      fotosyntéza/ohřívá/vypařuje → Slunce, rozpustí/děje v buňkách → kapalná voda,
 *      přehřál/malých těles → atmosféra, nezamrzne/zmrzly → teplota…) a právě
 *      jedna možnost ho musí obsahovat.
 *  (B) FAKTA A PŘENOS — vlastní tabulka: vzor otázky → vzor jediné přípustné
 *      možnosti. U vymyšlených planet solver z popisu sám zjistí, co planetě
 *      chybí (mráz / tma / bez kyslíku / bez vody), a teprve pak hledá možnost.
 * Plus strukturní a faktické pojistky podle specifikace.
 */
const topic = VZNIK_ZEME_PODMINKY_PRO_ZIVOT[0];

// (A) otázka „která podmínka…“ → pojem podle klíčových slov
const PODMINKY: { otazka: RegExp; moznost: RegExp }[] = [
  { otazka: /škodlivým zářením/, moznost: /^ozonov/i },
  { otazka: /tlakové lahve/, moznost: /^kyslíku$/i },
  { otazka: /sklepě bez okna/, moznost: /^světlo/i },
  { otazka: /ohřívá povrch|vypařovala/, moznost: /slunce/i },
  { otazka: /rozpustí a rozvedou|děje uvnitř buněk/, moznost: /^kapalná voda$/i },
  { otazka: /přes den přehřál|malých těles/, moznost: /^atmosféra/i },
  { otazka: /nezamrzne|zmrzly nebo/, moznost: /teplota/i },
  { otazka: /berou rostliny z půdy/, moznost: /živin/i },
  { otazka: /plyn ze vzduchu rostliny/, moznost: /^oxid uhličitý$/i },
  { otazka: /naplnily ovzduší/, moznost: /sinice/i },
];

// (B) fakta a přenos
function planeta(q: string): RegExp | null {
  if (!/vymyšlen/i.test(q)) return null;
  if (/pod −\d+ °C|jen jako led/.test(q)) return /^kapalná voda/i;
  if (/úplná tma/.test(q)) return /^světlo/i;
  if (/není kyslík/.test(q)) return /nedýchají/;
  if (/nevyskytuje vůbec/.test(q)) return /^chybí voda/i;
  return null;
}

const FAKTA: { otazka: RegExp; moznost: RegExp }[] = [
  // L1
  { otazka: /z čeho .*vznikla/i, moznost: /prachu a plynu/ },
  { otazka: /jak stará/i, moznost: /miliard/ },
  { otazka: /krátce po svém vzniku/, moznost: /rozžhaven/ },
  { otazka: /začala chladnout/, moznost: /kůra/ },
  { otazka: /první oceány\?/, moznost: /páry/ },
  { otazka: /kde se objevily/i, moznost: /^ve vodě/i },
  { otazka: /jaké byly úplně první/i, moznost: /jednobuněč/ },
  { otazka: /skoro úplně chyběl/, moznost: /^kyslík$/i },
  { otazka: /velké množství\?/, moznost: /sopečných plynů/ },
  { otazka: /patří mezi podmínky/, moznost: /kapaln/i },
  { otazka: /nepatří\?/, moznost: /měsíc/i },
  { otazka: /získávají zelené rostliny energii/, moznost: /slunce/i },
  { otazka: /největší část těla/, moznost: /^voda$/i },
  { otazka: /plynný obal/, moznost: /^atmosféra$/i },
  { otazka: /patří k nejstarším/, moznost: /bakterie/ },
  // L2 — podmínka → funkce
  { otazka: /důležitá ozonová vrstva/, moznost: /UV/ },
  { otazka: /potřebují kyslík v ovzduší/, moznost: /k dýchání$/ },
  { otazka: /slouží rostlinám a sinicím energie/, moznost: /^umožňuje jim fotosyntézu/i },
  { otazka: /přestala dostávat energii/, moznost: /vychladl/ },
  { otazka: /potřebují kapalnou vodu/, moznost: /rozpouští živiny/i },
  { otazka: /nemohly fungovat buňky/, moznost: /probíhají/i },
  { otazka: /atmosféra Země ovlivňuje/, moznost: /výkyv/ },
  { otazka: /malých kamínků/, moznost: /shoří/i },
  { otazka: /příliš horko ani příliš zima/, moznost: /kapalná$/ },
  { otazka: /pod bod mrazu/, moznost: /zmrzne/ },
  { otazka: /slouží živiny z půdy/, moznost: /stavbě těla/ },
  { otazka: /potřebují oxid uhličitý/, moznost: /cukry/ },
  { otazka: /změnily ovzduší/, moznost: /uvolnily/i },
  { otazka: /koloběhu vody/, moznost: /vypařuje/i },
  // L3 (b) planety
  // Merkur je blíž, a přesto chladnější → rozhoduje ovzduší, ne vzdálenost
  { otazka: /^Venuše.*Merkur/, moznost: /ovzduší.*zadržuje teplo/ },
  // bez ozonové vrstvy → UV
  { otazka: /^Mars je.*nemá ozonovou/, moznost: /UV/ },
  { otazka: /na Venuši ani na Marsu/, moznost: /vzdálenost i ovzduší/ },
  // led neroztaje → chlad
  { otazka: /ledové čepičky.*netečou řeky/, moznost: /mráz/ },
  // L3 (c) pořadí
  { otazka: /vylézt z vody na souš/, moznost: /UV/ },
  { otazka: /nemohly dýchat kyslík/, moznost: /skoro nebyl/ },
  { otazka: /nejdřív žít sinice/, moznost: /uvolnily kyslík/ },
  { otazka: /nemohla vytvořit hned/, moznost: /kyslík/ },
  // L3 (d) kdyby
  { otazka: /přišla o celou atmosféru/, moznost: /horko a v noci mráz/ },
  { otazka: /mnohem dál/, moznost: /zamrzla/ },
  { otazka: /mnohem blíž/, moznost: /vypařily/ },
  { otazka: /ozonová vrstva hodně zeslabila/, moznost: /UV/ },
  { otazka: /hustý prach/, moznost: /světla/ },
];

function vyres(t: PracticeTask): string {
  const q = t.question;
  const opts = t.options!;
  const pl = planeta(q);
  const vzory = pl
    ? [pl]
    : [...PODMINKY, ...FAKTA].filter((f) => f.otazka.test(q)).map((f) => f.moznost);
  expect(vzory, `solver: žádný/nejednoznačný pojem pro: ${q}`).toHaveLength(1);
  const ok = opts.filter((o) => vzory[0].test(o));
  expect(ok, `solver: ${vzory[0]} nepřipouští právě 1 možnost v: ${q} ${JSON.stringify(opts)}`).toHaveLength(1);
  return ok[0];
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

describe("Vznik Země — metadata", () => {
  it("přírodopis g6, select_one, factual, category/topic znak po znaku dle RVP", () => {
    expect(topic.id).toBe("g6-pri-vznik-zeme-podminky-pro-zivot-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.rvpNodeId).toBe("g6-prirodopis-obecna-biologie-vznik-a-vyvoj-zivota-vznik-zeme-podminky-pro-zivot");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });

  it("deterministický při stejném seedu, i po posunu globálního stavu", () => {
    const otisk = () => {
      const puvodni = Math.random;
      Math.random = seeded(7);
      try {
        return JSON.stringify(LEVELS.map((l) => topic.generator!(l).map((t) => [t.question, t.correctAnswer, t.options])));
      } finally {
        Math.random = puvodni;
      }
    };
    const a = otisk();
    for (let i = 0; i < 5; i++) Math.random();
    topic.generator!(2);
    expect(otisk()).toBe(a);
  });
});

describe.each(LEVELS)("Vznik Země — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
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

describe("Vznik Země — napříč tématem", () => {
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

  it("L1, L2 a L3 mají po dvou disjunktní znění otázek", () => {
    const q = LEVELS.map((l) => new Set(tasksBy[l].map((t) => t.question)));
    for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) {
      expect([...q[b]].filter((x) => q[a].has(x))).toHaveLength(0);
    }
  });

  it("nápovědy unikátní napříč úlohami", () => {
    expect(new Set(all.map((t) => t.hints![0])).size).toBe(all.length);
    expect(new Set(all.map((t) => t.hints![1])).size).toBe(all.length);
  });

  it("L2 se ptá z obou stran (podmínka → funkce i funkce → podmínka)", () => {
    const l2 = tasksBy[2];
    const zpet = l2.filter((t) => /^(Která|Které|Který|Co dodává|Co hlavně|Co berou|Díky které)/.test(t.question));
    expect(zpet.length).toBeGreaterThanOrEqual(6);
    expect(l2.length - zpet.length).toBeGreaterThanOrEqual(6);
  });

  it("sezení (prvních 6 úloh) nemá obě strany téže dvojice L2 ani opakovaný cíl v L3", () => {
    const l2 = tasksBy[2].slice(0, 6).map((t) => t.question);
    for (const p of PARY_L2) {
      expect(l2.includes(p.f.q) && l2.includes(p.r.q), `dvojice v jednom sezení: ${p.f.q}`).toBe(false);
    }
    const l3 = tasksBy[3].slice(0, 6).map((t) => t.correctAnswer);
    expect(l3.filter((k) => /kapaln|voda/i.test(k)).length, l3.join(" | ")).toBeLessThanOrEqual(1);
    expect(l3.filter((k) => /UV/.test(k)).length, l3.join(" | ")).toBeLessThanOrEqual(1);
  });

  it("L3 střídá všechny čtyři šablony", () => {
    const l3 = tasksBy[3];
    expect(l3.filter((t) => /vymyšlen/i.test(t.question)).length).toBeGreaterThanOrEqual(3);
    expect(l3.filter((t) => /Venuš|Mars/.test(t.question) && !/kdyby|Představ/.test(t.question)).length).toBeGreaterThanOrEqual(3);
    expect(l3.filter((t) => /^Proč|^Ozon vzniká/.test(t.question) && !/Venuš|Mars/.test(t.question)).length).toBeGreaterThanOrEqual(3);
    expect(l3.filter((t) => /kdyby/.test(t.question)).length).toBeGreaterThanOrEqual(3);
  });

  it("faktické pojistky v klíčích", () => {
    for (const t of all) {
      const k = t.correctAnswer;
      expect(/dýchal.*kyslík|kyslík.*dýchal/i.test(k) && !/nedých|nebyl/.test(k), `první org. dýchaly kyslík: ${k}`).toBe(false);
      expect(/ozon/i.test(k) && /dých/i.test(k), `ozon k dýchání: ${k}`).toBe(false);
      if (/kde se objevily|první organismy/i.test(t.question) && /kde/i.test(t.question)) {
        expect(/souš/i.test(k), `život na souši: ${k}`).toBe(false);
      }
      if (/jak stará/i.test(t.question)) expect(k).toMatch(/miliard/);
      if (/\blet\b/.test(k)) expect(k).toMatch(/miliard/);
    }
  });

  it("bez Millerova pokusu a bez rodových lomítek", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) {
        expect(/miller|prapolévk/i.test(s), s).toBe(false);
        expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
      }
    }
  });
});
