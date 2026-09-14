import { describe, it, expect } from "vitest";
import { MEZOPOTAMIE } from "../dejepis/mezopotamie";
import type { PracticeTask } from "@/lib/types";

/**
 * Mezopotámie — faktický select_one vzor 2. stupně.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, psaný zvlášť od banky generátoru):
 *  • FACT_OWNER: znak / pojem ze znění → civilizace (Sumer / Babylonie / Asýrie / Egypt).
 *    U úloh s civilizací v klíči solver odvodí civilizaci jen ze znění otázky.
 *  • CLAIMS: znění otázky → vzor správného tvrzení; právě jedna možnost mu smí vyhovět.
 *  • TRUTH: u „chybného výroku“ solver ověří každý výrok zvlášť; právě jeden je nepravdivý.
 * Generátor vrací celou banku, takže test je deterministický výčet, ne sampling.
 */
const topic = MEZOPOTAMIE[0];
type Civ = "Sumer" | "Babylonie" | "Asýrie" | "Egypt";

/** Znak v otázce → civilizace, které patří. */
const FACT_OWNER: [RegExp, Civ][] = [
  [/ninive/i, "Asýrie"],
  [/beranidl/i, "Asýrie"],
  [/železn/i, "Asýrie"],
  [/oko za oko/i, "Babylonie"],
  [/chammurapi/i, "Babylonie"],
  [/papyrus/i, "Egypt"],
  [/pyramid/i, "Egypt"],
  [/faraon/i, "Egypt"],
  [/šedesát/i, "Sumer"],
  [/\bur a uruk/i, "Sumer"],
  [/jako první psal/i, "Sumer"],
];

/** Tvary, v nichž se civilizace objevuje v nabídce. Ostatní národy = "jiná". */
const CIV_FORMS: Record<Civ, string[]> = {
  Sumer: ["Sumer", "Sumerové", "Sumerům", "V Sumeru"],
  Babylonie: ["Babylonie", "Babyloňané", "V Babylonii"],
  Asýrie: ["Asýrie", "Asyřané", "V Asýrii"],
  Egypt: ["Egypt", "Egypťané", "Egypťanům", "V Egyptě"],
};
const civOf = (opt: string): Civ | "jiná" =>
  (Object.keys(CIV_FORMS) as Civ[]).find((c) => CIV_FORMS[c].includes(opt)) ?? "jiná";

/** Znění otázky → vzor správné odpovědi (nezávisle na klíči). */
const CLAIMS: [RegExp, RegExp][] = [
  // L1
  [/mezi kterými dvěma řekami/i, /eufrat.*tigris/i],
  [/na co psali sumerové/i, /hlin/i],
  [/čím psali písaři/i, /rákos/i],
  [/stupňovitá chrámová/i, /^zikkurat$/i],
  [/babylonský král dal sepsat/i, /^chammurapi$/i],
  [/hlavním městem asýrie/i, /^ninive$/i],
  [/asyrský král založil/i, /^aššurbanipal$/i],
  [/nejstarší dochovaný epos/i, /gilgameš/i],
  [/uměl psát a vedl záznamy/i, /^písař$/i],
  [/visuté zahrady/i, /babylon/i],
  [/dnešní zemi/i, /irák/i],
  [/jakým písmem psali/i, /klínov/i],
  [/král uruku, hrdina/i, /^gilgameš$/i],
  // L2
  [/zpočátku hlavně potřebovali/i, /evidenci/i],
  [/nenašel žádný hrob/i, /^zikkurat, protože sloužil jako chrám$/i],
  [/vytesané zákony/i, /zákoník/i],
  [/modrými lesklými cihlami/i, /babylon/i],
  [/shromáždit tisíce/i, /knihovna/i],
  [/18\. století př\. n\. l\..*babylon/i, /^chammurapi$/i],
  [/nebeského býka/i, /^gilgameš$/i],
  [/kopou kanály/i, /mezopotámi/i],
  [/nabukadnezar ii\. dal toto město/i, /^babylon$/i],
  [/seřízne stéblo/i, /rákos/i],
  // L3
  [/vyrazí-li/i, /závisel/i],
  [/postaví-li stavitel/i, /odpovídal za kvalitu/i],
  [/rostlinu věčného mládí/i, /epos/i],
  [/první státy.*u řek/i, /zavlažování/i],
  [/stavěli domy i chrámy/i, /chyběl kámen/i],
  [/knihovna dochovala/i, /požáru/i],
  [/skříňky z uru/i, /znali kolo/i],
  [/lagaš/i, /samostatnými státy/i],
  [/hliněné tabulky pro obyvatele/i, /papyrus tu hojně nerostl/i],
  [/seznam ovcí/i, /evidenci/i],
  [/na reliéfu z paláce/i, /válečnou/i],
];

/** Pravdivostní tabulka výroků (pro úlohy „který výrok je chybný“). */
const TRUTH: [RegExp, boolean][] = [
  [/sumerové psali rákosovým rydlem do hlíny/i, true],
  [/ninive leželo na řece tigris/i, true],
  [/chammurapi vládl .*v babylonu/i, true],
  [/knihovnu v ninive založil .*aššurbanipal/i, true],
  [/zikkuraty byly chrámy, ne hrobky/i, true],
  [/gilgamešovi vypráví o králi uruku/i, true],
  [/mezi eufratem a tigridem/i, true],
  [/šedesátkové soustavě/i, true],
  [/visuté zahrady .*v babylonu/i, true],
  [/vtlačovaly do vlhké hlíny/i, true],
  [/stovky znaků/i, true],
  [/zjednodušením obrázků/i, true],
  [/babyloňané .*papyrus/i, false],
  [/zákoník .*aššurbanipal/i, false],
  [/zikkurat sloužil jako hrobka/i, false],
  [/vymysleli ho babyloňané/i, false],
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  // 1) chybný výrok — každý výrok zvlášť proti tabulce
  if (/chyb|NENÍ pravdiv/.test(q)) {
    const vals = opts.map((o) => {
      const hits = TRUTH.filter(([re]) => re.test(o));
      expect(hits.length, `výrok "${o}" matchuje ${hits.length} řádků TRUTH`).toBe(1);
      return hits[0][1];
    });
    const nepravdive = opts.filter((_, i) => !vals[i]);
    expect(nepravdive, `v "${q}" musí být právě jeden nepravdivý výrok`).toHaveLength(1);
    return { kind: "vyrok", expected: nepravdive[0] };
  }
  // 2) civilizace v nabídce — odvození ze znaků ve znění
  if (opts.every((o) => civOf(o) !== "jiná" || /^(Řekové|Římanům|Féničané|Féničanům)$/.test(o))
    && civOf(t.correctAnswer) !== "jiná") {
    const owners = new Set(FACT_OWNER.filter(([re]) => re.test(q)).map(([, c]) => c));
    expect(owners.size, `znaky v "${q}" ukazují na ${[...owners]}`).toBe(1);
    const civ = [...owners][0];
    const hit = opts.filter((o) => civOf(o) === civ);
    expect(hit, `pro ${civ} v nabídce "${q}"`).toHaveLength(1);
    return { kind: "civilizace", expected: hit[0] };
  }
  // 3) tvrzení / pojem
  const rules = CLAIMS.filter(([re]) => re.test(q));
  expect(rules.length, `CLAIMS pro "${q}": ${rules.length}`).toBe(1);
  const hit = opts.filter((o) => rules[0][1].test(o));
  expect(hit, `právě jedna možnost vyhoví vzoru v "${q}"`).toHaveLength(1);
  return { kind: "tvrzeni", expected: hit[0] };
}

const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
/** Předložka + holý nominativ jména (vzniklo by „v Babylon“, „u Egypt“). */
const SPATNA_VAZBA = /(?<!\p{L})[VvZzUu] (Babylon|Uruk|Ur|Egypt|Irák|Sumer|Théby|Eufrat|Tigris|Nil)(?!\p{L})/u;

describe("Mezopotámie — metadata", () => {
  it("dějepis g6, select_one, Starověk", () => {
    expect(topic.id).toBe("g6-dej-mezopotamie-6");
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Nejstarší státy - Mezopotámie a Egypt");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Mezopotámie — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh, všechny s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
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

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s druhou cestou", () => {
    for (const t of tasks) {
      const v = solve(t);
      expect(t.correctAnswer, `${v.kind}: ${t.question}`).toBe(v.expected);
    }
  });

  it("u civilizačních úloh jsou distraktory jiné civilizace než klíč", () => {
    for (const t of tasks) {
      const key = civOf(t.correctAnswer);
      if (key === "jiná") continue;
      const civs = t.options!.map(civOf).filter((c) => c !== "jiná");
      expect(new Set(civs).size, t.question).toBe(civs.length);
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

  it("předložka se nelepí k holému nominativu", () => {
    for (const t of tasks) {
      const texty = [t.question, t.explanation ?? "", ...t.options!, ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(SPATNA_VAZBA.test(s), `špatná vazba: "${s}"`).toBe(false);
    }
  });
});

describe("Mezopotámie — gradace", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L3 obsahuje úryvek pramene, příčinu i chybný výrok", () => {
    const l3 = topic.generator(3).map((t) => t.question);
    expect(l3.some((q) => /úryvek/i.test(q))).toBe(true);
    expect(l3.some((q) => /^proč/i.test(q))).toBe(true);
    expect(l3.some((q) => /chyb|NENÍ pravdiv/.test(q))).toBe(true);
  });
});
