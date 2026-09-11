/**
 * Přírodověda 4. ročník — Stavba rostlin, rozšíření, druhy rostlin.
 *
 * Přepsáno 2026-09-11. Předchozí verze neměla u úloh nápovědy ani
 * vysvětlení a obsahovala chyby: „Samovýstřel (boba)“ — slovo boba
 * neexistuje, vystřelující tobolky má netýkavka; řeřicha jako příklad
 * rozmnožování řízky (řeřicha se seje ze semen); úloha na opylení se
 * třemi pravými stranami „Hmyz (…)“, takže neměla jednoznačné přiřazení.
 * Celá úroveň L3 byla podle vlastního komentáře nad rámec RVP (xylém,
 * floém, kambium, čnělka, pylová láčka, apikální meristém, chloroplast),
 * což CONTENT_AUTHORING §4.2 nedovoluje dávat jako běžnou L3.
 *
 * Všechny úlohy jsou match_pairs. Každá úloha má právě jedno úplné
 * přiřazení a pravé strany se v ní neopakují.
 *
 * Gradace:
 *  • L1 — části rostliny a k čemu slouží, co z rostliny jíme, plody stromů.
 *  • L2 — květ a opylení, rozmnožování bez semen, přečkání zimy,
 *         přizpůsobení prostředí, rostliny, na které si dát pozor.
 *  • L3 — pokusy a úvahy: co ukáže obarvená voda ve stonku, co rostlině
 *         chybí podle vzhledu, co by se stalo bez kořene nebo listů.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { match, shuffle } from "./_shared";

const p = (...x: [string, string][]) => x.map(([left, right]) => ({ left, right }));
const Q_PART = "Spoj část rostliny s tím, k čemu slouží.";

const POOL_L1: PracticeTask[] = [
  match(Q_PART, p(["Kořen", "Drží rostlinu v zemi a nasává vodu"], ["Stonek", "Vede vodu z kořene do listů"], ["List", "Vyrábí potravu ze světla"], ["Květ", "Vznikne z něj plod se semeny"]), {
    hints: ["Začni tím, co je schované pod zemí.", "Stonek je jako trubka mezi kořenem a listy, listy jsou zelené a otočené ke slunci a z květu je později plod."],
    explanation: "Kořen drží rostlinu v zemi a nasává vodu. Stonek ji vede nahoru do listů. Listy na světle vyrábějí potravu. Z opyleného květu vznikne plod se semeny.",
  }),
  match(Q_PART, p(["Kořen", "Nasává vodu z půdy"], ["List", "Zachycuje sluneční světlo"], ["Plod", "Chrání semena"], ["Semeno", "Vyroste z něj nová rostlina"]), {
    hints: ["Která část rostliny je uvnitř jablka?", "Jablko je plod a v jádřinci má semínka. Z čeho vyroste nová jabloň a co semínka obaluje?"],
    explanation: "Kořen nasává vodu, list zachycuje světlo. Plod, třeba jablko, chrání semena uvnitř. Ze semene vyroste nová rostlina.",
  }),
  match(Q_PART, p(["Stonek", "Nese listy a květy"], ["Květ", "Láká hmyz barvou a vůní"], ["Plod", "Pomáhá rozšířit semena"], ["Kořen", "Ukotví rostlinu v zemi"]), {
    hints: ["Který z nich je barevný a voní?", "Na stonku rostou listy i květy. Plod sní zvíře nebo ho odnese vítr a semena se dostanou jinam."],
    explanation: "Stonek nese listy a květy. Květ láká hmyz barvou a vůní. Plod pomáhá dostat semena daleko od mateřské rostliny. Kořen ukotví rostlinu v zemi.",
  }),
  match("Spoj rostlinu s tím, jak se šíří její semena.", p(["Pampeliška", "Chmýří odnese vítr"], ["Třešeň", "Pecku roznesou ptáci"], ["Javor", "Plod s křidélky se točí ve větru"], ["Lopuch", "Háčky se zachytí na srsti"]), {
    hints: ["Na co foukáš, když si hraješ s odkvetlou žlutou lukou?", "Třešně jedí špačci, lopuch se ti přichytí na tepláky a javorové „vrtulky“ padají ze stromu. Která rostlina má chmýří?"],
    explanation: "Chmýří pampelišky odnese vítr. Třešně sní ptáci a pecky roznesou. Plody javoru mají křidélka a točí se ve větru. Lopuch má háčky, kterými se chytí srsti.",
  }),
  match("Spoj rostlinu s částí, kterou jíme.", p(["Mrkev", "Kořen"], ["Salát", "List"], ["Jablko", "Plod"], ["Hrách", "Semeno"]), {
    hints: ["Mrkev roste pod zemí.", "Salát jsou zelené lístky, jablko roste na stromě z květu a hrášek jsou kuličky, které se loupou z lusku."],
    explanation: "U mrkve jíme kořen, u salátu listy, u jablka plod a u hrachu semena z lusku.",
  }),
  match(Q_PART, p(["Semeno", "Uvnitř je zárodek nové rostliny"], ["Květ", "Opylí ho hmyz nebo vítr"], ["Stonek", "Drží rostlinu vzpřímeně"], ["List", "Vypařuje se z něj voda"]), {
    hints: ["Z čeho vyroste nová rostlina, když ho zasadíš?", "Opylit se dá jen květ. Stonek drží rostlinu, aby nepadla, a z listů odchází voda do vzduchu."],
    explanation: "Semeno ukrývá zárodek nové rostliny. Květ opylí hmyz nebo vítr. Stonek drží rostlinu vzpřímeně. Z listů se vypařuje voda.",
  }),
  match("Spoj rostlinu s tím, jaký má stonek.", p(["Dub", "Silný dřevnatý kmen"], ["Líska", "Několik dřevnatých kmínků od země"], ["Tulipán", "Měkká zelená lodyha"], ["Pšenice", "Duté stéblo s kolénky"]), {
    hints: ["Strom má jeden silný kmen, keř víc tenkých.", "Tulipán je bylina, jeho stonek je měkký. Obilí má dutý stonek s kolénky, jako brčko."],
    explanation: "Dub je strom s jedním silným kmenem. Líska je keř s víc kmínky od země. Tulipán je bylina s měkkou lodyhou. Pšenice a trávy mají duté stéblo s kolénky.",
  }),
  match("Spoj rostlinu s místem, kde nejlépe roste.", p(["Leknín", "Rybník"], ["Kaktus", "Poušť"], ["Mech", "Vlhký stín v lese"], ["Pšenice", "Pole"]), {
    hints: ["Která rostlina vydrží dlouho bez vody?", "Leknín má listy na hladině, mech potřebuje vlhko a stín a pšenici zasel zemědělec."],
    explanation: "Leknín roste ve vodě rybníka. Kaktus snese sucho pouště. Mech potřebuje vlhko a stín lesa. Pšenice roste na poli, kam ji zasel zemědělec.",
  }),
  match("Spoj rostlinu s tím, jak se šíří její semena.", p(["Kokos", "Plod unese mořská voda"], ["Šípek", "Plod sezobe pták"], ["Bříza", "Lehká semínka s křidélky letí větrem"], ["Svízel přítula", "Přichytí se na oblečení"]), {
    hints: ["Který z těch plodů plave?", "Šípky jsou červené a v zimě je sezobou ptáci. Svízel se ti na procházce lepí na kalhoty a semínka břízy jsou lehká jako prach."],
    explanation: "Kokos plave a mořské proudy ho odnesou daleko. Šípky sezobou ptáci. Semínka břízy mají křidélka a nese je vítr. Svízel přítula má háčky a lepí se na oblečení i srst.",
  }),
  match("Spoj rostlinu s tím, co z ní jíme.", p(["Brambor", "Podzemní hlízu"], ["Cibule", "Podzemní cibuli z dužnatých šupin"], ["Květák", "Nerozvinuté květy"], ["Rajče", "Plod se semínky"]), {
    hints: ["Jen jedna z nich má jedlou část nad zemí a uvnitř semínka.", "Brambora je zásobárna pod zemí, cibule má vrstvy jako slupky a květák je bílá hlávka z poupat."],
    explanation: "U brambor jíme hlízy, u cibule dužnaté šupiny cibule, u květáku nerozvinuté květy a u rajčete plod se semínky.",
  }),
  match(Q_PART, p(["Kořen", "Roste dolů do země"], ["Stonek", "Roste nahoru ke světlu"], ["List", "Má žilky, kterými proudí voda"], ["Květ", "Má barevné okvětní lístky"]), {
    hints: ["Která část roste opačným směrem než ostatní?", "List má na sobě tenké žilky jako cestičky. Květ má barevné plátky. Kam roste stonek?"],
    explanation: "Kořen roste dolů do země za vodou, stonek nahoru za světlem. Listy mají žilky, kterými proudí voda a živiny. Květ má barevné okvětní lístky.",
  }),
  match("Spoj strom s jeho plodem.", p(["Dub", "Žalud"], ["Líska", "Oříšek"], ["Jabloň", "Jablko"], ["Javor", "Nažka s křidélky"]), {
    hints: ["Plody dubu sbírají veverky a sojky.", "Líska dává oříšky, jabloň jablka. Javorové plody padají a točí se jako vrtulka."],
    explanation: "Plodem dubu je žalud, lísky oříšek, jabloně jablko a javoru nažka s křidélky, která se ve větru točí.",
  }),
];

const POOL_L2: PracticeTask[] = [
  match("Spoj rostlinu s tím, jak přečká zimu.", p(["Lípa", "Opadá jí listí a pupeny čekají na jaro"], ["Smrk", "Jehlice mu na zimu zůstanou"], ["Tulipán", "Přečká v zemi jako cibule"], ["Mák", "Uhyne a zbudou jen semena"]), {
    hints: ["Který z nich je jehličnan?", "Lípa je listnatý strom, tulipán se sází na podzim jako cibulka a mák žije jen jeden rok."],
    explanation: "Lípa na zimu shodí listí a v pupenech čeká na jaro. Smrk si jehlice nechá. Tulipán přečká pod zemí jako cibule. Mák žije jen jeden rok a zimu přečkají jeho semena.",
  }),
  match("Spoj část rostliny s tím, co se z ní stane.", p(["Květ", "Plod"], ["Semeno", "Nová rostlina"], ["Poupě", "Rozvitý květ"], ["Pupen", "Nové listy nebo větévka"]), {
    hints: ["Pozor, poupě a pupen jsou dvě různé věci.", "Z poupěte se rozvine květ. Z pupenu na větvičce na jaře vyraší lístky. Co vznikne z květu a co ze semene?"],
    explanation: "Z opyleného květu vznikne plod. Ze semene vyroste nová rostlina. Z poupěte se rozvine květ a z pupenu vyraší nové listy nebo větévka.",
  }),
  match("Spoj pojem s tím, co znamená.", p(["Opylení", "Pyl se přenese na pestík květu"], ["Klíčení", "Ze semene vyroste kořínek a lístky"], ["Výpar", "Z listů odchází voda do vzduchu"], ["Šíření semen", "Semena se dostanou daleko od rostliny"]), {
    hints: ["Který pojem se týká semene, když se probouzí?", "Opylení se týká květu, výpar listů a šíření semen toho, kam se semena dostanou."],
    explanation: "Opylení je přenos pylu na pestík. Klíčení je probouzení semene, ze kterého vyroste kořínek a lístky. Výpar je odchod vody z listů. Šířením se semena dostávají do nových míst.",
  }),
  match("Spoj část květu s tím, k čemu slouží.", p(["Tyčinky", "Tvoří pyl"], ["Pestík", "Vznikne z něj plod"], ["Okvětní lístky", "Lákají hmyz barvou"], ["Nektar", "Sladká odměna pro hmyz"]), {
    hints: ["Který z nich je sladký?", "Tyčinky mají na konci žlutý prášek. Pestík je uprostřed květu a po opylení z něj roste plod."],
    explanation: "Tyčinky tvoří pyl. Pestík je uprostřed květu a po opylení se z něj vyvine plod. Barevné okvětní lístky lákají hmyz a nektar je pro něj sladkou odměnou.",
  }),
  match("Spoj rostlinu s tím, jak se rozmnožuje i bez semen.", p(["Jahodník", "Plazivé šlahouny"], ["Brambor", "Hlízy"], ["Tulipán", "Cibulky"], ["Muškát", "Ustřižené větvičky, řízky"]), {
    hints: ["Kdo z nich posílá po zemi dlouhé výhonky?", "Brambory se sázejí jako hlízy, tulipány jako cibulky a muškát se množí tak, že se ustřižená větvička dá do vody."],
    explanation: "Jahodník pouští plazivé šlahouny, na kterých vyrostou nové rostliny. Brambor se množí hlízami, tulipán cibulkami a muškát řízky — ustřiženými větvičkami.",
  }),
  match("Spoj rostlinu s tím, jak se šíří její semena.", p(["Lopuch", "Háčky na srsti zvířat"], ["Netýkavka", "Tobolka praskne a semena vystřelí"], ["Kokos", "Plod pluje po moři"], ["Borůvka", "Zvíře ji sní a semena vyloučí"]), {
    hints: ["Která rostlina se jmenuje podle toho, co se stane, když se jí dotkneš?", "Netýkavka má zralé tobolky, které při dotyku prasknou. Borůvky jedí ptáci i medvědi a lopuch jezdí na psech."],
    explanation: "Lopuch se háčky přichytí na srst. Tobolky netýkavky při dotyku prasknou a semena vystřelí. Kokos pluje po moři. Borůvky sní zvířata a semena vyloučí jinde.",
  }),
  match("Spoj rostlinu s tím, jak je přizpůsobená prostředí.", p(["Kaktus", "Trny místo listů šetří vodu"], ["Leknín", "Listy plavou na hladině"], ["Smrk", "Jehlice snesou mráz"], ["Rosnatka", "Lepkavé listy chytají hmyz"]), {
    hints: ["Rosnatka roste v rašeliništi, kde je v půdě málo živin.", "Kaktus roste v poušti, leknín ve vodě a smrk na horách, kde je dlouhá zima."],
    explanation: "Kaktus má místo listů trny, a tak ztrácí málo vody. Leknín má listy plovoucí na hladině. Jehlice smrku snesou mráz. Rosnatka chytá hmyz lepkavými listy, protože v rašelině má málo živin.",
  }),
  match("Spoj rostlinu se skupinou, do které patří.", p(["Pšenice", "Tráva"], ["Dub", "Strom"], ["Líska", "Keř"], ["Kopretina", "Bylina"]), {
    hints: ["Strom má jeden kmen, keř víc kmínků od země.", "Kopretina má měkký stonek a v zimě nad zemí uschne. Obilí má stéblo jako tráva na louce."],
    explanation: "Pšenice patří mezi trávy — obilniny jsou pěstované trávy. Dub je strom s jedním kmenem, líska keř s víc kmínky a kopretina bylina s měkkým stonkem.",
  }),
  match("Spoj tvar listu se stromem.", p(["Jehlice", "Smrk"], ["List jako dlaň s cípy", "Javor"], ["Složený z pěti lístků jako prsty", "Jírovec (kaštan)"], ["Srdčitý list", "Lípa"]), {
    hints: ["Lipový list připomíná srdíčko.", "Javorový list vypadá jako roztažená dlaň, kaštan má list z několika lístků jako prsty a smrk nemá listy, ale jehlice."],
    explanation: "Smrk má jehlice. Javor má list podobný dlani s cípy. Jírovec, kterému říkáme kaštan, má list složený z lístků jako prsty. Lípa má list tvaru srdce.",
  }),
  match("Spoj rostlinu s tím, kde má semena.", p(["Slunečnice", "V terči velkého květu"], ["Hrách", "V lusku"], ["Pšenice", "V klasu"], ["Mák", "V makovici"]), {
    hints: ["Hrách se loupe.", "Slunečnice má uprostřed květu velký kotouč plný semínek. Mák má semínka v kulaté tobolce a obilí v klasech."],
    explanation: "Slunečnice má semena v terči uprostřed květu. Hrách v lusku, pšenice v klasu a mák v makovici — tobolce, ze které se sype.",
  }),
  match("Spoj rostlinu s tím, na co si u ní dát pozor.", p(["Kopřiva", "Žahavé chloupky pálí"], ["Konvalinka", "Celá je jedovatá"], ["Růže", "Má ostré ostny"], ["Bolševník", "Šťáva na slunci popálí kůži"]), {
    hints: ["Která z nich pálí, když se jí jen dotkneš?", "Konvalinka krásně voní, ale nesmí se jíst. Bolševník je obrovská bylina a jeho šťáva na slunci popálí kůži. Růže píchá."],
    explanation: "Kopřiva pálí žahavými chloupky. Konvalinka je jedovatá. Růže má ostny. Šťáva bolševníku způsobí na slunci puchýře jako po popálení, proto se na něj nesahá.",
  }),
  match("Spoj, co rostlině chybí, s tím, co se s ní stane.", p(["Voda", "Uvadne a svěsí listy"], ["Světlo", "Zbledne a vytáhne se"], ["Teplo", "Semena nevyklíčí"], ["Živiny", "Roste pomalu a listy žloutnou"]), {
    hints: ["Bez čeho rostlina rychle zvadne?", "Ve tmě rostlina bledne a natahuje se za světlem. V zimě semena v zemi čekají. Co se stane v chudé půdě?"],
    explanation: "Bez vody rostlina vadne. Bez světla bledne a natahuje se. V chladu semena neklíčí. Bez živin roste pomalu a listy žloutnou.",
  }),
];

const POOL_L3: PracticeTask[] = [
  match("Spoj pokus s tím, co ukáže.", p(["Bílá kopretina ve vodě s modrou barvou", "Stonkem stoupá voda až do květu"], ["Rostlina na týden ve tmavé skříni", "Bez světla zbledne"], ["Fazole na mokré vatě", "Semeno klíčí, když má vodu"], ["Sáček přes list na slunci", "Z listu se vypařuje voda"]), {
    hints: ["Který pokus ukáže cestu vody rostlinou?", "Obarvená voda po čase zbarví okvětní lístky. Ve skříni chybí světlo. Uvnitř sáčku na listu se objeví kapky. A fazole na vatě vyklíčí."],
    explanation: "Obarvená voda vystoupá stonkem až do květu, ten zmodrá. Ve tmě rostlina zbledne. Fazole na mokré vatě vyklíčí. Sáček přes list se zevnitř orosí, protože z listu se vypařuje voda.",
  }),
  match("Spoj, co by rostlině chybělo, s tím, co by se stalo.", p(["Kořen", "Neměla by vodu a vyvrátil by ji vítr"], ["Listy", "Nevyrobila by si potravu"], ["Květy", "Nevytvořila by plody a semena"], ["Stonek", "Voda by se nedostala k listům"]), {
    hints: ["U každé části si vzpomeň, k čemu slouží, a pak si ji odmysli.", "Listy vyrábějí potravu, květy dávají plody, stonek vede vodu nahoru a kořen drží a pije."],
    explanation: "Bez kořene by rostlina neměla vodu a neudržela by se v zemi. Bez listů by si nevyrobila potravu. Bez květů by neměla plody ani semena. Bez stonku by voda z kořene nedošla k listům.",
  }),
  match("Spoj plod s tím, proč je tak stavěný.", p(["Sladký červený plod", "Aby ho sněl pták a roznesl semena"], ["Semeno s chmýřím", "Aby ho odnesl vítr"], ["Plod s háčky", "Aby se zachytil na srsti"], ["Plod lehký a plný vzduchu", "Aby plul po vodě"]), {
    hints: ["Každý tvar plodu pomáhá dostat semena někam jinam. Kdo nebo co je odnese?", "Barvu a sladkost ocení hladový pták, lehké chmýří unese vítr, háčky se zachytí na srsti a vzduch uvnitř plodu pomůže plavat."],
    explanation: "Plody jsou stavěné tak, aby se semena dostala daleko: sladké barevné sní pták, chmýří odnese vítr, háčky se zachytí na srsti a lehký plod pluje po vodě.",
  }),
  match("Spoj přizpůsobení s tím, k čemu rostlině je.", p(["Tlustý dužnatý stonek", "Zásoba vody v suchu"], ["Velmi dlouhé kořeny", "Dosáhnou vody hluboko"], ["Velké tenké listy", "Zachytí světlo ve stínu"], ["Lepkavé chloupky rosnatky", "Chytí hmyz, když půda nemá živiny"]), {
    hints: ["Kaktus má tlustý stonek. K čemu mu je v poušti?", "Rostliny v lesním stínu mají velké listy, rostliny v suchu hluboké kořeny. Co získá rosnatka z chyceného hmyzu?"],
    explanation: "Dužnatý stonek je zásobárna vody. Dlouhé kořeny dosáhnou vody hluboko v zemi. Velké tenké listy zachytí málo světla v lesním stínu. Rosnatka si z hmyzu bere živiny, které v rašelině chybějí.",
  }),
  match("Spoj děj v rostlině s tím, co k němu potřebuje.", p(["Klíčení semene", "Vodu a teplo"], ["Opylení", "Hmyz nebo vítr"], ["Výroba potravy v listech", "Světlo"], ["Šíření semen", "Vítr, vodu nebo zvířata"]), {
    hints: ["Semínka klíčí i v zemi, kde je tma. Co tedy potřebují?", "Listy pracují jen na světle. Pyl na pestík přenese hmyz nebo vítr. Semena roznese něco, co se pohybuje."],
    explanation: "Semeno klíčí, když má vodu a teplo, světlo zatím nepotřebuje. Opylení zajistí hmyz nebo vítr. Listy vyrábějí potravu jen na světle. Semena roznese vítr, voda nebo zvířata.",
  }),
  match("Spoj, co vidíš na pokojové rostlině, s tím, co jí chybí.", p(["Svěšené povadlé listy", "Voda"], ["Dlouhý bledý stonek natažený k oknu", "Světlo"], ["Žluté listy ve staré vyčerpané hlíně", "Živiny"], ["Hnijící kořeny v rozmočené hlíně", "Vzduch v půdě"]), {
    hints: ["Rostlina, která se natahuje k oknu, něco hledá.", "Povadlé listy prosí o vodu. Ale když se zalévá moc, kořeny se v mokré hlíně dusí. Co jim pak chybí?"],
    explanation: "Povadlá rostlina potřebuje vodu. Bledá a natažená k oknu potřebuje světlo. Žloutnoucí ve staré hlíně potřebuje živiny. Kořeny v rozmočené hlíně hnijí, protože jim chybí vzduch — rostlina se přelila.",
  }),
  match("Spoj rostlinu s tím, kterou část z ní jíme — i když to může mást.", p(["Rajče", "Plod se semeny"], ["Brambor", "Podzemní hlíza"], ["Mrkev", "Kořen"], ["Kedluben", "Ztlustlý stonek"]), {
    hints: ["Ne všechno, co roste pod zemí, je kořen.", "Rajče vzniklo z květu a má semínka. Z kedlubnu vyrůstají listy, takže je to stonek. Mrkev je kořen a brambora má očka, ze kterých raší."],
    explanation: "Rajče je plod, protože vzniká z květu a nese semena. Brambor je hlíza, ne kořen — má očka, ze kterých vyrůstají výhonky. Mrkev je kořen. Kedluben je ztlustlý stonek, vyrůstají z něj listy.",
  }),
  match("Spoj druh rostliny s příkladem.", p(["Jednoletá", "Mák — celý život za jeden rok"], ["Dvouletá", "Mrkev — kvete až druhý rok"], ["Vytrvalá bylina", "Konvalinka — každý rok raší ze země"], ["Dřevina", "Dub — roste stovky let"]), {
    hints: ["Mrkev sklízíme první rok. Kdyby zůstala v zemi, co by udělala druhý rok?", "Mák po jednom létě uschne, konvalinka každé jaro vyraší ze stejného kořene a dub roste stovky let."],
    explanation: "Jednoletá rostlina (mák) projde celým životem za rok. Dvouletá (mrkev) první rok roste a druhý rok kvete. Vytrvalá bylina (konvalinka) raší každý rok znovu. Dřevina (dub) žije stovky let.",
  }),
  match("Spoj část rostliny s tím, co v ní dělá voda.", p(["Kořen", "Nasává ji z půdy"], ["Stonek", "Vede ji nahoru"], ["List", "Vypařuje ji do vzduchu"], ["Plod", "Ukládá ji ve šťavnaté dužině"]), {
    hints: ["Sleduj cestu kapky vody od země až do vzduchu.", "Voda začíná v kořeni, jde stonkem vzhůru a z listů odchází do vzduchu. Kde ji rostlina schovává pro semena?"],
    explanation: "Kořen vodu nasává, stonek ji vede nahoru a listy ji vypařují do vzduchu. Část vody si rostlina uloží v šťavnatých plodech, jako je třešeň nebo jablko.",
  }),
  match("Spoj rostlinu se zvířetem, které jí pomáhá.", p(["Jabloň", "Včela ji opylí"], ["Dub", "Sojka roznese žaludy"], ["Borůvka", "Pták sní plody a roznese semena"], ["Lopuch", "Zvíře odnese plody v srsti"]), {
    hints: ["Která rostlina potřebuje, aby jí někdo přenesl pyl?", "Sojka schovává žaludy do země a na některé zapomene. Borůvky sezobe pták a lopuch jezdí na liškách a psech."],
    explanation: "Včela opylí květy jabloně. Sojka zahrabává žaludy a z zapomenutých vyrostou duby. Pták sní borůvky a semena vyloučí jinde. Lopuch se přichytí na srst a zvíře ho odnese.",
  }),
  match("Spoj pokus se semínky s tím, co se stane.", p(["Semínka na suché vatě", "Nevyklíčí, chybí voda"], ["Semínka na mokré vatě v lednici", "Klíčí velmi pomalu, je chladno"], ["Semínka na mokré vatě v teple", "Rychle vyklíčí"], ["Semínka úplně pod vodou", "Bez vzduchu nevyklíčí a shnijí"]), {
    hints: ["Semínko ke klíčení potřebuje vodu, teplo a vzduch.", "V každém pokusu něco chybí — až na jeden. Který pokus má všechno?"],
    explanation: "Semeno klíčí, když má vodu, teplo a vzduch. Na suché vatě chybí voda, v lednici teplo a pod vodou vzduch. Jen na mokré vatě v teple vyklíčí rychle.",
  }),
  match("Spoj, co nám rostliny dávají, s příkladem.", p(["Kyslík", "Vyrábějí ho zelené listy"], ["Potravu", "Obilí, zelenina a ovoce"], ["Dřevo", "Nábytek a stavby"], ["Léčivé čaje", "Heřmánek a lipový květ"]), {
    hints: ["Co vyrábějí listy, zatímco dýcháme?", "Z obilí je chleba, ze stromů prkna a z heřmánku čaj na bolení bříška."],
    explanation: "Rostliny vyrábějí kyslík, dávají nám potravu (obilí, zeleninu, ovoce), dřevo na nábytek a stavby a léčivé byliny jako heřmánek nebo lipový květ.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const STAVBAROSTLINROZSIRENIDRUHYROSTLIN: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-stavba-rostlin-rozsireni-druhy-rostlin",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-stavba-rostlin-rozsireni-druhy-rostlin",
    title: "Stavba rostlin - rozšíření, druhy rostlin",
    studentTitle: "Jak funguje rostlina",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Pochopíš části rostliny a jak se semena šíří do světa.",
    keywords: ["kořen", "stonek", "list", "květ", "plod", "semena", "opylení", "šíření semen", "klíčení"],
    goals: [
      "Popsat funkci kořene, stonku, listu, květu a plodu",
      "Vysvětlit, co rostlina potřebuje k životu a ke klíčení",
      "Uvést způsoby šíření semen (vítr, voda, živočichové)",
      "Popsat, jak se rostliny přizpůsobují prostředí a jak přečkají zimu",
    ],
    boundaries: [
      "Podrobná buněčná biologie není náplní 4. ročníku",
      "Odborné pojmy (chloroplast, xylém a floém, kambium, čnělka, pylová láčka) patří na 2. stupeň",
    ],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "U každé části rostliny se zeptej: kde je a co by rostlině chybělo, kdyby ji neměla?",
      steps: [
        "Kořen: drží v zemi a nasává vodu.",
        "Stonek: nese listy a vede vodu nahoru.",
        "List: na světle vyrábí potravu a vypařuje vodu.",
        "Květ → plod → semeno → nová rostlina.",
      ],
      commonMistake: "Brambora není kořen, ale hlíza — a rajče je z pohledu přírodovědy plod.",
      example: "Bílá kopretina ve vodě s barvou zmodrá: voda stoupá stonkem až do květu.",
    },
  },
];
