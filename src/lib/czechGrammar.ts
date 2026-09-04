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
  KNÍŽKA:     ["knížku", "knížky", "knížek"],
  MÍSTO:      ["místo", "místa", "míst"],
  AUTO:       ["auto", "auta", "aut"],
  KORUNA:     ["koruna", "koruny", "korun"],
  KULIČKA:    ["kulička", "kuličky", "kuliček"],
  KRABICE:    ["krabice", "krabice", "krabic"],

  // Číselné řády
  STOVKA:     ["stovka", "stovky", "stovek"],
  DESÍTKA:    ["desítka", "desítky", "desítek"],
  JEDNOTKA:   ["jednotka", "jednotky", "jednotek"],

  // Geometrie / mřížka
  SLOUPEC:    ["sloupec", "sloupce", "sloupců"],
  ŘÁDEK:      ["řádek", "řádky", "řádků"],

  // Desetinná čísla
  NULA:       ["nulu", "nuly", "nul"],
  DESETINA:   ["desetina", "desetiny", "desetin"],
  SETINA:     ["setina", "setiny", "setin"],
  TISÍCINA:   ["tisícina", "tisíciny", "tisícin"],

  // Skupiny / řády
  TISÍCOVKA:  ["tisícovka", "tisícovky", "tisícovek"],
  SKUPINKA:   ["skupinka", "skupinky", "skupinek"],

  // Jednotky
  METR:       ["metr", "metry", "metrů"],
  CENTIMETR:  ["centimetr", "centimetry", "centimetrů"],
  MILIMETR:   ["milimetr", "milimetry", "milimetrů"],
  KILOMETR:   ["kilometr", "kilometry", "kilometrů"],
  GRAM:       ["gram", "gramy", "gramů"],
  KILOGRAM:   ["kilogram", "kilogramy", "kilogramů"],
  LITR:       ["litr", "litry", "litrů"],
  MILILITR:   ["mililitr", "mililitry", "mililitrů"],

  // Fyzika / měření
  KOLO:       ["kolo", "kola", "kol"],
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

// ── Shoda přísudku s číslovkou ───────────────────────────────────

/**
 * Mluvnický rod. `ma` = mužský životný, `mi` = mužský neživotný.
 * Životnost se v množném čísle projeví na slovese: „byli 3 žáci" × „byly 3 body".
 */
export type Gender = "ma" | "mi" | "f" | "n";

/**
 * Rod pro každé substantivum z `NOUNS`. Úplnost hlídá test
 * `czech-grammar-agreement` — bez něj by nové slovo tiše spadlo na výchozí tvar.
 *
 * `DÍTĚ` má rozdílný rod v čísle jednotném a množném: „bylo 1 dítě" (střední),
 * ale „byly 3 děti" (množné číslo se skloňuje jako ženské). Proto dvojice.
 */
const GENDER: Record<string, Gender | { sg: Gender; pl: Gender }> = {
  ÚKOL: "mi", ÚLOHA: "f", CVIČENÍ: "n", OTÁZKA: "f", ODPOVĚĎ: "f",
  TÉMA: "n", PODTÉMA: "n", PŘEDMĚT: "mi", ROČNÍK: "mi", TŘÍDA: "f",
  ŽÁK: "ma", DÍTĚ: { sg: "n", pl: "f" }, RODIČ: "ma", CHYBA: "f", BOD: "mi",
  NÁPOVĚDA: "f", POKUS: "mi",

  SEKUNDA: "f", MINUTA: "f", HODINA: "f", DEN: "mi", TÝDEN: "mi",
  MĚSÍC: "mi", ROK: "mi",

  DÍL: "mi", ČÁST: "f", STRANA: "f", ÚHEL: "mi", TROJÚHELNÍK: "mi",
  ČTVEREC: "mi", ZLOMEK: "mi", ČÍSLO: "n", KOSTKA: "f", JABLKO: "n",
  KNÍŽKA: "f", MÍSTO: "n", AUTO: "n", KORUNA: "f", KULIČKA: "f", KRABICE: "f",

  STOVKA: "f", DESÍTKA: "f", JEDNOTKA: "f", SLOUPEC: "mi", ŘÁDEK: "mi",
  NULA: "f", DESETINA: "f", SETINA: "f", TISÍCINA: "f",
  TISÍCOVKA: "f", SKUPINKA: "f",

  METR: "mi", CENTIMETR: "mi", MILIMETR: "mi", KILOMETR: "mi",
  GRAM: "mi", KILOGRAM: "mi", LITR: "mi", MILILITR: "mi", KOLO: "n",
};

/** Rod slova pro daný počet (řeší `DÍTĚ`, kde se sg a pl liší). */
export function genderOf(key: string, n = 2): Gender | null {
  const g = GENDER[key];
  if (!g) return null;
  if (typeof g === "string") return g;
  return Math.abs(n) === 1 ? g.sg : g.pl;
}

/**
 * Shoda přísudku v minulém čase s číslovkou.
 *
 * Tohle je nejčastější česká chyba v generovaných úlohách: číslovku někdo
 * dosadí proměnnou, ale sloveso nechá napevno. Vznikne „Ve třídě **bylo**
 * 3 žáci" — správně je „byli 3 žáci". Pravidlo má tři větve, ne dvě:
 *
 * | počet | tvar                             |
 * |-------|----------------------------------|
 * | 1     | podle rodu: byl / byla / bylo    |
 * | 2–4   | množné číslo: byli / byly / byla |
 * | 0, 5+ | vždy střední rod j. č.: bylo     |
 *
 * U pěti a víc řídí číslovka genitiv, přísudek proto zůstává neutrální.
 *
 * @param verbN sloveso ve **středním rodě jednotného čísla** — „bylo",
 *              „stálo", „zbylo", „přijelo". Z něj se odvodí ostatní tvary.
 *
 * @example agree(3, "ŽÁK", "bylo")    → "byli"  (byli 3 žáci)
 * @example agree(3, "AUTO", "stálo")  → "stála" (stála 3 auta)
 * @example agree(7, "ŽÁK", "bylo")    → "bylo"  (bylo 7 žáků)
 * @example agree(1, "KOSTKA", "bylo")  → "byla"  (byla 1 kostka)
 */
export function agree(n: number, key: string, verbN: string): string {
  const stem = verbN.endsWith("o") ? verbN.slice(0, -1) : verbN;
  const g = genderOf(key, n);
  if (!g) {
    if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`[czechGrammar] Neznámý rod pro "${key}". Přidej ho do GENDER.`);
    }
    return verbN;
  }
  const abs = Math.abs(n);
  if (abs === 1) return g === "f" ? `${stem}a` : g === "n" ? `${stem}o` : stem;
  if (abs >= 2 && abs <= 4) {
    if (g === "ma") return `${stem}i`;
    if (g === "n") return `${stem}a`;
    return `${stem}y`;
  }
  return `${stem}o`;
}

/**
 * Totéž pro sponu v přítomném čase: „je 1 auto", „**jsou** 3 auta", „je 5 aut".
 * Rod tu roli nehraje, jen počet.
 */
export function isAre(n: number): string {
  const abs = Math.abs(n);
  return abs >= 2 && abs <= 4 ? "jsou" : "je";
}

/**
 * Složené: „bylo 7 žáků" / „byli 3 žáci" / „byl 1 žák".
 * @example wasCount(3, "ŽÁK") → "byli 3 žáci"
 */
export function wasCount(n: number, key: string, verbN = "bylo"): string {
  return `${agree(n, key, verbN)} ${pad(n, key)}`;
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
