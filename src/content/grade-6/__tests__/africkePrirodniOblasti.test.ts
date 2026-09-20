import { describe, it, expect } from "vitest";
import { AFRICKE_PRIRODNI_OBLASTI } from "../zemepis/africkePrirodniOblasti";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Africké přírodní oblasti — Sahara, savany, deštné lesy (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): klasifikátor klíčových slov nad TEXTEM
 * OTÁZKY, ne nad parametry generátoru.
 *  • popisy a otázky „která oblast“ — tabulka OBLAST → znaky; z textu se
 *    určí právě jedna oblast (víc oblastí najednou = nejednoznačný klíč) a
 *    klíč se porovná s jejím jménem;
 *  • stanice — z textu se vytáhne šířka a srážky a rozhodne se pravidlem
 *    {desítky mm → poušť, stovky s obdobím dešťů → savana, tisíce → les}
 *    plus kontrola polohy;
 *  • vegetace a způsob života — profil srážek z popisu → očekávaná odpověď;
 *  • pořadí pásů — pořadí zmíněných oblastí v klíči musí být monotónní
 *    podle směru cesty (suchost: les 0 < savana 1 < poušť 2);
 *  • zvířata — vlastní tabulka zvíře → oblast;
 *  • fakta a příčiny — vlastní predikáty na klíč a na distraktory.
 */
const topic = AFRICKE_PRIRODNI_OBLASTI[0];

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

type R = "P" | "S" | "L";
const NAME: Record<R, string> = { P: "poušť", S: "savana", L: "deštný les" };
const CIZI = ["středomořské pobřeží", "vysokohorská oblast"];
const DRYNESS: Record<R, number> = { L: 0, S: 1, P: 2 };
const NAME_RE: [RegExp, R][] = [
  [/deštný les/g, "L"],
  [/savana/g, "S"],
  [/poušť/g, "P"],
];

const KW: Record<R, RegExp> = {
  P: /sahar|prší nejméně|oáz|karavan|písečn|kamenit|50 mm|stanech|velbloud|drobné listy|duny|pustin|hlubokých studní|jednou za několik let/i,
  S: /travnat|akáci|střídá období sucha|safari|období sucha ztrácejí|zežloutne|stáda|pastevec|osamělé stromy|požár/i,
  L: /rovník|nejvíc druhů|korunách|opice|papoušc|kakaov|2 000 mm|patrech/i,
};

/** Právě jedna oblast, na kterou ukazují klíčová slova; jinak null (nejednoznačné). */
function oblastZTextu(q: string): R | null {
  const hit = (["P", "S", "L"] as R[]).filter((r) => KW[r].test(q));
  return hit.length === 1 ? hit[0] : null;
}

/** Zvíře → oblast (vlastní tabulka, psaná nezávisle na generátoru). */
const ZVIRE_OBLAST: Record<string, R> = {
  velbloud: "P", fenek: "P", škorpion: "P",
  slon: "S", žirafa: "S", zebra: "S", lev: "S", antilopa: "S", nosorožec: "S",
  gorila: "L", šimpanz: "L", okapi: "L",
};
const GEN_TO_R: Record<string, R> = { "pouště": "P", "savany": "S", "deštného lesa": "L" };

const num = (s: string): number => Number(s.replace(/[\s ]/g, "").replace("−", "-").replace(",", "."));

/** Pořadí zmíněných oblastí v textu (podle jmen z tabulky). */
function poradi(text: string): R[] {
  const out: { i: number; r: R }[] = [];
  for (const [re, r] of NAME_RE) {
    for (const m of text.matchAll(re)) out.push({ i: m.index!, r });
  }
  return out.sort((a, b) => a.i - b.i).map((x) => x.r);
}

function jeMonotonni(seq: R[], smer: "sucheji" | "vlhceji"): boolean {
  if (seq.length !== 2 || seq[0] === seq[1]) return false;
  const d = seq.map((r) => DRYNESS[r]);
  return smer === "sucheji" ? d[0] < d[1] : d[0] > d[1];
}

// ── profil srážek z popisu (L2 vegetace / život) ───────────────────────────
function profil(q: string): R | null {
  if (/každý měsíc vydatně prší|déšť padá skoro každý den|do všech měsíců/.test(q)) return "L";
  if (/jen pár měsíců|Část roku tam vydatně|střídá období dešťů a období sucha/.test(q)) return "S";
  if (/vzácně|zlomek srážek|velmi málo srážek/.test(q)) return "P";
  return null;
}
function profilZivot(q: string): R | null {
  if (/kde téměř neprší|málo vody a nejvíc lidí bydlí kolem pramenů/.test(q)) return "P";
  if (/hodně trávy pro zvířata|rozlehlými pastvinami/.test(q)) return "S";
  if (/hustým lesem|vysoké stromy/.test(q)) return "L";
  return null;
}
const VEG_KEY: Record<R, RegExp> = { L: /stále zelený les/, S: /^tráva/, P: /keře/ };
const ZIV_KEY: Record<R, RegExp> = { P: /karavany/, S: /pastva dobytka/, L: /těžba dřeva/ };

// ── fakta (predikáty na klíč + kontrola distraktorů) ───────────────────────
const FAKTA: [RegExp, (k: string) => boolean, (d: string) => boolean][] = [
  [/^Co platí o Sahaře/, (k) => /horká poušť/.test(k) && /severu/.test(k), (d) => !(/horká poušť/.test(d) && /severu/.test(d))],
  [/^Jaký povrch má Sahara/, (k) => /jen část/.test(k) && /kámen/.test(k), (d) => !/jen část/.test(d)],
  [/teplota během dne a noci/, (k) => /^Ve dne .*horko.*v noci .*ochladí/.test(k), (d) => !/^Ve dne .*horko.*v noci .*ochladí/.test(d)],
  [/^Co je oáza/, (k) => /voda/.test(k) && /rostou/.test(k), (d) => !(/voda/.test(d) && /rostou/.test(d))],
  [/^Co roste v savaně/, (k) => /^Tráva/.test(k) && /roztroušen/.test(k), (d) => !/^Tráva/.test(d)],
  [/deštném lese v Africe/, (k) => /stále zelený/.test(k) && /vlhk/.test(k), (d) => !/stále zelený/.test(d)],
  [/povodí které řeky/, (k) => k === "Kongo", (d) => d !== "Kongo"],
  [/části Afriky leží Sahara/, (k) => k === "na severu kontinentu", (d) => !/severu/.test(d)],
  [/Proč se africké přírodní oblasti řadí/, (k) => /ubývá srážek/.test(k), (d) => !/ubývá srážek/.test(d)],
  [/zvířata savany táhnou/, (k) => /vyschne/.test(k) && /vod/.test(k), (d) => !/vyschne/.test(d)],
  [/usazují hlavně u oáz/, (k) => /voda/.test(k), (d) => !/voda/.test(d)],
  [/pod stromy šero/, (k) => /koruny/i.test(k) && /vysokých/.test(k), (d) => !/koruny/i.test(d)],
  [/Proč se velbloud hodí/, (k) => /vydrží bez pití/.test(k) && /široké nohy/.test(k), (d) => !(/vydrží bez pití/.test(d) && /široké nohy/.test(d))],
  [/dezertifikace/, (k) => /^Poušť se rozšiřuje/.test(k) && /úrodná krajina/.test(k), (d) => !/^Poušť se rozšiřuje/.test(d)],
  [/Sahelu.*rozšiřuje/, (k) => /sucha/.test(k) && /pastvou/.test(k) && /kácením/.test(k), (d) => !/pastv/.test(d)],
  [/vykácejí kus deštného lesa/, (k) => /živiny/i.test(k) && /vyplaví/.test(k), (d) => !/živiny/i.test(d)],
  [/vykácí velká plocha/, (k) => /Mizí domov/.test(k) && /odplaví/.test(k), (d) => !/Mizí domov/.test(d)],
  [/U studny v Sahelu/, (k) => /obnaží/.test(k) && /vítr/.test(k), (d) => !/obnaží/.test(d)],
  [/pás keřů a stromů/, (k) => /Kořeny drží půdu/.test(k), (d) => !/Kořeny drží půdu/.test(d)],
];

type Vysledek = { kind: string; ok: boolean; detail?: string };

function jeVyber(t: PracticeTask): boolean {
  const jm = Object.values(NAME);
  const nazvy = t.options!.filter((o) => jm.includes(o));
  return nazvy.length === 3 && t.options!.filter((o) => CIZI.includes(o)).length === 1;
}

function solve(t: PracticeTask): Vysledek | null {
  const q = t.question;
  const key = t.correctAnswer;
  const opts = t.options!;

  // A) zvířata
  const za = q.match(/^Které zvíře patří do (pouště|savany|deštného lesa)\?/);
  if (za) {
    const kdo = GEN_TO_R[za[1]];
    const ok = ZVIRE_OBLAST[key] === kdo
      && opts.filter((o) => o !== key).every((o) => ZVIRE_OBLAST[o] !== undefined && ZVIRE_OBLAST[o] !== kdo);
    return { kind: "zvire", ok, detail: `${key} → ${kdo}` };
  }

  // B) stanice podle šířky a srážek
  if (/^Stanice v Africe stojí na/.test(q)) {
    const lat = q.match(/(\d+)° ([sj])\. š\./);
    const mm = q.match(/([\d\s ]+) mm srážek/);
    expect(lat && mm, q).toBeTruthy();
    const fi = Number(lat![1]) * (lat![2] === "j" ? -1 : 1);
    const srazky = num(mm![1]);
    let ocek: R | null = null;
    if (srazky <= 100) ocek = "P";
    else if (srazky >= 1500) ocek = "L";
    else if (srazky >= 500 && srazky <= 1300 && /skoro všechny za \d+ měsíc/.test(q)) ocek = "S";
    if (!ocek) return { kind: "stanice", ok: false, detail: `srážky ${srazky} nespadají do žádné oblasti` };
    // poloha musí s oblastí souhlasit
    const absFi = Math.abs(fi);
    const polohaOk = ocek === "L" ? absFi <= 5 : ocek === "S" ? absFi >= 6 && absFi <= 15 : fi >= 20 && fi <= 30;
    return { kind: "stanice", ok: polohaOk && key === NAME[ocek], detail: `čekám ${NAME[ocek]}, poloha ${fi}` };
  }

  // C) pořadí pásů
  if (/^Vydáš se z/.test(q)) {
    const smer = /na sever k obratníku/.test(q) ? "sucheji" : "vlhceji";
    const kOk = jeMonotonni(poradi(key), smer);
    const dOk = opts.filter((o) => o !== key).every((o) => !jeMonotonni(poradi(o), smer));
    return { kind: "pasy", ok: kOk && dOk, detail: `${smer}: ${poradi(key).join("")}` };
  }

  // D) vegetace a způsob života (L2)
  if (/Jaká vegetace tam roste\?$/.test(q)) {
    const p = profil(q);
    if (!p) return { kind: "vegetace", ok: false, detail: "profil nerozpoznán" };
    const ok = VEG_KEY[p].test(key) && opts.filter((o) => o !== key).every((o) => !VEG_KEY[p].test(o));
    return { kind: "vegetace", ok, detail: p };
  }
  if (/^(Čím se|Jak se živí|Jak lidé)/.test(q) && /(živí|využívají)/.test(q)) {
    const p = profilZivot(q);
    if (!p) return { kind: "zivot", ok: false, detail: "profil nerozpoznán" };
    const ok = ZIV_KEY[p].test(key) && opts.filter((o) => o !== key).every((o) => !ZIV_KEY[p].test(o));
    return { kind: "zivot", ok, detail: p };
  }

  // E) faktické otázky s vlastním predikátem
  for (const [re, kOk, dOk] of FAKTA) {
    if (re.test(q)) {
      const ok = kOk(key) && opts.filter((o) => o !== key).every(dOk);
      return { kind: "fakt", ok, detail: key };
    }
  }

  // F) „která oblast“ — klíč je jméno oblasti, oblast se určí z klíčových slov v otázce
  if (jeVyber(t)) {
    const o = oblastZTextu(q);
    if (!o) return { kind: "oblast", ok: false, detail: "nejednoznačné nebo žádné klíčové slovo" };
    return { kind: "oblast", ok: key === NAME[o] && !CIZI.includes(key), detail: `čekám ${NAME[o]}` };
  }
  return null;
}

const levels = [1, 2, 3] as const;
const vzorky = Object.fromEntries(
  levels.map((l) => [l, [11, 22, 33, 44, 55].flatMap((s) => withSeed(s, () => topic.generator(l)))]),
) as Record<1 | 2 | 3, PracticeTask[]>;

describe("Africké přírodní oblasti — metadata", () => {
  it("zeměpis g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-zem-africke-prirodni-oblasti-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Regiony světa");
    expect(topic.topic).toBe("Afrika");
    expect(topic.rvpNodeId).toBe("g6-zemepis-regiony-sveta-afrika-africke-prirodni-oblasti-sahara-savany-destne-lesy");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(levels)("Africké přírodní oblasti — L%i", (level) => {
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

  it("klíč není ve znění ani v nápovědě, obě nápovědy jsou unikátní a druhá je delší", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), t.question).toBe(false);
      expect(t.hints!.length).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(t.hints![1].length, t.question).toBeGreaterThanOrEqual(t.hints![0].length * 1.2);
      for (const h of t.hints!) expect(h.includes(t.correctAnswer), `hint leak: ${t.question}`).toBe(false);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("nápovědy nepřepisují klíč jeho klíčovými slovy (ani parafrází)", () => {
    const zakazano: RegExp[] = [
      /trnit|holá půda|holé půdy/i, /hustý stále zelený/i, /roztroušen/i,
      /karavan|velbloud|datl/i, /dobytk|safari|turist/i, /těžb|dřev|banán|kakao/i,
    ];
    for (const t of tasks) {
      const k = solve(t);
      if (!k || !["vegetace", "zivot"].includes(k.kind)) continue;
      const klic = zakazano.filter((re) => re.test(t.correctAnswer));
      for (const re of klic) {
        for (const h of t.hints!) expect(h, `nápověda parafrázuje klíč: ${t.question}`).not.toMatch(re);
      }
    }
  });

  it("nápověda k velbloudovi neopakuje klíč", () => {
    for (const t of tasks.filter((x) => /velbloud hodí/.test(x.question))) {
      for (const h of t.hints!) expect(h, t.question).not.toMatch(/vydrž|široké chodidlo|široké nohy|vytrvalost/i);
    }
  });

  it("žádná mapa ani obrázek, jen slova a souřadnice", () => {
    for (const t of tasks) {
      expect(t.question).not.toMatch(/mapě|mapu|mapa|obrázk|na snímku/);
      for (const o of t.options!) expect(o).not.toMatch(/mapě|obrázk/);
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

  it("znění otázky není příliš dlouhé", () => {
    for (const t of tasks) {
      const slov = t.question.trim().split(/\s+/).length;
      expect(slov, t.question).toBeLessThanOrEqual(level === 3 ? 30 : 25);
    }
  });

  it("v prvních šesti úlohách se žádná nezopakuje", () => {
    for (const seed of [7, 19, 41, 55, 101]) {
      const sezeni = withSeed(seed, () => topic.generator(level)).slice(0, 6);
      expect(new Set(sezeni.map((t) => t.question)).size, `seed ${seed}`).toBe(sezeni.length);
    }
  });
});

describe("Africké přírodní oblasti — gradace, rodiny úloh a determinismus", () => {
  it("L1, L2 a L3 mají disjunktní znění otázek", () => {
    const l1 = new Set(vzorky[1].map((t) => t.question));
    const l2 = new Set(vzorky[2].map((t) => t.question));
    expect(vzorky[3].filter((t) => l1.has(t.question))).toEqual([]);
    expect(vzorky[3].filter((t) => l2.has(t.question))).toEqual([]);
    expect(vzorky[2].filter((t) => l1.has(t.question))).toEqual([]);
  });

  it("L3 nepoužívá vzory otázek z L1", () => {
    for (const t of vzorky[3]) {
      expect(t.question, t.question).not.toMatch(/^(Která africká oblast|V které africké oblasti|Ve které africké oblasti|Do které|Co platí|Které zvíře|Co je |Co roste|Jaký povrch)/);
    }
  });

  it("L1 obsahuje zvířata, otázky na oblast i fakta; L1 nemá číselné stanice", () => {
    const jedno = withSeed(7, () => topic.generator(1));
    expect(jedno.filter((t) => solve(t)?.kind === "zvire").length).toBeGreaterThanOrEqual(3);
    expect(jedno.filter((t) => solve(t)?.kind === "oblast").length).toBeGreaterThanOrEqual(4);
    expect(jedno.filter((t) => solve(t)?.kind === "fakt").length).toBeGreaterThanOrEqual(4);
    expect(jedno.filter((t) => /^Stanice/.test(t.question))).toEqual([]);
  });

  it("v prvních šesti úlohách L1 jsou nejvýš dvě otázky na zvířata", () => {
    for (const seed of [7, 19, 41, 55, 101]) {
      const sezeni = withSeed(seed, () => topic.generator(1)).slice(0, 6);
      expect(sezeni.filter((t) => /^Které zvíře/.test(t.question)).length, `seed ${seed}`).toBeLessThanOrEqual(2);
    }
  });

  it("L2 obsahuje vegetaci, způsob života, pásy i příčiny", () => {
    const jedno = withSeed(7, () => topic.generator(2));
    for (const [kind, min] of [["vegetace", 4], ["zivot", 3], ["pasy", 2], ["fakt", 4]] as const) {
      expect(jedno.filter((t) => solve(t)?.kind === kind).length, kind).toBeGreaterThanOrEqual(min);
    }
  });

  it("L3 obsahuje popisy, číselné stanice i příčiny", () => {
    const jedno = withSeed(7, () => topic.generator(3));
    expect(jedno.filter((t) => solve(t)?.kind === "oblast").length, "popisy").toBeGreaterThanOrEqual(6);
    expect(jedno.filter((t) => solve(t)?.kind === "stanice").length, "stanice").toBeGreaterThanOrEqual(6);
    expect(jedno.filter((t) => solve(t)?.kind === "fakt").length, "příčiny").toBeGreaterThanOrEqual(3);
  });

  it("L3 stanice obsahuje všechny tři oblasti a obě polokoule", () => {
    const st = withSeed(7, () => topic.generator(3)).filter((t) => /^Stanice/.test(t.question));
    for (const r of Object.values(NAME)) expect(st.some((t) => t.correctAnswer === r), r).toBe(true);
    expect(st.some((t) => /j\. š\./.test(t.question)), "jižní polokoule").toBe(true);
    expect(st.some((t) => /s\. š\./.test(t.question)), "severní polokoule").toBe(true);
  });

  it("žádný popis není nejednoznačný: klíčová slova ukazují na jedinou oblast", () => {
    const popisy = vzorky[3].filter((t) => /O jakou oblast Afriky jde\?$/.test(t.question));
    expect(popisy.length).toBeGreaterThan(0);
    for (const t of popisy) expect(oblastZTextu(t.question), t.question).not.toBeNull();
  });

  it("L3 vysvětluje příčinu a zásah, který L1 nezná", () => {
    const priciny = vzorky[3].filter((t) => solve(t)?.kind === "fakt");
    expect(priciny.length).toBeGreaterThan(0);
    for (const t of priciny) expect(t.question, t.question).toMatch(/Sahel|deštn|Proč|Co se stane|Co to způsobí/);
  });

  it("gen() je deterministický a bez stavu modulu", () => {
    const otisk = () => JSON.stringify(levels.map((l) => topic.generator(l).map((t) => [t.question, t.correctAnswer])));
    const a = withSeed(123, otisk);
    Math.random(); Math.random();
    const b = withSeed(123, otisk);
    expect(b).toBe(a);
  });
});
