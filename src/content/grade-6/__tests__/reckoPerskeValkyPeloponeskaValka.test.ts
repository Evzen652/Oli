import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RECKO_PERSKE_VALKY_PELOPONESKA_VALKA } from "../dejepis/reckoPerskeValkyPeloponeskaValka";
import type { PracticeTask } from "@/lib/types";

/**
 * Řecko-perské války a peloponéská válka — faktický select_one vzor 2. stupně.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky faktů, nezávislé na bankách generátoru):
 *  (a) RANK — letopočty jako záporná čísla; „co bylo dřív“, rozdíl let a „co muselo předcházet“.
 *      Délku války přepočítává z čísel ve znění otázky.
 *  (b) ACTORS — osoba → strana, role, bitvy/války; constraints se čtou ze znění otázky.
 *  (c) BATTLES — bitva → souš/moře, výsledek pro Řeky, rok.
 *  (d) klasifikátor klíčových slov → válka (perské × peloponéská).
 *  (e) CLAIMS — zbylé (převážně L3) otázky: znění → vzor správného tvrzení; vyhovět smí právě 1 možnost.
 * Generátor vrací celou banku, takže test je deterministický výčet.
 */
const topic = RECKO_PERSKE_VALKY_PELOPONESKA_VALKA[0];

// (a) rank-tabulka
const RANK: Record<string, number> = {
  "iónské povstání": -499,
  "začátek iónského povstání": -499,
  "bitva u marathónu": -490,
  "bitva u thermopyl": -480,
  "bitva u salamíny": -480,
  "bitva u platají": -479,
  "délský spolek": -478,
  "začátek peloponéské války": -431,
  "mor v athénách": -430,
  "konec peloponéské války": -404,
};

// (b) aktéři
type Side = "persie" | "athény" | "sparta" | "jiná";
interface Actor { side: Side; role: "král" | "vojevůdce" | "politik" | "dějepisec" | "básník" | "filozof"; tags: string[] }
const ACTORS: Record<string, Actor> = {
  "Dáreios I.": { side: "persie", role: "král", tags: ["marathon", "perske"] },
  "Xerxés": { side: "persie", role: "král", tags: ["thermopyly", "salamina", "perske", "480"] },
  "Kýros Veliký": { side: "persie", role: "král", tags: [] },
  "Miltiadés": { side: "athény", role: "vojevůdce", tags: ["marathon", "perske"] },
  "Leónidás": { side: "sparta", role: "král", tags: ["thermopyly", "perske"] },
  "Themistoklés": { side: "athény", role: "vojevůdce", tags: ["salamina", "lodstvo", "perske"] },
  "Periklés": { side: "athény", role: "politik", tags: ["peloponeska"] },
  "Lýsandros": { side: "sparta", role: "vojevůdce", tags: ["peloponeska", "lodstvo"] },
  "Hérodotos": { side: "jiná", role: "dějepisec", tags: ["perske"] },
  "Thúkydidés": { side: "athény", role: "dějepisec", tags: ["peloponeska"] },
  "Homér": { side: "jiná", role: "básník", tags: ["trojska"] },
  "Sókratés": { side: "athény", role: "filozof", tags: [] },
};
/** Znění otázky → podmínka na aktéra. */
const ACTOR_RULES: [RegExp, (a: Actor) => boolean][] = [
  [/perský král/i, (a) => a.side === "persie" && a.role === "král"],
  [/Sparťanům|spartský vojevůdce/, (a) => a.side === "sparta"],
  [/athénský (vojevůdce|politik)|stavbu athénského/i, (a) => a.side === "athény"],
  [/dějepisec/i, (a) => a.role === "dějepisec"],
  [/Marathón/, (a) => a.tags.includes("marathon")],
  [/Thermopyl/, (a) => a.tags.includes("thermopyly")],
  [/\b480\b/, (a) => a.tags.includes("480")],
  [/loďstv|lodí(?!\p{L})/iu, (a) => a.tags.includes("lodstvo")],
  [/peloponés/i, (a) => a.tags.includes("peloponeska")],
  [/Peršany|Peršan/, (a) => a.tags.includes("perske")],
  [/řecko-persk/i, (a) => a.tags.includes("perske")],
];

// (c) bitvy
const BATTLES: Record<string, { rok: number; typ: "souš" | "moře"; recke_vitezstvi: boolean; gen: string }> = {
  marathon: { rok: -490, typ: "souš", recke_vitezstvi: true, gen: "Marathónu" },
  thermopyly: { rok: -480, typ: "souš", recke_vitezstvi: false, gen: "Thermopyl" },
  salamina: { rok: -480, typ: "moře", recke_vitezstvi: true, gen: "Salamíny" },
  plataje: { rok: -479, typ: "souš", recke_vitezstvi: true, gen: "Platají" },
};
const battleByGen = (s: string) => Object.keys(BATTLES).find((b) => s.includes(BATTLES[b].gen));
/** Popis bez jména → bitva. */
const BATTLE_DESC: [RegExp, string][] = [
  [/průsmyk/i, "thermopyly"],
  [/lodě .*flotil|úžin.*ostrov/i, "salamina"],
  [/Dáreios/, "marathon"],
];

// (d) klasifikátor válek
type War = "perske" | "pel" | "troj" | "alex";
const WAR_KEYWORDS: [RegExp, War][] = [
  [/Periklés|\bmor\b|Lýsandros|pustošili pole v Attice|strach Sparty/i, "pel"],
  [/Xerxés|Dáreios|perské nadvládě|velkého krále|Marathón/i, "perske"],
];
const warOfOption = (o: string): War | null =>
  /peloponés/i.test(o) ? "pel" : /persk|Persi/i.test(o) ? "perske" : /trojsk/i.test(o) ? "troj" : /Alexandr/.test(o) ? "alex" : null;

// (e) tvrzení
const CLAIMS: [RegExp, RegExp][] = [
  [/Kdo proti sobě stál v peloponéské/, /^Athény .*proti Spartě$/],
  [/spolek řeckých obcí vedený Athénami/, /^Délský/],
  [/spolek, v jehož čele stála Sparta/, /^Peloponéský/],
  [/zvítězil v peloponéské válce/, /^Sparta$/],
  [/Themistoklův plán/, /porazily perskou flotilu u Salamíny/],
  [/vedlo ke sporu Athén se Spartou/, /zbohatly a Sparta se jich bála/],
  [/Sparta nakonec vyhrála/, /perské peníze.*loďstvo zničila/],
  [/peloponéská válka společné/, /proti Persii, podruhé mezi sebou/],
  [/šli do boje svobodně/, /svobodní občané bránili/],
  [/Athénský dějepisec sám velel/, /^Mor, na který/],
  [/hrdinský čin/, /zdrželi Peršany/],
  [/v čele námořního spolku/, /Athény měly nejsilnější loďstvo/],
  [/pokladnu spolku/, /nástroj své moci/],
  [/po roce 479/, /u Salamíny a Platají/],
  [/mor na začátku/, /lidí z venkova/],
  [/peníze od Persie/, /pozemní vojsko, ale na loďstvo/],
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const ql = q.toLowerCase();
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };

  // (a0) seřaď tři události
  if (/^Seřaď události/.test(q)) {
    const ROK_SEG: [RegExp, number][] = [[/ión/i, 499], [/Salamín/i, 480], [/peloponés/i, 431]];
    for (const [re, rok] of ROK_SEG) {
      const m = q.match(new RegExp(`${re.source}\\S* \\S*\\s*\\((\\d+) př`, "i"));
      if (m) expect(Number(m[1]), q).toBe(rok);
    }
    const roky = (o: string) => o.split(", ").map((s) => ROK_SEG.find(([re]) => re.test(s))![1]);
    return one("seřaď", opts.filter((o) => {
      const r = roky(o);
      return r.length === 3 && r[0] > r[1] && r[1] > r[2];
    }));
  }
  // (a1) co bylo dřív a o kolik
  if (/^Co proběhlo dřív/.test(q)) {
    const ev = Object.keys(RANK).filter((e) => ql.includes(e));
    expect(ev, q).toHaveLength(2);
    for (const e of ev) {
      const m = ql.match(new RegExp(`${e} \\((\\d+) př`));
      expect(Number(m![1]), `letopočet ${e} v "${q}"`).toBe(-RANK[e]);
    }
    const [driv, pozdeji] = RANK[ev[0]] < RANK[ev[1]] ? ev : [ev[1], ev[0]];
    const diff = RANK[pozdeji] - RANK[driv];
    return one("pořadí", opts.filter((o) => o.toLowerCase().startsWith(driv) && new RegExp(`\\bo ${diff} (rok|roky|let) dřív$`).test(o)));
  }
  // (a2) délka z čísel ve znění
  if (/Kolik let/.test(q)) {
    const nums = (q.match(/\b\d{3}\b/g) ?? []).map(Number);
    expect(nums, q).toHaveLength(2);
    const diff = Math.abs(nums[0] - nums[1]);
    return one("délka", opts.filter((o) => o.startsWith(`${diff} `)));
  }
  // (a3) co muselo předcházet (co by … u Marathónu)
  if (/^Co by/.test(q)) {
    const limit = RANK["bitva u marathónu"];
    const rankOf = (o: string) =>
      /iónsk/i.test(o) ? RANK["iónské povstání"] : /Spart/.test(o) ? RANK["začátek peloponéské války"]
        : /Salamín/.test(o) ? RANK["bitva u salamíny"] : /Thermopyl/.test(o) ? RANK["bitva u thermopyl"] : 0;
    return one("předcházet", opts.filter((o) => rankOf(o) < limit));
  }
  // (b) aktéři
  if (opts.every((o) => o in ACTORS)) {
    const rules = ACTOR_RULES.filter(([re]) => re.test(q));
    expect(rules.length, `žádné podmínky v "${q}"`).toBeGreaterThan(0);
    return one("aktér", opts.filter((o) => rules.every(([, p]) => p(ACTORS[o]))));
  }
  // (c1) místo bitvy
  if (opts.every((o) => /^U /.test(o))) {
    const actor = Object.keys(ACTORS).find((a) => q.includes(a));
    let battle: string | undefined;
    if (actor) {
      const bs = ACTORS[actor].tags.filter((x) => x in BATTLES);
      expect(bs, actor).toHaveLength(1);
      battle = bs[0];
    } else {
      const rok = -Number(q.match(/\b(\d{3}) př/)![1]);
      const bs = Object.keys(BATTLES).filter((b) => BATTLES[b].rok === rok);
      expect(bs, `rok ${rok}`).toHaveLength(1);
      battle = bs[0];
    }
    return one("místo", opts.filter((o) => battleByGen(o) === battle));
  }
  // (c2) popis → bitva
  if (/O kterou bitvu/.test(q)) {
    const bs = BATTLE_DESC.filter(([re]) => re.test(q)).map(([, b]) => b);
    expect(bs, q).toHaveLength(1);
    return one("popis bitvy", opts.filter((o) => battleByGen(o) === bs[0]));
  }
  // (c3) souš / moře
  if (/^Kde se bojovalo/.test(q)) {
    const b = battleByGen(q)!;
    const typ = (o: string) => (/loďstv|lodě/i.test(o) ? "moře" : "souš");
    return one("typ bitvy", opts.filter((o) => typ(o) === BATTLES[b].typ));
  }
  // (d) zařazení k válce (L2) a parafráze dějepisce (L3)
  const wars = new Set(WAR_KEYWORDS.filter(([re]) => re.test(q)).map(([, w]) => w));
  if (/Ke které válce/.test(q)) {
    expect(wars.size, q).toBe(1);
    return one("válka", opts.filter((o) => warOfOption(o) === [...wars][0]));
  }
  if (/^Dějepisec napsal, že válku/.test(q)) {
    expect(wars.size, q).toBe(1);
    const cause = /zbohatly a zesílily/;
    return one("dějepisec", opts.filter((o) => warOfOption(o) === [...wars][0] && cause.test(o)));
  }
  // (e) tvrzení
  const rules = CLAIMS.filter(([re]) => re.test(q));
  expect(rules.length, `CLAIMS pro "${q}"`).toBe(1);
  return one("tvrzení", opts.filter((o) => rules[0][1].test(o)));
}

/** Fakta z tabulek: žádný distraktor nesmí být pravdivý podle tabulky. */
function factChecks(t: PracticeTask) {
  // Thermopyly = porážka Řeků → možnost s vítězstvím u Thermopyl nesmí být klíč
  if (/Thermopyl/.test(t.question) && !BATTLES.thermopyly.recke_vitezstvi) {
    expect(/zastavili a zahnali|vyhrály u Thermopyl/.test(t.correctAnswer), t.question).toBe(false);
  }
}

const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
const SPATNA_VAZBA = /(?<!\p{L})[VvZzUu] (Marathón|Thermopyly|Salamína|Plataje|Athény|Sparta|Persie)(?!\p{L})/u;

function rvpLabels(id: string): { area: string; topic: string } {
  const data = JSON.parse(readFileSync(join(process.cwd(), "data", "rvp_data.json"), "utf8"));
  let found: { area: string; topic: string } | null = null;
  const walk = (n: unknown) => {
    if (found || !n || typeof n !== "object") return;
    const o = n as Record<string, unknown>;
    if (o.id === id && o.labels) found = o.labels as { area: string; topic: string };
    for (const v of Object.values(o)) walk(v);
  };
  walk(data);
  expect(found, `RVP uzel ${id}`).not.toBeNull();
  return found!;
}

describe("Řecko-perské války — metadata", () => {
  it("dějepis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Antika - Řecko");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Řecko-perské války — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh, jen select_one se 4 různými možnostmi", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, t.question).toContain(t.correctAnswer);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s druhou cestou (právě 1 správná)", () => {
    for (const t of tasks) {
      const v = solve(t);
      expect(t.correctAnswer, `${v.kind}: ${t.question}`).toBe(v.expected);
      factChecks(t);
    }
  });

  it("klíč není ve znění ani v nápovědách; nápovědy unikátní a různé", () => {
    const h0 = new Set<string>();
    const h1 = new Set<string>();
    for (const t of tasks) {
      const key = t.correctAnswer.toLowerCase();
      expect(t.question.toLowerCase().includes(key), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints!.length).toBe(2);
      for (const h of t.hints!) expect(h.toLowerCase().includes(key), `hint leak: ${h}`).toBe(false);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(h0.has(t.hints![0]), `opakovaná malá nápověda: ${t.hints![0]}`).toBe(false);
      expect(h1.has(t.hints![1]), `opakovaná velká nápověda: ${t.hints![1]}`).toBe(false);
      h0.add(t.hints![0]);
      h1.add(t.hints![1]);
    }
  });

  it("klíč nevyčnívá délkou ani prvním slovem", () => {
    let nejdelsi = 0;
    for (const t of tasks) {
      const podleDelky = [...t.options!].sort((a, b) => b.length - a.length);
      if (podleDelky[0] === t.correctAnswer && podleDelky[0].length >= 1.25 * podleDelky[1].length) nejdelsi++;
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      const vycniva = jine[0].length >= 3 && new Set(jine).size === 1 && jine[0] !== prvni(t.correctAnswer);
      expect(vycniva, `klíč vyčnívá prvním slovem: ${t.question}`).toBe(false);
    }
    expect(nejdelsi, "klíč je výrazně nejdelší příliš často").toBeLessThanOrEqual(2);
  });

  it("předložka se nelepí k holému nominativu; letopočty mají př. n. l.", () => {
    for (const t of tasks) {
      const texty = [t.question, t.explanation ?? "", ...t.options!, ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) {
        expect(SPATNA_VAZBA.test(s), `špatná vazba: "${s}"`).toBe(false);
        for (const m of s.matchAll(/\b(4\d\d)\b(?!\s*[−-])(?!\s*>)/g)) {
          const za = s.slice(m.index! + m[0].length, m.index! + m[0].length + 10);
          const pred = s.slice(Math.max(0, m.index! - 8), m.index!);
          const vRozsahu = /^–\d/.test(za) || /–$/.test(pred) || /do roku $|od roku $|roku $|: $|= $|− $/.test(pred) || /^ (př|do|let|>)/.test(za) || /^\)/.test(za);
          expect(vRozsahu || /př\. n\. l\./.test(s), `letopočet bez př. n. l.: "${s}"`).toBe(true);
        }
      }
    }
  });
});

describe("Řecko-perské války — gradace", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L3 začíná Proč / Co by / Co z toho plyne / Které tvrzení / Co mají / Dějepisec napsal", () => {
    for (const t of topic.generator(3)) {
      expect(/^(Proč|Co by|Co z toho plyne|Které tvrzení|Co mají|Dějepisec napsal)/.test(t.question), t.question).toBe(true);
    }
  });

  it("L1 začíná Kdo / Který / Kde / Jak se jmenoval", () => {
    for (const t of topic.generator(1)) {
      expect(/^(Kdo|Který|Kde|Jak se jmenoval)/.test(t.question), t.question).toBe(true);
    }
  });
});
