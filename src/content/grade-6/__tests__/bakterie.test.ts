import { describe, it, expect } from "vitest";
import { BAKTERIE_TOPICS } from "../prirodopis/bakterie";
import { klicUlohy } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Bakterie — faktické select_one téma přírodopisu 6. ročníku.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): klasifikátor klíčových slov nad textem
 * otázky a možností, parametry generátoru nečte.
 *  1) tabulka nemocí bakteriální × virové — u otázek „která nemoc je
 *     bakteriální" najde jedinou bakteriální možnost a porovná ji s klíčem;
 *  2) tabulka znaků — z popisu organismu odvodí bakterii / virus / prvoka / řasu;
 *  3) pravidlo léčby — žádný klíč netvrdí, že antibiotika působí na viry;
 *  4) bezpečnostní blacklist klíčů (máslo, olej, utrhnout, bez lékaře, přestat brát);
 *  5) ostatní otázky: nezávisle sepsaný kmen správné odpovědi.
 * Každá úloha musí být rozpoznána právě jedním pravidlem.
 */
const topic = BAKTERIE_TOPICS[0];

const low = (s: string) => s.toLowerCase();

// ── 1) Tabulka nemocí ────────────────────────────────────────────────────
const BAKTERIALNI = ["angín", "borelióz", "tetan", "salmonel", "tuberkul", "spál"];
const VIROVE = ["chřip", "rým", "neštovic", "spalnič", "encefalitid", "covid"];
function druhNemoci(s: string): "b" | "v" | null {
  const t = low(s);
  if (BAKTERIALNI.some((k) => t.includes(k))) return "b";
  if (VIROVE.some((k) => t.includes(k))) return "v";
  return null;
}

// ── 2) Tabulka znaků ─────────────────────────────────────────────────────
function organismZPopisu(q: string): RegExp {
  const t = low(q);
  if (/nemá buněčnou stavbu/.test(t)) return /virus/;
  if (/bez jádra|volně v cytoplazmě/.test(t)) return /bakteri/;
  if (/jádr/.test(t) && /bez buněčné stěny/.test(t)) return /prvok/;
  if (/jádr/.test(t) && /chloroplast|zelen/.test(t)) return /řas/;
  throw new Error(`popis nelze zařadit: ${q}`);
}

type Pravidlo = { name: string; test: (t: PracticeTask) => boolean; check: (t: PracticeTask) => void };
const re = (name: string, r: RegExp, kmen: RegExp): Pravidlo => ({
  name,
  test: (t) => r.test(t.question),
  check: (t) => expect(low(t.correctAnswer), `${name}: ${t.question}`).toMatch(kmen),
});

const PRAVIDLA: Pravidlo[] = [
  {
    name: "bakteriální nemoc z tabulky",
    test: (t) => /nemoc/.test(low(t.question)) && !/očkov/.test(t.question) && t.options!.every((o) => druhNemoci(o) !== null),
    check: (t) => {
      const bakt = t.options!.filter((o) => druhNemoci(o) === "b");
      expect(bakt, `právě jedna bakteriální nemoc: ${t.question}`).toHaveLength(1);
      expect(t.correctAnswer).toBe(bakt[0]);
    },
  },
  {
    name: "organismus z popisu znaků",
    test: (t) => /O co jde\?|O jaký organismus jde\?|Kdo to je\?/.test(t.question),
    check: (t) => expect(low(t.correctAnswer), t.question).toMatch(organismZPopisu(t.question)),
  },
  // L1
  re("co nemá", /NEMÁ\?/, /jádr.*membrán/),
  re("pohyb", /Čím se některé bakterie aktivně pohybují/, /bičík/),
  re("rozmnožování", /Jak se bakterie nejčastěji rozmnožují/, /dělení/),
  re("počet buněk", /Z kolika buněk/, /jedin/),
  re("pozorování", /Čím můžeme pozorovat/, /mikroskop/),
  re("zařazení", /Kam patří bakterie/, /jednobuněčn.*bez jádra/),
  re("koky", /zvané koky/, /kulovit/),
  re("jaderná hmota", /Kde leží dědičná informace/, /volně v cytoplazmě/),
  re("léky na bakterie", /léky, které ničí bakterie/, /antibiotik/),
  re("povinné očkování", /povinně očkovány/, /tetan/),
  re("půdní bakterie", /bakterie žijící v půdě/, /rozklád/),
  re("jogurt děj", /mění cukr na kyselinu/, /mléčné kvašení/),
  // L2
  re("kysané zelí", /zelí do soudku/, /mléčn.*bakteri/),
  re("jogurt doma", /lžíci bílého jogurtu/, /bakteri.*zkvasil/),
  re("kompost", /kompostu/, /rozkladač/),
  re("čistírna", /provzdušňovaných nádrží/, /bakteri.*rozklád/),
  re("střevní bakterie", /dlouhém užívání antibiotik/, /užitečn.*střevní bakteri/),
  re("hlízky", /hlízky/, /dusík/),
  re("propečení", /musí dobře propéct/, /teplo zničilo bakterie/),
  re("lednička", /v ledničce vydrží/, /zpomal/),
  re("mytí rukou", /ze záchodu/, /mýdl/),
  re("rána", /odřela koleno/, /vymýt.*dezinfik/),
  re("hřebík", /rezavým hřebíkem/, /tetan/),
  { name: "klíště", test: (t) => /přisáté klíště/.test(t.question), check: (t) => expect(low(t.correctAnswer)).toMatch(/celé.*dezinfik/) },
  re("zarudlý kruh", /zarudlý kruh/, /lékař/),
  re("tůň", /neznámé tůně/, /škodliv.*bakteri/),
  re("prkénko", /jiném prkénku/, /bakteri.*zelenin/),
  re("omytí masa", /omyl vodou/, /^ne, .*tepeln/),
  re("angína léčba", /onemocněla streptokokovou/, /antibiotik.*lékař/),
  // L3
  re("antibiotika pro jistotu", /pro jistotu antibiotika/, /užitečn.*odoln/),
  re("dobrat léčbu", /na deset dní/, /bakteri.*vrátit/),
  { name: "chřipka", test: (t) => /má chřipku/.test(t.question), check: (t) => expect(low(t.correctAnswer)).toMatch(/nepomoh.*virus/) },
  re("pouzdro", /slizové pouzdro/, /vyschnut/),
  re("množení v teple", /po pěti hodinách/, /dělením/),
  re("bičík a potrava", /kousek cukru/, /s bičíkem.*pohyb/),
  re("Petrův argument", /^Petr tvrdí/, /rozklád/),
  re("Eliščina úvaha", /^Eliška tvrdí/, /virov/),
  re("jogurt bez bakterií", /^Adéla ohřála/, /mléčné bakteri/),
  re("čistírna a antibiotika", /zbytky antibiotik a dezinfekce/, /zničil.*bakteri.*čistí/),
  re("zahradník", /zahradník/, /půd.*ranou/),
  { name: "tábor", test: (t) => /Na táboře/.test(t.question), check: (t) => expect(low(t.correctAnswer)).toMatch(/tepelně upravit.*ruce/) },
];

function solve(t: PracticeTask): Pravidlo {
  const hit = PRAVIDLA.filter((p) => p.test(t));
  expect(hit.map((p) => p.name), `solver musí úlohu rozpoznat právě jedním pravidlem: ${t.question}`).toHaveLength(1);
  return hit[0];
}

const BLACKLIST = /másl|olej|utrhn|bez lékaře|přestat brát/;
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\d]+/gu, " ").trim();
const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");

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

describe("Bakterie — metadata", () => {
  it("přírodopis g6, select_one, přesné RVP zařazení", () => {
    expect(topic.id).toBe("g6-pri-bakterie-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.rvpNodeId).toBe("g6-prirodopis-nebunecni-a-bakterie-viry-a-bakterie-bakterie-stavba-vyznam-bakterialni-nemoci");
    expect(topic.category).toBe("Nebuněční a bakterie");
    expect(topic.topic).toBe("Viry a bakterie");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Bakterie — úlohy level %i", (level) => {
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

  it("SOLVER: klíč souhlasí s nezávislou cestou", () => {
    for (const t of tasks) solve(t).check(t);
  });

  it("nemoci: žádný distraktor u otázky na bakteriální nemoc není bakteriální", () => {
    for (const t of tasks.filter((x) => solve(x).name === "bakteriální nemoc z tabulky")) {
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) expect(druhNemoci(o), o).toBe("v");
    }
  });

  it("léčba: žádný klíč netvrdí, že antibiotika působí na viry; blacklist", () => {
    for (const t of tasks) {
      const k = low(t.correctAnswer);
      if (/antibiotik/.test(k) && /vir/.test(k)) expect(k, t.question).toMatch(/ne(působ|pomoh|zabír)/);
      if (/vir/.test(low(t.question)) && /antibiotik/.test(low(t.question))) {
        expect(k, t.question).toMatch(/ne(působ|pomoh|zabír)/);
      }
      expect(k, `nebezpečná rada v klíči: ${t.question}`).not.toMatch(BLACKLIST);
    }
  });

  it("délka: klíč je nejdelší možností nejvýš ve 40 % úloh", () => {
    const nejdelsi = tasks.filter((t) => t.options!.every((o) => o === t.correctAnswer || o.length < t.correctAnswer.length));
    expect(nejdelsi.length / tasks.length, nejdelsi.map((t) => t.correctAnswer).join(" | ")).toBeLessThanOrEqual(0.4);
  });

  it("klíč nevyčnívá prvním slovem", () => {
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (jine[0].length >= 3 && new Set(jine).size === 1) {
        expect(prvni(t.correctAnswer), t.question).toBe(jine[0]);
      }
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

describe("Bakterie — gradace", () => {
  it("L1 a L3 se znění ani klíčem nepřekrývají; L3 je přenos", () => {
    const l1 = topic.generator(1), l3 = topic.generator(3);
    const q1 = new Set(l1.map((t) => norm(t.question)));
    expect(l3.filter((t) => q1.has(norm(t.question)))).toHaveLength(0);
    const k1 = new Set(l1.map((t) => norm(t.correctAnswer)));
    expect(l3.filter((t) => k1.has(norm(t.correctAnswer)))).toHaveLength(0);
    const zacatky1 = new Set(l1.map((t) => t.question.split(" ")[0]));
    for (const t of l3) expect(zacatky1.has(t.question.split(" ")[0]), `L3 začíná jako L1: ${t.question}`).toBe(false);
    expect(l3.filter((t) => /O co jde\?|O jaký organismus|Kdo to je\?/.test(t.question)).length).toBeGreaterThanOrEqual(4);
    expect(l3.filter((t) => /tvrdí/.test(t.question)).length).toBeGreaterThanOrEqual(2);
  });
});
