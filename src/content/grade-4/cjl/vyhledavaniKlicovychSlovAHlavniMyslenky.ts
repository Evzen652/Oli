import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Vypadly anglické pojmy
// „scanning“ a „skimming“, oslovení dítěte v mužském rodě („našel jsi“,
// „kdybys mu ho měl“), překlepy („témata věta“) a nápovědy společné pro
// celé téma. Každá úloha má vlastní nápovědy a zpětnou vazbu.
//
// L1 = co jsou klíčová slova, téma a hlavní myšlenka, jak je najít
// L2 = krátké ukázky: vyber klíčová slova, téma, hlavní myšlenku
// L3 = přenos: hlavní myšlenka z více odstavců, rejstřík, ověření údaje.

const L1: PracticeTask[] = [
  choice("Co jsou klíčová slova?", "nejdůležitější slova, která vystihují téma", [
    { value: "všechna podstatná jména v textu", why: "Ne každé podstatné jméno je důležité pro téma." },
    { value: "nejdelší slova v textu", why: "Délka o důležitosti nerozhoduje." },
    { value: "slova s háčky a čárkami", why: "Diakritika s důležitostí nesouvisí." },
  ], {
    hints: ["Která slova by stačila, abys věděl nebo věděla, o čem text je?", "Klíčová slova jsou jako klíč od textu — když je znáš, víš, o čem text je, i bez čtení všeho ostatního."],
    explanation: "Klíčová slova jsou nejdůležitější slova, podle kterých poznáme téma textu.",
  }),
  choice("Proč se klíčová slova v textu často opakují?", "jsou pro téma nejdůležitější", [
    { value: "autor zapomněl jiná slova", why: "Opakování je záměr — autor se k tématu vrací." },
    { value: "protože se rýmují", why: "S rýmem to nesouvisí." },
    { value: "protože jsou nejkratší", why: "Délka s opakováním nesouvisí." },
  ], {
    hints: ["O čem autor mluví pořád dokola?", "Když je něco hlavním tématem, autor se k tomu stále vrací — proto se ta slova opakují."],
    explanation: "Klíčová slova se opakují, protože se k nim autor stále vrací — jsou jádrem tématu.",
  }),
  choice("Podle čeho klíčová slova v učebnici snadno najdeš?", "opakují se, bývají tučně nebo v nadpisu", [
    { value: "jsou vždy na konci věty", why: "Místo ve větě o důležitosti nerozhoduje." },
    { value: "jsou vždy v závorce", why: "Závorka o důležitosti nic neříká." },
    { value: "jsou vždy nejkratší", why: "Délka o důležitosti nerozhoduje." },
  ], {
    hints: ["Jak autor v učebnici ukáže, co je důležité?", "Autor důležitá slova zvýrazní — napíše je výrazně, dá je do nadpisu nebo je zopakuje."],
    explanation: "Klíčová slova poznáme podle opakování, tučného písma nebo toho, že jsou v nadpisu.",
  }),
  choice("Jak rychle najdeš v textu určitý údaj?", "přejedu text očima a hledám důležité slovo", [
    { value: "čtu slovo po slově od začátku", why: "To trvá dlouho, když hledáš jen jeden údaj." },
    { value: "čtu jen poslední větu", why: "Údaj může být kdekoli." },
    { value: "čtu text pozpátku", why: "Pozpátku se text nečte a nic tím neušetříš." },
  ], {
    hints: ["Jak hledáš jméno v seznamu?", "Když hledáš jeden údaj, nemusíš číst všechno. Stačí přejet očima a hledat slovo, které s údajem souvisí."],
    explanation: "Když hledáme jeden údaj, přejedeme text očima a hledáme slovo, které k němu vede.",
  }),
  choice("Co je téma textu?", "o čem text je", [
    { value: "co si o textu myslím", why: "To je můj názor, ne téma." },
    { value: "jak je text dlouhý", why: "Délka není téma." },
    { value: "kdo text napsal", why: "To je autor, ne téma." },
  ], {
    hints: ["Jak bys jedním slovem řekl nebo řekla, čeho se týká článek o slonech?", "Téma se dá říct jedním slovem nebo krátce: sloni, zima, včely. Je to to, o čem se v celém příběhu nebo článku mluví od začátku do konce."],
    explanation: "Téma je to, o čem text je — dá se říct jedním nebo několika slovy.",
  }),
  choice("Co je hlavní myšlenka textu?", "co nám text o tématu hlavně říká", [
    { value: "nadpis textu", why: "Nadpis myšlenku jen naznačí." },
    { value: "nejdelší věta textu", why: "Délka o důležitosti nerozhoduje." },
    { value: "jméno autora", why: "Autor není myšlenka." },
  ], {
    hints: ["Co si z textu máš zapamatovat, i když zapomeneš podrobnosti?", "Téma je, o čem text je. To hlavní, co o tom text tvrdí, se dá říct jednou celou větou."],
    explanation: "Hlavní myšlenka je to nejdůležitější, co text o tématu říká — dá se vyjádřit jednou větou.",
  }),
  choice("Jaký je rozdíl mezi tématem a hlavní myšlenkou?", "téma je o čem, myšlenka je co se o tom říká", [
    { value: "je to totéž", why: "Téma je kratší — jen o čem text je." },
    { value: "téma je vždy delší", why: "Téma bývá kratší, jen slovo nebo dvě." },
    { value: "myšlenka je vždy v závorce", why: "Závorka s tím nesouvisí." },
  ], {
    hints: ["Který z těch dvou pojmů se dá říct jedním slovem?", "U textu o včelách je jedno z nich „včely“ a druhé celá věta „včely pomáhají rostlinám“. Které je které?"],
    explanation: "Téma říká, o čem text je (včely). Hlavní myšlenka říká, co o tom text tvrdí (včely pomáhají rostlinám).",
  }),
  choice("Které slovo je klíčové v textu o deštném pralese?", "stromy", [
    { value: "krásný", why: "„Krásný“ je obecné slovo, téma nevystihne." },
    { value: "pondělí", why: "Den v týdnu s tématem nesouvisí." },
    { value: "a", why: "Spojka „a“ je v každém textu, nic neřekne." },
  ], {
    hints: ["Které slovo souvisí s tím, co v tom místě roste?", "Klíčové slovo musí patřit k tématu. Obecná slova, spojky nebo dny v týdnu vystihnou jakýkoli text."],
    explanation: "„Stromy“ patří k tématu deštného lesa. Ostatní slova by se hodila do jakéhokoli textu.",
  }),
  choice("Která slova jsou klíčová v textu o zimě?", "sníh, mráz, led", [
    { value: "pondělí, středa, pátek", why: "Dny v týdnu zimu nevystihují." },
    { value: "stůl, okno, dveře", why: "Tato slova se zimou nesouvisí." },
    { value: "rychle, pomalu, hned", why: "Tato slova říkají jak, ne o čem." },
  ], {
    hints: ["Která slova tě napadnou, když se řekne zima?", "Klíčová slova patří k tématu. Hledej skupinu, podle které hned poznáš roční období."],
    explanation: "Sníh, mráz a led patří k zimě — to jsou klíčová slova.",
  }),
  choice("Co ti napoví nadpis?", "o čem text asi bude", [
    { value: "kolik má text stran", why: "Nadpis délku neříká." },
    { value: "kdo text napsal", why: "Autor bývá uveden jinde." },
    { value: "nic, je jen ozdoba", why: "Nadpis je důležitá nápověda." },
  ], {
    hints: ["Proč se nadpis píše nad text?", "Autor vybírá nadpis tak, aby čtenáři hned řekl, čeho se text týká."],
    explanation: "Nadpis napoví, o čem text bude — často ukazuje téma.",
  }),
  choice("K čemu slouží tučné písmo v učebnici?", "upozorní na důležité pojmy", [
    { value: "označuje chyby", why: "Chyby se tučně neoznačují." },
    { value: "je tam jen pro ozdobu", why: "Tučné písmo má svůj účel." },
    { value: "ukazuje nejméně důležitá slova", why: "Je to naopak." },
  ], {
    hints: ["Proč by autor chtěl, aby ti některé slovo hned padlo do oka?", "To, co je napsané výrazně, je autorův vzkaz: tohle je důležité, tohle si zapamatuj. Méně důležité věci takhle nezvýrazňuje."],
    explanation: "Tučně jsou napsané důležité pojmy, abychom si jich hned všimli.",
  }),
  choice("Co je rejstřík v knize?", "abecední seznam pojmů s čísly stran", [
    { value: "seznam kapitol v pořadí", why: "To je obsah." },
    { value: "seznam obrázků", why: "Seznam obrázků rejstřík není." },
    { value: "poslední kapitola", why: "Rejstřík není kapitola." },
  ], {
    hints: ["Jak v knize rychle najdeš, na které straně je určitý pojem?", "Rejstřík bývá na konci knihy a řadí pojmy podle abecedy. U každého je číslo strany."],
    explanation: "Rejstřík je abecední seznam pojmů s čísly stran, kde se o nich píše.",
  }),
  choice("Co najdeš v obsahu knihy?", "seznam kapitol s čísly stran", [
    { value: "abecední seznam pojmů", why: "To je rejstřík." },
    { value: "slovníček cizích slov", why: "Slovníček je samostatná část." },
    { value: "jméno ilustrátora", why: "To bývá na titulní straně." },
  ], {
    hints: ["Kde zjistíš, jaké kapitoly kniha má?", "Obsah řadí kapitoly tak, jak jdou za sebou, a u každé je číslo strany."],
    explanation: "Obsah je seznam kapitol v pořadí, jak jdou v knize, s čísly stran.",
  }),
];

const VCELY = "Včely létají z květu na květ. Přenášejí pyl, a tak květy opylují. Z opylených květů pak vyrostou plody. Bez včel by bylo méně ovoce.";
const JEZEK = "Ježek je aktivní hlavně v noci. Přes den spí v listí, v noci loví hmyz a žížaly. Na zimu si postaví hnízdo a upadne do zimního spánku.";

const L2: PracticeTask[] = [
  choice(`Která slova jsou klíčová v textu: „${VCELY}“`, "včely, pyl, opylování, ovoce", [
    { value: "květ, létají, pak, méně", why: "Tato slova v textu jsou, ale téma nevystihnou." },
    { value: "a, tak, bez, by", why: "To jsou malá pomocná slova, v každém textu." },
    { value: "zahrada, léto, slunce, teplo", why: "Tato slova v textu vůbec nejsou." },
  ], {
    hints: ["O čem text vypráví a co včely dělají?", "Klíčová slova řeknou, kdo, co dělá a proč je to důležité. Pomocná slova ani slova, která v textu nejsou, to nesplní."],
    explanation: "Včely, pyl, opylování a ovoce vystihují, o čem text je a proč je to důležité.",
  }),
  choice(`Jaké je téma textu: „${VCELY}“`, "včely a opylování", [
    { value: "sklizeň jablek", why: "O sklizni text nemluví." },
    { value: "hmyz v zimě", why: "Zima v textu není." },
    { value: "pěstování květin", why: "Text je o tom, co dělají včely, ne o pěstování." },
  ], {
    hints: ["O kom a o čem text mluví ve všech větách?", "Téma zachytí, o čem jsou všechny věty dohromady. Nepatří do něj věci, které v textu nejsou."],
    explanation: "Text je o včelách a o tom, jak opylují květy.",
  }),
  choice(`Jaká je hlavní myšlenka textu: „${VCELY}“`, "Včely opylují květy, a tak pomáhají růst ovoci.", [
    { value: "Včely létají z květu na květ.", why: "To je pravda, ale hlavní sdělení to není." },
    { value: "Květy mají pěkné barvy a voní.", why: "To text neříká." },
    { value: "Ovoce je zdravé a chutné.", why: "O zdraví text nemluví." },
  ], {
    hints: ["Proč je podle textu dobře, že včely létají z květu na květ?", "Hlavní myšlenka spojí všechny věty do jedné: co včely dělají a co dobrého z toho pro nás plyne."],
    explanation: "Text říká, že včely opylují květy, a díky tomu roste ovoce.",
  }),
  choice(`Která slova jsou klíčová v textu: „${JEZEK}“`, "ježek, noc, lov, zimní spánek", [
    { value: "přes, den, si, a", why: "To jsou pomocná slova." },
    { value: "listí, hnízdo, hmyz, žížaly", why: "Jsou v textu, ale samy o sobě ježka nevystihnou." },
    { value: "pes, kočka, dům, zahrada", why: "Tato slova v textu nejsou." },
  ], {
    hints: ["O kom text je a čím je jeho život zvláštní?", "Klíčová slova vystihnou hlavní postavu a to nejdůležitější o ní: kdy je vzhůru a co dělá v zimě."],
    explanation: "Ježek, noc, lov a zimní spánek vystihují to hlavní o životě ježka.",
  }),
  choice(`Jaká je hlavní myšlenka textu: „${JEZEK}“`, "Ježek je vzhůru v noci a zimu prospí.", [
    { value: "Ježek má bodliny.", why: "To je pravda, ale text o tom nemluví." },
    { value: "Žížaly žijí v zemi.", why: "Text je o ježkovi, ne o žížalách." },
    { value: "Listí padá na podzim.", why: "To text neříká." },
  ], {
    hints: ["Co si o ježkovi z textu zapamatuješ nejvíc?", "Hlavní myšlenka shrne celý text jednou větou — kdy je ježek aktivní a co dělá v zimě."],
    explanation: "Text říká, že ježek je aktivní v noci a na zimu upadá do zimního spánku.",
  }),
  choice("V textu o Praze hledáš, kolik lidí v ní žije. Na které slovo se zaměříš?", "obyvatelé", [
    { value: "Vltava", why: "Vltava je řeka, o počtu lidí nic neřekne." },
    { value: "most", why: "Most s počtem lidí nesouvisí." },
    { value: "hrad", why: "Hrad s počtem lidí nesouvisí." },
  ], {
    hints: ["Jak se říká lidem, kteří v nějakém městě žijí?", "Když hledáš údaj, hledej slovo, které se k němu v textu nejspíš váže."],
    explanation: "Počet lidí najdeme u slova „obyvatelé“ — to budeme očima hledat.",
  }),
  choice("V učebnici hledáš slovo „fotosyntéza“. Kde ho najdeš nejrychleji?", "v rejstříku na konci knihy", [
    { value: "přečtu celou učebnici", why: "To by trvalo příliš dlouho." },
    { value: "prohlédnu jen obrázky", why: "Na obrázcích slovo nemusí být." },
    { value: "přečtu jen první kapitolu", why: "Slovo může být v jiné kapitole." },
  ], {
    hints: ["Která část knihy řadí pojmy podle abecedy?", "V jedné části knihy jsou pojmy seřazené podle abecedy s čísly stran. Stačí najít písmeno F."],
    explanation: "V rejstříku najdeme pojem podle abecedy a hned vidíme číslo strany.",
  }),
  choice("Klíčová slova textu jsou „sopka, láva, výbuch, popel“. O čem text asi je?", "o sopkách", [
    { value: "o počasí", why: "Tato slova s počasím nesouvisí." },
    { value: "o vaření", why: "Láva a popel nejsou z kuchyně." },
    { value: "o sportu", why: "Tato slova se sportem nesouvisí." },
  ], {
    hints: ["Co mají tato slova společného?", "Klíčová slova ukazují na jedno téma. Láva, výbuch a popel patří k jednomu přírodnímu jevu."],
    explanation: "Všechna klíčová slova patří k sopkám — text je o sopkách.",
  }),
  choice("Klíčová slova textu jsou „kolo, přilba, přechod, semafor“. O čem text asi je?", "o bezpečné jízdě na kole", [
    { value: "o výletě do hor", why: "Semafor ani přechod na horách nejsou." },
    { value: "o zvířatech v lese", why: "Žádné slovo o zvířatech tu není." },
    { value: "o vaření polévky", why: "Tato slova s vařením nesouvisí." },
  ], {
    hints: ["Kde potřebuješ přilbu, přechod a semafor?", "Klíčová slova spoj dohromady: jízda na kole a pravidla na silnici."],
    explanation: "Kolo, přilba, přechod a semafor patří k bezpečné jízdě na kole v provozu.",
  }),
  choice("Proč hlavní myšlenku píšeme vlastními slovy?", "ukážeme, že jsme textu porozuměli", [
    { value: "vlastní slova jsou vždy kratší", why: "Nemusí být kratší." },
    { value: "z textu se nesmí opsat ani slovo", why: "Některá slova použít můžeme." },
    { value: "je to jen hezčí", why: "Nejde o vzhled, ale o porozumění." },
  ], {
    hints: ["Musíš textu rozumět, když jen opíšeš větu?", "Opsat jde i bez porozumění. Říct to vlastními slovy dokáže jen ten, kdo textu rozumí."],
    explanation: "Vlastními slovy dokážeme hlavní myšlenku říct jen tehdy, když textu rozumíme.",
  }),
  choice("Jak si pomůžeš, když hledáš hlavní myšlenku?", "zeptám se: Co mi text hlavně chce říct?", [
    { value: "spočítám odstavce", why: "Počet odstavců o myšlence nic neřekne." },
    { value: "najdu nejdelší slovo", why: "Délka slova nepomůže." },
    { value: "přečtu jen nadpis", why: "Nadpis myšlenku jen naznačí." },
  ], {
    hints: ["Na co se zeptáš sám sebe po přečtení?", "Hlavní myšlenku najdeš otázkou po smyslu celého textu, ne počítáním nebo jeho vzhledem."],
    explanation: "Pomůže otázka: Co mi text hlavně chce říct? Odpověď je hlavní myšlenka.",
  }),
  choice("Co je myšlenková mapa?", "téma uprostřed a kolem něj důležitá slova", [
    { value: "mapa města", why: "Tady nejde o zeměpisnou mapu." },
    { value: "opsaný celý text", why: "Mapa je naopak krátká." },
    { value: "seznam slov podle abecedy", why: "Mapa řadí slova kolem tématu, ne podle abecedy." },
  ], {
    hints: ["Jak by vypadal obrázek, kde je uprostřed slovo „včely“ a od něj vedou čáry?", "Uprostřed je to hlavní, na koncích paprsků věci, které k tomu patří — třeba med, úl, květy. Takový obrázek pomáhá myšlenky uspořádat."],
    explanation: "Myšlenková mapa má téma uprostřed a kolem něj důležitá slova, která k němu patří.",
  }),
  choice("Proč se v textu o psech často opakuje slovo „pes“?", "vystihuje téma textu", [
    { value: "autor neznal jiná slova", why: "Opakování je záměr." },
    { value: "pes je krátké slovo", why: "Délka s tím nesouvisí." },
    { value: "je to chyba", why: "Není to chyba — tak poznáme téma." },
  ], {
    hints: ["O kom celý text je?", "Slovo, které se opakuje nejvíc, obvykle ukazuje, o čem text je."],
    explanation: "Slovo „pes“ se opakuje, protože vystihuje téma — text je o psech.",
  }),
];

const L3: PracticeTask[] = [
  choice("Text má tři odstavce: proč se kácejí lesy, jak to škodí zvířatům a jak lesy chránit. Jaká je hlavní myšlenka celého textu?", "Kácení lesů škodí a lesy je potřeba chránit.", [
    { value: "Lesy se v mnoha zemích kácejí.", why: "To je jen první odstavec." },
    { value: "Zvířata žijí v lese a mají tam domov.", why: "To je jen část druhého odstavce." },
    { value: "Stromy jsou vysoké a mají zelené listí.", why: "To text neřeší." },
  ], {
    hints: ["Která věta zahrne všechny tři odstavce?", "Hlavní myšlenka celého textu musí platit pro všechny odstavce, ne jen pro jeden."],
    explanation: "Hlavní myšlenka spojí všechny odstavce: kácení škodí a lesy je potřeba chránit.",
  }),
  choice("V rejstříku stojí „fotosyntéza 45, 78, 112“. Co to znamená?", "o fotosyntéze se píše na stranách 45, 78 a 112", [
    { value: "fotosyntéza má tři různé významy", why: "Čísla jsou strany, ne významy." },
    { value: "kniha má 112 stran", why: "Číslo neříká, kolik má kniha stran." },
    { value: "fotosyntéza je jen na straně 45", why: "Stran je víc." },
  ], {
    hints: ["Co v rejstříku znamenají čísla za pojmem?", "Za pojmem v rejstříku jsou čísla stran, kde se o něm v knize píše. Může jich být víc."],
    explanation: "Čísla v rejstříku jsou strany — o fotosyntéze se píše na třech místech knihy.",
  }),
  choice("Klíčová slova jsou „sopka, láva, výbuch, popel“. Které téma to určitě NENÍ?", "předpověď počasí", [
    { value: "sopečná činnost", why: "To přesně odpovídá klíčovým slovům." },
    { value: "přírodní katastrofy", why: "Výbuch sopky je přírodní katastrofa." },
    { value: "jak vznikají hory", why: "Sopky s horami souvisejí." },
  ], {
    hints: ["Které téma s lávou a popelem nemá nic společného?", "Tři témata se sopkami souvisejí. Jedno patří do úplně jiného oboru."],
    explanation: "Předpověď počasí se sopkami nesouvisí. Ostatní témata ke klíčovým slovům sedí.",
  }),
  choice("Nadpis zní „Proč včely mizí?“ a první věta „Včel po celém světě ubývá.“ O čem bude text?", "o příčinách a následcích úbytku včel", [
    { value: "o výrobě medu", why: "Nadpis se ptá, proč včely mizí, ne jak se dělá med." },
    { value: "o včelařském oblečení", why: "To nadpis ani první věta nenaznačují." },
    { value: "o motýlech", why: "Text je o včelách." },
  ], {
    hints: ["Na co se nadpis ptá?", "Nadpis s otázkou „proč“ slibuje vysvětlení. První věta řekne, čeho se týká."],
    explanation: "Nadpis se ptá proč a první věta mluví o úbytku včel — text vysvětlí příčiny a následky.",
  }),
  choice("Hlavní myšlenka není v textu napsaná jednou větou. Jak ji najdeš?", "spojím důležitá slova a řeknu ji vlastními slovy", [
    { value: "bez takové věty ji najít nejde", why: "Jde — složíš ji z celého textu." },
    { value: "opíšu první větu", why: "První věta nemusí zachytit celý text." },
    { value: "vyberu nejdelší slovo", why: "Délka slova nepomůže." },
  ], {
    hints: ["Co mají všechny odstavce společného?", "Když autor myšlenku neřekne přímo, poskládáš ji sám nebo sama z toho, o čem se v textu mluví."],
    explanation: "Spojíme důležitá slova a obsah odstavců a hlavní myšlenku řekneme vlastními slovy.",
  }),
  choice("V textu o dějinách je rok 1989. Co ověříš, než ho napíšeš jako odpověď na otázku, kdy padl komunistický režim?", "že se věta s tím rokem týká této události", [
    { value: "nic, stačí najít jakýkoli rok", why: "V textu může být víc roků k různým událostem." },
    { value: "že je rok napsaný tučně", why: "Tučné písmo o správnosti nerozhoduje." },
    { value: "kolik je v textu dalších čísel", why: "Počet čísel nic neověří." },
  ], {
    hints: ["Mohl by se ten rok týkat něčeho jiného?", "Najít číslo nestačí. Přečti větu kolem něj a zkontroluj, že mluví o té události, na kterou se ptáš."],
    explanation: "Musíme ověřit, že věta s rokem 1989 opravdu mluví o pádu režimu.",
  }),
  choice("Slovo „koruna“ je důležité v textu o stromech i v textu o penězích. Co z toho plyne?", "význam slova záleží na textu", [
    { value: "oba texty jsou o tom samém", why: "Jeden je o stromech, druhý o penězích." },
    { value: "koruna znamená jen peníze", why: "Koruna je i vrchní část stromu." },
    { value: "slova mají vždy jen jeden význam", why: "Mnoho slov má víc významů." },
  ], {
    hints: ["Co znamená koruna u stromu a co v peněžence?", "Stejné slovo může v různých textech znamenat něco jiného. Rozhodují okolní slova."],
    explanation: "Slovo „koruna“ má víc významů — co znamená, poznáme podle textu, ve kterém je.",
  }),
  choice("Kdy použiješ rejstřík, a ne obsah?", "když hledám pojem a nevím, v které kapitole je", [
    { value: "když chci vědět, jaké kapitoly kniha má", why: "Na to je obsah." },
    { value: "když čtu knihu od začátku", why: "Pak nic hledat nepotřebuji." },
    { value: "nikdy, dělají totéž", why: "Obsah řadí kapitoly, rejstřík pojmy." },
  ], {
    hints: ["Která část knihy řadí jednotlivé pojmy podle abecedy?", "Obsah ukazuje kapitoly v pořadí. Rejstřík ukazuje, na které straně najdeš konkrétní slovo, i když nevíš, kde v knize je."],
    explanation: "Rejstřík použijeme, když hledáme konkrétní pojem a nevíme, ve které kapitole je.",
  }),
  choice("Text má odstavce o hvězdách, planetách a Měsíci. Které slovo vystihne téma celého textu?", "vesmír", [
    { value: "hvězdy", why: "To je jen jeden odstavec." },
    { value: "planety", why: "To je jen jeden odstavec." },
    { value: "Měsíc", why: "To je jen jeden odstavec." },
  ], {
    hints: ["Kam patří hvězdy, planety i Měsíc dohromady?", "Téma celého textu musí zastřešit všechny odstavce, ne jen jeden."],
    explanation: "Hvězdy, planety i Měsíc patří do vesmíru — to je téma celého textu.",
  }),
  choice("Máš napsat referát o jezevcích. Která slova si vypíšeš jako klíčová?", "jezevec, nora, noc, potrava", [
    { value: "velký, pěkný, zajímavý, dobrý", why: "Obecná slova téma nevystihnou." },
    { value: "a, ale, protože, když", why: "To jsou spojky." },
    { value: "pondělí, úterý, středa, čtvrtek", why: "Dny v týdnu s jezevci nesouvisí." },
  ], {
    hints: ["Která slova řeknou něco o životě jezevce?", "Klíčová slova referátu vystihnou, kdo to je, kde bydlí a jak žije."],
    explanation: "Jezevec, nora, noc a potrava vystihují život jezevce — hodí se jako klíčová slova.",
  }),
  choice("Kamarádka podtrhla v textu skoro všechna slova jako důležitá. Co jí poradíš?", "ať podtrhne jen pár nejdůležitějších", [
    { value: "ať podtrhne i zbytek", why: "Pak by nic nevyniklo." },
    { value: "ať nepodtrhává nic", why: "Pár důležitých slov pomůže." },
    { value: "ať podtrhává jen dlouhá slova", why: "Délka o důležitosti nerozhoduje." },
  ], {
    hints: ["Když je podtržené všechno, co z toho vynikne?", "Podtrhávání má ukázat to nejdůležitější. Když podtrhneš všechno, nic nevynikne."],
    explanation: "Podtrhujeme jen pár nejdůležitějších slov, jinak nic nevynikne.",
  }),
  choice("Kdy je dobré text jen přejet očima?", "když hledám jeden konkrétní údaj", [
    { value: "když se chci naučit celý text", why: "Na učení je potřeba číst pozorně." },
    { value: "když čtu básničku pro radost", why: "Básničku si vychutnáme pomalu." },
    { value: "když píšu diktát", why: "Při diktátu nečteme, píšeme." },
  ], {
    hints: ["Kdy nepotřebuješ číst každé slovo?", "Rychlé přelétnutí stačí, když hledáš jen jednu věc — třeba číslo nebo jméno."],
    explanation: "Text přejedeme očima, když hledáme jeden konkrétní údaj. Na učení čteme pozorně.",
  }),
  choice("Nadpis článku zní „Pes – nejlepší přítel člověka“. Jaká bude asi hlavní myšlenka?", "pes je člověku věrným kamarádem", [
    { value: "psi mají čtyři nohy", why: "O nohách nadpis nic neříká." },
    { value: "psi štěkají", why: "Štěkání s přátelstvím nesouvisí." },
    { value: "psi jsou dražší než kočky", why: "O ceně nadpis nic neříká." },
  ], {
    hints: ["Co nadpis o psovi tvrdí?", "Nadpis často prozradí, co chce text říct. Tady říká, jaký vztah má pes k člověku."],
    explanation: "Nadpis naznačuje, že text ukáže psa jako věrného kamaráda člověka.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const VYHLEDAVANIKLICOVYCHSLOVAHLAVNIMYSLENKY: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky",
    displayName: "Klíčová slova",
    title: "Vyhledávání klíčových slov a hlavní myšlenky",
    studentTitle: "Klíčová slova a myšlenka",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se rychle najít klíčová slova a hlavní myšlenku textu.",
    keywords: ["klíčová slova", "téma", "hlavní myšlenka", "rejstřík", "obsah", "vyhledávání"],
    goals: [
      "Najít v textu klíčová slova",
      "Rozlišit téma a hlavní myšlenku",
      "Rychle vyhledat údaj v textu i v knize",
    ],
    boundaries: ["Bez odborných textů", "Krátké ukázky přiměřené 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame"],
    generator: gen,
    helpTemplate: {
      hint: "Klíčová slova = opakují se, jsou tučně, v nadpisu; téma = o čem; hlavní myšlenka = co se o tom říká",
      steps: [
        "Přečti nadpis — napoví téma.",
        "Najdi slova, která se opakují nebo jsou zvýrazněná.",
        "Řekni jednou větou, co text hlavně říká.",
        "Pojem v knize hledej v rejstříku.",
      ],
      commonMistake: "Záměna tématu (o čem) a hlavní myšlenky (co se o tom říká)",
      example: "Téma: včely. Hlavní myšlenka: Včely opylují květy, a tak pomáhají růst ovoci.",
    },
  },
];
