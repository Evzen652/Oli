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
    question: "Jaký druh číslovky je 'pět'?",
    correctAnswer: "základní – kolik?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – kolikery?", "násobná – kolikrát?"],
    hints: ["Zkus na 'pět' postupně všechny čtyři otázky: kolik? kolikátý? kolikery? kolikrát? — jen jedna z nich dává smysl."],
    explanation: "Ptáme se: Kolik? — pět. Číslovka udává prostý počet, proto je základní. Pořadí by bylo 'pátý', sada 'patery' a opakování 'pětkrát'.",
  },
  {
    question: "Jaký druh číslovky je 'třetí'?",
    correctAnswer: "řadová – kolikátý?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – kolikery?", "násobná – kolikrát?"],
    hints: ["Zkus na 'třetí' postupně všechny čtyři otázky: kolik? kolikátý? kolikery? kolikrát? — jen jedna z nich dává smysl."],
    explanation: "Ptáme se: Kolikátý? — třetí. Číslovka udává pořadí v řadě, proto je řadová. Prostý počet by byl 'tři', opakování 'třikrát'.",
  },
  {
    question: "Jaký druh číslovky je 'dvoje'?",
    correctAnswer: "druhová – kolikery?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – kolikery?", "násobná – kolikrát?"],
    hints: ["Zkus na 'dvoje' postupně všechny čtyři otázky: kolik? kolikátý? kolikery? kolikrát? — jen jedna z nich dává smysl."],
    explanation: "Ptáme se: Kolikery? — dvoje (dvoje dveře, dvoje boty). Číslovka počítá sady nebo druhy věcí, proto je druhová. Kdybychom počítali jednotlivé kusy, řekli bychom 'dva'.",
  },
  {
    question: "Jaký druh číslovky je 'třikrát'?",
    correctAnswer: "násobná – kolikrát?",
    options: ["základní – kolik?", "řadová – kolikátý?", "druhová – kolikery?", "násobná – kolikrát?"],
    hints: ["Zkus na 'třikrát' postupně všechny čtyři otázky: kolik? kolikátý? kolikery? kolikrát? — jen jedna z nich dává smysl."],
    explanation: "Ptáme se: Kolikrát? — třikrát. Číslovka říká, kolikrát se děj opakoval, proto je násobná. Prostý počet by byl 'tři', pořadí 'třetí'.",
  },
  {
    question: "Jaký druh číslovky je 'druhý'?",
    correctAnswer: "řadová",
    options: ["řadová", "základní", "druhová", "násobná"],
    hints: ["Tohle číslo říká POŘADÍ, ne přesný počet ani kolikrát se něco opakuje — zkus na něj zformulovat vhodnou otázku."],
    explanation: "Ptáme se: Kolikátý? — druhý. Číslovka udává pořadí, proto je řadová. Pozor na podobnost se slovem 'druhová' — ta počítá sady (dvoje), ne pořadí.",
  },
  {
    question: "Jaký druh číslovky je 'jednou'?",
    correctAnswer: "násobná",
    options: ["základní", "násobná", "řadová", "druhová"],
    hints: ["Tohle slovo říká, KOLIK OPAKOVÁNÍ děje proběhlo — zkus na něj zformulovat vhodnou otázku."],
    explanation: "Ptáme se: Kolikrát? — jednou. Číslovka počítá opakování děje, proto je násobná. Základní by byla 'jeden', řadová 'první'.",
  },
  {
    question: "Jaký druh číslovky je 'jedny' (například jedny dveře)?",
    correctAnswer: "druhová",
    options: ["základní", "řadová", "druhová", "násobná"],
    hints: ["Tato číslovka označuje sadu nebo druh věcí (například věci, které přirozeně tvoří pár). Která otázka se jí ptá?"],
    explanation: "Dveře jsou pomnožné — počítáme je po celcích, ne po kusech. Proto 'jedny dveře', ne 'jeden dveře'. Číslovky počítající sady jsou druhové.",
  },
  {
    question: "Jaký druh číslovky je 'sedm'?",
    correctAnswer: "základní",
    options: ["řadová", "druhová", "násobná", "základní"],
    hints: ["Zkus se zeptat na toto číslo otázkou: kolik? kolikátý? kolikrát? Která otázka sem sedí nejlépe?"],
    explanation: "Ptáme se: Kolik? — sedm. Číslovka udává prostý počet, proto je základní.",
  },
  {
    question: "Jaký druh číslovky je 'sedmý'?",
    correctAnswer: "řadová",
    options: ["řadová", "základní", "druhová", "násobná"],
    hints: ["Zkus se zeptat na toto číslo otázkou: kolik? kolikátý? kolikrát? Která otázka sem sedí nejlépe?"],
    explanation: "Ptáme se: Kolikátý? — sedmý. Číslovka udává pořadí v řadě, proto je řadová.",
  },
  {
    question: "Jaký druh číslovky je 'sedmkrát'?",
    correctAnswer: "násobná",
    options: ["základní", "násobná", "řadová", "druhová"],
    hints: ["Zkus se zeptat na toto číslo otázkou: kolik? kolikátý? kolikrát? Která otázka sem sedí nejlépe?"],
    explanation: "Ptáme se: Kolikrát? — sedmkrát. Přípona -krát říká, kolikrát se děj opakoval, proto je číslovka násobná.",
  },
  {
    question: "Na jakou otázku odpovídají základní číslovky?",
    correctAnswer: "kolik?",
    options: ["kolikátý?", "kolikery?", "kolik?", "kolikrát?"],
    hints: ["Základní číslovky říkají, jak velký je počet (pět, deset, sto). Jakou otázku bys položil, kdybys chtěl zjistit počet?"],
    explanation: "Základní číslovky udávají prostý počet (pět jablek), a na počet se ptáme otázkou 'kolik'. Ostatní otázky patří k pořadí, sadám a opakování.",
  },
  {
    question: "Na jakou otázku odpovídají řadové číslovky?",
    correctAnswer: "kolikátý?",
    options: ["kolik?", "kolikery?", "kolikrát?", "kolikátý?"],
    hints: ["Řadové číslovky vyjadřují pořadí (první, druhý, třetí). Jakou otázku bys položil, kdybys chtěl zjistit pořadí?"],
    explanation: "Řadové číslovky určují místo v řadě (třetí místo), a na pořadí se ptáme otázkou 'kolikátý'. Otázka 'kolik' by vedla k číslovce základní.",
  },
  {
    question: "Na jakou otázku odpovídají druhové číslovky?",
    correctAnswer: "kolikery?",
    options: ["kolikery?", "kolik?", "kolikátý?", "kolikrát?"],
    hints: ["Druhové číslovky počítají sady nebo druhy věcí, ne jednotlivé kusy — zkus zformulovat otázku, na kterou takové počítání odpovídá."],
    explanation: "Druhové číslovky počítají sady či druhy (dvoje boty, troje dveře) a ptáme se na ně otázkou 'kolikery'. Na 'kolik' by odpovídala číslovka základní — dva, tři.",
  },
  {
    question: "Na jakou otázku odpovídají násobné číslovky?",
    correctAnswer: "kolikrát?",
    options: ["kolik?", "kolikrát?", "kolikátý?", "kolikery?"],
    hints: ["Násobné číslovky říkají, kolik opakování děje proběhlo (jednou, dvakrát, trojnásobně) — zkus zformulovat otázku, na kterou tahle čísla odpovídají."],
    explanation: "Násobné číslovky vyjadřují počet opakování (dvakrát denně) a ptáme se na ně otázkou 'kolikrát'. Otázka 'kolik' by vedla k číslovce základní.",
  },
  {
    question: "Jaký druh číslovky je 'trojnásobný'?",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "násobná", "druhová"],
    hints: ["Přípona -násobný říká, kolikrát je něco větší. Zkus se zeptat: kolikrát? Patří to k druhu, který tuto otázku zodpovídá."],
    explanation: "Ptáme se: Kolikrát? — trojnásobný (třikrát větší). Násobné číslovky mohou mít i tvar přídavného jména, ale druh se tím nemění.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ve větě 'Přišla jako první.' jaký druh číslovky je 'první'?",
    correctAnswer: "řadová",
    options: ["základní", "druhová", "násobná", "řadová"],
    hints: ["Zkus se zeptat: kolikátá přišla? Podle toho, která otázka sedí, poznáš druh číslovky."],
    explanation: "Ptáme se: Kolikátá přišla? — první. Číslovka určuje pořadí v cíli, proto je řadová.",
  },
  {
    question: "Ve větě 'Koupil dvoje boty.' jaký druh číslovky je 'dvoje'?",
    correctAnswer: "druhová",
    options: ["druhová", "základní", "řadová", "násobná"],
    hints: ["Boty existují přirozeně v párech. Číslovka vyjadřuje sadu nebo druh — která otázka se na ni ptá?"],
    explanation: "Koupil dva páry, tedy dvě sady — proto 'dvoje', ne 'dva'. Číslovky počítající sady jsou druhové. 'Dva boty' by znamenalo dva jednotlivé kusy.",
  },
  {
    question: "Ve větě 'Přečetl jsem to dvakrát.' jaký druh číslovky je 'dvakrát'?",
    correctAnswer: "násobná",
    options: ["základní", "násobná", "řadová", "druhová"],
    hints: ["Zeptej se na tuto číslovku: kolikrát přečetl? Podle odpovědi poznáš, který druh číslovky vyjadřuje opakování děje."],
    explanation: "Ptáme se: Kolikrát přečetl? — dvakrát. Číslovka počítá opakování děje, proto je násobná.",
  },
  {
    question: "Ve větě 'Máme sto korun.' jaký druh číslovky je 'sto'?",
    correctAnswer: "základní",
    options: ["řadová", "druhová", "základní", "násobná"],
    hints: ["Zeptej se: kolik korun máme? Která otázka (kolik? / kolikátý? / kolikrát?) sem sedí?"],
    explanation: "Ptáme se: Kolik korun? — sto. Číslovka udává prostý počet, proto je základní.",
  },
  {
    question: "Co je rozdíl mezi 'tři' a 'troje'?",
    correctAnswer: "tři = počet kusů, troje = počet sad",
    options: ["tři = počet sad, troje = počet kusů", "tři i troje znamenají totéž", "tři je číslovka, troje je příslovce", "tři = počet kusů, troje = počet sad"],
    hints: ["Jedno z těch dvou slov říká, kolik KUSŮ něčeho je, druhé říká, kolik SAD dohromady tvoří danou věc (dveře mají dvě křídla, boty dva kusy) — zkus rozhodnout, které je které."],
    explanation: "'Tři' je číslovka základní a počítá jednotlivé kusy (tři tužky). 'Troje' je číslovka druhová a počítá sady nebo dvojice (troje dveře, troje boty). Obojí jsou číslovky, jen jiného druhu.",
  },
  {
    question: "Jaký druh číslovky je 'stonásobně'?",
    correctAnswer: "násobná",
    options: ["násobná", "základní", "řadová", "druhová"],
    hints: ["Přípona -násobně říká, kolikrát je něco větší nebo více. Zkus se zeptat otázkou, která odpovídá opakování."],
    explanation: "Ptáme se: Kolikrát? — stonásobně (stokrát více). Násobné číslovky mohou mít i tvar příslovce, druh se tím nemění.",
  },
  {
    question: "Ve větě 'Setkal jsem se s ním potřetí.' jaký druh číslovky je 'potřetí'?",
    correctAnswer: "násobná",
    options: ["základní", "násobná", "řadová", "druhová"],
    hints: ["'Potřetí' znamená 'po třetí'. Zkus se zeptat: kolikrát jsem se s ním setkal? Podle odpovědi urči druh číslovky."],
    explanation: "Ptáme se: Kolikrát? — potřetí. Slova poprvé, podruhé, potřetí počítají opakování děje, proto jsou to číslovky násobné, ne řadové.",
  },
  {
    question: "Ve větě 'Na třetím místě skončila.' jaký druh číslovky je 'třetím'?",
    correctAnswer: "řadová",
    options: ["základní", "druhová", "řadová", "násobná"],
    hints: ["Zeptej se: na kolikátém místě skončila? Která otázka ti pomůže určit druh číslovky vyjadřující pořadí?"],
    explanation: "Ptáme se: Na kolikátém místě? — na třetím. Číslovka určuje pořadí, proto je řadová. Tvar 'třetím' je jen 6. pád, druh se skloňováním nemění.",
  },
  {
    question: "Jaký druh číslovky je 'půldruhého'?",
    correctAnswer: "základní",
    options: ["řadová", "druhová", "násobná", "základní"],
    hints: ["'Půldruhého' vyjadřuje zlomkový počet. Zeptej se: kolik? — odpovídá na tuto otázku, nebo jinak?"],
    explanation: "Ptáme se: Kolik? — půldruhého, tedy jeden a půl. Číslovky vyjadřující i neceločíselný počet patří mezi základní (zlomkové).",
  },
  {
    question: "Jaký druh číslovky je 'čtvrtý'?",
    correctAnswer: "řadová",
    options: ["řadová", "základní", "druhová", "násobná"],
    hints: ["Zkus se zeptat: kolikátý? Pokud otázka sedí, víš, o jaký druh jde."],
    explanation: "Ptáme se: Kolikátý? — čtvrtý. Číslovka udává pořadí, proto je řadová. Základní by byla 'čtyři'.",
  },
  {
    question: "Jaký druh číslovky je 'čtvery' (čtvery housle)?",
    correctAnswer: "druhová",
    options: ["základní", "druhová", "řadová", "násobná"],
    hints: ["Housle existují jako celý nástroj, ale ve skupině jich může být víc druhů nebo sad. Která otázka se ptá na druh nebo sadu?"],
    explanation: "Housle jsou pomnožné jméno, takže se počítají po celcích — 'čtvery housle' jsou čtyři nástroje. Číslovky počítající sady jsou druhové.",
  },
  {
    question: "Jaký druh číslovky je 'čtyřikrát'?",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "násobná", "druhová"],
    hints: ["Zkus se zeptat: kolikrát? Pokud otázka sedí, jde o druh číslovky vyjadřující opakování."],
    explanation: "Ptáme se: Kolikrát? — čtyřikrát. Přípona -krát říká, kolikrát se děj opakoval, proto je číslovka násobná.",
  },
  {
    question: "Jaký druh číslovky je 'čtyři'?",
    correctAnswer: "základní",
    options: ["řadová", "druhová", "násobná", "základní"],
    hints: ["Zkus se zeptat: kolik? Pokud otázka sedí, jde o druh číslovky vyjadřující samotný počet."],
    explanation: "Ptáme se: Kolik? — čtyři. Číslovka udává prostý počet, proto je základní. Řadová by byla 'čtvrtý', druhová 'čtvery'.",
  },
  {
    question: "Použij správný druh číslovky: 'Přeložil to do ___ jazyků.' (počet = 5)",
    correctAnswer: "pěti",
    options: ["pěti", "pátých", "pětkrát", "patery"],
    hints: ["Do kolika jazyků? Hledáš tvar, který vyjadřuje prostý počet — ne pořadí, ne kolikrát se to opakovalo."],
    explanation: "Ptáme se: Do kolika jazyků? — do pěti. Potřebujeme číslovku základní ve 2. pádu. 'Pátých' by udávalo pořadí, 'pětkrát' opakování a 'patery' sady.",
  },
  {
    question: "Použij správný druh číslovky: 'Dostal se na ___ místo.' (pořadí = 5)",
    correctAnswer: "páté",
    options: ["pět", "páté", "pětkrát", "patery"],
    hints: ["Zadání říká, že jde o pořadí. Kterou otázkou se na pořadí ptáme a jaký tvar číslovky na ni odpovídá?"],
    explanation: "Ptáme se: Na kolikáté místo? — na páté. Pořadí vyjadřuje číslovka řadová. Tvar 'pět' by udával počet míst, ne pozici v pořadí.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jaký druh číslovky je 'jednorázově'?",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "násobná", "druhová"],
    hints: ["Přípona -rázově říká, kolikrát se děj odehrává. Zkus se zeptat otázkou, která odpovídá opakování."],
    explanation: "Ptáme se: Kolikrát? — jednorázově, tedy jen jednou. Číslovka počítá opakování děje, proto je násobná, i když má tvar příslovce.",
  },
  {
    question: "Ve větě 'Koupila troje rukavice.' proč 'troje' a ne 'tři'?",
    correctAnswer: "rukavice se počítají po sadách",
    options: ["tři je vždy nespisovný tvar", "záleží na nářečí", "obojí lze zaměnit", "rukavice se počítají po sadách"],
    hints: ["Věci existující v sadách nebo párech se počítají druhovými číslovkami."],
    explanation: "Rukavice tvoří pár, takže 'troje rukavice' jsou tři páry — počítáme sady, a na to slouží číslovka druhová. Tvar 'tři rukavice' by znamenal tři jednotlivé kusy.",
  },
  {
    question: "Jaký druh číslovky je 'jednosměrně'?",
    correctAnswer: "není číslovka",
    options: ["není číslovka", "základní", "násobná", "řadová"],
    hints: ["Obsahuje toto slovo číslo nebo číselný základ? Zkus odpovědět na otázku: lze se 'jednosměrně' zeptat otázkou kolik? kolikátý? kolikrát?"],
    explanation: "Slovo je odvozeno od přídavného jména 'jednosměrný' a říká, jakým způsobem se něco děje — ne kolikrát ani kolik. Je to příslovce, ne číslovka.",
  },
  {
    question: "Jaký druh číslovky je 'oba / obě'?",
    correctAnswer: "základní",
    options: [
      "druhová",
      "základní",
      "řadová",
      "násobná",
    ],
    hints: ["'Oba/obě' označuje vždy právě dva ze skupiny. Zkus se zeptat: kolik? Odpovídá tato číslovka na tuto otázku?"],
    explanation: "Ptáme se: Kolik? — oba, tedy dva. Je to zvláštní tvar číslovky základní pro dvojici, o níž už byla řeč. Pořadí ani opakování nevyjadřuje.",
  },
  {
    question: "Ve větě 'Psal jsem to desetkrát.' – urči druh číslovky 'desetkrát'.",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "násobná", "druhová"],
    hints: ["Zeptej se: kolikrát psal? Která otázka (kolik? / kolikátý? / kolikrát?) sem nejlépe pasuje?"],
    explanation: "Ptáme se: Kolikrát psal? — desetkrát. Číslovka počítá opakování děje, proto je násobná. Základní by byla 'deset'.",
  },
  {
    question: "Řadová číslovka 'první' se skloňuje jako:",
    correctAnswer: "přídavné jméno",
    options: ["podstatné jméno", "zájmeno", "neskloňuje se", "přídavné jméno"],
    hints: ["Zamysli se: mění 'první' svůj tvar podobně jako slova jako 'mladý' nebo 'jarní'? Ke kterému slovnímu druhu to přibližuje?"],
    explanation: "Skloňuje se podle vzorů přídavných jmen — 'první, prvního, prvnímu' jde stejně jako 'jarní, jarního, jarnímu'. Řadové číslovky se proto chovají jako přídavná jména.",
  },
  {
    question: "Základní číslovky 1–4 se skloňují jako:",
    correctAnswer: "přídavná jména nebo zájmena",
    options: ["přídavná jména nebo zájmena", "podstatná jména", "neskloňují se", "slovesa"],
    hints: ["Zkus tyhle číslovky ohnout do všech pádů a porovnej vzniklé koncovky se třemi možnými vzory ohýbání — kterému slovnímu druhu se to nejvíc podobá?"],
    explanation: "Číslovky 1–4 mění tvar podle rodu i pádu (jeden – jedna – jedno, dva – dvě, tři – třech), stejně jako přídavná jména a zájmena. Od pěti výš už rod nerozlišují.",
  },
  {
    question: "Základní číslovky 5+ (pět, šest...) se skloňují jako:",
    correctAnswer: "podstatná jména",
    options: [
      "přídavná jména",
      "podstatná jména",
      "neskloňují se",
      "zájmena",
    ],
    hints: ["Zkus skloňovat 'pět, pěti, pěti...' — všimni si, že se tvar u několika pádů vůbec nemění. Ke vzoru jakého slovního druhu takové skloňování připomíná?"],
    explanation: "Mají jen dva tvary — 'pět' v 1. a 4. pádu a 'pěti' ve zbylých, tedy stejně málo tvarů jako vzor kost u podstatných jmen. Rod na rozdíl od číslovek 1–4 nerozlišují.",
  },
  {
    question: "Ve větě 'Přišel poprvé.' jaký druh číslovky je 'poprvé'?",
    correctAnswer: "násobná",
    options: ["základní", "řadová", "násobná", "druhová"],
    hints: ["'Poprvé' říká, kolikátý pokus to byl. Zkus se zeptat: kolikrát? Která otázka sem lépe sedí?"],
    explanation: "Ptáme se: Kolikrát? — poprvé, tedy jednou. Slova poprvé, podruhé, potřetí počítají opakování děje, proto jsou násobná, i když připomínají pořadí.",
  },
  {
    question: "Jaký druh číslovky je 'několikrát'?",
    correctAnswer: "násobná neurčitá",
    options: ["základní neurčitá", "řadová neurčitá", "druhová neurčitá", "násobná neurčitá"],
    hints: ["'Několikrát' neudává přesné číslo. Zkus se zeptat: kolikrát? Podle otázky urči druh — a zamysli se, zda víme přesnou hodnotu."],
    explanation: "Ptáme se: Kolikrát? — několikrát, tedy násobná. Protože neříká přesný počet opakování, je navíc neurčitá.",
  },
  {
    question: "Jaký druh číslovky je 'dvojí' (například dvojí názor)?",
    correctAnswer: "druhová",
    options: ["druhová", "základní", "řadová", "násobná"],
    hints: ["'Dvojí' říká, že existují dva druhy nebo typy. Která otázka se ptá na druh nebo sadu věcí?"],
    explanation: "'Dvojí názor' znamená názor dvou druhů, ne dva kusy názoru. Číslovky počítající druhy jsou druhové — základní by byla 'dva'.",
  },
  {
    question: "Ve větě 'Skóre bylo pět ku třem.' jaký druh číslovky jsou 'pět' a 'třem'?",
    correctAnswer: "obě jsou základní",
    options: [
      "obě jsou řadové",
      "obě jsou základní",
      "obě jsou druhové",
      "obě jsou násobné",
    ],
    hints: ["'Pět' říká počet. 'Třem' je skloňovaný tvar téhož druhu číslovky. Zkus se zeptat na obě: kolik?"],
    explanation: "Obě udávají počet bodů, ptáme se na ně otázkou 'kolik'. Tvar 'třem' je jen 3. pád číslovky 'tři' — skloňování druh číslovky nemění.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const CISLOVKYDRUHYZAKLADNIRADOVEDRUHOVENASOBNE: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-cislovky-druhy-zakladni-radove-druhove-nasobne",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-cislovky-druhy-zakladni-radove-druhove-nasobne",
    title: "Číslovky – druhy: základní, řadové, druhové, násobné",
    studentTitle: "Druhy číslovek",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Poznáš čtyři druhy číslovek – základní, řadové, druhové a násobné.",
    keywords: ["číslovky", "základní", "řadové", "druhové", "násobné", "kolik", "kolikátý"],
    goals: [
      "Rozlišit čtyři druhy číslovek",
      "Použít správný druh číslovky v kontextu",
      "Odpovědět na otázky kolik?, kolikátý?, kolikery?, kolikrát?",
    ],
    boundaries: [
      "Neprobíráme skloňování číslovek podrobně",
      "Bez složitého dělení neurčitých číslovek",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Čtyři druhy číslovek: Základní (kolik?) = pět. Řadové (kolikátý?) = pátý. Druhové (kolikery?) = patery. Násobné (kolikrát?) = pětkrát.",
      steps: [
        "Přečti číslovku a zeptej se otázkou.",
        "Kolik? → základní (pět, sto, tisíc).",
        "Kolikátý? → řadová (pátý, stý).",
        "Kolikery? → druhová (patery, dvoje).",
        "Kolikrát? → násobná (pětkrát, jednou, trojnásobně).",
      ],
      commonMistake: "Žáci si pletou základní a druhové číslovky. 'Tři' = základní (počet). 'Troje' = druhová (druh/sada).",
      example: "Tři jablka (základní). Třetí místo (řadová). Troje dveře (druhová). Třikrát denně (násobná).",
    },
  },
];
