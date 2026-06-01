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
  { q: "Urči rod slova 'vlak'.", a: "mužský", opts: ["mužský", "ženský", "střední", "nelze určit"] },
  { q: "Urči rod slova 'kniha'.", a: "ženský", opts: ["ženský", "mužský", "střední", "nelze určit"] },
  { q: "Urči rod slova 'město'.", a: "střední", opts: ["střední", "mužský", "ženský", "nelze určit"] },
  { q: "Urči rod slova 'pes'.", a: "mužský", opts: ["mužský", "ženský", "střední", "nelze určit"] },
  { q: "Urči rod slova 'žena'.", a: "ženský", opts: ["ženský", "mužský", "střední", "nelze určit"] },
  { q: "Urči rod slova 'okno'.", a: "střední", opts: ["střední", "mužský", "ženský", "nelze určit"] },
  { q: "Urči rod slova 'stůl'.", a: "mužský", opts: ["mužský", "ženský", "střední", "nelze určit"] },
  { q: "Urči rod slova 'řeka'.", a: "ženský", opts: ["ženský", "mužský", "střední", "nelze určit"] },
  { q: "Urči rod slova 'kuře'.", a: "střední", opts: ["střední", "mužský", "ženský", "nelze určit"] },
  { q: "Urči rod slova 'hrad'.", a: "mužský", opts: ["mužský", "ženský", "střední", "nelze určit"] },
  { q: "Urči rod slova 'píseň'.", a: "ženský", opts: ["ženský", "mužský", "střední", "nelze určit"] },
  { q: "Urči rod slova 'moře'.", a: "střední", opts: ["střední", "mužský", "ženský", "nelze určit"] },
  { q: "Urči rod slova 'muž'.", a: "mužský", opts: ["mužský", "ženský", "střední", "nelze určit"] },
  { q: "Urči rod slova 'kost'.", a: "ženský", opts: ["ženský", "mužský", "střední", "nelze určit"] },
  { q: "Urči rod slova 'stavení'.", a: "střední", opts: ["střední", "mužský", "ženský", "nelze určit"] },
  { q: "Jak zjistíme rod podstatného jména?", a: "dosadíme 'ten/ta/to': ten pes, ta žena, to město", opts: ["dosadíme 'ten/ta/to': ten pes, ta žena, to město", "přečteme koncovku", "zeptáme se 'kdo/co'", "podíváme se do slovníku"] },
];

const POOL_L2: QA[] = [
  { q: "Ke kterému vzoru patří slovo 'pán'?", a: "vzor pán (mužský živý, tvrdý základ)", opts: ["vzor pán (mužský živý, tvrdý základ)", "vzor hrad", "vzor muž", "vzor předseda"] },
  { q: "Ke kterému vzoru patří slovo 'hrad'?", a: "vzor hrad (mužský neživý, tvrdý základ)", opts: ["vzor hrad (mužský neživý, tvrdý základ)", "vzor pán", "vzor stroj", "vzor muž"] },
  { q: "Ke kterému vzoru patří slovo 'žena'?", a: "vzor žena (ženský, tvrdý základ)", opts: ["vzor žena (ženský, tvrdý základ)", "vzor růže", "vzor píseň", "vzor kost"] },
  { q: "Ke kterému vzoru patří slovo 'moře'?", a: "vzor moře (střední, měkký základ)", opts: ["vzor moře (střední, měkký základ)", "vzor město", "vzor kuře", "vzor stavení"] },
  { q: "Urči rod a vzor slova 'výtah'.", a: "mužský neživý — vzor hrad", opts: ["mužský neživý — vzor hrad", "mužský živý — vzor pán", "ženský — vzor žena", "střední — vzor město"] },
  { q: "Urči rod a vzor slova 'student'.", a: "mužský živý — vzor pán", opts: ["mužský živý — vzor pán", "mužský neživý — vzor hrad", "ženský — vzor žena", "střední — vzor město"] },
  { q: "Urči vzor slova 'pole'.", a: "vzor moře (střední měkký)", opts: ["vzor moře (střední měkký)", "vzor město", "vzor stavení", "vzor kuře"] },
  { q: "Urči vzor slova 'radost'.", a: "vzor kost (ženský, na -ost)", opts: ["vzor kost (ženský, na -ost)", "vzor žena", "vzor píseň", "vzor růže"] },
  { q: "Urči vzor slova 'stroj'.", a: "vzor stroj (mužský neživý, měkký základ)", opts: ["vzor stroj (mužský neživý, měkký základ)", "vzor hrad", "vzor muž", "vzor pán"] },
  { q: "Urči vzor slova 'muž'.", a: "vzor muž (mužský živý, měkký základ)", opts: ["vzor muž (mužský živý, měkký základ)", "vzor pán", "vzor stroj", "vzor hrad"] },
  { q: "Urči vzor slova 'růže'.", a: "vzor růže (ženský, měkký základ)", opts: ["vzor růže (ženský, měkký základ)", "vzor žena", "vzor kost", "vzor píseň"] },
  { q: "Urči vzor slova 'kuře'.", a: "vzor kuře (střední živý)", opts: ["vzor kuře (střední živý)", "vzor moře", "vzor město", "vzor stavení"] },
  { q: "Urči vzor slova 'stavení'.", a: "vzor stavení (střední, na -í)", opts: ["vzor stavení (střední, na -í)", "vzor město", "vzor moře", "vzor kuře"] },
  { q: "Urči vzor slova 'předseda'.", a: "vzor předseda (mužský živý, na -a)", opts: ["vzor předseda (mužský živý, na -a)", "vzor pán", "vzor žena", "vzor muž"] },
  { q: "Urči vzor slova 'soudce'.", a: "vzor soudce (mužský živý, na -ce/-dce)", opts: ["vzor soudce (mužský živý, na -ce/-dce)", "vzor muž", "vzor pán", "vzor předseda"] },
  { q: "Urči vzor slova 'píseň'.", a: "vzor píseň (ženský, na -eň/-oň/-ň)", opts: ["vzor píseň (ženský, na -eň/-oň/-ň)", "vzor žena", "vzor kost", "vzor růže"] },
];

const POOL_L3: QA[] = [
  { q: "Jaký tvar má slovo 'pán' v 2. pádu množného čísla?", a: "pánů", opts: ["pánů", "pána", "páni", "pánům"] },
  { q: "Jaký tvar má slovo 'hrad' v 7. pádu jednotného čísla?", a: "hradem", opts: ["hradem", "hradu", "hradě", "hrady"] },
  { q: "Jaký tvar má slovo 'žena' v 3. pádu jednotného čísla?", a: "ženě", opts: ["ženě", "ženy", "ženu", "ženou"] },
  { q: "Jaký tvar má slovo 'město' v 6. pádu jednotného čísla?", a: "městě / v městě", opts: ["městě / v městě", "městu", "města", "městem"] },
  { q: "Jaký tvar má slovo 'muž' v 1. pádu množného čísla?", a: "muži / mužové", opts: ["muži / mužové", "mužů", "mužem", "muže"] },
  { q: "Jaký tvar má slovo 'kost' v 7. pádu jednotného čísla?", a: "kostí", opts: ["kostí", "kosti", "kostem", "kostě"] },
  { q: "Jaký tvar má slovo 'moře' v 2. pádu množného čísla?", a: "moří", opts: ["moří", "moře", "moři", "mořem"] },
  { q: "Jaký tvar má slovo 'kuře' v 2. pádu jednotného čísla?", a: "kuřete", opts: ["kuřete", "kuři", "kuřeti", "kuřetem"] },
  { q: "Jaký tvar má slovo 'stavení' v 7. pádu jednotného čísla?", a: "stavením", opts: ["stavením", "stavení", "stavenís", "stavenisem"] },
  { q: "Jaký tvar má slovo 'předseda' v 5. pádu jednotného čísla?", a: "předsedo", opts: ["předsedo", "předsedo!", "předsedu", "předsedovi"] },
  { q: "Jaký tvar má slovo 'růže' v 2. pádu množného čísla?", a: "růží", opts: ["růží", "růže", "růžím", "růžích"] },
  { q: "Jaký tvar má slovo 'píseň' v 7. pádu jednotného čísla?", a: "písní", opts: ["písní", "písni", "písněmi", "písněm"] },
  { q: "Urči pád a číslo tvaru 'studentům'.", a: "3. pád množného čísla", opts: ["3. pád množného čísla", "6. pád množného čísla", "3. pád jednotného čísla", "2. pád množného čísla"] },
  { q: "Urči pád a číslo tvaru 'hradech'.", a: "6. pád množného čísla", opts: ["6. pád množného čísla", "3. pád množného čísla", "7. pád množného čísla", "4. pád množného čísla"] },
  { q: "Jaký tvar má slovo 'soudce' v 1. pádu množného čísla?", a: "soudci / soudcové", opts: ["soudci / soudcové", "soudce", "soudcům", "soudců"] },
  { q: "Urči pád a číslo tvaru 'mořích'.", a: "6. pád množného čísla", opts: ["6. pád množného čísla", "7. pád množného čísla", "3. pád množného čísla", "2. pád množného čísla"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Rod poznáme dosazením: ten (mužský), ta (ženský), to (střední)",
      "Vzor závisí na rodu, životnosti a zakončení slova",
      "Pády: 1.kdo/co, 2.koho/čeho, 3.komu/čemu, 4.koho/co, 5.oslovení, 6.o kom/čem, 7.s kým/čím",
    ],
    solutionSteps: [
      "Urči rod: ten/ta/to.",
      "Urči životnost (u mužského rodu): živá bytost × věc.",
      "Urči základ: tvrdý (d,t,n,r...) nebo měkký (c,j,š,ž...).",
      "Přiřaď vzor.",
    ],
  }));
}

export const PODSTATNAJMENASKLONOVANIPODLEVZORURODMUZZENSTR: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-sklonovani-podle-vzoru-rod-muz-zen-str",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-sklonovani-podle-vzoru-rod-muz-zen-str",
    title: "Podstatná jména - skloňování podle vzorů (rod muž., žen., stř.)",
    studentTitle: "Rody a vzory",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Naučíš se určovat rod podstatných jmen a skloňovat je podle vzorů.",
    keywords: ["rod", "vzor", "skloňování", "podstatné jméno", "mužský", "ženský", "střední", "pád"],
    goals: [
      "Určit rod podstatného jména",
      "Přiřadit slovo ke správnému vzoru",
      "Skloňovat podstatná jména podle vzorů",
    ],
    boundaries: ["Bez přejatých slov s nestandardním skloňováním", "Bez zdrobnělin a hromadných jmen"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Rod: ten=mužský, ta=ženský, to=střední; vzor závisí na zakončení a životnosti",
      steps: [
        "Dosaď ten/ta/to před slovo.",
        "Urči životnost (u mužského): živá bytost × věc.",
        "Urči základ: tvrdý nebo měkký.",
        "Přiřaď vzor.",
      ],
      commonMistake: "Záměna rodu u slov jako 'brána' (ženský) nebo 'auto' (střední)",
      example: "ten vlak (mužský neživý → vzor hrad); ta žena (ženský tvrdý → vzor žena); to město (střední tvrdý → vzor město)",
    },
  },
];
