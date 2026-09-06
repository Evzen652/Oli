/**
 * Párovací kód, kterým se dítě připojí k rodičovskému účtu.
 *
 * ── Proč `crypto.getRandomValues()` a ne `Math.random()` ────────────────────
 * `Math.random()` NENÍ kryptograficky bezpečný — je to rychlý PRNG, jehož
 * vnitřní stav jde z několika po sobě jdoucích výstupů dopočítat. Kdo si nechá
 * vygenerovat kódy pro vlastní děti, dostane sérii výstupů z téhož generátoru,
 * a tím i vodítko k předpovědi kódů generovaných hned potom.
 *
 * Úspěšné uhodnutí cizího kódu vydá relaci DĚTSKÉHO ÚČTU, takže tohle není
 * teoretická vada. `crypto.getRandomValues()` čerpá ze systémového CSPRNG,
 * kde ta úvaha neplatí.
 *
 * ── Proč tady nevzniká modulo bias ──────────────────────────────────────────
 * Abeceda má 32 znaků a bajt nabývá 256 hodnot; 256 / 32 = 8 přesně, takže
 * `bajt % 32` rozdělí pravděpodobnost rovnoměrně. Kdyby se abeceda kdykoli
 * změnila na délku, která 256 nedělí beze zbytku, MUSÍ se doplnit odmítací
 * vzorkování — jinak by některé znaky vycházely častěji a entropie by klesla.
 * Hlídá to test `pairing-code.test.ts`.
 */

/** Bez znaků, které si lze splést: 0/O, 1/I/L. Dítě kód opisuje z papíru. */
export const PAIRING_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Délka kódu. Musí souhlasit s validací v edge funkci `pair-child`. */
export const PAIRING_CODE_LENGTH = 6;

/**
 * Vygeneruje párovací kód. Bez parametrů — zdroj náhody je systémový CSPRNG.
 */
export function generatePairingCode(): string {
  const bajty = new Uint8Array(PAIRING_CODE_LENGTH);
  crypto.getRandomValues(bajty);

  let kod = "";
  for (const b of bajty) {
    kod += PAIRING_ALPHABET[b % PAIRING_ALPHABET.length];
  }
  return kod;
}
