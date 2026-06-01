import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const HORY = [
  { pohoří: "Krkonoše", vrchol: "Sněžka", výška: "1603 m", poloha: "severovýchodní Čechy, u Polska" },
  { pohoří: "Šumava", vrchol: "Plechý", výška: "1378 m", poloha: "jihozápadní Čechy, u Německa a Rakouska" },
  { pohoří: "Jeseníky", vrchol: "Praděd", výška: "1492 m", poloha: "severní Morava" },
  { pohoří: "Beskydy", vrchol: "Lysá hora", výška: "1323 m", poloha: "východní Morava" },
  { pohoří: "Krušné hory", vrchol: "Klínovec", výška: "1244 m", poloha: "severozápadní Čechy, u Německa" },
  { pohoří: "Orlické hory", vrchol: "Velká Deštná", výška: "1115 m", poloha: "východní Čechy, u Polska" },
];

const POOL_L1: PracticeTask[] = [
  {
    question: "Jak se jmenuje nejvyšší hora ČR?",
    correctAnswer: "Sněžka – 1603 m",
    options: ["Sněžka – 1603 m", "Praděd – 1492 m", "Lysá hora – 1323 m", "Plechý – 1378 m"],
    hints: ["Nejvyšší hora ČR leží v Krkonoších."],
    solutionSteps: ["Nejvyšší hora ČR je Sněžka v Krkonoších s výškou 1603 m n. m."],
  },
  {
    question: "Ve které pohoří leží Sněžka?",
    correctAnswer: "V Krkonoších",
    options: ["V Krkonoších", "Na Šumavě", "V Jeseníkách", "V Beskydech"],
    hints: ["Sněžka leží na severu Čech, u hranice s Polskem."],
    solutionSteps: ["Sněžka leží v Krkonoších na severovýchodě Čech."],
  },
  {
    question: "Co jsou to nížiny?",
    correctAnswer: "Rovné nebo mírně zvlněné oblasti s nízkou nadmořskou výškou",
    options: [
      "Rovné nebo mírně zvlněné oblasti s nízkou nadmořskou výškou",
      "Horské oblasti nad 1000 m",
      "Oblasti s hlubokými údolími",
      "Sopečné oblasti",
    ],
    hints: ["Nížiny jsou ploché oblasti vhodné pro zemědělství."],
    solutionSteps: ["Nížiny jsou rovné oblasti s nízkou nadmořskou výškou — úrodná půda, příznivá pro zemědělství."],
  },
  {
    question: "Jak se jmenuje velká nížina ve středních Čechách (podél Labe)?",
    correctAnswer: "Polabská nížina",
    options: ["Polabská nížina", "Jihomoravská nížina", "Ostravská pánev", "Pardubická kotlina"],
    hints: ["Název nese podle řeky, která jí protéká."],
    solutionSteps: ["Polabská nížina leží v středních Čechách a protéká jí řeka Labe."],
  },
  {
    question: "Jak se jmenuje nížina na jihu Moravy?",
    correctAnswer: "Jihomoravská nížina",
    options: ["Jihomoravská nížina", "Polabská nížina", "Valašská kotlina", "Opavská nížina"],
    hints: ["Tato nížina je nejúrodnější oblastí ČR — roste tam víno a cukrovka."],
    solutionSteps: ["Jihomoravská nížina leží na jihu Moravy u řeky Moravy — nejúrodnější oblast ČR."],
  },
  {
    question: "Jak se jmenuje vrchovina uprostřed ČR?",
    correctAnswer: "Českomoravská vrchovina",
    options: ["Českomoravská vrchovina", "Drahanská vrchovina", "Šumava", "Krušné hory"],
    hints: ["Tato vrchovina odděluje Čechy od Moravy."],
    solutionSteps: ["Českomoravská vrchovina leží ve středu ČR a odděluje Čechy od Moravy."],
  },
  {
    question: "Jak se jmenuje nejvyšší hora Jeseníků?",
    correctAnswer: "Praděd – 1492 m",
    options: ["Praděd – 1492 m", "Sněžka – 1603 m", "Lysá hora – 1323 m", "Plechý – 1378 m"],
    hints: ["Praděd leží v severní Moravě."],
    solutionSteps: ["Nejvyšší hora Jeseníků je Praděd s výškou 1492 m n. m."],
  },
  {
    question: "Na které straně ČR leží Šumava?",
    correctAnswer: "Na jihozápadě – u Německa a Rakouska",
    options: [
      "Na jihozápadě – u Německa a Rakouska",
      "Na severovýchodě – u Polska",
      "Uprostřed Čech",
      "Na jihovýchodě – u Slovenska",
    ],
    hints: ["Šumava leží v jihozápadních Čechách."],
    solutionSteps: ["Šumava leží na jihozápadě ČR a hraničí s Německem a Rakouskem."],
  },
  {
    question: "Jak se nazývá horský oblouk obklopující Čechy ze tří stran?",
    correctAnswer: "Sudetský oblouk",
    options: ["Sudetský oblouk", "Karpatský oblouk", "Alpský oblouk", "Český oblouk"],
    hints: ["Tento oblouk tvoří přirozené hranice Čech."],
    solutionSteps: ["Sudetský oblouk (Krušné hory, Jizerské hory, Krkonoše, Orlické hory, Jeseníky) obklopuje Čechy ze tří stran."],
  },
  {
    question: "Jaká je výška Sněžky — nejvyšší hory ČR?",
    correctAnswer: "1603 m n. m.",
    options: ["1603 m n. m.", "1492 m n. m.", "1378 m n. m.", "2655 m n. m."],
    hints: ["Sněžka je přes 1600 metrů nad mořem."],
    solutionSteps: ["Sněžka dosahuje 1603 m n. m. — je to nejvyšší bod ČR."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak se liší vrchovina od hory?",
    correctAnswer: "Vrchovina je mírně zvlněná oblast 300–800 m, hora má ostré vrcholy nad 800 m",
    options: [
      "Vrchovina je mírně zvlněná oblast 300–800 m, hora má ostré vrcholy nad 800 m",
      "Vrchovina je vyšší než hora",
      "Vrchovina je rovina, hora je kopec",
      "Rozdíl je jen v názvu",
    ],
    hints: ["Vrchovina = mírná zvlnění, hora = strmé svahy a výrazné vrcholy."],
    solutionSteps: ["Vrchovina má nadmořskou výšku 300–800 m s mírnými svahy. Hora má výrazné vrcholy nad 800–1000 m."],
  },
  {
    question: "Ve které pohoří leží Lysá hora?",
    correctAnswer: "V Beskydech",
    options: ["V Beskydech", "V Jeseníkách", "V Krkonoších", "V Orlických horách"],
    hints: ["Beskydy leží na východní Moravě."],
    solutionSteps: ["Lysá hora (1323 m) leží v Beskydech na východní Moravě u Slovenska."],
  },
  {
    question: "Jaká je výška Pradědu v Jeseníkách?",
    correctAnswer: "1492 m n. m.",
    options: ["1492 m n. m.", "1603 m n. m.", "1323 m n. m.", "1244 m n. m."],
    hints: ["Praděd je druhá nejvyšší hora ČR."],
    solutionSteps: ["Praděd v Jeseníkách dosahuje 1492 m n. m. — druhá nejvyšší hora ČR."],
  },
  {
    question: "Proč jsou nížiny nejúrodnějšími oblastmi ČR?",
    correctAnswer: "Mají úrodnou půdu – sprašová hlína a příznivé klima pro zemědělství",
    options: [
      "Mají úrodnou půdu – sprašová hlína a příznivé klima pro zemědělství",
      "Je tam více slunce než v horách",
      "V nížinách jsou velká města",
      "Nížiny jsou blíže k moři",
    ],
    hints: ["Zemědělci vždy preferují rovné, teplé nížiny s úrodnou půdou."],
    solutionSteps: ["Nížiny mají hlubokou úrodnou půdu (sprašová hlína) a teplé klima — ideální pro pšenici, cukrovku, kukuřici."],
  },
  {
    question: "Kde leží Krušné hory?",
    correctAnswer: "Na severozápadě Čech, u hranice s Německem",
    options: [
      "Na severozápadě Čech, u hranice s Německem",
      "Na severu Moravy",
      "Uprostřed Čech",
      "Na jihu Moravy",
    ],
    hints: ["Krušné hory oddělují Čechy od Saska."],
    solutionSteps: ["Krušné hory leží na severozápadě Čech a tvoří přirozenou hranici s Německem."],
  },
  {
    question: "Jaký je terén Moravy ve srovnání s Čechami?",
    correctAnswer: "Morava je celkově nižší a rovnější než Čechy",
    options: [
      "Morava je celkově nižší a rovnější než Čechy",
      "Morava je hornatější než Čechy",
      "Morava a Čechy mají stejný terén",
      "Čechy jsou rovnější než Morava",
    ],
    hints: ["Jihomoravská nížina je nejrozsáhlejší nízkou oblastí ČR."],
    solutionSteps: ["Morava má nižší terén než Čechy — na jihu je Jihomoravská nížina, na severu mírné Jeseníky."],
  },
  {
    question: "Co je to Drahanská vrchovina?",
    correctAnswer: "Vrchovina na střední Moravě, oddělující Hanu od Valašska",
    options: [
      "Vrchovina na střední Moravě, oddělující Hanu od Valašska",
      "Pohoří na jihu Čech",
      "Nížina v Polabí",
      "Horský masiv v Jeseníkách",
    ],
    hints: ["Drahanská vrchovina leží na Moravě."],
    solutionSteps: ["Drahanská vrchovina leží na střední Moravě a odděluje Hanou od Valašska."],
  },
  {
    question: "Ve které pohoří leží Klínovec?",
    correctAnswer: "V Krušných horách",
    options: ["V Krušných horách", "V Jeseníkách", "V Beskydech", "V Šumavě"],
    hints: ["Klínovec je nejvyšší hora Krušných hor."],
    solutionSteps: ["Klínovec (1244 m) je nejvyšší hora Krušných hor na severozápadě Čech."],
  },
  {
    question: "Co je to Plechý?",
    correctAnswer: "Nejvyšší hora Šumavy – 1378 m",
    options: [
      "Nejvyšší hora Šumavy – 1378 m",
      "Nejvyšší hora Krkonoš",
      "Jezero na Šumavě",
      "Přehrada v jižních Čechách",
    ],
    hints: ["Plechý leží na Šumavě."],
    solutionSteps: ["Plechý (1378 m) je nejvyšší hora Šumavy na jihozápadě Čech."],
  },
  {
    question: "Proč se Čechy nazývají 'česká kotlina'?",
    correctAnswer: "Jsou ze tří stran obklopeny horami — Sudetský oblouk je jako okraj misky",
    options: [
      "Jsou ze tří stran obklopeny horami — Sudetský oblouk je jako okraj misky",
      "Čechy leží v nadmořské výšce 0 metrů",
      "Čechy jsou velmi ploché",
      "Jsou to historické hranice Čech",
    ],
    hints: ["Představ si mapu ČR — jak vypadají hory kolem Čech?"],
    solutionSteps: ["Čechy jsou ze tří stran obklopeny pohořími — Sudetský oblouk tvoří přirozený 'okraj misky' (kotliny)."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď od nejvyššího po nejnižší: Sněžka, Plechý, Lysá hora, Praděd.",
    correctAnswer: "Sněžka (1603 m), Praděd (1492 m), Plechý (1378 m), Lysá hora – 1323 m",
    options: [
      "Sněžka (1603 m), Praděd (1492 m), Plechý (1378 m), Lysá hora – 1323 m",
      "Praděd, Sněžka, Lysá hora, Plechý",
      "Sněžka, Plechý, Praděd, Lysá hora",
      "Lysá hora, Sněžka, Praděd, Plechý",
    ],
    hints: ["Sněžka je nejvyšší — 1603 m."],
    solutionSteps: ["Sněžka 1603 m > Praděd 1492 m > Plechý 1378 m > Lysá hora 1323 m."],
  },
  {
    question: "Proč jsou Krkonoše oblíbenou turistickou destinací v zimě?",
    correctAnswer: "Jsou nejvyššími horami ČR s dostatkem sněhu pro lyžování",
    options: [
      "Jsou nejvyššími horami ČR s dostatkem sněhu pro lyžování",
      "Jsou nejblíže Praze",
      "Mají nejhezčí národní park ČR",
      "Jsou to nejstarší hory ČR",
    ],
    hints: ["V Krkonoších je nejvyšší hora ČR — Sněžka."],
    solutionSteps: ["Krkonoše jsou nejvyšší pohoří ČR, mají sněhové podmínky pro lyžování a jsou dostupné z Prahy."],
  },
  {
    question: "Jak vznikly Krkonoše a Šumava — jsou to mladé nebo staré hory?",
    correctAnswer: "Jsou to staré hory – hercynského stáří — starší než Alpy",
    options: [
      "Jsou to staré hory – hercynského stáří — starší než Alpy",
      "Jsou to mladé hory podobné Alpám",
      "Vznikly sopečnou činností",
      "Jsou stejně staré jako Himaláje",
    ],
    hints: ["Krkonoše jsou zaoblené — to je typické pro staré hory."],
    solutionSteps: ["Krkonoše, Šumava i Jeseníky jsou staré hercynské hory (350 mil. let) — oproti mladým Alpám (30 mil. let) jsou silně erodované a zaoblené."],
  },
  {
    question: "Proč jsou v Šumavě rašeliniště a prameniště řek?",
    correctAnswer: "Šumava je na hlavním evropském rozvodí a její vlhká krajina zadržuje vodu",
    options: [
      "Šumava je na hlavním evropském rozvodí a její vlhká krajina zadržuje vodu",
      "Šumava leží u moře",
      "Šumava je sopečná oblast",
      "V Šumavě je mnoho přehrad",
    ],
    hints: ["Šumava je 'zelená střecha Evropy' — kde začínají velké řeky?"],
    solutionSteps: ["Šumava leží na rozvodí a vlhké rašeliniště zadržují vodu — proto pramení Vltava a Otava na Šumavě."],
  },
  {
    question: "Co je charakteristické pro krajinu Valašska?",
    correctAnswer: "Kopcovitý terén Beskyd, pastviny, salaše a lidové tradice",
    options: [
      "Kopcovitý terén Beskyd, pastviny, salaše a lidové tradice",
      "Ploché nížiny s obilím",
      "Průmyslová oblast s dolly",
      "Pobřeží s rybníky",
    ],
    hints: ["Valašsko leží v Beskydech na Moravě."],
    solutionSteps: ["Valašsko je kraj Beskyd s kopcovitou krajinou, pastvinami, salaši a bohatým folklórem."],
  },
  {
    question: "Co jsou to Beskydy a kde leží?",
    correctAnswer: "Pohoří na východní Moravě, část Karpat, Lysá hora 1323 m",
    options: [
      "Pohoří na východní Moravě, část Karpat, Lysá hora 1323 m",
      "Pohoří v Čechách u Německa",
      "Nížina na jihu Moravy",
      "Část Sudetského oblouku",
    ],
    hints: ["Beskydy jsou součástí Karpat — odlišné od Sudet v Čechách."],
    solutionSteps: ["Beskydy jsou součástí Karpat na východní Moravě u Slovenska a Polska. Nejvyšší bod: Lysá hora 1323 m."],
  },
  {
    question: "Proč je Jihomoravská nížina nejteplejší a nejúrodnější oblastí ČR?",
    correctAnswer: "Leží na jihu v nížině, dostává teplý vzduch z jihovýchodu a má úrodnou sprašovou půdu",
    options: [
      "Leží na jihu v nížině, dostává teplý vzduch z jihovýchodu a má úrodnou sprašovou půdu",
      "Je nejblíže ke středu Evropy",
      "Má největší přehrady v ČR",
      "Leží u Dunaje",
    ],
    hints: ["Jihomoravská nížina = teplá + úrodná → víno a zelenina."],
    solutionSteps: ["Jihomoravská nížina: nízká nadmořská výška + teplý vzduch z jihovýchodní Evropy + sprašová hlína = nejúrodnější oblast ČR."],
  },
  {
    question: "Co jsou to Jizerské hory?",
    correctAnswer: "Pohoří v severních Čechách u Liberce, část Sudet",
    options: [
      "Pohoří v severních Čechách u Liberce, část Sudet",
      "Pohoří na Moravě",
      "Součást Šumavy",
      "Pohoří v jižních Čechách",
    ],
    hints: ["Jizerské hory leží severně od Liberce."],
    solutionSteps: ["Jizerské hory jsou součástí Sudet v severních Čechách — leží u Liberce a jsou oblíbené pro turistiku."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const count = level === 3 ? Math.min(pool.length, 40) : Math.min(pool.length, 30);
  return shuffle(pool).slice(0, count);
}

export const POVRCHCRNIZINYVRCHOVINYHORYKRKONOSESUMAVAAJ: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-povrch-cr-niziny-vrchoviny-hory-krkonose-sumava-aj",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-povrch-cr-niziny-vrchoviny-hory-krkonose-sumava-aj",
    title: "Povrch ČR - nížiny, vrchoviny, hory (Krkonoše, Šumava aj.)",
    studentTitle: "Hory a nížiny ČR",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš hlavní pohoří a nížiny ČR a naučíš se nejvyšší hory.",
    keywords: ["Krkonoše", "Sněžka", "Šumava", "Jeseníky", "Beskydy", "nížina", "vrchovina", "hory"],
    goals: [
      "Vyjmenovat hlavní pohoří ČR a jejich nejvyšší vrcholy",
      "Popsat Polabskou a Jihomoravskou nížinu",
      "Určit polohu hlavních pohoří na mapě",
      "Vysvětlit, čím se liší nížina, vrchovina a hora",
    ],
    boundaries: ["Geologické stáří hor není povinné", "Přesné souřadnice nejsou cílem"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Nejvyšší hora ČR = Sněžka 1603 m v Krkonoších. Nejúrodnější = Jihomoravská nížina.",
      steps: [
        "Vzpomeň si na mapu ČR — kde jsou hory?",
        "Sudetský oblouk = sever a západ Čech",
        "Beskydy = východní Morava",
        "Nížiny = střední Čechy (Polabí) a jižní Morava",
      ],
      commonMistake: "Žáci si pletou Sněžku (Krkonoše) a Praděd (Jeseníky) — Sněžka je vyšší.",
      example: "Krkonoše → Sněžka 1603 m; Jeseníky → Praděd 1492 m; Šumava → Plechý 1378 m",
    },
  },
];
