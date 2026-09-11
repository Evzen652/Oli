import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Z původního poolu vypadly
// distraktory se slovem „prý“ (pravidlo §0), odpovědi se závorkou, která
// prozrazovala klíč („— vysvětluje chování“), úlohy, kde šly obhájit dvě
// odpovědi, a oslovení dítěte v mužském rodě („kdybys psal“). Každá úloha
// s ukázkou má právě jednu větu, která s tématem nesouvisí (nebo právě
// jednu, která nese hlavní sdělení).
//
// L1 = co je podstatné a okrajové, krátké ukázky · L2 = podstatnost podle
// toho, co čtenář hledá, shrnutí · L3 = přenos: hlavní myšlenka z více vět,
// rada spolužákovi, co vynechat.

function ukazka(q: string, vety: [string, string, string, string], klic: number, proc: [string, string, string, string], hints: [string, string], explanation: string): PracticeTask {
  const spatne = vety.map((v, i) => ({ value: v, why: proc[i] })).filter((_, i) => i !== klic) as [
    { value: string; why: string }, { value: string; why: string }, { value: string; why: string },
  ];
  return choice(`${q} „${vety.join(" ")}“`, vety[klic], spatne, { hints, explanation });
}

const L1: PracticeTask[] = [
  choice("Co je podstatná informace?", "ta, bez které by text nedával smysl", [
    { value: "každá věta v textu", why: "Některé věty jsou jen drobnosti navíc." },
    { value: "zajímavá drobnost navíc", why: "Drobnost navíc je okrajová informace." },
    { value: "věta napsaná v závorce", why: "Podle závorky o důležitosti nerozhodneš." },
  ], {
    hints: ["Co by se stalo s textem, kdybys tu informaci vyškrtl nebo vyškrtla?", "Podstatná informace nese to hlavní. Bez ní by čtenář nevěděl, o co v textu vůbec jde, a text by se rozpadl."],
    explanation: "Podstatná informace je ta, bez které by text ztratil smysl nebo hlavní sdělení.",
  }),
  choice("Co je okrajová informace?", "drobnost, bez které text pořád dává smysl", [
    { value: "nejdůležitější věta textu", why: "To je naopak podstatná informace." },
    { value: "hlavní téma textu", why: "Téma je to nejdůležitější." },
    { value: "nadpis textu", why: "Nadpis ukazuje téma, drobností není." },
  ], {
    hints: ["Když drobnost z textu vynecháš, změní se to hlavní?", "Okrajová informace text zpestří, ale o tom hlavním nerozhoduje. Vynechat se dá."],
    explanation: "Okrajová informace je drobnost navíc — když ji vynecháme, text pořád dává smysl.",
  }),
  choice("Jak poznáš, jestli je informace podstatná?", "zkusím ji vynechat", [
    { value: "je to vždy nejdelší věta", why: "Délka o důležitosti nerozhoduje." },
    { value: "je to vždy první věta", why: "Hlavní sdělení může být kdekoli." },
    { value: "je v ní vykřičník", why: "Vykřičník o důležitosti nic neříká." },
  ], {
    hints: ["Co se stane, když informaci z textu odmyslíš?", "Když bez informace text ztratí smysl, byla podstatná. Když se nic nezmění, byla okrajová."],
    explanation: "Informaci zkusíme vynechat: když text ztratí smysl, je podstatná, když ne, je okrajová.",
  }),
  ukazka("Která věta vyjadřuje hlavní sdělení textu?", ["Naše škola vyhrála štafetu v okresním závodě.", "Závodilo se na městském stadionu.", "Jeden běžec měl zelené tkaničky.", "Diváci jedli zmrzlinu."], 0,
    ["", "Místo závodu je doplňující údaj.", "Barva tkaniček je drobnost navíc.", "Co jedli diváci, s výsledkem nesouvisí."],
    ["Co by škola napsala do zprávy na web jako první?", "Hlavní sdělení je to, kvůli čemu zpráva vznikla — co se na závodě stalo. Ostatní věty jen dokreslují."],
    "Hlavní sdělení je, že škola vyhrála štafetu. Ostatní věty jsou doplňující drobnosti."),
  ukazka("Která věta je okrajová?", ["Ve vesnici vypukl požár stodoly.", "Hasiči oheň uhasili za hodinu.", "Nikdo nebyl zraněn.", "Jeden hasič měl na helmě nálepku."], 3,
    ["Požár je hlavní událost.", "To je důležitý údaj o zásahu.", "To je důležitá zpráva pro čtenáře.", ""],
    ["Která věta nic neříká o požáru ani o zásahu?", "Tři věty mluví o požáru, zásahu a zraněných. Jedna je jen drobnost, bez které by zpráva nic neztratila."],
    "Nálepka na helmě s požárem nesouvisí — je to okrajová informace."),
  ukazka("Co je v oznámení nejdůležitější?", ["Zítra nepůjde elektřina od 8 do 12 hodin.", "Oprava se týká celé ulice.", "Elektrikáři přijedou bílým autem.", "Pan Novák má nový plot."], 0,
    ["", "To je doplňující údaj, hlavní je, kdy elektřina nepůjde.", "Barva auta nikoho neomezí.", "Plot pana Nováka s oznámením nesouvisí."],
    ["Co potřebují obyvatelé ulice vědět hlavně?", "Oznámení má lidi upozornit na věc, která je omezí. Hledej větu, podle které se zařídí."],
    "Nejdůležitější je, kdy nepůjde elektřina — podle toho se lidé zařídí."),
  ukazka("Která věta je okrajová?", ["Tygři žijí v Asii.", "Jsou ohrožení, protože lidé kácejí lesy.", "Fotograf, který je fotil, měl zelenou bundu.", "V přírodě jich zbývá málo."], 2,
    ["Kde tygři žijí, je důležitá informace.", "Příčina ohrožení je podstatná.", "", "Kolik jich zbývá, je podstatné."],
    ["Která věta není o tygrech?", "Všechny věty kromě jedné mluví o tom, kde tygři žijí a proč jsou ohrožení."],
    "Bunda fotografa o tygrech nic neříká — je okrajová."),
  ukazka("Která věta je okrajová?", ["Třída jela na výlet do zoo.", "Viděli slony, žirafy a lvy.", "Autobus byl modrý.", "Nejvíc se dětem líbila žirafa."], 2,
    ["O tom je celý text.", "To je hlavní zážitek z výletu.", "", "To patří k zážitkům z výletu."],
    ["Která věta s návštěvou zoo nesouvisí?", "Výlet, zvířata i to, co se dětem líbilo, patří k tématu. Jedna věta je jen drobnost o cestě."],
    "Barva autobusu s návštěvou zoo nesouvisí — je okrajová."),
  choice("Proč rozlišujeme podstatné a okrajové informace?", "abychom pochopili, co je v textu hlavní", [
    { value: "abychom text rychle zapomněli", why: "Chceme si naopak zapamatovat to hlavní." },
    { value: "abychom psali rychleji", why: "Se psaním to nesouvisí." },
    { value: "abychom našli pravopisné chyby", why: "To je jiná činnost." },
  ], {
    hints: ["Co si z textu potřebuješ odnést?", "Když víš, co je hlavní, zapamatuješ si to podstatné a drobnosti tě nezmatou."],
    explanation: "Rozlišování nám pomáhá pochopit, co je v textu hlavní.",
  }),
  choice("Co dáš do shrnutí textu?", "jen podstatné informace", [
    { value: "všechny informace", why: "To by bylo převyprávění, ne shrnutí." },
    { value: "jen zajímavé drobnosti", why: "Drobnosti do shrnutí nepatří." },
    { value: "jen první větu textu", why: "První věta nemusí být ta hlavní." },
  ], {
    hints: ["Má být shrnutí dlouhé, nebo krátké?", "Shrnutí řekne v kostce to hlavní. Drobnosti vynechá."],
    explanation: "Do shrnutí patří jen podstatné informace, okrajové vynecháme.",
  }),
  ukazka("Která věta je okrajová?", ["Na náměstí se v sobotu koná jarmark.", "Začíná v 9 hodin.", "Stánky budou prodávat perníky a hračky.", "Loni tam pršelo."], 3,
    ["O tom je celá zpráva.", "Čas začátku je důležitý.", "Co se bude prodávat, je důležité.", ""],
    ["Která informace nepomůže nikomu, kdo chce na jarmark jít letos?", "Zpráva zve na letošní jarmark: kdy a co tam bude. Jedna věta ale mluví o něčem, co už bylo a letos nikomu nepomůže."],
    "Loňské počasí s letošním jarmarkem nesouvisí — je okrajové."),
  ukazka("Která informace je pro hraní hry okrajová?", ["Hra je pro dva hráče.", "Vyhrává ten, kdo první dojde do cíle.", "Hází se jednou kostkou.", "Krabice od hry je zelená."], 3,
    ["Počet hráčů je pro hru důležitý.", "Pravidlo vítězství je podstatné.", "Jak se hází, je důležité pravidlo.", ""],
    ["Která věta ti při hraní vůbec nepomůže?", "Pravidla říkají, kolik lidí hraje, jak se hraje a kdo vyhrává. Jedna věta s pravidly nesouvisí."],
    "Barva krabice pro hraní nic neznamená — je okrajová."),
  choice("Kamarádovi převyprávíš film jednou větou. Co řekneš?", "o čem film byl a jak dopadl", [
    { value: "jakou barvu měla sedadla v kině", why: "To s filmem nesouvisí." },
    { value: "kolik stál popcorn", why: "Cena popcornu nic neřekne o filmu." },
    { value: "jak se jmenoval uvaděč", why: "Uvaděč s filmem nesouvisí." },
  ], {
    hints: ["Co bude kamaráda zajímat?", "V jedné větě je místo jen pro to nejdůležitější: hlavní příběh filmu a jeho konec."],
    explanation: "Do jedné věty dáme to podstatné — o čem film byl a jak dopadl.",
  }),
];

const L2: PracticeTask[] = [
  ukazka("Text má vysvětlit, proč hroši žijí ve vodě. Která věta je okrajová?", ["Hroši tráví většinu dne ve vodě.", "Mají citlivou kůži a slunce by jim ublížilo.", "Ve vodě se také ochladí.", "Hroch Bobeš ze zoo váží dvě tuny."], 3,
    ["O tom je celý text.", "To je důvod, proč jsou ve vodě.", "To je další důvod.", ""],
    ["Která věta nevysvětluje, proč jsou hroši ve vodě?", "Tři věty mluví o vodě a důvodech. Jedna je zajímavost o jednom hrochovi."],
    "Váha hrocha Bobeše nevysvětluje, proč hroši žijí ve vodě — je okrajová."),
  choice("Které shrnutí textu o hroších je nejlepší?", "Hroši jsou většinu dne ve vodě, protože je chrání před sluncem.", [
    { value: "Hroch Bobeš ze zoo váží dvě tuny.", why: "To je jen drobnost z textu." },
    { value: "Hroši jsou velká zvířata.", why: "To text nevysvětluje, je to obecné." },
    { value: "Hroši, voda, slunce, kůže, dvě tuny.", why: "To je výčet slov, ne shrnutí." },
  ], {
    hints: ["Které shrnutí řekne v jedné větě to hlavní?", "Dobré shrnutí zachytí hlavní myšlenku textu celou větou — tady co hroši dělají a proč."],
    explanation: "Shrnutí zachytí hlavní myšlenku: hroši jsou ve vodě, protože je chrání před sluncem.",
  }),
  ukazka("Co je ve zprávě o závodě nejdůležitější?", ["Závod vyhrál Jan Novák z Brna.", "Běžel se startovním číslem 47.", "Svítilo slunce.", "U cíle hrála hudba."], 0,
    ["", "Startovní číslo je jen drobnost.", "Počasí je doplňující údaj.", "Hudba je drobnost."],
    ["Co chce každý po závodě vědět jako první?", "Zpráva o závodě má hlavně říct, jak závod dopadl. Číslo, počasí a hudba jsou jen kulisa."],
    "Nejdůležitější je, kdo závod vyhrál. Ostatní jsou doplňující drobnosti."),
  ukazka("Chceš vědět, jestli si vzít deštník. Co je podstatné?", ["Zítra bude celý den pršet.", "Teplota vystoupá na 15 °C.", "Fouká slabý vítr.", "Slunce vyjde v šest hodin."], 0,
    ["", "Teplota s deštníkem nesouvisí.", "Slabý vítr o dešti nic neříká.", "Východ slunce o dešti nic neříká."],
    ["Na čem záleží, když se rozhoduješ o deštníku?", "Podstatné je to, co potřebuješ pro své rozhodnutí. Pro deštník je to jen jedna věc."],
    "Pro deštník je podstatné, že bude pršet. Ostatní údaje s deštníkem nesouvisí."),
  ukazka("Chceš vědět, jestli si vzít teplou bundu. Co je podstatné?", ["Zítra bude celý den pršet.", "Teplota vystoupá jen na 5 °C.", "Fouká slabý vítr.", "Slunce vyjde v šest hodin."], 1,
    ["Déšť rozhoduje o deštníku, ne o teplé bundě.", "", "Slabý vítr zimu moc nezmění.", "Východ slunce nic neříká o zimě."],
    ["Na čem záleží, když se rozhoduješ o teplé bundě?", "Teď hledáš jinou informaci než u deštníku. Podstatné je to, co ti řekne, jaká bude zima."],
    "Pro teplou bundu je podstatná teplota. Stejný text — ale podstatné je něco jiného, protože hledáš něco jiného."),
  choice("Proč autoři dávají do textu i okrajové informace?", "aby byl text živější", [
    { value: "protože nevědí, co je důležité", why: "Autor drobnosti přidává schválně." },
    { value: "aby text byl delší za každou cenu", why: "Jde o zajímavost, ne o délku." },
    { value: "protože je to chyba", why: "Není to chyba, drobnosti text zpestřují." },
  ], {
    hints: ["Jak by se četl text, kde jsou jen suchá fakta?", "Drobnosti pomáhají čtenáři si věc představit a udržet pozornost."],
    explanation: "Okrajové informace text zpestřují a oživují, proto je autoři přidávají.",
  }),
  ukazka("Která věta je okrajová?", ["Praha je hlavní město České republiky.", "Protéká jí řeka Vltava.", "Na Pražském hradě sídlí prezident.", "Můj strýc tam jednou ztratil deštník."], 3,
    ["To je hlavní fakt o Praze.", "To je důležitý údaj o Praze.", "To je důležitý údaj o Praze.", ""],
    ["Která věta se týká jen jednoho člověka, ne Prahy?", "Tři věty jsou fakta o Praze. Jedna je zážitek, který s Prahou jako městem nesouvisí."],
    "Strýcův deštník nic neříká o Praze — je to okrajová informace."),
  choice("Jak napíšeš shrnutí textu?", "vlastními slovy, jen to hlavní", [
    { value: "opíšu celý text", why: "Opis není shrnutí." },
    { value: "vypíšu jen drobnosti", why: "Drobnosti do shrnutí nepatří." },
    { value: "přidám svoje nové nápady", why: "Shrnutí nepřidává nic, co v textu není." },
  ], {
    hints: ["Má být shrnutí delší, nebo kratší než text?", "Shrnutí je kratší než text a nepřebírá ho doslova — řekneš ho po svém. Tak poznáš, že textu rozumíš."],
    explanation: "Shrnutí zachytí vlastními slovy jen to hlavní z textu.",
  }),
  ukazka("Která věta je okrajová?", ["Včely opylují květy.", "Bez nich by nebylo ovoce.", "Včelař pan Malý má vousy.", "Včel v přírodě ubývá."], 2,
    ["To je hlavní význam včel.", "To vysvětluje, proč jsou včely důležité.", "", "To je důležitá zpráva o včelách."],
    ["Která věta není o včelách?", "Tři věty mluví o tom, co včely dělají a proč jsou důležité. Jedna je drobnost o jednom člověku."],
    "Vousy pana Malého o včelách nic neříkají — je to okrajová informace."),
  choice("Která otázka ti pomůže najít podstatné informace ve zprávě?", "Co se stalo, kde a kdy?", [
    { value: "Jakou barvu měla tužka autora?", why: "Tužka autora s obsahem zprávy nesouvisí." },
    { value: "Kolik slov má zpráva?", why: "Počet slov o obsahu nic neřekne." },
    { value: "Která věta je nejdelší?", why: "Délka o důležitosti nerozhoduje." },
  ], {
    hints: ["Na co odpovídá každá zpráva v novinách?", "Každá zpráva odpovídá na několik základních otázek: jaká událost, na jakém místě, v jaký čas a kdo u toho byl."],
    explanation: "Otázky co, kde a kdy vedou k podstatným informacím každé zprávy.",
  }),
  ukazka("Chceš jet na Sněžku lanovkou. Co je pro tebe nejdůležitější?", ["Na Sněžce napadl první sníh.", "Lanovka proto dnes nejezdí.", "Na chatě mají nové záclony.", "Výhled odtud bývá krásný."], 1,
    ["Sníh je důvod, ale pro tebe je hlavní, že lanovka nejede.", "", "Záclony s cestou nesouvisí.", "Výhled nic neříká o tom, jestli pojedeš."],
    ["Co ovlivní tvoji cestu lanovkou?", "Podstatné je to, co ovlivní tvůj plán. Jedna věta ti řekne, jestli se lanovkou vůbec dostaneš nahoru."],
    "Pro cestu lanovkou je nejdůležitější, že dnes nejezdí."),
  ukazka("Která věta je v textu o chřipce okrajová?", ["Chřipka se šíří kapénkami.", "Pomáhá si často mýt ruce.", "V čekárně jsou modré židle.", "Nemocní mají zůstat doma."], 2,
    ["To je důležitá informace o šíření.", "To je důležitá rada.", "", "To je důležitá rada."],
    ["Která věta nic neříká o chřipce ani o tom, jak se chránit?", "Text radí, jak se chřipka šíří a jak se chránit. Jedna věta je drobnost o místnosti."],
    "Modré židle v čekárně s chřipkou nesouvisí — jsou okrajovou informací."),
  choice("Proč do shrnutí nepatří okrajové informace?", "shrnutí má říct jen to hlavní", [
    { value: "okrajové informace jsou nepravdivé", why: "Pravdivé jsou, jen nejsou hlavní." },
    { value: "shrnutí musí mít jen jednu větu", why: "Shrnutí může mít i víc vět." },
    { value: "je to zakázané", why: "Zakázané to není, jen to shrnutí neslouží." },
  ], {
    hints: ["K čemu shrnutí slouží?", "Shrnutí má čtenáři rychle říct to podstatné. Drobnosti by ho zdržely."],
    explanation: "Shrnutí zachycuje jen to hlavní — drobnosti by ho zbytečně prodlužovaly.",
  }),
];

const L3: PracticeTask[] = [
  choice("Táž informace je v jednom textu podstatná a v jiném okrajová. Co o tom rozhoduje?", "téma a účel textu", [
    { value: "délka informace", why: "Délka o důležitosti nerozhoduje." },
    { value: "pořadí ve větě", why: "Pořadí nerozhoduje." },
    { value: "počet slov v textu", why: "Počet slov nerozhoduje." },
  ], {
    hints: ["Je barva auta důležitá ve zprávě o nehodě? A ve zprávě o počasí?", "Podstatnost záleží na tom, o čem text je a k čemu slouží. Stejný údaj může být v jednom textu klíčový a v jiném zbytečný."],
    explanation: "O podstatnosti rozhoduje téma a účel textu — co chce text sdělit.",
  }),
  ukazka("Proč je prales důležitý pro celou planetu?", ["Amazonský prales je největší deštný prales světa.", "Žije v něm obrovské množství zvířat a rostlin.", "Stromy v něm vyrábějí kyslík.", "Řeka Amazonka je velmi dlouhá."], 2,
    ["Velikost pralesa nevysvětluje, proč ho potřebuje celá planeta.", "To je důležité pro prales, ale otázka se ptá na celou planetu.", "", "Délka řeky s významem pro planetu nesouvisí."],
    ["Co z pralesa potřebují všichni lidé na Zemi?", "Hledáš větu, která odpovídá právě na otázku „proč pro celou planetu“. Ostatní věty jsou pravdivé, ale na tuhle otázku neodpovídají."],
    "Pro celou planetu je důležité, že stromy v pralese vyrábějí kyslík."),
  ukazka("Kdyby zpráva o zápase měla jen jednu větu, která to bude?", ["Zápas skončil 3:1 pro domácí.", "Hrálo se v dešti.", "Diváci hlasitě fandili.", "Stadion byl vyprodaný."], 0,
    ["", "Počasí je doplněk.", "Fandění je doplněk.", "Počet diváků je doplněk."],
    ["Co chce každý fanoušek vědět nejdřív?", "Jedna věta musí nést to nejdůležitější ze zprávy o zápase — jak zápas dopadl."],
    "Nejdůležitější je výsledek zápasu. Ostatní věty jen dokreslují atmosféru."),
  ukazka("Text je o tom, proč je voda důležitá pro život. Která věta je okrajová?", ["Voda vře při sto stupních.", "Bez vody nemůže žít žádný tvor.", "Lidské tělo je z velké části voda.", "Rostliny potřebují vodu k růstu."], 0,
    ["", "To přímo souvisí s tématem.", "To ukazuje, jak je voda pro nás důležitá.", "To ukazuje, proč vodu potřebují rostliny."],
    ["Která věta je sice pravdivá, ale nesouvisí s životem?", "Tři věty mluví o tom, proč vodu potřebují živí tvorové. Jedna je fakt o vodě, který s tématem nesouvisí."],
    "Bod varu je pravdivý fakt, ale s významem vody pro život nesouvisí — v tomto textu je okrajový."),
  ukazka("Píšeš krátkou zprávu o mistrovství. Kterou větu vynecháš?", ["Mistrovství vyhrálo Japonsko.", "Ve finále porazilo Brazílii.", "Finále se hrálo v Tokiu.", "Na tribuně seděl kluk s červenou čepicí."], 3,
    ["Vítěz je nejdůležitější.", "Soupeř ve finále je důležitý.", "Místo finále je důležitý údaj.", ""],
    ["Která věta nic neříká o mistrovství?", "Krátká zpráva má místo jen na podstatné. Vynechej to, co s výsledkem a průběhem nesouvisí."],
    "Kluk s čepicí s výsledkem mistrovství nesouvisí — vynecháme ho."),
  ukazka("Která věta je pro text nejdůležitější?", ["Sopka Vesuv zasypala město Pompeje popelem.", "Stalo se to před téměř dvěma tisíci lety.", "Archeologové dnes město odkrývají.", "Průvodce v muzeu má rád kávu."], 0,
    ["", "Kdy se to stalo, je doplňující údaj.", "To je důsledek hlavní události.", "Průvodce s textem nesouvisí."],
    ["Bez které věty by ostatní věty nedávaly smysl?", "Hlavní událost je ta, ke které se ostatní věty vztahují — kdy se stala a co se děje dnes."],
    "Nejdůležitější je hlavní událost — Vesuv zasypal Pompeje. Ostatní věty na ni navazují."),
  choice("Proč může být stejná informace pro jednoho čtenáře důležitá a pro jiného ne?", "každý hledá v textu něco jiného", [
    { value: "informace jsou pro všechny stejné", why: "Záleží na tom, co čtenář potřebuje." },
    { value: "je to náhoda", why: "Není to náhoda, ale cíl čtení." },
    { value: "záleží na délce věty", why: "Délka nerozhoduje." },
  ], {
    hints: ["Hledáš v jízdním řádu totéž co tvůj kamarád, který jede jinam?", "Podstatné je to, co potřebuješ ty. Kamarád, který jede jinam, bude v jízdním řádu považovat za důležité jiné řádky."],
    explanation: "Podstatnost záleží na tom, co čtenář v textu hledá.",
  }),
  choice("Text má pět vět a máš ho shrnout jednou větou. Co uděláš?", "najdu, co spojuje většinu vět", [
    { value: "opíšu první větu", why: "První věta nemusí zachytit celý text." },
    { value: "opíšu nejdelší větu", why: "Délka nerozhoduje." },
    { value: "vyberu nejzajímavější drobnost", why: "Drobnost není hlavní myšlenka." },
  ], {
    hints: ["O čem je většina vět?", "Hlavní myšlenka je to, co mají věty společné. Tu napiš jednou vlastní větou."],
    explanation: "Shrnutí zachytí, co spojuje většinu vět — hlavní myšlenku celého textu.",
  }),
  ukazka("Chceš vědět, jak dlouho robot letěl. Která informace je podstatná?", ["Robot přistál na Marsu v roce 2021.", "Vážil přes jednu tunu.", "Cesta trvala sedm měsíců.", "Na Marsu pořídil tisíce fotek."], 2,
    ["Rok přistání neříká, jak dlouho letěl.", "Váha s délkou letu nesouvisí.", "", "Fotky s délkou letu nesouvisí."],
    ["Která věta odpovídá na otázku „jak dlouho“?", "Podstatnost teď řídí tvoje otázka. Hledej větu s údajem o délce cesty."],
    "Na otázku „jak dlouho letěl“ odpovídá věta o sedmi měsících cesty."),
  choice("Které shrnutí vystihuje text „Ledovce tají. Hladina moří stoupá. Pobřežní města jsou ohrožena.“?", "Oteplování ohrožuje města u moře.", [
    { value: "Ledovce jsou krásné.", why: "O kráse ledovců text nemluví." },
    { value: "Moře jsou velká.", why: "To text neříká." },
    { value: "Města jsou u moře.", why: "To je jen část a chybí příčina." },
  ], {
    hints: ["Jak spolu tři věty souvisejí?", "Věty jdou za sebou jako příčina a následek. Shrnutí má zachytit celý řetězec, ne jen jeden článek."],
    explanation: "Tání ledovců zvedá hladinu moří a to ohrožuje pobřežní města — shrnutí: oteplování ohrožuje města u moře.",
  }),
  choice("Kamarád vypráví o výletě a mluví jen o sedadlech ve vlaku a o knírku průvodčího. Až na konci řekne, že se v lese ztratili. Co mu poradíš?", "ať řekne hned to hlavní", [
    { value: "ať přidá víc drobností o vlaku", why: "Drobnosti by vyprávění ještě prodloužily." },
    { value: "ať mluví rychleji", why: "Rychlost nepomůže, pomůže pořadí." },
    { value: "ať raději nic neříká", why: "Vyprávět může — jen s tím hlavním." },
  ], {
    hints: ["Co je na tom výletě nejzajímavější?", "Posluchače zajímá hlavní událost. Drobnosti o vlaku ho unaví, než se dozví, že se ztratili."],
    explanation: "Poradíme mu začít tím hlavním (ztratili se v lese) a drobnosti vynechat.",
  }),
  choice("Úkol zní: Najdi v textu, kdy hrad vznikl. Co je pro tebe teď podstatné?", "rok založení hradu", [
    { value: "barva střechy", why: "Barva střechy s otázkou nesouvisí." },
    { value: "jméno kastelána", why: "Kastelán s rokem vzniku nesouvisí." },
    { value: "počet schodů do věže", why: "Počet schodů na otázku neodpovídá." },
  ], {
    hints: ["Na co se úkol ptá?", "Při hledání v textu je podstatné to, co odpovídá na otázku. Všechno ostatní můžeš přeskočit."],
    explanation: "Úkol se ptá, kdy hrad vznikl — podstatný je rok jeho založení.",
  }),
  choice("Proč nestačí vybrat nejdelší větu, když hledáš hlavní myšlenku?", "délka o důležitosti nerozhoduje", [
    { value: "nejdelší věta je vždy okrajová", why: "Vždy okrajová není — jen délka nic nedokazuje." },
    { value: "hlavní myšlenka je vždy nejkratší", why: "Ani to neplatí." },
    { value: "text hlavní myšlenku nemá", why: "Každý text nějakou hlavní myšlenku má." },
  ], {
    hints: ["Může být dlouhá věta plná drobností?", "Důležitost poznáš podle obsahu, ne podle toho, kolik má věta slov."],
    explanation: "Hlavní myšlenku poznáme podle obsahu. Délka věty o důležitosti nic neříká.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const ROZLISENIPODSTATNYCHAOKRAJOVYCHINFORMACI: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-rozliseni-podstatnych-a-okrajovych-informaci",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-rozliseni-podstatnych-a-okrajovych-informaci",
    displayName: "Hlavní a vedlejší info",
    title: "Rozlišení podstatných a okrajových informací",
    studentTitle: "Hlavní a vedlejší info",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se rozlišit, co je v textu důležité a co okrajové.",
    keywords: ["podstatná informace", "okrajová informace", "shrnutí", "hlavní myšlenka", "čtení s porozuměním"],
    goals: [
      "Rozlišit podstatné a okrajové informace v textu",
      "Vybrat, co patří do shrnutí",
    ],
    boundaries: ["Bez odborných textů", "Krátké ukázky přiměřené 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky"],
    generator: gen,
    helpTemplate: {
      hint: "Podstatná = bez ní text nedává smysl; okrajová = drobnost navíc. Záleží i na tom, co v textu hledáš.",
      steps: [
        "O čem text je?",
        "Zkus informaci vynechat — dává text pořád smysl?",
        "Nedává → podstatná; dává → okrajová.",
        "Do shrnutí dej jen podstatné informace.",
      ],
      commonMistake: "Považovat za podstatnou nejdelší nebo první větu",
      example: "Zpráva o požáru: „Hasiči oheň uhasili“ = podstatné; „hasič měl na helmě nálepku“ = okrajové",
    },
  },
];
