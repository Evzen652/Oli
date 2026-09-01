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
  { question: "Co platí pro rovnoběžné přímky?", correctAnswer: "Nikdy se neprotnou", options: ["Protnou se v jednom bodě", "Nikdy se neprotnou", "Protnou se ve dvou bodech", "Jsou totožné"] },
  { question: "Jsou kolejnice na traťi příkladem rovnoběžek?", correctAnswer: "Ano", options: ["Ne", "Záleží na kolejích", "Ano", "Záleží na vzdálenosti"] },
  { question: "Je roh místnosti příkladem kolmice?", correctAnswer: "Ano", options: ["Ne", "Záleží na místnosti", "Pouze přibližně", "Ano"] },
  { question: "Kolik stupňů má součet všech úhlů v trojúhelníku?", correctAnswer: "180°", options: ["180°", "360°", "90°", "270°"] },
  { question: "Kolmice na přímku svírá úhel:", correctAnswer: "90°", options: ["45°", "90°", "60°", "120°"] },
  { question: "Co jsou rovnoběžky?", correctAnswer: "Přímky, které jsou stále stejně daleko od sebe", options: ["Přímky, které se kříží", "Přímky, které tvoří úhel 90°", "Přímky, které jsou stále stejně daleko od sebe", "Přímky, které se dotýkají"] },
  { question: "Kolmo znamená:", correctAnswer: "Pod úhlem přesně 90°", options: ["Pod libovolným úhlem", "Pod úhlem 45°", "Rovnoběžně", "Pod úhlem přesně 90°"] },
  { question: "Má čtverec rovnoběžné strany?", correctAnswer: "Ano – 2 páry rovnoběžných stran", options: ["Ano – 2 páry rovnoběžných stran", "Ne", "Jen jeden pár", "Záleží na velikosti"] },
  { question: "Má čtverec kolmé strany?", correctAnswer: "Ano", options: ["Ne", "Ano", "Jen některé", "Záleží na velikosti"], explanation: "Sousední strany čtverce svírají pravý úhel, takže jsou na sebe kolmé." },
  { question: "Jsou horizontální a vertikální čáry kolmé?", correctAnswer: "Ano", options: ["Ne", "Záleží", "Ano", "Přibližně"] },
  { question: "Jaký symbol používáme pro kolmice?", correctAnswer: "⊥", options: ["∥", "≈", "≡", "⊥"] },
  { question: "Jaký symbol používáme pro rovnoběžky?", correctAnswer: "∥", options: ["∥", "⊥", "≈", "≡"] },
  { question: "Mohou být tři přímky všechny navzájem rovnoběžné?", correctAnswer: "Ano", options: ["Ne", "Ano", "Záleží na délce", "Jen dvě z nich"] },
  { question: "Jsou protilehlé strany obdélníku rovnoběžné?", correctAnswer: "Ano", options: ["Ne", "Záleží na obdélníku", "Ano", "Jen delší strany"] },
  { question: "Které přímky jsou rovnoběžné: silnice A → B a silnice C → D (jdou stejným směrem, nikdy se nekříží)?", correctAnswer: "Jsou rovnoběžné", options: ["Jsou kolmé", "Nejsou v žádném vztahu", "Jsou totožné", "Jsou rovnoběžné"] },
  { question: "Je možné sestrojit kolmici k dané přímce přes daný bod?", correctAnswer: "Ano, vždy právě jednu", options: ["Ano, vždy právě jednu", "Ne", "Ano, ale jen mimo přímku", "Ano, nekonečně mnoho"] },
  { question: "Jsou strany písmene H rovnoběžné?", correctAnswer: "Ano – dvě svislé čáry", options: ["Ne", "Ano – dvě svislé čáry", "Záleží na fontu", "Pouze přibližně"] },
];

// Level 2: trojúhelníky — druhy, vlastnosti
const POOL_L2: PracticeTask[] = [
  { question: "Součet úhlů v trojúhelníku je 180°. Dva úhly jsou 60° a 80°. Jaký je třetí úhel?", correctAnswer: "40°", options: ["50°", "60°", "40°", "20°"] },
  { question: "Trojúhelník má úhly 90°, 45°, ?. Jaký je třetí úhel?", correctAnswer: "45°", options: ["90°", "60°", "30°", "45°"] },
  { question: "Trojúhelník se třemi stejně dlouhými stranami se nazývá:", correctAnswer: "rovnostranný", options: ["rovnostranný", "rovnoramenný", "pravoúhlý", "tupoúhlý"] },
  { question: "Trojúhelník se dvěma stejně dlouhými stranami se nazývá:", correctAnswer: "rovnoramenný", options: ["rovnostranný", "rovnoramenný", "pravoúhlý", "tupoúhlý"] },
  { question: "Trojúhelník s jedním pravým úhlem (90°) se nazývá:", correctAnswer: "pravoúhlý", options: ["rovnostranný", "rovnoramenný", "pravoúhlý", "ostroúhlý"] },
  { question: "Trojúhelník s jedním tupým úhlem (větším než 90°) se nazývá:", correctAnswer: "tupoúhlý", options: ["pravoúhlý", "ostroúhlý", "rovnostranný", "tupoúhlý"] },
  { question: "V rovnostranném trojúhelníku jsou všechny úhly stejné. Jaké?", correctAnswer: "60°", options: ["60°", "90°", "45°", "120°"] },
  { question: "Lze sestrojit trojúhelník se stranami 3 cm, 4 cm, 5 cm?", correctAnswer: "Ano – pravoúhlý trojúhelník", options: ["Ne", "Ano – pravoúhlý trojúhelník", "Jen přibližně", "Záleží na nástroji"] },
  { question: "Lze sestrojit trojúhelník se stranami 1 cm, 2 cm, 10 cm?", correctAnswer: "Ne", options: ["Ano", "Záleží", "Ne", "Jen velký"], explanation: "Součet dvou kratších stran musí být větší než třetí. Tady 1 + 2 = 3, a to je méně než 10." },
  { question: "Trojúhelník má úhly 50°, 60°, ?.", correctAnswer: "70°", options: ["60°", "50°", "80°", "70°"] },
  { question: "Co je přepona pravoúhlého trojúhelníku?", correctAnswer: "Nejdelší strana – naproti pravému úhlu", options: ["Nejdelší strana – naproti pravému úhlu", "Nejkratší strana", "Strana u pravého úhlu", "Jakákoliv strana"] },
  { question: "Kolmice z vrcholu trojúhelníku na protilehlou stranu se nazývá:", correctAnswer: "výška trojúhelníku", options: ["těžnice", "výška trojúhelníku", "osa úhlu", "střední příčka"] },
  { question: "Trojúhelník má strany 5 cm, 5 cm, 8 cm. Jaký druh trojúhelníku to je?", correctAnswer: "rovnoramenný", options: ["rovnostranný", "pravoúhlý", "rovnoramenný", "tupoúhlý"] },
  { question: "Největší úhel trojúhelníku leží naproti:", correctAnswer: "nejdelší straně", options: ["nejkratší straně", "střední straně", "Nezáleží", "nejdelší straně"] },
];

// Level 3: kombinace, slovní úlohy
const POOL_L3: PracticeTask[] = [
  { question: "Stavíme plot rovnoběžně se zdí. Zeď jde ze severu na jih. Jak bude plot orientován?", correctAnswer: "Ze severu na jih", options: ["Ze severu na jih", "Ze západu na východ", "Šikmo", "Záleží na vzdálenosti"] },
  { question: "Trojúhelník má úhly v poměru 1:2:3. Jaké jsou to úhly?", correctAnswer: "30°, 60°, 90°", options: ["45°, 90°, 45°", "30°, 60°, 90°", "60°, 60°, 60°", "20°, 40°, 120°"] },
  { question: "Kolik os souměrnosti má rovnostranný trojúhelník?", correctAnswer: "3", options: ["1", "0", "3", "6"] },
  { question: "Kolik os souměrnosti má rovnoramenný trojúhelník (ne rovnostranný)?", correctAnswer: "1", options: ["2", "0", "3", "1"] },
  { question: "Lze sestrojit trojúhelník se dvěma pravými úhly?", correctAnswer: "Ne", options: ["Ne", "Ano", "Záleží na velikosti", "Jen velký"], explanation: "Dva pravé úhly dají dohromady 180°, takže na třetí úhel už nic nezbývá." },
  { question: "Kolik kolmých stran má pravoúhlý trojúhelník?", correctAnswer: "2", options: ["1", "2", "3", "0"], explanation: "Odvěsny svírají pravý úhel. Přepona na žádnou stranu kolmá není." },
  { question: "Pomocí pravítka a úhelníku nakreslíme: přímka p, bod A mimo přímku. Kolik kolmic z bodu A na přímku p jde sestrojit?", correctAnswer: "Právě jednu", options: ["Dvě", "Žádnou", "Právě jednu", "Nekonečně mnoho"] },
  { question: "Trojúhelník ABC: úhel A = 70°, úhel B = 60°. Jaký je úhel C?", correctAnswer: "50°", options: ["60°", "70°", "40°", "50°"] },
  { question: "Jsou úhlopříčky čtverce kolmé na sebe?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jen přibližně", "Záleží na velikosti"] },
  { question: "Obdélník má 2 páry stran. Jsou páry rovnoběžné navzájem, nebo na sebe kolmé?", correctAnswer: "Strany jednoho páru jsou rovnoběžné; různé páry jsou na sebe kolmé", options: ["Všechny čtyři strany jsou navzájem rovnoběžné", "Strany jednoho páru jsou rovnoběžné; různé páry jsou na sebe kolmé", "Všechny čtyři strany jsou na sebe kolmé", "Záleží na tom, jak je obdélník velký"] },
  { question: "Trojúhelník s úhly 90°, 45°, 45° má jaké strany?", correctAnswer: "Dvě odvěsny stejně dlouhé, přepona delší", options: ["Všechny strany stejně dlouhé", "Přepona nejkratší", "Dvě odvěsny stejně dlouhé, přepona delší", "Záleží na velikosti"] },
  { question: "Přímky a ∥ b a přímka c ⊥ a. Je přímka c kolmá i na b?", correctAnswer: "Ano", options: ["Ne", "Záleží", "Jen přibližně", "Ano"] },
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
