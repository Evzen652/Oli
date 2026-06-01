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
  { q: "Co patří do záhlaví dopisu?", a: "Místo a datum (vpravo nahoře)", opts: ["Místo a datum (vpravo nahoře)", "Oslovení adresáta", "Podpis odesílatele", "Text dopisu"] },
  { q: "Jak oslovíme přítele v dopisu?", a: "Milý Petře,", opts: ["Milý Petře,", "Vážený pane Petře,", "Dobrý den Petře,", "Ahoj Petře:"] },
  { q: "Kde se v dopisu nachází záhlaví?", a: "vpravo nahoře", opts: ["vpravo nahoře", "vlevo nahoře", "uprostřed", "dole pod podpisem"] },
  { q: "Co píšeme v závěru dopisu?", a: "rozloučení a podpis (S pozdravem, Tvůj...)", opts: ["rozloučení a podpis (S pozdravem, Tvůj...)", "datum a místo", "oslovení adresáta", "téma dopisu"] },
  { q: "V soukromém dopise blízkým:", a: "tykáme", opts: ["tykáme", "vykáme s velkým V", "vykáme s malým v", "píšeme jen s velkým V"] },
  { q: "Ve formálním dopise (úřadu, řediteli):", a: "vykáme a píšeme 'Vy' s velkým V", opts: ["vykáme a píšeme 'Vy' s velkým V", "tykáme", "nemusíme oslovovat", "píšeme 'vy' s malým v"] },
  { q: "Jak se píše oslovení v dopisu?", a: "Milá Evo, / Vážený pane řediteli,", opts: ["Milá Evo, / Vážený pane řediteli,", "Milá Evo: / Vážený pane řediteli:", "Milá Evo. / Vážený pane řediteli.", "Milá Evo! / Vážený pane řediteli!"] },
  { q: "Jaký interpunkční znaménko se píše za oslovením v dopisu?", a: "čárka (,)", opts: ["čárka (,)", "tečka (.)", "vykřičník (!)", "dvojtečka (:)"] },
  { q: "Kolik hlavních částí má dopis?", a: "4 (záhlaví, oslovení, text, závěr+podpis)", opts: ["4 (záhlaví, oslovení, text, závěr+podpis)", "2", "3", "5"] },
  { q: "Co tvoří první část textu dopisu?", a: "Pozdrav nebo věc, o které chceme psát", opts: ["Pozdrav nebo věc, o které chceme psát", "Záhlaví s datem", "Oslovení adresáta", "Rozloučení a podpis"] },
  { q: "Adresa příjemce se na obálce píše:", a: "doprostřed nebo vpravo", opts: ["doprostřed nebo vpravo", "vlevo nahoře", "na zadní stranu", "pod poštovní zásilkou"] },
  { q: "Co obsahuje adresa na obálce?", a: "jméno, ulici, město, PSČ", opts: ["jméno, ulici, město, PSČ", "jen jméno a město", "jen PSČ a jméno", "jen telefon a e-mail"] },
  { q: "Jak začíná text po oslovení v dopisu?", a: "odsazeným odstavcem s velkým písmenem", opts: ["odsazeným odstavcem s velkým písmenem", "pokračuje na stejném řádku", "začíná novou stránkou", "začíná číslicí"] },
  { q: "Jaký je rozdíl mezi soukromým a formálním dopisem?", a: "soukromý = tykání, neformální tón; formální = vykání s Vy", opts: ["soukromý = tykání, neformální tón; formální = vykání s Vy", "soukromý = vykání; formální = tykání", "žádný rozdíl", "soukromý nemá záhlaví"] },
  { q: "Příklad správného závěru soukromého dopisu:", a: "Těším se na shledanou! Tvůj Honza", opts: ["Těším se na shledanou! Tvůj Honza", "S pozdravem JUDr. Jan Novák", "S úctou a pozdravem vedení", "Vážený pane, těšíme se na setkání"] },
  { q: "Datum v záhlaví se píše:", a: "V Praze dne 1. 6. 2025 / Praha, 1. 6. 2025", opts: ["V Praze dne 1. 6. 2025 / Praha, 1. 6. 2025", "1/6/2025", "červen 2025", "dne 6. 1."] },
];

const POOL_L2: QA[] = [
  { q: "V dopise kamarádovi napíšeš: 'Těším se, až ...'", a: "tě uvidím (tykáš)", opts: ["tě uvidím (tykáš)", "Vás uvidím (vykáš)", "ho uvidím", "ji uvidím"] },
  { q: "V dopise řediteli školy napíšeš: 'Žádám Vás, abyste ...'", a: "správně — vykáme s velkým V", opts: ["správně — vykáme s velkým V", "nesprávně — tykáme", "správně — ale píšeme 'vás' s malým", "nesprávně — píšeme 'je'"] },
  { q: "Seřaď části dopisu: 1) Text, 2) Záhlaví, 3) Podpis, 4) Oslovení", a: "2 → 4 → 1 → 3", opts: ["2 → 4 → 1 → 3", "1 → 2 → 3 → 4", "4 → 2 → 1 → 3", "2 → 1 → 4 → 3"] },
  { q: "Který text odpovídá správnému záhlaví soukromého dopisu?", a: "Praha, 15. března 2025", opts: ["Praha, 15. března 2025", "Milý Petře,", "S pozdravem Jana", "Chci ti napsat o výletě"] },
  { q: "Příjemcem dopisu je babička. Jak ji oslovíš?", a: "Milá babičko,", opts: ["Milá babičko,", "Vážená paní babičko,", "Dobrý den babičko:", "Ahoj babičko!"] },
  { q: "Co se NESMÍ vynechat v soukromém dopisu?", a: "záhlaví, oslovení, podpis", opts: ["záhlaví, oslovení, podpis", "jen text", "jen podpis", "datum a podpis"] },
  { q: "Jak se správně loučíš v soukromém dopisu kamarádovi?", a: "Tvůj / Tvoje + jméno nebo 'S pozdravem Honza'", opts: ["Tvůj / Tvoje + jméno nebo 'S pozdravem Honza'", "S úctou a pozdravem", "Vyhrazuji si právo neodpovídat", "Yours sincerely"] },
  { q: "Proč se vykání v dopise řediteli píše s velkým V?", a: "znak úcty — velké 'Vy' je zdvořilejší než 'vy'", opts: ["znak úcty — velké 'Vy' je zdvořilejší než 'vy'", "gramatické pravidlo pro všechna zájmena", "protože je to začátek věty", "protože je to vlastní jméno"] },
  { q: "Kamarád ti napsal dopis z tábora. Jak začneš odpověď?", a: "Milý Tome, / Ahoj Tome,", opts: ["Milý Tome, / Ahoj Tome,", "Vážený příteli,", "Dobrý den, pane Tome,", "Zdravím Vás,"] },
  { q: "Dopis s žádostí o přijetí do sportovního kroužku píšeš:", a: "formálně — vykáte, velké V, Vážený pane...", opts: ["formálně — vykáte, velké V, Vážený pane...", "neformálně — tykáte", "jen e-mailem", "bez záhlaví"] },
  { q: "Který text patří do textu (těla) dopisu?", a: "Byl jsem na táboře. Bylo to skvělé...", opts: ["Byl jsem na táboře. Bylo to skvělé...", "Praha, 15. 6. 2025", "Milý Petře,", "Tvůj Honza"] },
  { q: "Dopis příteli vs. dopis učiteli — hlavní rozdíl tónu:", a: "příteli = neformální, uvolněný; učiteli = formální, zdvořilý", opts: ["příteli = neformální, uvolněný; učiteli = formální, zdvořilý", "žádný rozdíl", "příteli = formální; učiteli = neformální", "oba jsou neformální"] },
  { q: "K čemu slouží záhlaví dopisu?", a: "identifikuje místo a čas napsání dopisu", opts: ["identifikuje místo a čas napsání dopisu", "oslovuje adresáta", "shrnuje obsah dopisu", "poskytuje adresu odesílatele"] },
  { q: "Co je oslovení v dopisu?", a: "první řádek textu — kdo je adresát (Milý Petře,)", opts: ["první řádek textu — kdo je adresát (Milý Petře,)", "záhlaví s datem", "závěr dopisu", "podpis odesílatele"] },
  { q: "Jak oslovíš učitelku v dopisu?", a: "Vážená paní učitelko,", opts: ["Vážená paní učitelko,", "Milá paní učitelko,", "Ahoj paní učitelko,", "Dobrý den,"] },
  { q: "Slovo 'Ty' s velkým T v dopisu kamarádovi:", a: "správné — zdvořilejší forma oslovení blízkého", opts: ["správné — zdvořilejší forma oslovení blízkého", "chybné — musí být malé", "chybné — píšeme jen Vy", "jen v dopisech rodičům"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Dopis má 4 části: záhlaví, oslovení, text, závěr+podpis",
      "Záhlaví = místo a datum (vpravo nahoře)",
      "Soukromý dopis = tykáme; formální dopis = vykáme s velkým V",
    ],
    solutionSteps: [
      "Urči, kdo komu píše (soukromý × formální).",
      "Soukromý: tykáme, 'Milý/Milá...'",
      "Formální: vykáme, 'Vážený/Vážená...', 'Vy' s velkým V",
    ],
  }));
}

export const DOPISPSANISOUKROMEHODOPISU: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-psani-soukromeho-dopisu",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-psani-soukromeho-dopisu",
    title: "Dopis - psaní soukromého dopisu",
    studentTitle: "Jak psát dopis",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se správně sestavit soukromý i formální dopis se všemi částmi.",
    keywords: ["dopis", "záhlaví", "oslovení", "podpis", "vykání", "tykání", "soukromý dopis", "formální dopis"],
    goals: [
      "Napsat správně strukturovaný soukromý dopis",
      "Rozlišit soukromý a formální dopis",
      "Použít správné oslovení a závěr",
    ],
    boundaries: ["Bez pokročilých obchodních dopisů", "Bez e-mailových hlaviček"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Dopis: záhlaví (místo+datum) → oslovení → text → závěr+podpis; soukromý=tykáme, formální=vykáme s V",
      steps: [
        "Záhlaví: napište místo a datum vpravo nahoře.",
        "Oslovení: Milý Petře, / Vážená paní učitelko,",
        "Text: napište co chcete sdělit.",
        "Závěr: rozloučení a podpis.",
      ],
      commonMistake: "Zapomínání na záhlaví nebo záměna tykání/vykání (u formálního dopisu vždy Vy s velkým V)",
      example: "Praha, 15. 6. 2025 | Milý Petře, | text dopisu... | Tvůj Honza",
    },
  },
];
