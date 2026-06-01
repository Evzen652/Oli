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
  { question: "Jak se jmenuje nejtvrdší nerost na světě?", correctAnswer: "Diamant", options: ["Diamant", "Rubín", "Křemen", "Mastek"], hints: ["Má tvrdost 10 na Mohsově stupnici."] },
  { question: "Co jsou horniny?", correctAnswer: "Pevné látky tvořící zemskou kůru, složené z nerostů", options: ["Pevné látky tvořící zemskou kůru, složené z nerostů", "Kapaliny v zemském nitru", "Jen úlomky skal v řekách", "Horniny jsou totéž co nerosty"], hints: ["Hornina = kombinace nerostů."] },
  { question: "Jak vznikají vyvřelé horniny?", correctAnswer: "Ochlazením magmatu (roztavené horniny)", options: ["Ochlazením magmatu (roztavené horniny)", "Vrstvením usazenin v moři", "Přeměnou pod vysokým tlakem a teplotou", "Větráním starých hornin"], hints: ["Příkladem je žula nebo čedič."] },
  { question: "Jak vznikají usazené (sedimentární) horniny?", correctAnswer: "Vrstvením a stmelením usazenin (písku, bahna, schránek)", options: ["Vrstvením a stmelením usazenin (písku, bahna, schránek)", "Ochlazením sopečného magmatu", "Přeměnou jiných hornin tlakem a teplotou", "Rozpuštěním starých hornin vodou"], hints: ["Příkladem jsou pískovce, vápenec nebo uhlí."] },
  { question: "Která hornina vzniká ze žuly přeměnou?", correctAnswer: "Rula", options: ["Rula", "Čedič", "Vápenec", "Pískovec"], hints: ["Přeměněné horniny vznikají tlakem a teplotou."] },
  { question: "Co je to Mohsova stupnice?", correctAnswer: "Stupnice tvrdosti nerostů (1 = nejměkčí mastek, 10 = nejtvrdší diamant)", options: ["Stupnice tvrdosti nerostů (1 = nejměkčí mastek, 10 = nejtvrdší diamant)", "Stupnice velikosti hornin", "Stupnice stáří nerostů", "Stupnice lesku drahých kamenů"], hints: ["Nůž má tvrdost přibližně 5,5."] },
  { question: "Který nerost je nejměkčí na Mohsově stupnici?", correctAnswer: "Mastek (tvrdost 1)", options: ["Mastek (tvrdost 1)", "Diamant (tvrdost 10)", "Křemen (tvrdost 7)", "Apatit (tvrdost 5)"], hints: ["Mastek lze poškrábat nehet."] },
  { question: "Jak se jmenuje nejrozšířenější hornina ve stavebnictví?", correctAnswer: "Žula (granit)", options: ["Žula (granit)", "Vápenec", "Pískovec", "Uhlí"], hints: ["Žula je tvrdá vyvřelá hornina."] },
  { question: "Co je uhlí?", correctAnswer: "Usazená hornina vzniklá z odumřelých rostlin před miliony let", options: ["Usazená hornina vzniklá z odumřelých rostlin před miliony let", "Vyvřelá hornina ze sopky", "Přeměněná hornina vzniklá z vápence", "Nerost z řek a jezer"], hints: ["Uhlí se používá jako palivo."] },
  { question: "Co jsou drahokamy?", correctAnswer: "Vzácné nerosty s vysokou tvrdostí a leskem (diamant, rubín, safír, smaragd)", options: ["Vzácné nerosty s vysokou tvrdostí a leskem (diamant, rubín, safír, smaragd)", "Všechny barevné kameny v přírodě", "Horniny ze sopečných trubic", "Pouze umělé krystaly"], hints: ["Drahokamy se používají ve špercích."] },
  { question: "Co je ropa?", correctAnswer: "Kapalné fosilní palivo vzniklé z odumřelých mořských organismů", options: ["Kapalné fosilní palivo vzniklé z odumřelých mořských organismů", "Voda obohacená minerály", "Sopečná hornina v kapalném stavu", "Přeměněná podzemní voda"], hints: ["Z ropy se vyrábí benzín a plasty."] },
  { question: "Která hornina se používá k výrobě vápna a cementu?", correctAnswer: "Vápenec", options: ["Vápenec", "Žula", "Pískovec", "Rula"], hints: ["Vápenec je usazená hornina."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaký je rozdíl mezi horninou a nerostem?", correctAnswer: "Hornina je složena z více nerostů nebo z jednoho nerosta s příměsemi; nerost je chemicky homogenní pevná látka s určitým složením", options: ["Hornina je složena z více nerostů nebo z jednoho nerosta s příměsemi; nerost je chemicky homogenní pevná látka s určitým složením", "Nerost je větší než hornina", "Horniny jsou starší než nerosty", "Nerosty jsou kapalné, horniny pevné"], hints: ["Žula = hornina složená z křemene, živce a slídy."] },
  { question: "Jak se liší tři typy hornin z hlediska vzniku?", correctAnswer: "Vyvřelé vznikají tuhnutím magmatu, usazené vrstvením a stmelením úlomků, přeměněné působením tepla a tlaku na jiné horniny", options: ["Vyvřelé vznikají tuhnutím magmatu, usazené vrstvením a stmelením úlomků, přeměněné působením tepla a tlaku na jiné horniny", "Vyvřelé jsou staré, usazené mladší, přeměněné nejmladší", "Všechny horniny vznikají tuhnutím magmatu, liší se jen rychlostí", "Přeměněné vznikají sopkami, ostatní v mořích"], hints: ["Každý typ = jiný geologický proces."] },
  { question: "Proč jsou vrstvy usazených hornin vodorovné?", correctAnswer: "Usazeniny se ukládají vrstva po vrstvě na dno moří a jezer gravitací – každá vrstva je jinak stará", options: ["Usazeniny se ukládají vrstva po vrstvě na dno moří a jezer gravitací – každá vrstva je jinak stará", "Proudy vzduchu ukládají horniny ve vodorovných vrstvách", "Vrstvy vznikají sopečnými výbuchy v pravidelných intervalech", "Je to jen náhoda bez geologického vysvětlení"], hints: ["Staré vrstvy jsou dole, mladé nahoře."] },
  { question: "Proč je diamant tak tvrdý?", correctAnswer: "Atomy uhlíku jsou v diamantu pevně svázány do trojrozměrné sítě – každý atom je vázán se 4 sousedy", options: ["Atomy uhlíku jsou v diamantu pevně svázány do trojrozměrné sítě – každý atom je vázán se 4 sousedy", "Diamant je tvořen jiným prvkem než ostatní nerosty", "Diamant vzniká při vysokém tlaku, který zhutní atomy", "Diamant nemá žádnou krystalickou strukturu"], hints: ["Uhlík v různém uspořádání = diamant (tvrdý) nebo grafit (měkký)."] },
  { question: "Jak vzniklo uhlí? Proč se mu říká fosilní palivo?", correctAnswer: "Uhlí vzniklo z odumřelých rostlin, které se po miliony let ukládaly, přikrývaly vrstvami sedimentů a přeměňovaly tlakem a teplem. Jde o uložené zásoby sluneční energie.", options: ["Uhlí vzniklo z odumřelých rostlin, které se po miliony let ukládaly, přikrývaly vrstvami sedimentů a přeměňovaly tlakem a teplem. Jde o uložené zásoby sluneční energie.", "Uhlí vzniklo z krystalů minerálů v sopečné hornině", "Fosilní znamená, že uhlí obsahuje fosilie zvířat jako kosti", "Uhlí se tvoří dodnes v bažinách za 10 let"], hints: ["Fosilní = 'zkamenělé' zásoby energie z dávné minulosti."] },
  { question: "K čemu slouží nerosty jako křemen, živec a slída v hornině žule?", correctAnswer: "Křemen (šedý, tvrdý), živec (bílý/růžový) a slída (lesklé šupinky) tvoří spolu s dalšími nerosty žulu – každý přispívá jiným chemickým složením", options: ["Křemen (šedý, tvrdý), živec (bílý/růžový) a slída (lesklé šupinky) tvoří spolu s dalšími nerosty žulu – každý přispívá jiným chemickým složením", "Všechny tři jsou totéž – jen různá barva žuly", "Křemen je hlavní nerost, ostatní jsou příměsi bez funkce", "Slída způsobuje červenou barvu žuly"], hints: ["Žula se tím pozná na povrchu – různobarevné krystalky."] },
  { question: "Proč se vápenec používá ve stavebnictví?", correctAnswer: "Vápenec se zahřívá na vápno (CaO), které je základem pro výrobu malty, cementu a betonu – klíčové stavební materiály", options: ["Vápenec se zahřívá na vápno (CaO), které je základem pro výrobu malty, cementu a betonu – klíčové stavební materiály", "Vápenec je nejpevnější hornina a slouží jako nosná zeď", "Vápenec se rozpouští ve vodě a tvoří pojidlo", "Vápenec je nerost, proto se přidává do betonu jako zpevnění"], hints: ["Vápno + voda + písek = malta."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč je geologický koloběh hornin důležitý pro Zemi?", correctAnswer: "Horniny se neustále přeměňují – vyvřelé erodují na usazené, ty se přeměňují tlakem, přeměněné se taví zpět na magma. Koloběh recykluje hmotu zemské kůry.", options: ["Horniny se neustále přeměňují – vyvřelé erodují na usazené, ty se přeměňují tlakem, přeměněné se taví zpět na magma. Koloběh recykluje hmotu zemské kůry.", "Geologický koloběh popisuje pouze sopečnou aktivitu", "Horniny jsou trvalé a nemění se – geologický koloběh je jen teorie", "Koloběh hornin trvá méně než 100 let"], hints: ["Horolezec na vrcholu Himalájí stojí na mořských usazeninách."] },
  { question: "Jak se liší ropa a zemní plyn od uhlí, přestože jsou všechny fosilní paliva?", correctAnswer: "Uhlí vzniklo z pevných rostlin na souši. Ropa a zemní plyn vznikly z mikroorganismů v mořích – ropa je kapalná, plyn plynný – jiné podmínky vzniku, jiné skupenství.", options: ["Uhlí vzniklo z pevných rostlin na souši. Ropa a zemní plyn vznikly z mikroorganismů v mořích – ropa je kapalná, plyn plynný – jiné podmínky vzniku, jiné skupenství.", "Ropa vzniká z uhlí zahřátím hluboko v Zemi", "Zemní plyn je obnovitelný, uhlí a ropa ne", "Všechna fosilní paliva jsou totožná – liší se jen barvou"], hints: ["Skupenství závisí na podmínkách vzniku."] },
  { question: "Jak může jeden prvek (uhlík) tvořit jak nejměkčí grafit, tak nejtvrdší diamant?", correctAnswer: "Záleží na uspořádání atomů: v grafitu jsou atomy ve vrstvách, které po sobě kloužou (proto je měkký a píše). V diamantu jsou atomy pevně svázány do 3D sítě (proto je nejtvrdší).", options: ["Záleží na uspořádání atomů: v grafitu jsou atomy ve vrstvách, které po sobě kloužou (proto je měkký a píše). V diamantu jsou atomy pevně svázány do 3D sítě (proto je nejtvrdší).", "Grafit obsahuje více uhlíku než diamant, proto je měkčí", "Grafit a diamant nemají nic společného – jsou to různé prvky", "Diamant je tvrdší jen proto, že vzniká hlouběji v Zemi"], hints: ["Oba jsou čistý uhlík – liší se jen strukturou."] },
  { question: "Proč jsou nerosty jako zlaté nebo stříbrné žíly v horninách?", correctAnswer: "Hydrotermální roztoky (horká voda s minerály) pronikají trhlinami do hornin a při ochlazení minerály krystalizují a usazují se v žilách", options: ["Hydrotermální roztoky (horká voda s minerály) pronikají trhlinami do hornin a při ochlazení minerály krystalizují a usazují se v žilách", "Zlato vzniká přímou chemickou reakcí v hornině", "Zlato a stříbro jsou vzácné, protože je do Země přinesly asteroidy", "Zlaté žíly jsou zbytky dávné sopečné horniny bohaté na kovy"], hints: ["Horká voda pod zemí rozpouští kovy a ukládá je při ochlazení."] },
  { question: "Proč jsou přeměněné horniny (metamorfity) jiné od hornin, ze kterých vznikly?", correctAnswer: "Vysoký tlak a teplota (ale bez tavení) přeuspořádají atomy a minerály horniny – vznikají nové minerály a struktury (např. z vápence mramor, ze žuly rula).", options: ["Vysoký tlak a teplota (ale bez tavení) přeuspořádají atomy a minerály horniny – vznikají nové minerály a struktury (např. z vápence mramor, ze žuly rula).", "Přeměněné horniny jsou jen tepelně zbarvené – složení zůstává stejné", "Přeměna probíhá tavením a tuhnutím podobně jako u vyvřelých hornin", "Přeměněné horniny vznikají jen na povrchu Země větráním"], hints: ["'Metamorf' = změna formy. Vápenec → mramor: stejný CaCO₃, jiná struktura."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const HORNINYANEROSTYDRUHYVLASTNOSTIVZNIK: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-horniny-a-nerosty-druhy-vlastnosti-vznik",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-horniny-a-nerosty-druhy-vlastnosti-vznik",
    title: "Horniny a nerosty - druhy, vlastnosti, vznik",
    studentTitle: "Horniny a kameny",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Neživá příroda - rozšíření",
    briefDescription: "Poznáš různé druhy hornin a nerostů a jak vznikají.",
    keywords: ["horniny", "nerosty", "minerály", "žula", "vápenec", "diamant", "uhlí", "Mohsova stupnice"],
    goals: ["Rozlišit tři typy hornin (vyvřelé, usazené, přeměněné)", "Popsat Mohsovu stupnici tvrdosti", "Uvést příklady užitných nerostů"],
    boundaries: ["Neprobírá chemické složení nerostů do hloubky", "Neprobírá krystalografii"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Horniny: vyvřelé (žula, čedič), usazené (vápenec, písek, uhlí), přeměněné (rula, mramor).",
      steps: [
        "1. Vyvřelé: magma → ochlazení → žula, čedič",
        "2. Usazené: vrstvení, stmelení → vápenec, uhlí",
        "3. Přeměněné: tlak + teplo → rula, mramor",
        "4. Mohsova stupnice: 1 (mastek) → 10 (diamant)",
      ],
      commonMistake: "Hornina NENÍ totéž jako nerost. Hornina = více nerostů dohromady.",
      example: "Žula = hornina z křemene + živce + slídy. Diamant = nerost (čistý uhlík).",
    },
  },
];
