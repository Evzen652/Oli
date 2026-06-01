import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Kdy se Česko a Slovensko rozdělily a vznikla samostatná ČR?",
    correctAnswer: "1. ledna 1993",
    options: ["1. ledna 1993", "17. listopadu 1989", "28. října 1918", "1. května 2004"],
    hints: ["Šlo o první den nového roku."],
    solutionSteps: ["Dne 1. 1. 1993 se Čechy a Slovensko pokojně rozdělily — vznik ČR a SR."],
  },
  {
    question: "Jak se říká rozdělení Česka a Slovenska roku 1993?",
    correctAnswer: "Sametový rozvod",
    options: ["Sametový rozvod", "Sametová revoluce", "Velká schizma", "Mírový rozchod"],
    hints: ["Název odkazuje na pokojný průběh — jako Sametová revoluce."],
    solutionSteps: ["'Sametový rozvod' = pokojné rozdělení ČSR na dvě samostatné republiky bez konfliktu."],
  },
  {
    question: "Kdy Česká republika vstoupila do NATO?",
    correctAnswer: "1999",
    options: ["1999", "2004", "1993", "1989"],
    hints: ["Bylo to před vstupem do EU."],
    solutionSteps: ["ČR vstoupila do NATO v roce 1999 spolu s Polskem a Maďarskem."],
  },
  {
    question: "Kdy Česká republika vstoupila do Evropské unie?",
    correctAnswer: "1. května 2004",
    options: ["1. května 2004", "1. ledna 1993", "1999", "2007"],
    hints: ["Šlo o slavný den rozšíření EU o 10 nových zemí."],
    solutionSteps: ["ČR vstoupila do EU 1. 5. 2004 spolu s dalšími 9 zeměmi."],
  },
  {
    question: "Používá Česká republika euro?",
    correctAnswer: "Ne, ČR má stále českou korunu (CZK)",
    options: [
      "Ne, ČR má stále českou korunu (CZK)",
      "Ano, od vstupu do EU 2004",
      "Ano, od roku 1999",
      "Ano, ale jen na Moravě",
    ],
    hints: ["V obchodě platíme korunami."],
    solutionSteps: ["ČR je v EU, ale nepřijala euro — používáme českou korunu (CZK)."],
  },
  {
    question: "Co je Schengenský prostor a kdy do něj vstoupila ČR?",
    correctAnswer: "Oblast bez hraničních kontrol; ČR vstoupila roku 2007",
    options: [
      "Oblast bez hraničních kontrol; ČR vstoupila roku 2007",
      "Zóna se společnou armádou; ČR vstoupila 1993",
      "Hospodářská unie; ČR vstoupila 2004",
      "Oblast se společnou měnou; ČR vstoupila 2004",
    ],
    hints: ["V Schengenu nepotřebuješ pas na cestování mezi členskými zeměmi."],
    solutionSteps: ["Schengen = volný pohyb osob. ČR vstoupila do Schengenu 2007."],
  },
  {
    question: "Co je NATO?",
    correctAnswer: "Vojenská aliance demokratických zemí pro vzájemnou obranu",
    options: [
      "Vojenská aliance demokratických zemí pro vzájemnou obranu",
      "Ekonomická unie jako EU",
      "OSN — světová organizace míru",
      "Sdružení jen evropských armád",
    ],
    hints: ["Celý název: Severoatlantická aliance."],
    solutionSteps: ["NATO (North Atlantic Treaty Organization) = vojenská aliance, ČR členem od 1999."],
  },
  {
    question: "Proč bylo rozdělení Česka a Slovenska 'sametové'?",
    correctAnswer: "Proběhlo pokojně bez násilí nebo válek",
    options: [
      "Proběhlo pokojně bez násilí nebo válek",
      "Občané hlasovali v referendu",
      "Rozdělení se konalo o Vánocích",
      "Rozdělení bylo nařízeno EU",
    ],
    hints: ["Sametový = hladký, jemný — žádný konflikt."],
    solutionSteps: ["Na rozdíl od Jugoslávie se rozdělilo ČSR bez jediného výstřelu."],
  },
  {
    question: "Jak se zkracuje Severoatlantická aliance anglicky?",
    correctAnswer: "NATO",
    options: ["NATO", "OSN", "EU", "SSSR"],
    hints: ["North Atlantic Treaty Organization."],
    solutionSteps: ["NATO = North Atlantic Treaty Organization — aliance 31+ demokratických zemí."],
  },
  {
    question: "Je Slovensko členem Evropské unie?",
    correctAnswer: "Ano, vstoupilo také roku 2004",
    options: [
      "Ano, vstoupilo také roku 2004",
      "Ne, Slovensko není v EU",
      "Ano, ale vstoupilo roku 2007",
      "Ne, Slovensko je v NATO ale ne EU",
    ],
    hints: ["Slovensko vstoupilo do EU ve stejnou dobu jako ČR."],
    solutionSteps: ["Slovensko vstoupilo do EU 1. 5. 2004 — ve stejné vlně jako ČR."],
  },
  {
    question: "Kolik členských zemí má EU v roce 2024?",
    correctAnswer: "27",
    options: ["27", "28", "25", "30"],
    hints: ["Po Brexitu — odchodu Británie — jich ubylo."],
    solutionSteps: ["Po Brexitu (odchod Velké Británie) má EU od 2020 celkem 27 členských zemí."],
  },
  {
    question: "Kde sídlí Evropská unie (její hlavní instituce)?",
    correctAnswer: "V Bruselu (Belgie)",
    options: ["V Bruselu (Belgie)", "V Paříži (Francie)", "Ve Vídni (Rakousko)", "V Berlíně (Německo)"],
    hints: ["Je to hlavní město Belgie."],
    solutionSteps: ["Většina institucí EU (Komise, Rada) sídlí v Bruselu, Evropský parlament také ve Štrasburku."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč se Česko a Slovensko rozhodly rozdělit roku 1993?",
    correctAnswer: "Politické neshody o uspořádání státu — Slováci chtěli větší samostatnost",
    options: [
      "Politické neshody o uspořádání státu — Slováci chtěli větší samostatnost",
      "Byli donuceni EU",
      "Válka je přinutila se oddělit",
      "Bylo to nařízení SSSR",
    ],
    hints: ["Slovenský premiér Mečiar a český premiér Klaus se nedohodli."],
    solutionSteps: ["Klaus vs. Mečiar — neshody o konfederaci vedly k pokojnému rozdělení 1. 1. 1993."],
  },
  {
    question: "Proč bylo pro ČR důležité vstoupit do NATO?",
    correctAnswer: "Bezpečnostní záruky — útok na jednoho člena = útok na celé NATO",
    options: [
      "Bezpečnostní záruky — útok na jednoho člena = útok na celé NATO",
      "Členství přineslo ekonomické výhody",
      "NATO určuje zahraniční politiku ČR",
      "Bez NATO by ČR nemohla vstoupit do EU",
    ],
    hints: ["Článek 5 NATO = kolektivní obrana."],
    solutionSteps: ["Článek 5 Washingtonské smlouvy zaručuje kolektivní obranu — záruky bezpečnosti pro ČR."],
  },
  {
    question: "Jaké výhody přinesl ČR vstup do EU v roce 2004?",
    correctAnswer: "Volný pohyb osob, zboží, kapitálu a služeb; fondy EU pro rozvoj",
    options: [
      "Volný pohyb osob, zboží, kapitálu a služeb; fondy EU pro rozvoj",
      "Jen zavedení eura",
      "Ztráta suverenity bez výhod",
      "Právo veta v OSN",
    ],
    hints: ["Čtyři svobody EU."],
    solutionSteps: ["EU přinesla ČR: volný trh, pohyb osob, dotace ze strukturálních fondů, spolupráce."],
  },
  {
    question: "Proč ČR nemá euro, přestože je v EU?",
    correctAnswer: "Dosud nesplnila nebo se nerozhodla splnit maastrichtská kritéria pro přijetí eura",
    options: [
      "Dosud nesplnila nebo se nerozhodla splnit maastrichtská kritéria pro přijetí eura",
      "EU nám euro zakázala",
      "ČR euro odmítla v referendu",
      "Euro se v ČR používá, jen se tomu říká jinak",
    ],
    hints: ["Ne všechny státy EU musí hned přijmout euro."],
    solutionSteps: ["Přijetí eura je podmíněno splněním ekonomických kritérií — ČR si ponechala korunu."],
  },
  {
    question: "Jak se liší ČR od roku 1993 ve srovnání s ČR roku 1968?",
    correctAnswer: "1993: demokratická, tržní ekonomika, NATO/EU; 1968: komunistická, plánovaná, Varšavská smlouva",
    options: [
      "1993: demokratická, tržní ekonomika, NATO/EU; 1968: komunistická, plánovaná, Varšavská smlouva",
      "Obě éry jsou si podobné",
      "1968 bylo svobodnější než 1993",
      "1993 ČR nebyla součástí žádné aliance",
    ],
    hints: ["Porovnej politický systém a aliance."],
    solutionSteps: ["1968: KSČ, SSSR, Varšavská smlouva; 1993: demokracie, NATO, EU — zásadní rozdíl."],
  },
  {
    question: "Proč je Schengen pro cestování výhodný?",
    correctAnswer: "Bez pasové kontroly na hranicích mezi členskými zeměmi — snadnější cestování",
    options: [
      "Bez pasové kontroly na hranicích mezi členskými zeměmi — snadnější cestování",
      "Zdarma letenky po Evropě",
      "Pojištění na cestování zdarma",
      "Společná měna ve Schengen zemích",
    ],
    hints: ["Vzpomeň, jak cestuješ z Čech na Slovensko."],
    solutionSteps: ["V Schengenu překročíš hranice bez zastavení a kontroly dokladů."],
  },
  {
    question: "Proč bylo pro ČR symbolicky důležité vstoupit do EU a NATO po komunismu?",
    correctAnswer: "Potvrdilo to příslušnost k demokratickému Západu, odvrácení se od komunistického Východu",
    options: [
      "Potvrdilo to příslušnost k demokratickému Západu, odvrácení se od komunistického Východu",
      "Jen kvůli ekonomickým výhodám",
      "Nebyla to symbolická, jen technická záležitost",
      "EU a NATO jsou totéž",
    ],
    hints: ["Po desetiletích za Varšavskou smlouvou přichod do demokratické aliance."],
    solutionSteps: ["Vstup do NATO (1999) a EU (2004) symbolizoval definitivní rozchod s komunistickou minulostí."],
  },
  {
    question: "Co se stalo se Slovenskem po Sametovém rozvodu?",
    correctAnswer: "Stalo se samostatnou Slovenskou republikou, vstoupilo do EU a NATO",
    options: [
      "Stalo se samostatnou Slovenskou republikou, vstoupilo do EU a NATO",
      "Připojilo se k Maďarsku",
      "Zůstalo součástí ČSR pod jiným názvem",
      "Stalo se součástí EU jen jako autonomní oblast",
    ],
    hints: ["Slovensko se vydalo vlastní cestou."],
    solutionSteps: ["SR od 1993 samostatný stát, vstoupila do NATO 2004 a EU 2004, přijala euro 2009."],
  },
  {
    question: "Jak vstup do EU ovlivnil každodenní život Čechů?",
    correctAnswer: "Volné cestování, práce v zahraničí, dovozy zboží, dotace na rozvoj",
    options: [
      "Volné cestování, práce v zahraničí, dovozy zboží, dotace na rozvoj",
      "Nic se nezměnilo",
      "Češi museli platit daně do Bruselu navíc",
      "Jen firmy pocítily změnu",
    ],
    hints: ["Mysl na to, jak snadno dnes cestuješ do Německa."],
    solutionSteps: ["EU přinesla volný pohyb osob, práci v zahraničí, levnější zboží a fondy na infrastrukturu."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď klíčové milníky ČR od roku 1989 chronologicky.",
    correctAnswer: "Sametová revoluce → Vznik ČR → Vstup do NATO → Vstup do EU → Schengen",
    items: [
      "Sametová revoluce (1989)",
      "Vznik samostatné ČR (1. 1. 1993)",
      "Vstup do NATO (1999)",
      "Vstup do EU (1. 5. 2004)",
      "Vstup do Schengen (2007)",
    ],
    hints: ["Začni 1989."],
    solutionSteps: ["1989 → 1993 → 1999 → 2004 → 2007."],
  },
  {
    question: "Spoj organizaci s jejím popisem.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "NATO", right: "Vojenská aliance — ČR člen od 1999" },
      { left: "EU", right: "Hospodářská a politická unie — ČR člen od 2004" },
      { left: "Schengen", right: "Prostor bez hraničních kontrol — ČR od 2007" },
      { left: "OSN", right: "Světová organizace pro mír a bezpečnost" },
    ],
    hints: ["NATO = vojenská aliance."],
    solutionSteps: ["Každá organizace má jiný hlavní účel a jiné datum vstupu ČR."],
  },
  {
    question: "Proč Sametový rozvod byl výjimečný ve srovnání s jugoslávskými válkami?",
    correctAnswer: "ČSR se rozdělilo pokojně — Jugoslávie se rozpadla v krvavé válce",
    options: [
      "ČSR se rozdělilo pokojně — Jugoslávie se rozpadla v krvavé válce",
      "Oba rozchody proběhly stejně",
      "Jugoslávie se rozdělila pokojněji než ČSR",
      "Jugoslávie se nerozdělila",
    ],
    hints: ["Chorvatsko, Bosna, Srbsko — válka v 90. letech."],
    solutionSteps: ["Jugoslávské války 1991–2001 si vyžádaly statisíce obětí — ČSR se rozdělilo bez jediné oběti."],
  },
  {
    question: "Proč ČR dosud nepřijala euro, přestože je v EU více než 20 let?",
    correctAnswer: "Politická a ekonomická rozhodnutí — volba zachovat národní měnu jako nástroj hospodářské politiky",
    options: [
      "Politická a ekonomická rozhodnutí — volba zachovat národní měnu jako nástroj hospodářské politiky",
      "EU ČR do eurozóny nepustila",
      "ČR nemá povinnost euro přijmout nikdy",
      "Česká koruna je silnější než euro",
    ],
    hints: ["Euro = ztráta samostatné měnové politiky."],
    solutionSteps: ["Vlastní měna dává ČR možnost regulovat kurz — politicky i ekonomicky výhodné pro ČR."],
  },
  {
    question: "Jak by se změnil tvůj život, kdyby ČR neměla vstoupit do EU?",
    correctAnswer: "Pas na každou cestu do Německa, obtížnější práce v zahraničí, méně investic",
    options: [
      "Pas na každou cestu do Německa, obtížnější práce v zahraničí, méně investic",
      "Nic by se nezměnilo",
      "Bylo by levnější zboží",
      "Čeština by se stala světovým jazykem",
    ],
    hints: ["Uvažuj o cestování, práci a obchodu."],
    solutionSteps: ["Bez EU = hranice, víza, cla, méně zahraničních investic — EU ulehčuje volný pohyb a trh."],
  },
  {
    question: "Který výrok o ČR a mezinárodních organizacích je NEPRAVDIVÝ?",
    correctAnswer: "ČR vstoupila do eurozóny roku 2004",
    options: [
      "ČR vstoupila do eurozóny roku 2004",
      "ČR vstoupila do NATO roku 1999",
      "ČR vstoupila do EU roku 2004",
      "ČR vstoupila do Schengenu roku 2007",
    ],
    hints: ["ČR dosud nepoužívá euro."],
    solutionSteps: ["ČR nikdy nevstoupila do eurozóny — stále používáme českou korunu."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const VZNIKCR1993CRVEUANATO: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-vznik-cr-1993-cr-v-eu-a-nato",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-vznik-cr-1993-cr-v-eu-a-nato",
    title: "Vznik ČR 1993, ČR v EU a NATO",
    studentTitle: "Vznik ČR a EU",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Pochopíš vznik ČR a její místo v Evropě.",
    keywords: ["vznik čr", "sametový rozvod", "eu", "nato", "schengen", "eurozóna", "česká koruna"],
    goals: [
      "Žák uvede datum vzniku ČR a podmínky rozdělení",
      "Žák zná členství ČR v NATO, EU a Schengenu a jejich roky",
      "Žák vysvětlí, proč ČR nemá euro",
    ],
    boundaries: ["Ekonomická kritéria eurozóny podrobně", "Vojenská struktura NATO"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Pamatuj: 1993 vznik ČR, 1999 NATO, 2004 EU, 2007 Schengen.",
      steps: [
        "1. 1. 1993: Sametový rozvod — vznik ČR a SR",
        "1999: ČR vstupuje do NATO",
        "1. 5. 2004: ČR vstupuje do EU",
        "2007: ČR vstupuje do Schengenu",
        "ČR nemá euro — používáme CZK",
      ],
      commonMistake: "Zaměňování roku vstupu do NATO (1999) a EU (2004).",
      example: "Sametový rozvod = pokojné rozdělení ČSR na dvě republiky — jako Sametová revoluce, ale jiné.",
    },
  },
];
