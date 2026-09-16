import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ZAHAVCI_NEZMAR_MEDUZA_KORALY } from "../prirodopis/zahavciNezmarMeduzaKoraly";
import type { PracticeTask } from "@/lib/types";

/**
 * Žahavci — nezmar, medúza, korály (faktický select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, nezávislé na bankách generátoru):
 *  (1) ORG — klasifikátor klíčových slov: znaky z popisu → organismus nebo skupina.
 *  (2) CLAIMS — zbylá znění → vzor jediné správné možnosti.
 *  (3) MISKONCEPCE — žádná z typických chyb nesmí být klíčem.
 * Ve všech případech musí vyhovět PRÁVĚ jedna možnost a ta = correctAnswer.
 */
const topic = ZAHAVCI_NEZMAR_MEDUZA_KORALY[0];

// ── (1) ORG ─────────────────────────────────────────────────────────────────
interface Pravidlo { name: string; test: (q: string) => boolean; odpoved: RegExp }
const ORG: Pravidlo[] = [
  {
    name: "nezmar",
    test: (q) => /přisedl/.test(q) && /tůn|rybník/.test(q) && /vyrůstají|pup/.test(q),
    odpoved: /^nezmar$/,
  },
  {
    name: "sasanka",
    test: (q) => /přisedl/.test(q) && /moř/i.test(q) && /netvoří|bez .*schránk/.test(q),
    odpoved: /^sasanka$/,
  },
  {
    name: "medúza",
    test: (q) => /volně plave|plov/.test(q) && !/přisedl/.test(q) && /moř/i.test(q),
    odpoved: /^medúza$/,
  },
  {
    name: "korál",
    test: (q) => /koloni/.test(q) && /útes/.test(q) && !/netvoří/.test(q),
    odpoved: /^korál$/,
  },
  {
    name: "žahavci (skupina)",
    test: (q) => /paprsčit/.test(q) && /(Mezi jaké|Kam) .*patří\?$/.test(q),
    odpoved: /^mezi žahavce$/,
  },
];

// ── (2) CLAIMS ──────────────────────────────────────────────────────────────
const CLAIMS: [RegExp, (o: string) => boolean][] = [
  // L1
  [/omračují a chytají kořist/, (o) => /žahav/.test(o)],
  [/^Kde žije nezmar/, (o) => /rybník|tůn/.test(o)],
  [/skupiny živočichů patří medúza/, (o) => /žahavc/.test(o)],
  [/vznikají korálové útesy/, (o) => /vápenit/.test(o)],
  [/vrstev buněk/, (o) => /dvou/.test(o)],
  [/přisedlý tvar těla/, (o) => o === "polyp"],
  [/volně plovoucí tvar těla/, (o) => o === "medúza"],
  [/nezmar nejčastěji rozmnožuje/, (o) => /pučen/.test(o)],
  [/obklopuje ústní otvor/, (o) => /chapad/.test(o)],
  [/mořích rostou/, (o) => /tepl/.test(o) && /mělk/.test(o)],
  [/souměrnost/, (o) => /paprsč/.test(o)],
  [/žijí medúzy nejčastěji/, (o) => /moř/.test(o)],
  [/nervovou soustavu/, (o) => /rozptýl/.test(o)],
  [/dutina, ve které nezmar tráví/, (o) => /láčk/.test(o)],
  [/žahavec žije v českých rybnících/, (o) => o === "nezmar"],
  [/mořských živočichů patří mezi žahavce/, (o) => o === "sasanka"],
  // L2
  [/slouží láčkovitá dutina/, (o) => /tráv/.test(o)],
  [/doroste, i když/, (o) => /regener/.test(o)],
  [/udělá žahavá buňka/, (o) => /vlákn/.test(o)],
  [/nevznikají v hlubokém moři/, (o) => /^řasy/.test(o) && /světl/.test(o)],
  [/liší polyp od medúzy/, (o) => /polyp přisedá/.test(o)],
  [/popálila medúza/, (o) => /vylézt/.test(o) && /mořskou vodou/.test(o)],
  [/paprsčitě souměrné tělo, když čeká/, (o) => /kterékoli strany/.test(o)],
  [/získává kyslík/, (o) => /povrchem/.test(o)],
  [/moře otepluje/, (o) => /řas/.test(o) && /zbělaj/.test(o)],
  [/slouží nezmarovi chapadla/, (o) => /chytá/.test(o) && /potrav/.test(o)],
  [/Korál odumře/, (o) => /vápenit/.test(o)],
  [/výrůstek s chapadly/, (o) => /oddělí/.test(o) && /nezmar/.test(o)],
  [/vyhnout plovoucím medúzám/, (o) => /žahav/.test(o)],
  [/pluje perloočka/, (o) => /uvízne/.test(o) && /úst/.test(o)],
  [/medúza pohybuje/, (o) => /zvon/.test(o)],
  [/vystřelila vlákna/, (o) => /dotyk/.test(o)],
  // L3
  [/korál je rostlina/, (o) => /žahav/.test(o) && /lov/.test(o)],
  [/prokázal, že patří mezi žahavce/, (o) => /žahav/.test(o)],
  [/nezmar zelený nepatří mezi rostliny/, (o) => /řas/.test(o) && /lov/.test(o)],
  [/Který znak je od sebe odlišuje/, (o) => /^korál/.test(o) && /vytváří vápenitou/.test(o)],
  [/rozřízli nezmara/, (o) => /dorostl/.test(o)],
  [/aby nezbělaly/, (o) => /chladn/.test(o)],
  [/rosolovitý kotouč/, (o) => /nevystřel/.test(o)],
  [/nezmar, nebo řasa/, (o) => /chapad/.test(o) && /kořist/.test(o)],
  [/medúza je ryba/, (o) => /páteř/.test(o)],
  [/hnědí nezmaři/, (o) => /^v první/.test(o) && /lépe/.test(o)],
];

// ── (3) MISKONCEPCE ─────────────────────────────────────────────────────────
const MISKONCEPCE: RegExp[] = [
  /^(mezi )?ryb/, /rostlin/, /^(mořská )?řasa$/, /^mezi mořské řasy/, /^vápenec$/, /nerost/,
  /^pijavka$/, /žábr/, /semen/, /ulit/, /kostr/, /zub/, /čelist/, /kořen/, /sladkou vodou/,
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };

  // (1) popis → organismus / skupina
  if (/Co to je\?$|(Mezi jaké|Kam) .*patří\?$/.test(q)) {
    const shody = ORG.filter((p) => p.test(q));
    expect(shody.map((s) => s.name), `klasifikátor: ${q}`).toHaveLength(1);
    return one(`klasifikátor ${shody[0].name}`, opts.filter((o) => shody[0].odpoved.test(o)));
  }
  // (2) tvrzení
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

describe("Žahavci — metadata", () => {
  it("přírodopis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.id).toBe("g6-pri-zahavci-nezmar-meduza-koraly-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Žahavci — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh, jen select_one se 4 různými možnostmi", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
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

  it("miskoncepce nikdy nejsou klíčem", () => {
    for (const t of tasks) {
      for (const re of MISKONCEPCE) {
        expect(re.test(t.correctAnswer), `klíč "${t.correctAnswer}" odpovídá miskoncepci ${re}`).toBe(false);
      }
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

describe("Žahavci — gradace", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L3 = popis nebo případ, nikdy holá otázka", () => {
    for (const t of topic.generator(3)) {
      expect(/^(Popis:|Žák|Vědci|Na pláži|Proč|Korál i sasanka|Žáci|Potápěč|Na kameni|Rybář|Živočich má|Ve dvou tůních)/.test(t.question), t.question).toBe(true);
    }
  });

  it("L1 = přímé otázky bez popisu situace", () => {
    for (const t of topic.generator(1)) {
      expect(/^Popis:|tvrdí|lze usoudit|lze čekat/.test(t.question), t.question).toBe(false);
    }
  });
});
