import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Generátor vracel na všech úrovních
// tentýž seznam, všechny úlohy měly stejnou nápovědu a část textů byla bez
// diakritiky. Teď tři oddělené banky:
// L1 pravidla rozhovoru a co je přímá řeč · L2 co říct v konkrétní situaci
// (pozdrav, oslovení, omluva, poděkování) · L3 práce s přímou řečí: kdo mluví,
// která slova řekl, přímá × nepřímá řeč, vhodné uvozovací sloveso.

const L1: PracticeTask[] = [
  choice("Co je dialog?", "rozhovor dvou nebo více lidí", [
    { value: "dopis kamarádovi", why: "Dopis se píše a čte, v dialogu si lidé odpovídají." },
    { value: "řeč jedné osoby bez odpovědi", why: "To je monolog — v dialogu mluví aspoň dva." },
    { value: "text v učebnici přírodovědy", why: "To je věcný text, nikdo v něm spolu nemluví." },
  ], { hints: ["Kolik osob musí mluvit, aby šlo o dialog?", "V dialogu se mluvčí střídají: jeden něco řekne, druhý odpoví."], explanation: "Dialog je rozhovor, ve kterém spolu mluví dva nebo více lidí a navzájem si odpovídají." }),
  choice("Jak zapisujeme přímou řeč?", "do uvozovek a přidáme, kdo mluví", [
    { value: "bez uvozovek, prostě do textu", why: "Bez uvozovek by se slova postavy ztratila ve vyprávění." },
    { value: "do závorek", why: "Závorky jsou pro poznámky, ne pro řeč postav." },
    { value: "velkými písmeny", why: "Velká písmena řeč neoznačují." },
  ], { hints: ["Jakými znaménky se v knížkách označují slova, která postava říká?", "Přesná slova postavy stojí mezi dolními a horními uvozovkami a vedle nich je napsáno, kdo je řekl."], explanation: "Přímá řeč se píše do uvozovek „…“ a přidáme uvozovací větu, kdo mluví." }),
  choice("Které pravidlo patří ke slušnému rozhovoru?", "neskáčeme druhému do řeči", [
    { value: "mluvíme co nejrychleji", why: "Rychlou řeč druhý špatně chápe." },
    { value: "díváme se jinam a mlčíme", why: "Tak druhý neví, jestli ho posloucháme." },
    { value: "opakujeme po druhém každé slovo", why: "To by rozhovor jen zdržovalo." },
  ], { hints: ["Co druhého mrzí, když něco vypráví?", "Když druhého přerušíme uprostřed věty, nedáme mu šanci myšlenku dokončit."], explanation: "Slušný rozhovor znamená nechat druhého domluvit a neskákat mu do řeči." }),
  choice("Jak oslovíš dospělého, kterého neznáš?", "pane, nebo paní", [
    { value: "hej, ty", why: "To je hrubé a dospělému se tak neříká." },
    { value: "křestním jménem", why: "Cizímu dospělému křestním jménem neříkáme." },
    { value: "nijak, rovnou začnu mluvit", why: "Bez oslovení to působí neslušně." },
  ], { hints: ["Tykáš cizímu dospělému, či mu vykáš?", "Cizímu dospělému vykáme a oslovíme ho zdvořile, případně i s příjmením."], explanation: "Cizího dospělého oslovíme „pane“ nebo „paní“ a vykáme mu." }),
  choice("Co řekneš, když vejdeš do místnosti, kde jsou lidé?", "Dobrý den.", [
    { value: "Nic.", why: "Bez pozdravu to působí, že si ostatních nevšímáš." },
    { value: "Čau všichni!", why: "To se hodí jen mezi kamarády." },
    { value: "Musím zase jít.", why: "To je rozloučení, ne pozdrav." },
  ], { hints: ["Co se říká jako první, když někam přijdeš?", "Pozdrav při příchodu je základní zdvořilost — dáváme tím najevo, že si ostatních vážíme."], explanation: "Při příchodu pozdravíme: Dobrý den." }),
  choice("Jak zapíšeme do textu rozhovor dvou lidí?", "každého mluvčího na nový řádek", [
    { value: "vše do jednoho odstavce", why: "Pak by nebylo poznat, kdo co říká." },
    { value: "každého mluvčího jinou barvou", why: "V knížkách se rozhovor barvami neoznačuje." },
    { value: "čísla 1, 2, 3 před každou větou", why: "Čísla se používají v návodech, ne v rozhovoru." },
  ], { hints: ["Jak v knize poznáš, že začal mluvit někdo jiný?", "Když se slova ujme někdo jiný, jeho věta začíná až na začátku dalšího řádku — hned je vidět, kdo je na řadě."], explanation: "Každý mluvčí začíná na novém řádku, aby bylo jasné, kdo mluví." }),
  choice("Co je přímá řeč?", "přesná slova, která někdo řekl", [
    { value: "popis toho, co se stalo", why: "To je vyprávění." },
    { value: "vyprávění bez řeči postav", why: "V přímé řeči postava mluví." },
    { value: "poznámka autora na konci", why: "Poznámka není řeč postavy." },
  ], { hints: ["Co dáváme do uvozovek?", "Přímá řeč zachytí, co postava vyslovila, tak, jak to zaznělo — jako by ji někdo nahrál."], explanation: "Přímá řeč jsou přesná slova, která postava řekla." }),
  choice("Jak dáš najevo, že posloucháš?", "dívám se na mluvčího a reaguji", [
    { value: "dívám se do telefonu", why: "Mluvčí pak neví, jestli ho posloucháš." },
    { value: "skáču mu do řeči", why: "To naslouchání není." },
    { value: "odejdu", why: "Tím rozhovor ukončíš." },
  ], { hints: ["Jak pozná ten, kdo mluví, že tě zajímá, co říká?", "Oční kontakt, přikývnutí nebo krátké „aha“ dávají najevo, že nasloucháme."], explanation: "Posloucháme tak, že se na mluvčího díváme a reagujeme." }),
  choice("Jak zahájíš telefonní hovor?", "pozdravím a řeknu, kdo volá", [
    { value: "hned řeknu, co chci", why: "Druhý ještě neví, kdo volá." },
    { value: "mlčím a čekám", why: "Tak se hovor nerozběhne." },
    { value: "řeknu jen „Haló“", why: "Z toho druhý nepozná, kdo volá." },
  ], { hints: ["Co druhá strana u telefonu nevidí?", "Po telefonu tě druhý nevidí, proto se hned na začátku představíš."], explanation: "Telefonát začneme pozdravem a představením." }),
  choice("Ve větě „Pojď si hrát!“ řekla Anička. — kde jsou uvozovky?", "kolem toho, co Anička vyslovila", [
    { value: "kolem jména Anička", why: "Jméno patří do uvozovací věty." },
    { value: "kolem slova řekla", why: "„Řekla“ je uvozovací věta, ta uvozovky nemá." },
    { value: "nejsou tam potřeba", why: "Přímá řeč uvozovky potřebuje." },
  ], { hints: ["Co v té větě opravdu zaznělo z úst postavy?", "Uvozovky obklopují jen přesná slova postavy; jméno mluvčího stojí mimo ně."], explanation: "Uvozovky jsou kolem přímé řeči — kolem slov, která Anička řekla." }),
  choice("Jak správně ukončíš rozhovor?", "rozloučím se", [
    { value: "odejdu bez slova", why: "To je neslušné." },
    { value: "řeknu „konec“", why: "To se k rozloučení nehodí." },
    { value: "přestanu mluvit uprostřed věty", why: "Druhý by nevěděl, co se děje." },
  ], { hints: ["Co se říká na konci setkání?", "Rozloučení je stejně důležité jako pozdrav — rozhovor tak skončí přátelsky."], explanation: "Rozhovor ukončíme rozloučením: Na shledanou, nebo ahoj u kamarádů." }),
  choice("Chceš se připojit k rozhovoru skupiny. Co řekneš?", "Promiňte, můžu se na něco zeptat?", [
    { value: "Hned začnu mluvit o svém.", why: "Ostatní bys vyrušil nebo vyrušila." },
    { value: "Zavolám na ně nahlas.", why: "To je nezdvořilé." },
    { value: "Počkám, až všichni odejdou.", why: "Pak už se nikoho nezeptáš." },
  ], { hints: ["Jak zdvořile požádáš o slovo?", "Krátká omluva a otázka ukážou, že respektuješ, že ostatní zrovna mluví."], explanation: "Do rozhovoru se zdvořile připojíme omluvou a otázkou." }),
  choice("Komu je v pořádku tykat?", "kamarádům a rodině", [
    { value: "paní učitelce", why: "Paní učitelce vykáme." },
    { value: "cizímu dospělému", why: "Cizím dospělým vykáme." },
    { value: "paní prodavačce", why: "Prodavačce vykáme." },
  ], { hints: ["Komu říkáš ahoj a ty?", "Tykáme lidem, které dobře známe a kteří jsou nám blízcí. Dospělým mimo nejbližší vykáme."], explanation: "Tykáme kamarádům a rodině, ostatním dospělým vykáme." }),
];

const L2: PracticeTask[] = [
  choice("Potkáš na chodbě paní ředitelku. Co řekneš?", "Dobrý den, paní ředitelko.", [
    { value: "Ahoj!", why: "Ahoj říkáme kamarádům, ne paní ředitelce." },
    { value: "Čau, ředitelko.", why: "To je hrubé a hovorové." },
    { value: "Nic, projdu kolem.", why: "Dospělé ve škole zdravíme." },
  ], { hints: ["Tykáš jí, nebo vykáš?", "Dospělým ve škole vykáme; pozdravíme je jako každého dospělého a oslovíme je i s funkcí."], explanation: "Paní ředitelku pozdravíme: Dobrý den, paní ředitelko." }),
  choice("Kamarád ti vypráví, co zažil o víkendu. Co uděláš?", "poslouchám a potom se zeptám", [
    { value: "skočím mu do řeči se svým zážitkem", why: "Tím mu nedáš domluvit." },
    { value: "dívám se do mobilu", why: "Tím dáváš najevo, že tě to nezajímá." },
    { value: "odejdu", why: "To je nezdvořilé." },
  ], { hints: ["Jak se cítí ten, komu nikdo nenaslouchá?", "Nejdřív nechej kamaráda domluvit, pak můžeš reagovat nebo se ptát."], explanation: "Nasloucháme a teprve pak se ptáme." }),
  choice("Voláš babičce. Jak začneš hovor?", "Ahoj, babičko, tady Honza.", [
    { value: "Kdo je tam?", why: "Nejdřív se představí ten, kdo volá." },
    { value: "Haló, co chceš?", why: "Voláš ty, a navíc je to nezdvořilé." },
    { value: "Dobrý den, paní.", why: "Babičce tykáme a oslovujeme ji jako babičku." },
  ], { hints: ["Tykáš babičce? A co musí babička u telefonu hned vědět?", "V rodině tykáme; i tak ale na začátku pozdravíme a řekneme, kdo volá."], explanation: "Babičku pozdravíme a představíme se: Ahoj, babičko, tady Honza." }),
  choice("Paní učitelka vykládá a ty si vzpomeneš na otázku. Co uděláš?", "přihlásím se a počkám, až mě vyvolá", [
    { value: "hned otázku vykřiknu", why: "Tím skočíš paní učitelce do řeči." },
    { value: "zeptám se nahlas souseda", why: "Vyrušíš celou třídu." },
    { value: "zaťukám na lavici, dokud si mě nevšimne", why: "To ruší a není to zdvořilé." },
  ], { hints: ["Jak se ve třídě žádá o slovo?", "Když mluví někdo jiný, nevykřikujeme — ve třídě se o slovo hlásíme zvednutou rukou."], explanation: "Ve třídě se přihlásíme a počkáme, až nás paní učitelka vyvolá." }),
  choice("Soused ti podrží dveře. Co řekneš?", "Děkuji.", [
    { value: "Nic.", why: "Za laskavost se poděkuje." },
    { value: "Konečně!", why: "To zní nevděčně." },
    { value: "Uhněte.", why: "To je hrubé." },
  ], { hints: ["Co se říká, když ti někdo pomůže?", "Poděkování je nejkratší způsob, jak dát najevo, že si pomoci vážíš."], explanation: "Za pomoc poděkujeme: Děkuji." }),
  choice("Na chodbě omylem do někoho vrazíš. Co řekneš?", "Promiňte.", [
    { value: "Dávej pozor!", why: "Chybu jsi udělal ty, ne on." },
    { value: "Nic, jdu dál.", why: "Když někomu ublížíme, omluvíme se." },
    { value: "To nic.", why: "To říká ten, komu se někdo omlouvá." },
  ], { hints: ["Kdo tu udělal chybu a co by měl říct?", "Když někoho omylem obtěžujeme nebo mu ublížíme, omluvíme se."], explanation: "Za nechtěný náraz se omluvíme: Promiňte." }),
  choice("V pekárně chceš koupit rohlík. Co řekneš?", "Dobrý den, prosím jeden rohlík.", [
    { value: "Dej mi rohlík.", why: "Prodavačce netykáme a rozkaz není zdvořilý." },
    { value: "Hej, rohlík!", why: "Chybí pozdrav i prosba." },
    { value: "Chci rohlík, rychle.", why: "To zní nezdvořile." },
  ], { hints: ["Co řekneš nejdřív a jaké kouzelné slovo přidáš?", "V obchodě nejdřív pozdravíme, prodavačce vykáme a přidáme kouzelné slovo."], explanation: "Pozdravíme a slušně poprosíme: Dobrý den, prosím jeden rohlík." }),
  choice("Kamarádka něco vysvětluje a ty s ní nesouhlasíš. Co uděláš?", "počkám, až domluví, a řeknu svůj názor", [
    { value: "hned ji překřičím svým názorem", why: "Tím jí skočíš do řeči." },
    { value: "otočím se k ní zády a odejdu", why: "Tím rozhovor ukončíš a urazíš ji." },
    { value: "vysměju se jí před ostatními", why: "To je zraňující." },
  ], { hints: ["Smíš nesouhlasit? A kdy to říct?", "Nesouhlasit je v pořádku; slušné je nechat druhého domluvit a pak klidně říct, co si myslíš ty."], explanation: "Počkáme, až kamarádka domluví, a klidně řekneme svůj názor." }),
  choice("Odcházíš z návštěvy u tety. Co řekneš?", "Děkuji za pozvání, na shledanou.", [
    { value: "Tak čau.", why: "Chybí poděkování." },
    { value: "Nic, prostě odejdu.", why: "Z návštěvy se odchází s rozloučením." },
    { value: "Už musím, nudím se.", why: "To by tetu mrzelo." },
  ], { hints: ["Co se říká na konci návštěvy?", "Z návštěvy odcházíme s poděkováním a rozloučením."], explanation: "Poděkujeme za pozvání a rozloučíme se." }),
  choice("Paní v obchodě ti něco řekne a ty jí nerozumíš. Co řekneš?", "Promiňte, můžete to zopakovat?", [
    { value: "Co?", why: "To je příliš strohé." },
    { value: "Nechte mě.", why: "To je nezdvořilé." },
    { value: "Nic, budu dělat, že rozumím.", why: "Pak nebudeš vědět, co chtěla." },
  ], { hints: ["Jak zdvořile požádáš, aby to paní řekla znovu?", "Když nerozumíme, zdvořile se omluvíme a poprosíme, aby to řekla ještě jednou."], explanation: "Zdvořile poprosíme o zopakování." }),
  choice("Ve vlaku si chceš sednout na volné místo vedle paní. Co řekneš?", "Promiňte, je tu volno?", [
    { value: "Nic, sednu si.", why: "Nejdřív se zeptáme." },
    { value: "Uhněte.", why: "To je hrubé." },
    { value: "Tady sedím já.", why: "Místo si nenárokujeme." },
  ], { hints: ["Co uděláš dřív, než si sedneš vedle cizího člověka?", "Zdvořile se zeptáme, jestli si tam můžeme sednout."], explanation: "Zeptáme se: Promiňte, je tu volno?" }),
  choice("Voláš do knihovny, kde tě nikdo nezná. Jak začneš?", "Dobrý den, tady Eva Malá. Chtěla bych se zeptat…", [
    { value: "Ahoj, chci se na něco zeptat, jo?", why: "Cizím dospělým netykáme." },
    { value: "Kdo je tam? Kdo to mluví?", why: "Představuje se ten, kdo volá." },
    { value: "Haló, co máte za knížky?", why: "Chybí pozdrav i představení." },
  ], { hints: ["Co musí knihovnice vědět, než ti odpoví?", "U telefonu pozdravíme, řekneme své jméno a teprve pak svou otázku."], explanation: "Pozdravíme, představíme se a pak řekneme, co potřebujeme." }),
  choice("Kamarád se ti omlouvá, že přišel pozdě. Co odpovíš?", "To nevadí, hlavně že jsi tady.", [
    { value: "Nemluvím s tebou.", why: "To je zbytečně zraňující." },
    { value: "Jsi vždycky poslední!", why: "To je výčitka, ne odpověď na omluvu." },
    { value: "Nic neřeknu.", why: "Na omluvu se odpovídá." },
  ], { hints: ["Jak přijmout omluvu?", "Na omluvu odpovíme vlídně — tím dáme najevo, že se nezlobíme."], explanation: "Omluvu přijmeme vlídnou odpovědí." }),
];

const L3: PracticeTask[] = [
  choice("Text: „Mám hlad,“ řekl Pepa. Která slova Pepa opravdu řekl?", "Mám hlad", [
    { value: "řekl Pepa", why: "To je uvozovací věta — tu napsal ten, kdo vypráví." },
    { value: "Pepa", why: "To je jméno toho, kdo mluví." },
    { value: "celou větu", why: "Pepa řekl jen to, co je v uvozovkách." },
  ], { hints: ["Co stojí v té větě mezi uvozovkami?", "Slova postavy jsou v uvozovkách; kdo mluví, přidává vypravěč mimo uvozovky."], explanation: "Pepa řekl „Mám hlad“ — to je přímá řeč v uvozovkách." }),
  choice("Text: Maminka se zeptala: „Kdy přijdeš domů?“ Kdo mluví?", "maminka", [
    { value: "já", why: "V uvozovací větě stojí, kdo mluví — maminka." },
    { value: "vypravěč", why: "Vypravěč jen uvádí, kdo mluví." },
    { value: "nikdo, je to otázka", why: "Otázku někdo položil — maminka." },
  ], { hints: ["Kdo je v uvozovací větě?", "Uvozovací věta (zeptala se…) říká, kdo přímou řeč vyslovil."], explanation: "Mluví maminka — říká to uvozovací věta „maminka se zeptala“." }),
  choice("Text: „Pojď ven!“ zavolal Tomáš na Jirku. Kdo mluví?", "Tomáš", [
    { value: "Jirka", why: "Na Jirku se volá, Jirka nemluví." },
    { value: "vypravěč", why: "Vypravěč jen uvádí, kdo mluví." },
    { value: "oba dva", why: "Slova v uvozovkách řekl jen jeden." },
  ], { hints: ["Kdo zavolal a na koho?", "V uvozovací větě je ten, kdo mluví, hned u slovesa „zavolal“; za předložkou „na“ stojí ten, komu se volá."], explanation: "Mluví Tomáš, volá na Jirku." }),
  choice("Text: „Dobrý den,“ pozdravila Eva paní učitelku. Komu Eva mluví?", "paní učitelce", [
    { value: "Evě", why: "Eva je ta, kdo mluví." },
    { value: "mamince", why: "Maminka ve větě není." },
    { value: "sama sobě", why: "Eva někoho zdraví." },
  ], { hints: ["Koho Eva pozdravila?", "Uvozovací věta říká nejen kdo mluví, ale někdy i komu."], explanation: "Eva mluví k paní učitelce — pozdravila ji." }),
  choice("Text: „Ráno přijdu,“ slíbil děda. Co je v té větě uvozovací věta?", "slíbil děda", [
    { value: "Ráno přijdu", why: "To je přímá řeč — slova dědy." },
    { value: "Ráno", why: "To je část přímé řeči." },
    { value: "přijdu", why: "To je část přímé řeči." },
  ], { hints: ["Která část věty říká, kdo mluvil?", "Uvozovací věta stojí mimo uvozovky a říká, kdo a jak mluvil."], explanation: "Uvozovací věta je „slíbil děda“ — říká, kdo mluvil." }),
  choice("Text: Babička řekla: „Upeču koláč.“ Co je přímá řeč?", "Upeču koláč", [
    { value: "Babička řekla", why: "To je uvozovací věta." },
    { value: "Babička", why: "To je ta, kdo mluví." },
    { value: "řekla", why: "To je sloveso z uvozovací věty." },
  ], { hints: ["Co je v této větě v uvozovkách?", "Přímá řeč jsou slova postavy v uvozovkách, uvozovací věta může stát i před nimi."], explanation: "Přímá řeč je „Upeču koláč“ — slova babičky v uvozovkách." }),
  choice("Text: „Ahoj,“ řekla Jana. „Ahoj,“ odpověděl Petr. „Jdeš ven?“ zeptala se Jana. Kolik lidí v rozhovoru mluví?", "dva", [
    { value: "tři", why: "Jana mluví dvakrát, ale je to pořád jedna osoba." },
    { value: "jeden", why: "Odpovídá i Petr." },
    { value: "čtyři", why: "Tolik jmen v ukázce není." },
  ], { hints: ["Která jména stojí v uvozovacích větách?", "Počítej lidi, ne repliky — jeden člověk může v rozhovoru mluvit víckrát."], explanation: "Mluví dva lidé: Jana (dvakrát) a Petr." }),
  choice("Která věta obsahuje přímou řeč?", "„Dnes prší,“ řekl táta.", [
    { value: "Táta řekl, že dnes prší.", why: "To je nepřímá řeč — nejsou tam tátova přesná slova ani uvozovky." },
    { value: "Venku dnes prší.", why: "Tady nikdo nemluví, je to obyčejná věta." },
    { value: "Táta se díval z okna.", why: "Tady nikdo nemluví." },
  ], { hints: ["Ve které větě jsou uvozovky a přesná slova postavy?", "Přímá řeč cituje postavu doslova, v uvozovkách; nepřímá obsah jen převypráví se spojkou že."], explanation: "Přímou řeč obsahuje věta „Dnes prší,“ řekl táta. — tátova slova jsou v uvozovkách." }),
  choice("Která věta převypráví, co někdo řekl, bez jeho přesných slov?", "Jana řekla, že má hlad.", [
    { value: "„Mám hlad,“ řekla Jana.", why: "To jsou Janina přesná slova — přímá řeč." },
    { value: "Jana má hlad a jí.", why: "Tady nikdo nic neříká." },
    { value: "„Hlad!“ vykřikla Jana.", why: "To je přímá řeč." },
  ], { hints: ["Ve které větě chybí uvozovky, a přesto se dozvíš, co postava pověděla?", "Nepřímá řeč převypráví obsah pomocí spojky že a obejde se bez uvozovek."], explanation: "„Jana řekla, že má hlad.“ je nepřímá řeč — převypráví obsah bez uvozovek." }),
  choice("Proč píšeme každou repliku rozhovoru na nový řádek?", "aby bylo vidět, kdo zrovna mluví", [
    { value: "aby byl text delší", why: "O délku nejde." },
    { value: "protože to vypadá hezky", why: "Hlavní je, aby se čtenář vyznal." },
    { value: "aby se šetřil papír", why: "Nové řádky papír nešetří." },
  ], { hints: ["Co by se stalo, kdyby celý rozhovor byl v jednom řádku?", "Nový řádek čtenáři ukáže, že se slova ujal někdo jiný."], explanation: "Nový řádek pro každou repliku ukazuje, kdo zrovna mluví." }),
  choice("Které sloveso se hodí do věty: „Pomoc!“ ___ Honza.", "vykřikl", [
    { value: "zašeptal", why: "Volání o pomoc se nešeptá." },
    { value: "zeptal se", why: "„Pomoc!“ není otázka." },
    { value: "odpověděl", why: "Nikdo se Honzy neptal." },
  ], { hints: ["Jak zní „Pomoc!“ — potichu, nebo nahlas?", "Uvozovací sloveso má sedět k tomu, jak postava mluví: šeptá, ptá se, křičí…"], explanation: "Volání o pomoc je křik — hodí se „vykřikl“." }),
  choice("Které sloveso se hodí do věty: „Jdeš se mnou?“ ___ Lucka.", "zeptala se", [
    { value: "vykřikla", why: "Otázka se obvykle nekřičí; tady Lucka se ptá." },
    { value: "slíbila", why: "Lucka nic neslibuje, ptá se." },
    { value: "poděkovala", why: "Za nic neděkuje." },
  ], { hints: ["Jakým znaménkem končí Luckina slova?", "Když přímá řeč končí otazníkem, postava se ptá — tomu má odpovídat i uvozovací sloveso."], explanation: "Lucka se ptá, proto „zeptala se“." }),
  choice("Které sloveso se hodí do věty: „Zítra ti to vrátím,“ ___ Karel.", "slíbil", [
    { value: "zeptal se", why: "Karel se na nic neptá." },
    { value: "zakřičel", why: "Nic nenaznačuje křik." },
    { value: "poděkoval", why: "Karel nic neděkuje, dává slib." },
  ], { hints: ["Co Karel dělá, když říká, že zítra něco vrátí?", "Uvozovací sloveso vystihuje, co postava svými slovy dělá — ptá se, slibuje, děkuje…"], explanation: "Karel dává slib — hodí se „slíbil“." }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3);
}

export const DIALOGPRAVIDLA: TopicMetadata[] = [
  {
    id: "g3-cjl-dialog-pravidla",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dialog-pravidla-rozhovoru",
    title: "Dialog - pravidla rozhovoru",
    studentTitle: "Pravidla rozhovoru",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se pravidla slušného rozhovoru a jak zapsat přímou řeč.",
    keywords: ["dialog", "rozhovor", "přímá řeč", "uvozovky", "pravidla", "zdvořilost", "oslovení"],
    goals: ["Znát pravidla slušného rozhovoru.", "Zapsat přímou řeč s uvozovkami.", "Správně oslovit dospělého a pozdravit."],
    boundaries: ["Základní pravidla, bez dramatizace."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "V rozhovoru neskáčeme do řeči, nasloucháme a zdravíme. Přímou řeč dáme do uvozovek a připíšeme, kdo mluví.",
      steps: ["Pozdrav.", "Neskáčeme do řeči.", "Přímou řeč dáme do uvozovek.", "Na závěr se rozloučíme."],
      commonMistake: "Zapomenutí uvozovek u přímé řeči.",
      example: "Učitelka se zeptala: „Jak se jmenuješ?“ Tomáš odpověděl: „Jmenuji se Tomáš.“",
    },
  },
];
