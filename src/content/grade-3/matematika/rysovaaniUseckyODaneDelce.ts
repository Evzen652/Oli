import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * PED-3 kalibrace L1<L2<L3.
 *
 * Před: `pool = level<=2 ? POOL_L1 : POOL_L1+POOL_L2` → L1 a L2 měly identický
 * obsah, L3 přidalo jen POOL_L2. Audit `24/0/12 max L3 ⚠ chybí těžší`.
 *
 * Teď disjunktní:
 *  L1 — definice a jednotky (co je úsečka, mm/cm, krajní body).
 *  L2 — praxe rýsování a měření (jak přiložit pravítko, převody, rozdíl délek).
 *  L3 — aplikace: součet/rozdíl více úseček, slovní úlohy s převody, dvojitá úsečka.
 */

interface Item {
  q: string;
  a: string;
  opts: string[];
  hints?: string[];
}

const POOL_L1: Item[] = [
  { q: "Co potřebuješ k narýsování úsečky?", a: "Pravítko a tužku", opts: ["Pravítko a tužku", "Kružítko", "Úhloměr", "Jen tužku"] },
  {
    q: "Jak se označuje délka úsečky AB?",
    a: "|AB|",
    opts: ["|AB|", "AB", "∠AB", "(AB)"],
    hints: [
      "Délku měříme v cm nebo mm, vždy od nuly. 1 cm = 10 mm.",
      "Zápis délky úsečky se píše se dvěma svislými čarami kolem názvů krajních bodů, ne jen holými písmeny.",
    ],
  },
  { q: "Co jsou krajní body úsečky?", a: "Body A a B na obou koncích", opts: ["Střed úsečky uprostřed", "Body A a B na obou koncích", "Pravítko s měřítkem", "Celková délka úsečky"] },
  { q: "Úsečka má délku 3 cm. Jaká je délka v mm?", a: "30 mm", opts: ["30 mm", "3 mm", "300 mm", "0,3 mm"] },
  { q: "Úsečka CD má délku 45 mm. Kolik je to cm?", a: "4,5 cm", opts: ["4,5 cm", "45 cm", "4 cm", "0,45 cm"] },
  {
    q: "Kolik milimetrů má 1 centimetr?",
    a: "10 mm",
    opts: ["10 mm", "100 mm", "1 mm", "1000 mm"],
    hints: [
      "Přemýšlej, kolikrát se menší jednotka (mm) vejde do té větší (cm).",
      "Úsečka = část přímky mezi dvěma body A a B. Zápis délky: |AB|.",
    ],
  },
  { q: "Dvě úsečky jsou stejně dlouhé. Říkáme, že jsou:", a: "Shodné", opts: ["Rovnoběžné", "Shodné", "Různoběžné", "Kolmé"] },
  {
    q: "Úsečka je část přímky ohraničená:",
    a: "Dvěma body",
    opts: ["Dvěma body", "Jedním bodem", "Třemi body", "Kružnicí"],
    hints: [
      "Délku měříme v cm nebo mm, vždy od nuly. 1 cm = 10 mm.",
      "Kolik bodů potřebuješ, aby jimi byla úsečka na obou koncích ohraničená?",
    ],
  },
];

const POOL_L2: Item[] = [
  { q: "Ke které části pravítka přikládáme začátek úsečky?", a: "K nule (0)", opts: ["K nule (0)", "K číslu 1", "Kamkoli", "K prostředku pravítka"] },
  { q: "Jak narýsuješ úsečku délky 6,5 cm?", a: "Odměřím 65 mm na pravítku", opts: ["Odměřím 65 mm na pravítku", "Odměřím 6 cm", "Odměřím 7 cm", "Použiji kružítko"] },
  { q: "Jak zjistíš délku narýsované úsečky?", a: "Přiložím pravítko a odečtu vzdálenost bodů", opts: ["Přiložím pravítko a odečtu vzdálenost bodů", "Odhadem", "Spočítám mm na papíru", "Porovnám s jinou úsečkou"] },
  { q: "Úsečka EF je 8 cm. Úsečka GH je 5 cm. O kolik je EF delší?", a: "3 cm", opts: ["3 cm", "13 cm", "2 cm", "4 cm"] },
  { q: "Narýsuj úsečku délky 5 cm. Jaký krok uděláš první?", a: "Označím bod A a přiložím pravítko", opts: ["Označím bod A a přiložím pravítko", "Hned začnu kreslit", "Změřím papír", "Označím střed úsečky"] },
  {
    q: "Chceš úsečku 7 cm. Na pravítku odměříš:",
    a: "70 mm",
    opts: ["70 mm", "7 mm", "0,7 mm", "700 mm"],
    hints: [
      "Délku měříme v centimetrech i milimetrech, vždy od nuly. 1 cm = 10 mm.",
      "Úsečka = část přímky mezi dvěma body A a B. Zápis délky: |AB|.",
    ],
  },
  { q: "Úsečka má 12 cm. Kolik je to mm?", a: "120 mm", opts: ["120 mm", "12 mm", "1,2 mm", "1200 mm"] },
  { q: "Chceme přesně 3 cm 2 mm. Kolik mm celkem odměříme?", a: "32 mm", opts: ["32 mm", "23 mm", "5 mm", "302 mm"] },
];

const POOL_L3: Item[] = [
  // Aplikace: součet a rozdíl více úseček
  { q: "Úsečky |AB| = 4 cm, |BC| = 3 cm leží na jedné přímce za sebou. Jak dlouhá je celá úsečka |AC|?", a: "7 cm", opts: ["7 cm", "1 cm", "12 cm", "3,5 cm"] },
  { q: "Úsečka |XY| = 15 cm, |YZ| = 8 cm — leží za sebou. Kolik cm je |XZ|?", a: "23 cm", opts: ["23 cm", "7 cm", "120 cm", "15 cm"] },
  { q: "Celková úsečka |AC| má 10 cm. Její část |AB| je 6 cm. Jak dlouhá je zbylá část |BC|?", a: "4 cm", opts: ["4 cm", "16 cm", "6 cm", "60 cm"] },
  // Slovní úloha s převody
  { q: "Tomáš narýsoval úsečku 55 mm a Anna úsečku 6 cm. Kdo má delší úsečku?", a: "Anna (60 mm > 55 mm)", opts: ["Anna (60 mm > 55 mm)", "Tomáš (55 mm > 6 mm)", "Jsou stejně", "Nelze porovnat"] },
  { q: "Provaz je dlouhý 1 m. Kolik cm je to?", a: "100 cm", opts: ["100 cm", "10 cm", "1000 cm", "1 cm"] },
  { q: "Kolik mm má 2 cm 5 mm?", a: "25 mm", opts: ["25 mm", "52 mm", "205 mm", "7 mm"] },
  // Dvojitá úsečka a průměr
  { q: "Úsečky |AB| a |CD| jsou shodné, každá 4 cm. Kolik cm je jejich součet?", a: "8 cm", opts: ["8 cm", "4 cm", "16 cm", "2 cm"] },
  { q: "Úsečka |AB| = 12 cm. Kolik cm je polovina této úsečky?", a: "6 cm", opts: ["6 cm", "24 cm", "12 cm", "3 cm"] },
  // Porovnání a nerovnost
  { q: "Máme úsečky 3,5 cm, 5 mm a 4 cm. Která je nejdelší?", a: "4 cm", opts: ["4 cm", "3,5 cm", "5 mm", "všechny stejné"] },
  { q: "Úsečka |AB| = 9 cm, |CD| = 90 mm. Které tvrzení platí?", a: "|AB| = |CD|", opts: ["|AB| = |CD|", "|AB| > |CD|", "|AB| < |CD|", "nelze porovnat"] },
  // Kombinovaná úloha
  { q: "Chceš narýsovat 3 stejně dlouhé úsečky za sebou, každá 4 cm. Kolik cm bude mít výsledná úsečka?", a: "12 cm", opts: ["12 cm", "4 cm", "7 cm", "16 cm"] },
  { q: "Krátká úsečka má 25 mm, dlouhá je 3× delší. Kolik cm má dlouhá?", a: "7,5 cm", opts: ["7,5 cm", "75 cm", "0,75 cm", "10 cm"] },
];

function pick(pool: Item[]): PracticeTask[] {
  return shuffle(pool).map(({ q, a, opts, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: hints ?? [
      "Délku měříme v cm nebo mm, vždy od nuly. 1 cm = 10 mm.",
      "Úsečka = část přímky mezi dvěma body A a B. Zápis délky: |AB|.",
    ],
  }));
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
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
      "Sčítat a porovnávat délky úseček v cm a mm.",
    ],
    boundaries: ["Délky v cm a mm.", "Bez kružítka."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Přilož pravítko k počátečnímu bodu A (na nulu). Odměř zadanou délku a označ bod B. Spoj A a B rovnou čarou. 1 cm = 10 mm.",
      steps: [
        "Označ bod A tužkou.",
        "Přilož pravítko tak, aby nula byla u bodu A.",
        "Odměř zadanou délku a označ bod B.",
        "Spoj A a B rovnou čarou podél pravítka.",
        "Napiš délku: |AB| = … cm.",
      ],
      commonMistake: "Přikládání pravítka ne od nuly, ale od čísla 1 — vznikne o 1 cm delší úsečka.",
      example: "|AB| = 4,5 cm: začátek u 0, konec u 4,5 na pravítku. To je také 45 mm.",
    },
  },
];
