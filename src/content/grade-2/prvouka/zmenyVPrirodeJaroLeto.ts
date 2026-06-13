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
  { question: "Na jaře kvetou květiny. Je to pravda?", correct: true, emoji: "🌷", hint: "Na jaře se příroda probouzí a otepluje — co dělají květiny?", solution: "Na jaře kvetou květiny — příroda se probouzí po zimě." },
  { question: "V létě je teplo. Je to pravda?", correct: true, emoji: "☀️", hint: "Léto je nejteplejší roční období — chodíme v tričku nebo plavkách.", solution: "V létě je teplo — léto je nejteplejší roční období." },
  { question: "Na jaře padá sníh. Je to pravda?", correct: false, emoji: "🌷", hint: "Sníh patří do zimy — jaké počasí bývá na jaře?", solution: "Na jaře sníh nespadá — sníh je typický pro zimu, na jaře se otepluje." },
  { question: "V létě se koupeme. Je to pravda?", correct: true, emoji: "🏊", hint: "Léto je teplé — chodíme k vodě nebo na bazén.", solution: "V létě se koupeme — je horko a voda nás příjemně ochladí." },
  { question: "Na jaře raší listí. Je to pravda?", correct: true, emoji: "🌱", hint: "Na jaře se stromy probouzejí a vyrůstají jim nové listy.", solution: "Na jaře raší listí — stromy se po zimě probouzejí a ozelenávají." },
  { question: "V létě nosíme čepici a rukavice. Je to pravda?", correct: false, emoji: "🧤", hint: "Čepici a rukavice nosíme, když je zima — je v létě zima?", solution: "V létě čepici a rukavice nenosíme — v létě je teplo, nosíme lehké oblečení." },
  { question: "Na jaře se vrací ptáci z teplých krajů. Je to pravda?", correct: true, emoji: "🐦", hint: "Některé ptáky (jako vlaštovky) přes zimu nevidíme — vrátí se na jaře?", solution: "Na jaře se vrací ptáci — jako vlaštovky, kteří zimu tráví v teplých krajích." },
  { question: "V létě jsou dlouhé dny. Je to pravda?", correct: true, emoji: "☀️", hint: "V létě svítí slunce hodně dlouho — jsou dny kratší nebo delší?", solution: "V létě jsou dlouhé dny — slunce vychází brzy a zapadá pozdě." },
  { question: "Na jaře všechno usychá. Je to pravda?", correct: false, emoji: "🌷", hint: "Na jaře se příroda probouzí a roste — usychá, nebo kvete?", solution: "Na jaře příroda neusychá — naopak se probouzí, kvete a zelená." },
  { question: "V létě dozrávají jahody. Je to pravda?", correct: true, emoji: "🍓", hint: "Jahody sklízíme v létě — jsou sladké a červené.", solution: "V létě dozrávají jahody — jsou jedním z prvních letních plodů." },
  { question: "Na jaře se rodí mláďata. Je to pravda?", correct: true, emoji: "🐣", hint: "Na jaře se příroda obnovuje — zvířata mají malá mláďata.", solution: "Na jaře se rodí mláďata — zvířata přivádějí na svět potomky." },
  { question: "V létě zamrzá rybník. Je to pravda?", correct: false, emoji: "🏊", hint: "Rybník zamrzá, když je velká zima — je v létě zima?", solution: "V létě rybník nezamrzá — zamrzá v zimě, kdy jsou teploty pod nulou." },
  { question: "Na jaře je tepleji než v zimě. Je to pravda?", correct: true, emoji: "🌷", hint: "Srovnej jaro a zimu — kde je tepleji?", solution: "Na jaře je tepleji než v zimě — teploty stoupají a sníh taje." },
  { question: "V létě svítí slunce dlouho. Je to pravda?", correct: true, emoji: "☀️", hint: "V létě bývají dlouhé světlé dny — slunce svítí hodně hodin.", solution: "V létě svítí slunce dlouho — dny jsou delší než v zimě." },
  { question: "Na jaře kvetou stromy. Je to pravda?", correct: true, emoji: "🌸", hint: "Stromy se na jaře probouzejí a rozkvetou — třešně a jabloně.", solution: "Na jaře kvetou stromy — třešně, jabloně a švestky jsou celé bílé." },
  { question: "V létě padá listí ze stromů. Je to pravda?", correct: false, emoji: "🌳", hint: "Listí padá na podzim — co se děje se stromy v létě?", solution: "V létě listí ze stromů nepadá — listí padá na podzim, v létě jsou stromy zelené." },
  { question: "V létě nosíme krátké tričko. Je to pravda?", correct: true, emoji: "👕", hint: "Když je horko, nosíme lehké oblečení — krátké tričko nebo šaty.", solution: "V létě nosíme krátké tričko — v létě je teplo a lehké oblečení nás chladí." },
  { question: "Na jaře včely sbírají pyl. Je to pravda?", correct: true, emoji: "🐝", hint: "Včely létají od květiny ke květině — co sbírají?", solution: "Na jaře včely sbírají pyl — když kvetou květiny, včely pilně pracují." },
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

export const ZMENYVPRIRODEJAROLETO: TopicMetadata[] = [
  {
    id: "g2-prv-jaro-leto",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-jare-a-v-lete-zmeny-v-prirode-jaro-leto",
    title: "Změny v přírodě – jaro a léto",
    studentTitle: "Jaro a léto",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na jaře a v létě",
    briefDescription: "Co se děje v přírodě na jaře a v létě.",
    keywords: ["jaro", "léto", "květiny", "teplo", "příroda", "ptáci"],
    goals: [
      "Vědět, co se děje v přírodě na jaře.",
      "Znát znaky léta.",
      "Rozlišit jaro a léto od ostatních období.",
    ],
    boundaries: ["Pouze jaro a léto.", "Bez podzimu a zimy."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na jaře vše kvete a roste, v létě je teplo a sluní.",
      steps: ["Přečti větu.", "Děje se to na jaře nebo v létě?"],
      commonMistake: "Sníh patří do zimy, ne na jaro.",
      example: "Na jaře kvetou květiny, v létě se koupeme.",
    },
  },
];
