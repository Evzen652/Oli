import { describe, it, expect } from "vitest";
import { checkHintLeakage } from "../../supabase/functions/_shared/hintLeakage";

/**
 * Hint leakage detector — kontroluje, jestli hinty NEPROZRAZUJí odpověď.
 *
 * Pedagogický princip: hint má NAVÉST k myšlení, ne dát výsledek.
 * Tady testujeme jak server-side validátor (curriculum wizard generuje
 * hinty + tato fn je validuje) tak runtime guard při AI-generated hint.
 */

describe("checkHintLeakage — žádné hinty", () => {
  it("task bez hints → ok", () => {
    const r = checkHintLeakage({
      question: "Kolik je 2+2?",
      correct_answer: "4",
    });
    expect(r.ok).toBe(true);
  });

  it("task s prázdným hints array → ok", () => {
    const r = checkHintLeakage({
      question: "Kolik je 2+2?",
      correct_answer: "4",
      hints: [],
    });
    expect(r.ok).toBe(true);
  });

  it("task bez correct_answer → ok (nelze leakovat)", () => {
    const r = checkHintLeakage({
      question: "Q",
      correct_answer: "",
      hints: ["Něco s 4"],
    });
    expect(r.ok).toBe(true);
  });
});

describe("checkHintLeakage — number leak detection", () => {
  it("hint obsahuje literál číselné odpovědi → leak", () => {
    const r = checkHintLeakage({
      question: "Kolik je 12 × 3?",
      correct_answer: "36",
      hints: ["Spočítej 12 × 3 = 36"],
    });
    expect(r.ok).toBe(false);
    expect(r.leakingFragment).toBe("36");
  });

  it("hint zmíní odpověď bez '=' → stále leak", () => {
    const r = checkHintLeakage({
      question: "Kolik je 12 × 3?",
      correct_answer: "36",
      hints: ["Pamatuj si, že je to 36."],
    });
    expect(r.ok).toBe(false);
  });

  it("hint zmiňuje JINÉ číslo (analogie) → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Kolik je 12 × 3?",
      correct_answer: "36",
      hints: ["Třeba 4 × 5 = 20 — to je jen příklad."],
    });
    expect(r.ok).toBe(true);
  });

  it("hint má číslo, které je SOUČÁSTÍ většího (word boundary)", () => {
    const r = checkHintLeakage({
      question: "Kolik je 5 × 7?",
      correct_answer: "35",
      hints: ["Hodnoty od 35000 jsou velké."],
    });
    // 35 je v 35000 → ne-leak (number boundary)
    expect(r.ok).toBe(true);
  });
});

describe("checkHintLeakage — číslo + jednotka (odpověď typu '24 hodin')", () => {
  it("hint zmíní jen jednotku, ne číslo → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Kolik hodin má celý den?",
      correct_answer: "24 hodin",
      hints: ["Spočítej hodiny ve dne a v noci a sečti je."],
    });
    // "hodin" je jen jednotka; informační jádro (24) není v hintu → ne-leak
    expect(r.ok).toBe(true);
  });

  it("hint prozradí číselné jádro odpovědi → leak", () => {
    const r = checkHintLeakage({
      question: "Kolik hodin má celý den?",
      correct_answer: "24 hodin",
      hints: ["Je to 24 dohromady."],
    });
    expect(r.ok).toBe(false);
    expect(r.leakingFragment).toBe("24");
  });

  it("porovnávací úloha: číselné jádro je v otázce → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Která úsečka je delší: 2 cm nebo 11 cm?",
      correct_answer: "11 cm",
      hints: ["Srovnej čísla: 2 a 11 — které je větší?"],
    });
    // "11" je přímo v zadání, hint ho jen opakuje jako porovnávané číslo
    expect(r.ok).toBe(true);
  });

  it("číslo jako součást většího čísla u odpovědi s jednotkou → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Kolik minut trvá?",
      correct_answer: "5 minut",
      hints: ["Hodnoty kolem 500 jsou velké."],
    });
    // 5 uvnitř 500 → number boundary → ne-leak
    expect(r.ok).toBe(true);
  });
});

describe("checkHintLeakage — slovo už obsažené v otázce", () => {
  it("hint zopakuje slovo, které je i v otázce → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Čím je pokryté ptačí peří?",
      correct_answer: "peří",
      hints: ["Zamysli se, co má pták místo srsti — peří."],
    });
    // "peří" je už ve znění otázky, hint nepřidává novou informaci → ne-leak
    expect(r.ok).toBe(true);
  });

  it("stejné slovo v hintu, ale NENÍ v otázce → leak (zpětná kompatibilita)", () => {
    const r = checkHintLeakage({
      question: "Čím je pokryté tělo ptáka?",
      correct_answer: "peří",
      hints: ["Je to peří."],
    });
    expect(r.ok).toBe(false);
  });

  it("víceslovná odpověď: obě slova v otázce → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Slaví se oba svátky ve stejný den?",
      correct_answer: "oba svátky",
      hints: ["Porovnej oba svátky v kalendáři."],
    });
    expect(r.ok).toBe(true);
  });

  it("víceslovná odpověď: slovo mimo otázku stále prozradí → leak", () => {
    const r = checkHintLeakage({
      question: "Jaký je to slovní druh?",
      correct_answer: "podstatné jméno",
      hints: ["Je to podstatné jméno."],
    });
    expect(r.ok).toBe(false);
  });

  it("víceslovná odpověď: jen ČÁST v otázce, hint prozradí zbytek fráze → leak", () => {
    // Regrese: „textu" je v otázce, ale hint dává celou strukturu „plán textu…"
    // — filtr otázky nesmí tento reálný leak zamaskovat.
    const r = checkHintLeakage({
      question: "Co je osnova vlastního textu?",
      correct_answer: "Plán textu: úvod, zápletka, vyvrcholení, závěr",
      hints: ["Osnova = plán textu (úvod, zápletka, vyvrcholení, závěr)"],
    });
    expect(r.ok).toBe(false);
  });
});

describe("checkHintLeakage — equality pattern", () => {
  it("hint se vzorcem '= 36' → leak", () => {
    const r = checkHintLeakage({
      question: "12 × 3?",
      correct_answer: "36",
      hints: ["x = 36"],
    });
    expect(r.ok).toBe(false);
  });
});

describe("checkHintLeakage — text answer (multi-token)", () => {
  it("hint obsahuje celou textovou odpověď → leak", () => {
    const r = checkHintLeakage({
      question: "Jaký slovní druh je 'pes'?",
      correct_answer: "podstatné jméno",
      hints: ["Je to podstatné jméno."],
    });
    expect(r.ok).toBe(false);
  });

  it("hint obsahuje pouze 1 funkční slovo z odpovědi → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Q",
      correct_answer: "podstatné jméno",
      hints: ["Slovo je."],
    });
    // "je" je HINT_NEUTRAL_WORD — ne-leak
    expect(r.ok).toBe(true);
  });

  it("hint navádějící otázkou (žádné slovo z odpovědi) → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Q",
      correct_answer: "podstatné jméno",
      hints: ["Co se ptáš? Kdo? Co?"],
    });
    expect(r.ok).toBe(true);
  });

  it("hint obsahuje 1 významové slovo (4+ chars) z 2-tokenové odpovědi → leak", () => {
    const r = checkHintLeakage({
      question: "Q",
      correct_answer: "mužský rod",
      hints: ["Je to mužský prvek."],
    });
    expect(r.ok).toBe(false);
    expect(r.leakingFragment).toBe("mužský");
  });
});

describe("checkHintLeakage — fraction answer", () => {
  it("hint obsahuje doslovný zlomek → leak", () => {
    const r = checkHintLeakage({
      question: "Kolik je polovina jablka?",
      correct_answer: "1/2",
      hints: ["Tedy 1/2 jablka."],
    });
    expect(r.ok).toBe(false);
  });

  it("hint zmiňuje jiný zlomek → ne-leak", () => {
    const r = checkHintLeakage({
      question: "?",
      correct_answer: "1/2",
      hints: ["Třeba 3/4 je víc než půlka."],
    });
    expect(r.ok).toBe(true);
  });
});

describe("checkHintLeakage — multi-hint, jen první leak hlášený", () => {
  it("několik hintů, pouze 1 leakuje → vrátí index a fragment", () => {
    const r = checkHintLeakage({
      question: "?",
      correct_answer: "36",
      hints: [
        "Začni odhad.",
        "Spočti přesně. Tedy 36.",
        "Třetí hint.",
      ],
    });
    expect(r.ok).toBe(false);
    expect(r.leakingHintIndex).toBe(1);
  });
});

describe("checkHintLeakage — robustness", () => {
  it("non-string hint v array (e.g. null, number) je přeskočen, ne crash", () => {
    const r = checkHintLeakage({
      question: "?",
      correct_answer: "5",
      hints: [null as unknown as string, undefined as unknown as string, "OK hint"],
    });
    expect(r.ok).toBe(true);
  });

  it("prázdný string hint je přeskočen", () => {
    const r = checkHintLeakage({
      question: "?",
      correct_answer: "5",
      hints: ["", "  ", "OK"],
    });
    expect(r.ok).toBe(true);
  });
});

// ─── Rejstříkové nápovědy (vyjmenování možností) ─────────────────────────
// Regrese k nálezu 2026-08-25: detektor dostával jen question/answer/hints,
// nikdy `options`, takže hlásil jako leak každý katalog pravidel. Šlo o
// stovky případů — a přepsat je by znamenalo zakázat rejstřík pravidel,
// tedy přesně tu nápovědu, kterou norma chce (CONTENT_AUTHORING.md §7.2).
describe("checkHintLeakage — rejstřík možností", () => {
  const PREFIX_HINTS = [
    "vy- = dokončení děje nebo pohyb ven (vyletět, vypracovat)",
    "vý- = přízvučná první slabika (výhra, výborný, výtah)",
    "s- = pohyb dolů nebo sloučení (sjet, spalit)",
    "z- = změna stavu (ztuhnout, zbohatnout, zlepšit)",
  ];

  it("sada vyjmenovává VŠECHNY možnosti → není leak", () => {
    const r = checkHintLeakage({
      question: 'Doplň správnou předponu: "Kluk ___koukl z okna."',
      correct_answer: "vy-",
      hints: PREFIX_HINTS,
      options: ["vy-", "vý-", "s-", "z-"],
    });
    expect(r.ok).toBe(true);
  });

  it("bez `options` se stejná sada pořád hlásí (options jsou nutný vstup)", () => {
    const r = checkHintLeakage({
      question: 'Doplň správnou předponu: "Kluk ___koukl z okna."',
      correct_answer: "vy-",
      hints: PREFIX_HINTS,
    });
    expect(r.ok).toBe(false);
  });

  // Past, do které spadla první verze pravidla: stačilo, aby sada zavadila
  // o JEDEN distraktor, a umlčela se i nápověda, která odpověď říká rovnou.
  it("zmínka jediného distraktoru NEstačí — odpověď řečená rovnou je leak", () => {
    const r = checkHintLeakage({
      question: "Které krajské město je čtvrté největší v ČR?",
      correct_answer: "Plzeň",
      hints: [
        "Toto město je krajským městem Plzeňského kraje.",
        "Leží dál na západ než Karlovy Vary.",
      ],
      options: ["Plzeň", "Karlovy Vary", "České Budějovice", "Liberec"],
    });
    expect(r.ok).toBe(false);
  });

  // Druhá past: číselná řada přirozeně obsahuje distraktory, ale končí
  // odpovědí — dítěti stačí přečíst poslední člen.
  it("číselná odpověď: rejstřík NEPLATÍ, řada končící odpovědí je leak", () => {
    const r = checkHintLeakage({
      question: "3 × 8 = ?",
      correct_answer: "24",
      hints: ["Počítej po 3: 3, 6, 9, 12, 15, 18, 21, 24."],
      options: ["22", "24", "27", "21"],
    });
    expect(r.ok).toBe(false);
  });

  // Práh: dva zmíněné distraktory stačí. Úplný výčet vyžadovat nejde —
  // mezi možnostmi bývá vymyšlený distraktor, který v katalogu pravidel
  // nemá co dělat („neurčitý" čas mezi minulý/přítomný/budoucí).
  it("rejstřík zmiňující 2 ze 3 distraktorů → není leak", () => {
    const r = checkHintLeakage({
      question: "Jaký čas má sloveso 'čtu'?",
      correct_answer: "přítomný",
      hints: [
        "Osoba: 1. já/my, 2. ty/vy, 3. on/ona/ono/oni/ony",
        "Čas: minulý (byl), přítomný (je), budoucí (bude)",
      ],
      options: ["neurčitý", "minulý", "přítomný", "budoucí"],
    });
    expect(r.ok).toBe(true);
  });

  // Závorky v zadání rozbíjely výjimku „slovo už je v otázce": token vycházel
  // jako „zbytek)" a neshodl se. Přitom „zbytek" je jen tvar odpovědi
  // („2 zbytek 0"), ne její hodnota — dítě se z něj nedozví ani podíl.
  it("slovo z odpovědi je v otázce v závorce → není leak", () => {
    const r = checkHintLeakage({
      question: "8 ÷ 4 = ? (může být zbytek)",
      correct_answer: "2 zbytek 0",
      hints: [
        "Hledej největší násobek 4, který se vejde do 8.",
        "Spočítej kolik celých násobků 4 se vejde, pak odečti od 8 — co zbyde je zbytek.",
      ],
    });
    expect(r.ok).toBe(true);
  });

  it("číselná odpověď už ve znění otázky → není leak", () => {
    const r = checkHintLeakage({
      question: "Které číslo je největší: 50, 15, 51?",
      correct_answer: "51",
      hints: ["Obě 50 a 51 mají 5 desítek — srovnej jedničky."],
      options: ["15", "50", "51"],
    });
    expect(r.ok).toBe(true);
  });
});
