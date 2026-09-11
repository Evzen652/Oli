import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Původně L3 jen míchala L1 a L2
// a ukázky přímé řeči byly samy zapsané chybně („'Pojď se mnou!' Honza
// zavolal.“ s apostrofy a bez přehozeného slovosledu; nesmyslná „Petr řekl:
// Pojď, a odešel“). Možnosti se zápisem přímé řeči se tu popisují slovy,
// ne jako varianty téže věty lišící se jen znaménkem — takové varianty
// audit (oprávněně) považuje za duplicitní.
//
// L1 = části osnovy, časová slova, co je přímá řeč
// L2 = zařaď větu do části osnovy, doplň časové slovo, interpunkce přímé řeči
// L3 = doplň osnovu, seřaď příběh, oprav pořadí a zápis.

const L1: PracticeTask[] = [
  choice("Jaké části má osnova vypravování?", "úvod, zápletka, vyvrcholení, závěr", [
    { value: "začátek a konec", why: "Chybí prostředek příběhu — problém a napětí." },
    { value: "úvod a závěr", why: "Bez zápletky a vyvrcholení by se v příběhu nic nestalo." },
    { value: "nadpis, podpis, datum", why: "To jsou části dopisu, ne vypravování." },
  ], {
    hints: ["Co se musí stát mezi začátkem a koncem, aby byl příběh zajímavý?", "Vypravování má čtyři části: seznámení, problém, nejnapínavější chvíle a rozuzlení."],
    explanation: "Osnova vypravování: úvod, zápletka, vyvrcholení a závěr.",
  }),
  choice("Co se čtenář dozví v úvodu?", "kde, kdy a kdo", [
    { value: "jak příběh dopadl", why: "To patří do závěru." },
    { value: "nejnapínavější chvíli", why: "To je vyvrcholení." },
    { value: "hlavní problém", why: "Problém přináší zápletka." },
  ], {
    hints: ["Co potřebuje čtenář vědět, než se začne něco dít?", "Úvod představí místo, čas a postavy, aby čtenář věděl, kde a s kým příběh prožívá."],
    explanation: "Úvod představí, kde a kdy se příběh odehrává a kdo v něm vystupuje.",
  }),
  choice("Co je zápletka?", "problém, který rozhýbe děj", [
    { value: "představení postav", why: "Postavy představí úvod." },
    { value: "šťastný konec", why: "Konec je závěr." },
    { value: "nadpis příběhu", why: "Nadpis není část děje." },
  ], {
    hints: ["Co se musí stát, aby se v příběhu začalo něco dít?", "Po klidném úvodu přijde událost nebo problém — třeba se něco ztratí nebo pokazí."],
    explanation: "Zápletka je problém nebo nečekaná událost, která rozhýbe děj.",
  }),
  choice("Co je vyvrcholení?", "chvíle největšího napětí", [
    { value: "začátek příběhu", why: "Začátek je úvod." },
    { value: "představení místa", why: "Místo představí úvod." },
    { value: "jak to celé dopadlo", why: "To je závěr." },
  ], {
    hints: ["Kdy tajíš dech a nevíš, jak to dopadne?", "Vyvrcholení přichází po zápletce: problém je největší a čtenář napjatě čeká na rozuzlení."],
    explanation: "Vyvrcholení je nejnapínavější chvíle příběhu, těsně před rozuzlením.",
  }),
  choice("Co je závěr?", "jak příběh dopadl", [
    { value: "kde se děj odehrává", why: "Místo představí úvod." },
    { value: "hlavní problém", why: "Problém přináší zápletka." },
    { value: "nejnapínavější chvíle", why: "To je vyvrcholení." },
  ], {
    hints: ["Co chce čtenář vědět úplně na konci?", "Na konci se problém vyřeší a napětí povolí. Čtenář se dozví, jak to všechno skončilo."],
    explanation: "Závěr je rozuzlení — řekne, jak příběh dopadl.",
  }),
  choice("Které slovo říká, že se něco stalo jako první?", "nejprve", [
    { value: "nakonec", why: "„Nakonec“ označuje poslední děj." },
    { value: "mezitím", why: "„Mezitím“ znamená ve stejnou dobu." },
    { value: "potom", why: "„Potom“ označuje, co přišlo až po něčem jiném." },
  ], {
    hints: ["Kterým slovem začneš, když vyprávíš, co se stalo úplně na začátku?", "Časová slova řadí události za sebou jako korálky na šňůrce. Hledej to, které patří k úplně prvnímu korálku — před všechny ostatní."],
    explanation: "„Nejprve“ označuje děj, který byl první.",
  }),
  choice("Které slovo říká, že se něco stalo jako poslední?", "nakonec", [
    { value: "nejprve", why: "„Nejprve“ označuje první děj." },
    { value: "mezitím", why: "„Mezitím“ znamená ve stejnou dobu." },
    { value: "potom", why: "„Potom“ jen říká, že něco přišlo po jiném ději." },
  ], {
    hints: ["Kterým slovem uvedeš poslední událost příběhu?", "Hledej časové slovo, které stojí úplně na konci řady událostí."],
    explanation: "„Nakonec“ označuje děj, který byl poslední.",
  }),
  choice("Slovo „mezitím“ znamená, že…", "dva děje probíhají ve stejnou dobu", [
    { value: "děj právě skončil", why: "Konec vyjadřuje „nakonec“." },
    { value: "děj teprve začne", why: "Začátek vyjadřuje „nejprve“." },
    { value: "děj se pořád opakuje", why: "Opakování vyjadřuje třeba „pořád“ nebo „znovu“." },
  ], {
    hints: ["Maminka vařila a mezitím jsme prostírali. Kdy jsme prostírali?", "Slovo „mezitím“ neřadí události za sebou. Říká, že zatímco se dělo jedno, dělo se ve stejné chvíli i něco jiného."],
    explanation: "„Mezitím“ znamená, že dva děje probíhají ve stejnou dobu.",
  }),
  choice("Proč ve vypravování záleží na pořadí událostí?", "čtenář pozná, co bylo dřív a co potom", [
    { value: "text bude kratší", why: "Pořadí délku nemění." },
    { value: "přibude postav", why: "Pořadí s počtem postav nesouvisí." },
    { value: "příběh bude smutnější", why: "Pořadí náladu nemění." },
  ], {
    hints: ["Co by se stalo, kdybys napsal nebo napsala konec dřív než začátek?", "Když události jdou za sebou tak, jak se opravdu staly, čtenář se v příběhu neztratí a ví, co bylo příčinou a co následkem."],
    explanation: "Správné pořadí událostí pomáhá čtenáři pochopit, co se stalo dřív a co potom.",
  }),
  choice("Co je přímá řeč?", "přesná slova, která postava řekla", [
    { value: "popis místa, kde se děj odehrává", why: "Popis místa nejsou slova postavy." },
    { value: "názor vypravěče na postavu", why: "Vypravěč mluví sám za sebe, ne za postavu." },
    { value: "nadpis celé kapitoly", why: "Nadpis není řeč postavy." },
  ], {
    hints: ["Jak v příběhu poznáš, co přesně postava vyslovila?", "Přímá řeč jsou doslovná slova postavy — tak, jak je řekla, a zapisují se do uvozovek."],
    explanation: "Přímá řeč jsou doslovná slova postavy, zapsaná v uvozovkách.",
  }),
  choice("Čím v textu označíme přímou řeč?", "uvozovkami", [
    { value: "závorkami", why: "Závorky přímou řeč neoznačují." },
    { value: "pomlčkou na konci", why: "Pomlčka přímou řeč v češtině neoznačuje." },
    { value: "tučným písmem", why: "Tučné písmo se k tomu nepoužívá." },
  ], {
    hints: ["Jaká znaménka obklopují slova postavy dole a nahoře?", "Na začátku přímé řeči píšeme znaménko dole („), na konci nahoře (“)."],
    explanation: "Přímou řeč píšeme do uvozovek: „Pojď sem!“",
  }),
  choice("Která skupina slov vyjadřuje pořadí událostí v čase?", "nejprve, potom, nakonec", [
    { value: "vlevo, vpravo, nahoře", why: "Tato slova říkají, kde něco je." },
    { value: "možná, asi, snad", why: "Tato slova vyjadřují nejistotu." },
    { value: "protože, ale, nebo", why: "Tato slova spojují věty." },
  ], {
    hints: ["Která slova odpovídají na otázku „kdy?“", "Vyřaď slova o místě, slova o nejistotě a spojky. Zbyde skupina, která řadí události v čase."],
    explanation: "Slova nejprve, potom, nakonec řadí události v čase.",
  }),
  choice("Kdy si osnovu vypravování píšeš?", "před psaním", [
    { value: "po odevzdání", why: "Po odevzdání plán nepomůže." },
    { value: "místo závěru", why: "Osnova závěr nenahrazuje." },
    { value: "jen u dopisu", why: "Osnovu potřebuje hlavně vypravování." },
  ], {
    hints: ["K čemu je plán, který vznikne až potom?", "Osnova je plán — musí být hotová dřív, než začneš psát, aby ti pomohla."],
    explanation: "Osnovu si napíšeme předem jako plán vypravování.",
  }),
];

const L2: PracticeTask[] = [
  choice("Jak jdou části osnovy za sebou?", "úvod, zápletka, vyvrcholení, závěr", [
    { value: "zápletka, úvod, závěr, vyvrcholení", why: "Úvod musí být první — bez něj čtenář neví, kde je." },
    { value: "závěr, úvod, zápletka, vyvrcholení", why: "Závěr patří na konec." },
    { value: "úvod, vyvrcholení, zápletka, závěr", why: "Napětí vyvrcholí až po zápletce." },
  ], {
    hints: ["Co je první a co poslední?", "Nejdřív seznámení, pak problém, pak nejnapínavější chvíle a nakonec rozuzlení."],
    explanation: "Pořadí: úvod → zápletka → vyvrcholení → závěr.",
  }),
  choice("Která věta patří do úvodu vypravování o výletě?", "V sobotu ráno jsme s tátou vyrazili na Sněžku.", [
    { value: "Najednou se strhla bouřka a ztratili jsme značku.", why: "To je zápletka — problém." },
    { value: "Promokli jsme a nevěděli jsme, kudy dál.", why: "To je vyvrcholení — největší napětí." },
    { value: "Večer jsme unavení dorazili domů.", why: "To je závěr — jak to dopadlo." },
  ], {
    hints: ["Která věta řekne kdy, kdo a kam?", "Úvod ještě nemá žádný problém. Jen představí čas, postavy a místo."],
    explanation: "„V sobotu ráno jsme s tátou vyrazili na Sněžku“ říká kdy, kdo a kam — je to úvod.",
  }),
  choice("Která věta je zápletka vypravování o výletě?", "Najednou se strhla bouřka a ztratili jsme značku.", [
    { value: "V sobotu ráno jsme s tátou vyrazili na Sněžku.", why: "To je úvod." },
    { value: "Promokli jsme a nevěděli jsme, kudy dál.", why: "To je vyvrcholení — problém už je v plné síle." },
    { value: "Večer jsme unavení dorazili domů.", why: "To je závěr." },
  ], {
    hints: ["Která věta přináší problém?", "Zápletka přijde po úvodu: stane se něco nečekaného a klidný výlet se změní."],
    explanation: "Bouřka a ztracená značka jsou problém, který rozhýbe děj — to je zápletka.",
  }),
  choice("Která věta je vyvrcholení vypravování o výletě?", "Promokli jsme a nevěděli jsme, kudy dál.", [
    { value: "V sobotu ráno jsme s tátou vyrazili na Sněžku.", why: "To je úvod." },
    { value: "Najednou se strhla bouřka a ztratili jsme značku.", why: "To je zápletka — problém teprve začíná." },
    { value: "Večer jsme unavení dorazili domů.", why: "To je závěr." },
  ], {
    hints: ["Kdy je situace nejhorší a nejnapínavější?", "Po zápletce se problém ještě zhorší. Vyvrcholení je chvíle, kdy nikdo neví, jak to dopadne."],
    explanation: "„Promokli jsme a nevěděli jsme, kudy dál“ je nejnapínavější chvíle — vyvrcholení.",
  }),
  choice("Která věta je závěr vypravování o výletě?", "Večer jsme unavení dorazili domů.", [
    { value: "V sobotu ráno jsme s tátou vyrazili na Sněžku.", why: "To je úvod." },
    { value: "Najednou se strhla bouřka a ztratili jsme značku.", why: "To je zápletka." },
    { value: "Promokli jsme a nevěděli jsme, kudy dál.", why: "To je vyvrcholení." },
  ], {
    hints: ["Která věta říká, jak to dopadlo?", "Závěr vyřeší problém a napětí povolí. Postavy jsou v bezpečí."],
    explanation: "Návrat domů uzavírá příběh — to je závěr.",
  }),
  choice("Které slovo doplníš: „___ jsme se nasnídali, potom jsme vyrazili.“", "Nejprve", [
    { value: "Nakonec", why: "„Nakonec“ by znamenalo, že snídaně byla poslední — ale pak jsme ještě vyrazili." },
    { value: "Mezitím", why: "„Mezitím“ by znamenalo, že jsme snídali a vyráželi zároveň." },
    { value: "Včera", why: "„Včera“ říká den, ne pořadí událostí." },
  ], {
    hints: ["Co bylo dřív — snídaně, nebo odjezd?", "Druhá část věty začíná slovem „potom“. První část tedy potřebuje slovo pro to, co bylo úplně na začátku."],
    explanation: "Snídaně byla první, odjezd potom: Nejprve jsme se nasnídali, potom jsme vyrazili.",
  }),
  choice("Které slovo doplníš: „Maminka vařila oběd, ___ jsme prostírali stůl.“", "mezitím", [
    { value: "nejprve", why: "„Nejprve“ by znamenalo, že prostírání bylo dřív než vaření." },
    { value: "nakonec", why: "„Nakonec“ by znamenalo, že prostírání bylo až po všem." },
    { value: "včera", why: "„Včera“ nesedí — oba děje se dějí teď." },
  ], {
    hints: ["Dělo se vaření a prostírání po sobě, nebo najednou?", "Když se dvě věci dějí ve stejnou chvíli, spojí je jedno časové slovo, které znamená „ve stejné době“."],
    explanation: "Vaření i prostírání probíhaly zároveň, proto „mezitím“.",
  }),
  choice("Jak se zapíše přímá řeč, když uvozovací věta (řekl Petr) stojí za ní?", "za slovy postavy čárka, pak uvozovky a uvozovací věta malým", [
    { value: "za slovy postavy tečka, pak uvozovací věta velkým", why: "Tečka by větu ukončila — uvozovací věta ale pokračuje." },
    { value: "bez uvozovek, jen čárka", why: "Bez uvozovek čtenář nepozná, co postava řekla." },
    { value: "uvozovací věta v závorce", why: "Závorky se u přímé řeči nepoužívají." },
  ], {
    hints: ["Končí věta tam, kde postava domluvila, nebo pokračuje uvozovací větou?", "Věta ještě nekončí, proto tam, kde postava domluvila, nepatří tečka. Podívej se na vzor „Přijdu brzy,“ řekl Petr. — všimni si znaménka před koncovými uvozovkami a prvního písmene uvozovací věty."],
    explanation: "Správně: „Přijdu brzy,“ řekl Petr. Čárka je před koncovými uvozovkami a uvozovací věta pokračuje malým písmenem.",
  }),
  choice("Ve větě „Kam jdeš?“ zeptala se Marta. — kde je otazník?", "uvnitř uvozovek, za slovy postavy", [
    { value: "za slovem Marta", why: "Otazník patří k otázce Marty, ne k uvozovací větě." },
    { value: "před úvodními uvozovkami", why: "Otazník je na konci otázky, ne před ní." },
    { value: "nikde, v přímé řeči se nepíše", why: "Otázka v přímé řeči otazník má." },
  ], {
    hints: ["Kdo se ptá — Marta, nebo vypravěč?", "Znaménko patří k větě, kterou postava vyslovila. Otázka je v uvozovkách, a proto je tam i otazník."],
    explanation: "Otazník patří k otázce postavy, proto stojí uvnitř uvozovek: „Kam jdeš?“ zeptala se Marta.",
  }),
  choice("Ve větě Honza vykřikl: „Pozor!“ — co stojí hned za uvozovací větou?", "dvojtečka", [
    { value: "čárka", why: "Čárka je, když uvozovací věta stojí za přímou řečí." },
    { value: "tečka", why: "Tečka by větu ukončila." },
    { value: "otazník", why: "Honza se neptá." },
  ], {
    hints: ["Uvozovací věta tu stojí před slovy postavy. Jaké znaménko ohlašuje, že teď něco přijde?", "Když uvozovací věta předchází přímou řeč, oddělí ji znaménko, které ohlašuje, že teď něco přijde — píše se i před výčtem (koupím: mléko, chleba)."],
    explanation: "Když uvozovací věta stojí před přímou řečí, píše se za ní dvojtečka: Honza vykřikl: „Pozor!“",
  }),
  choice("Co je ve větě „Pojď se mnou!“ zavolal Honza. přímá řeč?", "Pojď se mnou!", [
    { value: "zavolal Honza", why: "To je uvozovací věta — říká, kdo mluvil." },
    { value: "Honza", why: "To je jen jméno toho, kdo mluvil." },
    { value: "celá věta", why: "Uvozovací věta do přímé řeči nepatří." },
  ], {
    hints: ["Co přesně Honza vyslovil?", "Přímá řeč je jen to, co je v uvozovkách. Zbytek věty říká, kdo mluvil."],
    explanation: "Přímá řeč je jen to, co je v uvozovkách: Pojď se mnou! „Zavolal Honza“ je uvozovací věta.",
  }),
  choice("Jak vylepšíš: „Pak jsme vstali. Pak jsme snídali. Pak jsme šli ven.“?", "Nejprve jsme vstali. Potom jsme snídali. Nakonec jsme šli ven.", [
    { value: "Pak jsme vstali. Pak jsme snídali. Pak pak.", why: "Opakování ještě přibylo." },
    { value: "Nakonec jsme vstali. Nejprve jsme šli ven.", why: "Pořadí je obrácené a snídaně chybí." },
    { value: "Vstali snídali šli.", why: "Věta nedává smysl." },
  ], {
    hints: ["Kterou verzi čteš nejlépe a je v ní správné pořadí?", "Místo stále stejného „pak“ použij různá časová slova: pro první děj, pro další a pro poslední."],
    explanation: "Časová slova nejprve, potom, nakonec řadí děje a neopakují se.",
  }),
  choice("Která věta vypráví události ve správném pořadí?", "Tomáš vstal, nasnídal se a šel do školy.", [
    { value: "Tomáš šel do školy, vstal a nasnídal se.", why: "Nejdřív musel vstát, až potom jít do školy." },
    { value: "Tomáš se nasnídal, šel do školy a vstal.", why: "Vstát musel jako první." },
    { value: "Tomáš vstal, šel do školy a nasnídal se.", why: "Snídaně je před odchodem do školy." },
  ], {
    hints: ["Co děláš ráno jako první, co potom a co nakonec?", "Seřaď děje tak, jak se opravdu dějí: vstát — snídaně — odchod."],
    explanation: "Správně je vstát, nasnídat se a pak jít do školy.",
  }),
];

const L3: PracticeTask[] = [
  choice("Jaký bod chybí v osnově? 1. Jdeme na houby. 2. ??? 3. Hledáme cestu po tmě. 4. Konečně jsme doma.", "V lese se ztratíme.", [
    { value: "Konečně jsme doma.", why: "To už je čtvrtý bod — závěr." },
    { value: "Doma si uvaříme čaj.", why: "To by bylo až po závěru." },
    { value: "Jdeme na houby.", why: "To je první bod — úvod." },
  ], {
    hints: ["Proč by museli hledat cestu po tmě?", "Mezi úvodem a vyvrcholením chybí zápletka — problém, kvůli kterému hledají cestu."],
    explanation: "Aby hledali cestu po tmě, musí se nejdřív ztratit. Chybí zápletka: V lese se ztratíme.",
  }),
  choice("Seřaď věty do příběhu: A) Najednou pes utekl. B) Šli jsme se psem do parku. C) Našli jsme ho u rybníka. D) Hledali jsme ho celé odpoledne.", "B, A, D, C", [
    { value: "A, B, C, D", why: "Pes nemohl utéct dřív, než jsme s ním vyšli." },
    { value: "B, D, A, C", why: "Hledat ho můžeme až poté, co utekl." },
    { value: "C, A, D, B", why: "Nalezení psa je konec, ne začátek." },
  ], {
    hints: ["Která věta je úvod a která závěr?", "Úvod: kam jsme šli. Zápletka: co se stalo. Vyvrcholení: co jsme dělali. Závěr: jak to dopadlo."],
    explanation: "B (úvod) → A (zápletka) → D (vyvrcholení) → C (závěr).",
  }),
  choice("V textu stojí: Pojď sem, řekla máma. Co chybí?", "uvozovky kolem slov Pojď sem", [
    { value: "tečka za slovem máma", why: "Tečka tam je." },
    { value: "velké písmeno u slova řekla", why: "Uvozovací věta za přímou řečí se píše malým." },
    { value: "dvojtečka za slovem sem", why: "Dvojtečka se píše, jen když uvozovací věta stojí před přímou řečí." },
  ], {
    hints: ["Která slova máma opravdu vyslovila? Jsou nějak označená?", "Přímou řeč musí obklopovat znaménka dole a nahoře. Čárka i malé písmeno jsou tu v pořádku."],
    explanation: "Chybí uvozovky: „Pojď sem,“ řekla máma.",
  }),
  choice("Vypravování začíná větou „Bylo to loni v létě u babičky na vesnici.“ Která část to je?", "úvod", [
    { value: "zápletka", why: "Věta nepřináší žádný problém." },
    { value: "vyvrcholení", why: "Není tu žádné napětí." },
    { value: "závěr", why: "Věta nic neuzavírá, teprve začíná." },
  ], {
    hints: ["Co věta říká — kdy a kde, nebo co se stalo?", "Věta představuje čas a místo a nic se v ní zatím neděje. To dělá jedna část osnovy."],
    explanation: "Věta říká kdy (loni v létě) a kde (u babičky) — je to úvod.",
  }),
  choice("Která věta nejvíc zvýší napětí ve vyvrcholení?", "Světlo baterky zablikalo a zhaslo.", [
    { value: "Doma bylo teplo.", why: "Věta napětí uklidňuje." },
    { value: "Snědli jsme svačinu.", why: "Obyčejná činnost napětí nepřidá." },
    { value: "Příběh skončil.", why: "Tím napětí končí." },
  ], {
    hints: ["Při které větě by ses bál nebo bála, co bude dál?", "Napětí zvýší nečekaná komplikace, která situaci ještě zhorší."],
    explanation: "Zhasnutá baterka ve tmě situaci zhorší — napětí vyvrcholí.",
  }),
  choice("Příběh má úvod a závěr, ale chybí zápletka. Co se stane?", "nic zajímavého se v něm neděje", [
    { value: "bude napínavější", why: "Bez problému napětí vzniknout nemůže." },
    { value: "přibudou postavy", why: "Zápletka s počtem postav nesouvisí." },
    { value: "bude delší", why: "Chybějící část text naopak zkrátí." },
  ], {
    hints: ["Co rozhýbe příběh, když se nic nestane?", "Zápletka je problém. Bez něj postavy jen přijdou a odejdou a čtenář se nudí."],
    explanation: "Bez zápletky se v příběhu nic nestane — je nudný.",
  }),
  choice("Kterým slovem uvedeš děj, který probíhá současně s jiným?", "zatímco", [
    { value: "nakonec", why: "„Nakonec“ uvádí poslední děj." },
    { value: "nejprve", why: "„Nejprve“ uvádí první děj." },
    { value: "potom", why: "„Potom“ uvádí následující děj." },
  ], {
    hints: ["Já čtu a bratr při tom hraje na kytaru. Jak ty dva děje spojíš do jednoho souvětí?", "Hledej slovo, které spojí dva děje probíhající ve stejnou chvíli. Podobá se slovu „mezitím“, ale stojí na začátku jedné z vět souvětí."],
    explanation: "„Zatímco“ spojuje dva děje, které probíhají současně.",
  }),
  choice("Kde je chyba v textu „Nakonec jsme vstali. Potom jsme snídali. Nejprve jsme šli ven.“?", "nejprve a nakonec jsou prohozené", [
    { value: "chybí slovo mezitím", why: "Děje jdou po sobě, „mezitím“ tu nepatří." },
    { value: "věty jsou moc krátké", why: "Krátké věty chybou nejsou." },
    { value: "chyba tam není", why: "Vstávání nemůže být poslední a odchod první." },
  ], {
    hints: ["Co bylo ráno první — vstávání, nebo odchod ven?", "Časová slova musí odpovídat skutečnému pořadí. Porovnej, co je napsáno, s tím, jak to opravdu šlo."],
    explanation: "Vstávání bylo první a odchod poslední — slova nejprve a nakonec jsou prohozená.",
  }),
  choice("Kterou uvozovací větu použiješ, když postava mluví potichu?", "zašeptala Eva", [
    { value: "zakřičela Eva", why: "Křik je hlasitý." },
    { value: "zpívala Eva", why: "Zpěv neříká, že mluví potichu." },
    { value: "zavolala Eva z dálky", why: "Volání z dálky je hlasité." },
  ], {
    hints: ["Jak se řekne, že někdo mluví velmi potichu?", "Uvozovací věta může prozradit i to, jak postava mluví. Hledej sloveso pro tichou řeč."],
    explanation: "„Zašeptala Eva“ ukáže, že Eva mluvila potichu.",
  }),
  choice("Ve které části vypravování se problém vyřeší?", "v závěru", [
    { value: "v úvodu", why: "V úvodu problém ještě není." },
    { value: "v zápletce", why: "Zápletka problém přináší." },
    { value: "ve vyvrcholení", why: "Ve vyvrcholení je problém největší, ještě se neřeší." },
  ], {
    hints: ["Kde se čtenář dozví, jak to dopadlo?", "Problém vznikne v zápletce, vyhrotí se ve vyvrcholení — a vyřeší se v poslední části."],
    explanation: "Problém se vyřeší v závěru.",
  }),
  choice("Proč je dobré psát celé vypravování v jednom čase, třeba v minulém?", "čtenář se neztratí v tom, kdy se co stalo", [
    { value: "přítomný čas je zakázaný", why: "Zakázaný není — jen by se neměly míchat." },
    { value: "text bude kratší", why: "Délka na čase nezávisí." },
    { value: "pak se nepíše přímá řeč", why: "Přímá řeč se píše v každém čase." },
  ], {
    hints: ["Jak se čte příběh, kde se střídá „šel“ a „jde“?", "Když se časy míchají, čtenář neví, co je teď a co bylo dřív. Jeden čas drží příběh pohromadě."],
    explanation: "Jeden čas v celém vypravování pomáhá čtenáři, aby se v ději neztratil.",
  }),
  choice("Máš napsat vypravování „Jak jsme pekli perník“. Která osnova je nejlepší?", "příprava – spálený první plech – záchrana na poslední chvíli – ochutnávka", [
    { value: "perník – další perník – ještě jeden perník – konec", why: "Body nic neříkají o ději." },
    { value: "ochutnávka – příprava těsta – konec pečení", why: "Pořadí je obrácené a chybí problém." },
    { value: "příprava těsta – ochutnávka hotového perníku", why: "Chybí zápletka i vyvrcholení." },
  ], {
    hints: ["Která osnova má začátek, problém, napínavou chvíli i konec?", "Dobrá osnova má čtyři body v pořadí úvod → zápletka → vyvrcholení → závěr."],
    explanation: "Osnova „příprava – spálený plech – záchrana – ochutnávka“ má všechny části ve správném pořadí.",
  }),
  choice("Kterou větou ukončíš vypravování o psovi, který se ztratil?", "Od té doby Alíka pouštíme jen na vodítku.", [
    { value: "Najednou Alík zmizel.", why: "To je zápletka." },
    { value: "Byla sobota a šli jsme do parku.", why: "To je úvod." },
    { value: "Hledali jsme ho v dešti celé hodiny.", why: "To je vyvrcholení." },
  ], {
    hints: ["Která věta patří až úplně na konec?", "Závěr řekne, jak to dopadlo, a někdy i to, co si z toho postavy vzaly."],
    explanation: "„Od té doby Alíka pouštíme jen na vodítku“ uzavírá příběh — je to závěr.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const VYPRAVOVANISCASOVOUPOSLOUPNOSTIOSNOVA: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-casovou-posloupnosti-osnova",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-casovou-posloupnosti-osnova",
    displayName: "Vypravování a osnova",
    title: "Vypravování s časovou posloupností, osnova",
    studentTitle: "Vypravování a osnova",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se sestavit osnovu a napsat vypravování s časovou posloupností.",
    keywords: ["vypravování", "osnova", "úvod", "zápletka", "vyvrcholení", "závěr", "přímá řeč", "časová posloupnost"],
    goals: [
      "Sestavit osnovu vypravování",
      "Použít časová slova pro posloupnost událostí",
      "Správně zapsat přímou řeč",
    ],
    boundaries: ["Bez literární analýzy", "Bez složitých grafů vztahů postav"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-psani-soukromeho-dopisu"],
    generator: gen,
    helpTemplate: {
      hint: "Osnova: 1. úvod (kde, kdy, kdo), 2. zápletka (problém), 3. vyvrcholení (napětí), 4. závěr (rozuzlení)",
      steps: [
        "Úvod: kde, kdy, kdo.",
        "Zápletka: co se stalo, jaký nastal problém.",
        "Vyvrcholení: největší napětí.",
        "Závěr: jak to dopadlo.",
        "Přímá řeč: „Přijdu brzy,“ řekl Petr. / Petr řekl: „Přijdu brzy.“",
      ],
      commonMistake: "Záměna zápletky a vyvrcholení; přímá řeč bez uvozovek",
      example: "Zápletka: Ztratil se pejsek. Vyvrcholení: Hledali jsme ho celý den v dešti. Závěr: Našli jsme ho schouleného u sousedů.",
    },
  },
];
