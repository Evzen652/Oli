import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { VIRY_STAVBA_VYZNAM } from "../prirodopis/viryStavbaVyznam";
import type { PracticeTask } from "@/lib/types";

/**
 * Viry — stavba, význam, virová onemocnění (FAKTICKÝ select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta), pole `correct` z banky nepoužívá:
 *  (A) NEMOCI — vlastní tabulky VIROVÉ × BAKTERIÁLNÍ. Když jsou všechny možnosti
 *      nemoci, solver vybere tu jedinou virovou (u popisu s klíštětem nebo
 *      kousnutím ji ještě zúží podle přenašeče) a ověří, že žádný distraktor
 *      virový není.
 *  (B) FAKTA — ostatní úlohy: znaky otázky → znak jediné připustné možnosti.
 * Plus pravidlové kontroly podle specifikace (antibiotika, „vir je buňka“,
 * struktura, nápovědy, disjunktnost, determinismus, délka, začátky možností).
 */
const topic = VIRY_STAVBA_VYZNAM[0];

const VIROVE: [RegExp, string][] = [
  [/chřipk/i, "kapénky"], [/rým/i, "kapénky"], [/plané neštovice/i, "kapénky"],
  [/spalničk/i, "kapénky"], [/příušnic/i, "kapénky"], [/zarděnk/i, "kapénky"],
  [/klíšťová encefalitid/i, "klíště"], [/vzteklin/i, "kousnutí"], [/opar/i, "dotyk"],
  [/covid/i, "kapénky"], [/aids|hiv/i, "krev"],
];
const BAKTERIALNI = [/angín/i, /borelióz/i, /tetanus/i, /salmonelóz/i, /tuberkulóz/i, /cholera/i];
const jeVirova = (o: string) => VIROVE.some(([r]) => r.test(o));
const jeBakterialni = (o: string) => BAKTERIALNI.some((r) => r.test(o));
const prenos = (o: string) => VIROVE.find(([r]) => r.test(o))?.[1];

interface Fakt { pojem: string; otazka: RegExp[]; moznost: RegExp }
const FAKTA: Fakt[] = [
  // L1
  { pojem: "složení", otazka: [/z čeho se skládá vir/i], moznost: /dědičné informace.*bílkovin/i },
  { pojem: "vir × bakterie", otazka: [/čím se liší stavba viru/i], moznost: /^vir nemá buněčnou/i },
  { pojem: "kde množení", otazka: [/kde se vir může množit/i], moznost: /živé buňky/i },
  { pojem: "pozorování", otazka: [/čím se dají viry pozorovat/i], moznost: /elektronov/i },
  { pojem: "očkování co", otazka: [/co dělá očkování/i], moznost: /předem/i },
  { pojem: "lék na bakterie", otazka: [/které léky ničí bakterie/i], moznost: /^antibiotika$/i },
  { pojem: "všechny viry", otazka: [/co platí pro všechny viry/i], moznost: /jen v živých buňkách/i },
  { pojem: "bez buňky", otazka: [/nemá buněčnou stavbu/i], moznost: /^virus/i },
  { pojem: "prevence", otazka: [/předejít/i, /před nákazou/i], moznost: /^očkování$/i },
  // L2
  { pojem: "rada chřipka", otazka: [/tomáš/i], moznost: /nebere.*nezabír/i },
  { pojem: "rýma nákaza", otazka: [/eliška/i], moznost: /kapénk/i },
  { pojem: "encefalitida nákaza", otazka: [/honza/i], moznost: /klíšt/i },
  { pojem: "vzteklina nákaza", otazka: [/filip/i], moznost: /kousnut/i },
  { pojem: "hiv", otazka: [/hiv/i, /přenáší/i], moznost: /krv/i },
  { pojem: "prevence rýma", otazka: [/martin/i], moznost: /mytí rukou/i },
  { pojem: "kýchání", otazka: [/klára/i], moznost: /rukáv/i },
  { pojem: "chata", otazka: [/novákovi/i], moznost: /^očkování a dlouhé oblečení/i },
  { pojem: "borelióza bez vakcíny", otazka: [/jakub/i], moznost: /bakteriální a vakcína na ni zatím není/i },
  { pojem: "nepomůže", otazka: [/karolína/i], moznost: /antibiotik.*nepůsob/i },
  { pojem: "třída", otazka: [/ondra/i], moznost: /kapénk/i },
  { pojem: "babička", otazka: [/babička/i], moznost: /naučí/i },
  { pojem: "anička", otazka: [/anička/i], moznost: /mýdlem/i },
  { pojem: "netopýr", otazka: [/netopýr/i], moznost: /lékaři/i },
  { pojem: "spalničky očkování", otazka: [/petra/i], moznost: /kapénk.*nezabír/i },
  // L3
  { pojem: "neznámý útvar", otazka: [/vědci objevili/i, /filtrem/i], moznost: /virus/i },
  { pojem: "proč ATB", otazka: [/proč antibiotika na viry/i], moznost: /nemá vlastní buňku/i },
  { pojem: "vakcína každý rok", otazka: [/každý rok/i], moznost: /mění/i },
  { pojem: "mimo buňku", otazka: [/proč se vir mimo/i], moznost: /cizí buňku/i },
  { pojem: "fág", otazka: [/pronikne do bakterie/i], moznost: /fág/i },
  { pojem: "mozaika", otazka: [/mozaik/i], moznost: /^virus/i },
  { pojem: "ATB nepomohla", otazka: [/nepomohla/i, /drobné částice/i], moznost: /virus$/i },
  { pojem: "ATB pomohla", otazka: [/uzdravili/i, /bez jádra/i], moznost: /bakterie$/i },
  { pojem: "filtr", otazka: [/proč vir projde filtrem/i], moznost: /menší/i },
  { pojem: "šíření", otazka: [/mimo tělo nemnoží/i], moznost: /vydrží/i },
  { pojem: "rýma ATB", otazka: [/pro jistotu/i, /rýmě/i], moznost: /viry, na které nepůsobí/i },
  { pojem: "popis viru", otazka: [/který popis patří viru/i], moznost: /bez buňky/i },
  { pojem: "vir v bakterii", otazka: [/napadnout i bakterii/i], moznost: /živá buňka/i },
  { pojem: "návrat do školy", otazka: [/vracet do školy/i], moznost: /šířit viry/i },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function vyres(t: PracticeTask): string {
  const q = t.question;
  const opts = t.options!;
  // (A) nemoci
  if (opts.every((o) => o.split(" ").length <= 3 && (jeVirova(o) || jeBakterialni(o)))) {
    let hit = opts.filter(jeVirova);
    if (/klíšt/i.test(q)) hit = hit.filter((o) => prenos(o) === "klíště");
    if (/kousnut/i.test(q)) hit = hit.filter((o) => prenos(o) === "kousnutí");
    expect(hit, `solver A: ${q}`).toHaveLength(1);
    for (const d of opts.filter((o) => o !== t.correctAnswer)) {
      expect(jeVirova(d), `distraktor je virový („také správně“): ${d}`).toBe(false);
    }
    return hit[0];
  }
  // (B) fakta
  const fakty = FAKTA.filter((f) => f.otazka.every((r) => r.test(q)));
  expect(fakty.map((f) => f.pojem), `solver B: nejednoznačný/žádný fakt pro: ${q}`).toHaveLength(1);
  const ok = opts.filter((o) => fakty[0].moznost.test(o));
  expect(ok, `solver B (${fakty[0].pojem}): nepřipouští právě 1 možnost v: ${q}`).toHaveLength(1);
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

describe("Viry — metadata", () => {
  it("přírodopis g6, select_one, factual, category/topic znak po znaku dle RVP", () => {
    expect(topic.id).toBe("g6-pri-viry-stavba-vyznam-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.category).toBe("Nebuněční a bakterie");
    expect(topic.topic).toBe("Viry a bakterie");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Viry — úroveň %i", (level) => {
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
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
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

describe("Viry — napříč tématem", () => {
  it("žádný klíč nedoporučuje antibiotika proti viru", () => {
    for (const t of all) {
      if (/antibiotik/i.test(t.correctAnswer)) {
        // Negace smí být v klíči („nezabírají“), nebo v otázce („ale na viry nepůsobí“, „nepomůže“).
        expect(/nezabír|nepůsob|nepomoh|nepomůže/i.test(`${t.question} ${t.correctAnswer}`), `klíč: ${t.correctAnswer}`).toBe(true);
      }
    }
  });

  it("žádný klíč netvrdí, že vir je buňka", () => {
    for (const t of all) {
      const k = t.correctAnswer;
      if (/vir.*(je|má).*buňk/i.test(k)) expect(/nemá/i.test(k), `klíč: ${k}`).toBe(true);
    }
  });

  it("L3: všechny možnosti u otázek „Proč…“ začínají „Protože“", () => {
    for (const t of tasksBy[3].filter((x) => /^Proč/.test(x.question))) {
      for (const o of t.options!) expect(o.startsWith("Protože"), `${t.question} → ${o}`).toBe(true);
    }
  });

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
