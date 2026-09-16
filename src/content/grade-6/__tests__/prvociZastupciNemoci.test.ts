import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PRVOCI_ZASTUPCI_NEMOCI } from "../prirodopis/prvociZastupciNemoci";
import type { PracticeTask } from "@/lib/types";

/**
 * Prvoci — zástupci a nemoci (faktický select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, nezávislé na bankách generátoru):
 *  (1) ORG — organismus → pohybový útvar a rozlišovací znaky (tvar, barvivo,
 *      výživa, prostředí). Otázky „O kterého prvoka jde?“ se řeší klasifikátorem
 *      klíčových slov ze ZNĚNÍ; otázky na pohyb přes tabulku pohybu.
 *  (2) NEMOC — nemoc → přenašeč. Ze znění se vytáhne přenašeč a určí nemoc
 *      (nebo naopak).
 *  (3) CLAIMS — zbylá znění → vzor jediné správné možnosti.
 * Ve všech případech musí vyhovět PRÁVĚ jedna možnost a ta = correctAnswer.
 */
const topic = PRVOCI_ZASTUPCI_NEMOCI[0];

// ── (1) ORG ─────────────────────────────────────────────────────────────────
interface Org { pohyb: RegExp; znaky: RegExp[] }
const ORG: Record<string, Org> = {
  trepka: { pohyb: /brv/, znaky: [/střevíč/, /vlákn/, /nálev/, /buněčn\S* úst/, /prohlub/, /vakuol/] },
  "měňavka": { pohyb: /panož/, znaky: [/mění tvar/, /bez stálého tvaru/, /přelévá/, /výběžk/] },
  "krásnoočko": { pohyb: /bičík/, znaky: [/zelen/i, /chloroplast/, /světl/, /skvrn/] },
};
const klasifikuj = (q: string): string => {
  const skore = Object.entries(ORG).map(([name, o]) => ({
    name,
    s: [o.pohyb, ...o.znaky].filter((re) => re.test(q)).length,
  }));
  skore.sort((a, b) => b.s - a.s);
  expect(skore[0].s, `klasifikátor bez znaku: ${q}`).toBeGreaterThan(0);
  expect(skore[0].s, `klasifikátor nerozhodl: ${q}`).toBeGreaterThan(skore[1].s);
  return skore[0].name;
};

// ── (2) NEMOC ───────────────────────────────────────────────────────────────
const NEMOC: { nemoc: RegExp; vektor: RegExp; odpoved: RegExp }[] = [
  { nemoc: /malári/, vektor: /komá[rř]|anofel/, odpoved: /^(na )?malári/ },
  { nemoc: /spav/, vektor: /tse-tse/, odpoved: /^(na )?spav/ },
];

// ── (3) CLAIMS ──────────────────────────────────────────────────────────────
const CLAIMS: [RegExp, (o: string) => boolean][] = [
  [/^Z kolika buněk/, (o) => /jedin/.test(o)],
  [/^Kde žije trepka/, (o) => /tůn/.test(o)],
  [/^Čím dýchá/, (o) => /povrch/.test(o)],
  [/vyvrhuje .*přebytečnou vodu/, (o) => /stažiteln/.test(o)],
  [/kterým trepka přijímá potravu/, (o) => /úst/.test(o)],
  [/ukazuje, kam má plavat/, (o) => /světločiv/.test(o)],
  [/prvok způsobuje malárii/, (o) => /zimničk/.test(o)],
  [/moucha tse-tse\?$/, (o) => /trypanozom/.test(o)],
  [/tráví přijatou potravu/, (o) => /potravní/.test(o)],
  [/pravidelně zvětšuje/, (o) => /vod/.test(o)],
  [/bydlí zdravý člověk/, (o) => /komár/.test(o)],
  [/bodla velká moucha/, (o) => /^spav/.test(o)],
  [/oblastech světa se šíří malárie/, (o) => /tropick/.test(o)],
  [/nakaženého malárií/, (o) => /červené krvinky/.test(o)],
  [/neobejde bez vody/, (o) => /vyschl/.test(o)],
  [/rozmnožuje/, (o) => /^dělením/.test(o)],
  [/liší výživa krásnoočka od výživy měňavky/, (o) => /^krásnoočko .*vyrob/.test(o)],
  [/skupiny organismů patří původci/, (o) => /prvok/.test(o)],
  [/bičíkem a nemá zelené barvivo/, (o) => /hotovou/.test(o)],
  [/brvy přestanou kmitat/, (o) => /přestane plavat/.test(o)],
  [/nepotřebuje stálý tvar/, (o) => /potrav/.test(o)],
  [/^Rodina jede do tropické/, (o) => /moskyti/.test(o) && /repelent/.test(o)],
  [/nepomůže převařit/, (o) => /bodnutím komára/.test(o)],
  [/mají trepka, měňavka i krásnoočko společnou/, (o) => /jediná buňka/.test(o)],
  [/do tmy/, (o) => /přežije/.test(o)],
  [/spavá nemoc nehrozí/, (o) => /tse-tse/.test(o) && /nežije/.test(o)],
  [/ničící červené krvinky/, (o) => /malárií/.test(o) && /komár/.test(o)],
  [/^Proč krásnoočko plave ke světlu/, (o) => /vyrábí potravu/.test(o)],
  [/vakuoly přestanou fungovat/, (o) => /přeplní/.test(o)],
  [/jedinou buňku s jádrem a pohybuje se panožkami/, (o) => /prvok/.test(o) && /měňav/.test(o)],
  [/prvokovi, který má chloroplasty/, (o) => /vyrobit potravu/.test(o)],
  [/moskytiéra na spaní/, (o) => /komá[rř]/.test(o)],
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };

  // (1a) čím se pohybuje X
  const m1 = q.match(/^(?:Kterým útvarem|Čím) se pohybuje (\S+)\?$/);
  if (m1) {
    const o = ORG[m1[1]];
    expect(o, q).toBeDefined();
    return one("pohyb", opts.filter((x) => o.pohyb.test(x)));
  }
  // (1b) který prvok se pohybuje Y
  const m2 = q.match(/^Který prvok se pohybuje (\S+)\?$/);
  if (m2) {
    const jmena = Object.entries(ORG).filter(([, o]) => o.pohyb.test(m2[1])).map(([n]) => n);
    expect(jmena, q).toHaveLength(1);
    return one("zástupce podle pohybu", opts.filter((x) => x === jmena[0]));
  }
  // (1c) popis znaků → zástupce
  if (/O kterého prvoka jde\?$|^Který prvok má /.test(q)) {
    const jmeno = klasifikuj(q);
    return one("klasifikátor", opts.filter((x) => x === jmeno));
  }
  // (2a) přenašeč → nemoc
  if (/(Kterou|kterou) nemoc/.test(q) && /komá[rř]|anofel|tse-tse/.test(q)) {
    const n = NEMOC.filter((x) => x.vektor.test(q));
    expect(n, q).toHaveLength(1);
    return one("nemoc podle přenašeče", opts.filter((x) => n[0].odpoved.test(x)));
  }
  // (2b) nemoc → přenašeč
  if (/přenáší spavou nemoc\?$/.test(q)) {
    return one("přenašeč", opts.filter((x) => NEMOC[1].vektor.test(x)));
  }
  // (2c) cesta nákazy
  const m3 = q.match(/nakazí (malárií|spavou nemocí)\?$/);
  if (m3) {
    const n = NEMOC.find((x) => x.nemoc.test(m3[1]))!;
    return one("cesta nákazy", opts.filter((x) => /^bodnutím/.test(x) && n.vektor.test(x)));
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

describe("Prvoci — metadata", () => {
  it("přírodopis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.id).toBe("g6-pri-prvoci-zastupci-nemoci-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Prvoci — level %i", (level) => {
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

  it("bezpečnost: klíč ani vysvětlení nedoporučují antibiotika", () => {
    for (const t of tasks) {
      expect(/antibiotik/i.test(t.correctAnswer), t.question).toBe(false);
      expect(/antibiotik/i.test(t.explanation ?? ""), t.question).toBe(false);
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

  it("determinismus: dvě volání dají stejnou banku otázek", () => {
    const a = new Set(topic.generator(level).map((t) => `${t.question}|${t.correctAnswer}`));
    const b = new Set(topic.generator(level).map((t) => `${t.question}|${t.correctAnswer}`));
    expect([...a].sort()).toEqual([...b].sort());
  });
});

describe("Prvoci — gradace", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L3 = neznámý případ, proč, co lze usoudit či očekávat, prevence", () => {
    for (const t of topic.generator(3)) {
      expect(/^(V kapce|V krvi|Proč|Rodina|Kterou vlastnost|Krásnoočko dáme|Co lze usoudit|Co lze očekávat)/.test(t.question), t.question).toBe(true);
    }
  });

  it("L1 = přímé otázky, bez popisu situace", () => {
    for (const t of topic.generator(1)) {
      expect(/O kterého prvoka jde|^Proč|lze usoudit/.test(t.question), t.question).toBe(false);
    }
  });
});
