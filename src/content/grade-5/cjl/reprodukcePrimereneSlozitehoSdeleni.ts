import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TEXT_A = "Sloni jsou největší suchozemská zvířata na světě. Samci mohou vážit až 6 tun. Žijí v Africe a Asii. Živí se rostlinami, trávou a listy.";
const TEXT_B = "Knihovna je místo, kde si lidé půjčují knihy. Návštěvníci mohou číst na místě nebo si knihy půjčit domů. Záznamy o výpůjčkách vedou knihovníci.";
const TEXT_C = "Každé ráno chodí Pavel do školy pěšky. Cesta trvá patnáct minut. Cestou potkává kamarády a spolu se baví o tom, co se ten den naučí.";

const POOL_L1: PracticeTask[] = [
  {
    question: `Přečti sdělení: "${TEXT_A}" Která reprodukce nejlépe vystihuje smysl?`,
    correctAnswer: "Sloni váží až 6 tun a žijí v Africe a Asii.",
    options: [
      "Sloni jsou malá zvířata z Afriky.",
      "Sloni váží až 6 tun a žijí v Africe a Asii.",
      "Sloni jedí jen trávu v Americe.",
      "Slon africký váží až 10 tun.",
    ],
    hints: ["Reprodukce zachovává klíčové informace – váhu, místo, potravu."],
  },
  {
    question: `Přečti sdělení: "${TEXT_B}" Která reprodukce je nejpřesnější?`,
    correctAnswer: "Knihovna půjčuje knihy domů i na místě.",
    options: [
      "Knihovna je obchod s knihami.",
      "Knihovna půjčuje knihy domů i na místě.",
      "Knihovníci v knihovně knihy prodávají.",
      "V knihovně se nesmí číst na místě.",
    ],
    hints: ["Správná reprodukce nezmění smysl ani nepřidá nepravdivé informace."],
  },
  {
    question: `Přečti sdělení: "${TEXT_C}" Která reprodukce je správná?`,
    correctAnswer: "Pavel chodí každé ráno pěšky do školy, cesta trvá 15 minut a cestou potkává kamarády.",
    options: [
      "Pavel jezdí do školy autobusem každé ráno.",
      "Pavel chodí každé ráno pěšky do školy, cesta trvá 15 minut a cestou potkává kamarády.",
      "Pavel chodí do školy odpoledne, cesta trvá hodinu.",
      "Pavel chodí sám do školy, nikoho nepotkává.",
    ],
    hints: ["Reprodukce musí zachovat fakta: pěšky, 15 minut, kamarádi."],
  },
  {
    question: "Co je reprodukce sdělení?",
    correctAnswer: "převyprávění vlastními slovy",
    options: [
      "doslovné opakování textu",
      "převyprávění vlastními slovy",
      "přeložení do jiného jazyka",
      "zkrácení na jedno slovo",
    ],
    hints: ["Reprodukce = svými výrazy, ale smysl zůstává stejný."],
  },
  {
    question: "Co se v reprodukci NESMÍ změnit?",
    correctAnswer: "hlavní smysl a klíčové informace",
    options: [
      "slova musí být stejná",
      "hlavní smysl a klíčové informace",
      "délka textu",
      "pořadí vět",
    ],
    hints: ["Smysl musí zůstat. Slova mohou být jiná."],
  },
  {
    question: "Jaký je rozdíl mezi reprodukcí a doslova citovaným textem?",
    correctAnswer: "reprodukce je vlastními slovy",
    options: [
      "citace je vlastními slovy",
      "reprodukce je vlastními slovy",
      "obojí znamená totéž",
      "citace je vždy kratší",
    ],
    hints: ["Citát = přesná kopie slov. Reprodukce = vlastní formulace."],
  },
  {
    question: "Při reprodukci NESMÍME:",
    correctAnswer: "přidat, co v originálu není",
    options: [
      "použít vlastní slova",
      "přidat, co v originálu není",
      "zkrátit původní text",
      "změnit pořadí informací",
    ],
    hints: ["Reprodukce = zachovat, ne vymýšlet."],
  },
  {
    question: "Jak poznáme dobrou reprodukci?",
    correctAnswer: "má vše podstatné a nic navíc",
    options: [
      "je kratší než originál",
      "má vše podstatné a nic navíc",
      "je delší než originál",
      "je psaná stejnými slovy",
    ],
    hints: ["Dobrá reprodukce = věrná a úplná, ale vlastními slovy."],
  },
  {
    question: "Proč je reprodukce užitečná dovednost?",
    correctAnswer: "pomáhá ověřit, zda jsme textu porozuměli",
    options: [
      "jen kvůli memorování",
      "pomáhá ověřit, zda jsme textu porozuměli",
      "záleží na délce textu",
      "jen kvůli překladu",
    ],
    hints: ["Reprodukce = důkaz porozumění textu."],
  },
  {
    question: "Co je zkrácená reprodukce (shrnutí)?",
    correctAnswer: "jen nejdůležitější myšlenky",
    options: [
      "přesná kopie celého textu",
      "jen nejdůležitější myšlenky",
      "text přeložený do cizího jazyka",
      "text delší než originál",
    ],
    hints: ["Shrnutí = stručná reprodukce. Jen to nejpodstatnější."],
  },
  {
    question: "Která z reprodukcí textu 'Sloni mají šedou barvu a velké uši. Ušima se chladí.' je správná?",
    correctAnswer: "Sloni jsou šedí a mají velké uši, které používají k chlazení.",
    options: [
      "Sloni jsou černí a mají malé uši.",
      "Sloni jsou šedí a mají velké uši, které používají k chlazení.",
      "Sloni mají malé uši a jsou zelení.",
      "Sloni se chladí vodou.",
    ],
    hints: ["Správná reprodukce zachovává: barvu, velikost uší, funkci."],
  },
  {
    question: "Která z reprodukcí je špatná? Originál: 'Psi jsou věrná zvířata. Žijí s lidmi tisíce let.'",
    correctAnswer: "Psi jsou nebezpečná zvířata a žijí jen ve volné přírodě.",
    options: [
      "Psi jsou věrní a s lidmi žijí tisíce let.",
      "Psi patří k nejdéle domestikovaným zvířatům.",
      "Psi jsou nebezpečná zvířata a žijí jen ve volné přírodě.",
      "Psi jsou přátelé lidí od pradávna.",
    ],
    hints: ["Špatná reprodukce mění smysl originálu."],
  },
  {
    question: "Jak hledat klíčové informace pro reprodukci?",
    correctAnswer: "ptáme se: kdo? co? kde? kdy? proč? jak?",
    options: [
      "počítáme slova",
      "ptáme se: kdo? co? kde? kdy? proč? jak?",
      "hledáme nejdelší větu",
      "záleží na autorovi",
    ],
    hints: ["Klíčové informace = odpovědi na základní otázky."],
  },
  {
    question: "Co je parafráze?",
    correctAnswer: "jiná formulace, stejný smysl",
    options: [
      "doslova citovaný text",
      "jiná formulace, stejný smysl",
      "přeložení do jiného jazyka",
      "zkrácení na jedno slovo",
    ],
    hints: ["Řekneš totéž, ale po svém. Změní se tím obsah sdělení?"],
  },
  {
    question: "Při reprodukci delšího textu je vhodné:",
    correctAnswer: "najít hlavní myšlenky a přeformulovat je",
    options: [
      "přečíst text jen jednou",
      "najít hlavní myšlenky a přeformulovat je",
      "napsat jen první větu",
      "opsat nejdelší odstavec",
    ],
    hints: ["Krok 1: co je hlavní? Krok 2: jak to říct jinak?"],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Přečti: 'Čokoláda se vyrábí z kakaových bobů. Kakaovník roste v tropech. Z bobů se lisuje máslo a prášek.' Která reprodukce je nejlepší?",
    correctAnswer: "Čokoláda je z kakaových bobů z tropů.",
    options: [
      "Čokoláda se vyrábí z obilí.",
      "Čokoláda je z kakaových bobů z tropů.",
      "Kakaovník roste jen v Africe.",
      "Čokoláda je hlavně z mléka.",
    ],
    hints: ["Zachovej: původ, místo pěstování, způsob výroby."],
  },
  {
    question: "Přečti: 'Knihovna v našem městě nabízí přes 50 tisíc titulů. Otevřeno je denně kromě neděle.' Která reprodukce je správná?",
    correctAnswer: "Knihovna má 50 000 knih, zavřeno v neděli.",
    options: [
      "Knihovna je otevřena jen v neděli.",
      "Knihovna má 50 000 knih, zavřeno v neděli.",
      "Knihovna má přes 100 000 knih.",
      "Knihovna je zavřena celý týden.",
    ],
    hints: ["Fakta: počet knih + zavírací den. Musí být přesně zachovány."],
  },
  {
    question: "Co je klíčová myšlenka odstavce?",
    correctAnswer: "bez ní odstavec ztratí smysl",
    options: [
      "je to vždy první věta",
      "bez ní odstavec ztratí smysl",
      "je to vždy poslední věta",
      "je to nejdelší věta",
    ],
    hints: ["Klíčová = bez ní ztrácíme smysl celého odstavce."],
  },
  {
    question: "Co je tematická věta?",
    correctAnswer: "shrnuje myšlenku odstavce",
    options: [
      "je poslední větou odstavce",
      "shrnuje myšlenku odstavce",
      "je nejkratší větou textu",
      "je vždy otázkou",
    ],
    hints: ["Topic sentence = věta-shrnutí. Zbytek ji rozvíjí."],
  },
  {
    question: "Přečti: 'Mars je čtvrtá planeta od Slunce. Má dvě měsíce. Je pojmenován po římském bohu války.' Která reprodukce chybuje?",
    correctAnswer: "Mars je třetí planeta od Slunce a nemá žádný měsíc.",
    options: [
      "Mars je čtvrtý od Slunce, má dva měsíce a nese jméno boha války.",
      "Mars, pojmenovaný po bohu války, je čtvrtá planeta s dvěma měsíci.",
      "Mars je čtvrtá planeta od Slunce. Má dvě měsíce.",
      "Mars je třetí planeta od Slunce a nemá žádný měsíc.",
    ],
    hints: ["Chyba v reprodukci = pozice (třetí místo čtvrtá) nebo počet měsíců."],
  },
  {
    question: "Proč se reprodukce liší od doslova opakování?",
    correctAnswer: "ukazuje, že jsi porozuměl",
    options: [
      "je vždy delší než originál",
      "ukazuje, že jsi porozuměl",
      "je přesnější než originál",
      "opakování je vždy kratší",
    ],
    hints: ["Porozuměl/a jsi → dokážeš říct jinak. Jen si zapamatoval/a → opakuješ doslova."],
  },
  {
    question: "Přečti: 'Mravenec unese 50× svou vlastní váhu. Žijí v koloniích o tisících jedinců.' Která reprodukce je nejpřesnější?",
    correctAnswer: "Mravenci žijí v koloniích a jsou silní – unesou 50× svou váhu.",
    options: [
      "Mravenci jsou malí a červení.",
      "Mravenci žijí v koloniích a jsou silní – unesou 50× svou váhu.",
      "Mravenci unesou 100× svou váhu.",
      "Mravenci žijí sami a jsou slabí.",
    ],
    hints: ["Zachovej: sílu (50×) a kolonie."],
  },
  {
    question: "Co je hlavní smysl sdělení?",
    correctAnswer: "myšlenka celého textu",
    options: [
      "první věta textu",
      "myšlenka celého textu",
      "poslední věta textu",
      "nejdelší věta textu",
    ],
    hints: ["Ptej se: o čem je celý text? To je hlavní smysl."],
  },
  {
    question: "Jak víme, že naše reprodukce je věrná?",
    correctAnswer: "porovnáme s originálem – jsou klíčové informace všechny?",
    options: [
      "je stejně dlouhá jako originál",
      "porovnáme s originálem – jsou klíčové informace všechny?",
      "použili jsme stejná slova",
      "záleží na délce",
    ],
    hints: ["Ověření: znovu přečti originál a zkontroluj."],
  },
  {
    question: "Jak správně strukturujeme reprodukci delšího textu?",
    correctAnswer: "každý odstavec originálu shrneme do jedné věty reprodukce",
    options: [
      "napíšeme jen první a poslední odstavec",
      "každý odstavec originálu shrneme do jedné věty reprodukce",
      "záleží jen na délce",
      "přepíšeme jen zajímavé části",
    ],
    hints: ["Jednu část textu shrň do jedné výstižné věty — a totéž udělej pro každou další část."],
  },
  {
    question: "Přečti: 'Bouřky vznikají při srážce teplého a studeného vzduchu. Doprovázejí je blesky a hrom.' Která reprodukce je chybná?",
    correctAnswer: "Bouřky vznikají jen v létě a hrom je způsoben vlhkostí.",
    options: [
      "Bouřky nastávají při srážce teplého a studeného vzduchu a provází je blesky.",
      "Při bouřkách dochází ke srážce vzdušných mas a ke vzniku blesků.",
      "Bouřky vznikají jen v létě a hrom je způsoben vlhkostí.",
      "Bouřky jsou způsobeny rozdílem teplot vzduchu.",
    ],
    hints: ["Tato reprodukce mění, kdy bouřky vznikají, a vymýšlí příčinu hromu, o které originál nic neříká."],
  },
  {
    question: "Co je abstrakce v reprodukci?",
    correctAnswer: "shrnutí konkrétních detailů do obecné myšlenky",
    options: [
      "přeložení textu",
      "shrnutí konkrétních detailů do obecné myšlenky",
      "doplnění nových informací",
      "záleží na tématu",
    ],
    hints: ["'Sloni jedí trávu, listy a větve.' → 'Sloni se živí rostlinami.' = abstrakce."],
  },
  {
    question: "Při reprodukci odborného textu je důležité:",
    correctAnswer: "zachovat klíčové termíny a přesná čísla",
    options: [
      "použít jednodušší slova bez termínů",
      "zachovat klíčové termíny a přesná čísla",
      "zkrátit na polovinu",
      "záleží na adresátovi",
    ],
    hints: ["Odborné termíny a čísla nelze nahradit – jsou přesné."],
  },
  {
    question: "Jak se liší shrnutí od analýzy textu?",
    correctAnswer: "shrnutí říká co, rozbor proč",
    options: [
      "rozbor říká co, shrnutí proč",
      "shrnutí říká co, rozbor proč",
      "obojí znamená totéž",
      "rozbor je vždy kratší",
    ],
    hints: ["Shrnutí = obsah. Analýza = záměr, styl, struktura."],
  },
  {
    question: "Přečti: 'Vrabec domácí je nejrozšířenější pták v Evropě. Živí se semeny a hmyzem.' Která reprodukce je nejlepší?",
    correctAnswer: "Vrabec je běžný pták, jí semena i hmyz.",
    options: [
      "Vrabec je vzácný pták Evropy.",
      "Vrabec je běžný pták, jí semena i hmyz.",
      "Vrabci žijí jen v Asii.",
      "Vrabci jedí jen semena.",
    ],
    hints: ["Zachovej: rozšíření (nejrozšířenější, Evropa), potravu (semena + hmyz)."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jak se liší reprodukce faktografického textu od reprodukce literárního textu?",
    correctAnswer: "u faktů přesnost, u příběhu nálada",
    options: [
      "u faktů nálada, u příběhu přesnost",
      "u faktů přesnost, u příběhu nálada",
      "obojí je úplně stejné",
      "literární je vždy delší",
    ],
    hints: ["Fakta = přesná čísla a termíny. Literatura = příběh a emoce."],
  },
  {
    question: "Co je citátová reprodukce (doslova)?",
    correctAnswer: "doslovné znění v uvozovkách",
    options: [
      "volná vlastní formulace",
      "doslovné znění v uvozovkách",
      "zkrácená verze textu",
      "překlad do jiného jazyka",
    ],
    hints: ["Citace = doslova, uvozovky. Reprodukce = vlastní slova."],
  },
  {
    question: "Při reprodukci básně je důležité:",
    correctAnswer: "zachovat téma a náladu",
    options: [
      "zachovat rým a rytmus",
      "zachovat téma a náladu",
      "přepsat báseň doslova",
      "zkrátit ji na jednu větu",
    ],
    hints: ["Báseň se reprodukuje prózou – zachováme téma a pocit."],
  },
  {
    question: "Co je selektivní reprodukce?",
    correctAnswer: "reprodukce jen vybrané části textu – ne celku",
    options: [
      "reprodukce celého textu doslova",
      "reprodukce jen vybrané části textu – ne celku",
      "zkrácení textu na polovinu",
      "záleží na délce",
    ],
    hints: ["Selektivní = vybereme jen to, co je pro nás relevantní."],
  },
  {
    question: "Co je interpretační chyba v reprodukci?",
    correctAnswer: "přidání vlastního názoru",
    options: [
      "změna pořadí informací",
      "přidání vlastního názoru",
      "zkrácení celého textu",
      "použití vlastních slov",
    ],
    hints: ["Interpretace = vlastní výklad. Reprodukce by měla být neutrální."],
  },
  {
    question: "Přečti: 'Vítr vzniká pohybem vzdušných mas způsobeným rozdílem tlaků. Čím větší je rozdíl, tím silnější vítr.' Která reprodukce je nejpřesnější?",
    correctAnswer: "Vítr vzniká rozdílem tlaku vzduchu.",
    options: [
      "Vítr je způsoben teplotou slunce.",
      "Vítr vzniká rozdílem tlaku vzduchu.",
      "Vítr vždy fouká ze severu.",
      "Tlak nemá na vítr vliv.",
    ],
    hints: ["Zachovej: příčina (rozdíl tlaků), vztah (větší rozdíl = silnější vítr)."],
  },
  {
    question: "Jak pomáhá osnova při reprodukci dlouhého textu?",
    correctAnswer: "osnova zachycuje klíčové body – reprodukujeme každý bod zvlášť",
    options: [
      "osnova je pro reprodukci zbytečná",
      "osnova zachycuje klíčové body – reprodukujeme každý bod zvlášť",
      "záleží jen na délce",
      "osnova se tvoří po reprodukci",
    ],
    hints: ["Osnova = mapa textu. Reprodukce bodu po bodu = přehledná reprodukce."],
  },
  {
    question: "Jaký je rozdíl mezi parafrází a reprodukcí?",
    correctAnswer: "jsou prakticky totéž",
    options: [
      "parafráze je vždy kratší",
      "jsou prakticky totéž",
      "reprodukce je přesná kopie",
      "parafráze je překlad",
    ],
    hints: ["Parafráze a reprodukce jsou synonyma pro vlastní přeformulování."],
  },
  {
    question: "Jak se liší shrnutí od rozšířené reprodukce?",
    correctAnswer: "shrnutí = jen hlavní body; rozšířená = zachovány i detaily",
    options: [
      "jsou totéž",
      "shrnutí = jen hlavní body; rozšířená = zachovány i detaily",
      "rozšířená je vždy delší než originál",
      "záleží na adresátovi",
    ],
    hints: ["Shrnutí = stručné. Rozšířená reprodukce = podrobnější."],
  },
  {
    question: "Přečti a reprodukuj vlastními slovy: 'Voda tvoří 71 % povrchu Země. Přesto je pitná voda vzácná.'",
    correctAnswer: "Ačkoli voda pokrývá přes 70 % zemského povrchu, pitné vody je málo.",
    options: [
      "Celá Země je pokryta vodou.",
      "Ačkoli voda pokrývá přes 70 % zemského povrchu, pitné vody je málo.",
      "Pitná voda tvoří 71 % Země.",
      "Voda je vzácná, proto Země je suchá.",
    ],
    hints: ["Zachovej: 71 % a paradox = hodně vody, ale málo pitné."],
  },
  {
    question: "Co je kritická reprodukce?",
    correctAnswer: "hodnotíme i kvalitu originálu",
    options: [
      "doslova opakujeme cizí text",
      "hodnotíme i kvalitu originálu",
      "jen zkrátíme původní text",
      "přeložíme text do cizího jazyka",
    ],
    hints: ["Kritická = reprodukuji + hodnotím: je to pravda? Je to logické?"],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const REPRODUKCEPRIMERENESLOZITEHOSDELENI: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-reprodukce-primerene-sloziteho-sdeleni",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-reprodukce-primerene-sloziteho-sdeleni",
    title: "Reprodukce přiměřeně složitého sdělení",
    studentTitle: "Převyprávění",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení a naslouchání",
    briefDescription: "Naučíš se převyprávět text vlastními slovy.",
    keywords: ["reprodukce", "převyprávění", "parafráze", "shrnutí", "porozumění"],
    goals: [
      "Reprodukovat obsah textu vlastními slovy",
      "Rozlišit věrnou a chybnou reprodukci",
      "Zachovat klíčové informace při převyprávění",
    ],
    boundaries: [
      "Bez rozsáhlé literární analýzy",
      "Neprobíráme kritickou analýzu textu podrobně",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Reprodukce = vlastními slovy, ale smysl stejný. 1. Přečti text. 2. Najdi klíčové informace. 3. Formuluj je jinak.",
      steps: [
        "Přečti text a identifikuj klíčové informace.",
        "Odpověz na: kdo, co, kde, kdy, proč, jak?",
        "Napiš/řekni obsah vlastními slovy.",
        "Zkontroluj: jsou v reprodukci všechna klíčová fakta?",
      ],
      commonMistake: "Žáci přidávají informace, které v originálu nejsou, nebo vynechávají klíčová fakta.",
      example: "Originál: 'Sloni jsou největší zvířata na souši.' Reprodukce: 'Sloni jsou suchozemskými rekordmany ve velikosti.'",
    },
  },
];
