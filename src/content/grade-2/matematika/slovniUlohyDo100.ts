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

const POOL: PoolItem[] = [
  // Peníze
  { question: "Máš 35 Kč. Koupíš bonbóny za 12 Kč. Kolik ti zbyde?", correct: 23, hint: "Koupíš za 12 Kč — to odejde. Co zbyde z 35?", solution: "Koupíš za 12 Kč, takže 12 Kč odejde. 35 − 12 = 23 Kč ti zbyde." },
  { question: "Máš 50 Kč. Koupíš čokoládu za 27 Kč. Kolik ti zbyde?", correct: 23, hint: "Koupíš za 27 Kč — to odejde. Co zbyde z 50?", solution: "Koupíš za 27 Kč, takže 27 Kč odejde. 50 − 27 = 23 Kč ti zbyde." },
  { question: "Máš 40 Kč. Koupíš knížku za 15 Kč. Kolik ti zbyde?", correct: 25, hint: "Koupíš za 15 Kč — to odejde. Co zbyde z 40?", solution: "Koupíš za 15 Kč, takže 15 Kč odejde. 40 − 15 = 25 Kč ti zbyde." },
  { question: "Máš 60 Kč. Koupíš hračku za 34 Kč. Kolik ti zbyde?", correct: 26, hint: "Koupíš za 34 Kč — to odejde. Co zbyde z 60?", solution: "Koupíš za 34 Kč, takže 34 Kč odejde. 60 − 34 = 26 Kč ti zbyde." },
  { question: "Máš 20 Kč. Koupíš žvýkačky za 8 Kč. Kolik ti zbyde?", correct: 12, hint: "Koupíš za 8 Kč — to odejde. Co zbyde z 20?", solution: "Koupíš za 8 Kč, takže 8 Kč odejde. 20 − 8 = 12 Kč ti zbyde." },
  { question: "Máš 45 Kč a dostaneš od babičky 10 Kč. Kolik máš celkem?", correct: 55, hint: "Máš 45 Kč a dostaneš 10 Kč navíc. Kolik je 45 + 10?", solution: "45 Kč + 10 Kč = 55 Kč máš celkem." },
  { question: "Máš 30 Kč a dostaneš od táty 25 Kč. Kolik máš celkem?", correct: 55, hint: "Máš 30 Kč a dostaneš 25 Kč navíc. Kolik je 30 + 25?", solution: "30 Kč + 25 Kč = 55 Kč máš celkem." },
  // Příroda
  { question: "V lese je 24 stromů. Přibyde 8 nových stromů. Kolik jich je celkem?", correct: 32, hint: "Bylo 24 stromů a přibyde 8. Kolik je 24 + 8?", solution: "24 stromů + 8 nových = 32 stromů celkem." },
  { question: "Na stromě sedí 15 ptáků. 7 jich odletí. Kolik ptáků zbyde?", correct: 8, hint: "Bylo 15 ptáků a 7 odletí — to ubyde. Co zbyde z 15?", solution: "15 ptáků − 7, kteří odletěli = 8 ptáků zbyde." },
  { question: "V zahradě je 18 květin. 6 jich uschne. Kolik květin zbyde?", correct: 12, hint: "Bylo 18 květin a 6 uschne — to ubyde. Co zbyde z 18?", solution: "18 květin − 6 uschlých = 12 květin zbyde." },
  { question: "V řece je 30 ryb. Připluje 14 dalších ryb. Kolik jich je celkem?", correct: 44, hint: "Bylo 30 ryb a připluje 14 dalších. Kolik je 30 + 14?", solution: "30 ryb + 14 nových = 44 ryb celkem." },
  { question: "Na louce je 25 motýlů. Odletí 9 motýlů. Kolik jich zbyde?", correct: 16, hint: "Bylo 25 motýlů a 9 odletí — to ubyde. Co zbyde z 25?", solution: "25 motýlů − 9, kteří odletěli = 16 motýlů zbyde." },
  { question: "Na větvi sedí 12 ptáků. Přiletí 5 dalších. Kolik ptáků je celkem?", correct: 17, hint: "Bylo 12 ptáků a přiletí 5 dalších. Kolik je 12 + 5?", solution: "12 ptáků + 5 nových = 17 ptáků celkem." },
  // Hry
  { question: "Máš 17 kartiček. Vyhraješ 8 kartiček. Kolik jich máš celkem?", correct: 25, hint: "Máš 17 kartiček a vyhraješ 8. Kolik je 17 + 8?", solution: "17 kartiček + 8 vyhraných = 25 kartiček celkem." },
  { question: "Máš 20 kartiček. Prohraješ 7 kartiček. Kolik ti zbyde?", correct: 13, hint: "Máš 20 kartiček a prohraješ 7 — to ubyde. Co zbyde z 20?", solution: "20 kartiček − 7 prohraných = 13 kartiček ti zbyde." },
  { question: "Hodíš kostkou číslo 4 a číslo 6. Kolik bodů máš celkem?", correct: 10, hint: "Hod 4 a hod 6 — dej je dohromady. Kolik je 4 + 6?", solution: "4 body + 6 bodů = 10 bodů celkem." },
  { question: "Máš 15 bodů a vyhraješ 23 bodů navíc. Kolik bodů máš celkem?", correct: 38, hint: "Máš 15 bodů a vyhraješ 23 dalších. Kolik je 15 + 23?", solution: "15 bodů + 23 vyhraných = 38 bodů celkem." },
  { question: "Máš 50 bodů. Ztratíš 18 bodů. Kolik bodů ti zbyde?", correct: 32, hint: "Máš 50 bodů a ztratíš 18 — to ubyde. Co zbyde z 50?", solution: "50 bodů − 18 ztracených = 32 bodů ti zbyde." },
  // Jídlo
  { question: "Je 24 jablek. Sníš 9 jablek. Kolik jablek zbyde?", correct: 15, hint: "Bylo 24 jablek a sníš 9 — to ubyde. Co zbyde z 24?", solution: "24 jablek − 9 snězených = 15 jablek zbyde." },
  { question: "Je 16 rohlíků. Přijde 7 nových rohlíků. Kolik jich je celkem?", correct: 23, hint: "Je 16 rohlíků a přijde 7 nových. Kolik je 16 + 7?", solution: "16 rohlíků + 7 nových = 23 rohlíků celkem." },
  { question: "Je 30 bonbónů. Dáš 12 bonbónů kamarádovi. Kolik ti zbyde?", correct: 18, hint: "Je 30 bonbónů a dáš 12 pryč — to ubyde. Co zbyde z 30?", solution: "30 bonbónů − 12 daných = 18 bonbónů ti zbyde." },
  { question: "Je 45 jahod. Sníš 17 jahod. Kolik jahod zbyde?", correct: 28, hint: "Bylo 45 jahod a sníš 17 — to ubyde. Co zbyde z 45?", solution: "45 jahod − 17 snězených = 28 jahod zbyde." },
  { question: "Je 20 sušenek. Přibyde 15 nových sušenek. Kolik jich je celkem?", correct: 35, hint: "Je 20 sušenek a přibyde 15 nových. Kolik je 20 + 15?", solution: "20 sušenek + 15 nových = 35 sušenek celkem." },
  // Škola / ostatní
  { question: "Ve třídě je 26 žáků. Přijdou 4 noví spolužáci. Kolik žáků je celkem?", correct: 30, hint: "Je 26 žáků a přijdou 4 noví. Kolik je 26 + 4?", solution: "26 žáků + 4 noví = 30 žáků celkem." },
  { question: "Ve třídě je 28 žáků. 3 žáci onemocní. Kolik žáků je ve třídě?", correct: 25, hint: "Je 28 žáků a 3 onemocní — to ubyde. Co zbyde z 28?", solution: "28 žáků − 3 nemocní = 25 žáků ve třídě." },
  { question: "V knihovně je 33 knih. Přibyde 7 nových knih. Kolik knih je celkem?", correct: 40, hint: "Je 33 knih a přibyde 7 nových. Kolik je 33 + 7?", solution: "33 knih + 7 nových = 40 knih celkem." },
  { question: "Autobus má 40 míst. Sedí 27 cestujících. Kolik míst je volných?", correct: 13, hint: "Autobus má 40 míst a 27 je obsazených — to ubyde. Co zbyde z 40?", solution: "40 míst − 27 obsazených = 13 míst je volných." },
  { question: "Na zastávce čeká 8 lidí. Přijde 14 dalších lidí. Kolik lidí čeká celkem?", correct: 22, hint: "Čeká 8 lidí a přijde 14 dalších. Kolik je 8 + 14?", solution: "8 lidí + 14 nových = 22 lidí čeká celkem." },
  { question: "Ujedeš 56 km. Pak jedeš dalších 18 km. Kolik km ujdeš celkem?", correct: 74, hint: "Ujedeš 56 km a pak 18 km navíc. Kolik je 56 + 18?", solution: "56 km + 18 km = 74 km ujdeš celkem." },
  { question: "Do cíle zbývá 63 km. Ujedeš 27 km. Kolik km ještě zbývá?", correct: 36, hint: "Zbývá 63 km a ujedeš 27 — to ubyde. Co zbyde z 63?", solution: "63 km − 27 ujetých = 36 km ještě zbývá." },
];

function gen(level: number): PracticeTask[] {
  const shuffled = shuffle(POOL);
  const selected = shuffled.slice(0, 25);

  return selected.map(item => {
    const c = item.correct;
    const d1 = c + 1;
    const d2 = c - 1 >= 0 ? c - 1 : c + 2;
    const d3 = c + 10 <= 100 ? c + 10 : c - 10;

    const opts = shuffle(
      [String(c), String(d1), String(d2), String(d3)]
        .filter((v, i, a) => a.indexOf(v) === i && Number(v) >= 0)
        .slice(0, 4)
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

export const SLOVNIULOHYDO100: TopicMetadata[] = [
  {
    id: "g2-mat-slovni-ulohy-100",
    rvpNodeId:
      "g2-matematika-nestandardni-aplikacni-ulohy-a-problemy-slovni-ulohy-slovni-ulohy-se-vsemi-typy-operaci-do-100",
    title: "Slovní úlohy se všemi typy operací do 100",
    studentTitle: "Slovní úlohy",
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
