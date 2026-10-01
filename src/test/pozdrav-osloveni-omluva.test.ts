/**
 * Nezávislý řešič tématu „Pozdrav, oslovení, omluva, prosba, vzkaz" (2. r.).
 *
 * Generátor má kontrolu uvnitř sebe (`zkontroluj`), ale ta se dívá jen na tvar
 * úlohy — kolik je možností, jestli klíč nevyčnívá délkou. **Jestli je klíč
 * správně, neví.** To je přesně ta past z `CONTENT_AUTHORING.md` §1.1: klíč
 * odvozený z téže logiky, která úlohu složila, nic nedokazuje.
 *
 * Tenhle soubor proto úlohy řeší **vlastními pravidly**, napsanými z obsahu
 * zadání, ne z datových polí generátoru:
 *
 * - **vykání** — komu se ve větě mluví, se pozná z oslovení v zadání; podle
 *   toho smí, nebo nesmí klíč nést tykací tvary;
 * - **denní doba** — ranní pozdrav nesmí být klíčem k večerní situaci;
 * - **prosba × rozkaz** — prosba nechává volbu, takže klíč stojí v podmiňovacím
 *   způsobu („půjčil bys"); rozkaz s přilepeným „prosím" prosbou není;
 * - **omluva** — kdo vinu přijímá, mluví o sobě v minulém čase („rozbil jsem");
 *   kdo ji svádí na druhého, o sobě takhle nemluví;
 * - **vzkaz** — vlastní tabulka údajů, které musí vzkaz nést; vyčtená ze
 *   zadání, ne z polí generátoru.
 *
 * Ověřeno obráceně 2026-10-01: po dočasné záměně klíče za distraktor u každého
 * z pěti měřítek spadlo to a jen to, které tu vadu měří.
 */
import { describe, it, expect } from "vitest";
import { POZDRAV_OSLOVENI_OMLUVA } from "@/content/grade-2/cjl/pozdravOsloveniOmluva";
import type { PracticeTask } from "@/lib/types";

const TEMA = POZDRAV_OSLOVENI_OMLUVA[0];
const gen = (level: number) => TEMA.generator!(level) as PracticeTask[];

const L1 = gen(1), L2 = gen(2), L3 = gen(3);
const distraktory = (t: PracticeTask) => (t.options ?? []).filter((o) => o !== t.correctAnswer);

describe("tvar a pokryti", () => {
  it("kazda uroven nabidne aspon 12 unikatnich uloh", () => {
    for (const [lvl, t] of [[1, L1], [2, L2], [3, L3]] as const) {
      const klice = new Set(t.map((x) => `${x.question}|${(x.options ?? []).join("/")}`));
      expect(klice.size, `L${lvl} má jen ${klice.size} unikátních úloh`).toBeGreaterThanOrEqual(12);
    }
  });

  it("vsechny ulohy nesou kompletni dokumentaci", () => {
    for (const t of [...L1, ...L2, ...L3]) {
      expect(t.options, t.question).toHaveLength(4);
      expect(t.options, t.question).toContain(t.correctAnswer);
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints![0], t.question).not.toBe(t.hints![1]);
      expect(t.explanation, t.question).toBeTruthy();
      for (const d of distraktory(t)) {
        expect(t.optionFeedback?.[d], `${t.question} → „${d}" bez zpětné vazby`).toBeTruthy();
      }
    }
  });

  it("zadna napoveda neprozradi klic", () => {
    // Porovnává se až po normalizaci. Doslovná shoda nestačí: nápověda nesla
    // „Dobrou noc“ a klíč byl „Dobrou noc.“, lišily se tečkou — a pět takových
    // úniků prošlo, dokud je nenašel `audit:content`.
    const norm = (s: string) =>
      s.toLowerCase().replace(/[.,!?;:…„“"'’\-–—()]/g, " ").replace(/\s+/g, " ").trim();
    for (const t of [...L1, ...L2, ...L3]) {
      for (const h of t.hints ?? []) {
        expect(
          norm(h).includes(norm(t.correctAnswer)),
          `${t.question} — nápověda prozrazuje klíč „${t.correctAnswer}"`,
        ).toBe(false);
      }
    }
  });

  it("klic neni nejdelsi moznost casteji, nez by vysla nahoda", () => {
    const vsechny = [...L1, ...L2, ...L3];
    let nejdelsi = 0;
    for (const t of vsechny) {
      const max = Math.max(...(t.options ?? []).map((o) => o.length));
      if (t.correctAnswer.length === max) nejdelsi++;
    }
    // Při čtyřech možnostech by náhoda dala čtvrtinu. Práh je volný, ale
    // zachytí stav, kdy se dá hádat podle délky.
    expect(nejdelsi / vsechny.length).toBeLessThan(0.5);
  });
});

describe("L2 — vlastni reseni situace", () => {
  /** Oslovení dospělého, kterému se vyká. Vyčteno ze zadání, ne z dat. */
  const VYKA_SE = /paní (učitelk|kuchařk|knihovnic|prodavačk)|pan[ůa]?[^a-z]|sousedovi|trenérovi|pánovi|řidiči/i;
  /** Oslovení člověka, kterému se tyká. */
  const TYKA_SE = /kamarád|sestr|babičk|spolužačk|Terezce|bráchovi|taťkovi|Terezk/i;

  // ⚠️ `\b` v JavaScriptu je ASCII: `\w` je jen [A-Za-z0-9_], takže mezi „ň"
  // a „t" vzniká hranice slova a `/\bpromiň\b/` se chytí i uvnitř „Promiňte".
  // Na tomhle test nejdřív spadl a hlásil vadu v obsahu, který byl v pořádku.
  // Diakritická slova se proto ohraničují výslovně mezerou nebo interpunkcí.
  const H = String.raw`(^|[\s„(])`;
  const K = String.raw`([\s.,?!"“)]|$)`;
  const TYKACI_TVAR = new RegExp(
    `${H}(ti|tebe|tebou|tvém|tvoje|Ahoj|promiň(?!te)|zopakuješ|podrž)${K}`,
    "i",
  );
  const VYKACI_TVAR = new RegExp(`${H}(vám|vás|vámi|promiňte|zopakujete)${K}`, "i");

  it("klic respektuje vykani u dospelych a tykani u blizkych", () => {
    const chyby: string[] = [];
    for (const t of L2) {
      const q = t.question;
      const vyka = VYKA_SE.test(q), tyka = TYKA_SE.test(q);
      if (vyka === tyka) continue; // zadání neurčuje jednoznačně — neposuzuj
      if (vyka && TYKACI_TVAR.test(t.correctAnswer)) {
        chyby.push(`„${q}" oslovuje dospělého, klíč ale tyká: „${t.correctAnswer}"`);
      }
      if (tyka && VYKACI_TVAR.test(t.correctAnswer)) {
        chyby.push(`„${q}" oslovuje blízkého, klíč ale vyká: „${t.correctAnswer}"`);
      }
    }
    expect(chyby, chyby.join("\n")).toEqual([]);
  });

  it("klic respektuje denni dobu", () => {
    const chyby: string[] = [];
    for (const t of L2) {
      const q = t.question.toLowerCase(), a = t.correctAnswer.toLowerCase();
      const rano = /\brán[oa]\b|dopoledne/.test(q);
      const vecer = /\bvečer\b/.test(q);
      if (rano && /dobrou noc/.test(a)) chyby.push(`ranní situace, klíč „${t.correctAnswer}"`);
      if (vecer && /dobré ráno/.test(a)) chyby.push(`večerní situace, klíč „${t.correctAnswer}"`);
    }
    expect(chyby, chyby.join("\n")).toEqual([]);
  });

  /**
   * Vlastní klasifikace podle toho, čím věta začíná — pozdrav, omluva,
   * poděkování nebo žádost. První verze testu místo toho vyřazovala každý
   * distraktor se zájmenem, a tím si zahodila i ty, které chybu ve funkci
   * měly („Děkuji vám, zapomněl jsem ji." je chyba ve funkci, ne v oslovování).
   */
  function funkceVety(s: string): string {
    // Pozdrav se dělí dál: u pozdravné situace je smysluplný kontrast právě
    // uvnitř pozdravů (přicházím × odcházím), ne mimo ně. Bez tohohle dělení
    // test žádal u „Dobrý den, pane Novák." distraktor, který není pozdrav —
    // a tím by úlohu pokazil, ne zlepšil.
    if (/^(Dobré ráno|Dobrý den|Vítej)/.test(s)) return "přivítání";
    if (/^(Dobrou noc|Na shledanou)/.test(s)) return "rozloučení";
    if (/^Ahoj/.test(s)) return "pozdrav";
    if (/^(Promiň|Omlouvám|Odpusť|Je mi to líto)/.test(s)) return "omluva";
    if (/^(Děku|Díky|Mockrát|Moc (ti|vám) děku)/.test(s)) return "poděkování";
    if (/^(Prosím|Můžu|Mohl|Půjč|Podáš|Podrž|Zopakuj|Pust|Běžte|Dej|Potřebuju|Sednu|Přeč|Pomo|Uhni|Musíš|Moc (tě|vás) pros)/.test(s)) {
      return "žádost";
    }
    return "jiné";
  }

  it("kazda situace nabizi i chybu ve funkci, ne jen v oslovovani", () => {
    // Bez toho by stačilo hádat podle tykání a téma by neučilo, co kdy říct.
    for (const t of L2) {
      const klicova = funkceVety(t.correctAnswer);
      expect(klicova, `klíč „${t.correctAnswer}" se nedá zařadit`).not.toBe("jiné");
      const jine = distraktory(t).filter((d) => funkceVety(d) !== klicova);
      expect(jine.length, `„${t.question}" nemá distraktor s jinou funkcí`).toBeGreaterThan(0);
    }
  });
});

describe("L3 — vlastni reseni prenosu", () => {
  const prosby = L3.filter((t) => /Která věta je prosba/.test(t.question));
  const omluvy = L3.filter((t) => /opravdová omluva/.test(t.question));
  const vzkazy = L3.filter((t) => /Který vzkaz je úplný/.test(t.question));

  it("vsechny tri tvary L3 jsou zastoupene", () => {
    expect(prosby.length, "chybí úlohy prosba × rozkaz").toBeGreaterThanOrEqual(4);
    expect(omluvy.length, "chybí úlohy na omluvu").toBeGreaterThanOrEqual(4);
    expect(vzkazy.length, "chybí úlohy na vzkaz").toBeGreaterThanOrEqual(4);
  });

  it("prosba stoji v podminovacim zpusobu, rozkaz ne", () => {
    // Vlastní pravidlo: prosba nechává druhému volbu, a česky to dělá
    // podmiňovací způsob („půjčil bys"). Rozkaz s „prosím" prosbou není.
    for (const t of prosby) {
      expect(
        /\bby(s|ste)\b/.test(t.correctAnswer),
        `klíč „${t.correctAnswer}" není v podmiňovacím způsobu, takže to není prosba`,
      ).toBe(true);
      expect(t.correctAnswer.endsWith("?"), `prosba „${t.correctAnswer}" se neptá`).toBe(true);
      for (const d of distraktory(t)) {
        expect(
          /\bby(s|ste)\b/.test(d),
          `distraktor „${d}" je taky prosba — dvě možnosti by byly správné`,
        ).toBe(false);
      }
    }
  });

  it("omluva mluvi o sobe v minulem case, vyhybka ne", () => {
    // Vlastní pravidlo: kdo vinu přijímá, řekne, co udělal ON („rozbil jsem").
    // Kdo ji svádí na druhého nebo na náhodu, o sobě takhle nemluví.
    for (const t of omluvy) {
      expect(
        /\bjsem\b/.test(t.correctAnswer),
        `klíč „${t.correctAnswer}" nepřiznává vlastní čin`,
      ).toBe(true);
      for (const d of distraktory(t)) {
        expect(/\bjsem\b/.test(d), `distraktor „${d}" taky přiznává čin — byl by správně`).toBe(false);
      }
    }
  });

  /**
   * Co musí vzkaz nést. Vyčteno ze zadání úlohy ručně, ne z polí generátoru —
   * tohle je ten nezávislý řešič. Klíč musí nést všechno, každý distraktor
   * aspoň jeden údaj postrádat.
   */
  const POTREBA: [RegExp, string[]][] = [
    [/pan Novák/, ["Novák", "čtvrtek", "pět"]],
    [/teta Jana/, ["Jana", "Přijede", "sobotu"]],
    [/paní učitelka/, ["učitelka", "posouvá", "pátek"]],
    [/trenér/, ["trenér", "devět", "školy"]],
    // „ýsledk“ bez prvního písmena, aby se shoda netrefila jen na velké Á/á.
    [/doktor/, ["doktor", "ýsledk", "středu"]],
  ];

  it("uplny vzkaz nese vsechny udaje, ostatni jeden postradaji", () => {
    expect(vzkazy.length).toBe(POTREBA.length);
    for (const t of vzkazy) {
      const pravidlo = POTREBA.find(([kde]) => kde.test(t.question));
      expect(pravidlo, `pro „${t.question}" nemám vlastní pravidlo`).toBeDefined();
      const [, udaje] = pravidlo!;

      const chybiVKlici = udaje.filter((u) => !t.correctAnswer.includes(u));
      expect(chybiVKlici, `klíč „${t.correctAnswer}" postrádá ${chybiVKlici.join(", ")}`).toEqual([]);

      for (const d of distraktory(t)) {
        const chybi = udaje.filter((u) => !d.includes(u));
        expect(
          chybi.length,
          `distraktor „${d}" nese všechny údaje — byl by taky správně`,
        ).toBeGreaterThan(0);
      }
    }
  });
});

describe("zarazeni tematu", () => {
  it("odkazuje na skutecny uzel RVP a je v navigaci 2. rocniku", async () => {
    const { GRADE2_NAVIGATION } = await import("@/content/grade-2/navigation");
    const vsechnyId = GRADE2_NAVIGATION.flatMap((s) => s.okruhy.flatMap((o) => o.topicIds));
    expect(vsechnyId).toContain(TEMA.id);
    expect(TEMA.rvpNodeId).toBe(
      "g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-pozdrav-osloveni-omluva-prosba-vzkaz",
    );
  });
});
