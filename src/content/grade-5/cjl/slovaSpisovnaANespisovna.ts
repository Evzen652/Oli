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
    question: "Je slovo 'jdu' spisovné?",
    correctAnswer: "ano",
    options: ["ano", "ne", "záleží na situaci", "nikdo neví"],
    hints: ["Slovníkový tvar 'jdu' je správný spisovný tvar."],
  },
  {
    question: "Je slovo 'du' (místo 'jdu') spisovné?",
    correctAnswer: "ne – je to nespisovný hovorový tvar",
    options: [
      "ano – je to správně",
      "ne – je to nespisovný hovorový tvar",
      "ano – v dialektu",
      "záleží na kraji",
    ],
    hints: ["'Du' je hovorová zkrácenina, ve škole nebo v textu se nepoužívá."],
  },
  {
    question: "Jak zní spisovná varianta slova 'ksicht'?",
    correctAnswer: "obličej / tvář",
    options: ["ksicht je správně", "obličej / tvář", "morda", "fňuk"],
    hints: ["Slangové slovo 'ksicht' nahradíme neutrálním výrazem."],
  },
  {
    question: "Jak zní spisovná varianta slova 'vokno'?",
    correctAnswer: "okno",
    options: ["vokno je správně", "okno", "vejkno", "vínko"],
    hints: ["Předpona 'vo-' místo 'o-' je nespisovná (obecná čeština)."],
  },
  {
    question: "Ve které situaci používáme OBVYKLE spisovnou češtinu?",
    correctAnswer: "v písemné práci ve škole",
    options: [
      "při hře s kamarády",
      "v písemné práci ve škole",
      "při rozhovoru s babičkou doma",
      "při sportu",
    ],
    hints: ["Škola a úřady vyžadují spisovný projev."],
  },
  {
    question: "Slovo 'cajk' je:",
    correctAnswer: "nespisovné slangové slovo",
    options: [
      "spisovné slovo",
      "nespisovné slangové slovo",
      "nářeční výraz",
      "správný termín",
    ],
    hints: ["Slang = výrazy určité skupiny lidí, nejsou ve slovníku jako správné."],
  },
  {
    question: "Slovo 'dobrej' (místo 'dobrý') je:",
    correctAnswer: "nespisovné – obecná čeština",
    options: [
      "správně – je to správný tvar",
      "nespisovné – obecná čeština",
      "správně – dialekt",
      "nové slovo",
    ],
    hints: ["Přídavná jména v obecné češtině mají zkrácené koncovky."],
  },
  {
    question: "Ve které situaci je hovorová čeština zcela přijatelná?",
    correctAnswer: "při rozhovoru s přáteli",
    options: [
      "ve školní písemné práci",
      "při rozhovoru s přáteli",
      "v novinovém článku",
      "v úředním dopise",
    ],
    hints: ["Hovorová čeština je přirozená v běžné mluvené komunikaci."],
  },
  {
    question: "Jak zní spisovná varianta slova 'fest' (ve smyslu 'hodně')?",
    correctAnswer: "velmi / hodně",
    options: ["fest je správně", "velmi / hodně", "moc fest", "pevně"],
    hints: ["'Fest' je slangový výraz z nářečí, nahradíme ho neutrálním."],
  },
  {
    question: "Slovo 'autobus' je:",
    correctAnswer: "spisovné – přejatý výraz uznaný slovníkem",
    options: [
      "nespisovné cizí slovo",
      "slangový výraz",
      "spisovné – přejatý výraz uznaný slovníkem",
      "dialektismus",
    ],
    hints: ["Mnoho přejatých slov je v češtině plně přijato jako spisovná."],
  },
  {
    question: "Co jsou to nářečí (dialekty)?",
    correctAnswer: "místní varianty jazyka typické pro určitý region",
    options: [
      "slangové výrazy mládeže",
      "místní varianty jazyka typické pro určitý region",
      "odborné termíny vědy",
      "staré zastaralé formy",
    ],
    hints: ["Na Moravě nebo ve Slezsku uslyšíš jiné výrazy než v Praze."],
  },
  {
    question: "Ve vědeckém textu nebo učebnici se používá:",
    correctAnswer: "spisovná čeština",
    options: [
      "slang a hovorová čeština",
      "nářečí z daného kraje",
      "spisovná čeština",
      "angličtina",
    ],
    hints: ["Odborné texty vyžadují přesný a neutrální jazyk."],
  },
  {
    question: "Jak zní nespisovný hovorový tvar slova 'nic'?",
    correctAnswer: "nic je již hovorové i spisovné; v obecné češtině: 'vůbec nic'",
    options: [
      "nič",
      "nic je již hovorové i spisovné; v obecné češtině: 'vůbec nic'",
      "nicujo",
      "nijaké",
    ],
    hints: ["Některá slova jsou přijatelná v obou vrstvách jazyka."],
  },
  {
    question: "Slovo 'brácha' (místo 'bratr') je:",
    correctAnswer: "hovorové nespisovné slovo",
    options: [
      "plně spisovné",
      "hovorové nespisovné slovo",
      "odborný termín",
      "nářeční výraz",
    ],
    hints: ["Brácha je familiární označení bratra – ve škole pišeme 'bratr'."],
  },
  {
    question: "V rozhlasovém zpravodajství se používá:",
    correctAnswer: "spisovná čeština",
    options: [
      "hovorová čeština",
      "slang",
      "nářečí daného kraje",
      "spisovná čeština",
    ],
    hints: ["Zpravodajství musí být srozumitelné všem posluchačům v celé zemi."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak zní spisovná varianta věty 'Von jde domů.'?",
    correctAnswer: "On jde domů.",
    options: [
      "Von jde domů. – správně",
      "On jde domů.",
      "Un jde domů.",
      "Vono jde domů.",
    ],
    hints: ["'Von' místo 'On' je nespisovné (obecná čeština – záměna v/o)."],
  },
  {
    question: "Jak zní nářeční výraz 'dycky' ve spisovné češtině?",
    correctAnswer: "vždy / stále",
    options: ["dycky je správně", "vždy / stále", "nikdy", "někdy"],
    hints: ["'Dycky' pochází z moravských nářečí."],
  },
  {
    question: "Slovo 'půjdem' (místo 'půjdeme') je:",
    correctAnswer: "hovorová zkrácená forma, nespisovná",
    options: [
      "plně správné",
      "hovorová zkrácená forma, nespisovná",
      "dialektismus",
      "přejaté slovo",
    ],
    hints: ["Krácení tvarů sloves je typické pro hovorový projev."],
  },
  {
    question: "Co patří do skupiny 'slang'?",
    correctAnswer: "výrazy specifické skupiny lidí – mládeže, sportovců atd.",
    options: [
      "odborné vědecké termíny",
      "nářeční výrazy jednoho kraje",
      "výrazy specifické skupiny lidí – mládeže, sportovců atd.",
      "zastaralé výrazy z 18. století",
    ],
    hints: ["Slang = žargon určité skupiny – hráči, programátoři, hudebníci..."],
  },
  {
    question: "Jak zní spisovná varianta slova 'holka'?",
    correctAnswer: "dívka / dívčina",
    options: [
      "holka je plně správné",
      "dívka / dívčina",
      "ženská",
      "babička",
    ],
    hints: ["'Holka' je hovorový výraz, ve formálním textu použijeme 'dívka'."],
  },
  {
    question: "Slovo 'kluk' versus 'chlapec' – který výraz je spisovnější?",
    correctAnswer: "chlapec je neutrálně spisovné, kluk je hovorové",
    options: [
      "kluk je spisovnější",
      "chlapec je neutrálně spisovné, kluk je hovorové",
      "oba jsou stejně nespisovné",
      "oba jsou plně spisovné",
    ],
    hints: ["Kluk je přijatelné, ale chlapec je formálnější."],
  },
  {
    question: "Ve školním slohové práci na téma 'Jak jsem trávil prázdniny' je vhodné:",
    correctAnswer: "psát spisovně, ale s přirozeným vypravěčským tónem",
    options: [
      "psát čistě hovorově jako v SMS",
      "psát jen odborné vědecké výrazy",
      "psát nářečím svého kraje",
      "psát spisovně, ale s přirozeným vypravěčským tónem",
    ],
    hints: ["Sloh = formální text, ale vyprávění může být živé a přirozené."],
  },
  {
    question: "Jak zní nespisovný hovorový tvar slova 'pojďte'?",
    correctAnswer: "pojďte i poďte jsou přijatelné, ale poďte bývá hovorovější",
    options: [
      "poďte je zcela špatně",
      "pojďte i poďte jsou přijatelné, ale poďte bývá hovorovější",
      "oba tvary jsou zcela nespisovné",
      "správně je jen 'jděte'",
    ],
    hints: ["Přijatelnost tvarů závisí na situaci a kontextu."],
  },
  {
    question: "Proč se dialekty liší oblast od oblasti?",
    correctAnswer: "historicky se různé regiony vyvíjely odděleně",
    options: [
      "protože lidé v různých krajích mluví různými jazyky",
      "historicky se různé regiony vyvíjely odděleně",
      "dialekty jsou záměrně vymyšlené",
      "závisí na teplotě klimatu",
    ],
    hints: ["Historický vývoj, sousedství s jinými jazyky – to formuje nářečí."],
  },
  {
    question: "Ve větě 'Šel sem k vám.' slovo 'sem' místo 'jsem' je:",
    correctAnswer: "nespisovný hovorový tvar",
    options: [
      "správně – sem = jsem",
      "nespisovný hovorový tvar",
      "nářeční výraz z Moravy",
      "přejaté slovo",
    ],
    hints: ["'Sem' místo 'jsem' je typická obecná čeština."],
  },
  {
    question: "Proč je důležité umět používat spisovnou češtinu?",
    correctAnswer: "abychom byli srozumitelní všem a působili formálně v potřebných situacích",
    options: [
      "protože hovorová čeština neexistuje",
      "abychom byli srozumitelní všem a působili formálně v potřebných situacích",
      "protože dialekty jsou zakázány",
      "abychom mohli studovat cizí jazyky",
    ],
    hints: ["Spisovatel jazyk je společný základ pro všechny Čechy."],
  },
  {
    question: "Slovo 'makat' (místo 'pracovat') je:",
    correctAnswer: "hovorový slangový výraz",
    options: [
      "plně spisovné",
      "hovorový slangový výraz",
      "dialektismus",
      "anglicismus",
    ],
    hints: ["Makat = pracovat tvrdě – expresivní, neformální výraz."],
  },
  {
    question: "Ve formálním dopise řediteli školy bychom NIKDY nepoužili:",
    correctAnswer: "slova jako 'čau', 'pozdravuju', 'brácha'",
    options: [
      "slova jako 'Vážený pane řediteli'",
      "slova jako 'čau', 'pozdravuju', 'brácha'",
      "formální pozdravy",
      "vlastní podpis",
    ],
    hints: ["Úřední styl = formální jazyk bez hovorových výrazů."],
  },
  {
    question: "Jak se nazývá vrstva češtiny, která stojí mezi plně spisovnou a nářečím?",
    correctAnswer: "hovorová čeština / obecná čeština",
    options: [
      "odborná čeština",
      "hovorová čeština / obecná čeština",
      "archaická čeština",
      "poetická čeština",
    ],
    hints: ["Hovorová čeština je přirozená v běžné mluvě, ale ne ve formálních textech."],
  },
  {
    question: "Slovo 'mobil' (telefon) je:",
    correctAnswer: "přijatelné i ve spisovném projevu jako zkrácená podoba",
    options: [
      "zcela nespisovné",
      "přijatelné i ve spisovném projevu jako zkrácená podoba",
      "odborný termín z fyziky",
      "dialektismus",
    ],
    hints: ["Mobil je zkratka pro mobilní telefon – dnes plně přijatá."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Přepiš větu do spisovné podoby: 'Dyž přijdem, řekneme vám.'",
    correctAnswer: "Když přijdeme, řekneme vám.",
    options: [
      "Dyž přidem, řekneme vám.",
      "Když přijdeme, řekneme vám.",
      "Když přijdem, řekneme vám.",
      "Dyž přijdeme, řekneme vám.",
    ],
    hints: ["'Dyž' = 'Když', 'přijdem' = 'přijdeme'."],
  },
  {
    question: "Která z těchto vět je plně NESPISOVNÁ?",
    correctAnswer: "Von to vobjednál vo den dřív.",
    options: [
      "On to objednal o den dřív.",
      "Von to vobjednál vo den dřív.",
      "Objednal to předem.",
      "Dříve si to objednal.",
    ],
    hints: ["Von, vobjednal, vo – vše jsou nespisovné tvary."],
  },
  {
    question: "Co je 'argot'?",
    correctAnswer: "tajný jazyk určité skupiny – zloději, vězeňský slang",
    options: [
      "nářečí z Moravy",
      "tajný jazyk určité skupiny – zloději, vězeňský slang",
      "odborný vědecký jazyk",
      "forma starší češtiny z 18. stol.",
    ],
    hints: ["Argot = specifický slang uzavřené skupiny s cílem utajit smysl."],
  },
  {
    question: "Jak se správně říká o češtině, která porušuje normu, ale je přijatelná v mluvené komunikaci?",
    correctAnswer: "obecná čeština",
    options: [
      "špatná čeština",
      "obecná čeština",
      "nespisovná literatura",
      "dialektismus",
    ],
    hints: ["Obecná čeština = nadnářeční nespisovná vrstva, typická pro Čechy."],
  },
  {
    question: "Přepiš do nespisovné podoby: 'Chtěl jsem jít do kina.'",
    correctAnswer: "Chtěl sem jít do kina.",
    options: [
      "Chtel jsem jít do kina.",
      "Chtěl sem jít do kina.",
      "Chtěl semte jít do kina.",
      "Chtel sem jit do kina.",
    ],
    hints: ["Jsem → sem (obecná čeština). Ostatní zůstávají."],
  },
  {
    question: "Ve větě 'Přišel s bráchou a řek, že přijdou.' kolik nespisovných prvků je?",
    correctAnswer: "dva: brácha (místo bratr), řek – místo řekl",
    options: [
      "žádný – vše je správně",
      "jeden: brácha",
      "dva: brácha (místo bratr), řek – místo řekl",
      "tři: brácha, řek, přijdou",
    ],
    hints: ["Brácha = hovorové, řek = zkrácený nespisovný tvar 'řekl'."],
  },
  {
    question: "Které slovo je plně přijatelné v obou vrstvách – hovorové i spisovné – bez významné ztráty formálnosti?",
    correctAnswer: "telefon",
    options: [
      "brácha",
      "ksicht",
      "telefon",
      "du – jdu",
    ],
    hints: ["Telefon je neutrální – není slang ani nespisovný výraz."],
  },
  {
    question: "Má čeština jeden nebo více standardů (norem) pro správný jazyk?",
    correctAnswer: "jeden základní – spisovná norma kodifikovaná ve slovníku",
    options: [
      "každý kraj má svou vlastní normu",
      "jeden základní – spisovná norma kodifikovaná ve slovníku",
      "dvě normy – jedna pro školu, jedna pro dospělé",
      "žádná norma neexistuje",
    ],
    hints: ["Pravidla českého pravopisu a slovník = základní norma."],
  },
  {
    question: "Co znamená 'kodifikace' v jazykovém smyslu?",
    correctAnswer: "zapsání a určení správné formy slova ve slovníku/pravidlech",
    options: [
      "překlad slova do cizího jazyka",
      "zapsání a určení správné formy slova ve slovníku/pravidlech",
      "vymýšlení nových slov",
      "zakazování dialektů",
    ],
    hints: ["Kodifikovat = stanovit závazná pravidla pro správný jazyk."],
  },
  {
    question: "Slovo 'super' (výborný) – je dnes ve slovníku češtiny?",
    correctAnswer: "ano – přejaté slovo přijaté jako hovorové/neformální",
    options: [
      "ne – nikdy nebude přijato",
      "ano – přejaté slovo přijaté jako hovorové/neformální",
      "ano – plně formální a neutrální",
      "pouze v mluveném projevu, ve slovníku ne",
    ],
    hints: ["Nová slova se postupně přijímají do slovníku jako nová vrstva jazyka."],
  },
  {
    question: "Jak se nazývá jev, kdy nové slovo (např. z angličtiny) vstupuje do češtiny?",
    correctAnswer: "přejímání slov / přejaté slovo",
    options: [
      "dialektizace",
      "přejímání slov / přejaté slovo",
      "archaizace",
      "vulgarizace",
    ],
    hints: ["Computer → počítač, nebo smartphone zůstal smartphone."],
  },
  {
    question: "Která z vět je stylově VHODNÁ pro školní sloh a která pro SMS?",
    correctAnswer: "Sloh: 'Poté jsme navštívili museum.' SMS: 'Pak sme šli do muzea.'",
    options: [
      "Sloh: 'Pak sme šli do muzea.' SMS: 'Poté jsme navštívili muzeum.'",
      "Sloh: 'Poté jsme navštívili museum.' SMS: 'Pak sme šli do muzea.'",
      "Pro obě situace se hodí stejný styl",
      "SMS musí být vždy spisovná",
    ],
    hints: ["Sme místo jsme, pak místo poté = hovorové."],
  },
  {
    question: "Proč mohou být nářeční výrazy cenné pro kulturu?",
    correctAnswer: "uchovávají historii a identitu dané oblasti",
    options: [
      "jsou vždy lepší než spisovná čeština",
      "uchovávají historii a identitu dané oblasti",
      "pomáhají při studiu angličtiny",
      "nemají žádnou hodnotu",
    ],
    hints: ["Folkloristika, literatura, místní kultura – dialekty jsou součástí dědictví."],
  },
  {
    question: "Ve větě 'Dej to tamhle.' je slovo 'tamhle':",
    correctAnswer: "hovorové/obecně české, ale přijatelné v mluvené řeči",
    options: [
      "zcela nespisovné, zakázané",
      "hovorové/obecně české, ale přijatelné v mluvené řeči",
      "plně formální termín",
      "dialektismus z Moravy",
    ],
    hints: ["Tamhle = tam tamto místo, hovorový výraz, ale používaný běžně."],
  },
  {
    question: "Jak zní nářeční slovo 'šak' (Morava) ve spisovné češtině?",
    correctAnswer: "však / přece",
    options: [
      "šak je správně v celé ČR",
      "však / přece",
      "ale / jenže",
      "tak / tedy",
    ],
    hints: ["'Šak víš!' = 'Přece víš!' nebo 'Však víš!' v moravském nářečí."],
  },
  {
    question: "Jak poznáš, že slovo je nespisovné, když nevíš jistě?",
    correctAnswer: "vyhledám ho ve slovníku – nespisovné je označeno zkratkou 'hovor.' nebo 'nář.'",
    options: [
      "nespisovné slovo nikdy nenajdu ve slovníku",
      "vyhledám ho ve slovníku – nespisovné je označeno zkratkou 'hovor.' nebo 'nář.'",
      "záleží jen na mém pocitu",
      "nespisovná slova jsou vždy kratší",
    ],
    hints: ["Slovník češtiny označuje stylovou vrstvu každého slova."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SLOVASPISOVNAANESPISOVNA: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-nauka-o-slove-slova-spisovna-a-nespisovna",
    rvpNodeId: "g5-cjl-jazykova-vychova-nauka-o-slove-slova-spisovna-a-nespisovna",
    title: "Slova spisovná a nespisovná",
    studentTitle: "Spisovná čeština",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Poznáš, kdy mluvíme spisovně a kdy hovorově.",
    keywords: ["spisovná čeština", "nespisovná", "hovorová", "nářečí", "slang"],
    goals: [
      "Rozlišit spisovné a nespisovné výrazy",
      "Převést nespisovné slovo do jeho spisovné podoby",
      "Uvést, kdy se hodí která vrstva jazyka",
    ],
    boundaries: [
      "Neprobíráme hlubokou dialektologii",
      "Bez složité fonetické terminologie",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Zeptej se sám sebe: 'Řekl/a bych to řediteli školy nebo napsal/a v novinách?' Pokud ano – je to asi spisovné.",
      steps: [
        "Přemýšlej, v jaké situaci se slovo používá.",
        "Zkus si vzpomenout, zda je slovo v učebnici nebo jen v hovoru.",
        "Porovnej s neutrálním výrazem, který znáš ze školy.",
      ],
      commonMistake: "Žáci si pletou hovorové výrazy (brácha, kluk) s plně nespisovnými. Hovorové jsou přijatelné v mluvě, ale ne ve formálním textu.",
      example: "Slovo 'ksicht' → nespisovné; 'obličej' → spisovné. Slovo 'brácha' → hovorové; 'bratr' → neutrálně spisovné.",
    },
  },
];
