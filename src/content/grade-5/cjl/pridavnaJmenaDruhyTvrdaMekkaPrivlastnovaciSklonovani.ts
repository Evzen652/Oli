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
    hints: ["Vyslov slovo v 1. pádě a poslechni jeho poslední hlásku."],
  },
  {
    question: "Jaký druh přídavného jména je 'jarní'?",
    correctAnswer: "měkké – vzor jarní",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "neurčité"],
    hints: ["Vyslov slovo v 1. pádě a poslechni jeho poslední hlásku. Pak ho zařaď."],
  },
  {
    question: "Jaký druh přídavného jména je 'Petrův'?",
    correctAnswer: "přivlastňovací – vzor otcův",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací – vzor otcův", "vztahové"],
    hints: ["Zkus na to slovo otázku 'čí?'. Sedí na něj?"],
  },
  {
    question: "Jaký druh přídavného jména je 'maminčin'?",
    correctAnswer: "přivlastňovací – vzor matčin",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací – vzor matčin", "vztahové"],
    hints: ["Zkus na to slovo otázku 'čí?'. Sedí na něj?"],
  },
  {
    question: "Jaký druh přídavného jména je 'večerní'?",
    correctAnswer: "měkké – vzor jarní",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "složené"],
    hints: ["Vyslov slovo v 1. pádě a poslechni jeho poslední hlásku."],
  },
  {
    question: "Jaký druh přídavného jména je 'krásný'?",
    correctAnswer: "tvrdé – vzor mladý",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "příslovečné"],
    hints: ["Vyslov slovo v 1. pádě a poslechni jeho poslední hlásku. Pak rozhodni."],
  },
  {
    question: "Ve větě 'Slyším zimní vítr.' přídavné jméno 'zimní' je:",
    correctAnswer: "měkké – vzor jarní",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "neurčité"],
    hints: ["Najdi přídavné jméno a poslechni jeho poslední hlásku v 1. pádě."],
  },
  {
    question: "Ve větě 'Vidím tátkův klobouk.' přídavné jméno 'tátkův' je:",
    correctAnswer: "přivlastňovací",
    options: ["tvrdé", "měkké", "přivlastňovací", "záporné"],
    hints: ["Zkus na to slovo otázku 'čí?'. Sedí na něj?"],
  },
  {
    question: "Vzor 'mladý' skloňuje přídavná jména:",
    correctAnswer: "tvrdá – mladý, starý, hezký, velký",
    options: [
      "měkká – jarní, večerní, cizí",
      "tvrdá – mladý, starý, hezký, velký",
      "přivlastňovací – otcův, matčin",
      "záporná – ne-",
    ],
    hints: ["Jakou koncovku má samo slovo 'mladý'? Stejný typ jmen vzor zastupuje."],
  },
  {
    question: "Vzor 'jarní' skloňuje přídavná jména:",
    correctAnswer: "měkká – jarní, ranní, cizí, domácí",
    options: [
      "tvrdá – mladý, starý",
      "měkká – jarní, ranní, cizí, domácí",
      "přivlastňovací – otcův, matčin",
      "příslovečná",
    ],
    hints: ["Jakou koncovku má samo slovo 'jarní'? Stejný typ jmen vzor zastupuje."],
  },
  {
    question: "Jaký pád je přídavné jméno 'krásné' ve větě 'Vidím krásné moře.'?",
    correctAnswer: "4. pád – akuzativ – koho/co vidím?",
    options: [
      "1. pád – nominativ",
      "2. pád – genitiv",
      "4. pád – akuzativ – koho/co vidím?",
      "7. pád – instrumentál",
    ],
    hints: ["Vidím koho/co? → 4. pád."],
  },
  {
    question: "Přídavné jméno 'cizí' je:",
    correctAnswer: "měkké – vzor jarní",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "záporné"],
    hints: ["Vyslov slovo v 1. pádě a poslechni jeho poslední hlásku."],
  },
  {
    question: "Přídavné jméno 'čerstvý' je:",
    correctAnswer: "tvrdé – vzor mladý",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "složené"],
    hints: ["Vyslov slovo v 1. pádě a poslechni jeho poslední hlásku. Pak rozhodni."],
  },
  {
    question: "Přídavné jméno 'sousedův' je:",
    correctAnswer: "přivlastňovací – vzor otcův",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací – vzor otcův", "neurčité"],
    hints: ["Zkus na to slovo otázku 'čí?'. Sedí na něj?"],
  },
  {
    question: "Jaký druh přídavného jména je 'ranní'?",
    correctAnswer: "měkké – vzor jarní",
    options: ["tvrdé – vzor mladý", "měkké – vzor jarní", "přivlastňovací", "příslovce"],
    hints: ["Vyslov slovo v 1. pádě a poslechni jeho poslední hlásku."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Skloňuj: mladý pes (2. pád, singuár)",
    correctAnswer: "mladého psa",
    options: ["mladého psa", "mladém psu", "mladý pes", "mladému psu"],
    hints: ["2. pád = koho/čeho? U tvrdého vzoru (mladý) má mužský rod životný v tomto pádě koncovku -ého. Aplikuj ji na 'mladý'."],
  },
  {
    question: "Skloňuj: jarní vítr (3. pád, jednotné číslo)",
    correctAnswer: "jarnímu větru",
    options: ["jarního větru", "jarnímu větru", "jarní vítr", "jarním větru"],
    hints: ["3. pád = komu/čemu? → jarnímu (vzor jarní, mužský neživotný)."],
  },
  {
    question: "Skloňuj: maminčina kabelka (4. pád, jednotné číslo)",
    correctAnswer: "maminčinu kabelku",
    options: ["maminčinu kabelku", "maminčiny kabelky", "maminčinou kabelkou", "maminčina kabelka"],
    hints: ["4. pád ženského rodu (vzor žena) má koncovku -u. Aplikuj ji na obě slova ve spojení 'maminčina kabelka'."],
  },
  {
    question: "Ve větě 'Viděl jsem starého muže.' přídavné jméno 'starého' je v:",
    correctAnswer: "4. pádu",
    options: [
      "1. pádu",
      "4. pádu",
      "2. pádu",
      "7. pádu",
    ],
    hints: ["Zkus na větu položit postupně pádové otázky (kdo/co, koho/čeho, komu/čemu, koho/co, o kom/čem, kým/čím) — která z nich sedí na 'muže'? A je 'muž' bytost, nebo věc?"],
  },
  {
    question: "Tvrdé přídavné jméno v 6. pádu množného čísla má koncovku:",
    correctAnswer: "-ých – o mladých",
    options: ["-ých – o mladých", "-ím – o mladím", "-ích – o mladích", "-em – o mladem"],
    hints: ["Tvrdé přídavné jméno, vzor mladý, 6. pád množného čísla. Jaká je koncovka?"],
  },
  {
    question: "Měkké přídavné jméno v 6. pádu množného čísla má koncovku:",
    correctAnswer: "-ích – o jarních",
    options: ["-ých – o jarních", "-ích – o jarních", "-im – o jarnim", "-ám – o jarním"],
    hints: ["Měkké přídavné jméno, vzor jarní, 6. pád množného čísla. Jaká je koncovka?"],
  },
  {
    question: "Ve větě 'Mluvili jsme o ranní procházce.' je přídavné jméno v:",
    correctAnswer: "6. pádu",
    options: ["1. pádu", "6. pádu", "3. pádu", "4. pádu"],
    hints: ["Zkus doplnit otázku 'po čem?' do vzorce pádových otázek (kdo/co, koho/čeho, komu/čemu, koho/co, o kom/čem, kým/čím) a najdi, který pád tomu odpovídá. Jaký rod má slovo 'procházka'?"],
  },
  {
    question: "Přivlastňovací přídavné jméno vzoru 'otcův' je v 1. pádu mužského rodu:",
    correctAnswer: "-ův (otcův, bratrancův)",
    options: ["-in (matčin, sestřin)", "-ův (otcův, bratrancův)", "-ní (jarní, letní)", "-ý (mladý, starý)"],
    hints: ["Vzor otcův = přivlastňovací od mužského jména."],
  },
  {
    question: "Přivlastňovací přídavné jméno vzoru 'matčin' je v 1. pádu mužského rodu:",
    correctAnswer: "-in (maminčin, sestřin)",
    options: ["-ův (otcův, bratrův)", "-in (maminčin, sestřin)", "-ní (jarní, letní)", "-ý (mladý, starý)"],
    hints: ["Vzor matčin = přivlastňovací od ženského jména."],
  },
  {
    question: "Ve větě 'Dal jsem to kamarádovu bratrovi.' je 'kamarádovu' v:",
    correctAnswer: "3. pádu",
    options: [
      "1. pádu",
      "3. pádu",
      "2. pádu",
      "4. pádu",
    ],
    hints: ["Bratrovi = komu? = 3. pád. Kamarádovu se shoduje s bratrem."],
  },
  {
    question: "Doplň přídavné jméno (vzor jarní): 'Chlubila se ___ kuchyní.'",
    correctAnswer: "domácí",
    options: [
      "domácím",
      "domácí",
      "domácou",
      "domácímu",
    ],
    hints: ["U měkkých přídavných jmen zůstává tvar v jednotném čísle stejný ve všech pádech kromě druhého — nepřidávej žádnou koncovku navíc."],
  },
  {
    question: "Tvrdé přídavné jméno ženského rodu, 4. pád: krásná žena →",
    correctAnswer: "krásnou ženu",
    options: ["krásné ženy", "krásnou ženu", "krásné ženě", "krásná žena"],
    hints: ["4. pád ženského rodu: 'Vidím koho/co?'. Jaká bude koncovka?"],
  },
  {
    question: "Přídavné jméno 'bratrův' je v 1. pádu žen. rodu:",
    correctAnswer: "bratrova – sestra",
    options: ["bratrův – sestra", "bratrova – sestra", "bratrové – sestra", "bratruvou"],
    hints: ["Vzor otcův: ženský rod 1. pádu má koncovku -ova (např. otcova). Aplikuj stejnou koncovku na 'bratrův'."],
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
    hints: ["Jarní vítr / jarní noc / jarní ráno — všimni si, jestli se koncovka mění podle rodu, nebo zůstává pořád stejná. Porovnej to s 'mladý pes / mladá liška / mladé kotě'."],
  },
  {
    question: "Co se mění při skloňování spojení 'Petrův bratr'?",
    correctAnswer: "obě slova, přídavné i podstatné",
    options: [
      "jen podstatné jméno bratr",
      "obě slova, přídavné i podstatné",
      "jen přídavné jméno Petrův",
      "nemění se ani jedno slovo",
    ],
    hints: ["Přivlastňovací přídavná jména se skloňují stejně jako ostatní přídavná jména."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Ve větě 'Šli jsme na návštěvu k sousedovým dětem.' je 'sousedovým' ve:",
    correctAnswer: "3. pádu množného čísla",
    options: [
      "1. pádu množného čísla",
      "3. pádu množného čísla",
      "6. pádu množného čísla",
      "4. pádu množného čísla",
    ],
    hints: ["K čemu/komu? = 3. pád. Děti = množné číslo."],
  },
  {
    question: "Jak správně skloňuješ: 'Dívka hledala babiččin domeček.' – jaký pád a rod?",
    correctAnswer: "4. pád, mužský neživotný – domeček = co?",
    options: [
      "1. pád, mužský neživotný",
      "4. pád, mužský neživotný – domeček = co?",
      "2. pád, střední rod",
      "6. pád, ženský rod",
    ],
    hints: ["Hledala co? Zjisti, který pád na tuhle otázku odpovídá, a pak zkontroluj: je 'domeček' bytost, nebo věc?"],
  },
  {
    question: "Ve větě 'Mluvil o otcových plánech.' je 'otcových' ve:",
    correctAnswer: "6. pádu množného čísla",
    options: [
      "2. pádu množného čísla",
      "6. pádu množného čísla",
      "3. pádu množného čísla",
      "1. pádu množného čísla",
    ],
    hints: ["O čem? = 6. pád. Plánech = množné číslo."],
  },
  {
    question: "Jak zní 2. pád množného čísla přídavného jména 'jarní'?",
    correctAnswer: "jarních",
    options: ["jarným", "jarních", "jarných", "jarnímu"],
    hints: ["U vzoru jarní má tenhle pád v množném čísle koncovku -ích. Pozor, ne -ých, to patří k tvrdým přídavným jménům."],
  },
  {
    question: "Ve větě 'Šel jsem cizí cestou.' je 'cizí' ve:",
    correctAnswer: "7. pádu, ženský rod – čím? cestou",
    options: [
      "1. pádu, ženský rod",
      "3. pádu, ženský rod",
      "7. pádu, ženský rod – čím? cestou",
      "4. pádu, ženský rod",
    ],
    hints: ["Šel čím? Zjisti, který pád na tuhle otázku odpovídá, a jaký rod má slovo 'cesta' — mužský, ženský, nebo střední?"],
  },
  {
    question: "Přídavné jméno 'Kateřinin' je vzoru:",
    correctAnswer: "matčin – přivlastňovací od ženského jména",
    options: [
      "otcův – přivlastňovací od mužského",
      "matčin – přivlastňovací od ženského jména",
      "jarní – měkké",
      "mladý – tvrdé",
    ],
    hints: ["Kateřina = ženské jméno → vzor matčin."],
  },
  {
    question: "Jak se skloňuje 'kuchař' → 'kuchařův' (přivlastňovací)? Ve 2. pádu: kuchařova ___ (polévka)?",
    correctAnswer: "kuchařovy polévky",
    options: ["kuchařovou polévkou", "kuchařovy polévky", "kuchařovým polévky", "kuchařovy polévce"],
    hints: ["Ženský vzor 'matky' má ve 2. pádu koncovku -y. Zkus tuhle koncovku aplikovat na 'polévka' i na přivlastňovací přídavné jméno."],
  },
  {
    question: "Ve větě 'Zhlédl jsem několik ranních zpráv.' je 'ranních' ve:",
    correctAnswer: "2. pádu množného čísla",
    options: [
      "6. pádu množného čísla",
      "2. pádu množného čísla",
      "4. pádu množného čísla",
      "1. pádu množného čísla",
    ],
    hints: ["Koho/čeho? = 2. pád. Zpráv = ženský rod, mn. č."],
  },
  {
    question: "Jak zní 1. pád množného čísla tvrdého přídavného jména mužského životného rodu (vzor mladý)?",
    correctAnswer: "-í (mladí muži)",
    options: [
      "-ý (mladý)",
      "-í (mladí muži)",
      "-ého (mladého)",
      "-ých (mladých)",
    ],
    hints: ["1. pád mn. č. mužský životný vzor mladý = -í."],
  },
  {
    question: "Ve větě 'Pracoval jsem s mladými kolegy.' je 'mladými' ve:",
    correctAnswer: "7. pádu množného čísla",
    options: [
      "3. pádu množného čísla",
      "7. pádu množného čísla",
      "6. pádu množného čísla",
      "4. pádu množného čísla",
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
        "Podívej se na základní tvar přídavného jména.",
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
