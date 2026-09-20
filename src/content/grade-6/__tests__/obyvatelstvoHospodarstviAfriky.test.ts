import { describe, it, expect } from "vitest";
import { OBYVATELSTVO_HOSPODARSTVI_AFRIKY } from "../zemepis/obyvatelstvoHospodarstviAfriky";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Afrika — obyvatelstvo, hospodářství, problémy kontinentu (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nezávislá na datové bance generátoru):
 *  1. Klasifikátor fakt-mapa: test si drží vlastní tabulku slovo → zařazení
 *     (nerost / vývozní plodina / plodina pro domácí potřebu / plodina mírného
 *     pásu; plodina → oblast, kam se hodí). Zařazení odvodí z TEXTU otázky
 *     (regex „těží“, „na vývoz“, „pro vlastní potřebu“, „vlhkých tropů“…) a
 *     ověří, že klíč splňuje právě jedno zařazení a žádný distraktor ne.
 *  2. Řetězec příčina → důsledek: úloha „příčina × důsledek“ se vyřeší
 *     z tabulky pořadí (sucho < neúroda < hlad), ne z klíče generátoru.
 *  3. Klasifikátor popisu oblasti (Guinejský záliv × Sahel) nad popisem v zadání.
 *  4. Tabulka „znění → co klíč musí obsahovat“; solver vybere právě jednu
 *     možnost s daným obsahem a ostatní zamítne.
 *  5. Strukturální kontroly (4 možnosti, délka klíče, feedback, nápovědy,
 *     disjunktní znění L1 × L3, determinismus).
 */
const topic = OBYVATELSTVO_HOSPODARSTVI_AFRIKY[0];

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

function withSeed<T>(seed: number, fn: () => T): T {
  const orig = Math.random;
  Math.random = seeded(seed);
  try {
    return fn();
  } finally {
    Math.random = orig;
  }
}

// ── 1. fakt-mapa: slovo → zařazení ─────────────────────────────────────────

type Druh = "nerost" | "vyvozni" | "domaci" | "mirna";
const DRUH: Record<string, Druh> = {
  zlato: "nerost", diamanty: "nerost", ropa: "nerost", "měď": "nerost", uhlí: "nerost",
  kakao: "vyvozni", "káva": "vyvozni", bavlna: "vyvozni", "čaj": "vyvozni",
  proso: "domaci", sorgo: "domaci", maniok: "domaci",
  brambory: "mirna", "řepka": "mirna", "žito": "mirna", "ječmen": "mirna",
};

/** Plodina → oblast, kam se hodí (vlastní znalost testu). */
type Oblast = "vlhke" | "savana" | "oaza";
const PLODINA_OBLAST: Record<string, Oblast> = {
  "kakaovník": "vlhke", "banánovník": "vlhke",
  proso: "savana", sorgo: "savana",
  "datlovník": "oaza",
};

function oblastZOtazky(q: string): Oblast | null {
  if (/vlhkých tropů/.test(q)) return "vlhke";
  if (/do savany/.test(q)) return "savana";
  if (/do oázy/.test(q)) return "oaza";
  return null;
}

// ── 2. řetězec příčina → důsledek ──────────────────────────────────────────

const POKUS_ORDER: Record<string, number> = {
  "nepršelo": 0, "vyschla pole": 1, "neúroda": 2, "vzrostly ceny jídla": 3, "lidé odešli do města": 4,
};

/** "a → b → c → d → e" je správně, když jsou články seřazeny podle příčinné návaznosti. */
function retezecOk(text: string): boolean {
  const cl = text.split(" → ");
  if (cl.length !== 5 || !cl.every((c) => c in POKUS_ORDER)) return false;
  return cl.every((c, i) => POKUS_ORDER[c] === i);
}

// ── 3. klasifikátor popisu oblasti ─────────────────────────────────────────

function oblastZPopisu(popis: string): string | null {
  const guinea = [/celý rok horko/i, /pěstování kakaovníků/i, /přístavní města/i].filter((r) => r.test(popis)).length;
  const sahel = [/krátké deště/i, /časté neúrody/i, /přepásané pastviny/i, /jižním okraji Sahary/i].filter((r) => r.test(popis)).length;
  if (guinea === sahel) return null;
  return guinea > sahel ? "pobřeží Guinejského zálivu" : "Sahel";
}

// ── 4. tabulka „znění → co musí obsahovat právě jedna možnost“ ─────────────

const OBSAH: [RegExp, RegExp][] = [
  // L1
  [/živí většina obyvatel Afriky na venkově/, /^zemědělstvím/],
  [/Jak se v Africe vyvíjí počet obyvatel/, /^rychle roste/],
  [/mladé obyvatelstvo/, /děti a mladí/],
  [/osídlená nejřidčeji/, /Sahara/],
  [/osídlená nejhustěji/, /Nil/],
  [/tradiční pastevci/, /^kočují/],
  [/Jak se nazývá zemědělství, při kterém/, /^samozásobitelské$/],
  [/velké farmy/, /^plantáže$/],
  [/Co africké země zpravidla vyvážejí/, /^nerostné suroviny a zemědělské plodiny$/],
  [/Co je oáza/, /^místo v poušti, kde je voda/],
  [/používá hlavně jako palivo/, /^ropa$/],
  // L2
  [/údolí Nilu/, /zavlažování/],
  [/Guinejského zálivu jednou/, /dost vody a tepla/],
  [/vyváží suroviny a dováží/, /továrny/],
  [/v poušti Sahara/, /oázách/],
  [/africká města rostou/, /odcházejí z vesnic/],
  [/Co přináší městům/, /slumy/],
  [/typická opakovaným suchem a hladem/, /Sahel/],
  [/ve velkém pěstují kakaovníky/, /prodává do zahraničí/],
  [/pastevci v savaně a stepi často kočují/, /^Pastva a voda/],
  [/vysoké porodnosti vyplývá/, /víc lidí, než jich umírá/],
  [/půda v tropickém deštném lese/, /vyplavují živiny/],
  // L3
  [/spásat trávu na okraji Sahary/, /^Dezertifikace/],
  [/jediné rudy/, /^Příjmy státu klesnou/],
  [/Studna ve vesnici/, /hlubší studnu/],
  [/bez kanalizace bydlí tisíce/, /^Nemoci z nekvalitní vody/],
  [/velké zásoby nerostů/, /bez zpracování/],
  [/opustili vesnici mladí lidé/, /chudinské čtvrti/],
  [/kakao na vývoz/, /^Přijdou o většinu příjmů/],
  [/vykácejí všechny stromy/, /^Bez kořenů/],
  [/zabránit vysychání/, /^Sázet stromy/],
  [/Země A žije z vývozu ropy/, /^Země A,/],
  [/husté chatrče/, /^Slum; vznikl, protože do města přišlo víc lidí/],
];

type Vysledek = { kind: string; ok: boolean; detail?: string };

function solve(t: PracticeTask): Vysledek | null {
  const q = t.question;
  const key = t.correctAnswer;
  const opts = t.options!;
  const distraktory = opts.filter((o) => o !== key);

  // (1a) nerost × plodina
  if (/nerostná surovina, kterou lidé získávají z podzemí/.test(q)) {
    const nerosty = opts.filter((o) => DRUH[o] === "nerost");
    return { kind: "trida", ok: nerosty.length === 1 && nerosty[0] === key && distraktory.every((d) => DRUH[d] === "vyvozni" || DRUH[d] === "domaci"), detail: `nerosty: ${nerosty}` };
  }
  // (1b) vývoz × mírný pás
  if (/pěstuje hlavně na vývoz/.test(q)) {
    const vyvozni = opts.filter((o) => DRUH[o] === "vyvozni");
    return { kind: "trida", ok: vyvozni.length === 1 && vyvozni[0] === key && distraktory.every((d) => DRUH[d] === "mirna"), detail: `vývozní: ${vyvozni}` };
  }
  // (1c) pro vlastní potřebu × vývoz
  if (/pro vlastní potřebu, ne na prodej/.test(q)) {
    const domaci = opts.filter((o) => DRUH[o] === "domaci");
    return { kind: "trida", ok: domaci.length === 1 && domaci[0] === key && distraktory.every((d) => DRUH[d] === "vyvozni"), detail: `domácí: ${domaci}` };
  }
  // (1d) plodina → oblast
  if (/^Která plodina se/.test(q)) {
    const oblast = oblastZOtazky(q);
    if (!oblast) return { kind: "oblast", ok: false, detail: "oblast se nedala vyparsovat" };
    const sedi = opts.filter((o) => PLODINA_OBLAST[o] === oblast);
    return { kind: "oblast", ok: sedi.length === 1 && sedi[0] === key, detail: `oblast ${oblast}, sedí: ${sedi}` };
  }
  // (2) příčina → důsledek
  if (/od příčiny k důsledkům/.test(q)) {
    const dobre = opts.filter(retezecOk);
    return { kind: "retezec", ok: dobre.length === 1 && dobre[0] === key, detail: `dobré: ${dobre.join(" | ")}` };
  }
  // (3) popis oblasti
  if (/^Popis oblasti:/.test(q)) {
    const popis = q.replace(/^Popis oblasti:\s*/, "").split("O kterou oblast")[0];
    const r = oblastZPopisu(popis);
    if (!r) return { kind: "popis", ok: false, detail: "popis nemá jednoznačné znaky" };
    return { kind: "popis", ok: key === r && distraktory.every((d) => d !== r), detail: `popis → ${r}` };
  }
  // (4) obsah klíče
  for (const [rq, rk] of OBSAH) {
    if (rq.test(q)) {
      const sedi = opts.filter((o) => rk.test(o));
      return { kind: "obsah", ok: sedi.length === 1 && sedi[0] === key, detail: `${rq} → ${sedi.join(" | ")}` };
    }
  }
  return null;
}

const levels = [1, 2, 3] as const;
const vzorky = Object.fromEntries(
  levels.map((l) => [l, [11, 22, 33, 44, 55, 66, 77, 88].flatMap((s) => withSeed(s, () => topic.generator(l)))]),
) as Record<1 | 2 | 3, PracticeTask[]>;

describe("Afrika (obyvatelstvo) — metadata", () => {
  it("zeměpis g6, select_one, RVP zápis znak po znaku", () => {
    expect(topic.id).toBe("g6-zem-obyvatelstvo-hospodarstvi-afriky-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Regiony světa");
    expect(topic.topic).toBe("Afrika");
    expect(topic.rvpNodeId).toBe(
      "g6-zemepis-regiony-sveta-afrika-obyvatelstvo-a-hospodarstvi-afriky-problemy-kontinentu",
    );
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(levels)("Afrika (obyvatelstvo) — L%i", (level) => {
  const tasks = vzorky[level];

  it("nezávislý solver potvrdí každý klíč", () => {
    for (const t of tasks) {
      const r = solve(t);
      expect(r, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      expect(r!.ok, `${t.question} → ${t.correctAnswer} (${r!.detail ?? ""})`).toBe(true);
    }
  });

  it("4 různé možnosti, právě 1 správná, feedback ke každému distraktoru", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer).length).toBe(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
    }
  });

  it("klíč není ve znění ani v nápovědě, nápovědy se liší", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), t.question).toBe(false);
      expect(t.hints!.length).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(h.includes(t.correctAnswer), `hint leak: ${t.question}`).toBe(false);
      }
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("žádná mapa ani obrázek, žádný letopočet", () => {
    for (const t of tasks) {
      const cely = [t.question, ...(t.options ?? []), t.explanation ?? ""].join(" ");
      expect(t.question).not.toMatch(/na mapě|na mapu|na obrázk|podívej se/i);
      expect(cely).not.toMatch(/19\d\d|20\d\d/);
    }
  });

  it("klíč nevyčnívá délkou (průměr ≤ 1,15× průměr distraktorů)", () => {
    const klic = tasks.map((t) => t.correctAnswer.length);
    const dist = tasks.flatMap((t) => t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length));
    const prum = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
    expect(prum(klic) / prum(dist)).toBeLessThanOrEqual(1.15);
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsi = tasks.filter((t) => {
      const others = t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length);
      return t.correctAnswer.length > Math.max(...others);
    }).length;
    expect(nejdelsi / tasks.length).toBeLessThan(0.5);
  });

  it("klíč nevyčnívá úvodním slovem, když distraktory začínají stejně", () => {
    const prvni = (s: string) => s.split(/\s+/)[0].toLowerCase().replace(/[.,;—:]/g, "");
    for (const t of tasks) {
      const d = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(d).size === 1) {
        expect(prvni(t.correctAnswer), `klíč vyčnívá tvarem: ${t.question}`).toBe(d[0]);
      }
    }
  });

  it("≥ 12 různých úloh na jedno volání generátoru", () => {
    const jedno = withSeed(7, () => topic.generator(level));
    expect(pocetUnikatnich(jedno)).toBeGreaterThanOrEqual(12);
  });

  it("žádná úloha nemíchá typy — všechny mají options, žádná bez solutionSteps", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toBeTruthy();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
      expect(t.solutionSteps, t.question).toBeUndefined();
    }
  });
});

describe("Afrika (obyvatelstvo) — gradace a determinismus", () => {
  it("L1 je krátký fakt; L3 je popis situace", () => {
    for (const t of vzorky[1]) {
      expect(t.question, t.question).toMatch(/^(Co|Kde|Kdo|Který|Která|Které|Kterou|Jak|Čím)/);
      expect(t.question.length, `L1 je příliš dlouhá: ${t.question}`).toBeLessThan(90);
    }
    for (const t of vzorky[3]) {
      expect(t.question.length, `L3 je příliš krátká: ${t.question}`).toBeGreaterThanOrEqual(75);
    }
  });

  it("L1 a L3 mají disjunktní znění a průměrně delší je L3", () => {
    const l1 = new Set(vzorky[1].map((t) => t.question));
    expect(vzorky[3].filter((t) => l1.has(t.question))).toEqual([]);
    const prum = (ts: PracticeTask[]) => ts.reduce((s, t) => s + t.question.length, 0) / ts.length;
    expect(prum(vzorky[3])).toBeGreaterThan(prum(vzorky[1]) * 1.5);
  });

  it("L2 spojuje podmínky se životem — každá otázka je Proč / Jak / Co / Která / Které", () => {
    for (const t of vzorky[2]) {
      expect(t.question, t.question).toMatch(/^(Proč|Jak|Co|Která plodina|Která z těchto oblastí|Které území)/);
    }
  });

  it("gen() je deterministický a bez stavu modulu", () => {
    const otisk = () =>
      JSON.stringify(levels.map((l) => topic.generator(l).map((t) => [t.question, t.correctAnswer])));
    const a = withSeed(123, otisk);
    Math.random();
    Math.random();
    const b = withSeed(123, otisk);
    expect(b).toBe(a);
  });
});

/** Sezení = prvních `sessionTaskCount` úloh poolu: příbuzné úlohy se nesmí sejít. */
describe("Afrika (obyvatelstvo) — skladba sezení", () => {
  const KOLIK = topic.sessionTaskCount!;
  const seedy = Array.from({ length: 40 }, (_, i) => i * 7 + 3);
  const sezeni = (level: 1 | 2 | 3, seed: number) =>
    withSeed(seed, () => topic.generator(level)).slice(0, KOLIK);
  const kolikrat = (tasks: PracticeTask[], r: RegExp) => tasks.filter((t) => r.test(t.question)).length;

  it("L1: nejvýš jedna úloha z každé příbuzné skupiny", () => {
    for (const s of seedy) {
      const t = sezeni(1, s);
      expect(kolikrat(t, /vyvíjí počet obyvatel|mladé obyvatelstvo/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /osídlená nejřidčeji|osídlená nejhustěji/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /nerostná surovina/), `seed ${s}`).toBeLessThanOrEqual(1);
    }
  });

  it("L2: nejvýš jedna plodinová a jedna městská úloha", () => {
    for (const s of seedy) {
      const t = sezeni(2, s);
      expect(kolikrat(t, /^Která plodina/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /africká města rostou|Co přináší městům/), `seed ${s}`).toBeLessThanOrEqual(1);
    }
  });

  it("L3: nejvýš jedna úloha o dezertifikaci, o jediné surovině a o městě", () => {
    for (const s of seedy) {
      const t = sezeni(3, s);
      expect(kolikrat(t, /spásat trávu|vykácejí všechny stromy|zpomalit postup písku/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /jediné rudy|kakao na vývoz|Země A žije/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /bez kanalizace|velkoměsta|chatrče z plechu/), `seed ${s}`).toBeLessThanOrEqual(1);
    }
  });
});

describe("Afrika (obyvatelstvo) — vývozní plodiny × nerosty se neplete", () => {
  it("žádný distraktor plodinové úlohy není zároveň klíčem stejné skupiny", () => {
    for (const t of [...vzorky[1], ...vzorky[2]]) {
      const r = solve(t);
      if (r?.kind === "trida" || r?.kind === "oblast") expect(r.ok, t.question).toBe(true);
    }
  });
});
