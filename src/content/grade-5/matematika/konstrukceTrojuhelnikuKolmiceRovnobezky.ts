import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: kolmice, rovnoběžky, základní pojmy
const POOL_L1: PracticeTask[] = [
  { question: "Jaký úhel svírají dvě kolmé přímky?", correctAnswer: "90°", options: ["90°", "180°", "45°", "60°"] },
  { question: "Co platí pro rovnoběžné přímky?", correctAnswer: "Nikdy se neprotnou", options: ["Nikdy se neprotnou", "Protnou se v jednom bodě", "Protnou se ve dvou bodech", "Jsou totožné"] },
  { question: "Jsou kolejnice na traťi příkladem rovnoběžek?", correctAnswer: "Ano", options: ["Ano", "Ne", "Záleží na kolejích", "Záleží na vzdálenosti"] },
  { question: "Je roh místnosti příkladem kolmice?", correctAnswer: "Ano", options: ["Ano", "Ne", "Záleží na místnosti", "Pouze přibližně"] },
  { question: "Kolik stupňů má součet všech úhlů v trojúhelníku?", correctAnswer: "180°", options: ["180°", "360°", "90°", "270°"] },
  { question: "Kolmice na přímku svírá úhel:", correctAnswer: "90°", options: ["90°", "45°", "60°", "120°"] },
  { question: "Co jsou rovnoběžky?", correctAnswer: "Přímky, které jsou stále stejně daleko od sebe", options: ["Přímky, které jsou stále stejně daleko od sebe", "Přímky, které se kříží", "Přímky, které tvoří úhel 90°", "Přímky, které se dotýkají"] },
  { question: "Kolmo znamená:", correctAnswer: "Pod úhlem přesně 90°", options: ["Pod úhlem přesně 90°", "Pod libovolným úhlem", "Pod úhlem 45°", "Rovnoběžně"] },
  { question: "Má čtverec rovnoběžné strany?", correctAnswer: "Ano – 2 páry rovnoběžných stran", options: ["Ano (2 páry rovnoběžných stran)", "Ne", "Jen jeden pár", "Záleží na velikosti"] },
  { question: "Má čtverec kolmé strany?", correctAnswer: "Ano – všechny sousední strany jsou kolmé", options: ["Ano (všechny sousední strany jsou kolmé)", "Ne", "Jen některé", "Záleží na velikosti"] },
  { question: "Jsou horizontální a vertikální čáry kolmé?", correctAnswer: "Ano", options: ["Ano", "Ne", "Záleží", "Přibližně"] },
  { question: "Jaký symbol používáme pro kolmice?", correctAnswer: "⊥", options: ["⊥", "∥", "≈", "≡"] },
  { question: "Jaký symbol používáme pro rovnoběžky?", correctAnswer: "∥", options: ["∥", "⊥", "≈", "≡"] },
  { question: "Mohou být tři přímky všechny navzájem rovnoběžné?", correctAnswer: "Ano", options: ["Ano", "Ne", "Záleží na délce", "Jen dvě z nich"] },
  { question: "Jsou protilehlé strany obdélníku rovnoběžné?", correctAnswer: "Ano", options: ["Ano", "Ne", "Záleží na obdélníku", "Jen delší strany"] },
  { question: "Které přímky jsou rovnoběžné: silnice A → B a silnice C → D (jdou stejným směrem, nikdy se nekříží)?", correctAnswer: "Jsou rovnoběžné", options: ["Jsou rovnoběžné", "Jsou kolmé", "Nejsou v žádném vztahu", "Jsou totožné"] },
  { question: "Je možné sestrojit kolmici k dané přímce přes daný bod?", correctAnswer: "Ano, vždy právě jednu", options: ["Ano, vždy právě jednu", "Ne", "Ano, ale jen mimo přímku", "Ano, nekonečně mnoho"] },
  { question: "Jsou strany písmene H rovnoběžné?", correctAnswer: "Ano – dvě svislé čáry", options: ["Ano (dvě svislé čáry)", "Ne", "Záleží na fontu", "Pouze přibližně"] },
];

// Level 2: trojúhelníky — druhy, vlastnosti
const POOL_L2: PracticeTask[] = [
  { question: "Součet úhlů v trojúhelníku je 180°. Dva úhly jsou 60° a 80°. Jaký je třetí úhel?", correctAnswer: "40°", options: ["40°", "50°", "60°", "20°"] },
  { question: "Trojúhelník má úhly 90°, 45°, ?. Jaký je třetí úhel?", correctAnswer: "45°", options: ["45°", "90°", "60°", "30°"] },
  { question: "Trojúhelník se třemi stejně dlouhými stranami se nazývá:", correctAnswer: "rovnostranný", options: ["rovnostranný", "rovnoramenný", "pravoúhlý", "tupoúhlý"] },
  { question: "Trojúhelník se dvěma stejně dlouhými stranami se nazývá:", correctAnswer: "rovnoramenný", options: ["rovnoramenný", "rovnostranný", "pravoúhlý", "tupoúhlý"] },
  { question: "Trojúhelník s jedním pravým úhlem (90°) se nazývá:", correctAnswer: "pravoúhlý", options: ["pravoúhlý", "rovnostranný", "rovnoramenný", "ostroúhlý"] },
  { question: "Trojúhelník s jedním tupým úhlem (větším než 90°) se nazývá:", correctAnswer: "tupoúhlý", options: ["tupoúhlý", "pravoúhlý", "ostroúhlý", "rovnostranný"] },
  { question: "V rovnostranném trojúhelníku jsou všechny úhly stejné. Jaké?", correctAnswer: "60°", options: ["60°", "90°", "45°", "120°"] },
  { question: "Lze sestrojit trojúhelník se stranami 3 cm, 4 cm, 5 cm?", correctAnswer: "Ano – pravoúhlý trojúhelník", options: ["Ano (pravoúhlý trojúhelník)", "Ne", "Jen přibližně", "Záleží na nástroji"] },
  { question: "Lze sestrojit trojúhelník se stranami 1 cm, 2 cm, 10 cm?", correctAnswer: "Ne – součet dvou stran musí být větší než třetí", options: ["Ne (součet dvou stran musí být větší než třetí)", "Ano", "Záleží", "Jen velký"] },
  { question: "Trojúhelník má úhly 50°, 60°, ?.", correctAnswer: "70°", options: ["70°", "60°", "50°", "80°"] },
  { question: "Co je přepona pravoúhlého trojúhelníku?", correctAnswer: "Nejdelší strana – naproti pravému úhlu", options: ["Nejdelší strana (naproti pravému úhlu)", "Nejkratší strana", "Strana u pravého úhlu", "Jakákoliv strana"] },
  { question: "Kolmice z vrcholu trojúhelníku na protilehlou stranu se nazývá:", correctAnswer: "výška trojúhelníku", options: ["výška trojúhelníku", "těžnice", "osa úhlu", "střední příčka"] },
  { question: "Trojúhelník má strany 5 cm, 5 cm, 8 cm. Jaký druh trojúhelníku to je?", correctAnswer: "rovnoramenný", options: ["rovnoramenný", "rovnostranný", "pravoúhlý", "tupoúhlý"] },
  { question: "Největší úhel trojúhelníku leží naproti:", correctAnswer: "nejdelší straně", options: ["nejdelší straně", "nejkratší straně", "střední straně", "Nezáleží"] },
];

// Level 3: kombinace, slovní úlohy
const POOL_L3: PracticeTask[] = [
  { question: "Stavíme plot rovnoběžně se zdí. Zeď jde ze severu na jih. Jak bude plot orientován?", correctAnswer: "Ze severu na jih", options: ["Ze severu na jih", "Ze západu na východ", "Šikmo", "Záleží na vzdálenosti"] },
  { question: "Trojúhelník má úhly v poměru 1:2:3. Jaké jsou to úhly?", correctAnswer: "30°, 60°, 90°", options: ["30°, 60°, 90°", "45°, 90°, 45°", "60°, 60°, 60°", "20°, 40°, 120°"] },
  { question: "Kolik os souměrnosti má rovnostranný trojúhelník?", correctAnswer: "3", options: ["3", "1", "0", "6"] },
  { question: "Kolik os souměrnosti má rovnoramenný trojúhelník (ne rovnostranný)?", correctAnswer: "1", options: ["1", "2", "0", "3"] },
  { question: "Lze sestrojit trojúhelník se dvěma pravými úhly?", correctAnswer: "Ne – součet by byl 180° bez třetího úhlu", options: ["Ne (součet by byl 180° bez třetího úhlu)", "Ano", "Záleží na velikosti", "Jen velký"] },
  { question: "Kolik kolmých stran má pravoúhlý trojúhelník?", correctAnswer: "2 – odvěsny jsou na sebe kolmé", options: ["2 (odvěsny jsou na sebe kolmé)", "1", "3", "0"] },
  { question: "Pomocí pravítka a úhelníku nakreslíme: přímka p, bod A mimo přímku. Kolik kolmic z bodu A na přímku p jde sestrojit?", correctAnswer: "Právě jednu", options: ["Právě jednu", "Dvě", "Žádnou", "Nekonečně mnoho"] },
  { question: "Trojúhelník ABC: úhel A = 70°, úhel B = 60°. Jaký je úhel C?", correctAnswer: "50°", options: ["50°", "60°", "70°", "40°"] },
  { question: "Jsou úhlopříčky čtverce kolmé na sebe?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jen přibližně", "Záleží na velikosti"] },
  { question: "Obdélník má 2 páry stran. Jsou páry rovnoběžné navzájem, nebo na sebe kolmé?", correctAnswer: "Strany jednoho páru jsou rovnoběžné; různé páry jsou na sebe kolmé", options: ["Strany jednoho páru jsou rovnoběžné; různé páry jsou na sebe kolmé", "Všechny strany jsou rovnoběžné", "Všechny strany jsou kolmé", "Záleží na obdélníku"] },
  { question: "Trojúhelník s úhly 90°, 45°, 45° má jaké strany?", correctAnswer: "Dvě odvěsny stejně dlouhé, přepona delší", options: ["Dvě odvěsny stejně dlouhé, přepona delší", "Všechny strany stejně dlouhé", "Přepona nejkratší", "Záleží na velikosti"] },
  { question: "Přímky a ∥ b a přímka c ⊥ a. Je přímka c kolmá i na b?", correctAnswer: "Ano", options: ["Ano", "Ne", "Záleží", "Jen přibližně"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const KONSTRUKCETROJUHELNIKUKOLMICEROVNOBEZKY: TopicMetadata[] = [
  {
    id: "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-konstrukce-trojuhelniku-kolmice-rovnobezky",
    rvpNodeId: "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-konstrukce-trojuhelniku-kolmice-rovnobezky",
    title: "Konstrukce trojúhelníku, kolmice, rovnoběžky",
    studentTitle: "Rýsování a konstrukce",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Konstrukce a obsah",
    briefDescription: "Naučíš se rýsovat kolmice, rovnoběžky a trojúhelníky.",
    keywords: ["kolmice", "rovnoběžky", "trojúhelník", "úhel", "90°", "180°", "konstrukce", "rýsování"],
    goals: [
      "Vysvětlit, co jsou kolmice a rovnoběžky",
      "Znát vlastnosti trojúhelníku (součet úhlů 180°)",
      "Rozlišit druhy trojúhelníků",
      "Sestrojit kolmici a rovnoběžku ke dané přímce",
    ],
    boundaries: ["Bez výpočtu obsahu a obvodu trojúhelníku", "Bez sinus/kosinus"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Kolmice svírají úhel 90°. Rovnoběžky se nikdy neprotnou. Součet úhlů v trojúhelníku = 180°.",
      steps: [
        "Kolmice: použij úhelník (pravý úhel = 90°).",
        "Rovnoběžky: zachovej stejnou vzdálenost od přímky v každém bodě.",
        "Trojúhelník: součet všech tří úhlů je vždy 180°.",
      ],
      commonMistake: "Chyba: záměna kolmice a rovnoběžky. Kolmice = kříží se pod 90°, rovnoběžky = nekříží se nikdy.",
      example: "Trojúhelník s úhly 60° a 80°: třetí úhel = 180° − 60° − 80° = 40°.",
    },
  },
];
