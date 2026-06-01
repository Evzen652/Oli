import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DRAG_TASKS: PracticeTask[] = [
  {
    question: "Seřaď kroky přípravy sendviče ve správném pořadí:",
    correctAnswer: "Vem chleba,Natři máslem,Přidej náplň,Přikryj druhým chlebem",
    items: ["Vem chleba", "Natři máslem", "Přidej náplň", "Přikryj druhým chlebem"],
    hints: ["Začni od toho, co je úplně první.", "Máslo dáváš na chleba, ne naopak."],
  },
  {
    question: "Seřaď kroky GPS navigace ve správném pořadí:",
    correctAnswer: "Zadej cíl,Spusť navigaci,Sleduj pokyny,Doraziš na místo",
    items: ["Zadej cíl", "Spusť navigaci", "Sleduj pokyny", "Doraziš na místo"],
    hints: ["Nejprve musíš říct, kam chceš jet.", "Navigaci spouštíš po zadání cíle."],
  },
  {
    question: "Seřaď kroky mytí rukou ve správném pořadí:",
    correctAnswer: "Namočit ruce,Nanést mýdlo,Důkladně třít,Opláchnout,Osušit",
    items: ["Namočit ruce", "Nanést mýdlo", "Důkladně třít", "Opláchnout", "Osušit"],
    hints: ["Voda je před mýdlem.", "Osušení je vždy poslední krok."],
  },
  {
    question: "Seřaď kroky sestavení Lega podle návodu:",
    correctAnswer: "Otevři návod,Roztřiď díly,Sleduj obrázek,Postav model,Zkontroluj výsledek",
    items: ["Otevři návod", "Roztřiď díly", "Sleduj obrázek", "Postav model", "Zkontroluj výsledek"],
    hints: ["Nejprve musíš vědět, co chceš postavit.", "Roztřídění ti usnadní hledání dílu."],
  },
  {
    question: "Seřaď kroky poslání e-mailu:",
    correctAnswer: "Otevři e-mailovou aplikaci,Klikni na Napsat,Vyplň adresu příjemce,Napiš zprávu,Klikni Odeslat",
    items: ["Otevři e-mailovou aplikaci", "Klikni na Napsat", "Vyplň adresu příjemce", "Napiš zprávu", "Klikni Odeslat"],
    hints: ["Aplikaci otevíráš vždy jako první.", "Bez adresy příjemce nelze odeslat."],
  },
  {
    question: "Seřaď kroky sázení rostliny:",
    correctAnswer: "Připrav nádobu,Nasypej hlínu,Udělej jamku,Vlož semínko,Zalij vodou",
    items: ["Připrav nádobu", "Nasypej hlínu", "Udělej jamku", "Vlož semínko", "Zalij vodou"],
    hints: ["Bez nádoby nemůžeš nic sázet.", "Semínko jde do hlíny, ne naopak."],
  },
  {
    question: "Seřaď kroky vaření čaje:",
    correctAnswer: "Navarř vodu,Vlož čajový sáček,Přelij horkou vodou,Počkej 3 minuty,Vyjmi sáček",
    items: ["Navarř vodu", "Vlož čajový sáček", "Přelij horkou vodou", "Počkej 3 minuty", "Vyjmi sáček"],
    hints: ["Voda musí být horká, než přeliješ čaj.", "Sáček vyjmeš, až čaj vyluhuje."],
  },
  {
    question: "Seřaď kroky čtení knihy z knihovny:",
    correctAnswer: "Najdi knihu,Půjč si ji,Přečti,Vrať knihu",
    items: ["Najdi knihu", "Půjč si ji", "Přečti", "Vrať knihu"],
    hints: ["Nejprve musíš knihu najít.", "Vrácení je vždy poslední krok."],
  },
  {
    question: "Seřaď kroky focení fotografie:",
    correctAnswer: "Zapni fotoaparát,Namiř na objekt,Zmáčkni tlačítko,Prohlédni si snímek",
    items: ["Zapni fotoaparát", "Namiř na objekt", "Zmáčkni tlačítko", "Prohlédni si snímek"],
    hints: ["Fotoaparát musí být zapnutý.", "Tlačítko zmáčkneš, když jsi namířený."],
  },
  {
    question: "Seřaď kroky spuštění počítačové hry:",
    correctAnswer: "Zapni počítač,Přihlaš se,Otevři hru,Stiskni Hrát",
    items: ["Zapni počítač", "Přihlaš se", "Otevři hru", "Stiskni Hrát"],
    hints: ["Počítač musíš nejprve zapnout.", "Přihlášení předchází otevření hry."],
  },
];

const SELECT_TASKS_L1: PracticeTask[] = [
  {
    question: "Co je to algoritmus?",
    correctAnswer: "Přesný sled kroků vedoucí k cíli",
    options: shuffle(["Přesný sled kroků vedoucí k cíli", "Náhodné akce bez pořadí", "Jeden jediný příkaz", "Počítačová hra"]),
    hints: ["Algoritmus má jasné pořadí kroků.", "Recept na jídlo je příklad algoritmu."],
  },
  {
    question: "Která vlastnost říká, že každý krok algoritmu musí být jasný a jednoznačný?",
    correctAnswer: "Jednoznačnost",
    options: shuffle(["Jednoznačnost", "Konečnost", "Obecnost", "Opakování"]),
    hints: ["Jednoznačnost znamená, že krok nemůže mít dvojí výklad.", "Nejasný krok v receptu by způsobil zmatek."],
  },
  {
    question: "Co zaručuje vlastnost 'konečnost' algoritmu?",
    correctAnswer: "Algoritmus musí jednou skončit",
    options: shuffle(["Algoritmus musí jednou skončit", "Algoritmus běží donekonečna", "Každý krok musí být jiný", "Algoritmus nemá výstup"]),
    hints: ["Algoritmus nesmí běžet věčně.", "Recept, který nikdy nekončí, byste nikdy nedovařili."],
  },
  {
    question: "Co znamená vlastnost 'obecnost' algoritmu?",
    correctAnswer: "Funguje pro více různých vstupů",
    options: shuffle(["Funguje pro více různých vstupů", "Má jen jeden správný výsledek", "Funguje jen na jednom počítači", "Nepovoluje žádné vstupy"]),
    hints: ["Obecný algoritmus = lze ho použít opakovaně pro různá data.", "Recept na polévku funguje pro různá množství."],
  },
  {
    question: "Jaký tvar má v diagramu (vývojovém diagramu) krok/příkaz?",
    correctAnswer: "Obdélník",
    options: shuffle(["Obdélník", "Kosočtverec", "Kruh", "Trojúhelník"]),
    hints: ["Obdélník = akce, kosočtverec = rozhodnutí.", "Obdélník má rovné strany na všech stranách."],
  },
  {
    question: "Jaký tvar má v diagramu rozhodnutí (podmínka)?",
    correctAnswer: "Kosočtverec",
    options: shuffle(["Kosočtverec", "Obdélník", "Kruh", "Hvězda"]),
    hints: ["Kosočtverec má špičky na všech čtyřech stranách.", "Podmínka = větvení = kosočtverec."],
  },
  {
    question: "Co zobrazují šipky ve vývojovém diagramu?",
    correctAnswer: "Pořadí kroků",
    options: shuffle(["Pořadí kroků", "Délku trvání kroků", "Počet chyb", "Počet opakování"]),
    hints: ["Šipky ukazují, kam jít dál.", "Sleduj šipky, abys věděl, v jakém pořadí kroky provést."],
  },
  {
    question: "Recept na jídlo je příkladem:",
    correctAnswer: "Algoritmu",
    options: shuffle(["Algoritmu", "Počítačového viru", "Databáze", "Operačního systému"]),
    hints: ["Recept popisuje přesné kroky jak připravit jídlo.", "Algoritmus = přesný sled kroků."],
  },
  {
    question: "GPS navigace je příkladem algoritmu, protože:",
    correctAnswer: "Dává přesné pokyny krok za krokem k cíli",
    options: shuffle(["Dává přesné pokyny krok za krokem k cíli", "Jezdí sama bez vstupů", "Zná jen jednu cestu", "Nikdy neskončí"]),
    hints: ["Navigace říká 'Za 200 m odbočte vlevo' — krok za krokem.", "Algoritmus vede k cíli přes jasné kroky."],
  },
  {
    question: "Má algoritmus výstup?",
    correctAnswer: "Ano, výsledek nebo produkt",
    options: shuffle(["Ano, výsledek nebo produkt", "Ne, algoritmus nemá výstup", "Jen někdy", "Záleží na počtu kroků"]),
    hints: ["Algoritmus musí mít vstup i výstup.", "Výstup receptu je hotové jídlo."],
  },
];

const SELECT_TASKS_L2: PracticeTask[] = [
  {
    question: "Proč musí mít algoritmus vstup?",
    correctAnswer: "Aby věděl, s čím má pracovat",
    options: shuffle(["Aby věděl, s čím má pracovat", "Aby mohl běžet věčně", "Aby neměl žádný výstup", "Vstup není povinný"]),
    hints: ["Bez vstupu algoritmus neví, co zpracovat.", "Recept potřebuje jako vstup suroviny."],
  },
  {
    question: "Algoritmus sčítání dvou čísel je příkladem vlastnosti:",
    correctAnswer: "Obecnosti (funguje pro libovolná dvě čísla)",
    options: shuffle(["Obecnosti (funguje pro libovolná dvě čísla)", "Jedinečnosti (funguje jen pro 3+5)", "Náhodnosti", "Nekonečnosti"]),
    hints: ["Obecnost znamená, že algoritmus funguje pro různé hodnoty vstupů.", "3+5 i 10+20 jsou oba vstupy stejného algoritmu."],
  },
  {
    question: "Co se stane, pokud algoritmus nemá konečnost?",
    correctAnswer: "Nikdy neskončí (zacyklí se)",
    options: shuffle(["Nikdy neskončí (zacyklí se)", "Skončí rychleji", "Přeskočí některé kroky", "Vymaže vstup"]),
    hints: ["Nekonečný algoritmus = program, který nikdy nekončí.", "Počítač by 'zamrz' v nekonečné smyčce."],
  },
  {
    question: "Vývojový diagram začíná a končí tvarem:",
    correctAnswer: "Oválem / zaoblenými rohy",
    options: shuffle(["Oválem / zaoblenými rohy", "Obdélníkem", "Kosočtvercem", "Hvězdou"]),
    hints: ["Začátek a konec mají speciální tvar — oválný.", "Ostatní kroky jsou obdélníky."],
  },
  {
    question: "Příprava domácího úkolu je algoritmus, protože:",
    correctAnswer: "Má přesné kroky v daném pořadí a výsledek (hotový úkol)",
    options: shuffle(["Má přesné kroky v daném pořadí a výsledek (hotový úkol)", "Je to hra", "Nemá žádné kroky", "Trvá nekonečně"]),
    hints: ["Algoritmus = konečný sled kroků vedoucí k cíli.", "Hotový úkol = výstup algoritmu."],
  },
  {
    question: "Jak se nazývá algoritmus zapsaný jako program v počítači?",
    correctAnswer: "Zdrojový kód (kód programu)",
    options: shuffle(["Zdrojový kód (kód programu)", "Vývojový diagram", "Databáze", "Operační systém"]),
    hints: ["Program je algoritmus zapsaný v programovacím jazyce.", "Python, Java nebo C jsou jazyky pro zápis kódu."],
  },
  {
    question: "Návod k sestavení nábytku je příkladem algoritmu, protože:",
    correctAnswer: "Popisuje přesné kroky v daném pořadí ke splnění cíle",
    options: shuffle(["Popisuje přesné kroky v daném pořadí ke splnění cíle", "Nábytek se sestrojí sám", "Kroky lze dělat v libovolném pořadí", "Nemá výsledek"]),
    hints: ["Šrouby utuhnout před přišroubováním dalšího dílu.", "Pořadí kroků je v návodu důležité."],
  },
  {
    question: "Proč je algoritmus lepší než 'dělej co chceš'?",
    correctAnswer: "Je přesný, opakovatelný a vede vždy ke stejnému výsledku",
    options: shuffle(["Je přesný, opakovatelný a vede vždy ke stejnému výsledku", "Je náhodný", "Závisí na náladě", "Každé spuštění dá jiný výsledek"]),
    hints: ["Recept zaručuje, že jídlo bude vždy chutnat stejně.", "Přesnost algoritmu = reprodukovatelnost."],
  },
  {
    question: "Kolik výsledků (výstupů) má správný algoritmus?",
    correctAnswer: "Alespoň jeden",
    options: shuffle(["Alespoň jeden", "Přesně 100", "Žádný", "Záleží na počítači"]),
    hints: ["Algoritmus musí mít výstup — jinak k čemu by byl?", "Recept má jako výstup hotové jídlo."],
  },
  {
    question: "Proč v algoritmu záleží na pořadí kroků?",
    correctAnswer: "Špatné pořadí může vést k nesprávnému výsledku",
    options: shuffle(["Špatné pořadí může vést k nesprávnému výsledku", "Pořadí není důležité", "Libovolné pořadí dá vždy správný výsledek", "Počítač sám pořadí opraví"]),
    hints: ["Co by se stalo, kdybys dřív přidal náplň do sendviče, než bys vzal chleba?", "Pořadí kroků je klíčové."],
  },
];

const SELECT_TASKS_L3: PracticeTask[] = [
  {
    question: "Která z možností NENÍ vlastností správného algoritmu?",
    correctAnswer: "Náhodnost (výsledek se liší při každém spuštění)",
    options: shuffle(["Náhodnost (výsledek se liší při každém spuštění)", "Jednoznačnost", "Konečnost", "Obecnost"]),
    hints: ["Algoritmus musí být deterministický — stejné vstupy = stejný výsledek.", "Náhodnost je opakem jednoznačnosti."],
  },
  {
    question: "Počítač provádí algoritmus, ale výsledek se vždy liší. Která vlastnost je porušena?",
    correctAnswer: "Jednoznačnost",
    options: shuffle(["Jednoznačnost", "Konečnost", "Obecnost", "Vstup"]),
    hints: ["Jednoznačnost = každý krok má jediný možný výklad.", "Různé výsledky = nejasné kroky."],
  },
  {
    question: "Program se spustí, ale nikdy sám neskončí — potřebuje restart. Která vlastnost chybí?",
    correctAnswer: "Konečnost",
    options: shuffle(["Konečnost", "Jednoznačnost", "Obecnost", "Výstup"]),
    hints: ["Konečnost zaručuje, že algoritmus jednou skončí.", "Nikdy nekončící program postrádá konečnost."],
  },
  {
    question: "Algoritmus sčítání funguje jen pro čísla 3 a 5, jiné vstupy odmítne. Která vlastnost chybí?",
    correctAnswer: "Obecnost",
    options: shuffle(["Obecnost", "Konečnost", "Jednoznačnost", "Výstup"]),
    hints: ["Obecnost = funguje pro různé vstupy.", "Algoritmus omezený na konkrétní hodnoty postrádá obecnost."],
  },
  {
    question: "Ve vývojovém diagramu je kosočtverec s textem 'Je číslo větší než 10?'. Co representuje?",
    correctAnswer: "Podmínku (větvení) — dva možné výstupy: Ano / Ne",
    options: shuffle(["Podmínku (větvení) — dva možné výstupy: Ano / Ne", "Příkaz (akci)", "Začátek diagramu", "Konec diagramu"]),
    hints: ["Kosočtverec = rozhodnutí v diagramu.", "Z kosočtverce vedou dvě šipky: Ano a Ne."],
  },
  {
    question: "Proč je důležité mít v algoritmu definovaný vstup?",
    correctAnswer: "Algoritmus bez vstupu nemůže přizpůsobit výpočet různým datům",
    options: shuffle(["Algoritmus bez vstupu nemůže přizpůsobit výpočet různým datům", "Vstup zpomaluje algoritmus", "Vstup zabraňuje opakování", "Vstup není vůbec potřeba"]),
    hints: ["Bez vstupu by algoritmus vždy počítal jen s pevně danými hodnotami.", "Obecnost závisí na vstupu."],
  },
  {
    question: "Co znamená, že algoritmus je deterministický?",
    correctAnswer: "Stejné vstupy vždy dají stejný výstup",
    options: shuffle(["Stejné vstupy vždy dají stejný výstup", "Výsledek závisí na náhodě", "Každé spuštění trvá jinou dobu", "Algoritmus běží na více zařízeních"]),
    hints: ["Deterministický = předvídatelný, opakovatelný.", "2+3 bude vždy 5, bez ohledu na to, kdy počítáš."],
  },
  {
    question: "Jaký je rozdíl mezi algoritmem a programem?",
    correctAnswer: "Algoritmus je postup (myšlenka), program je algoritmus zapsaný v kódu pro počítač",
    options: shuffle(["Algoritmus je postup (myšlenka), program je algoritmus zapsaný v kódu pro počítač", "Jsou to totéž", "Program je obecnější než algoritmus", "Algoritmus funguje jen na papíře"]),
    hints: ["Algoritmus lze zapsat slovem, diagramem i kódem.", "Program je konkrétní implementace algoritmu."],
  },
  {
    question: "Jaký problém nastane, pokud vynecháme krok v algoritmu?",
    correctAnswer: "Výsledek bude nesprávný nebo algoritmus nebude fungovat",
    options: shuffle(["Výsledek bude nesprávný nebo algoritmus nebude fungovat", "Algoritmus bude rychlejší", "Nic se nestane", "Algoritmus se opraví sám"]),
    hints: ["Jako kdybys vynechal přísadu v receptu.", "Každý krok má svůj důvod."],
  },
  {
    question: "GPS navigace splňuje všechny vlastnosti algoritmu. Která z nich zaručuje, že tě vždy dovede do cíle (nejen pro jednu konkrétní adresu)?",
    correctAnswer: "Obecnost",
    options: shuffle(["Obecnost", "Konečnost", "Jednoznačnost", "Opakování"]),
    hints: ["Navigace funguje pro libovolnou adresu — to je obecnost.", "Obecnost = funguje pro různé vstupy."],
  },
];

function gen(level: number): PracticeTask[] {
  const dragPool = shuffle(DRAG_TASKS).slice(0, level === 1 ? 5 : level === 2 ? 7 : 10);
  const selectPool =
    level === 1
      ? shuffle(SELECT_TASKS_L1).slice(0, 20)
      : level === 2
      ? shuffle(SELECT_TASKS_L2).slice(0, 20)
      : shuffle(SELECT_TASKS_L3).slice(0, 20);
  return shuffle([...dragPool, ...selectPool]);
}

export const POSTUPANAVODSLEDJEDNOTLIVYCHKROKU: TopicMetadata[] = [
  {
    id: "g4-informatika-algoritmizace-a-programovani-pokyny-a-postupy-postup-a-navod-sled-jednotlivych-kroku",
    rvpNodeId: "g4-informatika-algoritmizace-a-programovani-pokyny-a-postupy-postup-a-navod-sled-jednotlivych-kroku",
    title: "Postup a návod - sled jednotlivých kroků",
    studentTitle: "Algoritmus a postup",
    subject: "informatika",
    category: "Algoritmizace a programování",
    topic: "Algoritmizace a programování",
    briefDescription: "Naučíš se, co je algoritmus a jak sestavit přesný sled kroků.",
    keywords: ["algoritmus", "postup", "kroky", "návod", "vývojový diagram"],
    goals: [
      "Žák vysvětlí pojem algoritmus",
      "Žák uvede vlastnosti algoritmu (jednoznačnost, konečnost, obecnost)",
      "Žák seřadí kroky jednoduchého algoritmu ve správném pořadí",
    ],
    boundaries: ["Žák nezapisuje algoritmy v programovacím jazyce"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "conceptual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Algoritmus je jako recept — má přesné kroky v daném pořadí a musí jednou skončit.",
      steps: [
        "Přečti si všechny kroky",
        "Přemýšlej, co musí být hotové dřív",
        "Seřaď kroky logicky od začátku do konce",
      ],
      commonMistake: "Přeskočení kroků nebo záměna jejich pořadí vede k nesprávnému výsledku.",
      example: "Příprava sendviče: Vem chleba → Natři máslem → Přidej náplň → Přikryj druhým chlebem.",
    },
  },
];
