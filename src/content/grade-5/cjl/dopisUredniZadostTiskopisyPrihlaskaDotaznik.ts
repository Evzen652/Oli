import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Co patří do hlavičky (záhlaví) úředního dopisu?",
    correctAnswer: "jméno a adresa odesilatele i adresáta",
    options: [
      "jen datum",
      "jen podpis",
      "jméno a adresa odesilatele i adresáta",
      "jen obsah dopisu",
    ],
    hints: ["Záhlaví = kdo piše a komu – adresy obou stran."],
  },
  {
    question: "Co je 'Vec:' v úředním dopisu?",
    correctAnswer: "stručné označení předmětu (tématu) dopisu",
    options: [
      "pozdrav",
      "stručné označení předmětu (tématu) dopisu",
      "podpis odesilatele",
      "datum dopisu",
    ],
    hints: ["'Vec: Žádost o...' – stručně říká, o čem dopis je."],
  },
  {
    question: "Jak se správně zahajuje úřední dopis?",
    correctAnswer: "Vážený pane / Vážená paní + titul nebo funkce",
    options: [
      "Ahoj,",
      "Vážený pane / Vážená paní + titul nebo funkce",
      "Dobrý den příteli,",
      "Hej,",
    ],
    hints: ["Úřední oslovení: Vážený pane řediteli, / Vážená paní učitelko,..."],
  },
  {
    question: "Co musí obsahovat závěr úředního dopisu?",
    correctAnswer: "zdvořilostní pozdrav a podpis",
    options: [
      "jen datum",
      "jen razítko",
      "zdvořilostní pozdrav a podpis",
      "telefonní číslo",
    ],
    hints: ["Závěr: 'S úctou' nebo 'S pozdravem' + vlastnoruční podpis."],
  },
  {
    question: "Co je to žádost?",
    correctAnswer: "úřední dopis, kde žádáme o něco zdvořilou formou",
    options: [
      "neformální e-mail příteli",
      "úřední dopis, kde žádáme o něco zdvořilou formou",
      "pozvánka na oslavu",
      "dopis s pozdravem",
    ],
    hints: ["Žádost = formální žádost o povolení, informaci, výjimku..."],
  },
  {
    question: "Co musí obsahovat přihláška?",
    correctAnswer: "osobní údaje žadatele a požadované informace (co, kam, kdy)",
    options: [
      "jen podpis",
      "osobní údaje žadatele a požadované informace (co, kam, kdy)",
      "jen datum",
      "jen pozdrav",
    ],
    hints: ["Přihláška: kdo se hlásí, kam, kdy – osobní data + záměr."],
  },
  {
    question: "Kde se uvádí datum v úředním dopisu?",
    correctAnswer: "v záhlaví, zpravidla pod adresou odesilatele",
    options: [
      "za 'Vec:'",
      "v záhlaví, zpravidla pod adresou odesilatele",
      "v závěru za podpisem",
      "datum se neuvádí",
    ],
    hints: ["Datum = v pravé části záhlaví nebo pod adresou odesilatele."],
  },
  {
    question: "Jaký tón (styl) má úřední dopis?",
    correctAnswer: "formální, zdvořilý, bez slangových výrazů",
    options: [
      "neformální, přátelský",
      "formální, zdvořilý, bez slangových výrazů",
      "humorný a přátelský",
      "odborný s vědeckými termíny",
    ],
    hints: ["Úřední styl = vždy formálně, neutrálně, zdvořile."],
  },
  {
    question: "Jak se podepisujeme v úředním dopisu?",
    correctAnswer: "vlastním jménem a příjmením (vlastnoruční nebo tištěný podpis)",
    options: [
      "přezdívkou",
      "vlastním jménem a příjmením (vlastnoruční nebo tištěný podpis)",
      "jen iniciálami",
      "podpis není nutný",
    ],
    hints: ["Podpis = plné jméno, ideálně vlastnoruční."],
  },
  {
    question: "Jak se správně píše oslovení v úředním dopisu na obálce?",
    correctAnswer: "Vážený pan/paní Název Příjmení, adresa",
    options: [
      "Ahoj, pane Novák!",
      "Vážený pan/paní Název Příjmení, adresa",
      "Pane Novák!",
      "Dobrý den pane!",
    ],
    hints: ["Na obálce: 'Vážený pan Novák' nebo jen jméno a adresa."],
  },
  {
    question: "Co je dotazník?",
    correctAnswer: "formulář s otázkami, na které odpovídáme",
    options: [
      "žádost o práci",
      "formulář s otázkami, na které odpovídáme",
      "přihláška do školy",
      "pozvánka",
    ],
    hints: ["Dotazník = série otázek k vyplnění."],
  },
  {
    question: "Proč se žádost píše formálně?",
    correctAnswer: "protože ji čte úřad nebo instituce, která rozhoduje o naší žádosti",
    options: [
      "protože to je zákon",
      "protože ji čte úřad nebo instituce, která rozhoduje o naší žádosti",
      "protože neformální žádost je nezákonná",
      "záleží na osobě",
    ],
    hints: ["Formální styl = respektujeme adresáta a jeho funkci."],
  },
  {
    question: "Co uvádíme v těle (obsahu) žádosti?",
    correctAnswer: "důvod žádosti, konkrétní prosbu a poděkování",
    options: [
      "jen pozdrav",
      "jen jméno",
      "důvod žádosti, konkrétní prosbu a poděkování",
      "seznam přátel",
    ],
    hints: ["Proč žádám? O co přesně žádám? Poděkování za vyřízení."],
  },
  {
    question: "Co je tiskopis?",
    correctAnswer: "předtištěný formulář s prázdnými místy k vyplnění",
    options: [
      "ručně psaný dopis",
      "předtištěný formulář s prázdnými místy k vyplnění",
      "úřední razítko",
      "druh obálky",
    ],
    hints: ["Tiskopis = formulář, kde vyplňujeme do připravených políček."],
  },
  {
    question: "Jaké osobní údaje se nejčastěji uvádějí v přihlášce?",
    correctAnswer: "jméno, příjmení, datum narození, adresa, kontakt",
    options: [
      "jen jméno",
      "jen adresa",
      "jméno, příjmení, datum narození, adresa, kontakt",
      "číslo průkazu pojišťovny",
    ],
    hints: ["Přihláška obsahuje základní identifikační údaje."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "V žádosti o výjimku z povinné školní docházky napíšeme:",
    correctAnswer: "důvod absence a konkrétní dny/termíny",
    options: [
      "jen podpis",
      "důvod absence a konkrétní dny/termíny",
      "jen datum",
      "seznam spolužáků",
    ],
    hints: ["Žádost o výjimku = vysvětlit proč + kdy."],
  },
  {
    question: "Jaký je správný zdvořilostní závěr žádosti?",
    correctAnswer: "S pozdravem / S úctou / Děkuji za kladné vyřízení",
    options: [
      "Čau!",
      "S pozdravem / S úctou / Děkuji za kladné vyřízení",
      "Zdravím všechny!",
      "Na shledanou!",
    ],
    hints: ["Závěr žádosti = zdvořilostní fráze + podpis."],
  },
  {
    question: "Přihláška na tábor musí obsahovat:",
    correctAnswer: "osobní data dítěte, termín, kontakt na rodiče, zdravotní info",
    options: [
      "jen jméno dítěte",
      "osobní data dítěte, termín, kontakt na rodiče, zdravotní info",
      "jen podpis rodiče",
      "jen termín tábora",
    ],
    hints: ["Přihláška na tábor = kompletní údaje pro organizátory."],
  },
  {
    question: "V úředním dopisu NESMÍME používat:",
    correctAnswer: "slangové výrazy, emotikony, zkratky jako 'jj' nebo 'btw'",
    options: [
      "datum",
      "slangové výrazy, emotikony, zkratky jako 'jj' nebo 'btw'",
      "vlastní jméno",
      "formální pozdrav",
    ],
    hints: ["Úřední styl = bez neformálních prvků."],
  },
  {
    question: "Jak napíšeme oslovení při neznalosti pohlaví adresáta?",
    correctAnswer: "Vážené vedení / Vážený pane řediteli / obě varianty",
    options: [
      "Ahoj všichni!",
      "Vážené vedení / Vážený pane řediteli / obě varianty",
      "Dobrý den neznámý!",
      "Hej ty!",
    ],
    hints: ["Při neznalosti = oslovíme funkci nebo instituci."],
  },
  {
    question: "Co je 'příloha' u dopisu?",
    correctAnswer: "doklady nebo dokumenty připojené k dopisu (kopie, certifikáty)",
    options: [
      "poštovní razítko",
      "doklady nebo dokumenty připojené k dopisu (kopie, certifikáty)",
      "seznam adresátů",
      "datum odeslání",
    ],
    hints: ["Příloha = přiložený dokument (životopis, kopie průkazu atd.)."],
  },
  {
    question: "Žádost o brigádu (práci) musí obsahovat:",
    correctAnswer: "kontaktní údaje, o jakou práci žádám a proč jsem vhodný/á",
    options: [
      "jen jméno",
      "kontaktní údaje, o jakou práci žádám a proč jsem vhodný/á",
      "jen podpis",
      "seznam přátel",
    ],
    hints: ["Motivační dopis k brigádě = kdo jsem, co umím, o co žádám."],
  },
  {
    question: "Na obálce se adresa adresáta píše:",
    correctAnswer: "doprostřed nebo do pravé části obálky",
    options: [
      "vlevo nahoře",
      "doprostřed nebo do pravé části obálky",
      "na zadní stranu",
      "nezáleží kde",
    ],
    hints: ["Adresát = příjemce = na přední straně obálky."],
  },
  {
    question: "Proč v žádosti uvádíme důvod?",
    correctAnswer: "aby adresát věděl, proč žádáme, a mohl rozhodnout",
    options: [
      "jen kvůli délce textu",
      "aby adresát věděl, proč žádáme, a mohl rozhodnout",
      "důvod se neuvádí",
      "záleží na situaci",
    ],
    hints: ["Bez důvodu by žádost byla neúplná."],
  },
  {
    question: "Co je správná struktura úředního dopisu?",
    correctAnswer: "záhlaví → Vec: → oslovení → text → závěr → podpis",
    options: [
      "text → podpis → záhlaví",
      "záhlaví → Vec: → oslovení → text → závěr → podpis",
      "podpis → záhlaví → text",
      "záleží na osobě",
    ],
    hints: ["Pořadí: záhlaví, předmět, oslovení, obsah, závěr, podpis."],
  },
  {
    question: "Co uvádíme v záhlaví na levé straně?",
    correctAnswer: "jméno a adresa odesilatele (kdo píše)",
    options: [
      "jméno a adresa adresáta",
      "jméno a adresa odesilatele (kdo píše)",
      "datum",
      "Vec:",
    ],
    hints: ["Vlevo = odesilatel (já). Vpravo nebo níže = adresát."],
  },
  {
    question: "Co uvádíme v záhlaví na pravé nebo spodní straně?",
    correctAnswer: "jméno a adresa adresáta (komu píšeme)",
    options: [
      "jméno odesilatele",
      "jen datum",
      "jméno a adresa adresáta (komu píšeme)",
      "Vec:",
    ],
    hints: ["Vpravo nebo níže = adresát (komu dopis patří)."],
  },
  {
    question: "Jak se správně píše datum v českém dopisu?",
    correctAnswer: "V [Město] dne [den]. [měsíc]. [rok]",
    options: [
      "Today: 01.06.2026",
      "V [Město] dne [den]. [měsíc]. [rok]",
      "jen rok",
      "datum se v dopisu neuvádí",
    ],
    hints: ["Například: V Praze dne 1. 6. 2026."],
  },
  {
    question: "Co je průvodní dopis?",
    correctAnswer: "dopis přikládaný k jinému dokumentu (životopis, žádost o brigádu)",
    options: [
      "pozdravný dopis příteli",
      "dopis přikládaný k jinému dokumentu (životopis, žádost o brigádu)",
      "pohlednice",
      "dopis bez adresy",
    ],
    hints: ["Průvodní dopis = krátký úvod ke druhému dokumentu."],
  },
  {
    question: "Jak se liší žádost od přihlášky?",
    correctAnswer: "žádost prosí o něco, přihláška oznamuje záměr se přihlásit",
    options: [
      "jsou totéž",
      "žádost prosí o něco, přihláška oznamuje záměr se přihlásit",
      "přihláška je vždy delší",
      "žádost má vždy razítko",
    ],
    hints: ["Žádám o... (žádost). Přihlašuji se k... (přihláška)."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je vykání a proč ho používáme v úředním dopisu?",
    correctAnswer: "forma zdvořilostního oslovení dospělé osoby; vyjadřuje úctu",
    options: [
      "forma záporné komunikace",
      "forma zdvořilostního oslovení dospělé osoby; vyjadřuje úctu",
      "dialektická forma češtiny",
      "způsob psaní e-mailů",
    ],
    hints: ["Vykáme = používáme 'Vy' místo 'ty' pro vyjádření respektu."],
  },
  {
    question: "Napište správné oslovení v dopisu starostovi:",
    correctAnswer: "Vážený pane starosto,",
    options: [
      "Ahoj starosto,",
      "Vážený pane starosto,",
      "Pane starosta!",
      "Dobrý den pane,",
    ],
    hints: ["Vážený pane + funkce v 5. pádě (vokativ)."],
  },
  {
    question: "Jak zakončit žádost profesionálně?",
    correctAnswer: "Děkuji za kladné vyřízení mé žádosti. S úctou, [podpis]",
    options: [
      "Čau! [podpis]",
      "Nashle! [podpis]",
      "Děkuji za kladné vyřízení mé žádosti. S úctou, [podpis]",
      "Prosím pozdravujte. [podpis]",
    ],
    hints: ["Profesionální zakončení = zdvořilostní fráze + S úctou + podpis."],
  },
  {
    question: "Co se nesmí zapomenout uvést v žádosti o omluvu z výuky?",
    correctAnswer: "jméno žáka, třídu, termín absence a důvod",
    options: [
      "jen podpis rodiče",
      "jméno žáka, třídu, termín absence a důvod",
      "jen den absence",
      "jen jméno rodiče",
    ],
    hints: ["Omluvenka = kompletní údaje: kdo, která třída, kdy, proč."],
  },
  {
    question: "Ve formálním e-mailu řediteli školy NESMÍME napsat:",
    correctAnswer: "Hej, chci se zeptat jestli... 😊",
    options: [
      "Vážený pane řediteli, rád bych se informoval...",
      "S úctou, Jana Nováková",
      "Hej, chci se zeptat jestli... 😊",
      "Předmět: Žádost o informaci",
    ],
    hints: ["Hej + emotikon = neformální → nevhodné pro úřední e-mail."],
  },
  {
    question: "Proč musí žádost obsahovat konkrétní termíny a data?",
    correctAnswer: "aby adresát věděl, o jaké období nebo datum jde a mohl rozhodnout",
    options: [
      "kvůli délce textu",
      "aby adresát věděl, o jaké období nebo datum jde a mohl rozhodnout",
      "zákon to nepožaduje",
      "jen kvůli přehlednosti",
    ],
    hints: ["Konkrétnost = přesná žádost = snazší vyřízení."],
  },
  {
    question: "Co je životopis a jaký typ dokumentu to je?",
    correctAnswer: "strukturovaný dokument s osobními a pracovními údaji (přikládaný k žádosti)",
    options: [
      "úřední dopis",
      "strukturovaný dokument s osobními a pracovními údaji (přikládaný k žádosti)",
      "dotazník",
      "pohlednice",
    ],
    hints: ["CV/životopis = přehled kdo jsem, co umím, kde jsem pracoval."],
  },
  {
    question: "Jaký je správný pořadí částí žádosti o výlet třídy?",
    correctAnswer: "záhlaví → Vec: Žádost o výlet → oslovení → důvod + prosba → závěr → podpis",
    options: [
      "podpis → záhlaví → obsah",
      "záhlaví → Vec: Žádost o výlet → oslovení → důvod + prosba → závěr → podpis",
      "jen podpis a datum",
      "jen obsah a pozdrav",
    ],
    hints: ["Každý typ žádosti sleduje stejnou strukturu."],
  },
  {
    question: "Co je to datový bod 'Vec:' a proč je důležitý?",
    correctAnswer: "stručné označení tématu – pomáhá adresátovi rychle pochopit, o co jde",
    options: [
      "zbytečný prvek",
      "stručné označení tématu – pomáhá adresátovi rychle pochopit, o co jde",
      "povinný pozdrav",
      "alternativa k podpisu",
    ],
    hints: ["Vec: = předmět dopisu. Pomáhá vyřídit ho rychle."],
  },
  {
    question: "Jak se vyjádříme zdvořile v žádosti o snížení školného?",
    correctAnswer: "Dovoluji si vás zdvořile požádat o snížení...",
    options: [
      "Chci snížení školného!",
      "Dovoluji si vás zdvořile požádat o snížení...",
      "Potřebuju méně platit.",
      "Prosím snižte mi to.",
    ],
    hints: ["Formální prosba = 'Dovoluji si... požádat o...' nebo 'Tímto žádám o...'"],
  },
  {
    question: "Jaký je rozdíl mezi tiskopisem a volnou žádostí?",
    correctAnswer: "tiskopis = předtištěný formulář; volná žádost = psána od nuly vlastními slovy",
    options: [
      "tiskopis je vždy lepší",
      "tiskopis = předtištěný formulář; volná žádost = psána od nuly vlastními slovy",
      "volná žádost nemá strukturu",
      "tiskopis neobsahuje podpis",
    ],
    hints: ["Tiskopis = políčka k vyplnění. Volná žádost = vlastní formulace."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const DOPISUREDNIZADOSTTISKOPISYPRIHLASKADOTAZNIK: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-uredni-zadost-tiskopisy-prihlaska-dotaznik",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-uredni-zadost-tiskopisy-prihlaska-dotaznik",
    title: "Dopis úřední (žádost, přihláška, dotazník)",
    studentTitle: "Úřední dopis",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se napsat úřední dopis nebo žádost.",
    keywords: ["úřední dopis", "žádost", "přihláška", "tiskopis", "formální psaní"],
    goals: [
      "Poznat strukturu úředního dopisu",
      "Napsat jednoduchou žádost nebo přihlášku",
      "Používat správný formální styl",
    ],
    boundaries: [
      "Neprobíráme složité právní dokumenty",
      "Bez podrobného práva a administrativy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Úřední dopis má pevnou strukturu: záhlaví (kdo a komu) → Vec: (téma) → oslovení → text → závěr → podpis. Vždy piš formálně a zdvořile.",
      steps: [
        "Napiš záhlaví: svou adresu a adresu příjemce.",
        "Uveď Vec: (krátce téma).",
        "Oslovi: Vážený pane / Vážená paní + titul.",
        "Vysvětli důvod, požádej konkrétně.",
        "Zakončí: S úctou / S pozdravem + podpis.",
      ],
      commonMistake: "Žáci zapomenou na oslovení nebo závěrečný zdvořilostní pozdrav. Bez nich dopis působí neúplně.",
      example: "Vážený pane řediteli, dovoluji si vás žádat o... S úctou, Jana Nováková.",
    },
  },
];
