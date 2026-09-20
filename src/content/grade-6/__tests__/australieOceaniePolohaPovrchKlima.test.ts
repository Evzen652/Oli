import { describe, it, expect } from "vitest";
import { AUSTRALIE_OCEANIE_POLOHA_POVRCH_KLIMA } from "../zemepis/australieOceaniePolohaPovrchKlima";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Austrálie a Oceánie — poloha, povrch, klima (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nezávislá na datových bankách generátoru):
 *  1. Souřadnice: solver vyparsuje šířku a délku ze ZNĚNÍ otázky (regex na
 *     „24° j. š., 134° v. d.“), sám zařadí bod do oblasti podle vlastních
 *     rozsahů (vlastní tabulka testu, ne tabulka generátoru) a porovná s klíčem.
 *     Zároveň ověří, že popis podnebí v zadání (klasifikátor klíčových slov)
 *     neodporuje oblasti a že žádný distraktor nesplňuje stejný test.
 *  2. „Nejřidčeji osídlené“: solver zařadí všechny čtyři body a vybere ten,
 *     který leží ve vnitrozemí.
 *  3. Porovnání dvou míst: solver z obou bodů složí očekávaný klíč a ověří, že
 *     žádný distraktor tvrdí totéž.
 *  4. Chybné tvrzení: vlastní tabulka pravdivých a nepravdivých tvrzení.
 *  5. Roční doby: solver z měsíce a písmen za šířkou odvodí očekávané období.
 *  6. Podnebí ze šířky a bod na jižní polokouli / ve východní délce.
 *  7. Fakta L1/L2: vlastní tabulka vlastností, které klíč musí splňovat.
 *  8. Strukturální kontroly (4 možnosti, délka klíče, feedback, nápovědy,
 *     disjunktní znění L1 × L3, determinismus).
 */
const topic = AUSTRALIE_OCEANIE_POLOHA_POVRCH_KLIMA[0];

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

// ── vlastní tabulka oblastí (zdroj pravdy testu) ──────────────────────────

type Obl = "sever" | "vnit" | "jv" | "jz" | "nz";

/** Rozsahy záměrně širší než rozsahy generátoru — solver nesdílí jeho čísla. */
const BOXY: [Obl, [number, number], [number, number]][] = [
  ["sever", [10, 18], [120, 145]],
  ["vnit", [20, 30], [122, 142]],
  ["jv", [32, 39], [143, 153]],
  ["jz", [30, 36], [112, 120]],
  ["nz", [36, 46], [165, 178]],
];

const NAZEV: Record<Obl, string> = {
  sever: "tropický sever",
  vnit: "suché vnitrozemí",
  jv: "jihovýchodní pobřeží",
  jz: "jihozápadní pobřeží",
  nz: "ostrovy Nového Zélandu",
};

const PODNEBI_OBL: Record<Exclude<Obl, "nz">, string> = {
  sever: "horké tropické s obdobím dešťů",
  vnit: "suché s pouštěmi",
  jv: "mírné a vlhčí",
  jz: "mírné se suchým létem",
};

interface Souradnice {
  lat: number; // záporně = jih
  lon: number; // záporně = západ
}

const RE_SOUR = /(\d+)°\s*([js])\.\s*š\.,\s*(\d+)°\s*([vz])\.\s*d\./g;

function parseVsechny(text: string): Souradnice[] {
  const out: Souradnice[] = [];
  for (const m of text.matchAll(RE_SOUR)) {
    out.push({
      lat: (m[2] === "j" ? -1 : 1) * Number(m[1]),
      lon: (m[4] === "z" ? -1 : 1) * Number(m[3]),
    });
  }
  return out;
}

function oblast(s: Souradnice): Obl | null {
  if (s.lat >= 0) return null; // vše v tématu je na jihu
  const hits = BOXY.filter(
    ([, [a, z], [la, lz]]) => -s.lat >= a && -s.lat <= z && s.lon >= la && s.lon <= lz,
  ).map(([o]) => o);
  return hits.length === 1 ? hits[0] : null;
}

/** Popis podnebí v zadání → oblasti, se kterými se nesnese (klasifikátor klíčových slov). */
function popisOdporuje(text: string, o: Obl): boolean {
  const ukazuje: [RegExp, Obl][] = [
    [/období dešťů|silné deště/, "sever"],
    [/velmi málo srážek|prší velmi málo/, "vnit"],
    [/rozložené do celého roku|prší po celý rok/, "jv"],
    [/léto je teplé a suché|téměř neprší/, "jz"],
  ];
  const zasah = ukazuje.filter(([r]) => r.test(text)).map(([, x]) => x);
  return zasah.length > 0 && !zasah.includes(o);
}

// ── tabulka pravdivých / nepravdivých tvrzení (D) ─────────────────────────

const TVRZENI_PRAVDA: RegExp[] = [
  /^Nejtepleji je na severu Austrálie, protože leží nejblíž k rovníku$/,
  /^V prosinci je v Austrálii léto, protože jižní polokoule je tehdy nakloněná ke Slunci$/,
  /^Vnitrozemí je suché mimo jiné proto, že vlhký vítr od oceánu zadrží pohoří na východě$/,
  /^Nejvíc lidí bydlí na jihovýchodním pobřeží, protože tam prší dost/,
  /^Austrálie je světadíl i stát, protože celou pevninu zabírá jediný stát$/,
  /^Do Oceánie patří Nový Zéland i Fidži, protože/,
  /^Austrálie leží na jižní polokouli, protože celá leží jižně od rovníku$/,
  /^Východní svahy pohoří jsou vlhčí/,
];
const TVRZENI_CHYBA: RegExp[] = [
  /^Nejchladněji je na severu Austrálie/,
  /^V prosinci je v Austrálii zima/,
  /^Vnitrozemí Austrálie je suché, protože je tam celoročně zima$/,
  /^Austrálie je jen stát v Asii/,
  /^Oceánie leží v Atlantském oceánu/,
  /^Austrálie leží na severní polokouli/,
  /^Velké předělové pohoří leží na západě/,
  /^Nejvíc lidí bydlí ve vnitrozemí/,
];

// ── tabulka faktů L1 a L2: znění otázky → vlastnost klíče ────────────────

type Pravidlo = [RegExp, (key: string) => boolean];
const vse = (...rs: RegExp[]) => (key: string) => rs.every((r) => r.test(key));

const FAKTA: Pravidlo[] = [
  // L1
  [/^Kde leží Austrálie\?/, vse(/jižní polokouli/, /Indickým a Tichým/)],
  [/^Co je Austrálie\?/, vse(/světadíl/, /stát/)],
  [/nejmenší\?/, vse(/^Austrálie$/)],
  [/^Co tvoří Oceánii/, vse(/tisíce ostrovů/, /Tichém/)],
  [/^Který z uvedených států leží v Oceánii/, vse(/^Papua-Nová Guinea$/)],
  [/^Kde leží ostrovní stát Nový Zéland/, vse(/Tichém/, /jihovýchodně/)],
  [/^Jak vypadá povrch ve vnitrozemí/, vse(/suchá/, /pouště/)],
  [/^Jak se jmenuje pohoří na východě/, vse(/^Velké předělové pohoří$/)],
  [/nejtepleji\?/, vse(/^na severu$/)],
  [/o Vánocích/, vse(/^léto$/)],
  [/leží na východ od Austrálie/, vse(/^Tichý oceán$/)],
  [/leží na západ od Austrálie/, vse(/^Indický oceán$/)],
  [/^Jaké podnebí je na severu/, vse(/tropické/, /dešťů/)],
  [/^Kde v Austrálii bydlí většina/, vse(/pobřeží/, /východě/)],
  [/^Kde leží ostrovní stát Fidži/, vse(/Tichém/, /Oceánii/)],
  // L2
  [/^Proč je vnitrozemí Austrálie suché/, vse(/Vlhký vítr/, /pohoří/)],
  [/^Proč bydlí většina Australanů/, vse(/Prší tam dost/, /mírné/)],
  [/^V Sydney je v lednu horko/, vse(/jižní polokouli/, /obrácené/)],
  [/^Vnitrozemí Austrálie je suché a vody je málo/, vse(/řídké/)],
  [/^Proč jsou v Austrálii roční doby obrácené/, vse(/osa je nakloněná/, /jižní polokoule/)],
  [/^Oceánii tvoří tisíce ostrovů/, vse(/lodí nebo letadlem/)],
];

// ── solver ─────────────────────────────────────────────────────────────────

type Vysledek = { kind: string; ok: boolean; detail?: string };

function solve(t: PracticeTask): Vysledek | null {
  const q = t.question;
  const key = t.correctAnswer;
  const opts = t.options!;
  const dist = opts.filter((o) => o !== key);

  // A) poznej oblast
  if (/^Které oblasti Austrálie odpovídá|^Meteorolog hlásí/.test(q)) {
    const s = parseVsechny(q)[0];
    if (!s) return { kind: "oblast", ok: false, detail: "souřadnice se nedaly vyparsovat" };
    const o = oblast(s);
    if (!o) return { kind: "oblast", ok: false, detail: "bod nepatří do žádné oblasti" };
    const jen = key === NAZEV[o] && dist.every((d) => d !== NAZEV[o]);
    const popisOk = !popisOdporuje(q, o);
    // žádný distraktor nesmí být oblast, do které bod patří
    return { kind: "oblast", ok: jen && popisOk, detail: `bod → ${o}, popis nesouhlasí: ${!popisOk}` };
  }

  // B) nejřidčeji osídlené
  if (/nejřidčeji osídlené/.test(q)) {
    const oblasti = opts.map((o) => {
      const s = parseVsechny(o)[0];
      return s ? oblast(s) : null;
    });
    if (oblasti.includes(null)) return { kind: "osidleni", ok: false, detail: "bod mimo oblast" };
    const vnitIdx = oblasti.filter((o) => o === "vnit");
    const klicObl = oblast(parseVsechny(key)[0]);
    return {
      kind: "osidleni",
      ok: new Set(oblasti).size === 4 && vnitIdx.length === 1 && klicObl === "vnit",
      detail: `oblasti ${oblasti.join(",")}`,
    };
  }

  // C) porovnání dvou míst
  if (/^Porovnej dvě místa/.test(q)) {
    const [a, b] = parseVsechny(q).map(oblast);
    if (!a || !b || a === "nz" || b === "nz" || a === b) return { kind: "porovnani", ok: false, detail: "oblasti" };
    const ocek = `Obě místa leží na jižní polokouli; první má podnebí ${PODNEBI_OBL[a]}, druhé podnebí ${PODNEBI_OBL[b]}`;
    const dalsiSpravna = dist.some((d) => d === ocek);
    // distraktor, který tvrdí jižní polokouli i správné podnebí prvního i druhého, by byl druhá správná
    const tvrdiTotez = dist.some(
      (d) => /^Obě místa leží na jižní polokouli/.test(d) && d.includes(`první má podnebí ${PODNEBI_OBL[a]}, druhé podnebí ${PODNEBI_OBL[b]}`),
    );
    return { kind: "porovnani", ok: key === ocek && !dalsiSpravna && !tvrdiTotez };
  }

  // D) chybné tvrzení
  if (/je chybné\?/.test(q)) {
    const klicChybny = TVRZENI_CHYBA.some((r) => r.test(key)) && !TVRZENI_PRAVDA.some((r) => r.test(key));
    const dObePravdive = dist.every((d) => TVRZENI_PRAVDA.some((r) => r.test(d)) && !TVRZENI_CHYBA.some((r) => r.test(d)));
    return { kind: "chyba", ok: klicChybny && dObePravdive, detail: `klíč „${key}“` };
  }

  // E) kde bude v daném měsíci tepleji — Česko, nebo Austrálie
  if (/^Které ze dvou míst bude mít/.test(q)) {
    const [cz, au] = parseVsechny(q);
    const mesic = q.match(/bude mít v (\S+) průměrně tepleji/)![1];
    const czZima = ["prosinci", "lednu", "únoru"].includes(mesic);
    // roční doba v Česku podle měsíce, v Austrálii opačně (jižní polokoule)
    const teplejsiPrvni = !czZima; // v Česku léto → první (CZ) je teplejší
    const jihOk = cz.lat > 0 && au.lat < 0 && oblast(au) !== null;
    const ocek = teplejsiPrvni ? /^První místo/ : /^Druhé místo/;
    const opak = teplejsiPrvni ? /^Druhé místo/ : /^První místo/;
    const klicOk =
      ocek.test(key) &&
      new RegExp(`v ${mesic}`).test(key) &&
      (czZima ? /v Česku zima/.test(key) && /léto/.test(key) : /v Česku léto/.test(key) && /zima/.test(key));
    // žádný distraktor nesmí tvrdit totéž (stejné místo jako klíč)
    const dalsi = dist.some((d) => ocek.test(d));
    const opakJsou = dist.filter((d) => opak.test(d)).length;
    return { kind: "doby", ok: jihOk && klicOk && !dalsi && opakJsou === 2 };
  }

  // L2: podnebí ze šířky
  if (/^Které podnebí čekáš na pobřeží Austrálie/.test(q)) {
    const m = q.match(/(\d+)° j\. š\./)!;
    const lat = Number(m[1]);
    const kw = lat <= 18 ? /tropické/ : /^mírné/;
    const ostatniKw = dist.filter((d) => kw.test(d));
    return {
      kind: "podnebi",
      ok: kw.test(key) && ostatniKw.length === 0 && (lat <= 18 || lat >= 33),
      detail: `šířka ${lat}`,
    };
  }

  // L2: bod na jihu a ve východní délce
  if (/na jižní polokouli a (zároveň )?ve východní délce/.test(q)) {
    const body = opts.map((o) => {
      const m = o.match(/(\d+)° ([js])\. š\., (\d+)° ([vz])\. d\./);
      return m ? { jih: m[2] === "j", vych: m[4] === "v" } : null;
    });
    if (body.includes(null)) return { kind: "bod", ok: false };
    const spl = body.filter((b) => b!.jih && b!.vych).length;
    const kb = key.match(/(\d+)° ([js])\. š\., (\d+)° ([vz])\. d\./)!;
    return { kind: "bod", ok: spl === 1 && kb[2] === "j" && kb[4] === "v" };
  }

  // fakta
  for (const [r, pred] of FAKTA) {
    if (r.test(q)) return { kind: "fakt", ok: pred(key), detail: `pravidlo ${r}` };
  }
  return null;
}

const levels = [1, 2, 3] as const;
const vzorky = Object.fromEntries(
  levels.map((l) => [l, [11, 22, 33, 44, 55, 66, 77].flatMap((s) => withSeed(s, () => topic.generator(l)))]),
) as Record<1 | 2 | 3, PracticeTask[]>;

describe("Austrálie a Oceánie — metadata", () => {
  it("zeměpis g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-zem-australie-oceanie-poloha-povrch-klima-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Regiony světa");
    expect(topic.topic).toBe("Austrálie a Oceánie");
    expect(topic.rvpNodeId).toBe(
      "g6-zemepis-regiony-sveta-australie-a-oceanie-australie-a-oceanie-poloha-povrch-klima",
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

  it("nápověda neobsahuje obecnou větu, která se k úloze nehodí", () => {
    for (const t of tasks) {
      for (const h of t.hints!) {
        expect(h, t.question).not.toMatch(/Vylučuj možnosti, které odporují|Nakonec zkontroluj, jestli výsledek|Dej pozor na jednotky/);
      }
      expect(t.hints![1].length, `hint 2 není delší: ${t.question}`).toBeGreaterThanOrEqual(t.hints![0].length * 1.2);
    }
  });

  it("žádná mapa ani obrázek", () => {
    for (const t of tasks) {
      expect(t.question).not.toMatch(/na mapě|na mapu|na obrázk|podívej se/i);
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

  it("žádné rodové lomítkové tvary ani nedokončené věty", () => {
    for (const t of tasks) {
      const cely = [t.question, ...(t.options ?? []), t.explanation ?? "", ...(t.hints ?? [])].join(" ");
      expect(cely, t.question).not.toMatch(/\b\w+\/\w+a\b/);
      expect(cely, t.question).not.toMatch(/undefined|NaN|\$\{/);
      expect(cely, `zdvojená tečka: ${t.question}`).not.toMatch(/\.\./);
    }
  });
});

describe("Austrálie a Oceánie — L3 souřadnicová linka", () => {
  it("oblast: klíč vychází ze souřadnic, ne z popisu (nejasné popisy se objeví)", () => {
    const oblasti = vzorky[3].filter((t) => solve(t)?.kind === "oblast");
    expect(oblasti.length).toBeGreaterThan(5);
    const nejasne = oblasti.filter((t) => /většinu roku je horko|léto je teplé a zima mírná/.test(t.question));
    expect(nejasne.length).toBeGreaterThan(0);
    // nejasný popis sedí na dvě oblasti: klíč musí rozhodnout souřadnice
    for (const t of nejasne) {
      const o = oblast(parseVsechny(t.question)[0]);
      expect(t.correctAnswer, t.question).toBe(NAZEV[o!]);
    }
  });

  it("všechny čtyři oblasti se objeví jako klíč", () => {
    const klice = new Set(
      vzorky[3].filter((t) => solve(t)?.kind === "oblast").map((t) => t.correctAnswer),
    );
    for (const o of ["sever", "vnit", "jv", "jz"] as Obl[]) expect(klice).toContain(NAZEV[o]);
  });

  it("feedback u oblasti jmenuje skutečný rozpor souřadnic", () => {
    for (const t of vzorky[3].filter((x) => solve(x)?.kind === "oblast")) {
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], t.question).toMatch(/leží zhruba mezi \d+° a \d+° [jv]\. [šd]\./);
      }
    }
  });

  it("souřadnice L3 jsou z ověřených bodů: každý spadá do právě jedné oblasti (i v distraktorech)", () => {
    for (const t of vzorky[3]) {
      const cely = [t.question, ...t.options!].join(" ");
      for (const s of parseVsechny(cely)) {
        if (s.lat > 0) continue; // Česko v úloze „kde je tepleji"
        expect(oblast(s), `${s.lat}, ${s.lon} v: ${t.question}`).not.toBeNull();
      }
    }
  });

  it("sezení L3 obsahuje všech pět šablon", () => {
    for (let s = 1; s <= 30; s++) {
      const sezeni = withSeed(s, () => topic.generator(3)).slice(0, topic.sessionTaskCount!);
      const druhy = new Set(sezeni.map((t) => solve(t)!.kind));
      expect(druhy.size, `seed ${s}: ${[...druhy].join(",")}`).toBe(5);
    }
  });
});

describe("Austrálie a Oceánie — L2 linky", () => {
  it("L2 obsahuje faktickou, podnební i souřadnicovou úlohu", () => {
    const jedno = withSeed(7, () => topic.generator(2));
    const druhy = jedno.map((t) => solve(t)!.kind);
    expect(druhy).toContain("fakt");
    expect(druhy).toContain("podnebi");
    expect(druhy).toContain("bod");
  });

  it("podnebí ze šířky: oba pásy se objeví a solutionSteps mají tři kroky", () => {
    const p = vzorky[2].filter((t) => solve(t)?.kind === "podnebi");
    expect(p.length).toBeGreaterThan(2);
    expect(new Set(p.map((t) => t.correctAnswer)).size).toBe(2);
    for (const t of p) expect(t.solutionSteps!.length).toBe(3);
  });

  it("solutionSteps mají jen výpočetní linky L2", () => {
    for (const t of [...vzorky[1], ...vzorky[2], ...vzorky[3]]) {
      const k = solve(t)?.kind;
      if (k !== "podnebi" && k !== "bod") expect(t.solutionSteps, t.question).toBeUndefined();
    }
  });
});

describe("Austrálie a Oceánie — gradace a determinismus", () => {
  it("L1 se ptá na jeden fakt; L1 a L3 mají disjunktní znění", () => {
    for (const t of vzorky[1]) {
      expect(t.question, t.question).toMatch(/^(Co|Kde|Který|Jak|Ve které|Jaké)/);
      expect(t.question.length, `L1 je příliš dlouhá: ${t.question}`).toBeLessThan(80);
    }
    const l1 = new Set(vzorky[1].map((t) => t.question));
    expect(vzorky[3].filter((t) => l1.has(t.question))).toEqual([]);
    const l2 = new Set(vzorky[2].map((t) => t.question));
    expect(vzorky[3].filter((t) => l2.has(t.question))).toEqual([]);
  });

  it("L3 je přenos: nikdy prosté „Kde leží / Co je“", () => {
    for (const t of vzorky[3]) {
      expect(t.question, t.question).toMatch(/^(Které|Meteorolog|Porovnej|Rodina)/);
    }
  });

  it("L3 je delší a složitější než L1 (průměrná délka zadání)", () => {
    const prum = (a: PracticeTask[]) => a.reduce((s, t) => s + t.question.length, 0) / a.length;
    expect(prum(vzorky[3])).toBeGreaterThan(prum(vzorky[1]) * 1.5);
  });

  it("žádná úloha nemíchá typy — všechny mají options", () => {
    for (const t of [...vzorky[1], ...vzorky[2], ...vzorky[3]]) {
      expect(t.options, t.question).toBeTruthy();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
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
