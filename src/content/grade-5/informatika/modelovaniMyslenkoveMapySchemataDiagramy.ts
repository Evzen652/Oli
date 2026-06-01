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
  { question: "Co je myšlenková mapa (mindmap)?", correctAnswer: "Vizuální nástroj s ústředním pojmem a větvemi pro organizaci myšlenek", options: ["Vizuální nástroj s ústředním pojmem a větvemi pro organizaci myšlenek", "Tabulka dat", "Vývojový diagram kroků", "Graf s čísly"], hints: ["Myšlenková mapa = pavoučí síť nápadů."] },
  { question: "Co je vývojový diagram?", correctAnswer: "Diagram zachycující postup kroků a rozhodnutí pomocí symbolů", options: ["Diagram zachycující postup kroků a rozhodnutí pomocí symbolů", "Myšlenková mapa bez textů", "Tabulka dat", "Obrázek bez popisu"], hints: ["Vývojový diagram = kroky + rozhodnutí graficky."] },
  { question: "Jaký tvar se ve vývojovém diagramu používá pro kroky (akce)?", correctAnswer: "Obdélník", options: ["Obdélník", "Kosočtverec – diamant", "Ovál", "Kruh"], hints: ["Akce = obdélník ve vývojovém diagramu."] },
  { question: "Jaký tvar se ve vývojovém diagramu používá pro rozhodnutí (otázku Ano/Ne)?", correctAnswer: "Kosočtverec – diamant", options: ["Kosočtverec – diamant", "Obdélník", "Ovál", "Šipka"], hints: ["Rozhodnutí = kosočtverec (otázka s větvením)."] },
  { question: "K čemu se nejlépe hodí myšlenková mapa?", correctAnswer: "K organizaci nápadů a brainstormingu — nelineární přehled témat", options: ["K organizaci nápadů a brainstormingu — nelineární přehled témat", "K popisu přesného postupu kroků", "K zobrazení číselných dat", "K psaní textu"], hints: ["Myšlenková mapa = volné asociace, ne přesný postup."] },
  { question: "K čemu se nejlépe hodí vývojový diagram?", correctAnswer: "K popisu přesného postupu – algoritmu s rozhodnutími", options: ["K popisu přesného postupu – algoritmu s rozhodnutími", "K organizaci volných nápadů", "K zobrazení číselných dat v grafu", "K zápisu textu"], hints: ["Vývojový diagram = krok za krokem + rozhodnutí."] },
  { question: "Co je sloupcový (pruhový) diagram?", correctAnswer: "Graf porovnávající hodnoty pomocí sloupců různé výšky", options: ["Graf porovnávající hodnoty pomocí sloupců různé výšky", "Kruhový přehled podílů", "Mapa s větvemi", "Schéma kroků"], hints: ["Sloupcový diagram = různě vysoké sloupce."] },
  { question: "Co je koláčový (kruhový) diagram?", correctAnswer: "Kruh rozdělený na výseče znázorňující podíly celku", options: ["Kruh rozdělený na výseče znázorňující podíly celku", "Graf s různě vysokými sloupci", "Myšlenková mapa", "Vývojový diagram"], hints: ["Koláčový = jako koláč rozdělený na kousky."] },
  { question: "Jaký diagram použiji k zobrazení, kolik procent žáků má jakou oblíbenou barvu?", correctAnswer: "Koláčový diagram – podíly celku", options: ["Koláčový diagram – podíly celku", "Sloupcový diagram", "Myšlenková mapa", "Vývojový diagram"], hints: ["Podíly z celku = koláčový."] },
  { question: "Jaký diagram použiji k porovnání počtu žáků v různých třídách?", correctAnswer: "Sloupcový – pruhový diagram", options: ["Sloupcový – pruhový diagram", "Koláčový diagram", "Myšlenková mapa", "Vývojový diagram"], hints: ["Porovnání hodnot = sloupcový."] },
  { question: "Co jsou šipky ve vývojovém diagramu?", correctAnswer: "Označují směr průchodu diagramem — co následuje po čem", options: ["Označují směr průchodu diagramem — co následuje po čem", "Jsou jen dekorační", "Označují rozhodnutí", "Označují akce"], hints: ["Šipka = směr průchodu."] },
  { question: "Jak se nazývá střed myšlenkové mapy?", correctAnswer: "Ústřední – centrální pojem nebo téma", options: ["Ústřední – centrální pojem nebo téma", "Větev", "Uzol", "Záhlaví"], hints: ["Střed mapy = hlavní téma, od kterého vedou větve."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Chci naplánovat projekt 'Naše školní zahrada'. Jaký nástroj nejlépe pomůže s organizací nápadů?", correctAnswer: "Myšlenková mapa — zachytí různé nápady a jejich vztahy", options: ["Myšlenková mapa — zachytí různé nápady a jejich vztahy", "Vývojový diagram — přesný postup kroků", "Sloupcový diagram — porovnání čísel", "Tabulka dat"], hints: ["Myšlenková mapa = organizace volných nápadů."] },
  { question: "Chci popsat, jak připravit sendvič (kroky + rozhodnutí, zda přidat hořčici). Jaký nástroj použiji?", correctAnswer: "Vývojový diagram — kroky + rozhodnutí Ano/Ne", options: ["Vývojový diagram — kroky + rozhodnutí Ano/Ne", "Myšlenková mapa", "Koláčový diagram", "Tabulka dat"], hints: ["Postup kroků + větvení = vývojový diagram."] },
  { question: "Ve vývojovém diagramu mám rozhodnutí: 'Je žák přihlášen? Ano → přejdi na stránku; Ne → zobraz přihlášení'. Jaký tvar mám použít pro toto rozhodnutí?", correctAnswer: "Kosočtverec – diamant", options: ["Kosočtverec – diamant", "Obdélník", "Ovál", "Kruh"], hints: ["Rozhodnutí = kosočtverec s větvením Ano/Ne."] },
  { question: "Myšlenková mapa o 'Létu' má větve: Dovolená, Zmrzlina, Prázdniny, Koupání. Co jsou to za větve?", correctAnswer: "Hlavní větve – podtémata vycházející z ústředního pojmu Léto", options: ["Hlavní větve – podtémata vycházející z ústředního pojmu Léto", "Ústřední pojmy", "Kroky vývojového diagramu", "Sloupce tabulky"], hints: ["Větve = podtémata ústředního pojmu."] },
  { question: "Chci ukázat, jak se mění počet žáků v knihovně každý den v týdnu. Jaký diagram je nejvhodnější?", correctAnswer: "Sloupcový nebo liniový – spojnicový diagram — porovnání hodnot v čase", options: ["Sloupcový nebo liniový – spojnicový diagram — porovnání hodnot v čase", "Koláčový diagram", "Myšlenková mapa", "Vývojový diagram"], hints: ["Hodnoty v čase = sloupcový nebo liniový."] },
  { question: "Jaký je rozdíl mezi myšlenkovou mapou a vývojovým diagramem?", correctAnswer: "Myšlenková mapa = volné asociace bez pořadí; vývojový diagram = přesný postup s pořadím", options: ["Myšlenková mapa = volné asociace bez pořadí; vývojový diagram = přesný postup s pořadím", "Jsou totéž", "Vývojový diagram nemá pořadí", "Myšlenková mapa má jen jeden uzel"], hints: ["Mapa = chaos nápadů; diagram = přesný postup."] },
  { question: "Ve vývojovém diagramu: Start → Zadej číslo → Je číslo > 0? Ano → Vypiš Kladné; Ne → Vypiš Záporné → Konec. Co dělá diagram, pokud zadám číslo 5?", correctAnswer: "Vypíše 'Kladné' – 5 > 0 je pravda", options: ["Vypíše 'Kladné' – 5 > 0 je pravda", "Vypíše 'Záporné'", "Diagram se zastaví", "Vypíše 5"], hints: ["5 > 0 je pravda → větev Ano → Kladné."] },
  { question: "Chci zobrazit podíl dívek (60 %) a chlapců (40 %) ve třídě. Jaký diagram je nejlepší?", correctAnswer: "Koláčový diagram — podíly z celku", options: ["Koláčový diagram — podíly z celku", "Sloupcový diagram", "Liniový diagram", "Vývojový diagram"], hints: ["Podíly z celku (%) = koláčový."] },
  { question: "Proč je myšlenková mapa nelineární?", correctAnswer: "Větve mohou vycházet z různých míst a nemají pevné pořadí", options: ["Větve mohou vycházet z různých míst a nemají pevné pořadí", "Mapa má vždy jen jednu větev", "Větve musí být vždy v pořadí", "Myšlenková mapa je vždy lineární"], hints: ["Nelineární = bez pevného pořadí kroků."] },
  { question: "Jak označím začátek a konec ve vývojovém diagramu?", correctAnswer: "Oválem nebo zaoblenými obdélníky se štítkem Start/Konec", options: ["Oválem nebo zaoblenými obdélníky se štítkem Start/Konec", "Kosočtvercem", "Obdélníkem", "Šipkou"], hints: ["Ovál = Start nebo Konec ve vývojovém diagramu."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Mám data: třída A má 25 žáků, třída B 30, třída C 20. Chci porovnat počty. Jaký diagram?", correctAnswer: "Sloupcový diagram — porovnání hodnot jednotlivých kategorií", options: ["Sloupcový diagram — porovnání hodnot jednotlivých kategorií", "Koláčový diagram", "Liniový diagram", "Myšlenková mapa"], hints: ["Porovnání kategorií = sloupcový."] },
  { question: "Mám myšlenkovou mapu o 'Informatice' s větví 'Programování'. Z té větve vychází 'Scratch' a 'Python'. Jak se nazývá 'Scratch' vůči 'Informatice'?", correctAnswer: "Podvětev — podtéma podtématu ústředního pojmu", options: ["Podvětev — podtéma podtématu ústředního pojmu", "Ústřední pojem", "Hlavní větev", "Vedlejší uzel"], hints: ["Informatika → Programování → Scratch = dvě úrovně hluboko."] },
  { question: "Vývojový diagram: Is it raining? Ano → Take umbrella; Ne → Leave umbrella. Přidám třetí možnost: 'Je zataženo? → Vezmi si bundu'. Jak to zapracuji?", correctAnswer: "Přidám další kosočtverec za větev Ne a větvím dál – Je zataženo? Ano/Ne", options: ["Přidám další kosočtverec za větev Ne a větvím dál – Je zataženo? Ano/Ne", "Přidám obdélník k větvi Ano", "Smažu původní rozhodnutí", "Přidám šipku zpátky na Start"], hints: ["Každé rozhodnutí = kosočtverec. Větvení pokračuje."] },
  { question: "Proč je liniový (spojnicový) diagram lepší než sloupcový pro zobrazení teplot každý den v měsíci?", correctAnswer: "Liniový ukazuje průběh a trend v čase; sloupcový je vhodný pro kategorie, ne continuální data", options: ["Liniový ukazuje průběh a trend v čase; sloupcový je vhodný pro kategorie, ne continuální data", "Sloupcový je vždy lepší", "Jsou totéž", "Koláčový je nejlepší pro teploty"], hints: ["Průběh v čase = liniový; kategorie = sloupcový."] },
  { question: "Chci vytvořit myšlenkovou mapu pro plánování dovolené. Jaké by mohly být hlavní větve?", correctAnswer: "Doprava, Ubytování, Aktivity, Jídlo, Rozpočet", options: ["Doprava, Ubytování, Aktivity, Jídlo, Rozpočet", "Leden, Únor, Březen", "Pondělí, Úterý, Středa", "Excel, Word, PowerPoint"], hints: ["Myšlenková mapa = organizace témat dovolené."] },
  { question: "Ve vývojovém diagramu: zadám číslo 0. Podmínka: je číslo > 0? Co se stane?", correctAnswer: "Podmínka je nepravda → větev Ne – 0 není větší než 0", options: ["Podmínka je nepravda → větev Ne – 0 není větší než 0", "Podmínka je pravda → větev Ano", "Diagram se zastaví", "Číslo se zvýší na 1"], hints: ["0 > 0 je nepravda — 0 není větší než 0."] },
  { question: "Jaká je výhoda vizuálního znázornění (diagramu/mapy) oproti textu?", correctAnswer: "Vizualizace umožňuje rychle pochopit vztahy a strukturu — je přehlednější", options: ["Vizualizace umožňuje rychle pochopit vztahy a strukturu — je přehlednější", "Text je vždy lepší", "Vizualizace obsahuje více informací než text", "Vizualizace nelze vytvořit bez počítače"], hints: ["Obrázek = 1000 slov — vzory jsou vidět na první pohled."] },
  { question: "Mám koláčový diagram: Fotbal 40 %, Basketbal 30 %, Tenis 20 %, Plavání 10 %. Kolik procent zbývá, pokud přidám Hokej?", correctAnswer: "0 % — celkový součet je 100 %, nelze přidat bez změny ostatních hodnot", options: ["0 % — celkový součet je 100 %, nelze přidat bez změny ostatních hodnot", "10 %", "20 %", "30 %"], hints: ["Koláčový diagram = 100 % celkem. 40+30+20+10 = 100."] },
  { question: "Jak se liší schéma od diagramu?", correctAnswer: "Schéma je obecnější vizuální popis struktury; diagram má přesná pravidla – tvary, šipky", options: ["Schéma je obecnější vizuální popis struktury; diagram má přesná pravidla – tvary, šipky", "Jsou totéž", "Schéma má přesná pravidla, diagram ne", "Diagram je vždy myšlenková mapa"], hints: ["Schéma = volnější; diagram = standardizovaný."] },
  { question: "Vývojový diagram popisuje: Uvař vodu → Je voda vařící? Ne → Pokračuj zahřívat; Ano → Přidej čaj → Konec. Co dělá tato smyčka?", correctAnswer: "Opakuje zahřívání, dokud voda nezačne vřít", options: ["Opakuje zahřívání, dokud voda nezačne vřít", "Přidá čaj ihned", "Zastaví se bez přidání čaje", "Voda se zahřeje jen jednou"], hints: ["Smyčka ve vývojovém diagramu = opakuj, dokud podmínka nenastane."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const MODELOVANIMYSLENKOVEMAPYSCHEMATADIAGRAMY: TopicMetadata[] = [
  {
    id: "g5-informatika-data-informace-a-modelovani-prace-s-daty-modelovani-myslenkove-mapy-schemata-diagramy",
    rvpNodeId: "g5-informatika-data-informace-a-modelovani-prace-s-daty-modelovani-myslenkove-mapy-schemata-diagramy",
    title: "Modelování - myšlenkové mapy, schémata, diagramy",
    studentTitle: "Myšlenkové mapy a schémata",
    subject: "informatika",
    category: "Data, informace a modelování",
    topic: "Práce s daty",
    briefDescription: "Naučíš se organizovat nápady pomocí map a schémat.",
    keywords: ["myšlenková mapa", "mindmap", "vývojový diagram", "schema", "diagram", "sloupcový graf", "koláčový graf"],
    goals: [
      "Vytvoří myšlenkovou mapu pro organizaci nápadů.",
      "Čte a tvoří jednoduchý vývojový diagram.",
      "Vybere vhodný typ diagramu pro danou situaci.",
    ],
    boundaries: ["Pokročilé diagramy UML", "Statistické grafy nad rámec základních typů", "Databázové schémata"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Myšlenková mapa = nápady kolem ústředního pojmu. Vývojový diagram = kroky + rozhodnutí. Sloupcový = porovnání; koláčový = podíly.",
      steps: [
        "Rozhodnu, co chci znázornit (nápady, postup, nebo data).",
        "Mapa = nápady bez pevného pořadí. Diagram = přesný postup.",
        "Ve vývojovém diagramu použiji obdélník pro akce, kosočtverec pro rozhodnutí.",
        "Pro čísla zvolím sloupcový nebo koláčový diagram.",
      ],
      commonMistake: "Záměna koláčového a sloupcového diagramu — koláčový je pro podíly (%), sloupcový pro porovnání hodnot.",
      example: "Myšlenková mapa: Léto → Dovolená, Zmrzlina, Koupání. Vývojový diagram: Je horko? Ano → Kup zmrzlinu; Ne → Dej čaj.",
    },
  },
];
