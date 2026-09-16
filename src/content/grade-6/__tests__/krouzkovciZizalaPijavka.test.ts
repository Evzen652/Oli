import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { KROUZKOVCI_ZIZALA_PIJAVKA } from "../prirodopis/krouzkovciZizalaPijavka";
import type { PracticeTask } from "@/lib/types";

/**
 * Kroužkovci — žížala, pijavka (faktický select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, nezávislé na bankách generátoru):
 *  (1) FAKTA — živočich → znaky. Otázky „Co je to za živočicha?“ se řeší
 *      klasifikátorem klíčových slov ze ZNĚNÍ; musí vyhrát právě jeden živočich
 *      a právě jedna možnost ho jmenuje.
 *  (2) SKUPINA — kdo je a není kroužkovec (tabulka), pro otázky na zařazení.
 *  (3) CLAIMS — zbylá znění → vzor jediné správné možnosti podle tabulky faktů.
 * Ve všech případech musí vyhovět PRÁVĚ jedna možnost a ta = correctAnswer.
 */
const topic = KROUZKOVCI_ZIZALA_PIJAVKA[0];

// ── (1) FAKTA ───────────────────────────────────────────────────────────────
const FAKTA: Record<string, { jmeno: RegExp; znaky: RegExp[] }> = {
  "žížala": { jmeno: /^žížal/, znaky: [/půd/, /štětin/, /ztluštělý pás|opas/, /článk/] },
  pijavka: { jmeno: /^pijavk/, znaky: [/přísav|přisaje/, /saje krev/, /akvári|voda|rybník/, /článk/, /píďal/] },
  "nitěnka": { jmeno: /^nitěnk/, znaky: [/bahn/, /znečišt/, /červen/, /článk/] },
  "hlíst": { jmeno: /^hlíst/, znaky: [/bez článků|hladk/] },
};
const klasifikuj = (q: string): string => {
  const skore = Object.entries(FAKTA).map(([name, o]) => ({
    name,
    s: o.znaky.filter((re) => re.test(q)).length,
  }));
  skore.sort((a, b) => b.s - a.s);
  expect(skore[0].s, `klasifikátor bez znaku: ${q}`).toBeGreaterThan(0);
  expect(skore[0].s, `klasifikátor nerozhodl: ${q}`).toBeGreaterThan(skore[1].s);
  return skore[0].name;
};

// ── (2) SKUPINA ─────────────────────────────────────────────────────────────
const KROUZKOVCI = [/^žížal/, /^pijavk/, /^nitěnk/];
const jeKrouzkovec = (o: string) => KROUZKOVCI.some((re) => re.test(o));

// ── (3) CLAIMS ──────────────────────────────────────────────────────────────
const CLAIMS: [RegExp, (o: string) => boolean][] = [
  [/^Z čeho se skládá tělo/, (o) => /článk/.test(o) && !/bez článků/.test(o)],
  [/^Čím dýchá žížala/, (o) => /povrch/.test(o)],
  [/^Kde žije pijavka/, (o) => /sladk/.test(o)],
  [/přichytí k podkladu/, (o) => /přísav/.test(o)],
  [/^Čím se živí žížala/, (o) => /odumřel/.test(o)],
  [/opasek žížaly/, (o) => /kokon/.test(o)],
  [/^Mezi které živočichy patří žížala/, (o) => /kroužkov/.test(o)],
  [/^Kde má pijavka přísavky/, (o) => /předním a zadním/.test(o)],
  [/kůže srostlá se svaly/, (o) => /vak/.test(o)],
  [/nervovou soustavu/, (o) => /žebříčk/.test(o)],
  [/výrůstky na článcích/, (o) => /štětin/.test(o)],
  [/pohlavní orgány/, (o) => /samčí i samičí/.test(o)],
  [/^Kde žije nitěnka/, (o) => /znečišt/.test(o)],
  [/^Čím se živí pijavka/, (o) => /krv/.test(o)],
  [/pohybuje v půdě/, (o) => /sval/.test(o)],
  [/přikládat nemocným/, (o) => /^pijavk/.test(o)],
  [/po vydatném dešti/, (o) => /vzduch/.test(o) && !/plíc/.test(o)],
  [/ranka .*dlouho krvácí/, (o) => /srážení/.test(o)],
  [/vlhkou kůži/, (o) => /povrch/.test(o)],
  [/pro půdu na zahradě/, (o) => /humus/.test(o)],
  [/zařadíš mezi kroužkovce/, jeKrouzkovec],
  [/mezi kroužkovce nepatří/, (o) => !jeKrouzkovec(o)],
  [/lékaři pijavky/, (o) => /sraženin/.test(o)],
  [/v kompostu/, (o) => /humus/.test(o)],
  [/suchém chodníku/, (o) => /vyschne/.test(o)],
  [/když se nasaje krve/, (o) => /odpadne/.test(o)],
  [/šetrně odstranit/, (o) => /nehet/.test(o)],
  [/nepatří mezi hady/, (o) => /kostr/.test(o)],
  [/nepatří mezi hmyz/, (o) => /nohy/.test(o) && /tří částí/.test(o)],
  [/mají žížala a pijavka společného/, (o) => /článk/.test(o)],
  [/pijavka liší od žížaly/, (o) => /přísavky/.test(o) && /nemá štětinky/.test(o)],
  [/jílovité půdě/, (o) => /vzduch/.test(o) && /voda/.test(o)],
  [/hlavně v noci/, (o) => /vlhk/.test(o) && /nevyschne/.test(o)],
  [/vysoušení tůní/, (o) => /vodní prostředí/.test(o)],
  [/šustění/, (o) => /štětin/.test(o)],
  [/prozrazuje o vodě/, (o) => /znečišt/.test(o)],
  [/hlíst a žížala/, (o) => /^žížala .*článk/.test(o)],
  [/kyprou půdu/, (o) => /nechat/.test(o) && /žížal/.test(o)],
  [/vylučovat sliz/, (o) => /vyschl/.test(o) && /udusil/.test(o)],
  [/Který znak rozhodne/, (o) => /článk/.test(o) && /bez článkovaných nohou/.test(o)],
  [/nepotřebuje štětinky/, (o) => /přísav/.test(o)],
  [/Kos chytil/, (o) => /štětin/.test(o)],
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };

  if (/Co je to za živočicha\?$/.test(q)) {
    const jmeno = klasifikuj(q);
    return one("klasifikátor", opts.filter((x) => FAKTA[jmeno].jmeno.test(x)));
  }
  const cl = CLAIMS.filter(([re]) => re.test(q));
  expect(cl.length, `CLAIMS pro "${q}"`).toBe(1);
  return one("tvrzení", opts.filter(cl[0][1]));
}

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

describe("Kroužkovci — metadata", () => {
  it("přírodopis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.id).toBe("g6-pri-krouzkovci-zizala-pijavka-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.title).toBe("Kroužkovci - žížala, pijavka");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Kroužkovci — level %i", (level) => {
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

  it("bezpečnost: klíč nedoporučuje pijavku strhávat ani solit", () => {
    for (const t of tasks) {
      expect(/strhnout|sůl|soli\b/i.test(t.correctAnswer), t.question).toBe(false);
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
    let sumKey = 0;
    let sumDis = 0;
    for (const t of tasks) {
      const podleDelky = [...t.options!].sort((a, b) => b.length - a.length);
      if (podleDelky[0] === t.correctAnswer && podleDelky[0].length >= 1.25 * podleDelky[1].length) nejdelsi++;
      const dis = t.options!.filter((o) => o !== t.correctAnswer);
      sumKey += t.correctAnswer.length;
      sumDis += dis.reduce((s, o) => s + o.length, 0) / dis.length;
      const jine = dis.map(prvni);
      const vycniva = jine[0].length >= 3 && new Set(jine).size === 1 && jine[0] !== prvni(t.correctAnswer);
      expect(vycniva, `klíč vyčnívá prvním slovem: ${t.question}`).toBe(false);
    }
    expect(nejdelsi, "klíč je výrazně nejdelší příliš často").toBeLessThanOrEqual(2);
    expect(sumKey / tasks.length).toBeLessThanOrEqual((sumDis / tasks.length) * 1.3);
  });

  it("determinismus: dvě volání dají stejnou banku otázek", () => {
    const a = new Set(topic.generator(level).map((t) => `${t.question}|${t.correctAnswer}`));
    const b = new Set(topic.generator(level).map((t) => `${t.question}|${t.correctAnswer}`));
    expect([...a].sort()).toEqual([...b].sort());
  });
});

describe("Kroužkovci — gradace", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L1 = přímé otázky bez popisu situace", () => {
    for (const t of topic.generator(1)) {
      expect(/Co je to za živočicha|^Proč|Co by se stalo/.test(t.question), t.question).toBe(false);
    }
  });

  it("mýtus o rozpůlené žížale nikdy není klíčem", () => {
    for (const l of [1, 2, 3]) {
      for (const t of topic.generator(l)) {
        expect(/rozpůl/.test(t.correctAnswer), t.question).toBe(false);
      }
    }
  });
});
