// Hashování PINu dítěte pro edge funkce (Deno / Web Crypto, bez závislostí).
// Formát uloženého řetězce: pbkdf2$<iterace>$<salt_b64>$<hash_b64>
//
// PIN je jen 4místný → sám o sobě slabý. Bezpečnost stojí na:
//  1) serverovém hashování se solí (tento soubor),
//  2) rate-limitingu v child-relogin (zámek po N chybných pokusech),
//  3) tom, že skutečné heslo účtu dítěte zůstává silné a náhodné — PIN je
//     jen oddělený faktor, po jehož ověření server sám vydá session.

const ITERATIONS = 100_000;
const KEYLEN_BYTES = 32;
const SALT_BYTES = 16;

function toB64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromB64(s: string): Uint8Array {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

async function derive(pin: string, salt: Uint8Array, iterations: number, len: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    len * 8,
  );
  return new Uint8Array(bits);
}

export async function hashPin(pin: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(pin, salt, ITERATIONS, KEYLEN_BYTES);
  return `pbkdf2$${ITERATIONS}$${toB64(salt)}$${toB64(hash)}`;
}

export async function verifyPin(pin: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;

  let salt: Uint8Array;
  let expected: Uint8Array;
  try {
    salt = fromB64(parts[2]);
    expected = fromB64(parts[3]);
  } catch {
    return false;
  }

  const actual = await derive(pin, salt, iterations, expected.length);

  // Konstantně-časové porovnání (nezáleží na pozici první odlišnosti).
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}

// Validace formátu PINu (společná pro set i relogin): právě 4 číslice.
export function isValidPinFormat(pin: unknown): pin is string {
  return typeof pin === "string" && /^\d{4}$/.test(pin);
}
