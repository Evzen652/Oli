import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PoolItem {
  question: string;
  correct: string;
  distractors: string[];
  emoji: string;
  hint: string;
  solution: string;
}

const POOL: PoolItem[] = [
  { question: "Jaké je tísňové číslo záchranné služby?", correct: "155", distractors: ["150", "158"], emoji: "🚑", hint: "Záchranáři přijíždějí sanitkou a pomáhají zraněným nebo nemocným — na jaké číslo je voláme?", solution: "Záchranná služba má číslo 155 — voláme ho, když někdo potřebuje zdravotní pomoc." },
  { question: "Jaké je tísňové číslo hasičů?", correct: "150", distractors: ["155", "158"], emoji: "🚒", hint: "Hasiči hasí požáry — na jaké číslo voláme?", solution: "Hasiči mají číslo 150 — voláme ho, když hoří nebo hrozí jiné nebezpečí." },
  { question: "Jaké je tísňové číslo policie?", correct: "158", distractors: ["150", "155"], emoji: "👮", hint: "Policie chrání lidi a řeší krádeže a nehody — na jaké číslo voláme?", solution: "Policie má číslo 158 — voláme ho, když potřebujeme policejní pomoc." },
  { question: "Jaké je tísňové číslo platné v celé Evropě?", correct: "112", distractors: ["155", "150"], emoji: "📞", hint: "Jedno číslo funguje v celé Evropě — je to 112 nebo 155?", solution: "Tísňové číslo platné v celé Evropě je 112 — funguje ve všech zemích EU." },
  { question: "Co dáme na ránu nebo odřeninu?", correct: "Náplast", distractors: ["Bonbon", "Hračka"], emoji: "🩹", hint: "Malá rána nebo odřenina se ošetří — co na ni přiložíme?", solution: "Na ránu dáme náplast — chrání ji před nečistotou a pomáhá hojení." },
  { question: "Koho voláme, když hoří?", correct: "Hasiče", distractors: ["Pekaře", "Učitele"], emoji: "🚒", hint: "Oheň je nebezpečný — kdo ho hasí a koho zavoláme?", solution: "Když hoří, voláme hasiče — přijedou a oheň uhasí." },
  { question: "Koho voláme při úrazu?", correct: "Záchranku", distractors: ["Pošťáka", "Kuchaře"], emoji: "🚑", hint: "Když se někdo zraní, potřebuje zdravotní pomoc — koho zavoláme?", solution: "Při úrazu voláme záchranku — přijedou záchranáři a ošetří zraněného." },
  { question: "Čím umyjeme ranku?", correct: "Voda", distractors: ["Bláto", "Písek"], emoji: "💧", hint: "Ranku je potřeba vyčistit od nečistot — čím to uděláme?", solution: "Ranku umyjeme vodou — smyjeme nečistoty, aby se ranka hojila správně." },
  { question: "Koho zavoláme, když jsme malí a stane se úraz?", correct: "Rodiče", distractors: ["Nikoho", "Hračku"], emoji: "👪", hint: "Malé děti potřebují při úrazu pomoc dospělého — koho zavolají?", solution: "Při úrazu zavoláme rodiče nebo jiného dospělého — oni nám pomohou nebo zavolají záchranku." },
  { question: "Co uděláme s krvácející ránou?", correct: "Zatlačíme", distractors: ["Necháme", "Špiníme"], emoji: "🩹", hint: "Krvácení zastavíme přitlačením — co uděláme s ránou?", solution: "Krvácející ránu zatlačíme — přiložíme čistý kapesník nebo obvaz a přitlačíme." },
  { question: "Koho voláme při krádeži?", correct: "Policii", distractors: ["Pekaře", "Hasiče"], emoji: "👮", hint: "Krádež je trestný čin — kdo ho řeší?", solution: "Při krádeži voláme policii — ta krádeže vyšetřuje." },
  { question: "Co záchranné službě řekneme jako první?", correct: "Co se stalo", distractors: ["Vtip", "Píseň"], emoji: "📞", hint: "Záchranář potřebuje vědět, proč voláme — co mu nejdřív řekneme?", solution: "Záchranné službě nejprve řekneme, co se stalo — kde jsme a co se přihodilo." },
  { question: "Co dáme na bouli od nárazu?", correct: "Led", distractors: ["Horkou vodu", "Bonbon"], emoji: "🧊", hint: "Boule od nárazu bolí a otéká — co přiložíme, aby se zmenšila?", solution: "Na bouli dáme led — chlad zmírňuje otok a bolest." },
  { question: "Komu řekneme, že nás něco bolí?", correct: "Dospělému", distractors: ["Nikomu", "Hračce"], emoji: "🧑", hint: "Když nás bolí nebo jsme zranění, potřebujeme pomoc — komu to řekneme?", solution: "Když nás něco bolí, řekneme to dospělému — rodičům nebo učiteli, kteří nám pomohou." },
  { question: "Kde nám ošetří velkou ránu?", correct: "Nemocnice", distractors: ["Obchod", "Hřiště"], emoji: "🏥", hint: "Malá rána = náplast doma, velká rána potřebuje lékaře — kam jdeme?", solution: "Velkou ránu ošetří v nemocnici — tam je vybavení a lékaři pro vážnější zranění." },
  { question: "Co potřebujeme na odřené koleno?", correct: "Náplast", distractors: ["Sníh", "Kámen"], emoji: "🩹", hint: "Odřenina na koleni krvácí — co na ni přiložíme?", solution: "Na odřené koleno dáme náplast — nejprve umyjeme ránu a pak ji překryjeme." },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: [item.hint],
      solutionSteps: [item.solution],
    };
  });
}

export const DROBNAPORANENITISNOVELINKY: TopicMetadata[] = [
  {
    id: "g2-prv-prvni-pomoc",
    rvpNodeId: "g2-prvouka-clovek-a-jeho-zdravi-prevence-a-prvni-pomoc-drobna-poraneni-privolani-pomoci-tisnove-linky",
    title: "Drobná poranění, přivolání pomoci, tísňové linky",
    studentTitle: "První pomoc",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Prevence a první pomoc",
    briefDescription: "Co dělat při úrazu a kam volat.",
    keywords: ["první pomoc", "úraz", "záchranka", "hasiči", "policie", "tísňová linka"],
    goals: [
      "Znát tísňová čísla: 155, 150, 158, 112.",
      "Vědět, co dělat při drobném úrazu.",
      "Umět přivolat pomoc dospělého.",
    ],
    boundaries: ["Pouze základy.", "Bez složitého ošetřování."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Záchranka 155, hasiči 150, policie 158, tísňové 112.",
      steps: ["Přečti otázku.", "Vzpomeň si na správné číslo nebo pomoc."],
      commonMistake: "Záměna tísňových čísel — záchranka je 155.",
      example: "Když se někdo zraní, voláme záchranku na číslo 155.",
    },
  },
];
