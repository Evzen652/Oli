import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import { LOGICKE_UVAHY_KOMBINACNI_USUDEK } from "../matematika/logickeUvahyKombinacniUsudek";

/**
 * Logické úvahy, kombinační úsudek — test s NEZÁVISLÝM SOLVEREM.
 *
 * Solver čte jen text otázky, nikdy parametry generátoru. Generátor násobí
 * počty voleb; solver místo toho HRUBOU SILOU VYPÍŠE všechny možnosti
 * (všechna dvojmístná čísla 10–99, všechny uspořádané trojice závodníků,
 * množinu neuspořádaných dvojic, všech 24 přiřazení v hádance) a spočítá ty,
 * které splňují podmínky ze zadání.
 */
const topic = LOGICKE_UVAHY_KOMBINACNI_USUDEK[0];
const BEHU = 12;

const num = (s: string): number => {
  const t = s.replace(/[\s ]/g, "");
  expect(t, `není celé číslo: "${s}"`).toMatch(/^\d+$/);
  return Number(t);
};
const cislaVTextu = (s: string): number[] => (s.match(/\d+/g) ?? []).map(Number);
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/** Kartézský součin skupin daných velikostí — výčet všech výběrů. */
function vycetVyberu(velikosti: number[]): number {
  let n_tic: number[][] = [[]];
  for (const v of velikosti) n_tic = n_tic.flatMap((t) => range(1, v).map((x) => [...t, x]));
  return n_tic.length;
}

/** Kolik čísel z intervalu má všechny číslice ze sady (a případně různé) a splní podmínku. */
function vycetCisel(min: number, max: number, sada: number[], opakovat: boolean, podm: (x: number) => boolean = () => true): number {
  return range(min, max).filter((x) => {
    const c = String(x).split("").map(Number);
    if (!c.every((d) => sada.includes(d))) return false;
    if (!opakovat && new Set(c).size !== c.length) return false;
    return podm(x);
  }).length;
}

type Sablona = { id: string; re: RegExp; vyres: (m: RegExpMatchArray, q: string) => string };

const L1_RE: [string, RegExp][] = [
  ["L1-obleceni", /^\p{L}+ má ve skříni \d+ trič\p{L}+ a \d+ pár\p{L}* kalhot\. Kolika různými způsoby se může obléct, když si vezme jedno tričko a jedny kalhoty\?$/u],
  ["L1-cepice", /^Na hory si \p{L}+ bere \d+ čepic\p{L}* a \d+ šál\p{L}*\. Kolika různými způsoby si může vybrat jednu čepici a jednu šálu\?$/u],
  ["L1-jidelna", /^Školní jídelna nabízí \d+ polév\p{L}+ a \d+ hlavní\p{L}* jíd\p{L}+\. Kolik různých obědů z jedné polévky a jednoho hlavního jídla si může \p{L}+ vybrat\?$/u],
  ["L1-cesty", /^Z chaty k rybníku ved\p{L}+ \d+ cest\p{L}* a od rybníka k rozhledně \d+ cest\p{L}*\. Kolika různými trasami dojde \p{L}+ od chaty kolem rybníka k rozhledně\?$/u],
  ["L1-zmrzlina", /^Ve stánku mají \d+ příchu\p{L}+ zmrzliny a \d+ druh\p{L}* kornoutu\. Kolik různých zmrzlin s jedním kopečkem si může \p{L}+ koupit\?$/u],
  ["L1-tricka", /^\p{L}+ si vybírá sportovní tričko a obchod nabízí \d+ bar\p{L}+ a \d+ potisk\p{L}*\. Kolik různých triček s jednou barvou a jedním potiskem si může vybrat\?$/u],
  ["L1-snidane", /^\p{L}+ má doma \d+ druh\p{L}* pečiva, \d+ nápoj\p{L}* a \d+ druh\p{L}* ovoce\. Kolik různých snídaní z jednoho pečiva, jednoho nápoje a jednoho ovoce může sestavit\?$/u],
  ["L1-trasa", /^Z domu k náměstí ved\p{L}+ \d+ cest\p{L}*, odtud k parku \d+ a od parku ke škole \d+\. Kolika různými trasami může \p{L}+ dojít do školy\?$/u],
];

const CISLICE_RE = /z číslic ([\d, a]+), když se číslice v čísle (nesmějí|smějí) opakovat\?$/;
const sadaCislic = (s: string) => cislaVTextu(s);

const PODMINKY: Record<string, (c: number) => boolean> = {
  "lichá": (c) => c % 2 === 1,
  "sudá": (c) => c % 2 === 0,
  "větší než 5": (c) => c > 5,
  "menší než 4": (c) => c < 4,
};

// ── Hádanka ───────────────────────────────────────────────────────────────
type Vyrok = { typ: "ano" | "ne"; kdo: string; co: string };
const V = "(?:hraje na|hraje|má)";
const NEG_RE: RegExp[] = [
  /^(?<kdo>\p{L}+) (?:nehraje na|nehraje|nemá) (?<co>\p{L}+)\.$/u,
  new RegExp(`^(?:Ten, kdo|Ta, která) ${V} (?<co>\\p{L}+), je starší než (?<kdo>\\p{L}+)\\.$`, "u"),
  new RegExp(`^(?<kdo>\\p{L}+) chodí do jiné třídy než (?:ten, kdo|ta, která) ${V} (?<co>\\p{L}+)\\.$`, "u"),
  new RegExp(`^(?<kdo>\\p{L}+) si včera půjčila? sešit od (?:toho, kdo|té, která) ${V} (?<co>\\p{L}+)\\.$`, "u"),
];
/** Věk: „Ten, kdo má X, je starší než Y“ → hrana držitel X → Y. */
const STARSI_RE = new RegExp(`^(?:Ten, kdo|Ta, která) ${V} (?<co>\\p{L}+), je starší než (?<kdo>\\p{L}+)\\.$`, "u");
const POS_RE = /^(?:Na )?(?<co>\p{L}+) (?:hraje|má) (?<kdo>\p{L}+)\.$/u;

function parseVyrok(s: string): Vyrok {
  for (const re of NEG_RE) {
    const m = s.match(re);
    if (m) return { typ: "ne", kdo: m.groups!.kdo, co: m.groups!.co };
  }
  const m = s.match(POS_RE);
  expect(m, `nerozpoznaný výrok: "${s}"`).toBeTruthy();
  return { typ: "ano", kdo: m!.groups!.kdo, co: m!.groups!.co.toLowerCase() };
}

function permutace<T>(a: T[]): T[][] {
  if (a.length <= 1) return [a];
  return a.flatMap((x, i) => permutace([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]));
}

const HADANKA_RE =
  /^(.+) jsou kamarád(?:i|ky) a každ[ýá] z nich (?:hraje jiný sport|má jiné zvíře|hraje na jiný nástroj): (.+?)\. (.+) Kdo (?:hraje na|hraje|má) (\p{L}+)\?$/u;

function vyresHadanku(m: RegExpMatchArray): string {
  const jmena = m[1].split(/, | a /);
  const veci = m[2].split(/, | nebo /);
  expect(jmena).toHaveLength(4);
  expect(veci).toHaveLength(4);
  const vyroky = m[3].split(/(?<=\.) (?=\p{Lu})/u).map(parseVyrok);
  expect(vyroky.length, m[0]).toBeGreaterThanOrEqual(3);
  for (const v of vyroky) {
    expect(jmena, `neznámé jméno ve výroku: ${v.kdo}`).toContain(v.kdo);
    expect(veci, `neznámá věc ve výroku: ${v.co}`).toContain(v.co);
  }
  const reseni = permutace(veci).filter((p) =>
    vyroky.every((v) => {
      const maKdo = p[jmena.indexOf(v.kdo)];
      return v.typ === "ano" ? maKdo === v.co : maKdo !== v.co;
    }),
  );
  expect(reseni.length, `hádanka nemá jediné řešení: ${m[0]}`).toBe(1);
  // Věty o věku si v nalezeném řešení nesmějí odporovat (žádný kruh A > B > … > A).
  const hrany = m[3].split(/(?<=\.) (?=\p{Lu})/u).flatMap((s) => {
    const g = s.match(STARSI_RE)?.groups;
    return g ? [[reseni[0].indexOf(g.co), jmena.indexOf(g.kdo)] as [number, number]] : [];
  });
  const dosazitelne = (a: number, b: number, h = 0): boolean =>
    h < 5 && hrany.some(([x, y]) => x === a && (y === b || dosazitelne(y, b, h + 1)));
  for (const a of range(0, 3)) expect(dosazitelne(a, a), `kruh ve věku: ${m[0]}`).toBe(false);
  expect(m[0], "vztahy, které odporují kamarádství").not.toMatch(/sourozen|sestry|bydlí vedle/);
  return jmena[reseni[0].indexOf(m[4])];
}

// ── Šablony podle úrovní ──────────────────────────────────────────────────
const SABLONY: Record<1 | 2 | 3, Sablona[]> = {
  1: L1_RE.map(([id, re]) => ({ id, re, vyres: (_m, q) => String(vycetVyberu(cislaVTextu(q))) })),
  2: [
    {
      id: "L2-cisla",
      re: /^Kolik různých (dvojmístných|trojmístných) čísel můžeš sestavit z číslic ([\d, a]+), když se číslice v čísle (nesmějí|smějí) opakovat\?$/,
      vyres: (m) => {
        const [min, max] = m[1] === "dvojmístných" ? [10, 99] : [100, 999];
        return String(vycetCisel(min, max, sadaCislic(m[2]), m[3] === "smějí"));
      },
    },
    {
      id: "L2-zavod",
      re: /^Na startu závodu stojí (\d+) \p{L}+\. Kolika různými způsoby mohou být obsazena první (dvě|tři) místa\?$/u,
      vyres: (m) => {
        const n = Number(m[1]);
        const mist = m[2] === "tři" ? 3 : 2;
        let t: number[][] = [[]];
        for (let k = 0; k < mist; k++) t = t.flatMap((x) => range(1, n).filter((r) => !x.includes(r)).map((r) => [...x, r]));
        return String(t.length);
      },
    },
    {
      id: "L2-kod",
      re: /^Kód skříňky se skládá z jednoho písmene a jedné číslice za ním\. Písmeno je ([A-Z, a-z]+) a číslice musí být (lichá|sudá|větší než 5|menší než 4)\. Kolik různých kódů je možných\?$/,
      vyres: (m) => {
        const pismena = m[1].match(/\b[A-Z]\b/g)!;
        const kody: string[] = [];
        for (const p of pismena) for (const c of range(0, 9)) if (PODMINKY[m[2]](c)) kody.push(`${p}${c}`);
        return String(new Set(kody).size);
      },
    },
  ],
  3: [
    {
      id: "L3-dvojice",
      re: /^(?:Na oslavě se sešlo (\d+) kamarád|Turnaje ve florbale se účastní (\d+) družst|Ve skupince je (\d+) žák|Na mapě je (\d+) měst)/u,
      vyres: (m) => {
        const n = Number(m[1] ?? m[2] ?? m[3] ?? m[4]);
        const dvojice = new Set<string>();
        for (const a of range(1, n)) for (const b of range(1, n)) if (a !== b) dvojice.add([a, b].sort((x, y) => x - y).join("-"));
        return String(dvojice.size);
      },
    },
    {
      id: "L3-podminka",
      re: /^Kolik (sudých dvojmístných čísel|dvojmístných čísel dělitelných pěti) můžeš sestavit z číslic ([\d, a]+), když se číslice v čísle (nesmějí|smějí) opakovat\?$/,
      vyres: (m) => {
        const podm = m[1].startsWith("sudých") ? (x: number) => x % 2 === 0 : (x: number) => x % 5 === 0;
        return String(vycetCisel(10, 99, sadaCislic(m[2]), m[3] === "smějí", podm));
      },
    },
    {
      id: "L3-vybor",
      re: /^Výbor třídy tvoří (\d+) dív\p{L}+ a (\d+) chlap\p{L}+\. Volí se předseda a místopředseda a každou funkci dostane jiný člen výboru\. Předsedou musí být (dívka|chlapec), místopředsedou může být kterýkoli jiný člen výboru\. Kolika způsoby lze obě funkce obsadit\?$/u,
      vyres: (m) => {
        const clenove = [
          ...range(1, Number(m[1])).map(() => "dívka"),
          ...range(1, Number(m[2])).map(() => "chlapec"),
        ];
        let pocet = 0;
        clenove.forEach((p, i) => clenove.forEach((_, j) => { if (i !== j && p === m[3]) pocet++; }));
        return String(pocet);
      },
    },
    { id: "L3-hadanka", re: HADANKA_RE, vyres: (m) => vyresHadanku(m) },
  ],
};

function vyres(level: 1 | 2 | 3, t: PracticeTask): Sablona {
  const s = SABLONY[level].find((x) => x.re.test(t.question));
  expect(s, `L${level}: otázka neodpovídá žádné šabloně své úrovně: "${t.question}"`).toBeDefined();
  const m = t.question.match(s!.re)!;
  const vysledek = s!.vyres(m, t.question);
  const shodne = t.options!.filter((o) => o === vysledek);
  expect(shodne, `L${level}: výčtu musí odpovídat právě jedna možnost: "${t.question}" [${t.options}] výčet=${vysledek}`).toHaveLength(1);
  expect(t.correctAnswer, `L${level}: klíč nesouhlasí s výčtem: "${t.question}"`).toBe(vysledek);
  return s!;
}

const tokeny = (text: string): string[] => (text.match(/\d+/g) ?? []);
const jeJmeno = (s: string) => /^\p{L}+$/u.test(s);

describe("Kombinační úsudek — metadata", () => {
  it("je matematika 6. ročníku, select_one, RVP labely znak po znaku", () => {
    expect(topic.id).toBe("g6-mat-logicke-uvahy-kombinacni-usudek-6");
    expect(topic.subject).toBe("matematika");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.rvpNodeId).toBe(
      "g6-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-logicke-uvahy-kombinacni-usudek",
    );
    expect(topic.category).toBe("Nestandardní aplikační úlohy a problémy");
    expect(topic.topic).toBe("Logické úlohy");
    expect(topic.studentTitle).toBe("Kolik je možností?");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3] as const)("Kombinační úsudek — L%i", (level) => {
  const behy = Array.from({ length: BEHU }, () => topic.generator(level));
  const vse = behy.flat();

  it("nezávislý solver (výčet): klíč sedí a výsledku odpovídá právě jedna možnost", () => {
    for (const t of vse) vyres(level, t);
  });

  it("≥12 unikátních úloh v každém běhu", () => {
    for (const tasks of behy) expect(pocetUnikatnich(tasks)).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, feedback u každého distraktoru, vysvětlení s kroky", () => {
    for (const t of vse) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options).toContain(t.correctAnswer);
      const fb = t.optionFeedback ?? {};
      expect(Object.keys(fb)).not.toContain(t.correctAnswer);
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
        expect(fb[o], `chybí feedback pro "${o}": ${t.question}`).toBeTruthy();
      }
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.solutionSteps!.length, t.question).toBeGreaterThanOrEqual(2);
    }
  });

  it("klíč není ve znění otázky (číselný klíč; jména jsou výčet všech možností)", () => {
    for (const t of vse) {
      if (jeJmeno(t.correctAnswer)) {
        for (const o of t.options!) expect(t.question, "výčtová otázka jmenuje všechny možnosti").toContain(o);
      } else {
        expect(tokeny(t.question), t.question).not.toContain(t.correctAnswer);
      }
    }
  });

  it("nápovědy neprozradí klíč a jsou dvě různé", () => {
    for (const t of vse) {
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        if (jeJmeno(t.correctAnswer)) {
          for (const o of t.options!) expect(h, `hint jmenuje dítě: ${h}`).not.toContain(o);
        } else {
          expect(tokeny(h), `hint obsahuje klíč: ${h}`).not.toContain(t.correctAnswer);
        }
      }
    }
  });

  it("číselný klíč není systematicky největší ani nejmenší možnost", () => {
    const ciselne = vse.filter((t) => !jeJmeno(t.correctAnswer));
    const krajni = ciselne.filter((t) => {
      const o = t.options!.map(num);
      const k = num(t.correctAnswer);
      return k === Math.max(...o) || k === Math.min(...o);
    }).length;
    const limit = level === 3 ? 0.3 : 0.7;
    expect(krajni / ciselne.length).toBeLessThanOrEqual(limit);
  });

  it("texty bez mocnin, zlomků, záporných čísel a rodových lomítek", () => {
    for (const t of vse) {
      const texty = [
        t.question, ...t.options!, ...t.hints!, ...(t.solutionSteps ?? []), t.explanation ?? "",
        ...Object.values(t.optionFeedback ?? {}),
      ];
      for (const x of texty) {
        expect(x, x).not.toMatch(/[²³−]|\d\s*\/\s*\d|\(a\)|\d{4,}/);
        expect(x, x).not.toMatch(/undefined|NaN|\$\{/);
      }
    }
  });
});

describe("Kombinační úsudek — gradace a pokrytí", () => {
  it("šablony úrovní jsou disjunktní a každá úroveň používá všechny své šablony", () => {
    const pouzite: Record<number, Set<string>> = { 1: new Set(), 2: new Set(), 3: new Set() };
    const otazky: Record<number, Set<string>> = { 1: new Set(), 2: new Set(), 3: new Set() };
    for (const level of [1, 2, 3] as const) {
      for (let i = 0; i < BEHU; i++) {
        for (const t of topic.generator(level)) {
          pouzite[level].add(vyres(level, t).id);
          otazky[level].add(t.question);
        }
      }
      expect([...pouzite[level]].sort()).toEqual(SABLONY[level].map((s) => s.id).sort());
    }
    for (const a of [1, 2, 3] as const) {
      for (const b of [1, 2, 3] as const) {
        if (a === b) continue;
        for (const q of otazky[a]) {
          expect(SABLONY[b].some((s) => s.re.test(q)), `L${a} otázka pasuje na L${b}: ${q}`).toBe(false);
        }
      }
      const texty1 = otazky[1];
      for (const q of otazky[3]) expect(texty1.has(q)).toBe(false);
    }
  });

  it("L1: součet se od součinu vždy liší; L2 výsledky do 120; L3 dvojice n = 5–9", () => {
    for (let i = 0; i < BEHU; i++) {
      for (const t of topic.generator(1)) {
        const c = cislaVTextu(t.question);
        expect(c.reduce((a, b) => a + b, 0), t.question).not.toBe(c.reduce((a, b) => a * b, 1));
      }
      for (const t of topic.generator(2)) expect(num(t.correctAnswer), t.question).toBeLessThanOrEqual(120);
      for (const t of topic.generator(3)) {
        const m = t.question.match(SABLONY[3][0].re);
        if (m) {
          const n = Number(m[1] ?? m[2] ?? m[3] ?? m[4]);
          expect(n).toBeGreaterThanOrEqual(5);
          expect(n).toBeLessThanOrEqual(9);
        }
      }
    }
  });

  it("L3 hádanka: klíč se střídá a feedback cituje porušený výrok nebo vyvozený fakt", () => {
    const klice = new Set<string>();
    for (let i = 0; i < BEHU * 2; i++) {
      for (const t of topic.generator(3)) {
        if (!jeJmeno(t.correctAnswer)) continue;
        klice.add(t.correctAnswer);
        for (const [o, why] of Object.entries(t.optionFeedback ?? {})) {
          expect(why, o).toMatch(/porušuje výrok „|z výroků vyplývá, že/);
          if (why.includes("porušuje výrok")) {
            const citovany = why.match(/„(.+?)“/)![1];
            expect(t.question, why).toContain(citovany);
          }
        }
      }
    }
    expect(klice.size).toBeGreaterThanOrEqual(6);
  });

  it("L3 sezení (prvních 6 úloh) střídá typy: „každý s každým“ nejvýš jednou, aspoň tři typy", () => {
    for (let i = 0; i < BEHU; i++) {
      const sezeni = topic.generator(3).slice(0, 6);
      const typy = sezeni.map((t) => vyres(3, t).id);
      expect(typy.filter((x) => x === "L3-dvojice").length, typy.join()).toBeLessThanOrEqual(1);
      expect(new Set(typy).size, typy.join()).toBeGreaterThanOrEqual(3);
    }
  });

  it("nápovědy bez strojového dodatku a bez obecné zkoušky", () => {
    for (const level of [1, 2, 3] as const) {
      for (const t of topic.generator(level)) {
        for (const h of t.hints!) expect(h, h).not.toMatch(/Čísla ze zadání|zkouškou|nezapomeň na nulu/);
      }
    }
  });

  it("hádanka zmiňuje v nápovědě jen typy výroků, které v zadání opravdu jsou", () => {
    for (let i = 0; i < BEHU * 2; i++) {
      for (const t of topic.generator(3)) {
        if (!jeJmeno(t.correctAnswer)) continue;
        const text = [t.hints![1], t.explanation].join(" ");
        if (/o věku/.test(text)) expect(t.question).toMatch(/je starší než/);
        if (/o třídě/.test(text)) expect(t.question).toMatch(/do jiné třídy/);
        if (/o půjčeném sešitu/.test(text)) expect(t.question).toMatch(/sešit od/);
      }
    }
  });

  it("výčet sám sebe ověří na známých případech", () => {
    expect(vycetCisel(10, 99, [0, 3, 5, 7], false)).toBe(9);
    expect(vycetCisel(10, 99, [2, 5, 7, 8], true)).toBe(16);
    expect(vycetCisel(10, 99, [0, 2, 5, 8], false, (x) => x % 5 === 0)).toBe(5);
    expect(vycetVyberu([3, 4])).toBe(12);
  });
});
