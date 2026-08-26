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
//   L1 = rozpoznání: poloha N/J/V/Z na mapě, co je kompas/buzola,
//        co je legenda, co je měřítko — izolovaná fakta a definice.
//   L2 = aplikace: mezilehlé světové strany (SV/SZ/JV/JZ) a jejich poloha
//        v rohu mapy, plán vs. mapa (rozlišení podle situace), barvy
//        na fyzické mapě → jaký terén, základní určení severu podle
//        slunce v poledne.
//   L3 = transfer (2 kroky prostorové představivosti): otočení těla
//        o 180°/90° a určení strany po pravici/levici nebo směru,
//        skládání dvou mezilehlých směrů po otočce o 180°, kombinace
//        barva+poloha na mapě, rozdíl mezi tím, co řekne legenda
//        a co měřítko.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Kde je na mapě světová strana sever?",
    correctAnswer: "Nahoře",
    options: ["Nahoře", "Dole", "Vpravo", "Vlevo"],
    hints: [
      "Na mapách se sever vždy kreslí směrem nahoru.",
      "Představ si kompasovou ručičku — ukazuje nahoru na mapě.",
    ],
    explanation:
      "Na většině map platí dohodnuté pravidlo: sever je nahoře, jih je dole, východ je vpravo a západ je vlevo. Díky tomu se na mapách všichni snadno orientujeme.",
  },
  {
    question: "Kde je na mapě světová strana jih?",
    correctAnswer: "Dole",
    options: ["Dole", "Nahoře", "Vlevo", "Vpravo"],
    hints: [
      "Jih je opak severu. Sever je nahoře, jih je tedy...",
      "Jih je přesně na opačném okraji mapy než sever.",
    ],
    explanation:
      "Na standardní mapě je jih dole. Je to přesně naproti severu, který je nahoře.",
  },
  {
    question: "Kde je na mapě světová strana východ?",
    correctAnswer: "Vpravo",
    options: ["Vpravo", "Vlevo", "Nahoře", "Dole"],
    hints: [
      "Slunce ráno vychází na východě.",
      "Sever je nahoře. Pokud se díváš na mapu a slunce ráno vychází napravo od tebe... kde na mapě je východ?",
    ],
    explanation:
      "Na mapě je východ vpravo. Slunce vychází na východě — proto se někdy říká 'východ slunce'. Na mapě ho najdeme na pravé straně.",
  },
  {
    question: "Kde je na mapě světová strana západ?",
    correctAnswer: "Vlevo",
    options: ["Vlevo", "Vpravo", "Dole", "Nahoře"],
    hints: [
      "Západ je naproti východu. Východ je vpravo, západ je tedy...",
      "Slunce večer zapadá na západě.",
    ],
    explanation:
      "Na mapě je západ vlevo. Slunce každý večer zapadá na západě, který na mapách najdeme na levé straně.",
  },
  {
    question: "Na co ukazuje magnetická ručička kompasu?",
    correctAnswer: "Na magnetický sever",
    options: [
      "Na magnetický sever",
      "Na jih",
      "Na nejbližší město",
      "Na východ, odkud vychází slunce",
    ],
    hints: [
      "Kompas nás naviguje — ručička vždy ukazuje jedním pevným směrem.",
      "Magnetická ručička reaguje na zemské magnetické pole — ať kompasem otočíš jakkoli, vrátí se pořád stejným směrem. Zkus si vzpomenout, kam ukazují magnety na Zemi.",
    ],
    explanation:
      "Magnetická ručička kompasu vždy ukazuje na magnetický sever. Využívá zemské magnetické pole. Proto se kompas používá k orientaci v přírodě.",
  },
  {
    question: "Jaký přístroj používáme k určení světových stran v terénu?",
    correctAnswer: "Kompas",
    options: ["Kompas", "Teploměr", "Dalekohled", "Barometr"],
    hints: [
      "Tento přístroj má magnetickou ručičku.",
      "Používají ho turisté k orientaci v přírodě.",
    ],
    explanation:
      "K určení světových stran v terénu používáme kompas. Jeho magnetická ručička vždy ukazuje na sever, takže podle ní zjistíme i ostatní směry.",
  },
  {
    question: "Co je kompas?",
    correctAnswer: "Přístroj s magnetickou ručičkou, která vždy ukazuje na sever",
    options: [
      "Přístroj s magnetickou ručičkou, která vždy ukazuje na sever",
      "Přístroj na měření vzdálenosti mezi městy",
      "Přístroj na měření teploty vzduchu",
      "Přístroj na kreslení map",
    ],
    hints: [
      "Kompas má ručičku — a ta reaguje na zemský magnetismus.",
      "Nepočítá vzdálenosti ani teplotu, jen ukazuje směr.",
    ],
    explanation:
      "Kompas je přístroj s magnetickou ručičkou, která vždy ukazuje na sever. Podle ní pak snadno určíme i ostatní světové strany.",
  },
  {
    question: "Jak se jinak říká kompasu?",
    correctAnswer: "Buzola",
    options: ["Buzola", "Barometr", "Teploměr", "Dalekohled"],
    hints: [
      "Toto slovo turisté často používají místo 'kompas'.",
      "Oba výrazy znamenají přístroj s magnetickou ručičkou pro určení severu.",
    ],
    explanation:
      "Buzola je jiný název pro kompas — přístroj s magnetickou ručičkou, která ukazuje na sever.",
  },
  {
    question: "Co znamená legenda na mapě?",
    correctAnswer: "Vysvětlivky — co znamenají jednotlivé značky a barvy na mapě",
    options: [
      "Vysvětlivky — co znamenají jednotlivé značky a barvy na mapě",
      "Název státu vyznačeného na mapě",
      "Vzdálenost mezi dvěma městy",
      "Rok, kdy byla mapa vydána",
    ],
    hints: [
      "Legenda stojí obvykle v rohu mapy a vysvětluje symboly.",
      "Bez legendy bychom nevěděli, co znamená modrá čára nebo zelená barva.",
    ],
    explanation:
      "Legenda (vysvětlivky) je část mapy, která vysvětluje, co znamenají všechny použité značky, symboly a barvy. Bez legendy bychom mapu nedokázali číst.",
  },
  {
    question: "K čemu legenda na mapě slouží?",
    correctAnswer: "Abychom poznali, co znamenají značky a barvy použité na mapě",
    options: [
      "Abychom poznali, co znamenají značky a barvy použité na mapě",
      "Abychom zjistili, kolik obyvatel má daný stát",
      "Abychom si spočítali skutečnou vzdálenost dvou míst",
      "Abychom poznali, kdo mapu nakreslil",
    ],
    hints: [
      "Legenda je jako slovníček ke značkám na mapě.",
      "Bez ní bychom nevěděli, co znamená konkrétní symbol.",
    ],
    explanation:
      "Legenda slouží k tomu, abychom poznali, co znamenají jednotlivé značky a barvy na mapě. Je to nezbytná pomůcka pro čtení mapy.",
  },
  {
    question: "Co je měřítko mapy?",
    correctAnswer: "Poměr, o kolik je mapa zmenšená oproti skutečnosti",
    options: [
      "Poměr, o kolik je mapa zmenšená oproti skutečnosti",
      "Název oblasti zobrazené na mapě",
      "Tabulka s výškami hor",
      "Popis hranice státu",
    ],
    hints: [
      "Mapa nemůže být stejně velká jako skutečný kraj — musí se zmenšit.",
      "Měřítko říká, kolik centimetrů na mapě odpovídá kilometrům ve skutečnosti.",
    ],
    explanation:
      "Měřítko mapy říká, kolikrát je mapa zmenšená oproti skutečnosti. Například měřítko 1:100 000 znamená, že 1 cm na mapě odpovídá 1 km ve skutečnosti.",
  },
  {
    question: "Co ti prozradí měřítko mapy?",
    correctAnswer: "O kolik je mapa zmenšená oproti skutečnosti",
    options: [
      "O kolik je mapa zmenšená oproti skutečnosti",
      "Co znamenají barvy a značky na mapě",
      "Kdo mapu nakreslil a kdy",
      "Kolik měst je na mapě zakresleno",
    ],
    hints: [
      "Měřítko se týká velikosti, ne významu značek.",
      "Měřítko 1:100 000 znamená, že 1 cm na mapě odpovídá 100 000 cm ve skutečnosti — to je informace o velikosti, ne o významu značek.",
    ],
    explanation:
      "Měřítko mapy prozradí, o kolik je mapa zmenšená oproti skutečnosti. Co znamenají značky a barvy, to naopak řekne legenda.",
  },
  {
    question: "Kolik hlavních světových stran rozeznáváme?",
    correctAnswer: "Čtyři",
    options: ["Čtyři", "Tři", "Pět", "Osm"],
    hints: [
      "Vyjmenuj je: sever, jih, východ, západ.",
      "Spočítej si je na prstech — je jich přesně tolik.",
    ],
    explanation:
      "Rozeznáváme čtyři hlavní světové strany: sever, jih, východ a západ. Kromě nich existují ještě čtyři mezilehlé strany (SV, JV, JZ, SZ).",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je severovýchod (SV)?",
    correctAnswer: "Mezilehlá světová strana mezi severem a východem",
    options: [
      "Mezilehlá světová strana mezi severem a východem",
      "Mezilehlá světová strana mezi severem a západem",
      "Jiný název pro sever",
      "Světová strana pod jihem",
    ],
    hints: [
      "SV vzniklo spojením dvou písmen. Kterých dvou světových stran jsou to první písmena?",
      "SV = Sever + Východ. Najdeš ho v pravém horním rohu mapy.",
    ],
    explanation:
      "Severovýchod (SV) je mezilehlá světová strana ležící přesně mezi severem a východem. Na mapě ji najdeme v pravém horním rohu.",
  },
  {
    question: "Co je jihozápad (JZ)?",
    correctAnswer: "Mezilehlá světová strana mezi jihem a západem",
    options: [
      "Mezilehlá světová strana mezi jihem a západem",
      "Mezilehlá světová strana mezi jihem a východem",
      "Jiný název pro západ",
      "Světová strana naproti severu",
    ],
    hints: [
      "JZ = Jih + Západ. Podívej se na mapu dolů doleva.",
      "Jihozápad je v levém dolním rohu mapy.",
    ],
    explanation:
      "Jihozápad (JZ) je mezilehlá světová strana mezi jihem a západem. Na mapě ji najdeme v levém dolním rohu.",
  },
  {
    question: "Co je jihovýchod (JV)?",
    correctAnswer: "Mezilehlá světová strana mezi jihem a východem",
    options: [
      "Mezilehlá světová strana mezi jihem a východem",
      "Mezilehlá světová strana mezi jihem a západem",
      "Mezilehlá světová strana mezi severem a východem",
      "Jiný název pro jih",
    ],
    hints: [
      "JV = Jih + Východ. Podívej se na mapu dolů doprava.",
      "Jihovýchod je v pravém dolním rohu mapy.",
    ],
    explanation:
      "Jihovýchod (JV) je mezilehlá světová strana ležící přesně mezi jihem a východem. Na mapě ji najdeme v pravém dolním rohu.",
  },
  {
    question: "Co je severozápad (SZ)?",
    correctAnswer: "Mezilehlá světová strana mezi severem a západem",
    options: [
      "Mezilehlá světová strana mezi severem a západem",
      "Mezilehlá světová strana mezi severem a východem",
      "Mezilehlá světová strana mezi jihem a západem",
      "Jiný název pro západ",
    ],
    hints: [
      "SZ = Sever + Západ. Podívej se na mapu nahoru doleva.",
      "Severozápad je v levém horním rohu mapy.",
    ],
    explanation:
      "Severozápad (SZ) je mezilehlá světová strana ležící přesně mezi severem a západem. Na mapě ji najdeme v levém horním rohu.",
  },
  {
    question: "Ve kterém rohu mapy najdeš severovýchod (SV)?",
    correctAnswer: "Vpravo nahoře",
    options: ["Vpravo nahoře", "Vlevo nahoře", "Vpravo dole", "Vlevo dole"],
    hints: [
      "Kde je na mapě sever a kde východ? Spoj obě polohy dohromady a najdeš severovýchod.",
      "Hledej roh, kde se potkává horní a pravý okraj mapy.",
    ],
    explanation:
      "Severovýchod najdeš v pravém horním rohu mapy — tam, kde se potkává sever (nahoře) s východem (vpravo).",
  },
  {
    question: "Ve kterém rohu mapy najdeš jihozápad (JZ)?",
    correctAnswer: "Vlevo dole",
    options: ["Vlevo dole", "Vpravo dole", "Vlevo nahoře", "Vpravo nahoře"],
    hints: [
      "Kde je na mapě jih a kde západ? Spoj obě polohy dohromady a najdeš jihozápad.",
      "Hledej roh, kde se potkává dolní a levý okraj mapy.",
    ],
    explanation:
      "Jihozápad najdeš v levém dolním rohu mapy — tam, kde se potkává jih (dole) se západem (vlevo).",
  },
  {
    question: "Ve kterém rohu mapy najdeš jihovýchod (JV)?",
    correctAnswer: "Vpravo dole",
    options: ["Vpravo dole", "Vlevo dole", "Vpravo nahoře", "Vlevo nahoře"],
    hints: [
      "Kde je na mapě jih a kde východ? Spoj obě polohy dohromady a najdeš jihovýchod.",
      "Hledej roh, kde se potkává dolní a pravý okraj mapy.",
    ],
    explanation:
      "Jihovýchod najdeš v pravém dolním rohu mapy — tam, kde se potkává jih (dole) s východem (vpravo).",
  },
  {
    question: "Ve kterém rohu mapy najdeš severozápad (SZ)?",
    correctAnswer: "Vlevo nahoře",
    options: ["Vlevo nahoře", "Vpravo nahoře", "Vlevo dole", "Vpravo dole"],
    hints: [
      "Kde je na mapě sever a kde západ? Spoj obě polohy dohromady a najdeš severozápad.",
      "Hledej roh, kde se potkává horní a levý okraj mapy.",
    ],
    explanation:
      "Severozápad najdeš v levém horním rohu mapy — tam, kde se potkává sever (nahoře) se západem (vlevo).",
  },
  {
    question: "Co je plán (například plán třídy nebo města)?",
    correctAnswer: "Zobrazení malé plochy, například jedné budovy nebo města",
    options: [
      "Zobrazení malé plochy, například jedné budovy nebo města",
      "Zobrazení celého státu nebo kontinentu",
      "Fotografie krajiny z letadla",
      "Seznam ulic bez žádného obrázku",
    ],
    hints: [
      "Plán se používá pro menší území — místnost, školu, město.",
      "Na plánu vidíš podrobně jednotlivé ulice nebo místnosti.",
    ],
    explanation:
      "Plán zobrazuje malou plochu v podrobném provedení — například pokoj, školu nebo město. Díky malé ploše může být plán velmi podrobný.",
  },
  {
    question: "Co je mapa (například mapa kraje nebo státu)?",
    correctAnswer: "Zobrazení velké plochy, například kraje nebo státu",
    options: [
      "Zobrazení velké plochy, například kraje nebo státu",
      "Zobrazení jedné třídy ve škole",
      "Fotografie mraků z družice",
      "Seznam měst bez žádného obrázku",
    ],
    hints: [
      "Mapa zobrazuje velké území — kraj, stát, kontinent.",
      "Na mapě státu nejsou vidět jednotlivé ulice, jen města a hranice.",
    ],
    explanation:
      "Mapa zobrazuje velkou plochu — kraj, stát nebo celý kontinent. Protože je území velké, mapa nemůže být tak podrobná jako plán malého místa.",
  },
  {
    question:
      "Kamarád ti chce popsat cestu ke škole ve vaší ulici. Použije k tomu spíš plán, nebo mapu státu?",
    correctAnswer: "Plán — protože jde o malou plochu s podrobnými ulicemi",
    options: [
      "Plán — protože jde o malou plochu s podrobnými ulicemi",
      "Mapu státu — protože je přesnější",
      "Oboje je stejně vhodné",
      "Ani jedno, cestu nelze zakreslit",
    ],
    hints: [
      "Ulice a cesta ke škole jsou malé území.",
      "Plán ti ukáže třeba jednu ulici do detailu, mapa celý kraj najednou.",
    ],
    explanation:
      "Pro popis cesty v rámci jedné ulice je vhodnější plán — zobrazuje malou plochu podrobně. Mapa státu by ulice ani nezobrazila.",
  },
  {
    question: "Co znamená modrá barva na fyzické mapě?",
    correctAnswer: "Vodu — řeky, jezera, moře",
    options: [
      "Vodu — řeky, jezera, moře",
      "Lesy a parky",
      "Hory a kopce",
      "Silnice a dálnice",
    ],
    hints: [
      "Zamysli se, jakou barvu má voda v přírodě.",
      "Na mapě se barvy podobají skutečnosti — voda je modrá.",
    ],
    explanation:
      "Modrá barva na mapě označuje vodu — řeky, jezera, rybníky, moře a oceány. Je to přirozená barva připomínající skutečný vzhled vodní hladiny.",
  },
  {
    question: "Co znamená zelená barva na fyzické mapě?",
    correctAnswer: "Nížiny a roviny",
    options: [
      "Nížiny a roviny",
      "Hory a vrchoviny",
      "Pouště a suché oblasti",
      "Lesy kolem měst",
    ],
    hints: [
      "Na fyzické mapě barvy ukazují výšku terénu. Zelená = nízko nad mořem.",
      "Louky, pole a jiná nízko položená území bývají na fyzické mapě zelená.",
    ],
    explanation:
      "Na fyzické mapě zelená barva označuje nížiny — oblasti ležící nízko nad mořem. Čím vyšší terén, tím přechází barva do žluté, hnědé a nakonec fialové.",
  },
  {
    question: "Na fyzické mapě vidíš vysoké pohoří. Jakou barvou bude nejspíš vybarveno?",
    correctAnswer: "Hnědou",
    options: ["Hnědou", "Modrou", "Zelenou", "Bílou jako sníh"],
    hints: [
      "Na fyzické mapě barva ukazuje výšku terénu.",
      "Čím vyšší terén, tím tmavší odstín této barvy.",
    ],
    explanation:
      "Vysoké pohoří bude na fyzické mapě vybarveno hnědou barvou. Zelená patří nížinám, modrá vodě — hnědá je barva hor a vrchovin.",
  },
  {
    question: "Chceš na plán svého města zakreslit potok. Jakou barvou ho nakreslíš?",
    correctAnswer: "Modrou",
    options: ["Modrou", "Zelenou", "Hnědou", "Žlutou"],
    hints: [
      "Vzpomeň si, jakou barvu má na mapách voda.",
      "Barva by měla odpovídat skutečnému vzhledu vody.",
    ],
    explanation:
      "Potok, stejně jako každá jiná voda, se na plánech i mapách kreslí modrou barvou — je to zavedená konvence, kterou používá každá mapa.",
  },
  {
    question: "Jak můžeš určit sever za slunečného dne v poledne bez kompasu?",
    correctAnswer: "V poledne stojí slunce na jihu, takže sever je přesně naproti",
    options: [
      "V poledne stojí slunce na jihu, takže sever je přesně naproti",
      "Slunce vždy ukazuje na sever",
      "Sever je tam, kde svítí nejsilněji",
      "Za dne nelze sever určit bez kompasu",
    ],
    hints: [
      "Slunce je v poledne nejvýše na obloze a stojí na jihu.",
      "Otočíš-li se čelem k polednímu slunci (jih), za zády máš sever.",
    ],
    explanation:
      "V poledne je slunce nejvýše na obloze a nachází se na jihu. Otočíme-li se k polednímu slunci čelem, stojíme čelem k jihu — za zády máme sever.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Je poledne, slunce máš přímo před sebou — stojíš tedy čelem k jihu. Co máš po pravici?",
    correctAnswer: "Západ",
    options: ["Západ", "Východ", "Sever", "Jih"],
    hints: [
      "Když stojíš čelem k severu, po pravici máš východ. Teď jsi ale otočený o 180° — čelem k jihu.",
      "Při otočce o 180° se pravá a levá strana prohodí: co bylo napravo, je teď nalevo, a naopak.",
    ],
    explanation:
      "Čelem k severu máš východ napravo a západ nalevo. Otočíš-li se o 180° (čelem k jihu), strany se prohodí — za zády máš sever, po pravici západ a po levici východ.",
  },
  {
    question:
      "Je poledne, slunce máš přímo před sebou — stojíš tedy čelem k jihu. Co máš po levici?",
    correctAnswer: "Východ",
    options: ["Východ", "Západ", "Sever", "Jih"],
    hints: [
      "Když stojíš čelem k severu, po levici máš západ. Teď jsi ale otočený o 180° — čelem k jihu.",
      "Při otočce o 180° se pravá a levá strana prohodí: co bylo nalevo, je teď napravo, a naopak.",
    ],
    explanation:
      "Čelem k severu máš západ nalevo a východ napravo. Otočíš-li se o 180° (čelem k jihu), strany se prohodí — za zády máš sever, po levici východ a po pravici západ.",
  },
  {
    question: "Jdeš na severovýchod (SV) a otočíš se o 180°. Kterým směrem teď jdeš?",
    correctAnswer: "Jihozápad",
    options: ["Jihozápad", "Severozápad", "Jihovýchod", "Severovýchod"],
    hints: [
      "Otočka o 180° obrátí OBĚ složky směru: sever se změní na jih A východ na západ.",
      "Hledej roh mapy, který leží úhlopříčně naproti severovýchodu — přes střed mapy na druhou stranu.",
    ],
    explanation:
      "Otočka o 180° obrátí obě části mezilehlého směru najednou: sever ↔ jih a východ ↔ západ. Opakem severovýchodu (SV) je proto jihozápad (JZ).",
  },
  {
    question: "Jdeš na jihozápad (JZ) a otočíš se o 180°. Kterým směrem teď jdeš?",
    correctAnswer: "Severovýchod",
    options: ["Severovýchod", "Severozápad", "Jihovýchod", "Jihozápad"],
    hints: [
      "Otočka o 180° obrátí OBĚ složky směru: jih se změní na sever A západ na východ.",
      "Hledej roh mapy, který leží úhlopříčně naproti jihozápadu — přes střed mapy na druhou stranu.",
    ],
    explanation:
      "Otočka o 180° obrátí obě části mezilehlého směru najednou: jih ↔ sever a západ ↔ východ. Opakem jihozápadu (JZ) je proto severovýchod (SV).",
  },
  {
    question: "Jdeš na severozápad (SZ) a otočíš se o 180°. Kterým směrem teď jdeš?",
    correctAnswer: "Jihovýchod",
    options: ["Jihovýchod", "Severovýchod", "Jihozápad", "Severozápad"],
    hints: [
      "Otočka o 180° obrátí OBĚ složky směru: sever se změní na jih A západ na východ.",
      "Hledej roh mapy, který leží úhlopříčně naproti severozápadu — přes střed mapy na druhou stranu.",
    ],
    explanation:
      "Otočka o 180° obrátí obě části mezilehlého směru najednou: sever ↔ jih a západ ↔ východ. Opakem severozápadu (SZ) je proto jihovýchod (JV).",
  },
  {
    question: "Jdeš na jihovýchod (JV) a otočíš se o 180°. Kterým směrem teď jdeš?",
    correctAnswer: "Severozápad",
    options: ["Severozápad", "Jihozápad", "Severovýchod", "Jihovýchod"],
    hints: [
      "Otočka o 180° obrátí OBĚ složky směru: jih se změní na sever A východ na západ.",
      "Hledej roh mapy, který leží úhlopříčně naproti jihovýchodu — přes střed mapy na druhou stranu.",
    ],
    explanation:
      "Otočka o 180° obrátí obě části mezilehlého směru najednou: jih ↔ sever a východ ↔ západ. Opakem jihovýchodu (JV) je proto severozápad (SZ).",
  },
  {
    question:
      "Na fyzické mapě vidíš vysokou horu (hnědá barva) v severní části mapy. Stojíš uprostřed mapy — kterým směrem od tebe hora leží?",
    correctAnswer: "Na sever",
    options: ["Na sever", "Na jih", "Na východ", "Na západ"],
    hints: [
      "Hnědá barva na fyzické mapě znamená horu nebo vrchovinu.",
      "Hora je nakreslená v horní části mapy. Vzpomeň si, který světový směr je na mapě vždy nahoře.",
    ],
    explanation:
      "Hnědá barva prozradí, že jde o horu. Poloha v horní části mapy prozradí směr — nahoře na mapě je vždy sever, takže hora leží na sever od středu mapy.",
  },
  {
    question:
      "Na fyzické mapě vidíš širokou nížinu (zelená barva) v jižní části mapy. Stojíš uprostřed mapy — kterým směrem od tebe nížina leží?",
    correctAnswer: "Na jih",
    options: ["Na jih", "Na sever", "Na východ", "Na západ"],
    hints: [
      "Zelená barva na fyzické mapě znamená nížinu nebo rovinu.",
      "Nížina je nakreslená v dolní části mapy — a dole na mapě je jih.",
    ],
    explanation:
      "Zelená barva prozradí, že jde o nížinu. Poloha v dolní části mapy prozradí směr — dole na mapě je vždy jih, takže nížina leží na jih od středu mapy.",
  },
  {
    question:
      "Mapa má měřítko 1:100 000. Co ti řekne LEGENDA a co ti měřítko NEŘEKNE?",
    correctAnswer: "Co znamenají značky a barvy na mapě",
    options: [
      "Co znamenají značky a barvy na mapě",
      "Jak daleko jsou od sebe dvě místa",
      "Kolik má mapa stránek",
      "Jméno autora mapy",
    ],
    hints: [
      "Měřítko se týká jen velikosti a vzdáleností, ne významu značek.",
      "Legenda vysvětluje symboly a barvy — to je práce, kterou měřítko nedělá.",
    ],
    explanation:
      "Měřítko 1:100 000 ti řekne jen to, o kolik je mapa zmenšená (a tedy jak přepočítat vzdálenosti). Co znamenají jednotlivé značky a barvy na mapě, se dozvíš z legendy, ne z měřítka.",
  },
  {
    question:
      "Z měřítka mapy zjistíš vzdálenost mezi dvěma vesnicemi. Co ti měřítko NEŘEKNE a musíš to zjistit z legendy?",
    correctAnswer: "Co znamenají barvy a značky na mapě",
    options: [
      "Co znamenají barvy a značky na mapě",
      "Kolik centimetrů má mapa na šířku",
      "Jak moc je mapa zmenšená",
      "Zda je mapa fyzická, nebo politická",
    ],
    hints: [
      "Měřítko slouží k přepočtu vzdáleností, ne k vysvětlení symbolů.",
      "Vysvětlivky ke značkám a barvám najdeš vždy v legendě.",
    ],
    explanation:
      "Měřítko pomáhá spočítat skutečnou vzdálenost, ale nevysvětluje, co znamenají barvy a značky na mapě — to je úkolem legendy.",
  },
  {
    question:
      "Stojíš čelem k severu. Otočíš se o 90° doprava (ve směru hodinových ručiček). Kterým směrem se teď díváš?",
    correctAnswer: "Na východ",
    options: ["Na východ", "Na západ", "Na jih", "Na sever"],
    hints: [
      "Čtvrt otáčky doprava od severu tě posune o jednu světovou stranu ve směru hodinových ručiček.",
      "Pořadí po směru hodinových ručiček je: sever → východ → jih → západ.",
    ],
    explanation:
      "Otočka o 90° doprava (po směru hodinových ručiček) posune tvůj směr o jednu světovou stranu dál v pořadí sever → východ → jih → západ. Ze severu se tak dostaneš na východ.",
  },
  {
    question:
      "Stojíš čelem k severu. Otočíš se o 90° doleva (proti směru hodinových ručiček). Kterým směrem se teď díváš?",
    correctAnswer: "Na západ",
    options: ["Na západ", "Na východ", "Na jih", "Na sever"],
    hints: [
      "Čtvrt otáčky doleva od severu tě posune o jednu světovou stranu proti směru hodinových ručiček.",
      "Pořadí proti směru hodinových ručiček je: sever → západ → jih → východ.",
    ],
    explanation:
      "Otočka o 90° doleva (proti směru hodinových ručiček) posune tvůj směr o jednu světovou stranu dál v pořadí sever → západ → jih → východ. Ze severu se tak dostaneš na západ.",
  },
  {
    question:
      "Stojíš čelem k východu. Otočíš se o 90° doprava (ve směru hodinových ručiček). Kterým směrem se teď díváš?",
    correctAnswer: "Na jih",
    options: ["Na jih", "Na sever", "Na východ", "Na západ"],
    hints: [
      "Čtvrt otáčky doprava tě posune o jednu světovou stranu dál v pořadí sever → východ → jih → západ.",
      "Z východu je dalším směrem po směru hodinových ručiček jih.",
    ],
    explanation:
      "Otočka o 90° doprava posune tvůj směr o jednu světovou stranu v pořadí sever → východ → jih → západ. Z východu se tak dostaneš na jih.",
  },
  {
    question:
      "Stojíš čelem k východu. Otočíš se o 90° doleva (proti směru hodinových ručiček). Kterým směrem se teď díváš?",
    correctAnswer: "Na sever",
    options: ["Na sever", "Na jih", "Na východ", "Na západ"],
    hints: [
      "Čtvrt otáčky doleva je opačný pohyb než doprava — vrátíš se o jednu světovou stranu zpět.",
      "Pořadí proti směru hodinových ručiček od východu je: východ → sever → západ → jih.",
    ],
    explanation:
      "Otočka o 90° doleva posune tvůj směr o jednu světovou stranu v pořadí východ → sever → západ → jih. Z východu se tak dostaneš na sever.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const MAPASTRANYSVET: TopicMetadata[] = [
  {
    id: "g3-prvouka-misto-kde-zijeme-nase-vlast-mapa-svetove-strany-plan-a-mapa-kompas",
    rvpNodeId:
      "g3-prvouka-misto-kde-zijeme-nase-vlast-mapa-svetove-strany-plan-a-mapa-kompas",
    title: "Mapa, světové strany, kompas",
    studentTitle: "Mapa a orientace",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Naše vlast",
    briefDescription: "Umíš se orientovat na mapě a znáš světové strany.",
    keywords: [
      "mapa",
      "plán",
      "světové strany",
      "sever",
      "jih",
      "východ",
      "západ",
      "kompas",
      "legenda",
      "měřítko",
      "orientace",
      "severovýchod",
      "jihozápad",
      "barvy na mapě",
    ],
    goals: [
      "Pojmenovat čtyři hlavní světové strany a určit jejich polohu na mapě.",
      "Vysvětlit, k čemu slouží kompas.",
      "Popsat mezilehlé světové strany (SV, SZ, JV, JZ).",
      "Vysvětlit, co je legenda a měřítko mapy.",
      "Rozlišit plán od mapy.",
      "Přiřadit základní barvy na fyzické mapě ke tvaru terénu.",
      "Popsat, jak určit sever podle polohy slunce v poledne.",
    ],
    boundaries: [
      "Základní pojmy a dovednosti pro 3. třídu, bez zeměpisných souřadnic, projekcí nebo UTM.",
      "Prostorové úlohy s otočením těla (L3) pracují jen s úhly 90° a 180°, bez jemnějšího dělení.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Sever je nahoře, Jih dole, Východ vpravo, Západ vlevo. Kompas ukazuje na sever. Legenda = vysvětlivky, měřítko = zmenšení. Plán = malá plocha, mapa = velká plocha.",
      steps: [
        "Podívej se na mapu — sever je nahoře.",
        "Kompasová ručička vždy míří na sever.",
        "Legenda ti poví, co znamenají barvy a značky.",
        "Měřítko říká, kolik skutečných kilometrů odpovídá centimetru na mapě.",
      ],
      commonMistake:
        "Záměna plánu a mapy — plán je pro malou plochu (město), mapa pro velkou plochu (kraj, stát).",
      example:
        "Stojíš na náměstí a chceš najít školu na jihu. Otočíš kompas, ručička ukáže sever (nahoru) — škola je dole na mapě, takže se vydáš na jih.",
    },
  },
];
