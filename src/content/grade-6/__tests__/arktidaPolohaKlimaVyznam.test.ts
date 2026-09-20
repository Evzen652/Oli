import { describe, it, expect } from "vitest";
import { ARKTIDA_POLOHA_KLIMA_VYZNAM } from "../zemepis/arktidaPolohaKlimaVyznam";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Arktida — poloha, klima, význam (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta — nikdy nesahá do parametrů generátoru,
 * všechno čte ze znění otázky):
 *  1. úlohy se souřadnicemi: z otázky se vyparsuje „NN° s. š. / j. š.“ a oblast
 *     se klasifikuje samostatně podle znaménka polokoule a prahu 66,5°
 *     (|φ| ≥ 66,5 sever = Arktida, jih = Antarktida; méně = tundra nebo mírný
 *     pás podle popsané vegetace). Výsledek se porovná s correctAnswer.
 *     Rodina se pozná podle údaje o nejteplejším měsíci, protože zadání má dvě
 *     podoby (stanice / zápis v deníku). Solver navíc hlídá, že klimatický údaj
 *     neodporuje popsané vegetaci: tundra nesmí přelézt izotermu 10 °C a mírný
 *     pás na jižní polokouli musí zůstat v oceánských, chladnějších hodnotách.
 *  2. tabulka znaků Arktida × Antarktida ověří, že klíč nikdy nepřiřadí znak
 *     opačné oblasti a že zakázaný znak (tučňák na severu, lední medvěd na
 *     jihu) se objeví jen jako distraktor.
 *  3. kauzální úlohy: klasifikátor klíčových slov ověří, že klíč o polárním dni
 *     mluví o sklonu osy a NE o vzdálenosti od Slunce, a že klíč o hladině
 *     oceánu váže vzestup na pevninský ledovec, ne na mořský led.
 */
const topic = ARKTIDA_POLOHA_KLIMA_VYZNAM[0];

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

// ── 1) klasifikace podle souřadnic ─────────────────────────────────────────

const OBLAST_TEXT = {
  arktida: "v Arktidě, tedy za severním polárním kruhem",
  antarktida: "v Antarktidě, tedy za jižním polárním kruhem",
  tundra: "v tundře, ale ještě před severním polárním kruhem",
  mirny: "v mírném pásu, daleko od obou polárních kruhů",
} as const;

/** Šířka ze znění otázky se znaménkem (sever +, jih −). */
function sirkaZeZneni(q: string): number | null {
  const m = q.match(/(\d+)° (s|j)\. š\./);
  return m ? (m[2] === "s" ? 1 : -1) * Number(m[1]) : null;
}

/** Teplota nejteplejšího měsíce ze znění (typografické minus z `cis()`). */
function teplotaZeZneni(q: string): number | null {
  const m = q.match(/(−?\d+) °C/);
  return m ? Number(m[1].replace("−", "-")) : null;
}

/**
 * Souřadnicová rodina se pozná podle údaje o nejteplejším měsíci, ne podle
 * jednoho znění — zadání má dvě podoby (stanice / zápis v deníku).
 */
const JE_SOURADNICOVA = /nejteplejším měsíci/;

// ── 2) tabulka znaků obou polárních oblastí ────────────────────────────────

// Česká jména se v obsahu píšou s přívlastkem za podstatným jménem („liška polární“),
// v souvislém textu naopak před ním („polární liška“) — tabulka drží obě podoby.
const ZNAKY_ARKTIDY = [
  "lední medvěd", "mrož", "sob", "liška polární", "polární liška", "tuleň", "Inuité", "Sámové",
];
const ZNAKY_ANTARKTIDY = ["tučňák", "tuleň Weddellův"];
/** Znaky vázané na povahu oblasti (led na moři × led na pevnině, osídlení, státy). */
const POVAHA_ANTARKTIDY = ["na vysoké pevnině", "nikdo trvale nežije", "nevládne žádný stát"];

const obsahuje = (text: string, znaky: string[]) => znaky.filter((z) => text.toLowerCase().includes(z.toLowerCase()));

// ── 3) klasifikátor kauzálních klíčů ───────────────────────────────────────

/** Vrátí `null`, když otázka do žádné hlídané kauzální rodiny nepatří. */
function kauzalniOk(q: string, key: string): boolean | null {
  if (/celý den světlo|polárním kruhem v létě/.test(q)) {
    return /sklon|skloněn/i.test(key) && !/vzdálenost|blíž|dál od Slunce/i.test(key);
  }
  if (/mořského ledu.*nezvedne|Část mořského ledu/.test(q)) {
    return /plovoucí/i.test(key) && !/stoupne/i.test(key);
  }
  if (/pevninského ledovce/.test(q)) {
    return /ze souše|na souši|přiteče/i.test(key);
  }
  if (/ubývá čím dál rychleji/.test(q)) {
    return /led.*odráží/i.test(key) && /voda.*pohlcuje/i.test(key);
  }
  if (/tepleji než v Antarktidě/.test(q)) {
    return /oceán/i.test(key) && !/blíž k rovníku/i.test(key);
  }
  return null;
}

type Vysledek = { kind: "souradnice" | "znaky" | "kauzalni" | "fakt"; ok: boolean; detail?: string };

/** Tabulka faktů L1 — psaná nezávisle na generátoru (druhá cesta). */
const FAKTA: [RegExp, (key: string) => boolean][] = [
  [/Co tvoří většinu Arktidy/, (k) => /zamrzlý oceán/.test(k)],
  [/Který oceán z větší části vyplňuje/, (k) => k === "Severní ledový oceán"],
  [/leží severní polární kruh/, (k) => k === "66,5° s. š."],
  [/leží severní pól/, (k) => k === "90° s. š."],
  [/Který ostrov je v Arktidě největší/, (k) => k === "Grónsko"],
  [/^Čím je Grónsko/, (k) => k === "největší ostrov světa"],
  [/Ke kterému světadílu se Grónsko/, (k) => k === "k Severní Americe"],
  [/Pevniny kterých tří světadílů/, (k) => k === "Evropa, Asie a Severní Amerika"],
  [/arktické části Severní Ameriky a v Grónsku/, (k) => k === "Inuité"],
  [/evropské tundře na severu Skandinávie/, (k) => k === "Sámové"],
  [/bezlesá krajina s mechy/, (k) => k === "tundra"],
  [/led, který plave na hladině/, (k) => k === "mořský led"],
  [/polární oblast kolem jižního pólu/, (k) => k === "Antarktida"],
];

function solve(t: PracticeTask): Vysledek | null {
  const q = t.question;
  const key = t.correctAnswer;

  // ── 1) souřadnicová klasifikace ──
  if (JE_SOURADNICOVA.test(q)) {
    const fi = sirkaZeZneni(q);
    expect(fi, q).not.toBeNull();
    const t = teplotaZeZneni(q);
    expect(t, `chybí teplota: ${q}`).not.toBeNull();
    const abs = Math.abs(fi!);
    let ocekavam: keyof typeof OBLAST_TEXT;
    if (abs >= 66.5) {
      ocekavam = fi! > 0 ? "arktida" : "antarktida";
      // popis polární stanice musí odpovídat: v létě Slunce nezapadá
      expect(q, q).toMatch(/Slunce několik týdnů vůbec nezapadne/);
    } else if (/mechy, lišejníky/.test(q)) {
      ocekavam = "tundra";
      expect(fi!, `tundra musí být na severu mezi 55° a 66,5°: ${q}`).toBeGreaterThanOrEqual(55);
      expect(fi!, q).toBeLessThan(66.5);
      // hranice lesa = izoterma 10 °C nejteplejšího měsíce; nad ní by popis
      // bezlesé krajiny odporoval klimatickému údaji ve stejném zadání
      expect(t!, `tundra nad izotermou 10 °C: ${q}`).toBeLessThanOrEqual(10);
    } else {
      ocekavam = "mirny";
      expect(abs, `mírný pás musí být daleko od polárního kruhu: ${q}`).toBeLessThan(55);
      expect(q, q).toMatch(/listnaté lesy/);
      // jižní polokoule je v těchhle šířkách oceánská a chladnější — stanice
      // s 20 °C a listnatými lesy na 50° j. š. neexistuje
      if (fi! < 0) {
        expect(abs, `mírný pás na jihu musí zůstat pod 47°: ${q}`).toBeLessThanOrEqual(46);
        expect(t!, `mírný pás na jihu je oceánský a chladnější: ${q}`).toBeLessThanOrEqual(18);
      }
    }
    return { kind: "souradnice", ok: key === OBLAST_TEXT[ocekavam], detail: `čekám ${ocekavam}` };
  }

  // ── 2) znaky obou polárních oblastí ──
  if (/Čím se Arktida liší od Antarktidy/.test(q)) {
    const casti = key.split(", kdežto v Antarktidě ");
    if (casti.length !== 2) return { kind: "znaky", ok: false, detail: "klíč nemá tvar dvojice" };
    const [ark, ant] = casti;
    const chyby: string[] = [
      ...obsahuje(ark, ZNAKY_ANTARKTIDY).map((z) => `znak Antarktidy „${z}“ přiřazen Arktidě`),
      ...obsahuje(ark, POVAHA_ANTARKTIDY).map((z) => `povaha Antarktidy „${z}“ přiřazena Arktidě`),
      ...obsahuje(ant, ZNAKY_ARKTIDY).map((z) => `znak Arktidy „${z}“ přiřazen Antarktidě`),
    ];
    // zrcadlová (prohozená) varianta musí být mezi distraktory, ne klíčem
    const prohozeno = `V Arktidě ${ant.replace(/\.$/, "")}, kdežto v Antarktidě ${ark.replace(/^V Arktidě /, "")}.`;
    if (!t.options!.includes(prohozeno)) chyby.push("chybí prohozená varianta jako distraktor");
    return { kind: "znaky", ok: chyby.length === 0, detail: chyby.join("; ") };
  }
  if (/Které z těchto zvířat/.test(q)) {
    const ostatni = t.options!.filter((o) => o !== key);
    const ok = obsahuje(key, ZNAKY_ANTARKTIDY).length === 1
      && ostatni.every((o) => obsahuje(o, ZNAKY_ARKTIDY).length >= 1)
      && ostatni.every((o) => obsahuje(o, ZNAKY_ANTARKTIDY).length === 0);
    return { kind: "znaky", ok, detail: `klíč ${key}` };
  }

  // ── 3) kauzální klíče ──
  const kauz = kauzalniOk(q, key);
  if (kauz !== null) return { kind: "kauzalni", ok: kauz };

  // ── fakta z nezávislé tabulky ──
  for (const [re, ok] of FAKTA) if (re.test(q)) return { kind: "fakt", ok: ok(key) };
  // zbylá výkladová fakta L2/L3 — ověří se aspoň strukturálně
  if (/^(Proč|Čím|Vesnice|Za polárním kruhem)/.test(q)) return { kind: "fakt", ok: key.length > 0 };
  return null;
}

const levels = [1, 2, 3] as const;
const vzorky = Object.fromEntries(
  levels.map((l) => [l, [11, 22, 33, 44, 55].flatMap((s) => withSeed(s, () => topic.generator(l)))]),
) as Record<1 | 2 | 3, PracticeTask[]>;

describe("Arktida — metadata", () => {
  it("zeměpis g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-zem-arktida-poloha-klima-vyznam-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Regiony světa");
    expect(topic.topic).toBe("Polární oblasti");
    expect(topic.rvpNodeId).toBe("g6-zemepis-regiony-sveta-polarni-oblasti-arktida-poloha-klima-vyznam");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(levels)("Arktida — L%i", (level) => {
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

  it("klíč není ve znění ani v nápovědě, obě nápovědy jsou unikátní", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), t.question).toBe(false);
      expect(t.hints!.length).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(h.includes(t.correctAnswer), `hint leak: ${t.question}`).toBe(false);
        // číselný klíč (rovnoběžky): jeho číslo se v nápovědě objevit nesmí
        const num = t.correctAnswer.match(/^(\d+(?:,\d+)?)°/)?.[1];
        if (num) expect(h, `hint obsahuje ${num}: ${t.question}`).not.toMatch(new RegExp(`(^|[^\\d,])${num.replace(",", ",")}(?![\\d,])`));
      }
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("žádná mapa ani obrázek, jen slova a souřadnice", () => {
    for (const t of tasks) {
      expect(t.question).not.toMatch(/mapě|mapu|mapa|obrázk|na snímku/);
      for (const o of t.options!) expect(o).not.toMatch(/mapě|obrázk/);
    }
  });

  it("tučňák nikdy nefiguruje jako obyvatel Arktidy a lední medvěd jako obyvatel Antarktidy", () => {
    for (const t of tasks) {
      const key = t.correctAnswer;
      if (obsahuje(key, ZNAKY_ANTARKTIDY).length > 0 && !/kdežto v Antarktidě/.test(key)) {
        expect(t.question, `jižní zvíře jako klíč u: ${t.question}`).toMatch(/Antarktidě|NEžije/);
      }
      if (/lední medvěd/i.test(key)) {
        const ant = key.split(", kdežto v Antarktidě ")[1] ?? "";
        expect(/lední medvěd/i.test(ant), `lední medvěd na jižní polokouli: ${key}`).toBe(false);
      }
    }
  });

  it("≥ 12 různých úloh na jedno volání generátoru", () => {
    for (const seed of [7, 19, 41]) {
      const jedno = withSeed(seed, () => topic.generator(level));
      expect(pocetUnikatnich(jedno), `seed ${seed}`).toBeGreaterThanOrEqual(12);
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsi = tasks.filter((t) => {
      const others = t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length);
      return t.correctAnswer.length > Math.max(...others);
    }).length;
    expect(nejdelsi / tasks.length).toBeLessThan(0.5);
  });

  it("klíč nevyčnívá prvním slovem: když ho sdílejí všechny distraktory, sdílí ho i klíč", () => {
    const prvni = (s: string) => s.split(/\s+/)[0].toLowerCase();
    for (const t of tasks) {
      const d = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(d).size === 1) {
        expect(prvni(t.correctAnswer), `klíč vyčnívá: ${t.question} → ${t.correctAnswer}`).toBe(d[0]);
      }
    }
  });
});

describe("Arktida — gradace, obě šablony a determinismus", () => {
  it("L1 a L3 mají disjunktní znění otázek", () => {
    const l1 = new Set(vzorky[1].map((t) => t.question));
    expect(vzorky[3].filter((t) => l1.has(t.question))).toEqual([]);
    const l2 = new Set(vzorky[2].map((t) => t.question));
    expect(vzorky[3].filter((t) => l2.has(t.question))).toEqual([]);
  });

  it("L1 se ptá na jeden fakt, L3 rozhoduje o novém místě nebo hledá příčinu", () => {
    for (const t of vzorky[1]) {
      expect(t.question, t.question).toMatch(/^(Co|Který|Která|Které|Jak|Na jaké|Čím|Ke kterému|Pevniny)/);
      expect(t.question, `L1 nesmí mít souřadnicový popis: ${t.question}`).not.toMatch(JE_SOURADNICOVA);
    }
    for (const t of vzorky[3]) {
      const ok = JE_SOURADNICOVA.test(t.question)
        || /^(Proč|Část|Ledu|Za polárním kruhem|Vesnice|Cestovatel)/.test(t.question);
      expect(ok, t.question).toBe(true);
    }
  });

  it("L3 obsahuje obě rodiny: souřadnicovou i kauzální", () => {
    const jedno = withSeed(7, () => topic.generator(3));
    expect(jedno.filter((t) => solve(t)?.kind === "souradnice").length, "souřadnice").toBeGreaterThanOrEqual(4);
    expect(jedno.filter((t) => solve(t)?.kind === "kauzalni").length, "kauzální").toBeGreaterThanOrEqual(3);
  });

  it("v sezení (prvních 6) se souřadnicová odpověď neopakuje", () => {
    for (const seed of [7, 19, 41, 55, 101]) {
      const sezeni = withSeed(seed, () => topic.generator(3)).slice(0, 6);
      const klice = sezeni.filter((t) => JE_SOURADNICOVA.test(t.question)).map((t) => t.correctAnswer);
      expect(new Set(klice).size, `seed ${seed}: dvakrát táž oblast ${klice.join(" | ")}`).toBe(klice.length);
      expect(klice.length, `seed ${seed}: souřadnicových úloh v sezení`).toBeLessThanOrEqual(2);
    }
  });

  it("v sezení (prvních 6) je nejvýš jedna otázka na zvířata", () => {
    for (const seed of [7, 19, 41, 55, 101]) {
      const sezeni = withSeed(seed, () => topic.generator(1)).slice(0, 6);
      const zvirata = sezeni.filter((t) => /Které z těchto zvířat/.test(t.question));
      expect(zvirata.length, `seed ${seed}: ${zvirata.map((t) => t.question).join(" | ")}`).toBeLessThanOrEqual(1);
    }
  });

  it("L2 obsahuje i srovnání Arktidy s Antarktidou", () => {
    const jedno = withSeed(13, () => topic.generator(2));
    expect(jedno.filter((t) => /Čím se Arktida liší/.test(t.question)).length).toBeGreaterThanOrEqual(2);
  });

  it("souřadnice jsou celé stupně a klíč nikdy nezávisí na aktuálním roce", () => {
    for (const t of [...vzorky[1], ...vzorky[2], ...vzorky[3]]) {
      const fi = sirkaZeZneni(t.question);
      if (fi !== null) expect(Number.isInteger(fi) || Math.abs(fi) === 66.5, t.question).toBe(true);
      expect(t.correctAnswer, t.question).not.toMatch(/20\d\d|obyvatel na|milion(ů)? obyvatel/);
    }
  });

  it("gen() je deterministický a bez stavu modulu", () => {
    const otisk = () => JSON.stringify(levels.map((l) => topic.generator(l).map((t) => [t.question, t.correctAnswer])));
    const a = withSeed(123, otisk);
    Math.random(); Math.random();
    const b = withSeed(123, otisk);
    expect(b).toBe(a);
  });
});
