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
    question: "V jakých letech vládla Marie Terezie?",
    correctAnswer: "1740–1780",
    options: ["1740–1780", "1780–1790", "1700–1740", "1526–1620"],
    hints: ["Nastoupila na trůn roku 1740."],
    solutionSteps: ["Marie Terezie vládla 40 let: 1740–1780."],
  },
  {
    question: "Co Marie Terezie zavedla jako jednu ze svých největších reforem?",
    correctAnswer: "Povinnou školní docházku",
    options: ["Povinnou školní docházku", "Zrušení daní", "Konec armády", "Svobodné volby"],
    hints: ["Šlo o vzdělání pro děti."],
    solutionSteps: ["Marie Terezie roku 1774 zavedla povinnou základní školní docházku."],
  },
  {
    question: "Kdo byl Josef II.?",
    correctAnswer: "Syn Marie Terezie, reformátorský panovník",
    options: [
      "Syn Marie Terezie, reformátorský panovník",
      "Otec Marie Terezie",
      "Habsburský vojevůdce",
      "Pruský král",
    ],
    hints: ["Vládl po matce Marii Terezii."],
    solutionSteps: ["Josef II. (1780–1790) byl synem Marie Terezie a pokračoval v reformách."],
  },
  {
    question: "Co Josef II. zrušil roku 1781?",
    correctAnswer: "Nevolnictví",
    options: ["Nevolnictví", "Armádu", "Školní docházku", "Parlament"],
    hints: ["Nevolník = rolník vázaný na půdu pána."],
    solutionSteps: ["Josefínský patent 1781 zrušil nevolnictví a dal rolníkům osobní svobodu."],
  },
  {
    question: "Jaký dokument vydal Josef II. v roce 1781 o náboženské svobodě?",
    correctAnswer: "Toleranční patent",
    options: ["Toleranční patent", "Zlatá bula", "Magna Charta", "Dekret kutnohorský"],
    hints: ["Tolerance = snášenlivost vůči jiné víře."],
    solutionSteps: ["Toleranční patent 1781 dovoloval protestantům a pravoslavným vyznávat svou víru."],
  },
  {
    question: "Které území vzalo Prusko Marii Terezii?",
    correctAnswer: "Slezsko",
    options: ["Slezsko", "Morava", "Uhry", "Tyrolsko"],
    hints: ["Fridrich II. Pruský vedl slezské války."],
    solutionSteps: ["Ve slezských válkách (1740–1748) ztratila Marie Terezie Slezsko ve prospěch Pruska."],
  },
  {
    question: "Co reformovala Marie Terezie v oblasti armády?",
    correctAnswer: "Zavedla pravidelnou armádu a vojenské akademie",
    options: [
      "Zavedla pravidelnou armádu a vojenské akademie",
      "Zrušila armádu",
      "Přijala do armády jen šlechtu",
      "Armádu přenechala Prusku",
    ],
    hints: ["Potřebovala silnou armádu po slezských válkách."],
    solutionSteps: ["Marie Terezie modernizovala armádu a roku 1752 založila Vojenskou akademii ve Vídeňském Novém Městě."],
  },
  {
    question: "V jakých letech vládl Josef II.?",
    correctAnswer: "1780–1790",
    options: ["1780–1790", "1740–1780", "1800–1820", "1750–1770"],
    hints: ["Nastoupil po matce Marii Terezii."],
    solutionSteps: ["Josef II. vládl deset let: 1780–1790."],
  },
  {
    question: "Co Josef II. udělal s kláštery, které se nevěnovaly vzdělání nebo péči o nemocné?",
    correctAnswer: "Zrušil je",
    options: ["Zrušil je", "Podpořil je", "Předal je jezuitům", "Přeměnil na paláce"],
    hints: ["Kláštery musely být 'užitečné' pro společnost."],
    solutionSteps: ["Josef II. zrušil tzv. 'kontemplativní' kláštery bez praktického užitku."],
  },
  {
    question: "Jak se nazývá pruský král, který bojoval s Marií Terezií o Slezsko?",
    correctAnswer: "Fridrich II.",
    options: ["Fridrich II.", "Napoleon", "Vilém I.", "Albrecht z Valdštejna"],
    hints: ["Přezdívalo se mu 'Fridrich Veliký'."],
    solutionSteps: ["Fridrich II. Veliký vedl ve slezských válkách Prusko proti Marii Terezii."],
  },
  {
    question: "Jaké státní orgány zreformovala Marie Terezie, aby lépe spravovala říši?",
    correctAnswer: "Centralizovala správu — zavedla ministerstva a byrokratický aparát",
    options: [
      "Centralizovala správu — zavedla ministerstva a byrokratický aparát",
      "Předala vládu šlechtě",
      "Zrušila všechny úřady",
      "Přenesla vládu do Prahy",
    ],
    hints: ["Centralizace = řízení z jednoho centra — Vídně."],
    solutionSteps: ["Marie Terezie zefektivnila státní správu centralizací a moderními úřednickými systémy."],
  },
  {
    question: "Proč se Marii Terezii říkalo 'matka vlasti'?",
    correctAnswer: "Pečovala o blaho poddaných a zavedla mnoho sociálních reforem",
    options: [
      "Pečovala o blaho poddaných a zavedla mnoho sociálních reforem",
      "Porodila 20 dětí",
      "Byla první ženou na trůně v celé historii",
      "Zrušila šlechtu",
    ],
    hints: ["Šlo o její reformy ve prospěch poddaných."],
    solutionSteps: ["Školství, zdravotnictví, správa — Marie Terezie se starala o říši jako matka o rodinu."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč Marie Terezie zavedla povinnou školní docházku?",
    correctAnswer: "Potřebovala vzdělané poddané pro efektivní stát a armádu",
    options: [
      "Potřebovala vzdělané poddané pro efektivní stát a armádu",
      "Chtěla potrestat šlechtu",
      "Školství ji nezajímalo — dělal to Josef",
      "Protože ji o to požádal papež",
    ],
    hints: ["Silný stát potřebuje vzdělané občany."],
    solutionSteps: ["Marie Terezie chápala vzdělání jako základ silného státu a moderní správy."],
  },
  {
    question: "Jak se lišily reformy Marie Terezie od reforem Josefa II.?",
    correctAnswer: "Josef šel dál — zrušil nevolnictví a zavedl náboženskou toleranci",
    options: [
      "Josef šel dál — zrušil nevolnictví a zavedl náboženskou toleranci",
      "Marie Terezie reformovala více než Josef",
      "Jejich reformy byly totožné",
      "Josef rušil reformy matky",
    ],
    hints: ["Josef byl radikálnější reformátor."],
    solutionSteps: ["Marie Terezie modernizovala stát; Josef II. šel dál — osobní svobody, tolerance, zrušení klášterů."],
  },
  {
    question: "Co znamenalo zrušení nevolnictví pro české rolníky?",
    correctAnswer: "Mohli se svobodně stěhovat, studovat a uzavírat smlouvy",
    options: [
      "Mohli se svobodně stěhovat, studovat a uzavírat smlouvy",
      "Přestali pracovat na polích",
      "Stali se šlechtou",
      "Dostali bezplatnou půdu",
    ],
    hints: ["Nevolník byl vázán na pánu půdu — bez jeho svolení nemohl odejít."],
    solutionSteps: ["Zrušení nevolnictví 1781 dalo rolníkům osobní svobodu, i když půdu stále nevlastnili."],
  },
  {
    question: "Proč Josefovy reformy narazily na odpor šlechty a církve?",
    correctAnswer: "Omezovaly jejich moc a majetek",
    options: [
      "Omezovaly jejich moc a majetek",
      "Přinášely jim příliš peněz",
      "Byly příliš pomalu prováděny",
      "Šlechta a církev je naopak podporovaly",
    ],
    hints: ["Kdo přišel o kláštery a privilegia, byl nespokojený."],
    solutionSteps: ["Rušení klášterů a omezení šlechtické moci over rolníky vedlo k silné opozici."],
  },
  {
    question: "Jak ztráta Slezska ovlivnila reformy Marie Terezie?",
    correctAnswer: "Přiměla ji modernizovat armádu a správu, aby příště obstála",
    options: [
      "Přiměla ji modernizovat armádu a správu, aby příště obstála",
      "Přestala reformovat a vzdala se",
      "Vedla ji k uzavření míru s Pruskem napořád",
      "Neměla žádný vliv",
    ],
    hints: ["Porážka bývá motivací ke změnám."],
    solutionSteps: ["Slezské války ukázaly slabiny habsburské armády a správy → Marie Terezie je reformovala."],
  },
  {
    question: "Proč Toleranční patent Josefa II. byl důležitý pro Čechy?",
    correctAnswer: "Dovoloval protestantům vyznávat víru, ukončoval pobělohorské náboženské pronásledování",
    options: [
      "Dovoloval protestantům vyznávat víru, ukončoval pobělohorské náboženské pronásledování",
      "Zaváděl islám jako státní náboženství",
      "Rušil všechna náboženství",
      "Byl jen pro Vídeň",
    ],
    hints: ["Po 150 letech od Bílé hory konečně náboženská svoboda."],
    solutionSteps: ["Toleranční patent 1781 umožnil vyznávání protestantství a pravoslaví vedle katolicismu."],
  },
  {
    question: "Co měly společného Marie Terezie a Josef II.?",
    correctAnswer: "Oba prováděli osvícenské reformy pro modernizaci státu",
    options: [
      "Oba prováděli osvícenské reformy pro modernizaci státu",
      "Oba válčili s Pruskem",
      "Oba zrušili šlechtu",
      "Oba odmítali reformy",
    ],
    hints: ["Osvícenství = víra v rozum a pokrok jako základ dobrého státu."],
    solutionSteps: ["Oba panovníci vycházeli z osvícenských idejí — stát má sloužit svým poddaným."],
  },
  {
    question: "Proč Josef II. rušil kláštery?",
    correctAnswer: "Chtěl přesunout jejich majetek ke vzdělání a péči o chudé",
    options: [
      "Chtěl přesunout jejich majetek ke vzdělání a péči o chudé",
      "Byl nepřítel náboženství",
      "Kláštery mu dlužily peníze",
      "Chtěl v klášterech ubytovat armádu",
    ],
    hints: ["Josefínské reformy se řídily praktickým užitkem."],
    solutionSteps: ["Josef zrušil přes 700 klášterů a jejich majetek použil na školství a nemocnice."],
  },
  {
    question: "Jak reformy Marie Terezie a Josefa II. ovlivnily každodenní život poddaných?",
    correctAnswer: "Děti mohly chodit do školy, rolníci získali svobodu pohybu",
    options: [
      "Děti mohly chodit do školy, rolníci získali svobodu pohybu",
      "Nic se nezměnilo",
      "Daně se zvýšily a svoboda zmizela",
      "Poddaní museli platit za reformy",
    ],
    hints: ["Povinná školní docházka + zrušení nevolnictví."],
    solutionSteps: ["Reformy přinesly poddaným vzdělání (1774) a osobní svobodu (1781)."],
  },
  {
    question: "Proč historici nazývají Josefa II. 'osvíceným absolutistou'?",
    correctAnswer: "Vládl autoritativně, ale prosazoval pokrokové osvícenské ideje",
    options: [
      "Vládl autoritativně, ale prosazoval pokrokové osvícenské ideje",
      "Byl demokraticky zvolený",
      "Odmítal jakékoli reformy",
      "Byl vzdělaný, ale krutý tyran",
    ],
    hints: ["Absolutismus = vládne sám; osvícenský = vedený rozumem."],
    solutionSteps: ["Josef II. kombinoval absolutní moc panovníka s osvícenskými ideály humanity a pokroku."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď reformy od nejdřívějšího zavedení po nejpozdější.",
    correctAnswer: "Správa →  Školní docházka → Zrušení nevolnictví → Toleranční patent",
    items: [
      "Reforma správy (Marie Terezie, 1749)",
      "Povinná školní docházka (Marie Terezie, 1774)",
      "Zrušení nevolnictví (Josef II., 1781)",
      "Toleranční patent (Josef II., 1781)",
    ],
    hints: ["Marie Terezie začala reformovat ve 40. letech 18. stol."],
    solutionSteps: ["1749 správa → 1774 školy → 1781 nevolnictví + tolerance."],
  },
  {
    question: "Spoj panovníka s jeho reformou.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "Marie Terezie", right: "Povinná školní docházka (1774)" },
      { left: "Josef II.", right: "Zrušení nevolnictví (1781)" },
      { left: "Josef II.", right: "Toleranční patent (1781)" },
      { left: "Marie Terezie", right: "Vojenská akademie (1752)" },
    ],
    hints: ["Josef byl radikálnější z obou."],
    solutionSteps: ["Marie Terezie: školy + armáda. Josef II.: nevolnictví + tolerance + kláštery."],
  },
  {
    question: "Josefovy reformy byly po jeho smrti z části zrušeny. Proč?",
    correctAnswer: "Šlechta a církev tlačily na zrušení reforem, které ohrožovaly jejich moc",
    options: [
      "Šlechta a církev tlačily na zrušení reforem, které ohrožovaly jejich moc",
      "Reformy byly příliš drahé pro stát",
      "Poddaní reformy odmítali",
      "Prusko si to vyžádalo mírovou smlouvou",
    ],
    hints: ["Kdo nejvíce ztratil Josefovými reformami?"],
    solutionSteps: ["Po Josefově smrti 1790 nástupce Leopold II. revokoval některé reformy pod tlakem aristokracie a kléru."],
  },
  {
    question: "Jak by ses rozhodl jako rolník po zrušení nevolnictví (1781)? Která odpověď nejlépe popisuje historickou situaci?",
    correctAnswer: "Mohl bych se přestěhovat do města a hledat práci, ale stále bych platil poplatky šlechtici",
    options: [
      "Mohl bych se přestěhovat do města a hledat práci, ale stále bych platil poplatky šlechtici",
      "Dostal bych zdarma půdu a byl bych bohatý",
      "Nic by se nezměnilo — nevolnictví trvalo dál",
      "Stal bych se automaticky šlechticem",
    ],
    hints: ["Osobní svoboda ≠ vlastnictví půdy."],
    solutionSteps: ["Zrušení nevolnictví dalo rolníkům svobodu pohybu, ale půda šlechtě zůstala."],
  },
  {
    question: "Proč jsou reformy Marie Terezie a Josefa II. důležité pro pochopení moderního státu?",
    correctAnswer: "Zavedli základy moderního školství, státní správy a osobních svobod",
    options: [
      "Zavedli základy moderního školství, státní správy a osobních svobod",
      "Neměly žádný vliv na moderní dobu",
      "Vrátili Čechy do středověku",
      "Připravili cestu pro komunismus",
    ],
    hints: ["Povinná škola, svoboda pohybu, tolerance — co z toho máme dnes?"],
    solutionSteps: ["Josefínsko-Terezianské reformy jsou základem moderního centralizovaného státu s právem na vzdělání."],
  },
  {
    question: "Který výrok je NEPRAVDIVÝ?",
    correctAnswer: "Marie Terezie zrušila nevolnictví roku 1774",
    options: [
      "Marie Terezie zrušila nevolnictví roku 1774",
      "Josef II. vydal Toleranční patent roku 1781",
      "Marie Terezie zavedla povinnou školní docházku roku 1774",
      "Josef II. zrušil nevolnictví roku 1781",
    ],
    hints: ["Nevolnictví zrušil Josef II., ne Marie Terezie."],
    solutionSteps: ["Nevolnictví zrušil Josef II. roku 1781, ne Marie Terezie — ta zavedla školní docházku."],
  },
  {
    question: "Srovnej: co bylo cílem reforem Marie Terezie a co cílem reforem Josefa II.?",
    correctAnswer: "MT: silnější stát a vzdělanější lid; JII: osobní svobody a náboženská tolerance",
    options: [
      "MT: silnější stát a vzdělanější lid; JII: osobní svobody a náboženská tolerance",
      "MT: náboženská svoboda; JII: vzdělání",
      "Oba měli stejné cíle bez rozdílu",
      "MT: nic nereformovala; JII: reformoval vše",
    ],
    hints: ["Marie Terezie se soustředila na správu a armádu, Josef na práva poddaných."],
    solutionSteps: ["Marie Terezie: efektivní stát (správa, školství, armáda). Josef: svoboda (tolerance, nevolnictví)."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const MARIETEREZIEJOSEFIIREFORMY: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-marie-terezie-josef-ii-reformy",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-marie-terezie-josef-ii-reformy",
    title: "Marie Terezie, Josef II., reformy",
    studentTitle: "Marie Terezie a Josef II.",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Novověk - habsburská monarchie",
    briefDescription: "Pochopíš reformy Marie Terezie a Josefa II.",
    keywords: ["marie terezie", "josef ii", "reformy", "nevolnictví", "toleranční patent", "školní docházka"],
    goals: [
      "Žák uvede hlavní reformy Marie Terezie a Josefa II.",
      "Žák vysvětlí dopad zrušení nevolnictví",
      "Žák porovná přístupy obou panovníků",
    ],
    boundaries: ["Detailní diplomatická jednání", "Válečná taktika slezských válek"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Pamatuj: Marie Terezie zavedla školy (1774), Josef II. zrušil nevolnictví (1781).",
      steps: [
        "Marie Terezie 1740–1780: školy, armáda, správa",
        "Josef II. 1780–1790: nevolnictví, tolerance, kláštery",
        "Oba = osvícenský absolutismus",
      ],
      commonMistake: "Zaměňování, kdo co zavedl — školy jsou Terezie, nevolnictví Josef.",
      example: "Toleranční patent 1781 dovolil protestantům v Čechách svobodně věřit.",
    },
  },
];
