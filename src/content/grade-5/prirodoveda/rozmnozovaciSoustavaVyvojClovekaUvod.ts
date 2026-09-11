import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a zpětné vazby a L2/L3 měly jen 4–6 různých otázek. Teď v mezích
// tématu (bez sexuálního chování, antikoncepce a genetiky): L1 vývoj dítěte
// před narozením a po něm · L2 jak vývoj probíhá a proč · L3 péče o sebe
// a o tělo v dospívání.

const L1: PracticeTask[] = [
  choice("Kde roste dítě před narozením?", "v děloze matky", [
    { value: "v žaludku matky", why: "Žaludek slouží k trávení." },
    { value: "v plicích matky", why: "Plíce slouží k dýchání." },
    { value: "v srdci matky", why: "Srdce pumpuje krev." },
  ], {
    hints: ["Který orgán ženy slouží k vývoji dítěte?", "Tento dutý orgán v podbřišku se během těhotenství zvětšuje spolu s dítětem."],
    explanation: "Dítě se vyvíjí v děloze matky.",
  }),
  choice("Jak dlouho zhruba trvá těhotenství?", "asi 9 měsíců", [
    { value: "asi 3 měsíce", why: "Za tři měsíce je plod ještě velmi malý." },
    { value: "asi 2 roky", why: "Tak dlouho trvá těhotenství u slonů, ne u lidí." },
    { value: "asi 1 měsíc", why: "Za měsíc se dítě nevyvine." },
  ], {
    hints: ["Je to kratší než rok, nebo delší?", "Těhotenství trvá o tři měsíce méně než celý rok."],
    explanation: "Těhotenství trvá asi 9 měsíců (kolem 40 týdnů).",
  }),
  choice("Z čeho se vyvíjí nový člověk?", "z oplozeného vajíčka", [
    { value: "z mléka matky", why: "Mléko je potrava pro miminko po narození." },
    { value: "z krve matky", why: "Krev dítě vyživuje, ale nevzniká z ní." },
    { value: "ze semínka rostliny", why: "Semena jsou u rostlin." },
  ], {
    hints: ["Jaká buňka od matky se na začátku spojí s buňkou od otce?", "Když se ženská pohlavní buňka spojí s mužskou, začne vývoj nového člověka."],
    explanation: "Nový člověk se vyvíjí z oplozeného vajíčka.",
  }),
  choice("Jak se živí dítě v děloze?", "přes pupeční šňůru z těla matky", [
    { value: "jí malou lžičkou", why: "Dítě v děloze nejí ústy." },
    { value: "nepotřebuje žádnou výživu", why: "Potřebuje živiny, aby rostlo." },
    { value: "dýchá potravu plícemi", why: "Plíce začnou pracovat až po narození." },
  ], {
    hints: ["Co spojuje dítě s tělem matky?", "Touto šňůrou proudí od maminky k dítěti krví živiny i kyslík."],
    explanation: "Dítě dostává živiny a kyslík pupeční šňůrou.",
  }),
  choice("Co zůstane na bříšku po pupeční šňůře?", "pupík", [
    { value: "loket", why: "Loket je kloub na ruce." },
    { value: "znaménko na čele", why: "Pupeční šňůra byla na bříšku." },
    { value: "koleno", why: "Koleno je kloub na noze." },
  ], {
    hints: ["Kde byla u dítěte připojená pupeční šňůra?", "Po porodu se šňůra odstřihne a zbytek zaschne; zůstane malá jizvička uprostřed břicha."],
    explanation: "Po pupeční šňůře zůstane pupík.",
  }),
  choice("Čím se živí novorozenec?", "mateřským nebo umělým mlékem", [
    { value: "tvrdou stravou", why: "Novorozenec nemá zuby a tvrdou stravu nestráví." },
    { value: "jen vodou", why: "Voda by mu nestačila." },
    { value: "ovocem a zeleninou", why: "Příkrmy přicházejí až později." },
  ], {
    hints: ["Má novorozenec zuby?", "Miminko potřebuje tekutou potravu, kterou mu dá maminka nebo láhev."],
    explanation: "Novorozenec pije mateřské nebo umělé mléko.",
  }),
  choice("Které orgány se u člověka starají o rozmnožování?", "pohlavní orgány", [
    { value: "trávicí orgány", why: "Trávicí orgány zpracovávají potravu." },
    { value: "dýchací orgány", why: "Dýchací orgány zajišťují kyslík." },
    { value: "smyslové orgány", why: "Smysly vnímají okolí." },
  ], {
    hints: ["Jak se jmenuje soustava, díky které vzniká nový život?", "Tyto orgány se liší u žen a mužů a dozrávají v pubertě."],
    explanation: "O rozmnožování se starají pohlavní orgány.",
  }),
  choice("Co se v pubertě objeví u dívek i chlapců?", "ochlupení v podpaží", [
    { value: "nové mléčné zuby", why: "Mléčné zuby vypadávají už v dětství." },
    { value: "zastavení růstu", why: "V pubertě se naopak roste rychleji." },
    { value: "zmenšení nohou", why: "Nohy se nezmenšují." },
  ], {
    hints: ["Co začne růst na těle, kde dřív nebylo?", "V pubertě se objeví nové chloupky na několika místech těla."],
    explanation: "V pubertě se u dívek i chlapců objeví ochlupení v podpaží a v okolí pohlavních orgánů.",
  }),
  choice("Co řídí tělesné změny v pubertě?", "hormony", [
    { value: "vitamíny", why: "Vitamíny tělo potřebuje, ale pubertu neřídí." },
    { value: "svaly", why: "Svaly změny neřídí." },
    { value: "zuby", why: "Zuby změny neřídí." },
  ], {
    hints: ["Jak se jmenují látky, které vyrábějí žlázy a rozvádí je krev?", "Tyto látky dávají tělu signál, že má začít dospívat."],
    explanation: "Změny v pubertě řídí hormony.",
  }),
  choice("Kde se u ženy tvoří vajíčka?", "ve vaječnících", [
    { value: "v žaludku", why: "Žaludek tráví potravu." },
    { value: "v ledvinách", why: "Ledviny čistí krev." },
    { value: "v plicích", why: "Plíce slouží k dýchání." },
  ], {
    hints: ["Název orgánu je odvozený od slova vajíčko.", "Jsou to dva malé orgány v podbřišku po stranách dělohy."],
    explanation: "Vajíčka se tvoří ve vaječnících.",
  }),
  choice("Kde se u muže tvoří spermie?", "ve varlatech", [
    { value: "v srdci", why: "Srdce pumpuje krev." },
    { value: "v játrech", why: "Játra zpracovávají živiny." },
    { value: "v žaludku", why: "Žaludek tráví potravu." },
  ], {
    hints: ["Mužské pohlavní buňky vznikají v párovém orgánu.", "Tyto dva orgány jsou uložené mimo břišní dutinu v šourku."],
    explanation: "Spermie se tvoří ve varlatech.",
  }),
  choice("Jak se jmenuje narození dítěte?", "porod", [
    { value: "očkování", why: "Očkování chrání před nemocemi." },
    { value: "kojení", why: "Kojení je krmení mlékem." },
    { value: "přebalování", why: "Přebalování je výměna plenek." },
  ], {
    hints: ["Kde se většina dětí rodí?", "V nemocnici pomáhají ženě lékaři a zdravotní sestry, když dítě přichází na svět."],
    explanation: "Narození dítěte se říká porod.",
  }),
  choice("Proč je v pubertě potřeba pečovat o tělo víc?", "tělo se mění a víc se potí", [
    { value: "v pubertě se tělo přestane potit", why: "Naopak se potí víc." },
    { value: "je to jen módní", why: "Je to potřebné pro zdraví." },
    { value: "aby se zastavil růst", why: "Péče růst nezastaví." },
  ], {
    hints: ["Co tělo v pubertě vytváří víc než dřív?", "Hormony rozproudí potní a mazové žlázy, proto je potřeba se častěji mýt."],
    explanation: "V pubertě se tělo víc potí a pleť se mastí, proto je hygiena důležitější.",
  }),
];

const L2: PracticeTask[] = [
  choice("Jak se jmenuje buňka, která vznikne spojením vajíčka a spermie?", "oplozené vajíčko", [
    { value: "červená krvinka", why: "Krvinky jsou v krvi." },
    { value: "nervová buňka", why: "Nervové buňky vedou vzruchy." },
    { value: "kožní buňka", why: "Kožní buňky tvoří pokožku." },
  ], {
    hints: ["Co vznikne, když se ženská a mužská pohlavní buňka spojí?", "Z této jediné buňky se dělením vyvine celé tělo nového člověka."],
    explanation: "Spojením vajíčka a spermie vznikne oplozené vajíčko.",
  }),
  choice("Proč dítě v děloze nedýchá vzduch?", "kyslík dostává z krve matky", [
    { value: "kyslík vůbec nepotřebuje", why: "Kyslík potřebuje každá buňka." },
    { value: "dýchá vodu žábrami", why: "Člověk žábry nemá." },
    { value: "zadržuje dech devět měsíců", why: "Kyslík dostává jinak." },
  ], {
    hints: ["Jak se k dítěti dostanou živiny?", "Pupeční šňůrou proudí krev a spolu s živinami přináší i kyslík."],
    explanation: "Dítě v děloze dostává kyslík z krve matky pupeční šňůrou.",
  }),
  choice("Co chrání dítě v děloze před nárazy?", "plodová voda", [
    { value: "kosti matky", why: "Kosti pánve chrání, ale hlavní polštář je tekutina kolem dítěte." },
    { value: "vzduch v děloze", why: "V děloze vzduch není." },
    { value: "tuk na zádech", why: "Nejde o tuk." },
  ], {
    hints: ["V čem dítě v děloze plave?", "Dítě je obklopené tekutinou, která tlumí otřesy jako polštář."],
    explanation: "Plodová voda tlumí nárazy a chrání dítě.",
  }),
  choice("Proč by těhotná žena neměla kouřit ani pít alkohol?", "škodlivé látky se dostanou k dítěti", [
    { value: "zkazí se jí chuť k jídlu", why: "Hlavní problém je poškození dítěte." },
    { value: "dítě by se narodilo dřív a zdravější", why: "Kouření a alkohol dítěti škodí." },
    { value: "je to jen zvyk", why: "Jde o zdraví dítěte." },
  ], {
    hints: ["Kudy se k dítěti dostane vše, co je v krvi matky?", "Pupeční šňůrou jde k dítěti nejen potrava, ale i nikotin a alkohol."],
    explanation: "Škodlivé látky z krve matky se dostanou k dítěti a poškozují jeho vývoj.",
  }),
  choice("V jakém pořadí se vyvíjí člověk?", "oplozené vajíčko, zárodek, plod, novorozenec", [
    { value: "zárodek, oplozené vajíčko, plod, novorozenec", why: "Na začátku je oplozené vajíčko." },
    { value: "oplozené vajíčko, plod, zárodek, novorozenec", why: "Zárodek je dřív než plod." },
    { value: "novorozenec, plod, zárodek, oplozené vajíčko", why: "Je to naopak." },
  ], {
    hints: ["Čím vývoj začíná a čím končí?", "Z jediné buňky vznikne zárodek, ten se promění v plod a po porodu je z něj novorozenec."],
    explanation: "Vývoj: oplozené vajíčko, zárodek, plod, novorozenec.",
  }),
  choice("Co se u dospívajících dívek objevuje zhruba jednou za měsíc?", "menstruace", [
    { value: "zlomenina", why: "Zlomenina je úraz." },
    { value: "horečka", why: "Horečka je příznak nemoci." },
    { value: "alergie", why: "Alergie je reakce na látku." },
  ], {
    hints: ["Jak se jmenuje pravidelné krvácení z dělohy?", "Je to přirozený znak toho, že tělo dívky dospívá; opakuje se asi po čtyřech týdnech."],
    explanation: "Menstruace je přirozený projev dospívání dívek.",
  }),
  choice("Proč se chlapcům v pubertě mění hlas?", "roste jim hrtan", [
    { value: "nachladí se", why: "Nachlazení to není." },
    { value: "moc křičí", why: "Křik to nezpůsobí." },
    { value: "ztrácejí hlasivky", why: "Hlasivky se naopak prodlužují." },
  ], {
    hints: ["Kde vzniká hlas?", "Orgán s hlasivkami se v pubertě zvětší a hlas je pak hlubší."],
    explanation: "Hrtan a hlasivky rostou, a hlas se prohloubí.",
  }),
  choice("Proč v pubertě rosteme rychleji?", "hormony urychlí růst kostí", [
    { value: "víc sedíme", why: "Sezení růst neurychlí." },
    { value: "méně spíme", why: "Spánek naopak růstu pomáhá." },
    { value: "je teplejší počasí", why: "Počasí to nezpůsobí." },
  ], {
    hints: ["Co v pubertě dává tělu pokyny?", "Hormony spustí růstový skok — někdo vyroste za rok i o deset centimetrů."],
    explanation: "Hormony v pubertě urychlují růst kostí.",
  }),
  choice("Co je puberta?", "období, kdy tělo pohlavně dozrává", [
    { value: "nemoc dospívajících", why: "Puberta není nemoc." },
    { value: "první rok života", why: "To je kojenecký věk." },
    { value: "období stáří", why: "Stáří je na konci života." },
  ], {
    hints: ["Kdy se z dětského těla stává dospělé?", "V tomto období dozrávají pohlavní orgány a tělo se mění na dospělé."],
    explanation: "Puberta je období pohlavního dozrávání.",
  }),
  choice("Proč je puberta u každého trochu jiná?", "hormony začnou působit u každého jindy", [
    { value: "někdo pubertou neprojde", why: "Projde jí každý." },
    { value: "záleží na oblečení", why: "Oblečení to neovlivní." },
    { value: "je to dané školou", why: "Škola to neovlivní." },
  ], {
    hints: ["Začínají změny všem ve stejném věku?", "Tělo každého člověka má vlastní tempo; změny proto přicházejí v různém věku."],
    explanation: "Hormony začnou působit u každého v jiném věku.",
  }),
  choice("Proč je kojení pro miminko výhodné?", "mateřské mléko má živiny i látky na obranu", [
    { value: "mléko je sladší než voda", why: "Nejde o chuť." },
    { value: "miminko pak nepotřebuje spát", why: "Spánek potřebuje." },
    { value: "je to jen tradice", why: "Kojení má skutečné výhody." },
  ], {
    hints: ["Co miminko po narození potřebuje?", "Mléko od maminky obsahuje vše potřebné k růstu a látky, které chrání před nemocemi."],
    explanation: "Mateřské mléko obsahuje živiny i látky, které chrání před nemocemi.",
  }),
  choice("Kdo pomáhá ženě u porodu v porodnici?", "porodní asistentka a lékař", [
    { value: "učitel ze školy", why: "Učitel u porodu nepomáhá." },
    { value: "zubař", why: "Zubař léčí zuby." },
    { value: "hasič", why: "Hasič zasahuje u požárů." },
  ], {
    hints: ["Kdo pracuje na porodním sále?", "U porodu pomáhá žena s odborným vzděláním a lékař gynekolog."],
    explanation: "U porodu pomáhají porodní asistentky a lékaři.",
  }),
  choice("Kolik zhruba váží novorozenec?", "asi 3 až 4 kilogramy", [
    { value: "asi 300 gramů", why: "To je méně než půl kila." },
    { value: "asi 10 kilogramů", why: "Tolik váží dítě kolem prvního roku." },
    { value: "asi 20 kilogramů", why: "Tolik váží předškolák." },
  ], {
    hints: ["Je to víc než balení mouky?", "Novorozenec váží jako tři nebo čtyři balíčky kilové mouky."],
    explanation: "Novorozenec obvykle váží 3 až 4 kilogramy.",
  }),
];

const L3: PracticeTask[] = [
  choice("Proč se těhotné ženě doporučuje zdravě jíst?", "dítě dostává živiny z její krve", [
    { value: "aby dítě bylo hubenější", why: "Jde o zdravý vývoj dítěte." },
    { value: "těhotné ženy nesmějí jíst sladké", why: "Jde o pestrost, ne o zákaz." },
    { value: "je to jen móda", why: "Jde o zdraví matky i dítěte." },
  ], {
    hints: ["Odkud má dítě v děloze potravu?", "Co matka sní, přejde do krve a pupeční šňůrou k dítěti."],
    explanation: "Dítě dostává živiny z krve matky, proto je důležitá pestrá strava.",
  }),
  choice("Proč pupeční šňůra po porodu už není potřeba?", "dítě začne samo dýchat a jíst", [
    { value: "zlomí se", why: "Odstřihne se, protože už není potřeba." },
    { value: "dítě ji spolkne", why: "Šňůra se odstřihne." },
    { value: "je potřeba celý život", why: "Po porodu už potřeba není." },
  ], {
    hints: ["Jak dítě po narození získává kyslík a potravu?", "Novorozenec se nadechne vlastními plícemi a pije mléko — spojení s matkou už nepotřebuje."],
    explanation: "Po porodu dítě dýchá a jí samo, pupeční šňůra se proto odstřihne.",
  }),
  choice("Proč by se dospívající neměli porovnávat, kdo je dál?", "každé tělo dozrává jiným tempem", [
    { value: "kdo je dál, je lepší", why: "Tempo dospívání neurčuje hodnotu člověka." },
    { value: "všichni musí být stejní", why: "Každý je jiný." },
    { value: "porovnávání vždy pomáhá", why: "Často ubližuje." },
  ], {
    hints: ["Začíná puberta všem ve stejném věku?", "Někdo dospívá dřív, jiný později — obojí je normální."],
    explanation: "Každé tělo dozrává jinak; porovnávání jen zbytečně trápí.",
  }),
  choice("Co je pravda o menstruaci?", "je to přirozený projev dospívání dívek", [
    { value: "je to nemoc", why: "Menstruace není nemoc." },
    { value: "je to ostuda", why: "Není to nic, za co se stydět." },
    { value: "týká se chlapců i dívek", why: "Týká se jen dívek a žen." },
  ], {
    hints: ["Znamená menstruace, že je něco špatně?", "Menstruace ukazuje, že tělo dívky dospělo a funguje, jak má."],
    explanation: "Menstruace je přirozený projev dospívání dívek.",
  }),
  choice("Proč je dobré, aby dívky i chlapci věděli o změnách v pubertě?", "aby je nepřekvapily a nestyděli se za ně", [
    { value: "aby se jim mohli smát", why: "Posměch je špatně." },
    { value: "o pubertě se nemá mluvit", why: "Informace pomáhají." },
    { value: "aby změny přestaly", why: "Změny jsou přirozené a nezastaví se." },
  ], {
    hints: ["Jak se cítíš, když něco nečekaného přijde bez varování?", "Kdo ví, co ho čeká, bere změny v klidu a chápe i kamarády."],
    explanation: "Informace pomáhají přijmout změny v klidu a bez studu.",
  }),
  choice("Proč má miminko na hlavě měkká místa?", "lebka se při porodu přizpůsobí a pak roste", [
    { value: "miminko nemá kosti", why: "Kosti má, jen ještě nesrostlé." },
    { value: "je to nemoc", why: "Je to přirozené." },
    { value: "lebka se nikdy nezpevní", why: "Během prvních let se zpevní." },
  ], {
    hints: ["Jak se hlava miminka dostane na svět úzkou cestou?", "Kosti lebky ještě nejsou srostlé, aby se hlava mohla přizpůsobit a mozek mohl růst."],
    explanation: "Nesrostlé kosti lebky pomáhají při porodu a dovolí růst mozku.",
  }),
  choice("Proč miminko po narození pláče?", "začne dýchat a plíce se naplní vzduchem", [
    { value: "je naštvané na lékaře", why: "Nejde o náladu." },
    { value: "nechce mléko", why: "Nejde o jídlo." },
    { value: "je mu vždy zima", why: "Nejde hlavně o zimu." },
  ], {
    hints: ["Co miminko po porodu dělá poprvé v životě?", "Prvním výkřikem se miminko nadechne a plíce se rozvinou."],
    explanation: "Pláčem se miminko poprvé nadechne a plíce se naplní vzduchem.",
  }),
  choice("Co se děje s plodem v posledních měsících těhotenství?", "hlavně roste a sílí", [
    { value: "zmenšuje se", why: "Plod roste." },
    { value: "teprve vzniká srdce", why: "Srdce vzniká už na začátku." },
    { value: "přestane se hýbat", why: "Plod se hýbe." },
  ], {
    hints: ["Kdy už má plod všechny orgány?", "Orgány se vytvoří v prvních měsících; na konci plod hlavně přibývá na váze."],
    explanation: "Na konci těhotenství plod hlavně roste a sílí.",
  }),
  choice("Proč se v pubertě víc potíme?", "hormony zvýší činnost potních žláz", [
    { value: "víc sportujeme a běháme venku", why: "Sport pot zvyšuje, ale příčinou změny jsou hormony." },
    { value: "je nám zima", why: "Zima pocení nevyvolá." },
    { value: "pijeme méně vody než dřív", why: "Pití to nezpůsobí." },
  ], {
    hints: ["Co v pubertě mění činnost celého těla?", "Hormony rozproudí žlázy v kůži, proto je potřeba se častěji mýt a měnit tričko."],
    explanation: "Hormony v pubertě zvyšují činnost potních žláz.",
  }),
  choice("Proč dospívání trvá několik let?", "tělo se mění postupně", [
    { value: "je to nemoc s dlouhým léčením", why: "Není to nemoc." },
    { value: "trvá jen jeden den", why: "Trvá roky." },
    { value: "kvůli škole", why: "Škola to neovlivní." },
  ], {
    hints: ["Změní se tělo najednou, nebo pomalu?", "Změny přicházejí jedna po druhé, jak tělo roste a dozrává."],
    explanation: "Tělo dozrává postupně, a proto dospívání trvá několik let.",
  }),
  choice("Proč se nemusíš nechat k ničemu nutit, co se týká tvého těla?", "o svém těle rozhoduji já a smím říct ne", [
    { value: "dospělí mají vždy pravdu", why: "O tvém těle rozhoduješ i ty." },
    { value: "říct ne je neslušné", why: "Říct ne je v pořádku." },
    { value: "musím poslechnout každého", why: "Nemusíš, když ti něco není příjemné." },
  ], {
    hints: ["Kdo rozhoduje o tom, kdo se tě smí dotýkat?", "Když ti něco není příjemné, můžeš říct ne a svěřit se dospělému, kterému věříš."],
    explanation: "Tvoje tělo patří tobě; máš právo říct ne a svěřit se.",
  }),
  choice("Když tě na změnách v těle něco znepokojí, co uděláš?", "zeptám se rodičů nebo lékaře", [
    { value: "budu to tajit", why: "Tajení nepomůže." },
    { value: "zeptám se neznámých lidí na internetu", why: "Informace z internetu nemusí být pravdivé." },
    { value: "nic, samo to přejde", why: "Lepší je se zeptat." },
  ], {
    hints: ["Kdo ti odborně poradí?", "Dětský lékař i rodiče ti vysvětlí, co je normální a co ne."],
    explanation: "Nejlépe poradí rodiče nebo lékař.",
  }),
  choice("Proč dítě v děloze roste ve vodě?", "voda ho chrání a může se v ní hýbat", [
    { value: "aby se naučilo plavat", why: "Nejde o plavání." },
    { value: "aby mohlo pít", why: "Hlavní úloha je ochrana." },
    { value: "voda ho zahřívá", why: "Hlavní úloha je ochrana a prostor k pohybu." },
  ], {
    hints: ["Co by se stalo s dítětem při nárazu bez polštáře kolem?", "Plodová voda tlumí nárazy a dává dítěti prostor, aby se mohlo protahovat a hýbat."],
    explanation: "Plodová voda chrání dítě a umožňuje mu pohyb.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const ROZMNOZOVACISOUSTAVAVYVOJCLOVEKAUVOD: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-rozmnozovaci-soustava-vyvoj-cloveka-uvod",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-rozmnozovaci-soustava-vyvoj-cloveka-uvod",
    title: "Rozmnožovací soustava, vývoj člověka (úvod)",
    studentTitle: "Vznik nového života",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Vývoj člověka a rozmnožování",
    briefDescription: "Dozvíš se základy o vzniku a vývoji nového života.",
    keywords: ["oplodnění", "těhotenství", "embryo", "plod", "hormony", "menstruace", "zygota"],
    goals: ["Popsat základní fáze vývoje od zygoty po novorozence", "Vysvětlit roli hormonů v pohlavním dozrávání", "Pochopit tělesné změny v pubertě jako přirozené"],
    boundaries: [
      "Neprobírá sexuální chování podrobně",
      "Neprobírá antikoncepci podrobně",
      "Neprobírá genetiku ani chromozomy — patří na 2. stupeň",
      "Neprobírá pohlavně přenosné nemoci ani vývojové vady",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vajíčko + spermie → zygota → embryo (1–8 týden) → plod (9–40 týden) → novorozenec.",
      steps: [
        "Oplodnění: vajíčko + spermie → zygota.",
        "Embryo: 1.–8. týden (zakládají se orgány).",
        "Plod: 9.–40. týden (vývoj a růst).",
        "Porod: přibližně ve 40. týdnu.",
        "Hormony puberty: estrogen (dívky), testosteron (chlapci).",
      ],
      commonMistake: "Záměna embrya a plodu — embryo je 1.–8. týden, od 9. týdne mluvíme o plodu.",
      example: "Vajíčko + spermie → zygota → embryo (1.–8. týden) → plod (9.–40. týden) → narození.",
    },
  },
];
