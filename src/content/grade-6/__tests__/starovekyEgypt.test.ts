import { describe, it, expect } from "vitest";
import { STAROVEKY_EGYPT } from "../dejepis/starovekyEgypt";
import type { PracticeTask } from "@/lib/types";

/**
 * Starověký Egypt — FAKTICKÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): vlastní tabulka FAKTA, která pole `correct`
 * z banky NEPOUŽÍVÁ. Každý fakt = pojem → civilizace + poznávací znaky otázky
 * (co se o pojmu v zadání říká) + znaky správné možnosti (funkce / příčina
 * jiným slovníkem). Solver pro každou úlohu:
 *  (1) najde PRÁVĚ JEDEN fakt, jehož znaky otázky sedí na zadání;
 *  (2) z options vybere PRÁVĚ JEDNU, kterou fakt připouští → musí = correctAnswer;
 *  (3) každý distraktor fakt nepřipouští (a klíč nikdy nepatří Mezopotámii);
 *  (4) klíč není ve znění otázky ani v nápovědách (bez diakritiky);
 *  (5) 4 unikátní možnosti, feedback pro každý distraktor;
 *  (6) délka a začátek klíče neprozrazují; ≥12 unikátních úloh na úroveň;
 *      L1 ∩ L3 = ∅, L3 kauzální/závěrová, L1 ne; nápovědy unikátní.
 */
const topic = STAROVEKY_EGYPT[0];

type Civ = "egypt" | "mezopotamie";
interface Fakt {
  pojem: string;
  civ: Civ;
  /** Všechny musí sedět na znění otázky. */
  otazka: RegExp[];
  /** Znak možnosti, kterou fakt připouští jako pravdivou. */
  moznost: RegExp;
}

/** Reálie Mezopotámie — klíč k nim nikdy nesmí patřit. */
const MEZOPOTAMIE = /klínov|zikkurat|chammurapi|eufrat|tigris|babylon|marduk|ištař|\bur\b|\buru\b/i;

const FAKTA: Fakt[] = [
  // ── pojmy (L1) ──
  { pojem: "faraon", civ: "egypt", otazka: [/panovník/i, /jako boha/i], moznost: /^faraon$/i },
  { pojem: "papyrus", civ: "egypt", otazka: [/materiál/i, /rostlin/i], moznost: /^papyr/i },
  { pojem: "Nil", civ: "egypt", otazka: [/řeka/i, /úrodnou půdu/i], moznost: /^nil$/i },
  { pojem: "pyramida-funkce", civ: "egypt", otazka: [/k čemu sloužil/i, /pyramid/i], moznost: /hrob/i },
  { pojem: "hieroglyfy", civ: "egypt", otazka: [/obrázkov/i, /písm/i], moznost: /hieroglyf/i },
  { pojem: "mumifikace-duvod", civ: "egypt", otazka: [/kvůli čemu/i, /těla zemřelých/i], moznost: /posmrt/i },
  { pojem: "Ra", civ: "egypt", otazka: [/slunce/i, /kterého boha/i], moznost: /\bra$/i },
  { pojem: "Osiris", civ: "egypt", otazka: [/podsvětí/i, /(soudil|soud)/i], moznost: /osiris/i },
  { pojem: "písař", civ: "egypt", otazka: [/(úřední záznamy|zapisuje)/i], moznost: /^písař$/i },
  { pojem: "mumie", civ: "egypt", otazka: [/(zachované tělo|vysuší)/i], moznost: /^mumi/i },
  { pojem: "Rosettská deska", civ: "egypt", otazka: [/ve třech písmech/i, /jak se nazývá/i], moznost: /rosett/i },
  { pojem: "bahno", civ: "egypt", otazka: [/záplavy/i, /přinášel/i], moznost: /bahno/i },
  { pojem: "Egypt vs. Mezopotámie", civ: "egypt", otazka: [/a ne do mezopotámie/i], moznost: /gíz/i },
  { pojem: "obelisk", civ: "egypt", otazka: [/sloup/i, /před chrámy/i], moznost: /^obelisk$/i },
  // ── situace (L2) ──
  { pojem: "Champollion", civ: "egypt", otazka: [/přečetl/i], moznost: /champollion/i },
  { pojem: "Tutanchamon-maska", civ: "egypt", otazka: [/zlatá pohřební maska/i, /komu/i], moznost: /tutanchamon/i },
  { pojem: "Carter", civ: "egypt", otazka: [/1922/i, /^kdo/i], moznost: /carter/i },
  { pojem: "záplava-důsledek", civ: "egypt", otazka: [/rozlije/i, /rolník/i], moznost: /úrodn/i },
  { pojem: "pyramida-stavba", civ: "egypt", otazka: [/uloženo tělo/i], moznost: /^pyramid/i },
  { pojem: "Cheops", civ: "egypt", otazka: [/největší z pyramid/i], moznost: /cheops/i },
  { pojem: "sfinga", civ: "egypt", otazka: [/lev/i, /lidskou tváří/i], moznost: /sfing/i },
  { pojem: "daň", civ: "egypt", otazka: [/sýp/i, /platí/i], moznost: /daň/i },
  { pojem: "vezír", civ: "egypt", otazka: [/nejvyššího úředníka/i], moznost: /^vezír$/i },
  { pojem: "vážení srdce", civ: "egypt", otazka: [/misce vah/i, /výjev/i], moznost: /^soud/i },
  { pojem: "hieroglyfy-poznání", civ: "egypt", otazka: [/sova/i], moznost: /hieroglyf/i },
  { pojem: "zavlažování", civ: "egypt", otazka: [/neprší/i], moznost: /(zavlaž|kanál)/i },
  { pojem: "faraon-malba", civ: "egypt", otazka: [/korunu/i, /žezlo/i], moznost: /^faraon/i },
  // ── příčiny a závěry (L3) ──
  { pojem: "vznik státu", civ: "egypt", otazka: [/proč vznikl/i, /stát/i], moznost: /(řízení|organiz|správ)/i },
  { pojem: "moc faraona", civ: "egypt", otazka: [/dělníků/i, /vyplývá/i], moznost: /moc nad/i },
  { pojem: "hrob chudého", civ: "egypt", otazka: [/chudého/i, /závěr/i], moznost: /i chudí věřili/i },
  { pojem: "písemné prameny", civ: "egypt", otazka: [/bez rozluštění/i], moznost: /nečiteln/i },
  { pojem: "vážnost písařů", civ: "egypt", otazka: [/proč/i, /písaři/i, /vážen/i], moznost: /málo lidí/i },
  { pojem: "malba jako pramen", civ: "egypt", otazka: [/malba sklizně/i, /závěr/i], moznost: /pěstovalo obilí/i },
  { pojem: "kámen", civ: "egypt", otazka: [/z kamene/i, /proč/i], moznost: /dostatek.*kamene/i },
  { pojem: "kalendář", civ: "egypt", otazka: [/kalendář/i], moznost: /záplav/i },
  { pojem: "nevykradená hrobka", civ: "egypt", otazka: [/nevykraden/i, /vyplývá/i], moznost: /téměř celou výbavou/i },
  { pojem: "dědičná vláda", civ: "egypt", otazka: [/poslouchali/i], moznost: /dědičn/i },
  { pojem: "víra v soud", civ: "egypt", otazka: [/svitky s modlitbami/i, /závěr/i], moznost: /věřili v život po smrti/i },
  { pojem: "Rosettská deska-proč", civ: "egypt", otazka: [/proč/i, /rosettské desce/i], moznost: /s čím porovnat/i },
  { pojem: "život u řeky", civ: "egypt", otazka: [/pruhu podél řeky/i], moznost: /voda a úrodná/i },
  { pojem: "mumie jako pramen", civ: "egypt", otazka: [/vyšetřili/i, /závěr/i], moznost: /jednoho člověka/i },
  { pojem: "evidence státu", civ: "egypt", otazka: [/záznamy o sklizni/i, /vyplývá/i], moznost: /úředníky/i },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function vyres(t: PracticeTask): { fakt: Fakt; klic: string } {
  const fakty = FAKTA.filter((f) => f.otazka.every((r) => r.test(t.question)));
  expect(fakty.map((f) => f.pojem), `solver: nejednoznačný/žádný fakt pro: ${t.question}`).toHaveLength(1);
  const fakt = fakty[0];
  const pripustne = t.options!.filter((o) => fakt.moznost.test(o) && !(fakt.civ === "egypt" && MEZOPOTAMIE.test(o)));
  expect(pripustne, `solver (${fakt.pojem}): nepřipouští právě 1 možnost v: ${t.question}`).toHaveLength(1);
  return { fakt, klic: pripustne[0] };
}

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);

describe("Starověký Egypt — metadata", () => {
  it("dějepis g6, select_one, factual, RVP uzel", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Nejstarší státy - Mezopotámie a Egypt");
    expect(topic.studentTitle).toBe("Starověký Egypt");
    expect(topic.rvpNodeId).toBe(
      "g6-dejepis-starovek-nejstarsi-staty-mezopotamie-a-egypt-staroveky-egypt-faraoni-pyramidy-hieroglyfy",
    );
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Starověký Egypt — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("(6) ≥12 unikátních úloh, deterministicky", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    const znovu = topic.generator(level).map((t) => t.question).sort();
    expect(znovu).toEqual(tasks.map((t) => t.question).sort());
  });

  it("(4) 4 unikátní možnosti, feedback pro každý distraktor, klíč bez feedbacku", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options).toContain(t.correctAnswer);
      expect(t.optionFeedback?.[t.correctAnswer], t.question).toBeUndefined();
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback "${d}" v: ${t.question}`).toBeTruthy();
      }
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.hints, t.question).toHaveLength(2);
    }
  });

  it("(1)(2) nezávislý solver dojde ke stejnému klíči", () => {
    for (const t of tasks) {
      const { fakt, klic } = vyres(t);
      expect(t.correctAnswer, `${fakt.pojem}: ${t.question}`).toBe(klic);
    }
  });

  it("(2) klíč nepatří Mezopotámii; distraktory jsou jednoznačně špatně", () => {
    for (const t of tasks) {
      expect(MEZOPOTAMIE.test(t.correctAnswer), `klíč z Mezopotámie: ${t.question}`).toBe(false);
      const { fakt } = vyres(t);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        const spatne = MEZOPOTAMIE.test(d) || !fakt.moznost.test(d);
        expect(spatne, `distraktor „${d}“ je také správně: ${t.question}`).toBe(true);
      }
    }
  });

  it("(3) klíč není ve znění otázky ani v nápovědách", () => {
    for (const t of tasks) {
      const k = norm(t.correctAnswer);
      expect(norm(t.question).includes(k), `giveaway v otázce: ${t.question}`).toBe(false);
      for (const h of t.hints ?? []) {
        expect(norm(h).includes(k), `nápověda prozrazuje „${t.correctAnswer}“: ${h}`).toBe(false);
      }
    }
  });

  it("(5) klíč nevyčnívá počátečním slovem", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (jine[0].length >= 3 && new Set(jine).size === 1) {
        expect(prvni(t.correctAnswer), `klíč vyčnívá začátkem: ${t.question}`).toBe(jine[0]);
      }
    }
  });
});

describe("Starověký Egypt — napříč tématem", () => {
  it("(5) klíč není systematicky nejdelší (check:length)", () => {
    let nejdelsi = 0;
    let vyrazne = 0;
    for (const t of all) {
      const serazene = [...t.options!].sort((a, b) => b.length - a.length);
      if (serazene[0] === t.correctAnswer && serazene[0].length > serazene[1].length) nejdelsi++;
      if (serazene[0] === t.correctAnswer && serazene[0].length >= serazene[1].length * 1.25) vyrazne++;
    }
    expect(nejdelsi / all.length, `klíč nejdelší v ${nejdelsi}/${all.length}`).toBeLessThanOrEqual(0.4);
    expect(vyrazne / all.length, `klíč výrazně nejdelší v ${vyrazne}/${all.length}`).toBeLessThanOrEqual(0.1);
  });

  it("(5) opačný vzorec: klíč není NIKDY nejdelší a distraktor není uměle natažený", () => {
    // Když se délky vyrovnávají jen natahováním distraktorů, vznikne obrácená
    // nápověda „nejdelší možnost je špatně“. Klíč má být nejdelší zhruba ve 1/4.
    let nejdelsi = 0;
    for (const t of all) {
      const serazene = [...t.options!].sort((a, b) => b.length - a.length);
      if (serazene[0] === t.correctAnswer && serazene[0].length > serazene[1].length) nejdelsi++;
      const d = serazene[0];
      if (d !== t.correctAnswer && t.correctAnswer.length >= 20) {
        expect(d.length, `distraktor výrazně delší než klíč: „${d}“`).toBeLessThan(t.correctAnswer.length * 1.35 + 4);
      }
    }
    expect(nejdelsi / all.length, `klíč nejdelší jen v ${nejdelsi}/${all.length}`).toBeGreaterThanOrEqual(0.12);
    for (const l of LEVELS) {
      const n = tasksBy[l].filter((t) => {
        const s = [...t.options!].sort((a, b) => b.length - a.length);
        return s[0] === t.correctAnswer && s[0].length > s[1].length;
      }).length;
      expect(n / tasksBy[l].length, `L${l}: klíč nejdelší v ${n}/${tasksBy[l].length}`).toBeLessThanOrEqual(0.4);
    }
  });

  it("(2) L3 nepoužívá záměnu s Mezopotámií (chyby v úvaze, ne vymyšlený Babylon)", () => {
    for (const t of tasksBy[3]) {
      for (const o of t.options!) expect(/klínov|zikkurat|chammurapi|eufrat|tigris|babylon|marduk|ištař/i.test(o), `L3 možnost z Mezopotámie: ${o}`).toBe(false);
      for (const f of Object.values(t.optionFeedback ?? {})) {
        expect(f.startsWith("To je Mezopotámie"), `L3 feedback se šablonou MEZO: ${f}`).toBe(false);
      }
    }
  });

  it("(6) L1 ∩ L3 = ∅; L3 kauzální/závěrová, L1 ne", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    const q3 = tasksBy[3].map((t) => t.question);
    expect(q3.filter((q) => q1.has(q))).toHaveLength(0);
    // \b nefunguje u „č“ (JS regex bez /u bere diakritiku jako ne-slovní znak).
    const KAUZALNI = /(^|\s)proč(\s|$)|vyplývá|závěr/i;
    for (const q of q3) expect(KAUZALNI.test(q), `L3 bez kauzality: ${q}`).toBe(true);
    for (const q of q1) expect(KAUZALNI.test(q), `L1 s kauzální formulací: ${q}`).toBe(false);
  });

  it("(7) nápovědy jsou unikátní napříč úlohami", () => {
    const h0 = all.map((t) => t.hints![0]);
    const h1 = all.map((t) => t.hints![1]);
    expect(new Set(h0).size).toBe(all.length);
    expect(new Set(h1).size).toBe(all.length);
  });

  it("(7) žádné rodové lomítkové tvary ani předložka nalepená na jméno", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) {
        expect(/\b\p{L}+\/\p{L}+\b/u.test(s), `lomítkový tvar: ${s}`).toBe(false);
        expect(/\b(z|u|v|k|s) (sklo|jantar)\b/i.test(s), s).toBe(false);
      }
    }
  });
});
