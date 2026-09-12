import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Chybná možnost = konkrétní typická chyba + vysvětlení, proč právě ta nesedí. */
interface Chybna {
  o: string;
  why: string;
}

/**
 * Výběrová úloha s kompletní dokumentací (CONTENT_AUTHORING §0):
 * dvě vlastní nápovědy, vysvětlení PROČ a zpětná vazba u KAŽDÉ chybné možnosti.
 */
function q(
  question: string,
  correctAnswer: string,
  chybne: [Chybna, Chybna, Chybna],
  hints: [string, string],
  explanation: string,
): PracticeTask {
  const optionFeedback: Record<string, string> = {};
  for (const c of chybne) optionFeedback[c.o] = c.why;
  return {
    question,
    correctAnswer,
    options: shuffle([correctAnswer, ...chybne.map((c) => c.o)]),
    optionFeedback,
    hints,
    explanation,
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolovaná fakta (výpar, oblaka, skupenství, pitná voda,
//                    kyslík, dusík, vznik půdy, život v půdě)
//   L2 = aplikace:   koloběh vody jako sled dějů, konkrétní šetření vodou,
//                    fotosyntéza jako využití CO₂, znečištění vzduchu, eroze
//   L3 = transfer:   propojení 2 konceptů (dýchání ↔ fotosyntéza, eroze
//                    jako příčina-důsledek, chybějící krok koloběhu, voda/
//                    vzduch/půda jako základ potravního řetězce)
//
// Opraveno 2026-09-12 (inventura obsahu): doplněna zpětná vazba u všech
// chybných možností a odstupňované nápovědy (velká je podrobnější a delší).
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  q(
    "Co se stane s vodou v rybníce, když ji celý den zahřívá slunce?",
    "Vypaří se a stoupá jako neviditelná pára do vzduchu",
    [
      { o: "Zůstane v rybníce úplně beze změny", why: "Slunce hladinu zahřívá, takže se něco dít musí — v horku hladina klesá." },
      { o: "Promění se rovnou v led", why: "Led vzniká při mrazu, ne při zahřívání." },
      { o: "Vsákne se hluboko pod zem", why: "Dno rybníka je utěsněné bahnem. V horkém dni ubývá voda hlavně z hladiny." },
    ],
    [
      "Vzpomeň si, co se děje s vodou v hrnci na rozpáleném sporáku.",
      "Nad hrncem se objeví obláček a vody v něm ubývá, i když ji nikdo nevylévá. Totéž dělá slunce s rybníkem, jen mnohem pomaleji a bez bublání. Zamysli se, kam se voda z hladiny může podít a kudy z rybníka odchází.",
    ],
    "Sluneční teplo mění vodu na neviditelnou vodní páru, která stoupá do vzduchu. Tomuto ději říkáme výpar a je prvním krokem koloběhu vody.",
  ),
  q(
    "Co se stane s vodou v louži po dešti, když na ni celé odpoledne svítí slunce?",
    "Postupně se vypaří a promění se v páru",
    [
      { o: "Zůstane stejně velká", why: "Na slunci louže viditelně ubývá, od kraje se zmenšuje." },
      { o: "Promění se v led", why: "Led vzniká při mrazu, ne na rozpáleném chodníku." },
      { o: "Změní se na sníh", why: "Sníh padá z mraků v zimě, na chodníku v létě nevzniká." },
    ],
    [
      "Louže na slunci po pár hodinách zmizí — kam se poděla?",
      "Voda se nemůže jen tak ztratit, může jen změnit skupenství. Teplo jí dodá energii, takže se z hladiny uvolní drobné neviditelné částečky a odejdou do ovzduší. Zmizet takhle může jen tam, kde je tepleji, ne chladněji.",
    ],
    "Teplo ze slunce způsobí výpar — voda z louže se promění ve vodní páru a stoupá do vzduchu, i když ji nevidíme.",
  ),
  q(
    "Co vznikne, když se stoupající vodní pára vysoko v atmosféře ochladí?",
    "Oblaka — drobné kapičky vody",
    [
      { o: "Rovnou déšť bez oblaků", why: "Déšť padá až z oblaku, ne přímo z páry." },
      { o: "Sníh, i v létě", why: "Sníh v létě roztaje ještě ve vzduchu, k zemi dopadá jen v zimě." },
      { o: "Duha", why: "Duha vzniká lomem světla v dešťových kapkách, ne ochlazením páry." },
    ],
    [
      "Podívej se na oblohu — co je na ní bílé nebo šedé?",
      "Ve výšce je chladněji, a tak se neviditelné částečky páry znovu spojí do maličkých kuliček. Těch je tolik a jsou tak blízko u sebe, že je uvidíš jako bílý chomáč. Teprve když se spojí do větších kapek, začne pršet.",
    ],
    "Vysoko v atmosféře je chladno, a tak se vodní pára mění zpět na drobné kapičky vody. Ty se shlukují a vytvářejí oblaka.",
  ),
  q(
    "Jak nazýváme drobné kapičky vody, které se vznášejí vysoko na obloze?",
    "Oblaka",
    [
      { o: "Srážky", why: "Srážky už padají k zemi, ve výšce se nevznášejí." },
      { o: "Ledovce", why: "Ledovec je obrovská masa ledu v horách nebo u pólů." },
      { o: "Mlha nad zemí", why: "Mlha se drží při zemi, ne vysoko na obloze." },
    ],
    [
      "Hledej slovo pro to bílé, co je v létě vidět nad krajinou.",
      "V zadání je řečeno, že se to vznáší vysoko a je to složené z kapiček. Slova, která popisují padání k zemi nebo led v horách, proto neodpovídají. Zbývá jediný pojem pro bílé chomáče na letní obloze.",
    ],
    "Oblaka tvoří drobné kapičky vody nebo ledové krystalky, které vznikly ochlazením vodní páry.",
  ),
  q(
    "Která tři skupenství vody známe?",
    "Kapalné (voda), pevné (led) a plynné (pára)",
    [
      { o: "Teplé, studené a vlažné", why: "To je teplota, ne skupenství." },
      { o: "Mořské, říční a dešťové", why: "To je původ vody, ne její skupenství." },
      { o: "Pitné, užitkové a odpadní", why: "To je rozdělení podle použití, ne podle skupenství." },
    ],
    [
      "Vzpomeň si na kostku v mrazáku a na obláček nad hrncem.",
      "Skupenství popisuje, jestli látka drží tvar, roztéká se, nebo se rozpíná do prostoru. Vyjmenuj si tři podoby, ve kterých vodu běžně potkáš, a hledej možnost, která mluví právě o podobách, ne o teplotě nebo o použití.",
    ],
    "Voda může být kapalná (voda v řece), pevná (led) nebo plynná (vodní pára). Skupenství se mění podle teploty.",
  ),
  q(
    "Ve kterém skupenství je led?",
    "V pevném skupenství",
    [
      { o: "V kapalném skupenství", why: "Kapalina se roztéká a tvar nedrží, led ano." },
      { o: "V plynném skupenství", why: "Plyn vyplní celý prostor, led si drží svůj tvar." },
      { o: "V žádném skupenství", why: "Každá látka je vždy v nějakém skupenství." },
    ],
    [
      "Led můžeš vzít do ruky a drží si svůj tvar.",
      "Rozhodni podle chování látky: kapalina se rozteče po stole, plyn se rozptýlí po celé místnosti a třetí možnost si tvar udrží sama. Zkus si představit kostku z mrazáku položenou na talíř.",
    ],
    "Led je voda v pevném skupenství — má stálý tvar, dokud ho nezahřejeme nad nulu.",
  ),
  q(
    "Ve kterém skupenství je vodní pára?",
    "V plynném skupenství",
    [
      { o: "V pevném skupenství", why: "Pevná látka drží tvar, pára ne." },
      { o: "V kapalném skupenství", why: "Kapalinu nalijeme do sklenice, páru nalít nelze." },
      { o: "Není to skupenství vody", why: "Pára je jednou ze tří podob vody." },
    ],
    [
      "Pára nemá vlastní tvar a rozptýlí se po celé místnosti.",
      "Zkus si představit, co se stane, když nad hrncem sundáš pokličku. Obsah se okamžitě rozlétne do všech stran a nikde se nezastaví. Takhle se chová jen jedno ze tří skupenství — to, které nemá vlastní tvar ani objem.",
    ],
    "Vodní pára je voda v plynném skupenství — je neviditelná a rozptyluje se ve vzduchu.",
  ),
  q(
    "Co je pitná voda?",
    "Voda čistá a bezpečná, kterou můžeme pít",
    [
      { o: "Voda z moře, která je slaná", why: "Mořská voda se pít nedá, po slané vodě je člověku ještě hůř." },
      { o: "Voda, která teče jen z kohoutku", why: "Pitná voda je i ve studni nebo v láhvi, nejen v kohoutku." },
      { o: "Jakákoli voda v přírodě", why: "Voda z potoka může obsahovat bakterie a nečistoty." },
    ],
    [
      "Rozhoduje, jestli se dá bez obav napít.",
      "Nejde o to, odkud voda teče, ale jestli v ní nejsou bakterie, sůl a škodlivé látky. Voda z kohoutku i ze studny může být dobrá i špatná — záleží na rozboru. Hledej proto možnost, která mluví o nezávadnosti.",
    ],
    "Pitná voda je čistá a nezávadná, takže se dá bez obav pít. Mořská voda je slaná a voda z potoka může obsahovat bakterie.",
  ),
  q(
    "Proč potřebujeme kyslík ze vzduchu?",
    "Bez kyslíku nemůžeme dýchat a žít",
    [
      { o: "Kyslík nám zahřívá tělo", why: "Teplo si tělo vytváří ze stravy, ne přímo z dýchání." },
      { o: "Kyslík nám dává energii jako jídlo", why: "Energii dodává jídlo, kyslík pomáhá ji z jídla uvolnit." },
      { o: "Bez kyslíku bychom jen hůř viděli", why: "Bez kyslíku by se zastavilo celé tělo, nejen zrak." },
    ],
    [
      "Zkus si na chvilku zadržet dech a zamysli se, co se stane.",
      "Zadržet dech vydrží člověk jen krátce a pak ho tělo samo donutí nadechnout se. Kdyby šlo jen o teplo nebo o lepší zrak, tak naléhavé by to nebylo. Hledej proto možnost, která mluví o ohrožení života.",
    ],
    "Kyslík přijímáme při dýchání do plic a krev ho rozvádí po celém těle. Bez něj bychom zemřeli během několika minut.",
  ),
  q(
    "Která složka vzduchu tvoří jeho největší část?",
    "Dusík",
    [
      { o: "Kyslík", why: "Kyslík tvoří jen asi pětinu vzduchu." },
      { o: "Oxid uhličitý", why: "Oxidu uhličitého je ve vzduchu jen nepatrné množství." },
      { o: "Vodní pára", why: "Množství vodní páry kolísá, největší část vzduchu ale netvoří nikdy." },
    ],
    [
      "Největší díl netvoří plyn, který při dýchání spotřebováváme.",
      "Vzduch si představ jako pět stejných dílů. Jeden z nich zabírá plyn potřebný k dýchání a všechny zbývající čtyři patří plynu, který s naším tělem skoro vůbec nereaguje. Hledej proto tu tichou většinu.",
    ],
    "Vzduch tvoří asi ze čtyř pětin dusík a z jedné pětiny kyslík. Zbytek jsou jiné plyny, například oxid uhličitý.",
  ),
  q(
    "Jak vzniká půda?",
    "Rozkladem hornin a odumřelých rostlin a živočichů",
    [
      { o: "Vysycháním mořské vody", why: "Vysycháním moře vzniká sůl, ne půda." },
      { o: "Smícháním písku s vodou", why: "Z písku a vody vznikne bláto, ne úrodná půda." },
      { o: "Rostliny ji vyrábějí z listů", why: "Spadané listí se musí nejdřív rozložit, sama rostlina půdu nevyrobí." },
    ],
    [
      "Trvá to tisíce let a podílejí se na tom dvě různé věci.",
      "Podívej se na starý kámen v lese: mráz a voda ho pomalu drobí na menší kousky. Zároveň se na zem snáší listí a mrtví brouci, které rozloží houby a bakterie. Když se obojí smíchá, vznikne přesně to, co hledáme.",
    ],
    "Půda vzniká velmi dlouho: horniny se drobí a rozpadají, odumřelé rostliny a živočichové se rozkládají. Ze směsi obojího se stává úrodná půda.",
  ),
  q(
    "Kdo žije v půdě a pomáhá ji kypřit?",
    "Žížaly a drobné mikroorganismy",
    [
      { o: "Ryby a raci", why: "Ryby a raci žijí ve vodě, ne v půdě." },
      { o: "Ptáci a motýli", why: "Ptáci i motýli se pohybují ve vzduchu, půdu nekypří." },
      { o: "Houby a lišejníky na kamenech", why: "Lišejníky rostou na povrchu kamenů, do půdy se nezavrtávají." },
    ],
    [
      "Po dešti je uvidíš na chodníku — jsou růžové a protáhlé.",
      "Hledej tvory, kteří se zemí prokousávají chodbičky a tím ji provzdušňují. Vedle nich pracují ještě tak drobné organismy, že je pouhým okem nezahlédneš, a ty rozkládají zbytky na živiny.",
    ],
    "Žížaly prokopávají půdu a provzdušňují ji, mikroorganismy rozkládají odumřelé látky na živiny. Bez nich by půda nebyla úrodná.",
  ),
  q(
    "Co se stane s vodou, když teplota klesne pod nulu?",
    "Zmrzne a změní se v led",
    [
      { o: "Vypaří se rychleji", why: "Výpar zesiluje teplo, ne mráz." },
      { o: "Zůstane kapalná i v mrazu", why: "Při mrazu voda tuhne — proto na rybníce vzniká souvislá vrstva." },
      { o: "Změní se rovnou v páru", why: "Aby vznikla pára, musí se voda zahřát, ne ochladit." },
    ],
    [
      "Vzpomeň si, jak vypadá rybník v lednu.",
      "Při ochlazování se drobné částečky vody zpomalují, až se spojí do pevné mřížky. Tehdy látka ztratí schopnost téct a udrží si vlastní tvar. Přesně to se stane s kalužemi po mrazivé noci.",
    ],
    "Při teplotě pod nulou voda tuhne a mění se v led, tedy do pevného skupenství. Proto v zimě zamrzají louže i hladiny rybníků.",
  ),
];

const POOL_L2: PracticeTask[] = [
  q(
    "Řeka teče, slunce ji zahřívá a nakonec zase prší do řeky. Jak se jmenuje celý tento sled dějů?",
    "Koloběh vody",
    [
      { o: "Eroze půdy", why: "Eroze je odnášení zeminy, ne opakující se cesta kapky přírodou." },
      { o: "Fotosyntéza", why: "Fotosyntéza je výroba potravy v listech rostliny." },
      { o: "Znečištění vzduchu", why: "Znečištění vzduchu způsobují zplodiny, s tímto dějem nesouvisí." },
    ],
    [
      "Hledáš název pro děj, který se pořád dokola opakuje.",
      "Vypař se, stoupni do výšky, spadni jako déšť a vrať se řekou do moře — a pak celé znovu. Takový uzavřený kruh v přírodě popisujeme jen u jediné látky. Název se skládá ze slova pro pohyb v kruhu a z názvu té látky.",
    ],
    "Voda se vypařuje z moří a řek, stoupá jako pára, tvoří oblaka, padá jako srážky a řekami se vrací zpět. Tomuto opakujícímu se sledu dějů říkáme koloběh vody.",
  ),
  q(
    "Sníh na horách taje, voda stéká potokem do řeky a řeka teče do moře. Co bude s touto vodou dál?",
    "Vypaří se, vytvoří oblaka a znovu spadne jako srážky",
    [
      { o: "Navždy zůstane jen v moři", why: "Slunce hladinu moře zahřívá a voda se z ní odpařuje dál." },
      { o: "Promění se v led na dně moře", why: "Na mořském dně je sice chladno, ale led tam nevzniká." },
      { o: "Zmizí beze stopy", why: "Voda nikdy nemizí, jen mění skupenství a místo." },
    ],
    [
      "Moře není konečná stanice — přemýšlej, co s vodou udělá slunce.",
      "Sleduj cestu jedné kapky i za hranicí moře. Slunce ji zahřeje, ona stoupne vzhůru, ve výšce se ochladí a spojí s dalšími do bílých chomáčů. Odtud se jednou vrátí zpátky na zem a celá cesta začne nanovo.",
    ],
    "Voda z moře se vlivem slunce vypařuje, stoupá jako pára, tvoří oblaka a znovu padá jako srážky. Koloběh se tak stále opakuje.",
  ),
  q(
    "Které pořadí správně popisuje koloběh vody?",
    "Výpar, oblaka, srážky (déšť/sníh), řeky, moře",
    [
      { o: "Srážky, výpar, moře, oblaka, řeky", why: "Srážky nemohou být první — nejdřív musí vzniknout oblaka." },
      { o: "Oblaka, moře, výpar, řeky, srážky", why: "Oblaka nevzniknou dřív, než se voda odpaří." },
      { o: "Řeky, srážky, moře, výpar, oblaka", why: "Řeka odvádí vodu až po dešti, na začátku stát nemůže." },
    ],
    [
      "Začni tím dějem, který způsobuje teplo ze slunce.",
      "Sestav pořadí podle příčin: teplo nejdřív promění hladinu v páru, pára pak ve výšce zchladne a vytvoří bílé chomáče, z nich teprve něco spadne dolů a odteče zpátky do moře. Každý krok musí navazovat na ten předchozí.",
    ],
    "Koloběh začíná výparem, pokračuje vznikem oblaků, pádem srážek a odtokem řekami zpět do moře. Pořadí kroků nelze zaměnit, protože každý vychází z předchozího.",
  ),
  q(
    "Při čištění zubů necháváš zbytečně téct vodu z kohoutku. Jak šetříš vodou správně?",
    "Zavřu kohoutek, dokud si čistím zuby kartáčkem",
    [
      { o: "Nechám kohoutek pořád téct, ať mi nic neuteče", why: "Tekoucí voda odteče rovnou do odpadu, nic tím nezískáš." },
      { o: "Pustím vodu naplno, ať to rychle skončí", why: "Kohoutek puštěný naplno spotřebuje ještě víc vody." },
      { o: "Čistím si zuby déle, aby voda víc odtekla", why: "Delší čištění při puštěném kohoutku spotřebu jen zvýší." },
    ],
    [
      "Rozhodni, kdy vodu opravdu potřebuješ a kdy jen odtéká pryč.",
      "Vodu využiješ jen dvakrát — na namočení kartáčku na začátku a na opláchnutí na konci. Mezi tím ti proud k ničemu neslouží. Hledej proto možnost, která řeší právě tuhle zbytečnou dobu.",
    ],
    "Při čištění zubů stačí voda jen na namočení a opláchnutí kartáčku. Zavřený kohoutek mezitím ušetří mnoho litrů denně.",
  ),
  q(
    "Chceš umýt nádobí a přitom šetřit vodou. Co je nejlepší způsob?",
    "Napustit dřez a mýt nádobí v něm, ne pod tekoucí vodou",
    [
      { o: "Nechat kohoutek téct po celou dobu mytí", why: "Během mytí odteče mnohem víc vody, než kolik se do dřezu vejde." },
      { o: "Umývat každý talíř zvlášť pod silným proudem", why: "Silný proud spotřebuje ze všech způsobů nejvíc vody." },
      { o: "Mýt nádobí venku na zahradě hadicí", why: "Hadice pouští ještě větší množství vody než kohoutek." },
    ],
    [
      "Porovnej vodu, která se využije opakovaně, s vodou, která hned odteče.",
      "Do napuštěného dřezu se vejde jen omezené množství, ale umyješ v něm celou várku talířů. Naopak z puštěného kohoutku odteče každou minutu několik litrů, které už nikdo nevyužije. Hledej proto způsob, u kterého se stejná voda použije víckrát.",
    ],
    "Když napustíme dřez, spotřebujeme mnohem méně vody než při mytí pod stále tekoucím kohoutkem.",
  ),
  q(
    "Kdy je nejlepší zalévat zahradu, aby se šetřilo vodou?",
    "Ráno nebo večer, kdy voda tolik nevysychá",
    [
      { o: "V poledne na plném slunci", why: "V poledne se velká část vody odpaří dřív, než ji rostlina využije." },
      { o: "Kdykoli, na tom nezáleží", why: "Na denní době záleží, rozdíl ve spotřebě je velký." },
      { o: "Jen když prší", why: "Když prší, zálivka není potřeba vůbec." },
    ],
    [
      "Rozhoduje teplota — kdy je slunce nejsilnější?",
      "Když je půda rozpálená, zálivka se z ní odpaří dřív, než ji kořeny stihnou nasát. Chladnější část dne naopak dá rostlině čas, aby se napila. Hledej proto možnost, která mluví o době, kdy slunce nepálí.",
    ],
    "V poledne slunce hodně hřeje a velká část zalité vody se rychle vypaří. Ráno nebo večer se voda lépe vsákne do půdy ke kořenům.",
  ),
  q(
    "Doma ti kape kohoutek, i když je zavřený. Co bys měl udělat, abys šetřil vodou?",
    "Upozornit dospělé, aby kohoutek opravili",
    [
      { o: "Nechat to tak, kapka přece nic neznamená", why: "Kapky se za den sečtou do mnoha litrů." },
      { o: "Pustit kohoutek naplno, ať přestane kapat", why: "Naplno puštěný kohoutek spotřebuje ještě mnohem víc vody." },
      { o: "Podložit umyvadlo kbelíkem a dál nic neřešit", why: "Chycená voda pomůže málo, závada zůstane a voda uniká dál." },
    ],
    [
      "Přemýšlej, jestli je lepší následek zmírnit, nebo příčinu odstranit.",
      "Jedna kapka za vteřinu udělá za den několik plných kbelíků. Sbírat je sice můžeš, ale netěsnící ventil tím nespravíš. Hledej proto možnost, po které kapání úplně přestane.",
    ],
    "Kapající kohoutek zbytečně vyplýtvá velké množství vody. Nejlepší je odstranit příčinu — nechat závadu opravit.",
  ),
  q(
    "Rostlina přijímá ze vzduchu oxid uhličitý, vodu z kořenů a energii ze slunečního světla. K čemu jí to všechno slouží?",
    "K fotosyntéze — výrobě vlastní potravy a kyslíku",
    [
      { o: "K dýchání stejně jako u lidí", why: "Dýchání probíhá i ve tmě a žádná potrava při něm nevzniká." },
      { o: "K ochlazování listů v horku", why: "List se ochladí odpařováním, světlo ani oxid uhličitý k tomu nepotřebuje." },
      { o: "K nasávání živin z kamenů", why: "Z kamenů rostlina živiny přímo nenasává, bere je z půdy." },
    ],
    [
      "Rostlina jako jediná umí ze tří jmenovaných věcí vytvořit jídlo.",
      "Poskládej si suroviny ze zadání: plyn ze vzduchu, tekutinu z kořenů a energii ze slunce. Z takové kombinace může vzniknout jedině vlastní strava. Hledej proto možnost, která mluví o výrobě, ne o chlazení nebo o dýchání.",
    ],
    "Při fotosyntéze rostlina pomocí slunečního světla promění oxid uhličitý a vodu na cukry, tedy svou potravu. Jako vedlejší produkt při tom uvolní kyslík.",
  ),
  q(
    "Co vzniká jako vedlejší produkt fotosyntézy a rostlina to vydává do vzduchu?",
    "Kyslík",
    [
      { o: "Oxid uhličitý", why: "Oxid uhličitý rostlina při fotosyntéze naopak spotřebovává." },
      { o: "Dusík", why: "Dusík ve vzduchu je, ale rostlina ho při fotosyntéze nevydává." },
      { o: "Vodní pára jen v noci", why: "Vodu rostlina odpařuje ve dne i v noci, s fotosyntézou to nesouvisí." },
    ],
    [
      "Ten plyn potřebují lidé i zvířata, aby mohli dýchat.",
      "Rostlina si při fotosyntéze vezme plyn, který my vydechujeme, a k tomu vodu. Z nich vyrobí cukr a jedna složka jí přebude. Právě tu vypustí ven — a bez ní bychom nepřežili ani pár minut.",
    ],
    "Při fotosyntéze rostliny spotřebovávají oxid uhličitý a jako vedlejší produkt uvolňují kyslík, který dýchají lidé i zvířata.",
  ),
  q(
    "Ve velkém městě je vzduch často znečištěný. Co ho znečišťuje nejvíc?",
    "Výfukové plyny z aut a kouř z továren",
    [
      { o: "Zpívání ptáků a šelest stromů", why: "Zvuk vzduch neznečišťuje." },
      { o: "Déšť a mlha", why: "Déšť vzduch naopak pročistí, protože prach spláchne k zemi." },
      { o: "Dýchání lidí a zvířat", why: "Při dýchání vzniká oxid uhličitý, ale saze ani jedovaté zplodiny ne." },
    ],
    [
      "Zamysli se, co vidíš stoupat nad rušnou silnicí nebo nad komínem.",
      "Při spalování benzinu, nafty nebo uhlí se uvolňují saze a jedovaté zplodiny. Hledej tedy zdroje, kde se něco spaluje — ne zvuky, ne počasí a ne obyčejné dýchání.",
    ],
    "Auta a továrny spalují palivo a vypouštějí do vzduchu škodlivé plyny a saze. To je hlavní příčina znečištění vzduchu ve městech.",
  ),
  q(
    "Proč rostlina bez úrodné půdy dobře neroste?",
    "Protože v půdě má kořeny, kterými čerpá vodu a živiny",
    [
      { o: "Protože půda rostlině dodává sluneční světlo", why: "Světlo přichází ze slunce shora, půda ho dodat nemůže." },
      { o: "Protože půda chrání rostlinu před deštěm", why: "Déšť dopadá shora a půda před ním nechrání." },
      { o: "Protože rostlina v půdě přes zimu spí", why: "Některé rostliny v zemi přezimují, tady ale jde o výživu." },
    ],
    [
      "Podívej se, která část rostliny je zapuštěná pod povrchem.",
      "Ta část se pod zemí větví do stran, drží rostlinu na místě a zároveň nasává. Kdyby v zemi nic užitečného nebylo, neměla by co dopravovat nahoru ke stonku a do listů.",
    ],
    "Kořeny drží rostlinu v zemi a zároveň z půdy čerpají vodu a živiny potřebné k růstu. Bez úrodné půdy má rostlina málo výživy.",
  ),
  q(
    "Na kopci vykáceli les a přišel silný déšť. Půda se začala odplavovat pryč. Jak se tomuto jevu říká?",
    "Eroze",
    [
      { o: "Fotosyntéza", why: "Fotosyntéza je výroba potravy v listech, s odnášením zeminy nesouvisí." },
      { o: "Koloběh vody", why: "Koloběh vody popisuje cestu vody přírodou, ne ztrátu zeminy." },
      { o: "Znečištění", why: "Znečištění je zamoření škodlivinami, ne odnos zeminy." },
    ],
    [
      "Hledáš odborný název pro odnášení zeminy vodou nebo větrem.",
      "Kořeny stromů a trav běžně drží zeminu na místě jako síť. Když je někdo odstraní, déšť ji snadno spláchne po svahu dolů. Ten děj má vlastní jednoslovný název, který se v přírodovědě používá.",
    ],
    "Eroze je odnášení půdy vodou nebo větrem. Bez stromů a rostlinného pokryvu, které zeminu drží kořeny, se po silném dešti půda snadno odplaví.",
  ),
  q(
    "Proč se v uzavřené místnosti plné lidí brzy hůř dýchá?",
    "Ubývá v ní kyslík a přibývá vydechovaný oxid uhličitý",
    [
      { o: "Protože se v ní hromadí dusík z dýchání", why: "Dusík lidé nevydechují víc, než kolik ho vdechnou." },
      { o: "Protože vzduch v místnosti přestane existovat", why: "Vzduch nezmizí, mění se jen jeho složení." },
      { o: "Protože se v místnosti vytvoří vodní pára místo vzduchu", why: "Vlhkost sice stoupne, ale pára vzduch nenahradí." },
    ],
    [
      "Zamysli se, co lidé ze vzduchu berou a co do něj naopak vracejí.",
      "Každý nádech odebere z místnosti část plynu potřebného k životu a každý výdech přidá plyn jiný. Když se vzduch nevymění za čerstvý, poměr obou plynů se postupně posune. Právě proto pomůže otevřít okno.",
    ],
    "Lidé při dýchání spotřebovávají kyslík a vydechují oxid uhličitý. V uzavřené místnosti proto kyslíku ubývá a oxidu uhličitého přibývá — vzduch je vydýchaný a je třeba vyvětrat.",
  ),
];

const POOL_L3: PracticeTask[] = [
  q(
    "Živočichové při dýchání spotřebovávají kyslík a vydechují oxid uhličitý. Rostliny při fotosyntéze spotřebovávají oxid uhličitý a uvolňují kyslík. Proč se říká, že si rostliny a živočichové navzájem „vyměňují“ plyny?",
    "Protože to, co jeden tvor vydechuje, druhý potřebuje k životu a naopak",
    [
      { o: "Protože živočichové i rostliny vydechují stejný plyn", why: "Kdyby vydávali totéž, k žádné výměně by nedocházelo." },
      { o: "Protože rostliny přes den vůbec nedýchají", why: "Rostliny dýchají neustále, přes den jen navíc fotosyntetizují." },
      { o: "Protože kyslík rostliny vůbec nepotřebují", why: "Kyslík potřebují i rostliny — dýchají jím, nejvíc v noci." },
    ],
    [
      "Porovnej, co jedna skupina organismů vydává a co druhá naopak potřebuje.",
      "Vezmi si zadání po částech: živočich spotřebuje jeden plyn a uvolní druhý, rostlina to má přesně obráceně. Když si obě dvojice položíš vedle sebe, uvidíš, že si organismy navzájem dodávají přesně to, co ta druhá strana potřebuje.",
    ],
    "Živočichové dýcháním spotřebovávají kyslík a produkují oxid uhličitý, který rostliny využívají k fotosyntéze. Rostliny naopak uvolňují kyslík, který dýchají živočichové. Proto mluvíme o vzájemné výměně plynů.",
  ),
  q(
    "V akváriu jsou rybičky i vodní rostliny. Proč rostliny rybičkám ve dne pomáhají dýchat?",
    "Protože ve dne díky fotosyntéze uvolňují do vody kyslík",
    [
      { o: "Protože rostliny v noci vydávají víc kyslíku než ve dne", why: "V noci rostliny kyslík naopak spotřebovávají, protože nefotosyntetizují." },
      { o: "Protože rostliny čistí vodu jako filtr, ale kyslík nevytvářejí", why: "Vodu rostliny částečně čistí, ale kyslík do ní opravdu uvolňují." },
      { o: "Protože rybičky dýchají jen vzduch nad hladinou", why: "Rybičky dýchají žábrami plyn rozpuštěný ve vodě, ne vzduch nad hladinou." },
    ],
    [
      "Vzpomeň si, co rostlina vytváří, když na ni svítí světlo.",
      "Fotosyntéza běží jen za světla, ve tmě se zastaví. Sleduj proto, co rostlina během dne do okolí vypouští a k čemu to rybičkám může být dobré. V noci je situace přesně opačná, tehdy rostliny samy spotřebovávají.",
    ],
    "Vodní rostliny při fotosyntéze spotřebovávají oxid uhličitý a uvolňují do vody kyslík, který rybičky dýchají žábrami. V noci fotosyntéza neprobíhá a rostliny kyslík samy spotřebovávají.",
  ),
  q(
    "Na svahu vykáceli les a pole nechali holé. Přišel silný déšť. Co se s půdou nejspíš stane a proč?",
    "Půda se odplaví, protože chybí kořeny stromů, které by ji držely na místě",
    [
      { o: "Nic se nestane, protože kořeny stromů erozi vůbec neovlivňují", why: "Kořeny drží zeminu jako síť, bez nich se odplaví snadno." },
      { o: "Půda se rychle vsákne do země a zmizí tam navždy", why: "Půda je sama součástí země, vsáknout se nemůže." },
      { o: "Déšť půdu jen umyje, ale nic neodnese", why: "Silný déšť zeminu opravdu odnáší, hlavně po svahu dolů." },
    ],
    [
      "Zamysli se, co obvykle drží zeminu na svahu, a co se stane, když to chybí.",
      "Představ si louku protkanou hustou sítí kořínků a vedle ní holé rozorané pole. Na prvním místě voda stéká pomalu a zemina zůstává, na druhém se rozjede rovnou po povrchu a bere všechno s sebou dolů.",
    ],
    "Kořeny stromů a rostlin drží půdu pohromadě. Bez nich ji silný déšť snadno odplaví — tomuto jevu říkáme eroze. Proto je vykácení lesa na svahu rizikové.",
  ),
  q(
    "Co by se stalo s koloběhem vody, kdyby slunce vůbec nehřálo?",
    "Voda by se nevypařovala, nevznikala by oblaka ani srážky",
    [
      { o: "Koloběh vody by fungoval úplně stejně jako předtím", why: "Bez tepla by chyběl hned první krok, takže stejný být nemůže." },
      { o: "Pršelo by ještě víc než obvykle", why: "Bez výparu by nebylo z čeho mraky tvořit, déšť by naopak ustal." },
      { o: "Všechna voda by rovnou zmrzla na led", why: "Zima by opravdu nastala, otázka ale míří na zastavení celého koloběhu." },
    ],
    [
      "Najdi úplně první krok koloběhu a zeptej se, co by se stalo bez něj.",
      "Celý koloběh je řetěz: bez tepla nevznikne pára, bez páry se nemají z čeho tvořit mraky a bez mraků nemá co spadnout dolů. Stačí proto rozpojit první článek a zastaví se všechno, co po něm následuje.",
    ],
    "Bez slunečního tepla by se voda z moří a řek nevypařovala. Bez výparu by nevznikala pára, tedy ani oblaka, a bez oblaků by nepršelo. Celý koloběh by se zastavil hned na začátku.",
  ),
  q(
    "Proč se říká, že voda, vzduch a půda jsou základem CELÉHO potravního řetězce, ne jen jednotlivých rostlin?",
    "Protože bez nich by nevyrostly rostliny, kterými se živí živočichové, jimiž se živí další tvorové",
    [
      { o: "Protože jen rostliny vodu, vzduch a půdu potřebují, zvířata ne", why: "Zvířata také potřebují vodu a vzduch, bez nich nepřežijí." },
      { o: "Protože jen voda je opravdu důležitá, vzduch a půda tolik ne", why: "Bez vzduchu ani bez půdy by rostliny nevyrostly." },
      { o: "Protože potravní řetězec na vodě, vzduchu a půdě vůbec nezávisí", why: "Závisí, a to celý — začíná rostlinami, které tyto tři věci nutně potřebují." },
    ],
    [
      "Neptej se jen na rostliny, ale i na všechny, kdo na nich dál závisejí.",
      "Postupuj po patrech: první patro tvoří organismy, které k růstu potřebují tekutinu, plyn i zeminu. Druhé patro je spásá a třetí loví to druhé. Když vypadne základ, zhroutí se i obě patra nad ním.",
    ],
    "Rostliny potřebují vodu, vzduch a půdu k růstu. Bez rostlin by neměli co jíst býložravci a bez býložravců by neměli co lovit masožravci. Celý řetězec proto stojí na těchto třech základech.",
  ),
  q(
    "Kdyby v půdě vyhynuly všechny žížaly a mikroorganismy, co by se stalo s rostlinami na poli?",
    "Rostlo by jim hůř, protože půda by přestala být kypřená a bohatá na živiny",
    [
      { o: "Rostlinám by to vůbec nevadilo", why: "Bez kypření a rozkladu by se půda časem výrazně zhoršila." },
      { o: "Rostliny by najednou rostly rychleji", why: "Živin by naopak ubylo a růst by se zpomalil." },
      { o: "Půda by zůstala úplně stejně úrodná jako předtím", why: "Úrodnost udržují právě půdní organismy, bez nich klesne." },
    ],
    [
      "Nejdřív si ujasni, co ti tvorové s půdou vlastně dělají.",
      "Jedni v zemi vyhrabávají chodbičky, kterými se do hloubky dostane vzduch i voda. Druzí, ti nejmenší, rozkládají spadané listí a zbytky na látky, které kořeny umí přijmout. Zamysli se, co se stane, když obojí zmizí.",
    ],
    "Žížaly prokopávají a provzdušňují půdu, mikroorganismy rozkládají odumřelé zbytky na živiny. Bez nich by půda přestala být kyprá i úrodná a rostlinám by se v ní dařilo hůř.",
  ),
  q(
    "Továrna vypouští do vzduchu hodně škodlivých zplodin. Proč to škodí i rostlinám a zvířatům v okolí, ne jen lidem ve městě?",
    "Protože znečištěný vzduch dýchají i rostliny a zvířata, ne jenom lidé",
    [
      { o: "Protože rostliny a zvířata žádný vzduch nedýchají", why: "Dýchají obojí — rostliny listy, zvířata plícemi nebo žábrami." },
      { o: "Protože znečištění zůstává jen uvnitř továrny", why: "Zplodiny odcházejí komínem a vítr je roznese do okolí." },
      { o: "Protože jen lidé mají plíce, které to poškozuje", why: "Plíce mají i zvířata a rostlinám škodí usazené zplodiny na listech." },
    ],
    [
      "Zamysli se, kdo všechno v okolí továrny vzduch potřebuje.",
      "Vítr rozfouká zplodiny daleko za plot továrny, takže se dostanou i na pole a do lesa. Tam žijí organismy, které stejně jako člověk potřebují čisté ovzduší — jedny ho nasávají plícemi, druhé listy.",
    ],
    "Znečištěné ovzduší se šíří do celého okolí a škodí všem organismům, které ho potřebují — nejen lidem, ale i zvířatům a rostlinám.",
  ),
  q(
    "Kdyby lidé vykáceli velkou část lesů na celé planetě, co by se pravděpodobně stalo s množstvím srážek?",
    "Srážek by ubylo, protože stromy pomáhají vodě z půdy odpařovat se do vzduchu",
    [
      { o: "Srážek by přibylo, protože by nic nebránilo dešti padat", why: "Stromy dešti v padání nebrání, naopak vodu do ovzduší dodávají." },
      { o: "Množství srážek by se vůbec nezměnilo", why: "Lesy ovlivňují množství vodní páry v ovzduší, změna by nastala." },
      { o: "Srážky by byly úplně stejné, protože počasí dělá jen slunce", why: "Počasí ovlivňuje i to, kolik vody se z krajiny odpaří." },
    ],
    [
      "Sleduj, odkud se nad pevninou dostává do ovzduší vodní pára.",
      "Strom nasaje kořeny vláhu ze země a velkou část jí vypustí listy ven jako páru. Nad lesem je proto ovzduší vlhčí než nad holou plání. Zamysli se, co se stane s množstvím mraků, když stromů bude mnohem méně.",
    ],
    "Stromy odpařují vodu z půdy svými listy. Bez lesů by se do ovzduší dostávalo méně vodní páry, vznikalo by méně oblaků, a tím i méně srážek v daném kraji.",
  ),
  q(
    "Proč je pro život důležité, že vzduch obsahuje jak kyslík, tak oxid uhličitý zároveň?",
    "Protože kyslík potřebují k dýchání živočichové a oxid uhličitý potřebují rostliny k fotosyntéze",
    [
      { o: "Protože oba plyny potřebují jen rostliny", why: "Živočichové potřebují kyslík také, a to nutně." },
      { o: "Protože oba plyny potřebují jen živočichové", why: "Rostliny bez oxidu uhličitého fotosyntetizovat nemohou." },
      { o: "Protože vzduch by fungoval úplně stejně, i kdyby jeden z plynů chyběl", why: "Bez jednoho z nich by se zastavila celá výměna mezi rostlinami a zvířaty." },
    ],
    [
      "Přiřaď ke každému z obou plynů skupinu organismů, která ho potřebuje.",
      "Jeden plyn je nutný k dýchání a druhý je surovinou pro výrobu cukru v listech. Každý z nich tedy slouží jiné skupině organismů. Hledej možnost, která obě dvojice spojuje, ne tu, která jednu stranu vynechává.",
    ],
    "Živočichové potřebují kyslík k dýchání a produkují oxid uhličitý, který rostliny využívají k fotosyntéze. Kdyby jeden z plynů chyběl, koloběh mezi rostlinami a živočichy by se zastavil.",
  ),
  q(
    "Znečištěná půda na poli se při dešti splachuje do potoka. Proč to znamená problém i pro pitnou vodu?",
    "Protože škodliviny z půdy se dostanou do vody, kterou lidé později používají jako pitnou",
    [
      { o: "Protože voda z potoků se nikdy nedostane do studní ani vodáren", why: "Právě do studní a vodáren se voda z potoků a řek běžně dostává." },
      { o: "Protože znečištěná půda vodu naopak automaticky čistí", why: "Část nečistot půda zachytí, ale škodliviny z ní se také vyplavují." },
      { o: "Protože to na kvalitu vody nemá žádný vliv", why: "Vliv to má — splavené látky doputují až do zdroje pitné vody." },
    ],
    [
      "Sleduj cestu jedné kapky deště z pole až do kohoutku.",
      "Déšť spláchne z povrchu pole všechno, co na něm leží, do nejbližšího potoka. Potok se vlévá do řeky a z ní nebo z podzemních zásob se plní studny a úpravny. Zamysli se, co může taková látka na své cestě způsobit.",
    ],
    "Déšť splavuje znečištěné látky z půdy do potoků a řek. Tato voda bývá zdrojem pro studny nebo úpravny, takže znečištění půdy může ohrozit i kvalitu pitné vody.",
  ),
  q(
    "Proč se říká, že voda, vzduch a půda jsou navzájem propojené, a ne tři oddělené věci?",
    "Protože změna v jedné z nich ovlivňuje i další dvě, například sucho ovlivní růst rostlin i množství kyslíku",
    [
      { o: "Protože voda, vzduch a půda spolu vůbec nesouvisí", why: "Souvisí — sucho v zemi se projeví na rostlinách i na ovzduší." },
      { o: "Protože sucho ovlivní jen rostliny, na vzduch nemá žádný vliv", why: "Méně rostlin znamená méně fotosyntézy, a tedy i méně kyslíku." },
      { o: "Protože propojené jsou jen voda se vzduchem, půda s nimi nesouvisí", why: "Půda zadržuje vláhu a živí rostliny, takže souvisí s oběma." },
    ],
    [
      "Vyber si jednu změnu a sleduj, kam až se její následek dostane.",
      "Zkus si to na suchu: v zemi chybí vláha, rostlinám se nedaří a listů ubývá. Méně listů znamená méně fotosyntézy, a tím i méně plynu uvolněného do ovzduší. Jediná změna se tak projeví hned na třech místech.",
    ],
    "Voda, vzduch a půda jsou vzájemně propojené. Při suchu chybí v půdě voda, rostlinám se nedaří, a protože fotosyntetizují méně, ubývá i kyslíku uvolňovaného do vzduchu.",
  ),
  q(
    "Bez stromů na kopci odplavil silný déšť ornici do potoka. Jak to postupně ovlivní i život v potoce?",
    "Splavená hlína zakalí vodu a rybám i rostlinám v potoce se bude hůř žít",
    [
      { o: "Potok bude čistší, protože hlína ho pročistí", why: "Hlína vodu nečistí, naopak ji kalí." },
      { o: "Rybám zakalená voda vůbec nevadí", why: "Zákal ucpává žábry a ztěžuje hledání potravy." },
      { o: "Hlína se hned usadí na dně a na vodu už dál nepůsobí", why: "Jemné částečky se vznášejí dlouho a na dně dusí nakladené jikry." },
    ],
    [
      "Přemýšlej, co udělá zakalená voda se světlem a s dýcháním ryb.",
      "Zakalená voda propustí méně světla, takže vodním rostlinám se hůř fotosyntetizuje. Jemné částečky se navíc usazují na žábrách i na dně, kde pokryjí nakladené jikry. Následek eroze se tak přenese až do potoka.",
    ],
    "Eroze odplaví ornici do potoka, voda se zakalí a propouští méně světla. To ztěžuje život vodním rostlinám i rybám. Problém z pole se tak přenese až do vodního ekosystému.",
  ),
  q(
    "Vodovod přivádí do města vodu z přehrady v horách. Proč je důležité chránit lesy kolem té přehrady?",
    "Lesy zadržují vodu a brání splachu půdy, takže do přehrady teče čistší voda",
    [
      { o: "Lesy v horách na vodu v přehradě žádný vliv nemají", why: "Voda do přehrady stéká právě z lesnatých svahů nad ní." },
      { o: "Stromy samy vyrábějí pitnou vodu", why: "Vodu stromy nevyrábějí, jen ji zadržují a odpařují." },
      { o: "Lesy vodu naopak znečišťují spadaným listím", why: "Listí se v půdě rozloží a žádné znečištění z něj nevzniká." },
    ],
    [
      "Sleduj cestu deště od horského hřebene až k hladině přehrady.",
      "Na zalesněném svahu déšť propadne korunami a pomalu se vsakuje do husté sítě kořínků. Na holém svahu steče rovnou dolů a bere s sebou zeminu. Zamysli se, jak bude v obou případech vypadat to, co doteče až k hrázi.",
    ],
    "Lesní půda funguje jako houba: zadrží dešťovou vodu a pomalu ji uvolňuje, kořeny zároveň brání splachu zeminy po svahu. Do přehrady proto přiteče čistší voda a její množství je vyrovnanější.",
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const VODAVZDUCHPUDA: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-ziva-a-neziva-priroda-voda-vzduch-puda-vyznam-pro-zivot",
    rvpNodeId: "g3-prvouka-rozmanitost-prirody-ziva-a-neziva-priroda-voda-vzduch-puda-vyznam-pro-zivot",
    title: "Voda, vzduch, půda — význam pro život",
    studentTitle: "Voda, vzduch a půda",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Živá a neživá příroda",
    briefDescription: "Pochopíš, proč jsou voda, vzduch a půda nezbytné pro život.",
    keywords: ["voda", "vzduch", "půda", "koloběh vody", "kyslík", "dusík", "eroze", "fotosyntéza"],
    goals: [
      "Popsat koloběh vody v přírodě",
      "Vysvětlit složení vzduchu a jeho důležitost",
      "Pochopit, jak vzniká půda a proč je důležitá",
      "Uvést příklady znečišťování a ochrany přírody",
    ],
    boundaries: ["Chemické vzorce a podrobná chemie jsou nad rámec 3. ročníku"],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vzpomeň si na koloběh vody: výpar → oblaka → déšť → řeky → moře.",
      steps: [
        "Voda: výpar → oblaka → srážky → řeky → moře (koloběh).",
        "Vzduch: 4/5 dusík + 1/5 kyslík + trocha CO₂.",
        "Kyslík = dýchání živočichů. CO₂ = fotosyntéza rostlin.",
        "Půda vzniká z hornin + odumřelých organismů. Žížaly ji kypří.",
      ],
      commonMistake: "Vzduch není jen kyslík — největší část tvoří dusík.",
      example: "Koloběh vody: řeka vypaří vodu → oblaka → déšť → řeka opět.",
    },
  },
];
