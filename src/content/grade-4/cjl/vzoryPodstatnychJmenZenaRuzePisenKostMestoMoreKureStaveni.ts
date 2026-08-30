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
  { q: "Ke kterému vzoru patří 'teta'?", a: "žena", opts: ["žena", "růže", "píseň", "kost"], e: "Slovo 'teta' je rodu ženského (ta teta) a v 1. pádu končí na tvrdé -a, stejně jako vzor žena. Proto se skloňuje podle vzoru žena, ne podle růže, která končí na měkké -e." },
  { q: "Ke kterému vzoru patří 'ulice'?", a: "růže", opts: ["růže", "žena", "píseň", "kost"], e: "Slovo 'ulice' je rodu ženského a v 1. pádu končí na měkké -e, úplně stejně jako vzor růže. Vzor žena má naopak tvrdé -a, proto sem ulice nepatří." },
  { q: "Ke kterému vzoru patří 'báseň'?", a: "píseň", opts: ["píseň", "žena", "kost", "růže"], e: "Slovo 'báseň' je rodu ženského a končí na souhlásku -ň (na -eň), což je typický znak vzoru píseň. Vzory žena a růže končí na samohlásku, proto sem báseň nepatří." },
  { q: "Ke kterému vzoru patří 'radost'?", a: "kost", opts: ["kost", "žena", "píseň", "růže"], e: "Slovo 'radost' je rodu ženského a končí na -ost, stejně jako vzor kost. Slova zakončená na -ost a -est patří ke vzoru kost, ne k píseň, která končí na -ň." },
  { q: "Ke kterému vzoru patří 'auto'?", a: "město", opts: ["město", "moře", "kuře", "stavení"], e: "Slovo 'auto' je rodu středního (to auto) a v 1. pádu končí na tvrdé -o, stejně jako vzor město. Vzor moře má měkké -e, proto auto patří k městu." },
  { q: "Ke kterému vzoru patří 'pole'?", a: "moře", opts: ["moře", "město", "kuře", "stavení"], e: "Slovo 'pole' je rodu středního a končí na měkké -e, stejně jako vzor moře. Vzor město má tvrdé -o, proto pole patří k moři." },
  { q: "Ke kterému vzoru patří 'kotě'?", a: "kuře", opts: ["kuře", "moře", "město", "stavení"], e: "Slovo 'kotě' je rodu středního a označuje mládě (živé zvíře). Mláďata zakončená na -e/-ě se skloňují podle vzoru kuře, protože v dalších pádech přibírá -et- (kotěte) jako kuře." },
  { q: "Ke kterému vzoru patří 'nádraží'?", a: "stavení", opts: ["stavení", "město", "moře", "kuře"], e: "Slovo 'nádraží' je rodu středního a končí na -í, což je typický znak vzoru stavení. Slova středního rodu zakončená na -í se skloňují právě podle stavení." },
  { q: "Ke kterému vzoru patří 'škola'?", a: "žena", opts: ["žena", "růže", "kost", "píseň"], e: "Slovo 'škola' je rodu ženského a v 1. pádu končí na tvrdé -a, stejně jako vzor žena. Vzor růže má měkké -e, proto škola patří k ženě." },
  { q: "Ke kterému vzoru patří 'skříň'?", a: "píseň", opts: ["píseň", "žena", "kost", "růže"], e: "Slovo 'skříň' je rodu ženského a končí na souhlásku -ň, stejně jako vzor píseň. Ženská slova zakončená na -ň patří ke vzoru píseň, ne ke kost (ta končí na -ost/-est)." },
  { q: "Co je charakteristické pro vzor 'kost'?", a: "ženský rod, -í v 7. pádu j. č.", opts: ["ženský rod, -í v 7. pádu j. č.", "ženský rod, tvrdý základ", "ženský rod, měkký základ", "střední rod"], e: "Vzor kost je ženský a poznáš ho podle toho, že v 7. pádu jednotného čísla má koncovku -í (kostí), ne -ou jako žena. Právě tahle koncovka kost odlišuje od ostatních vzorů." },
  { q: "Ke kterému vzoru patří 'slunce'?", a: "moře", opts: ["moře", "město", "kuře", "stavení"], e: "Slovo 'slunce' je rodu středního a končí na měkké -e, stejně jako vzor moře. Vzor město má tvrdé -o, proto slunce patří k moři." },
  { q: "Ke kterému vzoru patří 'pravítko'?", a: "město", opts: ["město", "moře", "stavení", "kuře"], e: "Slovo 'pravítko' je rodu středního a v 1. pádu končí na tvrdé -o, stejně jako vzor město. Vzor moře má měkké -e, proto pravítko patří k městu." },
  { q: "Ke kterému vzoru patří 'kolíbání'?", a: "stavení", opts: ["stavení", "moře", "město", "kuře"], e: "Slovo 'kolíbání' je rodu středního a končí na -í, což je znak vzoru stavení. Podstatná jména středního rodu na -í (často odvozená od sloves) se skloňují podle stavení." },
  { q: "Ke kterému vzoru patří 'věc'?", a: "kost", opts: ["kost", "žena", "růže", "píseň"], e: "Slovo 'věc' je rodu ženského a v 7. pádu jednotného čísla má koncovku -í (věcí), stejně jako kost (kostí). Tahle koncovka řadí věc ke vzoru kost, ne k růži." },
  { q: "Ke kterému vzoru patří 'židle'?", a: "růže", opts: ["růže", "žena", "kost", "píseň"], e: "Slovo 'židle' je rodu ženského a v 1. pádu končí na měkké -e, stejně jako vzor růže. Vzor žena má tvrdé -a, proto židle patří k růži." },
];

const POOL_L2: QA[] = [
  {
    q: "Jaký tvar má 'žena' v 2. pádu množného čísla?",
    a: "žen",
    opts: ["žen", "ženy", "ženám", "ženách"],
    e: "Ve 2. pádu množného čísla (koho, čeho) ztratí vzor žena koncovku úplně — zbyde holý základ 'žen' (mnoho žen). Tvary jako 'ženám' nebo 'ženách' patří k jiným pádům (3. a 6.).",
    hints: [
      "Tento vzor ve 2. pádu množného čísla ztrácí koncovku úplně — zůstává jen holý základ slova.",
      "Zkus doplnit: 'mnoho ___' — jak by to znělo bez koncovky?",
    ],
  },
  { q: "Jaký tvar má 'růže' v 2. pádu množného čísla?", a: "růží", opts: ["růží", "růže", "růžím", "růžích"], e: "Vzor růže má ve 2. pádu množného čísla koncovku -í (mnoho růží). Tvar 'růžím' patří do 3. pádu a 'růžích' do 6. pádu, proto je správně 'růží'." },
  { q: "Jaký tvar má 'píseň' v 7. pádu jednotného čísla?", a: "písní", opts: ["písní", "písni", "písněmi", "písněm"], e: "V 7. pádu jednotného čísla (s kým, čím) má vzor píseň koncovku -í (s písní). Tvar 'písněmi' je 7. pád množného čísla, proto je u jednotného čísla správně 'písní'." },
  { q: "Jaký tvar má 'kost' v 7. pádu jednotného čísla?", a: "kostí", opts: ["kostí", "kosti", "kostím", "kostem"], e: "Vzor kost má v 7. pádu jednotného čísla koncovku -í (s kostí). Právě tahle koncovka -í odlišuje kost od vzoru žena, který by měl -ou (ženou)." },
  { q: "Jaký tvar má 'město' v 1. pádu množného čísla?", a: "města", opts: ["města", "městu", "měst", "městem"], e: "V 1. pádu množného čísla (ta města) má vzor město koncovku -a. Tvar 'měst' je 2. pád množného čísla, proto je u 1. pádu správně 'města'." },
  { q: "Jaký tvar má 'moře' v 2. pádu množného čísla?", a: "moří", opts: ["moří", "moře", "moři", "mořem"], e: "Vzor moře má ve 2. pádu množného čísla koncovku -í (mnoho moří). Tvar 'moře' je 1. pád a 'mořem' 7. pád jednotného čísla, proto je správně 'moří'." },
  { q: "Jaký tvar má 'kuře' v 2. pádu jednotného čísla?", a: "kuřete", opts: ["kuřete", "kuři", "kuřeti", "kuřetem"], e: "Vzor kuře přibírá v dalších pádech vsuvku -et-, takže ve 2. pádu jednotného čísla zní 'kuřete' (bez kuřete). Tvar 'kuřeti' patří do 3. a 6. pádu, 'kuřetem' do 7. pádu." },
  { q: "Jaký tvar má 'stavení' v 7. pádu jednotného čísla?", a: "stavením", opts: ["stavením", "stavení", "staveními", "staveniším"], e: "V 7. pádu jednotného čísla (s čím) má vzor stavení koncovku -m, tedy 'stavením'. Tvar 'staveními' je 7. pád množného čísla, proto je u jednotného čísla správně 'stavením'." },
  { q: "Urči vzor slova 'stanice'.", a: "růže", opts: ["růže", "žena", "kost", "píseň"], e: "Slovo 'stanice' je rodu ženského a v 1. pádu končí na měkké -e, stejně jako vzor růže. Vzor žena má tvrdé -a, proto stanice patří k růži." },
  { q: "Urči vzor slova 'září' (měsíc).", a: "stavení", opts: ["stavení", "moře", "město", "kuře"], e: "Slovo 'září' je rodu středního a končí na -í, stejně jako vzor stavení. Střední slova zakončená na -í se skloňují podle stavení, ne podle moře (to končí na -e)." },
  { q: "Jaký tvar má 'píseň' v 2. pádu množného čísla?", a: "písní", opts: ["písní", "písně", "písněm", "písních"], e: "Vzor píseň má ve 2. pádu množného čísla koncovku -í (mnoho písní). Tvar 'písní' je shodný s 7. pádem jednotného čísla, ale 'písněm' a 'písních' patří k jiným pádům." },
  { q: "Jaký tvar má 'kost' v 1. pádu množného čísla?", a: "kosti", opts: ["kosti", "kostí", "kost", "kostem"], e: "V 1. pádu množného čísla (ty kosti) má vzor kost koncovku -i. Tvar 'kostí' patří do 2. pádu množného čísla, proto je u 1. pádu správně 'kosti'." },
  { q: "Urči vzor slova 'chodba'.", a: "žena", opts: ["žena", "růže", "kost", "píseň"], e: "Slovo 'chodba' je rodu ženského a v 1. pádu končí na tvrdé -a, stejně jako vzor žena. Vzor růže má měkké -e, proto chodba patří k ženě." },
  {
    q: "Jaký tvar má 'město' v 2. pádu množného čísla?",
    a: "měst",
    opts: ["měst", "městu", "městech", "městům"],
    e: "Ve 2. pádu množného čísla (mnoho měst) ztratí vzor město koncovku úplně a zbyde holý základ 'měst'. Tvar 'městu' je 3. pád jednotného čísla, 'městech' je 6. pád mn. č. a 'městům' 3. pád mn. č.",
    hints: [
      "Tento vzor ve 2. pádu množného čísla taky ztrácí koncovku úplně — zůstává jen holý základ slova.",
      "Zkus doplnit: 'mnoho ___' — jak by to znělo bez koncovky?",
    ],
  },
  { q: "Urči vzor slova 'mládě'.", a: "kuře", opts: ["kuře", "moře", "město", "stavení"], e: "Slovo 'mládě' je rodu středního a označuje mládě (živé). Mláďata zakončená na -ě se skloňují podle vzoru kuře, protože přibírají vsuvku -et- (mláděte) jako kuře." },
  { q: "Jaký tvar má 'stavení' v 1. pádu množného čísla?", a: "stavení", opts: ["stavení", "staveních", "staveními", "stavením"], e: "Vzor stavení má v 1. pádu množného čísla stejný tvar jako v jednotném — 'stavení' se nemění (jedno stavení, dvě stavení). Tvary 'staveních' a 'staveními' patří k jiným pádům." },
];

const POOL_L3: QA[] = [
  { q: "Urči pád a číslo tvaru 'ženách'.", a: "6. pád množného čísla", opts: ["6. pád množného čísla", "3. pád množného čísla", "7. pád množného čísla", "4. pád množného čísla"], e: "Koncovka -ách u vzoru žena patří 6. pádu množného čísla — ptáme se 'o kom, o čem' (o ženách). 3. pád množného čísla by zněl 'ženám' a 7. pád 'ženami'." },
  { q: "Urči pád a číslo tvaru 'písněmi'.", a: "7. pád množného čísla", opts: ["7. pád množného čísla", "6. pád množného čísla", "3. pád množného čísla", "4. pád množného čísla"], e: "Koncovka -ěmi u vzoru píseň patří 7. pádu množného čísla — ptáme se 's kým, s čím' (s písněmi). 6. pád množného čísla by zněl 'písních'." },
  { q: "Urči pád a číslo tvaru 'kuřat'.", a: "2. pád množného čísla", opts: ["2. pád množného čísla", "6. pád množného čísla", "4. pád množného čísla", "1. pád množného čísla"], e: "Tvar 'kuřat' (bez kuřat) je 2. pád množného čísla vzoru kuře — ptáme se 'koho, čeho'. V 1. pádu množného čísla by to znělo 'kuřata'." },
  { q: "Urči pád a číslo tvaru 'mořích'.", a: "6. pád množného čísla", opts: ["6. pád množného čísla", "7. pád množného čísla", "3. pád množného čísla", "2. pád množného čísla"], e: "Koncovka -ích u vzoru moře patří 6. pádu množného čísla — ptáme se 'o čem' (o mořích). 7. pád množného čísla by zněl 'moři' a 3. pád 'mořím'." },
  { q: "Urči vzor slova 'větvička'.", a: "žena", opts: ["žena", "růže", "kost", "píseň"], e: "Slovo 'větvička' je rodu ženského a v 1. pádu končí na tvrdé -a, stejně jako vzor žena. Zdrobnělina se skloňuje podle svého zakončení, takže patří k ženě, ne k růži." },
  { q: "Urči vzor slova 'čtvrť'.", a: "kost", opts: ["kost", "píseň", "žena", "růže"], e: "Slovo 'čtvrť' je rodu ženského a končí na souhlásku, takže přichází v úvahu píseň i kost. Rozhodne 2. pád: říkáme 'do čtvrti' jako 'do kosti', ne 'do čtvrtě' jako 'do písně'. Zakončení tady nestačí, musíš slovo vyskloňovat." },
  { q: "Urči pád a číslo tvaru 'kostech'.", a: "6. pád množného čísla", opts: ["6. pád množného čísla", "3. pád množného čísla", "7. pád množného čísla", "2. pád množného čísla"], e: "Koncovka -ech u vzoru kost patří 6. pádu množného čísla — ptáme se 'o čem' (o kostech). 3. pád množného čísla by zněl 'kostem' a 7. pád 'kostmi'." },
  { q: "Urči pád a číslo tvaru 'růžím'.", a: "3. pád množného čísla", opts: ["3. pád množného čísla", "6. pád množného čísla", "2. pád množného čísla", "7. pád množného čísla"], e: "Koncovka -ím u vzoru růže patří 3. pádu množného čísla — ptáme se 'komu, čemu' (růžím). 6. pád množného čísla by zněl 'růžích' a 2. pád 'růží'." },
  { q: "Jaký tvar má 'kuře' v 7. pádu jednotného čísla?", a: "kuřetem", opts: ["kuřetem", "kuřeti", "kuřete", "kuřat"], e: "V 7. pádu jednotného čísla (s kým, čím) má vzor kuře vsuvku -et- a koncovku -em, tedy 'kuřetem'. Tvar 'kuřeti' patří do 3. a 6. pádu, 'kuřete' je 2. pád j.č., 'kuřat' 2. pád mn. č." },
  { q: "Urči vzor slova 'knihovnictví'.", a: "stavení", opts: ["stavení", "moře", "město", "kuře"], e: "Slovo 'knihovnictví' je rodu středního a končí na -í, stejně jako vzor stavení. Střední slova zakončená na -í se vždy skloňují podle stavení." },
  { q: "Ve kterém pádu jednotného čísla se tvar vzoru 'stavení' odliší od ostatních?", a: "7. pád", opts: ["7. pád", "1. pád", "4. pád", "5. pád"], e: "V jednotném čísle má vzor stavení ve všech pádech stejný tvar 'stavení' — kromě 7. pádu, kde přibírá koncovku -m (se stavením). Právě 7. pád je tedy ten jediný odlišný." },
  { q: "Urči vzor slova 'procházení'.", a: "stavení", opts: ["stavení", "moře", "kuře", "město"], e: "Slovo 'procházení' je rodu středního a končí na -í, stejně jako vzor stavení. Podstatná jména na -í odvozená od sloves se skloňují podle stavení." },
  { q: "Jaký tvar má 'žena' v 7. pádu množného čísla?", a: "ženami", opts: ["ženami", "ženách", "ženám", "žen"], e: "V 7. pádu množného čísla (s kým, čím) má vzor žena koncovku -ami (se ženami). Tvar 'ženách' je 6. pád a 'ženám' 3. pád množného čísla." },
  { q: "Jaký tvar má 'moře' v 6. pádu množného čísla?", a: "mořích", opts: ["mořích", "mořím", "moří", "moři"], e: "V 6. pádu množného čísla (o čem) má vzor moře koncovku -ích (o mořích). Tvar 'mořím' je 3. pád a 'moří' 2. pád množného čísla." },
  { q: "Urči vzor slova 'prsť'.", a: "kost", opts: ["kost", "žena", "píseň", "růže"], e: "Slovo 'prsť' (znamená zem, hlína) je rodu ženského a končí na souhlásku -ť, v 7. pádu má -í (prstí). Tahle koncovka řadí slovo ke vzoru kost, ne k píseň." },
  { q: "Urči pád a číslo tvaru 'kuřeti'.", a: "3. nebo 6. pád jednotného čísla", opts: ["3. nebo 6. pád jednotného čísla", "2. pád jednotného čísla", "7. pád jednotného čísla", "1. pád množného čísla"], e: "Tvar 'kuřeti' má vzor kuře shodný ve 3. i 6. pádu jednotného čísla (dám kuřeti, o kuřeti). 2. pád by zněl 'kuřete' a 7. pád 'kuřetem'." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: hints ?? [
      "Urči nejdřív rod: řekneš před slovem 'ta', nebo 'to'?",
      "Pak se podívej na zakončení slova a zkus ho vyskloňovat — u slov končících na souhlásku i u mláďat rozhodne až tvar, který slovo dostane v dalších pádech.",
    ],
    explanation: e,
  }));
}

export const VZORYPODSTATNYCHJMENZENARUZEPISENKOSTMESTOMOREKURESTAVENI: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-zena-ruze-pisen-kost-mesto-more-kure",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-zena-ruze-pisen-kost-mesto-more-kure",
    displayName: "Vzory žen. a stř. rodu",
    title: "Vzory podstatných jmen - žena, růže, píseň, kost, město, moře, kuře, stavení",
    studentTitle: "Ženské a střední vzory",
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
    recommendedNext: ["g4-cjl-jazykova-vychova-tvaroslovi-slovesa-mluvnicke-kategorie-casovani-v-jednoduchych-casech"],
    generator: gen,
    helpTemplate: {
      hint: "žena=tvrdý žen., růže=měkký žen., píseň=-ň, kost=-í v 7.p., město=tvrdý střed., moře=měkký střed., kuře=živý střed., stavení=-í",
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
