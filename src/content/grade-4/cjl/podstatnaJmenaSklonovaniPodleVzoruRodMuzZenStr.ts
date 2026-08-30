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
  { q: "Urči rod slova 'vlak'.", a: "mužský", opts: ["mužský", "ženský", "střední", "nelze určit"], e: "Rod poznáme dosazením slůvka ten, ta, to. Před slovo vlak se hodí 'ten vlak', proto je rod mužský. 'Ta vlak' ani 'to vlak' bychom neřekli." },
  { q: "Urči rod slova 'kniha'.", a: "ženský", opts: ["ženský", "mužský", "střední", "nelze určit"], e: "Před slovo kniha se hodí 'ta kniha', a 'ta' ukazuje na ženský rod. 'Ten kniha' ani 'to kniha' bychom neřekli." },
  { q: "Urči rod slova 'město'.", a: "střední", opts: ["střední", "mužský", "ženský", "nelze určit"], e: "Před slovo město se hodí 'to město', a 'to' ukazuje na rod střední. Slova zakončená na -o bývají často středního rodu." },
  { q: "Urči rod slova 'pes'.", a: "mužský", opts: ["mužský", "ženský", "střední", "nelze určit"], e: "Řekneme 'ten pes', proto je rod mužský. Pes je navíc živá bytost, takže jde o mužský rod životný." },
  { q: "Urči rod slova 'žena'.", a: "ženský", opts: ["ženský", "mužský", "střední", "nelze určit"], e: "Řekneme 'ta žena', a 'ta' ukazuje na ženský rod. Mnoho slov zakončených na -a je rodu ženského." },
  { q: "Urči rod slova 'okno'.", a: "střední", opts: ["střední", "mužský", "ženský", "nelze určit"], e: "Řekneme 'to okno', a 'to' znamená rod střední. Stejně jako město je i okno zakončené na -o." },
  { q: "Urči rod slova 'stůl'.", a: "mužský", opts: ["mužský", "ženský", "střední", "nelze určit"], e: "Řekneme 'ten stůl', proto je rod mužský. Stůl je věc, takže jde o mužský rod neživotný." },
  { q: "Urči rod slova 'řeka'.", a: "ženský", opts: ["ženský", "mužský", "střední", "nelze určit"], e: "Řekneme 'ta řeka', a 'ta' ukazuje na ženský rod. Koncovka -a tu napovídá ženský rod, podobně jako u slova žena." },
  { q: "Urči rod slova 'kuře'.", a: "střední", opts: ["střední", "mužský", "ženský", "nelze určit"], e: "Řekneme 'to kuře', proto je rod střední. I když je kuře živé mládě, dosazení 'to' jasně ukazuje rod střední." },
  { q: "Urči rod slova 'hrad'.", a: "mužský", opts: ["mužský", "ženský", "střední", "nelze určit"], e: "Řekneme 'ten hrad', proto je rod mužský. Hrad je věc, jde tedy o mužský rod neživotný." },
  { q: "Urči rod slova 'píseň'.", a: "ženský", opts: ["ženský", "mužský", "střední", "nelze určit"], e: "Řekneme 'ta píseň', a 'ta' ukazuje na ženský rod. Pozor — slova zakončená na měkkou souhlásku -ň mohou být i mužská, proto je dobré dosadit ten/ta/to." },
  { q: "Urči rod slova 'moře'.", a: "střední", opts: ["střední", "mužský", "ženský", "nelze určit"], e: "Řekneme 'to moře', proto je rod střední. Koncovka -e tu napovídá rod střední, ne ženský." },
  { q: "Urči rod slova 'muž'.", a: "mužský", opts: ["mužský", "ženský", "střední", "nelze určit"], e: "Řekneme 'ten muž', proto je rod mužský. Muž je živá bytost, jde tedy o mužský rod životný." },
  { q: "Urči rod slova 'kost'.", a: "ženský", opts: ["ženský", "mužský", "střední", "nelze určit"], e: "Řekneme 'ta kost', a 'ta' ukazuje na ženský rod. Slova zakončená na -st bývají často ženská." },
  { q: "Urči rod slova 'stavení'.", a: "střední", opts: ["střední", "mužský", "ženský", "nelze určit"], e: "Řekneme 'to stavení', proto je rod střední. Slova zakončená na -í jsou často rodu středního." },
  { q: "Jak zjistíme rod podstatného jména?", a: "pomocí ukazovacího zájmena", opts: ["zeptáme se kdo, co", "pomocí ukazovacího zájmena", "přečteme si koncovku", "podíváme se do slovníku"], e: "Nejjistější způsob je dosadit před slovo ten, ta, nebo to — co se hodí, ukáže rod. Podle samotné koncovky se nedá vždy spolehnout a otázkou 'kdo/co' zjišťujeme pád, ne rod." },
];

const POOL_L2: QA[] = [
  { q: "Ke kterému vzoru patří slovo 'student'?", a: "vzor pán", opts: ["vzor hrad", "vzor pán", "vzor muž", "vzor předseda"], e: "Student je rod mužský životný a jeho základ končí tvrdou souhláskou -t. Řekneme 'bez studenta' jako 'bez pána', proto vzor pán." },
  { q: "Ke kterému vzoru patří slovo 'les'?", a: "vzor hrad", opts: ["vzor pán", "vzor hrad", "vzor muž", "vzor stroj"], e: "Les je věc, tedy rod mužský neživotný, a základ má tvrdý. Ve 4. pádu zůstává 'vidím les' stejné jako 1. pád — to je znak neživotnosti, proto vzor hrad." },
  { q: "Ke kterému vzoru patří slovo 'škola'?", a: "vzor žena", opts: ["vzor růže", "vzor žena", "vzor píseň", "vzor kost"], e: "Škola je rodu ženského a v 1. pádu končí tvrdým -a, stejně jako vzor žena. Vzor růže má měkké -e." },
  { q: "Ke kterému vzoru patří slovo 'slunce'?", a: "vzor moře", opts: ["vzor město", "vzor moře", "vzor kuře", "vzor stavení"], e: "Slunce je rodu středního a končí měkkým -e, stejně jako vzor moře. Vzor město má tvrdé -o." },
  { q: "Urči rod a vzor slova 'výtah'.", a: "mužský neživý — vzor hrad", opts: ["mužský neživý — vzor hrad", "mužský živý — vzor pán", "ženský — vzor žena", "střední — vzor město"], e: "Řekneme 'ten výtah' (mužský rod) a výtah je věc, ne živá bytost (neživotný), proto vzor hrad. Kdyby šlo o živou bytost, byl by to vzor pán." },
  { q: "Urči rod a vzor slova 'student'.", a: "mužský živý — vzor pán", opts: ["mužský živý — vzor pán", "mužský neživý — vzor hrad", "ženský — vzor žena", "střední — vzor město"], e: "Řekneme 'ten student' (mužský rod) a student je živá osoba (životný) s tvrdým základem, proto vzor pán. Vzor hrad je naopak pro neživé věci." },
  { q: "Urči vzor slova 'pole'.", a: "vzor moře", opts: ["vzor město", "vzor moře", "vzor stavení", "vzor kuře"], e: "Pole je rodu středního a končí měkkým -e, stejně jako vzor moře. Vzor město má tvrdé -o, proto pole patří k moři." },
  { q: "Urči vzor slova 'radost'.", a: "vzor kost", opts: ["vzor žena", "vzor kost", "vzor píseň", "vzor růže"], e: "Radost je rodu ženského a končí na -ost, stejně jako vzor kost. Slova na -ost a -est patří vždy ke kosti, ne k písni." },
  { q: "Urči vzor slova 'pokoj'.", a: "vzor stroj", opts: ["vzor hrad", "vzor stroj", "vzor muž", "vzor pán"], e: "Pokoj je věc a končí měkkou souhláskou -j. Neživotné slovo s měkkým základem patří ke vzoru stroj; vzor hrad má základ tvrdý." },
  { q: "Urči vzor slova 'učitel'.", a: "vzor muž", opts: ["vzor pán", "vzor muž", "vzor stroj", "vzor hrad"], e: "Učitel je rod mužský životný a ve 2. pádu má tvar 'učitele', stejně jako 'muže'. Kdyby patřil k pánovi, byl by tvar 'učitela'." },
  { q: "Urči vzor slova 'ulice'.", a: "vzor růže", opts: ["vzor žena", "vzor růže", "vzor kost", "vzor píseň"], e: "Ulice je rodu ženského a v 1. pádu končí měkkým -e, stejně jako vzor růže. Vzor žena má tvrdé -a." },
  { q: "Urči vzor slova 'kotě'.", a: "vzor kuře", opts: ["vzor moře", "vzor kuře", "vzor město", "vzor stavení"], e: "Kotě je rodu středního a označuje mládě. Mláďata na -e nebo -ě přibírají v dalších pádech vsuvku -et- (kotěte), a proto se skloňují podle vzoru kuře." },
  { q: "Urči vzor slova 'nádraží'.", a: "vzor stavení", opts: ["vzor město", "vzor stavení", "vzor moře", "vzor kuře"], e: "Nádraží je rodu středního a končí na -í. Střední jména zakončená na -í se skloňují podle vzoru stavení." },
  { q: "Urči vzor slova 'kolega'.", a: "vzor předseda", opts: ["vzor pán", "vzor předseda", "vzor žena", "vzor muž"], e: "Kolega je rod mužský, i když končí na -a. Mužská jména na -a se skloňují podle vzoru předseda, ne podle vzoru žena." },
  { q: "Urči vzor slova 'průvodce'.", a: "vzor soudce", opts: ["vzor muž", "vzor soudce", "vzor pán", "vzor předseda"], e: "Průvodce je mužská osoba zakončená na -ce. Pro toto zakončení slouží vzor soudce, ne vzor muž ani předseda." },
  { q: "Urči vzor slova 'báseň'.", a: "vzor píseň", opts: ["vzor žena", "vzor píseň", "vzor kost", "vzor růže"], e: "Báseň je rodu ženského a končí na -ň, stejně jako vzor píseň. Ženská slova na -ost patří naopak ke vzoru kost." },
];

const POOL_L3: QA[] = [
  { q: "Jaký tvar má slovo 'pán' v 2. pádu množného čísla?", a: "pánů", opts: ["pánů", "pána", "páni", "pánům"], e: "Ve 2. pádu (koho, čeho?) množného čísla má vzor pán koncovku -ů: bez pánů. Tvar 'pána' je jednotné číslo a 'pánům' patří do 3. pádu (komu, čemu?)." },
  { q: "Jaký tvar má slovo 'hrad' v 7. pádu jednotného čísla?", a: "hradem", opts: ["hradem", "hradu", "hradě", "hrady"], e: "V 7. pádu (s kým, čím?) jednotného čísla má vzor hrad koncovku -em: s hradem. Tvar 'hradě' patří do 6. pádu a 'hrady' je množné číslo." },
  { q: "Jaký tvar má slovo 'žena' v 3. pádu jednotného čísla?", a: "ženě", opts: ["ženě", "ženy", "ženu", "ženou"], e: "Ve 3. pádu (komu, čemu?) jednotného čísla má vzor žena tvar 'ženě'. Tvar 'ženu' patří do 4. pádu (koho, co?) a 'ženou' do 7. pádu." },
  { q: "Jaký tvar má slovo 'město' v 6. pádu jednotného čísla?", a: "městě / v městě", opts: ["městě / v městě", "městu", "města", "městem"], e: "V 6. pádu (o kom, o čem?) řekneme 'o městě, v městě'. Tvar 'městu' patří do 3. pádu a 'městem' do 7. pádu." },
  { q: "Jaký tvar má slovo 'muž' v 1. pádu množného čísla?", a: "muži / mužové", opts: ["muži / mužové", "mužů", "mužem", "muže"], e: "V 1. pádu (kdo, co?) množného čísla řekneme 'ti muži' (nebo mužové). Tvar 'mužů' je 2. pád množného čísla a 'mužem' je 7. pád jednotného čísla." },
  { q: "Jaký tvar má slovo 'kost' v 7. pádu jednotného čísla?", a: "kostí", opts: ["kostí", "kosti", "kostem", "kostě"], e: "V 7. pádu (s kým, čím?) jednotného čísla má vzor kost dlouhé -í: s kostí. Tvar 'kosti' patří do více pádů (2., 3., 6.), ale 7. pád má právě kostí." },
  { q: "Jaký tvar má slovo 'moře' v 2. pádu množného čísla?", a: "moří", opts: ["moří", "moře", "moři", "mořem"], e: "Ve 2. pádu (koho, čeho?) množného čísla má vzor moře dlouhé -í: bez moří. Tvar 'mořem' je 7. pád jednotného čísla a 'moři' patří jinam." },
  { q: "Jaký tvar má slovo 'kuře' v 2. pádu jednotného čísla?", a: "kuřete", opts: ["kuřete", "kuři", "kuřeti", "kuřetem"], e: "Vzor kuře v dalších pádech přibírá -et-, proto je 2. pád (koho, čeho?) 'bez kuřete'. Tvar 'kuřeti' je 3. pád a 'kuřetem' 7. pád." },
  { q: "Jaký tvar má slovo 'stavení' v 7. pádu jednotného čísla?", a: "stavením", opts: ["stavením", "stavení", "stavenís", "stavenisem"], e: "V 7. pádu (s kým, čím?) má vzor stavení koncovku -m: se stavením. Tvar 'stavení' zůstává stejný ve většině pádů, ale v 7. pádu jednotného čísla přibývá -m." },
  { q: "Jaký tvar má slovo 'předseda' v 5. pádu jednotného čísla?", a: "předsedo", opts: ["předsedo", "předsedou", "předsedu", "předsedovi"], e: "5. pád je oslovení (voláme, oslovujeme) a vzor předseda má koncovku -o: 'předsedo'. Tvar 'předsedu' je 4. pád, 'předsedovi' 3. nebo 6. pád a 'předsedou' 7. pád." },
  { q: "Jaký tvar má slovo 'růže' v 2. pádu množného čísla?", a: "růží", opts: ["růží", "růže", "růžím", "růžích"], e: "Ve 2. pádu (koho, čeho?) množného čísla má vzor růže dlouhé -í: bez růží. Tvar 'růžím' je 3. pád a 'růžích' 6. pád množného čísla." },
  { q: "Jaký tvar má slovo 'píseň' v 7. pádu jednotného čísla?", a: "písní", opts: ["písní", "písni", "písněmi", "písněm"], e: "V 7. pádu (s kým, čím?) jednotného čísla má vzor píseň dlouhé -í: s písní. Tvar 'písněmi' je 7. pád množného čísla a 'písni' patří do jiných pádů." },
  { q: "Urči pád a číslo tvaru 'studentům'.", a: "3. pád množného čísla", opts: ["3. pád množného čísla", "6. pád množného čísla", "3. pád jednotného čísla", "2. pád množného čísla"], e: "Koncovka -ům u vzoru pán patří do 3. pádu (komu, čemu?) množného čísla: dávám studentům. V jednotném čísle by byl tvar 'studentovi'." },
  { q: "Urči pád a číslo tvaru 'hradech'.", a: "6. pád množného čísla", opts: ["6. pád množného čísla", "3. pád množného čísla", "7. pád množného čísla", "4. pád množného čísla"], e: "Koncovka -ech u vzoru hrad patří do 6. pádu (o kom, o čem?) množného čísla: o hradech. Ve 3. pádu by byl tvar 'hradům' a v 7. 'hrady'." },
  { q: "Jaký tvar má slovo 'soudce' v 1. pádu množného čísla?", a: "soudci", opts: ["soudců", "soudci", "soudcům", "soudce"], e: "V 1. pádu (kdo, co?) množného čísla řekneme 'ti soudci' (nebo soudcové). Tvar 'soudců' je 2. pád a 'soudcům' 3. pád množného čísla." },
  { q: "Urči pád a číslo tvaru 'mořích'.", a: "6. pád množného čísla", opts: ["6. pád množného čísla", "7. pád množného čísla", "3. pád množného čísla", "2. pád množného čísla"], e: "Koncovka -ích u vzoru moře patří do 6. pádu (o kom, o čem?) množného čísla: o mořích. V 7. pádu by byl tvar 'moři' a ve 3. 'mořím'." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Zkus před slovo dosadit ten, ta, nebo to.",
      "Které z těch tří ukazovacích zájmen ke slovu sedne, ti prozradí rod. U vzoru pak rozhoduje ještě životnost a zakončení slova.",
      "Pády: 1.kdo/co, 2.koho/čeho, 3.komu/čemu, 4.koho/co, 5.oslovení, 6.o kom/čem, 7.s kým/čím",
    ],
    explanation: e,
  }));
}

export const PODSTATNAJMENASKLONOVANIPODLEVZORURODMUZZENSTR: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-sklonovani-podle-vzoru-rod-muz-zen-str",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-sklonovani-podle-vzoru-rod-muz-zen-str",
    displayName: "Skloňování jmen",
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
    recommendedNext: ["g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-pan-hrad-muz-stroj-predseda-soudce"],
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
