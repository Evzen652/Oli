import { describe, it, expect } from "vitest";
import { AFRIKA_POLOHA_POVRCH_VODSTVO_PODNEBI } from "../zemepis/afrikaPolohaPovrchVodstvoPodnebi";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Afrika — poloha, povrch, vodstvo, podnebí (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nezávislá na datových bankách generátoru).
 * Test si drží vlastní tabulku faktů z atlasu:
 *  1. Poloha prvků (Atlas, Drakensberky, Etiopská vysočina, Viktoriino jezero)
 *     jako zeměpisné souřadnice. Světovou stranu v Africe solver dopočítá sám
 *     (střed Afriky ~ 0° s. š., 20° v. d.) a porovná s klíčem — generátor s ní
 *     pracuje jen jako s hotovým textem.
 *  2. Podnebný pás podle šířky: solver vyparsuje „X° s./j. š.“ ze znění a sám
 *     spočítá |šířka| → rovníkový (do 5°) / subekvatoriální (do 15°) / tropický
 *     (do 30°) / subtropický.
 *     Kontroluje i polokouli podle písmene a mezikrok v `solutionSteps`.
 *  3. Popisy podnebí slovy klasifikuje klíčovými slovy (liják, dvě období,
 *     zima) a porovná s pásem, do kterého padne šířka klíčové souřadnice.
 *     Zároveň ověří, že žádný distraktor do téhož pásu nepatří.
 *  4. Let po poledníku: solver vyparsuje obě šířky a sám určí, které z čar
 *     (−23,5°, 0°, +23,5°) leží mezi nimi, a porovná s klíčem i distraktory.
 *  5. Směr toku Nilu z šířky pramene a ústí.
 *  6. Faktické úlohy: vlastní tabulka vlastností, které klíč musí splňovat.
 *  7. Strukturální kontroly (4 možnosti, délka klíče, feedback, nápovědy,
 *     disjunktní znění L1 × L3, determinismus, skladba sezení).
 */
const topic = AFRIKA_POLOHA_POVRCH_VODSTVO_PODNEBI[0];

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

// ── 1. poloha prvků v Africe (vlastní zdroj pravdy testu) ──────────────────

const STRED = { lat: 0, lon: 20 };
/** [zeměpisná šířka, délka] přibližně, podle školního atlasu. */
const POLOHA: Record<string, [number, number]> = {
  "pohoří Atlas": [32, -5],
  Drakensberky: [-29, 29],
  "Etiopská vysočina": [9, 39],
  "Viktoriino jezero": [-1, 33],
};

function svetovaStrana([lat, lon]: [number, number]): string {
  const ew = lon < STRED.lon ? "západě" : "východě";
  if (Math.abs(lat) < 8) return `na ${ew}`;
  return `na ${lat > 0 ? "severo" : "jiho"}${ew}`;
}

// ── 2. podnebné pásy podle šířky ───────────────────────────────────────────

type Pas = "eq" | "se" | "tr" | "sub";
const PORADI: Pas[] = ["eq", "se", "tr", "sub"];
const PAS_ZE_SIRKY = (st: number): Pas => (st < 5 ? "eq" : st < 15 ? "se" : st < 30 ? "tr" : "sub");
const NAZEV_PASU: Record<Pas, string> = {
  eq: "rovníkový pás",
  se: "subekvatoriální pás",
  tr: "tropický pás",
  sub: "subtropický pás",
};
const V_PASU: Record<Pas, string> = {
  eq: "v rovníkovém pásu",
  se: "v subekvatoriálním pásu",
  tr: "v tropickém pásu",
  sub: "v subtropickém pásu",
};

/** Šířka se znaménkem (jih záporně) — první výskyt v textu. */
function parseSirka(q: string): number | null {
  const m = q.match(/(\d+)°\s*([js])\.\s*š\./);
  if (!m) return null;
  return (m[2] === "j" ? -1 : 1) * Number(m[1]);
}
function vsechnySirky(q: string): number[] {
  return [...q.matchAll(/(\d+)°\s*([js])\.\s*š\./g)].map((m) => (m[2] === "j" ? -1 : 1) * Number(m[1]));
}
/** Šířka ze zápisu možnosti typu „3° s. š., 22° v. d.“. */
const sirkaMoznosti = (o: string): number | null => parseSirka(o);

// ── 3. popisy podnebí slovy ────────────────────────────────────────────────

function klasifikujPopis(text: string): Pas[] {
  const out: Pas[] = [];
  if (/liják|deště v každém měsíci|bouřky|žádné suché/i.test(text)) out.push("eq");
  if (/dvě období|půl roku téměř neprší/i.test(text)) out.push("se");
  if (/srážky jen výjimečně|extrémní sucho/i.test(text)) out.push("tr");
  if (/zim/i.test(text)) out.push("sub");
  return out;
}

// ── 4. čáry zeměpisné sítě ─────────────────────────────────────────────────

const CARY_TEST: [string, number][] = [
  ["obratník Kozoroha", -23.5],
  ["rovník", 0],
  ["obratník Raka", 23.5],
];

function nazvyCarUMoznosti(o: string): string[] {
  return CARY_TEST.filter(([n]) => o.includes(n)).map(([n]) => n);
}

// ── 5. tabulka faktů: znění otázky → vlastnost, kterou klíč musí splnit ────

type Pravidlo = [RegExp, (key: string, t: PracticeTask) => boolean];
const vse = (...rs: RegExp[]) => (key: string) => rs.every((r) => r.test(key));

const FAKTA: Pravidlo[] = [
  // L1
  [/omývá Afriku na západě/, vse(/^Atlantský oceán$/)],
  [/omývá Afriku na východě/, vse(/^Indický oceán$/)],
  [/Suezská šíje/, vse(/^s Asií$/)],
  [/odděluje Afriku od Evropy\?/, vse(/^Středozemní moře$/)],
  [/odděluje Afriku od Asie na severovýchodě/, vse(/^Rudé moře$/)],
  [/Kterou částí Afriky prochází rovník/, vse(/^prostředkem světadílu/)],
  [/obratník protíná sever Afriky/, vse(/^obratník Raka$/)],
  [/obratník protíná jih Afriky/, vse(/^obratník Kozoroha$/)],
  [/^Co je Sahara/, vse(/největší horká poušť/, /na severu Afriky/)],
  [/řeka Nil\?$/, vse(/^do Středozemního moře$/)],
  [/Ve které části Afriky teče řeka Kongo/, vse(/^na obou stranách rovníku/)],
  [/nejvyšší hora Afriky/, vse(/^Kilimandžáro$/)],
  [/Co je Nilská delta/, vse(/úrodná rovina/, /Nil/)],
  [/Jaké je pobřeží Afriky/, vse(/^málo členité/)],
  // L2
  [/celoročně horko a vlhko\?/, vse(/Slunce/, /vysoko/, /vypařuje/)],
  [/největší pouště Afriky v okolí obratníků/, vse(/vzduch tam klesá/i, /neprší/)],
  [/Která velká řeka teče přes Saharu/, vse(/^Nil$/)],
  [/řeka Kongo vody dost/, vse(/rovníkovou oblastí/, /prší/)],
  [/zlom zemské kůry/, vse(/^Východoafrický příkop$/)],
  [/Kudy může cestu zkrátit/, vse(/Suezskou šíji/, /Středozemního do Rudého moře/)],
  [/severní pobřeží u Středozemního moře a nejjižnější cíp/, vse(/^subtropický pás$/)],
  [/navazuje na rovníkový pás/, vse(/^subekvatoriální pás$/)],
  [/málo členité pobřeží, jen málo zálivů/, vse(/přístavů je málo/i, /daleko od moře/)],
  // L3 — případy
  [/vrchol hory ve východní Africe pokrytý sněhem/, vse(/S výškou přibývá chladu/)],
  [/poušť Namib leží těsně u Atlantského oceánu/, vse(/obratníku/, /vzduch klesá/, /Benguelský/)],
  [/Rodina z Česka letí na Vánoce/, vse(/^Léto/, /jižní polokoule/, /opačné/)],
  [/nejteplejším místům světa/, vse(/mezi obratníky/, /vysoko/)],
  [/Nil pramení v oblastech blízko rovníku/, vse(/Pramení u rovníku/, /víc vody, než poušť vypaří/)],
  // L3 — chybná tvrzení
  [/nejblíž ke Slunci/, vse(/Vzdálenost od Slunce nerozhoduje/, /vysoké Slunce/)],
  [/Na rovníku prší málo/, vse(/stoupá/, /tvoří mraky/, /prší hodně/)],
  [/Místo na 12° s. š. leží v rovníkovém pásu/, vse(/sahá jen asi 5°/, /subekvatoriální/)],
  [/Největší pouště leží u rovníku/, vse(/obratníků/, /klesá/, /stoupá/)],
];

const HORY_RE = /^(Ve které části Afriky leží|Kde leží) (pohoří Atlas|pohoří Drakensberky|Viktoriino jezero|Etiopská vysočina)/;

type Vysledek = { kind: string; ok: boolean; detail?: string };

function solve(t: PracticeTask): Vysledek | null {
  const q = t.question;
  const key = t.correctAnswer;
  const opts = t.options!;
  const distraktory = opts.filter((o) => o !== key);

  // Nil — směr toku z šířek pramene a ústí
  if (/Nil pramení asi na/.test(q)) {
    const [s0, s1] = vsechnySirky(q);
    const smer = s1 > s0 ? "na sever" : "na jih";
    const ok = key.startsWith(smer) && (smer !== "na sever" || /Středozemního/.test(key)) && distraktory.every((d) => !d.startsWith(smer));
    return { kind: "nil", ok, detail: `pramen ${s0}, ústí ${s1} → ${smer}` };
  }

  // Let: čáry sítě mezi dvěma šířkami
  if (/^Letadlo vzlétlo/.test(q)) {
    const [a, b] = vsechnySirky(q);
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const spravne = CARY_TEST.filter(([, lat]) => lat > lo && lat < hi).map(([n]) => n);
    const setKey = nazvyCarUMoznosti(key).sort().join("|");
    const setSpr = [...spravne].sort().join("|");
    const jinaMnozina = distraktory.every((d) => nazvyCarUMoznosti(d).sort().join("|") !== setSpr);
    const kroky = (t.solutionSteps ?? []).join(" ");
    return {
      kind: "let",
      ok: setKey === setSpr && spravne.length > 0 && jinaMnozina && /23,5/.test(kroky),
      detail: `${a} → ${b}: čekám ${setSpr}, klíč ${setKey}`,
    };
  }

  // Cesta po poledníku: pás uprostřed mezi pásem na začátku a na konci
  if (/^Karavana putovala/.test(q)) {
    const [a, b] = vsechnySirky(q).map(Math.abs);
    const i = PORADI.indexOf(PAS_ZE_SIRKY(a));
    const j = PORADI.indexOf(PAS_ZE_SIRKY(b));
    const ocekavam = Math.abs(i - j) === 2 ? NAZEV_PASU[PORADI[(i + j) / 2]] : null;
    return {
      kind: "cesta",
      ok: ocekavam !== null && key === ocekavam && distraktory.every((d) => d !== ocekavam) && /Hranice pásů/.test((t.solutionSteps ?? []).join(" ")),
      detail: `${a} → ${b}: čekám ${ocekavam}, klíč ${key}`,
    };
  }

  // Popis podnebí → souřadnice
  if (/^Expedice zapsala/.test(q)) {
    const popis = q.replace(/^.*?„/, "").replace(/“.*$/, "");
    const tridy = klasifikujPopis(popis);
    if (tridy.length !== 1) return { kind: "popis", ok: false, detail: `popis má ${tridy.length} tříd` };
    const lk = sirkaMoznosti(key)!;
    const pasKlice = Math.abs(lk) >= 40 ? null : PAS_ZE_SIRKY(Math.abs(lk));
    const pasyDistr = distraktory.map((d) => {
      const l = Math.abs(sirkaMoznosti(d)!);
      return l >= 40 ? "out" : PAS_ZE_SIRKY(l);
    });
    const ruzne = new Set(pasyDistr).size === pasyDistr.length && pasyDistr.filter((p) => p === "out").length === 1;
    return {
      kind: "popis",
      ok: pasKlice === tridy[0] && ruzne && pasyDistr.every((p) => p !== tridy[0]),
      detail: `popis → ${tridy[0]}, klíč ${lk} → ${pasKlice}, distraktory ${pasyDistr.join("/")}`,
    };
  }

  // Souřadnice → pás (jen pás)
  if (opts.every((o) => Object.values(NAZEV_PASU).includes(o) || o === "mírný pás") && /souřadnice/.test(q)) {
    const lat = parseSirka(q);
    if (lat === null) return { kind: "pas", ok: false, detail: "šířka se nedala vyparsovat" };
    const ocekavam = NAZEV_PASU[PAS_ZE_SIRKY(Math.abs(lat))];
    const kroky = (t.solutionSteps ?? []).join(" ");
    return {
      kind: "pas",
      ok: key === ocekavam && distraktory.includes("mírný pás") && kroky.includes("do asi 30°"),
      detail: `šířka ${lat} → čekám ${ocekavam}`,
    };
  }

  // Souřadnice → polokoule + pás
  if (/na které polokouli a v jakém pásu/.test(q)) {
    const lat = parseSirka(q);
    if (lat === null) return { kind: "polokoule", ok: false };
    const ocekavam = `${lat < 0 ? "na jižní polokouli" : "na severní polokouli"}, ${V_PASU[PAS_ZE_SIRKY(Math.abs(lat))]}`;
    const kroky = (t.solutionSteps ?? []).join(" ");
    const zadnyDalsi = distraktory.every((d) => d !== ocekavam);
    return {
      kind: "polokoule",
      ok: key === ocekavam && zadnyDalsi && kroky.includes("polokoule") && kroky.includes("do asi 30°"),
      detail: `šířka ${lat} → čekám ${ocekavam}`,
    };
  }

  // Poloha hor / jezera: světová strana dopočtená z vlastních souřadnic
  const mh = q.match(HORY_RE);
  if (mh) {
    const jmeno = mh[2] === "pohoří Drakensberky" ? "Drakensberky" : mh[2];
    const strana = svetovaStrana(POLOHA[jmeno]);
    return {
      kind: "poloha",
      ok: key.startsWith(strana) && distraktory.every((d) => !d.startsWith(strana)),
      detail: `${jmeno} → ${strana}, klíč ${key}`,
    };
  }
  for (const [rq, pred] of FAKTA) {
    if (rq.test(q)) return { kind: "fakt", ok: pred(key, t), detail: `pravidlo ${rq}` };
  }
  return null;
}

const levels = [1, 2, 3] as const;
const vzorky = Object.fromEntries(
  levels.map((l) => [l, [11, 22, 33, 44, 55, 66, 77].flatMap((s) => withSeed(s, () => topic.generator(l)))]),
) as Record<1 | 2 | 3, PracticeTask[]>;

describe("Afrika — metadata", () => {
  it("zeměpis g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-zem-afrika-poloha-povrch-vodstvo-podnebi-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Regiony světa");
    expect(topic.topic).toBe("Afrika");
    expect(topic.rvpNodeId).toBe("g6-zemepis-regiony-sveta-afrika-afrika-poloha-povrch-vodstvo-podnebi");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(levels)("Afrika — L%i", (level) => {
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

  it("žádná mapa ani obrázek, žádná přesná čísla ani údaje z aktuálního dění", () => {
    for (const t of tasks) {
      const cely = [t.question, ...(t.options ?? []), t.explanation ?? ""].join(" ");
      expect(t.question).not.toMatch(/na mapě|na mapu|na obrázk|podívej se/i);
      expect(cely).not.toMatch(/19\d\d|20\d\d/);
      expect(cely).not.toMatch(/\d[\d  ]*\s?(m n\. m\.|km²|km\b|milion)/i);
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

describe("Afrika — souřadnicové linky (L2)", () => {
  const pasy = vzorky[2].filter((t) => solve(t)?.kind === "pas");
  const pol = vzorky[2].filter((t) => solve(t)?.kind === "polokoule");

  it("obě šablony jsou v poolu a mají mezikrok s hranicemi pásů", () => {
    expect(pasy.length).toBeGreaterThan(0);
    expect(pol.length).toBeGreaterThan(0);
    for (const t of [...pasy, ...pol]) {
      expect(t.solutionSteps!.length, t.question).toBeGreaterThanOrEqual(3);
      expect(t.solutionSteps!.join(" "), t.question).toMatch(/do asi 30°/);
    }
  });

  it("všechny čtyři pásy i obě polokoule se objeví v klíčích", () => {
    const klice = new Set(pasy.map((t) => t.correctAnswer));
    for (const n of Object.values(NAZEV_PASU)) expect(klice, `chybí pás ${n}`).toContain(n);
    const kp = new Set(pol.map((t) => t.correctAnswer));
    for (const j of ["na jižní polokouli", "na severní polokouli"]) {
      expect([...kp].some((k) => k.startsWith(j)), `chybí ${j}`).toBe(true);
    }
  });

  it("šířka nikdy nespadne k hranici pásu (hranice asi 5°, 15° a 30°)", () => {
    for (const t of [...pasy, ...pol]) {
      const st = Math.abs(parseSirka(t.question)!);
      expect(st <= 4 || (st >= 8 && st <= 12) || (st >= 19 && st <= 27) || st >= 32, t.question).toBe(true);
    }
  });

  it("souřadnice v subtropech leží na souši (Maghreb, jih Jihoafrické republiky)", () => {
    for (const t of [...pasy, ...pol]) {
      const lat = parseSirka(t.question)!;
      const m = t.question.match(/(\d+)°\s*([vz])\.\s*d\./)!;
      const lon = (m[2] === "z" ? -1 : 1) * Number(m[1]);
      if (lat >= 32) expect(lon >= 8 && lon <= 10, t.question).toBe(true);
      if (lat <= -32) expect(lon >= 19 && lon <= 27, t.question).toBe(true);
    }
  });

  it("souřadnice leží v Africe (zeměpisná délka −20° až 52°)", () => {
    for (const t of [...pasy, ...pol]) {
      const m = t.question.match(/(\d+)°\s*([vz])\.\s*d\./)!;
      const lon = (m[2] === "z" ? -1 : 1) * Number(m[1]);
      expect(lon >= -20 && lon <= 52, t.question).toBe(true);
    }
  });

  it("solutionSteps mají jen souřadnicové a letové úlohy", () => {
    for (const t of [...vzorky[1], ...vzorky[2], ...vzorky[3]]) {
      const k = solve(t)?.kind;
      if (!["pas", "polokoule", "let", "cesta"].includes(k ?? "")) {
        expect(t.solutionSteps, t.question).toBeUndefined();
      }
    }
  });
});

describe("Afrika — L3 popis podnebí a let", () => {
  it("každý popis se zařadí do právě jednoho pásu a všechny čtyři pásy se objeví", () => {
    const popisy = vzorky[3].filter((t) => solve(t)?.kind === "popis");
    expect(popisy.length).toBeGreaterThan(0);
    const pasy = new Set(popisy.map((t) => PAS_ZE_SIRKY(Math.abs(sirkaMoznosti(t.correctAnswer)!))));
    expect(pasy.size).toBe(4);
  });

  it("žádný viditelný text nemá dvojitou tečku (šablona za zkratkou „š.“)", () => {
    for (const l of levels) {
      for (const t of vzorky[l]) {
        const cely = [
          t.question,
          ...(t.options ?? []),
          t.explanation ?? "",
          ...(t.hints ?? []),
          ...(t.solutionSteps ?? []),
          ...Object.values(t.optionFeedback ?? {}),
        ].join("\n");
        expect(cely, t.question).not.toMatch(/\.\.(?!\.)/);
      }
    }
  });

  it("cesta po poledníku: klíčem je pás uprostřed, objeví se aspoň dva různé", () => {
    const cesty = vzorky[3].filter((t) => solve(t)?.kind === "cesta");
    expect(cesty.length).toBeGreaterThan(0);
    expect(new Set(cesty.map((t) => t.correctAnswer)).size).toBeGreaterThanOrEqual(2);
  });

  it("distraktory popisu obsahují souřadnice mimo Afriku (≥ 46°)", () => {
    for (const t of vzorky[3].filter((x) => solve(x)?.kind === "popis")) {
      const mimo = t.options!.filter((o) => Math.abs(sirkaMoznosti(o)!) >= 46);
      expect(mimo.length, t.question).toBe(1);
    }
  });

  it("letové úlohy mají klíče různých velikostí (1, 2 i 3 čáry)", () => {
    const lety = vzorky[3].filter((t) => solve(t)?.kind === "let");
    expect(lety.length).toBeGreaterThan(5);
    const velikosti = new Set(lety.map((t) => nazvyCarUMoznosti(t.correctAnswer).length));
    expect(velikosti.size).toBeGreaterThanOrEqual(2);
  });

  it("L3 obsahuje popis, let i posouzení chybného tvrzení", () => {
    const jedno = withSeed(7, () => topic.generator(3));
    const druhy = new Set(jedno.map((t) => solve(t)?.kind));
    expect(druhy.has("popis")).toBe(true);
    expect(druhy.has("let")).toBe(true);
    expect(jedno.some((t) => /^Žák napsal/.test(t.question))).toBe(true);
  });
});

/**
 * Sezení = prvních `sessionTaskCount` úloh poolu (generateMockBatch pool jen
 * ořízne). Testy níž hlídají to, co zamíchání celého poolu neřeší: aby se
 * v jedné šestici nesešly dvě úlohy řešitelné týmž vyloučením.
 */
describe("Afrika — skladba sezení", () => {
  const KOLIK = topic.sessionTaskCount!;
  const seedy = Array.from({ length: 40 }, (_, i) => i * 7 + 3);
  const sezeni = (level: 1 | 2 | 3, seed: number) =>
    withSeed(seed, () => topic.generator(level)).slice(0, KOLIK);
  const kolikrat = (tasks: PracticeTask[], r: RegExp) => tasks.filter((t) => r.test(t.question)).length;

  it("L1: úlohy se stejnou skladbou se nesejdou", () => {
    for (const s of seedy) {
      const t = sezeni(1, s);
      expect(kolikrat(t, /^Který oceán omývá/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /^Které moře|Suezská šíje/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /^Který obratník/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /pohoří Atlas|Drakensberky|Etiopská vysočina/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /řeka Kongo|Viktoriino jezero/), `seed ${s}`).toBeLessThanOrEqual(1);
    }
  });

  it("L2: právě jedna úloha na pás a jedna na polokouli + pás, každá z jiného pásu", () => {
    for (const s of seedy) {
      const t = sezeni(2, s);
      const a = t.filter((x) => solve(x)?.kind === "pas");
      const b = t.filter((x) => solve(x)?.kind === "polokoule");
      expect(a.length, `seed ${s}`).toBe(1);
      expect(b.length, `seed ${s}`).toBe(1);
      const pasA = PAS_ZE_SIRKY(Math.abs(parseSirka(a[0].question)!));
      const pasB = PAS_ZE_SIRKY(Math.abs(parseSirka(b[0].question)!));
      expect(pasA, `seed ${s}`).not.toBe(pasB);
    }
  });

  it("L2: Nil a příčiny se v sezení nehromadí", () => {
    for (const s of seedy) {
      const t = sezeni(2, s);
      expect(kolikrat(t, /přes Saharu a v jejím údolí|Řeka Nil/), `seed ${s}`).toBeLessThanOrEqual(1);
      expect(kolikrat(t, /Kongo|Proč je v okolí rovníku|Proč leží největší pouště/), `seed ${s}`).toBeLessThanOrEqual(2);
      expect(kolikrat(t, /pobřeží u Středozemního moře|navazuje na rovníkový pás/), `seed ${s}`).toBeLessThanOrEqual(1);
    }
  });

  it("L3: jeden let, dva popisy podnebí a nejvýš dvě chybná tvrzení", () => {
    for (const s of seedy) {
      const t = sezeni(3, s);
      expect(t.filter((x) => solve(x)?.kind === "let").length, `seed ${s}`).toBe(1);
      expect(t.filter((x) => solve(x)?.kind === "popis").length, `seed ${s}`).toBe(2);
      expect(kolikrat(t, /^Žák napsal/), `seed ${s}`).toBeLessThanOrEqual(2);
    }
  });
});

describe("Afrika — gradace a determinismus", () => {
  it("L1 se ptá na jeden fakt; L1 a L3 mají disjunktní znění", () => {
    for (const t of vzorky[1]) {
      expect(t.question, t.question).toMatch(/^(Co|Kde|Který|Kterou|Které|Ve které|Do kterého|S jakým|Jaké|Jak)(?=\s)/);
      expect(t.question.length, `L1 je příliš dlouhá: ${t.question}`).toBeLessThan(90);
      expect(t.solutionSteps, t.question).toBeUndefined();
    }
    const l1 = new Set(vzorky[1].map((t) => t.question));
    expect(vzorky[3].filter((t) => l1.has(t.question))).toEqual([]);
  });

  it("L3 je scénář nebo posouzení, žádný holý dotaz na pojem z L1", () => {
    for (const t of vzorky[3]) {
      expect(t.question, t.question).toMatch(
        /^(Expedice zapsala|Letadlo vzlétlo|Karavana putovala|Žák napsal|Fotograf stojí|Studentka|Rodina z Česka|Nil pramení)/,
      );
    }
  });

  it("L3 je delší a složitější než L1 (průměrná délka zadání)", () => {
    const prum = (a: PracticeTask[]) => a.reduce((s, t) => s + t.question.length, 0) / a.length;
    expect(prum(vzorky[3])).toBeGreaterThan(prum(vzorky[1]) * 1.5);
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
