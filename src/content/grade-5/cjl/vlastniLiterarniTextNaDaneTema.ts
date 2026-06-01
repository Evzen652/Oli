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
    question: "Před psaním vlastního textu je nejdůležitější:",
    correctAnswer: "vybrat žánr a téma, vymyslit základní příběh nebo myšlenku",
    options: [
      "napsat nadpis",
      "vybrat žánr a téma, vymyslit základní příběh nebo myšlenku",
      "spočítat slova",
      "záleží na délce",
    ],
    hints: ["Nejdříve plán – co napíšu, jak to bude vypadat."],
  },
  {
    question: "Co je téma vlastního literárního textu?",
    correctAnswer: "hlavní myšlenka nebo problém, o kterém text pojednává",
    options: [
      "název textu",
      "hlavní myšlenka nebo problém, o kterém text pojednává",
      "délka textu",
      "počet postav",
    ],
    hints: ["Téma = o čem píšeš. Přátelství, odvaha, rodina."],
  },
  {
    question: "Jak správně začneme psát povídku?",
    correctAnswer: "zajímavým úvodem představujícím postavy, prostředí a situaci",
    options: [
      "popisem počasí vždy",
      "zajímavým úvodem představujícím postavy, prostředí a situaci",
      "závěrem příběhu",
      "jménem autora",
    ],
    hints: ["Dobrý začátek chytí čtenáře od první věty."],
  },
  {
    question: "Co musí povídka nebo pohádka obsahovat?",
    correctAnswer: "postavy, prostředí, děj – problém a jeho řešení",
    options: [
      "jen popis postav",
      "jen dialogy",
      "postavy, prostředí, děj (problém a jeho řešení)",
      "jen závěr",
    ],
    hints: ["Kdo? kde? co se stalo? jak se to vyřešilo? = základ příběhu."],
  },
  {
    question: "Co je charakteristické pro pohádku?",
    correctAnswer: "fantastické prvky – kouzelník, čarodějnice, mluvící zvířata a morální poučení",
    options: [
      "historické události",
      "fantastické prvky (kouzelník, čarodějnice, mluvící zvířata) a morální poučení",
      "vědecké výzkumy",
      "jen dialogy bez děje",
    ],
    hints: ["Pohádka = kouzelný svět + dobro vítězí nad zlem."],
  },
  {
    question: "Jak správně ukončíme vlastní literární text?",
    correctAnswer: "rozuzlením příběhu a závěrečnou pointou nebo poučením",
    options: [
      "jen napsat 'konec'",
      "rozuzlením příběhu a závěrečnou pointou nebo poučením",
      "ponecháním příběhu nedokončeného",
      "záleží na délce",
    ],
    hints: ["Závěr = vše se vyřeší a čtenář odchází spokojený nebo zamyšlený."],
  },
  {
    question: "Jaký žánr by jsi vybral/a pro příběh o kouzelném lesním skřítku?",
    correctAnswer: "pohádka – fantastické prvky",
    options: [
      "detektivní povídka",
      "pohádka (fantastické prvky)",
      "historický román",
      "věcný popis",
    ],
    hints: ["Kouzelný prvek → pohádka."],
  },
  {
    question: "Co je pointa v literárním textu?",
    correctAnswer: "nečekaný nebo zajímavý závěr, který překvapí čtenáře",
    options: [
      "první věta textu",
      "nečekaný nebo zajímavý závěr, který překvapí čtenáře",
      "popis postav",
      "záleží na žánru",
    ],
    hints: ["Pointa = překvapivý nebo cleverly zakončený závěr."],
  },
  {
    question: "Jaký žánr vybrat pro příběh plný napětí a záhady?",
    correctAnswer: "detektivní povídka nebo thriller",
    options: [
      "lyricka báseň",
      "detektivní povídka nebo thriller",
      "historická pohádka",
      "záleží na délce",
    ],
    hints: ["Napětí a záhada → detektivní žánr."],
  },
  {
    question: "Co je osnova textu a proč ji tvoříme?",
    correctAnswer: "plán textu – pomáhá udržet strukturu a nic nezapomenout",
    options: [
      "jen seznam slov",
      "plán textu – pomáhá udržet strukturu a nic nezapomenout",
      "záleží jen na délce",
      "osnova není potřebná",
    ],
    hints: ["Osnova = mapa textu. Plánuji, než začnu psát."],
  },
  {
    question: "Co je dialog v literárním textu?",
    correctAnswer: "rozhovor mezi postavami v přímé řeči",
    options: [
      "popis prostředí",
      "rozhovor mezi postavami v přímé řeči",
      "popis postavy",
      "záleží na žánru",
    ],
    hints: ["Dialog = postavy spolu mluví. V uvozovkách."],
  },
  {
    question: "Jak přímá řeč text oživuje?",
    correctAnswer: "dává postavám autentický hlas a zrychluje tempo příběhu",
    options: [
      "text zkracuje",
      "dává postavám autentický hlas a zrychluje tempo příběhu",
      "text prodlužuje zbytečně",
      "záleží na žánru",
    ],
    hints: ["Přímá řeč = slyšíme postavu přímo. Text je živější."],
  },
  {
    question: "Co je nezbytné pro dobrou charakteristiku postavy?",
    correctAnswer: "popis vzhledu, chování a vnitřního světa – myšlenky, pocity",
    options: [
      "jen jméno a věk",
      "popis vzhledu, chování a vnitřního světa (myšlenky, pocity)",
      "jen seznam přátel",
      "záleží na žánru",
    ],
    hints: ["Dobrá postava = jak vypadá + jak se chová + co cítí."],
  },
  {
    question: "Jak se liší pohádka od povídky?",
    correctAnswer: "pohádka má kouzelné prvky, povídka popisuje realitu",
    options: [
      "jsou totéž",
      "pohádka má kouzelné prvky, povídka popisuje realitu",
      "povídka je vždy kratší",
      "záleží na délce",
    ],
    hints: ["Pohádka = magie. Povídka = realistický svět."],
  },
  {
    question: "Co je správné pravidlo pro psaní vlastního textu?",
    correctAnswer: "nejprve napsat osnovu, pak psát, pak text opravit",
    options: [
      "psát bez přemýšlení",
      "nejprve napsat osnovu, pak psát, pak text opravit",
      "psát jen jedenkrát",
      "záleží na délce",
    ],
    hints: ["Plánuj → piš → koriguj = postup dobrého autora."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak vybrat správné téma pro vlastní báseň?",
    correctAnswer: "vybrat téma, které mě zajímá nebo dojímá, a pak najít obrazy k jeho vyjádření",
    options: [
      "vybrat co nejdelší téma",
      "vybrat téma, které mě zajímá nebo dojímá, a pak najít obrazy k jeho vyjádření",
      "záleží jen na délce básně",
      "vybrat jen počasí",
    ],
    hints: ["Nejlepší básně vznikají z osobní zkušenosti nebo silné emoce."],
  },
  {
    question: "Co je rýmové schéma ABAB?",
    correctAnswer: "první a třetí verš se rýmují, druhý a čtvrtý se rýmují",
    options: [
      "všechny verše se rýmují stejně",
      "první a třetí verš se rýmují, druhý a čtvrtý se rýmují",
      "záleží na básni",
      "jen první a poslední verš",
    ],
    hints: ["A-B-A-B: las-A, moře-B, pas-A, hoře-B."],
  },
  {
    question: "Co je rýmové schéma AABB?",
    correctAnswer: "verše po dvou: první+druhý se rýmují, třetí+čtvrtý se rýmují",
    options: [
      "první a třetí se rýmují",
      "verše po dvou: první+druhý se rýmují, třetí+čtvrtý se rýmují",
      "záleží na básni",
      "jen krátké rýmy",
    ],
    hints: ["A-A-B-B: les-A, pes-A, moře-B, hoře-B."],
  },
  {
    question: "Jak napsat zajímavé zahájení povídky?",
    correctAnswer: "začni akcí, dialogem nebo zajímavou situací – ne popisem počasí",
    options: [
      "vždy popisem počasí",
      "začni akcí, dialogem nebo zajímavou situací – ne popisem počasí",
      "záleží na žánru",
      "vždy jménem postavy",
    ],
    hints: ["Dobrý začátek = okamžité zaujmutí. 'Najednou se ozval výkřik...'"],
  },
  {
    question: "Jaký typ pohledu zvolit v pohádce pro děti?",
    correctAnswer: "třetí osoba – er-forma nebo první osoba pro dojemnost",
    options: [
      "vždy druhá osoba (ty)",
      "třetí osoba (er-forma) nebo první osoba pro dojemnost",
      "záleží na délce",
      "pouze první osoba",
    ],
    hints: ["Er-forma = 'Byl jednou jeden kluk.' Ich-forma = 'Byl jsem jednou malý.'"],
  },
  {
    question: "Jak správně napsat napínavou scénu?",
    correctAnswer: "stručné věty, rychlé tempo, napětí – bez zbytečných popisů",
    options: [
      "dlouhé popisné věty",
      "stručné věty, rychlé tempo, napětí – bez zbytečných popisů",
      "záleží na tématu",
      "bez dialogů",
    ],
    hints: ["Napětí = krátké věty, rychlé tempo. Čtenář drží dech."],
  },
  {
    question: "Jak správně napsat klidnou, idylickou scénu?",
    correctAnswer: "delší věty, bohatý popis prostředí, smyslové detaily",
    options: [
      "stručné věty bez popisů",
      "delší věty, bohatý popis prostředí, smyslové detaily",
      "záleží na tématu",
      "jen dialogy",
    ],
    hints: ["Klid = rozvité věty, popis přírody a prostředí."],
  },
  {
    question: "Co je hlavní chyba začínajících autorů?",
    correctAnswer: "příliš mnoho popisů a málo děje nebo přímé řeči",
    options: [
      "příliš krátký text",
      "příliš mnoho popisů a málo děje nebo přímé řeči",
      "záleží na žánru",
      "příliš mnoho dialogů",
    ],
    hints: ["Chyba = text je statický. Čtenáři chybí děj a napětí."],
  },
  {
    question: "Jak zapsat vnitřní myšlenky postavy?",
    correctAnswer: "kurzívou nebo bez uvozovek: Petra si pomyslela: 'To není fér.'",
    options: [
      "v uvozovkách jako přímá řeč",
      "kurzívou nebo bez uvozovek: Petra si pomyslela: 'To není fér.'",
      "záleží na žánru",
      "nikdy se nezapisují",
    ],
    hints: ["Vnitřní monolog = myšlenky postavy. Odlišíme je od dialogu."],
  },
  {
    question: "Jak vytvořit napínavou zápleku (konflikt) v povídce?",
    correctAnswer: "dáme postavě cíl a přidáme překážky, které mu brání ho dosáhnout",
    options: [
      "popisujeme jen prostředí",
      "dáme postavě cíl a přidáme překážky, které mu brání ho dosáhnout",
      "záleží na délce textu",
      "jen dialogy bez problému",
    ],
    hints: ["Cíl + překážka = konflikt = napětí = dobrý příběh."],
  },
  {
    question: "Co je pointa pohádky nebo bajky?",
    correctAnswer: "morální poučení, které plyne z příběhu",
    options: [
      "závěrečná věta",
      "morální poučení, které plyne z příběhu",
      "záleží na délce",
      "seznam postav",
    ],
    hints: ["Pointa bajky = co se naučíme. Líný = nedostane odměnu."],
  },
  {
    question: "Jak se liší hrdina a záporák v literárním textu?",
    correctAnswer: "hrdina usiluje o dobro, záporák brání nebo ničí",
    options: [
      "jsou totéž",
      "hrdina usiluje o dobro, záporák brání nebo ničí",
      "záleží na délce textu",
      "záporák vždy zemře",
    ],
    hints: ["Hrdina = protagonist. Záporák = antagonist. Konflikt mezi nimi."],
  },
  {
    question: "Jak zlepšit text po prvním napsání?",
    correctAnswer: "přečíst nahlas, opravit chyby, doplnit detaily, zkrátit zbytečné části",
    options: [
      "přijmout ho jako hotový",
      "přečíst nahlas, opravit chyby, doplnit detaily, zkrátit zbytečné části",
      "záleží na délce",
      "jen opravit pravopis",
    ],
    hints: ["Revize = přečtení, opravy, zdokonalení. Každý dobrý autor opravuje."],
  },
  {
    question: "Co jsou klišé v literárním textu?",
    correctAnswer: "příliš používané fráze bez originality – bylo jednou jedno dítě, které bylo hodné",
    options: [
      "odborné termíny",
      "příliš používané fráze bez originality (bylo jednou jedno dítě, které bylo hodné)",
      "záleží na žánru",
      "krásné věty",
    ],
    hints: ["Klišé = fráze, která je tak obvyklá, že přestala být zajímavá."],
  },
  {
    question: "Jak napsat originální text bez klišé?",
    correctAnswer: "hledat nové obrazy, neočekávané přirovnání, svůj vlastní pohled na věc",
    options: [
      "kopírovat slavné autory",
      "hledat nové obrazy, neočekávané přirovnání, svůj vlastní pohled na věc",
      "záleží na délce",
      "vždy psát pohádky",
    ],
    hints: ["Originalita = svůj pohled, vlastní obrazy. Nepsat to, co všichni."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je kompoziční oblouk příběhu?",
    correctAnswer: "dramatická křivka: expozice → napětí roste → vrchol → rozuzlení",
    options: [
      "len chronologický seznam událostí",
      "dramatická křivka: expozice → napětí roste → vrchol → rozuzlení",
      "záleží na žánru",
      "záleží na délce",
    ],
    hints: ["Oblouk = příběh stoupá k vrcholu, pak klesá. Jako hora."],
  },
  {
    question: "Co je unreliable narrator (nespolehlivý vypravěč)?",
    correctAnswer: "vypravěč, jehož pohled na události je zkreslený nebo nepravdivý",
    options: [
      "vypravěč vždy třetí osoby",
      "vypravěč, jehož pohled na události je zkreslený nebo nepravdivý",
      "záleží na žánru",
      "vypravěč bez jméno",
    ],
    hints: ["Nespolehlivý = čtenář mu nemůže plně věřit."],
  },
  {
    question: "Co je stream of consciousness?",
    correctAnswer: "technika psaní zachycující nepřerušený tok myšlenek postavy",
    options: [
      "popis prostředí",
      "technika psaní zachycující nepřerušený tok myšlenek postavy",
      "záleží na žánru",
      "typ dialogu",
    ],
    hints: ["Proud vědomí = myšlenky bez přerušení. Joyce, Woolf."],
  },
  {
    question: "Co je epistolární román?",
    correctAnswer: "román psaný formou dopisů nebo deníkových zápisů",
    options: [
      "historický román",
      "román psaný formou dopisů nebo deníkových zápisů",
      "záleží na délce",
      "vědeckofantastický roman",
    ],
    hints: ["Epistolární = dopisy. Příběh vyprávěný skrze korespondenci."],
  },
  {
    question: "Jak se liší vnitřní a vnější konflikt v příběhu?",
    correctAnswer: "vnitřní = postava bojuje sama se sebou; vnější = s jinou osobou nebo silou",
    options: [
      "jsou totéž",
      "vnitřní = postava bojuje sama se sebou; vnější = s jinou osobou nebo silou",
      "záleží na žánru",
      "vnitřní je vždy kratší",
    ],
    hints: ["Vnitřní = dilemata, pochybnosti. Vnější = draci, záporaci."],
  },
  {
    question: "Co je show, don't tell jako literární princip?",
    correctAnswer: "místo přímého sdělení ukazuj čtenáři skrze akce a detaily",
    options: [
      "říkej přímo, co postava cítí",
      "místo přímého sdělení ukazuj čtenáři skrze akce a detaily",
      "záleží na žánru",
      "vždy popis postav",
    ],
    hints: ["'Byl smutný.' vs. 'Slzy mu stékaly po tvářích.' – ukazuj, neříkej."],
  },
  {
    question: "Co je cliffhanger?",
    correctAnswer: "napínavé přerušení příběhu v kritickém okamžiku, nutí číst dál",
    options: [
      "klidný závěr",
      "napínavé přerušení příběhu v kritickém okamžiku, nutí číst dál",
      "záleží na žánru",
      "popis prostředí",
    ],
    hints: ["Cliffhanger = konec kapitoly v napínavém momentu. Co bude dál?"],
  },
  {
    question: "Co je subtext v literárním textu?",
    correctAnswer: "skrytý smysl nebo záměr, který není přímo vyjádřen",
    options: [
      "přímé vyjádření",
      "skrytý smysl nebo záměr, který není přímo vyjádřen",
      "záleží na žánru",
      "vedlejší příběh",
    ],
    hints: ["Subtext = mezi řádky. Co postava říká vs. co myslí."],
  },
  {
    question: "Jak správně nakreslit psychologicky složitou postavu?",
    correctAnswer: "dát jí silné stránky i slabiny, aby byla věrohodná a zajímavá",
    options: [
      "postava je jen dobrá nebo jen špatná",
      "dát jí silné stránky i slabiny, aby byla věrohodná a zajímavá",
      "záleží na žánru",
      "popis jen vzhledu",
    ],
    hints: ["Složitá postava = má dobré i špatné vlastnosti = věrohodná."],
  },
  {
    question: "Co je world-building?",
    correctAnswer: "vytváření detailního, konzistentního světa pro příběh – v fantasy, sci-fi",
    options: [
      "popis reálného světa",
      "vytváření detailního, konzistentního světa pro příběh (v fantasy, sci-fi)",
      "záleží na žánru",
      "jen popis prostředí",
    ],
    hints: ["World-building = vymyslet celý svět se svými pravidly."],
  },
  {
    question: "Co je arc postavy (character arc)?",
    correctAnswer: "proměna postavy v průběhu příběhu – jak se vyvíjí a mění",
    options: [
      "seznam vlastností postavy",
      "proměna postavy v průběhu příběhu – jak se vyvíjí a mění",
      "záleží na žánru",
      "jen fyzický popis",
    ],
    hints: ["Arc = cesta vývoje. Zbabělý hrdina se stane odvážným."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const VLASTNILITERARNITEXTNADANETEMA: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-text-na-dane-tema",
    rvpNodeId: "g5-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-text-na-dane-tema",
    title: "Vlastní literární text na dané téma",
    studentTitle: "Vlastní text",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s textem",
    briefDescription: "Vytvoříš vlastní literární text a pochopíš, jak na to.",
    keywords: ["vlastní text", "tvorba", "pohádka", "povídka", "báseň", "žánr", "téma"],
    goals: [
      "Vybrat vhodný žánr a téma pro vlastní text",
      "Sestavit osnovu a napsat vlastní literární text",
      "Opravit a zdokonalit napsaný text",
    ],
    boundaries: [
      "Bez hodnocení vlastní tvůrčí práce AI",
      "Neprobíráme pokročilé techniky tvůrčího psaní",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Postup tvorby textu: 1. Vyber žánr (pohádka, povídka, báseň). 2. Urči téma. 3. Sestav osnovu. 4. Piš. 5. Oprav a zlepši.",
      steps: [
        "Vyber žánr: pohádka, povídka nebo báseň.",
        "Urči téma: o čem to bude.",
        "Vymysli postavy, prostředí a děj.",
        "Sestav osnovu (plán).",
        "Piš a použij přímou řeč pro oživení.",
        "Přečti nahlas a oprav.",
      ],
      commonMistake: "Žáci začnou psát bez plánu a příběh se rozpadne nebo nemá závěr. Osnova pomáhá.",
      example: "Téma: ztracený pes. Žánr: povídka. Osnova: Pavel najde psa → hledají majitele → šťastné setkání.",
    },
  },
];
