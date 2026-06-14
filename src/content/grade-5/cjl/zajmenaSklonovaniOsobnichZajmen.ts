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
    hints: ["Zeptej se: Koho/čeho? To je 2. pád zájmena 'já'."],
    explanation: "2. pád (koho/čeho?) zájmena 'já' je 'mě' nebo 'mne'.",
  },
  {
    question: "Jaký je 3. pád od zájmena 'já'?",
    correctAnswer: "mi / mně",
    options: ["mě", "mi / mně", "mnou", "mé"],
    hints: ["Zeptej se: Komu/čemu? To je 3. pád zájmena 'já'."],
    explanation: "3. pád (komu/čemu?) zájmena 'já' je 'mi' (krátký tvar) nebo 'mně'.",
  },
  {
    question: "Jaký je 7. pád od zájmena 'já'?",
    correctAnswer: "mnou",
    options: ["mi", "mě", "mnou", "mne"],
    hints: ["Zeptej se: S kým/čím? To je 7. pád zájmena 'já'."],
    explanation: "7. pád (s kým/čím?) zájmena 'já' je 'mnou'.",
  },
  {
    question: "Jaký je 2. pád od zájmena 'ty'?",
    correctAnswer: "tebe / tě",
    options: ["tobě / ti", "tebe / tě", "tebou", "tví"],
    hints: ["Zeptej se: Koho/čeho? To je 2. pád zájmena 'ty'."],
    explanation: "2. pád (koho/čeho?) zájmena 'ty' je 'tebe' nebo 'tě'.",
  },
  {
    question: "Jaký je 3. pád od zájmena 'ty'?",
    correctAnswer: "tobě / ti",
    options: ["tebe / tě", "tobě / ti", "tebou", "tvé"],
    hints: ["Zeptej se: Komu/čemu? To je 3. pád zájmena 'ty'."],
    explanation: "3. pád (komu/čemu?) zájmena 'ty' je 'tobě' nebo 'ti'.",
  },
  {
    question: "Jaký je 7. pád od zájmena 'ty'?",
    correctAnswer: "tebou",
    options: ["tobě", "tě", "tebou", "ti"],
    hints: ["Zeptej se: S kým/čím? To je 7. pád zájmena 'ty'."],
    explanation: "7. pád (s kým/čím?) zájmena 'ty' je 'tebou'.",
  },
  {
    question: "Která forma je správná: 'Řekl to ___ (já).' v 3. pádu?",
    correctAnswer: "mi / mně",
    options: ["mě", "mi / mně", "mnou", "mé"],
    hints: ["Řekl komu? To ukazuje na 3. pád zájmena 'já'."],
    explanation: "Řekl komu? → 3. pád: 'mi' (krátký tvar v běžné větě) nebo 'mně' (při zdůraznění). 'mě' je 2./4. pád, 'mnou' je 7. pád.",
  },
  {
    question: "Která forma je správná: 'Sedí vedle ___ (já).'?",
    correctAnswer: "mě / mne",
    options: ["mi", "mě / mne", "mnou", "mně"],
    hints: ["Vedle koho? Předložka 'vedle' se pojí s 2. pádem."],
    explanation: "Po předložce 'vedle' je 2. pád: 'vedle mě' nebo 'vedle mne'.",
  },
  {
    question: "Která forma je správná: 'Šla s ___ (ty).' v 7. pádu?",
    correctAnswer: "tebou",
    options: ["tobě", "tě", "ti", "tebou"],
    hints: ["S kým? To je 7. pád zájmena 'ty'."],
    explanation: "7. pád (s kým?) zájmena 'ty' je 'tebou': 's tebou'.",
  },
  {
    question: "Jaký je 1. pád množného čísla od zájmena 'on'?",
    correctAnswer: "oni / ony / ona (podle rodu)",
    options: ["ony (vždy)", "oni / ony / ona (podle rodu)", "jen oni", "one"],
    hints: ["Tvar v 1. pádu množného čísla závisí na rodu podstatného jména."],
    explanation: "1. pád mn. č.: 'oni' (rod mužský životný), 'ony' (rod mužský neživotný a ženský), 'ona' (rod střední).",
  },
  {
    question: "Jaký je 2. pád od zájmena 'on' (mužský rod)?",
    correctAnswer: "ho / jej / jeho",
    options: ["mu / jemu", "ho / jej / jeho", "jím", "nim"],
    hints: ["Zeptej se: Koho/čeho? To je 2. pád zájmena 'on'."],
    explanation: "2. pád (koho/čeho?) zájmena 'on' je 'ho', 'jej' nebo 'jeho'.",
  },
  {
    question: "Která forma je správná: 'Dám to ___ (on).' v 3. pádu?",
    correctAnswer: "mu / jemu",
    options: ["ho", "mu / jemu", "jím", "nim"],
    hints: ["Dám komu? To je 3. pád zájmena 'on'."],
    explanation: "3. pád (komu?) zájmena 'on' je 'mu' (krátký tvar) nebo 'jemu'.",
  },
  {
    question: "Která forma je správná: 'Jdu s ___ (on).' v 7. pádu?",
    correctAnswer: "ním",
    options: ["mu", "ho", "ním", "jemu"],
    hints: ["Po předložce se používá delší tvar (ne 'ho')."],
    explanation: "Po předložce je 7. pád 'ním': 's ním'. Bez předložky by to byl tvar 'jím'.",
  },
  {
    question: "Která forma je správná: 'Myslím na ___ (ona).' ve 4. pádu?",
    correctAnswer: "ni / ji",
    options: ["jí", "ni / ji", "ní", "ona"],
    hints: ["Na koho? → 4. pád. Pozor na tvar po předložce 'na'."],
    explanation: "4. pád (koho?) zájmena 'ona' je 'ji'; po předložce 'na' se mění na 'ni': 'na ni'. 'jí/ní' jsou jiné pády.",
  },
  {
    question: "Jaký je 3. pád od zájmena 'my'?",
    correctAnswer: "nám",
    options: ["nás", "nám", "námi", "naše"],
    hints: ["Zeptej se: Komu/čemu? To je 3. pád zájmena 'my'."],
    explanation: "3. pád (komu/čemu?) zájmena 'my' je 'nám'.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Která forma je správná: 'Viděl ___ (já) v parku.' ve 4. pádu?",
    correctAnswer: "mě / mne",
    options: ["mi", "mě / mne", "mnou", "mé"],
    hints: ["Viděl koho? → 4. pád zájmena 'já'."],
    explanation: "4. pád (koho?) zájmena 'já' je 'mě' (krátký tvar) nebo 'mne'.",
  },
  {
    question: "Která forma je správná: 'Mluvil o ___ (ty).' v 6. pádu?",
    correctAnswer: "tobě",
    options: ["tě", "ti", "tobě", "tebou"],
    hints: ["O kom/čem? To je 6. pád, po předložce 'o'."],
    explanation: "6. pád (o kom?) zájmena 'ty' je 'tobě': 'o tobě'.",
  },
  {
    question: "Kdy se používá krátký tvar 'mi'?",
    correctAnswer: "v nepřízvučné pozici (ne po předložce)",
    options: [
      "vždy a všude",
      "v nepřízvučné pozici (ne po předložce)",
      "jen na začátku věty",
      "jen v otázkách",
    ],
    hints: ["Vzpomeň si: 'Řekni mi.' vs 'Ke mně přijď.' Kde stojí 'mi'?"],
    explanation: "'mi' je krátký nepřízvučný tvar 3. pádu. Po předložkách (ke, o, k) se používá dlouhý tvar 'mně'.",
  },
  {
    question: "Proč se říká 'pro mě', a ne 'pro mi'?",
    correctAnswer: "po předložce je delší tvar (mě/mne)",
    options: [
      "'mi' je zkrácenina slova",
      "po předložce je delší tvar (mě/mne)",
      "záleží na nářečí",
      "obojí je správně",
    ],
    hints: ["Po předložce nikdy nestojí krátké 'mi'."],
    explanation: "Po předložkách (pro, ke, o, bez) se nikdy nepoužívá krátké 'mi' — vždy 'mě/mne' nebo 'mně'.",
  },
  {
    question: "Jaký je 4. pád od zájmena 'oni'?",
    correctAnswer: "je / ně",
    options: ["jim", "je / ně", "jimi", "nim"],
    hints: ["Vidím koho? → 4. pád množného čísla."],
    explanation: "4. pád (koho?) mn. č. je 'je' (vidím je); po předložce se mění na 'ně' (na ně).",
  },
  {
    question: "Která forma je správná: 'Jde to bez ___ (vy).' ve 2. pádu?",
    correctAnswer: "vás",
    options: ["vám", "vás", "vámi", "vy"],
    hints: ["Bez koho/čeho? Předložka 'bez' se pojí s 2. pádem."],
    explanation: "2. pád (koho/čeho?) zájmena 'vy' je 'vás': 'bez vás'.",
  },
  {
    question: "Která forma je správná: 'Mluvili o ___ (já).' v 6. pádu?",
    correctAnswer: "o mně",
    options: ["o mi", "o mně", "o mě", "o ní"],
    hints: ["Po předložce 'o' následuje 6. pád. Krátké 'mi' tu nemůže být."],
    explanation: "Po předložce 'o' = 6. pád = 'mně': 'o mně'. Krátké 'mi' se po předložce nepoužívá.",
  },
  {
    question: "Jaký je 7. pád od zájmena 'my'?",
    correctAnswer: "námi",
    options: ["nás", "nám", "námi", "my"],
    hints: ["S kým? To je 7. pád zájmena 'my'."],
    explanation: "7. pád (s kým?) zájmena 'my' je 'námi': 's námi'.",
  },
  {
    question: "Která forma je správná: 'Jdu za ___ (ona).' v 7. pádu?",
    correctAnswer: "za ní",
    options: ["za ji", "za ní", "za jí", "za ni"],
    hints: ["Za = předložka. Použiješ delší tvar zájmena 'ona'."],
    explanation: "Po předložce 'za' = 7. pád = 'ní': 'za ní'. 'ji/ni' jsou 4. pád, 'jí' je 3. pád.",
  },
  {
    question: "Jaký je 2. pád od zájmena 'ono'?",
    correctAnswer: "ho / jeho / jej",
    options: ["mu", "ho / jeho / jej", "jím", "nim"],
    hints: ["Střední rod 'ono' se v některých pádech skloňuje stejně jako mužský 'on'."],
    explanation: "2. pád zájmena 'ono' je 'ho/jeho/jej' — stejně jako u 'on'.",
  },
  {
    question: "Která forma je správná: 'Vidím ___ (vy).' ve 4. pádu?",
    correctAnswer: "vás",
    options: ["vám", "vás", "vámi", "vy"],
    hints: ["Vidím koho? To je 4. pád zájmena 'vy'."],
    explanation: "4. pád (koho?) zájmena 'vy' je 'vás'.",
  },
  {
    question: "Která forma je správná: 'Záleží na ___ (on).' v 6. pádu?",
    correctAnswer: "něm",
    options: ["mu", "ho", "něm", "jemu"],
    hints: ["Po předložce 'na' následuje 6. pád."],
    explanation: "Po předložce 'na' = 6. pád = 'něm': 'na něm'.",
  },
  {
    question: "Která forma je správná: 'Jde tam bez ___ (já).'?",
    correctAnswer: "bez mě",
    options: ["bez mi", "bez mě", "bez mnou", "bez já"],
    hints: ["'Bez' se pojí s 2. pádem. 'Mi' je 3. pád."],
    explanation: "Předložka 'bez' = 2. pád = 'mě' (nebo 'mne'). 'mi' je 3. pád, 'mnou' je 7. pád.",
  },
  {
    question: "Která forma je správná: 'Volal jsi na ___ (já)?' ve 4. pádu?",
    correctAnswer: "na mě",
    options: ["na mnou", "na mě", "na mi", "na mé"],
    hints: ["'Na' se tady pojí se 4. pádem. Ptáme se: na koho?"],
    explanation: "Předložka 'na' + 4. pád = 'na mě' (nebo 'na mne'). 'mnou' je 7. pád, 'mi' je 3. pád.",
  },
  {
    question: "Jak se liší 'jím' a 'jim'?",
    correctAnswer: "jím = 7. pád j. č., jim = 3. pád mn. č.",
    options: [
      "jsou totéž, jen pravopis",
      "jím = 7. pád j. č., jim = 3. pád mn. č.",
      "jim = 7. pád, jím = 3. pád",
      "obojí je 4. pád",
    ],
    hints: ["Délka samohlásky í/i rozlišuje pád. Které je jednotné a které množné?"],
    explanation: "'jím' (dlouhé í) = 7. pád jednotného čísla (pohrdá jím). 'jim' (krátké i) = 3. pád množného čísla (řeknu jim).",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Která forma je správná: 'Přijdu k ___ (ty).' ve 3. pádu?",
    correctAnswer: "tobě",
    options: ["tě", "ti", "tobě", "tebou"],
    hints: ["Po předložce 'k' následuje 3. pád. Krátké 'ti' tu nestojí."],
    explanation: "Po předložce 'k' = 3. pád = 'tobě': 'k tobě' (ne 'k ti').",
  },
  {
    question: "Která forma je správná: 'Myslím jen na ___ (já).' (mluvčí o sobě)?",
    correctAnswer: "sebe",
    options: ["mě", "mi", "sebe", "mnou"],
    hints: ["Když podmět mluví sám o sobě, použije zvratné zájmeno."],
    explanation: "Když mluvčí myslí na sebe sama, použije zvratné 'sebe': 'Myslím jen na sebe.' 'Na mě' by znamenalo někoho jiného.",
  },
  {
    question: "Ve větě 'Je mi dobře.' — je tvar 'mi' správně?",
    correctAnswer: "Ano, 'mi' je tu správně",
    options: [
      "Ne, správně je 'mně'",
      "Ano, 'mi' je tu správně",
      "Ne, správně je 'mě'",
      "Záleží na nářečí",
    ],
    hints: ["Je ve větě předložka? Pokud ne, krátký tvar 'mi' může být správně."],
    explanation: "'Je mi dobře' — 'mi' je krátký tvar 3. pádu v nepřízvučné pozici, a to je správně. Není tu předložka, která by vyžadovala 'mně'.",
  },
  {
    question: "Ve větě 'Dej to mně, ne jemu.' — proč je tam 'mně', a ne 'mi'?",
    correctAnswer: "'mně' je zdůrazněný (přízvučný) tvar",
    options: [
      "'mi' je tu špatně",
      "'mně' je zdůrazněný (přízvučný) tvar",
      "záleží na slovese",
      "'mně' je 4. pád",
    ],
    hints: ["Věta něco zdůrazňuje (MNĚ, ne jemu). Zdůraznění vede k dlouhému tvaru."],
    explanation: "Při zdůraznění a kontrastu ('mně, ne jemu') se používá dlouhý přízvučný tvar 'mně', i když není po předložce.",
  },
  {
    question: "Jaký je 7. pád od zájmena 'ona'?",
    correctAnswer: "ní",
    options: ["jí", "ní", "ji", "ona"],
    hints: ["7. pád zájmena 'ona', typicky po předložce (s, za, před)."],
    explanation: "7. pád (s kým?) zájmena 'ona' je 'ní': 's ní, za ní'. 'jí' je 3. pád, 'ji' je 4. pád.",
  },
  {
    question: "Která forma je správná: 'Psal jsem o ___ (ty).' v 6. pádu?",
    correctAnswer: "tobě",
    options: ["tě", "ti", "tobě", "tebou"],
    hints: ["O kom? To je 6. pád, po předložce 'o'."],
    explanation: "6. pád (o kom?) zájmena 'ty' je 'tobě': 'o tobě'.",
  },
  {
    question: "Která forma je správná: 'Šli jsme s ___ (oni).' v 7. pádu?",
    correctAnswer: "nimi",
    options: ["jim", "ně", "nimi", "jimi"],
    hints: ["S kým? → 7. pád množného čísla, po předložce."],
    explanation: "7. pád mn. č. po předložce 's' je 'nimi': 's nimi'.",
  },
  {
    question: "Jaký tvar má zájmeno 'ony' v 6. pádu po předložce?",
    correctAnswer: "nich",
    options: ["ji", "ní", "nich", "jimi"],
    hints: ["6. pád množného čísla po předložce (o, v)."],
    explanation: "6. pád mn. č. po předložce je 'nich': 'o nich, v nich'.",
  },
  {
    question: "Kdy použijeme 'jejím' a kdy 'jím'?",
    correctAnswer: "jejím = přivlastňovací, jím = 7. pád osobního",
    options: [
      "jsou totéž",
      "jejím = přivlastňovací, jím = 7. pád osobního",
      "jejím je vždy špatně",
      "jím = přivlastňovací",
    ],
    hints: ["Jedno přivlastňuje (čí?), druhé je pád osobního zájmena."],
    explanation: "'jejím' je přivlastňovací zájmeno (jejím autem = patří jí). 'jím' je 7. pád osobního zájmena 'on/ono' (pohrdá jím).",
  },
  {
    question: "Která forma je správná: 'Promluvil s ___ (já) o problému.' v 7. pádu?",
    correctAnswer: "mnou",
    options: ["mi", "mě", "mnou", "mne"],
    hints: ["S kým? To je 7. pád zájmena 'já'."],
    explanation: "7. pád (s kým?) zájmena 'já' je 'mnou': 's mnou'.",
  },
  {
    question: "Která forma je správná: 'Závisí to na ___ (vy).' v 6. pádu?",
    correctAnswer: "vás",
    options: ["vám", "vámi", "vás", "vy"],
    hints: ["Na kom? To je 6. pád, po předložce 'na'."],
    explanation: "6. pád (na kom?) zájmena 'vy' je 'vás': 'na vás'.",
  },
  {
    question: "Která forma je správná: 'Viděl jsem ___ (oni, mužský životný) v parku.' ve 4. pádu?",
    correctAnswer: "je / ně",
    options: ["jim", "jimi", "je / ně", "nich"],
    hints: ["Viděl koho? → 4. pád množného čísla."],
    explanation: "4. pád (koho?) mn. č.: bez předložky 'je', po předložce 'ně' (na ně).",
  },
  {
    question: "Která forma je správná: 'Dám to ___ (ona).' ve 3. pádu?",
    correctAnswer: "jí",
    options: ["ji", "jí", "ní", "ona"],
    hints: ["Dám komu? To je 3. pád zájmena 'ona'."],
    explanation: "3. pád (komu?) zájmena 'ona' je 'jí' (dlouhé í). 'ji' (krátké i) je 4. pád.",
  },
  {
    question: "Která forma je správná: 'Potřebuju ___ (ty) tady.' ve 4. pádu?",
    correctAnswer: "tě / tebe",
    options: ["tobě", "tě / tebe", "ti", "tebou"],
    hints: ["Potřebuji koho? → 4. pád zájmena 'ty'."],
    explanation: "4. pád (koho?) zájmena 'ty' je 'tě' (krátký tvar) nebo 'tebe'.",
  },
  {
    question: "Která forma je správná: 'Záleží mi na ___ (my).' v 6. pádu?",
    correctAnswer: "nás",
    options: ["nás", "nám", "námi", "my"],
    hints: ["Na kom? → 6. pád zájmena 'my'."],
    explanation: "Po předložce 'na' = 6. pád = 'nás': 'na nás'.",
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
