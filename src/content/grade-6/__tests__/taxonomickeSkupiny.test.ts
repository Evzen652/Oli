import { describe, it, expect } from "vitest";
import { TAXONOMICKE_SKUPINY } from "../prirodopis/taxonomickeSkupiny";
import type { PracticeTask } from "@/lib/types";

/**
 * Třídění organismů — taxonomické skupiny (faktický select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, nesdílí logiku generátoru):
 *  (1) RANK — vlastní pořadí kategorií. Ze znění L1 vytáhne kategorii a směr
 *      (pod/nad, nejširší/nejužší) a klíč spočítá jako rank ± 1 nebo min/max.
 *  (2) SYS — vlastní přepsaná tabulka zařazení zástupců. Solver najde jména ve
 *      znění a v možnostech a počítá nejhlubší společnou kategorii; u
 *      „nejblíž příbuzný“ hlídá, že klíč má OSTŘE největší hloubku.
 *  (3) Klasifikátor klíčových slov pro „zařazení podle znaků“.
 *  (4) Tabulka hlavních skupin pro L1 „do které hlavní skupiny patří“.
 * Ve všech případech musí vyhovět PRÁVĚ jedna možnost a ta = correctAnswer.
 */
const topic = TAXONOMICKE_SKUPINY[0];

// ── (1) RANK ────────────────────────────────────────────────────────────────
const RANK: Record<string, number> = { "říše": 0, kmen: 1, "třída": 2, "řád": 3, "čeleď": 4, rod: 5, druh: 6 };
const NAZEV = Object.keys(RANK).sort((a, b) => RANK[a] - RANK[b]);
/** tvary kategorií ve znění (2. a 4. pád) → rank */
const TVAR: Record<string, number> = {
  "říše": 0, "říši": 0, kmen: 1, kmene: 1, "třídu": 2, "třídy": 2, "třídě": 2,"řád": 3, "řádu": 3,
  "čeleď": 4, "čeledi": 4, rod: 5, rodu: 5, druh: 6, druhu: 6,
};

// ── (2) SYS: druh → [kmen, třída, řád, čeleď, rod] (říše = živočichové) ─────
const SYS: Record<string, [string, string, string, string, string]> = {
  "vlk obecný": ["strunatci", "savci", "šelmy", "psovití", "vlk"],
  "liška obecná": ["strunatci", "savci", "šelmy", "psovití", "liška"],
  "kočka divoká": ["strunatci", "savci", "šelmy", "kočkovití", "kočka"],
  "rys ostrovid": ["strunatci", "savci", "šelmy", "kočkovití", "rys"],
  "kuna lesní": ["strunatci", "savci", "šelmy", "lasicovití", "kuna"],
  "kuna skalní": ["strunatci", "savci", "šelmy", "lasicovití", "kuna"],
  "jezevec lesní": ["strunatci", "savci", "šelmy", "lasicovití", "jezevec"],
  "zajíc polní": ["strunatci", "savci", "zajícovci", "zajícovití", "zajíc"],
  "králík divoký": ["strunatci", "savci", "zajícovci", "zajícovití", "králík"],
  "veverka obecná": ["strunatci", "savci", "hlodavci", "veverkovití", "veverka"],
  "myš domácí": ["strunatci", "savci", "hlodavci", "myšovití", "myš"],
  "kapr obecný": ["strunatci", "ryby", "máloostní", "kaprovití", "kapr"],
  "štika obecná": ["strunatci", "ryby", "štikotvární", "štikovití", "štika"],
  "okoun říční": ["strunatci", "ryby", "ostnoploutví", "okounovití", "okoun"],
  "skokan hnědý": ["strunatci", "obojživelníci", "žáby", "skokanovití", "skokan"],
  "ropucha obecná": ["strunatci", "obojživelníci", "žáby", "ropuchovití", "ropucha"],
  "kachna divoká": ["strunatci", "ptáci", "vrubozobí", "kachnovití", "kachna"],
  "sýkora koňadra": ["strunatci", "ptáci", "pěvci", "sýkorovití", "sýkora"],
  "vrabec domácí": ["strunatci", "ptáci", "pěvci", "vrabcovití", "vrabec"],
  "včela medonosná": ["členovci", "hmyz", "blanokřídlí", "včelovití", "včela"],
  "čmelák zemní": ["členovci", "hmyz", "blanokřídlí", "včelovití", "čmelák"],
  "mravenec lesní": ["členovci", "hmyz", "blanokřídlí", "mravencovití", "mravenec"],
  "babočka paví oko": ["členovci", "hmyz", "motýli", "babočkovití", "babočka"],
  "křižák obecný": ["členovci", "pavoukovci", "pavouci", "křižákovití", "křižák"],
};
const DRUHY = Object.keys(SYS);
/** Plný řetězec [říše … druh]. */
const plny = (d: string) => ["živočichové", ...SYS[d], d];
/** Počet shodných kategorií pod říší (0 = jen říše, 5 = rod) — počítáno porovnáním zleva. */
function spolecne(a: string, b: string): number {
  const pa = plny(a), pb = plny(b);
  let r = 0;
  while (r + 1 < 6 && pa[r + 1] === pb[r + 1]) r++;
  return r;
}
const druhVTextu = (s: string): string => {
  const hit = DRUHY.filter((d) => s.toLowerCase().includes(d));
  expect(hit, `druh ve „${s}“`).toHaveLength(1);
  return hit[0];
};

// ── (3) Klasifikátor znaků (první shoda vyhrává) ────────────────────────────
const ZNAKY: [RegExp, string][] = [
  [/peří/, "ptáci"],
  [/srst|koj|mlék/, "savci"],
  [/pulci|holou vlhkou kůži/, "obojživelníci"],
  [/šest nohou/, "hmyz"],
  [/osm nohou/, "pavoukovci"],
  [/dva páry tykadel/, "korýši"],
  [/mnoho článků/, "stonožky"],
  [/žábr.*šupin|šupin.*žábr/, "ryby"],
  [/šupin.*plícemi/, "plazi"],
];

// ── (4) Hlavní skupiny organismů ────────────────────────────────────────────
const SKUPINA: [RegExp, string][] = [
  [/hřib|bedla|muchomůrka|kvasinka|plíseň/, "houby"],
  [/mech|přeslička|rosnatka/, "rostliny"],
  [/trepka|měňavka/, "prvoci"],
  [/sinice/, "bakterie"],
  [/nezmar|houba mycí|sasanka koňská/, "živočichové"],
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}" (${opts.join(" | ")})`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };
  let m: RegExpMatchArray | null;

  // L1 (a) soused v posloupnosti
  if ((m = q.match(/hned (pod|nad) kategorií „(.+)“\?$/))) {
    const r = RANK[m[2]] + (m[1] === "pod" ? 1 : -1);
    return one("soused", opts.filter((o) => o === NAZEV[r]));
  }
  // L1 (b) nejširší / nejužší
  if ((m = q.match(/Která z těchto čtyř je (nejširší|nejužší)\?$/))) {
    const ranks = opts.map((o) => RANK[o]);
    const cil = m[1] === "nejširší" ? Math.min(...ranks) : Math.max(...ranks);
    return one("krajní", opts.filter((o) => RANK[o] === cil));
  }
  // L1 (c) hlavní skupina
  if ((m = q.match(/^Do které hlavní skupiny organismů patří (.+)\?$/))) {
    const s = SKUPINA.filter(([re]) => re.test(m![1]));
    expect(s, q).toHaveLength(1);
    return one("hlavní skupina", opts.filter((o) => o === s[0][1]));
  }
  // L2 (a) kategorie údaje
  if ((m = q.match(/k nejužší: (.+)\. Do které kategorie patří údaj „(.+)“\?$/))) {
    const retez = m[1].split(", ");
    expect(retez).toHaveLength(7);
    expect(retez, `zařazení v otázce odpovídá tabulce: ${q}`).toEqual(plny(retez[6]));
    const i = retez.indexOf(m[2]);
    expect(retez.lastIndexOf(m[2]), q).toBe(i);
    return one("kategorie údaje", opts.filter((o) => o === NAZEV[i]));
  }
  // L2 (b) stejný řád, jiná čeleď
  if ((m = q.match(/^(.+?) patří do řádu .*Který z těchto živočichů patří do stejného řádu, ale do jiné čeledi\?$/))) {
    const R = druhVTextu(m[1]);
    return one("stejný řád", opts.filter((o) => SYS[o][2] === SYS[R][2] && SYS[o][3] !== SYS[R][3]));
  }
  // L2 (c) dvojice se společnou kategorií, ale ne další
  if ((m = q.match(/^(?:Zařazení \(řád, čeleď, rod\): (.+?)\. )?Která dvojice živočichů má společn\S+ (\S+), ale ne (\S+)\?$/))) {
    const r1 = TVAR[m[2]];
    expect(TVAR[m[3]], q).toBe(r1 + 1);
    // od r1 ≥ 2 zadání uvádí zařazení; musí sedět s vlastní tabulkou
    expect(Boolean(m[1]), `zařazení v zadání: ${q}`).toBe(r1 >= 2);
    if (m[1]) {
      for (const polozka of m[1].split("; ")) {
        const [druh, udaje] = polozka.split(" – ");
        expect(udaje.split(", "), polozka).toEqual(SYS[druh].slice(2));
      }
    }
    const par = (o: string): [string, string] => {
      const p = DRUHY.flatMap((a) => DRUHY.filter((b) => `${a} a ${b}` === o).map((b) => [a, b] as [string, string]));
      expect(p, o).toHaveLength(1);
      return p[0];
    };
    return one("dvojice", opts.filter((o) => spolecne(...par(o)) === r1));
  }
  // L3 (a) co jistě plyne ze společné kategorie
  if ((m = q.match(/^(.+) a (.+) patří do stejné(?:ho)? (\S+)\. Co z toho o nich jistě víme\?$/))) {
    const s = TVAR[m[3]];
    expect(spolecne(druhVTextu(m[1]), druhVTextu(m[2])), `dvojice opravdu sdílí ${m[3]}: ${q}`).toBe(s);
    const sirsi = new Set(NAZEV.slice(0, s));
    const vyhovuje = (o: string) => {
      const mm = o.match(/^Mají společn\S+ i (.+)\.$/);
      if (!mm) return false;
      const kat = mm[1].split(/, | a /).map((x) => TVAR[x]);
      if (kat.some((x) => x === undefined)) return false;
      return kat.length === sirsi.size && kat.every((x) => x < s);
    };
    return one("jistě víme", opts.filter(vyhovuje));
  }
  // L3 (b) nejbližší příbuzný
  if ((m = q.match(/^Se kterým z těchto živočichů je (.+) nejblíž příbuzn[áý]\?$/))) {
    const A = druhVTextu(m[1]);
    const h = opts.map((o) => spolecne(A, o));
    const max = Math.max(...h);
    expect(max, `příbuznost nejvýš na úroveň řádu: ${q}`).toBeLessThanOrEqual(3);
    expect(h.filter((x) => x === max), `remíza v příbuznosti: ${q}`).toHaveLength(1);
    return one("příbuzný", opts.filter((o, i) => h[i] === max));
  }
  // L3 (c) zařazení podle znaků
  if ((m = q.match(/^Popis neznámého živočicha: (.+)\. Do které třídy ho zařadíš\?$/))) {
    const z = ZNAKY.find(([re]) => re.test(m![1]));
    expect(z, `klasifikátor: ${q}`).toBeDefined();
    return one("znaky", opts.filter((o) => o === z![1]));
  }
  // L3 (d) počty druhů
  if ((m = q.match(/^Určit\S+ (\S+) \S+ zahrnuje (\d+) druh\S*\. Co jistě víme o počtu druhů v (\S+) ([^\s,?]+)/))) {
    const n = m[2];
    const prvni = RANK[m[1]];
    const druha = TVAR[m[4]];
    const doSirsi = m[3] === "celé" || m[3] === "celém";
    // do širší: druhá skupina musí být opravdu širší; do užší naopak
    expect(doSirsi ? druha < prvni : druha > prvni, q).toBe(true);
    const re = doSirsi ? new RegExp(`^${n} druh\\S* nebo víc$`) : new RegExp(`^nejvýš ${n} druh\\S*$`);
    return one("počet druhů", opts.filter((o) => re.test(o)));
  }
  throw new Error(`solver nezná znění: ${q}`);
}

const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");

function seeded(seed = 0x9e3779b9): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("Taxonomické skupiny — metadata", () => {
  it("přírodopis g6, select_one, category/topic znak po znaku", () => {
    expect(topic.id).toBe("g6-pri-taxonomicke-skupiny-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Obecná biologie");
    expect(topic.topic).toBe("Vznik a vývoj života");
    expect(topic.rvpNodeId).toBe("g6-prirodopis-obecna-biologie-vznik-a-vyvoj-zivota-trideni-organismu-taxonomicke-skupiny");
    expect(topic.studentTitle).toBe("Jak třídíme živé organismy");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Taxonomické skupiny — level %i", (level) => {
  const bank = Array.from({ length: 4 }, () => topic.generator(level));
  const tasks = bank[0];
  const vse = bank.flat();

  it("≥12 unikátních úloh, jen select_one se 4 různými možnostmi", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of vse) {
      expect(t.options, t.question).toBeDefined();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, t.question).toContain(t.correctAnswer);
      expect(t.explanation, t.question).toBeTruthy();
      expect(/undefined|NaN|\$\{/.test(JSON.stringify(t)), `rozbitá šablona: ${t.question}`).toBe(false);
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of vse) {
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s druhou cestou (právě 1 správná)", () => {
    for (const t of vse) {
      const v = solve(t);
      expect(t.correctAnswer, `${v.kind}: ${t.question}`).toBe(v.expected);
    }
  });

  it("klíč není ve znění ani v nápovědách; nápovědy v sadě unikátní a různé", () => {
    for (const set of bank) {
      const h0 = new Set<string>();
      const h1 = new Set<string>();
      for (const t of set) {
        const key = t.correctAnswer.toLowerCase();
        expect(t.question.toLowerCase().includes(key), `giveaway: ${t.question}`).toBe(false);
        expect(t.hints!.length).toBe(2);
        for (const h of t.hints!) expect(h.toLowerCase().includes(key), `hint leak (${key}): ${h}`).toBe(false);
        expect(t.hints![0]).not.toBe(t.hints![1]);
        expect(h0.has(t.hints![0]), `opakovaná malá nápověda: ${t.hints![0]}`).toBe(false);
        expect(h1.has(t.hints![1]), `opakovaná velká nápověda: ${t.hints![1]}`).toBe(false);
        h0.add(t.hints![0]);
        h1.add(t.hints![1]);
      }
    }
  });

  it("klíč nevyčnívá délkou ani prvním slovem", () => {
    let klic = 0;
    let distr = 0;
    for (const t of vse) {
      const podleDelky = [...t.options!].sort((a, b) => b.length - a.length);
      if (podleDelky[0].length >= 1.25 * podleDelky[1].length) {
        if (podleDelky[0] === t.correctAnswer) klic++;
        else distr++;
      }
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      const vycniva = jine[0].length >= 3 && new Set(jine).size === 1 && jine[0] !== prvni(t.correctAnswer);
      expect(vycniva, `klíč vyčnívá prvním slovem: ${t.question}`).toBe(false);
    }
    const vzorec = klic / vse.length >= 0.35 && klic >= 2.5 * Math.max(1, distr);
    expect(vzorec, `klíč výrazně nejdelší ${klic}× / distraktor ${distr}×`).toBe(false);
  });

  it("determinismus: se stejným seedem dvě volání dají stejné úlohy", () => {
    const otisk = () => {
      const puvodni = Math.random;
      Math.random = seeded();
      try {
        return JSON.stringify(topic.generator(level).map((t) => [t.question, t.correctAnswer]));
      } finally {
        Math.random = puvodni;
      }
    };
    const a = otisk();
    for (let i = 0; i < 7; i++) Math.random();
    expect(otisk()).toBe(a);
  });
});

describe("Taxonomické skupiny — gradace", () => {
  const q = [1, 2, 3].map((l) => new Set(Array.from({ length: 3 }, () => topic.generator(l)).flat().map((t) => t.question)));

  it("znění L1, L2 a L3 jsou disjunktní", () => {
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L3 nepoužívá slovník L1 (žebříček, nejširší, říše)", () => {
    for (const x of q[2]) expect(/žebříč|nejširší|nejužší|říš/i.test(x), x).toBe(false);
  });

  it("L3 obsahuje všechny čtyři typy úvahy", () => {
    const typy = [/jistě víme\?$/, /nejblíž příbuzn/, /^Popis neznámého/, /počtu druhů/];
    for (const re of typy) expect([...q[2]].some((x) => re.test(x)), String(re)).toBe(true);
  });

  it("zajícovci a hlodavci se nikdy nepárují", () => {
    const all = [2, 3].flatMap((l) => topic.generator(l));
    for (const t of all) {
      if (/dvojice/.test(t.question)) {
        for (const o of t.options!) {
          expect(/zajíc|králík/.test(o) && /veverka|myš/.test(o), o).toBe(false);
        }
      }
      if (/nejblíž příbuzn|patří do stejné/.test(t.question)) {
        const a = /zajíc|králík/.test(t.question), b = /veverka|myš/.test(t.question);
        if (a) expect(t.options!.some((o) => /veverka|myš/.test(o)), t.question).toBe(false);
        if (b) expect(t.options!.some((o) => /zajíc|králík/.test(o)), t.question).toBe(false);
      }
    }
  });
});
