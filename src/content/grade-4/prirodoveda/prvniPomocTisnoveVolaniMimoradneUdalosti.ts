/**
 * Přírodověda 4. ročník — První pomoc, tísňové volání, mimořádné události.
 *
 * Otázky, klíče i možnosti jsou z věcně ověřené verze (přepis 2026-09-01,
 * fakt-check podle metodiky HZS ČR) a zůstaly beze změny — freeze otisk
 * (otázka + klíč) se tím nemění. 2026-09-11 přibyla ke každé úloze
 * dokumentace, která chyběla: dvě vlastní nápovědy, vysvětlení PROČ
 * a diagnostika každé špatné možnosti. Do té doby dítě u všech úloh
 * dostávalo stejnou nápovědu s tísňovými čísly, i u otázky na puchýř.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "./_shared";

// L1 — rozpoznání: znám číslo, znám základní úkon.
const POOL_L1: PracticeTask[] = [
  choice("Na jaké číslo zavoláš záchrannou službu?", "155", [
    { value: "150", why: "150 jsou hasiči. Záchranka má číslo o pět vyšší." },
    { value: "158", why: "158 je policie. Záchranka je 155." },
    { value: "112", why: "112 je jednotné evropské číslo, i tam ti pomohou. Přímé číslo záchranky je ale 155." },
  ], {
    hints: ["Všechna česká tísňová čísla začínají 15.", "Hasiči mají na konci nulu, policie osmičku. Záchranka má na konci stejnou číslici jako na druhém místě."],
    explanation: "Záchranná služba má číslo 155. Česká tísňová čísla začínají 15: 150 hasiči, 155 záchranka, 158 policie. Číslo 112 funguje v celé Evropské unii.",
  }),
  choice("Na jaké číslo zavoláš hasiče?", "150", [
    { value: "112", why: "112 je evropské tísňové číslo. Přímé číslo hasičů je 150." },
    { value: "158", why: "158 je policie." },
    { value: "155", why: "155 je záchranná služba." },
  ], {
    hints: ["Hasiči mají to české tísňové číslo, které končí nulou.", "Začni 15 a přidej číslici, která znamená „nic“. Hasiči přijíždějí k ohni jako první."],
    explanation: "Hasiči mají číslo 150. Pomáhají u požárů, povodní i dopravních nehod. Záchranka je 155 a policie 158.",
  }),
  choice("Na jaké číslo zavoláš policii?", "158", [
    { value: "150", why: "150 jsou hasiči." },
    { value: "155", why: "155 je záchranná služba." },
    { value: "112", why: "112 je jednotné evropské číslo. Přímé číslo policie je 158." },
  ], {
    hints: ["Policie má ze tří českých tísňových čísel to nejvyšší.", "Začni 15. Hasiči mají na konci nulu, záchranka pětku a policie číslici ještě o tři vyšší."],
    explanation: "Policie má číslo 158. Česká tísňová čísla jsou 150 hasiči, 155 záchranka a 158 policie.",
  }),
  choice("Které tísňové číslo funguje ve všech státech Evropské unie?", "112", [
    { value: "150", why: "150 je číslo českých hasičů, v cizině nemusí fungovat." },
    { value: "155", why: "155 je číslo české záchranky, v jiných státech platí jiná čísla." },
    { value: "158", why: "158 je číslo české policie." },
  ], {
    hints: ["Tohle číslo nezačíná 15.", "Je krátké, snadno se pamatuje a začíná jedničkou dvakrát za sebou. Dovoláš se na něj na dovolené u moře i doma."],
    explanation: "Číslo 112 funguje ve všech státech Evropské unie a operátor pošle hasiče, záchranku i policii. Hodí se hlavně v cizině, kde neznáš místní čísla.",
  }),
  choice("Kdo při tísňovém volání ukončuje hovor jako první?", "Operátor, který hovor přijal", [
    { value: "Ten, kdo volá, jakmile řekne adresu", why: "Operátor se může ještě doptat nebo poradit. Proto nezavěšuj ty." },
    { value: "Oba zavěsí ve stejnou chvíli", why: "Hovor ukončuje operátor, až má všechny informace." },
    { value: "Záleží na tom, kdo mluví déle", why: "Na délce nezáleží. Hovor vždy ukončí operátor." },
  ], {
    hints: ["Kdo ví, jestli už má všechny informace, které záchranáři potřebují?", "Operátor se tě může ještě na něco zeptat nebo ti poradit, co dělat, než pomoc dorazí. Kdo tedy smí zavěsit?"],
    explanation: "Hovor ukončuje operátor. Může se ještě doptat na podrobnosti nebo ti radit, jak zraněnému pomoci, dokud nepřijede záchranka.",
  }),
  choice("Co má zaznít hned na začátku tísňového hovoru?", "Místo, kde se neštěstí stalo", [
    { value: "Tvoje celé jméno a příjmení", why: "Jméno řekneš taky, ale nejdůležitější je, kam má pomoc jet." },
    { value: "Kolik je ti přesně let", why: "Věk operátor nepotřebuje hned. Potřebuje vědět, kam poslat pomoc." },
    { value: "Jak dlouho už tam stojíš", why: "To není důležité. Nejdřív místo, pak co se stalo." },
  ], {
    hints: ["Co musí záchranáři vědět, aby vůbec mohli vyjet?", "Kdyby se hovor po první větě přerušil, jaká informace by jim stačila, aby pomoc dorazila?"],
    explanation: "Nejdřív řekni, kde se neštěstí stalo. Kdyby se hovor přerušil, pomoc už ví, kam jet. Pak řekneš, co se stalo, kolik je zraněných a kdo volá.",
  }),
  choice("Čím se chladí čerstvá popálenina?", "Studenou tekoucí vodou", [
    { value: "Kostkami ledu z mrazáku", why: "Led je příliš studený a může kůži poškodit mrazem." },
    { value: "Máslem nebo olejem", why: "Mastnota teplo v kůži udrží a ránu zhorší." },
    { value: "Zubní pastou z tuby", why: "Zubní pasta ránu nechladí a může ji podráždit." },
  ], {
    hints: ["Popálenina potřebuje odvést teplo z kůže, ale šetrně.", "Hledej něco, co najdeš u každého umyvadla a co stéká po kůži a odnáší teplo."],
    explanation: "Popáleninu chladíme studenou tekoucí vodou deset až dvacet minut. Voda odvede teplo a zmírní bolest. Led, máslo ani pasta se nepoužívají.",
  }),
  choice("Co uděláš s odřeným kolenem?", "Opláchneš ranku a přelepíš náplastí", [
    { value: "Necháš ji být a jdeš dál hrát", why: "Do neošetřené ranky se může dostat špína a zanítit se." },
    { value: "Přiložíš na ni kostku ledu", why: "Led se hodí na otok, ne na odřeninu. Ranku je potřeba vyčistit." },
    { value: "Potřeš ji mastným krémem", why: "Mastný krém ranku nevyčistí. Nejdřív opláchnout, pak zakrýt." },
  ], {
    hints: ["Odřenina je špinavá od země. Co s tím?", "Nejdřív z ní smyj písek a špínu, pak ji zakryj, aby se do ní nic nedostalo."],
    explanation: "Odřeninu opláchneme čistou vodou, aby v ní nezůstala špína, a přelepíme náplastí. Tak se ranka nezanítí a rychle se zahojí.",
  }),
  choice("Koho zavoláš jako prvního, když se kamarád na hřišti vážně zraní?", "Dospělého, který je nejblíž", [
    { value: "Spolužáka ze své třídy", why: "Spolužák je taky dítě. Vážné zranění musí řešit dospělý." },
    { value: "Sourozence, až přijdeš domů", why: "Do té doby by bylo pozdě. Pomoc je potřeba hned." },
    { value: "Nikoho, zvládneš to sám", why: "Vážné zranění nezvládne dítě samo. Přivolej dospělého." },
  ], {
    hints: ["Kdo umí rozhodnout, jestli volat záchranku?", "Hledej toho, kdo je nejblíž a může pomoct hned — ne až za hodinu."],
    explanation: "Když se někdo vážně zraní, přivolej hned nejbližšího dospělého — učitele, trenéra, kolemjdoucího. Když žádný není, volej 155.",
  }),
  choice("Co patří do domácí lékárničky?", "Obvaz, náplast a dezinfekce", [
    { value: "Nůžky na papír a lepidlo", why: "Nůžky se hodí, ale lepidlo do lékárničky nepatří." },
    { value: "Teploměr na měření počasí", why: "Do lékárničky patří teploměr na měření horečky, ne počasí." },
    { value: "Náhradní baterie a nabíječka", why: "Baterie a nabíječka nejsou pomůcky první pomoci." },
  ], {
    hints: ["Co potřebuješ, když ošetřuješ ránu?", "Ránu vyčistíš, zakryješ a když krvácí víc, převážeš ji. Jaké tři věci k tomu použiješ?"],
    explanation: "V lékárničce má být obvaz, náplasti, dezinfekce, nůžky, rukavice a teploměr na horečku. Díky nim ošetříš drobné poranění.",
  }),
  choice("Co znamená kolísavý tón sirény?", "Varování před nebezpečím", [
    { value: "Zkouška školního rozhlasu", why: "Rozhlas sirénou nezkouší. Zkouška sirén má jiný, stálý tón." },
    { value: "Konec vyučování ve škole", why: "Konec vyučování oznamuje zvonek, ne siréna." },
    { value: "Oznámení pravého poledne", why: "Poledne siréna neoznamuje. Kolísavý tón varuje." },
  ], {
    hints: ["Kolísavý tón stoupá a klesá a trvá asi dvě minuty.", "Stálý tón při zkoušce sirén znáš z první středy v měsíci. Kolísavý tón ale znamená něco vážného."],
    explanation: "Kolísavý tón sirény je signál Všeobecná výstraha — varuje před nebezpečím. Máme se ukrýt v budově, zavřít okna a zapnout rádio nebo televizi.",
  }),
  choice("Kudy opustíš hořící budovu?", "Po schodech ven z domu", [
    { value: "Výtahem, je to rychlejší", why: "Výtah se při požáru může zastavit a uvěznit tě v kouři." },
    { value: "Schováš se do koupelny", why: "V koupelně tě oheň a kouř mohou uvěznit. Musíš ven." },
    { value: "Zůstaneš stát u okna", why: "U okna čekáš jen tehdy, když cestu ven zablokuje oheň." },
  ], {
    hints: ["Který způsob ti nemůže uprostřed cesty vypnout proud?", "Při požáru se může zastavit elektřina. Kudy se dostaneš dolů vlastníma nohama?"],
    explanation: "Z hořící budovy se odchází po schodech, co nejníž u země, kde je méně kouře. Výtah se při požáru může zastavit.",
  }),
  choice("Co uděláš, když kamarádovi teče krev z ranky na ruce?", "Přitlačíš na ni čistou látku", [
    { value: "Opláchneš ji pod tekoucí vodou", why: "Voda krev odplaví, ale krvácení nezastaví. Nejdřív přitlačit." },
    { value: "Počkáš, až to samo přestane", why: "Čekáním kamarád ztrácí krev. Krvácení se musí zastavit." },
    { value: "Zafoukáš na ni, aby to nebolelo", why: "Foukání krvácení nezastaví." },
  ], {
    hints: ["Krvácení zastaví tlak.", "Vezmi kapesník nebo obvaz a zatlač přímo na místo, odkud teče krev. Ruku pak zvedni výš."],
    explanation: "Krvácení zastavíme tak, že na ránu přitlačíme čistou látku nebo obvaz. Končetinu zvedneme výš a přivoláme dospělého.",
  }),
];

// L2 — aplikace: konkrétní situace vede ke konkrétnímu úkonu.
const POOL_L2: PracticeTask[] = [
  choice("Operátor se tě ptá na podrobnosti. Co všechno mu řekneš?", "Kde to je, co se stalo, kolik je zraněných a kdo volá", [
    { value: "Jen adresu, na víc se stejně nikdo neptá", why: "Operátor potřebuje vědět i co se stalo a kolik lidí je zraněno, aby poslal správnou pomoc." },
    { value: "Jen své jméno a číslo telefonu", why: "Bez místa a popisu neštěstí pomoc nemůže vyjet." },
    { value: "Jen to, jak k tomu zranění došlo", why: "Nejdůležitější je místo. Samotný popis nestačí." },
  ], {
    hints: ["Záchranáři musí vědět, kam jet a co je tam čeká.", "Pomůže ti čtveřice otázek: kde, co, kolik a kdo. Která odpověď obsahuje všechny?"],
    explanation: "Operátorovi řekneš: kde se to stalo, co se stalo, kolik je zraněných a kdo volá. Podle toho pošle správnou pomoc. Hovor pak ukončí on.",
  }),
  choice("Jak dlouho chladíš popálené místo?", "Deset až dvacet minut", [
    { value: "Zhruba deset vteřin", why: "Deset vteřin je málo, kůže zůstane horká a pálí dál." },
    { value: "Celou hodinu bez přestávky", why: "Hodina je zbytečně dlouho, zvlášť u malého dítěte by mohlo prochladnout." },
    { value: "Chladit se nemá vůbec", why: "Chlazení je u popáleniny to nejdůležitější." },
  ], {
    hints: ["Kůže je horká i uvnitř, teplo z ní musí odejít.", "Je to déle než přestávka mezi hodinami, ale kratší než celá vyučovací hodina."],
    explanation: "Popálené místo chladíme studenou tekoucí vodou deset až dvacet minut. Teplo odejde i z hlubších vrstev kůže a bolest se zmírní.",
  }),
  choice("Kamarád spadl z kola a ruka mu otekla. Co uděláš?", "Necháš ruku v klidu a přivoláš dospělého", [
    { value: "Zkusíš mu ruku narovnat do správné polohy", why: "Narovnávání může zlomeninu zhoršit a moc bolí. To dělá jen lékař." },
    { value: "Rozhýbeš mu ruku, ať otok splaskne", why: "Pohyb může zlomeninu zhoršit." },
    { value: "Přiložíš mu na ruku horký obklad", why: "Teplo otok zvětší. Pomáhá spíš chlad a klid." },
  ], {
    hints: ["Oteklá ruka po pádu může být zlomená.", "Se zlomenou kostí se nemá hýbat. Kdo pak rozhodne, jestli jet k lékaři?"],
    explanation: "Otok po pádu může znamenat zlomeninu. Ruku necháme v klidu, nehýbeme s ní a přivoláme dospělého, který zajistí lékaře.",
  }),
  choice("Kamarád leží na zemi, nereaguje, ale dýchá. Co uděláš?", "Zavoláš 155 a zůstaneš u něj", [
    { value: "Necháš ho odpočívat a odejdeš", why: "Člověk v bezvědomí potřebuje rychlou pomoc a nesmí zůstat sám." },
    { value: "Posadíš ho a dáš mu napít", why: "Člověku v bezvědomí se nesmí nic dávat do úst, mohl by se zadusit." },
    { value: "Zkusíš ho probrat politím vodou", why: "Polití nepomůže a voda by se mu mohla dostat do dýchacích cest." },
  ], {
    hints: ["Kamarád nereaguje — to je vážné, i když dýchá.", "Potřebuje rychle odbornou pomoc a někoho, kdo u něj bude. Které číslo vytočíš?"],
    explanation: "Když někdo nereaguje, je v bezvědomí. Zavoláme 155, zůstaneme u něj a hlídáme, jestli dýchá. Když dýchá, uložíme ho na bok.",
  }),
  choice("Teče ti krev z nosu. Co uděláš?", "Předkloníš hlavu a stiskneš nosní křídla", [
    { value: "Zakloníš hlavu co nejvíc dozadu", why: "Při záklonu krev teče do krku a žaludku. Hlava se předklání." },
    { value: "Lehneš si na záda a chvíli počkáš", why: "Vleže na zádech krev stéká do krku." },
    { value: "Vysmrkáš se, ať krev vyjde ven", why: "Smrkání krvácení ještě zhorší." },
  ], {
    hints: ["Krev nesmí stékat do krku.", "Hlavu dej dopředu, jako když se díváš na boty, a prsty zmáčkni měkkou část nosu."],
    explanation: "Při krvácení z nosu se předkloníme a stiskneme nosní křídla asi na deset minut. Krev pak neteče do krku a krvácení se zastaví.",
  }),
  choice("Na popálené kůži se udělal puchýř. Co s ním?", "Necháš ho být a zakryješ ho", [
    { value: "Propíchneš ho čistou jehlou", why: "Propíchnutím se do rány dostane špína a může se zanítit." },
    { value: "Rozmáčkneš ho a vytřeš", why: "Tím odkryješ citlivou kůži a může se zanítit." },
    { value: "Potřeš ho zubní pastou", why: "Pasta nepomáhá a může kůži dráždit." },
  ], {
    hints: ["Puchýř je jako přirozená náplast.", "Kůže nad puchýřem chrání ranku pod ním před špínou. Co s ním tedy nedělat?"],
    explanation: "Puchýř nepropichujeme. Kůže nad ním chrání ránu před špínou. Zakryjeme ho čistým obvazem a při větší popálenině jdeme k lékaři.",
  }),
  choice("Proč se při požáru pohybuješ co nejblíže u podlahy?", "U země zůstává vzduch čistší", [
    { value: "U země je vždycky chladněji", why: "Chlad není důvod. Kouř stoupá nahoru, dole je čistší vzduch." },
    { value: "Aby tě z chodby nikdo neviděl", why: "Naopak chceš, aby tě hasiči našli. Dole je čistší vzduch." },
    { value: "Kvůli nízkému stropu nad hlavou", why: "O strop nejde. Horký kouř stoupá vzhůru." },
  ], {
    hints: ["Kam stoupá horký kouř?", "Horký vzduch a kouř jdou nahoru ke stropu. Kde tedy zůstane vzduch, který se dá dýchat?"],
    explanation: "Horký kouř stoupá ke stropu. U podlahy zůstává čistší vzduch, a proto se při požáru pohybujeme sehnutí nebo po čtyřech.",
  }),
  choice("Řeka se vylila z břehů a voda stoupá. Kam půjdeš?", "Na vyvýšené místo dál od vody", [
    { value: "Na břeh se podívat, jak stoupá", why: "U břehu tě může proud strhnout." },
    { value: "Do sklepa, tam je bezpečno", why: "Sklep se zaplaví jako první." },
    { value: "Na most, odtud je nejlepší výhled", why: "Most může povodeň poškodit nebo strhnout." },
  ], {
    hints: ["Voda teče dolů a zaplavuje nejdřív nejnižší místa.", "Hledej místo, kam voda nedosáhne ani při dalším stoupání — vysoko a co nejdál od řeky. Sklep ani most to nejsou."],
    explanation: "Při povodni jdeme na vyvýšené místo nebo do vyššího patra, dál od vody. Sklepy, břehy a mosty jsou nebezpečné.",
  }),
  choice("Na chodníku leží cizí člověk a nehýbe se. Co uděláš?", "Zavoláš 155 a řekneš to dospělému", [
    { value: "Projdeš kolem, není to tvoje věc", why: "I dítě může pomoci tím, že přivolá pomoc." },
    { value: "Zatřeseš s ním a postavíš ho", why: "Postavit člověka v bezvědomí nejde a mohl by upadnout." },
    { value: "Vezmeš mu telefon a zavoláš rodině", why: "Nejdřív je potřeba odborná pomoc — záchranka." },
  ], {
    hints: ["Nevíš, co mu je. Kdo to pozná?", "Pomoc zavoláš sám telefonem a zároveň požádáš o pomoc někoho dospělého kolem."],
    explanation: "Když někdo leží a nehýbe se, zavoláme 155 a upozorníme dospělé kolem. Pomoci může i dítě — tím, že nepřejde bez povšimnutí.",
  }),
  choice("Kamaráda štípla včela do krku a začíná mu otékat. Co uděláš?", "Okamžitě voláš 155", [
    { value: "Dáš mu napít studené vody", why: "Pití otok nezastaví. Otok v krku může zablokovat dýchání." },
    { value: "Přiložíš mu obklad a čekáš", why: "Čekání je nebezpečné. Otok v krku potřebuje lékaře hned." },
    { value: "Necháš to být, otok splaskne", why: "Otok v krku může zhoršit dýchání. Je to vážné." },
  ], {
    hints: ["Proč je otok zrovna v krku tak nebezpečný?", "Krkem prochází vzduch do plic. Když oteče, kamarád se může začít dusit. Kdo musí přijet hned?"],
    explanation: "Otok v krku po bodnutí může zúžit dýchací cesty a kamarád by se mohl dusit. Proto hned voláme 155.",
  }),
  choice("Co nesmíš udělat člověku, který je v bezvědomí?", "Dát mu napít nebo najíst", [
    { value: "Přikrýt ho, aby mu nebyla zima", why: "Přikrýt ho je správně, chrání ho to před prochladnutím." },
    { value: "Mluvit na něj, i když neodpovídá", why: "Mluvit na něj je správně, můžeš tak zjistit, jestli se probírá." },
    { value: "Zůstat u něj a čekat na pomoc", why: "Zůstat u něj je správně, nesmí zůstat sám." },
  ], {
    hints: ["Tři z možností jsou správné kroky. Hledej ten, který by mu ublížil.", "Člověk v bezvědomí neumí polykat. Co by se stalo s vodou nebo jídlem v jeho puse?"],
    explanation: "Člověk v bezvědomí nemůže polykat, a jídlo nebo pití by mu vniklo do dýchacích cest a mohl by se zadusit. Přikrýt ho, mluvit na něj a zůstat u něj je správně.",
  }),
  choice("Voláš na tísňovou linku, ale neznáš přesnou adresu. Co uděláš?", "Popíšeš, co je kolem tebe vidět", [
    { value: "Zavěsíš a hledáš někoho, kdo ji zná", why: "Nezavěšuj. Operátor místo najde i podle popisu." },
    { value: "Řekneš jen město a zavěsíš", why: "Samotné město je moc velké. Popiš okolí a nezavěšuj." },
    { value: "Počkáš, až půjde kolem dospělý", why: "Čekání zdrží pomoc. Volej hned a popiš, co vidíš." },
  ], {
    hints: ["Operátor ti pomůže místo najít, když mu dáš vodítka.", "Rozhlédni se: jaký obchod, škola, kostel, zastávka nebo řeka je poblíž? To všechno operátorovi pomůže."],
    explanation: "Když neznáš adresu, popiš, co vidíš kolem: název obchodu, školy, ulice na ceduli, zastávku. Operátor podle toho místo najde.",
  }),
  choice("Cítíš v bytě plyn. Co uděláš jako první?", "Otevřeš okna a nezapínáš světlo", [
    { value: "Rozsvítíš, ať vidíš, odkud jde", why: "Jiskra ve vypínači může plyn zapálit a způsobit výbuch." },
    { value: "Zapálíš sirku a zkontroluješ sporák", why: "Plamen může plyn zapálit — hrozí výbuch." },
    { value: "Zavřeš okna, ať plyn neuteče ven", why: "Plyn musí ven. Zavřenými okny by se ho nahromadilo víc." },
  ], {
    hints: ["Unikající plyn může vybuchnout od jiskry.", "Plyn potřebuje ven z bytu a nesmí se k němu dostat žádná jiskra ani plamen. Co z nabídky to splní?"],
    explanation: "Plyn může vybuchnout od jiskry nebo plamene. Otevřeme okna, nezapínáme světlo ani spotřebiče, odejdeme z bytu a zavoláme dospělého nebo hasiče z venku.",
  }),
];

// L3 — proč a v jakém pořadí: zdůvodnění pravidla, volba priority, vyvrácení mýtu.
const POOL_L3: PracticeTask[] = [
  choice("Proč máš při tísňovém volání počkat, až hovor ukončí operátor?", "Může se doptat a poradit ti, co dělat", [
    { value: "Je to jen slušnost při telefonování", why: "Nejde o slušnost. Operátor ti může ještě poradit." },
    { value: "Jinak se hovor nezapíše do systému", why: "Hovor se zapíše tak jako tak. Důležitá je rada operátora." },
    { value: "Aby se stihl zeptat na tvůj věk", why: "Věk není důvod. Operátor se může ptát na věci důležité pro pomoc." },
  ], {
    hints: ["Co ještě může operátor udělat, když hovor trvá?", "Operátor ví, co dělat, než záchranka dorazí. Co by se stalo, kdyby hovor skončil hned po adrese?"],
    explanation: "Operátor se může doptat na podrobnosti a poradit ti, jak zraněnému pomoci, dokud nedorazí záchranka. Proto hovor ukončuje on.",
  }),
  choice("Proč se se zlomenou končetinou nemá hýbat?", "Pohyb může poranění ještě zhoršit", [
    { value: "Zraněný by se mohl začít potit", why: "Pocení není důvod. Pohyb poškodí zlomené místo." },
    { value: "Kost by přirostla v jiné poloze", why: "Kost nepřiroste hned. Pohyb ale může zlomené konce posunout a poranit okolí." },
    { value: "Otok by se přesunul jinam", why: "Otok se nepřesouvá. Pohyb zhoršuje zlomeninu." },
  ], {
    hints: ["Co je uvnitř kolem zlomené kosti?", "Ostré konce zlomené kosti se při pohybu posouvají a mohou poranit svaly a cévy kolem. Co tedy s končetinou dělat?"],
    explanation: "Při pohybu se zlomené konce kosti posouvají a mohou poranit svaly, cévy a nervy. Proto končetinu necháme v klidu a počkáme na odbornou pomoc.",
  }),
  choice("Proč se popálenina nechladí ledem?", "Led kůži poškodí mrazem", [
    { value: "Led nechladí dostatečně silně", why: "Led chladí až moc silně, a právě to kůži škodí." },
    { value: "Led by ránu jenom znečistil", why: "Nejde o špínu. Led kůži omrzne." },
    { value: "Led by se moc rychle rozpustil", why: "Rychlost tání není důvod. Led je na popálenou kůži příliš studený." },
  ], {
    hints: ["Co udělá mráz se zdravou kůží?", "Popálená kůže je citlivá. Když na ni přiložíš něco hodně studeného, přidáš k popálení další poranění. Jaké?"],
    explanation: "Led je tak studený, že může popálenou kůži ještě omrznout. Proto chladíme studenou tekoucí vodou, která odvede teplo šetrně.",
  }),
  choice("Proč se člověku v bezvědomí nesmí nic dát do úst?", "Mohl by se tekutinou zadusit", [
    { value: "Mohlo by mu být špatně od žaludku", why: "Hlavní nebezpečí je jinde — neumí polykat a zadusil by se." },
    { value: "Zkazilo by to vyšetření v nemocnici", why: "O vyšetření nejde. Hrozí udušení." },
    { value: "Zbytečně by se tím probudil", why: "Probuzení by bylo dobré. Nebezpečí je v tom, že neumí polykat." },
  ], {
    hints: ["Co člověk v bezvědomí neumí?", "Když spolkneš vodu, jde do žaludku. Člověk v bezvědomí polykat neumí — kam by voda mohla vniknout?"],
    explanation: "Člověk v bezvědomí neumí polykat. Tekutina nebo jídlo by mu mohly vniknout do dýchacích cest a udusit ho.",
  }),
  choice("Jeden kamarád si odřel koleno, druhému teče krev z rozbité ruky. Komu pomůžeš dřív?", "Tomu, kdo silně krvácí", [
    { value: "Tomu s odřeným kolenem", why: "Odřenina počká. Silné krvácení je nebezpečnější." },
    { value: "Tomu, kdo si řekne první", why: "Nerozhoduje, kdo se ozve, ale kdo je víc v nebezpečí." },
    { value: "Tomu, kdo stojí blíž k tobě", why: "Vzdálenost nerozhoduje. Rozhoduje, čí zranění je vážnější." },
  ], {
    hints: ["Které zranění může za pár minut ublížit víc?", "Odřené koleno bolí, ale nic se nestane, když počká. Při silném krvácení člověk rychle ztrácí krev."],
    explanation: "Nejdřív pomáháme tomu, komu hrozí větší nebezpečí. Silné krvácení je vážnější než odřenina, proto nejdřív přitlačíme ránu, pak ošetříme koleno.",
  }),
  choice("Proč se při požáru nesmí použít výtah?", "Může se zastavit a uvěznit tě", [
    { value: "Ve výtahu je vždycky víc kouře", why: "Kouř tam být může, ale hlavní nebezpečí je, že se výtah zastaví." },
    { value: "Výtah jezdí pomaleji než schody", why: "Rychlost není důvod. Při požáru může vypadnout proud." },
    { value: "Výtah se od horka hned roztaví", why: "Výtah se neroztaví, ale může se zastavit mezi patry." },
  ], {
    hints: ["Na čem výtah jezdí a co se při požáru často vypne?", "Když vypadne elektřina, výtah zůstane stát mezi patry. Kde bys pak byl, když se šíří kouř?"],
    explanation: "Při požáru často vypadne elektřina a výtah se zastaví mezi patry. Uvěznil by tě a do šachty může táhnout kouř. Proto vždy po schodech.",
  }),
  choice("Proč se puchýř po popálenině nepropichuje?", "Kůže pod ním je chráněná před špínou", [
    { value: "Bolelo by to pak ještě mnohem víc", why: "Bolest není hlavní důvod. Puchýř chrání ránu před infekcí." },
    { value: "Puchýř sám od sebe zmizí do hodiny", why: "Puchýř vydrží několik dní. Důvod je ochrana rány." },
    { value: "Zůstala by po něm velká jizva", why: "Jizva není hlavní důvod. Otevřená rána se může zanítit." },
  ], {
    hints: ["Co je pod puchýřem a co ho chrání?", "Kůže nad puchýřem funguje jako přirozený obvaz. Co by se dostalo do rány, kdybys ho otevřel?"],
    explanation: "Kůže nad puchýřem je přirozený obvaz. Chrání ránu pod ním před špínou a bakteriemi. Po propíchnutí by se rána mohla zanítit.",
  }),
  choice("Bezvědomého, který dýchá, uložíme na bok. Co tím získá?", "Nezadusí se, kdyby se pozvracel", [
    { value: "Rychleji se mu vrátí vědomí", why: "Poloha na boku vědomí nevrací. Chrání dýchací cesty." },
    { value: "Lépe se mu na boku odpočívá", why: "Nejde o pohodlí. Jde o to, aby se nezadusil." },
    { value: "Přestane ho bolet hlava", why: "Poloha na boku bolest neléčí. Chrání dýchání." },
  ], {
    hints: ["Co by se stalo, kdyby mu ležícímu na zádech něco zateklo do krku?", "Na boku mu případné zvratky nebo sliny vytečou z pusy ven a jazyk mu nezapadne do krku. Co tím odvrátíš?"],
    explanation: "Na zádech by mohl člověk v bezvědomí vdechnout zvratky nebo mu zapadne jazyk. Na boku mu vše vyteče z úst a dýchací cesty zůstanou volné.",
  }),
  choice("Co uděláš, když nevíš, jestli je zranění dost vážné na záchranku?", "Zavoláš, vážnost posoudí operátor", [
    { value: "Počkáš, jestli se to samo zhorší", why: "Čekáním se může ztratit důležitý čas." },
    { value: "Zavoláš až ráno do ordinace", why: "Vážné zranění nemůže čekat do rána." },
    { value: "Poradíš se nejdřív se spolužáky", why: "Spolužáci to neposoudí o nic lépe. Operátor je na to vyškolený." },
  ], {
    hints: ["Kdo umí rozhodnout, jestli poslat záchranku?", "Operátor tísňové linky je na to vyškolený. Co je horší — zavolat zbytečně, nebo nezavolat, když bylo potřeba?"],
    explanation: "Když si nejsi jistý, zavolej 155. Operátor posoudí, jestli pošle záchranku, nebo poradí jinak. Zbytečné zavolání je menší chyba než čekání.",
  }),
  choice("Proč hlásíš místo neštěstí dřív než popis zranění?", "Kdyby se hovor přerušil, pomoc už ví, kam jet", [
    { value: "Protože je to kratší a řekne se to rychleji", why: "Délka není důvod. Místo je nejdůležitější informace." },
    { value: "Operátor si stejně zapisuje jenom adresu", why: "Operátor si zapisuje i co se stalo. Místo ale musí znát první." },
    { value: "Popis zranění se hlásí až v nemocnici", why: "Popis se hlásí operátorovi taky, jen až po místě." },
  ], {
    hints: ["Co by se stalo, kdyby ti uprostřed hovoru došla baterie?", "Bez místa pomoc nemůže vyjet, i kdyby znala každý detail zranění. Co musí zaznít, než může dojít k přerušení?"],
    explanation: "Místo je nejdůležitější. Kdyby se hovor přerušil, záchranáři už vědí, kam jet. Popis zranění pak doplníš.",
  }),
  choice("Proč se ani malý požár nemáš pokoušet uhasit sám?", "Oheň se šíří rychleji, než čekáš", [
    { value: "Hasiči by pak měli méně práce", why: "O práci hasičů nejde. Jde o tvoje bezpečí." },
    { value: "Za vlastní hašení se platí pokuta", why: "Pokuta se za to neplatí. Hrozí ti ale nebezpečí." },
    { value: "Voda by nábytek poškodila víc", why: "Nábytek není důležitý. Oheň se může rychle rozšířit a zranit tě." },
  ], {
    hints: ["Jak rychle se oheň rozšíří z koše na záclonu?", "Za pár vteřin může malý plamen chytit další věci a zaplnit pokoj kouřem. Co je pro dítě bezpečnější?"],
    explanation: "Oheň se šíří velmi rychle a kouř je jedovatý. Dítě má z místnosti odejít, zavřít dveře, varovat ostatní a zavolat dospělého nebo 150.",
  }),
  choice("Kamarád tvrdí, že popáleninu je nejlepší potřít máslem. Co mu odpovíš?", "Mastnota teplo udrží a ránu zhorší", [
    { value: "Má pravdu, máslo ránu ochladí", why: "Máslo neochladí. Mastná vrstva teplo v kůži naopak zadrží." },
    { value: "Lepší je na to sádlo než máslo", why: "Sádlo je taky mastné a škodí stejně." },
    { value: "Záleží na tom, jak je popálenina velká", why: "Mastnota škodí u malé i velké popáleniny." },
  ], {
    hints: ["Co udělá mastná vrstva s teplem v kůži?", "Mastnota vytvoří na kůži pokličku a teplo pod ní zůstane. Co se pak děje s popáleninou?"],
    explanation: "Máslo ani jiný tuk popáleninu neochladí. Vytvoří vrstvu, pod kterou teplo zůstane, a rána se zhorší. Správně je studená tekoucí voda.",
  }),
  choice("Jsi doma sám a venku se rozezní siréna. Co uděláš nejdřív?", "Zůstaneš uvnitř a zapneš rádio", [
    { value: "Vyběhneš ven podívat se, co se děje", why: "Venku může být nebezpečí. Siréna říká: ukryj se." },
    { value: "Zavoláš na linku 155", why: "Tísňová linka je pro konkrétní nehodu. Informace o poplachu dá rádio." },
    { value: "Otevřeš všechna okna dokořán", why: "Okna je naopak potřeba zavřít, kdyby venku unikala nebezpečná látka." },
  ], {
    hints: ["Siréna varuje před nebezpečím venku. Kde jsi v bezpečí?", "Zůstaň v budově, zavři okna a zjisti, co se děje. Odkud se to dozvíš, když jsi doma sám?"],
    explanation: "Siréna varuje před nebezpečím. Zůstaneme v budově, zavřeme okna a zapneme rádio nebo televizi, kde se dozvíme, co se děje a co dělat.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const PRVNIPOMOCTISNOVEVOLANIMIMORADNEUDALOSTI: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-clovek-a-jeho-zdravi-bezpecnost-prvni-pomoc-tisnove-volani-mimoradne-udalosti",
    rvpNodeId: "g4-prirodoveda-clovek-a-jeho-zdravi-bezpecnost-prvni-pomoc-tisnove-volani-mimoradne-udalosti",
    title: "První pomoc, tísňové volání, mimořádné události",
    studentTitle: "První pomoc",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Člověk a jeho zdraví",
    briefDescription: "Naučíš se přivolat pomoc a ošetřit drobné zranění, než přijde dospělý.",
    keywords: ["první pomoc", "tísňové volání", "112", "155", "krvácení", "popálenina", "zlomenina", "požár", "siréna"],
    goals: [
      "Znát tísňová čísla a vědět, co říct operátorovi",
      "Ošetřit drobné poranění a zastavit krvácení přitlačením",
      "Správně chladit popáleninu a vědět, co se dělat nesmí",
      "Zachovat se správně při požáru, povodni a při zvuku sirény",
      "Poznat situaci, kdy je nutné přivolat dospělého nebo záchrannou službu",
    ],
    boundaries: [
      "Neprobírá resuscitaci ani použití defibrilátoru — patří na 2. stupeň",
      "Neprobírá odborné záchranářské postupy (třídění zraněných, škrtidlo, ABCDE)",
      "Neprobírá podávání léků ani injekčních aplikátorů",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Čísla: 112 (platí v celé EU), 150 (hasiči), 155 (záchranka), 158 (policie).",
      steps: [
        "Volání: KDE, CO, KOLIK zraněných, KDO volá — hovor ukončí operátor.",
        "Krvácení: přitlač čistou látku, končetinu zvedni výš.",
        "Popálenina: studená tekoucí voda deset až dvacet minut — ne led, ne mast.",
        "Zlomenina: nehýbej s ní, nech ji v klidu, přivolej dospělého.",
        "Bezvědomí a dýchá: ulož na bok, zůstaň u něj, volej 155.",
        "Požár: nízko u země, po schodech, nikdy výtahem.",
      ],
      commonMistake: "Popálenina se nechladí ledem ani nemaže mastí — jen studenou tekoucí vodou.",
      example: "Kamarádovi teče krev z ruky: přitlač čistou látku, zvedni paži výš než srdce, zavolej dospělého.",
    },
  },
];
