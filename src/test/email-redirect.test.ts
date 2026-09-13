/**
 * Odkaz z e-mailu musí vést na adresu, která existuje na internetu.
 *
 * Uvnitř obalu pro Google Play a App Store je `window.location.origin`
 * `https://localhost` — původ WebView, ne web. Kdo ho použije jako `redirectTo`,
 * pošle uživateli e-mail s odkazem, po kterém se neotevře nic: obnova hesla
 * i potvrzení registrace z mobilu skončí ve slepé uličce. Chyba se přitom
 * neprojeví nikde ve vývoji — na webu ten kód funguje správně.
 *
 * Proto tenhle test hlídá obojí: že se helper chová podle prostředí a že ho
 * volající skutečně používají.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Přepínač pro mock Capacitoru — mění se mezi testy. */
const prostredi = { nativni: false };

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: () => prostredi.nativni,
    getPlatform: () => (prostredi.nativni ? "android" : "web"),
  },
}));

describe("adresaProOdkazZEmailu", () => {
  beforeEach(() => {
    prostredi.nativni = false;
  });

  it("na webu vychází z aktuálního původu, aby šel reset hesla zkoušet lokálně", async () => {
    const { adresaProOdkazZEmailu } = await import("@/lib/native");
    expect(adresaProOdkazZEmailu("/reset-password")).toBe(
      `${window.location.origin}/reset-password`,
    );
    expect(adresaProOdkazZEmailu()).toBe(window.location.origin);
  });

  it("v mobilním obalu vede na produkční web, ne na localhost", async () => {
    prostredi.nativni = true;
    const { adresaProOdkazZEmailu } = await import("@/lib/native");
    expect(adresaProOdkazZEmailu("/reset-password")).toBe(
      "https://oli-edu.com/reset-password",
    );
    expect(adresaProOdkazZEmailu()).not.toContain("localhost");
  });
});

const SRC = join(__dirname, "..");

/** Všechny zdrojové soubory aplikace mimo testy. */
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

describe("volající", () => {
  it("nestaví odkaz z e-mailu na window.location.origin", () => {
    const provinilci: string[] = [];

    for (const soubor of zdrojaky(SRC)) {
      const radky = readFileSync(soubor, "utf8").split("\n");
      radky.forEach((radek, i) => {
        // Zajímá nás jen řádek, kde se redirect skutečně nastavuje.
        if (!/\b(emailRedirectTo|redirectTo)\s*:/.test(radek)) return;
        if (radek.includes("adresaProOdkazZEmailu")) return;
        provinilci.push(
          `${soubor.slice(SRC.length + 1)}:${i + 1} — ${radek.trim()}`,
        );
      });
    }

    expect(
      provinilci,
      "Adresu pro odkaz z e-mailu skládej přes `adresaProOdkazZEmailu()` " +
        "z `@/lib/native`. Přímý `window.location.origin` je v mobilním obalu " +
        "`https://localhost` a odkaz vede do prázdna.\n" +
        provinilci.join("\n"),
    ).toEqual([]);
  });
});
