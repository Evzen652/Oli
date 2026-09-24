import { describe, it, expect } from "vitest";
import { STATNI_SYMBOLY_OSOBNOSTI_SVATKY_NASE_VLASTI } from "../vko/statniSymbolyOsobnostiSvatkyNaseVlasti";
import { klicUlohy } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Naše vlast — státní symboly, T. G. Masaryk, státní svátky (VKO 6. ročník,
 * select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): pravidla nad ZNĚNÍM otázky (charakteristická
 * fráze pro každou konkrétní úlohu), ne nad logikou generátoru. Tabulka
 * pojem/svátek/datum → správná odpověď je vypsaná ručně z faktů (zákon
 * č. 3/1993 Sb. a č. 245/2000 Sb.), nezávisle na generátoru. Test navíc
 * ověří, že žádný text otázky L1 se doslovně neshoduje s textem otázky L3.
 */
const topic = STATNI_SYMBOLY_OSOBNOSTI_SVATKY_NASE_VLASTI[0];
const low = (s: string) => s.toLowerCase();

type Pravidlo = { name: string; test: (t: PracticeTask) => boolean; kmen: RegExp };

const PRAVIDLA: Pravidlo[] = [
  // ── L1 — přímé zapamatování jednoho izolovaného faktu ────────────────
  { name: "popis vlajky", test: (t) => /^Obdélník s bílým pruhem/.test(t.question), kmen: /^státní vlajka$/ },
  { name: "popis velkého znaku", test: (t) => /^Čtvrcený štít/.test(t.question), kmen: /^velký státní znak$/ },
  { name: "popis malého znaku", test: (t) => /^Červený štít, na kterém je jen/.test(t.question), kmen: /^malý státní znak$/ },
  { name: "popis hymny", test: (t) => /^Píseň Kde domov můj, ze které/.test(t.question), kmen: /^státní hymna$/ },
  { name: "svátek 28. září", test: (t) => /připadá na 28\. září\?/.test(t.question), kmen: /^den české státnosti$/ },
  { name: "datum Dne vzniku ČSR", test: (t) => /^Na které datum připadá Den vzniku/.test(t.question), kmen: /^28\. října$/ },
  { name: "svátek 17. listopadu", test: (t) => /připadá na 17\. listopadu\?/.test(t.question), kmen: /^den boje za svobodu a demokracii$/ },
  { name: "datum Dne vítězství", test: (t) => /^Na které datum připadá Den vítězství/.test(t.question), kmen: /^8\. května$/ },
  { name: "svátek 5. července", test: (t) => /připadá na 5\. července\?/.test(t.question), kmen: /^den slovanských věrozvěstů cyrila a metoděje$/ },
  { name: "svátek 6. července", test: (t) => /připadá na 6\. července\?/.test(t.question), kmen: /^den upálení mistra jana husa$/ },
  { name: "datum Dne obnovy", test: (t) => /^Na které datum připadá Den obnovy/.test(t.question), kmen: /^1\. ledna$/ },
  { name: "kým byl TGM", test: (t) => /^Kým byl T\. G\. Masaryk\?/.test(t.question), kmen: /^první prezident československa$/ },
  { name: "malý znak zobrazuje", test: (t) => /^Malý státní znak zobrazuje…/.test(t.question), kmen: /^jen českého lva$/ },
  { name: "svátek 1939 i 1989", test: (t) => /^Který svátek roku 1939 i 1989/.test(t.question), kmen: /^den boje za svobodu a demokracii$/ },
  { name: "barva klínu", test: (t) => /^Jakou barvu má klín/.test(t.question), kmen: /^modrou$/ },

  // ── L2 — spojení dvou faktů v jedné odpovědi ─────────────────────────
  { name: "935 svatý Václav", test: (t) => /^V tento den roku 935/.test(t.question), kmen: /^den české státnosti, 28\. září$/ },
  { name: "1918 vznik ČSR", test: (t) => /^V tento den roku 1918 vznikl/.test(t.question), kmen: /^den vzniku samostatného československého státu, 28\. října$/ },
  { name: "Národní třída", test: (t) => /^V tento den lidé pokládají svíčky/.test(t.question), kmen: /^den boje za svobodu a demokracii, 17\. listopadu$/ },
  { name: "1945 konec války", test: (t) => /^V tento den roku 1945/.test(t.question), kmen: /^den vítězství, 8\. května$/ },
  { name: "bratři ze Soluně (L2)", test: (t) => /^V tento den si lidé připomínají dva bratry/.test(t.question), kmen: /^den slovanských věrozvěstů cyrila a metoděje, 5\. července$/ },
  { name: "1415 Kostnice (L2)", test: (t) => /^V tento den roku 1415/.test(t.question), kmen: /^den upálení mistra jana husa, 6\. července$/ },
  { name: "1993 rozdělení (L2)", test: (t) => /^V tento den roku 1993/.test(t.question), kmen: /^den obnovy samostatného českého státu, 1\. ledna$/ },
  { name: "TGM stát a funkce", test: (t) => /^T\. G\. Masaryk stanul v čele státu/.test(t.question), kmen: /^první prezident československa$/ },
  { name: "štít lev + orlice = velký znak", test: (t) => /^Na štítu jsou vedle sebe český lev/.test(t.question), kmen: /^znak, konkrétně velký státní znak$/ },
  { name: "štít jen lev = malý znak", test: (t) => /^Na červeném poli štítu je jen samotný stříbrný lev/.test(t.question), kmen: /^znak, konkrétně malý státní znak$/ },
  { name: "první sloka hymny", test: (t) => /^Z písně Kde domov můj se při státních příležitostech zpívá/.test(t.question), kmen: /^první sloka, státní hymna$/ },
  { name: "tatíček TGM", test: (t) => /^Lidé svého prvního prezidenta láskyplně nazývali/.test(t.question), kmen: /^t\. g\. masaryk, první prezident československa$/ },

  // ── L3 — přenos: scénář bez přímého jmenování, nebo jediný pravdivý výrok ──
  { name: "scénář svatý Václav", test: (t) => /^Každý rok koncem září si lidé připomínají svatého Václava/.test(t.question), kmen: /^den české státnosti$/ },
  { name: "scénář Národní třída 1989", test: (t) => /^V listopadu lidé pokládají svíčky na Národní třídě/.test(t.question), kmen: /^den boje za svobodu a demokracii$/ },
  { name: "scénář rozpad Rakouska-Uherska", test: (t) => /^Lidé si připomínají chvíli, kdy se po rozpadu Rakouska-Uherska/.test(t.question), kmen: /^den vzniku samostatného československého státu$/ },
  { name: "scénář konec 2. sv. války", test: (t) => /^Lidé si připomínají chvíli, kdy po letech těžkých bojů/.test(t.question), kmen: /^den vítězství$/ },
  { name: "scénář bratři ze Soluně (L3)", test: (t) => /^Lidé si připomínají příchod dvou bratří ze Soluně/.test(t.question), kmen: /^den slovanských věrozvěstů cyrila a metoděje$/ },
  { name: "scénář kazatel Kostnice (L3)", test: (t) => /^Lidé si připomínají kazatele a reformátora/.test(t.question), kmen: /^den upálení mistra jana husa$/ },
  { name: "scénář osamostatnění ČR", test: (t) => /^Lidé si připomínají okamžik, kdy se po rozdělení/.test(t.question), kmen: /^den obnovy samostatného českého státu$/ },
  { name: "jediný pravdivý výrok — hymna", test: (t) => /^Které z těchto tvrzení o státní hymně/.test(t.question), kmen: /^oficiální hymnou čr je jen první sloka písně kde domov můj\.$/ },
  { name: "jediný pravdivý výrok — TGM", test: (t) => /^Které z těchto tvrzení o T\. G\. Masarykovi/.test(t.question), kmen: /^t\. g\. masaryk byl první prezident československa\.$/ },
  { name: "jediný pravdivý výrok — malý znak", test: (t) => /^Které z těchto tvrzení o malém státním znaku/.test(t.question), kmen: /^malý státní znak zobrazuje jen samotného českého lva\.$/ },
  { name: "jediný pravdivý výrok — vlajka", test: (t) => /^Které z těchto tvrzení o státní vlajce/.test(t.question), kmen: /^modrý klín na vlajce zasahuje od žerdi do poloviny délky listu\.$/ },
  { name: "jediný pravdivý výrok — velký znak", test: (t) => /^Které z těchto tvrzení o velkém státním znaku/.test(t.question), kmen: /^velký státní znak zobrazuje na čtvrceném štítu českého lva, moravskou orlici i slezskou orlici\.$/ },
];

function solve(t: PracticeTask): Pravidlo {
  const hit = PRAVIDLA.filter((p) => p.test(t));
  expect(hit.map((p) => p.name), `solver musí úlohu rozpoznat právě jedním pravidlem: ${t.question}`).toHaveLength(1);
  return hit[0];
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\d]+/gu, " ").trim();

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

describe("Naše vlast — státní symboly, TGM, svátky — metadata", () => {
  it("vko g6, select_one, přesné RVP zařazení", () => {
    expect(topic.id).toBe("g6-vko-statni-symboly-osobnosti-svatky-nase-vlasti-6");
    expect(topic.subject).toBe("vko");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.rvpNodeId).toBe(
      "g6-vko-clovek-ve-spolecnosti-nase-obec-region-vlast-nase-vlast-statni-symboly-vyznamne-osobnosti-svatky",
    );
    expect(topic.category).toBe("Člověk ve společnosti");
    expect(topic.topic).toBe("Naše obec, region, vlast");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });

  it("nejmenuje žádnou soudobou osobu ve funkci (jen historicky ukotvený TGM)", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        const texty = [t.question, ...(t.options ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
        for (const s of texty) {
          expect(s, `soudobá osoba ve funkci: ${s}`).not.toMatch(/současný prezident (je|jmenuje)|dnešní prezident (je|jmenuje)/i);
        }
      }
    }
  });
});

describe.each([1, 2, 3])("Naše vlast — státní symboly — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh a determinismus při stejném seedu", () => {
    expect(new Set(tasks.map(klicUlohy)).size).toBeGreaterThanOrEqual(12);
    const puvodni = Math.random;
    try {
      Math.random = seeded(42);
      const a = topic.generator(level).map((t) => [t.question, t.options]);
      Math.random = seeded(42);
      const b = topic.generator(level).map((t) => [t.question, t.options]);
      expect(b).toEqual(a);
    } finally {
      Math.random = puvodni;
    }
  });

  it("4 různé možnosti, klíč právě jednou, feedback u každého distraktoru", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer), t.question).toHaveLength(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}"`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("SOLVER: klíč souhlasí s nezávislou cestou (tabulka pojem/svátek/datum → odpověď)", () => {
    for (const t of tasks) {
      const p = solve(t);
      expect(low(t.correctAnswer), `${p.name}: ${t.question}`).toMatch(p.kmen);
    }
  });

  it("leak: klíč není ve znění otázky ani v nápovědách; nápovědy unikátní", () => {
    const videne = new Set<string>();
    for (const t of tasks) {
      expect(low(t.question), t.question).not.toContain(low(t.correctAnswer));
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(low(h), `hint leak: ${t.question}`).not.toContain(low(t.correctAnswer));
        expect(videne.has(h), `duplicitní nápověda: ${h}`).toBe(false);
        videne.add(h);
      }
    }
  });

  it("čeština: žádné lomítkové rodové tvary", () => {
    for (const t of tasks) {
      const texty = [t.question, ...t.options!, ...(t.hints ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(s, s).not.toMatch(/\p{L}\/\p{L}/u);
    }
  });
});

describe("Naše vlast — státní symboly — gradace", () => {
  it("L1 a L3 se zněním otázek nepřekrývají", () => {
    const l1 = topic.generator(1), l3 = topic.generator(3);
    const q1 = new Set(l1.map((t) => norm(t.question)));
    expect(l3.filter((t) => q1.has(norm(t.question)))).toHaveLength(0);
  });

  it("L3 obsahuje scénáře bez přímého jmenování svátku a výroky s jediným pravdivým tvrzením", () => {
    const l3 = topic.generator(3);
    const scenar = l3.filter((t) => /^(Každý rok|V listopadu|Lidé si připomínají)/.test(t.question));
    const vyrok = l3.filter((t) => /^Které z těchto tvrzení/.test(t.question));
    expect(scenar.length, "L3 musí obsahovat scénáře bez přímého jmenování svátku").toBeGreaterThanOrEqual(3);
    expect(vyrok.length, "L3 musí obsahovat úlohy s jediným pravdivým výrokem").toBeGreaterThanOrEqual(3);
  });
});
