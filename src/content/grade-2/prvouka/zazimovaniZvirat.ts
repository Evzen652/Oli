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
  { question: "Medvěd v zimě spí. Je to pravda?", correct: true, emoji: "🐻", hint: "Medvěd si na zimu schová zásoby a uloží se — co dělá celou zimu?", solution: "Medvěd v zimě spí — ukládá se do doupěte a spí až do jara." },
  { question: "Ježek se v zimě ukládá k spánku. Je to pravda?", correct: true, emoji: "🦔", hint: "Ježek si udělá pelíšek z listí a v zimě spí — říkáme tomu zimní spánek.", solution: "Ježek se v zimě ukládá k spánku — spí v pelíšku z listí až do jara." },
  { question: "Vlaštovka v zimě zůstává u nás. Je to pravda?", correct: false, emoji: "🐦", hint: "Vlaštovka potřebuje teplo a hmyz — v zimě u nás nic z toho není.", solution: "Vlaštovka v zimě u nás nezůstává — odlétá na zimu do teplých krajů v Africe." },
  { question: "Vlaštovka odlétá do teplých krajů. Je to pravda?", correct: true, emoji: "🐦", hint: "Vlaštovky jsou tažní ptáci — v září odlétají na jih.", solution: "Vlaštovka odlétá do teplých krajů — je to tažný pták, který zimuje v Africe." },
  { question: "Veverka si dělá zásoby na zimu. Je to pravda?", correct: true, emoji: "🐿️", hint: "Veverka sbírá na podzim oříšky a žaludy — na co si je schovává?", solution: "Veverka si dělá zásoby — schovává oříšky a žaludy na zimu." },
  { question: "Sýkorka přilétá v zimě ke krmítku. Je to pravda?", correct: true, emoji: "🐦", hint: "Sýkorka v zimě hledá jídlo — lidé jim pomáhají krmítky.", solution: "Sýkorka přilétá ke krmítku — v zimě tam hledá semínka a tuk." },
  { question: "Čáp v zimě létá u nás. Je to pravda?", correct: false, emoji: "🦢", hint: "Čáp je tažný pták — v zimě ho u nás nevidíme, kam letí?", solution: "Čáp v zimě u nás nelétá — odlétá na zimu do Afriky." },
  { question: "V zimě krmíme ptáky. Je to pravda?", correct: true, emoji: "🐦", hint: "V zimě ptáci těžko hledají potravu — co jim připravíme?", solution: "V zimě krmíme ptáky — věšíme jim lůj nebo dáváme semínka do krmítka." },
  { question: "Žába v zimě spí. Je to pravda?", correct: true, emoji: "🐸", hint: "Žába je studenokrevný tvor — v zimě se zahrabe do bahna.", solution: "Žába v zimě spí — zahrabuje se do bahna na dně rybníka." },
  { question: "Had je v zimě venku aktivní. Je to pravda?", correct: false, emoji: "🐍", hint: "Had je studenokrevný — v zimě mu je příliš zima na pohyb.", solution: "Had v zimě venku aktivní není — zahrabuje se pod zem a upadá do zimního spánku." },
  { question: "Zajíc má v zimě hustší srst. Je to pravda?", correct: true, emoji: "🐇", hint: "Zajíc v zimě nemigruje ani nespí — jak se chrání před chladem?", solution: "Zajíc má v zimě hustší srst — ta ho chrání před mrazem." },
  { question: "Medvěd se v zimě koupe v řece. Je to pravda?", correct: false, emoji: "🐻", hint: "Medvěd v zimě spí ve svém doupěti — koupal by se v ledové řece?", solution: "Medvěd se v zimě v řece nekouná — spí v doupěti až do jara." },
  { question: "Netopýr v zimě spí. Je to pravda?", correct: true, emoji: "🦇", hint: "Netopýr se schová do jeskyně nebo půdy a přespí zimu.", solution: "Netopýr v zimě spí — přespí ji v úkrytu, říkáme tomu zimní spánek." },
  { question: "Ptáci u krmítka mají rádi semínka. Je to pravda?", correct: true, emoji: "🐦", hint: "Sýkorky, vrabci a další ptáci u krmítka rádi zobají semínka.", solution: "Ptáci u krmítka mají rádi semínka — jsou to dobrý zdroj energie v zimě." },
  { question: "Liška si v zimě uloví méně potravy. Je to pravda?", correct: true, emoji: "🦊", hint: "V zimě je méně zvířat a potrava je vzácnější — loví liška více nebo méně?", solution: "Liška si v zimě uloví méně — zvěře a potravy je v zimě méně." },
  { question: "Ježek si dělá pelíšek z listí. Je to pravda?", correct: true, emoji: "🦔", hint: "Ježek před zimním spánkem hledá suché místo a listí.", solution: "Ježek si dělá pelíšek z listí — scuchá ho do hnízda a v něm přezimuje." },
  { question: "Žába v zimě plave v rybníku. Je to pravda?", correct: false, emoji: "🐸", hint: "Žába v zimě spí — je schovaná v bahně, ne v otevřené vodě.", solution: "Žába v zimě v rybníku neplave — spí zahrabaná v bahně na dně." },
  { question: "Veverka přes celou zimu spí. Je to pravda?", correct: false, emoji: "🐿️", hint: "Veverka si dělá zásoby — je to proto, že celou zimu spí, nebo se budí?", solution: "Veverka přes celou zimu nespí — na rozdíl od medvěda se budí a jí zásoby." },
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

export const ZAZIMOVANIZVIRAT: TopicMetadata[] = [
  {
    id: "g2-prv-zima-zvirata",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-podzim-a-v-zime-zazimovani-zvirat-ptaci-v-zime",
    title: "Zazimování zvířat, ptáci v zimě",
    studentTitle: "Zvířata v zimě",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na podzim a v zimě",
    briefDescription: "Jak zvířata přečkají zimu.",
    keywords: ["zima", "medvěd", "ježek", "spánek", "ptáci", "krmítko"],
    goals: [
      "Vědět, která zvířata v zimě spí.",
      "Znát, kteří ptáci odlétají.",
      "Vědět, že ptáky v zimě krmíme.",
    ],
    boundaries: ["Pouze běžná zvířata.", "Bez detailů o migraci."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Medvěd a ježek v zimě spí. Vlaštovka odlétá do tepla.",
      steps: ["Přečti větu.", "Co zvíře v zimě dělá?"],
      commonMistake: "Vlaštovka v zimě odlétá, nezůstává u nás.",
      example: "Ježek v zimě spí, vlaštovka odlétá do teplých krajů.",
    },
  },
];
