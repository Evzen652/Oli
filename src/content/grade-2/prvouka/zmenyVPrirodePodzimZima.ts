import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ANO = "Ano, to je pravda";
const NE = "Ne, to není pravda";

interface TrueFalseItem {
  question: string;
  correct: boolean;
  emoji: string;
  hint: string;
  solution: string;
}

const POOL: TrueFalseItem[] = [
  { question: "Na podzim padá listí. Je to pravda?", correct: true, emoji: "🍂", hint: "Stromy na podzim ztrácejí listí — padá dolů.", solution: "Na podzim padá listí — stromy se připravují na zimu a zbavují se listů." },
  { question: "V zimě padá sníh. Je to pravda?", correct: true, emoji: "❄️", hint: "Sníh vzniká, když je velmi zima — v zimě nebo v létě?", solution: "V zimě padá sníh — teploty klesnou pod nulu a déšť se mění v sníh." },
  { question: "V zimě kvetou stromy. Je to pravda?", correct: false, emoji: "🌳", hint: "Stromy kvetou, když je teplo — je v zimě teplo?", solution: "V zimě stromy nekvetou — kvetou na jaře, v zimě jsou bez listí a bez květů." },
  { question: "Na podzim sklízíme jablka. Je to pravda?", correct: true, emoji: "🍎", hint: "Jablka dozrávají na podzim — kdy je sklízíme?", solution: "Na podzim sklízíme jablka — dozrávají na stromech v září a říjnu." },
  { question: "V zimě bývá zima (chladno). Je to pravda?", correct: true, emoji: "❄️", hint: "Zima je nejchladnější roční období — mrazy a sníh.", solution: "V zimě bývá zima (chladno) — teploty klesají, může mrazit a padat sníh." },
  { question: "Na podzim je horko jako v létě. Je to pravda?", correct: false, emoji: "🍂", hint: "Na podzim se ochlazuje — oblékáme se do kabátů.", solution: "Na podzim není horko jako v létě — podzim je chladnější, teploty klesají." },
  { question: "V zimě zamrzá rybník. Je to pravda?", correct: true, emoji: "⛸️", hint: "Když teploty klesnou pod nulu, voda tuhne — zmrzne i rybník?", solution: "V zimě zamrzá rybník — při velkém mrazu se vodní hladina pokryje ledem." },
  { question: "Na podzim listí žloutne. Je to pravda?", correct: true, emoji: "🍁", hint: "Před tím, než listí opadá, změní barvu — ze zelené na žlutou nebo červenou.", solution: "Na podzim listí žloutne a červená — před opadem mění barvu." },
  { question: "V zimě nosíme čepici. Je to pravda?", correct: true, emoji: "🧢", hint: "Čepice chrání hlavu před chladem — v zimě je to potřeba.", solution: "V zimě nosíme čepici — chrání nás před zimou a mrazem." },
  { question: "V zimě se koupeme v rybníku. Je to pravda?", correct: false, emoji: "❄️", hint: "Rybník v zimě zamrzne — koupali bychom se v ledové vodě?", solution: "V zimě se v rybníku nekoupeme — rybník je zamrzlý a voda by byla ledová." },
  { question: "Na podzim fouká vítr. Je to pravda?", correct: true, emoji: "🍂", hint: "Podzim přináší vítr a déšť — listí vítr sfoukává ze stromů.", solution: "Na podzim fouká vítr — vítr pomáhá opadávat listí ze stromů." },
  { question: "V zimě stavíme sněhuláka. Je to pravda?", correct: true, emoji: "⛄", hint: "Ze sněhu děláme koule a skládáme je na sebe — co tím vytvoříme?", solution: "V zimě stavíme sněhuláka — ze sněhu vytvoříme postavičku." },
  { question: "Na podzim sbíráme houby. Je to pravda?", correct: true, emoji: "🍄", hint: "Houby rostou v lese na podzim — kdy je sbíráme?", solution: "Na podzim sbíráme houby — v lesích jich roste hodně, například hříbky." },
  { question: "V zimě dozrávají jahody. Je to pravda?", correct: false, emoji: "❄️", hint: "Jahody dozrávají v létě — dozrávají v létě nebo v zimě?", solution: "V zimě jahody nedozrávají — jahody jsou letní ovoce, zrají v červnu a červenci." },
  { question: "Na podzim sklízíme brambory. Je to pravda?", correct: true, emoji: "🥔", hint: "Brambory vyrůstají pod zemí a na podzim je vykopáváme.", solution: "Na podzim sklízíme brambory — vykopáváme je ze země v říjnu." },
  { question: "V zimě jezdíme na saních. Je to pravda?", correct: true, emoji: "🛷", hint: "Saně kloužou po sněhu — kdy máme dost sněhu?", solution: "V zimě jezdíme na saních — po sněhu se saně hezky kloužou." },
  { question: "Na podzim raší nové listí. Je to pravda?", correct: false, emoji: "🍂", hint: "Nové listí raší na jaře — na podzim listí padá.", solution: "Na podzim nové listí neraší — nové listí raší na jaře, na podzim listí opadává." },
  { question: "V zimě bývají krátké dny. Je to pravda?", correct: true, emoji: "🌙", hint: "V zimě slunce vychází pozdě a zapadá brzy — jsou dny krátké nebo dlouhé?", solution: "V zimě bývají krátké dny — slunce svítí málo hodin a brzy se setmí." },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => ({
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [item.hint],
    solutionSteps: [item.solution],
  }));
}

export const ZMENYVPRIRODEPODZIMZIMA: TopicMetadata[] = [
  {
    id: "g2-prv-podzim-zima",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-podzim-a-v-zime-zmeny-v-prirode-podzim-zima",
    title: "Změny v přírodě – podzim a zima",
    studentTitle: "Podzim a zima",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na podzim a v zimě",
    briefDescription: "Co se děje v přírodě na podzim a v zimě.",
    keywords: ["podzim", "zima", "listí", "sníh", "příroda", "sklizeň"],
    goals: [
      "Vědět, co se děje v přírodě na podzim.",
      "Znát znaky zimy.",
      "Rozlišit podzim a zimu od jara a léta.",
    ],
    boundaries: ["Pouze podzim a zima.", "Bez jara a léta."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na podzim padá listí a sklízíme. V zimě padá sníh a je zima.",
      steps: ["Přečti větu.", "Děje se to na podzim nebo v zimě?"],
      commonMistake: "Stromy kvetou na jaře, ne v zimě.",
      example: "Na podzim padá listí, v zimě padá sníh.",
    },
  },
];
