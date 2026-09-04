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
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Kdy zdobíme vánoční stromeček ozdobami?",
    correctAnswer: "Vánoce",
    options: ["Vánoce", "Velikonoce", "Masopust", "Dušičky"],
    emoji: "🎄",
    hints: ["Stromeček zdobíme na zimní svátek — na konci prosince."],
    explanation: "Stromeček zdobíme o Vánocích, které slavíme na konci prosince.",
  },
  {
    question: "Kdy malujeme velikonoční vajíčka?",
    correctAnswer: "Velikonoce",
    options: ["Vánoce", "Velikonoce", "Mikuláš", "Dušičky"],
    emoji: "🥚",
    hints: ["Vajíčka malujeme na jarní svátek, ne v zimě."],
    explanation: "Vajíčka malujeme o Velikonocích, které slavíme na jaře.",
  },
  {
    question: "Co jíme tradičně na Štědrý den k večeři?",
    correctAnswer: "Kapr",
    options: ["Beránek", "Koblihy", "Kapr", "Perník"],
    emoji: "🐟",
    hints: ["Je to ryba, která žije ve vodě."],
    explanation: "Na Štědrý den se tradičně jí kapr — sváteční vánoční ryba.",
  },
  {
    question: "Co dáváme pod vánoční stromeček?",
    correctAnswer: "Dárky",
    options: ["Vajíčka", "Masky", "Svíčky na hrob", "Dárky"],
    emoji: "🎁",
    hints: ["Jsou to balíčky, které rozbalujeme o Vánocích."],
    explanation: "Pod stromeček dáváme dárky, které si o Vánocích rozbalujeme.",
  },
  {
    question: "Kdo podle tradice nosí dětem dárky o Vánocích?",
    correctAnswer: "Ježíšek",
    options: ["Ježíšek", "Mikuláš", "Anděl", "Zajíc"],
    emoji: "⭐",
    hints: ["Jeho jméno souvisí s Vánocemi a najdeš ho i v koledách."],
    explanation: "O Vánocích nosí podle tradice dárky Ježíšek.",
  },
  {
    question: "Které zvíře nosí podle tradice o Velikonocích vajíčka?",
    correctAnswer: "Zajíc",
    options: ["Beránek", "Zajíc", "Kapr", "Čert"],
    emoji: "🐰",
    hints: ["Je to zvíře s dlouhýma ušima, které rychle skáče."],
    explanation: "O Velikonocích nosí podle tradice vajíčka zajíc.",
  },
  {
    question: "Co si chlapci pletou na Velikonoce z vrbových proutků?",
    correctAnswer: "Pomlázku",
    options: ["Adventní věnec", "Betlém", "Pomlázku", "Koledu"],
    emoji: "🌿",
    hints: ["S touto věcí chodí chlapci o Velikonočním pondělí po domech."],
    explanation: "Chlapci si na Velikonoce pletou pomlázku z vrbových proutků.",
  },
  {
    question: "Kdo chodí 5. prosince večer spolu s čertem?",
    correctAnswer: "Mikuláš",
    options: ["Ježíšek", "Zajíc", "Kostelník", "Mikuláš"],
    emoji: "😇",
    hints: ["Přichází večer s andělem a čertem a naděluje hodným dětem."],
    explanation: "5. prosince večer chodí Mikuláš spolu s čertem a andělem.",
  },
  {
    question: "Kdo straší 5. prosince zlobivé děti?",
    correctAnswer: "Čert",
    options: ["Čert", "Anděl", "Ježíšek", "Zajíc"],
    emoji: "👹",
    hints: ["Je to postava s rohy a ocasem, celá černá."],
    explanation: "Zlobivé děti straší 5. prosince čert.",
  },
  {
    question: "Co je typické pro masopustní průvod?",
    correctAnswer: "Masky",
    options: ["Malovaná vajíčka", "Masky", "Vánoční ozdoby", "Svíčky na hrob"],
    emoji: "🎭",
    hints: ["Lidé si je nasadí na obličej a přestrojí se za různé postavy."],
    explanation: "Pro masopustní průvod jsou typické masky, do kterých se lidé přestrojují.",
  },
  {
    question: "Co lidé zapalují o Dušičkách na hrobech?",
    correctAnswer: "Svíčky",
    options: ["Adventní věnec", "Cukroví", "Svíčky", "Pomlázku"],
    emoji: "🕯️",
    hints: ["Je to malý plamínek, který svítí ve tmě."],
    explanation: "O Dušičkách lidé zapalují na hrobech svíčky a vzpomínají na zemřelé.",
  },
  {
    question: "Co zpíváme o Vánocích?",
    correctAnswer: "Koledy",
    options: ["Hymny", "Básničky", "Hádanky", "Koledy"],
    emoji: "🎶",
    hints: ["Jsou to písničky o Ježíškovi a betlémské hvězdě."],
    explanation: "O Vánocích zpíváme koledy, například Narodil se Kristus Pán.",
  },
  {
    question: "Co pečeme o Vánocích?",
    correctAnswer: "Cukroví",
    options: ["Cukroví", "Vajíčka", "Masky", "Svíčky"],
    emoji: "🍪",
    hints: ["Je to sladké pečivo — perníčky, vanilkové rohlíčky a podobně."],
    explanation: "O Vánocích pečeme cukroví — sladké pečivo různých tvarů.",
  },
  {
    question: "Co svítí na vánočním stromečku?",
    correctAnswer: "Svíčky",
    options: ["Vajíčka", "Svíčky", "Pomlázky", "Masky"],
    emoji: "🕯️",
    hints: ["Na stromečku svítí ozdoby — plamenem nebo elektřinou."],
    explanation: "Na vánočním stromečku svítí svíčky nebo elektrická světýlka.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ke kterému svátku patří malování vajíček a pletení pomlázky?",
    correctAnswer: "Velikonoce",
    options: ["Vánoce", "Mikuláš", "Velikonoce", "Masopust"],
    emoji: "🥚",
    hints: ["Oba zvyky patří ke svátku, který slavíme na jaře."],
    explanation:
      "Malování vajíček a pletení pomlázky patří k Velikonocům, které slavíme na jaře.",
  },
  {
    question: "Ke kterému svátku patří ozdobený stromeček, kapr a cukroví?",
    correctAnswer: "Vánoce",
    options: ["Velikonoce", "Dušičky", "Masopust", "Vánoce"],
    emoji: "🎄",
    hints: ["Všechny tři věci patří ke svátku na konci prosince."],
    explanation:
      "Stromeček, kapr a cukroví patří k Vánocům, které slavíme na konci prosince.",
  },
  {
    question: "V jakém ročním období slavíme Velikonoce?",
    correctAnswer: "Na jaře",
    options: ["Na jaře", "V zimě", "V létě", "Na podzim"],
    emoji: "🌷",
    hints: ["Tehdy kvetou první jarní květiny a příroda se probouzí."],
    explanation: "Velikonoce slavíme na jaře — v březnu nebo dubnu.",
  },
  {
    question: "V jakém ročním období slavíme Vánoce?",
    correctAnswer: "V zimě",
    options: ["Na jaře", "V zimě", "V létě", "Na podzim"],
    emoji: "❄️",
    hints: ["Tehdy bývá sníh a nejkratší dny v roce."],
    explanation: "Vánoce slavíme v zimě, na konci prosince.",
  },
  {
    question: "Kdo chodí spolu s Mikulášem a čertem a rozdává hodným dětem sladkosti?",
    correctAnswer: "Anděl",
    options: ["Zajíc", "Kapr", "Anděl", "Ježíšek"],
    emoji: "😇",
    hints: ["Tato postava má bílé křídla a je oblečená v bílém."],
    explanation:
      "S Mikulášem a čertem chodí i anděl, který rozdává hodným dětem sladkosti.",
  },
  {
    question: "Jaké tradiční jídlo se peče a smaží o Masopustu?",
    correctAnswer: "Koblihy",
    options: ["Cukroví", "Mazanec", "Beránek", "Koblihy"],
    emoji: "🍩",
    hints: ["Je to kulaté smažené pečivo, často plněné marmeládou."],
    explanation: "O Masopustu se tradičně pečou a smaží koblihy.",
  },
  {
    question: "Kdy se pečou mazanec a velikonoční beránek?",
    correctAnswer: "O Velikonocích",
    options: ["O Velikonocích", "O Vánocích", "O Mikuláši", "O Masopustu"],
    emoji: "🐑",
    hints: ["Peče se to na stejný svátek, kdy malujeme vajíčka."],
    explanation: "Mazanec a beránek se pečou o Velikonocích.",
  },
  {
    question: "Co dělají lidé o Dušičkách?",
    correctAnswer: "Navštěvují hroby a zapalují svíčky",
    options: ["Zdobí vánoční stromeček", "Navštěvují hroby a zapalují svíčky", "Malují velikonoční vajíčka", "Chodí v maskách v průvodu"],
    emoji: "🕯️",
    hints: ["Vzpomínají na příbuzné, kteří už nežijí."],
    explanation:
      "O Dušičkách lidé navštěvují hřbitovy, uklízejí hroby a zapalují svíčky na památku zemřelých.",
  },
  {
    question: "Ve kterém měsíci chodí Mikuláš s čertem a andělem?",
    correctAnswer: "V prosinci",
    options: ["V březnu", "V červnu", "V prosinci", "V září"],
    emoji: "📅",
    hints: ["Je to stejný měsíc, ve kterém jsou i Vánoce."],
    explanation:
      "Mikuláš s čertem a andělem chodí v prosinci — přesně 5. prosince večer.",
  },
  {
    question: "K čemu slouží adventní věnec se čtyřmi svíčkami?",
    correctAnswer: "K odpočítávání týdnů do Vánoc",
    options: ["K odpočítávání dnů do Velikonoc", "Je to ozdoba na Masopust", "Je to dárek pro Mikuláše", "K odpočítávání týdnů do Vánoc"],
    emoji: "🕯️",
    hints: ["Každý týden před Vánoci se zapálí jedna další svíčka."],
    explanation:
      "Adventní věnec se čtyřmi svíčkami slouží k odpočítávání čtyř týdnů před Vánocemi.",
  },
  {
    question: "Který jarní svátek má za symbol zajíce?",
    correctAnswer: "Velikonoce",
    options: ["Velikonoce", "Vánoce", "Mikuláš", "Dušičky"],
    emoji: "🐰",
    hints: ["Je to svátek, kdy malujeme vajíčka."],
    explanation: "Zajíc je symbolem Velikonoc — jarního svátku.",
  },
  {
    question: "Který zimní svátek má za symbol Ježíška?",
    correctAnswer: "Vánoce",
    options: ["Velikonoce", "Vánoce", "Masopust", "Dušičky"],
    emoji: "⭐",
    hints: ["Je to svátek se stromečkem a dárky."],
    explanation: "Ježíšek je symbolem Vánoc — zimního svátku s dárky.",
  },
  {
    question: "Co si lidé o Masopustu oblékají a v čem chodí v průvodu po vesnici?",
    correctAnswer: "Masky a kostýmy",
    options: ["Sváteční šaty na Velikonoce", "Zimní kabáty na Mikuláše", "Masky a kostýmy", "Bílé oblečení na Dušičky"],
    emoji: "🎭",
    hints: ["Přestrojí se za zvířata, čarodějnice nebo jiné postavy — tvář často zakrývá maska."],
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
    ],
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
    ],
    explanation:
      "Velikonoce slavíme na jaře. Dušičky slavíme až na podzim. Jaro je v roce dřív než podzim, takže Velikonoce jsou dřív.",
  },
  {
    question: "Který svátek slavíme v zimě a při kterém dětem nosí dárky Ježíšek?",
    correctAnswer: "Vánoce",
    options: ["Velikonoce", "Vánoce", "Mikuláš", "Masopust"],
    emoji: "🎄",
    hints: ["Hledej svátek, který splňuje obě podmínky zároveň — je v zimě a nosí dárky Ježíšek."],
    explanation:
      "Vánoce se slaví v zimě a podle tradice při nich dětem nosí dárky Ježíšek — obě podmínky splňují jen Vánoce.",
  },
  {
    question: "Který svátek slavíme na jaře a patří k němu pomlázka z vrbových proutků?",
    correctAnswer: "Velikonoce",
    options: ["Vánoce", "Mikuláš", "Velikonoce", "Dušičky"],
    emoji: "🌿",
    hints: ["Hledej svátek, který je zároveň jarní a má pomlázku."],
    explanation:
      "Velikonoce se slaví na jaře a patří k nim pomlázka z vrbových proutků — obě podmínky splňují jen Velikonoce.",
  },
  {
    question: "Který svátek připadá na 5. prosince a chodí při něm čert s andělem?",
    correctAnswer: "Mikuláš",
    options: ["Vánoce", "Velikonoce", "Masopust", "Mikuláš"],
    emoji: "😇",
    hints: ["Hledej svátek, který je zároveň na začátku prosince a má čerta i anděla."],
    explanation:
      "Mikuláš připadá na 5. prosince a chodí při něm čert s andělem — obě podmínky splňuje jen Mikuláš.",
  },
  {
    question:
      "Který svátek se slaví v zimě před Velikonocemi a lidé při něm chodí v maskách a průvodu?",
    correctAnswer: "Masopust",
    options: ["Masopust", "Vánoce", "Mikuláš", "Dušičky"],
    emoji: "🎭",
    hints: ["Hledej svátek, který je zároveň před jarními Velikonocemi a má masky."],
    explanation:
      "Masopust se slaví v zimě, ještě před Velikonocemi, a patří k němu masky a průvod — obě podmínky splňuje jen Masopust.",
  },
  {
    question: "Který svátek je na podzim a lidé při něm navštěvují hroby a zapalují svíčky?",
    correctAnswer: "Dušičky",
    options: ["Vánoce", "Dušičky", "Velikonoce", "Mikuláš"],
    emoji: "🕯️",
    hints: ["Hledej svátek, který je zároveň na podzim a souvisí se vzpomínkou na zemřelé."],
    explanation:
      "Dušičky se slaví na podzim a lidé při nich navštěvují hroby a zapalují svíčky — obě podmínky splňují jen Dušičky.",
  },
  {
    question: "Co mají Vánoce i Mikuláš společné?",
    correctAnswer: "Oba svátky se slaví v zimě",
    options: ["Při obou svátcích chodí zajíc", "Oba svátky se slaví na jaře", "Oba svátky se slaví v zimě", "Při obou svátcích malujeme vajíčka"],
    emoji: "❄️",
    hints: ["Zamysli se, v jakém ročním období tyto dva svátky probíhají."],
    explanation:
      "Vánoce i Mikuláš se slaví v zimě, na konci roku — Mikuláš 5. prosince, Vánoce koncem prosince.",
  },
  {
    question: "Kterou postavu nepotkáš o Vánocích, ale potkáš ji 5. prosince?",
    correctAnswer: "Čert",
    options: ["Ježíšek", "Zajíc", "Beránek", "Čert"],
    emoji: "👹",
    hints: ["Hledej postavu, která patří jen k mikulášské nadílce."],
    explanation:
      "Čert chodí 5. prosince spolu s Mikulášem a andělem, ale o Vánocích ho nepotkáš.",
  },
  {
    question: "Kterou postavu nepotkáš o Velikonocích, ale potkáš ji o Vánocích?",
    correctAnswer: "Ježíšek",
    options: ["Ježíšek", "Zajíc", "Beránek", "Kočičky"],
    emoji: "⭐",
    hints: ["Hledej postavu, která nosí dárky jen v zimě."],
    explanation:
      "Ježíšek nosí dárky o Vánocích, ale o Velikonocích ho nepotkáš — tam patří zajíc, beránek nebo kočičky.",
  },
  {
    question: "Proč si na Velikonoce pletou chlapci pomlázku právě z vrbových proutků?",
    correctAnswer: "Protože vrbové proutky jsou pružné a dají se dobře splétat",
    options: ["Protože vrba kvete až v zimě", "Protože vrbové proutky jsou pružné a dají se dobře splétat", "Protože proutky jsou tvrdé jako dřevo", "Protože se pomlázka jí jako cukroví"],
    emoji: "🌿",
    hints: ["Zamysli se, jakou vlastnost musí mít proutky, aby se z nich dalo něco uplést."],
    explanation:
      "Vrbové proutky jsou pružné a ohebné, takže se z nich dá dobře uplést pomlázka.",
  },
  {
    question: "Který ze svátků slavíme dřív v roce — Masopust, nebo Velikonoce?",
    correctAnswer: "Masopust",
    options: ["Velikonoce", "Slaví se ve stejný den", "Masopust", "Nelze to určit"],
    emoji: "📅",
    hints: ["Jeden z těch svátků je zimní a druhý jarní. Zima přichází v roce dřív než jaro."],
    explanation:
      "Masopust se slaví v zimě, ještě před jarními Velikonocemi, takže je v roce dřív.",
  },
  {
    question: "Který svátek najdeš na podzim, a ne na jaře ani v zimě?",
    correctAnswer: "Dušičky",
    options: ["Vánoce", "Velikonoce", "Mikuláš", "Dušičky"],
    emoji: "🍂",
    hints: ["Vylučuj postupně: Vánoce a Mikuláš jsou v zimě, Velikonoce na jaře. Co zbývá?"],
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
