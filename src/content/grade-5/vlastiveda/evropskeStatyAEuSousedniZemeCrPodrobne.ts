import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1 – jednodušší páry (sousedé ČR a jejich hlavní města)
const POOL_L1: PracticeTask[] = [
  {
    question: "Spoj sousední stát ČR s jeho hlavním městem.",
    correctAnswer: "match",
    pairs: [
      { left: "Německo", right: "Berlín" },
      { left: "Polsko", right: "Varšava" },
      { left: "Slovensko", right: "Bratislava" },
      { left: "Rakousko", right: "Vídeň" },
    ],
    hints: ["Bratislava je hlavním městem Slovenska."],
  },
  {
    question: "Spoj sousední stát ČR s jeho přibližnou polohou vůči Česku.",
    correctAnswer: "match",
    pairs: [
      { left: "Německo", right: "Na západ od ČR" },
      { left: "Polsko", right: "Na sever od ČR" },
      { left: "Slovensko", right: "Na východ od ČR" },
      { left: "Rakousko", right: "Na jih od ČR" },
    ],
    hints: ["Německo leží na západ, Polsko na sever."],
  },
  {
    question: "Spoj sousední stát ČR s přibližným počtem obyvatel.",
    correctAnswer: "match",
    pairs: [
      { left: "Německo", right: "~84 milionů obyvatel" },
      { left: "Polsko", right: "~37 milionů obyvatel" },
      { left: "Rakousko", right: "~9 milionů obyvatel" },
      { left: "Slovensko", right: "~5,5 milionu obyvatel" },
    ],
    hints: ["Německo je největší soused."],
  },
  {
    question: "Spoj zemi s její měnou (aktuální).",
    correctAnswer: "match",
    pairs: [
      { left: "Česká republika", right: "Česká koruna (CZK)" },
      { left: "Slovensko", right: "Euro" },
      { left: "Polsko", right: "Polský zlotý" },
      { left: "Maďarsko", right: "Maďarský forint" },
    ],
    hints: ["ČR nemá euro — používáme korunu."],
  },
  {
    question: "Spoj zemi s institucí nebo organizací, jejímž je členem.",
    correctAnswer: "match",
    pairs: [
      { left: "Česká republika", right: "NATO a EU (ale bez eura)" },
      { left: "Švýcarsko", right: "Není v EU (ale je v Schengenu)" },
      { left: "Norsko", right: "Není v EU (ale je v NATO a EHP)" },
      { left: "Velká Británie", right: "Opustila EU (Brexit 2020)" },
    ],
    hints: ["Švýcarsko není v EU."],
  },
  {
    question: "Spoj sousední zemi ČR s její největší nebo nejznámější řekou.",
    correctAnswer: "match",
    pairs: [
      { left: "Německo", right: "Rýn, Dunaj, Labe" },
      { left: "Polsko", right: "Visla, Odra" },
      { left: "Slovensko", right: "Dunaj, Váh" },
      { left: "Rakousko", right: "Dunaj" },
    ],
    hints: ["Dunaj teče přes Vídeň (Rakousko) i Bratislavu (Slovensko)."],
  },
  {
    question: "Spoj zemi s hlavní náboženskou tradicí.",
    correctAnswer: "match",
    pairs: [
      { left: "Polsko", right: "Převážně katolické" },
      { left: "Německo", right: "Polovinu katolíci, polovinu protestanti" },
      { left: "Řecko", right: "Pravoslavné" },
      { left: "Severní Irsko", right: "Protestanti a katolíci (konflikt)" },
    ],
    hints: ["Polsko je silně katolické."],
  },
  {
    question: "Spoj stát s jeho geografickým umístěním v Evropě.",
    correctAnswer: "match",
    pairs: [
      { left: "Norsko", right: "Severní Evropa — skandinávský poloostrov" },
      { left: "Španělsko", right: "Jihozápad — iberský poloostrov" },
      { left: "Řecko", right: "Jihovýchod — balkánský poloostrov" },
      { left: "Polsko", right: "Střední Evropa — severně od ČR" },
    ],
    hints: ["Norsko je na severu."],
  },
  {
    question: "Spoj souseda ČR s přibližnou délkou společné hranice.",
    correctAnswer: "match",
    pairs: [
      { left: "Německo", right: "~810 km — nejdelší hranice ČR" },
      { left: "Polsko", right: "~796 km" },
      { left: "Slovensko", right: "~252 km" },
      { left: "Rakousko", right: "~466 km" },
    ],
    hints: ["Německo sdílí s ČR nejdelší hranici."],
  },
  {
    question: "Spoj stát s EU statusem v roce 2024.",
    correctAnswer: "match",
    pairs: [
      { left: "Chorvatsko", right: "Člen EU od 2013" },
      { left: "Velká Británie", right: "Opustila EU v roce 2020 (Brexit)" },
      { left: "Norsko", right: "Není členem EU" },
      { left: "Turecko", right: "Kandidátská země EU" },
    ],
    hints: ["Chorvatsko vstoupilo do EU jako poslední v roce 2013."],
  },
];

// Level 2 – středně těžké páry
const POOL_L2: PracticeTask[] = [
  {
    question: "Spoj instituci EU s jejím sídlem.",
    correctAnswer: "match",
    pairs: [
      { left: "Evropská komise", right: "Brusel (Belgie)" },
      { left: "Evropský parlament", right: "Štrasburk (Francie) a Brusel" },
      { left: "Evropský soudní dvůr", right: "Lucemburk" },
      { left: "Centrální banka EU (ECB)", right: "Frankfurt (Německo)" },
    ],
    hints: ["Komise sídlí v Bruselu."],
  },
  {
    question: "Spoj zemi s organizací, jejímž je členem.",
    correctAnswer: "match",
    pairs: [
      { left: "Česká republika", right: "NATO + EU (bez eura)" },
      { left: "Slovensko", right: "NATO + EU (s eurem od 2009)" },
      { left: "Norsko", right: "NATO + EHP (bez EU)" },
      { left: "Švýcarsko", right: "Schengen + EHP (bez EU i NATO)" },
    ],
    hints: ["Slovensko přijalo euro v roce 2009."],
  },
  {
    question: "Spoj souseda ČR s jeho ekonomickým charakterem.",
    correctAnswer: "match",
    pairs: [
      { left: "Německo", right: "Největší ekonomika EU — auta, stroje, export" },
      { left: "Polsko", right: "Rychle rostoucí ekonomika — největší v V4" },
      { left: "Slovensko", right: "Výroba aut (VW, Kia), přijalo euro" },
      { left: "Rakousko", right: "Vyspělá ekonomika — turismus, bankovnictví" },
    ],
    hints: ["Německo má největší ekonomiku v EU."],
  },
  {
    question: "Spoj stát s jeho administrativním uspořádáním.",
    correctAnswer: "match",
    pairs: [
      { left: "Německo", right: "Federativní republika (16 spolkových zemí)" },
      { left: "Francie", right: "Unitární republika (centralizovaná)" },
      { left: "Španělsko", right: "Konstituční monarchie s autonomními regiony" },
      { left: "Velká Británie", right: "Konstituční monarchie (Anglie, Skotsko, Wales, S. Irsko)" },
    ],
    hints: ["Německo má 16 spolkových zemí — federace."],
  },
  {
    question: "Spoj zemi s charakteristickým průmyslem nebo exportem.",
    correctAnswer: "match",
    pairs: [
      { left: "Německo", right: "Automobily (BMW, Mercedes, VW), strojírenství" },
      { left: "Francie", right: "Letadla (Airbus), luxusní zboží, vína" },
      { left: "Norsko", right: "Ropa, rybolov, lodní průmysl" },
      { left: "Itálie", right: "Móda, design, turismus, auta (Ferrari, Fiat)" },
    ],
    hints: ["Německo je známé výrobou aut."],
  },
  {
    question: "Spoj stát s jeho hlavním městem.",
    correctAnswer: "match",
    pairs: [
      { left: "Maďarsko", right: "Budapešť" },
      { left: "Rumunsko", right: "Bukurešť" },
      { left: "Bulharsko", right: "Sofie" },
      { left: "Chorvatsko", right: "Záhřeb" },
    ],
    hints: ["Budapešť leží na Dunaji."],
  },
  {
    question: "Spoj zemi s jazykovou skupinou nebo rodinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Česko, Slovensko, Polsko", right: "Slovanské jazyky" },
      { left: "Německo, Rakousko, Švýcarsko (část)", right: "Germánské jazyky" },
      { left: "Francie, Španělsko, Itálie", right: "Románské jazyky" },
      { left: "Finsko, Maďarsko, Estonsko", right: "Ugrofinské jazyky" },
    ],
    hints: ["Čeština, slovenština a polština jsou slovanské jazyky."],
  },
  {
    question: "Spoj zemi s faktickým vstupem do EU.",
    correctAnswer: "match",
    pairs: [
      { left: "Německo, Francie, Itálie", right: "Zakladatelé EHS 1957 (EU od 1993)" },
      { left: "Velká Británie, Irsko, Dánsko", right: "Vstoupily v roce 1973" },
      { left: "ČR, Slovensko, Polsko, Maďarsko", right: "Vstoupily 1. 5. 2004" },
      { left: "Chorvatsko", right: "Vstoupilo v roce 2013" },
    ],
    hints: ["ČR vstoupila do EU v roce 2004."],
  },
  {
    question: "Spoj zemi s jejím sousedem na západ nebo východ.",
    correctAnswer: "match",
    pairs: [
      { left: "Česká republika (západ)", right: "Německo" },
      { left: "Česká republika (východ)", right: "Slovensko" },
      { left: "Rakousko (východ)", right: "Maďarsko" },
      { left: "Slovensko (východ)", right: "Ukrajina" },
    ],
    hints: ["Na západ od ČR leží Německo."],
  },
  {
    question: "Spoj zemi s Visegrádskou skupinou nebo jiným sdružením.",
    correctAnswer: "match",
    pairs: [
      { left: "V4 (Visegrád)", right: "ČR, Slovensko, Polsko, Maďarsko" },
      { left: "Benelux", right: "Belgie, Holandsko, Lucembursko" },
      { left: "Baltské státy", right: "Estonsko, Lotyšsko, Litva" },
      { left: "Skandinávie", right: "Dánsko, Norsko, Švédsko" },
    ],
    hints: ["V4 tvoří čtyři středoevropské státy."],
  },
];

// Level 3 – pokročilé páry
const POOL_L3: PracticeTask[] = [
  {
    question: "Spoj stát s jeho hlavním městem (méně známé).",
    correctAnswer: "match",
    pairs: [
      { left: "Lucembursko", right: "Lucemburk" },
      { left: "Lichtenštejnsko", right: "Vaduz" },
      { left: "Andorra", right: "Andorra la Vella" },
      { left: "San Marino", right: "San Marino (město)" },
    ],
    hints: ["Lucemburk je hlavní město Lucemburska."],
  },
  {
    question: "Spoj stát s důvodem, proč není nebo přestal být v EU.",
    correctAnswer: "match",
    pairs: [
      { left: "Norsko", right: "Referendum odmítlo EU (1972, 1994)" },
      { left: "Švýcarsko", right: "Neutralita a referendum — EU odmítnuto" },
      { left: "Velká Británie", right: "Brexit — odchod 2020 po referendu 2016" },
      { left: "Turecko", right: "Kandidát, ale jednání zamrzla" },
    ],
    hints: ["Velká Británie odešla z EU v roce 2020 (Brexit)."],
  },
  {
    question: "Spoj organizaci s jejím cílem nebo oblastí působení.",
    correctAnswer: "match",
    pairs: [
      { left: "NATO", right: "Vojenská obranná aliance" },
      { left: "EU", right: "Hospodářská, politická a právní unie" },
      { left: "OSN", right: "Světová organizace — mír a bezpečnost" },
      { left: "OECD", right: "Organizace ekonomické spolupráce a rozvoje" },
    ],
    hints: ["NATO je vojenská aliance."],
  },
  {
    question: "Spoj stát s jeho neobvyklou geografickou charakteristikou.",
    correctAnswer: "match",
    pairs: [
      { left: "Vatikán", right: "Nejmenší stát světa — uvnitř Říma" },
      { left: "Monaco", right: "Druhý nejmenší stát (2 km²) na Rivieře" },
      { left: "Lichtenštejnsko", right: "Jediný stát obklopený dvěma vnitrozemskými státy" },
      { left: "Island", right: "Největší ostrov Evropy — vulkanická aktivita" },
    ],
    hints: ["Vatikán je nejmenší stát světa."],
  },
  {
    question: "Spoj stát s jeho vstupem do eurozóny.",
    correctAnswer: "match",
    pairs: [
      { left: "Německo, Francie, Itálie", right: "Euro zavedeno v roce 2002" },
      { left: "Slovensko", right: "Euro od 2009" },
      { left: "Chorvatsko", right: "Euro od 2023" },
      { left: "Česká republika", right: "Euro zatím nepřijato" },
    ],
    hints: ["Slovensko přijalo euro v roce 2009."],
  },
  {
    question: "Spoj stát s ekonomickým ukazatelem nebo charakteristikou.",
    correctAnswer: "match",
    pairs: [
      { left: "Lucembursko", right: "Nejvyšší HDP/obyvatele v EU" },
      { left: "Německo", right: "Největší ekonomika v EU" },
      { left: "Norsko", right: "Ropný fond — jeden z největších na světě" },
      { left: "Bulharsko", right: "Nejnižší HDP/obyvatele v EU" },
    ],
    hints: ["Lucembursko má nejvyšší HDP na obyvatele."],
  },
  {
    question: "Spoj stát s horami nebo pohořím na jeho území.",
    correctAnswer: "match",
    pairs: [
      { left: "Česká republika", right: "Krkonoše, Šumava, Jeseníky" },
      { left: "Slovensko", right: "Tatry, Fatra, Karpaty" },
      { left: "Švýcarsko", right: "Alpy (centrální pohoří státu)" },
      { left: "Španělsko", right: "Pyreneje, Sierra Nevada" },
    ],
    hints: ["Krkonoše jsou nejvyšší pohoří v ČR."],
  },
  {
    question: "Spoj stát s počtem obyvatel v Evropě.",
    correctAnswer: "match",
    pairs: [
      { left: "Rusko (část v Evropě)", right: "Největší stát a populace" },
      { left: "Německo", right: "~84 mil. — největší v EU" },
      { left: "Lucembursko", right: "~660 tisíc — nejmenší v EU (bez ostrovních)" },
      { left: "Vatikán", right: "~800 obyvatel — nejmenší stát světa" },
    ],
    hints: ["Vatikán má jen asi 800 obyvatel."],
  },
  {
    question: "Spoj stát s jeho Schengenským statusem.",
    correctAnswer: "match",
    pairs: [
      { left: "Norsko", right: "V Schengenu, ale ne v EU" },
      { left: "Irsko", right: "V EU, ale mimo Schengen" },
      { left: "Česká republika", right: "V EU i Schengenu (od 2007)" },
      { left: "Velká Británie", right: "Mimo EU i Schengen (od Brexitu)" },
    ],
    hints: ["Irsko je v EU, ale ne v Schengenu."],
  },
  {
    question: "Spoj stát s jeho jazykovým charakterem.",
    correctAnswer: "match",
    pairs: [
      { left: "Belgie", right: "Tři jazyky — francouzština, němčina, vlámština" },
      { left: "Švýcarsko", right: "Čtyři jazyky — němčina, francouzština, italština, rétorománština" },
      { left: "Finsko", right: "Dva jazyky — finština a švédština" },
      { left: "Lucembursko", right: "Tři jazyky — lucemburština, francouzština, němčina" },
    ],
    hints: ["Švýcarsko má čtyři úřední jazyky."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const EVROPSKESTATYAEUSOUSEDNIZEMECRPODROBNE: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne",
    rvpNodeId: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne",
    title: "Evropské státy a EU, sousední země ČR podrobně",
    studentTitle: "Sousedé ČR a EU",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Evropa a svět",
    briefDescription: "Poznáš sousedy Česka a jak funguje Evropská unie.",
    keywords: ["sousedé čr", "německo", "polsko", "slovensko", "rakousko", "eu", "vatikán", "monaco"],
    goals: [
      "Žák jmenuje 4 sousední státy ČR a jejich polohu",
      "Žák uvede základní fakta o EU (27 členů, Brusel)",
      "Žák porovná sousedy ČR podle populace",
    ],
    boundaries: ["Detailní ekonomická statistika", "Politická geografie celé Evropy"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "ČR má 4 sousedy: Německo (Z), Polsko (S), Slovensko (V), Rakousko (J).",
      steps: [
        "Západ: Německo (~84 mil.)",
        "Sever: Polsko (~37 mil.)",
        "Východ: Slovensko (~5,5 mil.)",
        "Jih: Rakousko (~9 mil.)",
        "EU: 27 zemí, sídlo v Bruselu",
      ],
      commonMistake: "Záměna polohy Polska (sever) a Slovenska (východ).",
      example: "Německo je největší soused ČR — přibližně 84 milionů obyvatel.",
    },
  },
];
