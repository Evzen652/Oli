import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ANO = "Ano, to je pravda";
const NE = "Ne, to není pravda";

interface TrueFalseItem {
  question: string;
  correct: boolean;
  emoji: string;
  hint: string;
  solution: string;
}

function toTask(item: TrueFalseItem): PracticeTask {
  return {
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [item.hint],
    explanation: item.solution,
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3) pro 2. ročník.
//   L1 = rozpoznání izolovaného faktu o zimě a zvířatech: kdo spí,
//        kdo odlétá, kdo zůstává, čím krmit ptáky — formát Ano/Ne
//        (2 možnosti).
//   L2 = aplikace: přiřazení strategie přezimování ke zvířeti,
//        poznání zvířete podle popisu, čím se krmí v krmítku —
//        výběr ze 4 možností.
//   L3 = transfer (kombinace dvou faktů, rozlišení blízkých strategií
//        zimní spánek / odlet / aktivní zima, otázky „proč“) —
//        většinou 4 možnosti, jen menšina Ano/Ne.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Medvěd v zimě spí ve svém doupěti. Je to pravda?",
    correct: true,
    emoji: "🐻",
    hint: "Medvěd se na zimu uloží do doupěte a co tam dělá až do jara?",
    solution: "Medvěd v zimě spí — ukládá se do doupěte a prospí většinu zimy.",
  },
  {
    question: "Ježek v zimě spí zimním spánkem. Je to pravda?",
    correct: true,
    emoji: "🦔",
    hint: "Ježek si udělá pelíšek z listí a v zimě se v něm uloží ke spánku.",
    solution: "Ježek v zimě spí zimním spánkem — přespí ji v pelíšku z listí až do jara.",
  },
  {
    question: "Netopýr přezimuje ve spánku v úkrytu. Je to pravda?",
    correct: true,
    emoji: "🦇",
    hint: "Netopýr se schová do jeskyně nebo na půdu a přečká tam zimu.",
    solution: "Netopýr v zimě spí — přezimuje zavěšený v úkrytu, třeba v jeskyni nebo na půdě.",
  },
  {
    question: "Vlaštovka na zimu odlétá do teplých krajů. Je to pravda?",
    correct: true,
    emoji: "🐦",
    hint: "Vlaštovka je tažný pták — na podzim se vydává na dalekou cestu na jih.",
    solution: "Vlaštovka na zimu odlétá do teplých krajů — je to tažný pták, který zimuje v Africe.",
  },
  {
    question: "Čáp na zimu odlétá do teplých krajů. Je to pravda?",
    correct: true,
    emoji: "🕊️",
    hint: "Čápa v zimě u nás nevidíme — je to tažný pták, kam letí?",
    solution: "Čáp na zimu odlétá do teplých krajů — je to tažný pták, který zimuje v Africe.",
  },
  {
    question: "Sýkorka u nás zůstává celou zimu. Je to pravda?",
    correct: true,
    emoji: "🐦",
    hint: "Sýkorku vídáme u krmítka i v mrazu — odlétá, nebo zůstává?",
    solution: "Sýkorka u nás zůstává celou zimu — v zimě přilétá ke krmítku pro potravu.",
  },
  {
    question: "Vrabec na zimu odlétá do Afriky. Je to pravda?",
    correct: false,
    emoji: "🐦",
    hint: "Vrabce vídáme u domů a krmítek i v zimě — je to tažný pták?",
    solution: "Vrabec na zimu neodlétá — zůstává u nás celou zimu.",
  },
  {
    question: "V zimě přikrmujeme ptáky v krmítku. Je to pravda?",
    correct: true,
    emoji: "🐦",
    hint: "V zimě ptáci hůř hledají potravu pod sněhem — jak jim pomůžeme?",
    solution: "V zimě přikrmujeme ptáky — dáváme jim do krmítka semínka a nesolený lůj.",
  },
  {
    question: "Vlaštovka zůstává u nás celou zimu. Je to pravda?",
    correct: false,
    emoji: "🐦",
    hint: "Vlaštovka potřebuje teplo a hmyz — najde tohle u nás v zimě?",
    solution: "Vlaštovka u nás celou zimu nezůstává — na zimu odlétá do teplých krajů.",
  },
  {
    question: "Veverka si na zimu dělá zásoby. Je to pravda?",
    correct: true,
    emoji: "🐿️",
    hint: "Veverka na podzim sbírá oříšky a žaludy — proč si je schovává?",
    solution: "Veverka si na zimu dělá zásoby — schovává si oříšky a žaludy do skrýší.",
  },
  {
    question: "Liška v zimě nespí a je aktivní. Je to pravda?",
    correct: true,
    emoji: "🦊",
    hint: "Lišku v zimě potkáme venku, jak shání potravu — spí, nebo je aktivní?",
    solution: "Liška v zimě nespí — je aktivní a shání si potravu i v mrazu.",
  },
  {
    question: "Zajíc má v zimě hustší srst. Je to pravda?",
    correct: true,
    emoji: "🐇",
    hint: "Zajíc v zimě nespí ani neodlétá — jak se chrání před mrazem?",
    solution: "Zajíc má v zimě hustší srst — ta ho chrání před chladem.",
  },
  {
    question: "Strakapoud u nás v zimě zůstává. Je to pravda?",
    correct: true,
    emoji: "🐦",
    hint: "Strakapouda vídáme klovat do stromů i v zimě — odlétá, nebo zůstává?",
    solution: "Strakapoud u nás v zimě zůstává — nachází potravu ve stromech i v mrazu.",
  },
  {
    question: "Žába v zimě spí zahrabaná v bahně. Je to pravda?",
    correct: true,
    emoji: "🐸",
    hint: "Žába v zimě nesnese chlad — kam se schová na dně rybníka?",
    solution: "Žába v zimě spí — zahrabuje se do bahna na dně rybníka až do jara.",
  },
  {
    question: "Medvěd na zimu odlétá do teplých krajů. Je to pravda?",
    correct: false,
    emoji: "🐻",
    hint: "Medvěd nemá křídla — co dělá v zimě místo odletu?",
    solution: "Medvěd na zimu neodlétá — ukládá se do doupěte a spí.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Které z těchto zvířat v zimě spí zimním spánkem?",
    correctAnswer: "Ježek",
    options: ["Ježek", "Liška", "Srnec", "Zajíc"],
    emoji: "🦔",
    hints: [
      "Hledej zvíře, které se na zimu uloží do pelíšku a prospí ji.",
      "Liška, srnec i zajíc jsou v zimě venku aktivní.",
    ],
    explanation:
      "Ježek v zimě spí zimním spánkem v pelíšku z listí. Liška, srnec i zajíc v zimě nespí — zůstávají aktivní.",
  },
  {
    question: "Který z těchto ptáků na zimu odlétá do teplých krajů?",
    correctAnswer: "Vlaštovka",
    options: ["Sýkorka", "Vlaštovka", "Vrabec", "Kos"],
    emoji: "🐦",
    hints: [
      "Hledej tažného ptáka, který u nás v zimě nezůstává.",
      "Sýkorku, vrabce i kosa vídáme u nás i v zimě.",
    ],
    explanation:
      "Vlaštovka je tažný pták a na zimu odlétá do teplých krajů. Sýkorka, vrabec i kos u nás v zimě zůstávají.",
  },
  {
    question: "Který z těchto ptáků u nás zůstává celou zimu?",
    correctAnswer: "Sýkorka",
    options: ["Vlaštovka", "Čáp", "Sýkorka", "Špaček"],
    emoji: "🐦",
    hints: [
      "Kterého ptáka vídáme v zimě u krmítka?",
      "Vlaštovka, čáp i špaček jsou tažní ptáci a na zimu odlétají.",
    ],
    explanation:
      "Sýkorka u nás zůstává celou zimu a přilétá ke krmítku. Vlaštovka, čáp i špaček na zimu odlétají do teplých krajů.",
  },
  {
    question: "Čím správně přikrmujeme ptáky v krmítku?",
    correctAnswer: "Slunečnicovými semínky",
    options: ["Slanými brambůrky", "Plesnivým chlebem", "Bonbony", "Slunečnicovými semínky"],
    emoji: "🌻",
    hints: [
      "Ptákům svědčí semínka a nesolený tuk, ne lidské pochutiny.",
      "Slané, plesnivé a sladké potraviny ptákům škodí.",
    ],
    explanation:
      "Ptáky přikrmujeme slunečnicovými semínky a nesoleným lojem. Slané brambůrky, plesnivý chléb ani bonbony jim nesvědčí.",
  },
  {
    question: "Které zvíře si na zimu dělá zásoby oříšků a žaludů?",
    correctAnswer: "Veverka",
    options: ["Veverka", "Medvěd", "Vlaštovka", "Žába"],
    emoji: "🐿️",
    hints: [
      "Hledej zvíře, které na podzim sbírá oříšky a schovává si je.",
      "Medvěd v zimě spí, vlaštovka odlétá a žába spí v bahně.",
    ],
    explanation:
      "Veverka si na zimu dělá zásoby oříšků a žaludů. Medvěd v zimě spí, vlaštovka odlétá a žába přezimuje v bahně.",
  },
  {
    question: "Co dělá medvěd v zimě?",
    correctAnswer: "Spí ve svém doupěti",
    options: ["Odlétá do Afriky", "Spí ve svém doupěti", "Staví si hnízdo na stromě", "Loví ryby v ledové řece"],
    emoji: "🐻",
    hints: [
      "Medvěd nemá křídla ani nezůstává v zimě aktivní.",
      "Kam se medvěd uloží, aby prospal zimu?",
    ],
    explanation:
      "Medvěd v zimě spí ve svém doupěti. Neodlétá, nestaví si hnízdo na stromě ani v zimě neloví.",
  },
  {
    question: "Co dělá vlaštovka, když přijde zima?",
    correctAnswer: "Odlétá do teplých krajů",
    options: ["Spí v pelíšku z listí", "Zůstává celou zimu u krmítka", "Odlétá do teplých krajů", "Dělá si zásoby oříšků"],
    emoji: "🐦",
    hints: [
      "Vlaštovka potřebuje hmyz, kterého je v zimě nedostatek.",
      "Je to tažný pták — co dělají tažní ptáci na podzim?",
    ],
    explanation:
      "Vlaštovka na zimu odlétá do teplých krajů. Nespí, nezůstává u krmítka ani si nedělá zásoby.",
  },
  {
    question: "Kam se ježek ukládá k zimnímu spánku?",
    correctAnswer: "Do pelíšku z listí",
    options: ["Na větev vysokého stromu", "Do ptačí budky", "Do teplých krajů", "Do pelíšku z listí"],
    emoji: "🦔",
    hints: [
      "Ježek hledá suché a teplé místo blízko země.",
      "Z čeho si ježek na podzim staví úkryt na spaní?",
    ],
    explanation:
      "Ježek se ukládá k zimnímu spánku do pelíšku z listí u země. Na stromě, v budce ani v teplých krajích ho nenajdeme.",
  },
  {
    question: "Které zvíře je v zimě aktivní a nespí zimním spánkem?",
    correctAnswer: "Liška",
    options: ["Liška", "Ježek", "Netopýr", "Plch"],
    emoji: "🦊",
    hints: [
      "Hledej zvíře, které i v mrazu shání potravu venku.",
      "Ježek, netopýr i plch přes zimu spí.",
    ],
    explanation:
      "Liška je v zimě aktivní a shání si potravu. Ježek, netopýr i plch naopak přes zimu spí.",
  },
  {
    question: "Poznáš zvíře: „V zimě spí v jeskyni nebo na půdě zavěšené hlavou dolů.“",
    correctAnswer: "Netopýr",
    options: ["Sýkorka", "Netopýr", "Zajíc", "Liška"],
    emoji: "🦇",
    hints: [
      "Které zvíře umí viset hlavou dolů a přes zimu spí?",
      "Sýkorka zůstává aktivní, zajíc a liška v zimě nespí.",
    ],
    explanation:
      "Popis sedí na netopýra — spí zavěšený hlavou dolů v jeskyni nebo na půdě. Sýkorka, zajíc ani liška v zimě takto nespí.",
  },
  {
    question: "Co ptákům do krmítka NEDÁVÁME?",
    correctAnswer: "Slané a kořeněné zbytky jídla",
    options: ["Slunečnicová semínka", "Nesolený lůj", "Slané a kořeněné zbytky jídla", "Zrní"],
    emoji: "🧂",
    hints: [
      "Které jídlo je pro ptáky nezdravé a škodí jim?",
      "Semínka, nesolený lůj a zrní jsou pro ptáky vhodné.",
    ],
    explanation:
      "Slané a kořeněné zbytky ptákům škodí, proto je do krmítka nedáváme. Semínka, nesolený lůj a zrní jsou naopak vhodné.",
  },
  {
    question: "Který pták přilétá v zimě ke krmítku pro semínka?",
    correctAnswer: "Sýkorka",
    options: ["Vlaštovka", "Čáp", "Jiřička", "Sýkorka"],
    emoji: "🐦",
    hints: [
      "Kterého ptáka vídáme u krmítka i v mrazu?",
      "Vlaštovka, čáp i jiřička na zimu odlétají.",
    ],
    explanation:
      "Sýkorka u nás v zimě zůstává a přilétá ke krmítku pro semínka. Vlaštovka, čáp i jiřička na zimu odlétají.",
  },
  {
    question: "Jak se zajíc chrání před zimním mrazem?",
    correctAnswer: "Naroste mu hustší srst",
    options: [
      "Naroste mu hustší srst",
      "Odlétá do teplých krajů",
      "Spí až do jara v doupěti",
      "Schová se do ptačího krmítka",
    ],
    emoji: "🐇",
    hints: [
      "Zajíc v zimě neodlétá ani nespí — zůstává venku.",
      "Co zajíci naroste, aby mu nebyla zima?",
    ],
    explanation:
      "Zajíce před mrazem chrání hustší zimní srst. Neodlétá, nespí zimním spánkem ani se neschovává do krmítka.",
  },
  {
    question: "Kde přečkává žába zimu?",
    correctAnswer: "Zahrabaná v bahně na dně rybníka",
    options: ["V ptačí budce", "Zahrabaná v bahně na dně rybníka", "V teplých krajích v Africe", "Na větvi vysokého stromu"],
    emoji: "🐸",
    hints: [
      "Žába nesnese chlad a schovává se dolů do vody.",
      "Schová se hluboko pod hladinu, kam přes zimu nedosáhne mráz.",
    ],
    explanation:
      "Žába přečkává zimu zahrabaná v bahně na dně rybníka. V budce, v Africe ani na stromě ji nenajdeme.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Které zvíře v zimě NEspí zimním spánkem ani neodlétá, ale zůstává venku aktivní?",
    correctAnswer: "Liška",
    options: ["Ježek", "Vlaštovka", "Liška", "Netopýr"],
    emoji: "🦊",
    hints: [
      "Rozliš tři strategie: spánek, odlet a aktivní zima.",
      "Ježek a netopýr spí, vlaštovka odlétá — které zvíře zbývá?",
    ],
    explanation:
      "Liška v zimě nespí ani neodlétá — zůstává aktivní a shání potravu. Ježek a netopýr spí, vlaštovka odlétá do tepla.",
  },
  {
    question: "Proč vlaštovka na zimu odlétá do teplých krajů?",
    correctAnswer: "V zimě u nás nenajde dost hmyzu, kterým se živí",
    options: ["Protože je jí v zimě jenom zima", "Protože se chce podívat do Afriky", "Protože v teple se jí líp spí zimní spánek", "V zimě u nás nenajde dost hmyzu, kterým se živí"],
    emoji: "🐦",
    hints: [
      "Přemýšlej, co vlaštovka jí a jestli to v zimě u nás najde.",
      "Sýkorka mráz snese a zůstává — vlaštovce chybí hlavně potrava.",
    ],
    explanation:
      "Vlaštovka odlétá hlavně proto, že se živí hmyzem, kterého je u nás v zimě nedostatek. Nejde jen o chlad — mráz snáší i sýkorka, která zůstává.",
  },
  {
    question: "Proč přikrmujeme ptáky hlavně v zimě, a ne v létě?",
    correctAnswer: "V zimě si sami hůř najdou potravu pod sněhem",
    options: [
      "V zimě si sami hůř najdou potravu pod sněhem",
      "V létě už žádní ptáci nežijí",
      "V zimě ptákům chutná jenom jídlo z krmítka",
      "Ptáci v létě spí a nejedí",
    ],
    emoji: "🐦",
    hints: [
      "Přemýšlej, kdy ptáci hůř seženou vlastní potravu.",
      "V létě si ptáci najdou hmyz a semínka sami.",
    ],
    explanation:
      "V zimě je potrava schovaná pod sněhem a ptáci ji hůř hledají, proto jim pomáháme krmítkem. V létě si potravu najdou sami.",
  },
  {
    question: "Která dvě zvířata patří k sobě, protože obě v zimě spí zimním spánkem?",
    correctAnswer: "Ježek a netopýr",
    options: ["Liška a zajíc", "Ježek a netopýr", "Vlaštovka a čáp", "Sýkorka a vrabec"],
    emoji: "🦔",
    hints: [
      "Hledej dvojici, kde obě zvířata přes zimu spí.",
      "Liška a zajíc jsou aktivní, vlaštovka a čáp odlétají.",
    ],
    explanation:
      "Ježek i netopýr přes zimu spí zimním spánkem. Liška a zajíc zůstávají aktivní a vlaštovka s čápem odlétají do tepla.",
  },
  {
    question: "Kteří dva ptáci patří k sobě, protože oba na zimu odlétají?",
    correctAnswer: "Vlaštovka a čáp",
    options: ["Sýkorka a vrabec", "Kos a strakapoud", "Vlaštovka a čáp", "Sýkorka a vlaštovka"],
    emoji: "🐦",
    hints: [
      "Hledej dvojici, kde oba ptáci jsou tažní a odlétají.",
      "Pozor na dvojici, kde jeden odlétá a druhý zůstává.",
    ],
    explanation:
      "Vlaštovka i čáp jsou tažní ptáci a na zimu odlétají. Sýkorka, vrabec, kos i strakapoud u nás naopak zůstávají.",
  },
  {
    question: "Čím se liší chování medvěda a vlaštovky v zimě?",
    correctAnswer: "Medvěd spí, kdežto vlaštovka odlétá do teplých krajů",
    options: ["Medvěd odlétá, kdežto vlaštovka spí v doupěti", "Oba dva odlétají na zimu do Afriky", "Oba dva spí přes celou zimu zimním spánkem", "Medvěd spí, kdežto vlaštovka odlétá do teplých krajů"],
    emoji: "🐻",
    hints: [
      "Přiřaď každému zvířeti jeho vlastní strategii přezimování.",
      "Medvěd nemá křídla a vlaštovka se do doupěte neuloží.",
    ],
    explanation:
      "Medvěd v zimě spí ve svém doupěti, zatímco vlaštovka odlétá do teplých krajů. Každý přezimuje jinak.",
  },
  {
    question: "Sýkorka i vrabec u nás zůstávají celou zimu. Jak jim pomůžeme přežít?",
    correctAnswer: "Připravíme jim krmítko se semínky a nesoleným lojem",
    options: [
      "Připravíme jim krmítko se semínky a nesoleným lojem",
      "Necháme je odletět do teplých krajů",
      "Uložíme je do pelíšku k zimnímu spánku",
      "Nasypeme jim do krmítka slané brambůrky",
    ],
    emoji: "🐦",
    hints: [
      "Tito ptáci neodlétají ani nespí — v zimě hledají potravu.",
      "Do krmítka patří zdravé jídlo, ne slané pochutiny.",
    ],
    explanation:
      "Sýkorce a vrabci pomůžeme krmítkem se semínky a nesoleným lojem. Neodlétají ani nespí a slané brambůrky by jim uškodily.",
  },
  {
    question:
      "Které zvíře v zimě přespí jen část času a jinak žije ze zásob, které si nashromáždilo na podzim?",
    correctAnswer: "Veverka",
    options: ["Ježek", "Veverka", "Netopýr", "Vlaštovka"],
    emoji: "🐿️",
    hints: [
      "Hledej zvíře, které si dělá zásoby a v zimě se z nich krmí.",
      "Ježek a netopýr spí celou zimu, vlaštovka odlétá.",
    ],
    explanation:
      "Veverka celou zimu neprospí — žije ze zásob oříšků a žaludů, které si nashromáždila. Ježek a netopýr spí, vlaštovka odlétá.",
  },
  {
    question: "Ježek i medvěd na zimu odlétají do teplých krajů. Je to pravda?",
    correctAnswer: NE,
    options: [ANO, NE],
    emoji: "🐻",
    hints: [
      "Přemýšlej, jestli ježek a medvěd vůbec umí létat.",
    ],
    explanation:
      "Ne, to není pravda — ježek ani medvěd neodlétají. Oba přes zimu spí zimním spánkem.",
  },
  {
    question:
      "Sýkorka u nás zůstává i v zimě, proto jí připravujeme krmítko. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🐦",
    hints: [
      "Přemýšlej, jestli sýkorka odlétá, nebo zůstává, a co v zimě potřebuje.",
    ],
    explanation:
      "Ano, to je pravda — sýkorka neodlétá a v zimě hledá potravu, proto jí pomáháme krmítkem.",
  },
  {
    question: "Které jídlo je pro ptáky v krmítku nejlepší a neuškodí jim?",
    correctAnswer: "Slunečnicová semínka a nesolený lůj",
    options: ["Slané tyčinky a brambůrky", "Plesnivé pečivo", "Slunečnicová semínka a nesolený lůj", "Zbytky jídla se solí a kořením"],
    emoji: "🌻",
    hints: [
      "Spoj dvě zdravé věci, které ptákům svědčí.",
      "Slané, plesnivé a kořeněné jídlo ptákům škodí.",
    ],
    explanation:
      "Ptákům svědčí slunečnicová semínka a nesolený lůj. Slané, plesnivé a kořeněné jídlo jim naopak škodí.",
  },
  {
    question: "Proč ježek před zimou hodně žere a ztloustne?",
    correctAnswer: "Aby měl zásobu tuku na dlouhý zimní spánek",
    options: ["Aby doletěl až do teplých krajů", "Aby se vešel do ptačího krmítka", "Aby ho bylo ve sněhu lépe vidět", "Aby měl zásobu tuku na dlouhý zimní spánek"],
    emoji: "🦔",
    hints: [
      "Během spánku ježek nic nejí — z čeho tedy žije?",
      "Tuk je pro spícího ježka zásoba energie.",
    ],
    explanation:
      "Ježek se před zimou vykrmí, aby měl zásobu tuku na dlouhý zimní spánek, během kterého nic nejí. Neodlétá a do krmítka se nevejde.",
  },
  {
    question: "Vlaštovka odletěla a sýkorka zůstala. Co z toho platí?",
    correctAnswer: "Vlaštovka je tažný pták, sýkorka u nás přezimuje",
    options: [
      "Vlaštovka je tažný pták, sýkorka u nás přezimuje",
      "Oba ptáci jsou tažní a oba odletěli",
      "Oba ptáci u nás zůstali přes celou zimu",
      "Sýkorka odletěla a vlaštovka zůstala",
    ],
    emoji: "🐦",
    hints: [
      "Přiřaď každému ptákovi, jestli odlétá, nebo zůstává.",
      "Vlaštovka je tažná, sýkorku vídáme u krmítka.",
    ],
    explanation:
      "Vlaštovka je tažný pták a odlétá, kdežto sýkorka u nás přezimuje. Nejsou oba tažní ani oba zimující a role si nevyměnili.",
  },
  {
    question:
      "I když nasněží, liška a zajíc jsou v zimě venku aktivní a shánějí potravu. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🦊",
    hints: [
      "Přemýšlej, jestli liška a zajíc přes zimu spí, nebo zůstávají venku.",
    ],
    explanation:
      "Ano, to je pravda — liška ani zajíc přes zimu nespí. Zůstávají aktivní a i ve sněhu si hledají potravu.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1.map(toTask);
  return shuffle(pool);
}

export const ZAZIMOVANIZVIRAT: TopicMetadata[] = [
  {
    id: "g2-prv-zima-zvirata",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-podzim-a-v-zime-zazimovani-zvirat-ptaci-v-zime",
    title: "Zazimování zvířat, ptáci v zimě",
    studentTitle: "Zvířata v zimě",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na podzim a v zimě",
    briefDescription: "Jak zvířata přečkají zimu.",
    keywords: ["zima", "medvěd", "ježek", "spánek", "ptáci", "krmítko"],
    goals: [
      "Vědět, která zvířata v zimě spí.",
      "Znát, kteří ptáci odlétají.",
      "Vědět, že ptáky v zimě krmíme.",
    ],
    boundaries: [
      "Pouze běžná zvířata.",
      "Bez detailů o migraci.",
      "Rozlišení zimní spánek / zimní klid je zjednodušené (rozšiřující nad rámec RVP 2. ročníku).",
    ],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Medvěd a ježek v zimě spí. Vlaštovka odlétá do tepla.",
      steps: ["Přečti větu.", "Co zvíře v zimě dělá?"],
      commonMistake: "Vlaštovka v zimě odlétá, nezůstává u nás.",
      example: "Ježek v zimě spí, vlaštovka odlétá do teplých krajů.",
    },
  },
];
