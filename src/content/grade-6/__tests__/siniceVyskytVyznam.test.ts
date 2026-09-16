import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SINICE_VYSKYT_VYZNAM } from "../prirodopis/siniceVyskytVyznam";
import type { PracticeTask } from "@/lib/types";

/**
 * Sinice — výskyt a význam, vodní květ — FAKTICKÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta), pole `correct` z banky nepoužívá:
 *  (A) POZNÁVÁNÍ — z popisu v zadání parsuje „má/nemá jádro“ a „má/nemá chlorofyl“
 *      a porovná s vlastní tabulkou organismů; popisu musí odpovídat právě 1 řádek.
 *  (B) POROVNÁNÍ VOD — z textu parsuje teplotu, měsíc, proudění a přísun živin,
 *      spočítá skóre rizika a klíč = voda s vyšším skóre (skóre se musí lišit).
 *  (C) SPOR — tabulka případ → (kdo má pravdu, pravdivý důvod).
 *  (D) FAKTA — klasifikátor klíčových slov: dotazovaný pojem → slovo, které smí
 *      obsahovat jen klíč. Žádný distraktor mu nesmí odpovídat.
 * Plus strukturní kontroly podle specifikace.
 */
const topic = SINICE_VYSKYT_VYZNAM[0];

// (A) vlastní tabulka organismů — nezávislá na generátoru
const TABULKA: { nazev: string; jadro: boolean; chlorofyl: boolean }[] = [
  { nazev: "Sinice", jadro: false, chlorofyl: true },
  { nazev: "Hnilobná bakterie", jadro: false, chlorofyl: false },
  { nazev: "Zelená řasa", jadro: true, chlorofyl: true },
  { nazev: "Trepka", jadro: true, chlorofyl: false },
];

// (B) skóre rizika vodního květu
function skore(popis: string): number {
  let s = 0;
  if (/tepl/.test(popis)) s++;
  if (/studen/.test(popis)) s--;
  if (/červen|srp/.test(popis)) s++;
  if (/březn|dubn|říjn|listopad/.test(popis)) s--;
  if (/stojí|stojat/.test(popis)) s++;
  if (/teče|proud/.test(popis)) s--;
  if (/hnoj|hnůj|odpadní/.test(popis)) s++;
  return s;
}

// (B) jednotlivé podmínky vodního květu a jejich pojmenování v důvodu
const PODMINKY: Record<string, (p: string) => boolean> = {
  teplo: (p) => !/studen/.test(p) && /tepl|červen|srp/.test(p),
  stani: (p) => /stojí/.test(p) && !/teče|proud/.test(p),
  ziviny: (p) => /hnoj|hnůj|odpadní/.test(p),
};
const DUVOD: Record<string, RegExp> = {
  teplo: /dost tepla/,
  stani: /na místě/,
  ziviny: /přicházejí živiny/,
};

// (C) spory: případ → kdo má pravdu a pravdivý důvod
const SPORY: { otazka: RegExp; kdo: string; duvod: RegExp }[] = [
  { otazka: /Tomáš.*Eva/, kdo: "Eva", duvod: /celého těla/ },
  { otazka: /Petr.*Lucie/, kdo: "Lucie", duvod: /nemusí být/ },
  { otazka: /Dědeček.*Anna/, kdo: "Anna", duvod: /přemnožen/ },
  { otazka: /Honza.*Klára/, kdo: "Klára", duvod: /liší se jádrem/ },
  { otazka: /Otakar.*Jitka/, kdo: "Jitka", duvod: /i velkým/ },
  { otazka: /Ondra.*Marie/, kdo: "Marie", duvod: /teple.*živin/ },
];

// (D) fakta: pojem v otázce → znak jediné přípustné možnosti
interface Fakt { pojem: string; otazka: RegExp[]; moznost: RegExp }
const FAKTA: Fakt[] = [
  // L1
  { pojem: "buňka", otazka: [/buňce sinice/i], moznost: /^nemá buněčné jádro, ale má chlorofyl$/i },
  { pojem: "barvivo", otazka: [/zelené barvivo/i, /fotosyntézu/i], moznost: /^chlorofyl$/i },
  { pojem: "plyn", otazka: [/který plyn/i], moznost: /^kyslík$/i },
  { pojem: "kde žijí", otazka: [/kde všude/i], moznost: /vlhké půdě.*kůře/i },
  { pojem: "neobvyklé místo", otazka: [/neobvyklém místě/i], moznost: /horkých pramen/i },
  { pojem: "partner v lišejníku", otazka: [/v lišejníku/i, /s kterým/i], moznost: /^s houbou$/i },
  { pojem: "lišejník", otazka: [/soužití houby a sinice/i], moznost: /^lišejník$/i },
  { pojem: "přemnožení", otazka: [/přemnožení sinic/i, /nazývá/i], moznost: /^vodní květ$/i },
  { pojem: "kdy", otazka: [/^kdy se vodní květ/i], moznost: /létě/i },
  { pojem: "poznávání", otazka: [/podle čeho poznáš/i], moznost: /zakalená/i },
  { pojem: "barva", otazka: [/jakou barvu/i], moznost: /^modrozelen/i },
  { pojem: "minulost", otazka: [/dávné minulosti/i], moznost: /vyráběl kyslík/i },
  { pojem: "způsob života", otazka: [/jak mohou sinice žít/i], moznost: /koloniích.*vláknech/i },
  { pojem: "rozdíl od řas", otazka: [/liší od zelených řas/i], moznost: /jádro/i },
  { pojem: "suroviny", otazka: [/potřebují k fotosyntéze/i], moznost: /světlo.*oxid uhličitý/i },
  { pojem: "velikost", otazka: [/jak velká/i], moznost: /mikroskop/i },
  // L2
  { pojem: "zelený rybník", otazka: [/Jana/], moznost: /^Koupat se nebude a /i },
  { pojem: "pes", otazka: [/se psem/, /přehrady/], moznost: /^Psa do vody nepustí a /i },
  { pojem: "po koupání", otazka: [/omylem vykoupal/], moznost: /^osprchovat/i },
  { pojem: "teplé měsíce", otazka: [/teplých měsících/], moznost: /rychle množí/ },
  { pojem: "hnojiva", otazka: [/hnojí pole/], moznost: /živiny/ },
  { pojem: "odpadní vody", otazka: [/odpadní vody z domácností/], moznost: /přemnoží/ },
  { pojem: "hlášení", otazka: [/voda na koupališti u přehrady/], moznost: /nebudu, dokud/ },
  { pojem: "příčina vyrážky", otazka: [/vyrážku a svědění/], moznost: /^jedovaté/i },
  { pojem: "potíže", otazka: [/jaké potíže hrozí/], moznost: /zažív/ },
  { pojem: "užitek", otazka: [/přiměřeném množství užitečné/], moznost: /^vyrábějí kyslík/i },
  { pojem: "vlhko", otazka: [/kmene buku/], moznost: /chybí vlhko/ },
  { pojem: "ověření", otazka: [/zatopeném lomu/], moznost: /hlášení hygieny/ },
  { pojem: "bazének", otazka: [/bazének/], moznost: /nenapouštět/ },
  { pojem: "stojatá voda", otazka: [/rychle tekoucí řece/], moznost: /voda stojí/ },
  { pojem: "akvárium", otazka: [/akváriu/], moznost: /^sinice/i },
  { pojem: "užitečnost", otazka: [/Kamarád tvrdí/], moznost: /^nemá pravdu, sinice vyrábějí/i },
  { pojem: "zhoršující se vyrážka", otazka: [/svědivou vyrážku/], moznost: /lékař/ },
  { pojem: "voda ve sklenici", otazka: [/průhledné sklenice/], moznost: /zelená zrníčka/ },
  // L3 (znak → důsledek)
  { pojem: "kyslík přes den", otazka: [/slunečného dne/], moznost: /přibývá kyslíku/ },
  { pojem: "hynutí ryb", otazka: [/hynout ryby/], moznost: /ubývá kyslíku/ },
  { pojem: "zisk houby", otazka: [/získává houba/], moznost: /fotosyntéz/ },
  { pojem: "zařazení", otazka: [/Kam tyto organismy patří/], moznost: /bakteri/ },
  { pojem: "hloubka", otazka: [/hlubokém jezeře/], moznost: /hladiny/ },
  { pojem: "zastínění", otazka: [/rostou hůř/], moznost: /světlo/ },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function vyres(t: PracticeTask): string {
  const q = t.question;
  const opts = t.options!;
  // (A) poznávání
  if (opts.every((o) => TABULKA.some((r) => r.nazev === o))) {
    const jadro = !/nemá buněčné jádro/.test(q);
    expect(/buněčné jádro/.test(q), `solver A: chybí jádro v ${q}`).toBe(true);
    const chl = !/nemá (ani )?chlorofyl/.test(q);
    const radky = TABULKA.filter((r) => r.jadro === jadro && r.chlorofyl === chl);
    expect(radky, `solver A: ${q}`).toHaveLength(1);
    return radky[0].nazev;
  }
  // (B) porovnání vod
  if (/Porovnej dvě vody/.test(q)) {
    const m = /Voda A je (.+?)\. Voda B je (.+?)\. Ve které/.exec(q);
    expect(m, `solver B: nečitelné ${q}`).toBeTruthy();
    const sA = skore(m![1]);
    const sB = skore(m![2]);
    expect(sA, `solver B: stejné skóre ${q}`).not.toBe(sB);
    const kde = sA > sB ? "A" : "B";
    // vody se liší právě v jedné podmínce; klíč ji musí jmenovat jako důvod
    const rozdily = Object.entries(PODMINKY).filter(([, f]) => f(m![1]) !== f(m![2])).map(([k]) => k);
    expect(rozdily, `solver B: vody se nemají lišit právě v jedné podmínce: ${q}`).toHaveLength(1);
    const duvod = DUVOD[rozdily[0]];
    const hit = opts.filter((o) => o.startsWith(`Ve vodě ${kde},`) && duvod.test(o));
    expect(hit, `solver B: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (C) spor
  if (/Kdo má pravdu/.test(q)) {
    const spor = SPORY.filter((s) => s.otazka.test(q));
    expect(spor, `solver C: ${q}`).toHaveLength(1);
    const hit = opts.filter((o) => o.startsWith(`${spor[0].kdo},`) && spor[0].duvod.test(o));
    expect(hit, `solver C: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (D) fakta
  const fakty = FAKTA.filter((f) => f.otazka.every((r) => r.test(q)));
  expect(fakty.map((f) => f.pojem), `solver D: nejednoznačný/žádný fakt pro: ${q}`).toHaveLength(1);
  const ok = opts.filter((o) => fakty[0].moznost.test(o));
  expect(ok, `solver D (${fakty[0].pojem}): nepřipouští právě 1 možnost v: ${q}`).toHaveLength(1);
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

describe("Sinice — metadata", () => {
  it("přírodopis g6, select_one, factual, category/topic znak po znaku dle RVP", () => {
    expect(topic.id).toBe("g6-pri-sinice-vyskyt-vyznam-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Nebuněční a bakterie");
    expect(topic.topic).toBe("Sinice a prvoci");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });

  it("deterministický při stejném seedu, i po posunu globálního stavu", () => {
    const otisk = () => {
      const puvodni = Math.random;
      Math.random = seeded(42);
      try {
        return JSON.stringify(LEVELS.map((l) => topic.generator!(l).map((t) => [t.question, t.correctAnswer])));
      } finally {
        Math.random = puvodni;
      }
    };
    const a = otisk();
    for (let i = 0; i < 5; i++) Math.random();
    expect(otisk()).toBe(a);
  });
});

describe.each(LEVELS)("Sinice — úroveň %i", (level) => {
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

describe("Sinice — napříč tématem", () => {
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

  it("L3 střídá všechny čtyři šablony", () => {
    const l3 = tasksBy[3];
    expect(l3.some((t) => /V atlasu je popis/.test(t.question))).toBe(true);
    expect(l3.some((t) => /Porovnej dvě vody/.test(t.question))).toBe(true);
    expect(l3.some((t) => /Kdo má pravdu/.test(t.question))).toBe(true);
    expect(l3.filter((t) => !/V atlasu|Porovnej dvě vody|Kdo má pravdu/.test(t.question)).length).toBeGreaterThan(0);
  });

  it("žádný klíč ani vysvětlení nedoporučuje koupání ve vodním květu ani převařování", () => {
    for (const t of all) {
      expect(/koupat se budu|koupat se bude,|psa pustí|^otec|^tomáš|^dědeček/i.test(t.correctAnswer), t.question).toBe(false);
      const texty = [t.correctAnswer, t.explanation ?? "", ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/převař/i.test(s), `převařování: ${s}`).toBe(false);
    }
  });

  it("bez latinských názvů jako klíč a bez slova prokaryota", () => {
    for (const t of all) {
      const texty = [t.question, t.correctAnswer, ...t.options!];
      for (const s of texty) expect(/prokaryot|cyanobakt/i.test(s), s).toBe(false);
    }
  });

  it("žádné rodové lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
    }
  });
});
