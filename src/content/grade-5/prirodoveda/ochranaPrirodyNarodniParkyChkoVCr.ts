import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a zpětné vazby a tvrdily, že Česko má čtyři národní parky —
// od 1. 1. 2022 jich je pět (přibylo Křivoklátsko). Teď: L1 národní parky
// a pravidla · L2 CHKO, ohrožení přírody, invazní druhy · L3 rozhodování
// v situacích, kdy jde o ochranu přírody.

const L1: PracticeTask[] = [
  choice("Kolik národních parků má Česko?", "pět", [
    { value: "čtyři", why: "Čtyři byly do roku 2021; od roku 2022 přibyl národní park Křivoklátsko." },
    { value: "tři", why: "Parků je víc: Krkonoše, Šumava, Podyjí, České Švýcarsko a Křivoklátsko." },
    { value: "deset", why: "Tolik jich není; chráněných krajinných oblastí je ale víc než dvacet." },
  ], {
    hints: ["Vzpomeň si na Krkonoše, Šumavu, Podyjí a České Švýcarsko. Je to všechno?", "K těmto čtyřem parkům přibyl v roce 2022 ještě jeden — Křivoklátsko u Berounky. Spočítej je všechny dohromady."],
    explanation: "Česko má pět národních parků: Krkonoše, Šumavu, Podyjí, České Švýcarsko a od roku 2022 Křivoklátsko.",
  }),
  choice("Který národní park v Česku je nejstarší?", "Krkonošský národní park", [
    { value: "Národní park Šumava", why: "Šumava se stala národním parkem až v roce 1991." },
    { value: "Národní park Podyjí", why: "Podyjí vzniklo v roce 1991." },
    { value: "Národní park České Švýcarsko", why: "České Švýcarsko vzniklo v roce 2000." },
  ], {
    hints: ["Vznikl už v roce 1963 v našich nejvyšších horách.", "V tomto parku leží Sněžka, nejvyšší hora Česka, a pramení v něm Labe."],
    explanation: "Nejstarší je Krkonošský národní park, vyhlášený v roce 1963.",
  }),
  choice("Ve kterém národním parku stojí Pravčická brána?", "České Švýcarsko", [
    { value: "Krkonoše", why: "Krkonoše jsou hory se Sněžkou, pískovcové skály tam nejsou." },
    { value: "Šumava", why: "Šumava je známá lesy a rašeliništi." },
    { value: "Podyjí", why: "Podyjí leží u řeky Dyje na jižní Moravě." },
  ], {
    hints: ["Pravčická brána je největší přírodní skalní most v Evropě. V jakých skalách stojí?", "Park leží na severu Čech u hranic se Saskem a tvoří ho pískovcové skály, soutěsky a kaňon Labe; jméno má podle podobnosti s alpskou krajinou."],
    explanation: "Pravčická brána stojí v Národním parku České Švýcarsko.",
  }),
  choice("Který národní park leží u řeky Dyje na hranici s Rakouskem?", "Podyjí", [
    { value: "Šumava", why: "Šumava leží u hranic s Bavorskem a Rakouskem, ale Dyje jí neteče." },
    { value: "Krkonoše", why: "Krkonoše leží na severu u hranic s Polskem." },
    { value: "České Švýcarsko", why: "České Švýcarsko leží na severu u hranic se Saskem." },
  ], {
    hints: ["Název parku je odvozený od jména řeky.", "Řeka se tu zařízla do hlubokého údolí; na rakouské straně navazuje park Thayatal."],
    explanation: "Národní park Podyjí leží v údolí Dyje u Znojma; je to nejmenší z našich národních parků.",
  }),
  choice("Ve kterém národním parku je nejvyšší hora Česka Sněžka?", "Krkonošský národní park", [
    { value: "Národní park Šumava", why: "Nejvyšší horou Šumavy je Plechý." },
    { value: "Národní park Podyjí", why: "Podyjí je údolí řeky, velké hory tam nejsou." },
    { value: "Národní park Křivoklátsko", why: "Křivoklátsko je pahorkatina s lesy." },
  ], {
    hints: ["Sněžka měří 1 603 metrů. Ve kterém pohoří leží?", "Je to nejvyšší pohoří Česka na hranici s Polskem; park tu vznikl už v roce 1963."],
    explanation: "Sněžka leží v Krkonoších, a tedy v Krkonošském národním parku.",
  }),
  choice("Který národní park je rozlohou největší?", "Šumava", [
    { value: "Podyjí", why: "Podyjí je naopak nejmenší." },
    { value: "Krkonoše", why: "Krkonoše jsou velké, ale Šumava je větší." },
    { value: "České Švýcarsko", why: "České Švýcarsko je jeden z menších parků." },
  ], {
    hints: ["Tento park leží na jihozápadě Čech u hranic s Bavorskem a Rakouskem.", "Pokrývá rozsáhlé lesy a rašeliniště kolem pramene Vltavy a patří k největším lesním územím ve střední Evropě."],
    explanation: "Největším národním parkem je Šumava.",
  }),
  choice("Co znamená zkratka CHKO?", "chráněná krajinná oblast", [
    { value: "chráněná kulturní organizace", why: "CHKO chrání přírodu a krajinu, ne kulturní organizace." },
    { value: "česká hospodářská komora", why: "Hospodářská komora s ochranou přírody nesouvisí." },
    { value: "chovatelská hospodářská kontrola", why: "Taková zkratka v ochraně přírody není." },
  ], {
    hints: ["Zkratka patří k ochraně přírody. Co může znamenat písmeno K a O?", "Jde o velké území, kde se chrání krajina i s vesnicemi a poli — třeba Český ráj."],
    explanation: "CHKO je chráněná krajinná oblast — velké území s cennou krajinou, kde lidé žijí a hospodaří.",
  }),
  choice("Co se v národním parku nesmí?", "trhat chráněné rostliny", [
    { value: "chodit po značených cestách", why: "Po značených cestách se chodit smí — je to žádoucí." },
    { value: "fotografovat přírodu", why: "Fotografovat se smí." },
    { value: "pozorovat ptáky dalekohledem", why: "Pozorovat ptáky se smí, jen se nesmí rušit." },
  ], {
    hints: ["Co by přírodě v parku uškodilo?", "Návštěvník si má z parku odnést jen zážitky a fotky; vzácné květiny musí zůstat růst tam, kde jsou."],
    explanation: "V národním parku se nesmí trhat chráněné rostliny ani rušit zvířata.",
  }),
  choice("Proč vznikají národní parky?", "aby chránily vzácnou přírodu", [
    { value: "aby se v nich těžilo dřevo", why: "Těžba je v parcích omezená." },
    { value: "aby se v nich stavěly hotely", why: "Stavby jsou v parcích omezené." },
    { value: "aby se v nich lovila zvěř", why: "Lov je v parcích omezený." },
  ], {
    hints: ["Co je v národním parku tak cenného?", "Žijí tam vzácné rostliny a živočichové, kteří by jinde neměli kde přežít."],
    explanation: "Národní parky chrání nejcennější a nejvzácnější přírodu země.",
  }),
  choice("Které zvíře je v Česku přísně chráněné?", "rys ostrovid", [
    { value: "potkan", why: "Potkan chráněný není." },
    { value: "holub domácí", why: "Holub domácí chráněný není." },
    { value: "kapr obecný", why: "Kapr se u nás chová v rybnících." },
  ], {
    hints: ["Hledej vzácnou šelmu našich lesů.", "Tato kočkovitá šelma má na uších štětičky a žije hlavně na Šumavě a v Beskydech."],
    explanation: "Rys ostrovid je u nás vzácný a přísně chráněný.",
  }),
  choice("Která rostlina je v Česku chráněná?", "hořec", [
    { value: "pampeliška", why: "Pampeliška roste všude a chráněná není." },
    { value: "sedmikráska", why: "Sedmikráska je běžná." },
    { value: "kopřiva", why: "Kopřiva je běžná." },
  ], {
    hints: ["Hledej vzácnou horskou květinu.", "Tato rostlina má sytě modré zvonkovité květy a roste na horských loukách, například v Krkonoších."],
    explanation: "Hořce jsou u nás vzácné a chráněné.",
  }),
  choice("Co je Červený seznam?", "seznam ohrožených druhů", [
    { value: "seznam jedovatých hub", why: "Jedovaté houby mají vlastní atlasy." },
    { value: "seznam dopravních značek", why: "S dopravou to nesouvisí." },
    { value: "seznam státních svátků", why: "Se svátky to nesouvisí." },
  ], {
    hints: ["Proč by seznam organismů mohl mít barvu jako výstražné světlo?", "Do seznamu se zapisují rostliny a živočichové, kterým hrozí, že vyhynou; podle něj se rozhoduje, co chránit."],
    explanation: "Červený seznam uvádí rostliny a živočichy, kterým hrozí vyhynutí.",
  }),
  choice("Jak se chováš v přírodě?", "odpadky si odnesu domů", [
    { value: "rozdělám oheň, kde se mi líbí", why: "Oheň se smí rozdělat jen na vyhrazeném místě." },
    { value: "utrhnu si kytici chráněných květin", why: "Chráněné květiny se trhat nesmí." },
    { value: "hlasitě pouštím hudbu", why: "Hluk plaší zvířata." },
  ], {
    hints: ["Co by po tobě v lese nemělo zůstat?", "Plasty a plechovky se v přírodě rozkládají stovky let a zvířata se jimi můžou zranit."],
    explanation: "Kdo si odpadky odnese, chrání přírodu i zvířata.",
  }),
];

const L2: PracticeTask[] = [
  choice("Jaký je rozdíl mezi národním parkem a CHKO?", "v národním parku je ochrana přísnější", [
    { value: "CHKO je chráněná vždy přísněji", why: "Je to naopak — přísnější je národní park." },
    { value: "v národním parku se smí stavět továrny", why: "V národních parcích se továrny stavět nesmí." },
    { value: "CHKO jsou jen v zahraničí", why: "V Česku je CHKO víc než dvacet." },
  ], {
    hints: ["Kde se chrání hlavně divoká příroda a kde krajina i s vesnicemi?", "V CHKO lidé běžně bydlí a hospodaří; v parku jsou pravidla mnohem tvrdší a některá místa jsou úplně bez zásahu."],
    explanation: "Národní park chrání nejcennější přírodu a pravidla jsou v něm přísnější než v CHKO.",
  }),
  choice("Která z těchto oblastí je chráněná krajinná oblast, a ne národní park?", "Český ráj", [
    { value: "Krkonoše", why: "Krkonoše jsou národní park." },
    { value: "Podyjí", why: "Podyjí je národní park." },
    { value: "České Švýcarsko", why: "České Švýcarsko je národní park." },
  ], {
    hints: ["Která oblast s pískovcovými skalními městy nepatří mezi národní parky?", "V této oblasti stojí hrad Trosky a Prachovské skály; lidé tu žijí a hospodaří jako v každé CHKO."],
    explanation: "Český ráj je chráněná krajinná oblast, ne národní park.",
  }),
  choice("Ve které CHKO jsou Macocha a Punkevní jeskyně?", "Moravský kras", [
    { value: "Český ráj", why: "Český ráj je známý pískovcovými skalami." },
    { value: "Pálava", why: "Pálava je známá vápencovými kopci a vinicemi." },
    { value: "Beskydy", why: "Beskydy jsou hory na východě Moravy." },
  ], {
    hints: ["Macocha je hluboká propast. V jaké krajině vznikají propasti a jeskyně?", "Takové jeskyně vymývá voda ve vápenci; tato CHKO leží severně od Brna."],
    explanation: "Propast Macocha a Punkevní jeskyně jsou v CHKO Moravský kras.",
  }),
  choice("Ve které CHKO najdeš rybníky Rožmberk a Svět?", "Třeboňsko", [
    { value: "Beskydy", why: "Beskydy jsou hory, ne rybniční krajina." },
    { value: "Pálava", why: "Pálava je známá vinicemi." },
    { value: "Jizerské hory", why: "Jizerské hory jsou hory na severu Čech." },
  ], {
    hints: ["Rybníky tu kdysi nechali vybudovat Rožmberkové. Kde to je?", "Oblast leží na jihu Čech kolem historického města se zámkem a lázněmi; rybníky tu budoval Jakub Krčín."],
    explanation: "Rybníky Rožmberk a Svět jsou v CHKO Třeboňsko.",
  }),
  choice("Která CHKO na jižní Moravě je známá vápencovými kopci a vinicemi?", "Pálava", [
    { value: "Třeboňsko", why: "Třeboňsko je známé rybníky." },
    { value: "Jizerské hory", why: "Jizerské hory leží na severu Čech." },
    { value: "Beskydy", why: "Beskydy leží na východě Moravy." },
  ], {
    hints: ["Hledej oblast kousek od Mikulova.", "Nad vinicemi se tu zvedají bílé vápencové skály se zříceninou hradu Děvičky."],
    explanation: "Pálava je CHKO s vápencovými kopci a vinicemi u Mikulova.",
  }),
  choice("Proč ubývá žab a čolků?", "mizí tůně a mokřady", [
    { value: "je jich příliš mnoho", why: "Naopak jich ubývá." },
    { value: "mají moc potravy", why: "Dostatek potravy by jim pomáhal." },
    { value: "jsou chránění zákonem", why: "Ochrana jim pomáhá, neškodí." },
  ], {
    hints: ["Kde se žáby a čolci rozmnožují?", "Obojživelníci kladou vajíčka do vody; když se malé vodní plochy vysuší nebo zasypou, nemají se kde rozmnožit."],
    explanation: "Obojživelníkům ubývají místa k rozmnožování — tůně a mokřady.",
  }),
  choice("Co přírodu ohrožuje nejvíc?", "ničení míst, kde organismy žijí", [
    { value: "příliš mnoho chráněných území", why: "Chráněná území přírodě pomáhají." },
    { value: "hnízdění ptáků na stromech", why: "Hnízdění je přirozené." },
    { value: "sázení nových stromů", why: "Sázení stromů přírodě pomáhá." },
  ], {
    hints: ["Co se stane se zvířaty, když zmizí jejich les nebo louka?", "Když se vysuší mokřad nebo vykácí les, rostliny a živočichové přijdou o domov a potravu."],
    explanation: "Nejvíc přírodu ohrožuje ničení prostředí, ve kterém organismy žijí.",
  }),
  choice("Který národní park přibyl v roce 2022?", "Křivoklátsko", [
    { value: "Český ráj", why: "Český ráj je chráněná krajinná oblast." },
    { value: "Beskydy", why: "Beskydy jsou chráněná krajinná oblast." },
    { value: "Jizerské hory", why: "Jizerské hory jsou chráněná krajinná oblast." },
  ], {
    hints: ["Park leží v lesích nad řekou Berounkou.", "V jeho středu stojí stejnojmenný královský hrad, oblíbené loviště českých panovníků."],
    explanation: "Od 1. 1. 2022 je pátým národním parkem Křivoklátsko.",
  }),
  choice("Co je invazní druh?", "nepůvodní druh, který se nekontrolovaně šíří", [
    { value: "druh, který žije jen v zoologické zahradě", why: "Invazní druh se šíří volně v přírodě." },
    { value: "druh, který už dávno vyhynul", why: "Invazní druh naopak přibývá." },
    { value: "domácí zvíře, které žije na statku", why: "Hospodářská zvířata invazní nejsou." },
  ], {
    hints: ["Co se stane, když se k nám dostane rostlina nebo zvíře z jiného světadílu?", "Taková rostlina nebo zvíře tu nemá přirozené nepřátele, rychle se rozrůstá a vytlačuje naše původní rostliny a živočichy."],
    explanation: "Invazní druh je nepůvodní a šíří se tak rychle, že vytlačuje původní přírodu.",
  }),
  choice("Která rostlina se u nás šíří jako invazní?", "bolševník velkolepý", [
    { value: "sněženka podsněžník", why: "Sněženka je naše původní rostlina." },
    { value: "hořec jarní", why: "Hořec je vzácný a chráněný." },
    { value: "leknín bílý", why: "Leknín je naše původní rostlina." },
  ], {
    hints: ["Hledej obří rostlinu, jejíž šťáva na slunci popálí kůži.", "Pochází z Kavkazu, dorůstá přes tři metry a má velké bílé okolíky; na mnoha místech se musí likvidovat."],
    explanation: "Bolševník velkolepý je invazní rostlina z Kavkazu.",
  }),
  choice("Proč se v Krkonoších nesmí chodit mimo značené cesty?", "šlapáním by se zničila křehká horská příroda", [
    { value: "žijí tam divocí medvědi", why: "Medvědi v Krkonoších nežijí." },
    { value: "cesty jsou vyhrazené jen lyžařům", why: "Cesty jsou pro všechny návštěvníky." },
    { value: "mimo cesty je zakázané fotografovat", why: "Fotografovat se smí, jde o šlapání." },
  ], {
    hints: ["Co roste na hřebenech hor a jak snáší sešlápnutí?", "Na hřebenech roste nízká tundrová vegetace, která po sešlapání dorůstá desítky let."],
    explanation: "Horská tundra je křehká; sešlapaná se obnovuje velmi dlouho.",
  }),
  choice("Která šelma se v posledních letech vrátila do české přírody?", "vlk", [
    { value: "lev", why: "Lev žije v Africe." },
    { value: "lední medvěd", why: "Lední medvěd žije v Arktidě." },
    { value: "tygr", why: "Tygr žije v Asii." },
  ], {
    hints: ["Tato šelma žije ve smečkách a byla u nás dlouho vyhubená.", "Dnes žije například v Krušných horách, na Šumavě a v Beskydech; je předkem psa."],
    explanation: "Do české přírody se vrátil vlk; je přísně chráněný.",
  }),
  choice("Kdo dohlíží na dodržování pravidel v národním parku?", "strážci přírody", [
    { value: "hasiči", why: "Hasiči zasahují při požárech." },
    { value: "dopravní policisté", why: "Dopravní policie hlídá silnice." },
    { value: "turisté", why: "Turisté jsou návštěvníci." },
  ], {
    hints: ["Kdo v parku upozorní návštěvníka, že trhá chráněné květiny?", "Tito lidé v uniformách hlídají park, vysvětlují pravidla a mohou udělit pokutu."],
    explanation: "V národních parcích hlídají strážci přírody.",
  }),
];

const L3: PracticeTask[] = [
  choice("Na výletě v národním parku najdeš vzácnou orchidej. Co uděláš?", "nechám ji růst a jen se podívám", [
    { value: "utrhnu ji na památku", why: "Chráněnou rostlinu nesmíš trhat." },
    { value: "vykopu ji na zahradu", why: "Na zahradě by nepřežila a v přírodě by chyběla." },
    { value: "odnesu ji strážci parku", why: "Rostlina musí zůstat na místě." },
  ], {
    hints: ["Co by se stalo, kdyby si každý návštěvník utrhl jednu květinu?", "Vzácné rostliny přežijí jen tam, kde rostou; kytka ve váze nevykvete znovu a nevytvoří semena."],
    explanation: "Vzácnou rostlinu necháme růst — jen tak se udrží.",
  }),
  choice("Proč je důležité propojit chráněná území zelenými pásy?", "živočichové se mohou stěhovat mezi nimi", [
    { value: "aby se mezi nimi dalo jezdit autem", why: "Pásy slouží zvířatům, ne autům." },
    { value: "aby byla území přehlednější na mapě", why: "Nejde o mapu." },
    { value: "aby se v pásech mohlo lovit", why: "Pásy mají zvířatům pomáhat." },
  ], {
    hints: ["Co udělá jelen, když chce najít nové území za dálnicí?", "Zvířata potřebují hledat potravu a partnery; když jsou chráněná místa izolovaná jako ostrovy, populace slábnou."],
    explanation: "Propojení umožní živočichům putovat a populace zůstanou silné.",
  }),
  choice("Proč se v některých částech národního parku les nechává bez zásahu?", "aby se příroda vyvíjela sama", [
    { value: "protože tam nemá kdo pracovat", why: "Jde o záměr, ne o nedostatek lidí." },
    { value: "protože stromy jsou jedovaté", why: "Stromy jedovaté nejsou." },
    { value: "aby tam les rychle zmizel", why: "Les bez zásahu nezmizí, ale obnoví se sám." },
  ], {
    hints: ["Co se stane s lesem, do kterého člověk vůbec nezasahuje?", "V bezzásahových zónách padlé stromy tlejí, rostou nové a vzniká pestrý les jako v pravěku."],
    explanation: "Bezzásahové zóny ukazují, jak se příroda vyvíjí bez člověka.",
  }),
  choice("Někdo vypustí akvarijní želvy do rybníka. Proč to škodí?", "můžou vytlačit původní živočichy", [
    { value: "rybník se tím vyčistí", why: "Želvy rybník nevyčistí." },
    { value: "želvy v zimě stejně zmrznou, nic se nestane", why: "Některé přežijí a škodí." },
    { value: "je to dobře, rybník bude pestřejší", why: "Nepůvodní živočichové pestrost naopak ničí." },
  ], {
    hints: ["Odkud želvy pocházejí a mají tu přirozené nepřátele?", "Nepůvodní živočich se může přemnožit, sníst potravu místních zvířat nebo přenést nemoci."],
    explanation: "Vypuštění nepůvodní živočichové mohou vytlačit naše původní druhy.",
  }),
  choice("Obec chce postavit silnici přes mokřad s čolky. Co je pro přírodu nejlepší?", "vést silnici jinudy nebo postavit podchody pro živočichy", [
    { value: "zasypat mokřad a čolky přestěhovat do akvária", why: "Čolci patří do přírody, mokřad by zmizel." },
    { value: "postavit silnici a čolky nechat, ať si poradí", why: "Na silnici by čolky přejela auta." },
    { value: "vysušit mokřad, aby tam čolci nechodili", why: "Vysušením by čolci přišli o domov." },
  ], {
    hints: ["Co čolci potřebují a co jim silnice vezme?", "Na jaře čolci putují k vodě; pod silnicí jim pomohou tunýlky, nebo je nejlepší mokřad obejít."],
    explanation: "Nejlepší je mokřad obejít, nebo zvířatům postavit podchody.",
  }),
  choice("Co pomůže ptákům, kterým ubývá dutin ve starých stromech?", "vyvěsit ptačí budky", [
    { value: "pokácet staré stromy", why: "Tím by dutin ubylo ještě víc." },
    { value: "krmit je v létě chlebem", why: "Chléb ptákům škodí a hnízdo nenahradí." },
    { value: "prohlížet si jejich hnízda zblízka", why: "Rušení ptákům škodí." },
  ], {
    hints: ["Kde ptáci jako sýkory hnízdí?", "Když chybí staré stromy s dutinami, můžeme ptákům nabídnout náhradní domeček na stromě."],
    explanation: "Budky nahradí ptákům chybějící dutiny.",
  }),
  choice("Proč by se kachny na rybníce neměly krmit pečivem?", "pečivo jim škodí a znečišťuje vodu", [
    { value: "kachny pečivo nejedí", why: "Jedí ho, ale škodí jim." },
    { value: "kachny by pak přestaly létat", why: "Létání neztratí, ale onemocnět mohou." },
    { value: "pečivo je pro kachny příliš drahé", why: "Nejde o cenu." },
  ], {
    hints: ["Jaká je přirozená potrava kachen?", "Kachny se živí rostlinami a drobnými živočichy; rozmočený chléb jim dělá potíže a hnije ve vodě."],
    explanation: "Chléb kachnám škodí a zbytky znečišťují vodu.",
  }),
  choice("Která činnost přírodě pomáhá?", "vysazovat původní stromy a keře", [
    { value: "vysazovat bolševník", why: "Bolševník je invazní a škodí." },
    { value: "vypouštět akvarijní ryby do potoka", why: "Nepůvodní ryby škodí." },
    { value: "nechávat odpadky v lese", why: "Odpadky přírodě škodí." },
  ], {
    hints: ["Která z možností neškodí rostlinám ani živočichům?", "Domácí druhy dávají potravu a úkryt našim zvířatům; nepůvodní rostliny a odpad přírodě škodí."],
    explanation: "Původní stromy a keře dávají potravu a úkryt našim živočichům.",
  }),
  choice("Proč je rys v Česku vzácný?", "potřebuje velké klidné lesy a dřív se lovil", [
    { value: "je u nás pro něj moc teplo", why: "Teplota ho neomezuje." },
    { value: "živí se jen bambusem", why: "Rys je šelma, loví srny." },
    { value: "přirozeně žije jen v zoo", why: "Rys žije volně v lesích." },
  ], {
    hints: ["Kolik lesa asi potřebuje velká kočkovitá šelma k lovu?", "Rys loví hlavně srny na velkém území; lidé ho v minulosti vyhubili a dnes mu vadí husté silnice."],
    explanation: "Rys potřebuje rozsáhlé klidné lesy; lov a silnice ho v minulosti téměř vyhubily.",
  }),
  choice("Proč se v CHKO může hospodařit, ale v nejcennější části národního parku ne?", "CHKO chrání krajinu i s lidmi, národní park hlavně divokou přírodu", [
    { value: "CHKO je menší, a proto v ní na přírodě tolik nezáleží", why: "CHKO bývají velké a příroda v nich je cenná." },
    { value: "v národním parku nikdo nebydlí, takže tam hospodařit nejde", why: "I v parcích jsou obce; omezení jsou kvůli přírodě." },
    { value: "v CHKO žádná vzácná příroda není", why: "V CHKO je mnoho vzácné přírody." },
  ], {
    hints: ["Jaký je hlavní cíl CHKO a jaký národního parku?", "V CHKO se chrání ráz krajiny, kde lidé odedávna hospodaří; v nejcennějších částech parků se příroda nechává bez zásahu."],
    explanation: "CHKO chrání krajinu včetně lidské činnosti, národní park hlavně divokou přírodu.",
  }),
  choice("Proč nesmíš v národním parku pouštět psa volně?", "mohl by plašit a ohrožovat zvěř", [
    { value: "pes by se v lese ztratil", why: "Hlavním důvodem je ochrana zvířat." },
    { value: "psi jsou v parku zakázaní úplně", why: "Na vodítku psi smějí." },
    { value: "pes by poničil turistické značky", why: "Nejde o značky, ale o zvířata." },
  ], {
    hints: ["Co by pes mohl udělat zvířatům v lese?", "Pes na volno může pronásledovat srny a ptáky, kteří hnízdí na zemi, a vyrušovat je."],
    explanation: "Volně pobíhající pes plaší a ohrožuje volně žijící zvířata.",
  }),
  choice("Proč jsou staré stromy s dutinami v lese cenné?", "žijí v nich ptáci, netopýři a hmyz", [
    { value: "jsou nejlepší na palivové dříví", why: "Jejich hodnota je v životě, který hostí." },
    { value: "chrání les před bleskem", why: "Blesk to neovlivní." },
    { value: "rostou nejrychleji", why: "Staré stromy rostou pomalu." },
  ], {
    hints: ["Kdo potřebuje v lese dutinu?", "Datel vytesá dutinu, po něm se nastěhuje sýkora nebo netopýr a v tlejícím dřevě žijí brouci."],
    explanation: "Staré stromy s dutinami jsou domovem mnoha živočichů.",
  }),
  choice("Proč je Podyjí velmi pestré, i když je nejmenším národním parkem?", "střídají se v něm teplé stráně, lesy a vlhká údolí", [
    { value: "je v něm nejvyšší hora Česka", why: "Nejvyšší hora Sněžka je v Krkonoších." },
    { value: "leží celé uprostřed velkoměsta", why: "Podyjí je přírodní údolí u Znojma." },
    { value: "je v něm nejvíc rybníků", why: "Rybníky jsou typické pro Třeboňsko." },
  ], {
    hints: ["Jaká místa se v údolí řeky střídají?", "Na výslunných svazích je horko jako v jižní Evropě, v hlubokém údolí vlhko a chládek — každé místo má jiné rostliny a živočichy."],
    explanation: "V Podyjí se na malém území střídají velmi různá prostředí, proto je tak pestré.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const OCHRANAPRIRODYNARODNIPARKYCHKOVCR: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-ochrana-prirody-narodni-parky-chko-v-cr",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-ochrana-prirody-narodni-parky-chko-v-cr",
    title: "Ochrana přírody, národní parky, CHKO v ČR",
    studentTitle: "Ochrana přírody",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Ekosystémy a životní prostředí",
    briefDescription: "Poznáš národní parky ČR a proč chráníme přírodu.",
    keywords: ["národní park", "CHKO", "biodiverzita", "ochrana přírody", "CITES", "Šumava", "Krkonoše"],
    goals: ["Vyjmenovat národní parky ČR", "Vysvětlit rozdíl mezi NP a CHKO", "Popsat hrozby pro biodiverzitu"],
    boundaries: ["Neprobírá detailní legislativu ochrany přírody", "Neprobírá globální ochranu přírody do hloubky"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "4 NP v ČR: Šumava, Krkonoše, Podyjí, České Švýcarsko. CHKO je méně přísná ochrana.",
      steps: [
        "NP Šumava – největší, jihozápad Čech.",
        "NP Krkonoše – nejvyšší hory ČR.",
        "NP Podyjí – kaňon řeky Dyje.",
        "NP České Švýcarsko – pískovcové skály v severních Čechách.",
        "CHKO: mírnější ochrana, povoleno bydlení.",
      ],
      commonMistake: "CHKO NENÍ národní park – je méně přísně chráněná.",
      example: "NP Šumava: pralesy, rašeliniště, bobři. CHKO Beskydy: Moravské hory s lidskými sídly.",
    },
  },
];
