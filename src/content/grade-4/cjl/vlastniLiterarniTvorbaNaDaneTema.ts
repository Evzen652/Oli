import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Původně L3 jen míchala L1 a L2,
// objevovaly se pojmy nad rámec 1. stupně („show, don't tell“,
// „brainstorming“, „metafora“, „kompozice“) a hranice tématu je vylučovaly
// („Bez pokročilých literárních technik“). Téma teď cvičí to, co dítě
// při psaní vlastního příběhu opravdu dělá: plán, nadpis, oživení textu,
// obměnu opakovaných slov a kontrolu hotového textu. Stavbu vypravování
// a zápis přímé řeči procvičuje samostatné téma o vypravování.
//
// L1 = co autor dělá a proč · L2 = vyber lepší větu, nadpis, slovo
// L3 = poraď, co zlepšit, a naplánuj vlastní text.

const L1: PracticeTask[] = [
  choice("Co je osnova?", "plán, podle kterého text napíšeš", [
    { value: "hotový text přepsaný načisto", why: "Načisto se přepisuje až hotový text, osnova je plán předem." },
    { value: "seznam všech postav", why: "Postavy v osnově být mohou, ale osnova je plán celého děje." },
    { value: "nadpis příběhu", why: "Nadpis je jen název, ne plán." },
  ], {
    hints: ["Co si připravíš dřív, než začneš psát?", "Osnova je jako mapa na výlet: v bodech řekne, co bude na začátku, co se pak stane a jak to skončí."],
    explanation: "Osnova je plán textu v bodech — podle ní pak píšeš, aby děj šel po sobě a nic nechybělo.",
  }),
  choice("Kdy si osnovu píšeš?", "před psaním textu", [
    { value: "až po odevzdání", why: "Po odevzdání už plán k ničemu není." },
    { value: "místo nadpisu", why: "Osnova nadpis nenahrazuje." },
    { value: "jen u básniček", why: "Osnova se hodí hlavně k vyprávění příběhu." },
  ], {
    hints: ["K čemu je plán, který vznikne až potom?", "Osnova má pomoct při psaní — proto musí být hotová dřív, než začneš psát samotný text."],
    explanation: "Osnovu si napíšeme předem, abychom při psaní věděli, co přijde dál.",
  }),
  choice("Čím text nejlépe oživíš?", "přímou řečí postav", [
    { value: "opakováním stejného slova", why: "Opakování text naopak nudí." },
    { value: "samými čísly", why: "Čísla příběh neoživí." },
    { value: "dlouhými větami bez teček", why: "Takové věty se špatně čtou." },
  ], {
    hints: ["Kdy je příběh zajímavější — když o postavách jen čteš, nebo když je slyšíš mluvit?", "Když postavy promluví vlastními slovy v uvozovkách, čtenář je „slyší“, pozná jejich povahu a příběh ožije."],
    explanation: "Přímá řeč nechá postavy promluvit a příběh tím ožije.",
  }),
  choice("Který nadpis se nejlépe hodí k příběhu o psovi, který se ztratil a zase našel?", "Hledání Alíka", [
    { value: "Pes", why: "Je příliš obecný — nic neprozradí a nezaujme." },
    { value: "Příběh", why: "Takový nadpis se hodí ke všemu, tedy k ničemu." },
    { value: "Jak se Alík ztratil, my ho hledali a nakonec našli", why: "Je dlouhý a prozradí celý děj." },
  ], {
    hints: ["Jaký nadpis zaujme, ale neprozradí konec?", "Dobrý nadpis je krátký, souvisí s příběhem a vzbudí zvědavost. Nemá být obecný ani vyzradit, jak to dopadne."],
    explanation: "„Hledání Alíka“ je krátké, souvisí s dějem a neprozradí konec.",
  }),
  choice("Proč text dělíš do odstavců?", "každá část děje má svůj odstavec", [
    { value: "aby se ušetřil papír", why: "Odstavce papír neušetří, jde o přehlednost." },
    { value: "protože to vypadá delší", why: "Nejde o délku, ale o to, aby se text dobře četl." },
    { value: "aby se nemusely psát tečky", why: "Tečky za větami píšeme i v odstavcích." },
  ], {
    hints: ["Jak se čte příběh, který je jeden dlouhý blok bez mezer?", "Když se v příběhu něco změní (začne problém, přijde nová scéna), začneš psát od nového řádku. Čtenář tak pozná, že se něco změnilo."],
    explanation: "Každá část děje má svůj odstavec, takže se text dobře čte a je přehledný.",
  }),
  choice("Čím nahradíš slovo, které se v textu pořád opakuje?", "slovem s podobným významem", [
    { value: "slovem s opačným významem", why: "Opačný význam by změnil smysl věty." },
    { value: "tím samým slovem tučně", why: "Opakování tím nezmizí." },
    { value: "číslem", why: "Číslo slovo nenahradí." },
  ], {
    hints: ["Jak jinak říct „šel“, aby se neopakovalo? Kráčel, ubíral se…", "Slova jako šel — kráčel — vydal se znamenají skoro totéž. Když je v textu střídáš, zní pestřeji a smysl věty se nezmění."],
    explanation: "Opakované slovo nahradíme slovem s podobným významem, třeba „šel“ → „kráčel“.",
  }),
  choice("Které slovo oživí větu „Na kopci stál ___ hrad.“?", "starobylý", [
    { value: "běžel", why: "„Běžel“ je sloveso — děj. „Stál běžel hrad“ nedává smysl." },
    { value: "rychle", why: "„Rychle“ říká, jak se něco děje. K hradu se nehodí." },
    { value: "tři", why: "„Tři hrad“ nedává smysl — k jednomu hradu číslo nepatří." },
  ], {
    hints: ["Jaký byl ten hrad? Hledej slovo, které odpoví na otázku „jaký?“", "Představu zpřesní přídavné jméno, které popíše vlastnost hradu — třeba jak je starý nebo velký."],
    explanation: "Přídavné jméno „starobylý“ odpovídá na otázku „jaký?“ a čtenář si hrad lépe představí.",
  }),
  choice("O čem se ti bude nejlépe psát?", "o tom, co znáš nebo co tě baví", [
    { value: "o tom, o čem nic nevíš", why: "Bez znalostí nebudeš mít nápady." },
    { value: "o tom, co je nejdelší", why: "Délka tématu nápady nepřinese." },
    { value: "o čemkoli, co vybere los", why: "Náhodné téma nemusí nabídnout žádné nápady." },
  ], {
    hints: ["Kdy máš nejvíc nápadů?", "O tom, co tě zajímá nebo co jsi zažil či zažila, víš hodně podrobností — a text je pak živý."],
    explanation: "Nejlépe se píše o tom, co známe nebo co nás baví — máme dost nápadů a podrobností.",
  }),
  choice("Co uděláš s hotovým textem, než ho odevzdáš?", "přečtu ho a opravím chyby", [
    { value: "hned ho zahodím", why: "Pak by práce přišla vniveč." },
    { value: "přepíšu ho celý jinak", why: "Stačí opravit, co nesedí, ne psát znovu." },
    { value: "nic, první verze je vždy nejlepší", why: "I spisovatelé své texty opravují." },
  ], {
    hints: ["Co dělají spisovatelé, než pošlou knihu do tiskárny?", "Při kontrole hledáš chyby v pravopisu i místa, kde věta nedává smysl nebo něco chybí."],
    explanation: "Hotový text si přečteme a opravíme chyby i místa, kde věta nedává smysl.",
  }),
  choice("Co je přirovnání?", "srovnání pomocí slova „jako“", [
    { value: "otázka na konci textu", why: "Otázka přirovnání není." },
    { value: "nadpis příběhu", why: "Nadpis je název textu." },
    { value: "seznam postav", why: "Seznam postav nic nepřirovnává." },
  ], {
    hints: ["Jak se řekne, že někdo běží velmi rychle, pomocí větru?", "Přirovnání spojí dvě věci slůvkem, které znáš z „silný … medvěd“ nebo „rychlý … vítr“."],
    explanation: "Přirovnání srovná dvě věci slovem „jako“: rychlý jako vítr, silný jako medvěd.",
  }),
  choice("Které přirovnání se hodí k velmi rychlému běhu?", "běžel jako vítr", [
    { value: "běžel jako šnek", why: "Šnek je pomalý — přirovnání by znamenalo opak." },
    { value: "běžel jako kámen", why: "Kámen neběží, přirovnání nedává smysl." },
    { value: "běžel jako polévka", why: "Polévka s rychlostí nesouvisí." },
  ], {
    hints: ["Co je velmi rychlé?", "Přirovnání funguje, když obě věci mají stejnou vlastnost. Hledej něco, co je známé svou rychlostí."],
    explanation: "Vítr je rychlý, proto „běžel jako vítr“ znamená, že běžel velmi rychle.",
  }),
  choice("Co udělá dobrý konec příběhu?", "uzavře, jak to celé dopadlo", [
    { value: "začne nový příběh", why: "Konec má příběh uzavřít, ne začínat jiný." },
    { value: "skončí uprostřed věty", why: "Čtenář by nevěděl, jak to dopadlo." },
    { value: "zopakuje úvod slovo od slova", why: "Opakování úvodu nic neuzavře." },
  ], {
    hints: ["Co chce čtenář vědět na konci?", "Na konci se vyřeší problém, kvůli kterému se příběh rozjel. Čtenář se dozví, jak to dopadlo."],
    explanation: "Dobrý konec uzavře příběh — řekne, jak se problém vyřešil a jak to dopadlo.",
  }),
  choice("Proč si před psaním zapíšeš všechny nápady?", "aby bylo z čeho vybírat", [
    { value: "aby byl text hned hotový", why: "Nápady nejsou hotový text, je to začátek práce." },
    { value: "protože se zapisují na známku", why: "Nápady jsou pro tebe, ne na známku." },
    { value: "aby se nemusel psát text", why: "Text se napsat musí — nápady k němu jen pomáhají." },
  ], {
    hints: ["Co uděláš, když máš deset nápadů a místo jen na tři?", "Když si nápady zapíšeš, nic ti neuteče a pak si z nich vybereš ty nejlepší do osnovy."],
    explanation: "Zapsané nápady nezapomeneme a můžeme z nich vybrat ty nejlepší.",
  }),
];

const L2: PracticeTask[] = [
  choice("Která věta je nejživější?", "Pes radostně vyskočil a olízl mi tvář.", [
    { value: "Pes tam byl a byl to pes.", why: "Věta opakuje slovo a nic neukáže." },
    { value: "Pes udělal nějakou věc.", why: "„Nějakou věc“ čtenáři nic neřekne." },
    { value: "Byl tam pes.", why: "Věta je správně, ale holá — nic se neděje." },
  ], {
    hints: ["Ve které větě vidíš, co přesně pes dělá a jak?", "Živá věta má konkrétní děj a slova, která popíšou jak (radostně, rychle). Holé „byl tam pes“ nic neukáže."],
    explanation: "„Pes radostně vyskočil a olízl mi tvář“ ukáže konkrétní děj i náladu — je nejživější.",
  }),
  choice("V textu stojí „Petr šel domů. Petr byl unavený. Petr si lehl.“ Jak ho vylepšíš?", "Petr šel domů. Byl unavený, a tak si lehl.", [
    { value: "Petr šel domů. Petr byl unavený. Petr si lehl. Petr.", why: "Opakování se tím ještě zhoršilo." },
    { value: "Šel. Byl. Lehl.", why: "Věty ztratily smysl — nevíme kdo, kam ani proč." },
    { value: "Petr Petr šel domů unavený lehl.", why: "Věta nedává smysl." },
  ], {
    hints: ["Musíš jméno Petr opakovat v každé větě?", "Když čtenář ví, o kom je řeč, můžeš jméno vynechat nebo věty spojit spojkou. Smysl zůstane, opakování zmizí."],
    explanation: "Jméno stačí jednou, pak ho vynecháme a věty propojíme: Petr šel domů. Byl unavený, a tak si lehl.",
  }),
  choice("Která věta obsahuje přímou řeč?", "„Pojď si hrát!“ zavolala Anna.", [
    { value: "Anna zavolala, že si má jít hrát.", why: "To je nepřímá řeč — vypravěč jen převypráví, co Anna řekla." },
    { value: "Anna si šla hrát.", why: "Tady nikdo nemluví." },
    { value: "Anna byla veselá a hravá.", why: "To je popis Anny, ne její slova." },
  ], {
    hints: ["Ve které větě slyšíš přesná slova, která postava vyslovila?", "Přímá řeč jsou doslovná slova postavy v uvozovkách. Když vypravěč jen řekne, co postava říkala, je to nepřímá řeč."],
    explanation: "„Pojď si hrát!“ jsou přesná slova Anny v uvozovkách — to je přímá řeč.",
  }),
  choice("Čím nahradíš „řekl“, aby bylo jasné, že postava mluvila potichu?", "zašeptal", [
    { value: "zakřičel", why: "Křik je hlasitý, opak ticha." },
    { value: "zazpíval", why: "Zpěv neříká, že mluvil potichu." },
    { value: "zaštěkal", why: "Štěkají psi, ne lidé." },
  ], {
    hints: ["Jak mluvíš, když nechceš, aby tě někdo slyšel?", "Místo obecného „řekl“ můžeš napsat sloveso, které ukáže, jak postava mluví — nahlas, potichu, zpěvem…"],
    explanation: "„Zašeptal“ ukáže, že postava mluvila potichu. Tím je text přesnější než s pouhým „řekl“.",
  }),
  choice("Které slovo udělá z věty „Byl to ___ západ slunce.“ nejsilnější představu?", "nádherný", [
    { value: "ošklivý", why: "To by změnilo smysl — západ slunce chceme popsat jako krásný." },
    { value: "rychlý", why: "Rychlost k západu slunce nepatří." },
    { value: "malý", why: "Západ slunce se velikostí nepopisuje." },
  ], {
    hints: ["Jaký byl západ slunce, když se na něj všichni dívali s otevřenou pusou?", "Silné přídavné jméno vyjádří víc než obyčejné „hezký“. Musí se ale k západu slunce hodit."],
    explanation: "„Nádherný“ je silnější než „hezký“ a k západu slunce se hodí.",
  }),
  choice("Jaký bod chybí v osnově? 1. Jedeme na tábor. 2. ??? 3. Hledáme cestu zpátky. 4. Večer jsme v táboře.", "V lese se ztratíme.", [
    { value: "Balíme kufry.", why: "Balení je před odjezdem, ne mezi příjezdem a hledáním cesty." },
    { value: "Večer jsme v táboře.", why: "To už je čtvrtý bod." },
    { value: "Konec.", why: "Konec není událost — a je až na konci." },
  ], {
    hints: ["Proč by v bodě 3 museli hledat cestu zpátky?", "Mezi odjezdem a hledáním cesty se musí stát něco, co příběh rozhýbe — nějaký problém."],
    explanation: "Aby museli hledat cestu zpátky, musí se nejdřív ztratit. Chybí zápletka: V lese se ztratíme.",
  }),
  choice("Který nadpis zaujme a přitom neprozradí konec?", "Tajemství staré půdy", [
    { value: "Jak jsme na půdě našli truhlu s dopisy od pradědečka", why: "Prozradí celý děj včetně konce." },
    { value: "Půda", why: "Je příliš obecný a nezaujme." },
    { value: "Můj sloh", why: "S příběhem nesouvisí." },
  ], {
    hints: ["Který nadpis vzbudí zvědavost, co se stane?", "Dobrý nadpis naznačí, o čem příběh bude, ale nechá čtenáře hádat, jak to dopadne."],
    explanation: "„Tajemství staré půdy“ vzbudí zvědavost a neprozradí, co se na půdě našlo.",
  }),
  choice("Jak ukážeš, že má postava strach, aniž bys napsal nebo napsala „měl strach“?", "Třásly se mu ruce a srdce mu bušilo.", [
    { value: "Měl hodně velký strach.", why: "Tady je strach jen řečený, ne ukázaný." },
    { value: "Byl to strach.", why: "Věta strach jen pojmenuje." },
    { value: "Strach, strach, strach.", why: "Opakování slova strach neukáže." },
  ], {
    hints: ["Jak poznáš na kamarádovi, že se bojí, i když to neřekne?", "Místo pojmenování pocitu popiš, co postava dělá nebo co se děje s jejím tělem. Čtenář si pocit domyslí sám."],
    explanation: "Třesoucí se ruce a bušící srdce strach ukážou — čtenář si ho domyslí a text je živější.",
  }),
  choice("Jak vylepšíš začátek „Byl jednou jeden den.“?", "Ten den začal tím, že nám z klece uletěl papoušek.", [
    { value: "Byl jednou jeden den a byl to den.", why: "Opakování nic nepřidá." },
    { value: "Byl den.", why: "Dvě slova nezaujmou a nic neřeknou." },
    { value: "Na konci jsme šli spát.", why: "To je konec, ne začátek." },
  ], {
    hints: ["Který začátek tě donutí číst dál?", "Dobrý začátek hned naznačí, že se něco zajímavého stane. Obecné „byl jeden den“ čtenáře nezaujme."],
    explanation: "Začátek s konkrétní událostí (uletěl papoušek) čtenáře hned vtáhne do děje.",
  }),
  choice("Co v textu kontroluješ nejdřív?", "jestli dává smysl a nic nechybí", [
    { value: "barvu pera", why: "Barva pera obsah textu nezlepší." },
    { value: "počet stránek", why: "Počet stránek o kvalitě nic neříká." },
    { value: "jestli je nadpis tučně", why: "Vzhled nadpisu je vedlejší." },
  ], {
    hints: ["Co je důležitější — jak text vypadá, nebo jestli se dá pochopit?", "Nejdřív zkontroluj, jestli děj jde po sobě a čtenář všemu rozumí. Až potom pravopis a úpravu."],
    explanation: "Nejdřív kontrolujeme, jestli text dává smysl a nic v něm nechybí, potom pravopis.",
  }),
  choice("Které přirovnání se hodí k velmi tichému místu?", "ticho jako v kostele", [
    { value: "ticho jako na koncertě", why: "Na koncertě hraje hudba, ticho tam není." },
    { value: "ticho jako na hřišti o přestávce", why: "O přestávce je na hřišti hluk." },
    { value: "ticho jako v továrně", why: "V továrně hučí stroje." },
  ], {
    hints: ["Kde bývá opravdu velké ticho?", "Přirovnání funguje, když má věc, se kterou srovnáváš, stejnou vlastnost — tady ticho."],
    explanation: "V kostele bývá velké ticho, proto „ticho jako v kostele“ znamená úplné ticho.",
  }),
  choice("Kterou větou nejlépe popíšeš prostředí?", "V lese vonělo jehličí a pod nohama praskaly větvičky.", [
    { value: "V lese bylo hodně stromů a keřů.", why: "Věta je pravdivá, ale čtenář si nic nepředstaví." },
    { value: "Les byl velký les a byl tam les.", why: "Věta nic nepopíše, jen opakuje slovo." },
    { value: "Šli jsme lesem a potom jsme šli domů.", why: "To je děj, ne popis prostředí." },
  ], {
    hints: ["Ve které větě les cítíš a slyšíš?", "Popis ožije, když zapojíš smysly: co voní, co je slyšet, co cítíš na kůži."],
    explanation: "Vůně jehličí a praskání větviček zapojí smysly — čtenář se v lese ocitne s tebou.",
  }),
  choice("Jaký konec se hodí k příběhu o psovi, který se ztratil?", "Alík se schoulil v pelechu a my si konečně oddychli.", [
    { value: "Najednou se Alík ztratil a nikde nebyl.", why: "To je zápletka, začátek problému." },
    { value: "Byl jednou jeden pes, jmenoval se Alík.", why: "To je úvod." },
    { value: "Alík štěkal na kočku u sousedů.", why: "Věta nic neuzavírá." },
  ], {
    hints: ["Která věta řekne, jak celá věc dopadla?", "Konec vyřeší problém ze zápletky. Pes se ztratil — konec má říct, že je zase doma."],
    explanation: "Věta o psovi v pelechu uzavírá příběh: problém je vyřešený a všichni si oddychli.",
  }),
];

const L3: PracticeTask[] = [
  choice("Máš napsat příběh na téma „Nejlepší den“. Co uděláš jako první?", "sepíšu nápady a udělám osnovu", [
    { value: "napíšu rovnou závěr", why: "Závěr bez plánu nevíš, k čemu vede." },
    { value: "vymyslím nadpis a dál nic", why: "Nadpis je jen začátek práce." },
    { value: "opíšu příběh kamaráda", why: "Opisovat nejde — má to být tvůj příběh." },
  ], {
    hints: ["Co potřebuješ, abys věděl nebo věděla, co psát?", "Nejdřív nápady, z nich vybereš ty nejlepší a seřadíš je do plánu. Teprve pak se píše."],
    explanation: "Nejdřív si zapíšeme nápady a uděláme osnovu, podle které pak píšeme.",
  }),
  choice("V textu je pětkrát slovo „pak“. Co s tím?", "část z nich nahradím slovy potom, nato, nakonec", [
    { value: "přidám další „pak“, aby to sedělo", why: "Opakování by bylo ještě horší." },
    { value: "všechna „pak“ smažu a nic nedám", why: "Zmizelo by pořadí událostí." },
    { value: "text rozdělím na pět nadpisů", why: "Nadpisy opakování nevyřeší." },
  ], {
    hints: ["Jaká jiná slova řeknou, co bylo dál?", "Pořadí událostí potřebujeme, jen ne pořád stejným slovem. Časová slova se dají střídat."],
    explanation: "Opakované „pak“ střídáme jinými časovými slovy (potom, nato, nakonec), pořadí zůstane jasné.",
  }),
  choice("Která osnova má úvod, zápletku, vyvrcholení i závěr?", "cesta k babičce – prasklá pneumatika – výměna kola v dešti – babiččino přivítání", [
    { value: "cesta k babičce – oběd u babičky – procházka – odjezd domů", why: "Nic se nestane — chybí zápletka i vyvrcholení." },
    { value: "prasklá pneumatika – výměna kola v dešti – přivítání", why: "Chybí úvod — nevíme, kdo kam jel." },
    { value: "výměna kola v dešti – cesta k babičce – prasklá pneumatika – přivítání", why: "Pořadí nesedí — kolo se měnilo až po defektu." },
  ], {
    hints: ["Který příběh má začátek, problém, napínavou chvíli i konec?", "Úvod řekne, kdo a kam, zápletka přinese problém, vyvrcholení je nejnapínavější chvíle a závěr vyřeší, jak to dopadlo."],
    explanation: "Jen tato osnova má všechny čtyři části ve správném pořadí: úvod (cesta), zápletku (pneumatika), vyvrcholení (výměna v dešti) a závěr (přivítání).",
  }),
  choice("Kamarád má v textu větu „Byl to dobrý den a bylo to dobré.“ Jak mu poradíš?", "ať napíše, co přesně se stalo", [
    { value: "ať „dobré“ zopakuje ještě jednou", why: "Opakování by větu ještě zhoršilo." },
    { value: "ať větu smaže a nic nenapíše", why: "Pak by v textu chybělo, co se stalo." },
    { value: "ať ji napíše velkými písmeny", why: "Velká písmena obsah nezlepší." },
  ], {
    hints: ["Co se čtenář z věty „bylo to dobré“ dozví?", "Obecné „dobrý“ nic neukáže. Konkrétní událost (vyhráli jsme zápas, dostal jsem psa) řekne, proč byl den dobrý."],
    explanation: "Místo obecného „dobrý“ poradíme napsat, co konkrétně se stalo — to čtenáře zaujme.",
  }),
  choice("Chceš, aby čtenář cítil napětí. Která věta to udělá nejlépe?", "Najednou za námi zapraskala větev. Někdo tam byl.", [
    { value: "Potom jsme pomalu šli dál po cestě.", why: "Nic se neděje, napětí nevzniká." },
    { value: "Bylo to hodně napínavé a strašidelné.", why: "Napětí je jen řečené, ne ukázané." },
    { value: "Les byl velký, zelený a tichý.", why: "To je popis, ne napětí." },
  ], {
    hints: ["Při které větě by ses otočil nebo otočila?", "Napětí vznikne, když se stane něco nečekaného a čtenář neví, co přijde. Krátké věty napětí ještě zvýší."],
    explanation: "Nečekaný zvuk a krátká věta „Někdo tam byl.“ vytvoří napětí — čtenář chce vědět, co bude dál.",
  }),
  choice("Který nadpis se hodí k příběhu o první samostatné cestě vlakem?", "Moje první cesta", [
    { value: "Vlak", why: "Je příliš obecný." },
    { value: "Jak jsem jel vlakem do Prahy a zpátky a bylo to dlouhé", why: "Je dlouhý a prozradí celý děj." },
    { value: "Pondělí", why: "S cestou nesouvisí." },
  ], {
    hints: ["Který nadpis je krátký, souvisí s příběhem a nic neprozradí?", "Nadpis má naznačit, o čem to bude, a vzbudit zvědavost. Obecné slovo ani celý děj v nadpisu nefungují."],
    explanation: "„Moje první cesta“ je krátký, souvisí s příběhem a nic neprozradí.",
  }),
  choice("Proč je dobré přečíst si hotový text nahlas?", "uslyším, kde věta nedává smysl", [
    { value: "text se tím prodlouží", why: "Čtením se text neprodlouží." },
    { value: "je to povinné", why: "Není to povinnost, ale dobrý pomocník." },
    { value: "text se tím sám opraví", why: "Opravit ho musíš ty." },
  ], {
    hints: ["Čeho si všimneš, když slyšíš vlastní text?", "Když čteš nahlas, zadrhneš se na místech, která nesedí nebo kde chybí slovo. Očima to snadno přehlédneš."],
    explanation: "Při hlasitém čtení uslyšíme, kde věta nedává smysl nebo kde něco chybí.",
  }),
  choice("Postava je smutná. Která věta to ukáže, a ne jen řekne?", "Sedla si do kouta a mlčky se dívala z okna.", [
    { value: "Byla smutná.", why: "Smutek je jen řečený." },
    { value: "Byla hodně moc smutná.", why: "Pořád jen řečeno, žádný obraz." },
    { value: "Smutek.", why: "Jedno slovo nic neukáže." },
  ], {
    hints: ["Jak se chová člověk, když je smutný?", "Místo slova „smutná“ popiš, co postava dělá. Čtenář si pocit domyslí sám a víc ho to zasáhne."],
    explanation: "Sezení v koutě a mlčení smutek ukážou — čtenář ho pozná, i když slovo „smutná“ nepadne.",
  }),
  choice("Který odstavec do příběhu o výletě na hrad nepatří?", "Doma máme novou pračku.", [
    { value: "Ráno jsme vyrazili autobusem na Karlštejn.", why: "To je úvod výletu — patří tam." },
    { value: "Na nádvoří nám průvodce vyprávěl o Karlu IV.", why: "To je součást výletu." },
    { value: "Večer jsme unavení usnuli v autobuse.", why: "To je závěr výletu." },
  ], {
    hints: ["Která věta s výletem na hrad vůbec nesouvisí?", "Všechno v příběhu má souviset s tématem. Co s výletem nesouvisí, čtenáře jen zmate."],
    explanation: "Nová pračka s výletem na hrad nesouvisí — do příběhu nepatří.",
  }),
  choice("Jak zapojíš smysly do popisu pekárny?", "Voněl čerstvý chleba a z trouby sálalo teplo.", [
    { value: "V pekárně bylo hodně chleba a rohlíků.", why: "Pravda, ale nic necítíš." },
    { value: "Pekárna je obchod, kde se prodává pečivo.", why: "To je vysvětlení, ne popis." },
    { value: "Šli jsme do pekárny a koupili rohlíky.", why: "To je děj, ne popis." },
  ], {
    hints: ["Co v pekárně ucítíš a co ucítíš na kůži?", "Popis se smysly říká, co voní, co je slyšet, co je teplé nebo měkké. Čtenář pak v pekárně stojí s tebou."],
    explanation: "Vůně chleba a teplo z trouby zapojí čich a hmat — popis ožije.",
  }),
  choice("Kterou větou čtenáři přiblížíš, jak velký byl pes?", "Pes byl velký jako tele.", [
    { value: "Pes byl pes.", why: "Věta nic neřekne." },
    { value: "Pes byl nějak velký.", why: "„Nějak“ je neurčité." },
    { value: "Pes měl jméno Rex.", why: "Jméno o velikosti nic neřekne." },
  ], {
    hints: ["S čím můžeš psa porovnat, aby si čtenář představil jeho velikost?", "Přirovnání ke známé věci, kterou si každý umí představit (třeba k medvědovi nebo k teleti), dá čtenáři přesnou představu o velikosti."],
    explanation: "Přirovnání „velký jako tele“ čtenáři ukáže, jak velký pes byl.",
  }),
  choice("Co uděláš, když zjistíš, že příběh nemá žádný problém ani napětí?", "přidám zápletku, která děj rozhýbe", [
    { value: "přidám další nadpis", why: "Nadpis napětí nepřinese." },
    { value: "zkrátím závěr", why: "Kratší závěr zápletku nenahradí." },
    { value: "nic, napětí není potřeba", why: "Bez zápletky se v příběhu nic neděje." },
  ], {
    hints: ["Proč je příběh bez problému nudný?", "Příběh se rozhýbe, když se objeví problém nebo nečekaná událost. Tu je potřeba vymyslet a přidat."],
    explanation: "Bez zápletky se v příběhu nic neděje. Přidáme problém, který děj rozhýbe.",
  }),
  choice("Spolužačka napsala příběh úplně bez přímé řeči. Jak jí poradíš?", "ať nechá postavy promluvit", [
    { value: "ať přidá víc čísel", why: "Čísla příběh neoživí." },
    { value: "ať text zkrátí na jednu větu", why: "Tím by příběh zmizel." },
    { value: "ať smaže přídavná jména", why: "Přídavná jména text naopak oživují." },
  ], {
    hints: ["Co příběh oživí, když postavy jen mlčí?", "Když postavy promluví vlastními slovy v uvozovkách, čtenář je slyší a lépe je pozná."],
    explanation: "Poradíme přidat přímou řeč — postavy promluví a příběh ožije.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const VLASTNILITERARNITVORBANADANETEMA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-tvorba-na-dane-tema",
    rvpNodeId: "g4-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-tvorba-na-dane-tema",
    displayName: "Vlastní tvorba",
    title: "Vlastní literární tvorba na dané téma",
    studentTitle: "Píšu svůj příběh",
    illustrationDesc: "usmívající se dítě sedí u dřevěného stolu a píše vlastní příběh tužkou do otevřeného sešitu, nad jeho hlavou myšlenková bublina s malým rytířem a drakem, vedle stolu komínek barevných knih a kelímek s tužkami",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Naučíš se psát vlastní příběh s osnovou, popisem a přímou řečí.",
    keywords: ["vlastní tvorba", "osnova", "nadpis", "přímá řeč", "přirovnání", "popis", "kontrola textu"],
    goals: [
      "Naplánovat příběh pomocí nápadů a osnovy",
      "Oživit text přímou řečí, přídavnými jmény a přirovnáním",
      "Najít v hotovém textu, co zlepšit",
    ],
    boundaries: ["Bez pokročilých literárních technik", "Bez esejů a odborných textů"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka"],
    generator: gen,
    helpTemplate: {
      hint: "Nápady → osnova → psaní → oživení (přímá řeč, přídavná jména, přirovnání) → kontrola",
      steps: [
        "Zapiš si nápady a vyber ty nejlepší.",
        "Seřaď je do osnovy (úvod → zápletka → vyvrcholení → závěr).",
        "Piš a oživ text přímou řečí, přídavnými jmény a přirovnáním.",
        "Přečti si text nahlas a oprav, co nesedí.",
      ],
      commonMistake: "Psaní bez osnovy → chaotický text; obecná slova („dobrý“, „hezký“) místo konkrétních",
      example: "Nadpis: Hledání Alíka. Osnova: 1. Jdeme do parku. 2. Alík uteče. 3. Hledáme ho v dešti. 4. Najdeme ho u rybníka.",
    },
  },
];
