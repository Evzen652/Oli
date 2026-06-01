import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Jaký je 2. pád od zájmena 'já'?",
    correctAnswer: "mě / mne",
    options: ["mi", "mě / mne", "mnou", "mé"],
    hints: ["Koho/čeho? od já = mě nebo mne."],
  },
  {
    question: "Jaký je 3. pád od zájmena 'já'?",
    correctAnswer: "mi / mně",
    options: ["mě", "mi / mně", "mnou", "mé"],
    hints: ["Komu/čemu? od já = mi nebo mně."],
  },
  {
    question: "Jaký je 7. pád od zájmena 'já'?",
    correctAnswer: "mnou",
    options: ["mi", "mě", "mnou", "mne"],
    hints: ["S kým/čím? od já = mnou."],
  },
  {
    question: "Jaký je 2. pád od zájmena 'ty'?",
    correctAnswer: "tebe / tě",
    options: ["tobě / ti", "tebe / tě", "tebou", "tví"],
    hints: ["Koho/čeho? od ty = tebe nebo tě."],
  },
  {
    question: "Jaký je 3. pád od zájmena 'ty'?",
    correctAnswer: "tobě / ti",
    options: ["tebe / tě", "tobě / ti", "tebou", "tvé"],
    hints: ["Komu/čemu? od ty = tobě nebo ti."],
  },
  {
    question: "Jaký je 7. pád od zájmena 'ty'?",
    correctAnswer: "tebou",
    options: ["tobě", "tě", "tebou", "ti"],
    hints: ["S kým/čím? od ty = tebou."],
  },
  {
    question: "Která forma je správná: 'Řekl to ___ (já).' v 3. pádu?",
    correctAnswer: "mi (krátký tvar) nebo mně (dlouhý tvar)",
    options: [
      "mě (2. pád)",
      "mi (krátký tvar) nebo mně (dlouhý tvar)",
      "mnou (7. pád)",
      "mé",
    ],
    hints: ["Řekl komu? → 3. pád = mi nebo mně."],
  },
  {
    question: "Která forma je správná ve větě 'Sedí vedle ___ (já).'?",
    correctAnswer: "mě / mne",
    options: ["mi", "mě / mne", "mnou", "mné"],
    hints: ["Vedle koho? → 2. pád = mě nebo mne."],
  },
  {
    question: "Která forma je správná: 'Jde ___ (ty).' → šla s tebou?",
    correctAnswer: "tebou",
    options: ["tobě", "tě", "ti", "tebou"],
    hints: ["S kým? → 7. pád = tebou."],
  },
  {
    question: "Jaký je 1. pád množného čísla od zájmena 'on'?",
    correctAnswer: "oni (mužský životný) / ony (ostatní) / ona (střední)",
    options: [
      "ony vždy",
      "oni (mužský životný) / ony (ostatní) / ona (střední)",
      "jen oni",
      "one",
    ],
    hints: ["Množné číslo od on závisí na rodu."],
  },
  {
    question: "Jaký je 2. pád od zájmena 'on' (mužský rod)?",
    correctAnswer: "ho / jej / jeho",
    options: ["mu / jemu", "ho / jej / jeho", "jím", "nim"],
    hints: ["Koho/čeho? od on = ho, jej nebo jeho."],
  },
  {
    question: "Ve větě 'Dám to ___ (on).' v 3. pádu:",
    correctAnswer: "mu nebo jemu",
    options: ["ho", "mu nebo jemu", "jím", "nim"],
    hints: ["Dám komu? → 3. pád = mu nebo jemu."],
  },
  {
    question: "Ve větě 'Jdu s ___ (on).' v 7. pádu:",
    correctAnswer: "ním (po předložce: s ním)",
    options: ["mu", "ho", "ním (po předložce: s ním)", "jemu"],
    hints: ["Po předložce se používá tvar 'ním' (s ním, o něm)."],
  },
  {
    question: "Ve větě 'Myslím na ___ (ona).' v 4. pádu:",
    correctAnswer: "ni (po předložce: na ni) nebo ji",
    options: ["jí", "ni (po předložce: na ni) nebo ji", "ní", "ona"],
    hints: ["Na koho? → 4. pád, po předložce = ni nebo ji."],
  },
  {
    question: "Jaký je 3. pád od zájmena 'my'?",
    correctAnswer: "nám",
    options: ["nás", "nám", "námi", "naše"],
    hints: ["Komu/čemu? od my = nám."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ve větě 'Viděl ___ (já) v parku.' v 4. pádu:",
    correctAnswer: "mě (krátký tvar) nebo mne",
    options: ["mi", "mě (krátký tvar) nebo mne", "mnou", "mé"],
    hints: ["Viděl koho? → 4. pád = mě nebo mne."],
  },
  {
    question: "Ve větě 'Mluvil o ___ (ty).' v 6. pádu:",
    correctAnswer: "tobě",
    options: ["tě", "ti", "tobě", "tebou"],
    hints: ["O kom/čem? → 6. pád = tobě (nebo 'o tobě')."],
  },
  {
    question: "Krátký tvar 'mi' se používá:",
    correctAnswer: "v nepřízvučné pozici (ne po předložkách)",
    options: [
      "vždy",
      "v nepřízvučné pozici (ne po předložkách)",
      "jen na začátku věty",
      "jen v otázkách",
    ],
    hints: ["'Řekni mi.' – mi je krátký bezpřízvučný tvar. 'Ke mně přijď.' – po předložce dlouhý."],
  },
  {
    question: "Proč se říká 'pro mě' a ne 'pro mi'?",
    correctAnswer: "po předložkách se používá delší tvar (mě/mne, ne mi)",
    options: [
      "mi je zkrácenina",
      "po předložkách se používá delší tvar (mě/mne, ne mi)",
      "záleží na dialektu",
      "oboje je správně",
    ],
    hints: ["Po předložkách = dlouhý tvar: pro mě, ke mně, o mně."],
  },
  {
    question: "Jaký je 4. pád od zájmena 'oni'?",
    correctAnswer: "je (krátký) nebo je (po předložce: ně)",
    options: ["jim", "je (krátký) nebo je (po předložce: ně)", "jimi", "nim"],
    hints: ["Viděl jsem je (koho?) = 4. pád."],
  },
  {
    question: "Ve větě 'Jde to bez ___ (vy).' v 2. pádu:",
    correctAnswer: "vás",
    options: ["vám", "vás", "vámi", "vy"],
    hints: ["Bez koho/čeho? → 2. pád = vás."],
  },
  {
    question: "Ve větě 'Přišlo mi to ___ (já) v 6. pádu – o mně nebo o mi?'",
    correctAnswer: "o mně (po předložce vždy dlouhý tvar)",
    options: [
      "o mi",
      "o mně (po předložce vždy dlouhý tvar)",
      "o mě (bez předložky)",
      "záleží na věci",
    ],
    hints: ["Po 'o' = 6. pád = mně. Krátké 'mi' se po předložkách nepoužívá."],
  },
  {
    question: "Jaký je 7. pád od 'my'?",
    correctAnswer: "námi",
    options: ["nás", "nám", "námi", "my"],
    hints: ["S kým? → 7. pád = námi."],
  },
  {
    question: "Ve větě 'Jdu za ___ (ona).' – za ní nebo za ji?",
    correctAnswer: "za ní (po předložce = ní, nikoliv ji)",
    options: [
      "za ji",
      "za ní (po předložce = ní, nikoliv ji)",
      "za jí",
      "za ni",
    ],
    hints: ["Za = předložka → použijeme tvar 'ní' (za ní, s ní)."],
  },
  {
    question: "Zájmeno 'ono' v 2. pádu je:",
    correctAnswer: "ho / jeho / jej",
    options: ["mu", "ho / jeho / jej", "jím", "nim"],
    hints: ["Střední rod se skloňuje stejně jako mužský v některých pádech."],
  },
  {
    question: "Jaký je 4. pád od 'vy'?",
    correctAnswer: "vás",
    options: ["vám", "vás", "vámi", "vy"],
    hints: ["Vidím koho? Vás → 4. pád."],
  },
  {
    question: "Ve větě 'Záleží na ___ (on).' v 6. pádu:",
    correctAnswer: "něm (po předložce: na něm)",
    options: ["mu", "ho", "něm (po předložce: na něm)", "jemu"],
    hints: ["Po předložce 'na' = 6. pád = něm."],
  },
  {
    question: "Ve větě 'Jde tam bez ___ (já).' – bez mě nebo bez mi?",
    correctAnswer: "bez mě (předložka vyžaduje 2. pád = mě/mne)",
    options: [
      "bez mi",
      "bez mě (předložka vyžaduje 2. pád = mě/mne)",
      "bez mnou",
      "bez já",
    ],
    hints: ["'Bez' = předložka + 2. pád. 'Mi' je 3. pád, ne 2. pád."],
  },
  {
    question: "Ve větě 'Volal jsi na ___ (já)?' – na mě nebo na mnou?",
    correctAnswer: "na mě (4. pád po předložce 'na')",
    options: [
      "na mnou (7. pád)",
      "na mě (4. pád po předložce 'na')",
      "na mi",
      "na mne nebo na mě (obě správně)",
    ],
    hints: ["'Na' + 4. pád = na mě nebo na mne."],
  },
  {
    question: "Jak se liší 'jím' a 'jim'?",
    correctAnswer: "jím = 7. pád j. č. (s jím); jim = 3. pád mn. č. (řeknu jim)",
    options: [
      "jsou totéž – jen pravopis",
      "jím = 7. pád j. č. (s jím); jim = 3. pád mn. č. (řeknu jim)",
      "jim je 7. pád, jím je 3. pád",
      "oboje je 4. pád",
    ],
    hints: ["Délka samohlásky rozlišuje pád: jím (7. pád), jim (3. pád)."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Ve větě 'Přijdu k ___ (ty).' v 3. pádu:",
    correctAnswer: "tobě (k tobě)",
    options: ["tě", "ti", "tobě (k tobě)", "tebou"],
    hints: ["Po předložce 'k' = 3. pád. K tobě (ne k ti)."],
  },
  {
    question: "Ve větě 'Myslím jen na ___ (já).' v 4. pádu:",
    correctAnswer: "sebe (zvratné zájmeno) – nebo na mě (osobní)",
    options: [
      "mě",
      "mi",
      "sebe (zvratné zájmeno) – nebo na mě (osobní)",
      "mnou",
    ],
    hints: ["'Na sebe' = reflexivní (mluvčí = podmět). 'Na mě' = osobní."],
  },
  {
    question: "Ve větě 'Je mi dobře.' – je 'mi' správně?",
    correctAnswer: "ano – mi = 3. pád, nepřízvučná pozice, správně",
    options: [
      "ne – správně je 'mně'",
      "ano – mi = 3. pád, nepřízvučná pozice, správně",
      "ne – správně je 'mě'",
      "záleží na nářečí",
    ],
    hints: ["'Je mi dobře' = krátký tvar v nepřízvučné pozici = správně."],
  },
  {
    question: "Ve větě 'Dej to mně, ne jemu.' – proč 'mně' a ne 'mi'?",
    correctAnswer: "mně je zdůrazněný (přízvučný) tvar, vhodný při kontrastu",
    options: [
      "mi je špatně",
      "mně je zdůrazněný (přízvučný) tvar, vhodný při kontrastu",
      "záleží na slovese",
      "mně je 4. pád",
    ],
    hints: ["Zdůraznění: DAJ TO MNĚ (ne jemu) → přízvučný tvar."],
  },
  {
    question: "Jak skloňujeme zájmeno 'ona' v 7. pádu?",
    correctAnswer: "ní (s ní, před ní, za ní)",
    options: ["jí", "ní (s ní, před ní, za ní)", "ji", "ona"],
    hints: ["7. pád ona = ní. 'Jí' je 3. nebo 4. pád."],
  },
  {
    question: "Ve větě 'Psal jsem o ___ (ty).' v 6. pádu:",
    correctAnswer: "tobě",
    options: ["tě", "ti", "tobě", "tebou"],
    hints: ["O kom? = 6. pád. Tobě (po předložce)."],
  },
  {
    question: "Ve větě 'Šli jsme s ___ (oni).' v 7. pádu:",
    correctAnswer: "nimi (po předložce: s nimi)",
    options: ["jim", "ně", "nimi (po předložce: s nimi)", "jimi"],
    hints: ["S kým? → 7. pád. Po předložce = nimi."],
  },
  {
    question: "Jaký tvar má zájmeno 'ony' v 6. pádu po předložce?",
    correctAnswer: "nich (o nich, v nich)",
    options: ["ji", "ní", "nich (o nich, v nich)", "jimi"],
    hints: ["O nich = 6. pád množného čísla."],
  },
  {
    question: "Kdy použijeme 'jejím' a kdy 'jím'?",
    correctAnswer: "jejím = přivlastňovací (jejím přítelem); jím = osobní zájmeno 7. pádu",
    options: [
      "jsou totéž",
      "jejím = přivlastňovací (jejím přítelem); jím = osobní zájmeno 7. pádu",
      "jejím je vždy špatně",
      "jím = přivlastňovací",
    ],
    hints: ["Jejím = její (přivlastňovací). Jím = 7. pád zájmena on/ono."],
  },
  {
    question: "Ve větě 'Promluvil s ___ (já) o problému.' v 7. pádu:",
    correctAnswer: "mnou",
    options: ["mi", "mě", "mnou", "mne"],
    hints: ["S kým? → 7. pád = mnou."],
  },
  {
    question: "Ve větě 'Závisí to na ___ (vy).' v 6. pádu:",
    correctAnswer: "vás",
    options: ["vám", "vámi", "vás", "vy"],
    hints: ["Na kom? → 6. pád = vás."],
  },
  {
    question: "Ve větě 'Viděl jsem ___ (oni, mužský životný) v parku.' v 4. pádu:",
    correctAnswer: "je nebo ně (po předložce)",
    options: [
      "jim",
      "jimi",
      "je nebo ně (po předložce)",
      "nich",
    ],
    hints: ["Viděl jsem koho? Ohne predložky = je. Po předložce = ně (na ně)."],
  },
  {
    question: "Ve větě 'Dám to ___ (ona).' v 3. pádu:",
    correctAnswer: "jí",
    options: ["ji", "jí", "ní", "ona"],
    hints: ["Dám komu? → 3. pád. Ona → jí."],
  },
  {
    question: "Ve větě 'Potřebuju ___ (ty) tady.' v 4. pádu:",
    correctAnswer: "tě (krátký tvar) nebo tebe",
    options: ["tobě", "tě (krátký tvar) nebo tebe", "ti", "tebou"],
    hints: ["Potřebuji koho? → 4. pád = tě nebo tebe."],
  },
  {
    question: "Ve větě 'Záleží mi na ___ (my).' – co je špatně?",
    correctAnswer: "správně by bylo 'na nás' (6. pád mn. č.)",
    options: [
      "nic – věta je správně",
      "správně by bylo 'na nás' (6. pád mn. č.)",
      "správně je 'na nám'",
      "správně je 'na námi'",
    ],
    hints: ["Na kom/čem? = 6. pád. My → nás."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ZAJMENASKLONOVANIOSOBNICHZAJMEN: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-zajmena-sklonovani-osobnich-zajmen",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-zajmena-sklonovani-osobnich-zajmen",
    title: "Zájmena – skloňování osobních zájmen",
    studentTitle: "Skloňování zájmen",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Naučíš se správně skloňovat osobní zájmena.",
    keywords: ["zájmena", "osobní zájmena", "skloňování", "já ty on ona my vy oni", "pády"],
    goals: [
      "Správně skloňovat osobní zájmena v různých pádech",
      "Rozlišit krátké a dlouhé tvary zájmen",
      "Použít správný tvar po předložkách",
    ],
    boundaries: [
      "Neprobíráme všechna zájmena podrobně (jen osobní)",
      "Bez složité syntaktické analýzy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Osobní zájmena: já, ty, on, ona, ono, my, vy, oni. Po předložkách vždy delší tvar (ke mně, pro tebe, o něm). Krátké tvary (mi, mě, ti, ho) jsou v nepřízvučné pozici.",
      steps: [
        "Zjisti pád (otázkou: kdo? koho? komu? koho? o kom? kým?).",
        "Vyber správný tvar pro daný pád.",
        "Po předložkách vždy delší tvar (mě/mne, tobě, jemu, ní...).",
        "Krátký tvar (mi, mě, ti, mu...) v nepřízvučné pozici.",
      ],
      commonMistake: "Žáci zaměňují 'mi' (3. pád) a 'mě' (2. nebo 4. pád). Po předložkách nelze použít 'mi'.",
      example: "Řekl mi. (3. pád, nepřízvučně). Ke mně přišel. (3. pád, po předložce = mně).",
    },
  },
];
