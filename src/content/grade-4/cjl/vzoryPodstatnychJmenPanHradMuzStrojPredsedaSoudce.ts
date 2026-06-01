import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL_L1: QA[] = [
  { q: "Ke kterému vzoru patří 'výtah'?", a: "hrad (neživý, tvrdý základ)", opts: ["hrad (neživý, tvrdý základ)", "pán", "muž", "stroj"] },
  { q: "Ke kterému vzoru patří 'student'?", a: "pán (živý, tvrdý základ)", opts: ["pán (živý, tvrdý základ)", "hrad", "muž", "předseda"] },
  { q: "Ke kterému vzoru patří 'klíč'?", a: "stroj (neživý, měkký základ)", opts: ["stroj (neživý, měkký základ)", "hrad", "muž", "pán"] },
  { q: "Ke kterému vzoru patří 'chlapec'?", a: "muž (živý, měkký základ)", opts: ["muž (živý, měkký základ)", "pán", "soudce", "hrad"] },
  { q: "Ke kterému vzoru patří 'táta'?", a: "předseda (živý, na -a)", opts: ["předseda (živý, na -a)", "pán", "muž", "soudce"] },
  { q: "Ke kterému vzoru patří 'průvodce'?", a: "soudce (živý, na -ce)", opts: ["soudce (živý, na -ce)", "muž", "pán", "předseda"] },
  { q: "Ke kterému vzoru patří 'stůl'?", a: "hrad (neživý, tvrdý základ)", opts: ["hrad (neživý, tvrdý základ)", "pán", "stroj", "muž"] },
  { q: "Ke kterému vzoru patří 'lékař'?", a: "pán (živý, tvrdý základ)", opts: ["pán (živý, tvrdý základ)", "hrad", "muž", "soudce"] },
  { q: "Ke kterému vzoru patří 'nůž'?", a: "muž (živý/neživý, měkký základ)", opts: ["muž (živý/neživý, měkký základ)", "stroj", "pán", "hrad"] },
  { q: "Ke kterému vzoru patří 'kolega'?", a: "předseda (mužský, na -a)", opts: ["předseda (mužský, na -a)", "žena", "muž", "pán"] },
  { q: "Ke kterému vzoru patří 'vozík'?", a: "hrad (neživý, tvrdý základ)", opts: ["hrad (neživý, tvrdý základ)", "pán", "muž", "stroj"] },
  { q: "Ke kterému vzoru patří 'hajný'?", a: "pán (živý adjektivní skloňování — speciální)", opts: ["pán (živý adjektivní skloňování — speciální)", "muž", "hrad", "stroj"] },
  { q: "Co je charakteristické pro vzor 'pán'?", a: "mužský rod, živý, tvrdý základ", opts: ["mužský rod, živý, tvrdý základ", "mužský rod, neživý, tvrdý základ", "mužský rod, živý, měkký základ", "mužský rod, neživý, měkký základ"] },
  { q: "Co je charakteristické pro vzor 'hrad'?", a: "mužský rod, neživý, tvrdý základ", opts: ["mužský rod, neživý, tvrdý základ", "mužský rod, živý, tvrdý základ", "mužský rod, živý, měkký základ", "mužský rod, neživý, měkký základ"] },
  { q: "Co je charakteristické pro vzor 'muž'?", a: "mužský rod, živý, měkký základ", opts: ["mužský rod, živý, měkký základ", "mužský rod, neživý, měkký základ", "mužský rod, živý, tvrdý základ", "mužský rod, neživý, tvrdý základ"] },
  { q: "Co je charakteristické pro vzor 'stroj'?", a: "mužský rod, neživý, měkký základ", opts: ["mužský rod, neživý, měkký základ", "mužský rod, živý, měkký základ", "mužský rod, neživý, tvrdý základ", "mužský rod, živý, tvrdý základ"] },
];

const POOL_L2: QA[] = [
  { q: "Jaký tvar má 'pán' v 2. pádu množného čísla?", a: "pánů", opts: ["pánů", "páni", "pány", "pánech"] },
  { q: "Jaký tvar má 'hrad' v 1. pádu množného čísla?", a: "hrady", opts: ["hrady", "hradi", "hradové", "hradů"] },
  { q: "Jaký tvar má 'muž' v 1. pádu množného čísla?", a: "muži / mužové", opts: ["muži / mužové", "mužů", "muže", "mužem"] },
  { q: "Jaký tvar má 'stroj' v 2. pádu množného čísla?", a: "strojů", opts: ["strojů", "stroje", "strojí", "strojích"] },
  { q: "Jaký tvar má 'předseda' v 3. pádu jednotného čísla?", a: "předsedovi", opts: ["předsedovi", "předsedou", "předsedě", "předsedu"] },
  { q: "Jaký tvar má 'soudce' v 2. pádu jednotného čísla?", a: "soudce", opts: ["soudce", "soudci", "soudcovi", "soudcům"] },
  { q: "Urči vzor a pád slova 'muži' (jako podmět).", a: "vzor muž, 1. nebo 5. pád", opts: ["vzor muž, 1. nebo 5. pád", "vzor pán, 1. pád", "vzor muž, 3. pád", "vzor pán, 3. pád"] },
  { q: "Urči vzor slova 'červi'.", a: "vzor muž (červ – živý, měkký základ)", opts: ["vzor muž (červ – živý, měkký základ)", "vzor hrad", "vzor pán", "vzor stroj"] },
  { q: "Urči vzor slova 'pokoj'.", a: "vzor stroj (neživý, měkký základ -j)", opts: ["vzor stroj (neživý, měkký základ -j)", "vzor hrad", "vzor muž", "vzor pán"] },
  { q: "Urči vzor slova 'dům'.", a: "vzor hrad (neživý, tvrdý základ)", opts: ["vzor hrad (neživý, tvrdý základ)", "vzor pán", "vzor muž", "vzor stroj"] },
  { q: "Jaký tvar má 'pan' (zkrácené pán) ve 4. pádu? Slovo 'pan' je zkrácenou formou:", a: "pana (4. pád jm. 'pán')", opts: ["pana (4. pád jm. 'pán')", "pána", "pánu", "pánem"] },
  { q: "Jaký tvar má 'hrad' ve 4. pádu množného čísla?", a: "hrady", opts: ["hrady", "hradů", "hradů", "hradem"] },
  { q: "Urči vzor slova 'nos'.", a: "vzor hrad (neživý, tvrdý základ)", opts: ["vzor hrad (neživý, tvrdý základ)", "vzor pán", "vzor muž", "vzor stroj"] },
  { q: "Jaký tvar má 'stroj' v 6. pádu množného čísla?", a: "strojích", opts: ["strojích", "strojů", "strojím", "strojemi"] },
  { q: "Urči vzor slova 'průvodce'.", a: "vzor soudce", opts: ["vzor soudce", "vzor muž", "vzor pán", "vzor předseda"] },
  { q: "Jaký tvar má 'předseda' v 1. pádu množného čísla?", a: "předsedové", opts: ["předsedové", "předsedy", "předsedů", "předsedi"] },
];

const POOL_L3: QA[] = [
  { q: "Proč se 'nůž' skloňuje podle vzoru 'muž' i jako neživý?", a: "měkký základ -ž řadí slovo k vzoru muž i pro neživá", opts: ["měkký základ -ž řadí slovo k vzoru muž i pro neživá", "je živý", "tvrdý základ", "řadí se k vzoru stroj"] },
  { q: "Jaká je shoda přísudku se jmény vzoru 'pán' v množném čísle?", a: "studenti přišli (životná shoda)", opts: ["studenti přišli (životná shoda)", "studenty přišly", "studenta přišlo", "student přišel"] },
  { q: "Jaký tvar má 'hráč' v 2. pádu množného čísla?", a: "hráčů", opts: ["hráčů", "hráče", "hráčí", "hráčích"] },
  { q: "Urči vzor a pád: 'soudci' (jako přímý objekt ve větě 'Děkuji soudci.').", a: "vzor soudce, 3. pád", opts: ["vzor soudce, 3. pád", "vzor muž, 3. pád", "vzor pán, 3. pád", "vzor soudce, 1. pád"] },
  { q: "Jaký tvar má 'tatínek' v 5. pádu jednotného čísla?", a: "tatínku", opts: ["tatínku", "tatínka", "tatínkovi", "tatínek"] },
  { q: "Ke kterému vzoru patří 'zelenář'?", a: "pán (živý, tvrdý základ)", opts: ["pán (živý, tvrdý základ)", "hrad", "muž", "soudce"] },
  { q: "Jaký tvar má 'stroj' v 7. pádu množného čísla?", a: "stroji", opts: ["stroji", "strojemi", "strojů", "strojích"] },
  { q: "Urči vzor slova 'herec'.", a: "vzor muž (živý, měkký základ -c)", opts: ["vzor muž (živý, měkký základ -c)", "vzor soudce", "vzor předseda", "vzor pán"] },
  { q: "Jaký tvar má 'soudce' v 1. pádu množného čísla?", a: "soudci / soudcové", opts: ["soudci / soudcové", "soudce", "soudců", "soudcem"] },
  { q: "Urči vzor slova 'průřez'.", a: "vzor hrad (neživý, tvrdý základ)", opts: ["vzor hrad (neživý, tvrdý základ)", "vzor stroj", "vzor muž", "vzor pán"] },
  { q: "Urči vzor slova 'lesník'.", a: "vzor pán (živý, tvrdý základ)", opts: ["vzor pán (živý, tvrdý základ)", "vzor hrad", "vzor muž", "vzor stroj"] },
  { q: "Jaký tvar má 'průvodce' v 6. pádu jednotného čísla?", a: "průvodci", opts: ["průvodci", "průvodce", "průvodcem", "průvodci"] },
  { q: "Jaký tvar má 'pán' v 7. pádu množného čísla?", a: "pány", opts: ["pány", "páni", "pánů", "pánech"] },
  { q: "Urči vzor slova 'prodavač'.", a: "vzor muž (živý, měkký základ -č)", opts: ["vzor muž (živý, měkký základ -č)", "vzor pán", "vzor soudce", "vzor hrad"] },
  { q: "Jaký tvar má 'muž' v 7. pádu jednotného čísla?", a: "mužem", opts: ["mužem", "muži", "mužů", "mužích"] },
  { q: "Urči vzor slova 'hajný' (osoba).", a: "adjektivní vzor (skloňuje se jako přídavné jméno)", opts: ["adjektivní vzor (skloňuje se jako přídavné jméno)", "vzor pán", "vzor muž", "vzor soudce"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "pán = živý, tvrdý základ; hrad = neživý, tvrdý základ",
      "muž = živý, měkký základ; stroj = neživý, měkký základ",
      "předseda = mužský, na -a; soudce = mužský, na -ce/-dce",
    ],
    solutionSteps: [
      "Urči životnost: je to živá bytost? → pán nebo muž",
      "Urči základ: tvrdý → pán/hrad; měkký → muž/stroj",
      "Speciální zakončení: -a → předseda; -ce/-dce → soudce",
    ],
  }));
}

export const VZORYPODSTATNYCHJMENPANHRADMUZSTROJPREDSEDASOUDCE: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-pan-hrad-muz-stroj-predseda-soudce",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-pan-hrad-muz-stroj-predseda-soudce",
    title: "Vzory podstatných jmen - pán, hrad, muž, stroj, předseda, soudce",
    studentTitle: "Vzory mužského rodu",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Poznáš vzory mužského rodu a naučíš se podle nich správně skloňovat.",
    keywords: ["vzor", "pán", "hrad", "muž", "stroj", "předseda", "soudce", "skloňování", "mužský rod"],
    goals: [
      "Přiřadit slovo ke správnému vzoru mužského rodu",
      "Skloňovat podstatná jména mužského rodu",
    ],
    boundaries: ["Bez cizích slov s nestandardním skloňováním", "Bez adjektivního skloňování podst. jmen"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "pán=živý tvrdý, hrad=neživý tvrdý, muž=živý měkký, stroj=neživý měkký, předseda=-a, soudce=-ce",
      steps: [
        "Je to živá bytost? Ano → pán nebo muž; Ne → hrad nebo stroj",
        "Tvrdý základ? → pán / hrad; Měkký základ? → muž / stroj",
        "Zakončení na -a? → předseda; na -ce/-dce? → soudce",
      ],
      commonMistake: "Záměna vzorů pán a muž: student=pán (tvrdý -t), učitel=pán, ale lékař → pán (tvrdý -ř)",
      example: "hrad: tvrdý neživý (hrady, hradů, hradem); muž: měkký živý (muži, mužů, mužem)",
    },
  },
];
