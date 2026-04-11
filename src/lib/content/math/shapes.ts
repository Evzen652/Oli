import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray } from "../helpers";

const SHAPES_DATA = [
  { name: "čtverec", sides: 4, corners: 4, rightAngles: true, rounded: false, equalSides: true, desc: "4 stejné strany, 4 pravé úhly", emoji: "⬜" },
  { name: "obdélník", sides: 4, corners: 4, rightAngles: true, rounded: false, equalSides: false, desc: "2 delší a 2 kratší strany, 4 pravé úhly", emoji: "▬" },
  { name: "trojúhelník", sides: 3, corners: 3, rightAngles: false, rounded: false, equalSides: false, desc: "3 strany a 3 úhly", emoji: "△" },
  { name: "kruh", sides: 0, corners: 0, rightAngles: false, rounded: true, equalSides: false, desc: "kulatý tvar, žádné rohy", emoji: "⭕" },
  { name: "kosočtverec", sides: 4, corners: 4, rightAngles: false, rounded: false, equalSides: true, desc: "4 stejné strany, žádné pravé úhly", emoji: "◇" },
  { name: "rovnoběžník", sides: 4, corners: 4, rightAngles: false, rounded: false, equalSides: false, desc: "2 páry rovnoběžných stran", emoji: "▱" },
  { name: "lichoběžník", sides: 4, corners: 4, rightAngles: false, rounded: false, equalSides: false, desc: "1 pár rovnoběžných stran", emoji: "⏢" },
  { name: "pětiúhelník", sides: 5, corners: 5, rightAngles: false, rounded: false, equalSides: false, desc: "5 stran a 5 úhlů", emoji: "⬠" },
  { name: "šestiúhelník", sides: 6, corners: 6, rightAngles: false, rounded: false, equalSides: false, desc: "6 stran a 6 úhlů", emoji: "⬡" },
  { name: "půlkruh", sides: 1, corners: 0, rightAngles: false, rounded: true, equalSides: false, desc: "jedna rovná a jedna zakřivená strana", emoji: "◗" },
  { name: "elipsa", sides: 0, corners: 0, rightAngles: false, rounded: true, equalSides: false, desc: "protáhlý kulatý tvar, žádné rohy", emoji: "⬮" },
];

function genShapes(_level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const shapes = SHAPES_DATA;

  for (const s of shapes) {
    const wrongOptions = shuffleArray(shapes.filter(x => x.name !== s.name)).slice(0, 2).map(x => x.name);
    tasks.push({
      question: `${s.emoji} Jaký je to tvar? ${s.desc}`,
      correctAnswer: s.name,
      options: shuffleArray([s.name, ...wrongOptions]),
      solutionSteps: [`Podívej se na popis: „${s.desc}".`, `To odpovídá tvaru: ${s.name}.`],
      hints: [`Popis říká: „${s.desc}" — spočítej strany a rohy.`, `Který tvar má tyto vlastnosti?`],
    });
  }

  for (const s of shapes.filter(x => x.sides > 0)) {
    const correct = `${s.sides}`;
    const distractors = new Set<string>();
    for (let d = 0; d <= 8; d++) { if (`${d}` !== correct) distractors.add(`${d}`); }
    const opts = shuffleArray([correct, ...shuffleArray([...distractors]).slice(0, 2)]);
    tasks.push({
      question: `${s.emoji} Kolik stran má ${s.name}?`,
      correctAnswer: correct,
      options: opts,
      solutionSteps: [`${s.name} má ${s.sides} stran${s.sides === 1 ? 'u' : s.sides < 5 ? 'y' : ''}.`],
      hints: [`Představ si tvar ${s.name} a spočítej jeho strany.`, `${s.desc}`],
    });
  }

  for (const s of shapes.filter(x => x.corners >= 0)) {
    const correct = `${s.corners}`;
    const distractors = new Set<string>();
    for (let d = 0; d <= 8; d++) { if (`${d}` !== correct) distractors.add(`${d}`); }
    const opts = shuffleArray([correct, ...shuffleArray([...distractors]).slice(0, 2)]);
    tasks.push({
      question: `${s.emoji} Kolik rohů má ${s.name}?`,
      correctAnswer: correct,
      options: opts,
      solutionSteps: [`${s.name} má ${s.corners} roh${s.corners === 0 ? 'ů' : s.corners < 5 ? 'y' : 'ů'}.`],
      hints: [`Rohy jsou místa, kde se strany setkávají.`, `${s.desc}`],
    });
  }

  for (const s of shapes) {
    const correct = s.rightAngles ? "ano" : "ne";
    tasks.push({
      question: `${s.emoji} Má ${s.name} pravé úhly?`,
      correctAnswer: correct,
      options: shuffleArray(["ano", "ne"]),
      solutionSteps: [s.rightAngles ? `${s.name} má pravé úhly (90°).` : `${s.name} nemá pravé úhly.`],
      hints: [`Pravý úhel vypadá jako roh čtverce (90°).`, `${s.desc}`],
    });
  }

  for (const s of shapes) {
    const correct = s.rounded ? "oblý" : "hranatý";
    tasks.push({
      question: `${s.emoji} Je ${s.name} oblý, nebo hranatý?`,
      correctAnswer: correct,
      options: shuffleArray(["oblý", "hranatý"]),
      solutionSteps: [s.rounded ? `${s.name} je oblý tvar.` : `${s.name} je hranatý tvar.`],
      hints: [`Oblé tvary nemají ostré rohy.`, `${s.desc}`],
    });
  }

  const equalSidesShapes = shapes.filter(x => x.equalSides && x.sides > 0);
  for (const s of equalSidesShapes) {
    const wrongOptions = shuffleArray(shapes.filter(x => !x.equalSides && x.sides > 0)).slice(0, 2).map(x => x.name);
    tasks.push({
      question: `Který z těchto tvarů má všechny strany stejně dlouhé?`,
      correctAnswer: s.name,
      options: shuffleArray([s.name, ...wrongOptions]),
      solutionSteps: [`${s.name} má všechny strany stejně dlouhé.`],
      hints: [`Hledej tvar, kde jsou všechny strany stejné.`, `${s.desc}`],
    });
  }

  return shuffleArray(tasks).slice(0, 60);
}

const HELP_SHAPES: HelpData = {
  hint: "Každý tvar má své typické vlastnosti — počet stran, úhlů a tvar stran (rovné nebo kulaté).",
  steps: [
    "Přečti si popis tvaru.",
    "Kolik má stran? Kolik rohů (úhlů)?",
    "Jsou strany stejně dlouhé nebo různé?",
    "Podle toho poznáš, o jaký tvar jde.",
  ],
  commonMistake: "Čtverec a obdélník se snadno pletou! Čtverec má všechny 4 strany stejné. Obdélník má dvě kratší a dvě delší.",
  example: "Tvar má 3 strany a 3 úhly → je to trojúhelník.",
  visualExamples: [
    {
      label: "Hlavní tvary",
      illustration: "⬜ Čtverec:    4 stejné strany, 4 rohy\n▬ Obdélník:   2 delší + 2 kratší strany, 4 rohy\n△ Trojúhelník: 3 strany, 3 rohy\n⭕ Kruh:       kulatý, žádné rohy a strany",
    },
  ],
};

export const SHAPES_TOPICS: TopicMetadata[] = [
  {
    id: "math-shapes",
    title: "Geometrické tvary",
    subject: "matematika",
    category: "Geometrie",
    topic: "Geometrické tvary",
    briefDescription: "Poznáš základní tvary — čtverec, obdélník, trojúhelník a kruh.",
    keywords: ["tvary", "geometrie", "čtverec", "obdélník", "trojúhelník", "kruh", "geometrické tvary"],
    goals: ["Naučíš se rozpoznat základní geometrické tvary podle jejich vlastností."],
    boundaries: ["Pouze 4 základní tvary", "Žádné výpočty", "Žádné prostorové tvary"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 1,
    inputType: "select_one",
    generator: genShapes,
    helpTemplate: HELP_SHAPES,
  },
];
