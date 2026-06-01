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
    question: "Co je téma literárního díla?",
    correctAnswer: "o čem dílo pojednává – hlavní myšlenka nebo problém",
    options: [
      "název díla",
      "jméno autora",
      "o čem dílo pojednává – hlavní myšlenka nebo problém",
      "počet stran",
    ],
    hints: ["Téma = o čem je příběh. Například: přátelství, odvaha, rodina."],
  },
  {
    question: "Co je motiv v literárním díle?",
    correctAnswer: "opakující se prvek nebo obraz, který prostupuje dílem",
    options: [
      "příběhová postava",
      "opakující se prvek nebo obraz, který prostupuje dílem",
      "název kapitoly",
      "typ rýmu",
    ],
    hints: ["Motiv = vrací se v různých podobách. Voda, les, cesta."],
  },
  {
    question: "Co je postava v literárním díle?",
    correctAnswer: "osoba nebo bytost, která v příběhu jedná a prožívá děj",
    options: [
      "místo děje",
      "osoba nebo bytost, která v příběhu jedná a prožívá děj",
      "téma díla",
      "typ rýmu",
    ],
    hints: ["Postava = herec v příběhu. Hlavní i vedlejší."],
  },
  {
    question: "Co je prostředí v literárním díle?",
    correctAnswer: "místo a čas, kde se děj odehrává",
    options: [
      "téma díla",
      "místo a čas, kde se děj odehrává",
      "typ vypravěče",
      "počet postav",
    ],
    hints: ["Prostředí = kde a kdy. Les, město, pohádková krajina."],
  },
  {
    question: "Co je děj v literárním díle?",
    correctAnswer: "sled událostí, které se odehrávají v příběhu",
    options: [
      "téma díla",
      "prostředí příběhu",
      "sled událostí, které se odehrávají v příběhu",
      "jméno autora",
    ],
    hints: ["Děj = co se stalo. Začátek → zápletka → konec."],
  },
  {
    question: "Co je vypravěč v literárním díle?",
    correctAnswer: "ten, kdo příběh vypráví – může být postavou nebo neosobním hlasem",
    options: [
      "autor díla vždy",
      "ten, kdo příběh vypráví – může být postavou nebo neosobním hlasem",
      "hlavní postava vždy",
      "záleží na žánru",
    ],
    hints: ["Vypravěč = hlas příběhu. Nemusí být totožný s autorem."],
  },
  {
    question: "Co je verš v básni?",
    correctAnswer: "jeden řádek básně",
    options: [
      "celá báseň",
      "jeden řádek básně",
      "skupina řádků",
      "rýmující se slova",
    ],
    hints: ["Verš = jeden řádek. Strofa = skupina veršů."],
  },
  {
    question: "Co je strofa v básni?",
    correctAnswer: "skupina veršů, oddělená od ostatních",
    options: [
      "jeden řádek básně",
      "celá báseň",
      "skupina veršů, oddělená od ostatních",
      "rýmující se slova",
    ],
    hints: ["Strofa = odstavec básně. Skupina 3–4 veršů."],
  },
  {
    question: "Co je rým v básni?",
    correctAnswer: "shoda zvuků na konci veršů",
    options: [
      "délka verše",
      "téma básně",
      "shoda zvuků na konci veršů",
      "počet slabik",
    ],
    hints: ["Rým = shodný zvuk. Pes / les, moře / hoře."],
  },
  {
    question: "Co je rytmus v básni?",
    correctAnswer: "pravidelné střídání přízvučných a nepřízvučných slabik",
    options: [
      "počet veršů",
      "pravidelné střídání přízvučných a nepřízvučných slabik",
      "délka básně",
      "témata básně",
    ],
    hints: ["Rytmus = pravidelný beat básně při čtení nahlas."],
  },
  {
    question: "Co je refren v básni?",
    correctAnswer: "opakující se verš nebo skupina veršů",
    options: [
      "první verš",
      "opakující se verš nebo skupina veršů",
      "poslední verš",
        "záleží na básni",
    ],
    hints: ["Refren = opakující se část. Jako v písni."],
  },
  {
    question: "Přímý vypravěč (er-forma) vypráví v:",
    correctAnswer: "3. osobě – on/ona/oni",
    options: [
      "1. osobě – já",
      "2. osobě – ty",
      "3. osobě – on/ona/oni",
      "záleží na díle",
    ],
    hints: ["Er-forma = er (on/ona). Vypravěč je mimo příběh."],
  },
  {
    question: "Ich-forma vypravěče znamená:",
    correctAnswer: "vypravěč je postava v příběhu a mluví v 1. osobě – já",
    options: [
      "neosobní vypravěč",
      "vypravěč je postava v příběhu a mluví v 1. osobě – já",
      "vypravěč mluví o jiné osobě",
      "záleží na díle",
    ],
    hints: ["Ich-forma = ich (já). Vypravěč = postava v příběhu."],
  },
  {
    question: "Co je hlavní postava?",
    correctAnswer: "postava, kolem které se příběh točí – protagonista",
    options: [
      "každá postava v příběhu",
      "postava, kolem které se příběh točí – protagonista",
      "záporná postava vždy",
      "záleží na délce díla",
    ],
    hints: ["Hlavní postava = protagonista. Tom Sawyer, Sherlock Holmes."],
  },
  {
    question: "Co je antagonista?",
    correctAnswer: "záporná postava nebo překážka stojící proti protagonistovi",
    options: [
      "hlavní postava",
      "záporná postava nebo překážka stojící proti protagonistovi",
      "vedlejší postava",
      "záleží na žánru",
    ],
    hints: ["Antagonista = protivník. Záporák nebo překážka hrdinovi."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je lyrický subjekt?",
    correctAnswer: "hlas, který v básni mluví – nemusí být totožný s autorem",
    options: [
      "vždy autor básně",
      "hlas, který v básni mluví – nemusí být totožný s autorem",
      "hlavní postava příběhu",
      "záleží na básni",
    ],
    hints: ["Lyrický subjekt = 'já' v básni. Autor píše, ale lyrický subjekt mluví."],
  },
  {
    question: "Co je charakteristika postavy?",
    correctAnswer: "popis vlastností, chování a vzhledu postavy",
    options: [
      "jméno a věk postavy",
      "popis vlastností, chování a vzhledu postavy",
      "seznam činů postavy",
      "záleží na žánru",
    ],
    hints: ["Charakteristika = jak je postava. Fyzicky, psychicky, sociálně."],
  },
  {
    question: "Co je přímá charakteristika postavy?",
    correctAnswer: "autor nebo vypravěč přímo popisuje vlastnosti postavy",
    options: [
      "čtenář si vlastnosti odvodí z chování",
      "autor nebo vypravěč přímo popisuje vlastnosti postavy",
      "záleží na délce díla",
      "postava se sama popisuje",
    ],
    hints: ["Přímá = 'Pavel byl statečný a laskavý.'"],
  },
  {
    question: "Co je nepřímá charakteristika postavy?",
    correctAnswer: "čtenář si odvodí vlastnosti z chování, slov nebo reakcí postavy",
    options: [
      "autor přímo říká, jaká postava je",
      "čtenář si odvodí vlastnosti z chování, slov nebo reakcí postavy",
      "záleží na délce díla",
      "postava si sama dává přezdívky",
    ],
    hints: ["Nepřímá = my si odvodíme. Postava jedná odvážně → statečná."],
  },
  {
    question: "Co je kompozice literárního díla?",
    correctAnswer: "způsob, jakým je dílo uspořádáno – struktura, části, pořadí",
    options: [
      "téma díla",
      "způsob, jakým je dílo uspořádáno – struktura, části, pořadí",
      "jazyk díla",
      "záleží na autorovi",
    ],
    hints: ["Kompozice = jak je příběh postaven. Úvod, vývoj, závěr."],
  },
  {
    question: "Co je allegorie?",
    correctAnswer: "příběh nebo obraz, kde postavy mají skrytý symbolický smysl",
    options: [
      "přímé vyjádření",
      "příběh nebo obraz, kde postavy mají skrytý symbolický smysl",
      "typ rýmu",
      "záleží na žánru",
    ],
    hints: ["Alegorie = příběh se dvěma vrstvami smyslu."],
  },
  {
    question: "Co je symbol v literárním textu?",
    correctAnswer: "věc nebo obraz, který reprezentuje něco jiného – hlubší smysl",
    options: [
      "jméno postavy",
      "věc nebo obraz, který reprezentuje něco jiného – hlubší smysl",
      "typ rýmu",
      "záleží na textu",
    ],
    hints: ["Holubice = symbol míru. Srdce = symbol lásky."],
  },
  {
    question: "Co je kontrast v literárním díle?",
    correctAnswer: "protikladné elementy zdůrazňující rozdíl – světlo × tma, dobro × zlo",
    options: [
      "opakující se prvek",
      "protikladné elementy zdůrazňující rozdíl – světlo × tma, dobro × zlo",
      "typ rytmu",
      "záleží na žánru",
    ],
    hints: ["Kontrast = protiklad. Zvýrazňuje rozdíly."],
  },
  {
    question: "Co je přirovnání v literárním textu?",
    correctAnswer: "srovnání pomocí 'jako' – Byl statečný jako lev.",
    options: [
      "přenesené pojmenování bez 'jako'",
      "srovnání pomocí 'jako' – Byl statečný jako lev.",
      "opakování slova",
      "záleží na textu",
    ],
    hints: ["Přirovnání = X jako Y. 'Jako lev' = přirovnání."],
  },
  {
    question: "Co je metafora v literárním textu?",
    correctAnswer: "přenesené pojmenování bez 'jako' – Byl lev boje.",
    options: [
      "srovnání pomocí 'jako'",
      "přenesené pojmenování bez 'jako' – Byl lev boje.",
      "opakování slova",
      "záleží na textu",
    ],
    hints: ["Metafora = X je Y. 'Lev boje' = metafora (bez jako)."],
  },
  {
    question: "Co je personifikace?",
    correctAnswer: "přisouzení lidských vlastností neživým věcem nebo zvířatům",
    options: [
      "popis osoby",
      "přisouzení lidských vlastností neživým věcem nebo zvířatům",
      "přirovnání",
      "záleží na textu",
    ],
    hints: ["Personifikace = Les šeptá. Kameny sní. – neživé věci mluví nebo cítí."],
  },
  {
    question: "Co je hyperbola?",
    correctAnswer: "záměrné přehánění pro silnější účinek",
    options: [
      "zmenšení skutečnosti",
      "záměrné přehánění pro silnější účinek",
      "přirovnání",
      "záleží na textu",
    ],
    hints: ["Hyperbola = přehánění. 'Čekal věčnost.' 'Byl to šokující výbuch.'"],
  },
  {
    question: "Co je eufemismus?",
    correctAnswer: "zjemnění nepříjemné skutečnosti výrazem – zemřel → odešel",
    options: [
      "záměrné přehánění",
      "zjemnění nepříjemné skutečnosti výrazem – zemřel → odešel",
      "opakování slova",
      "záleží na textu",
    ],
    hints: ["Eufemismus = zjemnění. 'Odešel od nás' místo 'zemřel'."],
  },
  {
    question: "Co je anafora v básni?",
    correctAnswer: "opakování stejného slova nebo fráze na začátku veršů",
    options: [
      "rýmující se slova",
      "opakování stejného slova nebo fráze na začátku veršů",
      "záleží na básni",
      "rytmické zesílení",
    ],
    hints: ["Anafora = opakování na začátku. 'Každý ví... Každý cítí... Každý vidí...'"],
  },
  {
    question: "Co je aliterace?",
    correctAnswer: "opakování stejné hlásky na začátku slov – zlatý západ zbarvil zemi",
    options: [
      "rým na konci verše",
      "opakování stejné hlásky na začátku slov – zlatý západ zbarvil zemi",
      "záleží na básni",
      "typ rytmu",
    ],
    hints: ["Aliterace = zvuková hra. 'Šuměly šeptem šedivé šlahouny.'"],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je ironie v literárním textu?",
    correctAnswer: "výrok, jehož pravý smysl je opačný než doslovný",
    options: [
      "přirovnání",
      "výrok, jehož pravý smysl je opačný než doslovný",
      "záleží na kontextu",
      "metafora",
    ],
    hints: ["Ironie = říkám opak. 'To byl ale výkon.' (když bylo špatné)"],
  },
  {
    question: "Co je sarkasmus?",
    correctAnswer: "ostrá, zraňující ironie",
    options: [
      "mírná ironie",
      "ostrá, zraňující ironie",
      "přirovnání",
      "záleží na textu",
    ],
    hints: ["Sarkasmus = ironie s ostrým záměrem. Záměrně zraňuje."],
  },
  {
    question: "Co je epifora?",
    correctAnswer: "opakování stejného slova nebo fráze na konci veršů",
    options: [
      "opakování na začátku",
      "opakování stejného slova nebo fráze na konci veršů",
      "záleží na básni",
      "rým",
    ],
    hints: ["Epifora = opakování na konci. Opak anafory."],
  },
  {
    question: "Co je synestézie v literárním textu?",
    correctAnswer: "prolínání smyslů – popis jednoho smyslu pomocí druhého",
    options: [
      "přirovnání",
      "prolínání smyslů – popis jednoho smyslu pomocí druhého",
      "záleží na textu",
      "metafora",
    ],
    hints: ["'Slyším barvu.' 'Cítím hudbu.' = prolínání smyslů."],
  },
  {
    question: "Co je oxymóron?",
    correctAnswer: "spojení protikladných pojmů – živá smrt, mlčící výkřik",
    options: [
      "přirovnání",
      "spojení protikladných pojmů – živá smrt, mlčící výkřik",
      "záleží na textu",
      "metafora",
    ],
    hints: ["Oxymóron = protikladná slova v jednom spojení."],
  },
  {
    question: "Co je parabola?",
    correctAnswer: "jednoduchý příběh s morálním nebo didaktickým poučením",
    options: [
      "druh geometrické křivky",
      "jednoduchý příběh s morálním nebo didaktickým poučením",
      "záleží na textu",
      "typ rýmu",
    ],
    hints: ["Parabola = podobenství. Biblické příběhy jsou paraboly."],
  },
  {
    question: "Co je leitmotiv?",
    correctAnswer: "opakující se téma nebo motiv prostupující celým dílem",
    options: [
      "typ rýmu",
      "opakující se téma nebo motiv prostupující celým dílem",
      "záleží na žánru",
      "přirovnání",
    ],
    hints: ["Leitmotiv = červená nit díla. Vrací se znovu a znovu."],
  },
  {
    question: "Co je gradace?",
    correctAnswer: "stupňování intenzity výrazu nebo emocí",
    options: [
      "záleží na textu",
      "stupňování intenzity výrazu nebo emocí",
      "opakování slov",
      "záleží na žánru",
    ],
    hints: ["Gradace = stoupá napětí nebo intenzita."],
  },
  {
    question: "Co je katarze?",
    correctAnswer: "emocionální očista nebo uvolnění prožité čtenářem nebo divákem",
    options: [
      "záleží na textu",
      "emocionální očista nebo uvolnění prožité čtenářem nebo divákem",
      "typ rýmu",
      "záleží na žánru",
    ],
    hints: ["Katarze = řecky 'očista'. Po tragédii se divák 'vyplaká'."],
  },
  {
    question: "Co je chronologická kompozice?",
    correctAnswer: "příběh postupuje v přirozeném časovém pořadí od minulosti k přítomnosti",
    options: [
      "příběh začíná uprostřed",
      "příběh postupuje v přirozeném časovém pořadí od minulosti k přítomnosti",
      "záleží na autorovi",
      "příběh začíná závěrem",
    ],
    hints: ["Chronologická = časový sled. Začátek → střed → konec."],
  },
  {
    question: "Co je retrospektivní kompozice?",
    correctAnswer: "příběh začíná v přítomnosti a vrací se zpět do minulosti",
    options: [
      "chronologická kompozice",
      "příběh začíná v přítomnosti a vrací se zpět do minulosti",
      "záleží na žánru",
      "příběh bez chronologie",
    ],
    hints: ["Retrospektiva = zpětný pohled. Začínáme v přítomnosti, vracíme se."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ELEMENTARNILITERARNIPOJMYPRIROZBORUTEXTU: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-prace-s-textem-elementarni-literarni-pojmy-pri-rozboru-textu",
    rvpNodeId: "g5-cjl-literarni-vychova-prace-s-textem-elementarni-literarni-pojmy-pri-rozboru-textu",
    title: "Elementární literární pojmy při rozboru textu",
    studentTitle: "Rozbor textu",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s textem",
    briefDescription: "Naučíš se základní literární pojmy pro rozbor textu.",
    keywords: ["téma", "motiv", "postava", "prostředí", "děj", "vypravěč", "verš", "strofa", "rým"],
    goals: [
      "Používat základní literární pojmy správně",
      "Rozebrat literární text pomocí pojmů (téma, motiv, postava, prostředí)",
      "Popsat formu básně (verš, strofa, rým, rytmus)",
    ],
    boundaries: [
      "Bez pokročilé naratologie a literární teorie",
      "Neprobíráme složité stylistické figury podrobně",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Téma = o čem dílo je. Motiv = opakující se prvek. Postava = kdo jedná. Prostředí = kde a kdy. Děj = co se stalo. Vypravěč = kdo to vypráví.",
      steps: [
        "Přečti text.",
        "Urči téma: o čem to je celkově?",
        "Najdi postavy: kdo jedná?",
        "Popiš prostředí: kde a kdy se to děje?",
        "Sleduj děj: co se stalo?",
        "Zjisti vypravěče: mluvčí = já nebo on/ona?",
      ],
      commonMistake: "Žáci si pletou téma a motiv. Téma = hlavní myšlenka celého díla. Motiv = opakující se prvek (voda, les).",
      example: "Téma: odvaha. Motiv: moře (vrací se). Postava: Jan. Prostředí: přístav, 19. st. Vypravěč: er-forma (on/ona).",
    },
  },
];
