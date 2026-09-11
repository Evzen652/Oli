import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Původně L1 a L2 tvořily úlohy
// Ano/Ne (polovina se dala uhodnout) o čtenářských strategiích, bez
// zpětné vazby a část bez diakritiky („Kdyz nerozumim slovu…“). V L3 byl
// věcně chybný text o „lyšce“, která je prý ryba (lyska je pták),
// a distraktor „Čapek žil v 19. století“, který je napůl pravdivý.
// Téma teď cvičí to, co v názvu má: čtení krátkého textu a otázku k němu.
//
// L1 = odpověď je v textu doslova (kdo, co, kde, kdy, kolik)
// L2 = odpověď je potřeba vyvodit (proč, co z toho plyne, pořadí)
// L3 = hlavní myšlenka, účel textu, vyvození z více vět, čtenářské strategie.

function text(t: string, q: string, klic: string, spatne: [[string, string], [string, string], [string, string]], hints: [string, string], explanation: string): PracticeTask {
  return choice(`Přečti si text: „${t}“ ${q}`, klic, spatne.map(([value, why]) => ({ value, why })) as never, { hints, explanation });
}

const BABICKA = "Tomáš a jeho sestra Klára jeli v sobotu k babičce do Plzně. Babička jim upekla borůvkové buchty.";
const JEZEK = "Ve čtvrtek ráno našla Eva na zahradě malého ježka. Dala mu misku s vodou a zavolala tátu.";
const MARTINA = "Martina hraje na housle. Každé úterý chodí do hudební školy, kde ji učí paní Dvořáková.";

const L1: PracticeTask[] = [
  text(BABICKA, "Kam jeli Tomáš a Klára?", "k babičce do Plzně", [
    ["k dědečkovi do Brna", "Dědeček ani Brno v textu nejsou."], ["na výlet do lesa", "O lese text nemluví."], ["do školy v Plzni", "Jeli k babičce, ne do školy."],
  ], ["Najdi v textu slovo „jeli“. Co následuje za ním?", "Odpověď je v první větě doslova: kam a za kým děti jely. Dávej pozor na jméno města."], "V textu stojí: jeli v sobotu k babičce do Plzně."),
  text(BABICKA, "Co jim babička upekla?", "borůvkové buchty", [
    ["jablečný koláč", "Koláč v textu není."], ["perník", "Perník v textu není."], ["chleba", "Chleba v textu není."],
  ], ["Najdi v textu slovo „upekla“.", "Odpověď je v druhé větě hned za slovem „upekla“."], "V textu stojí: babička jim upekla borůvkové buchty."),
  text(JEZEK, "Kdy Eva našla ježka?", "ve čtvrtek ráno", [
    ["v sobotu večer", "V textu je jiný den i jiná část dne."], ["v neděli odpoledne", "Neděle v textu není."], ["v úterý v poledne", "Úterý v textu není."],
  ], ["Otázka „kdy“ se ptá na čas. Kde v textu je nějaký den?", "Čas najdeš hned na začátku první věty — je tam den v týdnu i část dne. Obojí musí sedět."], "Text začíná: Ve čtvrtek ráno našla Eva ježka."),
  text(JEZEK, "Komu Eva zavolala?", "tátovi", [
    ["mámě", "Máma v textu není."], ["sousedovi", "Soused v textu není."], ["veterináři", "Veterinář v textu není."],
  ], ["Najdi v textu slovo „zavolala“.", "Za slovem „zavolala“ je, komu Eva volala. Stačí ho dát do správného tvaru."], "V textu stojí: zavolala tátu — zavolala tedy tátovi."),
  text("Na školním výletě jsme viděli tři jeleny, dvě srny a jednoho zajíce.", "Kolik jelenů děti viděly?", "tři", [
    ["dva", "Dvě byly srny."], ["jeden", "Jeden byl zajíc."], ["šest", "Šest je počet všech zvířat dohromady."],
  ], ["Najdi v textu slovo „jeleny“. Jaké číslo je před ním?", "V textu jsou čísla u několika různých zvířat. Hledej to, které stojí přímo u jelenů."], "V textu stojí: tři jeleny."),
  text("Knihovna je otevřená od pondělí do čtvrtka od 9 do 17 hodin. V pátek je zavřeno.", "Kdy je knihovna zavřená?", "v pátek", [
    ["v pondělí", "V pondělí je otevřeno."], ["ve středu", "Středa je mezi pondělím a čtvrtkem, je otevřeno."], ["ve čtvrtek", "Ve čtvrtek je ještě otevřeno."],
  ], ["Najdi v textu slovo „zavřeno“.", "Druhá věta přesně říká, kdy je zavřeno. Dny od pondělí do čtvrtka jsou otevřené."], "V textu stojí: V pátek je zavřeno."),
  text("Pan Novák pěstuje na zahradě rajčata, okurky a papriky. Nejvíc se mu daří rajčata.", "Co se panu Novákovi daří nejvíc?", "rajčata", [
    ["okurky", "Okurky pěstuje, ale nejvíc se mu daří něco jiného."], ["papriky", "Papriky pěstuje, ale nejvíc se mu daří něco jiného."], ["jahody", "Jahody v textu nejsou."],
  ], ["Najdi v textu slovo „nejvíc“.", "První věta vyjmenuje, co pan Novák pěstuje. Odpověď je ale ve druhé větě."], "V textu stojí: Nejvíc se mu daří rajčata."),
  text(MARTINA, "Na jaký nástroj hraje Martina?", "na housle", [
    ["na klavír", "Klavír v textu není."], ["na flétnu", "Flétna v textu není."], ["na kytaru", "Kytara v textu není."],
  ], ["Najdi v textu slovo „hraje“.", "Odpověď je v první větě hned za slovem „hraje“."], "V textu stojí: Martina hraje na housle."),
  text(MARTINA, "Kdo Martinu učí?", "paní Dvořáková", [
    ["maminka", "Maminka v textu není."], ["pan Dvořák", "V textu je paní, ne pan."], ["starší sestra", "Sestra v textu není."],
  ], ["Najdi v textu slovo „učí“.", "Za slovem „učí“ je jméno. Pozor, jestli jde o pana, nebo o paní."], "V textu stojí: učí ji paní Dvořáková."),
  text("Vlak do Brna odjíždí v 8:15 z druhé koleje.", "Z které koleje vlak odjíždí?", "z druhé", [
    ["z první", "V textu je jiná kolej."], ["z třetí", "V textu je jiná kolej."], ["z osmé", "Osm je část času odjezdu, ne kolej."],
  ], ["Najdi v textu slovo „koleje“.", "V textu je čas i číslo koleje. Nesplet si je — číslo koleje stojí přímo před slovem „koleje“."], "V textu stojí: z druhé koleje."),
  text("Veverka si na podzim schovává oříšky do dutiny stromu. V zimě je pak vyhrabává a jí.", "Kam si veverka schovává oříšky?", "do dutiny stromu", [
    ["do nory v zemi", "O noře text nemluví."], ["pod kámen u potoka", "Kámen ani potok v textu nejsou."], ["do ptačího hnízda", "Hnízdo v textu není."],
  ], ["Najdi v textu slovo „schovává“.", "Otázka „kam“ se ptá na místo. Je v první větě."], "V textu stojí: schovává oříšky do dutiny stromu."),
  text("Petr má psa Maxe. Max je hnědý jezevčík a nejraději si hraje s míčkem.", "Jaký pes je Max?", "hnědý jezevčík", [
    ["černý labrador", "V textu je jiná barva i plemeno."], ["bílý pudl", "V textu je jiná barva i plemeno."], ["hnědý ovčák", "Barva sedí, ale plemeno je jiné."],
  ], ["Najdi v textu jméno Max a čti dál.", "Druhá věta popisuje, jaký Max je: barvu i plemeno. Obojí musí sedět."], "V textu stojí: Max je hnědý jezevčík."),
  text("Na kraji vesnice stojí starý mlýn. Dnes je v něm muzeum, kam jezdí hodně turistů.", "Co je dnes ve starém mlýně?", "muzeum", [
    ["pekárna", "Pekárna v textu není."], ["škola", "Škola v textu není."], ["hospoda", "Hospoda v textu není."],
  ], ["Najdi v textu slovo „dnes“.", "První věta říká, kde mlýn stojí. Co je v něm teď, říká druhá věta."], "V textu stojí: Dnes je v něm muzeum."),
];

const L2: PracticeTask[] = [
  text("Martin přišel ze hřiště celý mokrý a zablácený. Z bot mu tekla voda.", "Co se asi stalo venku?", "pršelo", [
    ["svítilo slunce", "Po slunečném dni by nebyl mokrý."], ["byl velký mráz", "V mrazu by voda zmrzla, nebyla by bláto."], ["foukal suchý vítr", "Suchý vítr by nikoho nenamočil."],
  ], ["Proč by mohl být někdo mokrý a zablácený?", "Text to neříká přímo. Stopy (mokrý, bláto, voda v botách) ukazují na jedno počasí."], "Text neříká „pršelo“, ale mokré oblečení, bláto a voda v botách na to ukazují."),
  text("Anna zívala, protírala si oči a hlava jí padala na lavici.", "Jak se asi Anna cítila?", "byla ospalá", [
    ["byla veselá", "Veselost by se projevila smíchem, ne zíváním."], ["měla hlad", "Hlad se neprojevuje zíváním."], ["zlobila se", "Vztek by vypadal jinak."],
  ], ["Kdy lidé zívají a protírají si oči?", "Text pocit nepojmenuje. Poznáš ho podle toho, co Anna dělá."], "Zívání, protírání očí a padající hlava ukazují, že Anna byla ospalá."),
  text("Když prší, cesta k babičce se mění v bláto a ve strouze jsou skryté díry. Proto k ní chodíme jen za sucha.", "Proč se k babičce nechodí za deště?", "cesta je blátivá a nebezpečná", [
    ["babička není doma", "O tom text nemluví."], ["rodiče to nikdy nedovolí", "Za sucha se tam chodí."], ["cesta je delší", "O délce cesty text nic neříká."],
  ], ["Najdi v textu slovo „proto“. Co je před ním?", "Slovo „proto“ spojuje důvod s tím, co z něj plyne. Důvod je v první větě."], "Za deště je cesta blátivá a jsou na ní skryté díry — je nebezpečná."),
  text("Petr běhá do školy deset minut. Jednou zaspal, a aby to stihl, jel autobusem.", "Co z textu plyne?", "autobus je rychlejší než Petrův běh", [
    ["Petr jezdí autobusem každý den", "Jel jen jednou, když zaspal."], ["Petr nemá rád autobus", "O tom text nic neříká."], ["Petr bydlí daleko od školy", "Běží jen deset minut — bydlí blízko."],
  ], ["Proč Petr jel autobusem, když zaspal?", "Jel, „aby to stihl“. Co to říká o rychlosti autobusu?"], "Petr jel autobusem, aby to stihl — autobus je tedy rychlejší než jeho běh."),
  text("Nejprve jsme zasadili semínko. Potom jsme ho zalévali. Po týdnu vyrašil malý lístek.", "Co se stalo jako poslední?", "vyrašil lístek", [
    ["zasadili semínko", "To bylo první."], ["zalévali ho", "To bylo druhé."], ["koupili květináč", "O květináči text nic neříká."],
  ], ["Která časová slova v textu jsou?", "Nejprve → potom → po týdnu. Poslední událost je ta za posledním časovým údajem."], "Pořadí: zasadili, zalévali, po týdnu vyrašil lístek — to bylo poslední."),
  text("Kočka seděla u okna a vrtěla ocasem. Na parapet venku přiletěl vrabec.", "Proč asi kočka vrtěla ocasem?", "sledovala vrabce", [
    ["byla unavená", "Unavená kočka spí, nevrtí ocasem u okna."], ["chtěla jít spát", "O spánku text nic neříká."], ["bála se psa", "Pes v textu není."],
  ], ["Co bylo za oknem?", "Text důvod neříká přímo. Spoj si, co kočka dělala a co bylo venku."], "Kočka seděla u okna a venku byl vrabec — nejspíš ho sledovala."),
  text("Anna je o dva roky mladší než její bratr Pavel. Pavlovi bude v květnu čtrnáct.", "Kolik let bude Anně v květnu?", "dvanáct", [
    ["deset", "To by byla o čtyři roky mladší."], ["čtrnáct", "To je věk Pavla."], ["šestnáct", "To by byla starší než Pavel."],
  ], ["Kolik let bude Pavlovi a o kolik je Anna mladší?", "Anna je mladší než Pavel, takže od Pavlova věku musíš odečíst rozdíl mezi nimi."], "Pavlovi bude 14, Anna je o 2 roky mladší: 14 − 2 = 12."),
  text("V naší třídě je 24 dětí. Polovina chodí na fotbal, čtvrtina na keramiku a ostatní nechodí na žádný kroužek.", "Kolik dětí nechodí na kroužek?", "šest", [
    ["dvanáct", "Dvanáct chodí na fotbal."], ["osm", "Tolik to nevyjde — spočítej polovinu a čtvrtinu."], ["čtyři", "Tolik to nevyjde."],
  ], ["Kolik je polovina a kolik čtvrtina z 24?", "Spočítej, kolik dětí chodí na fotbal a kolik na keramiku, a odečti je od 24."], "Polovina z 24 je 12, čtvrtina 6. 12 + 6 = 18, 24 − 18 = 6 dětí nechodí na kroužek."),
  text("Samec slona afrického váží až 6 tun, samice kolem 3 tun.", "Co z textu plyne?", "samice váží asi polovinu toho, co samec", [
    ["samice jsou těžší než samci", "Je to naopak."], ["sloni afričtí žijí v Asii", "O tom text nic neříká."], ["samec váží 3 tuny", "3 tuny váží samice."],
  ], ["Porovnej čísla u samce a samice.", "Kolikrát se vejdou 3 tuny do 6 tun? Když dvakrát, je menší číslo polovinou většího."], "Samec 6 tun, samice 3 tuny — samice váží asi polovinu."),
  text("Pravěcí lidé vyráběli nástroje z pazourku — tvrdého kamene, který se dá naostřit.", "Proč byl pazourek vhodný na nástroje?", "byl tvrdý a dal se naostřit", [
    ["byl měkký", "Text říká opak — byl tvrdý."], ["byl vzácný a drahý", "O ceně text nic neříká."], ["byl lehký jako dřevo", "O váze text nic neříká."],
  ], ["Co text o pazourku říká za pomlčkou?", "Za pomlčkou jsou dvě vlastnosti pazourku. Právě ty ho dělají vhodným na nože a škrabky."], "Pazourek byl tvrdý a dal se naostřit — proto byl vhodný na nástroje."),
  text("Ježek Bodlinka přes den spí v listí a v noci loví žížaly. Na zimu zaleze pod kůlnu a spí až do jara.", "Které tvrzení podle textu platí?", "v noci hledá potravu a zimu prospí", [
    ["v noci spí a přes den loví", "Je to naopak."], ["celou zimu loví", "V zimě spí."], ["žije daleko od lidí v lese", "Žije u kůlny, tedy u lidí."],
  ], ["Co dělá Bodlinka ve dne, v noci a v zimě?", "Porovnávej každé tvrzení s textem. Stačí jedno slovo, které nesedí, a tvrzení neplatí."], "Text říká: v noci loví, v zimě spí. Ostatní tvrzení mu odporují."),
  text("Karel Čapek psal pohádky pro děti, například Devatero pohádek, ale také vážné knihy pro dospělé.", "Co o Čapkovi text říká?", "psal pro děti i pro dospělé", [
    ["psal jen pohádky", "Psal i vážné knihy pro dospělé."], ["nikdy nepsal pro dospělé", "Text říká opak."], ["psal jen básně", "O básních text nemluví."],
  ], ["Najdi v textu slovo „ale“. Co je před ním a co za ním?", "Před „ale“ jsou knihy pro děti, za ním pro dospělé. Odpověď spojí obojí."], "Text uvádí pohádky pro děti i vážné knihy pro dospělé."),
  text("Povodeň zaplavila vesnici v noci. Lidé utekli na střechy. Voda zničila mnoho věcí, ale všichni se zachránili.", "Jak povodeň dopadla pro lidi?", "všichni se zachránili", [
    ["nikdo se nezachránil", "Text říká opak."], ["lidé zůstali v ložnicích", "Utekli na střechy."], ["voda nic nezničila", "Zničila mnoho věcí."],
  ], ["Najdi v textu, co se stalo s lidmi.", "Poslední věta mluví o věcech i o lidech. Pozor na slovo „ale“."], "Voda zničila věci, ale všichni lidé se zachránili."),
];

const L3: PracticeTask[] = [
  text("Sova pálená loví v noci. Díky citlivému sluchu najde myš i ve tmě. Létá tak tiše, že ji kořist neslyší.", "Jaká je hlavní myšlenka textu?", "sova je dobře přizpůsobená lovu v noci", [
    ["sovy mají měkké peří na křídlech", "To text neříká a není to hlavní."], ["myši se schovávají ve tmě", "Text je o sově, ne o myších."], ["sovy létají hlavně ve dne", "Text říká, že loví v noci."],
  ], ["Co mají všechny tři věty společného?", "Každá věta ukazuje jednu schopnost sovy. Hlavní myšlenka je spojí: k čemu jí všechny slouží."], "Všechny věty ukazují, jak se sova hodí k nočnímu lovu (sluch, tichý let)."),
  text("Každý z nás vyhodí ročně hodně jídla. Přitom stačí nakupovat podle seznamu a zbytky zamrazit. Tak ušetříme peníze i přírodu.", "Co chce autor textem dosáhnout?", "abychom méně plýtvali jídlem", [
    ["abychom nakupovali víc", "Text radí naopak nakupovat podle seznamu."], ["aby nás pobavil vtipem", "V textu žádný vtip není."], ["aby nás naučil vařit polévku", "O vaření text nemluví."],
  ], ["Co nám text radí?", "Záměr autora poznáš podle rad, které dává, a podle toho, co slibuje (ušetříme peníze i přírodu)."], "Autor radí, jak nevyhazovat jídlo — chce, abychom méně plýtvali."),
  text("Pozor! Zítra od 8 do 12 hodin nepoteče voda.", "Jaký druh textu to je?", "oznámení", [
    ["pohádka", "Pohádka vypráví vymyšlený příběh."], ["báseň", "Báseň má verše a rýmy."], ["dopis kamarádovi", "Dopis má oslovení a podpis."],
  ], ["Co text lidem sděluje a proč?", "Krátký text, který upozorňuje lidi na něco důležitého, co se stane, má svůj název."], "Text upozorňuje lidi na důležitou věc — je to oznámení."),
  text("Za devatero horami žil drak, který hlídal princeznu ve zlaté věži.", "Proč text asi vznikl?", "aby čtenáře pobavil", [
    ["aby informoval o počasí", "O počasí text nic neříká."], ["aby naučil počítat", "Počítání v textu není."], ["aby prodal zboží", "Text nic neprodává."],
  ], ["Jaký druh textu to je?", "Vymyšlený svět, drak a princezna patří do pohádky. Pohádky se vyprávějí pro radost."], "Je to začátek pohádky — vznikla, aby čtenáře pobavila."),
  text("Nejprve si umyj ruce. Pak nakrájej chleba. Nakonec ho namaž máslem.", "K čemu text slouží?", "radí, jak něco udělat", [
    ["vypráví příběh", "Nevystupují v něm postavy, je to návod."], ["popisuje osobu", "Žádná osoba se tu nepopisuje."], ["zve na oslavu", "O oslavě text nemluví."],
  ], ["Jaká slova v textu jsou a co ti říkají?", "Nejprve, pak, nakonec a pokyny (umyj, nakrájej, namaž) — takhle vypadá návod."], "Text dává pokyny krok za krokem — radí, jak něco udělat."),
  text("Tomáš nechal v obchodě peněženku u pokladny. Za chvíli za ním vyběhla prodavačka a peněženku mu podala.", "Jaká asi byla prodavačka?", "poctivá", [
    ["zlá", "Zlá by peněženku nevrátila."], ["líná", "Líná by za ním nevyběhla."], ["smutná", "O smutku text nic neříká."],
  ], ["Co prodavačka udělala s cizí peněženkou?", "Vlastnost poznáš podle činu. Kdo vrátí cizí věc, i když ji mohl nechat, je…?"], "Prodavačka vrátila peněženku — byla poctivá."),
  text("Honza trénoval celé léto každý den na kole. Na podzim vyhrál školní závod.", "Proč asi Honza vyhrál?", "protože hodně trénoval", [
    ["protože měl nové tričko", "O tričku text nic neříká."], ["protože pršelo", "O počasí text nic neříká."], ["protože ostatní nepřišli", "To text neříká."],
  ], ["Co Honza dělal celé léto?", "Text spojuje dvě věci: trénink a vítězství. Která z nich vysvětluje tu druhou?"], "Honza celé léto trénoval, a proto na podzim vyhrál."),
  text("Voda se v přírodě neztrácí. Z moří se vypařuje, vytvoří mraky a spadne jako déšť. Po řekách se pak vrací do moře.", "Jaká je hlavní myšlenka textu?", "voda v přírodě pořád koluje", [
    ["moře je slané", "To text neříká."], ["déšť je mokrý", "To není hlavní myšlenka."], ["řeky jsou dlouhé", "O délce řek text nemluví."],
  ], ["Kam se voda dostane a odkud se vrací?", "Text popisuje cestu vody dokola: moře → mraky → déšť → řeky → moře. Hlavní myšlenka to shrne."], "Voda koluje dokola — vypaří se, spadne jako déšť a vrátí se do moře."),
  text("Lucka chtěla psa. Celý rok se starala o sousedova Rexe, venčila ho a krmila. Na Vánoce našla pod stromečkem štěně.", "Co z textu vyvodíš?", "rodiče viděli, že se o psa umí postarat", [
    ["Lucka nemá ráda psy", "Chtěla psa a o Rexe se starala."], ["Rex byl Luččin pes", "Rex byl sousedův."], ["štěně bylo od souseda", "Odkud štěně bylo, text neříká."],
  ], ["Proč asi Lucka dostala štěně až po roce péče o Rexe?", "Text to neříká přímo. Spoj si, co Lucka celý rok dělala a co pak dostala."], "Lucka rok ukazovala, že se o psa umí starat — proto nakonec štěně dostala."),
  text("Nebe se zatáhlo černými mraky a v dálce zahřmělo.", "Co se asi stane?", "přijde bouřka", [
    ["vyjde slunce", "Černé mraky slunce zakryly."], ["začne sněžit", "Hřmění patří k bouřce, ne ke sněžení."], ["bude klidný večer", "Hřmění klid neslibuje."],
  ], ["Co ohlašují černé mraky a hřmění?", "Předvídej podle stop v textu. Hrom a tmavé mraky jdou vždy s jedním počasím."], "Černé mraky a hřmění ohlašují bouřku."),
  choice("Kdy čteš text pomalu a pozorně?", "když se z něj chci něco naučit", [
    { value: "když hledám jen jedno číslo", why: "Na jedno číslo stačí text přejet očima." },
    { value: "když ho jen rychle prolétnu", why: "Rychlé prolétnutí není pozorné čtení." },
    { value: "nikdy", why: "Pozorné čtení je potřeba, když se učíme." },
  ], {
    hints: ["Jak čteš učebnici před testem?", "Když potřebuješ látku pochopit a zapamatovat si ji, musíš rozumět každé větě. To se rychlým čtením nepovede."],
    explanation: "Pomalu a pozorně čteme, když se chceme něco naučit a pochopit.",
  }),
  choice("Když při čtení narazíš na neznámé slovo, co uděláš nejdřív?", "zkusím odhadnout význam z okolních vět", [
    { value: "přestanu číst", why: "Kvůli jednomu slovu nemusíš přestat." },
    { value: "zavřu knihu", why: "Tím se nic nedozvíš." },
    { value: "přeskočím celý odstavec", why: "Tím ti uteče víc než jedno slovo." },
  ], {
    hints: ["Co ti o neznámém slově napoví věty kolem něj?", "Okolní věty často prozradí, co slovo znamená. Když to nejde, zeptej se nebo použij slovník."],
    explanation: "Nejdřív zkusíme význam odhadnout z okolních vět, potom se můžeme zeptat nebo hledat ve slovníku.",
  }),
  choice("Jak si ověříš, že jsi textu porozuměl nebo porozuměla?", "zkusím ho převyprávět vlastními slovy", [
    { value: "spočítám slova", why: "Počet slov o porozumění nic neřekne." },
    { value: "prohlédnu si obrázky", why: "Obrázky porozumění neověří." },
    { value: "přečtu jen nadpis", why: "Z nadpisu obsah nepoznáš." },
  ], {
    hints: ["Dokážeš kamarádovi říct, o čem text byl?", "Když obsah umíš kamarádovi říct po svém, rozumíš mu. Když to nejde, přečti text znovu."],
    explanation: "Když text dokážeme převyprávět vlastními slovy, porozuměli jsme mu.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const PLYNULECTENISPOROZUMENIMPRIMERENENAROCNYCHTEXTU: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-primerene-narocnych-textu",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-primerene-narocnych-textu",
    displayName: "Čtení s porozuměním",
    title: "Plynulé čtení s porozuměním přiměřeně náročných textů",
    studentTitle: "Čtení s porozuměním",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se číst s porozuměním a vyvozovat závěry z přečteného textu.",
    keywords: ["čtení", "porozumění", "hlavní myšlenka", "klíčové slovo", "vyvozování"],
    goals: [
      "Číst přiměřeně náročné texty s porozuměním",
      "Odpovídat na otázky kdo, co, kde, kdy, proč",
      "Vyvozovat závěry ze stop v textu",
    ],
    boundaries: ["Bez literární analýzy", "Bez textů nad 4. ročník"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-cteni-rozliseni-podstatnych-a-okrajovych-informaci"],
    generator: gen,
    helpTemplate: {
      hint: "Odpověď hledej v textu: někdy stojí doslova, někdy ji vyvodíš ze stop",
      steps: [
        "Přečti otázku a zjisti, na co se ptá (kdo, co, kde, kdy, proč).",
        "Najdi v textu místo, které se k otázce vztahuje.",
        "Když odpověď není napsaná přímo, spoj stopy z textu.",
        "Porovnej každou možnost s textem.",
      ],
      commonMistake: "Vybrat odpověď, která zní rozumně, ale v textu nestojí ani z něj neplyne",
      example: "„Martin přišel domů mokrý.“ → vyvozujeme: pravděpodobně pršelo",
    },
  },
];
