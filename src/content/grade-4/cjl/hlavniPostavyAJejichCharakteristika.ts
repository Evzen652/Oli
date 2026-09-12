import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Vypadly úlohy nevhodné pro
// 4. ročník (detektiv „závislý na whisky“), odborné pojmy, které hranice
// tématu vylučují („round character“, „protagonista“, „antagonista“,
// „jednodimenzionální“), gramatická chyba („Jana dostal cenu“) a nápovědy
// společné pro celé téma.
//
// L1 = hlavní a vedlejší postava, vzhled a povaha, kladná a záporná
// L2 = co o postavě prozradí úryvek · L3 = přenos: postava se mění, jak
// vlastnost ukázat, dobré i slabé stránky, co dát do popisu postavy.

function uryvek(text: string, q: string, klic: string, spatne: [[string, string], [string, string], [string, string]], hints: [string, string], explanation: string): PracticeTask {
  return choice(`Přečti si: „${text}“ ${q}`, klic, spatne.map(([value, why]) => ({ value, why })) as never, { hints, explanation });
}

const L1: PracticeTask[] = [
  choice("Jak poznáš hlavní postavu?", "příběh se točí hlavně kolem ní", [
    { value: "je vždy nejstarší", why: "Hlavní postavou může být i dítě." },
    { value: "objeví se jen jednou", why: "Hlavní postava se objevuje nejčastěji." },
    { value: "je vždy nejkrásnější", why: "Vzhled o tom nerozhoduje." },
  ], {
    hints: ["O kom se v příběhu vypráví nejvíc?", "Hlavní postava je ta, kvůli které příběh vůbec je. Děje se hlavně jí a objevuje se skoro všude."],
    explanation: "Hlavní postava je ta, kolem které se děj točí — objevuje se nejčastěji.",
  }),
  choice("Co dělá vedlejší postava?", "pomáhá nebo překáží hlavní postavě", [
    { value: "je ta, o které je celý příběh", why: "To je hlavní postava." },
    { value: "vypráví celý příběh", why: "To je vypravěč." },
    { value: "napsala celou knihu", why: "To je autor." },
  ], {
    hints: ["Kdo stojí v příběhu kolem hlavního hrdiny?", "Vedlejší postavy děj doplňují — třeba hrdinovi radí, pomáhají mu, nebo mu naopak ztěžují cestu."],
    explanation: "Vedlejší postava doplňuje děj — pomáhá nebo překáží hlavní postavě.",
  }),
  choice("Která slova popisují vzhled postavy?", "vysoký, zrzavý, s brýlemi", [
    { value: "odvážný, laskavý, lstivý", why: "Tato slova popisují povahu." },
    { value: "rychle, potichu, opatrně", why: "Tato slova říkají, jak se něco dělá." },
    { value: "včera, potom, nakonec", why: "Tato slova říkají čas." },
  ], {
    hints: ["Která slova popisují, co na postavě uvidíš očima?", "Vzhled je to, co by bylo vidět na obrázku postavy: výška, vlasy, brýle, oblečení."],
    explanation: "Vysoký, zrzavý, s brýlemi — to je vidět, jde o vzhled.",
  }),
  choice("Která slova popisují povahu postavy?", "odvážný, laskavý, lstivý", [
    { value: "vysoký, zrzavý, s brýlemi", why: "Tato slova popisují vzhled." },
    { value: "rychle, potichu, opatrně", why: "Tato slova říkají, jak se něco dělá." },
    { value: "včera, potom, nakonec", why: "Tato slova říkají čas." },
  ], {
    hints: ["Která slova popisují, jaká postava je uvnitř?", "Povahu na obrázku neuvidíš. Poznáš ji podle toho, jak se postava chová k ostatním."],
    explanation: "Odvážný, laskavý, lstivý popisují povahu — jaká postava je.",
  }),
  choice("Jaká bývá kladná postava v pohádce?", "odvážná a hodná", [
    { value: "závistivá a zlá", why: "To jsou vlastnosti záporné postavy." },
    { value: "vysoká a s dlouhými vlasy", why: "To je vzhled, ne to, jestli je kladná." },
    { value: "bohatá a s korunou", why: "Bohatství o dobrotě nic neříká." },
  ], {
    hints: ["Komu v pohádce fandíš?", "Kladná postava je ta dobrá — pomáhá druhým a nebojí se."],
    explanation: "Kladná postava je dobrá — bývá odvážná, hodná a pomáhá druhým.",
  }),
  choice("Jaká bývá záporná postava v pohádce?", "závistivá a krutá", [
    { value: "odvážná a hodná", why: "To jsou vlastnosti kladné postavy." },
    { value: "malá a s krátkými vlasy", why: "To je vzhled, ne povaha." },
    { value: "chudá a veselá", why: "Chudoba ani veselost ze zlé postavy nedělají." },
  ], {
    hints: ["Kdo v pohádce škodí druhým?", "Záporná postava je ta zlá — závidí, lže a ubližuje ostatním."],
    explanation: "Záporná postava bývá závistivá, krutá a lstivá.",
  }),
  choice("Ve kterém příkladu autor řekne vlastnost postavy přímo?", "Honza byl odvážný.", [
    { value: "Honza vběhl do hořícího domu pro kočku.", why: "Tady odvahu poznáme z činu, autor ji nepojmenuje." },
    { value: "Honza zavolal: „Pomůžu ti!“", why: "Tady poznáme vlastnost z řeči postavy." },
    { value: "Honza dostal od krále medaili.", why: "Tady se vlastnost jen domýšlíme." },
  ], {
    hints: ["Ve které větě je vlastnost napsaná jedním slovem?", "Autor může vlastnost rovnou pojmenovat, nebo ji ukázat na tom, co postava dělá a říká."],
    explanation: "„Honza byl odvážný“ vlastnost přímo pojmenuje.",
  }),
  choice("Ve kterém příkladu poznáš vlastnost z toho, co postava dělá?", "Anna se rozdělila o svačinu se spolužákem.", [
    { value: "Anna byla vždycky štědrá.", why: "Tady je vlastnost řečená přímo." },
    { value: "Anna chodí do 4.B na naší škole.", why: "Tady se o povaze nic nedozvíme." },
    { value: "Anna bydlí v Brně u parku.", why: "Tady se o povaze nic nedozvíme." },
  ], {
    hints: ["Ve které větě Anna něco dělá?", "Vlastnost se dá ukázat na činu: kdo se rozdělí, je štědrý, i když to autor nenapíše."],
    explanation: "Z toho, že se Anna rozdělila o svačinu, poznáme, že je štědrá.",
  }),
  choice("Kdo je v pohádce o Popelce hlavní postava?", "Popelka", [
    { value: "macecha", why: "Macecha je důležitá, ale příběh se netočí kolem ní." },
    { value: "princ", why: "Princ je vedlejší postava." },
    { value: "holubičky", why: "Holubičky Popelce pomáhají — jsou vedlejší." },
  ], {
    hints: ["Po kom se pohádka jmenuje?", "Hlavní postava je ta, jejíž příběh sledujeme od začátku do konce."],
    explanation: "Pohádka vypráví o Popelce — ta je hlavní postava.",
  }),
  choice("Kdo je v pohádce o Popelce záporná postava?", "macecha", [
    { value: "Popelka", why: "Popelka je kladná hlavní postava." },
    { value: "princ", why: "Princ je kladná postava." },
    { value: "holubičky", why: "Holubičky Popelce pomáhají." },
  ], {
    hints: ["Kdo se k Popelce choval zle?", "Záporná postava hrdince škodí — dává jí těžkou práci a nepouští ji na ples."],
    explanation: "Macecha se k Popelce chová zle — je to záporná postava.",
  }),
  choice("Kdo je vypravěč?", "ten, kdo příběh vypráví", [
    { value: "vždy hlavní postava", why: "Vypravěč může stát i mimo příběh." },
    { value: "vždy záporná postava", why: "To neplatí." },
    { value: "ten, kdo příběh čte", why: "To je čtenář." },
  ], {
    hints: ["Čí hlas slyšíš, když čteš příběh?", "Vypravěč může být jednou z postav (Jmenuji se Ema…) nebo stojí mimo děj a jen o něm vypráví."],
    explanation: "Vypravěč je ten, kdo příběh vypráví — může být postavou, nebo stát mimo děj.",
  }),
  choice("Co se o postavě dozvíš z toho, co říká?", "jaká je a co si myslí", [
    { value: "kolik je jí přesně let", why: "Věk z řeči většinou nepoznáme." },
    { value: "jakou má barvu očí", why: "Barvu očí z řeči nepoznáš." },
    { value: "kde přesně bydlí", why: "Bydliště z řeči většinou nepoznáme." },
  ], {
    hints: ["Co prozradí věta „Nechte to na mně, já to zvládnu!“?", "Z řeči poznáš, jak postava přemýšlí a jakou má povahu — třeba odvážnou, bojácnou, nebo nafoukanou."],
    explanation: "Z toho, co postava říká, poznáme její povahu a myšlenky.",
  }),
  choice("Může se postava během příběhu změnit?", "ano, může se něco naučit", [
    { value: "ne, zůstává stále stejná", why: "Mnoho postav se během příběhu změní." },
    { value: "ano, ale jen vzhledem", why: "Mění se hlavně povaha nebo názor." },
    { value: "ne, v příbězích se nikdo nemění", why: "Právě změna bývá na příběhu zajímavá." },
  ], {
    hints: ["Jaký byl lakomec na začátku příběhu a jaký na konci?", "Postava může v příběhu dospět, poučit se z chyby nebo změnit názor."],
    explanation: "Postava se může během příběhu změnit — něco se naučí, poučí se z chyby.",
  }),
];

const L2: PracticeTask[] = [
  uryvek("Petr mlčky pomohl paní přenést těžké tašky, i když ho nikdo nežádal.", "Jaký Petr je?", "ochotný", [
    ["líný", "Líný by tašky nenesl."], ["zlý", "Zlý by nepomohl."], ["smutný", "O smutku úryvek nic neříká."],
  ], ["Co Petr udělal a proč?", "Pomohl sám od sebe, bez žádosti. Taková vlastnost se pozná z činu."], "Petr pomohl, i když ho nikdo nežádal — je ochotný."),
  uryvek("Marta se usmívala na každého, kdo šel kolem.", "Jaká Marta je?", "přátelská", [
    ["zlá", "Zlý člověk se na každého neusmívá."], ["lakomá", "O penězích úryvek nic neříká."], ["unavená", "O únavě úryvek nic neříká."],
  ], ["Co Marta dělá?", "Úsměv na každého ukazuje, jak se Marta chová k lidem kolem sebe."], "Marta se usmívá na každého — je přátelská."),
  uryvek("Filip se nikdy nechlubil, i když vyhrál soutěž.", "Jaký Filip je?", "skromný", [
    ["chlubivý", "Úryvek říká opak."], ["líný", "Kdo vyhraje soutěž, asi líný není."], ["zlý", "O zlobě úryvek nic neříká."],
  ], ["Co Filip nedělá, i když by mohl?", "Kdo se nechlubí ani po vítězství, má jednu vlastnost — opak chlubivosti."], "Filip se nechlubí ani po vítězství — je skromný."),
  uryvek("Eliška zabouchla dveře a beze slova odešla.", "Jak se asi Eliška cítila?", "byla naštvaná", [
    ["byla šťastná", "Šťastný člověk dveřmi nebouchá."], ["byla ospalá", "Ospalý člověk nebouchá dveřmi."], ["měla hlad", "O hladu úryvek nic neříká."],
  ], ["Kdy lidé bouchají dveřmi?", "Pocit není řečený. Poznáš ho podle toho, co Eliška udělala."], "Zabouchnutí dveří a odchod beze slova ukazují, že byla naštvaná."),
  uryvek("Babička si vždycky našla čas vyslechnout každého, kdo měl starost.", "Jaká babička je?", "trpělivá a laskavá", [
    ["netrpělivá", "Úryvek říká opak."], ["zapomnětlivá", "O paměti úryvek nic neříká."], ["chlubivá", "O chlubení úryvek nic neříká."],
  ], ["Co babička dělá pro lidi se starostmi?", "Kdo si pro druhé vždycky najde čas a poslouchá je, má dobré vlastnosti."], "Babička si vždy najde čas a naslouchá — je trpělivá a laskavá."),
  uryvek("Královna záviděla Sněhurce krásu a chtěla jí ublížit.", "Jaké vlastnosti královna má?", "závist a krutost", [
    ["odvahu a dobrotu", "To jsou vlastnosti kladné postavy."], ["skromnost a pracovitost", "To úryvek neukazuje."], ["veselost a ochotu", "To úryvek neukazuje."],
  ], ["Co královna cítí a co chce udělat?", "Úryvek jmenuje jeden pocit a jeden záměr. Oba ukazují na zápornou postavu."], "Královna závidí a chce ublížit — má vlastnosti záporné postavy."),
  uryvek("Tomáš je chytrý, ale bojí se tmy a někdy zalže, aby se vyhnul potížím.", "Jaká je to postava?", "má dobré i slabé stránky", [
    ["je jen dobrá", "Tomáš má i slabé stránky."], ["je jen zlá", "Tomáš je i chytrý."], ["nemá žádné vlastnosti", "Úryvek vyjmenovává několik vlastností."],
  ], ["Kolik vlastností úryvek vyjmenuje a jaké jsou?", "Najdi v úryvku dobrou vlastnost a pak ty slabší. Jsou tam obojí."], "Tomáš je chytrý, ale bojí se a lže — má dobré i slabé stránky."),
  choice("Ve kterém popisu jsou jen vlastnosti vzhledu?", "Vysoký muž s šedivým vousem.", [
    { value: "Klidný a moudrý stařec.", why: "Klid a moudrost jsou povaha." },
    { value: "Muž, který rád pomáhá.", why: "Ochota je povaha." },
    { value: "Muž, který nikdy nelže.", why: "Poctivost je povaha." },
  ], {
    hints: ["Který popis by šel nakreslit?", "Vzhled je vidět na obrázku. Povahu na obrázku nenakreslíš."],
    explanation: "Výška a šedivý vous jsou vidět — jde o vzhled.",
  }),
  choice("Proč autor často vlastnost neřekne, ale ukáže ji na tom, co postava dělá?", "čtenář si ji domyslí a příběh je živější", [
    { value: "protože autor neumí dobře psát", why: "Je to záměr, ne neumětelství." },
    { value: "protože je to v knihách zakázané", why: "Zakázané to není." },
    { value: "protože čtenáře to vůbec nebaví", why: "Naopak — čtenáře baví domýšlet." },
  ], {
    hints: ["Co je napínavější: „byl odvážný“, nebo „vběhl do hořícího domu“?", "Když čtenář vlastnost pozná z činu, víc ho to vtáhne a lépe si postavu představí."],
    explanation: "Když čtenář vlastnost pozná sám z činu, příběh je živější a přesvědčivější.",
  }),
  choice("V příběhu drak brání hrdinovi dostat se k princezně. Jakou roli má drak?", "je hrdinův protivník", [
    { value: "je hrdinův pomocník", why: "Pomocník by hrdinovi pomáhal, ne bránil." },
    { value: "vypráví příběh", why: "Vypravěč děj vypráví, nebojuje." },
    { value: "je hlavní postava", why: "Příběh se točí kolem hrdiny." },
  ], {
    hints: ["Pomáhá drak hrdinovi, nebo mu stojí v cestě?", "Postava, která hlavnímu hrdinovi brání v cíli, je jeho soupeř."],
    explanation: "Drak hrdinovi brání — je to jeho protivník.",
  }),
  choice("Kterou větou autor ukáže, že je Jakub odvážný, aniž to napíše?", "Jakub vlezl do tmavého sklepa, i když se ostatní báli.", [
    { value: "Jakub byl odvážný.", why: "Tady je vlastnost napsaná přímo." },
    { value: "Jakub byl velmi odvážný kluk.", why: "Tady je vlastnost napsaná přímo." },
    { value: "Jakub měl modrou bundu.", why: "Bunda o odvaze nic neřekne." },
  ], {
    hints: ["Ve které větě Jakub dělá něco, na co ostatní nemají?", "Vlastnost ukázaná činem: postava udělá něco, co vyžaduje odvahu, a čtenář si to domyslí."],
    explanation: "Když Jakub vleze do tmavého sklepa, i když se ostatní bojí, poznáme odvahu z činu.",
  }),
  choice("Jak poznáš hlavní postavu v knize, kterou čteš?", "objevuje se nejčastěji a děj se točí kolem ní", [
    { value: "je vždy na obálce první", why: "Obálka o tom nerozhoduje." },
    { value: "je vždy nejstarší", why: "Věk o tom nerozhoduje." },
    { value: "je vždy zvíře", why: "Hlavní postava může být kdokoli." },
  ], {
    hints: ["O kom se v knize píše na většině stránek?", "Hlavní postavu poznáš podle toho, jak často v příběhu vystupuje a jak moc se jí děj týká."],
    explanation: "Hlavní postava se objevuje nejčastěji a děj se točí hlavně kolem ní.",
  }),
  choice("Proč mají pohádky jasně dobré a jasně zlé postavy?", "aby i malý čtenář hned poznal, kdo je kdo", [
    { value: "protože v pohádkách nejsou lidé", why: "Lidé v pohádkách jsou." },
    { value: "aby byla pohádka delší", why: "O délku nejde." },
    { value: "protože to přikazuje zákon", why: "Žádný zákon to nepřikazuje." },
  ], {
    hints: ["Pro koho se pohádky vyprávějí?", "Pohádky jsou pro nejmenší. Jednoduché dělení na dobré a zlé jim pomáhá příběhu rozumět."],
    explanation: "Jasně dobré a zlé postavy pomáhají malým čtenářům hned pochopit, komu fandit.",
  }),
];

const L3: PracticeTask[] = [
  uryvek("Pan Hrubý na děti často křičel, ale když napadl sníh, potichu jim uklidil chodník před školou.", "Co o panu Hrubém můžeš říct?", "vypadá přísně, ale má dobré srdce", [
    ["je jen zlý a nemá rád děti", "Uklidil dětem chodník — jen zlý není."], ["je jen hodný a na nikoho nekřičí", "Na děti ale křičí."], ["nemá rád zimu a sníh", "O tom úryvek nic neříká."],
  ], ["Jak se pan Hrubý chová navenek a co udělá potichu?", "Úryvek ukazuje dvě stránky postavy: jak se chová, když ho všichni vidí, a co udělá, když se nikdo nedívá. Pozor na slovo „ale“."], "Pan Hrubý křičí, ale potají dětem pomáhá — navenek je přísný, ale má dobré srdce."),
  choice("Jana chce najít ztraceného psa, ale venku se strhl prudký déšť s hromy a blesky. Co jí v příběhu stojí v cestě?", "bouřka", [
    { value: "pes", why: "Psa Jana hledá — je to její cíl, ne překážka." },
    { value: "Jana", why: "Jana je hlavní postava, která překážku teprve překonává." },
    { value: "vypravěč", why: "Vypravěč příběh jen vypráví, do děje nezasahuje." },
  ], {
    hints: ["Co se venku děje ve chvíli, kdy chce Jana vyrazit hledat?", "Hrdinovi může v cestě stát postava, ale i počasí, překážka nebo vlastní strach. Projdi možnosti a u každé se zeptej: brání tohle Janě v hledání?"],
    explanation: "Prudký déšť s hromy a blesky je bouřka — právě ta Janě brání psa najít, takže je v příběhu její překážkou.",
  }),
  choice("Dvě věty: „Petr je odvážný.“ a „Petr vběhl do hořícího domu, aby zachránil kočku.“ Která ukáže Petrovu odvahu lépe?", "druhá, protože čin přesvědčí víc", [
    { value: "první, protože je kratší", why: "Délka o přesvědčivosti nerozhoduje." },
    { value: "obě úplně stejně", why: "Čin čtenáře přesvědčí víc než pouhé tvrzení." },
    { value: "ani jedna", why: "Obě o odvaze mluví." },
  ], {
    hints: ["Čemu věříš víc — tomu, co o sobě někdo řekne, nebo tomu, co udělá?", "Tvrzení čtenáři jen oznámí vlastnost. Čin ji ukáže, čtenář ji pocítí a snáz postavě uvěří."],
    explanation: "Čin (vběhl do hořícího domu) přesvědčí čtenáře víc než pouhé tvrzení.",
  }),
  choice("Chceš ukázat, že je postava zvědavá. Kterou větu napíšeš?", "Pořád nakukovala do zamčené skříně a vyptávala se, co v ní je.", [
    { value: "Byla to hodně zvědavá holka.", why: "Vlastnost je jen řečená, ne ukázaná." },
    { value: "Měla zelené oči a dlouhé hnědé vlasy.", why: "Vzhled o zvědavosti nic neřekne." },
    { value: "Bydlela v Praze u Vltavy.", why: "Bydliště o zvědavosti nic neřekne." },
  ], {
    hints: ["Co dělá zvědavý člověk?", "Vlastnost ukážeš tak, že postava udělá něco, co pro ni je typické. Zvědavý se ptá a nakukuje."],
    explanation: "Nakukování a vyptávání zvědavost ukážou, aniž to slovo padne.",
  }),
  choice("Na začátku příběhu je Ondra sobecký, na konci se rozdělí o svačinu s novým spolužákem. Co se stalo?", "postava se během příběhu změnila", [
    { value: "Ondra je vedlejší postava", why: "To z textu nevyplývá a o změně to nic neříká." },
    { value: "Ondra byl vždycky štědrý", why: "Na začátku byl sobecký." },
    { value: "příběh nemá hlavní postavu", why: "Ondra je zjevně hlavní postava." },
  ], {
    hints: ["Jaký byl Ondra na začátku a jaký na konci?", "Když se povaha postavy mezi začátkem a koncem příběhu liší, postava prošla změnou."],
    explanation: "Ondra byl na začátku sobecký a na konci štědrý — postava se změnila.",
  }),
  choice("Vedlejší postava hrdinovi poradí, ale jinak se do děje moc nezapojuje. Jakou roli má?", "pomáhá hlavní postavě", [
    { value: "je hlavní postava", why: "Děj se netočí kolem ní." },
    { value: "je hrdinův protivník", why: "Protivník by hrdinovi škodil." },
    { value: "vypráví příběh", why: "To dělá vypravěč." },
  ], {
    hints: ["Pomáhá, nebo škodí?", "Vedlejší postava s radou je pro hrdinu oporou, i když není ve středu děje."],
    explanation: "Postava, která hrdinovi radí, mu pomáhá — je jeho pomocníkem.",
  }),
  choice("Co se dozvíš z věty „Pavla měla na sobě červené šaty“?", "jak Pavla vypadá", [
    { value: "jakou má Pavla povahu", why: "Šaty povahu neprozradí." },
    { value: "co si Pavla myslí", why: "O myšlenkách věta nic neříká." },
    { value: "jestli je Pavla kladná postava", why: "Z oblečení to nepoznáme." },
  ], {
    hints: ["Popisuje věta to, co je vidět, nebo co je uvnitř?", "Oblečení patří ke vzhledu. O povaze ani myšlenkách nic neřekne."],
    explanation: "Oblečení je vzhled — věta říká, jak Pavla vypadá.",
  }),
  choice("Jak poznáš, že je postava lakomá, i když to autor nenapíše?", "nikdy se o nic nerozdělí a počítá každou korunu", [
    { value: "podle barvy jejích vlasů", why: "Vlasy o povaze nic neřeknou." },
    { value: "podle jejího jména", why: "Jméno o povaze nic neříká." },
    { value: "podle toho, kde bydlí", why: "Bydliště o povaze nic neříká." },
  ], {
    hints: ["Co dělá lakomý člověk?", "Povahu poznáš z chování. Lakomec nerad dává a o peníze se bojí."],
    explanation: "Lakomost poznáme z chování — postava se nerozdělí a počítá každou korunu.",
  }),
  choice("Proč bývají postavy v povídkách složitější než v pohádkách?", "skuteční lidé mají dobré i slabé stránky", [
    { value: "povídky jsou vždy delší", why: "Délka nerozhoduje." },
    { value: "v povídkách nejsou zlí lidé", why: "I v povídkách jsou lidé s chybami." },
    { value: "pohádky nemají postavy", why: "Pohádky postavy mají." },
  ], {
    hints: ["Jsou lidé kolem tebe jen dobří, nebo jen zlí?", "Povídka vypráví o obyčejném životě. Lidé v něm nejsou jen hodní, nebo jen zlí — mají vlastnosti i chyby zároveň."],
    explanation: "Povídky vyprávějí o skutečném životě, kde mají lidé dobré i slabé stránky.",
  }),
  choice("Kdo vypráví příběh, který začíná „Jmenuji se Ema a včera se mi stalo něco divného“?", "sama Ema", [
    { value: "neznámý vypravěč mimo příběh", why: "Vypravěč mluví o sobě „já“ — je v příběhu." },
    { value: "ilustrátor knihy", why: "Ilustrátor kreslí obrázky." },
    { value: "čtenář", why: "Čtenář příběh čte, nevypráví." },
  ], {
    hints: ["Kdo v první větě mluví o sobě?", "Když vypravěč říká „já“ a představí se, je sám postavou příběhu."],
    explanation: "Vypravěč mluví o sobě a jmenuje se Ema — příběh vypráví sama Ema.",
  }),
  choice("Ve kterém úryvku poznáš povahu postavy z její řeči?", "„Nechte to na mně, já to zvládnu!“ zvolal Honza.", [
    { value: "Honza měl hnědé vlasy.", why: "To je vzhled, žádná řeč." },
    { value: "Honza bydlel na kraji města.", why: "To je bydliště, žádná řeč." },
    { value: "Honza šel domů.", why: "To je děj, Honza nic neříká." },
  ], {
    hints: ["Ve kterém úryvku postava mluví?", "Z toho, co a jak postava říká, poznáš její povahu — tady sebevědomí a odvahu."],
    explanation: "Honzova slova ukazují, že je odvážný a sebevědomý — poznáme to z řeči.",
  }),
  choice("Proč nám může být sympatická i postava, která udělá chybu?", "chápeme, proč to udělala, a vidíme, že se snaží", [
    { value: "protože je hlavní postava", why: "Hlavní postava sympatická být nemusí." },
    { value: "protože je hezká", why: "Vzhled o sympatiích nerozhoduje." },
    { value: "protože má hezké jméno", why: "Jméno o sympatiích nerozhoduje." },
  ], {
    hints: ["Děláš někdy chyby i ty?", "Postava s chybami je podobná skutečným lidem. Když rozumíme jejím důvodům, fandíme jí."],
    explanation: "Když chápeme důvody postavy a vidíme, že se snaží, fandíme jí i přes chyby.",
  }),
  choice("Máš popsat svou oblíbenou postavu z knihy. Co do popisu dáš?", "vzhled, povahu a co v příběhu dělá", [
    { value: "jen jméno", why: "Jméno postavu nepopíše." },
    { value: "jen barvu oblečení", why: "To je jen malá část vzhledu." },
    { value: "jen počet stran knihy", why: "To s postavou nesouvisí." },
  ], {
    hints: ["Co by kamarád potřeboval vědět, aby si postavu představil?", "Úplný popis postavy řekne, jak vypadá, jakou má povahu a jakou úlohu má v celém ději — tak si ji kamarád představí."],
    explanation: "Do popisu postavy patří vzhled, povaha a to, co v příběhu dělá.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const HLAVNIPOSTAVYAJEJICHCHARAKTERISTIKA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika",
    rvpNodeId: "g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika",
    displayName: "Postavy v příbězích",
    title: "Hlavní postavy a jejich charakteristika",
    studentTitle: "Postavy v příbězích",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Naučíš se analyzovat postavy v příbězích a rozlišit přímou a nepřímou charakteristiku.",
    keywords: ["hlavní postava", "vedlejší postava", "vzhled", "povaha", "kladná postava", "záporná postava", "charakteristika"],
    goals: [
      "Rozlišit vzhled a povahu postavy",
      "Poznat vlastnost postavy z jejího jednání a řeči",
      "Určit hlavní a vedlejší postavu",
    ],
    boundaries: ["Bez literárněvědné terminologie", "Bez psychologické analýzy"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-tvorba-na-dane-tema"],
    generator: gen,
    helpTemplate: {
      hint: "Vzhled = co je vidět; povaha = jaká postava je. Vlastnost může autor říct přímo, nebo ji ukázat na tom, co postava dělá.",
      steps: [
        "Kdo je hlavní postava? → příběh se točí kolem ní.",
        "Vzhled: jak postava vypadá.",
        "Povaha: jak se chová k ostatním.",
        "Vlastnost řečená přímo („je hodný“), nebo ukázaná činem („pomohl bez ptaní“)?",
      ],
      commonMistake: "Považovat vzhled za povahu — „vysoký“ je vzhled, „odvážný“ je povaha",
      example: "Přímo: „Jana byla odvážná.“ Z činu: „Jana skočila do vody, aby zachránila štěně.“",
    },
  },
];
