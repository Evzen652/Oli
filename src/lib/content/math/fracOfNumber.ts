import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray } from "../helpers";

function genFracOfNumberSimple(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const denoms = level === 1 ? [2, 3, 4, 5] : level === 2 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4, 5, 6, 8, 10];
  for (let i = 0; i < 60; i++) {
    const den = denoms[Math.floor(Math.random() * denoms.length)];
    const numr = Math.floor(Math.random() * (den - 1)) + 1;
    const base = den * (Math.floor(Math.random() * 4) + 1);
    const result = (numr * base) / den;
    const solutionSteps = [`Zjisti, kolik je jedna část: ${base} ÷ ${den} = ${base / den}.`, `Vynásob počtem částí: ${base / den} × ${numr} = ${result}.`, `Výsledek: ${numr}/${den} z ${base} = ${result}.`];
    const distractors = new Set<number>();
    distractors.add(base / den); distractors.add(base * numr); distractors.add(result + 1); distractors.add(result - 1);
    distractors.delete(result);
    const filteredD = [...distractors].filter(d => d > 0 && Number.isInteger(d));
    while (filteredD.length < 3) filteredD.push(result + filteredD.length + 2);
    const options = [result, ...filteredD.slice(0, 3)].sort(() => Math.random() - 0.5).map(String);
    tasks.push({ question: `Kolik je ${numr}/${den} z ${base}?`, correctAnswer: `${result}`, options, solutionSteps, hints: [`Vyděl ${base} jmenovatelem ${den} — dostaneš jednu část.`, `Výsledek dělení vynásob čitatelem ${numr}.`] });
  }
  return tasks;
}

function genFracOfNumberWord(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const scenarios = [
    { template: (n: number, d: number, base: number) => `Ve třídě je ${base} žáků. ${n}/${d} z nich má brýle. Kolik žáků má brýle?`, unit: "žáků" },
    { template: (n: number, d: number, base: number) => `Petr má ${base} Kč. Utratil ${n}/${d} svých peněz. Kolik Kč utratil?`, unit: "Kč" },
    { template: (n: number, d: number, base: number) => `Na stromě je ${base} jablek. ${n}/${d} z nich je červených. Kolik jablek je červených?`, unit: "jablek" },
    { template: (n: number, d: number, base: number) => `Cesta měří ${base} km. Ušli jsme ${n}/${d} cesty. Kolik km jsme ušli?`, unit: "km" },
    { template: (n: number, d: number, base: number) => `V balení je ${base} bonbónů. Snědli jsme ${n}/${d}. Kolik bonbónů jsme snědli?`, unit: "bonbónů" },
    { template: (n: number, d: number, base: number) => `Na dvorku je ${base} kuřat. ${n}/${d} z nich je bílých. Kolik kuřat je bílých?`, unit: "kuřat" },
  ];
  const denoms = level === 1 ? [2, 3, 4] : level === 2 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 8];
  const shuffled = shuffleArray([...scenarios]);
  for (let i = 0; i < 60; i++) {
    const sc = shuffled[i % shuffled.length];
    const den = denoms[Math.floor(Math.random() * denoms.length)];
    const numr = Math.floor(Math.random() * (den - 1)) + 1;
    const base = den * (Math.floor(Math.random() * 4) + 2);
    const result = (numr * base) / den;
    const solutionSteps = [`Celkem je ${base}. Potřebujeme ${numr}/${den} z toho.`, `Jedna část: ${base} ÷ ${den} = ${base / den}.`, `${numr} částí: ${base / den} × ${numr} = ${result}.`, `Výsledek: ${result}.`];
    const distractors = new Set<number>();
    distractors.add(base / den); distractors.add(base * numr); distractors.add(result + 1); distractors.add(result - 1);
    distractors.delete(result);
    const filteredD = [...distractors].filter(d => d > 0 && Number.isInteger(d));
    while (filteredD.length < 3) filteredD.push(result + filteredD.length + 2);
    const options = [result, ...filteredD.slice(0, 3)].sort(() => Math.random() - 0.5).map(String);
    tasks.push({ question: sc.template(numr, den, base), correctAnswer: `${result}`, options, solutionSteps, hints: [`Najdi v textu celkový počet (${base}) a zlomek (${numr}/${den}).`, `Vyděl ${base} číslem ${den}, pak vynásob číslem ${numr}.`] });
  }
  return tasks;
}

function genFracFindWhole(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const denoms = level === 1 ? [2, 3, 4, 5] : level === 2 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4, 5, 6, 8, 10];
  const scenarios = [
    (n: number, d: number, part: number) => `${n}/${d} z nějakého čísla je ${part}. Jaké je to číslo?`,
    (n: number, d: number, part: number) => `Petr přečetl ${n}/${d} knihy, to je ${part} stránek. Kolik stránek má celá kniha?`,
    (n: number, d: number, part: number) => `${n}/${d} cesty je ${part} km. Jak dlouhá je celá cesta?`,
    (n: number, d: number, part: number) => `Ve třídě je ${n}/${d} dívek, to je ${part} dívek. Kolik žáků je ve třídě celkem?`,
    (n: number, d: number, part: number) => `Utratil ${n}/${d} svých peněz, to je ${part} Kč. Kolik Kč měl celkem?`,
    (n: number, d: number, part: number) => `${n}/${d} balení sušenek je ${part} sušenek. Kolik sušenek je v celém balení?`,
  ];
  const shuffled = shuffleArray([...scenarios]);
  for (let i = 0; i < 60; i++) {
    const den = denoms[Math.floor(Math.random() * denoms.length)];
    const numr = Math.floor(Math.random() * (den - 1)) + 1;
    const whole = den * (Math.floor(Math.random() * 4) + 2);
    const part = (numr * whole) / den;
    const sc = shuffled[i % shuffled.length];
    const solutionSteps = [`Víme, že ${numr}/${den} celku je ${part}.`, `Jedna část (1/${den}) je: ${part} ÷ ${numr} = ${part / numr}.`, `Celý celek (${den}/${den}) je: ${part / numr} × ${den} = ${whole}.`, `Výsledek: ${whole}.`];
    const distractors = new Set<number>();
    distractors.add(part * numr); distractors.add(part + den); distractors.add(whole + den); distractors.add(whole - den);
    distractors.delete(whole);
    const filteredD = [...distractors].filter(d => d > 0 && Number.isInteger(d));
    while (filteredD.length < 3) filteredD.push(whole + filteredD.length + 2);
    const options = [whole, ...filteredD.slice(0, 3)].sort(() => Math.random() - 0.5).map(String);
    tasks.push({ question: sc(numr, den, part), correctAnswer: `${whole}`, options, solutionSteps, hints: [`Víš, že ${numr}/${den} celku je ${part}. Kolik je tedy jedna ${den === 2 ? "polovina" : `${den}-tina`}?`, `Vyděl ${part} číslem ${numr} — to je jedna část. Tu pak vynásob ${den}.`] });
  }
  return tasks;
}

const HELP_FRAC_OF_NUMBER: HelpData = {
  hint: "Zlomek z čísla spočítáš tak, že číslo vydělíš jmenovatelem a vynásobíš čitatelem.",
  steps: ["Vyděl celkový počet jmenovatelem — dostaneš jednu část.", "Vynásob jednu část čitatelem — dostaneš výsledek."],
  commonMistake: "Pozor na pořadí! Nejdřív děl, pak násob. Třeba 2/3 z 12 → 12÷3 = 4, pak 4×2 = 8.",
  example: "3/4 z 20 → 20 ÷ 4 = 5 (jedna čtvrtina), 5 × 3 = 15 → výsledek je 15.",
  visualExamples: [{ label: "3/4 z 20 — rozděl na 4 díly, vezmi 3", illustration: "20 bonbónů: 🍬🍬🍬🍬🍬 🍬🍬🍬🍬🍬 🍬🍬🍬🍬🍬 🍬🍬🍬🍬🍬\n\nRozděl na 4 díly (po 5):\n[🍬🍬🍬🍬🍬] [🍬🍬🍬🍬🍬] [🍬🍬🍬🍬🍬] [🍬🍬🍬🍬🍬]\n\nVezmi 3 díly: 🟢🟢🟢🟢🟢 🟢🟢🟢🟢🟢 🟢🟢🟢🟢🟢 ⬜⬜⬜⬜⬜\n\n3/4 z 20 = 15" }],
};

const HELP_FRAC_OF_NUMBER_WORD: HelpData = {
  hint: "Ve slovní úloze najdi celkový počet a zlomek. Pak počítej stejně — vyděl jmenovatelem a vynásob čitatelem.",
  steps: ["Přečti úlohu a najdi celkový počet (kolik je celkem).", "Najdi zlomek (jakou část hledáme).", "Vyděl celkový počet jmenovatelem.", "Vynásob čitatelem — to je odpověď."],
  commonMistake: "Nepřehoď si čísla! Číslo, ze kterého počítáme zlomek, dělíme jmenovatelem. Třeba '2/5 z 30' → 30÷5 = 6, ne 5÷30.",
  example: "Ve třídě je 24 žáků. 3/4 z nich sportuje. Kolik? → 24÷4 = 6, 6×3 = 18 žáků.",
  visualExamples: [{ label: "24 žáků, 3/4 sportuje — kolik to je?", illustration: "24 žáků rozděl na 4 skupiny:\n[👦👧👦👧👦👧] [👦👧👦👧👦👧] [👦👧👦👧👦👧] [👦👧👦👧👦👧]\n   6 žáků         6 žáků         6 žáků         6 žáků\n\n3 skupiny sportují: 🏃🏃🏃🏃🏃🏃 🏃🏃🏃🏃🏃🏃 🏃🏃🏃🏃🏃🏃 ⬜⬜⬜⬜⬜⬜\n\n3/4 z 24 = 18 žáků" }],
};

const HELP_FRAC_FIND_WHOLE: HelpData = {
  hint: "Znáš zlomek a jeho hodnotu — najdi celek. Vyděl hodnotu čitatelem a vynásob jmenovatelem.",
  steps: ["Zjisti, kolik je jedna část: vyděl danou hodnotu čitatelem.", "Vynásob jednu část jmenovatelem — dostaneš celek."],
  commonMistake: "Pozor na pořadí! Děl čitatelem (kolik částí máme), pak násob jmenovatelem (kolik částí tvoří celek).",
  example: "2/3 z čísla je 10. Jedna třetina: 10÷2 = 5. Celé číslo: 5×3 = 15.",
  visualExamples: [{ label: "2/3 z čísla je 10 — najdi celek", illustration: "Víme: 🟢🟢⬜ = 2 díly z 3 = 10\n\n1. Jeden díl: 10 ÷ 2 = 5\n   🟢=5  🟢=5  ⬜=?\n\n2. Celek (3 díly): 5 × 3 = 15\n   🟢=5  🟢=5  🟢=5  → celkem 15" }],
};

export const FRAC_OF_NUMBER_TOPICS: TopicMetadata[] = [
  {
    id: "frac_of_number_simple", title: "Jednoduchý výpočet", subject: "matematika", category: "Zlomky", topic: "Zlomek z čísla",
    briefDescription: "Procvičíš si, kolik je zlomek z daného čísla — vyděl a vynásob.",
    topicDescription: "Procvičíš si výpočet zlomku z čísla, slovní úlohy i hledání celku.",
    keywords: ["zlomek z čísla", "kolik je zlomek z", "polovina z", "třetina z", "čtvrtina z"],
    goals: ["Naučíš se spočítat, kolik je zlomek z daného čísla."],
    boundaries: ["Pouze kladná čísla", "Výsledek je celé číslo", "Žádná procenta", "Žádné sčítání zlomků"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "select_one",
    generator: genFracOfNumberSimple, helpTemplate: HELP_FRAC_OF_NUMBER,
  },
  {
    id: "frac_of_number_word", title: "Slovní úlohy", subject: "matematika", category: "Zlomky", topic: "Zlomek z čísla",
    briefDescription: "Procvičíš si výpočet zlomku z čísla ve slovních úlohách z běžného života.",
    topicDescription: "Procvičíš si výpočet zlomku z čísla, slovní úlohy i hledání celku.",
    keywords: ["zlomek z čísla slovní úloha", "slovní úloha zlomky", "kolik žáků", "kolik stojí", "kolik zbylo"],
    goals: ["Naučíš se řešit slovní úlohy, kde hledáš zlomek z celkového počtu."],
    boundaries: ["Pouze kladná čísla", "Výsledek je celé číslo", "Žádná procenta", "Žádné sčítání zlomků"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "select_one",
    generator: genFracOfNumberWord, helpTemplate: HELP_FRAC_OF_NUMBER_WORD,
  },
  {
    id: "frac_find_whole", title: "Najdi celek", subject: "matematika", category: "Zlomky", topic: "Zlomek z čísla",
    topicDescription: "Procvičíš si výpočet zlomku z čísla, slovní úlohy i hledání celku.",
    briefDescription: "Znáš zlomek a jeho hodnotu — najdi, jaké je celé číslo.",
    keywords: ["najdi celek ze zlomku", "celek ze zlomku", "jaké je celé číslo", "kolik je celkem"],
    goals: ["Naučíš se najít celek, když znáš zlomek a jeho hodnotu."],
    boundaries: ["Pouze kladná čísla", "Výsledek je celé číslo", "Žádná procenta"],
    gradeRange: [6, 6], practiceType: "result_only", defaultLevel: 2, inputType: "select_one",
    generator: genFracFindWhole, helpTemplate: HELP_FRAC_FIND_WHOLE,
  },
];
