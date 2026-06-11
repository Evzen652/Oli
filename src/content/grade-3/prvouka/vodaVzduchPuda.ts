import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    question: "Co se děje s vodou z moří a řek, když ji zahřeje slunce?",
    correctAnswer: "Vypaří se a stoupá jako pára do vzduchu",
    options: [
      "Vypaří se a stoupá jako pára do vzduchu",
      "Zmrzne a zůstane na místě",
      "Proteče pod zemí do studní",
      "Promění se v půdu",
    ],
    hints: [
      "Vzpomeň si, co se děje s vodou v hrnci na sporáku.",
      "Pára stoupá nahoru — co se z ní pak stane?",
    ],
    explanation: "Slunce zahřívá vodu a ta se mění na neviditelnou páru, která stoupá do vzduchu. Říkáme tomu výpar — první krok koloběhu vody.",
  },
  {
    question: "Co vznikne z vodní páry vysoko v atmosféře?",
    correctAnswer: "Oblaka",
    options: ["Oblaka", "Déšť rovnou", "Sníh rovnou", "Mlha pod zemí"],
    hints: [
      "Pára se ochlazuje a mění skupenství.",
      "Podívej se na oblohu — co tam vidíš bílé?",
    ],
    explanation: "Vodní pára stoupá nahoru, kde je chladněji. Tam se ochladí a změní se na drobné kapičky, které tvoří oblaka.",
  },
  {
    question: "Jak se voda dostane zpět z oblaků na zem?",
    correctAnswer: "Jako srážky — déšť nebo sníh",
    options: [
      "Jako srážky — déšť nebo sníh",
      "Vypaří se znovu ještě výš",
      "Přemění se na vzduch",
      "Zmizí ve vesmíru",
    ],
    hints: [
      "Co padá z oblaků dolů?",
      "V létě jsou to kapky, v zimě vločky.",
    ],
    explanation: "Kapičky v oblacích se spojují a padají jako déšť, sníh nebo kroupy. Říkáme tomu srážky — voda se vrací na zem.",
  },
  {
    question: "Která tři skupenství vody známe?",
    correctAnswer: "Kapalná (voda), pevná (led) a plynná (pára)",
    options: [
      "Kapalná (voda), pevná (led) a plynná (pára)",
      "Teplá, studená a vlažná",
      "Mořská, říční a dešťová",
      "Pitná, užitková a odpadní",
    ],
    hints: [
      "Vzpomeň si na led v mrazáku a páru nad hrncem.",
      "Skupenství = jak látka vypadá: pevná, kapalná nebo plynná.",
    ],
    explanation: "Voda existuje ve třech skupenstvích: jako kapalina (voda v řece), jako pevná látka (led) a jako plyn (vodní pára).",
  },
  {
    question: "Co je pitná voda?",
    correctAnswer: "Voda čistá, kterou můžeme bezpečně pít",
    options: [
      "Voda čistá, kterou můžeme bezpečně pít",
      "Voda z moře, která je slaná",
      "Voda, která teče jen z kohoutku",
      "Jakákoli voda v přírodě",
    ],
    hints: [
      "Pitná voda musí být bez škodlivých látek.",
      "Mořskou vodu pít nemůžeme — proč?",
    ],
    explanation: "Pitná voda je čistá a bezpečná pro pití. Voda z moře je slaná a k pití se nehodí. Užitková voda slouží ke splachování nebo mytí auta.",
  },
  {
    question: "Jak můžeš doma šetřit vodou?",
    correctAnswer: "Zavírat kohoutek při čištění zubů",
    options: [
      "Zavírat kohoutek při čištění zubů",
      "Sprchovat se co nejdéle",
      "Zalévat zahradu vždy v poledne na slunci",
      "Nechat tekoucí vodu celý den",
    ],
    hints: [
      "Zamysli se, kdy teče voda zbytečně.",
      "Čistíš zuby 2 minuty — kohoutek může být zavřený.",
    ],
    explanation: "Při čištění zubů stačí zavřít kohoutek — ušetříme tak mnoho litrů vody. Voda je vzácná a je důležité s ní šetřit.",
  },
  {
    question: "Proč potřebujeme kyslík ze vzduchu?",
    correctAnswer: "Bez kyslíku nemůžeme dýchat a žít",
    options: [
      "Bez kyslíku nemůžeme dýchat a žít",
      "Kyslík nám zahřívá tělo",
      "Kyslík nám dává energii jako jídlo",
      "Bez kyslíku bychom jen hůře viděli",
    ],
    hints: [
      "Co se stane, když se nadýcháme?",
      "Každá buňka v těle potřebuje kyslík.",
    ],
    explanation: "Kyslík je plyn obsažený ve vzduchu. Při dýchání ho přijímáme do plic a krev ho rozvádí po celém těle. Bez kyslíku bychom zemřeli během několika minut.",
  },
  {
    question: "Která složka vzduchu tvoří jeho největší část?",
    correctAnswer: "Dusík",
    options: ["Dusík", "Kyslík", "Oxid uhličitý", "Vodní pára"],
    hints: [
      "Kyslík tvoří jen asi pětinu vzduchu.",
      "Dusík je neviditelný plyn, který nereaguje s naším tělem.",
    ],
    explanation: "Vzduch tvoří asi ze čtyř pětin dusík a z jedné pětiny kyslík. Zbytek jsou jiné plyny, například oxid uhličitý.",
  },
  {
    question: "K čemu rostliny využívají oxid uhličitý ze vzduchu?",
    correctAnswer: "K fotosyntéze — výrobě živin ze slunečního světla",
    options: [
      "K fotosyntéze — výrobě živin ze slunečního světla",
      "K dýchání stejně jako lidé",
      "K ochlazování listů",
      "K přitahování vody z půdy",
    ],
    hints: [
      "Rostliny dělají opak lidí — berou CO₂ a vydávají kyslík.",
      "Fotosyntéza = výroba potravy pomocí světla.",
    ],
    explanation: "Rostliny přijímají oxid uhličitý a pomocí slunečního světla z něj vyrábějí živiny. Tento proces se nazývá fotosyntéza. Při něm vzniká kyslík, který vydávají do vzduchu.",
  },
  {
    question: "Co nejvíce znečišťuje vzduch ve městech?",
    correctAnswer: "Výfukové plyny z aut a kouř z továren",
    options: [
      "Výfukové plyny z aut a kouř z továren",
      "Zpívání ptáků a šelest stromů",
      "Déšť a mlha",
      "Dýchání lidí a zvířat",
    ],
    hints: [
      "Zamysli se, co vidíš nad rušnou silnicí.",
      "Továrny a auta spalují palivo — co z toho vzniká?",
    ],
    explanation: "Auta a továrny spalují palivo a vypouštějí škodlivé plyny do vzduchu. Znečištěný vzduch škodí zdraví lidí, zvířat i rostlin.",
  },
  {
    question: "Jak vzniká půda?",
    correctAnswer: "Rozkladem hornin a odumřelých rostlin a živočichů",
    options: [
      "Rozkladem hornin a odumřelých rostlin a živočichů",
      "Vysycháním mořské vody",
      "Smícháním písku s vodou",
      "Rostliny ji vyrábějí z listů",
    ],
    hints: [
      "Půda vzniká velmi pomalu — tisíce let.",
      "Co se děje s kameny, listím a mrtvými živočichy v přírodě?",
    ],
    explanation: "Půda vzniká velmi dlouho — horniny se drobí a rozpadají, odumřelé rostliny a živočichové se rozkládají. Z toho všeho vzniká úrodná půda.",
  },
  {
    question: "Kdo žije v půdě a pomáhá ji kypřit?",
    correctAnswer: "Žížaly a drobné mikroorganismy",
    options: [
      "Žížaly a drobné mikroorganismy",
      "Ryby a raci",
      "Ptáci a motýli",
      "Houby a lišejníky na kamenech",
    ],
    hints: [
      "Po dešti je vidíš na chodníku — jsou růžové a dlouhé.",
      "Mikroorganismy jsou tak malé, že je nevidíme pouhým okem.",
    ],
    explanation: "Žížaly prokopávají půdu a provzdušňují ji. Mikroorganismy rozkládají odumřelé látky na živiny. Bez nich by půda nebyla úrodná.",
  },
  {
    question: "Proč je půda důležitá pro rostliny?",
    correctAnswer: "Rostliny v ní kotví kořeny a čerpají z ní živiny a vodu",
    options: [
      "Rostliny v ní kotví kořeny a čerpají z ní živiny a vodu",
      "Půda chrání rostliny před deštěm",
      "Půda dává rostlinám sluneční světlo",
      "Rostliny v půdě spí přes zimu",
    ],
    hints: [
      "Co dělají kořeny rostliny?",
      "Bez půdy by rostlina nemohla stát ani se živit.",
    ],
    explanation: "Kořeny drží rostlinu v půdě a zároveň z ní nasávají vodu a živiny. Bez úrodné půdy by rostliny nerostly a nebylo by jídlo pro lidi ani zvířata.",
  },
  {
    question: "Co je eroze půdy?",
    correctAnswer: "Odnášení půdy větrem nebo vodou",
    options: [
      "Odnášení půdy větrem nebo vodou",
      "Zamrznutí půdy v zimě",
      "Hnojení půdy hnojem",
      "Kopání děr do půdy",
    ],
    hints: [
      "Silný déšť na holém poli — co se stane s hlínou?",
      "Eroze = ohlodávání povrchu.",
    ],
    explanation: "Eroze je odnášení půdy větrem nebo vodou. Na holých polích bez stromů a rostlin se půda snadno odplavuje. Proto jsou důležité stromy a rostlinný pokryv.",
  },
  {
    question: "Proč říkáme, že voda, vzduch a půda jsou základ života?",
    correctAnswer: "Bez nich by nemohly žít rostliny ani živočichové",
    options: [
      "Bez nich by nemohly žít rostliny ani živočichové",
      "Protože jsou hezké a barevné",
      "Jen voda je základ, vzduch a půda nejsou tak důležité",
      "Základ života jsou jen potraviny z obchodu",
    ],
    hints: [
      "Zamysli se — bez vzduchu nedýcháš, bez vody neumyješ, bez půdy nic neroste.",
      "Celý potravní řetězec začíná rostlinami v půdě.",
    ],
    explanation: "Voda, vzduch a půda jsou nezbytné pro veškerý život na Zemi. Rostliny rostou v půdě a potřebují vodu a vzduch. Živočichové jedí rostliny a dýchají vzduch. Vše je propojeno.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const VODAVZDUCHPUDA: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-ziva-a-neziva-priroda-voda-vzduch-puda-vyznam-pro-zivot",
    rvpNodeId: "g3-prvouka-rozmanitost-prirody-ziva-a-neziva-priroda-voda-vzduch-puda-vyznam-pro-zivot",
    title: "Voda, vzduch, půda — význam pro život",
    studentTitle: "Voda, vzduch a půda",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Živá a neživá příroda",
    briefDescription: "Pochopíš, proč jsou voda, vzduch a půda nezbytné pro život.",
    keywords: ["voda", "vzduch", "půda", "koloběh vody", "kyslík", "dusík", "eroze", "fotosyntéza"],
    goals: [
      "Popsat koloběh vody v přírodě",
      "Vysvětlit složení vzduchu a jeho důležitost",
      "Pochopit, jak vzniká půda a proč je důležitá",
      "Uvést příklady znečišťování a ochrany přírody",
    ],
    boundaries: ["Chemické vzorce a podrobná chemie jsou nad rámec 3. ročníku"],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vzpomeň si na koloběh vody: výpar → oblaka → déšť → řeky → moře.",
      steps: [
        "1. Voda: výpar → oblaka → srážky → řeky → moře (koloběh).",
        "2. Vzduch: 4/5 dusík + 1/5 kyslík + trocha CO₂.",
        "3. Kyslík = dýchání živočichů. CO₂ = fotosyntéza rostlin.",
        "4. Půda vzniká z hornin + odumřelých organismů. Žížaly ji kypří.",
      ],
      commonMistake: "Vzduch není jen kyslík — největší část tvoří dusík.",
      example: "Koloběh vody: řeka vypaří vodu → oblaka → déšť → řeka opět.",
    },
  },
];
