/**
 * Hint leakage detector — kontroluje, zda nápověda neprozrazuje odpověď.
 *
 * Pedagogický princip: nápověda má NAVÉST k myšlení, ne dát řešení.
 *   ❌ ŠPATNĚ: "Spočítej 12 × 3 = 36" pro úlohu kde odpověď je 36
 *   ✅ DOBŘE: "Vzpomeň si na násobení desítkami"
 *
 * Strategie (pure heuristic, žádné AI volání):
 *   1) Hledá literální výskyt odpovědi v hintu
 *   2) Hledá obratu které "říkají odpověď" jiným způsobem
 *   3) Pro multi-token answers ignoruje běžná slovíčka (např. "ano/ne")
 *
 * Vrací rejected hints, které je nutno regenerovat.
 */

export interface HintLeakageResult {
  ok: boolean;
  reason?: string;
  /** Index leakující nápovědy (0-based) */
  leakingHintIndex?: number;
  /** Konkrétní substring který v hintu prozrazuje odpověď */
  leakingFragment?: string;
}

/**
 * Slova, která jsou v hintu OK i když jsou v odpovědi
 * (jen krátké funkční prvky, ne věcný obsah).
 */
const HINT_NEUTRAL_WORDS = new Set([
  "a", "i", "u", "v", "o", "k", "s", "z",
  "je", "se", "si", "ne", "to", "ta", "ty", "ten", "ta",
  "ano", "ne", "také", "taky",
  "číslo", "čísla", "výsledek", "odpověď",
  "rovnice", "vzorec", "úloha",
  "například",
]);

/**
 * Normalizace pro porovnávání: lowercase, odstraň interpunkci, mezery.
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    // Závorky patří mezi interpunkci — bez nich vznikaly tokeny jako
    // „zbytek)" ze zadání „8 ÷ 4 = ? (může být zbytek)", které se pak
    // neshodly se slovem „zbytek" v nápovědě, a výjimka „slovo už je
    // v otázce" nezabrala. Hlásilo se to jako leak, přestože „zbytek"
    // je jen tvar odpovědi („2 zbytek 0"), ne její hodnota.
    // Čárka mezi číslicemi je desetinná — česká čísla („0,9") se jinak
    // rozpadnou na „0 9" a žádná číselná větev je pak nepozná.
    .replace(/(?<!\d),(?!\d)/g, " ")
    .replace(/[.;:!?"'„"()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Vrátí true pokud hint obsahuje doslovné znění odpovědi.
 * - Pro číselné odpovědi: literál číslo (s pamětí na "5" vs "15")
 * - Pro textové: lowercase substring match s word boundaries
 */
function hintContainsAnswer(
  hint: string,
  answer: string,
  questionTokens: ReadonlySet<string> = new Set(),
): { leaks: boolean; fragment?: string } {
  const normHint = normalize(hint);
  const normAnswer = normalize(answer);

  if (!normAnswer) return { leaks: false };

  // Pure number/fraction answer
  if (/^-?\d+(?:[.,]\d+)?$/.test(normAnswer)) {
    // Když je odpověď už ve znění otázky (typicky výběr z vypsaných čísel,
    // „Které číslo je největší: 50, 15, 51?"), hint ji jen zopakuje —
    // dítě ji čte přímo v zadání. Stejná výjimka, jakou má větev
    // číslo+jednotka níž; tady chyběla.
    if (questionTokens.has(normAnswer)) return { leaks: false };
    // Hledej s word boundary (aby "5" nematchovalo v "15")
    const numberPattern = new RegExp(`(^|[^\\d.,])${normAnswer.replace(".", "\\.")}([^\\d.,]|$)`);
    if (numberPattern.test(normHint)) {
      return { leaks: true, fragment: normAnswer };
    }
    return { leaks: false };
  }

  // Fraction answer "3/8"
  if (/^-?\d+\/\d+$/.test(normAnswer)) {
    if (normHint.includes(normAnswer)) {
      return { leaks: true, fragment: normAnswer };
    }
    return { leaks: false };
  }

  // Číslo + jednotka (např. "24 hodin", "60 minut", "5 metrů") — informační
  // jádro je číslo, jednotka je běžné slovo, které hint smí zmínit (navádí,
  // neprozrazuje). Testuj proto jen číselnou část s word boundary.
  // Jednotka smí obsahovat i lomítko a exponent („g/cm³", „m/s", „cm²") —
  // bez nich propadaly fyzikální odpovědi do textové větve a hlásilo se jako
  // leak, že nápověda zmínila JEDNOTKU, ne hodnotu.
  const numUnit = normAnswer.match(/^(-?\d+(?:[.,]\d+)?)\s+\p{L}[\p{L}\s/²³°]*$/u);
  if (numUnit) {
    const num = numUnit[1];
    // Když je číselné jádro už ve znění otázky (typicky porovnávací úlohy
    // „2 cm nebo 11 cm?"), hint ho jen zopakuje — neprozrazuje nic navíc.
    if (questionTokens.has(num)) return { leaks: false };
    const numberPattern = new RegExp(`(^|[^\\d.,])${num.replace(".", "\\.")}([^\\d.,]|$)`);
    if (numberPattern.test(normHint)) {
      return { leaks: true, fragment: num };
    }
    return { leaks: false };
  }

  // Text answer — split na slova a hledej významová.
  // POZOR: slova z otázky NEFILTRUJEME z answerTokens předem — u víceslovných
  // odpovědí by to rozbilo prozrazující frázi (např. „textu" z otázky by
  // rozbilo dvojici „plán textu", i když hint prozrazuje celou strukturu).
  // Slovo/dvojici z otázky přeskočíme až v rozhodovacím kroku níže.
  const answerTokens = normAnswer
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !HINT_NEUTRAL_WORDS.has(t));

  if (answerTokens.length === 0) return { leaks: false };

  // Pro krátké odpovědi (1-2 významová slova) hledej kompletní match
  if (answerTokens.length <= 2) {
    // Celá odpověď v hintu — leak, ledaže je celá jen převzatá ze zadání otázky
    if (normHint.includes(normAnswer) && !answerTokens.every((t) => questionTokens.has(t))) {
      return { leaks: true, fragment: normAnswer };
    }
    // Nebo hledej alespoň jedno významové slovo (≥4 znaky), které NENÍ v otázce
    for (const tok of answerTokens) {
      if (tok.length >= 4 && !questionTokens.has(tok)) {
        const escapedTok = tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = new RegExp(`(^|[\\s])${escapedTok}([\\s]|$)`);
        if (pattern.test(normHint)) {
          return { leaks: true, fragment: tok };
        }
      }
    }
    return { leaks: false };
  }

  // Pro delší odpovědi (3+ slov) hledej alespoň 2 spolu jdoucí významová slova.
  // Dvojici přeskočíme jen tehdy, jsou-li OBA tokeny už ve znění otázky.
  for (let i = 0; i < answerTokens.length - 1; i++) {
    const a = answerTokens[i];
    const b = answerTokens[i + 1];
    if (questionTokens.has(a) && questionTokens.has(b)) continue;
    const phrase = `${a} ${b}`;
    if (normHint.includes(phrase)) {
      return { leaks: true, fragment: phrase };
    }
  }
  return { leaks: false };
}

/**
 * Zmiňuje hint daný text (možnost) doslova? Bez filtrování slov z otázky —
 * pro detekci rejstříku nás zajímá holý výskyt.
 */
function hintMentions(normHint: string, option: string): boolean {
  const norm = normalize(option);
  if (norm.length < 2) return false;

  // Čistě číselná možnost — word boundary, ať "5" nematchuje uvnitř "15".
  if (/^-?\d+(?:[.,]\d+)?$/.test(norm)) {
    return new RegExp(`(^|[^\\d.,])${norm.replace(".", "\\.")}([^\\d.,]|$)`).test(normHint);
  }

  const escaped = norm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Hranice: začátek/konec nebo nealfanumerický znak. Pomlčka u předpon
  // („vy-") je součástí tokenu, proto se nesmí brát jako hranice zprava.
  return new RegExp(`(^|[\\s(,;])${escaped}([\\s),;.:=]|$)`).test(normHint);
}

/**
 * REJSTŘÍKOVÉ PRAVIDLO — nápověda, která vyjmenovává možnosti, neprozrazuje.
 *
 * Spousta témat dává jako nápovědu katalog pravidel pro VŠECHNY možnosti:
 *
 *   Q: Doplň předponu: „___dělal jsem úkol."   A: „vy-"
 *   H1: vy- = dokončení děje nebo pohyb ven
 *   H2: vý- = přízvučná první slabika
 *   H3: s- = pohyb dolů …
 *
 * Odpověď v takové nápovědě nutně je — ale jsou tam i všechny ostatní, takže
 * dítěti neřekne, kterou zvolit; pořád musí použít pravidlo. Zakázat to by
 * znamenalo zakázat rejstřík pravidel, což je přesně ta nápověda, kterou
 * norma chce (viz CONTENT_AUTHORING.md §7.2 „obecné pravidlo NENÍ leak").
 *
 * Rozhoduje se nad CELOU sadou nápověd, ne nad jednou: dítě je vidí postupně
 * všechny, takže katalog rozprostřený přes H1..H5 je pořád katalog.
 *
 * NEPLATÍ PRO ČÍSELNÉ ODPOVĚDI — a je to podstatné. U násobilky vypadá
 * nápověda takhle:
 *
 *   Q: 3 × 8 = ?   A: 24   Možnosti: 22 | 24 | 27 | 21
 *   H1: Počítej po 3: 3, 6, 9, 12, 15, 18, 21, 24.
 *
 * Řada končí odpovědí, takže dítěti stačí přečíst poslední číslo — to je
 * skutečný leak. Že řada cestou obsahuje i distraktor (21), je náhoda
 * číselné posloupnosti, ne vyjmenování možností. Rejstřík proto povolujeme
 * jen u nečíselných odpovědí (pojmy, grafémy, tvary).
 *
 * Vyžadujeme, aby sada zmiňovala VŠECHNY možnosti, ne jen jednu navíc.
 * Volnější varianta („zmiňuje aspoň jeden distraktor") při ověřování umlčela
 * spoustu skutečných leaků, které jen náhodou zavadily o distraktor:
 *
 *   A: „Plzeň"  H1: „Toto město je krajským městem Plzeňského kraje."
 *   A: „Dole"   H2: „Na mapě je jih vždy dole."
 *
 * Obě odpověď říkají rovnou; že jinde padlo „Karlovy Vary" nebo „nahoře",
 * z nich rejstřík nedělá. Až úplný výčet znamená, že si dítě pořád musí
 * vybrat samo.
 *
 * Kompromis i tak zůstává: nechytí konstrukci „není to Kolmice, je to
 * Rovnoběžky". Kontrola rovnosti (`hintShowsEquality`) platí dál.
 */
function hintsEnumerateOptions(
  hints: string[],
  correctAnswer: string,
  options?: string[],
): boolean {
  if (!options || options.length < 2) return false;
  const normCorrect = normalize(correctAnswer);
  // Číselná odpověď → viz komentář výše, rejstřík neplatí.
  if (/^-?\d+(?:[.,]\d+)?$/.test(normCorrect)) return false;
  const others = options.filter((o) => normalize(o) !== normCorrect);
  if (others.length === 0) return false;

  const normHints = hints
    .filter((h) => typeof h === "string" && h.trim())
    .map((h) => normalize(h));

  const mentioned = others.filter((o) => normHints.some((h) => hintMentions(h, o))).length;
  // Práh 2 (u binárních možností všechny): jeden zmíněný distraktor ještě
  // rejstřík nedělá — viz „Plzeň"/„Dole" v komentáři výše. Dva a víc už ano;
  // úplný výčet vyžadovat nejde, protože mezi možnostmi bývá vymyšlený
  // distraktor, který v katalogu pravidel nemá co dělat („neurčitý" čas).
  return mentioned >= Math.min(2, others.length);
}

/**
 * Kontrola, zda hint obsahuje "rovnost s odpovědí" — typický pattern
 * "X = 36" kde 36 je odpověď.
 */
function hintShowsEquality(hint: string, answer: string): boolean {
  const normAnswer = answer.trim().replace(/,/g, ".");
  // U krátkých nečíselných odpovědí (grafémy, předložky) je test rovnosti
  // nesmyslný: v nápovědě „z/ze = pohyb z vnitřku (ze školy = z vnitřku)"
  // se „= z" trefí do výkladového příkladu, ne do prozrazení odpovědi „z".
  if (!/^-?\d/.test(normAnswer) && normAnswer.length < 3) return false;
  const escapedAnswer = normAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Hledej "= 36" nebo "= 36." apod.
  const patterns = [
    new RegExp(`=\\s*${escapedAnswer}(?:\\s|$|\\.|,)`),
  ];
  return patterns.some((p) => p.test(hint));
}

/**
 * Hlavní API: zkontroluj všechny hinty pro 1 úlohu.
 */
export function checkHintLeakage(task: {
  question: string;
  correct_answer: string;
  hints?: string[];
  /** Možnosti u výběrových typů — bez nich nelze poznat rejstříkovou nápovědu. */
  options?: string[];
}): HintLeakageResult {
  if (!task.hints || task.hints.length === 0) return { ok: true };
  if (!task.correct_answer) return { ok: true };

  // Slova ze znění otázky — hint je smí zopakovat, aniž by šlo o leak
  // (dítě je čte přímo v zadání).
  const questionTokens = new Set(
    normalize(task.question || "").split(/\s+/).filter(Boolean),
  );

  // Vyjmenovává sada nápověd i jiné možnosti? Pak výskyt odpovědi neprozrazuje.
  const isCatalogue = hintsEnumerateOptions(task.hints, task.correct_answer, task.options);

  for (let i = 0; i < task.hints.length; i++) {
    const hint = task.hints[i];
    if (typeof hint !== "string" || !hint.trim()) continue;

    // Test 1: Doslovný výskyt odpovědi (neplatí pro rejstřík možností)
    const direct = isCatalogue
      ? { leaks: false as const }
      : hintContainsAnswer(hint, task.correct_answer, questionTokens);
    if (direct.leaks) {
      return {
        ok: false,
        reason: `Hint #${i + 1} obsahuje doslovně odpověď: "${direct.fragment}"`,
        leakingHintIndex: i,
        leakingFragment: direct.fragment,
      };
    }

    // Test 2: Rovnice prozradí (pattern "= X")
    if (hintShowsEquality(hint, task.correct_answer)) {
      return {
        ok: false,
        reason: `Hint #${i + 1} ukazuje rovnost s odpovědí`,
        leakingHintIndex: i,
        leakingFragment: `= ${task.correct_answer}`,
      };
    }
  }

  return { ok: true };
}
