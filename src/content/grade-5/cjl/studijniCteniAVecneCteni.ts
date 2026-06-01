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
    question: "Co je studijní čtení?",
    correctAnswer: "pomalé, pozorné čtení s podtrháváním a poznámkami pro učení",
    options: [
      "rychlé čtení románu pro zábavu",
      "pomalé, pozorné čtení s podtrháváním a poznámkami pro učení",
      "vyhledávání jedné informace v textu",
      "čtení nahlas pro ostatní",
    ],
    hints: ["Studijní = učím se z textu – pomalu, podtrhávám, dělám poznámky."],
  },
  {
    question: "Co je věcné čtení?",
    correctAnswer: "čtení zaměřené na vyhledání konkrétní informace",
    options: [
      "čtení celé knihy od začátku do konce",
      "čtení zaměřené na vyhledání konkrétní informace",
      "čtení pro zábavu",
      "čtení nahlas",
    ],
    hints: ["Věcné = praktické vyhledávání – podívám se do jízdního řádu."],
  },
  {
    question: "Ve které situaci použijeme studijní čtení?",
    correctAnswer: "při přípravě na test z dějepisu",
    options: [
      "při hledání čísla autobusu v jízdním řádu",
      "při čtení horoskopu",
      "při přípravě na test z dějepisu",
      "při prohlížení letáku",
    ],
    hints: ["Studijní = do paměti. Učení do školy = studijní čtení."],
  },
  {
    question: "Ve které situaci použijeme věcné čtení?",
    correctAnswer: "při hledání otevírací doby knihovny v textu",
    options: [
      "při přípravě na zkoušku",
      "při hledání otevírací doby knihovny v textu",
      "při čtení románu pro pobavení",
      "při studiu encyklopedie",
    ],
    hints: ["Věcné = jdu rovnou k informaci, zbytek přeskočím."],
  },
  {
    question: "Co jsou poznámky při studijním čtení?",
    correctAnswer: "zápis klíčových myšlenek pro lepší zapamatování",
    options: [
      "zdůraznění hezkých vět",
      "zápis klíčových myšlenek pro lepší zapamatování",
      "kopírování celého textu",
      "záleží na délce",
    ],
    hints: ["Poznámky = shrnutí klíčových bodů vlastními slovy."],
  },
  {
    question: "Proč je při studijním čtení důležité dělat si poznámky?",
    correctAnswer: "pomáhají zapamatovat a pochopit obsah textu",
    options: [
      "jen kvůli délce textu",
      "pomáhají zapamatovat a pochopit obsah textu",
      "záleží jen na autorovi",
      "poznámky nejsou potřebné",
    ],
    hints: ["Poznámky = aktivní zpracování textu = lepší zapamatování."],
  },
  {
    question: "Co je přehledové čtení (skimming)?",
    correctAnswer: "rychlé přehlédnutí textu pro získání celkového obrazu",
    options: [
      "pomalé studijní čtení",
      "rychlé přehlédnutí textu pro získání celkového obrazu",
      "vyhledávání jedné informace",
      "čtení nahlas",
    ],
    hints: ["Skimming = rychle přelétnout oči přes text – co je o čem?"],
  },
  {
    question: "Co je vyhledávací čtení (scanning)?",
    correctAnswer: "rychlé prohledání textu pro nalezení konkrétní informace",
    options: [
      "pomalé čtení celého textu",
      "rychlé prohledání textu pro nalezení konkrétní informace",
      "čtení pro zábavu",
      "studijní čtení",
    ],
    hints: ["Scanning = skenování. Hledám konkrétní slovo nebo číslo."],
  },
  {
    question: "Při věcném čtení jízdního řádu hledám spoj v 14:30. Co udělám?",
    correctAnswer: "prohledám časy a najdu spoj nejbližší 14:30",
    options: [
      "přečtu celý jízdní řád od začátku",
      "prohledám časy a najdu spoj nejbližší 14:30",
      "zavolám informacím",
      "přečtu jen první stránku",
    ],
    hints: ["Věcné čtení = cíleně hledám konkrétní informaci."],
  },
  {
    question: "Jaký typ čtení zvolím při přípravě referátu o Egyptě?",
    correctAnswer: "studijní čtení s poznámkami a podtrhováním",
    options: [
      "věcné čtení pro jednu informaci",
      "studijní čtení s poznámkami a podtrhováním",
      "čtení pro zábavu",
      "přehledové přehlédnutí",
    ],
    hints: ["Referát = musím pochopit a zapamatovat hodně = studijní čtení."],
  },
  {
    question: "Jak se liší studijní a věcné čtení v rychlosti?",
    correctAnswer: "studijní je pomalejší, věcné může být rychlejší – jen hledám",
    options: [
      "věcné je vždy pomalejší",
      "studijní je pomalejší, věcné může být rychlejší (jen hledám)",
      "oboje je stejně rychlé",
      "záleží na délce textu",
    ],
    hints: ["Studijní = důkladně. Věcné = cíleně vyhledávám."],
  },
  {
    question: "Při hledání receptu na koláč z webu – jaký typ čtení zvolím?",
    correctAnswer: "věcné čtení – hledám konkrétní ingredience a kroky",
    options: [
      "studijní čtení s poznámkami",
      "věcné čtení – hledám konkrétní ingredience a kroky",
      "přehledové čtení celého webu",
      "čtení nahlas",
    ],
    hints: ["Recept = konkrétní informace → věcné čtení."],
  },
  {
    question: "Jak podtrháváme při studijním čtení?",
    correctAnswer: "podtrhujeme klíčové pojmy, definice a důležitá fakta",
    options: [
      "podtrhujeme každou větu",
      "podtrhujeme klíčové pojmy, definice a důležitá fakta",
      "nepodtrhujeme nic",
      "záleží na barvě",
    ],
    hints: ["Podtrhujeme jen to nejpodstatnější – ne celý text."],
  },
  {
    question: "Proč je věcné čtení efektivní pro konkrétní úkoly?",
    correctAnswer: "nepotřebuji číst vše – jdu přímo k hledané informaci",
    options: [
      "protože je delší",
      "nepotřebuji číst vše – jdu přímo k hledané informaci",
      "záleží jen na textu",
      "protože je pomalejší",
    ],
    hints: ["Věcné čtení šetří čas – nepotřebuji přečíst celý text."],
  },
  {
    question: "Jaký typ čtení použiji, když potřebuji pochopit nový pojem ze slovníku?",
    correctAnswer: "věcné čtení – hledám definici pojmu",
    options: [
      "studijní čtení celého slovníku",
      "věcné čtení – hledám definici pojmu",
      "čtení pro zábavu",
      "záleží na délce definice",
    ],
    hints: ["Slovník = vyhledávám konkrétní informaci = věcné čtení."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Chci se naučit ze článku o fotosyntéze na test. Jaký postup zvolím?",
    correctAnswer: "studijní čtení: přečtu pomalu, podtrhám klíčové pojmy, udělám si výpisky",
    options: [
      "přehlédnu rychle nadpisy",
      "studijní čtení: přečtu pomalu, podtrhám klíčové pojmy, udělám si výpisky",
      "přečtu jen první větu každého odstavce",
      "záleží na délce článku",
    ],
    hints: ["Test = musím to znát = studijní čtení s poznámkami."],
  },
  {
    question: "Hledám, ve které kapitole učebnice je téma 'zlomky'. Jak postupuji?",
    correctAnswer: "podívám se do obsahu – rejstříku a vyhledám stránku – věcné čtení",
    options: [
      "přečtu celou učebnici",
      "podívám se do obsahu (rejstříku) a vyhledám stránku – věcné čtení",
      "zeptám se kamaráda",
      "záleží na předmětu",
    ],
    hints: ["Obsah učebnice = rychlé vyhledání → věcné čtení."],
  },
  {
    question: "Jaký je účel opakovaného čtení při studiu?",
    correctAnswer: "upevnění a lepší zapamatování informací",
    options: [
      "jen kvůli délce textu",
      "upevnění a lepší zapamatování informací",
      "záleží jen na textu",
      "opakované čtení není potřebné",
    ],
    hints: ["Čím vícekrát přečteme, tím lépe si zapamatujeme."],
  },
  {
    question: "Jakou techniku studijního čtení použiješ při čtení obtížného textu?",
    correctAnswer: "přečtu odstavec, zastavím se, shrnu ho vlastními slovy",
    options: [
      "přečtu jen nadpisy",
      "přečtu odstavec, zastavím se, shrnu ho vlastními slovy",
      "přečtu text jednou rychle",
      "záleží jen na textu",
    ],
    hints: ["Technika: čtu po částech a shrnu – porozumím lépe."],
  },
  {
    question: "Proč se při studijním čtení doporučuje přerušovat čtení a zamýšlet se?",
    correctAnswer: "aktivní zpracování textu = lepší porozumění a zapamatování",
    options: [
      "kvůli únavě",
      "aktivní zpracování textu = lepší porozumění a zapamatování",
      "záleží na délce textu",
      "přerušení je zbytečné",
    ],
    hints: ["Stop and think = aktivní čtenář lépe porozumí a zapamatuje."],
  },
  {
    question: "Jaký typ čtení je nejefektivnější, když v textu hledám konkrétní jméno osoby?",
    correctAnswer: "scanning – vyhledávací čtení – přelétu očima a hledám jméno",
    options: [
      "studijní čtení celého textu",
      "scanning (vyhledávací čtení) – přelétu očima a hledám jméno",
      "čtení nahlas",
      "záleží na délce textu",
    ],
    hints: ["Jméno osoby = specifický cíl → scanning."],
  },
  {
    question: "Co jsou výpisky a jak pomáhají při studijním čtení?",
    correctAnswer: "stručný zápis klíčových informací – pomáhají při opakování a zapamatování",
    options: [
      "kopírování celého textu",
      "stručný zápis klíčových informací – pomáhají při opakování a zapamatování",
      "záleží jen na délce",
      "výpisky nejsou potřebné",
    ],
    hints: ["Výpisky = vlastní zkratky a klíčové body. Usnadňují opakování."],
  },
  {
    question: "Při hledání informace v encyklopedii – jaký typ čtení?",
    correctAnswer: "věcné čtení – použiju rejstřík a najdu konkrétní heslo",
    options: [
      "studijní čtení celé encyklopedie",
      "věcné čtení – použiju rejstřík a najdu konkrétní heslo",
      "přehledové čtení",
      "záleží na tématu",
    ],
    hints: ["Encyklopedie = vyhledávám konkrétní informaci = věcné čtení."],
  },
  {
    question: "Co je SQ3R metoda studijního čtení?",
    correctAnswer: "Survey – přehled – Question – otázky – Read – čtení – Recite – shrnutí – Review – opakování",
    options: [
      "rychlé čtení bez zastavení",
      "Survey (přehled) – Question (otázky) – Read (čtení) – Recite (shrnutí) – Review (opakování)",
      "jen čtení a poznámky",
      "záleží na textu",
    ],
    hints: ["SQ3R = systematická technika studijního čtení."],
  },
  {
    question: "Jaký typ čtení použiješ při prohlížení webové stránky a hledáš telefon?",
    correctAnswer: "věcné čtení – hledám telefonní číslo jako konkrétní informaci",
    options: [
      "studijní čtení celé stránky",
      "věcné čtení – hledám telefonní číslo jako konkrétní informaci",
      "přehledové čtení celého webu",
      "záleží na webu",
    ],
    hints: ["Telefonní číslo = konkrétní informace → věcné čtení."],
  },
  {
    question: "Co je myšlenková mapa a jak pomáhá při studijním čtení?",
    correctAnswer: "grafické zobrazení vztahů mezi pojmy – pomáhá porozumět struktuře",
    options: [
      "náčrtek obrázků",
      "grafické zobrazení vztahů mezi pojmy – pomáhá porozumět struktuře",
      "seznam všech slov textu",
      "záleží na předmětu",
    ],
    hints: ["Myšlenková mapa = vizuální přehled textu → pomáhá pochopit i zapamatovat."],
  },
  {
    question: "Proč se doporučuje nejprve přehlédnout nadpisy a podnadpisy (skimming) před studijním čtením?",
    correctAnswer: "abychom měli přehled o struktuře textu ještě před podrobným čtením",
    options: [
      "záleží jen na délce",
      "abychom měli přehled o struktuře textu ještě před podrobným čtením",
      "nadpisy nás netlačí",
      "záleží jen na autorovi",
    ],
    hints: ["Přehled struktury = snazší orientace při podrobném čtení."],
  },
  {
    question: "Jaký typ čtení zvolíme, když chceme posoudit, zda je text pro nás užitečný?",
    correctAnswer: "přehledové čtení – skimming – rychle posoudím, o čem text je",
    options: [
      "studijní čtení celého textu",
      "přehledové čtení (skimming) – rychle posoudím, o čem text je",
      "věcné čtení",
      "záleží na tématu",
    ],
    hints: ["Skimming = rychlý přehled = zjistím, zda text stojí za podrobnější čtení."],
  },
  {
    question: "Jaký typ čtení zvolíš pro zábavný román před spaním?",
    correctAnswer: "čtení pro zábavu / estetické čtení – bez aktivního studia",
    options: [
      "studijní čtení s poznámkami",
      "věcné čtení",
      "čtení pro zábavu / estetické čtení – bez aktivního studia",
      "záleží na délce románu",
    ],
    hints: ["Zábavné čtení = relaxace. Nepotřebuji studovat."],
  },
  {
    question: "Jakou roli hraje kontext při věcném čtení?",
    correctAnswer: "pomáhá nám najít relevantní část textu rychleji",
    options: [
      "kontext je bezvýznamný",
      "pomáhá nám najít relevantní část textu rychleji",
      "kontext vždy zpomalí čtení",
      "záleží na délce",
    ],
    hints: ["Kontextové vodítka (nadpisy, klíčová slova) pomáhají při vyhledávání."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je kritické čtení a jak se liší od studijního?",
    correctAnswer: "kritické = hodnotíme věrohodnost a argumenty; studijní = učíme se obsah",
    options: [
      "jsou totéž",
      "kritické = hodnotíme věrohodnost a argumenty; studijní = učíme se obsah",
      "kritické je vždy kratší",
      "záleží na tématu",
    ],
    hints: ["Kritické čtení = kladu si otázku: Je to pravda? Má to logiku?"],
  },
  {
    question: "Co je předčtení (preview) v kontextu studijního čtení?",
    correctAnswer: "přehled nadpisů, grafů a shrnutí před podrobným čtením",
    options: [
      "jen přečtení první věty",
      "přehled nadpisů, grafů a shrnutí před podrobným čtením",
      "přečtení posledního odstavce",
      "záleží na textu",
    ],
    hints: ["Předčtení = rychlý přehled struktury před studiem."],
  },
  {
    question: "Jak se liší věcné čtení od selektivního čtení?",
    correctAnswer: "věcné = hledám konkrétní informaci; selektivní = přeskakuji části, čtu jen vybrané",
    options: [
      "jsou totéž",
      "věcné = hledám konkrétní informaci; selektivní = přeskakuji části, čtu jen vybrané",
      "selektivní je vždy delší",
      "záleží jen na textu",
    ],
    hints: ["Věcné = specifická informace. Selektivní = vybírám části textu."],
  },
  {
    question: "Proč je důležité vybrat správný typ čtení pro konkrétní situaci?",
    correctAnswer: "efektivita – různé cíle vyžadují různé strategie čtení",
    options: [
      "záleží jen na délce textu",
      "efektivita – různé cíle vyžadují různé strategie čtení",
      "typ čtení nehraje roli",
      "záleží jen na adresátovi",
    ],
    hints: ["Správná strategie = správný výsledek. Studijní čtení pro zábavný román = neefektivní."],
  },
  {
    question: "Jak zpětná vazba (revize) po studijním čtení pomáhá učení?",
    correctAnswer: "ověří porozumění a odhalí mezery v vědomostech",
    options: [
      "jen prodlužuje studium",
      "ověří porozumění a odhalí mezery v vědomostech",
      "záleží jen na textu",
      "revize není potřebná",
    ],
    hints: ["Zpětná vazba = zopakuješ → víš, co znáš a co ne."],
  },
  {
    question: "Co je aktivní čtení?",
    correctAnswer: "čtení s plným soustředěním, kladením otázek a děláním poznámek",
    options: [
      "čtení nahlas",
      "čtení s plným soustředěním, kladením otázek a děláním poznámek",
      "rychlé přehlédnutí",
      "záleží na délce textu",
    ],
    hints: ["Aktivní = zapojený čtenář. Ptá se, podtrhává, přemýšlí."],
  },
  {
    question: "Jak se liší čtení primárního a sekundárního textu?",
    correctAnswer: "primární = originální zdroj; sekundární = komentář nebo analýza primárního",
    options: [
      "jsou totéž",
      "primární = originální zdroj; sekundární = komentář nebo analýza primárního",
      "sekundární je vždy kratší",
      "záleží na tématu",
    ],
    hints: ["Primární = román. Sekundární = recenze románu."],
  },
  {
    question: "Proč je důležité u věcného textu hledět na datum vydání?",
    correctAnswer: "starší informace mohou být zastaralé a nepravdivé",
    options: [
      "datum nehraje roli",
      "starší informace mohou být zastaralé a nepravdivé",
      "záleží jen na autorovi",
      "datum je jen formalita",
    ],
    hints: ["Věda, statistiky, geografie se mění. Starý text = stará data."],
  },
  {
    question: "Co je anotace při studijním čtení?",
    correctAnswer: "psaní poznámek přímo do textu nebo na okraje",
    options: [
      "kopírování textu",
      "psaní poznámek přímo do textu nebo na okraje",
      "přeložení textu",
      "záleží na délce",
    ],
    hints: ["Anotace = marginální poznámky. Pomáhají při opakování."],
  },
  {
    question: "Jaký typ čtení použijeme při studiu historického dokumentu pro diplomovou práci?",
    correctAnswer: "studijní a kritické čtení – hluboké porozumění i hodnocení věrohodnosti",
    options: [
      "věcné čtení pro jednu informaci",
      "studijní a kritické čtení – hluboké porozumění i hodnocení věrohodnosti",
      "přehledové čtení",
      "čtení pro zábavu",
    ],
    hints: ["Akademický text = hluboké studium + kritické hodnocení."],
  },
  {
    question: "Jak se liší čtení vzorku (sampling) od přehledového čtení?",
    correctAnswer: "vzorkování = přečteme náhodné části; přehledové = systematicky procházíme celý text",
    options: [
      "jsou totéž",
      "vzorkování = přečteme náhodné části; přehledové = systematicky procházíme celý text",
      "vzorkování je vždy pomalejší",
      "záleží na délce",
    ],
    hints: ["Vzorkování = náhodně. Skimming = systematicky celý text."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const STUDIJNICTENIAVECNECTENI: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-studijni-cteni-a-vecne-cteni",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-studijni-cteni-a-vecne-cteni",
    title: "Studijní čtení a věcné čtení",
    studentTitle: "Jak číst texty",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení a naslouchání",
    briefDescription: "Naučíš se číst studijně i věcně – pro různé účely.",
    keywords: ["studijní čtení", "věcné čtení", "skimming", "scanning", "poznámky", "výpisky"],
    goals: [
      "Rozlišit studijní a věcné čtení",
      "Vybrat správný typ čtení pro situaci",
      "Použít techniky efektivního čtení (podtrhávání, výpisky)",
    ],
    boundaries: [
      "Bez pokročilé teorie čtenářských strategií",
      "Neprobíráme akademické citace",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Studijní čtení = pomalu, podtrhávám, dělám poznámky – učím se. Věcné čtení = hledám konkrétní informaci, přeskočím zbytek.",
      steps: [
        "Zjisti, proč čteš – co potřebuješ vědět nebo najít.",
        "Učíš se? → studijní čtení (pomalu, poznámky).",
        "Hledáš konkrétní info? → věcné čtení (cíleně, rychleji).",
        "Chceš přehled? → skimming (prohlédni nadpisy).",
      ],
      commonMistake: "Žáci čtou vždy stejně – vždy studijně nebo vždy rychle. Správný typ čtení závisí na cíli.",
      example: "Příprava na test z dějepisu = studijní čtení. Hledání jízdního řádu = věcné čtení.",
    },
  },
];
