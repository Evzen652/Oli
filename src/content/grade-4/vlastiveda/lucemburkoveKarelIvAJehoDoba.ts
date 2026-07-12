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
// Disjunktní pooly obtížnosti (L1 < L2 < L3), drag_order chronologie.
//   L1 = rozpoznání: 3 velké mezníky s velkým rozestupem let (Jan → Karel → smrt/Václav)
//   L2 = aplikace:   4 události Karlovy kariéry, roky odlišné (1347→1348→1355→1356)
//   L3 = transfer:   5 událostí včetně těsné sekvence 1355→1356→1357 (přesná znalost)
// Poznámka: úlohy nikdy nepárují dvě stejnoleté události (univerzita 1348 vs
// Nové Město 1348) — pro žáka by pořadí bylo nejednoznačné. `items` jsou ve
// SPRÁVNÉM chronologickém pořadí (UI je při zobrazení zamíchá).
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Seřaď panovníky Lucemburků od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Lucemburský", "Karel IV.", "Václav IV."],
    hints: ["Karel IV. byl synem Jana Lucemburského.", "Václav IV. vládl po svém otci Karlovi IV."],
    explanation: "Jan Lucemburský přišel do Čech roku 1310. Jeho syn Karel IV. se stal Otcem vlasti. Po Karlovi vládl jeho syn Václav IV. — tři generace lucemburské dynastie.",
  },
  {
    question: "Seřaď události z života Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Lucemburský – král v Čechách (1310)", "Karel IV. – český král (1347)", "Karel IV. zemřel (1378)"],
    hints: ["Jan Lucemburský byl otcem Karla IV. — vládl dřív.", "Rok 1378 je konec vlády Karla IV."],
    explanation: "Jan Lucemburský nastolil dynastii roku 1310. Jeho syn Karel IV. se stal českým králem 1347 a vládl až do své smrti roku 1378.",
  },
  {
    question: "Seřaď kariéru Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Karel IV. – český král (1347)", "Karel IV. – císař Svaté říše římské (1355)", "Karel IV. zemřel (1378)"],
    hints: ["Nejdřív byl Karel českým králem, teprve pak císařem.", "Císařem se stal roku 1355."],
    explanation: "Karel IV. byl nejprve korunován českým králem (1347), poté získal nejvyšší hodnost tehdejší Evropy — stal se císařem Svaté říše římské (1355). Vládl až do roku 1378.",
  },
  {
    question: "Seřaď mezníky doby Karla IV. od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Lucemburský přišel do Čech (1310)", "Karel IV. – český král (1347)", "Karlův most – zahájena stavba (1357)"],
    hints: ["Jan Lucemburský přišel jako první, roku 1310.", "Karlův most se začal stavět až za vlády Karla IV."],
    explanation: "Jan Lucemburský přišel do Čech roku 1310. Jeho syn Karel IV. se stal králem 1347 a nechal roku 1357 zahájit stavbu Karlova mostu přes Vltavu.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Lucemburský – král v Čechách (1310)", "Karel IV. – císař (1355)", "Václav IV. nastupuje (1378)"],
    hints: ["Jan Lucemburský byl první — děd Václava IV.", "Václav IV. nastoupil po smrti Karla IV. roku 1378."],
    explanation: "Jan Lucemburský vládl od roku 1310. Jeho syn Karel IV. se stal císařem 1355. Po Karlově smrti roku 1378 nastoupil na trůn jeho syn Václav IV.",
  },
  {
    question: "Seřaď kariéru Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Karel IV. – český král (1347)", "Karlova univerzita v Praze (1348)", "Karel IV. – císař (1355)"],
    hints: ["Nejdřív se stal králem, pak založil univerzitu.", "Císařem se stal až roku 1355."],
    explanation: "Karel IV. byl korunován českým králem roku 1347. Hned následující rok (1348) založil Karlovu univerzitu — první ve střední Evropě. Roku 1355 se stal císařem.",
  },
  {
    question: "Seřaď mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Bitva u Kresčaku – Jan padl (1346)", "Karel IV. – český král (1347)", "Karel IV. zemřel (1378)"],
    hints: ["Bitva u Kresčaku byla ještě před korunovací Karla IV.", "Karel IV. zemřel roku 1378."],
    explanation: "V bitvě u Kresčaku (1346) padl Jan Lucemburský. Hned poté byl jeho syn Karel IV. korunován českým králem (1347). Karel vládl až do své smrti roku 1378.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Lucemburský přišel do Čech (1310)", "Karlova univerzita (1348)", "Karlův most (1357)"],
    hints: ["Jan Lucemburský přišel jako první — roku 1310.", "Univerzita (1348) je starší než Karlův most (1357)."],
    explanation: "Jan Lucemburský přišel do Čech roku 1310. Jeho syn Karel IV. založil roku 1348 Karlovu univerzitu a roku 1357 nechal zahájit stavbu Karlova mostu.",
  },
  {
    question: "Seřaď panovníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Jan Lucemburský (1310–1346)", "Karel IV. (1346–1378)", "Václav IV. (od 1378)"],
    hints: ["Roky vlády napovídají pořadí.", "Václav IV. nastoupil roku 1378."],
    explanation: "Jan Lucemburský vládl v Čechách 1310–1346. Po něm nastoupil jeho syn Karel IV. (1346–1378), Otec vlasti. Třetím byl Karlův syn Václav IV.",
  },
  {
    question: "Seřaď kariéru Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Karel IV. – český král (1347)", "Karel IV. – císař (1355)", "Zlatá bula (1356)"],
    hints: ["Nejdřív král, pak císař, pak zákon Zlatá bula.", "Zlatá bula je z roku 1356 — nejpozdější."],
    explanation: "Karel IV. byl nejprve český král (1347), poté císař Svaté říše římské (1355). Jako císař vydal roku 1356 Zlatou bulu — zákon o volbě císaře.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď události z doby Lucemburků od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král v Čechách (1310)",
      "Karel IV. – korunován českým králem (1347)",
      "Karel IV. – korunován císařem (1355)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["Jan Lucemburský byl nejdříve, Karel IV. zemřel roku 1378.", "Karel byl nejprve král (1347), pak císař (1355)."],
    explanation: "Jan Lucemburský přišel do Čech roku 1310 a nastolil novou dynastii. Jeho syn Karel IV. se stal českým králem (1347) i císařem Svaté říše římské (1355) — největší hodnost tehdejší Evropy. Zemřel roku 1378.",
  },
  {
    question: "Seřaď události z doby Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – český král (1347)",
      "Karlova univerzita (1348)",
      "Karel IV. – císař (1355)",
      "Zlatá bula – zákon o volbě císaře (1356)",
    ],
    hints: ["Karlova univerzita je z roku 1348.", "Zlatá bula (1356) přišla až po korunovaci na císaře (1355)."],
    explanation: "Karel IV. byl korunován českým králem 1347, hned další rok (1348) založil Karlovu univerzitu. Roku 1355 se stal císařem a roku 1356 vydal Zlatou bulu — zákon upravující volbu císaře.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. – korunován králem (1347)",
      "Karel IV. – korunován císařem (1355)",
      "Karel IV. zemřel – Václav IV. nastupuje (1378)",
    ],
    hints: ["Bitva u Kresčaku byla roku 1346.", "Václav IV. nastoupil po Karlovi roku 1378."],
    explanation: "Roku 1346 padl Jan Lucemburský v bitvě u Kresčaku a jeho syn Karel IV. nastoupil jako český král (1347). Karel se stal císařem (1355) a po jeho smrti roku 1378 nastoupil syn Václav IV.",
  },
  {
    question: "Seřaď mezníky doby Karla IV. od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – český král (1347)",
      "Karel IV. – císař (1355)",
      "Zlatá bula (1356)",
      "Karlův most – zahájena stavba (1357)",
    ],
    hints: ["Nejdřív král (1347), pak císař (1355).", "Karlův most (1357) je z těchto čtyř nejpozdější."],
    explanation: "Karel IV. byl král (1347), pak císař (1355). Jako císař vydal Zlatou bulu (1356) a roku 1357 zahájil stavbu Karlova mostu — dodnes stojící spojnice Starého a Malé Strany.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král v Čechách (1310)",
      "Bitva u Kresčaku – Jan padl (1346)",
      "Karel IV. – český král (1347)",
      "Karel IV. – císař (1355)",
    ],
    hints: ["Jan přišel roku 1310, u Kresčaku padl roku 1346.", "Karel se stal císařem až roku 1355."],
    explanation: "Jan Lucemburský vládl od roku 1310, roku 1346 padl v bitvě u Kresčaku. Jeho syn Karel IV. se stal českým králem (1347) a později císařem Svaté říše římské (1355).",
  },
  {
    question: "Seřaď události z doby Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – český král (1347)",
      "Nové Město pražské (1348)",
      "Karel IV. – císař (1355)",
      "Karlův most (1357)",
    ],
    hints: ["Nové Město pražské založil Karel IV. roku 1348.", "Karlův most (1357) je nejpozdější."],
    explanation: "Karel IV. jako král (1347) založil roku 1348 Nové Město pražské — Praha se stala největším městem severně od Alp. Roku 1355 se stal císařem a roku 1357 zahájil stavbu Karlova mostu.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král v Čechách (1310)",
      "Karel IV. – český král (1347)",
      "Karlova univerzita (1348)",
      "Zlatá bula (1356)",
    ],
    hints: ["Jan Lucemburský přišel roku 1310 — nejdříve.", "Zlatá bula (1356) je z těchto čtyř nejpozdější."],
    explanation: "Jan Lucemburský nastolil dynastii (1310). Jeho syn Karel IV. se stal králem (1347), založil Karlovu univerzitu (1348) a jako císař vydal Zlatou bulu (1356).",
  },
  {
    question: "Seřaď mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bitva u Kresčaku – Jan padl (1346)",
      "Karel IV. – český král (1347)",
      "Karlova univerzita (1348)",
      "Karel IV. – císař (1355)",
    ],
    hints: ["Kresčak (1346) přišel před korunovací Karla (1347).", "Univerzita (1348) je starší než korunovace na císaře (1355)."],
    explanation: "Po smrti Jana u Kresčaku (1346) nastoupil Karel IV. jako český král (1347). Roku 1348 založil Karlovu univerzitu a roku 1355 se stal císařem Svaté říše římské.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král v Čechách (1310)",
      "Karel IV. – císař (1355)",
      "Zlatá bula (1356)",
      "Karlův most (1357)",
    ],
    hints: ["Jan Lucemburský přišel roku 1310 — dávno před ostatními.", "Sleduj těsnou řadu: císař 1355 → bula 1356 → most 1357."],
    explanation: "Jan Lucemburský vládl od roku 1310. Jeho syn Karel IV. se stal císařem (1355), vydal Zlatou bulu (1356) a zahájil stavbu Karlova mostu (1357) — tři události ve třech po sobě jdoucích letech.",
  },
  {
    question: "Seřaď události z doby Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – český král (1347)",
      "Karlova univerzita (1348)",
      "Karlův most (1357)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["Nejdřív král (1347), pak univerzita (1348).", "Karel IV. zemřel roku 1378 — nejpozději."],
    explanation: "Karel IV. jako král (1347) založil univerzitu (1348) a zahájil stavbu Karlova mostu (1357). Vládl až do své smrti roku 1378, kdy nastoupil jeho syn Václav IV.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď události z doby Lucemburků od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský přišel do Čech (1310)",
      "Bitva u Kresčaku – Jan padl (1346)",
      "Karel IV. – český král (1347)",
      "Karel IV. – císař (1355)",
      "Karlův most – zahájena stavba (1357)",
    ],
    hints: ["Začátek je jasný (1310), pozor na těsný konec.", "Rozliš roky 1355, 1356, 1357 — jdou hned po sobě."],
    explanation: "Jan Lucemburský přišel roku 1310, padl u Kresčaku (1346). Karel IV. se stal králem (1347), císařem (1355) a roku 1357 zahájil stavbu Karlova mostu. Poslední roky vyžadují přesnost — jdou těsně po sobě.",
  },
  {
    question: "Seřaď události z doby Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bitva u Kresčaku – Jan padl (1346)",
      "Karel IV. – český král (1347)",
      "Karlova univerzita (1348)",
      "Karel IV. – císař (1355)",
      "Zlatá bula (1356)",
    ],
    hints: ["Začni Kresčakem (1346).", "Pozor na konec: císař (1355) přišel těsně před Zlatou bulou (1356)."],
    explanation: "Po smrti Jana u Kresčaku (1346) se Karel IV. stal králem (1347), založil univerzitu (1348), stal se císařem (1355) a vydal Zlatou bulu (1356). Poslední dva roky jdou hned za sebou — je třeba je rozlišit.",
  },
  {
    question: "Seřaď mezníky doby Karla IV. od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – český král (1347)",
      "Karlova univerzita (1348)",
      "Karel IV. – císař (1355)",
      "Zlatá bula (1356)",
      "Karlův most (1357)",
    ],
    hints: ["Začátek pomáhá materiál znalostí: král → univerzita.", "Konec je těsný: 1355 → 1356 → 1357, každý o rok."],
    explanation: "Karel IV. se stal králem (1347), založil univerzitu (1348). Tři těsně po sobě jdoucí roky pak tvoří vrchol jeho vlády: císař (1355), Zlatá bula (1356), Karlův most (1357).",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král v Čechách (1310)",
      "Karel IV. – český král (1347)",
      "Karel IV. – císař (1355)",
      "Zlatá bula (1356)",
      "Karel IV. zemřel – Václav IV. (1378)",
    ],
    hints: ["Jan přišel roku 1310, Václav nastoupil roku 1378.", "Uprostřed pozor: císař (1355) a Zlatá bula (1356) jsou hned za sebou."],
    explanation: "Jan Lucemburský vládl od 1310. Karel IV. byl král (1347), císař (1355), vydal Zlatou bulu (1356) a zemřel 1378 — pak nastoupil Václav IV. Prostřední dvojici (1355, 1356) je třeba přesně rozlišit.",
  },
  {
    question: "Seřaď události z doby Lucemburků od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský přišel do Čech (1310)",
      "Bitva u Kresčaku (1346)",
      "Karel IV. – český král (1347)",
      "Karlova univerzita (1348)",
      "Karel IV. – císař (1355)",
    ],
    hints: ["Kresčak (1346) a korunovace (1347) jdou hned po sobě.", "Univerzita (1348) přišla rok po korunovaci na krále."],
    explanation: "Jan Lucemburský přišel roku 1310, padl u Kresčaku (1346). Karel IV. se stal králem (1347), založil univerzitu (1348) a roku 1355 se stal císařem. První roky jdou těsně po sobě — chce to přesnost.",
  },
  {
    question: "Seřaď mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – český král (1347)",
      "Nové Město pražské (1348)",
      "Karel IV. – císař (1355)",
      "Karlův most (1357)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["Král (1347) → Nové Město (1348) je hned po sobě.", "Karlův most (1357) je před smrtí Karla (1378)."],
    explanation: "Karel IV. jako král (1347) založil Nové Město pražské (1348), stal se císařem (1355), zahájil Karlův most (1357) a zemřel 1378. Rozestupy jsou nepravidelné — dvě události hned po sobě, pak větší mezery.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský přišel do Čech (1310)",
      "Karel IV. – český král (1347)",
      "Karel IV. – císař (1355)",
      "Zlatá bula (1356)",
      "Karlův most (1357)",
    ],
    hints: ["Začátek je jasný — Jan 1310, pak Karel králem 1347.", "Konec je nejtěsnější: 1355 → 1356 → 1357."],
    explanation: "Jan Lucemburský (1310) nastolil dynastii. Karel IV. byl král (1347). Vrchol tvoří tři po sobě jdoucí roky: císař (1355), Zlatá bula (1356), Karlův most (1357) — každý o rok později.",
  },
  {
    question: "Seřaď události z doby Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bitva u Kresčaku – Jan padl (1346)",
      "Karel IV. – český král (1347)",
      "Nové Město pražské (1348)",
      "Karel IV. – císař (1355)",
      "Karlův most (1357)",
    ],
    hints: ["Kresčak → král → Nové Město jdou tři roky po sobě.", "Karlův most (1357) je nejpozdější."],
    explanation: "Po smrti Jana u Kresčaku (1346) se Karel IV. stal králem (1347), založil Nové Město pražské (1348), stal se císařem (1355) a zahájil Karlův most (1357). První tři roky jdou těsně za sebou.",
  },
  {
    question: "Seřaď mezníky doby Lucemburků od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král v Čechách (1310)",
      "Karel IV. – český král (1347)",
      "Karlova univerzita (1348)",
      "Zlatá bula (1356)",
      "Václav IV. nastupuje (1378)",
    ],
    hints: ["Král (1347) a univerzita (1348) jdou hned po sobě.", "Václav IV. nastoupil až roku 1378."],
    explanation: "Jan Lucemburský (1310), Karel IV. král (1347), univerzita (1348), Zlatá bula (1356). Po Karlově smrti nastoupil roku 1378 Václav IV. Prostřední dvojici (1347, 1348) je třeba přesně rozlišit.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský přišel do Čech (1310)",
      "Bitva u Kresčaku (1346)",
      "Karel IV. – český král (1347)",
      "Karel IV. – císař (1355)",
      "Karel IV. zemřel – Václav IV. (1378)",
    ],
    hints: ["Kresčak (1346) a korunovace (1347) jsou hned za sebou.", "Václav IV. nastoupil až po smrti Karla roku 1378."],
    explanation: "Jan Lucemburský přišel roku 1310, padl u Kresčaku (1346). Karel IV. se stal králem (1347) i císařem (1355) a vládl do roku 1378, kdy nastoupil Václav IV. Dvojici 1346/1347 je třeba rozlišit.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const LUCEMBURKOVEKARELIVAJEHODOBA: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-lucemburkove-karel-iv-a-jeho-doba",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-lucemburkove-karel-iv-a-jeho-doba",
    title: "Lucemburkové - Karel IV. a jeho doba",
    studentTitle: "Karel IV.",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš Karla IV., Otce vlasti — co postavil a proč je slavný.",
    keywords: ["Karel IV.", "Lucemburkové", "Otec vlasti", "Karlova univerzita", "Karlův most", "Karlštejn", "1348"],
    goals: [
      "Znát přezdívku a přínos Karla IV.",
      "Vyjmenovat stavby a díla Karla IV.",
      "Vědět, kdy a co Karel IV. budoval",
      "Pochopit roli Zlaté buly",
    ],
    boundaries: ["Detailní genealogie Lucemburků není vyžadována", "Politika Říma do hloubky není cílem"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Karel IV. = Otec vlasti. 1347 král, 1348 Karlova univerzita, 1355 císař, 1356 Zlatá bula, 1357 Karlův most.",
      steps: [
        "Karel IV. 1316–1378 = Otec vlasti",
        "1347 = český král, 1355 = císař Říše",
        "Díla: univerzita (1348), Nové Město (1348), Karlův most (1357)",
        "Otec = Jan Lucemburský (padl u Kresčaku 1346)",
      ],
      commonMistake: "Žáci si pletou pořadí těsných let 1355 (císař), 1356 (Zlatá bula) a 1357 (Karlův most).",
      example: "Karel IV.: český král 1347, univerzita 1348, císař 1355, Zlatá bula 1356, Karlův most 1357.",
    },
  },
];
