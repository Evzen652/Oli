import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string; hints?: string[] }

const POOL_L1: QA[] = [
  { q: "Ke kterému vzoru patří 'výtah'?", a: "hrad", opts: ["hrad", "pán", "muž", "stroj"], e: "Výtah je věc, ne živá bytost, a jeho základ končí tvrdou souhláskou. Neživé slovo s tvrdým základem patří ke vzoru hrad, ne k živým vzorům pán nebo muž." },
  { q: "Ke kterému vzoru patří 'student'?", a: "pán", opts: ["pán", "hrad", "muž", "předseda"], e: "Student je živá bytost a jeho základ končí tvrdou souhláskou -t. Živé slovo s tvrdým základem se skloňuje podle vzoru pán." },
  { q: "Ke kterému vzoru patří 'klíč'?", a: "stroj", opts: ["stroj", "hrad", "muž", "pán"], e: "Klíč je věc a končí měkkou souhláskou -č. Neživé slovo s měkkým základem patří ke vzoru stroj, protože vzor hrad má tvrdý základ." },
  { q: "Ke kterému vzoru patří 'chlapec'?", a: "muž", opts: ["muž", "pán", "soudce", "hrad"], e: "Chlapec je živá bytost a končí měkkou souhláskou -c. Živé slovo s měkkým základem se řídí vzorem muž, kdežto pán má základ tvrdý." },
  { q: "Ke kterému vzoru patří 'táta'?", a: "předseda", opts: ["předseda", "pán", "muž", "soudce"], e: "Táta je rod mužský a v 1. pádě končí na -a. Mužská jména zakončená na -a se skloňují podle vzoru předseda, i když popisují mužskou osobu." },
  { q: "Ke kterému vzoru patří 'průvodce'?", a: "soudce", opts: ["soudce", "muž", "pán", "předseda"], e: "Průvodce je mužská osoba zakončená na -ce. Taková jména se skloňují podle vzoru soudce, který je právě pro zakončení -ce a -dce." },
  { q: "Ke kterému vzoru patří 'stůl'?", a: "hrad", opts: ["hrad", "pán", "stroj", "muž"], e: "Stůl je věc a jeho základ je tvrdý (-l). Neživé slovo s tvrdým základem patří ke vzoru hrad, vzory pán a muž jsou jen pro živé bytosti." },
  { q: "Ke kterému vzoru patří 'lékař'?", a: "muž", opts: ["muž", "hrad", "pán", "soudce"], e: "Lékař je živá osoba a jeho základ končí měkkou souhláskou -ř. Živé slovo s měkkým základem se skloňuje podle vzoru muž — řekneme 'bez lékaře' stejně jako 'bez muže', ne 'bez lékara' jako 'bez pána'." },
  { q: "Ke kterému vzoru patří 'nůž'?", a: "stroj", opts: ["stroj", "muž", "pán", "hrad"], e: "Nůž je věc a končí měkkou souhláskou -ž. Neživé slovo s měkkým základem patří ke vzoru stroj. Že je neživý, poznáš ve 4. pádu: 'vidím nůž' je stejný tvar jako 1. pád, kdežto u živého by bylo 'vidím muže'." },
  { q: "Ke kterému vzoru patří 'kolega'?", a: "předseda", opts: ["předseda", "žena", "muž", "pán"], e: "Kolega je rod mužský, i když končí na -a. Mužská jména na -a se skloňují podle vzoru předseda, nikoli podle žena, který je rodu ženského." },
  { q: "Ke kterému vzoru patří 'vozík'?", a: "hrad", opts: ["hrad", "pán", "muž", "stroj"], e: "Vozík je věc s tvrdým základem -k. Neživé slovo s tvrdým základem patří ke vzoru hrad, vzor stroj by měl základ měkký." },
  { q: "Ke kterému vzoru patří 'kůň'?", a: "muž", opts: ["muž", "pán", "stroj", "hrad"], e: "Kůň je živý a jeho základ končí měkkou souhláskou -ň. Živé slovo s měkkým základem se skloňuje podle vzoru muž — řekneme 'bez koně' stejně jako 'bez muže'." },
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
  { q: "Urči vzor slova 'červi'.", a: "vzor muž", opts: ["vzor muž", "vzor hrad", "vzor pán", "vzor stroj"], e: "Červ je živý a jeho základ končí měkkou souhláskou -v. Živé slovo s měkkým základem se skloňuje podle vzoru muž, ne podle pán s tvrdým základem.", hints: [
    "Je 'červ' živá bytost, nebo věc? A poslední souhláska základu (-v) — zní spíš tvrdě, nebo měkce?",
    "Ze čtyř vzorů vyřaď nejdřív ty pro neživé věci, pak ty s opačnou tvrdostí základu.",
  ] },
  { q: "Urči vzor slova 'pokoj'.", a: "vzor stroj", opts: ["vzor stroj", "vzor hrad", "vzor muž", "vzor pán"], e: "Pokoj je věc a končí měkkou souhláskou -j. Neživé slovo s měkkým základem patří ke vzoru stroj, kdežto hrad by měl základ tvrdý.", hints: [
    "Je 'pokoj' živá bytost, nebo věc? A poslední souhláska základu (-j) — zní spíš tvrdě, nebo měkce?",
    "Ze čtyř vzorů vyřaď nejdřív ty pro živé bytosti, pak ten s opačnou tvrdostí základu.",
  ] },
  { q: "Urči vzor slova 'dům'.", a: "vzor hrad", opts: ["vzor hrad", "vzor pán", "vzor muž", "vzor stroj"], e: "Dům je věc s tvrdým základem. Neživé slovo s tvrdým základem se skloňuje podle vzoru hrad; vzory pán a muž jsou jen pro živé bytosti.", hints: [
    "Je 'dům' živá bytost, nebo věc? A poslední souhláska základu (-m) — zní spíš tvrdě, nebo měkce?",
    "Ze čtyř vzorů vyřaď nejdřív ty pro živé bytosti, pak ten s opačnou tvrdostí základu.",
  ] },
  { q: "Jaký tvar má 'pán' ve 4. pádu jednotného čísla?", a: "pána", opts: ["pána", "pánu", "pánem", "páni"], e: "Čtvrtý pád odpovídá na 'koho, co' — vidím pána. U životného vzoru pán je 4. pád stejný jako 2. pád, tedy s koncovkou -a. Tvar pánu je 3. pád, pánem 7. pád a páni 1. pád množného čísla." },
  { q: "Jaký tvar má 'hrad' ve 4. pádu množného čísla?", a: "hrady", opts: ["hrady", "hradů", "hradům", "hradem"], e: "Čtvrtý pád množného čísla (vidím co — hrady) má u neživého vzoru hrad koncovku -y, stejně jako 1. pád. Tvar hradů je 2. pád mn. č., hradům 3. pád mn. č., hradem 7. pád jednotného čísla." },
  { q: "Urči vzor slova 'nos'.", a: "vzor hrad", opts: ["vzor hrad", "vzor pán", "vzor muž", "vzor stroj"], e: "Nos je věc (část těla) s tvrdým základem -s. Neživé slovo s tvrdým základem patří ke vzoru hrad, ne k živým vzorům pán nebo muž.", hints: [
    "Je 'nos' živá bytost, nebo věc? A poslední souhláska základu (-s) — zní spíš tvrdě, nebo měkce?",
    "Ze čtyř vzorů vyřaď nejdřív ty pro živé bytosti, pak ten s opačnou tvrdostí základu.",
  ] },
  { q: "Jaký tvar má 'stroj' v 6. pádu množného čísla?", a: "strojích", opts: ["strojích", "strojů", "strojím", "strojemi"], e: "Šestý pád odpovídá na 'o kom, o čem' — o strojích. Vzor stroj má v množném čísle koncovku -ích. Tvar strojů je 2. pád a strojím je 3. pád." },
  { q: "Urči vzor slova 'průvodce'.", a: "vzor soudce", opts: ["vzor soudce", "vzor muž", "vzor pán", "vzor předseda"], e: "Průvodce je mužská osoba zakončená na -ce. Pro toto zakončení slouží vzor soudce, ne muž ani předseda, který je pro zakončení na -a.", hints: [
    "Podívej se na poslední dvě písmena slova 'průvodce' — na co přesně slovo končí?",
    "Jeden ze čtyř vzorů je vyhrazený právě pro mužské osoby s tímto konkrétním zakončením, jiný pro zakončení na -a.",
  ] },
  { q: "Jaký tvar má 'předseda' v 1. pádu množného čísla?", a: "předsedové", opts: ["předsedové", "předsedy", "předsedů", "předsedi"], e: "V 1. pádě množného čísla (kdo — ti předsedové) má vzor předseda u osob koncovku -ové. Tvar předsedy je 4. pád a předsedů je 2. pád." },
];

const POOL_L3: QA[] = [
  { q: "Proč patří 'nůž' ke vzoru stroj, a ne ke vzoru muž, když mají oba měkký základ?", a: "nůž je neživý", opts: ["nůž je neživý", "nůž je živý", "nůž má tvrdý základ", "nůž končí na -ce"], e: "Měkký základ mají oba vzory, takže o výběru rozhoduje životnost. Nůž je věc, a proto z dvojice muž/stroj platí neživý stroj. Poznáš to ve 4. pádu: 'vidím nůž' má stejný tvar jako 1. pád, kdežto u životného by bylo 'vidím muže'." },
  { q: "Jaká je shoda přísudku se jmény vzoru 'pán' v množném čísle?", a: "studenti přišli", opts: ["studenti přišli", "studenty přišly", "studenta přišlo", "student přišel"], e: "Vzor pán je životný, a proto se v množném čísle pojí s tvarem přísudku zakončeným na -i: studenti přišli. Koncovka -y (přišly) patří k neživotným nebo ženským jménům." },
  { q: "Jaký tvar má 'hráč' v 2. pádu množného čísla?", a: "hráčů", opts: ["hráčů", "hráče", "hráčí", "hráčích"], e: "Hráč je živé slovo s měkkým základem -č, tedy vzor muž. Ve 2. pádě množného čísla (bez koho — bez hráčů) má vzor muž koncovku -ů. Tvar hráče je 4. pád." },
  { q: "Urči vzor a pád: 'soudci' (jako přímý objekt ve větě 'Děkuji soudci.').", a: "vzor soudce, 3. pád", opts: ["vzor soudce, 3. pád", "vzor muž, 3. pád", "vzor pán, 3. pád", "vzor soudce, 1. pád"], e: "Slovo soudce se skloňuje podle stejnojmenného vzoru. Ve větě 'děkuji soudci' se ptáme komu, čemu — to je 3. pád, ne 1. pád." },
  { q: "Jaký tvar má 'tatínek' v 5. pádu jednotného čísla?", a: "tatínku", opts: ["tatínku", "tatínka", "tatínkovi", "tatínek"], e: "Pátý pád používáme při oslovení (voláme, oslovujeme). U vzoru pán má koncovku -u: Tatínku! Tvar tatínka je 2. nebo 4. pád a tatínek je 1. pád." },
  { q: "Ke kterému vzoru patří 'zelenář'?", a: "muž", opts: ["muž", "hrad", "pán", "soudce"], e: "Zelenář je živá osoba a jeho základ končí měkkou souhláskou -ř. Živá slova s měkkým základem se skloňují podle vzoru muž — 'bez zelenáře' jako 'bez muže'. Ke vzoru pán by patřil jen s tvrdým základem." },
  { q: "Jaký tvar má 'stroj' v 7. pádu množného čísla?", a: "stroji", opts: ["stroji", "strojemi", "strojů", "strojích"], e: "Sedmý pád odpovídá na 'kým, čím' — stroji. Vzor stroj má v množném čísle koncovku -i. Tvar strojů je 2. pád a strojích je 6. pád." },
  { q: "Urči vzor slova 'herec'.", a: "vzor muž", opts: ["vzor muž", "vzor soudce", "vzor předseda", "vzor pán"], e: "Herec je živá osoba a končí měkkou souhláskou -c. Živé slovo s měkkým základem patří ke vzoru muž; vzor soudce by měl zakončení na -ce." },
  { q: "Doplň 1. pád množného čísla: 'Ti ___ se sešli.' (soudce)", a: "soudci", opts: ["soudci", "soudce", "soudců", "soudcem"], e: "V 1. pádě množného čísla (kdo — ti soudci) má vzor soudce koncovku -i; u osob se používá i varianta soudcové. Tvar soudce je jednotné číslo, soudců je 2. pád množného čísla a soudcem 7. pád jednotného." },
  { q: "Urči vzor slova 'průřez'.", a: "vzor hrad", opts: ["vzor hrad", "vzor stroj", "vzor muž", "vzor pán"], e: "Průřez je věc s tvrdým základem -z. Neživé slovo s tvrdým základem patří ke vzoru hrad, vzor stroj by měl základ měkký.", hints: [
    "Je 'průřez' živá bytost, nebo věc? A poslední souhláska základu (-z) — zní spíš tvrdě, nebo měkce?",
    "Ze čtyř vzorů vyřaď nejdřív ty pro živé bytosti, pak ten s opačnou tvrdostí základu.",
  ] },
  { q: "Urči vzor slova 'lesník'.", a: "vzor pán", opts: ["vzor pán", "vzor hrad", "vzor muž", "vzor stroj"], e: "Lesník je živá osoba a končí tvrdou souhláskou -k. Živé slovo s tvrdým základem se skloňuje podle vzoru pán, ne podle neživého hradu.", hints: [
    "Je 'lesník' živá bytost, nebo věc? A poslední souhláska základu (-k) — zní spíš tvrdě, nebo měkce?",
    "Ze čtyř vzorů vyřaď nejdřív ty pro neživé věci, pak ten s opačnou tvrdostí základu.",
  ] },
  { q: "Jaký tvar má 'průvodce' v 6. pádu jednotného čísla?", a: "průvodci", opts: ["průvodci", "průvodce", "průvodcem", "průvodcům"], e: "Průvodce se skloňuje podle vzoru soudce. V 6. pádě (o kom — o průvodci) má koncovku -i. Tvar průvodce je 1., 2. nebo 4. pád, průvodcem je 7. pád j. č., průvodcům 3. pád mn. č." },
  { q: "Jaký tvar má 'pán' v 7. pádu množného čísla?", a: "pány", opts: ["pány", "páni", "pánů", "pánech"], e: "Sedmý pád odpovídá na 'kým, čím' — pány. Vzor pán má v množném čísle koncovku -y. Tvar páni je 1. pád a pánů je 2. pád." },
  { q: "Urči vzor slova 'prodavač'.", a: "vzor muž", opts: ["vzor muž", "vzor pán", "vzor soudce", "vzor hrad"], e: "Prodavač je živá osoba a končí měkkou souhláskou -č. Živé slovo s měkkým základem se skloňuje podle vzoru muž, ne podle pán s tvrdým základem.", hints: [
    "Je 'prodavač' živá bytost, nebo věc? A poslední souhláska základu (-č) — zní spíš tvrdě, nebo měkce?",
    "Slovo nekončí na -ce ani -dce, takže vyřaď i tenhle zvláštní vzor pro mužské osoby.",
  ] },
  { q: "Jaký tvar má 'muž' v 7. pádu jednotného čísla?", a: "mužem", opts: ["mužem", "muži", "mužů", "mužích"], e: "Sedmý pád jednotného čísla (kým, čím — mužem) má u vzoru muž koncovku -em. Tvar muži je 3. nebo 6. pád a mužů je 2. pád množného čísla." },
  { q: "Urči vzor slova 'hajný' (osoba).", a: "adjektivní vzor", opts: ["adjektivní vzor", "vzor pán", "vzor muž", "vzor soudce"], e: "Některá podstatná jména vznikla z přídavných jmen (hajný, vrátný) a skloňují se jako ona: hajného, hajnému. Proto nepatří k běžným vzorům pán nebo muž, ale ke vzoru adjektivnímu." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: hints ?? [
      "Rozhodni nejdřív jednu věc: je to živá bytost, nebo věc?",
      "Pak se podívej, jestli základ končí tvrdou, nebo měkkou souhláskou — a ověř si to 2. pádem: zkus 'bez ___' a všimni si koncovky. Zvláštní pozor si dej na slova zakončená na -a nebo -ce, pro ta platí vlastní vzory.",
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
      commonMistake: "Záměna vzorů pán a muž: nespoléhej na to, že jde o osobu, ale zkus 2. pád — 'bez studenta' = pán, ale 'bez lékaře' i 'bez učitele' = muž",
      example: "hrad: tvrdý neživý (hrady, hradů, hradem); muž: měkký živý (muži, mužů, mužem)",
    },
  },
];
