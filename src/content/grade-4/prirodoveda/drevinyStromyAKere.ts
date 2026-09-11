/**
 * Přírodověda 4. ročník — Dřeviny: stromy a keře.
 *
 * Přepsáno 2026-09-11. Předchozí verze neměla nápovědy, vysvětlení ani
 * diagnostiku a obsahovala chyby: „Peyl – pyl“, „Co je dendrology?“,
 * alelopatie, pevně stanovená výška stromu „nad 5 metrů“ jako definice,
 * nápovědu „Borovice → šišky nahoru“ a tvar „chybí mu potravu“.
 *
 * Gradace:
 *  • L1 — poznat strom podle plodu, kůry, jehlic a šišek; strom a keř.
 *  • L2 — proč opadává listí, jak se šíří semena, kde který strom roste,
 *         jak se pozná stáří stromu.
 *  • L3 — souvislosti: smrkové monokultury a kůrovec, letokruhy a počasí,
 *         proč je pod smrky holá zem, jak sojka sází duby.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "./_shared";

const POOL_L1: PracticeTask[] = [
  choice("Jaký plod má dub?", "Žalud", [
    { value: "Šišku", why: "Šišky mají jehličnany, dub je listnatý strom." },
    { value: "Bukvici", why: "Bukvice je plod buku, trojhranný oříšek." },
    { value: "Kaštan", why: "Kaštan je plod jírovce, v ostnaté slupce." },
  ], {
    hints: ["Plody dubu na podzim sbírají veverky a sojky.", "Je to hnědý plod s „čepičkou“, ze kterého si děti dělají panáčky."],
    explanation: "Plodem dubu je žalud s kloboučkem, kterému se říká číška. Žaludy jedí sojky, veverky i divoká prasata.",
  }),
  choice("Jaký plod má buk?", "Bukvici", [
    { value: "Žalud", why: "Žalud je plod dubu." },
    { value: "Šišku", why: "Šišky mají jehličnany. Buk je listnatý strom." },
    { value: "Kaštan", why: "Kaštan je plod jírovce." },
  ], {
    hints: ["Jméno plodu je odvozené od jména stromu.", "Je to malý trojhranný oříšek v ostnaté číšce. Z buku padá na podzim."],
    explanation: "Plodem buku je bukvice — trojhranný oříšek v ostnaté číšce. Bukvice jedí myši, sojky i divoká prasata.",
  }),
  choice("Podle čeho poznáš břízu?", "Bílá kůra s černými skvrnami", [
    { value: "Hladká šedá kůra", why: "Hladkou šedou kůru má buk." },
    { value: "Hrubá rozpraskaná kůra", why: "Hrubou rozpraskanou kůru má starý dub." },
    { value: "Oranžová šupinatá kůra nahoře", why: "Oranžovou kůru v horní části kmene má borovice." },
  ], {
    hints: ["Břízu poznáš i zdálky, i v zimě bez listí.", "Její kmen je světlý jako papír a má na sobě tmavé proužky a skvrny."],
    explanation: "Bříza má bílou kůru s černými skvrnami a proužky, takže ji poznáš i v zimě. Buk má hladkou šedou kůru a dub hrubou rozpraskanou.",
  }),
  choice("Který strom je národním stromem Česka?", "Lípa", [
    { value: "Dub", why: "Dub je vážený strom, ale národním stromem je lípa." },
    { value: "Bříza", why: "Bříza národním stromem není." },
    { value: "Smrk", why: "Smrk je u nás nejrozšířenější, ale národním stromem je lípa." },
  ], {
    hints: ["Z květů tohoto stromu se vaří čaj.", "Má listy ve tvaru srdíčka a v červenci voní medem. Rostla u kostelů a na návsích."],
    explanation: "Národním stromem Česka je lípa. Má srdčité listy, v létě voní a z jejích květů se vaří čaj. Lípa je symbolem Čechů a Slovanů.",
  }),
  choice("Který jehličnan má šišky, které visí dolů?", "Smrk", [
    { value: "Jedle", why: "Jedle má šišky vzpřímené, stojí na větvích nahoru." },
    { value: "Borovice", why: "Borovice má malé šišky, které nevisí dlouze dolů jako u smrku." },
    { value: "Modřín", why: "Modřín má malé šištičky, které stojí na větvičkách." },
  ], {
    hints: ["Je to nejrozšířenější strom českých lesů.", "Jeho dlouhé šišky najdeš pod stromem na zemi celé. Na větvi visí jako ozdoby na vánočním stromku."],
    explanation: "Smrk má dlouhé šišky, které visí dolů, a na zem padají celé. Jedle má šišky vzpřímené a rozpadnou se přímo na stromě.",
  }),
  choice("Který jehličnan na podzim shazuje jehlice?", "Modřín", [
    { value: "Smrk", why: "Smrk má jehlice celou zimu." },
    { value: "Borovice", why: "Borovice je stále zelená." },
    { value: "Jedle", why: "Jedle si jehlice na zimu nechává." },
  ], {
    hints: ["Na podzim tenhle jehličnan zežloutne jako listnatý strom.", "Je to jediný náš jehličnan, který je v zimě holý. Jehlice má měkké a rostou ve svazečcích."],
    explanation: "Modřín je jediný náš jehličnan, který na podzim shazuje jehlice. Předtím zežloutnou a na jaře mu narostou nové.",
  }),
  choice("Který jehličnan má šišky, které stojí na větvích vzpřímeně?", "Jedle", [
    { value: "Smrk", why: "Smrk má šišky, které visí dolů." },
    { value: "Borovice", why: "Borovice má malé šišky, ne vzpřímené jako svíčky." },
    { value: "Modřín", why: "Modřín má drobné šištičky a na zimu shazuje jehlice." },
  ], {
    hints: ["Šišky tohoto stromu vypadají jako svíčky na větvi.", "Tenhle jehličnan má ploché jehlice s dvěma bílými proužky zespodu. Jeho šišky se rozpadnou na stromě."],
    explanation: "Jedle má šišky, které stojí na větvích nahoru jako svíčky a rozpadají se přímo na stromě. Jehlice má ploché, zespodu s bílými proužky.",
  }),
  choice("Který jehličnan má jehlice po dvou ve svazečku?", "Borovice", [
    { value: "Smrk", why: "Smrk má jehlice jednotlivě kolem celé větvičky." },
    { value: "Jedle", why: "Jedle má ploché jehlice jednotlivě ve dvou řadách." },
    { value: "Modřín", why: "Modřín má měkké jehlice po mnoha ve svazečcích." },
  ], {
    hints: ["Utrhni jehličí a podívej se, kolik jehlic vyrůstá z jednoho místa.", "Tenhle strom roste i na suchém písku, má dlouhé jehlice a v horní části kmene oranžovou kůru, která se loupe."],
    explanation: "Borovice lesní má dlouhé jehlice po dvou ve svazečku. Poznáš ji také podle oranžové kůry v horní části kmene.",
  }),
  choice("Jaký je rozdíl mezi stromem a keřem?", "Strom má jeden kmen, keř víc kmínků", [
    { value: "Strom je listnatý, keř jehličnatý", why: "Stromy i keře mohou být listnaté i jehličnaté." },
    { value: "Keř roste jen na zahradě", why: "Keře rostou i v lese, na mezích a u potoků." },
    { value: "Strom kvete, keř nikdy", why: "Keře kvetou taky, třeba šeřík nebo šípková růže." },
  ], {
    hints: ["Podívej se, jak rostou u země.", "Dub vyrůstá z jednoho silného kmene. Líska má od země hned několik tenkých kmínků."],
    explanation: "Strom má jeden hlavní kmen a korunu. Keř se větví už u země a má víc slabších kmínků. Proto je dub strom a líska keř.",
  }),
  choice("Který keř má na jaře voňavé fialové nebo bílé květy?", "Šeřík", [
    { value: "Bez černý", why: "Bez černý kvete bílými plochými okolíky, fialový není." },
    { value: "Líska", why: "Líska kvete brzy na jaře žlutými jehnědami." },
    { value: "Hloh", why: "Hloh kvete bíle, ale fialové květy nemá." },
  ], {
    hints: ["Jeho květy tvoří velké hrozny a v květnu krásně voní.", "Bývá na zahradách a u plotů. Kvete fialově nebo bíle a lidé si ho dávají do váz."],
    explanation: "Šeřík kvete v květnu voňavými fialovými nebo bílými hrozny květů. Často roste na zahradách a u plotů.",
  }),
  choice("Který keř má černé drobné bobule v plochých okolících?", "Bez černý", [
    { value: "Šeřík", why: "Šeřík bobule nemá, plodem jsou suché tobolky." },
    { value: "Rybíz", why: "Rybíz má bobule v hroznech, ne v plochých okolících." },
    { value: "Líska", why: "Líska má oříšky, ne bobule." },
  ], {
    hints: ["Jeho bílé květy voní a dělá se z nich sirup.", "Na podzim jsou na něm těžké převislé okolíky černých bobulek. Jméno má podle barvy plodů."],
    explanation: "Bez černý má na jaře bílé voňavé okolíky, ze kterých se dělá sirup, a na podzim černé bobule. Syrové se nejedí, jen tepelně upravené.",
  }),
  choice("Který keř dává jedlé bobule a pěstuje se na zahradách?", "Rybíz", [
    { value: "Zimolez", why: "Plody zimolezu v přírodě jsou jedovaté." },
    { value: "Tis", why: "Tis je jedovatý." },
    { value: "Šeřík", why: "Šeřík jedlé plody nemá." },
  ], {
    hints: ["Jeho plody jsou červené, černé nebo bílé a rostou v hroznech.", "V létě se z něj trhají kyselé bobulky na koláče, šťávu a džem. Roste skoro na každé zahradě vedle angreštu."],
    explanation: "Rybíz je zahradní keř s bobulemi v hroznech — červenými, černými nebo bílými. Dělá se z nich džem a šťáva.",
  }),
  choice("Jaký plod má jírovec, kterému říkáme kaštan?", "Hnědá semena v ostnaté slupce", [
    { value: "Žalud s číškou", why: "Žalud má dub." },
    { value: "Oříšek v zelené slupce", why: "Oříšky má líska." },
    { value: "Šišku", why: "Šišky mají jehličnany." },
  ], {
    hints: ["Na podzim je děti sbírají v parcích a dělají z nich zvířátka.", "Lesklé kuličky jsou schované v zeleném obalu s bodlinami, který při dopadu na zem praskne."],
    explanation: "Jírovec, lidově kaštan, má lesklá hnědá semena v zelené ostnaté slupce. Pro lidi jedlá nejsou, zvěř je v zimě jí.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Čím se liší listnatý strom od jehličnatého?", "Listnatý má listy, jehličnatý jehlice", [
    { value: "Listnatý má vždy větší plody", why: "Velikost plodů je rozdílná u různých stromů. Rozdíl je v listech." },
    { value: "Jehličnatý na zimu opadá", why: "Jehličnany na zimu většinou neopadají, výjimkou je modřín." },
    { value: "Listnatý roste jen v teple", why: "Listnaté stromy rostou u nás i na horách." },
  ], {
    hints: ["Podívej se na větvičku dubu a smrku.", "Jeden má široké ploché listy, druhý úzké a tuhé jehlice. Podle toho mají jméno."],
    explanation: "Listnaté stromy mají široké ploché listy, na podzim je většinou shazují. Jehličnaté mají úzké jehlice, které jim většinou vydrží přes zimu.",
  }),
  choice("Proč je tis nebezpečný?", "Skoro celý je jedovatý", [
    { value: "Má ostré trny", why: "Tis trny nemá. Nebezpečí je v tom, že je jedovatý." },
    { value: "Snadno se zlomí a spadne", why: "Tis má pevné a pružné dřevo. Nebezpečný je jed." },
    { value: "Nebezpečný není", why: "Tis je velmi jedovatý, i pro zvířata." },
  ], {
    hints: ["Tis roste v parcích a má červené plody. Proč se nesmí ochutnávat?", "Jehlice, kůra i semeno uvnitř červeného plodu obsahují látku, která otráví člověka i koně."],
    explanation: "Tis je jedovatý téměř celý — jehlice, kůra i semena. Jedovatá není jen červená dužina kolem semene, ale ani tu se ochutnávat nevyplatí.",
  }),
  choice("Proč modřín na podzim shazuje jehlice?", "Tak v zimě šetří vodu", [
    { value: "Modřín je nemocný", why: "Je to přirozené, modřín je zdravý." },
    { value: "Modřín je ve skutečnosti listnatý strom", why: "Modřín je jehličnan, jen opadavý." },
    { value: "Jehlice mu spálí slunce", why: "Slunce jehlice nespálí. Shazuje je každý podzim sám." },
  ], {
    hints: ["Proč na podzim shazují listí listnaté stromy?", "V zamrzlé půdě kořeny vodu nedostanou, ale z jehlic by se voda vypařovala dál. Co se tedy vyplatí?"],
    explanation: "V zimě je půda zmrzlá a kořeny nemohou nasát vodu. Modřín proto jehlice shodí, aby jimi vodu neztrácel. Na jaře mu narostou nové.",
  }),
  choice("Proč listnaté stromy na podzim shazují listí?", "V zimě by listy ztrácely vodu", [
    { value: "Listy jsou staré a ošklivé", why: "Nejde o vzhled. Strom tak šetří vodu." },
    { value: "Listí shodí vítr", why: "Vítr pomůže, ale strom listy odhazuje sám." },
    { value: "Aby se zahřály kořeny", why: "Listí trochu kořeny přikryje, ale hlavní důvod je voda." },
  ], {
    hints: ["Z listů se pořád vypařuje voda. Kde ji strom vezme, když je zem zmrzlá?", "V zimě kořeny ze zmrzlé půdy vodu nedostanou. Strom proto zbaví se části, kudy by ji ztrácel."],
    explanation: "Listy vypařují hodně vody. V zimě je půda zmrzlá a kořeny vodu nedostanou, a tak strom listy shodí, aby nevyschl. Na jaře vyraší nové z pupenů.",
  }),
  choice("Jak se šíří plody javoru?", "Křidélka se točí a nese je vítr", [
    { value: "Sezobou je ptáci", why: "Javorové nažky ptáci nesezobou. Nese je vítr." },
    { value: "Odnesou je mravenci", why: "Mravenci je neroznášejí." },
    { value: "Odplavou po vodě", why: "Javorové plody letí vzduchem, ne po vodě." },
  ], {
    hints: ["Jak padá javorový plod ze stromu?", "Dva plody s křidélky se při pádu točí jako vrtulka helikoptéry. Co je odnese daleko od stromu?"],
    explanation: "Javor má plody s křidélky. Při pádu se točí jako vrtulka a vítr je odnese daleko od stromu.",
  }),
  choice("Jak rozeznáš smrk od jedle?", "Smrk má šišky dolů, jedle nahoru", [
    { value: "Smrk má šišky nahoru, jedle dolů", why: "Je to naopak. Smrkové šišky visí, jedlové stojí." },
    { value: "Smrk je listnatý strom", why: "Smrk i jedle jsou jehličnany." },
    { value: "Od sebe se rozlišit nedají", why: "Dají, podle šišek a jehlic." },
  ], {
    hints: ["Podívej se na šišky na větvích.", "Smrkové šišky visí jako ozdoby na vánočním stromku. Jedlové stojí jako svíčky."],
    explanation: "Smrk má šišky, které visí dolů, a pichlavé jehlice. Jedle má šišky vzpřímené a ploché jehlice s bílými proužky zespodu.",
  }),
  choice("Co je angrešt?", "Keř s trny a jedlými plody", [
    { value: "Druh jehličnanu", why: "Angrešt není jehličnan, má listy." },
    { value: "Plevel na loukách", why: "Angrešt se pěstuje na zahradách, není to plevel." },
    { value: "Druh dubu", why: "Angrešt je keř, ne strom." },
  ], {
    hints: ["Roste na zahradách vedle rybízu.", "Má trny a velké zelené nebo červené bobule, které se trhají v létě."],
    explanation: "Angrešt je zahradní keř s trny. Jeho bobule jsou zelené, žluté nebo červené a jedí se čerstvé i v kompotu.",
  }),
  choice("Jak se dá zjistit, kolik let bylo pokácenému stromu?", "Spočítáš letokruhy na pařezu", [
    { value: "Změříš jeho výšku", why: "Výška stáří neurčí. Stromy rostou různě rychle." },
    { value: "Spočítáš jeho větve", why: "Počet větví stáří neukáže." },
    { value: "Podle barvy listí", why: "Barva listí se mění s ročním obdobím, ne se stářím." },
  ], {
    hints: ["Na pařezu uvidíš kroužky.", "Každý rok strom přiroste o jeden kruh dřeva. Co tedy musíš na pařezu udělat?"],
    explanation: "Strom každý rok přiroste o jeden letokruh. Když je spočítáš na pařezu, víš, kolik let strom rostl.",
  }),
  choice("Který strom dobře roste i na suchém písku?", "Borovice", [
    { value: "Olše", why: "Olše potřebuje hodně vody, roste u potoků." },
    { value: "Vrba", why: "Vrba roste u vody." },
    { value: "Smrk", why: "Smrk potřebuje vlhčí a chladnější místa." },
  ], {
    hints: ["Hledej nenáročný jehličnan.", "Tenhle strom má jehlice po dvou a hluboké kořeny, takže mu stačí i chudý písek."],
    explanation: "Borovice je nenáročná, má hluboké kořeny a roste i na suchém písku. Olše a vrby potřebují vodu, smrk vlhčí a chladnější místa.",
  }),
  choice("Který strom roste nejčastěji u potoků a řek?", "Vrba", [
    { value: "Borovice", why: "Borovice roste spíš na suchých místech." },
    { value: "Buk", why: "Buk nemá rád podmáčenou půdu." },
    { value: "Modřín", why: "Modřín roste spíš na horách a ve světlých lesích." },
  ], {
    hints: ["Z jejích proutků se pletou košíky.", "Její větve se často sklánějí nad vodu a na jaře kvete „kočičkami“."],
    explanation: "Vrba miluje vodu a roste u potoků a řek. Na jaře kvete kočičkami a z jejích pružných proutků se pletou košíky.",
  }),
  choice("Z čeho se dělá lipový čaj?", "Ze sušených lipových květů", [
    { value: "Z lipových listů", why: "Čaj se dělá z květů, ne z listů." },
    { value: "Z lipové kůry", why: "Kůra se na čaj nepoužívá." },
    { value: "Z lipových semen", why: "Semena se na čaj nepoužívají." },
  ], {
    hints: ["Kdy lípa v létě voní medem?", "V červnu a červenci se trhají voňavé žlutavé kvítky, suší se a pak se z nich vaří čaj na nachlazení."],
    explanation: "Lipový čaj se vaří ze sušených květů lípy. Trhají se v létě, když lípa kvete a voní medem. Pomáhá při nachlazení.",
  }),
  choice("Proč jehličnany nemusí na zimu shazovat jehlice?", "Úzké jehlice s voskem ztrácejí málo vody", [
    { value: "Jehlice nevypařují žádnou vodu", why: "Vypařují, ale mnohem méně než široké listy." },
    { value: "V zimě jim nevadí sucho", why: "Sucho vadí i jim, ale jehlice ho vydrží." },
    { value: "Mráz jehlicím neublíží, protože jsou teplé", why: "Jehlice nejsou teplé. Jsou úzké a mají voskový povlak." },
  ], {
    hints: ["Srovnej široký list buku a úzkou jehlici smrku.", "Jehlice jsou tenké a pokryté voskem, takže se z nich vypaří jen trocha vody. Proč je tedy nemusí shazovat?"],
    explanation: "Jehlice jsou úzké a pokryté voskovou vrstvou, a tak z nich uniká málo vody. Stromy si je mohou nechat přes zimu. Výjimkou je modřín.",
  }),
  choice("Který keř roste na mezích a v zimě na něm zůstávají červené plody?", "Šípková růže", [
    { value: "Bez černý", why: "Bez černý má černé bobule a ptáci je sezobou už na podzim." },
    { value: "Líska", why: "Líska má oříšky, ne červené plody." },
    { value: "Šeřík", why: "Šeřík má suché tobolky, ne červené plody." },
  ], {
    hints: ["Z jeho plodů se vaří čaj plný vitamínu C.", "Keř má ostny a jeho červené podlouhlé plody se jmenují podle ostnů. V zimě je jedí ptáci."],
    explanation: "Šípková růže roste na mezích a okrajích lesů. Její červené plody — šípky — zůstávají na keři i v zimě. Vaří se z nich čaj s vitamínem C.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Proč jsou lesy jen ze smrků problémem?", "Snadno je zničí kůrovec a vichřice", [
    { value: "Smrk u nás vůbec neroste", why: "Smrk u nás roste, ale ne všude se mu daří." },
    { value: "Smrky jsou moc nízké", why: "Výška nevadí. Vadí, že je tam jen jeden druh." },
    { value: "Smrkové lesy jsou odolnější", why: "Je to naopak, smíšené lesy jsou odolnější." },
  ], {
    hints: ["Co se stane, když přijde škůdce, který napadá jen smrky?", "Kůrovec se v lese plném smrků šíří ze stromu na strom. A mělké kořeny smrků vichřice snadno vyvrátí."],
    explanation: "V lese z jediného druhu se škůdce jako kůrovec šíří bez zábran. Smrky mají mělké kořeny, takže je vyvrátí vítr. Smíšený les je mnohem odolnější.",
  }),
  choice("Proč jsou některé letokruhy široké a jiné úzké?", "Široké rostou v deštivém a teplém roce", [
    { value: "Široké jsou z mládí, úzké ze stáří", why: "Šířka se mění i u dospělého stromu podle počasí v daném roce." },
    { value: "Úzké vznikají v zimě", why: "V zimě strom neroste. Každý letokruh je z celého roku." },
    { value: "Šířka je náhodná", why: "Šířka odpovídá tomu, jak se stromu v daném roce dařilo." },
  ], {
    hints: ["Kdy strom roste nejlépe?", "V roce s dostatkem vody a tepla strom přiroste hodně, v suchém roce málo. Jak se to projeví na letokruzích?"],
    explanation: "Když má strom v roce dost vody a tepla, přiroste hodně a letokruh je široký. V suchém nebo chladném roce je úzký. Letokruhy tak prozradí počasí minulých let.",
  }),
  choice("Proč jsou stromy na horských hřebenech nízké a pokroucené?", "Silný vítr, mráz a krátké léto", [
    { value: "Někdo je pořád ořezává", why: "Stromy na hřebenech nikdo neořezává. Formuje je počasí." },
    { value: "Na horách je moc světla", why: "Světla je dost, ale vítr a mráz jim nedovolí vyrůst." },
    { value: "Jsou to mladé stromky", why: "Často jsou to staré stromy, jen rostou pomalu." },
  ], {
    hints: ["Jaké počasí je na vrcholcích hor?", "Nahoře to hodně fouká, dlouho leží sníh a teplých dnů je málo. Co to udělá s růstem stromu?"],
    explanation: "Na hřebenech hor fouká silný vítr, dlouho mrzne a léto je krátké. Stromy tam rostou pomalu, zůstávají nízké a vítr je pokroutí. Nad nimi roste jen kleč.",
  }),
  choice("Proč jsou staré duby tak cenné pro přírodu?", "V dutinách hnízdí ptáci a žije v nich hmyz", [
    { value: "Dají nejvíc palivového dřeva", why: "Nejde o dřevo na topení. Starý dub je domov mnoha druhů." },
    { value: "Mladé duby jsou jedovaté", why: "Mladé duby jedovaté nejsou." },
    { value: "Staré duby nemají žádnou cenu", why: "Mají velkou cenu — žijí na nich stovky druhů." },
  ], {
    hints: ["Co najdeš ve starém stromě, co mladý nemá?", "Starý dub má dutiny, suché větve a rozpraskanou kůru. Kdo se v tom všem schová a najde potravu?"],
    explanation: "Na starém dubu žijí stovky druhů hmyzu, v dutinách hnízdí sovy, datli i netopýři a na kůře rostou lišejníky. Proto se staré stromy chrání.",
  }),
  choice("Jak se les sám obnoví na vykácené pasece?", "Nejdřív byliny, pak keře a nakonec stromy", [
    { value: "Hned vyrostou vysoké stromy", why: "Stromy potřebují desítky let. Nejdřív přijdou rychlejší rostliny." },
    { value: "Bez vysazení tam nic nevyroste", why: "Příroda si poradí i sama, jen pomaleji." },
    { value: "Vyrostou jen jehličnany", why: "Na pasece se objeví mnoho druhů, nejdřív byliny a keře." },
  ], {
    hints: ["Která rostlina vyroste nejrychleji?", "Za rok zaroste paseka trávou a kopřivami, pak přijdou maliny a keře a v jejich stínu začnou růst stromky."],
    explanation: "Na pasece nejdřív vyrostou byliny, pak keře jako malina, bez nebo bříza a nakonec stromy. Za desítky let tam může zase stát les.",
  }),
  choice("Proč v létě ulice se stromy chladí víc než ulice bez nich?", "Stromy dávají stín a vypařují vodu", [
    { value: "Stromy vyrábějí led", why: "Stromy led nevyrábějí. Chladí stínem a vypařováním vody." },
    { value: "Stromy odhánějí slunce", why: "Slunce neodženou, jen zachytí jeho paprsky." },
    { value: "Stromy vyrábějí vítr", why: "Stromy vítr nevyrábějí." },
  ], {
    hints: ["Kde bys v horkém dni raději stál — u stromu, nebo na asfaltu?", "Koruna zachytí sluneční paprsky a z listů se vypařuje voda, která okolí ochladí jako pot tělo."],
    explanation: "Koruna stromu vrhá stín a z listů se vypařuje voda, která okolí ochlazuje. Proto je v ulici se stromy v létě o několik stupňů chladněji.",
  }),
  choice("Proč pod hustými smrky skoro nic neroste?", "Je tam tma a kyselé jehličí", [
    { value: "Smrky vypijí všechen vzduch", why: "Smrky vzduch nevypijí. Chybí světlo." },
    { value: "Pod smrky je moc teplo", why: "Pod smrky je naopak chladno a stín." },
    { value: "Srnci tam všechno sežerou", why: "Srnci okusují, ale hlavní příčina je tma." },
  ], {
    hints: ["Kolik světla projde hustou smrkovou korunou?", "Pod smrky je stín po celý rok a zem pokrývá vrstva jehličí, ve kterém se většině bylin nedaří."],
    explanation: "Husté smrky nepropustí skoro žádné světlo a po celý rok stíní. Spadané jehličí okyseluje půdu. Proto pod nimi roste jen málo rostlin.",
  }),
  choice("Proč se listy na podzim barví dožluta a dočervena?", "Strom z nich odebere zelené barvivo", [
    { value: "Listy obarví mráz", why: "Barvy se objeví i bez mrazu. Strom odebírá zelené barvivo." },
    { value: "Listy obarví slunce", why: "Slunce listy nebarví. Zelená z nich mizí." },
    { value: "Listy jsou nemocné", why: "Je to přirozené, stromy nejsou nemocné." },
  ], {
    hints: ["Proč jsou listy v létě zelené?", "Zelené barvivo zakrývá v listu i jiné barvy. Když ho strom na podzim odebere, co zůstane vidět?"],
    explanation: "Listy jsou zelené díky zelenému barvivu. Na podzim ho strom z listů odebere a uschová si živiny. Pak se objeví žluté a červené barvy, které byly v listu schované.",
  }),
  choice("Jak se šíří plody lípy?", "Točí se na listenu a nese je vítr", [
    { value: "Sezobou je ptáci na podzim", why: "Lipové plody ptáci neroznášejí." },
    { value: "Plavou po vodě do řeky", why: "Lipové plody nese vítr, ne voda." },
    { value: "Přilepí se zvířatům na srst", why: "Nemají háčky, na srst se nepřilepí." },
  ], {
    hints: ["Na co je přirostlá stopka s kuličkami lipových plodů?", "Kuličky visí na úzkém světlém lístku. Když spadnou, lístek se točí a vítr je unese dál."],
    explanation: "Plody lípy visí na úzkém světlém listenu, který funguje jako vrtulka. Při pádu se točí a vítr je odnese od stromu.",
  }),
  choice("Sojka na podzim zahrabává žaludy. Jak tím pomáhá dubům?", "Ze zapomenutých žaludů vyrostou nové duby", [
    { value: "Chrání žaludy před mrazem pro sebe", why: "Sojka si je schovává pro sebe, ale na mnoho zapomene." },
    { value: "Žaludy tím zničí", why: "Zahrabané žaludy naopak vyklíčí." },
    { value: "Nijak nepomáhá", why: "Pomáhá — roznáší žaludy daleko od stromu." },
  ], {
    hints: ["Najde sojka všechny žaludy, které schovala?", "Sojka zahrabe na podzim tisíce žaludů. Co udělají ty, na které zapomene, na jaře?"],
    explanation: "Sojka schová na podzim spoustu žaludů do země a na mnoho zapomene. Ty na jaře vyklíčí a vyrostou z nich nové duby, často daleko od původního stromu.",
  }),
  choice("Modřín vypadá v zimě jako uschlý. Co se s ním stane na jaře?", "Narostou mu nové jehlice", [
    { value: "Musí se pokácet", why: "Modřín neuschl, jen shodil jehlice." },
    { value: "Zůstane holý navždy", why: "Na jaře obroste novými jehlicemi." },
    { value: "Změní se v listnatý strom", why: "Modřín zůstává jehličnanem, jen opadavým." },
  ], {
    hints: ["Proč modřín na podzim zežloutl?", "Modřín je jediný opadavý jehličnan. Co mu na jaře vyroste z pupenů, podobně jako listy buku?"],
    explanation: "Modřín na podzim shodí jehlice, a v zimě tak vypadá uschle. Na jaře mu z pupenů vyrostou nové, jasně zelené jehlice.",
  }),
  choice("Tis v parku má červené plody. Proč je nesmíš ochutnat?", "Semeno uvnitř je jedovaté", [
    { value: "Plody jsou kyselé", why: "Nejde o chuť. Semeno uvnitř je jedovaté." },
    { value: "Plody jsou chráněné", why: "Důvodem je jed, ne ochrana." },
    { value: "Klidně je ochutnat můžeš", why: "Nemůžeš, semeno i jehlice tisu jsou jedovaté." },
  ], {
    hints: ["Co je schované uprostřed červeného plodu?", "Červená dužina láká ptáky, ale to, co je schované uprostřed, i jehlice tisu obsahují silný jed."],
    explanation: "Červená dužina tisu jedovatá není, ale semeno uvnitř ano — stejně jako jehlice a kůra. Proto se plody tisu nikdy nejedí.",
  }),
  choice("Proč keře na okraji lesa les chrání?", "Brzdí vítr, který by vyvracel stromy", [
    { value: "Lákají turisty dovnitř", why: "Turisty keře spíš zdrží. Chrání les před větrem." },
    { value: "Vyrábějí vodu pro les", why: "Keře vodu nevyrábějí. Chrání les před větrem a vysycháním." },
    { value: "Nijak nechrání", why: "Chrání — zbrzdí vítr a slunce." },
  ], {
    hints: ["Co udělá silný vítr, když narazí na hustou stěnu keřů?", "Keře na kraji lesa fungují jako plot. Vítr se o ně zbrzdí a do lesa nepronikne tak silný."],
    explanation: "Pás keřů na okraji lesa zbrzdí vítr, takže nevyvrací stromy, a stíní, aby les nevysychal. Navíc v něm hnízdí ptáci.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const DREVINYSTROMYAKERE: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-dreviny-stromy-a-kere",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-dreviny-stromy-a-kere",
    title: "Dřeviny - stromy a keře",
    studentTitle: "Stromy a keře",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš listnaté a jehličnaté stromy a naučíš se rozeznávat keře v přírodě.",
    keywords: ["strom", "keř", "dub", "buk", "bříza", "lípa", "smrk", "borovice", "jedle", "modřín", "šeřík", "bez"],
    goals: [
      "Rozlišit strom a keř",
      "Poznat typické listnaté a jehličnaté stromy podle plodů, kůry, jehlic a šišek",
      "Uvést příklady keřů a jejich plodů",
      "Vysvětlit, proč stromy na podzim shazují listí a proč je modřín zvláštní jehličnan",
    ],
    boundaries: ["Podrobná botanická systematika není náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Strom poznáš podle plodu, kůry, listů nebo jehlic a šišek.",
      steps: [
        "Dub → žalud, buk → bukvice, jírovec → kaštan, lípa → srdčité listy.",
        "Smrk → šišky visí, jedle → šišky stojí, borovice → jehlice po dvou.",
        "Modřín je jediný jehličnan, který na podzim shazuje jehlice.",
        "Strom má jeden kmen, keř víc kmínků od země.",
      ],
      commonMistake: "Modřín je jehličnan, i když na zimu opadá — nezaměňuj ho s listnatým stromem.",
      example: "Smrk má šišky visící dolů, jedle má šišky stojící vzpřímeně na větvích.",
    },
  },
];
