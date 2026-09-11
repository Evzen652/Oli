/**
 * Přírodověda 4. ročník — Strava, pohyb, spánek, prevence úrazů a nemocí.
 *
 * Přepsáno 2026-09-11. Původní úlohy neměly nápovědu, vysvětlení ani
 * diagnostiku a sahaly po odborné výživě a medicíně: trans-tuky, omega-3,
 * anafylaxe, „konsolidace vzpomínek“, kardiovaskulární choroby. Správné
 * odpovědi byly často dvakrát delší než ostatní, takže se prozrazovaly.
 *
 * Gradace:
 *  • L1 — doporučení pro každý den (jídlo, pití, spánek, hygiena, přilba).
 *  • L2 — proč to tak je a jak se chovat (sladkosti, usínání, očkování,
 *         klíšťata, přecházení silnice).
 *  • L3 — úvahy a důsledky (spánek a paměť, která svačina zasytí, proč
 *         poutat i na krátkou cestu, jak se přenášejí bacily).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "./_shared";

const POOL_L1: PracticeTask[] = [
  choice("Čeho by mělo být v jídelníčku nejvíc?", "Zeleniny, ovoce a obilovin", [
    { value: "Sladkostí a sušenek", why: "Sladkosti patří na vrchol pyramidy — jíme jich co nejméně." },
    { value: "Uzenin a salámů", why: "Uzeniny mají hodně soli a tuku, jíme je jen občas." },
    { value: "Smažených jídel", why: "Smažené jídlo je tučné. Nemá tvořit základ jídelníčku." },
  ], {
    hints: ["Vzpomeň si na potravinovou pyramidu. Co je dole v nejširší části?", "Dole je to, co jíme každý den nejvíc: pečivo, rýže, těstoviny a hodně barevného jídla ze zahrady."],
    explanation: "Základ jídelníčku tvoří obiloviny (pečivo, rýže, těstoviny) a hodně zeleniny a ovoce. Dávají energii, vitamíny a vlákninu. Sladkostí a tuků jíme nejméně.",
  }),
  choice("Čeho bychom měli jíst nejméně?", "Sladkostí a tučných jídel", [
    { value: "Zeleniny", why: "Zeleniny máme jíst hodně, dává vitamíny a vlákninu." },
    { value: "Ovoce", why: "Ovoce patří do každého dne." },
    { value: "Celozrnného pečiva", why: "Celozrnné pečivo je zdravý základ jídelníčku." },
  ], {
    hints: ["Co je na úplném vrcholu potravinové pyramidy?", "Nahoře v pyramidě je malé místo pro to, co je sice dobré, ale zdraví moc neprospívá — bonbóny, čokoláda, hranolky."],
    explanation: "Na vrcholu pyramidy jsou sladkosti a tučná jídla. Mají hodně cukru a tuku, ale málo vitamínů. Stačí je jíst jen občas.",
  }),
  choice("Kolik hodin by měl školák spát?", "Asi 9 až 11 hodin", [
    { value: "Asi 5 hodin", why: "Pět hodin je pro dítě velmi málo, bylo by pořád unavené." },
    { value: "Asi 7 hodin", why: "Sedm hodin stačí některým dospělým. Děti potřebují víc." },
    { value: "Asi 15 hodin", why: "Tolik spí miminka. Školák potřebuje méně." },
  ], {
    hints: ["Děti potřebují spát víc než dospělí.", "Když jdeš spát v devět a vstáváš v sedm, kolik hodin to je? Zhruba tolik spánku je potřeba."],
    explanation: "Školák potřebuje spát asi 9 až 11 hodin. Ve spánku tělo roste a odpočívá a mozek si ukládá, co se přes den naučil.",
  }),
  choice("Kolik času denně by se měly děti hýbat?", "Aspoň hodinu", [
    { value: "Stačí deset minut", why: "Deset minut je málo. Děti potřebují pohyb aspoň hodinu denně." },
    { value: "Jen o hodině tělocviku", why: "Tělocvik je jen pár hodin týdně. Pohyb je potřeba každý den." },
    { value: "Pohyb není potřeba", why: "Bez pohybu slábnou svaly i srdce. Pohyb je potřeba denně." },
  ], {
    hints: ["Počítá se běhání, kolo, hřiště i cesta do školy pěšky.", "Lékaři doporučují, aby se děti každý den pořádně hýbaly zhruba tak dlouho, jak trvá jedna dlouhá pohádka nebo dvě vyučovací hodiny bez přestávky."],
    explanation: "Děti by se měly hýbat aspoň hodinu denně — běhat, jezdit na kole, hrát si venku. Pohyb posiluje srdce, svaly i kosti.",
  }),
  choice("Jaký nápoj je na žízeň nejlepší?", "Voda", [
    { value: "Slazená limonáda", why: "Limonáda má hodně cukru, kazí zuby a žízeň neuhasí tak dobře." },
    { value: "Energetický nápoj", why: "Energetické nápoje nejsou pro děti vhodné, obsahují kofein a cukr." },
    { value: "Kola", why: "Kola má hodně cukru a kofein. Na žízeň se nehodí." },
  ], {
    hints: ["Hledej nápoj bez cukru.", "Tělo potřebuje každý den doplnit tekutiny. Nejlepší je ten nápoj, který neobsahuje nic navíc a teče z kohoutku."],
    explanation: "Na žízeň je nejlepší obyčejná voda. Nemá cukr, nekazí zuby a tělo ji hned využije. Slazené nápoje jsou jen občas.",
  }),
  choice("Kdy si musíš umýt ruce?", "Před jídlem a po záchodě", [
    { value: "Jen večer před spaním", why: "Bacily se na ruce dostanou během celého dne. Myjeme je víckrát." },
    { value: "Jen když jsou vidět špinavé", why: "Bacily nejsou vidět. Ruce myjeme i tehdy, když vypadají čisté." },
    { value: "Jen po tělocviku", why: "Po tělocviku ano, ale hlavně před jídlem a po záchodě." },
  ], {
    hints: ["Kdy by se bacily z rukou mohly dostat do pusy?", "Jednou je to předtím, než sáhneš na chleba, a podruhé když odejdeš z místa, kde se splachuje."],
    explanation: "Ruce myjeme hlavně před jídlem a po použití záchodu, také po příchodu zvenku. Bacily nejsou vidět, a mýdlo je z rukou smyje.",
  }),
  choice("Jak často si čistíme zuby?", "Ráno a večer", [
    { value: "Jednou týdně", why: "Jednou týdně je málo, zuby by se kazily." },
    { value: "Jen když bolí", why: "Když zub bolí, bývá už zkažený. Čistíme je pravidelně." },
    { value: "Jen před návštěvou zubaře", why: "Zuby čistíme každý den, ne kvůli zubaři." },
  ], {
    hints: ["Kolikrát denně stojíš s kartáčkem u umyvadla?", "Jednou po probuzení a jednou předtím, než jdeš spát. Kolikrát to je?"],
    explanation: "Zuby čistíme dvakrát denně, ráno a večer, aspoň dvě minuty. Kartáček odstraní zbytky jídla, ze kterých by bakterie udělaly kaz.",
  }),
  choice("Co musíš mít na hlavě při jízdě na kole?", "Přilbu", [
    { value: "Kšiltovku", why: "Kšiltovka chrání před sluncem, ale hlavu při pádu neochrání." },
    { value: "Čelenku", why: "Čelenka hřeje uši, ale před úrazem nechrání." },
    { value: "Kapuci", why: "Kapuce hlavu při pádu neochrání a navíc zakrývá výhled." },
  ], {
    hints: ["Hledej věc, která ochrání hlavu, když spadneš.", "Má tvrdý obal a uvnitř měkkou výplň, zapíná se pod bradou. Pro děti je na kole povinná."],
    explanation: "Přilba chrání hlavu při pádu. Tvrdý obal a měkká výplň ztlumí náraz. Děti ji na kole musí mít ze zákona.",
  }),
  choice("Ve kterých potravinách je hodně vápníku pro pevné kosti?", "V mléce a mléčných výrobcích", [
    { value: "V limonádách", why: "Limonády mají hlavně cukr, vápník ne." },
    { value: "V bonbónech", why: "Bonbóny jsou z cukru, vápník nemají." },
    { value: "V bramborových lupíncích", why: "Lupínky mají hodně soli a tuku, vápník skoro žádný." },
  ], {
    hints: ["Kosti a zuby potřebují vápník. Co piješ ke snídani?", "Hledej potraviny, které dávají krávy a dělají se z nich sýr a jogurt."],
    explanation: "Hodně vápníku je v mléce, jogurtu a sýru. Vápník potřebují kosti a zuby, aby byly pevné, hlavně když rostou.",
  }),
  choice("Co nejlépe chrání před přenosem nachlazení?", "Časté mytí rukou", [
    { value: "Sdílení lahve s kamarádem", why: "Se společnou lahví se bacily přenesou slinami." },
    { value: "Kýchání do dlaní", why: "Z dlaní pak bacily roznášíš na kliky a lidi. Kýchá se do lokte." },
    { value: "Sedění v nevyvětrané třídě", why: "Ve vydýchaném vzduchu se bacily šíří snáz. Pomáhá větrat." },
  ], {
    hints: ["Čím nejčastěji saháš na kliky, telefon i jídlo?", "Bacily nosíme na rukou a pak si je dáme do pusy nebo do očí. Co je z rukou dostane pryč?"],
    explanation: "Nachlazení se šíří hlavně rukama a kapénkami. Časté mytí rukou mýdlem bacily odstraní dřív, než se dostanou do pusy, nosu nebo očí.",
  }),
  choice("Kam se má správně kýchat?", "Do kapesníku nebo do lokte", [
    { value: "Do dlaní", why: "Z dlaní se bacily dostanou na všechno, na co pak sáhneš." },
    { value: "Směrem na spolužáka", why: "Kapénky by dopadly na spolužáka a mohl by onemocnět." },
    { value: "Volně do vzduchu", why: "Kapénky se rozletí po místnosti a ostatní je vdechnou." },
  ], {
    hints: ["Kýchnutím letí kapénky s bacily. Kam je chytit, aby nikomu neublížily?", "Rukama pak sahá na kliky a lidi, takže ruce ne. Co zbývá — papírový ubrousek, nebo ohnutá paže?"],
    explanation: "Kýcháme do kapesníku nebo do ohnutého lokte. Kapénky se nerozletí a bacily nezůstanou na dlaních, kterými pak saháme na věci a lidi.",
  }),
  choice("Která svačina je nejzdravější?", "Jablko a celozrnný rohlík", [
    { value: "Tyčinka a limonáda", why: "Tyčinka i limonáda mají hodně cukru a málo vitamínů." },
    { value: "Sáček chipsů", why: "Chipsy jsou slané a tučné, nezasytí na dlouho." },
    { value: "Kobliha s čokoládou", why: "Kobliha je sladká a tučná, hodí se jen výjimečně." },
  ], {
    hints: ["Hledej svačinu bez cukru a tuku navíc.", "Jedna svačina obsahuje ovoce a pečivo z celého zrna. Dodá vitamíny a zasytí až do oběda."],
    explanation: "Jablko dodá vitamíny a vlákninu a celozrnný rohlík energii na dlouho. Sladké a tučné svačiny zasytí jen na chvíli.",
  }),
  choice("Kolik času denně je rozumné trávit u obrazovky pro zábavu?", "Nejvýš asi dvě hodiny", [
    { value: "Klidně celý den", why: "Celý den u obrazovky znamená žádný pohyb a unavené oči." },
    { value: "Aspoň šest hodin", why: "Šest hodin je moc. Chybí pak pohyb, spánek i čas venku." },
    { value: "Čím víc, tím lépe", why: "Víc času u obrazovky zdraví nepřidá, naopak mu škodí." },
  ], {
    hints: ["Zbytek dne potřebuješ na pohyb, spánek, školu a kamarády.", "Lékaři radí dětem, aby u televize, tabletu a mobilu pro zábavu byly za den jen asi tak dlouho, jak trvá jeden film."],
    explanation: "Pro zábavu stačí u obrazovky nejvýš asi dvě hodiny denně. Dlouhé sezení unavuje oči, bolí z něj záda a chybí pak čas na pohyb a spánek.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Proč bychom měli jíst hodně ovoce a zeleniny?", "Dodávají vitamíny a vlákninu", [
    { value: "Mají nejvíc bílkovin", why: "Bílkoviny jsou hlavně v mase, mléce, vejcích a luštěninách." },
    { value: "Jsou hlavní zdroj tuku", why: "Ovoce a zelenina tuku skoro nemají." },
    { value: "Nahradí pití vody", why: "Obsahují vodu, ale pití nenahradí." },
  ], {
    hints: ["Co dává tělu síla k boji s nemocemi a pomáhá trávení?", "Vitamín C v paprice a jablku a vláknina ve slupkách a listech — kde se toho najde nejvíc?"],
    explanation: "Ovoce a zelenina dodávají vitamíny, které pomáhají chránit před nemocemi, a vlákninu, která pomáhá trávení. Proto by měly být v každém jídle.",
  }),
  choice("Proč nejsou sladkosti vhodná svačina?", "Brzy máš zase hlad a kazí zuby", [
    { value: "Mají hodně bílkovin", why: "Sladkosti bílkoviny skoro nemají, jsou hlavně z cukru." },
    { value: "Obsahují moc vitamínu C", why: "Vitamín C je v ovoci a zelenině, ne v bonbónech." },
    { value: "Zasytí na celý den", why: "Je to naopak — cukr zasytí jen na chvíli." },
  ], {
    hints: ["Jak dlouho vydržíš bez hladu po bonbónu a jak po chlebu se sýrem?", "Cukr dodá energii jen na chvíli, pak přijde hlad. A co cukr dělá se zuby, když zůstane v puse?"],
    explanation: "Sladkosti mají hodně cukru. Dodají energii jen na chvíli a brzy máš zase hlad. Cukr navíc živí bakterie v puse, které kazí zuby.",
  }),
  choice("Proč je dobré chodit spát každý den ve stejnou dobu?", "Tělo si zvykne a spí se lépe", [
    { value: "Aby zbyl čas na televizi", why: "Televize před spaním spánek naopak zhoršuje." },
    { value: "Aby se ti míň zdálo", why: "Pravidelnost sny neubírá. Pomáhá tělu usnout." },
    { value: "Na době nezáleží", why: "Záleží. Tělo si zvykne na pravidelný čas a usíná snáz." },
  ], {
    hints: ["Tělo má vnitřní hodiny.", "Když chodíš spát a vstáváš pořád ve stejnou dobu, tělo samo ví, kdy má být unavené. Co to udělá se spánkem?"],
    explanation: "Tělo má vnitřní hodiny. Když chodíme spát pravidelně, tělo si zvykne, usíná rychleji a spánek je hlubší a kvalitnější.",
  }),
  choice("Co ti pomůže dobře usnout?", "Tma, klid a žádná obrazovka", [
    { value: "Hraní na mobilu v posteli", why: "Světlo obrazovky a napětí ze hry mozek probudí." },
    { value: "Sklenice koly", why: "Kola obsahuje kofein a cukr, které tě udrží vzhůru." },
    { value: "Hlasitá hudba", why: "Hluk usínání ruší. Tělo potřebuje klid." },
  ], {
    hints: ["Co mozku řekne, že je čas spát?", "Světlo z mobilu mozek šálí, že je den. Hledej odpověď, ve které nic nesvítí a nic nehučí."],
    explanation: "Mozek usíná, když je tma a klid. Světlo obrazovky ho šálí, že je ještě den. Proto se hodinu před spaním obrazovky raději odloží.",
  }),
  choice("Jak pohyb prospívá tělu?", "Posiluje srdce, svaly i kosti", [
    { value: "Škodí dětským kloubům", why: "Přiměřený pohyb klouby a kosti posiluje." },
    { value: "Je potřeba jen sportovcům", why: "Pohyb potřebuje každý, nejen sportovci." },
    { value: "Pomáhá jen hubnout", why: "Pohyb pomáhá mnohem víc než jen hubnout — posiluje celé tělo." },
  ], {
    hints: ["Co se stane se svalem, který pravidelně pracuje?", "Při běhu bije srdce rychleji, svaly pracují a kosti nesou váhu těla. Co to s nimi časem udělá?"],
    explanation: "Při pohybu pracuje srdce, svaly i kosti, a proto sílí. Pohyb také zlepšuje náladu a spánek a pomáhá udržet zdravou váhu.",
  }),
  choice("Proč se po sportu nebo v horku musí víc pít?", "Tělo ztrácí vodu potem", [
    { value: "Voda nahradí jídlo", why: "Voda jídlo nenahradí. Doplňuje ztracené tekutiny." },
    { value: "Aby se svaly umyly", why: "Svaly se nemyjí. Tělo potřebuje doplnit vodu z potu." },
    { value: "Aby byl pot slabší", why: "Pít se musí proto, že potem voda z těla odešla." },
  ], {
    hints: ["Co ti teče po čele, když běháš v létě?", "Pot je voda, kterou se tělo ochlazuje. Kde se ta voda v těle vezme a co musíš udělat, aby nechyběla?"],
    explanation: "Tělo se v horku a při sportu ochlazuje potem, a přitom ztrácí vodu. Tu musíme doplnit pitím, jinak přijde bolest hlavy a únava.",
  }),
  choice("Jak funguje očkování?", "Naučí tělo bránit se nemoci předem", [
    { value: "Vyléčí nemoc, kterou už máš", why: "Očkování nemoc neléčí. Chrání před ní dopředu." },
    { value: "Je to injekce vitamínů", why: "Očkovací látka nejsou vitamíny. Učí tělo poznat nemoc." },
    { value: "Zabije všechny bakterie v těle", why: "Očkování nic nezabíjí. Připraví obranu těla." },
  ], {
    hints: ["Očkuje se, když jsi zdravý, ne když jsi nemocný.", "Tělo se z očkování naučí nemoc poznat. Co pak udělá, když se s ní opravdu setká?"],
    explanation: "Očkovací látka naučí tělo poznat nemoc, aniž bychom onemocněli. Když se pak s nemocí opravdu setkáme, tělo se ubrání rychleji.",
  }),
  choice("Co udělat po procházce lesem nebo vysokou trávou?", "Prohlédnout tělo a klíště hned odstranit", [
    { value: "Nic, klíšťata neškodí", why: "Klíšťata mohou přenášet vážné nemoci." },
    { value: "Počkat, až klíště samo odpadne", why: "Čím déle klíště saje, tím víc hrozí nákaza. Odstraní se hned." },
    { value: "Klíště namazat máslem", why: "Máslo ani krém se nepoužívají. Klíště se opatrně vytáhne pinzetou." },
  ], {
    hints: ["Kdo číhá v trávě a přisaje se na kůži?", "Klíště je malé a přisaje se často v podpaží nebo na nohou. Co s tebou udělají rodiče, když se vrátíš z lesa?"],
    explanation: "Klíšťata mohou přenášet nemoci. Po lese nebo trávě si prohlédneme celé tělo a nalezené klíště hned pinzetou vytáhneme. Místo pak vydezinfikujeme.",
  }),
  choice("Jak správně přejít silnici?", "Na přechodu, po rozhlédnutí vlevo, vpravo a vlevo", [
    { value: "Kdekoli, kde zrovna nejede auto", why: "Mimo přechod tě řidič nečeká. Nejbezpečnější je přechod." },
    { value: "Rychle proběhnout mezi auty", why: "Mezi stojícími auty tě řidiči nevidí. Je to velmi nebezpečné." },
    { value: "Na přechodu, bez rozhlížení", why: "I na přechodu se musíš rozhlédnout — řidič tě nemusí vidět." },
  ], {
    hints: ["Kde tě řidiči očekávají?", "Na zebře se zastav a podívej se nejdřív tam, odkud jedou auta nejblíž k tobě, pak na druhou stranu a pak znovu na první."],
    explanation: "Silnici přecházíme po přechodu. Zastavíme se, rozhlédneme se vlevo, vpravo a znovu vlevo a jdeme, až nic nejede. Nikdy nevybíháme zpoza aut.",
  }),
  choice("Proč musí mít kolo světla a odrazky?", "Aby tě řidiči viděli za šera", [
    { value: "Aby kolo vypadalo hezky", why: "Světla nejsou ozdoba. Jde o to, aby tě bylo vidět." },
    { value: "Aby kolo jelo rychleji", why: "Světla rychlost nemění." },
    { value: "Aby na tebe svítilo slunce", why: "Světla na kole svítí v šeru a ve tmě, se sluncem nesouvisí." },
  ], {
    hints: ["Kdy tě řidič auta nejhůř uvidí?", "Za šera a v noci je cyklista skoro neviditelný. Co ho udělá vidět ze zepředu i zezadu?"],
    explanation: "Za šera a ve tmě je cyklista špatně vidět. Světla a odrazky ho zviditelní, aby ho řidiči včas zahlédli a nesrazili.",
  }),
  choice("Proč nechodit do školy s horečkou?", "Nakazily by se další děti a nemoc by trvala déle", [
    { value: "Ve škole je v zimě chladno", why: "Ve škole se topí. Důvod je nákaza a odpočinek." },
    { value: "Horečka ve škole zmizí", why: "Horečka nezmizí, tělo potřebuje odpočívat." },
    { value: "Nemocní se ve škole uzdraví dřív", why: "Je to naopak. Nemocný potřebuje klid a odpočinek doma." },
  ], {
    hints: ["Na co myslíš, když mluvíš o sobě, a na co, když mluvíš o spolužácích?", "Nemocné tělo potřebuje klid, aby se uzdravilo. A co by se stalo se spolužáky, kdybys na ně kýchal?"],
    explanation: "S horečkou tělo bojuje s nemocí a potřebuje odpočívat. Ve škole by se tělo uzdravovalo hůř a nemoc by se přenesla na spolužáky i učitele.",
  }),
  choice("Proč je snídaně důležitá?", "Dá tělu energii na dopoledne", [
    { value: "Po snídani se nemusí obědvat", why: "Snídaně oběd nenahradí. Dodá energii na dopoledne." },
    { value: "Snídaně zkrátí spánek", why: "Snídaně se spánkem nesouvisí." },
    { value: "Bez snídaně se lépe učí", why: "Bez snídaně chybí energie a hůř se soustředí." },
  ], {
    hints: ["Kdy jsi naposledy jedl, když ráno vstaneš?", "Od večeře do rána tělo nic nedostalo. Z čeho má mozek brát energii na první hodiny ve škole?"],
    explanation: "Přes noc tělo spotřebovalo energii z večeře. Snídaně ji doplní, a tak se dopoledne lépe soustředíme a nemáme hlad.",
  }),
  choice("Proč chodit k zubaři, i když nic nebolí?", "Kaz se najde včas, dřív než bolí", [
    { value: "Zubař zuby vybělí", why: "Bělení není důvod prohlídky. Jde o zdraví zubů." },
    { value: "Pak se nemusí čistit zuby", why: "Zuby se musí čistit pořád, prohlídka to nenahradí." },
    { value: "K zubaři se chodí, jen když bolí", why: "Když zub bolí, bývá kaz už velký. Prohlídky ho najdou dřív." },
  ], {
    hints: ["Kdy začne zub bolet — na začátku kazu, nebo když je už velký?", "Malý kaz ještě nebolí a opraví se snadno a rychle. Kdo ho najde, když o něm vůbec nevíš a nic tě netrápí?"],
    explanation: "Malý kaz nebolí, ale zubař ho při prohlídce najde a snadno opraví. Kdybychom čekali na bolest, kaz by byl velký a oprava horší.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Proč si po dobrém spánku lépe pamatuješ, co bylo ve škole?", "Mozek ve spánku ukládá, co se přes den naučil", [
    { value: "Ve spánku mozek nepracuje", why: "Mozek ve spánku pracuje — třídí a ukládá zážitky dne." },
    { value: "Nové věci se učíš ve snech", why: "Ve snech se neučíš. Mozek jen ukládá, co se naučil přes den." },
    { value: "Spánek s pamětí nesouvisí", why: "Souvisí. Nevyspalý člověk si pamatuje hůř." },
  ], {
    hints: ["Co dělá mozek, když tělo odpočívá?", "Odpoledne se naučíš básničku a ráno ji umíš líp než večer. Kdy se mozek postaral, aby ji uložil?"],
    explanation: "Ve spánku mozek třídí a ukládá, co jsme se přes den naučili. Po dobrém spánku si pamatujeme lépe, nevyspalý člověk zapomíná.",
  }),
  choice("Svačina A: sladký rohlík a limonáda. Svačina B: chléb se sýrem a jablko. Která zasytí na déle?", "B, protože dává energii postupně", [
    { value: "A, protože cukr zasytí nejdéle", why: "Cukr dodá energii rychle, ale krátce. Brzy přijde hlad." },
    { value: "Obě stejně dlouho", why: "Nejsou stejné. Cukr zasytí na chvíli, chléb se sýrem na déle." },
    { value: "A, protože limonáda zasytí", why: "Limonáda nezasytí, jen dodá cukr." },
  ], {
    hints: ["Po které svačině budeš mít hlad už o přestávce?", "Cukr z rohlíku a limonády tělo spotřebuje hned. Chléb, sýr a jablko se tráví pomaleji. Co to znamená pro hlad?"],
    explanation: "Sladký rohlík a limonáda dodají cukr, který tělo spálí rychle, a hlad přijde brzy. Chléb se sýrem a jablko se tráví déle a zasytí až do oběda.",
  }),
  choice("Proč se v autě musí děti poutat v autosedačce i na krátkou cestu?", "Při prudkém brzdění by vyletěly dopředu", [
    { value: "Kvůli pokutě, nebezpečí žádné", why: "Nejde jen o pokutu. Bez pásu hrozí vážné zranění." },
    { value: "Stačí to jen na dálnici", why: "Nehoda se stane i ve městě a na krátké cestě." },
    { value: "Autosedačka je jen pro pohodlí", why: "Autosedačka dítě chrání. Pás pro dospělé je dítěti vysoko." },
  ], {
    hints: ["Co se stane s nepřipoutanou taškou na sedadle, když auto prudce zabrzdí?", "Auto zastaví, ale všechno uvnitř letí dál dopředu. Co tělo zadrží? A proč musí být dítě ve sedačce?"],
    explanation: "Při prudkém brzdění nebo nárazu letí vše v autě dál dopředu. Pás a autosedačka tělo zadrží. Autosedačka zajistí, aby pás vedl přes správná místa dětského těla.",
  }),
  choice("Proč si ruce musíme mýt mýdlem, a ne jen vodou?", "Mýdlo smyje i mastnotu, na které drží bacily", [
    { value: "Mýdlo bacily sní", why: "Mýdlo nic nejí. Pomůže je z kůže smýt." },
    { value: "Mýdlo jen hezky voní", why: "Vůně není důvod. Mýdlo rozpustí mastnotu s bacily." },
    { value: "Stačí voda, mýdlo je zbytečné", why: "Samotná voda mastnotu s bacily nesmyje dobře." },
  ], {
    hints: ["Zkus umýt mastný talíř jen studenou vodou.", "Bacily drží na kůži v mastné vrstvičce, kterou voda sama nesmyje. Co ji rozpustí?"],
    explanation: "Na rukou je tenká mastná vrstva, ve které drží bacily. Samotná voda po ní steče. Mýdlo mastnotu rozpustí a voda ji i s bacily odplaví.",
  }),
  choice("Proč celodenní sezení u obrazovky škodí zdraví?", "Chybí pohyb, bolí záda a unavují se oči", [
    { value: "Obrazovka přenáší nemoci", why: "Obrazovka nemoci nepřenáší. Škodí nedostatek pohybu a únava očí." },
    { value: "Neškodí, když je hra zábavná", why: "Zábava nic nemění na tom, že tělo sedí a oči jsou unavené." },
    { value: "Škodí jen dospělým", why: "Dětem škodí stejně, protože rostou a potřebují pohyb." },
  ], {
    hints: ["Co tělo nedělá, když celý den sedí?", "Svaly nepracují, záda jsou pořád ohnutá a oči se dívají jen na jedno místo. Co z toho bude za pár měsíců?"],
    explanation: "Při dlouhém sezení u obrazovky se nehýbeme, svaly slábnou a bolí záda. Oči se unaví a často chybí i spánek. Proto se má čas u obrazovky omezovat.",
  }),
  choice("Proč je nebezpečné pít z jedné lahve s nachlazeným kamarádem?", "Bacily se přenesou slinami", [
    { value: "Láhev se tím rychleji rozbije", why: "Láhev se nerozbije. Jde o přenos bacilů." },
    { value: "Voda se tím zkazí", why: "Voda se nezkazí, ale dostanou se do ní bacily." },
    { value: "Nebezpečné to není", why: "Je, bacily ze slin kamaráda se dostanou k tobě." },
  ], {
    hints: ["Co zůstane na hrdle lahve, když z ní pil nemocný?", "Nachlazení se šíří kapénkami a slinami. Kam se dostanou, když se napiješ po něm?"],
    explanation: "Nachlazený kamarád má bacily ve slinách. Když pije z lahve, zůstanou na hrdle, a když se napiješ po něm, dostanou se k tobě.",
  }),
  choice("Jak se ve sportu nejlépe předchází úrazům?", "Rozcvičkou a ochrannými pomůckami", [
    { value: "Tím, že se nikdy nesportuje", why: "Bez pohybu tělo slábne. Úrazům se předchází jinak." },
    { value: "Sportovat dlouho bez pití", why: "Bez pití přijde únava a úraz je pravděpodobnější." },
    { value: "Hrát bez pravidel", why: "Pravidla hráče chrání. Bez nich je víc úrazů." },
  ], {
    hints: ["Co děláš na začátku tělocviku?", "Zahřáté svaly se tak snadno nenatrhnou a chrániče, přilba nebo helma ztlumí náraz. Co z toho je v nabídce?"],
    explanation: "Rozcvička zahřeje svaly, takže se méně zraní. Ochranné pomůcky jako přilba, chrániče nebo správná obuv ztlumí pád a náraz.",
  }),
  choice("Proč mají být v jídle i luštěniny, ryby nebo maso?", "Dodají bílkoviny, ze kterých tělo roste", [
    { value: "Dodají hlavně vitamín C", why: "Vitamín C je hlavně v ovoci a zelenině." },
    { value: "Nahradí pití vody", why: "Žádné jídlo pití nenahradí." },
    { value: "Obsahují nejvíc cukru", why: "Luštěniny, ryby a maso cukru moc nemají." },
  ], {
    hints: ["Z čeho si tělo staví svaly?", "Dítě roste a potřebuje stavební materiál pro svaly. Který je v mase, rybách, vejcích, mléce a luštěninách?"],
    explanation: "Luštěniny, ryby, maso, vejce a mléčné výrobky obsahují bílkoviny. Z nich tělo staví svaly a opravuje se, a proto jsou pro rostoucí děti důležité.",
  }),
  choice("Proč se nesmí skákat do neznámé nebo mělké vody?", "Pod hladinou mohou být kameny a hloubka se neodhadne", [
    { value: "Voda je vždycky ledová", why: "Teplota vody není hlavní nebezpečí. Hrozí náraz na dno." },
    { value: "Ryby by kously", why: "Ryby nekoušou. Hrozí náraz hlavou na dno nebo kámen." },
    { value: "Mělká voda je nejbezpečnější", why: "Do mělké vody je skok nejnebezpečnější — hlava narazí na dno." },
  ], {
    hints: ["Vidíš z břehu, jak hluboko je dno?", "Z břehu nepoznáš, jestli je voda hluboká a čistá. Co se stane s hlavou, když skočíš a dno je blízko?"],
    explanation: "V neznámé vodě nevidíme dno ani kameny a hloubku špatně odhadneme. Skok do mělké vody může způsobit vážné poranění hlavy a páteře.",
  }),
  choice("Proč se v létě nechodí na slunce bez pokrývky hlavy a krému?", "Hrozí úpal a spálená kůže", [
    { value: "Slunce kůži vždycky prospívá", why: "Trocha slunce je dobrá, ale bez ochrany kůži spálí." },
    { value: "Krém je jen na vůni", why: "Opalovací krém chrání kůži před spálením." },
    { value: "Úpal hrozí jen v zimě", why: "Úpal je od slunce, hrozí v létě." },
  ], {
    hints: ["Co se stane s kůží, když jsi celý den na slunci?", "Kůže zčervená a pálí a hlava bez čepice se přehřeje a začne bolet. Jak se ty dvě potíže jmenují?"],
    explanation: "Silné letní slunce spálí kůži a přehřeje hlavu — hrozí úpal. Pokrývka hlavy, krém, pití a pobyt ve stínu kolem poledne před tím chrání.",
  }),
  choice("Kamarád kýchne do dlaní a pak ti podá ruku. Co se může stát?", "Bacily z jeho rukou se dostanou na tvé", [
    { value: "Nic, bacily jsou jen ve vzduchu", why: "Bacily jsou i na rukou a přenášejí se dotykem." },
    { value: "Nachlazení se nepřenáší", why: "Nachlazení je nakažlivé." },
    { value: "Bude nemocnější jen on", why: "Bacily se přenesou i na tebe." },
  ], {
    hints: ["Kde teď má kamarád bacily z kýchnutí?", "Kapénky zůstaly na jeho dlaních. Co se s nimi stane, když si podáte ruce a ty si pak sáhneš na obličej?"],
    explanation: "Po kýchnutí do dlaní má kamarád bacily na rukou. Podáním ruky se dostanou na tvé a odtud do pusy nebo nosu. Proto se kýchá do lokte.",
  }),
  choice("Proč je zdravější chodit do školy pěšky než se nechat vozit?", "Každý den se protáhneš a pohneš", [
    { value: "Autem je to vždycky pomalejší", why: "Autem to bývá rychlejší. Výhoda chůze je pohyb." },
    { value: "Chůze zkracuje spánek", why: "Chůze spánek nezkracuje, naopak pomáhá lépe usnout." },
    { value: "Pěšky se nikdy nic nestane", why: "I pěšky se musí dávat pozor. Výhoda je pohyb." },
  ], {
    hints: ["Kolik se pohneš, když sedíš v autě?", "Deset minut chůze tam a deset zpátky se za týden sečte na víc než hodinu pohybu. Co to udělá pro tvoje tělo?"],
    explanation: "Cesta pěšky nebo na kole je každodenní pohyb navíc. Posiluje tělo, probudí mozek před vyučováním a do toho méně aut znečišťuje vzduch.",
  }),
  choice("Proč tě po nočním hraní na mobilu ráno bolí hlava a hůř se učíš?", "Mozek si nestihl ve spánku odpočinout", [
    { value: "Mobil vyzařuje bolest hlavy", why: "Mobil bolest hlavy nevyzařuje. Chybí spánek." },
    { value: "Ráno je to tak vždycky", why: "Po dobrém spánku je ráno svěží hlava." },
    { value: "Hraní zlepšuje paměť", why: "Hraní místo spánku paměť zhorší." },
  ], {
    hints: ["Kolik jsi toho v noci naspal?", "Mozek potřebuje v noci odpočívat a ukládat, co se přes den naučil. Co se stane, když místo toho svítí obrazovka?"],
    explanation: "Když místo spánku hraješ, mozek si neodpočine a neuloží, co se naučil. Ráno je unavený, bolí hlava a učení jde hůř.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const STRAVAPOHYBSPANEKPREVENCEURAZUANEMOCI: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-clovek-a-jeho-zdravi-zdravy-zivotni-styl-strava-pohyb-spanek-prevence-urazu-a-nemoci",
    rvpNodeId: "g4-prirodoveda-clovek-a-jeho-zdravi-zdravy-zivotni-styl-strava-pohyb-spanek-prevence-urazu-a-nemoci",
    title: "Strava, pohyb, spánek, prevence úrazů a nemocí",
    studentTitle: "Zdravý životní styl",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Člověk a jeho zdraví",
    briefDescription: "Naučíš se, co je zdravý životní styl a jak pečovat o tělo.",
    keywords: ["strava", "pohyb", "spánek", "hygiena", "vitamíny", "potravinová pyramida", "prevence", "přilba", "očkování"],
    goals: [
      "Popsat potravinovou pyramidu a vysvětlit, co jíme nejvíce a nejméně",
      "Uvést doporučení pro spánek a pohyb pro školáky",
      "Vysvětlit základní hygienická pravidla a jak se šíří nemoci",
      "Popsat, jak předcházet úrazům doma, na silnici a při sportu",
    ],
    boundaries: ["Podrobná výživa a biochemie nejsou náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Zdraví drží čtyři věci: pestré jídlo, pohyb, dost spánku a čisté ruce.",
      steps: [
        "Nejvíc zeleniny, ovoce a obilovin, nejméně sladkostí a tuků.",
        "Pít hlavně vodu, spát 9 až 11 hodin, hýbat se aspoň hodinu denně.",
        "Mýt ruce před jídlem a po záchodě, kýchat do lokte.",
        "Přilba na kole, pás v autě, přechod na silnici.",
      ],
      commonMistake: "Myslet si, že čisté ruce jsou ty, na kterých není vidět špína — bacily vidět nejsou.",
      example: "Jablko a celozrnný rohlík zasytí až do oběda, sladký rohlík jen na chvíli.",
    },
  },
];
