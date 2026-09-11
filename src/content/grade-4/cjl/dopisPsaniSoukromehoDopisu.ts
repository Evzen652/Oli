import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Původní pool si protiřečil
// (jednou text po oslovení „začíná velkým písmenem“, jindy „malým“),
// tvrdil, že za oslovení nepatří vykřičník (patří — „Milá Evo!“ je
// správně), a měl gramatické chyby („Jaký interpunkční znaménko“,
// „Babičce podepíšeme se“). Úlohy, u kterých se pravidla liší podle
// příručky, tu nejsou.
//
// L1 = části dopisu a obálka · L2 = oslovení, tykání a vykání, co chybí
// L3 = rozbor krátkých dopisů a volba tónu podle adresáta.

const L1: PracticeTask[] = [
  choice("Co patří do záhlaví dopisu?", "místo a datum", [
    { value: "oslovení", why: "Oslovení (Milá babičko,) přichází až pod záhlavím." },
    { value: "podpis", why: "Podpis je až na konci dopisu." },
    { value: "pozdrav na rozloučenou", why: "Rozloučení patří do závěru dopisu." },
  ], {
    hints: ["Záhlaví je úplně nahoře. Co by adresát chtěl vědět jako první — odkud a kdy dopis přišel?", "V záhlaví jsou dva údaje: kde byl dopis napsán a kterého dne. Oslovení, text i podpis přicházejí až pod ním."],
    explanation: "Záhlaví je nahoře a říká, kde a kdy byl dopis napsán — proto do něj patří místo a datum.",
  }),
  choice("Kde v soukromém dopise obvykle stojí místo a datum?", "vpravo nahoře", [
    { value: "vlevo dole", why: "Dole je závěr a podpis." },
    { value: "uprostřed textu", why: "Uprostřed je vlastní text dopisu." },
    { value: "pod podpisem", why: "Pod podpisem už dopis končí." },
  ], {
    hints: ["Místo a datum jsou první věc, kterou adresát uvidí. Kde na papíře tedy budou?", "Záhlaví se píše nad oslovení, do horního rohu — do toho, který je naproti začátku řádků. Oslovení i text začínají u levého okraje."],
    explanation: "Místo a datum se v soukromém dopise píšou vpravo nahoře, nad oslovení.",
  }),
  choice("Čím dopis končí?", "pozdravem a podpisem", [
    { value: "oslovením", why: "Oslovením dopis naopak začíná." },
    { value: "místem a datem", why: "Místo a datum jsou v záhlaví, úplně nahoře." },
    { value: "nadpisem", why: "Dopis nadpis nemá." },
  ], {
    hints: ["Jak se loučíš, když od někoho odcházíš?", "Na konci se s adresátem rozloučíme (Měj se hezky) a podepíšeme, aby věděl, od koho dopis je."],
    explanation: "Dopis končí rozloučením a podpisem, aby adresát věděl, kdo mu píše.",
  }),
  choice("Které oslovení se hodí do dopisu kamarádovi Petrovi?", "Milý Petře,", [
    { value: "Vážený pane Petře,", why: "„Vážený pane“ je úřední oslovení pro dospělé, které neznáme." },
    { value: "Milý Petr,", why: "Když někoho oslovujeme, používáme 5. pád: Petře, ne Petr." },
    { value: "Petr!", why: "Chybí přátelské „Milý“ a jméno je v 1. pádě místo 5. pádu." },
  ], {
    hints: ["Kamarádovi píšeš přátelsky. A v jakém tvaru jméno použiješ, když na někoho voláš?", "Oslovujeme 5. pádem (Tomáši, Evo, Honzo). Kamarádovi se hodí vřelé „Milý“, úřední „Vážený pane“ ne."],
    explanation: "Kamarádovi napíšeme přátelsky „Milý“ a jméno dáme do 5. pádu: Milý Petře,",
  }),
  choice("Jak oslovíš v dopise babičku?", "Milá babičko,", [
    { value: "Vážená paní babičko,", why: "Takové oslovení je úřední — babičce píšeme vřele." },
    { value: "Milá babička,", why: "Oslovujeme 5. pádem: babičko, ne babička." },
    { value: "Babičko Nováková,", why: "Babičku neoslovujeme příjmením." },
  ], {
    hints: ["Babička je blízký člověk. Jak na ni zavoláš, když ji potřebuješ?", "Blízkým píšeme vřele (Milá…) a jméno nebo slovo dáme do 5. pádu, stejně jako když na někoho voláme."],
    explanation: "Babičce napíšeme vřele a v 5. pádě: Milá babičko,",
  }),
  choice("Komu v dopise tykáme?", "kamarádům a rodině", [
    { value: "řediteli školy", why: "Řediteli vykáme, je to úřední dopis." },
    { value: "cizímu člověku", why: "Cizím lidem vykáme." },
    { value: "úřadu", why: "Úřadu píšeme úředně a vykáme." },
  ], {
    hints: ["Komu tykáš, když s ním mluvíš?", "V dopise to platí stejně jako v řeči: tykáme blízkým lidem, cizím a úředním osobám vykáme."],
    explanation: "Tykáme lidem, kterým tykáme i v řeči — kamarádům a rodině. Cizím lidem a úřadům vykáme.",
  }),
  choice("Který znak se píše za oslovením, když text pokračuje na dalším řádku?", "čárka", [
    { value: "tečka", why: "Oslovení není celá věta, tečka za něj nepatří." },
    { value: "dvojtečka", why: "Dvojtečka se za oslovení nepíše." },
    { value: "otazník", why: "Oslovení není otázka." },
  ], {
    hints: ["Je oslovení celá věta, nebo jen začátek dopisu, na který navazuje text?", "Za oslovením dopis ještě pokračuje, proto nepíšeme znak, který větu ukončuje. Nejčastěji se píše znak, který odděluje části věty."],
    explanation: "Za oslovením se nejčastěji píše čárka: Milá Evo, a text pokračuje na dalším řádku.",
  }),
  choice("Proč do dopisu píšeme datum?", "aby adresát věděl, kdy byl dopis napsán", [
    { value: "aby pošta věděla, kam dopis doručit", why: "Pro poštu je adresa na obálce, ne datum v dopise." },
    { value: "aby byl dopis delší a hezčí", why: "Datum dopis neprodlužuje, nese důležitou informaci." },
    { value: "protože bez data se dopis nesmí poslat", why: "Takové pravidlo neexistuje — datum je kvůli adresátovi." },
  ], {
    hints: ["Dopis může jít několik dní. Co by adresát chtěl vědět, když čte „včera jsme byli v ZOO“?", "Bez data by adresát netušil, ve který den se to, o čem píšeš, stalo — „včera“ může znamenat cokoli. Datum je údaj pro čtenáře dopisu, ne pro poštu."],
    explanation: "Datum říká adresátovi, kdy byl dopis napsán — bez něj by nevěděl, kdy se popsané věci staly.",
  }),
  choice("Na obálce vpravo dole je adresa…", "toho, komu dopis posíláme", [
    { value: "toho, kdo dopis posílá", why: "Odesílatel se píše vlevo nahoře nebo na zadní stranu obálky." },
    { value: "pošty, která ho doručí", why: "Adresa pošty na obálku nepatří." },
    { value: "školy, do které chodíš", why: "Škola na obálku nepatří, jen když jí píšeš." },
  ], {
    hints: ["Kam má pošťák dopis donést?", "Na obálce jsou dvě adresy: větší vpravo dole pro doručení a menší vlevo nahoře (nebo vzadu) pro vrácení."],
    explanation: "Vpravo dole je adresa adresáta, tedy toho, komu dopis posíláme. Odesílatel je vlevo nahoře nebo vzadu.",
  }),
  choice("Co patří do adresy na obálce?", "jméno, ulice s číslem, PSČ a obec", [
    { value: "jméno a telefonní číslo adresáta", why: "Pošta podle telefonu nedoručuje, potřebuje ulici a obec." },
    { value: "jen město a jméno adresáta", why: "Bez ulice a PSČ pošťák nenajde, kam dopis donést." },
    { value: "jméno a e-mailová adresa", why: "E-mail slouží k elektronické poště, ne k doručení obálky." },
  ], {
    hints: ["Co všechno pošťák potřebuje, aby našel správné dveře?", "Pošta potřebuje vědět, komu (jméno), kde přesně (ulice a číslo domu) a ve kterém místě (PSČ a obec)."],
    explanation: "Adresa obsahuje jméno, ulici s číslem domu, PSČ a obec — podle toho pošta dopis doručí.",
  }),
  choice("V jakém pořadí jdou části dopisu shora dolů?", "záhlaví, oslovení, text, podpis", [
    { value: "oslovení, záhlaví, text, podpis", why: "Záhlaví s místem a datem je úplně nahoře, nad oslovením." },
    { value: "text, oslovení, záhlaví, podpis", why: "Text přichází až po oslovení." },
    { value: "záhlaví, text, oslovení, podpis", why: "Oslovení je před textem, ne za ním." },
  ], {
    hints: ["Co je úplně nahoře a co úplně dole?", "Nahoře je místo a datum, pak se na adresáta obrátíme, potom mu napíšeme, co chceme, a nakonec se podepíšeme."],
    explanation: "Dopis jde shora dolů: záhlaví (místo a datum), oslovení, vlastní text a na konci pozdrav s podpisem.",
  }),
  choice("Co je vlastní text dopisu?", "to, co chceme adresátovi sdělit", [
    { value: "místo a datum", why: "To je záhlaví." },
    { value: "jméno odesílatele", why: "Jméno je v podpisu." },
    { value: "oslovení adresáta", why: "Oslovení je před textem." },
  ], {
    hints: ["Proč dopis vůbec píšeme?", "Záhlaví, oslovení a podpis jsou rámec dopisu. Uprostřed je to nejdůležitější — naše zpráva."],
    explanation: "Vlastní text je hlavní část dopisu — to, co chceme adresátovi říct.",
  }),
  choice("Proč se text dopisu dělí do odstavců?", "aby se lépe četl", [
    { value: "aby byl dopis delší", why: "O délku nejde, odstavce pomáhají čtenáři." },
    { value: "protože to chce pošta", why: "Pošta obsah dopisu nečte." },
    { value: "aby se ušetřil papír", why: "Odstavce papír spíš spotřebují — jde o přehlednost." },
  ], {
    hints: ["Jak se ti čte dlouhý text bez jediného odstavce?", "Každý odstavec je o jedné věci. Čtenář tak pozná, kde končí jedna myšlenka a začíná druhá."],
    explanation: "Odstavce dělí text podle myšlenek, takže se dopis lépe čte.",
  }),
];

const L2: PracticeTask[] = [
  choice("Píšeš paní učitelce. Které oslovení je správné?", "Vážená paní učitelko,", [
    { value: "Ahoj paní učitelko,", why: "„Ahoj“ je pozdrav pro kamarády, učitelce se nehodí." },
    { value: "Vážená paní učitelka,", why: "Oslovujeme 5. pádem: učitelko." },
    { value: "Milá učitelko,", why: "Bez slova „paní“ zní oslovení dospělého neuctivě." },
  ], {
    hints: ["Učitelce vykáš. Jaké oslovení je zdvořilé? A jaký pád při oslovení používáme?", "Dospělým, kterým vykáme, píšeme zdvořilé oslovení se slovem „paní“ nebo „pane“ a jméno či slovo dáme do 5. pádu (učitelko, ne učitelka)."],
    explanation: "Učitelce píšeme zdvořile a v 5. pádě: Vážená paní učitelko,",
  }),
  choice("Která věta je v dopise řediteli napsaná správně?", "Děkuji Vám za pomoc.", [
    { value: "Děkuji ti za pomoc.", why: "Řediteli netykáme." },
    { value: "Díky moc za pomoc!", why: "„Díky moc“ je kamarádské, řediteli píšeme zdvořile." },
    { value: "Děkuju, že jsi mi pomohl.", why: "„Jsi“ je tykání — řediteli vykáme." },
  ], {
    hints: ["Řediteli tykáš, nebo vykáš?", "Když vykáme jednomu člověku v dopise, píšeme zájmena ze zdvořilosti s velkým písmenem a volíme spisovná, zdvořilá slova."],
    explanation: "Řediteli vykáme a v dopise píšeme ze zdvořilosti velké V: Děkuji Vám za pomoc.",
  }),
  choice("Doplň do dopisu kamarádce: „Moc ___ děkuji za dárek.“", "ti", [
    { value: "Vám", why: "„Vám“ je vykání — kamarádce tykáme." },
    { value: "jim", why: "„Jim“ bychom napsali o více lidech, ne o kamarádce." },
    { value: "jí", why: "„Jí“ bychom napsali o někom třetím, ne té, které píšeme." },
  ], {
    hints: ["Kamarádce tykáš. Jaké zájmeno patří k „ty“ ve 3. pádě?", "K „ty“ patří tvary tebe, tobě, ti. Vykání (Vám) patří dospělým a cizím lidem."],
    explanation: "Kamarádce tykáme, proto „ti“: Moc ti děkuji za dárek.",
  }),
  choice("Který závěr se hodí do dopisu babičce?", "Posílám pusu, tvoje Anička", [
    { value: "S úctou Anna Nováková", why: "„S úctou“ a celé jméno jsou úřední, babičce píšeme vřele." },
    { value: "Na shledanou, vedení školy", why: "Tak se podepisuje škola, ne vnučka." },
    { value: "S pozdravem, Vaše žákyně", why: "Takhle by se podepsala žákyně učitelce." },
  ], {
    hints: ["Jak se loučíš s babičkou, když od ní odjíždíš?", "Blízkým se loučíme vřele a podepisujeme se tak, jak nám říkají doma, třeba s „tvoje/tvůj“."],
    explanation: "Babičce se hodí vřelé rozloučení a podpis, jakým ji zdravíme doma: Posílám pusu, tvoje Anička.",
  }),
  choice("Který řádek je záhlaví dopisu?", "V Brně 12. května 2026", [
    { value: "Milý Tome,", why: "To je oslovení." },
    { value: "Měj se hezky, Eva", why: "To je závěr s podpisem." },
    { value: "Minulý týden jsme byli na výletě.", why: "To je věta z vlastního textu." },
  ], {
    hints: ["Který řádek říká, kde a kdy byl dopis napsán?", "Záhlaví tvoří místo a datum. Hledej řádek s názvem obce a s dnem, měsícem a rokem."],
    explanation: "Záhlaví obsahuje místo a datum: V Brně 12. května 2026.",
  }),
  choice("Co chybí v dopise: „Milá Evo, včera jsme byli v ZOO a viděli jsme slony. Měj se, Jana“?", "místo a datum", [
    { value: "oslovení", why: "Oslovení tam je: Milá Evo," },
    { value: "podpis", why: "Podpis tam je: Jana." },
    { value: "vlastní text", why: "Text tam je: včera jsme byli v ZOO…" },
  ], {
    hints: ["Projdi části dopisu jednu po druhé. Která z nich tam není?", "Dopis má záhlaví, oslovení, text a podpis. Tři z nich v ukázce najdeš, jedna úplně chybí — ta, která by byla úplně nahoře."],
    explanation: "Dopis má oslovení, text i podpis, ale chybí záhlaví — místo a datum.",
  }),
  choice("Co chybí v dopise: „Brno 3. 4. 2026 — Byli jsme u moře a bylo tam krásně. — Tvůj Ondra“?", "oslovení", [
    { value: "místo a datum", why: "Záhlaví tam je: Brno 3. 4. 2026." },
    { value: "podpis", why: "Podpis tam je: Tvůj Ondra." },
    { value: "vlastní text", why: "Text tam je: Byli jsme u moře…" },
  ], {
    hints: ["Komu je ten dopis určen? Poznáš to z něj?", "Mezi záhlavím a textem obvykle stojí řádek, kterým se obrátíme na adresáta (Milý…, Milá…). Je tam?"],
    explanation: "Dopis má záhlaví, text i podpis, ale chybí oslovení — nevíme, komu je určen.",
  }),
  choice("Dopis končí slovy „Měj se hezky“. Co za ně ještě patří?", "podpis", [
    { value: "datum", why: "Datum patří nahoru do záhlaví." },
    { value: "oslovení", why: "Oslovení je na začátku dopisu." },
    { value: "adresa", why: "Adresa patří na obálku." },
  ], {
    hints: ["Jak adresát pozná, od koho dopis je?", "Po rozloučení už zbývá jen jedna část: napíšeme, kdo dopis posílá."],
    explanation: "Za rozloučení patří podpis, aby adresát věděl, kdo mu píše.",
  }),
  choice("Kterou větu napíšeš do dopisu kamarádovi?", "Jak se máš? Těším se, až tě uvidím.", [
    { value: "Jak se máte? Těším se na setkání s Vámi.", why: "To je vykání — kamarádovi tykáme." },
    { value: "Sděluji Vám, že přijedu v sobotu.", why: "„Sděluji Vám“ je úřední obrat s vykáním." },
    { value: "Dovoluji si Vás srdečně pozdravit.", why: "Tak se píše úředně, ne kamarádovi." },
  ], {
    hints: ["Kamarádovi tykáš. Ve které větě je „ty“, a ne „Vy“?", "Kamarádovi píšeš stejně, jako s ním mluvíš: přátelsky a s tykáním. Úřední obraty (sděluji, dovoluji si) se hodí do žádosti."],
    explanation: "Kamarádovi tykáme a píšeme přátelsky: Jak se máš? Těším se, až tě uvidím.",
  }),
  choice("Proč v dopise píšeme „Vy“ s velkým V?", "ze zdvořilosti k tomu, komu vykáme", [
    { value: "protože je to vždy začátek věty", why: "„Vy“ může stát kdekoli ve větě." },
    { value: "protože je to vlastní jméno", why: "„Vy“ je zájmeno, ne jméno." },
    { value: "protože je to zkratka", why: "Nejde o zkratku." },
  ], {
    hints: ["Komu takhle píšeš — kamarádovi, nebo řediteli?", "Velké písmeno tu nevyžaduje pravidlo o začátku věty ani o jménech. Vyjadřuje úctu člověku, kterému vykáme."],
    explanation: "Velké V u „Vy, Vám, Vás“ vyjadřuje v dopise úctu k tomu, komu vykáme.",
  }),
  choice("V dopise stojí „Milý Honzo.“ Co je špatně?", "za oslovením nemá být tečka", [
    { value: "chybí datum", why: "Datum sem nepatří, je v záhlaví." },
    { value: "má tam být „Honza“", why: "Oslovujeme 5. pádem — „Honzo“ je správně." },
    { value: "oslovení má být na konci", why: "Oslovením dopis začíná." },
  ], {
    hints: ["Podívej se na znak za jménem. Končí tím oslovení, nebo dopis ještě pokračuje?", "Oslovení není celá věta, proto za ním tečka nebývá. Nejčastěji se píše čárka, případně vykřičník."],
    explanation: "Za oslovení se tečka nepíše. Správně je „Milý Honzo,“ (nebo s vykřičníkem).",
  }),
  choice("Píšeš strýci, kterému doma tykáš. Jak ho oslovíš?", "Milý strýčku,", [
    { value: "Vážený pane strýci,", why: "Strýci tykáš, úřední oslovení se nehodí." },
    { value: "Milý strýček,", why: "Oslovujeme 5. pádem: strýčku." },
    { value: "Ahoj strýc,", why: "Jméno má být v 5. pádě: strýčku." },
  ], {
    hints: ["Jak na strýce zavoláš, když ho vidíš?", "Strýc je blízký příbuzný — píšeš vřele. A slovo dáš do 5. pádu, stejně jako když někoho voláš."],
    explanation: "Strýci tykáme, píšeme vřele a v 5. pádě: Milý strýčku,",
  }),
  choice("Proč se do dopisu kamarádovi nehodí závěr „S úctou“?", "je to úřední rozloučení", [
    { value: "je to sprosté slovo", why: "Sprosté to není — jen je příliš úřední." },
    { value: "píše se jen na obálku", why: "Na obálku rozloučení nepatří." },
    { value: "patří na začátek dopisu", why: "Je to rozloučení, patří na konec." },
  ], {
    hints: ["Kdo píše „S úctou“ — kamarád, nebo úředník?", "Tón závěru má odpovídat adresátovi. Kamarádovi se loučíme přátelsky, „S úctou“ patří do dopisů úřadům a cizím lidem."],
    explanation: "„S úctou“ je úřední rozloučení. Kamarádovi napíšeme třeba „Měj se hezky, tvůj Petr“.",
  }),
];

const L3: PracticeTask[] = [
  choice("Který dopis má všechny části?", "Praha 2. 6. 2026 / Milá Evo, / na táboře je krásně… / Měj se, Petra", [
    { value: "Milá Evo, / na táboře je krásně… / Měj se, Petra", why: "Chybí záhlaví s místem a datem." },
    { value: "Praha 2. 6. 2026 / na táboře je krásně… / Měj se, Petra", why: "Chybí oslovení." },
    { value: "Praha 2. 6. 2026 / Milá Evo, / na táboře je krásně…", why: "Chybí rozloučení a podpis." },
  ], {
    hints: ["U každého dopisu odškrtej: záhlaví, oslovení, text, podpis.", "Tři dopisy mají jen tři části ze čtyř. Hledej ten, který má místo a datum, oslovení, text i podpis."],
    explanation: "Jen první dopis má záhlaví (Praha 2. 6. 2026), oslovení (Milá Evo,), text i závěr s podpisem.",
  }),
  choice("Která věta do dopisu řediteli nepatří?", "Ahoj, pane řediteli, jak se máš?", [
    { value: "Vážený pane řediteli, dovoluji si Vás požádat o radu.", why: "Zdvořilé oslovení a vykání — do dopisu řediteli patří." },
    { value: "Děkuji Vám za odpověď.", why: "Vykání s velkým V je v dopise řediteli správně." },
    { value: "S pozdravem Tomáš Novák", why: "Zdvořilý závěr s celým jménem sem patří." },
  ], {
    hints: ["Která věta by se hodila spíš ke kamarádovi?", "Řediteli vykáme a píšeme zdvořile. Hledej větu s tykáním a kamarádským pozdravem."],
    explanation: "„Ahoj, jak se máš?“ je tykání a kamarádský pozdrav — řediteli vykáme a píšeme zdvořile.",
  }),
  choice("Která věta do dopisu kamarádovi nepatří?", "Sděluji Vám, že jsem obdržel Váš dopis.", [
    { value: "Díky za dopis, moc mě potěšil.", why: "Přátelská věta s tykáním — kamarádovi se hodí." },
    { value: "Příští týden jedeme k moři.", why: "Obyčejná novinka — do dopisu kamarádovi patří." },
    { value: "Napiš mi brzy!", why: "Přátelská prosba s tykáním sem patří." },
  ], {
    hints: ["Která věta zní jako z úřadu?", "Kamarádovi tykáme a píšeme obyčejně. Obraty jako „sděluji“ a „obdržel“ s vykáním patří do úředních dopisů."],
    explanation: "„Sděluji Vám, že jsem obdržel Váš dopis“ je úřední věta s vykáním — kamarádovi se nehodí.",
  }),
  choice("Kdo napsal dopis „Brno 5. 5. 2026 / Milá Jano, / … / Tvoje Klára“?", "Klára", [
    { value: "Jana", why: "Jana je oslovená — ta dopis dostane." },
    { value: "Brno", why: "Brno je místo, kde byl dopis napsán." },
    { value: "nedá se poznat", why: "Dá — pisatel se podepisuje na konci." },
  ], {
    hints: ["Která část dopisu prozradí, kdo ho psal?", "Na začátku je jméno toho, komu píšeme (v oslovení). Jméno pisatele najdeš na konci."],
    explanation: "Pisatel se podepisuje na konci: Tvoje Klára. Jana je adresátka.",
  }),
  choice("Komu je určen dopis „Plzeň 1. 3. 2026 / Milý dědečku, / … / Tvůj Martin“?", "dědečkovi", [
    { value: "Martinovi", why: "Martin dopis napsal — je podepsaný na konci." },
    { value: "Plzni", why: "Plzeň je místo v záhlaví." },
    { value: "babičce", why: "Babička v dopise není." },
  ], {
    hints: ["Na koho se dopis obrací hned na začátku?", "Adresáta poznáš podle oslovení pod záhlavím. Podpis na konci patří pisateli."],
    explanation: "Oslovení „Milý dědečku,“ prozrazuje, že dopis je pro dědečka. Martin je pisatel.",
  }),
  choice("Kde byl napsán dopis „Ostrava 7. 9. 2026 / Milá teto, / … / Tvoje Lucka“?", "v Ostravě", [
    { value: "u tety", why: "Teta dopis dostane — kde je ona, z dopisu nevíme." },
    { value: "u Lucky doma", why: "Tak podrobně to dopis neříká — místo je v záhlaví." },
    { value: "nedá se poznat", why: "Dá — místo je v záhlaví." },
  ], {
    hints: ["Která část dopisu říká, kde byl napsán?", "Záhlaví obsahuje místo a datum. Přečti první řádek dopisu."],
    explanation: "Místo je v záhlaví: Ostrava. Dopis byl napsán v Ostravě.",
  }),
  choice("Píšeš nemocné kamarádce. Jaký tón zvolíš?", "přátelský a povzbudivý", [
    { value: "úřední a strohý", why: "Kamarádce píšeme přátelsky, úřední tón by ji nepotěšil." },
    { value: "vyčítavý", why: "Nemocnou kamarádku chceme potěšit, ne jí něco vyčítat." },
    { value: "posměšný", why: "Posmívat se nemocnému je zlé." },
  ], {
    hints: ["Co by nemocnou kamarádku potěšilo?", "Tón dopisu volíme podle adresáta a situace. Kamarádce, které není dobře, chceme dodat sílu."],
    explanation: "Nemocné kamarádce napíšeme přátelsky a povzbudivě, třeba „Brzy se uzdrav!“.",
  }),
  choice("Kterou větou můžeš v dopise kamarádovi přejít k nové myšlence?", "A teď ti napíšu, co jsme dělali o víkendu.", [
    { value: "Vzhledem k výše uvedenému sděluji následující.", why: "To je úřední obrat, kamarádovi se nehodí." },
    { value: "Konec dopisu.", why: "Tím by dopis skončil, nic by nepřešlo dál." },
    { value: "Viz příloha číslo jedna.", why: "To se píše v úředních listinách." },
  ], {
    hints: ["Kterou větu bys řekl nebo řekla kamarádovi, když začínáš vyprávět něco nového?", "Nový odstavec v dopise kamarádovi může začít přátelskou větou, která ohlásí, o čem budeš psát dál."],
    explanation: "Přátelská věta „A teď ti napíšu, co jsme dělali o víkendu.“ uvede nový odstavec.",
  }),
  choice("Která adresa je na obálce napsaná správně?", "Jana Nováková, Lipová 12, 602 00 Brno", [
    { value: "Jana Nováková, tel. 777 123 456", why: "Telefon poště nepomůže, chybí ulice, PSČ a obec." },
    { value: "Brno, Jana, Lipová", why: "Chybí číslo domu a PSČ, pořadí je zmatené." },
    { value: "Lipová 12, Jana", why: "Chybí příjmení, PSČ i obec." },
  ], {
    hints: ["Která adresa má jméno, ulici s číslem, PSČ i obec?", "Adresa jde od jména přes ulici s číslem domu až k PSČ a obci. Jen jedna možnost má všechno."],
    explanation: "Úplná adresa: jméno, ulice s číslem domu, PSČ a obec — Jana Nováková, Lipová 12, 602 00 Brno.",
  }),
  choice("V dopise babičce stojí: „Vážená babičko, sděluji Vám, že přijedu.“ Co je špatně?", "je to příliš úřední", [
    { value: "chybí PSČ", why: "PSČ patří na obálku, ne do textu dopisu." },
    { value: "babičce se dopisy nepíšou", why: "Babičce dopis napsat můžeme — jen vřele." },
    { value: "má tam být „Vážený“", why: "Babičku oslovujeme „Milá babičko“, ne úředně." },
  ], {
    hints: ["Takhle se píše babičce, nebo úřadu?", "Babičce tykáme a píšeme vřele. „Vážená“, „sděluji“ a „Vám“ patří do úředních dopisů."],
    explanation: "Babičce píšeme vřele a tykáme: „Milá babičko, přijedu v sobotu.“ Úřední tón se nehodí.",
  }),
  choice("Proč je dobré napsat na konec dopisu otázku, třeba „A jak se máš ty?“", "adresát ví, na co odpovědět", [
    { value: "dopis je pak delší", why: "O délku nejde — otázka zve k odpovědi." },
    { value: "bez otázky pošta dopis nevezme", why: "Pošta obsah dopisu nečte." },
    { value: "otázka nahradí podpis", why: "Podpis musí být i tak." },
  ], {
    hints: ["Co udělá adresát, když v dopise najde otázku?", "Dopis je jako rozhovor na dálku. Otázka dá adresátovi chuť i téma, o čem napsat zpátky."],
    explanation: "Otázka na konci pozve adresáta, aby odpověděl, a dá mu téma odpovědi.",
  }),
  choice("Který podpis se hodí pod dopis paní učitelce?", "S pozdravem Jana Malá", [
    { value: "Pusu, Janča", why: "Tak se loučíme s rodinou a kamarády." },
    { value: "Tvoje Jana", why: "„Tvoje“ je tykání — paní učitelce vykáme." },
    { value: "Čau, Jana", why: "„Čau“ je kamarádský pozdrav." },
  ], {
    hints: ["Paní učitelce vykáš. Jaké rozloučení je zdvořilé?", "Dospělým, kterým vykáme, se loučíme zdvořile (S pozdravem) a podepisujeme se celým jménem."],
    explanation: "Paní učitelce napíšeme zdvořile „S pozdravem“ a celé jméno: S pozdravem Jana Malá.",
  }),
  choice("Dopis kamarádovi má tři odstavce: o prázdninách, o škole a o novém psovi. Proč je dobré mít je oddělené?", "každý je o jedné věci", [
    { value: "pošta čte jen první odstavec", why: "Pošta obsah dopisu nečte." },
    { value: "odstavce jsou jen v úředních dopisech", why: "Odstavce pomáhají v každém dopise." },
    { value: "aby se do dopisu vešlo méně", why: "O množství nejde, jde o přehlednost." },
  ], {
    hints: ["Jak se čte dopis, kde se prázdniny, škola a pes míchají dohromady?", "Když má každé téma svůj odstavec, čtenář hned pozná, kdy jedna věc končí a začíná další."],
    explanation: "Každý odstavec je o jedné věci, proto se dopis dobře čte a nic se nemíchá.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const DOPISPSANISOUKROMEHODOPISU: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-psani-soukromeho-dopisu",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-psani-soukromeho-dopisu",
    displayName: "Psaní dopisu",
    title: "Dopis - psaní soukromého dopisu",
    studentTitle: "Jak psát dopis",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se správně sestavit soukromý i formální dopis se všemi částmi.",
    keywords: ["dopis", "záhlaví", "oslovení", "podpis", "tykání", "vykání", "obálka"],
    goals: [
      "Poznat části dopisu a jejich pořadí",
      "Zvolit oslovení a tón podle adresáta",
      "Správně nadepsat obálku",
    ],
    boundaries: ["Bez úředních dopisů a žádostí jako samostatného útvaru", "Bez e-mailu"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-inzerat-vzkaz-telefonicky-rozhovor"],
    generator: gen,
    helpTemplate: {
      hint: "Záhlaví (místo, datum) → oslovení (5. pád, čárka) → text v odstavcích → rozloučení a podpis",
      steps: [
        "Nahoře vpravo napiš místo a datum.",
        "Oslov adresáta 5. pádem: Milá babičko,",
        "Napiš text a rozděl ho do odstavců.",
        "Rozluč se a podepiš se.",
      ],
      commonMistake: "Oslovení v 1. pádě („Milá babička“) nebo tečka za oslovením",
      example: "Brno 12. 5. 2026 / Milá babičko, / … / Posílám pusu, tvoje Anička",
    },
  },
];
