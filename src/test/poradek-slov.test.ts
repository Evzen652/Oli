/**
 * Nezávislá kontrola tématu „Pořádek slov ve větě" (2. ročník).
 *
 * Princip Generator→Critic (`docs/CONTENT_AUTHORING.md`): tenhle soubor
 * **nezná** tabulku `ZAKLAD` ani šablony z `poradekSlovVeVete.ts`. Importuje
 * hotové úlohy a rozhoduje o nich z vlastních pravidel a vlastní tabulky.
 *
 * Proč je to u tohohle tématu potřeba víc než jinde: čeština má **volný
 * slovosled**, takže přehozená věta bývá taky správná. Nejnebezpečnější vada
 * tady není špatný klíč, ale **druhá správná možnost** — distraktor, který
 * dítě přečte jako stejně dobrý. Na to jsou měřítka níž.
 *
 * Čtyři části, které se nemají zaměňovat:
 *
 * 1. **Vlastní tabulka klíčů L3** (`KLICE_L3`) je *druhé autorství*. Přečetl
 *    jsem všech 14 zadání a napsal, která věta říká totéž. Kdyby obsah ukázal
 *    na jinou možnost (nebo měl v klíči jiný tvar slova), tabulka se s ním
 *    rozejde. U L1 a L2 tabulka není — tam se ověřuje pravidlo, ne seznam.
 * 2. **Pravidla o pořádku slov.** U L1 musí předložka stát v klíči hned před
 *    svým slovem a v žádném distraktoru ne. U L2 a L3 musí být klíč *přesmyčka*
 *    zadání — stejná slova ve stejných tvarech, jen jinak seřazená. To je
 *    doslova to, co znamená „říká totéž"; kdyby se v klíči změnil tvar slova,
 *    věta by tvrdila něco jiného (to je celá pointa úrovně L3).
 * 3. **Rozhodnutí o formátu.** Téma záměrně NENÍ `drag_order` — viz komentář
 *    v obsahu. Test to drží, aby to někdo „nevylepšil" bez té rozvahy.
 * 4. **Formální hygiena** (4 možnosti, feedback, délka zadání pro 2. ročník).
 *
 * ```bash
 * MUTACE=1 npx vitest run src/test/poradek-slov.test.ts
 * ```
 *
 * `MUTACE=1` prohlásí za klíč distraktor — abecedně prvního, ne „první
 * v poli": generátor možnosti míchá, takže varianta s indexem dávala pokaždé
 * jiný počet padlých testů (viz `tiche-cteni.test.ts`). Změřeno: padnou
 * 4 z 18 testů, mezi nimi obě měřítka klíče (tabulka L3, předložka v klíči L1).
 *
 * Co zůstane zelené, o správnosti klíče nic netvrdí — „právě jedna možnost má
 * předložku na místě" na klíči vůbec nezávisí.
 *
 * Pozor na sílu měřítka „klíč je přesmyčka zadání": padne, ale jen proto, že
 * abecedně první distraktor přesmyčka není. **Část distraktorů přesmyčky JE**
 * — u L2 ta s odtrženou předložkou, u L3 navíc ta s vyměněnými předložkami.
 * To je úmysl (klíč se nesmí poznat podle slov, jen podle pořádku), ale
 * znamená to, že samo tohle měřítko by záměnu klíče za takový distraktor
 * nechytilo. Chytí ji tabulka `KLICE_L3`.
 */
import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { PORADEK_SLOV_VE_VETE } from "@/content/grade-2/cjl/poradekSlovVeVete";
import { getAllTopics } from "@/lib/contentRegistry";
import { getNode } from "@/content/curriculum";

const MUTACE = process.env.MUTACE === "1";
const TEMA = PORADEK_SLOV_VE_VETE[0];
const RVP_ID = "g2-cjl-jazykova-vychova-slovo-a-veta-poradek-slov-ve-vete";

/** Předložky, které se v tématu vyskytují. Vlastní seznam, ne import. */
const PREDLOZKY = new Set(["v", "ve", "na", "u", "do", "po", "před", "nad", "za"]);

/** Slova věty bez interpunkce a bez velikosti písmen. */
function slova(veta: string): string[] {
  return veta
    .replace(/[.,!?„“]/g, "")
    .trim()
    .split(/\s+/)
    .map((w) => w.toLowerCase())
    .filter(Boolean);
}

/** Je `a` přesmyčka `b`? (stejná slova ve stejných tvarech, jiné pořadí) */
function jePresmycka(a: string, b: string): boolean {
  const x = slova(a).sort();
  const y = slova(b).sort();
  return x.length === y.length && x.every((w, i) => w === y[i]);
}

/** Věta ze zadání — to, co je v úvodních „…“. Null, když tam žádná není. */
function zadaniZOtazky(q: string): string | null {
  const m = q.match(/„([^“]+)“/);
  return m ? m[1] : null;
}

/** Úlohy úrovně; pod MUTACE=1 je klíčem abecedně první distraktor. */
function uroven(level: number): PracticeTask[] {
  const tasks = TEMA.generator(level);
  if (!MUTACE) return tasks;
  return tasks.map((t) => {
    const jine = (t.options ?? []).filter((o) => o !== t.correctAnswer).sort();
    return jine.length ? { ...t, correctAnswer: jine[0] } : t;
  });
}

/**
 * Druhé autorství pro L3: zadání → věta, která říká totéž.
 * Napsáno čtením zadání, ne odvozením z obsahu.
 */
const KLICE_L3: Record<string, string> = {
  // dvě předložkové vazby — obě předložky zůstávají u svých slov
  "Pes spí v boudě na zahradě.": "Na zahradě spí pes v boudě.",
  "Kniha leží na stole u okna.": "U okna leží kniha na stole.",
  "Táta stojí u auta před domem.": "Před domem stojí táta u auta.",
  "Kočka leží na polštáři v křesle.": "V křesle leží kočka na polštáři.",
  "Děti běhají po hřišti za školou.": "Za školou běhají děti po hřišti.",
  "Rybičky plavou v akváriu u televize.": "U televize plavou rybičky v akváriu.",
  "Babička sedí na lavičce u domu.": "U domu sedí babička na lavičce.",
  // prohozené tvary — role drží tvar slova, ne jeho místo ve větě
  "Kočka honí psa.": "Psa honí kočka.",
  "Maminka volá Petra.": "Petra volá maminka.",
  "Učitelka chválí Jirku.": "Jirku chválí učitelka.",
  "Tomáš předběhl Davida.": "Davida předběhl Tomáš.",
  "Babička češe Lucku.": "Lucku češe babička.",
  "Slon postříkal klauna.": "Klauna postříkal slon.",
  "Sova vyplašila myšku.": "Myšku vyplašila sova.",
};

describe("pořádek slov ve větě — zařazení", () => {
  it("téma je v registru a pokrývá svůj RVP uzel", () => {
    const v_registru = getAllTopics().find((t) => t.id === TEMA.id);
    expect(v_registru, "téma není v ALL_TOPICS — chybí import v grade-2/index.ts").toBeDefined();
    expect(TEMA.rvpNodeId).toBe(RVP_ID);
    expect(getNode(RVP_ID)?.labels.subtopic).toBe("Pořádek slov ve větě");
  });

  it("dítě ho najde v okruhu „Věta a text“ 2. ročníku", async () => {
    const { GRADE2_NAVIGATION } = await import("@/content/grade-2/navigation");
    const okruhy = GRADE2_NAVIGATION.flatMap((s) => s.okruhy);
    const nesou = okruhy.filter((o) => o.topicIds.includes(TEMA.id));
    expect(nesou.map((o) => o.id)).toEqual(["veta-text"]);
  });

  it("formát je select_one, ne drag_order (volný slovosled — viz hlavička)", () => {
    expect(TEMA.inputType).toBe("select_one");
    for (const lvl of [1, 2, 3]) {
      for (const t of TEMA.generator(lvl)) {
        expect(t.items, `L${lvl}: úloha nese items → vyrenderuje se jako drag_order`).toBeUndefined();
      }
    }
  });
});

describe("pořádek slov ve větě — L1: předložka u svého slova", () => {
  const tasks = uroven(1);

  it("má aspoň 12 unikátních úloh", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
  });

  it("všechny čtyři možnosti jsou přesmyčky téže čtveřice slov", () => {
    for (const t of tasks) {
      const opts = t.options ?? [];
      expect(opts.length).toBe(4);
      for (const o of opts) {
        expect(
          jePresmycka(o, opts[0]),
          `„${o}“ nemá stejná slova jako „${opts[0]}“ — v L1 se slova nemění, jen přesouvají`,
        ).toBe(true);
      }
    }
  });

  it("právě jedna možnost má předložku hned před svým slovem", () => {
    for (const t of tasks) {
      const spravne = (t.options ?? []).filter((o) => {
        const w = slova(o);
        return w.length === 4 && PREDLOZKY.has(w[2]);
      });
      expect(spravne.length, `úloha „${t.question}“ má ${spravne.length} vět se správně umístěnou předložkou`).toBe(1);
    }
  });

  it("KLÍČ je právě ta věta (měřítko klíče — pod MUTACE=1 musí spadnout)", () => {
    for (const t of tasks) {
      const w = slova(t.correctAnswer);
      expect(w.length, `klíč „${t.correctAnswer}“ nemá čtyři slova`).toBe(4);
      expect(
        PREDLOZKY.has(w[2]),
        `v klíči „${t.correctAnswer}“ nestojí předložka na třetím místě`,
      ).toBe(true);
    }
  });
});

describe("pořádek slov ve větě — L2 a L3: klíč je přesmyčka zadání", () => {
  for (const lvl of [2, 3]) {
    it(`L${lvl}: klíč má stejná slova ve stejných tvarech jako zadání`, () => {
      for (const t of uroven(lvl)) {
        const zadani = zadaniZOtazky(t.question);
        expect(zadani, `v zadání „${t.question}“ chybí věta v „…“`).toBeTruthy();
        expect(
          jePresmycka(t.correctAnswer, zadani!),
          `klíč „${t.correctAnswer}“ není přesmyčka zadání „${zadani}“ — tedy neříká totéž`,
        ).toBe(true);
      }
    });

    it(`L${lvl}: klíč není tatáž věta ve stejném pořadí`, () => {
      for (const t of uroven(lvl)) {
        const zadani = zadaniZOtazky(t.question)!;
        expect(
          slova(t.correctAnswer).join(" ") === slova(zadani).join(" "),
          `klíč „${t.correctAnswer}“ je totožný se zadáním — pořádek slov se nezměnil`,
        ).toBe(false);
      }
    });

    it(`L${lvl}: má aspoň 12 unikátních úloh`, () => {
      const tasks = TEMA.generator(lvl);
      expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    });
  }

  it("L3: klíč souhlasí s vlastní tabulkou (měřítko klíče — pod MUTACE=1 musí spadnout)", () => {
    const tasks = uroven(3);
    expect(tasks.length).toBe(Object.keys(KLICE_L3).length);
    for (const t of tasks) {
      const zadani = zadaniZOtazky(t.question)!;
      const ocekavany = KLICE_L3[zadani];
      expect(ocekavany, `zadání „${zadani}“ není v tabulce KLICE_L3`).toBeTruthy();
      expect(t.correctAnswer).toBe(ocekavany);
    }
  });
});

describe("pořádek slov ve větě — úrovně a hygiena", () => {
  it("L1, L2 a L3 se v zadáních nepřekrývají", () => {
    const [a, b, c] = [1, 2, 3].map((l) => new Set(TEMA.generator(l).map((t) => t.question)));
    for (const [x, y, kde] of [[a, b, "L1×L2"], [a, c, "L1×L3"], [b, c, "L2×L3"]] as const) {
      const spolecne = [...x].filter((q) => y.has(q));
      expect(spolecne, `${kde} mají společná zadání`).toEqual([]);
    }
  });

  it("každá úloha má 4 různé možnosti, klíč mezi nimi a feedback ke každé chybné", () => {
    for (const lvl of [1, 2, 3]) {
      for (const t of TEMA.generator(lvl)) {
        const opts = t.options ?? [];
        expect(opts.length, `L${lvl}: „${t.question}“`).toBe(4);
        expect(new Set(opts).size, `L${lvl}: duplicitní možnost u „${t.question}“`).toBe(4);
        expect(opts.filter((o) => o === t.correctAnswer).length).toBe(1);
        for (const o of opts.filter((o) => o !== t.correctAnswer)) {
          expect(t.optionFeedback?.[o], `L${lvl}: chybí feedback k „${o}“`).toBeTruthy();
        }
      }
    }
  });

  it("obě nápovědy existují, liší se a neprozrazují klíč", () => {
    for (const lvl of [1, 2, 3]) {
      for (const t of TEMA.generator(lvl)) {
        expect(t.hints?.length, `L${lvl}: „${t.question}“`).toBe(2);
        expect(t.hints![0]).not.toBe(t.hints![1]);
        expect(t.explanation, `L${lvl}: chybí vysvětlení u „${t.question}“`).toBeTruthy();
        for (const h of t.hints!) {
          expect(
            h.includes(t.correctAnswer),
            `L${lvl}: nápověda prozrazuje klíč u „${t.question}“`,
          ).toBe(false);
        }
      }
    }
  });

  it("zadání se vejde do limitu 2. ročníku (12 slov)", () => {
    for (const lvl of [1, 2, 3]) {
      for (const t of TEMA.generator(lvl)) {
        const pocet = t.question.trim().split(/\s+/).length;
        expect(pocet, `L${lvl}: „${t.question}“ má ${pocet} slov`).toBeLessThanOrEqual(12);
      }
    }
  });
});
