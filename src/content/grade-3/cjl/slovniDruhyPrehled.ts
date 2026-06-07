import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[]; e: string }[] = [
  { q: "Jaký slovní druh je slovo 'pes' ve větě 'Pes štěká.'?", a: "Podstatné jméno", opts: ["Podstatné jméno", "Přídavné jméno", "Sloveso", "Příslovce"], e: "Slovo 'pes' pojmenovává zvíře — odpovídá na otázku 'Co?' nebo 'Kdo?'. Slova, která odpovídají na tyto otázky, jsou podstatná jména." },
  { q: "Jaký slovní druh je slovo 'velký' ve větě 'Velký pes štěká.'?", a: "Přídavné jméno", opts: ["Přídavné jméno", "Podstatné jméno", "Sloveso", "Zájmeno"], e: "Slovo 'velký' říká, jaký je pes — odpovídá na otázku 'Jaký?'. Slova, která popisují vlastnosti věcí nebo osob, jsou přídavná jména." },
  { q: "Jaký slovní druh je slovo 'štěká' ve větě 'Pes štěká.'?", a: "Sloveso", opts: ["Sloveso", "Podstatné jméno", "Přídavné jméno", "Příslovce"], e: "Slovo 'štěká' říká, co pes dělá — odpovídá na otázku 'Co dělá?'. Slova vyjadřující děj nebo stav jsou slovesa." },
  { q: "Jaký slovní druh je slovo 'rychle' ve větě 'Pes běží rychle.'?", a: "Příslovce", opts: ["Příslovce", "Přídavné jméno", "Sloveso", "Podstatné jméno"], e: "Slovo 'rychle' říká, jak pes běží — odpovídá na otázku 'Jak?'. Příslovce popisují okolnosti děje, třeba kde, kdy nebo jak se něco děje." },
  { q: "Jaký slovní druh je slovo 'on' ve větě 'On jde domů.'?", a: "Zájmeno", opts: ["Zájmeno", "Podstatné jméno", "Přídavné jméno", "Sloveso"], e: "Slovo 'on' zastupuje podstatné jméno — třeba místo 'Petr jde domů' řekneme 'On jde domů'. Slova, která nahrazují jména, se nazývají zájmena." },
  { q: "Jaký slovní druh je slovo 'pět' ve větě 'Mám pět jablek.'?", a: "Číslovka", opts: ["Číslovka", "Podstatné jméno", "Přídavné jméno", "Příslovce"], e: "Slovo 'pět' udává počet jablek — odpovídá na otázku 'Kolik?'. Slova vyjadřující počet nebo pořadí jsou číslovky." },
  { q: "Jaký slovní druh je slovo 'v' ve větě 'Sedím v parku.'?", a: "Předložka", opts: ["Předložka", "Spojka", "Příslovce", "Citoslovce"], e: "Slovo 'v' se vždy váže k dalšímu slovu — 'v parku'. Předložky stojí před podstatnými jmény a upřesňují vztahy mezi slovy, třeba kde se něco děje." },
  { q: "Jaký slovní druh je slovo 'a' ve větě 'Jana a Petr přišli.'?", a: "Spojka", opts: ["Spojka", "Předložka", "Příslovce", "Citoslovce"], e: "Slovo 'a' spojuje dvě jména dohromady — Janu a Petra. Slova, která spojují části věty nebo celé věty, se jmenují spojky." },
  { q: "Jaký slovní druh je slovo 'ach' ve větě 'Ach, to je krásné!'?", a: "Citoslovce", opts: ["Citoslovce", "Spojka", "Příslovce", "Částice"], e: "Slovo 'ach' vyjadřuje pocit nebo náladu — obdiv, překvapení nebo bolest. Taková slova se nazývají citoslovce a většinou stojí na začátku věty s čárkou." },
  { q: "Jaký slovní druh je slovo 'ne' ve větě 'Ne, to není pravda.'?", a: "Částice", opts: ["Částice", "Citoslovce", "Příslovce", "Spojka"], e: "Slovo 'ne' vyjadřuje postoj mluvčího — popírá nebo odmítá. Částice nevyjadřují děj ani vlastnost, ale dávají větě zvláštní nádech jako popření, výzva nebo pochybnost." },
  { q: "Kolik slovních druhů existuje v češtině?", a: "Deset", opts: ["Deset", "Osm", "Dvanáct", "Šest"], e: "V češtině existuje přesně deset slovních druhů: podstatné jméno, přídavné jméno, zájmeno, číslovka, sloveso, příslovce, předložka, spojka, částice a citoslovce." },
  { q: "Podstatná jména označují:", a: "Osoby, věci, zvířata, jevy (kdo? co?)", opts: ["Osoby, věci, zvířata, jevy (kdo? co?)", "Vlastnosti (jaký?)", "Děje (co dělá?)", "Okolnosti (kde? kdy? jak?)"], e: "Podstatná jména pojmenovávají vše, na co se můžeme zeptat 'Kdo?' nebo 'Co?' — třeba maminka, stůl, pes nebo déšť." },
  { q: "Přídavná jména označují:", a: "Vlastnosti (jaký? jaká? jaké?)", opts: ["Vlastnosti (jaký? jaká? jaké?)", "Osoby a věci", "Děje a stavy", "Počty"], e: "Přídavná jména popisují vlastnosti — říkají, jaký něco je. Ptáme se na ně otázkou 'Jaký? Jaká? Jaké?' — třeba velký, krásná, modré." },
  { q: "Slovesa označují:", a: "Děje a stavy (co dělá? co je?)", opts: ["Děje a stavy (co dělá? co je?)", "Vlastnosti", "Osoby a věci", "Okolnosti"], e: "Slovesa říkají, co se děje nebo jaký stav nastává — ptáme se 'Co dělá?' nebo 'Co se děje?'. Třeba běží, spí, je nebo svítí." },
  { q: "Slovo 'tři' v 'Mám tři psy.' je:", a: "Číslovka", opts: ["Číslovka", "Přídavné jméno", "Podstatné jméno", "Příslovce"], e: "Slovo 'tři' říká, kolik psů mám — vyjadřuje počet. Číslovky odpovídají na otázku 'Kolik?' nebo 'Kolikátý?', proto to není přídavné jméno." },
  { q: "Slovo 'on' nahrazuje:", a: "Podstatné jméno (zájmeno)", opts: ["Podstatné jméno (zájmeno)", "Sloveso", "Přídavné jméno", "Příslovce"], e: "Zájmeno 'on' zastupuje podstatné jméno, aby se ve větě nemuselo stále opakovat — místo 'Tomáš šel, Tomáš spal' řekneme 'Tomáš šel, on spal'." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 8) : level === 2 ? POOL.slice(0, 12) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Otázky: kdo/co = podst. jm., jaký = příd. jm., co dělá = sloveso, jak/kde/kdy = příslovce.", "Zájmeno nahrazuje jméno, číslovka vyjadřuje počet."],
    explanation: e,
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
