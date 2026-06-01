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
    question: "Jaký druh řeči je věta: Petr řekl: \"Přijdu zítra.\"",
    correctAnswer: "přímá řeč",
    options: ["přímá řeč", "nepřímá řeč", "obě najednou", "ani jedna"],
    hints: ["Přímá řeč jsou doslova citovaná slova v uvozovkách."],
  },
  {
    question: "Jaký druh řeči je věta: Petr řekl, že přijde zítra.",
    correctAnswer: "nepřímá řeč",
    options: ["přímá řeč", "nepřímá řeč", "obě najednou", "ani jedna"],
    hints: ["Nepřímá řeč přeformuluje obsah bez uvozovek a přidá spojku 'že'."],
  },
  {
    question: "Přímá řeč se píše:",
    correctAnswer: "v uvozovkách",
    options: ["v uvozovkách", "kurzívou", "tučně", "bez zvláštního označení"],
    hints: ["Uvozovky ukazují, že jde o přímou citaci slov."],
  },
  {
    question: "Převeď do nepřímé řeči: Jana řekla: \"Mám hlad.\"",
    correctAnswer: "Jana řekla, že má hlad.",
    options: [
      "Jana řekla, že má hlad.",
      "Jana řekla, že mám hlad.",
      "Jana: Mám hlad.",
      "Jana řekla mám hlad.",
    ],
    hints: ["V nepřímé řeči se 'mám' změní na 'má' (změna osoby)."],
  },
  {
    question: "Převeď do přímé řeči: Tomáš řekl, že jde domů.",
    correctAnswer: "Tomáš řekl: \"Jdu domů.\"",
    options: [
      "Tomáš řekl: \"Jdu domů.\"",
      "Tomáš řekl: \"Jde domů.\"",
      "Tomáš: jde domů.",
      "Tomáš řekl jdu domů.",
    ],
    hints: ["V přímé řeči mluvčí mluví za sebe – 1. osoba + uvozovky."],
  },
  {
    question: "Kde se píše čárka při přímé řeči s uvozovací větou?",
    correctAnswer: "před uvozovkami nebo po uvozovací větě před přímou řečí",
    options: [
      "vždy na konci věty",
      "před uvozovkami nebo po uvozovací větě před přímou řečí",
      "nikdy",
      "jen u otázek",
    ],
    hints: ["Matka řekla[,] 'Pojď sem.' nebo 'Pojď sem[,]' řekla matka."],
  },
  {
    question: "Co je uvozovací věta?",
    correctAnswer: "věta, která uvádí přímou řeč (říká, kdo mluví)",
    options: [
      "věta v uvozovkách",
      "věta, která uvádí přímou řeč (říká, kdo mluví)",
      "první věta v odstavci",
      "věta bez slovesa",
    ],
    hints: ["Petr ŘEKL: ... – tučný výraz je uvozovací věta."],
  },
  {
    question: "Převeď do nepřímé řeči: Lucie se zeptala: \"Jdeš s námi?\"",
    correctAnswer: "Lucie se zeptala, jestli (zda) jdu s nimi.",
    options: [
      "Lucie se zeptala, jestli (zda) jdu s nimi.",
      "Lucie se zeptala, jestli jdeš s námi.",
      "Lucie: Jdeš s námi?",
      "Lucie se ptá jestli.",
    ],
    hints: ["Otázka v nepřímé řeči = 'jestli / zda' + změna osoby."],
  },
  {
    question: "V přímé řeči se pronomen 'já' v nepřímé řeči změní na:",
    correctAnswer: "on nebo ona (podle pohlaví mluvčího)",
    options: [
      "já zůstane stejné",
      "ty",
      "on nebo ona (podle pohlaví mluvčího)",
      "my",
    ],
    hints: ["Přímá řeč: já mluvím → nepřímá řeč: on/ona říká."],
  },
  {
    question: "Ve větě 'Řekla: Přijdu.' – co je špatně?",
    correctAnswer: "chybí uvozovky – správně: Řekla: \"Přijdu.\"",
    options: [
      "nic, věta je správně",
      "chybí uvozovky – správně: Řekla: \"Přijdu.\"",
      "chybí čárka za přímou řečí",
      "chybí vykřičník",
    ],
    hints: ["Přímá řeč musí být v uvozovkách."],
  },
  {
    question: "Jak se změní sloveso v nepřímé řeči věty: Pavel řekl: \"Mám čas.\"?",
    correctAnswer: "Pavel řekl, že má čas. (mám → má)",
    options: [
      "Pavel řekl, že mám čas.",
      "Pavel řekl, že má čas. (mám → má)",
      "Pavel řekl, měl čas.",
      "Pavel říká mám čas.",
    ],
    hints: ["1. osoba 'mám' se změní na 3. osobu 'má'."],
  },
  {
    question: "Přímá řeč obsahuje:",
    correctAnswer: "doslova citovaná slova postavy nebo osoby",
    options: [
      "shrnutí toho, co někdo řekl",
      "doslova citovaná slova postavy nebo osoby",
      "vždy otázku",
      "vždy rozkaz",
    ],
    hints: ["Přímá = doslova, nepřímá = přeformulovaně."],
  },
  {
    question: "Jaký spojovací výraz se nejčastěji používá v nepřímé řeči?",
    correctAnswer: "že",
    options: ["nebo", "že", "ale", "proto"],
    hints: ["Řekl, že... Myslel si, že... – spojka 'že' uvádí nepřímou řeč."],
  },
  {
    question: "Převeď do přímé řeči: Maminka řekla, že je večeře hotová.",
    correctAnswer: "Maminka řekla: \"Večeře je hotová.\"",
    options: [
      "Maminka řekla: \"Večeře je hotová.\"",
      "Maminka řekla: \"Je večeře hotová.\"",
      "Maminka: večeře hotová.",
      "Maminka řekla je hotovo.",
    ],
    hints: ["V přímé řeči vrátíme 1. nebo 3. osobu a přidáme uvozovky."],
  },
  {
    question: "Ve větě s přímou řečí: „Pojď sem," řekla babička. – kde je čárka?",
    correctAnswer: "uvnitř uvozovek, před uvozovací větou",
    options: [
      "za uvozovkami",
      "uvnitř uvozovek, před uvozovací větou",
      "za slovem babička",
      "není tam čárka",
    ],
    hints: ["'Pojď sem[,]' řekla babička. Čárka je součástí přímé řeči."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Přepiš do nepřímé řeči: Ondřej zvolal: \"Hurá, vyhráli jsme!\"",
    correctAnswer: "Ondřej zvolal, že vyhráli.",
    options: [
      "Ondřej zvolal, že vyhráli.",
      "Ondřej zvolal, že jsme vyhráli.",
      "Ondřej: Hurá, vyhráli jsme!",
      "Ondřej zvolal hurá.",
    ],
    hints: ["Jsme → vyhráli (3. osoba); vykřičník a citoslovce v nepřímé řeči vynecháme."],
  },
  {
    question: "Přepiš do přímé řeči: Kluk se ptal, kdy pojedou na výlet.",
    correctAnswer: "Kluk se ptal: \"Kdy pojedeme na výlet?\"",
    options: [
      "Kluk se ptal: \"Kdy jedou na výlet?\"",
      "Kluk se ptal: \"Kdy pojedeme na výlet?\"",
      "Kluk: kdy výlet?",
      "Kluk řekl: Kdy jeli na výlet.",
    ],
    hints: ["V přímé řeči se vrátíme do 1. osoby množného čísla + otazník."],
  },
  {
    question: "Ve větě s přímou řečí: Tatínek zavolal: \"Snídaně je připravena!\" – co je uvozovací věta?",
    correctAnswer: "Tatínek zavolal",
    options: [
      "Snídaně je připravena!",
      "Tatínek zavolal",
      "celá věta",
      "jen slovo tatínek",
    ],
    hints: ["Uvozovací věta oznamuje, kdo mluví a jak."],
  },
  {
    question: "Přepiš do nepřímé řeči: Paní učitelka řekla: \"Otevřete učebnice na straně 10.\"",
    correctAnswer: "Paní učitelka řekla, abychom otevřeli učebnice na straně 10.",
    options: [
      "Paní učitelka řekla, abychom otevřeli učebnice na straně 10.",
      "Paní učitelka řekla, že otevřeli učebnice.",
      "Paní učitelka: otevřete.",
      "Paní učitelka řekla otevřete.",
    ],
    hints: ["Rozkaz v nepřímé řeči: 'aby...' místo 'že...'"],
  },
  {
    question: "Jaký je rozdíl mezi přímou a nepřímou řečí?",
    correctAnswer: "přímá cituje doslova, nepřímá přeformuluje a nemá uvozovky",
    options: [
      "přímá je kratší, nepřímá delší",
      "přímá cituje doslova, nepřímá přeformuluje a nemá uvozovky",
      "v přímé mluvíme, v nepřímé píšeme",
      "přímá je zdvořilejší",
    ],
    hints: ["Přímá = doslova + uvozovky. Nepřímá = vlastní slova, žádné uvozovky."],
  },
  {
    question: "Ve větě: \"Vrátím se,\" slíbil Jakub. – kde je chyba?",
    correctAnswer: "věta je správně napsaná",
    options: [
      "chybí vykřičník",
      "věta je správně napsaná",
      "chybí uvozovky na konci",
      "slíbil patří do uvozovek",
    ],
    hints: ["Slíbil + čárka uvnitř uvozovek – vše je správně."],
  },
  {
    question: "V nepřímé řeči se 'my' mění na:",
    correctAnswer: "oni (pokud mluvčí mluví o sobě a ostatních třetí osobě)",
    options: [
      "zůstane 'my'",
      "oni (pokud mluvčí mluví o sobě a ostatních třetí osobě)",
      "vždy na 'já'",
      "vždy na 'vy'",
    ],
    hints: ["Záleží na kontextu – kdo o kom mluví."],
  },
  {
    question: "Přepiš do přímé řeči: Sestra říkala, že je unavená a chce spát.",
    correctAnswer: "Sestra říkala: \"Jsem unavená a chci spát.\"",
    options: [
      "Sestra říkala: \"Je unavená a chce spát.\"",
      "Sestra říkala: \"Jsem unavená a chci spát.\"",
      "Sestra: unavená, spát.",
      "Sestra řekla jsem unavená.",
    ],
    hints: ["V přímé řeči mluvčí mluví za sebe – 1. osoba: jsem, chci."],
  },
  {
    question: "Přepiš do nepřímé řeči: David se zeptal: \"Máš čas?\"",
    correctAnswer: "David se zeptal, jestli mám čas.",
    options: [
      "David se zeptal, jestli mám čas.",
      "David se zeptal, jestli má čas.",
      "David: Máš čas?",
      "David se ptá máš čas.",
    ],
    hints: ["Otázka → jestli/zda + zachování osoby adresáta: 'máš' → 'mám' (z pohledu toho, kdo byl dotázán)."],
  },
  {
    question: "Ve větě: Lucie řekla, že přijde zítra. – čím se liší 'přijde' od přímé řeči?",
    correctAnswer: "v přímé řeči by bylo 'přijdu' (1. osoba Lucie)",
    options: [
      "ničím, oboje je stejné",
      "v přímé řeči by bylo 'přijdu' (1. osoba Lucie)",
      "v přímé řeči by bylo 'přijdeš'",
      "v přímé řeči by bylo 'přišla'",
    ],
    hints: ["Lucie = 1. osoba → v přímé řeči: já přijdu."],
  },
  {
    question: "Jakou interpunkci používáme při přímé řeči stojící PŘED uvozovací větou?",
    correctAnswer: "čárka nebo otazník nebo vykřičník na konci přímé řeči",
    options: [
      "tečka vždy",
      "čárka nebo otazník nebo vykřičník na konci přímé řeči",
      "žádná interpunkce",
      "středník",
    ],
    hints: ["'Pojď sem,' nebo 'Přijdeš?' nebo 'Zastav se!' + pak uvozovací věta."],
  },
  {
    question: "Přepiš do nepřímé řeči: Mirek vykřikl: \"Pozor, padá strom!\"",
    correctAnswer: "Mirek vykřikl, aby si dali pozor, protože padá strom.",
    options: [
      "Mirek vykřikl, aby si dali pozor, protože padá strom.",
      "Mirek vykřikl, že pozor strom.",
      "Mirek: Pozor!",
      "Mirek řekl pozor.",
    ],
    hints: ["Citoslovce a vykřičník se nahradí opisem v nepřímé řeči."],
  },
  {
    question: "Jaký tvar mají uvozovky v češtině?",
    correctAnswer: "dole-nahoru: „..." nebo «...» – spodní otevírací, horní zavírací",
    options: [
      "jen horní: \"...\"",
      "dole-nahoru: „..." nebo «...» – spodní otevírací, horní zavírací",
      "záleží na tiskárně",
      "vždy jednoduché: '...'",
    ],
    hints: ["Česká typografická norma: „takto" – otevírací dole, zavírací nahoře."],
  },
  {
    question: "Přepiš do přímé řeči: Táta nám řekl, abychom šli spát.",
    correctAnswer: "Táta nám řekl: \"Jděte spát.\"",
    options: [
      "Táta nám řekl: \"Šli jsme spát.\"",
      "Táta nám řekl: \"Jděte spát.\"",
      "Táta: spát!",
      "Táta řekl půjdeme spát.",
    ],
    hints: ["Abychom šli = rozkaz → v přímé řeči: Jděte! (rozkazovací způsob)."],
  },
  {
    question: "Může uvozovací věta stát uprostřed přímé řeči?",
    correctAnswer: "ano – 'Pojď,' řekl, 'to se stane.'",
    options: [
      "ne – vždy musí být před nebo za",
      "ano – 'Pojď,' řekl, 'to se stane.'",
      "jen v básních",
      "jen v rozhovorech",
    ],
    hints: ["Uvozovací věta může přímou řeč přerušit."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Přepiš celý dialog do nepřímé řeči: Petr řekl: \"Nechci jít.\" Eva odpověděla: \"Musíš.\"",
    correctAnswer: "Petr řekl, že nechce jít. Eva mu odpověděla, že musí.",
    options: [
      "Petr řekl, že nechce jít. Eva mu odpověděla, že musí.",
      "Petr řekl, že nechci jít. Eva řekla musíš.",
      "Petr: nechce. Eva: musí.",
      "Petr nechce, Eva musí.",
    ],
    hints: ["Každá replika → samostatná věta s nepřímou řečí."],
  },
  {
    question: "Ve větě: \"Jak se jmenuješ?\" zeptala se dívka. – kde chybí interpunkce?",
    correctAnswer: "věta je správně – otazník je součástí přímé řeči",
    options: [
      "chybí čárka před zavírající uvozovkou",
      "věta je správně – otazník je součástí přímé řeči",
      "chybí tečka za 'dívka'",
      "chybí vykřičník",
    ],
    hints: ["Při otázce v přímé řeči: otazník nahrazuje čárku."],
  },
  {
    question: "Proč v nepřímé řeči časujeme sloveso jinak než v přímé?",
    correctAnswer: "protože přímá řeč je z pohledu mluvčího (já), nepřímá z pohledu vypravěče (on/ona)",
    options: [
      "není to pravda – časování se nemění",
      "protože nepřímá řeč je zdvořilejší",
      "protože přímá řeč je z pohledu mluvčího (já), nepřímá z pohledu vypravěče (on/ona)",
      "záleží na slovese",
    ],
    hints: ["Přesun z 1. na 3. osobu je klíčový rozdíl."],
  },
  {
    question: "Převeď do nepřímé řeči: Soudce prohlásil: \"Obžalovaný je vinen.\"",
    correctAnswer: "Soudce prohlásil, že obžalovaný je vinen.",
    options: [
      "Soudce prohlásil, že obžalovaný je vinen.",
      "Soudce řekl, že je vinen.",
      "Soudce: vinen!",
      "Soudce prohlásil jsem vinen.",
    ],
    hints: ["Subjekt 'obžalovaný' zůstává, jen přidáme 'že'."],
  },
  {
    question: "V přímé řeči stojící za uvozovací větou se píše: Otec řekl, ___",
    correctAnswer: ": \"Přijdu brzy.\"",
    options: [
      "že přijde brzy.",
      ": \"Přijdu brzy.\"",
      ". Přijdu brzy.",
      ", Přijdu brzy.",
    ],
    hints: ["Za uvozovací větou → dvojtečka + uvozovky + obsah."],
  },
  {
    question: "Co se stane s vykřičníkem v přímé řeči, když ji přepíšeme do nepřímé?",
    correctAnswer: "vykřičník mizí, obsah se vyjádří opisem (že, aby, jak...)",
    options: [
      "vykřičník zůstane",
      "vykřičník mizí, obsah se vyjádří opisem (že, aby, jak...)",
      "změní se na otazník",
      "nahradí tečku",
    ],
    hints: ["Nepřímá řeč je klidnější – ztratíme zvolání i otázku jako interpunkci."],
  },
  {
    question: "Přepiš přímou řeč do nepřímé: Babička volala: \"Pojďte na oběd, děti!\"",
    correctAnswer: "Babička volala, ať přijdou na oběd.",
    options: [
      "Babička volala, ať přijdou na oběd.",
      "Babička volala, že pojdou na oběd.",
      "Babička: pojďte!",
      "Babička volala pojďte.",
    ],
    hints: ["Výzva (pojďte!) → 'ať přijdou' nebo 'aby přišli'."],
  },
  {
    question: "Ve větě: Kamarádka šeptala: \"Pss, nevíkej tomu!\" – najdi chybu.",
    correctAnswer: "chybí tečka nebo výzva – správně: „Pss, nikomu to nevíkej!"",
    options: [
      "věta je správně",
      "chybí tečka nebo výzva – správně: „Pss, nikomu to nevíkej!"",
      "chybí uvozovky",
      "chybí uvozovací věta",
    ],
    hints: ["'nevíkej' není slovo – správně 'neříkej'. A chybí adresát."],
  },
  {
    question: "Přepiš do přímé řeči: Trenér řekl hráčům, aby se soustředili.",
    correctAnswer: "Trenér řekl hráčům: \"Soustřeďte se!\"",
    options: [
      "Trenér řekl: \"Soustředili se!\"",
      "Trenér řekl hráčům: \"Soustřeďte se!\"",
      "Trenér: soustředit.",
      "Trenér řekl soustřeďte.",
    ],
    hints: ["Aby se soustředili → rozkaz: Soustřeďte se! (+ uvozovky)."],
  },
  {
    question: "Přímá řeč ve středu věty: „Přijdeme," slíbili kamarádi, „ale trochu pozdě." – je zapsána správně?",
    correctAnswer: "ano – uvozovací věta uprostřed přerušuje přímou řeč",
    options: [
      "ne – uvozovací věta nesmí být uprostřed",
      "ano – uvozovací věta uprostřed přerušuje přímou řeč",
      "ne – chybí vykřičník",
      "ne – chybí tečka",
    ],
    hints: ["Přerušená přímá řeč: první část, uvozovací věta, druhá část."],
  },
  {
    question: "Proč používáme přímou řeč v literárních textech?",
    correctAnswer: "aby text byl živý, čtenář slyšel postavu přímo mluvit",
    options: [
      "protože pravidla to přikazují",
      "aby text byl živý, čtenář slyšel postavu přímo mluvit",
      "protože nepřímá řeč neexistuje v literatuře",
      "aby text byl kratší",
    ],
    hints: ["Dialog v přímé řeči dává postavám autentický hlas."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const PRIMAANEPRIMARECUVOD: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-skladba-prima-a-neprima-rec-uvod",
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-prima-a-neprima-rec-uvod",
    title: "Přímá a nepřímá řeč (úvod)",
    studentTitle: "Přímá a nepřímá řeč",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Naučíš se přepsat přímou řeč na nepřímou a zpět.",
    keywords: ["přímá řeč", "nepřímá řeč", "uvozovky", "uvozovací věta"],
    goals: [
      "Rozlišit přímou a nepřímou řeč",
      "Převést přímou řeč do nepřímé a naopak",
      "Správně napsat interpunkci při přímé řeči",
    ],
    boundaries: [
      "Neprobírá se polopřímá řeč ani složitá literární analýza",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Přímá řeč = doslova citovaná slova v uvozovkách. Nepřímá řeč = přeformulovaná bez uvozovek, s 'že / aby / jestli'.",
      steps: [
        "Najdi, co bylo řečeno.",
        "Zjisti, kdo to řekl (uvozovací věta).",
        "Přepis: přímá → nepřímá: přidej 'že', odstraň uvozovky, změň osobu.",
        "Přepis: nepřímá → přímá: odstraň 'že', přidej uvozovky, vrať osobu.",
      ],
      commonMistake: "Žáci zapomenou změnit osobu (já → on/ona) nebo zapomenou přidat/odebrat uvozovky.",
      example: "Přímá: Jana řekla: \"Jsem unavená.\" Nepřímá: Jana řekla, že je unavená.",
    },
  },
];
