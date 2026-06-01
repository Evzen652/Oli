import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Které otázky musí zodpovědět úplné sdělení?",
    correctAnswer: "kdo, co, kde, kdy, proč, jak",
    options: [
      "jen kdo a co",
      "kdo, co, kde, kdy, proč, jak",
      "jen kdy a kde",
      "jen proč a jak",
    ],
    hints: ["Úplné sdělení = odpovídá na všech 6 základních otázek."],
  },
  {
    question: "Je tato zpráva úplná? 'Přijdu pozdě.'",
    correctAnswer: "ne – chybí proč přijde pozdě a jak pozdě",
    options: [
      "ano – je dostatečná",
      "ne – chybí proč přijde pozdě a jak pozdě",
      "ano – v SMS je to dost",
      "záleží na situaci",
    ],
    hints: ["Chybí: proč? jak pozdě? → neúplná."],
  },
  {
    question: "Je tato zpráva úplná? 'Schůzka v úterý v 15:00 ve škole.'",
    correctAnswer: "téměř úplná – chybí jen proč – předmět schůzky",
    options: [
      "plně úplná – obsahuje vše",
      "téměř úplná – chybí jen proč (předmět schůzky)",
      "zcela neúplná",
      "záleží na adresátovi",
    ],
    hints: ["Máme kdy, kde, ale chybí: co (předmět schůzky)."],
  },
  {
    question: "Co chybí ve vzkazu: 'Zavolej mi!'?",
    correctAnswer: "kdo vzkaz zanechal a proč chce, aby zavolali",
    options: [
      "nic – je to dostatečné",
      "kdo vzkaz zanechal a proč chce, aby zavolali",
      "jen čas",
      "jen adresa",
    ],
    hints: ["Kdo zanechal vzkaz? Proč mám zavolat? → chybí."],
  },
  {
    question: "Co chybí ve zprávě: 'Přijela maminka z Brna.'?",
    correctAnswer: "kdy přijela – čas a zda je vše v pořádku",
    options: [
      "nic – úplná zpráva",
      "kdy přijela (čas) a zda je vše v pořádku",
      "jen adresa",
      "způsob cesty",
    ],
    hints: ["Kdy? Je zpráva aktuální? → mohly by chybět informace."],
  },
  {
    question: "Pro koho je sdělení 'Třídní schůzka je zrušena.' úplné?",
    correctAnswer: "pro rodiče, kteří věděli, kdy a kde měla být",
    options: [
      "pro každého",
      "pro rodiče, kteří věděli, kdy a kde měla být",
      "pro nikoho",
      "záleží na tom, kdo to čte",
    ],
    hints: ["Kontext doplňuje informace – pro informovaného adresáta může být úplné."],
  },
  {
    question: "Jak poznáš neúplné sdělení?",
    correctAnswer: "když po přečtení máš ještě otázky na kdo/co/kde/kdy/proč/jak",
    options: [
      "je kratší než jedna věta",
      "když po přečtení máš ještě otázky na kdo/co/kde/kdy/proč/jak",
      "neobsahuje sloveso",
      "záleží na adresátovi",
    ],
    hints: ["Klíč: zbývají otázky? → sdělení je neúplné."],
  },
  {
    question: "Je pozvánka 'Přijď na oslavu!' úplná?",
    correctAnswer: "ne – chybí kdy, kde a koho se oslava týká",
    options: [
      "ano – stačí",
      "ne – chybí kdy, kde a koho se oslava týká",
      "záleží na délce",
      "záleží na adresátovi",
    ],
    hints: ["Pozvánka musí obsahovat: kdo slaví, kdy, kde."],
  },
  {
    question: "Co musí obsahovat úplná pozvánka na narozeninovou oslavu?",
    correctAnswer: "kdo slaví, datum, čas, místo a případně dress code",
    options: [
      "jen jméno oslavence",
      "kdo slaví, datum, čas, místo a případně dress code",
      "jen datum",
      "jen adresu",
    ],
    hints: ["Pozvánka: kdo (oslavenec) + co (oslava) + kdy + kde."],
  },
  {
    question: "Ve zprávě 'Ukliď pokoj!' – co chybí?",
    correctAnswer: "do kdy a proč – co se stane, pokud to neudělám",
    options: [
      "nic – sdělení je jasné",
      "do kdy a proč (co se stane, pokud to neudělám)",
      "adresa pokoje",
      "kdo to říká",
    ],
    hints: ["Rozkaz může být úplný, ale bez termínu je méně srozumitelný."],
  },
  {
    question: "Proč je důležité, aby sdělení bylo úplné?",
    correctAnswer: "aby adresát věděl, co se od něho očekává, a mohl správně reagovat",
    options: [
      "jen kvůli délce textu",
      "aby adresát věděl, co se od něho očekává, a mohl správně reagovat",
      "záleží jen na adresátovi",
      "jen v písemné komunikaci",
    ],
    hints: ["Neúplné sdělení = nedorozumění nebo chybná reakce."],
  },
  {
    question: "Co chybí ve školní omluvelce: 'Dítě bude chybět.'?",
    correctAnswer: "jméno dítěte, třída, datum, důvod absence",
    options: [
      "nic – je to dostatečné",
      "jméno dítěte, třída, datum, důvod absence",
      "jen datum",
      "jen třída",
    ],
    hints: ["Omluvenka musí obsahovat: kdo, jaká třída, kdy, proč."],
  },
  {
    question: "Je sdělení 'Zítra ve 14:00 v tělocvičně.' úplné?",
    correctAnswer: "ne – chybí: co se bude konat a pro koho",
    options: [
      "ano – stačí",
      "ne – chybí: co se bude konat a pro koho",
      "záleží na adresátovi",
      "záleží na délce",
    ],
    hints: ["Čas a místo jsou, ale chybí: co? kdo tam má přijít?"],
  },
  {
    question: "Co je klíčová informace v mimořádném sdělení?",
    correctAnswer: "co, kde a jak se zachovat",
    options: [
      "jen datum",
      "co, kde a jak se zachovat",
      "jen jméno oznamovatele",
      "délka sdělení",
    ],
    hints: ["Mimořádné sdělení (evakuace, varování) = co se děje + co dělat."],
  },
  {
    question: "Je rozhlasové hlášení 'Unikl plyn, nebezpečí.' úplné?",
    correctAnswer: "ne – chybí kde, co dělat a jak vážné nebezpečí",
    options: [
      "ano – je naléhavé, to stačí",
      "ne – chybí kde, co dělat a jak vážné nebezpečí",
      "záleží na situaci",
      "záleží na délce",
    ],
    hints: ["V nouzové situaci: kde + co dělat = klíčové."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Přečti sdělení a urči, co chybí: 'Přijď do kina.' Co je neúplné?",
    correctAnswer: "chybí: které kino, kdy, na jaký film",
    options: [
      "nic – srozumitelné",
      "chybí: které kino, kdy, na jaký film",
      "chybí jen datum",
      "chybí jen čas",
    ],
    hints: ["Kdy? Kde? Na co? → vše chybí."],
  },
  {
    question: "Sdělení: 'Prosím, kupte mléko.' – je úplné?",
    correctAnswer: "téměř – chybí: kolik, jaký druh mléka",
    options: [
      "ano – dostatečné",
      "téměř – chybí: kolik, jaký druh mléka",
      "zcela neúplné",
      "záleží na obchodě",
    ],
    hints: ["Kolik? Jaký druh? (plnotučné, polotučné) → upřesnění chybí."],
  },
  {
    question: "Proč může být sdělení úplné pro jednoho adresáta, ale ne pro druhého?",
    correctAnswer: "protože záleží na sdílených znalostech – co jeden ví, druhý nemusí",
    options: [
      "záleží jen na délce sdělení",
      "protože záleží na sdílených znalostech – co jeden ví, druhý nemusí",
      "sdělení je vždy stejné pro všechny",
      "záleží jen na jazyku",
    ],
    hints: ["Kontext = sdílené znalosti. Bez kontextu je sdělení neúplné."],
  },
  {
    question: "Co musí obsahovat novinové sdělení o nehodě?",
    correctAnswer: "co se stalo, kde, kdy, počet postižených, příčina",
    options: [
      "jen popis nehody",
      "co se stalo, kde, kdy, počet postižených, příčina",
      "jen jméno řidiče",
      "len foto z místa",
    ],
    hints: ["Novinové sdělení = kompletní zpravodajská odpověď."],
  },
  {
    question: "Jak poznáme, že zpráva potřebuje doplnění?",
    correctAnswer: "zeptáme se: zbývají otázky bez odpovědi?",
    options: [
      "zpráva je kratší než 5 slov",
      "zeptáme se: zbývají otázky bez odpovědi?",
      "zpráva neobsahuje sloveso",
      "záleží na délce",
    ],
    hints: ["Klíč = zbývající otázky. Pokud žádné nezbývají → úplná."],
  },
  {
    question: "Je SMS: 'Jdu domů, budu ve 4.' úplná?",
    correctAnswer: "téměř – ve 4 = ve 4 hodiny? Je srozumitelné v kontextu",
    options: [
      "zcela neúplná",
      "téměř – ve 4 = ve 4 hodiny? Je srozumitelné v kontextu",
      "plně úplná vždy",
      "záleží na mobilním operátorovi",
    ],
    hints: ["Ve 4 = 16:00? V rodině to chápe každý. V jiném kontextu může být neúplná."],
  },
  {
    question: "Sdělení na nástěnce: 'Výlet je v pátek.' – co chybí?",
    correctAnswer: "kam jedeme, sraz kde, co s sebou, cena",
    options: [
      "nic – stačí datum",
      "kam jedeme, sraz kde, co s sebou, cena",
      "jen čas",
      "jen jméno organizátora",
    ],
    hints: ["Výlet = potřebujeme vědět: kam, odkud, co vzít s sebou, kolik stojí."],
  },
  {
    question: "Co je nepotřebná informace v sdělení?",
    correctAnswer: "informace, která nic nepřidává k porozumění nebo akci adresáta",
    options: [
      "vždy datum",
      "informace, která nic nepřidává k porozumění nebo akci adresáta",
      "jméno odesílatele",
      "záleží na délce",
    ],
    hints: ["Příliš mnoho informací = zmatek. Sdělení musí být přiměřeně úplné."],
  },
  {
    question: "Novinový titulek: 'Požár v Praze.' – co je neúplné?",
    correctAnswer: "kde v Praze, kdy, rozsah, zda jsou zranění",
    options: [
      "nic – titulek je vždy zkrácený",
      "kde v Praze, kdy, rozsah, zda jsou zranění",
      "jen čas",
      "záleží na délce titulku",
    ],
    hints: ["Titulek = záměrně zkrácený. Článek pod ním musí být úplný."],
  },
  {
    question: "Co je cílem úplného sdělení?",
    correctAnswer: "srozumitelně předat informaci bez nutnosti dalších otázek",
    options: [
      "co nejkratší text",
      "srozumitelně předat informaci bez nutnosti dalších otázek",
      "co nejdelší text",
      "záleží na čtenáři",
    ],
    hints: ["Ideální sdělení = čtenář ví přesně, co se děje, a co má dělat."],
  },
  {
    question: "Školní oznámení: 'Suplování zítra.' – co chybí?",
    correctAnswer: "které hodiny, která třída, kdo supluje",
    options: [
      "nic – stačí",
      "které hodiny, která třída, kdo supluje",
      "jen čas",
      "jen jméno učitele",
    ],
    hints: ["Suplování: kdy? která třída? kdo? – vše chybí."],
  },
  {
    question: "Sdělení je přiměřeně úplné, pokud:",
    correctAnswer: "adresát může bez dalších dotazů jednat podle sdělení",
    options: [
      "obsahuje více než 50 slov",
      "adresát může bez dalších dotazů jednat podle sdělení",
      "obsahuje datum a podpis",
      "záleží na délce",
    ],
    hints: ["Úplnost = funkčnost. Stačí k tomu, aby příjemce reagoval správně."],
  },
  {
    question: "Ve sdělení: 'Přijďte na zahájení školního roku.' – co chybí?",
    correctAnswer: "datum, čas, místo",
    options: [
      "nic – sdělení je jasné",
      "datum, čas, místo",
      "jen rok",
      "záleží na škole",
    ],
    hints: ["Kdy? Kde? = klíčové informace pro organizaci."],
  },
  {
    question: "Jak by znělo úplné oznámení o schůzce třídy?",
    correctAnswer: "Třídní schůzka se koná v úterý 10. 6. v 17:00 v učebně 3A.",
    options: [
      "Schůzka bude.",
      "Třídní schůzka se koná v úterý 10. 6. v 17:00 v učebně 3A.",
      "Přijďte na schůzku.",
      "Schůzka ve škole.",
    ],
    hints: ["Co + kdy + v kolik + kde = úplné oznámení."],
  },
  {
    question: "Sdělení: 'Varujeme před korozivní látkou.' – co chybí?",
    correctAnswer: "kde se látka nachází, co dělat, kdo varuje",
    options: [
      "nic – varování je jasné",
      "kde se látka nachází, co dělat, kdo varuje",
      "jen popis látky",
      "záleží na situaci",
    ],
    hints: ["Varování musí říct: co hrozí + kde + co dělat."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi úplností a přesností sdělení?",
    correctAnswer: "úplnost = má všechny informace; přesnost = informace jsou správné",
    options: [
      "jsou totéž",
      "úplnost = má všechny informace; přesnost = informace jsou správné",
      "přesnost = délka textu",
      "záleží na kontextu",
    ],
    hints: ["Sdělení může být úplné, ale nepřesné (špatné datum)."],
  },
  {
    question: "Jak se nazývá nadbytečná informace v sdělení?",
    correctAnswer: "redundance – zbytečná informace nepřidávající hodnotu",
    options: [
      "přirovnání",
      "redundance (zbytečná informace nepřidávající hodnotu)",
      "metafora",
      "citace",
    ],
    hints: ["Redundance = opakování nebo zbytečné údaje."],
  },
  {
    question: "Proč jsou otázky 'kdo' a 'co' nejdůležitější v sdělení?",
    correctAnswer: "protože bez znalosti aktéra a děje nelze pochopit nic dalšího",
    options: [
      "jsou nejkratší",
      "protože bez znalosti aktéra a děje nelze pochopit nic dalšího",
      "záleží na žánru",
      "jsou nejdůležitější jen v novinách",
    ],
    hints: ["Kdo? Co? = základní stavební kameny sdělení."],
  },
  {
    question: "Ve sdělení pro záchranáře je nejdůležitější:",
    correctAnswer: "poloha – kde, co se děje a počet postižených",
    options: [
      "délka sdělení",
      "poloha (kde), co se děje a počet postižených",
      "jméno oznamovatele",
      "datum a čas",
    ],
    hints: ["Záchranáři potřebují okamžitě vědět: kde jsou + co se děje."],
  },
  {
    question: "Jak se liší sdělení v SMS a v úředním dokumentu?",
    correctAnswer: "SMS = zkrácené, neformální; úřední dokument = formální, podrobné, úplné",
    options: [
      "jsou totéž",
      "SMS = zkrácené, neformální; úřední dokument = formální, podrobné, úplné",
      "SMS je vždy delší",
      "záleží na obsahu",
    ],
    hints: ["Formy komunikace mají různé normy úplnosti."],
  },
  {
    question: "Sdělení na letišti: 'Let OK401 je zpožděný.' – co chybí pro cestujícího?",
    correctAnswer: "o kolik je zpožděný, nový čas odletu, gate",
    options: [
      "nic – dostatečné",
      "o kolik je zpožděný, nový čas odletu, gate",
      "jen název aerolinky",
      "záleží na letiště",
    ],
    hints: ["Cestující potřebuje: nový čas + kde čekat."],
  },
  {
    question: "Proč neúplné sdělení může způsobit problémy?",
    correctAnswer: "adresát reaguje špatně, nedorazí včas nebo na špatné místo",
    options: [
      "jen kvůli délce textu",
      "adresát reaguje špatně, nedorazí včas nebo na špatné místo",
      "záleží na situaci",
      "neúplnost nikdy nevadí",
    ],
    hints: ["Chybná informace = chybná reakce = problém."],
  },
  {
    question: "Jak doplníme neúplné sdělení v praxi?",
    correctAnswer: "zeptáme se zpět nebo vyhledáme chybějící informace",
    options: [
      "ignorujeme neúplnost",
      "zeptáme se zpět nebo vyhledáme chybějící informace",
      "vymyslíme si chybějící část",
      "sdělení vyhodíme",
    ],
    hints: ["Neúplná informace = ověření nebo doplnění dotazem."],
  },
  {
    question: "Proč jsou ve formálních dopisech všechny informace tak podrobné?",
    correctAnswer: "aby bylo jednoznačné, bez nutnosti dalšího výkladu nebo dotazů",
    options: [
      "jen kvůli délce textu",
      "aby bylo jednoznačné, bez nutnosti dalšího výkladu nebo dotazů",
      "záleží na odesílateli",
      "kvůli právním požadavkům vždy",
    ],
    hints: ["Formální = přesný a jednoznačný. Každá neúplnost = problém."],
  },
  {
    question: "Jak se nazývá komunikační princip, podle něhož sdělení má být přesné a úplné?",
    correctAnswer: "Griceovy maxima – maxima kvality a množství",
    options: [
      "pravopis",
      "Griceovy maxima (maxima kvality a množství)",
      "rétorika",
      "kompozice",
    ],
    hints: ["Grice = filozof jazyka. Maxima: říkej pravdu a říkej dost."],
  },
  {
    question: "Které sdělení je nejúplnější pro nástěnku školy?",
    correctAnswer: "Třídní schůzka: úterý 10. 6. 2026, 17:00–18:30, třída 5A, téma: výsledky.",
    options: [
      "Schůzka bude.",
      "Třídní schůzka: úterý 10. 6. 2026, 17:00–18:30, třída 5A, téma: výsledky.",
      "Třídní schůzka v úterý.",
      "Přijďte ve čtvrtek.",
    ],
    hints: ["Nejúplnější = co + kdy + kde + kdo + pro koho + téma."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const POSUZOVANIUPLNOSTISDELENI: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-posuzovani-uplnosti-sdeleni",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-posuzovani-uplnosti-sdeleni",
    title: "Posuzování úplnosti sdělení",
    studentTitle: "Úplnost sdělení",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení a naslouchání",
    briefDescription: "Poznáš, jestli zpráva obsahuje všechny důležité informace.",
    keywords: ["úplnost sdělení", "komunikace", "kdo co kde kdy proč jak", "zpráva", "vzkaz"],
    goals: [
      "Posoudit, zda sdělení obsahuje všechny podstatné informace",
      "Určit, co v sdělení chybí",
      "Doplnit neúplné sdělení",
    ],
    boundaries: [
      "Bez lingvistické analýzy komunikace",
      "Neprobíráme teorii komunikace podrobně",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Úplné sdělení odpovídá na: KDO? CO? KDE? KDY? PROČ? JAK? Přečti sdělení a zkontroluj, zda znáš odpovědi na všechny tyto otázky.",
      steps: [
        "Přečti sdělení.",
        "Zeptej se: Kdo? Co? Kde? Kdy? Proč? Jak?",
        "Pokud na některou otázku nemáš odpověď = sdělení je neúplné.",
        "Urči, co konkrétně chybí.",
      ],
      commonMistake: "Žáci si myslí, že krátká sdělení jsou vždy neúplná. Ale v kontextu může být i kratší sdělení úplné.",
      example: "'Přijdu v 15:00 ke škole.' = kdo (já), co (přijdu), kde (ke škole), kdy (v 15:00). Proč? chybí – ale v kontextu to nemusí vadit.",
    },
  },
];
