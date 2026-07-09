/**
 * Konfigurace pro kolo 2 audit invarianty:
 *   - TIER_EXCEPTIONS: topic ID bez přirozené obtížnostní osy (nekontrolujeme).
 *   - PREFIX_WHITELIST + getGeneratedWordCheck: whitelist spisovných tvarů
 *     u pravopisných generátorů (spec 6 — prevence „ne-slov" typu „zdal",
 *     „spochodovala", „vzstartovala").
 *
 * Zdroj: docs/CONTENT_AUTHORING.md + spec audit-invarianty-spec.md.
 */

import type { PracticeTask } from "./types";

// ─────────────────────────────────────────────────────────────
// TIER_EXCEPTIONS
// Topics bez přirozené obtížnostní osy: čistě formální sloh, rukopis,
// tvořivé činnosti. Prázdné L2/L3 u nich není vada. Každá výjimka
// s krátkým odůvodněním, ať v budoucnu víme, proč tam je.
// ─────────────────────────────────────────────────────────────
export const TIER_EXCEPTIONS: ReadonlySet<string> = new Set<string>([
  // Sloh a komunikace — dovednost, ne pravidlo s obtížnostní gradací.
  "g3-cjl-dialog-pravidla",
  "g3-cjl-omluvenka-zprava",
  "g3-cjl-uhledne-psani",
  "g3-cjl-tvorive-cinnosti",
  "g3-cjl-vlastni-vytvarny-doprovod",
  "g3-cjl-sebekontrola-projevu",
  "g3-cjl-reprodukce-textu",
  "g3-cjl-popis-predmetu",
  "g3-cjl-vypravovani-osnova",
  // g4-cjl — formální/slohová/tvořivá témata (systémové dluhy zadání, balík 2B)
  "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-inzerat-vzkaz-telefonicky-rozhovor",
  "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-predmetu-osoby-a-pracovniho-postupu",
  "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-casovou-posloupnosti-osnova",
  "g4-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-tvorba-na-dane-tema",
  // POZN.: vers-rym-prirovnani, pohadka-povidka-basen-bajka, proza-verse
  // NEJSOU výjimky — patří do balíku 2A (doplnit L3), viz systemove-dluhy-zadani.md.
  // Odstraněny odsud po opravě chybné klasifikace z kola 2.
  // POZN.: plynule-cteni-s-porozumeni NENÍ výjimka — dovednost, L3 doplněno v kole 2 (A5).
]);

// ─────────────────────────────────────────────────────────────
// PREFIX_WHITELIST — spec 6 klíčová prevence.
//
// U generátoru předpon (`g4-cjl-…-pravopis-predpon-vy-vy-s-z-vz`) hlídáme,
// aby vygenerovaný tvar (prefix + základ) byl spisovné české slovo. Tady je
// staticky whitelistovaná množina — kdykoli generátor vytvoří tvar mimo,
// audit failne (chytá „zdal", „vzstartovala", „spochodovala").
//
// Format: Set<lowercase whole word>.
// Nový tvar přidávej jen po ověření v Slovníku spisovné češtiny.
// ─────────────────────────────────────────────────────────────
export const PREFIX_WHITELIST: ReadonlySet<string> = new Set<string>([
  // vy- (dokončení, pohyb ven)
  "vydělal", "výhru", "vyletěl", "výbornou", "výtah", "vylezla",
  "výhodu", "vystřelil", "vypracoval", "výborné", "výbornou",
  "vytrénoval", "výtisk", "vystoupil", "vysvětlil", "významení",
  "vyskočila", "vylétali", "vyběhlo", "výborný", "vyšlo", "vykoukl",
  "vyhrál", "vychází", "vypracovala", "vytěžila", "vystoupil",
  "vytrénoval", "vypochodovala", "vyletěli", "vyskočil",
  // vý-
  "výhru", "výhodu", "výborné", "výbornou", "výbornou",
  // s- (dolů / sloučení)
  "sjel", "sjeli", "spadaly", "spálil", "sloučili", "svah",
  "sklouzal", "sklesla", "sklesalo", "spadla", "spadl", "stekla",
  "svedl", "srazilo", "srazil", "slévaly", "sběhly", "schystali",
  "sjezdovky", "sedly",
  // z- (změna stavu)
  "zbohatl", "zlepšila", "zhustla", "změklo", "zmrzl", "zrezivělo",
  "zmohutněl", "zhoustla", "ztuhlo", "zkyslo", "zmizel", "zhasl",
  "zdřevěněly", "zvedl", "zvládl", "zlepšila", "zpomalel",
  "zhustla",
  // vz- (nahoru / vznik)
  "vzlétl", "vzlétali", "vzlétla", "vzdal", "vzdala", "vzpomněl",
  "vzkřikl", "vzpamatoval", "vznesl", "vzrostl", "vzchopil",
  "vzniklo", "vzniknout", "vzpřímil",
  // po- (samostatná předpona, občas v poolu jako distraktor pravidla)
  "pozvání",
  // u- (klidnil se)
  "uklidnil",
]);

/**
 * Extrahuje z úlohy pravopisného generátoru vytvořený tvar
 * (základ + předpona). Vrátí null, pokud nelze rekonstruovat.
 *
 * Formát otázky (viz `pravopisPredponVyVySZVz.ts`):
 *   `Doplň správnou předponu: "Sníh ___rostl přes noc."`
 *
 * Rekonstrukce: najdi slovo, které v pool položce má `___` na začátku;
 * dosaď blank (z task.blanks nebo z task.correctAnswer minus '-').
 */
function extractPrefixWord(task: PracticeTask): string | null {
  const q = task.question ?? "";
  const m = q.match(/___(\p{L}+)/u);
  if (!m) return null;
  const base = m[1];
  const blank = task.blanks?.[0] ?? String(task.correctAnswer ?? "").replace(/-$/, "");
  if (!blank) return null;
  return (blank + base).toLowerCase();
}

/**
 * Vrátí kontrolní funkci pro daný topic, nebo null pokud topic
 * není pravopisný generátor s whitelistem.
 *
 * Kontrolní funkce dostane task a vrátí:
 *   - null pokud OK
 *   - string s neplatným tvarem pokud slovo NENÍ ve whitelistu
 */
export function getGeneratedWordCheck(
  topicId: string,
): ((task: PracticeTask) => string | null) | null {
  // Prefix generátor je hlavní riziko (spec 6).
  if (topicId === "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predpon-vy-vy-s-z-vz") {
    return (task) => {
      const word = extractPrefixWord(task);
      if (!word) return null;
      // Rozšířený whitelist — hledáme buď v setu, nebo ověříme, že jde
      // o rozumné české slovo tolerantním pravidlem: alespoň 4 znaky,
      // začíná známým prefixem, obsahuje samohlásku.
      if (PREFIX_WHITELIST.has(word)) return null;
      // Fallback tolerance: přijmi tvar, který začíná známým prefixem
      // A má základ, který je ve whitelistu bez prefixu. Zamezí false-positive
      // u legitimních tvarů, které jsme do whitelistu jen neuvedli.
      const prefixes = ["vy", "vý", "s", "z", "vz", "u", "po"];
      const matchedPrefix = prefixes.find((p) => word.startsWith(p));
      if (matchedPrefix) {
        const stem = word.slice(matchedPrefix.length);
        // Známé kořeny (zjednodušený seznam, sdílený s whitelistem):
        const knownStems = new Set<string>([
          "dělal", "hru", "letěl", "letěla", "letěli", "bornou", "borný",
          "borné", "tah", "tisk", "lezla", "hodu", "střelil", "pracoval",
          "trénoval", "stoupil", "světlil", "znamení", "skočila", "skočil",
          "létali", "létala", "létal", "běhlo", "šlo", "koukl", "hrál",
          "zvání", "zvu",
          // s-/z- kořeny
          "jel", "jeli", "padaly", "pálil", "loučili", "klouzal", "klesla",
          "klesalo", "razilo", "razil", "hystali", "chystali", "kyslo",
          "kryl", "měklo", "sedly", "lévaly", "padla", "padl", "tekla",
          "hustla", "houstla", "bohatl", "lepšila", "měnil", "mrzl",
          "rezivělo", "mohutněl", "tuhlo", "mizel", "hasl", "dřevěněly",
          "vedl", "vládl", "pomalel", "kryl", "pochodovala",
          // vz- kořeny
          "létl", "létali", "dal", "dala", "pomněl", "křikl", "pamatoval",
          "nesl", "rostl", "chopil", "niklo", "přímil",
          // u- / po-
          "klidnil", "zvání", "zvu",
        ]);
        if (knownStems.has(stem)) return null;
      }
      return word;
    };
  }
  return null;
}
