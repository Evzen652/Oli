import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface SplitItem {
  question: string;
  correct: string;
  distractors: string[];
  emoji: string;
  hint: string;
  solution: string;
}

interface CanDivideItem {
  question: string;
  correct: "Ano" | "Ne";
  emoji: string;
  hint: string;
  solution: string;
}

type PoolItem = SplitItem | CanDivideItem;

function isSplitItem(item: PoolItem): item is SplitItem {
  return "distractors" in item;
}

// L1: dvojslabičná slova, jasná hranice slabik, rozdělovník patří jednoznačně na 1 místo.
const POOL_L1: SplitItem[] = [
  { question: "Kam patří rozdělovník, když slovo 'okno' nepatří celé na řádek?", correct: "ok-no", distractors: ["o-kno", "okn-o"], emoji: "🪟", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'okno' se dělí na slabiky 'ok-no'. Rozdělovník patří jen mezi slabiky, ne uprostřed jedné z nich." },
  { question: "Kam patří rozdělovník, když slovo 'kniha' nepatří celé na řádek?", correct: "kni-ha", distractors: ["k-niha", "knih-a"], emoji: "📚", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'kniha' se dělí na slabiky 'kni-ha'. Samotné písmeno 'k' ani 'a' nesmí zůstat na řádku samo." },
  { question: "Kam patří rozdělovník, když slovo 'máma' nepatří celé na řádek?", correct: "má-ma", distractors: ["m-áma", "mám-a"], emoji: "👩", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'máma' se dělí na slabiky 'má-ma'. Rozdělovník patří přesně mezi obě slabiky." },
  { question: "Kam patří rozdělovník, když slovo 'auto' nepatří celé na řádek?", correct: "au-to", distractors: ["a-uto", "aut-o"], emoji: "🚗", hint: "Pozor — 'au' se vyslovuje dohromady jako jedna slabika, nerozděluj ji.", solution: "Slovo 'auto' se dělí na slabiky 'au-to' — dvojhláska AU tvoří jednu slabiku, proto se nesmí rozdělit uprostřed." },
  { question: "Kam patří rozdělovník, když slovo 'ryba' nepatří celé na řádek?", correct: "ry-ba", distractors: ["r-yba", "ryb-a"], emoji: "🐟", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'ryba' se dělí na slabiky 'ry-ba'. Samotné písmeno nesmí zůstat na řádku samo." },
  { question: "Kam patří rozdělovník, když slovo 'škola' nepatří celé na řádek?", correct: "ško-la", distractors: ["š-kola", "škol-a"], emoji: "🏫", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'škola' se dělí na slabiky 'ško-la'. Rozdělovník patří přesně mezi obě slabiky." },
  { question: "Kam patří rozdělovník, když slovo 'voda' nepatří celé na řádek?", correct: "vo-da", distractors: ["v-oda", "vod-a"], emoji: "💧", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'voda' se dělí na slabiky 'vo-da'. Samotné písmeno nesmí zůstat na řádku samo." },
  { question: "Kam patří rozdělovník, když slovo 'louže' nepatří celé na řádek?", correct: "lou-že", distractors: ["l-ouže", "louž-e"], emoji: "💦", hint: "Pozor — 'ou' se vyslovuje dohromady jako jedna slabika, nerozděluj ji.", solution: "Slovo 'louže' se dělí na slabiky 'lou-že' — dvojhláska OU tvoří jednu slabiku." },
  { question: "Kam patří rozdělovník, když slovo 'boty' nepatří celé na řádek?", correct: "bo-ty", distractors: ["b-oty", "bot-y"], emoji: "👢", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'boty' se dělí na slabiky 'bo-ty'. Rozdělovník patří přesně mezi obě slabiky." },
  { question: "Kam patří rozdělovník, když slovo 'kočka' nepatří celé na řádek?", correct: "koč-ka", distractors: ["k-očka", "kočk-a"], emoji: "🐱", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'kočka' se dělí na slabiky 'koč-ka'. Samotné písmeno nesmí zůstat na řádku samo." },
];

// L2: nová dvojslabičná slova s jinými souhláskovými skupinami — stejné pravidlo, těžší slovní zásoba.
const POOL_L2: SplitItem[] = [
  { question: "Kam patří rozdělovník, když slovo 'žába' nepatří celé na řádek?", correct: "žá-ba", distractors: ["ž-ába", "žáb-a"], emoji: "🐸", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'žába' se dělí na slabiky 'žá-ba'. Samotné písmeno nesmí zůstat na řádku samo." },
  { question: "Kam patří rozdělovník, když slovo 'dárek' nepatří celé na řádek?", correct: "dá-rek", distractors: ["d-árek", "dáre-k"], emoji: "🎁", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'dárek' se dělí na slabiky 'dá-rek'. Samotné písmeno nesmí zůstat na řádku samo." },
  { question: "Kam patří rozdělovník, když slovo 'sešit' nepatří celé na řádek?", correct: "se-šit", distractors: ["s-ešit", "seš-it"], emoji: "📓", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'sešit' se dělí na slabiky 'se-šit'. Rozdělovník patří přesně mezi obě slabiky." },
  { question: "Kam patří rozdělovník, když slovo 'slunce' nepatří celé na řádek?", correct: "slun-ce", distractors: ["slu-nce", "sluncе-"], emoji: "☀️", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'slunce' se dělí na slabiky 'slun-ce'. Rozdělovník patří přesně mezi obě slabiky." },
  { question: "Kam patří rozdělovník, když slovo 'husa' nepatří celé na řádek?", correct: "hu-sa", distractors: ["h-usa", "hus-a"], emoji: "🦢", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'husa' se dělí na slabiky 'hu-sa'. Samotné písmeno nesmí zůstat na řádku samo." },
  { question: "Kam patří rozdělovník, když slovo 'pero' nepatří celé na řádek?", correct: "pe-ro", distractors: ["p-ero", "per-o"], emoji: "🖊️", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'pero' se dělí na slabiky 'pe-ro'. Samotné písmeno nesmí zůstat na řádku samo." },
  { question: "Kam patří rozdělovník, když slovo 'domek' nepatří celé na řádek?", correct: "do-mek", distractors: ["d-omek", "dome-k"], emoji: "🏠", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'domek' se dělí na slabiky 'do-mek'. Samotné písmeno nesmí zůstat na řádku samo." },
  { question: "Kam patří rozdělovník, když slovo 'moucha' nepatří celé na řádek?", correct: "mou-cha", distractors: ["m-oucha", "mouch-a"], emoji: "🪰", hint: "Pozor — 'ou' se vyslovuje dohromady jako jedna slabika, nerozděluj ji.", solution: "Slovo 'moucha' se dělí na slabiky 'mou-cha' — dvojhláska OU tvoří jednu slabiku." },
  { question: "Kam patří rozdělovník, když slovo 'ruka' nepatří celé na řádek?", correct: "ru-ka", distractors: ["r-uka", "ruk-a"], emoji: "✋", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'ruka' se dělí na slabiky 'ru-ka'. Samotné písmeno nesmí zůstat na řádku samo." },
  { question: "Kam patří rozdělovník, když slovo 'noha' nepatří celé na řádek?", correct: "no-ha", distractors: ["n-oha", "noh-a"], emoji: "🦵", hint: "Rozděl slovo na slabiky — rozdělovník patří přesně mezi ně.", solution: "Slovo 'noha' se dělí na slabiky 'no-ha'. Samotné písmeno nesmí zůstat na řádku samo." },
];

// L3: transfer — kdy se slovo NESMÍ dělit vůbec (jednoslabičné slovo, nebo by osamělo 1 písmeno).
const POOL_L3: PoolItem[] = [
  { question: "Které z těchto slov NELZE na konci řádku rozdělit, protože by osamělo jedno písmeno?", correct: "ano", distractors: ["kolo", "pole"], emoji: "🚫", hint: "Rozděl každé slovo na slabiky. U kterého by na řádku zůstalo jen jedno písmeno?", solution: "Slovo 'ano' bychom museli rozdělit na 'a-no', ale samotné písmeno 'a' nesmí na řádku zůstat samo. Proto se 'ano' na konci řádku nedělí — musí zůstat celé." },
  { question: "Které z těchto slov NELZE na konci řádku rozdělit, protože by osamělo jedno písmeno?", correct: "eso", distractors: ["nebe", "ruka"], emoji: "🚫", hint: "Rozděl každé slovo na slabiky. U kterého by na řádku zůstalo jen jedno písmeno?", solution: "Slovo 'eso' bychom museli rozdělit na 'e-so', ale samotné písmeno 'e' nesmí na řádku zůstat samo. Proto se 'eso' na konci řádku nedělí." },
  { question: "Které z těchto slov NELZE na konci řádku rozdělit, protože by osamělo jedno písmeno?", correct: "oko", distractors: ["voda", "okno"], emoji: "🚫", hint: "Rozděl každé slovo na slabiky. U kterého by na řádku zůstalo jen jedno písmeno?", solution: "Slovo 'oko' bychom museli rozdělit na 'o-ko', ale samotné písmeno 'o' nesmí na řádku zůstat samo. Proto se 'oko' na konci řádku nedělí." },
  { question: "Které z těchto slov NELZE na konci řádku rozdělit, protože by osamělo jedno písmeno?", correct: "umí", distractors: ["ryba", "máma"], emoji: "🚫", hint: "Rozděl každé slovo na slabiky. U kterého by na řádku zůstalo jen jedno písmeno?", solution: "Slovo 'umí' bychom museli rozdělit na 'u-mí', ale samotné písmeno 'u' nesmí na řádku zůstat samo. Proto se 'umí' na konci řádku nedělí." },
  { question: "Které z těchto slov NELZE na konci řádku rozdělit, protože by osamělo jedno písmeno?", correct: "ano", distractors: ["číslo", "kočka"], emoji: "🚫", hint: "Rozděl každé slovo na slabiky. U kterého by na řádku zůstalo jen jedno písmeno?", solution: "Slovo 'ano' bychom museli rozdělit na 'a-no', ale samotné písmeno 'a' nesmí na řádku zůstat samo." },
  { question: "Lze rozdělit slovo 'dům' na konci řádku?", correct: "Ne", emoji: "🏠", hint: "Kolik slabik (samohlásek) slovo 'dům' má?", solution: "Slovo 'dům' má jen jednu slabiku (jednu samohlásku Ů) — jednoslabičné slovo se na konci řádku nedělí vůbec, nemá kde." },
  { question: "Lze rozdělit slovo 'kolo' na konci řádku?", correct: "Ano", emoji: "🚲", hint: "Kolik slabik (samohlásek) slovo 'kolo' má? Zůstalo by na některé straně jen jedno písmeno?", solution: "Slovo 'kolo' má dvě slabiky 'ko-lo' a na žádné straně nezůstává osamělé písmeno — proto se dělit smí." },
  { question: "Lze rozdělit slovo 'pes' na konci řádku?", correct: "Ne", emoji: "🐕", hint: "Kolik slabik (samohlásek) slovo 'pes' má?", solution: "Slovo 'pes' má jen jednu slabiku (jednu samohlásku E) — jednoslabičné slovo se na konci řádku nedělí vůbec." },
  { question: "Lze rozdělit slovo 'eso' na konci řádku?", correct: "Ne", emoji: "🃏", hint: "Rozděl slovo na slabiky. Zůstalo by na některé straně jen jedno písmeno?", solution: "Slovo 'eso' by se dělilo na 'e-so', ale samotné 'e' nesmí zůstat na řádku samo — proto se nedělí." },
  { question: "Lze rozdělit slovo 'ryba' na konci řádku?", correct: "Ano", emoji: "🐟", hint: "Kolik slabik (samohlásek) slovo 'ryba' má? Zůstalo by na některé straně jen jedno písmeno?", solution: "Slovo 'ryba' má dvě slabiky 'ry-ba' a na žádné straně nezůstává osamělé písmeno — proto se dělit smí." },
];

function makeTask(item: PoolItem): PracticeTask {
  if (isSplitItem(item)) {
    return {
      question: item.question,
      correctAnswer: item.correct,
      options: shuffle([item.correct, ...item.distractors]),
      emoji: item.emoji,
      hints: [item.hint],
      explanation: item.solution,
    };
  }
  return {
    question: item.question,
    correctAnswer: item.correct,
    options: shuffle(["Ano", "Ne"]),
    emoji: item.emoji,
    hints: [item.hint],
    explanation: item.solution,
  };
}

function gen(level: number): PracticeTask[] {
  const pool: PoolItem[] = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).map(makeTask);
}

export const DELENISLOVNAKONCIRADKU: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-deleni-slov-na-konci-radku",
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-deleni-slov-na-konci-radku",
    title: "Dělení slov na konci řádku",
    studentTitle: "Slovo se nevejde",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Naučíš se, kam na konci řádku patří rozdělovník.",
    keywords: ["dělení slov", "rozdělovník", "konec řádku", "slabiky", "psaní slov"],
    goals: [
      "Vědět, že slovo se na konci řádku dělí jen mezi slabikami.",
      "Správně určit, kam patří rozdělovník.",
      "Poznat, kdy se slovo dělit nesmí (jedna slabika, nebo by osamělo písmeno).",
    ],
    boundaries: [
      "Běžná jedno- a dvojslabičná slova 2. třídy.",
      "Bez slov se slabikotvornými souhláskami (r, l) a bez víceslabičných rozborů.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Slovo dělíme na konci řádku jen mezi slabikami. Samotné jedno písmeno nesmí zůstat na řádku.",
      steps: [
        "Rozděl slovo na slabiky.",
        "Najdi hranici mezi slabikami — tam patří rozdělovník.",
        "Zkontroluj, že na žádné straně nezůstalo jen jedno písmeno.",
      ],
      commonMistake: "Rozdělit slovo uprostřed slabiky, nebo nechat jedno písmeno samotné na řádku (např. 'a-no').",
      example: "okno → ok-no (správně). ano → nelze rozdělit, protože by zůstalo samotné 'a'.",
    },
  },
];
