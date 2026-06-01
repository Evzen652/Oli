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
  { q: "Ke kterému vzoru patří 'teta'?", a: "žena (ženský, tvrdý základ)", opts: ["žena (ženský, tvrdý základ)", "růže", "píseň", "kost"] },
  { q: "Ke kterému vzoru patří 'ulice'?", a: "růže (ženský, měkký základ)", opts: ["růže (ženský, měkký základ)", "žena", "píseň", "kost"] },
  { q: "Ke kterému vzoru patří 'báseň'?", a: "píseň (ženský, na -eň/-oň)", opts: ["píseň (ženský, na -eň/-oň)", "žena", "kost", "růže"] },
  { q: "Ke kterému vzoru patří 'radost'?", a: "kost (ženský, na -ost/-est)", opts: ["kost (ženský, na -ost/-est)", "žena", "píseň", "růže"] },
  { q: "Ke kterému vzoru patří 'auto'?", a: "město (střední, tvrdý základ)", opts: ["město (střední, tvrdý základ)", "moře", "kuře", "stavení"] },
  { q: "Ke kterému vzoru patří 'pole'?", a: "moře (střední, měkký základ)", opts: ["moře (střední, měkký základ)", "město", "kuře", "stavení"] },
  { q: "Ke kterému vzoru patří 'kotě'?", a: "kuře (střední, živý, na -e/-ě)", opts: ["kuře (střední, živý, na -e/-ě)", "moře", "město", "stavení"] },
  { q: "Ke kterému vzoru patří 'nádraží'?", a: "stavení (střední, na -í)", opts: ["stavení (střední, na -í)", "město", "moře", "kuře"] },
  { q: "Ke kterému vzoru patří 'škola'?", a: "žena (ženský, tvrdý základ)", opts: ["žena (ženský, tvrdý základ)", "růže", "kost", "píseň"] },
  { q: "Ke kterému vzoru patří 'skříň'?", a: "píseň (ženský, na -ň)", opts: ["píseň (ženský, na -ň)", "žena", "kost", "růže"] },
  { q: "Co je charakteristické pro vzor 'kost'?", a: "ženský rod, na -i v 7. pádu j.č.", opts: ["ženský rod, na -i v 7. pádu j.č.", "ženský rod, tvrdý základ", "ženský rod, měkký základ", "střední rod"] },
  { q: "Ke kterému vzoru patří 'slunce'?", a: "moře (střední, měkký základ)", opts: ["moře (střední, měkký základ)", "město", "kuře", "stavení"] },
  { q: "Ke kterému vzoru patří 'pravítko'?", a: "město (střední, tvrdý základ)", opts: ["město (střední, tvrdý základ)", "moře", "stavení", "kuře"] },
  { q: "Ke kterému vzoru patří 'kolíbání'?", a: "stavení (střední, na -í)", opts: ["stavení (střední, na -í)", "moře", "město", "kuře"] },
  { q: "Ke kterému vzoru patří 'věc'?", a: "kost (ženský, na -c)", opts: ["kost (ženský, na -c)", "žena", "růže", "píseň"] },
  { q: "Ke kterému vzoru patří 'ruže' = 'růže'?", a: "růže (ženský, měkký základ)", opts: ["růže (ženský, měkký základ)", "žena", "kost", "píseň"] },
];

const POOL_L2: QA[] = [
  { q: "Jaký tvar má 'žena' v 2. pádu množného čísla?", a: "žen", opts: ["žen", "ženy", "ženám", "ženách"] },
  { q: "Jaký tvar má 'růže' v 2. pádu množného čísla?", a: "růží", opts: ["růží", "růže", "růžím", "růžích"] },
  { q: "Jaký tvar má 'píseň' v 7. pádu jednotného čísla?", a: "písní", opts: ["písní", "písni", "písněmi", "písněm"] },
  { q: "Jaký tvar má 'kost' v 7. pádu jednotného čísla?", a: "kostí", opts: ["kostí", "kosti", "kostím", "kostem"] },
  { q: "Jaký tvar má 'město' v 1. pádu množného čísla?", a: "města", opts: ["města", "městu", "měst", "městem"] },
  { q: "Jaký tvar má 'moře' v 2. pádu množného čísla?", a: "moří", opts: ["moří", "moře", "moři", "mořem"] },
  { q: "Jaký tvar má 'kuře' v 2. pádu jednotného čísla?", a: "kuřete", opts: ["kuřete", "kuři", "kuřeti", "kuřetem"] },
  { q: "Jaký tvar má 'stavení' v 7. pádu jednotného čísla?", a: "stavením", opts: ["stavením", "stavení", "staveními", "staveniším"] },
  { q: "Urči vzor slova 'stanice'.", a: "růže (ženský, měkký základ)", opts: ["růže (ženský, měkký základ)", "žena", "kost", "píseň"] },
  { q: "Urči vzor slova 'září' (měsíc).", a: "stavení (střední, na -í)", opts: ["stavení (střední, na -í)", "moře", "město", "kuře"] },
  { q: "Jaký tvar má 'píseň' v 2. pádu množného čísla?", a: "písní", opts: ["písní", "písně", "písněm", "písních"] },
  { q: "Jaký tvar má 'kost' v 1. pádu množného čísla?", a: "kosti", opts: ["kosti", "kostí", "kost", "kostem"] },
  { q: "Urči vzor slova 'chodba'.", a: "žena (ženský, tvrdý základ)", opts: ["žena (ženský, tvrdý základ)", "růže", "kost", "píseň"] },
  { q: "Jaký tvar má 'město' v 2. pádu množného čísla?", a: "měst", opts: ["měst", "městu", "měste", "měst"] },
  { q: "Urči vzor slova 'mládě'.", a: "kuře (střední, živý, na -e)", opts: ["kuře (střední, živý, na -e)", "moře", "město", "stavení"] },
  { q: "Jaký tvar má 'stavení' v 1. pádu množného čísla?", a: "stavení (beze změny)", opts: ["stavení (beze změny)", "staveních", "staveními", "stavením"] },
];

const POOL_L3: QA[] = [
  { q: "Urči pád a číslo tvaru 'ženách'.", a: "6. pád množného čísla", opts: ["6. pád množného čísla", "3. pád množného čísla", "7. pád množného čísla", "4. pád množného čísla"] },
  { q: "Urči pád a číslo tvaru 'písněmi'.", a: "7. pád množného čísla", opts: ["7. pád množného čísla", "6. pád množného čísla", "3. pád množného čísla", "4. pád množného čísla"] },
  { q: "Urči pád a číslo tvaru 'kuřat'.", a: "2. pád množného čísla", opts: ["2. pád množného čísla", "6. pád množného čísla", "4. pád množného čísla", "1. pád množného čísla"] },
  { q: "Urči pád a číslo tvaru 'mořích'.", a: "6. pád množného čísla", opts: ["6. pád množného čísla", "7. pád množného čísla", "3. pád množného čísla", "2. pád množného čísla"] },
  { q: "Urči vzor slova 'větvička'.", a: "žena (ženský, tvrdý základ)", opts: ["žena (ženský, tvrdý základ)", "růže", "kost", "píseň"] },
  { q: "Urči vzor slova 'loket'.", a: "kost (ženský, patří k vzoru kost)", opts: ["kost (ženský, patří k vzoru kost)", "žena", "píseň", "růže"] },
  { q: "Urči pád a číslo tvaru 'kostech'.", a: "6. pád množného čísla", opts: ["6. pád množného čísla", "3. pád množného čísla", "7. pád množného čísla", "2. pád množného čísla"] },
  { q: "Urči pád a číslo tvaru 'růžím'.", a: "3. pád množného čísla", opts: ["3. pád množného čísla", "6. pád množného čísla", "2. pád množného čísla", "7. pád množného čísla"] },
  { q: "Jaký tvar má 'kuře' v 7. pádu jednotného čísla?", a: "kuřetem", opts: ["kuřetem", "kuřeti", "kuřetem", "kuřat"] },
  { q: "Urči vzor slova 'knihovnictví'.", a: "stavení (střední, na -í)", opts: ["stavení (střední, na -í)", "moře", "město", "kuře"] },
  { q: "Urči pád a číslo tvaru 'stavení' v každém pádu.", a: "1./4./5. pád j. i mn. čísla — tvar nezmění (stavení)", opts: ["1./4./5. pád j. i mn. čísla — tvar nezmění (stavení)", "vždy jen 1. pád", "vždy jen 4. pád", "jen množné číslo"] },
  { q: "Urči vzor slova 'procházení'.", a: "stavení (střední, na -í)", opts: ["stavení (střední, na -í)", "moře", "kuře", "město"] },
  { q: "Jaký tvar má 'žena' v 7. pádu množného čísla?", a: "ženami", opts: ["ženami", "ženách", "ženám", "žen"] },
  { q: "Jaký tvar má 'moře' v 6. pádu množného čísla?", a: "mořích", opts: ["mořích", "mořím", "moří", "moři"] },
  { q: "Urči vzor slova 'prsť'.", a: "kost (ženský, na -ť)", opts: ["kost (ženský, na -ť)", "žena", "píseň", "růže"] },
  { q: "Urči pád a číslo tvaru 'kuřeti'.", a: "3. nebo 6. pád jednotného čísla", opts: ["3. nebo 6. pád jednotného čísla", "2. pád jednotného čísla", "7. pád jednotného čísla", "1. pád množného čísla"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "žena = ženský tvrdý (-a); růže = ženský měkký (-e/-ě)",
      "píseň = ženský na -eň/-oň/-ň; kost = ženský na -ost/-est/-i",
      "město = střední tvrdý; moře = střední měkký",
      "kuře = střední živý (přípona -at-); stavení = střední na -í",
    ],
    solutionSteps: [
      "Urči rod: ta (ženský), to (střední).",
      "Urči základ: tvrdý nebo měkký.",
      "Urči zakončení ve slovníku tvaru.",
      "Přiřaď vzor.",
    ],
  }));
}

export const VZORYPODSTATNYCHJMENZENARUZEPISENKOSTMESTOMOREKURESTAVENI: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-zena-ruze-pisen-kost-mesto-more-kure",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-zena-ruze-pisen-kost-mesto-more-kure",
    title: "Vzory podstatných jmen - žena, růže, píseň, kost, město, moře, kuře, stavení",
    studentTitle: "Vzory žen. a střed. rodu",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Naučíš se vzory ženského a středního rodu a správně podle nich skloňovat.",
    keywords: ["vzor", "žena", "růže", "píseň", "kost", "město", "moře", "kuře", "stavení", "skloňování"],
    goals: [
      "Přiřadit slovo ke správnému vzoru ženského nebo středního rodu",
      "Skloňovat podstatná jména podle těchto vzorů",
    ],
    boundaries: ["Bez cizích slov", "Bez zdrobnělin s nestandardním skloňováním"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "žena=tvrdý žen., růže=měkký žen., píseň=-ň, kost=-i v 7.p., město=tvrdý střed., moře=měkký střed., kuře=živý střed., stavení=-í",
      steps: [
        "Urči rod: ta → ženský; to → střední.",
        "Ženský: tvrdý základ → žena; měkký základ → růže; -ň → píseň; -ost/-est → kost",
        "Střední: tvrdý základ → město; měkký základ → moře; živý na -e → kuře; -í → stavení",
      ],
      commonMistake: "Záměna vzorů kost a žena: kost má v 7. pádu j.č. -í (kostí), žena má -ou (ženou)",
      example: "žena: ženou (7. pád j.č.); kost: kostí (7. pád j.č.); kuře: kuřete (2. pád j.č.)",
    },
  },
];
