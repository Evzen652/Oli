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
  { q: "Co je téma ve vlastním textu?", a: "O čem chceme psát — základní myšlenka příběhu", opts: ["O čem chceme psát — základní myšlenka příběhu", "Jak dlouhý bude text", "Kdo napsal text", "Kde text vyjde"], e: "Téma je to hlavní, o čem příběh vypráví — jeho základní myšlenka. Délka textu, jméno autora ani místo vydání nám neřeknou, o čem text vlastně je." },
  { q: "Co je motiv v textu?", a: "Opakující se prvek nebo myšlenka (voda, přátelství, cesta)", opts: ["Opakující se prvek nebo myšlenka (voda, přátelství, cesta)", "Délka textu", "Jméno autora", "Pravopis v textu"], e: "Motiv je prvek, který se v textu vrací a propojuje ho — třeba voda, cesta nebo přátelství. Délka, jméno autora ani pravopis o obsahu příběhu nic nevypovídají." },
  { q: "Proč si před psaním sestavíme osnovu?", a: "Abychom věděli, co a v jakém pořadí napíšeme", opts: ["Abychom věděli, co a v jakém pořadí napíšeme", "Abychom text zkrátili", "Abychom opravili pravopis", "Abychom zjistili téma"], e: "Osnova je plán, který nám předem ukáže, co a v jakém pořadí napsat, aby text dával smysl. Pravopis opravujeme až v hotovém textu a téma si volíme ještě dřív než osnovu." },
  { q: "Co je styl autora?", a: "Způsob, jakým autor píše — volba slov, délka vět, tón", opts: ["Způsob, jakým autor píše — volba slov, délka vět, tón", "Délka textu", "Téma textu", "Jméno autora"], e: "Styl je to, jak autor píše — jaká slova volí, jak dlouhé tvoří věty a jakým tónem mluví. Není to téma (o čem píše) ani jeho jméno, ale jeho osobitý způsob psaní." },
  { q: "Čím text oživíme?", a: "Přídavnými jmény, přímou řečí, živým popisem", opts: ["Přídavnými jmény, přímou řečí, živým popisem", "Mnoha daty a čísly", "Jen podstatnými jmény", "Bez jakýchkoli přívlastků"], e: "Text ožije, když přidáme přídavná jména, přímou řeč postav a živý popis — čtenář si pak vše lépe představí. Spousta čísel nebo holá podstatná jména bez přívlastků naopak text ochudí." },
  { q: "Co je osnova vlastního textu?", a: "Plán textu: úvod, zápletka, vyvrcholení, závěr", opts: ["Plán textu: úvod, zápletka, vyvrcholení, závěr", "Výsledný text celý napsaný", "Jen závěr textu", "Jen téma a název"], e: "Osnova je stručný plán, který rozdělí příběh na úvod, zápletku, vyvrcholení a závěr. Není to hotový text ani jen jeho část — je to kostra, podle které teprve píšeme." },
  { q: "Jak napsat dobrý začátek příběhu?", a: "Zaujmout čtenáře otázkou, popisem nebo přímou řečí", opts: ["Zaujmout čtenáře otázkou, popisem nebo přímou řečí", "Začít dlouhým popisem počasí", "Uvést všechny postavy najednou", "Začít závěrem příběhu"], e: "Dobrý začátek čtenáře hned zaujme — třeba otázkou, zajímavým popisem nebo přímou řečí. Dlouhé líčení počasí nebo výčet všech postav najednou čtenáře spíš unaví." },
  { q: "Jak napsat dobrý konec příběhu?", a: "Uzavřít příběh a splnit příslib úvodu (rozuzlení)", opts: ["Uzavřít příběh a splnit příslib úvodu (rozuzlení)", "Přestat psát uprostřed věty", "Začít nový příběh", "Opakovat úvod doslova"], e: "Dobrý konec příběh uzavře a vyřeší to, co úvod naznačil — tomu říkáme rozuzlení. Přerušit text uprostřed, začínat nový příběh nebo jen zopakovat úvod by čtenáře nechalo na rozpacích." },
  { q: "Co je přídavné jméno a proč ho používat v textu?", a: "Zpřesňuje popis — 'starý dům' je konkrétnější než 'dům'", opts: ["Zpřesňuje popis — 'starý dům' je konkrétnější než 'dům'", "Nahrazuje podstatné jméno", "Vyjadřuje děj", "Vyjadřuje místo"], e: "Přídavné jméno popisuje vlastnost a zpřesňuje představu — 'starý dům' řekne víc než pouhý 'dům'. Děj vyjadřuje sloveso, proto přídavné jméno není od toho, aby nahrazovalo podstatné jméno." },
  { q: "Co je přímá řeč v příběhu a proč ji použít?", a: "Slova postav — oživuje text, ukazuje jejich charakter", opts: ["Slova postav — oživuje text, ukazuje jejich charakter", "Popis prostředí příběhu", "Komentář autora", "Shrnutí příběhu"], e: "Přímá řeč jsou slova, která postavy přímo říkají — text tak ožije a poznáme z ní jejich povahu. Popis prostředí nebo komentář autora nám postavu nenechá promluvit vlastními slovy." },
  { q: "Co je to 'brainstorming' před psaním?", a: "Zapisujeme všechny nápady na téma bez kritiky", opts: ["Zapisujeme všechny nápady na téma bez kritiky", "Opravujeme pravopis v hotovém textu", "Čteme text nahlas", "Píšeme konec příběhu jako první"], e: "Při brainstormingu si nejdřív zapíšeme všechny nápady k tématu a zatím žádný nehodnotíme — díky tomu jich vznikne víc. Oprava pravopisu nebo čtení nahlas přicházejí až později, s hotovým textem." },
  { q: "Co je revize textu?", a: "Čteme hotový text a opravujeme ho — obsah, styl, pravopis", opts: ["Čteme hotový text a opravujeme ho — obsah, styl, pravopis", "První psaní bez oprav", "Čtení textu spolužákovi", "Vydání textu"], e: "Revize je závěrečné pročtení hotového textu, při kterém opravíme obsah, styl i pravopis. Není to první psaní ani vydání — je to krok, kdy text vylepšujeme, než ho dáme číst ostatním." },
  { q: "Co je úvod příběhu?", a: "Uvede čtenáře do příběhu — kde, kdy, kdo", opts: ["Uvede čtenáře do příběhu — kde, kdy, kdo", "Největší napětí příběhu", "Rozuzlení příběhu", "Ponaučení na konci"], e: "Úvod čtenáře uvede do děje — řekne, kde a kdy se příběh odehrává a kdo v něm vystupuje. Největší napětí přijde až ve vyvrcholení a rozuzlení patří na konec." },
  { q: "Co je zápletka?", a: "Problém nebo událost, která rozhýbe příběh", opts: ["Problém nebo událost, která rozhýbe příběh", "Klidný úvod bez napětí", "Popis prostředí", "Rozuzlení příběhu"], e: "Zápletka je problém nebo událost, kvůli které se příběh dá do pohybu a začne se něco dít. Klidný úvod ani rozuzlení na konci tuto roli nemají — zápletka je tím, co příběh rozhýbe." },
  { q: "Proč je důležité psát vlastní text?", a: "Rozvíjí kreativitu, vyjadřovací schopnosti a fantazii", opts: ["Rozvíjí kreativitu, vyjadřovací schopnosti a fantazii", "Je to povinnost ve škole — nic víc", "Abychom se naučili opisovat", "Abychom psali rychleji"], e: "Psaním vlastního textu si trénujeme fantazii a učíme se vyjadřovat své myšlenky. Není to jen školní povinnost a rozhodně nejde o opisování — naopak při něm tvoříme něco svého." },
  { q: "Jak vybrat vhodné téma pro vlastní text?", a: "Vybereme, co nás zajímá nebo o čem víme — pak lépe píšeme", opts: ["Vybereme, co nás zajímá nebo o čem víme — pak lépe píšeme", "Vybereme nejdelší téma", "Vybereme téma, o kterém nic nevíme", "Vybereme náhodně"], e: "O tom, co nás baví nebo co známe, se píše nejlépe — máme totiž dost nápadů. Nejdelší nebo náhodné téma, či téma, o kterém nic nevíme, by nám psaní jen ztížilo." },
];

const POOL_L2: QA[] = [
  { q: "Jak zapracovat motiv přátelství do příběhu?", a: "Ukažeme postavy, jak si pomáhají nebo spolu prožívají těžké chvíle", opts: ["Ukažeme postavy, jak si pomáhají nebo spolu prožívají těžké chvíle", "Napíšeme slovo 'přátelství' co nejvíce", "Vložíme definici přátelství", "Popíšeme fyzický popis přátel"], e: "Motiv nejlépe zapracujeme tak, že ho ukážeme na ději — přátelé si pomáhají a drží spolu v těžkých chvílích. Mnohokrát napsané slovo 'přátelství' ani jeho slovníková definice příběh neoživí." },
  { q: "Co je nejsilnější místo v příběhu?", a: "Vyvrcholení — kdy příběh dosáhne největšího napětí", opts: ["Vyvrcholení — kdy příběh dosáhne největšího napětí", "Úvod — kdy začíná příběh", "Závěr — kdy příběh končí", "Zápletka — kdy začíná problém"], e: "Vyvrcholení je vrchol příběhu — okamžik s největším napětím, kdy se rozhoduje, jak to dopadne. Úvod teprve uvádí, zápletka rozjíždí děj a závěr vše uzavírá, ale nejsilnější je právě vyvrcholení." },
  { q: "Jak popsat prostředí v příběhu?", a: "Zapojit smysly: co vidíme, slyšíme, cítíme, hmatáme", opts: ["Zapojit smysly: co vidíme, slyšíme, cítíme, hmatáme", "Jen vyjmenovat objekty v prostředí", "Napsat souřadnice místa", "Nepolohu prostředí neuvádíme"], e: "Když zapojíme smysly a popíšeme, co je vidět, slyšet a cítit, čtenář se do prostředí lépe vžije. Pouhý výčet věcí nebo souřadnice místa takovou živou představu nevytvoří." },
  { q: "Jak psát dialog (přímou řeč) správně?", a: "Dolní+horní uvozovky + obsah + čárka + uvozovací věta malým", opts: ["Dolní+horní uvozovky + obsah + čárka + uvozovací věta malým", "Bez uvozovek — prostý text", "Jen tučné písmo", "V závorce"], e: "Přímou řeč píšeme do uvozovek a po ní následuje čárka a uvozovací věta malým písmenem (řekl, zeptala se). Bez uvozovek, jen tučně nebo v závorce by čtenář nepoznal, že jde o slova postavy." },
  { q: "Co je metafora v textu?", a: "Přirovnání bez 'jako': 'Petr je lev.' (přeneseně statečný)", opts: ["Přirovnání bez 'jako': 'Petr je lev.' (přeneseně statečný)", "Přirovnání s 'jako': 'Petr je jako lev.'", "Popis fyzického vzhledu", "Přímá řeč postavy"], e: "Metafora pojmenuje něco přeneseně, bez slůvka 'jako' — 'Petr je lev' znamená, že je statečný. Jakmile přidáme 'jako' ('Petr je jako lev'), nejde už o metaforu, ale o přirovnání." },
  { q: "Co je přirovnání (simile) v textu?", a: "Přirovnání se 'jako': 'Petr běží jako vítr.'", opts: ["Přirovnání se 'jako': 'Petr běží jako vítr.'", "Přirovnání bez 'jako'", "Citát z jiné knihy", "Faktická informace"], e: "Přirovnání spojuje dvě věci slůvkem 'jako' a tím něco zdůrazní — 'běží jako vítr' znamená velmi rychle. Bez 'jako' by šlo o metaforu, ne o přirovnání." },
  { q: "Jak si udělat poznámky před psaním?", a: "Brainstorming: klíčová slova, osnova, hlavní myšlenka", opts: ["Brainstorming: klíčová slova, osnova, hlavní myšlenka", "Přečíst jiný text a zkopírovat ho", "Napsat rovnou celý text", "Požádat kamaráda o nápady"], e: "Před psaním si zapíšeme klíčová slova, hlavní myšlenku a osnovu — máme pak z čeho vycházet. Opisovat cizí text nebo psát rovnou nanečisto bez plánu vede k chaosu." },
  { q: "Jak obohatit text synonymy?", a: "Nahradíme opakující se slovo jiným s podobným významem", opts: ["Nahradíme opakující se slovo jiným s podobným významem", "Slovo zdvojíme: 'šel šel'", "Slovo vypustíme", "Přidáme překlad slova"], e: "Synonyma jsou slova s podobným významem — když se nějaké slovo často opakuje, nahradíme ho jiným a text zní pestřeji. Zdvojení nebo vypuštění slova text nevylepší." },
  { q: "Co je kompozice textu?", a: "Celková stavba textu — jak jsou části uspořádány", opts: ["Celková stavba textu — jak jsou části uspořádány", "Délka textu v počtu slov", "Pravopis a interpunkce", "Téma a motiv"], e: "Kompozice je stavba textu — jak na sebe navazují úvod, zápletka, vyvrcholení a závěr. Není to počet slov ani pravopis, ale uspořádání jednotlivých částí do celku." },
  { q: "Jak zapsat reflexi po napsání textu?", a: "Co se mi povedlo? Co bych příště udělal jinak?", opts: ["Co se mi povedlo? Co bych příště udělal jinak?", "Opsat text podruhé", "Přeložit text do angličtiny", "Spočítat délku textu"], e: "Reflexe je zamyšlení nad vlastní prací — ptáme se, co se povedlo a co bychom příště udělali jinak, abychom se zlepšili. Opsat text znovu nebo spočítat slova nám o naší práci nic užitečného neřekne." },
  { q: "Co je 'show, don't tell' v psaní?", a: "Ukazujeme situaci (nepřímá), namísto přímého sdělení", opts: ["Ukazujeme situaci (nepřímá), namísto přímého sdělení", "Říkáme přímo, co chceme čtenáři říct", "Opisujeme text jiného autora", "Jen píšeme fakta"], e: "'Ukazuj, nevyprávěj' znamená, že situaci raději předvedeme na ději než ji přímo oznámíme — místo 'měl strach' napíšeme, jak se mu třesou ruce. Přímé sdělení čtenáři nedovolí, aby si to sám představil." },
  { q: "Jak prodloužit krátký příběh?", a: "Přidat popis prostředí, novou scénu nebo vedlejší postavu", opts: ["Přidat popis prostředí, novou scénu nebo vedlejší postavu", "Opakovat první odstavec", "Napsat závěr znovu", "Přidat seznam slov"], e: "Příběh smysluplně prodloužíme tak, že přidáme popis prostředí, další scénu nebo novou postavu — děj se tím rozvine. Opakování odstavce nebo seznam slov text jen uměle natáhnou, ale nic mu nepřinesou." },
  { q: "Co je rytmus textu?", a: "Střídání krátkých a dlouhých vět — tempo čtení", opts: ["Střídání krátkých a dlouhých vět — tempo čtení", "Počet slov v textu", "Téma textu", "Použité přídavné jméno"], e: "Rytmus vzniká střídáním krátkých a dlouhých vět, které řídí tempo čtení — krátké věty zrychlí, dlouhé zpomalí. Není to počet slov ani téma, ale to, jak text 'plyne'." },
  { q: "Jaký typ textu napíše 4. třída nejčastěji?", a: "Vypravování a popis (oba typy se učí v 4. ročníku)", opts: ["Vypravování a popis (oba typy se učí v 4. ročníku)", "Odborný článek", "Filozofická esej", "Dramatický monolog"], e: "Ve 4. třídě se učíme hlavně vypravování a popis — to jsou texty přiměřené našemu věku. Odborný článek, esej nebo dramatický monolog jsou náročné útvary pro starší žáky." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Téma = o čem text je; motiv = opakující se prvek",
      "Osnova = plán textu (úvod → zápletka → vyvrcholení → závěr)",
      "Text oživíme: přídavná jména, přímá řeč, živý popis",
    ],
    explanation: e,
  }));
}

export const VLASTNILITERARNITVORBANADANETEMA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-tvorba-na-dane-tema",
    rvpNodeId: "g4-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-tvorba-na-dane-tema",
    displayName: "Vlastní tvorba",
    title: "Vlastní literární tvorba na dané téma",
    studentTitle: "Píšu svůj příběh",
    illustrationDesc: "usmívající se dítě sedí u dřevěného stolu a píše vlastní příběh tužkou do otevřeného sešitu, nad jeho hlavou myšlenková bublina s malým rytířem a drakem, vedle stolu komínek barevných knih a kelímek s tužkami",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Naučíš se psát vlastní příběh s osnovou, popisem a přímou řečí.",
    keywords: ["vlastní tvorba", "téma", "motiv", "osnova", "přímá řeč", "styl", "popis", "vypravování"],
    goals: [
      "Sestavit osnovu pro vlastní příběh",
      "Použít přídavná jména a přímou řeč pro oživení textu",
      "Napsat ucelený příběh s úvodem, zápletkou, vyvrcholením a závěrem",
    ],
    boundaries: ["Bez pokročilých literárních technik", "Bez esejů a odborných textů"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka"],
    generator: gen,
    helpTemplate: {
      hint: "Téma=o čem; motiv=opakující se prvek; osnova=plán; text oživíme přídavnými jmény a přímou řečí",
      steps: [
        "Zvolíme téma a vymyslíme osnovu (úvod → zápletka → vyvrcholení → závěr).",
        "Píšeme první verzi — bez oprav.",
        "Oživíme text: přídavná jména, přímá řeč, živý popis.",
        "Revidujeme: obsah, styl, pravopis.",
      ],
      commonMistake: "Zapomenutí osnovy → chaotický text bez logického průběhu",
      example: "Téma: přátelství. Motiv: pomoc v těžké chvíli. Osnova: 1. Ztratil se pes. 2. Kamarádi ho hledají. 3. Najdou ho. 4. Jsou radi za přátelství.",
    },
  },
];

