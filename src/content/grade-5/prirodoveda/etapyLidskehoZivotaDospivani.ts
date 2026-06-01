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
  { question: "Jak se jmenuje etapa vývoje člověka od 0 do 1 roku?", correctAnswer: "Kojenec", options: ["Kojenec", "Batole", "Novorozenec", "Předškolní dítě"], hints: ["Kojení mlékem = kojenec."] },
  { question: "Jaká je etapa vývoje od 1 do 3 let?", correctAnswer: "Batole", options: ["Batole", "Kojenec", "Předškolní dítě", "Školní dítě"], hints: ["Batole učí se chodit a mluvit."] },
  { question: "V jakém věku začíná puberta u dívek přibližně?", correctAnswer: "10–13 let", options: ["10–13 let", "15–18 let", "7–9 let", "14–16 let"], hints: ["Puberta dívek začíná dříve než u chlapců."] },
  { question: "V jakém věku začíná puberta u chlapců přibližně?", correctAnswer: "11–14 let", options: ["11–14 let", "8–10 let", "16–18 let", "5–7 let"], hints: ["Chlapci vcházejí do puberty o něco později než dívky."] },
  { question: "Jaké jsou typické tělesné změny v pubertě?", correctAnswer: "Rychlý růst, rozvoj pohlavních znaků, změna hlasu (chlapci), menstruace – dívky", options: ["Rychlý růst, rozvoj pohlavních znaků, změna hlasu (chlapci), menstruace – dívky", "Zpomalení růstu a snížení hmotnosti", "Zmizení mléčných zubů a růst stálých", "Zlepšení koordinace a fyzické výkonnosti"], hints: ["Puberta = přechod z dětství do dospělosti."] },
  { question: "Které hormony způsobují změny v pubertě?", correctAnswer: "Estrogen (dívky) a testosteron – chlapci", options: ["Estrogen (dívky) a testosteron – chlapci", "Inzulín a glukagon", "Adrenalin a kortizol", "Dopamin a serotonin"], hints: ["Hormony = chemičtí poslové v krvi."] },
  { question: "Co je adolescence?", correctAnswer: "Vývojová etapa od 11 do 18 let – dospívání", options: ["Vývojová etapa od 11 do 18 let – dospívání", "Vývojová etapa od 3 do 6 let", "Etapa po 65 letech věku", "Prenatální vývojová etapa"], hints: ["Adolescence = latinsky 'dospívat'."] },
  { question: "Co se v dospívání mění emocionálně?", correctAnswer: "Kolísání nálad, hledání identity, větší citlivost, důležitost vrstevníků", options: ["Kolísání nálad, hledání identity, větší citlivost, důležitost vrstevníků", "Úplný klid a vyrovnanost díky hormonům", "Ztráta zájmu o přátele a rodinu", "Snížení citlivosti na sociální situace"], hints: ["Hormony ovlivňují i emoce, nejen tělo."] },
  { question: "Která etapa lidského života trvá od 18 do 65 let?", correctAnswer: "Dospělost", options: ["Dospělost", "Adolescence", "Stáří", "Puberta"], hints: ["V dospělosti lidé pracují, zakládají rodiny."] },
  { question: "Jak se označuje etapa po 65 letech?", correctAnswer: "Stáří", options: ["Stáří", "Dospělost", "Adolescence", "Pozdní puberta"], hints: ["Ve stáří klesá fyzická výkonnost, ale zkušenosti narůstají."] },
  { question: "Proč jsou v pubertě normální akné (pupínky)?", correctAnswer: "Hormony způsobují zvýšenou produkci kožního mazu, který ucpává póry a způsobuje záněty", options: ["Hormony způsobují zvýšenou produkci kožního mazu, který ucpává póry a způsobuje záněty", "Špatná hygiena je jediná příčina akné v pubertě", "Akné způsobují sluneční paprsky při kontaktu s kůží", "Akné je příznak alergické reakce na nové potraviny"], hints: ["Androgeny (testosteron) stimulují mazové žlázy."] },
  { question: "Proč je důležitá komunikace s rodiči v období dospívání?", correctAnswer: "Rodiče mají zkušenosti a mohou pomoci při řešení problémů – dospívání přináší nové situace, které může být těžké zvládnout sám", options: ["Rodiče mají zkušenosti a mohou pomoci při řešení problémů – dospívání přináší nové situace, které může být těžké zvládnout sám", "Komunikace s rodiči je v pubertě zbytečná – vrstevníci jsou důležitější", "Rodiče nerozumí pubertě – nemá smysl s nimi mluvit", "Komunikace s rodiči je povinná ze zákona"], hints: ["Důvěra = základ zdravého vztahu s rodiči."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak hormony ovlivňují vývoj mozku v pubertě?", correctAnswer: "Hormony urychlují 'prořezávání' nevyužívaných synapsí a posilují využívané → mozek se specializuje. Prefrontální kůra – rozhodování se dokončuje až do 25 let.", options: ["Hormony urychlují 'prořezávání' nevyužívaných synapsí a posilují využívané → mozek se specializuje. Prefrontální kůra – rozhodování se dokončuje až do 25 let.", "Hormony mozek v pubertě nezměňují – ovlivňují jen tělo.", "Pubertální mozek ztrácí neurony, ale získává sílu.", "Prefrontální kůra se dokončuje v 13 letech – proto jsou puberťáci rozumní."], hints: ["Prořezávání synapsí = 'use it or lose it' – nevyužité spoje zmizí."] },
  { question: "Co je sebeobrázek (self-image) a proč je důležitý v pubertě?", correctAnswer: "Sebeobrázek = jak sami sebe vnímáme. V pubertě je klíčový – ovlivňuje sebeúctu, vztahy a duševní zdraví. Negativní sebeobrázek zvyšuje riziko deprese.", options: ["Sebeobrázek = jak sami sebe vnímáme. V pubertě je klíčový – ovlivňuje sebeúctu, vztahy a duševní zdraví. Negativní sebeobrázek zvyšuje riziko deprese.", "Sebeobrázek je jen to, jak vypadáme – závisí na oblečení a účesu.", "V pubertě sebeobrázek nehraje roli – důležitý je až v dospělosti.", "Sebeobrázek je stabilní – puberta ho nezměňuje."], hints: ["Sebeúcta = věřím si. Sebeobrázek ovlivňuje každé rozhodnutí."] },
  { question: "Jak sociální média ovlivňují sebeobrázek dospívajících?", correctAnswer: "Nereálné filtry a idealizované obrazy způsobují srovnávání se a snižují sebeúctu. Studie ukazují vyšší výskyt deprese a úzkosti u těžkých uživatelů sociálních médií.", options: ["Nereálné filtry a idealizované obrazy způsobují srovnávání se a snižují sebeúctu. Studie ukazují vyšší výskyt deprese a úzkosti u těžkých uživatelů sociálních médií.", "Sociální média sebeobrázek zlepšují – propojují dospívající s vrstevníky.", "Sociální média nemají na sebeobrázek vliv – jde jen o zábavu.", "Negativní vliv sociálních médií se týká jen dospělých, ne dospívajících."], hints: ["Srovnávání se s retušovanými fotografiemi na Instagramu = nezdravé."] },
  { question: "Proč je spánek zvlášť důležitý pro dospívající?", correctAnswer: "V pubertě se mění cirkadiánní rytmus – biologické hodiny se posunou na pozdnější čas – spát pozdě, vstávat pozdě . Mozek v růstu potřebuje 9–11 hodin ke konsolidaci paměti a vývoji.", options: ["V pubertě se mění cirkadiánní rytmus – biologické hodiny se posunou na pozdnější čas – spát pozdě, vstávat pozdě . Mozek v růstu potřebuje 9–11 hodin ke konsolidaci paměti a vývoji.", "Spánek je v pubertě méně důležitý než v dětství.", "Dospívající spí déle ze zvyku, ne biologické potřeby.", "Cirkadiánní rytmus se v pubertě nemění – lazení se pozdě je jen zvyk."], hints: ["Melatonin se v pubertě uvolňuje později → biologicky pozdní spánek."] },
  { question: "Jak fyzická aktivita prospívá duševnímu zdraví v pubertě?", correctAnswer: "Pohyb zvyšuje hladinu endorfinů, serotoninu a dopaminu. Snižuje stres, úzkost, zlepšuje sebedůvěru a kvalitu spánku.", options: ["Pohyb zvyšuje hladinu endorfinů, serotoninu a dopaminu. Snižuje stres, úzkost, zlepšuje sebedůvěru a kvalitu spánku.", "Fyzická aktivita prospívá jen tělu – na duševní zdraví nemá vliv.", "Příliš mnoho sportu zhoršuje duševní zdraví dospívajících.", "Pohyb pomáhá jen tehdy, když dospívající sportuje závodně."], hints: ["Endorfiny = přirozené opiáty těla. Pohyb je přirozené antidepresivum."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč prefrontální kůra nedozrává do 25 let a co to znamená pro rozhodování mladých lidí?", correctAnswer: "Prefrontální kůra řídí plánování, impulzivitu a hodnocení rizik. Nezralá kůra → impulzivní rozhodování, podceňování rizik. Emocionální – limbický systém dominuje → typická puberťácká rozhodnutí.", options: ["Prefrontální kůra řídí plánování, impulzivitu a hodnocení rizik. Nezralá kůra → impulzivní rozhodování, podceňování rizik. Emocionální – limbický systém dominuje → typická puberťácká rozhodnutí.", "Prefrontální kůra je plně vyvinutá v 13 letech – věk dospívání.", "Rozhodování mladých je stejně kvalitní jako u dospělých – nezávisí na mozkové zralosti.", "Limbický systém a prefrontální kůra zrají současně."], hints: ["Limbický systém (emoce) vs. prefrontální kůra (rozum) = souboj v pubertě."] },
  { question: "Co je identitní krize v adolescenci (podle Erika Eriksona)?", correctAnswer: "Adolescent hledá odpověď na 'Kdo jsem?' – experimentuje s rolemi, hodnotami a vztahy. Úspěšné řešení = stabilní identita. Neúspěšné = zmatení rolí a nestabilita.", options: ["Adolescent hledá odpověď na 'Kdo jsem?' – experimentuje s rolemi, hodnotami a vztahy. Úspěšné řešení = stabilní identita. Neúspěšné = zmatení rolí a nestabilita.", "Identitní krize je psychiatrická porucha typická pro pubertáky.", "Erikson říká, že adolescence není kritická fáze – identita se formuje v dospělosti.", "Krize identity vzniká jen u dospívajících bez pevné rodiny."], hints: ["Erikson: 8 fází psychosociálního vývoje. Adolescence = 5. fáze."] },
  { question: "Jak tlak vrstevníků přispívá k riskantnímu chování v pubertě?", correctAnswer: "Přítomnost vrstevníků aktivuje reward systém mozku – jádro accumbens více než u dospělých. Mozek dospívajících je biologicky naprogramován reagovat silněji na sociální odměnu.", options: ["Přítomnost vrstevníků aktivuje reward systém mozku – jádro accumbens více než u dospělých. Mozek dospívajících je biologicky naprogramován reagovat silněji na sociální odměnu.", "Riskantní chování v pubertě způsobuje nevhodná výchova, ne mozek.", "Dospívající jsou impulzivní náhodou – vrstevníci nemají vědecký vliv.", "Reward systém mozku je v pubertě utlumen – proto vrstevníci mají menší vliv."], hints: ["Nucleus accumbens = centrum odměny. Aktivuje se silněji v pubertě."] },
  { question: "Jak se liší sebeúcta od narcismu a proč je zdravá sebeúcta důležitá?", correctAnswer: "Zdravá sebeúcta = realistické, stabilní pozitivní hodnocení sebe sama. Narcismus = přehnaná, fragile sebeúcta závislá na obdivu jiných. Zdravá sebeúcta chrání před depresí a podporuje vztahy.", options: ["Zdravá sebeúcta = realistické, stabilní pozitivní hodnocení sebe sama. Narcismus = přehnaná, fragile sebeúcta závislá na obdivu jiných. Zdravá sebeúcta chrání před depresí a podporuje vztahy.", "Sebeúcta a narcismus jsou totéž – liší se jen množstvím.", "Vysoká sebeúcta = narcismus. Nízká sebeúcta = skromnost. Oba jsou zdravé.", "Sebeúcta se vyvíjí pouze v dospělosti – v pubertě je dítě závislé na hodnocení rodičů."], hints: ["Narcismus = závislost na obdivu. Sebeúcta = vnitřní stabilita bez závislosti na pochvale."] },
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
