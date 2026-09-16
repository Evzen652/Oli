import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HOUBY_STAVBA_VYZIVA_VYZNAM } from "../prirodopis/houbyStavbaVyziva";
import type { PracticeTask } from "@/lib/types";

/**
 * Houby – stavba, výživa, význam — FAKTICKÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta), banku generátoru neimportuje:
 *  (1) KLASIFIKÁTOR klíčových slov nad zněním otázky → kmen, který musí klíč
 *      obsahovat (rozklad / cizopas / soužití-výměna / hotové / kvasink / vyhodit).
 *  (2) TABULKA POJMŮ pro L1 (definice → pojem), psaná ručně.
 *  (3) FAKTA pro ostatní úlohy: znaky otázky → znak jediné připustné možnosti.
 * Plus invarianty ze specifikace.
 */
const topic = HOUBY_STAVBA_VYZIVA_VYZNAM[0];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// (1) klasifikátor — pořadí je důležité (živý hostitel před mrtvým dřevem)
interface Pravidlo { jmeno: string; otazka: (q: string) => boolean; kmen: RegExp; zakaz?: RegExp }
const KLASIFIKATOR: Pravidlo[] = [
  { jmeno: "tma", otazka: (q) => /tma|sklep/.test(q), kmen: /hotov/, zakaz: /fotosyntez|svetl/ },
  { jmeno: "cizopasník", otazka: (q) => /ziv/.test(q) && /slab|hyn|vadn|chrad/.test(q) && /jak se .*zivi|jakou roli|co houba dela|proc\?/.test(q), kmen: /cizopas/ },
  { jmeno: "soužití", otazka: (q) => /(poblize|pod osik|jen tam, kde)/.test(q) && /vztah|navzajem/.test(q), kmen: /souzit|vymen/ },
  { jmeno: "rozkladač", otazka: (q) => /parez|spadlem listi|mrtvem kmeni|opad/.test(q) && /jak se zivi|odkud bere|zaradis|co tam .*delaji/.test(q), kmen: /rozklad/ },
  { jmeno: "kvasinky", otazka: (q) => /kyne|kynulo|drozdi/.test(q), kmen: /kvasink/ },
  { jmeno: "plesnivé jídlo", otazka: (q) => /plisn|plesniv/.test(q) && /co je spravne udelat/.test(q), kmen: /vyhod/ },
];

// (2) + (3) fakta: otázka → jediná připustná možnost
interface Fakt { pojem: string; otazka: RegExp; moznost: RegExp }
const FAKTA: Fakt[] = [
  // L1 — tabulka pojmů
  { pojem: "podhoubí", otazka: /splet jemnych vlaken/, moznost: /^podhoubi$/ },
  { pojem: "plodnice", otazka: /vidime nad zemi a sbirame/, moznost: /^plodnice$/ },
  { pojem: "výtrusy", otazka: /^cim se houby rozmnozuji/, moznost: /^vytrusy$/ },
  { pojem: "rourky", otazka: /u hribu tvori vytrusy/, moznost: /rourk/ },
  { pojem: "lupeny", otazka: /muchomurky nebo zampionu/, moznost: /lupen/ },
  { pojem: "ne rostlina", otazka: /nepatri mezi rostliny/, moznost: /nemaji chlorofyl/ },
  { pojem: "chitin", otazka: /steny bunek hub/, moznost: /^chitin$/ },
  { pojem: "kvasinka", otazka: /jednobunecna houba/, moznost: /^kvasinka$/ },
  { pojem: "plíseň", otazka: /zelenomodry povlak/, moznost: /^plisen$/ },
  { pojem: "mykorhiza", otazka: /souziti houby s koreny/, moznost: /^mykorhiza$/ },
  { pojem: "rozkladač", otazka: /zivi odumrelymi zbytky/, moznost: /^rozkladac$/ },
  { pojem: "cizopasník", otazka: /bere ziviny zivemu organismu/, moznost: /^cizopasnik$/ },
  { pojem: "chlorofyl", otazka: /houby nemaji, a proto/, moznost: /^chlorofyl$/ },
  { pojem: "třeň", otazka: /nese klobouk/, moznost: /^tren$/ },
  { pojem: "říše", otazka: /do ktere skupiny organismu houby patri/, moznost: /rise hub/ },
  // L2
  { pojem: "pařez", otazka: /parezu/, moznost: /rozklad.*odumrel/ },
  { pojem: "listí", otazka: /spadlem listi na podzim/, moznost: /rozklad.*do pudy/ },
  { pojem: "kmen", otazka: /mrtvem kmeni/, moznost: /rozkladac/ },
  { pojem: "jehličí", otazka: /opadaneho jehlici/, moznost: /odumrel/ },
  { pojem: "choroš bříza", otazka: /zive brize/, moznost: /^je cizopasnik/ },
  { pojem: "václavka", otazka: /vaclavka/, moznost: /cizopas/ },
  { pojem: "růže", otazka: /zive ruze/, moznost: /cizopas/ },
  { pojem: "buk", otazka: /zivem buku/, moznost: /je cizopasnik/ },
  { pojem: "hřib smrk vztah", otazka: /hrib smrkovy/, moznost: /souzit/ },
  { pojem: "kozák výměna", otazka: /navzajem davaji/, moznost: /houba dava vodu.*briza cukry/ },
  { pojem: "křemenáč", otazka: /kremenac/, moznost: /^souziti/ },
  { pojem: "hřib dostává", otazka: /co dostava hrib od smrku/, moznost: /^cukry/ },
  { pojem: "lesník a břízy", otazka: /hliny z brezoveho lesa/, moznost: /dodaji brizam vodu/ },
  { pojem: "droždí", otazka: /pekar/, moznost: /kvasink/ },
  { pojem: "penicilin", otazka: /lek, ktery nici bakterie/, moznost: /penicilin/ },
  { pojem: "chléb", otazka: /krajici chleba/, moznost: /vyhodit cely/ },
  { pojem: "význam rozkladu", otazka: /k cemu je to lesu dobre/, moznost: /ziviny se vraceji/ },
  // L3
  { pojem: "sklep", otazka: /sklepe bez oken/, moznost: /hotove/ },
  { pojem: "houbař šetrně", otazka: /nevyhrabava/, moznost: /podhoubi/ },
  { pojem: "největší část", otazka: /ktera cast je nejvetsi/, moznost: /podhoubi/ },
  { pojem: "plocha", otazka: /obrovskou plochou/, moznost: /vytrus/ },
  { pojem: "vykácené břízy", otazka: /vykaceli/, moznost: /prestanou rust/ },
  { pojem: "bez rozkladačů", otazka: /nezily zadne rozkladajici/, moznost: /hromadily/ },
  { pojem: "zařazení", otazka: /organismus nema chlorofyl/, moznost: /^mezi houby$/ },
  { pojem: "sýr × jogurt", otazka: /marmelada/, moznost: /prorostou snadno/ },
  { pojem: "kruh hub", otazka: /v pravidelnem kruhu/, moznost: /podhoubi/ },
  { pojem: "vyrostla znovu", otazka: /za rok na stejnem miste/, moznost: /podhoubi/ },
  { pojem: "kvasinka znak", otazka: /nema klobouk/, moznost: /^nema chlorofyl/ },
  { pojem: "proč les", otazka: /rostou nejvic v lese/, moznost: /hotove ziviny i stromy/ },
  { pojem: "kde hřiby", otazka: /houbar hleda hriby/, moznost: /^u smrku, hrib potrebuje strom/ },
  { pojem: "poznat cizopasníka", otazka: /na cem se pozna/, moznost: /je zivy a slabne/ },
  { pojem: "plíseň a kvasinka", otazka: /co maji spolecne/, moznost: /obe jsou houby/ },
  { pojem: "rozlišení", otazka: /houba, nebo rostlina/, moznost: /chlorofyl/ },
];

function vyres(t: PracticeTask): string {
  const q = norm(t.question);
  const opts = t.options!;
  const fakty = FAKTA.filter((f) => f.otazka.test(q));
  expect(fakty.map((f) => f.pojem), `solver: žádný/nejednoznačný fakt pro: ${t.question}`).toHaveLength(1);
  const ok = opts.filter((o) => fakty[0].moznost.test(norm(o)));
  expect(ok, `solver (${fakty[0].pojem}) nepřipouští právě 1 možnost: ${t.question}`).toHaveLength(1);
  return ok[0];
}

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator!(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);

function najdiUzel(n: unknown, id: string): { labels?: { area: string; topic: string; subtopic: string } } | undefined {
  if (Array.isArray(n)) {
    for (const x of n) { const r = najdiUzel(x, id); if (r) return r; }
  } else if (n && typeof n === "object") {
    const o = n as Record<string, unknown>;
    if (o.id === id && o.labels) return o as { labels: { area: string; topic: string; subtopic: string } };
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

describe("Houby — metadata", () => {
  it("přírodopis g6, select_one, factual, category/topic/title znak po znaku dle RVP", () => {
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.studentTitle).toBe("Houby – z čeho jsou a čím se živí");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(uzel?.labels?.subtopic).toBe(topic.title);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Houby — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) expect(Array.isArray(t.options), t.question).toBe(true);
  });

  it("50 generování: 4 různé možnosti, klíč právě jednou, feedback, nápovědy", () => {
    for (let n = 0; n < 50; n++) {
      for (const t of topic.generator!(level)) {
        expect(t.options, t.question).toHaveLength(4);
        expect(new Set(t.options).size, t.question).toBe(4);
        expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
        for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
          expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
        }
        expect(t.explanation, t.question).toBeTruthy();
        const k = norm(t.correctAnswer);
        expect(norm(t.question).includes(k), `giveaway: ${t.question}`).toBe(false);
        expect(t.hints, t.question).toHaveLength(2);
        expect(t.hints![0]).not.toBe(t.hints![1]);
        for (const h of t.hints!) expect(norm(h).includes(k), `nápověda prozrazuje: ${h}`).toBe(false);
        // klíč nikdy netvrdí, že houba je rostlina nebo dělá fotosyntézu
        expect(/je rostlina|fotosyntez/.test(k) && !/\bne|nema/.test(k), `klíč: ${t.correctAnswer}`).toBe(false);
      }
    }
  });

  it("nezávislý solver (fakta) dojde ke stejnému klíči", () => {
    for (const t of tasks) expect(t.correctAnswer, t.question).toBe(vyres(t));
  });

  it("klasifikátor klíčových slov: klíč obsahuje očekávaný kmen", () => {
    for (const t of tasks) {
      const q = norm(t.question);
      const p = KLASIFIKATOR.find((r) => r.otazka(q));
      if (!p) continue;
      const k = norm(t.correctAnswer);
      expect(p.kmen.test(k), `${p.jmeno}: ${t.question} → ${t.correctAnswer}`).toBe(true);
      if (p.zakaz) expect(p.zakaz.test(k), `${p.jmeno}: ${t.correctAnswer}`).toBe(false);
    }
  });

  it("klíč nevyčnívá prvním slovem", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(jine).size === 1) expect(prvni(t.correctAnswer), `klíč vyčnívá: ${t.question}`).toBe(jine[0]);
    }
  });

  it("determinismus: stejný seed → stejný výstup", () => {
    const puvodni = Math.random;
    try {
      Math.random = seeded(42);
      const a = JSON.stringify(topic.generator!(level));
      Math.random = seeded(42);
      const b = JSON.stringify(topic.generator!(level));
      expect(b).toBe(a);
    } finally {
      Math.random = puvodni;
    }
  });
});

describe("Houby — napříč tématem", () => {
  it("klasifikátor se opravdu uplatní (aspoň 10 úloh)", () => {
    const zasahy = all.filter((t) => KLASIFIKATOR.some((r) => r.otazka(norm(t.question))));
    expect(zasahy.length).toBeGreaterThanOrEqual(10);
  });

  it("klíč není systematicky nejdelší", () => {
    let sumK = 0, sumD = 0, vyrazne = 0;
    for (const t of all) {
      const d = t.options!.filter((o) => o !== t.correctAnswer);
      sumK += t.correctAnswer.length;
      sumD += d.reduce((s, o) => s + o.length, 0) / d.length;
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0] === t.correctAnswer && s[0].length >= s[1].length * 1.25) vyrazne++;
    }
    expect(sumK / sumD).toBeLessThanOrEqual(1.3);
    expect(vyrazne / all.length, `klíč výrazně nejdelší v ${vyrazne}/${all.length}`).toBeLessThanOrEqual(0.1);
  });

  it("L1 ∩ L3 = ∅ (znění otázek)", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    expect(tasksBy[3].map((t) => t.question).filter((q) => q1.has(q))).toHaveLength(0);
  });

  it("nápovědy unikátní napříč úlohami", () => {
    expect(new Set(all.map((t) => t.hints![0])).size).toBe(all.length);
    expect(new Set(all.map((t) => t.hints![1])).size).toBe(all.length);
  });

  it("žádné rodové lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
    }
  });
});
