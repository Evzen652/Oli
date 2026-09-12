import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolovaná definice jednoho pojmu na otázku
//   L2 = aplikace:   konkrétní scénář → který pojem/krok se uplatňuje
//   L3 = transfer:   hraniční rozlišení (konflikt vs násilí), pořadí kroků,
//                    kombinace dvou principů, tolerance vs respekt
// Každá úloha: dvě vlastní nápovědy, zpětná vazba u každé chybné možnosti
// a vysvětlení PROČ (CONTENT_AUTHORING §0).
// ─────────────────────────────────────────────────────────

type Chyba = [string, string];

function t(
  question: string,
  correct: string,
  chyby: [Chyba, Chyba, Chyba],
  h0: string,
  h1: string,
  explanation: string,
): PracticeTask {
  const d = chyby.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  return choice(question, correct, d, { hints: [h0, h1], explanation });
}

const POOL_L1: PracticeTask[] = [
  t(
    "Co znamená slovo empatie?",
    "Vcítit se do pocitů druhého člověka",
    [
      ["Být nejlepší ve třídě", "Být nejlepší je o výkonu, ne o tom, jak rozumíš druhým lidem."],
      ["Dělat si, co chci", "Dělat si, co chci, je pravý opak — vůbec se tím nezabývám tím, co prožívá někdo jiný."],
      ["Mluvit hodně hlasitě", "Hlasitost o pocitech nic neříká. Empatie je tichá schopnost, ne způsob mluvy."],
    ],
    "Slovo empatie má základ ve slově „cítit“.",
    "Představ si kamaráda, který sedí smutně stranou. Když se snažíš pochopit, co se v něm právě odehrává, používáš přesně tuhle schopnost. Které možnosti mluví o pocitech?",
    "Empatie znamená umět se vcítit do toho, jak se druhý člověk cítí — zkusit pochopit jeho radost, smutek nebo strach. Proto je to základ dobrého přátelství.",
  ),
  t(
    "Co znamená respektovat druhého člověka?",
    "Brát ohled na jeho pocity a názory",
    [
      ["Vždy s ním souhlasit", "Souhlas není nutný — můžeš mít úplně jiný názor a přesto se k druhému chovat slušně."],
      ["Ignorovat, co říká", "Ignorování je opak: kdo druhého přehlíží, o jeho názor se vůbec nezajímá."],
      ["Dělat vše, co si přeje", "To by byla poslušnost, ne úcta. Nikdo nemusí plnit každé přání, aby se choval slušně."],
    ],
    "Respektovat neznamená souhlasit ani poslouchat.",
    "Zkus si to na sporu o film: nesouhlasíš, ale neposmíváš se a necháš druhého domluvit. Vyřaď možnosti, které z tebe dělají buď poslušného, nebo lhostejného.",
    "Respekt znamená, že bereme v úvahu pocity, názory a potřeby druhého. Nemusíme s nimi souhlasit, ale nezlehčujeme je a neubližujeme.",
  ),
  t(
    "Co je kompromis?",
    "Řešení, kdy každý trochu ustoupí, aby se dohodli",
    [
      ["Jeden vyhraje a druhý prohraje", "To je výhra jedné strany, ne dohoda. Při dohodě neodchází nikdo jako poražený."],
      ["Hádka, která neskončí", "Nekonečná hádka je pravý opak — nic nevyřeší a nikdo neustoupí."],
      ["Přijmout rozhodnutí dospělého", "Tady rozhoduje někdo třetí. Při dohodě se na řešení podílejí obě strany sporu."],
    ],
    "Klíčové je, kolik stran musí slevit ze svého přání.",
    "Jeden chce fotbal, druhý basketbal a nakonec hrají půl hodiny obojí. Nikdo nedostal všechno a nikdo neodešel s prázdnou. Která možnost tenhle výsledek popisuje?",
    "Kompromis je způsob řešení sporu, kdy obě strany trochu ustoupí od svého požadavku a najdou společné řešení. Právě proto z něj nikdo neodchází jako poražený.",
  ),
  t(
    "Co je spolupráce?",
    "Společná práce na jednom cíli",
    [
      ["Dělat vše sám bez pomoci", "To je práce o samotě. Tady jde naopak o to, že se lidé spojí."],
      ["Závodit, kdo bude rychlejší", "V závodě jde každý sám za sebe proti ostatním, ne s nimi za stejným výsledkem."],
      ["Ignorovat spolužáky", "Kdo ostatní přehlíží, nemůže s nimi nic tvořit. Tady je potřeba pravý opak."],
    ],
    "Rozlož si to slovo na dvě části: spolu + práce.",
    "Vzpomeň si na skupinovou práci, kde jeden lepil, druhý stříhal a třetí psal — a hotový výrobek byl jeden. Hledej možnost, kde lidé míří ke stejnému výsledku, ne proti sobě.",
    "Spolupráce znamená, že lidé pracují společně na dosažení jednoho cíle. Každý přispěje svou silou nebo dovedností, a proto je výsledek lepší, než kdyby vše dělal jeden sám.",
  ),
  t(
    "Co znamená tolerance?",
    "Přijímat a respektovat odlišnosti druhých",
    [
      ["Smát se lidem, kteří jsou jiní", "Posměch je pravý opak — ten odlišnost nepřijímá, ale trestá."],
      ["Kamarádit se jen s těmi, kdo jsou jako já", "Tím se odlišnosti vyhýbáš. Zvládnout je znamená přijmout i toho, kdo je jiný."],
      ["Nikomu nic neříkat", "Mlčení je lhostejnost. Přijetí druhého je aktivní postoj, ne mlčení."],
    ],
    "Lidé se liší vzhledem, zvyky i zálibami.",
    "Ve třídě jsou děti s jinými koníčky, jiným jídlem i jiným přízvukem. Hledej možnost, která tenhle rozdíl bere jako běžnou věc, a ne jako důvod k posměchu nebo k vyhýbání.",
    "Tolerance znamená, že přijímáme to, že jsou lidé různí — mají jiné záliby, jiný původ nebo jiné názory. Díky ní je třída místem, kde se všichni cítí bezpečně.",
  ),
  t(
    "Co je konflikt?",
    "Neshoda mezi lidmi, kterou lze vyřešit dohodou",
    [
      ["Vždy velká rvačka", "Rvačka je až ubližování. Neshoda se přitom často vyřeší úplně v klidu."],
      ["Kamarádství, které trvá navždy", "Kamarádství je vztah, ne spor. Tady jde o situaci, kdy se lidé neshodnou."],
      ["Soutěž o nejlepší výsledek", "V soutěži platí pravidla a nikdo se nehádá. Tady jde o rozdílné názory."],
    ],
    "Neshoda v názoru ještě neznamená, že si někdo ublížil.",
    "Dva spolužáci chtějí každý jinou hru — nikdo nikoho neuhodil, jen se neshodli. Hledej možnost, která připouští klidné vyřešení, ne nutně rvačku.",
    "Konflikt je neshoda nebo spor mezi lidmi, například různý názor na to, co dělat. Na rozdíl od násilí ho lze vyřešit klidnou dohodou, aniž by někomu ublížil.",
  ),
  t(
    "Co je násilí?",
    "Záměrné ubližování slovem nebo fyzicky",
    [
      ["Hádka, která skončí dohodou", "Hádka s dohodou nikomu neublížila — je to vyřešená neshoda."],
      ["Rozdílné názory na jednu věc", "Rozdílný názor sám o sobě nikoho nezraní. Chybí tu úmysl ublížit."],
      ["Soutěž o nejlepší výsledek", "Soutěž má pravidla a nikdo v ní nechce druhému uškodit."],
    ],
    "Rozhoduje úmysl: chce ten člověk druhému ublížit?",
    "Porovnej dvě situace: mluvit o problému, nebo někoho uhodit či urazit. Jen jedna z nich má za cíl způsobit bolest. Které možnosti ten úmysl obsahují?",
    "Násilí je záměrné ubližování druhému člověku — fyzicky (bití) nebo slovně (urážky, vyhrůžky). Na rozdíl od konfliktu ho nelze jen tak vyřešit dohodou, protože už někomu ublížilo.",
  ),
  t(
    "Co znamená naslouchat druhému člověku?",
    "Pozorně poslouchat, co říká, a snažit se mu porozumět",
    [
      ["Čekat, až budu moct mluvit já", "Kdo jen čeká na svou řadu, obsah cizí věty většinou vůbec nezachytí."],
      ["Dělat u toho jinou činnost", "Při jiné činnosti se nedá soustředit — část sdělení ti nutně unikne."],
      ["Poslouchat jen polovinu věty", "Půlka věty může význam úplně otočit. Porozumět jde až celé myšlence."],
    ],
    "Slyšet zvuk a porozumět obsahu není totéž.",
    "Představ si, že ti kamarád vysvětluje, proč je naštvaný. Aby to mělo smysl, musíš ho nechat domluvit a přemýšlet o tom, co říká. Které možnosti tomu brání?",
    "Naslouchat znamená opravdu se soustředit na to, co druhý říká, a snažit se pochopit jeho pohled. Proto je to základ dobré komunikace i řešení sporů.",
  ),
  t(
    "Co znamená věrnost v kamarádství?",
    "Být kamarádovi oporou i v těžkých chvílích",
    [
      ["Kamarádit se jen, když se mi to hodí", "To je kamarádství z výhody — jakmile přijdou potíže, takový kamarád zmizí."],
      ["Přidat se vždy k většině proti kamarádovi", "Přidat se proti kamarádovi je zrada, ne opora."],
      ["Mluvit o kamarádovi za jeho zády", "Pomlouvání kamarádství rozbíjí. Opora vypadá úplně jinak."],
    ],
    "Pozná se to hlavně tehdy, když se kamarádovi nedaří.",
    "Kamarád propadl, rozbil si nohu nebo se s ním ostatní přestali bavit. Zůstaneš u něj, nebo odejdeš? Hledej možnost, která vydrží i nepříjemnou dobu.",
    "Věrnost znamená, že jsme kamarádovi oporou i tehdy, když se mu nedaří nebo je v nesnázích — a ne jen tehdy, když je vše v pořádku.",
  ),
  t(
    "Co znamená být upřímný ke kamarádovi?",
    "Říkat mu pravdu, i když je nepříjemná",
    [
      ["Říkat mu jen to, co chce slyšet", "Příjemná slova nejsou vždy pravdivá. Kamarád se pak nic užitečného nedozví."],
      ["Lhát, aby se necítil špatně", "I lež z dobrého úmyslu je lež — a jednou se na ni přijde."],
      ["Nic mu neříkat a mlčet", "Mlčení není pravda ani lež, ale kamarádovi tím nijak nepomůžeš."],
    ],
    "Pravda někdy nepotěší, a přesto zůstává pravdou.",
    "Kamarád má ve slohu chybu, kterou nevidí. Můžeš mlčet, chválit ho, nebo mu to říct. Jen jedna možnost mu opravdu pomůže — poznáš ji podle toho, že nelže.",
    "Upřímnost znamená říkat kamarádovi pravdu, i když se mu nemusí líbit. Kamarádství založené na lžích totiž dlouho nevydrží.",
  ),
  t(
    "K čemu slouží pravidla třídy?",
    "Pomáhají, aby se všichni cítili bezpečně a mohli se učit",
    [
      ["Jsou tu jen na obtěžování žáků", "Pravidla nejsou trest. Bez nich by ve třídě vládl zmatek."],
      ["Platí jen pro některé žáky", "Pravidlo, které platí jen pro někoho, je nespravedlivé a nefunguje."],
      ["Slouží k trestání za každou maličkost", "Smyslem není trestat, ale předem si ujasnit, jak se k sobě budeme chovat."],
    ],
    "Zamysli se, komu pravidla třídy prospívají.",
    "Představ si hodinu, kde všichni mluví najednou a nikdo nikoho neposlouchá. Co by taková třída potřebovala a k čemu by jí to bylo? Vyřaď možnosti, které mluví jen o trestání.",
    "Pravidla třídy vytvářejí prostředí, kde se každý může učit a vyjádřit svůj názor, aniž by se bál. Platí pro všechny stejně, a proto je také tvoříme společně.",
  ),
  t(
    "Co znamená pomoci kamarádovi v nesnázích?",
    "Podpořit ho a udělat něco, co mu situaci ulehčí",
    [
      ["Počkat, až problém vyřeší sám", "Čekání není pomoc — kamarád zůstane v potížích úplně stejně."],
      ["Smát se mu, že to nezvládá", "Posměch situaci ještě zhorší a kamaráda odradí od toho, aby se svěřil."],
      ["Říct mu, ať se s tím nikomu nesvěřuje", "Mlčení kamaráda izoluje. U vážných potíží je dospělý naopak potřeba."],
    ],
    "Rozdíl je mezi přihlížením a skutečným činem.",
    "Kamarád nestíhá uklidit třídu a bude mít problém. Můžeš to sledovat, nebo vzít hadr. Hledej možnost, kde se něco konkrétního opravdu stane.",
    "Pomoci kamarádovi znamená všimnout si, že něco potřebuje, a aktivně mu nabídnout podporu — třeba radu, spolupráci nebo vyslechnutí. Samo přihlížení mu nic neusnadní.",
  ),
  t(
    "Co je dohoda při řešení sporu?",
    "Řešení, se kterým souhlasí obě strany",
    [
      ["Rozhodnutí, které vyhovuje jen jedné straně", "Když je spokojený jen jeden, druhý se bude cítit přehlížený a spor se vrátí."],
      ["Rozkaz silnějšího, kterému druhý musí ustoupit", "Prosazení silnějšího není domluva — slabší nedostal na výběr."],
      ["Konec kamarádství kvůli sporu", "Rozchod spor neřeší, jen ho uzavře tím nejhorším způsobem."],
    ],
    "Rozhoduje, kolik lidí je s výsledkem spokojených.",
    "Spor se považuje za vyřešený teprve tehdy, když se k němu nikdo nevrací naštvaný. Kolik stran s tím tedy musí souhlasit? Vyřaď možnosti, kde jeden druhého přetlačí.",
    "Dohoda je výsledek, se kterým souhlasí obě strany sporu. Nemusí být pro každého úplně ideální, ale obě strany ji přijímají jako spravedlivou — proto spor skutečně končí.",
  ),
];

const POOL_L2: PracticeTask[] = [
  t(
    "Jana a Tomáš se hádají o to, jakou hru hrát. Nakonec se domluví, že hodinu hrají Janinu hru a hodinu Tomášovu. Jak se tomuto řešení říká?",
    "Kompromis",
    [
      ["Násilí", "Nikdo nikomu neublížil — Jana ani Tomáš nebyli k ničemu donuceni."],
      ["Ignorování problému", "Problém neignorovali, naopak ho spolu vyřešili."],
      ["Trest", "Trest se uděluje za provinění. Tady šlo o dohodu dvou dětí."],
    ],
    "Všimni si, že Jana i Tomáš museli ze svého přání trochu slevit.",
    "Ani jeden nehraje celou dobu to své, ale ani jeden nepřišel zkrátka. Jak se jmenuje řešení, ve kterém ustoupí obě strany a obě jsou spokojené?",
    "Když každý trochu ustoupí a najdou řešení, které vyhovuje oběma, jde o kompromis. Jana a Tomáš spor o hru vyřešili právě takhle — střídáním.",
  ),
  t(
    "Petr a Lukáš se pohádali a oba na sebe křičí. Co by měli udělat jako úplně první krok?",
    "Uklidnit se",
    [
      ["Křičet ještě hlasitěji", "Hlasitější křik vztek jen přiživí a k domluvě je ještě dál."],
      ["Okamžitě si přestat navždy povídat", "Konec kamarádství je příliš unáhlený a spor to nevyřeší."],
      ["Zavolat si na pomoc další spolužáky do hádky", "Víc rozzlobených lidí znamená větší hádku, ne řešení."],
    ],
    "Ve vzteku se dvěma křičícím lidem nepodaří nic domluvit.",
    "Než se dá o problému rozumně mluvit, musí vztek nejdřív opadnout. Hledej krok, po kterém budou Petr i Lukáš schopní vůbec poslouchat, co ten druhý říká.",
    "Než se dá spor řešit, je třeba nejprve zklidnit emoce. Ve vzteku lidé často řeknou věci, kterých pak litují, a domluva nefunguje.",
  ),
  t(
    "Do třídy přišel nový spolužák, který mluví s jiným přízvukem. Jak se k němu zachováš?",
    "Přivítám ho a pomůžu mu zapadnout do třídy",
    [
      ["Budu se mu smát kvůli přízvuku", "Posměch kvůli odlišnosti zraňuje a nového spolužáka odežene."],
      ["Budu ho ignorovat, dokud nezačne mluvit sám", "Nový člověk se v cizí třídě bojí ozvat. Když čekáš, necháš ho v tom samotného."],
      ["Řeknu ostatním, ať si s ním nepovídají", "Tím bys ho z party záměrně vyloučil — to je ubližování, ne odstup."],
    ],
    "Nový spolužák nikoho nezná a cítí se nejistě.",
    "Jiný přízvuk je jen odlišnost, ne chyba. Přemýšlej, co takový člověk první den potřebuje nejvíc a která možnost mu to dá.",
    "Vlídné přivítání a pomoc novému spolužákovi jsou projevem tolerance — přijímáme, že každý může být trochu jiný, a nikoho to nesnižuje.",
  ),
  t(
    "Všimneš si, že tvůj kamarád je ve škole smutný a nemluví. Co uděláš?",
    "Zeptám se ho, co se stalo, a nabídnu mu pomoc",
    [
      ["Budu předstírat, že jsem si ničeho nevšiml", "Předstíráním kamarádovi nepomůžeš — zůstane se smutkem sám."],
      ["Řeknu ostatním, ať se mu smějí", "Posměch smutnému člověku ubližuje ještě víc než původní problém."],
      ["Počkám, až mi to řekne sám za týden", "Kdo je smutný, často se ozvat nedokáže. Týden je hodně dlouhá doba."],
    ],
    "Kamarádův smutek je signál, kterého sis už všiml.",
    "Všimnout si je jen půlka věci — druhá půlka je udělat krok k němu. Hledej možnost, kde se kamarád dozví, že ti na něm záleží.",
    "Všimnout si smutku kamaráda a zeptat se ho je projevem empatie — snažíme se pochopit, jak se cítí, a hned nabídneme podporu.",
  ),
  t(
    "Skupina žáků má společně postavit model hradu z papíru. Každý dělá jinou část — jeden věž, druhý bránu, třetí hradby. Jak se tomuto společnému postupu říká?",
    "Spolupráce",
    [
      ["Soutěž", "V soutěži jde každý sám za sebe. Tady všichni staví jeden hrad."],
      ["Kompromis", "Kompromis vzniká při sporu, kdy obě strany ustoupí. Tady se nikdo nehádá."],
      ["Konflikt", "Konflikt je neshoda. Žáci se ale shodli a rozdělili si práci."],
    ],
    "Věž, brána i hradby patří k jedinému hradu.",
    "Rozliš dvě věci: jestli děti pracují proti sobě, nebo každá na jiné části stejného díla. Jak se jmenuje ten druhý způsob?",
    "Když lidé společně pracují na jednom cíli a každý přispívá svou částí, jde o spolupráci. Výsledek je proto lepší, než kdyby model stavěl jeden sám.",
  ),
  t(
    "Kamarádka má jiný názor na to, jaký film je nejlepší. Ty s ní nesouhlasíš, ale vyslechneš ji a neposmíváš se jí. Co tím projevuješ?",
    "Respekt",
    [
      ["Souhlas se vším, co řekne", "Souhlas to není — v otázce se přímo píše, že s ní nesouhlasíš."],
      ["Lhostejnost", "Lhostejnému člověku je to jedno a neposlouchá. Ty jsi ji ale vyslechl."],
      ["Nadřazenost", "Nadřazený člověk dává najevo, že je lepší. Ty se naopak neposmíváš."],
    ],
    "Nesouhlasíš, a přesto se k ní chováš slušně.",
    "Zamysli se, co takové chování říká o tom, jak si ceníš jejího práva mít vlastní názor. Hledej pojem, který právě tohle popisuje — ne souhlas, ani lhostejnost.",
    "Vyslechnout jiný názor a nezesměšňovat ho je projevem respektu. Ten totiž neznamená souhlas, ale uznání, že i druhý má právo na svůj názor.",
  ),
  t(
    "Při hádce s bratrem ho necháš domluvit celou větu, díváš se na něj a nepřerušuješ ho. Co tím děláš?",
    "Nasloucháš mu",
    [
      ["Ignoruješ ho", "Ignorovat by znamenalo nevšímat si ho. Ty se na něj přitom díváš."],
      ["Přerušuješ ho", "To je pravý opak — v zadání ho necháváš domluvit celou větu."],
      ["Předstíráš, že posloucháš", "Předstírání pozná druhý podle uhýbajícího pohledu. Ty se na bratra díváš."],
    ],
    "Díváš se na bratra a nevstupuješ mu do řeči.",
    "Porovnej to s chvílí, kdy někoho jen slyšíš na pozadí. Tady se soustředíš na celou jeho větu — jak se takovému pozornému poslouchání říká?",
    "Nechat druhého domluvit a soustředit se na to, co říká, je naslouchání. Právě díky němu pochopíš jeho pohled a spor se pak řeší snáz.",
  ),
  t(
    "Ve třídě platí, že když někdo mluví, ostatní mu neskáčou do řeči. Čeho se toto pravidlo týká?",
    "Vzájemného naslouchání a respektu ve třídě",
    [
      ["Trestání žáků, kteří se pletou", "Pravidlo netrestá za chybu, jen určuje, kdy kdo mluví."],
      ["Toho, kdo smí mluvit jako první každý den", "Pravidlo neurčuje pořadí ani přednost, týká se všech stejně."],
      ["Soutěže, kdo domluví nejdéle", "Nejde o délku ani o soutěž — jde o to, aby každý dostal prostor."],
    ],
    "Díky tomuto pravidlu se každý ve třídě dostane ke slovu.",
    "Zamysli se, co musí dělat ostatní, zatímco jeden mluví, a jak se tomu chování říká. Vyřaď možnosti, které z pravidla dělají trest nebo soutěž.",
    "Pravidlo neskákat si do řeči zajišťuje, že se lidé navzájem poslouchají a berou na sebe ohled — každý tak dostane prostor říct svůj názor.",
  ),
  t(
    "Tvůj kamarád leží nemocný doma a nemůže do školy. Ty mu po vyučování zajdeš přinést sešity a zápisky. Co tím projevuješ?",
    "Věrnost a ochotu pomoct",
    [
      ["Zvědavost a všetečnost", "Zvědavý člověk se jde podívat kvůli sobě. Ty neseš sešity kvůli kamarádovi."],
      ["Soutěživost za každou cenu", "Soutěžením bys chtěl být lepší než on. Tady mu naopak pomáháš dohnat učivo."],
      ["Lhostejnost k druhým", "Lhostejnému je cizí nemoc jedno a nikam nejde."],
    ],
    "Kamarád je zrovna v nesnázích a ty k němu jdeš.",
    "Nemuseli jsi jít nikam a nikdo by si toho nevšiml. Přesto to uděláš. Které dvě vlastnosti se takovým činem projevují?",
    "Navštívit nemocného kamaráda a pomoct mu s učivem je projevem věrnosti a ochoty pomoct — základních znaků dobrého kamarádství.",
  ),
  t(
    "Omylem jsi rozbil kamarádovu hračku. Přiznáš mu to a omluvíš se, i když víš, že bude smutný. Co tím projevuješ?",
    "Upřímnost",
    [
      ["Zbabělost", "Zbabělec by chybu zatajil. Ty jsi ji naopak přiznal."],
      ["Lhostejnost", "Lhostejnému by bylo jedno, že bude kamarád smutný. Ty se omlouváš."],
      ["Vychloubání", "Vychloubání je chlubení se úspěchem. Tady se přiznáváš k chybě."],
    ],
    "Mohl jsi mlčet, a přesto jsi řekl pravdu.",
    "Přiznat nepříjemnou věc stojí odvahu a jde proti tomu, co by bylo pohodlné. Jak se jmenuje vlastnost, která je opakem lhaní a zatajování?",
    "Přiznat chybu a omluvit se, i když je to nepříjemné, je projevem upřímnosti. Kamarádství postavené na pravdě je totiž pevnější.",
  ),
  t(
    "Spolužák tě o přestávce fyzicky uhodí. Jak správně zareaguješ?",
    "Řeknu to učiteli nebo jinému dospělému",
    [
      ["Uhodím ho zpátky", "Oplácením vznikne rvačka a potrestaní budete oba."],
      ["Nic neřeknu a budu se schovávat", "Schovávání problém neřeší — spolužák může udeřit znovu."],
      ["Budu si myslet, že jsem si to zasloužil", "Za ránu nemůže ten, kdo ji dostal. Vinu si nedávej."],
    ],
    "Rána od spolužáka je vážná věc, ne drobnost.",
    "Rozmysli si, která reakce situaci uzavře a která ji roztočí dál. Kdo ve škole má sílu i právo zakročit, abys nemusel nic řešit sám?",
    "Fyzické násilí se nesmí přecházet ani oplácet. Správná reakce je říct to dospělému, protože ten dokáže situaci bezpečně vyřešit.",
  ),
  t(
    "Ty chceš hrát na hřišti fotbal, kamarád chce hrát na honěnou. Oba chcete najít řešení, které bude vyhovovat vám oběma. Co k tomu především potřebujete udělat?",
    "Domluvit se a najít společné řešení",
    [
      ["Počkat, až se ten druhý vzdá", "Čekáním na kapitulaci druhého vzniká vítěz a poražený, ne řešení pro oba."],
      ["Přestat si spolu hrát", "Rozchod hru nezachrání, jen ji úplně zruší."],
      ["Nechat rozhodnout někoho třetího bez ptaní", "Cizí rozhodnutí nemusí vyhovovat ani jednomu z vás."],
    ],
    "V zadání stojí, že řešení má vyhovovat oběma.",
    "Aby výsledek seděl oběma, musíte se nejdřív dozvědět, co ten druhý vlastně chce. Který způsob to umožní — mlčení, odchod, nebo rozhovor?",
    "Když chtějí obě strany najít řešení vyhovující oběma, musí se domluvit — třeba se u her střídat. Čekání ani odchod totiž potřeby druhého nezjistí.",
  ),
  t(
    "Dva spolužáci se neshodnou na tom, kterou básničku recitovat na besídce. Nikdo z nich druhému neublížil, jen mají jiný názor. Jak se tato situace nazývá?",
    "Konflikt",
    [
      ["Násilí", "Násilí by znamenalo úmyslné ubližování. V zadání se výslovně píše, že nikdo neublížil."],
      ["Kamarádství", "Kamarádství je vztah mezi lidmi, ne popis sporné situace."],
      ["Spolupráce", "Při spolupráci míří všichni ke stejnému cíli. Tady se právě neshodli."],
    ],
    "V zadání je řečeno, že nikdo nikomu neublížil.",
    "Zbývá tedy pojmenovat stav, kdy se dva lidé prostě neshodnou v názoru. Vyřaď násilí (nikdo neublížil) i spolupráci (neshodli se) a zůstane ti jediné slovo.",
    "Neshoda v názoru bez ubližování je konflikt. Na rozdíl od násilí ho lze vyřešit klidným rozhovorem a dohodou.",
  ),
  t(
    "Spolužák má jiné zájmy než ty — sbírá známky, zatímco ty máš rád fotbal. Přesto se s ním bavíš a nezesměšňuješ jeho koníček. Co tím projevuješ?",
    "Toleranci",
    [
      ["Kompromis", "Kompromis znamená, že obě strany ustoupí. Tady nikdo svůj koníček měnit nemusí."],
      ["Násilí", "Násilí by znamenalo ubližovat. Ty se s ním naopak normálně bavíš."],
      ["Lhostejnost", "Lhostejnému by byl spolužák jedno. Ty se s ním ale bavíš."],
    ],
    "Máš jiného koníčka než spolužák, a přesto se s ním bavíš.",
    "Nikdo tu nemusí svou zálibu měnit ani z ní slevovat — jen se navzájem berete takoví, jací jste. Který pojem popisuje právě přijetí odlišnosti?",
    "Přijmout, že má spolužák jiné zájmy, a nezesměšňovat ho je projevem tolerance — bereme lidi i s tím, že se od nás liší.",
  ),
];

const POOL_L3: PracticeTask[] = [
  t(
    "Spolužák tě už několik dnů opakovaně schválně strkal a nadával ti, i když jsi mu řekl, ať přestane. Je to ještě konflikt, nebo už jde o něco jiného, a jak správně zareaguješ?",
    "Jde už o násilí — řeknu to učiteli nebo rodičům",
    [
      ["Je to jen konflikt — počkám, až ho to přestane bavit", "Opakované ubližování samo nepřestává. Čekáním jen získá další dny."],
      ["Je to jen konflikt — musím mu to oplatit", "Oplácení z tebe udělá druhého viníka a nic nevyřeší. A o konflikt už dávno nejde."],
      ["Jde už o násilí — nikomu to neřeknu, abych nebyl žalobníček", "Říct si o pomoc při ubližování není žalování. Mlčení ubližování prodlužuje."],
    ],
    "Zaměř se na dvě slova v zadání: „několik dnů“ a „schválně“.",
    "Nejdřív rozhodni, jestli jde o jednu neshodu, nebo o dlouhodobé úmyslné ubližování. Teprve podle toho vyber reakci — a zvaž, jestli to zvládneš vyřešit sám.",
    "Jednorázová neshoda je konflikt, ale opakované záměrné ubližování slovem i fyzicky je už násilí. Správná reakce je říct to dospělému, ne mlčet ani se mstít.",
  ),
  t(
    "Pohádal ses s kamarádem o to, kdo bude první na houpačce. Jaké je SPRÁVNÉ pořadí kroků k vyřešení sporu?",
    "Nejdřív se uklidnit, pak si navzájem naslouchat, nakonec najít společné řešení",
    [
      ["Nejdřív najít řešení, pak se uklidnit, nakonec naslouchat", "Řešení vymyšlené ve vzteku obvykle nikomu nesedí — a poslouchat druhého má smysl dřív, ne potom."],
      ["Nejdřív naslouchat, pak se pohádat ještě víc, nakonec se uklidnit", "Hádka uprostřed postupu vás vrátí na začátek. Spor se tím neuzavře."],
      ["Nejdřív se urazit, pak přestat kamarádit, nakonec se uklidnit", "Tenhle postup kamarádství ukončí, místo aby spor vyřešil."],
    ],
    "Přemýšlej, co ti ve vzteku vůbec nejde.",
    "Projdi si to jako tři kroky za sebou: který z nich musí být první, aby ty dva další vůbec fungovaly? Zkus si každou nabídnutou variantu představit v praxi u houpačky.",
    "Správný postup je: nejprve zklidnit emoce, pak si navzájem naslouchat, abychom pochopili pohled druhého, a nakonec spolu najít řešení, které vyhovuje oběma.",
  ),
  t(
    "Nový spolužák má jiné náboženství a jiné zvyky u jídla. Ty ho bez problémů necháš být, jaký je, ALE navíc se ho zeptáš na jeho zvyky a bereš vážně, co ti řekne. Co k toleranci navíc přidáváš?",
    "Respekt — aktivně beru ohled na jeho názory a potřeby",
    [
      ["Nic — tolerance a respekt jsou úplně to samé", "Nejsou: jedno je nechat být, druhé se aktivně zajímat a přizpůsobit chování."],
      ["Kompromis — musím se vzdát svých zvyků", "Nic se nevzdáváš — tvoje zvyky zůstávají. Jen bereš vážně ty jeho."],
      ["Násilí — nutím ho, aby se přizpůsobil", "Nikoho k ničemu nenutíš, naopak se ptáš, co potřebuje on."],
    ],
    "Rozliš dva stupně: nechat být × aktivně se zajímat.",
    "Přijmout, že je někdo jiný, je první krok. Ty jsi ale udělal ještě něco navíc — ptal ses a bral jeho odpověď vážně. Jak se jmenuje tenhle aktivnější postoj?",
    "Tolerance znamená přijmout, že je někdo jiný. Respekt jde o krok dál — aktivně bereme v úvahu jeho potřeby a názory, například se ptáme a bereme vážně odpovědi.",
  ),
  t(
    "Kamarád chce hrát jinou hru než ty. Hledáte řešení, které bude fér pro oba. Jak se takové řešení jmenuje, A co k jeho nalezení POTŘEBUJETE nejdřív udělat?",
    "Kompromis — nejdřív si musíme navzájem naslouchat",
    [
      ["Násilí — nejdřív musí jeden ustoupit násilím", "Vynucené ustoupení není fér řešení, ale přemožení slabšího."],
      ["Kompromis — nejdřív musíme přestat kamarádit", "První část sedí, druhá ne: konec kamarádství žádné společné řešení nepřinese."],
      ["Soutěž — nejdřív musíme zjistit, kdo je silnější", "Síla o spravedlnosti nerozhoduje. Slabší by přišel zkrátka."],
    ],
    "Odpověď má dvě části — obě musí sedět.",
    "Nejdřív pojmenuj řešení, ve kterém oba trochu ustoupí. Pak si rozmysli, co k němu potřebujete: jak jinak zjistíš, na čem kamarádovi doopravdy záleží?",
    "Řešení fér pro oba je kompromis. Aby ho šlo najít, musí si obě strany nejdřív navzájem naslouchat — jinak nevědí, co ten druhý vlastně potřebuje.",
  ),
  t(
    "Kamarádi si o přestávce navzájem dělají legraci a smějí se všichni včetně toho, o kom je vtip. Jednoho dne si spolužák všimne, že jednomu z nich už vtipy vadí a je z nich smutný, ale ostatní pokračují dál. Co by měli udělat?",
    "Přestat, protože škádlení, které ubližuje, už není zábava",
    [
      ["Pokračovat, protože si to začali všichni společně", "Společný začátek neznamená, že se to nesmí zastavit, když to jednoho zraňuje."],
      ["Smát se ještě víc, aby to nebylo nápadné", "Tím by se smutek jen prohloubil a ze srandy by se stalo ubližování."],
      ["Nic neříkat, protože si za to smutný spolužák může sám", "Za to, že ho vtipy zraňují, nemůže. Každý snese jinou míru legrace."],
    ],
    "Hranici určuje to, jestli se baví i ten, o kom vtip je.",
    "Nejdřív zjisti, co se v situaci změnilo oproti začátku. Pak podle toho rozhodni, jestli se smí pokračovat stejně jako předtím.",
    "Hranice mezi škádlením a ubližováním je v tom, jestli se baví i ten, o kom je vtip. Když je mu z toho smutno, přestává jít o zábavu a je třeba skončit.",
  ),
  t(
    "Třída společně vymýšlí nové pravidlo, jak se chovat o přestávkách. Každý navrhne nápad a pak hlasují, které pravidlo se jim líbí nejvíc. Jaké DVA principy se tu uplatňují?",
    "Spolupráce (společná tvorba) a respekt k názoru většiny",
    [
      ["Násilí (nucení) a lhostejnost", "Nikdo nikoho nenutí a nikdo není lhostejný — všichni přece navrhují."],
      ["Soutěž (kdo vyhraje) a ignorování ostatních", "Nejde o vítězství jednotlivce. Návrhy se sbírají od všech."],
      ["Kompromis (nikdo nic nenavrhne) a mlčení", "Popis v závorce neodpovídá zadání — každý přece nějaký nápad podal."],
    ],
    "V zadání jsou dvě fáze: vymýšlení a potom hlasování.",
    "Ke každé fázi přiřaď jeden pojem. Co dělají žáci, když tvoří nápady dohromady, a co musí udělat ten, jehož návrh nakonec neprošel?",
    "Když třída společně tvoří pravidlo, jde o spolupráci. Přijetí výsledku hlasování, i když nevyhrál váš nápad, je projevem respektu k rozhodnutí většiny.",
  ),
  t(
    "Kamarád ti řekl ošklivé slovo jednou v afektu a hned se omluvil. Jiný den tě spolužák opakovaně bije o přestávkách. Liší se tyto dvě situace, a pokud ano, jak s nimi naložíš?",
    "Ano — první je konflikt (domluvíme se), druhé je násilí (řeknu dospělému)",
    [
      ["Ne — obě situace jsou stejně vážné a řeším je stejně", "Jedna se stala jednou a skončila omluvou, druhá se opakuje. Stejné rozhodně nejsou."],
      ["Ano — obě jsou násilí, obě oplatím stejně", "Omluvené slovo v afektu není násilí. A oplácení nepomůže ani v tom druhém případě."],
      ["Ne — obě jsou jen legrace, nemusím nic řešit", "Opakované bití legrace není. Přehlížet se nesmí."],
    ],
    "Porovnej obě situace podle dvou věcí: kolikrát a s jakým koncem.",
    "U každé situace zvlášť se zeptej, jestli se opakuje a jestli se ten člověk omluvil. Teprve pak k nim přiřaď reakci — ne každá situace se řeší stejně.",
    "Jednorázová hádka se slovní omluvou je běžný konflikt, který se dá vyřešit domluvou. Opakované fyzické ubližování je násilí, které je třeba nahlásit dospělému.",
  ),
  t(
    "Všimneš si, že spolužák sedí o přestávce sám a vypadá smutně. Co uděláš NEJDŘÍV a co POTOM?",
    "Nejdřív se ho zeptám, co se děje, a pak mu nabídnu, ať si sedne k nám",
    [
      ["Nejdřív ho obejdu, potom si o něm budu povídat s ostatními", "Obejít a pak pomlouvat je pravý opak pomoci — spolužák se bude cítit ještě hůř."],
      ["Nejdřív se mu vysměju, potom ho pozvu mezi nás", "Po posměchu už pozvání nezní jako nabídka přátelství."],
      ["Nejdřív nic neudělám, potom počkám, jestli si někdo jiný všimne", "Čekání na druhé znamená, že spolužák zůstane sám možná celou přestávku."],
    ],
    "Pořadí je důležité: jeden krok musí přijít dřív než druhý.",
    "Nejdřív potřebuješ zjistit, co se vlastně děje — teprve pak víš, co nabídnout. Vyřaď varianty, které začínají posměchem nebo odchodem.",
    "Empatie znamená všimnout si pocitů druhého a zeptat se, co se děje. Druhým krokem je nabídnout konkrétní pomoc, například pozvat smutného spolužáka mezi sebe.",
  ),
  t(
    "Čtyři kamarádi chtějí hrát čtyři různé hry. Tři z nich nakonec ustoupí a hraje se jen ta hra, kterou prosadil nejhlasitější kluk. Je to kompromis?",
    "Ne, ustoupili jen tři — fér dohoda zohlední přání všech",
    [
      ["Ano, protože se nakonec na něčem dohodli", "Shoda na výsledku nestačí, když tři museli slevit ze všeho a jeden z ničeho."],
      ["Ano, protože hlasitější názor má vždy přednost", "Hlasitost není argument. Tichý návrh má stejnou váhu jako hlasitý."],
      ["Ne, protože se vůbec nedohodli", "Dohodli se — hrát se bude. Problém je v tom, jak dohoda vznikla."],
    ],
    "Spočítej, kolik ze čtyř kamarádů muselo slevit ze svého přání.",
    "U férové dohody ustupují všichni zúčastnění, ne jen někteří. Porovnej to s touhle situací a zamysli se, jak by šlo zařídit, aby si zahrál každý.",
    "Pravá dohoda vyžaduje, aby ustoupily všechny strany, ne jen některé. Když tři ustoupí a jeden ne, jde spíš o prosazení silnějšího názoru. Fér by bylo hry střídat.",
  ),
  t(
    "Ve třídě se opakovaně hádáte o to, kdo bude mazat tabuli. Co uděláte NEJDŘÍV, abyste spor vyřešili natrvalo, a jaké řešení pak zavedete?",
    "Nejdřív si o problému promluvíme, pak zavedeme rozpis, podle kterého se u mazání střídají všichni",
    [
      ["Nejdřív se pohádáme ještě víc, pak necháme mazat pořád jednoho", "Jeden stálý mazač je nespravedlivý a hádka se vrátí příští týden."],
      ["Nejdřív o tom nikdo nemluví, pak si to vyřeší silnější žáci sami", "Rozhodnutí silnějších není pravidlo třídy, ale prosazení menší skupiny."],
      ["Nejdřív zavedeme pravidlo, pak si teprve promluvíme, jestli je fér", "Pravidlo vymyšlené bez rozhovoru obvykle někomu nesedí a znovu se o něm hádáte."],
    ],
    "Spor se opakuje, takže potřebuje trvalé řešení, ne jednorázové.",
    "Rozmysli si pořadí: co musí přijít dřív, aby se na výsledném pravidle shodli všichni? A jaké pravidlo rozdělí práci spravedlivě mezi celou třídu?",
    "Když se stejný spor opakuje, je dobré si o něm promluvit a teprve pak zavést jasné pravidlo. Rozpis, ve kterém se všichni střídají, spor vyřeší natrvalo a spravedlivě.",
  ),
  t(
    "Spolužák tvrdí něco, o čem víš, že to není pravda (například že Země je placatá). Být tolerantní znamená, že...",
    "Nechám ho domluvit a slušně mu vysvětlím fakta, ale neurážím ho",
    [
      ["Musím s ním souhlasit, i když vím, že nemá pravdu", "Přijímat člověka neznamená přijímat každé jeho tvrzení. Fakta zůstávají fakty."],
      ["Vysměju se mu, že říká nesmysly", "Posměch není slušné jednání a spolužáka jen odradí od dalšího rozhovoru."],
      ["Řeknu, že s ním kvůli tomu už nechci kamarádit", "Konec kamarádství kvůli omylu je nepřiměřený — omyl se dá vysvětlit."],
    ],
    "Rozliš dvě věci: úctu k člověku a správnost jeho tvrzení.",
    "Přijmout druhého jako člověka neznamená přijmout i nepravdivý údaj. Hledej možnost, která zachová obojí — slušnost vůči němu i pravdivé informace.",
    "Tolerance a úcta k člověku neznamenají, že musíme souhlasit s nepravdivým tvrzením. Můžeme slušně vysvětlit fakta, aniž bychom se druhému posmívali nebo ho odmítli.",
  ),
  t(
    "Skupina spolužáků záměrně nikoho nezve, aby si s nimi hrál, a jednomu spolužáku dlouhodobě říkají, že je hloupý. Je to jen konflikt, a co bys měl udělat?",
    "Ne, je to psychické násilí (šikana) — je třeba to nahlásit dospělému",
    [
      ["Ano, je to jen běžný konflikt, časem to samo přejde", "Dlouhodobé urážky samy nepřejdou. Konflikt je jedna neshoda, ne měsíce ponižování."],
      ["Ne, je to jen legrace, kterou si dělají všichni", "Legrace, ze které je jednomu dlouhodobě zle, není legrace."],
      ["Ano, je to konflikt — ten spolužák si za to může sám", "Za to, že ho vyčleňují a urážejí, nemůže. Vina je na straně těch, kdo ubližují."],
    ],
    "Všimni si slov „záměrně“ a „dlouhodobě“.",
    "Nejdřív rozhodni, jestli jde o jednu neshodu, nebo o opakované ponižování bez ubližování rukama. Pak si rozmysli, jestli to má řešit dítě samo.",
    "Opakované záměrné vyčleňování a ponižování spolužáka není konflikt, ale forma násilí (šikana). Takovou situaci je vždy třeba nahlásit dospělému, ne ji přecházet.",
  ),
  t(
    "Kamarád ti svěřil, že propadá z matematiky, a poprosil tě, ať to nikomu neříkáš. Spolužáci se tě teď ptají, proč je smutný. Co uděláš?",
    "Neřeknu jim to a kamaráda povzbudím, ať se svěří sám",
    [
      ["Řeknu jim to, protože upřímnost je důležitější než slib", "Upřímnost se týká tvých vlastních věcí, ne cizího tajemství. Tady bys zradil důvěru."],
      ["Vymyslím si jiný důvod, aby nic nezjistili", "Vymýšlením lži se zamotáš. Stačí říct, že to není tvoje věc, a nelhat."],
      ["Řeknu to jen svému nejlepšímu kamarádovi", "I jedno další ucho slib porušuje — a tajemství se pak šíří dál."],
    ],
    "Máš proti sobě dvě hodnoty: věrnost kamarádovi a zvědavost ostatních.",
    "Zeptej se, čí je to vlastně informace a kdo má právo ji říct. Hledej možnost, která slib neporuší, ale kamarádovi zároveň pomůže situaci řešit.",
    "Věrnost znamená neporušit slib, i když je to nepohodlné. Zároveň můžeš kamarádovi pomoct — povzbudit ho, aby se svěřil sám nebo požádal o pomoc dospělého.",
  ),
  t(
    "Ve třídě jsou dvě skupiny a obě chtějí o velké přestávce hrát na jediném hřišti. Obě trvají na tom, že dnes musí hrát právě ony. Jaké řešení je pro obě strany nejspravedlivější?",
    "Rozdělit si dny v týdnu, aby se obě skupiny pravidelně vystřídaly",
    [
      ["Hřiště dostane ta skupina, která je početnější", "Počet lidí nerozhoduje o právu. Menší skupina by nehrála nikdy."],
      ["Hřiště dostane skupina, která tam přiběhne dřív", "Závod ve běhu je nebezpečný a vyhrávali by pořád ti nejrychlejší."],
      ["Nebude hrát nikdo, aby se nikdo nezlobil", "Zákaz pro všechny nikoho neuspokojí — je to prohra pro obě strany."],
    ],
    "Hřiště je jedno, ale přestávek je v týdnu víc.",
    "Místo aby jedna skupina vyhrála a druhá prohrála, zkus přání obou rozložit v čase. Jaké pravidlo zajistí, že si každá skupina zahraje pravidelně?",
    "Když jde o jednu věc, kterou chtějí dva, bývá nejspravedlivější střídání podle jasného rozpisu. Obě skupiny tak dostanou stejný díl a spor se už nemusí opakovat.",
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const VZTAHYKONFLIKTY: TopicMetadata[] = [
  {
    id: "g3-prvouka-lide-kolem-nas-souziti-a-komunikace-vztahy-mezi-lidmi-reseni-konfliktu",
    rvpNodeId:
      "g3-prvouka-lide-kolem-nas-souziti-a-komunikace-vztahy-mezi-lidmi-reseni-konfliktu",
    title: "Vztahy mezi lidmi, řešení konfliktů",
    studentTitle: "Vztahy a konflikty",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití a komunikace",
    briefDescription:
      "Poznáš, jak fungují dobré vztahy a jak řešit konflikty.",
    keywords: [
      "empatie",
      "respekt",
      "kompromis",
      "spolupráce",
      "tolerance",
      "konflikt",
      "násilí",
      "kamarádství",
      "pravidla třídy",
      "naslouchání",
    ],
    goals: [
      "Vysvětlit pojmy empatie, respekt, kompromis, spolupráce a tolerance.",
      "Popsat kroky při řešení konfliktu.",
      "Rozlišit konflikt a násilí.",
      "Uvést příklady dobrého kamarádství.",
    ],
    boundaries: [
      "Základní pojmy a situace ze školního a rodinného života, bez psychologické teorie.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Empatie = vcítit se. Respekt = brát ohled. Kompromis = každý trochu ustoupí. Konflikt = neshoda, která se dá vyřešit klidnou dohodou.",
      steps: [
        "Uklidni se.",
        "Klidně mluv a naslouchej.",
        "Hledejte společné řešení.",
        "Dohodněte se na kompromisu.",
      ],
      commonMistake:
        "Záměna konfliktu a násilí — konflikt je neshoda, násilí záměrně ubližuje.",
      example:
        "Jana a Tomáš se hádají o to, jakou hru hrát. Každý trochu ustoupí a střídají se — to je kompromis.",
    },
  },
];
