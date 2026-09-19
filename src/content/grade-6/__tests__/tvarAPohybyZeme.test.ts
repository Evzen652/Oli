import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { TVAR_A_POHYBY_ZEME, POOL_L2, POOL_L3 } from "../zemepis/tvarAPohybyZeme";
import type { PracticeTask } from "@/lib/types";

/**
 * Tvar Země, pohyby Země, střídání dne a noci (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta). Pole z banky ani parametry generátoru nepoužívá,
 * vše čte ze znění otázky a z nabídky:
 *  (1) DVĚ MĚSTA — vyparsuje obě délky, převede na znaménkové (v. d. +, z. d. −),
 *      větší = dřívější východ Slunce → klíč jmenuje to město.
 *  (2) PROTILEHLÝ POLEDNÍK — z délky místa dopočítá 180° − |x| s opačnou polokoulí.
 *  (3) ROZDÍL DÉLEK — 180° / 90° + směr; denní doba = posun po kruhu fází
 *      [půlnoc, východ Slunce, poledne, západ Slunce] o rozdíl/90 kroků (na východ dopředu).
 *  (4) POČET OTOČEK — týdny → dny, hodiny → dny; jedna otočka na den.
 *  (5) FAKTA A POKUSY — tabulka klíčových slov otázka → znak jediné připustné možnosti.
 */
const topic = TVAR_A_POHYBY_ZEME[0];
const ns = (s: string) => s.replace(/\s/g, " ");

const FAZE_SLOVO_OTAZKA: [RegExp, number][] = [[/půlnoc/u, 0], [/vychází/u, 1], [/poledne/u, 2], [/zapadá/u, 3]];
const FAZE_MOZNOST_90: [RegExp, number][] = [[/půlnoci/u, 0], [/východu/u, 1], [/poledne/u, 2], [/západu/u, 3]];
const FAZE_MOZNOST_180 = ["půlnoc", "ráno", "poledne", "večer"];

interface Fakt { pojem: string; otazka: RegExp; moznost: RegExp }
const FAKTA: Fakt[] = [
  // L1
  { pojem: "tvar", otazka: /^jaký tvar má země/iu, moznost: /zploštělá u pólů/iu },
  { pojem: "doba otočky", otazka: /otočení země kolem vlastní osy/iu, moznost: /^asi 24 hodin$/iu },
  { pojem: "doba oběhu", otazka: /jak dlouho trvá jeden oběh/iu, moznost: /365 dní a 6 hodin/iu },
  { pojem: "směr", otazka: /kterým směrem se země otáčí/iu, moznost: /^od západu k východu$/iu },
  { pojem: "osa", otazka: /prochází zemská osa/iu, moznost: /^severním a jižním pólem$/iu },
  { pojem: "název otáčení", otazka: /nazývá pohyb země kolem vlastní osy/iu, moznost: /rotace/iu },
  { pojem: "název oběhu", otazka: /nazývá pohyb země kolem slunce/iu, moznost: /revoluce/iu },
  { pojem: "co kolem čeho", otazka: /pohybech země, slunce a měsíce/iu, moznost: /^země obíhá kolem slunce a měsíc kolem země$/iu },
  { pojem: "rovník", otazka: /^co je rovník/iu, moznost: /uprostřed mezi.*póly/iu },
  { pojem: "obvod", otazka: /obvod země/iu, moznost: /^asi 40 000 km$/iu },
  { pojem: "otočky za rok", otazka: /během jednoho oběhu/iu, moznost: /365krát/iu },
  { pojem: "družice", otazka: /obíhá kolem země\?/iu, moznost: /^měsíc$/iu },
  { pojem: "geoid", otazka: /skutečný tvar země/iu, moznost: /^geoid$/iu },
  { pojem: "hodinky", otazka: /shora nad severním pólem/iu, moznost: /^proti směru/iu },
  { pojem: "osvětlená část", otazka: /část země .*osvětlená/iu, moznost: /polovina/iu },
  { pojem: "strana východu", otazka: /na které straně oblohy slunce ráno vychází/iu, moznost: /^na východě$/iu },
  // L2
  { pojem: "den a noc", otazka: /den a noc se na zemi střídají/iu, moznost: /otáčí kolem své osy/iu },
  { pojem: "východ na východě", otazka: /ráno vychází na východní/iu, moznost: /otáčí od západu k východu/iu },
  { pojem: "zdánlivý pohyb Slunce", otazka: /zdánlivě posouvá po obloze od východu/iu, moznost: /otáčí opačným směrem/iu },
  { pojem: "hvězdy", otazka: /hvězdy se během noci/iu, moznost: /otáčí kolem své osy/iu },
  { pojem: "roční doby", otazka: /^roční doby se/iu, moznost: /obíhá .*skloněnou osou/iu },
  { pojem: "polovina den", otazka: /na jedné polovině den/iu, moznost: /koule osvětlená/iu },
  { pojem: "rok", otazka: /^rok trvá/iu, moznost: /oběh země kolem slunce/iu },
  { pojem: "den", otazka: /^den i s nocí/iu, moznost: /otočení země kolem osy/iu },
  // L3
  { pojem: "opačné otáčení", otazka: /otáčela opačným směrem/iu, moznost: /západní/iu },
  { pojem: "bez otáčení", otazka: /vůbec neotáčela/iu, moznost: /^asi jeden rok$/iu },
  { pojem: "pomalejší otáčení", otazka: /otáčela kolem osy pomaleji/iu, moznost: /trvaly déle/iu },
  { pojem: "rychlejší oběh", otazka: /obíhala kolem slunce rychleji/iu, moznost: /jen rok/iu },
  { pojem: "loď", otazka: /loď odplouvá/iu, moznost: /^nejdřív zmizí trup/iu },
  { pojem: "stín", otazka: /stín země/iu, moznost: /^vždy oblý$/iu },
  { pojem: "obeplutí", otazka: /plula stále na západ/iu, moznost: /koule/iu },
  { pojem: "důkaz", otazka: /důkazem, že země je kulatá/iu, moznost: /snímky/iu },
  { pojem: "není otáčením", otazka: /není způsoben otáčením/iu, moznost: /ročních/iu },
  { pojem: "je otáčením", otazka: /způsobuje otáčení země, a ne/iu, moznost: /hvězd/iu },
  { pojem: "nezávisí", otazka: /nezávisí na otáčení/iu, moznost: /roku/iu },
  { pojem: "začíná den", otazka: /začíná den/iu, moznost: /natáčí ke světlu/iu },
  { pojem: "stmívá", otazka: /stmívá/iu, moznost: /od světla odvrací/iu },
  { pojem: "dvakrát rychleji", otazka: /dvakrát rychleji/iu, moznost: /^asi 6 hodin$/iu },
  { pojem: "obrácené otáčení a místa", otazka: /otáčela od východu k západu/iu, moznost: /dál na západ$/iu },
];

function jedina(opts: string[], r: RegExp, co: string): string {
  const ok = opts.filter((o) => r.test(ns(o)));
  expect(ok, `${co}: nepřipouští právě 1 možnost`).toHaveLength(1);
  return ok[0];
}

function vyres(t: PracticeTask): string {
  const q = ns(t.question);
  const opts = t.options!;

  // (1) dvě města
  const m = [...q.matchAll(/Město (\p{Lu}) leží na (\d+)° (v|z)\. d\., město (\p{Lu}) na (\d+)° (v|z)\. d\./gu)][0];
  if (m) {
    const d1 = Number(m[2]) * (m[3] === "v" ? 1 : -1);
    const d2 = Number(m[5]) * (m[6] === "v" ? 1 : -1);
    expect(Math.abs(d1 - d2), q).toBeGreaterThanOrEqual(15);
    expect(Math.abs(d1 - d2), `antipodální dvojice: ${q}`).toBeLessThan(180);
    const vych = d1 > d2 ? m[1] : m[4];
    return jedina(opts, new RegExp(`^Ve městě ${vych},`, "u"), q);
  }

  // (2) protilehlý poledník — musí být před (3), taky obsahuje „o 180° délky dál“
  const ap = q.match(/^Místo \p{Lu} leží na (\d+)° (v|z)\. d\. — na kterém poledníku/u);
  if (ap) {
    const x = Number(ap[1]) * (ap[2] === "v" ? 1 : -1);
    const anti = x > 0 ? x - 180 : x + 180;
    const chteny = `${Math.abs(anti)}° ${anti < 0 ? "z" : "v"}\\. d\\.`;
    return jedina(opts, new RegExp(`^${chteny}$`, "u"), q);
  }

  // (3) rozdíl délek
  const r = q.match(/o (180|90)° délky dál(?: na (východ|západ))?/u);
  if (r) {
    const tady = q.match(/právě (\p{L}+)/u)![1];
    const start = FAZE_SLOVO_OTAZKA.find(([re]) => re.test(tady))![1];
    const kroky = Number(r[1]) / 90;
    const cil = (((start + (r[2] === "západ" ? -kroky : kroky)) % 4) + 4) % 4;
    if (kroky === 2) return jedina(opts, new RegExp(`^Je tam ${FAZE_MOZNOST_180[cil]}$`, "u"), q);
    expect(r[2], `90° bez směru: ${q}`).toBeTruthy();
    const ok = opts.filter((o) => FAZE_MOZNOST_90.find(([re]) => re.test(o))![1] === cil);
    expect(ok, q).toHaveLength(1);
    return ok[0];
  }

  // (4) počet otoček
  const p = q.match(/za (\d+) (týden|týdny|týdnů|hodina|hodiny|hodin)\?/u);
  if (p) {
    const dni = /^týd/u.test(p[2]) ? Number(p[1]) * 7 : Number(p[1]) / 24;
    expect(Number.isInteger(dni), `neceločíselný počet otoček: ${q}`).toBe(true);
    const ok = opts.filter((o) => {
      const c = ns(o).match(/^([\d ]+)krát$/u);
      return c && Number(c[1].replace(/ /g, "")) === dni * 1;
    });
    expect(ok, q).toHaveLength(1);
    return ok[0];
  }

  // (5) fakta a pokusy
  const f = FAKTA.filter((x) => x.otazka.test(q));
  expect(f.map((x) => x.pojem), `solver 5: nejednoznačný/žádný fakt pro: ${q}`).toHaveLength(1);
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
const norm = (s: string) => ns(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

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

describe("Tvar a pohyby Země — metadata", () => {
  it("zeměpis g6, select_one, factual, category/topic podle RVP", () => {
    expect(topic.id).toBe("g6-zem-tvar-a-pohyby-zeme-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Přírodní obraz Země");
    expect(topic.topic).toBe("Vesmír a Země");
    expect(topic.title).toBe("Tvar Země, pohyby Země, střídání dne a noci");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    if (uzel?.labels) {
      expect(uzel.labels.area).toBe(topic.category);
      expect(uzel.labels.topic).toBe(topic.topic);
    } else {
      expect(JSON.stringify(rvp)).toContain(topic.rvpNodeId!);
    }
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Tvar a pohyby Země — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) expect(Array.isArray(t.options), t.question).toBe(true);
  });

  it("deterministický při stejném seedu", () => {
    const puvodni = Math.random;
    try {
      Math.random = seeded(42);
      const a = topic.generator!(level).map((t) => [t.question, t.correctAnswer, [...t.options!].sort()]);
      Math.random = seeded(42);
      const b = topic.generator!(level).map((t) => [t.question, t.correctAnswer, [...t.options!].sort()]);
      expect(b).toEqual(a);
    } finally {
      Math.random = puvodni;
    }
  });

  it("4 unikátní možnosti, klíč právě jednou, feedback pro každý distraktor", () => {
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

describe("Tvar a pohyby Země — napříč tématem", () => {
  it("L2 i L3 střídají šablony (banka i souřadnice zastoupeny)", () => {
    const l2 = tasksBy[2].map((t) => t.question);
    expect(l2.filter((q) => /^Město /u.test(q)).length).toBeGreaterThanOrEqual(3);
    expect(l2.filter((q) => /180°/u.test(q)).length).toBeGreaterThanOrEqual(3);
    expect(l2.filter((q) => /^Kolikrát/u.test(q)).length).toBeGreaterThanOrEqual(3);
    expect(l2.filter((q) => /protože…$/u.test(q)).length).toBeGreaterThanOrEqual(3);
    expect(tasksBy[3].filter((t) => /90° délky/u.test(t.question)).length).toBeGreaterThanOrEqual(4);
    expect(tasksBy[3].filter((t) => /na kterém poledníku/u.test(t.question)).length).toBeGreaterThanOrEqual(4);
  });

  it("v prvních šesti úlohách L3 se žádná šablona neopakuje víc než dvakrát", () => {
    const sablona = (q: string) =>
      /90° délky/u.test(q) ? "90°" : /na kterém poledníku/u.test(q) ? "protilehlý poledník" : q;
    const prvnich6 = tasksBy[3].slice(0, 6).map((t) => sablona(t.question));
    for (const s of new Set(prvnich6)) {
      expect(prvnich6.filter((x) => x === s).length, `šablona ${s} v prvních 6 úlohách L3`).toBeLessThanOrEqual(2);
    }
  });

  it("žádná položka banky nezůstane nevygenerovaná", () => {
    // rotace tvůrců bere z banky jen každou N-tou úlohu — když je vzorek malý,
    // konec banky se nikdy neobjeví a napsaný obsah je mrtvý.
    for (const [lvl, pool] of [[2, POOL_L2], [3, POOL_L3]] as [number, { q: string }[]][]) {
      const qs = new Set(tasksBy[lvl].map((t) => t.question));
      expect(pool.filter((p) => !qs.has(p.q)).map((p) => p.q), `banka L${lvl}`).toEqual([]);
    }
  });

  it("feedback u úloh s 90° odpovídá vylosované situaci", () => {
    for (const t of tasksBy[3].filter((x) => /90° délky/u.test(x.question))) {
      const naVychod = /na východ\./u.test(t.question);
      for (const [o, why] of Object.entries(t.optionFeedback!)) {
        if (/špatným směrem/u.test(why)) {
          expect(why.includes(naVychod ? "místa na východě" : "Místa na západě"), `${t.question} → ${o}`).toBe(true);
        }
      }
    }
  });

  it("velká nápověda nepřilepí cizí strategickou větu", () => {
    // `dve()` v _shared.ts doplňuje obecné strategie, dokud hints[1] není aspoň
    // 1,2× delší než hints[0]. V astronomickém tématu nesedí ani jedna (poloha,
    // podnebí, vzdálenost, měřítko) → hints[1] musí být dost dlouhá sama o sobě.
    const CIZI = [/odporují poloze nebo podnebí/u, /jasně mimo/u, /vzdálenost není nesmyslně velká/u, /centimetry na mapě/u];
    const spatne = all.filter((t) => CIZI.some((re) => re.test(t.hints![1]))).map((t) => t.question);
    expect(spatne).toEqual([]);
  });

  it("zkratka souřadnice se nezdvojí s tečkou na konci věty", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/(š|d)\.\./u.test(s), `dvojtečka za zkratkou: ${s}`).toBe(false);
    }
  });

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

  it("L1 ∩ L3 = ∅ (znění otázek)", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    expect(tasksBy[3].map((t) => t.question).filter((q) => q1.has(q))).toHaveLength(0);
  });

  it("bez hodin a časových pásem v zadání", () => {
    for (const t of [...tasksBy[2], ...tasksBy[3]]) {
      expect(/\d{1,2}:\d{2}|pásm/u.test(t.question), t.question).toBe(false);
    }
  });

  it("žádné rodové lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
    }
  });
});
