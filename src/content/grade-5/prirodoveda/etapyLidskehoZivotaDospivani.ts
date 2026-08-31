import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  { question: "Jak se jmenuje etapa vývoje člověka od 0 do 1 roku?", correctAnswer: "Kojenec", options: ["Kojenec", "Batole", "Novorozenec", "Předškolní dítě"], hints: ["Pořadí raných etap: novorozenec (první týdny) → kojenec (do 1 roku) → batole (1–3 roky) → předškolní dítě (3–6 let)."] },
  { question: "Jaká je etapa vývoje od 1 do 3 let?", correctAnswer: "Batole", options: ["Batole", "Kojenec", "Předškolní dítě", "Školní dítě"], hints: ["Pořadí raných etap: kojenec (do 1 roku) → batole (1–3 roky) → předškolní dítě (3–6 let) → školní dítě (6–11 let)."] },
  { question: "V jakém věku začíná puberta u dívek přibližně?", correctAnswer: "10–13 let", options: ["10–13 let", "15–18 let", "7–9 let", "14–16 let"], hints: ["Puberta dívek začíná dříve než u chlapců."] },
  { question: "V jakém věku začíná puberta u chlapců přibližně?", correctAnswer: "11–14 let", options: ["11–14 let", "8–10 let", "16–18 let", "5–7 let"], hints: ["Chlapci vcházejí do puberty o něco později než dívky."] },
  { question: "Jaké jsou typické tělesné změny v pubertě?", correctAnswer: "Rychlý růst, rozvoj pohlavních znaků, změna hlasu (chlapci), menstruace – dívky", options: ["Rychlý růst, rozvoj pohlavních znaků, změna hlasu (chlapci), menstruace – dívky", "Zpomalení růstu a snížení hmotnosti", "Zmizení mléčných zubů a růst stálých", "Zlepšení koordinace a fyzické výkonnosti"], hints: ["Puberta = přechod z dětství do dospělosti."] },
  { question: "Které hormony způsobují změny v pubertě?", correctAnswer: "Estrogen u dívek a testosteron u chlapců", options: ["Inzulín a glukagon ze slinivky", "Estrogen u dívek a testosteron u chlapců", "Adrenalin a kortizol z nadledvin", "Dopamin a serotonin z mozku"], hints: ["Hormony = chemičtí poslové v krvi."] },
  { question: "Co je adolescence?", correctAnswer: "Vývojová etapa od 11 do 18 let – dospívání", options: ["Vývojová etapa od 11 do 18 let – dospívání", "Vývojová etapa od 3 do 6 let", "Etapa po 65 letech věku", "Prenatální vývojová etapa"], hints: ["Adolescence = latinsky 'dospívat'."] },
  { question: "Co se v dospívání mění emocionálně?", correctAnswer: "Kolísání nálad, hledání identity, větší citlivost, důležitost vrstevníků", options: ["Kolísání nálad, hledání identity, větší citlivost, důležitost vrstevníků", "Úplný klid a vyrovnanost díky hormonům", "Ztráta zájmu o přátele a rodinu", "Snížení citlivosti na sociální situace"], hints: ["Hormony ovlivňují i emoce, nejen tělo."] },
  { question: "Která etapa lidského života trvá od 18 do 65 let?", correctAnswer: "Dospělost", options: ["Dospělost", "Adolescence", "Stáří", "Puberta"], hints: ["Pořadí pozdějších etap: puberta / adolescence (11–18 let) → dospělost (18–65 let) → stáří (65+ let)."] },
  { question: "Jak se označuje etapa po 65 letech?", correctAnswer: "Stáří", options: ["Stáří", "Dospělost", "Adolescence", "Pozdní puberta"], hints: ["Pořadí pozdějších etap: adolescence (11–18 let) → dospělost (18–65 let) → stáří (65+ let)."] },
  { question: "Proč jsou v pubertě normální akné (pupínky)?", correctAnswer: "Hormony způsobují zvýšenou produkci kožního mazu, který ucpává póry a způsobuje záněty", options: ["Hormony způsobují zvýšenou produkci kožního mazu, který ucpává póry a způsobuje záněty", "Špatná hygiena je jediná příčina akné v pubertě", "Akné způsobují sluneční paprsky při kontaktu s kůží", "Akné je příznak alergické reakce na nové potraviny"], hints: ["Androgeny (testosteron) stimulují mazové žlázy."] },
  { question: "Proč je důležitá komunikace s rodiči v období dospívání?", correctAnswer: "Rodiče mají zkušenosti a mohou pomoci při řešení problémů – dospívání přináší nové situace, které může být těžké zvládnout sám", options: ["Rodiče mají zkušenosti a mohou pomoci při řešení problémů – dospívání přináší nové situace, které může být těžké zvládnout sám", "Komunikace s rodiči je v pubertě zbytečná – vrstevníci jsou důležitější", "Rodiče nerozumí pubertě – nemá smysl s nimi mluvit", "Komunikace s rodiči je povinná ze zákona"], hints: ["Důvěra = základ zdravého vztahu s rodiči."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak hormony ovlivňují vývoj mozku v pubertě?", correctAnswer: "Nevyužívané spoje mezi neurony zanikají a využívané se posilují", options: ["Hormony mozek v pubertě nemění, ovlivňují jen tělo.", "Nevyužívané spoje mezi neurony zanikají a využívané se posilují", "Mozek v pubertě ztrácí neurony, ale získává sílu.", "Rozhodování se v mozku dokončuje už ve třinácti letech."], hints: ["Mozek se v pubertě spíš přeskupuje, než roste."] },
  { question: "Co je sebeobrázek (self-image) a proč je důležitý v pubertě?", correctAnswer: "Jak sami sebe vnímáme – ovlivňuje to sebedůvěru i vztahy", options: ["Je to jen to, jak vypadáme – závisí na oblečení a účesu.", "Jak sami sebe vnímáme – ovlivňuje to sebedůvěru i vztahy", "V pubertě nehraje roli – důležitý je až v dospělosti.", "Je stálý a puberta ho nijak nemění."], hints: ["Zamysli se, podle čeho člověk sám sebe hodnotí."] },
  { question: "Jak sociální média ovlivňují sebeobrázek dospívajících?", correctAnswer: "Filtry a upravené fotografie vedou ke srovnávání a snižují sebedůvěru", options: ["Sociální sítě sebevědomí zlepšují – propojují dospívající s vrstevníky.", "Filtry a upravené fotografie vedou ke srovnávání a snižují sebedůvěru", "Sociální sítě nemají na sebevědomí vliv – jde jen o zábavu.", "Negativní vliv sociálních sítí se týká jen dospělých, ne dospívajících."], hints: ["Na sítích vidíš jen to, co chtěl někdo ukázat."] },
  { question: "Proč je spánek zvlášť důležitý pro dospívající?", correctAnswer: "Vnitřní hodiny se posunou na pozdější čas a rostoucí mozek potřebuje 9–11 hodin", options: ["Spánek je v pubertě méně důležitý než v dětství.", "Vnitřní hodiny se posunou na pozdější čas a rostoucí mozek potřebuje 9–11 hodin", "Dospívající spí déle ze zvyku, ne z biologické potřeby.", "Vnitřní hodiny se v pubertě nemění, pozdní ponocování je jen zvyk."], hints: ["Hormon spánku se v pubertě vyplavuje jindy než v dětství."] },
  { question: "Jak fyzická aktivita prospívá duševnímu zdraví v pubertě?", correctAnswer: "Pohyb zvyšuje hladinu endorfinů, serotoninu a dopaminu. Snižuje stres, úzkost, zlepšuje sebedůvěru a kvalitu spánku.", options: ["Pohyb zvyšuje hladinu endorfinů, serotoninu a dopaminu. Snižuje stres, úzkost, zlepšuje sebedůvěru a kvalitu spánku.", "Fyzická aktivita prospívá jen tělu – na duševní zdraví nemá vliv.", "Příliš mnoho sportu zhoršuje duševní zdraví dospívajících.", "Pohyb pomáhá jen tehdy, když dospívající sportuje závodně."], hints: ["Endorfiny = přirozené opiáty těla. Pohyb je přirozené antidepresivum."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč prefrontální kůra nedozrává do 25 let a co to znamená pro rozhodování mladých lidí?", correctAnswer: "Řídí plánování a hodnocení rizik, proto mladí častěji jednají impulzivně", options: ["Tato část mozku je plně vyvinutá už ve třinácti letech.", "Řídí plánování a hodnocení rizik, proto mladí častěji jednají impulzivně", "Rozhodování mladých nezávisí na zralosti mozku – je stejné jako u dospělých.", "Oblast pro city a oblast pro rozvahu dozrávají současně."], hints: ["V mozku spolu soupeří dvě oblasti: jedna se stará o city a je zralá už brzy, druhá rozhoduje s rozvahou a dozrává až kolem 25 let. Která podle tebe v pubertě častěji vítězí?"] },
  { question: "Co je identitní krize v adolescenci (podle Erika Eriksona)?", correctAnswer: "Adolescent hledá odpověď na 'Kdo jsem?' – experimentuje s rolemi, hodnotami a vztahy. Úspěšné řešení = stabilní identita. Neúspěšné = zmatení rolí a nestabilita.", options: ["Adolescent hledá odpověď na 'Kdo jsem?' – experimentuje s rolemi, hodnotami a vztahy. Úspěšné řešení = stabilní identita. Neúspěšné = zmatení rolí a nestabilita.", "Identitní krize je psychiatrická porucha typická pro pubertáky.", "Erikson říká, že adolescence není kritická fáze – identita se formuje v dospělosti.", "Krize identity vzniká jen u dospívajících bez pevné rodiny."], hints: ["Erikson: 8 fází psychosociálního vývoje. Adolescence = 5. fáze."] },
  { question: "Jak tlak vrstevníků přispívá k riskantnímu chování v pubertě?", correctAnswer: "Před vrstevníky se v mozku silněji aktivuje centrum odměny", options: ["Riskantní chování v pubertě způsobuje nevhodná výchova, ne mozek.", "Před vrstevníky se v mozku silněji aktivuje centrum odměny", "Dospívající jsou impulzivní náhodou – vrstevníci na to nemají vliv.", "Centrum odměny je v pubertě utlumené, proto vrstevníci tolik nezaváží."], hints: ["V mozku je oblast, která reaguje na ocenění od ostatních."] },
  { question: "Jak se liší sebeúcta od narcismu a proč je zdravá sebeúcta důležitá?", correctAnswer: "Zdravá sebeúcta je stabilní, narcismus závisí na obdivu druhých", options: ["Sebeúcta a narcismus jsou totéž – liší se jen množstvím.", "Zdravá sebeúcta je stabilní, narcismus závisí na obdivu druhých", "Vysoká sebeúcta je narcismus, nízká je skromnost. Obojí je zdravé.", "Sebeúcta se vyvíjí až v dospělosti – v pubertě rozhoduje pochvala rodičů."], hints: ["Zaměř se na to, na čem každý z těch dvou postojů stojí."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ETAPYLIDSKEHOZIVOTADOSPIVANI: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-etapy-lidskeho-zivota-dospivani",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-etapy-lidskeho-zivota-dospivani",
    title: "Etapy lidského života, dospívání",
    studentTitle: "Etapy života",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Vývoj člověka a rozmnožování",
    briefDescription: "Poznáš etapy lidského života a co se děje při dospívání.",
    keywords: ["puberta", "dospívání", "hormony", "etapy", "adolescence", "duševní zdraví", "sebeúcta"],
    goals: ["Vyjmenovat etapy lidského života", "Popsat tělesné a emocionální změny v pubertě", "Pochopit, že změny v pubertě jsou normální"],
    boundaries: ["Neprobírá psychopatologii dospívání", "Neprobírá podrobně pohlavní anatomii"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Etapy: kojenec (0–1), batole (1–3), předškolní (3–6), školní (6–11), puberta (11–18), dospělost (18–65), stáří (65+).",
      steps: [
        "1. Kojenec: 0–1 rok. Batole: 1–3 roky.",
        "2. Předškolní: 3–6 let. Školní: 6–11 let.",
        "3. Puberta/adolescence: 11–18 let.",
        "4. Tělesné změny: růst, hormony (estrogen/testosteron), pohlavní znaky.",
        "5. Emocionální: hledání identity, vrstevníci, citlivost.",
      ],
      commonMistake: "Změny v pubertě jsou NORMÁLNÍ – každý prochází pubertou jinak a v jiném čase.",
      example: "Dívky: puberta 10–13 let. Chlapci: 11–14 let. Obě skupiny: hormony způsobují tělesné i emocionální změny.",
    },
  },
];
