import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Každý task = seřaď historické události Lucemburků ve správném pořadí
const VSECHNY_TASKY: PracticeTask[] = [
  {
    question: "Seřaď události z doby Lucemburků od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král v Čechách (1310)",
      "Karel IV. korunován českým králem (1347)",
      "Karel IV. korunován císařem Svaté říše římské (1355)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1310 → 1347 → 1355 → 1378.", "Jan Lucemburský byl první, Karel IV. zemřel roku 1378."],
    explanation: "Jan Lucemburský přišel do Čech roku 1310 a nastolil novou dynastii. Jeho syn Karel IV. proslul jako Otec vlasti — byl zároveň českým králem i císařem Svaté říše římské, největší hodnost v tehdejší Evropě.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král v Čechách (1310–1346)",
      "Karel IV. – korunován českým králem (1347)",
      "Karel IV. – Karlova univerzita v Praze (1348)",
      "Zlatá bula – zákon o volbě císaře (1356)",
    ],
    hints: ["Jan Lucemburský byl nejdříve, zlatá bula nejpozději.", "Karlova univerzita byla roku 1348."],
    explanation: "Karel IV. v jediném roce (1348) postavil v Praze dvě velkolepé stavby: první univerzitu ve střední Evropě a celou novou čtvrť — Nové Město pražské. Zlatá bula (1356) pak upravila pravidla volby císaře.",
  },
  {
    question: "Seřaď události z doby Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. korunován českým králem (1347)",
      "Karel IV. zakládá Karlovu univerzitu (1348)",
      "Karel IV. zakládá Nové Město pražské (1348)",
      "Zlatá bula Karla IV. – zákon o volbě císaře (1356)",
    ],
    hints: ["1347 → univerzita 1348 → Nové Město 1348 → bula 1356.", "Karel IV. byl korunován roku 1347."],
    explanation: "Rok 1348 byl pro Prahu zlomový — Karel IV. tehdy zakládá Karlovu univerzitu i Nové Město pražské. Praha se stala největším městem severně od Alp a centrum Evropy se přesunulo na Vltavu.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. korunován králem (1347)",
      "Karel IV. korunován císařem v Římě (1355)",
      "Karel IV. zemřel – Václav IV. nastupuje (1378)",
    ],
    hints: ["Kresčak 1346 → král 1347 → císař 1355 → smrt 1378.", "Bitva u Kresčaku byla roku 1346."],
    explanation: "Rok 1346 byl pro Lucemburky osudový: Jan padl v bitvě u Kresčaku a druhý den Karel IV. nastoupil jako český král. Povýšení z korunního prince na krále přišlo v jediném okamžiku.",
  },
  {
    question: "Seřaď lucemburské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král Čech (1310)",
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. – Karlova univerzita (1348)",
      "Karel IV. – Karlův most zahájen (1357)",
    ],
    hints: ["1310 → Kresčak 1346 → 1348 → 1357.", "Jan Lucemburský byl nejdříve."],
    explanation: "Jan Lucemburský vládl Čechám 36 let a zemřel jako hrdina u Kresčaku. Syn Karel IV. ho předčil — postavil univerzitu (1348) a zahájil stavbu Karlova mostu (1357), symbolu Prahy dodnes.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců (1306) – nástup Lucemburků",
      "Jan Lucemburský – první lucemburský král v Čechách",
      "Karel IV. – Otec vlasti, korunován 1347",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["Zánik Přemyslovců (1306) byl nejdříve, Karel IV. zemřel roku 1378.", "Jan Lucemburský nastoupil po Přemyslovcích."],
    explanation: "Po zániku Přemyslovců roku 1306 nastoupila lucemburská dynastie. Karel IV. byl jejím vrcholným představitelem — přezdívaný Otec vlasti, přetransformoval Prahu na velkolepé středověké město.",
  },
  {
    question: "Seřaď události z éry Karla IV. od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. korunován českým králem (1347)",
      "Karel IV. zakládá Karlovu univerzitu (1348)",
      "Zlatá bula – zákon o volbě císaře (1356)",
      "Karel IV. zahajuje stavbu Karlova mostu (1357)",
    ],
    hints: ["1347 → 1348 → 1356 → 1357.", "Karel IV. byl korunován roku 1347."],
    explanation: "Karel IV. byl stavitel i zákonodárce. Roku 1348 otevřel Karlovu univerzitu, roku 1356 vydal zlatou bulu a roku 1357 zahájil stavbu Karlova mostu — vše v době pouhých deseti let.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – kralem od 1310",
      "Karel IV. narozen (1316)",
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. korunován králem (1347)",
    ],
    hints: ["1310 → Karel IV. 1316 → Kresčak 1346 → Karel IV. král 1347.", "Karel IV. se narodil roku 1316."],
    explanation: "Karel IV. se narodil roku 1316 jako Jan IV. — teprve při biřmování dostal jméno Karel. Otce Jana Lucemburského viděl naposledy v bitvě u Kresčaku roku 1346, kde Jan hrdinně zahynul.",
  },
  {
    question: "Seřaď lucemburské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – korunován králem (1347)",
      "Karlova univerzita – první ve střední Evropě (1348)",
      "Zlatá bula (1356)",
      "Karel IV. zemřel – začíná náboženská krize (1378)",
    ],
    hints: ["1347 → 1348 → 1356 → 1378.", "Karlova univerzita byla roku 1348."],
    explanation: "Karlova univerzita (1348) byla první ve střední Evropě — před ní byly jen Bologna, Paříž a Oxford. Karel IV. ji chtěl vytvořit z Prahy centrum vzdělanosti pro celou střední Evropu.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král v Čechách",
      "Karel IV. – korunován císařem v Římě (1355)",
      "Karel IV. – zlatá bula, zákon o volbě císaře (1356)",
      "Karel IV. zemřel (1378) – nástup Jana Husa",
    ],
    hints: ["Jan Lucemburský byl nejdříve, Karel IV. zemřel roku 1378.", "Karel IV. byl korunován císařem roku 1355."],
    explanation: "Karel IV. byl korunován v Římě roku 1355 a hned poté vydal zlatou bulu (1356). Jako císař si tak zajistil právo jako první vydat zákon o volbě císaře.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců (1306)",
      "Jan Lucemburský – král v Čechách",
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. – zakládá Karlovu univerzitu (1348)",
    ],
    hints: ["Zánik Přemyslovců (1306) byl nejdříve, Karlova univ. (1348) nejpozději.", "Jan Lucemburský nastoupil po roce 1306."],
    explanation: "Jan Lucemburský byl rytíř — vždy hledal dobrodružství a války. Padl roku 1346 v bitvě u Kresčaku jako slepý bojovník. Syn Karel IV. byl jeho pravým opakem — budovatel, diplomat a zákonodárce.",
  },
  {
    question: "Seřaď lucemburské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Karel IV. narozen (1316)",
      "Karel IV. korunován králem (1347)",
      "Karel IV. korunován císařem (1355)",
      "Karel IV. stavbu Karlův most (1357)",
    ],
    hints: ["1316 → 1347 → 1355 → 1357.", "Karel IV. se narodil roku 1316."],
    explanation: "Karel IV. prožil celý produktivní život v Čechách: narozen 1316, král 1347, císař 1355, Karlův most 1357 — a zemřel roku 1378. Praha vděčí Karlovi IV. za svou středověkou podobu.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král (1310)",
      "Karel IV. – Karlova univerzita (1348)",
      "Zlatá bula – zákon o volbě císaře (1356)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1310 → 1348 → 1356 → 1378.", "Jan Lucemburský byl nejdříve."],
    explanation: "Jan Lucemburský přinesl Čechám dynastické spojení se západní Evropou. Syn Karel IV. pak tuto výhodu plně využil: univerzita (1348) a zlatá bula (1356) přetransformovaly Prahu a Čechy na centrum Evropy.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. korunován českým králem",
      "Karel IV. – Nové Město pražské a Karlova univerzita",
      "Karel IV. korunován císařem v Římě",
    ],
    hints: ["Kresčak (1346) byl nejdříve, korunovace císařem (1355) nejpozději.", "Karel IV. byl korunován králem roku 1347."],
    explanation: "Karel IV. byl korunován českým králem roku 1347 a císařem Říma roku 1355. Mezi těmito lety vybudoval Nové Město pražské a Karlovu univerzitu — Praha se stala největším středověkým stavebním projektem v Evropě.",
  },
  {
    question: "Seřaď lucemburské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – kralem Čech (1310)",
      "Karel IV. – Karlova univerzita (1348)",
      "Karel IV. – Zlatá bula (1356)",
      "Karel IV. zemřel – Václav IV. nastupuje (1378)",
    ],
    hints: ["1310 → 1348 → 1356 → 1378.", "Jan Lucemburský nastoupil roku 1310."],
    explanation: "Jan Lucemburský vládl 36 let, Karel IV. pak dalších 31 let. Lucemburská dynastie tak panovala Čechám přes dvě generace naplno — a zanechala Praze gotické panorama, které trvá dodnes.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. narozen (1316)",
      "Karel IV. korunován král (1347) a zakládá univ. (1348)",
      "Zlatá bula (1356) – zákon o volbě císaře",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1316 → 1347/1348 → 1356 → 1378.", "Karel IV. se narodil roku 1316."],
    explanation: "Karel IV. strávil v Praze celý svůj dospělý život. Za 31 let vlády (1347–1378) přeměnil Prahu z gotické knížecí rezidence na velkoměsto s univerzitou, Novým Městem a Karlovým mostem.",
  },
  {
    question: "Seřaď události z lucemburské éry od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král",
      "Karel IV. – korunován králem 1347",
      "Zlatá bula – zákon o volbě císaře (1356)",
      "Karel IV. zemřel (1378) – nástup Jana Husa",
    ],
    hints: ["Jan Lucemburský byl nejdříve, Karel IV. zemřel roku 1378.", "Karel IV. byl korunován roku 1347."],
    explanation: "Lucemburský rod nastoupil roku 1310, ale skutečnou slávu přinesl teprve Karel IV. — přezdívaný Otec vlasti. Jeho dílo: Karlova univerzita, Nové Město pražské, Karlův most, Zlatá bula.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců (1306) – nástup Lucemburků",
      "Jan Lucemburský – první lucemburský krale",
      "Karel IV. – Karlova univerzita (1348)",
      "Karel IV. zemřel, Václav IV. nastupuje (1378)",
    ],
    hints: ["Zánik Přemyslovců (1306) byl nejdříve, Karel IV. zemřel roku 1378.", "Karlova univerzita byla roku 1348."],
    explanation: "Po Přemyslovcích nastoupili Lucemburkové — dynastická výměna proběhla pokojně, sňatkem. Karel IV. pak navázal na přemyslovské dědictví a rozvinul ho nad jejich úroveň.",
  },
  {
    question: "Seřaď lucemburské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. – korunován císařem (1355)",
      "Zlatá bula (1356)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["Kresčak (1346) byl nejdříve, Karel IV. zemřel roku 1378.", "Karel IV. byl korunován císařem roku 1355."],
    explanation: "U Kresčaku (1346) se psala rytířská kronika: slepý Jan Lucemburský odmítl opustit bitevní pole a padl. Druhý den se Karel IV. prohlásil českým králem a nastoupil na cestu k titulu císaře.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – korunován král Čech (1347)",
      "Karel IV. zakládá Karlovu univerzitu (1348)",
      "Karel IV. – korunován císařem (1355)",
      "Zlatá bula (1356) – zákon o volbě císaře",
    ],
    hints: ["1347 → 1348 → 1355 → 1356.", "Karel IV. byl korunován králem roku 1347."],
    explanation: "Čtyři léta — 1347 až 1357 — byla zlatou dekádou Čech. Karlova univerzita, korunovace císařem, zlatá bula a Karlův most: díla, která přetransformovala Prahu v centrum Evropy.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – král v Čechách (1310)",
      "Karel IV. – Karlova univerzita (1348)",
      "Karel IV. – Karlův most zahájen (1357)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1310 → 1348 → 1357 → 1378.", "Jan Lucemburský nastoupil roku 1310."],
    explanation: "Jan Lucemburský byl dobrodruh, Karel IV. byl budovatel. Otec řešil politická dobrodružství po celé Evropě, syn stavěl kameny, které stojí dodnes: Karlova univerzita (1348), Karlův most (1357).",
  },
  {
    question: "Seřaď lucemburské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců (1306)",
      "Jan Lucemburský – kralem Čech",
      "Karel IV. – Nové Město pražské (1348)",
      "Karel IV. korunován císařem (1355)",
    ],
    hints: ["Zánik Přemyslovců (1306) byl nejdříve, korunovace císařem (1355) nejpozději.", "Karlova univ. a Nové Město byly roku 1348."],
    explanation: "Karel IV. byl první neněmecký císař Svaté říše římské — a zároveň český král. Praha se za jeho vlády stala rezidenčním hlavním městem celé Říše: největší politické centrum střední Evropy.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – korunován česky král (1347)",
      "Zlatá bula – zákon o volbě císaře (1356)",
      "Karlův most zahájen (1357)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1347 → 1356 → 1357 → 1378.", "Karel IV. byl korunován roku 1347."],
    explanation: "Zlatá bula (1356) a Karlův most (1357) — oba projekty Karel IV. spustil ve dvou po sobě jdoucích letech. Zlatá bula upravila politiku celé Říše, Karlův most pak spojil Staré a Malé Město pražské.",
  },
  {
    question: "Seřaď lucemburské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první lucemburský král v Čechách (1310)",
      "Karel IV. narozen (1316)",
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. korunován králem Čech (1347)",
    ],
    hints: ["1310 → 1316 → Kresčak 1346 → Karel IV. král 1347.", "Karel IV. se narodil roku 1316."],
    explanation: "Karel IV. se narodil šest let po nástupu svého otce na český trůn. Vyrůstal ve Francii na dvoře krále — proto byl vzdělaným diplomatem, ne jen rytířem. Jeho vláda začala rok po otcově smrti.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – Karlova univerzita v Praze (1348)",
      "Karel IV. korunován císařem (1355)",
      "Zlatá bula (1356)",
      "Karlův most zahájen (1357)",
    ],
    hints: ["1348 → 1355 → 1356 → 1357.", "Karlova univerzita byla roku 1348."],
    explanation: "Karlův most byl zahájen 9. 7. 1357 — Karel IV. zvolil toto datum záměrně pro jeho symetrii. Stavba trvala přes 45 let, ale Karel IV. se jejího dokončení nedožil.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první Lucemburk v Čechách (1310)",
      "Karel IV. – Karlova univerzita (1348)",
      "Zlatá bula (1356)",
      "Karel IV. zemřel (1378) – začíná éra Jana Husa",
    ],
    hints: ["1310 → 1348 → 1356 → 1378.", "Jan Lucemburský nastoupil roku 1310."],
    explanation: "Karel IV. zemřel roku 1378 — a s ním skončil zlatý věk Čech. Nástupce Václav IV. byl slabý vládce a napjaté náboženské poměry brzy vedou k Janu Husovi a husitským válkám.",
  },
  {
    question: "Seřaď lucemburské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský kralem (1310)",
      "Karel IV. korunován česky král (1347)",
      "Zlatá bula (1356)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1310 → 1347 → 1356 → 1378.", "Jan Lucemburský nastoupil roku 1310."],
    explanation: "Lucemburská dynastie v Čechách trvala od roku 1310 do roku 1378. Karel IV. byl jejím vrcholem — Otec vlasti, přeměnil Prahu ze středověkého knížecího sídla v hlavní město celé Střední Evropy.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – narozen v Praze (1316)",
      "Karel IV. korunován králem Čech (1347)",
      "Karel IV. zakládá Nové Město pražské (1348)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1316 → 1347 → 1348 → 1378.", "Karel IV. se narodil roku 1316."],
    explanation: "Karel IV. byl v Čechách nejoblíbenějším středověkým panovníkem — i dnes nesou jeho jméno most, univerzita a jedno z největších náměstí v Praze. Přezdívku Otec vlasti si zasloužil plně.",
  },
  {
    question: "Seřaď lucemburské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců – nástup Lucemburků (1306)",
      "Jan Lucemburský vládl Čechám",
      "Karel IV. – Otec vlasti, korunován 1347",
      "Karel IV. zemřel, Václav IV. nastupuje (1378)",
    ],
    hints: ["Zánik Přemyslovců (1306) byl nejdříve, Karel IV. zemřel roku 1378.", "Karel IV. byl korunován roku 1347."],
    explanation: "Přemyslovci zanechali Čechám gotické základy — Lucemburkové na nich stavěli dál. Karel IV. otevřel první univerzitu ve střední Evropě a zahájil stavbu kamenného mostu, který stojí dodnes.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský kralem Čech (1310)",
      "Karel IV. – Karlova univerzita (1348)",
      "Karel IV. – Zlatá bula (1356)",
      "Václav IV. nastupuje – začíná krize vedoucí k husitství (1378)",
    ],
    hints: ["1310 → 1348 → 1356 → 1378.", "Jan Lucemburský nastoupil roku 1310."],
    explanation: "Karel IV. zanechal Čechám prosperující říši, ale po jeho smrti (1378) nastoupil slabý Václav IV. a narůstala náboženská nespokojenost — živnou půdu pro Jana Husa a jeho kritiku korupce v církvi.",
  },
  {
    question: "Seřaď lucemburské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – kralem Čech (1310)",
      "Karel IV. korunován králem (1347)",
      "Karel IV. – Karlův most zahájen (1357)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1310 → 1347 → 1357 → 1378.", "Karel IV. byl korunován roku 1347."],
    explanation: "Karel IV. byl nejdůslednějším stavitelem v českých dějinách. Za pouhých deset let (1347–1357) získal korunu českou i císařskou, otevřel první středoevropskou univerzitu a zahájil Karlův most.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Přemyslovců (1306)",
      "Jan Lucemburský – kralem",
      "Karel IV. – Karlova univerzita (1348)",
      "Karlův most zahájen (1357)",
    ],
    hints: ["Zánik Přemyslovců (1306) byl nejdříve, Karlův most (1357) nejpozději.", "Karlova univerzita byla roku 1348."],
    explanation: "Jan Lucemburský nastoupil po Přemyslovcích a zajistil dynastickou kontinuitu sňatkem. Karel IV. pak naplno využil tuto pozici a z Prahy udělal velkoměsto s univerzitou a kamenným mostem.",
  },
  {
    question: "Seřaď lucemburské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Karel IV. narozen (1316)",
      "Jan Lucemburský padl u Kresčaku (1346)",
      "Karel IV. – Karlova univerzita (1348)",
      "Zlatá bula (1356)",
    ],
    hints: ["1316 → Kresčak 1346 → 1348 → 1356.", "Karel IV. se narodil roku 1316."],
    explanation: "Bitva u Kresčaku (1346), kde padl Jan Lucemburský, byla paradoxně impulsem pro Karlův vzestup. Karel IV. nastoupil na trůn druhý den po bitvě a zahájil tak nejslavnější éru v českých dějinách.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Karel IV. – narozen (1316)",
      "Karel IV. korunován řím. císařem (1355)",
      "Karel IV. – Zlatá bula (1356)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["1316 → 1355 → 1356 → 1378.", "Karel IV. se narodil roku 1316."],
    explanation: "Zlatá bula sicilská z roku 1356 byla ústavou středověké Evropy — upravila, kdo smí volit císaře a jakými pravidly. Karel IV. ji vydal rok po svém korunování v Římě, aby upevnil svou moc.",
  },
  {
    question: "Seřaď lucemburské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Jan Lucemburský – první Lucemburk v Čechách",
      "Karel IV. – korunován česky král (1347)",
      "Karel IV. – Karlova univerzita a Nové Město (1348)",
      "Karel IV. zemřel (1378)",
    ],
    hints: ["Jan Lucemburský byl nejdříve, Karel IV. zemřel roku 1378.", "Karel IV. byl korunován roku 1347."],
    explanation: "Rok 1348 byl pro Prahu nejproduktivnějším rokem: Karlova univerzita, Nové Město pražské — vše zahájeno v jednom roce. Karel IV. stavěl jako nikdo před ním a Praha nesla stopy jeho génia po staletí.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(VSECHNY_TASKY).slice(0, 35);
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
      hint: "Karel IV. = Otec vlasti. 1348: Karlova univerzita + Nové Město pražské. 1357: Karlův most. 1356: Zlatá bula.",
      steps: [
        "Karel IV. 1316–1378 = Otec vlasti",
        "1347 = král český, 1355 = císař Říše",
        "Díla: univerzita (1348), Nové Město (1348), Karlův most (1357), Karlštejn",
        "Otec = Jan Lucemburský (padl u Kresčaku 1346)",
      ],
      commonMistake: "Žáci si pletou rok 1348 (univerzita) s rokem 1357 (Karlův most) — pamatuj: 1348 = univerzita.",
      example: "Karel IV.: Otec vlasti, česky krále 1347, císař 1355, Karlova univ. 1348, Karlův most 1357.",
    },
  },
];
