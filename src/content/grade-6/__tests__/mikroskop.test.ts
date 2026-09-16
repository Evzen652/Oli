import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MIKROSKOP } from "../prirodopis/mikroskop";
import type { PracticeTask } from "@/lib/types";

/**
 * Mikroskop — práce s mikroskopem (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta) — z generátoru nebere žádná data, jen text úlohy:
 *  • VÝPOČET: čísla se vytáhnou regexem ze znění. Celkové zvětšení = opakované
 *    sčítání, chybějící okulár/objektiv = zkoušení řady, dokud součin nesedí,
 *    „kolikrát“ = podíl dvou součinů, skutečná velikost = dělení.
 *  • SMĚR POSUNU: okraj → kam má jít obraz (ke středu) → sklíčko opačně.
 *  • ČÁST ↔ FUNKCE, POSTUP, DIAGNÓZA, DŮSLEDEK: klasifikátor klíčových slov.
 */
const topic = MIKROSKOP[0];

function seeded(seed = 0x2545f491): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function sSeedem<T>(f: () => T, seed?: number): T {
  const puvodni = Math.random;
  Math.random = seeded(seed);
  try {
    return f();
  } finally {
    Math.random = puvodni;
  }
}

/** „1 000×“ / „0,05 mm“ / „4krát“ → číslo. */
const num = (s: string) => Number(s.replace(/[\s ]/g, "").replace(/×|krát|mm/g, "").replace(",", "."));
const soucin = (a: number, b: number) => {
  let z = 0;
  for (let i = 0; i < a; i++) z += b;
  return z;
};
const RADA_OBJ = [4, 10, 20, 40, 60, 100];
const RADA_OK = [5, 8, 10, 12, 15, 16, 20];

/** Otázka „Která část …“ → část. */
const CAST_Z_OTAZKY: [RegExp, string][] = [
  [/díváš/, "okulár"],
  [/těsně nad pozorovaným preparátem/, "objektiv"],
  [/vyměnit objektiv/, "revolverový měnič"],
  [/pokládáš sklíčko/, "stolek"],
  [/přidržují/, "svorky"],
  [/kolik světla/, "clona"],
  [/odráží světlo/, "zrcátko"],
  [/hrubému/, "makrošroub"],
  [/jemnému/, "mikrošroub"],
  [/dutá trubice/, "tubus"],
  [/přenášení/, "rameno"],
  [/pevně stojí/, "podstavec"],
  [/soustřeďuje světlo/, "kondenzor"],
  [/kápneš/, "podložní sklíčko"],
  [/přikryješ/, "krycí sklíčko"],
];
/** Část → znak její funkce v textu možnosti. */
const FUNKCE: Record<string, RegExp> = {
  "okulár": /do této čočky se díváš/i,
  "objektiv": /těsně nad preparátem/i,
  "revolverový měnič": /vyměňují objektivy/i,
  "stolek": /pokládá sklíčko/i,
  "svorky": /přidržují/i,
  "clona": /otvor pro světlo/i,
  "zrcátko": /odráží/i,
  "makrošroub": /hrubě/i,
  "mikrošroub": /jemně/i,
  "tubus": /trubice/i,
  "rameno": /přenášení/i,
  "podstavec": /nese celý/i,
  "kondenzor": /soustřeďuje/i,
  "podložní sklíčko": /se kápne kapka/i,
  "krycí sklíčko": /přikrývá/i,
};
/** Situace / diagnóza / důsledek: znak v otázce → znak správné možnosti. */
const SITUACE: [RegExp, RegExp][] = [
  [/Jaký objektiv nastavíš jako první/, /nejmenším/],
  [/Kam preparát položíš/, /stolek a přichytíš/],
  [/Jak přiblížíš objektiv/, /^Makrošroubem.*ze strany/],
  [/Co uděláš jako další krok/, /oddaluješ/],
  [/Čím ho doostříš/, /^Jen mikrošroubem/],
  [/Jak ho poneseš/, /^Oběma rukama, za rameno a pod/],
  [/mokrý preparát.*Co uděláš jako první/, /doprostřed podložního/],
  [/Jak přiložíš krycí sklíčko/, /^Šikmo od kraje/],
  [/ztmavne/, /otevřít clonu/],
  [/šmouhu/, /mikrošroub/],
  [/kroužky/, /bublin/],
  [/příště předejdeš/, /šikmo/],
  [/rozbilo/, /makrošroub/],
  [/úplně tmavé/, /zrcátk/],
  [/nemůžeš nic najít/, /nejmenší zvětšení/],
  [/velikost části preparátu/, /menší část/],
  [/s jasem obrazu/, /tmavší/],
  [/to, co v zorném poli vidíš/, /větší a uvidíš toho méně/],
  [/Jak daleko od sklíčka/, /^Blíž/],
];
const OKRAJ: Record<string, string> = { levého: "L", pravého: "P", horního: "H", dolního: "D" };
const PROTI: Record<string, string> = { L: "P", P: "L", H: "D", D: "H" };
const SLOVO: Record<string, string> = { L: "doleva", P: "doprava", H: "nahoru", D: "dolů" };

function jedna(hit: string[], co: string, t: PracticeTask): string {
  expect(hit, `${co}: ${t.question} | ${t.options!.join(" / ")}`).toHaveLength(1);
  return hit[0];
}

function vyres(t: PracticeTask): string {
  const q = t.question;
  const opts = t.options!;
  const zvetseni = (n: number) => jedna(opts.filter((o) => /×$/.test(o) && num(o) === n), "zvětšení", t);
  let m: RegExpExecArray | null;

  // L1a — část podle popisu
  if (/^Která část mikroskopu|^Které části mikroskopu|^Na co při přípravě|^Čím při přípravě/.test(q)) {
    const hit = CAST_Z_OTAZKY.filter(([r]) => r.test(q)).map(([, c]) => c);
    const cast = jedna(hit, "L1a klasifikátor", t);
    return jedna(opts.filter((o) => o === cast), "L1a", t);
  }
  // L1b — funkce části
  m = /^K čemu slouží (.+) u mikroskopu\?$/.exec(q);
  if (m) {
    const r = FUNKCE[m[1]];
    expect(r, `neznámá část „${m[1]}“`).toBeDefined();
    return jedna(opts.filter((o) => r.test(o)), "L1b", t);
  }
  // L1c — součin v zadání
  m = /^Mikroskop má okulár (\d+)× a objektiv (\d+)×\. Jaké je celkové zvětšení\?$/.exec(q);
  if (m) return zvetseni(soucin(+m[1], +m[2]));
  // L2c — přepnutí objektivu, nové celkové zvětšení
  m = /okulárem (\d+)× a objektivem \d+×\. Teď přepnula? na objektiv (\d+)×\. Jak velké je teď celkové zvětšení\?$/.exec(q);
  if (m) return zvetseni(soucin(+m[1], +m[2]));
  // L2d — porovnání sestav
  if (/Která sestava zvětšuje nejvíc\?$/.test(q)) {
    const val = opts.map((o) => {
      const r = /^okulár (\d+)× a objektiv (\d+)×$/.exec(o);
      expect(r, o).toBeTruthy();
      return soucin(+r![1], +r![2]);
    });
    const max = Math.max(...val);
    return jedna(opts.filter((_, i) => val[i] === max), "sestavy", t);
  }
  // L3a — obrácený výpočet
  m = /^Celkové zvětšení mikroskopu je ([\d\s ]+)× a (okulár|objektiv) zvětšuje (\d+)×\. Jaký (okulár|objektiv) je nasazený\?$/.exec(q);
  if (m) {
    const celk = num(m[1]);
    const dane = +m[3];
    const rada = m[4] === "objektiv" ? RADA_OBJ : RADA_OK;
    const hit = rada.filter((v) => soucin(dane, v) === celk);
    return zvetseni(Number(jedna(hit.map(String), "řada", t)));
  }
  // L3b — kolikrát
  m = /okulárem (\d+)× a objektivem (\d+)×\. Pak přepnula? na objektiv (\d+)×\. Kolikrát/.exec(q);
  if (m) {
    const k = soucin(+m[1], +m[3]) / soucin(+m[1], +m[2]);
    return jedna(opts.filter((o) => /krát$/.test(o) && num(o) === k), "kolikrát", t);
  }
  // L3c — převrácený obraz
  m = /u (levého|pravého|horního|dolního) okraje zorného pole/.exec(q);
  if (m) {
    const okraj = OKRAJ[m[1]];
    const obraz = PROTI[okraj]; // obraz musí jít od okraje ke středu
    const sklicko = PROTI[obraz]; // sklíčko opačně než obraz
    expect(opts, `chybí distraktor „stejný směr“: ${q}`).toContain(`Sklíčko posunu ${SLOVO[obraz]}`);
    return jedna(opts.filter((o) => o === `Sklíčko posunu ${SLOVO[sklicko]}`), "obraz", t);
  }
  // L3f — skutečná velikost
  m = /^Při zvětšení ([\d\s ]+)× se .+ zdá velk[áéý] ([\d,]+) mm\./.exec(q);
  if (m) {
    const real = num(m[2]) / num(m[1]);
    return jedna(opts.filter((o) => Math.abs(num(o) - real) < 1e-9), "velikost", t);
  }
  // L2a/b, L3d/e — klasifikátor
  const s = SITUACE.filter(([r]) => r.test(q));
  expect(s, `solver: neznámá šablona: ${q}`).toHaveLength(1);
  return jedna(opts.filter((o) => s[0][1].test(o)), "situace", t);
}

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, sSeedem(() => topic.generator!(l))])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function najdiUzel(n: unknown, id: string): { labels?: { area: string; topic: string } } | undefined {
  if (Array.isArray(n)) {
    for (const x of n) { const r = najdiUzel(x, id); if (r) return r; }
  } else if (n && typeof n === "object") {
    const o = n as Record<string, unknown>;
    if (o.id === id && o.labels) return o as { labels: { area: string; topic: string } };
    for (const v of Object.values(o)) { const r = najdiUzel(v, id); if (r) return r; }
  }
  return undefined;
}

describe("Mikroskop — metadata", () => {
  it("přírodopis g6, select_one, category/topic znak po znaku dle RVP", () => {
    expect(topic.id).toBe("g6-pri-mikroskop-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Mikroskop — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, deterministicky, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    const znovu = sSeedem(() => topic.generator!(level));
    expect(znovu.map((t) => t.question)).toEqual(tasks.map((t) => t.question));
    for (const t of tasks) expect(Array.isArray(t.options), t.question).toBe(true);
  });

  it("4 unikátní možnosti, klíč právě jednou, feedback pro každý distraktor", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("nezávislý solver dojde ke stejnému klíči", () => {
    for (const t of tasks) expect(t.correctAnswer, t.question).toBe(vyres(t));
  });

  it("solver drží i na jiných seedech", () => {
    for (const seed of [1, 7, 42, 999]) {
      for (const t of sSeedem(() => topic.generator!(level), seed)) {
        expect(t.correctAnswer, t.question).toBe(vyres(t));
      }
    }
  });

  it("klíč není v otázce ani v nápovědách; hints[0] ≠ hints[1]", () => {
    for (const t of tasks) {
      const k = norm(t.correctAnswer);
      expect(norm(t.question).includes(k), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) expect(norm(h).includes(k), `nápověda prozrazuje: ${h}`).toBe(false);
    }
  });

  it("nápověda neuvádí výsledné číslo výpočtu", () => {
    for (const t of tasks) {
      if (!/(×|krát|mm)$/.test(t.correctAnswer)) continue;
      const cislo = String(t.correctAnswer.replace(/×|krát| mm/g, ""));
      const re = new RegExp(`(^|[^\\d,])${cislo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(×|krát| mm)`);
      for (const h of t.hints!) expect(re.test(h), `nápověda obsahuje výsledek: ${h}`).toBe(false);
    }
  });

  it("klíč nevyčnívá prvním slovem", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(jine).size === 1) expect(prvni(t.correctAnswer), `klíč vyčnívá: ${t.question}`).toBe(jine[0]);
    }
  });
});

describe("Mikroskop — napříč tématem", () => {
  it("klíč není systematicky nejdelší", () => {
    let nejdelsi = 0;
    let vyrazne = 0;
    for (const t of all) {
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0] === t.correctAnswer && s[0].length > s[1].length) nejdelsi++;
      if (s[0] === t.correctAnswer && s[0].length >= s[1].length * 1.25) vyrazne++;
    }
    expect(nejdelsi / all.length, `klíč nejdelší v ${nejdelsi}/${all.length}`).toBeLessThanOrEqual(0.4);
    expect(vyrazne / all.length, `klíč výrazně nejdelší v ${vyrazne}/${all.length}`).toBeLessThanOrEqual(0.1);
  });

  it("L1 a L3 mají disjunktní začátky otázek", () => {
    const zacatek = (q: string) => q.split(/\s+/).slice(0, 2).join(" ");
    const z1 = new Set(tasksBy[1].map((t) => zacatek(t.question)));
    for (const t of tasksBy[3]) expect(z1.has(zacatek(t.question)), t.question).toBe(false);
  });

  it("šablony L1 se střídají rovnoměrně", () => {
    const cast = tasksBy[1].filter((t) => /^Která část|^Které části|^Na co|^Čím/.test(t.question)).length;
    const fce = tasksBy[1].filter((t) => t.question.startsWith("K čemu slouží")).length;
    const vyp = tasksBy[1].filter((t) => t.question.startsWith("Mikroskop má")).length;
    expect(cast + fce + vyp).toBe(tasksBy[1].length);
    expect(Math.max(cast, fce, vyp) - Math.min(cast, fce, vyp)).toBeLessThanOrEqual(1);
  });

  it("L3 obsahuje všech šest typů úloh", () => {
    const q = tasksBy[3].map((t) => t.question);
    for (const r of [/^Celkové zvětšení/, /Kolikrát/, /okraje zorného pole/, /Co pomůže|Co uděláš|Co to nejspíš|předejdeš|špatně|Co zkontroluješ/, /přepneš na objektiv/, /Jak (velk|malé)[áéý]? je ve skutečnosti|ve skutečnosti/]) {
      expect(q.some((x) => r.test(x)), String(r)).toBe(true);
    }
  });

  it("L2 má aspoň 4 různá jména nebo kontexty", () => {
    const jmena = new Set(tasksBy[2].map((t) => /(Jana|Tomáš|Eliška|Matěj|Klára|Vojta)/.exec(t.question)?.[1]).filter(Boolean));
    expect(jmena.size).toBeGreaterThanOrEqual(4);
  });

  it("žádné rodové lomítko, žádné mocniny", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {}), ...(t.solutionSteps ?? [])];
      for (const s of texty) {
        expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
        expect(/[²³]/.test(s), `mocnina: ${s}`).toBe(false);
        expect(/undefined|NaN/.test(s), `rozbitý text: ${s}`).toBe(false);
      }
    }
  });
});
