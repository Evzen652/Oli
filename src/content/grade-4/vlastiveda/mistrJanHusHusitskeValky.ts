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
  {
    question: "Kdo byl Jan Hus?",
    correctAnswer: "Český kazatel a reformátor, kritik korupce v církvi",
    options: [
      "Český kazatel a reformátor, kritik korupce v církvi",
      "Český král",
      "Husitský vojevůdce",
      "Přemyslovský kníže",
    ],
    hints: ["Hus = kazatel v Praze, ne panovník."],
    solutionSteps: ["Jan Hus (1369–1415) byl kazatel v Betlémské kapli v Praze a kritik korupce a odpustků v církvi."],
  },
  {
    question: "Kde kázal Jan Hus v Praze?",
    correctAnswer: "V Betlémské kapli",
    options: ["V Betlémské kapli", "V katedrále sv. Víta", "V Týnském chrámu", "Na Václavském náměstí"],
    hints: ["Betlémská kaple je v centru Prahy."],
    solutionSteps: ["Jan Hus kázal v Betlémské kapli v Praze — specificky proto, aby byl lid srozumitelný."],
  },
  {
    question: "Co kritizoval Jan Hus?",
    correctAnswer: "Prodej odpustků a korupci v katolické církvi",
    options: [
      "Prodej odpustků a korupci v katolické církvi",
      "Přemyslovce",
      "Lucemburky",
      "Zemědělství a nevolnictví",
    ],
    hints: ["Odpustky = placená prominutí hříchů — Hus to považoval za korupci."],
    solutionSteps: ["Jan Hus kritizoval prodej odpustků (za peníze bylo možné 'koupit' prominutí hříchů) a obecnou korupci kléru."],
  },
  {
    question: "Kdy a kde byl Jan Hus upálen?",
    correctAnswer: "6. července 1415 v Kostnici (dnes Německo/Švýcarsko)",
    options: [
      "6. července 1415 v Kostnici (dnes Německo/Švýcarsko)",
      "28. září 935 v Praze",
      "1419 v Praze",
      "1434 u Lipan",
    ],
    hints: ["Hus byl odsouzen na církevním sněmu — koncilu."],
    solutionSteps: ["Jan Hus byl upálen 6. července 1415 na Kostnickém koncilu jako kacíř."],
  },
  {
    question: "Jak se jmenoval husitský vojevůdce?",
    correctAnswer: "Jan Žižka z Trocnova",
    options: ["Jan Žižka z Trocnova", "Jan Hus", "Jiří z Poděbrad", "Václav IV."],
    hints: ["Žižka byl slavný válečný stratég."],
    solutionSteps: ["Jan Žižka z Trocnova byl hlavní vojenský velitel husitů — porazil pět křižáckých výprav."],
  },
  {
    question: "Co je to kalich jako symbol husitů?",
    correctAnswer: "Symbol přijímání pod obojím — víno (kalich) i hostie pro věřící, nejen pro kněze",
    options: [
      "Symbol přijímání pod obojím — víno (kalich) i hostie pro věřící, nejen pro kněze",
      "Pohár pro vojevůdce",
      "Zlatý kalich Karla IV.",
      "Nádobka pro odpustky",
    ],
    hints: ["Husité chtěli, aby i laici pili víno při mši."],
    solutionSteps: ["Kalich = přijímání pod obojím (chléb i víno), které husité žádali pro všechny věřící, nejen kněze."],
  },
  {
    question: "Co jsou to husitské války?",
    correctAnswer: "Náboženské a politické konflikty v Čechách 1419–1436",
    options: [
      "Náboženské a politické konflikty v Čechách 1419–1436",
      "Války Přemyslovců s Polskem",
      "Boje Karla IV. v Říši",
      "Války s Turky",
    ],
    hints: ["Husitské války začaly rok po Husově upálení."],
    solutionSteps: ["Husitské války (1419–1436) byly řadou konfliktů — husité odolali pěti papežským křižáckým výpravám."],
  },
  {
    question: "Co je to vozová hradba husitů?",
    correctAnswer: "Vojenská taktika — husité vytvořili obranný kruh z vozů",
    options: [
      "Vojenská taktika — husité vytvořili obranný kruh z vozů",
      "Opevněný hrad z dřeva",
      "Hradby Prahy",
      "Přenosná zbroj vojáků",
    ],
    hints: ["Vozová hradba umožňovala husitům čelit jízdním rytířům."],
    solutionSteps: ["Vozová hradba = husitská taktika vojenského tábora z vozů — efektivní obrana proti rytířské jízdě."],
  },
  {
    question: "Kdy skončily husitské války?",
    correctAnswer: "V roce 1436 — Basilejskými kompaktáty",
    options: [
      "V roce 1436 — Basilejskými kompaktáty",
      "V roce 1419",
      "V roce 1415 Husovou smrtí",
      "V roce 1350",
    ],
    hints: ["Kompaktáta = smlouva o míru."],
    solutionSteps: ["Husitské války skončily roku 1436 podepsáním Basilejských kompaktát — dohody mezi husity a církví."],
  },
  {
    question: "Kde se konala bitva, ve které se utkvali umírnění a radikální husité?",
    correctAnswer: "U Lipan (1434)",
    options: [
      "U Lipan (1434)",
      "U Moravského pole (1278)",
      "U Kresčaku (1346)",
      "U Kostnice (1415)",
    ],
    hints: ["Lipany = husité bojovali sami proti sobě."],
    solutionSteps: ["Bitva u Lipan (1434) — umírnění husité (kališníci) porazili radikální táborité."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co jsou to odpustky a proč Hus proti nim vystupoval?",
    correctAnswer: "Odpustky byly vydávané církví za peníze jako prominutí hříchů — Hus to považoval za korupci",
    options: [
      "Odpustky byly vydávané církví za peníze jako prominutí hříchů — Hus to považoval za korupci",
      "Odpustky byly formou postu",
      "Odpustky byly dary chudým",
      "Odpustky byly dovolené pro kněze",
    ],
    hints: ["Hus věřil, že hříchy lze odpustit jen Bohem — ne za peníze."],
    solutionSteps: ["Odpustky = platba církvi za 'prominutí hříchů'. Hus to odmítal — považoval to za korupci a blasfémii."],
  },
  {
    question: "Co je to Kostnický koncil?",
    correctAnswer: "Církevní sněm (1414–1418) v Kostnici, kde byl Hus odsouzen a upálen",
    options: [
      "Církevní sněm (1414–1418) v Kostnici, kde byl Hus odsouzen a upálen",
      "Husitský sněm v Praze",
      "Setkání krále s šlechtou",
      "Schůzka husitů a Karla IV.",
    ],
    hints: ["Koncil = velký církevní sněm z celé Evropy."],
    solutionSteps: ["Kostnický koncil (1414–1418) byl velkým církevním shromážděním — odsoudil Jana Husa jako kacíře a nechal ho upálit."],
  },
  {
    question: "Kdo byli táborité a kdo kališníci?",
    correctAnswer: "Táborité = radikální husité (Tábor), kališníci = umírnění husité (Praha)",
    options: [
      "Táborité = radikální husité (Tábor), kališníci = umírnění husité (Praha)",
      "Táborité = umírnění, kališníci = radikální",
      "Jsou to totéž, jen jiné jméno",
      "Táborité = moravští husité, kališníci = čeští",
    ],
    hints: ["Tábor = nové město na jihu Čech, centrum radikálního hnutí."],
    solutionSteps: ["Husité se dělili: táborité (radikální, základ ve městě Tábor) vs. kališníci (umírnění, Praha)."],
  },
  {
    question: "Proč Žižkova vozová hradba byla tak účinná?",
    correctAnswer: "Husiti z vozů stříleli z palných zbraní — rytíři na koních nemohli prolomit obranný kruh",
    options: [
      "Husité z vozů stříleli z palných zbraní — rytíři na koních nemohli prolomit obranný kruh",
      "Vozová hradba byla jen pro transport",
      "Vozy obsahovaly výbušniny",
      "Žižka používal vozovou hradbu jen pro útok",
    ],
    hints: ["Palné zbraně + obranný kruh = nová vojenská taktika."],
    solutionSteps: ["Husité zapřáhli vozy do kruhu, mezi nimi stříleli z hákovnic (palné zbraně) — rytíři přes tuto hradbu nedokázali proniknout."],
  },
  {
    question: "Kolik křižáckých výprav bylo vedeno proti husitům?",
    correctAnswer: "Pět",
    options: ["Pět", "Dvě", "Tři", "Sedm"],
    hints: ["Papežové opakovaně vyhlašovali křížové výpravy — bez úspěchu."],
    solutionSteps: ["Proti husitům bylo vyhlášeno 5 křižáckých výprav (1420–1431) — husité všechny odrazili."],
  },
  {
    question: "Co je to defenestrace a jak souvisí s husitstvím?",
    correctAnswer: "Vyhazování z okna — husitská revoluce začala 1. pražskou defenestrací v roce 1419",
    options: [
      "Vyhazování z okna — husitská revoluce začala 1. pražskou defenestrací v roce 1419",
      "Útok na husitský tábor",
      "Spálení Betlémské kaple",
      "Volba husitského krále",
    ],
    hints: ["Defenestrace = de (dolů) + fenestra (okno) latinsky."],
    solutionSteps: ["1. pražská defenestrace 1419 = husité vyhodili radní z okna Nového Města — zahájení husitských válek."],
  },
  {
    question: "Jak husitství ovlivnilo České dějiny?",
    correctAnswer: "Předznamenalo náboženskou reformaci — ovlivnilo Luthera a protestantismus o 100 let později",
    options: [
      "Předznamenalo náboženskou reformaci — ovlivnilo Luthera a protestantismus o 100 let později",
      "Husitství nemělo trvalý vliv",
      "Husitství způsobilo zánik Čech",
      "Husitství přivedlo Habsburky",
    ],
    hints: ["Martin Luther citoval Jana Husa — 'Jsme všichni husité'"],
    solutionSteps: ["Husitství bylo první reformační hnutí Evropy — Hus o 100 let předběhl Luthera. Ovlivnilo celou protestantskou reformaci."],
  },
  {
    question: "Proč byl Jan Hus přizván do Kostnice a co mu bylo slíbeno?",
    correctAnswer: "Byl pozván k hájení svého učení s příslibem bezpečného průchodu od císaře",
    options: [
      "Byl pozván k hájení svého učení s příslibem bezpečného průchodu od císaře",
      "Přijel dobrovolně bez záruky",
      "Byl unesen ze školy",
      "Přijel za papežem sám bez pozvání",
    ],
    hints: ["Glejt = průvodní list zaručující bezpečnost."],
    solutionSteps: ["Hus dostal od císaře Zikmunda 'glejt' (záruku bezpečnosti) — přesto byl zatčen a odsouzen. Slib nebyl dodržen."],
  },
  {
    question: "Co jsou Basilejská kompaktáta (1436)?",
    correctAnswer: "Dohoda mezi husity a katolickou církví — uznání přijímání pod obojím pro Čechy",
    options: [
      "Dohoda mezi husity a katolickou církví — uznání přijímání pod obojím pro Čechy",
      "Mírová smlouva s Polskem",
      "Zákon o nástupnictví v Čechách",
      "Smlouva o obchodu s Říší",
    ],
    hints: ["Kompaktáta = smlouva, která husitské války ukončila."],
    solutionSteps: ["Basilejská kompaktáta (1436) ukončila husitské války — církev uznala přijímání pod obojím pro Čechy."],
  },
  {
    question: "Proč Jan Žižka neprohrál ani jednu bitvu, přestože byl slepý?",
    correctAnswer: "Měl výbornou strategii a disciplinované vojsko — používal palné zbraně a vozovou hradbu",
    options: [
      "Měl výbornou strategii a disciplinované vojsko — používal palné zbraně a vozovou hradbu",
      "Byl neporazitelný díky své síle",
      "Bojoval v noci, kdy ostatní neviděli",
      "Nikdy sám nebojoval — jen velel z dálky",
    ],
    hints: ["Žižka byl génius vojenské strategie."],
    solutionSteps: ["Žižka byl skvělý stratég — využíval terén, vozovou hradbu a disciplínu. Byl slepý, ale neprohrál žádnou bitvu."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co bylo příčinou husitského hnutí?",
    correctAnswer: "Korupce církve, prodej odpustků, bohatství kléru — a nerovnost ve společnosti",
    options: [
      "Korupce církve, prodej odpustků, bohatství kléru — a nerovnost ve společnosti",
      "Jen náboženské neshody",
      "Chudoba chudých rolníků bez náboženského obsahu",
      "Touha po nezávislosti na Říši",
    ],
    hints: ["Husitství bylo náboženské i sociální hnutí."],
    solutionSteps: ["Husitství mělo náboženský základ (odpustky, korupce) i sociální rozměr — bohatá církev vs. chudý lid."],
  },
  {
    question: "Proč mělo husitství větší ohlas u prostého lidu než u šlechty?",
    correctAnswer: "Hus kázal v češtině — všichni rozuměli, ne jen vzdělanci v latině",
    options: [
      "Hus kázal v češtině — všichni rozuměli, ne jen vzdělanci v latině",
      "Šlechta neposlouchala kázání",
      "Prostý lid byl gramotný, šlechta ne",
      "Hus sliboval prostému lidu bohatství",
    ],
    hints: ["Betlémská kaple měla tisíce posluchačů — proč?"],
    solutionSteps: ["Hus kázal česky v Betlémské kapli — tisíce lidí rozuměly jeho poselství. Latinská mše lidu nic neříkala."],
  },
  {
    question: "Proč se husité nerozpadli po Husově smrti, ale naopak začali bojovat?",
    correctAnswer: "Upálení Husa bylo pro lid provokací — stalo se symbolem nespravedlnosti a vyvolalo revoltu",
    options: [
      "Upálení Husa bylo pro lid provokací — stalo se symbolem nespravedlnosti a vyvolalo revoltu",
      "Husité měli předem plán vojny",
      "Husovi žáci přesvědčili lid k boji",
      "Habsburkové vyprovokovali husity",
    ],
    hints: ["Smrt mučedníka = radikalizace hnutí."],
    solutionSteps: ["Husovo upálení (1415) rozlítilo lid — stal se mučedníkem. V roce 1419 explodovala 1. pražská defenestrace."],
  },
  {
    question: "Jak husitské války ovlivnily hospodářství Čech?",
    correctAnswer: "Zničily mnoho klášterů, hradů a obcí — ale přinesly sekularizaci majetku církve",
    options: [
      "Zničily mnoho klášterů, hradů a obcí — ale přinesly sekularizaci majetku církve",
      "Hospodářství Čech se nezměnilo",
      "Husité přinesli prosperitu",
      "Čechy hospodářsky rostly díky válkám",
    ],
    hints: ["Válka = destrukce, ale také přerozdělení majetku."],
    solutionSteps: ["Války zničily kláštery a hrady, ale husité zkonfiskovali církevní majetek — šlechta a města to přijala s radostí."],
  },
  {
    question: "Proč je husitství považováno za předchůdce protestantské reformace?",
    correctAnswer: "Hus požadoval náboženskou reformu 100 let před Lutherem a ovlivnil ho přímo",
    options: [
      "Hus požadoval náboženskou reformu 100 let před Lutherem a ovlivnil ho přímo",
      "Husitství a lutherství jsou identická hnutí",
      "Hus Luther osobně znali",
      "Husitství a luteránství nejsou propojená",
    ],
    hints: ["Luther řekl: 'Jsme všichni husité — aniž bychom to věděli.'"],
    solutionSteps: ["Jan Hus (1415) kritizoval církev před Lutherem (1517) — Luther studoval Husa a nazval ho předchůdcem reformace."],
  },
  {
    question: "Co bylo výsledkem husitství pro českou kulturu a jazyk?",
    correctAnswer: "Posílení češtiny v bohoslužbách, vzdělání, literatuře — základ pro pozdější národní obrození",
    options: [
      "Posílení češtiny v bohoslužbách, vzdělání, literatuře — základ pro pozdější národní obrození",
      "Husitství potlačilo češtinu ve prospěch latiny",
      "Husitství nemělo vliv na jazyk",
      "Čeština se stala méně důležitou po husitských válkách",
    ],
    hints: ["Hus kázal česky — jaký to mělo dopad?"],
    solutionSteps: ["Husitství prosadilo češtinu v bohoslužbách a literatuře — základ národního vědomí a pozdějšího obrození v 19. stol."],
  },
  {
    question: "Co je symbolem husitského hnutí dodnes?",
    correctAnswer: "Kalich — symbol přijímání pod obojím, svobody svědomí",
    options: [
      "Kalich — symbol přijímání pod obojím, svobody svědomí",
      "Kříž",
      "Oheň",
      "Červená hvězda",
    ],
    hints: ["Husité se nazývali 'kališníci'."],
    solutionSteps: ["Kalich je symbolem husitství — přijímání pod obojím (chléb i víno) = rovnost před Bohem a svoboda svědomí."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const count = level === 3 ? Math.min(pool.length, 45) : Math.min(pool.length, 30);
  return shuffle(pool).slice(0, count);
}

export const MISTRJANHUSHUSITSKEVALKY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-husitstvi-mistr-jan-hus-husitske-valky",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-husitstvi-mistr-jan-hus-husitske-valky",
    title: "Mistr Jan Hus, husitské války",
    studentTitle: "Jan Hus",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš kazatele Jana Husa, proč byl upálen a jak vznikly husitské války.",
    keywords: ["Jan Hus", "husitství", "Žižka", "Betlémská kaple", "kalich", "odpustky", "1415"],
    goals: [
      "Popsat Jana Husa a jeho přínos",
      "Vysvětlit příčiny husitských válek",
      "Znát rok 1415 a Kostnický koncil",
      "Popsat husitský symbol — kalich",
    ],
    boundaries: ["Detailní vojenská strategie není cílem", "Basilejský koncil do hloubky není vyžadován"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Jan Hus 1369–1415 = kazatel, Betlémská kaple, kritik odpustků. Upálen 6. 7. 1415 v Kostnici. Husitské války 1419–1436.",
      steps: [
        "Hus = kazatel, ne panovník",
        "1415 = upálen v Kostnici → husitské války",
        "Žižka = vojevůdce, vozová hradba",
        "Kalich = symbol přijímání pod obojím",
        "1436 = kompaktáta, konec válek",
      ],
      commonMistake: "Žáci si pletou Jana Husa a Jana Žižku — Hus byl kazatel, Žižka vojevůdce.",
      example: "Jan Hus: kazatel v Betlémské kapli → 1415 upálen v Kostnici → 1419 husitské války → 1434 Lipany → 1436 kompaktáta.",
    },
  },
];
