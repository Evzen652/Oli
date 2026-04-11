import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray, pickRandom, mapQPoolToTasks, type QPool } from "../helpers";

const ANIMAL_QUESTIONS: QPool[] = [
  { question: "🐕 Pes je domácí nebo volně žijící zvíře?", correct: "Domácí", options: ["Domácí", "Volně žijící"], hints: ["Pes žije s lidmi doma. Je to domácí, nebo divoké zvíře?", "Domácí zvířata chováme doma — pes, kočka, králík…"] },
  { question: "🦊 Liška je domácí nebo volně žijící zvíře?", correct: "Volně žijící", options: ["Domácí", "Volně žijící"], hints: ["Liška žije v lese, ne u lidí doma. Co to znamená?", "Zvířata, která žijí v přírodě sama, jsou volně žijící."] },
  { question: "🐄 Do které skupiny patří kráva?", correct: "Savci", options: ["Savci", "Ptáci", "Hmyz", "Plazi"], hints: ["Kráva má srst a kojí telátko mlékem. Jak se říká zvířatům, která kojí?", "Zvířata, která kojí mláďata, se jmenují…"] },
  { question: "🦅 Do které skupiny patří orel?", correct: "Ptáci", options: ["Ptáci", "Savci", "Hmyz", "Ryby"], hints: ["Orel má peří, zobák a létá. Do jaké skupiny patří?", "Zvířata s peřím a zobákem jsou…"] },
  { question: "🐝 Do které skupiny patří včela?", correct: "Hmyz", options: ["Hmyz", "Ptáci", "Savci", "Plazi"], hints: ["Včela má 6 noh a tykadla. Jak se říká takové skupině?", "Malá zvířata s 6 nohama a krovkami nebo křídly jsou…"] },
  { question: "🐸 Do které skupiny patří žába?", correct: "Obojživelníci", options: ["Obojživelníci", "Plazi", "Ryby", "Savci"], hints: ["Žába žije ve vodě i na souši. Jak se říká zvířatům, co žijí v obou prostředích?", "Obojí — voda i souš. Oboj-živelníci."] },
  { question: "🐍 Do které skupiny patří had?", correct: "Plazi", options: ["Plazi", "Obojživelníci", "Ryby", "Hmyz"], hints: ["Had má šupiny a studenou krev. Je to obojživelník, nebo plaz?", "Zvířata s šupinami a studenou krví, která žijí na souši, jsou…"] },
  { question: "🐟 Do které skupiny patří kapr?", correct: "Ryby", options: ["Ryby", "Obojživelníci", "Savci", "Hmyz"], hints: ["Kapr žije celý život ve vodě a dýchá žábrami. Co to je za skupinu?", "Zvířata s ploutvemi a žábrami jsou…"] },
  { question: "🐱 Kočka je domácí nebo volně žijící zvíře?", correct: "Domácí", options: ["Domácí", "Volně žijící"], hints: ["Kočka žije s lidmi doma, chováme ji jako mazlíčka.", "Domácí zvíře = žije s lidmi. Platí to pro kočku?"] },
  { question: "🦌 Jelen je domácí nebo volně žijící zvíře?", correct: "Volně žijící", options: ["Domácí", "Volně žijící"], hints: ["Jelen žije v lese. Chová ho někdo doma?", "Zvířata v lese, která nikdo nechová, jsou volně žijící."] },
  { question: "🐔 Do které skupiny patří slepice?", correct: "Ptáci", options: ["Ptáci", "Savci", "Plazi", "Hmyz"], hints: ["Slepice má peří, zobák a snáší vejce. Co je to za skupinu?", "Peří + zobák + vejce = …"] },
  { question: "🦎 Do které skupiny patří ještěrka?", correct: "Plazi", options: ["Plazi", "Obojživelníci", "Hmyz", "Savci"], hints: ["Ještěrka má šupiny a vyhřívá se na slunci. Je to plaz, nebo obojživelník?", "Plazi mají šupiny a studenou krev — ještěrka, had, krokodýl…"] },
  // Nové otázky
  { question: "🐴 Do které skupiny patří kůň?", correct: "Savci", options: ["Savci", "Ptáci", "Plazi", "Ryby"], hints: ["Kůň má srst a kobyla kojí hříbě.", "Zvířata, která kojí mláďata, jsou savci."] },
  { question: "🐢 Želva je plaz nebo obojživelník?", correct: "Plaz", options: ["Plaz", "Obojživelník", "Savec", "Ryba"], hints: ["Želva má krunýř a šupiny. Žije hlavně na souši.", "Šupiny + studená krev = plaz."] },
  { question: "🦋 Do které skupiny patří motýl?", correct: "Hmyz", options: ["Hmyz", "Ptáci", "Savci", "Obojživelníci"], hints: ["Motýl má 6 noh a křídla s barevnými šupinkami.", "Malé létající stvoření s 6 nohama = hmyz."] },
  { question: "🐬 Do které skupiny patří delfín?", correct: "Savci", options: ["Savci", "Ryby", "Obojživelníci", "Plazi"], hints: ["Delfín žije ve vodě, ale dýchá plícemi a kojí mláďata.", "I když žije ve vodě, kojí mláďata — je to savec!"] },
  { question: "🐓 Kohout je samec jakého zvířete?", correct: "Slepice", options: ["Slepice", "Kachny", "Husy", "Krávy"], hints: ["Kohout kokrhá na dvorku. Slepice snáší vejce. Patří k sobě.", "Kohout = samec, slepice = samice."] },
  { question: "🐰 Králík je domácí nebo volně žijící zvíře?", correct: "Může být obojí", options: ["Může být obojí", "Jen domácí", "Jen volně žijící", "Ani jedno"], hints: ["Králíka můžeš chovat doma, ale žije i v přírodě.", "Divoký králík žije v norách, domácí králík v kleci."] },
  { question: "🦉 Kdy loví sova?", correct: "V noci", options: ["V noci", "Ráno", "V poledne", "Nikdy neloví"], hints: ["Sova má velké oči, aby viděla ve tmě.", "Sova je noční dravec — loví v noci."] },
  { question: "🐊 Do které skupiny patří krokodýl?", correct: "Plazi", options: ["Plazi", "Obojživelníci", "Savci", "Ryby"], hints: ["Krokodýl má tvrdé šupiny a studenou krev.", "Krokodýl, had, ještěrka — všichni jsou plazi."] },
  { question: "🐧 Tučňák létá?", correct: "Ne, ale výborně plave", options: ["Ne, ale výborně plave", "Ano, létá", "Ne a neplave", "Ano, ale jen trochu"], hints: ["Tučňák má křídla, ale jsou krátká. K čemu je používá?", "Tučňák je pták, ale nelétá — místo toho plave."] },
];

const HELP_ANIMALS: HelpData = {
  hint: "Zvířata dělíme podle toho, jak vypadají, kde žijí a jak se rodí.",
  steps: ["Přečti otázku — o jaké zvíře jde?", "Vzpomeň si — má srst, peří, šupiny, nebo krovky?", "Savci mají srst a kojí mláďata. Ptáci mají peří. Hmyz má 6 noh."],
  commonMistake: "Žába NENÍ plaz — je to obojživelník (žije ve vodě i na souši)!",
  example: "🐄 Kráva → savec (srst, kojí telátko) ✅",
  visualExamples: [{ label: "Skupiny zvířat", illustration: "🐄 SAVCI — srst, kojí mláďata (pes, kočka, kráva)\n🦅 PTÁCI — peří, zobák, vejce (orel, slepice)\n🐝 HMYZ — 6 noh, tykadla (včela, motýl)\n🐸 OBOJŽIVELNÍCI — ve vodě i na souši (žába)\n🐍 PLAZI — šupiny, studená krev (had, ještěrka)\n🐟 RYBY — ploutve, žábry (kapr, pstruh)" }],
};

function genFoodChain(_level: number): PracticeTask[] {
  const chains = [
    { items: ["Tráva", "Zajíc", "Liška"], question: "🔗 Seřaď potravní řetězec — kdo koho jí:", hints: ["Na začátku je rostlina — tráva. Kdo ji jí?", "Trávu jí zajíc a zajíce loví liška."] },
    { items: ["List stromu", "Housenka", "Sýkora"], question: "🔗 Seřaď potravní řetězec v lese:", hints: ["Začni od rostliny — list stromu. Kdo okusuje listy?", "Housenka jí listy a sýkora jí housenky."] },
    { items: ["Řasa", "Malá rybka", "Štika"], question: "🔗 Seřaď potravní řetězec v rybníce:", hints: ["V rybníce začíná řetězec řasou. Kdo se řasami živí?", "Malá rybka jí řasy a štika loví malé rybky."] },
    { items: ["Obilí", "Myš", "Kočka"], question: "🔗 Seřaď potravní řetězec na farmě:", hints: ["Na farmě roste obilí. Kdo ho okusuje?", "Obilí → myš → kočka. Kočka loví myši."] },
    { items: ["Tráva", "Kobylka", "Ještěrka"], question: "🔗 Seřaď potravní řetězec na louce:", hints: ["Kobylka jí trávu. Kdo jí kobylky?", "Ještěrka loví hmyz — včetně kobylek."] },
    { items: ["Jablko", "Červ", "Kos"], question: "🔗 Seřaď potravní řetězec v zahradě:", hints: ["Červ žije v jablku — jí ho. Kdo jí červy?", "Kos hledá červy v zemi a jí je."] },
    { items: ["Semínko", "Hraboš", "Poštolka"], question: "🔗 Seřaď potravní řetězec na poli:", hints: ["Hraboš hledá semínka v zemi. Kdo loví hraboše?", "Poštolka je dravec — loví hraboše z výšky."] },
    { items: ["Žalud", "Veverka", "Kuna"], question: "🔗 Seřaď potravní řetězec v dubovém lese:", hints: ["Žaludy padají ze stromu. Kdo je sbírá?", "Veverka sbírá žaludy a kuna loví veverky."] },
    { items: ["Tráva", "Myš", "Had"], question: "🔗 Seřaď potravní řetězec na louce:", hints: ["Myš jí semínka a trávu. Kdo loví myši?", "Had loví myši — je na konci řetězce."] },
    { items: ["Květ", "Včela", "Žába"], question: "🔗 Seřaď potravní řetězec u potoka:", hints: ["Včela sbírá nektar z květů. Kdo jí včely?", "Žába chytá hmyz — včetně včel."] },
  ];
  return pickRandom(chains, chains.length).map((c) => ({ question: c.question, correctAnswer: c.items.join(","), items: c.items, hints: c.hints }));
}

const HELP_FOOD_CHAIN: HelpData = {
  hint: "Potravní řetězec ukazuje, kdo koho jí — od rostliny po dravce.",
  steps: ["Najdi rostlinu — ta je vždy na začátku.", "Kdo ji jí? To je býložravec.", "Kdo jí býložravce? To je dravec.", "Seřaď od rostliny (dole) po dravce (nahoře)."],
  commonMistake: "Rostlina je VŽDY na začátku řetězce — tráva → zajíc → liška, ne naopak!",
  example: "🌿 Tráva → 🐰 Zajíc → 🦊 Liška → 🦅 Orel ✅",
  visualExamples: [{ label: "Potravní řetězec", illustration: "🌿 Rostlina (vyrábí potravu ze slunce)\n  ↓ jí ji\n🐰 Býložravec (jí rostliny)\n  ↓ jí ho\n🦊 Šelma (jí menší zvířata)\n  ↓ jí ji\n🦅 Dravec (na vrcholu)" }],
};

export const ANIMALS_TOPICS: TopicMetadata[] = [
  { id: "pr-animals", title: "Zvířata", subject: "prvouka", category: "Příroda kolem nás", topic: "Zvířata",
    topicDescription: "Rozlišíš domácí a volně žijící zvířata a poznáš hlavní skupiny.",
    briefDescription: "Rozlišíš domácí a volně žijící zvířata a naučíš se skupiny: savci, ptáci, hmyz…",
    keywords: ["zvířata", "savci", "ptáci", "hmyz", "plazi", "ryby", "domácí zvířata", "volně žijící"],
    goals: ["Naučíš se rozdělit zvířata do skupin a rozlišit domácí od volně žijících."],
    boundaries: ["Pouze základní skupiny", "Žádná taxonomie"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(ANIMAL_QUESTIONS), helpTemplate: HELP_ANIMALS },
  { id: "pr-food-chain", title: "Potravní řetězec", subject: "prvouka", category: "Příroda kolem nás", topic: "Zvířata",
    topicDescription: "Rozlišíš domácí a volně žijící zvířata a poznáš hlavní skupiny.",
    briefDescription: "Seřadíš, kdo koho jí — od rostliny přes býložravce po dravce.",
    keywords: ["potravní řetězec", "kdo koho jí", "dravec", "býložravec", "potravinový řetězec"],
    goals: ["Naučíš se sestavit jednoduchý potravní řetězec."],
    boundaries: ["Pouze jednoduché řetězce", "Žádné potravní sítě"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "drag_order",
    generator: genFoodChain, helpTemplate: HELP_FOOD_CHAIN },
];
