import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string }

const POOL_L1: QA[] = [
  { q: "Co patří do záhlaví dopisu?", a: "Místo a datum (vpravo nahoře)", opts: ["Místo a datum (vpravo nahoře)", "Oslovení adresáta", "Podpis odesílatele", "Text dopisu"], e: "Záhlaví je úplně nahoře a říká, odkud a kdy dopis píšeme — proto do něj patří místo a datum. Oslovení, podpis i samotný text dopisu jsou jiné části, které přijdou až pod záhlavím." },
  { q: "Jak oslovíme přítele v dopisu?", a: "Milý Petře,", opts: ["Milý Petře,", "Vážený pane Petře,", "Dobrý den Petře,", "Ahoj Petře:"], e: "Kamarádovi tykáme a oslovujeme ho vřele, proto použijeme 'Milý Petře,' s čárkou na konci. 'Vážený pane' je příliš formální pro kamaráda a za oslovením se píše čárka, ne dvojtečka." },
  { q: "Kde se v dopisu nachází záhlaví?", a: "vpravo nahoře", opts: ["vpravo nahoře", "vlevo nahoře", "uprostřed", "dole pod podpisem"], e: "Záhlaví s místem a datem se tradičně píše vpravo nahoře, ještě nad oslovení. Dole pod podpisem ani uprostřed dopisu by ho čtenář nehledal." },
  { q: "Co píšeme v závěru dopisu?", a: "rozloučení a podpis (S pozdravem, Tvůj...)", opts: ["rozloučení a podpis (S pozdravem, Tvůj...)", "datum a místo", "oslovení adresáta", "téma dopisu"], e: "Závěr dopisu slouží k rozloučení a podpisu, abychom poznali, kdo dopis poslal. Datum a místo patří do záhlaví na začátku a oslovení přichází hned za záhlaví, ne na konec." },
  { q: "V soukromém dopise blízkým:", a: "tykáme", opts: ["tykáme", "vykáme s velkým V", "vykáme s malým v", "píšeme jen s velkým V"], e: "Lidem, které dobře známe a máme rádi, v dopise tykáme — píšeme jim jako v běžném hovoru. Vykání s velkým V si necháváme pro formální dopisy úřadům nebo lidem, které neznáme." },
  { q: "Ve formálním dopise (úřadu, řediteli):", a: "vykáme a píšeme 'Vy' s velkým V", opts: ["vykáme a píšeme 'Vy' s velkým V", "tykáme", "nemusíme oslovovat", "píšeme 'vy' s malým v"], e: "Ve formálním dopise vyjadřujeme úctu, proto vykáme a zájmeno 'Vy' píšeme s velkým V. Tykat řediteli by bylo nezdvořilé a malé 'vy' se ve zdvořilém dopise nehodí." },
  { q: "Jak se píše oslovení v dopisu?", a: "Milá Evo, / Vážený pane řediteli,", opts: ["Milá Evo, / Vážený pane řediteli,", "Milá Evo: / Vážený pane řediteli:", "Milá Evo. / Vážený pane řediteli.", "Milá Evo! / Vážený pane řediteli!"], e: "Za oslovením v dopise se píše čárka a text pak pokračuje na novém řádku malým písmenem. Tečka, dvojtečka ani vykřičník za oslovení nepatří." },
  { q: "Jaký interpunkční znaménko se píše za oslovením v dopisu?", a: "čárka (,)", opts: ["čárka (,)", "tečka (.)", "vykřičník (!)", "dvojtečka (:)"], e: "Za oslovením v dopise se podle pravidel píše čárka, protože věta tu ještě nekončí — pokračuje dál. Tečka by oslovení ukončila a vykřičník nebo dvojtečka sem nepatří." },
  { q: "Kolik hlavních částí má dopis?", a: "4 (záhlaví, oslovení, text, závěr+podpis)", opts: ["4 (záhlaví, oslovení, text, závěr+podpis)", "2", "3", "5"], e: "Dopis má čtyři hlavní části, které jdou za sebou: záhlaví, oslovení, text a závěr s podpisem. Když některou z nich vynecháme, dopis bude neúplný." },
  { q: "Co tvoří první část textu dopisu?", a: "Pozdrav nebo věc, o které chceme psát", opts: ["Pozdrav nebo věc, o které chceme psát", "Záhlaví s datem", "Oslovení adresáta", "Rozloučení a podpis"], e: "Vlastní text dopisu obvykle začíná pozdravem nebo tím, proč píšeme. Záhlaví, oslovení i podpis jsou samostatné části dopisu, ne začátek textu." },
  { q: "Adresa příjemce se na obálce píše:", a: "doprostřed nebo vpravo", opts: ["doprostřed nebo vpravo", "vlevo nahoře", "na zadní stranu", "pod poštovní zásilkou"], e: "Adresa toho, komu dopis posíláme, patří na přední stranu obálky doprostřed nebo vpravo, aby ji pošta dobře přečetla. Vlevo nahoře se píše adresa odesílatele." },
  { q: "Co obsahuje adresa na obálce?", a: "jméno, ulici, město, PSČ", opts: ["jméno, ulici, město, PSČ", "jen jméno a město", "jen PSČ a jméno", "jen telefon a e-mail"], e: "Aby dopis došel správně, musí adresa obsahovat jméno, ulici s číslem, město a PSČ. Jen jméno a město by nestačilo a telefon ani e-mail pošta k doručení nepoužívá." },
  { q: "Jak začíná text po oslovení v dopisu?", a: "odsazeným odstavcem s velkým písmenem", opts: ["odsazeným odstavcem s velkým písmenem", "pokračuje na stejném řádku", "začíná novou stránkou", "začíná číslicí"], e: "Po oslovení s čárkou přejdeme na nový řádek a text začneme novým odstavcem s velkým písmenem. Nepokračuje se na stejném řádku za čárkou ani se nezačíná číslicí." },
  { q: "Jaký je rozdíl mezi soukromým a formálním dopisem?", a: "soukromý = tykání, neformální tón; formální = vykání s Vy", opts: ["soukromý = tykání, neformální tón; formální = vykání s Vy", "soukromý = vykání; formální = tykání", "žádný rozdíl", "soukromý nemá záhlaví"], e: "Soukromý dopis píšeme blízkým, proto v něm tykáme a píšeme uvolněně; formální dopis úřadu vyžaduje vykání a velké Vy. Tyto dva typy si tedy nelze splést a oba mají záhlaví." },
  { q: "Příklad správného závěru soukromého dopisu:", a: "Těším se na shledanou! Tvůj Honza", opts: ["Těším se na shledanou! Tvůj Honza", "S pozdravem JUDr. Jan Novák", "S úctou a pozdravem vedení", "Vážený pane, těšíme se na setkání"], e: "Soukromý dopis zakončíme vřele a osobně, třeba 'Těším se na shledanou! Tvůj Honza'. Tituly, 'S úctou' nebo oslovení 'Vážený pane' patří do formálního dopisu, ne k příteli." },
  { q: "Datum v záhlaví se píše:", a: "V Praze dne 1. 6. 2025 / Praha, 1. 6. 2025", opts: ["V Praze dne 1. 6. 2025 / Praha, 1. 6. 2025", "1/6/2025", "červen 2025", "dne 6. 1."], e: "V záhlaví uvádíme místo i celé datum, například 'V Praze dne 1. 6. 2025'. Zápis s lomítky, jen měsíc s rokem nebo neúplné datum bez roku do dopisu nepatří." },
];

const POOL_L2: QA[] = [
  { q: "V dopise kamarádovi napíšeš: 'Těším se, až ...'", a: "tě uvidím (tykáš)", opts: ["tě uvidím (tykáš)", "Vás uvidím (vykáš)", "ho uvidím", "ji uvidím"], e: "Kamarádovi v soukromém dopise tykáme, proto napíšeme 'až tě uvidím'. Vykání 'Vás' by k příteli nepatřilo a 'ho' nebo 'ji' by mluvilo o někom třetím, ne o kamarádovi." },
  { q: "V dopise řediteli školy napíšeš: 'Žádám Vás, abyste ...'", a: "správně — vykáme s velkým V", opts: ["správně — vykáme s velkým V", "nesprávně — tykáme", "správně — ale píšeme 'vás' s malým", "nesprávně — píšeme 'je'"], e: "Řediteli školy vykáme a ze zdvořilosti píšeme 'Vás' s velkým V, takže věta je správně. Malé 'vás' by ve formálním dopise bylo nezdvořilé a tykání řediteli vůbec nepatří." },
  { q: "Seřaď části dopisu: 1) Text, 2) Záhlaví, 3) Podpis, 4) Oslovení", a: "2 → 4 → 1 → 3", opts: ["2 → 4 → 1 → 3", "1 → 2 → 3 → 4", "4 → 2 → 1 → 3", "2 → 1 → 4 → 3"], e: "Dopis jde odshora dolů: nejdřív záhlaví (2), pak oslovení (4), poté text (1) a nakonec podpis (3). Proto je správné pořadí 2 → 4 → 1 → 3." },
  { q: "Který text odpovídá správnému záhlaví soukromého dopisu?", a: "Praha, 15. března 2025", opts: ["Praha, 15. března 2025", "Milý Petře,", "S pozdravem Jana", "Chci ti napsat o výletě"], e: "Záhlaví obsahuje místo a datum, proto sem patří 'Praha, 15. března 2025'. 'Milý Petře,' je oslovení, 'S pozdravem Jana' je závěr a věta o výletě je už součást textu." },
  { q: "Příjemcem dopisu je babička. Jak ji oslovíš?", a: "Milá babičko,", opts: ["Milá babičko,", "Vážená paní babičko,", "Dobrý den babičko:", "Ahoj babičko!"], e: "Babička je blízká osoba, proto ji oslovíme vřele 'Milá babičko,' s čárkou. 'Vážená paní' je příliš formální a za oslovení nepatří dvojtečka ani vykřičník." },
  { q: "Co se NESMÍ vynechat v soukromém dopisu?", a: "záhlaví, oslovení, podpis", opts: ["záhlaví, oslovení, podpis", "jen text", "jen podpis", "datum a podpis"], e: "Aby byl dopis úplný, musí mít všechny své části — záhlaví, oslovení i podpis. Kdybychom vynechali jen jednu z nich, dopis by byl neúplný, proto nestačí hlídat třeba jen podpis." },
  { q: "Jak se správně loučíš v soukromém dopisu kamarádovi?", a: "Tvůj / Tvoje + jméno nebo 'S pozdravem Honza'", opts: ["Tvůj / Tvoje + jméno nebo 'S pozdravem Honza'", "S úctou a pozdravem", "Vyhrazuji si právo neodpovídat", "Yours sincerely"], e: "Kamarádovi se loučíme osobně a vřele, třeba 'Tvůj Honza' nebo 'S pozdravem Honza'. 'S úctou' patří do formálního dopisu a cizojazyčné rozloučení do českého dopisu nepatří." },
  { q: "Proč se vykání v dopise řediteli píše s velkým V?", a: "znak úcty — velké 'Vy' je zdvořilejší než 'vy'", opts: ["znak úcty — velké 'Vy' je zdvořilejší než 'vy'", "gramatické pravidlo pro všechna zájmena", "protože je to začátek věty", "protože je to vlastní jméno"], e: "Velké V u 'Vy' v dopise je projev úcty k tomu, komu píšeme. Není to pravidlo pro všechna zájmena ani to nesouvisí se začátkem věty nebo vlastním jménem." },
  { q: "Kamarád ti napsal dopis z tábora. Jak začneš odpověď?", a: "Milý Tome, / Ahoj Tome,", opts: ["Milý Tome, / Ahoj Tome,", "Vážený příteli,", "Dobrý den, pane Tome,", "Zdravím Vás,"], e: "Kamarádovi odpovíme přátelsky a tykáme mu, proto 'Milý Tome,' nebo 'Ahoj Tome,'. 'Vážený příteli' i 'Zdravím Vás' jsou příliš formální oslovení, která ke kamarádovi nepatří." },
  { q: "Dopis s žádostí o přijetí do sportovního kroužku píšeš:", a: "formálně — vykáte, velké V, Vážený pane...", opts: ["formálně — vykáte, velké V, Vážený pane...", "neformálně — tykáte", "jen e-mailem", "bez záhlaví"], e: "Žádost je úřední dopis cizí osobě, proto ji píšeme formálně — vykáme, používáme velké V a oslovení 'Vážený pane'. Tykání ani vynechání záhlaví by v žádosti nebylo vhodné." },
  { q: "Který text patří do textu (těla) dopisu?", a: "Byl jsem na táboře. Bylo to skvělé...", opts: ["Byl jsem na táboře. Bylo to skvělé...", "Praha, 15. 6. 2025", "Milý Petře,", "Tvůj Honza"], e: "Tělo dopisu je to, co chceme sdělit, třeba vyprávění o táboře. 'Praha, 15. 6. 2025' je záhlaví, 'Milý Petře,' je oslovení a 'Tvůj Honza' je podpis v závěru." },
  { q: "Dopis příteli vs. dopis učiteli — hlavní rozdíl tónu:", a: "příteli = neformální, uvolněný; učiteli = formální, zdvořilý", opts: ["příteli = neformální, uvolněný; učiteli = formální, zdvořilý", "žádný rozdíl", "příteli = formální; učiteli = neformální", "oba jsou neformální"], e: "Příteli píšeme uvolněně a tykáme mu, kdežto učiteli píšeme zdvořile a vykáme — tón se tedy podle adresáta liší. Není pravda, že by byl rozdíl žádný nebo že by byly oba dopisy neformální." },
  { q: "K čemu slouží záhlaví dopisu?", a: "identifikuje místo a čas napsání dopisu", opts: ["identifikuje místo a čas napsání dopisu", "oslovuje adresáta", "shrnuje obsah dopisu", "poskytuje adresu odesílatele"], e: "Záhlaví říká, kde a kdy byl dopis napsán — tedy místo a čas. Oslovení adresáta i obsah dopisu jsou jiné části a adresa odesílatele se píše na obálku, ne do záhlaví." },
  { q: "Co je oslovení v dopisu?", a: "první řádek textu — kdo je adresát (Milý Petře,)", opts: ["první řádek textu — kdo je adresát (Milý Petře,)", "záhlaví s datem", "závěr dopisu", "podpis odesílatele"], e: "Oslovení je řádek, kterým dopis začínáme a obracíme se jím na adresáta, například 'Milý Petře,'. Záhlaví s datem, závěr i podpis jsou jiné části dopisu." },
  { q: "Jak oslovíš učitelku v dopisu?", a: "Vážená paní učitelko,", opts: ["Vážená paní učitelko,", "Milá paní učitelko,", "Ahoj paní učitelko,", "Dobrý den,"], e: "Učitelce projevíme úctu zdvořilým oslovením 'Vážená paní učitelko,'. 'Ahoj' nebo 'Milá' jsou přátelská oslovení pro blízké a 'Dobrý den,' neříká, komu píšeme." },
  { q: "Slovo 'Ty' s velkým T v dopisu kamarádovi:", a: "správné — zdvořilejší forma oslovení blízkého", opts: ["správné — zdvořilejší forma oslovení blízkého", "chybné — musí být malé", "chybné — píšeme jen Vy", "jen v dopisech rodičům"], e: "I při tykání můžeme v dopise psát 'Ty' s velkým T, abychom dali najevo úctu a vřelost — je to správné. Není to chyba ani to neplatí jen pro dopisy rodičům." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Dopis má 4 části: záhlaví, oslovení, text, závěr+podpis",
      "Záhlaví = místo a datum (vpravo nahoře)",
      "Soukromý dopis = tykáme; formální dopis = vykáme s velkým V",
    ],
    explanation: e,
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
