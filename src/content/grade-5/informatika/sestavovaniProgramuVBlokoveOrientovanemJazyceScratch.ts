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
  { question: "Co je sprite ve Scratchi?", correctAnswer: "Postava nebo objekt, který se pohybuje na scéně", options: ["Postava nebo objekt, který se pohybuje na scéně", "Pozadí scény", "Blok příkazu", "Skript programu"], hints: ["Sprite je to, co vidíš pohybovat se na obrazovce."] },
  { question: "Co je scéna ve Scratchi?", correctAnswer: "Plocha, kde se pohybují sprity", options: ["Plocha, kde se pohybují sprity", "Seznam příkazů", "Obrázek spritu", "Zvukový soubor"], hints: ["Scéna je jako jeviště v divadle."] },
  { question: "Co udělá blok 'pohni o 10 kroků'?", correctAnswer: "Sprite se posune o 10 kroků dopředu", options: ["Sprite se posune o 10 kroků dopředu", "Sprite se otočí o 10 stupňů", "Sprite se zvětší o 10 %", "Sprite změní barvu"], hints: ["Kroky = pohyb po scéně."] },
  { question: "Co udělá blok 'otoč se o 90 stupňů'?", correctAnswer: "Sprite se otočí o 90 stupňů doprava", options: ["Sprite se otočí o 90 stupňů doprava", "Sprite se posune doprava", "Sprite přeskočí na místo", "Sprite zmizí"], hints: ["90 stupňů = čtvrtina otočení."] },
  { question: "Co je skript ve Scratchi?", correctAnswer: "Řada bloků spojena za sebou — tvoří program", options: ["Řada bloků spojena za sebou — tvoří program", "Jeden blok příkazu", "Obrázek na pozadí", "Zvuk spritu"], hints: ["Skript je jako recept složený z kroků."] },
  { question: "Jak spustím program ve Scratchi?", correctAnswer: "Kliknu na zelenou vlajku", options: ["Kliknu na zelenou vlajku", "Kliknu na červené tlačítko stop", "Dvakrát kliknu na sprite", "Zmáčknu klávesu mezerník"], hints: ["Zelená vlajka = start."] },
  { question: "Co udělá blok 'řekni Ahoj 2 sekundy'?", correctAnswer: "Sprite zobrazí bublinu s textem Ahoj po dobu 2 sekund", options: ["Sprite zobrazí bublinu s textem Ahoj po dobu 2 sekund", "Sprite řekne Ahoj nahlas", "Sprite přejde na 2 sekundy na nové místo", "Sprite zmizí na 2 sekundy"], hints: ["Řekni = zobrazí textová bublina."] },
  { question: "Do jaké skupiny patří blok 'pohni o 10 kroků'?", correctAnswer: "Pohyb", options: ["Pohyb", "Zvuk", "Ovládání", "Události"], hints: ["Blok pohybuje spritem — jaká je to kategorie?"] },
  { question: "Jak nastavím, co sprite dělá, když stisknu klávesu?", correctAnswer: "Použiji blok 'když stisknete klávesu ...'", options: ["Použiji blok 'když stisknete klávesu ...'", "Použiji blok 'pohni o 10 kroků'", "Použiji blok 'zastav vše'", "Použiji blok 'přidej zvuk'"], hints: ["Klávesy ovládají události."] },
  { question: "Co znamená blok 'nastav x na 0, y na 0'?", correctAnswer: "Přesune sprite do středu scény", options: ["Přesune sprite do středu scény", "Sprite se vrátí na začátek skriptu", "Sprite zmizí", "Sprite se otočí"], hints: ["Souřadnice 0,0 = střed scény."] },
  { question: "Jak zastavím celý program ve Scratchi?", correctAnswer: "Kliknu na červené tlačítko stop", options: ["Kliknu na červené tlačítko stop", "Kliknu na zelenou vlajku", "Smažu skript", "Přidám blok 'zastav vše'"], hints: ["Červená = stop."] },
  { question: "Co dělají bloky v kategorii 'Zvuk' ve Scratchi?", correctAnswer: "Přehrajují zvuky a melodie", options: ["Přehrajují zvuky a melodie", "Pohybují spritem", "Spouštějí smyčky", "Proměnné ukládají čísla"], hints: ["Zvuk = slyšíš ho."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak udělám, aby sprite mluvil 3 sekundy?", correctAnswer: "Použiji blok 'řekni [text] 3 sekundy'", options: ["Použiji blok 'řekni [text] 3 sekundy'", "Použiji blok 'přehraj zvuk'", "Nastavím sprite na mluvení v nastavení", "Použiji blok 'opakuj 3 krát'"], hints: ["Hledej blok 'řekni' s časem."] },
  { question: "Co je sekvence v programování?", correctAnswer: "Bloky vykonávané jeden po druhém v pořadí", options: ["Bloky vykonávané jeden po druhém v pořadí", "Bloky opakující se stále dokola", "Bloky volené podle podmínky", "Skupiny proměnných"], hints: ["Sekvence = pořadí."] },
  { question: "Co udělá blok 'opakuj 4 krát' s blokem 'pohni o 10 kroků' uvnitř?", correctAnswer: "Sprite se posune o 10 kroků celkem čtyřikrát", options: ["Sprite se posune o 10 kroků celkem čtyřikrát", "Sprite se posune o 40 kroků jednou", "Sprite se otočí čtyřikrát", "Program se zastaví"], hints: ["Kolikrát se blok uvnitř opakuje?"] },
  { question: "Co je podmínka v programování?", correctAnswer: "Blok, který provede příkaz jen pokud je splněna určitá situace", options: ["Blok, který provede příkaz jen pokud je splněna určitá situace", "Blok, který vždy provede příkaz", "Blok, který opakuje příkaz", "Blok, který zastaví program"], hints: ["Podmínka = 'jestliže ... pak ...'"] },
  { question: "Jak ve Scratchi přidám nový sprite?", correctAnswer: "Kliknu na ikonu přidání spritu v dolní části obrazovky", options: ["Kliknu na ikonu přidání spritu v dolní části obrazovky", "Přesunem jiný sprite", "Kliknu na zelenou vlajku", "Přidám nový skript"], hints: ["Sprite se přidávají v oblasti spritu."] },
  { question: "Co jsou proměnné ve Scratchi?", correctAnswer: "Uložiště hodnot – čísla, texty ve skriptu", options: ["Uložiště hodnot – čísla, texty ve skriptu", "Typy sprite", "Pozadí scény", "Zvukové soubory"], hints: ["Proměnná si pamatuje číslo nebo text."] },
  { question: "Co udělá blok 'pokud ... pak ...' ve Scratchi?", correctAnswer: "Provede bloky uvnitř jen tehdy, když je podmínka splněna", options: ["Provede bloky uvnitř jen tehdy, když je podmínka splněna", "Opakuje bloky donekonečna", "Zastaví všechny skripty", "Přesune sprite"], hints: ["'Pokud' = podmíněné provedení."] },
  { question: "Jak změním pozadí scény ve Scratchi?", correctAnswer: "Kliknu na ikonu scény a vyberu nebo nahraji pozadí", options: ["Kliknu na ikonu scény a vyberu nebo nahraji pozadí", "Smažu všechny sprity", "Přidám nový sprite", "Kliknu na červenou vlajku"], hints: ["Pozadí patří scéně, ne spritu."] },
  { question: "Co se stane, pokud spojím bloky 'pohni o 10 kroků' a 'otoč se o 90 stupňů' do sekvence?", correctAnswer: "Sprite se nejprve posune, pak se otočí", options: ["Sprite se nejprve posune, pak se otočí", "Sprite se otočí a posune zároveň", "Program se zastaví", "Sprite zmizí"], hints: ["V sekvenci se bloky provádí shora dolů."] },
  { question: "Co udělá blok 'navždy' ve Scratchi?", correctAnswer: "Opakuje bloky uvnitř bez konce, dokud program nezastavím", options: ["Opakuje bloky uvnitř bez konce, dokud program nezastavím", "Opakuje bloky 10krát", "Zastaví program", "Změní pozadí"], hints: ["'Navždy' = nekonečná smyčka."] },
  { question: "Jaký blok použiji, aby sprite reagoval na kliknutí myší?", correctAnswer: "'když kliknete na tento sprite'", options: ["'když kliknete na tento sprite'", "'pohni o 10 kroků'", "'opakuj 10 krát'", "'nastav barvu na ...'"], hints: ["Hledej blok pro událost kliknutí."] },
  { question: "Co je kostým spritu?", correctAnswer: "Různé obrázky spritu, které lze přepínat", options: ["Různé obrázky spritu, které lze přepínat", "Pozadí scény", "Zvuk spritu", "Skript programu"], hints: ["Kostým = jak sprite vypadá — může mít víc podob."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak nakreslím čtverec ve Scratchi pomocí cyklu?", correctAnswer: "Opakuj 4×: pohni o 100 kroků, otoč se o 90 stupňů", options: ["Opakuj 4×: pohni o 100 kroků, otoč se o 90 stupňů", "Opakuj 4×: pohni o 100 kroků, otoč se o 45 stupňů", "Opakuj 4×: pohni o 50 kroků, otoč se o 90 stupňů", "Opakuj 8×: pohni o 100 kroků, otoč se o 45 stupňů"], hints: ["Čtverec má 4 strany a 4 pravé úhly (90°)."] },
  { question: "Co je funkce (vlastní blok) ve Scratchi?", correctAnswer: "Pojmenovaná skupina bloků, kterou lze znovu použít", options: ["Pojmenovaná skupina bloků, kterou lze znovu použít", "Blok pro pohyb spritu", "Typ proměnné", "Pozadí scény"], hints: ["Vlastní blok = definuji jednou, použiji vícekrát."] },
  { question: "Jaký je rozdíl mezi 'opakuj N krát' a 'navždy'?", correctAnswer: "'Opakuj N krát' skončí po N opakováních, 'navždy' neskončí nikdy", options: ["'Opakuj N krát' skončí po N opakováních, 'navždy' neskončí nikdy", "'Navždy' skončí po 100 opakováních", "'Opakuj N krát' a 'navždy' jsou stejné", "'Opakuj N krát' neskončí nikdy"], hints: ["Kolikrát se každá smyčka provede?"] },
  { question: "Jak přidám zvuk, který se přehraje při spuštění programu?", correctAnswer: "Pod blok 'když kliknu na ▶' přidám blok 'přehraj zvuk ...'", options: ["Pod blok 'když kliknu na ▶' přidám blok 'přehraj zvuk ...'", "Zvuk se přidá automaticky", "Kliknu na zvukovou vlajku", "Přidám blok 'pohni o 0 kroků'"], hints: ["Blok spuštění + blok zvuku = zvuk při startu."] },
  { question: "Co udělá sekvence: pohni o 50 kroků → čekej 1 sekundu → pohni o 50 kroků?", correctAnswer: "Sprite se posune o 50, počká 1 sekundu, pak se posune o dalších 50 kroků", options: ["Sprite se posune o 50, počká 1 sekundu, pak se posune o dalších 50 kroků", "Sprite se posune o 100 kroků najednou", "Sprite počká a pak se posune o 50 kroků", "Program se zastaví po 1 sekundě"], hints: ["Bloky se provádí shora dolů v pořadí."] },
  { question: "Jak zjistím, zda se sprite dotýká okraje scény?", correctAnswer: "Použiji podmínku 'dotýká se okraje?'", options: ["Použiji podmínku 'dotýká se okraje?'", "Použiji blok 'pohni o 0 kroků'", "Použiji blok 'nastav x na 0'", "Sprite sám pozná okraj"], hints: ["Hledej blok snímání/detekce."] },
  { question: "Jak sdílím projekt na Scratchi s kamarády?", correctAnswer: "Projekt zveřejním na webu scratch.mit.edu a pošlu odkaz", options: ["Projekt zveřejním na webu scratch.mit.edu a pošlu odkaz", "Pošlu soubor .sb3 e-mailem", "Nahrám projekt na YouTube", "Sdílím pouze na disketě"], hints: ["Scratch je online platforma."] },
  { question: "Co se stane, pokud ve smyčce 'navždy' není žádný blok uvnitř?", correctAnswer: "Program běží, ale nic nedělá — prázdná nekonečná smyčka", options: ["Program běží, ale nic nedělá — prázdná nekonečná smyčka", "Program se okamžitě zastaví", "Program spadne", "Sprite zmizí"], hints: ["Prázdná smyčka stále běží, jen neprovádí žádný příkaz."] },
  { question: "Jak zastavím jen jeden skript (ne celý program)?", correctAnswer: "Použiji blok 'zastav tento skript'", options: ["Použiji blok 'zastav tento skript'", "Kliknu na červenou vlajku", "Použiji blok 'zastav vše'", "Smažu sprite"], hints: ["Existuje blok pro zastavení pouze aktuálního skriptu."] },
  { question: "Co jsou události (bloky s 'když') ve Scratchi?", correctAnswer: "Bloky, které spustí skript při určité akci – klik, klávesa, zpráva", options: ["Bloky, které spustí skript při určité akci – klik, klávesa, zpráva", "Bloky pro pohyb spritu", "Typy smyček", "Proměnné hodnoty"], hints: ["'Událost' = něco se stane a tím se spustí kód."] },
  { question: "Jak předám informaci z jednoho spritu na druhý ve Scratchi?", correctAnswer: "Použiji bloky 'vyšli zprávu' a 'když dostanu zprávu'", options: ["Použiji bloky 'vyšli zprávu' a 'když dostanu zprávu'", "Přesunem oba sprity na stejné místo", "Použiji blok 'pohni o 0 kroků'", "Sprite komunikují automaticky"], hints: ["Zprávy = komunikace mezi sprity."] },
  { question: "Jak se liší blok 'nastav proměnnou na X' od 'přidej k proměnné X'?", correctAnswer: "'Nastav' přepíše hodnotu, 'přidej' zvýší stávající hodnotu o X", options: ["'Nastav' přepíše hodnotu, 'přidej' zvýší stávající hodnotu o X", "Oba bloky dělají totéž", "'Přidej' přepíše hodnotu, 'nastav' zvýší", "'Nastav' vždy nastaví na 0"], hints: ["Nastav = přepis; přidej = přičítání."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SESTAVOVANIPROGRAMUVBLOKOVEORIENTOVANEMJAZYCESCRATCH: TopicMetadata[] = [
  {
    id: "g5-informatika-algoritmizace-a-programovani-programovani-v-blokovem-prostredi-sestavovani-programu-v-blokove-orientovanem-jazyce-scratch",
    rvpNodeId: "g5-informatika-algoritmizace-a-programovani-programovani-v-blokovem-prostredi-sestavovani-programu-v-blokove-orientovanem-jazyce-scratch",
    title: "Sestavování programu v blokově orientovaném jazyce (Scratch)",
    studentTitle: "Scratch programování",
    subject: "informatika",
    category: "Algoritmizace a programování",
    topic: "Programování v blokovém prostředí",
    briefDescription: "Naučíš se sestavit program v prostředí Scratch.",
    keywords: ["scratch", "sprite", "blok", "skript", "scéna", "smyčka", "programování"],
    goals: [
      "Rozumí pojmům sprite, scéna, skript, blok.",
      "Sestaví jednoduchý program ze sekvence bloků.",
      "Používá smyčky a podmínky v blokovém prostředí.",
    ],
    boundaries: ["Textové programování (Python, JavaScript)", "Pokročilé animace a 3D"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Ve Scratchi stavíš program jako puzzle — spojuješ barevné bloky za sebou. Každý blok dělá jednu věc.",
      steps: [
        "Najdi sprite, se kterým chceš pracovat.",
        "Přetáhni bloky z levé nabídky na plochu skriptu.",
        "Spoj bloky za sebou — vytvoříš sekvenci (skript).",
        "Spusť program zelenou vlajkou.",
      ],
      commonMistake: "Bloky nejsou správně spojeny — mezery mezi nimi znamenají, že se neprovede zbytek skriptu.",
      example: "Pohni o 10 kroků → Otoč se o 90 stupňů → Pohni o 10 kroků → Otoč se o 90 stupňů = čtvrtkruh.",
    },
  },
];
