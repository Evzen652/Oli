import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Původně L3 jen míchala L1 a L2
// a nápovědy byly pro celé téma stejné. Vypadly úlohy, které patří jinam
// (přímá a nepřímá charakteristika — to je téma o postavách; určování
// osoby a čísla slovesa „přidáme“ — to je tvarosloví) a příklad s obrazem
// od Picassa, který dítěti nic neřekne.
//
// L1 = co patří do kterého popisu, jaký postup · L2 = vyber správný text,
// co chybí · L3 = poraď, co zlepšit, seřaď kroky, zvol druh popisu.

const L1: PracticeTask[] = [
  choice("Co patří do popisu předmětu?", "tvar, barva, materiál a k čemu slouží", [
    { value: "příběh, jak předmět vznikl", why: "Příběh patří do vypravování, ne do popisu." },
    { value: "historie a stáří předmětu", why: "Popis říká, jaký předmět je, ne odkud se vzal." },
    { value: "pocity, které z něj máš", why: "Popis má být věcný, pocity do něj nepatří." },
  ], {
    hints: ["Co bys řekl nebo řekla o věci, kterou má kamarád poznat, aniž ji uvidí?", "Popis předmětu odpovídá na otázky: jak vypadá, z čeho je a k čemu je. Nic nevypráví a neříká, co k věci cítíš."],
    explanation: "Popis předmětu uvádí jeho vlastnosti — tvar, barvu, materiál, velikost a k čemu slouží.",
  }),
  choice("Jak postupuješ při popisu předmětu?", "od celku k podrobnostem", [
    { value: "od podrobností k celku", why: "Čtenář by nevěděl, k čemu podrobnost patří." },
    { value: "náhodně, jak mě co napadne", why: "Bez pořádku si čtenář věc neposkládá." },
    { value: "podle abecedy", why: "Abeceda s popisem věci nesouvisí." },
  ], {
    hints: ["Co si čtenář potřebuje představit nejdřív — celou věc, nebo jeden šroubek?", "Nejdřív řekneš, co to je a jak to celkově vypadá. Až potom přidáváš jednotlivé části a nakonec drobnosti."],
    explanation: "Popis jde od celku k podrobnostem, aby si čtenář věc postupně poskládal.",
  }),
  choice("Co patří do popisu osoby?", "vzhled i povaha", [
    { value: "jen oblečení", why: "Oblečení je jen část vzhledu." },
    { value: "jen věk a jméno", why: "To jsou údaje, ne popis." },
    { value: "jen to, co včera dělala", why: "Co kdo dělal, patří do vypravování." },
  ], {
    hints: ["Jak kamarádovi popíšeš babičku, aby si ji představil a poznal, jaká je?", "U osoby popisuješ, jak vypadá (výška, vlasy, oblečení), a také jaká je — jak se chová k ostatním lidem."],
    explanation: "Popis osoby spojuje vzhled (jak vypadá) a povahu (jaká je).",
  }),
  choice("Jaký musí být popis pracovního postupu?", "seřazený krok za krokem", [
    { value: "napsaný v rýmech", why: "Rýmy patří do básničky." },
    { value: "bez pořadí, jak koho napadne", why: "Bez pořadí by postup nešel udělat." },
    { value: "pozpátku od posledního kroku", why: "Postup jde od prvního kroku k poslednímu." },
  ], {
    hints: ["Podle čeho se dá upéct koláč?", "Pracovní postup je návod. Kroky musí jít za sebou tak, jak se opravdu dělají."],
    explanation: "Pracovní postup je návod — kroky jdou za sebou v pořadí, v jakém se dělají.",
  }),
  choice("Recept na palačinky je příkladem…", "popisu pracovního postupu", [
    { value: "popisu osoby", why: "Recept nepopisuje člověka." },
    { value: "popisu předmětu", why: "Recept neříká, jak palačinka vypadá, ale jak ji udělat." },
    { value: "vypravování", why: "Recept nevypráví příběh." },
  ], {
    hints: ["K čemu recept slouží?", "Recept vede krok za krokem, jak něco připravit. Tak se jmenuje i druh popisu."],
    explanation: "Recept vede krok za krokem, jak jídlo připravit — je to popis pracovního postupu.",
  }),
  choice("Která slova popisují vzhled osoby?", "vysoký, zrzavý, s pihami", [
    { value: "odvážný, laskavý, upřímný", why: "Tato slova popisují povahu." },
    { value: "rychle, potichu, opatrně", why: "Tato slova říkají, jak se něco dělá." },
    { value: "včera, potom, nakonec", why: "Tato slova říkají čas." },
  ], {
    hints: ["Která slova popisují, co na člověku uvidíš očima?", "Vzhled je to, co je vidět: výška, vlasy, oči, pihy. Povaha ani to, jak člověk něco dělá, očima vidět nejsou."],
    explanation: "Vysoký, zrzavý, s pihami — to je vidět, jde o vzhled.",
  }),
  choice("Která slova popisují povahu osoby?", "odvážný, laskavý, upřímný", [
    { value: "vysoký, zrzavý, s pihami", why: "Tato slova popisují vzhled." },
    { value: "kulatý, dřevěný, hnědý", why: "Tato slova popisují předmět." },
    { value: "nejprve, potom, nakonec", why: "Tato slova řadí kroky." },
  ], {
    hints: ["Která slova popisují, jaký je člověk uvnitř?", "Povaha se neuvidí na první pohled — poznáš ji podle toho, jak se člověk chová."],
    explanation: "Odvážný, laskavý, upřímný popisují povahu — jaký člověk je.",
  }),
  choice("Která slova se hodí do pracovního postupu?", "nejprve, potom, nakonec", [
    { value: "byl jednou jeden", why: "Tak začíná pohádka." },
    { value: "odvážný, laskavý", why: "Tato slova popisují povahu." },
    { value: "zrzavý, s pihami", why: "Tato slova popisují vzhled." },
  ], {
    hints: ["Která slova řadí kroky za sebou?", "V postupu je důležité pořadí. Hodí se slova, která říkají, co je první, co další a co poslední."],
    explanation: "Nejprve, potom, nakonec řadí kroky postupu.",
  }),
  choice("Kterými slovy určíš, kde na předmětu je nějaká část?", "nahoře, dole, uprostřed", [
    { value: "nejprve, potom, nakonec", why: "Tato slova řadí kroky v čase." },
    { value: "odvážný, laskavý", why: "Tato slova popisují povahu." },
    { value: "včera, dnes, zítra", why: "Tato slova říkají čas." },
  ], {
    hints: ["Kde má batoh kapsu? Která slova odpovídají na otázku „kde“?", "Při popisu předmětu říkáš, kde je která část — třeba kapsa nebo zip. Pomáhají slova, která určují polohu."],
    explanation: "Nahoře, dole, uprostřed určují polohu částí předmětu.",
  }),
  choice("Čím začneš popis svého batohu?", "co to je a jak celkově vypadá", [
    { value: "jak vypadá jeden zip", why: "Zip je podrobnost, ta přijde později." },
    { value: "kolik batoh stál v obchodě", why: "Cena do popisu nepatří." },
    { value: "příběhem, jak se batoh ztratil", why: "Příběh patří do vypravování." },
  ], {
    hints: ["Co si má čtenář představit jako první?", "Popis jde od celku k podrobnostem. Nejdřív celý batoh, potom kapsy a zipy."],
    explanation: "Začneme celkem — co to je a jak batoh celkově vypadá, pak přidáme podrobnosti.",
  }),
  choice("Jaký má být popis předmětu?", "věcný a přesný", [
    { value: "plný pocitů a přání", why: "Pocity do věcného popisu nepatří." },
    { value: "vymyšlený jako pohádka", why: "Popis musí odpovídat skutečnosti." },
    { value: "co nejkratší, jen jedno slovo", why: "Jedno slovo věc nepopíše." },
  ], {
    hints: ["Mohl by podle tvého popisu někdo věc najít v obchodě?", "Dobrý popis uvádí skutečné vlastnosti věci přesně a bez pocitů, aby ji podle něj poznal i cizí člověk."],
    explanation: "Popis předmětu je věcný a přesný — uvádí, jaká věc opravdu je.",
  }),
  choice("Co v popisu pracovního postupu uvedeš jako první?", "co budeš potřebovat", [
    { value: "jak to celé dopadlo", why: "Výsledek je až na konci." },
    { value: "kdo recept vymyslel", why: "To pro postup není důležité." },
    { value: "jak chutná hotové jídlo", why: "To patří spíš na konec nebo vůbec." },
  ], {
    hints: ["Co si připravíš dřív, než začneš péct?", "Na začátku postupu je seznam věcí a surovin. Bez nich by první krok nešel udělat."],
    explanation: "Postup začíná seznamem toho, co budeme potřebovat (suroviny, nářadí).",
  }),
  choice("Proč se v popisu předmětu vyhýbáme slovům jako „hezký“ nebo „dobrý“?", "nic konkrétního neříkají", [
    { value: "jsou sprostá", why: "Sprostá nejsou, jen nejsou přesná." },
    { value: "jsou moc dlouhá", why: "Délka tu nevadí." },
    { value: "píšou se s chybou", why: "S pravopisem to nesouvisí." },
  ], {
    hints: ["Představíš si věc, o které víš jen, že je „hezká“?", "Každý si pod slovem „hezký“ představí něco jiného. Barva, tvar a materiál řeknou víc."],
    explanation: "„Hezký“ a „dobrý“ nic konkrétního neříkají. Lepší je napsat barvu, tvar nebo materiál.",
  }),
];

const L2: PracticeTask[] = [
  choice("Který text je popis předmětu?", "Tužka je dřevěná, šestihranná a na konci má gumu.", [
    { value: "Tužku jsem dostal od babičky k narozeninám.", why: "To je vyprávění o tom, co se stalo." },
    { value: "Nejprve tužku ořežeme, potom můžeme psát.", why: "To je pracovní postup." },
    { value: "Tužka je krásná a mám ji moc ráda.", why: "To je pocit, ne popis vlastností." },
  ], {
    hints: ["Který text ti řekne, jak tužka vypadá a z čeho je?", "Popis předmětu uvádí vlastnosti: materiál, tvar, části. Nevypráví, neradí a nevyjadřuje pocity."],
    explanation: "„Tužka je dřevěná, šestihranná a na konci má gumu“ popisuje vlastnosti tužky.",
  }),
  choice("Který text je popis osoby?", "Babička je malá, má šedé vlasy a vždycky se usmívá.", [
    { value: "Babička včera upekla jablečný koláč.", why: "To je děj — vypravování." },
    { value: "Nejprve babičce zavoláme, potom ji navštívíme.", why: "To je postup, co udělat." },
    { value: "Babiččin dům stojí na kraji lesa.", why: "To je popis místa, ne babičky." },
  ], {
    hints: ["Který text ti řekne, jak babička vypadá a jaká je?", "Popis osoby má vzhled (výška, vlasy) a povahu (usměvavá, laskavá)."],
    explanation: "Text popisuje vzhled babičky (malá, šedé vlasy) i povahu (usměvavá).",
  }),
  choice("Který text je pracovní postup?", "Nejprve nalij vodu, potom přidej čaj a nech ho louhovat.", [
    { value: "Čaj je horký a krásně voní.", why: "To je popis čaje." },
    { value: "Včera jsme pili čaj u babičky.", why: "To je vypravování." },
    { value: "Hrnek je bílý s modrým proužkem.", why: "To je popis předmětu." },
  ], {
    hints: ["Podle kterého textu uděláš čaj?", "Postup má kroky za sebou a slova jako nejprve, potom. Říká, co máš dělat."],
    explanation: "Text vede krok za krokem (nejprve, potom), jak připravit čaj — je to pracovní postup.",
  }),
  choice("Co chybí v postupu? 1. Vezmi krajíc chleba. 2. ??? 3. Polož na chleba plátek sýra.", "Namaž chleba máslem.", [
    { value: "Sněz chleba se sýrem.", why: "To je až poslední krok." },
    { value: "Kup v obchodě chleba.", why: "To by bylo před prvním krokem." },
    { value: "Umyj po sobě talíř.", why: "To je až po jídle." },
  ], {
    hints: ["Co se dělá s chlebem, než na něj dáš sýr?", "Chybějící krok musí sedět přesně mezi „vezmi chleba“ a „polož sýr“."],
    explanation: "Mezi vzetím chleba a položením sýra chleba namažeme máslem.",
  }),
  choice("Který popis koláče je nejpřesnější?", "Koláč byl kulatý a zlatohnědý.", [
    { value: "Koláč byl pěkný a dobrý.", why: "„Pěkný a dobrý“ nic konkrétního neřekne." },
    { value: "Koláč jsme hned snědli.", why: "To je děj, ne popis." },
    { value: "Koláč byl z naší kuchyně.", why: "To neříká, jak koláč vypadá." },
  ], {
    hints: ["Ze které věty si koláč opravdu představíš?", "Přesný popis uvádí konkrétní vlastnosti — tvar, barvu, velikost."],
    explanation: "Tvar (kulatý) a barva (zlatohnědý) jsou konkrétní vlastnosti — popis je přesný.",
  }),
  choice("V popisu stojí „Stůl je velký a dobrý.“ Co chybí?", "materiál a rozměry", [
    { value: "jméno výrobce", why: "Výrobce do popisu nepatří." },
    { value: "cena stolu", why: "Cena není vlastnost, kterou vidíme." },
    { value: "příběh stolu", why: "Příběh patří do vypravování." },
  ], {
    hints: ["Z čeho je stůl a jak přesně je velký?", "„Velký“ a „dobrý“ jsou obecná slova. Konkrétní popis řekne, z čeho stůl je a kolik měří."],
    explanation: "Chybí materiál a rozměry, třeba: dřevěný stůl dlouhý jeden metr.",
  }),
  choice("V jakém pořadí popíšeš osobu?", "celkový vzhled, obličej, oblečení, povaha", [
    { value: "povaha, oblečení, obličej, celkový vzhled", why: "Popis jde od celku k podrobnostem, ne naopak." },
    { value: "jméno, adresa, telefon", why: "To jsou údaje, ne popis." },
    { value: "oblečení, jméno, věk", why: "Chybí celkový vzhled i povaha." },
  ], {
    hints: ["Čeho si na člověku všimneš jako prvního?", "Od toho, co vidíš hned, k podrobnostem — a na konec to, co poznáš až časem: povahu."],
    explanation: "Popis osoby jde od celkového vzhledu přes obličej a oblečení k povaze.",
  }),
  choice("Které přídavné jméno popíše materiál hrnku?", "keramický", [
    { value: "hezký", why: "„Hezký“ je názor, ne materiál." },
    { value: "velký", why: "„Velký“ je velikost, ne materiál." },
    { value: "horký", why: "„Horký“ je teplota, ne materiál." },
  ], {
    hints: ["Z čeho je hrnek vyrobený?", "Materiál odpovídá na otázku „z čeho?“ — třeba dřevěný, plastový, skleněný."],
    explanation: "„Keramický“ říká, z čeho je hrnek — z keramiky.",
  }),
  choice("Kterou větu napíšeš do pracovního postupu?", "Potom těsto vlij do formy.", [
    { value: "Těsto bylo sladké.", why: "To je popis těsta, ne krok." },
    { value: "Byl jednou jeden koláč.", why: "Tak začíná pohádka." },
    { value: "Forma je kulatá a kovová.", why: "To je popis předmětu." },
  ], {
    hints: ["Která věta říká, co máš udělat?", "Věta z postupu je pokyn — co udělat a kdy (potom, nejprve)."],
    explanation: "„Potom těsto vlij do formy“ je krok postupu — říká, co udělat.",
  }),
  choice("Který text popisuje povahu, a ne vzhled?", "Jana je veselá a vždycky pomůže.", [
    { value: "Jana je vysoká a má culíky.", why: "Výška a culíky jsou vzhled." },
    { value: "Jana nosí modré tričko.", why: "Oblečení je vzhled." },
    { value: "Jana má pihy na nose.", why: "Pihy jsou vzhled." },
  ], {
    hints: ["Který text neuvidíš na fotce?", "Povaha se pozná podle chování — jak se Jana chová k ostatním."],
    explanation: "Veselost a ochota pomoci jsou povaha — na fotce je neuvidíš.",
  }),
  choice("Proč pracovní postup píšeme po krocích?", "aby podle něj šla věc udělat", [
    { value: "aby byl delší", why: "O délku nejde." },
    { value: "aby se rýmoval", why: "Postup se nerýmuje." },
    { value: "protože je to pohádka", why: "Postup není pohádka." },
  ], {
    hints: ["Co by se stalo, kdyby kroky byly přeházené?", "Postup je návod. Kdo ho čte, dělá jeden krok po druhém — a musí mu to vyjít."],
    explanation: "Kroky v pořadí umožní podle postupu věc opravdu udělat.",
  }),
  choice("Proč popis předmětu začíná celkem?", "čtenář si nejdřív představí celou věc", [
    { value: "celek je nejkratší", why: "O délku nejde." },
    { value: "podrobnosti nejsou důležité", why: "Důležité jsou, jen přijdou později." },
    { value: "tak se píšou pohádky", why: "S pohádkou to nesouvisí." },
  ], {
    hints: ["Kam by si čtenář zařadil zip, kdyby nevěděl, že jde o batoh?", "Čtenář nejdřív potřebuje vědět, jak vypadá celek — pak ví, kam jednotlivé podrobnosti patří."],
    explanation: "Když čtenář nejdřív pozná celou věc, podrobnosti si k ní snadno přiřadí.",
  }),
  choice("Které slovo do popisu osoby nepatří?", "zítra", [
    { value: "vysoký", why: "„Vysoký“ popisuje vzhled — patří tam." },
    { value: "laskavý", why: "„Laskavý“ popisuje povahu — patří tam." },
    { value: "zrzavý", why: "„Zrzavý“ popisuje vzhled — patří tam." },
  ], {
    hints: ["Které slovo neříká nic o tom, jak člověk vypadá nebo jaký je?", "Tři slova jsou vlastnosti člověka — vzhled nebo povaha. Jedno slovo s člověkem nesouvisí, říká čas."],
    explanation: "„Zítra“ je časové slovo, žádnou vlastnost člověka neříká.",
  }),
];

const L3: PracticeTask[] = [
  choice("Kamarád napsal: „Můj pes je hezký a hodný.“ Jak mu poradíš, aby byl popis lepší?", "ať napíše velikost, barvu srsti a uši", [
    { value: "ať přidá ještě „moc hezký“", why: "Další obecné slovo nic neřekne." },
    { value: "ať napíše, kolik pes stál", why: "Cena psa nepopíše." },
    { value: "ať vypráví, co pes včera dělal", why: "To je vypravování, ne popis." },
  ], {
    hints: ["Představíš si psa, o kterém víš jen, že je hezký?", "Popis potřebuje to, co je vidět — jak je pes velký, jakou má srst a jak vypadají jeho uši a ocas. Obecná slova nepomohou."],
    explanation: "Popis zlepší konkrétní vlastnosti, které jsou vidět — velikost, barva srsti, uši.",
  }),
  choice("Popisuješ svůj pokoj. Co napíšeš jako první?", "jak je pokoj velký a co v něm je", [
    { value: "jakou barvu má jedna tužka na stole", why: "To je drobná podrobnost, patří až na konec." },
    { value: "co se v pokoji stalo včera", why: "To je vypravování." },
    { value: "kolik stál nový koberec", why: "Cena do popisu nepatří." },
  ], {
    hints: ["Co má čtenář vidět jako první, když vejde do pokoje?", "Od celku k podrobnostem: celý pokoj, pak nábytek, nakonec drobnosti."],
    explanation: "Začneme celkem — jak je pokoj velký a co v něm je. Podrobnosti přijdou potom.",
  }),
  choice("Seřaď kroky: A) Zalij semínko vodou. B) Nasyp do květináče hlínu. C) Udělej v hlíně důlek. D) Vlož do důlku semínko.", "B, C, D, A", [
    { value: "A, B, C, D", why: "Zalít semínko jde až poté, co je v hlíně." },
    { value: "B, D, C, A", why: "Semínko nejde vložit do důlku, který ještě není." },
    { value: "C, B, D, A", why: "Důlek nejde udělat bez hlíny." },
  ], {
    hints: ["Co musí být v květináči jako první?", "Každý krok potřebuje ten předchozí: bez hlíny není důlek, bez důlku nevložíš semínko, bez semínka nemáš co zalít."],
    explanation: "Nejdřív hlína (B), pak důlek (C), semínko (D) a nakonec zalít (A).",
  }),
  choice("Co je špatně v postupu „Upeč koláč. Pak smíchej těsto. Nakonec zapni troubu.“?", "kroky jsou v obráceném pořadí", [
    { value: "chybí nadpis", why: "Nadpis není hlavní chyba — postup nejde provést." },
    { value: "věty jsou moc krátké", why: "Krátké věty v postupu nevadí." },
    { value: "nic, je to správně", why: "Koláč nejde upéct dřív, než je těsto." },
  ], {
    hints: ["Dá se upéct koláč, když ještě není těsto?", "Přečti kroky a představ si, že je děláš. Co musí být dřív?"],
    explanation: "Kroky jsou obráceně. Správně: zapni troubu, smíchej těsto, upeč koláč.",
  }),
  choice("Popis „Hrnek je bílý a keramický, vpravo má ouško a nahoře modrý proužek.“ Jak autor postupoval?", "od celku k podrobnostem", [
    { value: "od podrobností k celku", why: "Autor začal celým hrnkem, ne proužkem." },
    { value: "podle času", why: "Popis neřadí děje v čase." },
    { value: "náhodně", why: "Popis má jasné pořadí." },
  ], {
    hints: ["Co autor řekl jako první a co až potom?", "Nejdřív celý hrnek (bílý, keramický), potom jeho části (ouško, proužek)."],
    explanation: "Autor začal celkem (bílý keramický hrnek) a pak přidal podrobnosti (ouško, proužek).",
  }),
  choice("Který text je nejlepší popis osoby?", "Děda je vysoký, má bílé vousy a rád vypráví vtipy.", [
    { value: "Děda je prostě náš děda.", why: "Nic o dědovi neříká." },
    { value: "Děda byl včera na houbách.", why: "To je děj, ne popis." },
    { value: "Děda je hodně moc hodný a hodný.", why: "Opakování obecného slova nic nepopíše." },
  ], {
    hints: ["Ze kterého textu si dědu představíš a poznáš, jaký je?", "Dobrý popis osoby má vzhled (postava, vlasy, vousy) i povahu (co člověk rád dělá, jak se chová)."],
    explanation: "Text má vzhled (vysoký, bílé vousy) i povahu (rád vypráví vtipy).",
  }),
  choice("Chceš napsat, jak si správně čistit zuby. Jaký druh popisu to bude?", "popis pracovního postupu", [
    { value: "popis předmětu", why: "Nepopisuješ kartáček, ale co dělat." },
    { value: "popis osoby", why: "Nepopisuješ člověka." },
    { value: "vypravování", why: "Nevyprávíš příběh." },
  ], {
    hints: ["Popisuješ věc, člověka, nebo činnost po krocích?", "Když někomu vysvětluješ, jak něco udělat, píšeš kroky za sebou."],
    explanation: "Čištění zubů po krocích je popis pracovního postupu.",
  }),
  choice("Chceš napsat, jak vypadá tvůj nový penál. Jaký druh popisu to bude?", "popis předmětu", [
    { value: "popis pracovního postupu", why: "Nepíšeš, jak něco udělat." },
    { value: "popis osoby", why: "Penál není člověk." },
    { value: "vypravování", why: "Nevyprávíš, co se stalo." },
  ], {
    hints: ["Je penál věc, člověk, nebo činnost?", "Když říkáš, jak věc vypadá, z čeho je a k čemu slouží, vybíráš druh, který se jmenuje podle toho, co popisuješ."],
    explanation: "Penál je věc — píšeme popis předmětu.",
  }),
  choice("Chceš napsat, jaká je tvoje sestra. Jaký druh popisu to bude?", "popis osoby", [
    { value: "popis předmětu", why: "Sestra není věc." },
    { value: "popis pracovního postupu", why: "Nepíšeš návod." },
    { value: "vypravování", why: "Nevyprávíš příběh, ale popisuješ člověka." },
  ], {
    hints: ["Koho nebo co popisuješ?", "Když popisuješ člověka — jak vypadá a jaký je — je to druh popisu, který se jmenuje podle toho, koho popisuješ."],
    explanation: "Sestra je člověk — píšeme popis osoby (vzhled i povahu).",
  }),
  choice("Která věta patří do popisu předmětu, a ne do vypravování?", "Míč je kulatý, kožený a má černobílé šestiúhelníky.", [
    { value: "Míč jsem včera kopl až do okna.", why: "To je děj — vypravování." },
    { value: "Nejprve míč nafoukneme pumpičkou.", why: "To je krok postupu." },
    { value: "Míč je super a mám ho moc ráda.", why: "To je pocit, ne vlastnost." },
  ], {
    hints: ["Která věta ti řekne, jak míč vypadá?", "Popis předmětu uvádí tvar, materiál a vzhled. Vypravování říká, co se stalo."],
    explanation: "Tvar (kulatý), materiál (kožený) a vzor (šestiúhelníky) jsou vlastnosti míče.",
  }),
  choice("V popisu osoby stojí jen „Petr je vysoký.“ Co doplníš, aby byl popis úplnější?", "další rysy vzhledu a povahu", [
    { value: "Petrovu adresu", why: "Adresa není popis člověka." },
    { value: "co měl Petr k obědu", why: "To je děj, ne popis." },
    { value: "Petrovo rodné číslo", why: "To je osobní údaj, ne popis." },
  ], {
    hints: ["Co ještě o Petrovi potřebuješ vědět, aby sis ho představil nebo představila?", "Úplný popis osoby má víc rysů vzhledu (vlasy, oči, oblečení) a také povahu — jak se Petr chová k ostatním."],
    explanation: "Doplníme další rysy vzhledu (vlasy, oči, oblečení) a povahu.",
  }),
  choice("Proč do popisu předmětu nepatří věta „Je to můj nejmilejší míč na světě“?", "vyjadřuje pocit, ne vlastnost", [
    { value: "je příliš krátká", why: "Délka věty nevadí." },
    { value: "míče se nepopisují", why: "Míče se popisovat dají." },
    { value: "patří na začátek", why: "Pocit do věcného popisu nepatří nikam." },
  ], {
    hints: ["Dozvíš se z té věty, jak míč vypadá?", "Věcný popis říká, jaká věc je. To, co k ní cítíme, do něj nepatří."],
    explanation: "Věta vyjadřuje pocit, ne vlastnost míče — do věcného popisu nepatří.",
  }),
  choice("Co napíšeš na začátek receptu na palačinky?", "seznam surovin a nádobí", [
    { value: "příběh o babiččině kuchyni", why: "Příběh do receptu nepatří." },
    { value: "hodnocení, jak palačinky chutnaly", why: "To patří nanejvýš na konec." },
    { value: "poslední krok postupu", why: "Poslední krok je na konci." },
  ], {
    hints: ["Co si připravíš, než začneš vařit?", "Recept nejdřív vyjmenuje, co budeš potřebovat. Pak teprve přijdou kroky."],
    explanation: "Recept začíná seznamem surovin a nádobí, pak následují kroky.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const POPISPREDMETUOSOBYAPRACOVNIHOPOSTUPU: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-predmetu-osoby-a-pracovniho-postupu",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-predmetu-osoby-a-pracovniho-postupu",
    displayName: "Popis a pracovní postup",
    title: "Popis předmětu, osoby a pracovního postupu",
    studentTitle: "Popis věcí a lidí",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se správně popisovat věci, osoby i pracovní postup.",
    keywords: ["popis", "předmět", "osoba", "pracovní postup", "vzhled", "povaha", "od celku k detailu"],
    goals: [
      "Popsat předmět od celku k podrobnostem",
      "Popsat osobu (vzhled i povahu)",
      "Seřadit kroky pracovního postupu",
    ],
    boundaries: ["Bez literárního portrétu", "Bez odborného technického popisu"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-casovou-posloupnosti-osnova"],
    generator: gen,
    helpTemplate: {
      hint: "Předmět: od celku k podrobnostem; osoba: vzhled i povaha; postup: kroky za sebou (nejprve, potom, nakonec)",
      steps: [
        "Věc, člověk, nebo činnost?",
        "Věc a člověk: od celku k podrobnostem.",
        "Činnost: co budeš potřebovat, pak kroky v pořadí.",
        "Piš konkrétně — barva, tvar, materiál místo „hezký“.",
      ],
      commonMistake: "Obecná slova („hezký“, „dobrý“) místo konkrétních vlastností; přeházené kroky postupu",
      example: "Tužka je dřevěná, šestihranná, na konci má gumu. / Nejprve nalij vodu, potom přidej čaj.",
    },
  },
];
