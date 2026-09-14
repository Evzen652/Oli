import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { STAROVEKA_CINA } from "../dejepis/starovekaCina";
import type { PracticeTask } from "@/lib/types";

/**
 * Starověká Čína — FAKTICKÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta), pole `correct` z banky nepoužívá:
 *  (A) DYNASTIE — tabulka dynastie → poznávací znaky v zadání. U úloh, kde jsou
 *      všechny možnosti „Dynastie …“, solver z textu odvodí dynastii sám.
 *  (B) RANK — pořadí dynastií Šang < Čou < Čchin < Chan. U relační chronologie
 *      solver porovná dvě dynastie jmenované v zadání a vybere směr (dřív / po).
 *  (C) EPOCHA — vynález → starověk / pozdější. U anachronismu je klíč jediná
 *      „pozdější“ možnost (nebo jediná „starověká“ podle znění otázky).
 *  (D) FAKTA — ostatní úlohy: znaky otázky → znak jediné připustné možnosti.
 * Plus strukturní kontroly podle specifikace.
 */
const topic = STAROVEKA_CINA[0];

type Dyn = "Šang" | "Čou" | "Čchin" | "Chan";
const RANK: Record<Dyn, number> = { "Šang": 1, "Čou": 2, "Čchin": 3, "Chan": 4 };
const DYNASTIE: Record<Dyn, RegExp> = {
  "Šang": /kostí|krunýř/i,
  "Čou": /konfucius|soupeřící státy|státečk/i,
  "Čchin": /míry, váhy|valy|hrobu vládce/i,
  "Chan": /cchaj lun|římsk/i,
};

/** Jev → dynastie (nezávislá tabulka pro L2 přiřazování). "Ming" = pozdější přestavba zdi. */
const UDALOST: [RegExp, Dyn | "Ming"][] = [
  [/věšteb/i, "Šang"],
  [/konfucius|soupeřící státy/i, "Čou"],
  [/cchaj lun|papír|hedvábn|hedvábím|řím/i, "Chan"],
  [/cihlov/i, "Ming"],
  [/první císař|terakot|valy|písm|sjednocení/i, "Čchin"],
];
const dynUdalosti = (s: string) => UDALOST.find(([r]) => r.test(s))?.[1];
const rankUdalosti = (s: string) => {
  const d = dynUdalosti(s);
  expect(d, `neznámá událost „${s}“`).toBeDefined();
  return RANK[d as Dyn];
};

type Epocha = "starovek" | "pozdeji";
/** Pořadí je důležité: „papírové peníze“ dřív než „papír“. */
const EPOCHA: [RegExp, Epocha][] = [
  [/střeln/i, "pozdeji"],
  [/knihtisk/i, "pozdeji"],
  [/papírové peníze/i, "pozdeji"],
  [/papír/i, "starovek"],
  [/hedváb/i, "starovek"],
  [/písmo/i, "starovek"],
];
const epocha = (o: string): Epocha => {
  const hit = EPOCHA.find(([r]) => r.test(o));
  expect(hit, `EPOCHA nezná možnost „${o}“`).toBeDefined();
  return hit![1];
};

/** Rozdíl Čína × Egypt: obě poloviny musí sedět na svou zemi. */
const CINA = /vynalezla papír|žlut|znak/i;
const EGYPT = /papyrus|nil|hieroglyf/i;
const rozdil = (o: string) => {
  const m = /^Čína (.+), Egypt (.+)$/.exec(o);
  return !!m && CINA.test(m[1]) && !EGYPT.test(m[1]) && !/neměla/.test(m[1]) && EGYPT.test(m[2]) && !CINA.test(m[2]);
};

interface Fakt { pojem: string; otazka: RegExp[]; moznost: RegExp | ((o: string) => boolean) }
const FAKTA: Fakt[] = [
  // L1
  { pojem: "řeka", otazka: [/u které řeky/i, /první čínské státy/i], moznost: /^chuang-che$/i },
  { pojem: "první císař", otazka: [/prvním císařem/i], moznost: /š'-chuang-ti/i },
  { pojem: "výroba hedvábí", otazka: [/z čeho se vyrábělo hedvábí/i], moznost: /kokon/i },
  { pojem: "účel zdi", otazka: [/před čím/i, /zeď/i], moznost: /kočovník/i },
  { pojem: "psací materiál", otazka: [/materiál k psaní/i, /vynalezli/i], moznost: /^papír$/i },
  { pojem: "obchodní cesta", otazka: [/obchodní cesta/i, /na západ/i], moznost: /hedvábn/i },
  { pojem: "nejstarší nápisy", otazka: [/nejstarší čínské nápisy/i, /na čem/i], moznost: /věšteb/i },
  { pojem: "kdo Konfucius", otazka: [/^kdo byl konfucius/i], moznost: /učitel/i },
  { pojem: "nález u hrobu", otazka: [/co našli archeologové/i], moznost: /hliněných vojáků/i },
  { pojem: "obranná stavba", otazka: [/jak se jmenuje stavba/i], moznost: /^velká zeď$/i },
  { pojem: "vzácná látka", otazka: [/vzácnou látku/i], moznost: /^hedvábí$/i },
  { pojem: "úředník papíru", otazka: [/jak se jmenoval/i, /úředník/i, /výrobu papíru/i], moznost: /cchaj lun/i },
  { pojem: "titul", otazka: [/jaký titul/i], moznost: /^císař$/i },
  { pojem: "nástroj", otazka: [/čím číňané psali/i], moznost: /štětc/i },
  { pojem: "myslitel", otazka: [/myslitel/i, /úctě k rodičům/i], moznost: /^konfucius$/i },
  // L2 (pojmy)
  { pojem: "terakota", otazka: [/nález nazývá/i, /z čeho jsou vojáci/i], moznost: (o) => /terakot/i.test(o) && /pálené hlíny/i.test(o) },
  { pojem: "stezka tvrzení", otazka: [/tvrzení o hedvábné stezce/i], moznost: /za dynastie chan$/i },
  { pojem: "zeď tvrzení", otazka: [/tvrzení o spojení/i], moznost: (o) => /první císař/i.test(o) && /severní hranici/i.test(o) },
  { pojem: "plodina", otazka: [/kterou plodinu/i, /chuang-che/i], moznost: /^proso$/i },
  // L3
  { pojem: "písmo proč", otazka: [/proč sjednocení písma/i], moznost: /rozkaz/i },
  { pojem: "tajemství hedvábí", otazka: [/proč číňané/i, /tajili/i], moznost: /ziskem/i },
  { pojem: "zeď nezastavila", otazka: [/pronikali/i, /spojil/i], moznost: /uhlídat/i },
  { pojem: "míry proč", otazka: [/proč sjednocení měr/i], moznost: /stejnými jednotkami/i },
  { pojem: "podoba zdi", otazka: [/udusané/i, /vyplývá/i], moznost: /mladší/i },
  { pojem: "doba prvního císaře", otazka: [/doby prvního císaře/i, /nepatří/i], moznost: /papíř/i },
  { pojem: "Čína i Egypt", otazka: [/zároveň pro/i], moznost: /velké řeky/i },
  { pojem: "Čína × Egypt", otazka: [/rozdíl mezi/i], moznost: rozdil },
  { pojem: "státy proč", otazka: [/proč vznikly první čínské státy/i], moznost: /úrod/i },
  { pojem: "papír proč", otazka: [/proč byl papír/i], moznost: /levnější/i },
  { pojem: "pálení knih", otazka: [/spálit knihy/i], moznost: /odpor/i },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function vyres(t: PracticeTask): string {
  const q = t.question;
  const opts = t.options!;
  // (A) dynastie
  if (opts.every((o) => o.startsWith("Dynastie "))) {
    const dyn = (Object.keys(DYNASTIE) as Dyn[]).filter((d) => DYNASTIE[d].test(q));
    expect(dyn, `solver A: nejednoznačná dynastie v: ${q}`).toHaveLength(1);
    return `Dynastie ${dyn[0]}`;
  }
  // (E) seřazení událostí — klíč = jediná rostoucí posloupnost
  if (opts.every((o) => o.includes("→"))) {
    const hit = opts.filter((o) => {
      const r = o.split("→").map((x) => rankUdalosti(x));
      return r.every((v, i) => i === 0 || r[i - 1] < v);
    });
    expect(hit, `solver E: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (F) dvojice „X – dynastie Y“ / „X za dynastie Y“
  if (opts.every((o) => /( – | za )dynastie /.test(o))) {
    const hit = opts.filter((o) => {
      const m = /^(.+?)(?: – | za )dynastie (\S+)$/.exec(o)!;
      return dynUdalosti(m[1]) === m[2] && (!/papír|kůry/i.test(q) || /cchaj lun/i.test(m[1]));
    });
    expect(hit, `solver F: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (G) jev ↔ dynastie jmenovaná v zadání
  if (/co se za této dynastie stalo|co z nabídky nechal provést/i.test(q)) {
    const d = /dynastie (Šang|Čou|Čchin|Chan)/u.exec(q)![1];
    const hit = opts.filter((o) => dynUdalosti(o) === d);
    expect(hit, `solver G: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (H) století z letopočtu
  if (/ve kterém století/i.test(q)) {
    const m = /roku (\d+) (př\. n\. l\.|n\. l\.)/.exec(q)!;
    const s = `Ve ${Math.ceil(Number(m[1]) / 100)}. století ${m[2]}`;
    expect(opts, `solver H: ${q}`).toContain(s);
    return s;
  }
  // (B) relační chronologie
  if (/co z toho vyplývá o (jejich )?dob/i.test(q)) {
    const jmena = (Object.keys(RANK) as Dyn[])
      .map((d) => ({ d, i: q.search(new RegExp(`(dynastie|rodu) ${d}\\b`, "u")) }))
      .filter((x) => x.i >= 0).sort((a, b) => a.i - b.i).map((x) => x.d);
    let hledany: RegExp;
    if (jmena.length === 2) {
      // „X žil za A, první císař z B“ → je A dřív než B?
      hledany = RANK[jmena[0]] < RANK[jmena[1]] ? /dřív, než/ : /až po/;
    } else {
      expect(jmena, `solver B: ${q}`).toHaveLength(1);
      // jedna dynastie proti sjednocení říše (Čchin)
      hledany = RANK[jmena[0]] > RANK["Čchin"] ? /až po smrti prvního císaře/ : /před sjednocením/;
    }
    const hit = opts.filter((o) => hledany.test(o));
    expect(hit, `solver B: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (C) anachronismus
  if (/nepatří/i.test(q) && /vynál/i.test(q)) {
    const chci: Epocha = /nepatří do středověku, ale už do starověku/i.test(q) ? "starovek" : "pozdeji";
    const hit = opts.filter((o) => epocha(o) === chci);
    expect(hit, `solver C: ${q}`).toHaveLength(1);
    return hit[0];
  }
  // (D) fakta
  const fakty = FAKTA.filter((f) => f.otazka.every((r) => r.test(q)));
  expect(fakty.map((f) => f.pojem), `solver D: nejednoznačný/žádný fakt pro: ${q}`).toHaveLength(1);
  const m = fakty[0].moznost;
  const ok = opts.filter((o) => (typeof m === "function" ? m(o) : m.test(o)));
  expect(ok, `solver D (${fakty[0].pojem}): nepřipouští právě 1 možnost v: ${q}`).toHaveLength(1);
  return ok[0];
}

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator!(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);

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

describe("Starověká Čína — metadata", () => {
  it("dějepis g6, select_one, factual, category/topic znak po znaku dle RVP", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Starověká Indie a Čína");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Starověká Čína — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, deterministicky, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    expect(topic.generator!(level).map((t) => t.question).sort()).toEqual(tasks.map((t) => t.question).sort());
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
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(jine).size === 1) expect(prvni(t.correctAnswer), `klíč vyčnívá: ${t.question}`).toBe(jine[0]);
    }
  });
});

describe("Starověká Čína — napříč tématem", () => {
  it("klíč není systematicky nejdelší", () => {
    let nejdelsi = 0;
    let vyrazne = 0;
    for (const t of all) {
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0] === t.correctAnswer && s[0].length > s[1].length) nejdelsi++;
      if (s[0] === t.correctAnswer && s[0].length >= s[1].length * 1.25) vyrazne++;
    }
    expect(nejdelsi / all.length, `klíč nejdelší v ${nejdelsi}/${all.length}`).toBeLessThanOrEqual(0.25 + 0.15);
    expect(vyrazne / all.length, `klíč výrazně nejdelší v ${vyrazne}/${all.length}`).toBeLessThanOrEqual(0.1);
  });

  it("L1 ∩ L3 = ∅ (znění otázek)", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    expect(tasksBy[3].map((t) => t.question).filter((q) => q1.has(q))).toHaveLength(0);
  });

  it("nápovědy unikátní napříč úlohami", () => {
    expect(new Set(all.map((t) => t.hints![0])).size).toBe(all.length);
    expect(new Set(all.map((t) => t.hints![1])).size).toBe(all.length);
  });

  it("klíč k anachronismu nikdy není kompas, porcelán ani střelný prach jako starověký", () => {
    for (const t of all) {
      expect(/kompas|porcelán/i.test(t.correctAnswer), t.question).toBe(false);
      if (/starověk/i.test(t.question) && !/nepatří/i.test(t.question)) {
        expect(/střeln/i.test(t.correctAnswer), t.question).toBe(false);
      }
    }
  });

  it("žádné rodové lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
    }
  });
});
