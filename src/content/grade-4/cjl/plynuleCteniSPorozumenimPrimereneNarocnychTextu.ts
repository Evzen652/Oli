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
  { q: "Jak ověříme, že jsme textu porozuměli?", a: "Dokážeme odpovědět na otázky kdo, co, kde, kdy, proč", opts: ["Dokážeme odpovědět na otázky kdo, co, kde, kdy, proč", "Přečteme text rychle bez zastavení", "Vypiš všechna slova", "Slůvko po slůvku přeložíme"] },
  { q: "Co je hlavní myšlenka textu?", a: "Nejdůležitější sdělení, které chce autor předat", opts: ["Nejdůležitější sdělení, které chce autor předat", "První věta textu", "Poslední věta textu", "Nejdelší odstavec"] },
  { q: "Jak zjistíme hlavní myšlenku textu?", a: "Ptáme se: O čem celý text je? Co tím autor říká?", opts: ["Ptáme se: O čem celý text je? Co tím autor říká?", "Přečteme jen nadpis", "Přečteme jen závěr", "Spočítáme věty"] },
  { q: "Co je klíčové slovo?", a: "Slovo, které nejlépe vystihuje téma textu", opts: ["Slovo, které nejlépe vystihuje téma textu", "Nejdelší slovo v textu", "Slovo, které se vyskytuje jen jednou", "Slovo na začátku textu"] },
  { q: "Jak čteme text s porozuměním?", a: "Pomalu, soustředěně, s přemýšlením o obsahu", opts: ["Pomalu, soustředěně, s přemýšlením o obsahu", "Co nejrychleji", "Jen klíčová slova", "Přeskočíme těžké části"] },
  { q: "Když nerozumíme slovu v textu, co uděláme?", a: "Odhadneme z kontextu nebo vyhledáme ve slovníku", opts: ["Odhadneme z kontextu nebo vyhledáme ve slovníku", "Text přeskočíme", "Přestaneme číst", "Zeptáme se na náhodné slovo"] },
  { q: "Co je kontext v textu?", a: "Okolní věty a slova, která pomáhají pochopit neznámý výraz", opts: ["Okolní věty a slova, která pomáhají pochopit neznámý výraz", "Nadpis textu", "Ilustrace k textu", "Autor textu"] },
  { q: "Po přečtení odstavce bychom měli:", a: "shrnout, co jsme přečetli, vlastními slovy", opts: ["shrnout, co jsme přečetli, vlastními slovy", "přejít k dalšímu odstavci bez přemýšlení", "napsat celý odstavec znovu", "zapamatovat si každé slovo"] },
  { q: "Otázka 'Proč' v textu pomáhá zjistit:", a: "příčinu nebo důvod děje", opts: ["příčinu nebo důvod děje", "kde se děj odehrává", "kdo jsou postavy", "kdy se to stalo"] },
  { q: "Otázka 'Kdo' v textu zjišťuje:", a: "postavy nebo aktéry textu", opts: ["postavy nebo aktéry textu", "místo děje", "čas děje", "příčinu děje"] },
  { q: "Co je inference (vyvozování)?", a: "Vyvozujeme ze stop v textu to, co není přímo napsáno", opts: ["Vyvozujeme ze stop v textu to, co není přímo napsáno", "Opisujeme text doslova", "Pamatujeme si vše nazpaměť", "Přeložíme text do jiného jazyka"] },
  { q: "Příklad vyvozování: 'Martin přišel domů mokrý.' Co asi bylo?", a: "Pršelo nebo se Martin dostal do vody (vyvozujeme)", opts: ["Pršelo nebo se Martin dostal do vody (vyvozujeme)", "Martin je mokrý — nevíme nic dalšího", "Martin prší na lidi", "Martina polil soused"] },
  { q: "Co je porozumění textu?", a: "Pochopení obsahu, smyslu a záměru textu", opts: ["Pochopení obsahu, smyslu a záměru textu", "Přečtení textu nahlas", "Opsání textu doslova", "Počítání slov"] },
  { q: "Proč číst text podruhé?", a: "Abychom si ověřili, co jsme nepochopili poprvé", opts: ["Abychom si ověřili, co jsme nepochopili poprvé", "Protože je to pravidlo", "Abychom text uměli nazpaměť", "Abychom zjistili délku textu"] },
  { q: "Co je literární text?", a: "Umělecký text (próza, poezie, drama) — autor vyjadřuje pocity a příběhy", opts: ["Umělecký text (próza, poezie, drama) — autor vyjadřuje pocity a příběhy", "Věcný text (encyklopedie, zpráva)", "Technický manuál", "Telefonní seznam"] },
  { q: "Co je věcný (informační) text?", a: "Text podávající fakta a informace (encyklopedie, zpráva, článek)", opts: ["Text podávající fakta a informace (encyklopedie, zpráva, článek)", "Povídka nebo báseň", "Pohádka nebo pověst", "Osobní dopis"] },
];

const POOL_L2: QA[] = [
  { q: "Text o slonech říká: 'Slon je největší suchozemské zvíře.' Je to hlavní myšlenka nebo detail?", a: "Hlavní myšlenka — bez ní text nedává smysl", opts: ["Hlavní myšlenka — bez ní text nedává smysl", "Detail — méně důležitá informace", "Nadpis textu", "Závěr textu"] },
  { q: "Text o slonech říká: 'Slon má šedou kůži.' Je to hlavní myšlenka nebo detail?", a: "Detail — doplňující informace", opts: ["Detail — doplňující informace", "Hlavní myšlenka", "Klíčové slovo", "Téma textu"] },
  { q: "Jaká strategie pomáhá pochopit těžký text?", a: "Číst pomalu, rozdělit na odstavce, ptát se na obsah", opts: ["Číst pomalu, rozdělit na odstavce, ptát se na obsah", "Číst rychle bez přestávek", "Přeskočit těžké části", "Číst jen nadpisy"] },
  { q: "Jak shrneme obsah textu jednou větou?", a: "Říkáme co (téma) + co se o tom říká (hlavní myšlenka)", opts: ["Říkáme co (téma) + co se o tom říká (hlavní myšlenka)", "Opisujeme první větu textu", "Vypíšeme klíčová slova za sebou", "Přečteme závěr textu"] },
  { q: "Co je záměr autora textu?", a: "Co chce autor říct nebo čeho dosáhnout textem", opts: ["Co chce autor říct nebo čeho dosáhnout textem", "Délka textu", "Počet odstavců", "Vydavatel textu"] },
  { q: "Přečteni text: 'Včely opylují rostliny. Bez včel by nerostlo ovoce.' — Co vyvozuješ?", a: "Včely jsou pro přírodu velmi důležité", opts: ["Včely jsou pro přírodu velmi důležité", "Ovoce roste bez pomoci", "Rostliny jsou zbytečné", "Včely jsou nebezpečné"] },
  { q: "Jaký druh textu je návod k sestavení nábytku?", a: "věcný (informační) text — popis postupu", opts: ["věcný (informační) text — popis postupu", "umělecký text", "pohádka", "soukromý dopis"] },
  { q: "Jak poznat, že text je naučný (odborný)?", a: "Obsahuje fakta, odborné pojmy, objektivní informace", opts: ["Obsahuje fakta, odborné pojmy, objektivní informace", "Má hlavní postavu a příběh", "Rýmuje se", "Je psán v 1. osobě"] },
  { q: "Proč je důležité číst s porozuměním?", a: "Abychom textu rozuměli a mohli s informacemi pracovat", opts: ["Abychom textu rozuměli a mohli s informacemi pracovat", "Abychom četli rychle", "Abychom se naučili text nazpaměť", "Aby text byl kratší"] },
  { q: "Co jsou tzv. 'stop-and-think' momenty při čtení?", a: "Zastavíme se a přemýšlíme, co jsme právě přečetli", opts: ["Zastavíme se a přemýšlíme, co jsme právě přečetli", "Zastavíme čtení navždy", "Přečteme část podruhé bez přemýšlení", "Přeskočíme obtížnou část"] },
  { q: "Co je předvídání v textu?", a: "Odhadujeme, co se v textu stane dál — na základě stop", opts: ["Odhadujeme, co se v textu stane dál — na základě stop", "Opisujeme text", "Čteme text pozpátku", "Hledáme rýmy"] },
  { q: "Příklad vyvozování záměru autora: Autor popisuje škodlivost plastů. Co chce asi říct?", a: "Chce upozornit na problém a motivovat k řešení", opts: ["Chce upozornit na problém a motivovat k řešení", "Chce prodat plasty", "Chce popsat chemii plastů", "Chce pobavit čtenáře"] },
  { q: "Jak zjistíme odpověď na otázku, která není přímo v textu?", a: "Vyvozujeme ze stop a spojujeme informace z textu", opts: ["Vyvozujeme ze stop a spojujeme informace z textu", "Odpověď je vždy v prvním odstavci", "Hledáme ji na internetu", "Text neumožňuje takové otázky"] },
  { q: "Co je tzv. 'čtenářská strategie'?", a: "Záměrný přístup k textu (předvídání, vyvozování, shrnutí)", opts: ["Záměrný přístup k textu (předvídání, vyvozování, shrnutí)", "Rychlost čtení", "Zapamatování všech slov", "Přeskočení textu"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Porozumění = umím odpovědět na kdo, co, kde, kdy, proč",
      "Hlavní myšlenka = bez ní text nedává smysl",
      "Klíčová slova = opakují se, vystihují téma",
    ],
    solutionSteps: [
      "Přečti otázku a urči, na co se ptá.",
      "Hledej odpověď v textu nebo ji vyvozuj ze stop.",
      "Ověř, zda odpověď dává smysl v kontextu celého textu.",
    ],
  }));
}

export const PLYNULECTENISPOROZUMENIMPRIMERENENAROCNYCHTEXTU: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-primerene-narocnych-textu",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-primerene-narocnych-textu",
    title: "Plynulé čtení s porozuměním přiměřeně náročných textů",
    studentTitle: "Čtení s porozuměním",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se číst s porozuměním a vyvozovat závěry z přečteného textu.",
    keywords: ["čtení", "porozumění", "hlavní myšlenka", "klíčové slovo", "vyvozování", "inference"],
    goals: [
      "Číst přiměřeně náročné texty s porozuměním",
      "Odpovídat na otázky kdo, co, kde, kdy, proč",
      "Vyvozovat závěry ze stop v textu",
    ],
    boundaries: ["Bez literární analýzy", "Bez textů nad 4. ročník"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Porozumění: umím odpovědět na kdo/co/kde/kdy/proč; hlavní myšlenka = bez ní text nedává smysl",
      steps: [
        "Přečti text pomalu a soustředěně.",
        "Zastavuj se a ptej se: Co jsem právě přečetl(a)?",
        "Odpovídej na otázky kdo, co, kde, kdy, proč.",
        "Vyvozuj ze stop to, co není přímo napsáno.",
      ],
      commonMistake: "Záměna doslovné odpovědi a vyvozené odpovědi — ne vše je přímo v textu",
      example: "'Martin přišel domů mokrý.' → vyvozujeme: pravděpodobně pršelo",
    },
  },
];
