/**
 * Helper pro české skloňování podle čísla.
 *
 * Česká gramatika:
 *   • 1 → jednotné číslo (nominativ): "1 den"
 *   • 2–4 → množné (nom. pl.):        "3 dny"
 *   • 0, 5+ → množné (gen. pl.):      "6 dnů" / "0 dnů"
 *
 * Použití:
 *   cs(5, "den", "dny", "dnů")  // → "5 dnů"
 *   cs(1, "stovka", "stovky", "stovek")  // → "1 stovka"
 */
export function cs(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n);
  if (abs === 1) return `${n} ${one}`;
  if (abs >= 2 && abs <= 4) return `${n} ${few}`;
  return `${n} ${many}`;
}

/** Vrátí jen správný tvar slova bez čísla. */
export function csWord(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n);
  if (abs === 1) return one;
  if (abs >= 2 && abs <= 4) return few;
  return many;
}

// ── Předpřipravené tvary pro matematické jednotky a řády ──
export const PLURALS = {
  // Řády
  stovek: (n: number) => csWord(n, "stovka", "stovky", "stovek"),
  desitek: (n: number) => csWord(n, "desítka", "desítky", "desítek"),
  tisicovek: (n: number) => csWord(n, "tisícovka", "tisícovky", "tisícovek"),
  jednotek: (n: number) => csWord(n, "jednotka", "jednotky", "jednotek"),
  // Čas
  den: (n: number) => csWord(n, "den", "dny", "dnů"),
  hodina: (n: number) => csWord(n, "hodina", "hodiny", "hodin"),
  minuta: (n: number) => csWord(n, "minuta", "minuty", "minut"),
  sekunda: (n: number) => csWord(n, "sekunda", "sekundy", "sekund"),
  rok: (n: number) => csWord(n, "rok", "roky", "let"),
  // Části / díly (pro zlomky)
  cast: (n: number) => csWord(n, "část", "části", "částí"),
  dil: (n: number) => csWord(n, "díl", "díly", "dílů"),
  kousek: (n: number) => csWord(n, "kousek", "kousky", "kousků"),
  skupinka: (n: number) => csWord(n, "skupinka", "skupinky", "skupinek"),
  // Geometrie
  strana: (n: number) => csWord(n, "strana", "strany", "stran"),
  uhel: (n: number) => csWord(n, "úhel", "úhly", "úhlů"),
  vrchol: (n: number) => csWord(n, "vrchol", "vrcholy", "vrcholů"),
};

/** Helper: "5 stovek" s automatickým skloňováním. */
export const plural = {
  stovek: (n: number) => cs(n, "stovka", "stovky", "stovek"),
  desitek: (n: number) => cs(n, "desítka", "desítky", "desítek"),
  tisicovek: (n: number) => cs(n, "tisícovka", "tisícovky", "tisícovek"),
  jednotek: (n: number) => cs(n, "jednotka", "jednotky", "jednotek"),
  den: (n: number) => cs(n, "den", "dny", "dnů"),
  hodina: (n: number) => cs(n, "hodina", "hodiny", "hodin"),
  minuta: (n: number) => cs(n, "minuta", "minuty", "minut"),
  sekunda: (n: number) => cs(n, "sekunda", "sekundy", "sekund"),
  rok: (n: number) => cs(n, "rok", "roky", "let"),
  cast: (n: number) => cs(n, "část", "části", "částí"),
  dil: (n: number) => cs(n, "díl", "díly", "dílů"),
  kousek: (n: number) => cs(n, "kousek", "kousky", "kousků"),
  skupinka: (n: number) => cs(n, "skupinka", "skupinky", "skupinek"),
  strana: (n: number) => cs(n, "strana", "strany", "stran"),
  uhel: (n: number) => cs(n, "úhel", "úhly", "úhlů"),
  vrchol: (n: number) => cs(n, "vrchol", "vrcholy", "vrcholů"),
};
