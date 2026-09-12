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
//   L1 = rozpoznání izolovaného faktu: jak se jmenuje mládě daného
//        zvířete (kočka → kotě) a která rostlina je jarní květina.
//   L2 = aplikace: obrácené přiřazení (čí mládě je kotě?), zařazení
//        mláděte k dospělému zvířeti a poznání, kdy se mláďata rodí
//        a květiny kvetou (roční období).
//   L3 = transfer (2 kroky, přiměřeně věku 7-8 let): spojení dvou
//        faktů zároveň, rozlišení zaměnitelných mláďat (káče vs. kuře,
//        jehně vs. kůzle) i podobných květin (obě žluté, obě jarní)
//        a jednoduché „co z mláděte vyroste“.
// Každá úloha: 2 vlastní nápovědy (malá → velká), vysvětlení PROČ
// a optionFeedback ke každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Jak se jmenuje mládě kočky?",
    correctAnswer: "Kotě",
    options: ["Kotě", "Štěně", "Tele", "Kuře"],
    emoji: "🐱",
    hints: [
      "Malé roztomilé zvířátko, které kočka kojí — jak se mu říká?",
      "Kočka a kocour mají mládě, které mňouká a honí klubíčko. Jeho jméno má dvě slabiky a začíná stejně jako slovo kočka.",
    ],
    solutionSteps: ["Mládě kočky je kotě — malá kočička, která si ráda hraje. Z kotěte vyroste kočka."],
    optionFeedback: {
      Štěně: "Štěně je mládě psa, ne kočky.",
      Tele: "Tele je mládě krávy.",
      Kuře: "Kuře je mládě slepice, líhne se z vejce.",
    },
  },
  {
    question: "Jak se jmenuje mládě psa?",
    correctAnswer: "Štěně",
    options: ["Kotě", "Štěně", "Hříbě", "Sele"],
    emoji: "🐶",
    hints: [
      "Malý pejsek, který se teprve učí chodit a štěká — jak se jmenuje?",
      "Pes a fena mají mládě, které piští, kouše do bot a teprve se učí štěkat. Jeho jméno začíná stejně jako slovo štěkat.",
    ],
    solutionSteps: ["Mládě psa je štěně — malý pejsek, který se právě narodil. Ze štěněte vyroste pes."],
    optionFeedback: {
      Kotě: "Kotě je mládě kočky, ne psa.",
      Hříbě: "Hříbě je mládě koně.",
      Sele: "Sele je mládě prasete.",
    },
  },
  {
    question: "Jak se jmenuje mládě krávy?",
    correctAnswer: "Tele",
    options: ["Sele", "Kůzle", "Tele", "Hříbě"],
    emoji: "🐄",
    hints: [
      "Malé mládě krávy se ještě kojí u maminky — jak se jmenuje?",
      "Kráva a býk mají mládě, které se na slabých nožkách drží u maminky a pije její mléko. Jméno má dvě slabiky a začíná na „t“.",
    ],
    solutionSteps: ["Mládě krávy je tele — teprve se učí chodit a pije mléko od krávy."],
    optionFeedback: {
      Sele: "Sele je mládě prasete.",
      Kůzle: "Kůzle je mládě kozy.",
      Hříbě: "Hříbě je mládě koně.",
    },
  },
  {
    question: "Jak se jmenuje mládě koně?",
    correctAnswer: "Hříbě",
    options: ["Tele", "Štěně", "Jehně", "Hříbě"],
    emoji: "🐴",
    hints: [
      "Malý kůň na dlouhých tenkých nožkách — jak se jmenuje?",
      "Klisna a hřebec mají mládě, které se brzy po narození postaví a běhá za maminkou. Jeho jméno zní podobně jako slovo hřebec.",
    ],
    solutionSteps: ["Mládě koně je hříbě — brzy po narození se postaví na nohy."],
    optionFeedback: {
      Tele: "Tele je mládě krávy.",
      Štěně: "Štěně je mládě psa.",
      Jehně: "Jehně je mládě ovce.",
    },
  },
  {
    question: "Jak se jmenuje mládě prasete?",
    correctAnswer: "Sele",
    options: ["Sele", "Kuře", "Tele", "Kotě"],
    emoji: "🐷",
    hints: [
      "Malé růžové prasátko, které chrochtá u maminky — jak se jmenuje?",
      "Prase a kanec mají mládě s malým rypáčkem a zatočeným ocáskem. Jeho jméno je krátké, má dvě slabiky a začíná na „s“.",
    ],
    solutionSteps: ["Mládě prasete je sele — malé růžové prasátko."],
    optionFeedback: {
      Kuře: "Kuře je mládě slepice.",
      Tele: "Tele je mládě krávy.",
      Kotě: "Kotě je mládě kočky.",
    },
  },
  {
    question: "Jak se jmenuje mládě slepice?",
    correctAnswer: "Kuře",
    options: ["Sele", "Kuře", "House", "Kotě"],
    emoji: "🐔",
    hints: [
      "Žluté chlupaté ptáče, které pípá a běhá za slepicí — jak se jmenuje?",
      "Slepice a kohout mají mládě, které se vylíhne z vejce v kurníku. Neumí plavat a jeho jméno začíná na „k“.",
    ],
    solutionSteps: ["Mládě slepice je kuře — žluté pípající ptáče."],
    optionFeedback: {
      Sele: "Sele je mládě prasete, z vejce se nelíhne.",
      House: "House je mládě husy. Husa je jiný pták než slepice.",
      Kotě: "Kotě je mládě kočky.",
    },
  },
  {
    question: "Jak se jmenuje mládě ovce?",
    correctAnswer: "Jehně",
    options: ["Kůzle", "Tele", "Jehně", "Sele"],
    emoji: "🐑",
    hints: [
      "Malá ovečka s bílou vlněnou srstí na louce — jak se jmenuje?",
      "Ovce a beran mají mládě, které bečí tenkým hláskem. Pozor, mládě kozy vypadá podobně, ale jmenuje se jinak.",
    ],
    solutionSteps: ["Mládě ovce je jehně — má měkkou bílou vlněnou srst."],
    optionFeedback: {
      Kůzle: "Kůzle je mládě kozy. Koza a ovce jsou dvě různá zvířata.",
      Tele: "Tele je mládě krávy.",
      Sele: "Sele je mládě prasete.",
    },
  },
  {
    question: "Jak se jmenuje mládě kozy?",
    correctAnswer: "Kůzle",
    options: ["Jehně", "Sele", "Štěně", "Kůzle"],
    emoji: "🐐",
    hints: [
      "Malá kozička, která ráda poskakuje — jak se jmenuje?",
      "Koza a kozel mají mládě, které mečí a šplhá po kamenech. Jeho jméno je od slova koza, jen zdrobnělé.",
    ],
    solutionSteps: ["Mládě kozy je kůzle — malá kozička, co poskakuje a mečí."],
    optionFeedback: {
      Jehně: "Jehně je mládě ovce. Ovce a koza se často pletou.",
      Sele: "Sele je mládě prasete.",
      Štěně: "Štěně je mládě psa.",
    },
  },
  {
    question: "Jak se jmenuje mládě husy?",
    correctAnswer: "House",
    options: ["House", "Kuře", "Káče", "Tele"],
    emoji: "🦢",
    hints: [
      "Malá husa, která chodí za maminkou v řadě — jak se jmenuje?",
      "Husa a její samec mají mládě, které se vylíhne z vejce a brzy plave. Jeho jméno je od slova husa a končí na „e“.",
    ],
    solutionSteps: ["Mládě husy je house — chodí v řadě za maminkou husou."],
    optionFeedback: {
      Kuře: "Kuře je mládě slepice.",
      Káče: "Káče je mládě kachny. Kachna je menší než husa.",
      Tele: "Tele je mládě krávy.",
    },
  },
  {
    question: "Jak se jmenuje mládě kachny?",
    correctAnswer: "Káče",
    options: ["Kuře", "Káče", "House", "Sele"],
    emoji: "🦆",
    hints: [
      "Malé žluté ptáče, které umí hned plavat na rybníku — jak se jmenuje?",
      "Kachna a kačer mají mládě, které plave v řadě za maminkou. Jeho jméno má dvě slabiky a začíná stejně jako slovo kachna.",
    ],
    solutionSteps: ["Mládě kachny je káče — malé kachňátko, které plave hned po narození."],
    optionFeedback: {
      Kuře: "Kuře je mládě slepice a plavat neumí.",
      House: "House je mládě husy, ne kachny.",
      Sele: "Sele je mládě prasete.",
    },
  },
  {
    question: "Která malá bílá květina kvete na jaře první, často ještě ve sněhu?",
    correctAnswer: "Sněženka",
    options: ["Slunečnice", "Růže", "Sněženka", "Pampeliška"],
    emoji: "🌼",
    hints: [
      "Hledej bílou květinu, které nevadí ani sníh a kvete úplně první.",
      "Její jméno napovídá, kde ji najdeš. Je to slovo příbuzné se slovem sníh. Má bílé kvítky svěšené dolů.",
    ],
    solutionSteps: ["Jako první kvete sněženka — má bílé kvítky a objeví se ještě ve sněhu."],
    optionFeedback: {
      Slunečnice: "Slunečnice je velká a žlutá a kvete až v létě.",
      Růže: "Růže kvete v létě a sníh jí nesvědčí.",
      Pampeliška: "Pampeliška je žlutá a kvete až na zelené louce, ne ve sněhu.",
    },
  },
  {
    question: "Která žlutá luční kytička se promění v bílou chmýřovou kuličku na foukání?",
    correctAnswer: "Pampeliška",
    options: ["Sněženka", "Tulipán", "Konvalinka", "Pampeliška"],
    emoji: "🌼",
    hints: [
      "Hledej žlutou louční kytičku, jejíž chmýří se dá rozfoukat.",
      "Roste skoro všude v trávě, má dutý stonek s bílou šťávou. Když odkvete, udělá se z ní kulička a semínka odletí jako padáčky.",
    ],
    solutionSteps: ["Na louce kvete pampeliška — její žlutý květ se změní v bílý míček ze semen."],
    optionFeedback: {
      Sněženka: "Sněženka je bílá a chmýří nemá.",
      Tulipán: "Tulipán roste na zahradě a chmýří nemá.",
      Konvalinka: "Konvalinka má bílé zvonečky a chmýří nemá.",
    },
  },
  {
    question: "Která barevná jarní zahradní květina má květ jako pohárek?",
    correctAnswer: "Tulipán",
    options: ["Tulipán", "Kopřiva", "Pampeliška", "Sněženka"],
    emoji: "🌷",
    hints: [
      "Hledej zahradní květinu s pohárkovitým květem, která bývá červená, žlutá i jiná.",
      "Roste z cibulky zasazené na podzim. Na jaře má jeden velký květ na rovném stonku a lístky v květu tvoří hrníček.",
    ],
    solutionSteps: ["Na zahradě na jaře kvete tulipán — má pohárkovitý květ různých barev."],
    optionFeedback: {
      Kopřiva: "Kopřiva pálí a nemá barevný pohárkovitý květ.",
      Pampeliška: "Pampeliška roste sama na louce a má žlutý květ bez pohárku.",
      Sněženka: "Sněženka má malé bílé svěšené kvítky, ne barevný pohárek.",
    },
  },
  {
    question: "Která žlutá nebo bílá jarní zahradní květina má uprostřed květu trubičku?",
    correctAnswer: "Narcis",
    options: ["Tulipán", "Narcis", "Růže", "Pampeliška"],
    emoji: "🌼",
    hints: [
      "Hledej zahradní jarní květinu, která má uprostřed nápadnou trubičku.",
      "Kolem trubičky má šest okvětních lístků jako hvězdičku. Roste z cibulky a na jaře ji často dáváme do vázy.",
    ],
    solutionSteps: ["V zahradě kvete narcis — má okvětní lístky a uprostřed žlutou trubičku."],
    optionFeedback: {
      Tulipán: "Tulipán má květ jako pohárek, trubičku uprostřed nemá.",
      Růže: "Růže kvete v létě a trubičku nemá.",
      Pampeliška: "Pampeliška roste na louce a trubičku nemá.",
    },
  },
  {
    question: "Jak se jmenují drobné žluté jarní kvítky, kterým se říká také prvosenka?",
    correctAnswer: "Petrklíč",
    options: ["Tulipán", "Sněženka", "Petrklíč", "Narcis"],
    emoji: "🌼",
    hints: [
      "Hledej drobné žluté jarní kvítky rostoucí v trávě, jinak zvané prvosenka.",
      "Kvítky visí ve svazečku na stonku a podobají se klíčům. Proto má tahle květina v názvu slovo klíč.",
    ],
    solutionSteps: ["V trávě kvete petrklíč — říká se mu také prvosenka a kvete brzy na jaře."],
    optionFeedback: {
      Tulipán: "Tulipán je velká zahradní květina, ne drobné kvítky v trávě.",
      Sněženka: "Sněženka je bílá, ne žlutá.",
      Narcis: "Narcis je větší zahradní květina s trubičkou, prvosenka se mu neříká.",
    },
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Čí mládě je kotě?",
    correctAnswer: "Kočky",
    options: ["Psa", "Krávy", "Kozy", "Kočky"],
    emoji: "🐱",
    hints: [
      "Vzpomeň si, které dospělé zvíře má mládě, kterému se říká kotě.",
      "Mládě mňouká, přede a honí klubíčko. Najdi dospělé zvíře, které dělá totéž a chytá myši.",
    ],
    solutionSteps: ["Kotě je mládě kočky — z kotěte vyroste dospělá kočka."],
    optionFeedback: {
      Psa: "Pes má mládě štěně.",
      Krávy: "Kráva má mládě tele.",
      Kozy: "Koza má mládě kůzle. Slova kotě a kůzle začínají podobně, ale jsou to různá mláďata.",
    },
  },
  {
    question: "Čí mládě je štěně?",
    correctAnswer: "Psa",
    options: ["Psa", "Kočky", "Kozy", "Ovce"],
    emoji: "🐶",
    hints: [
      "Které dospělé zvíře štěká a jeho mládě se jmenuje štěně?",
      "Mládě se učí štěkat a vrtí ocáskem. Najdi dospělé zvíře, které hlídá dům a bydlí v boudě.",
    ],
    solutionSteps: ["Štěně je mládě psa — z malého štěněte vyroste dospělý pes."],
    optionFeedback: {
      Kočky: "Kočka má mládě kotě.",
      Kozy: "Koza má mládě kůzle.",
      Ovce: "Ovce má mládě jehně.",
    },
  },
  {
    question: "Čí mládě je tele?",
    correctAnswer: "Krávy",
    options: ["Kozy", "Krávy", "Ovce", "Koně"],
    emoji: "🐄",
    hints: [
      "Které velké zvíře na statku bučí a dává mléko, a jeho mládě je tele?",
      "Mládě tiše bučí a pije mléko od maminky. Najdi dospělé zvíře, které se pase na louce a zemědělec ho každý den dojí.",
    ],
    solutionSteps: ["Tele je mládě krávy — z telete vyroste dospělá kráva."],
    optionFeedback: {
      Kozy: "Koza má mládě kůzle.",
      Ovce: "Ovce má mládě jehně.",
      Koně: "Kůň má mládě hříbě.",
    },
  },
  {
    question: "Čí mládě je hříbě?",
    correctAnswer: "Koně",
    options: ["Krávy", "Ovce", "Koně", "Prasete"],
    emoji: "🐴",
    hints: [
      "Které zvíře umí rychle běhat a vozit jezdce, a jeho mládě je hříbě?",
      "Slovo hříbě je příbuzné se slovem hřebec. Najdi zvíře, které má hřívu a kopyta a bydlí ve stáji.",
    ],
    solutionSteps: ["Hříbě je mládě koně — z hříběte vyroste dospělý kůň."],
    optionFeedback: {
      Krávy: "Kráva má mládě tele.",
      Ovce: "Ovce má mládě jehně.",
      Prasete: "Prase má mládě sele.",
    },
  },
  {
    question: "Čí mládě je sele?",
    correctAnswer: "Prasete",
    options: ["Ovce", "Kozy", "Krávy", "Prasete"],
    emoji: "🐷",
    hints: [
      "Které růžové zvíře na statku chrochtá a jeho mládě je sele?",
      "Mládě má rypáček a zatočený ocásek. Najdi dospělé zvíře, které bydlí v chlívku a rádo se válí v bahně.",
    ],
    solutionSteps: ["Sele je mládě prasete — z malého selete vyroste dospělé prase."],
    optionFeedback: {
      Ovce: "Ovce má mládě jehně.",
      Kozy: "Koza má mládě kůzle.",
      Krávy: "Kráva má mládě tele.",
    },
  },
  {
    question: "Čí mládě je jehně?",
    correctAnswer: "Ovce",
    options: ["Ovce", "Kozy", "Krávy", "Koně"],
    emoji: "🐑",
    hints: [
      "Které zvíře má vlnu, ze které se dělá svetr, a jeho mládě je jehně?",
      "Pozor na podobná zvířata: koza má bradku a mečí, kdežto hledané zvíře má kudrnatou vlnu a bečí.",
    ],
    solutionSteps: ["Jehně je mládě ovce — z jehněte vyroste dospělá ovce."],
    optionFeedback: {
      Kozy: "Koza má mládě kůzle. Koza a ovce se často pletou.",
      Krávy: "Kráva má mládě tele.",
      Koně: "Kůň má mládě hříbě.",
    },
  },
  {
    question: "Čí mládě je kůzle?",
    correctAnswer: "Kozy",
    options: ["Ovce", "Kozy", "Krávy", "Prasete"],
    emoji: "🐐",
    hints: [
      "Které zvíře mečí, rádo šplhá a jeho mládě je kůzle?",
      "Slovo kůzle zní podobně jako jméno dospělého zvířete. Hledej zvíře s rohy a bradkou, které dává mléko.",
    ],
    solutionSteps: ["Kůzle je mládě kozy — z kůzlete vyroste dospělá koza."],
    optionFeedback: {
      Ovce: "Ovce má mládě jehně. Ovce a koza se často pletou.",
      Krávy: "Kráva má mládě tele.",
      Prasete: "Prase má mládě sele.",
    },
  },
  {
    question: "Čí mládě je kuře?",
    correctAnswer: "Slepice",
    options: ["Husy", "Kachny", "Slepice", "Kozy"],
    emoji: "🐔",
    hints: [
      "Které zvíře snáší vajíčka a jeho mládě je žluté pípající kuře?",
      "Mládě se líhne z vejce a neumí plavat. Najdi ptáka, který kdáká, zobe zrní na dvoře a spí v kurníku.",
    ],
    solutionSteps: ["Kuře je mládě slepice — z kuřete vyroste dospělá slepice."],
    optionFeedback: {
      Husy: "Husa má mládě house.",
      Kachny: "Kachna má mládě káče, které umí plavat.",
      Kozy: "Koza vejce nesnáší, má mládě kůzle.",
    },
  },
  {
    question: "Čí mládě je pulec?",
    correctAnswer: "Žáby",
    options: ["Ryby", "Hada", "Ještěrky", "Žáby"],
    emoji: "🐸",
    hints: [
      "Malé zvířátko s ocáskem plave v rybníku a vyroste z něj skákavé zvíře.",
      "Pulec nejdřív žije jen ve vodě, pak mu narostou nožky a ocásek zmizí. Které zvíře potom vyskočí na břeh a kváká?",
    ],
    solutionSteps: ["Pulec je mládě žáby — pulci žijí ve vodě a postupně z nich vyroste žába."],
    optionFeedback: {
      Ryby: "Pulec plave jako rybka, ale nožky mu narostou. Ryba nožky nemá.",
      Hada: "Had nemá nohy a jeho mládě se nepromění.",
      Ještěrky: "Mládě ještěrky vypadá jako malá ještěrka, ve vodě se neproměňuje.",
    },
  },
  {
    question: "Čí mládě je králíče?",
    correctAnswer: "Králíka",
    options: ["Králíka", "Zajíce", "Kočky", "Psa"],
    emoji: "🐰",
    hints: [
      "Které chované zvíře s dlouhýma ušima žije v kotci a jeho mládě je králíče?",
      "Pozor na podobná zvířata: zajíc žije volně na poli, kdežto hledané zvíře chováme doma v kotci. Slovo králíče je od jeho jména.",
    ],
    solutionSteps: ["Králíče je mládě králíka — pozor, mládě zajíce je zajíče, to je jiné zvíře."],
    optionFeedback: {
      Zajíce: "Zajíc má mládě zajíče. Zajíc je divoký, králík domácí.",
      Kočky: "Kočka má mládě kotě.",
      Psa: "Pes má mládě štěně.",
    },
  },
  {
    question: "Ve kterém ročním období se rodí nejvíce mláďat na statku i v přírodě?",
    correctAnswer: "Na jaře",
    options: ["V zimě", "Na jaře", "Na podzim", "V létě"],
    emoji: "🌱",
    hints: [
      "Přemýšlej, kdy se otepluje, roste tráva a příroda se probouzí.",
      "Mláďata potřebují teplo a hodně potravy, aby do zimy vyrostla a zesílila. Ve kterém období to všechno právě začíná?",
    ],
    solutionSteps: ["Nejvíce mláďat se rodí na jaře — je teplo a je dostatek potravy."],
    optionFeedback: {
      "V zimě": "V zimě je mráz a málo potravy, pro mláďata to je těžké období.",
      "Na podzim": "Na podzim se ochlazuje, mláďata by do zimy nestihla vyrůst.",
      "V létě": "V létě už mláďata, která se narodila dřív, rostou. Nejvíc se jich rodí o období dřív.",
    },
  },
  {
    question: "Ve kterém ročním období kvetou sněženky, petrklíče a narcisy?",
    correctAnswer: "Na jaře",
    options: ["V zimě", "Na podzim", "Na jaře", "V létě"],
    emoji: "🌷",
    hints: [
      "Tyto květiny se objeví hned, jak roztaje sníh a začne se oteplovat.",
      "Sněženka kvete ještě ve sněhu na konci zimy, ostatní hned po ní. Které období přichází těsně po zimě?",
    ],
    solutionSteps: ["Sněženky, petrklíče a narcisy kvetou na jaře — jsou to jarní květiny."],
    optionFeedback: {
      "V zimě": "V zimě je mráz a květiny nekvetou. Sněženka se objeví až na jejím konci.",
      "Na podzim": "Na podzim květiny spíš odkvétají a listí padá.",
      "V létě": "V létě už tyto květiny odkvetly. Kvetou dřív.",
    },
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Na rybníku plave žluté chlupaté mládě hned za maminkou kachnou. Které mládě to je?",
    correctAnswer: "Káče",
    options: ["Kuře", "House", "Sele", "Káče"],
    emoji: "🦆",
    hints: [
      "Kuře je taky žluté, ale neplave. Hledej mládě, které plave a patří ke kachně.",
      "Spoj dva údaje ze zadání: mládě umí plavat a jeho maminka je kachna. Ptačí mládě, které plave, je i u husy, ale tady jde o kachnu.",
    ],
    solutionSteps: [
      "Je to káče — mládě kachny, které umí plavat. Kuře je sice také žluté, ale plavat neumí, protože je to mládě slepice.",
    ],
    optionFeedback: {
      Kuře: "Kuře je žluté, ale je to mládě slepice a plavat neumí.",
      House: "House plave, ale je to mládě husy, ne kachny.",
      Sele: "Sele je mládě prasete. Za kachnou po rybníku neplave.",
    },
  },
  {
    question: "Na louce poskakuje mládě s bílou vlněnou srstí a jeho maminka bečí „bééé“. Které mládě to je?",
    correctAnswer: "Jehně",
    options: ["Jehně", "Kůzle", "Tele", "Sele"],
    emoji: "🐑",
    hints: [
      "Vlněnou srst a bečení „bééé“ má ovce. Jak se jmenuje mládě ovce?",
      "Postupuj ve dvou krocích: nejdřív podle vlny a bečení poznej maminku, pak si vzpomeň na jméno jejího mláděte. Pozor na podobnou kozu.",
    ],
    solutionSteps: [
      "Je to jehně — mládě ovce, která má vlnu a bečí. Kůzle je mládě kozy, to je jiné zvíře.",
    ],
    optionFeedback: {
      Kůzle: "Kůzle je mládě kozy. Koza nemá vlnu, ale krátkou srst a bradku.",
      Tele: "Tele je mládě krávy. Kráva bučí a vlnu nemá.",
      Sele: "Sele je mládě prasete. Prase chrochtá a vlnu nemá.",
    },
  },
  {
    question: "Ve stáji stojí na dlouhých nohách mládě, ze kterého vyroste kůň. Které mládě to je?",
    correctAnswer: "Hříbě",
    options: ["Tele", "Hříbě", "Sele", "Jehně"],
    emoji: "🐴",
    hints: [
      "Hledej mládě, které patří ke koni a hned po narození stojí na nohách.",
      "Zadání ti prozradilo, jaké zvíře z mláděte vyroste. Vzpomeň si, jak se jmenuje samec koně, a najdi mládě s podobným jménem.",
    ],
    solutionSteps: [
      "Je to hříbě — mládě koně. Tele je mládě krávy a z něj vyroste kráva, ne kůň.",
    ],
    optionFeedback: {
      Tele: "Z telete vyroste kráva, ne kůň.",
      Sele: "Ze selete vyroste prase, ne kůň.",
      Jehně: "Z jehněte vyroste ovce, ne kůň.",
    },
  },
  {
    question: "Malé růžové mládě chrochtá u maminky prasnice a rýpe rypáčkem. Které mládě to je?",
    correctAnswer: "Sele",
    options: ["Tele", "Kuře", "Sele", "Kotě"],
    emoji: "🐷",
    hints: [
      "Prasnice je samice prasete. Jak se jmenuje její růžové mládě?",
      "Spoj údaje ze zadání: chrochtání, rypáček a maminka prasnice patří k jednomu zvířeti. Jeho mládě má krátké jméno na „s“.",
    ],
    solutionSteps: [
      "Je to sele — mládě prasete. Chrochtání a rypáček patří k praseti, ne k jinému zvířeti.",
    ],
    optionFeedback: {
      Tele: "Tele je mládě krávy. Nechrochtá a rypáček nemá.",
      Kuře: "Kuře je ptáče, má zobáček, ne rypáček.",
      Kotě: "Kotě mňouká, nechrochtá.",
    },
  },
  {
    question: "Kuře vyroste. Jaké dospělé zvíře z něj bude?",
    correctAnswer: "Slepice",
    options: ["Kachna", "Husa", "Koza", "Slepice"],
    emoji: "🐔",
    hints: [
      "Když víš, čí mládě je kuře, víš i to, co z něj vyroste.",
      "Otoč otázku: které dospělé zvíře má mládě jménem kuře? Pomůže ti vzpomenout si, kdo kuře vodí po dvoře a kdo ho vysedí z vejce.",
    ],
    solutionSteps: [
      "Z kuřete vyroste dospělá slepice (nebo kohout) — kuře je jejich mládě. Kachna ani husa to není.",
    ],
    optionFeedback: {
      Kachna: "Kachna má mládě káče, ne kuře.",
      Husa: "Husa má mládě house, ne kuře.",
      Koza: "Koza není pták, má mládě kůzle.",
    },
  },
  {
    question: "Jehně vyroste. Jaké dospělé zvíře z něj bude?",
    correctAnswer: "Ovce",
    options: ["Ovce", "Koza", "Kráva", "Prase"],
    emoji: "🐑",
    hints: [
      "Vzpomeň si, čí mládě je jehně — z něj potom vyroste.",
      "Otoč otázku: které dospělé zvíře má mládě jménem jehně? Je to zvíře s kudrnatou vlnou, které se na jaře stříhá.",
    ],
    solutionSteps: [
      "Z jehněte vyroste dospělá ovce (nebo beran) — jehně je jejich mládě. Koza má mládě kůzle, to je jiné zvíře.",
    ],
    optionFeedback: {
      Koza: "Koza má mládě kůzle. Z jehněte koza nevyroste.",
      Kráva: "Kráva má mládě tele.",
      Prase: "Prase má mládě sele.",
    },
  },
  {
    question: "Kotě vyroste. Jaké dospělé zvíře z něj bude?",
    correctAnswer: "Kočka",
    options: ["Koza", "Kočka", "Ovce", "Slepice"],
    emoji: "🐱",
    hints: [
      "Když víš, čí mládě je kotě, víš i to, jaké zvíře z něj vyroste.",
      "Otoč otázku: které dospělé zvíře má mládě jménem kotě? Je to zvíře, které mňouká, přede a chytá myši.",
    ],
    solutionSteps: [
      "Z kotěte vyroste dospělá kočka (nebo kocour) — kotě je jejich mládě.",
    ],
    optionFeedback: {
      Koza: "Koza má mládě kůzle. Kotě a kůzle začínají podobně, ale jsou to různá mláďata.",
      Ovce: "Ovce má mládě jehně.",
      Slepice: "Slepice má mládě kuře.",
    },
  },
  {
    question: "House vyroste. Jaké dospělé zvíře z něj bude?",
    correctAnswer: "Husa",
    options: ["Kachna", "Slepice", "Husa", "Koza"],
    emoji: "🦢",
    hints: [
      "Vzpomeň si, čí mládě je house — z něj potom vyroste.",
      "Otoč otázku: které dospělé zvíře má mládě jménem house? Slovo house zní skoro stejně jako jméno toho zvířete.",
    ],
    solutionSteps: [
      "Z house vyroste dospělá husa (nebo houser) — house je jejich mládě. Kachna je podobná, ale je to jiné zvíře.",
    ],
    optionFeedback: {
      Kachna: "Kachna má mládě káče, ne house.",
      Slepice: "Slepice má mládě kuře.",
      Koza: "Koza není pták, má mládě kůzle.",
    },
  },
  {
    question: "Koza mečí a šplhá. Jak se jmenuje její mládě?",
    correctAnswer: "Kůzle",
    options: ["Jehně", "Tele", "Sele", "Kůzle"],
    emoji: "🐐",
    hints: [
      "Pozor, ať kozu nezaměníš za ovci. Ovce má jehně, koza má jiné mládě.",
      "Koza a ovce se pletou, protože obě mají podobná mláďata. Jméno mláděte kozy ale vzniklo přímo ze slova koza.",
    ],
    solutionSteps: [
      "Mládě kozy je kůzle. Jehně je mládě ovce — koza a ovce jsou dvě různá zvířata.",
    ],
    optionFeedback: {
      Jehně: "Jehně je mládě ovce. Koza a ovce jsou dvě různá zvířata.",
      Tele: "Tele je mládě krávy.",
      Sele: "Sele je mládě prasete.",
    },
  },
  {
    question: "Pampeliška kvete žlutě na louce, když už je teplo. Která jarní květina ji předběhne a vykvete ještě ve sněhu?",
    correctAnswer: "Sněženka",
    options: ["Sněženka", "Petrklíč", "Tulipán", "Narcis"],
    emoji: "🌼",
    hints: [
      "Hledáš květinu, která kvete úplně první, když ještě leží sníh.",
      "Porovnej, kdy kvete každá možnost. Tulipán a narcis rostou na zahradě až v teple, petrklíč kvete na jaře v trávě. Která květina má sníh přímo ve jméně?",
    ],
    solutionSteps: [
      "Jako první kvete sněženka — je bílá a objeví se ještě ve sněhu. Pampeliška, petrklíč, tulipán i narcis kvetou až později, když sníh roztaje.",
    ],
    optionFeedback: {
      Petrklíč: "Petrklíč kvete brzy na jaře, ale až v trávě, když sníh roztaje.",
      Tulipán: "Tulipán kvete na zahradě až v teplejším jaru, ve sněhu ne.",
      Narcis: "Narcis kvete až v teplejším jaru, ve sněhu ne.",
    },
  },
  {
    question: "Děti foukají do bílé chmýřové kuličky a semínka letí do dálky. Která rostlina to byla a jaký měla předtím květ?",
    correctAnswer: "Pampeliška se žlutým květem",
    options: [
      "Pampeliška se žlutým květem",
      "Sněženka s bílým květem",
      "Petrklíč se žlutým květem",
      "Tulipán s červeným květem",
    ],
    emoji: "🌼",
    hints: [
      "Chmýří vzniká z odkvetlého květu. Bílá barva chmýří ještě neznamená, že květ byl bílý.",
      "Vyřeš dva kroky: nejdřív najdi rostlinu, ze které se po odkvetení udělá chmýří na foukání. Pak si vzpomeň, jakou barvu měl její květ na louce.",
    ],
    solutionSteps: [
      "Byla to pampeliška — nejdřív má žlutý květ a po odkvetení se z něj udělá bílá kulička chmýří. Petrklíč je také žlutý, ale chmýří nemá.",
    ],
    optionFeedback: {
      "Sněženka s bílým květem": "Sněženka je bílá, ale chmýří nemá. Bílé chmýří vzniká z květu jiné barvy.",
      "Petrklíč se žlutým květem": "Petrklíč je žlutý, ale po odkvetení se z něj chmýřová kulička neudělá.",
      "Tulipán s červeným květem": "Tulipán po odkvetení chmýří nemá, jen mu opadají lístky.",
    },
  },
  {
    question: "Tulipán má květ jako hladký pohárek. Která jiná zahradní jarní květina má uprostřed květu žlutou trubičku?",
    correctAnswer: "Narcis",
    options: ["Tulipán", "Sněženka", "Narcis", "Pampeliška"],
    emoji: "🌼",
    hints: [
      "Hledáš jinou květinu než tu ze zadání, a musí mít uprostřed trubičku.",
      "Ověř obě podmínky: roste na zahradě a má trubičku. Sněženka má svěšené bílé kvítky, pampeliška roste sama na louce. Která zbývá?",
    ],
    solutionSteps: [
      "Je to narcis — uprostřed květu má žlutou trubičku. Tulipán má jen pohárkovitý květ bez trubičky.",
    ],
    optionFeedback: {
      Tulipán: "Tulipán má podle zadání hladký pohárek bez trubičky. Hledáš jinou květinu.",
      Sněženka: "Sněženka má malé bílé svěšené kvítky bez trubičky.",
      Pampeliška: "Pampeliška roste na louce a trubičku nemá.",
    },
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const KVETOUCIROSTLINYMLADATA: TopicMetadata[] = [
  {
    id: "g2-prv-jaro-rostliny-mladata",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-priroda-na-jare-a-v-lete-kvetouci-rostliny-mladata-zvirat",
    title: "Kvetoucí rostliny a mláďata zvířat",
    studentTitle: "Mláďata a květiny",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Příroda na jaře a v létě",
    briefDescription: "Poznáš mláďata zvířat a jarní květiny.",
    keywords: ["mládě", "kotě", "štěně", "tele", "květina", "jaro"],
    goals: [
      "Znát jména mláďat zvířat.",
      "Poznat jarní květiny.",
      "Spojit zvíře a jeho mládě.",
    ],
    boundaries: ["Pouze běžná mláďata a květiny.", "Bez růstu rostlin."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Každé zvíře má pro mládě své jméno. Na jaře kvetou květiny.",
      steps: ["Přečti otázku.", "Jak se mládě jmenuje?"],
      commonMistake: "Záměna jmen mláďat (kotě vs. štěně).",
      example: "Mládě kočky je kotě, mládě psa je štěně.",
    },
  },
];
