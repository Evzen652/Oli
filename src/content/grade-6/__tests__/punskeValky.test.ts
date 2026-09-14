import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PUNSKE_VALKY_DOBYTI_STREDOMORI } from "../dejepis/punskeValky";
import type { PracticeTask } from "@/lib/types";

/**
 * Punské války a dobytí Středomoří — faktický select_one vzor 2. stupně.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky faktů, nezávislé na bankách generátoru):
 *  (a) FAKT-TABULKA entit (válka, strana, rok, výsledek) + pravidla „znění otázky → podmínka“;
 *      z tabulky se odvodí klíč a ověří, že právě jedna možnost vyhovuje.
 *  (b) RANK — chronologie: vyšší rok př. n. l. = starší.
 *  (c) VÝPOČTY — dva letopočty ze znění, |a − b|, mezivýsledek v solutionSteps
 *      a distraktory = modelované chyby (a + b, ±1, +10).
 *  (d) strukturní kontroly a u L3 klasifikátor klíčových slov.
 * Generátor vrací celou banku, takže test je deterministický výčet.
 */
const topic = PUNSKE_VALKY_DOBYTI_STREDOMORI[0];

// (a) fakt-tabulka
type Strana = "Řím" | "Kartágo" | "jiná";
interface Entita {
  re: RegExp;
  typ: "osoba" | "bitva" | "událost" | "národ" | "místo" | "pojem" | "rok" | "válka" | "cesta";
  valka: 0 | 1 | 2 | 3;
  strana?: Strana;
  rok?: number;
  vysledekRima?: "vítězství" | "porážka";
  tags?: string[];
}
const E: Record<string, Entita> = {
  hannibal: { re: /^Hannibal$/, typ: "osoba", valka: 2, strana: "Kartágo", tags: ["alpy", "kanny-vitez", "zama-porazeny"] },
  scipio: { re: /^Scipio$/, typ: "osoba", valka: 2, strana: "Řím", tags: ["zama-vitez", "afrika"] },
  hamilkar: { re: /^Hamilkar Barkas$/, typ: "osoba", valka: 1, strana: "Kartágo", tags: ["otec"] },
  cato: { re: /^Cato starší$/, typ: "osoba", valka: 3, strana: "Řím", tags: ["senát-zničit"] },
  caesar: { re: /^Julius Caesar$/, typ: "osoba", valka: 0, strana: "Řím" },
  alexandr: { re: /^Alexandr Veliký$/, typ: "osoba", valka: 0, strana: "jiná" },
  kanny: { re: /Kann$/, typ: "bitva", valka: 2, rok: 216, vysledekRima: "porážka", tags: ["itálie"] },
  zama: { re: /Zamy$/, typ: "bitva", valka: 2, rok: 202, vysledekRima: "vítězství", tags: ["afrika"] },
  marathon: { re: /Marathónu$/, typ: "bitva", valka: 0, rok: 490 },
  thermopyly: { re: /Thermopyl$/, typ: "bitva", valka: 0, rok: 480 },
  sicilieBoje: { re: /^Boje o Sicílii$/, typ: "událost", valka: 1 },
  zniceniKartaga: { re: /^Zničení Kartága$/, typ: "událost", valka: 3, rok: 146 },
  zniceniKorintu: { re: /^Zničení Korintu$/, typ: "událost", valka: 3, rok: 146, tags: ["řecko"] },
  fenicane: { re: /^Féničané$/, typ: "národ", valka: 0, tags: ["zakladatel"] },
  sicilie: { re: /^Sicílie$/, typ: "místo", valka: 1, tags: ["ostrov", "západ"] },
  kartago: { re: /^Kartágo$/, typ: "místo", valka: 3, tags: ["afrika", "město"] },
  korint: { re: /^Korint$/, typ: "místo", valka: 3, tags: ["řecko", "město"] },
  provincie: { re: /^Provincie$/, typ: "pojem", valka: 1, tags: ["řím-území"] },
  naseMore: { re: /^Naše moře$/, typ: "pojem", valka: 0, tags: ["mare-nostrum"] },
  rok146: { re: /^146 př\. n\. l\.$/, typ: "rok", valka: 3, tags: ["zničení"] },
  alpy: { re: /^Přešel s vojskem a slony přes Alpy$|^Pochod po souši přes hory do severní Itálie$/, typ: "cesta", valka: 2, tags: ["alpy"] },
  hispanie: { re: /^Z Hispánie$/, typ: "místo", valka: 2, tags: ["start"] },
  afrikaPobrezi: { re: /^Na pobřeží severní Afriky$/, typ: "místo", valka: 0, tags: ["sídlo-kartága"] },
  kartaginec: { re: /^Kartaginský vojevůdce$/, typ: "pojem", valka: 2, strana: "Kartágo", tags: ["hannibal-role"] },
  punske: { re: /^Punské války$/, typ: "válka", valka: 0, tags: ["řím-kartágo"] },
};
/** Válku rozhodla Zama (vítězství Říma). */
const VITEZ_2_VALKY = E.zama.vysledekRima === "vítězství" ? "Řím" : "Kartágo";
const entity = (o: string): Entita | undefined => Object.values(E).find((e) => e.re.test(o));
const ordinal = (o: string): number | null =>
  /^V(e)? první/.test(o) ? 1 : /^V(e)? druhé/.test(o) ? 2 : /^V(e)? třetí/.test(o) ? 3 : /^V(e)? /.test(o) ? 0 : null;

/** Znění otázky → podmínka nad entitou možnosti (odvozeno z fakt-tabulky). */
const PRAVIDLA: [RegExp, (o: string, e: Entita | undefined) => boolean][] = [
  [/^Kdo byl Hannibal/, (_o, e) => !!e?.tags?.includes("hannibal-role") && e.strana === E.hannibal.strana],
  [/národ založil Kartágo/, (_o, e) => !!e?.tags?.includes("zakladatel")],
  [/^Kde leželo Kartágo/, (_o, e) => !!e?.tags?.includes("sídlo-kartága")],
  [/ostrov se vedla 1\. punská/, (_o, e) => e?.typ === "místo" && e.valka === 1 && !!e.tags?.includes("ostrov")],
  [/porazil Hannibala u Zamy/, (_o, e) => !!e?.tags?.includes("zama-vitez")],
  [/^Kdo v římském senátu .*zničeno/, (_o, e) => !!e?.tags?.includes("senát-zničit")],
  [/^Jak Římané nazývali dobyté území mimo Itálii/, (_o, e) => !!e?.tags?.includes("řím-území")],
  [/nazývali Středozemní moře/, (_o, e) => !!e?.tags?.includes("mare-nostrum")],
  [/roku Římané zničili Kartágo/, (_o, e) => e?.typ === "rok" && E.zniceniKartaga.rok === 146 && !!e.tags?.includes("zničení")],
  [/Čím Hannibal .*překvapil/, (_o, e) => e?.typ === "cesta" && !!e.tags?.includes("alpy")],
  [/Hannibalův otec/, (_o, e) => !!e?.tags?.includes("otec") && e.strana === "Kartágo"],
  [/války, které vedl Řím s Kartágem/, (_o, e) => !!e?.tags?.includes("řím-kartágo")],
  [/roku 216 př\. n\. l\. rozdrtil/, (_o, e) => e?.typ === "bitva" && e.rok === 216 && e.vysledekRima === "porážka"],
  [/obklíčili v jižní Itálii .*celou válku/, (o) => {
    const [misto, valka] = o.split(", ");
    const e = entity(misto);
    return e?.typ === "bitva" && e.vysledekRima === "porážka" && !!e.tags?.includes("itálie") && valka === `válku nakonec vyhrál ${VITEZ_2_VALKY}`;
  }],
  [/přenesl válku do Afriky/, (_o, e) => e?.typ === "osoba" && e.strana === "Řím" && !!e.tags?.includes("afrika")],
  [/Ze které země vyrazil Hannibal/, (_o, e) => !!e?.tags?.includes("start")],
  [/Jakou cestu z Hispánie do Itálie/, (_o, e) => e?.typ === "cesta" && !!e.tags?.includes("alpy")],
  [/událost patří do 2\. punské/, (_o, e) => (e?.typ === "bitva" || e?.typ === "událost") && e.valka === 2],
  [/událost patří do 1\. punské/, (_o, e) => (e?.typ === "bitva" || e?.typ === "událost") && e.valka === 1],
  [/Mezi roky 149 a 146 .*severní Africe/, (_o, e) => e?.typ === "místo" && e.valka === 3 && !!e.tags?.includes("afrika")],
  [/poprvé naučil bojovat na moři/, (o) => ordinal(o) === E.sicilieBoje.valka],
  [/dobyli Kartágo a srovnali/, (o) => ordinal(o) === E.zniceniKartaga.valka],
];

// (b) rank-tabulka stáří
const RANK: Record<string, number> = { "bitva u kann": 216, "bitva u zamy": 202, "zničení kartága": 146 };
const RANK_KRATKE: Record<string, number> = { "přechod alp": 218, kanny: 216, zama: 202 };

// (d) L3 klasifikátor
const L3_TVRZENI: [RegExp, RegExp][] = [
  [/musel postavit loďstvo/, /moř|lod|ostrov/],
  [/po souši přes hory/, /moře.*loďstvo/],
  [/vyhrál bitvu u Kann, ale válku/, /nevzdal.*posily/],
  [/Cato starší v senátu/, /Afriku/],
  [/nebylo vojensky silné/, /bohatlo obchodem/],
  [/třetí punská válka lišila/, /nehrozilo.*zničení/],
  [/co Římu přinesla vítězství/, /^Provincie, obilí, stříbro/],
  [/Kartágo i řecký Korint/, /západ .*Řecko/],
  [/kdyby Řím po první punské válce neovládal moře/, /připlout/],
  [/první římskou provincií se stala Sicílie/, /u Itálie.*obilí/],
  [/vyslal vojsko přímo do Afriky/, /vrátit se domů/],
  [/„naše moře“/, /neměli silného soupeře/],
  [/Kartágo i Athény byly silné na moři/, /loďstvo/],
];

type Verdict = { kind: string; expected: string };

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };

  // (b) chronologie + rozdíl
  if (/^Co proběhlo dřív/.test(q)) {
    const ql = q.toLowerCase();
    const ev = Object.keys(RANK).filter((e) => ql.includes(e));
    expect(ev, q).toHaveLength(2);
    for (const e of ev) {
      const m = ql.match(new RegExp(`${e} \\((\\d+) př`));
      expect(Number(m![1]), `letopočet ${e}`).toBe(RANK[e]);
    }
    const [starsi, mladsi] = RANK[ev[0]] > RANK[ev[1]] ? ev : [ev[1], ev[0]];
    const diff = RANK[starsi] - RANK[mladsi];
    expect(t.solutionSteps!.join(" "), q).toContain(`${RANK[starsi]} − ${RANK[mladsi]} = ${diff}`);
    return one("pořadí", opts.filter((o) => o.toLowerCase().startsWith(starsi) && new RegExp(`\\bo ${diff} (rok|roky|let) dřív$`).test(o)));
  }
  // (b2) pořadí tří událostí
  if (/^Které pořadí je správné od nejstarší/.test(q)) {
    for (const [e, rok] of Object.entries({ "bitva u zamy": 202, "přechod alp": 218, "bitva u kann": 216 })) {
      expect(q.toLowerCase(), q).toContain(`${e} (${rok} př`);
    }
    const spravne = Object.entries(RANK_KRATKE).sort((x, y) => y[1] - x[1]).map(([k]) => k).join(", ");
    return one("pořadí3", opts.filter((o) => o.toLowerCase() === spravne));
  }
  // (c) výpočet z čísel ve znění
  if (/^Kolik let/.test(q)) {
    const nums = (q.match(/\b\d{3}\b/g) ?? []).map(Number);
    expect(nums, q).toHaveLength(2);
    const [a, b] = nums;
    const diff = Math.abs(a - b);
    expect(t.solutionSteps!.join(" "), q).toContain(`${Math.max(a, b)} − ${Math.min(a, b)} = ${diff}`);
    const cislo = (o: string) => Number(o.split(" ")[0]);
    const modelovane = new Set([a + b, diff + 1, diff - 1, diff + 10]);
    for (const o of opts.filter((x) => x !== t.correctAnswer)) {
      expect(modelovane.has(cislo(o)), `nemodelovaný distraktor "${o}" v ${q}`).toBe(true);
      expect(cislo(o)).not.toBe(diff);
    }
    return one("délka", opts.filter((o) => cislo(o) === diff));
  }
  // (a) fakta
  const pravidla = PRAVIDLA.filter(([re]) => re.test(q));
  if (pravidla.length) {
    expect(pravidla, `víc pravidel pro "${q}"`).toHaveLength(1);
    return one("fakt", opts.filter((o) => pravidla[0][1](o, entity(o))));
  }
  // (d) L3
  const tvrz = L3_TVRZENI.filter(([re]) => re.test(q));
  expect(tvrz, `L3 klasifikátor pro "${q}"`).toHaveLength(1);
  return one("tvrzení", opts.filter((o) => tvrz[0][1].test(o)));
}

const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");

function rvpLabels(id: string): { area: string; topic: string } {
  const data = JSON.parse(readFileSync(join(process.cwd(), "data", "rvp_data.json"), "utf8"));
  let found: { area: string; topic: string } | null = null;
  const walk = (n: unknown) => {
    if (found || !n || typeof n !== "object") return;
    const o = n as Record<string, unknown>;
    if (o.id === id && o.labels) found = o.labels as { area: string; topic: string };
    for (const v of Object.values(o)) walk(v);
  };
  walk(data);
  expect(found, `RVP uzel ${id}`).not.toBeNull();
  return found!;
}

describe("Punské války — metadata", () => {
  it("dějepis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.rvpNodeId).toBe("g6-dejepis-starovek-antika-rim-punske-valky-dobyti-stredomori");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Antika - Řím");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Punské války — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh, jen select_one se 4 různými možnostmi", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, t.question).toContain(t.correctAnswer);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s druhou cestou (právě 1 správná)", () => {
    for (const t of tasks) {
      const v = solve(t);
      expect(t.correctAnswer, `${v.kind}: ${t.question}`).toBe(v.expected);
    }
  });

  it("klíč není ve znění ani v nápovědách; nápovědy unikátní", () => {
    const h0 = new Set<string>();
    const h1 = new Set<string>();
    for (const t of tasks) {
      const key = t.correctAnswer.toLowerCase();
      expect(t.question.toLowerCase().includes(key), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints!.length).toBe(2);
      for (const h of t.hints!) expect(h.toLowerCase().includes(key), `hint leak: ${h}`).toBe(false);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(h0.has(t.hints![0]), `opakovaná malá nápověda: ${t.hints![0]}`).toBe(false);
      expect(h1.has(t.hints![1]), `opakovaná velká nápověda: ${t.hints![1]}`).toBe(false);
      h0.add(t.hints![0]);
      h1.add(t.hints![1]);
    }
  });

  it("klíč nevyčnívá délkou ani prvním slovem", () => {
    let nejdelsi = 0;
    let sumKlic = 0;
    let maxDistr = 0;
    for (const t of tasks) {
      const podleDelky = [...t.options!].sort((a, b) => b.length - a.length);
      if (podleDelky[0] === t.correctAnswer && podleDelky[0].length >= 1.25 * podleDelky[1].length) nejdelsi++;
      sumKlic += t.correctAnswer.length;
      for (const o of t.options!) if (o !== t.correctAnswer) maxDistr = Math.max(maxDistr, o.length);
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      const vycniva = jine[0].length >= 2 && new Set(jine).size === 1 && jine[0] !== prvni(t.correctAnswer);
      expect(vycniva, `klíč vyčnívá prvním slovem: ${t.question}`).toBe(false);
    }
    expect(sumKlic / tasks.length).toBeLessThanOrEqual(maxDistr);
    expect(nejdelsi / tasks.length, "klíč je výrazně nejdelší příliš často").toBeLessThan(0.35);
  });

  it("žádné lomítkové rodové tvary; všechny texty vyplněné", () => {
    for (const t of tasks) {
      const texty = [t.question, t.explanation ?? "", ...t.options!, ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) {
        expect(/\/a\b|sám\/sama|\bundefined\b|NaN/.test(s), `vadný text: "${s}"`).toBe(false);
      }
    }
  });
});

describe("Punské války — gradace a L3", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L3 klíčová slova: Kanny nejsou porážka Hannibala, loďstvo souvisí s mořem", () => {
    for (const t of topic.generator(3)) {
      if (/válku přesto prohrál/.test(t.question)) expect(/porážk\w* u Kann|u Kann utrpěl/.test(t.correctAnswer)).toBe(false);
      if (/postavit loďstvo/.test(t.question)) expect(/moř|lod|ostrov/.test(t.correctAnswer)).toBe(true);
    }
  });

  it("L1 je dotaz jménem, L3 příčina / důsledek / výrok / srovnání", () => {
    for (const t of topic.generator(1)) expect(/^(Kdo|Který|Kde|Jak|Kterého|O který|Čím)/.test(t.question), t.question).toBe(true);
    for (const t of topic.generator(3)) expect(/^(Proč|Co by|Které tvrzení|Čím se|Cato|Roku|Provincie|Kartágo i)/.test(t.question), t.question).toBe(true);
  });
});
