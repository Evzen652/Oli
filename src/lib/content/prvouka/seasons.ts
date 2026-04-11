import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray, pickRandom, mapQPoolToTasks, type QPool } from "../helpers";

const SEASONS_QUESTIONS: QPool[] = [
  { question: "🌸 Kdy začínají kvést stromy a taje sníh?", correct: "Na jaře", options: ["Na jaře", "V létě", "Na podzim", "V zimě"], hints: ["Sníh taje a stromy začínají kvést — to je začátek teplejšího období.", "Jaro přichází po zimě — příroda se probouzí."] },
  { question: "☀️ Kdy je nejtepleji a děti mají prázdniny?", correct: "V létě", options: ["V létě", "Na jaře", "Na podzim", "V zimě"], hints: ["Prázdniny jsou v červenci a srpnu. Jaké je to roční období?", "Nejteplejší měsíce roku — červen, červenec, srpen."] },
  { question: "🍂 Kdy opadává listí a dny se zkracují?", correct: "Na podzim", options: ["Na podzim", "V zimě", "Na jaře", "V létě"], hints: ["Listí žloutne a padá ze stromů. Kdy to vidíš venku?", "Dny se zkracují, je chladněji — to je období mezi létem a zimou."] },
  { question: "❄️ Kdy padá sníh a jezera zamrzají?", correct: "V zimě", options: ["V zimě", "Na podzim", "Na jaře", "V létě"], hints: ["Sníh a mráz — to je nejchladnější roční období.", "Prosinec, leden, únor — jezera zamrzají a padá sníh."] },
  { question: "🐿️ Kdy si veverka schovává zásoby na zimu?", correct: "Na podzim", options: ["Na podzim", "Na jaře", "V létě", "V zimě"], hints: ["Veverka se připravuje na zimu dopředu. V jakém ročním období?", "Zásoby si schová ještě PŘED zimou — kdy to je?"] },
  { question: "🌷 Kdy rozkvetou první sněženky a krokusy?", correct: "Na jaře", options: ["Na jaře", "V létě", "Na podzim", "V zimě"], hints: ["Sněženky jsou jedny z prvních květin po zimě. Kdy kvetou?", "Příroda se probouzí — sníh taje a první květiny vykukují."] },
  { question: "🦔 Kdy ježek usíná zimním spánkem?", correct: "Na podzim / v zimě", options: ["Na podzim / v zimě", "Na jaře", "V létě", "Nikdy nespí"], hints: ["Ježek spí přes zimu, protože není dost potravy. Kdy usíná?", "Zimní spánek začíná, když je zima a málo jídla — na podzim."] },
  { question: "🌻 Kdy kvetou slunečnice?", correct: "V létě", options: ["V létě", "Na jaře", "Na podzim", "V zimě"], hints: ["Slunečnice potřebují hodně slunce. Kdy svítí nejvíc?", "Slunečnice kvetou v nejteplejším období roku."] },
  { question: "🍄 Kdy v lese najdeme nejvíc hub?", correct: "Na podzim", options: ["Na podzim", "Na jaře", "V létě", "V zimě"], hints: ["Houby rostou ve vlhku a chladu. Které roční období je vlhké a chladnější?", "Podzim je hlavní houbařská sezóna — září a říjen."] },
  { question: "🐣 Kdy se rodí většina mláďat?", correct: "Na jaře", options: ["Na jaře", "V létě", "Na podzim", "V zimě"], hints: ["Mláďata se rodí, když je v přírodě dost potravy. Kdy příroda ožívá?", "Po zimě přichází teplo a jídla je dost — to je ideální čas."] },
  // Nové otázky
  { question: "🌧️ Kdy jsou nejdelší dny v roce?", correct: "V létě", options: ["V létě", "V zimě", "Na jaře", "Na podzim"], hints: ["V létě je světlo déle — slunce svítí do večera.", "Nejdelší den je kolem 21. června."] },
  { question: "🌙 Kdy jsou nejkratší dny v roce?", correct: "V zimě", options: ["V zimě", "V létě", "Na jaře", "Na podzim"], hints: ["V zimě se stmívá brzy odpoledne.", "Nejkratší den je kolem 21. prosince."] },
  { question: "🐦 Kdy se stěhovaví ptáci vracejí?", correct: "Na jaře", options: ["Na jaře", "V zimě", "Na podzim", "V létě"], hints: ["Ptáci odlétají na podzim a vracejí se, když je teplo.", "Na jaře přilétají zpět — vlaštovky, čápi, kukačky."] },
  { question: "🐦 Kdy stěhovaví ptáci odlétají na jih?", correct: "Na podzim", options: ["Na podzim", "Na jaře", "V létě", "V zimě"], hints: ["Před zimou ptáci odlétají do teplých krajin.", "Na podzim se stěhují na jih — připravují se na zimu."] },
  { question: "⛷️ Jaký sport děláme typicky v zimě?", correct: "Lyžování", options: ["Lyžování", "Plavání", "Cyklistiku", "Fotbal"], hints: ["Potřebuješ sníh a hory. Jaký sport to je?", "Na lyžích jezdíme po sněhu — v zimě."] },
  { question: "🌾 Kdy se sklízí obilí?", correct: "V létě", options: ["V létě", "Na jaře", "Na podzim", "V zimě"], hints: ["Obilí zraje v nejteplejším období roku.", "V červenci a srpnu se na polích sklízí obilí."] },
  { question: "🎄 Ve kterém ročním období slavíme Vánoce?", correct: "V zimě", options: ["V zimě", "Na podzim", "Na jaře", "V létě"], hints: ["Vánoce jsou v prosinci. Jaké je to roční období?", "Prosinec = zima. Vánoce slavíme v zimě."] },
  { question: "🌸 Který je první jarní měsíc?", correct: "Březen", options: ["Březen", "Květen", "Duben", "Únor"], hints: ["Jaro začíná kolem 20. března.", "Březen je první měsíc jara."] },
  { question: "🍁 Co se děje se stromy na podzim?", correct: "Listí žloutne a opadává", options: ["Listí žloutne a opadává", "Stromy kvetou", "Rostou nové listy", "Nic se neděje"], hints: ["Na podzim se mění barva listí. Co pak s ním je?", "Listy žloutnou, červenají a nakonec spadnou."] },
];

const HELP_SEASONS: HelpData = {
  hint: "Rok má 4 roční období — jaro, léto, podzim, zima.",
  steps: ["Přečti otázku — o jaké přírodní změně se mluví?", "Vzpomeň si, kdy to obvykle vidíš venku.", "Přiřaď správné roční období."],
  commonMistake: "Listí padá na PODZIM, ne v zimě — v zimě jsou stromy už holé!",
  example: "🍂 Kdy opadává listí? → Na podzim ✅",
  visualExamples: [{ label: "4 roční období", illustration: "🌸 JARO — kvete, taje, mláďata se rodí\n☀️ LÉTO — teplo, prázdniny, slunečnice\n🍂 PODZIM — listí padá, houby, zásoby\n❄️ ZIMA — sníh, mráz, zimní spánek" }],
};

function genSeasonsOrder(_level: number): PracticeTask[] {
  const chains = [
    { items: ["Jaro", "Léto", "Podzim", "Zima"], question: "🔄 Seřaď roční období:", hints: ["Po zimě přichází… které období?", "Jaro → Léto → Podzim → Zima."] },
    { items: ["Březen", "Duben", "Květen"], question: "🌸 Seřaď jarní měsíce:", hints: ["Jaro začíná březnem. Co následuje?", "Březen, duben, květen — to je jaro."] },
    { items: ["Červen", "Červenec", "Srpen"], question: "☀️ Seřaď letní měsíce:", hints: ["Léto začíná červnem. Prázdniny jsou potom.", "Červen, červenec, srpen."] },
    { items: ["Září", "Říjen", "Listopad"], question: "🍂 Seřaď podzimní měsíce:", hints: ["Podzim začíná zářím — školní rok. Co dál?", "Září, říjen, listopad."] },
    { items: ["Prosinec", "Leden", "Únor"], question: "❄️ Seřaď zimní měsíce:", hints: ["Zima začíná prosincem — Vánoce! Co dál?", "Prosinec, leden, únor."] },
    // Nové řazení
    { items: ["Zima", "Jaro", "Léto", "Podzim"], question: "🔄 Seřaď roční období počínaje zimou:", hints: ["Začni zimou. Co přijde po zimě?", "Zima → jaro → léto → podzim."] },
    { items: ["Sněženka", "Tulipán", "Slunečnice", "Chryzantéma"], question: "🌸 Seřaď květiny podle toho, kdy kvetou:", hints: ["Sněženka kvete na jaře jako první. Co pak?", "Sněženka (jaro) → tulipán (jaro) → slunečnice (léto) → chryzantéma (podzim)."] },
    { items: ["Sníh taje", "Stromy kvetou", "Ovoce zraje", "Listí padá", "Padá sníh"], question: "🔄 Seřaď přírodní jevy během roku:", hints: ["Začni od jara — co se děje se sněhem?", "Tání → kvetení → zrání → opadávání → sněžení."] },
    { items: ["Ptáci se vrací", "Mláďata se rodí", "Sklizeň obilí", "Ptáci odlétají", "Zvířata usínají"], question: "🐦 Seřaď události v přírodě během roku:", hints: ["Na jaře se ptáci vrací. Co dalšího se děje na jaře?", "Návrat ptáků → mláďata → sklizeň → odlet → zimní spánek."] },
  ];
  return pickRandom(chains, chains.length).map((c) => ({ question: c.question, correctAnswer: c.items.join(","), items: c.items, hints: c.hints }));
}

const HELP_SEASONS_ORDER: HelpData = {
  hint: "Roční období se opakují: jaro → léto → podzim → zima → jaro…",
  steps: ["Přečti, co máš seřadit — roční období, nebo měsíce?", "Vzpomeň si na kalendář.", "Seřaď ve správném pořadí."],
  commonMistake: "Zimní měsíce jsou prosinec, leden, únor — NE říjen a listopad (to je podzim)!",
  example: "🔄 Jaro → Léto → Podzim → Zima ✅",
  visualExamples: [{ label: "Roční období a měsíce", illustration: "🌸 JARO: březen, duben, květen\n☀️ LÉTO: červen, červenec, srpen\n🍂 PODZIM: září, říjen, listopad\n❄️ ZIMA: prosinec, leden, únor" }],
};

export const SEASONS_TOPICS: TopicMetadata[] = [
  { id: "pr-seasons", title: "Roční období", subject: "prvouka", category: "Příroda kolem nás", topic: "Roční období a počasí",
    topicDescription: "Poznáš 4 roční období, typické znaky přírody a naučíš se měsíce.",
    briefDescription: "Poznáš 4 roční období a typické znaky přírody — kvetení, listí, sníh…",
    keywords: ["roční období", "jaro", "léto", "podzim", "zima", "příroda"],
    goals: ["Naučíš se rozlišit roční období a přiřadit k nim přírodní jevy."],
    boundaries: ["Pouze základní znaky ročních období", "Žádná meteorologie"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(SEASONS_QUESTIONS), helpTemplate: HELP_SEASONS },
  { id: "pr-seasons-order", title: "Pořadí ročních období a měsíců", subject: "prvouka", category: "Příroda kolem nás", topic: "Roční období a počasí",
    topicDescription: "Poznáš 4 roční období, typické znaky přírody a naučíš se měsíce.",
    briefDescription: "Seřadíš roční období a měsíce ve správném pořadí.",
    keywords: ["měsíce", "pořadí měsíců", "pořadí ročních období", "kalendář"],
    goals: ["Naučíš se správné pořadí ročních období a měsíců v roce."],
    boundaries: ["Pouze správné pořadí", "Žádné počítání dnů"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "drag_order",
    generator: genSeasonsOrder, helpTemplate: HELP_SEASONS_ORDER },
];
