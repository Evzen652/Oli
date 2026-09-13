/**
 * Písmo hostujeme sami — a hlídáme, že to tak zůstane.
 *
 * Do 13. 9. 2026 tahal `index.html` Nunito z `fonts.googleapis.com`. Byl to
 * jediný odchozí požadavek na dětských obrazovkách bez funkční nutnosti: při
 * každém otevření aplikace šla třetí straně IP adresa a hlavičky prohlížeče
 * dítěte. Pro dětskou kategorii v obchodech je to položka navíc k vysvětlování
 * a zásady soukromí by o ní musely mluvit. V mobilním obalu bez sítě se navíc
 * písmo nenačetlo vůbec.
 *
 * Vrátit se to může nenápadně — jedním `<link>` v hlavičce nebo `@import`em
 * v CSS, což v code review vypadá jako drobnost. Proto tenhle test.
 *
 * Čtvrté měřítko hlídá jinou chybu, kterou tenhle projekt už jednou udělal:
 * `tailwind.config.ts` žádal `Baloo 2`, žádné `@font-face` s tím názvem
 * neexistovalo, a písmo se tedy **nikdy nevykreslilo** — jen se stahovalo.
 * Název rodiny v CSS a v Tailwindu se proto musí shodovat.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const SRC = join(__dirname, "..");
const ROOT = join(SRC, "..");

const ZAKAZANE_HOSTY = ["fonts.googleapis.com", "fonts.gstatic.com"];

/** Soubory, ve kterých by odkaz na Google Fonts mohl vzniknout. */
function souboryKProhledani(dir: string, out: string[] = []): string[] {
  for (const polozka of readdirSync(dir)) {
    // `test` ven: testy (tenhle taky) nesou názvy hostitelů jako data.
    if (["node_modules", "dist", ".git", "test"].includes(polozka)) continue;
    const cesta = join(dir, polozka);
    if (statSync(cesta).isDirectory()) {
      souboryKProhledani(cesta, out);
    } else if (/\.(tsx?|css|html)$/.test(polozka)) {
      out.push(cesta);
    }
  }
  return out;
}

/**
 * Vymaže komentáře, ne kód.
 *
 * Zmínka v komentáři nic nestahuje — a právě v komentářích je vysvětlené, proč
 * se písmo hostuje samo. Kdyby se počítaly, test by padal na vlastním
 * odůvodnění. Řádkové podmínky nestačí: blokový komentář v CSS má většinu
 * řádků bez úvodní hvězdičky.
 */
function bezKomentaru(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

describe("Google Fonts se nikde nevolá", () => {
  it("index.html nemá odkaz ani preconnect na Google", () => {
    const html = readFileSync(join(ROOT, "index.html"), "utf8");
    const nalezy = ZAKAZANE_HOSTY.filter((host) => html.includes(host));

    expect(
      nalezy,
      "V `index.html` je zpátky odkaz na Google Fonts. Písmo leží " +
        "v `src/assets/fonts/`, `@font-face` je v `src/index.css`.",
    ).toEqual([]);
  });

  it("žádný zdroják ani styl na Google neodkazuje", () => {
    const nalezy: string[] = [];
    for (const soubor of [...souboryKProhledani(SRC), join(ROOT, "index.html")]) {
      const kod = bezKomentaru(readFileSync(soubor, "utf8"));
      kod.split(/\r?\n/).forEach((radek, i) => {
        for (const host of ZAKAZANE_HOSTY) {
          if (radek.includes(host)) {
            nalezy.push(`${soubor.slice(ROOT.length + 1)}:${i + 1} — ${radek.trim()}`);
          }
        }
      });
    }

    expect(
      nalezy,
      "Odkaz na Google Fonts se vrátil. Dětská obrazovka nemá dělat " +
        "požadavek mimo naši doménu.\n" + nalezy.join("\n"),
    ).toEqual([]);
  });
});

describe("místní písmo je úplné", () => {
  const cssCesta = join(SRC, "index.css");
  const css = readFileSync(cssCesta, "utf8");
  const bloky = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];

  it("v index.css jsou deklarace @font-face", () => {
    expect(
      bloky.length,
      "V `src/index.css` není jediné `@font-face`. Bez něj se nenačte nic " +
        "a text spadne na systémový bezpatkový font.",
    ).toBeGreaterThan(0);
  });

  it("každý odkazovaný soubor písma na disku existuje", () => {
    const chybi: string[] = [];
    for (const blok of bloky) {
      for (const m of blok.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        const rel = m[1];
        if (/^(https?:)?\/\//.test(rel) || rel.startsWith("data:")) continue;
        const plna = join(dirname(cssCesta), rel);
        if (!existsSync(plna)) chybi.push(rel);
      }
    }

    expect(
      chybi,
      "`@font-face` ukazuje na soubor, který v repu není — písmo se nenačte " +
        "a nikdo si toho nemusí všimnout, protože fallback vypadá skoro stejně.\n" +
        chybi.join("\n"),
    ).toEqual([]);
  });

  it("název rodiny se shoduje s tím, co žádá tailwind.config.ts", () => {
    // Rodiny deklarované v CSS.
    const deklarovane = new Set(
      bloky
        .map((b) => b.match(/font-family:\s*["']([^"']+)["']/)?.[1])
        .filter((x): x is string => Boolean(x)),
    );

    // Bez komentářů: nad `fontFamily` stojí poznámka o dřívějším „Baloo 2",
    // což je přesně ta chyba, kterou tenhle test popisuje — počítat ji jako
    // žádané písmo by z vysvětlení udělalo nález.
    const tw = bezKomentaru(readFileSync(join(ROOT, "tailwind.config.ts"), "utf8"));
    const fontFamily = tw.match(/fontFamily:\s*\{[\s\S]*?\n\s*\},/)?.[0] ?? "";
    // První položka každého seznamu je žádané písmo, zbytek je fallback.
    const zadane = [...fontFamily.matchAll(/\[\s*["']([^"']+)["']/g)].map((m) => m[1]);

    const nepokryte = [...new Set(zadane)].filter((f) => !deklarovane.has(f));

    expect(
      nepokryte,
      "Tailwind žádá písmo, ke kterému žádné `@font-face` není. Přesně tahle " +
        "chyba tu už byla s `Baloo 2`: font se stahoval a nikdy nevykreslil.\n" +
        `žádané: ${zadane.join(", ")}\ndeklarované: ${[...deklarovane].join(", ")}`,
    ).toEqual([]);
  });
});
