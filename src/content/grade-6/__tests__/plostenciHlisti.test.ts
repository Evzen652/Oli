import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PLOSTENCI_HLISTI } from "../prirodopis/plostenciHlisti";
import type { PracticeTask } from "@/lib/types";

/**
 * Ploštěnci a hlísti (faktický select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, nezávislé na bankách generátoru):
 *  (1) KLASIFIKÁTOR klíčových slov čte JEN znění otázky a určí organismus
 *      nebo skupinu. Možnosti se na organismy mapují přes kmeny jmen.
 *  (2) TABULKA organismus → {skupina, místo v těle, cesta nákazy, prevence,
 *      mezihostitel}. U otázek na konkrétního cizopasníka musí klíč odpovídat
 *      řádku a žádný distraktor ne.
 *  (3) CLAIMS — zbylá znění → vzor jediné správné možnosti.
 * Ve všech případech musí vyhovět PRÁVĚ jedna možnost a ta = correctAnswer.
 */
const topic = PLOSTENCI_HLISTI[0];

type Org = "ploštěnka" | "motolice" | "tasemnice" | "škrkavka" | "roup" | "žížala" | "pijavka";
type Skupina = "ploštěnci" | "hlísti" | "kroužkovci";

// ── (2) TABULKA ─────────────────────────────────────────────────────────────
const TAB: Record<Org, {
  kmen: RegExp;
  skupina: Skupina;
  misto?: RegExp;
  nakaza?: RegExp;
  prevence?: RegExp;
  mezihostitel?: RegExp;
}> = {
  "ploštěnka": { kmen: /^(o )?ploštěnk/, skupina: "ploštěnci" },
  motolice: { kmen: /^(o )?motolic/, skupina: "ploštěnci", misto: /játr|jatern/, prevence: /odvodn/, mezihostitel: /plž/ },
  tasemnice: { kmen: /^(o )?tasemnic/, skupina: "ploštěnci", misto: /střev/, nakaza: /mas[oa]/, prevence: /mas[oa].*(propéct|provařit)/ },
  "škrkavka": { kmen: /^(o )?škrkavk/, skupina: "hlísti", misto: /tenkém střev/, nakaza: /zelenin/, prevence: /mýt ruce a zeleninu/ },
  roup: { kmen: /^(o )?roup/, skupina: "hlísti", misto: /tlustém střev/, nakaza: /špinavých rukou/ },
  "žížala": { kmen: /^(o )?žížal/, skupina: "kroužkovci" },
  pijavka: { kmen: /^(o )?pijavk/, skupina: "kroužkovci" },
};
const orgZMoznosti = (o: string): Org | null =>
  (Object.keys(TAB) as Org[]).find((k) => TAB[k].kmen.test(o)) ?? null;
const orgZeZneni = (s: string): Org => {
  const m: [RegExp, Org][] = [
    [/škrkavk/, "škrkavka"], [/tasemnic/, "tasemnice"], [/motolic/, "motolice"], [/roup/, "roup"],
  ];
  const hit = m.filter(([re]) => re.test(s));
  expect(hit, `jmenovaný cizopasník v "${s}"`).toHaveLength(1);
  return hit[0][1];
};

// ── (1) KLASIFIKÁTOR ────────────────────────────────────────────────────────
const ZNAKY: Record<string, RegExp[]> = {
  tasemnice: [/článk/, /bez trávicí/, /larv/],
  motolice: [/játr/, /podmáčen/, /bez článků/],
  "ploštěnka": [/potoc/, /pod kamen/, /loví/],
  roup: [/svěd/, /řitního otvoru/, /tlust/, /vajíčka ven/],
  "škrkavka": [/zelenin/, /tenkém/, /20 cm/],
};
function klasifikuj(q: string): Org {
  const skore = Object.entries(ZNAKY).map(([name, res]) => ({
    name: name as Org,
    s: res.filter((re) => re.test(q)).length,
  }));
  skore.sort((a, b) => b.s - a.s);
  expect(skore[0].s, `klasifikátor bez znaku: ${q}`).toBeGreaterThan(0);
  expect(skore[0].s, `klasifikátor nerozhodl: ${q}`).toBeGreaterThan(skore[1].s);
  return skore[0].name;
}
function skupinaZeZneni(q: string): Skupina {
  if (/oblé/.test(q) && /nečlánkovan/.test(q)) return "hlísti";
  if (/ploch/.test(q)) return "ploštěnci";
  throw new Error(`skupinu nelze určit: ${q}`);
}
const skupinaZMoznosti = (o: string): Skupina | null =>
  /hlíst/.test(o) ? "hlísti" : /ploštěnc/.test(o) ? "ploštěnci" : /kroužkov/.test(o) ? "kroužkovci" : null;

// ── (3) CLAIMS ──────────────────────────────────────────────────────────────
const CLAIMS: [RegExp, (o: string) => boolean][] = [
  [/^Jaké tělo mají hlísti/, (o) => /^oblé/.test(o) && /nečlánk/.test(o)],
  [/^Čím se tasemnice drží/, (o) => /přísavk/.test(o) && /háčk/.test(o)],
  [/tasemnici chybí/, (o) => /trávicí/.test(o)],
  [/samičky roupa vajíčka/, (o) => /řitního/.test(o)],
  [/rozmnožování ploštěnců/, (o) => /obojetn/.test(o)],
  [/kryto tělo hlístů/, (o) => /kutikul/.test(o)],
  [/živí ploštěnka/, (o) => /živočich/.test(o)],
  [/nemá trávicí soustavu\. Jak tedy/, (o) => /povrchem/.test(o)],
  [/roupi snadno přenášejí/, (o) => /škrábe/.test(o) && /rukama/.test(o)],
  [/nejdřív vyvíjejí larvy\?$/, (o) => /plž/.test(o)],
  [/stříhat nehty/, (o) => /vajíčka/.test(o)],
  [/liší tělo škrkavky od těla tasemnice/, (o) => /škrkavka je oblá/.test(o) && /tasemnice plochá/.test(o)],
  [/stále prodlužovat/, (o) => /hlavičkou/.test(o) && /nové články/.test(o)],
  [/odcházejí se stolicí/, (o) => /vajíč/.test(o)],
  [/liší od tasemnice v tom, jak přijímá potravu/,(o) => /^polyká/.test(o)],
  [/pastvina odvodní/, (o) => /plž/.test(o)],
  [/rozpůlil ploštěnku/, (o) => /regener/.test(o)],
  [/opakované nákaze/, (o) => /celé rodiny/.test(o) && /mytí rukou/.test(o) && /nehty/.test(o)],
  [/měchýřky s larvami/, (o) => /tasemnic/.test(o)],
  [/trávicí soustavu má jen ploštěnka/, (o) => /natráven/.test(o)],
  [/příbuzná žížaly/, (o) => /tasemnice je plochá/.test(o)],
  [/Za měsíc je má znovu/, (o) => /sourozen/.test(o)],
  [/nemá oči ani trávicí soustavu/, (o) => /hostitel/.test(o) && /množí/.test(o)],
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };

  // (2a) patří mezi skupinu
  const mSk = q.match(/patří mezi (ploštěnce|hlísty)\?$/);
  if (mSk) {
    const sk: Skupina = mSk[1] === "hlísty" ? "hlísti" : "ploštěnci";
    return one("skupina", opts.filter((o) => { const g = orgZMoznosti(o); return g !== null && TAB[g].skupina === sk; }));
  }
  // (2b) místo v těle jmenovaného cizopasníka
  if (/^Kde v těle člověka/.test(q)) {
    const row = TAB[orgZeZneni(q)];
    return one("místo", opts.filter((o) => row.misto!.test(o)));
  }
  // (2c) cesta nákazy jmenovaného cizopasníka
  if (/nakazí (škrkavkou|tasemnicí|roupy)\?$/.test(q)) {
    const row = TAB[orgZeZneni(q.replace(/^.*nakazí/, ""))];
    return one("nákaza", opts.filter((o) => row.nakaza!.test(o)));
  }
  // (2d) prevence
  if (/^Které opatření chrání/.test(q)) {
    const row = TAB[orgZeZneni(q)];
    return one("prevence", opts.filter((o) => row.prevence!.test(o)));
  }
  // (2e) mezihostitel
  if (/mezihostitelem/.test(q)) {
    const row = TAB[orgZeZneni(q)];
    return one("mezihostitel", opts.filter((o) => row.mezihostitel!.test(o)));
  }
  // (1a) zařazení do skupiny z popisu
  if (/Kam ho zařadíš\?$/.test(q)) {
    const sk = skupinaZeZneni(q);
    return one("skupina z popisu", opts.filter((o) => skupinaZMoznosti(o) === sk));
  }
  // (1b) organismus z popisu / z jednoho znaku
  if (/O koho jde\?$|^Který (cizopasník|živočich žije|ploštěnec|hlíst)|Kterého cizopasníka|nejpravděpodobnější\?$/.test(q)) {
    const org = klasifikuj(q);
    let hit = opts.filter((o) => orgZMoznosti(o) === org);
    if (/^Který hlíst/.test(q)) hit = hit.filter((o) => TAB[orgZMoznosti(o)!].skupina === "hlísti");
    return one("klasifikátor", hit);
  }
  // (3) tvrzení
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

describe("Ploštěnci a hlísti — metadata", () => {
  it("přírodopis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.id).toBe("g6-pri-plostenci-hlisti-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.category).toBe("Biologie živočichů");
    expect(topic.topic).toBe("Bezobratlí - žahavci, ploštěnci, hlísti");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Ploštěnci a hlísti — level %i", (level) => {
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

  it("bezpečnost a fakta: bez antibiotik v klíči, ploštěnka není cizopasník, kroužkovci nejsou klíč", () => {
    for (const t of tasks) {
      expect(/antibiotik/i.test(t.correctAnswer), t.question).toBe(false);
      expect(/ploštěnk/i.test(t.correctAnswer) && /cizopas/i.test(t.correctAnswer), t.question).toBe(false);
      expect(/^(o )?(žížal|pijavk)/i.test(t.correctAnswer), t.question).toBe(false);
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
    let poradi = 0;
    for (const t of tasks) {
      const podleDelky = [...t.options!].sort((a, b) => b.length - a.length);
      if (podleDelky[0] === t.correctAnswer && podleDelky[0].length >= 1.25 * podleDelky[1].length) nejdelsi++;
      poradi += podleDelky.indexOf(t.correctAnswer);
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      const vycniva = jine[0].length >= 3 && new Set(jine).size === 1 && jine[0] !== prvni(t.correctAnswer);
      expect(vycniva, `klíč vyčnívá prvním slovem: ${t.question}`).toBe(false);
    }
    expect(nejdelsi, "klíč je výrazně nejdelší příliš často").toBeLessThanOrEqual(2);
    // průměrná pozice klíče v pořadí podle délky (0 = nejdelší) nesmí být u nuly
    expect(poradi / tasks.length, "klíč je systematicky nejdelší").toBeGreaterThan(0.6);
  });

  it("determinismus: dvě volání dají stejnou banku otázek", () => {
    const a = new Set(topic.generator(level).map((t) => `${t.question}|${t.correctAnswer}`));
    const b = new Set(topic.generator(level).map((t) => `${t.question}|${t.correctAnswer}`));
    expect([...a].sort()).toEqual([...b].sort());
  });
});

describe("Ploštěnci a hlísti — gradace", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L1 = přímé otázky Který/Kde/Jaký/Čím, bez popisu situace", () => {
    for (const t of topic.generator(1)) {
      expect(/^(Kter|Kde|Jak[éý]|Čím)/.test(t.question), t.question).toBe(true);
      expect(t.question.split(". ").length, t.question).toBe(1);
    }
  });

  it("L3 = popis nebo situace, nikdy jen název", () => {
    for (const t of topic.generator(3)) {
      expect(t.question.length, t.question).toBeGreaterThanOrEqual(60);
    }
  });
});
