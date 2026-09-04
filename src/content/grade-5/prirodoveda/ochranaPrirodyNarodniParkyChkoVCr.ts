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
  { question: "Kolik národních parků má Česká republika?", correctAnswer: "4 národní parky", options: ["4 národní parky", "2 národní parky", "6 národních parků", "10 národních parků"], hints: ["NP Šumava, Krkonoše, Podyjí, České Švýcarsko."] },
  { question: "Jak se jmenuje největší národní park ČR?", correctAnswer: "NP Šumava", options: ["NP Krkonoše", "NP Šumava", "NP Podyjí", "NP České Švýcarsko"], hints: ["Leží na jihozápadě Čech u hranice s Německem a Rakouskem."] },
  { question: "Co je CHKO?", correctAnswer: "Chráněná krajinná oblast – území s cennou přírodou, kde je povoleno bydlení a hospodaření s omezeními", options: ["Přísná přírodní rezervace, do které nesmí veřejnost vůbec vstoupit", "Název používaný pro pralesy zcela bez lidského zásahu", "Chráněná krajinná oblast – území s cennou přírodou, kde je povoleno bydlení a hospodaření s omezeními", "Vědecká stanice určená výhradně k výzkumu přírody"], hints: ["CHKO je méně přísná ochrana než národní park."] },
  { question: "Proč zakládáme chráněná území?", correctAnswer: "Aby se zachovala biodiverzita, vzácné druhy a přírodní ekosystémy", options: ["Aby turisté mohli volně vstupovat do divoké přírody", "Aby se mohlo těžit dřevo bez kontroly", "Kvůli turistickým příjmům pro stát", "Aby se zachovala biodiverzita, vzácné druhy a přírodní ekosystémy"], hints: ["Chráněná území chrání přírodu před lidskou činností."] },
  { question: "Co je CITES?", correctAnswer: "Mezinárodní úmluva o ochraně ohrožených druhů před obchodem", options: ["Mezinárodní úmluva o ochraně ohrožených druhů před obchodem", "Evropský program výsadby lesů", "Český zákon o národních parcích", "Organizace spravující CHKO v ČR"], hints: ["CITES = zakazuje obchod se slony, nosorožci a dalšími ohroženými druhy."] },
  { question: "Který národní park leží v Moravě na řece Dyji?", correctAnswer: "NP Podyjí", options: ["NP Šumava", "NP Podyjí", "NP Krkonoše", "NP České Švýcarsko"], hints: ["Přemýšlej, jak se řekne 'kraj kolem řeky Dyje' jedním slovem — národní parky se často jmenují podle místa, kde leží."] },
  { question: "Co ohrožuje biodiverzitu v ČR?", correctAnswer: "Monokulturní zemědělství, zástavba, chemie, kácení lesů", options: ["Přílišná ochrana přírody omezující zemědělce", "Přemnožení vlků v národních parcích", "Monokulturní zemědělství, zástavba, chemie, kácení lesů", "Příliš mnoho turistů v chráněných oblastech"], hints: ["Biodiverzita = rozmanitost druhů."] },
  { question: "Co je uhlíková stopa a jak ji snížit?", correctAnswer: "Množství CO₂ vyprodukované naší činností; snížíme ji MHD, méně masa, recyklací", options: ["Stopa zbylá po těžbě uhlí zanechaná v půdě", "Znečištění vody způsobené průmyslovými procesy továren", "Celkový počet automobilů jezdících po silnicích", "Množství CO₂ vyprodukované naší činností; snížíme ji MHD, méně masa, recyklací"], hints: ["Méně CO₂ = menší skleníkový efekt."] },
  { question: "Jak se jmenuje národní park v severních Čechách s pískovcovými skalami?", correctAnswer: "NP České Švýcarsko", options: ["NP České Švýcarsko", "NP Šumava", "NP Podyjí", "NP Krkonoše"], hints: ["Leží v Lužických horách u hranic s Německem."] },
  { question: "Co je biodiverzita?", correctAnswer: "Rozmanitost druhů živých organismů v ekosystému nebo na Zemi", options: ["Počet chráněných území v ČR", "Rozmanitost druhů živých organismů v ekosystému nebo na Zemi", "Druh ochrany přírody zaměřený na lesy", "Věda zkoumající druhy ohrožené vyhynutím"], hints: ["Bio = život, diverzita = rozmanitost."] },
  { question: "Jak mohou děti přispět k ochraně přírody?", correctAnswer: "Třídit odpad, šetřit vodou a energií, nekupovat výrobky z ohrožených zvířat, jezdit MHD", options: ["Navštěvovat národní parky co nejčastěji, i vícekrát týdně", "Sázet výhradně exotické, dovezené druhy stromů", "Třídit odpad, šetřit vodou a energií, nekupovat výrobky z ohrožených zvířat, jezdit MHD", "Reportovat všechna zvířata, která uvidí, do záchranných stanic"], hints: ["Každý může přispět malými každodenními kroky."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaký je rozdíl mezi národním parkem a CHKO?", correctAnswer: "NP: přísná ochrana, omezené lidské aktivity, zaměření na přirozené procesy. CHKO: mírnější ochrana, povoleno hospodaření a bydlení s omezeními.", options: ["NP a CHKO jsou prý ve skutečnosti úplně totéž, liší se jen svým názvem", "CHKO je prý mnohem přísnější než NP, protože turistům úplně zakazuje vstup", "NP se nacházejí jen v horách, CHKO jen u moře — liší se čistě geograficky", "NP: přísná ochrana, omezené lidské aktivity, zaměření na přirozené procesy. CHKO: mírnější ochrana, povoleno hospodaření a bydlení s omezeními."], hints: ["NP = příroda na prvním místě. CHKO = příroda a lidé v rovnováze."] },
  { question: "Proč se v ČR zalesňují monokultury borovic nahrazovány smíšenými lesy?", correctAnswer: "Smíšené lesy jsou odolnější vůči kůrovci, suchu a větrným kalamitám – monokultura borovic a smrků je zranitelná", options: ["Smíšené lesy jsou odolnější vůči kůrovci, suchu a větrným kalamitám – monokultura borovic a smrků je zranitelná", "Monokulturní lesy produkují méně dřeva než smíšené", "Smíšené lesy rostou rychleji a jsou ekonomicky výnosnější", "Smrky v monokultuře jsou neatraktivní pro turisty"], hints: ["Kůrovec devastoval smrkové monokultury v ČR po roce 2018."] },
  { question: "Proč je CITES důležitá mezinárodní úmluva?", correctAnswer: "Ohrožené druhy jsou obchodovány přes hranice – bez mezinárodní spolupráce by národní zákony nestačily ochránit slony, nosorožce a další", options: ["CITES je důležitá hlavně proto, že v ČR trestá pytláky za lov zvěře", "Ohrožené druhy jsou obchodovány přes hranice – bez mezinárodní spolupráce by národní zákony nestačily ochránit slony, nosorožce a další", "CITES v Evropě hlavně koordinuje péči o zraněná volně žijící zvířata", "CITES především reguluje těžbu dřeva v tropických deštných lesích"], hints: ["185 zemí podepsalo CITES – mezinárodní spolupráce je klíčová."] },
  { question: "Co je fragmentace krajiny a jak poškozuje přírodu?", correctAnswer: "Rozdělení krajiny silnicemi, zástavbou, plotmi – zvířata nemohou migrovat, populace se izolují a ztrácejí genetickou rozmanitost", options: ["Přirozené rozdělení krajiny horami a řekami podporující biodiverzitu", "Zemědělská praxe sekání luk na menší části", "Rozdělení krajiny silnicemi, zástavbou, plotmi – zvířata nemohou migrovat, populace se izolují a ztrácejí genetickou rozmanitost", "Vědecké dělení krajiny na sektory pro ekologické výzkumy"], hints: ["Ekodukt (most pro zvěř nad dálnicí) řeší fragmentaci krajiny."] },
  { question: "Proč reintrodukce vlků do krajiny prospívá ekosystému?", correctAnswer: "Vlci regulují populaci jelena a srnce. Přemnožení jeleni spásají mladé stromy – vlci omezí spásání a podpoří obnovu lesa a biodiverzity.", options: ["Vlci jsou špatní – ohrožují dobytek a proto by neměli být reintrodukováni", "Vlci pomáhají jen tím, že konzumují slabé a nemocné jedince – jiný vliv nemají", "Reintrodukce vlků nemá vliv na ekosystém – jde jen o symbolickou ochranu", "Vlci regulují populaci jelena a srnce. Přemnožení jeleni spásají mladé stromy – vlci omezí spásání a podpoří obnovu lesa a biodiverzity."], hints: ["Yellowstone efekt: vlci → jeleni → vegetace → řeky."] },
  { question: "Jak klimatická změna ohrožuje chráněná území?", correctAnswer: "Teplotní a srážkové podmínky se mění rychleji, než druhy dokáží migrovat – endemické druhy bez možnosti úniku mohou vyhynout", options: ["Teplotní a srážkové podmínky se mění rychleji, než druhy dokáží migrovat – endemické druhy bez možnosti úniku mohou vyhynout", "Klimatická změna chráněná území neovlivňuje, protože jsou izolována od okolí", "Teplejší klima prospívá všem druhům v chráněných územích", "Chráněná území jsou dobře vybavena na klimatickou změnu díky přísné ochraně"], hints: ["Horské druhy nemohou jít výše, pokud vrchol je příliš malý."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč je ochrana biodiverzity důležitá i pro člověka, nejen pro přírodu?", correctAnswer: "Ekosystémové služby: čistá voda, vzduch, potraviny, léky, klimatická regulace – závisí na fungujícím ekosystému s vysokou biodiverzitou.", options: ["Biodiverzita je důležitá jen esteticky – příroda je hezká.", "Ekosystémové služby: čistá voda, vzduch, potraviny, léky, klimatická regulace – závisí na fungujícím ekosystému s vysokou biodiverzitou.", "Ochrana přírody je morální povinnost, ale na lidský blahobyt nemá vliv.", "Biodiverzita prospívá turistickému průmyslu – ekonomický přínos."], hints: ["Opylování plodin hmyzem = ekosystémová služba zdarma."] },
  { question: "Co je princip předběžné opatrnosti při ochraně přírody?", correctAnswer: "Pokud existuje riziko vážného poškození ekosystému, jednáme preventivně, i když vědecké důkazy nejsou zcela jisté – lépe být opatrní než litovat.", options: ["Jednáme jen tehdy, když je škoda už zcela jednoznačně prokázaná a nevratná", "Princip prý říká, že přírodu necháme, ať se o sebe postará úplně sama bez nás", "Pokud existuje riziko vážného poškození ekosystému, jednáme preventivně, i když vědecké důkazy nejsou zcela jisté – lépe být opatrní než litovat.", "Preventivní ochrana se prý aplikuje jen na ohrožené druhy, nikdy na celé ekosystémy"], hints: ["Pesticidy DDT: negativní efekty byly zpočátku neznámé – princip opatrnosti by chránil."] },
  { question: "Jak se liší ochrana in situ a ex situ?", correctAnswer: "In situ: ochrana druhů v jejich přirozeném prostředí (NP, CHKO). Ex situ: ochrana mimo přirozené prostředí – ZOO, botanické zahrady, genové banky .", options: ["In situ prý znamená mezinárodní ochranu, ex situ zase jen národní ochranu", "In situ je prý méně efektivní, ex situ je modernější a mnohem účinnější", "Oba pojmy popisují ochranu jen v chráněných územích, liší se čistě velikostí", "In situ: ochrana druhů v jejich přirozeném prostředí (NP, CHKO). Ex situ: ochrana mimo přirozené prostředí – ZOO, botanické zahrady, genové banky ."], hints: ["Zubr v ZOO (ex situ) → reintrodukce do přírody (in situ)."] },
  { question: "Proč je ochrana mokřadů klíčová pro klimatickou adaptaci?", correctAnswer: "Mokřady zadržují vodu v krajině, filtrují ji, ukládají CO₂ v rašelině a tlumí povodně. Jejich vysušení uvolňuje CO₂ a snižuje odolnost krajiny vůči suchu.", options: ["Mokřady zadržují vodu v krajině, filtrují ji, ukládají CO₂ v rašelině a tlumí povodně. Jejich vysušení uvolňuje CO₂ a snižuje odolnost krajiny vůči suchu.", "Mokřady jsou prý ekologicky zcela bezcenná území, vhodná spíš pro zemědělství", "Mokřady jsou prý důležité jen pro migrující ptáky, jinak jsou zcela bezvýznamné", "Klimatická adaptace prý na mokřadech vůbec nezávisí, závisí pouze a jen na lesích"], hints: ["Rašeliniště váže více CO₂ na plochu než tropický deštný les."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const OCHRANAPRIRODYNARODNIPARKYCHKOVCR: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-ochrana-prirody-narodni-parky-chko-v-cr",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-ochrana-prirody-narodni-parky-chko-v-cr",
    title: "Ochrana přírody, národní parky, CHKO v ČR",
    studentTitle: "Ochrana přírody",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Ekosystémy a životní prostředí",
    briefDescription: "Poznáš národní parky ČR a proč chráníme přírodu.",
    keywords: ["národní park", "CHKO", "biodiverzita", "ochrana přírody", "CITES", "Šumava", "Krkonoše"],
    goals: ["Vyjmenovat 4 národní parky ČR", "Vysvětlit rozdíl mezi NP a CHKO", "Popsat hrozby pro biodiverzitu"],
    boundaries: ["Neprobírá detailní legislativu ochrany přírody", "Neprobírá globální ochranu přírody do hloubky"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "4 NP v ČR: Šumava, Krkonoše, Podyjí, České Švýcarsko. CHKO je méně přísná ochrana.",
      steps: [
        "1. NP Šumava – největší, jihozápad Čech.",
        "2. NP Krkonoše – nejvyšší hory ČR.",
        "3. NP Podyjí – kaňon řeky Dyje.",
        "4. NP České Švýcarsko – pískovcové skály v severních Čechách.",
        "5. CHKO: mírnější ochrana, povoleno bydlení.",
      ],
      commonMistake: "CHKO NENÍ národní park – je méně přísně chráněná.",
      example: "NP Šumava: pralesy, rašeliniště, bobři. CHKO Beskydy: Moravské hory s lidskými sídly.",
    },
  },
];
