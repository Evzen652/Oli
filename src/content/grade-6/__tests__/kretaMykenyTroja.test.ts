import { describe, it, expect } from "vitest";
import { KRETA_MYKENY_TROJA, POOL_L3 } from "../dejepis/kretaMykenyTroja";
import type { PracticeTask } from "@/lib/types";

/**
 * Kréta, Mykény a Trója — FAKTICKÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, pole `correct` z banky nepoužívá):
 *  L1 — vlastní tabulka FAKTA_L1: znak otázky → znak jediné pravdivé možnosti.
 *  L2 — klasifikátor klíčových slov: STOPY (popis v otázce) dají štítek
 *       KRETA / MYKENY / TROJA, JMÉNA (v možnostech) dají štítek možnosti.
 *       Otázka musí mít právě jeden štítek, právě jedna možnost ho musí sdílet
 *       a ta = correctAnswer. Otázka L2 nesmí obsahovat jméno civilizace/lokality.
 *  L3 — tabulka FAKTA_L3 (znak otázky → znak závěru) + kontrola claimKind:
 *       u otázek „co nález dokazuje“ klíč není mýtus a aspoň jeden distraktor
 *       mýtus je (nezávislý regex MYTUS i štítek z banky se musí shodnout).
 *  Strukturní: 4 různé možnosti, feedback pro distraktory, ≥12 úloh na úroveň
 *  deterministicky, L1 ∩ L3 = ∅, klíč není v otázce ani v nápovědách,
 *  délka a první slovo klíče neprozrazují, nápovědy unikátní, datace s asi/kolem,
 *  category/topic znak po znaku.
 */
const topic = KRETA_MYKENY_TROJA[0];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// ── L1 ─────────────────────────────────────────────────────────────────────
interface Fakt {
  pojem: string;
  otazka: RegExp[];
  moznost: RegExp;
}

const FAKTA_L1: Fakt[] = [
  { pojem: "Knóssos na Krétě", otazka: [/ostrov/i, /knóss/i], moznost: /^kréta$/i },
  { pojem: "Lví brána", otazka: [/hlavní vstup/i], moznost: /^lví/i },
  { pojem: "Mínós", otazka: [/labyrint/i, /vládl/i], moznost: /^mínós$/i },
  { pojem: "Homér", otazka: [/básník/i, /složil/i], moznost: /^homér$/i },
  { pojem: "Peloponés", otazka: [/poloostrov/i], moznost: /pelopon/i },
  { pojem: "poloha Tróje", otazka: [/^kde ležela/i], moznost: /malé asii/i },
  { pojem: "Schliemann", otazka: [/vykopal/i], moznost: /schliemann/i },
  { pojem: "Odysseova lest", otazka: [/lest/i], moznost: /^odysseus$/i },
  { pojem: "Odysseia", otazka: [/cestě/i, /domů/i], moznost: /^odysseia$/i },
  { pojem: "lineární A", otazka: [/nerozluštil/i], moznost: /písmo a$/i },
  { pojem: "Agamemnón", otazka: [/vedl řecké vojsko/i], moznost: /^agamemnón$/i },
  { pojem: "Helena", otazka: [/čí únos/i], moznost: /^heleny$/i },
  { pojem: "Paris", otazka: [/trojský princ/i], moznost: /^paris$/i },
  { pojem: "Mínotaurus", otazka: [/obluda/i], moznost: /^mínotaurus$/i },
  { pojem: "Ventris", otazka: [/^kdo ve 20\. století rozluštil/i], moznost: /ventris/i },
];

// ── L2 ─────────────────────────────────────────────────────────────────────
type Stitek = "KRETA" | "MYKENY" | "TROJA";
/** Stopy v popisu (normalizovaný text bez diakritiky). */
const STOPY: Record<Stitek, RegExp> = {
  KRETA: /delfin|byk|bludist|nerozlust|chobotnic|ostrov/,
  MYKENY: /balvan|rana rectina|zlata pohrebni maska|kanci|opevnen/,
  TROJA: /desaty rok|paty|drevena socha|slepy pevec/,
};
/** Jména a pojmy v možnostech (normalizovaný text). */
const JMENA: Record<Stitek, RegExp> = {
  KRETA: /kret|minoj|knoss|minos|minotaur|labyrint/,
  MYKENY: /myken|agamemnon|peloponnes/,
  TROJA: /troj|homer|ilias|achill|odyss|hektor|priam/,
};
const MISTA = /kret|knoss|myken|troj|pelopon|mala asie|minoj/;

const stitky = (text: string, slovnik: Record<Stitek, RegExp>): Stitek[] =>
  (Object.keys(slovnik) as Stitek[]).filter((s) => slovnik[s].test(norm(text)));

// ── L3 ─────────────────────────────────────────────────────────────────────
const FAKTA_L3: Fakt[] = [
  { pojem: "paláce bez hradeb", otazka: [/neměly mohutné hradby/i], moznost: /moře a silné loďstvo/i },
  { pojem: "zlatá maska", otazka: [/zlatou masku/i], moznost: /bohatí a mocní/i },
  { pojem: "požár v Tróji", otazka: [/stopami požáru/i], moznost: /mohlo být dobyto/i },
  { pojem: "kořen báje o Mínotaurovi", otazka: [/mínotaur/i, /proč/i], moznost: /malby ukazují býky/i },
  { pojem: "lineární B v Knóssu", otazka: [/v paláci v knóssu/i], moznost: /ovládli mykéňané/i },
  { pojem: "datace paláců a války", otazka: [/rozkvět/i], moznost: /dřív než trojská/i },
  { pojem: "Homér po staletích", otazka: [/homér podle tradice/i], moznost: /nezažil/i },
  { pojem: "Lví brána jako pramen", otazka: [/dva lvi/i], moznost: /ukázat svou sílu/i },
  { pojem: "vrstvy Tróje", otazka: [/několik měst na sobě/i], moznost: /která vrstva/i },
  { pojem: "tabulky B jako pramen", otazka: [/seznamy obilí/i], moznost: /evidoval zásoby/i },
  { pojem: "Mínós z pověsti", otazka: [/mínós je znám/i], moznost: /mínós doložen není/i },
  { pojem: "zbraně z Tróje", otazka: [/hroty šípů/i], moznost: /^ne, zbraně dokládají/i },
  { pojem: "výjevy boje", otazka: [/dýkách/i], moznost: /^mykénské umění víc oslavovalo/i },
  { pojem: "Schliemann a přesnost Iliady", otazka: [/opravdu našel/i], moznost: /děj tím doložen není/i },
  { pojem: "bohové v Iliadě", otazka: [/bohové zasahovali/i], moznost: /umělecké dílo/i },
];

/** Tvrzení, které podává pověst jako doložený fakt (chyba 2). */
const MYTUS = /opravdu|skutečně|je jisté|doložen,|přímým důkazem|očitý svědek|kostru|kyklop|dřevěného koně|sepsal homér|vyhráli trojskou válku|pod vládu tróje/i;

function vyresFaktem(t: PracticeTask, fakta: Fakt[]): { fakt: Fakt; klic: string } {
  const hity = fakta.filter((f) => f.otazka.every((r) => r.test(t.question)));
  expect(hity.map((f) => f.pojem), `solver: nejednoznačný/žádný fakt pro: ${t.question}`).toHaveLength(1);
  const pripustne = t.options!.filter((o) => hity[0].moznost.test(o));
  expect(pripustne, `solver (${hity[0].pojem}): nepřipouští právě 1 možnost v: ${t.question}`).toHaveLength(1);
  return { fakt: hity[0], klic: pripustne[0] };
}

function vyresKlasifikatorem(t: PracticeTask): string {
  const s = stitky(t.question, STOPY);
  expect(s, `L2 otázka nemá právě 1 štítek: ${t.question}`).toHaveLength(1);
  const sedi = t.options!.filter((o) => stitky(o, JMENA).includes(s[0]));
  expect(sedi, `L2: štítek ${s[0]} nesdílí právě 1 možnost: ${t.question}`).toHaveLength(1);
  return sedi[0];
}

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);

describe("Kréta, Mykény a Trója — metadata", () => {
  it("dějepis g6, select_one, factual, RVP uzel, přesný zápis", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Antika - Řecko");
    expect(topic.studentTitle).toBe("Kréta, Mykény a Trója");
    expect(topic.briefDescription).toBe("Rozlišíš Krétu a Mykény a oddělíš báji o Tróji od nálezů.");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
    expect(topic.rvpNodeId).toBe("g6-dejepis-starovek-antika-recko-kretska-a-mykenska-civilizace-trojska-valka");
  });
});

describe.each(LEVELS)("Kréta, Mykény a Trója — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("≥12 unikátních úloh, deterministicky", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    const znovu = topic.generator(level).map((t) => t.question).sort();
    expect(znovu).toEqual(tasks.map((t) => t.question).sort());
  });

  it("4 unikátní možnosti, feedback pro každý distraktor, dvě nápovědy", () => {
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

  it("nezávislý solver dojde ke stejnému klíči", () => {
    for (const t of tasks) {
      const klic =
        level === 1 ? vyresFaktem(t, FAKTA_L1).klic : level === 2 ? vyresKlasifikatorem(t) : vyresFaktem(t, FAKTA_L3).klic;
      expect(t.correctAnswer, t.question).toBe(klic);
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

  it("klíč nevyčnívá počátečním slovem (check:options)", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (new Set(jine).size === 1) {
        expect(prvni(t.correctAnswer), `klíč vyčnívá začátkem: ${t.question}`).toBe(jine[0]);
      }
    }
  });
});

describe("Kréta, Mykény a Trója — napříč tématem", () => {
  it("L2: popis stopy neobsahuje jméno civilizace ani lokality", () => {
    for (const t of tasksBy[2]) expect(MISTA.test(norm(t.question)), `jméno v L2 otázce: ${t.question}`).toBe(false);
  });

  it("L3: claimKind — u nálezů klíč není mýtus a aspoň jeden distraktor mýtus je", () => {
    const nalezy = POOL_L3.filter((p) => p.nalez);
    expect(nalezy.length).toBeGreaterThanOrEqual(4);
    for (const p of POOL_L3) {
      expect(p.correctClaimKind, p.q).toBe("evidence");
      expect(MYTUS.test(p.correct), `klíč zní jako mýtus: ${p.q}`).toBe(false);
      for (const d of p.distractors) {
        expect(d.claimKind, `chybí claimKind: ${d.value}`).toBeDefined();
        // Nezávislý regex a štítek se musí shodnout: co regex pozná jako mýtus, je myth.
        if (MYTUS.test(d.value)) expect(d.claimKind, `regex=mýtus, štítek ne: ${d.value}`).toBe("myth");
      }
    }
    for (const p of nalezy) {
      const mytus = p.distractors.filter((d) => d.claimKind === "myth" && MYTUS.test(d.value));
      expect(mytus.length, `nález bez mýtického distraktoru: ${p.q}`).toBeGreaterThanOrEqual(1);
      // Úloha z generátoru má ten mýtický distraktor opravdu v nabídce.
      const t = tasksBy[3].find((x) => x.question === p.q)!;
      expect(t.options).toContain(mytus[0].value);
    }
  });

  it("klíč není systematicky nejdelší (check:length)", () => {
    let nejdelsi = 0;
    let vyrazne = 0;
    for (const t of all) {
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0] === t.correctAnswer && s[0].length > s[1].length) nejdelsi++;
      if (s[0] === t.correctAnswer && s[0].length >= s[1].length * 1.25) vyrazne++;
      const d = s[0];
      if (d !== t.correctAnswer && t.correctAnswer.length >= 20) {
        expect(d.length, `distraktor výrazně delší než klíč: „${d}“`).toBeLessThan(t.correctAnswer.length * 1.35 + 4);
      }
    }
    expect(nejdelsi / all.length, `klíč nejdelší v ${nejdelsi}/${all.length}`).toBeLessThanOrEqual(0.4);
    expect(nejdelsi / all.length, `klíč nejdelší jen v ${nejdelsi}/${all.length}`).toBeGreaterThanOrEqual(0.12);
    expect(vyrazne / all.length, `klíč výrazně nejdelší v ${vyrazne}/${all.length}`).toBeLessThanOrEqual(0.1);
    for (const l of LEVELS) {
      const n = tasksBy[l].filter((t) => {
        const s = [...t.options!].sort((a, b) => b.length - a.length);
        return s[0] === t.correctAnswer && s[0].length > s[1].length;
      }).length;
      expect(n / tasksBy[l].length, `L${l}: klíč nejdelší v ${n}/${tasksBy[l].length}`).toBeLessThanOrEqual(0.4);
    }
  });

  it("L1 ∩ L3 = ∅; L3 je úsudek, L1 ne; L3 bez otázek Jak se jmenuje/Kdo", () => {
    const q1 = new Set(tasksBy[1].map((t) => t.question));
    const q3 = tasksBy[3].map((t) => t.question);
    expect(q3.filter((q) => q1.has(q))).toHaveLength(0);
    const USUDEK = /(^|\s)proč(\s|$)|vyplývá|plyne|usuzuj|dokazuj|znamená/i;
    for (const q of q3) {
      expect(USUDEK.test(q), `L3 bez úsudku: ${q}`).toBe(true);
      expect(/^(jak se jmenuj|kdo\s)/i.test(q), `L3 jako otázka na pojem: ${q}`).toBe(false);
    }
    for (const q of q1) expect(USUDEK.test(q), `L1 s úsudkovou formulací: ${q}`).toBe(false);
  });

  it("nápovědy jsou unikátní napříč úlohami", () => {
    expect(new Set(all.map((t) => t.hints![0])).size).toBe(all.length);
    expect(new Set(all.map((t) => t.hints![1])).size).toBe(all.length);
  });

  it("datace př. n. l. jen s asi/kolem; žádné lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...(t.options ?? []), ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) {
        if (/\d{3,4}\s*př\. n\. l\./.test(s)) expect(/\b(asi|kolem)\b/.test(s), `datace bez asi/kolem: ${s}`).toBe(true);
        expect(/\b\p{L}+\/\p{L}+\b/u.test(s), `lomítkový tvar: ${s}`).toBe(false);
      }
    }
  });
});
