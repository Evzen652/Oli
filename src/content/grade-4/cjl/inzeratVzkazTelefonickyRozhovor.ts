import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Původně L3 jen míchala L1 a L2
// (žádná vlastní úroveň), vysvětlení k „Mámo, jdu k Honzovi. Ondra“
// mluvilo o čase „v 17 h“, který ve vzkazu nebyl, a v textu byly překlepy
// („vzkazku“). Přibyly situace, kdy dítě o telefonu neprozradí, že je doma
// samo — to k telefonování ve 4. třídě patří.
//
// L1 = co je inzerát, vzkaz, telefonát · L2 = co chybí, jaký typ, pořadí
// L3 = co napíšu nebo řeknu v konkrétní situaci.

const L1: PracticeTask[] = [
  choice("K čemu slouží inzerát?", "něco nabízíme nebo sháníme", [
    { value: "vyprávíme v něm příběh", why: "Příběh patří do vypravování, ne do inzerátu." },
    { value: "píšeme v něm kamarádovi", why: "Kamarádovi píšeme dopis nebo vzkaz." },
    { value: "vysvětlujeme v něm slova", why: "Vysvětlení slov najdeme ve slovníku." },
  ], {
    hints: ["Kdy lidé dávají inzerát do novin nebo na internet?", "Inzerát čte hodně cizích lidí. Píšeme ho, když chceme něco prodat či darovat, nebo když něco hledáme."],
    explanation: "Inzerátem něco nabízíme (prodám, daruji) nebo sháníme (koupím, hledám).",
  }),
  choice("Co nesmí v inzerátu chybět?", "kontakt na toho, kdo ho podal", [
    { value: "oslovení toho, kdo inzerát čte", why: "Oslovení patří do dopisu. Inzerát čte mnoho lidí." },
    { value: "datum narození autora", why: "Věk autora zájemce nepotřebuje." },
    { value: "pozdrav na rozloučenou", why: "Rozloučení patří do dopisu, ne do inzerátu." },
  ], {
    hints: ["Když někoho inzerát zaujme, jak se ti ozve?", "Bez telefonu nebo e-mailu by se zájemce neměl jak ozvat, a inzerát by byl k ničemu."],
    explanation: "Inzerát musí mít kontakt (telefon nebo e-mail), jinak se zájemce nemá jak ozvat.",
  }),
  choice("Který inzerát je nabídka?", "Prodám kolo, červené, 24 palců. Tel. 777 123 456", [
    { value: "Koupím kolo pro desetiletého kluka. Tel. 777 123 456", why: "„Koupím“ znamená, že něco sháníš — to je poptávka." },
    { value: "Hledám ztracené kolo, červené. Tel. 777 123 456", why: "„Hledám“ znamená, že něco sháníš." },
    { value: "Hledám kamaráda na výlety na kole. Tel. 777 123 456", why: "I tady někdo něco shání — je to poptávka." },
  ], {
    hints: ["Ve kterém inzerátu někdo něco dává ostatním?", "Nabídku poznáš podle slov prodám, daruji, nabízím. Slova koupím a hledám znamenají, že autor něco shání."],
    explanation: "„Prodám kolo…“ je nabídka — autor něco nabízí ostatním.",
  }),
  choice("Který inzerát je poptávka?", "Koupím starou stavebnici. Tel. 604 111 222", [
    { value: "Prodám stavebnici, 500 dílků. Tel. 604 111 222", why: "„Prodám“ je nabídka." },
    { value: "Nabízím hlídání psů o prázdninách. Tel. 604 111 222", why: "„Nabízím“ je nabídka." },
    { value: "Daruji koťata do dobrých rukou. Tel. 604 111 222", why: "„Daruji“ je nabídka." },
  ], {
    hints: ["Ve kterém inzerátu autor něco shání?", "Poptávku poznáš podle slov koupím, hledám, sháním. Prodám, nabízím a daruji jsou nabídky."],
    explanation: "„Koupím…“ je poptávka — autor něco shání.",
  }),
  choice("Proč se inzerát píše stručně?", "aby se rychle přečetl", [
    { value: "protože dlouhé jsou zakázané", why: "Zakázané nejsou, jen je nikdo nedočte." },
    { value: "aby mu nikdo nerozuměl", why: "Naopak — inzerát má být hned jasný." },
    { value: "protože se píše jen tužkou", why: "Na psacích potřebách nezáleží." },
  ], {
    hints: ["Jak dlouho se lidé dívají na jeden inzerát v novinách?", "Lidé projíždějí desítky inzerátů. Zaujme ten, ze kterého hned pochopí to podstatné."],
    explanation: "Inzerát se čte rychle mezi mnoha jinými, proto v něm je jen to nejdůležitější.",
  }),
  choice("Co je vzkaz?", "krátká zpráva pro toho, kdo není doma", [
    { value: "dlouhý dopis se záhlavím a datem", why: "Dopis má záhlaví, vzkaz je krátký lísteček." },
    { value: "inzerát v novinách pro všechny", why: "Inzerát čte mnoho lidí, vzkaz jeden člověk." },
    { value: "seznam telefonních čísel", why: "Seznam čísel vzkaz není." },
  ], {
    hints: ["Kdy necháš doma lísteček na stole?", "Vzkaz píšeme, když někomu potřebujeme něco říct, ale on zrovna není u toho."],
    explanation: "Vzkaz je krátká zpráva pro člověka, kterému to nemůžeme říct osobně.",
  }),
  choice("Co musí být ve vzkazu?", "komu, co, kdy a kdo ho píše", [
    { value: "jen podpis pisatele", why: "Bez toho, co a komu, by vzkaz nic neřekl." },
    { value: "jen dnešní datum", why: "Datum nestačí — chybí, co se sděluje." },
    { value: "oslovení a záhlaví", why: "Záhlaví patří do dopisu." },
  ], {
    hints: ["Co potřebuje vědět ten, kdo vzkaz najde?", "Adresát musí poznat, že je vzkaz pro něj, co se stalo nebo stane, kdy a od koho."],
    explanation: "Úplný vzkaz říká komu, co, kdy a kdo ho napsal.",
  }),
  choice("Který vzkaz je úplný?", "Mami, jdu k Honzovi, vrátím se v 5. Ondra", [
    { value: "Jdu k Honzovi, vrátím se asi večer.", why: "Chybí, komu je vzkaz a kdo ho píše, a „asi večer“ není přesný čas." },
    { value: "Mami, vrátím se v 5, neboj se o mě.", why: "Chybí, kam pisatel jde a kdo vzkaz píše." },
    { value: "Ondra — jdu pryč, brzy jsem zpátky.", why: "Chybí, komu je vzkaz, kam pisatel jde a kdy přesně se vrátí." },
  ], {
    hints: ["U každého vzkazu odškrtej: komu, co, kdy, kdo.", "Hledej vzkaz, ve kterém je oslovení, zpráva, čas i podpis."],
    explanation: "Vzkaz „Mami, jdu k Honzovi, vrátím se v 5. Ondra“ říká komu, co, kdy i kdo píše.",
  }),
  choice("Jak začneš telefonát, když voláš ty?", "pozdravím a řeknu, kdo volá", [
    { value: "hned řeknu, co chci", why: "Druhý by nevěděl, s kým mluví." },
    { value: "mlčím, dokud se druhý nezeptá", why: "Mlčení je matoucí — kdo volá, začíná mluvit." },
    { value: "řeknu jen „Haló“", why: "„Haló“ nestačí, druhý neví, kdo volá." },
  ], {
    hints: ["Druhý tě nevidí. Co potřebuje vědět jako první?", "Po telefonu se nejdřív pozdravíme a představíme, teprve pak řekneme, proč voláme."],
    explanation: "Kdo volá, pozdraví a představí se: „Dobrý den, tady Eva…“.",
  }),
  choice("Jak telefonát ukončíš?", "rozloučím se a pak zavěsím", [
    { value: "prostě zavěsím", why: "Zavěsit bez rozloučení je nezdvořilé." },
    { value: "řeknu „Haló“", why: "„Haló“ se říká na začátku hovoru." },
    { value: "zopakuji své jméno", why: "Jméno říkáme na začátku, na konci se loučíme." },
  ], {
    hints: ["Co řekneš, když od někoho odcházíš?", "Telefonát končí stejně jako osobní rozhovor: rozloučením. Teprve potom zavěsíme."],
    explanation: "Hovor ukončíme rozloučením (Na shledanou, Ahoj) a teprve pak zavěsíme.",
  }),
  choice("Proč se na začátku telefonátu představujeme?", "druhý nás nevidí", [
    { value: "je to povinné ze zákona", why: "Zákon to nenařizuje — je to zdvořilost." },
    { value: "aby hovor trval déle", why: "O délku hovoru nejde." },
    { value: "říká se to jen úřadům", why: "Představujeme se každému, komu voláme." },
  ], {
    hints: ["Jak pozná druhý člověk, kdo volá, když tě nevidí?", "Při osobním setkání tě druhý pozná podle obličeje. Po telefonu mu to musíš říct."],
    explanation: "Druhý nás nevidí, a tak neví, kdo volá — proto se hned představíme.",
  }),
  choice("Kde se inzeráty zveřejňují?", "v novinách, na internetu a na nástěnkách", [
    { value: "v dopisech kamarádům", why: "Dopis čte jen jeden člověk." },
    { value: "v učebnici čtení", why: "Učebnice inzeráty nezveřejňuje." },
    { value: "při telefonátu s babičkou", why: "Inzerát je psaný pro hodně lidí." },
  ], {
    hints: ["Kde si inzerát přečte co nejvíc lidí?", "Inzerát má najít toho, koho zajímá — proto se dává tam, kde ho uvidí hodně lidí."],
    explanation: "Inzeráty dáváme tam, kde je uvidí mnoho lidí: do novin, na internet, na nástěnky.",
  }),
  choice("Jak mluvíme do telefonu?", "zřetelně a ne příliš rychle", [
    { value: "co nejrychleji", why: "Rychlé řeči druhý po telefonu špatně rozumí." },
    { value: "šeptem", why: "Šepot přes telefon skoro není slyšet." },
    { value: "jen jednoslovně", why: "Jedním slovem se věc většinou vysvětlit nedá." },
  ], {
    hints: ["Druhý tě nevidí. Jak mu usnadníš, aby ti rozuměl?", "Po telefonu nepomůže ukázat rukou ani výraz obličeje. Všechno musí říct hlas — jasně a v klidu."],
    explanation: "Do telefonu mluvíme zřetelně a klidně, aby nám druhý dobře rozuměl.",
  }),
];

const L2: PracticeTask[] = [
  choice("Vzkaz: „Tati, jdu na trénink, vrátím se v 8.“ Co chybí?", "kdo vzkaz napsal", [
    { value: "komu je určen", why: "Je určen tátovi — „Tati“." },
    { value: "kdy se pisatel vrátí", why: "Čas tam je — v 8." },
    { value: "kam pisatel jde", why: "To tam je — na trénink." },
  ], {
    hints: ["Odškrtej ve vzkazu: komu, co, kdy, kdo.", "Komu (Tati), co (jdu na trénink) i kdy (v 8) tam je. Pozná táta, které z dětí vzkaz psalo?"],
    explanation: "Ve vzkazu chybí podpis — táta neví, kdo mu ho nechal.",
  }),
  choice("Vzkaz: „Jdu ke kamarádovi.“ Co chybí?", "komu, kdy a od koho", [
    { value: "jen podpis pisatele", why: "Chybí toho víc: také komu vzkaz je a kdy se pisatel vrátí." },
    { value: "vůbec nic", why: "Chybí hned tři údaje." },
    { value: "jen dnešní datum", why: "Datum ve vzkazu nutné není, chybí jiné věci." },
  ], {
    hints: ["Kolik ze čtyř údajů (komu, co, kdy, kdo) ve vzkazu najdeš?", "Vzkaz říká jen, co pisatel dělá. Neví se, pro koho je, kdy se pisatel vrátí ani kdo ho napsal."],
    explanation: "Vzkaz říká jen „co“. Chybí komu je určen, kdy se pisatel vrátí a kdo ho napsal.",
  }),
  choice("Inzerát: „Ztratil se pes, hnědý jezevčík, odměna.“ Co musí přibýt?", "kontakt", [
    { value: "jméno souseda", why: "Soused s inzerátem nesouvisí." },
    { value: "pohádka o psovi", why: "Pohádka do inzerátu nepatří." },
    { value: "datum narození psa", why: "Pro nálezce to není důležité." },
  ], {
    hints: ["Někdo psa najde. Jak dá majiteli vědět?", "Popis psa v inzerátu je. Chybí to, bez čeho se nálezce nemá komu ozvat."],
    explanation: "Chybí kontakt (telefon), jinak by nálezce nevěděl, komu psa vrátit.",
  }),
  choice("Inzerát „Hledám štěně. Tel. 777 111 222“ je…", "poptávka", [
    { value: "nabídka", why: "Nabídka by byla „Prodám/Daruji štěně“." },
    { value: "vzkaz", why: "Vzkaz je pro jednoho člověka, inzerát pro všechny." },
    { value: "dopis", why: "Dopis má oslovení a podpis." },
  ], {
    hints: ["Autor inzerátu něco nabízí, nebo shání?", "Slovo „hledám“ znamená, že autor něco shání. Tak se jmenuje i druh inzerátu."],
    explanation: "„Hledám“ znamená, že autor něco shání — je to poptávka.",
  }),
  choice("Který inzerát je napsaný nejlépe?", "Prodám kolo, 24 palců, modré, dobrý stav. Tel. 777 123 456", [
    { value: "Prodám.", why: "Chybí, co se prodává, jaké to je a kontakt." },
    { value: "Mám krásné kolo a moc bych ho chtěl prodat někomu hodnému.", why: "Je upovídaný, chybí údaje o kole i kontakt." },
    { value: "Kolo. Modré. Volejte.", why: "Chybí velikost, stav a hlavně telefon." },
  ], {
    hints: ["Který inzerát řekne stručně, co se prodává, jaké to je a kam volat?", "Dobrý inzerát je krátký, ale má konkrétní údaje (velikost, barva, stav) a kontakt."],
    explanation: "Nejlepší inzerát je stručný a má konkrétní údaje i telefon.",
  }),
  choice("Který údaj do inzerátu o prodeji kola nepatří?", "jak se jmenuje tvůj pes", [
    { value: "velikost kola", why: "Velikost zájemce potřebuje vědět." },
    { value: "barva kola", why: "Barva zájemce zajímá." },
    { value: "telefon", why: "Bez telefonu se zájemce neozve." },
  ], {
    hints: ["Který údaj s kolem vůbec nesouvisí?", "Do inzerátu patří jen to, co zájemce o kolo potřebuje vědět. Všechno ostatní je navíc."],
    explanation: "Jméno psa s prodejem kola nesouvisí — do inzerátu nepatří.",
  }),
  choice("Telefonát začne: „Haló? … Co chceš?“ Co je špatně?", "chybí pozdrav a představení", [
    { value: "je příliš dlouhý", why: "Naopak, je příliš strohý." },
    { value: "chybí adresa", why: "Adresu do telefonu neříkáme." },
    { value: "nic, je správně", why: "Takový začátek je nezdvořilý." },
  ], {
    hints: ["Jak by měl začít zdvořilý telefonát?", "Na začátku telefonátu pozdravíme a řekneme, kdo volá. „Co chceš?“ zní nevlídně."],
    explanation: "Chybí pozdrav a představení. Zdvořile: „Dobrý den, tady Eva…“.",
  }),
  choice("Voláš babičce, ale telefon zvedne děda. Co řekneš?", "Ahoj dědo, tady Eva. Je doma babička?", [
    { value: "Babičku!", why: "Chybí pozdrav, představení i prosba." },
    { value: "Kdo tam je?", why: "Víš, kdo to je — pozdrav ho a představ se." },
    { value: "Chci babičku, rychle.", why: "Takhle to zní nezdvořile." },
  ], {
    hints: ["Co řekneš jako první a jak se zeptáš na babičku?", "Pozdrav dědu, řekni, kdo volá, a slušně se zeptej, jestli můžeš mluvit s babičkou."],
    explanation: "Pozdravíme, představíme se a slušně se zeptáme: „Ahoj dědo, tady Eva. Je doma babička?“",
  }),
  choice("Zvedneš telefon a neznámý hlas chce tatínka, který není doma. Co řekneš?", "Tatínek teď nemůže. Mám mu něco vyřídit?", [
    { value: "Tatínek je v práci do šesti a klíč je pod rohožkou.", why: "Cizímu člověku neprozrazuj, kdo je doma a kde jsou klíče." },
    { value: "Nevím.", why: "Jedno slovo nestačí — nabídni, že vyřídíš vzkaz." },
    { value: "Nic neřeknu a zavěsím.", why: "Zavěsit beze slova je nezdvořilé." },
  ], {
    hints: ["Jak odpovíš zdvořile a přitom neprozradíš nic o tom, kdo je doma?", "Cizímu člověku neříkáme, že jsme sami doma ani kde jsou klíče. Stačí říct, že tatínek nemůže, a nabídnout vzkaz."],
    explanation: "Zdvořile odpovíme, že tatínek teď nemůže, a nabídneme vzkaz. Nic dalšího cizím neprozrazujeme.",
  }),
  choice("Jaké je správné pořadí telefonátu?", "pozdrav, představení, důvod volání, rozloučení", [
    { value: "důvod volání, pozdrav, rozloučení, představení", why: "Důvod voláme až po pozdravu a představení." },
    { value: "představení, rozloučení, pozdrav, důvod volání", why: "Rozloučení patří až na konec." },
    { value: "pozdrav, rozloučení, představení, důvod volání", why: "Rozloučením hovor končí, ne začíná." },
  ], {
    hints: ["Čím telefonát začíná a čím končí?", "Začínáme pozdravem a jménem, pak řekneme, proč voláme, a nakonec se rozloučíme."],
    explanation: "Telefonát: pozdrav, představení, důvod volání, rozloučení.",
  }),
  choice("Proč vzkaz podepisujeme?", "adresát pozná, od koho je", [
    { value: "aby byl vzkaz hezčí", why: "Nejde o vzhled, ale o informaci." },
    { value: "protože to chce pošta", why: "Vzkaz pošta nedoručuje." },
    { value: "aby byl vzkaz delší", why: "Délka nehraje roli." },
  ], {
    hints: ["Na stole leží lísteček bez podpisu. Co adresát neví?", "Doma může být víc lidí, kteří mohli vzkaz nechat. Podpis to rozliší."],
    explanation: "Podpis prozradí, kdo vzkaz napsal.",
  }),
  choice("Inzerát „Daruji koťata do dobrých rukou. Tel. 603 555 111“ je…", "nabídka", [
    { value: "poptávka", why: "Poptávka by byla „Hledám koťátko“." },
    { value: "vzkaz", why: "Vzkaz je pro jednoho člověka, ne pro všechny." },
    { value: "pozvánka", why: "Pozvánka zve na akci." },
  ], {
    hints: ["Autor něco dává, nebo shání?", "Slovo „daruji“ znamená, že autor něco nabízí zadarmo."],
    explanation: "„Daruji“ znamená, že autor něco nabízí — je to nabídka.",
  }),
  choice("Který vzkaz je čitelný a stručný?", "Terko, oběd je v lednici. Máma", [
    { value: "Terezko, milá dcero, chtěla bych ti říct, že jsem ti připravila oběd a dala ho do lednice.", why: "Obsah je správný, ale vzkaz je zbytečně dlouhý." },
    { value: "Je to v lednici.", why: "Chybí, komu je vzkaz, co je v lednici a kdo ho píše." },
    { value: "Terko, máma.", why: "Chybí, co se sděluje." },
  ], {
    hints: ["Který vzkaz řekne všechno potřebné a přitom je krátký?", "Vzkaz má mít komu, co a od koho — ale bez zbytečných slov, aby se dal přečíst na první pohled."],
    explanation: "„Terko, oběd je v lednici. Máma“ má komu, co i kdo — a je krátký.",
  }),
];

const L3: PracticeTask[] = [
  choice("Chceš prodat malé brusle. Který inzerát napíšeš?", "Prodám brusle, vel. 35, málo nošené. Tel. 777 222 333", [
    { value: "Koupím brusle, vel. 35. Tel. 777 222 333", why: "To je poptávka — ty ale chceš prodávat." },
    { value: "Prodám brusle.", why: "Chybí velikost, stav i kontakt." },
    { value: "Brusle jsou super, jezdím na nich ráda.", why: "To je vyprávění, ne inzerát — chybí nabídka i kontakt." },
  ], {
    hints: ["Který inzerát nabízí brusle a má údaje i kontakt?", "Chceš prodávat, takže nabídka (prodám). K tomu velikost, stav a telefon."],
    explanation: "Nabídka s údaji a kontaktem: „Prodám brusle, vel. 35, málo nošené. Tel. …“",
  }),
  choice("Ve škole se ti ztratila čepice. Co napíšeš na nástěnku?", "Ztratila se modrá pletená čepice. Kdo ji najde, ať ji donese do 4.B.", [
    { value: "Ztratila se mi čepice, tak mi ji někdo vraťte.", why: "Chybí popis čepice a kam ji vrátit." },
    { value: "Hledám čepici, je moje a chci ji zpátky!", why: "Nálezce neví, jak čepice vypadá, ani kam ji donést." },
    { value: "Prodám modrou pletenou čepici, skoro novou.", why: "Ty ji nechceš prodat — hledáš ji." },
  ], {
    hints: ["Co potřebuje vědět ten, kdo čepici najde?", "Nálezce musí čepici poznat (barva, druh) a vědět, kam ji vrátit."],
    explanation: "Oznámení o ztrátě popíše věc a řekne, kam ji vrátit.",
  }),
  choice("Odcházíš ven a doma nikdo není. Který vzkaz necháš?", "Mami, jsem u Kláry v čísle 12, přijdu v 6. Eva", [
    { value: "Jsem pryč, přijdu, až se setmí. Neboj.", why: "Chybí, komu je vzkaz, kde jsi a kdo ho psal." },
    { value: "Mami, jsem venku s kamarádkami. Eva", why: "Maminka neví, kde přesně jsi a kdy přijdeš." },
    { value: "Eva — jsem u Kláry v čísle 12.", why: "Chybí, komu je vzkaz a kdy se vrátíš." },
  ], {
    hints: ["Odškrtej u každého vzkazu: komu, kde, kdy, kdo.", "Maminka má vědět, kde tě najde, kdy se vrátíš a že vzkaz je od tebe."],
    explanation: "Úplný vzkaz říká komu, kde jsi, kdy přijdeš a kdo píše.",
  }),
  choice("Voláš do knihovny. Jak začneš?", "Dobrý den, tady Tomáš Novák. Chtěl bych se zeptat na otevírací dobu.", [
    { value: "Ahoj, kdy máte dneska otevřeno v knihovně?", why: "„Ahoj“ se do knihovny nehodí a chybí představení." },
    { value: "Haló, potřebuju vědět otevírací dobu, rychle.", why: "Chybí pozdrav a představení a „rychle“ zní nezdvořile." },
    { value: "Dobrý den. Kdy máte otevřeno? Nashle.", why: "Pozdrav je dobře, ale chybí představení a slušně položená otázka." },
  ], {
    hints: ["Knihovnici neznáš. Jak začneš zdvořile?", "Pozdravíme, řekneme celé jméno a slušně vysvětlíme, proč voláme. „Ahoj“ patří kamarádům, ne do knihovny."],
    explanation: "Zdvořilý začátek: pozdrav, celé jméno, důvod volání.",
  }),
  choice("Někdo neznámý volá a ptá se, jestli jsi doma sám nebo sama. Co uděláš?", "neprozradím to a zavolám dospělého", [
    { value: "řeknu, že ano, a kde bydlím", why: "Cizímu člověku to nikdy neříkej." },
    { value: "odpovím na všechno, co se ptá", why: "Na takové otázky cizím lidem neodpovídáme." },
    { value: "pozvu ho k nám", why: "Cizí lidi domů nezveme." },
  ], {
    hints: ["Je bezpečné říct cizímu, že jsi doma bez dospělého?", "O tom, kdo je doma a kde bydlíš, cizím lidem do telefonu nic neříkáme. Když je ti hovor divný, zavolej dospělého."],
    explanation: "Cizímu člověku neprozrazujeme, že jsme sami doma. Je lepší zavolat dospělého nebo hovor slušně ukončit.",
  }),
  choice("Vzkaz: „Kubo, trénink je dnes zrušený.“ Co ještě doplníš?", "kdo vzkaz píše", [
    { value: "komu je určen", why: "To tam je — „Kubo“." },
    { value: "co se stalo", why: "To tam je — trénink je zrušený." },
    { value: "nic, je úplný", why: "Kuba neví, od koho vzkaz je." },
  ], {
    hints: ["Odškrtej: komu, co, kdy, kdo.", "Komu (Kubo), co (trénink je zrušený) i kdy (dnes) tam je. Jeden údaj ale chybí."],
    explanation: "Chybí podpis — Kuba neví, kdo mu vzkaz nechal.",
  }),
  choice("Proč je v inzerátu lepší napsat „modré, 24 palců“ než „hezké“?", "konkrétní údaj řekne víc než názor", [
    { value: "„hezké“ je sprosté slovo", why: "Sprosté není — jen nic konkrétního neříká." },
    { value: "čísla jsou v inzerátu povinná", why: "Povinná nejsou, ale pomáhají." },
    { value: "delší inzerát je dražší", why: "O cenu inzerátu tu nejde." },
  ], {
    hints: ["Z čeho si zájemce představí kolo lépe — z „hezké“, nebo z barvy a velikosti?", "„Hezké“ je názor, každý si pod ním představí něco jiného. Barva a velikost jsou údaje, podle kterých se zájemce rozhodne."],
    explanation: "Konkrétní údaje (barva, velikost) řeknou zájemci víc než názor „hezké“.",
  }),
  choice("Která zpráva není vzkaz, ale inzerát?", "Nabízím doučování matematiky. Tel. 606 000 111", [
    { value: "Mami, jsem u Petra. Jirka", why: "To je vzkaz pro mámu." },
    { value: "Tati, volala babička. Eva", why: "To je vzkaz pro tátu." },
    { value: "Kláro, klíč je u sousedů. Máma", why: "To je vzkaz pro Kláru." },
  ], {
    hints: ["Která zpráva je pro všechny, a ne pro jednoho člověka?", "Vzkaz má jednoho adresáta a podpis. Inzerát je pro kohokoli, kdo ho čte, a má kontakt."],
    explanation: "„Nabízím doučování… Tel. …“ je pro všechny a má kontakt — je to inzerát.",
  }),
  choice("Při telefonátu nerozumíš, co druhý říká. Co uděláš?", "slušně poprosím o zopakování", [
    { value: "zavěsím", why: "Zavěsit uprostřed hovoru je nezdvořilé." },
    { value: "budu dělat, že rozumím", why: "Pak nebudeš vědět, co ti chtěl říct." },
    { value: "začnu křičet", why: "Křik nepomůže, jen poprosit o zopakování." },
  ], {
    hints: ["Jak se dozvíš, co druhý řekl?", "Nerozumět je normální. Zdvořile řekni, že jsi nerozuměl nebo nerozuměla, a požádej, ať to zopakuje."],
    explanation: "Slušně poprosíme: „Promiňte, nerozuměl/a jsem, můžete to zopakovat?“",
  }),
  choice("Kamarád ti zavolá, když píšeš úkol. Jak hovor ukončíš?", "Musím psát úkol, zavolám ti potom. Ahoj!", [
    { value: "Zavěsím bez jediného slova.", why: "To je nezdvořilé — kamarád neví, co se stalo." },
    { value: "Nemám čas, teď nemůžu mluvit.", why: "Chybí důvod a hlavně rozloučení." },
    { value: "Neotravuj mě, píšu úkol.", why: "Důvod tam je, ale „neotravuj“ kamaráda urazí." },
  ], {
    hints: ["Jak kamarádovi vysvětlíš, proč končíš, a jak se rozloučíš?", "I když spěcháš, řekni kamarádovi, proč teď nemůžeš, slib mu, že se ozveš později, a na konci se s ním rozluč."],
    explanation: "Vysvětlíme důvod, slíbíme, že zavoláme, a rozloučíme se.",
  }),
  choice("Který telefonát je zdvořilý?", "Dobrý den, tady Jana Malá. Mohu mluvit s paní učitelkou? Děkuji, na shledanou.", [
    { value: "Haló, dejte mi paní učitelku, potřebuju s ní mluvit.", why: "Chybí pozdrav, představení i slušná prosba." },
    { value: "Dobrý den, chci paní učitelku. Díky, nashle.", why: "Chybí představení a „chci“ není slušná prosba." },
    { value: "Tady Jana. Je tam paní učitelka? Tak čau.", why: "Chybí pozdrav a „čau“ se učitelce neříká." },
  ], {
    hints: ["Který telefonát má pozdrav, jméno, prosbu i rozloučení?", "Zdvořilý telefonát má čtyři kroky: pozdrav, celé jméno, slušná prosba („Mohu…?“) a nakonec poděkování s rozloučením."],
    explanation: "Zdvořilý telefonát obsahuje pozdrav, představení, slušnou prosbu, poděkování a rozloučení.",
  }),
  choice("V inzerátu stojí: „Prodám psa, volejte.“ Co je špatně?", "chybí popis psa i telefon", [
    { value: "je příliš dlouhý", why: "Naopak, je příliš krátký." },
    { value: "má tam být „Koupím“", why: "Autor chce prodávat, takže „Prodám“ je správně." },
    { value: "nic, je správně", why: "Zájemce neví, jaký pes to je, ani kam volat." },
  ], {
    hints: ["Mohl by se zájemce ozvat? A ví, o jakého psa jde?", "Inzerát vybízí k volání, ale neuvádí číslo. A o psovi neříká nic — plemeno, věk, barvu."],
    explanation: "Chybí popis psa i telefon — zájemce neví, co se prodává, ani kam volat.",
  }),
  choice("Chceš najít kamaráda na hraní šachů. Jaký inzerát to bude?", "poptávka — něco sháníš", [
    { value: "nabídka — něco prodáváš", why: "Nic neprodáváš, hledáš spoluhráče." },
    { value: "vzkaz — pro někoho, kdo není doma", why: "Vzkaz je pro jednoho známého člověka." },
    { value: "dopis — pro jednoho člověka", why: "Dopis píšeš konkrétnímu adresátovi." },
  ], {
    hints: ["Něco nabízíš, nebo hledáš?", "Když hledáš spoluhráče, sháníš něco, co nemáš — tak se jmenuje i druh inzerátu."],
    explanation: "Hledáš spoluhráče, sháníš tedy něco — je to poptávka (Hledám kamaráda na šachy…).",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const INZERATVZKAZTELEFONICKYROZHOVOR: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-inzerat-vzkaz-telefonicky-rozhovor",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-inzerat-vzkaz-telefonicky-rozhovor",
    displayName: "Inzerát a vzkaz",
    title: "Inzerát, vzkaz, telefonický rozhovor",
    studentTitle: "Inzerát a vzkaz",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se, jak správně napsat inzerát, zanechat vzkaz a vést telefonní hovor.",
    keywords: ["inzerát", "vzkaz", "telefonický rozhovor", "nabídka", "poptávka", "komunikace"],
    goals: [
      "Napsat správný inzerát (stručný, s kontaktem)",
      "Napsat úplný vzkaz (kdo, komu, co, kdy)",
      "Vést zdvořilý a bezpečný telefonní hovor",
    ],
    boundaries: ["Bez reklamních textů a sloganů", "Bez e-mailové komunikace"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-casovou-posloupnosti-osnova"],
    generator: gen,
    helpTemplate: {
      hint: "Inzerát=stručný+údaje+kontakt; Vzkaz=komu+co+kdy+kdo; Telefonát=pozdrav+jméno+důvod+rozloučení",
      steps: [
        "Inzerát: nabízím (prodám), nebo sháním (koupím)? Přidej údaje a kontakt.",
        "Vzkaz: komu? co? kdy? kdo píše?",
        "Telefonát: pozdrav, představ se, řekni důvod, rozluč se.",
        "Cizímu do telefonu neříkej, že jsi doma sám nebo sama.",
      ],
      commonMistake: "Vzkaz bez podpisu (nevíme, kdo ho napsal) nebo inzerát bez kontaktu",
      example: "Vzkaz: „Mami, jdu k Honzovi, vrátím se v 5. Ondra“; Inzerát: „Prodám kolo, červené, 24 palců. Tel. 777…“",
    },
  },
];
