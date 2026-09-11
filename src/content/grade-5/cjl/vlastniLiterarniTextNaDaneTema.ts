import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem. Teď: L1 jaký žánr se hodí k nápadu
// · L2 stavba textu (začátek, konec, nadpis, rým, plán) · L3 úprava vlastního
// textu (opakování, spisovnost, přesná slova, obraznost).

const ZANRY: Kategorie[] = [
  { nazev: "pohádka", znak: "vymyšlený příběh s kouzly, kde dobro vítězí nad zlem." },
  { nazev: "bajka", znak: "zvířata jednají jako lidé a z příběhu plyne ponaučení." },
  { nazev: "povídka", znak: "příběh ze skutečného života, bez kouzel." },
  { nazev: "báseň", znak: "text ve verších, často s rýmem a rytmem." },
];
const PO = "pohádka", BA = "bajka", PV = "povídka", BS = "báseň";
const N = (napad: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven: 1, slovo: napad, veta: napad, kategorie, klic, proc });

const NAPADY: Polozka[] = [
  N("Chudý chlapec dostane od víly kouzelný prsten a zachrání princeznu.", PO, "je tu víla a kouzelný prsten", "Kouzla a dobro vítězí — pohádka."),
  N("Líná cikáda celé léto zpívá a v zimě prosí pracovitého mravence o jídlo — kdo nepracuje, nemá.", BA, "zvířata se chovají jako lidé a z příběhu plyne poučení", "Zvířata jako lidé a poučení — bajka."),
  N("Kluk z páté třídy poprvé jede sám vlakem k babičce a cestou se ztratí.", PV, "je to běžná příhoda ze života bez kouzel", "Skutečná příhoda — povídka."),
  N("Chceš v krátkých rýmovaných řádcích vyjádřit, jak voní jarní louka.", BS, "píšeš krátké řádky s rýmem", "Verše s rýmem — báseň."),
  N("Drak unese princeznu a nejmladší ze tří bratrů se ji vydá vysvobodit.", PO, "je tu drak a princezna", "Pohádkové bytosti — pohádka."),
  N("Pyšný zajíc se vysmívá pomalé želvě, ale v závodě ho želva porazí — pýcha se nevyplácí.", BA, "zvířata jednají jako lidé a na konci je ponaučení", "Zvířata a ponaučení — bajka."),
  N("Holka z vesnice najde u cesty zraněného kosa a doma ho s tátou vyléčí.", PV, "všechno se tak mohlo opravdu stát", "Skutečná příhoda — povídka."),
  N("Chceš rytmicky a s rýmy popsat, jak padá první sníh.", BS, "chceš psát v rytmu a s rýmy", "Rytmus a rým — báseň."),
  N("Kouzelný hrnec vaří kaši, dokud neuslyší správná slova.", PO, "je tu kouzelný předmět", "Kouzla — pohádka."),
  N("Vrána se ozdobí pávím peřím, ostatní ptáci ji poznají a vyženou — nemáme se vydávat za jiné.", BA, "ptáci jednají jako lidé a z příběhu plyne poučení", "Zvířata a ponaučení — bajka."),
  N("Dvě kamarádky se pohádají kvůli ztracené knize a pak se usmíří.", PV, "je to obyčejná příhoda mezi kamarádkami", "Skutečná příhoda — povídka."),
  N("Chceš napsat pár slok s rýmy o tom, jak se těšíš na prázdniny.", BS, "chceš psát sloky s rýmy", "Sloky a rýmy — báseň."),
  N("Mluvící kocour pomůže mlynářovu synovi získat zámek a princeznu.", PO, "mluvící kocour bez ponaučení a zámek s princeznou jsou kouzelný svět", "Kouzelný svět — pohádka."),
];

const L2: PracticeTask[] = [
  choice("Který začátek se hodí k pohádce?", "Za devatero horami žil jeden král.", [
    { value: "Včera jsem šel do obchodu.", why: "Tak začíná spíš zážitek ze života." },
    { value: "Voda vře při 100 stupních.", why: "To je věcná informace." },
    { value: "Nejprve si umyj ruce.", why: "To je pokyn z návodu." },
  ], {
    hints: ["Jak obvykle začínají pohádky, které znáš?", "Pohádky mají ustálené začátky, které čtenáře přenesou do vymyšleného světa daleko odsud."],
    explanation: "Za devatero horami… je typický pohádkový začátek.",
  }),
  choice("Který nadpis se hodí k povídce o tom, jak se Tomáš poprvé učil plavat?", "Tomáš a velká voda", [
    { value: "Plavání", why: "Příliš obecné, nezaujme." },
    { value: "Tomáš se naučil plavat", why: "Prozradí konec." },
    { value: "Moje kolo", why: "S příběhem nesouvisí." },
  ], {
    hints: ["Který nadpis vzbudí zvědavost a přitom neprozradí konec?", "Dobrý nadpis se týká příběhu, je krátký a zajímavý, ale nevyzradí, jak to dopadne."],
    explanation: "Tomáš a velká voda se týká příběhu a konec neprozradí.",
  }),
  choice("Jak nejlépe opravit větu „Pes běžel a pes štěkal a pes skákal.“?", "Pes běžel, štěkal a skákal.", [
    { value: "Pes běžel a pes štěkal.", why: "Pořád opakuje pes a navíc něco vynechává." },
    { value: "Běžel štěkal skákal.", why: "Chybí podmět i čárky." },
    { value: "Pes běžel a štěkal a skákal a pes.", why: "Opakování zůstalo a věta je horší." },
  ], {
    hints: ["Které slovo se ve větě zbytečně opakuje?", "Stejný podmět stačí napsat jednou; slovesa pak oddělíš čárkou a před poslední dáš spojku a."],
    explanation: "Podmět jednou, slovesa oddělená čárkou: Pes běžel, štěkal a skákal.",
  }),
  choice("Co musí mít každý příběh, aby byl zajímavý?", "problém nebo zápletku, kterou postava řeší", [
    { value: "co nejvíc postav", why: "Počet postav zajímavost nezaručí." },
    { value: "hodně popisů počasí", why: "Popisy děj nenesou." },
    { value: "stejný začátek jako jiný příběh", why: "Opakování cizího začátku nezaujme." },
  ], {
    hints: ["O čem by byl příběh, kdyby se v něm nic nestalo?", "Napětí vznikne, když postava musí překonat nějakou překážku."],
    explanation: "Bez problému, který se řeší, příběh nemá napětí.",
  }),
  choice("Co uděláš, když dopíšeš svůj příběh?", "přečtu ho znovu a opravím chyby", [
    { value: "hned ho vyhodím", why: "Tím práci zahodíš." },
    { value: "nic, je hotový", why: "V hotovém textu často zůstanou chyby." },
    { value: "přepíšu ho celý jinak bez čtení", why: "Bez čtení nevíš, co opravit." },
  ], {
    hints: ["Jak zjistíš, jestli se ti v textu něco nepovedlo?", "Hotový text si pomalu projdi, hledej překlepy, opakovaná slova a místa, kde něco chybí."],
    explanation: "Po dopsání text znovu přečteme a opravíme.",
  }),
  choice("Který verš se rýmuje s veršem „Na zahradě roste mák,“?", "u plotu sedí malý pták.", [
    { value: "v trávě běží malý pes.", why: "Pes se s mák nerýmuje." },
    { value: "v okně svítí lampa.", why: "Lampa se s mák nerýmuje." },
    { value: "u plotu sedí kočka.", why: "Kočka se s mák nerýmuje." },
  ], {
    hints: ["Jak zní konec slova mák?", "Rým znamená, že konce veršů zní stejně: mák — …ák."],
    explanation: "Mák — pták: konce veršů zní stejně.",
  }),
  choice("Co je nejlepší první krok, když máš napsat pohádku na téma odvaha?", "vymyslet postavu, její problém a jak ho vyřeší", [
    { value: "hned začít psát bez přemýšlení", why: "Bez plánu se příběh snadno rozpadne." },
    { value: "opsat hotovou pohádku z knihy", why: "To není vlastní text." },
    { value: "nejdřív nakreslit obálku knihy", why: "Obálka příběh nevymyslí." },
  ], {
    hints: ["Co potřebuješ vědět, než napíšeš první větu?", "Plán příběhu: kdo bude hlavní hrdina, co ho potká a jak se s tím vypořádá."],
    explanation: "Nejdřív plán: postava, problém, řešení.",
  }),
  choice("Která věta nejlépe ukáže, jak vypadá zimní les?", "Stromy se prohýbaly pod čepicemi sněhu a všude bylo ticho.", [
    { value: "V lese byla zima a byl tam sníh.", why: "Pravda, ale čtenář les nevidí." },
    { value: "Les byl velký a byly v něm stromy.", why: "Obecné, nic zvláštního." },
    { value: "Šel jsem lesem domů a pak jsem jedl.", why: "Vypráví děj, les nepopisuje." },
  ], {
    hints: ["Ve které větě les skoro vidíš a slyšíš?", "Živý popis používá přesná slova, obraznost a smysly — co vidíš, slyšíš, cítíš."],
    explanation: "Čepice sněhu a ticho vytvoří obraz zimního lesa.",
  }),
  choice("Který konec se hodí k pohádce?", "A žili šťastně až do smrti.", [
    { value: "Pokračování příště.", why: "Pohádka má uzavřený konec." },
    { value: "Recept je hotový.", why: "To je konec návodu." },
    { value: "Zítra bude pršet.", why: "To je předpověď počasí." },
  ], {
    hints: ["Jak obvykle končí pohádky?", "Pohádky mají ustálené závěry, které říkají, že dobro zvítězilo a všechno se obrátilo k lepšímu."],
    explanation: "A žili šťastně až do smrti je typický pohádkový konec.",
  }),
  choice("Čím obvykle končí bajka?", "ponaučením, co si z příběhu vzít", [
    { value: "veselou písničkou", why: "Písnička do bajky nepatří." },
    { value: "seznamem postav", why: "Seznam postav není konec." },
    { value: "přáním všeho nejlepšího", why: "To patří do přání, ne do bajky." },
  ], {
    hints: ["Co si má čtenář z bajky odnést?", "Na konci bajky často stojí věta, která říká, jak se správně chovat — třeba Kdo jinému jámu kopá, sám do ní padá."],
    explanation: "Bajka končí ponaučením.",
  }),
  choice("Chceš, aby postavy v tvém příběhu mluvily. Jak to zapíšeš?", "přímou řečí v uvozovkách", [
    { value: "jen číslicemi", why: "Číslice řeč nezapíšou." },
    { value: "velkými písmeny bez uvozovek", why: "Velká písmena řeč neoznačují." },
    { value: "pod čarou jako poznámku", why: "Poznámka pod čarou je pro vysvětlivky." },
  ], {
    hints: ["Jak se v textu pozná, co postava řekla přesně svými slovy?", "Slova postavy dáváme do „…“ a uvozovací věta (řekl, zeptala se) je od nich oddělená."],
    explanation: "Slova postav píšeme jako přímou řeč v uvozovkách.",
  }),
  choice("Proč je dobré v příběhu střídat slova jako řekl, zašeptal, vykřikl?", "čtenář lépe pozná, jak postava mluvila", [
    { value: "aby byl text delší", why: "Nejde o délku." },
    { value: "protože řekl je sprosté slovo", why: "Řekl sprosté není, jen se opakuje." },
    { value: "aby se čtenář nudil", why: "Naopak — text je zajímavější." },
  ], {
    hints: ["Co se dozvíš ze slova zašeptal, co ze slova řekl nevyčteš?", "Přesné sloveso ukáže náladu i hlasitost — jestli se mluvčí bojí, zlobí, nebo tajně radí."],
    explanation: "Přesné sloveso ukáže, jak kdo mluvil.",
  }),
  choice("Jak vybrat téma pro vlastní báseň?", "o něčem, co dobře znám a co ve mně vyvolává pocity", [
    { value: "o něčem, co mě vůbec nezajímá", why: "Bez zájmu se píše těžko." },
    { value: "jen o tom, co vybere spolužák", why: "Vlastní báseň má být tvoje." },
    { value: "o něčem, o čem nic nevím", why: "O neznámém se píše těžko." },
  ], {
    hints: ["O čem se ti bude psát nejlépe?", "Báseň vyjadřuje dojmy a nálady; nejsnáz píšeš o tom, co sám nebo sama prožíváš."],
    explanation: "Nejlépe se píše o tom, co známe a co v nás budí pocity.",
  }),
];

const L3: PracticeTask[] = [
  ["Byl tam pes. Ten pes byl velký. Ten pes byl černý.", "Byl tam velký černý pes.", ["Byl tam pes, pes byl velký a černý pes.", "Pořád opakuje pes."], ["Byl tam malý bílý pes.", "Mění, jaký pes byl."], ["Byl tam velkej černej pes.", "Velkej a černej jsou nespisovné tvary."], "Kolikrát se ve třech větách opakuje stejné podstatné jméno?", "Věty o téže věci můžeš spojit: vlastnosti dáš jako přídavná jména před podstatné jméno."],
  ["A pak jsme šli domů a pak jsme jedli a pak jsme spali.", "Pak jsme šli domů, najedli se a nakonec usnuli.", ["A pak jsme šli domů a pak jedli a pak spali.", "A pak se pořád opakuje."], ["Šli jsme do školy a nejedli jsme.", "Mění, co se stalo."], ["Pak jsme šli domů najedli se nakonec usnuli.", "Chybí čárky a spojka."], "Které spojení se ve větě pořád opakuje?", "Slova pro časovou posloupnost střídej (nejdřív, potom, nato) a několik sloves za sebou odděl čárkou."],
  ["Princezna byla hezká.", "Princezna měla dlouhé zlaté vlasy a smála se jako zvoneček.", ["Princezna byla hezká, opravdu moc hezká.", "Jen opakuje hodnocení."], ["Princezna byla ošklivá a zlá jako čarodějnice.", "Mění, jaká princezna byla."], ["Princezna byla hezká a byla to princezna.", "Nic nového nepřidává."], "Podle čeho by čtenář poznal, jak ta dívka vypadá?", "Místo obecného hodnocení ukaž konkrétní podrobnosti — vzhled, pohyb, hlas; pomůže i přirovnání."],
  ["Bylo to fakt super a moc jsme se nasmáli.", "Bylo to skvělé a moc jsme se nasmáli.", ["Bylo to fakt super.", "Hovorové slovo zůstalo a část věty zmizela."], ["Bylo to nudné a nikdo se nesmál.", "Mění smysl."], ["Bylo to fakt skvělý a moc jsme se nasmáli.", "Fakt a skvělý jsou hovorové."], "Které slovo je hovorové a do psaného textu se nehodí?", "V literárním textu (mimo přímou řeč) píšeme spisovně: místo hovorových výrazů volíme spisovná slova se stejným významem."],
  ["Drak byl strašný.", "Drak chrlil oheň a jeho řev otřásal skalami.", ["Drak byl strašný a strašný.", "Jen opakuje slovo."], ["Drak byl hodný a veselý.", "Mění, jaký drak byl."], ["Drak byl strašnej.", "Strašnej je nespisovné."], "Co by ta obluda musela dělat, aby se jí čtenář opravdu bál?", "Nepiš jen, že je něco strašné — ukaž to činy a zvuky, které strach vyvolají."],
  ["Ahoj, řekla Eva. Ahoj, řekl Petr.", "„Ahoj,“ pozdravila Eva. „Ahoj,“ odpověděl Petr.", ["Ahoj, řekla Eva a ahoj, řekl Petr.", "Chybí uvozovky, řeč postav nepoznáme."], ["„Ahoj,“ pozdravila Eva. „Nazdar,“ odpověděla Eva.", "Mluví jen Eva, Petr zmizel."], ["„Ahoj“ řekla Eva „ahoj“ řekl Petr", "Chybí čárky a tečky."], "Jak čtenář pozná, která slova postava přímo řekla?", "Přímou řeč dej do uvozovek a místo opakovaného řekl zkus sloveso, které řekne víc (zeptal se, zašeptal, zavolal)."],
  ["Ráno. Škola. Test. Špatná známka.", "Ráno šel Filip do školy, psal test a dostal špatnou známku.", ["Ráno škola test špatná známka.", "Pořád to nejsou věty."], ["Ráno šel Filip do školy a dostal jedničku.", "Mění, jak to dopadlo."], ["Ráno, škola, test, a pak špatná známka.", "Stále jen hesla bez sloves."], "Co v zápisu chybí, aby z něj byly celé věty?", "Z heslovitých poznámek uděláš vyprávění, když doplníš, kdo co dělal — tedy slovesa a podmět."],
  ["Měsíc svítil.", "Měsíc svítil nad lesem jako stříbrná lucerna.", ["Měsíc svítil a pořád jen svítil a svítil.", "Opakování obraz nevytvoří."], ["Slunce jasně svítilo nad celým lesem.", "Mění, co svítilo."], ["Měsíc svítil moc a bylo to moc hezké.", "Obecné hodnocení bez obrazu."], "Jak můžeš čtenáři ukázat, jak ten svit vypadal?", "Obraz oživí místo děje a přirovnání — k čemu se podobá světlo v noci?"],
  ["Dědeček byl starý. Byl dobrý. Vyprávěl pohádky.", "Starý laskavý dědeček nám rád vyprávěl pohádky.", ["Dědeček byl starý, byl dobrý, byl.", "Opakuje byl a věta nedává smysl."], ["Mladý přísný dědeček nevyprávěl nic.", "Mění smysl."], ["Starej hodnej děda vyprávěl pohádky.", "Starej a hodnej jsou nespisovné."], "Jak spojit tři krátké věty o téže osobě do jedné?", "Vlastnosti dej jako přídavná jména před podstatné jméno a spisovný tvar zachovej."],
  ["Kočka udělala skok na stůl a udělala pád do misky.", "Kočka skočila na stůl a spadla do misky.", ["Kočka udělala skok na stůl a spadla.", "Udělala skok zůstalo a miska zmizela."], ["Pes skočil na stůl a spadl do misky.", "Mění zvíře."], ["Kočka skočila na stůl a udělala pád.", "Udělala pád zůstalo."], "Které sloveso se ve větě opakuje a je zbytečně obecné?", "Místo udělat skok, udělat pád napiš jedno přesné sloveso, které to řekne samo."],
  ["Bylo to hrozně moc strašně napínavé.", "Bylo to neuvěřitelně napínavé.", ["Bylo to hrozně moc napínavé.", "Pořád se hromadí zesilující slova."], ["Bylo to nudné.", "Mění smysl."], ["Bylo to strašně hrozně moc napínavé.", "Jen přeházené, hromadění zůstalo."], "Kolik zesilujících slov se ve větě hromadí?", "Hromadění slov jako hrozně, moc, strašně text neoživí; stačí jedno výstižné slovo."],
  ["Tonda byl smutný, protože byl smutný, že ztratil míč.", "Tonda byl smutný, protože ztratil míč.", ["Tonda byl smutný, protože byl smutný.", "Příčina zmizela a zůstalo opakování."], ["Tonda byl veselý, protože našel míč.", "Mění smysl."], ["Tonda byl smutný, že byl smutný.", "Opakování zůstalo."], "Co se ve větě říká dvakrát?", "Příčinu stačí napsat jednou — za spojku dej to, co se opravdu stalo."],
  ["V lese bylo ticho. V lese byla tma. V lese byla zima.", "V lese bylo ticho, tma a zima.", ["V lese bylo ticho a v lese byla tma.", "Opakování zůstalo a zima zmizela."], ["V lese bylo veselo a teplo.", "Mění smysl."], ["Ticho tma zima les.", "Není to věta."], "Která slova se na začátku každé věty opakují?", "Tři věty se stejným začátkem spoj do jedné a jednotlivé jevy odděl čárkou."],
].map(([veta, klic, d1, d2, d3, h0, h1]) => {
  const ds = [d1, d2, d3] as [string, string][];
  return choice(`Která úprava textu „${veta as string}“ je nejlepší?`, klic as string,
    ds.map(([value, why]) => ({ value, why })) as never,
    { hints: [h0 as string, h1 as string], explanation: `„${klic as string}“ říká totéž, ale lépe — bez zbytečného opakování, spisovně a výstižně.` });
});

function gen(level: number): PracticeTask[] {
  if (level >= 3) return shuffle(L3);
  if (level === 2) return shuffle(L2);
  return urceni(NAPADY, ZANRY, 1, (p) => ({
    question: `Jaký žánr zvolíš pro tento nápad? ${p.veta}`,
    hints: [
      `Jsou v nápadu „${p.veta.slice(0, 50)}…“ kouzla, zvířata s poučením, obyčejná příhoda, nebo verše?`,
      `Pomůže tohle: ${p.klic}.`,
    ],
  }), ["Kouzla ukazují na vymyšlený svět, poučení na příběh se zvířaty, obyčejná příhoda na život kolem nás.", "Verše a rým prozradí text psaný po řádcích."]);
}

export const VLASTNILITERARNITEXTNADANETEMA: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-text-na-dane-tema",
    rvpNodeId: "g5-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-text-na-dane-tema",
    title: "Vlastní literární text na dané téma",
    studentTitle: "Vlastní text",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s textem",
    briefDescription: "Vytvoříš vlastní literární text a pochopíš, jak na to.",
    keywords: ["vlastní text", "tvorba", "pohádka", "povídka", "báseň", "žánr", "téma"],
    goals: [
      "Vybrat vhodný žánr a téma pro vlastní text",
      "Sestavit osnovu a napsat vlastní literární text",
      "Opravit a zdokonalit napsaný text",
    ],
    boundaries: [
      "Bez hodnocení vlastní tvůrčí práce AI",
      "Úroveň 3: úprava vlastního textu (opakování, spisovnost, přesná slova); bez odborné teorie",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Postup tvorby textu: 1. Vyber žánr (pohádka, povídka, báseň). 2. Urči téma. 3. Sestav osnovu. 4. Piš. 5. Oprav a zlepši.",
      steps: [
        "Vyber žánr: pohádka, povídka nebo báseň.",
        "Urči téma: o čem to bude.",
        "Vymysli postavy, prostředí a děj.",
        "Sestav osnovu (plán).",
        "Piš a použij přímou řeč pro oživení.",
        "Přečti nahlas a oprav.",
      ],
      commonMistake: "Žáci začnou psát bez plánu a příběh se rozpadne nebo nemá závěr. Osnova pomáhá.",
      example: "Téma: ztracený pes. Žánr: povídka. Osnova: Pavel najde psa → hledají majitele → šťastné setkání.",
    },
  },
];
