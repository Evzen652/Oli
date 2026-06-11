import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    type: "match_pairs",
    question: "Spoj část rostliny s její hlavní funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "kořen", right: "přijímá vodu z půdy" },
      { left: "stonek", right: "vede vodu do listů" },
      { left: "list", right: "vyrábí potravu fotosyntézou" },
      { left: "květ", right: "přitahuje opylovače" },
    ],
    hints: [
      "Kořen je pod zemí — co tam dělá?",
      "List je zelený, protože obsahuje chlorofyl.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj část rostliny s tím, co chrání nebo šíří.",
    correctAnswer: "match",
    pairs: [
      { left: "plod", right: "chrání semena" },
      { left: "semeno", right: "klíčí v novou rostlinu" },
      { left: "květ", right: "vznikají z něj semena po opylení" },
      { left: "kořen", right: "upevňuje rostlinu v půdě" },
    ],
    hints: [
      "Plod je dužnatá část kolem semen — co dělá?",
      "Semeno obsahuje zárodek budoucí rostliny.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj pojem s jeho vysvětlením.",
    correctAnswer: "match",
    pairs: [
      { left: "fotosyntéza", right: "výroba cukru pomocí světla" },
      { left: "chlorofyl", right: "zelené barvivo v listech" },
      { left: "opylení", right: "přenos pylu z květu na květ" },
      { left: "klíčení", right: "probuzení semene k růstu" },
    ],
    hints: [
      "Chlorofyl způsobuje zelenou barvu listů.",
      "Fotosyntéza probíhá v listech za přítomnosti světla.",
    ],
  },
  {
    question: "Jaká je hlavní funkce kořene?",
    correctAnswer: "Přijímat vodu a minerální látky z půdy a upevňovat rostlinu",
    options: [
      "Přijímat vodu a minerální látky z půdy a upevňovat rostlinu",
      "Vyrábět cukr pomocí slunečního světla",
      "Přitahovat hmyz k opylení",
      "Chránit semena před poškozením",
    ],
    hints: [
      "Kořen roste pod zemí — co tam může dělat?",
      "Bez kořene by rostlina spadla a vyschla.",
    ],
    explanation:
      "Kořen plní dvě důležité funkce: upevňuje rostlinu v půdě, aby nespadla, a nasává z půdy vodu spolu s minerálními látkami, které rostlina potřebuje k životu.",
  },
  {
    question: "Co dělá stonek (nebo kmen u stromu)?",
    correctAnswer: "Vede vodu a živiny z kořene do listů a nese listy a květy",
    options: [
      "Vede vodu a živiny z kořene do listů a nese listy a květy",
      "Vyrábí kyslík a vydává ho do vzduchu",
      "Přijímá vodu přímo z deště",
      "Chrání semena uvnitř plodu",
    ],
    hints: [
      "Stonek je jako trubka — co jí protéká?",
      "Bez stonku by se voda z kořene nedostala do listů.",
    ],
    explanation:
      "Stonek (u stromů kmen) slouží jako dopravní cesta. Vede vodu a minerální látky z kořene do listů a zároveň nese listy, květy a plody.",
  },
  {
    question: "Proč jsou listy zelené?",
    correctAnswer: "Protože obsahují chlorofyl — zelené barvivo potřebné k fotosyntéze",
    options: [
      "Protože obsahují chlorofyl — zelené barvivo potřebné k fotosyntéze",
      "Protože přijímají vodu, která je zelená",
      "Protože na nich sedá zelený hmyz",
      "Protože jsou blíž slunci než kořen",
    ],
    hints: [
      "Zelené barvivo v listech má zvláštní název.",
      "Bez tohoto barviva by fotosyntéza nefungovala.",
    ],
    explanation:
      "Listy jsou zelené díky chlorofylu. Tato látka zachycuje sluneční světlo a umožňuje fotosyntézu — výrobu cukru ze světla, vody a oxidu uhličitého.",
  },
  {
    question: "Co je fotosyntéza?",
    correctAnswer: "Výroba cukru v listu ze světla, vody a oxidu uhličitého",
    options: [
      "Výroba cukru v listu ze světla, vody a oxidu uhličitého",
      "Přijímání vody kořenem z půdy",
      "Rozkvétání květu na jaře",
      "Klíčení semene po zasazení do půdy",
    ],
    hints: [
      "Foto = světlo. Co rostlina dělá se světlem?",
      "Výsledkem fotosyntézy je cukr a kyslík.",
    ],
    explanation:
      "Fotosyntéza je proces, při kterém list pomocí chlorofylu přeměňuje sluneční světlo, vodu a oxid uhličitý na cukr jako potravu. Jako vedlejší produkt vzniká kyslík, který vydychujeme.",
  },
  {
    question: "Co vzniká při fotosyntéze jako vedlejší produkt?",
    correctAnswer: "Kyslík",
    options: ["Kyslík", "Oxid uhličitý", "Voda", "Cukr"],
    hints: [
      "Rostliny nám dávají vzduch, který dýcháme.",
      "Bez rostlin bychom neměli čím dýchat.",
    ],
    explanation:
      "Při fotosyntéze rostlina vyrábí cukr (potravu) a jako vedlejší produkt uvolňuje kyslík do vzduchu. Díky tomu máme vzduch, který potřebujeme k dýchání.",
  },
  {
    question: "K čemu slouží květ rostliny?",
    correctAnswer: "Přitahuje opylovače (hmyz) a po opylení vznikají semena",
    options: [
      "Přitahuje opylovače (hmyz) a po opylení vznikají semena",
      "Přijímá vodu z deště",
      "Vyrábí kyslík místo listu",
      "Upevňuje rostlinu v půdě",
    ],
    hints: [
      "Proč jsou květy barevné a voní?",
      "Včely létají od květu ke květu — co tam hledají?",
    ],
    explanation:
      "Květ láká opylovače — včely, motýly a další hmyz — svou barvou a vůní. Hmyz přenese pyl z jednoho květu na druhý (opylení) a pak může vzniknout semeno.",
  },
  {
    question: "Co je opylení?",
    correctAnswer: "Přenos pylu z jednoho květu na druhý, po němž vznikají semena",
    options: [
      "Přenos pylu z jednoho květu na druhý, po němž vznikají semena",
      "Kvetení rostliny na jaře",
      "Klíčení semene v půdě",
      "Odkvétání a opadávání lístků",
    ],
    hints: [
      "Pyl je žlutý prášek na tyčinkách v květu.",
      "Bez opylení by nevznikla žádná semena ani plody.",
    ],
    explanation:
      "Opylení nastane, když hmyz nebo vítr přenese pyl z tyčinek jednoho květu na pestík druhého. Po opylení může květ vytvořit semeno a kolem semene se vytvoří plod.",
  },
  {
    question: "Jaká je funkce plodu?",
    correctAnswer: "Chrání semena a pomáhá jejich šíření (ptáky, zvířaty, větrem)",
    options: [
      "Chrání semena a pomáhá jejich šíření (ptáky, zvířaty, větrem)",
      "Přijímá vodu z půdy pro celou rostlinu",
      "Vyrábí potravu pro kořen",
      "Přitahuje hmyz k opylení",
    ],
    hints: [
      "Jablko, třešeň, šípek — to jsou plody. Co je uvnitř?",
      "Proč zvířata jedí plody a pak odcházejí jinam?",
    ],
    explanation:
      "Plod chrání semena a pomáhá jejich šíření. Zvířata sní dužnatý plod a semena vyloučí jinde. Jiné plody se šíří větrem (javor) nebo se chytají na srst zvířat.",
  },
  {
    question: "Co se stane se semenem, když dostane vodu a teplo?",
    correctAnswer: "Semeno vyklíčí — zárodek se probudí a začne růst",
    options: [
      "Semeno vyklíčí — zárodek se probudí a začne růst",
      "Semeno se promění v květ",
      "Semeno okamžitě vytvoří plod",
      "Semeno se rozpustí ve vodě",
    ],
    hints: [
      "Semeno vypadá jako neživé, ale uvnitř je zárodek.",
      "Co potřebuje zárodek, aby se probudil?",
    ],
    explanation:
      "Semeno obsahuje zárodek nové rostliny. Když dostane dost vody a tepla, zárodek se probudí a začne klíčit — vyrůstá z něj kořínek a první lístky.",
  },
  {
    question: "Která část rostliny vyrábí potravu (cukr)?",
    correctAnswer: "List",
    options: ["List", "Kořen", "Stonek", "Plod"],
    hints: [
      "Potrava se vyrábí fotosyntézou — kde to probíhá?",
      "Zelená barva prozrazuje, kde je chlorofyl.",
    ],
    explanation:
      "Potravu (cukr) vyrábí list pomocí fotosyntézy. Chlorofyl v listu zachycuje světlo a přeměňuje vodu a oxid uhličitý na cukr, který rostlina využívá jako energii.",
  },
  {
    question: "Kde rostlina přijímá minerální látky?",
    correctAnswer: "Z půdy pomocí kořene",
    options: [
      "Z půdy pomocí kořene",
      "Ze vzduchu pomocí listů",
      "Ze světla pomocí chlorofylu",
      "Z plodů jiných rostlin",
    ],
    hints: [
      "Minerální látky jsou rozpuštěné v půdní vodě.",
      "Která část rostliny je v půdě?",
    ],
    explanation:
      "Minerální látky (živiny) jsou rozpuštěné v půdní vodě. Kořen je nasává spolu s vodou a stonek je dopravuje do listů, kde se využívají při fotosyntéze a růstu.",
  },
  {
    question: "Jak se jmenuje zelené barvivo v listech?",
    correctAnswer: "Chlorofyl",
    options: ["Chlorofyl", "Fotosyntéza", "Kyslík", "Pylník"],
    hints: [
      "Toto barvivo způsobuje zelenou barvu listu.",
      "Bez tohoto barviva by list neuměl vyrábět cukr ze světla.",
    ],
    explanation:
      "Zelené barvivo v listech se jmenuje chlorofyl. Zachycuje sluneční světlo a umožňuje fotosyntézu — výrobu cukru pro rostlinu.",
  },
  {
    question: "Která část rostliny upevňuje rostlinu v půdě?",
    correctAnswer: "Kořen",
    options: ["Kořen", "Stonek", "List", "Květ"],
    hints: [
      "Tato část je skrytá pod zemí.",
      "Bez ní by rostlina vítr snadno vyvrátil.",
    ],
    explanation:
      "Kořen zarůstá hluboko do půdy a upevňuje rostlinu, aby ji vítr ani déšť nevyvrátily. Zároveň nasává vodu a minerální látky.",
  },
  {
    question: "Co se stane s rostlinou, pokud nemá dost světla?",
    correctAnswer: "Nemůže dělat fotosyntézu, žloutne a chřadne",
    options: [
      "Nemůže dělat fotosyntézu, žloutne a chřadne",
      "Roste rychleji, protože šetří energii",
      "Přestane přijímat vodu kořenem",
      "Přestane kvést, ale jinak je v pořádku",
    ],
    hints: [
      "Světlo je jeden ze tří vstupů fotosyntézy.",
      "Co se stane, když rostlině schybí jedna z věcí, které potřebuje?",
    ],
    explanation:
      "Bez dostatku světla nemůže list dělat fotosyntézu a rostlina nemá potravu. Chlorofyl se rozkládá, list žloutne, rostlina slábne a nakonec uhyne.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const STAVBAROSTLIN: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-rostliny-a-zivocichove-stavba-rostlin-koren-stonek-list-kvet-plod",
    title: "Stavba rostlin",
    studentTitle: "Části rostliny",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Rostliny a živočichové",
    briefDescription: "Znáš části rostliny a jejich funkce.",
    illustrationDesc:
      "velká kvetoucí rostlina s kořenem, stonkem, listy, květem a plodem — každá část je vidět, vedle stojí dítě s prstem namířeným na květ",
    keywords: [
      "kořen",
      "stonek",
      "kmen",
      "list",
      "květ",
      "plod",
      "semeno",
      "chlorofyl",
      "fotosyntéza",
      "opylení",
      "klíčení",
      "části rostliny",
      "stavba rostliny",
      "kyslík",
      "minerální látky",
    ],
    goals: [
      "Pojmenovat základní části rostliny: kořen, stonek, list, květ, plod, semeno.",
      "Vysvětlit funkci každé části rostliny.",
      "Popsat fotosyntézu jako výrobu cukru ze světla, vody a CO₂.",
      "Vysvětlit, co je opylení a proč je důležité.",
      "Popsat klíčení semene.",
    ],
    boundaries: [
      "Základní pojmy pro 3. třídu — bez buněčné biologie ani chemických rovnic.",
      "Fotosyntéza jen jako jednoduchá představa (světlo + voda + CO₂ → cukr + kyslík), bez stechiometrie.",
      "Opylení jen základně — bez podrobné botanické anatomie.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Rostlina má 6 hlavních částí: kořen (přijímá vodu z půdy), stonek (vede vodu nahoru), list (vyrábí potravu fotosyntézou), květ (opylení → semena), plod (chrání semena), semeno (klíčení).",
      steps: [
        "Kořen — pod zemí, nasává vodu a minerální látky, upevňuje rostlinu.",
        "Stonek — vede vodu a živiny z kořene do listů.",
        "List — zelený díky chlorofylu, dělá fotosyntézu (světlo + voda + CO₂ → cukr + kyslík).",
        "Květ — přitahuje hmyz, po opylení vznikají semena.",
        "Plod — chrání semena a pomáhá jejich šíření.",
        "Semeno — zárodek nové rostliny, klíčí, když dostane vodu a teplo.",
      ],
      commonMistake:
        "Záměna: fotosyntéza probíhá v LISTECH (ne v kořeni). Kořen přijímá vodu, ale nevyrábí cukr. Chlorofyl je v listech, ne v plodech.",
      example:
        "Jabloň: kořen nasaje vodu → stonek ji dovede do listů → listy fotosyntézou vyrobí cukr → květ přitáhne včelu → opylení → vznikne jablko (plod) se semeny uvnitř.",
    },
  },
];
