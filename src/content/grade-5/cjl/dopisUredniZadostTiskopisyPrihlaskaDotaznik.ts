import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem. Teď: L1 části úředního dopisu a tiskopisů
// · L2 co do žádosti a přihlášky patří a jak ji napsat zdvořile · L3 vyplňování
// tiskopisů a e-mailů v konkrétních situacích.

const L1: PracticeTask[] = [
  choice("Čím začíná úřední dopis?", "oslovením Vážená paní ředitelko", [
    { value: "oslovením Ahoj, paní ředitelko", why: "Ahoj se hodí ke kamarádům, ne do úředního dopisu." },
    { value: "oslovením Čau", why: "Čau je hovorové a do úředního dopisu nepatří." },
    { value: "oslovením Milá babičko", why: "Tak začíná osobní dopis babičce." },
  ], {
    hints: ["Komu se píše úřední dopis — kamarádovi, nebo úřadu?", "Úřední dopis je určený dospělému, kterému vykáme, a začíná zdvořilým oslovením."],
    explanation: "Úřední dopis začíná zdvořilým oslovením, třeba Vážená paní ředitelko.",
  }),
  choice("Čím končí úřední dopis?", "pozdravem a podpisem", [
    { value: "smajlíkem", why: "Smajlíky do úředního dopisu nepatří." },
    { value: "otázkou bez podpisu", why: "Bez podpisu adresát neví, kdo píše." },
    { value: "pozdravem Měj se", why: "Tykání a hovorový pozdrav se do úředního dopisu nehodí." },
  ], {
    hints: ["Jak adresát pozná, kdo mu dopis poslal?", "Na konci je zdvořilý pozdrav a pod ním vlastnoručně napsané jméno pisatele."],
    explanation: "Úřední dopis končí pozdravem a podpisem pisatele.",
  }),
  choice("Co je žádost?", "dopis, ve kterém někoho slušně o něco prosíme", [
    { value: "dopis kamarádovi z prázdnin", why: "To je osobní dopis." },
    { value: "seznam věcí na nákup", why: "To je nákupní seznam." },
    { value: "krátký vtip pro spolužáky", why: "Vtip žádostí není." },
  ], {
    hints: ["Co udělá člověk, který něco žádá?", "V žádosti vysvětlíš, o co prosíš a proč, a zdvořile ji podepíšeš."],
    explanation: "Žádost je úřední dopis, ve kterém někoho zdvořile o něco prosíme.",
  }),
  choice("Kde v úředním dopise uvedeš svou adresu?", "v záhlaví nahoře", [
    { value: "nikde", why: "Adresát musí vědět, kam odpovědět." },
    { value: "uprostřed textu", why: "Adresa patří do záhlaví." },
    { value: "jen do podpisu", why: "Adresa se píše do záhlaví, podpis je dole." },
  ], {
    hints: ["Kam se v dopise píšou údaje o odesílateli?", "Na začátku dopisu jsou údaje o pisateli a adresátovi, na konci pozdrav a podpis."],
    explanation: "Adresa pisatele patří do záhlaví dopisu.",
  }),
  choice("Co je přihláška?", "tiskopis k přihlášení", [
    { value: "pozvánka na oslavu", why: "Pozvánka zve, nepřihlašuje." },
    { value: "vysvědčení ze školy", why: "Vysvědčení hodnotí prospěch." },
    { value: "jízdenka na vlak", why: "Jízdenka je doklad o zaplacení jízdy." },
  ], {
    hints: ["Co vyplníš, když chceš chodit do kroužku?", "Tento papír má předtištěné kolonky na jméno, datum narození a podpis rodiče."],
    explanation: "Přihláška je tiskopis, kterým se přihlašujeme do kroužku, na tábor nebo do soutěže.",
  }),
  choice("Co napíšeš do kolonky Datum narození?", "den, měsíc a rok mého narození", [
    { value: "dnešní den, měsíc a rok", why: "Dnešní datum patří do kolonky Datum." },
    { value: "adresu, kde bydlím", why: "Adresa má vlastní kolonku." },
    { value: "jméno a příjmení maminky", why: "Jméno rodiče se píše jinam." },
  ], {
    hints: ["Na co se kolonka ptá?", "Narození — kdy jsi přišel nebo přišla na svět."],
    explanation: "Do kolonky Datum narození patří den, měsíc a rok narození.",
  }),
  choice("Jak se vyplňuje tiskopis?", "čitelně hůlkovým písmem a pravdivě", [
    { value: "tužkou a co nejrychleji", why: "Tužka se může smazat a spěch vede k chybám." },
    { value: "jen některé kolonky podle nálady", why: "Vyplňují se všechny potřebné kolonky." },
    { value: "vymyšlenými údaji", why: "Údaje musí být pravdivé." },
  ], {
    hints: ["Kdo bude tiskopis číst a co z něj potřebuje zjistit?", "Údaje musí přečíst i cizí člověk, proto se píše tiskacím písmem a pravdivě."],
    explanation: "Tiskopis vyplňujeme čitelně hůlkovým písmem a pravdivě.",
  }),
  choice("Co je dotazník?", "seznam otázek k zodpovězení", [
    { value: "dopis s omluvou za absenci", why: "Omluva je jiný útvar." },
    { value: "recept na koláč", why: "Recept je návod." },
    { value: "báseň o jaru a květinách", why: "Báseň je umělecký text." },
  ], {
    hints: ["Co najdeš v dotazníku, když ho dostaneš ve škole?", "Dotazník se ptá na názory nebo údaje a ty zaškrtáváš nebo píšeš odpovědi."],
    explanation: "Dotazník je seznam otázek, na které odpovídáme.",
  }),
  choice("Jak v žádosti oslovíš pana ředitele?", "Vážený pane řediteli", [
    { value: "Ahoj, řediteli", why: "Tykání a ahoj se k řediteli nehodí." },
    { value: "Milý pane Jardo", why: "Oslovení křestním jménem se do úředního dopisu nehodí." },
    { value: "Nazdar", why: "Nazdar je hovorový pozdrav." },
  ], {
    hints: ["Jak oslovujeme dospělé, kterým vykáme, v úředním dopise?", "Oslovení začíná slovem vážený a pokračuje funkcí v 5. pádě."],
    explanation: "Správně je Vážený pane řediteli.",
  }),
  choice("Který pozdrav se hodí na konec žádosti?", "S pozdravem", [
    { value: "Měj se", why: "Tykání se do žádosti nehodí." },
    { value: "Čau", why: "Čau je hovorové." },
    { value: "Pa pa", why: "Pa pa se říká v rodině." },
  ], {
    hints: ["Který pozdrav je spisovný a zdvořilý?", "Úřední dopis končí ustálenou spisovnou formulí, po které následuje podpis."],
    explanation: "Na konec žádosti patří S pozdravem a podpis.",
  }),
  choice("Proč se úřední dopis píše spisovně a zdvořile?", "adresát je cizí dospělý nebo úřad", [
    { value: "aby byl dopis delší", why: "Délka nerozhoduje." },
    { value: "aby se adresát nasmál", why: "Úřední dopis není zábava." },
    { value: "protože spisovně se píše jen v zimě", why: "Spisovnost nezávisí na ročním období." },
  ], {
    hints: ["Komu úřední dopis píšeme?", "K cizím dospělým a úřadům se chováme zdvořile — v řeči i v psaní."],
    explanation: "Úřední dopis míří k cizímu člověku nebo úřadu, proto je spisovný a zdvořilý.",
  }),
  choice("Co znamená kolonka Podpis zákonného zástupce?", "podpis rodiče", [
    { value: "podpis kamaráda", why: "Kamarád zákonným zástupcem není." },
    { value: "můj podpis", why: "Za dítě podepisuje rodič." },
    { value: "podpis pošťáka", why: "Pošťák přihlášku nepodepisuje." },
  ], {
    hints: ["Kdo za dítě rozhoduje a nese odpovědnost?", "Zákonný zástupce je ten, kdo se o dítě ze zákona stará — obvykle maminka nebo tatínek."],
    explanation: "Zákonným zástupcem je rodič; jeho podpis souhlasí s přihláškou.",
  }),
  choice("Co napíšeš do kolonky Příjmení?", "své příjmení, třeba Novák", [
    { value: "své křestní jméno", why: "Křestní jméno má vlastní kolonku." },
    { value: "svou přezdívku", why: "Přezdívka do tiskopisu nepatří." },
    { value: "jméno svého psa", why: "Tiskopis se ptá na tebe." },
  ], {
    hints: ["Jak se jmenuje celá tvoje rodina?", "Příjmení je rodinné jméno, které máš společné s rodiči."],
    explanation: "Do kolonky Příjmení patří rodinné jméno, například Novák.",
  }),
];

const L2: PracticeTask[] = [
  choice("Která věta patří do žádosti o přijetí do kroužku?", "Prosím Vás o přijetí do výtvarného kroužku.", [
    { value: "Chci do výtvarky, jasný?", why: "Hovorové a nezdvořilé." },
    { value: "Dej mě do výtvarky.", why: "Tykání a rozkaz se do žádosti nehodí." },
    { value: "Výtvarka je fajn, beru ji.", why: "Hovorové a chybí prosba." },
  ], {
    hints: ["Která věta zní jako slušná prosba?", "V žádosti vykáme, prosíme a píšeme spisovně."],
    explanation: "Prosím Vás o přijetí… je zdvořilá a spisovná prosba.",
  }),
  choice("Co musí žádost obsahovat?", "o co žádám, proč a kdo žádá", [
    { value: "jen to, o co žádám", why: "Chybí důvod a podpis." },
    { value: "vtip na úvod", why: "Vtip do žádosti nepatří." },
    { value: "seznam mých kamarádů", why: "To se žádosti netýká." },
  ], {
    hints: ["Na co se adresát zeptá, když žádost dostane?", "Adresát potřebuje vědět, co chceš, proč to chceš a kdo žádost píše."],
    explanation: "Žádost obsahuje, o co žádáme, proč, a podpis pisatele.",
  }),
  choice("Proč se v úředním dopise píše Vám a Vás s velkým V?", "vyjadřujeme úctu k oslovenému člověku", [
    { value: "protože je to začátek věty", why: "Velké V se píše i uprostřed věty." },
    { value: "protože se tak píše vždycky a všude", why: "V běžném textu se píše malé v." },
    { value: "protože je to jméno", why: "Není to jméno, ale zájmeno." },
  ], {
    hints: ["Komu dopisem vykáme?", "Velké písmeno u zájmena, kterým oslovujeme jednoho člověka, vyjadřuje zdvořilost."],
    explanation: "Velké V u Vás, Vám vyjadřuje úctu k adresátovi.",
  }),
  choice("Kam se v dopise píše místo a datum?", "nahoru, obvykle vpravo", [
    { value: "pod podpis", why: "Datum se píše do záhlaví." },
    { value: "doprostřed textu", why: "Do textu datum nepatří." },
    { value: "nikam", why: "Místo a datum v dopise být má." },
  ], {
    hints: ["Kde v dopise najdeš, kdy byl napsaný?", "Místo a datum patří do záhlaví, aby je adresát hned viděl."],
    explanation: "Místo a datum se píše nahoru, obvykle vpravo.",
  }),
  choice("Který údaj do přihlášky do kroužku nepatří?", "oblíbené jídlo", [
    { value: "jméno a příjmení", why: "Bez jména by nebylo jasné, kdo se hlásí." },
    { value: "datum narození", why: "Podle věku se tvoří skupiny." },
    { value: "telefon na rodiče", why: "Vedoucí musí rodiče kontaktovat." },
  ], {
    hints: ["Který údaj vedoucí kroužku nepotřebuje?", "Do přihlášky patří jen údaje potřebné k organizaci — jméno, věk, kontakt na rodiče."],
    explanation: "Oblíbené jídlo do přihlášky nepatří.",
  }),
  choice("Proč musí přihlášku podepsat rodič?", "za dítě rozhoduje zákonný zástupce", [
    { value: "dítě neumí psát", why: "Dítě psát umí, ale za něj rozhoduje rodič." },
    { value: "rodič má hezčí písmo", why: "O písmo nejde." },
    { value: "je to jen zvyk", why: "Podpis rodiče vyjadřuje souhlas." },
  ], {
    hints: ["Kdo nese za dítě odpovědnost?", "Podpisem rodič souhlasí, že dítě bude kroužek navštěvovat, a třeba i zaplatí."],
    explanation: "Rodič je zákonný zástupce a podpisem vyjadřuje souhlas.",
  }),
  choice("V dotazníku je otázka s možnostmi a) ano, b) ne. Co uděláš?", "zakroužkuji tu jednu možnost, která platí", [
    { value: "napíšu dlouhý příběh", why: "Stačí vybrat možnost." },
    { value: "zakroužkuji obě možnosti", why: "Ano i ne zároveň platit nemůže." },
    { value: "nevyplním nic", why: "Otázka zůstane bez odpovědi." },
  ], {
    hints: ["Kolik odpovědí u takové otázky platí?", "U otázky s nabídnutými možnostmi se vybírá jedna, pokud dotazník neříká jinak."],
    explanation: "Vybereme a označíme jednu platnou možnost.",
  }),
  choice("Kdo je adresát?", "ten, komu dopis píšeme", [
    { value: "ten, kdo dopis píše", why: "To je odesílatel." },
    { value: "pošťák, který dopis nese", why: "Pošťák dopis jen doručuje." },
    { value: "ulice a číslo domu", why: "To je adresa." },
  ], {
    hints: ["Kdo dopis dostane do schránky?", "Adresát je příjemce dopisu; odesílatel je jeho autor."],
    explanation: "Adresát je ten, komu je dopis určen.",
  }),
  choice("Kdo je odesílatel?", "ten, kdo dopis posílá", [
    { value: "ten, komu dopis přijde", why: "To je adresát." },
    { value: "úředník na poště", why: "Úředník dopis jen přijme." },
    { value: "známka na obálce", why: "Známka je poplatek za doručení." },
  ], {
    hints: ["Od koho dopis pochází?", "Údaje odesílatele se píšou na obálku, aby se dopis mohl vrátit, když se nedoručí."],
    explanation: "Odesílatel je ten, kdo dopis posílá.",
  }),
  choice("Kde je na obálce adresa adresáta?", "vpravo dole", [
    { value: "vlevo nahoře", why: "Vlevo nahoře je odesílatel." },
    { value: "uprostřed nahoře", why: "Tam adresa nepatří." },
    { value: "na zadní straně", why: "Adresa patří na přední stranu." },
  ], {
    hints: ["Kam se na obálce lepí známka a kde je odesílatel?", "Odesílatel je vlevo nahoře, známka vpravo nahoře a adresát v pravé dolní části."],
    explanation: "Adresa adresáta se píše vpravo dole.",
  }),
  choice("Proč se v žádosti uvádí důvod?", "aby adresát věděl, proč má žádosti vyhovět", [
    { value: "aby byla žádost delší", why: "Délka nerozhoduje." },
    { value: "protože je to povinná hádanka", why: "Žádost není hádanka." },
    { value: "aby se adresát nudil", why: "Důvod adresátovi pomůže rozhodnout." },
  ], {
    hints: ["Podle čeho se adresát rozhodne?", "Když vysvětlíš, proč o něco prosíš, adresát snáz pochopí a vyhoví."],
    explanation: "Důvod pomůže adresátovi rozhodnout, jestli žádosti vyhoví.",
  }),
  choice("Která věta je zdvořilá?", "Děkuji Vám za vyřízení mé žádosti.", [
    { value: "Tak to vyřiďte, jo?", why: "Hovorové a příkré." },
    { value: "Doufám, že to nezkazíte.", why: "Nezdvořilé." },
    { value: "Čekám rychlou odpověď!", why: "Rozkazovačné." },
  ], {
    hints: ["Která věta vyjadřuje poděkování?", "Zdvořilá věta vyká, děkuje a nikoho nepopohání."],
    explanation: "Děkuji Vám za vyřízení… je zdvořilá věta.",
  }),
  choice("Kam se na obálce píše odesílatel?", "vlevo nahoře", [
    { value: "vpravo dole", why: "Vpravo dole je adresát." },
    { value: "do středu", why: "Do středu se adresy nepíšou." },
    { value: "na známku", why: "Na známku se nepíše." },
  ], {
    hints: ["Kde bývá na obálce menší písmo s adresou toho, kdo dopis poslal?", "Pošta potřebuje vidět adresáta vpravo dole; zpáteční adresa je v opačném rohu obálky."],
    explanation: "Odesílatel se píše vlevo nahoře.",
  }),
];

const L3: PracticeTask[] = [
  choice("Píšeš e-mail s žádostí o prodloužení výpůjčky v knihovně. Co do něj nepatří?", "smajlíky a hovorové zkratky", [
    { value: "oslovení a pozdrav", why: "Oslovení a pozdrav do e-mailu patří." },
    { value: "název knihy", why: "Knihovna potřebuje vědět, o kterou knihu jde." },
    { value: "tvoje jméno", why: "Knihovna musí vědět, kdo žádá." },
  ], {
    hints: ["Je e-mail knihovně úřední, nebo kamarádská zpráva?", "I úřední e-mail má oslovení, jasnou prosbu, pozdrav a jméno; hovorové zkratky do něj nepatří."],
    explanation: "Do úředního e-mailu nepatří smajlíky ani hovorové zkratky.",
  }),
  choice("Co napíšeš do kolonky Bydliště?", "ulici, číslo domu, obec a PSČ", [
    { value: "jen jméno ulice", why: "Chybí číslo domu, obec a PSČ." },
    { value: "název své školy", why: "Škola není bydliště." },
    { value: "telefonní číslo", why: "Telefon má vlastní kolonku." },
  ], {
    hints: ["Co potřebuje pošta, aby ti mohla doručit dopis?", "Úplná adresa říká, kde přesně bydlíš: jméno ulice s číslem, město nebo vesnici a poštovní směrovací číslo."],
    explanation: "Bydliště = ulice, číslo domu, obec a PSČ.",
  }),
  choice("Nevíš, co znamená kolonka v přihlášce. Co uděláš?", "zeptám se rodičů nebo pracovníka", [
    { value: "vymyslím si nějaký údaj", why: "Vymyšlený údaj může způsobit potíže." },
    { value: "kolonku přeškrtnu", why: "Přeškrtnutí neřeší, co tam patří." },
    { value: "nechám ji prázdnou a odešlu", why: "Přihláška může být neplatná." },
  ], {
    hints: ["Kdo ti vysvětlí, co kolonka znamená?", "Zeptat se je v pořádku — chyba v tiskopisu může způsobit, že přihlášku nepřijmou."],
    explanation: "Když něčemu nerozumíme, zeptáme se.",
  }),
  choice("Proč se do dotazníku píše pravda?", "výsledky se použijí a nepravda by je zkreslila", [
    { value: "dotazník se stejně nikdo nečte", why: "Odpovědi se zpracovávají." },
    { value: "je to jen hra", why: "Dotazník slouží ke zjištění skutečnosti." },
    { value: "za pravdu je odměna", why: "Odměna není důvod." },
  ], {
    hints: ["K čemu dotazník slouží?", "Z odpovědí se dělají závěry — třeba jaký kroužek otevřít; nepravdivé odpovědi by vedly ke špatnému rozhodnutí."],
    explanation: "Pravdivé odpovědi dávají pravdivé výsledky.",
  }),
  choice("Proč v dopise řediteli netykáme?", "vykáme cizím dospělým a nadřízeným", [
    { value: "ředitel neumí číst ty", why: "Nejde o čtení, ale o zdvořilost." },
    { value: "tykání je zakázané zákonem", why: "Zákon to nezakazuje, jde o slušnost." },
    { value: "protože ředitel je starý", why: "Věk není jediný důvod — vykáme i mladým cizím dospělým." },
  ], {
    hints: ["Komu tykáme a komu vykáme?", "Tykáme rodině a kamarádům; k ostatním dospělým a v úředním styku se chováme s větší úctou."],
    explanation: "V úředním dopise vykáme — je to projev zdvořilosti.",
  }),
  choice("Co je PSČ?", "poštovní směrovací číslo", [
    { value: "pořadové školní číslo", why: "Taková zkratka v adrese není." },
    { value: "podpis starosty čtvrti", why: "PSČ není podpis." },
    { value: "počet stran v čísle", why: "PSČ se týká pošty." },
  ], {
    hints: ["Která část adresy je složená jen z číslic?", "Podle tohoto pětimístného čísla pošta pozná, kam dopis poslat."],
    explanation: "PSČ je poštovní směrovací číslo — pomáhá poště třídit dopisy.",
  }),
  choice("Proč se tiskopis vyplňuje hůlkovým písmem?", "je čitelné pro každého", [
    { value: "je rychlejší než psací", why: "Nejde o rychlost." },
    { value: "šetří inkoust", why: "Nejde o inkoust." },
    { value: "je hezčí", why: "Hlavní je čitelnost." },
  ], {
    hints: ["Kdo tiskopis čte?", "Tiskopis zpracovává cizí člověk nebo počítač; tiskací písmena přečte každý."],
    explanation: "Hůlkové písmo je čitelné pro každého.",
  }),
  choice("Které zájmeno napíšeš v dopise řediteli s velkým písmenem?", "Vám", [
    { value: "mně", why: "Sebe velkým písmenem neoznačujeme." },
    { value: "nám", why: "Nám se týká pisatelů." },
    { value: "jim", why: "Jim se týká jiných lidí." },
  ], {
    hints: ["Kterým zájmenem oslovuješ ředitele?", "Velké písmeno patří zájmenu, kterým zdvořile oslovuješ adresáta."],
    explanation: "Zájmeno Vám, kterým oslovujeme adresáta, píšeme s velkým V.",
  }),
  choice("Co napíšeš do předmětu e-mailu se žádostí?", "krátce, o co jde, třeba Žádost o prodloužení výpůjčky", [
    { value: "Ahoj!", why: "Předmět má říct, o co jde." },
    { value: "nic, předmět nechám prázdný", why: "Prázdný předmět e-mail znejistí nebo zapadne." },
    { value: "DŮLEŽITÉ!!!", why: "Vykřičníky nic neříkají o obsahu." },
  ], {
    hints: ["Co má adresát poznat, ještě než e-mail otevře?", "Předmět je jako nadpis: stručně řekne, čeho se zpráva týká."],
    explanation: "Předmět e-mailu stručně vystihne obsah zprávy.",
  }),
  choice("Proč se úřední dopis podepisuje vlastní rukou?", "podpis potvrzuje, že dopis píšu opravdu já", [
    { value: "aby dopis vypadal hezky", why: "Nejde o vzhled." },
    { value: "aby se ušetřil papír", why: "Podpis papír nešetří." },
    { value: "je to jen ozdoba", why: "Podpis má důležitou úlohu." },
  ], {
    hints: ["Jak adresát pozná, že dopis nenapsal někdo jiný?", "Vlastnoruční podpis je jako tvoje značka — potvrzuje, že za dopisem stojíš."],
    explanation: "Podpis potvrzuje totožnost pisatele a jeho souhlas s obsahem.",
  }),
  choice("Dotazník se ptá na počet sourozenců a ty žádné nemáš. Co napíšeš?", "0", [
    { value: "nic, kolonku vynechám", why: "Nevyplněná kolonka je nejasná." },
    { value: "vymyslím si bratra", why: "Údaj musí být pravdivý." },
    { value: "jméno kamaráda", why: "Kamarád sourozenec není." },
  ], {
    hints: ["Jak zapíšeš počet, když nemáš ani jednoho?", "Kolonka se ptá na číslo; když sourozence nemáš, napíšeš číslo, které znamená žádný."],
    explanation: "Když sourozence nemáme, napíšeme 0 — kolonka tak zůstane jasná.",
  }),
  choice("Kdy je vhodné poslat žádost e-mailem místo dopisu?", "když to adresát dovoluje a je to rychlejší", [
    { value: "vždycky, dopisy se už nepíšou", why: "Někdy je dopis s podpisem nutný." },
    { value: "nikdy, e-mail je nezdvořilý", why: "E-mail může být zdvořilý." },
    { value: "jen v noci", why: "Denní doba nerozhoduje." },
  ], {
    hints: ["Přijímá škola nebo knihovna žádosti e-mailem?", "E-mail je rychlý, ale některé úřady chtějí podepsaný dopis — řiď se tím, co adresát požaduje."],
    explanation: "E-mail posíláme tam, kde ho adresát přijímá; jinak píšeme dopis.",
  }),
  choice("Která žádost je úplná?", "Vážený pane řediteli, prosím o uvolnění na závody 5. května. S pozdravem Eva Nová", [
    { value: "Vážený pane řediteli, prosím o uvolnění. S pozdravem Eva Nová", why: "Chybí, kdy a proč." },
    { value: "Prosím o uvolnění na závody 5. května. S pozdravem Eva Nová", why: "Chybí oslovení." },
    { value: "Vážený pane řediteli, prosím o uvolnění na závody 5. května.", why: "Chybí pozdrav a podpis." },
  ], {
    hints: ["Co všechno má žádost obsahovat od oslovení po podpis?", "Úplná žádost má oslovení, prosbu s důvodem a datem, pozdrav a podpis."],
    explanation: "Úplná žádost má oslovení, prosbu s důvodem a datem, pozdrav a podpis.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const DOPISUREDNIZADOSTTISKOPISYPRIHLASKADOTAZNIK: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-uredni-zadost-tiskopisy-prihlaska-dotaznik",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-uredni-zadost-tiskopisy-prihlaska-dotaznik",
    title: "Dopis úřední (žádost, přihláška, dotazník)",
    studentTitle: "Úřední dopis",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se napsat úřední dopis nebo žádost.",
    keywords: ["úřední dopis", "žádost", "přihláška", "tiskopis", "formální psaní"],
    goals: [
      "Poznat strukturu úředního dopisu",
      "Napsat jednoduchou žádost nebo přihlášku",
      "Používat správný formální styl",
    ],
    boundaries: [
      "Neprobíráme složité právní dokumenty",
      "Bez podrobného práva a administrativy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Úřední dopis má pevnou strukturu: záhlaví (kdo a komu) → Věc: (téma) → oslovení → text → závěr → podpis. Vždy piš formálně a zdvořile.",
      steps: [
        "Napiš záhlaví: svou adresu a adresu příjemce.",
        "Uveď Věc: (krátce téma).",
        "Oslov adresáta: Vážený pane / Vážená paní + titul.",
        "Vysvětli důvod, požádej konkrétně.",
        "Zakonči: S úctou / S pozdravem + podpis.",
      ],
      commonMistake: "Žáci zapomenou na oslovení nebo závěrečný zdvořilostní pozdrav. Bez nich dopis působí neúplně.",
      example: "Vážený pane řediteli, dovoluji si Vás požádat o... S úctou, Jana Nováková.",
    },
  },
];
