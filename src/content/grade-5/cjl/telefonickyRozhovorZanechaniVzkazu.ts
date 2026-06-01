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
    question: "Jak správně začneme telefonický hovor?",
    correctAnswer: "Představíme se a uvedeme, kdo voláme",
    options: [
      "Rovnou řekneme, co chceme",
      "Představíme se a uvedeme, kdo voláme",
      "Počkáme, až nás přepojí",
      "Řekneme jen číslo telefonu",
    ],
    hints: ["Dobrý den, tady Jan Novák, volám k panu Svobodovi."],
  },
  {
    question: "Co musí zanechaný vzkaz obsahovat?",
    correctAnswer: "kdo volal, kdy, proč a co má příjemce udělat",
    options: [
      "jen jméno volajícího",
      "jen čas hovoru",
      "kdo volal, kdy, proč a co má příjemce udělat",
      "jen telefonní číslo",
    ],
    hints: ["Kompletní vzkaz: kdo, kdy, proč, co se má stát."],
  },
  {
    question: "Jak správně ukončíme telefonický hovor?",
    correctAnswer: "pozdravíme a počkáme, než druhá strana zavěsí",
    options: [
      "prostě přestaneme mluvit",
      "pozdravíme a počkáme, než druhá strana zavěsí",
      "jen řekneme 'cau'",
      "zavěsíme bez rozloučení",
    ],
    hints: ["Na shledanou / Hezký den – zdvořilé ukončení hovoru."],
  },
  {
    question: "Jaký tón používáme při telefonickém hovoru s úřadem?",
    correctAnswer: "formální a zdvořilý",
    options: [
      "přátelský a uvolněný",
      "formální a zdvořilý",
      "stručný bez pozdravu",
      "rychlý a neklidný",
    ],
    hints: ["S úřadem = vždy formálně, jako v písemném styku."],
  },
  {
    question: "Proč je důležité zanechat vzkaz, když volaný není dostupný?",
    correctAnswer: "aby věděl, kdo volal a co potřebuje",
    options: [
      "záleží jen na nás",
      "aby věděl, kdo volal a co potřebuje",
      "vzkaz není nutný",
      "jen kvůli zdvořilosti",
    ],
    hints: ["Vzkaz = informace pro nepřítomného, aby mohl reagovat."],
  },
  {
    question: "Jak začneme vzkaz na záznamník?",
    correctAnswer: "Dobrý den, tady [jméno], volám v [čas]...",
    options: [
      "Hej, jsem to já.",
      "Dobrý den, tady [jméno], volám v [čas]...",
      "Jen rychle...",
      "Kde jste?",
    ],
    hints: ["Na záznamník = stejně jako živý rozhovor: představit se a uvést věc."],
  },
  {
    question: "Jaký je rozdíl mezi telefonátem příteli a telefonátem do nemocnice?",
    correctAnswer: "příteli = neformálně; do nemocnice = formálně, zdvořile",
    options: [
      "jsou totéž",
      "příteli = neformálně; do nemocnice = formálně, zdvořile",
      "do nemocnice se netelefon",
      "záleží na čase volání",
    ],
    hints: ["Formálnost závisí na adresátovi – instituce = formální."],
  },
  {
    question: "Co uděláme, pokud jsme zavolali na špatné číslo?",
    correctAnswer: "omluvíme se a zavěsíme",
    options: [
      "bez omluvy zavěsíme",
      "pokračujeme v rozhovoru",
      "omluvíme se a zavěsíme",
      "zeptáme se na pravé číslo",
    ],
    hints: ["Omluva = slušnost. Omlouvám se, mýlil/a jsem se číslem."],
  },
  {
    question: "Co uděláme, pokud nás volá neznámé číslo?",
    correctAnswer: "Dobrý den, kdo volá? / Kdo je to prosím?",
    options: [
      "Okamžitě zavěsíme",
      "Dobrý den, kdo volá? / Kdo je to prosím?",
      "Hned sdělíme svoji adresu",
      "Telefonát přijmeme mlčky",
    ],
    hints: ["Zdvořilá otázka na totožnost volajícího je přirozená."],
  },
  {
    question: "Co nezapomene sdělit vzkaz, který zanecháváme?",
    correctAnswer: "kontakt – číslo nebo e-mail pro zpětné volání",
    options: [
      "jen jméno",
      "kontakt – číslo nebo e-mail pro zpětné volání",
      "jen čas hovoru",
      "jméno svého psa",
    ],
    hints: ["Vzkaz bez kontaktu = příjemce nemůže zavolat zpět."],
  },
  {
    question: "Jak se představíme na začátku formálního telefonátu?",
    correctAnswer: "Dobrý den, jmenuji se [jméno], volám ohledně...",
    options: [
      "Čau, jsem Honza.",
      "Dobrý den, jmenuji se [jméno], volám ohledně...",
      "Víte, kdo jsem?",
      "Hej!",
    ],
    hints: ["Formální: celé jméno + předmět hovoru."],
  },
  {
    question: "Kdy je vhodné zavolat? (etikett telefonování)",
    correctAnswer: "v pracovní dobu nebo v čas, kdy víme, že je adresát dostupný",
    options: [
      "kdykoli, i v noci",
      "v pracovní dobu nebo v čas, kdy víme, že je adresát dostupný",
      "jen ráno před 8:00",
      "záleží jen na nás",
    ],
    hints: ["Zdvořilost: nezvolit nevhodný čas (noc, pozdě večer)."],
  },
  {
    question: "Co je hlasová schránka (záznamník)?",
    correctAnswer: "automatické zařízení, které zaznamenává vzkaz, když není dovolán/a",
    options: [
      "telefonní seznam",
      "automatické zařízení, které zaznamenává vzkaz, když není dovolán/a",
      "způsob přepojení hovoru",
      "druh telefonu",
    ],
    hints: ["Záznamník = necháme vzkaz, když volaný nezvedne."],
  },
  {
    question: "Jak říkáme, že chceme být přepojeni?",
    correctAnswer: "Mohl/a byste mě prosím přepojit na...?",
    options: [
      "Přepoj mě!",
      "Mohl/a byste mě prosím přepojit na...?",
      "Dej mi dalšího.",
      "Chci jiné číslo.",
    ],
    hints: ["Zdvořilá prosba o přepojení = formální styl."],
  },
  {
    question: "Jaké informace zapíšeme do písemného vzkazu (telefon pro kolegu)?",
    correctAnswer: "jméno volajícího, čas hovoru, obsah vzkazu, kontakt",
    options: [
      "jen jméno",
      "jen čas",
      "jméno volajícího, čas hovoru, obsah vzkazu, kontakt",
      "jen obsah vzkazu",
    ],
    hints: ["Kompletní vzkaz: kdo + kdy + proč + zpětný kontakt."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Vzkaz zanechaný pro rodiče by měl znít:",
    correctAnswer: "Volala paní Nováková, volala dnes v 10:00, žádá o zpětné zavolání na 123 456 789.",
    options: [
      "Někdo volal.",
      "Volala paní Nováková, volala dnes v 10:00, žádá o zpětné zavolání na 123 456 789.",
      "Máme vzkaz.",
      "Zavolej.",
    ],
    hints: ["Kompletní vzkaz: kdo + kdy + co chce + kontakt."],
  },
  {
    question: "Telefonuješ do knihovny. Jak se správně zeptáš na otevírací dobu?",
    correctAnswer: "Dobrý den, chtěl/a jsem se zeptat, jaká je vaše otevírací doba.",
    options: [
      "Kdy máte otevřeno? – bez pozdravu",
      "Dobrý den, chtěl/a jsem se zeptat, jaká je vaše otevírací doba.",
      "Máte otevřeno?",
      "Hej, časy?",
    ],
    hints: ["Formální otázka = pozdrav + zdvořilá formulace + konkrétní dotaz."],
  },
  {
    question: "Telefonní konverzace. Co řeknete jako první po pozdravu?",
    correctAnswer: "kdo jste a proč voláte",
    options: [
      "rovnou výhodu volání",
      "kdo jste a proč voláte",
      "záleží na situaci",
      "nic – čekáte",
    ],
    hints: ["Po pozdravu: jméno + předmět hovoru."],
  },
  {
    question: "Při telefonátu špatně slyšíte. Co řeknete?",
    correctAnswer: "Promiňte, mohl/a byste to zopakovat? Špatně slyším.",
    options: [
      "Nic, jen přikyvujete",
      "Promiňte, mohl/a byste to zopakovat? Špatně slyším.",
      "Zavěsíte",
      "Křičíte hlasitěji",
    ],
    hints: ["Zdvořilá žádost o opakování = normální součást hovoru."],
  },
  {
    question: "Při zanechání vzkazu na záznamník – co nezapomeň říct jako první?",
    correctAnswer: "jméno a čas volání",
    options: [
      "jen důvod hovoru",
      "jméno a čas volání",
      "jen kontakt",
      "pozdrav bez jména",
    ],
    hints: ["Na záznamník: kdo jsem + kdy volám + pak obsah."],
  },
  {
    question: "Jak přirozené ukončení rozhovoru zní?",
    correctAnswer: "Na shledanou. Hezký den. / Hezký zbytek dne.",
    options: [
      "Ciao.",
      "Na shledanou. Hezký den. / Hezký zbytek dne.",
      "Baj.",
      "Tak teda.",
    ],
    hints: ["Zdvořilé ukončení = přání + rozloučení."],
  },
  {
    question: "Proč si zapíšeme vzkaz hned po hovoru?",
    correctAnswer: "abychom nezapomněli podrobnosti, které je třeba předat",
    options: [
      "proto, že je to zákon",
      "abychom nezapomněli podrobnosti, které je třeba předat",
      "záleží na situaci",
      "není nutné zapisovat",
    ],
    hints: ["Paměť selže – písemný vzkaz je spolehlivý."],
  },
  {
    question: "Jak dlouhý by měl být vzkaz na záznamníku?",
    correctAnswer: "stručný a srozumitelný – jen podstatné informace",
    options: [
      "co nejdelší",
      "stručný a srozumitelný – jen podstatné informace",
      "záleží na situaci",
      "neměl by být vůbec",
    ],
    hints: ["Záznamník = kratší formát. Podstatné bez zbytečností."],
  },
  {
    question: "Při formálním telefonátu nikdy neřekneme:",
    correctAnswer: "čau, nechme to, hele, fakt?",
    options: [
      "Dobrý den",
      "Chtěl/a jsem se zeptat",
      "čau, nechme to, hele, fakt?",
      "Na shledanou",
    ],
    hints: ["Formální hovor = bez slangu a hovorových výrazů."],
  },
  {
    question: "Pokud nejste jistí, zda jste správně porozuměli, co uděláte?",
    correctAnswer: "Zopakujete, co jste slyšeli: 'Takže vy říkáte, že...'",
    options: [
      "Nic, předpokládáte správnost",
      "Zopakujete, co jste slyšeli: 'Takže vy říkáte, že...'",
      "Zavěsíte a zavoláte znovu",
      "Ptáte se jiné osoby",
    ],
    hints: ["Parafrázování = ověření porozumění."],
  },
  {
    question: "Co je SMS vzkaz v porovnání s telefonním vzkazem?",
    correctAnswer: "textová forma bez zvuku – přesto musí obsahovat klíčové info",
    options: [
      "je vždy lepší než telefonní vzkaz",
      "textová forma bez zvuku – přesto musí obsahovat klíčové info",
      "SMS není vzkaz",
      "záleží na operátorovi",
    ],
    hints: ["SMS = psaný vzkaz, ale obsah je stejný – kdo, co, kontakt."],
  },
  {
    question: "Jak je vhodné telefonovat v situaci, kdy jste ve veřejné dopravě?",
    correctAnswer: "stručně a tlumeně, bez hlasitých detailů; lépe odmítnout a zavolat zpět",
    options: [
      "normálně hlasitě",
      "stručně a tlumeně, bez hlasitých detailů; lépe odmítnout a zavolat zpět",
      "záleží na vlaku",
      "přidat sluchátka",
    ],
    hints: ["Společenská etika: v MHD nemluvíme hlasitě o soukromých věcech."],
  },
  {
    question: "Co je dobrým zvykem před formálním telefonátem?",
    correctAnswer: "připravit si klíčové body, co chceme říct",
    options: [
      "telefonovat bez přípravy",
      "připravit si klíčové body, co chceme říct",
      "mít u sebe jiného člověka",
      "volat vždy z domu",
    ],
    hints: ["Příprava = přehledný hovor, nepřeřekneme se ani nic nezapomeneme."],
  },
  {
    question: "Jak napíšeme vzkaz, pokud nevíme přesně, co kdo chtěl?",
    correctAnswer: "napíšeme co víme a přidáme prosbu o zpětné zavolání",
    options: [
      "napíšeme vše, co si myslíme",
      "napíšeme co víme a přidáme prosbu o zpětné zavolání",
      "nevzkazujeme nic",
      "napíšeme jen čas hovoru",
    ],
    hints: ["Neúplný vzkaz + prosba o kontakt = lepší než žádný vzkaz."],
  },
  {
    question: "Jak říkáme telefonnímu číslu, které si ověřujeme?",
    correctAnswer: "Mohl/a byste mi potvrdit vaše číslo? Nebo: Zapisuji si: 123...",
    options: [
      "Které číslo jste?",
      "Mohl/a byste mi potvrdit vaše číslo? Nebo: Zapisuji si: 123...",
      "Číslo?",
      "Dejte mi číslo.",
    ],
    hints: ["Ověření čísla = zdvořilá prosba + opakování číslic."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jak správně zahájit hovor s lékařem?",
    correctAnswer: "Dobrý den, jmenuji se [jméno], rád/a bych si objednal/a termín.",
    options: [
      "Ahoj, potřebuju k doktorovi.",
      "Dobrý den, jmenuji se [jméno], rád/a bych si objednal/a termín.",
      "Máte místo?",
      "Hej, potřebuju pomoc.",
    ],
    hints: ["Lékař = formální instituce → formální styl + představení."],
  },
  {
    question: "Jak se omluvit, když voláme v nevhodnou dobu?",
    correctAnswer: "Omlouvám se, že volám v tuto dobu. Mohl/a bych vás obtěžovat na chvilku?",
    options: [
      "Promiňte a rovnou mluvíme",
      "Omlouvám se, že volám v tuto dobu. Mohl/a bych vás obtěžovat na chvilku?",
      "Nezmiňujeme dobu",
      "Zavěsíme bez omluvy",
    ],
    hints: ["Omluva za nevhodný čas = výraz slušnosti."],
  },
  {
    question: "Jak správně zapíšeme vzkaz pro rodiče z informační schůzky?",
    correctAnswer: "Datum + kdo volal + čas + zpráva + kontakt pro zpětné zavolání",
    options: [
      "jen jméno školy",
      "Datum + kdo volal + čas + zpráva + kontakt pro zpětné zavolání",
      "jen datum schůzky",
      "jen telefonní číslo",
    ],
    hints: ["Kompletní vzkaz o schůzce = všechny potřebné informace."],
  },
  {
    question: "Jaká je etiketa při přijetí pracovního telefonátu od neznámé firmy?",
    correctAnswer: "Dobrý den, zde firma X / jméno. Co pro vás mohu udělat?",
    options: [
      "Kdo jste?",
      "Dobrý den, zde firma X / jméno. Co pro vás mohu udělat?",
      "Halo?",
      "Počkejte.",
    ],
    hints: ["Přijetí pracovního hovoru: vlastní identifikace + nabídka pomoci."],
  },
  {
    question: "Při hovoru na nouzové číslo (112, 158) – co řekneme nejprve?",
    correctAnswer: "kde se nacházíme + co se stalo + počet postižených",
    options: [
      "naše jméno",
      "kde se nacházíme + co se stalo + počet postižených",
      "telefonní číslo",
      "datum a čas",
    ],
    hints: ["Tísňové číslo: nejdůležitější je poloha a situace."],
  },
  {
    question: "Jak správně formulovat zanechaný vzkaz v 50 slovech?",
    correctAnswer: "Dobrý den, tady Jana Nováková. Volám dnes ve 14:00. Prosím, zavolejte mi zpět na číslo 777 123 456 kvůli schůzce příští úterý. Děkuji.",
    options: [
      "Čau, jsem Jana.",
      "Dobrý den, tady Jana Nováková. Volám dnes ve 14:00. Prosím, zavolejte mi zpět na číslo 777 123 456 kvůli schůzce příští úterý. Děkuji.",
      "Volejte mi zpět.",
      "Schůzka je v úterý.",
    ],
    hints: ["Vzorový vzkaz: kdo + kdy + proč + kontakt + zdvořilostní závěr."],
  },
  {
    question: "Proč je důležité mluvit pomalu a jasně při telefonátu?",
    correctAnswer: "aby nám druhý rozuměl a mohl si zapsat důležité informace",
    options: [
      "jen kvůli zdvořilosti",
      "aby nám druhý rozuměl a mohl si zapsat důležité informace",
      "záleží jen na signálu",
      "rychlejší hovor je lepší",
    ],
    hints: ["Srozumitelnost = základ každé komunikace, zejména telefonické."],
  },
  {
    question: "Co uděláme při hovoru, kde chceme být velmi přesní (číslo, adresa)?",
    correctAnswer: "zopakujeme důležité údaje a požádáme o potvrzení správnosti",
    options: [
      "jen jednou sdělíme údaje",
      "zopakujeme důležité údaje a požádáme o potvrzení správnosti",
      "pošleme e-mail místo telefonátu",
      "záleží na situaci",
    ],
    hints: ["Přesnost: opakování + potvrzení = méně chyb."],
  },
  {
    question: "Jak řekneme, že budeme muset hovor přerušit?",
    correctAnswer: "Promiňte, musím hovor přerušit. Mohu vás zavolat zpět?",
    options: [
      "Musím jít. Nashle.",
      "Promiňte, musím hovor přerušit. Mohu vás zavolat zpět?",
      "Zavěsíme bez omluvy.",
      "Pokračujeme bez upozornění.",
    ],
    hints: ["Přerušení hovoru = vždy s omluvou a nabídkou zpětného kontaktu."],
  },
  {
    question: "Co je 'call back'?",
    correctAnswer: "zpětné zavolání – voláme osobě, která nám zanechala vzkaz",
    options: [
      "typ záznamníku",
      "zpětné zavolání – voláme osobě, která nám zanechala vzkaz",
      "přepojení hovoru",
      "zkratka telefonního čísla",
    ],
    hints: ["Call back = zavolat zpět po přijetí vzkazu."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const TELEFONICKYROZHOVORZANECHANIVZKAZU: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-telefonicky-rozhovor-zanechani-vzkazu",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-telefonicky-rozhovor-zanechani-vzkazu",
    title: "Telefonický rozhovor, zanechání vzkazu",
    studentTitle: "Telefonování a vzkazy",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se správně telefonovat a zanechat vzkaz.",
    keywords: ["telefonování", "vzkaz", "hovor", "formální komunikace", "záznamník"],
    goals: [
      "Správně zahájit a ukončit telefonický hovor",
      "Zanechat kompletní a srozumitelný vzkaz",
      "Rozlišit formální a neformální telefonát",
    ],
    boundaries: [
      "Neprobíráme technické aspekty telefonování",
      "Bez složité analýzy komunikačních stylů",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Formální telefonát: Dobrý den, jmenuji se... Volám ohledně... Kompletní vzkaz: kdo volal + kdy + proč + kontakt pro zpětné zavolání.",
      steps: [
        "Začni: Dobrý den + představení.",
        "Uveď předmět hovoru.",
        "Mluv jasně a pomalu.",
        "Při zanechání vzkazu: kdo + kdy + proč + kontakt.",
        "Zakonči: Na shledanou / Hezký den.",
      ],
      commonMistake: "Žáci zapomenou zanechat kontakt pro zpětné zavolání nebo nesdělí čas hovoru.",
      example: "Dobrý den, tady Tomáš Novák, volám ve 14 hodin kvůli dohodnuté schůzce. Prosím, zavolejte mi zpět na 777 000 000.",
    },
  },
];
