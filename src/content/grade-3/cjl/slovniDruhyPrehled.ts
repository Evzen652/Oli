import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[] }[] = [
  { q: "Jaký slovní druh je slovo 'pes' ve větě 'Pes štěká.'?", a: "Podstatné jméno", opts: ["Podstatné jméno", "Přídavné jméno", "Sloveso", "Příslovce"] },
  { q: "Jaký slovní druh je slovo 'velký' ve větě 'Velký pes štěká.'?", a: "Přídavné jméno", opts: ["Přídavné jméno", "Podstatné jméno", "Sloveso", "Zájmeno"] },
  { q: "Jaký slovní druh je slovo 'štěká' ve větě 'Pes štěká.'?", a: "Sloveso", opts: ["Sloveso", "Podstatné jméno", "Přídavné jméno", "Příslovce"] },
  { q: "Jaký slovní druh je slovo 'rychle' ve větě 'Pes běží rychle.'?", a: "Příslovce", opts: ["Příslovce", "Přídavné jméno", "Sloveso", "Podstatné jméno"] },
  { q: "Jaký slovní druh je slovo 'on' ve větě 'On jde domů.'?", a: "Zájmeno", opts: ["Zájmeno", "Podstatné jméno", "Přídavné jméno", "Sloveso"] },
  { q: "Jaký slovní druh je slovo 'pět' ve větě 'Mám pět jablek.'?", a: "Číslovka", opts: ["Číslovka", "Podstatné jméno", "Přídavné jméno", "Příslovce"] },
  { q: "Jaký slovní druh je slovo 'v' ve větě 'Sedím v parku.'?", a: "Předložka", opts: ["Předložka", "Spojka", "Příslovce", "Citoslovce"] },
  { q: "Jaký slovní druh je slovo 'a' ve větě 'Jana a Petr přišli.'?", a: "Spojka", opts: ["Spojka", "Předložka", "Příslovce", "Citoslovce"] },
  { q: "Jaký slovní druh je slovo 'ach' ve větě 'Ach, to je krásné!'?", a: "Citoslovce", opts: ["Citoslovce", "Spojka", "Příslovce", "Částice"] },
  { q: "Jaký slovní druh je slovo 'ne' ve větě 'Ne, to není pravda.'?", a: "Částice", opts: ["Částice", "Citoslovce", "Příslovce", "Spojka"] },
  { q: "Kolik slovních druhů existuje v češtině?", a: "Deset", opts: ["Deset", "Osm", "Dvanáct", "Šest"] },
  { q: "Podstatná jména označují:", a: "Osoby, věci, zvířata, jevy (kdo? co?)", opts: ["Osoby, věci, zvířata, jevy (kdo? co?)", "Vlastnosti (jaký?)", "Děje (co dělá?)", "Okolnosti (kde? kdy? jak?)"] },
  { q: "Přídavná jména označují:", a: "Vlastnosti (jaký? jaká? jaké?)", opts: ["Vlastnosti (jaký? jaká? jaké?)", "Osoby a věci", "Děje a stavy", "Počty"] },
  { q: "Slovesa označují:", a: "Děje a stavy (co dělá? co je?)", opts: ["Děje a stavy (co dělá? co je?)", "Vlastnosti", "Osoby a věci", "Okolnosti"] },
  { q: "Slovo 'tři' v 'Mám tři psy.' je:", a: "Číslovka", opts: ["Číslovka", "Přídavné jméno", "Podstatné jméno", "Příslovce"] },
  { q: "Slovo 'on' nahrazuje:", a: "Podstatné jméno (zájmeno)", opts: ["Podstatné jméno (zájmeno)", "Sloveso", "Přídavné jméno", "Příslovce"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 8) : level === 2 ? POOL.slice(0, 12) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Otázky: kdo/co = podst. jm., jaký = příd. jm., co dělá = sloveso, jak/kde/kdy = příslovce.", "Zájmeno nahrazuje jméno, číslovka vyjadřuje počet."],
    solutionSteps: ["Zeptám se na slovo správnou otázkou.", `Slovní druh: ${a}`],
  }));
}

export const SLOVNIDRUHY: TopicMetadata[] = [
  {
    id: "g3-cjl-slovni-druhy",
    rvpNodeId: "g3-cjl-jazykova-vychova-tvaroslovi-slovni-druhy-prehled-deseti-slovnich-druhu",
    title: "Slovní druhy - přehled deseti slovních druhů",
    studentTitle: "Druhy slov",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Poznáš a určíš všech deset druhů slov ve větě.",
    keywords: ["slovní druhy", "podstatné jméno", "přídavné jméno", "sloveso", "příslovce", "zájmeno", "číslovka"],
    goals: ["Vyjmenovat deset slovních druhů.", "Určit slovní druh podtrženého slova ve větě.", "Uvést příklady každého slovního druhu."],
    boundaries: ["Základní přehled, bez podrobnějšího dělení."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "10 druhů: podst. jm., příd. jm., sloveso, příslovce, zájmeno, číslovka, předložka, spojka, částice, citoslovce.",
      steps: ["Najdi slovo ve větě.", "Zeptej se: Kdo/co? (podst.), Jaký? (příd.), Co dělá? (slov.), Jak/kde/kdy? (přísl.).", "Nahrazuje jméno? → zájmeno. Počet? → číslovka. Před jménem? → předložka."],
      commonMistake: "'rychle' je příslovce (jak?), ne přídavné jméno (jaký?).",
      example: "Velký pes rychle běží. → velký (příd. jm.) | pes (podst. jm.) | rychle (přísl.) | běží (sloveso).",
    },
  },
];
