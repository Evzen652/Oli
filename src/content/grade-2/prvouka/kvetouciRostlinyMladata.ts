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
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Jak se jmenuje mládě kočky?",
    correctAnswer: "Kotě",
    options: ["Kotě", "Štěně", "Tele", "Kuře"],
    emoji: "🐱",
    hints: ["Malé roztomilé zvířátko, které kočka odkojí — jak se mu říká?"],
    solutionSteps: ["Mládě kočky je kotě — malá kočička, která si ráda hraje."],
  },
  {
    question: "Jak se jmenuje mládě psa?",
    correctAnswer: "Štěně",
    options: ["Kotě", "Štěně", "Hříbě", "Sele"],
    emoji: "🐶",
    hints: ["Malý pejsek, který se teprve učí chodit a štěká — jak se jmenuje?"],
    solutionSteps: ["Mládě psa je štěně — malý pejsek, který se právě narodil."],
  },
  {
    question: "Jak se jmenuje mládě krávy?",
    correctAnswer: "Tele",
    options: ["Sele", "Kůzle", "Tele", "Hříbě"],
    emoji: "🐄",
    hints: ["Malá kráva, která se ještě kojí u maminky — jak se jmenuje?"],
    solutionSteps: ["Mládě krávy je tele — teprve se učí chodit a pije mléko od krávy."],
  },
  {
    question: "Jak se jmenuje mládě koně?",
    correctAnswer: "Hříbě",
    options: ["Tele", "Štěně", "Jehně", "Hříbě"],
    emoji: "🐴",
    hints: ["Malý kůň na dlouhých tenkých nožkách — jak se jmenuje?"],
    solutionSteps: ["Mládě koně je hříbě — brzy po narození se postaví na nohy."],
  },
  {
    question: "Jak se jmenuje mládě prasete?",
    correctAnswer: "Sele",
    options: ["Sele", "Kuře", "Tele", "Kotě"],
    emoji: "🐷",
    hints: ["Malé růžové prasátko, které chrochtá u maminky — jak se jmenuje?"],
    solutionSteps: ["Mládě prasete je sele — malé růžové prasátko."],
  },
  {
    question: "Jak se jmenuje mládě slepice?",
    correctAnswer: "Kuře",
    options: ["Sele", "Kuře", "House", "Kotě"],
    emoji: "🐔",
    hints: ["Žluté chlupaté ptáče, které pípá a běhá za slepicí — jak se jmenuje?"],
    solutionSteps: ["Mládě slepice je kuře — žluté pípající ptáče."],
  },
  {
    question: "Jak se jmenuje mládě ovce?",
    correctAnswer: "Jehně",
    options: ["Kůzle", "Tele", "Jehně", "Sele"],
    emoji: "🐑",
    hints: ["Malá ovečka s bílou vlněnou srstí na louce — jak se jmenuje?"],
    solutionSteps: ["Mládě ovce je jehně — má měkkou bílou vlněnou srst."],
  },
  {
    question: "Jak se jmenuje mládě kozy?",
    correctAnswer: "Kůzle",
    options: ["Jehně", "Sele", "Štěně", "Kůzle"],
    emoji: "🐐",
    hints: ["Malá kozička, která ráda poskakuje — jak se jmenuje?"],
    solutionSteps: ["Mládě kozy je kůzle — malá kozička, co poskakuje a mečí."],
  },
  {
    question: "Jak se jmenuje mládě husy?",
    correctAnswer: "House",
    options: ["House", "Kuře", "Káče", "Tele"],
    emoji: "🦢",
    hints: ["Malá husa, která chodí za maminkou v řadě — jak se jmenuje?"],
    solutionSteps: ["Mládě husy je house — chodí za husou husí maminkou."],
  },
  {
    question: "Jak se jmenuje mládě kachny?",
    correctAnswer: "Káče",
    options: ["Kuře", "Káče", "House", "Sele"],
    emoji: "🦆",
    hints: ["Malé žluté ptáče, které umí hned plavat na rybníku — jak se jmenuje?"],
    solutionSteps: ["Mládě kachny je káče — malé kachňátko, které plave hned po narození."],
  },
  {
    question: "Malá bílá květina, která kvete jako první na jaře, často ještě ve sněhu, je?",
    correctAnswer: "Sněženka",
    options: ["Slunečnice", "Růže", "Sněženka", "Pampeliška"],
    emoji: "🌼",
    hints: ["Hledej bílou květinu, které nevadí ani sníh a kvete úplně první."],
    solutionSteps: ["Jako první kvete sněženka — má bílé kvítky a objeví se ještě ve sněhu."],
  },
  {
    question: "Žlutá kytička na louce, ze které se stane bílá chmýřová kulička na foukání, je?",
    correctAnswer: "Pampeliška",
    options: ["Sněženka", "Tulipán", "Konvalinka", "Pampeliška"],
    emoji: "🌼",
    hints: ["Hledej žlutou louční kytičku, jejíž chmýří se dá rozfoukat."],
    solutionSteps: ["Na louce kvete pampeliška — její žlutý květ se změní v bílý míček ze semen."],
  },
  {
    question: "Barevná jarní květina s pohárkovitým květem, kterou pěstujeme na zahradě a v truhlíku, je?",
    correctAnswer: "Tulipán",
    options: ["Tulipán", "Kopřiva", "Pampeliška", "Sněženka"],
    emoji: "🌷",
    hints: ["Hledej zahradní květinu s pohárkovitým květem, která bývá červená, žlutá i jiná."],
    solutionSteps: ["Na zahradě na jaře kvete tulipán — má pohárkovitý květ různých barev."],
  },
  {
    question: "Žlutá nebo bílá jarní zahradní květina, která má uprostřed květu trubičku, je?",
    correctAnswer: "Narcis",
    options: ["Tulipán", "Narcis", "Růže", "Pampeliška"],
    emoji: "🌼",
    hints: ["Hledej zahradní jarní květinu, která má uprostřed nápadnou trubičku."],
    solutionSteps: ["V zahradě kvete narcis — má okvětní lístky a uprostřed žlutou trubičku."],
  },
  {
    question: "Malé žluté jarní kvítky, kterým se říká také prvosenka a rostou v trávě, jsou?",
    correctAnswer: "Petrklíč",
    options: ["Tulipán", "Sněženka", "Petrklíč", "Narcis"],
    emoji: "🌼",
    hints: ["Hledej drobné žluté jarní kvítky rostoucí v trávě, jinak zvané prvosenka."],
    solutionSteps: ["V trávě kvete petrklíč — říká se mu také prvosenka a kvete brzy na jaře."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Čí mládě je kotě?",
    correctAnswer: "Kočky",
    options: ["Psa", "Krávy", "Kozy", "Kočky"],
    emoji: "🐱",
    hints: ["Vzpomeň si, které dospělé zvíře má mládě, kterému se říká kotě."],
    solutionSteps: ["Kotě je mládě kočky — z kotěte vyroste dospělá kočka."],
  },
  {
    question: "Čí mládě je štěně?",
    correctAnswer: "Psa",
    options: ["Psa", "Kočky", "Kozy", "Ovce"],
    emoji: "🐶",
    hints: ["Které dospělé zvíře štěká a jeho mládě se jmenuje štěně?"],
    solutionSteps: ["Štěně je mládě psa — z malého štěněte vyroste dospělý pes."],
  },
  {
    question: "Čí mládě je tele?",
    correctAnswer: "Krávy",
    options: ["Kozy", "Krávy", "Ovce", "Koně"],
    emoji: "🐄",
    hints: ["Které velké zvíře na statku bučí a dává mléko, a jeho mládě je tele?"],
    solutionSteps: ["Tele je mládě krávy — z telete vyroste dospělá kráva."],
  },
  {
    question: "Čí mládě je hříbě?",
    correctAnswer: "Koně",
    options: ["Krávy", "Ovce", "Koně", "Prasete"],
    emoji: "🐴",
    hints: ["Které zvíře umí běhat a vozit jezdce, a jeho mládě je hříbě?"],
    solutionSteps: ["Hříbě je mládě koně — z hříběte vyroste dospělý kůň."],
  },
  {
    question: "Čí mládě je sele?",
    correctAnswer: "Prasete",
    options: ["Ovce", "Kozy", "Krávy", "Prasete"],
    emoji: "🐷",
    hints: ["Které růžové zvíře na statku chrochtá a jeho mládě je sele?"],
    solutionSteps: ["Sele je mládě prasete — z malého selete vyroste dospělé prase."],
  },
  {
    question: "Čí mládě je jehně?",
    correctAnswer: "Ovce",
    options: ["Ovce", "Kozy", "Krávy", "Koně"],
    emoji: "🐑",
    hints: ["Které zvíře má vlnu, ze které se dělá svetr, a jeho mládě je jehně?"],
    solutionSteps: ["Jehně je mládě ovce — z jehněte vyroste dospělá ovce."],
  },
  {
    question: "Čí mládě je kůzle?",
    correctAnswer: "Kozy",
    options: ["Ovce", "Kozy", "Krávy", "Prasete"],
    emoji: "🐐",
    hints: ["Které zvíře mečí, rádo šplhá a jeho mládě je kůzle?"],
    solutionSteps: ["Kůzle je mládě kozy — z kůzlete vyroste dospělá koza."],
  },
  {
    question: "Čí mládě je kuře?",
    correctAnswer: "Slepice",
    options: ["Husy", "Kachny", "Slepice", "Kozy"],
    emoji: "🐔",
    hints: ["Které zvíře snáší vajíčka a jeho mládě je žluté pípající kuře?"],
    solutionSteps: ["Kuře je mládě slepice — z kuřete vyroste dospělá slepice."],
  },
  {
    question: "Čí mládě je pulec?",
    correctAnswer: "Žáby",
    options: ["Ryby", "Hada", "Ještěrky", "Žáby"],
    emoji: "🐸",
    hints: ["Malé zvířátko s ocáskem plave v rybníku a vyroste z něj skákavé zvíře."],
    solutionSteps: ["Pulec je mládě žáby — pulci žijí ve vodě a postupně z nich vyroste žába."],
  },
  {
    question: "Čí mládě je králíče?",
    correctAnswer: "Králíka",
    options: ["Králíka", "Zajíce", "Kočky", "Psa"],
    emoji: "🐰",
    hints: ["Které chované zvíře s dlouhýma ušima žije v kotci a jeho mládě je králíče?"],
    solutionSteps: ["Králíče je mládě králíka — pozor, mládě zajíce je zajíče, to je jiné zvíře."],
  },
  {
    question: "V kterém ročním období se rodí nejvíce mláďat na statku i v přírodě?",
    correctAnswer: "Na jaře",
    options: ["V zimě", "Na jaře", "Na podzim", "V létě"],
    emoji: "🌱",
    hints: ["Přemýšlej, kdy se otepluje, roste tráva a příroda se probouzí."],
    solutionSteps: ["Nejvíce mláďat se rodí na jaře — je teplo a je dostatek potravy."],
  },
  {
    question: "V kterém ročním období kvetou sněženky, petrklíče a narcisy?",
    correctAnswer: "Na jaře",
    options: ["V zimě", "Na podzim", "Na jaře", "V létě"],
    emoji: "🌷",
    hints: ["Tyto květiny se objeví hned, jak roztaje sníh a začne se oteplovat."],
    solutionSteps: ["Sněženky, petrklíče a narcisy kvetou na jaře — jsou to jarní květiny."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Na rybníku plave žluté chlupaté mládě hned za maminkou kachnou. Které mládě to je?",
    correctAnswer: "Káče",
    options: ["Kuře", "House", "Sele", "Káče"],
    emoji: "🦆",
    hints: ["Kuře je taky žluté, ale neplave. Hledej mládě, které plave a patří ke kachně."],
    solutionSteps: [
      "Je to káče — mládě kachny, které umí plavat. Kuře je sice také žluté, ale plavat neumí, protože je to mládě slepice.",
    ],
  },
  {
    question: "Na louce poskakuje mládě s bílou vlněnou srstí a jeho maminka bečí „bééé“. Které mládě to je?",
    correctAnswer: "Jehně",
    options: ["Jehně", "Kůzle", "Tele", "Sele"],
    emoji: "🐑",
    hints: ["Vlněnou srst a bečení „bééé“ má ovce. Jak se jmenuje mládě ovce?"],
    solutionSteps: [
      "Je to jehně — mládě ovce, která má vlnu a bečí. Kůzle je mládě kozy, to je jiné zvíře.",
    ],
  },
  {
    question: "Ve chlévě stojí na dlouhých nohách mládě, ze kterého vyroste kůň. Které mládě to je?",
    correctAnswer: "Hříbě",
    options: ["Tele", "Hříbě", "Sele", "Jehně"],
    emoji: "🐴",
    hints: ["Hledej mládě, které patří ke koni a hned po narození stojí na nohách."],
    solutionSteps: [
      "Je to hříbě — mládě koně. Tele je mládě krávy, ta na statku vypadá jinak.",
    ],
  },
  {
    question: "Malé růžové mládě chrochtá u maminky prasnice a rýpe rypáčkem. Které mládě to je?",
    correctAnswer: "Sele",
    options: ["Tele", "Kuře", "Sele", "Kotě"],
    emoji: "🐷",
    hints: ["Prasnice je maminka prase. Jak se jmenuje její růžové mládě?"],
    solutionSteps: [
      "Je to sele — mládě prasete. Chrochtání a rypáček patří k praseti, ne k jinému zvířeti.",
    ],
  },
  {
    question: "Kuře je mládě slepice. Až kuře vyroste, stane se z něj dospělá...?",
    correctAnswer: "Slepice",
    options: ["Kachna", "Husa", "Koza", "Slepice"],
    emoji: "🐔",
    hints: ["Když víš, čí mládě je kuře, víš i to, co z něj vyroste."],
    solutionSteps: [
      "Z kuřete vyroste dospělá slepice — kuře je její mládě. Kachna ani husa to není.",
    ],
  },
  {
    question: "Jehně je mládě ovce. Až jehně vyroste, stane se z něj dospělá...?",
    correctAnswer: "Ovce",
    options: ["Ovce", "Koza", "Kráva", "Prase"],
    emoji: "🐑",
    hints: ["Vzpomeň si, čí mládě je jehně — z něj potom vyroste."],
    solutionSteps: [
      "Z jehněte vyroste dospělá ovce — jehně je její mládě. Koza má mládě kůzle, to je jiné zvíře.",
    ],
  },
  {
    question: "Kotě je mládě kočky. Až kotě vyroste, stane se z něj dospělá...?",
    correctAnswer: "Kočka",
    options: ["Koza", "Kočka", "Ovce", "Slepice"],
    emoji: "🐱",
    hints: ["Když víš, čí mládě je kotě, víš i to, jaké zvíře z něj vyroste."],
    solutionSteps: [
      "Z kotěte vyroste dospělá kočka — kotě je její mládě.",
    ],
  },
  {
    question: "House je mládě husy. Až house vyroste, stane se z něj dospělá...?",
    correctAnswer: "Husa",
    options: ["Kachna", "Slepice", "Husa", "Koza"],
    emoji: "🦢",
    hints: ["Vzpomeň si, čí mládě je house — z něj potom vyroste."],
    solutionSteps: [
      "Z house vyroste dospělá husa — house je její mládě. Kachna je podobná, ale je to jiné zvíře.",
    ],
  },
  {
    question: "Koza mečí a šplhá. Její mládě se jmenuje...?",
    correctAnswer: "Kůzle",
    options: ["Jehně", "Tele", "Sele", "Kůzle"],
    emoji: "🐐",
    hints: ["Pozor, ať kozu nezaměníš za ovci. Ovce má jehně, koza má jiné mládě."],
    solutionSteps: [
      "Mládě kozy je kůzle. Jehně je mládě ovce — koza a ovce jsou dvě různá zvířata.",
    ],
  },
  {
    question: "Sněženka i pampeliška kvetou na jaře. Která z nich kvete jako první, ještě když leží sníh?",
    correctAnswer: "Sněženka",
    options: ["Sněženka", "Pampeliška", "Tulipán", "Narcis"],
    emoji: "🌼",
    hints: ["Jedna z nich je bílá a nevadí jí sníh, druhá je žlutá a kvete až na louce."],
    solutionSteps: [
      "Jako první kvete sněženka — je bílá a objeví se ještě ve sněhu. Pampeliška kvete žlutě až později na louce.",
    ],
  },
  {
    question: "Petrklíč i pampeliška mají žluté květy. Která z nich roste na louce a promění se v bílé chmýří na foukání?",
    correctAnswer: "Pampeliška",
    options: ["Petrklíč", "Pampeliška", "Sněženka", "Tulipán"],
    emoji: "🌼",
    hints: ["Obě jsou žluté, ale jen jedna se změní v chmýřovou kuličku, do které se fouká."],
    solutionSteps: [
      "Je to pampeliška — její žlutý květ se změní v bílé chmýří. Petrklíč zůstává žlutý a chmýří nemá.",
    ],
  },
  {
    question: "Tulipán i narcis se pěstují na zahradě. Která z těchto květin má uprostřed květu žlutou trubičku?",
    correctAnswer: "Narcis",
    options: ["Tulipán", "Sněženka", "Narcis", "Pampeliška"],
    emoji: "🌼",
    hints: ["Obě jsou zahradní jarní květiny, ale jen jedna má uprostřed nápadnou trubičku."],
    solutionSteps: [
      "Je to narcis — uprostřed květu má žlutou trubičku. Tulipán má jen pohárkovitý květ bez trubičky.",
    ],
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
