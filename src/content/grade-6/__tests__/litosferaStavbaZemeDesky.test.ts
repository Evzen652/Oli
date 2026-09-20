import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  LITOSFERA_STAVBA_ZEME_DESKY,
  POOL_L1,
  POOL_L2,
  POOL_L3,
  VRSTVA_VARIANTY,
  POHYB_VARIANTY,
} from "../zemepis/litosferaStavbaZemeDesky";
import type { PracticeTask } from "@/lib/types";

/**
 * Litosféra — stavba Země, pohyby desek, sopky, zemětřesení (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta). Do polí generátoru nesahá: klíč odvozuje
 * PARSOVÁNÍM znění otázky přes vlastní tabulky.
 *  (a) RANK HLOUBKY {zemská kůra 1, zemský plášť 2, vnější jádro 3, vnitřní
 *      jádro 4} — u otázek „která vrstva leží hned pod / nad X“ spočítá rank±1
 *      a vybere možnost s tím jménem.
 *  (b) MAPA POHYB → DŮSLEDEK {vzdalují se: hřbet a nová kůra; podsouvání:
 *      příkop, sopky, zemětřesení; srážka pevninských: vrásné pohoří; posun
 *      podél sebe: otřesy podél zlomu bez sopek a bez pohoří}, aplikovaná
 *      OBOUSMĚRNĚ podle klíčových slov v otázce.
 *  (c) MAPA POLOHA → HLOUBKA {magma, ohnisko: v hloubce; láva, epicentrum:
 *      na povrchu}.
 *  (d) Zbytek banky: tabulka otázka → znak jediné přípustné možnosti, napsaná
 *      nezávisle na generátoru.
 */
const topic = LITOSFERA_STAVBA_ZEME_DESKY[0];
const ns = (s: string) => s.replace(/\s/g, " ");
const norm = (s: string) => ns(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// (a) rank hloubky + 7. pád, kterým se vrstva objevuje v zadání
const RANK: Record<string, number> = {
  "zemská kůra": 1,
  "zemský plášť": 2,
  "vnější jádro": 3,
  "vnitřní jádro": 4,
};
const Z_7_PADU: Record<string, string> = {
  "zemskou kůrou": "zemská kůra",
  "zemským pláštěm": "zemský plášť",
  "vnějším jádrem": "vnější jádro",
  "vnitřním jádrem": "vnitřní jádro",
};
const PODLE_RANKU = (r: number): string | undefined =>
  Object.keys(RANK).find((k) => RANK[k] === r);

// (b) pohyb ↔ důsledek
interface Dvojice {
  pohybVOtazce: RegExp;
  jevVOtazce: RegExp;
  jevMoznost: RegExp;
  pohybMoznost: RegExp;
}
const DVOJICE: Dvojice[] = [
  {
    pohybVOtazce: /se dvě desky od sebe pomalu vzdalují/u,
    jevVOtazce: /oceánského hřbetu/u,
    jevMoznost: /^Oceánský hřbet/u,
    pohybMoznost: /^Desky se od sebe/u,
  },
  {
    pohybVOtazce: /oceánská deska klesá pod pevninskou/u,
    jevVOtazce: /hlubokého příkopu/u,
    jevMoznost: /^Hluboký příkop/u,
    pohybMoznost: /^Oceánská deska klesá/u,
  },
  {
    pohybVOtazce: /se dvě pevninské desky srazí čelem/u,
    jevVOtazce: /vrásného pohoří/u,
    jevMoznost: /^Vrásné pohoří/u,
    pohybMoznost: /^Dvě pevninské desky/u,
  },
  {
    pohybVOtazce: /se dvě desky posouvají podél sebe/u,
    jevVOtazce: /nevzniká ani sopka, ani pohoří/u,
    jevMoznost: /^Otřesy podél zlomu/u,
    pohybMoznost: /^Desky se posouvají podél/u,
  },
];

// (d) zbytek banky — otázka → znak jediné přípustné možnosti
interface Fakt {
  pojem: string;
  otazka: RegExp;
  moznost: RegExp;
}
const FAKTA: Fakt[] = [
  // L1
  { pojem: "litosféra", otazka: /^Co je litosféra/u, moznost: /^Pevný kamenný obal/u },
  { pojem: "nejmocnější vrstva", otazka: /zdaleka nejmocnější/u, moznost: /^Zemský plášť$/u },
  { pojem: "mocnost kůry", otazka: /mocnosti zemské kůry/u, moznost: /tenká slupka/u },
  { pojem: "desky se pohybují", otazka: /^Co platí o litosférických deskách/u, moznost: /^Pomalu se pohybují/u },
  { pojem: "rychlost desek", otazka: /^Jak rychle se litosférické desky/u, moznost: /^Velmi pomalu/u },
  { pojem: "co je zemětřesení", otazka: /^Co je zemětřesení/u, moznost: /^Otřesy povrchu/u },
  { pojem: "kráter", otazka: /otvor na vrcholu sopky/u, moznost: /^Kráter$/u },
  { pojem: "Ohnivý kruh — název", otazka: /pás sopek a častých zemětřesení kolem Tichého/u, moznost: /^Ohnivý kruh$/u },
  { pojem: "střed planety", otazka: /úplně uprostřed, ve středu planety/u, moznost: /^Vnitřní jádro$/u },
  { pojem: "skupenství jádra", otazka: /^Co platí o vnějším jádru/u, moznost: /^Je tekuté/u },
  // L2
  { pojem: "pásy podle okrajů", otazka: /v úzkých pásech/u, moznost: /okraje litosférických desek/u },
  { pojem: "Ohnivý kruh — poloha", otazka: /^Kde na Zemi leží Ohnivý kruh/u, moznost: /Tichého oceánu/u },
  { pojem: "tsunami", otazka: /hrozí pobřeží vlna tsunami/u, moznost: /nadzvedne vodní sloupec/u },
  { pojem: "Richter", otazka: /Richterově stupnici/u, moznost: /^Otřes byl silnější$/u },
  { pojem: "sopky nad podsouváním", otazka: /pás sopek na okraji pevniny/u, moznost: /^Nad podsunutou deskou/u },
  { pojem: "pohon desek", otazka: /^Co pohání pohyb litosférických desek/u, moznost: /proudění horkých hornin/u },
  { pojem: "Island", otazka: /Island sopečný ostrov/u, moznost: /na hřbetu/u },
  { pojem: "oceánský hřbet", otazka: /^Co je oceánský hřbet/u, moznost: /^Podmořské pohoří/u },
  { pojem: "Japonsko", otazka: /v Japonsku jsou časté otřesy/u, moznost: /rozhraní desek/u },
  { pojem: "příkop", otazka: /úzký zářez ve dně/u, moznost: /^Hlubokooceánský příkop$/u },
  { pojem: "častá zemětřesení", otazka: /zemětřesení na rozhraní dvou desek tak častá/u, moznost: /zadrhnou a napětí/u },
  { pojem: "otřesy před výbuchem", otazka: /otřesy ještě před jejím výbuchem/u, moznost: /razí cestu a láme/u },
  // L3
  { pojem: "ostrov", otazka: /^Ostrov X/u, moznost: /rozhraní dvou litosférických desek/u },
  { pojem: "město uvnitř desky", otazka: /^Město M/u, moznost: /^Výbuch sopky/u },
  { pojem: "pobřeží nad podsouváním", otazka: /^Pobřeží P/u, moznost: /^Silné otřesy/u },
  { pojem: "Himálaj roste", otazka: /Himálaj stále roste/u, moznost: /do sebe pořád tlačí/u },
  { pojem: "Česko", otazka: /Česko jen dávno vyhaslé sopky/u, moznost: /uvnitř desky/u },
  { pojem: "nezpůsobuje", otazka: /NEvzniká pohybem/u, moznost: /^Střídání ročních dob$/u },
  { pojem: "nevysvětluje", otazka: /NELZE vysvětlit/u, moznost: /^Příliv a odliv/u },
  { pojem: "hloubka ohniska", otazka: /Kde budou škody větší/u, moznost: /mělce pod povrchem/u },
  { pojem: "vzdálenost od epicentra", otazka: /pocítili silnější otřes/u, moznost: /blíž k epicentru/u },
  { pojem: "stáří dna", otazka: /nejmladší uprostřed/u, moznost: /přibývá a roste do stran/u },
  { pojem: "Rudé moře", otazka: /Rudém moři/u, moznost: /nový oceán/u },
  { pojem: "zavírající se moře", otazka: /které se k sobě přibližují/u, moznost: /zužovat/u },
  { pojem: "čerstvá hornina", otazka: /zcela čerstvou horninu/u, moznost: /^Tuhne tam magma/u },
  { pojem: "Atlantik", otazka: /Atlantský oceán dnes širší/u, moznost: /rozestupují a kůra přibývá/u },
];

function jedina(opts: string[], r: RegExp, co: string): string {
  const ok = opts.filter((o) => r.test(ns(o)));
  expect(ok, `${co}: nepřipouští právě 1 možnost`).toHaveLength(1);
  return ok[0];
}

function vyres(t: PracticeTask): string {
  const q = ns(t.question);
  const opts = t.options!;

  // (a) vrstvy Země — rank ± 1
  const v = q.match(/^Která vrstva Země leží hned (pod|nad) (.+)\?$/u);
  if (v) {
    const vrstva = Z_7_PADU[v[2]];
    expect(vrstva, `neznámý 7. pád vrstvy: ${q}`).toBeTruthy();
    const cil = PODLE_RANKU(RANK[vrstva] + (v[1] === "pod" ? 1 : -1));
    expect(cil, `mimo rozsah vrstev: ${q}`).toBeTruthy();
    return jedina(opts, new RegExp(`^${cil}$`, "iu"), q);
  }

  // (b) pohyb → jev
  const a = q.match(/^Co vzniká na rozhraní, (.+)\?$/u);
  if (a) {
    const d = DVOJICE.filter((x) => x.pohybVOtazce.test(q));
    expect(d, `mapa pohyb→jev: nejednoznačný pohyb v ${q}`).toHaveLength(1);
    return jedina(opts, d[0].jevMoznost, q);
  }

  // (b) jev → pohyb
  const b = q.match(/^Který pohyb litosférických desek vysvětluje (.+)\?$/u);
  if (b) {
    const d = DVOJICE.filter((x) => x.jevVOtazce.test(q));
    expect(d, `mapa jev→pohyb: nejednoznačný jev v ${q}`).toHaveLength(1);
    return jedina(opts, d[0].pohybMoznost, q);
  }

  // (c) poloha → hloubka: magma × láva
  if (/roztavená hornina/u.test(q)) {
    const naPovrchu = /vytekla na zemský povrch/u.test(q);
    const vHloubce = /hluboko pod zemským povrchem/u.test(q);
    expect(naPovrchu !== vHloubce, `poloha neurčena: ${q}`).toBe(true);
    return jedina(opts, naPovrchu ? /^Láva$/u : /^Magma$/u, q);
  }

  // (c) poloha → hloubka: ohnisko × epicentrum
  if (/^Jak se nazývá místo/u.test(q) && /zemětřesení/u.test(q)) {
    const naPovrchu = /na zemském povrchu/u.test(q);
    const vHloubce = /místo v hloubce/u.test(q);
    expect(naPovrchu !== vHloubce, `poloha neurčena: ${q}`).toBe(true);
    return jedina(opts, naPovrchu ? /^Epicentrum$/u : /^Ohnisko$/u, q);
  }

  // (d) banka faktů
  const f = FAKTA.filter((x) => x.otazka.test(q));
  expect(f.map((x) => x.pojem), `solver: nejednoznačný/žádný fakt pro: ${q}`).toHaveLength(1);
  return jedina(opts, f[0].moznost, `${f[0].pojem}: ${q}`);
}

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

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator!(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);

function najdiUzel(n: unknown, id: string): { labels?: { area: string; topic: string } } | undefined {
  if (Array.isArray(n)) {
    for (const x of n) {
      const r = najdiUzel(x, id);
      if (r) return r;
    }
  } else if (n && typeof n === "object") {
    const o = n as Record<string, unknown>;
    if (o.id === id && o.labels) return o as { labels: { area: string; topic: string } };
    for (const val of Object.values(o)) {
      const r = najdiUzel(val, id);
      if (r) return r;
    }
  }
  return undefined;
}

describe("Litosféra — metadata", () => {
  it("zeměpis g6, select_one, category/topic podle RVP", () => {
    expect(topic.id).toBe("g6-zem-litosfera-stavba-zeme-desky-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Přírodní obraz Země");
    expect(topic.topic).toBe("Krajinné sféry");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Litosféra — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) expect(Array.isArray(t.options), t.question).toBe(true);
  });

  it("deterministický (dvě volání za sebou dají stejný vzorek)", () => {
    const a = topic.generator!(level).map((t) => [t.question, t.correctAnswer, [...t.options!].sort()]);
    const b = topic.generator!(level).map((t) => [t.question, t.correctAnswer, [...t.options!].sort()]);
    expect(b).toEqual(a);
    const puvodni = Math.random;
    try {
      Math.random = seeded(42);
      const c = topic.generator!(level).map((t) => [t.question, t.correctAnswer]);
      Math.random = seeded(7);
      const d = topic.generator!(level).map((t) => [t.question, t.correctAnswer]);
      expect(d).toEqual(c);
    } finally {
      Math.random = puvodni;
    }
  });

  it("4 unikátní možnosti, klíč právě jednou, feedback ke každému distraktoru", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("nezávislý solver dojde ke stejnému klíči", () => {
    for (const t of tasks) expect(t.correctAnswer, t.question).toBe(vyres(t));
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

  it("klíč nevyčnívá prvním slovem", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase();
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(jine).size === 1) expect(prvni(t.correctAnswer), `klíč vyčnívá: ${t.question}`).toBe(jine[0]);
    }
  });
});

describe("Litosféra — napříč tématem", () => {
  it("klíč není systematicky nejdelší možnost", () => {
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

  it("L1 ∩ L3 = ∅ (znění otázek)", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    expect(tasksBy[3].map((t) => t.question).filter((q) => q1.has(q))).toHaveLength(0);
    const q2 = new Set(tasksBy[2].map((t) => t.question));
    expect(tasksBy[3].map((t) => t.question).filter((q) => q2.has(q))).toHaveLength(0);
  });

  it("žádná položka banky ani varianta šablony nezůstane nevygenerovaná", () => {
    for (const [lvl, pool] of [[1, POOL_L1], [2, POOL_L2], [3, POOL_L3]] as [number, { q: string }[]][]) {
      const qs = new Set(tasksBy[lvl].map((t) => t.question));
      expect(pool.filter((p) => !qs.has(p.q)).map((p) => p.q), `banka L${lvl}`).toEqual([]);
    }
    expect(tasksBy[1].filter((t) => /^Která vrstva Země leží hned/u.test(t.question)))
      .toHaveLength(VRSTVA_VARIANTY.length);
    const sablonaL2 = tasksBy[2].filter((t) =>
      /^Co vzniká na rozhraní,|^Který pohyb litosférických desek vysvětluje/u.test(t.question));
    expect(sablonaL2).toHaveLength(POHYB_VARIANTY.length);
  });

  it("obě úrovně šablony pohyb ↔ jev jsou zastoupeny oběma směry", () => {
    const zPohybu = tasksBy[2].filter((t) => /^Co vzniká na rozhraní,/u.test(t.question));
    const zJevu = tasksBy[2].filter((t) => /^Který pohyb litosférických desek vysvětluje/u.test(t.question));
    expect(zPohybu.length).toBe(4);
    expect(zJevu.length).toBe(4);
  });

  it("bez odkazů na mapu a obrázek (k obsahu nejsou)", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!];
      for (const s of texty) {
        expect(/na obrázku|podívej se na mapu|na mapě vidíš/iu.test(s), `odkaz na obrázek: ${s}`).toBe(false);
      }
    }
  });

  it("žádné rodové lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
    }
  });

  it("velká nápověda nepřilepí cizí strategickou větu", () => {
    const CIZI = [/odporují poloze nebo podnebí/u, /jasně mimo/u, /vzdálenost není nesmyslně velká/u, /centimetry na mapě/u];
    const spatne = all.filter((t) => CIZI.some((re) => re.test(t.hints![1]))).map((t) => t.question);
    expect(spatne).toEqual([]);
  });

  it("po předložce „od“ následuje 2. pád (ne 7.)", () => {
    // Šablona vrstev dosazovala do nápovědy „od zemskou kůrou“ — pádovou shodu
    // typecheck ani solver nechytí, proto se hlídá zvlášť.
    const SEDMY = /\bod (zemskou kůrou|zemským pláštěm|vnějším jádrem|vnitřním jádrem)/u;
    for (const t of all) {
      for (const s of [t.question, t.explanation ?? "", ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {})]) {
        expect(SEDMY.test(ns(s)), `„od“ + 7. pád: ${s}`).toBe(false);
      }
    }
  });

  it("sezení (prvních 6 úloh) není ze tří čtvrtin táž šablona", () => {
    const zacatek = (lvl: number) => tasksBy[lvl].slice(0, 6).map((t) => t.question);
    const vrstvy = zacatek(1).filter((q) => /^Která vrstva Země leží hned/u.test(q));
    expect(vrstvy.length, `šablona vrstev v sezení: ${vrstvy.join(" | ")}`).toBeLessThanOrEqual(2);
    const pohyby = zacatek(2).filter((q) =>
      /^Co vzniká na rozhraní,|^Který pohyb litosférických desek vysvětluje/u.test(q));
    expect(pohyby.length, `šablona pohyb ↔ jev v sezení: ${pohyby.join(" | ")}`).toBeLessThanOrEqual(2);
    // a nikdy ne táž dvojice naruby (pohyb → jev a jev → pohyb téhož pohybu)
    const smery = new Set(pohyby.map((q) => /^Co vzniká/u.test(q)));
    expect(smery.size, `dvojice naruby v jednom sezení: ${pohyby.join(" | ")}`).toBeLessThanOrEqual(1);
  });

  it("dvojice pojmů se nezamění: magma × láva, ohnisko × epicentrum", () => {
    const magma = all.find((t) => /dokud je hluboko pod zemským povrchem/u.test(t.question))!;
    const lava = all.find((t) => /už vytekla na zemský povrch/u.test(t.question))!;
    expect(magma.correctAnswer).toBe("Magma");
    expect(lava.correctAnswer).toBe("Láva");
    expect(magma.options).toContain("Láva");
    expect(lava.options).toContain("Magma");
    const ohnisko = all.find((t) => /místo v hloubce, kde zemětřesení vzniká/u.test(t.question))!;
    const epi = all.find((t) => /na zemském povrchu přímo nad ohniskem/u.test(t.question))!;
    expect(ohnisko.correctAnswer).toBe("Ohnisko");
    expect(epi.correctAnswer).toBe("Epicentrum");
  });
});
