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
    question: "Jaký typ popisu je: 'Jablko je kulaté, červené, průměru přibližně 8 cm.'?",
    correctAnswer: "objektivní popis (jen fakta)",
    options: [
      "subjektivně zabarvený popis",
      "objektivní popis (jen fakta)",
      "pracovní postup",
      "vyprávění",
    ],
    hints: ["Objektivní = jen fakta bez hodnocení nebo emocí."],
  },
  {
    question: "Jaký typ popisu je: 'Jablko voní jako zahrada po dešti a jeho šťavnatost je jako polibek léta.'?",
    correctAnswer: "subjektivně zabarvený popis (emoce, přirovnání)",
    options: [
      "objektivní popis",
      "subjektivně zabarvený popis (emoce, přirovnání)",
      "pracovní postup",
      "zpráva",
    ],
    hints: ["Subjektivní = autor vyjadřuje své pocity, přirovnání, hodnocení."],
  },
  {
    question: "Jaký typ popisu je recept na dort?",
    correctAnswer: "pracovní postup (chronologické kroky)",
    options: [
      "objektivní popis",
      "subjektivně zabarvený popis",
      "pracovní postup (chronologické kroky)",
      "pohádka",
    ],
    hints: ["Recept = kroky v pořadí = pracovní postup."],
  },
  {
    question: "Pracovní postup používá slovesa v:",
    correctAnswer: "rozkazovacím způsobu nebo infinitivu (přidej, smíchej, ohřej)",
    options: [
      "podmiňovacím způsobu",
      "rozkazovacím způsobu nebo infinitivu (přidej, smíchej, ohřej)",
      "minulém čase",
      "přítomném čase bez rozkazů",
    ],
    hints: ["Přidej, smíchej, posekej – rozkazy pro čtenáře postupu."],
  },
  {
    question: "Subjektivně zabarvený popis obsahuje:",
    correctAnswer: "osobní hodnocení, přirovnání, citové výrazy",
    options: [
      "jen čísla a míry",
      "osobní hodnocení, přirovnání, citové výrazy",
      "jen technické parametry",
      "jen kroky postupu",
    ],
    hints: ["Subjektivní = moje pocity a dojmy z popisu."],
  },
  {
    question: "Objektivní popis obsahuje:",
    correctAnswer: "fakta bez hodnocení (tvar, barva, rozměry)",
    options: [
      "osobní dojmy",
      "přirovnání a emoce",
      "fakta bez hodnocení (tvar, barva, rozměry)",
      "kroky pracovního postupu",
    ],
    hints: ["Objektivní = bez emocí, jen fakta a měřitelné vlastnosti."],
  },
  {
    question: "Kde se nejčastěji setkáme s objektivním popisem?",
    correctAnswer: "v encyklopediích, technických návodech, vědeckých textech",
    options: [
      "v románech a povídkách",
      "v encyklopediích, technických návodech, vědeckých textech",
      "v básních",
      "v pohádkách",
    ],
    hints: ["Vědecký a odborný text = objektivní, bez emocí."],
  },
  {
    question: "Kde se nejčastěji setkáme se subjektivně zabarveným popisem?",
    correctAnswer: "v literárních textech, recenzích, cestopisech",
    options: [
      "v technických návodech",
      "v encyklopediích",
      "v literárních textech, recenzích, cestopisech",
      "v zákonech",
    ],
    hints: ["Literatura = autor sdílí své dojmy a pocity."],
  },
  {
    question: "Co je charakteristické pro pracovní postup?",
    correctAnswer: "chronologické pořadí kroků",
    options: [
      "libovolné pořadí",
      "chronologické pořadí kroků",
      "emoce a hodnocení",
      "přirovnání",
    ],
    hints: ["Pracovní postup: krok 1, krok 2, krok 3 – v přesném pořadí."],
  },
  {
    question: "Věta 'Přidej 200 g mouky a dobře promíchej.' patří do:",
    correctAnswer: "pracovního postupu",
    options: [
      "objektivního popisu",
      "subjektivního popisu",
      "pracovního postupu",
      "vyprávění",
    ],
    hints: ["Přidej, promíchej = rozkazy → pracovní postup."],
  },
  {
    question: "Věta 'Pes má čtyři tlapy, hnědou srst a váží 15 kg.' patří do:",
    correctAnswer: "objektivního popisu",
    options: [
      "subjektivního popisu",
      "pracovního postupu",
      "objektivního popisu",
      "vyprávění",
    ],
    hints: ["Fakta bez hodnocení = objektivní popis."],
  },
  {
    question: "Věta 'Ten milý pes s hebkou srsti mi vždy zvedne náladu.' patří do:",
    correctAnswer: "subjektivně zabarveného popisu",
    options: [
      "objektivního popisu",
      "pracovního postupu",
      "subjektivně zabarveného popisu",
      "zprávy",
    ],
    hints: ["Milý, hebká, zvedne náladu = hodnocení a emoce = subjektivní."],
  },
  {
    question: "Jaká je úloha spojek jako 'nejprve', 'poté', 'nakonec' v pracovním postupu?",
    correctAnswer: "označují pořadí kroků",
    options: [
      "vyjadřují emoce",
      "označují pořadí kroků",
      "spojují věty v souvětí",
      "popisují barvy",
    ],
    hints: ["Nejprve... poté... nakonec – chronologická posloupnost."],
  },
  {
    question: "Jak poznáš subjektivně zabarvený popis?",
    correctAnswer: "obsahuje přídavná jména hodnotící, přirovnání a pocity autora",
    options: [
      "obsahuje jen čísla",
      "obsahuje přídavná jména hodnotící, přirovnání a pocity autora",
      "je vždy kratší",
      "neobsahuje slovesa",
    ],
    hints: ["Skvělý, kouzelný, jako v pohádce – to jsou znaky subjektivního popisu."],
  },
  {
    question: "Jak poznáš pracovní postup v textu?",
    correctAnswer: "kroky jsou číslovány nebo řazeny slovesy v rozkazovacím způsobu",
    options: [
      "je psán v minulém čase",
      "kroky jsou číslovány nebo řazeny slovesy v rozkazovacím způsobu",
      "obsahuje dialogy",
      "popisuje krajinu",
    ],
    hints: ["1. Přidej... 2. Smíchej... 3. Ohřej... = pracovní postup."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak bys objektivně popsal/a automobil?",
    correctAnswer: "délka, výkon motoru, barva, počet sedadel – jen fakta",
    options: [
      "Krásné auto snů, jezdí jako vítr!",
      "délka, výkon motoru, barva, počet sedadel – jen fakta",
      "Popstal bych ho básní",
      "Záleží na mém vkusu",
    ],
    hints: ["Objektivní = technické parametry, ne dojmy."],
  },
  {
    question: "Jak bys subjektivně popsal/a západ slunce?",
    correctAnswer: "Zlatá záře zalévala oblohu, jako by nebe hořelo sladkým ohněm.",
    options: [
      "Slunce je hvězda vzdálená 150 mil. km.",
      "Zlatá záře zalévala oblohu, jako by nebe hořelo sladkým ohněm.",
      "Západ nastává v 19:45.",
      "Slunce se pohybuje 30 km/s.",
    ],
    hints: ["Subjektivní = poetický jazyk, přirovnání, emoce."],
  },
  {
    question: "Jaký styl je vhodný pro návod k použití pračky?",
    correctAnswer: "pracovní postup – objektivní, kroky v pořadí",
    options: [
      "subjektivně zabarvený popis",
      "pracovní postup – objektivní, kroky v pořadí",
      "poetický popis",
      "vyprávění příběhu",
    ],
    hints: ["Návod = kroky k provedení = pracovní postup."],
  },
  {
    question: "Jaký styl je vhodný pro turistického průvodce (popis hradu)?",
    correctAnswer: "mix – základní fakta + trochu subjektivního zabarvení",
    options: [
      "čistě technický popis",
      "pracovní postup",
      "mix – základní fakta + trochu subjektivního zabarvení",
      "básně o hradu",
    ],
    hints: ["Průvodce informuje (objektivně) a láká (subjektivně)."],
  },
  {
    question: "Ve větě 'Bohatě ozdobený sál rozjasňovaly stovky svíček.' je styl:",
    correctAnswer: "subjektivně zabarvený (výrazná přídavná jména, poetika)",
    options: [
      "objektivní (jen fakta)",
      "pracovní postup",
      "subjektivně zabarvený (výrazná přídavná jména, poetika)",
      "zpravodajský",
    ],
    hints: ["Bohatě ozdobený, rozjasňovaly = hodnotící a poetický styl."],
  },
  {
    question: "Ve větě 'Místnost má plochu 25 m² a výšku stropu 2,8 m.' je styl:",
    correctAnswer: "objektivní (měřitelná fakta)",
    options: [
      "subjektivní (emoce)",
      "pracovní postup",
      "objektivní (měřitelná fakta)",
      "lyrika",
    ],
    hints: ["Číselné hodnoty = objektivní popis."],
  },
  {
    question: "Proč je v pracovním postupu důležité přesné pořadí kroků?",
    correctAnswer: "špatné pořadí by mohlo vést k chybě nebo nebezpečí",
    options: [
      "kvůli délce textu",
      "špatné pořadí by mohlo vést k chybě nebo nebezpečí",
      "záleží na autorovi",
      "pořadí není důležité",
    ],
    hints: ["Recept: nejdříve zahřej máslo, pak přidej vejce – pořadí záleží."],
  },
  {
    question: "Jak bys subjektivně popsal/a svého oblíbeného herce?",
    correctAnswer: "s hodnotícími přídavnými jmény a vyjádřením obdivu",
    options: [
      "jen jeho výška a barva vlasů",
      "s hodnotícími přídavnými jmény a vyjádřením obdivu",
      "pracovní postup herectví",
      "seznam jeho filmů",
    ],
    hints: ["Subjektivní = tvůj pohled, tvůj obdiv, tvoje emoce."],
  },
  {
    question: "Jaký typ textu je recenze na film?",
    correctAnswer: "subjektivně zabarvený popis s hodnocením",
    options: [
      "objektivní popis",
      "pracovní postup",
      "subjektivně zabarvený popis s hodnocením",
      "návod k použití",
    ],
    hints: ["Recenze = kritikova osobní hodnocení = subjektivní."],
  },
  {
    question: "Jaký typ textu je technický datasheet (specifikace produktu)?",
    correctAnswer: "objektivní popis (parametry, měření, fakta)",
    options: [
      "subjektivní popis",
      "pracovní postup",
      "objektivní popis (parametry, měření, fakta)",
      "báseň",
    ],
    hints: ["Specifikace = číselné a technické hodnoty = objektivní."],
  },
  {
    question: "Jak se liší popis osoby od vyprávění o osobě?",
    correctAnswer: "popis = jak vypadá a jaká je; vyprávění = co se stalo (děj)",
    options: [
      "jsou totéž",
      "popis = jak vypadá a jaká je; vyprávění = co se stalo (děj)",
      "vyprávění je kratší",
      "popis neobsahuje jméno",
    ],
    hints: ["Popis = vlastnosti. Vyprávění = události v čase."],
  },
  {
    question: "Jaká přídavná jména jsou typická pro subjektivní popis?",
    correctAnswer: "hodnotící: skvělý, úžasný, nádherný, nepopsatelný",
    options: [
      "technická: metalický, sinusový",
      "hodnotící: skvělý, úžasný, nádherný, nepopsatelný",
      "záporná: špatný, chybný",
      "jen barvy: červený, modrý",
    ],
    hints: ["Hodnotící = vyjadřují autorův dojem."],
  },
  {
    question: "Co jsou charakteristické výrazy pracovního postupu?",
    correctAnswer: "nejprve, poté, pak, nakonec, přidej, smíchej, zahřej",
    options: [
      "jednou, dvakrát",
      "nejprve, poté, pak, nakonec, přidej, smíchej, zahřej",
      "bylo, stalo se",
      "kdybys, pokud",
    ],
    hints: ["Temporální a instrukční výrazy = pracovní postup."],
  },
  {
    question: "Přepiš objektivní větu na subjektivně zabarvenou: 'Moře je modré.'",
    correctAnswer: "Moře se třpytí v barvě safíru a voní po svobodě.",
    options: [
      "Moře má hloubku 3800 m.",
      "Moře se třpytí v barvě safíru a voní po svobodě.",
      "Moře je plocha vody.",
      "Moře je modré. (nezměnit)",
    ],
    hints: ["Přidáme poetické přirovnání a smyslové vnímání."],
  },
  {
    question: "Přepiš subjektivní větu na objektivní: 'Kytice byla překrásná a nesmírně voněla.'",
    correctAnswer: "Kytice obsahovala 12 červených růží.",
    options: [
      "Kytice byla nádherná!",
      "Kytice obsahovala 12 červených růží.",
      "Kytice mi dělala radost.",
      "Kytice voněla jako zahrada.",
    ],
    hints: ["Objektivní = fakta, počty, barvy bez hodnocení."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Přepiš do pracovního postupu: 'Bábovku dáme péct na 180 °C.'",
    correctAnswer: "Vložte bábovku do trouby předehřáté na 180 °C.",
    options: [
      "Bábovka pečou.",
      "Vložte bábovku do trouby předehřáté na 180 °C.",
      "Bábovka je v troubě.",
      "Bylo 180 stupňů.",
    ],
    hints: ["Pracovní postup = rozkazovací způsob pro čtenáře."],
  },
  {
    question: "Jaký je rozdíl mezi popisem statickým a dynamickým?",
    correctAnswer: "statický popisuje věc v klidu (poloha, tvar), dynamický zachycuje pohyb nebo změnu",
    options: [
      "statický je delší",
      "statický popisuje věc v klidu (poloha, tvar), dynamický zachycuje pohyb nebo změnu",
      "dynamický je vždy subjektivní",
      "nejsou žádné rozdíly",
    ],
    hints: ["Statický = momentka. Dynamický = věc se mění nebo hýbe."],
  },
  {
    question: "Ve které části literárního textu se typicky vyskytuje subjektivně zabarvený popis?",
    correctAnswer: "v popisných pasážích postav, prostředí a nálady",
    options: [
      "v dialogu",
      "v popisných pasážích postav, prostředí a nálady",
      "v pracovním postupu",
      "v tabulkách dat",
    ],
    hints: ["Literární popis prostředí = subjektivní → vytváří atmosféru."],
  },
  {
    question: "Co je metafora v subjektivním popisu?",
    correctAnswer: "přenesené pojmenování bez 'jako': 'srdce kamene' místo 'tvrdý jako kámen'",
    options: [
      "přímé srovnání s 'jako'",
      "přenesené pojmenování bez 'jako': 'srdce kamene' místo 'tvrdý jako kámen'",
      "opakování zvuku",
      "záporné hodnocení",
    ],
    hints: ["Metafora = přenesený obraz bez 'jako' (přirovnání používá 'jako')."],
  },
  {
    question: "Co je personifikace v subjektivním popisu?",
    correctAnswer: "přisouzení lidských vlastností neživým věcem (les šeptá, kameny sní)",
    options: [
      "popis osoby z objektivního hlediska",
      "přisouzení lidských vlastností neživým věcem (les šeptá, kameny sní)",
      "přirovnání ke zvířeti",
      "záporná charakteristika",
    ],
    hints: ["Les šeptá = les dostává lidskou vlastnost = personifikace."],
  },
  {
    question: "Jak se liší pracovní postup od návodu k použití?",
    correctAnswer: "jsou si velmi podobné – oboje = kroky v pořadí; postup bývá obecnější, návod konkrétnější",
    options: [
      "jsou to zcela různé žánry",
      "jsou si velmi podobné – oboje = kroky v pořadí; postup bývá obecnější, návod konkrétnější",
      "pracovní postup neobsahuje slovesa",
      "návod je vždy delší",
    ],
    hints: ["Oba typy textu mají podobnou strukturu – instrukce krok za krokem."],
  },
  {
    question: "V jakém osobním vyjádření se píše subjektivní popis?",
    correctAnswer: "z pohledu autora – 1. nebo 3. osoba s hodnotícím pohledem",
    options: [
      "vždy v množném čísle",
      "z pohledu autora – 1. nebo 3. osoba s hodnotícím pohledem",
      "vždy v rozkazovacím způsobu",
      "záleží jen na době",
    ],
    hints: ["Subjektivní = vyjadřuje pohled autora, jeho dojmy a hodnocení."],
  },
  {
    question: "V pracovním postupu se vyhýbáme:",
    correctAnswer: "nejasným nebo vágním formulacím (přidej hodně, ohřej trochu)",
    options: [
      "číslům",
      "slovesům",
      "nejasným nebo vágním formulacím (přidej hodně, ohřej trochu)",
      "časovým výrazům",
    ],
    hints: ["Pracovní postup = přesné instrukce, žádné 'nějak' nebo 'trochu'."],
  },
  {
    question: "Co je synestézie v subjektivním popisu?",
    correctAnswer: "prolínání smyslů v popisu (slyšet barvu, cítit hudbu)",
    options: [
      "záporný popis",
      "prolínání smyslů v popisu (slyšet barvu, cítit hudbu)",
      "přirovnání",
      "popis číselných hodnot",
    ],
    hints: ["'Teplá barva huby' = sluch + zrak + chuť = synestézie."],
  },
  {
    question: "Jak je důležitá přesnost v pracovním postupu?",
    correctAnswer: "velmi důležitá – chyba v kroku může zkazit výsledek nebo způsobit nebezpečí",
    options: [
      "vůbec není důležitá",
      "velmi důležitá – chyba v kroku může zkazit výsledek nebo způsobit nebezpečí",
      "záleží na čtenáři",
      "důležitá jen v kuchyni",
    ],
    hints: ["Špatný krok v postupu = chyba výsledku. Přesnost je klíčová."],
  },
  {
    question: "Přepiš do objektivního popisu: 'Kouzelný les zabalený v tajemném tichu.'",
    correctAnswer: "Les se rozkládá na ploše 5 ha. Dominují v něm buky a duby.",
    options: [
      "Kouzelný les je velký.",
      "Les se rozkládá na ploše 5 ha. Dominují v něm buky a duby.",
      "Kouzelný les stojí tiše.",
      "Les je tajemný a tichý.",
    ],
    hints: ["Objektivní = fakta bez hodnocení (plocha, stromy, měřitelné údaje)."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const POPISSUBJEKTIVNEZABARVENYPOPISPRACOVNIHOPOSTUPU: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-subjektivne-zabarveny-popis-pracovniho-postupu",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-subjektivne-zabarveny-popis-pracovniho-postupu",
    title: "Popis – subjektivně zabarvený, popis pracovního postupu",
    studentTitle: "Druhy popisu",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se rozdíl mezi objektivním a subjektivním popisem.",
    keywords: ["popis", "objektivní", "subjektivní", "pracovní postup", "recept", "návod"],
    goals: [
      "Rozlišit objektivní a subjektivně zabarvený popis",
      "Poznat pracovní postup a jeho znaky",
      "Přepsat text z jednoho stylu do druhého",
    ],
    boundaries: [
      "Bez hluboké stylistiky a rétoriky",
      "Neprobíráme složité literární figury",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Objektivní = jen fakta (barva, tvar, velikost). Subjektivní = pocity, hodnocení, přirovnání. Pracovní postup = kroky v pořadí s rozkazovacím způsobem.",
      steps: [
        "Přečti text a hledej hodnotící slova (skvělý, kouzelný) = subjektivní.",
        "Jsou tam jen fakta a čísla? = objektivní.",
        "Jsou tam kroky v pořadí s rozkazy (přidej, smíchej)? = pracovní postup.",
      ],
      commonMistake: "Žáci si pletou subjektivní hodnocení s objektivními fakty. Hodnotící přídavná jména (krásný, ošklivý) jsou vždy subjektivní.",
      example: "Objektivní: Jablko je kulaté, červené. Subjektivní: Jablko voní jako léto. Postup: Oloupeš jablko, nakrájíš ho...",
    },
  },
];
