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
    question: "Co jsou data?",
    correctAnswer: "Surová fakta bez kontextu (čísla, slova bez vysvětlení)",
    options: shuffle(["Surová fakta bez kontextu (čísla, slova bez vysvětlení)", "Zpracované informace s kontextem", "Obrázky a videa", "Programy na počítači"]),
    hints: ["Data = jen čísla nebo slova bez vysvětlení.", "Příklad: '25', 'Praha', 'pondělí' — bez kontextu to jsou data."],
  },
  {
    question: "Co jsou informace?",
    correctAnswer: "Data s kontextem a významem",
    options: shuffle(["Data s kontextem a významem", "Surová čísla bez vysvětlení", "Obrázky a videa", "Počítačové programy"]),
    hints: ["Informace = data + kontext.", "'Zítra v Praze bude 25°C' — to je informace."],
  },
  {
    question: "'25' je příkladem:",
    correctAnswer: "Dat (surové číslo bez kontextu)",
    options: shuffle(["Dat (surové číslo bez kontextu)", "Informace", "Programu", "Algoritmu"]),
    hints: ["Samo číslo 25 bez vysvětlení = data.", "Co to 25 znamená? Nevíme bez kontextu."],
  },
  {
    question: "'Zítra v Praze bude 25°C' je příkladem:",
    correctAnswer: "Informace (data s kontextem)",
    options: shuffle(["Informace (data s kontextem)", "Surových dat", "Algoritmu", "Programu"]),
    hints: ["Máme kontext: kdy (zítra), kde (Praha), co (25°C).", "Kontext mění data na informaci."],
  },
  {
    question: "Jaký způsob přenosu informace je telefonát?",
    correctAnswer: "Ústní přenos (řeč)",
    options: shuffle(["Ústní přenos (řeč)", "Písemný přenos", "Vizuální přenos", "Digitální přenos přes internet"]),
    hints: ["Telefonát = mluvíme hlasem.", "Ústní = řeč, hlas."],
  },
  {
    question: "Jaký způsob přenosu informace je e-mail?",
    correctAnswer: "Digitální přenos (přes internet)",
    options: shuffle(["Digitální přenos (přes internet)", "Ústní přenos", "Vizuální přenos", "Písemný přenos papírem"]),
    hints: ["E-mail se posílá přes internet.", "Digitální = přes síť/internet."],
  },
  {
    question: "Jaký způsob přenosu informace je dopis?",
    correctAnswer: "Písemný přenos",
    options: shuffle(["Písemný přenos", "Ústní přenos", "Digitální přenos", "Vizuální přenos"]),
    hints: ["Dopis = psaný text na papíru.", "Písemný = text na fyzickém nosiči."],
  },
  {
    question: "Co je dezinformace?",
    correctAnswer: "Nepravdivá informace šířená záměrně nebo omylem",
    options: shuffle(["Nepravdivá informace šířená záměrně nebo omylem", "Správná informace ověřená odborníky", "Informace v digitální podobě", "Informace z encyklopedie"]),
    hints: ["Dezinformace = falešná, lživá informace.", "Může být záměrná nebo neúmyslná."],
  },
  {
    question: "Jaký zdroj informací je nejlepší ověřovat, protože může obsahovat nepravdivý obsah?",
    correctAnswer: "Internet (sociální sítě, neověřené weby)",
    options: shuffle(["Internet (sociální sítě, neověřené weby)", "Encyklopedie", "Odborné knihy", "Učebnice"]),
    hints: ["Na internetu může napsat cokoliv kdokoliv.", "Vždy ověřuj informace z internetu z více zdrojů."],
  },
  {
    question: "Jaká vlastnost informace říká, že musí být aktuální?",
    correctAnswer: "Aktuálnost",
    options: shuffle(["Aktuálnost", "Pravdivost", "Srozumitelnost", "Úplnost"]),
    hints: ["Aktuální = nová, platná v daný moment.", "Starý jízdní řád není aktuální."],
  },
  {
    question: "Jaká je vlastnost informace, která říká, že musí být pravdivá?",
    correctAnswer: "Pravdivost",
    options: shuffle(["Pravdivost", "Aktuálnost", "Srozumitelnost", "Úplnost"]),
    hints: ["Pravdivá informace = odpovídá skutečnosti.", "Lživá informace není pravdivá."],
  },
  {
    question: "Jaký způsob přenosu informace je obrázek nebo video?",
    correctAnswer: "Vizuální přenos",
    options: shuffle(["Vizuální přenos", "Ústní přenos", "Písemný přenos", "Digitální přenos"]),
    hints: ["Vizuální = pomocí obrazu.", "Obrázky, grafy, videa jsou vizuální."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč je důležité ověřovat informace z internetu?",
    correctAnswer: "Na internetu může publikovat kdokoliv — informace nemusí být pravdivé",
    options: shuffle(["Na internetu může publikovat kdokoliv — informace nemusí být pravdivé", "Internet je vždy správný", "Pouze starý obsah bývá chybný", "Jen placené weby mají pravdivé informace"]),
    hints: ["Na internetu není editor, který ověřuje pravdivost.", "Dezinformace se na internetu šíří rychle."],
  },
  {
    question: "Jaký je rozdíl mezi ústním a písemným přenosem informace?",
    correctAnswer: "Ústní = hlasem (telefonát, řeč); písemný = text (dopis, SMS, email)",
    options: shuffle(["Ústní = hlasem (telefonát, řeč); písemný = text (dopis, SMS, email)", "Jsou totéž", "Písemný je vždy rychlejší", "Ústní je přesnější"]),
    hints: ["Ústní = sluchem, písemný = čtením.", "Telefonát vs. e-mail."],
  },
  {
    question: "Jaká vlastnost informace říká, že musí být srozumitelná pro příjemce?",
    correctAnswer: "Srozumitelnost",
    options: shuffle(["Srozumitelnost", "Pravdivost", "Aktuálnost", "Úplnost"]),
    hints: ["Srozumitelná = příjemce jí rozumí.", "Informace v cizím jazyce není srozumitelná."],
  },
  {
    question: "SMS zpráva je příkladem přenosu informace:",
    correctAnswer: "Písemného digitálního přenosu",
    options: shuffle(["Písemného digitálního přenosu", "Ústního přenosu", "Vizuálního přenosu", "Přenosu rádiových vln"]),
    hints: ["SMS = textová zpráva přes mobilní síť.", "Písemný (text) + digitální (mobilní síť)."],
  },
  {
    question: "Jaký je spolehlivý zdroj informací pro školní práci?",
    correctAnswer: "Encyklopedie, odborné knihy, ověřené vzdělávací weby",
    options: shuffle(["Encyklopedie, odborné knihy, ověřené vzdělávací weby", "Sociální sítě (Facebook, Instagram)", "Náhodné blogy", "Neověřené weby bez autora"]),
    hints: ["Encyklopedie a odborné knihy mají ověřené informace.", "Sociální sítě nejsou spolehlivý zdroj."],
  },
  {
    question: "Co je informační šum?",
    correctAnswer: "Nepotřebné, rušivé informace, které ztěžují pochopení hlavní zprávy",
    options: shuffle(["Nepotřebné, rušivé informace, které ztěžují pochopení hlavní zprávy", "Zvukový záznam informace", "Chyba při přenosu dat", "Typ digitálního signálu"]),
    hints: ["Šum = rušení, co nechceš.", "Přebytečné reklamy jsou informační šum."],
  },
  {
    question: "Proč musí být informace úplná?",
    correctAnswer: "Neúplná informace může být zavádějící nebo způsobit špatné rozhodnutí",
    options: shuffle(["Neúplná informace může být zavádějící nebo způsobit špatné rozhodnutí", "Úplnost není důležitá", "Více informací = vždy lepší", "Krátká informace je vždy úplná"]),
    hints: ["Neúplná informace vynechává důležité části.", "Příklad: 'Lék pomáhá' bez zmínky o vedlejších účincích."],
  },
  {
    question: "Bluetooth je způsob přenosu informací:",
    correctAnswer: "Bezdrátový digitální přenos na krátkou vzdálenost",
    options: shuffle(["Bezdrátový digitální přenos na krátkou vzdálenost", "Kabelový přenos zvuku", "Vizuální přenos obrázků", "Ústní přenos hlasem"]),
    hints: ["Bluetooth = bezdrátové propojení na krátkou vzdálenost.", "Např. sluchátka připojená přes Bluetooth."],
  },
  {
    question: "WiFi je způsob přenosu informací:",
    correctAnswer: "Bezdrátový digitální přenos dat přes internet",
    options: shuffle(["Bezdrátový digitální přenos dat přes internet", "Kabelový internet", "Bluetooth propojení", "Hlasový přenos"]),
    hints: ["WiFi = bezdrátová síť doma nebo ve škole.", "Připojení telefonu k internetu přes WiFi."],
  },
  {
    question: "Proč je důležité číst informace z více zdrojů?",
    correctAnswer: "Různé zdroje se mohou lišit — porovnáním zjistíš pravdu",
    options: shuffle(["Různé zdroje se mohou lišit — porovnáním zjistíš pravdu", "Jeden zdroj je vždy dostačující", "Více zdrojů způsobuje zmatenost", "Pouze odborníci mohou číst více zdrojů"]),
    hints: ["Jeden zdroj může být chybný nebo zaujatý.", "Více zdrojů = lepší obraz reality."],
  },
  {
    question: "Jak se nazývá schopnost správně vybírat, hodnotit a používat informace?",
    correctAnswer: "Informační gramotnost",
    options: shuffle(["Informační gramotnost", "Počítačová gramotnost", "Digitální gramotnost", "Mediální gramotnost"]),
    hints: ["Gramotnost = schopnost pracovat s něčím.", "Informační = práce s informacemi."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Proč data sama o sobě nemají pro lidi informační hodnotu?",
    correctAnswer: "Bez kontextu nelze pochopit, co čísla nebo slova znamenají",
    options: shuffle(["Bez kontextu nelze pochopit, co čísla nebo slova znamenají", "Data jsou vždy cenná sama o sobě", "Data jsou informace", "Data jsou programy"]),
    hints: ["Data = suroviny, informace = výsledek zpracování.", "Číslo '37' bez kontextu nic neříká."],
  },
  {
    question: "Jak se data mění na informace?",
    correctAnswer: "Přidáním kontextu, zpracováním a interpretací",
    options: shuffle(["Přidáním kontextu, zpracováním a interpretací", "Kopírováním dat", "Přenosem přes internet", "Uložením na disk"]),
    hints: ["Kontext = kdy, kde, co.", "'37°C v 8:00 ráno' → informace o teplotě."],
  },
  {
    question: "Záměrně šířená nepravdivá informace za účelem manipulace se nazývá:",
    correctAnswer: "Propaganda nebo dezinformace",
    options: shuffle(["Propaganda nebo dezinformace", "Reklama", "Informační gramotnost", "Digitální obsah"]),
    hints: ["Propaganda = záměrné ovlivňování veřejného mínění.", "Dezinformace = nepravdivé informace šířené úmyslně."],
  },
  {
    question: "Co je informační přetížení (information overload)?",
    correctAnswer: "Stav, kdy je informací příliš mnoho a člověk je nedokáže zpracovat",
    options: shuffle(["Stav, kdy je informací příliš mnoho a člověk je nedokáže zpracovat", "Nedostatek informací", "Šifrování dat", "Výpadek internetu"]),
    hints: ["Přetížení = příliš mnoho informací najednou.", "Moderní problém digitální éry."],
  },
  {
    question: "Proč je aktuálnost informace důležitá v lékařství?",
    correctAnswer: "Zastaralé lékařské informace mohou ohrozit zdraví pacienta",
    options: shuffle(["Zastaralé lékařské informace mohou ohrozit zdraví pacienta", "Aktuálnost v lékařství není důležitá", "Starší informace jsou přesnější", "Jen informace z internetu jsou aktuální"]),
    hints: ["Léčba, která byla správná v roce 1990, nemusí být správná dnes.", "Aktuálnost = platnost v daném čase."],
  },
  {
    question: "Jaký je rozdíl mezi analogovým a digitálním přenosem informací?",
    correctAnswer: "Analogový = nepřetržitý signál (rádio, telefon); digitální = binární data (0 a 1)",
    options: shuffle(["Analogový = nepřetržitý signál (rádio, telefon); digitální = binární data (0 a 1)", "Jsou totéž", "Digitální je vždy pomalejší", "Analogový přenos neexistuje"]),
    hints: ["Digitální = 0 a 1, počítačová data.", "Analogový = plynulý signál jako zvukové vlny."],
  },
  {
    question: "Proč je vizuální přenos informace (obrázky, grafy) efektivní?",
    correctAnswer: "Mozek zpracovává obrázky rychleji než text",
    options: shuffle(["Mozek zpracovává obrázky rychleji než text", "Obrázky jsou vždy přesnější", "Vizuální přenos je levnější", "Obrázky neobsahují dezinformace"]),
    hints: ["Graf rychle ukáže trendy, které by popsání slovně zabralo odstavce.", "Vizuální komunikace je efektivní."],
  },
  {
    question: "Jak ověříš pravdivost informace z internetu?",
    correctAnswer: "Hledáš stejnou informaci ve více důvěryhodných zdrojích a porovnáš",
    options: shuffle(["Hledáš stejnou informaci ve více důvěryhodných zdrojích a porovnáš", "Věříš prvnímu výsledku vyhledávání", "Informaci sdílíš bez ověření", "Ptáš se jen kamarádů"]),
    hints: ["Více zdrojů = větší jistota.", "Důvěryhodné = encyklopedie, odborné weby, noviny."],
  },
  {
    question: "Proč může stejná informace mít různý význam pro různé lidi?",
    correctAnswer: "Záleží na kontextu, zkušenostech a znalostech příjemce",
    options: shuffle(["Záleží na kontextu, zkušenostech a znalostech příjemce", "Informace má vždy jen jeden výklad", "Záleží jen na jazyce", "Záleží jen na médiu přenosu"]),
    hints: ["Lékaři informace o nemoci pochopí jinak než pacient.", "Kontext příjemce mění pochopení."],
  },
  {
    question: "Co je metadata?",
    correctAnswer: "Data o datech — popis vlastností souboru (kdy, kdo, jak velký)",
    options: shuffle(["Data o datech — popis vlastností souboru (kdy, kdo, jak velký)", "Vizuální informace", "Zdroj informace", "Dezinformace"]),
    hints: ["Metadata = datum vytvoření, autor, velikost souboru.", "Jako štítek na krabičce popisující obsah."],
  },
  {
    question: "Proč je důležité uvádět zdroj informace?",
    correctAnswer: "Aby příjemce mohl ověřit pravdivost a zjistit autora",
    options: shuffle(["Aby příjemce mohl ověřit pravdivost a zjistit autora", "Zdroj není důležitý", "Kvůli autorskému právu jen u obrázků", "Jen odborníci uvádějí zdroje"]),
    hints: ["Zdroj = odkud informace pochází.", "Bez zdroje nelze ověřit pravdivost."],
  },
  {
    question: "Jaký je rozdíl mezi primárním a sekundárním zdrojem informací?",
    correctAnswer: "Primární = původní zdroj (výzkum, svědek); sekundární = zpracování jiného zdroje (učebnice, článek)",
    options: shuffle(["Primární = původní zdroj (výzkum, svědek); sekundární = zpracování jiného zdroje (učebnice, článek)", "Jsou totéž", "Primární je vždy lepší", "Sekundární je vždy přesnější"]),
    hints: ["Primární = z první ruky.", "Sekundární = přepis nebo shrnutí primárního."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool =
    level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 35);
}

export const INFORMACEVYZNAMAPREDAVANIINFORMACI: TopicMetadata[] = [
  {
    id: "g4-informatika-data-informace-a-modelovani-data-a-informace-informace-vyznam-a-predavani-informaci",
    rvpNodeId: "g4-informatika-data-informace-a-modelovani-data-a-informace-informace-vyznam-a-predavani-informaci",
    title: "Informace, význam a předávání informací",
    studentTitle: "Co jsou informace",
    subject: "informatika",
    category: "Data, informace a modelování",
    topic: "Data, informace a modelování",
    briefDescription: "Pochopíš rozdíl mezi daty a informacemi a naučíš se, jak se informace přenášejí.",
    keywords: ["data", "informace", "přenos", "dezinformace", "zdroj", "pravdivost"],
    goals: [
      "Žák rozliší data a informace a uvede příklady",
      "Žák vyjmenuje způsoby přenosu informací",
      "Žák popíše vlastnosti kvalitní informace",
    ],
    boundaries: ["Žák se nezabývá šifrováním ani technickými protokoly přenosu dat"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "conceptual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Data = surová fakta (číslo, slovo) bez kontextu. Informace = data + kontext a smysl.",
      steps: [
        "Je to surové číslo/slovo bez vysvětlení? → Data",
        "Má to kontext (kdy, kde, co)? → Informace",
        "Jak se informace přenáší? Ústně, písemně, vizuálně, digitálně",
      ],
      commonMistake: "Záměna dat a informací — samotné číslo '25' jsou data, '25°C v Praze zítra' je informace.",
      example: "'Praha' = data. 'Hlavní město ČR je Praha' = informace.",
    },
  },
];
