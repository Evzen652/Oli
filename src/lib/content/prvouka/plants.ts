import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray, pickRandom, mapQPoolToTasks, type QPool } from "../helpers";

// ── Části rostliny ─────────────────────────────────────────
const PLANT_QUESTIONS: QPool[] = [
  { question: "🌱 Která část rostliny je ukrytá v zemi a nasává vodu?", correct: "Kořen", options: ["Kořen", "Stonek", "List", "Květ"], hints: ["Tato část je pod zemí — nevidíš ji, ale bez ní by rostlina neměla vodu.", "Ze země nasává vodu a živiny — je to kořen, stonek, list, nebo květ?"] },
  { question: "🌿 Která část drží listy a květy a vede vodu nahoru?", correct: "Stonek", options: ["Stonek", "Kořen", "Plod", "Květ"], hints: ["Je to ta rovná část rostliny uprostřed, na které rostou listy.", "Voda jde z kořene nahoru — čím? Co drží celou rostlinu?"] },
  { question: "🍃 Která část rostliny zachycuje světlo a vyrábí potravu?", correct: "List", options: ["List", "Květ", "Kořen", "Plod"], hints: ["Je zelený a plochý — zachycuje sluneční paprsky.", "V této části rostlina vyrábí potravu ze světla. Je zelená."] },
  { question: "🌸 Která část rostliny láká hmyz a vzniká z ní plod?", correct: "Květ", options: ["Květ", "List", "Stonek", "Kořen"], hints: ["Je barevná, voní a včely ji navštěvují. Co to je?", "Z této části po opylení vznikne plod se semeny."] },
  { question: "🍎 Co vznikne z květu po opylení?", correct: "Plod se semeny", options: ["Plod se semeny", "Nový list", "Nový kořen", "Nový květ"], hints: ["Včela opylí květ — co se z květu postupně vytvoří?", "Jablko, třešeň, rajče — to jsou plody. Jsou v nich semena."] },
  { question: "💧 Co rostlina potřebuje k růstu kromě vody?", correct: "Světlo a živiny z půdy", options: ["Světlo a živiny z půdy", "Jen vodu", "Jen vzduch", "Tmu"], hints: ["Rostliny stojí na slunci — proč? Co z něj získávají?", "Kromě vody potřebují energii ze slunce a výživu z půdy."] },
  { question: "🌻 Proč se slunečnice otáčí za sluncem?", correct: "Potřebuje hodně světla", options: ["Potřebuje hodně světla", "Má ráda teplo", "Je to náhoda", "Kvůli větru"], hints: ["Slunečnice se natáčí ke slunci. Co od slunce potřebuje?", "Rostliny potřebují světlo k výrobě potravy — proto se za ním otáčí."] },
  { question: "🌰 K čemu slouží semeno?", correct: "Vyroste z něj nová rostlina", options: ["Vyroste z něj nová rostlina", "Krmí kořen", "Zdobí květ", "Chrání list"], hints: ["Když zasadíš semínko do země a zaliješ ho — co se stane?", "Semeno je začátek nové rostliny. Klíčí a roste."] },
  // Nové otázky
  { question: "🌿 Proč jsou listy většinou zelené?", correct: "Obsahují chlorofyl", options: ["Obsahují chlorofyl", "Jsou natřené", "Pijí zelenou vodu", "Je to náhoda"], hints: ["Zelená barva listů pochází z jedné důležité látky.", "Chlorofyl je zelená látka, která pomáhá vyrábět potravu ze světla."] },
  { question: "🍂 Proč na podzim listy mění barvu?", correct: "Chlorofyl se rozkládá", options: ["Chlorofyl se rozkládá", "Listy umrznou", "Strom je natře", "Déšť je obarví"], hints: ["Zelená barva zmizí a objeví se žlutá a červená. Proč?", "Chlorofyl (zelená látka) se na podzim rozkládá — a objeví se jiné barvy."] },
  { question: "🌳 Jak se říká stromům, které na zimu shazují listí?", correct: "Opadavé (listnaté)", options: ["Opadavé (listnaté)", "Jehličnaté", "Stálezelené", "Zimní"], hints: ["Na podzim listí opadá. Jak se takovým stromům říká?", "Opadavé stromy ztrácejí listy na zimu — dub, buk, lípa…"] },
  { question: "🌲 Jak se říká stromům, které mají jehličí celý rok?", correct: "Jehličnaté (stálezelené)", options: ["Jehličnaté (stálezelené)", "Listnaté", "Opadavé", "Letní"], hints: ["Smrk, borovice, jedle — mají jehličí i v zimě.", "Jehličnaté stromy jsou zelené celý rok — jsou stálezelené."] },
  { question: "🐝 Kdo opyluje květy?", correct: "Hmyz (včely, motýli)", options: ["Hmyz (včely, motýli)", "Ryby", "Hadi", "Žáby"], hints: ["Malá zvířátka přeletují z květu na květ a přenášejí pyl.", "Včely a motýli sbírají nektar a při tom přenášejí pyl."] },
  { question: "🌱 Co je klíčení?", correct: "Když semeno začne růst", options: ["Když semeno začne růst", "Když list spadne", "Když květ zvadne", "Když kořen uschne"], hints: ["Semeno v zemi dostane vodu a… co se začne dít?", "Klíčení = semeno se probudí a začne z něj růst kořínek a stonek."] },
  { question: "🍎 Které z těchto je plod?", correct: "Jablko", options: ["Jablko", "Kořen mrkve", "List salátu", "Stonek celeru"], hints: ["Plod obsahuje semena a vzniká z květu.", "Jablko roste na stromě z květu a uvnitř má jadérka (semena)."] },
  { question: "🥕 Která část mrkve jíme?", correct: "Kořen", options: ["Kořen", "Stonek", "List", "Květ"], hints: ["Mrkev roste pod zemí. Kterou část rostliny tam najdeme?", "Oranžová část mrkve je kořen — roste v zemi."] },
];

const HELP_PLANT: HelpData = {
  hint: "Rostlina má 5 hlavních částí: kořen, stonek, list, květ a plod.",
  steps: ["Přečti otázku — o jaké části rostliny se mluví?", "Vzpomeň si, kde se ta část nachází a co dělá.", "Vyber správnou odpověď."],
  commonMistake: "Plod není totéž co květ — plod vznikne Z květu po opylení!",
  example: "🌱 Co nasává vodu ze země? → Kořen ✅",
  visualExamples: [{ label: "Části rostliny", illustration: "🌸 Květ (nahoře — láká hmyz)\n🍃 List (po stranách — vyrábí potravu)\n🌿 Stonek (uprostřed — drží a vede vodu)\n🌱 Kořen (v zemi — nasává vodu)\n🍎 Plod (z květu — obsahuje semena)" }],
};

// ── Životní cyklus ─────────────────────────────────────────
function genPlantLifecycle(_level: number): PracticeTask[] {
  const chains = [
    { items: ["Semeno v zemi", "Klíčení (kořínek)", "Mladá rostlinka", "Dospělá rostlina s květem", "Plod se semeny"], question: "🌱 Seřaď životní cyklus rostliny:", hints: ["Co je na úplném začátku — z čeho rostlina vyrůstá?", "Semeno → klíčí → roste → kvete → plodí. Co je první?"] },
    { items: ["Zasadíme semínko", "Zalijeme vodou", "Vyroste klíček", "Rostlina kvete", "Vznikne plod"], question: "🌻 Seřaď, jak pěstujeme slunečnici:", hints: ["Nejdřív musíš semínko zasadit. Co uděláš hned potom?", "Po zasazení a zalití čekáme — vyroste klíček, pak kvete a nakonec plodí."] },
    { items: ["Včela navštíví květ", "Pyl se přenese", "Květ se změní v plod", "V plodu jsou semena", "Semena padají do země"], question: "🐝 Seřaď opylení a vznik semena:", hints: ["Opylení začíná návštěvou včely. Co včela přenáší?", "Včela přenese pyl → květ se změní v plod → v plodu jsou semena."] },
    // Nové cykly
    { items: ["Žalud spadne na zem", "Žalud klíčí", "Vyroste mladý dubek", "Dub roste desítky let", "Dospělý dub má žaludy"], question: "🌳 Seřaď životní cyklus dubu:", hints: ["Dub začíná jako žalud. Co se stane, když spadne na zem?", "Žalud → klíčí → mladý strom → dospělý dub → nové žaludy."] },
    { items: ["Semínko rajčete", "Klíček s lístky", "Rostlina kvete žlutě", "Zelené rajče", "Červené zralé rajče"], question: "🍅 Seřaď růst rajčete:", hints: ["Rajče začíná jako semínko. Co vyroste první?", "Semínko → klíček → květ → zelené rajče → zralé červené rajče."] },
    { items: ["Cibulka tulipánu v zemi", "Kořínek roste dolů", "Stonek prorazí zem", "Poupě se otevře", "Tulipán kvete"], question: "🌷 Seřaď, jak roste tulipán:", hints: ["Tulipán začíná jako cibulka v zemi.", "Cibulka → kořínek → stonek → poupě → květ."] },
    { items: ["Jádro třešně v zemi", "Klíček se objeví", "Stromek roste", "Strom kvete na jaře", "Na stromě rostou třešně"], question: "🍒 Seřaď růst třešně od jádra:", hints: ["Třešeň začíná jako jádro (pecka) v zemi.", "Jádro → klíček → stromek → kvetení → třešně."] },
  ];
  return pickRandom(chains, chains.length).map((c) => ({ question: c.question, correctAnswer: c.items.join(","), items: c.items, hints: c.hints }));
}

const HELP_LIFECYCLE: HelpData = {
  hint: "Rostlina začíná jako semeno a postupně roste.",
  steps: ["Začni od začátku — kde je semeno?", "Co se stane, když dostane vodu a světlo?", "Seřaď kroky od semena po novou rostlinu."],
  commonMistake: "Květ přijde PŘED plodem — plod vzniká teprve z květu.",
  example: "🌱 Semeno → Klíčení → Mladá rostlina → Květ → Plod se semeny ✅",
  visualExamples: [{ label: "Životní cyklus", illustration: "🌰 Semeno v zemi\n  ↓ 💧\n🌱 Klíček (kořínek)\n  ↓ ☀️\n🌿 Mladá rostlinka\n  ↓\n🌸 Kvete!\n  ↓ 🐝\n🍎 Plod se semeny\n  ↓ (padají)\n🌰 Nové semeno…" }],
};

export const PLANTS_TOPICS: TopicMetadata[] = [
  { id: "pr-plant-parts", title: "Části rostliny", subject: "prvouka", category: "Příroda kolem nás", topic: "Rostliny",
    topicDescription: "Poznáš části rostliny, její životní podmínky a jak se rozmnožuje.",
    briefDescription: "Poznáš 5 hlavních částí rostliny a zjistíš, co každá dělá.",
    keywords: ["rostlina", "části rostliny", "kořen", "stonek", "list", "květ", "plod"],
    goals: ["Naučíš se pojmenovat části rostliny a vysvětlit jejich funkci."],
    boundaries: ["Pouze základní části", "Žádná buněčná biologie"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(PLANT_QUESTIONS), helpTemplate: HELP_PLANT },
  { id: "pr-plant-lifecycle", title: "Životní cyklus rostliny", subject: "prvouka", category: "Příroda kolem nás", topic: "Rostliny",
    topicDescription: "Poznáš části rostliny, její životní podmínky a jak se rozmnožuje.",
    briefDescription: "Seřadíš kroky od semínka po dospělou rostlinu s plody.",
    keywords: ["životní cyklus", "růst rostliny", "semeno", "klíčení", "opylení"],
    goals: ["Naučíš se správné pořadí životního cyklu rostliny."],
    boundaries: ["Pouze základní cyklus", "Žádné rozmnožování sporami"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "drag_order",
    generator: genPlantLifecycle, helpTemplate: HELP_LIFECYCLE },
];
