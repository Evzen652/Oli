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
    question: "Jaký způsob má sloveso 'Jdu domů.'?",
    correctAnswer: "oznamovací",
    options: ["oznamovací", "rozkazovací", "podmiňovací", "neurčitý"],
    hints: ["Oznamovací způsob konstatuje fakta."],
  },
  {
    question: "Jaký způsob má sloveso 'Jdi domů!'?",
    correctAnswer: "rozkazovací",
    options: ["oznamovací", "rozkazovací", "podmiňovací", "neurčitý"],
    hints: ["Rozkazovací způsob vyjadřuje rozkaz nebo prosbu."],
  },
  {
    question: "Jaký způsob má sloveso 'Šel bych domů.'?",
    correctAnswer: "podmiňovací",
    options: ["oznamovací", "rozkazovací", "podmiňovací", "neurčitý"],
    hints: ["Podmiňovací způsob vyjadřuje podmínku nebo možnost (bych, bys, by...)."],
  },
  {
    question: "Sloveso 'Otevřete okno!' je v:",
    correctAnswer: "rozkazovacím způsobu",
    options: ["oznamovacím způsobu", "rozkazovacím způsobu", "podmiňovacím způsobu", "přítomném čase"],
    hints: ["Otevřete = rozkaz pro více lidí."],
  },
  {
    question: "Sloveso 'Chtěla by spát.' je v:",
    correctAnswer: "podmiňovacím způsobu",
    options: ["oznamovacím způsobu", "rozkazovacím způsobu", "podmiňovacím způsobu", "budoucím čase"],
    hints: ["'By' je příznak podmiňovacího způsobu."],
  },
  {
    question: "Sloveso 'Hrají si venku.' je v:",
    correctAnswer: "oznamovacím způsobu",
    options: ["oznamovacím způsobu", "rozkazovacím způsobu", "podmiňovacím způsobu", "neurčitku"],
    hints: ["Konstatujeme fakt, co dělají."],
  },
  {
    question: "Jaký způsob vyjadřuje rozkaz, zákaz nebo prosbu?",
    correctAnswer: "rozkazovací způsob",
    options: ["oznamovací způsob", "rozkazovací způsob", "podmiňovací způsob", "neurčitek"],
    hints: ["Rozkaz/prosba/zákaz = rozkazovací způsob."],
  },
  {
    question: "Jaký způsob vyjadřuje možnost nebo podmínku?",
    correctAnswer: "podmiňovací způsob",
    options: ["oznamovací způsob", "rozkazovací způsob", "podmiňovací způsob", "přítomný čas"],
    hints: ["Mohl bych, šla by, přišli bychom – podmínka/možnost."],
  },
  {
    question: "'Buď hodný!' – jaký způsob?",
    correctAnswer: "rozkazovací",
    options: ["oznamovací", "rozkazovací", "podmiňovací", "přací"],
    hints: ["'Buď' je tvar rozkazovacího způsobu."],
  },
  {
    question: "'Přišli by brzy.' – jaký způsob?",
    correctAnswer: "podmiňovací",
    options: ["oznamovací", "rozkazovací", "podmiňovací", "budoucí čas"],
    hints: ["'By' = podmiňovací způsob."],
  },
  {
    question: "Oznamovací způsob konstatuje:",
    correctAnswer: "skutečnosti, fakta",
    options: ["rozkazy a prosby", "podmínky a možnosti", "skutečnosti, fakta", "přání a sny"],
    hints: ["Oznamovací = sdělení toho, co je nebo bylo."],
  },
  {
    question: "'Mohl bych ti pomoci.' – jaký způsob?",
    correctAnswer: "podmiňovací",
    options: ["oznamovací", "rozkazovací", "podmiňovací", "neurčitek"],
    hints: ["Bych = podmiňovací způsob."],
  },
  {
    question: "'Nenech to tady!' – jaký způsob?",
    correctAnswer: "rozkazovací",
    options: ["oznamovací", "rozkazovací", "podmiňovací", "přítomný čas"],
    hints: ["Nenech = rozkaz (záporný)."],
  },
  {
    question: "Přesun z oznamovacího do rozkazovacího: 'Ty jdeš.' → ___",
    correctAnswer: "Jdi!",
    options: ["Jdi!", "Šel bys.", "Jdeš!", "Jde."],
    hints: ["Rozkazovací způsob 2. osoby singuláru = Jdi!"],
  },
  {
    question: "Přesun z oznamovacího do podmiňovacího: 'On přijde.' → ___",
    correctAnswer: "Přišel by.",
    options: ["Přijdi!", "Přišel by.", "Přijde by.", "Přicházel by."],
    hints: ["Podmiňovací = přišel by (příčestí + by)."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Tvoř rozkazovací způsob: 'číst' (ty) →",
    correctAnswer: "čti",
    options: ["čteš", "čti", "čtěte", "čti bys"],
    hints: ["Rozkazovací způsob 2. os. j. č.: čti."],
  },
  {
    question: "Tvoř rozkazovací způsob: 'číst' (vy) →",
    correctAnswer: "čtěte",
    options: ["čtěte", "čtete", "čtěti", "čti"],
    hints: ["Rozkazovací způsob 2. os. mn. č.: čtěte."],
  },
  {
    question: "Tvoř podmiňovací způsob: 'jít' (já) →",
    correctAnswer: "šel/šla bych",
    options: ["jdu", "jdi", "šel/šla bych", "jít bych"],
    hints: ["Podmiňovací = příčestí minulé + bych."],
  },
  {
    question: "Tvoř podmiňovací způsob: 'přijít' (oni) →",
    correctAnswer: "přišli by",
    options: ["přijdou", "přijdete", "přišli by", "přišli bychom"],
    hints: ["Podmiňovací 3. os. mn. č.: příčestí + by."],
  },
  {
    question: "Ve větě 'Přišla bys, kdybych tě pozval?' jaký způsob má 'přišla bys'?",
    correctAnswer: "podmiňovací",
    options: ["oznamovací", "rozkazovací", "podmiňovací", "přací"],
    hints: ["Bys = podmiňovací způsob 2. osoby."],
  },
  {
    question: "Ve větě 'Zavřete okno!' jaký způsob a osoba?",
    correctAnswer: "rozkazovací, 2. osoba množného čísla",
    options: [
      "oznamovací, 3. osoba mn. č.",
      "rozkazovací, 2. osoba množného čísla",
      "podmiňovací, 2. os. mn. č.",
      "rozkazovací, 1. os. mn. č.",
    ],
    hints: ["Zavřete = rozkaz pro 'vy' = 2. os. mn. č."],
  },
  {
    question: "Jak zní 1. os. mn. č. rozkazovacího způsobu slovesa 'jít'?",
    correctAnswer: "pojďme",
    options: ["jdeme", "pojďme", "jděme", "půjdeme"],
    hints: ["Pojďme = vybídnutí skupiny: 'Pojďme!'"],
  },
  {
    question: "Ve větě 'Chodil bych do divadla, kdybych měl čas.' – kolik slov v podmiňovacím způsobu?",
    correctAnswer: "2 – chodil bych, měl bych – ale 'kdybych' obsahuje by",
    options: [
      "1 – jen chodil bych",
      "2 – chodil bych, měl bych – ale 'kdybych' obsahuje by",
      "3",
      "0",
    ],
    hints: ["Kdybych = když + by + ch – obsahuje podmiňovací způsob."],
  },
  {
    question: "Přepiš do podmiňovacího způsobu: 'Přijdu k vám.'",
    correctAnswer: "Přišel/přišla bych k vám.",
    options: [
      "Přijdu bych k vám.",
      "Přišel/přišla bych k vám.",
      "Přijdi k vám.",
      "Přicházel bych k vám.",
    ],
    hints: ["Podmiňovací: příčestí minulé (přišel) + bych."],
  },
  {
    question: "Přepiš do rozkazovacího způsobu (ty): 'Ty spíš.'",
    correctAnswer: "Spi!",
    options: ["Spal!", "Spi!", "Spěj!", "Spíš!"],
    hints: ["Rozkazovací způsob od slovesa 'spát' = spi."],
  },
  {
    question: "Jak se liší 'Jdi!' od 'Jděte!'?",
    correctAnswer: "Jdi = rozkaz pro jednoho (2. os. j. č.), jděte = pro více – 2. os. mn. č.",
    options: [
      "jsou totéž",
      "Jdi = rozkaz pro jednoho (2. os. j. č.), jděte = pro více – 2. os. mn. č.",
      "Jdi je oznamovací",
      "Jděte je podmiňovací",
    ],
    hints: ["Jdi = ty. Jděte = vy."],
  },
  {
    question: "Ve větě 'Kdybychom měli peníze, cestovali bychom.' jaké způsoby použity?",
    correctAnswer: "oba tvary jsou podmiňovací způsob",
    options: [
      "oznamovací + rozkazovací",
      "oba tvary jsou podmiňovací způsob",
      "oznamovací + podmiňovací",
      "rozkazovací + podmiňovací",
    ],
    hints: ["Kdybychom (by) + cestovali bychom (by) = oba podmiňovací."],
  },
  {
    question: "Přepiš do oznamovacího způsobu: 'Šel bych na procházku.'",
    correctAnswer: "Jdu na procházku.",
    options: ["Jdi na procházku!", "Jdu na procházku.", "Šel bych.", "Chodil bych."],
    hints: ["Oznamovací = konstatujeme, co se děje nyní."],
  },
  {
    question: "Jak zní podmiňovací způsob přítomný od slovesa 'být' ve 3. osobě jednotného čísla?",
    correctAnswer: "byl by / byla by / bylo by",
    options: ["je", "byl by / byla by / bylo by", "buď", "bývá by"],
    hints: ["Byl + by = podmiňovací způsob přítomný."],
  },
  {
    question: "Ve větě 'Pokud bys mohl, zavolej mi.' – jaké způsoby jsou použity?",
    correctAnswer: "podmiňovací (bys) + rozkazovací – zavolej",
    options: [
      "oznamovací + oznamovací",
      "podmiňovací (bys) + rozkazovací – zavolej",
      "rozkazovací + oznamovací",
      "podmiňovací + podmiňovací",
    ],
    hints: ["Bys = podmiňovací. Zavolej = rozkazovací."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Ve větě 'Ať přijde, koho chce.' jaký způsob má 'přijde'?",
    correctAnswer: "oznamovací – zde jako přací/neosobní konstrukce s 'ať'",
    options: [
      "rozkazovací",
      "podmiňovací",
      "oznamovací – zde jako přací/neosobní konstrukce s 'ať'",
      "neurčitek",
    ],
    hints: ["'Ať' + oznamovací tvar = přací výraz (přání nebo svolení)."],
  },
  {
    question: "Existuje podmiňovací způsob minulý? Jak by zněl pro 'přijít' (já)?",
    correctAnswer: "ano: byl/byla bych přišel/přišla",
    options: [
      "ne – podmiňovací jen v přítomném čase",
      "ano: byl/byla bych přišel/přišla",
      "ano: přišel bych byl",
      "ne – tvar neexistuje",
    ],
    hints: ["Podmiňovací minulý = byl bych + příčestí minulé (složený tvar)."],
  },
  {
    question: "Ve větě 'Prosím, nepůjdeš se mnou?' jaký způsob je použit?",
    correctAnswer: "oznamovací způsob – otázka s oznamovacím tvarem – zdvořilá prosba",
    options: [
      "rozkazovací",
      "podmiňovací",
      "oznamovací způsob – otázka s oznamovacím tvarem – zdvořilá prosba",
      "neurčitek",
    ],
    hints: ["Zdvořilá prosba může být vyjádřena oznamovacím způsobem v otázce."],
  },
  {
    question: "Rozkazovací způsob nemá:",
    correctAnswer: "1. osobu jednotného čísla – nemohu rozkázat sám sobě formálně",
    options: [
      "2. osobu",
      "množné číslo",
      "1. osobu jednotného čísla – nemohu rozkázat sám sobě formálně",
      "záporné tvary",
    ],
    hints: ["Nemůžeme říct 'Pojdi!' sám sobě – chybí 1. os. j. č."],
  },
  {
    question: "Jak se tvoří záporný rozkazovací způsob?",
    correctAnswer: "ne- + tvar rozkazovacího způsobu – nepiš, nečti, nepij",
    options: [
      "bez- + tvar",
      "ne- + tvar rozkazovacího způsobu – nepiš, nečti, nepij",
      "un- + tvar",
      "neumíme tvořit záporný",
    ],
    hints: ["Piš → nepiš. Čti → nečti. Jdi → nejdi."],
  },
  {
    question: "Ve větě 'Kdybych věděl, šel bych.' jaké jsou podmínky?",
    correctAnswer: "kdybych věděl = podmínka; šel bych = důsledek; oboje podmiňovací způsob",
    options: [
      "jen šel bych je podmínka",
      "kdybych věděl = podmínka; šel bych = důsledek; oboje podmiňovací způsob",
      "kdybych věděl = oznamovací",
      "jen kdybych je podmiňovací",
    ],
    hints: ["Celé souvětí je podmiňovací – podmínka + důsledek."],
  },
  {
    question: "Jak se liší použití podmiňovacího způsobu přítomného a minulého?",
    correctAnswer: "přítomný = podmínka platná nyní/v budoucnu; minulý = podmínka, která nenastala",
    options: [
      "liší se jen délkou věty",
      "přítomný = podmínka platná nyní/v budoucnu; minulý = podmínka, která nenastala",
      "minulý je zdvořilejší",
      "přítomný je vždy s 'bys'",
    ],
    hints: ["Šel bych (teď/pak). Byl bych šel (ale nešel jsem – minulost)."],
  },
  {
    question: "Ve větě 'Mlč!' – jaký slovesný způsob, osoba, číslo?",
    correctAnswer: "rozkazovací způsob, 2. osoba, jednotné číslo",
    options: [
      "oznamovací, 3. os., j. č.",
      "rozkazovací způsob, 2. osoba, jednotné číslo",
      "podmiňovací, 2. os., j. č.",
      "rozkazovací, 3. os., mn. č.",
    ],
    hints: ["Mlč = rozkaz pro 'ty' = 2. os. j. č. rozkazovacího způsobu."],
  },
  {
    question: "Tvoř podmiňovací způsob 2. osoby množného čísla od slovesa 'dělat':",
    correctAnswer: "dělali byste",
    options: ["dělali by", "dělali byste", "dělejte", "dělali bychom"],
    hints: ["2. os. mn. č. podmiňovacího = příčestí + byste."],
  },
  {
    question: "Ve větě 'Nechte ho mluvit!' – jaký způsob?",
    correctAnswer: "rozkazovací způsob",
    options: ["oznamovací", "rozkazovací způsob", "podmiňovací", "neurčitek"],
    hints: ["Nechte = rozkaz pro 'vy' = rozkazovací způsob."],
  },
  {
    question: "Jaký slovesný způsob nevyjadřuje čas (přítomnost/minulost/budoucnost)?",
    correctAnswer: "rozkazovací způsob – vztahuje se k okamžiku příkazu",
    options: [
      "oznamovací",
      "podmiňovací",
      "rozkazovací způsob – vztahuje se k okamžiku příkazu",
      "neurčitek – infinitiv",
    ],
    hints: ["Rozkaz platí 'teď' – nemá gramatické časy jako oznamovací způsob."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SLOVESAZPUSOBOZNAMOVACIROZKAZOVACIPODMINOVACI: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-slovesa-zpusob-oznamovaci-rozkazovaci-podminovaci",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-slovesa-zpusob-oznamovaci-rozkazovaci-podminovaci",
    title: "Slovesa – způsob oznamovací, rozkazovací, podmiňovací",
    studentTitle: "Způsoby sloves",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Poznáš tři způsoby sloves – oznamovací, rozkazovací a podmiňovací.",
    keywords: ["slovesný způsob", "oznamovací", "rozkazovací", "podmiňovací", "slovesa"],
    goals: [
      "Rozlišit oznamovací, rozkazovací a podmiňovací způsob",
      "Tvořit tvary rozkazovacího a podmiňovacího způsobu",
      "Určit způsob slovesa ve větě",
    ],
    boundaries: [
      "Neprobíráme složité historické tvary",
      "Bez přací větné stavby a složeného podmiňovacího podrobně",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Oznamovací = říkám fakta (jdu). Rozkazovací = rozkazuji (jdi!). Podmiňovací = mám podmínku nebo možnost (šel bych).",
      steps: [
        "Přečti větu a najdi sloveso.",
        "Je to fakt nebo konstatování? → oznamovací.",
        "Je to rozkaz nebo prosba? → rozkazovací.",
        "Je tam 'bych/bys/by/bychom/byste'? → podmiňovací.",
      ],
      commonMistake: "Žáci si pletou rozkazovací způsob s oznamovacím. Klíč: rozkaz má jiný tvar ('jdi' vs. 'jdeš').",
      example: "Oznamovací: Jdu domů. Rozkazovací: Jdi domů! Podmiňovací: Šel bych domů.",
    },
  },
];
