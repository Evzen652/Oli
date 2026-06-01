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
  { q: "Jaká je předpona ve slově 'nedobrý'?", a: "ne-", opts: ["ne-", "dobr-", "-ý", "žádná"] },
  { q: "Jaký je kořen slova 'zahrada'?", a: "zahrad-", opts: ["zahrad-", "za-", "-a", "zahr-"] },
  { q: "Jaká je koncovka slova 'dobré'?", a: "-é", opts: ["-é", "dobr-", "-ý", "-á"] },
  { q: "Které slovo má předponu 'pod-'?", a: "podzemní", opts: ["podzemní", "podlaha", "západ", "nadace"] },
  { q: "Jaká je předpona ve slově 'přijít'?", a: "při-", opts: ["při-", "pro-", "pře-", "pří-"] },
  { q: "Jaký je kořen slova 'domácí'?", a: "dom-", opts: ["dom-", "do-", "domác-", "-í"] },
  { q: "Které slovo nemá předponu?", a: "stůl", opts: ["stůl", "přijít", "odejít", "vylézt"] },
  { q: "Jaká je přípona ve slově 'zahradník'?", a: "-ník", opts: ["-ník", "za-", "zahrad-", "-a"] },
  { q: "Jaký je kořen slova 'přijít'?", a: "-jít", opts: ["-jít", "při-", "pří-", "-í"] },
  { q: "Jaká je předpona ve slově 'vylézat'?", a: "vy-", opts: ["vy-", "vý-", "vz-", "-at"] },
  { q: "Co je předpona?", a: "část slova před kořenem", opts: ["část slova před kořenem", "část slova za kořenem", "základ slova", "změna tvaru"] },
  { q: "Co je kořen slova?", a: "základní část nesoucí hlavní význam", opts: ["základní část nesoucí hlavní význam", "část před kořenem", "část za kořenem", "koncová část"] },
  { q: "Jaká je koncovka slova 'pán'?", a: "nulová", opts: ["nulová", "-á", "-ý", "-e"] },
  { q: "Jaká je koncovka slova 'páni'?", a: "-i", opts: ["-i", "-y", "-é", "-a"] },
  { q: "Která slova mají stejný kořen?", a: "voda, vodník, vodopád", opts: ["voda, vodník, vodopád", "voda, vítr, vzduch", "vodník, víla, les", "voda, nuda, soda"] },
  { q: "Jaká je přípona ve slově 'učitelka'?", a: "-ka", opts: ["-ka", "-tel-", "u-", "-lka"] },
];

const POOL_L2: QA[] = [
  { q: "Urči předponu ve slově 'podzemní'.", a: "pod-", opts: ["pod-", "zem-", "-ní", "podz-"] },
  { q: "Urči kořen slova 'zahradník'.", a: "zahrad-", opts: ["zahrad-", "za-", "-ník", "zahr-"] },
  { q: "Jaká je přípona ve slově 'domácí'?", a: "-í (domác-í)", opts: ["-í (domác-í)", "dom-", "domác-", "do-"] },
  { q: "Které slovo má předponu 'vz-'?", a: "vzlétnout", opts: ["vzlétnout", "výlet", "vylézt", "vzor"] },
  { q: "Jak se nazývá část slova, která se mění podle pádu nebo osoby?", a: "koncovka", opts: ["koncovka", "přípona", "předpona", "kořen"] },
  { q: "Urči příponu ve slově 'psaní'.", a: "-í", opts: ["-í", "ps-", "-ání", "psa-"] },
  { q: "Jaký je kořen slova 'přechod'?", a: "-chod-", opts: ["-chod-", "pře-", "-d", "přechod-"] },
  { q: "Která slova mají předponu 'ne-'?", a: "nešťastný, nezapomenout", opts: ["nešťastný, nezapomenout", "nemoc, nebe", "nepít, nést", "nehet, nerv"] },
  { q: "Urči kořen slova 'lesník'.", a: "les-", opts: ["les-", "le-", "-ník", "lesn-"] },
  { q: "Jaká je předpona a kořen ve slově 'odejít'?", a: "od- + -jít", opts: ["od- + -jít", "ode- + -jít", "o- + -dejít", "od + -ejít"] },
  { q: "Které slovo má příponu '-ost'?", a: "radost", opts: ["radost", "radnice", "rádio", "ráno"] },
  { q: "Urči příponu ve slově 'hezký'.", a: "-ký", opts: ["-ký", "hez-", "-k-", "hezk-"] },
  { q: "Jaká je koncovka slova 'krásné' (přídavné jméno)?", a: "-é", opts: ["-é", "krásn-", "-né", "-á"] },
  { q: "Které dvojice slov mají stejný kořen (příbuzná slova)?", a: "pes, psí, pejsek", opts: ["pes, psí, pejsek", "pes, les, ces", "psí, psací, psát", "pes, peso, pesa"] },
  { q: "Urči předponu ve slově 'přestavět'.", a: "pře-", opts: ["pře-", "při-", "pro-", "před-"] },
  { q: "Co jsou příbuzná slova?", a: "slova se stejným kořenem", opts: ["slova se stejným kořenem", "slova stejného rodu", "slova stejné délky", "slova začínající stejným písmenem"] },
];

const POOL_L3: QA[] = [
  { q: "Rozeber slovo 'přestaveníčko' na části: předpona, kořen, přípona, koncovka.", a: "pře- + stav- + -eníčk- + -o", opts: ["pře- + stav- + -eníčk- + -o", "přestav- + -eníčko", "pře- + stavení- + -čko", "přes- + tav- + -eníčko"] },
  { q: "Jaký je kořen slova 'nejkrásnější'?", a: "krásn-", opts: ["krásn-", "nej-", "-ější", "krásnějš-"] },
  { q: "Urči všechny morfémy ve slově 'zahradníkův'.", a: "za- + hrad- + -ník- + -ův", opts: ["za- + hrad- + -ník- + -ův", "zahrad- + -ník- + -ův", "za- + zahrad- + -ův", "zahradník- + -ův"] },
  { q: "Která přípona tvoří podstatná jména označující osoby podle povolání?", a: "-ník, -tel, -ář", opts: ["-ník, -tel, -ář", "-ost, -ání, -í", "-ný, -ský, -ový", "-ko, -ce, -dlo"] },
  { q: "Urči, zda slovo 'nebeský' má předponu.", a: "ne- není předpona, slovo patří k 'nebe'", opts: ["ne- není předpona, slovo patří k 'nebe'", "má předponu ne-", "má předponu nebe-", "má předponu n-"] },
  { q: "Jaký je rozdíl mezi příponou a koncovkou?", a: "přípona tvoří nová slova, koncovka mění tvar", opts: ["přípona tvoří nová slova, koncovka mění tvar", "přípona mění tvar, koncovka tvoří nová slova", "obě tvoří nová slova", "obě mění tvar"] },
  { q: "Urči kořen ve slovech: voda, vodník, vodopád.", a: "vod-", opts: ["vod-", "voda-", "vodn-", "vo-"] },
  { q: "Které slovo je odvozeno předponou od slova 'jít'?", a: "přijít, odejít, vyjít", opts: ["přijít, odejít, vyjít", "jít, jdeme, půjdu", "jítí, jdoucí, jšedší", "jízdní, jezdec, jezdit"] },
  { q: "Urči příponu v přídavném jménu 'lesní'.", a: "-ní", opts: ["-ní", "les-", "-í", "lesn-"] },
  { q: "Jaká předpona ve slově 'sběratel' znamená 'sbírání dohromady'?", a: "s-", opts: ["s-", "z-", "vy-", "od-"] },
  { q: "Urči kořen ve slově 'spisovatel'.", a: "pis-/pís-", opts: ["pis-/pís-", "spis-", "pisa-", "spisovatel-"] },
  { q: "Které slovo má dvě přípony?", a: "zahradníkův (-ník- + -ův)", opts: ["zahradníkův (-ník- + -ův)", "stromek (-ek)", "přechod (-chod)", "nebeský (-ský)"] },
  { q: "Urči morfologickou stavbu slova 'pohádkový'.", a: "po- + hád- + -k- + -ový + -Ø", opts: ["po- + hád- + -k- + -ový + -Ø", "pohádka- + -ový", "po- + hádka- + ový", "pohádkov- + -ý"] },
  { q: "Co je to nulová koncovka?", a: "koncovka, která se nepíše, ale existuje (pán, hrad)", opts: ["koncovka, která se nepíše, ale existuje (pán, hrad)", "slovo bez koncovky", "stejná koncovka ve všech pádech", "předpona místo koncovky"] },
  { q: "Urči příponu ve slově 'přátelství'.", a: "-ství", opts: ["-ství", "přátel-", "-í", "přátelstv-"] },
  { q: "Jaký morfém ve slově 'přestoupit' vyjadřuje pohyb přes překážku?", a: "přes-/pře-", opts: ["přes-/pře-", "-stoupit", "-it", "stoup-"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Předpona stojí před kořenem: ne-, pod-, za-, při-, vy-...",
      "Kořen je základní část slova, která nese hlavní význam.",
      "Přípona stojí za kořenem a tvoří nová slova: -ník, -tel, -ost...",
      "Koncovka se mění podle pádu nebo osoby: -a, -e, -u...",
    ],
    solutionSteps: [
      "Najdi kořen: základní část s hlavním významem.",
      "Co stojí před kořenem? → předpona",
      "Co stojí za kořenem a tvoří nová slova? → přípona",
      "Co se mění při skloňování nebo časování? → koncovka",
    ],
  }));
}

export const PREDPONAKORENPRIPONAKONCOVKA: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-stavba-slova-predpona-koren-pripona-koncovka",
    rvpNodeId: "g4-cjl-jazykova-vychova-stavba-slova-predpona-koren-pripona-koncovka",
    title: "Předpona, kořen, přípona, koncovka",
    studentTitle: "Stavba slova",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Poznáš, jak se skládá slovo z předpony, kořene, přípony a koncovky.",
    keywords: ["předpona", "kořen", "přípona", "koncovka", "stavba slova", "morfém"],
    goals: [
      "Rozpoznat předponu, kořen, příponu a koncovku ve slovech",
      "Pochopit, jak tyto části mění nebo tvoří nová slova",
    ],
    boundaries: ["Bez pokročilé morfologické analýzy", "Bez cizích slov a přejatých morfémů"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Předpona = před kořenem, kořen = základ, přípona = za kořenem (tvoří slova), koncovka = mění tvar",
      steps: [
        "Najdi základ slova — to je kořen.",
        "Co stojí před kořenem? → předpona",
        "Co stojí za kořenem a tvoří nová slova? → přípona",
        "Co se mění při skloňování? → koncovka",
      ],
      commonMistake: "Záměna přípony a koncovky — přípona tvoří nová slova, koncovka jen mění tvar",
      example: "ne-dobr-ý: ne=předpona, dobr=kořen, ý=koncovka; zahrad-ník-a: zahrad=kořen, ník=přípona, a=koncovka",
    },
  },
];
