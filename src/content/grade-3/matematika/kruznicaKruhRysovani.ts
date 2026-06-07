import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1 = [
  { q: "Co je kružnice?", a: "Čára, jejíž každý bod je stejně daleko od středu", opts: ["Čára, jejíž každý bod je stejně daleko od středu", "Vyplněný kulatý tvar", "Čtverec zaoblený", "Polovina koule"] },
  { q: "Co je kruh?", a: "Plocha ohraničená kružnicí (vyplněný)", opts: ["Plocha ohraničená kružnicí (vyplněný)", "Jen obvod kruhu", "Čtverec se zaoblenými rohy", "Polovina kružnice"] },
  { q: "Jaký nástroj použijeme k narýsování kružnice?", a: "Kružítko", opts: ["Kružítko", "Pravítko", "Úhloměr", "Šablonu"] },
  { q: "Co je poloměr kružnice?", a: "Vzdálenost od středu ke kružnici", opts: ["Vzdálenost od středu ke kružnici", "Délka celé kružnice", "Vzdálenost dvou bodů na kružnici", "Polovina kružnice"] },
  { q: "Co je průměr kružnice?", a: "Dvojnásobek poloměru (prochází středem)", opts: ["Dvojnásobek poloměru (prochází středem)", "Polovina poloměru", "Délka oblouku", "Vzdálenost středů dvou kružnic"] },
  { q: "Kružnice má poloměr 3 cm. Jaký je její průměr?", a: "6 cm", opts: ["6 cm", "3 cm", "9 cm", "1,5 cm"] },
  { q: "Kružnice má průměr 10 cm. Jaký je její poloměr?", a: "5 cm", opts: ["5 cm", "10 cm", "20 cm", "2 cm"] },
  { q: "Jak nastavíme kružítko pro kružnici s poloměrem 4 cm?", a: "Rozevřeme kružítko na 4 cm", opts: ["Rozevřeme kružítko na 4 cm", "Rozevřeme kružítko na 8 cm", "Rozevřeme kružítko na 2 cm", "Kružítko nenastavujeme"] },
];

const POOL_L2 = [
  { q: "Kolik středů může mít kružnice?", a: "Jeden", opts: ["Jeden", "Dva", "Tři", "Nekonečně mnoho"] },
  { q: "Jak se nazývá úsečka spojující dva body kružnice?", a: "Tětiva", opts: ["Tětiva", "Průměr", "Poloměr", "Oblouk"] },
  { q: "Průměr d = 14 cm. Poloměr r = ?", a: "7 cm", opts: ["7 cm", "14 cm", "28 cm", "3,5 cm"] },
  { q: "Co platí: průměr = ?", a: "2 × poloměr", opts: ["2 × poloměr", "poloměr ÷ 2", "3 × poloměr", "poloměr + 1"] },
  { q: "Kružnice o poloměru 5 cm a kružnice o poloměru 5 cm jsou:", a: "Stejně velké (shodné)", opts: ["Stejně velké (shodné)", "Různě velké", "Soustředné", "Různoběžné"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level <= 2 ? POOL_L1 : [...POOL_L1, ...POOL_L2];
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < Math.min(40, pool.length * 3); i++) {
    const item = pool[i % pool.length];
    tasks.push({
      question: item.q,
      correctAnswer: item.a,
      options: shuffle([...item.opts]),
      hints: ["Poloměr = polovina průměru (r = d ÷ 2).", "Kružnice je jen čára (obvod bez plochy). Kruh je celá plocha uvnitř kružnice. Poloměr jde ze středu k obvodu."],
    });
  }
  return tasks;
}

export const KRUZNICAAKRUHRYSOVANI: TopicMetadata[] = [
  {
    id: "g3-mat-kruznice-kruh",
    rvpNodeId: "g3-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-kruznice-a-kruh-rysovani",
    title: "Kružnice a kruh - rýsování",
    studentTitle: "Kružnice a kruh",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Poznáš rozdíl mezi kružnicí a kruhem a naučíš se je narýsovat.",
    keywords: ["kružnice", "kruh", "poloměr", "průměr", "střed", "kružítko", "rýsování"],
    goals: [
      "Rozlišit kružnici (čára) a kruh (plocha).",
      "Narýsovat kružnici kružítkem se zadaným poloměrem.",
      "Vypočítat průměr z poloměru a naopak.",
    ],
    boundaries: ["Bez výpočtu obvodu a obsahu kruhu."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Kružnice = jen obvod (jako drát ohnutý do kroužku). Kruh = vnitřek + obvod (jako mince). Poloměr r = vzdálenost od středu. Průměr d = 2 × r.",
      steps: [
        "Označ střed kružnice — bod S.",
        "Nastav kružítko na zadaný poloměr.",
        "Hrot kružítka vlož do středu S.",
        "Otočením kružítka narýsuj kružnici.",
      ],
      commonMistake: "Záměna kružnice a kruhu: kružnice je jen čára, kruh je vyplněná plocha.",
      example: "Poloměr r = 3 cm → průměr d = 6 cm. Nastav kružítko na 3 cm a narýsuj.",
    },
  },
];
