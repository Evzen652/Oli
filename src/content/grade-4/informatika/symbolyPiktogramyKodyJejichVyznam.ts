import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MATCH_TASKS: PracticeTask[] = [
  {
    question: "Spoj symboly s jejich správným názvem/popisem:",
    correctAnswer: "Piktogram WC-Záchod|Piktogram nouzový východ-Zelená úniková šipka|Červený kruh přeškrtnutý-Zákaz|Modrý kruh s bílým symbolem-Příkaz",
    pairs: [
      { left: "Piktogram WC", right: "Záchod" },
      { left: "Piktogram nouzový východ", right: "Zelená úniková šipka" },
      { left: "Červený kruh přeškrtnutý", right: "Zákaz" },
      { left: "Modrý kruh s bílým symbolem", right: "Příkaz" },
    ],
    hints: ["WC = místo s toaletami.", "Zelená šipka = kde jít v případě nouze."],
  },
  {
    question: "Spoj druhy dopravních značek s jejich popisem:",
    correctAnswer: "Červený kruh s černým symbolem-Zákazová značka|Žlutý trojúhelník-Výstražná značka|Modrý čtverec-Informační značka|Modrý kruh-Příkazová značka",
    pairs: [
      { left: "Červený kruh s černým symbolem", right: "Zákazová značka" },
      { left: "Žlutý trojúhelník", right: "Výstražná značka" },
      { left: "Modrý čtverec", right: "Informační značka" },
      { left: "Modrý kruh", right: "Příkazová značka" },
    ],
    hints: ["Červený kruh = zákaz (např. zákaz předjíždění).", "Trojúhelník = pozor, nebezpečí."],
  },
  {
    question: "Spoj barvy semaforu s jejich významem:",
    correctAnswer: "Červená-Stůj|Oranžová-Pozor / připrav se|Zelená-Volno / jdi",
    pairs: [
      { left: "Červená", right: "Stůj" },
      { left: "Oranžová", right: "Pozor / připrav se" },
      { left: "Zelená", right: "Volno / jdi" },
    ],
    hints: ["Červená = stop, zelená = go.", "Oranžová je uprostřed — přechod."],
  },
  {
    question: "Spoj kódy s jejich popisem:",
    correctAnswer: "QR kód-Čtvercový 2D kód čtený mobilem|Čárový kód-Pruhy na zboží čtené laserovou čtečkou|Morseova abeceda-Tečky a čárky jako kód písmen|SOS-Záchranný signál v Morseově abecedě",
    pairs: [
      { left: "QR kód", right: "Čtvercový 2D kód čtený mobilem" },
      { left: "Čárový kód", right: "Pruhy na zboží čtené laserovou čtečkou" },
      { left: "Morseova abeceda", right: "Tečky a čárky jako kód písmen" },
      { left: "SOS", right: "Záchranný signál v Morseově abecedě" },
    ],
    hints: ["QR kód = naskenuješ mobilem.", "SOS = ···−−−··· v Morseově abecedě."],
  },
];

const SELECT_L1: PracticeTask[] = [
  {
    question: "Co je piktogram?",
    correctAnswer: "Obrázkový symbol s obecně srozumitelným významem",
    options: shuffle(["Obrázkový symbol s obecně srozumitelným významem", "Textový popis", "Zvukový signál", "Druh kódu pro přenos dat"]),
    hints: ["Piktogram = obrázek místo slova.", "WC, exit, kuřák přeškrtnutý jsou piktogramy."],
  },
  {
    question: "Proč jsou piktogramy vhodné na mezinárodních místech (letiště, nádraží)?",
    correctAnswer: "Jsou srozumitelné bez ohledu na jazyk",
    options: shuffle(["Jsou srozumitelné bez ohledu na jazyk", "Jsou levnější než nápisy", "Lépe se tisknou", "Platí jen v ČR"]),
    hints: ["Obrázek vidíš bez znalosti češtiny.", "Na letišti pochopíš WC piktogram, i když nemluvíš česky."],
  },
  {
    question: "Co označuje zelená piktogramová tabulka s běžící figurkou a šipkou?",
    correctAnswer: "Nouzový východ / úniková cesta",
    options: shuffle(["Nouzový východ / úniková cesta", "Vstup zakázán", "Parkoviště", "Záchod"]),
    hints: ["Zelená figurka = bezpečná cesta.", "V případě požáru ji sleduj."],
  },
  {
    question: "Co je QR kód?",
    correctAnswer: "Čtvercový 2D kód, který naskenujeme mobilem a dostaneme odkaz nebo informaci",
    options: shuffle(["Čtvercový 2D kód, který naskenujeme mobilem a dostaneme odkaz nebo informaci", "Čárový kód na potravinách", "Barva semaforu", "Morseův signál"]),
    hints: ["QR = Quick Response (rychlá odezva).", "Restaurace mají jídelní lístek jako QR kód."],
  },
  {
    question: "K čemu slouží čárový kód na zboží v obchodě?",
    correctAnswer: "Čtečka ho přečte a zobrazí cenu a informace o produktu",
    options: shuffle(["Čtečka ho přečte a zobrazí cenu a informace o produktu", "Je to dekorace", "Slouží jako QR kód", "Ukazuje datum výroby"]),
    hints: ["Pokladní čtečka = laser + čárový kód.", "Čárový kód = identifikátor produktu."],
  },
  {
    question: "Co je Morseova abeceda?",
    correctAnswer: "Kód písmen z teček a čárek pro telegrafii",
    options: shuffle(["Kód písmen z teček a čárek pro telegrafii", "Typ piktogramu", "Moderní šifrování internetu", "Kód pro QR čtečky"]),
    hints: ["Morseova abeceda = tečky (.) a čárky (-).", "Historická telegrafie používala Morseovu abecedu."],
  },
  {
    question: "Co znamená signal SOS v Morseově abecedě?",
    correctAnswer: "Záchranný/tísňový signál (Pomoc!)",
    options: shuffle(["Záchranný/tísňový signál (Pomoc!)", "Zpráva 'Vše v pořádku'", "Kód pro potvrzení zprávy", "Konec přenosu"]),
    hints: ["SOS = ···−−−···", "SOS se používá při nouzi na moři nebo v lese."],
  },
  {
    question: "Jaký tvar má zákazová dopravní značka?",
    correctAnswer: "Červený kruh s černým symbolem",
    options: shuffle(["Červený kruh s černým symbolem", "Žlutý trojúhelník", "Modrý čtverec", "Zelený obdélník"]),
    hints: ["Zákazové značky = červené kruhy.", "Zákaz vstupu = červený kruh."],
  },
  {
    question: "Jaký tvar má výstražná dopravní značka?",
    correctAnswer: "Žlutý trojúhelník s červeným okrajem",
    options: shuffle(["Žlutý trojúhelník s červeným okrajem", "Červený kruh", "Modrý kruh", "Zelený obdélník"]),
    hints: ["Výstražná = trojúhelník = pozor!", "Výstražná = upozorní na nebezpečí."],
  },
  {
    question: "Co říká semafor pro chodce, když svítí červená figurka?",
    correctAnswer: "Stůj — nesmíš přecházet",
    options: shuffle(["Stůj — nesmíš přecházet", "Přecházej rychle", "Přecházej pomalu", "Jdi, ale pozor"]),
    hints: ["Červená = stůj vždy (pro auta i chodce).", "Zelená figurka = přecházej."],
  },
  {
    question: "Co říká symbol přeškrtnuté cigarety?",
    correctAnswer: "Kouření zakázáno",
    options: shuffle(["Kouření zakázáno", "Kouření povoleno", "Zóna bez elektroniky", "Vstup zakázán"]),
    hints: ["Přeškrtnutí symbolu = zákaz.", "Cigareta přeškrtnutá = nesmíš kouřit."],
  },
  {
    question: "Kde nejčastěji narazíš na QR kód?",
    correctAnswer: "Na plakátech, obalech, v restauracích (jídelní lístek)",
    options: shuffle(["Na plakátech, obalech, v restauracích (jídelní lístek)", "Na dopravních značkách", "Na semaforech", "Na klávesnicích"]),
    hints: ["QR kód naskenujete mobilem a dostanete odkaz.", "Restaurace, letenky, reklamy mají QR kódy."],
  },
];

const SELECT_L2: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi QR kódem a čárovým kódem?",
    correctAnswer: "QR kód = 2D (čtverec), více dat; čárový kód = 1D (pruhy), méně dat",
    options: shuffle(["QR kód = 2D (čtverec), více dat; čárový kód = 1D (pruhy), méně dat", "Jsou totéž", "Čárový kód ukládá více dat", "QR kód se čte laserem"]),
    hints: ["QR = čtverec s tečkami = více informací.", "Čárový = pruhy = jen číslo."],
  },
  {
    question: "Proč jsou záchranné cedule vždy zelené?",
    correctAnswer: "Zelená = bezpečí, úniková cesta — mezinárodní norma",
    options: shuffle(["Zelená = bezpečí, úniková cesta — mezinárodní norma", "Zelená je nejlevnější barva", "Zelená je nejlépe viditelná barva", "Zelená je barva přírody"]),
    hints: ["Zelená = volno/bezpečí (i semafor).", "Mezinárodní norma = platí globálně."],
  },
  {
    question: "Co je zkratka QR v 'QR kód'?",
    correctAnswer: "Quick Response (rychlá odezva)",
    options: shuffle(["Quick Response (rychlá odezva)", "Quality Rating", "Queue Reader", "Quantum Registry"]),
    hints: ["QR = čte se velmi rychle.", "Quick = rychlý, Response = odezva."],
  },
  {
    question: "Jaký symbol by jsi hledal/a při hledání záchranky/emergency?",
    correctAnswer: "Bílý kříž na zeleném pozadí (lékárna/zdravotnická pomoc)",
    options: shuffle(["Bílý kříž na zeleném pozadí (lékárna/zdravotnická pomoc)", "Červený trojúhelník", "Modrý kruh", "Přeškrtnutá figurka"]),
    hints: ["Kříž = zdravotnictví.", "Zelené pozadí = bezpečí."],
  },
  {
    question: "Co měla Morseova abeceda umožnit, čehož předtím nebylo možné?",
    correctAnswer: "Přenášet zprávy na velké vzdálenosti pomocí telegrafní linky",
    options: shuffle(["Přenášet zprávy na velké vzdálenosti pomocí telegrafní linky", "Posílat obrázky", "Šifrovat hesla", "Číst tiskopisy"]),
    hints: ["Telegraf = první elektrická komunikace na dálku.", "Morseova abeceda = kód pro telegraf."],
  },
  {
    question: "Jaká je výhoda piktogramů oproti textovým nápisům?",
    correctAnswer: "Pochopíš je bez znalosti jazyka — jsou mezinárodní",
    options: shuffle(["Pochopíš je bez znalosti jazyka — jsou mezinárodní", "Jsou přesnější než text", "Jsou levnější na výrobu", "Lépe se pamatují než čísla"]),
    hints: ["Letiště = lidé z celého světa.", "Piktogram WC pochopí všichni."],
  },
  {
    question: "Co je piktogram recyklace (třešlapivé šipky do trojúhelníku)?",
    correctAnswer: "Výzva k recyklaci / symbol recyklovatelného materiálu",
    options: shuffle(["Výzva k recyklaci / symbol recyklovatelného materiálu", "Zákaz vyhazování", "Symbol pro WiFi", "Označení nebezpečného odpadu"]),
    hints: ["Tři šipky v kruhu = koloběh = recyklace.", "Na obalech = recykluj po použití."],
  },
  {
    question: "Jaké barvy mají informační dopravní značky?",
    correctAnswer: "Modré pozadí (nebo zelené na dálnicích)",
    options: shuffle(["Modré pozadí (nebo zelené na dálnicích)", "Červené pozadí", "Žluté pozadí", "Bílé pozadí"]),
    hints: ["Modré = informace (parkoviště, nemocnice).", "Zelené = dálniční informační tabule."],
  },
  {
    question: "Co je nebezpečnostní piktogram lebky s hnáty?",
    correctAnswer: "Symbol jedovatosti nebo smrtelného nebezpečí",
    options: shuffle(["Symbol jedovatosti nebo smrtelného nebezpečí", "Symbol piráta", "Symbol recyklace", "Symbol elektřiny"]),
    hints: ["Lebka = nebezpečí pro život.", "Na chemikáliích a jedovatých látkách."],
  },
  {
    question: "Proč je důležité, aby byly semafory na každé křižovatce stejné (červená = stůj)?",
    correctAnswer: "Standardizace zabraňuje nehodám — každý řidič ví co barvy znamenají",
    options: shuffle(["Standardizace zabraňuje nehodám — každý řidič ví co barvy znamenají", "Je to jen tradice", "Kvůli estetice", "Levnější výroba"]),
    hints: ["Pokud by červená znamenala jinde 'jeď', bylo by to nebezpečné.", "Standardizace = stejná pravidla všude."],
  },
  {
    question: "Co je piktogram na zboží v podobě pralenu (sklenička s křížkem)?",
    correctAnswer: "Nevhazovat do koše / křehké",
    options: shuffle(["Nevhazovat do koše / křehké", "Mít zboží v suchu", "Recyklovat sklo", "Nebezpečný obsah"]),
    hints: ["Zlomená sklenička = křehké, opatrně!", "Na zásilkách a baleních."],
  },
];

const SELECT_L3: PracticeTask[] = [
  {
    question: "Proč je standardizace piktogramů (norma ISO) důležitá?",
    correctAnswer: "Zajišťuje, že stejný symbol má stejný význam po celém světě",
    options: shuffle(["Zajišťuje, že stejný symbol má stejný význam po celém světě", "Je to jen doporučení", "Platí jen v Evropě", "Norma platí jen pro dopravní značky"]),
    hints: ["ISO = mezinárodní normalizační organizace.", "Stejný piktogram = stejný smysl globálně."],
  },
  {
    question: "Jak se kóduje písmeno 'A' v Morseově abecedě?",
    correctAnswer: "· – (tečka pomlčka)",
    options: shuffle(["· – (tečka pomlčka)", "– · (pomlčka tečka)", "· · · (tři tečky)", "– – – (tři pomlčky)"]),
    hints: ["A = krátký + dlouhý = . –", "SOS = ... --- ..."],
  },
  {
    question: "Co je EAN kód (European Article Number)?",
    correctAnswer: "Standardní čárový kód na zboží v Evropě (13 číslic)",
    options: shuffle(["Standardní čárový kód na zboží v Evropě (13 číslic)", "QR kód pro e-shopy", "Kód pro identifikaci osob", "Druh QR kódu"]),
    hints: ["EAN = 13 číslic na obale každého zboží.", "Skenujete ho u pokladny."],
  },
  {
    question: "Jaký je princip čtení čárového kódu laserem?",
    correctAnswer: "Laser se odráží od bílých pruhů a pohlcuje černými — vzor určuje číslo",
    options: shuffle(["Laser se odráží od bílých pruhů a pohlcuje černými — vzor určuje číslo", "Kamera fotí kód a přečte barvy", "Laser měří tloušťku čar", "Magnetická pole čar kódují data"]),
    hints: ["Bílá = odraz (1), černá = pohlcení (0).", "Čárový kód = binární data v pruzích."],
  },
  {
    question: "Co je NFC (Near Field Communication)?",
    correctAnswer: "Bezkontaktní komunikace na krátkou vzdálenost — platby telefonem, přístupové karty",
    options: shuffle(["Bezkontaktní komunikace na krátkou vzdálenost — platby telefonem, přístupové karty", "Typ WiFi", "Formát QR kódu", "Druh Bluetooth"]),
    hints: ["NFC = přiložíš telefon/kartu k terminálu.", "Bezkontaktní platba = NFC."],
  },
  {
    question: "Proč mají chemické látky specifické GHS piktogramy (ghs.org)?",
    correctAnswer: "Aby pracovníci a záchranáři rychle poznali nebezpečí bez čtení textu",
    options: shuffle(["Aby pracovníci a záchranáři rychle poznali nebezpečí bez čtení textu", "Kvůli estetice obalů", "Jen pro děti", "Jsou to dekorace bez právní závaznosti"]),
    hints: ["GHS piktogramy jsou mezinárodní norma.", "Lebka, plamen, vykřičník = různé druhy nebezpečí."],
  },
  {
    question: "Co je RFID čip a jak se liší od čárového kódu?",
    correctAnswer: "RFID = radiofrekvenční identifikace — čte se bezdrátově bez přímého kontaktu (na rozdíl od čárového kódu)",
    options: shuffle(["RFID = radiofrekvenční identifikace — čte se bezdrátově bez přímého kontaktu (na rozdíl od čárového kódu)", "RFID = typ čárového kódu", "RFID je totéž jako QR kód", "RFID se čte kamerou"]),
    hints: ["RFID = chip v kartě nebo zboží.", "Čárový kód = laser, RFID = rádiové vlny."],
  },
  {
    question: "Proč se při nalezení SOS signálu ···−−−··· jedná o záchranný signál?",
    correctAnswer: "SOS byl mezinárodně dohodnut jako signál nouze — snadno rozpoznatelný i v hluku",
    options: shuffle(["SOS byl mezinárodně dohodnut jako signál nouze — snadno rozpoznatelný i v hluku", "SOS je zkratka pro 'Save Our Ship' a nic jiného neznamená", "SOS platí jen na moři", "SOS je libovolná sekvence"]),
    hints: ["SOS = ···−−−··· = 3 krátké + 3 dlouhé + 3 krátké.", "Jednoduchý symetrický vzor = snadno zapamatovatelný."],
  },
  {
    question: "Jaký je rozdíl mezi příkazovou (modrý kruh) a zákazovou (červený kruh) dopravní značkou?",
    correctAnswer: "Příkazová = musíš udělat (jednosměrka); zákazová = nesmíš udělat (zákaz vjezdu)",
    options: shuffle(["Příkazová = musíš udělat (jednosměrka); zákazová = nesmíš udělat (zákaz vjezdu)", "Jsou totéž", "Zákazová = musíš udělat", "Barva nemá s významem nic společného"]),
    hints: ["Modrý kruh = příkaz (jednosměrná, jízdní pruhy).", "Červený kruh = zákaz (nesmíš)."],
  },
  {
    question: "Proč QR kódy obsahují chybovou korekci?",
    correctAnswer: "Kód lze přečíst i když je částečně poškozený nebo znečištěný",
    options: shuffle(["Kód lze přečíst i když je částečně poškozený nebo znečištěný", "Kvůli větší kapacitě dat", "Aby se kód obtížněji kopíroval", "Chybová korekce není součástí QR"]),
    hints: ["QR kód může být poničen až z 30% a stále funguje.", "To je proč QR kódy bývají i na venkovních plakátech."],
  },
];

function gen(level: number): PracticeTask[] {
  const matchPool = shuffle(MATCH_TASKS).slice(0, 2);
  const selectPool =
    level === 1
      ? shuffle(SELECT_L1).slice(0, 20)
      : level === 2
      ? shuffle(SELECT_L2).slice(0, 20)
      : shuffle(SELECT_L3).slice(0, 20);
  return shuffle([...matchPool, ...selectPool]);
}

export const SYMBOLYPIKTOGRAMYKODYJEJICHVYZNAM: TopicMetadata[] = [
  {
    id: "g4-informatika-data-informace-a-modelovani-data-a-informace-symboly-piktogramy-kody-jejich-vyznam",
    rvpNodeId: "g4-informatika-data-informace-a-modelovani-data-a-informace-symboly-piktogramy-kody-jejich-vyznam",
    title: "Symboly, piktogramy, kódy - jejich význam",
    studentTitle: "Symboly a kódy",
    subject: "informatika",
    category: "Data, informace a modelování",
    topic: "Data, informace a modelování",
    briefDescription: "Poznáš piktogramy, dopravní značky, QR kódy a jejich použití v každodenním životě.",
    keywords: ["piktogram", "QR kód", "čárový kód", "Morseova abeceda", "semafor", "dopravní značka", "SOS"],
    goals: [
      "Žák vysvětlí pojem piktogram a uvede příklady",
      "Žák popíše QR kód a čárový kód",
      "Žák rozliší druhy dopravních značek podle tvaru a barvy",
    ],
    boundaries: ["Žák se nezabývá technickým principem čtení čárových kódů"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Piktogram = obrázek místo slov. Zákazová značka = červený kruh. Výstražná = žlutý trojúhelník.",
      steps: [
        "Podívej se na tvar/barvu symbolu",
        "Červený kruh = zákaz, modrý kruh = příkaz, žlutý trojúhelník = výstraha",
        "QR kód = naskenuj mobilem",
      ],
      commonMistake: "Záměna zákazové (červený kruh) a příkazové (modrý kruh) dopravní značky.",
      example: "Přeškrtnutá cigareta = kouření zakázáno. Zelená figurka = nouzový východ.",
    },
  },
];
