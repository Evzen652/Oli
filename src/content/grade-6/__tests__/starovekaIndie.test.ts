import { describe, it, expect } from "vitest";
import { STAROVEKA_INDIE } from "../dejepis/starovekaIndie";
import type { PracticeTask } from "@/lib/types";

/**
 * Starověká Indie — FAKTICKÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta), pole `correct` z banky NEPOUŽÍVÁ:
 *  (A) tabulka FAKTA: poznávací znaky otázky → znak jediné pravdivé možnosti
 *      (pojem → definice/rys, situace → varna/pojem, příčina → vysvětlení);
 *  (B) tabulka TVRZENÍ → systém (hinduismus / buddhismus / oba): u srovnávacích
 *      otázek („platí pro H, ale ne pro B“, „společné“) solver ohodnotí každou
 *      možnost a podmínce musí vyhovět právě jedna;
 *  (C) strukturní kontroly: 4 unikátní možnosti, feedback pro distraktory,
 *      klíč není v otázce ani v nápovědách, délka a začátek klíče neprozrazují,
 *      ≥12 unikátních úloh na úroveň, L1 ∩ L3 = ∅, category/topic přesně podle RVP.
 */
const topic = STAROVEKA_INDIE[0];

interface Fakt {
  pojem: string;
  otazka: RegExp[];
  moznost: RegExp;
}

const FAKTA: Fakt[] = [
  // ── pojmy (L1) ──
  { pojem: "Indus", otazka: [/u které řeky/i, /mohendžodáro a harappa/i], moznost: /^indus$/i },
  { pojem: "převtělování", otazka: [/duše po smrti přechází/i], moznost: /^převtělování$/i },
  { pojem: "bráhmani", otazka: [/která varna/i, /obřady/i], moznost: /^bráhmani$/i },
  { pojem: "Siddhártha", otazka: [/kterému lidé začali říkat buddha/i], moznost: /^siddhártha/i },
  { pojem: "Šiva", otazka: [/ničitel a obnovitel/i], moznost: /^šiva$/i },
  { pojem: "nedotknutelní-pojem", otazka: [/mimo varny/i, /nečisté/i], moznost: /^nedotknuteln/i },
  { pojem: "karma-zákon", otazka: [/jak se nazývá zákon/i, /skutky/i], moznost: /^karma$/i },
  { pojem: "kráva", otazka: [/živočich/i, /posvátný/i], moznost: /^kráva$/i },
  { pojem: "Ganga", otazka: [/posvátném toku/i], moznost: /^ganga$/i },
  { pojem: "nirvána", otazka: [/jak se nazývá stav/i, /konce utrpení/i], moznost: /^nirvána$/i },
  { pojem: "Védy", otazka: [/nejstarší posvátné spisy/i], moznost: /^védy$/i },
  { pojem: "Brahma", otazka: [/stvořitele/i], moznost: /^brahma$/i },
  { pojem: "Višnu", otazka: [/ochráncem světa/i], moznost: /^višnu$/i },
  { pojem: "varna", otazka: [/společenská skupina/i, /narodil/i], moznost: /varna/i },
  { pojem: "Árjové", otazka: [/1500/i, /kmeny/i], moznost: /^árjov/i },
  { pojem: "mnich", otazka: [/vzdal majetku/i, /klášteře/i], moznost: /^mnich$/i },
  // ── situace (L2) ──
  { pojem: "syn hrnčíře", otazka: [/syn hrnčíře/i], moznost: /řemesla.*rodina/i },
  { pojem: "karma-krutost", otazka: [/krutý ke zvířatům/i], moznost: /^karma$/i },
  { pojem: "kšatrijové", otazka: [/s mečem/i, /vojsko/i], moznost: /^kšatrijové$/i },
  { pojem: "vaišjové", otazka: [/obchodník látky/i, /rolník/i], moznost: /^vaišjové$/i },
  { pojem: "buddhismus-touha", otazka: [/vzniká z touhy/i, /které učení/i], moznost: /^buddhismus$/i },
  { pojem: "kazatel", otazka: [/bez ohledu na původ/i, /kdo mu to káže/i], moznost: /^buddhist/i },
  { pojem: "nedotknutelní-situace", otazka: [/bojí dotknout/i], moznost: /^nedotknuteln/i },
  { pojem: "sňatek", otazka: [/vdát/i], moznost: /stejné varny/i },
  { pojem: "matka", otazka: [/buď hodný/i], moznost: /karmu a převtělování/i },
  { pojem: "poutník", otazka: [/poutník/i, /ganze/i], moznost: /^hinduismus$/i },
  { pojem: "princ", otazka: [/opustí palác/i], moznost: /siddhárth/i },
  { pojem: "kovář", otazka: [/kováře/i], moznost: /dědilo/i },
  { pojem: "šúdrové", otazka: [/sluha/i, /nemá vlastní půdu/i], moznost: /^šúdrové$/i },
  { pojem: "kráva-provinění", otazka: [/těžké provinění/i], moznost: /^zabít krávu/i },
  { pojem: "šúdra-buddhista", otazka: [/muž z varny šúdrů/i], moznost: /^ano, původ/i },
  { pojem: "smrt-bez-nirvány", otazka: [/zemře dřív, než dosáhl nirvány/i], moznost: /znovu se narodí/i },
  // ── příčiny a závěry (L3) ──
  { pojem: "nižší varny", otazka: [/oslovit i lidi z nižších varen/i], moznost: /nevázal na varnu/i },
  { pojem: "neměnná společnost", otazka: [/měnila jen málo/i], moznost: /určovala hlavně varna/i },
  { pojem: "úděl", otazka: [/přijímat svůj úděl/i], moznost: /lepší zrození/i },
  { pojem: "šíření", otazka: [/až do číny/i], moznost: /obchodník/i },
  { pojem: "oběť", otazka: [/liší od hledání spásy obětí/i], moznost: /vlastní úsilí/i },
  { pojem: "bráhmani-proč", otazka: [/výš než kšatrijové/i], moznost: /konat obřady/i },
  { pojem: "studium", otazka: [/stačí vystudovat/i], moznost: /narozením, ne vzděláním/i },
  { pojem: "karma-závěr", otazka: [/závěr o karmě/i], moznost: /zákon důsledků/i },
  { pojem: "bráhman-karma", otazka: [/bráhman celý život/i, /zákona karmy/i], moznost: /nižší varny/i },
  { pojem: "touha", otazka: [/přestaneš po všem toužit/i], moznost: /vlastního myšlení/i },
  { pojem: "zvířata", otazka: [/ubližovat zvířatům/i], moznost: /zlé skutky/i },
  { pojem: "zákoník", otazka: [/nesměl šúdra/i], moznost: /vyšším varnám/i },
  { pojem: "osvícený", otazka: [/proč se siddhárthovi/i, /osvícený/i], moznost: /příčinu utrpení/i },
  { pojem: "Osiris vs. karma", otazka: [/posmrtný soud u osirida/i], moznost: /ne vážení srdce/i },
];

type Sys = "H" | "B" | "oba";
/** Tabulka tvrzení → systém. Pořadí pravidel je významné (první shoda vyhrává). */
const TVRZENI: { re: RegExp; sys: Sys }[] = [
  { re: /(každé|jakékoli) varny|bez ohledu na varnu/i, sys: "B" },
  { re: /nirván|touh|siddhárth|gautam/i, sys: "B" },
  { re: /brahm|višnu|šiv/i, sys: "H" },
  { re: /varn|varen/i, sys: "H" },
  { re: /převtěl|znovu narodí|novém těle|skutky|karm/i, sys: "oba" },
];
const systemTvrzeni = (s: string): Sys | null => TVRZENI.find((r) => r.re.test(s))?.sys ?? null;

const SROVNANI: { otazka: RegExp; cil: Sys }[] = [
  { otazka: /platí pro hinduismus, ale ne pro buddhismus/i, cil: "H" },
  { otazka: /platí pro buddhismus, ale ne pro hinduismus/i, cil: "B" },
  { otazka: /mají hinduismus a buddhismus společné/i, cil: "oba" },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Vrátí možnost, kterou solver sám určil jako jedinou pravdivou. */
function vyres(t: PracticeTask): { pojem: string; klic: string; pravdive: (o: string) => boolean } {
  const srov = SROVNANI.filter((s) => s.otazka.test(t.question));
  const fakty = FAKTA.filter((f) => f.otazka.every((r) => r.test(t.question)));
  expect(srov.length + fakty.length, `solver: nejednoznačný/žádný fakt pro: ${t.question}`).toBe(1);
  if (srov.length === 1) {
    const cil = srov[0].cil;
    for (const o of t.options!) expect(systemTvrzeni(o), `tvrzení bez systému: ${o}`).not.toBeNull();
    const pravdive = (o: string) => systemTvrzeni(o) === cil;
    const ok = t.options!.filter(pravdive);
    expect(ok, `srovnání (${cil}): nevyhovuje právě 1 možnost v: ${t.question}`).toHaveLength(1);
    return { pojem: `srovnání-${cil}`, klic: ok[0], pravdive };
  }
  const fakt = fakty[0];
  const pravdive = (o: string) => fakt.moznost.test(o);
  const ok = t.options!.filter(pravdive);
  expect(ok, `solver (${fakt.pojem}): nepřipouští právě 1 možnost v: ${t.question}`).toHaveLength(1);
  return { pojem: fakt.pojem, klic: ok[0], pravdive };
}

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);

describe("Starověká Indie — metadata", () => {
  it("dějepis g6, select_one, factual, RVP uzel, category/topic podle RVP", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Starověká Indie a Čína");
    expect(topic.studentTitle).toBe("Starověká Indie");
    expect(topic.rvpNodeId).toBe("g6-dejepis-starovek-staroveka-indie-a-cina-staroveka-indie-kasty-hinduismus-buddhismus");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Starověká Indie — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, deterministicky, jen select_one s options", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    const znovu = topic.generator(level).map((t) => t.question).sort();
    expect(znovu).toEqual(tasks.map((t) => t.question).sort());
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(["ano", "ne", "pravda", "nepravda"]).not.toContain(norm(t.correctAnswer));
    }
  });

  it("4 unikátní možnosti, feedback pro každý distraktor, klíč bez feedbacku", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      expect(t.optionFeedback?.[t.correctAnswer], t.question).toBeUndefined();
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback "${d}" v: ${t.question}`).toBeTruthy();
      }
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
    }
  });

  it("nezávislý solver dojde ke stejnému klíči a distraktory jsou špatně", () => {
    for (const t of tasks) {
      const { pojem, klic, pravdive } = vyres(t);
      expect(t.correctAnswer, `${pojem}: ${t.question}`).toBe(klic);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(pravdive(d), `distraktor „${d}“ je také správně: ${t.question}`).toBe(false);
      }
    }
  });

  it("klíč není ve znění otázky ani v nápovědách", () => {
    for (const t of tasks) {
      const k = norm(t.correctAnswer);
      expect(norm(t.question).includes(k), `giveaway v otázce: ${t.question}`).toBe(false);
      for (const h of t.hints ?? []) {
        expect(norm(h).includes(k), `nápověda prozrazuje „${t.correctAnswer}“: ${h}`).toBe(false);
      }
    }
  });

  it("klíč nevyčnívá počátečním slovem", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (jine[0].length >= 3 && new Set(jine).size === 1) {
        expect(prvni(t.correctAnswer), `klíč vyčnívá začátkem: ${t.question}`).toBe(jine[0]);
      }
    }
  });
});

describe("Starověká Indie — napříč tématem", () => {
  it("klíč není systematicky nejdelší (check:length)", () => {
    let nejdelsi = 0;
    let vyrazne = 0;
    for (const t of all) {
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0] === t.correctAnswer && s[0].length > s[1].length) nejdelsi++;
      if (s[0] === t.correctAnswer && s[0].length >= s[1].length * 1.25) vyrazne++;
    }
    expect(nejdelsi / all.length, `klíč nejdelší v ${nejdelsi}/${all.length}`).toBeLessThanOrEqual(0.4);
    expect(vyrazne / all.length, `klíč výrazně nejdelší v ${vyrazne}/${all.length}`).toBeLessThanOrEqual(0.1);
    for (const l of LEVELS) {
      const n = tasksBy[l].filter((t) => {
        const s = [...t.options!].sort((a, b) => b.length - a.length);
        return s[0] === t.correctAnswer && s[0].length > s[1].length;
      }).length;
      expect(n / tasksBy[l].length, `L${l}: klíč nejdelší v ${n}/${tasksBy[l].length}`).toBeLessThanOrEqual(0.4);
    }
  });

  it("opačný vzorec: distraktor není uměle natažený", () => {
    for (const t of all) {
      const d = [...t.options!].sort((a, b) => b.length - a.length)[0];
      if (d !== t.correctAnswer && t.correctAnswer.length >= 20) {
        expect(d.length, `distraktor výrazně delší než klíč: „${d}“`).toBeLessThan(t.correctAnswer.length * 1.35 + 4);
      }
    }
  });

  it("L1 ∩ L3 = ∅; L3 srovnávací/kauzální, L1 ne", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    const q3 = tasksBy[3].map((t) => t.question);
    expect(q3.filter((q) => q1.has(q))).toHaveLength(0);
    const ANALYZA = /(^|\s)proč(\s|$)|vyplývá|závěr|společné|liší|platí pro/i;
    for (const q of q3) expect(ANALYZA.test(q), `L3 bez analýzy: ${q}`).toBe(true);
    for (const q of q1) expect(ANALYZA.test(q), `L1 s analytickou formulací: ${q}`).toBe(false);
  });

  it("nápovědy jsou unikátní napříč úlohami", () => {
    expect(new Set(all.map((t) => t.hints![0])).size).toBe(all.length);
    expect(new Set(all.map((t) => t.hints![1])).size).toBe(all.length);
  });

  it("žádné rodové lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/\b\p{L}+\/\p{L}+\b/u.test(s), `lomítkový tvar: ${s}`).toBe(false);
    }
  });
});
