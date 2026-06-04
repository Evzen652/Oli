import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Teoretické a praktické otázky o rýsování úseček
const POOL_L1 = [
  { q: "Co potřebuješ k narýsování úsečky?", a: "Pravítko a tužku", opts: ["Pravítko a tužku", "Kružítko", "Úhloměr", "Jen tužku"] },
  { q: "Jak se označuje délka úsečky AB?", a: "|AB|", opts: ["|AB|", "AB", "∠AB", "(AB)"] },
  { q: "Narýsuj úsečku délky 5 cm. Jaký krok uděláš první?", a: "Označím bod A a přiložím pravítko", opts: ["Označím bod A a přiložím pravítko", "Hned začnu kreslit", "Změřím papír", "Označím střed úsečky"] },
  { q: "Úsečka má délku 3 cm. Jaká je délka v mm?", a: "30 mm", opts: ["30 mm", "3 mm", "300 mm", "0,3 mm"] },
  { q: "Co jsou krajní body úsečky?", a: "Body A a B na obou koncích", opts: ["Body A a B na obou koncích", "Střed úsečky", "Délka úsečky", "Pravítko"] },
  { q: "Chceme úsečku délky 7 cm. Na pravítku odměříme:", a: "7 dílků (každý 1 cm)", opts: ["7 dílků (každý 1 cm)", "70 dílků", "0,7 dílků", "7 dílků po 1 mm"] },
  { q: "Dvě úsečky jsou stejně dlouhé. Říkáme, že jsou:", a: "Shodné (kongruentní)", opts: ["Shodné (kongruentní)", "Rovnoběžné", "Kolmé", "Různoběžné"] },
  { q: "Úsečka CD má délku 45 mm. Kolik je to cm?", a: "4,5 cm", opts: ["4,5 cm", "45 cm", "4 cm", "0,45 cm"] },
];

const POOL_L2 = [
  { q: "Jak narýsuješ úsečku délky 6,5 cm?", a: "Odměřím 65 mm na pravítku", opts: ["Odměřím 65 mm na pravítku", "Odměřím 6 cm", "Odměřím 7 cm", "Použiji kružítko"] },
  { q: "Jak zjistíš délku narýsované úsečky?", a: "Přiložím pravítko a odečtu vzdálenost bodů", opts: ["Přiložím pravítko a odečtu vzdálenost bodů", "Odhadem", "Spočítám mm na papíru", "Porovnám s jinou úsečkou"] },
  { q: "Úsečka EF je 8 cm. Úsečka GH je 5 cm. O kolik je EF delší?", a: "3 cm", opts: ["3 cm", "13 cm", "2 cm", "4 cm"] },
  { q: "Ke které části pravítka přikládáme začátek úsečky?", a: "K nule (0)", opts: ["K nule (0)", "K číslu 1", "Kamkoli", "K prostředku pravítka"] },
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
      hints: ["Úsečka = část přímky ohraničená dvěma body.", "Délku měříme pravítkem v cm nebo mm."],
      solutionSteps: [`Správná odpověď: ${item.a}`],
    });
  }
  return tasks;
}

export const RYSOVANIUSECKYODANEDELCE: TopicMetadata[] = [
  {
    id: "g3-mat-rysovani-usecky",
    rvpNodeId: "g3-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-rysovani-usecky-o-dane-delce",
    title: "Rýsování úsečky o dané délce",
    studentTitle: "Rýsuji úsečky",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Naučíš se narýsovat úsečku přesné délky pomocí pravítka.",
    keywords: ["úsečka", "rýsování", "pravítko", "délka", "body A B", "cm", "mm"],
    goals: [
      "Narýsovat úsečku zadané délky pomocí pravítka.",
      "Změřit délku dané úsečky.",
      "Označit krajní body úsečky.",
    ],
    boundaries: ["Délky v cm a mm.", "Bez kružítka."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Přilož pravítko k počátečnímu bodu A (na nulu). Odměř zadanou délku a označ bod B. Spoj A a B rovnou čarou.",
      steps: [
        "Označ bod A tužkou.",
        "Přilož pravítko tak, aby nula byla u bodu A.",
        "Odměř zadanou délku a označ bod B.",
        "Spoj A a B rovnou čarou podél pravítka.",
        "Napiš délku: |AB| = … cm.",
      ],
      commonMistake: "Přikládání pravítka ne od nuly, ale od čísla 1 — vznikne o 1 cm delší úsečka.",
      example: "|AB| = 4,5 cm: začátek u 0, konec u 4,5 na pravítku.",
    },
  },
];
