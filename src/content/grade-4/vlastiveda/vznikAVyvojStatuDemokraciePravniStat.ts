/**
 * Vlastivěda 4. ročník — Stát a společnost: vznik a vývoj státu, demokracie,
 * právní stát.
 *
 * Přepsáno 2026-09-11. Původní úlohy měly jednu nápovědu, „postup“, který
 * zopakoval odpověď, a žádnou diagnostiku. Obsahovaly chyby: „Ústava ČR byla
 * přijata v roce 1993“ (přijata 16. 12. 1992, platí od 1. 1. 1993),
 * gramaticky rozbité „Co je to volné volby?“ a dlouhé odborné odpovědi
 * (dělba moci, Ústavní soud, zákonodárný proces), které se prozrazovaly
 * délkou.
 *
 * Gradace:
 *  • L1 — kdo řídí stát, co je demokracie, ústava, volby, státní symboly.
 *  • L2 — parlament, práva a svobody, právní stát, soudy, obec.
 *  • L3 — proč v demokracii nikdo nevládne sám, rozdíl proti diktatuře,
 *         hlasování ve třídě, proč dodržovat zákony, se kterými nesouhlasíme.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

const POOL_L1: PracticeTask[] = [
  choice("Co je stát?", "Území s obyvateli, vládou a zákony", [
    { value: "Jedno velké město s náměstím", why: "Město je jen část státu. Stát tvoří celé území s obyvateli a vládou." },
    { value: "Skupina kamarádů ze třídy", why: "Kamarádi stát netvoří. Stát má území, obyvatele a vládu." },
    { value: "Hora s hradem a zámkem", why: "Hrad je stavba. Stát je celé území s lidmi a zákony." },
  ], {
    hints: ["Stát má tři věci: území, lidi a někoho, kdo ho řídí.", "Česko je stát: má své hranice, žije v něm skoro 11 milionů lidí a má vládu a zákony. Co z toho tvoří stát?"],
    explanation: "Stát je území s hranicemi, na kterém žijí obyvatelé a které má vládu a zákony. Česko je stát, Praha je jeho hlavní město.",
  }),
  choice("Kdo je hlavou Česka?", "Prezident", [
    { value: "Předseda vlády", why: "Předseda vlády vede vládu, ale hlavou státu je prezident." },
    { value: "Starosta", why: "Starosta vede obec." },
    { value: "Hejtman", why: "Hejtman vede kraj." },
  ], {
    hints: ["Sídlí na Pražském hradě.", "Tento člověk zastupuje stát, jmenuje vládu a podepisuje zákony. Lidé ho volí na pět let."],
    explanation: "Hlavou státu je prezident. Sídlí na Pražském hradě, zastupuje Česko navenek, jmenuje vládu a podepisuje zákony.",
  }),
  choice("Kdo vede vládu?", "Předseda vlády", [
    { value: "Prezident", why: "Prezident je hlava státu, vládu vede předseda vlády." },
    { value: "Starosta", why: "Starosta vede obec." },
    { value: "Ředitel školy", why: "Ředitel vede školu." },
  ], {
    hints: ["Říká se mu také premiér.", "Vláda má ministry a v jejím čele stojí jeden člověk, kterého jmenuje prezident."],
    explanation: "Vládu vede předseda vlády, kterému se říká premiér. Vláda řídí stát každý den — ministerstva, školy, silnice, nemocnice.",
  }),
  choice("Na kolik let lidé volí prezidenta?", "Na pět let", [
    { value: "Na dva roky", why: "Dva roky je příliš krátce. Prezident se volí na pět let." },
    { value: "Na deset let", why: "Deset let je moc. Prezident se volí na pět let." },
    { value: "Na celý život", why: "Na celý život vládli králové. Prezident se volí na pět let." },
  ], {
    hints: ["Je to víc než volební období poslanců, které trvá čtyři roky.", "Prezident se volí o rok déle než poslanci, jejichž období trvá čtyři roky. Kolik let to je?"],
    explanation: "Prezident se volí na pět let. Stejný člověk může být prezidentem nejvýš dvakrát po sobě.",
  }),
  choice("Co znamená slovo demokracie?", "Vláda lidu", [
    { value: "Vláda jednoho krále", why: "Vláda jednoho panovníka je monarchie." },
    { value: "Vláda armády", why: "Vláda armády demokracií není." },
    { value: "Vláda nejbohatších", why: "Demokracie není vláda bohatých, ale všech lidí." },
  ], {
    hints: ["Slovo pochází z řečtiny: „démos“ znamená lid.", "„Kratos“ znamená moc nebo panování. Poskládej to s „démos“ dohromady."],
    explanation: "Demokracie znamená vláda lidu. Lidé si ve volbách vybírají, kdo za ně bude rozhodovat, a mají stejná práva.",
  }),
  choice("Co je ústava?", "Nejdůležitější zákon státu", [
    { value: "Seznam měst a obcí", why: "Seznam obcí ústavou není." },
    { value: "Kniha o dějinách", why: "Ústava nepopisuje dějiny, ale pravidla státu." },
    { value: "Řád školní jídelny", why: "Řád jídelny platí jen v jídelně." },
  ], {
    hints: ["Všechny ostatní zákony se jí musí podřídit.", "Určuje, jak stát funguje, kdo ho řídí a jaká práva mají lidé. Jak se takový hlavní dokument jmenuje?"],
    explanation: "Ústava je nejdůležitější zákon státu. Určuje, jak stát funguje, a žádný jiný zákon s ní nesmí být v rozporu.",
  }),
  choice("Kdo v Česku schvaluje zákony?", "Parlament", [
    { value: "Prezident sám", why: "Prezident zákony podepisuje, ale schvaluje je parlament." },
    { value: "Policie", why: "Policie dohlíží, aby se zákony dodržovaly." },
    { value: "Soudy", why: "Soudy podle zákonů rozhodují, ale neschvalují je." },
  ], {
    hints: ["Sedí v něm poslanci a senátoři.", "Lidé do něj volí své zástupce, kteří hlasují o nových zákonech. Jak se jmenuje?"],
    explanation: "Zákony schvaluje parlament, ve kterém sedí poslanci a senátoři zvolení lidmi. Prezident pak zákon podepíše.",
  }),
  choice("Ze kterých dvou částí se skládá český parlament?", "Poslanecká sněmovna a Senát", [
    { value: "Vláda a prezident", why: "Vláda a prezident nejsou parlament." },
    { value: "Kraje a obce", why: "Kraje a obce jsou samospráva, ne parlament." },
    { value: "Policie a soudy", why: "Policie a soudy nejsou parlament." },
  ], {
    hints: ["Parlament nezasedá v jedné síni — kolik má komor a kdo v nich sedí?", "V jedné části zasedá 200 poslanců, ve druhé 81 senátorů. Jak se ty dvě části jmenují podle toho, kdo v nich sedí?"],
    explanation: "Parlament má dvě komory: Poslaneckou sněmovnu s 200 poslanci a Senát s 81 senátory.",
  }),
  choice("Kdy vznikla samostatná Česká republika?", "1. ledna 1993", [
    { value: "28. října 1918", why: "Tehdy vzniklo Československo." },
    { value: "17. listopadu 1989", why: "Tehdy začala sametová revoluce." },
    { value: "1. května 2004", why: "Tehdy vstoupilo Česko do Evropské unie." },
  ], {
    hints: ["Stalo se to na Nový rok.", "Po rozdělení Československa vznikly dva státy, Česko a Slovensko, na začátku roku, který končí trojkou."],
    explanation: "Samostatná Česká republika vznikla 1. ledna 1993, když se Československo rozdělilo na Česko a Slovensko.",
  }),
  choice("Co jsou volby?", "Hlasování, kterým lidé vybírají své zástupce", [
    { value: "Sportovní soutěž mezi školami", why: "Sportovní soutěž volbami není." },
    { value: "Vyučovací předmět ve škole", why: "Volby nejsou předmět ve škole." },
    { value: "Oslava státního svátku na náměstí", why: "Volby nejsou oslava, ale hlasování." },
  ], {
    hints: ["Dospělí při nich chodí k urně.", "Lidé zakroužkují na lístku, koho chtějí, a tak rozhodnou, kdo za ně bude v parlamentu nebo na obci."],
    explanation: "Ve volbách lidé hlasují a vybírají si zástupce — do obce, kraje, parlamentu nebo prezidenta. Je to základ demokracie.",
  }),
  choice("Od kolika let smějí lidé v Česku volit?", "Od 18 let", [
    { value: "Od 10 let", why: "Deset let je moc málo. Volit se smí od plnoletosti." },
    { value: "Od 15 let", why: "V 15 letech ještě volit nesmíš. Volí se od 18." },
    { value: "Od 30 let", why: "Tak dlouho se čekat nemusí. Volit se smí od 18 let." },
  ], {
    hints: ["Je to věk, kdy se člověk stává dospělým.", "V tomto věku si člověk může udělat řidičák na auto a je plnoletý. Kolik mu je?"],
    explanation: "Volit smějí v Česku občané od 18 let, kdy se stávají plnoletými. Někteří kandidáti musejí být ještě starší.",
  }),
  choice("Jak se společně nazývají vlajka, hymna a státní znak?", "Státní symboly", [
    { value: "Státní svátky", why: "Svátky jsou dny, kdy slavíme. Vlajka a hymna jsou symboly." },
    { value: "Státní zákony", why: "Zákony jsou pravidla. Vlajka a hymna jsou symboly." },
    { value: "Státní úřady", why: "Úřady jsou instituce, ne symboly." },
  ], {
    hints: ["Tyto věci stát zastupují a lidé je poznají.", "Vlajka visí na úřadech, hymna hraje při sportovních zápasech a znak je na pasu. Co jsou zač?"],
    explanation: "Vlajka, hymna, státní znak a další jsou státní symboly. Představují stát — hymna hraje při slavnostech a vlajka visí na úřadech.",
  }),
  choice("Jak se jmenuje česká státní hymna?", "Kde domov můj", [
    { value: "Ach synku, synku", why: "Ach synku, synku je lidová píseň." },
    { value: "Ó, Tannenbaum", why: "To je německá vánoční píseň." },
    { value: "Ach, ta láska nebeská", why: "To je lidová píseň, ne hymna." },
  ], {
    hints: ["Hymnu hrají při sportovních zápasech, když vyhrají čeští sportovci.", "Její název je otázka, kde je náš domov. Pochází ze hry Fidlovačka a zpívá se v ní o krásné české zemi."],
    explanation: "Česká státní hymna se jmenuje Kde domov můj. Pochází ze hry Fidlovačka, text napsal Josef Kajetán Tyl a hudbu František Škroup.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("Kolik poslanců má Poslanecká sněmovna?", "200", [
    { value: "81", why: "81 je počet senátorů v Senátu." },
    { value: "100", why: "Poslanců je víc, dvojnásobek." },
    { value: "14", why: "14 je počet krajů." },
  ], {
    hints: ["Je to víc než počet senátorů.", "Sněmovna je větší než Senát: poslanců je víc než dvakrát tolik jako senátorů, kterých je 81."],
    explanation: "Poslanecká sněmovna má 200 poslanců. Lidé je volí na čtyři roky. Senát má 81 senátorů.",
  }),
  choice("Kolik senátorů má Senát?", "81", [
    { value: "200", why: "200 je počet poslanců." },
    { value: "14", why: "14 je počet krajů." },
    { value: "50", why: "Senátorů je víc než 50." },
  ], {
    hints: ["Senátorů je méně než poslanců.", "Senát je menší než Poslanecká sněmovna, která má 200 poslanců. Senátorů je necelá polovina."],
    explanation: "Senát má 81 senátorů. Volí se na šest let a každé dva roky se obměňuje třetina z nich.",
  }),
  choice("Čím se liší prezident a předseda vlády?", "Prezident je hlava státu, premiér vede vládu", [
    { value: "Je to stejná funkce, jen jinak nazvaná", why: "Nejsou — jeden je hlava státu, druhý vede vládu." },
    { value: "Premiér je hlavou státu a sídlí na Hradě", why: "Hlavou státu je prezident." },
    { value: "Prezident řídí jednu obec jako starosta", why: "Obec vede starosta." },
  ], {
    hints: ["Kdo sídlí na Pražském hradě a kdo řídí ministry?", "Prezident zastupuje stát a jmenuje vládu. Kdo pak vládu vede a řídí každodenní chod státu?"],
    explanation: "Prezident je hlava státu, zastupuje Česko a jmenuje vládu. Předseda vlády vládu vede a s ministry řídí každodenní chod státu.",
  }),
  choice("Co jsou svobodné volby?", "Každý dospělý může tajně volit, koho chce", [
    { value: "Volí jen ti, kdo mají peníze", why: "Ve svobodných volbách mohou volit všichni dospělí občané." },
    { value: "Je jen jeden kandidát", why: "Když je jen jeden kandidát, lidé si nemají z čeho vybrat." },
    { value: "Každý musí volit to, co řekne vláda", why: "To by nebyly svobodné volby." },
  ], {
    hints: ["Slovo svobodné znamená, že nikdo nikoho nenutí.", "Každý, komu je 18 let, si za plentou sám vybere podle sebe a nikdo nevidí, koho zvolil. Jak se takovým volbám říká?"],
    explanation: "Ve svobodných volbách může každý dospělý občan volit tajně a podle sebe z více kandidátů. Nikdo ho nesmí nutit ani trestat.",
  }),
  choice("Co je svoboda slova?", "Právo říkat svůj názor bez strachu z trestu", [
    { value: "Povinnost pořád mluvit", why: "Nikdo nemusí mluvit. Svoboda slova je právo, ne povinnost." },
    { value: "Právo urážet druhé", why: "Svoboda slova neznamená právo urážet nebo lhát o druhých." },
    { value: "Zákaz psát knihy", why: "Je to naopak — svoboda slova dovoluje psát a mluvit." },
  ], {
    hints: ["Svoboda znamená, že se nemusíš bát.", "V demokracii můžeš říct, že s něčím nesouhlasíš, a nikdo tě za to nezavře. Jak se tomu právu říká?"],
    explanation: "Svoboda slova je právo vyjádřit svůj názor, psát a mluvit bez strachu z trestu. Nesmí se ale zneužít k urážkám a lžím.",
  }),
  choice("Co je Listina základních práv a svobod?", "Zákon, který zaručuje práva každého člověka", [
    { value: "Seznam všech obcí v Česku", why: "Seznam obcí to není." },
    { value: "Jídelní lístek ve školní jídelně", why: "Listina práv nemá s jídlem nic společného." },
    { value: "Mapa Česka s hranicemi krajů", why: "Mapa ukazuje krajinu, ne práva." },
  ], {
    hints: ["Jméno té listiny prozrazuje, co v ní je.", "Je v ní zapsané, že každý má právo na život, svobodu, vzdělání nebo na svůj názor."],
    explanation: "Listina základních práv a svobod patří k ústavě. Zaručuje práva každého člověka, třeba na život, svobodu, vzdělání a svůj názor.",
  }),
  choice("Proč je zakázána diskriminace?", "Všichni lidé mají stejná práva", [
    { value: "Někteří lidé jsou lepší", why: "V demokracii mají všichni stejná práva, nikdo není lepší." },
    { value: "Kvůli penězům", why: "Nejde o peníze, ale o spravedlnost." },
    { value: "Zákaz neexistuje", why: "Diskriminace je zakázaná zákonem." },
  ], {
    hints: ["Diskriminace znamená znevýhodnit někoho kvůli tomu, jaký je.", "Nezáleží na barvě pleti, pohlaví, víře ani na tom, odkud kdo pochází. Co tedy platí pro práva každého člověka?"],
    explanation: "Diskriminace je znevýhodnění člověka kvůli barvě pleti, pohlaví, víře nebo původu. Je zakázaná, protože všichni lidé mají stejná práva.",
  }),
  choice("Co je právní stát?", "Stát, kde zákony platí pro všechny stejně", [
    { value: "Stát bez zákonů", why: "Stát bez zákonů by nebyl právní." },
    { value: "Stát, kde zákony platí jen pro chudé", why: "V právním státě platí zákony pro všechny." },
    { value: "Stát, kde vláda nemusí dodržovat zákony", why: "V právním státě musí zákony dodržovat i vláda." },
  ], {
    hints: ["Musí zákony dodržovat i ministři a prezident?", "V právním státě neexistuje nikdo, kdo by stál nad zákonem. Co to znamená pro obyčejné lidi a pro vládu?"],
    explanation: "V právním státě platí zákony pro všechny stejně — pro obyčejné lidi i pro vládu a úředníky. O sporech rozhodují nezávislé soudy.",
  }),
  choice("Kdo rozhoduje spory a trestá porušení zákonů?", "Soudy", [
    { value: "Parlament", why: "Parlament zákony schvaluje, ale spory nerozhoduje." },
    { value: "Prezident", why: "Prezident spory nerozhoduje. Může jen udělit milost." },
    { value: "Starosta", why: "Starosta vede obec, spory nerozhoduje." },
  ], {
    hints: ["Rozhoduje v taláru a s kladívkem.", "Když se dva lidé přou, nebo když někdo poruší zákon, věc posoudí nezávislý… kdo?"],
    explanation: "Spory a porušení zákonů posuzují soudy. Soudci rozhodují podle zákonů a nikdo, ani vláda, jim nesmí říkat, jak mají rozhodnout.",
  }),
  choice("Kdy slavíme vznik samostatného Československa?", "28. října", [
    { value: "1. ledna", why: "1. ledna 1993 vznikla Česká republika." },
    { value: "17. listopadu", why: "17. listopadu si připomínáme boj za svobodu a demokracii." },
    { value: "8. května", why: "8. května slavíme konec druhé světové války." },
  ], {
    hints: ["Stalo se to na podzim roku 1918.", "Po první světové válce se Češi a Slováci osamostatnili od Rakouska-Uherska. Je to náš největší státní svátek na konci října."],
    explanation: "28. října 1918 vzniklo samostatné Československo. Je to největší český státní svátek.",
  }),
  choice("Proč se volí tajně?", "Aby nikdo nemohl nikoho nutit, koho volit", [
    { value: "Aby volby byly rychlejší", why: "Tajnost volby nezrychlí. Chrání svobodu voliče." },
    { value: "Aby nikdo nevěděl, že jsou volby", why: "Volby jsou veřejně oznámené. Tajné je jen to, koho kdo volí." },
    { value: "Protože voliči se stydí", why: "Nejde o stud, ale o ochranu před nátlakem." },
  ], {
    hints: ["Co by se mohlo stát, kdyby všichni viděli, koho volíš?", "Kdyby šéf nebo soused viděl lístek, mohl by nutit nebo trestat. Proč je tedy dobré, že je lístek skrytý za plentou?"],
    explanation: "Volí se tajně za plentou, aby nikdo nemohl voliče nutit ani ho za jeho volbu trestat. Každý tak volí podle sebe.",
  }),
  choice("Co může občan udělat, když chce něco změnit, kromě voleb?", "Podepsat petici nebo se zapojit v obci", [
    { value: "Nic, jen počkat na další volby", why: "Občan může jednat i mezi volbami." },
    { value: "Porušit zákon", why: "Porušení zákona není správná cesta ke změně." },
    { value: "Přestat chodit do školy", why: "To nic nezmění a navíc to škodí." },
  ], {
    hints: ["Jak můžou lidé ukázat, že jich chce změnu hodně?", "Mohou sbírat podpisy, přijít na zasedání zastupitelstva nebo pokojně demonstrovat. Co z toho je v nabídce?"],
    explanation: "Kromě voleb může občan podepsat petici, přijít na jednání zastupitelstva, napsat úřadu nebo se pokojně připojit k demonstraci.",
  }),
  choice("Kdo řídí obec?", "Starosta a zastupitelstvo zvolené občany", [
    { value: "Prezident z Pražského hradu", why: "Prezident je hlava celého státu, obec neřídí." },
    { value: "Hejtman celého kraje", why: "Hejtman vede kraj." },
    { value: "Ředitel místní pošty", why: "Ředitel pošty vede poštu." },
  ], {
    hints: ["Lidé v obci si volí zastupitelstvo.", "Zastupitelstvo si ze svého středu vybere člověka, který stojí v čele obce. Jak se mu říká?"],
    explanation: "Obec řídí zastupitelstvo, které volí občané obce, a v jeho čele starosta. Starají se o školy, cesty, vodu nebo parky.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Proč v demokracii nemůže jeden člověk vládnout neomezeně?", "Moc je rozdělená a navzájem se kontroluje", [
    { value: "Protože se to nikomu nechce", why: "Nejde o chuť. Moc je záměrně rozdělená, aby ji nikdo nezneužil." },
    { value: "Může, když vyhraje volby", why: "Ani vítěz voleb nesmí vládnout bez kontroly parlamentu a soudů." },
    { value: "Protože je to drahé", why: "Nejde o peníze, ale o ochranu svobody." },
  ], {
    hints: ["Co by se mohlo stát, kdyby jeden člověk dělal zákony, vládl i soudil?", "Parlament dělá zákony, vláda vládne a soudy soudí. Proč je dobré, že to nedělá jeden člověk?"],
    explanation: "V demokracii je moc rozdělená: parlament dělá zákony, vláda vládne a soudy soudí. Navzájem se kontrolují, a tak nikdo nemůže moc zneužít.",
  }),
  choice("Čím se liší demokracie od diktatury?", "V demokracii lidé volí, diktátor vládne bez kontroly", [
    { value: "V diktatuře jsou svobodné volby", why: "V diktatuře svobodné volby nejsou." },
    { value: "Demokracie má krále", why: "Demokracie krále mít může jen bez skutečné moci. Rozhodují zvolení zástupci." },
    { value: "Neliší se", why: "Liší se v tom, kdo rozhoduje a jestli jsou lidé svobodní." },
  ], {
    hints: ["Kdo rozhoduje v demokracii a kdo v diktatuře?", "V diktatuře vládne jeden člověk nebo strana, nikdo ho nemůže vyměnit a za kritiku hrozí trest. Jak je to v demokracii?"],
    explanation: "V demokracii si lidé ve svobodných volbách vybírají zástupce a mohou je kritizovat. V diktatuře vládne jeden člověk nebo skupina bez kontroly a lidé nemají svobodu.",
  }),
  choice("Proč jsou pro demokracii důležitá svobodná média?", "Informují lidi a kontrolují vládu", [
    { value: "Hlavně baví lidi", why: "Zábava je vedlejší. Důležité je, že informují a kontrolují." },
    { value: "Říkají lidem, koho volit", why: "Svobodná média informují, rozhodnutí je na lidech." },
    { value: "Nejsou pro demokracii důležitá", why: "Jsou — bez informací lidé nemohou dobře rozhodovat." },
  ], {
    hints: ["Jak by se lidé dozvěděli, že vláda dělá chyby?", "Noviny, televize a rádio mohou psát i o tom, co se vládě nelíbí. Proč je to dobré pro lidi, kteří chodí volit?"],
    explanation: "Svobodná média informují lidi o tom, co se ve státě děje, a upozorňují na chyby vlády. Díky nim se lidé mohou ve volbách dobře rozhodnout.",
  }),
  choice("Proč dodržovat zákon, i když s ním člověk nesouhlasí?", "Zákon se dá změnit, ale ne porušovat", [
    { value: "Protože zákony nikdy nejsou špatné", why: "Zákony špatné být mohou. Mění se ale podle pravidel, ne porušováním." },
    { value: "Kdo nesouhlasí, nemusí je dodržovat", why: "Kdyby každý dodržoval jen to, co se mu líbí, nefungovala by společnost." },
    { value: "Zákony dodržovat nemusí nikdo", why: "Zákony musí dodržovat všichni." },
  ], {
    hints: ["Co by se stalo, kdyby každý dodržoval jen pravidla, která se mu líbí?", "Když se zákon lidem nelíbí, mohou volit jiné zástupce, psát petice a pravidlo upravit. Porušit ho ale nesmějí."],
    explanation: "Zákony musí dodržovat všichni, jinak by společnost nefungovala. Kdo s nimi nesouhlasí, může je v demokracii měnit — volbami, peticí, diskusí.",
  }),
  choice("Jak vzniká zákon?", "Navrhne se, schválí parlament a podepíše prezident", [
    { value: "Napíše ho starosta a hned platí", why: "Starosta zákony nepíše. Zákon schvaluje parlament." },
    { value: "Vymyslí ho soud", why: "Soudy podle zákonů rozhodují, nevymýšlejí je." },
    { value: "Stačí, když ho řekne prezident", why: "Prezident sám zákony nevydává, jen je podepisuje." },
  ], {
    hints: ["Zákon prochází několika kroky.", "Nejdřív ho někdo navrhne, pak o něm hlasují poslanci a senátoři a nakonec ho podepíše hlava státu."],
    explanation: "Zákon navrhne vláda nebo poslanci. Pak o něm hlasuje Poslanecká sněmovna a Senát, a když ho schválí, podepíše ho prezident a zákon začne platit.",
  }),
  choice("Proč se volby opakují po několika letech?", "Aby lidé mohli vybrat jiné zástupce", [
    { value: "Aby měli poslanci práci navždy", why: "Je to naopak — volby umožní poslance vyměnit." },
    { value: "Protože se lístky kazí", why: "Nejde o lístky, ale o možnost změny." },
    { value: "Volby se konají jen jednou", why: "Volby se pravidelně opakují." },
  ], {
    hints: ["Co když lidé nejsou se svými zástupci spokojení?", "Po čtyřech letech mohou lidé zvolit jiné poslance. Proč je dobré, že nikdo nevládne navždy?"],
    explanation: "Volby se opakují, aby lidé mohli své zástupce vyměnit, když s nimi nejsou spokojení. Nikdo tak nevládne navždy.",
  }),
  choice("Ve starověkých Aténách volili jen svobodní muži. Čím se liší dnešní demokracie?", "Dnes volí všichni dospělí občané", [
    { value: "Dnes volí jen muži", why: "Dnes volí muži i ženy." },
    { value: "Dnes volí jen bohatí", why: "Dnes volí všichni dospělí občané bez ohledu na majetek." },
    { value: "Dnes nevolí nikdo", why: "V demokracii lidé volí." },
  ], {
    hints: ["Kdo v Aténách volit nesměl?", "V Aténách nevolily ženy ani otroci. Dnes v Česku volí každý občan od 18 let. V čem je to rozdíl?"],
    explanation: "V Aténách volili jen svobodní muži, ženy a otroci ne. Dnes mohou volit všichni dospělí občané, muži i ženy.",
  }),
  choice("Proč soudy nesmějí poslouchat vládu?", "Musí rozhodovat spravedlivě podle zákona", [
    { value: "Protože jsou proti vládě", why: "Soudy nejsou proti nikomu. Jsou nezávislé." },
    { value: "Protože vláda nemá zákony", why: "Vláda se zákony řídí. Soudy ale musí být nezávislé." },
    { value: "Soudy vládu poslouchat musí", why: "Nemusí — jinak by vláda mohla trestat nevinné." },
  ], {
    hints: ["Co by se stalo, kdyby vláda mohla soudci říct, jak má rozhodnout?", "Vláda by pak mohla nechat odsoudit toho, kdo ji kritizuje. Proč tedy musí být soudy nezávislé?"],
    explanation: "Soudy musí být nezávislé, aby rozhodovaly spravedlivě jen podle zákona. Kdyby poslouchaly vládu, mohla by nechat trestat nevinné nebo kritiky.",
  }),
  choice("Spolužák tvrdí, že ve třídě má rozhodovat ten nejsilnější. Je to demokratické?", "Ne, rozhodovat má hlasování a pravidla", [
    { value: "Ano, silný má vždy pravdu", why: "Síla neznamená pravdu. V demokracii rozhoduje hlasování." },
    { value: "Ano, když je to kamarád", why: "Kamarádství nerozhoduje. Pravidla platí pro všechny." },
    { value: "Záleží na tom, jak je silný", why: "Síla o ničem nerozhoduje." },
  ], {
    hints: ["Jak se rozhoduje v demokracii?", "V demokracii má každý stejný hlas a pravidla platí pro všechny, silné i slabé. Rozhoduje tedy síla?"],
    explanation: "Vláda nejsilnějšího demokratická není. V demokracii má každý stejný hlas, rozhoduje se hlasováním a pravidla platí pro všechny.",
  }),
  choice("Proč má každý člověk základní práva už od narození?", "Jsou to lidská práva, stát je jen chrání", [
    { value: "Protože si je koupil", why: "Lidská práva se nekupují. Má je každý." },
    { value: "Dostane je až v 18 letech", why: "Základní práva má každý od narození, i dítě." },
    { value: "Práva má jen prezident", why: "Základní práva mají všichni lidé." },
  ], {
    hints: ["Musí si miminko svá práva nějak zasloužit?", "Právo na život, na svobodu nebo na to, aby se s tebou jednalo lidsky, nedává stát. Kdo je tedy má?"],
    explanation: "Základní lidská práva má každý člověk od narození jen proto, že je člověk. Stát je nevytváří, jen je musí chránit.",
  }),
  choice("Co se v Česku změnilo po sametové revoluci v roce 1989?", "Lidé získali svobodné volby a svobodu slova", [
    { value: "Česko se spojilo s Rakouskem", why: "Česko se s Rakouskem nespojilo." },
    { value: "Vznikla monarchie", why: "Monarchie nevznikla. Vznikla demokracie." },
    { value: "Nic se nezměnilo", why: "Změnilo se hodně — skončila vláda jedné strany." },
  ], {
    hints: ["Jaká vláda byla v Československu před rokem 1989?", "Do roku 1989 vládla jedna strana a lidé nesměli svobodně volit ani říkat, co si myslí. Co přinesla revoluce?"],
    explanation: "Před rokem 1989 vládla jedna strana bez svobodných voleb. Sametová revoluce přinesla demokracii, svobodné volby a svobodu slova.",
  }),
  choice("Třída hlasuje o výletu: 15 dětí chce do zoo, 10 dětí na hrad. Co je demokratické?", "Jet do zoo, ale vyslechnout i ostatní", [
    { value: "Jet na hrad, protože to chce učitel", why: "Když se hlasovalo, má platit výsledek hlasování." },
    { value: "Nejet nikam, když se neshodnou všichni", why: "V demokracii rozhoduje většina, nemusí se shodnout úplně všichni." },
    { value: "Ať rozhodne ten, kdo křičí nejvíc", why: "Křik o ničem nerozhoduje." },
  ], {
    hints: ["Co chce víc dětí?", "Většina rozhodne, kam se pojede. Ale co s těmi, kdo chtěli jinam — mají se jejich názory ignorovat?"],
    explanation: "V demokracii rozhoduje většina, takže třída pojede do zoo. Menšinu je ale dobré vyslechnout — třeba se na hrad pojede příště.",
  }),
  choice("Proč je dobré, že jsou zákony zapsané a veřejné?", "Každý může zjistit, co smí a co ne", [
    { value: "Aby je nikdo nemusel číst", why: "Zákony jsou veřejné právě proto, aby je každý mohl číst." },
    { value: "Aby se daly často měnit", why: "Veřejnost zákonů nesouvisí s tím, jak často se mění." },
    { value: "Aby je znali jen soudci", why: "Znát je může každý, nejen soudci." },
  ], {
    hints: ["Jak by se člověk dozvěděl, co je zakázané, kdyby zákony byly tajné?", "Když jsou pravidla napsaná a přístupná, každý si je může přečíst. Proč je to spravedlivé?"],
    explanation: "Zákony jsou zapsané a veřejné, aby každý mohl zjistit, co smí a co ne. Bylo by nespravedlivé trestat za porušení tajných pravidel.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const VZNIKAVYVOJSTATUDEMOKRACIEPRAVNISTAT: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-kolem-nas-stat-a-spolecnost-vznik-a-vyvoj-statu-demokracie-pravni-stat",
    rvpNodeId: "g4-vlastiveda-lide-kolem-nas-stat-a-spolecnost-vznik-a-vyvoj-statu-demokracie-pravni-stat",
    title: "Vznik a vývoj státu, demokracie, právní stát",
    studentTitle: "Stát a demokracie",
    subject: "vlastivěda",
    category: "Lidé kolem nás",
    topic: "Lidé kolem nás",
    briefDescription: "Poznáš, jak funguje náš stát, co je demokracie a proč platí zákony.",
    keywords: ["stát", "demokracie", "ústava", "prezident", "vláda", "parlament", "volby", "zákon", "práva"],
    goals: [
      "Vysvětlit, co je stát a demokracie",
      "Popsat, kdo řídí stát (prezident, vláda, parlament, soudy)",
      "Uvést základní práva a svobody",
      "Vysvětlit, proč zákony platí pro všechny",
    ],
    boundaries: ["Podrobný zákonodárný proces a Ústavní soud patří na 2. stupeň"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "V demokracii rozhodují lidé ve volbách. Moc je rozdělená a zákony platí pro všechny.",
      steps: [
        "Hlava státu: prezident. Vládu vede předseda vlády.",
        "Zákony schvaluje parlament: 200 poslanců a 81 senátorů.",
        "Soudy rozhodují nezávisle podle zákona.",
        "Volit se smí od 18 let, tajně a svobodně.",
      ],
      commonMistake: "Prezident a předseda vlády nejsou totéž — prezident je hlava státu, premiér vede vládu.",
      example: "Když s nějakým zákonem nesouhlasíš, můžeš ho v demokracii pomoci změnit — ale ne porušit.",
    },
  },
];
