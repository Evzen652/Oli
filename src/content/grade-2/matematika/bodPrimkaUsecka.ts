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
  correct: boolean;
  hint: string;
  solution: string;
}

/**
 * PED-3 kalibrace L1<L2<L3.
 * Před: `gen(_level)` ignoroval level. Teď disjunktní pooly (základ / kombinace
 * s polopřímkou / aplikace a rozšíření).
 */

const POOL_L1: PoolItem[] = [
  // Přímka
  { question: "Přímka nemá konec. Je to pravda?", correct: true, hint: "Přímka = čára, která jde do nekonečna. Má nějaký konec?", solution: "Přímka jde do nekonečna oběma směry — žádný konec nemá. Je to pravda." },
  { question: "Přímka jde oběma směry do nekonečna. Je to pravda?", correct: true, hint: "Přímka nemá žádný konec — kam z ní odejdeme?", solution: "Přímka jde oběma směry do nekonečna. Je to pravda." },
  { question: "Přímka má 2 konce. Je to pravda?", correct: false, hint: "Kdo má 2 konce — přímka nebo úsečka?", solution: "Přímka nemá žádný konec — 2 konce má úsečka. Takže to pravda není." },
  // Úsečka
  { question: "Úsečka má 2 konce. Je to pravda?", correct: true, hint: "Úsečka má pevný začátek a pevný konec — kolik konců?", solution: "Úsečka má pevný začátek i konec — tedy 2 konce. Je to pravda." },
  { question: "Úsečka má konečnou délku. Je to pravda?", correct: true, hint: "Úsečka AB — jde do nekonečna, nebo má pevnou délku?", solution: "Úsečka má pevný začátek i konec, takže má konečnou délku. Je to pravda." },
  { question: "Úsečka nemá žádný konec. Je to pravda?", correct: false, hint: "Kolik konců má úsečka — 0, 1 nebo 2?", solution: "Úsečka má 2 konce (začátek a konec). Takže to pravda není." },
  // Bod
  { question: "Bod je přesné místo v prostoru. Je to pravda?", correct: true, hint: "Bod — co to je? Místo, nebo čára?", solution: "Bod je přesné místo — nemá délku ani šířku. Je to pravda." },
  { question: "Bod označujeme velkým písmenem. Je to pravda?", correct: true, hint: "Jak se označují body v geometrii — velkými nebo malými písmeny?", solution: "Body se označují velkými písmeny, například bod A, bod B. Je to pravda." },
  { question: "Bod má délku i šířku. Je to pravda?", correct: false, hint: "Bod — má délku a šířku, nebo je to jen místo bez rozměrů?", solution: "Bod nemá délku ani šířku — je to přesné místo bez rozměrů. Takže to pravda není." },
];

const POOL_L2: PoolItem[] = [
  // Polopřímka
  { question: "Polopřímka má 1 konec. Je to pravda?", correct: true, hint: "Polopřímka začíná v bodě a jde jedním směrem — kolik konců má?", solution: "Polopřímka začíná v bodě (1 konec) a jde jedním směrem do nekonečna. Je to pravda." },
  { question: "Polopřímka začíná v bodě a jde do nekonečna. Je to pravda?", correct: true, hint: "Polopřímka — kde začíná a kde končí?", solution: "Polopřímka začíná v jednom bodě a jde jedním směrem do nekonečna. Je to pravda." },
  { question: "Polopřímka má 2 konce jako úsečka. Je to pravda?", correct: false, hint: "Polopřímka má 1 nebo 2 konce? A úsečka?", solution: "Polopřímka má jen 1 konec (kde začíná), druhý konec nemá. Takže to pravda není." },
  // Kombinace pojmů
  { question: "Přímka i úsečka jsou rovné čáry. Je to pravda?", correct: true, hint: "Jsou přímka i úsečka rovné, nebo mohou být křivé?", solution: "Přímka i úsečka jsou vždy rovné čáry. Je to pravda." },
  { question: "Úsečka je část přímky. Je to pravda?", correct: true, hint: "Přímka je nekonečná — je úsečka jen kousek z ní?", solution: "Úsečka je kousek přímky s pevným začátkem a koncem. Je to pravda." },
  { question: "Přímka je část úsečky. Je to pravda?", correct: false, hint: "Která z nich je delší — přímka nebo úsečka?", solution: "Naopak — úsečka je část přímky, ne přímka část úsečky. Takže to pravda není." },
  { question: "Úsečka je nekonečně dlouhá. Je to pravda?", correct: false, hint: "Co je nekonečně dlouhé — přímka nebo úsečka?", solution: "Úsečka má pevnou délku — nekonečná je přímka. Takže to pravda není." },
  { question: "Polopřímka je kratší než úsečka. Je to pravda?", correct: false, hint: "Polopřímka jde do nekonečna — je kratší nebo delší než úsečka?", solution: "Polopřímka jde do nekonečna — úsečka je kratší. Takže to pravda není." },
  { question: "Bod leží na přímce. Je to pravda?", correct: true, hint: "Může bod ležet na přímce, nebo ne?", solution: "Bod může ležet kdekoliv — i na přímce. Je to pravda." },
];

const POOL_L3: PoolItem[] = [
  // Aplikace a rozšíření
  { question: "Úsečka AB je stejná jako úsečka BA. Je to pravda?", correct: true, hint: "AB a BA — liší se délkou, nebo jen směrem pojmenování?", solution: "AB i BA pojmenovávají stejnou úsečku — délka je stejná. Je to pravda." },
  { question: "Dvěma různými body vede právě jedna přímka. Je to pravda?", correct: true, hint: "Zkus si to nakreslit — kolik přímek můžeš vést mezi 2 body?", solution: "Dvěma různými body vede právě jedna přímka. Je to pravda." },
  { question: "Mezi dvěma body existuje jen jedna úsečka. Je to pravda?", correct: true, hint: "Úsečka je nejkratší spojnice — kolik jich může být mezi 2 body?", solution: "Mezi dvěma body existuje právě jedna úsečka — nejkratší spojnice. Je to pravda." },
  { question: "Bodů na jedné přímce může být nekonečně mnoho. Je to pravda?", correct: true, hint: "Přímka je nekonečně dlouhá — kolik bodů se na ni vejde?", solution: "Na přímce leží nekonečně mnoho bodů. Je to pravda." },
  { question: "Ze 3 bodů vždy vede jen 1 přímka. Je to pravda?", correct: false, hint: "3 body — leží vždy na jedné přímce?", solution: "3 body nemusí ležet na jedné přímce (např. tvoří trojúhelník). Takže to pravda není." },
  { question: "Bod C leží na úsečce AB. Pak platí |AB| = |AC| + |CB|. Je to pravda?", correct: true, hint: "Když je C mezi A a B, sečti dílčí délky.", solution: "Bod C na úsečce dělí AB na 2 části: AC a CB. Součet je celá AB. Je to pravda." },
  { question: "Bod je nejmenší geometrický útvar. Je to pravda?", correct: true, hint: "Má bod nějakou velikost, délku nebo šířku?", solution: "Bod nemá délku ani šířku — je nejmenším geometrickým útvarem. Je to pravda." },
  { question: "Polopřímka opačná k AB začíná v bodě B. Je to pravda?", correct: false, hint: "Polopřímka AB začíná v A — opačná polopřímka začíná ve stejném bodě A.", solution: "Opačná polopřímka k AB začíná v BODĚ A a jde opačným směrem. Takže to pravda není." },
  { question: "Přímka může být zakřivená. Je to pravda?", correct: false, hint: "Vzpomeň si: přímka je vždy jaká?", solution: "Přímka je vždy rovná — nezakřivená čára. Takže to pravda není." },
  { question: "Úsečka je nejkratší spojnice dvou bodů. Je to pravda?", correct: true, hint: "Jak dostat z jednoho bodu do druhého nejrychleji?", solution: "Nejkratší spojnice dvou bodů je vždy úsečka (rovná čára). Je to pravda." },
];

const ANO = "Ano, to je pravda";
const NE = "Ne, to není pravda";

function pick(pool: PoolItem[]): PracticeTask[] {
  return shuffle(pool).map((item) => ({
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    hints: [item.hint],
    solutionSteps: [item.solution],
  }));
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
}

export const BODPRIMKAUSECKA: TopicMetadata[] = [
  {
    id: "g2-mat-bod-primka-usecka",
    rvpNodeId:
      "g2-matematika-geometrie-v-rovine-a-v-prostoru-body-primky-usecky-bod-primka-poloprimka-usecka",
    title: "Bod, přímka, polopřímka, úsečka",
    studentTitle: "Body a čáry",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Body, přímky, úsečky",
    briefDescription: "Poznáš rozdíl mezi přímkou, úsečkou a bodem.",
    keywords: ["bod", "přímka", "úsečka", "polopřímka", "geometrie"],
    goals: [
      "Rozlišit bod, přímku, polopřímku a úsečku.",
      "Vědět, že přímka nemá konec a úsečka má 2 konce.",
      "Pochopit, že polopřímka má 1 konec.",
    ],
    boundaries: ["Pouze definice a vlastnosti.", "Bez rýsování."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Přímka = nekonečná. Úsečka = 2 konce. Polopřímka = 1 konec.",
      steps: [
        "Přímka jde do nekonečna oběma směry.",
        "Úsečka má pevný začátek i konec (2 body).",
        "Polopřímka začíná v bodě a jde jedním směrem do nekonečna.",
      ],
      commonMistake: "Záměna přímky a úsečky — přímka NEMÁ konce, úsečka MÁ 2 konce.",
      example: "Silnice na mapě = úsečka (má začátek a konec). Světelný paprsek = polopřímka.",
    },
  },
];
