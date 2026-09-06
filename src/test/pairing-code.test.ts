/**
 * Párovací kód — vlastnosti, na kterých stojí jeho bezpečnost.
 *
 * Uhodnutí kódu vydá relaci dětského účtu, takže tady nejde o kosmetiku.
 * Testy hlídají tři věci, které se dají tiše rozbít úpravou vypadající
 * nevinně (zkrácení kódu, přidání znaku do abecedy, návrat k Math.random).
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  generatePairingCode,
  PAIRING_ALPHABET,
  PAIRING_CODE_LENGTH,
} from "@/lib/pairingCode";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("generatePairingCode", () => {
  it("má dohodnutou délku a jen znaky z abecedy", () => {
    for (let i = 0; i < 200; i++) {
      const kod = generatePairingCode();
      expect(kod).toHaveLength(PAIRING_CODE_LENGTH);
      for (const znak of kod) {
        expect(PAIRING_ALPHABET).toContain(znak);
      }
    }
  });

  it("čerpá ze systémového CSPRNG, ne z Math.random", () => {
    const crypt = vi.spyOn(crypto, "getRandomValues");
    const mathRandom = vi.spyOn(Math, "random");

    generatePairingCode();

    expect(crypt).toHaveBeenCalled();
    expect(mathRandom).not.toHaveBeenCalled();
  });

  it("abeceda dělí 256 beze zbytku, takže `% délka` nezavádí modulo bias", () => {
    // Kdyby někdo do abecedy přidal nebo z ní ubral znak, rozdělení přestane
    // být rovnoměrné a entropie klesne — aniž by cokoli spadlo. Proto test.
    expect(256 % PAIRING_ALPHABET.length).toBe(0);
  });

  it("neobsahuje dvojice, které si lze splést při opisování", () => {
    // Vyřazené jsou obě strany obou záměn: 0/O i 1/I.
    for (const zamenitelny of ["0", "O", "1", "I"]) {
      expect(PAIRING_ALPHABET).not.toContain(zamenitelny);
    }
    // `L` v abecedě ZŮSTÁVÁ a je to v pořádku: plete se s jedničkou, a ta
    // v abecedě není. Kdyby se sem `1` někdy vrátila, musí odejít `L`.
    expect(PAIRING_ALPHABET).toContain("L");
    expect(PAIRING_ALPHABET).not.toContain("1");
  });

  it("prostor kódů je dost velký, aby hrubá síla dávala smysl jen s limitem", () => {
    const prostor = Math.pow(PAIRING_ALPHABET.length, PAIRING_CODE_LENGTH);
    expect(prostor).toBeGreaterThan(1e9);
  });

  it("dva po sobě vygenerované kódy se neshodují", () => {
    const kody = new Set(Array.from({ length: 500 }, () => generatePairingCode()));
    // Při 32^6 možnostech je kolize na 500 vzorcích prakticky vyloučená;
    // shoda by znamenala zaseknutý generátor.
    expect(kody.size).toBe(500);
  });
});
