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
    question: "Které slovo je jednoznačné (má jen jeden význam)?",
    correctAnswer: "kyslík",
    options: ["les", "kyslík", "list", "oko"],
    hints: ["Jednoznačné slovo má přesně jeden vědecký nebo odborný význam."],
  },
  {
    question: "Které slovo je vícevýznamové?",
    correctAnswer: "oko",
    options: ["kyslík", "fotbal", "oko", "autobus"],
    hints: ["Vícevýznamové slovo může znamenat část těla, ale i díru v síti."],
  },
  {
    question: "Slovo 'les' je vícevýznamové. Jaký může mít druhý význam?",
    correctAnswer: "vícero stromů pohromadě, ale i typ šachové figurky – věž v nářečí",
    options: [
      "vícero stromů pohromadě, ale i typ šachové figurky – věž v nářečí",
      "má jen jeden význam – stromy",
      "znamená jen houby",
      "znamená jen přírodu",
    ],
    hints: ["Les může označovat lesní porost, ale v jiných kontextech i jiné věci."],
  },
  {
    question: "Jaký je správný termín pro slova s více různými významy?",
    correctAnswer: "vícevýznamová slova",
    options: ["jednoznačná slova", "vícevýznamová slova", "cizí slova", "zdrobněliny"],
    hints: ["Tato slova mají více než jeden ustálený význam."],
  },
  {
    question: "Slovo 'hlava' je vícevýznamové. Které z těchto vět ukazuje jiný význam?",
    correctAnswer: "Byl hlavou organizace.",
    options: [
      "Bolí mě hlava.",
      "Byl hlavou organizace.",
      "Oba jsou stejné.",
      "Hlava je část těla.",
    ],
    hints: ["Hlava může znamenat vedoucího/šéfa, nejen část těla."],
  },
  {
    question: "Které slovo je jednoznačné?",
    correctAnswer: "dusík",
    options: ["dusík", "ruka", "koruna", "list"],
    hints: ["Chemické prvky mívají jen jeden odborný význam."],
  },
  {
    question: "Slovo 'ruka' — kolik významů má?",
    correctAnswer: "více – část těla, ale i způsob označení v kartách apod.",
    options: [
      "jen jeden – část těla",
      "více – část těla, ale i způsob označení v kartách apod.",
      "žádný – to není slovo",
      "tři přesně",
    ],
    hints: ["Ruka se používá v různých spojeních s různými významy."],
  },
  {
    question: "Ve větě 'Listoval v knize.' slovo 'list' znamená:",
    correctAnswer: "stránka – papír",
    options: ["zelený list stromu", "stránka – papír", "dopis", "karta"],
    hints: ["Při listování v knize myslíme na stránky."],
  },
  {
    question: "Ve větě 'List stromu spadl.' slovo 'list' znamená:",
    correctAnswer: "zelený list rostliny",
    options: ["stránka v knize", "zelený list rostliny", "dopis", "papír"],
    hints: ["Stromy mají listy – části rostliny."],
  },
  {
    question: "Které slovo má více významů: 'kotva' nebo 'kyslík'?",
    correctAnswer: "kotva",
    options: ["kyslík", "kotva", "oba stejně", "ani jedno"],
    hints: ["Kotva může být záchrana, ale i loď zastavující na moři."],
  },
  {
    question: "Slovo 'koruna' může znamenat:",
    correctAnswer: "českou měnu i ozdobu na hlavě panovníka",
    options: [
      "jen ozdobu na hlavě",
      "jen českou měnu",
      "českou měnu i ozdobu na hlavě panovníka",
      "druh stromu",
    ],
    hints: ["Koruna je jak mince, tak symbol moci."],
  },
  {
    question: "Jsou slova 'vícevýznamová' a 'mnohoznačná' totéž?",
    correctAnswer: "ano, jsou to synonyma pro slova s více než jedním významem",
    options: [
      "ne, jsou to různé věci",
      "ano, jsou to synonyma pro slova s více než jedním významem",
      "mnohoznačná mají 3+ a vícevýznamová 2 významy",
      "vícevýznamová jsou jen v češtině",
    ],
    hints: ["Oba termíny označují totéž."],
  },
  {
    question: "Slovo 'zámek' může znamenat:",
    correctAnswer: "bezpečnostní zařízení i historickou budovu",
    options: [
      "jen historickou budovu",
      "jen bezpečnostní zařízení",
      "bezpečnostní zařízení i historickou budovu",
      "druh jídla",
    ],
    hints: ["Myslíme na zámek na dveřích i na hradní zámek."],
  },
  {
    question: "Slovo 'klíč' je vícevýznamové. Které dva významy má?",
    correctAnswer: "nástroj k odemykání i hudební symbol",
    options: [
      "nástroj k odemykání i hudební symbol",
      "jen nástroj k odemykání",
      "jen hudební symbol",
      "druh stromu a nástroj",
    ],
    hints: ["Basový klíč je v notách, ale klíč otvírá dveře."],
  },
  {
    question: "Slovo 'fotbal' je:",
    correctAnswer: "jednoznačné – označuje jen jeden sport",
    options: [
      "vícevýznamové – má dva různé smysly",
      "jednoznačné – označuje jen jeden sport",
      "cizí slovo bez českého překladu",
      "zastaralé slovo",
    ],
    hints: ["Fotbal znamená stále jedno a totéž."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ve větě 'Hlídač stál u brány.' co znamená slovo 'brána'?",
    correctAnswer: "velká vchodová závora nebo vstup",
    options: [
      "fotbalová branka",
      "velká vchodová závora nebo vstup",
      "brána do nebe",
      "jméno osoby",
    ],
    hints: ["Kontext věty napoví správný význam."],
  },
  {
    question: "Ve větě 'Střelec dal gól do brány.' co znamená slovo 'brána'?",
    correctAnswer: "fotbalová branka",
    options: [
      "velký vstup do hradu",
      "fotbalová branka",
      "zeměpisný průsmyk",
      "vzácná věc",
    ],
    hints: ["Střelec a gól napovídají sportovní kontext."],
  },
  {
    question: "Které z těchto slov je jednoznačné?",
    correctAnswer: "algebra",
    options: ["list", "koruna", "zámek", "algebra"],
    hints: ["Odborné vědecké termíny bývají jednoznačné."],
  },
  {
    question: "Slovo 'oko' má v češtině přibližně kolik různých významů?",
    correctAnswer: "více než 5",
    options: ["přesně 1", "přesně 2", "přesně 3", "více než 5"],
    hints: ["Oko = zrakový orgán, díra v síti, stehová klička, dírka v jehlici..."],
  },
  {
    question: "Ve větě 'Sedí jí na rameni.' slovo 'rameno' znamená:",
    correctAnswer: "část těla",
    options: [
      "část těla",
      "část řeky",
      "část silnice",
      "větev stromu",
    ],
    hints: ["Komu? Ptě. Rameno jako část těla člověka."],
  },
  {
    question: "Ve větě 'Řeka se rozdělila na dvě ramena.' slovo 'rameno' znamená:",
    correctAnswer: "větev – proud řeky",
    options: [
      "část těla",
      "větev – proud řeky",
      "most přes řeku",
      "hráz",
    ],
    hints: ["Řeka se větvila – jde o tok vody."],
  },
  {
    question: "Jak se nazývají slova, která mají přesně jeden ustálený věcný význam?",
    correctAnswer: "jednoznačná",
    options: ["vícevýznamová", "jednoznačná", "mnohoznačná", "synonyma"],
    hints: ["Jedno slovo, jeden jediný smysl."],
  },
  {
    question: "Slovo 'loket' může znamenat část těla. Co ještě?",
    correctAnswer: "starou délkovou míru",
    options: [
      "starou délkovou míru",
      "druh jídla",
      "část řeky",
      "nástroj v kuchyni",
    ],
    hints: ["Ve starých textech se loket používal jako jednotka délky."],
  },
  {
    question: "Slovo 'palec' může znamenat prst. Co ještě?",
    correctAnswer: "starou délkovou míru – palec = cca 2,54 cm",
    options: [
      "druh kamene",
      "starou délkovou míru – palec = cca 2,54 cm",
      "způsob psaní",
      "typ oblečení",
    ],
    hints: ["Inch v angličtině = palec v češtině – délková míra."],
  },
  {
    question: "Ve větě 'Sáhl po svíci.' slovo 'svíce' znamená:",
    correctAnswer: "světelný zdroj ze včelího vosku nebo parafínu",
    options: [
      "světelný zdroj ze včelího vosku nebo parafínu",
      "motoristický díl",
      "zápalnou svíčku v motoru",
      "druh lampičky",
    ],
    hints: ["Staré osvětlení – svíce z vosku."],
  },
  {
    question: "Ve větě 'Motor potřebuje nové svíčky.' slovo 'svíčky' znamená:",
    correctAnswer: "zápalné díly v motoru",
    options: [
      "světelné svíčky",
      "zápalné díly v motoru",
      "druh dekorace",
      "plastové tyčinky",
    ],
    hints: ["Motor má zapalovací svíčky."],
  },
  {
    question: "Proč je důležité rozlišovat jednoznačná a vícevýznamová slova?",
    correctAnswer: "aby při čtení správně pochopil/a, co autor myslí",
    options: [
      "aby při čtení správně pochopil/a, co autor myslí",
      "protože jednoznačná jsou hezčí",
      "vícevýznamová se nepoužívají",
      "jen kvůli pravopisu",
    ],
    hints: ["Porozumění textu závisí na správném výkladu slov v kontextu."],
  },
  {
    question: "Slovo 'líný' je:",
    correctAnswer: "jednoznačné – znamená jen pomalý nebo bez chuti pracovat",
    options: [
      "vícevýznamové – má přesně 5 různých smyslů",
      "jednoznačné – znamená jen pomalý nebo bez chuti pracovat",
      "odborný termín z fyziky",
      "slovo bez pevného smyslu",
    ],
    hints: ["Líný má jeden jasný přídavný jmenný smysl."],
  },
  {
    question: "Slovo 'řeka' – je jednoznačné nebo vícevýznamové?",
    correctAnswer: "převážně jednoznačné – přirozený vodní tok",
    options: [
      "převážně jednoznačné – přirozený vodní tok",
      "vícevýznamové – 4 různé smysly",
      "cizí slovo",
      "zastaralé slovo",
    ],
    hints: ["Řeka = tok vody. Má jen jeden základní smysl."],
  },
  {
    question: "Slovo 'hvězda' – je vícevýznamové?",
    correctAnswer: "ano – astronomické těleso i slavná osobnost",
    options: [
      "ne – má jen jeden smysl",
      "ano – astronomické těleso i slavná osobnost",
      "ne – je to jen dekorace",
      "ano – 10 různých smyslů",
    ],
    hints: ["Hvězda na nebi i hvězda showbyznysu."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Urči, jaký význam má slovo 'hlava' ve větě: 'Je hlavou firmy už deset let.'",
    correctAnswer: "vedoucí / ředitel",
    options: [
      "část lidského těla",
      "vedoucí / ředitel",
      "titul ve šlechtě",
      "nadpis článku",
    ],
    hints: ["Hlava firmy = ten, kdo stojí v čele."],
  },
  {
    question: "Ve větě 'Přišel s čistou hlavou.' co znamená 'čistou hlavou'?",
    correctAnswer: "bez předsudků, se svěžím myšlením",
    options: [
      "umytou hlavu",
      "bez předsudků, se svěžím myšlením",
      "holou hlavu",
      "s pěkným účesem",
    ],
    hints: ["Idiom – čistá hlava = jasné myšlení."],
  },
  {
    question: "Slovo 'ucho' je vícevýznamové. Které z těchto výrazů ho nepoužívá v přeneseném smyslu?",
    correctAnswer: "Bolí ho ucho od rána.",
    options: [
      "Ucho hrnce je odlomené.",
      "Viselo na vlásku – bylo za ušima.",
      "Bolí ho ucho od rána.",
      "Hrneček měl dvě ucha.",
    ],
    hints: ["Bolí ho ucho = doslova část těla."],
  },
  {
    question: "Slovo 'koruna' ve větě 'Strom má hustou korunu.' znamená:",
    correctAnswer: "vrchní část stromu s větvemi a listy",
    options: [
      "panovnický symbol",
      "českou měnu",
      "vrchní část stromu s větvemi a listy",
      "střechu domu",
    ],
    hints: ["Korunou stromu nazýváme jeho horní část."],
  },
  {
    question: "Ve větě 'Zaplatil sto korun.' slovo 'korun' znamená:",
    correctAnswer: "česká měna",
    options: [
      "panovnický symbol",
      "česká měna",
      "vrchol stromu",
      "ozdoba vlasů",
    ],
    hints: ["Platíme korunami – českou měnou."],
  },
  {
    question: "Které slovo v této větě je použito v přeneseném smyslu? 'Srdce jeho řeči bylo prosté.'",
    correctAnswer: "srdce",
    options: ["jeho", "řeči", "prosté", "srdce"],
    hints: ["Srdce řeči = jádro / podstata – přenesený smysl."],
  },
  {
    question: "Slovo 'list' ve větě 'Napsal jí dlouhý list.' znamená:",
    correctAnswer: "dopis / psaná zpráva",
    options: [
      "list stromu",
      "stránka v knize",
      "dopis / psaná zpráva",
      "papír bez textu",
    ],
    hints: ["Napsat list = napsat dopis."],
  },
  {
    question: "Proč musíme při výkladu slova sledovat kontext (okolní věty)?",
    correctAnswer: "protože vícevýznamová slova mění smysl podle situace",
    options: [
      "protože slovník je nedostatečný",
      "protože vícevýznamová slova mění smysl podle situace",
      "jen kvůli pravopisu",
      "protože češtině chybí slova",
    ],
    hints: ["Kontext = klíč k pochopení správného významu."],
  },
  {
    question: "Slovo 'jít' – je jednoznačné nebo vícevýznamové? Uveď příklad jiného smyslu.",
    correctAnswer: "vícevýznamové – 'Jak ti to jde?' – daří se vs. 'Jdu domů.'",
    options: [
      "jednoznačné – vždy pohyb pěšky",
      "vícevýznamové – 'Jak ti to jde?' – daří se vs. 'Jdu domů.'",
      "jednoznačné – odborný termín z fyziky",
      "vícevýznamové – jen v příslovích",
    ],
    hints: ["Jít = pohybovat se, ale i dařit se, fungovat..."],
  },
  {
    question: "Ve větě 'Měl to za ušima.' co to znamená?",
    correctAnswer: "byl chytrý a vychytralý",
    options: [
      "měl za ušima špínu",
      "byl chytrý a vychytralý",
      "nosil náušnice",
      "měl velké uši",
    ],
    hints: ["Idiom – 'mít za ušima' = být mazaný."],
  },
  {
    question: "Slovo 'zub' ve větě 'Zuby času to nahlodaly.' znamená:",
    correctAnswer: "ničivé působení času – přenesený smysl",
    options: [
      "zubní sklovinu",
      "ničivé působení času – přenesený smysl",
      "ozubené kolo",
      "typ nástrojů",
    ],
    hints: ["'Zuby času' je ustálené spojení – čas ničí jako zuby."],
  },
  {
    question: "Které z těchto slov je nejspíše jednoznačné v odborném textu?",
    correctAnswer: "fotosyntéza",
    options: ["klíč", "oko", "fotosyntéza", "zámek"],
    hints: ["Vědecký termín má přesně jeden vědecký smysl."],
  },
  {
    question: "Jak se liší slovníkový výklad jednoznačného a vícevýznamového slova?",
    correctAnswer: "vícevýznamové má více číslovaných výkladů, jednoznačné jen jeden",
    options: [
      "jednoznačné má více výkladů",
      "vícevýznamové má více číslovaných výkladů, jednoznačné jen jeden",
      "ve slovníku nejsou žádné rozdíly",
      "záleží jen na délce slova",
    ],
    hints: ["Ve slovníku: 1. ..., 2. ..., 3. ... = vícevýznamové."],
  },
  {
    question: "Ve větě 'Křišťál je minerál.' slovo 'křišťál' je:",
    correctAnswer: "jednoznačné – odborný název minerálu",
    options: [
      "vícevýznamové – sklo i minerál",
      "jednoznačné – odborný název minerálu",
      "přídavné jméno",
      "cizí slovo bez překladu",
    ],
    hints: ["Křišťál v mineralogii = přesně určený minerál."],
  },
  {
    question: "Slovo 'nést' – které věty ukazují jeho různé smysly?",
    correctAnswer: "'Nesu tašku.' a 'Projekt nese riziko.'",
    options: [
      "'Nesu tašku.' a 'Sed tady.'",
      "'Nesu tašku.' a 'Projekt nese riziko.'",
      "'Pták letí.' a 'Kráčím pomalu.'",
      "'Nese se.' a 'Letí.'",
    ],
    hints: ["Nést = fyzicky přenášet, ale i obsahovat (riziko, náklady)."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SLOVAJEDNOZNACNAMNOHOZNACNAVICEVYZNAMOVA: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-nauka-o-slove-slova-jednoznacna-mnohoznacna-vicevyznamova",
    rvpNodeId: "g5-cjl-jazykova-vychova-nauka-o-slove-slova-jednoznacna-mnohoznacna-vicevyznamova",
    title: "Slova jednoznačná, mnohoznačná, vícevýznamová",
    studentTitle: "Vícevýznamová slova",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Poznáš slova, která mají více různých významů.",
    keywords: ["vícevýznamová", "jednoznačná", "mnohoznačná", "význam slova"],
    goals: [
      "Rozlišit jednoznačná a vícevýznamová slova",
      "Určit správný význam slova podle kontextu věty",
      "Uvést příklady různých významů daného slova",
    ],
    boundaries: [
      "Neprobírá se etymologie slov",
      "Bez hlubší sémantiky nebo jazykovědy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Vícevýznamová slova mají více různých smyslů. Dívej se na okolní větu – ta ti poví, který smysl je správný.",
      steps: [
        "Přečti celou větu, nejen samotné slovo.",
        "Zamysli se, co by dávalo smysl v daném kontextu.",
        "Zkus si dosadit jiné slovo se stejným smyslem.",
      ],
      commonMistake: "Děti si pletou jednoznačná slova s vícevýznamovými – odborné termíny (kyslík, algebra) mají jen jeden smysl.",
      example: "Slovo 'klíč' – v notách je to hudební symbol, u dveří je to nástroj k odemkání.",
    },
  },
];
