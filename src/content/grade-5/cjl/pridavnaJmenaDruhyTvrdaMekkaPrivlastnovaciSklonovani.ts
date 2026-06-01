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
    question: "Jaký druh přídavného jména je 'mladý'?",
    correctAnswer: "tvrdé – vzor mladý",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "neurčité"],
    hints: ["Tvrdá přídavná jména mají v nominativu -ý nebo -á nebo -é."],
  },
  {
    question: "Jaký druh přídavného jména je 'jarní'?",
    correctAnswer: "měkké – vzor jarní",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "neurčité"],
    hints: ["Měkká přídavná jména mají koncovku -í (jarní, večerní, cizí)."],
  },
  {
    question: "Jaký druh přídavného jména je 'Petrův'?",
    correctAnswer: "přivlastňovací – vzor otcův",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací – vzor otcův", "vztahové"],
    hints: ["Přivlastňovací = vyjadřuje, komu něco patří. Petrův = patří Petrovi."],
  },
  {
    question: "Jaký druh přídavného jména je 'maminčin'?",
    correctAnswer: "přivlastňovací – vzor matčin",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací – vzor matčin", "vztahové"],
    hints: ["Maminčin = patří mamince. Přivlastňovací."],
  },
  {
    question: "Jaký druh přídavného jména je 'večerní'?",
    correctAnswer: "měkké – vzor jarní",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "složené"],
    hints: ["Večerní má koncovku -í → měkké."],
  },
  {
    question: "Jaký druh přídavného jména je 'krásný'?",
    correctAnswer: "tvrdé – vzor mladý",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "příslovečné"],
    hints: ["Krásný má koncovku -ý → tvrdé."],
  },
  {
    question: "Ve větě 'Slyším zimní vítr.' přídavné jméno 'zimní' je:",
    correctAnswer: "měkké – vzor jarní",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "neurčité"],
    hints: ["Zimní má koncovku -í → měkké, vzor jarní."],
  },
  {
    question: "Ve větě 'Vidím tátkův klobouk.' přídavné jméno 'tátkův' je:",
    correctAnswer: "přivlastňovací",
    options: ["tvrdé", "měkké", "přivlastňovací", "záporné"],
    hints: ["Tátkův = patří tátkovi. Přivlastňovací."],
  },
  {
    question: "Vzor 'mladý' skloňuje přídavná jména:",
    correctAnswer: "tvrdá (mladý, starý, hezký, velký)",
    options: [
      "měkká (jarní, večerní, cizí)",
      "tvrdá (mladý, starý, hezký, velký)",
      "přivlastňovací (otcův, matčin)",
      "záporná (ne-)",
    ],
    hints: ["Vzor mladý = základ pro tvrdá přídavná jména."],
  },
  {
    question: "Vzor 'jarní' skloňuje přídavná jména:",
    correctAnswer: "měkká (jarní, ranní, cizí, domácí)",
    options: [
      "tvrdá (mladý, starý)",
      "měkká (jarní, ranní, cizí, domácí)",
      "přivlastňovací (otcův, matčin)",
      "příslovečná",
    ],
    hints: ["Vzor jarní = základ pro měkká přídavná jména."],
  },
  {
    question: "Jaký pád je přídavné jméno 'krásné' ve větě 'Vidím krásné moře.'?",
    correctAnswer: "4. pád (akuzativ) – koho/co vidím?",
    options: [
      "1. pád (nominativ)",
      "2. pád (genitiv)",
      "4. pád (akuzativ) – koho/co vidím?",
      "7. pád (instrumentál)",
    ],
    hints: ["Vidím koho/co? → 4. pád."],
  },
  {
    question: "Přídavné jméno 'cizí' je:",
    correctAnswer: "měkké – vzor jarní",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "záporné"],
    hints: ["Cizí má koncovku -í → měkké."],
  },
  {
    question: "Přídavné jméno 'čerstvý' je:",
    correctAnswer: "tvrdé – vzor mladý",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "složené"],
    hints: ["Čerstvý má koncovku -ý → tvrdé."],
  },
  {
    question: "Přídavné jméno 'sousedův' je:",
    correctAnswer: "přivlastňovací – vzor otcův",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací – vzor otcův", "neurčité"],
    hints: ["Sousedův = patří sousedovi. Přivlastňovací, vzor otcův."],
  },
  {
    question: "Jaký druh přídavného jména je 'ranní'?",
    correctAnswer: "měkké – vzor jarní",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "příslovce"],
    hints: ["Ranní má koncovku -í → měkké."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Skloňuj: mladý pes (2. pád, singuár)",
    correctAnswer: "mladého psa",
    options: ["mladého psa", "mladém psu", "mladý pes", "mladému psu"],
    hints: ["2. pád = koho/čeho? → mladého (vzor mladý, rod mužský živý)."],
  },
  {
    question: "Skloňuj: jarní vítr (3. pád, singulár)",
    correctAnswer: "jarnímu větru",
    options: ["jarního větru", "jarnímu větru", "jarní vítr", "jarním větru"],
    hints: ["3. pád = komu/čemu? → jarnímu (vzor jarní, mužský neživotný)."],
  },
  {
    question: "Skloňuj: maminčina kabelka (4. pád, singulár)",
    correctAnswer: "maminčinu kabelku",
    options: ["maminčinu kabelku", "maminčiny kabelky", "maminčinou kabelkou", "maminčina kabelka"],
    hints: ["4. pád = koho/co? → kabelku (ženský rod, vzor žena)."],
  },
  {
    question: "Ve větě 'Viděl jsem starého muže.' přídavné jméno 'starého' je v:",
    correctAnswer: "4. pádu, mužský životný",
    options: [
      "1. pádu",
      "2. pádu",
      "4. pádu, mužský životný",
      "7. pádu",
    ],
    hints: ["Viděl jsem koho? → 4. pád. Muže = mužský životný."],
  },
  {
    question: "Tvrdé přídavné jméno v 6. pádu množného čísla má koncovku:",
    correctAnswer: "-ých (o mladých)",
    options: ["-ých (o mladých)", "-ím (o mladím)", "-ích (o mladích)", "-em (o mladem)"],
    hints: ["O mladých chlapcích – 6. pád mn. č. = -ých."],
  },
  {
    question: "Měkké přídavné jméno v 6. pádu množného čísla má koncovku:",
    correctAnswer: "-ích (o jarních)",
    options: ["-ých (o jarních)", "-ích (o jarních)", "-im (o jarnim)", "-ám (o jarním)"],
    hints: ["O jarních dnech – 6. pád mn. č. měkkého přídavného jmena = -ích."],
  },
  {
    question: "Ve větě 'Chodím po ranní procházce.' je přídavné jméno v:",
    correctAnswer: "6. pádu, ženský rod",
    options: ["1. pádu", "3. pádu", "6. pádu, ženský rod", "4. pádu"],
    hints: ["Po čem? = 6. pád. Procházce = ženský rod."],
  },
  {
    question: "Přívlastňovací přídavné jméno vzoru 'otcův' je v 1. pádu mužského rodu:",
    correctAnswer: "-ův (otcův, bratranců, tátkův)",
    options: ["-in (matčin)", "-ův (otcův, bratranců, tátkův)", "-ní (jarní)", "-ý (mladý)"],
    hints: ["Vzor otcův = přivlastňovací od mužského jména."],
  },
  {
    question: "Přívlastňovací přídavné jméno vzoru 'matčin' je v 1. pádu mužského rodu:",
    correctAnswer: "-in (maminčin, sestřin, Kateřinin)",
    options: ["-ův (otcův)", "-in (maminčin, sestřin, Kateřinin)", "-ní (jarní)", "-ý (mladý)"],
    hints: ["Vzor matčin = přivlastňovací od ženského jména."],
  },
  {
    question: "Ve větě 'Dal jsem to kamarádovu bratrovi.' je 'kamarádovu' v:",
    correctAnswer: "3. pádu, mužský životný (bratrovi)",
    options: [
      "1. pádu",
      "2. pádu",
      "3. pádu, mužský životný (bratrovi)",
      "4. pádu",
    ],
    hints: ["Bratrovi = komu? = 3. pád. Kamarádovu se shoduje s bratrem."],
  },
  {
    question: "Jak se skloňuje přídavné jméno 'domácí' (vzor jarní) v 7. pádu singulár ženský rod?",
    correctAnswer: "domácí (s domácí kuchyní)",
    options: [
      "domácím",
      "domácí (s domácí kuchyní)",
      "domácou",
      "domácímu",
    ],
    hints: ["Vzor jarní – ženský rod, 7. pád: s jarní = s domácí."],
  },
  {
    question: "Tvrdé přídavné jméno ženského rodu, 4. pád: krásná žena →",
    correctAnswer: "krásnou ženu",
    options: ["krásné ženy", "krásnou ženu", "krásné ženě", "krásnou ženu správně"],
    hints: ["4. pád ženský: -ou (krásnou)."],
  },
  {
    question: "Přídavné jméno 'bratrův' je v 1. pádu žen. rodu:",
    correctAnswer: "bratrova (sestra)",
    options: ["bratrův (sestra)", "bratrova (sestra)", "bratrové (sestra)", "bratruvou"],
    hints: ["Vzor otcův: ženský rod 1. pádu = -ova (otcova, bratrova)."],
  },
  {
    question: "Jak se liší skloňování tvrdých a měkkých přídavných jmen?",
    correctAnswer: "tvrdá mají -ý/-á/-é, měkká mají -í ve všech rodech",
    options: [
      "ničím – skloňují se stejně",
      "tvrdá mají -ý/-á/-é, měkká mají -í ve všech rodech",
      "měkká jsou jen v množném čísle",
      "tvrdá mají jen jeden rod",
    ],
    hints: ["Jarní vítr / jarní noc / jarní ráno – měkká mají vždy -í."],
  },
  {
    question: "Skloňuj: Petrův (1. pád) → Petrovi (3. pád) → Petra (2. pád) → čeho se zde mění?",
    correctAnswer: "mění se koncovka přivlastňovacího přídavného jména i podstatného jména",
    options: [
      "mění se jen podstatné jméno",
      "mění se jen přídavné jméno",
      "mění se koncovka přivlastňovacího přídavného jména i podstatného jména",
      "nic se nemění",
    ],
    hints: ["Přivlastňovací přídavná jména se skloňují stejně jako ostatní přídavná jména."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Ve větě 'Uchýlili jsme se k sousedovým dětem.' je 'sousedovým' ve:",
    correctAnswer: "3. pádu množném čísle (k čemu/komu? → k dětem)",
    options: [
      "1. pádu",
      "3. pádu množném čísle (k čemu/komu? → k dětem)",
      "6. pádu",
      "4. pádu",
    ],
    hints: ["K čemu/komu? = 3. pád. Děti = množné číslo."],
  },
  {
    question: "Jak správně skloňuješ: 'Dívka hledala babiččin domeček.' – jaký pád a rod?",
    correctAnswer: "4. pád, mužský neživotný (domeček = co?)",
    options: [
      "1. pád, mužský neživotný",
      "4. pád, mužský neživotný (domeček = co?)",
      "2. pád, střední rod",
      "6. pád, ženský rod",
    ],
    hints: ["Hledala co? → 4. pád. Domeček = mužský neživotný."],
  },
  {
    question: "Ve větě 'Mluvil o otcových plánech.' je 'otcových' ve:",
    correctAnswer: "6. pádu množném čísle (o čem? o plánech)",
    options: [
      "2. pádu mn. č.",
      "6. pádu množném čísle (o čem? o plánech)",
      "3. pádu mn. č.",
      "1. pádu mn. č.",
    ],
    hints: ["O čem? = 6. pád. Plánech = množné číslo."],
  },
  {
    question: "Jak zní 2. pád množného čísla přídavného jména 'jarní'?",
    correctAnswer: "jarních (bez jarních vůní)",
    options: ["jarným", "jarních (bez jarních vůní)", "jarných", "jarnímu"],
    hints: ["Vzor jarní, 2. pád mn. č. = -ích (jarních, ranních)."],
  },
  {
    question: "Ve větě 'Šel jsem cizí cestou.' je 'cizí' ve:",
    correctAnswer: "7. pádu, ženský rod (čím? cestou)",
    options: [
      "1. pádu, ženský rod",
      "3. pádu, ženský rod",
      "7. pádu, ženský rod (čím? cestou)",
      "4. pádu, ženský rod",
    ],
    hints: ["Šel čím? = 7. pád. Cestou = ženský rod."],
  },
  {
    question: "Přídavné jméno 'Kateřinin' je vzoru:",
    correctAnswer: "matčin (přivlastňovací od ženského jména)",
    options: [
      "otcův (přivlastňovací od mužského)",
      "matčin (přivlastňovací od ženského jména)",
      "jarní (měkké)",
      "mladý (tvrdé)",
    ],
    hints: ["Kateřina = ženské jméno → vzor matčin."],
  },
  {
    question: "Jak se skloňuje 'kuchař' → 'kuchařův' (přivlastňovací)? Ve 2. pádu: kuchařova ___ (polévka)?",
    correctAnswer: "kuchařovy polévky",
    options: ["kuchařovou polévkou", "kuchařovy polévky", "kuchařovým polévky", "kuchařovy polévce"],
    hints: ["2. pád ženský vzor matky: polévky → kuchařovy polévky."],
  },
  {
    question: "Ve větě 'Zhlédl jsem několik ranních zpráv.' je 'ranních' ve:",
    correctAnswer: "2. pádu množném čísle (koho/čeho? zpráv)",
    options: [
      "6. pádu mn. č.",
      "2. pádu množném čísle (koho/čeho? zpráv)",
      "4. pádu mn. č.",
      "1. pádu mn. č.",
    ],
    hints: ["Koho/čeho? = 2. pád. Zpráv = ženský rod, mn. č."],
  },
  {
    question: "Jak zní 1. pád množného čísla tvrdého přídavného jmena mužského životného rodu (vzor mladý)?",
    correctAnswer: "-í (mladí muži, staří pánové)",
    options: [
      "-ý (mladý)",
      "-í (mladí muži, staří pánové)",
      "-ého (mladého)",
      "-ých (mladých)",
    ],
    hints: ["1. pád mn. č. mužský životný vzor mladý = -í."],
  },
  {
    question: "Ve větě 'Pracoval jsem s mladými kolegy.' je 'mladými' ve:",
    correctAnswer: "7. pádu množném čísle (s kým/čím?)",
    options: [
      "3. pádu mn. č.",
      "6. pádu mn. č.",
      "7. pádu množném čísle (s kým/čím?)",
      "4. pádu mn. č.",
    ],
    hints: ["S kým/čím? = 7. pád. Kolegy = mužský životný, mn. č."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const PRIDAVNAJMENADRUHYTVRDAMEKKAPRIVLASTNOVACISKLONOVANI: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-pridavna-jmena-druhy-tvrda-mekka-privlastnovaci-sklonovani",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-pridavna-jmena-druhy-tvrda-mekka-privlastnovaci-sklonovani",
    title: "Přídavná jména – druhy, skloňování",
    studentTitle: "Přídavná jména",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Poznáš druhy přídavných jmen a jejich skloňování.",
    keywords: ["přídavná jména", "tvrdá", "měkká", "přivlastňovací", "skloňování", "vzory"],
    goals: [
      "Rozlišit tvrdá, měkká a přivlastňovací přídavná jména",
      "Přiřadit přídavné jméno ke správnému vzoru",
      "Správně skloňovat přídavná jména v různých pádech",
    ],
    boundaries: [
      "Neprobíráme přídavná jména neurčitá a záporná podrobně",
      "Bez složitých syntaktických analýz",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Přídavné jméno v základním tvaru: končí na -ý/-á/-é → tvrdé (vzor mladý). Končí na -í → měkké (vzor jarní). Vyjadřuje vlastnictví (-ův/-in) → přivlastňovací.",
      steps: [
        "Podívej se na základní tvar přídavného jmena.",
        "Końcovka -ý/-á/-é → tvrdé, vzor mladý.",
        "Końcovka -í → měkké, vzor jarní.",
        "Vyjadřuje komu patří (-ův, -in) → přivlastňovací.",
        "Skloňuj podle správného vzoru.",
      ],
      commonMistake: "Žáci zaměňují měkká a tvrdá přídavná jména. Klíč: -í vždy = měkké.",
      example: "Tvrdé: mladý, krásný, velký. Měkké: jarní, večerní, cizí. Přivlastňovací: Petrův, maminčin.",
    },
  },
];
