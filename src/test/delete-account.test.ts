/**
 * Mazání účtu — rozpoznání nenasazené edge funkce.
 *
 * Proč zrovna tohle: mazání běží přes `delete-account`, kterou nasazuje
 * provozovatel. Dokud nasazená není, volání vrací 404. Nejhorší možné chování
 * by bylo tvářit se, že se účet smazal — uživatel by odešel v přesvědčení, že
 * jeho data jsou pryč, a ona by tam byla dál.
 *
 * `funkceNedostupna()` je jediné místo, které o tom rozhoduje. Když vrátí
 * `true`, aplikace řekne naplno „účet je pořád aktivní, nic jsme nesmazali".
 * Falešně negativní výsledek by tuhle větu potlačil — proto je otestovaná.
 */
import { describe, it, expect } from "vitest";
import { funkceNedostupna } from "@/components/parent/DeleteAccountDialog";

describe("funkceNedostupna", () => {
  it("404 = funkce není nasazená", () => {
    expect(funkceNedostupna({ context: { status: 404 } })).toBe(true);
  });

  it("síťová chyba ze supabase-js se pozná podle zprávy", () => {
    expect(
      funkceNedostupna(new Error("Failed to send a request to the Edge Function")),
    ).toBe(true);
    expect(funkceNedostupna(new Error("Failed to fetch"))).toBe(true);
  });

  it("rozpoznání je nezávislé na velikosti písmen", () => {
    expect(funkceNedostupna(new Error("failed to FETCH"))).toBe(true);
  });

  it("500 NENÍ nedostupnost — mazání mohlo částečně proběhnout", () => {
    expect(funkceNedostupna({ context: { status: 500 } })).toBe(false);
  });

  it("401 ani 403 NENÍ nedostupnost", () => {
    expect(funkceNedostupna({ context: { status: 401 } })).toBe(false);
    expect(funkceNedostupna({ context: { status: 403 } })).toBe(false);
  });

  it("běžná chyba bez kontextu není nedostupnost", () => {
    expect(funkceNedostupna(new Error("něco se pokazilo"))).toBe(false);
  });

  it("prázdná hodnota není chyba", () => {
    expect(funkceNedostupna(null)).toBe(false);
    expect(funkceNedostupna(undefined)).toBe(false);
  });
});
