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
  { question: "Co je humus?", correctAnswer: "Tmavá organická složka půdy z odumřelých organismů", options: ["Tmavá organická složka půdy z odumřelých organismů", "Druh kamene v půdě", "Vrstva hlíny bez organiky", "Minerální složka půdy"] },
  { question: "Co dělá žížala pro půdu?", correctAnswer: "Provzdušňuje půdu a promíchává humus", options: ["Provzdušňuje půdu a promíchává humus", "Ničí kořeny rostlin", "Odčerpává vodu z půdy", "Zanáší půdu kamínky"] },
  { question: "Jaká je nejúrodnější půda v ČR?", correctAnswer: "Černozem (jižní Morava)", options: ["Černozem (jižní Morava)", "Písčitá půda", "Jílovitá půda", "Hnědozem"] },
  { question: "Jak dlouho trvá vznik 1 cm půdy?", correctAnswer: "Stovky let", options: ["Stovky let", "Několik měsíců", "10 let", "1 rok"] },
  { question: "Co je eroze půdy?", correctAnswer: "Odnos půdy větrem nebo vodou", options: ["Odnos půdy větrem nebo vodou", "Vznik nové půdy", "Promíchání půdních vrstev", "Zamrznutí půdy v zimě"] },
  { question: "Jaká barva půdy ukazuje na vysoký obsah humusu?", correctAnswer: "Tmavá (černá nebo tmavě hnědá)", options: ["Tmavá (černá nebo tmavě hnědá)", "Světle žlutá", "Bílá", "Červená"] },
  { question: "Co jsou minerální částice půdy?", correctAnswer: "Písek, jíl, štěrk a kamínky — neorganická složka půdy", options: ["Písek, jíl, štěrk a kamínky — neorganická složka půdy", "Odumřelé listy a větvičky", "Kořeny stromů v půdě", "Organismy žijící v půdě"] },
  { question: "Proč je půda důležitá pro rostliny?", correctAnswer: "Poskytuje oporu, vodu a živiny pro kořeny", options: ["Poskytuje oporu, vodu a živiny pro kořeny", "Dodává rostlinám světlo", "Vyrábí kyslík pro rostliny", "Chrání rostliny před mrazem"] },
  { question: "Co je zvětrávání hornin?", correctAnswer: "Rozpad hornin na menší části vlivem počasí (mráz, voda, teplo)", options: ["Rozpad hornin na menší části vlivem počasí (mráz, voda, teplo)", "Vznik hornin z magmatu", "Tání ledu v horách", "Usazování sedimentů ve vodě"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaké jsou složky půdy?", correctAnswer: "Minerální části, humus, voda, vzduch, živé organismy", options: ["Minerální části, humus, voda, vzduch, živé organismy", "Jen písek a hlína", "Jen humus a voda", "Horniny, voda a vzduch"] },
  { question: "Jak se liší písčitá a jílovitá půda?", correctAnswer: "Písčitá: propouští vodu, špatně drží vláhu. Jílovitá: drží vodu, špatně propouští vzduch.", options: ["Písčitá: propouští vodu, špatně drží vláhu. Jílovitá: drží vodu, špatně propouští vzduch.", "Jsou stejné — liší se jen barvou.", "Jílovitá propouští vodu, písčitá ne.", "Písčitá je úrodnější než jílovitá."] },
  { question: "Co jsou rozkladači v půdě?", correctAnswer: "Houby a bakterie rozkládající odumřelou organiku na humus", options: ["Houby a bakterie rozkládající odumřelou organiku na humus", "Organismy ničící živé rostliny", "Žížaly pojídající kořeny", "Hmyz sbírající semena"] },
  { question: "Jaká jsou ohrožení půdy?", correctAnswer: "Eroze, kontaminace chemikáliemi, zabetonování (zástavba)", options: ["Eroze, kontaminace chemikáliemi, zabetonování (zástavba)", "Přílišné zavodnění a zalití vodou", "Přílišné promrznutí v zimě", "Příliš intenzivní hnojení organickým hnojivem"] },
  { question: "Proč má černozem nejlepší vlastnosti pro zemědělství?", correctAnswer: "Obsahuje nejvíce humusu — je nejúrodnější, zadržuje vodu i vzduch", options: ["Obsahuje nejvíce humusu — je nejúrodnější, zadržuje vodu i vzduch", "Je nejlehčí a dobře se orá", "Obsahuje nejvíce písečných zrn", "Voda jí protéká nejrychleji"] },
  { question: "Co je orná vrstva půdy (humusový horizont)?", correctAnswer: "Nejsvrchnější vrstva bohatá na humus — nejdůležitější pro zemědělství", options: ["Nejsvrchnější vrstva bohatá na humus — nejdůležitější pro zemědělství", "Vrstva kamenů pod povrchem", "Hlubinná hornina pod půdou", "Spodní vrstva s vodou"] },
  { question: "Jak les chrání půdu před erozí?", correctAnswer: "Kořeny stromů pevně drží půdu, listí zachycuje déšť a zpomaluje odtok", options: ["Kořeny stromů pevně drží půdu, listí zachycuje déšť a zpomaluje odtok", "Les přímo vyrábí humus z minerálů", "Les zadržuje vodu v listech bez vlivu na půdu", "Les zastiňuje půdu a zabraňuje jejímu vysychání"] },
  { question: "Co jsou půdní horizonty?", correctAnswer: "Vrstvy půdy s různými vlastnostmi (A = humusová, B = přechodová, C = hornina)", options: ["Vrstvy půdy s různými vlastnostmi (A = humusová, B = přechodová, C = hornina)", "Druhy půdy rozeznatelné podle barvy", "Typy organizmů v různé hloubce", "Vrstvy sněhu pokrývající půdu"] },
  { question: "Proč je dobré kompostovat?", correctAnswer: "Kompostováním vzniká humus, který zlepšuje strukturu a úrodnost půdy", options: ["Kompostováním vzniká humus, který zlepšuje strukturu a úrodnost půdy", "Kompost odstraňuje škůdce z půdy", "Kompost zvyšuje obsah minerálů v půdě", "Kompostování čistí půdu od chemikálií"] },
  { question: "Jakou funkci mají kořenové vlášení v půdě?", correctAnswer: "Zvětšují plochu kořene pro příjem vody a živin z půdy", options: ["Zvětšují plochu kořene pro příjem vody a živin z půdy", "Kotvení rostliny v půdě", "Dodávají kyslík do půdy", "Chrání kořen před škůdci"] },
  { question: "Proč jsou remízy a meze důležité pro půdu?", correctAnswer: "Brání erozi větrem, zadržují vodu a poskytují stanoviště živočichům", options: ["Brání erozi větrem, zadržují vodu a poskytují stanoviště živočichům", "Zvyšují výnos plodin", "Jsou překážkou pro zemědělské stroje", "Odvádějí přebytečnou vodu z polí"] },
  { question: "Co je pH půdy?", correctAnswer: "Kyselost nebo zásaditost půdy — ovlivňuje dostupnost živin pro rostliny", options: ["Kyselost nebo zásaditost půdy — ovlivňuje dostupnost živin pro rostliny", "Obsah vody v půdě", "Množství humusu v půdě", "Teplota půdy v létě"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Vysvětli, proč zabránit erozi půdy je naléhavý ekologický problém.", correctAnswer: "Vznik 1 cm půdy trvá stovky let; eroze může odstranit celou ornou vrstvu za desítky let", options: ["Vznik 1 cm půdy trvá stovky let; eroze může odstranit celou ornou vrstvu za desítky let", "Eroze je přirozená a půda se rychle obnoví", "Eroze postihuje jen horské oblasti bez zemědělství", "Eroze je problém jen v tropech"] },
  { question: "Jak mohou mikroorganismy v půdě napomáhat výživě rostlin?", correctAnswer: "Rozkládají organiku na jednoduché minerály (dusičnany, fosforečnany) přijatelné kořeny", options: ["Rozkládají organiku na jednoduché minerály (dusičnany, fosforečnany) přijatelné kořeny", "Přímo přenášejí živiny z listů do půdy", "Vyrábějí glukózu pro kořeny", "Chrání kořeny před škůdci"] },
  { question: "Co je mykorhiza a jak prospívá rostlinám?", correctAnswer: "Symbióza houbových vláken s kořeny — houba přijímá vodu a živiny, rostlina dodává cukry", options: ["Symbióza houbových vláken s kořeny — houba přijímá vodu a živiny, rostlina dodává cukry", "Parazitická houba poškozující kořeny", "Typ půdního horizontu", "Ochranná vrstva kořene proti suchu"] },
  { question: "Proč kontaminace půdy pesticidy ohrožuje celý ekosystém?", correctAnswer: "Pesticidy se hromadí v potravním řetězci (bioakumulace) a škodí i predátorům", options: ["Pesticidy se hromadí v potravním řetězci (bioakumulace) a škodí i predátorům", "Pesticidy se rozloží do 24 hodin", "Pesticidy ovlivňují jen hmyz, ne ostatní organismy", "Pesticidy posilují mikroorganismy v půdě"] },
  { question: "Jaký je rozdíl mezi organickým a minerálním hnojením půdy?", correctAnswer: "Organické (kompost, hnůj): zlepšuje strukturu a humus. Minerální (průmyslové): dodává konkrétní živiny rychleji, ale nevzlepšuje strukturu.", options: ["Organické (kompost, hnůj): zlepšuje strukturu a humus. Minerální (průmyslové): dodává konkrétní živiny rychleji, ale nevzlepšuje strukturu.", "Organické je rychlejší, minerální pomalejší.", "Jen minerální hnojení je ekologické.", "Obě metody jsou totožné — liší se jen cenou."] },
  { question: "Jak zástavba a zpevňování povrchů ovlivňují půdu a vodní cyklus?", correctAnswer: "Beton brání vsaku vody — zvyšuje povodně, snižuje zásoby spodní vody a ničí půdu", options: ["Beton brání vsaku vody — zvyšuje povodně, snižuje zásoby spodní vody a ničí půdu", "Beton půdu chrání před erozí bez vedlejších efektů", "Zástavba nemá vliv na vodní cyklus", "Zpevnění povrchu zlepšuje kvalitu spodní vody"] },
  { question: "Co je bioindicátor kvality půdy?", correctAnswer: "Organismus, jehož přítomnost nebo absence signalizuje stav půdy (např. žížaly = zdravá půda)", options: ["Organismus, jehož přítomnost nebo absence signalizuje stav půdy (např. žížaly = zdravá půda)", "Chemický test pH půdy", "Měřicí přístroj vlhkosti půdy", "Typ rostliny rostoucí na špatné půdě"] },
  { question: "Proč jsou mokřady považovány za 'ledničky biodiversity' a jak chrání půdu?", correctAnswer: "Zadržují vodu, brání suchu, filtrují živiny a poskytují stanoviště ohroženým druhům", options: ["Zadržují vodu, brání suchu, filtrují živiny a poskytují stanoviště ohroženým druhům", "Mokřady půdu pouze podmáčejí a poškozují", "Mokřady přitahují škůdce ničící zemědělskou půdu", "Mokřady mají vliv jen na sousední vodní plochy"] },
  { question: "Jaký je vliv klimatické změny na půdu?", correctAnswer: "Sucha způsobují praskání půdy, eroze stoupá; extrémní deště odnášejí humus", options: ["Sucha způsobují praskání půdy, eroze stoupá; extrémní deště odnášejí humus", "Klimatická změna nemá vliv na půdu", "Teplejší klima urychluje vznik nové půdy", "Klimatická změna způsobuje jen záplavy bez eroze"] },
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
