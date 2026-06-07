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
  { q: "Jaká je předpona ve slově 'nedobrý'?", a: "ne-", opts: ["ne-", "dobr-", "-ý", "žádná"], e: "Předpona stojí na začátku slova před kořenem. Kořen slova je 'dobr-' (jako v 'dobrý') a před ním je 'ne-', které mění význam na opačný. 'Dobr-' je kořen a '-ý' je koncovka, ne předpona." },
  { q: "Jaký je kořen slova 'zahrada'?", a: "zahrad-", opts: ["zahrad-", "za-", "-a", "zahr-"], e: "Kořen je společná část příbuzných slov: zahrad-a, zahrad-ník, zahrad-ní. Ve slově 'zahrada' už 'za-' není předpona, ale patří přímo do kořene. Koncovka je jen '-a'." },
  { q: "Jaká je koncovka slova 'dobré'?", a: "-é", opts: ["-é", "dobr-", "-ý", "-á"], e: "Koncovka je část na konci slova, která se mění při skloňování: dobr-ý, dobr-é, dobr-ou. Tady je to '-é'. 'Dobr-' je kořen a '-ý' ani '-á' v tomto tvaru slova nejsou." },
  { q: "Které slovo má předponu 'pod-'?", a: "podzemní", opts: ["podzemní", "podlaha", "západ", "nadace"], e: "V 'podzemní' poznáme kořen 'zem-' a před ním předponu 'pod-' (něco pod zemí). U 'podlaha' je 'pod-' součástí kořene, 'západ' má předponu 'za-' a 'nadace' žádnou předponu 'pod-' nemá." },
  { q: "Jaká je předpona ve slově 'přijít'?", a: "při-", opts: ["při-", "pro-", "pře-", "pří-"], e: "Předpona 'při-' znamená přiblížení (přijít = dojít až sem). Píše se s krátkým 'i', protože předpona 'pří-' s dlouhým 'í' v češtině neexistuje. 'Pro-' a 'pře-' mají jiný význam." },
  { q: "Jaký je kořen slova 'domácí'?", a: "dom-", opts: ["dom-", "do-", "domác-", "-í"], e: "Kořen je společná část příbuzných slov: dom-ov, dom-ácí, dom-eček. Tou částí je 'dom-'. 'Do-' není kořen, '-í' je koncovka a 'domác-' obsahuje navíc příponu." },
  { q: "Které slovo nemá předponu?", a: "stůl", opts: ["stůl", "přijít", "odejít", "vylézt"], e: "Předpona stojí před kořenem a dá se oddělit. 'Stůl' je celé kořen, nic se před ním oddělit nedá. Naopak při-jít, od-ejít, vy-lézt předponu mají." },
  { q: "Jaká je přípona ve slově 'zahradník'?", a: "-ník", opts: ["-ník", "za-", "zahrad-", "-a"], e: "Přípona stojí za kořenem a tvoří nové slovo. Z kořene 'zahrad-' vznikne příponou '-ník' nové slovo zahradník (člověk, který pracuje na zahradě). 'Zahrad-' je kořen, ne přípona." },
  { q: "Jaký je kořen slova 'přijít'?", a: "-jít", opts: ["-jít", "při-", "pří-", "-í"], e: "Kořen nese hlavní význam — tady je to '-jít' (pohyb), společné se slovy jít, odejít, vyjít. 'Při-' je předpona stojící před kořenem, a 'pří-' s dlouhým 'í' v této předponě neexistuje." },
  { q: "Jaká je předpona ve slově 'vylézat'?", a: "vy-", opts: ["vy-", "vý-", "vz-", "-at"], e: "Předpona 'vy-' vyjadřuje pohyb ven nebo nahoru (vylézat = lézt ven). Píše se krátce, protože jde o předponu před slovesem. 'Vý-' s dlouhým 'ý' bývá u podstatných jmen (výlet), tady nepatří." },
  { q: "Co je předpona?", a: "část slova před kořenem", opts: ["část slova před kořenem", "část slova za kořenem", "základ slova", "změna tvaru"], e: "Předpona je morfém, který stojí před kořenem a často mění význam slova (jít → odejít). Část za kořenem je přípona, základ slova je kořen a změna tvaru je úkol koncovky." },
  { q: "Co je kořen slova?", a: "základní část nesoucí hlavní význam", opts: ["základní část nesoucí hlavní význam", "část před kořenem", "část za kořenem", "koncová část"], e: "Kořen je nejdůležitější část slova, společná všem příbuzným slovům (les, lesník, lesní). Část před ním je předpona, část za ním přípona a koncová část je koncovka." },
  { q: "Jaká je koncovka slova 'pán'?", a: "nulová", opts: ["nulová", "-á", "-ý", "-e"], e: "U 'pán' není na konci žádné slyšitelné písmeno koncovky, ale při skloňování se objeví (pán, pán-a, pán-ovi). Proto říkáme, že koncovka je nulová — existuje, ale nepíše se." },
  { q: "Jaká je koncovka slova 'páni'?", a: "-i", opts: ["-i", "-y", "-é", "-a"], e: "Koncovka se mění podle čísla a pádu: pán (jeden), pán-i (více). U mužských životných jmen má 1. pád množného čísla měkké '-i'. Tvrdé '-y' by tady bylo chybně." },
  { q: "Která slova mají stejný kořen?", a: "voda, vodník, vodopád", opts: ["voda, vodník, vodopád", "voda, vítr, vzduch", "vodník, víla, les", "voda, nuda, soda"], e: "Příbuzná slova mají stejný kořen a souvisí významem: vod-a, vod-ník, vod-opád. 'Voda, nuda, soda' znějí podobně, ale významem nesouvisí, takže kořen společný nemají." },
  { q: "Jaká je přípona ve slově 'učitelka'?", a: "-ka", opts: ["-ka", "-tel-", "u-", "-lka"], e: "Slovo vzniklo postupně: uč- (kořen) + -tel (učitel) + -ka (učitelka, žena). Příponou, která tvoří ženský tvar, je '-ka'. '-tel-' je dřívější přípona a 'u-' není samostatná část." },
];

const POOL_L2: QA[] = [
  { q: "Urči předponu ve slově 'podzemní'.", a: "pod-", opts: ["pod-", "zem-", "-ní", "podz-"], e: "Kořen slova je 'zem-' (souvisí se zemí) a před ním stojí předpona 'pod-' (něco pod zemí). '-ní' je přípona a 'zem-' je kořen, ne předpona." },
  { q: "Urči kořen slova 'zahradník'.", a: "zahrad-", opts: ["zahrad-", "za-", "-ník", "zahr-"], e: "Kořen je společný příbuzným slovům zahrad-a, zahrad-ní, zahrad-ník — tedy 'zahrad-'. '-ník' je přípona, která z kořene vytvořila název člověka, a 'za-' už je součástí kořene." },
  { q: "Jaká je přípona ve slově 'domácí'?", a: "-í (domác-í)", opts: ["-í (domác-í)", "dom-", "domác-", "do-"], e: "Z kořene 'dom-' vzniklo přídavné jméno příponou, na konci je '-í'. 'Dom-' je kořen a 'domác-' obsahuje kořen i přípony dohromady, takže samotná přípona to není." },
  { q: "Které slovo má předponu 'vz-'?", a: "vzlétnout", opts: ["vzlétnout", "výlet", "vylézt", "vzor"], e: "Předpona 'vz-' vyjadřuje pohyb vzhůru (vzlétnout = vznést se nahoru). 'Výlet' a 'vylézt' mají předponu 'vy-' a u 'vzor' je 'vz-' součástí kořene, ne předpona." },
  { q: "Jak se nazývá část slova, která se mění podle pádu nebo osoby?", a: "koncovka", opts: ["koncovka", "přípona", "předpona", "kořen"], e: "Koncovka je část na konci slova, která se mění při skloňování (pán, pán-a) a časování (nes-u, nes-eš). Přípona naopak tvoří nová slova a kořen se nemění." },
  { q: "Urči příponu ve slově 'psaní'.", a: "-í", opts: ["-í", "ps-", "-ání", "psa-"], e: "Kořen je 'ps-' (jako v psát, píše) a podstatné jméno z něj vzniklo příponou '-í' (po 'a': ps-a-ní). 'Ps-' je kořen, takže příponou je samotné '-í'." },
  { q: "Jaký je kořen slova 'přechod'?", a: "-chod-", opts: ["-chod-", "pře-", "-d", "přechod-"], e: "Kořen nese hlavní význam — tady je to '-chod-' (souvisí s chodit, chůze). 'Pře-' je předpona před kořenem, takže do kořene nepatří." },
  { q: "Která slova mají předponu 'ne-'?", a: "nešťastný, nezapomenout", opts: ["nešťastný, nezapomenout", "nemoc, nebe", "nepít, nést", "nehet, nerv"], e: "Předpona 'ne-' jde oddělit a změní význam na opačný: ne-šťastný, ne-zapomenout. U 'nemoc, nebe, nehet, nerv' je 'ne-' součástí kořene a oddělit ho nelze." },
  { q: "Urči kořen slova 'lesník'.", a: "les-", opts: ["les-", "le-", "-ník", "lesn-"], e: "Kořen je společný příbuzným slovům les, les-ní, les-ník — tedy 'les-'. '-ník' je přípona, která vytvořila název člověka, a 'le-' není samostatná část." },
  { q: "Jaká je předpona a kořen ve slově 'odejít'?", a: "od- + -jít", opts: ["od- + -jít", "ode- + -jít", "o- + -dejít", "od + -ejít"], e: "Kořen je '-jít' (pohyb, jako jít) a předpona je 'od-' (pohyb pryč). Vkladné 'e' se sice vyslovuje (odejít), ale samotná předpona zní 'od-', ne 'ode-'." },
  { q: "Které slovo má příponu '-ost'?", a: "radost", opts: ["radost", "radnice", "rádio", "ráno"], e: "Z kořene 'rad-' (jako radovat se) vzniklo příponou '-ost' podstatné jméno radost (vlastnost). 'Radnice' má jinou příponu a 'rádio' i 'ráno' s radostí významem nesouvisí." },
  { q: "Urči příponu ve slově 'hezký'.", a: "-ký", opts: ["-ký", "hez-", "-k-", "hezk-"], e: "Kořen je 'hez-' a přídavné jméno z něj vzniklo zakončením '-ký'. 'Hez-' je kořen, takže příponou (s koncovkou) je část '-ký'." },
  { q: "Jaká je koncovka slova 'krásné' (přídavné jméno)?", a: "-é", opts: ["-é", "krásn-", "-né", "-á"], e: "Koncovka přídavného jména se mění podle rodu a pádu: krásn-ý, krásn-é, krásn-á. V tomto tvaru je to '-é'. 'Krásn-' je kořen, ne koncovka." },
  { q: "Které dvojice slov mají stejný kořen (příbuzná slova)?", a: "pes, psí, pejsek", opts: ["pes, psí, pejsek", "pes, les, ces", "psí, psací, psát", "pes, peso, pesa"], e: "Příbuzná slova souvisí významem a mají společný kořen: pes, ps-í, pej-sek (všechna o psovi). 'Psí, psací, psát' znějí podobně, ale 'psát' je o psaní, ne o psovi." },
  { q: "Urči předponu ve slově 'přestavět'.", a: "pře-", opts: ["pře-", "při-", "pro-", "před-"], e: "Předpona 'pře-' znamená udělat znovu nebo jinak (přestavět = postavit znovu). Píše se s 'ř'. 'Při-' znamená přiblížení a 'pro-' nebo 'před-' mají jiný význam." },
  { q: "Co jsou příbuzná slova?", a: "slova se stejným kořenem", opts: ["slova se stejným kořenem", "slova stejného rodu", "slova stejné délky", "slova začínající stejným písmenem"], e: "Příbuzná slova mají společný kořen a souvisí významem (les, lesník, lesní). Nezáleží na rodu, délce ani na tom, jakým písmenem začínají — slova jako pes a peso příbuzná nejsou." },
];

const POOL_L3: QA[] = [
  { q: "Rozeber slovo 'přestaveníčko' na části: předpona, kořen, přípona, koncovka.", a: "pře- + stav- + -eníčk- + -o", opts: ["pře- + stav- + -eníčk- + -o", "přestav- + -eníčko", "pře- + stavení- + -čko", "přes- + tav- + -eníčko"] , e: "Kořen je 'stav-' (jako stavět), před ním předpona 'pře-' a za ním přípony, které tvoří zdrobnělinu, zakončené koncovkou '-o'. Předpona je 'pře-', ne 'přes-', a kořen 'stav-' nelze rozdělit na 'tav-'." },
  { q: "Jaký je kořen slova 'nejkrásnější'?", a: "krásn-", opts: ["krásn-", "nej-", "-ější", "krásnějš-"], e: "Kořen nese hlavní význam — tady 'krásn-' (jako krása, krásný). 'Nej-' je předpona pro třetí stupeň a '-ější' je přípona stupňování, takže do kořene nepatří." },
  { q: "Urči všechny morfémy ve slově 'zahradníkův'.", a: "za- + hrad- + -ník- + -ův", opts: ["za- + hrad- + -ník- + -ův", "zahrad- + -ník- + -ův", "za- + zahrad- + -ův", "zahradník- + -ův"], e: "Slovo se skládá z předpony 'za-', kořene 'hrad-', přípony '-ník-' (zahradník) a další přípony '-ův' (čí). Kořen je 'hrad-', proto 'zahrad-' není samostatný kořen, ale předpona + kořen." },
  { q: "Která přípona tvoří podstatná jména označující osoby podle povolání?", a: "-ník, -tel, -ář", opts: ["-ník, -tel, -ář", "-ost, -ání, -í", "-ný, -ský, -ový", "-ko, -ce, -dlo"], e: "Přípony '-ník, -tel, -ář' tvoří názvy lidí podle činnosti: zahradník, učitel, lékař. '-ost' tvoří vlastnosti (radost), '-ný, -ský' přídavná jména a '-ko, -dlo' názvy věcí." },
  { q: "Urči, zda slovo 'nebeský' má předponu.", a: "ne- není předpona, slovo patří k 'nebe'", opts: ["ne- není předpona, slovo patří k 'nebe'", "má předponu ne-", "má předponu nebe-", "má předponu n-"], e: "Slovo souvisí s 'nebe', takže 'neb-' je část kořene a nedá se oddělit. Předpona 'ne-' by měnila význam na opačný (jako u nedobrý), ale tady by 'beský' nedávalo smysl." },
  { q: "Jaký je rozdíl mezi příponou a koncovkou?", a: "přípona tvoří nová slova, koncovka mění tvar", opts: ["přípona tvoří nová slova, koncovka mění tvar", "přípona mění tvar, koncovka tvoří nová slova", "obě tvoří nová slova", "obě mění tvar"], e: "Přípona vytvoří z jednoho slova nové (les → lesník), kdežto koncovka jen mění tvar téhož slova při skloňování (pán, pán-a). Proto úlohy přípony a koncovky nelze zaměnit." },
  { q: "Urči kořen ve slovech: voda, vodník, vodopád.", a: "vod-", opts: ["vod-", "voda-", "vodn-", "vo-"], e: "Kořen je společná část všech příbuzných slov — tady 'vod-' (vod-a, vod-ník, vod-opád). '-a' u 'voda' je už koncovka, takže do kořene nepatří." },
  { q: "Které slovo je odvozeno předponou od slova 'jít'?", a: "přijít, odejít, vyjít", opts: ["přijít, odejít, vyjít", "jít, jdeme, půjdu", "jítí, jdoucí, jšedší", "jízdní, jezdec, jezdit"], e: "Odvození předponou znamená přidání předpony před kořen '-jít': při-jít, ode-jít, vy-jít. 'Jdeme, půjdu' jsou jen jiné tvary slovesa jít a 'jezdec' patří k jinému kořeni (jezdit)." },
  { q: "Urči příponu v přídavném jménu 'lesní'.", a: "-ní", opts: ["-ní", "les-", "-í", "lesn-"], e: "Z kořene 'les-' vzniklo přídavné jméno příponou '-ní' (lesní zvíře). 'Les-' je kořen, takže příponou je '-ní', ne samotné '-í'." },
  { q: "Jaká předpona ve slově 'sběratel' znamená 'sbírání dohromady'?", a: "s-", opts: ["s-", "z-", "vy-", "od-"], e: "Předpona 's-' vyjadřuje spojení dohromady (sbírat = dávat na jednu hromadu). Píše se 's', protože znamená 'dohromady'. Předpona 'z-' by znamenala dokončení děje, což sem nepatří." },
  { q: "Urči kořen ve slově 'spisovatel'.", a: "pis-/pís-", opts: ["pis-/pís-", "spis-", "pisa-", "spisovatel-"], e: "Kořen souvisí s psaním — 'pis-/pís-' (jako psát, píše, spis). Před ním je předpona 's-' a za ním přípony, takže 'spis-' obsahuje navíc předponu a kořenem samo o sobě není." },
  { q: "Které slovo má dvě přípony?", a: "zahradníkův (-ník- + -ův)", opts: ["zahradníkův (-ník- + -ův)", "stromek (-ek)", "přechod (-chod)", "nebeský (-ský)"], e: "Ve 'zahradníkův' jsou za kořenem 'hrad-' dvě přípony za sebou: '-ník-' (zahradník) a '-ův' (čí). 'Stromek' i 'nebeský' mají jen jednu příponu a 'přechod' má jen předponu a kořen." },
  { q: "Urči morfologickou stavbu slova 'pohádkový'.", a: "po- + hád- + -k- + -ový + -Ø", opts: ["po- + hád- + -k- + -ový + -Ø", "pohádka- + -ový", "po- + hádka- + ový", "pohádkov- + -ý"], e: "Slovo má předponu 'po-', kořen 'hád-' (souvisí s hádat, vyprávět), přípony '-k-' a '-ový' a v tomto tvaru nulovou koncovku. 'Pohádka-' není kořen, protože obsahuje i předponu a přípony." },
  { q: "Co je to nulová koncovka?", a: "koncovka, která se nepíše, ale existuje (pán, hrad)", opts: ["koncovka, která se nepíše, ale existuje (pán, hrad)", "slovo bez koncovky", "stejná koncovka ve všech pádech", "předpona místo koncovky"], e: "Nulová koncovka znamená, že na konci slova není slyšet žádné písmeno, ale při skloňování se koncovka objeví (pán, pán-a, pán-ovi). Není to tedy slovo bez koncovky, jen koncovka 'neviditelná'." },
  { q: "Urči příponu ve slově 'přátelství'.", a: "-ství", opts: ["-ství", "přátel-", "-í", "přátelstv-"], e: "Z kořene v 'přátel-' vzniklo podstatné jméno příponou '-ství', která vyjadřuje vztah nebo vlastnost (přátelství, mistrovství). Samotné '-í' je jen konec přípony, celá přípona je '-ství'." },
  { q: "Jaký morfém ve slově 'přestoupit' vyjadřuje pohyb přes překážku?", a: "přes-/pře-", opts: ["přes-/pře-", "-stoupit", "-it", "stoup-"], e: "Význam 'přes něco' nese předpona 'pře-' (přestoupit = překročit). Kořen je 'stoup-' (jako stoupat) a '-it' je koncovka neurčitku, takže pohyb přes překážku vyjadřuje právě předpona." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Předpona stojí před kořenem: ne-, pod-, za-, při-, vy-...",
      "Kořen je základní část slova, která nese hlavní význam.",
      "Přípona stojí za kořenem a tvoří nová slova: -ník, -tel, -ost...",
      "Koncovka se mění podle pádu nebo osoby: -a, -e, -u...",
    ],
    explanation: e,
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
