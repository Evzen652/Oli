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
  { question: "Jaká je etapa vývoje od 1 do 3 let?", correctAnswer: "Batole", options: ["Kojenec", "Batole", "Předškolní dítě", "Školní dítě"], hints: ["Pořadí raných etap: kojenec (do 1 roku) → batole (1–3 roky) → předškolní dítě (3–6 let) → školní dítě (6–11 let)."] },
  { question: "V jakém věku začíná puberta u dívek přibližně?", correctAnswer: "10–13 let", options: ["15–18 let", "7–9 let", "10–13 let", "14–16 let"], hints: ["Puberta dívek začíná dříve než u chlapců."] },
  { question: "V jakém věku začíná puberta u chlapců přibližně?", correctAnswer: "11–14 let", options: ["8–10 let", "16–18 let", "5–7 let", "11–14 let"], hints: ["Chlapci vcházejí do puberty o něco později než dívky."] },
  { question: "Jaké jsou typické tělesné změny v pubertě?", correctAnswer: "Rychlý růst, změna hlasu u chlapců a první menstruace u dívek", options: ["Zpomalení růstu a postupné snižování tělesné hmotnosti", "Vypadávání mléčných zubů a prorůstání zubů stálých", "Rychlý růst, změna hlasu u chlapců a první menstruace u dívek", "Výrazné zlepšení koordinace pohybů a fyzické výkonnosti"], hints: ["Puberta je přechod z dětství do dospělosti. Které změny na tělo patří právě k němu?"] },
  { question: "Které hormony způsobují změny v pubertě?", correctAnswer: "Estrogen u dívek a testosteron u chlapců", options: ["Testosteron u dívek a estrogen u chlapců", "Estrogen u dívek a testosteron u chlapců", "U obou stejně, jen hormon růstu", "Žádné hormony, rozhoduje jen strava"], hints: ["Hormony jsou poslové, které tělo rozesílá krví. Který patří dívkám a který chlapcům?"] },
  { question: "Co je adolescence?", correctAnswer: "Vývojová etapa od 11 do 18 let – dospívání", options: ["Vývojová etapa od 3 do 6 let", "Etapa po 65 letech věku", "Vývojová etapa od 11 do 18 let – dospívání", "Prenatální vývojová etapa"], hints: ["Adolescence = latinsky 'dospívat'."] },
  { question: "Co se v dospívání mění emocionálně?", correctAnswer: "Kolísání nálad, hledání identity, větší citlivost, důležitost vrstevníků", options: ["Úplný klid a vyrovnanost díky hormonům", "Ztráta zájmu o přátele a rodinu", "Snížení citlivosti na sociální situace", "Kolísání nálad, hledání identity, větší citlivost, důležitost vrstevníků"], hints: ["Hormony ovlivňují i emoce, nejen tělo."] },
  { question: "Která etapa lidského života trvá od 18 do 65 let?", correctAnswer: "Dospělost", options: ["Dospělost", "Adolescence", "Stáří", "Puberta"], hints: ["Pořadí pozdějších etap: puberta / adolescence (11–18 let) → dospělost (18–65 let) → stáří (65+ let)."] },
  { question: "Jak se označuje etapa po 65 letech?", correctAnswer: "Stáří", options: ["Dospělost", "Stáří", "Adolescence", "Pozdní puberta"], hints: ["Pořadí pozdějších etap: adolescence (11–18 let) → dospělost (18–65 let) → stáří (65+ let)."] },
  { question: "Proč jsou v pubertě normální akné (pupínky)?", correctAnswer: "Hormony způsobují zvýšenou produkci kožního mazu, který ucpává póry a způsobuje záněty", options: ["Špatná hygiena je jediná příčina akné v pubertě", "Akné způsobují sluneční paprsky při kontaktu s kůží", "Hormony způsobují zvýšenou produkci kožního mazu, který ucpává póry a způsobuje záněty", "Akné je příznak alergické reakce na nové potraviny"], hints: ["V pubertě začnou kožní žlázy pracovat víc než dřív. Co se stane, když se pór ucpe?"] },
  { question: "Proč je důležitá komunikace s rodiči v období dospívání?", correctAnswer: "Rodiče mají zkušenosti a mohou pomoci při řešení problémů – dospívání přináší nové situace, které může být těžké zvládnout sám", options: ["Komunikace s rodiči je v pubertě zbytečná – vrstevníci jsou důležitější", "Rodiče nerozumí pubertě – nemá smysl s nimi mluvit", "Komunikace s rodiči je povinná ze zákona", "Rodiče mají zkušenosti a mohou pomoci při řešení problémů – dospívání přináší nové situace, které může být těžké zvládnout sám"], hints: ["Důvěra = základ zdravého vztahu s rodiči."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč se chlapcům v pubertě mění hlas?", correctAnswer: "Rychle jim rostou hrtan a hlasivky, a hlas se proto přelamuje", options: ["Rychle jim rostou hrtan a hlasivky, a hlas se proto přelamuje", "Mění se jim tvar úst a postavení jazyka", "Zvětšují se jim plíce, a tak mluví hlouběji", "Je to zvyk, který okoukají od dospělých mužů"], hints: ["Hlas vzniká chvěním hlasivek. Co se stane se zvukem, když se nástroj zvětší?"] },
  { question: "Co je sebepojetí a proč na něm v dospívání záleží?", correctAnswer: "To, jak člověk vidí sám sebe — ovlivňuje mu sebedůvěru i vztahy", options: ["Jen to, jak člověk vypadá — záleží na oblečení a účesu", "To, jak člověk vidí sám sebe — ovlivňuje mu sebedůvěru i vztahy", "V dospívání nehraje roli, důležité začne být až v dospělosti", "Je dané od narození a během života se už nijak nemění"], hints: ["Nejde o to, jak tě vidí ostatní, ale o obrázek, který o sobě máš ty sám."] },
  { question: "Jak sociální sítě ovlivňují to, jak dospívající vidí sám sebe?", correctAnswer: "Upravené fotografie svádějí ke srovnávání a berou sebedůvěru", options: ["Sebevědomí vždycky zlepšují, protože propojují s vrstevníky", "Nemají na to žádný vliv, jde přece jenom o zábavu", "Upravené fotografie svádějí ke srovnávání a berou sebedůvěru", "Týká se to jenom dospělých, dospívajících vůbec ne"], hints: ["Na sítích vidíš jen to, co chtěl někdo ukázat. S čím se tedy člověk srovnává?"] },
  { question: "Proč potřebují dospívající víc spánku než dospělí?", correctAnswer: "Tělo rychle roste a mění se, a to spotřebuje hodně sil", options: ["Protože se ve škole hůř soustředí a víc se unaví", "Potřebují ho stejně jako dospělí, jen se jim nechce vstávat", "Protože se jim v pubertě zpomalí dýchání i tep", "Tělo rychle roste a mění se, a to spotřebuje hodně sil"], hints: ["V pubertě člověk vyroste i o deset centimetrů za rok. Kdy myslíš, že tělo roste nejvíc?"] },
  { question: "Jak pohyb pomáhá dospívajícímu, kterého trápí špatná nálada?", correctAnswer: "Odbourá napětí, zlepší spánek i pocit ze sebe sama", options: ["Odbourá napětí, zlepší spánek i pocit ze sebe sama", "Pomáhá jenom tělu, na náladu nemá žádný vliv", "Pomáhá jen tomu, kdo sportuje závodně a pravidelně", "Nálada se pohybem vždycky ještě o něco zhorší"], hints: ["Zkus si vzpomenout, jak se cítíš po delší procházce nebo po hře venku."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Kamarádce začala puberta později než spolužačkám a bojí se, že s ní něco není v pořádku. Co je pravda?", correctAnswer: "Každý dospívá vlastním tempem, rozdíl i několika let je běžný", options: ["Má pravdu, takové zpoždění je potřeba nechat vyšetřit", "Každý dospívá vlastním tempem, rozdíl i několika let je běžný", "Znamená to, že zůstane menší než ostatní i v dospělosti", "Puberta začíná u všech stejně, takže se určitě jen spletla"], hints: ["Vzpomeň si, v jakém rozmezí let puberta začíná. Je to jedno číslo, nebo rozpětí?"] },
  { question: "Proč se dospívající pohádá s rodiči i kvůli maličkosti, přestože je má rád?", correctAnswer: "Hormony v pubertě zesilují prožívání, a tak i drobnost vyvolá silnou reakci", options: ["Přestane mít rodiče rád, to k dospívání prostě patří", "Dělá to schválně, aby si vynutil větší pozornost", "Hormony v pubertě zesilují prožívání, a tak i drobnost vyvolá silnou reakci", "Hádky s rodiči k dospívání vůbec nepatří, jde o výjimku"], hints: ["Co se v pubertě děje s náladami? A jak se to projeví, když někdo řekne něco nemilého?"] },
  { question: "Proč je dobré si v pubertě mýt obličej, ale akné to přesto úplně nevyřeší?", correctAnswer: "Akné vzniká zevnitř vlivem hormonů, mytí zvládne jen povrch kůže", options: ["Akné vzniká pouze z nečistot, mytí ho tedy vyřeší úplně", "Mytí obličeje akné naopak vždycky ještě o něco zhorší", "Akné se v pubertě objevit nemá, jde vždy o kožní nemoc", "Akné vzniká zevnitř vlivem hormonů, mytí zvládne jen povrch kůže"], hints: ["Kde se maz, který ucpe pór, vlastně tvoří — na kůži, nebo pod ní?"] },
  { question: "Chlapec v sedmé třídě se stydí za to, že mu při mluvení přeskakuje hlas. Co mu nejvíc pomůže vědět?", correctAnswer: "Že je to dočasné — hlasivky dorostou a hlas se za čas ustálí", options: ["Že je to dočasné — hlasivky dorostou a hlas se za čas ustálí", "Že se tomu dá zabránit, když bude mluvit potichu", "Že mu hlas takhle přeskakovat zůstane už napořád", "Že je to zvláštnost, která potká jen málokterého chlapce"], hints: ["Přeskakování hlasu je znak probíhající změny. Co se stane, až ta změna skončí?"] },
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
    boundaries: [
      "Neprobírá psychopatologii dospívání",
      "Neprobírá podrobně pohlavní anatomii",
      "Neprobírá stavbu a zrání mozku — patří na 2. stupeň",
      "Neprobírá psychologické teorie vývoje (Erikson) ani neurochemii",
    ],
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
