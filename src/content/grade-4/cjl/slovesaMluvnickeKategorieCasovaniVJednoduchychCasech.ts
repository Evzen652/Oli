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
  { q: "Jaký čas má sloveso 'budu číst'?", a: "budoucí", opts: ["budoucí", "přítomný", "minulý", "neurčitý"], e: "Slovo 'budu' nám napovídá, že děj teprve nastane — to je čas budoucí. Kdyby šlo o přítomnost, řekli bychom 'čtu', a o minulost 'četl jsem'." },
  { q: "Urči osobu a číslo: 'čteme'", a: "1. osoba množného čísla (my)", opts: ["1. osoba množného čísla (my)", "2. osoba množného čísla", "3. osoba množného čísla", "1. osoba jednotného čísla"], e: "K tvaru 'čteme' patří zájmeno 'my' — to je 1. osoba a protože je nás víc, jde o číslo množné. Kdyby četl jen jeden, řekli bychom 'čtu' (jednotné číslo)." },
  { q: "Jaký čas má sloveso 'četl jsem'?", a: "minulý", opts: ["minulý", "přítomný", "budoucí", "neurčitý"], e: "Pomocné sloveso 'jsem' spolu s tvarem 'četl' ukazuje na děj, který už proběhl — je to čas minulý. Přítomnost by byla 'čtu' a budoucnost 'budu číst'." },
  { q: "Jaký čas má sloveso 'čtu'?", a: "přítomný", opts: ["přítomný", "minulý", "budoucí", "neurčitý"], e: "Tvar 'čtu' vyjadřuje děj, který se odehrává právě teď — to je čas přítomný. Minulost by byla 'četl jsem', budoucnost 'budu číst'." },
  { q: "Urči osobu: 'ty čteš'", a: "2. osoba", opts: ["2. osoba", "1. osoba", "3. osoba", "neosobní"], e: "Zájmeno 'ty' označuje toho, s kým mluvíme — to je vždy 2. osoba. 1. osoba by byla 'já', 3. osoba 'on'." },
  { q: "Urči číslo: 'oni čtou'", a: "množné číslo", opts: ["množné číslo", "jednotné číslo", "nelze určit", "duál"], e: "Zájmeno 'oni' znamená víc lidí, proto jde o číslo množné. Kdyby četl jen jeden, řekli bychom 'on čte' (jednotné číslo)." },
  { q: "Jaký způsob má sloveso 'čti!'?", a: "rozkazovací", opts: ["rozkazovací", "oznamovací", "podmiňovací", "přací"], e: "Tvar 'čti!' je příkaz nebo výzva, abys něco udělal — to je způsob rozkazovací (poznáš ho i podle vykřičníku). Oznamovací by jen sděloval ('čteš'), podmiňovací by obsahoval 'bys'." },
  { q: "Jaký způsob má sloveso 'četl bych'?", a: "podmiňovací", opts: ["podmiňovací", "oznamovací", "rozkazovací", "tázací"], e: "Slůvko 'bych' je jasným znakem podmiňovacího způsobu — vyjadřuje, co by se mohlo nebo mělo stát za nějaké podmínky. Bez něj ('četl jsem') by šlo o oznamovací způsob v minulém čase." },
  { q: "Urči osobu a číslo: 'piju'", a: "1. osoba jednotného čísla (já)", opts: ["1. osoba jednotného čísla (já)", "3. osoba jednotného čísla", "2. osoba jednotného čísla", "1. osoba množného čísla"], e: "K tvaru 'piju' patří zájmeno 'já' — to je 1. osoba a jeden člověk, tedy jednotné číslo. Kdyby pilo víc lidí, řekli bychom 'pijeme'." },
  { q: "Jaký čas má sloveso 'šla'?", a: "minulý", opts: ["minulý", "přítomný", "budoucí", "podmiňovací"], e: "Tvar 'šla' popisuje děj, který už skončil — je to čas minulý. Přítomnost by byla 'jde' a budoucnost 'půjde'." },
  { q: "Urči osobu a číslo: 'zpívají'", a: "3. osoba množného čísla", opts: ["3. osoba množného čísla", "1. osoba množného čísla", "2. osoba množného čísla", "3. osoba jednotného čísla"], e: "K tvaru 'zpívají' patří zájmeno 'oni' — to je 3. osoba a protože jich je víc, jde o číslo množné. Jeden by 'zpíval' (3. osoba jednotného čísla)." },
  { q: "Jaký způsob má sloveso 'chodí'?", a: "oznamovací", opts: ["oznamovací", "rozkazovací", "podmiňovací", "přací"], e: "Tvar 'chodí' jen oznamuje, že se něco děje — to je způsob oznamovací. Rozkaz by zněl 'choď!' a podmiňovací 'chodil by'." },
  { q: "Urči čas: 'půjdeme'", a: "budoucí", opts: ["budoucí", "přítomný", "minulý", "neurčitý"], e: "Tvar 'půjdeme' vyjadřuje děj, který se teprve uskuteční — to je čas budoucí. Přítomnost by byla 'jdeme', minulost 'šli jsme'." },
  { q: "Urči osobu a číslo: 'on čte'", a: "3. osoba jednotného čísla", opts: ["3. osoba jednotného čísla", "1. osoba", "2. osoba", "3. osoba množného čísla"], e: "Zájmeno 'on' označuje toho, o kom mluvíme — to je 3. osoba a je to jeden, tedy jednotné číslo. Kdyby četli, řekli bychom 'oni čtou' (množné číslo)." },
  { q: "Jaký způsob má 'pojď!' ?", a: "rozkazovací", opts: ["rozkazovací", "oznamovací", "podmiňovací", "neurčitý"], e: "Tvar 'pojď!' je výzva, abys přišel — to je způsob rozkazovací, poznáš ho i podle vykřičníku. Oznamovací by jen sděloval děj, podmiňovací by obsahoval 'by'." },
  { q: "Urči čas: 'zpívala jsem'", a: "minulý", opts: ["minulý", "přítomný", "budoucí", "podmiňovací"], e: "Pomocné sloveso 'jsem' s tvarem 'zpívala' ukazuje na děj, který už proběhl — je to čas minulý. Přítomnost by byla 'zpívám', budoucnost 'budu zpívat'." },
];

const POOL_L2: QA[] = [
  { q: "Urči osobu, číslo, čas: 'nesli jsme'", a: "1. osoba množného čísla, minulý čas", opts: ["1. osoba množného čísla, minulý čas", "3. osoba množného čísla, minulý čas", "1. osoba j.č., minulý čas", "2. osoba mn.č., přítomný čas"], e: "Pomocné sloveso 'jsme' patří k zájmenu 'my' — to je 1. osoba množného čísla, a koncovka '-li' i 'jsme' ukazují na minulý čas. Kdyby nesli jiní, řekli bychom jen 'nesli' bez 'jsme' (3. osoba)." },
  { q: "Urči osobu, číslo, způsob: 'čtěte'", a: "2. osoba množného čísla, rozkazovací způsob", opts: ["2. osoba množného čísla, rozkazovací způsob", "2. osoba j.č., rozkazovací", "3. osoba mn.č., oznamovací", "1. osoba mn.č., rozkazovací"], e: "Tvar 'čtěte' je výzva určená 'vám', tedy 2. osobě množného čísla, a protože něco přikazuje, jde o rozkazovací způsob. Jednomu bychom řekli 'čti', víc lidem 'čtěte'." },
  { q: "Jaký čas má: 'budu se učit'?", a: "budoucí (opisný)", opts: ["budoucí (opisný)", "přítomný", "minulý", "podmiňovací"], e: "Spojení 'budu' + neurčitek 'učit' tvoří budoucí čas, kterému říkáme opisný (skládá se ze dvou slov). Přítomnost by byla 'učím se', minulost 'učil jsem se'." },
  { q: "Urči způsob: 'byl bych rád'", a: "podmiňovací", opts: ["podmiňovací", "oznamovací", "rozkazovací", "přací"], e: "Slůvko 'bych' prozradí podmiňovací způsob — vyjadřuje přání nebo to, co by mohlo nastat. Bez něj ('byl jsem rád') by šlo o oznamovací způsob v minulém čase." },
  { q: "Urči osobu a číslo: 'letíte'", a: "2. osoba množného čísla", opts: ["2. osoba množného čísla", "1. osoba množného čísla", "3. osoba množného čísla", "2. osoba jednotného čísla"], e: "K tvaru 'letíte' patří zájmeno 'vy' — to je 2. osoba a víc lidí, tedy množné číslo. Jednomu bychom řekli 'letíš' (jednotné číslo)." },
  { q: "Urči čas: 'chodila'", a: "minulý", opts: ["minulý", "přítomný", "budoucí", "podmiňovací"], e: "Tvar 'chodila' popisuje děj, který už proběhl — je to čas minulý. Přítomnost by byla 'chodí', budoucnost 'bude chodit'." },
  { q: "Urči osobu a číslo: 'prší'", a: "3. osoba jednotného čísla (neosobní)", opts: ["3. osoba jednotného čísla (neosobní)", "1. osoba j.č.", "2. osoba j.č.", "nelze určit"], e: "U sloves jako 'prší' nikdo děj nevykonává (neříkáme 'já prším'), proto je řadíme k 3. osobě jednotného čísla a nazýváme je neosobní. Osobu sice přímo nevidíme, ale určit ji lze." },
  { q: "Urči způsob: 'přišel bys'", a: "podmiňovací", opts: ["podmiňovací", "oznamovací", "rozkazovací", "tázací"], e: "Slůvko 'bys' je znakem podmiňovacího způsobu — vyjadřuje, co by se stalo za nějaké podmínky. Bez něj ('přišel jsi') by šlo o oznamovací způsob v minulém čase." },
  { q: "Urči osobu, číslo, čas: 'napsal jsem'", a: "1. osoba j.č., minulý čas", opts: ["1. osoba j.č., minulý čas", "3. osoba j.č., minulý čas", "1. osoba mn.č., minulý čas", "2. osoba j.č., minulý čas"], e: "Pomocné sloveso 'jsem' patří k zájmenu 'já' — to je 1. osoba jednotného čísla, a tvar 'napsal jsem' označuje minulý čas. Kdyby psal víc lidí, bylo by 'napsali jsme'." },
  { q: "Urči způsob: 'čti!'", a: "rozkazovací", opts: ["rozkazovací", "oznamovací", "podmiňovací", "přací"], e: "Tvar 'čti!' je příkaz, abys něco udělal — to je způsob rozkazovací (poznáš ho i podle vykřičníku). Oznamovací by jen sděloval ('čteš'), podmiňovací by obsahoval 'bys'." },
  { q: "Urči čas: 'přijde'", a: "budoucí", opts: ["budoucí", "přítomný", "minulý", "podmiňovací"], e: "Tvar 'přijde' označuje děj, který teprve nastane — to je čas budoucí. Přítomnost by byla 'přichází', minulost 'přišel'." },
  { q: "Urči osobu a číslo: 'nezapomeňte'", a: "2. osoba množného čísla", opts: ["2. osoba množného čísla", "1. osoba množného čísla", "2. osoba j.č.", "3. osoba mn.č."], e: "Tvar 'nezapomeňte' je výzva určená 'vám', tedy 2. osobě množného čísla. Jednomu člověku bychom řekli 'nezapomeň'." },
  { q: "Co je neurčitek (infinitiv)?", a: "základní tvar slovesa — 'číst, psát, jít'", opts: ["základní tvar slovesa — 'číst, psát, jít'", "přítomný čas", "minulý čas", "rozkazovací způsob"], e: "Neurčitek je základní tvar slovesa, který sám neurčuje osobu ani čas — končí nejčastěji na -t (číst, psát, jít). Teprve když ho začneme časovat ('čtu', 'četl jsem'), získá osobu a čas." },
  { q: "Urči osobu a číslo: 'doběhla'", a: "3. osoba jednotného čísla (ona)", opts: ["3. osoba jednotného čísla (ona)", "1. osoba j.č.", "2. osoba j.č.", "3. osoba mn.č."], e: "Tvar 'doběhla' patří k zájmenu 'ona' — to je 3. osoba a jeden člověk, tedy jednotné číslo. Kdyby doběhlo víc dívek, řekli bychom 'doběhly' (množné číslo)." },
  { q: "Urči způsob: 'chodím'", a: "oznamovací", opts: ["oznamovací", "rozkazovací", "podmiňovací", "neurčitý"], e: "Tvar 'chodím' jen oznamuje, co dělám — to je způsob oznamovací. Rozkaz by zněl 'choď!' a podmiňovací 'chodil bych'." },
  { q: "Urči čas: 'bude pít'", a: "budoucí (opisný)", opts: ["budoucí (opisný)", "přítomný", "minulý", "podmiňovací"], e: "Spojení 'bude' + neurčitek 'pít' tvoří budoucí čas, kterému říkáme opisný (skládá se ze dvou slov). Přítomnost by byla 'pije', minulost 'pil'." },
];

const POOL_L3: QA[] = [
  { q: "Urči osobu, číslo, čas, způsob: 'zpívali bychom'", a: "1. osoba mn.č., podmiňovací způsob", opts: ["1. osoba mn.č., podmiňovací způsob", "3. osoba mn.č., podmiňovací", "2. osoba mn.č., oznamovací", "1. osoba j.č., podmiňovací"], e: "Slůvko 'bychom' patří k zájmenu 'my' — to je 1. osoba množného čísla — a zároveň je znakem podmiňovacího způsobu. Pro 3. osobu by bylo 'by', pro 1. osobu jednotného čísla 'bych'." },
  { q: "Jaký je rozdíl mezi 'číst' a 'čtu'?", a: "číst = infinitiv (neurčitek), čtu = přítomný čas, 1. os. j.č.", opts: ["číst = infinitiv (neurčitek), čtu = přítomný čas, 1. os. j.č.", "obojí je přítomný čas", "obojí je neurčitek", "číst = minulý čas"], e: "'Číst' je neurčitek — základní tvar bez osoby a času, zatímco 'čtu' je už vyčasované sloveso (já, teď, přítomný čas). Proto nemohou být obě stejná ani obě infinitivem." },
  { q: "Urči osobu, číslo, čas: 'psali jste'", a: "2. osoba mn.č., minulý čas", opts: ["2. osoba mn.č., minulý čas", "3. osoba mn.č., minulý čas", "2. osoba mn.č., přítomný čas", "1. osoba mn.č., minulý čas"], e: "Pomocné sloveso 'jste' patří k zájmenu 'vy' — to je 2. osoba množného čísla — a tvar 'psali jste' označuje minulý čas. Bez 'jste' ('psali') by šlo o 3. osobu." },
  { q: "Urči způsob: 'kdybychom přišli'", a: "podmiňovací (podmínková věta)", opts: ["podmiňovací (podmínková věta)", "oznamovací", "rozkazovací", "přací"], e: "Slovo 'kdybychom' v sobě skrývá 'bychom' a uvozuje podmínku — proto jde o podmiňovací způsob. Vyjadřuje něco, co by se stalo, jen kdyby platila daná podmínka." },
  { q: "Urči všechny mluvnické kategorie: 'nesl bys'", a: "2. os., j.č., podmiňovací způsob", opts: ["2. os., j.č., podmiňovací způsob", "1. os., j.č., podmiňovací", "3. os., j.č., oznamovací", "2. os., mn.č., podmiňovací"], e: "Slůvko 'bys' patří k zájmenu 'ty' — to je 2. osoba jednotného čísla — a označuje podmiňovací způsob. Pro 1. osobu by bylo 'bych', pro množné číslo 'byste'." },
  { q: "Urči čas: 'půjdeme si zaplavat'", a: "budoucí", opts: ["budoucí", "přítomný", "minulý", "podmiňovací"], e: "Tvar 'půjdeme' vyjadřuje děj, který se teprve uskuteční — to je čas budoucí. Přítomnost by byla 'jdeme', minulost 'šli jsme'." },
  { q: "Urči osobu, číslo, způsob: 'pojďme'", a: "1. os., mn.č., rozkazovací způsob", opts: ["1. os., mn.č., rozkazovací způsob", "2. os., mn.č., rozkazovací", "3. os., mn.č., oznamovací", "1. os., j.č., rozkazovací"], e: "Tvar 'pojďme' vybízí 'nás', tedy 1. osobu množného čísla, abychom něco udělali společně — i to je rozkazovací způsob. Kdybychom vyzývali jen druhé, řekli bychom 'pojďte' (2. osoba)." },
  { q: "Co vyjadřuje podmiňovací způsob?", a: "možnost, přání, podmínku (bych, bys, by, bychom...)", opts: ["možnost, přání, podmínku (bych, bys, by, bychom...)", "rozkaz nebo prosbu", "skutečný děj v přítomnosti", "budoucí děj"], e: "Podmiňovací způsob neříká, co se opravdu děje, ale co by mohlo nebo mělo nastat za nějaké podmínky — poznáš ho podle slůvek bych, bys, by, bychom. Skutečný děj vyjadřuje oznamovací způsob a příkaz rozkazovací." },
  { q: "Urči osobu, číslo, čas: 'odešly'", a: "3. os., mn.č., minulý čas (ony)", opts: ["3. os., mn.č., minulý čas (ony)", "1. os., mn.č., minulý čas", "3. os., j.č., minulý čas", "2. os., mn.č., minulý čas"], e: "Tvar 'odešly' patří k zájmenu 'ony' — to je 3. osoba množného čísla — a popisuje děj, který už proběhl (minulý čas). Jedna by 'odešla' (jednotné číslo)." },
  { q: "Urči všechny kategorie: 'přinesli jste'", a: "2. os., mn.č., minulý čas, oznamovací způsob", opts: ["2. os., mn.č., minulý čas, oznamovací způsob", "3. os., mn.č., minulý čas", "1. os., mn.č., minulý čas", "2. os., mn.č., budoucí čas"], e: "Pomocné sloveso 'jste' patří k 'vy' (2. osoba množného čísla), tvar označuje minulý čas a protože jen oznamuje děj, jde o oznamovací způsob. Bez 'jste' by šlo o 3. osobu." },
  { q: "Urči způsob: 'at' přijdou'", a: "přací / rozkazovací (ať + sloveso)", opts: ["přací / rozkazovací (ať + sloveso)", "oznamovací", "podmiňovací", "neurčitý"], e: "Spojení 'ať' + sloveso vyjadřuje přání nebo výzvu — řadíme ho k přacímu (rozkazovacímu) způsobu. Oznamovací by jen sděloval, podmiňovací by obsahoval 'by'." },
  { q: "Urči čas: 'bývalo'", a: "minulý (opakovaný děj v minulosti)", opts: ["minulý (opakovaný děj v minulosti)", "přítomný", "budoucí", "podmiňovací"], e: "Tvar 'bývalo' popisuje děj, který se v minulosti opakoval — pořád je to čas minulý. Přítomnost by byla 'bývá', budoucnost 'bude bývat'." },
  { q: "Urči osobu a číslo: 'sedí' (jako přísudek ve větě 'Děti sedí v kruhu.')", a: "3. os., mn.č. (děti sedí)", opts: ["3. os., mn.č. (děti sedí)", "3. os., j.č.", "1. os., mn.č.", "2. os., mn.č."], e: "Sloveso 'sedí' se řídí podmětem 'děti' — a protože dětí je víc a mluvíme o nich, jde o 3. osobu množného čísla. Tvar 'sedí' je stejný pro jednotné i množné číslo, proto musíme zkoumat podmět." },
  { q: "Co jsou mluvnické kategorie slovesa?", a: "osoba, číslo, čas, způsob", opts: ["osoba, číslo, čas, způsob", "rod, číslo, pád, vzor", "čas, pád, osoba, vzor", "způsob, rod, vzor, pád"], e: "U slovesa určujeme čtyři kategorie: osobu, číslo, čas a způsob. Pád a vzor patří k podstatným jménům, ne ke slovesům." },
  { q: "Urči osobu, číslo, čas: 'přineste' (rozkaz)", a: "2. os., mn.č., rozkazovací způsob", opts: ["2. os., mn.č., rozkazovací způsob", "3. os., mn.č., oznamovací", "1. os., mn.č., přítomný čas", "2. os., j.č., rozkazovací"], e: "Tvar 'přineste' je příkaz určený 'vám', tedy 2. osobě množného čísla, a vyjadřuje rozkaz — proto rozkazovací způsob. Jednomu bychom řekli 'přines'." },
  { q: "Urči osobu, číslo, způsob: 'seděli bychom'", a: "1. os., mn.č., podmiňovací způsob", opts: ["1. os., mn.č., podmiňovací způsob", "2. os., mn.č., podmiňovací", "3. os., mn.č., podmiňovací", "1. os., j.č., podmiňovací"], e: "Slůvko 'bychom' patří k zájmenu 'my' (1. osoba množného čísla) a označuje podmiňovací způsob. Pro 2. osobu by bylo 'byste', pro 3. osobu 'by'." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Osoba: 1. já/my, 2. ty/vy, 3. on/ona/ono/oni/ony",
      "Číslo: jednotné (já, ty, on) nebo množné (my, vy, oni)",
      "Čas: minulý (byl), přítomný (je), budoucí (bude)",
      "Způsob: oznamovací (chodí), rozkazovací (choď!), podmiňovací (chodil by)",
    ],
    explanation: e,
  }));
}

export const SLOVESAMLUVNICKEKATEGORIECASOVANIVJEDNODUCHYCHCASECH: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-slovesa-mluvnicke-kategorie-casovani-v-jednoduchych-casech",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-slovesa-mluvnicke-kategorie-casovani-v-jednoduchych-casech",
    displayName: "Slovesa a časování",
    title: "Slovesa - mluvnické kategorie, časování v jednoduchých časech",
    studentTitle: "Slovesa a časy",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Naučíš se určovat osobu, číslo, čas a způsob sloves.",
    keywords: ["sloveso", "osoba", "číslo", "čas", "způsob", "časování", "mluvnické kategorie"],
    goals: [
      "Určit osobu, číslo, čas a způsob slovesa",
      "Časovat slovesa v přítomném, minulém a budoucím čase",
    ],
    boundaries: ["Bez préterita dokonavých sloves", "Bez kondicionálu minulého"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-jazykova-vychova-tvaroslovi-zajmena-druhy-zajmen"],
    generator: gen,
    helpTemplate: {
      hint: "Osoba=kdo, Číslo=j.č./mn.č., Čas=minulý/přítomný/budoucí, Způsob=oznamovací/rozkazovací/podmiňovací",
      steps: [
        "Kdo vykonává děj? → osoba (1./2./3.) a číslo (j.č./mn.č.)",
        "Kdy se děj odehrává? → čas (minulý/přítomný/budoucí)",
        "Jak je děj vyjádřen? → způsob (oznamovací/rozkazovací/podmiňovací)",
      ],
      commonMistake: "Záměna přítomného a budoucího času: 'čtu' = přítomný; 'budu číst' = budoucí",
      example: "čteme: 1. os., mn.č., přítomný čas, oznamovací způsob",
    },
  },
];
