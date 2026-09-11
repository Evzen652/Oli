/**
 * Vlastivěda 4. ročník — Práce s mapou: druhy map, měřítko, mapové značky,
 * světové strany.
 *
 * Přepsáno 2026-09-11. Úlohy měly jednu nápovědu, „postup“, který zopakoval
 * odpověď, a žádnou diagnostiku; otázka „Proč mají polárky hvězdáři pro
 * určení severu?“ byla gramaticky rozbitá. Výpočty s měřítkem byly správně
 * a zůstaly, jen s úplnou dokumentací.
 *
 * Gradace:
 *  • L1 — světové strany, kompas, barvy na mapě, druhy map, legenda.
 *  • L2 — co znamená měřítko, vrstevnice, výpočet vzdálenosti v jednom kroku.
 *  • L3 — orientace podle Slunce, srovnání měřítek, strmost svahu z vrstevnic,
 *         výpočet ve dvou krocích.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

const POOL_L1: PracticeTask[] = [
  choice("Jak se jmenují čtyři hlavní světové strany?", "Sever, jih, východ, západ", [
    { value: "Nahoru, dolů, vlevo, vpravo", why: "To jsou směry podle tebe. Světové strany platí pro celou Zemi." },
    { value: "Ráno, poledne, večer, noc", why: "To jsou části dne, ne světové strany." },
    { value: "Jaro, léto, podzim, zima", why: "To jsou roční období." },
  ], {
    hints: ["Na jedné z nich vychází Slunce.", "Na mapě jsou vyznačené písmeny S, J, V a Z. Co ta písmena znamenají?"],
    explanation: "Hlavní světové strany jsou sever, jih, východ a západ. Slunce vychází na východě a zapadá na západě.",
  }),
  choice("Jakým přístrojem určíš světové strany?", "Kompasem", [
    { value: "Teploměrem", why: "Teploměr měří teplotu." },
    { value: "Dalekohledem", why: "Dalekohled přiblíží věci v dálce, světové strany neukáže." },
    { value: "Pravítkem", why: "Pravítkem měříš délku." },
  ], {
    hints: ["Ten přístroj má magnetickou střelku.", "Střelka se vždycky natočí jedním koncem k severu. Jak se tomu přístroji říká?"],
    explanation: "Světové strany určíme kompasem. Jeho magnetická střelka ukazuje k severu a podle ní najdeš i ostatní strany.",
  }),
  choice("Kde bývá na mapě sever?", "Nahoře", [
    { value: "Dole", why: "Dole na mapě bývá jih." },
    { value: "Vlevo", why: "Vlevo na mapě bývá západ." },
    { value: "Vpravo", why: "Vpravo na mapě bývá východ." },
  ], {
    hints: ["Na mapě Česka je Polsko nad námi a Rakousko pod námi.", "Polsko leží na sever od Česka a Rakousko na jih. Na které straně mapy vidíš Polsko, když se na ni díváš?"],
    explanation: "Na mapách bývá sever nahoře, jih dole, východ vpravo a západ vlevo. Když si nevíš rady, podívej se na šipku nebo růžici světových stran.",
  }),
  choice("Jakou barvou se na mapě kreslí řeky, rybníky a moře?", "Modrou", [
    { value: "Zelenou", why: "Zelenou se kreslí lesy nebo nížiny." },
    { value: "Hnědou", why: "Hnědou se kreslí hory a vrstevnice." },
    { value: "Červenou", why: "Červeně se kreslí hlavně silnice." },
  ], {
    hints: ["Jakou barvu má moře na obrázcích?", "Voda se na všech mapách kreslí barvou oblohy a moře. Která to je?"],
    explanation: "Vodní plochy a řeky se na mapách kreslí modře. Díky tomu je na první pohled poznáš.",
  }),
  choice("Jakou barvou se na turistické mapě kreslí lesy?", "Zelenou", [
    { value: "Modrou", why: "Modrou se kreslí voda." },
    { value: "Hnědou", why: "Hnědou se kreslí vrstevnice a hory." },
    { value: "Žlutou", why: "Žlutou se někdy kreslí pole nebo louky, ne lesy." },
  ], {
    hints: ["Jakou barvu mají stromy v létě?", "Lesy na mapě mají stejnou barvu jako listí a jehličí."],
    explanation: "Lesy se na turistických mapách kreslí zeleně, stejnou barvou jako listí. Pole bývají bílá nebo žlutá.",
  }),
  choice("Která mapa ukazuje hory, řeky a nížiny?", "Fyzická mapa", [
    { value: "Politická mapa", why: "Politická mapa ukazuje státy, hranice a města." },
    { value: "Plán města", why: "Plán města ukazuje ulice a budovy." },
    { value: "Mapa metra", why: "Mapa metra ukazuje linky a stanice." },
  ], {
    hints: ["Ta mapa je barevná podle výšky — zelená, žlutá, hnědá.", "Ukazuje přírodu: kde jsou hory, kudy tečou řeky a kde jsou nížiny. Jak se jí říká?"],
    explanation: "Fyzická mapa ukazuje povrch krajiny: hory, nížiny a řeky. Barvy od zelené po hnědou ukazují výšku.",
  }),
  choice("Která mapa ukazuje státy, jejich hranice a hlavní města?", "Politická mapa", [
    { value: "Fyzická mapa", why: "Fyzická mapa ukazuje hory, nížiny a řeky." },
    { value: "Turistická mapa", why: "Turistická mapa ukazuje značené cesty a zajímavosti." },
    { value: "Mapa počasí", why: "Mapa počasí ukazuje teploty a srážky." },
  ], {
    hints: ["Každý stát má na té mapě jinou barvu.", "Na té mapě jsou hranice, města a názvy států, ale ne hory a nížiny."],
    explanation: "Politická mapa ukazuje státy, jejich hranice a hlavní města. Každý stát bývá obarvený jinou barvou.",
  }),
  choice("Která mapa se hodí na pěší výlet?", "Turistická mapa", [
    { value: "Politická mapa", why: "Politická mapa ukazuje jen státy a velká města, cesty v lese na ní nejsou." },
    { value: "Mapa světa", why: "Mapa světa je moc nepodrobná, lesní cestu na ní nenajdeš." },
    { value: "Mapa hvězdné oblohy", why: "Ta ukazuje hvězdy, ne cesty." },
  ], {
    hints: ["Hledej mapu s barevnými značenými cestami.", "Na té mapě jsou turistické značky, lesní cesty, rozhledny a hrady. Komu je určená?"],
    explanation: "Na výlet se hodí turistická mapa. Má podrobné cesty, turistické značky, lesy, vrcholy i zajímavá místa.",
  }),
  choice("Co je legenda mapy?", "Vysvětlivky značek a barev", [
    { value: "Příběh o vzniku mapy", why: "Slovo legenda znamená i pověst, ale na mapě jde o vysvětlivky." },
    { value: "Jméno autora mapy", why: "Jméno autora bývá zvlášť. Legenda vysvětluje značky." },
    { value: "Měřítko mapy", why: "Měřítko ukazuje zmenšení. Legenda vysvětluje značky." },
  ], {
    hints: ["Legenda bývá v rohu mapy v rámečku.", "Když nevíš, co znamená modrý křížek nebo hnědá čára, kam se podíváš?"],
    explanation: "Legenda mapy vysvětluje, co znamenají značky a barvy na mapě — třeba hrad, rozhledna, les nebo silnice.",
  }),
  choice("Jakou barvou se na mapě obvykle kreslí hlavní silnice?", "Červenou", [
    { value: "Modrou", why: "Modrou se kreslí voda." },
    { value: "Zelenou", why: "Zelenou se kreslí lesy." },
    { value: "Hnědou", why: "Hnědou se kreslí hory a vrstevnice." },
  ], {
    hints: ["Hlavní silnice mají být na mapě hodně vidět.", "Důležité silnice a dálnice se kreslí výraznou barvou, jako je barva stopky na křižovatce."],
    explanation: "Hlavní silnice a dálnice se na mapách kreslí červeně nebo oranžově, aby byly dobře vidět.",
  }),
  choice("Co je plán města?", "Podrobná mapa ulic a budov", [
    { value: "Mapa celé Evropy", why: "Mapa Evropy je mnohem méně podrobná." },
    { value: "Seznam obchodů ve městě", why: "Plán města je mapa, ne seznam." },
    { value: "Obrázek jedné budovy", why: "Plán ukazuje celé město, ne jednu budovu." },
  ], {
    hints: ["Plán města se hodí, když hledáš ulici.", "Je to přesný obrázek města shora, na kterém jsou jednotlivé ulice, náměstí a budovy."],
    explanation: "Plán města je podrobná mapa, na které najdeš ulice, náměstí, parky a důležité budovy. Hodí se k hledání adresy.",
  }),
  choice("Čím se na mapě ukazuje, kde je sever?", "Šipkou nebo růžicí světových stran", [
    { value: "Červeným křížkem v rohu", why: "Červený kříž označuje zdravotnické místo, ne sever." },
    { value: "Modrou vlnitou čarou", why: "Modrá vlnovka znázorňuje vodu." },
    { value: "Hnědou čarou kolem kopce", why: "Hnědé čáry jsou vrstevnice." },
  ], {
    hints: ["Hledej značku, na které je písmeno S.", "Ta značka má tvar hvězdy nebo šipky a ukazuje, kde jsou sever, jih, východ a západ."],
    explanation: "Sever se na mapě ukazuje šipkou nebo růžicí světových stran. Většinou míří nahoru.",
  }),
  choice("Jakou barvou se na fyzické mapě kreslí hory?", "Hnědou", [
    { value: "Zelenou", why: "Zeleně se kreslí nížiny." },
    { value: "Modrou", why: "Modře se kreslí voda." },
    { value: "Červenou", why: "Červeně se kreslí silnice." },
  ], {
    hints: ["Čím výš, tím tmavší barva.", "Nížiny jsou zelené, pahorkatiny žluté a nejvyšší místa mají barvu hlíny a skal."],
    explanation: "Na fyzické mapě se nížiny kreslí zeleně, vyšší místa žlutě a hory hnědě. Čím tmavší hnědá, tím vyšší hory.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Co je měřítko mapy?", "Kolikrát je skutečnost na mapě zmenšená", [
    { value: "Velikost papíru s mapou", why: "Velikost papíru s měřítkem nesouvisí." },
    { value: "Počet barev na mapě", why: "Barvy vysvětluje legenda, ne měřítko." },
    { value: "Nadmořská výška", why: "Výšku ukazují barvy a vrstevnice." },
  ], {
    hints: ["Celé Česko se vejde na list papíru. Co se s ním muselo stát?", "Měřítko 1 : 50 000 říká, že jeden centimetr na mapě je ve skutečnosti 50 000 centimetrů. Co tedy měřítko ukazuje?"],
    explanation: "Měřítko ukazuje, kolikrát je skutečnost na mapě zmenšená. Díky němu spočítáš, jak daleko jsou místa ve skutečnosti.",
  }),
  choice("Co znamená měřítko 1 : 50 000?", "1 cm na mapě je 500 m ve skutečnosti", [
    { value: "1 cm na mapě je 50 m ve skutečnosti", why: "50 000 cm je 500 m, ne 50 m. Chybí tu jedna nula." },
    { value: "1 cm na mapě je 5 km ve skutečnosti", why: "5 km je 500 000 cm. To by bylo měřítko 1 : 500 000." },
    { value: "1 cm na mapě je 50 km ve skutečnosti", why: "50 km je mnohem víc. Převeď 50 000 cm na metry." },
  ], {
    hints: ["1 cm na mapě je 50 000 cm ve skutečnosti. Kolik je to metrů?", "100 cm je 1 metr. Kolikrát se 100 vejde do 50 000? Tolik metrů je jeden centimetr na mapě."],
    explanation: "Měřítko 1 : 50 000 znamená, že 1 cm na mapě je 50 000 cm ve skutečnosti. To je 500 m, protože 50 000 : 100 = 500.",
  }),
  choice("Co znamená měřítko 1 : 200 000?", "1 cm na mapě jsou 2 km ve skutečnosti", [
    { value: "1 cm na mapě je 200 m ve skutečnosti", why: "200 000 cm je 2 000 m, ne 200 m." },
    { value: "1 cm na mapě je 20 km ve skutečnosti", why: "20 km je 2 000 000 cm, o nulu víc." },
    { value: "1 cm na mapě je 200 km ve skutečnosti", why: "To je mnohem víc než 200 000 cm." },
  ], {
    hints: ["Převeď 200 000 cm nejdřív na metry.", "200 000 cm je 2 000 m. A kolik kilometrů je 2 000 metrů?"],
    explanation: "Při měřítku 1 : 200 000 je 1 cm na mapě 200 000 cm ve skutečnosti, tedy 2 000 m, a to jsou 2 km.",
  }),
  choice("Co jsou vrstevnice?", "Čáry spojující místa se stejnou výškou", [
    { value: "Čáry hranic krajů", why: "Hranice se kreslí jinak. Vrstevnice ukazují výšku." },
    { value: "Značené turistické cesty", why: "Turistické cesty mají barevné značky, ne vrstevnice." },
    { value: "Čáry, kudy tečou řeky", why: "Řeky se kreslí modře. Vrstevnice jsou hnědé." },
  ], {
    hints: ["Vrstevnice se kreslí hnědě kolem kopců.", "Když půjdeš po jedné vrstevnici, nepůjdeš ani do kopce, ani z kopce. Co mají všechna místa na ní společného?"],
    explanation: "Vrstevnice jsou hnědé čáry, které spojují místa se stejnou nadmořskou výškou. Podle nich poznáš tvar kopce a jeho strmost.",
  }),
  choice("Mapa má měřítko 1 : 50 000. Cesta na mapě měří 4 cm. Jak dlouhá je ve skutečnosti?", "2 km", [
    { value: "200 m", why: "Každý centimetr je 500 m. Čtyři centimetry jsou tedy víc než 200 m." },
    { value: "20 km", why: "4 × 500 m jsou 2 000 m, tedy 2 km, ne 20 km." },
    { value: "4 km", why: "To by platilo, kdyby 1 cm byl 1 km. Tady je 1 cm jen 500 m." },
  ], {
    hints: ["Nejdřív zjisti, kolik je 1 cm při tomto měřítku.", "1 cm je 500 m. Kolik je 4 × 500 m? Výsledek převeď na kilometry."],
    explanation: "Při měřítku 1 : 50 000 je 1 cm 500 m. Čtyři centimetry jsou 4 × 500 m = 2 000 m, tedy 2 km.",
  }),
  choice("Mapa má měřítko 1 : 100 000. Na mapě naměříš 5 cm. Jaká je vzdálenost ve skutečnosti?", "5 km", [
    { value: "500 m", why: "1 cm je 1 km, takže 5 cm je víc než 500 m." },
    { value: "50 km", why: "5 × 1 km je 5 km, ne 50 km." },
    { value: "0,5 km", why: "0,5 km je 500 m. Každý centimetr je ale celý kilometr." },
  ], {
    hints: ["Kolik je 100 000 cm v kilometrech?", "100 000 cm je 1 000 m, tedy 1 km. Takže každý centimetr na mapě je jeden kilometr. Kolik je pět centimetrů?"],
    explanation: "Při měřítku 1 : 100 000 je 1 cm na mapě 1 km ve skutečnosti. Pět centimetrů je tedy 5 km.",
  }),
  choice("Co je tematická mapa?", "Mapa, která ukazuje jedno téma, třeba počasí", [
    { value: "Mapa, na které jsou jen hory", why: "Mapa s horami je fyzická mapa." },
    { value: "Mapa, na které jsou jen státy", why: "Mapa se státy je politická mapa." },
    { value: "Mapa nakreslená v knize pohádek", why: "Tematická mapa ukazuje skutečné téma, třeba rozšíření zvířat." },
  ], {
    hints: ["Jméno té mapy obsahuje slovo „téma“.", "Taková mapa může ukazovat, kde se pěstuje vinná réva, kde žije rys nebo jaké bude počasí."],
    explanation: "Tematická mapa ukazuje jedno téma: třeba rozšíření zvířat, pěstování plodin, počet obyvatel nebo předpověď počasí.",
  }),
  choice("Kterou mapu použiješ, když chceš vědět, kde žije nejvíc lidí?", "Tematickou mapu obyvatel", [
    { value: "Fyzickou mapu", why: "Fyzická mapa ukazuje hory a řeky, ne počet lidí." },
    { value: "Turistickou mapu", why: "Turistická mapa ukazuje cesty, ne počet obyvatel." },
    { value: "Plán města", why: "Plán města ukazuje ulice jednoho města." },
  ], {
    hints: ["Hledáš mapu zaměřenou na jedno téma — lidi.", "Taková mapa obarví kraje podle toho, kolik v nich žije lidí. Jak se mapám na jedno téma říká?"],
    explanation: "Počet obyvatel ukazuje tematická mapa. Místa, kde žije hodně lidí, jsou obarvená tmavěji.",
  }),
  choice("K čemu jsou na turistické mapě barevné čáry značených cest?", "Aby turisté rozlišili trasy", [
    { value: "Aby mapa byla hezčí", why: "Barvy mapu zdobí, ale hlavně rozlišují trasy." },
    { value: "Nařizuje to zákon", why: "Nejde o zákon, ale o orientaci." },
    { value: "Ukazují, kde je voda", why: "Voda se kreslí modře jinak. Barevné čáry jsou značené cesty." },
  ], {
    hints: ["Jaké barvy mají turistické značky na stromech?", "Na stromech jsou značky červené, modré, zelené a žluté a stejné barvy mají cesty na mapě. K čemu to turistovi je?"],
    explanation: "Turistické trasy jsou značené čtyřmi barvami. Na mapě mají stejnou barvu jako značky na stromech, takže turista ví, kterou cestou jde.",
  }),
  choice("Kde najdeš na mapě měřítko?", "Obvykle v rohu nebo u okraje mapy", [
    { value: "Uprostřed hlavního města", why: "Uprostřed mapy jsou místa. Měřítko je v rohu." },
    { value: "Na zadní straně obalu", why: "Někdy tam je, ale na mapě bývá v rohu nebo u okraje." },
    { value: "Mapy měřítko nemají", why: "Každá správná mapa měřítko má." },
  ], {
    hints: ["Hledej malé číslo nebo pruh s dílky, které vypadá jako pravítko.", "Měřítko i legenda bývají na okraji mapy, obvykle dole v rohu, aby nezakrývaly krajinu, kterou mapa ukazuje."],
    explanation: "Měřítko bývá v rohu nebo u okraje mapy, často jako číslo (1 : 50 000) a pruh s dílky jako pravítko.",
  }),
  choice("Kolik metrů je 1 kilometr?", "1 000 metrů", [
    { value: "100 metrů", why: "100 metrů je desetina kilometru." },
    { value: "10 000 metrů", why: "10 000 metrů je 10 kilometrů." },
    { value: "10 metrů", why: "10 metrů je velmi krátká vzdálenost." },
  ], {
    hints: ["„Kilo“ znamená tisíc.", "Kilogram je tisíc gramů. Kolik metrů je tedy kilometr?"],
    explanation: "Jeden kilometr je 1 000 metrů. Předpona kilo znamená tisíc, stejně jako u kilogramu.",
  }),
  choice("Kolik centimetrů je 1 metr?", "100 centimetrů", [
    { value: "10 centimetrů", why: "10 cm je jen desetina metru." },
    { value: "1 000 centimetrů", why: "1 000 cm je 10 metrů." },
    { value: "50 centimetrů", why: "50 cm je půl metru." },
  ], {
    hints: ["„Centi“ znamená setina.", "Na metrovém pravítku je sto malých dílků po centimetru."],
    explanation: "Jeden metr má 100 centimetrů. Tenhle převod potřebuješ, když z měřítka mapy počítáš vzdálenost.",
  }),
  choice("Proč existuje víc druhů map, a ne jedna pro všechno?", "Každý potřebuje z mapy vědět něco jiného", [
    { value: "Aby se mapy lépe prodávaly", why: "Nejde o prodej. Každá mapa slouží jinému účelu." },
    { value: "Jedna mapa by byla moc lehká", why: "Váha nerozhoduje. Na jednu mapu by se nevešlo všechno." },
    { value: "Každý stát smí mít jen jednu mapu", why: "Takové pravidlo neexistuje." },
  ], {
    hints: ["Co potřebuje vědět turista a co řidič?", "Turista chce cesty lesem, řidič dálnice a meteorolog počasí. Vešlo by se to všechno čitelně na jednu mapu?"],
    explanation: "Turista potřebuje cesty v lese, řidič silnice a meteorolog počasí. Na jednu mapu by se všechno čitelně nevešlo, proto jsou různé druhy map.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Ráno stojíš a slunce vychází po tvé pravé ruce. Kterým směrem se díváš?", "Na sever", [
    { value: "Na jih", why: "Při pohledu na jih by slunce vycházelo po levé ruce." },
    { value: "Na východ", why: "Na východě slunce vychází. Pohled by mířil přímo do něj." },
    { value: "Na západ", why: "Při pohledu na západ je vycházející slunce za zády." },
  ], {
    hints: ["Na které světové straně slunce vychází?", "Slunce vychází na východě. Když je východ po pravé ruce, kam míří tvůj pohled?"],
    explanation: "Slunce vychází na východě. Když je východ vpravo, díváš se na sever — jih máš za zády a západ vlevo.",
  }),
  choice("Jak ti v noci pomůže hvězda Polárka?", "Svítí téměř přesně nad severem", [
    { value: "Je nejjasnější hvězdou na obloze", why: "Polárka není nejjasnější. Je důležitá, protože ukazuje sever." },
    { value: "Je Zemi nejblíž ze všech hvězd", why: "Nejbližší hvězdou je Slunce." },
    { value: "Ukazuje, kolik je hodin", why: "Polárka čas neukazuje. Ukazuje směr." },
  ], {
    hints: ["Jméno Polárky napovídá, nad kterým pólem svítí.", "Zatímco ostatní hvězdy během noci putují po obloze, tahle zůstává skoro na místě nad severním obzorem. K čemu je tedy dobrá?"],
    explanation: "Polárka svítí téměř přesně nad severním pólem, a proto u nás ukazuje sever. Najdeš ji podle souhvězdí Velkého vozu.",
  }),
  choice("Která mapa ukazuje větší území na stejně velkém papíře: 1 : 50 000, nebo 1 : 200 000?", "Mapa 1 : 200 000", [
    { value: "Mapa 1 : 50 000", why: "Na mapě 1 : 50 000 je 1 cm jen 500 m. Ukazuje menší území podrobněji." },
    { value: "Obě stejně velké území", why: "Liší se: na jedné je 1 cm 500 m, na druhé 2 km." },
    { value: "Nedá se to poznat", why: "Dá — podle toho, kolik skutečnosti je v jednom centimetru." },
  ], {
    hints: ["Kolik skutečnosti se vejde do 1 cm u každé mapy?", "U 1 : 50 000 je 1 cm 500 m, u 1 : 200 000 jsou to 2 km. Na které mapě se na stejný list vejde víc krajiny?"],
    explanation: "Na mapě 1 : 200 000 je 1 cm 2 km, na mapě 1 : 50 000 jen 500 m. Mapa 1 : 200 000 tedy ukáže větší území, ale méně podrobně.",
  }),
  choice("Co znamená, že mapa má větší měřítko?", "Ukazuje menší území, ale podrobněji", [
    { value: "Ukazuje větší území", why: "Je to naopak — větší měřítko znamená menší zmenšení a menší území." },
    { value: "Je vytištěná na větším papíře", why: "Velikost papíru s měřítkem nesouvisí." },
    { value: "Má víc barev", why: "Barvy s měřítkem nesouvisejí." },
  ], {
    hints: ["Srovnej plán města a mapu Evropy.", "Plán města má velké měřítko — vidíš na něm každou ulici, ale jen jedno město. Co tedy velké měřítko znamená?"],
    explanation: "Větší měřítko (třeba 1 : 10 000) znamená, že je skutečnost zmenšená méně. Mapa ukáže menší území, ale velmi podrobně, jako plán města.",
  }),
  choice("Na západní straně kopce jsou vrstevnice husté, na východní řídké. Co to znamená?", "Západní strana je strmá, východní mírná", [
    { value: "Východní strana je strmá, západní mírná", why: "Je to naopak — husté vrstevnice znamenají strmý svah." },
    { value: "Kopec je ze všech stran stejný", why: "Kdyby byl stejný, byly by vrstevnice všude stejně daleko." },
    { value: "Hustota vrstevnic nic neznamená", why: "Hustota vrstevnic ukazuje strmost svahu." },
  ], {
    hints: ["Každá vrstevnice znamená o kus vyšší místo.", "Když jsou vrstevnice blízko u sebe, vystoupáš na krátké vzdálenosti hodně vysoko. Jaký je takový svah?"],
    explanation: "Husté vrstevnice znamenají, že výška se rychle mění — svah je strmý. Řídké vrstevnice znamenají mírný svah. Proto je západní strana strmá.",
  }),
  choice("Mapa má měřítko 1 : 200 000. Dvě města jsou na mapě 6 cm od sebe. Jak daleko jsou ve skutečnosti?", "12 km", [
    { value: "1,2 km", why: "1 cm jsou 2 km, takže 6 cm je mnohem víc než 1,2 km." },
    { value: "120 km", why: "6 × 2 km je 12 km, ne 120 km." },
    { value: "6 km", why: "To by platilo, kdyby 1 cm byl 1 km. Tady jsou to 2 km." },
  ], {
    hints: ["Nejdřív zjisti, kolik kilometrů je 1 cm při tomto měřítku.", "Při 1 : 200 000 jsou v jednom centimetru na mapě celé 2 km ve skutečnosti. Kolik je šestkrát 2 km?"],
    explanation: "Při měřítku 1 : 200 000 je 1 cm na mapě 2 km. Šest centimetrů je 6 × 2 km = 12 km.",
  }),
  choice("Mapa má měřítko 1 : 50 000. Chceš jít 3 km. Kolik centimetrů to je na mapě?", "6 cm", [
    { value: "3 cm", why: "To by platilo, kdyby 1 cm byl 1 km. Tady je 1 cm jen 500 m." },
    { value: "1,5 cm", why: "1,5 cm je jen 750 m. Na 3 km je potřeba víc." },
    { value: "30 cm", why: "30 cm by bylo 15 km." },
  ], {
    hints: ["Kolik metrů je 1 cm na této mapě?", "1 cm je 500 m, takže 2 cm je 1 km. Kolik centimetrů jsou 3 km?"],
    explanation: "Při měřítku 1 : 50 000 je 1 cm 500 m, takže 1 km jsou 2 cm. Tři kilometry jsou 3 × 2 cm = 6 cm.",
  }),
  choice("Na mapě je potok a vrstevnice kolem něj. Kterým směrem teče voda?", "Z vyšších míst do nižších", [
    { value: "Z nižších míst do vyšších", why: "Voda do kopce neteče." },
    { value: "Vždycky na sever", why: "Voda neteče podle světových stran, ale z kopce dolů." },
    { value: "Vždycky ke kraji mapy", why: "Kraj mapy se směrem toku nesouvisí." },
  ], {
    hints: ["Kam teče voda, když ji vyliješ na kopci?", "Vrstevnice ti řeknou, kde je výš a kde níž. Kudy tedy potok poteče?"],
    explanation: "Voda teče vždy z vyšších míst do nižších. Podle vrstevnic poznáš, kde je výš, a tedy i kterým směrem potok teče.",
  }),
  choice("Jsi v lese bez kompasu. Kde je poledne a vidíš slunce. Kterým směrem je jih?", "Směrem ke slunci", [
    { value: "Opačně než slunce", why: "Opačně než polední slunce je sever." },
    { value: "Po levé ruce od slunce", why: "V poledne je slunce přímo na jihu, ne vlevo od něj." },
    { value: "Nedá se to určit", why: "V poledne se to určit dá — slunce je na jihu." },
  ], {
    hints: ["Kde je u nás slunce v poledne?", "Ráno je slunce na východě, večer na západě a v poledne na straně, kam ukazuje polední stín opačně."],
    explanation: "U nás je slunce v poledne na jihu. Když se k němu otočíš, díváš se na jih, za zády máš sever.",
  }),
  choice("Na mapě je hrad 2 cm od nádraží. Mapa má měřítko 1 : 25 000. Jak daleko je hrad?", "500 m", [
    { value: "250 m", why: "250 m je jen jeden centimetr. Tady jsou dva." },
    { value: "5 km", why: "5 km by bylo 20 cm." },
    { value: "50 m", why: "50 m je mnohem méně, převeď 25 000 cm na metry." },
  ], {
    hints: ["Kolik metrů je 25 000 cm?", "25 000 cm je 250 m. Hrad je 2 cm od nádraží, tedy dvakrát tolik."],
    explanation: "Při měřítku 1 : 25 000 je 1 cm 25 000 cm, tedy 250 m. Dva centimetry jsou 2 × 250 m = 500 m.",
  }),
  choice("Proč je na mapě měřítko 1 : 10 000 vidět každá ulice, a na 1 : 1 000 000 ne?", "Mapa 1 : 10 000 je zmenšená mnohem méně", [
    { value: "Mapa 1 : 1 000 000 je starší", why: "Stáří mapy s tím nesouvisí. Rozhoduje zmenšení." },
    { value: "Ulice se kreslí jen na malé mapy", why: "Ulice se kreslí tam, kde se vejdou — na málo zmenšené mapy." },
    { value: "Mapa 1 : 1 000 000 nemá legendu", why: "Legendu mají obě. Rozdíl je ve zmenšení." },
  ], {
    hints: ["Kolik skutečnosti je v 1 cm u každé z těch map?", "U 1 : 10 000 je 1 cm 100 m, u 1 : 1 000 000 celých 10 km. Vešla by se do jednoho centimetru, kde je 10 km, jednotlivá ulice?"],
    explanation: "Na mapě 1 : 10 000 je 1 cm jen 100 m, takže se vejde každá ulice. Na 1 : 1 000 000 je 1 cm 10 km, a tak se ulice nevejdou — ukáže se jen velká města.",
  }),
  choice("Díváš se na jih. Kde máš západ?", "Po pravé ruce", [
    { value: "Po levé ruce", why: "Po levé ruce máš při pohledu na jih východ." },
    { value: "Před sebou", why: "Před sebou máš jih." },
    { value: "Za zády", why: "Za zády máš sever." },
  ], {
    hints: ["Když se díváš na sever, západ je vlevo. Co se stane, když se otočíš?", "Otoč se na jih: sever je za zády. Západ, který byl vlevo, se teď přesunul na druhou stranu."],
    explanation: "Když se díváš na jih, máš za zády sever, po levé ruce východ a po pravé ruce západ.",
  }),
  choice("Proč se na turistické mapě kreslí i vrstevnice?", "Turista pozná, kde bude stoupat", [
    { value: "Aby byla mapa barevnější", why: "Nejde o barvy. Vrstevnice ukazují, kde je kopec." },
    { value: "Vrstevnice ukazují cesty", why: "Cesty se kreslí jinak. Vrstevnice ukazují výšku." },
    { value: "Ukazují, kde je voda", why: "Voda je modrá. Vrstevnice ukazují výšku a strmost." },
  ], {
    hints: ["Co tě na výletě unaví víc — rovina, nebo prudký kopec?", "Z vrstevnic poznáš, jestli trasa vede do kopce a jak prudce. K čemu je to turistovi při plánování?"],
    explanation: "Vrstevnice ukazují, kde je kopec a jak je strmý. Turista si podle nich naplánuje trasu a pozná, kde bude stoupat.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const DRUHYMAPMERITKOMAPOVEZNACKYSVETOVESTRANY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-prace-s-mapou-druhy-map-meritko-mapove-znacky-svetove-strany",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-prace-s-mapou-druhy-map-meritko-mapove-znacky-svetove-strany",
    title: "Práce s mapou - druhy map, měřítko, mapové značky, světové strany",
    studentTitle: "Práce s mapou",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Naučíš se číst mapu, určit světové strany a spočítat vzdálenost podle měřítka.",
    keywords: ["mapa", "měřítko", "legenda", "vrstevnice", "kompas", "světové strany", "turistická mapa"],
    goals: [
      "Určit světové strany kompasem i podle Slunce",
      "Rozlišit druhy map a jejich účel",
      "Číst mapové značky, barvy a vrstevnice",
      "Spočítat skutečnou vzdálenost podle měřítka",
    ],
    boundaries: ["Zeměpisné souřadnice a kartografická zobrazení patří na 2. stupeň"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "mixed",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Sever bývá nahoře, legenda vysvětluje značky a měřítko říká, kolikrát je mapa zmenšená.",
      steps: [
        "Světové strany: sever, jih, východ, západ. Slunce vychází na východě.",
        "Barvy: voda modrá, lesy zelené, hory hnědé, silnice červené.",
        "Měřítko 1 : 50 000 znamená 1 cm = 500 m.",
        "Husté vrstevnice znamenají strmý svah.",
      ],
      commonMistake: "Při převodu měřítka se často ztratí nula: 50 000 cm je 500 m, ne 50 m.",
      example: "Mapa 1 : 100 000: 5 cm na mapě je 5 km ve skutečnosti.",
    },
  },
];
