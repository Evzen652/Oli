/**
 * Co smí být na dosah dítěte.
 *
 * Dvě věci, které tu ležely dlouho a obě měly společné to, že nebyly vidět:
 *
 *  1. **`/report` v dětské větvi routeru.** Rodičovský přehled o dítěti —
 *     mistrovství po dovednostech, slabá místa, doporučení na další týden.
 *     Cizí data chrání RLS, takže to nebyla díra; ale dítě, které adresu tipne
 *     nebo ji najde v historii prohlížeče na sdíleném tabletu, nemá číst
 *     hodnocení sebe sama formulované pro dospělého. Odkaz byl skrytý
 *     (`!isStudentView`), route živá — a právě proto si toho nikdo nevšiml.
 *
 *  2. **Konverzační tutor za feature flagem.** `FEATURES.studentChat` byl
 *     `false`, jenže `loadOverrides()` čte `localStorage`, takže ho z konzole
 *     přepne kdokoli. Zásady soukromí přitom rodičům tvrdí „v aplikaci není
 *     chat". Slib daný v zásadách nesmí stát na hodnotě, kterou si lze
 *     přepsat — vlastnost, která posílá text dítěte ven, v kódu buď je, nebo
 *     není. Flag i komponenta `TutorChat` proto 13. 9. zmizely úplně.
 *
 * Tenhle test není test chování; je to **pojistka proti tichému návratu**.
 * Obojí se totiž vrátí snadno a v code review to vypadá nevinně.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = join(__dirname, "..");

/** Všechny zdrojáky aplikace mimo testy. */
function zdrojaky(dir: string, out: string[] = []): string[] {
  for (const polozka of readdirSync(dir)) {
    const cesta = join(dir, polozka);
    if (statSync(cesta).isDirectory()) {
      if (polozka === "test" || polozka === "node_modules") continue;
      zdrojaky(cesta, out);
    } else if (/\.tsx?$/.test(polozka)) {
      out.push(cesta);
    }
  }
  return out;
}

describe("dětská větev routeru", () => {
  const app = readFileSync(join(SRC, "App.tsx"), "utf8");
  // Dětská větev je poslední — komentář nad ní odděluje rodičovskou od dětské.
  const predel = app.indexOf("// Child or no role");

  it("komentář oddělující dětskou větev existuje", () => {
    expect(
      predel,
      "Značka `// Child or no role` v App.tsx zmizela, takže tenhle test už " +
        "neví, kde dětská větev začíná. Uprav ho spolu s routerem.",
    ).toBeGreaterThan(0);
  });

  it("nevede na rodičovský report", () => {
    const detska = app.slice(predel);
    expect(
      detska.includes('path="/report"'),
      "Do dětské větve routeru se vrátil `/report` — rodičovský přehled " +
        "o dítěti. Patří jen do větve rodiče a admina.",
    ).toBe(false);
  });

  it("report zůstal rodiči i adminovi", () => {
    // Opačný směr: kdyby ho někdo smazal všude, tenhle test to řekne dřív,
    // než na to přijde rodič klikem z dashboardu.
    const pred = app.slice(0, predel);
    expect(
      (pred.match(/path="\/report"/g) ?? []).length,
      "`/report` má být přesně ve dvou větvích — admin a rodič.",
    ).toBe(2);
  });
});

/**
 * Komentář ani docblock nic nevolá — a právě v nich je vysvětlené, proč tu
 * chat není. Kdyby se počítaly, test by padal na vlastním odůvodnění.
 */
function jeKomentar(radek: string): boolean {
  return /^\s*(\/\/|\/?\*)/.test(radek);
}

describe("chat s modelem v aplikaci není", () => {
  const soubory = zdrojaky(SRC);

  it("žádný zdroják nevolá edge funkci tutor-chat", () => {
    const nalezy: string[] = [];
    for (const soubor of soubory) {
      readFileSync(soubor, "utf8").split(/\r?\n/).forEach((radek, i) => {
        if (jeKomentar(radek)) return;
        if (/["'`]tutor-chat["'`]/.test(radek)) {
          nalezy.push(`${soubor.slice(SRC.length + 1)}:${i + 1} — ${radek.trim()}`);
        }
      });
    }

    expect(
      nalezy,
      "Zásady soukromí rodičům tvrdí, že dítě s modelem nekomunikuje. " +
        "Jestli se chat vrací, musí se nejdřív přepsat `Privacy.tsx` " +
        "a `legal.ts` — ne naopak.\n" + nalezy.join("\n"),
    ).toEqual([]);
  });

  it("neexistuje feature flag, kterým by se chat zapnul", () => {
    const nalezy: string[] = [];
    for (const soubor of soubory) {
      readFileSync(soubor, "utf8").split(/\r?\n/).forEach((radek, i) => {
        if (jeKomentar(radek)) return;
        if (/studentChat/.test(radek)) {
          nalezy.push(`${soubor.slice(SRC.length + 1)}:${i + 1} — ${radek.trim()}`);
        }
      });
    }

    expect(
      nalezy,
      "`FEATURES` se přepisují z `localStorage`, takže flag není ochrana, " +
        "jen skrytí. Vlastnost, která posílá text dítěte ven, v kódu buď je, " +
        "nebo není.\n" + nalezy.join("\n"),
    ).toEqual([]);
  });

  it("zásady soukromí to pořád tvrdí", () => {
    // Budík na zestárlé rozhodnutí: až ten slib z Privacy.tsx zmizí, padne
    // i důvod obou kontrol výš — a má se to probrat, ne přehlédnout.
    const privacy = readFileSync(join(SRC, "pages", "Privacy.tsx"), "utf8");
    expect(
      privacy.includes("v aplikaci není chat"),
      "Slib „v aplikaci není chat“ ze zásad zmizel. Tenhle test na něm stojí " +
        "— projdi ho spolu se změnou zásad.",
    ).toBe(true);
  });
});
