/**
 * Skryté předměty — informatika do aplikace nepatří (rozhodnutí Evžena 5. 10. 2026).
 *
 * ⚠️ Stav, který odhalil až tenhle test: **informatika v aplikaci nikdy nebyla.**
 * Dvacet souborů v `grade-4/informatika/` a `grade-5/informatika/` existuje na
 * disku, ale žádný `index.ts` je neimportuje, takže se do `ALL_TOPICS` nikdy
 * nedostaly. Grep přes zdrojové soubory je proto na měření pokrytí RVP
 * nepoužitelný — ukázal 360 naplněných uzlů, registr jich zná 340.
 *
 * Test proto hlídá tři věci:
 *  1. žádné ZAREGISTROVANÉ téma není ze skrytého předmětu,
 *  2. obsah se nesmazal — těch 20 souborů na disku dál leží,
 *  3. kdo staví seznam témat pro dítě, nesmí si filtr podle ročníku psát sám.
 *
 * Bod 3 je ten podstatný do budoucna: až někdo informatiku do `index.ts`
 * přidá, `getTopicsForGrade` ji dítěti stejně nepustí. Bez něj by stačil
 * jeden `getAllTopics().filter(...)` na nové obrazovce a rozhodnutí padne.
 */
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { getAllTopics, getTopicsForGrade } from "@/lib/contentRegistry";
import { HIDDEN_SUBJECTS, isSubjectHidden } from "@/lib/hiddenSubjects";
import { getDailyTasksForGrade } from "@/lib/anonDailyTasks";
import { ACTIVE_GRADES } from "@/lib/contentAvailability";

const SKRYTE = "informatika";

describe("skrytý předmět se dítěti nenabízí", () => {
  it("informatika je na seznamu skrytých", () => {
    expect(HIDDEN_SUBJECTS).toContain(SKRYTE);
    expect(isSubjectHidden(SKRYTE)).toBe(true);
    expect(isSubjectHidden("matematika")).toBe(false);
  });

  it("žádné zaregistrované téma není ze skrytého předmětu", () => {
    const skryta = getAllTopics().filter((t) => isSubjectHidden(t.subject));
    expect(skryta.map((t) => t.id)).toEqual([]);
  });

  it.each([...ACTIVE_GRADES])("getTopicsForGrade(%i) nevrací skrytý předmět", (g) => {
    const temata = getTopicsForGrade(g);
    expect(temata.length).toBeGreaterThan(0);
    expect(temata.filter((t) => isSubjectHidden(t.subject))).toEqual([]);
  });

  it.each([...ACTIVE_GRADES])("denní úkoly pro %i. ročník nenesou skrytý předmět", (g) => {
    expect(getDailyTasksForGrade(g).filter((t) => isSubjectHidden(t.subject))).toEqual([]);
  });
});

describe("skrytí není smazání", () => {
  const SLOZKY = ["src/content/grade-4/informatika", "src/content/grade-5/informatika"];

  it.each(SLOZKY)("%s dál leží na disku", (slozka) => {
    expect(existsSync(slozka)).toBe(true);
    expect(readdirSync(slozka).filter((f) => f.endsWith(".ts")).length).toBe(10);
  });

  it("a opravdu se nikam neimportuje — proto se do ALL_TOPICS nedostane", () => {
    for (const g of [4, 5]) {
      const index = readFileSync(`src/content/grade-${g}/index.ts`, "utf8");
      expect(index).not.toContain("informatika");
    }
  });
});

/**
 * Seznamy témat pro dítě (a pro rodiče, který dítěti zadává úkol) musí jít
 * přes `getTopicsForGrade`. Vlastní `filter` nad `gradeRange` skrytí obejde.
 */
describe("žádný vlastní filtr podle ročníku v dětské cestě", () => {
  const SOUBORY = [
    "src/components/TopicBrowser.tsx",
    "src/components/ChildHomePage.tsx",
    "src/components/AssignmentCreator.tsx",
    "src/pages/AnonStudentPage.tsx",
    "src/lib/anonDailyTasks.ts",
  ];

  it.each(SOUBORY)("%s nesahá na gradeRange sám", (soubor) => {
    const kod = readFileSync(soubor, "utf8");
    expect(kod).toContain("getTopicsForGrade");
    expect(kod).not.toContain("gradeRange");
  });
});
