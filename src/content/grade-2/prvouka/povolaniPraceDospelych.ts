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
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: přiřazení povolání k jedné jasné, přímé činnosti
//        (kdo hasí oheň, kdo peče chleba...) — izolovaný fakt.
//   L2 = aplikace: přiřazení nástroje, pomůcky nebo pracoviště
//        ke konkrétnímu povolání (čím, kde, co k tomu potřebuje).
//   L3 = transfer (2 kroky, přiměřeně věku 7-8 let): kombinace dvou
//        faktů o povolání zároveň, rozlišení blízkých/zaměnitelných
//        povolání (lékař vs. zubař vs. veterinář) a jednoduché scénáře
//        „na koho se obrátit, když…“.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Kdo hasí oheň?",
    correctAnswer: "Hasič",
    options: ["Hasič", "Pekař", "Učitel", "Prodavač"],
    emoji: "👨‍🚒",
    hints: ["Hašení ohně je nebezpečná práce — kdo na ni má speciální oblek a hadici?"],
    solutionSteps: ["Oheň hasí hasič — má speciální oblek, helmu a hadici s vodou."],
  },
  {
    question: "Kdo léčí lidi, když jsou nemocní?",
    correctAnswer: "Lékař",
    options: ["Řidič", "Lékař", "Kuchař", "Pošťák"],
    emoji: "👩‍⚕️",
    hints: ["Když jsme nemocní, jdeme se nechat vyšetřit — ke komu?"],
    solutionSteps: ["Lidi léčí lékař — vyšetřuje pacienty a předepisuje léky."],
  },
  {
    question: "Kdo učí děti ve škole číst a počítat?",
    correctAnswer: "Učitel",
    options: ["Hasič", "Pekař", "Učitel", "Zedník"],
    emoji: "👨‍🏫",
    hints: ["Ve škole nás někdo naučí číst, psát a počítat — kdo to je?"],
    solutionSteps: ["Děti učí učitel — ve škole nás naučí číst, psát, počítat a spoustu dalšího."],
  },
  {
    question: "Kdo peče chleba a rohlíky?",
    correctAnswer: "Pekař",
    options: ["Lékař", "Policista", "Kadeřník", "Pekař"],
    emoji: "🍞",
    hints: ["Chléb se peče v peci — kdo s tím pracuje?"],
    solutionSteps: ["Chléb a rohlíky peče pekař — vstává velmi brzy ráno, aby bylo pečivo čerstvé."],
  },
  {
    question: "Kdo vaří jídlo v restauraci nebo jídelně?",
    correctAnswer: "Kuchař",
    options: ["Kuchař", "Učitel", "Hasič", "Zemědělec"],
    emoji: "👨‍🍳",
    hints: ["V jídelně nebo restauraci někdo připravuje jídlo — kdo to je?"],
    solutionSteps: ["Jídlo vaří kuchař — v restauraci nebo jídelně připravuje pokrmy."],
  },
  {
    question: "Kdo řídí autobus a veze cestující?",
    correctAnswer: "Řidič",
    options: ["Pekař", "Řidič", "Lékař", "Zedník"],
    emoji: "🚌",
    hints: ["Autobus potřebuje někoho za volantem — kdo ho řídí?"],
    solutionSteps: ["Autobus řídí řidič — stará se o bezpečnou přepravu cestujících."],
  },
  {
    question: "Kdo chrání lidi a hlídá pořádek?",
    correctAnswer: "Policista",
    options: ["Kuchař", "Pekař", "Policista", "Herec"],
    emoji: "👮",
    hints: ["Bezpečnost lidí a dodržování pravidel zajišťuje..."],
    solutionSteps: ["Lidi chrání policista — hlídá pořádek a bezpečnost."],
  },
  {
    question: "Kdo roznáší dopisy a balíky do schránek?",
    correctAnswer: "Pošťák",
    options: ["Hasič", "Lékař", "Malíř", "Pošťák"],
    emoji: "📬",
    hints: ["Dopisy a balíky přicházejí do naší schránky — kdo je přinese?"],
    solutionSteps: ["Dopisy a balíky roznáší pošťák — chodí dům od domu a doručuje zásilky."],
  },
  {
    question: "Kdo léčí nemocná zvířata?",
    correctAnswer: "Veterinář",
    options: ["Veterinář", "Pekař", "Řidič", "Prodavač"],
    emoji: "🐕",
    hints: ["Zvířata nejdou k lékaři — kdo se o nemocná zvířata stará?"],
    solutionSteps: ["Zvířata léčí veterinář — je to „lékař pro zvířata“."],
  },
  {
    question: "Kdo stříhá lidem vlasy?",
    correctAnswer: "Kadeřník",
    options: ["Kuchař", "Kadeřník", "Učitel", "Zubař"],
    emoji: "💇",
    hints: ["Vlasy nám rostou a potřebujeme je stříhat — kdo to dělá?"],
    solutionSteps: ["Vlasy stříhá kadeřník — v kadeřnictví nám ostříhá nebo upraví účes."],
  },
  {
    question: "Kdo staví domy z cihel?",
    correctAnswer: "Zedník",
    options: ["Pekař", "Pošťák", "Zedník", "Malíř"],
    emoji: "🧱",
    hints: ["Domy jsou postavené z cihel a betonu — kdo je staví?"],
    solutionSteps: ["Domy staví zedník — skládá cihly a lije beton."],
  },
  {
    question: "Kdo opravuje porouchaná auta?",
    correctAnswer: "Mechanik",
    options: ["Lékař", "Učitel", "Zedník", "Mechanik"],
    emoji: "🔧",
    hints: ["Když auto porouchá a nejede, je potřeba ho opravit — kdo to umí?"],
    solutionSteps: ["Auta opravuje mechanik — v autoservisu zjistí závadu a opraví ji."],
  },
  {
    question: "Kdo pěstuje obilí a zeleninu na poli?",
    correctAnswer: "Zemědělec",
    options: ["Zemědělec", "Hasič", "Pekař", "Kuchař"],
    emoji: "🚜",
    hints: ["Pšenice, brambory nebo zelenina rostou na polích — kdo se o ně stará?"],
    solutionSteps: ["Obilí a zeleninu pěstuje zemědělec — obdělává pole a sklízí úrodu."],
  },
  {
    question: "Kdo prodává zboží v obchodě?",
    correctAnswer: "Prodavač",
    options: ["Hasič", "Prodavač", "Lékař", "Zedník"],
    emoji: "🏪",
    hints: ["V obchodě nám někdo pomáhá vybrat a zaplatit — kdo to je?"],
    solutionSteps: ["V obchodě prodává prodavač — pomáhá zákazníkům a přijímá platby."],
  },
  {
    question: "Kdo opravuje lidem zuby?",
    correctAnswer: "Zubař",
    options: ["Pekař", "Řidič", "Zubař", "Veterinář"],
    emoji: "🦷",
    hints: ["Kazy v zubech potřebují ošetření — ke komu jdeme?"],
    solutionSteps: ["Zuby opravuje zubař — ošetřuje kazy a stará se o zdraví zubů."],
  },
  {
    question: "Kdo hraje postavy v divadelním představení?",
    correctAnswer: "Herec",
    options: ["Pekař", "Řidič", "Malíř", "Herec"],
    emoji: "🎭",
    hints: ["V divadle lidé hrají různé role v příbězích — jak se jim říká?"],
    solutionSteps: ["V divadle hraje herec — učí se role a vystupuje před diváky."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Čím hasič hasí oheň?",
    correctAnswer: "Hadicí s vodou",
    options: ["Hadicí s vodou", "Vařečkou", "Štětcem", "Kladivem"],
    emoji: "🚒",
    hints: ["Mysli na to, co hasič drží v rukou, když stříká na oheň."],
    solutionSteps: ["Hasič hasí oheň hadicí s vodou — vodu čerpá z hasičského auta nebo hydrantu."],
  },
  {
    question: "Co má lékař na sobě, když vyšetřuje pacienty?",
    correctAnswer: "Bílý plášť",
    options: ["Hasičskou přilbu", "Bílý plášť", "Zástěru zedníka", "Uniformu policisty"],
    emoji: "👩‍⚕️",
    hints: ["Lékař nosí typický oděv, podle kterého ho v ordinaci hned poznáš."],
    solutionSteps: ["Lékař při vyšetřování nosí bílý plášť — je to jeho typický pracovní oděv."],
  },
  {
    question: "Kde pekař peče chléb a rohlíky?",
    correctAnswer: "V pekárně",
    options: ["V kuchyni restaurace", "V lékárně", "V pekárně", "Na poli"],
    emoji: "🍞",
    hints: ["Mysli na místo, kde jsou velké pece na pečivo a vůně čerstvého chleba."],
    solutionSteps: ["Pekař peče chléb a rohlíky v pekárně — tam má pece na pečivo."],
  },
  {
    question: "Jaké nástroje potřebuje kadeřník ke stříhání vlasů?",
    correctAnswer: "Nůžky a hřeben",
    options: ["Kladivo a hřebíky", "Vařečku a hrnec", "Štětec a barvy", "Nůžky a hřeben"],
    emoji: "💇",
    hints: ["Mysli na nástroje, kterými se dají vlasy zastřihnout a učesat."],
    solutionSteps: ["Kadeřník používá nůžky a hřeben — nůžkami stříhá, hřebenem vlasy upravuje."],
  },
  {
    question: "Co potřebuje zedník ke stavbě zdi?",
    correctAnswer: "Cihly a maltu",
    options: ["Cihly a maltu", "Mouku a droždí", "Prkna a hřebíky", "Barvy a štětce"],
    emoji: "🧱",
    hints: ["Zeď se skládá z kousků, které se k sobě slepí lepidlem na stavbu."],
    solutionSteps: ["Zedník ke stavbě zdi potřebuje cihly a maltu — maltou cihly k sobě slepuje."],
  },
  {
    question: "Čím si veterinář prohlíží nemocné zvíře?",
    correctAnswer: "Stetoskopem",
    options: ["Vařečkou", "Stetoskopem", "Kladivem", "Nůžkami na vlasy"],
    emoji: "🐕",
    hints: ["Tímto nástrojem se poslouchá tlukot srdce a dech — visí lékařům kolem krku."],
    solutionSteps: ["Veterinář si zvíře prohlíží stetoskopem — poslouchá jím srdce a dech."],
  },
  {
    question: "Co drží řidič v rukou, aby autobus jel správným směrem?",
    correctAnswer: "Volant",
    options: ["Kormidlo lodi", "Řídítka kola", "Volant", "Vařečku"],
    emoji: "🚌",
    hints: ["Tímto se v autě nebo autobuse otáčí doleva a doprava."],
    solutionSteps: ["Řidič drží volant — otáčením volantu určuje směr jízdy autobusu."],
  },
  {
    question: "Kam jdeš, když tě bolí zub?",
    correctAnswer: "K zubaři",
    options: ["K veterináři", "K pekaři", "K zedníkovi", "K zubaři"],
    emoji: "🦷",
    hints: ["Hledej povolání, které se stará přímo o zdraví zubů."],
    solutionSteps: ["Když bolí zub, jdeme k zubaři — prohlédne a ošetří zub."],
  },
  {
    question: "Co nosí policista, aby ho lidé na ulici poznali?",
    correctAnswer: "Uniformu",
    options: ["Uniformu", "Bílý plášť", "Zástěru", "Hasičskou helmu"],
    emoji: "👮",
    hints: ["Je to typický oděv se stejnou barvou a odznakem, který nosí všichni policisté."],
    solutionSteps: ["Policista nosí uniformu — podle ní ho lidé na ulici snadno poznají."],
  },
  {
    question: "Co pěstuje zemědělec na poli?",
    correctAnswer: "Obilí a zeleninu",
    options: ["Chleba a rohlíky", "Obilí a zeleninu", "Cihly a maltu", "Léky"],
    emoji: "🚜",
    hints: ["Mysli na to, co roste přímo na poli, ne na to, co se z toho později vyrábí."],
    solutionSteps: ["Zemědělec pěstuje na poli obilí a zeleninu — z obilí se pak mimo jiné peče chléb."],
  },
  {
    question: "Co dělá prodavač v obchodě?",
    correctAnswer: "Prodává zboží a vybírá peníze",
    options: ["Peče chleba a rohlíky", "Léčí nemocná zvířata", "Prodává zboží a vybírá peníze", "Staví domy a mosty"],
    emoji: "🏪",
    hints: ["Mysli na to, co dělá člověk za pokladnou, když si u něj něco kupuješ."],
    solutionSteps: ["Prodavač v obchodě prodává zboží zákazníkům a vybírá od nich peníze."],
  },
  {
    question: "Co doručuje pošťák do naší schránky?",
    correctAnswer: "Dopisy a balíky",
    options: ["Léky", "Chléb", "Cihly", "Dopisy a balíky"],
    emoji: "📬",
    hints: ["Mysli na to, co najdeš ve schránce u dveří domu."],
    solutionSteps: ["Pošťák doručuje do schránky dopisy a balíky."],
  },
  {
    question: "Co dělá kuchař v restauraci?",
    correctAnswer: "Vaří a připravuje jídlo",
    options: ["Vaří a připravuje jídlo", "Prodává potraviny", "Stříhá vlasy", "Opravuje auta"],
    emoji: "👨‍🍳",
    hints: ["Mysli na to, co se děje v kuchyni restaurace, než jídlo přijde na stůl."],
    solutionSteps: ["Kuchař v restauraci vaří a připravuje jídlo pro hosty."],
  },
  {
    question: "Čím opravuje mechanik porouchané auto?",
    correctAnswer: "Klíči a nářadím v autoservisu",
    options: ["Vařečkou v kuchyni", "Klíči a nářadím v autoservisu", "Nůžkami v kadeřnictví", "Štětcem v ateliéru"],
    emoji: "🔧",
    hints: ["Mysli na místo a nástroje, kterými se šroubuje a rozebírá motor."],
    solutionSteps: ["Mechanik opravuje auto klíči a dalším nářadím v autoservisu."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Kdo hasí oheň a k tomu nosí ochrannou helmu s hadicí?",
    correctAnswer: "Hasič",
    options: ["Zedník", "Policista", "Hasič", "Zahradník"],
    emoji: "👨‍🚒",
    hints: ["Hledej povolání, které má zároveň OBOJÍ — helmu i hadici na hašení ohně."],
    solutionSteps: [
      "Hasič nosí ochrannou helmu a používá hadici na hašení ohně zároveň. Zedník má sice helmu, ale ne hadici na hašení, a zahradník má hadici, ale jen na zalévání, ne helmu.",
    ],
  },
  {
    question: "Kdo staví domy a k tomu pracuje s cihlami a maltou?",
    correctAnswer: "Zedník",
    options: ["Malíř", "Mechanik", "Zemědělec", "Zedník"],
    emoji: "🧱",
    hints: ["Hledej povolání, které staví domy PŘÍMO z cihel slepených maltou."],
    solutionSteps: [
      "Zedník staví domy a k tomu používá cihly a maltu. Malíř domy jen maluje, cihly a maltu nepoužívá.",
    ],
  },
  {
    question: "Kdo opravuje porouchaná auta a k tomu pracuje v autoservisu s nářadím?",
    correctAnswer: "Mechanik",
    options: ["Mechanik", "Řidič", "Zedník", "Prodavač"],
    emoji: "🔧",
    hints: ["Řidič auto jen řídí — hledej toho, kdo ho i opravuje pomocí nářadí."],
    solutionSteps: [
      "Mechanik opravuje porouchaná auta a pracuje s nářadím v autoservisu. Řidič auto pouze řídí, ale neopravuje ho.",
    ],
  },
  {
    question: "Kdo peče chléb a k tomu pracuje brzy ráno v pekárně?",
    correctAnswer: "Pekař",
    options: ["Kuchař", "Pekař", "Prodavač", "Zemědělec"],
    emoji: "🍞",
    hints: ["Kuchař taky vaří jídlo, ale hledej toho, kdo peče PŘÍMO chléb v pekárně."],
    solutionSteps: [
      "Pekař peče chléb a pracuje brzy ráno v pekárně. Kuchař vaří jiná jídla, obvykle v restauraci nebo jídelně, ne chléb v pekárně.",
    ],
  },
  {
    question: "Kdo vaří jídlo a k tomu pracuje v kuchyni restaurace nebo jídelny?",
    correctAnswer: "Kuchař",
    options: ["Pekař", "Prodavač", "Kuchař", "Učitel"],
    emoji: "👨‍🍳",
    hints: ["Pekař taky něco připravuje, ale hledej toho, kdo vaří obědy v kuchyni."],
    solutionSteps: [
      "Kuchař vaří jídlo v kuchyni restaurace nebo jídelny. Pekař naproti tomu peče pečivo v pekárně.",
    ],
  },
  {
    question: "Kdo pěstuje obilí a k tomu sklízí úrodu na velkém poli?",
    correctAnswer: "Zemědělec",
    options: ["Pekař", "Kuchař", "Prodavač", "Zemědělec"],
    emoji: "🚜",
    hints: ["Pekař z obilí jen peče pečivo — hledej toho, kdo obilí PĚSTUJE přímo na poli."],
    solutionSteps: [
      "Zemědělec pěstuje obilí a na podzim ho sklízí na poli. Pekař obilí (respektive mouku z něj) pouze zpracovává v pekárně.",
    ],
  },
  {
    question: "Bolí tě bříško a máš horečku, ale zuby tě netrápí. Ke komu půjdeš?",
    correctAnswer: "K lékaři",
    options: ["K lékaři", "K zubaři", "K veterináři", "K zedníkovi"],
    emoji: "👩‍⚕️",
    hints: ["Bříško a horečka se týkají celého těla, ne jen zubů nebo zvířat."],
    solutionSteps: [
      "Když bolí bříško a je horečka, jde se k lékaři, který léčí celé tělo. Zubař se stará jen o zuby, veterinář léčí zvířata.",
    ],
  },
  {
    question: "Bolí tě zub, ale jinak jsi úplně zdravý. Ke komu půjdeš?",
    correctAnswer: "K zubaři",
    options: ["K lékaři", "K zubaři", "K veterináři", "K kadeřníkovi"],
    emoji: "🦷",
    hints: ["Hledej povolání, které se stará JEN o zuby, ne o celé tělo."],
    solutionSteps: [
      "Když bolí jen zub a jinak je člověk zdravý, jde se k zubaři. Lékař léčí celé tělo, ale na zuby chodíme k zubaři.",
    ],
  },
  {
    question: "Tvému psovi je špatně a navíc ho bolí zoubek. Ke komu ho zavezeš?",
    correctAnswer: "K veterináři",
    options: ["K zubaři", "K lékaři", "K veterináři", "K zahradníkovi"],
    emoji: "🐕",
    hints: ["Hledej povolání, které se stará o VŠECHNA zvířata, včetně jejich zoubků."],
    solutionSteps: [
      "Veterinář léčí zvířata včetně jejich zubů, proto se s nemocným pejskem jde k němu. Zubař ošetřuje jen lidské zuby, ne zvířecí.",
    ],
  },
  {
    question: "V domě začal hořet oheň! Koho zavoláš jako prvního?",
    correctAnswer: "Hasiče",
    options: ["Policistu", "Lékaře", "Pošťáka", "Hasiče"],
    emoji: "🚒",
    hints: ["Hledej povolání, které je vybavené přímo na hašení ohně."],
    solutionSteps: [
      "Při požáru voláme hasiče — jsou vybavení hadicemi a vozem na hašení ohně. Policista a lékař pomáhají při jiných druzích nebezpečí.",
    ],
  },
  {
    question: "Viděl jsi, jak někdo ukradl kolo. Na koho se obrátíš?",
    correctAnswer: "Na policistu",
    options: ["Na policistu", "Na hasiče", "Na lékaře", "Na zedníka"],
    emoji: "👮",
    hints: ["Krádež řeší povolání, které chrání lidi a jejich majetek, ne oheň nebo nemoci."],
    solutionSteps: [
      "Krádeže vyšetřuje policista. Hasič pomáhá při požárech a lékař léčí nemoci, s krádeží nepomohou.",
    ],
  },
  {
    question: "Kdo prodává zboží v obchodě a k tomu vybírá od zákazníků peníze?",
    correctAnswer: "Prodavač",
    options: ["Pošťák", "Prodavač", "Pekař", "Kuchař"],
    emoji: "🏪",
    hints: ["Pošťák taky přichází k lidem, ale hledej toho, kdo stojí PŘÍMO za pokladnou v obchodě."],
    solutionSteps: [
      "Prodavač v obchodě prodává zboží a vybírá peníze u pokladny. Pošťák naproti tomu doručuje zásilky, ale nic neprodává.",
    ],
  },
  {
    question: "Kdo doručuje dopisy a k tomu chodí s taškou od domu k domu?",
    correctAnswer: "Pošťák",
    options: ["Prodavač", "Hasič", "Pošťák", "Zemědělec"],
    emoji: "📬",
    hints: ["Prodavač zboží prodává v obchodě — hledej toho, kdo dopisy nosí přímo k lidem domů."],
    solutionSteps: [
      "Pošťák doručuje dopisy a balíky a chodí s taškou od domu k domu. Prodavač naopak čeká na zákazníky v obchodě.",
    ],
  },
  {
    question: "Kdo stříhá vlasy a k tomu pracuje s nůžkami a hřebenem v kadeřnictví?",
    correctAnswer: "Kadeřník",
    options: ["Zubař", "Lékař", "Malíř", "Kadeřník"],
    emoji: "💇",
    hints: ["Zubař taky používá nástroje u člověka, ale hledej toho, kdo pracuje s VLASY."],
    solutionSteps: [
      "Kadeřník stříhá vlasy nůžkami a upravuje je hřebenem v kadeřnictví. Zubař pracuje s nástroji u zubů, ne u vlasů.",
    ],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const POVOLANIPRACEDOSPELYCH: TopicMetadata[] = [
  {
    id: "g2-prv-povolani",
    rvpNodeId: "g2-prvouka-lide-kolem-nas-souziti-lidi-povolani-prace-dospelych",
    title: "Povolání a práce dospělých",
    studentTitle: "Čím budu?",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití lidí",
    briefDescription: "Poznáš různá povolání dospělých.",
    keywords: ["povolání", "práce", "hasič", "lékař", "učitel", "pekař"],
    goals: [
      "Poznat běžná povolání.",
      "Vědět, co kdo dělá.",
      "Vážit si práce dospělých.",
    ],
    boundaries: [
      "Pouze dobře známá povolání.",
      "Jen základní, obecně známé nástroje a pracoviště, žádné odborné podrobnosti.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Mysli na to, co ten člověk v práci dělá, čím pracuje a kde pracuje.",
      steps: ["Přečti otázku.", "Kdo tuhle práci dělá, nebo kdo tenhle nástroj či místo používá?"],
      commonMistake: "Záměna podobných povolání, například lékaře, zubaře a veterináře.",
      example: "Hasič hasí oheň hadicí, lékař léčí lidi a nosí bílý plášť.",
    },
  },
];
