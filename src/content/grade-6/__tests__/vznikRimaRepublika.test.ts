import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { VZNIK_RIMA_KRALOVSTVI_REPUBLIKA } from "../dejepis/vznikRimaRepublika";
import { pad } from "@/lib/czechGrammar";
import type { PracticeTask } from "@/lib/types";

/**
 * Vznik Říma, království, republika, krize republiky — faktický select_one vzor.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, nic nepřebírá z generátoru):
 *  (1) RANK — události jako záporné roky; „nejdříve/nejpozději“ = max/min stáří.
 *      Zároveň ověří, že letopočty ve znění sedí s tabulkou a žádné dva se neshodují.
 *  (2) TRVÁNÍ — oba letopočty regexem ze znění, |a − b| porovná s číslem v klíči.
 *  (3) KLASIFIKÁTOR klíčových slov — situace → fáze, pravomoc → úřad.
 *  (4) FAKTA (L1) a TVRZENÍ (L3) — znění → vzor správné možnosti; vyhovět smí právě jedna.
 * Generátor vrací celou banku, takže test je deterministický výčet.
 */
const topic = VZNIK_RIMA_KRALOVSTVI_REPUBLIKA[0];

// (1) rank-tabulka: vzor názvu možnosti → rok (záporný = př. n. l.)
const RANK: [RegExp, number][] = [
  [/^Založení Říma/, -753],
  [/krále/, -510],
  [/desek/, -450],
  [/Kartág/, -146],
  [/Spartak/, -73],
  [/Rubikon/, -49],
  [/zavraždění/i, -44],
];
const rankOf = (o: string) => {
  const hit = RANK.filter(([re]) => re.test(o));
  expect(hit, `rank pro "${o}"`).toHaveLength(1);
  return hit[0][1];
};

// (3) klasifikátory
const FAZE: [RegExp, string][] = [
  [/půdu chudým|vojevůdcem a poslouchají|gladiátor|tři mocní|občanské válce/i, "V době krize republiky"],
  [/každý rok|vymohli vlastní úředníky|sepíše zákony|senát a vojska/i, "V době republiky před krizí"],
  [/doživotně|panovník|jediný vládce/i, "V době království"],
];
const URADY: [RegExp, string][] = [
  [/zakázat|plebej/i, "Tribun lidu"],
  [/nebezpečí|šesti měsících|nepřítel stojí/i, "Diktátor"],
  [/v radě|sboru/i, "Senátor"],
  [/dva nejvyšší|dvou nejvyšších/i, "Konzul"],
];
const URAD_NAMES = ["Tribun lidu", "Konzul", "Senátor", "Diktátor"];

// (4) fakta L1 a tvrzení L3
const FAKTA: [RegExp, RegExp][] = [
  [/bratři, kteří založili/, /^Romulus a Remus$/],
  [/přešel se slony/, /^Hannibal$/],
  [/Kolik konzulů/, /^Dva, .*jeden rok$/],
  [/bohatí urození/, /^Patricijové$/],
  [/prostí svobodní/, /^Plebejové$/],
  [/punské války/, /Kartág/],
  [/radil konzulům/, /^Senát$/],
  [/poslední římský král/, /Tarquinius/],
  [/nejstarší sepsané/, /dvanácti desek/],
  [/povstání otroků/, /^Spartakus$/],
  [/triumvirát/, /^Caesar, Pompeius a Crassus$/],
  [/řeku překročil/, /^Rubikon$/],
  [/zavražděn spiklenci/, /^Julius Caesar$/],
  [/prosazoval, aby chudí/, /Grakch/],
  [/leží město Řím/, /^Tiber$/],
];
const TVRZENI: [RegExp, RegExp][] = [
  [/Čemu tím chtěli zabránit/, /nezískal natrvalo jediný/],
  [/přišli o půdu a odcházeli/, /vojevůdce/],
  [/přestávala fungovat/, /vlastním vojskem na Řím/],
  [/diktátor vládnout nanejvýš/, /nový král/],
  [/sepsané a vystavené/, /patricijové nemohli vykládat/],
  [/vedl vojsko do Itálie/, /občanská válka/],
  [/vražda Caesara/, /bojovat další vojevůdci/],
  [/nejvíc ohrozil dělení moci/, /doživotně/],
  [/bratři Grakchové rozdělit/, /sloužit ve vojsku/],
  [/aténské demokracie/, /volení úředníci a senát/],
];

function solve(t: PracticeTask, level: number): { kind: string; expected: string } {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]) => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };

  // (1) chronologie
  const smer = q.match(/proběhla (nejdříve|nejpozději)\?$/);
  if (smer) {
    const roky = opts.map(rankOf);
    expect(new Set(roky).size, `shodné roky v "${q}"`).toBe(4);
    const veZneni = [...q.matchAll(/(\d+) př\. n\. l\./g)].map((m) => -Number(m[1])).sort((a, b) => a - b);
    expect(veZneni, `letopočty ve znění: ${q}`).toEqual([...roky].sort((a, b) => a - b));
    const cil = smer[1] === "nejdříve" ? Math.min(...roky) : Math.max(...roky);
    return one("chronologie", opts.filter((o) => rankOf(o) === cil));
  }
  // (2) trvání
  if (/Kolik let|Jak dlouho/.test(q)) {
    const nums = [...q.matchAll(/(\d+) př\. n\. l\./g)].map((m) => Number(m[1]));
    expect(nums, q).toHaveLength(2);
    const n = Math.abs(nums[0] - nums[1]); // obě př. n. l. → odčítání
    for (const o of opts) expect(o, "tvar čísla přes pad()").toBe(pad(parseInt(o, 10), "ROK"));
    return one("trvání", opts.filter((o) => parseInt(o, 10) === n));
  }
  // (3a) fáze
  if (/Kdy se (to|takové volby) v římských dějinách (dělo|konaly)\?$/.test(q)) {
    const hit = FAZE.filter(([re]) => re.test(q));
    expect(hit, `klasifikátor fáze: ${q}`).toHaveLength(1);
    return one("fáze", opts.filter((o) => o === hit[0][1]));
  }
  // (3b) úřad
  if ([...opts].sort().join("|") === [...URAD_NAMES].sort().join("|")) {
    const hit = URADY.filter(([re]) => re.test(q));
    expect(hit, `klasifikátor úřadu: ${q}`).toHaveLength(1);
    return one("úřad", opts.filter((o) => o === hit[0][1]));
  }
  // (4) fakta / tvrzení
  const table = level === 1 ? FAKTA : TVRZENI;
  const rules = table.filter(([re]) => re.test(q));
  expect(rules, `pravidlo pro "${q}"`).toHaveLength(1);
  return one(level === 1 ? "fakt" : "tvrzení", opts.filter((o) => rules[0][1].test(o)));
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Klíč jako celé slovo/fráze (bez ohledu na velikost písmen). */
const obsahuje = (text: string, key: string) =>
  new RegExp(`(?<!\\p{L})${esc(key)}(?!\\p{L})`, "iu").test(text);
const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");

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

describe("Vznik Říma — metadata", () => {
  it("dějepis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.topic).toBe("Antika - Řím");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Vznik Říma — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh, jen select_one se 4 různými možnostmi", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) {
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("chybový model: každý ze 3 distraktorů má feedback, správná ne", () => {
    for (const t of tasks) {
      const distr = t.options!.filter((o) => o !== t.correctAnswer);
      expect(distr).toHaveLength(3);
      for (const d of distr) expect(t.optionFeedback![d], `chybí feedback: "${d}"`).toBeTruthy();
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s druhou cestou (právě 1 správná)", () => {
    for (const t of tasks) {
      const v = solve(t, level);
      expect(t.correctAnswer, `${v.kind}: ${t.question}`).toBe(v.expected);
    }
  });

  it("klíč není ve znění ani v nápovědách; nápovědy unikátní a různé", () => {
    const h0 = new Set<string>();
    const h1 = new Set<string>();
    for (const t of tasks) {
      expect(obsahuje(t.question, t.correctAnswer), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints!.length).toBe(2);
      for (const h of t.hints!) expect(obsahuje(h, t.correctAnswer), `hint leak: ${h}`).toBe(false);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(h0.has(t.hints![0]), `opakovaná malá nápověda: ${t.hints![0]}`).toBe(false);
      expect(h1.has(t.hints![1]), `opakovaná velká nápověda: ${t.hints![1]}`).toBe(false);
      h0.add(t.hints![0]);
      h1.add(t.hints![1]);
    }
  });

  it("klíč nevyčnívá délkou ani prvním slovem", () => {
    let klic = 0;
    let distr = 0;
    for (const t of tasks) {
      const podleDelky = [...t.options!].sort((a, b) => b.length - a.length);
      if (podleDelky[0].length >= 1.25 * podleDelky[1].length) {
        if (podleDelky[0] === t.correctAnswer) klic++;
        else distr++;
      }
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      const vycniva = jine[0].length >= 3 && new Set(jine).size === 1 && jine[0] !== prvni(t.correctAnswer);
      expect(vycniva, `klíč vyčnívá prvním slovem: ${t.question}`).toBe(false);
    }
    const vzorec = klic / tasks.length >= 0.35 && klic >= 2.5 * Math.max(1, distr);
    expect(vzorec, `klíč výrazně nejdelší v ${klic} z ${tasks.length}`).toBe(false);
  });

  it("datace: 753 jen s pověstí, 510 a 450 s asi/kolem", () => {
    for (const t of tasks) {
      const texty = [t.question, t.explanation ?? "", ...t.options!, ...(t.hints ?? []), ...(t.solutionSteps ?? []), ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) {
        for (const m of s.matchAll(/(\d+) př\. n\. l\./g)) {
          const pred = s.slice(Math.max(0, m.index! - 14), m.index!);
          if (m[1] === "753") expect(/pověst/i.test(s), `753 bez pověsti: "${s}"`).toBe(true);
          if (m[1] === "510" || m[1] === "450") expect(/asi|kolem/.test(pred), `${m[1]} bez asi/kolem: "${s}"`).toBe(true);
        }
      }
    }
  });
});

describe("Vznik Říma — gradace a výpočet", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L2 má ≥12 situací a ≥12 chronologických čtveřic", () => {
    const l2 = topic.generator(2);
    expect(l2.filter((t) => /proběhla (nejdříve|nejpozději)\?$/.test(t.question)).length).toBeGreaterThanOrEqual(12);
    expect(l2.filter((t) => !/proběhla (nejdříve|nejpozději)\?$/.test(t.question)).length).toBeGreaterThanOrEqual(12);
  });

  it("výpočet trvání 510 → 44: klíč 466, v krocích mezivýsledek, distraktor 554 (sečteno)", () => {
    const t = topic.generator(3).find((x) => /510 př\. n\. l\..*44 př\. n\. l\./.test(x.question))!;
    expect(t.correctAnswer).toBe(pad(466, "ROK"));
    expect(t.options).toContain(pad(554, "ROK"));
    expect(t.solutionSteps!.some((s) => s.includes("510 − 44 = 466"))).toBe(true);
  });

  it("šestice sezení neopakuje šablonu: L3 ≤ 1 výpočet, L2 ≤ 2 chronologie (obou směrů)", () => {
    for (let i = 0; i < 20; i++) {
      const l3 = topic.generator(3).slice(0, 6);
      expect(l3.filter((t) => /Kolik let|Jak dlouho/.test(t.question)).length).toBeLessThanOrEqual(1);
      const l2 = topic.generator(2).slice(0, 6);
      const chrono = l2.map((t) => t.question.match(/proběhla (nejdříve|nejpozději)\?$/)?.[1]).filter(Boolean);
      expect(chrono).toHaveLength(2);
      expect(new Set(chrono).size).toBe(2);
      const urady = l2.filter((t) => [...t.options!].sort().join("|") === [...URAD_NAMES].sort().join("|"));
      expect(urady).toHaveLength(2);
    }
  });

  it("Augustus ani císařství nejsou klíčem", () => {
    for (const l of [1, 2, 3]) {
      for (const t of topic.generator(l)) expect(/Augustus|císař/i.test(t.correctAnswer), t.question).toBe(false);
    }
  });
});
