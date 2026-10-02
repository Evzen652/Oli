/**
 * Nezávislá kontrola tématu „Vyprávění podle obrázkové osnovy" (2. ročník).
 *
 * Princip Generator→Critic (`docs/CONTENT_AUTHORING.md`): tenhle soubor
 * **nezná** datové struktury z `vypraveniPodleOsnovy.ts`. Importuje jen hotové
 * úlohy a řeší je znovu, z vlastní tabulky a vlastních pravidel. Kde klíč
 * vyjde jinak, padá test — ne obsah.
 *
 * ⚠️ Tabulka `OSNOVY` níž je **druhé autorství**, ne odvození. Napsal jsem ji
 * z příběhů, ne zkopírováním z obsahu, takže záměna vět mezi obrázky se tu
 * projeví rozdílem. Že o klíči rozhoduje opravdu ona, a ne shoda náhodou,
 * dokazuje obrácený běh:
 *
 * ```bash
 * MUTACE=1 npx vitest run src/test/vypraveni-osnova.test.ts
 * ```
 *
 * `MUTACE=1` prohlásí za klíč distraktor. Všechna měřítka správnosti klíče
 * pak **musí** spadnout; co zůstane zelené, o správnosti klíče nic netvrdí a
 * patří mezi strukturní kontroly. Bez tohohle běhu je zelená sada jen
 * domněnka — v sousedním tématu `adresaBlahopraniPozdrav` se ukázalo, že
 * jedna skupina testů procházela nad **prázdnou** množinou úloh.
 *
 * U L3 (celé vyprávění) je kontrola skutečně nezávislá, ne tabulková: vlastní
 * řešitel hledá v každém vyprávění značky jednotlivých obrázků a požaduje, aby
 * tam byly **všechny** a ve **stoupajícím** pořadí. Projít smí právě jedna
 * možnost.
 */
import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { VYPRAVENI_PODLE_OSNOVY } from "@/content/grade-2/cjl/vypraveniPodleOsnovy";

// ─────────────────────────────────────────────────────────────────────────────
// Hranice slova v češtině
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ `\b` v JavaScriptu je ASCII: u „zalévala" nebo „uvízl" se chová jinak,
// než člověk čeká, a hledání značek by tichý nesmysl. Hranice proto píšu
// výčtem znaků, které kolem slova smí stát.

const H = String.raw`(^|[\s„(])`;
const K = String.raw`([\s.,?!"“)]|$)`;

/** Je `slovo` v textu jako samostatné slovo (ne jako část jiného)? */
function obsahujeSlovo(text: string, slovo: string): boolean {
  return new RegExp(`${H}${slovo}${K}`, "i").test(text);
}

/** Na které pozici v textu to slovo stojí? `-1`, když tam není. */
function poziceSlova(text: string, slovo: string): number {
  const m = new RegExp(`${H}${slovo}${K}`, "i").exec(text);
  return m ? m.index : -1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Vlastní tabulka osnov
// ─────────────────────────────────────────────────────────────────────────────

interface Osnova {
  /** Popisky pod obrázky, zleva doprava. Podle prvního se příběh pozná. */
  popisky: [string, string, string, string];
  /** Věta ke každému obrázku, ve stejném pořadí. */
  vety: [string, string, string, string];
  /** Věta, pro kterou v osnově obrázek není. */
  mimo: string;
  /** Jméno celé osnovy. */
  nazev: string;
  /**
   * Značka každého obrázku pro vlastního řešitele celých vyprávění —
   * slovo, které se ve vyprávění toho obrázku objeví a jinde ne.
   */
  znaky: [string, string, string, string];
}

const OSNOVY: Osnova[] = [
  {
    popisky: ["míč na hřišti", "míč v křoví", "pes ho vytáhl", "kluci hrají dál"],
    vety: [
      "Kluci si na hřišti hráli s míčem.",
      "Míč zapadl do hustého křoví.",
      "Pes Bobík vytáhl míč z křoví.",
      "Kluci Bobíkovi zatleskali a hráli dál.",
    ],
    mimo: "Kluci si pak koupili zmrzlinu.",
    nazev: "Jak pes zachránil míč",
    znaky: ["míčem", "zapadl", "vytáhl", "dál"],
  },
  {
    popisky: ["v noci napadl sníh", "velká koule", "mrkev na nos", "foto u sněhuláka"],
    vety: [
      "V noci napadl sníh na zahradu.",
      "Děti venku válely velkou kouli.",
      "Sněhulák dostal místo nosu mrkev.",
      "Maminka děti u sněhuláka vyfotila.",
    ],
    mimo: "Odpoledne si pustily pohádku.",
    nazev: "Stavba sněhuláka",
    znaky: ["napadl", "kouli", "mrkev", "vyfotila"],
  },
  {
    popisky: ["zaseté semínko", "zalévání vodou", "vysoká slunečnice", "cesta do školy"],
    vety: [
      "Anička zasela do květináče semínko.",
      "Každé ráno ho polila vodou.",
      "Z květináče vyrostla vysoká slunečnice.",
      "Anička slunečnici odnesla do školy.",
    ],
    mimo: "Ve škole byla hodina zpěvu.",
    nazev: "Jak vyrostla slunečnice",
    znaky: ["zasela", "zalévala", "vyrostla", "školy"],
  },
  {
    popisky: ["kočka na stromě", "bojí se slézt", "tatínek nese štafle", "kočka je doma"],
    vety: [
      "Kočka Mína vylezla na vysoký strom.",
      "Dolů se jí slézt nechtělo.",
      "Tatínek přinesl ze dvora štafle.",
      "Mína pak doma spala v křesle.",
    ],
    mimo: "Mína má nejradši konzervu.",
    nazev: "Jak Mína slezla ze stromu",
    znaky: ["vylezla", "bála", "štafle", "křesle"],
  },
  {
    popisky: ["Tomáš nese draka", "vítr draka zvedl", "drak uvízl ve větvích", "dědeček ho sundal"],
    vety: [
      "Tomáš nesl na kopec draka.",
      "Silný vítr draka zvedl nad stromy.",
      "Drak se zamotal do větví.",
      "Dědeček draka opatrně sundal dolů.",
    ],
    mimo: "Tomáš má doma druhého draka.",
    nazev: "Záchrana papírového draka",
    znaky: ["kopec", "zvedl", "uvízl", "sundal"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Obrácené ověření
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `MUTACE=1` → za klíč se vydává distraktor. Měřítka správnosti klíče tím
 * MUSÍ spadnout. Strukturní kontroly se `klic()` vědomě neptají a berou
 * `correctAnswer` přímo, protože o správnosti klíče nic netvrdí — po mutaci
 * tedy zelené zůstat mají.
 */
const MUTACE = process.env.MUTACE === "1";

/**
 * ⚠️ Mutovaný klíč se vybírá **abecedně**, ne jako „první možnost v poli".
 * Generátor možnosti míchá, takže varianta s indexem dávala pokaždé jiný
 * výsledek: jeden běh ohlásil 13 padlých testů, jiný 12. Číslo, které se mezi
 * běhy mění, se nedá použít jako důkaz o ničem. Takhle je mutace
 * reprodukovatelná a padá vždycky stejná třináctka.
 */
const klic = (t: PracticeTask): string => {
  if (!MUTACE) return t.correctAnswer;
  return [...(t.options ?? [])].filter((o) => o !== t.correctAnswer).sort()[0];
};

const distraktory = (t: PracticeTask) => (t.options ?? []).filter((o) => o !== klic(t));

// ─────────────────────────────────────────────────────────────────────────────
// Úlohy a skupiny
// ─────────────────────────────────────────────────────────────────────────────

const TEMA = VYPRAVENI_PODLE_OSNOVY[0];
const L1 = TEMA.generator!(1);
const L2 = TEMA.generator!(2);
const L3 = TEMA.generator!(3);
const VSE = [...L1, ...L2, ...L3];

/** Popisky z pásu osnovy u té úlohy. */
function pasPopisky(t: PracticeTask): string[] {
  if (!t.visual || t.visual.kind !== "story_strip") throw new Error(`Úloha „${t.question}“ nemá pás osnovy`);
  return t.visual.frames.map((f) => f.caption);
}

/** Podle prvního popisku najde příběh ve vlastní tabulce. */
function osnovaUlohy(t: PracticeTask): Osnova {
  const prvni = pasPopisky(t)[0];
  const o = OSNOVY.find((x) => x.popisky[0] === prvni);
  if (!o) throw new Error(`Pás začíná „${prvni}“, a to v mojí tabulce není`);
  return o;
}

const L1A = L1.filter((t) => /^Kam v osnově patří věta/.test(t.question));
const L1B_START = L1.filter((t) => /kterou větou začneš/.test(t.question));
const L1B_KONEC = L1.filter((t) => /kterou větou skončíš/.test(t.question));
const L2A = L2.filter((t) => /obrázek\. Co dál\?$/.test(t.question));
const L2B = L2.filter((t) => /^Která věta se do osnovy/.test(t.question));
const L3A = L3.filter((t) => /^Které vyprávění jde přesně podle osnovy/.test(t.question));
const L3B = L3.filter((t) => /^Jak osnova o .* skončí\?$/.test(t.question));
const L3C = L3.filter((t) => /^Jak se dá pojmenovat osnova/.test(t.question));

// ⚠️ Přesné počty tady nejsou ozdoba. V sousedním tématu měl jeden filtr
// špatnou kotvu, skupina matchovala **nula** úloh a oba její testy prošly nad
// prázdnou množinou. Odhalil to až tenhle počet.
describe("skupiny úloh mají čekaný počet (jinak by test měřil prázdno)", () => {
  it("počty podle návrhu tématu", () => {
    expect({
      L1A: L1A.length,
      L1B_START: L1B_START.length,
      L1B_KONEC: L1B_KONEC.length,
      L2A: L2A.length,
      L2B: L2B.length,
      L3A: L3A.length,
      L3B: L3B.length,
      L3C: L3C.length,
    }).toEqual({
      L1A: 20,
      L1B_START: 5,
      L1B_KONEC: 5,
      L2A: 15,
      L2B: 5,
      L3A: 5,
      L3B: 5,
      L3C: 5,
    });
  });

  it("součet skupin pokrývá všechny úlohy — žádná nezůstala bez kontroly", () => {
    const vSkupinach =
      L1A.length + L1B_START.length + L1B_KONEC.length + L2A.length + L2B.length + L3A.length + L3B.length + L3C.length;
    expect(vSkupinach).toBe(VSE.length);
  });

  it("každá úroveň má aspoň dvanáct unikátních úloh (CONTENT_AUTHORING)", () => {
    for (const [jmeno, u] of [["L1", L1], ["L2", L2], ["L3", L3]] as const) {
      const unikatni = new Set(u.map((t) => t.question));
      expect(unikatni.size, `${jmeno} má ${unikatni.size} unikátních zadání`).toBeGreaterThanOrEqual(12);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// L1 — přiřazení věty k obrázku a okraje vyprávění
// ─────────────────────────────────────────────────────────────────────────────

const KAM = ["k prvnímu obrázku", "k druhému obrázku", "k třetímu obrázku", "ke čtvrtému obrázku"];

describe("L1a — věta patří k tomu obrázku, u kterého ji mám v tabulce", () => {
  it("klíč je pořadí toho obrázku, ke kterému věta podle mojí tabulky patří", () => {
    for (const t of L1A) {
      const o = osnovaUlohy(t);
      const veta = /věta „(.+)“\?$/.exec(t.question)?.[1];
      expect(veta, `ze zadání „${t.question}“ nejde vyčíst věta`).toBeTruthy();
      const i = o.vety.indexOf(veta!);
      expect(i, `věta „${veta}“ v mojí tabulce pro „${o.nazev}“ není`).toBeGreaterThanOrEqual(0);
      expect(klic(t), `„${t.question}“`).toBe(KAM[i]);
    }
  });

  it("možnostmi jsou vždycky všechna čtyři pořadí, nikdy popisek z obrázku", () => {
    for (const t of L1A) {
      expect([...(t.options ?? [])].sort()).toEqual([...KAM].sort());
    }
  });

  it("každé pořadí je klíčem stejně často — nedá se hádat jedno a pořád", () => {
    const pocty = KAM.map((k) => L1A.filter((t) => t.correctAnswer === k).length);
    expect(pocty).toEqual([5, 5, 5, 5]);
  });

  /**
   * `audit:content` tady hlásí `hint_leak` nad slovem „obrázku" z klíče
   * („k druhému obrázku"). Je to planý poplach **jen proto**, že to slovo
   * nesou všechny čtyři možnosti, takže o žádné z nich nic neříká. Jakmile by
   * ho jedna možnost neměla, planý poplach by se stal skutečným únikem — a
   * tenhle test je ta hranice, ne moje tvrzení v zápisu.
   */
  it("slovo „obrázku“ mají všechny čtyři možnosti, takže samo nerozlišuje nic", () => {
    for (const t of L1A) {
      for (const m of t.options ?? []) {
        expect(obsahujeSlovo(m, "obrázku"), `možnost „${m}“ to slovo nemá`).toBe(true);
      }
    }
  });

  it("nápověda nezmiňuje ani slovo „obrázek“, ani pořadovou číslovku z klíče", () => {
    const CISLOVKY = ["prvnímu", "druhému", "třetímu", "čtvrtému", "první", "druhý", "třetí", "čtvrtý"];
    for (const t of L1A) {
      for (const h of t.hints ?? []) {
        expect(/obrázk/i.test(h), `nápověda „${h}“ nese slovo z klíče`).toBe(false);
        for (const c of CISLOVKY) {
          expect(obsahujeSlovo(h, c), `nápověda „${h}“ nese číslovku „${c}“`).toBe(false);
        }
      }
    }
  });
});

describe("L1b — vyprávění začíná vlevo a končí vpravo", () => {
  it("klíčem úlohy „začneš“ je věta k prvnímu obrázku", () => {
    for (const t of L1B_START) {
      expect(klic(t), `„${t.question}“`).toBe(osnovaUlohy(t).vety[0]);
    }
  });

  it("klíčem úlohy „skončíš“ je věta ke čtvrtému obrázku", () => {
    for (const t of L1B_KONEC) {
      expect(klic(t), `„${t.question}“`).toBe(osnovaUlohy(t).vety[3]);
    }
  });

  it("možnostmi jsou právě čtyři věty té osnovy, nic přidaného", () => {
    for (const t of [...L1B_START, ...L1B_KONEC]) {
      const o = osnovaUlohy(t);
      expect([...(t.options ?? [])].sort()).toEqual([...o.vety].sort());
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// L2 — posun o jeden obrázek a věta mimo osnovu
// ─────────────────────────────────────────────────────────────────────────────

const PORADI = ["první", "druhý", "třetí"];

describe("L2a — po obrázku přijde ten hned vpravo", () => {
  it("klíčem je věta k obrázku o jedno dál, než říká zadání", () => {
    for (const t of L2A) {
      const o = osnovaUlohy(t);
      const slovo = PORADI.find((p) => obsahujeSlovo(t.question, p));
      expect(slovo, `ze zadání „${t.question}“ nejde vyčíst pořadí`).toBeTruthy();
      const pos = PORADI.indexOf(slovo!);
      expect(klic(t), `„${t.question}“`).toBe(o.vety[pos + 1]);
    }
  });

  it("mezi distraktory je vždycky věta, pro kterou v osnově obrázek není", () => {
    for (const t of L2A) {
      expect(distraktory(t), `„${t.question}“`).toContain(osnovaUlohy(t).mimo);
    }
  });

  it("klíč nikdy není věta, která v zadání už byla vyprávěná", () => {
    for (const t of L2A) {
      const o = osnovaUlohy(t);
      const pos = PORADI.indexOf(PORADI.find((p) => obsahujeSlovo(t.question, p))!);
      for (let j = 0; j <= pos; j++) {
        expect(klic(t), `„${t.question}“ vrací zpátky na ${j + 1}. obrázek`).not.toBe(o.vety[j]);
      }
    }
  });

  it("každé z možných pořadí se v osnově vyskytne právě jednou", () => {
    for (const o of OSNOVY) {
      const pro = L2A.filter((t) => pasPopisky(t)[0] === o.popisky[0]);
      expect(pro.length, `osnova „${o.nazev}“`).toBe(3);
    }
  });
});

describe("L2b — věta bez obrázku", () => {
  it("klíčem je právě ta věta, která v mojí tabulce není u žádného obrázku", () => {
    for (const t of L2B) {
      const o = osnovaUlohy(t);
      expect(klic(t), `„${t.question}“`).toBe(o.mimo);
      expect(o.vety, `klíč „${klic(t)}“ je přitom věta k obrázku`).not.toContain(klic(t));
    }
  });

  it("všechny tři distraktory jsou naopak věty k obrázkům té osnovy", () => {
    for (const t of L2B) {
      const o = osnovaUlohy(t);
      for (const d of distraktory(t)) {
        expect(o.vety, `„${d}“ není věta k žádnému obrázku, a přesto je distraktor`).toContain(d);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// L3 — vlastní řešitel celého vyprávění
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vyprávění je podle osnovy, když se v něm objeví značka **každého** obrázku
 * a značky stojí ve **stoupajícím** pořadí. Vynechaný obrázek znamená
 * chybějící značku, přeházené pořadí klesající pozici, vymyšlený konec
 * chybějící poslední značku.
 *
 * Tohle není tabulka — je to pravidlo. Proto taky smí projít právě jedna ze
 * čtyř možností, a to se testuje zvlášť.
 */
function jdePodleOsnovy(text: string, znaky: string[]): boolean {
  const pozice = znaky.map((z) => poziceSlova(text, z));
  if (pozice.some((p) => p < 0)) return false;
  return pozice.every((p, i) => i === 0 || p > pozice[i - 1]);
}

describe("L3a — celé vyprávění proti celé osnově", () => {
  it("vlastní řešitel pustí dál právě jednu možnost", () => {
    for (const t of L3A) {
      const o = osnovaUlohy(t);
      const prosly = (t.options ?? []).filter((m) => jdePodleOsnovy(m, o.znaky));
      expect(prosly.length, `„${o.nazev}“: prošlo ${prosly.length} možností — ${prosly.join(" | ")}`).toBe(1);
    }
  });

  it("a ta jedna je klíč", () => {
    for (const t of L3A) {
      const o = osnovaUlohy(t);
      expect(jdePodleOsnovy(klic(t), o.znaky), `klíč „${klic(t)}“ mým pravidlem neprojde`).toBe(true);
    }
  });

  it("každý distraktor porušuje pořadí, úplnost nebo konec", () => {
    for (const t of L3A) {
      const o = osnovaUlohy(t);
      for (const d of distraktory(t)) {
        expect(jdePodleOsnovy(d, o.znaky), `distraktor „${d}“ mým pravidlem projde, takže je taky správně`).toBe(false);
      }
    }
  });

  it("aspoň dva distraktory mají stejný počet vět jako klíč — počítání vět klíč neprozradí", () => {
    for (const t of L3A) {
      const vet = (s: string) => s.split(/(?<=\.)\s+/).length;
      const stejne = distraktory(t).filter((d) => vet(d) === vet(klic(t))).length;
      expect(stejne, `„${t.question}“: stejný počet vět má ${stejne} distraktorů`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("L3b — jak osnova skončí", () => {
  it("klíčem je popisek čtvrtého obrázku podle mojí tabulky", () => {
    for (const t of L3B) {
      expect(klic(t), `„${t.question}“`).toBe(osnovaUlohy(t).popisky[3]);
    }
  });

  it("pás má jen tři obrázky a otazník — jinak by klíč stál v zadání", () => {
    for (const t of L3B) {
      expect(t.visual?.kind).toBe("story_strip");
      if (t.visual?.kind !== "story_strip") continue;
      expect(t.visual.frames).toHaveLength(3);
      expect(t.visual.unknown).toBe(true);
    }
  });

  /**
   * „Vyber tu veselou" je strategie, kterou se dá téma obejít bez pohledu na
   * obrázky — a první verze tématu na ni fungovala, protože klíč byl vždy
   * jediný dobrý konec. Každý příběh proto musí nabídnout i veselý distraktor.
   */
  it("aspoň jeden distraktor dopadne dobře, takže „vyber tu veselou“ nestačí", () => {
    const SMUTNE = ["zůstal", "zůstala", "rozpadl", "uhynulo", "snědl", "domů", "výš"];
    for (const t of L3B) {
      const vesele = distraktory(t).filter((d) => !SMUTNE.some((s) => obsahujeSlovo(d, s)));
      expect(vesele.length, `„${t.question}“: veselý distraktor tu není, klíč jde uhodnout`).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("L3c — jméno celé osnovy", () => {
  it("klíčem je jméno z mojí tabulky", () => {
    for (const t of L3C) {
      expect(klic(t), `„${t.question}“`).toBe(osnovaUlohy(t).nazev);
    }
  });

  /**
   * První verze měla u všech pěti osnov klíč začínající „Jak" a žádný
   * distraktor takový. Stačilo tedy hledat „Jak". Našel jsem to při psaní
   * tohohle testu, ne při psaní obsahu.
   */
  it("„Jak“ na začátku klíč neprozradí — je i mezi distraktory a ne u každého klíče", () => {
    const jakKlic = L3C.filter((t) => t.correctAnswer.startsWith("Jak ")).length;
    expect(jakKlic, `„Jak“ začíná ${jakKlic} z ${L3C.length} klíčů`).toBeLessThan(L3C.length);
    for (const t of L3C) {
      const jakMoznosti = (t.options ?? []).filter((m) => m.startsWith("Jak ")).length;
      expect(jakMoznosti, `„${t.question}“: „Jak“ má jen ${jakMoznosti} možnost`).toBeGreaterThanOrEqual(1);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Strukturní kontroly
// ─────────────────────────────────────────────────────────────────────────────
// Berou `t.correctAnswer` přímo, ne přes `klic()`: o správnosti klíče nic
// netvrdí, takže pod `MUTACE=1` mají zůstat zelené.

describe("struktura každé úlohy", () => {
  it("čtyři různé možnosti a klíč mezi nimi", () => {
    for (const t of VSE) {
      expect(t.options, `„${t.question}“`).toHaveLength(4);
      expect(new Set(t.options).size, `„${t.question}“`).toBe(4);
      expect(t.options).toContain(t.correctAnswer);
    }
  });

  it("každý distraktor má zpětnou vazbu a klíč žádnou", () => {
    for (const t of VSE) {
      for (const m of t.options ?? []) {
        if (m === t.correctAnswer) {
          expect(t.optionFeedback?.[m], `„${t.question}“: klíč má zpětnou vazbu`).toBeUndefined();
        } else {
          expect(t.optionFeedback?.[m], `„${t.question}“: „${m}“ je bez zpětné vazby`).toBeTruthy();
        }
      }
    }
  });

  it("dvě různé nápovědy, velká aspoň o pětinu delší (audit hint_progression)", () => {
    for (const t of VSE) {
      expect(t.hints, `„${t.question}“`).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(t.hints![1].length, `„${t.question}“`).toBeGreaterThanOrEqual(t.hints![0].length * 1.2);
    }
  });

  it("žádná nápověda neprozrazuje klíč ani bez interpunkce", () => {
    const srovnej = (s: string) =>
      s.toLowerCase().replace(/[.,!?;:…„“"'’\-–—()]/g, " ").replace(/\s+/g, " ").trim();
    for (const t of VSE) {
      for (const h of t.hints ?? []) {
        expect(srovnej(h).includes(srovnej(t.correctAnswer)), `„${t.question}“: nápověda nese klíč`).toBe(false);
      }
    }
  });

  it("vysvětlení má každá úloha", () => {
    for (const t of VSE) expect(t.explanation, `„${t.question}“`).toBeTruthy();
  });

  it("zadání se vejde do dvanácti slov (audit sentence_complexity pro 2. ročník)", () => {
    for (const t of VSE) {
      const slov = t.question.trim().split(/\s+/).length;
      expect(slov, `„${t.question}“`).toBeLessThanOrEqual(12);
    }
  });

  it("každá úloha nese obrázkovou osnovu", () => {
    for (const t of VSE) {
      expect(t.visual?.kind, `„${t.question}“`).toBe("story_strip");
    }
  });

  it("klíč není nikdy napsaný v pásu osnovy", () => {
    for (const t of VSE) {
      expect(pasPopisky(t), `„${t.question}“: klíč si dítě přečte z obrázku`).not.toContain(t.correctAnswer);
    }
  });

  it("možnosti se neliší délkou tak, aby se dalo hádat podle ní", () => {
    for (const t of VSE) {
      const d = (t.options ?? []).map((m) => m.length);
      const min = Math.min(...d), max = Math.max(...d);
      expect(max / min, `„${t.question}“: ${min}–${max} znaků`).toBeLessThanOrEqual(1.6);
    }
  });

  it("klíč je striktně nejdelší možnost nejvýš u pětiny úloh", () => {
    let nejdelsi = 0;
    for (const t of VSE) {
      const ostatni = (t.options ?? []).filter((o) => o !== t.correctAnswer);
      if (ostatni.every((o) => t.correctAnswer.length > o.length)) nejdelsi++;
    }
    const podil = nejdelsi / VSE.length;
    expect(podil, `klíč je nejdelší u ${nejdelsi} z ${VSE.length} úloh`).toBeLessThan(0.3);
  });
});

/**
 * Shoda řadové číslovky s předložkou.
 *
 * ⚠️ Tenhle test vznikl z nálezu, který **neodhalil žádný stroj** — ani
 * typecheck, ani kritik v obsahu, ani `audit:content`. Zpětná vazba se
 * skládala v šabloně až za běhu a vyšlo z ní „Na prvnímu obrázku je tohle"
 * (3. pád místo 6.) a „patří k čtvrtému obrázku" (nevokalizované „k"). Viděl
 * jsem to až v dev náhledu v prohlížeči. Takové zkomolení dítě čte každý den,
 * takže se hlídat musí — a ne tím, že si na to vzpomenu.
 */
describe("čeština v textech, které vznikají až v šabloně", () => {
  const PAD_CISLOVKY: Record<string, string> = {
    prvního: "gen", druhého: "gen", třetího: "gen", čtvrtého: "gen",
    prvnímu: "dat", druhému: "dat", třetímu: "dat", čtvrtému: "dat",
    první: "akuz", druhý: "akuz", třetí: "akuz", čtvrtý: "akuz",
    prvním: "lok", druhém: "lok", třetím: "lok", čtvrtém: "lok",
  };
  /** Který pád ta předložka váže. „na" umí obojí — směr i místo. */
  const PAD_PREDLOZKY: Record<string, string[]> = {
    z: ["gen"], ze: ["gen"], do: ["gen"], od: ["gen"],
    k: ["dat"], ke: ["dat"],
    na: ["akuz", "lok"], o: ["lok"], v: ["lok"], ve: ["lok"],
  };
  const CISLOVKY = Object.keys(PAD_CISLOVKY).join("|");
  const PREDLOZKY = Object.keys(PAD_PREDLOZKY).join("|");
  const VZOR = new RegExp(`${H}(${PREDLOZKY}) (${CISLOVKY}) (obrázek|obrázku)${K}`, "gi");

  /** Všechno, co dítě na obrazovce uvidí. */
  function texty(t: PracticeTask): string[] {
    return [
      t.question,
      ...(t.options ?? []),
      ...(t.hints ?? []),
      t.explanation ?? "",
      ...Object.values(t.optionFeedback ?? {}),
    ];
  }

  it("číslovka má pád, který ta předložka váže", () => {
    for (const t of VSE) {
      for (const s of texty(t)) {
        for (const m of s.matchAll(VZOR)) {
          const [, , predlozka, cislovka, podstatne] = m;
          const pad = PAD_CISLOVKY[cislovka.toLowerCase()];
          expect(
            PAD_PREDLOZKY[predlozka.toLowerCase()],
            `„${m[0].trim()}“ v textu „${s}“ — po „${predlozka}“ se takhle číslovka neohýbá`,
          ).toContain(pad);
          const cekane = pad === "akuz" ? "obrázek" : "obrázku";
          expect(podstatne, `„${m[0].trim()}“ v textu „${s}“ — číslovka a podstatné jméno se neshodnou`).toBe(cekane);
        }
      }
    }
  });

  it("předložka „k“ se před „čtvrtý“ vokalizuje na „ke“", () => {
    for (const t of VSE) {
      for (const s of texty(t)) {
        expect(new RegExp(`${H}k čtvrt`, "i").test(s), `„${s}“ má „k čtvrtému“ místo „ke čtvrtému“`).toBe(false);
        expect(new RegExp(`${H}ke (prvn|druh|třet)`, "i").test(s), `„${s}“ má „ke“ tam, kam patří „k“`).toBe(false);
      }
    }
  });

  it("v textech není dvojí mezera ani mezera před interpunkcí", () => {
    for (const t of VSE) {
      for (const s of texty(t)) {
        expect(/ {2}/.test(s), `„${s}“ má dvojí mezeru`).toBe(false);
        expect(/\s[.,!?]/.test(s), `„${s}“ má mezeru před interpunkcí`).toBe(false);
      }
    }
  });
});

describe("metadata tématu", () => {
  it("míří na existující uzel RVP a `id` se rovná `rvpNodeId`", () => {
    expect(TEMA.id).toBe("g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypraveni-podle-obrazkove-osnovy");
    expect(TEMA.rvpNodeId).toBe(TEMA.id);
  });

  it("sloh není volný text — žádný essay", () => {
    expect(TEMA.inputType).toBe("select_one");
  });

  it("úrovně nevracejí totéž (kontrakt obtížnosti)", () => {
    expect(new Set([L1[0].question, L2[0].question, L3[0].question]).size).toBe(3);
    expect(L1.length).not.toBe(L3.length);
  });

  it("tabulka v testu pokrývá všechny příběhy z obsahu", () => {
    const zObsahu = new Set(VSE.map((t) => pasPopisky(t)[0]));
    expect(zObsahu.size, "osnov v obsahu").toBe(OSNOVY.length);
  });
});
