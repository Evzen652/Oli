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
  correct: number;
  hint: string;
  solution: string;
}

/**
 * PED-3 kalibrace L1<L2<L3.
 * Před: gen(_level) ignoroval úroveň, audit `20/0/0 max L1`.
 * Teď disjunktní: L1 (jednokrok, čísla do 30), L2 (jednokrok, čísla 30–100),
 * L3 (dvoukrok — 2 operace za sebou).
 */

const POOL_L1: PoolItem[] = [
  { question: "Máš 20 Kč. Koupíš žvýkačky za 8 Kč. Kolik ti zbyde?", correct: 12, hint: "Koupíš za 8 Kč — to odejde. Co zbyde z 20?", solution: "20 − 8 = 12 Kč ti zbyde." },
  { question: "Hodíš kostkou číslo 4 a číslo 6. Kolik bodů máš celkem?", correct: 10, hint: "Hod 4 a hod 6 — dej je dohromady.", solution: "4 + 6 = 10 bodů celkem." },
  { question: "Na stromě sedí 15 ptáků. 7 jich odletí. Kolik ptáků zbyde?", correct: 8, hint: "Bylo 15 ptáků a 7 odletí — to ubyde.", solution: "15 − 7 = 8 ptáků zbyde." },
  { question: "V zahradě je 18 květin. 6 jich uschne. Kolik květin zbyde?", correct: 12, hint: "Bylo 18 květin a 6 uschne — to ubyde.", solution: "18 − 6 = 12 květin zbyde." },
  { question: "Na větvi sedí 12 ptáků. Přiletí 5 dalších. Kolik ptáků je celkem?", correct: 17, hint: "Je 12 ptáků a přiletí 5. Kolik je 12 + 5?", solution: "12 + 5 = 17 ptáků celkem." },
  { question: "V lese je 24 stromů. Přibyde 8 nových stromů. Kolik jich je celkem?", correct: 32, hint: "Je 24 a přibyde 8.", solution: "24 + 8 = 32 stromů celkem." },
  { question: "Máš 17 kartiček. Vyhraješ 8 kartiček. Kolik jich máš celkem?", correct: 25, hint: "17 a 8 dej dohromady.", solution: "17 + 8 = 25 kartiček celkem." },
  { question: "Máš 20 kartiček. Prohraješ 7 kartiček. Kolik ti zbyde?", correct: 13, hint: "20 − 7 = ?", solution: "20 − 7 = 13 kartiček ti zbyde." },
  { question: "Je 24 jablek. Sníš 9 jablek. Kolik jablek zbyde?", correct: 15, hint: "24 − 9 = ?", solution: "24 − 9 = 15 jablek zbyde." },
  { question: "Je 16 rohlíků. Přijde 7 nových rohlíků. Kolik jich je celkem?", correct: 23, hint: "16 + 7 = ?", solution: "16 + 7 = 23 rohlíků celkem." },
];

const POOL_L2: PoolItem[] = [
  { question: "Máš 35 Kč. Koupíš bonbóny za 12 Kč. Kolik ti zbyde?", correct: 23, hint: "35 − 12 = ?", solution: "35 − 12 = 23 Kč ti zbyde." },
  { question: "Máš 50 Kč. Koupíš čokoládu za 27 Kč. Kolik ti zbyde?", correct: 23, hint: "50 − 27 = ?", solution: "50 − 27 = 23 Kč ti zbyde." },
  { question: "Máš 40 Kč. Koupíš knížku za 15 Kč. Kolik ti zbyde?", correct: 25, hint: "40 − 15 = ?", solution: "40 − 15 = 25 Kč ti zbyde." },
  { question: "Máš 60 Kč. Koupíš hračku za 34 Kč. Kolik ti zbyde?", correct: 26, hint: "60 − 34 = ?", solution: "60 − 34 = 26 Kč ti zbyde." },
  { question: "Máš 45 Kč a dostaneš od babičky 10 Kč. Kolik máš celkem?", correct: 55, hint: "45 + 10 = ?", solution: "45 + 10 = 55 Kč máš celkem." },
  { question: "Máš 30 Kč a dostaneš od táty 25 Kč. Kolik máš celkem?", correct: 55, hint: "30 + 25 = ?", solution: "30 + 25 = 55 Kč máš celkem." },
  { question: "V řece je 30 ryb. Připluje 14 dalších ryb. Kolik jich je celkem?", correct: 44, hint: "30 + 14 = ?", solution: "30 + 14 = 44 ryb celkem." },
  { question: "Na louce je 25 motýlů. Odletí 9 motýlů. Kolik jich zbyde?", correct: 16, hint: "25 − 9 = ?", solution: "25 − 9 = 16 motýlů zbyde." },
  { question: "Máš 50 bodů. Ztratíš 18 bodů. Kolik bodů ti zbyde?", correct: 32, hint: "50 − 18 = ?", solution: "50 − 18 = 32 bodů ti zbyde." },
  { question: "Máš 15 bodů a vyhraješ 23 bodů navíc. Kolik bodů máš celkem?", correct: 38, hint: "15 + 23 = ?", solution: "15 + 23 = 38 bodů celkem." },
  { question: "Je 30 bonbónů. Dáš 12 bonbónů kamarádovi. Kolik ti zbyde?", correct: 18, hint: "30 − 12 = ?", solution: "30 − 12 = 18 bonbónů zbyde." },
  { question: "Je 45 jahod. Sníš 17 jahod. Kolik jahod zbyde?", correct: 28, hint: "45 − 17 = ?", solution: "45 − 17 = 28 jahod zbyde." },
  { question: "Je 20 sušenek. Přibyde 15 nových. Kolik jich je celkem?", correct: 35, hint: "20 + 15 = ?", solution: "20 + 15 = 35 sušenek celkem." },
  { question: "V knihovně je 33 knih. Přibyde 7 nových knih. Kolik knih je celkem?", correct: 40, hint: "33 + 7 = ?", solution: "33 + 7 = 40 knih celkem." },
  { question: "Autobus má 40 míst. Sedí 27 cestujících. Kolik míst je volných?", correct: 13, hint: "40 − 27 = ?", solution: "40 − 27 = 13 míst je volných." },
  { question: "Na zastávce čeká 8 lidí. Přijde 14 dalších lidí. Kolik lidí čeká celkem?", correct: 22, hint: "8 + 14 = ?", solution: "8 + 14 = 22 lidí čeká celkem." },
  { question: "Ujedeš 56 km. Pak jedeš dalších 18 km. Kolik km ujedeš celkem?", correct: 74, hint: "56 + 18 = ?", solution: "56 + 18 = 74 km celkem." },
  { question: "Do cíle zbývá 63 km. Ujedeš 27 km. Kolik km ještě zbývá?", correct: 36, hint: "63 − 27 = ?", solution: "63 − 27 = 36 km zbývá." },
];

const POOL_L3: PoolItem[] = [
  // Dvoukrokové úlohy
  { question: "Máš 50 Kč. Koupíš svačinu za 18 Kč a pití za 12 Kč. Kolik ti zbyde?", correct: 20, hint: "Nejdřív spočítej, kolik utratíš celkem: 18 + 12. Pak odečti od 50.", solution: "Utratíš 18 + 12 = 30 Kč. Zbyde: 50 − 30 = 20 Kč." },
  { question: "Máš 40 Kč. Koupíš 2 čokolády po 15 Kč. Kolik ti zbyde?", correct: 10, hint: "Nejdřív: 2 × 15 = kolik. Pak odečti od 40.", solution: "2 × 15 = 30 Kč utratíš. Zbyde: 40 − 30 = 10 Kč." },
  { question: "V košíku je 20 jablek a 15 hrušek. Sníš 8 jablek. Kolik kusů ovoce zbyde?", correct: 27, hint: "Nejdřív dohromady, pak odečti.", solution: "20 + 15 = 35 kusů. 35 − 8 = 27 kusů ovoce zbyde." },
  { question: "Máš 60 Kč, koupíš rohlík za 8 Kč. Pak dostaneš 20 Kč. Kolik máš celkem?", correct: 72, hint: "Nejdřív: 60 − 8. Pak přidej 20.", solution: "60 − 8 = 52. 52 + 20 = 72 Kč." },
  { question: "Ve třídě je 24 dětí. 6 odejde, pak přijdou 4 nové. Kolik dětí je ve třídě?", correct: 22, hint: "Nejdřív odečti odešlé, pak přičti nové.", solution: "24 − 6 = 18, 18 + 4 = 22 dětí." },
  { question: "Máš 35 Kč. Dáš 12 Kč kamarádovi a od babičky dostaneš 20 Kč. Kolik máš teď?", correct: 43, hint: "35 − 12 + 20 = ?", solution: "35 − 12 = 23. 23 + 20 = 43 Kč." },
  { question: "Anna má 18 samolepek, Míša má o 5 víc než Anna. Kolik mají dohromady?", correct: 41, hint: "Míša = 18 + 5. Pak sečti obě.", solution: "Míša má 18 + 5 = 23. Dohromady: 18 + 23 = 41 samolepek." },
  { question: "V hejnu bylo 42 vrabců. Odletělo 15, pak přilétlo 8. Kolik vrabců je teď?", correct: 35, hint: "42 − 15 + 8 = ?", solution: "42 − 15 = 27. 27 + 8 = 35 vrabců." },
  { question: "Tomáš měl 30 bodů, získal 12 dalších, pak 5 ztratil. Kolik má bodů?", correct: 37, hint: "30 + 12 − 5 = ?", solution: "30 + 12 = 42. 42 − 5 = 37 bodů." },
  { question: "Koupíš 3 sešity po 12 Kč. Máš 50 Kč. Kolik ti zbyde?", correct: 14, hint: "3 × 12 = kolik. Pak odečti od 50.", solution: "3 × 12 = 36 Kč. 50 − 36 = 14 Kč zbyde." },
];

function pick(pool: PoolItem[]): PracticeTask[] {
  return shuffle(pool).map((item) => {
    const c = item.correct;
    const d1 = c + 1;
    const d2 = c - 1 >= 0 ? c - 1 : c + 2;
    const d3 = c + 10 <= 100 ? c + 10 : c - 10;
    const opts = shuffle(
      [String(c), String(d1), String(d2), String(d3)]
        .filter((v, i, a) => a.indexOf(v) === i && Number(v) >= 0)
        .slice(0, 4),
    );
    return {
      question: item.question,
      correctAnswer: String(c),
      options: opts,
      hints: [item.hint],
      solutionSteps: [item.solution],
    };
  });
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
}

export const SLOVNIULOHYDO100: TopicMetadata[] = [
  {
    id: "g2-mat-slovni-ulohy-100",
    rvpNodeId:
      "g2-matematika-nestandardni-aplikacni-ulohy-a-problemy-slovni-ulohy-slovni-ulohy-se-vsemi-typy-operaci-do-100",
    title: "Slovní úlohy se všemi typy operací do 100",
    studentTitle: "Příběhy s čísly",
    subject: "matematika",
    category: "Nestandardní aplikační úlohy a problémy",
    topic: "Slovní úlohy",
    briefDescription: "Řešíš krátké příklady ze života do 100.",
    keywords: ["slovní úloha", "příklad", "počítání", "sčítání", "odčítání", "Kč"],
    goals: [
      "Pochopit zadání krátké slovní úlohy.",
      "Vybrat správnou operaci (sčítání nebo odčítání).",
      "Spočítat výsledek v oboru do 100.",
    ],
    boundaries: ["Pouze sčítání a odčítání.", "Čísla do 100."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Přečti, co přibývá nebo ubývá — to ti řekne, zda sčítat nebo odčítat.",
      steps: [
        "Přečti otázku.",
        "Přibývá? → Sčítej. Ubývá? → Odčítej.",
        "Spočítej a zkontroluj.",
      ],
      commonMistake: "Záměna sčítání a odčítání — slova 'zbyde', 'odletí', 'prohraješ' = odčítání.",
      example: "Máš 35 Kč, koupíš bonbóny za 12 Kč. Zbyde: 35 − 12 = 23 Kč.",
    },
  },
];
