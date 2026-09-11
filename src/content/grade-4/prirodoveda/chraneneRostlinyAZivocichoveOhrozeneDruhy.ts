/**
 * Přírodověda 4. ročník — Chráněné rostliny a živočichové, ohrožené druhy.
 *
 * Přepsáno 2026-09-11. Předchozí verze neměla nápovědy, vysvětlení ani
 * diagnostiku a byla plná látky mimo 4. ročník (CITES, Bernská úmluva,
 * Natura 2000, fragmentace stanovišť, klonování, ex-situ/in-situ ochrana).
 * V možnostech zůstala angličtina („Bohemian Paradise“, „overhunting“,
 * „habitats“), „Jizera“ jako národní park a distraktory se slovem „prý“,
 * které dítěti prozradily, že jsou špatně.
 *
 * Gradace:
 *  • L1 — národní parky, Červená kniha, typické chráněné druhy, co se nesmí.
 *  • L2 — proč druhy ubývají a jak se k přírodě chovat (mládě srny,
 *         vypouštění zvířat, chození po cestách).
 *  • L3 — souvislosti: co udělá zmizení vlka, proč chránit i prostředí,
 *         silnice a žabí tahy, invazní bolševník, padlé stromy.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "./_shared";

const POOL_L1: PracticeTask[] = [
  choice("Který národní park je v Česku největší?", "Šumava", [
    { value: "Krkonoše", why: "Krkonoše jsou nejstarší národní park, ale ne největší." },
    { value: "Podyjí", why: "Podyjí na jižní Moravě je naopak nejmenší." },
    { value: "České Švýcarsko", why: "České Švýcarsko je nejmladší národní park, menší než Šumava." },
  ], {
    hints: ["Tenhle park leží na jihozápadě Česka u hranic s Německem a Rakouskem.", "Najdeš v něm rozlehlé lesy, rašeliniště a pramen Vltavy. Je největší ze čtyř našich národních parků."],
    explanation: "Největším národním parkem je Šumava. Česko má čtyři národní parky: Šumavu, Krkonoše, Podyjí a České Švýcarsko.",
  }),
  choice("Ve kterém národním parku je Sněžka, nejvyšší hora Česka?", "V Krkonoších", [
    { value: "Na Šumavě", why: "Šumava je největší park, ale Sněžka je v jiných horách." },
    { value: "V Podyjí", why: "Podyjí je údolí řeky Dyje na jižní Moravě, vysoké hory tam nejsou." },
    { value: "V Českém Švýcarsku", why: "České Švýcarsko je známé pískovcovými skalami, Sněžka tam není." },
  ], {
    hints: ["Sněžka leží na severu Česka u hranic s Polskem.", "Tyhle hory jsou nejvyšší v Česku a jmenují se podle toho, že jsou dlouho pod sněhem. Mají i nejstarší národní park."],
    explanation: "Sněžka (1 603 m) je v Krkonoších, nejvyšších českých horách. Krkonošský národní park je nejstarší v Česku.",
  }),
  choice("Který národní park je známý pískovcovými skalami a Pravčickou bránou?", "České Švýcarsko", [
    { value: "Krkonoše", why: "Krkonoše jsou hory s loukami a Sněžkou, pískovcové skály tam nejsou." },
    { value: "Šumava", why: "Šumava je známá lesy a rašeliništi." },
    { value: "Podyjí", why: "Podyjí je hluboké údolí řeky Dyje." },
  ], {
    hints: ["Pravčická brána je obrovský skalní oblouk na severu Čech.", "Park leží u Labe na hranici s Německem a jmenuje se podle země známé horami. Nejmladší ze čtyř parků."],
    explanation: "Pravčická brána, největší přírodní skalní brána v Evropě, je v Národním parku České Švýcarsko. Je to krajina pískovcových skal a roklí.",
  }),
  choice("Jak se jmenuje seznam ohrožených druhů rostlin a živočichů?", "Červená kniha", [
    { value: "Zelená kniha", why: "Zelená kniha seznam ohrožených druhů není. Barva seznamu varuje: je červená." },
    { value: "Kronika obce", why: "Kronika zapisuje události v obci, ne ohrožené druhy." },
    { value: "Atlas světa", why: "Atlas je kniha map, ne seznam ohrožených druhů." },
  ], {
    hints: ["Ten seznam má barvu, která znamená pozor, nebezpečí.", "Jako červené světlo na semaforu varuje: tyto druhy mohou zmizet. Jak se ten seznam jmenuje?"],
    explanation: "Červená kniha je seznam ohrožených druhů. Červená barva varuje, že tyto rostliny a živočichové mohou vyhynout.",
  }),
  choice("Co znamená zkratka CHKO?", "Chráněná krajinná oblast", [
    { value: "Chovná hospodářská oblast", why: "Chov zvířat se zkratkou nesouvisí. Jde o ochranu krajiny." },
    { value: "Čistá horská krajina", why: "CHKO nemusí být v horách. Znamená chráněnou oblast." },
    { value: "Chráněná kulturní obec", why: "CHKO chrání krajinu a přírodu, ne jednu obec." },
  ], {
    hints: ["První písmeno znamená, že je území pod ochranou.", "Ch jako chráněná, K jako krajinná, O jako oblast. Poskládej ta tři slova za sebou do jednoho názvu."],
    explanation: "CHKO je chráněná krajinná oblast — krajina, kde lidé žijí a hospodaří, ale přírodu musí šetřit. Třeba Beskydy nebo Český ráj.",
  }),
  choice("Proč jsou některé rostliny a živočichové chránění zákonem?", "Hrozí jim, že vyhynou", [
    { value: "Jsou nebezpeční pro lidi", why: "Chráněné druhy nechráníme kvůli nebezpečí, ale proto, že jich ubývá." },
    { value: "Jsou nejkrásnější", why: "Krása není důvod. Rozhoduje, jestli druhu hrozí vyhynutí." },
    { value: "Jsou nejvíc užiteční", why: "Chráníme i druhy, které lidem nic nedávají. Důležité je, že jich ubývá." },
  ], {
    hints: ["Co by se stalo, kdyby je lidé dál trhali a lovili?", "Těchto druhů zůstalo v přírodě málo. Zákon je chrání, aby úplně nezmizely."],
    explanation: "Zákon chrání druhy, kterých v přírodě ubylo a hrozí jim vyhynutí. Nesmí se trhat, lovit ani rušit.",
  }),
  choice("Která jarní květina je u nás chráněná a nesmí se trhat?", "Koniklec", [
    { value: "Pampeliška", why: "Pampelišek je všude hodně, chráněné nejsou." },
    { value: "Sedmikráska", why: "Sedmikráska roste na každém trávníku, chráněná není." },
    { value: "Kopřiva", why: "Kopřiva je velmi hojná, nikdo ji nechrání." },
  ], {
    hints: ["Hledej vzácnou květinu, ne takovou, co roste na každém trávníku.", "Má fialové zvonky porostlé jemnými chloupky a kvete brzy na jaře na suchých stráních."],
    explanation: "Koniklec je vzácná chráněná květina se zvonkovitými fialovými květy pokrytými chloupky. Kvete brzy na jaře na výslunných stráních a nesmí se trhat.",
  }),
  choice("Která velká šelma se sama vrátila do českých lesů a je chráněná?", "Vlk", [
    { value: "Lev", why: "Lvi žijí v Africe, v Česku ve volné přírodě nežijí." },
    { value: "Lední medvěd", why: "Lední medvěd žije v Arktidě, u nás ne." },
    { value: "Tygr", why: "Tygři žijí v Asii." },
  ], {
    hints: ["Hledej šelmu, která u nás žila odedávna, pak zmizela a teď se vrací.", "Žije ve smečkách, v noci vyje a přišel k nám sám z Německa a Polska. Je to divoký příbuzný psa."],
    explanation: "Vlk u nás byl vyhuben, ale v posledních letech se sám vrátil ze sousedních zemí. Je chráněný a žije v několika oblastech Česka.",
  }),
  choice("Kterou kočkovitou šelmu s ušními štětičkami chrání Šumava a Beskydy?", "Rys", [
    { value: "Liška", why: "Liška je psovitá šelma a je hojná." },
    { value: "Jezevec", why: "Jezevec nemá ušní štětičky a je poměrně hojný." },
    { value: "Kuna", why: "Kuna je lasicovitá šelma bez ušních štětiček." },
  ], {
    hints: ["Hledej velkou lesní kočku.", "Na koncích uší má černé štětičky, krátký ocas a loví hlavně srnce. Je vzácná a přísně chráněná."],
    explanation: "Rys ostrovid je naše největší kočkovitá šelma. Poznáš ho podle štětiček na uších a krátkého ocasu. Žije hlavně na Šumavě a v Beskydech.",
  }),
  choice("Co je pytláctví?", "Nezákonný lov zvířat", [
    { value: "Lov s povolením myslivce", why: "Lov s povolením je zákonný. Pytlák loví bez povolení." },
    { value: "Péče o zraněná zvířata", why: "Péče o zraněná zvířata je práce záchranných stanic, ne pytláctví." },
    { value: "Krmení zvěře v zimě", why: "Krmení zvěře je péče, ne pytláctví." },
  ], {
    hints: ["Pytlák porušuje zákon.", "Pytlák loví zvířata, i když nesmí — bez povolení nebo chráněné druhy. Jak se tomu říká?"],
    explanation: "Pytláctví je lov zvířat bez povolení nebo lov chráněných druhů. Je zakázané a trestá se.",
  }),
  choice("Který chráněný savec žije u řek a loví ryby?", "Vydra říční", [
    { value: "Bobr", why: "Bobr žije u vody taky, ale ryby nejí — živí se kůrou a rostlinami." },
    { value: "Kapr", why: "Kapr je ryba, ne savec." },
    { value: "Liška", why: "Liška loví hlavně myši a žije v lese a na polích." },
  ], {
    hints: ["Hledej savce, který skvěle plave a potápí se.", "Má hustou hnědou srst, dlouhý ocas a plovací blány. Pod vodou loví ryby a raky. Bobr to není — ten je býložravec."],
    explanation: "Vydra říční je chráněný savec, který žije u řek a rybníků a loví ryby. Dlouho ji ohrožovalo znečištění vody a lov.",
  }),
  choice("Který vzácný pták s černým peřím a červeným zobákem hnízdí v tichých lesích?", "Čáp černý", [
    { value: "Čáp bílý", why: "Čáp bílý má bílé peří a hnízdí na komínech u lidí." },
    { value: "Kos", why: "Kos je černý, ale je malý a hojný, žije i ve městech." },
    { value: "Havran", why: "Havran je černý, ale má šedavý zobák a žije v hejnech na polích." },
  ], {
    hints: ["Je příbuzný ptáka, který hnízdí na komínech, ale lidem se vyhýbá.", "Má dlouhé červené nohy a zobák a černé peří. Hnízdí v klidných lesích s potoky."],
    explanation: "Čáp černý je vzácný plachý pták. Na rozdíl od čápa bílého se vyhýbá lidem a hnízdí v tichých lesích u potoků.",
  }),
  choice("Co v chráněném území nesmíš dělat?", "Trhat rostliny a odhazovat odpadky", [
    { value: "Chodit po značené cestě", why: "Chodit po značených cestách se naopak má." },
    { value: "Pozorovat zvířata dalekohledem", why: "Pozorovat zvířata z dálky je v pořádku, neruší je to." },
    { value: "Fotografovat květiny", why: "Fotografování přírodě neškodí. Trhání ano." },
  ], {
    hints: ["Tři věci z nabídky přírodě neublíží. Která ano?", "Odnést si domů květinu nebo nechat na zemi obal od svačiny — co z toho přírodě škodí?"],
    explanation: "V chráněném území se nesmí trhat rostliny, odhazovat odpadky, rušit zvířata ani chodit mimo cesty. Pozorovat a fotografovat se může.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Jak se liší národní park od chráněné krajinné oblasti?", "V národním parku je příroda chráněná přísněji", [
    { value: "V CHKO je ochrana přísnější", why: "Je to naopak. Nejpřísněji je příroda chráněná v národních parcích." },
    { value: "Jsou úplně stejné", why: "Liší se tím, jak přísně se přírodu chrání a co tam lidé smějí." },
    { value: "V národním parku se může stavět", why: "V národním parku se stavět skoro nesmí. Příroda má přednost." },
  ], {
    hints: ["Který z těch dvou druhů území je vzácnější?", "V CHKO lidé žijí, hospodaří a pěstují. Ve druhém typu území jsou místa, kam se skoro nesmí ani na procházku. Kde je tedy ochrana přísnější?"],
    explanation: "Národní park chrání nejcennější přírodu nejpřísněji — některá místa se nechávají úplně bez zásahu. V CHKO lidé žijí a hospodaří, jen musí přírodu šetřit.",
  }),
  choice("Proč ubývá mnoho druhů zvířat a rostlin?", "Lidé ničí místa, kde žijí", [
    { value: "Zvířata se stěhují do měst", why: "Do měst se přizpůsobí jen málo druhů. Většině mizí jejich domov." },
    { value: "Příroda je vyhubí sama", why: "Hlavní příčinou dnešního ubývání je činnost lidí." },
    { value: "Kvůli dlouhým zimám", why: "Zimu druhy u nás přečkávají odedávna. Ubývají kvůli lidem." },
  ], {
    hints: ["Co se stane s loukou, když se na ní postaví parkoviště?", "Když lidé vysuší mokřad, vykácí les nebo zastaví louku, co zbude zvířatům a rostlinám, které tam žily?"],
    explanation: "Nejvíc druhů ubývá, protože lidé ničí místa, kde žijí: vysušují mokřady, zastavují louky, kácí lesy a používají postřiky.",
  }),
  choice("Proč je náš rak říční ohrožený?", "Nemoc od cizích raků a znečištěná voda", [
    { value: "Loví ho čápi", why: "Čápi raky občas uloví, ale kvůli tomu ohrožený není." },
    { value: "V řekách je moc čistá voda", why: "Naopak — rak potřebuje čistou vodu a ta ubývá." },
    { value: "V zimě nemá co jíst", why: "Rak zimu přečkává v úkrytu. Ohrožuje ho nemoc a znečištění." },
  ], {
    hints: ["Do našich řek se dostali raci z Ameriky. Co s sebou přinesli?", "Cizí raci přenášejí nemoc, která je jim neublíží, ale naše raky zabije. A co ještě rakovi vadí v řece?"],
    explanation: "Náš rak říční potřebuje čistou vodu. Ohrožuje ho znečištění a nemoc — račí mor — kterou přenášejí raci přivezení z Ameriky.",
  }),
  choice("Proč se nesmí trhat koniklece a bledule, i když jich někde roste hodně?", "Utržená květina nevytvoří semena", [
    { value: "Jsou jedovaté na dotek", why: "Nejde o jed. Utržením se květina nerozmnoží." },
    { value: "Doma rychle uvadnou", why: "Uvadnutí není hlavní důvod. Škoda je, že nevytvoří semena." },
    { value: "Rostou jen v zoo", why: "Rostou v přírodě. Právě proto se nesmějí trhat." },
  ], {
    hints: ["Co vznikne z květu, když ho necháš na louce?", "Z odkvetlého květu vzniknou semena a z nich příští rok nové rostliny. Co se stane, když každý utrhne jen jednu?"],
    explanation: "Z květu vznikají semena, ze kterých rostou nové rostliny. Když se květiny trhají, nevytvoří semena a vzácných rostlin rok od roku ubývá.",
  }),
  choice("Proč se do přírody nesmí vypouštět zvířata z domova, třeba želvy nebo rybičky?", "Mohou vytlačit naše původní druhy", [
    { value: "V přírodě by byla šťastnější", why: "Nejde o jejich štěstí. Mohou škodit našim druhům a přenášet nemoci." },
    { value: "Zákon to zakazuje jen v zimě", why: "Vypouštět se nesmí nikdy." },
    { value: "Nic se nestane", why: "Cizí zvířata mohou požírat nebo vytlačit naše druhy." },
  ], {
    hints: ["Co udělá cizí zvíře, které u nás nemá žádného nepřítele?", "Vypuštěná želva nebo ryba může sežrat potravu našich zvířat nebo přenést nemoc. Komu tím uškodí?"],
    explanation: "Zvířata z chovů mohou v přírodě vytlačit naše původní druhy, sežrat jim potravu nebo přenést nemoci. Proto se nevypouštějí — patří do útulku nebo k chovateli.",
  }),
  choice("Co dělá záchranná stanice pro zvířata?", "Léčí zraněná zvířata a vrací je do přírody", [
    { value: "Prodává zvířata lidem", why: "Záchranné stanice zvířata neprodávají, léčí je." },
    { value: "Chová zvířata pro zoo", why: "Cílem je vrátit zvíře do přírody, ne do zoo." },
    { value: "Loví přemnožená zvířata", why: "Záchranná stanice neloví, zachraňuje." },
  ], {
    hints: ["Kam odvezeš sraženého ježka nebo ptáka se zlomeným křídlem?", "V takové stanici zvíře ošetří, vyléčí a pak ho znovu pustí tam, kde žilo."],
    explanation: "Záchranná stanice pečuje o zraněná a osiřelá divoká zvířata. Vyléčí je a pak je vrátí zpět do přírody.",
  }),
  choice("V trávě leží mládě srny. Co uděláš?", "Nesaháš na něj a odejdeš", [
    { value: "Odneseš ho domů", why: "Matka se k mláděti vrací. Doma by mládě nepřežilo." },
    { value: "Pohladíš ho a nakrmíš", why: "Po pohlazení na něm zůstane lidský pach a matka ho může opustit." },
    { value: "Zakryješ ho listím", why: "Mládě je schované správně samo. Nejlepší je nechat ho být." },
  ], {
    hints: ["Kde asi je jeho matka?", "Srna nechává mládě schované v trávě a sama se pase opodál. Co by se stalo, kdyby na mláděti ucítila lidský pach?"],
    explanation: "Srnčata leží schovaná v trávě a matka se k nim vrací. Když na mládě sáhneš, ucítí lidský pach a může ho opustit. Proto se na něj nesahá a odejde se.",
  }),
  choice("Proč se v chráněném území chodí jen po cestách?", "Aby se nešlapalo po vzácných rostlinách", [
    { value: "Aby se neušpinily boty", why: "Boty nejsou důvod. Mimo cesty rostou citlivé rostliny." },
    { value: "Aby se nikdo neztratil", why: "To je výhoda navíc, ale hlavně jde o přírodu." },
    { value: "Aby turisté šli rychleji", why: "Rychlost není důvod. Mimo cestu by se šlapalo po rostlinách a rušila zvířata." },
  ], {
    hints: ["Co roste kolem cesty a kdo se tam schovává?", "Kdyby každý turista šel kudy chce, sešlapal by vzácné rostliny a vyrušil hnízdící ptáky. Proto jsou cesty vyznačené."],
    explanation: "Mimo cesty rostou vzácné rostliny a hnízdí zvířata. Když chodíme jen po cestách, nesešlapeme je a zvířata nerušíme.",
  }),
  choice("Proč je vlk v přírodě užitečný?", "Loví hlavně slabé a nemocné kusy zvěře", [
    { value: "Chrání ovce před liškami", why: "Ovce naopak někdy napadá. Užitečný je jinak." },
    { value: "Nemá žádný užitek", why: "Má. Udržuje zvěř zdravou a její počet v rovnováze." },
    { value: "Pomáhá opylovat květiny", why: "Opylovat květiny pomáhá hmyz, ne vlk." },
  ], {
    hints: ["Která zvířata vlk nejsnáz uloví?", "Rychlého a zdravého jelena vlk nedohoní. Koho tedy chytí nejčastěji a co to udělá se zbytkem stáda?"],
    explanation: "Vlk nejčastěji uloví slabé, nemocné nebo staré kusy. Zbytek stáda je zdravější a zvěře není tolik, aby okusovala mladé stromky.",
  }),
  choice("Který z těchto živočichů je u nás ohrožený?", "Sysel obecný", [
    { value: "Srnec", why: "Srnců je u nás hodně, ohrožení nejsou." },
    { value: "Kos", why: "Kos je hojný pták, žije i ve městech." },
    { value: "Divoké prase", why: "Divokých prasat je naopak moc, jsou přemnožená." },
  ], {
    hints: ["Hledej malého hlodavce, který žije v norách na krátké trávě.", "Staví se na zadní nohy a hvízdá. Potřebuje nízkou spasenou nebo posečenou trávu a těch míst ubylo."],
    explanation: "Sysel obecný je kriticky ohrožený. Žije v norách na loukách a pastvinách s nízkou trávou, a těch ubylo. Srnci, kosi i divoká prasata jsou hojní.",
  }),
  choice("Proč ubývá čmeláků a včel?", "Chybí jim květy a škodí jim postřiky", [
    { value: "Je jich příliš mnoho", why: "Je to naopak, opylovačů ubývá." },
    { value: "Vadí jim déšť", why: "Déšť tu byl vždycky. Ubývají kvůli lidem." },
    { value: "Loví je vlaštovky", why: "Ptáci hmyz loví odjakživa. Příčinou úbytku jsou lidé." },
  ], {
    hints: ["Z čeho čmeláci a včely žijí?", "Potřebují kvetoucí louky a meze. Kde jsou dnes velká pole jedné plodiny a postřiky proti škůdcům?"],
    explanation: "Čmeláci a včely potřebují kvetoucí louky. Těch ubývá a na polích se používají postřiky, které hmyzu škodí. Bez opylovačů by nebyla úroda ovoce.",
  }),
  choice("K čemu slouží Červená kniha?", "Ukazuje, které druhy je potřeba chránit", [
    { value: "Je to kuchařka lesních plodů", why: "Červená kniha není kuchařka." },
    { value: "Je to seznam jedlých hub", why: "Seznam hub najdeš v atlasu hub. Červená kniha je o ohrožených druzích." },
    { value: "Je to mapa turistických cest", why: "Mapy cest mají turisté. Červená kniha je seznam ohrožených druhů." },
  ], {
    hints: ["Červená barva varuje.", "Kniha vyjmenuje rostliny a živočichy, kterým hrozí, že zmizí. K čemu to ochráncům je?"],
    explanation: "Červená kniha je seznam ohrožených druhů. Ukazuje, kterým rostlinám a živočichům hrozí vyhynutí, aby je lidé mohli chránit.",
  }),
  choice("Čím je Krkonošský národní park výjimečný?", "Je nejstarší národní park v Česku", [
    { value: "Je největší národní park", why: "Největší je Šumava." },
    { value: "Je nejmenší národní park", why: "Nejmenší je Podyjí." },
    { value: "Leží u moře", why: "Česko u moře neleží." },
  ], {
    hints: ["Každý ze čtyř parků je v něčem první nebo největší. Co platí pro Krkonoše?", "Šumava je největší, Podyjí nejmenší a České Švýcarsko nejmladší. Která vlastnost zbývá pro Krkonoše, kde je Sněžka?"],
    explanation: "Krkonošský národní park vznikl v roce 1963 jako první v Česku. Šumava je největší, Podyjí nejmenší a České Švýcarsko nejmladší.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("V lese zmizí vlci i rysové. Co se stane se srnci?", "Přemnoží se a okusují mladé stromky", [
    { value: "Srnců ubude", why: "Bez lovců srnců naopak přibude." },
    { value: "Nic se nezmění", why: "Lovci drží počet srnců v rovnováze. Bez nich se to změní." },
    { value: "Srnci začnou lovit", why: "Srnci jsou býložravci, lovit nezačnou." },
  ], {
    hints: ["Kdo srnce v přírodě loví?", "Když srnce nikdo neloví, rychle jich přibývá. A čím se živí? Co se stane s mladými stromky v lese?"],
    explanation: "Vlci a rysové loví srnce a drží jejich počet v rovnováze. Bez nich se srnci přemnoží a okousávají mladé stromky, takže les se hůř obnovuje.",
  }),
  choice("Proč nestačí chránit jen samotné zvíře, ale i místo, kde žije?", "Bez prostředí nemá potravu ani úkryt", [
    { value: "Zvíře potřebuje hlavně zákon", why: "Zákon pomůže, ale bez domova zvíře nepřežije." },
    { value: "Místo je důležité jen pro turisty", why: "Místo je nejdůležitější pro zvíře samotné." },
    { value: "Zvíře se přizpůsobí kdekoli", why: "Většina druhů potřebuje své prostředí, jinde nepřežije." },
  ], {
    hints: ["Co zvíře potřebuje každý den k životu?", "Vydra potřebuje čistou řeku s rybami, sysel louku s nízkou trávou. Co by jim byl platný zákaz lovu bez nich?"],
    explanation: "Každý druh potřebuje své prostředí — potravu, úkryt a místo pro mláďata. Když ho zničíme, zvíře zahyne, i když ho nikdo neloví.",
  }),
  choice("Mezi lesem a rybníkem vede silnice. Proč to žábám škodí?", "Cestou k rybníku hynou pod koly", [
    { value: "Silnice les ohřeje", why: "Nejde o teplotu. Žáby musí silnici přejít." },
    { value: "Žáby silnice nezajímá", why: "Žáby na jaře putují do rybníka a silnici musí přejít." },
    { value: "Silnice žáby vystraší, jinak nic", why: "Nejde jen o strach. Žáby na silnici hynou." },
  ], {
    hints: ["Kam žáby na jaře putují a proč?", "Na jaře táhnou žáby z lesa do rybníka klást vajíčka. Co je čeká mezi lesem a vodou?"],
    explanation: "Žáby na jaře táhnou z lesa do rybníka, kde kladou vajíčka. Když cestu přetíná silnice, mnoho jich zahyne pod koly. Proto se stavějí zábrany a podchody.",
  }),
  choice("Obec chce vysušit mokrou louku a udělat z ní pole. Proč ochránci nesouhlasí?", "Zmizí druhy, které žijí jen v mokřadech", [
    { value: "Pole je ošklivější", why: "Nejde o vzhled. Mokřad je domov vzácných druhů." },
    { value: "Na poli nic neroste", why: "Na poli roste plodina, ale mokřadní druhy tam nepřežijí." },
    { value: "Každá louka je chráněná", why: "Chráněná není každá. Mokřady jsou ale vzácné a cenné." },
  ], {
    hints: ["Kdo na mokré louce žije a na suchém poli by nepřežil?", "Na mokřadech kvete blatouch, kvákají žáby a hnízdí vzácní ptáci. Co se s nimi stane, když voda zmizí?"],
    explanation: "Mokřady jsou domovem rostlin a živočichů, kteří jinde nežijí. Po vysušení zmizí. Mokřady navíc zadržují vodu v krajině.",
  }),
  choice("Proč je dobré nechat v lese ležet starý padlý strom?", "Žije v něm hmyz, houby a hnízdí v něm zvířata", [
    { value: "Je nebezpečný pro lesníky", why: "Nebezpečí není důvod ho nechat — naopak by to byl důvod ho odklidit." },
    { value: "Aby les vypadal divočeji", why: "Nejde o vzhled. Mrtvé dřevo je domov mnoha organismů." },
    { value: "Protože ho nikdo nechce", why: "Důvod je užitek pro přírodu." },
  ], {
    hints: ["Kdo se v tlejícím dřevě schovává a čím se živí?", "V padlém kmeni žijí larvy brouků, rostou na něm houby a v dutinách hnízdí ptáci. Nakonec se rozloží na humus."],
    explanation: "Padlý strom je domov stovek druhů hmyzu, hub a mechů a úkryt pro zvířata. Postupně se rozloží a vrátí do půdy živiny.",
  }),
  choice("Bolševník přivezený z Kavkazu se u nás rychle šíří. Proč vadí?", "Vytlačuje naše rostliny a jeho šťáva pálí kůži", [
    { value: "Je příliš malý a nenápadný", why: "Bolševník je naopak obrovský, i přes tři metry." },
    { value: "Nikdy nekvete", why: "Bolševník kvete velkými bílými okolíky." },
    { value: "Ptáci ho jedí a nemají pak co jíst", why: "To s ním nesouvisí. Vadí tím, že vytlačuje naše rostliny." },
  ], {
    hints: ["Co udělá rostlina, která u nás nemá žádného nepřítele?", "Bolševník vyroste obrovský, zastíní vše kolem a šťáva z něj na slunci způsobí puchýře. Proč je to pro přírodu i lidi problém?"],
    explanation: "Bolševník je invazní rostlina. Rychle se šíří, zastíní a vytlačí naše původní rostliny a jeho šťáva na slunci popálí kůži. Proto se likviduje.",
  }),
  choice("Jak pomáhá přírodě třídění odpadu?", "Méně odpadu skončí v přírodě a na skládkách", [
    { value: "Odpad se pak nemusí vyvážet", why: "Tříděný odpad se také vyváží, ale zpracuje se znovu." },
    { value: "Barevné kontejnery lákají ptáky", why: "Kontejnery ptáky nelákají. Jde o to, kolik odpadu zbude." },
    { value: "Příroda odpad roztřídí sama", why: "Plasty a sklo se v přírodě rozkládají stovky let." },
  ], {
    hints: ["Co se stane s vytříděnou plastovou lahví?", "Z vytříděného papíru a plastu se vyrobí nové věci. Co by se jinak s tím odpadem stalo?"],
    explanation: "Z vytříděného odpadu se vyrobí nové věci, takže se méně těží a méně odpadu skončí na skládkách a v přírodě. Plasty se v přírodě rozkládají stovky let.",
  }),
  choice("Čáp bílý hnízdí u lidí, čáp černý v tichých lesích. Proč je čáp černý vzácnější?", "Klidných lesů je málo a lidé ho ruší", [
    { value: "Je hůř vidět, a tak ho nikdo nepočítá", why: "Počítá se. Opravdu je vzácnější, protože potřebuje klid." },
    { value: "Neumí létat", why: "Čáp černý létá a na zimu odlétá do Afriky." },
    { value: "Nemá rád vodu", why: "Naopak loví u potoků." },
  ], {
    hints: ["Co čáp černý potřebuje, na rozdíl od svého bílého příbuzného?", "Čáp bílý si zvykl na lidi. Čáp černý potřebuje velké tiché lesy s potoky. Kolik takových míst zbývá?"],
    explanation: "Čáp černý je plachý a hnízdí jen ve velkých klidných lesích u potoků. Takových míst je málo a lidé ho často vyruší, proto je vzácný.",
  }),
  choice("Proč se v národním parku nechávají některá místa úplně bez zásahu člověka?", "Aby se příroda mohla vyvíjet sama", [
    { value: "Lesníci nemají čas", why: "Je to záměr, ne nedostatek času." },
    { value: "Aby tam turisté mohli stanovat", why: "Do těch míst se naopak skoro nesmí." },
    { value: "Aby se tam mohlo kácet dřevo", why: "Kácet se tam právě nesmí." },
  ], {
    hints: ["Jak by vypadal les, kdyby do něj nikdo nezasahoval?", "Na některých místech se nekácí ani neuklízí, aby bylo vidět, jak si příroda poradí sama. Proč je to cenné?"],
    explanation: "V nejpřísněji chráněných částech národního parku se nezasahuje, aby se příroda vyvíjela sama. Vzniká tak divočina, jakou jinde nemáme.",
  }),
  choice("Vlk se do Česka vrátil sám, nikdo ho nevypustil. Jak je to možné?", "Přišel ze sousedních zemí, kde přežil", [
    { value: "Utekl ze zoo", why: "Vlci u nás nepocházejí ze zoo. Přišli z divočiny." },
    { value: "Přivezli ho myslivci", why: "Myslivci vlky nepřiváželi." },
    { value: "Celou dobu se schovával", why: "Vlk byl u nás vyhuben. Vrátil se z jiných zemí." },
  ], {
    hints: ["Kde vlci žili, když u nás žádní nebyli?", "Vlk dokáže ujít stovky kilometrů. V Německu, Polsku a na Slovensku vlci přežili. Co se stalo, když se jich tam namnožilo?"],
    explanation: "Vlci přežili v okolních zemích. Když se jich tam namnožilo, mladí vlci hledali nová území a sami přišli i do Česka. Pomohlo, že jsou chránění.",
  }),
  choice("Proč nemají lidé krmit divoké kachny a labutě pečivem?", "Pečivo jim škodí a znečišťuje vodu", [
    { value: "Kachny pečivo nejedí", why: "Jedí ho, ale škodí jim." },
    { value: "V zimě kachny nejí", why: "Kachny jedí po celý rok." },
    { value: "Pečivo je drahé", why: "O cenu nejde. Pečivo ptákům škodí." },
  ], {
    hints: ["Je pečivo přirozená potrava vodních ptáků?", "Ptáci se po pečivu nafouknou, ale živiny nedostanou a mohou onemocnět. A co udělá rozmočený chleba s rybníkem?"],
    explanation: "Pečivo není pro vodní ptáky vhodná potrava — škodí jejich zdraví. Zbytky chleba navíc hnijí ve vodě a znečišťují ji.",
  }),
  choice("Proč se v národním parku omezuje sběr borůvek a hub?", "Aby zbyla potrava zvířatům", [
    { value: "Borůvky jsou tam jedovaté", why: "Borůvky jedovaté nejsou. Jsou potravou pro zvířata." },
    { value: "Houby tam nerostou", why: "Houby tam rostou. Sběr se omezuje kvůli přírodě." },
    { value: "Aby lidé nepřibrali", why: "O lidi nejde. Jde o zvířata a rostliny." },
  ], {
    hints: ["Kdo v lese kromě lidí borůvky a houby jí?", "Borůvky zobou tetřevi a jedí je medvědi a myši. Co by jim zbylo, kdyby vše sesbírali lidé?"],
    explanation: "Borůvky a houby jsou potravou pro zvířata, třeba pro vzácné tetřevy. Při velkém sběru by jim nezbylo a lidé by navíc sešlapali vzácné rostliny.",
  }),
  choice("Proč chráníme i obyčejné louky a meze, nejen vzácné hory?", "Žije tam spousta druhů, které jinde nemají místo", [
    { value: "Louky se hodí na fotky", why: "O fotky nejde. Louky a meze jsou domovem mnoha druhů." },
    { value: "Na loukách se budou stavět domy", why: "Právě tomu chceme zabránit." },
    { value: "Meze nikomu k ničemu nejsou", why: "Meze jsou úkryt pro hmyz, ptáky i zajíce." },
  ], {
    hints: ["Kolik druhů květin a hmyzu najdeš na jedné louce?", "Na mezi mezi poli se schová koroptev, zajíc i čmeláci. Kam by šli, kdyby všude bylo jen pole?"],
    explanation: "Na loukách a mezích žije velké množství rostlin a živočichů. Když zmizí, tito tvorové nemají kam jít. Chránit se proto musí i obyčejná krajina, nejen vzácná místa.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const CHRANENEROSTLINYAZIVOCICHOVEOHROZENEDRUHY: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ochrana-prirody-chranene-rostliny-a-zivocichove-ohrozene-druhy",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ochrana-prirody-chranene-rostliny-a-zivocichove-ohrozene-druhy",
    title: "Chráněné rostliny a živočichové, ohrožené druhy",
    studentTitle: "Ochrana přírody",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš chráněná území ČR a pochopíš, proč musíme chránit ohrožené druhy.",
    keywords: ["ochrana přírody", "národní park", "CHKO", "Červená kniha", "ohrožené druhy", "vydra", "vlk", "rys", "koniklec"],
    goals: [
      "Jmenovat 4 národní parky ČR",
      "Vysvětlit rozdíl mezi národním parkem a CHKO",
      "Uvést příklady ohrožených druhů v ČR",
      "Popsat příčiny ohrožení a jak se v přírodě chovat",
    ],
    boundaries: ["Mezinárodní úmluvy a soustavy chráněných území (CITES, Natura 2000) nejsou náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Čtyři národní parky: Šumava (největší), Krkonoše (nejstarší, Sněžka), Podyjí (nejmenší), České Švýcarsko (pískovcové skály).",
      steps: [
        "Národní park chrání přírodu nejpřísněji, v CHKO lidé žijí a hospodaří.",
        "Červená kniha je seznam ohrožených druhů.",
        "Ohrožené druhy: rys, vlk, vydra, sysel, čáp černý, rak říční.",
        "Druhy nejvíc ubývají, když lidé ničí místa, kde žijí.",
      ],
      commonMistake: "Největší národní park je Šumava, ne Krkonoše — ty jsou nejstarší.",
      example: "Mládě srny v trávě není opuštěné. Nesahej na něj, matka se vrátí.",
    },
  },
];
