import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Generátor vracel na všech úrovních
// tentýž seznam se stejnou nápovědou. Teď tři oddělené banky:
// L1 pojmy (dramatizace, recitace, ilustrace, komiks, pantomima, rým, verš,
// sloka) · L2 poznat činnost podle situace, zvolit přednes podle nálady,
// najít rým · L3 doplnit rým do verše, seřadit okénka komiksu, zvolit hlas
// pro postavu, vymyslet navazující konec nebo pokračování.

const L1: PracticeTask[] = [
  choice("Co je dramatizace?", "zahrání příběhu v rolích", [
    { value: "nakreslení obrázku k textu", why: "To je ilustrace." },
    { value: "přepsání textu do sešitu", why: "To je opis." },
    { value: "tiché čtení pro sebe", why: "Při dramatizaci se hraje a mluví." },
  ], { hints: ["Co dělají herci v divadle?", "Při dramatizaci si děti rozdělí postavy a předvedou je jako scénku v divadle."], explanation: "Dramatizace je zahrání příběhu v rolích, jako v divadle." }),
  choice("Co je recitace?", "přednes básně zpaměti", [
    { value: "čtení básně z knížky", why: "Při recitaci knížku nepotřebuješ." },
    { value: "psaní vlastní básně", why: "Recitace je přednes, ne psaní." },
    { value: "zpívání písničky", why: "Recitace se neřeší zpěvem." },
  ], { hints: ["Potřebuješ při recitaci knížku?", "Kdo recituje, má text naučený v hlavě a říká ho nahlas před ostatními."], explanation: "Recitace je přednes básně zpaměti." }),
  choice("Co je ilustrace?", "obrázek k textu", [
    { value: "nadpis kapitoly", why: "Nadpis je slovo, ne obrázek." },
    { value: "obsah knihy", why: "Obsah je seznam kapitol." },
    { value: "jméno autora", why: "Jméno autora obrázek není." },
  ], { hints: ["Co v knížce kreslí výtvarník?", "Ilustrace ukazuje postavy a místa, o kterých se čte."], explanation: "Ilustrace je obrázek, který doprovází text." }),
  choice("Co je komiks?", "příběh v obrázcích s bublinami", [
    { value: "báseň s rýmy", why: "Báseň nemá okénka ani bubliny." },
    { value: "dlouhý román bez obrázků", why: "Komiks stojí na obrázcích." },
    { value: "slovník cizích slov", why: "Slovník nevypráví děj." },
  ], { hints: ["Kde postavy mluví v bublinách?", "Děj je rozdělený do okének a každé okénko ukazuje jednu chvíli."], explanation: "Komiks vypráví příběh v obrázcích; postavy mluví v bublinách." }),
  choice("Co je pantomima?", "vyjádření pohybem bez slov", [
    { value: "zpěv bez hudby", why: "Pantomima je bez hlasu." },
    { value: "hlasité čtení", why: "Při pantomimě se nemluví." },
    { value: "kreslení na tabuli", why: "Pantomima se hraje tělem." },
  ], { hints: ["Smíš při pantomimě mluvit?", "Pantomimu hraješ jen tělem a výrazem obličeje — beze zvuku."], explanation: "Pantomima je hraní jen pohybem a mimikou, bez slov." }),
  choice("Co znamená přednášet s výrazem?", "měnit hlas podle nálady textu", [
    { value: "číst co nejrychleji", why: "Rychlost bez výrazu posluchače nezaujme." },
    { value: "mluvit pořád stejně", why: "To je bez výrazu." },
    { value: "celý text šeptat", why: "Šepot se hodí jen někde." },
  ], { hints: ["Zní veselá básnička stejně jako smutná?", "Výrazný přednes: hlasitěji, tišeji, pomaleji, rychleji — podle toho, co text vyjadřuje."], explanation: "S výrazem přednášíme tak, že hlas měníme podle nálady textu." }),
  choice("Co je rým?", "shoda zvuku na konci slov", [
    { value: "stejný začátek slov", why: "Rým je na konci slov." },
    { value: "velmi dlouhé slovo", why: "Délka s rýmem nesouvisí." },
    { value: "název básně", why: "To je nadpis." },
  ], { hints: ["Co mají společného slova kočka a očka?", "Slova se rýmují, když zní stejně na konci — třeba les a pes."], explanation: "Rým je shoda zvuku na konci slov: les — pes." }),
  choice("Co je verš?", "jeden řádek básně", [
    { value: "celá báseň", why: "Báseň se skládá z více veršů." },
    { value: "nadpis básně", why: "Nadpis není verš." },
    { value: "jméno básníka", why: "Jméno autora není verš." },
  ], { hints: ["Z čeho se skládá báseň, když se na ni podíváš?", "Báseň se píše po řádcích, ne v odstavcích jako příběh."], explanation: "Verš je jeden řádek básně." }),
  choice("Co je sloka?", "skupina veršů oddělená volným řádkem", [
    { value: "jedno jediné dlouhé slovo", why: "Sloka má víc řádků." },
    { value: "nadpis básně", why: "Nadpis není sloka." },
    { value: "poslední rým", why: "Rým je zvuk na konci slov." },
  ], { hints: ["Jak se jmenuje část básně, po které je volný řádek?", "Báseň se dělí na části — každá má obvykle stejný počet řádků."], explanation: "Sloka je skupina veršů oddělená od další mezerou." }),
  choice("Co znamená napsat pokračování příběhu?", "vymyslet, co se stalo potom", [
    { value: "přepsat příběh od začátku", why: "To by byl opis." },
    { value: "zkrátit příběh", why: "Zkrácení není pokračování." },
    { value: "nakreslit obal knihy", why: "To je ilustrace." },
  ], { hints: ["Kde pokračování začíná — na začátku, nebo na konci původního příběhu?", "Postavy zůstanou stejné, jen přidáš další události po konci."], explanation: "Pokračování vypráví, co se stalo po konci příběhu." }),
  choice("Proč hrajeme příběhy v rolích?", "lépe pochopíme postavy a jejich pocity", [
    { value: "abychom se nemuseli učit", why: "I při hraní se učíme." },
    { value: "protože je to rychlejší než čtení", why: "O rychlost nejde." },
    { value: "abychom text nemuseli číst", why: "Text musíme znát." },
  ], { hints: ["Na co musíš myslet, když hraješ smutnou princeznu?", "Kdo postavu hraje, musí si představit, co cítí a proč tak jedná."], explanation: "Když postavu hrajeme, lépe pochopíme, co cítí." }),
  choice("Kdo kreslí obrázky do knížek?", "ilustrátor", [
    { value: "spisovatel", why: "Spisovatel píše text." },
    { value: "tiskař", why: "Tiskař knihu tiskne." },
    { value: "knihovník", why: "Knihovník knihy půjčuje." },
  ], { hints: ["Jak se jmenuje výtvarník, jehož prací jsou obrázky ke knihám?", "Spisovatel píše text, obrázky k němu vytváří jiný umělec."], explanation: "Obrázky do knih kreslí ilustrátor." }),
  choice("Co je hádanka?", "krátký text, ve kterém máme uhodnout, co se popisuje", [
    { value: "dlouhý příběh s mnoha kapitolami", why: "Hádanka je krátká." },
    { value: "seznam slov podle abecedy", why: "To je slovník." },
    { value: "návod, jak něco postavit", why: "To je návod." },
  ], { hints: ["Co musí posluchač udělat, když slyší: Má čtyři nohy a štěká?", "Hádanka věc popíše, ale nepojmenuje ji — to je úkol pro posluchače."], explanation: "Hádanka popisuje věc a posluchač ji má uhodnout." }),
];

const L2: PracticeTask[] = [
  choice("Děti si rozdělily role a zahrály pohádku o Budulínkovi. Co dělaly?", "dramatizaci", [
    { value: "recitaci", why: "Recituje se báseň zpaměti, ne hraje pohádka v rolích." },
    { value: "ilustraci", why: "Ilustrace je obrázek." },
    { value: "pantomimu", why: "V pantomimě se nemluví, v pohádce postavy mluvily." },
  ], { hints: ["Mluvily postavy a hrály?", "Když se známý text hraje v rolích, vzniká z něj divadlo."], explanation: "Hraní pohádky v rolích je dramatizace." }),
  choice("Anička řekla před třídou básničku zpaměti. Co dělala?", "recitovala", [
    { value: "dramatizovala", why: "Dramatizace je hraní v rolích." },
    { value: "ilustrovala", why: "Ilustrace je obrázek." },
    { value: "opisovala", why: "Opis je přepisování textu." },
  ], { hints: ["Jak se říká přednesu básně zpaměti?", "Básničku měla Anička naučenou v hlavě a přednesla ji ostatním."], explanation: "Přednes básně zpaměti je recitace." }),
  choice("Honza nakreslil k pohádce obrázek draka. Co vytvořil?", "ilustraci", [
    { value: "komiks", why: "Komiks má víc okének s dějem." },
    { value: "osnovu", why: "Osnova je plán textu." },
    { value: "báseň", why: "Báseň se píše slovy." },
  ], { hints: ["Jak se jmenuje jeden obrázek k textu?", "Obrázek, který doprovází pohádku, pomáhá čtenáři si ji představit."], explanation: "Obrázek k pohádce je ilustrace." }),
  choice("Tereza rozdělila příběh do šesti okének a postavám nakreslila bubliny. Co vytvořila?", "komiks", [
    { value: "ilustraci", why: "Ilustrace bývá jeden obrázek bez bublin." },
    { value: "osnovu", why: "Osnova je plán v bodech." },
    { value: "pantomimu", why: "Pantomima se hraje tělem." },
  ], { hints: ["Jak se jmenuje příběh v okénkách?", "Okénka jdou po sobě jako děj a postavy v nich mluví."], explanation: "Příběh v okénkách s bublinami je komiks." }),
  choice("Petr beze slov předváděl, jak medvěd hledá med. Co hrál?", "pantomimu", [
    { value: "recitaci", why: "Recitace je přednes básně." },
    { value: "dramatizaci", why: "V dramatizaci postavy mluví." },
    { value: "komiks", why: "Komiks se kreslí." },
  ], { hints: ["Mluvil Petr?", "Kdo hraje jen pohybem a výrazem obličeje, nepotřebuje žádná slova."], explanation: "Hraní beze slov je pantomima." }),
  choice("Básnička je smutná. Jak ji budeš přednášet?", "pomalu a tišeji", [
    { value: "rychle a vesele", why: "To se hodí k veselé básničce." },
    { value: "křikem", why: "Křik ke smutku nesedí." },
    { value: "stále stejným hlasem", why: "Bez výrazu posluchač náladu nepozná." },
  ], { hints: ["Jak mluvíme, když jsme smutní?", "Přednes má odpovídat náladě: smutná báseň nezní jako rozpustilá říkanka."], explanation: "Smutnou báseň přednášíme pomalu a tišeji." }),
  choice("Básnička je rozpustilá a plná legrace. Jak ji budeš přednášet?", "živě a vesele", [
    { value: "pomalu a smutně", why: "To se hodí ke smutné básni." },
    { value: "šeptem", why: "Šepot se hodí k tajemné básni." },
    { value: "stále stejným hlasem", why: "Bez výrazu legrace zanikne." },
  ], { hints: ["Jak zní hlas, když se smějeme?", "Nálada básně určuje tempo i hlasitost přednesu."], explanation: "Legrační básničku přednášíme živě a vesele." }),
  choice("Třída vymýšlela, co dělala Karkulka den po návštěvě u babičky. Co psali?", "pokračování příběhu", [
    { value: "nový konec příběhu", why: "Konec zůstal stejný — vymýšleli, co bylo potom." },
    { value: "ilustraci", why: "Ilustrace je obrázek." },
    { value: "recitaci", why: "Recitace je přednes." },
  ], { hints: ["Děje se to, co vymýšleli, před koncem pohádky, nebo po něm?", "Když příběh neměníme, jen přidáváme další den, navazujeme na původní konec."], explanation: "Vymýšleli, co se stalo potom — to je pokračování příběhu." }),
  choice("Děti vymyslely, že v pohádce O Koblížkovi koblížek lišce uteče. Co udělaly?", "změnily konec příběhu", [
    { value: "napsaly pokračování", why: "Pokračování navazuje na původní konec, nemění ho." },
    { value: "nakreslily komiks", why: "O kreslení tu nic není." },
    { value: "recitovaly báseň", why: "Pohádku nerecitovaly." },
  ], { hints: ["Jak pohádka o Koblížkovi končí původně?", "Když se změní to, jak příběh dopadne, vznikne jiný závěr."], explanation: "Koblížek původně skončí v lišce — děti změnily konec." }),
  choice("Které slovo se rýmuje se slovem „myška“?", "šiška", [
    { value: "myš", why: "Stejný začátek není rým." },
    { value: "mýdlo", why: "Konec zní jinak." },
    { value: "kočka", why: "Souvisí s myškou, ale nerýmuje se." },
  ], { hints: ["Poslechni si, jak zní myška na konci.", "Rým hledáme na konci slova: -iška."], explanation: "Myška — šiška: obě slova končí stejně, na -iška." }),
  choice("Které slovo se rýmuje se slovem „les“?", "pes", [
    { value: "lesík", why: "Stejný začátek není rým." },
    { value: "list", why: "Konec zní jinak." },
    { value: "led", why: "Konec zní jinak." },
  ], { hints: ["Jak zní les na konci?", "Rým je shoda na konci slova: -es."], explanation: "Les — pes: obě slova končí na -es." }),
  choice("Které slovo se rýmuje se slovem „zima“?", "prima", [
    { value: "zimník", why: "Stejný začátek není rým." },
    { value: "zajíc", why: "Konec zní jinak." },
    { value: "jaro", why: "Souvisí významem, ale nerýmuje se." },
  ], { hints: ["Jak zní zima na konci?", "Rým hledáme podle konce slova: -ima."], explanation: "Zima — prima: obě slova končí na -ima." }),
  choice("Které slovo se rýmuje se slovem „koláč“?", "hráč", [
    { value: "kolo", why: "Stejný začátek není rým." },
    { value: "kolem", why: "Stejný začátek není rým." },
    { value: "dort", why: "Souvisí významem, ale nerýmuje se." },
  ], { hints: ["Jak zní koláč na konci?", "Rým je shoda zvuku na konci slova: -áč."], explanation: "Koláč — hráč: obě slova končí na -áč." }),
];

const L3: PracticeTask[] = [
  choice("Doplň rým: „Na zahradě roste mák, na plotě sedí ___.“", "pták", [
    { value: "vrabec", why: "Vrabec je taky pták, ale s mákem se nerýmuje." },
    { value: "kos", why: "Kos se s mákem nerýmuje." },
    { value: "holub", why: "Holub se s mákem nerýmuje." },
  ], { hints: ["Které slovo zní na konci stejně jako mák?", "Hledej slovo, které dává smysl a zároveň končí na -ák."], explanation: "Mák — pták: rým na -ák." }),
  choice("Doplň rým: „Venku padá bílý sníh, děti jedou na ___.“", "saních", [
    { value: "sáňkách", why: "Smysl dává, ale se sněhem se nerýmuje." },
    { value: "lyžích", why: "Blízko, ale konec zní jinak: -žích." },
    { value: "bruslích", why: "Konec zní jinak." },
  ], { hints: ["Poslechni si konec slova sníh.", "Doplněné slovo musí dávat smysl a končit stejně jako první verš: -íh / -ích."], explanation: "Sníh — saních: rým na -íh / -ích." }),
  choice("Doplň rým: „Myška malá, šedivá, z díry opatrně se ___.“", "dívá", [
    { value: "kouká", why: "Smysl dává, ale nerýmuje se." },
    { value: "schová", why: "Nerýmuje se." },
    { value: "směje", why: "Nerýmuje se." },
  ], { hints: ["Jak končí slovo šedivá?", "Hledej sloveso, které končí na -ívá a hodí se k myšce."], explanation: "Šedivá — dívá: rým na -ívá." }),
  choice("Doplň rým: „Na louce roste tráva, pase se tam ___.“", "kráva", [
    { value: "koza", why: "Pase se, ale nerýmuje se." },
    { value: "ovce", why: "Pase se, ale nerýmuje se." },
    { value: "kůň", why: "Pase se, ale nerýmuje se." },
  ], { hints: ["Které zvíře končí na -áva?", "Všechna zvířata v nabídce se pasou — rozhodne zvuk na konci verše."], explanation: "Tráva — kráva: rým na -áva." }),
  choice("Komiks má tři okénka: A) Honza zasadí semínko. B) Z květináče roste kytka. C) Honza semínko zalévá. Jaké je správné pořadí?", "A, C, B", [
    { value: "B, A, C", why: "Kytka nemůže růst dřív, než je semínko zasazené." },
    { value: "C, B, A", why: "Zalévat jde až zasazené semínko." },
    { value: "A, B, C", why: "Kytka vyroste až po zalévání." },
  ], { hints: ["Co se musí stát jako první, aby něco mohlo růst?", "Seřaď okénka podle času: co bylo nejdřív, co potom a co nakonec."], explanation: "Nejdřív zasadí (A), pak zalévá (C) a nakonec kytka roste (B)." }),
  choice("Komiks má tři okénka: A) Míša si obleče pláštěnku. B) Míša jde ven a nezmokne. C) Začne pršet. Jaké je správné pořadí?", "C, A, B", [
    { value: "A, B, C", why: "Proč by si oblékala pláštěnku, když ještě neprší?" },
    { value: "B, C, A", why: "Nezmokla díky pláštěnce — ta musí být dřív." },
    { value: "A, C, B", why: "Tak by to šlo, ale příběh dává větší smysl, když reaguje na déšť." },
  ], { hints: ["Co je důvod, proč si Míša bere pláštěnku?", "Najdi příčinu, pak reakci na ni a nakonec to, jak to dopadlo."], explanation: "Nejdřív začne pršet (C), Míša si obleče pláštěnku (A) a jde ven, aniž by zmokla (B)." }),
  choice("Hraješ vlka v pohádce O Červené Karkulce. Jak budeš mluvit?", "hrubým, lstivým hlasem", [
    { value: "tenkým vystrašeným hláskem", why: "Tak by mluvila vystrašená postava, ne vlk." },
    { value: "šeptem, aby tě nikdo neslyšel", why: "Diváci tě musí slyšet." },
    { value: "úplně bez výrazu", why: "Postava by nebyla poznat." },
  ], { hints: ["Jaký je vlk v pohádce — hodný, nebo zlý a mazaný?", "Hlas má odpovídat povaze postavy: hodná postava mluví vlídně, padouch jinak."], explanation: "Vlk je zlý a mazaný — mluví hrubě a lstivě." }),
  choice("Hraješ malé vystrašené kůzlátko. Jak budeš mluvit?", "tenkým, bojácným hláskem", [
    { value: "hlubokým, hrubým hlasem", why: "Tak mluví velká zlá postava." },
    { value: "vesele a nahlas", why: "Kůzlátko má strach." },
    { value: "pomalu jako obr", why: "Kůzlátko je malé." },
  ], { hints: ["Jak zní malé zvířátko, které se bojí?", "Velikost i pocit postavy slyšíme v hlase: malé a vystrašené zní jinak než velké a zlé."], explanation: "Malé vystrašené kůzlátko mluví tenkým, bojácným hláskem." }),
  choice("Text: „Za oknem sněžilo. Babička pletla u kamen šálu.“ Který obrázek se k textu hodí?", "babička u kamen plete a za oknem sněží", [
    { value: "děti se koupou na koupališti", why: "V textu je zima a babička." },
    { value: "babička sbírá jahody na zahradě", why: "V textu je zima a babička plete." },
    { value: "zasněžený les, v němž nikdo není", why: "Chybí hlavní postava i to, co dělá." },
  ], { hints: ["Kdo je v textu a co dělá? A jaké je počasí?", "Ilustrace má ukázat to, co text říká — postavu, činnost i místo."], explanation: "K textu patří babička, která u kamen plete, a sníh za oknem." }),
  choice("Jak v pantomimě ukážeš, že je ti zima?", "třesu se a třu si ruce", [
    { value: "řeknu: Je mi zima.", why: "V pantomimě se nemluví." },
    { value: "zazpívám o zimě", why: "V pantomimě se nezpívá." },
    { value: "napíšu to na tabuli", why: "V pantomimě se nepíše." },
  ], { hints: ["Co dělá tvoje tělo, když mrzneš?", "V pantomimě musí všechno říct pohyb a výraz obličeje."], explanation: "Zimu ukážeme tělem: třesem se a třeme si ruce." }),
  choice("Jak v pantomimě ukážeš, že jíš něco kyselého?", "zašklebím se a přimhouřím oči", [
    { value: "řeknu: To je kyselé.", why: "V pantomimě se nemluví." },
    { value: "nakreslím citron", why: "V pantomimě se nekreslí." },
    { value: "zatleskám", why: "Tleskání chuť nevyjádří." },
  ], { hints: ["Jak se tváříš, když kousneš do citronu?", "Chuť v pantomimě vyjádří hlavně obličej."], explanation: "Kyselou chuť ukážeme obličejem: zašklebíme se a přimhouříme oči." }),
  choice("Text: „Ježek celé léto sbíral jablka a houby. Pak přišla zima…“ Který konec k příběhu sedí?", "Ježek měl dost jídla a spokojeně spal.", [
    { value: "Ježek odletěl na jih jako vlaštovka.", why: "Ježci nelétají." },
    { value: "Ježek se šel koupat do rybníka.", why: "V zimě se nikdo nekoupe." },
    { value: "Ježek zapomněl, jak se jmenuje.", why: "S příběhem to nesouvisí." },
  ], { hints: ["Proč ježek celé léto sbíral jídlo?", "Dobrý konec navazuje na to, co se v příběhu stalo, a dává smysl."], explanation: "Ježek si připravil zásoby, takže v zimě mohl v klidu spát." }),
  choice("Text: „Příběh končí tím, že Pepík našel na půdě starou mapu.“ Které pokračování navazuje?", "Pepík se podle mapy vydal hledat poklad.", [
    { value: "Pepík se narodil a začal chodit do školky.", why: "To je začátek života, ne pokračování." },
    { value: "Pepík mapu nikdy nenašel.", why: "To odporuje konci příběhu." },
    { value: "Byla jednou jedna princezna.", why: "To je úplně jiný příběh." },
  ], { hints: ["Co člověk udělá, když najde mapu?", "Pokračování začíná tam, kde příběh skončil, a nesmí mu odporovat."], explanation: "Pokračování navazuje na nalezenou mapu — Pepík hledá poklad." }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3);
}

export const TVORIVECINN: TopicMetadata[] = [
  {
    id: "g3-cjl-tvorive-cinnosti",
    rvpNodeId: "g3-cjl-literarni-vychova-prace-s-textem-tvorive-cinnosti-s-literarnim-textem",
    title: "Tvořivé činnosti s literárním textem",
    studentTitle: "Hrajem s příběhem",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s textem",
    briefDescription: "Naučíš se dramatizovat, ilustrovat a tvořivě pracovat s textem.",
    keywords: ["dramatizace", "recitace", "ilustrace", "komiks", "pokračování příběhu", "pantomima"],
    goals: ["Dramatizovat krátký příběh.", "Vytvořit ilustraci k textu.", "Pokračovat v příběhu nebo změnit jeho konec."],
    boundaries: ["Základní tvořivé aktivity pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Tvořivá práce s textem: dramatizuj (zahraj), ilustruj (nakresli), recituj (přednes), vytvoř komiks.",
      steps: ["Přečti text.", "Vyber aktivitu: hraní, kreslení, recitace.", "Pracuj kreativně — klidně příběh trochu změň."],
      commonMistake: "Dramatizace ≠ doslovné čtení textu — postavy musí opravdu hrát a mluvit.",
      example: "Dramatizace Červené Karkulky: jeden žák hraje Karkulku, druhý Vlka, třetí vypravuje.",
    },
  },
];
