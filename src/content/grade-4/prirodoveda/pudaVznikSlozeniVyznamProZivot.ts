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
  { question: "Z čeho vzniká půda?", correctAnswer: "Ze zvětrávání hornin a tlení organické hmoty", options: ["Ze zvětrávání hornin a tlení organické hmoty", "Ze zmrzlé vody a ledu", "Z písku přeneseného větrem", "Z vodního sedimentu"] },
  { question: "Co je humus?", correctAnswer: "Tmavá organická složka půdy", options: ["Druh kamene v půdě", "Tmavá organická složka půdy", "Vrstva hlíny bez organiky", "Minerální složka půdy"] },
  { question: "Co dělá žížala pro půdu?", correctAnswer: "Provzdušňuje půdu a promíchává humus", options: ["Ničí kořeny rostlin", "Odčerpává vodu z půdy", "Provzdušňuje půdu a promíchává humus", "Zanáší půdu kamínky"] },
  { question: "Jaká je nejúrodnější půda v ČR?", correctAnswer: "Černozem – jižní Morava", options: ["Písčitá půda", "Jílovitá půda", "Hnědozem", "Černozem – jižní Morava"] },
  { question: "Jak dlouho trvá vznik 1 cm půdy?", correctAnswer: "Stovky let", options: ["Stovky let", "Několik měsíců", "10 let", "1 rok"] },
  { question: "Co je eroze půdy?", correctAnswer: "Odnos půdy větrem nebo vodou", options: ["Vznik nové půdy", "Odnos půdy větrem nebo vodou", "Promíchání půdních vrstev", "Zamrznutí půdy v zimě"] },
  { question: "Jaká barva půdy ukazuje na vysoký obsah humusu?", correctAnswer: "Tmavá až černá", options: ["Světle žlutá až béžová", "Bílá jako vápno", "Tmavá až černá", "Červená jako cihla"] },
  { question: "Co jsou minerální částice půdy?", correctAnswer: "Písek, jíl, štěrk a kamínky", options: ["Odumřelé listy a větvičky", "Kořeny stromů v půdě", "Organismy žijící v půdě", "Písek, jíl, štěrk a kamínky"] },
  { question: "Proč je půda důležitá pro rostliny?", correctAnswer: "Poskytuje oporu, vodu a živiny pro kořeny", options: ["Poskytuje oporu, vodu a živiny pro kořeny", "Dodává rostlinám světlo", "Vyrábí kyslík pro rostliny", "Chrání rostliny před mrazem"] },
  { question: "Co je zvětrávání hornin?", correctAnswer: "Rozpad hornin vlivem počasí", options: ["Vznik hornin z magmatu", "Rozpad hornin vlivem počasí", "Tání ledu v horách", "Usazování sedimentů ve vodě"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaké jsou složky půdy?", correctAnswer: "Minerály, humus, voda, vzduch", options: ["Jen písek a hlína dohromady", "Jen humus a voda v půdě", "Minerály, humus, voda, vzduch", "Horniny, voda a vzduch"] },
  { question: "Jak se liší písčitá a jílovitá půda?", correctAnswer: "Písčitá propouští, jílovitá drží", options: ["Jílovitá propouští, písčitá drží", "Liší se jen svou barvou", "Písčitá je úrodnější", "Písčitá propouští, jílovitá drží"] },
  { question: "Co jsou rozkladači v půdě?", correctAnswer: "Houby a bakterie rozkládající odumřelou organiku na humus", options: ["Houby a bakterie rozkládající odumřelou organiku na humus", "Organismy ničící živé rostliny", "Žížaly pojídající kořeny", "Hmyz sbírající semena"] },
  { question: "Jaká jsou ohrožení půdy?", correctAnswer: "Eroze, kontaminace chemikáliemi, zabetonování – zástavba", options: ["Přílišné zavodnění a zalití vodou", "Eroze, kontaminace chemikáliemi, zabetonování – zástavba", "Přílišné promrznutí v zimě", "Příliš intenzivní hnojení organickým hnojivem"] },
  { question: "Proč má černozem nejlepší vlastnosti pro zemědělství?", correctAnswer: "Obsahuje nejvíce humusu", options: ["Je nejlehčí a dobře se orá", "Obsahuje nejvíc písku", "Obsahuje nejvíce humusu", "Voda jí protéká nejrychleji"] },
  { question: "Co je orná vrstva půdy (humusový horizont)?", correctAnswer: "Svrchní vrstva bohatá na humus", options: ["Vrstva kamenů pod povrchem", "Hlubinná hornina pod půdou", "Spodní vrstva s vodou", "Svrchní vrstva bohatá na humus"] },
  { question: "Jak les chrání půdu před erozí?", correctAnswer: "Kořeny stromů pevně drží půdu, listí zachycuje déšť a zpomaluje odtok", options: ["Kořeny stromů pevně drží půdu, listí zachycuje déšť a zpomaluje odtok", "Les přímo vyrábí humus z minerálů", "Les zadržuje vodu v listech bez vlivu na půdu", "Les zastiňuje půdu a zabraňuje jejímu vysychání"] },
  { question: "Co jsou půdní horizonty?", correctAnswer: "Vrstvy půdy s různými vlastnostmi", options: ["Druhy půdy podle barvy", "Vrstvy půdy s různými vlastnostmi", "Typy organismů v hloubce", "Vrstvy sněhu na půdě"] },
  { question: "Proč je dobré kompostovat?", correctAnswer: "Kompostováním vzniká humus, který zlepšuje strukturu a úrodnost půdy", options: ["Kompost odstraňuje škůdce z půdy", "Kompost zvyšuje obsah minerálů v půdě", "Kompostováním vzniká humus, který zlepšuje strukturu a úrodnost půdy", "Kompostování čistí půdu od chemikálií"] },
  { question: "Jakou funkci má kořenové vlášení v půdě?", correctAnswer: "Zvětšuje plochu pro příjem vody", options: ["Kotví rostlinu v půdě", "Dodává kyslík do půdy", "Chrání kořen před škůdci", "Zvětšuje plochu pro příjem vody"] },
  { question: "Proč jsou remízy a meze důležité pro půdu?", correctAnswer: "Brání erozi větrem, zadržují vodu a poskytují stanoviště živočichům", options: ["Brání erozi větrem, zadržují vodu a poskytují stanoviště živočichům", "Zvyšují výnos plodin", "Jsou překážkou pro zemědělské stroje", "Odvádějí přebytečnou vodu z polí"] },
  { question: "Co je pH půdy?", correctAnswer: "Kyselost nebo zásaditost půdy", options: ["Množství vody v půdě", "Kyselost nebo zásaditost půdy", "Množství humusu v půdě", "Teplota půdy v létě"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Vysvětli, proč zabránit erozi půdy je naléhavý ekologický problém.", correctAnswer: "Vznik 1 cm půdy trvá stovky let; eroze může odstranit celou ornou vrstvu za desítky let", options: ["Eroze je přirozená a půda se rychle obnoví", "Eroze postihuje jen horské oblasti bez zemědělství", "Vznik 1 cm půdy trvá stovky let; eroze může odstranit celou ornou vrstvu za desítky let", "Eroze je problém jen v tropech"] },
  { question: "Jak mohou mikroorganismy v půdě napomáhat výživě rostlin?", correctAnswer: "Rozkládají organiku na minerály", options: ["Přenášejí živiny z listů", "Vyrábějí glukózu pro kořeny", "Chrání kořeny před škůdci", "Rozkládají organiku na minerály"] },
  { question: "Co je mykorhiza a jak prospívá rostlinám?", correctAnswer: "Soužití houby s kořeny rostliny", options: ["Soužití houby s kořeny rostliny", "Houba poškozující kořeny", "Zvláštní půdní horizont", "Ochranná vrstva proti suchu"] },
  { question: "Proč kontaminace půdy pesticidy ohrožuje celý ekosystém?", correctAnswer: "Pesticidy se hromadí v potravním řetězci – bioakumulace a škodí i predátorům", options: ["Pesticidy se rozloží do 24 hodin", "Pesticidy se hromadí v potravním řetězci – bioakumulace a škodí i predátorům", "Pesticidy ovlivňují jen hmyz, ne ostatní organismy", "Pesticidy posilují mikroorganismy v půdě"] },
  { question: "Jaký je rozdíl mezi organickým a minerálním hnojením půdy?", correctAnswer: "Organické zlepší půdu, minerální rychle živí", options: ["Minerální zlepší půdu, organické rychle živí", "Jen minerální je ekologické", "Organické zlepší půdu, minerální rychle živí", "Obě metody jsou totožné"] },
  { question: "Jak zástavba a zpevňování povrchů ovlivňují půdu a vodní cyklus?", correctAnswer: "Beton brání vsaku vody — zvyšuje povodně, snižuje zásoby spodní vody a ničí půdu", options: ["Beton půdu chrání před erozí bez vedlejších efektů", "Zástavba nemá vliv na vodní cyklus", "Zpevnění povrchu zlepšuje kvalitu spodní vody", "Beton brání vsaku vody — zvyšuje povodně, snižuje zásoby spodní vody a ničí půdu"] },
  { question: "Co je bioindikátor kvality půdy?", correctAnswer: "Organismus ukazující stav půdy", options: ["Organismus ukazující stav půdy", "Chemický test pH půdy", "Měřicí přístroj vlhkosti", "Rostlina rostoucí na kamení"] },
  { question: "Proč jsou mokřady považovány za 'ledničky biodiversity' a jak chrání půdu?", correctAnswer: "Zadržují vodu, brání suchu, filtrují živiny a poskytují stanoviště ohroženým druhům", options: ["Mokřady půdu pouze podmáčejí a poškozují", "Zadržují vodu, brání suchu, filtrují živiny a poskytují stanoviště ohroženým druhům", "Mokřady přitahují škůdce ničící zemědělskou půdu", "Mokřady mají vliv jen na sousední vodní plochy"] },
  { question: "Jaký je vliv klimatické změny na půdu?", correctAnswer: "Sucha způsobují praskání půdy, eroze stoupá; extrémní deště odnášejí humus", options: ["Klimatická změna nemá vliv na půdu", "Teplejší klima urychluje vznik nové půdy", "Sucha způsobují praskání půdy, eroze stoupá; extrémní deště odnášejí humus", "Klimatická změna způsobuje jen záplavy bez eroze"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 40);
}

export const PUDAVZNIKSLOZENIVYZNAMPROZIVOT: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-puda-vznik-slozeni-vyznam-pro-zivot",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-puda-vznik-slozeni-vyznam-pro-zivot",
    title: "Půda - vznik, složení, význam pro život",
    studentTitle: "Půda a organismy",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Pochopíš, jak vzniká půda a proč je nenahraditelná pro veškerý pozemský život.",
    keywords: ["půda", "humus", "černozem", "eroze", "žížala", "zvětrávání", "horniny", "úrodnost"],
    goals: [
      "Popsat složení půdy (minerální části, humus, voda, vzduch, organismy)",
      "Vysvětlit, jak půda vzniká (zvětrávání + tlení)",
      "Uvést příklady půdních organismů a jejich funkce",
      "Jmenovat ohrožení půdy (eroze, kontaminace, zástavba)",
    ],
    boundaries: ["Detailní geochemie půdy není náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Půda = minerální části + humus + voda + vzduch + organismy. Humus = tmavá organická složka.",
      steps: [
        "1. Vznik: zvětrávání hornin + tlení organiky = stovky let na 1 cm.",
        "2. Humus: tmavší = úrodnější.",
        "3. Žížala = provzdušňuje půdu.",
        "4. Eroze = odnos větrem nebo vodou.",
      ],
      commonMistake: "Humus není hnůj — je to přirozená organická složka půdy z odumřelých organizmů.",
      example: "Černozem na jižní Moravě je nejtmavší (nejvíce humusu) a nejúrodnější půda v ČR.",
    },
  },
];
