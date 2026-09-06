/**
 * Zásady soukromí musí vyjmenovat KAŽDOU třetí stranu, které se data dostanou.
 *
 * Právní text stárne jinak než kód: když někdo přidá volání ven a zapomene ho
 * dopsat do `PRIJEMCI`, nic se nerozbije — jen se zveřejněný dokument tiše
 * stane nepravdivým. Typecheck to nechytí, testy chování taky ne, a při review
 * v obchodě už je pozdě.
 *
 * Tenhle test tedy prochází zdroják, vytáhne z něj cizí hostitele a porovná je
 * se seznamem v `content/legal.ts`. Je to táž myšlenka jako `audit:ui` —
 * hlídat, že aplikace neslibuje něco, co neodpovídá skutečnosti.
 *
 * Když test spadne: buď dopiš příjemce do `PRIJEMCI` (a zvaž, jestli to nechce
 * i souhlas uživatele), nebo hostitele přidej do `MIMO_ROZSAH` s odůvodněním,
 * proč přes něj neteče nic o uživateli.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { PRIJEMCI } from "@/content/legal";

const KOREN = join(__dirname, "..", "..");

/**
 * Hostitelé, kteří do zásad NEPATŘÍ — a proč. Každý řádek je tvrzení, které
 * musí platit; když přestane, patří hostitel mezi příjemce.
 */
const MIMO_ROZSAH: Record<string, string> = {
  "deno.land": "import modulu při nasazení funkce, neteče přes něj nic o uživateli",
  "esm.sh": "import modulu při nasazení funkce, neteče přes něj nic o uživateli",
  "jsr.io": "import modulu při nasazení funkce",
  "localhost": "vývojové prostředí",
  "127.0.0.1": "vývojové prostředí",
  "www.coi.cz": "odkaz v podmínkách, ne přenos dat",
  "coi.cz": "odkaz v podmínkách, ne přenos dat",
  "oli-edu.com": "vlastní doména",
  "schema.org": "jmenný prostor, nikam se nevolá",
  "www.w3.org": "jmenný prostor SVG, nikam se nevolá",
  "rollupjs.org": "odkaz v dokumentaci",
  "registry.npmjs.org": "instalace balíčků při vývoji",
  "claude.ai": "odkaz v adminu pro autora obsahu, neteče přes něj nic o uživateli",
  // Generování ilustrací běží v adminu z promptů, které píše redakce — žádná
  // data uživatele. Kdyby se některý z nich začal používat na obsah od dítěte,
  // PATŘÍ mezi příjemce.
  "router.huggingface.co": "generování ilustrací v adminu z redakčních promptů",
  "gen.pollinations.ai": "generování ilustrací v adminu z redakčních promptů",
  "api.openai.com": "generování ilustrací v adminu (generate-image) z redakčních promptů",
};

/** Hostitel → která položka `PRIJEMCI` ho pokrývá. */
const POKRYTI: Record<string, string> = {
  "uusaczibimqvaazpaopy.supabase.co": "Supabase",
  "supabase.co": "Supabase",
  "supabase.com": "Supabase",
  "ai.gateway.lovable.dev": "Poskytovatel jazykového modelu (Groq, Google nebo Lovable AI Gateway)",
  "generativelanguage.googleapis.com": "Poskytovatel jazykového modelu (Groq, Google nebo Lovable AI Gateway)",
  "api.groq.com": "Poskytovatel jazykového modelu (Groq, Google nebo Lovable AI Gateway)",
  "wa.me": "WhatsApp (Meta)",
  "api.resend.com": "Resend",
  "fonts.googleapis.com": "Google Fonts",
  "fonts.gstatic.com": "Google Fonts",
};

const PRIPONY = [".ts", ".tsx", ".html"];
const VYNECHAT = new Set([
  "node_modules", "dist", ".git", "coverage", ".claude", "public", "data",
  // Obsah cvičení: texty pro děti mohou zmiňovat adresy jako učivo, ne jako volání.
  "content",
  // Testy (včetně tohohle) obsahují hostitele jako testovací data.
  "test",
]);

function sesbirejSoubory(dir: string, out: string[] = []): string[] {
  for (const polozka of readdirSync(dir)) {
    if (VYNECHAT.has(polozka)) continue;
    const cesta = join(dir, polozka);
    if (statSync(cesta).isDirectory()) sesbirejSoubory(cesta, out);
    else if (PRIPONY.some((p) => polozka.endsWith(p))) out.push(cesta);
  }
  return out;
}

function najdiHostitele(): Map<string, string[]> {
  const soubory = [
    ...sesbirejSoubory(join(KOREN, "src")),
    ...sesbirejSoubory(join(KOREN, "supabase", "functions")),
    join(KOREN, "index.html"),
  ];
  const nalezy = new Map<string, string[]>();
  for (const soubor of soubory) {
    const text = readFileSync(soubor, "utf8");
    for (const m of text.matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)) {
      const host = m[1].toLowerCase();
      if (!nalezy.has(host)) nalezy.set(host, []);
      const seznam = nalezy.get(host)!;
      const rel = soubor.slice(KOREN.length + 1);
      if (!seznam.includes(rel)) seznam.push(rel);
    }
  }
  return nalezy;
}

describe("zásady soukromí odpovídají skutečnosti", () => {
  it("každý cizí hostitel v kódu je buď mezi příjemci, nebo má doložené proč ne", () => {
    const nalezeni = najdiHostitele();
    const nezname: string[] = [];

    for (const [host, soubory] of nalezeni) {
      if (host in MIMO_ROZSAH) continue;
      if (host in POKRYTI) continue;
      nezname.push(`${host}  →  ${soubory.slice(0, 3).join(", ")}`);
    }

    expect(
      nezname,
      "Tenhle hostitel není v zásadách soukromí ani na seznamu výjimek.\n" +
        "Dopiš ho do PRIJEMCI v src/content/legal.ts, nebo do MIMO_ROZSAH\n" +
        "v tomhle testu s odůvodněním, proč přes něj neteče nic o uživateli.\n\n" +
        nezname.join("\n"),
    ).toEqual([]);
  });

  it("každá položka v POKRYTI odkazuje na příjemce, který v zásadách opravdu je", () => {
    const jmena = PRIJEMCI.map((p) => p.nazev);
    for (const [host, prijemce] of Object.entries(POKRYTI)) {
      expect(jmena, `Hostitel ${host} odkazuje na neexistujícího příjemce`).toContain(prijemce);
    }
  });

  it("seznam příjemců není prázdný a každý má vyplněný účel i umístění", () => {
    expect(PRIJEMCI.length).toBeGreaterThan(0);
    for (const p of PRIJEMCI) {
      expect(p.nazev.trim().length, `${p.nazev}: prázdný název`).toBeGreaterThan(0);
      expect(p.ucel.trim().length, `${p.nazev}: chybí účel`).toBeGreaterThan(10);
      expect(p.umisteni.trim().length, `${p.nazev}: chybí umístění`).toBeGreaterThan(0);
    }
  });
});
