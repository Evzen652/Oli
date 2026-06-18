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

// L1: Řazení slov začínajících vzdálenými písmeny + základní pořadí písmen (A, B, C, M, první/poslední)
const POOL_L1: PoolItem[] = [
  { question: "Které písmeno přichází v abecedě po 'A'?", correct: "B", distractors: ["C", "Z"], emoji: "🔤", hint: "Abeceda začíná: A, B, C, D... Co je hned za A?", solution: "Po 'A' přichází 'B' — abeceda začíná A, B, C, D, E, F..." },
  { question: "Které písmeno přichází v abecedě před 'D'?", correct: "C", distractors: ["E", "A"], emoji: "🔤", hint: "Abeceda: ...A, B, C, D, E... Co je těsně před D?", solution: "Před 'D' přichází 'C' — abeceda jde A, B, C, D, E..." },
  { question: "Které písmeno je v abecedě první?", correct: "A", distractors: ["B", "Z"], emoji: "🔤", hint: "Vzpomeň si, jak začíná abeceda — zpíváme ji od začátku jako písničku.", solution: "První písmeno abecedy je 'A' — abeceda začíná A, B, C, D..." },
  { question: "Které písmeno je v abecedě poslední?", correct: "Ž", distractors: ["Z", "Á"], emoji: "🔤", hint: "Česká abeceda nekončí Z — za Z jsou ještě písmena s diakritikou.", solution: "Poslední písmeno české abecedy je 'Ž' — česká abeceda končí ...Z, Ž." },
  { question: "Které slovo je v abecedě první: 'auto', 'dům', 'bok'?", correct: "auto", distractors: ["dům", "bok"], emoji: "📚", hint: "Porovnej první písmena: A, D, B — které písmeno je v abecedě nejdřív?", solution: "První slovo v abecedě je 'auto' — začíná na A, které je v abecedě před B a D." },
  { question: "Které slovo je v abecedě první: 'stůl', 'kolo', 'mísa'?", correct: "kolo", distractors: ["stůl", "mísa"], emoji: "📚", hint: "Porovnej první písmena: S, K, M — které písmeno je v abecedě nejdřív?", solution: "První slovo v abecedě je 'kolo' — začíná na K, které je v abecedě před M a S." },
  { question: "Které slovo je v abecedě jako poslední: 'vůz', 'ryba', 'zákon'?", correct: "zákon", distractors: ["vůz", "ryba"], emoji: "📚", hint: "Porovnej první písmena: V, R, Z — které písmeno je v abecedě nejpozději?", solution: "Poslední slovo v abecedě je 'zákon' — začíná na Z, které je v abecedě za R a V." },
  { question: "K čemu slouží abeceda?", correct: "K řazení slov (ve slovníku, seznamu)", distractors: ["K počítání", "K měření"], emoji: "🔤", hint: "Díky abecedě víme, že 'auto' patří před 'dům' — k čemu to využijeme?", solution: "Abeceda slouží k řazení slov — ve slovníku, rejstříku nebo jmenném seznamu hledáme slova v abecedním pořadí." },
];

// L2: Řazení slov začínajících blízkými / sousedními písmeny (K/L, P/R, S/T, B/D)
const POOL_L2: PoolItem[] = [
  { question: "Která dvě slova jsou seřazena správně abecedně?", correct: "pes, ryba", distractors: ["ryba, pes", "ryba, kolo"], emoji: "📋", hint: "Porovnej první písmena: P a R. Které písmeno je v abecedě dřív — P nebo R?", solution: "Správně seřazena jsou 'pes, ryba' — P je v abecedě před R, takže 'pes' patří první." },
  { question: "Která dvě slova jsou seřazena správně abecedně?", correct: "bok, kočka", distractors: ["kočka, bok", "kočka, hora"], emoji: "📋", hint: "Porovnej první písmena: B a K. Které písmeno je v abecedě dřív — B nebo K?", solution: "Správně seřazena jsou 'bok, kočka' — B je v abecedě před K." },
  { question: "Kde ve slovníku hledáme slovo 'babička'?", correct: "Na začátku (u B)", distractors: ["Uprostřed (u M)", "Na konci (u Z)"], emoji: "📖", hint: "Slovník je seřazený abecedně. Slovo 'babička' začíná na B — kde je B v abecedě?", solution: "Slovo 'babička' hledáme na začátku slovníku — začíná na B, které je blízko začátku abecedy (A, B...)." },
  { question: "Kde ve slovníku hledáme slovo 'záhon'?", correct: "Na konci (u Z)", distractors: ["Na začátku (u A)", "Uprostřed (u M)"], emoji: "📖", hint: "Slovník je seřazený abecedně. Slovo 'záhon' začíná na Z — kde je Z v abecedě?", solution: "Slovo 'záhon' hledáme na konci slovníku — začíná na Z, které je blízko konce abecedy." },
  { question: "Které písmeno abecedy přichází po 'P'?", correct: "R", distractors: ["O", "S"], emoji: "🔤", hint: "Abeceda: ...O, P, R, S... Co je těsně za P? (Pozor: Q se v české abecedě téměř nepoužívá.)", solution: "Po 'P' přichází 'R' — v české abecedě jde ...O, P, R, S (Q se v české abecedě téměř nevyskytuje)." },
  { question: "Která dvě slova jsou seřazena správně abecedně: 'list', 'nůž'?", correct: "list, nůž", distractors: ["nůž, list", "list, koza"], emoji: "📋", hint: "Porovnej první písmena: L a N. Které písmeno je v abecedě dřív — L nebo N?", solution: "Správně seřazena jsou 'list, nůž' — L je v abecedě před N, takže 'list' patří první." },
  { question: "Která dvě slova jsou seřazena správně abecedně: 'sůl', 'tráva'?", correct: "sůl, tráva", distractors: ["tráva, sůl", "sůl, ryba"], emoji: "📋", hint: "Porovnej první písmena: S a T. Které písmeno je v abecedě dřív — S nebo T?", solution: "Správně seřazena jsou 'sůl, tráva' — S je v abecedě před T." },
  { question: "Kde ve slovníku hledáme slovo 'moře'?", correct: "Uprostřed (u M)", distractors: ["Na začátku (u A)", "Na konci (u Z)"], emoji: "📖", hint: "Slovník je seřazený abecedně. Slovo 'moře' začíná na M — kde je M v abecedě?", solution: "Slovo 'moře' hledáme uprostřed slovníku — M je přibližně uprostřed abecedy." },
];

// L3: Řazení podle DRUHÉHO nebo TŘETÍHO písmene + delší sekvence + kde ve slovníku hledat
const POOL_L3: PoolItem[] = [
  { question: "Pokud seřadíme slova abecedně, které přijde první: 'holka', 'hora'?", correct: "holka", distractors: ["hora", "obě současně"], emoji: "📋", hint: "Obě slova začínají na H a O. Porovnej třetí písmeno: L (holka) nebo R (hora) — které písmeno je v abecedě dřív?", solution: "První přijde 'holka' — obě začínají HO, ale třetí písmeno je L (holka) vs. R (hora). L je v abecedě před R." },
  { question: "Které slovo přijde abecedně první: 'kára', 'kolo'?", correct: "kára", distractors: ["kolo", "obě jsou stejně"], emoji: "📋", hint: "Obě slova začínají na K. Porovnej druhé písmeno: Á (kára) nebo O (kolo) — které písmeno je v abecedě dřív?", solution: "První přijde 'kára' — obě začínají K, ale druhé písmeno je Á (kára) vs. O (kolo). A/Á je v abecedě před O." },
  { question: "Které slovo přijde abecedně první: 'malý', 'měkký'?", correct: "malý", distractors: ["měkký", "obě jsou stejně"], emoji: "📋", hint: "Obě slova začínají na M. Porovnej druhé písmeno: A (malý) nebo Ě (měkký) — které písmeno je v abecedě dřív?", solution: "První přijde 'malý' — obě začínají M, ale druhé písmeno je A (malý) vs. Ě (měkký). A je v abecedě před E/Ě." },
  { question: "Seřaď slova abecedně: 'slon', 'pes', 'kráva', 'had'. Které slovo je první?", correct: "had", distractors: ["pes", "slon"], emoji: "📚", hint: "Porovnej první písmena: S, P, K, H — které z těchto písmen je v abecedě nejdřív?", solution: "První v abecedě je 'had' — začíná na H, které je v abecedě před K, P i S." },
  { question: "Které slovo přijde abecedně první: 'párek', 'párky'?", correct: "párek", distractors: ["párky", "obě jsou stejně"], emoji: "📋", hint: "Obě slova začínají PÁR. Porovnej čtvrté písmeno: E (párek) nebo K (párky) — které písmeno je v abecedě dřív?", solution: "První přijde 'párek' — obě začínají PÁR, ale čtvrté písmeno je E (párek) vs. K (párky). E je v abecedě před K." },
  { question: "Kde ve slovníku hledáme slovo 'švestka'?", correct: "Za 'S', blízko konce (u Š)", distractors: ["Hned za začátkem (u B)", "Uprostřed (u M)"], emoji: "📖", hint: "Slovo 'švestka' začíná na Š — Š je za S. Je to blíž začátku, nebo konce abecedy?", solution: "Slovo 'švestka' hledáme blízko konce slovníku — Š je v abecedě za S, blízko konce (S, Š, T, U, V, Z, Ž)." },
  { question: "Které slovo přijde abecedně první: 'chodba', 'chvíle'?", correct: "chodba", distractors: ["chvíle", "obě jsou stejně"], emoji: "📋", hint: "Obě slova začínají na CH. Porovnej třetí písmeno: O (chodba) nebo V (chvíle) — které písmeno je v abecedě dřív?", solution: "První přijde 'chodba' — obě začínají CH, ale třetí písmeno je O (chodba) vs. V (chvíle). O je v abecedě před V." },
  { question: "Seřaď slova abecedně: 'žába', 'vlak', 'tygr', 'sova'. Které slovo je poslední?", correct: "žába", distractors: ["vlak", "tygr"], emoji: "📚", hint: "Porovnej první písmena: Ž, V, T, S — které z těchto písmen je v abecedě nejpozději?", solution: "Poslední v abecedě je 'žába' — začíná na Ž, které je úplně poslední písmeno české abecedy." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).map(item => {
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
