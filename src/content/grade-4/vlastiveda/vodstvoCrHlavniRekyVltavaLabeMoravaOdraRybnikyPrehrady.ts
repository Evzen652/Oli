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
    question: "Jak se jmenuje nejdelší česká řeka?",
    correctAnswer: "Vltava (430 km)",
    options: ["Vltava (430 km)", "Labe", "Morava", "Odra"],
    hints: ["Tato řeka teče přes Prahu."],
    solutionSteps: ["Vltava je nejdelší česká řeka s délkou 430 km — teče přes Prahu a ústí do Labe v Mělníku."],
  },
  {
    question: "Kde Vltava ústí do Labe?",
    correctAnswer: "V Mělníku",
    options: ["V Mělníku", "V Praze", "V Ústí nad Labem", "V Nymburce"],
    hints: ["Ústí Vltavy do Labe je severně od Prahy."],
    solutionSteps: ["Vltava se vlévá do Labe u Mělníku."],
  },
  {
    question: "Do kterého moře odtéká Labe?",
    correctAnswer: "Do Severního moře",
    options: ["Do Severního moře", "Do Černého moře", "Do Baltského moře", "Do Středozemního moře"],
    hints: ["Labe teče přes Německo na severozápad."],
    solutionSteps: ["Labe odtéká přes Německo do Severního moře."],
  },
  {
    question: "Kde pramení Labe?",
    correctAnswer: "V Krkonoších",
    options: ["V Krkonoších", "Na Šumavě", "V Jeseníkách", "V Beskydech"],
    hints: ["Labe pramení v nejvyšším pohoří ČR."],
    solutionSteps: ["Labe pramení v Krkonoších (Labský důl) a teče přes Čechy do Německa."],
  },
  {
    question: "Do kterého moře odtéká řeka Morava (přes Dunaj)?",
    correctAnswer: "Do Černého moře",
    options: ["Do Černého moře", "Do Severního moře", "Do Baltského moře", "Do Jaderského moře"],
    hints: ["Dunaj teče na jihovýchod přes Rumunsko."],
    solutionSteps: ["Morava ústí do Dunaje, který odtéká do Černého moře."],
  },
  {
    question: "Jak se jmenuje největší rybník v ČR?",
    correctAnswer: "Rožmberk",
    options: ["Rožmberk", "Máchovo jezero", "Lipno", "Bezdrev"],
    hints: ["Tento rybník leží v Třeboňsku v jižních Čechách."],
    solutionSteps: ["Rožmberk je největší rybník ČR — leží v Třeboňsku v Jihočeském kraji."],
  },
  {
    question: "Kde leží slavná rybniční oblast Třeboňsko?",
    correctAnswer: "V jižních Čechách (Jihočeský kraj)",
    options: [
      "V jižních Čechách (Jihočeský kraj)",
      "Na jihu Moravy",
      "V severních Čechách",
      "Ve středních Čechách",
    ],
    hints: ["Třeboňsko je oblastí rybníků a kaprů."],
    solutionSteps: ["Třeboňsko leží v jižních Čechách — Jihočeský kraj. Je centrem rybníkářství v ČR."],
  },
  {
    question: "Jak se jmenuje největší vodní plocha ČR?",
    correctAnswer: "Přehrada Lipno",
    options: ["Přehrada Lipno", "Rožmberk", "Máchovo jezero", "Přehrada Orlík"],
    hints: ["Lipno je přehradní nádrž na Vltavě v jižních Čechách."],
    solutionSteps: ["Přehrada Lipno na Vltavě v jižních Čechách je největší vodní plochou ČR."],
  },
  {
    question: "Co je to Máchovo jezero?",
    correctAnswer: "Největší přírodní jezero v Čechách u Máchova jezera",
    options: [
      "Největší přírodní jezero v Čechách u Máchova jezera",
      "Rybník v jižních Čechách",
      "Přehradní nádrž na Labi",
      "Jezero v Krkonoších",
    ],
    hints: ["Máchovo jezero je oblíbené koupaliště v severních Čechách."],
    solutionSteps: ["Máchovo jezero je přirozené jezero u Doks v severních Čechách — oblíbené letní koupaliště."],
  },
  {
    question: "Jaký je hlavní účel přehrad v ČR?",
    correctAnswer: "Zásobování vodou, výroba elektřiny, protipovodňová ochrana",
    options: [
      "Zásobování vodou, výroba elektřiny, protipovodňová ochrana",
      "Pouze rekreace a koupání",
      "Chov ryb",
      "Doprava lodí",
    ],
    hints: ["Přehrady slouží hned několika účelům najednou."],
    solutionSteps: ["Přehrady v ČR slouží: zásobení vodou, výrobě elektřiny ve vodních elektrárnách a ochraně před povodněmi."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak dlouhá je Vltava?",
    correctAnswer: "430 km",
    options: ["430 km", "280 km", "600 km", "170 km"],
    hints: ["Vltava je delší než Labe na území ČR."],
    solutionSteps: ["Vltava má délku 430 km — je nejdelší řekou na území ČR."],
  },
  {
    question: "Kde pramení Vltava?",
    correctAnswer: "Na Šumavě (Černé jezero nebo Šumavská rašeliniště)",
    options: [
      "Na Šumavě (Černé jezero nebo Šumavská rašeliniště)",
      "V Krkonoších",
      "V Jeseníkách",
      "V Beskydech",
    ],
    hints: ["Vltava pramení v nejvyšší části jihozápadních Čech."],
    solutionSteps: ["Vltava pramení na Šumavě a teče na sever přes Český Krumlov, České Budějovice a Prahu."],
  },
  {
    question: "Přehrada Lipno leží na které řece?",
    correctAnswer: "Na Vltavě",
    options: ["Na Vltavě", "Na Labi", "Na Moravě", "Na Odře"],
    hints: ["Lipno leží v jižních Čechách a Vltava pramení na Šumavě."],
    solutionSteps: ["Přehrada Lipno leží na horním toku Vltavy v jižních Čechách."],
  },
  {
    question: "Přehrada Orlík leží na které řece?",
    correctAnswer: "Na Vltavě",
    options: ["Na Vltavě", "Na Labi", "Na Moravě", "Na Sázavě"],
    hints: ["Orlík je velká přehrada na Vltavě — největší vodní elektrárna v ČR."],
    solutionSteps: ["Orlík leží na Vltavě ve středních Čechách — je to největší vodní elektrárna ČR."],
  },
  {
    question: "Jaká je funkce rybníků Třeboňska?",
    correctAnswer: "Chov kaprů, ochrana přírody, zásobování vodou, rekreace",
    options: [
      "Chov kaprů, ochrana přírody, zásobování vodou, rekreace",
      "Jen výroba elektřiny",
      "Jen rekreace",
      "Zásobování Prahy pitnou vodou",
    ],
    hints: ["Třeboňské rybníky jsou slavné svými kapry na Vánoce."],
    solutionSteps: ["Třeboňské rybníky slouží chovu kaprů (vánoční kapri!), ochraně přírody, zásobování vodou a rekreaci."],
  },
  {
    question: "Do kterého moře odtéká Odra?",
    correctAnswer: "Do Baltského moře",
    options: ["Do Baltského moře", "Do Severního moře", "Do Černého moře", "Do Jaderského moře"],
    hints: ["Odra teče na sever přes Polsko."],
    solutionSteps: ["Odra odtéká přes Polsko do Baltského moře."],
  },
  {
    question: "Kde v ČR pramení Odra?",
    correctAnswer: "V Jeseníkách (Oderské vrchy) na Moravě",
    options: [
      "V Jeseníkách (Oderské vrchy) na Moravě",
      "V Krkonoších",
      "Na Šumavě",
      "V Beskydech",
    ],
    hints: ["Odra pramení v severní Moravě."],
    solutionSteps: ["Odra pramení v Oderských vrších v Moravskoslezském kraji a odtéká do Polska."],
  },
  {
    question: "Jaký je rozdíl mezi rybníkem a přehradou?",
    correctAnswer: "Rybník je přirozené nebo historické dílo pro chov ryb; přehrada je moderní přehrazení řeky",
    options: [
      "Rybník je přirozené nebo historické dílo pro chov ryb; přehrada je moderní přehrazení řeky",
      "Rybník je větší než přehrada",
      "Přehrada slouží jen pro rekreaci, rybník pro výrobu elektřiny",
      "Jsou to synonyma",
    ],
    hints: ["Rybníky stavěli v Čechách už ve středověku."],
    solutionSteps: ["Rybníky jsou starší — budovaly je ve středověku pro chov ryb. Přehrady jsou moderní — přehrazení řeky s elektrárnami."],
  },
  {
    question: "Proč jsou přihrady důležité pro zásobování pitnou vodou?",
    correctAnswer: "Zadržují dešťovou vodu, která se pak upravuje na pitnou",
    options: [
      "Zadržují dešťovou vodu, která se pak upravuje na pitnou",
      "Přehrady samy vyrábí pitnou vodu",
      "Voda v přehradách je okamžitě pitná",
      "Přehrady pouze slouží lodní dopravě",
    ],
    hints: ["Bez přehrad by v suchém létě nebyla pitná voda."],
    solutionSteps: ["Přehrady zadržují vodu, která je pak v úpravnách čistěna na pitnou vodu pro domácnosti a průmysl."],
  },
  {
    question: "Jak se jmenuje hlavní přítok Vltavy zleva?",
    correctAnswer: "Berounka",
    options: ["Berounka", "Sázava", "Otava", "Nežárka"],
    hints: ["Berounka ústí do Vltavy jihozápadně od Prahy."],
    solutionSteps: ["Berounka je hlavní levostranný přítok Vltavy — ústí u Černošic jihozápadně od Prahy."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Proč je Vltava delší než Labe, přestože Labe odtéká dál?",
    correctAnswer: "Vltava je delší na území ČR; Labe sice odtéká dál, ale česká část je kratší",
    options: [
      "Vltava je delší na území ČR; Labe sice odtéká dál, ale česká část je kratší",
      "Labe pramení výše v horách",
      "Vltava protéká více městy",
      "Vltava má více přítoků",
    ],
    hints: ["Délka řeky = délka celého toku, ne jen v ČR."],
    solutionSteps: ["Vltava (430 km) je delší než celková délka Labe na území ČR — Labe teče dál, ale má v ČR kratší úsek."],
  },
  {
    question: "Jak přispívají řeky k hospodářství ČR?",
    correctAnswer: "Pitná voda, závlahy, vodní elektrárny, rekreace, historicky i doprava",
    options: [
      "Pitná voda, závlahy, vodní elektrárny, rekreace, historicky i doprava",
      "Jen rekreace a turistika",
      "Jen pitná voda",
      "Řeky nemají hospodářský přínos",
    ],
    hints: ["Řeky byly vždy klíčové pro osídlení a hospodářství."],
    solutionSteps: ["Řeky zásobují pitnou vodou, zavlažují pole, vyrábějí elektřinu, přitahují turisty a historicky sloužily jako dopravní cesty."],
  },
  {
    question: "Jak rybníky na Třeboňsku ovlivňují místní klima?",
    correctAnswer: "Zvyšují vlhkost vzduchu, zmírňují vedra a zabraňují rychlému odtoku vody",
    options: [
      "Zvyšují vlhkost vzduchu, zmírňují vedra a zabraňují rychlému odtoku vody",
      "Rybníky mají negativní vliv na klima",
      "Rybníky způsobují záplavy",
      "Vliv na klima je minimální",
    ],
    hints: ["Velké vodní plochy ovlivňují teplotu a vlhkost okolí."],
    solutionSteps: ["Rybníky zvyšují vlhkost vzduchu, ochlazují okolí v létě a zadržují vodu — přirozená protipovodňová ochrana."],
  },
  {
    question: "Proč ČR nemůže mít lodní dopravu jako přímořské státy?",
    correctAnswer: "Je vnitrozemský stát a řeky jsou příliš mělké pro velké lodě",
    options: [
      "Je vnitrozemský stát a řeky jsou příliš mělké pro velké lodě",
      "ČR nemá žádné řeky",
      "ČR má zákon zakazující lodní dopravu",
      "Řeky tečou špatným směrem",
    ],
    hints: ["Velké nákladní lodě potřebují hluboké a rovné vodní toky."],
    solutionSteps: ["ČR nemá moře a řeky jsou relativně mělké a klikaté — velké lodě nemohou plout. Labe je splavné pouze do Ústí nad Labem."],
  },
  {
    question: "Proč jsou přehrady důležité pro energetiku ČR?",
    correctAnswer: "Vodní elektrárny vyrábějí čistou obnovitelnou elektřinu bez emisí",
    options: [
      "Vodní elektrárny vyrábějí čistou obnovitelnou elektřinu bez emisí",
      "Přehrady vyrábějí tepelnou energii",
      "Přehrady uchovávají zásoby uhlí",
      "Přehrady jsou jen pro rekreaci",
    ],
    hints: ["Obnovitelná energie nevydává CO2."],
    solutionSteps: ["Vodní elektrárny (Orlík, Lipno) vyrábějí elektřinu z obnovitelné energie bez znečištění."],
  },
  {
    question: "Jakým způsobem pomáhá rybníkářství na Třeboňsku tamním ekosystémům?",
    correctAnswer: "Rybníky jsou biotopy pro vzácné druhy ptáků, ryb a obojživelníků",
    options: [
      "Rybníky jsou biotopy pro vzácné druhy ptáků, ryb a obojživelníků",
      "Rybníky ničí přirozené ekosystémy",
      "Rybníky slouží jen pro chov kaprů bez přínosu pro přírodu",
      "Ekosystémy jsou bez rybníků zdravější",
    ],
    hints: ["Třeboňsko je biosférická rezervace UNESCO — proč?"],
    solutionSteps: ["Třeboňské rybníky jsou biosférická rezervace UNESCO — jsou domovem vzácných druhů ptáků (čáp, volavka), ryb a rostlin."],
  },
  {
    question: "Co se stane, když v suchém roce klesne hladina v přehradách?",
    correctAnswer: "Hrozí nedostatek pitné vody a omezení výroby elektřiny",
    options: [
      "Hrozí nedostatek pitné vody a omezení výroby elektřiny",
      "Nic — přehrady mají zásobník na 100 let",
      "Zvýší se počet ryb v řekách",
      "Přehrady se automaticky doplní z řek",
    ],
    hints: ["Přehrady závisí na srážkách a přílivu z řek."],
    solutionSteps: ["Při suchu klesá hladina přehrad → méně pitné vody pro města a průmysl, méně elektřiny z vodních elektráren."],
  },
  {
    question: "Proč Vltava protéká srdcem Prahy a je pro ni tak důležitá?",
    correctAnswer: "Vltava zásobovala Prahu vodou, umožňovala dopravu a mlynářství, teče středem historického města",
    options: [
      "Vltava zásobovala Prahu vodou, umožňovala dopravu a mlynářství, teče středem historického města",
      "Praha byla postavena na Vltavě jen kvůli obraně",
      "Vltava nesouvisí s historií Prahy",
      "Vltava je turistická atrakce, jinak bezvýznamná",
    ],
    hints: ["Města vznikala u řek — proč?"],
    solutionSteps: ["Praha vyrostla u Vltavy — řeka zásobovala vodou, sloužila k obchodu a dopravě. Karlův most ji překlenuje od 14. století."],
  },
  {
    question: "Jak se jmenuje přehrada, která je největší vodní elektrárnou ČR?",
    correctAnswer: "Orlík",
    options: ["Orlík", "Lipno", "Nechranice", "Vírská přehrada"],
    hints: ["Orlík leží na Vltavě ve středních Čechách."],
    solutionSteps: ["Přehrada Orlík na Vltavě je největší vodní elektrárnou ČR s výkonem 360 MW."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const count = level === 3 ? Math.min(pool.length, 40) : Math.min(pool.length, 30);
  return shuffle(pool).slice(0, count);
}

export const VODSTVOCRHLAVNIREKYVLTAVALABEMORAVAODRARYBNIKYPREHRADY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-vodstvo-cr-hlavni-reky-vltava-labe-morava-odra-rybniky-prehr",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-vodstvo-cr-hlavni-reky-vltava-labe-morava-odra-rybniky-prehr",
    title: "Vodstvo ČR - hlavní řeky (Vltava, Labe, Morava, Odra), rybníky, přehrady",
    studentTitle: "Řeky a voda ČR",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš hlavní řeky ČR, největší rybníky a přehrady.",
    keywords: ["Vltava", "Labe", "Morava", "Odra", "Rožmberk", "Lipno", "Třeboňsko", "přehrada", "rybník"],
    goals: [
      "Vyjmenovat hlavní řeky ČR a jejich směr odtoku",
      "Určit, do kterých moří ČR vody odtékají",
      "Znát největší rybníky a přehrady ČR",
      "Vysvětlit roli vodstva v hospodářství",
    ],
    boundaries: ["Hydrologické výpočty nejsou cílem", "Podrobné přítoky nejsou vyžadovány"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Nejdelší řeka ČR = Vltava (430 km, Praha, ústí do Labe u Mělníku). Největší rybník = Rožmberk (Třeboňsko).",
      steps: [
        "Vltava: pramení Šumava → Praha → Mělník → Labe → Severní moře",
        "Morava: odtéká do Dunaje → Černé moře",
        "Odra: odtéká do Polska → Baltské moře",
      ],
      commonMistake: "Žáci si pletou Lipno (největší vodní plocha) s Rožmberkem (největší rybník) — Lipno je přehrada!",
      example: "Vltava 430 km → nejdelší česká řeka; Rožmberk → největší rybník; Lipno → největší vodní plocha (přehrada)",
    },
  },
];
