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
  /** [malá, velká] nápověda — obě vlastní pro tuto větu. */
  hints: [string, string];
  solution: string;
  /** Proč je chybná volba (opak klíče) špatně. */
  feedback: string;
}

function toTask(item: TrueFalseItem): PracticeTask {
  const wrong = item.correct ? NE : ANO;
  return {
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [...item.hints],
    explanation: item.solution,
    optionFeedback: { [wrong]: item.feedback },
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3) pro 2. ročník.
//   L1 = rozpoznání izolovaného faktu o zimě a zvířatech: kdo spí,
//        kdo odlétá, kdo zůstává, čím krmit ptáky — formát Ano/Ne
//        (2 možnosti), jen zde.
//   L2 = aplikace: přiřazení strategie přezimování ke zvířeti,
//        poznání zvířete podle popisu, čím se krmí v krmítku —
//        výběr ze 4 možností.
//   L3 = transfer (kombinace dvou faktů, rozlišení blízkých strategií
//        zimní spánek / odlet / aktivní zima, otázky „proč“, oprava
//        miskoncepce, usuzování ze stop) — vždy 4 možnosti.
// Každá úloha: 2 vlastní nápovědy (malá → velká), vysvětlení PROČ
// a optionFeedback ke každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Medvěd v zimě spí ve svém doupěti. Je to pravda?",
    correct: true,
    emoji: "🐻",
    hints: [
      "Medvěd se na zimu uloží do doupěte — co tam dělá až do jara?",
      "Medvěda v zimě v lese skoro nepotkáš. Na podzim se vykrmí, najde si úkryt v jeskyni nebo pod kořeny a čeká tam na teplo.",
    ],
    solution: "Medvěd v zimě spí — ukládá se do doupěte a prospí většinu zimy.",
    feedback: "Medvěd opravdu přečká zimu ve spánku v doupěti, věta platí.",
  },
  {
    question: "Ježek v zimě spí zimním spánkem. Je to pravda?",
    correct: true,
    emoji: "🦔",
    hints: [
      "Ježek si udělá pelíšek z listí — k čemu mu v zimě slouží?",
      "Ježek se živí broučky a žížalami. Když je v zimě nenajde, stočí se do klubíčka v hromadě listí a nehýbe se až do jara.",
    ],
    solution: "Ježek v zimě spí zimním spánkem — přespí ji v pelíšku z listí až do jara.",
    feedback: "Ježek opravdu spí zimním spánkem v pelíšku z listí, věta platí.",
  },
  {
    question: "Netopýr přezimuje ve spánku v úkrytu. Je to pravda?",
    correct: true,
    emoji: "🦇",
    hints: [
      "Netopýr se schová do jeskyně nebo na půdu — co tam přes zimu dělá?",
      "Netopýr loví létající hmyz, který v zimě není. Zavěsí se proto hlavou dolů na strop jeskyně a nehybně čeká na jaro.",
    ],
    solution: "Netopýr v zimě spí — přezimuje zavěšený v úkrytu, třeba v jeskyni nebo na půdě.",
    feedback: "Netopýr opravdu přezimuje ve spánku v úkrytu, věta platí.",
  },
  {
    question: "Vlaštovka na zimu odlétá do teplých krajů. Je to pravda?",
    correct: true,
    emoji: "🐦",
    hints: [
      "Vlaštovka je tažný pták — co dělá na podzim?",
      "Vlaštovka chytá hmyz v letu. V zimě u nás žádný hmyz nelétá, a tak se na podzim vydá na dalekou cestu na jih.",
    ],
    solution: "Vlaštovka na zimu odlétá do teplých krajů — je to tažný pták, který zimuje v Africe.",
    feedback: "Vlaštovka je tažný pták a opravdu odlétá do teplých krajů, věta platí.",
  },
  {
    question: "Čáp na zimu odlétá do teplých krajů. Je to pravda?",
    correct: true,
    emoji: "🕊️",
    hints: [
      "Čápa v zimě u nás nevidíme — je to tažný pták, kam letí?",
      "Čáp se živí žábami a hmyzem z luk. Když rybníky zamrznou, nic by nenašel. Vzpomeň si, kdy se jeho hnízdo na komíně vyprázdní.",
    ],
    solution: "Čáp na zimu odlétá do teplých krajů — je to tažný pták, který zimuje v Africe.",
    feedback: "Čáp je tažný pták a na zimu opravdu odlétá, věta platí.",
  },
  {
    question: "Sýkorka u nás zůstává celou zimu. Je to pravda?",
    correct: true,
    emoji: "🐦",
    hints: [
      "Sýkorku vídáme u krmítka i v mrazu — odlétá, nebo zůstává?",
      "Vzpomeň si na zimní krmítko za oknem. Malý žlutozelený ptáček s černou hlavičkou tam zobe semínka, i když leží sníh.",
    ],
    solution: "Sýkorka u nás zůstává celou zimu — v zimě přilétá ke krmítku pro potravu.",
    feedback: "Sýkorka u nás opravdu přezimuje a chodí ke krmítku, věta platí.",
  },
  {
    question: "Vrabec na zimu odlétá do Afriky. Je to pravda?",
    correct: false,
    emoji: "🐦",
    hints: [
      "Vrabce vídáme u domů a krmítek i v zimě — je to tažný pták?",
      "Představ si zasněžený dvůr: kdo tam poskakuje a čimčará u krmítka? Kdyby vrabec odletěl, v zimě bys ho u nás neviděl.",
    ],
    solution: "Vrabec na zimu neodlétá — zůstává u nás celou zimu a živí se semínky.",
    feedback: "Vrabec je stálý pták, u nás ho vidíme i v zimě. Do Afriky neodlétá.",
  },
  {
    question: "V zimě přikrmujeme ptáky v krmítku. Je to pravda?",
    correct: true,
    emoji: "🐦",
    hints: [
      "V zimě ptáci hůř hledají potravu pod sněhem — jak jim pomůžeme?",
      "Semínka a bobule jsou v zimě schované pod sněhem. Co lidé věší na strom nebo stavějí na zahradu, aby ptáci měli co jíst?",
    ],
    solution: "V zimě přikrmujeme ptáky — dáváme jim do krmítka semínka a nesolený lůj.",
    feedback: "Ptákům v zimě opravdu pomáháme krmítkem, věta platí.",
  },
  {
    question: "Vlaštovka zůstává u nás celou zimu. Je to pravda?",
    correct: false,
    emoji: "🐦",
    hints: [
      "Vlaštovka potřebuje teplo a hmyz — najde je u nás v zimě?",
      "Vlaštovka loví jen létající hmyz. Vzpomeň si, jestli jsi někdy viděl vlaštovku nad zasněženou vesnicí, nebo až od jara.",
    ],
    solution: "Vlaštovka u nás celou zimu nezůstává — na zimu odlétá do teplých krajů.",
    feedback: "Vlaštovka je tažný pták a na zimu odlétá do tepla. U nás nezimuje.",
  },
  {
    question: "Veverka si na zimu dělá zásoby. Je to pravda?",
    correct: true,
    emoji: "🐿️",
    hints: [
      "Veverka na podzim sbírá oříšky a žaludy — proč si je schovává?",
      "V zimě na stromech nic neroste a pod sněhem se špatně hledá. Co si veverka potřebuje připravit dopředu, aby měla co jíst?",
    ],
    solution: "Veverka si na zimu dělá zásoby — schovává si oříšky a žaludy do skrýší.",
    feedback: "Veverka si opravdu na podzim schovává zásoby na zimu, věta platí.",
  },
  {
    question: "Liška v zimě nespí a je aktivní. Je to pravda?",
    correct: true,
    emoji: "🦊",
    hints: [
      "Lišku v zimě potkáme venku, jak shání potravu — spí, nebo je aktivní?",
      "Na sněhu bývají vidět liščí stopy v řadě za sebou. Kdyby liška prospala zimu v noře, stopy by na čerstvém sněhu nebyly.",
    ],
    solution: "Liška v zimě nespí — je aktivní a shání si potravu i v mrazu.",
    feedback: "Liška opravdu přes zimu nespí a loví i ve sněhu, věta platí.",
  },
  {
    question: "Zajíc má v zimě hustší srst. Je to pravda?",
    correct: true,
    emoji: "🐇",
    hints: [
      "Zajíc v zimě nespí ani neodlétá — jak se chrání před mrazem?",
      "Zajíc zůstává celou zimu venku na poli, i když mrzne. Co mu na podzim naroste, aby ho hřálo podobně jako nás zimní bunda?",
    ],
    solution: "Zajíc má v zimě hustší srst — ta ho chrání před chladem.",
    feedback: "Zajíci opravdu na zimu naroste hustší srst, věta platí.",
  },
  {
    question: "Strakapoud u nás v zimě zůstává. Je to pravda?",
    correct: true,
    emoji: "🐦",
    hints: [
      "Strakapouda vídáme klovat do stromů i v zimě — odlétá, nebo zůstává?",
      "Strakapoud dobývá zobákem hmyz schovaný pod kůrou a rád chodí i ke krmítku. Najde tedy potravu i v mrazu?",
    ],
    solution: "Strakapoud u nás v zimě zůstává — nachází potravu ve stromech i v mrazu.",
    feedback: "Strakapoud je stálý pták a v zimě u nás opravdu zůstává, věta platí.",
  },
  {
    question: "Žába v zimě spí zahrabaná v bahně. Je to pravda?",
    correct: true,
    emoji: "🐸",
    hints: [
      "Žába nesnese chlad — kam se schová na dně rybníka?",
      "Když rybník zamrzne, nahoře je led, ale dole u dna voda nezamrzá. Co tam žába dělá, dokud se znovu neoteplí?",
    ],
    solution: "Žába v zimě spí — zahrabuje se do bahna na dně rybníka až do jara.",
    feedback: "Žába opravdu přečká zimu ve spánku v bahně, věta platí.",
  },
  {
    question: "Medvěd na zimu odlétá do teplých krajů. Je to pravda?",
    correct: false,
    emoji: "🐻",
    hints: [
      "Medvěd nemá křídla — co dělá v zimě místo odletu?",
      "Do teplých krajů odlétají jen někteří ptáci. Medvěd je velký savec, který přečká zimu v úkrytu v lese.",
    ],
    solution: "Medvěd na zimu neodlétá — ukládá se do doupěte a spí.",
    feedback: "Medvěd létat neumí. Zimu přečká ve spánku v doupěti.",
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
      "Tři zvířata z nabídky zanechávají v zimě stopy ve sněhu, protože chodí venku. Které se místo toho stočí do klubíčka v listí?",
    ],
    explanation:
      "Ježek v zimě spí zimním spánkem v pelíšku z listí. Liška, srnec i zajíc v zimě nespí — zůstávají aktivní.",
    optionFeedback: {
      Liška: "Liška v zimě nespí, loví i ve sněhu.",
      Srnec: "Srnec v zimě nespí, hledá potravu v lese a na polích.",
      Zajíc: "Zajíc v zimě nespí, chrání ho hustší srst.",
    },
  },
  {
    question: "Který z těchto ptáků na zimu odlétá do teplých krajů?",
    correctAnswer: "Vlaštovka",
    options: ["Sýkorka", "Vlaštovka", "Vrabec", "Kos"],
    emoji: "🐦",
    hints: [
      "Hledej tažného ptáka, který u nás v zimě nezůstává.",
      "Vzpomeň si, kteří ptáci chodí v zimě ke krmítku. Hledaný pták tam nikdy není, protože se živí jen létajícím hmyzem.",
    ],
    explanation:
      "Vlaštovka je tažný pták a na zimu odlétá do teplých krajů. Sýkorka, vrabec i kos u nás v zimě zůstávají.",
    optionFeedback: {
      Sýkorka: "Sýkorka u nás zůstává a chodí ke krmítku.",
      Vrabec: "Vrabec je stálý pták, v zimě ho vidíme u domů.",
      Kos: "Kos u nás v zimě zůstává, hledá bobule a semínka.",
    },
  },
  {
    question: "Který z těchto ptáků u nás zůstává celou zimu?",
    correctAnswer: "Sýkorka",
    options: ["Vlaštovka", "Čáp", "Sýkorka", "Špaček"],
    emoji: "🐦",
    hints: [
      "Kterého ptáka vídáme v zimě u krmítka?",
      "Tři ptáci z nabídky jsou tažní a na podzim odletí. Najdi malého ptáčka se žlutým bříškem, který zobe semínka i v mrazu.",
    ],
    explanation:
      "Sýkorka u nás zůstává celou zimu a přilétá ke krmítku. Vlaštovka, čáp i špaček na zimu odlétají do teplých krajů.",
    optionFeedback: {
      Vlaštovka: "Vlaštovka na zimu odlétá, je to tažný pták.",
      Čáp: "Čáp na zimu odlétá do Afriky.",
      Špaček: "Špaček je tažný pták, na zimu odlétá.",
    },
  },
  {
    question: "Čím správně přikrmujeme ptáky v krmítku?",
    correctAnswer: "Slunečnicovými semínky",
    options: ["Slanými brambůrky", "Plesnivým chlebem", "Bonbony", "Slunečnicovými semínky"],
    emoji: "🌻",
    hints: [
      "Ptákům svědčí přírodní potrava, ne lidské pochutiny.",
      "Přemýšlej, co by ptáci našli v přírodě sami, kdyby nebyl sníh. Slané, plesnivé a sladké jídlo jim škodí.",
    ],
    explanation:
      "Ptáky přikrmujeme slunečnicovými semínky a nesoleným lojem. Slané brambůrky, plesnivý chléb ani bonbony jim nesvědčí.",
    optionFeedback: {
      "Slanými brambůrky": "Sůl ptákům škodí, brambůrky do krmítka nepatří.",
      "Plesnivým chlebem": "Plíseň je pro ptáky jedovatá, plesnivý chléb jim ublíží.",
      Bonbony: "Cukr ptákům neprospívá, bonbony nejsou jejich potrava.",
    },
  },
  {
    question: "Které zvíře si na zimu dělá zásoby oříšků a žaludů?",
    correctAnswer: "Veverka",
    options: ["Veverka", "Medvěd", "Vlaštovka", "Žába"],
    emoji: "🐿️",
    hints: [
      "Hledej zvíře, které na podzim sbírá oříšky a schovává si je.",
      "Hledané zvíře má huňatý ocas a šplhá po stromech. Oříšky zahrabává do země nebo ukládá do dutin, aby je v zimě našlo.",
    ],
    explanation:
      "Veverka si na zimu dělá zásoby oříšků a žaludů. Medvěd v zimě spí, vlaštovka odlétá a žába přezimuje v bahně.",
    optionFeedback: {
      Medvěd: "Medvěd se na podzim vykrmí a zimu prospí, zásoby oříšků si nedělá.",
      Vlaštovka: "Vlaštovka na zimu odlétá, zásoby si nedělá.",
      Žába: "Žába přespí zimu v bahně, oříšky nejí.",
    },
  },
  {
    question: "Co dělá medvěd v zimě?",
    correctAnswer: "Spí ve svém doupěti",
    options: ["Odlétá do Afriky", "Spí ve svém doupěti", "Staví si hnízdo na stromě", "Loví ryby v ledové řece"],
    emoji: "🐻",
    hints: [
      "Medvěd nemá křídla a v zimě nezůstává aktivní.",
      "Medvěd se na podzim hodně nají a pak si najde úkryt v jeskyni nebo pod kořeny. Co tam dělá celé zimní měsíce?",
    ],
    explanation:
      "Medvěd v zimě spí ve svém doupěti. Neodlétá, nestaví si hnízdo na stromě ani v zimě neloví.",
    optionFeedback: {
      "Odlétá do Afriky": "Medvěd nemá křídla, odlétat nemůže.",
      "Staví si hnízdo na stromě": "Hnízda stavějí ptáci. Medvěd má doupě na zemi.",
      "Loví ryby v ledové řece": "Ryby medvěd loví v létě a na podzim. V zimě spí.",
    },
  },
  {
    question: "Co dělá vlaštovka, když přijde zima?",
    correctAnswer: "Odlétá do teplých krajů",
    options: ["Spí v pelíšku z listí", "Zůstává celou zimu u krmítka", "Odlétá do teplých krajů", "Dělá si zásoby oříšků"],
    emoji: "🐦",
    hints: [
      "Vlaštovka potřebuje hmyz, kterého je v zimě nedostatek.",
      "Vlaštovka je tažný pták. Na konci léta se vlaštovky shromažďují na drátech a pak zmizí. Kam asi mizí?",
    ],
    explanation:
      "Vlaštovka na zimu odlétá do teplých krajů. Nespí, nezůstává u krmítka ani si nedělá zásoby.",
    optionFeedback: {
      "Spí v pelíšku z listí": "V pelíšku z listí spí ježek, ne vlaštovka.",
      "Zůstává celou zimu u krmítka": "U krmítka zůstává sýkorka. Vlaštovka semínka nejí.",
      "Dělá si zásoby oříšků": "Zásoby oříšků si dělá veverka.",
    },
  },
  {
    question: "Kam se ježek ukládá k zimnímu spánku?",
    correctAnswer: "Do pelíšku z listí",
    options: ["Na větev vysokého stromu", "Do ptačí budky", "Do teplých krajů", "Do pelíšku z listí"],
    emoji: "🦔",
    hints: [
      "Ježek hledá suché a teplé místo blízko země.",
      "Ježek neumí šplhat ani létat. Na podzim si na zahradě nebo v lese nahrne hromádku něčeho, co v té době padá ze stromů.",
    ],
    explanation:
      "Ježek se ukládá k zimnímu spánku do pelíšku z listí u země. Na stromě, v budce ani v teplých krajích ho nenajdeme.",
    optionFeedback: {
      "Na větev vysokého stromu": "Ježek neumí šplhat po stromech.",
      "Do ptačí budky": "Ptačí budka je pro ptáky a ježek se do ní nedostane.",
      "Do teplých krajů": "Do teplých krajů odlétají ptáci, ježek létat neumí.",
    },
  },
  {
    question: "Které zvíře je v zimě aktivní a nespí zimním spánkem?",
    correctAnswer: "Liška",
    options: ["Liška", "Ježek", "Netopýr", "Plch"],
    emoji: "🦊",
    hints: [
      "Hledej zvíře, které i v mrazu shání potravu venku.",
      "Tři zvířata z nabídky prospí zimu v úkrytu. Hledané zvíře má zrzavý kožich a v zimě po něm zůstávají stopy ve sněhu.",
    ],
    explanation:
      "Liška je v zimě aktivní a shání si potravu. Ježek, netopýr i plch naopak přes zimu spí.",
    optionFeedback: {
      Ježek: "Ježek přes zimu spí v pelíšku z listí.",
      Netopýr: "Netopýr přes zimu spí zavěšený v úkrytu.",
      Plch: "Plch přes zimu spí, dokonce velmi dlouho.",
    },
  },
  {
    question: "Poznáš zvíře: „V zimě spí v jeskyni nebo na půdě zavěšené hlavou dolů.“",
    correctAnswer: "Netopýr",
    options: ["Sýkorka", "Netopýr", "Zajíc", "Liška"],
    emoji: "🦇",
    hints: [
      "Které zvíře umí viset hlavou dolů a přes zimu spí?",
      "Hledané zvíře létá v noci a loví hmyz. Má blanitá křídla a drápky na nohou, kterými se zachytí za strop.",
    ],
    explanation:
      "Popis sedí na netopýra — spí zavěšený hlavou dolů v jeskyni nebo na půdě. Sýkorka, zajíc ani liška v zimě takto nespí.",
    optionFeedback: {
      Sýkorka: "Sýkorka v zimě nespí, chodí ke krmítku.",
      Zajíc: "Zajíc v zimě nespí a hlavou dolů viset neumí.",
      Liška: "Liška je v zimě aktivní a spí v noře, ne zavěšená.",
    },
  },
  {
    question: "Co ptákům do krmítka NEDÁVÁME?",
    correctAnswer: "Slané a kořeněné zbytky jídla",
    options: ["Slunečnicová semínka", "Nesolený lůj", "Slané a kořeněné zbytky jídla", "Zrní"],
    emoji: "🧂",
    hints: [
      "Které jídlo je pro ptáky nezdravé a škodí jim?",
      "Pozor, hledáš to, co do krmítka nepatří. Tři možnosti jsou přírodní potrava pro ptáky, jedna jsou zbytky lidského jídla.",
    ],
    explanation:
      "Slané a kořeněné zbytky ptákům škodí, proto je do krmítka nedáváme. Semínka, nesolený lůj a zrní jsou naopak vhodné.",
    optionFeedback: {
      "Slunečnicová semínka": "Slunečnicová semínka do krmítka patří, ptáci je mají rádi.",
      "Nesolený lůj": "Nesolený lůj ptákům dodá energii, do krmítka patří.",
      Zrní: "Zrní je vhodná potrava pro ptáky, do krmítka patří.",
    },
  },
  {
    question: "Který pták přilétá v zimě ke krmítku pro semínka?",
    correctAnswer: "Sýkorka",
    options: ["Vlaštovka", "Čáp", "Jiřička", "Sýkorka"],
    emoji: "🐦",
    hints: [
      "Kterého ptáka vídáme u krmítka i v mrazu?",
      "Nejdřív vyřaď tažné ptáky, kteří v zimě u nás vůbec nejsou. Zbude malý ptáček, který umí rozklovat i tvrdé semínko.",
    ],
    explanation:
      "Sýkorka u nás v zimě zůstává a přilétá ke krmítku pro semínka. Vlaštovka, čáp i jiřička na zimu odlétají.",
    optionFeedback: {
      Vlaštovka: "Vlaštovka je v zimě v Africe a semínka nejí.",
      Čáp: "Čáp na zimu odlétá a živí se žábami a hmyzem.",
      Jiřička: "Jiřička je tažný pták jako vlaštovka, v zimě tu není.",
    },
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
      "Zajíc sedí v mrazu v brázdě na poli a přitom mu není zima. Co ho zahřívá, podobně jako tebe teplá zimní bunda?",
    ],
    explanation:
      "Zajíce před mrazem chrání hustší zimní srst. Neodlétá, nespí zimním spánkem ani se neschovává do krmítka.",
    optionFeedback: {
      "Odlétá do teplých krajů": "Zajíc neumí létat, odlétají jen někteří ptáci.",
      "Spí až do jara v doupěti": "V doupěti spí medvěd. Zajíc je v zimě aktivní.",
      "Schová se do ptačího krmítka": "Do krmítka se zajíc nevejde, je pro ptáky.",
    },
  },
  {
    question: "Kde přečkává žába zimu?",
    correctAnswer: "Zahrabaná v bahně na dně rybníka",
    options: ["V ptačí budce", "Zahrabaná v bahně na dně rybníka", "V teplých krajích v Africe", "Na větvi vysokého stromu"],
    emoji: "🐸",
    hints: [
      "Žába nesnese chlad a schovává se dolů do vody.",
      "Když rybník zamrzne, led je jen nahoře. Hluboko u dna voda nezamrzá. Kam se tam žába schová, aby ji mráz nezastihl?",
    ],
    explanation:
      "Žába přečkává zimu zahrabaná v bahně na dně rybníka. V budce, v Africe ani na stromě ji nenajdeme.",
    optionFeedback: {
      "V ptačí budce": "Budka je pro ptáky a žába by v ní zmrzla.",
      "V teplých krajích v Africe": "Do Afriky odlétají ptáci, žába létat neumí.",
      "Na větvi vysokého stromu": "Na větvi by žába zmrzla, schovává se do vody.",
    },
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Které zvíře v zimě NEspí zimním spánkem ani neodlétá, ale zůstává venku aktivní?",
    correctAnswer: "Liška",
    options: ["Ježek", "Vlaštovka", "Liška", "Netopýr"],
    emoji: "🦊",
    hints: [
      "Rozliš tři strategie: spánek, odlet a aktivní zima.",
      "Přiřaď každé zvíře z nabídky k jedné strategii: kdo spí, kdo odlétá a kdo zbude. Hledáš to zvíře, které nepatří ani k jedné z prvních dvou.",
    ],
    explanation:
      "Liška v zimě nespí ani neodlétá — zůstává aktivní a shání potravu. Ježek a netopýr spí, vlaštovka odlétá do tepla.",
    optionFeedback: {
      Ježek: "Ježek přes zimu spí, hledáš zvíře, které nespí.",
      Vlaštovka: "Vlaštovka odlétá, hledáš zvíře, které zůstává.",
      Netopýr: "Netopýr přes zimu spí v úkrytu.",
    },
  },
  {
    question: "Proč vlaštovka na zimu odlétá do teplých krajů?",
    correctAnswer: "V zimě u nás nenajde dost hmyzu, kterým se živí",
    options: [
      "Protože je jí v zimě jenom zima",
      "Protože se chce podívat do Afriky",
      "Protože v teple se jí líp spí zimní spánek",
      "V zimě u nás nenajde dost hmyzu, kterým se živí",
    ],
    emoji: "🐦",
    hints: [
      "Přemýšlej, co vlaštovka jí a jestli to v zimě u nás najde.",
      "Porovnej ji se sýkorkou: sýkorka mráz snese a zůstane, protože jí semínka. Co tedy vlaštovce v zimě chybí víc než teplo?",
    ],
    explanation:
      "Vlaštovka odlétá hlavně proto, že se živí hmyzem, kterého je u nás v zimě nedostatek. Nejde jen o chlad — mráz snáší i sýkorka, která zůstává.",
    optionFeedback: {
      "Protože je jí v zimě jenom zima": "Chlad hraje roli, ale hlavní důvod je nedostatek hmyzu. Sýkorka mráz vydrží, protože má potravu.",
      "Protože se chce podívat do Afriky": "Ptáci necestují pro zábavu. Odlétají, protože by tu nenašli potravu.",
      "Protože v teple se jí líp spí zimní spánek": "Vlaštovka zimním spánkem nespí, v teplých krajích je aktivní.",
    },
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
      "Porovnej zimu a léto: v létě je všude hmyz, semínka a bobule. Co se s tou potravou stane, když napadne sníh a zamrzne zem?",
    ],
    explanation:
      "V zimě je potrava schovaná pod sněhem a ptáci ji hůř hledají, proto jim pomáháme krmítkem. V létě si potravu najdou sami.",
    optionFeedback: {
      "V létě už žádní ptáci nežijí": "V létě je ptáků naopak nejvíc, i tažní jsou doma.",
      "V zimě ptákům chutná jenom jídlo z krmítka": "Nejde o chuť. Krmítko pomáhá, protože pod sněhem potrava chybí.",
      "Ptáci v létě spí a nejedí": "Ptáci v létě nespí, shánějí potravu pro sebe i mláďata.",
    },
  },
  {
    question: "Která dvě zvířata patří k sobě, protože obě v zimě spí zimním spánkem?",
    correctAnswer: "Ježek a netopýr",
    options: ["Liška a zajíc", "Ježek a netopýr", "Vlaštovka a čáp", "Sýkorka a vrabec"],
    emoji: "🦔",
    hints: [
      "Hledej dvojici, kde obě zvířata přes zimu spí.",
      "Každá dvojice v nabídce má společnou jednu strategii přezimování. Urči ji u každé dvojice a vyber tu, kde oba spí.",
    ],
    explanation:
      "Ježek i netopýr přes zimu spí zimním spánkem. Liška a zajíc zůstávají aktivní a vlaštovka s čápem odlétají do tepla.",
    optionFeedback: {
      "Liška a zajíc": "Liška a zajíc patří k sobě, ale oba jsou v zimě aktivní.",
      "Vlaštovka a čáp": "Vlaštovka a čáp patří k sobě, protože oba odlétají, ne spí.",
      "Sýkorka a vrabec": "Sýkorka a vrabec patří k sobě, protože oba zůstávají a chodí ke krmítku.",
    },
  },
  {
    question: "Kteří dva ptáci patří k sobě, protože oba na zimu odlétají?",
    correctAnswer: "Vlaštovka a čáp",
    options: ["Sýkorka a vrabec", "Kos a strakapoud", "Vlaštovka a čáp", "Sýkorka a vlaštovka"],
    emoji: "🐦",
    hints: [
      "Hledej dvojici, kde oba ptáci jsou tažní a odlétají.",
      "Zkontroluj oba ptáky v každé dvojici zvlášť. Pozor na dvojici, kde jeden pták odlétá a druhý zůstává u krmítka.",
    ],
    explanation:
      "Vlaštovka i čáp jsou tažní ptáci a na zimu odlétají. Sýkorka, vrabec, kos i strakapoud u nás naopak zůstávají.",
    optionFeedback: {
      "Sýkorka a vrabec": "Sýkorka i vrabec u nás v zimě zůstávají.",
      "Kos a strakapoud": "Kos i strakapoud u nás přezimují.",
      "Sýkorka a vlaštovka": "Vlaštovka odlétá, ale sýkorka zůstává. Oba musí odlétat.",
    },
  },
  {
    question: "Čím se liší chování medvěda a vlaštovky v zimě?",
    correctAnswer: "Medvěd spí, kdežto vlaštovka odlétá do teplých krajů",
    options: [
      "Medvěd odlétá, kdežto vlaštovka spí v doupěti",
      "Oba dva odlétají na zimu do Afriky",
      "Oba dva spí přes celou zimu zimním spánkem",
      "Medvěd spí, kdežto vlaštovka odlétá do teplých krajů",
    ],
    emoji: "🐻",
    hints: [
      "Přiřaď každému zvířeti jeho vlastní strategii přezimování.",
      "Vyřeš každé zvíře zvlášť: co umí medvěd a co vlaštovka? Medvěd nemá křídla a vlaštovka se do doupěte neuloží.",
    ],
    explanation:
      "Medvěd v zimě spí ve svém doupěti, zatímco vlaštovka odlétá do teplých krajů. Každý přezimuje jinak.",
    optionFeedback: {
      "Medvěd odlétá, kdežto vlaštovka spí v doupěti": "Role jsou prohozené. Medvěd létat neumí.",
      "Oba dva odlétají na zimu do Afriky": "Medvěd odlétat nemůže, nemá křídla.",
      "Oba dva spí přes celou zimu zimním spánkem": "Vlaštovka nespí, odlétá do tepla.",
    },
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
      "Spoj dvě věci: co ptákům v zimě chybí a jaké jídlo jim neublíží. Slané pochutiny ptákům škodí.",
    ],
    explanation:
      "Sýkorce a vrabci pomůžeme krmítkem se semínky a nesoleným lojem. Neodlétají ani nespí a slané brambůrky by jim uškodily.",
    optionFeedback: {
      "Necháme je odletět do teplých krajů": "Sýkorka a vrabec neodlétají, to není jejich strategie.",
      "Uložíme je do pelíšku k zimnímu spánku": "Ptáci zimním spánkem nespí, potřebují jíst.",
      "Nasypeme jim do krmítka slané brambůrky": "Krmítko je dobrý nápad, ale sůl ptákům škodí.",
    },
  },
  {
    question: "Které zvíře v zimě přespí jen část času a jinak žije ze zásob, které si nashromáždilo na podzim?",
    correctAnswer: "Veverka",
    options: ["Ježek", "Veverka", "Netopýr", "Vlaštovka"],
    emoji: "🐿️",
    hints: [
      "Hledej zvíře, které si dělá zásoby a v zimě se z nich krmí.",
      "Spoj oba údaje: zvíře nespí celou zimu a má schované zásoby. Vzpomeň si, kdo na podzim zahrabává oříšky a žaludy.",
    ],
    explanation:
      "Veverka celou zimu neprospí — žije ze zásob oříšků a žaludů, které si nashromáždila. Ježek a netopýr spí, vlaštovka odlétá.",
    optionFeedback: {
      Ježek: "Ježek prospí celou zimu a zásoby si nedělá.",
      Netopýr: "Netopýr prospí celou zimu v úkrytu.",
      Vlaštovka: "Vlaštovka odlétá do teplých krajů.",
    },
  },
  {
    question: "Kamarád říká, že ježek i medvěd na zimu odlétají do teplých krajů. Jak ho opravíš?",
    correctAnswer: "Neodlétají, oba přes zimu spí",
    options: [
      "Má pravdu, oba odlétají do Afriky",
      "Neodlétají, oba přes zimu spí",
      "Odlétá jen medvěd, ježek spí",
      "Neodlétají, oba zůstávají venku a shánějí potravu",
    ],
    emoji: "🐻",
    hints: [
      "Přemýšlej, jestli ježek a medvěd vůbec umí létat.",
      "Oprava má dvě části: nejdřív urči, jestli mohou odletět, a pak si vzpomeň, co ježek v pelíšku a medvěd v doupěti dělají celé zimní měsíce.",
    ],
    explanation:
      "Ježek ani medvěd neodlétají, protože nemají křídla. Oba přečkají zimu ve spánku, ježek v pelíšku z listí a medvěd v doupěti.",
    optionFeedback: {
      "Má pravdu, oba odlétají do Afriky": "Ježek ani medvěd nemají křídla, odletět nemohou.",
      "Odlétá jen medvěd, ježek spí": "Ani medvěd létat neumí. Oba přes zimu spí.",
      "Neodlétají, oba zůstávají venku a shánějí potravu": "Venku aktivní zůstává třeba liška. Ježek a medvěd zimu prospí.",
    },
  },
  {
    question: "Proč sýkorce v zimě připravujeme krmítko, ale vlaštovce ne?",
    correctAnswer: "Sýkorka u nás v zimě zůstává, vlaštovka odlétá",
    options: [
      "Vlaštovka krmítko nemá ráda",
      "Sýkorka u nás v zimě zůstává, vlaštovka odlétá",
      "Sýkorka v zimě spí a krmítko ji probudí",
      "Vlaštovka si v zimě najde dost hmyzu sama",
    ],
    emoji: "🐦",
    hints: [
      "Přemýšlej, kde je každý z těch ptáků v zimě.",
      "Krmítko pomůže jen ptákovi, který je v zimě u nás. Urči u sýkorky a u vlaštovky zvlášť, jestli zůstává, nebo odlétá.",
    ],
    explanation:
      "Sýkorka u nás v zimě zůstává a hledá potravu, proto jí pomáháme krmítkem. Vlaštovka je v zimě v teplých krajích, takže by ke krmítku stejně nepřiletěla.",
    optionFeedback: {
      "Vlaštovka krmítko nemá ráda": "Nejde o to, co má ráda. Vlaštovka tu v zimě vůbec není.",
      "Sýkorka v zimě spí a krmítko ji probudí": "Sýkorka v zimě nespí, je aktivní a hledá potravu.",
      "Vlaštovka si v zimě najde dost hmyzu sama": "V zimě u nás hmyz nelétá, proto vlaštovka odlétá.",
    },
  },
  {
    question: "Které jídlo je pro ptáky v krmítku nejlepší a neuškodí jim?",
    correctAnswer: "Slunečnicová semínka a nesolený lůj",
    options: [
      "Slané tyčinky a brambůrky",
      "Plesnivé pečivo",
      "Slunečnicová semínka a nesolený lůj",
      "Zbytky jídla se solí a kořením",
    ],
    emoji: "🌻",
    hints: [
      "Spoj dvě zdravé věci, které ptákům svědčí.",
      "U každé možnosti hledej, jestli v ní není sůl, koření nebo plíseň. Ptákům škodí všechno slané, kořeněné i zkažené.",
    ],
    explanation:
      "Ptákům svědčí slunečnicová semínka a nesolený lůj. Slané, plesnivé a kořeněné jídlo jim naopak škodí.",
    optionFeedback: {
      "Slané tyčinky a brambůrky": "Sůl ptákům škodí, tyčinky a brambůrky do krmítka nepatří.",
      "Plesnivé pečivo": "Plíseň je pro ptáky nebezpečná.",
      "Zbytky jídla se solí a kořením": "Sůl a koření ptákům škodí.",
    },
  },
  {
    question: "Proč ježek před zimou hodně žere a ztloustne?",
    correctAnswer: "Aby měl zásobu tuku na dlouhý zimní spánek",
    options: [
      "Aby doletěl až do teplých krajů",
      "Aby se vešel do ptačího krmítka",
      "Aby ho bylo ve sněhu lépe vidět",
      "Aby měl zásobu tuku na dlouhý zimní spánek",
    ],
    emoji: "🦔",
    hints: [
      "Během spánku ježek nic nejí — z čeho tedy žije?",
      "Spoj dvě věci: ježek celou zimu spí a přitom nic nejí. Kde má tělo schovanou energii, kterou během spánku postupně spotřebuje?",
    ],
    explanation:
      "Ježek se před zimou vykrmí, aby měl zásobu tuku na dlouhý zimní spánek, během kterého nic nejí. Neodlétá a do krmítka se nevejde.",
    optionFeedback: {
      "Aby doletěl až do teplých krajů": "Ježek neumí létat, zimu prospí.",
      "Aby se vešel do ptačího krmítka": "Tloustnutím by se do krmítka vešel ještě hůř. Krmítko je pro ptáky.",
      "Aby ho bylo ve sněhu lépe vidět": "Ježek je v zimě schovaný v listí, ve sněhu ho vidět nechce.",
    },
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
      "Zadání říká, co každý pták udělal. Ptákům, kteří na zimu odlétají, říkáme tažní. Ti, kdo tu zůstávají, u nás přezimují.",
    ],
    explanation:
      "Vlaštovka je tažný pták a odlétá, kdežto sýkorka u nás přezimuje. Nejsou oba tažní ani oba zimující a role si nevyměnili.",
    optionFeedback: {
      "Oba ptáci jsou tažní a oba odletěli": "Sýkorka podle zadání zůstala, tažná tedy není.",
      "Oba ptáci u nás zůstali přes celou zimu": "Vlaštovka podle zadání odletěla.",
      "Sýkorka odletěla a vlaštovka zůstala": "Je to obráceně, než říká zadání.",
    },
  },
  {
    question: "Na čerstvém sněhu vidíš stopy lišky a zajíce. Co to prozrazuje o jejich zimě?",
    correctAnswer: "V zimě nespí a shánějí potravu venku",
    options: [
      "V zimě nespí a shánějí potravu venku",
      "Spí zimním spánkem v doupěti",
      "Odletěli do teplých krajů",
      "Spí zahrabaní v bahně na dně rybníka",
    ],
    emoji: "🦊",
    hints: [
      "Stopy na čerstvém sněhu mohou udělat jen zvířata, která po něm chodí.",
      "Spoj dvě věci: sníh napadl nedávno a stopy jsou v něm vidět. Kdyby liška a zajíc spali nebo byli pryč, mohly by tam stopy být?",
    ],
    explanation:
      "Stopy ve sněhu dokazují, že liška i zajíc v zimě nespí. Zůstávají aktivní a i ve sněhu si hledají potravu.",
    optionFeedback: {
      "Spí zimním spánkem v doupěti": "Spící zvíře by v čerstvém sněhu stopy nezanechalo.",
      "Odletěli do teplých krajů": "Liška a zajíc létat neumějí a stopy ukazují, že jsou tady.",
      "Spí zahrabaní v bahně na dně rybníka": "V bahně přezimuje žába. Stopy na sněhu tam nevedou.",
    },
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
