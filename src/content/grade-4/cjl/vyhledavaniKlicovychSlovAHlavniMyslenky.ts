import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL_L1: QA[] = [
  { q: "Co jsou klíčová slova?", a: "Nejdůležitější pojmy, které vystihují téma textu", opts: ["Nejdůležitější pojmy, které vystihují téma textu", "Všechna podstatná jména v textu", "Slova s diakritikou", "Nejdelší slova v textu"] },
  { q: "Proč klíčová slova bývají opakována v textu?", a: "Protože jsou pro téma nejdůležitější", opts: ["Protože jsou pro téma nejdůležitější", "Protože autor zapomněl napsat jiná slova", "Protože rýmují se", "Protože jsou nejkratší"] },
  { q: "Jaká je technika rychlého hledání informací v textu?", a: "Přeletíme text očima a hledáme klíčová slova", opts: ["Přeletíme text očima a hledáme klíčová slova", "Čteme každé slovo od začátku", "Čteme jen poslední větu", "Přečteme text pozpátku"] },
  { q: "Co nám pomáhá najít klíčové slovo?", a: "Opakování slova, tučné písmo, nadpis, první věta odstavce", opts: ["Opakování slova, tučné písmo, nadpis, první věta odstavce", "Nejkratší slova", "Slova v závorce", "Slova na konci vět"] },
  { q: "Jak najdeme hlavní myšlenku textu?", a: "Ptáme se: O čem celý text je? Co chce autor říct?", opts: ["Ptáme se: O čem celý text je? Co chce autor říct?", "Přečteme jen první větu", "Spočítáme odstavce", "Hledáme nejdelší větu"] },
  { q: "Co je téma textu?", a: "O čem text pojednává (slůvko nebo krátká fráze)", opts: ["O čem text pojednává (slůvko nebo krátká fráze)", "Co chce autor říct", "Pocit z textu", "Délka textu"] },
  { q: "Jaký je rozdíl mezi tématem a hlavní myšlenkou?", a: "Téma = o čem; hlavní myšlenka = co se o tom říká", opts: ["Téma = o čem; hlavní myšlenka = co se o tom říká", "Jsou to stejné věci", "Téma je delší než hlavní myšlenka", "Hlavní myšlenka je vždy v závorce"] },
  { q: "V textu o deštném pralese: Jaká slova jsou klíčová?", a: "prales, tropický, biodiverzita, kácení, ohrožení", opts: ["prales, tropický, biodiverzita, kácení, ohrožení", "zelený, velký, krásný, hezký", "pondělí, středa, pátek", "stůl, okno, dveře, zdi"] },
  { q: "Při vyhledávání informací v textu nejprve:", a: "přelétneme text očima a hledáme klíčové slovo", opts: ["přelétneme text očima a hledáme klíčové slovo", "čteme vše od začátku do konce", "přečteme jen titulky", "hledáme závorky"] },
  { q: "Co je první věta odstavce?", a: "Témata věta (topic sentence) — říká, o čem odstavec je", opts: ["Témata věta (topic sentence) — říká, o čem odstavec je", "Nejkratší věta odstavce", "Závěrečná věta odstavce", "Vždy tázací věta"] },
  { q: "Tučné písmo v textu signalizuje:", a: "Důležité klíčové pojmy", opts: ["Důležité klíčové pojmy", "Okrajové informace", "Záporné informace", "Autorovy komentáře"] },
  { q: "Co jsou podnadpisy v textu?", a: "Menší nadpisy, které označují jednotlivé části textu", opts: ["Menší nadpisy, které označují jednotlivé části textu", "Klíčová slova", "Závěry odstavců", "Citace z jiných textů"] },
  { q: "Jak použít nadpis pro nalezení hlavní myšlenky?", a: "Nadpis zpravidla naznačuje téma nebo hlavní myšlenku", opts: ["Nadpis zpravidla naznačuje téma nebo hlavní myšlenku", "Nadpis je vždy okrajová informace", "Nadpis neodpovídá obsahu", "Nadpis je jen dekorace"] },
  { q: "Při rychlém prohlížení textu (scanning) hledáme:", a: "konkrétní slovo nebo informaci — ignorujeme zbytek", opts: ["konkrétní slovo nebo informaci — ignorujeme zbytek", "celkový dojem z textu", "chyby pravopisu", "délku vět"] },
  { q: "Při letmém prohlížení textu (skimming) získáváme:", a: "celkový přehled o tématu a struktuře textu", opts: ["celkový přehled o tématu a struktuře textu", "každý detail textu", "přesný přepis textu", "pravopisné chyby"] },
  { q: "Příklad klíčového slova v textu o klimatické změně:", a: "oteplování, emise, skleníkový efekt, sucho", opts: ["oteplování, emise, skleníkový efekt, sucho", "stůl, okno, zahrada, auto", "pondělí, ráno, večer, poledne", "červený, modrý, zelený, žlutý"] },
];

const POOL_L2: QA[] = [
  { q: "Jak z textu vytáhneme hlavní myšlenku?", a: "Pátráme po nejdůležitějším sdělení celého textu jednou větou", opts: ["Pátráme po nejdůležitějším sdělení celého textu jednou větou", "Vybereme první větu každého odstavce", "Spojíme všechny klíčové slova", "Zkopírujeme závěrečnou větu"] },
  { q: "V textu: 'Ledovce tají. Hladina moří stoupá. Pobřežní města jsou ohrožena.' — jaká je hlavní myšlenka?", a: "Klimatická změna ohrožuje pobřežní oblasti.", opts: ["Klimatická změna ohrožuje pobřežní oblasti.", "Ledovce jsou krásné.", "Moře jsou velká.", "Města jsou na pobřeží."] },
  { q: "Strategie vyhledávání informací: Jak najdeme v encyklopedii heslo 'sopka'?", a: "Jdeme na písmeno S a hledáme abecedně 'sopka'", opts: ["Jdeme na písmeno S a hledáme abecedně 'sopka'", "Čteme celou encyklopedii", "Hledáme na konci knihy", "Otevřeme náhodnou stránku"] },
  { q: "Klíčová slova v textu bývají:", a: "opakována, zvýrazněna nebo v nadpisech", opts: ["opakována, zvýrazněna nebo v nadpisech", "v závorce nebo psána kurzívou", "vždy v první větě textu", "vždy nejkratší slova"] },
  { q: "Jak vytvoříme myšlenkovou mapu textu?", a: "Hlavní téma uprostřed + klíčová slova v paprscích", opts: ["Hlavní téma uprostřed + klíčová slova v paprscích", "Napíšeme text celý znovu", "Seřadíme věty abecedně", "Vypíšeme jen slovesa"] },
  { q: "Přečteme rychle nadpisy a první věty odstavců. To nám dá:", a: "celkový přehled o obsahu textu", opts: ["celkový přehled o obsahu textu", "detailní znalost každé věty", "přesnou odpověď na každou otázku", "seznam klíčových slov"] },
  { q: "Vyhledávání klíčového slova 'fotosyntéza' v učebnici — nejrychlejší metoda:", a: "Použít rejstřík (index) na konci knihy", opts: ["Použít rejstřík (index) na konci knihy", "Číst celou učebnici od začátku", "Hledat jen v obrázcích", "Přečíst jen tituly kapitol"] },
  { q: "Hlavní myšlenka textu je:", a: "sdělení, které platí pro celý text a ne jen pro jeden odstavec", opts: ["sdělení, které platí pro celý text a ne jen pro jeden odstavec", "první věta textu", "nadpis textu", "nejdelší věta textu"] },
  { q: "Proč je rychlé vyhledávání (scanning) užitečné?", a: "Ušetříme čas — hledáme jen konkrétní informaci", opts: ["Ušetříme čas — hledáme jen konkrétní informaci", "Přečteme text důkladněji", "Lépe porozumíme textu", "Zapamatujeme si více"] },
  { q: "Jak z klíčových slov odhadneme téma textu?", a: "Klíčová slova vystihují hlavní oblast — propojíme je", opts: ["Klíčová slova vystihují hlavní oblast — propojíme je", "Klíčová slova jsou základ pro překlad textu", "Klíčová slova jsou vždy přídavná jména", "Klíčová slova jsou vždy verba"] },
  { q: "Text: 'Včely, opylení, med, úl, kvetoucí louky.' — jaké je pravděpodobné téma?", a: "Včely a jejich role v přírodě", opts: ["Včely a jejich role v přírodě", "Výroba medu v továrně", "Zahradnictví a pěstování rostlin", "Meteorologie a počasí"] },
  { q: "Co je 'rejstřík' v knize?", a: "Abecední seznam pojmů s čísly stran, kde jsou v knize", opts: ["Abecední seznam pojmů s čísly stran, kde jsou v knize", "Obsah kapitol na začátku", "Seznam ilustrací", "Bibliografie"] },
  { q: "Proč je schopnost vyhledávat klíčová slova důležitá?", a: "Pomáhá rychle najít potřebné informace v textu i v knihovně", opts: ["Pomáhá rychle najít potřebné informace v textu i v knihovně", "Pomáhá psát básně", "Pomáhá číst rychleji bez porozumění", "Pomáhá memorovat celé texty"] },
  { q: "Klíčové slovo vs. téma: Klíčové slovo je:", a: "konkrétní výraz; téma je obecnější označení oblasti", opts: ["konkrétní výraz; téma je obecnější označení oblasti", "stejná věc jako téma", "vždy sloveso", "vždy celá věta"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Klíčová slova = opakují se, jsou tučně, jsou v nadpisech",
      "Hlavní myšlenka = O čem je text? Co chce autor říct? — shrnutí jednou větou",
      "Vyhledávání: scanning = konkrétní info; skimming = celkový přehled",
    ],
    solutionSteps: [
      "Přelétni text a najdi opakující se nebo zvýrazněná slova → klíčová slova.",
      "Ptej se: O čem je celý text? → téma.",
      "Ptej se: Co chce autor říct? → hlavní myšlenka.",
    ],
  }));
}

export const VYHLEDAVANIKLICOVYCHSLOVAHLAVNIMYSLENKY: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky",
    title: "Vyhledávání klíčových slov a hlavní myšlenky",
    studentTitle: "Klíčová slova a myšlenka",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se rychle najít klíčová slova a hlavní myšlenku textu.",
    keywords: ["klíčové slovo", "hlavní myšlenka", "téma", "vyhledávání", "skimming", "scanning", "rejstřík"],
    goals: [
      "Vyhledat klíčová slova v textu",
      "Určit hlavní myšlenku textu",
      "Použít techniky rychlého vyhledávání informací",
    ],
    boundaries: ["Bez pokročilé analýzy argumentů", "Bez textů nad úroveň 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová slova = opakují se nebo jsou tučně; hlavní myšlenka = co chce autor říct (shrnutí celého textu)",
      steps: [
        "Přelétni text a hledej opakující se nebo zvýrazněná slova → klíčová slova.",
        "Přečti nadpis a první větu každého odstavce.",
        "Ptej se: O čem je celý text? Co tím autor říká?",
        "Shrň hlavní myšlenku jednou větou.",
      ],
      commonMistake: "Záměna tématu a hlavní myšlenky: téma = 'sloni'; hlavní myšlenka = 'Sloni jsou ohroženi vyhynutím.'",
      example: "Klíčová slova v textu o lesích: 'kácení, les, biodiverzita, ohrožení'; hlavní myšlenka: 'Kácení lesů ohrožuje biodiverzitu.'",
    },
  },
];
