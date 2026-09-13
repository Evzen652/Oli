/**
 * Ročník s obsahem musí mít dětský slovník — jinak čte žák RVP.
 *
 * `displayNames.BY_GRADE` se plní ručně a zapomenout se na něj dá snadno:
 * ročník se otevře, obsah funguje, testy jsou zelené — a dítě mezitím čte
 * „Měření fyzikálních veličin" nebo „Rozmanitost přírody, třídění organismů",
 * tedy názvy psané pro dospělého do tabulky standardu. Stalo se to 6. ročníku,
 * který byl od 11. 9. otevřený žákům a slovník dostal až 13. 9.
 *
 * Test proto **neměří pokrytí jednotlivých okruhů** — to by po dnešku spadlo na
 * ročnících 2–5, kde část hesel schválně chybí a fallback na RVP název je tam
 * v pořádku. Měří jen to, co je opravdu vada: ročník, který má obsah a nemá
 * slovník vůbec. Je to budík na zestárlé rozhodnutí, ne tlak na úplnost.
 *
 * Druhá část hlídá tón hesel, která existují: názvy pro dítě jsou krátké
 * a nemluví o něm ve třetí osobě („Žák určí…"), což je formulace z RVP.
 */
import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import { resolveSubjectKey } from "@/lib/subjectRegistry";
import type { DisplayEntry, DisplayMap } from "@/lib/displayNames";
import type { Grade } from "@/lib/types";

import { DISPLAY_NAMES as G2 } from "@/content/grade-2/displayNames";
import { DISPLAY_NAMES as G3 } from "@/content/grade-3/displayNames";
import { DISPLAY_NAMES as G4 } from "@/content/grade-4/displayNames";
import { DISPLAY_NAMES as G5 } from "@/content/grade-5/displayNames";
import { DISPLAY_NAMES as G6 } from "@/content/grade-6/displayNames";

/** Slovníky, které v projektu jsou. Nový ročník = nový řádek i tady. */
const SLOVNIKY: Partial<Record<Grade, DisplayMap>> = {
  2: G2,
  3: G3,
  4: G4,
  5: G5,
  6: G6,
};

/** Ročníky, pro které nějaké téma existuje. */
function rocnikySObsahem(): number[] {
  const g = new Set<number>();
  for (const t of getAllTopics()) g.add(t.gradeRange[0]);
  return [...g].sort((a, b) => a - b);
}

describe("DĚTSKÉ NÁZVY — pokrytí ročníků", () => {
  it("kazdy rocnik s obsahem ma dětský slovník", () => {
    const bez = rocnikySObsahem().filter((g) => !SLOVNIKY[g as Grade]);

    expect(
      bez,
      `Ročník má obsah, ale nemá záznam v \`displayNames.BY_GRADE\`, takže žák ` +
        `čte oficiální RVP názvy okruhů a témat. Založ ` +
        `\`src/content/grade-N/displayNames.ts\` a zapiš ho do mapy.\n` +
        `Ročníky bez slovníku: ${bez.join(", ")}`,
    ).toEqual([]);
  });

  it("meri se aspon ctyri rocniky, aby nula neco znamenala", () => {
    expect(rocnikySObsahem().length).toBeGreaterThanOrEqual(4);
  });

  /**
   * Na tomhle stojí každý nadpis s názvem předmětu. `TopicMetadata.subject` je
   * u 2. stupně slug bez diakritiky („dejepis"), takže kdo ho vypíše přímo,
   * napíše dítěti „Dejepis" — stalo se to v `SessionView` a znovu
   * v `TopicBrowser`, protože do otevření 6. ročníku měly všechny předměty
   * slug s háčky a chyba neměla jak vyjít najevo. Dokud se každý předmět
   * dohledá v rejstříku, má UI odkud vzít správný popisek.
   */
  it("kazdy predmet v obsahu se dohleda v rejstriku predmetu", () => {
    const nezname = [...new Set(getAllTopics().map((t) => t.subject))]
      .filter((s) => resolveSubjectKey(s) === null);

    expect(
      nezname,
      `Předmět není v \`subjectRegistry\`, takže dostane náhradní paletu ` +
        `a jako popisek se použije syrový slug (např. „Dejepis" bez háčku). ` +
        `Doplň ho do \`SUBJECTS\`, nebo přidej alias.\n${nezname.join(", ")}`,
    ).toEqual([]);
  });
});

describe("DĚTSKÉ NÁZVY — tón hesel, která existují", () => {
  const vsechna: { grade: string; klic: string; entry: DisplayEntry }[] = [];
  for (const [g, mapa] of Object.entries(SLOVNIKY)) {
    if (!mapa) continue;
    for (const [klic, entry] of Object.entries(mapa.categories)) {
      vsechna.push({ grade: g, klic: `okruh ${klic}`, entry });
    }
    for (const [klic, entry] of Object.entries(mapa.topics)) {
      vsechna.push({ grade: g, klic: `téma ${klic}`, entry });
    }
  }

  it("hesel je dost na to, aby test neco meril", () => {
    expect(vsechna.length).toBeGreaterThan(50);
  });

  it("nemluvi o diteti ve treti osobe", () => {
    // „Žák určí…" je formulace z RVP tabulky, ne věta pro dítě.
    const nalezy = vsechna
      .filter((x) => /\bžák/i.test(`${x.entry.name} ${x.entry.description ?? ""}`))
      .map((x) => `g${x.grade} · ${x.klic} → „${x.entry.name}"`);

    expect(
      nalezy,
      `Dětský název mluví o žákovi ve třetí osobě — to je jazyk RVP. ` +
        `Piš ve 2. osobě („Změříš…", „Poznáš…").\n${nalezy.join("\n")}`,
    ).toEqual([]);
  });

  it("nazev je kratky", () => {
    const nalezy = vsechna
      .filter((x) => x.entry.name.trim().split(/\s+/).length > 5)
      .map((x) => `g${x.grade} · ${x.klic} → „${x.entry.name}"`);

    expect(
      nalezy,
      `Dětský název má být 2–4 slova; tohle se na kartu nevejde:\n${nalezy.join("\n")}`,
    ).toEqual([]);
  });

  it("popis je jedna kratka veta", () => {
    const nalezy = vsechna
      .filter((x) => (x.entry.description ?? "").trim().split(/\s+/).filter(Boolean).length > 16)
      .map((x) => `g${x.grade} · ${x.klic} → „${x.entry.description}"`);

    expect(
      nalezy,
      `Popis na kartě má být jedna věta do ~15 slov:\n${nalezy.join("\n")}`,
    ).toEqual([]);
  });
});
