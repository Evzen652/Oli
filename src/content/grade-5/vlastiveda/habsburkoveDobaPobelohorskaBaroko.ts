import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Kdy se Ferdinand I. Habsburský stal českým králem?",
    correctAnswer: "1526",
    options: ["1526", "1620", "1618", "1500"],
    hints: ["Stalo se to po bitvě u Moháče."],
    solutionSteps: ["Po bitvě u Moháče 1526 vymřeli Jagellonci a Ferdinand I. Habsburg se stal českým králem."],
  },
  {
    question: "Jak se jmenuje bitva z roku 1620, po níž začala doba pobělohorská?",
    correctAnswer: "Bitva na Bílé hoře",
    options: ["Bitva na Bílé hoře", "Bitva u Moháče", "Bitva u Lipan", "Bitva u Znojma"],
    hints: ["Proběhla na kopci nedaleko Prahy."],
    solutionSteps: ["V listopadu 1620 prohrála česká šlechta tuto bitvu a začala tvrdá rekatolizace."],
  },
  {
    question: "Co znamená termín 'rekatolizace'?",
    correctAnswer: "Nucené přestoupení zpět ke katolické víře",
    options: [
      "Nucené přestoupení zpět ke katolické víře",
      "Budování nových kostelů",
      "Zavádění protestantství",
      "Reforma školství",
    ],
    hints: ["'Re-' znamená zpět, 'katolizace' = přechod ke katolictví."],
    solutionSteps: ["Po Bílé hoře museli protestanti v Čechách přestoupit ke katolicismu nebo odejít do exilu."],
  },
  {
    question: "Kdo byl Jan Amos Komenský?",
    correctAnswer: "Učitel národů a spisovatel v exilu",
    options: [
      "Učitel národů a spisovatel v exilu",
      "Habsburský císař",
      "Velitel české armády",
      "Katolický kněz v Praze",
    ],
    hints: ["Říká se mu 'Učitel národů'."],
    solutionSteps: ["J. A. Komenský (1592–1670) byl pedagog, filosof a spisovatel. Po Bílé hoře odešel do exilu."],
  },
  {
    question: "V jakém stylu jsou postaveny kostely jako sv. Mikuláš v Praze?",
    correctAnswer: "Baroko",
    options: ["Baroko", "Gotika", "Renesance", "Románský sloh"],
    hints: ["Tento styl je typický pro 17.–18. století a okázalé ozdoby."],
    solutionSteps: ["Barokní styl se vyznačuje bohatou výzdobou, ohnutými liniemi a majestátností."],
  },
  {
    question: "Jak se nazývá nejznámější dílo Jana Amose Komenského — první ilustrovaná učebnice světa?",
    correctAnswer: "Orbis Pictus",
    options: ["Orbis Pictus", "Didaktika Magna", "Labyrint světa", "Velká didaktika"],
    hints: ["Latinsky to znamená 'svět v obrazech'."],
    solutionSteps: ["Orbis Pictus (1658) byla první ilustrovaná učebnice, přeložena do mnoha jazyků."],
  },
  {
    question: "Kdo byli jezuité?",
    correctAnswer: "Katoličtí vzdělanci a misionáři (řád)",
    options: [
      "Katoličtí vzdělanci a misionáři (řád)",
      "Protestantští kazatelé",
      "Česká šlechta",
      "Habsburští vojáci",
    ],
    hints: ["Jejich plný název je Tovaryšstvo Ježíšovo."],
    solutionSteps: ["Jezuité (Tovaryšstvo Ježíšovo) řídili školy a šířili katolicismus, mj. Klementinum v Praze."],
  },
  {
    question: "Kde v Praze sídlili jezuité a budovali svou knihovnu?",
    correctAnswer: "Klementinum",
    options: ["Klementinum", "Hradčany", "Vyšehrad", "Karolinum"],
    hints: ["Je to velký komplex budov na Starém Městě pražském."],
    solutionSteps: ["Jezuité v Klementinu provozovali školu a dnes tam je Národní knihovna."],
  },
  {
    question: "Co se stalo s protestanty v Čechách po roce 1620?",
    correctAnswer: "Museli přestoupit ke katolicismu nebo odejít do exilu",
    options: [
      "Museli přestoupit ke katolicismu nebo odejít do exilu",
      "Dostali vlastní stát",
      "Byli jmenováni do šlechty",
      "Nic, situace zůstala stejná",
    ],
    hints: ["Rekatolizace byla povinná."],
    solutionSteps: ["Protireformace po Bílé hoře donutila protestanty buď přestoupit, nebo opustit vlast."],
  },
  {
    question: "Ve kterém roce zemřel Jan Amos Komenský?",
    correctAnswer: "1670",
    options: ["1670", "1620", "1700", "1650"],
    hints: ["Narodil se roku 1592."],
    solutionSteps: ["Komenský žil 1592–1670, celý svůj zralý život strávil v exilu."],
  },
  {
    question: "Co je 'pobělohorské temno'?",
    correctAnswer: "Období tvrdé rekatolizace a ztráty svobod po roce 1620",
    options: [
      "Období tvrdé rekatolizace a ztráty svobod po roce 1620",
      "Období před bitvou na Bílé hoře",
      "Název pro středověk v Čechách",
      "Temná zimní noc v Praze",
    ],
    hints: ["Temno = ztráta česky psané kultury a svobody svědomí."],
    solutionSteps: ["Historici nazývají 17.–18. století v Čechách 'pobělohorským temnem' kvůli útlaku."],
  },
  {
    question: "Kdy začala česká stavovská vzpoura, která vedla k bitvě na Bílé hoře?",
    correctAnswer: "1618",
    options: ["1618", "1620", "1526", "1600"],
    hints: ["Byl to rok pražské defenestrace."],
    solutionSteps: ["Roku 1618 vyhodili čeští stavové královské místodržitele z okna Hradu (defenestrace)."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč Ferdinand I. Habsburský získal českou korunu po roce 1526?",
    correctAnswer: "Vymřela dynastia Jagellonců a Ferdinand byl příbuzný přes sňatek",
    options: [
      "Vymřela dynastia Jagellonců a Ferdinand byl příbuzný přes sňatek",
      "Vyhrál válku s Čechy",
      "Byl zvolen papežem",
      "Koupil ji od šlechty",
    ],
    hints: ["Jagellonci neměli mužského dědice."],
    solutionSteps: ["Ludvík Jagellonský zemřel v bitvě u Moháče 1526, jeho sestra Anna byla manželkou Ferdinanda."],
  },
  {
    question: "Jak baroko sloužilo jako nástroj rekatolizace?",
    correctAnswer: "Okázalými stavbami a uměním ukazovalo sílu a krásu katolické církve",
    options: [
      "Okázalými stavbami a uměním ukazovalo sílu a krásu katolické církve",
      "Stavělo protestantské kostely",
      "Šířilo česky psané knihy",
      "Budovalo školy pro chudé",
    ],
    hints: ["Bohaté kostely měly lidé oslnit a přitáhnout ke katolictví."],
    solutionSteps: ["Jezuité a Habsburkové využívali barokní umění jako propagandu katolické víry."],
  },
  {
    question: "Proč musel Jan Amos Komenský opustit Čechy?",
    correctAnswer: "Byl protestant, po Bílé hoře musel do exilu",
    options: [
      "Byl protestant, po Bílé hoře musel do exilu",
      "Chtěl cestovat po světě",
      "Byl pozván zahraničními vladaři",
      "Přestal věřit v Boha",
    ],
    hints: ["Bílá hora 1620 = zkáza pro protestanskou šlechtu i vzdělance."],
    solutionSteps: ["Komenský jako protestant a člen Jednoty bratrské musel po 1620 opustit vlast a žil v Polsku, Anglii, Švédsku aj."],
  },
  {
    question: "Co měly společného baroko, jezuité a rekatolizace?",
    correctAnswer: "Všechny sloužily k šíření a upevnění katolicismu v Čechách",
    options: [
      "Všechny sloužily k šíření a upevnění katolicismu v Čechách",
      "Všechny byly zakázány Habsburky",
      "Všechny podporovaly českou kulturu",
      "Vzájemně spolu nesouvisely",
    ],
    hints: ["Hledej společný cíl všech tří."],
    solutionSteps: ["Baroko, jezuité i rekatolizace byly nástroje Habsburků k potlačení protestantství."],
  },
  {
    question: "Proč je Komenský nazýván 'Učitelem národů'?",
    correctAnswer: "Napsal moderní pedagogické metody a učebnice pro celý svět",
    options: [
      "Napsal moderní pedagogické metody a učebnice pro celý svět",
      "Vládl celé Evropě",
      "Byl biskupem v Praze",
      "Bojoval za Habsburky",
    ],
    hints: ["Jeho díla Didaktika Magna a Orbis Pictus se používala po celé Evropě."],
    solutionSteps: ["Komenský zmodernizoval výuku (názornost, postupnost) a jeho knihy ovlivnily pedagogiku celosvětově."],
  },
  {
    question: "Jaký byl hlavní důsledek bitvy na Bílé hoře pro českou kulturu?",
    correctAnswer: "Česká literatura a jazyk byly potlačeny ve prospěch němčiny",
    options: [
      "Česká literatura a jazyk byly potlačeny ve prospěch němčiny",
      "Čeština se stala úředním jazykem Evropy",
      "Začala zlatá éra českého písemnictví",
      "Vznikla první česká univerzita",
    ],
    hints: ["Germanizace = šíření němčiny."],
    solutionSteps: ["Rekatolizace a germanizace po 1620 potlačily češtinu v úřadech a školách na cca 150 let."],
  },
  {
    question: "Co je to 'Didaktika Magna' od Komenského?",
    correctAnswer: "Dílo o správném způsobu vyučování",
    options: [
      "Dílo o správném způsobu vyučování",
      "Modlitební kniha",
      "Atlas světa",
      "Sbírka básní",
    ],
    hints: ["Magna = velká; didaktika = věda o vyučování."],
    solutionSteps: ["Didaktika Magna (Velká didaktika) popisuje zásady moderního vzdělávání."],
  },
  {
    question: "Jak se nazývalo povstání české šlechty proti Habsburkům roku 1618?",
    correctAnswer: "Česká stavovská vzpoura",
    options: [
      "Česká stavovská vzpoura",
      "Národní obrození",
      "Husitské hnutí",
      "Sametová revoluce",
    ],
    hints: ["'Stavové' = šlechta, rytíři, měšťané."],
    solutionSteps: ["Stavovské povstání 1618–1620 skončilo porážkou u Bílé hory."],
  },
  {
    question: "Kde a v jaké době Komenský žil v exilu?",
    correctAnswer: "V Polsku, Anglii, Švédsku a Holandsku (17. století)",
    options: [
      "V Polsku, Anglii, Švédsku a Holandsku (17. století)",
      "Ve Francii a Španělsku",
      "V Rusku a Turecku",
      "V Itálii a Řecku",
    ],
    hints: ["Exil trval od asi 1628 do jeho smrti 1670."],
    solutionSteps: ["Komenský putoval Evropou: Lešno (Polsko), Anglie, Švédsko, Uhry, Amsterodam."],
  },
  {
    question: "Jaký vliv měla Bílá hora 1620 na českou šlechtu?",
    correctAnswer: "27 předáků bylo popraveno a šlechta přišla o majetek",
    options: [
      "27 předáků bylo popraveno a šlechta přišla o majetek",
      "Šlechta dostala nová privilegia",
      "Česká šlechta se stala nejsilnější v Evropě",
      "Nic se nezměnilo",
    ],
    hints: ["21. června 1621 — Staroměstská exekuce."],
    solutionSteps: ["27 vůdců povstání bylo popraveno na Staroměstském náměstí, ostatní přišli o statky."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "Bitva u Moháče → Bitva na Bílé hoře → Poprava 27 pánů → Smrt Komenského",
    items: [
      "Bitva u Moháče (1526)",
      "Česká stavovská vzpoura (1618)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů (1621)",
      "Smrt Komenského (1670)",
    ],
    hints: ["Začni rokem 1526."],
    solutionSteps: ["1526 Moháč → 1618 vzpoura → 1620 Bílá hora → 1621 popravy → 1670 smrt Komenského"],
  },
  {
    question: "Spoj osobnosti a pojmy s jejich popisem.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "Jan Amos Komenský", right: "Učitel národů, Orbis Pictus" },
      { left: "Ferdinand I.", right: "První Habsburk na českém trůně (1526)" },
      { left: "Klementinum", right: "Jezuitská kolej v Praze" },
      { left: "Rekatolizace", right: "Nucený návrat ke katolicismu" },
      { left: "Baroko", right: "Styl umění s bohatou výzdobou" },
    ],
    hints: ["Komenský psal pedagogická díla."],
    solutionSteps: ["Přiřazení vychází ze základních faktů o dotyčných osobách a pojmech."],
  },
  {
    question: "Proč se říká, že Bílá hora byla 'zlomem' v českých dějinách? Vyber NEJÚPLNĚJŠÍ odpověď.",
    correctAnswer: "Vedla ke ztrátě nezávislosti, rekatolizaci, germanizaci i útlaku kultury",
    options: [
      "Vedla ke ztrátě nezávislosti, rekatolizaci, germanizaci i útlaku kultury",
      "Jen zvýšila daně",
      "Přinesla pouze ztrátu části území",
      "Způsobila jen odchod Komenského",
    ],
    hints: ["Zvažuj všechny oblasti: politiku, náboženství, jazyk, kulturu."],
    solutionSteps: ["Bílá hora = politická porážka + rekatolizace + germanizace + pobělohorské temno."],
  },
  {
    question: "Jak spolu souvisely jezuité a baroko? Vyber nejlepší vysvětlení.",
    correctAnswer: "Jezuité stavěli a zdobili kostely v barokním stylu jako nástroj rekatolizace",
    options: [
      "Jezuité stavěli a zdobili kostely v barokním stylu jako nástroj rekatolizace",
      "Jezuité bojovali proti baroknímu umění",
      "Baroko vzniklo nezávisle na jezuitech v Číně",
      "Jezuité zakazovali stavbu kostelů",
    ],
    hints: ["Baroko = propagandistický nástroj."],
    solutionSteps: ["Jezuité záměrně budovali okázalé barokní kostely, aby oslnili a přitáhli lid zpět ke katolicismu."],
  },
  {
    question: "Komenský napsal Orbis Pictus, Didaktiku Magna a Labyrint světa a ráj srdce. Co mají tyto tři díla společného?",
    correctAnswer: "Všechna reagují na dobu (exil, hledání smyslu, vzdělávání národů)",
    options: [
      "Všechna reagují na dobu (exil, hledání smyslu, vzdělávání národů)",
      "Jsou to válečné kroniky",
      "Jsou napsány latinsky pro jezuity",
      "Jsou to modlitební knihy",
    ],
    hints: ["Labyrint je alegorický příběh o hledání smyslu světa."],
    solutionSteps: ["Komenského díla odrážejí jeho životní osudy, touhu po vzdělání i hledání duchovní útěchy v exilu."],
  },
  {
    question: "Jak by ses rozhodl jako protestant v Čechách po roce 1620? Která možnost popisuje historickou realitu?",
    correctAnswer: "Přestoupil ke katolicismu nebo odešel do exilu — obě varianty se skutečně staly",
    options: [
      "Přestoupil ke katolicismu nebo odešel do exilu — obě varianty se skutečně staly",
      "Mohl svobodně vyznávat víru — nic se nezměnilo",
      "Byl automaticky jmenován šlechticem",
      "Mohl se stát jezuitou bez změny víry",
    ],
    hints: ["Rekatolizace byla povinná pod hrozbou ztráty majetku."],
    solutionSteps: ["Historická realita: přestup ke katolicismu nebo odchod do exilu — jiná cesta nebyla."],
  },
  {
    question: "Který výrok o baroku je NEPRAVDIVÝ?",
    correctAnswer: "Baroko vzniklo v Čechách jako protest proti Habsburkům",
    options: [
      "Baroko vzniklo v Čechách jako protest proti Habsburkům",
      "Baroko se vyznačuje bohatou výzdobou a okázalostí",
      "Sv. Mikuláš na Malé Straně je barokní kostel",
      "Baroko bylo podporováno jezuity",
    ],
    hints: ["Baroko ve skutečnosti Habsburkům sloužilo."],
    solutionSteps: ["Baroko nevzniklo jako protest — naopak, bylo nástrojem Habsburků a katolické církve."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const HABSBURKOVEDOBAPOBELOHORSKABAROKO: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-habsburkove-doba-pobelohorska-baroko",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-habsburkove-doba-pobelohorska-baroko",
    title: "Habsburkové, doba pobělohorská, baroko",
    studentTitle: "Habsburkové a baroko",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Novověk - habsburská monarchie",
    briefDescription: "Poznáš Habsburky, bitvu na Bílé hoře a barokní styl.",
    keywords: ["habsburkové", "bílá hora", "baroko", "komenský", "rekatolizace", "jezuité"],
    goals: [
      "Žák vysvětlí příchod Habsburků na český trůn",
      "Žák popíše důsledky bitvy na Bílé hoře",
      "Žák charakterizuje barokní styl a jeho roli",
      "Žák zná dílo a osud J. A. Komenského",
    ],
    boundaries: [
      "Detailní vojenská taktika bitev",
      "Genealogie Habsburků",
      "Podrobná teologie reformace",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Vzpomeň si na rok 1620 — bitva na Bílé hoře změnila Čechy.",
      steps: [
        "1526: Habsburkové přišli na český trůn",
        "1620: Bílá hora — porážka české šlechty",
        "Po 1620: rekatolizace, exil protestantů, baroko",
        "Komenský: Učitel národů v exilu",
      ],
      commonMistake: "Zaměňování bitvy u Moháče (1526) a bitvy na Bílé hoře (1620).",
      example: "Komenský napsal Orbis Pictus — první ilustrovanou učebnici světa.",
    },
  },
];
