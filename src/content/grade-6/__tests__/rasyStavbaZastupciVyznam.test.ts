import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RASY_STAVBA_ZASTUPCI_VYZNAM } from "../prirodopis/rasyStavbaZastupciVyznam";
import type { PracticeTask } from "@/lib/types";

/**
 * Řasy — stavba, zástupci, význam (FAKTICKÝ select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): pole `correct` z banky nepoužívá. Klasifikuje
 * klíč podle klíčových slov ve ZNĚNÍ otázky; mapa pravidel je psaná zvlášť
 * (první shoda vyhrává). Pravidlo určí vzor správné možnosti a ten musí
 * v nabídce sedět právě na jednu možnost — tu, kterou generátor označil jako klíč.
 * Pokrytí pravidly musí být aspoň 70 %.
 */
const topic = RASY_STAVBA_ZASTUPCI_VYZNAM[0];

interface Pravidlo { vse: RegExp[]; ne?: RegExp[]; moznost: RegExp }
const PRAVIDLA: Pravidlo[] = [
  { vse: [/bez jádra/i], moznost: /^sinice$/i },
  { vse: [/rozlišíš/i], moznost: /větví/i },
  { vse: [/popis/i, /chybně/i], moznost: /nevětví/i },
  { vse: [/společného/i], moznost: /nemají kořeny/i },
  { vse: [/dvojici/i, /sladké/i], moznost: /^šroubatka a žabí vlas$/i },
  { vse: [/zelené řasy od hnědých/i], moznost: /zakryje/i },
  { vse: [/jeskyn/i], moznost: /fotosyntéz/i },
  { vse: [/odtrhla/i], moznost: /^jen oporu/i },
  { vse: [/nevětv/i], moznost: /^šroubatka$/i },
  { vse: [/větv/i, /vlákn|nit/i], moznost: /^žabí vlas$/i },
  { vse: [/jednobuněčn|jedné buňky|kulič/i], moznost: /^zelenivka$/i },
  { vse: [/pobřeží/i, /půdy/i], moznost: /uvolní živiny/i },
  { vse: [/moř/i, /hněd|metr/i], moznost: /^chaluha$/i },
  { vse: [/hnojivo a potravu/i], moznost: /^chaluha$/i },
  { vse: [/drží na skal/i], moznost: /^příchytn/i },
  { vse: [/nemá kořeny/i, /přijímá/i], moznost: /celým povrchem/i },
  { vse: [/části buňky/i], moznost: /chloroplast/i },
  { vse: [/fotosyntéz/i, /uvolň/i], moznost: /^kyslík$/i },
  { vse: [/fotosyntéz/i, /odebír/i], moznost: /^oxid uhličitý$/i },
  { vse: [/bublin/i], moznost: /^kyslík/i },
  { vse: [/potřebují k fotosyntéz/i], moznost: /světlo.*oxid uhličitý/i },
  { vse: [/nižším rostlinám/i], moznost: /^řasy$/i },
  { vse: [/jádrem a chloroplasty/i, /skupiny/i], moznost: /^řasy$/i },
  { vse: [/navíc oproti houbám/i], moznost: /chloroplast/i },
  { vse: [/liší od hub/i], moznost: /^řasy mají chloroplasty/i },
  { vse: [/liší/i, /sinice/i], moznost: /řasy má jádro/i },
  { vse: [/barvu/i, /chaluh/i], moznost: /hněd/i },
  { vse: [/kořenech/i], moznost: /nemají/i },
  { vse: [/kde žij/i, /chaluh/i], moznost: /moř/i },
  { vse: [/kde žij/i, /šroubat/i], moznost: /sladké/i },
  { vse: [/tělo šroubatky/i], moznost: /^nevětven/i },
  { vse: [/tělo žabího vlasu/i], moznost: /^větven/i },
  { vse: [/kolika buněk/i], moznost: /jedné/i },
  { vse: [/skupiny řas patří/i], moznost: /^zelené řasy$/i },
  { vse: [/jak velká/i], moznost: /metr/i },
  { vse: [/k čemu člověk/i], moznost: /potrav.*hnojiv/i },
  { vse: [/vrstvě/i], moznost: /světlo/i },
  { vse: [/pro ryby/i], moznost: /drobné živočichy/i },
  { vse: [/jen škodlivé/i], moznost: /potravou drobných živočichů/i },
  { vse: [/vymřel/i], moznost: /^ubude/i },
  { vse: [/sníží světlo/i], moznost: /zpomalí/i },
  { vse: [/kořeny a listy/i, /mýlí/i], moznost: /nemá kořeny ani listy/i },
  { vse: [/potřebují/i, /světlo/i, /^proč/i], moznost: /bez světla/i },
  { vse: [/plíseň/i, /chloroplasty/i], moznost: /^jde o řasu/i },
];

const ZASTUPCI = ["Zelenivka", "Šroubatka", "Žabí vlas", "Chaluha"];
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Vrátí klíč podle pravidel, nebo undefined, když žádné pravidlo nesedí. */
function vyres(t: PracticeTask): string | undefined {
  const q = t.question;
  const p = PRAVIDLA.find((r) => r.vse.every((x) => x.test(q)) && !(r.ne ?? []).some((x) => x.test(q)));
  if (!p) return undefined;
  const ok = t.options!.filter((o) => p.moznost.test(o));
  expect(ok, `solver: pravidlo ${p.moznost} nepřipouští právě 1 možnost v: ${q}`).toHaveLength(1);
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

describe("Řasy — metadata", () => {
  it("přírodopis g6, select_one, factual, category/topic znak po znaku dle RVP", () => {
    expect(topic.id).toBe("g6-pri-rasy-stavba-zastupci-vyznam-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.category).toBe("Biologie rostlin");
    expect(topic.topic).toBe("Nižší rostliny");
    const rvp = JSON.parse(readFileSync(join(process.cwd(), "data/rvp_data.json"), "utf8"));
    const uzel = najdiUzel(rvp, topic.rvpNodeId!);
    expect(uzel?.labels?.area).toBe(topic.category);
    expect(uzel?.labels?.topic).toBe(topic.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Řasy — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, deterministicky, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    expect(topic.generator!(level).map((t) => t.question)).toEqual(tasks.map((t) => t.question));
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
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("nezávislý solver dojde ke stejnému klíči", () => {
    for (const t of tasks) {
      const k = vyres(t);
      if (k !== undefined) expect(t.correctAnswer, t.question).toBe(k);
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

  it("klíč nevyčnívá prvním slovem", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(jine).size === 1) expect(prvni(t.correctAnswer), `klíč vyčnívá: ${t.question}`).toBe(jine[0]);
    }
  });
});

describe("Řasy — napříč tématem", () => {
  it("solver pokrývá aspoň 70 % úloh", () => {
    const pokryto = all.filter((t) => vyres(t) !== undefined).length;
    expect(pokryto / all.length, `pokryto ${pokryto}/${all.length}`).toBeGreaterThanOrEqual(0.7);
  });

  it("L3: když je klíčem zástupce, jméno žádného zástupce není ve znění", () => {
    for (const t of tasksBy[3].filter((x) => ZASTUPCI.includes(x.correctAnswer))) {
      for (const z of ZASTUPCI) {
        const koren = norm(z).slice(0, 6);
        expect(norm(t.question).includes(koren), `jméno „${z}“ ve znění: ${t.question}`).toBe(false);
      }
    }
  });

  it("faktické pojistky klíčů", () => {
    for (const t of all) {
      const k = t.correctAnswer;
      if (/kořen|list/i.test(k)) expect(/nemá|nemaj/i.test(k), `klíč tvrdí kořeny/listy: ${k}`).toBe(true);
      if (/chaluh/i.test(t.question) && /sladk|rybník|potok/i.test(k)) throw new Error(`chaluha ve sladké vodě: ${k}`);
      expect(/řasy? (jsou|je) (houb|sinic)/i.test(k), `klíč: ${k}`).toBe(false);
      expect(/agar|vodní květ|%/i.test(k), `sporné fakt jako klíč: ${k}`).toBe(false);
    }
  });

  it("L3: všechny možnosti u otázek „Proč…“ začínají „Protože“", () => {
    for (const t of tasksBy[3].filter((x) => /^Proč/.test(x.question))) {
      for (const o of t.options!) expect(o.startsWith("Protože"), `${t.question} → ${o}`).toBe(true);
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

  it("nápovědy unikátní napříč úlohami", () => {
    expect(new Set(all.map((t) => t.hints![0])).size).toBe(all.length);
    expect(new Set(all.map((t) => t.hints![1])).size).toBe(all.length);
  });

  it("žádné rodové lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...t.options!, ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/\p{L}\/\p{L}/u.test(s), `lomítko: ${s}`).toBe(false);
    }
  });
});
