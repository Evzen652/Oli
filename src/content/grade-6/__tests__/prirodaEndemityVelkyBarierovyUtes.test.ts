import { describe, it, expect } from "vitest";
import { PRIRODA_ENDEMITY_VELKY_BARIEROVY_UTES } from "../zemepis/prirodaEndemityVelkyBarierovyUtes";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Austrálie a Oceánie — příroda, endemity, Velký bariérový útes (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nezávislá na datových bankách generátoru):
 *  1. Popis zvířete → klasifikátor znaků. Test si drží VLASTNÍ tabulku
 *     vlastností zvířat (vak, skoky, stromy, vejce, zobák, křídla, voda …)
 *     a z popisu v zadání vytáhne, jaké znaky text tvrdí. Správná je právě ta
 *     možnost, jejíž vlastnosti žádnému tvrzení neodporují. Pštros se
 *     vylučuje údajem „Austrálie“, medvěd údajem „vak“.
 *  2. Popis útesu / místa → tabulka vlastností prostředí (vápenec, živočichové,
 *     láva, písek); popis oblasti → sucho × vlhko.
 *  3. Příčina → následek: vlastní tabulka (izolace → endemity, teplá mělká
 *     čistá voda → koráli, oteplení → bělení, dovezený predátor → mizení
 *     původních druhů). Pro každou úlohu se ověří, že pravidlu vyhoví PRÁVĚ
 *     jedna možnost a že je to klíč.
 *  4. Strukturální kontroly (4 možnosti, délka klíče, feedback, nápovědy,
 *     disjunktní znění L1 × L3, žádná čísla, determinismus).
 */
const topic = PRIRODA_ENDEMITY_VELKY_BARIEROVY_UTES[0];

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

// ── 1. vlastní tabulka zvířat (zdroj pravdy testu) ─────────────────────────

interface Vlastnosti {
  savec: boolean;
  vak: boolean;
  skoky: boolean;
  strom: boolean;
  listy: boolean;
  vejce: boolean;
  ptak: boolean;
  nelet: boolean;
  zobak: boolean;
  voda: boolean;
  medvidek: boolean;
  mimoAus: boolean;
}
const NIC: Vlastnosti = {
  savec: false, vak: false, skoky: false, strom: false, listy: false, vejce: false,
  ptak: false, nelet: false, zobak: false, voda: false, medvidek: false, mimoAus: false,
};
const ZVIRATA: Record<string, Vlastnosti> = {
  klokan: { ...NIC, savec: true, vak: true, skoky: true },
  koala: { ...NIC, savec: true, vak: true, strom: true, listy: true, medvidek: true },
  emu: { ...NIC, ptak: true, nelet: true, vejce: true },
  ptakopysk: { ...NIC, savec: true, vejce: true, zobak: true, voda: true },
  pštros: { ...NIC, ptak: true, nelet: true, vejce: true, mimoAus: true },
  vydra: { ...NIC, savec: true, voda: true, mimoAus: true },
  dingo: { ...NIC, savec: true },
  "medvěd grizzly": { ...NIC, savec: true, strom: true, medvidek: true, mimoAus: true },
  lev: { ...NIC, savec: true, mimoAus: true },
  tygr: { ...NIC, savec: true, mimoAus: true },
  slon: { ...NIC, savec: true, mimoAus: true },
  zebra: { ...NIC, savec: true, mimoAus: true },
};
const AUS = new Set(["klokan", "koala", "emu", "ptakopysk"]);
const CIZI = new Set(["lev", "tygr", "slon", "zebra", "medvěd grizzly", "pštros"]);
const VACNATCI = new Set(["klokan", "koala"]);

/** Které znaky tvrdí popis (regexy jsou vlastní, ne z generátoru). */
const TVRZENI: [keyof Vlastnosti, RegExp][] = [
  ["vak", /\bvak|kapse|kožním záhybu/i],
  ["skoky", /skoc|skáče|uskáče|skoky/i],
  ["strom", /strom|koruně|šplhání/i],
  ["listy", /listy|okusuje/i],
  ["vejce", /vejce|vajec|vejcích/i],
  ["ptak", /\bpták|ptačí|peří/i],
  ["nelet", /nevzlétne|neslouží k letu/i],
  ["zobak", /zobák/i],
  ["voda", /ve vodě|vodní|tocích|plovac/i],
  ["medvidek", /medvídka|chlupaté uši/i],
  ["savec", /\bsavec/i],
];

function tvrzeniPopisu(q: string): (keyof Vlastnosti)[] {
  const out = TVRZENI.filter(([, r]) => r.test(q)).map(([k]) => k);
  // „Austrálie“ / „australský“ v zadání vylučuje zvířata z jiných světadílů
  if (/austr/i.test(q)) out.push("mimoAus");
  return out;
}

/** Možnost je slučitelná s popisem, když nemá ani jeden odporující znak. */
function slucitelne(zvire: string, q: string): boolean {
  const v = ZVIRATA[zvire];
  if (!v) return false;
  for (const k of tvrzeniPopisu(q)) {
    if (k === "mimoAus") {
      if (v.mimoAus) return false;
    } else if (!v[k]) {
      return false;
    }
  }
  return true;
}

// ── 2. prostředí: útes × ostatní pobřežní útvary; sucho × vlhko ────────────

interface Prostredi {
  vapenec: boolean;
  zivocichove: boolean;
}
const PROSTREDI: Record<string, Prostredi> = {
  "korálový útes": { vapenec: true, zivocichove: true },
  "sopečný ostrov": { vapenec: false, zivocichove: false },
  "mangrovový les": { vapenec: false, zivocichove: false },
  "písečná pláž": { vapenec: false, zivocichove: false },
};

const jeSucho = (o: string) => /vnitrozemí|poušt|plošin/i.test(o);
const jeVlhko = (o: string) => /pobřeží/i.test(o) && !/korálov/i.test(o);

/** Útes: dobré místo = teplé/průzračné + mělké, žádný kal, chlad, hloubka ani sladká voda. */
const dobreMistoProUtes = (o: string) =>
  /(teplé|průzračná)/i.test(o) && /mělk/i.test(o) && !/kalné|studen|hlubok|sladkovodní/i.test(o);

// ── 3. příčina → následek: pravidlo = predikát nad možností ────────────────

type Pravidlo = [RegExp, (option: string) => boolean];

const FAKTA: Pravidlo[] = [
  // L1
  [/^Co znamená slovo endemit/, (o) => /jen v jedné oblasti/.test(o)],
  [/^Čím je Austrálie/, (o) => /zároveň.*státem/.test(o)],
  [/^Na které polokouli/, (o) => /^na jižní polokouli/.test(o)],
  [/^Mezi kterými oceány/, (o) => /Indickým a Tichým/.test(o)],
  [/^Kde leží Velký bariérový útes/, (o) => /severovýchodního pobřeží/.test(o)],
  [/^V jakém moři/, (o) => /Korálovém/.test(o)],
  [/^Co vytváří Velký bariérový útes/, (o) => /polyp/.test(o)],
  [/^Jaké je vnitrozemí Austrálie/, (o) => /suché|poušt/.test(o)],
  [/^Který obydlený světadíl je nejsušší/, (o) => o === "Austrálie"],
  [/^Co platí o emu/, (o) => /pták, který neumí létat/.test(o)],
  [/^Jak se pohybuje klokan/, (o) => /^skáče/.test(o)],
  [/^Které tvrzení o koale/, (o) => /vačnatec, který nosí mládě/.test(o)],
  [/^Čím se koala živí/, (o) => /eukalypt/.test(o)],
  [/^Kde žije ptakopysk/, (o) => /^ve sladk/.test(o)],
  [/^Čím je ptakopysk/, (o) => /snáší vejce/.test(o)],
  // L2
  [/dlouho oddělená od ostatních světadílů/, (o) => /druhy, které jinde nežijí/.test(o)],
  [/v přírodě jen v Austrálii/, (o) => /oddělená.*vyvíjely/.test(o)],
  [/tropického pobřeží, a ne u jižního/, (o) => /teplé, čisté a mělké/.test(o)],
  [/ústí velkých řek koráli neprospívají/, (o) => /kalná sladká/.test(o)],
  [/ve velké hloubce moře/, (o) => /nedostane sluneční světlo/.test(o)],
  [/deštné pralesy na severovýchodním pobřeží/, (o) => /od moře vlhký vzduch/.test(o)],
  [/žije klokan rudý/, (o) => /suchém vnitrozemí/.test(o)],
  [/mládě ve vaku na břiše/, (o) => o === "vačnatci"],
  [/klade vejce\. Do které skupiny/, (o) => o === "vejcorodí savci"],
  [/Co se stane, když les zmizí/, (o) => /přijde o domov i potravu/.test(o)],
  [/velmi málo srážek/, (o) => /pouště a polopouště/.test(o)],
  [/Jak se zachrání před nepřítelem/, (o) => /uteče/.test(o)],
  [/přesto ho řadíme mezi savce/, (o) => /srst/.test(o) && /kojí/.test(o)],
  [/Jak vzniká korálový útes/, (o) => /vápenité schránky/.test(o)],
  // L3
  [/^Zpráva/, (o) => /oteplila/.test(o)],
  [/bahno a hnojiva|půda s hnojivy z pobřežních plantáží/, (o) => /kalná voda ubírá světlo/.test(o)],
  [/dovezeni králíci|dovezeny divoké kočky/, (o) => /nevyvíjely a neuměly se bránit/.test(o)],
  [/co nejvíce pomůže Velkému bariérovému útesu/, (o) => /omezit splachy/.test(o) && /oteplování/.test(o)],
  [/daleko od pevniny|vzdáleném tichomořském ostrově/, (o) => /dlouho oddělený a druh se tam vyvíjel sám/.test(o)],
  [/umělý útes|nově vzniklý útes/, dobreMistoProUtes],
];

type Vysledek = { kind: string; ok: boolean; detail?: string };

function solve(t: PracticeTask): Vysledek | null {
  const q = t.question;
  const key = t.correctAnswer;
  const opts = t.options!;
  const distraktory = opts.filter((o) => o !== key);

  // popis zvířete → právě jedno zvíře slučitelné s tvrzeními v zadání
  if (/^Popis zvířete:/.test(q)) {
    const vyhovuje = opts.filter((o) => slucitelne(o, q));
    return {
      kind: "zvire",
      ok: vyhovuje.length === 1 && vyhovuje[0] === key,
      detail: `slučitelné: ${vyhovuje.join(", ") || "žádné"}; klíč ${key}`,
    };
  }

  // popis útesu → právě jedna možnost s vápencem a živočichy
  if (/^Popis místa:/.test(q)) {
    const tvrdiVapenec = /vápen/i.test(q);
    const tvrdiZivocichy = /živočich/i.test(q);
    const vyhovuje = opts.filter((o) => {
      const p = PROSTREDI[o];
      if (!p) return false;
      return (!tvrdiVapenec || p.vapenec) && (!tvrdiZivocichy || p.zivocichove);
    });
    return {
      kind: "utes",
      ok: (tvrdiVapenec || tvrdiZivocichy) && vyhovuje.length === 1 && vyhovuje[0] === key,
      detail: `vyhovuje: ${vyhovuje.join(", ")}`,
    };
  }

  // popis oblasti → sucho × vlhko
  if (/^Popis oblasti:/.test(q)) {
    const suchy = /deště jsou vzácné|vysychají|suchou trávou/i.test(q);
    const vlhky = /vlhký|prales|prudkými dešti/i.test(q);
    if (suchy === vlhky) return { kind: "oblast", ok: false, detail: "popis je nejednoznačný" };
    const pred = suchy ? jeSucho : jeVlhko;
    const vyhovuje = opts.filter(pred);
    return { kind: "oblast", ok: vyhovuje.length === 1 && vyhovuje[0] === key, detail: `vyhovuje: ${vyhovuje.join(" | ")}` };
  }

  // seznamy zvířat: který je australský / cizí / vačnatec
  if (/^Který z těchto živočichů/.test(q)) {
    if (/vačnatec/.test(q)) {
      return {
        kind: "seznam",
        ok: VACNATCI.has(key) && distraktory.every((d) => !VACNATCI.has(d) && !!ZVIRATA[d]),
        detail: `klíč ${key}, distraktory ${distraktory.join("/")}`,
      };
    }
    if (/nežije/.test(q)) {
      return {
        kind: "seznam",
        ok: CIZI.has(key) && distraktory.every((d) => AUS.has(d)),
        detail: `klíč ${key}, distraktory ${distraktory.join("/")}`,
      };
    }
    return {
      kind: "seznam",
      ok: AUS.has(key) && distraktory.every((d) => CIZI.has(d)),
      detail: `klíč ${key}, distraktory ${distraktory.join("/")}`,
    };
  }

  // faktická tabulka: pravidlu vyhoví právě jedna možnost a je to klíč
  for (const [rq, pred] of FAKTA) {
    if (rq.test(q)) {
      const vyhovuje = opts.filter(pred);
      return {
        kind: "fakt",
        ok: vyhovuje.length === 1 && vyhovuje[0] === key,
        detail: `pravidlo ${rq}; vyhovuje: ${vyhovuje.join(" | ")}`,
      };
    }
  }
  return null;
}

const levels = [1, 2, 3] as const;
const vzorky = Object.fromEntries(
  levels.map((l) => [l, [11, 22, 33, 44, 55, 66, 77, 88].flatMap((s) => withSeed(s, () => topic.generator(l)))]),
) as Record<1 | 2 | 3, PracticeTask[]>;

describe("Austrálie a Oceánie — příroda: metadata", () => {
  it("zeměpis g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-zem-priroda-endemity-velky-barierovy-utes-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Regiony světa");
    expect(topic.topic).toBe("Austrálie a Oceánie");
    expect(topic.rvpNodeId).toBe(
      "g6-zemepis-regiony-sveta-australie-a-oceanie-priroda-endemity-velky-barierovy-utes",
    );
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(levels)("Austrálie a Oceánie — L%i", (level) => {
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
      expect(t.optionFeedback?.[t.correctAnswer], t.question).toBeUndefined();
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

  it("žádná mapa ani obrázek, žádná přesná čísla, žádné Ano/Ne", () => {
    for (const t of tasks) {
      const cely = [t.question, ...(t.options ?? []), t.explanation ?? ""].join(" ");
      expect(t.question).not.toMatch(/na mapě|na mapu|na obrázk|podívej se/i);
      expect(cely, t.question).not.toMatch(/\d/);
      if (level > 1) {
        for (const o of t.options!) expect(o, t.question).not.toMatch(/^(ano|ne)$/i);
      }
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
    const prvni = (s: string) => s.split(/\s+/)[0].toLowerCase().replace(/[.,—]/g, "");
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

  it("žádná úloha nemíchá typy — všechny mají options", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toBeTruthy();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
    }
  });
});

describe("Austrálie a Oceánie — gradace a znění", () => {
  const znění = (l: 1 | 2 | 3) => new Set(vzorky[l].map((t) => t.question));

  it("L1 jsou přímé krátké otázky bez příčinné vazby", () => {
    for (const t of vzorky[1]) {
      expect(t.question, t.question).toMatch(/^(Co|Kde|Který|Které|Jak|Jaké|Na které|Mezi kterými|V jakém|Čím)/);
      expect(t.question.length, `L1 je příliš dlouhá: ${t.question}`).toBeLessThan(90);
      expect(t.question, t.question).not.toMatch(/^Proč/);
    }
  });

  it("L2 je příčina → následek: každá otázka má vazbu (proč / co z toho plyne / jaký důvod / zařazení)", () => {
    for (const t of vzorky[2]) {
      expect(
        t.question,
        `L2 bez příčinné vazby: ${t.question}`,
      ).toMatch(/Proč|Co (to způsobilo|z toho plyne|se stane)|důvod|Jak (vzniká|se zachrání)|Do které skupiny|V jaké krajině|Podle čeho/);
    }
  });

  it("L3 je popis, zpráva, případ nebo úkol — nová situace", () => {
    for (const t of vzorky[3]) {
      expect(t.question, t.question).toMatch(/^(Popis zvířete|Popis místa|Popis oblasti|Zpráva|Zpráva potápěčů|Případ|Úkol):/);
    }
  });

  it("znění jednotlivých úrovní jsou navzájem disjunktní", () => {
    const [a, b, c] = [znění(1), znění(2), znění(3)];
    expect([...a].filter((q) => b.has(q) || c.has(q))).toEqual([]);
    expect([...b].filter((q) => c.has(q))).toEqual([]);
  });

  it("L3 znění nesdílí s L1 dlouhé shodné začátky", () => {
    const zacatek = (q: string) => q.slice(0, 25);
    const l1 = new Set(vzorky[1].map((t) => zacatek(t.question)));
    for (const t of vzorky[3]) expect(l1.has(zacatek(t.question)), t.question).toBe(false);
  });

  it("L3 obsahuje všechny druhy úloh: zvíře, útes, oblast, příčina, případ", () => {
    const kinds = new Set(vzorky[3].map((t) => solve(t)?.kind));
    for (const k of ["zvire", "utes", "oblast", "fakt"]) expect(kinds, `chybí ${k}`).toContain(k);
  });

  it("L1 obsahuje seznamy zvířat i faktické otázky", () => {
    const kinds = new Set(vzorky[1].map((t) => solve(t)?.kind));
    expect(kinds).toContain("seznam");
    expect(kinds).toContain("fakt");
  });

  it("distraktory L3 mají typické chyby (bělení: záměna směru; dovezené druhy: velikost/jed/křížení)", () => {
    const belení = vzorky[3].filter((t) => /^Zpráva/.test(t.question));
    expect(belení.length).toBeGreaterThan(0);
    for (const t of belení) {
      expect(t.options!.some((o) => /ochladila/.test(o)), t.question).toBe(true);
      expect(t.options!.some((o) => /málo slunce/.test(o)), t.question).toBe(true);
    }
  });
});

/**
 * Sezení = prvních `sessionTaskCount` úloh poolu. Hlídá se to, co zamíchání
 * celého poolu neřeší: aby se v šestici nesešly úlohy řešitelné stejným
 * vyloučením.
 */
describe("Austrálie a Oceánie — skladba sezení", () => {
  const KOLIK = topic.sessionTaskCount!;
  const seedy = Array.from({ length: 40 }, (_, i) => i * 7 + 3);
  const sezeni = (level: 1 | 2 | 3, seed: number) =>
    withSeed(seed, () => topic.generator(level)).slice(0, KOLIK);
  const kolikrat = (tasks: PracticeTask[], r: RegExp) => tasks.filter((t) => r.test(t.question)).length;

  it("L1: nejvýš jedna úloha „který z těchto živočichů“", () => {
    for (const s of seedy) {
      expect(kolikrat(sezeni(1, s), /^Který z těchto živočichů/), `seed ${s}`).toBeLessThanOrEqual(1);
    }
  });

  it("L1: nejvýš dvě otázky o útesu", () => {
    for (const s of seedy) {
      expect(kolikrat(sezeni(1, s), /Velký bariérový útes/), `seed ${s}`).toBeLessThanOrEqual(2);
    }
  });

  it("L2: nejvýš dvě úlohy o podmínkách útesu, jedna o izolaci", () => {
    for (const s of seedy) {
      const t = sezeni(2, s);
      expect(kolikrat(t, /útes|Koráli|korálový/i), `seed ${s}`).toBeLessThanOrEqual(2);
      expect(kolikrat(t, /oddělená od ostatních|jen v Austrálii/), `seed ${s}`).toBeLessThanOrEqual(1);
    }
  });

  it("L3: žádné dvě úlohy se stejnou správnou odpovědí (stejný klíč = táž úloha podruhé)", () => {
    for (const s of seedy) {
      const klice = sezeni(3, s).map((t) => t.correctAnswer);
      expect(new Set(klice).size, `seed ${s}: ${klice.join(" | ")}`).toBe(klice.length);
    }
  });

  it("L3: nejvýš dva popisy zvířat a dvě úlohy o útesu", () => {
    for (const s of seedy) {
      const t = sezeni(3, s);
      expect(kolikrat(t, /^Popis zvířete/), `seed ${s}`).toBeLessThanOrEqual(2);
      expect(kolikrat(t, /^Popis místa|útes|útesu|korálů/i), `seed ${s}`).toBeLessThanOrEqual(2);
    }
  });
});

describe("Austrálie a Oceánie — determinismus a pokrytí", () => {
  it("gen() je deterministický a bez stavu modulu", () => {
    const otisk = () =>
      JSON.stringify(levels.map((l) => topic.generator(l).map((t) => [t.question, t.correctAnswer])));
    const a = withSeed(123, otisk);
    Math.random();
    Math.random();
    const b = withSeed(123, otisk);
    expect(b).toBe(a);
  });

  it("přes mnoho volání se objeví všechna čtyři australská zvířata jako klíč L3 popisů", () => {
    const klice = new Set(vzorky[3].filter((t) => /^Popis zvířete/.test(t.question)).map((t) => t.correctAnswer));
    for (const z of ["klokan", "koala", "emu", "ptakopysk"]) expect(klice, `chybí ${z}`).toContain(z);
  });
});
