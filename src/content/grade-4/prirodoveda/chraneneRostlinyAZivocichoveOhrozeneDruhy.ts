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
  { question: "Jak se jmenuje největší národní park v ČR?", correctAnswer: "NP Šumava", options: ["NP Šumava", "NP Krkonoše", "NP Podyjí", "NP České Švýcarsko"] },
  { question: "Kde se nachází hora Sněžka?", correctAnswer: "V NP Krkonoše", options: ["V NP Šumava", "V NP Krkonoše", "V NP Podyjí", "V NP České Švýcarsko"] },
  { question: "Jak se zkratkou nazývá Chráněná krajinná oblast?", correctAnswer: "CHKO", options: ["NP", "PR", "CHKO", "PP"] },
  { question: "Proč jsou některé druhy rostlin a živočichů chráněny zákonem?", correctAnswer: "Jsou ohroženy vyhynutím — zákon chrání jejich populace a stanoviště", options: ["Jsou nebezpečné pro lidi", "Zákon chrání jen ekonomicky cenné druhy", "Jsou to invazivní druhy šířící se nekontrolovaně", "Jsou ohroženy vyhynutím — zákon chrání jejich populace a stanoviště"] },
  { question: "Jak se jmenuje seznam ohrožených druhů v ČR?", correctAnswer: "Červená kniha ČR", options: ["Červená kniha ČR", "Zelená kniha ČR", "Zlatá kniha ČR", "Národní seznam ČR"] },
  { question: "Jaký živočich žije v řekách ČR a je chráněn — loví ryby?", correctAnswer: "Vydra říční", options: ["Kapr", "Vydra říční", "Štika", "Pstruh"] },
  { question: "Co jsou orchideje?", correctAnswer: "Zákonem chráněné rostliny s krásnými květy", options: ["Léčivé houby v lesích", "Invazivní trávy z Asie", "Zákonem chráněné rostliny s krásnými květy", "Druh mechu na skalách"] },
  { question: "Proč způsobuje zástavba a odlesňování ohrožení druhů?", correctAnswer: "Ničí přirozená stanoviště — živočichy a rostliny nemají kde žít", options: ["Zástavba zvyšuje biodiverzitu městských parků", "Odlesňování pomáhá lučním druhům", "Zástavba nemá vliv na divokou přírodu", "Ničí přirozená stanoviště — živočichy a rostliny nemají kde žít"] },
  { question: "Co je pytláctví?", correctAnswer: "Nelegální lov nebo sběr chráněných druhů", options: ["Nelegální lov nebo sběr chráněných druhů", "Legální lov zvěře v lese", "Pěstování chráněných rostlin na zahradě", "Záchrana zraněných živočichů v přírodě"] },
  { question: "Jak se jmenuje NP s pískovcovými skalami na severu ČR?", correctAnswer: "NP České Švýcarsko", options: ["NP Krkonoše", "NP České Švýcarsko", "NP Šumava", "NP Podyjí"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Vyjmenuj 4 národní parky ČR.", correctAnswer: "Šumava, Krkonoše, Podyjí, České Švýcarsko", options: ["Šumava, Beskydy, Jeseníky, Krkonoše", "Krkonoše, Jizera, Podyjí, Jeseníky", "Šumava, Krkonoše, Podyjí, České Švýcarsko", "Šumava, České Švýcarsko, Bohemian Paradise, Bílé Karpaty"] },
  { question: "Jak se liší NP od CHKO?", correctAnswer: "NP: přísněji chráněn, minimum lidského zasahování. CHKO: kulturní krajina s ochranou, zemědělství povoleno.", options: ["CHKO je prý ve všech ohledech chráněna přísněji než NP", "V NP prý může být zemědělství, v CHKO to naopak nikdy nejde", "NP a CHKO jsou ve skutečnosti totéž, liší se jen velikostí", "NP: přísněji chráněn, minimum lidského zasahování. CHKO: kulturní krajina s ochranou, zemědělství povoleno."] },
  { question: "Co jsou příčiny ohrožení druhů?", correctAnswer: "Ztráta stanoviště, pytláctví, chemikálie – pesticidy , znečištění, klimatická změna", options: ["Ztráta stanoviště, pytláctví, chemikálie – pesticidy , znečištění, klimatická změna", "Jen pytláctví a overhunting", "Jen klimatická změna", "Přemnoženost jiných druhů jako jediná příčina"] },
  { question: "Co je CITES?", correctAnswer: "Mezinárodní úmluva o obchodu s ohroženými druhy volně žijících živočichů a rostlin", options: ["Česká inspekce životního prostředí pro ochranu přírody", "Mezinárodní úmluva o obchodu s ohroženými druhy volně žijících živočichů a rostlin", "Evropský systém propojených národních parků", "Mezinárodní organizace pro zachování světových lesů"] },
  { question: "Uveď 3 zákonem chráněné rostliny ČR.", correctAnswer: "Orchideje, sněženka, koniklec – nebo jalovec, tis", options: ["Kopřiva, šípek, pampeliška", "Pšenice, ječmen, oves", "Orchideje, sněženka, koniklec – nebo jalovec, tis", "Jetel, tráva, šeřík"] },
  { question: "Proč jsou čmeláci ohrožení?", correctAnswer: "Úbytek lučních květů – intenzivní zemědělství , pesticidy, ztráta stanovišť", options: ["Přemnožení parazitů útočících jen na čmeláky", "Klimatická změna způsobuje jejich přemnožení", "Čmeláci nejsou ohroženi — populace roste", "Úbytek lučních květů – intenzivní zemědělství , pesticidy, ztráta stanovišť"] },
  { question: "Co je rak říční a proč je ohrožen?", correctAnswer: "Původní rak v ČR — ohrožen rakovým morem a vytlačením americkým rakem – invazivní druh", options: ["Původní rak v ČR — ohrožen rakovým morem a vytlačením americkým rakem – invazivní druh", "Invazivní druh raka pocházející z Asie, šířící se v ČR", "Druh ryby žijící výhradně v horských tocích", "Ohrožen prý pouze znečištěním vody v tocích"] },
  { question: "Proč je čáp bílý v Červené knize?", correctAnswer: "Ubývá zemědělsky hospodářených luk — chybí mu potravu – žáby, hmyz a hnízdní příležitosti", options: ["Čáp je chráněn prý jen kvůli svému kulturnímu symbolu", "Ubývá zemědělsky hospodářených luk — chybí mu potravu – žáby, hmyz a hnízdní příležitosti", "Čáp bílý vůbec není v Červené knize, je to hojný druh", "Čáp je ohrožen prý hlavně pytláctvím ve Střední Africe"] },
  { question: "Co je Bernská úmluva?", correctAnswer: "Evropská dohoda o ochraně volně žijících živočichů a rostlin a jejich přírodních stanovišť", options: ["Dohoda o regulaci těžby dřeva v Evropě", "Úmluva o znečišťování ovzduší v Evropě", "Evropská dohoda o ochraně volně žijících živočichů a rostlin a jejich přírodních stanovišť", "Smlouva o obchodu s ohroženými druhy celosvětově – CITES"] },
  { question: "Co jsou přírodní rezervace (PR a NPR)?", correctAnswer: "Menší chráněná území s výskytem chráněných druhů nebo cenných ekosystémů", options: ["Velké oblasti bez jakéhokoli lidského vlivu", "Zemědělské plochy bez pesticidů", "Zoologické zahrady volného typu", "Menší chráněná území s výskytem chráněných druhů nebo cenných ekosystémů"] },
  { question: "Proč se vlk vrátil přirozeně do ČR?", correctAnswer: "Přicestoval z okolních států – Německo, Slovensko — za posledních 30 let se populace obnovila", options: ["Přicestoval z okolních států – Německo, Slovensko — za posledních 30 let se populace obnovila", "Vlci byli záměrně vysazeni CHKO Šumava", "Vlk se do ČR nevracel — je tu trvale od dávných dob", "Vlk přišel ze zoo, kde byl odchován"] },
  { question: "Co je záchranný program pro ohrožené druhy?", correctAnswer: "Soubor cílených opatření – chov v zajetí, obnova stanoviště pro záchranu druhu před vyhynutím", options: ["Kontrola loveckých povolení vydávaných v celé přírodě", "Soubor cílených opatření – chov v zajetí, obnova stanoviště pro záchranu druhu před vyhynutím", "Program určený pro výsadbu invazivních druhů rostlin", "Čistě vědecký výzkum bez jakékoli praktické ochrany"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Co je fragmentace stanoviště a jak ohrožuje biodiverzitu?", correctAnswer: "Rozdělení přirozeného prostředí silnicemi a zástavbou — populace jsou izolovány, nemohou se mísit", options: ["Přirozené rozdělení ekosystémů způsobené klima", "Fragmentace zvyšuje biodiverzitu tím, že vytváří nové biotopy", "Rozdělení přirozeného prostředí silnicemi a zástavbou — populace jsou izolovány, nemohou se mísit", "Problém postihuje jen velké savce, ne ostatní druhy"] },
  { question: "Co je ekologický koridor a proč je důležitý?", correctAnswer: "Propojení izolovaných přírodních ploch – remízy, meze, břehové porosty — umožňuje migraci druhů", options: ["Silniční tunel pro průchod zvěře pod dálnicí pouze", "Chráněné území bez lidského vstupu", "Dálkový přechod ptáků nad celou Evropou", "Propojení izolovaných přírodních ploch – remízy, meze, břehové porosty — umožňuje migraci druhů"] },
  { question: "Proč je zánik vrcholových predátorů nebezpečný pro celý ekosystém?", correctAnswer: "Bez predátorů se přemnožují bylinožravci → přespásají vegetaci → erozí ztrácí se půda a biodiverzita", options: ["Bez predátorů se přemnožují bylinožravci → přespásají vegetaci → erozí ztrácí se půda a biodiverzita", "Zánik predátorů prý nemá žádný vliv na zbytek ekosystému", "Bez predátorů je prý celý ekosystém dokonce stabilnější", "Zánik predátorů ovlivní prý jen jejich přímou kořist"] },
  { question: "Co je klonování ohrožených druhů a jaké jsou jeho limity?", correctAnswer: "Reprodukce kopií DNA z tkáňových vzorků — limitem je absence genetické rozmanitosti a ztráta stanoviště", options: ["Klonování zcela nahradí záchranu přirozeného prostředí", "Reprodukce kopií DNA z tkáňových vzorků — limitem je absence genetické rozmanitosti a ztráta stanoviště", "Klonování je levné a jednoduché řešení", "Klonovaní jedinci jsou identičtí s původními — bez limitů"] },
  { question: "Jak je definováno vyhynutí druhu?", correctAnswer: "Zánik posledního jedince nebo nepřítomnost schopnosti reprodukce populace", options: ["Zánik 90 % populace v posledních 10 letech", "Zánik druhu ve všech NP světa", "Zánik posledního jedince nebo nepřítomnost schopnosti reprodukce populace", "Zánik samců nebo samic v divokých populacích"] },
  { question: "Co je reintrodukce druhu?", correctAnswer: "Záměrné znovu vysazení druhu do oblasti, kde dříve žil, ale vyhynul", options: ["Stěhování ohrožených druhů do zoo pro chov", "Přirozeně znovuobjevení druhu bez lidského vlivu", "Přesunutí druhu z jednoho NP do druhého", "Záměrné znovu vysazení druhu do oblasti, kde dříve žil, ale vyhynul"] },
  { question: "Proč jsou klimatická změna a ohrožení druhů propojené problémy?", correctAnswer: "Klimatická změna mění habitats rychleji, než se druhy dokáží přizpůsobit — akceleruje vymírání", options: ["Klimatická změna mění habitats rychleji, než se druhy dokáží přizpůsobit — akceleruje vymírání", "Klimatická změna je nezávislá na biodiverzitě", "Teplejší klima pomáhá ohroženým druhům přizpůsobit se", "Klimatická změna ovlivňuje jen arktické druhy"] },
  { question: "Co je ex-situ vs. in-situ ochrana druhu?", correctAnswer: "In-situ: ochrana v přirozeném prostředí (NP). Ex-situ: chov mimo přírodu – zoo, botanická zahrada .", options: ["In-situ je prý ochrana v zoo, ex-situ v NP a CHKO", "In-situ: ochrana v přirozeném prostředí (NP). Ex-situ: chov mimo přírodu – zoo, botanická zahrada .", "Obě metody jsou naprosto totožné, záleží jen na místě", "Ex-situ je prý vždy ekonomicky výhodnější a efektivnější"] },
  { question: "Jak je Česká republika zapojena do soustavy Natura 2000?", correctAnswer: "Síť chráněných území EU — ČR má stovky lokalit – ptačí oblasti + EVL chránící ohrožené druhy a habitaty", options: ["Natura 2000 prý zahrnuje pouze národní parky, ne CHKO", "ČR do sítě Natura 2000 vůbec nepatří, je to jen západ EU", "Síť chráněných území EU — ČR má stovky lokalit – ptačí oblasti + EVL chránící ohrožené druhy a habitaty", "Natura 2000 prý chrání jen vodní ekosystémy a nic jiného"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 35);
}

export const CHRANENEROSTLINYAZIVOCICHOVEOHROZENEDRUHY: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ochrana-prirody-chranene-rostliny-a-zivocichove-ohrozene-druhy",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ochrana-prirody-chranene-rostliny-a-zivocichove-ohrozene-druhy",
    title: "Chráněné rostliny a živočichové, ohrožené druhy",
    studentTitle: "Ochrana přírody",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš chráněná území ČR a pochopíš, proč musíme chránit ohrožené druhy.",
    keywords: ["ochrana přírody", "NP", "CHKO", "Červená kniha", "ohrožené druhy", "vydra", "vlk", "rys", "orchideje"],
    goals: [
      "Jmenovat 4 národní parky ČR",
      "Vysvětlit rozdíl mezi NP a CHKO",
      "Uvést příklady ohrožených druhů v ČR",
      "Popsat příčiny ohrožení (ztráta stanoviště, pytláctví, chemikálie)",
    ],
    boundaries: ["Mezinárodní politika ochrany přírody není náplní 4. ročníku v detailu"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "4 NP ČR: Šumava (největší), Krkonoše (Sněžka), Podyjí (jih), České Švýcarsko (pískovce).",
      steps: [
        "1. NP = přísná ochrana. CHKO = krajina s ochranou.",
        "2. Červená kniha = seznam ohrožených druhů.",
        "3. Ohrožení: vydra, rys, vlk, čáp čern, rak říční.",
        "4. Zákonem chráněné rostliny: orchideje, sněženka, koniklec.",
      ],
      commonMistake: "NP Šumava je NEJVĚTŠÍ, ne Krkonoše (Krkonoše jsou první svým vznikem v ČR).",
      example: "Vydra říční: chráněná, loví ryby v řekách. Ohrožena znečištěním vody a lovem v minulosti.",
    },
  },
];
