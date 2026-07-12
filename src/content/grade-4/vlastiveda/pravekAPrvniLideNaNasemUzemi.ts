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
//   L1 = rozpoznání: 3 položky, řazení epoch podle materiálu (kámen→bronz→železo)
//   L2 = aplikace:   4 položky, způsob obživy + Keltové (lovci→zemědělci→bronz→železo)
//   L3 = transfer:   5 položek, řazení NÁRODŮ, které nejdou podle materiálu
//                    (neandrtálci→kromaňonci, Keltové→Germáni→Slované, přechod př.n.l./n.l.)
// `items` jsou vždy ve SPRÁVNÉM chronologickém pořadí (validátor je porovnává;
// UI je při zobrazení zamíchá).
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Seřaď doby pravěku od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Doba kamenná", "Doba bronzová", "Doba železná"],
    hints: ["Řaď podle materiálu nástrojů — nejtěžší kov lidé zvládli až naposledy.", "Kámen lidé používali odjakživa, kovy se museli naučit vyrábět."],
    explanation: "Doby pravěku se jmenují podle materiálu, z nějž lidé vyráběli nástroje: nejdřív kámen, pak bronz (měkčí kov) a nakonec železo (nejtvrdší, nejtěžší na výrobu).",
  },
  {
    question: "Seřaď doby kamenné a dobu bronzovou od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Starší doba kamenná (paleolit)", "Mladší doba kamenná (neolit)", "Doba bronzová"],
    hints: ["Slovo „starší“ a „mladší“ v názvu napovídá pořadí.", "Kamenné doby jsou obě starší než doba, kdy lidé objevili kovy."],
    explanation: "Starší doba kamenná (paleolit) je nejstarší, po ní přišla mladší doba kamenná (neolit) a teprve pak doba bronzová, kdy lidé začali tavit kovy.",
  },
  {
    question: "Seřaď nástroje podle materiálu od nejstarších po nejnovější.",
    correctAnswer: "order",
    items: ["Kamenné nástroje", "Bronzové nástroje", "Železné nástroje"],
    hints: ["Který materiál lidé našli hotový v přírodě a který museli vyrobit?", "Bronz je měkčí než železo — a snazší na výrobu."],
    explanation: "Kámen lidé opracovávali jako první. Bronz (slitina mědi a cínu) byl první kov, který uměli vyrobit. Železo je nejtvrdší a jeho zpracování je nejnáročnější — přišlo naposledy.",
  },
  {
    question: "Seřaď epochy od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Mladší doba kamenná (neolit)", "Doba bronzová", "Doba železná"],
    hints: ["Doba kamenná je vždy starší než doby kovů.", "Bronz lidé objevili dřív než železo."],
    explanation: "Neolit (mladší doba kamenná) je nejstarší z těchto tří. Po něm přišla doba bronzová a nakonec doba železná — každý nový materiál byl tvrdší.",
  },
  {
    question: "Seřaď podle způsobu výroby nástrojů od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Lovci a sběrači – kamenné nástroje", "Doba bronzová – nástroje z bronzu", "Keltové – nástroje ze železa"],
    hints: ["Řaď podle materiálu: kámen → kov měkčí → kov tvrdší.", "Keltové ovládli železo — nejtvrdší materiál."],
    explanation: "Lovci a sběrači používali kámen (nejstarší). Doba bronzová přinesla první kov. Keltové zvládli výrobu ze železa — nejtvrdšího materiálu, který přišel naposledy.",
  },
  {
    question: "Seřaď epochy pravěku od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Doba kamenná", "Únětická kultura (doba bronzová)", "Keltové (doba železná)"],
    hints: ["Únětická kultura patří do doby bronzové — mezi kámen a železo.", "Keltové jsou z doby železné, tedy nejmladší."],
    explanation: "Doba kamenná je nejstarší. Únětická kultura (pojmenovaná po obci Únětice u Prahy) patří do doby bronzové. Keltové ovládali železo — přišli naposledy.",
  },
  {
    question: "Seřaď doby pravěku od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Paleolit", "Doba bronzová", "Doba železná"],
    hints: ["Paleolit je starší doba kamenná — začátek pravěku.", "Železo přišlo po bronzu."],
    explanation: "Paleolit (starší doba kamenná) je nejstarší část pravěku. Doba bronzová přinesla první kovy. Doba železná přišla naposledy — železo je nejtvrdší.",
  },
  {
    question: "Seřaď od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Věstonická venuše (doba kamenná)", "Doba bronzová", "Doba železná"],
    hints: ["Věstonická venuše je 29 000 let stará — patří do doby kamenné.", "Kamenná doba je vždy před dobami kovů."],
    explanation: "Věstonická venuše (29 000 let, Dolní Věstonice) pochází z doby kamenné — je tedy nejstarší. Po ní následovala doba bronzová a nakonec doba železná.",
  },
  {
    question: "Seřaď epochy od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Doba kamenná", "Doba bronzová", "Keltové v Čechách (Bohemia)"],
    hints: ["Keltové jsou z doby železné — nejmladší z těchto tří.", "Kámen a bronz přišly před železem."],
    explanation: "Doba kamenná je nejstarší, po ní doba bronzová. Keltové ovládali Čechy v době železné a pojmenovali zemi Bohemia — přišli naposledy.",
  },
  {
    question: "Seřaď od nejstarší doby po nejnovější.",
    correctAnswer: "order",
    items: ["Neolit", "Únětická kultura (bronz)", "Keltové (železo)"],
    hints: ["Neolit je mladší doba kamenná — starší než doby kovů.", "Bronz je starší než železo."],
    explanation: "Neolit (mladší doba kamenná) je nejstarší z těchto tří. Únětická kultura patří do doby bronzové. Keltové ovládali železo — přišli naposledy.",
  },
  {
    question: "Seřaď podle stáří od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Kámen (nástroje)", "Bronz (nástroje)", "Železo (nástroje)"],
    hints: ["Který materiál lidé používali jako úplně první?", "Bronz je měkčí a snazší na výrobu než železo."],
    explanation: "Kámen byl prvním materiálem na nástroje. Bronz (měď + cín) byl první vyráběný kov. Železo je nejtvrdší a přišlo naposledy — podle těchto materiálů se doby pravěku pojmenovaly.",
  },
  {
    question: "Seřaď doby pravěku od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Starší doba kamenná", "Doba bronzová", "Doba železná"],
    hints: ["„Starší“ doba kamenná je začátek pravěku.", "Řaď dál podle tvrdosti kovu: bronz, pak železo."],
    explanation: "Starší doba kamenná (paleolit) je nejstarší. Po době kamenné přišla doba bronzová a nakonec doba železná — každý materiál byl tvrdší než ten předchozí.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď epochy podle způsobu života od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lovci a sběrači",
      "Neolit – zemědělci",
      "Doba bronzová – bronzové nástroje",
      "Doba železná – Keltové v Čechách",
    ],
    hints: ["Přemýšlej, jak se změnila obživa — nejdřív lov, pak zemědělství.", "Jako první přišel paleolit — lidé lovili a sbírali."],
    explanation: "Lidé nejdřív lovili a sbírali (paleolit). V neolitu nastala zemědělská revoluce — začali pěstovat obilí. Pak přišly kovy: nejdřív bronz, a v době železné ovládli Čechy Keltové.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lidé loví zvěř a sbírají plody",
      "Neolit – lidé pěstují obilí a chovají zvířata",
      "Doba bronzová – slitina mědi a cínu",
      "Keltové (Boiové) v Čechách – Bohemia",
    ],
    hints: ["Nejdřív se lidé živili lovem, teprve pak zemědělstvím.", "Keltové přišli až v době železné — jako poslední z těchto čtyř."],
    explanation: "Nejprve lidé žili jako lovci (paleolit). Pak nastala zemědělská revoluce — neolit. Teprve po zvládnutí zemědělství začali tavit kovy: bronz (měď+cín), a Keltové přinesli železo a jméno Bohemia.",
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Věstonická venuše – starší doba kamenná (29 000 let)",
      "Mladší doba kamenná – zemědělství a keramika",
      "Doba bronzová – únětická kultura",
      "Doba železná – Keltové, oppida",
    ],
    hints: ["Věstonická venuše je stará 29 000 let — to je začátek pravěku.", "Zemědělství přišlo až po dlouhé době lovu."],
    explanation: "Věstonická venuše (29 000 let) pochází z paleolitu. Mladší doba kamenná přinesla zemědělství a keramiku. Únětická kultura patří do doby bronzové. Keltská oppida (opevněná města) jsou z doby železné.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lidé žijí v jeskyních, loví",
      "Neolit – lidé stavějí vesnice a pěstují obilí",
      "Doba bronzová – kovové nástroje z bronzu",
      "Keltové – doba železná, oppida",
    ],
    hints: ["Přemýšlej, kde lidé bydleli: nejdřív jeskyně, pak vesnice.", "Keltská oppida jsou opevněná města — až úplně nakonec."],
    explanation: "Bydlení ukazuje pokrok: paleolit = jeskyně a tábořiště, neolit = stálé vesnice díky zemědělství, doba bronzová = složitější společnost s kovy, Keltové stavěli oppida — první města na našem území.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Věstonická venuše – paleolitické umění (29 000 let)",
      "Neolit – zemědělství a keramika",
      "Únětická kultura – doba bronzová",
      "Keltové (Boiové) – Bohemia",
    ],
    hints: ["Věstonická venuše je stará 29 000 let — jedno z nejstarších uměleckých děl světa.", "Zemědělská revoluce přišla až po tisících letech lovu."],
    explanation: "Věstonická venuše (29 000 let) je dokladem paleolitického umění. Zemědělská revoluce v neolitu změnila vše. Únětická kultura (bronz) je typická pro naše území. Keltové (Boiové) pojmenovali zemi Bohemia.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – lovci a sběrači",
      "Mladší doba kamenná – zemědělci",
      "Doba bronzová – bronzové meče a nástroje",
      "Keltové – oppida, obchod",
    ],
    hints: ["Lovci a sběrači přišli před zemědělci — to je základní přechod.", "Keltská oppida byla centra obchodu — vznikla nakonec."],
    explanation: "Lovci a sběrači (paleolit) žili nomádsky. Zemědělci (neolit) se usadili. Doba bronzová přinesla kovové zbraně i nástroje. Keltové vybudovali oppida — centra řemesel a obchodu, první skutečná města.",
  },
  {
    question: "Seřaď pravěké mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – lidé loví mamuty",
      "Mladší doba kamenná – zemědělská revoluce",
      "Doba bronzová – bronz = měď + cín",
      "Doba železná – Keltové, Bohemia",
    ],
    hints: ["Mamuti žili v době ledové — to je paleolit, nejstarší část pravěku.", "Bronz vzniká smícháním mědi a cínu — velká technická novinka."],
    explanation: "Lov mamutů patří do paleolitu (doby ledové). Zemědělská revoluce v neolitu umožnila vznik osad. Bronz = slitina mědi a cínu. Keltové ovládli výrobu ze železa a pojmenovali zemi Bohemia.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – nejstarší doba kamenná",
      "Neolit – zemědělci a pastevci",
      "Doba bronzová – únětická kultura",
      "Keltové – oppida, obchod, Bohemia",
    ],
    hints: ["Paleolit je vždy nejstarší — trval statisíce let.", "Únětická kultura je typicky česká bronzová kultura."],
    explanation: "Paleolit trval statisíce let a byl nejdelší epochou. Neolit přinesl zemědělství. Únětická kultura (bronz) je pojmenována po obci Únětice u Prahy. Keltové stavěli oppida a pojmenovali zemi Bohemia.",
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Paleolit – Věstonická venuše (29 000 let)",
      "Neolit – keramika a zemědělství",
      "Doba bronzová – únětická kultura",
      "Keltové – doba železná, oppida",
    ],
    hints: ["Věstonická venuše je 29 000 let stará — paleolit, absolutní začátek.", "Keramika a zemědělství patří do neolitu."],
    explanation: "Věstonická venuše (29 000 let) dokazuje paleolitické umění. Neolit přinesl keramiku a zemědělství. Únětická kultura patří do doby bronzové. Keltové v době železné stavěli oppida — opevněná obchodní centra.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Lovci a sběrači (paleolit)",
      "Zemědělci a pastevci (neolit)",
      "Doba bronzová – únětická kultura",
      "Keltové v Čechách (doba železná)",
    ],
    hints: ["Způsob obživy ukazuje pořadí: lov → zemědělství.", "Keltové ovládli železo — přišli až po bronzu."],
    explanation: "Lov a sběr (paleolit) byl prvním způsobem obživy. Zemědělství (neolit) umožnilo usazení. Únětická kultura patří do doby bronzové. Keltové přišli v době železné a pojmenovali zemi Bohemia.",
  },
  {
    question: "Seřaď pravěké epochy chronologicky.",
    correctAnswer: "order",
    items: [
      "Paleolit – lovci a sběrači (kamenné nástroje)",
      "Neolit – zemědělci (keramika, obilí)",
      "Doba bronzová (bronz = měď + cín)",
      "Keltové v Čechách (5.–1. stol. př. n. l.)",
    ],
    hints: ["Kamenné nástroje jsou ze starší doby kamenné — paleolit.", "Bronz = měď + cín — lidé se to museli naučit vyrábět."],
    explanation: "Kamenné nástroje (paleolit) byly první technologií. Keramika a obilí (neolit) umožnily trvalé usazení. Bronz vzniká smícháním mědi a cínu. Keltové ovládli Čechy od 5. do 1. st. př. n. l. a zpracovávali železo i sklo.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Starší doba kamenná – Věstonická venuše",
      "Mladší doba kamenná – první vesnice a zemědělství",
      "Únětická kultura – doba bronzová",
      "Keltové – oppida, obchod, Bohemia",
    ],
    hints: ["Věstonická venuše je z paleolitu — 29 000 let stará.", "Únětická kultura je česká bronzová kultura — po neolitu."],
    explanation: "Věstonická venuše (paleolit) je jedním z nejstarších uměleckých děl světa. První vesnice a zemědělství (neolit) změnily život. Únětická kultura (bronz) je pojmenována po obci Únětice u Prahy. Keltové stavěli oppida — předchůdce měst.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď obyvatele a epochy našeho území od nejstarších po nejnovější.",
    correctAnswer: "order",
    items: [
      "Neandrtálci (paleolit)",
      "Kromaňonci – Věstonická venuše",
      "Neolit – zemědělci",
      "Keltové (Boiové) – Bohemia",
      "Slované (6. stol. n. l.)",
    ],
    hints: ["Pozor: podle materiálu to nepoznáš — musíš znát, kdo přišel po Keltech.", "Slované přišli až v našem letopočtu (6. stol. n. l.) — jako úplně poslední."],
    explanation: "Neandrtálci žili v paleolitu jako první, po nich moderní lidé kromaňonci (autoři Věstonické venuše). Zemědělci přišli v neolitu. Keltové (Boiové) dali zemi jméno Bohemia. Slované dorazili nejpozději — v 6. století n. l. — a jsou předky dnešních Čechů.",
  },
  {
    question: "Seřaď národy a epochy od nejstarších po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lovci a sběrači",
      "Neolit – zemědělci",
      "Doba bronzová – únětická kultura",
      "Keltové (Boiové) v Čechách",
      "Germáni (Markomané) vytlačují Kelty",
    ],
    hints: ["Poslední dvě položky nejdou podle materiálu — kdo koho vytlačil?", "Germáni přišli po Keltech a vytlačili je z Čech."],
    explanation: "Lovci (paleolit), zemědělci (neolit) a únětická kultura (bronz) tvoří pravěký základ. Keltové ovládli Čechy v době železné. Germáni (Markomané) je odtud vytlačili kolem přelomu letopočtu — proto jsou úplně poslední.",
  },
  {
    question: "Seřaď obyvatele Čech od nejstarších po nejnovější.",
    correctAnswer: "order",
    items: [
      "Neandrtálec (jeskyně Šipka u Štramberku)",
      "Kromaňonci – Věstonická venuše",
      "Neolit – první zemědělci",
      "Keltové – Bohemia",
      "Germáni – po Keltech",
    ],
    hints: ["Neandrtálci žili dřív než moderní lidé kromaňonci — oba v paleolitu.", "Poslední dvojici (Keltové, Germáni) neurčíš podle materiálu — kdo přišel později?"],
    explanation: "Neandrtálec (nález v jeskyni Šipka u Štramberku) dokládá nejstarší osídlení. Po neandrtálcích přišli kromaňonci (autoři Věstonické venuše). Zemědělci přišli v neolitu. Keltové dali zemi jméno Bohemia. Germáni je nakonec z Čech vytlačili.",
  },
  {
    question: "Seřaď epochy a národy od nejstarších po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lovci",
      "Neolit – zemědělci",
      "Únětická kultura (bronz)",
      "Keltové (železo) – Bohemia",
      "Slované přicházejí do Čech",
    ],
    hints: ["Do doby železné (Keltové) pomáhá materiál, dál už ne.", "Slované přišli v 6. stol. n. l. — dávno po Keltech, jako poslední."],
    explanation: "Lovci (paleolit), zemědělci (neolit) a únětická kultura (bronz) jsou pravěký základ. Keltové ovládli Čechy v době železné a pojmenovali je Bohemia. Slované přišli až v 6. století n. l. a stali se předky Čechů.",
  },
  {
    question: "Seřaď mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Lov mamutů (paleolit, doba ledová)",
      "Neolit – zemědělská revoluce",
      "Doba bronzová",
      "Keltové – Bohemia (5.–1. stol. př. n. l.)",
      "Germáni vytlačují Kelty (kolem 1. stol. př. n. l.)",
    ],
    hints: ["Lov mamutů je z doby ledové — úplný začátek.", "Rozliš Kelty a Germány podle toho, kdo koho vytlačil."],
    explanation: "Lov mamutů (paleolit, doba ledová) je nejstarší. Zemědělská revoluce (neolit) změnila obživu. Doba bronzová přinesla kovy. Keltové ovládali Čechy od 5. do 1. st. př. n. l. Germáni je kolem 1. st. př. n. l. vytlačili.",
  },
  {
    question: "Seřaď obyvatele a epochy od nejstarších po nejnovější.",
    correctAnswer: "order",
    items: [
      "Neandrtálci",
      "Kromaňonci (moderní lidé)",
      "Neolit – zemědělství",
      "Doba bronzová",
      "Keltové – Bohemia",
    ],
    hints: ["Neandrtálci žili v paleolitu dřív než kromaňonci — obojí ale ještě před zemědělstvím.", "Zemědělství přišlo až po době lovu."],
    explanation: "Neandrtálci (archaičtí lidé) žili dřív než kromaňonci (moderní lidé) — oba v paleolitu jako lovci. Neolit přinesl zemědělství, doba bronzová kovy. Keltové (Boiové) uzavírají pravěk a dali zemi jméno Bohemia.",
  },
  {
    question: "Seřaď národy, které žily v Čechách, od nejstarších po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lovci a sběrači",
      "Neolit – zemědělci",
      "Keltové (Boiové)",
      "Germáni (Markomané)",
      "Slované",
    ],
    hints: ["Materiál tě dovede jen ke Keltům — dál musíš znát pořadí národů.", "Kelty vytlačili Germáni; Slované přišli až úplně nakonec (6. stol. n. l.)."],
    explanation: "Lovci (paleolit) a zemědělci (neolit) jsou pravěký základ. Pak přišli Keltové (Boiové) v době železné. Germáni (Markomané) Kelty vytlačili kolem přelomu letopočtu. Slované dorazili nejpozději — v 6. st. n. l. — a jsou předky dnešních Čechů.",
  },
  {
    question: "Seřaď od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Věstonická venuše (paleolit, 29 000 let)",
      "Neolit – zemědělství a keramika",
      "Doba bronzová – únětická kultura",
      "Keltové – Bohemia",
      "Slované (6. stol. n. l.)",
    ],
    hints: ["Věstonická venuše 29 000 let = úplný začátek.", "Slované přišli až v našem letopočtu — jako poslední."],
    explanation: "Věstonická venuše (29 000 let) patří do paleolitu. Neolit přinesl zemědělství a keramiku. Únětická kultura patří do doby bronzové. Keltové dali zemi jméno Bohemia. Slované přišli v 6. st. n. l. — nejpozději.",
  },
  {
    question: "Seřaď obyvatele Čech od nejstarších po nejnovější.",
    correctAnswer: "order",
    items: [
      "Neandrtálci (paleolit)",
      "Kromaňonci – Věstonická venuše",
      "Neolit – zemědělci",
      "Keltové – Bohemia",
      "Germáni vytlačují Kelty",
    ],
    hints: ["Nejdřív neandrtálci, pak moderní lidé kromaňonci — oba v paleolitu.", "Poslední dvojici (Keltové, Germáni) urči podle toho, kdo koho vytlačil."],
    explanation: "Neandrtálci žili v paleolitu jako první. Kromaňonci (moderní lidé) vytvořili Věstonickou venuši. Zemědělci přišli v neolitu. Keltové ovládli Čechy a pojmenovali je Bohemia. Germáni je nakonec vytlačili.",
  },
  {
    question: "Seřaď epochy a národy od nejstarších po nejnovější.",
    correctAnswer: "order",
    items: [
      "Paleolit – lovci mamutů",
      "Neolit – zemědělci",
      "Doba bronzová",
      "Keltové – Bohemia",
      "Slované (6. stol. n. l.)",
    ],
    hints: ["Materiál (kámen → bronz → železo) tě dovede jen ke Keltům.", "Kdo přišel v našem letopočtu, dávno po Keltech?"],
    explanation: "Lovci mamutů (paleolit), zemědělci (neolit) a doba bronzová tvoří pravěký základ. Keltové ovládli Čechy v době železné (Bohemia). Slované přišli v 6. st. n. l. — jsou nejmladší a jsou předky dnešních Čechů.",
  },
  {
    question: "Seřaď od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Neandrtálec (Šipka u Štramberku)",
      "Věstonická venuše (kromaňonci)",
      "Neolit – zemědělství",
      "Keltové (Boiové) – Bohemia",
      "Germáni (Markomané)",
    ],
    hints: ["Neandrtálec je starší nález než Věstonická venuše — obojí paleolit.", "Germáni přišli po Keltech a vytlačili je."],
    explanation: "Neandrtálec (nález v jeskyni Šipka u Štramberku) je nejstarším dokladem osídlení. Věstonická venuše je dílem kromaňonců. Neolit přinesl zemědělství. Keltové (Boiové) dali zemi jméno Bohemia. Germáni je kolem přelomu letopočtu vytlačili.",
  },
  {
    question: "Seřaď národy na našem území od nejstarších po nejnovější.",
    correctAnswer: "order",
    items: [
      "Kromaňonci (paleolit) – Věstonická venuše",
      "Neolit – první zemědělci",
      "Keltové (Boiové)",
      "Germáni (Markomané)",
      "Slované",
    ],
    hints: ["První tři poznáš z pravěku, poslední dvě dvojice ne — kdo koho vystřídal?", "Germáni vytlačili Kelty; Slované přišli až v 6. stol. n. l."],
    explanation: "Kromaňonci (paleolit) vytvořili Věstonickou venuši. V neolitu přišli první zemědělci. Keltové (Boiové) ovládli Čechy v době železné. Germáni (Markomané) je vytlačili kolem přelomu letopočtu. Slované dorazili nejpozději — v 6. st. n. l.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const PRAVEKAPRVNILIDENANASEMUZEMI: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-pravek-a-prvni-lide-na-nasem-uzemi",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-pravek-a-prvni-lide-na-nasem-uzemi",
    title: "Pravěk a první lidé na našem území",
    studentTitle: "Pravěk v Čechách",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš, jak žili první lidé u nás — od lovců po Kelty.",
    keywords: ["pravěk", "paleolit", "neolit", "Keltové", "Slované", "Věstonická venuše", "bronz"],
    goals: [
      "Rozlišit hlavní pravěké epochy (paleolit, neolit, bronz, železo)",
      "Popsat způsob života lovců a zemědělců",
      "Znát Věstonickou venuši a Kelty",
      "Vysvětlit, kdy přišli Slované",
    ],
    boundaries: ["Přesné datování není povinné", "Detailní archeologie není cílem"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Pravěk: paleolit (lovci) → neolit (zemědělci) → bronz (bronz = měď+cín) → železo (Keltové). Věstonická venuše = 29 000 let, Dolní Věstonice.",
      steps: [
        "Vzpomeň si na posloupnost: kámen → bronz → železo",
        "Neolit = zemědělci, neolit přišel po paleolitu",
        "Keltové (Boiové) → Bohemia → Čechy",
        "Slované přišli v 6. stol. n. l.",
      ],
      commonMistake: "Žáci si pletou neolit (zemědělci) s neandrtálci — jsou to odlišné věci.",
      example: "Paleolit: Věstonická venuše 29 000 let. Neolit: zemědělci, keramika. Bronz: únětická kultura. Železo: Keltové.",
    },
  },
];
