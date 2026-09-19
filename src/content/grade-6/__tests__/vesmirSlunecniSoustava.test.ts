import { describe, it, expect } from "vitest";
import { VESMIR_SLUNECNI_SOUSTAVA } from "../zemepis/vesmirSlunecniSoustava";
import type { PracticeTask } from "@/lib/types";

/**
 * Vesmír, Sluneční soustava, Země jako planeta — faktické select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta) — z generátoru neimportuje ani tabulku planet,
 * ani nic jiného než hotové úlohy. Má vlastní ručně zapsané tabulky:
 *  • RANK_OD_SLUNCE (Merkur 1 … Neptun 8), RANK_VELIKOSTI (Jupiter 1 … Merkur 8),
 *    SKUPINA (kamenná/obří), MESICE (Merkur a Venuše bez měsíce),
 *  • HVEZDY (Slunce, Polárka, Sirius) pro úlohy o vlastním světle,
 *  • klasifikátor druhu tělesa podle klíčových slov popisu,
 *  • tabulku hierarchie (planeta < hvězda < soustava < galaxie),
 *  • tabulku faktů otázka → klíč u pevných bank (pohyby Země, výjimečnost
 *    Země, pozorování oblohy).
 * Podmínky u pořadí a u dvojitých podmínek parsuje ze ZNĚNÍ otázky, vyhodnotí
 * je na všech osmi planetách a ověří, že podmínku splňuje právě jedna možnost.
 */
const topic = VESMIR_SLUNECNI_SOUSTAVA[0];

// ── Ručně zapsané tabulky solveru ───────────────────────────────────────────
const RANK_OD_SLUNCE: Record<string, number> = {
  Merkur: 1, Venuše: 2, Země: 3, Mars: 4, Jupiter: 5, Saturn: 6, Uran: 7, Neptun: 8,
};
const RANK_VELIKOSTI: Record<string, number> = {
  Jupiter: 1, Saturn: 2, Uran: 3, Neptun: 4, Země: 5, Venuše: 6, Mars: 7, Merkur: 8,
};
const SKUPINA: Record<string, "kamenná" | "obří"> = {
  Merkur: "kamenná", Venuše: "kamenná", Země: "kamenná", Mars: "kamenná",
  Jupiter: "obří", Saturn: "obří", Uran: "obří", Neptun: "obří",
};
const MESICE: Record<string, boolean> = {
  Merkur: false, Venuše: false, Země: true, Mars: true,
  Jupiter: true, Saturn: true, Uran: true, Neptun: true,
};
/** 7. pád → 1. pád (v zadání „mezi Merkurem a Zemí“). */
const Z_INSTRUMENTALU: Record<string, string> = {
  Merkurem: "Merkur", Venuší: "Venuše", Zemí: "Země", Marsem: "Mars",
  Jupiterem: "Jupiter", Saturnem: "Saturn", Uranem: "Uran", Neptunem: "Neptun",
};
const PLANETY = Object.keys(RANK_OD_SLUNCE);
const HVEZDY = ["Slunce", "Polárka", "Sirius"];
const RADOVE = ["", "první", "druhá", "třetí", "čtvrtá", "pátá", "šestá", "sedmá", "osmá"];

const podleOd = (n: number) => PLANETY.find((p) => RANK_OD_SLUNCE[p] === n)!;
const podleVel = (n: number) => PLANETY.find((p) => RANK_VELIKOSTI[p] === n)!;

type Pred = (p: string) => boolean;

/** Přeloží slovní podmínku ze znění otázky na predikát nad tabulkami. */
function podminka(text: string): Pred | null {
  let m: RegExpMatchArray | null;
  if ((m = text.match(/obíhá dál od Slunce než (\p{Lu}\p{L}+)/u))) {
    const a = m[1];
    return (p) => RANK_OD_SLUNCE[p] > RANK_OD_SLUNCE[a];
  }
  if ((m = text.match(/obíhá blíž ke Slunci než (\p{Lu}\p{L}+)/u))) {
    const a = m[1];
    return (p) => RANK_OD_SLUNCE[p] < RANK_OD_SLUNCE[a];
  }
  if ((m = text.match(/je větší než (\p{Lu}\p{L}+)/u))) {
    const a = m[1];
    return (p) => RANK_VELIKOSTI[p] < RANK_VELIKOSTI[a];
  }
  if ((m = text.match(/je menší než (\p{Lu}\p{L}+)/u))) {
    const a = m[1];
    return (p) => RANK_VELIKOSTI[p] > RANK_VELIKOSTI[a];
  }
  if (/je kamenná|patří ke kamenným/.test(text)) return (p) => SKUPINA[p] === "kamenná";
  if (/NENÍ kamenná|patří k obřím/.test(text)) return (p) => SKUPINA[p] === "obří";
  if (/NENÍ obří/.test(text)) return (p) => SKUPINA[p] === "kamenná";
  if (/nemá žádný měsíc/.test(text)) return (p) => !MESICE[p];
  if (/má aspoň jeden měsíc/.test(text)) return (p) => MESICE[p];
  return null;
}

/** Jediná možnost, která splní predikát; jinak hlášení o nejednoznačnosti. */
function jedina(t: PracticeTask, ok: Pred): string {
  const hit = t.options!.filter(ok);
  return hit.length === 1 ? hit[0] : `NEJEDNOZNAČNÉ (${hit.length})`;
}

/**
 * Klasifikátor druhu tělesa podle klíčových slov popisu (L3 a).
 * Druh „měsíc“ se napříč úrovněmi jmenuje „přirozená družice“ (shodně s L1).
 */
function druhTelesa(q: string): string | null {
  if (/shoře|shořel|atmosféře/.test(q)) return "Meteor";
  if (/ohon/.test(q)) return "Kometa";
  if (/kolem (?:\p{L}+ )?planety/u.test(q)) return "Přirozená družice";
  if (/nevyčistilo/.test(q)) return "Trpasličí planeta";
  if (/vyčistilo/.test(q)) return "Planeta";
  if (/žhavých plynů|svítí vlastním světlem/.test(q)) return "Hvězda";
  return null;
}

/** Hierarchie: co v čem leží. Souhvězdí stojí mimo řadu (NaN). */
function uroven(o: string): number {
  if (/^Planeta /.test(o)) return 1;
  if (/^Hvězda /.test(o)) return 2;
  if (/^Sluneční soustava/.test(o)) return 3;
  if (/^Galaxie /.test(o)) return 4;
  return NaN;
}

/** Druh tělesa podle jména (L1 b) — ručně zapsaná fakta. */
const DRUH_PODLE_JMENA: [RegExp, string][] = [
  [/je Slunce\?/, "Hvězda"],
  [/je Měsíc\?/, "Přirozená družice"],
  [/je Pluto\?/, "Trpasličí planeta"],
  [/Mléčná dráha\?/, "Galaxie"],
  [/je Venuše/, "Planeta"],
];

/** Pevné banky faktů: znak otázky → vzor, který musí mít právě jedna možnost. */
const FAKTA: [RegExp, RegExp][] = [
  // L1 (a) — znaky, které nejdou spočítat z tabulek
  [/nejvýraznější prstence/, /^Saturn$/],
  [/rudá planeta/, /^Mars$/],
  // L1 (c) — pohyby Země
  [/Jak dlouho trvá, než se Země jednou otočí/, /^Asi 24 hodin$/],
  [/jeden oběh kolem Slunce/, /^Asi 365 dní$/],
  [/Kolem kterého tělesa obíhá Země/, /^Kolem Slunce$/],
  [/pomyslná přímka, kolem které se Země otáčí/, /^Zemská osa$/],
  // L2 (d) — důsledky pohybů
  [/střídá den a noc/, /^Pohyb Země kolem vlastní osy$/],
  [/odpovídá délce jednoho roku/, /^Pohyb Země kolem Slunce$/],
  [/Slunce ráno vychází na východě/, /^Protože se Země otáčí kolem své osy$/],
  [/Na jedné polovině Země je den/, /osvětluje vždy jen polovinu zeměkoule/],
  [/vystřídá den i noc/, /^Asi za 24 hodin$/],
  [/Kolikrát se Země otočí/, /^Asi 365krát$/],
  // L3 (c) — výjimečnost Země
  [/Proč je právě na Zemi život/, /kapalnou vodu/],
  [/Čím se Země liší od všech ostatních planet/, /oceány kapalné vody/],
  [/kdyby Země obíhala mnohem blíž ke Slunci/, /vypařila/],
  [/Mars obíhá dál od Slunce než Země/, /chladno a řídké ovzduší/],
  [/Venuše je skoro stejně velká jako Země/, /přehřívá/],
  [/důležitá její atmosféra/, /^Chrání před škodlivým zářením a udržuje teplo$/],
  // L3 (d) — pozorování oblohy
  [/Měsíc sám nesvítí/, /^Odráží k nám světlo, které na něj dopadá ze Slunce$/],
  [/Proč přes den na obloze nevidíme hvězdy/, /přezáří je Slunce/],
  [/Jitřenku/, /^Je blízko nás a odráží hodně slunečního světla$/],
  [/úplněk a jindy jen jako tenký srpek/, /vidíme jinou část osvětlené poloviny/],
  [/zdá, že se hvězdy na obloze posunou/, /^Země se během noci otáčí kolem své osy$/],
];

/** Vrátí očekávaný klíč, nebo null, když solver úlohu nepozná. */
function solve(t: PracticeTask): string | null {
  const q = t.question;
  let m: RegExpMatchArray | null;

  // L2 (a) — mezi X a Y
  if ((m = q.match(/mezi (\p{Lu}\p{L}+) a (\p{Lu}\p{L}+)\?/u))) {
    const x = Z_INSTRUMENTALU[m[1]], y = Z_INSTRUMENTALU[m[2]];
    if (!x || !y) return null;
    const lo = Math.min(RANK_OD_SLUNCE[x], RANK_OD_SLUNCE[y]);
    const hi = Math.max(RANK_OD_SLUNCE[x], RANK_OD_SLUNCE[y]);
    return jedina(t, (p) => RANK_OD_SLUNCE[p] > lo && RANK_OD_SLUNCE[p] < hi);
  }

  // L3 (b) — dvě podmínky zároveň
  if ((m = q.match(/^Která planeta (.+) a zároveň (.+)\?$/))) {
    const a = podminka(m[1]), b = podminka(m[2]);
    if (!a || !b) return null;
    const vsechny = PLANETY.filter((p) => a(p) && b(p));
    if (vsechny.length !== 1) return `NEJEDNOZNAČNÉ v tabulce (${vsechny.length})`;
    return jedina(t, (p) => a(p) && b(p));
  }

  // L2 (a) — dál / blíž než X, L2 (b) — kamenné × obří
  if (/^Která z nabízených planet/.test(q)) {
    const p = podminka(q);
    return p ? jedina(t, p) : null;
  }

  // L2 (c) — vlastní × odražené světlo
  if (/svítí vlastním světlem\?|samo vyrábí světlo/.test(q)) {
    return jedina(t, (o) => HVEZDY.includes(o));
  }
  if (/Které z nabízených těles samo nesvítí/.test(q)) {
    return jedina(t, (o) => !HVEZDY.includes(o));
  }

  // L1 (a) — znak planety spočítaný z tabulek
  if (/nejblíž Slunci/.test(q)) return podleOd(1);
  if (/nejdál od Slunce/.test(q)) return podleOd(8);
  if (/je největší\?/.test(q)) return podleVel(1);
  if (/je nejmenší\?/.test(q)) return podleVel(8);
  if ((m = q.match(/obíhá jako (\p{L}+) v pořadí od Slunce/u))) {
    const n = RADOVE.indexOf(m[1]);
    return n > 0 ? podleOd(n) : null;
  }
  if (/nejbližší soused Země na straně směrem ke Slunci/.test(q)) {
    return podleOd(RANK_OD_SLUNCE["Země"] - 1);
  }

  // L1 (b) — pojem → druh tělesa
  const druh = DRUH_PODLE_JMENA.find(([re]) => re.test(q));
  if (druh) return druh[1];

  // L1 (d) — hierarchie
  if (/^Co je z nabízených možností (největší|nejmenší)\?$/.test(q)) {
    const rady = t.options!.map(uroven).filter((x) => !Number.isNaN(x));
    const cil = /největší/.test(q) ? Math.max(...rady) : Math.min(...rady);
    return jedina(t, (o) => uroven(o) === cil);
  }
  if (/obsahuje celou Sluneční soustavu/.test(q)) return jedina(t, (o) => uroven(o) === 4);
  if (/patří do Sluneční soustavy/.test(q)) {
    return jedina(t, (o) => /^Planeta /.test(o) || o === "Hvězda Slunce");
  }

  // L3 (a) — neznámé těleso z popisu
  if (/O jaký druh tělesa jde\?|Jak se tento jev nazývá\?|Jak se tato svítící stopa správně nazývá\?/.test(q)) {
    return druhTelesa(q);
  }

  // pevné banky faktů
  const f = FAKTA.find(([re]) => re.test(q));
  if (f) return jedina(t, (o) => f[1].test(o));

  return null;
}

describe("Vesmír a Sluneční soustava — metadata", () => {
  it("zeměpis g6, select_one, správné zařazení", () => {
    expect(topic.id).toBe("g6-zem-vesmir-slunecni-soustava-6");
    expect(topic.rvpNodeId).toBe(
      "g6-zemepis-prirodni-obraz-zeme-vesmir-a-zeme-vesmir-slunecni-soustava-zeme-jako-planeta",
    );
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Přírodní obraz Země");
    expect(topic.topic).toBe("Vesmír a Země");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Vesmír a Sluneční soustava — úroveň %i", (level) => {
  const tasks = topic.generator(level);

  it("≥ 12 unikátních otázek", () => {
    expect(new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}`)).size).toBeGreaterThanOrEqual(12);
  });

  it("téma nemíchá typy: každá úloha má 4 různé možnosti, právě jedna je klíč", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer), t.question).toHaveLength(1);
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
    }
  });

  it("chybový model: feedback pro každý distraktor, ne pro klíč", () => {
    for (const t of tasks) {
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
        expect(t.optionFeedback?.[o], `chybí feedback „${o}“ v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer], t.question).toBeUndefined();
    }
  });

  it("nápovědy dvě a různé, neprozrazují klíč; vysvětlení existuje", () => {
    for (const t of tasks) {
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0], t.question).not.toBe(t.hints![1]);
      for (const h of t.hints!) expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.question, "klíč ve znění otázky").not.toContain(t.correctAnswer);
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      expect(t.correctAnswer, t.question).toBe(s);
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsi = tasks.filter((t) => {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length);
      return t.correctAnswer.length > Math.max(...jine);
    }).length;
    expect(nejdelsi / tasks.length).toBeLessThan(0.5);
  });

  it("determinismus: stejný seed → stejné úlohy", () => {
    const seeded = () => {
      let a = 12345;
      return () => {
        a = (a * 1103515245 + 12345) % 2147483648;
        return a / 2147483648;
      };
    };
    const puvodni = Math.random;
    try {
      Math.random = seeded();
      const x = JSON.stringify(topic.generator(level).map((t) => [t.question, t.correctAnswer]));
      Math.random = seeded();
      const y = JSON.stringify(topic.generator(level).map((t) => [t.question, t.correctAnswer]));
      expect(x).toBe(y);
    } finally {
      Math.random = puvodni;
    }
  });
});

describe("Vesmír a Sluneční soustava — gradace", () => {
  it("znění L1 a L3 jsou disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    for (const t of topic.generator(3)) expect(l1.has(t.question), t.question).toBe(false);
  });

  it("L1 obsahuje všechny čtyři šablony", () => {
    const qs = topic.generator(1).map((t) => t.question);
    expect(qs.some((q) => /Která planeta/.test(q))).toBe(true);
    expect(qs.some((q) => /Jaký druh tělesa|Jaký útvar/.test(q))).toBe(true);
    expect(qs.some((q) => /osy|oběh kolem Slunce/.test(q))).toBe(true);
    expect(qs.some((q) => /z nabízených možností/.test(q))).toBe(true);
  });

  it("L2 obsahuje všechny čtyři šablony", () => {
    const qs = topic.generator(2).map((t) => t.question);
    expect(qs.some((q) => /mezi \p{Lu}|obíhá dál od Slunce než|obíhá blíž ke Slunci než/u.test(q))).toBe(true);
    expect(qs.some((q) => /kamenn|obřím/.test(q))).toBe(true);
    expect(qs.some((q) => /světlem|vyrábí světlo|odraženému světlu/.test(q))).toBe(true);
    expect(qs.some((q) => /den a noc|jednoho roku|vychází na východě|polovině Země|Kolikrát/.test(q))).toBe(true);
  });

  it("L3 obsahuje všechny čtyři šablony", () => {
    const qs = topic.generator(3).map((t) => t.question);
    expect(qs.some((q) => /O jaký druh tělesa jde|nazývá\?/.test(q))).toBe(true);
    expect(qs.some((q) => / a zároveň /.test(q))).toBe(true);
    expect(qs.some((q) => /Zemi život|Země liší|atmosféra|Mars obíhá|Venuše je skoro|oceány/.test(q))).toBe(true);
    expect(qs.some((q) => /nevidíme hvězdy|Jitřenku|úplněk|posunou|jasně zářit/.test(q))).toBe(true);
  });

  it("L3 nejde vyřešit vylučováním: možnosti jsou stejného druhu", () => {
    for (const t of topic.generator(3)) {
      if (!/O jaký druh tělesa jde\?/.test(t.question)) continue;
      const druhy = ["Planeta", "Planetka", "Hvězda", "Přirozená družice", "Umělá družice", "Kometa", "Meteor", "Trpasličí planeta"];
      for (const o of t.options!) expect(druhy, t.question).toContain(o);
    }
  });
});
