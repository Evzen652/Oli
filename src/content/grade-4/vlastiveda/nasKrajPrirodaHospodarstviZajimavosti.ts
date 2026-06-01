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
    question: "Co tvoří přírodu kraje?",
    correctAnswer: "Hory, řeky, lesy, pole a louky",
    options: ["Hory, řeky, lesy, pole a louky", "Jen hory a řeky", "Jen lesy a pole", "Silnice a budovy"],
    hints: ["Příroda kraje zahrnuje různé prvky krajiny."],
    solutionSteps: ["Přírodu kraje tvoří hory, řeky, lesy, pole a louky."],
  },
  {
    question: "Jak se nazývá vodní tok, který teče krajinou?",
    correctAnswer: "Řeka",
    options: ["Řeka", "Hora", "Les", "Pole"],
    hints: ["Vodní tok teče z kopce do nížiny."],
    solutionSteps: ["Vodní tok tekoucí krajinou se nazývá řeka."],
  },
  {
    question: "Co je to hospodářství kraje?",
    correctAnswer: "Způsob, jakým lidé v kraji pracují a vyrábějí",
    options: [
      "Způsob, jakým lidé v kraji pracují a vyrábějí",
      "Příroda kraje",
      "Historické památky",
      "Počet obyvatel",
    ],
    hints: ["Hospodářství souvisí s prací a výrobou."],
    solutionSteps: ["Hospodářství kraje popisuje, jak lidé v kraji pracují — průmysl, zemědělství, cestovní ruch."],
  },
  {
    question: "Které odvětví hospodářství se zabývá pěstováním rostlin a chovem zvířat?",
    correctAnswer: "Zemědělství",
    options: ["Zemědělství", "Průmysl", "Cestovní ruch", "Obchod"],
    hints: ["Toto odvětví se týká práce na polích a farmách."],
    solutionSteps: ["Zemědělství se zabývá pěstováním rostlin a chovem zvířat."],
  },
  {
    question: "Co je to průmysl?",
    correctAnswer: "Výroba zboží v továrnách",
    options: ["Výroba zboží v továrnách", "Pěstování obilí", "Cestování za památkami", "Rybaření v řekách"],
    hints: ["Průmysl je spojen s továrnami a stroji."],
    solutionSteps: ["Průmysl je výroba zboží v továrnách pomocí strojů."],
  },
  {
    question: "Co je to cestovní ruch?",
    correctAnswer: "Podnikání spojené s návštěvníky a turisty",
    options: [
      "Podnikání spojené s návštěvníky a turisty",
      "Stavba silnic",
      "Pěstování zeleniny",
      "Výroba aut",
    ],
    hints: ["Cestovní ruch přináší do kraje peníze od turistů."],
    solutionSteps: ["Cestovní ruch zahrnuje ubytování, stravování a služby pro turisty."],
  },
  {
    question: "Co jsou to přírodní památky kraje?",
    correctAnswer: "Místa s vzácnou přírodou chráněná zákonem",
    options: [
      "Místa s vzácnou přírodou chráněná zákonem",
      "Historické hrady",
      "Továrny v kraji",
      "Silnice a dálnice",
    ],
    hints: ["Přírodní památky chrání vzácná místa v přírodě."],
    solutionSteps: ["Přírodní památky jsou chráněná místa s vzácnou faunou, flórou nebo geologickými útvary."],
  },
  {
    question: "Kde v kraji obvykle žije nejvíce lidí?",
    correctAnswer: "Ve městech",
    options: ["Ve městech", "V horách", "V lesích", "Na polích"],
    hints: ["Lidé se soustředí do míst s prací a službami."],
    solutionSteps: ["Nejvíce lidí žije ve městech, kde jsou práce, školy a obchody."],
  },
  {
    question: "Co je to krajina?",
    correctAnswer: "Část zemského povrchu s typickým vzhledem",
    options: [
      "Část zemského povrchu s typickým vzhledem",
      "Pohled z okna vlaku",
      "Mapa kraje",
      "Správní centrum kraje",
    ],
    hints: ["Krajina je to, co vidíme kolem sebe v přírodě."],
    solutionSteps: ["Krajina je část zemského povrchu s charakteristickým vzhledem — lesy, pole, kopce, řeky."],
  },
  {
    question: "Jak lidé poznávají svůj kraj?",
    correctAnswer: "Výlety, pozorování přírody, návštěvy muzejí",
    options: [
      "Výlety, pozorování přírody, návštěvy muzejí",
      "Jen čtením knih",
      "Jen z televize",
      "Jen z internetu",
    ],
    hints: ["Nejlepší způsob je osobní zkušenost."],
    solutionSteps: ["Kraj nejlépe poznáme výlety do přírody, návštěvami muzejí, hradů a zámků."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Který typ krajiny se vyznačuje pěstováním obilovin a cukrovky?",
    correctAnswer: "Nížina s úrodnou půdou",
    options: ["Nížina s úrodnou půdou", "Horský terén", "Průmyslová oblast", "Pobřeží moře"],
    hints: ["Obiloviny se pěstují tam, kde je rovný terén a úrodná půda."],
    solutionSteps: ["Obiloviny a cukrovka se pěstují v nížinách s úrodnou půdou."],
  },
  {
    question: "Jaký typ hospodářství převládá v horských oblastech kraje?",
    correctAnswer: "Cestovní ruch a lesnictví",
    options: ["Cestovní ruch a lesnictví", "Těžký průmysl", "Pěstování obilí", "Rybníkářství"],
    hints: ["V horách je málo úrodné půdy, ale krásná příroda."],
    solutionSteps: ["V horách převládá cestovní ruch (lyžování, turistika) a lesnictví."],
  },
  {
    question: "Co jsou to kulturní památky kraje?",
    correctAnswer: "Hrady, zámky, kostely a historická místa",
    options: [
      "Hrady, zámky, kostely a historická místa",
      "Lesy a řeky",
      "Továrny a sklady",
      "Silnice a mosty",
    ],
    hints: ["Kulturní památky vytvořili lidé v minulosti."],
    solutionSteps: ["Kulturní památky jsou hrady, zámky, kostely a historická místa — dědictví minulosti."],
  },
  {
    question: "Proč je důležité chránit přírodu kraje?",
    correctAnswer: "Pro zachování zdravého prostředí pro lidi, zvířata i rostliny",
    options: [
      "Pro zachování zdravého prostředí pro lidi, zvířata i rostliny",
      "Aby turisté platili vstupné",
      "Kvůli zákonům Evropské unie",
      "Protože příroda nevydělává peníze",
    ],
    hints: ["Příroda je základ života všech živých tvorů."],
    solutionSteps: ["Přírodu chráníme, protože zdravé prostředí je nezbytné pro život lidí, zvířat i rostlin."],
  },
  {
    question: "Co je to národní park?",
    correctAnswer: "Rozsáhlé chráněné území s vzácnou přírodou",
    options: [
      "Rozsáhlé chráněné území s vzácnou přírodou",
      "Park ve středu města",
      "Průmyslová zóna",
      "Sportovní hřiště",
    ],
    hints: ["Národní park je velká chráněná oblast přírody."],
    solutionSteps: ["Národní park je rozsáhlé území, kde je příroda chráněná před zásahy člověka."],
  },
  {
    question: "Co znamená, že kraj má rozvinutý průmysl?",
    correctAnswer: "V kraji je hodně továren a pracovních míst v výrobě",
    options: [
      "V kraji je hodně továren a pracovních míst v výrobě",
      "Kraj má velké lesy",
      "Kraj má hodně turistů",
      "V kraji je dobré zemědělství",
    ],
    hints: ["Průmyslová oblast má charakteristický krajinný ráz s komíny a halami."],
    solutionSteps: ["Rozvinutý průmysl znamená mnoho továren, pracovních míst a výroby v kraji."],
  },
  {
    question: "Jak se nazývá největší správní centrum kraje?",
    correctAnswer: "Krajské město",
    options: ["Krajské město", "Hlavní město", "Obecní úřad", "Radnice"],
    hints: ["Toto centrum řídí celý kraj."],
    solutionSteps: ["Největší správní centrum kraje se nazývá krajské město."],
  },
  {
    question: "Kde bychom nejspíše našli informace o historii a přírodě kraje?",
    correctAnswer: "V krajském muzeu nebo informačním centru",
    options: [
      "V krajském muzeu nebo informačním centru",
      "V supermarketu",
      "Na poště",
      "V autobusovém nádraží",
    ],
    hints: ["Muzeum uchovává historii a přírodniny kraje."],
    solutionSteps: ["Informace o kraji najdeme v muzeu, galerii nebo turistickém informačním centru."],
  },
  {
    question: "Co je to chráněná krajinná oblast (CHKO)?",
    correctAnswer: "Území s chráněnou přírodou, kde se může bydlet i hospodařit",
    options: [
      "Území s chráněnou přírodou, kde se může bydlet i hospodařit",
      "Území, kam lidé nesmí vstoupit",
      "Průmyslová zóna",
      "Zemědělská oblast bez lesů",
    ],
    hints: ["CHKO je méně přísné než národní park."],
    solutionSteps: ["CHKO je chráněná oblast, kde příroda dostává přednost, ale lidé tam mohou žít a hospodařit."],
  },
  {
    question: "Co jsou to přírodní zdroje kraje?",
    correctAnswer: "Nerosty, půda, voda, lesy využívané v hospodářství",
    options: [
      "Nerosty, půda, voda, lesy využívané v hospodářství",
      "Historické budovy",
      "Silniční síť",
      "Počet obyvatel",
    ],
    hints: ["Přírodní zdroje jsou dány přírodou, ne lidmi."],
    solutionSteps: ["Přírodní zdroje jsou voda, půda, lesy, uhlí, rudy a další suroviny z přírody."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Proč jsou nížiny kraje vhodné pro zemědělství, ale hory nikoli?",
    correctAnswer: "V nížinách je úrodná půda a příznivé klima; v horách je terén kamenitý a klima drsné",
    options: [
      "V nížinách je úrodná půda a příznivé klima; v horách je terén kamenitý a klima drsné",
      "Nížiny jsou blíže k moři",
      "Hory mají méně slunce než nížiny",
      "V nížinách jsou zásoby vody, v horách ne",
    ],
    hints: ["Mysli na to, jaká je v nížinách půda a co roste v horách."],
    solutionSteps: ["Nížiny mají úrodnou půdu a teplé klima — ideální pro obilí. Hory mají kamenitou půdu a krátké léto."],
  },
  {
    question: "Jak mohou turisté pomoci hospodářství kraje?",
    correctAnswer: "Utrácejí peníze za ubytování, jídlo a suvenýry, čímž zaměstnávají místní lidi",
    options: [
      "Utrácejí peníze za ubytování, jídlo a suvenýry, čímž zaměstnávají místní lidi",
      "Staví nové továrny",
      "Pěstují zemědělské plodiny",
      "Volí nového hejtmana",
    ],
    hints: ["Turisti přinášejí do kraje peníze ze svého bydliště."],
    solutionSteps: ["Turisté platí za ubytování, stravování a zboží — tím přináší peníze do kraje a vytvářejí pracovní místa."],
  },
  {
    question: "Proč je důležité zachovat rovnováhu mezi průmyslem a přírodou v kraji?",
    correctAnswer: "Průmysl přináší práci, ale může znečistit přírodu — je třeba obojí sladit",
    options: [
      "Průmysl přináší práci, ale může znečistit přírodu — je třeba obojí sladit",
      "Příroda je vždy důležitější než průmysl",
      "Průmysl je vždy důležitější než příroda",
      "Není třeba nic vyvažovat — průmysl a příroda si nepřekáží",
    ],
    hints: ["Zamysli se nad tím, co přináší průmysl a co hrozí přírodě."],
    solutionSteps: ["Průmysl zaměstnává lidi a vyrábí potřebné věci, ale může znečistit vzduch a vodu. Proto je potřeba rovnováha."],
  },
  {
    question: "Jak se projevuje změna klimatu na krajině kraje?",
    correctAnswer: "Sucha, povodně, odumírání lesů, tání sněhu v horách",
    options: [
      "Sucha, povodně, odumírání lesů, tání sněhu v horách",
      "Přibývají nové druhy zvířat a rostlin",
      "Příroda se zlepšuje díky teplu",
      "Změna klimatu krajinu neovlivňuje",
    ],
    hints: ["Změna klimatu způsobuje extrémy — sucho i záplavy."],
    solutionSteps: ["Změna klimatu způsobuje sucha, záplavy, kůrovcové kalamity v lesích a méně sněhu v horách."],
  },
  {
    question: "Co je to tradice kraje?",
    correctAnswer: "Zvyky, řemesla a způsob života předávaný z generace na generaci",
    options: [
      "Zvyky, řemesla a způsob života předávaný z generace na generaci",
      "Nové technologie v kraji",
      "Moderní stavby a infrastruktura",
      "Politické rozhodování v kraji",
    ],
    hints: ["Tradice jsou staré zvyky, které lidi uchovávají a předávají dětem."],
    solutionSteps: ["Tradice jsou lidové zvyky, řemesla, kroje a způsoby slavení svátků předávané z generace na generaci."],
  },
  {
    question: "Jak poznáme, zda je kraj zemědělský nebo průmyslový?",
    correctAnswer: "Zemědělský kraj má pole a farmy; průmyslový má továrny a doly",
    options: [
      "Zemědělský kraj má pole a farmy; průmyslový má továrny a doly",
      "Zemědělský kraj je větší",
      "Průmyslový kraj má více lesů",
      "Zemědělský kraj leží vždy v nížině",
    ],
    hints: ["Kraj poznáme podle toho, co v něm dominuje."],
    solutionSteps: ["Zemědělský kraj má pole, sady a farmy. Průmyslový kraj má továrny, doly a komíny."],
  },
  {
    question: "Co jsou to regionální produkty?",
    correctAnswer: "Výrobky typické pro daný kraj — jídlo, nápoje, řemesla",
    options: [
      "Výrobky typické pro daný kraj — jídlo, nápoje, řemesla",
      "Zboží dovezené ze zahraničí",
      "Produkty velkých světových firem",
      "Výrobky vyrobené ve velkých továrnách",
    ],
    hints: ["Regionální produkty jsou spojeny s místem svého původu."],
    solutionSteps: ["Regionální produkty jsou typické pro kraj — například jihočeský kapr, pilsnerské pivo, sklářství v Libereckém kraji."],
  },
  {
    question: "Proč jsou muzea a galerie v kraji důležitá?",
    correctAnswer: "Uchovávají historii a kulturu kraje pro budoucí generace",
    options: [
      "Uchovávají historii a kulturu kraje pro budoucí generace",
      "Vydělávají nejvíce peněz v kraji",
      "Jsou povinné ze zákona",
      "Slouží jako úřady státní správy",
    ],
    hints: ["Muzea jsou paměť kraje — uchovávají, co bylo."],
    solutionSteps: ["Muzea a galerie chrání předměty, dokumenty a umění — uchovávají paměť kraje pro budoucnost."],
  },
  {
    question: "Jaký vliv má přítomnost řeky na hospodářství kraje?",
    correctAnswer: "Řeka přináší vodu pro zemědělství, dopravu, energii – vodní elektrárny a turistiku",
    options: [
      "Řeka přináší vodu pro zemědělství, dopravu, energii – vodní elektrárny a turistiku",
      "Řeka komplikuje dopravu",
      "Řeka způsobuje záplavy a nic jiného",
      "Řeka je bezvýznamná pro hospodářství",
    ],
    hints: ["Lidé se usazovali u řek od pradávna — proč?"],
    solutionSteps: ["Řeka poskytuje vodu, dopravu (lodě), energii (mlýny, elektrárny) a přitahuje turisty."],
  },
  {
    question: "Jak se mění hospodářství kraje v čase?",
    correctAnswer: "Staré továrny zavírají, přicházejí nové technologie a služby",
    options: [
      "Staré továrny zavírají, přicházejí nové technologie a služby",
      "Hospodářství kraje se nemění",
      "Zemědělství vždy roste",
      "Průmysl je vždy nejdůležitější odvětví",
    ],
    hints: ["Zamysli se nad tím, co se děje v průběhu let v průmyslu a zemědělství."],
    solutionSteps: ["Hospodářství se mění — těžký průmysl ustupuje, roste cestovní ruch, IT a moderní technologie."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, Math.min(pool.length, 30));
}

export const NASKRAJPRIRODAHOSPODARSTVIZAJIMAVOSTI: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-kraje-cr-nas-kraj-priroda-hospodarstvi-zajimavosti",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-kraje-cr-nas-kraj-priroda-hospodarstvi-zajimavosti",
    title: "Náš kraj - příroda, hospodářství, zajímavosti",
    studentTitle: "Náš kraj",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš, co tvoří přírodu kraje, jak lidé pracují a co kraj nabízí.",
    keywords: ["kraj", "příroda", "hospodářství", "průmysl", "zemědělství", "turistika", "památky"],
    goals: [
      "Popsat prvky přírody kraje (hory, řeky, lesy, pole)",
      "Rozlišit zemědělství, průmysl a cestovní ruch",
      "Vysvětlit, jak lidé poznávají svůj kraj",
    ],
    boundaries: ["Konkrétní čísla a statistiky nejsou požadovány", "Podrobné dějiny kraje nejsou cílem"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "conceptual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Příroda kraje = hory, řeky, lesy, pole. Hospodářství = zemědělství, průmysl, cestovní ruch.",
      steps: [
        "Vzpomeň si, jak krajina kraje vypadá",
        "Přemýšlej, jak lidé v kraji pracují",
        "Co v kraji přitahuje turisty?",
      ],
      commonMistake: "Žáci si pletou přírodu a hospodářství — příroda jsou lesy a řeky, hospodářství je práce lidí.",
      example: "Jihočeský kraj: příroda = Šumava, rybníky; hospodářství = zemědělství, rybolov; zajímavosti = Hluboká, Český Krumlov",
    },
  },
];
