import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { KORYSI_TOPICS } from "../prirodopis/korysi";
import type { PracticeTask } from "@/lib/types";

/**
 * Korýši — rak, krab, dafnie, stínka (faktický select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, nezávislé na bankách generátoru):
 *  (1) KLASIFIKÁTOR ZNAKŮ — ze ZNĚNÍ popisu živočicha spočítá body pro skupiny
 *      (tykadla, nohy, dýchání, ulita…) a určí skupinu; možnost se pozná podle
 *      názvu skupiny, který v ní stojí nejdřív.
 *  (2) RANK-TABULKA ZÁSTUPCŮ — zástupce → skupina. U „Který z nich je korýš?“
 *      musí být korýš právě jedna možnost, u „Který mezi ně nepatří?“ právě jedna ne-korýš.
 *  (3) POČÍTÁNÍ — ze znění vyparsuje páry (slovem) a počet zvířat, klíč = zvířata × páry × 2.
 *  (4) CLAIMS — zbylá znění → vzor jediné správné možnosti.
 * Ve všech případech musí vyhovět PRÁVĚ jedna možnost a ta = correctAnswer.
 */
const topic = KORYSI_TOPICS[0];

type Skupina = "korýš" | "hmyz" | "pavoukovec" | "měkkýš" | "jiné";

// ── (2) RANK-TABULKA ────────────────────────────────────────────────────────
const ZASTUPCI: [RegExp, Skupina][] = [
  [/^(rak|krab|dafnie|stínka|humr|kreveta|blešivec|buchanka)(?=\s|$)/, "korýš"],
  [/^(mravenec|včela|beruška|potápník|larva komára|larva chrostíka)(?=\s|$)/, "hmyz"],
  [/^(pavouk křižák|křižák|klíště|štír|vodouch)(?=\s|$)/, "pavoukovec"],
  [/^(hlemýžď|škeble|plovatka|slávka|sépie)(?=\s|$)/, "měkkýš"],
  [/^(nezmar|medúza|trepka|pijavka)(?=\s|$)/, "jiné"],
];
const zastupce = (o: string): Skupina => {
  const hit = ZASTUPCI.find(([re]) => re.test(o));
  expect(hit, `neznámý zástupce: ${o}`).toBeDefined();
  return hit![1];
};
const MORSKI = new Set(["krab", "humr", "kreveta", "sépie", "slávka", "medúza"]);

// ── (1) KLASIFIKÁTOR ────────────────────────────────────────────────────────
const ZNAKY: Record<Exclude<Skupina, "jiné">, RegExp[]> = {
  "korýš": [/dv(a|ěma|ou) pár\S*( \S+)? tykad|tykad\S* ve dvou párech/, /žábr/, /deset\b.*noh/, /pět\S* pár\S* (kráčivých )?noh/],
  hmyz: [/jed(en|ním) pár\S* tykad/, /tři páry noh/, /křídl/, /vzdušnic/, /hlavu, hruď a zadeček/],
  pavoukovec: [/čtyři páry noh/, /bez tykadel|žádná tykadla/],
  "měkkýš": [/ulit/, /svalnat\S* noh/, /nečlánkovan/],
};
const klasifikuj = (q: string): Skupina => {
  const t = q.toLowerCase();
  const skore = Object.entries(ZNAKY).map(([name, res]) => ({
    name: name as Skupina,
    s: res.filter((re) => re.test(t)).length,
  }));
  skore.sort((a, b) => b.s - a.s);
  expect(skore[0].s, `klasifikátor bez znaku: ${q}`).toBeGreaterThan(0);
  expect(skore[0].s, `klasifikátor nerozhodl: ${q}`).toBeGreaterThan(skore[1].s);
  return skore[0].name;
};
const NAZEV: [RegExp, Skupina | "prvok" | "ryba"][] = [
  [/korýš/, "korýš"],
  [/hmyz/, "hmyz"],
  [/pavoukov/, "pavoukovec"],
  [/měkkýš/, "měkkýš"],
  [/prvok/, "prvok"],
  [/ryb/, "ryba"],
];
const skupinaMoznosti = (o: string) => {
  let best: { i: number; g: string } | null = null;
  for (const [re, g] of NAZEV) {
    const m = re.exec(o);
    if (m && (!best || m.index < best.i)) best = { i: m.index, g };
  }
  return best?.g ?? "";
};

// ── (3) POČÍTÁNÍ ────────────────────────────────────────────────────────────
const CISLA: Record<string, number> = { jeden: 1, dva: 2, "dvě": 2, "tři": 3, "čtyři": 4, "pět": 5, "pěti": 5 };

// ── (4) CLAIMS ──────────────────────────────────────────────────────────────
const CLAIMS: [RegExp, (o: string) => boolean][] = [
  [/^Čím dýchá/, (o) => /^žábr/.test(o)],
  [/^Z jakých částí/, (o) => /hlavohrud/.test(o)],
  [/^Kolik párů tykadel/, (o) => /^dva/.test(o)],
  [/^Co kryje tělo/, (o) => /krunýř/.test(o)],
  [/první pár nohou raka/, (o) => /klepet/.test(o)],
  [/^Kde žije krab/, (o) => /moř/.test(o)],
  [/korýš, který žije na souši/, (o) => o === "stínka"],
  [/^Kde žije rak/, (o) => /sladk/.test(o) && /čist/.test(o)],
  [/krmivo pro akvarijní/, (o) => /^dafni/.test(o)],
  [/najdeš v přírodě stínku/, (o) => /vlhk/.test(o)],
  [/skupiny živočichů patří stínka/, (o) => skupinaMoznosti(o) === zastupce("stínka")],
  [/mořský korýš, který má zadeček podvinutý/, (o) => MORSKI.has(o) && zastupce(o) === "korýš"],
  [/nosí samice/, (o) => /zadeč/.test(o)],
  [/nejaktivnější/, (o) => /noci/.test(o)],
  [/^Čím se živí dafnie/, (o) => /řas/.test(o)],
  [/^Čím se živí stínka/, (o) => /odumřel/.test(o)],
  [/krab liší od raka/, (o) => /podvinut/.test(o)],
  [/stínka liší od raka/, (o) => /souši/.test(o)],
  [/dafnie liší od raka/, (o) => /vznáší/.test(o)],
  [/rak, krab a stínka společného/, (o) => /žábr/.test(o)],
  [/sledují, zda v potoce/, (o) => /čist/.test(o) && !/špinav|odpadní/.test(o)],
  [/v Česku chráněný/, (o) => /račí/.test(o)],
  [/požírá dafnie/, (o) => o === "ryby"],
  [/užitečná na zahradě/, (o) => /rozklád/.test(o)],
  [/svléká krunýř/, (o) => /neroste/.test(o)],
  [/stínka žije jen na vlhkých/, (o) => /žábr/.test(o)],
  [/přišel o obě klepeta/, (o) => /bránit/.test(o)],
  [/důležitá tykadla/, (o) => /hmatá a čichá/.test(o)],
  [/skrývá v úkrytu/, (o) => /měkk/.test(o)],
  [/dafnie žije v rybnících/, (o) => /proud by ji odnesl/.test(o)],
  [/pod továrnou/, (o) => /znečist/.test(o)],
  [/uhynuly skoro všechny dafnie/, (o) => /chybět potrava/.test(o)],
  [/porovnání znaků stínky a hmyzu/, (o) => /je korýš/.test(o)],
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };

  // (3) počítání nohou / tykadel
  if (/Kolik (?!párů).*(nohou|tykadel)/.test(q)) {
    const mp = q.match(/(\S+) (?:párů|páry) (kráčivých nohou|tykadel)/);
    expect(mp, q).not.toBeNull();
    const paru = CISLA[mp![1]];
    expect(paru, `počet párů: ${q}`).toBeDefined();
    const mz = q.match(/(?<=\s|^)(dva|tři|čtyři) (?:rac|rak|krab)/);
    const zvirat = mz ? CISLA[mz[1]] : 1;
    const cil = zvirat * paru * 2;
    const hit = opts.filter((o) => parseInt(o, 10) === cil);
    const v = one("počítání", hit);
    if (/nohou/.test(mp![2])) {
      const d = opts.filter((o) => o !== v.expected).map((o) => parseInt(o, 10));
      expect(d, `distraktor jako hmyz: ${q}`).toContain(zvirat * 6);
      expect(d, `distraktor jako pavoukovec: ${q}`).toContain(zvirat * 8);
      expect(d).not.toContain(cil);
    }
    return v;
  }
  // (2) zástupce
  if (/Který z nich je korýš\?$/.test(q)) {
    return one("zástupce", opts.filter((o) => zastupce(o) === "korýš"));
  }
  if (/Který mezi ně nepatří\?$/.test(q)) {
    return one("vetřelec", opts.filter((o) => zastupce(o) !== "korýš"));
  }
  // (1) popis znaků
  if (/Kam ho zařadíš\?$|Který závěr plyne z jeho znaků\?$|Kam ji zařadíš a proč\?$/.test(q)) {
    const g = klasifikuj(q);
    return one("klasifikátor", opts.filter((o) => skupinaMoznosti(o) === g));
  }
  // (4) tvrzení
  const cl = CLAIMS.filter(([re]) => re.test(q));
  expect(cl.length, `CLAIMS pro "${q}"`).toBe(1);
  return one("tvrzení", opts.filter(cl[0][1]));
}

// (5) FAKTA — klíč nesmí tvrdit negaci ověřeného faktu.
const NEGOVANE_FAKTY: RegExp[] = [
  /plícemi/, // korýši dýchají žábrami
  /vzdušnicemi/,
  /^jeden pár$|jeden pár tykadel/, // korýši mají dva páry tykadel
  /^ani jeden pár$/,
  /rak.*(moř|slan)/, // rak = sladká voda
];

const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
const SKUPINOVY_KLIC = /^(?:mezi |je to |do skupiny )?(korýš|hmyz|pavoukov|měkkýš)/;

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

describe("Korýši — metadata", () => {
  it("přírodopis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.id).toBe("g6-pri-korysi-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Korýši — level %i", (level) => {
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
    }
  });

  it("fakta: žádný klíč netvrdí negaci ověřeného faktu", () => {
    for (const t of tasks) {
      for (const re of NEGOVANE_FAKTY) expect(re.test(t.correctAnswer), `${t.correctAnswer} (${t.question})`).toBe(false);
    }
  });

  it("klíč není ve znění ani v nápovědách; nápovědy unikátní a různé", () => {
    const h0 = new Set<string>();
    const h1 = new Set<string>();
    for (const t of tasks) {
      const key = t.correctAnswer.toLowerCase();
      expect(t.question.toLowerCase().includes(key), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints!.length).toBe(2);
      const g = key.match(SKUPINOVY_KLIC);
      for (const h of t.hints!) {
        expect(h.toLowerCase().includes(key), `hint leak: ${h}`).toBe(false);
        if (g) expect(h.toLowerCase().includes(g[1]), `nápověda jmenuje skupinu: ${h}`).toBe(false);
      }
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

  it("determinismus: dvě volání dají stejnou banku otázek", () => {
    const a = new Set(topic.generator(level).map((t) => `${t.question}|${t.correctAnswer}`));
    const b = new Set(topic.generator(level).map((t) => `${t.question}|${t.correctAnswer}`));
    expect([...a].sort()).toEqual([...b].sort());
  });
});

describe("Korýši — gradace", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L3 = popis neznámého živočicha, vysvětli proč, nebo závěr", () => {
    for (const t of topic.generator(3)) {
      expect(/^(Přírodovědec popsal|Vysvětli, proč|Který závěr plyne)/.test(t.question), t.question).toBe(true);
    }
  });

  it("L1 = přímé otázky, bez popisu případu", () => {
    for (const t of topic.generator(1)) {
      expect(/^(Přírodovědec|Vysvětli|Který závěr)/.test(t.question), t.question).toBe(false);
    }
  });

  it("L3 klasifikace střídá klíč (ne vždy korýš)", () => {
    const skupiny = new Set(
      topic.generator(3).filter((t) => /Kam ho zařadíš\?$/.test(t.question)).map((t) => t.correctAnswer),
    );
    expect(skupiny.size).toBeGreaterThanOrEqual(3);
  });
});
