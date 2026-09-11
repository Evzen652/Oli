/**
 * Přírodověda 4. ročník — Půda: vznik, složení, význam pro život.
 *
 * Přepsáno 2026-09-11. Původní pool neměl u úloh nápovědu, vysvětlení ani
 * diagnostiku a v L2/L3 zabíhal daleko za 4. ročník: mykorhiza,
 * bioakumulace, bioindikátory, pH půdy, „ledničky biodiversity",
 * klimatická změna.
 *
 * Gradace:
 *  • L1 — pojmy a fakta: z čeho půda vzniká, humus, eroze, zvětrávání.
 *  • L2 — použití: jak se liší půdy, co pomáhá úrodnosti, co se děje po dešti.
 *  • L3 — příčiny a důsledky: proč je eroze vážná, proč orat napříč svahem,
 *         co udělá beton nebo mráz v puklině kamene.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "./_shared";

const POOL_L1: PracticeTask[] = [
  choice("Z čeho půda vzniká?", "Z rozpadlých hornin a zbytků rostlin a živočichů", [
    { value: "Jen z písku, který nanese vítr", why: "Vítr písek přenáší, ale půda vzniká hlavně rozpadem hornin na místě a tlením zbytků." },
    { value: "Ze zmrzlé vody a ledu", why: "Mráz pomáhá horniny rozbíjet, ale sám led půdou není." },
    { value: "Z kořenů stromů", why: "Kořeny půdu drží a po odumření zetlí, ale samy půdu nevytvoří." },
  ], {
    hints: ["Půda má dvě části: jednu z kamene a druhou z něčeho, co kdysi žilo.", "Skály se po staletí drolí na drobné kousky a spadané listí a uhynulá zvířata tlejí. Co z toho vznikne, když se to promíchá?"],
    explanation: "Půda vzniká dvěma ději zároveň: horniny se rozpadají na drobné částečky a zbytky rostlin a živočichů tlejí na humus. Obojí se promíchá a trvá to stovky let.",
  }),
  choice("Jak se jmenuje tmavá část půdy, která vzniká z odumřelých rostlin a živočichů?", "Humus", [
    { value: "Jíl", why: "Jíl je minerální část půdy z rozpadlých hornin, ne ze zbytků organismů." },
    { value: "Písek", why: "Písek jsou drobné zrnka hornin. Z odumřelých organismů nevzniká." },
    { value: "Štěrk", why: "Štěrk jsou kamínky z hornin." },
  ], {
    hints: ["Hledej jediné slovo, které nepopisuje kousky kamene.", "Tahle tmavá vrstva vzniká z tlejícího listí a dělá půdu úrodnou. Jak se jmenuje?"],
    explanation: "Humus vzniká tlením odumřelých rostlin a živočichů. Je tmavý, drží vodu a obsahuje živiny. Jíl, písek a štěrk jsou minerální části z rozpadlých hornin.",
  }),
  choice("Který živočich hrabe v půdě chodbičky a tím ji provzdušňuje?", "Žížala", [
    { value: "Slimák", why: "Slimák leze po povrchu a žere listy, chodbičky v půdě nehrabe." },
    { value: "Motýl", why: "Motýl létá a saje nektar, v půdě nežije." },
    { value: "Vážka", why: "Vážka žije u vody a loví za letu." },
  ], {
    hints: ["Po dešti ji najdeš na chodníku.", "Tenhle živočich nemá nohy, je dlouhý a růžový a celý život se prokousává zemí."],
    explanation: "Žížala se prokousává půdou a nechává za sebou chodbičky, kterými do země proniká vzduch a voda. Přitom polyká zbytky listí a mění je na úrodnou půdu.",
  }),
  choice("Jakou barvu mívá půda, ve které je hodně humusu?", "Tmavě hnědou až černou", [
    { value: "Světle žlutou", why: "Světlá žlutá bývá písčitá půda, humusu v ní je málo." },
    { value: "Bílou", why: "Bílá bývá hornina, třeba vápenec. Humus je tmavý." },
    { value: "Cihlově červenou", why: "Červenou barvu dávají půdě některé minerály, ne humus." },
  ], {
    hints: ["Humus vzniká z tlejícího listí. Jakou barvu mají staré mokré listy?", "Nejúrodnější česká půda se jmenuje podle své barvy — černozem. Co to napovídá o barvě půdy plné humusu?"],
    explanation: "Humus je tmavý, a čím víc ho v půdě je, tím je tmavší. Proto je nejúrodnější česká půda černozem skoro černá.",
  }),
  choice("Co berou kořeny rostlin z půdy?", "Vodu a živiny", [
    { value: "Světlo", why: "Světlo zachycují listy, v půdě je tma." },
    { value: "Sníh", why: "Sníh roztaje a jako voda se vsákne. Kořeny berou vodu, ne sníh." },
    { value: "Kamínky", why: "Kamínky kořeny obrůstají, ale nepřijímají je." },
  ], {
    hints: ["Co dáváš do květináče, když zaléváš?", "Rostlina potřebuje pít a také se živit. Obojí jí přivádějí kořeny ze země."],
    explanation: "Kořeny nasávají z půdy vodu a v ní rozpuštěné živiny. Zároveň rostlinu v zemi pevně drží. Světlo zachycují listy.",
  }),
  choice("Jak se jmenuje rozpadání hornin vlivem mrazu, vody a slunce?", "Zvětrávání", [
    { value: "Eroze", why: "Eroze je odnášení půdy vodou nebo větrem, ne rozpadání horniny na místě." },
    { value: "Tlení", why: "Tlení je rozklad odumřelých rostlin a živočichů, ne hornin." },
    { value: "Sopečný výbuch", why: "Sopka horninu vytváří, ne pomalu rozpadá." },
  ], {
    hints: ["Hledej slovo, které souvisí s počasím.", "Déšť, mráz, horko a vítr po staletí drolí skály. Tomu ději se říká podle slova „vítr“ a „počasí“."],
    explanation: "Zvětrávání je pomalé rozpadání hornin. Voda zateče do puklin, zmrzne a kámen roztrhne, slunce ho střídavě ohřívá a ochlazuje. Z úlomků pak vzniká půda.",
  }),
  choice("Co je eroze půdy?", "Odnášení půdy vodou nebo větrem", [
    { value: "Vznik nové půdy", why: "Nová půda vzniká zvětráváním a tlením. Eroze půdu naopak ubírá." },
    { value: "Promrznutí půdy v zimě", why: "Promrznutí erozí není. Eroze je odnášení půdy." },
    { value: "Hnojení půdy kompostem", why: "Hnojení půdu zlepšuje. Eroze ji ničí." },
  ], {
    hints: ["Eroze půdě škodí.", "Po prudkém dešti teče z pole hnědá voda a na silnici zůstane bláto. Co se s půdou stalo?"],
    explanation: "Eroze je odnášení půdy. Voda ji smývá ze svahů, vítr ji odfoukává z holých polí. Nejvíc ohrožená je půda, kterou nechrání rostliny.",
  }),
  choice("Jak dlouho trvá, než vznikne vrstva půdy silná jeden centimetr?", "Stovky let", [
    { value: "Jeden týden", why: "Za týden se rozloží nanejvýš pár listů. Půda vzniká mnohem pomaleji." },
    { value: "Jeden rok", why: "Za rok vznikne jen nepatrná vrstvička. Na centimetr je potřeba staletí." },
    { value: "Deset let", why: "Ani deset let nestačí. Jeden centimetr půdy vzniká stovky let." },
  ], {
    hints: ["Zvětrávání skal je velmi pomalé.", "Kámen se drolí tak pomalu, že změnu za život člověka skoro nepoznáš. Počítej spíš na staletí, nebo na roky?"],
    explanation: "Jeden centimetr půdy vzniká stovky let, protože horniny zvětrávají velmi pomalu. Proto je každá odnesená vrstva půdy tak velká ztráta.",
  }),
  choice("Která půda je v Česku nejúrodnější?", "Černozem", [
    { value: "Písčitá půda", why: "Písčitá půda propouští vodu a má málo živin, úrodná není." },
    { value: "Kamenitá horská půda", why: "Horská půda je tenká a kamenitá, úrodná není." },
    { value: "Jílovitá půda", why: "Jílovitá půda je těžká a drží moc vody, na úrodnost černozemě nemá." },
  ], {
    hints: ["Nejúrodnější půda má nejvíc humusu, a tedy nejtmavší barvu.", "Jméno té půdy prozrazuje její barvu. Najdeš ji hlavně na teplé jižní Moravě."],
    explanation: "Černozem má nejvíc humusu, je tmavá, drží vodu a má dost živin. Proto je nejúrodnější. U nás je hlavně na jižní Moravě a v Polabí.",
  }),
  choice("Která z těchto věcí je minerální částí půdy?", "Písek", [
    { value: "Humus", why: "Humus vzniká z odumřelých organismů. Minerální části jsou z hornin." },
    { value: "Tlející listí", why: "Listí je zbytek rostlin, z něj vzniká humus. Minerální části jsou z hornin." },
    { value: "Žížala", why: "Žížala je živočich, který v půdě žije. Minerální částí půdy není." },
  ], {
    hints: ["Minerální znamená z kamene.", "Tři věci z nabídky kdysi žily nebo žijí. Jedna vznikla rozpadem skály."],
    explanation: "Písek jsou drobná zrnka rozpadlých hornin, tedy minerální část půdy. Humus a tlející listí jsou část z organismů a žížala je živočich, který v půdě žije.",
  }),
  choice("Kdo v půdě rozkládá odumřelé listí na humus?", "Houby a bakterie", [
    { value: "Kořeny stromů", why: "Kořeny berou z půdy vodu a živiny, listí nerozkládají." },
    { value: "Krtci", why: "Krtek loví v půdě žížaly a larvy, listí nerozkládá." },
    { value: "Déšť", why: "Déšť listí zvlhčí a tím rozklad urychlí, ale rozkládají ho živé organismy." },
  ], {
    hints: ["Rozkladači jsou živé organismy, i když některé ani nevidíš.", "Na tlejícím dřevě a listí vyrůstá plíseň a to, co v lese sbíráš do košíku. A ještě menší organismy uvidíš jen mikroskopem."],
    explanation: "Odumřelé listí rozkládají houby a bakterie, pomáhají jim žížaly a drobní živočichové. Z listí tak vznikne humus a živiny se vrátí do půdy.",
  }),
  choice("Čím se na poli půda před setím obrací a kypří?", "Pluhem", [
    { value: "Kombajnem", why: "Kombajn sklízí obilí, půdu neobrací." },
    { value: "Postřikovačem", why: "Postřikovač rozstřikuje kapaliny na rostliny, půdu neobrací." },
    { value: "Válcem", why: "Válec půdu uhlazuje a utlačuje, neobrací ji." },
  ], {
    hints: ["Hledej nástroj, který se táhne za traktorem a dělá brázdy.", "Tímhle nástrojem se orá. Železné radlice obracejí svrchní vrstvu půdy, aby byla kyprá a zmizel plevel."],
    explanation: "Pluh obrací a kypří půdu, dělá brázdy. Do kypré půdy se dostane vzduch a voda a semena v ní dobře vzejdou.",
  }),
  choice("Proč je půda důležitá pro člověka?", "Roste v ní většina našeho jídla", [
    { value: "Vyrábí kyslík, který dýcháme", why: "Kyslík vyrábějí rostliny v listech, ne půda." },
    { value: "Dává nám světlo", why: "Světlo dává Slunce." },
    { value: "Chrání nás před deštěm", why: "Před deštěm nás chrání střecha. Půda nás živí." },
  ], {
    hints: ["Co roste na polích a zahradách?", "Obilí, zelenina, ovoce i tráva pro krávy — kde to všechno roste?"],
    explanation: "Na půdě rostou obilí, zelenina, ovoce i píce pro zvířata. Bez úrodné půdy by lidé neměli co jíst.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Proč je humus pro rostliny cenný?", "Obsahuje živiny a drží vodu", [
    { value: "Je tvrdý a kořeny se o něj opřou", why: "Humus je měkký a drobivý, oporu kořenům nedává tvrdost." },
    { value: "Odpuzuje škodlivý hmyz", why: "Humus hmyz neodpuzuje. Jeho cena je v živinách a vodě." },
    { value: "Hřeje půdu jako kamna", why: "Humus půdu nehřeje. Pomáhá tím, že dává živiny a drží vlhkost." },
  ], {
    hints: ["Co rostlina potřebuje brát kořeny?", "Humus vzniká z tlejících listů, ve kterých byly živiny. A funguje jako houba, když zaprší."],
    explanation: "Humus obsahuje živiny z rozložených rostlin a živočichů a nasává vodu jako houba. Kořeny tak mají z čeho brát, i když dlouho neprší.",
  }),
  choice("Jak se liší písčitá půda od jílovité?", "Písčitá propustí vodu rychle, jílovitá ji drží", [
    { value: "Jílovitá propustí vodu rychle, písčitá ji drží", why: "Je to naopak. Mezi zrnky písku jsou velké mezery, voda proteče." },
    { value: "Liší se jen barvou", why: "Liší se hlavně tím, jak drží vodu. Barva o tom neříká všechno." },
    { value: "Písčitá je vždy úrodnější", why: "Písčitá půda rychle vysychá a má málo živin, úrodnější nebývá." },
  ], {
    hints: ["Představ si, že naliješ vodu na písek na pláži a na mokrou hlínu.", "Mezi zrnky písku jsou velké mezery. Jílovité částečky jsou drobounké a těsně u sebe. Kudy voda proteče snáz?"],
    explanation: "Zrnka písku jsou velká a mezi nimi jsou mezery, takže voda rychle proteče dolů a půda vysychá. Jíl má drobné částice těsně u sebe, voda se v něm drží a půda může být mokrá a těžká.",
  }),
  choice("Proč je dobré mít na zahradě kompost?", "Vznikne z něj humus, který zúrodní půdu", [
    { value: "Odežene krtky ze zahrady", why: "Kompost krtky neodhání. Jeho smysl je v humusu." },
    { value: "Ohřeje zahradu v zimě", why: "Kompost uvnitř trochu hřeje, ale zahradu v zimě neohřeje." },
    { value: "Nahradí zalévání", why: "Kompost pomáhá půdě držet vodu, ale zalévání nenahradí." },
  ], {
    hints: ["Co se stane se slupkami a posekanou trávou, když leží na kompostu rok?", "Na kompostu tlejí zbytky rostlin stejně jako listí v lese. Co z nich vznikne a k čemu se to pak dá na záhonu?"],
    explanation: "Na kompostu tlejí zbytky rostlin a vzniká z nich humus. Když ho rozhodíš na záhon, dodá půdě živiny a pomůže jí držet vodu.",
  }),
  choice("Po silném dešti teče z holého pole hnědá voda. Co se děje?", "Voda odnáší půdu z pole", [
    { value: "Voda přináší na pole novou půdu", why: "Hnědá voda z pole odtéká, tedy půdu odnáší, ne přináší." },
    { value: "Voda se barví hnojivem", why: "Hnědou barvu dělají částečky půdy, které voda unáší." },
    { value: "Voda rozpouští kameny", why: "Kameny se ve vodě za jeden déšť nerozpustí. Voda unáší půdu." },
  ], {
    hints: ["Proč je ta voda hnědá, a ne čirá?", "V hnědé vodě plavou drobné částečky. Odkud se vzaly a kam je voda nese?"],
    explanation: "Hnědou barvu dělají částečky půdy, které voda z pole smývá. Tomu se říká eroze. Holé pole bez rostlin je proti ní nejvíc bezbranné.",
  }),
  choice("Jak chrání les půdu na svahu?", "Kořeny ji drží a koruny tlumí déšť", [
    { value: "Stromy odvádějí vodu kmenem pryč", why: "Kmeny vodu z lesa neodvádějí. Les naopak vodu zadržuje." },
    { value: "Les vysaje z půdy všechnu vodu", why: "Stromy vodu berou, ale ne všechnu. A před erozí chrání kořeny." },
    { value: "Stín půdu zmrazí", why: "Stín půdu nezmrazí. Chrání ji kořeny a listí." },
  ], {
    hints: ["Co drží pod zemí svah, aby se nesesunul?", "Pod stromy se rozprostírá síť kořenů. A kapky deště nejdřív dopadnou na listy, než spadnou na zem."],
    explanation: "Kořeny stromů drží půdu jako síť. Koruny a spadané listí zachytí déšť, takže voda nestéká prudce a půdu neodnáší. Po vykácení lesa se svah rychle začne sesouvat.",
  }),
  choice("Ve které části Česka je nejvíc černozemě?", "Na jižní Moravě", [
    { value: "V Krkonoších", why: "V Krkonoších jsou hory. Půdy jsou tam tenké a kamenité." },
    { value: "Na Šumavě", why: "Šumava je chladná a zalesněná, černozem tam není." },
    { value: "V Jizerských horách", why: "V horách černozem nevzniká. Potřebuje teplo a rovinu." },
  ], {
    hints: ["Černozem vzniká v teplých rovinách. Kde jsou v Česku?", "Tři možnosti jsou hory. Hledej teplou nížinu, kde se pěstuje vinná réva a kukuřice."],
    explanation: "Černozem vzniká v teplých a sušších nížinách. U nás je hlavně na jižní Moravě a v Polabí. V horách jsou půdy tenké a kamenité.",
  }),
  choice("Proč se záhon před setím kypří motykou nebo rýčem?", "Aby do půdy pronikl vzduch a voda", [
    { value: "Aby půda ztvrdla", why: "Kypření půdu dělá měkkou a drobivou, ne tvrdou." },
    { value: "Aby z ní utekly žížaly", why: "Žížaly jsou v půdě užitečné, nikdo je nevyhání." },
    { value: "Aby se semínka ohřála sluncem", why: "Semínka se zasévají do země, ne na slunce. Kypření pomáhá hlavně vzduchu a vodě." },
  ], {
    hints: ["Jaký rozdíl je mezi ušlapanou cestičkou a čerstvě zrytým záhonem?", "Do ušlapané hlíny voda nepronikne a steče po povrchu. Co se změní, když hlínu rozdrobíš na malé hrudky?"],
    explanation: "Kyprá půda má mezi hrudkami mezery. Tudy se dostane vzduch ke kořenům a voda se vsákne do hloubky. Semínka v ní snadno vzejdou.",
  }),
  choice("Proč musí být v půdě i vzduch?", "Kořeny a živočichové v ní dýchají", [
    { value: "Aby byla lehčí pro zemědělce", why: "O váhu nejde. Vzduch potřebují živé organismy v půdě." },
    { value: "Aby do ní nepršelo", why: "Vzduch v půdě dešti nebrání. Voda a vzduch jsou v půdě spolu." },
    { value: "Aby se nerozpadla", why: "Vzduch půdu nedrží pohromadě. Potřebují ho kořeny a živočichové." },
  ], {
    hints: ["Co potřebuje každý živý tvor, aby žil?", "V půdě žijí žížaly, brouci, bakterie a rostou v ní kořeny. Co všichni potřebují kromě vody a potravy?"],
    explanation: "Kořeny rostlin i žížaly, brouci a bakterie v půdě dýchají. Proto potřebují vzduch v drobných mezerách mezi částečkami půdy. V ušlapané nebo zatopené půdě se dusí.",
  }),
  choice("Která vrstva půdy je nejúrodnější?", "Svrchní tmavá vrstva s humusem", [
    { value: "Spodní vrstva s kameny", why: "Dole je méně humusu a víc kamení. Úrodnost je nahoře." },
    { value: "Hornina hluboko pod půdou", why: "Hornina je pevný kámen. Z něj půda teprve vzniká." },
    { value: "Všechny vrstvy stejně", why: "Vrstvy se liší. Nejvíc humusu a živin je nahoře." },
  ], {
    hints: ["Kam padá listí, které pak tleje?", "Když vykopeš jámu, uvidíš nahoře tmavou vrstvu a dole světlejší s kamínky. Kde je víc humusu?"],
    explanation: "Nejúrodnější je svrchní tmavá vrstva, protože sem padají a tlejí zbytky rostlin a vzniká tu humus. Hlouběji je víc úlomků hornin a méně živin.",
  }),
  choice("V suchém létě rostliny vadnou, i když je v půdě dost živin. Proč?", "Bez vody kořeny živiny nepřijmou", [
    { value: "Živiny rostlinám v létě škodí", why: "Živiny rostlinám neškodí. Problém je, že chybí voda." },
    { value: "V létě kořeny spí", why: "Kořeny v létě pracují. Jen nemají vodu, ve které by živiny přijaly." },
    { value: "Sucho zabíjí jen plevel", why: "Sucho škodí všem rostlinám, i plodinám." },
  ], {
    hints: ["Jak se živiny dostanou do kořene?", "Živiny jsou v půdě rozpuštěné ve vodě jako cukr v čaji. Co se stane, když voda chybí?"],
    explanation: "Kořeny přijímají živiny rozpuštěné ve vodě. Když je půda vyschlá, živiny v ní sice jsou, ale rostlina se k nim nedostane a vadne.",
  }),
  choice("Proč se v lese nemusí hnojit?", "Spadané listí a zbytky zetlí na humus", [
    { value: "Stromy nepotřebují živiny", why: "Stromy živiny potřebují. Dostávají je ze zetlelého listí." },
    { value: "Les hnojí déšť", why: "Déšť přináší vodu, ne dost živin. Živiny vrací tlející listí." },
    { value: "Les hnojí sníh", why: "Sníh přinese vodu, živiny ne." },
  ], {
    hints: ["Co se každý podzim v lese stane s listím?", "Nikdo z lesa listí neodváží. Leží na zemi, tleje a živiny, které v něm byly, se vracejí zpátky do půdy."],
    explanation: "V lese spadané listí, větvičky a uhynulá zvířata tlejí na humus. Živiny se tak vracejí do půdy a stromy je znovu přijmou. Na poli sklizeň odvezeme, proto se musí hnojit.",
  }),
  choice("Jak poznáš úrodnou půdu?", "Je tmavá, drobivá a žijí v ní žížaly", [
    { value: "Je světlá a tvrdá jako kámen", why: "Světlá tvrdá půda má málo humusu a vzduchu, úrodná není." },
    { value: "Je mokrá a zapáchá", why: "Zapáchající mokrá půda má málo vzduchu, kořeny se v ní dusí." },
    { value: "Je v ní samý písek", why: "Písčitá půda neudrží vodu a živiny." },
  ], {
    hints: ["Vzpomeň si, jakou barvu má humus a kdo v půdě hrabe chodbičky.", "Úrodná půda má hodně humusu, je v ní vzduch a žije v ní spousta tvorů. Jak taková půda vypadá, když ji vezmeš do ruky?"],
    explanation: "Úrodná půda je tmavá díky humusu, drobí se v ruce, protože je v ní vzduch, a žijí v ní žížaly, které ji dál zlepšují.",
  }),
  choice("Proč jsou meze a pásy keřů mezi poli dobré pro půdu?", "Brzdí vítr a vodu, které půdu odnášejí", [
    { value: "Zabírají místo, a tak je méně práce", why: "O práci nejde. Meze chrání půdu před odnášením." },
    { value: "Stíní obilí, aby rostlo rychleji", why: "Obilí potřebuje slunce. Meze chrání půdu, ne stíní." },
    { value: "Vyrábějí hnojivo pro pole", why: "Meze hnojivo nevyrábějí. Brzdí vítr a vodu." },
  ], {
    hints: ["Co se stane s holou půdou na obrovském poli, když fouká silný vítr?", "Keře a tráva na mezi jsou jako plot — zastaví vítr a zbrzdí vodu stékající ze svahu. Co tím zachrání?"],
    explanation: "Na velkém holém poli vítr odfoukává a voda splachuje půdu. Meze a pásy keřů vítr i vodu brzdí, takže půda zůstane na poli. Navíc v nich žijí užiteční živočichové.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Jeden centimetr půdy vzniká stovky let. Co to znamená pro erozi?", "Co voda odnese za pár let, obnovuje se staletí", [
    { value: "Odnesená půda se do roka obnoví", why: "Za rok vznikne jen nepatrná vrstvička. Obnova trvá staletí." },
    { value: "Eroze nevadí, půdy je dost", why: "Půda vzniká tak pomalu, že každá odnesená vrstva chybí na dlouhou dobu." },
    { value: "Eroze vytváří novou půdu", why: "Eroze půdu odnáší, nevytváří." },
  ], {
    hints: ["Porovnej, jak rychle půda vzniká a jak rychle ji může voda odnést.", "Prudký déšť odnese z holého pole za jedno odpoledne i centimetr půdy. Kolik let bude trvat, než stejná vrstva znovu vznikne?"],
    explanation: "Voda může odnést centimetr půdy během pár silných dešťů, ale nový centimetr vzniká stovky let. Proto je eroze vážná — za život člověka se ztracená půda neobnoví.",
  }),
  choice("Proč se na svahu orá napříč, a ne shora dolů?", "Brázdy napříč zadrží vodu, aby neodnesla půdu", [
    { value: "Aby brázdy odvedly vodu rychle dolů", why: "To by bylo shora dolů — a voda by brázdami odnášela půdu." },
    { value: "Aby na pole víc svítilo slunce", why: "Směr brázd na slunce nemá velký vliv. Jde o vodu." },
    { value: "Aby se obilí nepřevrhlo", why: "Obilí se převrhne větrem nebo deštěm, směr orby na tom nezávisí." },
  ], {
    hints: ["Kudy teče voda, když zaprší na svahu?", "Brázda shora dolů je jako skluzavka pro vodu. Co udělá brázda, která vede napříč svahem?"],
    explanation: "Voda teče po svahu dolů. Brázdy shora dolů by jí posloužily jako koryta a spláchla by půdu. Brázdy napříč vodu zachytí, ta se vsákne a půda zůstane na poli.",
  }),
  choice("Proč ve městě s mnoha betonovými plochami po bouřce častěji zaplaví ulice?", "Voda se nevsákne do země a hned odtéká", [
    { value: "Beton vodu přitahuje", why: "Beton vodu nepřitahuje, jen ji nepropustí." },
    { value: "Ve městě prší víc", why: "Ve městě neprší víc. Rozdíl je v tom, kam voda zmizí." },
    { value: "Kanály jsou vždy ucpané", why: "Kanály to často nestihnou odvést, protože voda se nemá kde vsáknout." },
  ], {
    hints: ["Co se stane s deštěm na louce a co na parkovišti?", "Na louce voda zmizí v půdě jako v houbě. Beton je nepropustný. Kam tedy všechna voda z parkoviště musí?"],
    explanation: "Půda déšť nasává jako houba. Beton a asfalt vodu nepropustí, takže všechna voda steče najednou do ulic a kanálů a ty ji nestíhají odvést.",
  }),
  choice("Proč je humusu nejvíc ve svrchní vrstvě půdy?", "Tam padají a tlejí zbytky rostlin a živočichů", [
    { value: "Humus stoupá nahoru jako olej", why: "Humus nahoru nestoupá. Vzniká tam, kam padají zbytky." },
    { value: "Dole ho odnesla voda", why: "Voda odnáší půdu z povrchu, ne zespodu." },
    { value: "Humus vzniká z hornin v hloubce", why: "Z hornin vznikají minerální části. Humus vzniká ze zbytků organismů." },
  ], {
    hints: ["Odkud se humus bere?", "Humus vzniká z tlejícího listí a zbytků. Kam listí padá — dolů do hloubky, nebo na povrch?"],
    explanation: "Humus vzniká z odumřelých rostlin a živočichů. Ty padají na povrch a tam tlejí, proto je nejvíc humusu nahoře. Hlouběji převládají úlomky hornin.",
  }),
  choice("Zemědělec každý rok jen sklízí a do půdy nic nevrací. Co se stane?", "Ubude v ní živin a úroda bude klesat", [
    { value: "Půda bude čím dál úrodnější", why: "Každá sklizeň odnese živiny. Bez vracení jich ubývá." },
    { value: "Nic, živiny se doplní samy", why: "Na poli se živiny samy nedoplní, sklizeň je odveze." },
    { value: "Za rok se změní v písek", why: "Tak rychle se to nestane. Úroda ale bude rok od roku menší." },
  ], {
    hints: ["Kam zmizí živiny, které rostlina nasála z půdy?", "V lese listí zůstane a zetlí. Z pole ale obilí odvezeme. Co se tak s živinami v půdě rok od roku děje?"],
    explanation: "Rostliny berou z půdy živiny a sklizeň je odveze z pole. Když se živiny nevracejí hnojem nebo kompostem, půdy jich ubývá a úroda klesá.",
  }),
  choice("Žížaly jedí spadané listí. Jak tím pomáhají rostlinám?", "Z listí je humus a chodbičky pustí do půdy vzduch", [
    { value: "Žerou kořeny, a tak je prořeďují", why: "Žížaly živé kořeny nežerou. Jedí odumřelé zbytky." },
    { value: "Odhánějí krtky", why: "Krtci žížaly naopak loví. Pomoc je v humusu a chodbičkách." },
    { value: "Nijak, jen v půdě žijí", why: "Žížaly jsou pro půdu velmi užitečné." },
  ], {
    hints: ["Co zůstane v půdě po žížale, když listí sní a proleze zemí?", "Žížala listí zpracuje ve svém těle na drobky plné živin. A kudy se plazí, tam zůstane tunýlek. K čemu je obojí kořenům?"],
    explanation: "Žížala polyká listí a hlínu a vylučuje drobky plné živin, ze kterých je humus. Její chodbičky provzdušňují půdu a pouštějí do ní vodu. Obojí pomáhá kořenům.",
  }),
  choice("Proč jsou na horách půdy tenké a kamenité?", "Je tam chladno a ze svahů je smývá voda", [
    { value: "Na horách neprší", why: "Na horách naopak prší hodně. A voda ze strmých svahů půdu odnáší." },
    { value: "Na horách nerostou žádné rostliny", why: "Na horách rostou lesy i louky. Jen v chladu pomalu tlejí zbytky." },
    { value: "Hory jsou z písku", why: "Hory jsou z pevných hornin, ne z písku." },
  ], {
    hints: ["Jak rychle tleje listí v zimě a jak v teple?", "V chladu probíhá rozklad pomalu a humusu vzniká málo. A co udělá déšť na strmém svahu s tou trochou půdy, která vznikne?"],
    explanation: "Na horách je chladno, takže zbytky rostlin tlejí pomalu a humusu je málo. Ze strmých svahů navíc voda půdu smývá. Proto tam zůstane jen tenká vrstva mezi kameny.",
  }),
  choice("Pod parkovištěm je půda. Proč na ní nic nevyroste?", "Nedostane se k ní světlo, voda ani vzduch", [
    { value: "Beton z ní vysál živiny", why: "Beton živiny nesaje. Rostliny chybějí, protože nemají světlo, vodu ani vzduch." },
    { value: "Půda pod betonem za den zkamení", why: "Půda nezkamení. Jen je od všeho odříznutá." },
    { value: "Rostliny ve městě nerostou", why: "Ve městě rostliny rostou v parcích a zahradách. Pod betonem ne." },
  ], {
    hints: ["Co potřebuje semínko, aby vyklíčilo a rostlo?", "Beton je nepropustný jako víko. Co všechno se přes něj k půdě nedostane?"],
    explanation: "Beton půdu zakryje jako víko. Nedostane se k ní světlo, voda ani vzduch, a tak v ní nic nevyroste a živočichové v ní nežijí. Zabetonovaná půda je pro přírodu ztracená.",
  }),
  choice("Když je na záhoně jen písek, rostliny rostou špatně. Proč?", "Písek nedrží vodu a nemá živiny", [
    { value: "Písek je moc těžký", why: "Písek je naopak lehký a sypký. Problém je voda a živiny." },
    { value: "Písek je moc tmavý", why: "Písek bývá světlý. Chybí mu humus." },
    { value: "V písku je příliš humusu", why: "Humusu je v písku málo, ne moc." },
  ], {
    hints: ["Co se stane s vodou, když ji naliješ na písek?", "Voda pískem rychle proteče pryč. A písek jsou jen zrnka kamene, bez zbytků rostlin. Co rostlinám chybí?"],
    explanation: "Písek vodu rychle propustí a nemá humus, takže v něm chybí voda i živiny. Pomůže přimíchat kompost, který obojí dodá.",
  }),
  choice("Proč se nesmí vylévat olej nebo barvy na zem?", "Znečistí půdu i vodu pod ní", [
    { value: "Půdu by příliš zúrodnily", why: "Olej a barvy půdu nezúrodní, ale otráví." },
    { value: "Olej by půdu ohřál", why: "Nejde o teplo. Olej a barvy jsou pro organismy v půdě jedovaté." },
    { value: "Nic se nestane, půda je pohltí", why: "Půda je pohltí, ale jed zůstane v ní a dostane se do vody." },
  ], {
    hints: ["Kam se dostane to, co se vsákne do země?", "Voda z půdy stéká do studní a potoků. Co se stane se žížalami, kořeny i vodou, kterou pak piješ?"],
    explanation: "Olej a barvy obsahují jedovaté látky. V půdě hubí žížaly a mikroorganismy a s vodou se dostanou do studní a potoků. Patří do sběrného dvora.",
  }),
  choice("Rostlina roste v květináči několik let a daří se jí stále hůř. Co pomůže?", "Přesadit ji do nové zeminy", [
    { value: "Dát ji do tmy", why: "Rostlina potřebuje světlo. Ve tmě by jí bylo ještě hůř." },
    { value: "Zalévat ji méně", why: "Voda problém nevyřeší. Stará zemina už nemá živiny." },
    { value: "Utlačit zeminu pevněji", why: "Utlačená zemina má málo vzduchu, kořenům to uškodí." },
  ], {
    hints: ["Co rostlina léta bere ze zeminy v květináči?", "Zemina v květináči se nedoplňuje jako v lese. Po letech v ní nezbyly živiny. Jak je rostlině dodat?"],
    explanation: "Rostlina léta brala z malého množství zeminy živiny, až je vyčerpala. Nová zemina s humusem jí je znovu dodá. Pomoci může i hnojivo.",
  }),
  choice("Proč v lese nenajdeš vrstvu listí ze všech posledních let?", "Listí každý rok zetlí na humus", [
    { value: "Odfoukne ho vítr", why: "Vítr listí trochu přesune, ale v lese ho neodnese." },
    { value: "Všechno ho sní srnci", why: "Srnci suché listí nežerou. Rozkládají ho houby, bakterie a žížaly." },
    { value: "Lesníci ho každý rok uklidí", why: "Lesníci listí neuklízejí. Zmizí samo rozkladem." },
  ], {
    hints: ["Kdo v lese pracuje s odumřelými zbytky?", "Houby, bakterie a žížaly pracují celý rok. Co z listí za rok dva udělají?"],
    explanation: "Houby, bakterie a drobní živočichové spadané listí během roku až dvou rozloží na humus. Proto vrstva listí nenarůstá, i když každý podzim spadne nové.",
  }),
  choice("Voda zateče do pukliny v kameni a v noci zmrzne. Co se stane?", "Led puklinu roztáhne a kámen praskne", [
    { value: "Led kámen slepí dohromady", why: "Led se ráno rozpustí a nic neslepí. Při mrznutí naopak tlačí." },
    { value: "Kámen se rozpustí", why: "Kámen se ve vodě nerozpouští. Rozbije ho tlak ledu." },
    { value: "Nic, kámen je silnější než led", why: "Voda při zamrznutí zvětší objem a tlačí obrovskou silou. Kámen to časem roztrhne." },
  ], {
    hints: ["Proč praská láhev s vodou, když ji zapomeneš v mrazáku?", "Voda při zamrznutí zabere víc místa. Co udělá s úzkou puklinou, když se v ní nemá kam roztáhnout?"],
    explanation: "Zamrzající voda zvětší objem a roztlačí puklinu. Když se to opakuje každou zimu, kámen se rozpadne na úlomky. To je jeden ze způsobů zvětrávání, ze kterého vzniká půda.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const PUDAVZNIKSLOZENIVYZNAMPROZIVOT: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-puda-vznik-slozeni-vyznam-pro-zivot",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-puda-vznik-slozeni-vyznam-pro-zivot",
    title: "Půda - vznik, složení, význam pro život",
    studentTitle: "Půda a organismy",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Pochopíš, jak vzniká půda a proč je nenahraditelná pro veškerý pozemský život.",
    keywords: ["půda", "humus", "černozem", "eroze", "žížala", "zvětrávání", "horniny", "úrodnost", "kompost"],
    goals: [
      "Popsat složení půdy (minerální části, humus, voda, vzduch, organismy)",
      "Vysvětlit, jak půda vzniká (zvětrávání a tlení)",
      "Uvést příklady půdních organismů a jejich užitek",
      "Vysvětlit, co půdu ohrožuje (eroze, znečištění, zástavba) a jak ji chránit",
    ],
    boundaries: ["Detailní geochemie půdy není náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Půdu tvoří úlomky hornin, humus, voda, vzduch a organismy, které v ní žijí.",
      steps: [
        "Vznik: horniny zvětrávají a zbytky organismů tlejí — trvá to stovky let.",
        "Humus je tmavý, drží vodu a dává živiny.",
        "Žížaly, houby a bakterie z odumřelých zbytků dělají humus.",
        "Eroze je odnášení půdy vodou a větrem. Chrání před ní rostliny.",
      ],
      commonMistake: "Humus není hnůj — je to tmavá část půdy z rozložených rostlin a živočichů.",
      example: "Černozem na jižní Moravě je nejtmavší a nejúrodnější půda v Česku.",
    },
  },
];
