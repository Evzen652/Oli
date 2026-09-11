/**
 * Přírodověda 4. ročník — Voda: skupenství, koloběh vody v přírodě.
 *
 * Přepsáno 2026-09-11. Původní pool neměl u úloh nápovědu, vysvětlení ani
 * diagnostiku, jako správnou odpověď uváděl „Var – odpařování" (var
 * a vypařování jsou dva různé děje) a sahal po pojmech nad 4. ročník:
 * sublimace, hustota a „anomálie vody", transpirace, povodí.
 * Přechod páry na vodu se tu jmenuje kapalnění, jak ho znají učebnice
 * 1. stupně, ne kondenzace.
 *
 * Gradace:
 *  • L1 — tři skupenství, teploty tání a varu, druhy srážek.
 *  • L2 — přechody skupenství kolem nás (prádlo, orosená láhev, louže,
 *         mrazák) a jednotlivé kroky koloběhu.
 *  • L3 — koloběh jako celek a úvahy: proč led rybám pomáhá, proč je
 *         dešťová voda sladká, proč se solí silnice, co kdyby nehřálo Slunce.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "./_shared";

const POOL_L1: PracticeTask[] = [
  choice("Ve kterém skupenství je voda, která teče z kohoutku?", "V kapalném", [
    { value: "V pevném", why: "V pevném skupenství je voda jako led — ta z kohoutku neteče." },
    { value: "V plynném", why: "V plynném skupenství je voda jako neviditelná pára." },
    { value: "V žádném", why: "Voda je vždycky v nějakém skupenství: pevném, kapalném, nebo plynném." },
  ], {
    hints: ["Voda z kohoutku teče a dá se nalít do sklenice.", "Led drží tvar, pára se rozplyne ve vzduchu. Jak se jmenuje skupenství, které teče a přizpůsobí se nádobě?"],
    explanation: "Voda z kohoutku teče a přizpůsobí se tvaru sklenice — je v kapalném skupenství. Led je pevné skupenství a pára plynné.",
  }),
  choice("Jak se jmenuje voda v pevném skupenství?", "Led", [
    { value: "Pára", why: "Pára je voda v plynném skupenství." },
    { value: "Rosa", why: "Rosa jsou kapky vody, tedy kapalné skupenství." },
    { value: "Mlha", why: "Mlha jsou drobounké kapičky vody ve vzduchu, ne pevná voda." },
  ], {
    hints: ["Pevná voda se dá vzít do ruky a drží tvar.", "Najdeš ji v mrazáku v kostkách nebo v zimě na rybníce. Jak se jí říká?"],
    explanation: "Voda v pevném skupenství je led. Drží svůj tvar a vzniká, když voda zmrzne. Patří sem i sníh a kroupy.",
  }),
  choice("Jak se jmenuje voda v plynném skupenství?", "Vodní pára", [
    { value: "Led", why: "Led je voda v pevném skupenství." },
    { value: "Déšť", why: "Déšť jsou kapky, tedy kapalná voda." },
    { value: "Sníh", why: "Sníh jsou ledové krystalky, pevné skupenství." },
  ], {
    hints: ["Plynnou vodu často nevidíš, rozplyne se ve vzduchu.", "Stoupá z hrnce s vařící vodou a z horkého čaje. Jak se jmenuje?"],
    explanation: "Voda v plynném skupenství je vodní pára. Sama je neviditelná — bílý obláček nad hrncem jsou už drobné kapičky, na které se pára ve studenějším vzduchu srazila.",
  }),
  choice("Při jaké teplotě led taje?", "Při 0 °C", [
    { value: "Při 10 °C", why: "Při 10 °C už je led dávno roztátý. Taje, jakmile teplota vystoupí nad bod mrazu." },
    { value: "Při 100 °C", why: "Při 100 °C se voda vaří. Led taje mnohem dřív." },
    { value: "Při −20 °C", why: "Při −20 °C je silný mráz a led netaje." },
  ], {
    hints: ["Při té teplotě se na jaře mění sníh na vodu.", "Na teploměru je to hranice mezi mrazem a teplem. Pod ní voda mrzne, nad ní led taje."],
    explanation: "Led taje při 0 °C. Při téže teplotě voda mrzne na led. Proto je na teploměru nula hranicí mezi mrazem a oblevou.",
  }),
  choice("Při jaké teplotě se voda vaří?", "Při 100 °C", [
    { value: "Při 0 °C", why: "Při 0 °C voda mrzne nebo led taje. Vaří se mnohem výš." },
    { value: "Při 50 °C", why: "Voda o 50 °C je horká, ale ještě se nevaří." },
    { value: "Při 37 °C", why: "37 °C je teplota lidského těla. Voda se vaří až mnohem výš." },
  ], {
    hints: ["Je to mnohem teplejší než horká vana.", "Tuhle teplotu má voda, když v hrnci bublá a stoupá z ní pára. Je to okrouhlé číslo."],
    explanation: "Voda se vaří při 100 °C. Tvoří se v ní bubliny páry a rychle se mění na plyn. Teplota varu a tání vody jsou základ Celsiovy stupnice.",
  }),
  choice("Jak se jmenuje změna ledu na vodu?", "Tání", [
    { value: "Tuhnutí", why: "Tuhnutí je opak — voda se mění na led." },
    { value: "Var", why: "Při varu se voda mění na páru." },
    { value: "Vypařování", why: "Vypařováním se voda mění na páru." },
  ], {
    hints: ["Na jaře se to děje se sněhem a rampouchy.", "Kostka ledu ve sklenici se po chvíli změní na vodu. Jak se ten děj jmenuje?"],
    explanation: "Tání je změna pevného ledu na kapalnou vodu. Děje se, když teplota stoupne nad 0 °C. Opačný děj je tuhnutí.",
  }),
  choice("Jak se jmenuje změna vody na led?", "Tuhnutí", [
    { value: "Tání", why: "Tání je opak — led se mění na vodu." },
    { value: "Var", why: "Při varu se voda mění na páru." },
    { value: "Kapalnění", why: "Kapalnění je změna páry na vodu." },
  ], {
    hints: ["Děje se to s louží, když přijde mráz.", "Voda zmrzne a ztvrdne. Jak se jmenuje, když kapalina ztuhne na pevnou látku?"],
    explanation: "Tuhnutí (mrznutí) je změna kapalné vody na pevný led. Voda tuhne při 0 °C. Opačný děj je tání.",
  }),
  choice("Co pohání koloběh vody v přírodě?", "Slunce", [
    { value: "Vítr", why: "Vítr mraky jen přenáší. Vodu vypařuje teplo Slunce." },
    { value: "Měsíc", why: "Měsíc způsobuje příliv a odliv v moři, koloběh vody ne." },
    { value: "Ryby", why: "Ryby ve vodě žijí, ale koloběh nepohánějí." },
  ], {
    hints: ["Co ohřívá vodu v mořích a řekách, aby se vypařovala?", "Bez tepla by se voda nevypařovala a nevznikly by mraky. Odkud přichází teplo na celou Zemi?"],
    explanation: "Slunce ohřívá vodu v mořích, řekách i v listech rostlin a ta se vypařuje. Pára vystoupá, ochladí se a vzniknou mraky. Bez Slunce by se koloběh zastavil.",
  }),
  choice("Co jsou kroupy?", "Kousky ledu padající z mraků", [
    { value: "Velké kapky deště", why: "Kapky deště jsou kapalné. Kroupy jsou tvrdé kousky ledu." },
    { value: "Zmrzlá rosa na trávě", why: "Ledové krystalky na trávě jsou jinovatka. Kroupy padají z mraků." },
    { value: "Slepené sněhové vločky", why: "Vločky jsou měkké krystalky. Kroupy jsou tvrdé kuličky ledu." },
  ], {
    hints: ["Kroupy jsou tvrdé a při dopadu ťukají o okno.", "Padají z bouřkových mraků i v létě. Jsou to kuličky vody v pevném skupenství."],
    explanation: "Kroupy jsou kousky ledu, které vznikají v bouřkových mracích a padají i v létě. Mohou poškodit úrodu i auta.",
  }),
  choice("Jakou barvu a chuť má čistá voda?", "Je bezbarvá a bez chuti", [
    { value: "Je modrá a slaná", why: "Moře vypadá modře a je slané, ale čistá voda barvu ani chuť nemá." },
    { value: "Je bílá a sladká", why: "Čistá voda není bílá ani sladká. Je průhledná a bez chuti." },
    { value: "Je průhledná a kyselá", why: "Průhledná je, ale kyselá ne. Kyselá je třeba citronová šťáva." },
  ], {
    hints: ["Nalij si vodu z kohoutku do sklenice a podívej se na ni.", "Sklenicí vody vidíš skrz, jako by tam nic nebylo. A když ji ochutnáš?"],
    explanation: "Čistá voda je bezbarvá, bez chuti a bez zápachu. Modrá barva moře je jen odraz a slanost dělá rozpuštěná sůl.",
  }),
  choice("Co je rosa?", "Kapky vody, které se ráno objeví na trávě", [
    { value: "Drobný déšť z mraků", why: "Rosa nepadá z mraků. Vznikne na chladné trávě ze vzduchu." },
    { value: "Zmrzlé krystalky na trávě", why: "Ledové krystalky jsou jinovatka. Rosa jsou kapky vody." },
    { value: "Voda vytékající z půdy", why: "Rosa nevyvěrá ze země. Srazí se ze vzduchu." },
  ], {
    hints: ["Rosu najdeš ráno i tehdy, když v noci nepršelo.", "Když jdeš brzy ráno naboso po trávě, máš mokré nohy, i když nepršelo. Co je na trávě?"],
    explanation: "Rosa jsou kapky vody, které se v noci srazí z vodní páry ve vzduchu na chladné trávě. Nepadá z mraků.",
  }),
  choice("Jak se jmenují srážky, které v zimě padají jako bílé vločky?", "Sníh", [
    { value: "Kroupy", why: "Kroupy jsou tvrdé kuličky ledu a padají hlavně při bouřce." },
    { value: "Déšť", why: "Déšť jsou kapky vody, ne vločky." },
    { value: "Rosa", why: "Rosa nepadá, vzniká na trávě." },
  ], {
    hints: ["Dá se z nich postavit sněhulák.", "Bílé měkké krystalky, které padají z mraků, když mrzne. Jak se jim říká?"],
    explanation: "Sníh tvoří ledové krystalky — vločky. Vznikají v mracích, když je mráz, a padají na zem.",
  }),
  choice("Kde je na Zemi nejvíc vody?", "V mořích a oceánech", [
    { value: "V řekách", why: "Řeky vypadají velké, ale mají jen nepatrnou část vody Země." },
    { value: "V oblacích", why: "V oblacích je vody jen málo ve srovnání s oceány." },
    { value: "V rybnících", why: "Rybníky jsou malé. Většina vody na Zemi je slaná v mořích." },
  ], {
    hints: ["Podívej se na glóbus — které barvy je na něm nejvíc?", "Voda pokrývá většinu povrchu Země. Je slaná a tvoří obrovské modré plochy mezi pevninami."],
    explanation: "Většina vody na Zemi je v mořích a oceánech a je slaná. Sladké vody v řekách, jezerech a podzemí je jen malá část.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Jak se jmenuje změna páry zpátky na kapky vody?", "Kapalnění", [
    { value: "Vypařování", why: "Vypařování je opak — voda se mění na páru." },
    { value: "Tání", why: "Táním se mění led na vodu, ne pára." },
    { value: "Tuhnutí", why: "Tuhnutím se voda mění na led." },
  ], {
    hints: ["Pára se změní na kapalinu. Jak se to asi jmenuje?", "Děje se to na víčku hrnce nebo na studeném okně. Pára se na nich změní na kapky. Z jakého slova se jméno děje odvodí?"],
    explanation: "Kapalnění je změna vodní páry na kapky vody. Pára se ochladí a srazí. Tak vznikají mraky, rosa i kapky na víčku hrnce.",
  }),
  choice("Mokré prádlo na šňůře uschne. Kam zmizela voda?", "Vypařila se do vzduchu", [
    { value: "Vsákla se do šňůry", why: "Šňůra tolik vody nepojme. Voda se vypařila." },
    { value: "Stekla na zem", why: "Kousek vody může skapat, ale prádlo uschne i tam, kde pod ním není mokro." },
    { value: "Zmrzla na prádle", why: "V létě voda nemrzne. Prádlo uschne tím, že se voda vypaří." },
  ], {
    hints: ["Voda nezmizela, jen se změnila na něco, co nevidíš.", "Voda se na slunci a ve větru mění na neviditelnou páru, která odletí. Jak se tomu ději říká?"],
    explanation: "Voda z prádla se vypaří — změní se na neviditelnou vodní páru a ta odletí do vzduchu. Na slunci a ve větru to jde rychleji.",
  }),
  choice("Proč se orosí studená láhev vytažená z lednice?", "Pára ze vzduchu se na ní srazí na kapky", [
    { value: "Voda prosákne sklem", why: "Sklem voda neprojde. Kapky se vytvoří ze vzduchu kolem." },
    { value: "Láhev se potí jako člověk", why: "Láhev se nepotí. Kapky vzniknou z páry ve vzduchu." },
    { value: "Led v láhvi taje ven", why: "Voda z láhve ven nejde. Kapky jsou z páry ve vzduchu." },
  ], {
    hints: ["Ve vzduchu je neviditelná vodní pára. Co s ní udělá studený povrch?", "Stejně se orosí brýle, když přijdeš ze zimy do tepla. Pára se na studeném povrchu změní na kapky."],
    explanation: "Ve vzduchu je vždycky trocha neviditelné vodní páry. Na studené láhvi se ochladí a změní na kapky — zkapalní. Proto se láhev orosí zvenku.",
  }),
  choice("Jak vznikají mraky?", "Pára ve výšce se ochladí na drobné kapičky", [
    { value: "Z kouře z komínů", why: "Kouř mraky netvoří. Mraky jsou z kapiček vody." },
    { value: "Vítr zvedne vodu z moře", why: "Vítr vodu nezvedá. Voda se vypaří a jako pára vystoupá." },
    { value: "Ze sněhu z hor", why: "Mraky nevznikají ze sněhu. Tvoří je kapičky ze srážené páry." },
  ], {
    hints: ["Pára stoupá vzhůru. Jak je nahoře — tepleji, nebo chladněji?", "Vysoko nad zemí je chladno. Co se stane s vodní párou, když se ochladí? Vzpomeň si na orosenou láhev."],
    explanation: "Vodní pára stoupá vzhůru, kde je chladno. Tam se srazí na miliony drobných kapiček nebo krystalků ledu. Ty spolu tvoří mrak.",
  }),
  choice("Proč louže po dešti časem zmizí?", "Voda se vypaří a část se vsákne", [
    { value: "Vypijí ji ptáci a psi z okolí", why: "Ptáci se napijí jen trochu. Louže zmizí vypařováním a vsakováním." },
    { value: "Zmrzne a pak beze stopy zmizí", why: "V létě louže nemrzne. A led by nezmizel, jen roztál." },
    { value: "Odnese ji vítr i s blátem", why: "Vítr vypařování urychlí, ale vodu neodnese." },
  ], {
    hints: ["Voda z louže jde dvěma cestami: nahoru a dolů.", "Slunce vodu ohřeje a ta se změní na páru. A kam zmizí ta část vody, která pronikne do půdy?"],
    explanation: "Voda z louže se na slunci vypaří do vzduchu a část se vsákne do půdy. Proto louže zmizí rychleji v teplém a slunečném dni.",
  }),
  choice("Co se stane s vodou v plné skleněné láhvi, kterou necháš v mrazáku?", "Zmrzne a může láhev roztrhnout", [
    { value: "Vypaří se a láhev zůstane prázdná", why: "V mrazu se voda nevypaří, ale zmrzne." },
    { value: "Zůstane kapalná jako v lednici", why: "V mrazáku je pod nulou, voda tam zmrzne. V lednici je nad nulou." },
    { value: "Změní se v páru a unikne víčkem", why: "Na páru se voda mění teplem, ne mrazem." },
  ], {
    hints: ["Co se děje s vodou pod 0 °C?", "Když voda zmrzne, zabere víc místa. Co se stane s pevnou skleněnou láhví, když se led nemá kam roztáhnout?"],
    explanation: "Pod nulou voda zmrzne na led. Led zabírá víc místa než voda, a tak plnou skleněnou láhev může roztrhnout. Proto se do mrazáku nedávají plné láhve.",
  }),
  choice("Kde se bere voda ve studních a pramenech?", "Z deště, který se vsákl do země", [
    { value: "Z mraků přímo pod zemí", why: "Pod zemí mraky nejsou. Voda se tam dostane vsakováním." },
    { value: "Z moře, které teče pod zemí", why: "Mořská voda je slaná. Voda ve studních je z vsáklého deště." },
    { value: "Z roztátého ledu ve sklepech", why: "Ve sklepech led nebývá. Voda pochází ze srážek." },
  ], {
    hints: ["Kam jde dešťová voda, která nesteče do potoka?", "Déšť se vsákne do půdy a hluboko pod zemí se hromadí. Studna ji odtud čerpá a pramen ji vypouští ven."],
    explanation: "Dešťová voda a voda z tajícího sněhu se vsákne do půdy a hromadí se pod zemí jako podzemní voda. Ze studní ji čerpáme a u pramenů sama vytéká.",
  }),
  choice("Proč led plave na vodě?", "Led je lehčí než stejné množství vody", [
    { value: "Drží ho nahoře vlny", why: "Led plave i na úplně klidné vodě. Rozhoduje, že je lehčí." },
    { value: "Led je těžší, ale je studený", why: "Kdyby byl led těžší, klesl by ke dnu. Teplota to nezmění." },
    { value: "Led vodu odpuzuje", why: "Led vodu neodpuzuje. Plave, protože je lehčí." },
  ], {
    hints: ["Co ve vodě plave — věci lehčí, nebo těžší než voda?", "Kostka ledu ve sklenici je vždycky u hladiny. Co z toho plyne o tom, kolik váží led proti stejně velké vodě?"],
    explanation: "Když voda zmrzne, roztáhne se. Stejně velký kousek ledu je pak lehčí než voda, a proto led plave. Rybníky proto zamrzají od hladiny.",
  }),
  choice("Jak se voda z listů rostlin dostane do vzduchu?", "Vypaří se z listů", [
    { value: "Listy ji vyfouknou", why: "Listy nefoukají. Voda se z nich vypařuje." },
    { value: "Všechna kape z listů na zem", why: "Kapky z deště z listů stékají, ale voda z rostliny se vypařuje." },
    { value: "Rostliny vodu nevydávají", why: "Rostliny vydávají hodně vody. Vypaří se z listů." },
  ], {
    hints: ["Kořeny vodu nasají, ta vystoupá až do listů. Co se s ní stane pak?", "Listy mají drobounké otvory. Když svítí slunce, voda z nich odchází jako neviditelná pára."],
    explanation: "Rostlina nasaje vodu kořeny, voda vystoupá stonkem do listů a z nich se vypaří. Velký strom tak za den vypaří spoustu vody a pomáhá koloběhu.",
  }),
  choice("Co je mlha?", "Mrak přímo u země", [
    { value: "Kouř z ohně", why: "Kouř je z hoření. Mlha je z kapiček vody." },
    { value: "Jemný sníh", why: "Sníh padá. Mlha jsou kapičky, které se vznášejí." },
    { value: "Vítr, který je vidět", why: "Vítr vidět není. Mlhu tvoří drobné kapičky vody." },
  ], {
    hints: ["Mlha a mraky jsou ze stejné věci.", "Když jdeš mlhou, obličej ti trochu zvlhne. Z čeho tedy mlha je a kde se vznáší?"],
    explanation: "Mlha je vlastně mrak, který se vytvořil přímo u země. Tvoří ji drobné kapičky vody, na které se ochladila vodní pára ve vzduchu.",
  }),
  choice("Jaký je rozdíl mezi rosou a jinovatkou?", "Rosa jsou kapky, jinovatka ledové krystalky", [
    { value: "Jinovatka je hustší rosa", why: "Jinovatka není hustá rosa. Je z ledu, rosa z kapek." },
    { value: "Rosa je v zimě, jinovatka v létě", why: "Je to naopak. Jinovatka vzniká v mrazu." },
    { value: "Žádný, je to totéž", why: "Rosa je kapalná, jinovatka pevná." },
  ], {
    hints: ["Kdy ráno uvidíš na trávě bílé krystalky místo kapek?", "Rosa i jinovatka vznikají ze vzduchu na chladném povrchu. Když mrzne, co se stane s kapkami?"],
    explanation: "Rosa jsou kapky vody na chladné trávě. Když v noci mrzne, pára se na trávě a větvičkách srazí rovnou na ledové krystalky — to je jinovatka.",
  }),
  choice("Proč se sníh na jaře mění ve vodu?", "Oteplí se nad 0 °C a sníh taje", [
    { value: "Sníh vypijí rostliny", why: "Rostliny vodu z tajícího sněhu vsáknou, ale sníh taje teplem." },
    { value: "Sníh se najednou vypaří", why: "Sníh na jaře hlavně taje na vodu." },
    { value: "Na jaře víc prší", why: "Déšť tání urychlí, ale hlavní je teplo nad nulou." },
  ], {
    hints: ["Co se na jaře děje s teplotou?", "Sníh je led. Při jaké teplotě led taje a kdy se tak na jaře oteplí?"],
    explanation: "Sníh je z ledových krystalků. Když teplota na jaře vystoupí nad 0 °C, sníh taje a mění se ve vodu, která teče do potoků nebo se vsákne.",
  }),
  choice("Kam nakonec teče voda z řek?", "Do moře", [
    { value: "Do mraků", why: "Do mraků se voda dostane vypařením, ne tokem řeky." },
    { value: "Pod zem do středu Země", why: "Část vody se vsákne, ale řeky tečou do moře." },
    { value: "Zpátky k prameni", why: "Voda teče z kopce dolů, zpátky do kopce neteče." },
  ], {
    hints: ["Voda teče vždycky z kopce dolů. Kde je nejníž?", "Potoky se spojí v řeky a řeky tečou dál a dál, až skončí u něčeho obrovského a slaného."],
    explanation: "Voda teče z kopce dolů. Potoky se slévají do řek a řeky tečou do moře. Z moře se voda zase vypaří a koloběh pokračuje.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Který sled správně popisuje koloběh vody?", "výpar – mraky – déšť – řeky – moře", [
    { value: "výpar – déšť – mraky – řeky – moře", why: "Déšť padá z mraků, takže mraky musí vzniknout dřív." },
    { value: "mraky – výpar – déšť – moře – řeky", why: "Mraky vznikají z vypařené vody. A řeky tečou do moře, ne naopak." },
    { value: "výpar – mraky – řeky – déšť – moře", why: "Řeky se plní deštěm, takže déšť musí být před řekami." },
  ], {
    hints: ["U každého kroku se zeptej: z čeho vzniká?", "Déšť padá z mraků, mraky vznikají z páry, řeky plní déšť a řeky tečou do moře. Odkud se bere pára?"],
    explanation: "Slunce vypaří vodu z moře, pára vystoupá a vytvoří mraky. Z mraků prší, voda steče do řek a řeky ji odnesou zpět do moře. Pak vše začíná znovu.",
  }),
  choice("Rybník v zimě zamrzne jen nahoře. Proč to rybám pomáhá?", "Pod ledem zůstane voda, ve které přežijí", [
    { value: "Led jim dodává potravu", why: "Led potravu nedává. Důležité je, že pod ním zůstane voda." },
    { value: "Led je hřeje jako kamna", why: "Led nehřeje. Jen chrání vodu pod sebou, aby nezamrzla." },
    { value: "Ryby v zimě spí na břehu", why: "Ryby z vody nevylézají. Přežijí pod ledem." },
  ], {
    hints: ["Kde plave led — u dna, nebo u hladiny?", "Led zůstane nahoře jako víko a voda pod ním nezamrzne. Co by se stalo s rybami, kdyby rybník zamrzl celý?"],
    explanation: "Led je lehčí než voda, a proto plave nahoře. Vytvoří víko, pod kterým zůstane kapalná voda, a v ní ryby přečkají zimu. Kdyby rybník zamrzl celý, ryby by uhynuly.",
  }),
  choice("Déšť vzniká z vody vypařené i z moře. Proč není slaný?", "Sůl se nevypaří a zůstane v moři", [
    { value: "Mraky sůl přefiltrují jako síto", why: "Mraky nic nefiltrují. Sůl se do páry vůbec nedostane." },
    { value: "Sůl se v mracích rozpustí", why: "Sůl v mracích není. Při vypařování zůstala v moři." },
    { value: "Déšť padá z čistého nebe", why: "Déšť padá z mraků. Sladký je proto, že se sůl nevypaří." },
  ], {
    hints: ["Zkus si představit, co zůstane na talířku, když se slaná voda vypaří.", "Když se vypaří slaná voda, na talířku zbyde bílá sůl. Co tedy stoupá do mraků — voda se solí, nebo bez ní?"],
    explanation: "Když se mořská voda vypařuje, do vzduchu odchází jen voda. Sůl zůstane v moři. Proto jsou mraky i déšť sladké. Tak vzniká sladká voda na pevnině.",
  }),
  choice("Proč louže v horkém létě vyschne rychleji než v chladném podzimu?", "Teplo vypařování urychluje", [
    { value: "Na podzim neprší", why: "Na podzim prší dost. Pomalejší je vypařování." },
    { value: "V létě louže zmrzne", why: "V létě nemrzne. Horko naopak vypařování urychlí." },
    { value: "Na podzim je louže hlubší", why: "Hloubka to vysvětlit nemusí. I stejná louže vyschne dřív v horku." },
  ], {
    hints: ["Co pomáhá vodě změnit se na páru?", "Prádlo uschne rychleji v horkém dni než v chladném. Proč stejně rychle nemizí louže na podzim?"],
    explanation: "Čím je tepleji, tím rychleji se voda vypařuje. V horkém létě louže zmizí za pár hodin, v chladném počasí vydrží i několik dní.",
  }),
  choice("Proč se okna v kuchyni při vaření zamlží?", "Pára z hrnce se srazí na studeném skle", [
    { value: "Sklo se zahřeje a zbělá", why: "Sklo se horkem nebarví. Zamlžení tvoří drobné kapky." },
    { value: "Usadí se na něm kouř", why: "Kouř by nechal šedou vrstvu. Zamlžení jsou kapky vody." },
    { value: "Venku prší", why: "Déšť by byl na vnější straně. Kuchyňské okno se mlží zevnitř." },
  ], {
    hints: ["Z hrnce stoupá pára. Kde se v kuchyni ochladí nejvíc?", "Okno je studené od venkovního vzduchu. Co se stane s párou, když narazí na studený povrch? Stejně se orosí láhev z lednice."],
    explanation: "Z vařící vody stoupá pára. Když dorazí ke studenému oknu, ochladí se a zkapalní na drobné kapky. Ty okno zamlží.",
  }),
  choice("Proč se v zimě sype na silnice sůl?", "Slaná voda zamrzá až v silnějším mrazu", [
    { value: "Sůl led zahřeje", why: "Sůl nehřeje. Mění teplotu, při které voda mrzne." },
    { value: "Sůl led rozbije na kousky", why: "Sůl led nerozbíjí. Způsobí, že slaná voda nezamrzne." },
    { value: "Sůl vodu vypaří", why: "Sůl vodu nevypařuje." },
  ], {
    hints: ["Zamrzá moře stejně snadno jako rybník?", "Sladká voda mrzne při 0 °C, ale slaná potřebuje větší mráz. Co se tedy stane s náledím posypaným solí?"],
    explanation: "Slaná voda zamrzá až při nižší teplotě než sladká. Sůl na silnici způsobí, že voda nezmrzne na led ani při slabém mrazu. Škodí ale rostlinám u silnic.",
  }),
  choice("Zapomenutá plná láhev v mrazáku praskla. Co z toho plyne o ledu?", "Led zabírá víc místa než voda", [
    { value: "Led je těžší než voda", why: "Led je naopak lehčí, proto plave. Láhev roztrhl tím, že se roztáhl." },
    { value: "Voda v mrazu zmizí", why: "Voda nezmizela, změnila se v led." },
    { value: "Sklo v mrazu samo praská", why: "Prázdná láhev v mrazu nepraskne. Roztrhl ji led." },
  ], {
    hints: ["Láhev byla plná a nic se do ní nepřidalo. Proč tedy praskla?", "Když voda zmrzne, roztáhne se. Co se stane s pevnou nádobou, ze které se led nemá kam roztáhnout?"],
    explanation: "Voda při zmrznutí zvětší objem. Led v plné láhvi potřebuje víc místa, než láhev má, a tak ji roztrhne. Stejně led trhá kameny a skály.",
  }),
  choice("Kdyby Slunce přestalo hřát, co by se stalo s koloběhem vody?", "Voda by se přestala vypařovat", [
    { value: "Pršelo by mnohem víc než dnes", why: "Bez vypařování by nevznikaly mraky, a tak by pršelo méně." },
    { value: "Koloběh by se ještě zrychlil", why: "Slunce koloběh pohání. Bez něj by se zastavil." },
    { value: "Nic by se na koloběhu nezměnilo", why: "Koloběh začíná vypařováním, a to potřebuje teplo Slunce." },
  ], {
    hints: ["Kterým krokem koloběh začíná a co k němu voda potřebuje?", "Bez tepla se voda nevypaří, nevzniknou mraky a nebude pršet. A ještě — co by se stalo s vodou v moři?"],
    explanation: "Koloběh začíná tím, že Slunce vodu ohřeje a vypaří. Bez jeho tepla by nevznikaly mraky, nepršelo by a voda by postupně zamrzla. Koloběh by se zastavil.",
  }),
  choice("Proč les pomáhá, aby po dešti nebyla povodeň?", "Zadrží vodu v půdě a zpomalí její odtok", [
    { value: "Stromy všechnu vodu hned vypijí", why: "Stromy část vody přijmou, ale hlavně ji les zadrží a pomalu pouští." },
    { value: "Les déšť odfoukne", why: "Les nefouká. Jeho půda vodu nasákne jako houba." },
    { value: "Les z vody udělá led", why: "Les vodu nemrazí. Zadržuje ji a zpomaluje." },
  ], {
    hints: ["Co se stane s deštěm v lese a co na holém svahu?", "Lesní půda s mechem a listím nasákne vodu jako houba a pouští ji pomalu do potoků. Co udělá stejný déšť na holém svahu?"],
    explanation: "Lesní půda, mech a listí nasáknou vodu jako houba a pomalu ji pouštějí do potoků. Z holého svahu voda steče najednou a řeky se rozvodní.",
  }),
  choice("Na horách leží sníh i v dubnu, v nížině už ne. Proč?", "Na horách je chladněji, sníh taje později", [
    { value: "Na horách víc svítí slunce", why: "Slunce by sníh rozpustilo rychleji. Na horách je ale chladněji." },
    { value: "Sníh na horách je z ledu", why: "Všechen sníh je z ledových krystalků. Rozdíl je v teplotě." },
    { value: "V nížině nikdy nesněží", why: "I v nížině sněží, jen tam sníh na jaře roztaje dřív." },
  ], {
    hints: ["Kde je tepleji — nahoře na horách, nebo dole v nížině?", "Čím výš vystoupáš, tím je chladněji. Kdy se na horách oteplí nad nulu ve srovnání s nížinou?"],
    explanation: "Na horách je chladněji než v nížině, a tak se teplota nad 0 °C dostane později. Sníh tam proto vydrží dlouho do jara a tající voda plní potoky.",
  }),
  choice("Obloha je bez mráčku. Je ve vzduchu přesto voda?", "Ano, jako neviditelná pára", [
    { value: "Ne, voda je jen v řekách a mořích", why: "Voda je i ve vzduchu, jen jako pára, kterou nevidíš." },
    { value: "Ne, bez mraků je vzduch úplně suchý", why: "I bez mraků je ve vzduchu pára. Proto se orosí studená láhev." },
    { value: "Ano, ale jen v noci", why: "Pára je ve vzduchu pořád, ve dne i v noci." },
  ], {
    hints: ["Odkud se bere voda, která orosí studenou láhev?", "Láhev se orosí i za jasného dne bez mraků. Kapky se vzaly ze vzduchu. V jaké podobě tam voda byla?"],
    explanation: "Ve vzduchu je vždycky trochu vodní páry, i když je obloha jasná. Pára je neviditelná. Uvidíme ji až tehdy, když se ochladí a zkapalní — na studené láhvi, jako rosa nebo mrak.",
  }),
  choice("Proč je ráno na trávě někdy rosa a jindy jinovatka?", "Při mrazu se pára srazí rovnou na led", [
    { value: "Jinovatka je zmrzlý déšť", why: "Jinovatka nepadá z mraků. Vzniká na povrchu ze vzduchu." },
    { value: "Rosa je teplejší sníh", why: "Rosa jsou kapky vody, se sněhem nesouvisí." },
    { value: "Jinovatka padá z mraků", why: "Z mraků padá sníh nebo kroupy. Jinovatka vzniká na trávě a větvích." },
  ], {
    hints: ["Rosa i jinovatka vznikají z páry ve vzduchu. Čím se ta rána liší?", "Když je v noci nad nulou, pára se srazí na kapky. Co se stane, když je tráva zmrzlá?"],
    explanation: "Když v noci nemrzne, pára se na chladné trávě srazí na kapky rosy. Když mrzne, srazí se rovnou na ledové krystalky — jinovatku.",
  }),
  choice("Mořskou vodu pít nemůžeme. Jak se z ní stane pitná voda na pevnině?", "Vypaří se, zprší a vsákne do země", [
    { value: "Sůl z ní vyberou ryby", why: "Ryby sůl z moře nevybírají." },
    { value: "Řeky ji cestou přefiltrují", why: "Řeky tečou do moře, ne z něj. Sůl zmizí při vypařování." },
    { value: "Moře ji samo vyčistí", why: "Moře zůstává slané. Sladká voda vzniká vypařováním." },
  ], {
    hints: ["Který krok koloběhu oddělí vodu od soli?", "Když se voda vypaří, sůl zůstane dole. Pára vytvoří mraky nad pevninou. Co pak s vodou z mraků?"],
    explanation: "Slunce vypaří mořskou vodu a sůl zůstane v moři. Pára vytvoří mraky, ze kterých nad pevninou zprší sladká voda. Ta se vsákne do země a čerpáme ji ze studní.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const VODASKUPENSTVIKOLOBEHVODYVPRIRODE: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-voda-skupenstvi-kolobeh-vody-v-prirode",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-voda-skupenstvi-kolobeh-vody-v-prirode",
    title: "Voda - skupenství, koloběh vody v přírodě",
    studentTitle: "Voda a koloběh",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš tři skupenství vody a pochopíš koloběh vody v přírodě.",
    keywords: ["voda", "led", "pára", "koloběh vody", "skupenství", "tání", "tuhnutí", "vypařování", "kapalnění"],
    goals: [
      "Rozlišit tři skupenství vody a uvést příklady",
      "Pojmenovat změny skupenství (tání, tuhnutí, vypařování, var, kapalnění)",
      "Popsat koloběh vody v přírodě a úlohu Slunce",
      "Vysvětlit, proč led plave a rybník zamrzá od hladiny",
    ],
    boundaries: [
      "Neprobírá stavbu molekuly vody ani vzorec H₂O — patří na 2. stupeň",
      "Neprobírá hustotu a sublimaci — pojmy fyziky 2. stupně",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Led je pevné skupenství, voda kapalné, pára plynné.",
      steps: [
        "Tání: led na vodu (0 °C). Tuhnutí: voda na led.",
        "Vypařování a var: voda na páru (var při 100 °C).",
        "Kapalnění: pára na kapky (mraky, rosa, orosená láhev).",
        "Koloběh: výpar, mraky, srážky, řeky, moře — pohání ho Slunce.",
      ],
      commonMistake: "Var a vypařování nejsou totéž: voda se vypařuje i za studena, vaří se až při 100 °C.",
      example: "Studená láhev z lednice se orosí, protože pára ze vzduchu na ní zkapalní.",
    },
  },
];
