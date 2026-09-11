/**
 * Přírodověda 4. ročník — Hospodářské rostliny: obilniny, ovoce, zelenina.
 *
 * Přepsáno 2026-09-11. Původní pool neměl u žádné úlohy vlastní nápovědu,
 * vysvětlení ani diagnostiku a obsahoval látku mimo 4. ročník (GMO,
 * vertikální zemědělství, potravinová bezpečnost, biopaliva, siláž), otázku
 * na výrobu piva a dvakrát tutéž otázku na citrusy.
 *
 * Gradace:
 *  • L1 — poznat obilninu podle využití, druh zeleniny a ovoce (jeden krok).
 *  • L2 — kterou část rostliny jíme, co mají rostliny skupiny společného,
 *         kdy a jak se pěstují a sklízejí.
 *  • L3 — omyly a úvahy: brambora není kořen, rajče je plod, proč se
 *         střídají plodiny, proč jsou banány v obchodě zelené.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "./_shared";

const POOL_L1: PracticeTask[] = [
  choice("Ze které obilniny se nejčastěji mele mouka na rohlíky a chléb?", "Z pšenice", [
    { value: "Z ječmene", why: "Z ječmene se dělají hlavně kroupy a krmivo pro zvířata." },
    { value: "Z ovsa", why: "Z ovsa se dělají hlavně vločky na kaši." },
    { value: "Z rýže", why: "Rýže u nás neroste a vaří se celá zrna, na rohlíky se nemele." },
  ], {
    hints: ["Hledej obilninu, která se u nás na polích pěstuje nejvíc.", "Bílé pečivo, těstoviny i buchty se dělají z mouky jedné obilniny. Na polích v létě zlátne a má klasy bez dlouhých osin."],
    explanation: "Pšenice je u nás nejpěstovanější obilnina. Z jejích zrn se mele mouka na rohlíky, chléb, těstoviny i koláče.",
  }),
  choice("Ze které obilniny se peče tmavý chléb?", "Ze žita", [
    { value: "Z ovsa", why: "Z ovsa se dělají vločky a kaše, chléb se z něj peče jen výjimečně." },
    { value: "Z kukuřice", why: "Kukuřice se u nás pěstuje hlavně jako krmivo pro zvířata." },
    { value: "Z rýže", why: "Rýže se vaří jako příloha, tmavý chléb se z ní nepeče." },
  ], {
    hints: ["Tmavému chlebu se podle obilniny říká i jinak. Jak?", "Tmavý chléb se jmenuje po obilnině, ze které je — žitný. Která obilnina to je?"],
    explanation: "Tmavý chléb se peče ze žitné mouky, proto se mu říká žitný. Žito snese chladnější a chudší půdu než pšenice.",
  }),
  choice("Která zelenina je kořenová?", "Mrkev", [
    { value: "Salát", why: "U salátu jíme listy, je to listová zelenina." },
    { value: "Rajče", why: "Rajče je plod, je to plodová zelenina." },
    { value: "Květák", why: "Květák je košťálová zelenina, jíme jeho květ." },
  ], {
    hints: ["Hledej zeleninu, kterou vytáhneš ze země.", "U kořenové zeleniny jíme ztlustlý kořen, který roste pod zemí. Která z nich je oranžová a roste pod zemí?"],
    explanation: "U mrkve jíme ztlustlý kořen, který roste pod zemí. Proto je to kořenová zelenina, stejně jako petržel nebo celer.",
  }),
  choice("Která zelenina je listová?", "Špenát", [
    { value: "Ředkvička", why: "U ředkvičky jíme kořen, je to kořenová zelenina." },
    { value: "Okurka", why: "Okurka je plod, je to plodová zelenina." },
    { value: "Kedluben", why: "U kedlubnu jíme ztlustlý stonek, patří ke košťálové zelenině." },
  ], {
    hints: ["Hledej zeleninu, u které jíme zelené listy.", "Z listové zeleniny se dělá salát nebo zelená omáčka. Která z nich se jí jen jako listy?"],
    explanation: "U špenátu jíme listy, proto je to listová zelenina. Patří sem i salát.",
  }),
  choice("Která zelenina je plodová?", "Paprika", [
    { value: "Mrkev", why: "U mrkve jíme kořen, je to kořenová zelenina." },
    { value: "Zelí", why: "U zelí jíme listy stočené do hlávky, patří ke košťálové zelenině." },
    { value: "Cibule", why: "Cibule je cibulová zelenina, jíme její podzemní cibuli." },
  ], {
    hints: ["Hledej zeleninu, která vyroste z květu a má uvnitř semínka.", "Rozkrojíš ji a uvnitř najdeš spoustu semínek. Bývá červená, žlutá nebo zelená a dá se jíst i syrová. Která to je?"],
    explanation: "Paprika vzniká z květu a uvnitř nese semena — je to plod. Plodová zelenina je i rajče, okurka nebo dýně.",
  }),
  choice("Která zelenina je košťálová?", "Brokolice", [
    { value: "Okurka", why: "Okurka je plodová zelenina." },
    { value: "Česnek", why: "Česnek je cibulová zelenina, jako cibule nebo pórek." },
    { value: "Špenát", why: "Špenát je listová zelenina." },
  ], {
    hints: ["Košťálová zelenina je příbuzná zelí.", "K zelí patří květák, kapusta, kedluben a ještě jedna zelená zelenina s malými růžičkami. Která?"],
    explanation: "Brokolice patří ke košťálové zelenině, stejně jako zelí, kapusta, květák nebo kedluben. U brokolice jíme zelená poupata květů.",
  }),
  choice("Které ovoce má uvnitř jednu tvrdou pecku?", "Švestka", [
    { value: "Jablko", why: "Jablko má uprostřed jádřinec s několika semínky, ne pecku." },
    { value: "Rybíz", why: "Rybíz má jen drobná měkká semínka." },
    { value: "Jahoda", why: "Jahoda má drobná semínka na povrchu, pecku nemá." },
  ], {
    hints: ["Na co si musíš dát pozor, když ho jíš celé?", "Peckové ovoce má uprostřed jedno velké tvrdé semeno. Takové je i třešeň nebo meruňka. Které z nabídky?"],
    explanation: "Švestka je peckové ovoce — uprostřed má jednu tvrdou pecku, ve které je semeno. Peckové jsou i třešně, meruňky a broskve.",
  }),
  choice("Které ovoce má uprostřed jádřinec se semínky?", "Hruška", [
    { value: "Třešeň", why: "Třešeň má jednu pecku, je to peckové ovoce." },
    { value: "Meruňka", why: "Meruňka má jednu pecku, je to peckové ovoce." },
    { value: "Malina", why: "Malina se skládá z mnoha drobných plodů, jádřinec nemá." },
  ], {
    hints: ["Jádřinec je to, co zbude, když obkoušeš jablko.", "Jádrové ovoce má uprostřed pouzdro s několika semínky. Jablku je nejvíc podobné to z nabídky, které má tvar kapky."],
    explanation: "Hruška je jádrové ovoce, stejně jako jablko. Uprostřed má jádřinec s několika semínky. Třešeň a meruňka mají pecku.",
  }),
  choice("Které ovoce u nás venku nevyroste a dováží se z teplých krajů?", "Banán", [
    { value: "Švestka", why: "Švestky rostou na stromech v zahradách a sadech po celém Česku." },
    { value: "Hruška", why: "Hrušky u nás rostou v zahradách a sadech." },
    { value: "Rybíz", why: "Rybíz je keř, který roste skoro na každé zahradě." },
  ], {
    hints: ["Které z nich jsi nikdy neviděl růst na zahradě?", "Tři druhy ovoce vyrostou na české zahradě. Jedno potřebuje teplo celý rok a vozí se lodí z daleka."],
    explanation: "Banány rostou jen v teplých krajích, kde nemrzne. K nám se dovážejí lodí. Švestky, hrušky i rybíz se u nás pěstují běžně.",
  }),
  choice("Která z těchto rostlin je luštěnina?", "Čočka", [
    { value: "Pšenice", why: "Pšenice je obilnina, zrna má v klasu, ne v lusku." },
    { value: "Kukuřice", why: "Kukuřice je obilnina, zrna má na palici." },
    { value: "Okurka", why: "Okurka je plodová zelenina." },
  ], {
    hints: ["Luštěniny mají semena v luscích, jako hrách.", "Hledej rostlinu, jejíž drobná placatá semínka se vaří na polévku nebo kaši. Rostou v malých luscích."],
    explanation: "Čočka je luštěnina — její semena rostou v luscích. Luštěniny jsou i hrách, fazole a sója.",
  }),
  choice("Kde se rýže pěstuje nejlépe?", "Na zaplavených polích v teplých krajích", [
    { value: "Na suchých polích v horách", why: "Rýže potřebuje hodně vody a tepla, hory jsou pro ni chladné a suché." },
    { value: "Na loukách v Česku", why: "V Česku je na rýži moc chladno. Dováží se z Asie." },
    { value: "V lese pod stromy", why: "V lese je stín. Rýže potřebuje hodně slunce, tepla a vody." },
  ], {
    hints: ["Rýže je obilnina, která potřebuje hodně vody.", "Rýžová pole jsou zaplavená vodou a jsou v krajích, kde je teplo celý rok. Která možnost to popisuje?"],
    explanation: "Rýže roste na polích zaplavených vodou, kterým se říká rýžoviště. Potřebuje teplo, proto se pěstuje hlavně v Asii.",
  }),
  choice("Která rostlina se u nás pěstuje na výrobu cukru?", "Řepa cukrovka", [
    { value: "Řepka olejka", why: "Řepka má podobné jméno, ale lisuje se z ní olej. Na jaře kvete žlutě." },
    { value: "Brambory", why: "Z brambor se dělá škrob, cukr ne." },
    { value: "Ječmen", why: "Z ječmene se dělají kroupy a krmivo." },
  ], {
    hints: ["Pozor na dvě podobná jména v nabídce.", "Rostlina má pod zemí velkou bílou bulvu plnou sladké šťávy. Jmenuje se podle toho, co se z ní vyrábí."],
    explanation: "Cukr se u nás vyrábí z bulvy řepy cukrovky. Řepka olejka má podobné jméno, ale lisuje se z ní olej.",
  }),
  choice("Ze semen které rostliny se lisuje jedlý olej?", "Slunečnice", [
    { value: "Pšenice", why: "Z pšenice se mele mouka." },
    { value: "Brambory", why: "Z brambor se dělá škrob a jedí se hlízy." },
    { value: "Hrách", why: "Hrách je luštěnina, vaří se a jí." },
  ], {
    hints: ["Hledej rostlinu s velkým žlutým květem, který se otáčí za sluncem.", "Semínka této rostliny louskají ptáci na krmítku a lidé z nich lisují olej. Jak se ta rostlina jmenuje?"],
    explanation: "Ze semen slunečnice se lisuje jedlý olej. Semena jsou mastná, proto je mají rádi i ptáci. Olej se lisuje i z řepky.",
  }),
];

const POOL_L2: PracticeTask[] = [
  choice("U mrkve jíme ztlustlý kořen. Kterou část jíme u salátu?", "Listy", [
    { value: "Kořen", why: "Kořen salátu je tenký a nejí se. Jíme to, co roste nad zemí." },
    { value: "Plody", why: "Salát nemá jedlé plody. Sklízíme ho dřív, než pokvete." },
    { value: "Hlízy", why: "Hlízy mají brambory, salát ne." },
  ], {
    hints: ["Salát je listová zelenina.", "Co odtrháváš od hlávky salátu, když ho umýváš?"],
    explanation: "U salátu jíme listy, proto je to listová zelenina. U každé zeleniny jíme jinou část: u mrkve kořen, u rajčete plod, u salátu listy.",
  }),
  choice("Kedluben roste nad zemí a je kulatý. Kterou část rostliny jíme?", "Ztlustlý stonek", [
    { value: "Kořen", why: "Kedluben roste nad zemí. Kořen má pod ním a nejí se." },
    { value: "Plod", why: "Plod vzniká z květu a nese semena. Kedluben semena uvnitř nemá." },
    { value: "Květ", why: "Květ jíme u květáku nebo brokolice, ne u kedlubnu." },
  ], {
    hints: ["Kedluben roste nad zemí a z něj vyrůstají listy.", "Listy vyrůstají ze stonku. Co je tedy ta kulatá část, ze které listy trčí?"],
    explanation: "U kedlubnu jíme ztlustlý stonek. Poznáš to podle toho, že z něj vyrůstají listy. Kořen je pod ním v zemi.",
  }),
  choice("U které zeleniny jíme květ, dokud je v poupěti?", "Květák", [
    { value: "Kedluben", why: "U kedlubnu jíme ztlustlý stonek." },
    { value: "Zelí", why: "U zelí jíme listy stočené do hlávky." },
    { value: "Mrkev", why: "U mrkve jíme kořen." },
  ], {
    hints: ["Jméno té zeleniny ti napoví.", "Bílá hlávka z malých poupat — kdyby ji zelinář nesklidil, rozkvetla by. Jak se jmenuje?"],
    explanation: "Květák je nerozkvetlé květenství — spousta poupat těsně u sebe. Podobně je to u brokolice.",
  }),
  choice("Hrách, fazole a čočka jsou luštěniny. Proč jsou pro tělo cenné?", "Mají hodně bílkovin", [
    { value: "Mají nejvíc vitamínu C", why: "Hodně vitamínu C má ovoce a čerstvá zelenina, třeba paprika nebo citron." },
    { value: "Obsahují hodně tuku", why: "Hodně tuku mají ořechy nebo semena slunečnice, luštěniny málo." },
    { value: "Jsou nejsladší ze zeleniny", why: "Luštěniny sladké nejsou. Sladké je ovoce." },
  ], {
    hints: ["Z čeho si tělo staví svaly?", "Luštěniny mohou v jídle nahradit část masa. Co mají s masem společného?"],
    explanation: "Luštěniny obsahují hodně bílkovin, ze kterých si tělo staví svaly a opravuje se. Proto mohou v jídle nahradit část masa.",
  }),
  choice("Maminka koupila čočku, fazole a hrách. Co mají společného?", "Jejich semena rostou v luscích", [
    { value: "Rostou pod zemí jako brambory", why: "Luštěniny rostou nad zemí, semena mají v luscích na rostlině." },
    { value: "Jsou to druhy obilí", why: "Obilniny mají zrna v klasech. Čočka, fazole a hrách jsou luštěniny." },
    { value: "Dovážejí se jen z tropů", why: "Hrách i fazole se běžně pěstují i v Česku." },
  ], {
    hints: ["Vzpomeň si, jak vypadá hrách na zahradě.", "Zelený hrášek se loupe z něčeho podlouhlého. Stejně rostou i fazole a čočka. Jak se to podlouhlé pouzdro jmenuje?"],
    explanation: "Čočka, fazole i hrách jsou luštěniny: jejich semena rostou v luscích. Proto se jim tak říká.",
  }),
  choice("Které ovoce si můžeš vypěstovat na zahradě v Česku?", "Meruňky", [
    { value: "Pomeranče", why: "Pomeranče potřebují teplo celý rok. U nás by v zimě zmrzly." },
    { value: "Banány", why: "Banány rostou jen v tropech, u nás venku nevyrostou." },
    { value: "Ananas", why: "Ananas roste v tropech, dováží se." },
  ], {
    hints: ["Tři z nich rostou jen tam, kde nikdy nemrzne.", "Hledej peckové ovoce, které dozrává v létě na stromech hlavně na jižní Moravě."],
    explanation: "Meruňky u nás rostou na stromech, nejlépe na teplé jižní Moravě. Pomeranče, banány a ananas potřebují teplo celý rok, proto se dovážejí.",
  }),
  choice("Kdy se u nás sklízí pšenice?", "V létě, když klasy zezlátnou", [
    { value: "Na jaře hned po zasetí", why: "Na jaře pšenice teprve roste a je zelená. Zrna ještě nemá." },
    { value: "V zimě pod sněhem", why: "V zimě na polích nic nedozrává. Obilí se sklízí v létě." },
    { value: "Kdykoli během roku", why: "Obilí dozraje jen jednou za rok, v létě." },
  ], {
    hints: ["Kdy vidíš na polích kombajny?", "Pšenice je nejdřív zelená, pak se klasy zbarví dozlatova a zrna ztvrdnou. Ve kterém ročním období?"],
    explanation: "Pšenice dozrává v létě. Klasy zezlátnou a zrna ztvrdnou, pak se pole sklidí kombajnem. Této době se říká žně.",
  }),
  choice("Které ovoce u nás dozrává mezi prvními, už v červnu?", "Jahody", [
    { value: "Švestky", why: "Švestky dozrávají až koncem léta a na podzim." },
    { value: "Jablka", why: "Většina jablek dozrává koncem léta a na podzim." },
    { value: "Vlašské ořechy", why: "Vlašské ořechy se sklízejí až na podzim." },
  ], {
    hints: ["Která z nich jíš na začátku letních prázdnin?", "Nízká rostlinka na záhoně, červené plody se semínky na povrchu. Dozrává, když končí škola."],
    explanation: "Jahody dozrávají už v červnu, mezi prvním ovocem v roce. Švestky, jablka a ořechy dozrávají až koncem léta a na podzim.",
  }),
  choice("Brambory se na jaře sázejí. Co se zasadí do země?", "Celé hlízy nebo jejich kousky", [
    { value: "Semínka z květů", why: "Brambory kvetou, ale nesázejí se ze semínek. Sázejí se hlízy." },
    { value: "Kořínky", why: "Z kořínků se brambory nesázejí. Nová rostlina vyroste z hlízy." },
    { value: "Listy", why: "Listy by v zemi shnily. Nová rostlina vyroste z hlízy." },
  ], {
    hints: ["Co zůstane ve sklepě, když brambora na jaře vyklíčí?", "Z brambory ve sklepě na jaře vyrostou klíčky. Když ji dáš do země, vyroste z ní celá nová rostlina."],
    explanation: "Brambory se sázejí jako hlízy nebo jejich kousky s očky. Z oček vyrostou klíčky a z nich nová rostlina, pod kterou se v zemi vytvoří nové hlízy.",
  }),
  choice("Proč lidé pěstují obilí víc než jiné plodiny?", "Ze zrna je mouka na hlavní potraviny", [
    { value: "Protože nepotřebuje vodu", why: "Obilí potřebuje vodu jako každá rostlina. Při suchu dá malou úrodu." },
    { value: "Protože se nemusí sklízet", why: "Obilí se sklízí kombajnem, bez sklizně by zrna vypadala." },
    { value: "Protože jíme jeho listy", why: "U obilí jíme zrna, ne listy." },
  ], {
    hints: ["Co všechno se dělá z mouky?", "Chléb, rohlíky, těstoviny, kaše — všechno to jíme skoro každý den. Z čeho to všechno je?"],
    explanation: "Ze zrn obilnin je mouka, vločky a kroupy, a z nich chléb, pečivo, těstoviny a kaše, které jíme každý den. Proto se obilí pěstuje nejvíc.",
  }),
  choice("Proč jsou jahody v prosinci drahé?", "Vozí se z daleka nebo ze skleníků", [
    { value: "V prosinci je víc lidí kupuje", why: "Hlavní důvod je jinde. V prosinci u nás jahody venku nerostou." },
    { value: "Zimní jahody jsou větší", why: "Velikost cenu nevysvětlí. V zimě u nás jahody venku nerostou." },
    { value: "V prosinci je jich nejvíc", why: "Je to naopak, jahody u nás dozrávají v červnu." },
  ], {
    hints: ["Kdy jahody u nás dozrávají venku na záhonech?", "V prosinci je u nás zima. Odkud se tedy jahody do obchodu musí dostat a co to stojí?"],
    explanation: "Jahody u nás venku dozrávají v červnu. V prosinci se musí dovézt z teplých krajů nebo vypěstovat ve vytápěném skleníku. Doprava i topení stojí peníze.",
  }),
  choice("K čemu se u nás pěstuje nejvíc kukuřice?", "Jako krmivo pro zvířata", [
    { value: "Na výrobu cukru", why: "Cukr se vyrábí z řepy cukrovky." },
    { value: "Na mouku na rohlíky", why: "Mouka na rohlíky se mele z pšenice." },
    { value: "Na kroupy do polévky", why: "Kroupy se dělají z ječmene." },
  ], {
    hints: ["Co jedí krávy a prasata na farmě?", "Popcorn a kukuřice v konzervě jsou jen malá část. Většinu vysokých kukuřičných polí sní někdo ve stájích."],
    explanation: "Většina kukuřice u nás slouží jako krmivo pro dobytek a prasata. Jen menší část se jí, třeba jako popcorn nebo sladká kukuřice.",
  }),
  choice("Která rostlina z pole na jaře kvete žlutě a lisuje se z ní olej?", "Řepka olejka", [
    { value: "Pšenice", why: "Pšenice nekvete žlutě, z jejích zrn se mele mouka." },
    { value: "Hrách", why: "Hrách je luštěnina, olej se z něj nelisuje." },
    { value: "Řepa cukrovka", why: "Jméno je podobné, ale z řepy cukrovky se vyrábí cukr." },
  ], {
    hints: ["V dubnu a květnu uvidíš celá pole zářivě žlutá.", "Pozor na dvě podobná jména. Jedna rostlina dává cukr, druhá olej. Která kvete žlutě?"],
    explanation: "Řepka olejka na jaře rozkvete a pole zežloutnou. Z jejích semen se lisuje olej. Řepa cukrovka má podobné jméno, ale dává cukr.",
  }),
];

const POOL_L3: PracticeTask[] = [
  choice("Brambory rostou pod zemí. Kterou část rostliny jíme?", "Podzemní hlízy", [
    { value: "Kořeny", why: "Brambory rostou pod zemí, ale nejsou kořen. Kořínky jsou tenké, hlíza je zásobárna." },
    { value: "Plody", why: "Plody brambor jsou malé zelené bobulky nad zemí a jsou jedovaté." },
    { value: "Semena", why: "Semena jsou v bobulkách nad zemí. Pod zemí jsou hlízy." },
  ], {
    hints: ["Ne všechno, co roste pod zemí, je kořen.", "Mrkev je kořen, ale brambora ne — vyrůstají z ní klíčky a má očka. Jak se takové zásobárně pod zemí říká?"],
    explanation: "U brambor jíme hlízy. Jsou to podzemní zásobárny, ze kterých vyrážejí klíčky. Kořeny jsou tenké a nejí se. Plody jsou zelené bobulky nad zemí a jsou jedovaté.",
  }),
  choice("Rajče v kuchyni počítáme k zelenině. Proč ho přírodovědec nazve plodem?", "Vzniká z květu a nese semena", [
    { value: "Protože roste nad zemí", why: "Nad zemí rostou i listy a stonky. Plod poznáš podle květu a semen." },
    { value: "Protože je červené a šťavnaté", why: "Barva ani šťáva nerozhoduje. Rozhoduje, z čeho vzniklo a co nese." },
    { value: "Protože roste na stromě", why: "Rajče neroste na stromě, ale na bylině. A plody mají i byliny." },
  ], {
    hints: ["Co bylo na rostlině rajčete dřív, než vyrostlo rajče?", "Nejdřív se na rostlině objeví žlutý kvítek. Co z něj pak vyroste a co najdeš uvnitř?"],
    explanation: "Plod je část rostliny, která vzniká z květu a nese semena. Rajče takhle vzniká, proto je to plod — v kuchyni ho ale kvůli chuti počítáme k zelenině.",
  }),
  choice("Proč zemědělec nepěstuje na stejném poli pšenici každý rok?", "Půda by se vyčerpala a namnožili by se škůdci", [
    { value: "Pšenice by vyrostla moc vysoká", why: "Výška pšenice na tom nezávisí. Problém je v půdě a ve škůdcích." },
    { value: "Pšenice roste jen každý druhý rok", why: "Pšenice může růst každý rok. Jen by jí to na stejném poli škodilo." },
    { value: "Pšenice by pak neměla zrna", why: "Zrna by měla, ale úroda by byla menší a rostliny nemocnější." },
  ], {
    hints: ["Každá rostlina bere z půdy jiné živiny.", "Když rok co rok roste na poli totéž, co se stane s živinami, které ta rostlina potřebuje? A komu se tam bude dařit?"],
    explanation: "Stejná plodina bere z půdy každý rok stejné živiny, až jich ubude. A škůdci a choroby, které ji napadají, se na poli rok od roku množí. Proto se plodiny na poli střídají.",
  }),
  choice("Proč zemědělci sypou na pole hnůj nebo kompost?", "Vrací do půdy živiny, které rostliny spotřebovaly", [
    { value: "Aby odehnal ptáky", why: "Hnůj ptáky neodhání. Slouží jako hnojivo." },
    { value: "Aby byla půda tvrdší", why: "Hnůj a kompost dělají půdu kyprou a úrodnou, ne tvrdou." },
    { value: "Aby rostliny nepotřebovaly vodu", why: "Vodu rostliny potřebují vždycky. Hnůj jim dodává živiny." },
  ], {
    hints: ["Co si rostlina bere ze země, když roste?", "Rostliny si z půdy berou živiny a my je pak sklidíme a odvezeme. Jak je do půdy dostat zpátky?"],
    explanation: "Rostliny berou z půdy živiny. Hnůj a kompost je tam vrátí a půda zůstane úrodná. Proto jsou to hnojiva.",
  }),
  choice("Kukuřice potřebuje hodně tepla. Kde v Česku poroste nejlépe?", "V teplých nížinách na jižní Moravě", [
    { value: "Na horách v Krkonoších", why: "Na horách je chladno a krátké léto, kukuřice by nedozrála." },
    { value: "V lese ve stínu stromů", why: "Ve stínu je chladno a tma. Kukuřice potřebuje slunce." },
    { value: "Na severních svazích hor", why: "Severní svahy jsou stinné a chladné, na kukuřici se nehodí." },
  ], {
    hints: ["Kde je v Česku nejtepleji?", "Hory jsou chladné a stín je chladný. Kde jsou nížiny, dlouhé léto a pěstuje se tam i vinná réva?"],
    explanation: "Kukuřice potřebuje teplo a dlouhé léto. Nejlépe se jí daří v teplých nížinách, třeba na jižní Moravě, kde se pěstuje i vinná réva a meruňky.",
  }),
  choice("Proč nejíme brambory, které na světle zezelenaly?", "Zelené části brambor jsou jedovaté", [
    { value: "Jsou ještě nezralé a tvrdé", why: "Zezelenání neznamená nezralost. Na světle se v bramboře tvoří jed." },
    { value: "Zelená barva je plíseň", why: "Plíseň je chlupatý povlak. Zelená barva je jiná změna a je jedovatá." },
    { value: "Mají málo vitamínů", why: "O vitamíny nejde. Zelená část brambory může způsobit otravu." },
  ], {
    hints: ["Proč se brambory skladují ve tmě?", "Na světle se v slupce brambory tvoří látka, která škodí zdraví. Proto se zelená místa vykrajují."],
    explanation: "Když brambory leží na světle, zezelenají a vytvoří se v nich jedovatá látka. Zelená místa se musí vykrojit, proto se brambory skladují ve tmě.",
  }),
  choice("Proč jsou banány v obchodě často ještě zelené?", "Sklízejí se nezralé, aby cestou nezkazily", [
    { value: "Zelené banány jsou zdravější", why: "O zdraví nejde. Banány dozrávají cestou a v obchodě." },
    { value: "V tropech jsou banány vždycky zelené", why: "V tropech banány na rostlině zežloutnou taky. Trhají se ale dřív." },
    { value: "Obchod je obarví nazeleno", why: "Banány se nebarví. Zelené jsou proto, že ještě nedozrály." },
  ], {
    hints: ["Jak dlouho trvá cesta lodí z tropů do Česka?", "Zralý banán rychle zhnědne. Kdyby ho utrhli zralý, jak by vypadal po týdnech na lodi?"],
    explanation: "Banány se trhají zelené, protože cesta lodí trvá týdny a zralé by se cestou zkazily. Dozrávají až cestou a v obchodě.",
  }),
  choice("Který řetězec správně ukazuje cestu od pole k rohlíku?", "pšenice – zrno – mouka – těsto – rohlík", [
    { value: "pšenice – mouka – zrno – těsto – rohlík", why: "Mouka se mele ze zrna, takže zrno musí být před moukou." },
    { value: "zrno – pšenice – těsto – mouka – rohlík", why: "Těsto se dělá z mouky, takže mouka musí být před těstem." },
    { value: "pšenice – těsto – zrno – mouka – rohlík", why: "Těsto nejde udělat přímo z pšenice. Nejdřív se sklidí zrno a namele mouka." },
  ], {
    hints: ["Ptej se u každého kroku: z čeho se to udělá?", "Rohlík se peče z těsta. Těsto se zadělá z mouky. A mouka se mele z něčeho, co se sklidí z pšenice."],
    explanation: "Z pšenice se sklidí zrno, ze zrna se namele mouka, z mouky se zadělá těsto a z těsta se upeče rohlík. Každý krok potřebuje ten předchozí.",
  }),
  choice("Mrkev se musí sít každý rok, jabloň ne. Proč?", "Jabloň je strom, který plodí mnoho let", [
    { value: "Jabloň nemá semena", why: "Jabloň semena má, najdeš je v jádřinci. Nesází se ale každý rok." },
    { value: "Jabloň se sklízí jen každý druhý rok", why: "Jabloň plodí každý rok. Důvod je, že jako strom žije dlouho." },
    { value: "Mrkev roste jen v zimě", why: "Mrkev roste přes léto. Po sklizni z ní nová mrkev nevyroste." },
  ], {
    hints: ["Co se stane s mrkví, když ji sklidíš?", "Mrkev vytáhneš ze země celou a je konec. Jabloň zůstane stát a za rok zase kvete. Jak dlouho asi strom žije?"],
    explanation: "Když sklidíme mrkev, vytáhneme celou rostlinu, a proto se musí zasít znovu. Jabloň je strom — sklidíme jen jablka a strom plodí další desítky let.",
  }),
  choice("Paprika má víc vitamínu C než citron. Co z toho plyne?", "Vitamín C najdeš i v zelenině", [
    { value: "Citrony nemají žádný vitamín", why: "Citrony vitamín C mají, jen paprika ho má ještě víc." },
    { value: "Paprika je vlastně ovoce", why: "V kuchyni paprika zůstává zeleninou. Otázka je o vitamínu, ne o zařazení." },
    { value: "Vitamíny má jen dovážené jídlo", why: "Paprika se pěstuje i u nás. Vitamíny má čerstvé ovoce i zelenina." },
  ], {
    hints: ["Kde lidé nejčastěji hledají vitamín C? A kde ho je podle zadání ještě víc?", "Paprika je zelenina, která roste i na naší zahradě. Co z toho plyne o tom, kde všude se dá vitamín C najít?"],
    explanation: "Vitamín C nemají jen citrusy. Hodně ho má čerstvá zelenina, třeba paprika, a také zelí nebo brokolice. Pestrá strava ho dodá i bez dovozu.",
  }),
  choice("Luštěniny mají hodně bílkovin. Co mohou v jídle nahradit?", "Část masa", [
    { value: "Ovoce", why: "Ovoce dodává hlavně vitamíny a cukr. Luštěniny ho nenahradí." },
    { value: "Pitnou vodu", why: "Vodu nenahradí žádné jídlo, tělo ji potřebuje každý den." },
    { value: "Sladkosti", why: "Luštěniny nejsou sladké a nemají s nimi společné nic." },
  ], {
    hints: ["Kde jinde najdeš hodně bílkovin?", "Bílkoviny jsou v mase, vejcích a mléce. Které z nabídnutých jídel má luštěniny podobné?"],
    explanation: "Maso je hlavní zdroj bílkovin. Luštěniny jich mají taky hodně, proto třeba čočka nebo fazole mohou v jídle nahradit část masa.",
  }),
  choice("Proč lidé ovoce na zimu suší, zavařují nebo mrazí?", "Aby vydrželo, když nic nedozrává", [
    { value: "Aby mělo víc vitamínů", why: "Vitamínů při tom spíš ubude. Jde o to, aby ovoce vydrželo." },
    { value: "Aby bylo sladší než čerstvé", why: "Sladkost není důvod. Čerstvé ovoce by se rychle zkazilo." },
    { value: "Protože čerstvé ovoce škodí", why: "Čerstvé ovoce je zdravé. Jen dlouho nevydrží." },
  ], {
    hints: ["Kolik ovoce dozrává na zahradě v prosinci?", "Na podzim je jablek a švestek víc, než se dá sníst. Co se s nimi stane za pár týdnů, když s nimi nic neuděláš?"],
    explanation: "Čerstvé ovoce se brzy zkazí a v zimě u nás nic nedozrává. Sušením, zavařováním a mražením vydrží dlouho, takže ho můžeme jíst celý rok.",
  }),
  choice("Zemědělec zasel pšenici už na podzim. Co se s ní děje v zimě?", "Vzejde a přečká zimu jako malé rostlinky", [
    { value: "Semena v zemi zmrznou a zahynou", why: "Ozimá pšenice je na zimu připravená. Malé rostlinky mráz přečkají." },
    { value: "Přes zimu dozraje", why: "V zimě nic nedozrává. Tato pšenice dozraje až v létě." },
    { value: "Zemědělec ji v zimě sklidí", why: "V zimě se nesklízí. Pšenice se sklízí v létě." },
  ], {
    hints: ["Takové pšenici se říká ozimá. Zkus ze slova uhodnout, kdy je na poli.", "Na podzim ze semen vyraší zelené lístky a pak je přikryje sníh. Co s nimi bude, až sníh na jaře roztaje?"],
    explanation: "Ozimá pšenice se zasévá na podzim. Vzejde, přes zimu přečká pod sněhem jako malé rostlinky a na jaře rychle roste. Proto dá větší úrodu než jarní.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const HOSPODARSKEROSTLINYOBILNINYOVOCEZELENINA: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-hospodarske-rostliny-obilniny-ovoce-zelenina",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-hospodarske-rostliny-obilniny-ovoce-zelenina",
    title: "Hospodářské rostliny - obilniny, ovoce, zelenina",
    studentTitle: "Rostliny z polí",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš obilniny, ovoce a zeleninu a jak se pěstují.",
    keywords: ["pšenice", "ječmen", "žito", "oves", "kukuřice", "rýže", "luštěniny", "zelenina", "ovoce", "brambory"],
    goals: [
      "Jmenovat hlavní obilniny a jejich využití",
      "Rozlišit kořenovou, listovou, plodovou a košťálovou zeleninu",
      "Rozlišit peckové a jádrové ovoce, ovoce mírného a teplého pásma",
      "Vysvětlit, co jsou luštěniny a proč jsou cenné",
      "Vysvětlit základní péči o pole (hnojení, střídání plodin)",
    ],
    boundaries: ["Podrobná agrotechnika a výrobní procesy nejsou náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Zeptej se, kterou část rostliny jíme a kde roste.",
      steps: [
        "Obilniny: pšenice (mouka), žito (tmavý chléb), oves (vločky), ječmen (kroupy), kukuřice (krmivo).",
        "Zelenina: kořenová (mrkev), listová (salát), plodová (rajče), košťálová (zelí), cibulová (cibule).",
        "Ovoce: peckové (švestka), jádrové (jablko), dovážené z teplých krajů (banán).",
        "Luštěniny: hrách, fazole, čočka — semena v luscích, hodně bílkovin.",
      ],
      commonMistake: "Brambora není kořen, ale hlíza. Rajče je z pohledu přírodovědy plod.",
      example: "U mrkve jíme kořen, u salátu listy, u rajčete plod a u kedlubnu stonek.",
    },
  },
];
