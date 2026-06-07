import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string }

const POOL_L1: QA[] = [
  { q: "Ke kterému vzoru patří 'výtah'?", a: "hrad (neživý, tvrdý základ)", opts: ["hrad (neživý, tvrdý základ)", "pán", "muž", "stroj"], e: "Výtah je věc, ne živá bytost, a jeho základ končí tvrdou souhláskou. Neživé slovo s tvrdým základem patří ke vzoru hrad, ne k živým vzorům pán nebo muž." },
  { q: "Ke kterému vzoru patří 'student'?", a: "pán (živý, tvrdý základ)", opts: ["pán (živý, tvrdý základ)", "hrad", "muž", "předseda"], e: "Student je živá bytost a jeho základ končí tvrdou souhláskou -t. Živé slovo s tvrdým základem se skloňuje podle vzoru pán." },
  { q: "Ke kterému vzoru patří 'klíč'?", a: "stroj (neživý, měkký základ)", opts: ["stroj (neživý, měkký základ)", "hrad", "muž", "pán"], e: "Klíč je věc a končí měkkou souhláskou -č. Neživé slovo s měkkým základem patří ke vzoru stroj, protože vzor hrad má tvrdý základ." },
  { q: "Ke kterému vzoru patří 'chlapec'?", a: "muž (živý, měkký základ)", opts: ["muž (živý, měkký základ)", "pán", "soudce", "hrad"], e: "Chlapec je živá bytost a končí měkkou souhláskou -c. Živé slovo s měkkým základem se řídí vzorem muž, kdežto pán má základ tvrdý." },
  { q: "Ke kterému vzoru patří 'táta'?", a: "předseda (živý, na -a)", opts: ["předseda (živý, na -a)", "pán", "muž", "soudce"], e: "Táta je rod mužský a v 1. pádě končí na -a. Mužská jména zakončená na -a se skloňují podle vzoru předseda, i když popisují mužskou osobu." },
  { q: "Ke kterému vzoru patří 'průvodce'?", a: "soudce (živý, na -ce)", opts: ["soudce (živý, na -ce)", "muž", "pán", "předseda"], e: "Průvodce je mužská osoba zakončená na -ce. Taková jména se skloňují podle vzoru soudce, který je právě pro zakončení -ce a -dce." },
  { q: "Ke kterému vzoru patří 'stůl'?", a: "hrad (neživý, tvrdý základ)", opts: ["hrad (neživý, tvrdý základ)", "pán", "stroj", "muž"], e: "Stůl je věc a jeho základ je tvrdý (-l). Neživé slovo s tvrdým základem patří ke vzoru hrad, vzory pán a muž jsou jen pro živé bytosti." },
  { q: "Ke kterému vzoru patří 'lékař'?", a: "pán (živý, tvrdý základ)", opts: ["pán (živý, tvrdý základ)", "hrad", "muž", "soudce"], e: "Lékař je živý člověk a souhláska -ř na konci je tvrdá. Živé slovo s tvrdým základem se skloňuje podle vzoru pán, ne podle muž s měkkým základem." },
  { q: "Ke kterému vzoru patří 'nůž'?", a: "muž (živý/neživý, měkký základ)", opts: ["muž (živý/neživý, měkký základ)", "stroj", "pán", "hrad"], e: "Nůž má měkký základ -ž. I když je to věc, řadí se ke vzoru muž, protože toto zakončení patří právě k němu — nestačí, že je neživý, rozhoduje koncovka." },
  { q: "Ke kterému vzoru patří 'kolega'?", a: "předseda (mužský, na -a)", opts: ["předseda (mužský, na -a)", "žena", "muž", "pán"], e: "Kolega je rod mužský, i když končí na -a. Mužská jména na -a se skloňují podle vzoru předseda, nikoli podle žena, který je rodu ženského." },
  { q: "Ke kterému vzoru patří 'vozík'?", a: "hrad (neživý, tvrdý základ)", opts: ["hrad (neživý, tvrdý základ)", "pán", "muž", "stroj"], e: "Vozík je věc s tvrdým základem -k. Neživé slovo s tvrdým základem patří ke vzoru hrad, vzor stroj by měl základ měkký." },
  { q: "Ke kterému vzoru patří 'hajný'?", a: "pán (živý adjektivní skloňování — speciální)", opts: ["pán (živý adjektivní skloňování — speciální)", "muž", "hrad", "stroj"], e: "Hajný je živá osoba, a proto se z nabízených vzorů řadí k pán. Ve skutečnosti se ale skloňuje jako přídavné jméno (hajného, hajnému), což je zvláštní případ." },
  { q: "Co je charakteristické pro vzor 'pán'?", a: "mužský rod, živý, tvrdý základ", opts: ["mužský rod, živý, tvrdý základ", "mužský rod, neživý, tvrdý základ", "mužský rod, živý, měkký základ", "mužský rod, neživý, měkký základ"], e: "Vzor pán spojuje tři znaky: mužský rod, životnost a tvrdý základ. Když je slovo neživé, bylo by to hrad, a kdyby mělo měkký základ, byl by to muž." },
  { q: "Co je charakteristické pro vzor 'hrad'?", a: "mužský rod, neživý, tvrdý základ", opts: ["mužský rod, neživý, tvrdý základ", "mužský rod, živý, tvrdý základ", "mužský rod, živý, měkký základ", "mužský rod, neživý, měkký základ"], e: "Vzor hrad je mužský rod neživý s tvrdým základem. Liší se od vzoru pán právě životností a od vzoru stroj tvrdým základem místo měkkého." },
  { q: "Co je charakteristické pro vzor 'muž'?", a: "mužský rod, živý, měkký základ", opts: ["mužský rod, živý, měkký základ", "mužský rod, neživý, měkký základ", "mužský rod, živý, tvrdý základ", "mužský rod, neživý, tvrdý základ"], e: "Vzor muž je mužský rod životný s měkkým základem. Kdyby byl základ tvrdý, šlo by o pán, a u neživých slov s měkkým základem rozhoduje vzor stroj." },
  { q: "Co je charakteristické pro vzor 'stroj'?", a: "mužský rod, neživý, měkký základ", opts: ["mužský rod, neživý, měkký základ", "mužský rod, živý, měkký základ", "mužský rod, neživý, tvrdý základ", "mužský rod, živý, tvrdý základ"], e: "Vzor stroj je mužský rod neživý s měkkým základem. Od vzoru hrad ho odlišuje měkký základ a od vzoru muž to, že je neživý." },
];

const POOL_L2: QA[] = [
  { q: "Jaký tvar má 'pán' v 2. pádu množného čísla?", a: "pánů", opts: ["pánů", "páni", "pány", "pánech"], e: "Druhý pád množného čísla odpovídá na otázku 'bez koho, čeho' — bez pánů. Vzor pán má v tomto pádě koncovku -ů, proto pánů. Tvar páni je 1. pád a pány je 4. pád." },
  { q: "Jaký tvar má 'hrad' v 1. pádu množného čísla?", a: "hrady", opts: ["hrady", "hradi", "hradové", "hradů"], e: "První pád množného čísla odpovídá na otázku 'kdo, co' — ty hrady. Neživý vzor hrad má koncovku -y. Tvary s -i nebo -ové patří živým jménům." },
  { q: "Jaký tvar má 'muž' v 1. pádu množného čísla?", a: "muži / mužové", opts: ["muži / mužové", "mužů", "muže", "mužem"], e: "V 1. pádě množného čísla (kdo, co — ti muži) má vzor muž koncovku -i, u osob i variantu -ové. Tvar mužů je 2. pád a mužem je 7. pád jednotného čísla." },
  { q: "Jaký tvar má 'stroj' v 2. pádu množného čísla?", a: "strojů", opts: ["strojů", "stroje", "strojí", "strojích"], e: "Druhý pád množného čísla (bez čeho — bez strojů) má u vzoru stroj koncovku -ů. Tvar stroje je 1. nebo 4. pád a strojích je 6. pád." },
  { q: "Jaký tvar má 'předseda' v 3. pádu jednotného čísla?", a: "předsedovi", opts: ["předsedovi", "předsedou", "předsedě", "předsedu"], e: "Třetí pád jednotného čísla odpovídá na 'komu, čemu' — předsedovi. Vzor předseda má v tomto pádě koncovku -ovi. Tvar předsedou je 7. pád a předsedu je 4. pád." },
  { q: "Jaký tvar má 'soudce' v 2. pádu jednotného čísla?", a: "soudce", opts: ["soudce", "soudci", "soudcovi", "soudcům"], e: "Ve 2. pádě jednotného čísla (bez koho — bez soudce) zůstává tvar stejný jako v 1. pádě: soudce. Tvar soudci je 3. nebo 6. pád a soudcovi rovněž 3. pád." },
  { q: "Urči vzor a pád slova 'muži' (jako podmět).", a: "vzor muž, 1. nebo 5. pád", opts: ["vzor muž, 1. nebo 5. pád", "vzor pán, 1. pád", "vzor muž, 3. pád", "vzor pán, 3. pád"], e: "Muž je živé slovo s měkkým základem, tedy vzor muž. Jako podmět (kdo dělá) stojí v 1. pádě, případně v 5. pádě při oslovení. Tvar muži tu není 3. pád." },
  { q: "Urči vzor slova 'červi'.", a: "vzor muž (červ – živý, měkký základ)", opts: ["vzor muž (červ – živý, měkký základ)", "vzor hrad", "vzor pán", "vzor stroj"], e: "Červ je živý a jeho základ končí měkkou souhláskou -v. Živé slovo s měkkým základem se skloňuje podle vzoru muž, ne podle pán s tvrdým základem." },
  { q: "Urči vzor slova 'pokoj'.", a: "vzor stroj (neživý, měkký základ -j)", opts: ["vzor stroj (neživý, měkký základ -j)", "vzor hrad", "vzor muž", "vzor pán"], e: "Pokoj je věc a končí měkkou souhláskou -j. Neživé slovo s měkkým základem patří ke vzoru stroj, kdežto hrad by měl základ tvrdý." },
  { q: "Urči vzor slova 'dům'.", a: "vzor hrad (neživý, tvrdý základ)", opts: ["vzor hrad (neživý, tvrdý základ)", "vzor pán", "vzor muž", "vzor stroj"], e: "Dům je věc s tvrdým základem. Neživé slovo s tvrdým základem se skloňuje podle vzoru hrad; vzory pán a muž jsou jen pro živé bytosti." },
  { q: "Jaký tvar má 'pan' (zkrácené pán) ve 4. pádu? Slovo 'pan' je zkrácenou formou:", a: "pana (4. pád jm. 'pán')", opts: ["pana (4. pád jm. 'pán')", "pána", "pánu", "pánem"], e: "Čtvrtý pád odpovídá na 'koho, co' — vidím pana Nováka. U životných jmen vzoru pán je 4. pád stejný jako 2. pád s koncovkou -a, tedy pana. Tvar pánem je 7. pád." },
  { q: "Jaký tvar má 'hrad' ve 4. pádu množného čísla?", a: "hrady", opts: ["hrady", "hradů", "hradů", "hradem"], e: "Čtvrtý pád množného čísla (vidím co — hrady) má u neživého vzoru hrad koncovku -y, stejně jako 1. pád. Tvar hradem je 7. pád jednotného čísla." },
  { q: "Urči vzor slova 'nos'.", a: "vzor hrad (neživý, tvrdý základ)", opts: ["vzor hrad (neživý, tvrdý základ)", "vzor pán", "vzor muž", "vzor stroj"], e: "Nos je věc (část těla) s tvrdým základem -s. Neživé slovo s tvrdým základem patří ke vzoru hrad, ne k živým vzorům pán nebo muž." },
  { q: "Jaký tvar má 'stroj' v 6. pádu množného čísla?", a: "strojích", opts: ["strojích", "strojů", "strojím", "strojemi"], e: "Šestý pád odpovídá na 'o kom, o čem' — o strojích. Vzor stroj má v množném čísle koncovku -ích. Tvar strojů je 2. pád a strojím je 3. pád." },
  { q: "Urči vzor slova 'průvodce'.", a: "vzor soudce", opts: ["vzor soudce", "vzor muž", "vzor pán", "vzor předseda"], e: "Průvodce je mužská osoba zakončená na -ce. Pro toto zakončení slouží vzor soudce, ne muž ani předseda, který je pro zakončení na -a." },
  { q: "Jaký tvar má 'předseda' v 1. pádu množného čísla?", a: "předsedové", opts: ["předsedové", "předsedy", "předsedů", "předsedi"], e: "V 1. pádě množného čísla (kdo — ti předsedové) má vzor předseda u osob koncovku -ové. Tvar předsedy je 4. pád a předsedů je 2. pád." },
];

const POOL_L3: QA[] = [
  { q: "Proč se 'nůž' skloňuje podle vzoru 'muž' i jako neživý?", a: "měkký základ -ž řadí slovo k vzoru muž i pro neživá", opts: ["měkký základ -ž řadí slovo k vzoru muž i pro neživá", "je živý", "tvrdý základ", "řadí se k vzoru stroj"], e: "U některých slov rozhoduje o vzoru hlavně koncovka, ne jen životnost. Měkká souhláska -ž na konci řadí nůž ke vzoru muž, přestože je to neživá věc — proto neplatí, že by byl živý." },
  { q: "Jaká je shoda přísudku se jmény vzoru 'pán' v množném čísle?", a: "studenti přišli (životná shoda)", opts: ["studenti přišli (životná shoda)", "studenty přišly", "studenta přišlo", "student přišel"], e: "Vzor pán je životný, a proto se v množném čísle pojí s tvarem přísudku zakončeným na -i: studenti přišli. Koncovka -y (přišly) patří k neživotným nebo ženským jménům." },
  { q: "Jaký tvar má 'hráč' v 2. pádu množného čísla?", a: "hráčů", opts: ["hráčů", "hráče", "hráčí", "hráčích"], e: "Hráč je živé slovo s měkkým základem -č, tedy vzor muž. Ve 2. pádě množného čísla (bez koho — bez hráčů) má vzor muž koncovku -ů. Tvar hráče je 4. pád." },
  { q: "Urči vzor a pád: 'soudci' (jako přímý objekt ve větě 'Děkuji soudci.').", a: "vzor soudce, 3. pád", opts: ["vzor soudce, 3. pád", "vzor muž, 3. pád", "vzor pán, 3. pád", "vzor soudce, 1. pád"], e: "Slovo soudce se skloňuje podle stejnojmenného vzoru. Ve větě 'děkuji soudci' se ptáme komu, čemu — to je 3. pád, ne 1. pád." },
  { q: "Jaký tvar má 'tatínek' v 5. pádu jednotného čísla?", a: "tatínku", opts: ["tatínku", "tatínka", "tatínkovi", "tatínek"], e: "Pátý pád používáme při oslovení (voláme, oslovujeme). U vzoru pán má koncovku -u: Tatínku! Tvar tatínka je 2. nebo 4. pád a tatínek je 1. pád." },
  { q: "Ke kterému vzoru patří 'zelenář'?", a: "pán (živý, tvrdý základ)", opts: ["pán (živý, tvrdý základ)", "hrad", "muž", "soudce"], e: "Zelenář je živá osoba (prodavač zeleniny) a souhláska -ř na konci je tvrdá. Živé slovo s tvrdým základem se skloňuje podle vzoru pán." },
  { q: "Jaký tvar má 'stroj' v 7. pádu množného čísla?", a: "stroji", opts: ["stroji", "strojemi", "strojů", "strojích"], e: "Sedmý pád odpovídá na 'kým, čím' — stroji. Vzor stroj má v množném čísle koncovku -i. Tvar strojů je 2. pád a strojích je 6. pád." },
  { q: "Urči vzor slova 'herec'.", a: "vzor muž (živý, měkký základ -c)", opts: ["vzor muž (živý, měkký základ -c)", "vzor soudce", "vzor předseda", "vzor pán"], e: "Herec je živá osoba a končí měkkou souhláskou -c. Živé slovo s měkkým základem patří ke vzoru muž; vzor soudce by měl zakončení na -ce." },
  { q: "Jaký tvar má 'soudce' v 1. pádu množného čísla?", a: "soudci / soudcové", opts: ["soudci / soudcové", "soudce", "soudců", "soudcem"], e: "V 1. pádě množného čísla (kdo — ti soudci) má vzor soudce koncovku -i, u osob i variantu -ové. Tvar soudce je jednotné číslo a soudců je 2. pád." },
  { q: "Urči vzor slova 'průřez'.", a: "vzor hrad (neživý, tvrdý základ)", opts: ["vzor hrad (neživý, tvrdý základ)", "vzor stroj", "vzor muž", "vzor pán"], e: "Průřez je věc s tvrdým základem -z. Neživé slovo s tvrdým základem patří ke vzoru hrad, vzor stroj by měl základ měkký." },
  { q: "Urči vzor slova 'lesník'.", a: "vzor pán (živý, tvrdý základ)", opts: ["vzor pán (živý, tvrdý základ)", "vzor hrad", "vzor muž", "vzor stroj"], e: "Lesník je živá osoba a končí tvrdou souhláskou -k. Živé slovo s tvrdým základem se skloňuje podle vzoru pán, ne podle neživého hradu." },
  { q: "Jaký tvar má 'průvodce' v 6. pádu jednotného čísla?", a: "průvodci", opts: ["průvodci", "průvodce", "průvodcem", "průvodci"], e: "Průvodce se skloňuje podle vzoru soudce. V 6. pádě (o kom — o průvodci) má koncovku -i. Tvar průvodce je 1., 2. nebo 4. pád a průvodcem je 7. pád." },
  { q: "Jaký tvar má 'pán' v 7. pádu množného čísla?", a: "pány", opts: ["pány", "páni", "pánů", "pánech"], e: "Sedmý pád odpovídá na 'kým, čím' — pány. Vzor pán má v množném čísle koncovku -y. Tvar páni je 1. pád a pánů je 2. pád." },
  { q: "Urči vzor slova 'prodavač'.", a: "vzor muž (živý, měkký základ -č)", opts: ["vzor muž (živý, měkký základ -č)", "vzor pán", "vzor soudce", "vzor hrad"], e: "Prodavač je živá osoba a končí měkkou souhláskou -č. Živé slovo s měkkým základem se skloňuje podle vzoru muž, ne podle pán s tvrdým základem." },
  { q: "Jaký tvar má 'muž' v 7. pádu jednotného čísla?", a: "mužem", opts: ["mužem", "muži", "mužů", "mužích"], e: "Sedmý pád jednotného čísla (kým, čím — mužem) má u vzoru muž koncovku -em. Tvar muži je 3. nebo 6. pád a mužů je 2. pád množného čísla." },
  { q: "Urči vzor slova 'hajný' (osoba).", a: "adjektivní vzor (skloňuje se jako přídavné jméno)", opts: ["adjektivní vzor (skloňuje se jako přídavné jméno)", "vzor pán", "vzor muž", "vzor soudce"], e: "Některá podstatná jména vznikla z přídavných jmen (hajný, vrátný) a skloňují se jako ona: hajného, hajnému. Proto nepatří k běžným vzorům pán nebo muž, ale ke vzoru adjektivnímu." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "pán = živý, tvrdý základ; hrad = neživý, tvrdý základ",
      "muž = živý, měkký základ; stroj = neživý, měkký základ",
      "předseda = mužský, na -a; soudce = mužský, na -ce/-dce",
    ],
    explanation: e,
  }));
}

export const VZORYPODSTATNYCHJMENPANHRADMUZSTROJPREDSEDASOUDCE: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-pan-hrad-muz-stroj-predseda-soudce",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-pan-hrad-muz-stroj-predseda-soudce",
    displayName: "Vzory mužského rodu",
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
    recommendedNext: ["g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-zena-ruze-pisen-kost-mesto-more-kure"],
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
