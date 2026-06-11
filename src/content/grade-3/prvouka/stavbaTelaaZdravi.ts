import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    type: "match_pairs",
    question: "Spoj orgán s jeho hlavní funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "srdce", right: "přečerpává krev po celém těle" },
      { left: "plíce", right: "vyměňují kyslík za oxid uhličitý" },
      { left: "mozek", right: "řídí celé tělo a myšlení" },
      { left: "žaludek", right: "tráví přijatou potravu" },
    ],
    hints: [
      "Srdce bije celý život — co tím dělá?",
      "Plíce potřebuješ k dýchání.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj část kostry s tím, co chrání.",
    correctAnswer: "match",
    pairs: [
      { left: "lebka", right: "chrání mozek" },
      { left: "žebra", right: "chrání srdce a plíce" },
      { left: "páteř", right: "drží vzpřímený postoj" },
      { left: "kosti ruky", right: "umožňují uchopení předmětů" },
    ],
    hints: [
      "Lebka je tvrdá schránka v hlavě — co je uvnitř?",
      "Žebra tvoří klec kolem hrudi.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj zdravotní návyk s tím, proč ho děláme.",
    correctAnswer: "match",
    pairs: [
      { left: "mytí rukou", right: "odstraňuje bakterie a zabraňuje nemocem" },
      { left: "čištění zubů", right: "chrání zuby před kazem" },
      { left: "pohyb 60 min denně", right: "posiluje svaly a srdce" },
      { left: "spánek 9–11 hodin", right: "tělo odpočívá a roste" },
    ],
    hints: [
      "Ruce se dotýkají spousty věcí — co na nich zůstává?",
      "Bez dostatku spánku bys byl unavený a nesoustředěný.",
    ],
  },
  {
    question: "K čemu slouží kostra?",
    correctAnswer: "Dává tělu tvar, chrání vnitřní orgány a umožňuje pohyb",
    options: [
      "Dává tělu tvar, chrání vnitřní orgány a umožňuje pohyb",
      "Přepravuje krev po celém těle",
      "Tráví potravu a vstřebává živiny",
      "Řídí myšlení a pohyby těla",
    ],
    hints: [
      "Co by se stalo s tvým tělem, kdybys neměl žádné kosti?",
      "Kostra je jako stavebnice — co drží pohromadě?",
    ],
    explanation:
      "Kostra plní tři hlavní úkoly: dává tělu pevný tvar a oporu, chrání měkké orgány uvnitř (mozek, srdce, plíce) a spolu se svaly umožňuje pohyb.",
  },
  {
    question: "Co chrání lebka?",
    correctAnswer: "Mozek",
    options: ["Mozek", "Srdce", "Plíce", "Žaludek"],
    hints: [
      "Lebka je tvrdá kost v hlavě.",
      "Co je uvnitř tvé hlavy?",
    ],
    explanation:
      "Lebka je pevná kostěná schránka, která obklopuje a chrání mozek před nárazy a poraněním.",
  },
  {
    question: "Co chrání žebra?",
    correctAnswer: "Srdce a plíce",
    options: ["Srdce a plíce", "Mozek", "Žaludek a střeva", "Páteř"],
    hints: [
      "Žebra tvoří klec kolem hrudi — co je tam uvnitř?",
      "V hrudi máš dva velmi důležité orgány.",
    ],
    explanation:
      "Žebra tvoří kostěnou klec v oblasti hrudi. Tato klec chrání srdce a plíce před nárazy a poraněním.",
  },
  {
    question: "K čemu slouží svaly?",
    correctAnswer: "Umožňují pohyb — stahují se a uvolňují, tím hýbou kostmi",
    options: [
      "Umožňují pohyb — stahují se a uvolňují, tím hýbou kostmi",
      "Chrání mozek a míchu před poraněním",
      "Přenášejí kyslík z plic do celého těla",
      "Tráví potravu v žaludku",
    ],
    hints: [
      "Co cítíš v ruce, když zvedáš těžké věci?",
      "Svaly jsou přirostlé ke kostem — jak asi fungují?",
    ],
    explanation:
      "Svaly jsou přirostlé ke kostem prostřednictvím šlach. Když se sval stáhne, přiblíží kosti k sobě a tím vznikne pohyb. Když se uvolní, kost se vrátí zpět.",
  },
  {
    question: "Co dělá srdce?",
    correctAnswer: "Přečerpává krev a posílá ji do celého těla",
    options: [
      "Přečerpává krev a posílá ji do celého těla",
      "Čistí krev od škodlivých látek",
      "Vyrábí nové krvinky",
      "Řídí dýchání a tep",
    ],
    hints: [
      "Polož ruku na hrudník — co cítíš?",
      "Srdce je jako pumpa — co pumpuje?",
    ],
    explanation:
      "Srdce je sval, který pracuje celý život jako pumpa. Stahuje se a uvolňuje a tím přečerpává krev do všech částí těla, kam dopravuje kyslík a živiny.",
  },
  {
    question: "Co se děje v plicích?",
    correctAnswer: "Přijímají kyslík ze vzduchu a odevzdávají oxid uhličitý",
    options: [
      "Přijímají kyslík ze vzduchu a odevzdávají oxid uhličitý",
      "Filtrují krev a tvoří moč",
      "Rozkládají potravu na živiny",
      "Vyrábějí hormony pro růst těla",
    ],
    hints: [
      "Co dýcháš dovnitř a co vydechuješ ven?",
      "Plíce jsou jako vzduchový filtr.",
    ],
    explanation:
      "Při každém nádechu plíce přijmou vzduch bohatý na kyslík. Kyslík přechází do krve, která ho rozveze po těle. Zpět do plic přichází oxid uhličitý, který vydechneme.",
  },
  {
    question: "Co dělá mozek?",
    correctAnswer: "Řídí celé tělo, myšlení, pohyby i smysly",
    options: [
      "Řídí celé tělo, myšlení, pohyby i smysly",
      "Vyrábí krev pro srdce",
      "Tráví potravu a vstřebává vitamíny",
      "Čistí krev od odpadních látek",
    ],
    hints: [
      "Mozek je v hlavě — proč ho tak dobře chráníme?",
      "Co se stane, když udeříš hlavou a zatmí se ti před očima?",
    ],
    explanation:
      "Mozek je velitelské centrum celého těla. Zpracovává informace ze smyslů, řídí pohyby, myšlení, paměť a emoce. Bez mozku by tělo nemohlo fungovat.",
  },
  {
    question: "Co dělají ledviny?",
    correctAnswer: "Čistí krev a tvoří moč, kterou se z těla odstraňují odpadní látky",
    options: [
      "Čistí krev a tvoří moč, kterou se z těla odstraňují odpadní látky",
      "Vyrábějí trávicí šťávy pro žaludek",
      "Přenášejí kyslík do svalů",
      "Regulují tep srdce",
    ],
    hints: [
      "Ledviny jsou jako filtr — co filtrují?",
      "Moč vzniká v ledvinách — z čeho?",
    ],
    explanation:
      "Ledviny filtrují krev a odstraňují z ní odpadní látky, které by tělu škodily. Z těchto odpadních látek a přebytečné vody vzniká moč, která odchází z těla.",
  },
  {
    question: "Kolik hodin spánku denně potřebuje dítě ve věku 8–9 let?",
    correctAnswer: "9 až 11 hodin",
    options: ["9 až 11 hodin", "6 až 7 hodin", "12 až 14 hodin", "4 až 5 hodin"],
    hints: [
      "Dospělý potřebuje méně spánku než dítě — proč asi?",
      "Tělo a mozek během spánku rostou a odpočívají.",
    ],
    explanation:
      "Děti ve věku 8–9 let potřebují 9 až 11 hodin spánku. Během spánku tělo roste, mozek zpracovává nové informace a imunitní systém se posiluje.",
  },
  {
    question: "Jak dlouho by se děti měly každý den hýbat?",
    correctAnswer: "Alespoň 60 minut",
    options: ["Alespoň 60 minut", "Alespoň 10 minut", "Alespoň 3 hodiny", "Pohyb není nutný"],
    hints: [
      "Hodina nebo víc — jaké číslo tě napadne?",
      "Pohyb posiluje srdce, svaly i kosti.",
    ],
    explanation:
      "Odborníci doporučují dětem alespoň 60 minut pohybu každý den. Pohyb posiluje svaly, kosti i srdce, zlepšuje soustředění a náladu.",
  },
  {
    question: "Proč si myjeme ruce?",
    correctAnswer: "Protože na rukou jsou bakterie a viry, které by nás mohly roznemocnit",
    options: [
      "Protože na rukou jsou bakterie a viry, které by nás mohly roznemocnit",
      "Protože ruce pak lépe drží tužku",
      "Protože voda posiluje kůži",
      "Protože to tak říká učitel",
    ],
    hints: [
      "Co se dá přenést z rukou do úst, když jíš?",
      "Proč si myjeme ruce zvlášť před jídlem a po záchodě?",
    ],
    explanation:
      "Na rukou se hromadí bakterie a viry. Pokud si neumyjeme ruce, tyto zárodky se přenesou do úst nebo očí a způsobí nemoc. Mýdlo a voda je z rukou odstraní.",
  },
  {
    question: "Co jsou šlachy?",
    correctAnswer: "Pevná vlákna, která spojují svaly s kostmi",
    options: [
      "Pevná vlákna, která spojují svaly s kostmi",
      "Měkká tkáň uvnitř kostí, kde vznikají krvinky",
      "Cévy, které vedou krev ke svalům",
      "Část nervové soustavy v míše",
    ],
    hints: [
      "Svaly musí být nějak přirostlé ke kostem — čím?",
      "Šlachy jsou jako silné provázky.",
    ],
    explanation:
      "Šlachy jsou pevná vlákna, která přichycují svaly ke kostem. Když se sval stáhne, šlacha přenese sílu na kost a tím vznikne pohyb.",
  },
  {
    question: "Co je součástí vyvážené stravy?",
    correctAnswer: "Ovoce, zelenina, bílkoviny, sacharidy a dostatek tekutin",
    options: [
      "Ovoce, zelenina, bílkoviny, sacharidy a dostatek tekutin",
      "Pouze maso a mléčné výrobky",
      "Sladkosti a slané pochutiny v každém jídle",
      "Jen zelenina a voda",
    ],
    hints: [
      "Vyvážená strava = jíst od každé skupiny potravin trochu.",
      "Co jíš ke snídani, obědu a večeři?",
    ],
    explanation:
      "Vyvážená strava obsahuje různé skupiny potravin: ovoce a zeleninu (vitamíny), bílkoviny (maso, luštěniny, vejce — stavební látky pro svaly), sacharidy (chléb, brambory — energie) a dostatek tekutin.",
  },
  {
    question: "K čemu slouží očkování?",
    correctAnswer: "Chrání tělo před nebezpečnými nemocemi — trénuje imunitní systém",
    options: [
      "Chrání tělo před nebezpečnými nemocemi — trénuje imunitní systém",
      "Léčí nemoci, které už máme",
      "Dodává tělu vitamíny a minerály",
      "Posiluje svaly a kosti",
    ],
    hints: [
      "Očkování je prevence — co to znamená?",
      "Co se stane v těle, když dostaneš vakcínu?",
    ],
    explanation:
      "Očkování (vakcinace) do těla vpraví oslabené nebo mrtvé zárodky nemoci. Imunitní systém se naučí je rozpoznat a příště, při skutečné nákaze, je rychle porazí dřív, než způsobí vážnou nemoc.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const STAVBATELAAZDRAV: TopicMetadata[] = [
  {
    id: "g3-prvouka-clovek-a-jeho-zdravi-lidske-telo-stavba-lidskeho-tela-kostra-svaly-uvod-zdravi-a-nemoc",
    title: "Stavba lidského těla, zdraví",
    studentTitle: "Naše tělo a zdraví",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Lidské tělo",
    briefDescription: "Poznáš základní části lidského těla a jak pečovat o zdraví.",
    illustrationDesc:
      "dítě ukazuje na průhledný model lidského těla se srdcem, plícemi a mozkem, vedle stojí kostra a na stole leží ovoce a zelenina",
    keywords: [
      "kostra",
      "svaly",
      "lebka",
      "páteř",
      "žebra",
      "šlachy",
      "srdce",
      "plíce",
      "mozek",
      "žaludek",
      "ledviny",
      "orgány",
      "zdraví",
      "vyvážená strava",
      "pohyb",
      "spánek",
      "hygiena",
      "mytí rukou",
      "očkování",
      "stavba těla",
    ],
    goals: [
      "Pojmenovat základní části kostry a vysvětlit jejich funkci.",
      "Popsat, jak fungují svaly a šlachy.",
      "Vysvětlit funkci hlavních orgánů: srdce, plíce, mozek, žaludek, ledviny.",
      "Vyjmenovat zásady zdravého životního stylu: strava, pohyb, spánek, hygiena.",
      "Vysvětlit, proč se očkujeme.",
    ],
    boundaries: [
      "Základní pojmy pro 3. třídu — bez anatomie na úrovni buněk ani chemie.",
      "Orgány jen v základní funkci — bez detailního popisu oběhové či trávicí soustavy.",
      "Hygiena a zdraví prakticky — bez detailní mikrobiologie.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Kostra = opora + ochrana. Svaly + šlachy = pohyb. Hlavní orgány: srdce (pumpa krve), plíce (dýchání), mozek (velení), žaludek (trávení), ledviny (čištění krve). Zdraví: pohyb 60 min, spánek 9–11 h, vyvážená strava, mytí rukou, očkování.",
      steps: [
        "Kostra — dává tělu tvar, chrání orgány (lebka → mozek, žebra → srdce + plíce, páteř → mícha).",
        "Svaly — přirostlé ke kostem přes šlachy; stahují se a uvolňují → pohyb.",
        "Srdce — svalová pumpa, přečerpává krev do celého těla.",
        "Plíce — výměna kyslíku (dovnitř) za oxid uhličitý (ven) při dýchání.",
        "Mozek — řídí tělo, myšlení, smysly i pohyby.",
        "Žaludek — rozkládá potravu, aby ji tělo mohlo vstřebat.",
        "Ledviny — filtrují krev, odstraňují odpadní látky jako moč.",
        "Zdraví: vyvážená strava, pohyb ≥ 60 min/den, spánek 9–11 h, mytí rukou, čištění zubů, očkování.",
      ],
      commonMistake:
        "Záměna funkcí orgánů: ledviny čistí krev (ne srdce), srdce pumpa krev (ne mozek). Šlachy spojují svaly s kostmi — nejsou to cévy ani nervy.",
      example:
        "Kopneš míč: mozek dá povel → nervy přenesou signál → sval stehna se stáhne → šlacha zatáhne kost → noha se pohne → míč odletí. Srdce mezitím pumpuje krev se kyslíkem do svalu.",
    },
  },
];
