import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pluralWithNumber } from "@/lib/czechGrammar";
import { shuffle } from "../_shared";

// Přepsáno 2026-09-12 (inventura obsahu). Původní generátor měl 10/10/10
// unikátních úloh, dvě sdílené nápovědy na celou úroveň (u části úloh dokonce
// nesouvisející se zadáním) a u chybných možností žádnou zpětnou vazbu.
// Teď tři disjunktní banky: L1 pojmy + jednoslabičné rýmy + rozpoznání
// přirovnání · L2 víceslabičné rýmy a doplňování přirovnání podle vlastnosti
// · L3 rýmové schéma, slovo, které se nerýmuje, rým i smysl zároveň, inverze.

const dvojic = (n: number) => pluralWithNumber(n, "dvojice", "dvojice", "dvojic");
const versu = (n: number) => pluralWithNumber(n, "verš", "verše", "veršů");
const strof = (n: number) => pluralWithNumber(n, "strofa", "strofy", "strof");

interface Uloha {
  q: string;
  a: string;
  /** [chybná možnost, proč je špatně právě tahle možnost u téhle úlohy] */
  w: [[string, string], [string, string], [string, string]];
  /** [malá nápověda, velká nápověda] — obě unikátní pro tuhle úlohu */
  h: [string, string];
  e: string;
}

function task({ q, a, w, h, e }: Uloha): PracticeTask {
  const optionFeedback: Record<string, string> = {};
  for (const [value, why] of w) optionFeedback[value] = why;
  return {
    question: q,
    correctAnswer: a,
    options: shuffle([a, ...w.map(([value]) => value)]),
    optionFeedback,
    hints: [h[0], h[1]],
    explanation: e,
  };
}

// ── L1 — pojmy, jednoduché rýmy, rozpoznání přirovnání ──────────────────────
const POOL_L1: Uloha[] = [
  {
    q: "Které slovo se rýmuje se slovem „pes“?",
    a: "les",
    w: [
      ["kočka", "„Kočka“ je psovi blízká významem, jenže o rýmu rozhoduje zvuk konce slova, ne význam."],
      ["pero", "„Pero“ začíná stejnou hláskou, jenže shoda na začátku rým netvoří."],
      ["okno", "„Okno“ končí docela jinak, takže se zadaným slovem nezní podobně."],
    ],
    h: [
      "Přečti si všechny možnosti nahlas a porovnávej u nich jenom konce, ne jejich význam.",
      "Zkus si u každé možnosti zakrýt začátek slova a poslouchej jenom to, co zbude. Hledáš zakončení, které zní přesně jako u zadaného slova — proto nepomůže ani slovo ze stejného světa zvířat, ani slovo se stejnou první hláskou.",
    ],
    e: "Obě slova končí stejně na -es, a proto se rýmují. Rým se pozná podle zvuku na konci, ne podle významu ani podle začátku slova.",
  },
  {
    q: "Které slovo se rýmuje se slovem „strom“?",
    a: "hrom",
    w: [
      ["les", "„Les“ se stromy souvisí významem, ale jeho konec zní jinak."],
      ["dub", "„Dub“ je druh stromu, jenže rým se řídí zvukem konce, ne tím, co slovo znamená."],
      ["stůl", "„Stůl“ začíná stejnými hláskami, o rýmu ale rozhoduje konec slova."],
    ],
    h: [
      "Dvě možnosti tě lákají tím, že patří do lesa, jedna stejným začátkem. Rozhoduj ale podle konce.",
      "Postupuj ve dvou krocích. Nejdřív vyřaď všechno, co sis vybral jen proto, že to se zadaným slovem souvisí významem. Potom u zbylých možností poslouchej poslední slabiku a porovnej ji se zadaným slovem — musí znít úplně stejně.",
    ],
    e: "Zadané slovo i správná odpověď končí na -om a znějí na konci stejně. Rým vzniká shodou zvuku, i když jsou to věci z úplně jiného světa.",
  },
  {
    q: "Které slovo se rýmuje se slovem „kos“?",
    a: "nos",
    w: [
      ["pták", "„Pták“ je slovo ze stejného světa zvířat, ale jeho konec zní úplně jinak."],
      ["zobák", "„Zobák“ ke kosovi patří, jenže rým se neřídí tím, co k sobě patří."],
      ["kus", "„Kus“ má stejný začátek a podobný zvuk, končí ale na -us, ne stejně jako zadané slovo."],
    ],
    h: [
      "Dvě slova v nabídce souvisí s ptáky a jedno má stejný začátek. Ani jedna z těch věcí o rýmu nerozhoduje.",
      "Nejtěžší je tady slovo, které zadanému slovu zní opravdu podobně. Přečti si obě slova nahlas a hodně pomalu a poslouchej samohlásku před poslední souhláskou — právě v ní se ta dvě slova od sebe liší.",
    ],
    e: "Zadané slovo i správná odpověď končí na -os, takže si jejich konce přesně odpovídají. Podobný, ale ne stejný konec rým netvoří.",
  },
  {
    q: "Které slovo se rýmuje se slovem „míč“?",
    a: "klíč",
    w: [
      ["branka", "„Branka“ patří k míči na hřišti, ale její konec zní úplně jinak."],
      ["hřiště", "„Hřiště“ souvisí s míčem významem, jenže rým se řídí zvukem konce slova."],
      ["mít", "„Mít“ má stejný začátek, o rýmu ale rozhoduje konec, ne první hláska."],
    ],
    h: [
      "Dvě možnosti patří ke sportu, jedna má stejný začátek. Rozhodni podle poslední slabiky.",
      "Vyslov zadané slovo a pak každou možnost zvlášť, pokaždé s důrazem na to, jak slovo dozní. Hledáš možnost, u které konec zní stejně — a je úplně jedno, jestli ta věc s míčem něco společného má, nebo ne.",
    ],
    e: "Zadané slovo i správná odpověď končí na -íč, a proto se rýmují. Věci ze stejného prostředí ještě rým netvoří.",
  },
  {
    q: "Které slovo se rýmuje se slovem „den“?",
    a: "sen",
    w: [
      ["noc", "„Noc“ je ke dni opakem, jenže opak ani protiklad rým netvoří."],
      ["ráno", "„Ráno“ patří ke dni významem, ale končí docela jinak."],
      ["dech", "„Dech“ má stejný začátek, o rýmu ale rozhoduje konec slova."],
    ],
    h: [
      "Nenech se zlákat slovy, která ke dni patří časem. Poslouchej jen poslední slabiku.",
      "Rozděl si možnosti do dvou skupin. V první budou slova, která sis vybral kvůli významu, protože se dnem souvisí. Ve druhé zůstane slovo, které jsi vybral podle zvuku. Pro rým je správná ta druhá skupina — a slovo v ní končí stejně jako zadané slovo.",
    ],
    e: "Obě slova končí na -en, takže jejich konce znějí stejně. Opak ani slovo z téhož časového okruhu rým neudělá.",
  },
  {
    q: "Které slovo se rýmuje se slovem „sůl“?",
    a: "stůl",
    w: [
      ["pepř", "„Pepř“ patří k soli na stole, ale jeho konec zní úplně jinak."],
      ["slánka", "„Slánka“ je nádoba na sůl, jenže rým se řídí zvukem konce, ne tím, co k čemu patří."],
      ["sud", "„Sud“ začíná stejnou hláskou, končí ale jinak, takže rým netvoří."],
    ],
    h: [
      "Dvě slova v nabídce patří do kuchyně a jedno má stejný začátek. Nic z toho ale o rýmu nerozhoduje.",
      "Zkus si každé slovo z nabídky říct hned za zadaným slovem, jako by šlo o dva konce veršů. Uslyšíš, že většina dvojic drhne. Jenom u jedné se konec zopakuje úplně stejně, a právě takové dvojici říkáme rým.",
    ],
    e: "Zadané slovo i správná odpověď končí na -ůl, proto si jejich konce odpovídají. Slova, která spolu souvisejí významem, se rýmovat nemusí.",
  },
  {
    q: "Jak říkáme jednomu jedinému řádku básně?",
    a: "Verš",
    w: [
      ["Strofa", "Strofa je celá skupina řádků oddělená mezerou, ne jeden řádek."],
      ["Rým", "Rým je souznění konců slov, žádnou část zápisu neoznačuje."],
      ["Přirovnání", "Přirovnání porovnává dvě věci slovem „jako“, s délkou řádku nesouvisí."],
    ],
    h: [
      "Ptáme se na nejmenší dílek básně — na to, co je v ní jeden samostatný řádek.",
      "Strofa je skupina řádků oddělená mezerou, rým je souznění konců slov a přirovnání porovnává dvě věci slovem „jako“. Ani jeden z těchhle tří pojmů neoznačuje jeden samostatný řádek, a přesně na ten se ptáme.",
    ],
    e: "Nejmenší dílek básně je jeden řádek a jmenuje se verš. Několik veršů teprve dohromady tvoří strofu.",
  },
  {
    q: "Jak říkáme skupině řádků, kterou v básni odděluje prázdný řádek?",
    a: "Strofa",
    w: [
      ["Verš", "Verš je jediný řádek básně, ne celá jeho skupina."],
      ["Rým", "Rým je souznění konců slov, o rozdělení básně na části neříká nic."],
      ["Přirovnání", "Přirovnání porovnává dvě věci slovem „jako“, části básně nepojmenovává."],
    ],
    h: [
      "Hledáš celek složený z několika řádků, ne jediný řádek a ne zvukovou ozdobu.",
      "Verš je jeden řádek básně, rým je souznění konců slov a přirovnání porovnává dvě věci slovem „jako“. Žádný z těchhle tří pojmů neoznačuje skupinu řádků oddělenou prázdným řádkem — a právě tuhle skupinu hledáš.",
    ],
    e: "Skupina řádků oddělená prázdným řádkem se jmenuje strofa. V básni plní stejnou úlohu jako odstavec ve vyprávění.",
  },
  {
    q: "Jak říkáme tomu, že dvě slova znějí na konci stejně?",
    a: "Rým",
    w: [
      ["Verš", "Verš je jeden řádek básně, o zvuku slov neříká nic."],
      ["Strofa", "Strofa je skupina řádků v básni, ne shoda konců dvou slov."],
      ["Přirovnání", "Přirovnání porovnává dvě věci slovem „jako“, na zvuku slov nezáleží."],
    ],
    h: [
      "Hledáš název pro zvuk, ne pro část zápisu a ne pro porovnání dvou věcí.",
      "Verš je jeden řádek básně, strofa je skupina takových řádků a přirovnání porovnává dvě věci slovem „jako“. Všechny tři pojmy se týkají něčeho jiného než zvuku, a právě zvuková shoda konců slov je to, na co se ptáme.",
    ],
    e: "Shoda zvuku na konci dvou slov se jmenuje rým. Právě díky němu si při čtení básně konce veršů odpovídají.",
  },
  {
    q: "Jak říkáme spojení, které porovnává dvě věci slovem „jako“?",
    a: "Přirovnání",
    w: [
      ["Verš", "Verš je jeden řádek básně, o porovnávání dvou věcí neříká nic."],
      ["Strofa", "Strofa je skupina řádků v básni, žádné dvě věci neporovnává."],
      ["Rým", "Rým je souznění konců slov, k porovnání dvou věcí neslouží."],
    ],
    h: [
      "Slovo „jako“ v takovém spojení říká, že se jedna věc něčím podobá druhé.",
      "Verš je jeden řádek básně, strofa skupina řádků a rým souznění konců slov — ani jeden z těch pojmů se slovem „jako“ nepracuje. Hledáš název pro spojení, ve kterém se jedna věc porovná s druhou, aby si ji čtenář lépe představil.",
    ],
    e: "Spojení, ve kterém slovo „jako“ porovnává dvě věci, se jmenuje přirovnání. Například „tichý jako myška“ nám pomůže představit si, jak moc je někdo tichý.",
  },
  {
    q: "Ve které větě najdeš přirovnání?",
    a: "Byl silný jako medvěd.",
    w: [
      ["Byl velmi silný.", "Slovo „velmi“ sílu jen zesiluje, ale s ničím ji neporovnává."],
      ["Měl sílu a odvahu.", "Věta jen vyjmenovává dvě vlastnosti, žádné porovnání v ní není."],
      ["Silou nikoho nepřekonal.", "Věta říká, jak dopadlo srovnání s ostatními, ale neporovnává ho s žádnou konkrétní věcí ani bytostí."],
    ],
    h: [
      "Ve všech větách jde o sílu. Hledej tu jedinou, ve které se ta síla k něčemu připodobní.",
      "Projdi věty po řadě a v každé hledej slovo „jako“. Právě ono je značka, že se něčí vlastnost porovnává s jinou věcí nebo bytostí, aby si ji čtenář dokázal lépe představit. Bez tohohle slova jde jen o popis.",
    ],
    e: "Přirovnání poznáme podle slova „jako“, které spojuje vlastnost s něčím známým. Věta o medvědovi nám sílu pomůže představit, ostatní ji jen popisují.",
  },
  {
    q: "Které spojení je přirovnání?",
    a: "Bílý jako sníh",
    w: [
      ["Bílá zima", "Spojení jen popisuje zimu, nic s ničím neporovnává."],
      ["Sněhová vločka", "Spojení pojmenovává jednu věc, žádné porovnání v něm není."],
      ["Bílý sníh", "Spojení jen říká, jakou má sníh barvu, ale nic k němu nepřirovnává."],
    ],
    h: [
      "Všechna spojení mluví o bílé barvě nebo o sněhu. Hledej to jediné, ve kterém se něco s něčím porovná.",
      "Zkus u každého spojení říct, co dělá: popisuje věc, pojmenovává věc, nebo tvrdí, že se jedna věc něčím podobá druhé? Jen ta poslední možnost je přirovnání a poznáš ji podle slova, které obě části spojuje.",
    ],
    e: "Přirovnání potřebuje slovo „jako“, které barvu spojí s něčím, co si každý dokáže představit. Ostatní spojení jsou jen popisy.",
  },
  {
    q: "Doplň přirovnání: „Rychlý jako ___.“",
    a: "blesk",
    w: [
      ["hlemýžď", "Hlemýžď se pohybuje ze všech nejpomaleji, přirovnání by říkalo pravý opak."],
      ["polštář", "Polštář se sám nepohybuje, o rychlosti tedy neřekne nic."],
      ["kámen", "Kámen leží na místě, takže rychlost jím vystihnout nejde."],
    ],
    h: [
      "Hledej věc, která je pověstná svojí rychlostí. Jedna z možností je naopak proslulá pomalostí.",
      "Přirovnání má čtenáři pomoct si vlastnost představit, takže musí sáhnout po něčem, co tu vlastnost má v největší míře. Projdi možnosti a u každé se zeptej, jak rychle se pohybuje: dvě věci se nepohybují vůbec a jedna se sotva plazí.",
    ],
    e: "Přirovnání funguje jen tehdy, když má věc tu vlastnost ve velké míře. Blesk je to nejrychlejší, co děti znají, a proto se do přirovnání o rychlosti hodí.",
  },
  {
    q: "Doplň přirovnání: „Silný jako ___.“",
    a: "lev",
    w: [
      ["myška", "Myška je drobná a slabá, přirovnání by vyznělo přesně naopak."],
      ["pírko", "Pírko je tak lehké, že se používá pro opak síly."],
      ["sklo", "Sklo se snadno rozbije, takže sílu vystihnout nemůže."],
    ],
    h: [
      "Hledej tvora, který je pověstný svou silou. Dvě možnosti jsou naopak proslulé křehkostí.",
      "Nejdřív vyřaď všechno, co se rozbije nebo uletí, protože to o síle nic neřekne. Ze zbytku vyber toho, o kom se odjakživa říká, že je král zvířat — právě proto se v přirovnáních o síle používá nejčastěji.",
    ],
    e: "Do přirovnání se hodí tvor, který danou vlastnost proslule má. Lev je odedávna symbolem síly, proto „silný jako lev“ funguje a s pírkem by to nešlo.",
  },
];

// ── L2 — víceslabičné rýmy a přirovnání podle vlastnosti ────────────────────
const POOL_L2: Uloha[] = [
  {
    q: "Které slovo se rýmuje se slovem „vrána“?",
    a: "brána",
    w: [
      ["pták", "„Pták“ je slovo ze stejného světa zvířat, jeho konec ale zní jinak."],
      ["hnízdo", "„Hnízdo“ k vráně patří, jenže rým se řídí zvukem konce slova."],
      ["vrátka", "„Vrátka“ mají skoro stejný začátek, konec jim ale vychází jinak."],
    ],
    h: [
      "Poslední možnost tě zkusí zmást podobným začátkem. Porovnávej proto poslední dvě slabiky.",
      "U dvouslabičných slov nestačí poslechnout jen poslední hlásku, musíš porovnat celý konec od poslední samohlásky dál. Zkus obě slova vyslovit pomalu a rozdělit si je na slabiky — teprve tak uslyšíš, která dvojice si opravdu odpovídá.",
    ],
    e: "Obě slova končí na -rána, takže si jejich konce přesně odpovídají. Podobný začátek ani společný význam by rým neudělaly.",
  },
  {
    q: "Které slovo se rýmuje se slovem „kočka“?",
    a: "vločka",
    w: [
      ["kotě", "„Kotě“ je kočce nejblíž významem, ale končí docela jinak."],
      ["pes", "„Pes“ ke kočce patří v příslovích, rýmovat se s ní ale nemůže."],
      ["kočár", "„Kočár“ má stejný začátek, konec slova ale zní jinak."],
    ],
    h: [
      "Dvě možnosti patří ke zvířatům, jedna má stejný začátek. Rozhoduj podle posledních dvou slabik.",
      "Zkus si u zadaného slova a u každé možnosti říct nahlas jen druhou polovinu slova, tedy to, co následuje po první slabice. Hledáš možnost, u které se tahle druhá polovina ozve úplně stejně jako u zadaného slova.",
    ],
    e: "Obě slova končí na -očka, a proto se rýmují. Zvíře příbuzné významem ani slovo se stejným začátkem rým netvoří.",
  },
  {
    q: "Které slovo se rýmuje se slovem „myška“?",
    a: "liška",
    w: [
      ["myš", "„Myš“ je jen kratší tvar téhož slova, konec mu proto vychází jinak."],
      ["norka", "„Norka“ souvisí s norou, kde myška bydlí, ale její konec zní jinak."],
      ["mýdlo", "„Mýdlo“ má skoro stejný začátek, končí ale docela jinak."],
    ],
    h: [
      "Nedej se zmást slovem, které vypadá skoro stejně jako zadané. Porovnávej poslední dvě slabiky.",
      "První možnost je zrádná, protože jde skoro o totéž slovo, jen kratší — a právě proto mu chybí celá poslední slabika. Rým potřebuje, aby se shodoval celý konec, ne jen kořen slova nebo jeho začátek.",
    ],
    e: "Obě slova končí na -iška, takže se rýmují. Kratší tvar téhož slova rým netvoří, protože mu shodný konec chybí.",
  },
  {
    q: "Které slovo se rýmuje se slovem „zima“?",
    a: "prima",
    w: [
      ["mráz", "„Mráz“ patří k zimě významem, ale končí docela jinak."],
      ["léto", "„Léto“ je k zimě opakem, a opak rým netvoří."],
      ["zimní", "„Zimní“ je odvozené od zadaného slova, jeho konec ale zní jinak."],
    ],
    h: [
      "Tři možnosti se točí kolem počasí a ročních období. Rozhodni ale podle zvuku, ne podle významu.",
      "Nejzrádnější je tady možnost odvozená od zadaného slova: vypadá skoro stejně, jenže po kořenu následuje jiné zakončení. Poslouchej proto vždycky konec od poslední samohlásky dál, ne začátek slova.",
    ],
    e: "Obě slova končí na -ima, proto se rýmují. Slova ze stejného tématu ani slova odvozená od zadaného rým neudělají.",
  },
  {
    q: "Které slovo se rýmuje se slovem „plamen“?",
    a: "pramen",
    w: [
      ["oheň", "„Oheň“ je plameni blízký významem, ale jeho konec zní jinak."],
      ["plamínek", "„Plamínek“ je zdrobnělina zadaného slova, končí ale jinak."],
      ["plachta", "„Plachta“ má skoro stejný začátek, konec slova jí ale vychází jinak."],
    ],
    h: [
      "Jedna možnost se od zadaného slova odvozuje, jedna má stejný začátek a jedna je mu blízká významem. Rozhoduj podle konce.",
      "Zkus si obě slova rozdělit na slabiky a porovnávej od konce dozadu. Nejdřív poslední slabiku, pak tu předposlední. Právě tahle dvojice slabik musí u rýmu znít stejně, i když se slova na začátku liší.",
    ],
    e: "Obě slova končí na -amen, takže si jejich konce přesně odpovídají. Zdrobnělina ani slovo blízké významem rým netvoří.",
  },
  {
    q: "Které slovo se rýmuje se slovem „růže“?",
    a: "kůže",
    w: [
      ["květina", "„Květina“ je nadřazené slovo k růži, ale končí docela jinak."],
      ["trní", "„Trní“ k růži patří, jenže rým se neřídí tím, co k čemu patří."],
      ["růžová", "„Růžová“ je od zadaného slova odvozená, konec jí ale vychází jinak."],
    ],
    h: [
      "Dvě možnosti patří na zahradu, jedna je odvozená od zadaného slova. Rozhodni podle zvuku konce.",
      "Slovo odvozené od zadaného vypadá na papíře nejpodobněji, jenže rým se neposuzuje očima, ale uchem. Přečti si dvojice nahlas a poslouchej, u které z nich zazní stejná poslední slabika i ta před ní.",
    ],
    e: "Obě slova končí na -ůže, proto se rýmují. Odvozené slovo se stejným kořenem rým netvoří, protože má jiné zakončení.",
  },
  {
    q: "Doplň přirovnání: „Tichý jako ___.“",
    a: "myška",
    w: [
      ["hrom", "Hrom je jeden z nejhlasitějších zvuků, přirovnání by vyznělo naopak."],
      ["zvon", "Zvon je slyšet na míle daleko, takže ticho vystihnout nemůže."],
      ["bubeník", "Bubeník dělá hluk schválně, o tichu tedy neřekne nic."],
    ],
    h: [
      "Hledej tvora, který se pohybuje tak, že ho skoro neslyšíš. Tři možnosti jsou naopak hlučné.",
      "Zkus si u každé možnosti představit, jak je hlasitá. Dvě z nich vydávají zvuk, který je slyšet přes celou vesnici, a jedna hluk dokonce vytváří schválně. Zbude jediná možnost, u které bys musel napnout uši, abys ji vůbec zaslechl.",
    ],
    e: "Přirovnání funguje jen s věcí, která má danou vlastnost v největší míře. Myška se pohybuje skoro neslyšně, a proto se do přirovnání o tichu hodí.",
  },
  {
    q: "Doplň přirovnání: „Studený jako ___.“",
    a: "led",
    w: [
      ["oheň", "Oheň pálí, takže by přirovnání říkalo pravý opak."],
      ["kamna", "Rozpálená kamna hřejí, a chlad tedy vystihnout nemohou."],
      ["peřina", "Peřina hřeje, proto se do přirovnání o chladu nehodí."],
    ],
    h: [
      "Všechny tři chybné odpovědi mají něco společného — hřejí. Najdi tu čtvrtou.",
      "U přirovnání si vždycky ověř, jestli ta věc opravdu má vlastnost, o které mluvíš. Projdi nabídku a u každé věci se zeptej, jestli je na dotek horká, nebo studená. Tři z nich tě zahřejí a jediná zbylá tě naopak zastudí.",
    ],
    e: "Do přirovnání patří věc, která danou vlastnost má v největší míře. Led je tak studený, že ho používáme jako měřítko chladu.",
  },
  {
    q: "Doplň přirovnání: „Tvrdý jako ___.“",
    a: "kámen",
    w: [
      ["peří", "Peří je tak měkké, že se jím vystihuje pravý opak tvrdosti."],
      ["vata", "Vata se dá zmáčknout dvěma prsty, takže tvrdost nevystihne."],
      ["mech", "Mech je v lese měkký jako polštář, do přirovnání o tvrdosti se nehodí."],
    ],
    h: [
      "Tři možnosti se dají snadno zmáčknout. Hledej tu jedinou, která se zmáčknout nedá.",
      "Zkus si v duchu každou možnost stisknout v ruce. U tří z nich povolí hned a poddajně se promáčknou, takže tvrdost vystihnout nemohou. Zbývá věc, která se ani nepohne a o kterou se dá i rozbít koleno.",
    ],
    e: "Přirovnání má vlastnost zesílit, proto se v něm používá věc, která ji má v největší míře. Kámen je běžným měřítkem tvrdosti.",
  },
  {
    q: "Ve větě „Vlasy měla černé jako uhel.“ — co se přirovnává?",
    a: "Barva vlasů",
    w: [
      ["Délka vlasů", "O tom, jak jsou vlasy dlouhé, věta neříká vůbec nic."],
      ["Tvrdost uhlu", "Uhel je ve větě tím, k čemu se přirovnává, jeho tvrdost se nikde neposuzuje."],
      ["Váha vlasů", "Věta se váhou vůbec nezabývá, mluví o tom, jak vlasy vypadají."],
    ],
    h: [
      "Najdi ve větě slovo „jako“ a podívej se, jaké slovo stojí těsně před ním.",
      "Přirovnání má vždycky dvě strany: napravo od slova „jako“ stojí věc, ke které se přirovnává, a nalevo vlastnost, kterou chce věta zesílit. Přečti si tedy, co se o vlasech tvrdí ještě před slovem „jako“ — právě to se porovnává.",
    ],
    e: "Před slovem „jako“ stojí ve větě slovo „černé“, které říká, jakou barvu vlasy mají. Uhel je pak měřítko, se kterým se ta barva porovnává.",
  },
  {
    q: "Ve větě „Petr běhal rychle jako vítr.“ — co se s čím porovnává?",
    a: "Rychlost běhu s větrem",
    w: [
      ["Petrova výška s větrem", "O tom, jak je Petr vysoký, věta neříká nic."],
      ["Vítr s deštěm", "Déšť se ve větě vůbec neobjevuje, není tedy co s čím porovnávat."],
      ["Běh s chůzí", "Chůze ve větě není, porovnává se s něčím docela jiným."],
    ],
    h: [
      "Rozděl si větu u slova „jako“ na dvě části a pojmenuj, co stojí v každé z nich.",
      "Nalevo od slova „jako“ najdeš, co Petr dělá a jak to dělá. Napravo najdeš jedinou věc, se kterou se to srovnává. Přirovnání pak spojuje právě tyhle dvě strany, a nic jiného ve větě porovnávané není.",
    ],
    e: "Věta říká, jak rychle Petr běhal, a tuhle rychlost porovnává s větrem. Slovo „jako“ obě strany přirovnání spojuje.",
  },
  {
    q: "Ve kterém spojení NENÍ přirovnání?",
    a: "Sladký med",
    w: [
      ["Sladký jako med", "Spojení porovnává sladkost s medem, přirovnání v něm tedy je."],
      ["Bílý jako mléko", "Spojení porovnává bílou barvu s mlékem, jde tedy o přirovnání."],
      ["Rychlý jako šíp", "Spojení porovnává rychlost se šípem, i tohle je přirovnání."],
    ],
    h: [
      "Tři spojení mají jedno slovo navíc, které je poznávací značkou přirovnání. Najdi to čtvrté.",
      "Přirovnání se pozná podle slůvka, které spojuje vlastnost s věcí, jež tu vlastnost proslule má. Zakryj si u každého spojení prostřední slovo a podívej se, co zbude — u tří možností zůstane porovnání a u jedné jen prostý popis.",
    ],
    e: "Přirovnání musí obsahovat slovo „jako“, které porovnává dvě věci. Spojení „sladký med“ jen říká, jaký med je, a nic s ničím neporovnává.",
  },
  {
    q: "Které slovo se rýmuje se slovem „květ“?",
    a: "svět",
    w: [
      ["list", "„List“ ke květu patří na rostlině, ale končí docela jinak."],
      ["strom", "„Strom“ souvisí s květem významem, jeho konec ale zní jinak."],
      ["kvítek", "„Kvítek“ je zdrobnělina zadaného slova, končí ale jinak."],
    ],
    h: [
      "Dvě možnosti patří k rostlinám a jedna je zdrobnělinou zadaného slova. Rozhodni podle konce.",
      "Zdrobnělina vypadá nejpodobněji, jenže rým se posuzuje uchem, ne očima — a po kořenu slova jí přibylo zakončení navíc. Poslouchej proto poslední slabiku a hledej možnost, u které zazní stejně jako u zadaného slova.",
    ],
    e: "Obě slova končí na -ět, proto se rýmují. Zdrobnělina ani slovo ze stejného tématu rým netvoří.",
  },
];

// ── L3 — rýmové schéma, vyřazování, rým i smysl zároveň, inverze ────────────
const POOL_L3: Uloha[] = [
  {
    q: "Přečti básničku: „Na dvorku si hraje pes, / za plotem je tichý les. / Vedle roste starý strom, / nad ním duní hlasitý hrom.“ Které verše se spolu rýmují?",
    a: "První s druhým a třetí se čtvrtým",
    w: [
      ["První se třetím a druhý se čtvrtým", "Tahle dvojice by znamenala rým přes jeden řádek, jenže tady se rýmují vždycky dva sousední."],
      ["První se čtvrtým a druhý se třetím", "Tahle možnost by znamenala rým do kříže, což zápis básničky nepotvrzuje."],
      ["Všechny čtyři verše se rýmují navzájem", "Všechny čtyři si neodpovídají — první dva končí jinak než druhé dva."],
    ],
    h: [
      "Vypiš si poslední slovo každého řádku pod sebe a teprve pak hledej, která z nich si odpovídají.",
      "Nejdřív si čtyři koncová slova seřaď pod sebe a očísluj je podle řádků. Potom je porovnávej vždycky po dvou a poslouchej poslední slabiku. Až najdeš obě odpovídající si dvojice, podívej se, jestli jejich čísla sousedí, nebo jsou obden.",
    ],
    e: "Konce řádků tvoří dvě dvojice: „pes – les“ a „strom – hrom“. Obě dvojice jsou ze sousedních řádků, a proto se rýmuje první verš s druhým a třetí se čtvrtým.",
  },
  {
    q: "Přečti básničku: „Na zahradě kvete mák, / vedle něho starý dub. / Nad ním krouží černý pták, / v trávě leží bílý zub.“ Které verše se spolu rýmují?",
    a: "První se třetím a druhý se čtvrtým",
    w: [
      ["První s druhým a třetí se čtvrtým", "Sousední řádky se tady nerýmují — první končí jinak než druhý."],
      ["První se čtvrtým a druhý se třetím", "Tahle možnost by znamenala rým do kříže obráceně, a to zápis básničky nepotvrzuje."],
      ["Žádné dva verše se v básničce nerýmují", "Odpovídající si dvojice v básničce jsou, jen nejsou v sousedních řádcích."],
    ],
    h: [
      "Tady sousední řádky nesedí. Zkus porovnávat konce řádků, které spolu přímo nesousedí.",
      "Vypiš si čtyři koncová slova pod sebe a nejdřív porovnej sousední dvojice. Když ti to nevyjde, zkus přeskakovat vždy o jeden řádek — rým se totiž nemusí ozvat hned, může se ozvat až o řádek dál a proplétat se s druhou dvojicí.",
    ],
    e: "Koncová slova tvoří dvojice „mák – pták“ a „dub – zub“, jenže každá z nich přeskakuje jeden řádek. Proto se rýmuje první verš se třetím a druhý se čtvrtým.",
  },
  {
    q: "Tři z těchto slov se navzájem rýmují, jedno ne. Které do skupiny nepatří?",
    a: "kočka",
    w: [
      ["myška", "„Myška“ končí na -iška stejně jako dvě další slova, takže do skupiny patří."],
      ["liška", "„Liška“ končí na -iška stejně jako dvě další slova, do skupiny tedy patří."],
      ["šiška", "„Šiška“ končí na -iška stejně jako dvě další slova, takže do skupiny patří."],
    ],
    h: [
      "Porovnávej slova mezi sebou navzájem, ne se zadáním. Tři z nich mají stejné zakončení.",
      "Nejdřív najdi zakončení, které se mezi slovy opakuje nejčastěji — to bude ono společné. Pak zkontroluj každé slovo zvlášť, jestli tohle zakončení má. Jedno z nich bude mít poslední slabiku jinou, a právě to do skupiny nepatří.",
    ],
    e: "Tři ze slov končí na -iška, a proto se navzájem rýmují. Čtvrté má jiné zakončení, takže se s nimi nerýmuje, i když jde také o zvíře.",
  },
  {
    q: "Které z těchto slov se s ostatními třemi nerýmuje?",
    a: "mraky",
    w: [
      ["drak", "„Drak“ končí na -ak stejně jako dvě další slova, do skupiny tedy patří."],
      ["mrak", "„Mrak“ končí na -ak stejně jako dvě další slova, takže do skupiny patří."],
      ["vlak", "„Vlak“ končí na -ak stejně jako dvě další slova, takže do skupiny patří."],
    ],
    h: [
      "Jedno ze slov je množné číslo a přibyla mu na konci celá slabika navíc. Zkontroluj poslední slabiky.",
      "Pozor na past: slovo se může psát skoro stejně jako ostatní a přesto se nerýmovat, protože mu na konci přibyla další slabika. Porovnávej proto vždycky celý konec od poslední samohlásky dál a čti nahlas, ne po očku.",
    ],
    e: "Tři slova končí na -ak a rýmují se. Jedno z nich je v množném čísle, takže má na konci slabiku navíc a shodný konec mu chybí.",
  },
  {
    q: "Doplň slovo tak, aby se rýmovalo a zároveň dávalo smysl: „V kuchyni stojí velký stůl, / do polévky nasypu ___.“",
    a: "sůl",
    w: [
      ["úl", "„Úl“ se sice rýmuje, jenže úl je domek pro včely a do polévky ho nikdo nesype."],
      ["pepř", "„Pepř“ by se do polévky hodil, jenže se s prvním veršem nerýmuje."],
      ["písek", "„Písek“ se nerýmuje a do jídla navíc nepatří, takže neplatí ani jedna podmínka."],
    ],
    h: [
      "Musí platit dvě věci najednou: shodný konec s prvním veršem a rozumný smysl věty.",
      "Postupuj ve dvou krocích. Nejdřív vyřaď možnosti, které se s koncem prvního verše nerýmují. Pak si zbylé dosaď do věty a nahlas ji přečti — jedna z nich sice zní správně, ale tvrdí nesmysl, takže obě podmínky splní jenom jediná.",
    ],
    e: "Rým i smysl musí platit zároveň. Doplněné slovo se rýmuje s koncem prvního verše a zároveň dává smysl, protože právě tohle se do polévky opravdu sype.",
  },
  {
    q: "Doplň slovo tak, aby se rýmovalo a zároveň dávalo smysl: „Přes potok vede úzký most, / na návštěvu přišel milý ___.“",
    a: "host",
    w: [
      ["kost", "„Kost“ se sice rýmuje, jenže na návštěvu přijít nemůže — věta by neměla smysl."],
      ["soused", "„Soused“ by na návštěvu přijít mohl, jenže se s prvním veršem nerýmuje."],
      ["strom", "„Strom“ se nerýmuje a na návštěvu nechodí, takže neplatí ani jedna podmínka."],
    ],
    h: [
      "Jedna možnost splní jen rým, jedna jen smysl a jedna ani jedno. Hledej tu, která splní obojí.",
      "Vezmi si nejdřív jen ucho: které možnosti se shodují s koncem prvního verše? Pak si vezmi rozum a zeptej se u nich, jestli ta věc může přijít na návštěvu. Teprve možnost, která obstojí v obou zkouškách, je správná.",
    ],
    e: "Doplněné slovo se rýmuje s koncem prvního verše a zároveň dává větě smysl, protože na návštěvu opravdu chodí lidé. Rým bez smyslu ani smysl bez rýmu nestačí.",
  },
  {
    q: "Doplň slovo tak, aby se rýmovalo a zároveň dávalo smysl: „Na zahradě rozkvetl bílý květ, / je prý nejkrásnější na celý ___.“",
    a: "svět",
    w: [
      ["hřbet", "„Hřbet“ se sice rýmuje, jenže spojení „nejkrásnější na celý hřbet“ nedává smysl."],
      ["sad", "„Sad“ by ke květu patřil, jenže se s prvním veršem nerýmuje."],
      ["list", "„List“ se nerýmuje a do spojení „na celý“ se nehodí, takže neplatí ani jedna podmínka."],
    ],
    h: [
      "Vyzkoušej každou možnost dvakrát: nejdřív uchem na rým a potom rozumem na smysl věty.",
      "Zrádná je tu ta možnost, která zní správně, ale nic neznamená. Proto rým nikdy nestačí sám: až si každou možnost dosadíš do věty a přečteš ji celou nahlas, poznáš, která z nich navíc vytvoří spojení, jaké se opravdu používá.",
    ],
    e: "Doplněné slovo se rýmuje s koncem prvního verše a zároveň vytvoří běžné spojení, kterým se říká, že je něco nejkrásnější ze všeho. Obě podmínky tak platí najednou.",
  },
  {
    q: "Na konci prvního i druhého verše stojí dvakrát stejné slovo „pes“. Je to rým?",
    a: "Ne — opakování téhož slova rým netvoří",
    w: [
      ["Ano — konce znějí naprosto stejně", "Konce sice znějí stejně, jenže jde o totéž slovo, ne o dvě různá."],
      ["Ano — v básni se slova opakovat smějí", "Opakovat se v básni smějí, jenže opakování samo o sobě rým neudělá."],
      ["Ne — rým se pozná na začátku slov", "Rým se pozná na konci slov, ne na jejich začátku."],
    ],
    h: [
      "Rým potřebuje dvě různá slova. Zkontroluj, jestli jsou tady opravdu dvě, nebo jen jedno dvakrát.",
      "Zamysli se nad tím, k čemu je rým v básni dobrý: má spojit dvě různá slova tím, jak podobně znějí. Když se ale stejné slovo jen zopakuje, žádné dvě různé věci se nespojí a čtenáře nic nepřekvapí — je to opakování, ne rým.",
    ],
    e: "Rým spojuje dvě různá slova se shodným koncem. Když se stejné slovo jen zopakuje, nic se nespojuje, takže o rým nejde.",
  },
  {
    q: "Ve které větě slovo „jako“ neporovnává dvě věci, ale říká, čím někdo je?",
    a: "Maminka pracuje jako lékařka.",
    w: [
      ["Maminka je hodná jako sluníčko.", "Tady se maminčina povaha porovnává se sluníčkem, jde tedy o porovnání."],
      ["Vlasy měla dlouhé jako princezna.", "Tady se délka vlasů porovnává s princeznou, jde tedy o porovnání."],
      ["Běhá rychle jako laň.", "Tady se rychlost porovnává s laní, jde tedy o porovnání."],
    ],
    h: [
      "Ve třech větách se něčí vlastnost s něčím srovnává. V jedné se říká, jaké má někdo povolání.",
      "U každé věty se zeptej, co stojí před slovem „jako“. Když je to vlastnost, tedy jaký někdo je, jde o porovnání. Když je to ale sloveso popisující, co někdo dělá nebo čím je, slovo „jako“ neporovnává, ale zařazuje.",
    ],
    e: "Slovo „jako“ nemusí vždycky porovnávat. Ve větě o mamince říká, jaké má povolání, takže se nic s ničím nesrovnává — přirovnání to není.",
  },
  {
    q: "Chceš vystihnout, že se někdo pohybuje opravdu pomalu. Které přirovnání zvolíš?",
    a: "Pomalý jako šnek",
    w: [
      ["Pomalý jako blesk", "Blesk je to nejrychlejší, co znáš, takže by přirovnání říkalo pravý opak."],
      ["Pomalý jako vítr", "Vítr se žene rychle, pomalost jím tedy vystihnout nejde."],
      ["Pomalý jako kámen", "Kámen se nepohybuje vůbec, takže o pomalé chůzi neřekne nic."],
    ],
    h: [
      "Přirovnání musí sáhnout po tvorovi, který se opravdu pohybuje, ale velmi pomalu.",
      "Projdi možnosti a rozděl si je do tří skupin: co se pohybuje rychle, co se nepohybuje vůbec a co se pohybuje pomalu. Rychlé věci by tvrdily opak a nehybné by o rychlosti chůze neřekly nic. Zbude jediná skupina, která sedí.",
    ],
    e: "Přirovnání má vlastnost zesílit, proto musí zvolit tvora, který se opravdu pohybuje, ale co nejpomaleji. Šnek je právě takové měřítko pomalosti.",
  },
  {
    q: "Doplň přirovnání: „Byl hladový jako ___.“",
    a: "vlk",
    w: [
      ["beránek", "Beránek se používá v přirovnáních o mírnosti, ne o hladu."],
      ["ptáček", "Ptáček sezobne jen pár zrníček, velký hlad jím tedy vystihnout nejde."],
      ["kámen", "Kámen vůbec nejí, takže o hladu nemůže říct nic."],
    ],
    h: [
      "Hledej zvíře, o kterém se odedávna říká, že sežere všechno, co najde.",
      "Zkus si u každé možnosti představit, kolik toho sní. Jedna možnost nejí vůbec, jedna sezobne pár zrníček a jedna se používá v úplně jiných přirovnáních. Zbude šelma, která je v příslovích i v pohádkách vždycky nenasytná.",
    ],
    e: "Do přirovnání patří zvíře, které je hladem pověstné. O téhle šelmě se odjakživa říká, že sežere všechno, a proto přirovnání funguje.",
  },
  {
    q: `V básni jsou ${strof(2)} a v každé z nich jsou ${versu(4)}. V každé strofě se rýmuje první verš s druhým a třetí se čtvrtým. Kolik rýmujících se dvojic je v celé básni?`,
    a: dvojic(4),
    w: [
      [dvojic(2), "Dvě dvojice jsou jen v jedné strofě, ale strofy jsou dvě."],
      [dvojic(8), "Osmička je počet všech veršů dohromady, ne počet jejich dvojic."],
      [dvojic(3), "Trojka nevyjde ani v jedné strofě — ze čtyř veršů vzniknou právě dvě dvojice."],
    ],
    h: [
      "Nejdřív spočítej dvojice v jedné strofě, teprve potom vezmi v úvahu, kolik strof báseň má.",
      "Rozděl si úlohu na dva kroky. V prvním se dívej jen na jednu strofu a zjisti, kolik rýmujících se dvojic v ní vzniká. Ve druhém kroku vezmi tenhle výsledek a zopakuj ho tolikrát, kolik má báseň strof — obě strofy jsou totiž postavené stejně.",
    ],
    e: "V jedné strofě vzniknou ze čtyř veršů dvě dvojice. Strofy jsou dvě a obě jsou stavěné stejně, takže dvojic je dohromady 2 × 2, tedy čtyři.",
  },
  {
    q: "Na konci prvního verše stojí slovo „hrom“. Které slovo musí stát na konci druhého verše, aby vznikl rým?",
    a: "strom",
    w: [
      ["blesk", "„Blesk“ k hromu patří v bouřce, jenže rým se neřídí tím, co k čemu patří."],
      ["bouřka", "„Bouřka“ souvisí s hromem významem, ale končí docela jinak."],
      ["hromada", "„Hromada“ má stejný začátek, na konci jí ale přibyly další slabiky."],
    ],
    h: [
      "Dvě možnosti patří k bouřce a jedna má stejný začátek. Rozhoduj podle poslední slabiky.",
      "Nejzrádnější je tu možnost, která se stejně začíná — na papíře vypadá téměř shodně, jenže za společným začátkem má ještě dvě slabiky navíc. Rým přitom potřebuje shodu na konci, takže se na začátek slova vůbec nedívej.",
    ],
    e: "Rým potřebuje shodu na konci slov, tady zakončení -om. Slova spojená s bouřkou ani slovo se stejným začátkem rým netvoří.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).map(task);
}

export const VERSRYMPRIROVNANI: TopicMetadata[] = [
  {
    id: "g3-cjl-vers-rym-prirovnani",
    rvpNodeId: "g3-cjl-literarni-vychova-literarni-druhy-a-zanry-vers-rym-prirovnani",
    title: "Verš, rým, přirovnání",
    studentTitle: "Rým a přirovnání",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární druhy a žánry",
    briefDescription: "Najdeš rýmy v básni a doplníš přirovnání se slovem 'jako'.",
    keywords: ["rým", "verš", "přirovnání", "jako", "báseň", "strofa", "rytmus"],
    goals: ["Rozpoznat rým v básni.", "Najít slovo, které se rýmuje.", "Rozpoznat a doplnit přirovnání."],
    boundaries: ["Základní rýmy a přirovnání pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Rým: poslyš, jak slova znějí — mají stejný konec? Přirovnání: hledej slovo 'jako'.",
      steps: ["Rým: přečti slova nahlas — znějí stejně na konci?", "Přirovnání: spojení s 'jako' (rychlý jako vítr).", "Verš = jeden řádek básně."],
      commonMistake: "Záměna rýmu za opakování: 'pes pes' není rým, 'pes les' je rým.",
      example: "Rým: pes – les, strom – hrom. Přirovnání: Tichý jako myška. Chytrý jako liška.",
    },
  },
];
