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
    question: "Kdo byl Karel IV.?",
    correctAnswer: "Český král a císař Svaté říše římské — nazývaný Otec vlasti",
    options: [
      "Český král a císař Svaté říše římské — nazývaný Otec vlasti",
      "Přemyslovský kníže",
      "Husitský vojevůdce",
      "Habsburský císař",
    ],
    hints: ["Karel IV. byl nejmocnějším panovníkem Evropy ve 14. stol."],
    solutionSteps: ["Karel IV. (1316–1378) byl českým králem od roku 1347 a císařem Svaté říše římské od roku 1355."],
  },
  {
    question: "Jak se říká Karlu IV.?",
    correctAnswer: "Otec vlasti",
    options: ["Otec vlasti", "Král zlatý a železný", "Lev severu", "Velký Karel"],
    hints: ["Tato přezdívka vyjadřuje, co pro Čechy znamenal."],
    solutionSteps: ["Karel IV. se nazývá 'Otec vlasti' (Pater Patriae) pro své dílo — Praha a ČR mu vděčí za nejvíce."],
  },
  {
    question: "Co Karel IV. založil v Praze v roce 1348?",
    correctAnswer: "Karlovu univerzitu — první univerzitu ve střední Evropě",
    options: [
      "Karlovu univerzitu — první univerzitu ve střední Evropě",
      "Karlův most",
      "Karlštejn",
      "Nové Město pražské",
    ],
    hints: ["1348 je rok, kdy Karel IV. podepsal zakládací listinu."],
    solutionSteps: ["Karel IV. roku 1348 založil Karlovu univerzitu — první univerzitu ve střední Evropě."],
  },
  {
    question: "Jak se jmenuje most přes Vltavu, který dal postavit Karel IV.?",
    correctAnswer: "Karlův most",
    options: ["Karlův most", "Palacký most", "Nuselský most", "Nusle most"],
    hints: ["Tento most stojí v Praze od roku 1357."],
    solutionSteps: ["Karel IV. nechal roku 1357 zahájit stavbu Karlova mostu — dnes nejznámějšího mostu v Praze."],
  },
  {
    question: "Jak se jmenuje hrad, kde Karel IV. uchovával korunní klenoty?",
    correctAnswer: "Karlštejn",
    options: ["Karlštejn", "Hradčany", "Křivoklát", "Kokořín"],
    hints: ["Hrad nese Karlovo jméno."],
    solutionSteps: ["Karlštejn je hrad jihozápadně od Prahy, kde Karel IV. uchovával korunní klenoty a svaté ostatky."],
  },
  {
    question: "Co je to Zlatá bula Karla IV. z roku 1356?",
    correctAnswer: "Zákon o volbě německého císaře — určoval, kdo a jak ho volí",
    options: [
      "Zákon o volbě německého císaře — určoval, kdo a jak ho volí",
      "Zákon o zakládání měst",
      "Privilegium pro české šlechtice",
      "Smlouva o míru s Polskem",
    ],
    hints: ["Zlatá bula = pečetí pečetěný dokument."],
    solutionSteps: ["Zlatá bula (1356) určila pravidla volby císaře — stanovila sedm kurfiřtů (volitelů) včetně českého krále."],
  },
  {
    question: "Kdo byl otec Karla IV.?",
    correctAnswer: "Jan Lucemburský",
    options: ["Jan Lucemburský", "Přemysl Otakar II.", "Václav II.", "Rudolf Habsburský"],
    hints: ["Otec Karla IV. byl první Lucemburk na českém trůnu."],
    solutionSteps: ["Otcem Karla IV. byl Jan Lucemburský — první lucemburský král v Čechách (1310–1346)."],
  },
  {
    question: "Kde padl Jan Lucemburský?",
    correctAnswer: "V bitvě u Kresčaku (1346) ve Francii",
    options: [
      "V bitvě u Kresčaku (1346) ve Francii",
      "V bitvě na Moravském poli",
      "V husitských válkách",
      "V bitvě u Lipan",
    ],
    hints: ["Jan bojoval za Francii, přestože byl slepý."],
    solutionSteps: ["Jan Lucemburský padl v bitvě u Kresčaku 1346 ve Francii — na straně Francie, ačkoli byl slepý."],
  },
  {
    question: "Jak se nazývá část Prahy, kterou nechal Karel IV. postavit roku 1348?",
    correctAnswer: "Nové Město pražské",
    options: ["Nové Město pražské", "Malá Strana", "Hradčany", "Vinohrady"],
    hints: ["Karel IV. chtěl Praha rozšířit — vznikla nová část."],
    solutionSteps: ["Karel IV. roku 1348 založil Nové Město pražské — Praha se tak stala jedním z největších měst v Evropě."],
  },
  {
    question: "Co se začalo stavět v Praze za Karla IV. a stojí na Hradčanech dodnes?",
    correctAnswer: "Katedrála sv. Víta",
    options: ["Katedrála sv. Víta", "Karlův most", "Staroměstská radnice", "Žofín"],
    hints: ["Tato katedrála je na Pražském hradě."],
    solutionSteps: ["Karel IV. zahájil stavbu gotické katedrály sv. Víta na Pražském hradě — dokončena až v 20. stol."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Kdy byl Karel IV. korunován českým králem?",
    correctAnswer: "V roce 1347",
    options: ["V roce 1347", "V roce 1316", "V roce 1356", "V roce 1378"],
    hints: ["Karel IV. se narodil 1316 — korunován byl jako dospělý."],
    solutionSteps: ["Karel IV. byl korunován českým králem roku 1347, císařem o 8 let později (1355)."],
  },
  {
    question: "Kdy byl Karel IV. korunován císařem Svaté říše římské?",
    correctAnswer: "V roce 1355",
    options: ["V roce 1355", "V roce 1347", "V roce 1316", "V roce 1378"],
    hints: ["Korunovace proběhla v Římě."],
    solutionSteps: ["Karel IV. byl korunován v Římě roku 1355 — stal se tak nejmocnějším panovníkem Evropy."],
  },
  {
    question: "Proč Karel IV. zavedl vinařství v Čechách?",
    correctAnswer: "Chtěl, aby Čechy produkovaly vlastní víno — přivedl révu vinnou z jihu",
    options: [
      "Chtěl, aby Čechy produkovaly vlastní víno — přivedl révu vinnou z jihu",
      "Bylo to nařízeno papežem",
      "Víno bylo součástí jeho daňové politiky",
      "Víno bylo potřeba pro mše",
    ],
    hints: ["Karel IV. přivedl vinohrady z Burgundska."],
    solutionSteps: ["Karel IV. přivedl révu vinnou z Burgundska a nařídil její pěstování na jižních svazích v Čechách."],
  },
  {
    question: "Proč je Karlova univerzita historicky tak výjimečná?",
    correctAnswer: "Je to nejstarší univerzita ve střední Evropě, první v zemích Koruny české",
    options: [
      "Je to nejstarší univerzita ve střední Evropě, první v zemích Koruny české",
      "Je to největší univerzita na světě",
      "Jako první přijímala ženy",
      "Jako první učila v češtině",
    ],
    hints: ["Před rokem 1348 museli Češi studovat v zahraničí."],
    solutionSteps: ["Karlova univerzita (1348) = první ve střední Evropě → Češi nemuseli cestovat do Paříže nebo Oxfordu."],
  },
  {
    question: "Jak ovlivnila zlatá bula (1356) postavení českého krále v Říši?",
    correctAnswer: "Český král se stal jedním ze sedmi kurfiřtů — volil císaře, posílilo to jeho prestiž",
    options: [
      "Český král se stal jedním ze sedmi kurfiřtů — volil císaře, posílilo to jeho prestiž",
      "Český král se stal podřízeným císaři",
      "Zlatá bula snížila moc českého krále",
      "Zlatá bula neměla vliv na postavení Čech",
    ],
    hints: ["Kurfiřt = volič (říšský volitel) — volil německého krále/císaře."],
    solutionSteps: ["Zlatá bula zařadila českého krále mezi 7 kurfiřtů — vyvolených volitelů císaře, což zvýšilo jeho prestiž."],
  },
  {
    question: "Proč se Jan Lucemburský nazýval 'král cizinec'?",
    correctAnswer: "Byl francouzský šlechtic, mluvil francouzsky, bojoval v cizích zemích a Čechy znal málo",
    options: [
      "Byl francouzský šlechtic, mluvil francouzsky, bojoval v cizích zemích a Čechy znal málo",
      "Přišel z Asie",
      "Byl cizinec, protože neznal latinu",
      "Byl nazýván cizincem pro svou krutost",
    ],
    hints: ["Jan Lucemburský trávil méně času v Čechách než v zahraničí."],
    solutionSteps: ["Jan Lucemburský byl lucemburský šlechtic — v Čechách trávil málo času, raději bojoval v zahraničí jako rytíř."],
  },
  {
    question: "V jakém stylu je Karlův most postaven?",
    correctAnswer: "Gotickém",
    options: ["Gotickém", "Románském", "Barokním", "Renesančním"],
    hints: ["Gotika = středověký styl s lomenými oblouky a věžemi."],
    solutionSteps: ["Karlův most je gotická stavba — lomené oblouky, štíhlé věže, stavěn od roku 1357."],
  },
  {
    question: "Proč nechal Karel IV. stavět Karlštejn?",
    correctAnswer: "Jako bezpečný úschov korunních klenotů a císařských ostatků",
    options: [
      "Jako bezpečný úschov korunních klenotů a císařských ostatků",
      "Jako sídlo pro svou rodinu",
      "Jako vojenskou pevnost",
      "Jako klášter pro mnichy",
    ],
    hints: ["Karlštejn byl klíčový trezor Karla IV."],
    solutionSteps: ["Karlštejn byl postaven jako bezpečný sklad korunních klenotů a ostatků světců — symbol imperiální moci."],
  },
  {
    question: "Kolik let žil Karel IV.?",
    correctAnswer: "62 let (1316–1378)",
    options: ["62 let (1316–1378)", "45 let", "78 let", "55 let"],
    hints: ["Karel IV. se narodil roku 1316 a zemřel roku 1378."],
    solutionSteps: ["Karel IV. žil 62 let — narozen 1316, zemřel 1378 v Praze."],
  },
  {
    question: "Jakou roli hrála Praha za Karla IV. v Evropě?",
    correctAnswer: "Stala se jedním z největších měst Evropy — sídelní město císaře",
    options: [
      "Stala se jedním z největších měst Evropy — sídelní město císaře",
      "Praha byla druhořadé provinční město",
      "Praha nebyla centrem Karlovy říše",
      "Praha měla za Karla IV. jen 5 000 obyvatel",
    ],
    hints: ["Císař sídlil v Praze — co to znamenalo?"],
    solutionSteps: ["Za Karla IV. byla Praha sídlem císaře celé Svaté říše římské — jedno z největších a nejkrásnějších měst Evropy."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Proč je Karel IV. považován za 'Otce vlasti'?",
    correctAnswer: "Budoval infrastrukturu, vzdělání (univerzita), Prahu a přinesl Čechám prestiž v Evropě",
    options: [
      "Budoval infrastrukturu, vzdělání (univerzita), Prahu a přinesl Čechám prestiž v Evropě",
      "Byl to nejdéle vládnoucí panovník",
      "Porazil největší nepřátele Čech",
      "Zavedl demokracii",
    ],
    hints: ["Otec vlasti = ten, kdo nejvíce přispěl k rozvoji země."],
    solutionSteps: ["Karel IV. postavil Prahu jako centrum Evropy, zvýšil vzdělanost (univerzita), dal zákon pro Říši (Zlatá bula) a přinesl Čechám prosperitu."],
  },
  {
    question: "Jak Karel IV. využil svou roli císaře pro prospěch Čech?",
    correctAnswer: "Praha se stala sídelním městem císaře — přitáhla umělce, obchodníky a vzdelanost",
    options: [
      "Praha se stala sídelním místem císaře — přitáhla umělce, obchodníky a vzdelanost",
      "Přesunul hlavní město Říma do Prahy",
      "Podřídil celou Říši českému parlamentu",
      "Umožnil Čechám vystoupit z Říše",
    ],
    hints: ["Kde sídlí panovník, tam se soustředí moc a kultura."],
    solutionSteps: ["Praha jako sídlo císaře přitáhla umělce, architekty, učence — kulturní a hospodářský rozmach."],
  },
  {
    question: "Jak Zlatá bula 1356 ovlivnila politiku Evropy v pozdějším středověku?",
    correctAnswer: "Stabilizovala volbu císaře na staletí — předešla bojům o trůn",
    options: [
      "Stabilizovala volbu císaře na staletí — předešla bojům o trůn",
      "Způsobila rozpad Svaté říše",
      "Vedla k válkám o nástupnictví",
      "Měla vliv jen na Čechy",
    ],
    hints: ["Pravidla volby = méně konfliktů o moc."],
    solutionSteps: ["Zlatá bula (1356) jasně určila pravidla volby císaře — zabránila sporům o trůn v Říši po staletí."],
  },
  {
    question: "Jak Karel IV. přispěl k rozvoji gotické architektury v Čechách?",
    correctAnswer: "Přivedl architekty z Francie a Německa — katedrála sv. Víta, Karlův most, Karlštejn",
    options: [
      "Přivedl architekty z Francie a Německa — katedrála sv. Víta, Karlův most, Karlštejn",
      "Sám nakreslil plány staveb",
      "Gotika přišla do Čech ještě před Karlem IV.",
      "Karel IV. preferoval románský styl",
    ],
    hints: ["Karel IV. pozval Matyáše z Arrasu a Petra Parléře."],
    solutionSteps: ["Karel IV. pozval Matyáše z Arrasu a Petra Parléře — přinesli gotiku z Francie a Německa do Čech (katedrála sv. Víta)."],
  },
  {
    question: "Proč Jan Lucemburský padl u Kresčaku, přestože byl slepý?",
    correctAnswer: "Byl oddaný rytíř — z rytířské cti odmítl zůstat vzadu a nechal se svázat s ostatními rytíři",
    options: [
      "Byl oddaný rytíř — z rytířské cti odmítl zůstat vzadu a nechal se svázat s ostatními rytíři",
      "Byl nevědomky vtažen do bitvy",
      "Sloužil jako výzvědčík za anglické vojsko",
      "Padl neúmyslně — zaměňen za nepřítele",
    ],
    hints: ["Rytířská čest = vstoupit do bitvy bez ohledu na nebezpečí."],
    solutionSteps: ["Jan Lucemburský byl slepý, ale dál si rytířsky vzal účast v bitvě — nechal se svázat s rytíři, aby padl vprostřed boje."],
  },
  {
    question: "Jak Karel IV. chránil a rozvíjel českou identitu v rámci Říma?",
    correctAnswer: "Prosadil češtinu v listinách, budoval kultu sv. Václava a Wenceslasovou kapli na Hradě",
    options: [
      "Prosadil češtinu v listinách, budoval kultu sv. Václava a Wenceslasovou kapli na Hradě",
      "Zakázal latina v Čechách",
      "Nahradil českou kulturu německou",
      "Karel IV. nebyl Čech a nestaral se o českou identitu",
    ],
    hints: ["Karel IV. byl hluboce česky orientovaný panovník — napsal česky."],
    solutionSteps: ["Karel IV. psal česky, podporoval kult sv. Václava a posílil pražský arcibiskupský stolec — základ české identity."],
  },
  {
    question: "Proč byl Karlův most na místě dnešního Karlova mostu výhodnou polohou?",
    correctAnswer: "Nejužší místo Vltavy ve středu Prahy — nejkratší přechod pro obchod i vojska",
    options: [
      "Nejužší místo Vltavy ve středu Prahy — nejkratší přechod pro obchod i vojska",
      "Voda je tu nejplitnější",
      "Bylo to nejkrásnější místo v Praze",
      "Tam byl dřevěný most z doby Přemyslovců",
    ],
    hints: ["Most spojoval Staré a Malé Město — klíčové obchodní centrum."],
    solutionSteps: ["Místo Karlova mostu bylo nejkratší přechod Vltavy v centru Prahy — ideální pro obchod, správu a obranu."],
  },
  {
    question: "Jaký vliv měla Karlova univerzita na vzdělanost v Čechách?",
    correctAnswer: "Umožnila vzdělání doma — vznik vzdělaných vrstev, úředníků a kněží bez nutnosti cestovat",
    options: [
      "Umožnila vzdělání doma — vznik vzdělaných vrstev, úředníků a kněží bez nutnosti cestovat",
      "Vzdělanost klesla, protože přišli cizinci",
      "Univerzita sloužila jen německé šlechtě",
      "Vzdělanost neměla vliv na vývoj Čech",
    ],
    hints: ["Před 1348 museli Češi studovat v Paříži nebo Vídni."],
    solutionSteps: ["Karlova univerzita umožnila Čechům vzdělání doma → vznik české vzdělanecké vrstvy → základ pro husitské hnutí a reformaci."],
  },
  {
    question: "Co se v Čechách změnilo po Karlově smrti v roce 1378?",
    correctAnswer: "Nástupce Václav IV. byl slabý — vzrostly náboženské spory vedoucí k husitství",
    options: [
      "Nástupce Václav IV. byl slabý — vzrostly náboženské spory vedoucí k husitství",
      "Čechy znovu prosperovaly za Václava IV.",
      "Habsburkové okamžitě přebrali moc",
      "Čechy se staly součástí Polska",
    ],
    hints: ["Smrt Karla IV. předcházela éru Jana Husa."],
    solutionSteps: ["Po Karlově smrti převzal moc slabý Václav IV. — hospodářský a náboženský krize → Jan Hus → husitské války."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const count = level === 3 ? Math.min(pool.length, 45) : Math.min(pool.length, 30);
  return shuffle(pool).slice(0, count);
}

export const LUCEMBURKOVEKARELIVAJEHODOBA: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-lucemburkove-karel-iv-a-jeho-doba",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-lucemburkove-karel-iv-a-jeho-doba",
    title: "Lucemburkové - Karel IV. a jeho doba",
    studentTitle: "Karel IV.",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš Karla IV. — Otce vlasti, co postavil a proč je tak slavný.",
    keywords: ["Karel IV.", "Lucemburkové", "Otec vlasti", "Karlova univerzita", "Karlův most", "Karlštejn", "1348"],
    goals: [
      "Znát přezdívku a přínos Karla IV.",
      "Vyjmenovat stavby a díla Karla IV.",
      "Vědět, kdy a co Karel IV. budoval",
      "Pochopit roli Zlaté buly",
    ],
    boundaries: ["Detailní genealogie Lucemburků není vyžadována", "Politika Říma do hloubky není cílem"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Karel IV. = Otec vlasti. 1348: Karlova univerzita + Nové Město pražské. 1357: Karlův most. 1356: Zlatá bula.",
      steps: [
        "Karel IV. 1316–1378 = Otec vlasti",
        "1347 = král český, 1355 = císař Říše",
        "Díla: univerzita (1348), Nové Město (1348), Karlův most (1357), Karlštejn",
        "Otec = Jan Lucemburský (padl u Kresčaku 1346)",
      ],
      commonMistake: "Žáci si pletou rok 1348 (univerzita) s rokem 1357 (Karlův most) — pamatuj: 1348 = univerzita.",
      example: "Karel IV.: Otec vlasti, česky krále 1347, císař 1355, Karlova univ. 1348, Karlův most 1357.",
    },
  },
];
