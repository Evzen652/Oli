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
  // Pořadí písmen
  { question: "Které písmeno přichází v abecedě po 'A'?", correct: "B", distractors: ["C", "Z"], emoji: "🔤", hint: "Abeceda začíná: A, B, C, D... Co je hned za A?", solution: "Po 'A' přichází 'B' — abeceda začíná A, B, C, D, E, F..." },
  { question: "Které písmeno přichází v abecedě před 'D'?", correct: "C", distractors: ["E", "A"], emoji: "🔤", hint: "Abeceda: ...A, B, C, D, E... Co je těsně před D?", solution: "Před 'D' přichází 'C' — abeceda jde A, B, C, D, E..." },
  { question: "Které písmeno přichází v abecedě po 'M'?", correct: "N", distractors: ["L", "O"], emoji: "🔤", hint: "Abeceda: ...L, M, N, O, P... Co je těsně za M?", solution: "Po 'M' přichází 'N' — abeceda jde ...L, M, N, O..." },
  { question: "Které písmeno je v abecedě první?", correct: "A", distractors: ["B", "Z"], emoji: "🔤", hint: "Vzpomeň si, jak začíná abeceda — zpíváme ji od začátku jako písničku.", solution: "První písmeno abecedy je 'A' — abeceda začíná A, B, C, D..." },
  { question: "Které písmeno je v abecedě poslední?", correct: "Ž", distractors: ["Z", "Á"], emoji: "🔤", hint: "Česká abeceda nekončí Z — za Z jsou ještě písmena s diakritikou.", solution: "Poslední písmeno české abecedy je 'Ž' — česká abeceda končí ...Z, Ž." },
  // Řazení slov
  { question: "Které slovo je v abecedě první: 'auto', 'dům', 'bok'?", correct: "auto", distractors: ["dům", "bok"], emoji: "📚", hint: "Porovnej první písmena: A, D, B — které písmeno je v abecedě nejdřív?", solution: "První slovo v abecedě je 'auto' — začíná na A, které je v abecedě před B a D." },
  { question: "Které slovo je v abecedě první: 'stůl', 'kolo', 'mísa'?", correct: "kolo", distractors: ["stůl", "mísa"], emoji: "📚", hint: "Porovnej první písmena: S, K, M — které písmeno je v abecedě nejdřív?", solution: "První slovo v abecedě je 'kolo' — začíná na K, které je v abecedě před M a S." },
  { question: "Které slovo je v abecedě jako poslední: 'vůz', 'ryba', 'zákon'?", correct: "zákon", distractors: ["vůz", "ryba"], emoji: "📚", hint: "Porovnej první písmena: V, R, Z — které písmeno je v abecedě nejpozději?", solution: "Poslední slovo v abecedě je 'zákon' — začíná na Z, které je v abecedě za R a V." },
  { question: "Která dvě slova jsou seřazena správně abecedně?", correct: "pes, ryba", distractors: ["ryba, pes", "ryba, kolo"], emoji: "📋", hint: "Porovnej první písmena: P a R. Které písmeno je v abecedě dřív — P nebo R?", solution: "Správně seřazena jsou 'pes, ryba' — P je v abecedě před R, takže 'pes' patří první." },
  { question: "Která dvě slova jsou seřazena správně abecedně?", correct: "bok, kočka", distractors: ["kočka, bok", "kočka, hora"], emoji: "📋", hint: "Porovnej první písmena: B a K. Které písmeno je v abecedě dřív — B nebo K?", solution: "Správně seřazena jsou 'bok, kočka' — B je v abecedě před K." },
  // Kde ve slovníku hledat slovo
  { question: "Kde ve slovníku hledáme slovo 'babička'?", correct: "Na začátku (u B)", distractors: ["Uprostřed (u M)", "Na konci (u Z)"], emoji: "📖", hint: "Slovník je seřazený abecedně. Slovo 'babička' začíná na B — kde je B v abecedě?", solution: "Slovo 'babička' hledáme na začátku slovníku — začíná na B, které je blízko začátku abecedy (A, B...)." },
  { question: "Kde ve slovníku hledáme slovo 'záhon'?", correct: "Na konci (u Z)", distractors: ["Na začátku (u A)", "Uprostřed (u M)"], emoji: "📖", hint: "Slovník je seřazený abecedně. Slovo 'záhon' začíná na Z — kde je Z v abecedě?", solution: "Slovo 'záhon' hledáme na konci slovníku — začíná na Z, které je blízko konce abecedy." },
  { question: "K čemu slouží abeceda?", correct: "K řazení slov (ve slovníku, seznamu)", distractors: ["K počítání", "K měření"], emoji: "🔤", hint: "Díky abecedě víme, že 'auto' patří před 'dům' — k čemu to využijeme?", solution: "Abeceda slouží k řazení slov — ve slovníku, rejstříku nebo jmenném seznamu hledáme slova v abecedním pořadí." },
  { question: "Které písmeno abecedy přichází po 'S'?", correct: "T", distractors: ["R", "U"], emoji: "🔤", hint: "Abeceda: ...R, S, T, U, V... Co je těsně za S?", solution: "Po 'S' přichází 'T' — abeceda jde ...R, S, T, U, V..." },
  { question: "Pokud seřadíme slova abecedně, které přijde první: 'hora', 'hora'... Které přijde první: 'holka', 'hora'?", correct: "holka", distractors: ["hora", "obě současně"], emoji: "📋", hint: "Obě slova začínají na H a O. Porovnej třetí písmeno: L (holka) nebo R (hora) — které písmeno je v abecedě dřív?", solution: "První přijde 'holka' — obě začínají HO, ale třetí písmeno je L (holka) vs. R (hora). L je v abecedě před R." },
  { question: "Které písmeno abecedy přichází po 'P'?", correct: "R", distractors: ["O", "S"], emoji: "🔤", hint: "Abeceda: ...O, P, R, S... Co je těsně za P? (Pozor: Q se v české abecedě téměř nepoužívá.)", solution: "Po 'P' přichází 'R' — v české abecedě jde ...O, P, R, S (Q se v české abecedě téměř nevyskytuje)." },
  { question: "Kde hledáme slovo ve slovníku?", correct: "Podle prvního písmene slova", distractors: ["Podle délky slova", "Podle počtu hlásek"], emoji: "📚", hint: "Slovník je seřazen abecedně — jak poznáme, kde začít hledat?", solution: "Ve slovníku hledáme slovo podle prvního písmene — slova začínající na A jsou první, na B druhá atd." },
  { question: "Které písmeno přichází v abecedě po 'E'?", correct: "F", distractors: ["D", "G"], emoji: "🔤", hint: "Abeceda: ...D, E, F, G, H... Co je těsně za E?", solution: "Po 'E' přichází 'F' — abeceda jde A, B, C, D, E, F, G, H..." },
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
      explanation: item.solution,
    };
  });
}

export const ABECEDAAZENI: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-tvaroslovi-abeceda-a-razeni",
    rvpNodeId: "g2-cjl-jazykova-vychova-tvaroslovi-abeceda-a-razeni",
    title: "Abeceda a řazení",
    studentTitle: "Abeceda",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Naučíš se pořadí písmen v abecedě a jak řadit slova.",
    keywords: ["abeceda", "řazení", "slovník", "pořadí písmen", "abecedně"],
    goals: [
      "Znát pořadí písmen v abecedě.",
      "Seřadit slova abecedně podle prvního písmene.",
      "Vědět, jak funguje slovník a abecední řazení.",
    ],
    boundaries: ["Řazení podle prvního (případně druhého) písmene.", "Bez složitého řazení."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Abeceda: A, B, C, D, E, F, G, H, Ch, I, J, K, L, M, N, O, P, R, S, Š, T, U, V, Z, Ž...",
      steps: ["Podívej se na první písmeno slova.", "Najdi ho v abecedě.", "Dřívější písmeno = slovo patří dříve."],
      commonMistake: "Řazení podle délky slova místo abecedy — vždy porovnáváme písmena, ne délku.",
      example: "auto, bok, dům — A je před B, B je před D → pořadí: auto, bok, dům.",
    },
  },
];
