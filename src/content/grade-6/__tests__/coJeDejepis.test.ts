import { describe, it, expect } from "vitest";
import { CO_JE_DEJEPIS } from "../dejepis/coJeDejepis";
import type { PracticeTask } from "@/lib/types";

/**
 * Co je dějepis — FAKTICKÝ vzor typu select_one (rozlišení pojmů dějiny × dějepis).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta) = klasifikátor klíčových slov dle spec.solverCheck.
 * Pro KAŽDOU úlohu nezávisle přepočítá očekávaný klíč z textu otázky (NEPOUŽÍVÁ
 * correctAnswer z úlohy jako vstup) a porovná ho s deklarovaným correctAnswer:
 *  (1) struktura: options + neprázdné optionFeedback pro KAŽDÝ distraktor, NIKDY
 *      pro správnou odpověď;
 *  (2) pojmová otázka: „věda / zkoumá / obor" → klíč musí být DĚJEPIS;
 *      „co se stalo / událost / proběhlo" → klíč musí být DĚJINY;
 *  (3) který čas dějepis zkoumá: klíč je ta jediná možnost popisující MINULOST
 *      („to, co už proběhlo") — odvozeno ze sémantiky možností, ne z klíče;
 *  (4) činnost historika: klíč spadá do whitelistu (minulost lidí / prameny /
 *      příčiny / každodenní život) a ŽÁDNÝ distraktor do whitelistu zároveň
 *      nepatří (budoucnost / předpověď / příroda bez lidí / výmysl = vždy NE).
 * Audit zároveň hlídá disjunktnost znění L1 vs L3 (žádná recyklace).
 */
const topic = CO_JE_DEJEPIS[0];

const DEJINY = "Dějiny";
const DEJEPIS = "Dějepis";

// ── Klasifikátory klíčových slov (druhá, nezávislá cesta) ────────────────────

/** Otázka se ptá na VĚDU / obor (klíč = dějepis)? */
const ASKS_SCIENCE = /\bvěda\b|\bobor\b|která zkoumá|kdo zkoumá/i;
/** Otázka se ptá na to, co se STALO / na událost (klíč = dějiny)? */
const ASKS_EVENT = /skutečně stalo|samotné události|co se stalo|proběhl/i;

/** WHITELIST náplně práce historika — co do dějepisu PATŘÍ. */
const HISTORIAN_OK = /minulost|žili|dřív|prameny?|listin|kronik|příčin|války|říše|obchodoval|nástroje|rytíř/i;
/** Co do dějepisu NIKDY nepatří (budoucnost, předpověď, příroda bez lidí, výmysl). */
const HISTORIAN_NO = /příští rok|předpověd|počasí|loteri|budoucn|rostlin|sopečn|planet[ěe] bez lidí|drak|vymyšlen|filmu|pověst/i;

/** Z textu otázky (a u řazení z options) nezávisle odvodí očekávaný klíč. */
function solveExpected(q: PracticeTask): { kind: string; expected: string } | null {
  const text = q.question;

  // (3) který ČAS dějepis zkoumá — klíč odvodíme nezávisle ze sémantiky možností:
  //     dějepis zkoumá MINULOST, takže klíčem je ta jediná možnost, která popisuje
  //     „to, co už proběhlo" (ne teď, ne budoucnost). correctAnswer se nepoužívá.
  if (/Kterou dobu.*zkoumá dějepis/i.test(text)) {
    const past = q.options!.filter((o) => /už byl|stalo se|už proběhl|proběhl|minul/i.test(o));
    if (past.length === 1) return { kind: "cas", expected: past[0] };
    return null;
  }

  // (2b) DVOJICE „X je věda, která zkoumá Y" — role rozhodují nezávisle:
  //      na 1. místo patří VĚDA (dějepis), na 2. to, co zkoumá = události (dějiny).
  //      Solver sestaví dvojici z rolí, ne z klíče: věda → dějepis, předmět → dějiny.
  if (/Doplň dvojici/i.test(text) && /je věda, která zkoumá/i.test(text)) {
    return { kind: "dvojice-def", expected: `${DEJEPIS} — dějiny` };
  }

  // (2c) DVOJICE „stavba = ?, zkoumání = ?" — stavba/postavení je UDÁLOST (dějiny),
  //      dnešní zkoumání je práce vědy (dějepis). Solver to odvodí z rolí slotů.
  if (/Co je co\?/i.test(text) && /postaven|stavb/i.test(text) && /zkoumá|zkoumání/i.test(text)) {
    return { kind: "dvojice-event", expected: "Stavba hradu = dějiny, zkoumání = dějepis" };
  }

  // (2) čistě pojmová otázka — věda vs. událost (jednoslovný klíč Dějepis/Dějiny)
  if (ASKS_SCIENCE.test(text) && !ASKS_EVENT.test(text)) {
    return { kind: "pojem-veda", expected: DEJEPIS };
  }
  if (ASKS_EVENT.test(text) && !ASKS_SCIENCE.test(text)) {
    return { kind: "pojem-udalost", expected: DEJINY };
  }

  // (2d) APLIKACE pojmu na popsanou SITUACI — možnosti nesou tag (dějiny)/(dějepis).
  //      Solver rozhodne nezávisle ze SCÉNÁŘE v zadání, kterou tagovanou možnost čekat:
  //        • scénář popisuje UDÁLOST, která se stala/vznikla a ptá se „Čím je / Co to je"
  //          → klíč je možnost označená (dějiny);
  //        • scénář popisuje ZKOUMÁNÍ pramenů (listiny/zbytky) a ptá se „Co dělá"
  //          → klíč je možnost označená (dějepis).
  //      Tag v možnosti je nezávislý zdroj — correctAnswer se nepoužívá.
  const tagDejiny = q.options!.find((o) => /\(dějiny\)/i.test(o));
  const tagDejepis = q.options!.find((o) => /\(dějepis\)/i.test(o));
  if (tagDejiny && tagDejepis) {
    const scenarEvent = /se odehrála|byl[ao]? postaven|vznikl|stala se|proběhl/i.test(text) && /Čím je|Co to je/i.test(text);
    const scenarResearch = /zkoumá|zkoumání|staré listiny|zbytky|prameny?/i.test(text) && /Co dělá/i.test(text);
    if (scenarEvent && !scenarResearch) return { kind: "aplikace-udalost", expected: tagDejiny };
    if (scenarResearch && !scenarEvent) return { kind: "aplikace-veda", expected: tagDejepis };
    return null;
  }

  // (4) činnost / hraniční případy — klíč najdeme jako jedinou možnost,
  //     která padne do whitelistu historika a NEpadne do zakázané množiny.
  //     (nezávisle na correctAnswer — jen z textu možností)
  const ok = q.options!.filter((o) => HISTORIAN_OK.test(o) && !HISTORIAN_NO.test(o));
  const no = q.options!.filter((o) => HISTORIAN_NO.test(o));
  // „NEPATŘÍ / NEzabývá" → hledáme tu jedinou možnost ze zakázané množiny
  if (/NEPATŘÍ|NEzabývá|NEzkoumá/i.test(text)) {
    if (no.length === 1) return { kind: "hranice-ne", expected: no[0] };
    return null;
  }
  // „PROČ studovat minulost" — platný důvod = poučení / pochopení dneška
  if (/Proč.*studovat minulost|Proč má smysl studovat/i.test(text)) {
    const good = q.options!.filter((o) => /pouči|rozuměli|dnešk|kořen/i.test(o));
    if (good.length === 1) return { kind: "proc", expected: good[0] };
    return null;
  }
  // jinak: pozitivní volba činnosti historika (právě jedna možnost ve whitelistu)
  if (ok.length === 1) return { kind: "cinnost", expected: ok[0] };
  return null;
}

describe("Co je dějepis — metadata", () => {
  it("dějepis g6, select_one, Úvod do dějepisu / Historie a historické prameny", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.id).toBe("g6-dej-co-je-dejepis-6");
    expect(topic.category).toBe("Úvod do dějepisu");
    expect(topic.topic).toBe("Historie a historické prameny");
    expect(topic.rvpNodeId).toBe(
      "g6-dejepis-uvod-do-dejepisu-historie-a-historicke-prameny-co-je-dejepis-vyznam-studia-minulosti",
    );
    // briefDescription max 14 slov
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Co je dějepis — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("neprázdný pool", () => {
    expect(tasks.length).toBeGreaterThanOrEqual(4);
  });

  it("select_one struktura: ≥3 unikátní možnosti, klíč je mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(t.options!.length, t.question).toBeGreaterThanOrEqual(3);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(t.options!.length);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("SOLVER (1): každý distraktor má feedback, správná odpověď NIKDY", () => {
    for (const t of tasks) {
      // feedback klíče musí být v options a žádný nesmí být správná odpověď
      for (const key of Object.keys(t.optionFeedback ?? {})) {
        expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
        expect(key, `správná odpověď má feedback: ${t.question}`).not.toBe(t.correctAnswer);
      }
      // každý distraktor MUSÍ mít neprázdný feedback
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback distraktoru "${d}" v: ${t.question}`).toBeTruthy();
      }
    }
  });

  it("SOLVER (2-4): nezávisle odvozený klíč souhlasí s correctAnswer", () => {
    for (const t of tasks) {
      const s = solveExpected(t);
      expect(s, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
      expect(t.correctAnswer, `${s!.kind}: ${t.question}`).toBe(s!.expected);
    }
  });

  it("nápověda učí metodu, neprozrazuje klíč", () => {
    for (const t of tasks) {
      for (const h of t.hints ?? []) {
        expect(h, `hint leak (klíč ve znění): ${t.question}`).not.toContain(t.correctAnswer);
      }
    }
  });

  it("každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
    }
  });
});

describe("Co je dějepis — kontroly chybového modelu", () => {
  it("u činností historika je whitelist disjunktní se zakázanou množinou", () => {
    // U L2/L3 činnostních úloh: právě jedna možnost je „povolená" a žádný
    // distraktor zároveň nepadá do whitelistu (jinak by klíč nebyl jednoznačný).
    for (const level of [2, 3]) {
      for (const t of topic.generator(level)) {
        const s = solveExpected(t);
        if (!s || !/hranice-ne|cinnost|proc/.test(s.kind)) continue;
        const okOpts = t.options!.filter((o) => HISTORIAN_OK.test(o) && !HISTORIAN_NO.test(o));
        // u „cinnost" je whitelist přesně 1; u „hranice-ne" naopak zakázaná množina přesně 1
        if (s.kind === "cinnost") {
          expect(okOpts.length, `víc než 1 možnost ve whitelistu: ${t.question}`).toBe(1);
        }
        if (s.kind === "hranice-ne") {
          const noOpts = t.options!.filter((o) => HISTORIAN_NO.test(o));
          expect(noOpts.length, `víc než 1 zakázaná možnost: ${t.question}`).toBe(1);
        }
      }
    }
  });
});

describe("Co je dějepis — gradace L1 ≠ L3", () => {
  it("znění otázek L1 a L3 je disjunktní (žádná recyklace)", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const q3 = new Set(topic.generator(3).map((t) => t.question));
    const shared = [...q3].filter((q) => q1.has(q));
    expect(shared, `společné otázky L1∩L3: ${shared}`).toHaveLength(0);
  });

  it("L1 je čistá definice / který čas; L3 jsou hraniční případy + smysl studia", () => {
    const l1 = topic.generator(1).map((t) => t.question);
    const l3 = topic.generator(3).map((t) => t.question);
    // L1 obsahuje definiční otázku na vědu i na událost a otázku, který čas dějepis zkoumá
    expect(l1.some((q) => ASKS_SCIENCE.test(q))).toBe(true);
    expect(l1.some((q) => ASKS_EVENT.test(q))).toBe(true);
    expect(l1.some((q) => /Kterou dobu.*zkoumá dějepis/i.test(q))).toBe(true);
    // L1 NIKDY neřeší hraniční „NEPATŘÍ/NEzabývá" ani smysl studia
    expect(l1.some((q) => /NEPATŘÍ|NEzabývá|Proč.*studovat/i.test(q))).toBe(false);
    // L3 řeší hranici vědy (co NEpatří) i PROČ studovat minulost
    expect(l3.some((q) => /NEPATŘÍ|NEzabývá/i.test(q))).toBe(true);
    expect(l3.some((q) => /Proč.*studovat minulost|Proč má smysl studovat/i.test(q))).toBe(true);
    // L3 neřeší otázku „kterou dobu dějepis zkoumá" (ta patří jen do L1)
    expect(l3.some((q) => /Kterou dobu.*zkoumá dějepis/i.test(q))).toBe(false);
  });
});
