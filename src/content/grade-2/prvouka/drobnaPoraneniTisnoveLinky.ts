import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one (4 možnosti).
//   L1 = rozpoznání jednoho jasného faktu — tísňové číslo dané složky,
//        kdo/co při drobném úrazu (na ránu náplast, na oheň hasiče).
//   L2 = aplikace: podle popsané situace vyber správný postup nebo
//        správnou složku pomoci (spadl a krvácí, hoří tráva, boule…).
//   L3 = transfer (2 kroky, věk 7-8 let): rozlišení blízkých tísňových
//        čísel a složek, „proč“ otázky, oprava miskoncepce, správné
//        pořadí kroků při vážnějším úrazu.
// Každá úloha: 2 vlastní nápovědy (malá → velká), vysvětlení PROČ
// a optionFeedback ke každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Jaké je tísňové číslo záchranné služby (sanitky)?",
    correctAnswer: "155",
    options: ["155", "150", "158", "112"],
    emoji: "🚑",
    hints: [
      "Záchranáři přijíždějí sanitkou k nemocným a zraněným — na které číslo je voláme?",
      "Tři česká tísňová čísla začínají na 15 a liší se jen poslední číslicí. Vzpomeň si na číslo napsané velkými písmeny na boku sanitky.",
    ],
    solutionSteps: ["Záchranná služba má číslo 155 — voláme ho, když někdo potřebuje zdravotní pomoc."],
    optionFeedback: {
      "150": "Číslo 150 patří hasičům. Ti přijedou k požáru.",
      "158": "Číslo 158 patří policii.",
      "112": "Číslo 112 je společné evropské tísňové číslo. Sanitka má svoje vlastní české číslo.",
    },
  },
  {
    question: "Jaké je tísňové číslo hasičů?",
    correctAnswer: "150",
    options: ["155", "150", "158", "112"],
    emoji: "🚒",
    hints: [
      "Hasiči hasí požáry — na které číslo je voláme?",
      "Česká čísla záchranky, hasičů a policie začínají stejně, na 15. Vzpomeň si na červené hasičské auto a na číslo na jeho dveřích.",
    ],
    solutionSteps: ["Hasiči mají číslo 150 — voláme ho, když hoří nebo hrozí jiné nebezpečí."],
    optionFeedback: {
      "155": "Číslo 155 patří záchranné službě, ne hasičům.",
      "158": "Číslo 158 patří policii.",
      "112": "Číslo 112 je společné evropské číslo. Hasiči mají i svoje vlastní české číslo.",
    },
  },
  {
    question: "Jaké je tísňové číslo policie?",
    correctAnswer: "158",
    options: ["150", "155", "158", "112"],
    emoji: "👮",
    hints: [
      "Policie chrání lidi a řeší krádeže a nehody — na které číslo ji voláme?",
      "I policejní číslo začíná na 15 jako čísla záchranky a hasičů. Vzpomeň si na modrobílé policejní auto a číslo, které má na boku.",
    ],
    solutionSteps: ["Policie má číslo 158 — voláme ho, když potřebujeme policejní pomoc."],
    optionFeedback: {
      "150": "Číslo 150 patří hasičům.",
      "155": "Číslo 155 patří záchranné službě.",
      "112": "Číslo 112 je společné evropské číslo. Česká policie má svoje vlastní.",
    },
  },
  {
    question: "Jaké tísňové číslo platí ve všech zemích Evropy?",
    correctAnswer: "112",
    options: ["155", "150", "158", "112"],
    emoji: "📞",
    hints: [
      "Jedno společné číslo funguje v celé Evropě — které to je?",
      "Tři z nabízených čísel začínají na 15 a jsou jen česká. Hledané číslo vypadá jinak a spojí tě s pomocí i na dovolené v cizí zemi.",
    ],
    solutionSteps: ["Tísňové číslo 112 platí v celé Evropě — dovoláš se jím pomoci ve všech zemích EU."],
    optionFeedback: {
      "155": "Číslo 155 je česká záchranka, v jiných zemích mají svá čísla.",
      "150": "Číslo 150 jsou čeští hasiči, neplatí v celé Evropě.",
      "158": "Číslo 158 je česká policie, neplatí v celé Evropě.",
    },
  },
  {
    question: "Co dáme na malou odřeninu?",
    correctAnswer: "Náplast",
    options: ["Náplast", "Horký obklad", "Hrst hlíny", "Sádru"],
    emoji: "🩹",
    hints: [
      "Malou odřeninu je potřeba ochránit před nečistotou — co na ni přiložíme?",
      "Hledej něco malého a lepivého z lékárničky, co ranku přikryje. Nosíš to někdy na koleni po pádu z kola.",
    ],
    solutionSteps: ["Na odřeninu dáme náplast — chrání ranku před nečistotou a pomáhá hojení."],
    optionFeedback: {
      "Horký obklad": "Horko ranku nevyčistí ani nepřikryje, na odřeninu se nedává.",
      "Hrst hlíny": "Hlína by ranku zašpinila a mohla by se zanítit.",
      Sádru: "Sádru dává lékař na zlomenou ruku nebo nohu, ne na odřeninu.",
    },
  },
  {
    question: "Koho voláme, když hoří?",
    correctAnswer: "Hasiče",
    options: ["Policii", "Hasiče", "Zubaře", "Pošťáka"],
    emoji: "🚒",
    hints: [
      "Oheň je nebezpečný — kdo ho umí uhasit?",
      "Hledej lidi, kteří mají hadice, přilby a velké červené auto se žebříkem. Umějí oheň uhasit a zachránit lidi z hořícího domu.",
    ],
    solutionSteps: ["Když hoří, voláme hasiče — přijedou a oheň uhasí."],
    optionFeedback: {
      Policii: "Policie řeší krádeže a nehody. Oheň hasí jiná složka.",
      Zubaře: "Zubař léčí zuby, oheň nehasí.",
      Pošťáka: "Pošťák nosí dopisy, oheň hasit neumí.",
    },
  },
  {
    question: "Koho voláme, když se někdo vážně zraní?",
    correctAnswer: "Záchrannou službu",
    options: ["Policii", "Kamaráda ze třídy", "Záchrannou službu", "Pošťáka"],
    emoji: "🚑",
    hints: [
      "Vážné zranění potřebuje zdravotní pomoc — kdo ji poskytne?",
      "Hledej lidi, kteří přijedou autem s majákem a nosítky, umějí zraněného ošetřit a odvézt do nemocnice.",
    ],
    solutionSteps: ["Při vážném úrazu voláme záchrannou službu — přijedou záchranáři a zraněného ošetří."],
    optionFeedback: {
      Policii: "Policie řeší krádeže a nehody, ale zranění ošetřují záchranáři.",
      "Kamaráda ze třídy": "Kamarád vážné zranění ošetřit neumí. Potřebuješ odbornou pomoc.",
      Pošťáka: "Pošťák zdravotní pomoc neposkytuje.",
    },
  },
  {
    question: "Čím umyjeme špinavou ranku?",
    correctAnswer: "Čistou vodou",
    options: ["Vodou z kaluže", "Slinami", "Sněhem z cesty", "Čistou vodou"],
    emoji: "💧",
    hints: [
      "Ranku je potřeba zbavit nečistot — čím ji opláchneme?",
      "Do ranky nesmí dostat žádná další špína. Hledej tekutinu, která teče z kohoutku a kterou můžeš bez obav i pít.",
    ],
    solutionSteps: ["Ranku umyjeme čistou vodou — smyjeme nečistoty, aby se dobře hojila."],
    optionFeedback: {
      "Vodou z kaluže": "Voda z kaluže je špinavá. Nečistoty by do ranky naopak zanesla.",
      Slinami: "V puse je spousta bakterií. Olizováním ranku nevyčistíš.",
      "Sněhem z cesty": "Sníh z cesty obsahuje prach a špínu, do ranky nepatří.",
    },
  },
  {
    question: "Koho zavolá malé dítě, když se stane úraz?",
    correctAnswer: "Dospělého",
    options: ["Dospělého", "Nikoho, poradí si samo", "Jiné malé dítě", "Domácího mazlíčka"],
    emoji: "🧑",
    hints: [
      "Malé dítě samo úraz nezvládne — koho si přivolá na pomoc?",
      "Hledej někoho, kdo ví, jak ranku ošetřit, a když je to vážné, umí zavolat záchranku. Ve škole je to učitelka, doma rodič.",
    ],
    solutionSteps: ["Při úrazu zavolá dítě dospělého — ten pomůže nebo přivolá záchrannou službu."],
    optionFeedback: {
      "Nikoho, poradí si samo": "Úraz může být vážnější, než se zdá. Dospělý to posoudí líp.",
      "Jiné malé dítě": "Jiné dítě většinou neví o moc víc. Pomoc je potřeba od dospělého.",
      "Domácího mazlíčka": "Zvíře pomoc přivolat nedokáže.",
    },
  },
  {
    question: "Co přiložíme na bouli od nárazu?",
    correctAnswer: "Studený obklad",
    options: ["Horký obklad", "Studený obklad", "Náplast", "Mastný krém"],
    emoji: "🧊",
    hints: [
      "Boule bolí a otéká — pomůže spíš chlad, nebo teplo?",
      "Vzpomeň si, co ti maminka přiloží na čelo, když se uhodíš. Může to být i něco z mrazáku zabalené do utěrky.",
    ],
    solutionSteps: ["Na bouli přiložíme studený obklad — chlad zmírní otok i bolest."],
    optionFeedback: {
      "Horký obklad": "Teplo by otok ještě zvětšilo.",
      Náplast: "Boule není rána, náplast jí nepomůže. Pomůže chlad.",
      "Mastný krém": "Krém otok nezmenší. Na bouli pomáhá chlad.",
    },
  },
  {
    question: "Koho voláme, když nám někdo ukradne kolo?",
    correctAnswer: "Policii",
    options: ["Hasiče", "Záchrannou službu", "Policii", "Opraváře kol"],
    emoji: "🚓",
    hints: [
      "Krádež je práce pro jednu určitou složku — kterou?",
      "Hledej lidi v uniformě, kteří hledají zloděje a vracejí ukradené věci. Jezdí v modrobílém autě s nápisem na boku.",
    ],
    solutionSteps: ["Při krádeži voláme policii — ta krádeže vyšetřuje."],
    optionFeedback: {
      Hasiče: "Hasiči hasí požáry, krádeže nevyšetřují.",
      "Záchrannou službu": "Záchranka pomáhá zraněným, krádež neřeší.",
      "Opraváře kol": "Opravář kolo spraví, ale zloděje nenajde.",
    },
  },
  {
    question: "Kam jdeme, když je zranění vážné a musí ho ošetřit lékař?",
    correctAnswer: "Do nemocnice",
    options: ["Do lékárny", "Do školy za paní učitelkou", "Domů do postele", "Do nemocnice"],
    emoji: "🏥",
    hints: [
      "Malou ranku zvládneme doma, ale vážné zranění patří k lékaři — kam?",
      "Hledej budovu, kde pracují lékaři a sestry, mají tam rentgen a ošetřovnu a sanitka tam vozí zraněné.",
    ],
    solutionSteps: ["Vážné zranění ošetří v nemocnici — jsou tam lékaři a vybavení pro vážnější úrazy."],
    optionFeedback: {
      "Do lékárny": "V lékárně prodávají léky, ale vážné zranění tam neošetří.",
      "Do školy za paní učitelkou": "Učitelka pomůže přivolat pomoc, ale vážné zranění musí ošetřit lékař.",
      "Domů do postele": "Vážné zranění se samo nezahojí. Musí ho vidět lékař.",
    },
  },
  {
    question: "Co záchranné službě řekneme do telefonu jako první?",
    correctAnswer: "Co se stalo a kde jsme",
    options: ["Co se stalo a kde jsme", "Jen svoje jméno a hned zavěsíme", "Kolik je nám let", "Jakou barvu má naše auto"],
    emoji: "📞",
    hints: [
      "Záchranář potřebuje hned vědět dvě věci — proč voláš a kam má přijet.",
      "Představ si, že jsi záchranář a sedáš do sanitky. Co musíš vědět, abys věděl, jakou pomoc vzít, a abys trefil na správné místo?",
    ],
    solutionSteps: ["Do telefonu nejdřív řekneme, co se stalo a kde jsme — aby záchranáři věděli, kam a proč přijet."],
    optionFeedback: {
      "Jen svoje jméno a hned zavěsíme": "Podle jména záchranáři nevědí, kam jet ani co se stalo. Nezavěšujeme, dokud to neřekne operátor.",
      "Kolik je nám let": "Věk není to první, co záchranář potřebuje. Nejdřív místo a co se stalo.",
      "Jakou barvu má naše auto": "Barva auta záchranářům nepomůže zjistit, kam a proč jet.",
    },
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Spadl jsi z kola a odřel si koleno, které trochu krvácí. Co uděláš nejdřív?",
    correctAnswer: "Opláchnu ranku čistou vodou a řeknu to dospělému",
    options: [
      "Zasypu ranku pískem a hraju si dál",
      "Opláchnu ranku čistou vodou a řeknu to dospělému",
      "Ranku si nechám a nikomu nic neřeknu",
      "Olížu si koleno a pojedu dál",
    ],
    emoji: "🚲",
    hints: [
      "Nejdřív ranku vyčistíme a pak to řekneme dospělému.",
      "Mysli na dvě věci: jak z ranky dostat špínu, aby se nezanítila, a kdo ti pomůže ranku ošetřit a posoudí, jestli je to vážné.",
    ],
    solutionSteps: ["Odřené koleno nejdřív opláchneme čistou vodou a řekneme to dospělému. Písek ani sliny na ranku nepatří — zanesly by do ní špínu a bakterie."],
    optionFeedback: {
      "Zasypu ranku pískem a hraju si dál": "Písek ranku zašpiní a může se zanítit.",
      "Ranku si nechám a nikomu nic neřeknu": "Špinavá ranka se může zanítit. Dospělý by měl o úrazu vědět.",
      "Olížu si koleno a pojedu dál": "V puse jsou bakterie, olizováním ranku nevyčistíš.",
    },
  },
  {
    question: "V lese vidíš, že od ohniště začíná hořet suchá tráva a oheň se šíří. Koho zavoláš?",
    correctAnswer: "Hasiče na číslo 150",
    options: ["Záchrannou službu na číslo 155", "Policii na číslo 158", "Hasiče na číslo 150", "Nikoho, oheň uhasím sám"],
    emoji: "🔥",
    hints: [
      "Kdo umí uhasit šířící se oheň?",
      "Šířící se oheň v lese je nebezpečný a malé dítě ho samo nehasí. Vyber složku, která jezdí k požárům, a zkontroluj, že k ní sedí správné číslo.",
    ],
    solutionSteps: ["Šířící se oheň hlásíme hasičům na číslo 150. Sami ho hasit nezkoušíme — je to nebezpečné, radši přivoláme pomoc a odejdeme do bezpečí."],
    optionFeedback: {
      "Záchrannou službu na číslo 155": "Záchranka pomáhá zraněným. K ohni patří hasiči.",
      "Policii na číslo 158": "Policie oheň nehasí. Požár hlásíme hasičům.",
      "Nikoho, oheň uhasím sám": "Šířící se oheň je pro dítě nebezpečný. Přivolej pomoc a jdi do bezpečí.",
    },
  },
  {
    question: "Kamarád spadl, drží se za nohu, nemůže vstát a hodně ho to bolí. Co uděláš?",
    correctAnswer: "Zavolám dospělého, případně záchrannou službu 155",
    options: ["Zavolám hasiče na 150", "Přinutím ho vstát a běžet", "Nechám ho tam a odejdu", "Zavolám dospělého, případně záchrannou službu 155"],
    emoji: "🚑",
    hints: [
      "Kdo pomůže se zraněním, které bolí a člověk nemůže vstát?",
      "Noha může být zlomená, takže s ní nehýbeme. Kdo je nejblíž, aby pomohl hned, a kdo přijede se sanitkou, když je to vážné?",
    ],
    solutionSteps: ["Když kamarád nemůže vstát a moc ho to bolí, přivoláme dospělého nebo záchrannou službu 155. Nenutíme ho vstávat — mohli bychom zranění zhoršit."],
    optionFeedback: {
      "Zavolám hasiče na 150": "Hasiče voláme k ohni. Ke zranění patří záchranka.",
      "Přinutím ho vstát a běžet": "Pokud je noha zraněná, pohyb by to mohl zhoršit.",
      "Nechám ho tam a odejdu": "Zraněného kamaráda nenecháme samotného. Přivoláme pomoc.",
    },
  },
  {
    question: "Uhodil ses do hlavy a začíná ti růst boule. Co pomůže?",
    correctAnswer: "Přiložit na bouli studený obklad",
    options: [
      "Přiložit na bouli studený obklad",
      "Přiložit na bouli horký hrnek",
      "Bouli silně stisknout a mačkat",
      "Přelepit bouli náplastí",
    ],
    emoji: "🤕",
    hints: [
      "Co zmírní otok a bolest — chlad, nebo teplo?",
      "Otok roste, protože se do místa nahrne krev. Co z nabídky ten proud zpomalí? Vzpomeň si na sáček ledu zabalený do utěrky.",
    ],
    solutionSteps: ["Na bouli přiložíme něco studeného — chlad zmenší otok a bolest. Teplo by otok naopak zvětšilo."],
    optionFeedback: {
      "Přiložit na bouli horký hrnek": "Teplo otok zvětšuje, navíc by ses mohl spálit.",
      "Bouli silně stisknout a mačkat": "Mačkání bouli jen víc rozbolí.",
      "Přelepit bouli náplastí": "Boule není rána, náplast otok nezmenší.",
    },
  },
  {
    question: "Když voláš na tísňovou linku, co je nejdůležitější říct?",
    correctAnswer: "Co se stalo a kde přesně jsme",
    options: ["Jak se jmenuje naše morče", "Co se stalo a kde přesně jsme", "Jakou barvu máme nejraději", "Co jsme dnes snídali"],
    emoji: "📞",
    hints: [
      "Pomoc musí vědět, proč jede a kam.",
      "Operátor na lince podle tvých slov rozhodne, koho pošle a kam. Zbytečné věci by jen zdržovaly. Co z nabídky mu k tomu opravdu pomůže?",
    ],
    solutionSteps: ["Na tísňové lince nejdřív řekneme, co se stalo a kde jsme. Podle toho pošlou správnou pomoc a najdou nás."],
    optionFeedback: {
      "Jak se jmenuje naše morče": "Jméno morčete záchranářům nepomůže. Potřebují vědět, co se stalo a kde.",
      "Jakou barvu máme nejraději": "Oblíbená barva s úrazem nesouvisí a zdržuje.",
      "Co jsme dnes snídali": "Snídaně operátora nezajímá. Řekni hlavně, co se stalo a kde jste.",
    },
  },
  {
    question: "Máš malou odřeninu, která skoro nekrvácí. Jak ji ošetříš?",
    correctAnswer: "Umyji ji čistou vodou a přelepím náplastí",
    options: ["Zavolám kvůli ní záchrannou službu 155", "Nechám ji špinavou a přikryji blátem", "Umyji ji čistou vodou a přelepím náplastí", "Posypu ji pískem"],
    emoji: "🩹",
    hints: [
      "Malou ranku zvládneme ošetřit sami — umýt a přelepit.",
      "Rozliš malý a vážný úraz: sanitka jezdí k vážným věcem. U drobné odřeniny stačí dva kroky z lékárničky a od kohoutku.",
    ],
    solutionSteps: ["Malou odřeninu umyjeme čistou vodou a přelepíme náplastí. Sanitku kvůli ní nevoláme — ta jezdí k vážným úrazům."],
    optionFeedback: {
      "Zavolám kvůli ní záchrannou službu 155": "Kvůli malé odřenině se sanitka nevolá. Může být potřeba jinde.",
      "Nechám ji špinavou a přikryji blátem": "Bláto ranku zašpiní a může se zanítit.",
      "Posypu ji pískem": "Písek do ranky zanese špínu.",
    },
  },
  {
    question: "Kterou tísňovou linku zavoláš, když jsi v cizí zemi a nevíš tamní čísla?",
    correctAnswer: "112",
    options: ["150", "155", "158", "112"],
    emoji: "🌍",
    hints: [
      "Které číslo funguje v celé Evropě?",
      "Čísla začínající na 15 platí hlavně u nás v Česku. Hledáš jedno společné číslo, které funguje i u moře v Chorvatsku nebo v Itálii.",
    ],
    solutionSteps: ["V cizí evropské zemi vytočíme 112 — funguje v celé Evropě a spojí nás s pomocí i tam, kde tamní čísla neznáme."],
    optionFeedback: {
      "150": "Číslo 150 jsou čeští hasiči, v cizině nemusí fungovat.",
      "155": "Číslo 155 je česká záchranka, v cizině mají jiné číslo.",
      "158": "Číslo 158 je česká policie, v cizině nemusí fungovat.",
    },
  },
  {
    question: "Než jako dítě zavoláš pomoc při úrazu, koho hlavně sháníš kolem sebe?",
    correctAnswer: "Dospělého, který pomůže",
    options: ["Dospělého, který pomůže", "Jiné malé dítě", "Domácího mazlíčka", "Nikoho, poradím si sám"],
    emoji: "🧑‍🤝‍🧑",
    hints: [
      "Kdo dokáže líp posoudit situaci a zavolat pomoc?",
      "Rozhlédni se v duchu kolem sebe na hřišti nebo ve škole. Kdo tam umí ranku ošetřit, ví, kdy volat sanitku, a má u sebe telefon?",
    ],
    solutionSteps: ["Při úrazu jako první sháníme dospělého — ten líp posoudí situaci a přivolá pomoc. Na vážnou věc nezůstáváme sami."],
    optionFeedback: {
      "Jiné malé dítě": "Jiné dítě většinou neví o moc víc než ty. Pomůže dospělý.",
      "Domácího mazlíčka": "Zvíře pomoc nepřivolá.",
      "Nikoho, poradím si sám": "Na úraz nezůstáváme sami. Dospělý to posoudí líp.",
    },
  },
  {
    question: "Co NEPATŘÍ na čerstvou ranku?",
    correctAnswer: "Bláto nebo písek",
    options: ["Opláchnutí čistou vodou", "Bláto nebo písek", "Čistá náplast", "Čistý obvaz"],
    emoji: "🚫",
    hints: [
      "Co by ranku zaneslo špínou a bakteriemi?",
      "Pozor, hledáš to, co je špatně. Tři možnosti ranku chrání a čistí, jedna by do ní naopak dostala nečistoty.",
    ],
    solutionSteps: ["Na ranku nikdy nedáváme bláto ani písek — zanesly by ji špínou a bakteriemi. Patří na ni čistá voda, náplast nebo čistý obvaz."],
    optionFeedback: {
      "Opláchnutí čistou vodou": "Čistá voda na ranku patří, smyje špínu. Hledáš, co nepatří.",
      "Čistá náplast": "Čistá náplast ranku chrání, patří na ni. Hledáš, co nepatří.",
      "Čistý obvaz": "Čistý obvaz ranku chrání, patří na ni. Hledáš, co nepatří.",
    },
  },
  {
    question: "Kamarádovi teče z nosu krev. Co je správné udělat?",
    correctAnswer: "Posadit ho, naklonit hlavu mírně dopředu a stisknout měkkou část nosu",
    options: [
      "Zaklonit mu hlavu úplně dozadu a nechat krev téct do krku",
      "Nechat ho běhat a skákat",
      "Posadit ho, naklonit hlavu mírně dopředu a stisknout měkkou část nosu",
      "Položit ho na záda a nechat ležet",
    ],
    emoji: "🩸",
    hints: [
      "Hlavu nakláníme dopředu, ne dozadu, a nos jemně stiskneme.",
      "Kdyby hlava byla zakloněná nebo kamarád ležel, krev by stékala do krku a mohlo by se mu udělat špatně. Jakou polohu zvolíš místo toho?",
    ],
    solutionSteps: ["Při krvácení z nosu kamaráda posadíme, hlavu nakloníme mírně dopředu a stiskneme měkkou část nosu. Zaklánět hlavu dozadu není dobré — krev by tekla do krku."],
    optionFeedback: {
      "Zaklonit mu hlavu úplně dozadu a nechat krev téct do krku": "Zakloněná hlava je častá chyba. Krev by tekla do krku a žaludku.",
      "Nechat ho běhat a skákat": "Pohyb krvácení zhorší. Kamarád má sedět v klidu.",
      "Položit ho na záda a nechat ležet": "V leže by krev stékala do krku. Lepší je sedět s hlavou mírně dopředu.",
    },
  },
  {
    question: "Na dětském hřišti pláče malý kluk, že se ztratil a neví, kde má maminku. Co uděláš?",
    correctAnswer: "Zavedu ho k dospělému, který pomůže najít rodiče",
    options: ["Nechám ho tam samotného plakat", "Odvedu ho sám pryč z hřiště hledat maminku", "Zavolám hasiče na 150", "Zavedu ho k dospělému, který pomůže najít rodiče"],
    emoji: "🧒",
    hints: [
      "Kdo dokáže pomoct ztracené dítě spojit s rodiči?",
      "Pokud odejdete z hřiště, maminka ho tam už nenajde. Kdo na hřišti může zůstat s klukem a zavolat mu rodiče nebo pomoc?",
    ],
    solutionSteps: ["Ztraceného kluka zavedeme k dospělému (třeba k jinému rodiči nebo pořadateli), který pomůže najít jeho rodiče. Sami ho nikam neodvádíme."],
    optionFeedback: {
      "Nechám ho tam samotného plakat": "Ztracené dítě potřebuje pomoc, samo si neporadí.",
      "Odvedu ho sám pryč z hřiště hledat maminku": "Když odejdete, maminka ho na hřišti nenajde a ztratit se můžete oba.",
      "Zavolám hasiče na 150": "Hasiče voláme k ohni. Tady pomůže dospělý poblíž.",
    },
  },
  {
    question: "Co uděláme s ranou, ze které trochu teče krev?",
    correctAnswer: "Přitlačíme na ni čistý kapesník nebo obvaz",
    options: [
      "Přitlačíme na ni čistý kapesník nebo obvaz",
      "Necháme ji volně krvácet a nic neděláme",
      "Zasypeme ji pískem",
      "Budeme ji otírat špinavým rukávem",
    ],
    emoji: "🩹",
    hints: [
      "Krvácení zastavíme jemným přitlačením čisté látky.",
      "Mysli na dvě věci zároveň: krev je potřeba zastavit tlakem a rána se nesmí zašpinit. Co z nabídky splní obojí?",
    ],
    solutionSteps: ["Na krvácející ranu přitlačíme čistý kapesník nebo obvaz — přítlak pomůže krvácení zastavit. Písek ani špinavá látka na ránu nepatří."],
    optionFeedback: {
      "Necháme ji volně krvácet a nic neděláme": "Krvácení je potřeba zastavit přitlačením čisté látky.",
      "Zasypeme ji pískem": "Písek ránu zašpiní a může se zanítit.",
      "Budeme ji otírat špinavým rukávem": "Špinavý rukáv zanese do rány bakterie a otírání krvácení nezastaví.",
    },
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Kamarád tvrdí, že záchrannou službu voláš na číslo 158. Jak to opravíš?",
    correctAnswer: "Záchranná služba je 155; 158 je číslo policie",
    options: ["Kamarád má pravdu, záchranka je 158", "Záchranná služba je 155; 158 je číslo policie", "Záchranná služba je 150, ne 158", "Záchranka žádné číslo nemá"],
    emoji: "🚑",
    hints: [
      "Rozliš dvě blízká čísla — jedno je záchranka, druhé policie.",
      "Vzpomeň si postupně, jaké číslo je na sanitce, na hasičském autě a na policejním autě. Pak zjistíš, komu patří číslo, které řekl kamarád.",
    ],
    solutionSteps: ["Kamarád se plete — záchranná služba má číslo 155, kdežto 158 patří policii. Čísla se snadno zamění, proto je dobré je znát přesně."],
    optionFeedback: {
      "Kamarád má pravdu, záchranka je 158": "Číslo 158 patří policii, kamarád je zaměnil.",
      "Záchranná služba je 150, ne 158": "Číslo 150 patří hasičům, ani to není záchranka.",
      "Záchranka žádné číslo nemá": "Záchranka svoje tísňové číslo má, dokonce se ho učíme nazpaměť.",
    },
  },
  {
    question: "V čem se liší, kdy voláš 150 a kdy 155?",
    correctAnswer: "150 jsou hasiči, 155 je záchranka",
    options: ["150 i 155 je to samé číslo", "150 je záchranka a 155 hasiči", "150 jsou hasiči, 155 je záchranka", "Obě čísla voláme jen při krádeži"],
    emoji: "🆘",
    hints: [
      "Jedno číslo je k ohni, druhé ke zdraví.",
      "Pozor na prohození. Přiřaď si každé číslo k autu: které číslo je na červeném autě se žebříkem a které na bílém autě s červeným křížem?",
    ],
    solutionSteps: ["Číslo 150 patří hasičům a voláme ho, když hoří. Číslo 155 patří záchrance a voláme ho, když je někdo zraněný nebo nemocný. Každé slouží k něčemu jinému."],
    optionFeedback: {
      "150 i 155 je to samé číslo": "Liší se poslední číslicí a každé volá jinou pomoc.",
      "150 je záchranka a 155 hasiči": "Čísla jsou prohozená. Hasiči mají nulu na konci.",
      "Obě čísla voláme jen při krádeži": "Krádež řeší policie na čísle 158.",
    },
  },
  {
    question: "Proč je při volání pomoci důležité umět říct, kde přesně se nacházíme?",
    correctAnswer: "Aby záchranáři věděli, kam mají přijet, a našli nás",
    options: [
      "Aby si mohli cestou koupit svačinu",
      "Není to důležité, pomoc nás najde sama",
      "Aby věděli, jakou barvu má náš dům",
      "Aby záchranáři věděli, kam mají přijet, a našli nás",
    ],
    emoji: "📍",
    hints: [
      "Bez místa by pomoc nevěděla, kam jet.",
      "Spoj dvě věci: záchranáři sednou do sanitky a musí se rozhodnout, kudy pojedou. Co jim k tomu musíš do telefonu říct?",
    ],
    solutionSteps: ["Místo je důležité proto, aby záchranáři věděli, kam přijet, a rychle nás našli. Kdyby nevěděli, kde jsme, nemohli by přijet včas."],
    optionFeedback: {
      "Aby si mohli cestou koupit svačinu": "Záchranáři jedou co nejrychleji, místo potřebují, aby nás našli.",
      "Není to důležité, pomoc nás najde sama": "Bez adresy záchranáři nevědí, kam jet. Je to velmi důležité.",
      "Aby věděli, jakou barvu má náš dům": "Barva domu může pomoct až na místě. Nejdřív musí vědět, kam jet.",
    },
  },
  {
    question: "Kamarád říká, že na krvácející ranu je nejlepší nasypat písek. Jak to opravíš?",
    correctAnswer: "Písek ránu zanese špínou, je potřeba ji opláchnout vodou",
    options: [
      "Písek ránu zanese špínou, je potřeba ji opláchnout vodou",
      "Kamarád má pravdu, písek je nejlepší",
      "Na ránu je nejlepší nasypat hlínu",
      "Ránu je nejlepší olízat",
    ],
    emoji: "🩸",
    hints: [
      "Přemýšlej, co se s ranou stane, když do ní dáme písek.",
      "Oprava má dvě části: nejdřív řekni, proč písek škodí, a pak, čím ránu naopak vyčistíme. Rána se musí čistit, ne špinit.",
    ],
    solutionSteps: ["Písek do rány nepatří — zanesl by ji špínou a bakteriemi. Ránu opláchneme čistou vodou a přitlačíme na ni čistý kapesník, aby se zastavilo krvácení."],
    optionFeedback: {
      "Kamarád má pravdu, písek je nejlepší": "Písek ránu zašpiní, kamarád se plete.",
      "Na ránu je nejlepší nasypat hlínu": "Hlína je stejně špinavá jako písek.",
      "Ránu je nejlepší olízat": "V puse jsou bakterie, olizování ránu nevyčistí.",
    },
  },
  {
    question: "Proč na hlubokou nebo velkou ránu nestačí jen náplast doma?",
    correctAnswer: "Vážné zranění musí odborně ošetřit lékař v nemocnici",
    options: [
      "Protože náplasti dojdou",
      "Vážné zranění musí odborně ošetřit lékař v nemocnici",
      "Protože velká rána se sama zahojí za chvilku",
      "Není to pravda, náplast stačí vždy",
    ],
    emoji: "🏥",
    hints: [
      "Malá ranka = náplast doma; velká a hluboká rána potřebuje víc.",
      "Porovnej malou odřeninu a hlubokou ránu. Kdo umí hlubokou ránu třeba zašít a kam se za ním jezdí sanitkou?",
    ],
    solutionSteps: ["Hlubokou nebo velkou ránu musí ošetřit lékař v nemocnici — má na to vybavení i znalosti. Samotná náplast doma na vážné zranění nestačí."],
    optionFeedback: {
      "Protože náplasti dojdou": "Nejde o počet náplastí. Náplast hlubokou ránu nezavře ani nevyčistí.",
      "Protože velká rána se sama zahojí za chvilku": "Velká rána se sama rychle nezahojí a může se zanítit.",
      "Není to pravda, náplast stačí vždy": "Náplast stačí jen na malé ranky. Vážnou ránu ošetří lékař.",
    },
  },
  {
    question: "Kamarád se hodně zranil a teče mu krev. Co uděláš správně jako první?",
    correctAnswer: "Přivolám dospělého a na ránu přitlačím čistý kapesník",
    options: [
      "Nejdřív si dojdu domů pro svačinu",
      "Budu čekat, jestli krvácení přestane samo",
      "Přivolám dospělého a na ránu přitlačím čistý kapesník",
      "Ránu posypu pískem a odejdu",
    ],
    emoji: "🚑",
    hints: [
      "Spoj dvě věci: přivolat pomoc a zastavit krvácení.",
      "Jde o vážnou věc, takže neodcházíme a neztrácíme čas. Co uděláš pro to, aby přišla pomoc, a co pro to, aby krve tekla méně?",
    ],
    solutionSteps: ["Při větším krvácení hned přivoláme dospělého a na ránu přitlačíme čistý kapesník, aby se krvácení zpomalilo. Neodcházíme a ránu nešpiníme."],
    optionFeedback: {
      "Nejdřív si dojdu domů pro svačinu": "Při vážném zranění nesmíme ztrácet čas ani odcházet.",
      "Budu čekat, jestli krvácení přestane samo": "Silné krvácení samo nepřestane. Je potřeba přitlačit látku a přivolat pomoc.",
      "Ránu posypu pískem a odejdu": "Písek ránu zašpiní a zraněného nenecháváme samotného.",
    },
  },
  {
    question: "Číslo 112 funguje v celé Evropě, kdežto 155 hlavně u nás. Proč je dobré 112 znát?",
    correctAnswer: "Protože jím dovoláš pomoc i v cizí zemi, kde místní čísla neznáš",
    options: [
      "Protože 112 je zadarmo jen o víkendu",
      "Protože 112 funguje jen u nás doma",
      "Není k tomu žádný důvod, stačí 155",
      "Protože jím dovoláš pomoc i v cizí zemi, kde místní čísla neznáš",
    ],
    emoji: "🌍",
    hints: [
      "Kde všude 112 platí a kde bys jinak čísla neznal?",
      "Představ si, že jsi s rodiči na dovolené v jiné zemi a stane se úraz. Znáš tamní číslo na sanitku? Čím se tam dovoláš?",
    ],
    solutionSteps: ["Číslo 112 je dobré znát, protože funguje v celé Evropě. Když jsme v cizí zemi a neznáme tamní čísla, tímhle jedním se dovoláme pomoci."],
    optionFeedback: {
      "Protože 112 je zadarmo jen o víkendu": "Tísňová čísla jsou zadarmo vždycky, nejen o víkendu.",
      "Protože 112 funguje jen u nás doma": "Je to naopak. Číslo 112 funguje v celé Evropě.",
      "Není k tomu žádný důvod, stačí 155": "Číslo 155 v cizině fungovat nemusí, proto je dobré znát 112.",
    },
  },
  {
    question: "Proč na bouli přikládáme něco studeného, a ne teplého?",
    correctAnswer: "Chlad otok a bolest zmenší, kdežto teplo by je zvětšilo",
    options: [
      "Chlad otok a bolest zmenší, kdežto teplo by je zvětšilo",
      "Teplé i studené působí úplně stejně",
      "Studené bouli nepomáhá vůbec",
      "Teplé bouli pomáhá víc než studené",
    ],
    emoji: "🧊",
    hints: [
      "Porovnej, co dělá chlad a co teplo s otokem.",
      "Vzpomeň si, proč sportovci po nárazu přikládají led a proč se naražené místo nenahřívá. Co se děje s otokem v chladu?",
    ],
    solutionSteps: ["Na bouli dáváme studený obklad, protože chlad zmírní otok i bolest. Teplo by prokrvení zvětšilo a otok by byl větší — proto se nehodí."],
    optionFeedback: {
      "Teplé i studené působí úplně stejně": "Působí opačně. Chlad otok zmenšuje, teplo ho zvětšuje.",
      "Studené bouli nepomáhá vůbec": "Chlad bouli pomáhá, zmírní otok i bolest.",
      "Teplé bouli pomáhá víc než studené": "Teplo otok zvětší, bouli by to zhoršilo.",
    },
  },
  {
    question: "Kamarád spadl, nehýbe se a je mu špatně. Je to malá, nebo vážná věc a co uděláš?",
    correctAnswer: "Je to vážné — hned přivolám dospělého a záchrannou službu 155",
    options: [
      "Je to maličkost — jen mu dám náplast",
      "Je to vážné — hned přivolám dospělého a záchrannou službu 155",
      "Je to maličkost — počkám, až se to zítra zlepší",
      "Je to vážné, ale zavolám hasiče na 150",
    ],
    emoji: "🆘",
    hints: [
      "Když se někdo nehýbe a je mu zle, nejde o drobnost.",
      "Vyřeš dva kroky: nejdřív rozhodni, jestli je to vážné, a potom vyber pomoc, která jezdí ke zraněným a nemocným.",
    ],
    solutionSteps: ["Když se kamarád nehýbe a je mu špatně, jde o vážnou situaci. Hned přivoláme dospělého a záchrannou službu 155 — nečekáme a neřešíme to sami."],
    optionFeedback: {
      "Je to maličkost — jen mu dám náplast": "Kdo se nehýbe a je mu špatně, potřebuje víc než náplast.",
      "Je to maličkost — počkám, až se to zítra zlepší": "U vážného stavu se nečeká. Pomoc je potřeba hned.",
      "Je to vážné, ale zavolám hasiče na 150": "Vážnost jsi poznal správně, ale ke zraněnému patří záchranka, ne hasiči.",
    },
  },
  {
    question: "Proč nejdřív sháníme dospělého, i když sami známe tísňová čísla?",
    correctAnswer: "Dospělý líp posoudí, co se stalo, a dokáže pomoc lépe zvládnout",
    options: [
      "Protože děti nesmí nikdy nikomu pomáhat",
      "Protože tísňová čísla fungují jen dospělým",
      "Dospělý líp posoudí, co se stalo, a dokáže pomoc lépe zvládnout",
      "Protože dospělý musí dát svolení, jinak se volat nesmí",
    ],
    emoji: "🧑‍🚒",
    hints: [
      "Kdo dokáže líp odhadnout, jak vážná situace je?",
      "Znát čísla je dobré. Kdo ale zvládne první pomoc, klidně odpoví na otázky operátora a počká se zraněným na sanitku?",
    ],
    solutionSteps: ["Dospělého sháníme proto, že líp posoudí, co se stalo, a pomoc zvládne lépe než malé dítě. Tísňová čísla přitom umíme, kdyby dospělý nablízku nebyl."],
    optionFeedback: {
      "Protože děti nesmí nikdy nikomu pomáhat": "Děti pomáhat smějí a mají. Dospělý ale situaci zvládne lépe.",
      "Protože tísňová čísla fungují jen dospělým": "Tísňová čísla může zavolat kdokoli, i dítě.",
      "Protože dospělý musí dát svolení, jinak se volat nesmí": "Když není nikdo nablízku, dítě smí zavolat samo i bez svolení.",
    },
  },
  {
    question: "Kterou složku voláš, když zároveň hoří a je i zraněný člověk, a nevíš, co dřív?",
    correctAnswer: "Zavolám 112 — jedno číslo, přes které pošlou hasiče i záchranku",
    options: [
      "Nezavolám nikam a počkám, co se stane",
      "Nejdřív zavolám kamarádovi, co mám dělat",
      "Zavolám jen policii 158, ať to vyřeší",
      "Zavolám 112 — jedno číslo, přes které pošlou hasiče i záchranku",
    ],
    emoji: "📞",
    hints: [
      "Existuje jedno číslo, které umí poslat víc složek najednou.",
      "Oheň potřebuje hasiče a zraněný záchranku. Nemusíš volat dvakrát. Které číslo tě spojí s operátorem, který pošle obě pomoci?",
    ],
    solutionSteps: ["Když je potřeba víc složek najednou, vytočíme 112 — operátor pošle hasiče i záchranku. Nemusíme řešit, které číslo dřív, a hlavně voláme o pomoc a jdeme do bezpečí."],
    optionFeedback: {
      "Nezavolám nikam a počkám, co se stane": "Čekáním se situace zhorší. Pomoc je potřeba přivolat hned.",
      "Nejdřív zavolám kamarádovi, co mám dělat": "Kamarád neporadí tak rychle jako operátor tísňové linky.",
      "Zavolám jen policii 158, ať to vyřeší": "Policie oheň nehasí ani zraněné neošetřuje.",
    },
  },
  {
    question: "Proč je dobré umět tísňová čísla zpaměti, i když je máš doma napsaná na lednici?",
    correctAnswer: "V nouzi nemusíš být doma u lednice a čas rychle rozhoduje",
    options: [
      "V nouzi nemusíš být doma u lednice a čas rychle rozhoduje",
      "Protože napsaná čísla nikdy nefungují",
      "Není to potřeba, čísla si vždycky stihneš v klidu najít",
      "Protože zpaměti fungují jen o víkendu",
    ],
    emoji: "🧠",
    hints: [
      "Kde všude se úraz může stát a stihneš tam hledat napsaná čísla?",
      "Spoj dvě věci: úraz se může stát na hřišti, v lese nebo na výletě, a u vážného zranění záleží na každé minutě.",
    ],
    solutionSteps: ["Čísla umíme zpaměti proto, že úraz se může stát kdekoli, ne jen doma u lednice, a v nouzi rozhoduje čas. Hledání lístečku by nás zbytečně zdrželo."],
    optionFeedback: {
      "Protože napsaná čísla nikdy nefungují": "Napsaná čísla fungují, jen je nemusíš mít zrovna u sebe.",
      "Není to potřeba, čísla si vždycky stihneš v klidu najít": "V nouzi často není čas ani klid na hledání.",
      "Protože zpaměti fungují jen o víkendu": "Tísňová čísla fungují pořád, ve všední den i o víkendu.",
    },
  },
  {
    question: "Odřel sis koleno a ranka je zanesená hlínou. V jakém pořadí to uděláš správně?",
    correctAnswer: "Nejdřív ranku opláchnu čistou vodou, pak přelepím náplastí a řeknu to dospělému",
    options: [
      "Nejdřív přelepím náplastí i s hlínou, mýt netřeba",
      "Nejdřív ranku opláchnu čistou vodou, pak přelepím náplastí a řeknu to dospělému",
      "Nejdřív přelepím náplastí a potom ranku opláchnu přes náplast vodou",
      "Ranku nechám špinavou a zasypu ji pískem",
    ],
    emoji: "🧴",
    hints: [
      "Špínu z rány je potřeba nejdřív odstranit — čím?",
      "Rozmysli si pořadí kroků. Kdybys náplast nalepil dřív, hlína by zůstala uvnitř. Co musí přijít jako první, co jako druhé a komu to nakonec řekneš?",
    ],
    solutionSteps: ["Nejdřív ranku opláchneme čistou vodou, aby v ní nezůstala hlína, pak ji přelepíme náplastí a řekneme to dospělému. Přelepit náplast přes špínu nebo zasypat ránu pískem není správně."],
    optionFeedback: {
      "Nejdřív přelepím náplastí i s hlínou, mýt netřeba": "Pod náplastí by hlína zůstala a ranka by se mohla zanítit.",
      "Nejdřív přelepím náplastí a potom ranku opláchnu přes náplast vodou": "Kroky jsou prohozené. Přes náplast voda špínu z ranky nesmyje.",
      "Ranku nechám špinavou a zasypu ji pískem": "Písek přidá další špínu, ranka se musí vyčistit.",
    },
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const DROBNAPORANENITISNOVELINKY: TopicMetadata[] = [
  {
    id: "g2-prv-prvni-pomoc",
    rvpNodeId: "g2-prvouka-clovek-a-jeho-zdravi-prevence-a-prvni-pomoc-drobna-poraneni-privolani-pomoci-tisnove-linky",
    title: "Drobná poranění, přivolání pomoci, tísňové linky",
    studentTitle: "První pomoc",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Prevence a první pomoc",
    briefDescription: "Co dělat při úrazu a kam volat.",
    keywords: ["první pomoc", "úraz", "záchranka", "hasiči", "policie", "tísňová linka"],
    goals: [
      "Znát tísňová čísla: 155, 150, 158, 112.",
      "Vědět, co dělat při drobném úrazu.",
      "Umět přivolat pomoc dospělého.",
    ],
    boundaries: ["Pouze základy.", "Bez složitého ošetřování."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Záchranka 155, hasiči 150, policie 158, tísňové 112.",
      steps: ["Přečti otázku.", "Vzpomeň si na správné číslo nebo pomoc."],
      commonMistake: "Záměna tísňových čísel — záchranka je 155.",
      example: "Když se někdo zraní, voláme záchranku na číslo 155.",
    },
  },
];
