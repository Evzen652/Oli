/**
 * Česká gramatika — centrální helpery pro správnou pluralizaci a deklinaci.
 *
 * POUŽITÍ:
 *   plural(3, "díl", "díly", "dílů")          → "díly"
 *   pluralWithNumber(3, "díl", "díly", "dílů") → "3 díly"
 *   pad(3, "ÚLOH")                            → "3 úlohy" (slovník common nounů)
 *
 * PRAVIDLO:
 *   1     → one  (nominativ singular)         např. "1 díl"
 *   2-4   → few  (nominativ plural)           např. "2 díly"
 *   0,5+  → many (genitiv plural)             např. "5 dílů" / "0 dílů"
 *
 * VŠECHEN UŽIVATELSKY VIDITELNÝ TEXT S ČÍSLEM A PODSTATNÝM JMÉNEM
 * MUSÍ POUŽÍVAT TYTO HELPERY (viz CLAUDE.md).
 */

// ── Core ────────────────────────────────────────────────────────────────────

/**
 * Vrátí správný tvar slova podle čísla.
 * @example plural(3, "díl", "díly", "dílů") → "díly"
 */
export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n);
  if (abs === 1) return one;
  if (abs >= 2 && abs <= 4) return few;
  return many;
}

/**
 * Vrátí "N <správný tvar>".
 * @example pluralWithNumber(3, "díl", "díly", "dílů") → "3 díly"
 */
export function pluralWithNumber(n: number, one: string, few: string, many: string): string {
  return `${n} ${plural(n, one, few, many)}`;
}

// ── Slovník běžných substantiv ──────────────────────────────────────────────
// Klíče VŽDY UPPERCASE — chrání před překlepy a usnadňuje search.
// Tvar: [one, few, many]

const NOUNS: Record<string, [string, string, string]> = {
  // Učení / cvičení
  ÚKOL:       ["úkol", "úkoly", "úkolů"],
  ÚLOHA:      ["úloha", "úlohy", "úloh"],
  CVIČENÍ:    ["cvičení", "cvičení", "cvičení"],
  OTÁZKA:     ["otázka", "otázky", "otázek"],
  ODPOVĚĎ:    ["odpověď", "odpovědi", "odpovědí"],
  TÉMA:       ["téma", "témata", "témat"],
  PODTÉMA:    ["podtéma", "podtémata", "podtémat"],
  PŘEDMĚT:    ["předmět", "předměty", "předmětů"],
  ROČNÍK:     ["ročník", "ročníky", "ročníků"],
  TŘÍDA:      ["třída", "třídy", "tříd"],
  ŽÁK:        ["žák", "žáci", "žáků"],
  DÍTĚ:       ["dítě", "děti", "dětí"],
  RODIČ:      ["rodič", "rodiče", "rodičů"],
  CHYBA:      ["chyba", "chyby", "chyb"],
  BOD:        ["bod", "body", "bodů"],
  NÁPOVĚDA:   ["nápověda", "nápovědy", "nápověd"],
  POKUS:      ["pokus", "pokusy", "pokusů"],

  // Čas
  SEKUNDA:    ["sekunda", "sekundy", "sekund"],
  MINUTA:     ["minuta", "minuty", "minut"],
  HODINA:     ["hodina", "hodiny", "hodin"],
  DEN:        ["den", "dny", "dní"],
  TÝDEN:      ["týden", "týdny", "týdnů"],
  MĚSÍC:      ["měsíc", "měsíce", "měsíců"],
  ROK:        ["rok", "roky", "let"],

  // Matematika
  DÍL:        ["díl", "díly", "dílů"],
  ČÁST:       ["část", "části", "částí"],
  STRANA:     ["strana", "strany", "stran"],
  ÚHEL:       ["úhel", "úhly", "úhlů"],
  TROJÚHELNÍK:["trojúhelník", "trojúhelníky", "trojúhelníků"],
  ČTVEREC:    ["čtverec", "čtverce", "čtverců"],
  ZLOMEK:     ["zlomek", "zlomky", "zlomků"],
  ČÍSLO:      ["číslo", "čísla", "čísel"],
  KOSTKA:     ["kostka", "kostky", "kostek"],
  JABLKO:     ["jablko", "jablka", "jablek"],
  KORUNA:     ["koruna", "koruny", "korun"],

  // Jednotky
  METR:       ["metr", "metry", "metrů"],
  CENTIMETR:  ["centimetr", "centimetry", "centimetrů"],
  MILIMETR:   ["milimetr", "milimetry", "milimetrů"],
  KILOMETR:   ["kilometr", "kilometry", "kilometrů"],
  GRAM:       ["gram", "gramy", "gramů"],
  KILOGRAM:   ["kilogram", "kilogramy", "kilogramů"],
  LITR:       ["litr", "litry", "litrů"],
  MILILITR:   ["mililitr", "mililitry", "mililitrů"],
} as const;

export type NounKey = keyof typeof NOUNS;

/**
 * Helper s rejstříkem běžných substantiv — vrací "N <správný tvar>".
 * @example pad(3, "ÚLOHA") → "3 úlohy"
 * @example pad(5, "DEN")   → "5 dní"
 *
 * Pokud klíč není ve slovníku, vyhodí runtime warning (dev-only) a vrátí raw číslo.
 * V tom případě přidej nové substantivum do NOUNS.
 */
export function pad(n: number, key: string): string {
  const forms = NOUNS[key as NounKey];
  if (!forms) {
    if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`[czechGrammar] Neznámé podstatné jméno: "${key}". Přidej ho do NOUNS v src/lib/czechGrammar.ts`);
    }
    return String(n);
  }
  return pluralWithNumber(n, forms[0], forms[1], forms[2]);
}

/** Vrátí jen správný tvar slova (bez čísla), z rejstříku. */
export function form(n: number, key: string): string {
  const forms = NOUNS[key as NounKey];
  if (!forms) return key.toLowerCase();
  return plural(n, forms[0], forms[1], forms[2]);
}

// ── Speciální tvary ─────────────────────────────────────────────────────────

/**
 * Slovesa v minulém čase podle rodu — "splnil" / "splnila".
 * Pro nezjištěný rod použij neutrální tvar nebo se vyhni minulému času.
 *
 * @example pastTense("splnil", "f") → "splnila"
 * @example pastTense("zvládl",  "m") → "zvládl"
 */
export function pastTense(masc: string, gender: "m" | "f" | "n" | "unknown"): string {
  if (gender === "f") {
    // -il → -ila, -al → -ala, -el → -ela, -l → -la
    if (masc.endsWith("l")) return masc.slice(0, -1) + "la";
  }
  if (gender === "n") {
    if (masc.endsWith("l")) return masc.slice(0, -1) + "lo";
  }
  return masc;
}

/**
 * "Vyřešil(a)" formát pro nezjištěný rod (rodič/dítě bez info).
 * Lepší než hardcoded "vyřešil/a" — zachovává konzistenci.
 */
export function pastTenseInclusive(masc: string): string {
  if (masc.endsWith("l")) return `${masc}(a)`;
  return masc;
}

// ── Adjektiva po čísle ──────────────────────────────────────────────────────
// "1 stejný díl" / "2 stejné díly" / "5 stejných dílů"
// Tabulka pokrývá běžná přídavná jména v nominativu, mužský neživotný rod
// (= většina geometrických/matematických použití).

const ADJ_FORMS: Record<string, [string, string, string]> = {
  // [mask. sg. nom., mask. pl. nom., gen. pl.]
  STEJNÝ:     ["stejný",   "stejné",   "stejných"],
  RŮZNÝ:      ["různý",    "různé",    "různých"],
  MALÝ:       ["malý",     "malé",     "malých"],
  VELKÝ:      ["velký",    "velké",    "velkých"],
  DLOUHÝ:     ["dlouhý",   "dlouhé",   "dlouhých"],
  KRÁTKÝ:     ["krátký",   "krátké",   "krátkých"],
  NOVÝ:       ["nový",     "nové",     "nových"],
  STARÝ:      ["starý",    "staré",    "starých"],
  SPRÁVNÝ:    ["správný",  "správné",  "správných"],
  ŠPATNÝ:     ["špatný",   "špatné",   "špatných"],
  CELÝ:       ["celý",     "celé",     "celých"],
} as const;

/**
 * Vrátí správný tvar přídavného jména po čísle.
 * @example adj(3, "STEJNÝ") → "stejné"
 * Použij pro frázi "N <adj> <substantivum>", např.:
 *   `${pluralWithNumber(n, "díl","díly","dílů")}` — ALE pro adjektivum musíš:
 *   `${n} ${adj(n, "STEJNÝ")} ${form(n, "DÍL")}` → "3 stejné díly"
 */
export function adj(n: number, key: string): string {
  const forms = ADJ_FORMS[key as keyof typeof ADJ_FORMS];
  if (!forms) {
    if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`[czechGrammar] Neznámé přídavné jméno: "${key}". Přidej do ADJ_FORMS.`);
    }
    return key.toLowerCase();
  }
  return plural(n, forms[0], forms[1], forms[2]);
}

/**
 * Composite helper: "N <adj> <substantivum>".
 * @example phrase(3, "STEJNÝ", "DÍL") → "3 stejné díly"
 * @example phrase(5, "STEJNÝ", "DÍL") → "5 stejných dílů"
 * @example phrase(1, "STEJNÝ", "DÍL") → "1 stejný díl"
 */
export function phrase(n: number, adjKey: string, nounKey: string): string {
  return `${n} ${adj(n, adjKey)} ${form(n, nounKey)}`;
}
