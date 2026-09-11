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
// Svátky a tradice: Vánoce, Velikonoce, Mikuláš, Masopust, Dušičky.
//   L1 = rozpoznání: izolovaný fakt o jednom svátku (co k němu patří,
//        kdo přichází, co se dělá)
//   L2 = aplikace: přiřazení skupiny zvyků/jídla ke konkrétnímu svátku,
//        roční období svátku, rozlišení podobných zvyků
//   L3 = transfer (2 kroky): kombinace dvou faktů najednou (roční
//        období + symbol), pořadí svátků v roce, rozlišení blízkých
//        postav/svátků, jednoduché „proč“
// Každá úloha: dvě vlastní nápovědy, zpětná vazba u každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Kdy zdobíme vánoční stromeček ozdobami?",
    correctAnswer: "Vánoce",
    options: ["Vánoce", "Velikonoce", "Masopust", "Dušičky"],
    emoji: "🎄",
    hints: [
      "Stromeček zdobíme na zimní svátek — na konci prosince.",
      "Vzpomeň si na Štědrý večer: pod ozdobeným stromečkem leží dárky a na stole je smažený kapr. Který svátek to je?",
    ],
    optionFeedback: {
      Velikonoce: "Velikonoce jsou jarní svátek s malovanými vajíčky, stromeček se nezdobí.",
      Masopust: "O Masopustu se chodí v maskách, stromeček k němu nepatří.",
      Dušičky: "O Dušičkách zapalujeme svíčky na hrobech, stromeček nezdobíme.",
    },
    explanation: "Stromeček zdobíme o Vánocích, které slavíme na konci prosince.",
  },
  {
    question: "Kdy malujeme velikonoční vajíčka?",
    correctAnswer: "Velikonoce",
    options: ["Vánoce", "Velikonoce", "Mikuláš", "Dušičky"],
    emoji: "🥚",
    hints: [
      "Vajíčka malujeme na jarní svátek, ne v zimě.",
      "Vzpomeň si na svátek, kdy chlapci chodí s pomlázkou z vrbových proutků a za koledu dostávají barevná vajíčka.",
    ],
    optionFeedback: {
      Vánoce: "O Vánocích zdobíme stromeček, vajíčka nemalujeme.",
      Mikuláš: "Mikuláš nosí 5. prosince sladkosti, vajíčka se tehdy nemalují.",
      Dušičky: "Dušičky jsou podzimní vzpomínka na zemřelé, bez malovaných vajíček.",
    },
    explanation: "Vajíčka malujeme o Velikonocích, které slavíme na jaře.",
  },
  {
    question: "Co jíme tradičně na Štědrý den k večeři?",
    correctAnswer: "Kapr",
    options: ["Beránek", "Koblihy", "Kapr", "Perník"],
    emoji: "🐟",
    hints: [
      "Je to ryba, která žije ve vodě.",
      "Před Vánocemi se tato ryba prodává z velkých kádí na ulici a někdo ji má pár dní doma ve vaně. Jí se smažená s bramborovým salátem.",
    ],
    optionFeedback: {
      Beránek: "Beránek je velikonoční pečivo, ne štědrovečerní večeře.",
      Koblihy: "Koblihy se smaží o Masopustu.",
      Perník: "Perník je sladké pečivo, k večeři se nejí — hlavní jídlo je ryba.",
    },
    explanation: "Na Štědrý den se tradičně jí kapr — sváteční vánoční ryba.",
  },
  {
    question: "Co dáváme pod vánoční stromeček?",
    correctAnswer: "Dárky",
    options: ["Vajíčka", "Masky", "Svíčky na hrob", "Dárky"],
    emoji: "🎁",
    hints: [
      "Jsou to balíčky, které o Vánocích rozbalujeme.",
      "Na Štědrý večer zazvoní zvoneček a děti běží ke stromečku. Co tam najdou zabalené v barevném papíře s mašlí?",
    ],
    optionFeedback: {
      Vajíčka: "Malovaná vajíčka patří k Velikonocům.",
      Masky: "Masky se nosí o Masopustu.",
      "Svíčky na hrob": "Svíčky na hrob zapalujeme o Dušičkách.",
    },
    explanation: "Pod stromeček dáváme dárky, které si o Vánocích rozbalujeme.",
  },
  {
    question: "Kdo podle tradice nosí dětem dárky o Vánocích?",
    correctAnswer: "Ježíšek",
    options: ["Ježíšek", "Mikuláš", "Anděl", "Zajíc"],
    emoji: "⭐",
    hints: [
      "Jeho jméno souvisí s Vánocemi a zpívá se o něm v koledách.",
      "Mikuláš přichází už 5. prosince a zajíc patří k jaru. Hledej toho, kdo tajně přinese dárky na Štědrý večer, když zazvoní zvoneček.",
    ],
    optionFeedback: {
      Mikuláš: "Mikuláš nosí sladkosti 5. prosince, ne vánoční dárky.",
      Anděl: "Anděl chodí s Mikulášem, dárky o Vánocích nenosí.",
      Zajíc: "Zajíc patří k Velikonocům.",
    },
    explanation: "O Vánocích nosí podle tradice dárky Ježíšek.",
  },
  {
    question: "Které zvíře nosí podle tradice o Velikonocích vajíčka?",
    correctAnswer: "Zajíc",
    options: ["Beránek", "Zajíc", "Kapr", "Čert"],
    emoji: "🐰",
    hints: [
      "Je to zvíře s dlouhýma ušima, které rychle skáče.",
      "Na velikonočních obrázcích nese košík s barevnými vajíčky zvíře, které má krátký chlupatý ocásek a rádo okusuje mrkev.",
    ],
    optionFeedback: {
      Beránek: "Beránek je symbol Velikonoc, ale vajíčka podle tradice nenosí.",
      Kapr: "Kapr je vánoční ryba.",
      Čert: "Čert chodí 5. prosince s Mikulášem.",
    },
    explanation: "O Velikonocích nosí podle tradice vajíčka zajíc.",
  },
  {
    question: "Co si chlapci pletou na Velikonoce z vrbových proutků?",
    correctAnswer: "Pomlázku",
    options: ["Adventní věnec", "Betlém", "Pomlázku", "Koledu"],
    emoji: "🌿",
    hints: [
      "S touto věcí chodí chlapci o Velikonočním pondělí po domech.",
      "Chlapci spletou několik proutků dohromady, ozdobí je barevnými stužkami a pak s tím symbolicky vyšlehají děvčata, aby byla celý rok zdravá.",
    ],
    optionFeedback: {
      "Adventní věnec": "Adventní věnec se dělá před Vánoci a bývá ze smrkových větviček.",
      Betlém: "Betlém je vánoční výjev s Ježíškem v jesličkách, z proutků se nesplétá.",
      Koledu: "Koleda se říká nebo zpívá, neplete se z proutků.",
    },
    explanation: "Chlapci si na Velikonoce pletou pomlázku z vrbových proutků.",
  },
  {
    question: "Kdo 5. prosince rozdává nadílku a chodí s čertem a andělem?",
    correctAnswer: "Mikuláš",
    options: ["Ježíšek", "Zajíc", "Kouzelník", "Mikuláš"],
    emoji: "😇",
    hints: [
      "Má dlouhé bílé vousy, vysokou biskupskou čepici a berlu.",
      "Přichází jen jednou za rok, na začátku prosince. Hodným dětem dá ovoce a sladkosti, zlobivým hrozí, že dostanou uhlí.",
    ],
    optionFeedback: {
      Ježíšek: "Ježíšek nosí dárky až na Štědrý večer a s čertem nechodí.",
      Zajíc: "Zajíc patří k jarním Velikonocům.",
      Kouzelník: "Kouzelník není postava žádného českého svátku.",
    },
    explanation: "5. prosince večer chodí Mikuláš spolu s čertem a andělem a rozdává nadílku.",
  },
  {
    question: "Kdo straší 5. prosince zlobivé děti?",
    correctAnswer: "Čert",
    options: ["Čert", "Anděl", "Ježíšek", "Zajíc"],
    emoji: "👹",
    hints: [
      "Je to postava s rohy a ocasem, celá černá.",
      "Chodí s Mikulášem, řinčí řetězem a nosí na zádech pytel. Hodným dětem nic neudělá, jen zlobivým hrozí, že je odnese.",
    ],
    optionFeedback: {
      Anděl: "Anděl je hodný, rozdává dárky a nestraší.",
      Ježíšek: "Ježíšek chodí o Vánocích a nosí dárky.",
      Zajíc: "Zajíc patří k Velikonocům a nikoho nestraší.",
    },
    explanation: "Zlobivé děti straší 5. prosince čert, který chodí s Mikulášem a andělem.",
  },
  {
    question: "Co je typické pro masopustní průvod?",
    correctAnswer: "Masky",
    options: ["Malovaná vajíčka", "Masky", "Vánoční ozdoby", "Svíčky na hrob"],
    emoji: "🎭",
    hints: [
      "Lidé si je nasadí na obličej a přestrojí se za různé postavy.",
      "V průvodu jde medvěd, kobyla, kominík i čarodějnice — ale pod převlekem jsou schovaní lidé z vesnice. Čím si zakryli obličej?",
    ],
    optionFeedback: {
      "Malovaná vajíčka": "Malovaná vajíčka patří k Velikonocům.",
      "Vánoční ozdoby": "Vánoční ozdoby věšíme na stromeček.",
      "Svíčky na hrob": "Svíčky na hrob zapalujeme o Dušičkách.",
    },
    explanation: "Pro masopustní průvod jsou typické masky, do kterých se lidé přestrojují.",
  },
  {
    question: "Co lidé zapalují o Dušičkách na hrobech?",
    correctAnswer: "Svíčky",
    options: ["Adventní věnec", "Cukroví", "Svíčky", "Pomlázku"],
    emoji: "🕯️",
    hints: [
      "Je to malý plamínek, který svítí ve tmě.",
      "Na podzim večer je hřbitov plný malých světýlek v lampičkách. Lidé je zapalují na památku svých blízkých, kteří už nežijí.",
    ],
    optionFeedback: {
      "Adventní věnec": "Adventní věnec patří k času před Vánoci a dáváme ho na stůl, ne na hrob.",
      Cukroví: "Cukroví se peče na Vánoce, na hroby se nedává.",
      Pomlázku: "Pomlázka patří k Velikonocům.",
    },
    explanation: "O Dušičkách lidé zapalují na hrobech svíčky a vzpomínají na zemřelé.",
  },
  {
    question: "Co zpíváme o Vánocích?",
    correctAnswer: "Koledy",
    options: ["Hymny", "Básničky", "Hádanky", "Koledy"],
    emoji: "🎶",
    hints: [
      "Jsou to písničky o Ježíškovi a betlémské hvězdě.",
      "Třeba „Nesem vám noviny“ nebo „Narodil se Kristus Pán“ — jak se říká vánočním písničkám, které zpíváme u stromečku?",
    ],
    optionFeedback: {
      Hymny: "Hymna je slavnostní píseň státu, zpívá se třeba při sportu.",
      Básničky: "Básničky se recitují, nezpívají.",
      Hádanky: "Hádanky se hádají, nezpívají.",
    },
    explanation: "O Vánocích zpíváme koledy, například Narodil se Kristus Pán.",
  },
  {
    question: "Co pečeme o Vánocích?",
    correctAnswer: "Cukroví",
    options: ["Cukroví", "Vajíčka", "Masky", "Svíčky"],
    emoji: "🍪",
    hints: [
      "Je to sladké pečivo — perníčky, vanilkové rohlíčky a podobně.",
      "Před Vánocemi voní celý byt a na plechu leží malé hvězdičky, srdíčka a linecké. Jak se tomu drobnému sladkému pečivu říká?",
    ],
    optionFeedback: {
      Vajíčka: "Vajíčka se malují o Velikonocích, nepečou se.",
      Masky: "Masky se nosí o Masopustu, nepečou se.",
      Svíčky: "Svíčky se zapalují, nepečou se.",
    },
    explanation: "O Vánocích pečeme cukroví — sladké pečivo různých tvarů.",
  },
  {
    question: "Co svítí na vánočním stromečku?",
    correctAnswer: "Svíčky",
    options: ["Vajíčka", "Svíčky", "Pomlázky", "Masky"],
    emoji: "🕯️",
    hints: [
      "Na stromečku svítí ozdoby — plamenem nebo elektřinou.",
      "Dřív se na větve stromečku připevňovaly malé voskové ozdoby s knotem, které se zapálily. Dnes je často nahradí elektrická světýlka.",
    ],
    optionFeedback: {
      Vajíčka: "Vajíčka se věší na velikonoční větvičky a nesvítí.",
      Pomlázky: "Pomlázka je velikonoční pletený proutek.",
      Masky: "Masky se nosí o Masopustu.",
    },
    explanation: "Na vánočním stromečku svítí svíčky nebo elektrická světýlka.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ke kterému svátku patří malování vajíček a pletení pomlázky?",
    correctAnswer: "Velikonoce",
    options: ["Vánoce", "Mikuláš", "Velikonoce", "Masopust"],
    emoji: "🥚",
    hints: [
      "Oba zvyky patří ke svátku, který slavíme na jaře.",
      "Na jaře kvetou na vrbách kočičky a z vrbových proutků se plete pomlázka. Který svátek slavíme v březnu nebo dubnu?",
    ],
    optionFeedback: {
      Vánoce: "Vánoce jsou v zimě se stromečkem a kaprem.",
      Mikuláš: "Mikuláš je 5. prosince s čertem a andělem.",
      Masopust: "Masopust je zimní svátek masek, ještě před jarem.",
    },
    explanation:
      "Malování vajíček a pletení pomlázky patří k Velikonocům, které slavíme na jaře.",
  },
  {
    question: "Ke kterému svátku patří ozdobený stromeček, kapr a cukroví?",
    correctAnswer: "Vánoce",
    options: ["Velikonoce", "Dušičky", "Masopust", "Vánoce"],
    emoji: "🎄",
    hints: [
      "Všechny tři věci patří ke svátku na konci prosince.",
      "Kapr se jí na Štědrý večer, cukroví se peče celý advent a stromeček se zdobí před nadílkou od Ježíška.",
    ],
    optionFeedback: {
      Velikonoce: "O Velikonocích malujeme vajíčka, kapr ani stromeček k nim nepatří.",
      Dušičky: "Dušičky jsou tichá vzpomínka na zemřelé.",
      Masopust: "O Masopustu se jedí koblihy a nosí masky.",
    },
    explanation:
      "Stromeček, kapr a cukroví patří k Vánocům, které slavíme na konci prosince.",
  },
  {
    question: "V jakém ročním období slavíme Velikonoce?",
    correctAnswer: "Na jaře",
    options: ["Na jaře", "V zimě", "V létě", "Na podzim"],
    emoji: "🌷",
    hints: [
      "Vzpomeň si, co tehdy kvete na vrbách a jaké je venku počasí.",
      "Velikonoce bývají v březnu nebo dubnu. Sníh už roztál, kvetou kočičky a narcisy, ale na koupání v rybníce je ještě moc zima.",
    ],
    optionFeedback: {
      "V zimě": "V zimě slavíme Vánoce a Mikuláše, Velikonoce jsou později.",
      "V létě": "V létě jsou prázdniny, Velikonoce jsou dřív.",
      "Na podzim": "Na podzim jsou Dušičky, ne Velikonoce.",
    },
    explanation: "Velikonoce slavíme na jaře — v březnu nebo dubnu.",
  },
  {
    question: "V jakém ročním období slavíme Vánoce?",
    correctAnswer: "V zimě",
    options: ["Na jaře", "V zimě", "V létě", "Na podzim"],
    emoji: "❄️",
    hints: [
      "Tehdy bývá sníh a nejkratší dny v roce.",
      "Vánoce jsou na konci prosince. Venku mrzne, na horách se lyžuje a dny jsou tak krátké, že je tma už odpoledne.",
    ],
    optionFeedback: {
      "Na jaře": "Na jaře slavíme Velikonoce.",
      "V létě": "V létě jsou prázdniny, Vánoce jsou o půl roku dál.",
      "Na podzim": "Na podzim slavíme Dušičky, Vánoce přijdou až potom.",
    },
    explanation: "Vánoce slavíme v zimě, na konci prosince.",
  },
  {
    question: "Kdo chodí spolu s Mikulášem a čertem a rozdává hodným dětem sladkosti?",
    correctAnswer: "Anděl",
    options: ["Zajíc", "Kapr", "Anděl", "Ježíšek"],
    emoji: "😇",
    hints: [
      "Tato postava má bílá křídla a je oblečená v bílém.",
      "Na nadílce chodí tři postavy: Mikuláš s berlou, čert s řetězem a ještě jedna laskavá, která dětem podává dárky z košíku.",
    ],
    optionFeedback: {
      Zajíc: "Zajíc patří k Velikonocům, s Mikulášem nechodí.",
      Kapr: "Kapr je ryba k vánoční večeři.",
      Ježíšek: "Ježíšek nosí dárky až o Vánocích a nikdo ho nevidí.",
    },
    explanation:
      "S Mikulášem a čertem chodí i anděl, který rozdává hodným dětem sladkosti.",
  },
  {
    question: "Jaké tradiční jídlo se smaží o Masopustu?",
    correctAnswer: "Koblihy",
    options: ["Cukroví", "Mazanec", "Beránek", "Koblihy"],
    emoji: "🍩",
    hints: [
      "Je to kulaté smažené pečivo, často plněné marmeládou.",
      "O Masopustu se naposledy hoduje před dlouhým půstem. Smaží se kulaté kynuté pečivo, které se nakonec posype moučkovým cukrem.",
    ],
    optionFeedback: {
      Cukroví: "Cukroví pečeme na Vánoce.",
      Mazanec: "Mazanec je velikonoční pečivo.",
      Beránek: "Beránek se peče na Velikonoce.",
    },
    explanation: "O Masopustu se tradičně smaží koblihy.",
  },
  {
    question: "Kdy se pečou mazanec a velikonoční beránek?",
    correctAnswer: "O Velikonocích",
    options: ["O Velikonocích", "O Vánocích", "O Mikuláši", "O Masopustu"],
    emoji: "🐑",
    hints: [
      "Peče se to na stejný svátek, kdy malujeme vajíčka.",
      "Beránek je symbol jara a mazanec je kulatý bochník s křížem nahoře. Obojí se peče na jarní svátek s pomlázkou.",
    ],
    optionFeedback: {
      "O Vánocích": "O Vánocích pečeme cukroví a vánočku.",
      "O Mikuláši": "O Mikuláši dostávají děti sladkosti, beránek se nepeče.",
      "O Masopustu": "O Masopustu se smaží koblihy.",
    },
    explanation: "Mazanec a beránek se pečou o Velikonocích.",
  },
  {
    question: "Co dělají lidé o Dušičkách?",
    correctAnswer: "Navštěvují hroby a zapalují svíčky",
    options: ["Zdobí vánoční stromeček", "Navštěvují hroby a zapalují svíčky", "Malují velikonoční vajíčka", "Chodí v maskách v průvodu"],
    emoji: "🕯️",
    hints: [
      "Vzpomínají na příbuzné, kteří už nežijí.",
      "Dušičky jsou na začátku listopadu. Rodiny jdou na hřbitov, uklidí tam a na místo, kde odpočívá babička nebo dědeček, položí světýlko.",
    ],
    optionFeedback: {
      "Zdobí vánoční stromeček": "Stromeček zdobíme o Vánocích.",
      "Malují velikonoční vajíčka": "Vajíčka se malují o Velikonocích.",
      "Chodí v maskách v průvodu": "V maskách se chodí o Masopustu.",
    },
    explanation:
      "O Dušičkách lidé navštěvují hřbitovy, uklízejí hroby a zapalují svíčky na památku zemřelých.",
  },
  {
    question: "Ve kterém měsíci chodí Mikuláš s čertem a andělem?",
    correctAnswer: "V prosinci",
    options: ["V březnu", "V červnu", "V prosinci", "V září"],
    emoji: "📅",
    hints: [
      "Je to stejný měsíc, ve kterém jsou i Vánoce.",
      "Mikuláš přichází pátého dne toho měsíce, kdy už se těšíme na Štědrý den a peče se cukroví. Je to poslední měsíc v roce.",
    ],
    optionFeedback: {
      "V březnu": "V březnu začíná jaro, Mikuláš chodí v zimě.",
      "V červnu": "V červnu končí škola, Mikuláš chodí až na konci roku.",
      "V září": "V září začíná škola, na Mikuláše je ještě brzy.",
    },
    explanation:
      "Mikuláš s čertem a andělem chodí v prosinci — přesně 5. prosince večer.",
  },
  {
    question: "K čemu slouží adventní věnec se čtyřmi svíčkami?",
    correctAnswer: "K odpočítávání týdnů do Vánoc",
    options: ["K odpočítávání dnů do Velikonoc", "Je to ozdoba na Masopust", "Je to dárek pro Mikuláše", "K odpočítávání týdnů do Vánoc"],
    emoji: "🕯️",
    hints: [
      "Každou adventní neděli se zapálí jedna další svíčka.",
      "Adventní neděle jsou čtyři. První neděli hoří jedna svíčka, druhou neděli dvě… Až hoří všechny čtyři, je Štědrý den za dveřmi.",
    ],
    optionFeedback: {
      "K odpočítávání dnů do Velikonoc": "Věnec se čtyřmi svíčkami patří k adventu před Vánoci, ne k Velikonocům.",
      "Je to ozdoba na Masopust": "O Masopustu se nosí masky, adventní věnec k němu nepatří.",
      "Je to dárek pro Mikuláše": "Mikulášovi se dárky nedávají, to on je nosí dětem.",
    },
    explanation:
      "Adventní věnec se čtyřmi svíčkami slouží k odpočítávání čtyř týdnů před Vánocemi.",
  },
  {
    question: "Který jarní svátek má za symbol zajíce?",
    correctAnswer: "Velikonoce",
    options: ["Velikonoce", "Vánoce", "Mikuláš", "Dušičky"],
    emoji: "🐰",
    hints: [
      "Je to svátek, kdy malujeme vajíčka.",
      "Zajíc nosí v košíku barevná vajíčka a chlapci v tu dobu chodí s pomlázkou. Svátek bývá v březnu nebo dubnu.",
    ],
    optionFeedback: {
      Vánoce: "Vánoce jsou zimní svátek s Ježíškem.",
      Mikuláš: "Mikuláš je 5. prosince, symbolem je biskup s berlou.",
      Dušičky: "Dušičky jsou na podzim a patří k nim svíčky.",
    },
    explanation: "Zajíc je symbolem Velikonoc — jarního svátku.",
  },
  {
    question: "Který zimní svátek má za symbol Ježíška?",
    correctAnswer: "Vánoce",
    options: ["Velikonoce", "Vánoce", "Masopust", "Dušičky"],
    emoji: "⭐",
    hints: [
      "Je to svátek se stromečkem a dárky.",
      "Ježíšek podle tradice přinese dárky pod stromeček na Štědrý večer, 24. prosince. Který svátek tehdy začíná?",
    ],
    optionFeedback: {
      Velikonoce: "Velikonoce jsou jarní, jejich symbolem je zajíc a beránek.",
      Masopust: "Masopust je svátek masek a koblih.",
      Dušičky: "Dušičky jsou podzimní vzpomínka na zemřelé.",
    },
    explanation: "Ježíšek je symbolem Vánoc — zimního svátku s dárky.",
  },
  {
    question: "Co si lidé o Masopustu oblékají a v čem chodí v průvodu po vesnici?",
    correctAnswer: "Masky a kostýmy",
    options: ["Sváteční šaty na Velikonoce", "Zimní kabáty na Mikuláše", "Masky a kostýmy", "Bílé oblečení na Dušičky"],
    emoji: "🎭",
    hints: [
      "Přestrojí se za zvířata, čarodějnice nebo kominíky.",
      "V masopustním průvodu nepoznáš ani souseda, protože má obličej zakrytý a na sobě převlek třeba za medvěda. Co tedy lidé nosí?",
    ],
    optionFeedback: {
      "Sváteční šaty na Velikonoce": "Sváteční šaty se nosí o Velikonocích, v masopustním průvodu se ale chodí přestrojený.",
      "Zimní kabáty na Mikuláše": "Kabát je obyčejné oblečení, v průvodu jde o převlek.",
      "Bílé oblečení na Dušičky": "O Dušičkách se chodí na hřbitov, žádný průvod v převlecích to není.",
    },
    explanation:
      "O Masopustu si lidé oblékají masky a kostýmy. V nich pak chodí v průvodu po vesnici.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co přijde v roce dřív — mikulášská nadílka, nebo vánoční dárky?",
    correctAnswer: "Mikulášská nadílka",
    options: ["Vánoční dárky", "Obojí ve stejný den", "Nelze to určit", "Mikulášská nadílka"],
    emoji: "📅",
    hints: [
      "Mikuláš chodí 5. prosince, Vánoce slavíme až koncem prosince — co je dřív v kalendáři?",
      "Oba svátky jsou v prosinci, takže stačí porovnat čísla dnů. Pátý den měsíce je dřív než dvacátý čtvrtý. Který svátek připadá na menší číslo?",
    ],
    optionFeedback: {
      "Vánoční dárky": "Vánoční dárky dostáváme 24. prosince, to je později než 5. prosince.",
      "Obojí ve stejný den": "Nejsou ve stejný den — Mikuláš je 5. prosince, Štědrý den 24. prosince.",
      "Nelze to určit": "Určit to jde, obě data jsou pevně v kalendáři.",
    },
    explanation:
      "Mikulášská nadílka je 5. prosince. Vánoce slavíme až 24.–26. prosince. Mikuláš proto přijde dřív.",
  },
  {
    question: "Co je v kalendářním roce dřív — jarní Velikonoce, nebo podzimní Dušičky?",
    correctAnswer: "Velikonoce",
    options: ["Velikonoce", "Dušičky", "Slaví se ve stejném měsíci", "Nelze to určit"],
    emoji: "📅",
    hints: [
      "Rok jde po ročních obdobích popořadě: zima, jaro, léto, podzim. Co přijde dřív — jaro, nebo podzim?",
      "Rok začíná v lednu uprostřed zimy. Pak přijde jaro s kvetoucími kočičkami, potom léto s prázdninami a až nakonec podzim s padajícím listím. Najdi, který z obou svátků leží v této řadě dřív.",
    ],
    optionFeedback: {
      Dušičky: "Dušičky jsou až na podzim, začátkem listopadu — to je v roce později.",
      "Slaví se ve stejném měsíci": "Nejsou ve stejném měsíci: Velikonoce jsou v březnu či dubnu, Dušičky v listopadu.",
      "Nelze to určit": "Určit to jde — jaro je v roce vždy dřív než podzim.",
    },
    explanation:
      "Velikonoce slavíme na jaře. Dušičky slavíme až na podzim. Jaro je v roce dřív než podzim, takže Velikonoce jsou dřív.",
  },
  {
    question: "Který svátek slavíme v zimě a při kterém dětem nosí dárky Ježíšek?",
    correctAnswer: "Vánoce",
    options: ["Velikonoce", "Vánoce", "Mikuláš", "Masopust"],
    emoji: "🎄",
    hints: [
      "Hledej svátek, který splňuje obě podmínky zároveň — je v zimě a nosí dárky Ježíšek.",
      "Vylučuj postupně: jeden svátek z nabídky je jarní, další je sice v zimě, ale nadílku nosí někdo jiný, a třetí je zimní svátek masek. Který zbude?",
    ],
    optionFeedback: {
      Velikonoce: "Velikonoce jsou na jaře a vajíčka nosí zajíc, ne Ježíšek.",
      Mikuláš: "Mikuláš je sice v zimě, ale nadílku nosí on sám, ne Ježíšek.",
      Masopust: "Masopust je v zimě, ale Ježíšek k němu nepatří — patří k němu masky.",
    },
    explanation:
      "Vánoce se slaví v zimě a podle tradice při nich dětem nosí dárky Ježíšek — obě podmínky splňují jen Vánoce.",
  },
  {
    question: "Který svátek slavíme na jaře a patří k němu pomlázka z vrbových proutků?",
    correctAnswer: "Velikonoce",
    options: ["Vánoce", "Mikuláš", "Velikonoce", "Dušičky"],
    emoji: "🌿",
    hints: [
      "Hledej svátek, který je zároveň jarní a má pomlázku.",
      "Zkontroluj u každé možnosti obě podmínky. Svátky v zimě a na podzim vyřaď hned. Pomlázka se plete z vrbových proutků, když na vrbách kvetou kočičky.",
    ],
    optionFeedback: {
      Vánoce: "Vánoce jsou v zimě a pomlázka k nim nepatří.",
      Mikuláš: "Mikuláš je v prosinci, tedy v zimě.",
      Dušičky: "Dušičky jsou na podzim.",
    },
    explanation:
      "Velikonoce se slaví na jaře a patří k nim pomlázka z vrbových proutků — obě podmínky splňují jen Velikonoce.",
  },
  {
    question: "Který svátek připadá na 5. prosince a chodí při něm čert s andělem?",
    correctAnswer: "Mikuláš",
    options: ["Vánoce", "Velikonoce", "Masopust", "Mikuláš"],
    emoji: "😇",
    hints: [
      "Hledej svátek, který je zároveň na začátku prosince a má čerta i anděla.",
      "Vánoce jsou až 24. prosince a čert při nich nechodí. Velikonoce ani Masopust nejsou v prosinci. Který svátek z nabídky zbývá?",
    ],
    optionFeedback: {
      Vánoce: "Vánoce jsou až koncem prosince a čert při nich nechodí.",
      Velikonoce: "Velikonoce jsou na jaře.",
      Masopust: "Masopust bývá v únoru a chodí se v maskách, ne s andělem.",
    },
    explanation:
      "Mikuláš připadá na 5. prosince a chodí při něm čert s andělem — obě podmínky splňuje jen Mikuláš.",
  },
  {
    question:
      "Který svátek se slaví v zimě před Velikonocemi a lidé při něm chodí v maskách a průvodu?",
    correctAnswer: "Masopust",
    options: ["Masopust", "Vánoce", "Mikuláš", "Dušičky"],
    emoji: "🎭",
    hints: [
      "Hledej svátek, který je zároveň před jarními Velikonocemi a má masky.",
      "Vánoce a Mikuláš jsou sice v zimě, ale v prosinci a bez masek. Dušičky jsou na podzim. Hledej svátek, který přijde po Novém roce, ještě než začne jaro.",
    ],
    optionFeedback: {
      Vánoce: "Vánoce jsou v prosinci a masky k nim nepatří.",
      Mikuláš: "Mikuláš je v prosinci; čert sice bývá v masce, ale nejde o průvod celé vesnice.",
      Dušičky: "Dušičky jsou na podzim a jsou tichým svátkem.",
    },
    explanation:
      "Masopust se slaví v zimě, ještě před Velikonocemi, a patří k němu masky a průvod — obě podmínky splňuje jen Masopust.",
  },
  {
    question: "Který svátek je na podzim a lidé při něm navštěvují hroby a zapalují svíčky?",
    correctAnswer: "Dušičky",
    options: ["Vánoce", "Dušičky", "Velikonoce", "Mikuláš"],
    emoji: "🕯️",
    hints: [
      "Hledej svátek, který je zároveň na podzim a souvisí se vzpomínkou na zemřelé.",
      "Tři nabízené svátky jsou v zimě nebo na jaře a jsou veselé. Hledej tichý svátek začátkem listopadu, kdy lidé chodí na hřbitov.",
    ],
    optionFeedback: {
      Vánoce: "Vánoce jsou v zimě a jsou veselé, s dárky.",
      Velikonoce: "Velikonoce jsou na jaře.",
      Mikuláš: "Mikuláš je v prosinci a přináší nadílku.",
    },
    explanation:
      "Dušičky se slaví na podzim a lidé při nich navštěvují hroby a zapalují svíčky — obě podmínky splňují jen Dušičky.",
  },
  {
    question: "Co mají Vánoce i Mikuláš společné?",
    correctAnswer: "Oba svátky se slaví v zimě",
    options: ["Při obou svátcích chodí zajíc", "Oba svátky se slaví na jaře", "Oba svátky se slaví v zimě", "Při obou svátcích malujeme vajíčka"],
    emoji: "❄️",
    hints: [
      "Zamysli se, v jakém ročním období tyto dva svátky probíhají.",
      "Mikuláš přichází 5. prosince a Vánoce jsou 24. prosince. Oba jsou tedy ve stejném měsíci — do kterého ročního období prosinec patří?",
    ],
    optionFeedback: {
      "Při obou svátcích chodí zajíc": "Zajíc patří k Velikonocům, ani k jednomu z těchto svátků.",
      "Oba svátky se slaví na jaře": "Prosinec není jarní měsíc, jaro začíná až v březnu.",
      "Při obou svátcích malujeme vajíčka": "Vajíčka se malují jen o Velikonocích.",
    },
    explanation:
      "Vánoce i Mikuláš se slaví v zimě, na konci roku — Mikuláš 5. prosince, Vánoce koncem prosince.",
  },
  {
    question: "Kterou postavu nepotkáš o Vánocích, ale potkáš ji 5. prosince?",
    correctAnswer: "Čert",
    options: ["Ježíšek", "Zajíc", "Beránek", "Čert"],
    emoji: "👹",
    hints: [
      "Hledej postavu, která patří jen k mikulášské nadílce.",
      "Nejdřív vyřaď postavy, které k 5. prosinci vůbec nepatří — ty jarní. Pak vyřaď tu, kterou potkáš právě o Vánocích. Zbude postava s rohy a řetězem.",
    ],
    optionFeedback: {
      Ježíšek: "Ježíška naopak spojujeme s Vánocemi, 5. prosince nechodí.",
      Zajíc: "Zajíc nepatří ani k Vánocům, ani k 5. prosinci — patří k Velikonocům.",
      Beránek: "Beránek je symbol Velikonoc, 5. prosince nechodí.",
    },
    explanation:
      "Čert chodí 5. prosince spolu s Mikulášem a andělem, ale o Vánocích ho nepotkáš.",
  },
  {
    question: "Kterou postavu nepotkáš o Velikonocích, ale potkáš ji o Vánocích?",
    correctAnswer: "Ježíšek",
    options: ["Ježíšek", "Zajíc", "Beránek", "Kočičky"],
    emoji: "⭐",
    hints: [
      "Hledej postavu, která nosí dárky jen v zimě.",
      "Zajíc, beránek i kočičky na vrbě patří k jaru a k Velikonocům. Hledej postavu, která k jaru nepatří a přijde na Štědrý večer.",
    ],
    optionFeedback: {
      Zajíc: "Zajíce potkáš právě o Velikonocích, nosí vajíčka.",
      Beránek: "Beránek je velikonoční symbol, pečeme ho jako koláč.",
      Kočičky: "Kočičky jsou jarní květy vrby, patří k Velikonocům.",
    },
    explanation:
      "Ježíšek nosí dárky o Vánocích, ale o Velikonocích ho nepotkáš — tam patří zajíc, beránek nebo kočičky.",
  },
  {
    question: "Proč si na Velikonoce pletou chlapci pomlázku právě z vrbových proutků?",
    correctAnswer: "Protože vrbové proutky jsou pružné a dají se dobře splétat",
    options: ["Protože vrba kvete až v zimě", "Protože vrbové proutky jsou pružné a dají se dobře splétat", "Protože proutky jsou tvrdé jako dřevo", "Protože se pomlázka jí jako cukroví"],
    emoji: "🌿",
    hints: [
      "Zamysli se, jakou vlastnost musí mít proutky, aby se z nich dalo něco uplést.",
      "Představ si, že bys chtěl splést copánek ze suchých tvrdých klacíků — hned by praskly. Jaké proutky se dají ohnout, a přitom se nezlomí?",
    ],
    optionFeedback: {
      "Protože vrba kvete až v zimě": "Vrba kvete na jaře (kočičky), ne v zimě — a s pletením to nesouvisí.",
      "Protože proutky jsou tvrdé jako dřevo": "Tvrdé proutky by se při pletení lámaly.",
      "Protože se pomlázka jí jako cukroví": "Pomlázka se nejí, je to pletený proutek.",
    },
    explanation:
      "Vrbové proutky jsou pružné a ohebné, takže se z nich dá dobře uplést pomlázka.",
  },
  {
    question: "Který ze svátků slavíme dřív v roce — Masopust, nebo Velikonoce?",
    correctAnswer: "Masopust",
    options: ["Velikonoce", "Slaví se ve stejný den", "Masopust", "Nelze to určit"],
    emoji: "📅",
    hints: [
      "Jeden z těch svátků je zimní a druhý jarní. Zima přichází v roce dřív než jaro.",
      "Svátek masek je veselé loučení se zimou, po kterém přichází dlouhý čtyřicetidenní půst. Teprve po půstu přijdou jarní svátky s pomlázkou. Který svátek je tedy první?",
    ],
    optionFeedback: {
      Velikonoce: "Velikonoce jsou až na jaře, po Masopustu a půstu.",
      "Slaví se ve stejný den": "Nejsou ve stejný den — mezi nimi je dlouhý půst.",
      "Nelze to určit": "Určit to jde: Masopust je vždy před Velikonocemi.",
    },
    explanation:
      "Masopust se slaví v zimě, ještě před jarními Velikonocemi, takže je v roce dřív.",
  },
  {
    question: "Který svátek najdeš na podzim, a ne na jaře ani v zimě?",
    correctAnswer: "Dušičky",
    options: ["Vánoce", "Velikonoce", "Mikuláš", "Dušičky"],
    emoji: "🍂",
    hints: [
      "Zjisti u každého svátku, v jakém ročním období ho slavíme.",
      "Vánoce a Mikuláš jsou v prosinci, tedy v zimě. Velikonoce jsou na jaře. Který svátek z nabídky zbyl a slaví se začátkem listopadu?",
    ],
    optionFeedback: {
      Vánoce: "Vánoce jsou v zimě, na konci prosince.",
      Velikonoce: "Velikonoce jsou na jaře.",
      Mikuláš: "Mikuláš je 5. prosince, v zimě.",
    },
    explanation:
      "Dušičky jsou jediný z těchto svátků, který se slaví na podzim. Vánoce a Mikuláš jsou v zimě, Velikonoce jsou na jaře.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const TRADICEAZVYKY: TopicMetadata[] = [
  {
    id: "g2-prv-tradice",
    rvpNodeId: "g2-prvouka-lide-a-cas-mereni-casu-a-tradice-tradice-a-zvyky-vanoce-velikonoce-regionalni-svatky",
    title: "Tradice a zvyky",
    studentTitle: "Svátky a tradice",
    subject: "prvouka",
    category: "Lidé a čas",
    topic: "Měření času a tradice",
    briefDescription: "Poznáš Vánoce, Velikonoce a zvyky.",
    keywords: ["tradice", "zvyky", "Vánoce", "Velikonoce", "svátky", "koledy"],
    goals: [
      "Poznat hlavní svátky v roce.",
      "Vědět, co patří k Vánocům a Velikonocům.",
      "Znát tradiční zvyky.",
    ],
    boundaries: ["Pouze známé svátky.", "Bez historie svátků."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Vánoce = stromeček a kapr. Velikonoce = vajíčka a pomlázka.",
      steps: ["Přečti otázku.", "Který svátek to je?"],
      commonMistake: "Záměna Vánoc a Velikonoc.",
      example: "O Vánocích zdobíme stromeček a jíme kapra.",
    },
  },
];
