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
    question: "Co je to smyčka (opakování) v algoritmu?",
    correctAnswer: "Část algoritmu, která se provede vícekrát",
    options: shuffle(["Část algoritmu, která se provede vícekrát", "Příkaz, který se provede jen jednou", "Příkaz, který nic nedělá", "Konec programu"]),
    hints: ["Smyčka = opakování stejných kroků.", "Příklad: 'Opakuj 10krát: skoč'."],
  },
  {
    question: "Jaký příkaz odpovídá smyčce 'Opakuj 5krát: zatlesk'?",
    correctAnswer: "Udělej 5 tlesknutí za sebou",
    options: shuffle(["Udělej 5 tlesknutí za sebou", "Zatlesk jednou", "Neptej se a netlesk", "Zatlesk jen, když chceš"]),
    hints: ["Číslo v příkazu říká, kolikrát se akce opakuje.", "5krát = 5 opakování."],
  },
  {
    question: "Co je větvení (podmínka) v algoritmu?",
    correctAnswer: "Rozhodnutí: KDYŽ podmínka platí → udělej A, JINAK udělej B",
    options: shuffle(["Rozhodnutí: KDYŽ podmínka platí → udělej A, JINAK udělej B", "Opakování kroků", "Konec algoritmu", "Náhodný příkaz"]),
    hints: ["Větvení má dvě možnosti: Ano (platí) nebo Ne (neplatí).", "KDYŽ/JINAK = podmínkový příkaz."],
  },
  {
    question: "Co provede příkaz: KDYŽ prší → vezmi deštník / JINAK nechej ho doma?",
    correctAnswer: "Rozhodne na základě počasí, zda vzít deštník",
    options: shuffle(["Rozhodne na základě počasí, zda vzít deštník", "Vždy vezme deštník", "Nikdy nevezme deštník", "Opakuje se 10krát"]),
    hints: ["Podmínka je 'prší'.", "KDYŽ = IF, JINAK = ELSE."],
  },
  {
    question: "Proč používáme smyčky v algoritmech?",
    correctAnswer: "Abychom nemuseli psát každý příkaz zvlášť pro každé opakování",
    options: shuffle(["Abychom nemuseli psát každý příkaz zvlášť pro každé opakování", "Abychom zpomalili program", "Abychom přeskočili podmínky", "Smyčky se nepoužívají"]),
    hints: ["Bez smyčky bys musel napsat 'skoč' 100krát pro 100 skoků.", "Smyčka zkracuje a zjednodušuje algoritmus."],
  },
  {
    question: "Jaká smyčka se hodí, když nevíš přesně kolikrát se má akce opakovat?",
    correctAnswer: "Opakuj DOKUD (podmínka platí)",
    options: shuffle(["Opakuj DOKUD (podmínka platí)", "Opakuj N-krát", "KDYŽ/JINAK", "Konec programu"]),
    hints: ["'Opakuj dokud' běží, dokud podmínka platí — pak se zastaví.", "Příklad: Opakuj dokud: nedojdeš na konec."],
  },
  {
    question: "Co provede příkaz: KDYŽ je skóre > 50 → Výhra / JINAK Prohráváš?",
    correctAnswer: "Zkontroluje skóre a oznámí výsledek",
    options: shuffle(["Zkontroluje skóre a oznámí výsledek", "Vždy oznámí výhru", "Vždy oznámí prohru", "Opakuje se dokola"]),
    hints: ["Podmínka je 'skóre > 50'.", "KDYŽ se podmínka splní, zobrazí Výhra. Jinak Prohráváš."],
  },
  {
    question: "Příkaz 'Opakuj 10krát: skoč' je příkladem:",
    correctAnswer: "Smyčky s pevným počtem opakování",
    options: shuffle(["Smyčky s pevným počtem opakování", "Větvení", "Jednoduchého příkazu (bez opakování)", "Podmínky DOKUD"]),
    hints: ["Pevný počet = vždy se opakuje přesně tolikrát.", "10krát = pevný počet."],
  },
  {
    question: "Příkaz 'Opakuj dokud: nedojdeš na konec chodby' je příkladem:",
    correctAnswer: "Smyčky s podmínkou (opakuj dokud)",
    options: shuffle(["Smyčky s podmínkou (opakuj dokud)", "Větvení KDYŽ/JINAK", "Smyčky s pevným počtem", "Jednoduchého příkazu"]),
    hints: ["Podmínka smyčky = 'nedojdeš na konec'.", "Smyčka se zastaví, až podmínka přestane platit."],
  },
  {
    question: "Co se stane, pokud podmínka ve větvení NIKDY platí?",
    correctAnswer: "Vždy se provede větev JINAK",
    options: shuffle(["Vždy se provede větev JINAK", "Vždy se provede větev PAK", "Program se zastaví", "Smyčka se spustí"]),
    hints: ["JINAK = co se stane, když podmínka NEPLATÍ.", "Nikdy platí → JINAK běží pokaždé."],
  },
  {
    question: "Co se stane, pokud podmínka ve větvení VŽDY platí?",
    correctAnswer: "Vždy se provede větev PAK (KDYŽ)",
    options: shuffle(["Vždy se provede větev PAK (KDYŽ)", "Vždy se provede větev JINAK", "Program se zastaví", "Smyčka se spustí"]),
    hints: ["Podmínka platí → větev PAK.", "JINAK se nikdy neprovede, pokud podmínka vždy platí."],
  },
  {
    question: "Jaké jsou dvě základní větve větvení?",
    correctAnswer: "PAK (podmínka platí) a JINAK (podmínka neplatí)",
    options: shuffle(["PAK (podmínka platí) a JINAK (podmínka neplatí)", "Začátek a konec", "Vstup a výstup", "Smyčka a podmínka"]),
    hints: ["KDYŽ [podmínka] → PAK ... JINAK ...", "Dvě cesty: platí nebo neplatí."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak se nazývá smyčka, která se opakuje, dokud platí podmínka?",
    correctAnswer: "Smyčka DOKUD (while loop)",
    options: shuffle(["Smyčka DOKUD (while loop)", "Smyčka PRO (for loop)", "Větvení KDYŽ/JINAK", "Podmínkový příkaz"]),
    hints: ["DOKUD = opakuj, dokud podmínka platí.", "Zastaví se, jakmile podmínka přestane platit."],
  },
  {
    question: "Smyčka 'Opakuj 7krát: napiš hvězdičku' vytvoří:",
    correctAnswer: "Řadu 7 hvězdiček: *******",
    options: shuffle(["Řadu 7 hvězdiček: *******", "Jednu hvězdičku", "Nekonečnou řadu hvězdiček", "Žádnou hvězdičku"]),
    hints: ["7krát = přesně 7 hvězdiček.", "Počítej: 1,2,3,4,5,6,7."],
  },
  {
    question: "Algoritmus: KDYŽ teplota > 30°C → zapni ventilátor / JINAK vypni ventilátor. Co provede při teplotě 25°C?",
    correctAnswer: "Vypne ventilátor",
    options: shuffle(["Vypne ventilátor", "Zapne ventilátor", "Nic neprovede", "Opakuje měření"]),
    hints: ["25°C > 30°C? Ne → JINAK.", "JINAK = vypni ventilátor."],
  },
  {
    question: "Co se stane, pokud smyčka 'DOKUD' má podmínku, která nikdy nepřestane platit?",
    correctAnswer: "Smyčka poběží donekonečna (nekonečná smyčka)",
    options: shuffle(["Smyčka poběží donekonečna (nekonečná smyčka)", "Smyčka se ihned zastaví", "Provede se jen jednou", "Skočí na větvení"]),
    hints: ["Podmínka, která vždy platí → smyčka nikdy nekončí.", "To je chyba v algoritmu — poruší se konečnost."],
  },
  {
    question: "Jaký příkaz správně popisuje: 'Každý den se umy, dokud jsi naživu'?",
    correctAnswer: "Opakuj DOKUD (jsi naživu): umy se",
    options: shuffle(["Opakuj DOKUD (jsi naživu): umy se", "Opakuj 100krát: umy se", "KDYŽ jsi špinavý → umy se / JINAK nespi", "Umy se jednou"]),
    hints: ["Podmínka: jsi naživu. Akce: umy se.", "DOKUD = opakuj, dokud podmínka platí."],
  },
  {
    question: "Ve Scratchi přikaz 'opakuj 10 krát { jdi 10 kroků }' je příkladem:",
    correctAnswer: "Smyčky s pevným počtem opakování",
    options: shuffle(["Smyčky s pevným počtem opakování", "Podmínky DOKUD", "Větvení KDYŽ/JINAK", "Jednorázového příkazu"]),
    hints: ["10 krát = pevný počet.", "Scratch používá bloky pro smyčky a podmínky."],
  },
  {
    question: "Algoritmus: Opakuj DOKUD (čeká zákazník): obsluž zákazníka. Kdy se smyčka zastaví?",
    correctAnswer: "Když nepřijde žádný zákazník (podmínka neplatí)",
    options: shuffle(["Když nepřijde žádný zákazník (podmínka neplatí)", "Po 10 zákaznících", "Ihned", "Nikdy"]),
    hints: ["Podmínka: čeká zákazník.", "Smyčka DOKUD se zastaví, až podmínka přestane platit."],
  },
  {
    question: "Kombinace smyčky s větvením uvnitř je příkladem:",
    correctAnswer: "Složitějšího algoritmu (smyčka + podmínka)",
    options: shuffle(["Složitějšího algoritmu (smyčka + podmínka)", "Jednoduchého příkazu", "Vývojového diagramu bez větvení", "Neplatného algoritmu"]),
    hints: ["Smyčka a podmínka se mohou kombinovat.", "Příklad: Opakuj 10krát: KDYŽ dešťový → drž deštník / JINAK jdi rychle."],
  },
  {
    question: "Co znamená klíčové slovo 'JINAK' ve větvení?",
    correctAnswer: "Část algoritmu, která se provede, když podmínka NEPLATÍ",
    options: shuffle(["Část algoritmu, která se provede, když podmínka NEPLATÍ", "Opakování smyčky", "Konec algoritmu", "Vstupní data"]),
    hints: ["JINAK = ELSE v angličtině.", "JINAK = co se stane, pokud podmínka není splněna."],
  },
  {
    question: "Algoritmus porovná dvě čísla a vypíše větší. Jaký příkaz použije?",
    correctAnswer: "KDYŽ číslo1 > číslo2 → vypiš číslo1 / JINAK vypiš číslo2",
    options: shuffle(["KDYŽ číslo1 > číslo2 → vypiš číslo1 / JINAK vypiš číslo2", "Opakuj 2krát: vypiš číslo", "Vždy vypiš číslo1", "Smyčka DOKUD"]),
    hints: ["Porovnání = podmínka = větvení.", "KDYŽ je podmínka splněna → PAK ... JINAK ..."],
  },
  {
    question: "Jak se říká anglicky příkazu 'OPAKUJ N-KRÁT'?",
    correctAnswer: "for loop (smyčka for)",
    options: shuffle(["for loop (smyčka for)", "while loop (smyčka while)", "if-else (větvení)", "break"]),
    hints: ["For loop = opakování s předem daným počtem.", "While loop = opakuj DOKUD."],
  },
  {
    question: "Co se stane po skončení smyčky?",
    correctAnswer: "Pokračuje se na dalším příkazu za smyčkou",
    options: shuffle(["Pokračuje se na dalším příkazu za smyčkou", "Program se ukončí", "Smyčka se znovu spustí od začátku", "Podmínka se přeskočí"]),
    hints: ["Po smyčce algoritmus pokračuje normálně.", "Smyčka je jen část algoritmu."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Algoritmus: Opakuj 5krát { KDYŽ padne 6 → vypiš 'Šestka!' }. Kolikrát se vypíše 'Šestka!', pokud padne 6 vždy?",
    correctAnswer: "5krát",
    options: shuffle(["5krát", "1krát", "0krát", "Nelze určit"]),
    hints: ["Smyčka se provede 5krát.", "Podmínka platí každé kolo → KDYŽ se splní 5krát."],
  },
  {
    question: "Co je nekonečná smyčka a proč je problém?",
    correctAnswer: "Smyčka, která nikdy neskončí — poruší konečnost algoritmu",
    options: shuffle(["Smyčka, která nikdy neskončí — poruší konečnost algoritmu", "Smyčka bez podmínky DOKUD", "Smyčka s příliš mnoha kroky", "Smyčka uvnitř větvení"]),
    hints: ["Algoritmus musí mít konečnost — musí jednou skončit.", "Nekonečná smyčka = chyba."],
  },
  {
    question: "Jaký je rozdíl mezi smyčkou FOR a smyčkou WHILE?",
    correctAnswer: "FOR = pevný počet opakování; WHILE = opakování dokud podmínka platí",
    options: shuffle(["FOR = pevný počet opakování; WHILE = opakování dokud podmínka platí", "FOR i WHILE jsou totéž", "FOR má podmínku; WHILE má pevný počet", "WHILE je rychlejší"]),
    hints: ["FOR: víš předem, kolikrát.", "WHILE: opakuješ, dokud podmínka platí."],
  },
  {
    question: "Algoritmus praní prádla: 'Opakuj DOKUD (prádlo je špinavé): dej do pračky'. Proč se smyčka jednou zastaví?",
    correctAnswer: "Protože po praní prádlo již není špinavé — podmínka přestane platit",
    options: shuffle(["Protože po praní prádlo již není špinavé — podmínka přestane platit", "Smyčka se nikdy nezastaví", "Protože pračka praskne", "Pevný počet cyklů je 1"]),
    hints: ["Podmínka: prádlo je špinavé.", "Po vyprání podmínka neplatí → smyčka skončí."],
  },
  {
    question: "Algoritmus: KDYŽ věk >= 18 → vstup povolen / JINAK vstup zakázán. Co se stane pro věk 17?",
    correctAnswer: "Vstup zakázán",
    options: shuffle(["Vstup zakázán", "Vstup povolen", "Nic se neprovede", "Smyčka se spustí"]),
    hints: ["17 >= 18? Ne → JINAK.", "JINAK = vstup zakázán."],
  },
  {
    question: "Proč bychom mohli chtít smyčku uvnitř větvení?",
    correctAnswer: "Abychom opakování provedli jen za určité podmínky",
    options: shuffle(["Abychom opakování provedli jen za určité podmínky", "Aby byl algoritmus složitější", "Abychom přeskočili podmínku", "Smyčka uvnitř větvení je vždy chyba"]),
    hints: ["Příklad: KDYŽ prší → opakuj 3krát: deštník nahoru.", "Smyčka + podmínka = mocný nástroj."],
  },
  {
    question: "Algoritmus přebírá číslo a opakuje příkaz tolikrát, kolik je číslo. Smyčku FOR nebo WHILE?",
    correctAnswer: "FOR — počet opakování je znám (= vstupní číslo)",
    options: shuffle(["FOR — počet opakování je znám (= vstupní číslo)", "WHILE — podmínka není известна", "Větvení KDYŽ/JINAK", "Jednorázový příkaz"]),
    hints: ["Znáš počet předem? → FOR.", "Podmínka, dokud něco platí? → WHILE."],
  },
  {
    question: "Jak by vypadal algoritmus ranního vstávání s podmínkou a smyčkou?",
    correctAnswer: "Opakuj DOKUD (nezazvoní budík): spi / KDYŽ zazvonil → vstaň",
    options: shuffle(["Opakuj DOKUD (nezazvoní budík): spi / KDYŽ zazvonil → vstaň", "Opakuj 8krát: spi / vstaň", "KDYŽ spíš → budík / JINAK vstaň", "Vždy vstávej v 7:00"]),
    hints: ["Spíš, DOKUD budík nezazvoní.", "Pak se provede větvení KDYŽ zazvonil."],
  },
  {
    question: "Co se stane, pokud podmínka větvení závisí na vstupních datech, která se mění?",
    correctAnswer: "Algoritmus se chová jinak při různých vstupech — to je žádoucí (obecnost)",
    options: shuffle(["Algoritmus se chová jinak při různých vstupech — to je žádoucí (obecnost)", "Algoritmus vždy selže", "Podmínka se ignoruje", "Smyčka nahradí větvení"]),
    hints: ["Obecnost = algoritmus funguje pro různé vstupy.", "Různé vstupy → různé výstupy = správné chování."],
  },
  {
    question: "Smyčka 'Opakuj DOKUD (baterie < 100%): nabíjej' se zastaví, když:",
    correctAnswer: "Baterie dosáhne 100% (podmínka přestane platit)",
    options: shuffle(["Baterie dosáhne 100% (podmínka přestane platit)", "Uplyne 1 hodina", "Telefon se vypne", "Podmínka se nikdy nezastaví"]),
    hints: ["Podmínka: baterie < 100%.", "Jakmile baterie = 100%, podmínka neplatí → smyčka skončí."],
  },
  {
    question: "Dvě větve větvení se nazývají PAK a JINAK. Co odpovídá anglickým slovům IF a ELSE?",
    correctAnswer: "IF = KDYŽ (podmínka platí), ELSE = JINAK (podmínka neplatí)",
    options: shuffle(["IF = KDYŽ (podmínka platí), ELSE = JINAK (podmínka neplatí)", "IF = JINAK, ELSE = KDYŽ", "IF = FOR, ELSE = WHILE", "IF a ELSE jsou smyčky"]),
    hints: ["IF = anglicky KDYŽ.", "ELSE = anglicky JINAK."],
  },
  {
    question: "Algoritmus třídí žáky: KDYŽ průměr <= 1,5 → vyznamenání / JINAK bez vyznamenání. Je to smyčka nebo větvení?",
    correctAnswer: "Větvení (podmínka KDYŽ/JINAK)",
    options: shuffle(["Větvení (podmínka KDYŽ/JINAK)", "Smyčka s pevným počtem", "Smyčka DOKUD", "Kombinace obou"]),
    hints: ["KDYŽ/JINAK = větvení.", "Žádné opakování → není smyčka."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool =
    level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 35);
}

export const OPAKOVANIVPOSTUPUVETVENI: TopicMetadata[] = [
  {
    id: "g4-informatika-algoritmizace-a-programovani-pokyny-a-postupy-opakovani-v-postupu-vetveni",
    rvpNodeId: "g4-informatika-algoritmizace-a-programovani-pokyny-a-postupy-opakovani-v-postupu-vetveni",
    title: "Opakování v postupu, větvení",
    studentTitle: "Smyčky a podmínky",
    subject: "informatika",
    category: "Algoritmizace a programování",
    topic: "Algoritmizace a programování",
    briefDescription: "Pochopíš, jak fungují smyčky a jak algoritmus rozhoduje pomocí podmínek.",
    keywords: ["smyčka", "opakování", "větvení", "podmínka", "KDYŽ", "JINAK", "DOKUD"],
    goals: [
      "Žák vysvětlí pojem smyčka a uvede příklady",
      "Žák rozliší smyčku s pevným počtem a smyčku DOKUD",
      "Žák vysvětlí větvení KDYŽ/JINAK a uvede příklady",
    ],
    boundaries: ["Žák nezapisuje smyčky ani podmínky v konkrétním programovacím jazyce"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "conceptual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Smyčka opakuje kroky (FOR = kolikrát, WHILE = dokud platí). Větvení rozhoduje: KDYŽ podmínka → PAK / JINAK.",
      steps: [
        "Přečti příkaz a urči: je to opakování nebo rozhodnutí?",
        "Pokud opakování: kolikrát nebo dokud co platí?",
        "Pokud větvení: jaká je podmínka a co se stane, když platí/neplatí?",
      ],
      commonMistake: "Záměna smyčky DOKUD a větvení KDYŽ — obě mají podmínku, ale smyčka ji opakuje.",
      example: "KDYŽ prší → vezmi deštník / JINAK nechej ho doma. Opakuj 10krát: skoč.",
    },
  },
];
