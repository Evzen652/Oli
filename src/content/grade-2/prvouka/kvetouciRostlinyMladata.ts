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
  { question: "Jak se jmenuje mládě kočky?", correct: "Kotě", distractors: ["Štěně", "Tele"], emoji: "🐱", hint: "Kočka má malá roztomilá mláďata — jak se jim říká?", solution: "Mládě kočky je kotě — narozená kočička se tak jmenuje." },
  { question: "Jak se jmenuje mládě psa?", correct: "Štěně", distractors: ["Kotě", "Hříbě"], emoji: "🐶", hint: "Malý pes, který se teprve učí chodit — jak se jmenuje?", solution: "Mládě psa je štěně — malý psík, který se právě narodil." },
  { question: "Jak se jmenuje mládě krávy?", correct: "Tele", distractors: ["Kotě", "Sele"], emoji: "🐄", hint: "Malá kráva, co se ještě kojí — jak se jmenuje?", solution: "Mládě krávy je tele — teprve se učí chodit a kojí se." },
  { question: "Jak se jmenuje mládě koně?", correct: "Hříbě", distractors: ["Tele", "Štěně"], emoji: "🐴", hint: "Malý kůň na tenkých nožkách — jak se jmenuje?", solution: "Mládě koně je hříbě — brzy po narození se staví na nohy." },
  { question: "Jak se jmenuje mládě prasete?", correct: "Sele", distractors: ["Kuře", "Tele"], emoji: "🐷", hint: "Malé prase, co se motá u maminky — jak se jmenuje?", solution: "Mládě prasete je sele — malé prasátko u maminky." },
  { question: "Jak se jmenuje mládě slepice?", correct: "Kuře", distractors: ["Sele", "Kotě"], emoji: "🐔", hint: "Žluté chlupaté mládě slepice, co pípá — jak se jmenuje?", solution: "Mládě slepice je kuře — žluté pípající ptáče." },
  { question: "Jak se jmenuje mládě ovce?", correct: "Jehně", distractors: ["Kůzle", "Tele"], emoji: "🐑", hint: "Malá bílá ovečka na louce — jak se jmenuje?", solution: "Mládě ovce je jehně — roztomilé malé zvíře s bílou srstí." },
  { question: "Jak se jmenuje mládě kozy?", correct: "Kůzle", distractors: ["Jehně", "Sele"], emoji: "🐐", hint: "Malá kozička s nožičkami — jak se jmenuje?", solution: "Mládě kozy je kůzle — malá kozička, co poskakuje." },
  { question: "Která oblíbená jarní květina má kalichovitý květ?", correct: "Tulipán", distractors: ["Sníh", "Listí"], emoji: "🌷", hint: "Tato jarní květina má kalichovitý květ na stonku — znáš ji?", solution: "Na jaře kvete tulipán — je to oblíbená jarní květina různých barev." },
  { question: "Která malá bílá kvítka kvetou jako první na jaře?", correct: "Sněženka", distractors: ["Houba", "Mech"], emoji: "🌼", hint: "Malá bílá kvítka, která kvetou ještě ve sněhu — jak se jmenují?", solution: "Jako první kvete sněženka — je to malá bílá květina, která nevadí sněhu." },
  { question: "Jak se jmenuje mládě kachny?", correct: "Káčátko", distractors: ["Kuře", "Sele"], emoji: "🐤", hint: "Malá žlutá kachňátka plavou za maminkou — jak se jmenují?", solution: "Mládě kachny je káčátko — malá kachňátka plavou hned po narození." },
  { question: "Která žlutá kulička kvete na louce?", correct: "Pampeliška", distractors: ["Kámen", "Sníh"], emoji: "🌼", hint: "Žlutá kulatá kvítka na louce — co to je?", solution: "Na louce kvete pampeliška — její žlutý květ se mění v bílý míček ze semen." },
  { question: "Jak se jmenuje mládě husy?", correct: "House", distractors: ["Kuře", "Tele"], emoji: "🦢", hint: "Malá husa, co jde za maminkou — jak se jmenuje?", solution: "Mládě husy je house — chodí za maminkou husou v řadě." },
  { question: "Která malá žlutá jarní kvítka rostou v trávě?", correct: "Petrklíč", distractors: ["Listí", "Mech"], emoji: "🌼", hint: "Tato žlutá jarní kvítka rostou v trávě nebo na skalkách — jak se jmenují?", solution: "V trávě kvete petrklíč — má malé žluté kvítky a kvete brzy na jaře." },
  { question: "Jak se jmenuje mládě králíka?", correct: "Králíče", distractors: ["Kuře", "Sele"], emoji: "🐰", hint: "Malý králík, co se schovává v noře — jak se jmenuje?", solution: "Mládě králíka je králíče — malý králíček." },
  { question: "Která zahradní jarní květina má žlutou trubičku uprostřed?", correct: "Narcis", distractors: ["Sníh", "Houba"], emoji: "🌼", hint: "Tato jarní zahradní kvítka mají žlutou trubičku uprostřed — jak se jmenují?", solution: "V zahradě na jaře kvete narcis — má bílé nebo žluté okvětní lístky a žlutou trubičku." },
  { question: "Jak se jmenuje mládě zajíce?", correct: "Zajíče", distractors: ["Kuře", "Tele"], emoji: "🐇", hint: "Malý zajíček, co se schovává v trávě — jak se jmenuje?", solution: "Mládě zajíce je zajíče — malý zajíček narozený v jarní trávě." },
  { question: "Čím kvetou jabloně a třešně na jaře?", correct: "Květy", distractors: ["Sníh", "Listí"], emoji: "🌸", hint: "Jabloně, třešně a švestky se na jaře pokryjí — čím?", solution: "Stromy na jaře kvetou květy — jabloně, třešně a švestky jsou celé bílé od květů." },
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
      solutionSteps: [item.solution],
    };
  });
}

export const KVETOUCIROSTLINYMLADATA: TopicMetadata[] = [
  {
    id: "g2-prv-jaro-rostliny-mladata",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-jare-a-v-lete-kvetouci-rostliny-mladata-zvirat",
    title: "Kvetoucí rostliny a mláďata zvířat",
    studentTitle: "Mláďata a květiny",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na jaře a v létě",
    briefDescription: "Poznáš mláďata zvířat a jarní květiny.",
    keywords: ["mládě", "kotě", "štěně", "tele", "květina", "jaro"],
    goals: [
      "Znát jména mláďat zvířat.",
      "Poznat jarní květiny.",
      "Spojit zvíře a jeho mládě.",
    ],
    boundaries: ["Pouze běžná mláďata a květiny.", "Bez růstu rostlin."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Každé zvíře má pro mládě své jméno. Na jaře kvetou květiny.",
      steps: ["Přečti otázku.", "Jak se mládě jmenuje?"],
      commonMistake: "Záměna jmen mláďat (kotě vs. štěně).",
      example: "Mládě kočky je kotě, mládě psa je štěně.",
    },
  },
];
