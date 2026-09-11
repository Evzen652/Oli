import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu
// („Dvoukomorový parlament.“), žádnou zpětnou vazbu k chybným možnostem,
// klíče nápadně delší než distraktory a L3 byla z poloviny kopie L2.
// Teď: L1 fakta o parlamentu, prezidentovi a obci · L2 kdo co dělá a proč
// · L3 situace, ve kterých se pravidla použijí.

const L1: PracticeTask[] = [
  choice("Z kolika komor se skládá Parlament České republiky?", "ze dvou", [
    { value: "z jedné", why: "Jednu komoru má například zastupitelstvo obce. Parlament má Sněmovnu a Senát." },
    { value: "ze tří", why: "Prezident ani vláda do parlamentu nepatří — komory jsou jen dvě." },
    { value: "ze čtyř", why: "Parlament tvoří jen Poslanecká sněmovna a Senát." },
  ], {
    hints: ["Vzpomeň si, jak se jmenují části parlamentu. Kolik jich je?", "Jedna část parlamentu zasedá v Thunovském paláci, druhá ve Valdštejnském paláci na Malé Straně. Spočítej je."],
    explanation: "Parlament ČR má dvě komory: Poslaneckou sněmovnu a Senát.",
  }),
  choice("Kolik poslanců má Poslanecká sněmovna?", "200", [
    { value: "81", why: "81 členů má Senát." },
    { value: "100", why: "Sněmovna je dvakrát větší." },
    { value: "150", why: "Tolik poslanců Sněmovna nemá — má jich víc." },
  ], {
    hints: ["Sněmovna je větší komora parlamentu než Senát.", "Senát má 81 senátorů. Sněmovna má víc než dvojnásobek — kulaté číslo."],
    explanation: "Poslanecká sněmovna má 200 poslanců, Senát 81 senátorů.",
  }),
  choice("Kolik senátorů má Senát?", "81", [
    { value: "200", why: "200 členů má Poslanecká sněmovna." },
    { value: "100", why: "Senátorů je méně než sto." },
    { value: "27", why: "Každé dva roky se volí jen třetina senátorů, celkem jich je víc." },
  ], {
    hints: ["Senát je menší z obou komor parlamentu.", "Každý senátor zastupuje jeden volební obvod; obvodů je v Česku přes osmdesát."],
    explanation: "Senát má 81 senátorů — jednoho za každý volební obvod.",
  }),
  choice("Na kolik let volíme poslance?", "na 4 roky", [
    { value: "na 5 let", why: "Na pět let se volí prezident." },
    { value: "na 6 let", why: "Na šest let se volí senátoři." },
    { value: "na 2 roky", why: "Každé dva roky se volí třetina Senátu, ne Sněmovna." },
  ], {
    hints: ["Poslanci jsou voleni na kratší dobu než senátoři i prezident.", "Senátoři mají 6 let, prezident 5 let. Poslanci mají ještě o rok méně než prezident."],
    explanation: "Poslanci jsou voleni na 4 roky, prezident na 5 let, senátoři na 6 let.",
  }),
  choice("Na kolik let je volen prezident republiky?", "na 5 let", [
    { value: "na 4 roky", why: "Na čtyři roky se volí poslanci." },
    { value: "na 6 let", why: "Na šest let se volí senátoři." },
    { value: "na 7 let", why: "Sedm let trvalo období prezidenta za první republiky, dnes je kratší." },
  ], {
    hints: ["Prezident je volen na déle než poslanci, ale na kratší dobu než senátoři.", "Poslanci jsou voleni na 4 roky, senátoři na 6 let. Prezidentské období leží přesně mezi nimi — spočítej, kolik to je."],
    explanation: "Prezident je volen na 5 let a nejvýš dvakrát po sobě.",
  }),
  choice("Kdo volí prezidenta České republiky?", "občané v přímé volbě", [
    { value: "poslanci a senátoři společně", why: "Tak se prezident volil do roku 2012; od roku 2013 volí občané přímo." },
    { value: "vláda na své schůzi", why: "Vláda prezidenta nevolí — naopak prezident jmenuje premiéra." },
    { value: "senátoři hlasováním", why: "Senát prezidenta nevolí." },
  ], {
    hints: ["Od roku 2013 se prezident volí jinak než dřív. Kdo chodí k volbám?", "Při prezidentské volbě vhodí lístek do urny každý občan starší 18 let — stejně jako při volbách do Sněmovny."],
    explanation: "Od roku 2013 volí prezidenta přímo občané.",
  }),
  choice("Od kolika let smí občan Česka volit?", "od 18 let", [
    { value: "od 15 let", why: "V 15 letech dostáváš občanský průkaz, volit ale ještě nesmíš." },
    { value: "od 16 let", why: "V některých zemích se volí od 16 let, u nás od 18." },
    { value: "od 21 let", why: "Od 21 let může člověk kandidovat do Sněmovny; volit smí dřív." },
  ], {
    hints: ["Volit smějí dospělí občané. Kdy se u nás stává člověk plnoletým?", "Plnoletost znamená, že člověk může sám uzavírat smlouvy a volit — nastává ve stejném věku, kdy smí řídit auto."],
    explanation: "Volit smí každý občan Česka od 18 let, tedy od plnoletosti.",
  }),
  choice("Kdo stojí v čele vlády?", "předseda vlády (premiér)", [
    { value: "prezident", why: "Prezident je hlava státu, vládu nevede." },
    { value: "předseda Sněmovny", why: "Předseda Sněmovny řídí schůze poslanců." },
    { value: "hejtman", why: "Hejtman stojí v čele kraje." },
  ], {
    hints: ["Vládu tvoří ministři. Kdo je řídí?", "Tomuto politikovi se často říká premiér; jmenuje ho prezident."],
    explanation: "Vládu řídí předseda vlády (premiér), kterého jmenuje prezident.",
  }),
  choice("Kde sídlí prezident republiky?", "na Pražském hradě", [
    { value: "ve Valdštejnském paláci", why: "Ve Valdštejnském paláci zasedá Senát." },
    { value: "na zámku v Lánech", why: "V Lánech má prezident letní sídlo, jeho úřad je na Hradě." },
    { value: "ve Strakově akademii", why: "Ve Strakově akademii sídlí vláda." },
  ], {
    hints: ["Sídlo prezidenta je nejznámější stavba nad Vltavou v Praze.", "Na tomto místě sídlili už čeští knížata a králové; stojí tam i katedrála sv. Víta."],
    explanation: "Prezident sídlí na Pražském hradě, stejně jako kdysi čeští panovníci.",
  }),
  choice("Jak se jmenuje zastupitelský orgán obce?", "zastupitelstvo obce", [
    { value: "Senát", why: "Senát je komora parlamentu celé republiky." },
    { value: "vláda", why: "Vláda řídí celý stát, ne obec." },
    { value: "krajský úřad", why: "Krajský úřad pracuje pro kraj, nikdo ho nevolí." },
  ], {
    hints: ["Kdo rozhoduje o škole, silnicích a hřišti ve vaší obci?", "Občané obce si ho volí v komunálních volbách jednou za čtyři roky; ze svého středu pak zvolí starostu."],
    explanation: "Obec řídí zastupitelstvo, které si volí její občané.",
  }),
  choice("Kdo stojí v čele obce?", "starosta", [
    { value: "hejtman", why: "Hejtman stojí v čele kraje." },
    { value: "premiér", why: "Premiér vede vládu celého státu." },
    { value: "senátor", why: "Senátor zasedá v Senátu." },
  ], {
    hints: ["Obec má svého nejvyššího zástupce. Jak se mu říká?", "Volí ho zastupitelstvo obce; ve velkých městech s magistrátem se mu říká primátor."],
    explanation: "V čele obce stojí starosta, kterého volí zastupitelstvo.",
  }),
  choice("Jak se hlasuje ve volbách?", "tajně", [
    { value: "zvednutím ruky", why: "Veřejně se hlasuje třeba na schůzi třídy, ve volbách ne." },
    { value: "nahlas před komisí", why: "Komise jen dohlíží; koho volíš, nikomu neříkáš." },
    { value: "společně za celou rodinu", why: "Každý volí sám za sebe." },
  ], {
    hints: ["Proč stojí ve volební místnosti plenta?", "Za plentou si volič vybere lístek sám, aby nikdo neviděl, koho volí."],
    explanation: "Volby jsou tajné: nikdo nesmí zjistit, koho kdo volil.",
  }),
  choice("Kde zasedají senátoři?", "ve Valdštejnském paláci", [
    { value: "na Pražském hradě", why: "Na Hradě sídlí prezident." },
    { value: "ve Strakově akademii", why: "Tam sídlí vláda." },
    { value: "v Thunovském paláci", why: "V Thunovském paláci zasedá Poslanecká sněmovna." },
  ], {
    hints: ["Senát sídlí v barokní budově na Malé Straně s velkou zahradou.", "Budovu postavil vojevůdce z doby třicetileté války a nese jeho jméno dodnes — dnes v ní zasedají senátoři."],
    explanation: "Senát zasedá ve Valdštejnském paláci, který dal postavit Albrecht z Valdštejna.",
  }),
];

const L2: PracticeTask[] = [
  choice("Kdo v Česku schvaluje zákony?", "Parlament", [
    { value: "vláda", why: "Vláda zákony navrhuje a plní, ale neschvaluje." },
    { value: "prezident", why: "Prezident zákon podepisuje nebo vrací, ale neschvaluje." },
    { value: "Ústavní soud", why: "Ústavní soud může zákon zrušit, když odporuje ústavě." },
  ], {
    hints: ["Zákony schvaluje moc zákonodárná. Kdo ji v Česku má?", "Zákon musí projít Poslaneckou sněmovnou a obvykle i Senátem — obě komory dohromady tvoří…"],
    explanation: "Zákony schvaluje Parlament — Poslanecká sněmovna a Senát.",
  }),
  choice("Komu je vláda odpovědná?", "Poslanecké sněmovně", [
    { value: "prezidentovi", why: "Prezident vládu jmenuje, ale odvolat ji hlasováním může jen Sněmovna." },
    { value: "Senátu", why: "Senát vládě nedůvěru vyslovit nemůže." },
    { value: "Ústavnímu soudu", why: "Ústavní soud posuzuje zákony, vládu neodvolává." },
  ], {
    hints: ["Kdo může vládě vyslovit nedůvěru a tím ji svrhnout?", "Vláda musí po jmenování získat důvěru jedné z komor parlamentu — té, která má 200 členů."],
    explanation: "Vláda potřebuje důvěru Poslanecké sněmovny; bez ní musí odstoupit.",
  }),
  choice("Kdo jmenuje ministry?", "prezident na návrh premiéra", [
    { value: "Senát hlasováním", why: "Senát ministry nejmenuje." },
    { value: "premiér bez prezidenta", why: "Premiér ministry vybírá, ale jmenuje je prezident." },
    { value: "občané ve volbách", why: "Ministry občané nevolí; volí poslance." },
  ], {
    hints: ["Ministry vybírá předseda vlády. Kdo je ale slavnostně jmenuje?", "Jmenovat ministry i předsedu vlády je jedna z hlavních pravomocí hlavy státu."],
    explanation: "Ministry jmenuje prezident na návrh předsedy vlády.",
  }),
  choice("Co znamená dělba moci?", "moc je rozdělená mezi parlament, vládu a soudy", [
    { value: "všechna moc patří prezidentovi", why: "Tak by vypadala samovláda jednoho člověka." },
    { value: "vláda rozhoduje bez kontroly", why: "Vládu kontroluje Sněmovna a soudy." },
    { value: "soudy samy vydávají zákony", why: "Zákony schvaluje parlament, soudy podle nich rozhodují." },
  ], {
    hints: ["Proč by nebylo dobré, kdyby o všem rozhodoval jediný člověk?", "Moc je rozdělená na tři části: zákony schvaluje jedna, plní je druhá a o sporech rozhoduje třetí."],
    explanation: "Moc zákonodárnou má parlament, výkonnou vláda a soudní soudy — navzájem se kontrolují.",
  }),
  choice("Proč jsou volby tajné?", "aby nikdo nemohl voliče nutit nebo trestat", [
    { value: "aby se hlasy rychleji sečetly", why: "Tajnost s rychlostí sčítání nesouvisí." },
    { value: "protože to nařídila Evropská unie", why: "Tajné volby jsou pravidlem demokracie odedávna." },
    { value: "aby se volby nemusely opakovat", why: "Opakování voleb s tajností nesouvisí." },
  ], {
    hints: ["Co by se mohlo stát, kdyby všichni věděli, koho kdo volil?", "Kdyby šéf nebo soused viděli, jak volíš, mohli by na tebe tlačit. Plenta tě chrání."],
    explanation: "Tajná volba chrání voliče: může se rozhodnout svobodně a nikdo ho za to nepotrestá.",
  }),
  choice("Proč se volby konají pravidelně?", "aby lidé mohli vyměnit politiky, se kterými nejsou spokojení", [
    { value: "aby se pokaždé zvolil úplně nový prezident a vláda", why: "Stejní politici mohou být zvoleni znovu, když jim lidé věří." },
    { value: "protože zvolení politici musejí po čtyřech letech z politiky odejít", why: "Mohou kandidovat znovu." },
    { value: "aby stát ušetřil peníze", why: "Volby peníze stojí; smyslem je kontrola politiků." },
  ], {
    hints: ["Co můžou voliči udělat, když jim politici nevyhovují?", "Pravidelné volby jsou kontrola: kdo slibuje a neplní, nemusí být zvolen znovu."],
    explanation: "Pravidelné volby dávají lidem možnost politiky odměnit, nebo vyměnit.",
  }),
  choice("Jaký je rozdíl mezi prezidentem a premiérem?", "prezident je hlava státu, premiér řídí vládu", [
    { value: "premiér je hlava státu, prezident řídí vládu", why: "Je to naopak." },
    { value: "jsou to dvě jména pro stejnou funkci", why: "Jsou to dvě různé funkce se dvěma lidmi." },
    { value: "premiér jmenuje prezidenta", why: "Prezidenta volí občané; premiéra jmenuje prezident." },
  ], {
    hints: ["Kdo z nich zastupuje stát navenek a kdo vede ministry?", "Prezident sídlí na Hradě a jmenuje premiéra; premiér pak s ministry každý den spravuje stát."],
    explanation: "Prezident je hlava státu, premiér stojí v čele vlády.",
  }),
  choice("Proč mají senátoři delší volební období než poslanci?", "aby byl Senát stabilnější a nepodléhal náladám", [
    { value: "protože senátoři jsou starší", why: "Věk s délkou období nesouvisí." },
    { value: "protože Senát schvaluje státní rozpočet", why: "Rozpočet schvaluje jen Poslanecká sněmovna." },
    { value: "protože senátory jmenuje prezident", why: "Senátory volí občané." },
  ], {
    hints: ["Co by se stalo, kdyby se obě komory měnily najednou po každých volbách?", "Senát se obnovuje po třetinách každé dva roky, takže se nikdy nevymění celý najednou. Vždy v něm zůstane většina zkušených senátorů."],
    explanation: "Delší období a obměna po třetinách dělají ze Senátu stabilní pojistku.",
  }),
  choice("Kdo může zrušit zákon, který odporuje ústavě?", "Ústavní soud", [
    { value: "prezident", why: "Prezident může zákon jen vrátit Sněmovně, zrušit ho nemůže." },
    { value: "Senát", why: "Senát zákony schvaluje, platný zákon rušit nemůže." },
    { value: "starosta", why: "Starosta řídí obec." },
  ], {
    hints: ["Která instituce sídlí v Brně a hlídá, aby zákony byly v souladu s ústavou?", "Tvoří ji patnáct soudců jmenovaných prezidentem se souhlasem Senátu; když zákon odporuje ústavě, může ho zrušit."],
    explanation: "Ústavní soud v Brně ruší zákony, které odporují ústavě.",
  }),
  choice("Co dělá zastupitelstvo obce?", "rozhoduje o věcech obce, třeba o škole a silnicích", [
    { value: "schvaluje zákony pro celou republiku", why: "Zákony schvaluje parlament." },
    { value: "volí prezidenta republiky", why: "Prezidenta volí občané přímo." },
    { value: "velí armádě", why: "Vrchním velitelem armády je prezident." },
  ], {
    hints: ["Zastupitelstvo si volí občané jedné obce. O čem asi rozhoduje?", "Zastupitelé rozhodují, co se v obci postaví nebo opraví a za co obec utratí peníze; volí také starostu."],
    explanation: "Zastupitelstvo rozhoduje o obecních penězích, majetku a službách.",
  }),
  choice("Jak se prezident podílí na vzniku zákonů?", "zákon podepíše, nebo ho vrátí Sněmovně", [
    { value: "zákony sám schvaluje", why: "Schvaluje je parlament." },
    { value: "zákony píše místo parlamentu", why: "Návrhy zákonů podává hlavně vláda a poslanci." },
    { value: "o zákonech nerozhoduje vůbec", why: "Podpis nebo vrácení zákona je jeho pravomoc." },
  ], {
    hints: ["Když parlament zákon schválí, dostane ho ještě někdo k podpisu?", "Prezident má právo zákon vetovat — vrátit ho Sněmovně. Ta ho pak může přehlasovat."],
    explanation: "Prezident zákon podepíše, nebo ho vrátí; vrácený zákon může Sněmovna znovu schválit.",
  }),
  choice("Kdo stojí v čele kraje?", "hejtman", [
    { value: "starosta", why: "Starosta vede obec." },
    { value: "premiér", why: "Premiér vede vládu." },
    { value: "senátor", why: "Senátor zasedá v Senátu." },
  ], {
    hints: ["Kraj má zvolené zastupitelstvo. Kdo stojí v jeho čele?", "Hlava kraje nese staré jméno, kterým se kdysi říkalo i vůdcům husitských vojsk."],
    explanation: "V čele kraje stojí hejtman, kterého volí krajské zastupitelstvo.",
  }),
  choice("Na kolik let se volí zastupitelstvo obce?", "na 4 roky", [
    { value: "na 6 let", why: "Na šest let se volí senátoři." },
    { value: "na 5 let", why: "Na pět let se volí prezident." },
    { value: "na 1 rok", why: "Tak krátké období by obci nedovolilo nic dokončit." },
  ], {
    hints: ["Komunální volby se konají ve stejném rytmu jako volby do Sněmovny.", "Poslanci i zastupitelé obcí a krajů mají stejně dlouhé volební období. Kolik let tedy trvá období Sněmovny?"],
    explanation: "Zastupitelstvo obce se volí na 4 roky, stejně jako Poslanecká sněmovna.",
  }),
];

const L3: PracticeTask[] = [
  choice("Anně je 17 let. Může letos jít k volbám do Sněmovny?", "ne, volit smí až od 18 let", [
    { value: "ano, stačí mít občanský průkaz", why: "Občanský průkaz má každý od 15 let, volit se smí až od 18." },
    { value: "ano, když ji doprovodí rodiče", why: "Za plentou je každý sám a musí být plnoletý." },
    { value: "ne, volit smí až od 21 let", why: "Od 21 let se smí kandidovat do Sněmovny, volit dřív." },
  ], {
    hints: ["Od kolika let se v Česku smí volit?", "Rozhoduje věk v den voleb. Anna by musela být plnoletá."],
    explanation: "Volit smí jen plnoletí občané, tedy od 18 let. Anna musí počkat.",
  }),
  choice("Kolik let musí mít nejméně kandidát na senátora?", "40 let", [
    { value: "18 let", why: "Od 18 let se smí volit." },
    { value: "21 let", why: "Od 21 let se smí kandidovat do Sněmovny." },
    { value: "35 let", why: "Pro Senát je hranice ještě vyšší." },
  ], {
    hints: ["Pro Senát platí vyšší věková hranice než pro Sněmovnu.", "Stejná věková hranice platí i pro kandidáty na prezidenta; je to nejvyšší hranice ze všech voleb v Česku."],
    explanation: "Senátorem i prezidentem se může stát jen člověk, kterému je aspoň 40 let.",
  }),
  choice("Sněmovna vyslovila vládě nedůvěru. Co následuje?", "vláda musí podat demisi", [
    { value: "prezident musí odstoupit", why: "Nedůvěra se týká vlády, ne prezidenta." },
    { value: "Senát se rozpustí", why: "Senát rozpustit nelze." },
    { value: "vláda vládne dál bez změny", why: "Bez důvěry Sněmovny vláda vládnout nemůže." },
  ], {
    hints: ["Co znamená, když většina poslanců vládě přestane věřit?", "Bez důvěry Sněmovny nemůže vláda dál vládnout; prezident pak jmenuje novou."],
    explanation: "Vláda odpovídá Sněmovně; když ztratí její důvěru, musí odstoupit.",
  }),
  choice("Senát zákon zamítl. Může přesto platit?", "ano, když ho Sněmovna znovu schválí", [
    { value: "ne, zamítnutí Senátem je konečné", why: "Sněmovna může Senát přehlasovat." },
    { value: "ano, když ho podepíše premiér", why: "Premiér zákony nepodepisuje místo parlamentu." },
    { value: "ano, když ho schválí Ústavní soud", why: "Ústavní soud zákony neschvaluje." },
  ], {
    hints: ["Která komora parlamentu má při schvalování zákonů poslední slovo?", "Sněmovna může zamítnutí Senátu přehlasovat nadpoloviční většinou všech poslanců."],
    explanation: "Poslední slovo má Sněmovna: zamítnutí Senátem může přehlasovat.",
  }),
  choice("Který z orgánů si občané NEvolí přímo?", "vláda", [
    { value: "Senát", why: "Senátory volí občané ve svém obvodu." },
    { value: "Poslanecká sněmovna", why: "Poslance volí občané v parlamentních volbách." },
    { value: "prezident", why: "Od roku 2013 volí prezidenta občané přímo." },
  ], {
    hints: ["Vzpomeň si, kdo jmenuje premiéra a ministry.", "Občané volí parlament, zastupitelstva i prezidenta. Jeden orgán ale vzniká jmenováním."],
    explanation: "Vládu občané nevolí: premiéra a ministry jmenuje prezident a vláda pak potřebuje důvěru Sněmovny.",
  }),
  choice("Proč komunistický režim nebyl demokracií?", "volby nebyly svobodné a vládla jedna strana", [
    { value: "protože se nevolil prezident", why: "Prezidenta formálně volilo Národní shromáždění — problém byl jinde." },
    { value: "protože neexistoval parlament", why: "Parlament existoval, ale jen schvaloval, co chtěla komunistická strana." },
    { value: "protože vládl král", why: "Československo bylo za komunismu republikou." },
  ], {
    hints: ["Mohli lidé před rokem 1989 ve volbách vybírat mezi více stranami?", "Kandidáty schvalovala komunistická strana a výsledek voleb byl předem daný. Opozice byla zakázaná a kritici režimu byli pronásledováni."],
    explanation: "Bez svobodných voleb a bez soutěže stran nemůže být demokracie.",
  }),
  choice("Petr chce, aby se v obci postavilo nové hřiště. Na koho se obrátí?", "na zastupitelstvo obce", [
    { value: "na Senát", why: "Senát o obecních stavbách nerozhoduje." },
    { value: "na prezidenta", why: "Prezident o hřištích v obcích nerozhoduje." },
    { value: "na Ústavní soud", why: "Ústavní soud posuzuje zákony." },
  ], {
    hints: ["Kdo rozhoduje o tom, co se v obci postaví?", "O obecních penězích a stavbách rozhodují lidé zvolení v komunálních volbách."],
    explanation: "O stavbách v obci rozhoduje zastupitelstvo; Petr může přijít na jeho veřejné zasedání.",
  }),
  choice("Prezident zákon vrátil. Co může Sněmovna udělat?", "znovu ho schválit a veto přehlasovat", [
    { value: "nic, zákon je zrušený", why: "Vrácený zákon lze znovu schválit." },
    { value: "požádat Senát o nového prezidenta", why: "Senát prezidenta nevolí ani neodvolává kvůli vetu." },
    { value: "dát zákon podepsat premiérovi", why: "Premiér nemůže nahradit podpis prezidenta." },
  ], {
    hints: ["Má prezident u zákonů poslední slovo?", "Vrácený zákon platí, když ho Sněmovna odhlasuje ještě jednou nadpoloviční většinou všech poslanců."],
    explanation: "Prezidentské veto může Sněmovna přehlasovat, a zákon pak platí.",
  }),
  choice("Kolik senátorů se volí každé dva roky?", "27", [
    { value: "81", why: "Všech 81 senátorů se najednou nevolí." },
    { value: "40", why: "Volí se třetina, ne polovina." },
    { value: "200", why: "200 je počet poslanců." },
  ], {
    hints: ["Senát se neobměňuje celý najednou, ale po částech.", "Každé dva roky se volí třetina ze všech 81 senátorů. Vyděl 81 třemi."],
    explanation: "Senát se obnovuje po třetinách: každé dva roky 27 senátorů.",
  }),
  choice("Premiér podal demisi. Kdo jmenuje nového premiéra?", "prezident", [
    { value: "Senát", why: "Senát premiéra nejmenuje." },
    { value: "odstupující premiér", why: "Nástupce si premiér vybrat nemůže." },
    { value: "Ústavní soud", why: "Ústavní soud premiéra nejmenuje." },
  ], {
    hints: ["Kdo jmenoval i předchozího premiéra?", "Premiéra jmenuje hlava státu — obvykle po jednání s vítězi voleb do Sněmovny."],
    explanation: "Premiéra jmenuje prezident; nová vláda pak žádá Sněmovnu o důvěru.",
  }),
  choice("Proč musí mít vláda důvěru Sněmovny?", "aby ji kontrolovali zástupci zvolení lidmi", [
    { value: "protože Sněmovna řídí ministerstva", why: "Ministerstva řídí ministři, ne poslanci." },
    { value: "protože vládu platí Senát", why: "Senát vládu neplatí ani nekontroluje." },
    { value: "protože je to jen tradice", why: "Je to pravidlo ústavy, ne jen zvyk." },
  ], {
    hints: ["Kdo koho v demokracii kontroluje: vláda Sněmovnu, nebo Sněmovna vládu?", "Poslance zvolili lidé; když vláda jedná proti vůli většiny, Sněmovna ji může odvolat."],
    explanation: "Důvěra Sněmovny zajišťuje, že vládu kontrolují zástupci zvolení občany.",
  }),
  choice("Kolik let musí mít nejméně kandidát na poslance?", "21 let", [
    { value: "18 let", why: "Od 18 let se smí volit, kandidovat až později." },
    { value: "40 let", why: "40 let je hranice pro Senát a prezidenta." },
    { value: "25 let", why: "Hranice je o něco nižší." },
  ], {
    hints: ["Kandidovat do Sněmovny smíš o něco později, než smíš volit.", "Volit smíš od 18 let, kandidovat do Sněmovny o tři roky později. Přičti tři roky k věku, od kterého se volí."],
    explanation: "Poslancem se může stát občan, kterému je aspoň 21 let.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const VOLBYZASTUPITELSKEORGANYCRPREZIDENTVLADA: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-kolem-nas-demokracie-a-stat-volby-zastupitelske-organy-cr-prezident-vlada",
    rvpNodeId: "g5-vlastiveda-lide-kolem-nas-demokracie-a-stat-volby-zastupitelske-organy-cr-prezident-vlada",
    title: "Volby, zastupitelské orgány ČR, prezident, vláda",
    studentTitle: "Volby a parlament",
    subject: "vlastivěda",
    category: "Lidé kolem nás",
    topic: "Demokracie a stát",
    briefDescription: "Pochopíš, jak funguje demokracie a kdo řídí Česko.",
    keywords: ["volby", "parlament", "sněmovna", "senát", "prezident", "vláda", "demokracie", "dělba moci"],
    goals: [
      "Žák popíše strukturu parlamentu ČR (Sněmovna, Senát)",
      "Žák vysvětlí roli prezidenta a vlády",
      "Žák chápe princip tajného hlasování a dělby moci",
    ],
    boundaries: ["Detailní volební systémy (d'Hondtova metoda)", "Mezinárodní srovnání systémů"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Sněmovna má 200 poslanců (4 roky), Senát má 81 senátorů (6 let), prezident volen na 5 let.",
      steps: [
        "Parlament = Sněmovna (200, 4 r.) + Senát (81, 6 let)",
        "Prezident = hlava státu, přímá volba, 5 let",
        "Vláda = výkonná moc, odpovědná Sněmovně",
        "Tajné hlasování = ochrana svobody",
        "Dělba moci = zákonodárná + výkonná + soudní",
      ],
      commonMistake: "Zaměňování počtu poslanců (200) a senátorů (81).",
      example: "Vláda potřebuje důvěru Sněmovny — jinak musí odstoupit.",
    },
  },
];
