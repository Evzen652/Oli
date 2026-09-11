import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { urceni, type Kategorie, type Polozka } from "../_urceni";
const zac = (s: string) => s.replace(/[„“]/g, "").split(" ").slice(0, 5).join(" ") + "…";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem. Teď: L1 jaký druh čtení se hodí
// k situaci · L2 techniky studijního čtení (nadpisy, výpisky, klíčová slova)
// · L3 najít a použít údaj z krátkého věcného textu (jízdní řád, ceník…).

const DRUHY: Kategorie[] = [
  { nazev: "studijní čtení", znak: "čtu pomalu, abych se to naučil nebo naučila; podtrhávám a dělám výpisky." },
  { nazev: "vyhledávací čtení", znak: "hledám v textu jednu konkrétní informaci, zbytek přeskočím." },
  { nazev: "zážitkové čtení", znak: "čtu pro radost a zábavu, třeba pohádku nebo dobrodružnou knihu." },
  { nazev: "přehledové čtení", znak: "rychle proletím text, abych věděl nebo věděla, o čem je." },
];
const ST = "studijní čtení", VY = "vyhledávací čtení", ZA = "zážitkové čtení", PR = "přehledové čtení";
const Sit = (situace: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven: 1, slovo: situace, veta: situace, kategorie, klic, proc });

const SITUACE: Polozka[] = [
  Sit("Zítra píšeš test z přírodovědy a potřebuješ se naučit kapitolu o ptácích.", ST, "potřebuješ si látku zapamatovat", "Učení na test — studijní čtení."),
  Sit("V jízdním řádu hledáš, v kolik jede autobus do Lipové.", VY, "zajímá tě jediný údaj", "Jeden údaj — vyhledávací čtení."),
  Sit("Večer si v posteli otevřeš dobrodružnou knihu o pirátech.", ZA, "čteš pro radost", "Pro radost — zážitkové čtení."),
  Sit("V knihovně držíš knihu o dinosaurech a chceš rychle zjistit, jestli se ti hodí do referátu.", PR, "chceš jen rychle zjistit, o čem kniha je", "Rychlá orientace — přehledové čtení."),
  Sit("Učíš se z učebnice vlastivědy, kdy a proč vznikla Československá republika.", ST, "musíš porozumět a zapamatovat si souvislosti", "Učení — studijní čtení."),
  Sit("V receptu zjišťuješ, kolik vajec potřebuješ.", VY, "hledáš jedno číslo", "Jeden údaj — vyhledávací čtení."),
  Sit("O prázdninách čteš napínavý detektivní příběh.", ZA, "čteš, protože tě příběh baví", "Zábava — zážitkové čtení."),
  Sit("Ráno rychle projedeš titulky školního časopisu, co je nového.", PR, "chceš jen vědět, o čem se píše", "Rychlý přehled — přehledové čtení."),
  Sit("Připravuješ si z encyklopedie poznámky na referát o sovách.", ST, "zapisuješ si to nejdůležitější", "Poznámky a učení — studijní čtení."),
  Sit("V televizním programu hledáš, kdy začíná pohádka.", VY, "zajímá tě jen jeden čas", "Jeden údaj — vyhledávací čtení."),
  Sit("Čteš si znovu oblíbenou pohádku, protože se ti moc líbí.", ZA, "čteš kvůli radosti z příběhu", "Pro radost — zážitkové čtení."),
  Sit("Listuješ novou učebnicí, abys zjistil nebo zjistila, jaká témata v ní budou.", PR, "chceš jen rychle vědět, co v knize je", "Orientace v knize — přehledové čtení."),
  Sit("Doma si pomalu čteš kapitolu o lidském těle a podtrháváš nejdůležitější věty.", ST, "čteš pomalu a podtrháváš", "Pomalé čtení s podtrháváním — studijní čtení."),
];

const L2: PracticeTask[] = [
  choice("Co uděláš při učení z nové kapitoly jako první?", "přečtu si nadpis a podnadpisy", [
    { value: "hned se učím nazpaměť celý text", why: "Bez přehledu se text učí hůř." },
    { value: "přečtu jen poslední větu", why: "Poslední věta neřekne, o čem je celá kapitola." },
    { value: "zavřu knihu a hádám", why: "Hádáním se nic nenaučíš." },
  ], {
    hints: ["Co ti nejrychleji řekne, o čem kapitola bude?", "Než začneš číst podrobně, udělej si přehled podle toho, co je napsané větším písmem nad jednotlivými částmi."],
    explanation: "Nadpisy a podnadpisy dají přehled, o čem kapitola je.",
  }),
  choice("Co jsou výpisky?", "krátké poznámky s tím nejdůležitějším z textu", [
    { value: "celý text opsaný slovo od slova", why: "Opisování není výběr toho důležitého." },
    { value: "obrázky, které si nakreslím pro radost", why: "Výpisky jsou slova, ne kresby pro radost." },
    { value: "otázky, na které neznám odpověď", why: "Výpisky zachycují to, co jsi v textu našel nebo našla." },
  ], {
    hints: ["Proč si z kapitoly něco zapisujeme, když ji máme v knize?", "Do sešitu si zapíšeš jen jádro — pojmy, data a souvislosti — vlastními slovy a stručně."],
    explanation: "Výpisky jsou stručné poznámky s tím nejdůležitějším.",
  }),
  choice("Co si při učení v textu podtrhneš?", "klíčová slova a důležité pojmy", [
    { value: "každé druhé slovo", why: "Podtržené by bylo skoro všechno." },
    { value: "všechno, co je v kapitole", why: "Pak podtržení nic neukazuje." },
    { value: "jen slova, která se mi líbí", why: "Podtrhává se podle důležitosti, ne podle líbivosti." },
  ], {
    hints: ["Co bys potřeboval nebo potřebovala najít, až budeš opakovat?", "Podtrhává se jen málo: to, bez čeho by text ztratil smysl — názvy, data, definice."],
    explanation: "Podtrháváme klíčová slova a pojmy, abychom je při opakování hned našli.",
  }),
  choice("Jak poznáš, že jsi textu porozuměl nebo porozuměla?", "umím ho převyprávět vlastními slovy", [
    { value: "text je krátký", why: "Délka o porozumění nic neříká." },
    { value: "vím, kolik má stran", why: "Počet stran není porozumění." },
    { value: "pamatuju si první větu", why: "Jedna věta nestačí." },
  ], {
    hints: ["Co bys řekl nebo řekla kamarádovi, který text nečetl?", "Porozumění prověříš tak, že knihu zavřeš a zkusíš obsah někomu podat bez nahlížení."],
    explanation: "Kdo text dokáže převyprávět po svém, ten mu rozumí.",
  }),
  choice("K čemu je v učebnici tučně vytištěné slovo?", "upozorňuje na důležitý pojem", [
    { value: "je to chyba tisku", why: "Tučné písmo je záměr autora." },
    { value: "to slovo se nemusí číst", why: "Naopak — je důležité." },
    { value: "označuje konec kapitoly", why: "Konec kapitoly se takhle neoznačuje." },
  ], {
    hints: ["Proč by autor učebnice některá slova zvýraznil?", "Zvýrazněné bývají pojmy, které si máš zapamatovat — často je u nich i vysvětlení."],
    explanation: "Tučné písmo upozorňuje na důležité pojmy.",
  }),
  choice("Hledáš v encyklopedii, kolik váží slon. Jak budeš postupovat?", "najdu heslo slon a očima vyhledám číslo s kilogramy", [
    { value: "přečtu celou encyklopedii od začátku", why: "To by trvalo příliš dlouho." },
    { value: "přečtu jen úvod encyklopedie", why: "V úvodu údaj o slonovi nebude." },
    { value: "prohlédnu si obrázky jiných zvířat", why: "Obrázky jiných zvířat nepomohou." },
  ], {
    hints: ["Potřebuješ celou knihu, nebo jen jeden údaj?", "Najdi správné místo podle abecedy a pak přeskakuj pohledem, dokud neuvidíš údaj o hmotnosti."],
    explanation: "Najdeme heslo a v něm vyhledáme jen potřebný údaj.",
  }),
  choice("Proč si při učení dělat přestávky?", "mozek si lépe zapamatuje menší části", [
    { value: "aby učení trvalo déle", why: "Přestávky mají učení zefektivnit, ne prodloužit." },
    { value: "protože učebnice je těžká", why: "Váha knihy s tím nesouvisí." },
    { value: "aby se zapomnělo, co už umím", why: "Přestávka pomáhá paměti." },
  ], {
    hints: ["Jak se ti učí po hodině bez přestávky?", "Krátká pauza po několika odstavcích pomůže, aby se nové informace usadily v paměti."],
    explanation: "Po částech a s přestávkami si toho zapamatujeme víc.",
  }),
  choice("Jak se připravíš na test z kapitoly o řekách?", "přečtu ji pozorně, udělám si výpisky a pak je zopakuji", [
    { value: "prolistuji ji pět minut před testem", why: "Rychlé prolistování na učení nestačí." },
    { value: "prohlédnu si jen obrázky", why: "Obrázky nenahradí text." },
    { value: "přečtu si pohádku o vodníkovi", why: "To je zážitkové čtení, ne učení." },
  ], {
    hints: ["Co ti pomůže, aby sis to zapamatoval nebo zapamatovala i druhý den?", "Učení má kroky: pečlivě přečíst, zapsat to důležité a pak si to zkusit říct zpaměti."],
    explanation: "Pozorné čtení, výpisky a opakování — to je studijní čtení.",
  }),
  choice("V učebnici narazíš na slovo, kterému nerozumíš. Co uděláš?", "najdu si jeho význam ve slovníku nebo se zeptám", [
    { value: "přeskočím ho a dál nečtu", why: "Neznámé slovo může změnit smysl věty." },
    { value: "vymyslím si, co asi znamená", why: "Odhad může být špatně." },
    { value: "přestanu se učit", why: "Tím se problém nevyřeší." },
  ], {
    hints: ["Jak zjistíš, co slovo znamená?", "Neznámé slovo může změnit smysl celé věty — vysvětlení najdeš v knize, na internetu nebo u dospělého."],
    explanation: "Neznámé slovo si dohledáme, jinak textu neporozumíme.",
  }),
  choice("K čemu slouží obsah na začátku knihy?", "najdu v něm kapitoly a jejich stránky", [
    { value: "je to první kapitola knihy", why: "Obsah není kapitola." },
    { value: "ukazuje obrázek z obálky", why: "Obrázek je na obálce." },
    { value: "je v něm hodnocení knihy", why: "Hodnocení v obsahu není." },
  ], {
    hints: ["Jak rychle zjistíš, na které straně začíná část o savcích?", "Obsah je jako mapa knihy: názvy částí a čísla, kde je najdeš."],
    explanation: "Obsah ukáže, jaké kapitoly kniha má a na které straně začínají.",
  }),
  choice("Proč si při čtení naučného textu klást otázky?", "pomůžou mi hledat a pochopit to podstatné", [
    { value: "aby bylo čtení delší", why: "Otázky čtení neprodlužují, ale zaměřují." },
    { value: "aby se text nemusel dočíst", why: "Otázky čtení nenahradí." },
    { value: "aby text vypadal jinak", why: "Text se otázkami nemění." },
  ], {
    hints: ["Co tě víc vtáhne do textu — čtení bez cíle, nebo hledání odpovědí?", "Když se před čtením zeptáš třeba Kde sovy žijí?, čteš s cílem a lépe si všimneš důležitého."],
    explanation: "Otázky dají čtení cíl a pomáhají porozumět.",
  }),
  choice("Chceš zjistit, jestli se kniha hodí k referátu. Co uděláš?", "prohlédnu obsah a přelétnu pár stránek", [
    { value: "přečtu ji celou do posledního slova", why: "Na rozhodnutí to není potřeba." },
    { value: "koupím ji bez otevření", why: "Nevíš, co v ní je." },
    { value: "podívám se jen na barvu obálky", why: "Barva o obsahu nic neřekne." },
  ], {
    hints: ["Kolik času potřebuješ, abys poznal nebo poznala, o čem kniha je?", "Na rozhodnutí stačí rychlý přehled: podívej se, jaké části kniha má, a nahlédni na několik míst."],
    explanation: "Přehledové čtení — obsah a pár stránek — stačí k rozhodnutí.",
  }),
  choice("Proč výpisky píšeme vlastními slovy?", "tak si látku lépe zapamatujeme a pochopíme", [
    { value: "protože opisovat je zakázané", why: "Nejde o zákaz, ale o porozumění." },
    { value: "aby byly delší", why: "Výpisky mají být stručné." },
    { value: "protože pěkně píšeme", why: "Písmo s tím nesouvisí." },
  ], {
    hints: ["Co se ti v hlavě děje, když musíš větu říct po svém?", "Když text přeformuluješ, musíš ho nejdřív pochopit — a co pochopíš, to si i zapamatuješ."],
    explanation: "Vlastní slova nutí látku pochopit, a proto si ji lépe pamatujeme.",
  }),
];

const L3: PracticeTask[] = [
  choice("Text: „Zoo Lipová je otevřená denně od 9 do 18 hodin, v zimě jen do 16 hodin. Vstupné: děti 60 Kč, dospělí 120 Kč.“ Kolik zaplatí dvě děti a jeden dospělý?", "240 Kč", [
    { value: "180 Kč", why: "Počítáš jen jedno dítě a dospělého." },
    { value: "300 Kč", why: "Počítáš dva dospělé a jedno dítě." },
    { value: "120 Kč", why: "To je jen jeden dospělý." },
  ], { hints: ["Kolik stojí jedno dítě a kolik dospělý?", "Spočítej zvlášť děti (dvakrát cena pro dítě) a pak přičti dospělého."], explanation: "2 × 60 Kč + 120 Kč = 240 Kč." }),
  choice("Text: „Autobus č. 5 jede z náměstí v 7.10, 7.40 a 8.10. Cesta ke škole trvá 15 minut. Vyučování začíná v 8.00.“ Kterým nejpozdějším autobusem stihneš začátek vyučování?", "v 7.40", [
    { value: "v 8.10", why: "Přijel bys až v 8.25." },
    { value: "v 7.10", why: "Stihneš ho, ale není nejpozdější." },
    { value: "v 8.00", why: "V 8.00 žádný autobus nejede; to je začátek vyučování." },
  ], { hints: ["Ke každému odjezdu přičti 15 minut. Kdy pak budeš u školy?", "Hledáš poslední spoj, se kterým dorazíš do 8.00 nebo dřív."], explanation: "7.40 + 15 minut = 7.55, to stihneš; autobus v 8.10 už ne." }),
  choice("Text: „Knihovna: po–čt 10–18 h, pá 10–14 h, so a ne zavřeno. Knihy se půjčují na 4 týdny.“ Můžeš knihu vrátit v pátek v 15 hodin?", "ne, v pátek se zavírá ve 14 hodin", [
    { value: "ano, v pátek je otevřeno do 18 hodin", why: "Do 18 hodin je otevřeno od pondělí do čtvrtka." },
    { value: "ano, knihovna má otevřeno pořád", why: "O víkendu je zavřeno a v pátek jen do 14." },
    { value: "ne, v pátek je celý den zavřeno", why: "V pátek je otevřeno od 10 do 14." },
  ], { hints: ["Najdi v rozpisu, jak dlouho je otevřeno na konci pracovního týdne.", "Porovnej čas, kdy přijdeš, s koncem otevírací doby v ten den."], explanation: "V pátek je otevřeno jen do 14 hodin, v 15 hodin už ne." }),
  choice("Text: „Recept: 2 hrnky mouky, 1 hrnek mléka, 2 vejce, špetka soli. Těsto nech 10 minut odpočinout.“ Kolik vajec potřebuješ na dvojnásobné množství těsta?", "4", [
    { value: "2", why: "To je na jednu dávku." },
    { value: "3", why: "Dvojnásobek dvou je víc." },
    { value: "1", why: "Jeden je hrnek mléka." },
  ], { hints: ["Kolik vajec je v receptu na jednu dávku?", "Dvojnásobné množství znamená vzít všechno dvakrát."], explanation: "Na jednu dávku 2 vejce, na dvojnásobek 2 × 2 = 4." }),
  choice("Text: „Výlet: sraz v sobotu v 8.00 u nádraží. Návrat v 17.00. S sebou: svačina, pití, pláštěnka. Cena 150 Kč.“ Jak dlouho výlet trvá?", "9 hodin", [
    { value: "8 hodin", why: "Od 8 do 17 je víc." },
    { value: "17 hodin", why: "17.00 je čas návratu, ne délka." },
    { value: "10 hodin", why: "Počítej znovu: od 8 do 17." },
  ], { hints: ["V kolik výlet začíná a v kolik končí?", "Délku zjistíš, když od času návratu odečteš čas srazu."], explanation: "17 − 8 = 9, výlet trvá 9 hodin." }),
  choice("Text: „Pozor! Bazén bude od 1. do 14. července zavřený kvůli opravě. Od 15. července je opět otevřeno.“ Můžeš jít plavat 10. července?", "ne, bazén je v té době zavřený", [
    { value: "ano, bazén je otevřený celý červenec", why: "Do 14. července probíhá oprava." },
    { value: "ano, oprava začne až v srpnu", why: "Oprava je v červenci." },
    { value: "ne, bazén bude zavřený celé léto", why: "Od 15. července je zase otevřeno." },
  ], { hints: ["Spadá 10. červenec do doby opravy?", "Porovnej datum s rozmezím od 1. do 14. července."], explanation: "10. července je mezi 1. a 14. červencem, bazén je zavřený." }),
  choice("Text: „Kroužky: keramika úterý 14–15 h (učebna 12), šachy středa 14–15 h (učebna 5), florbal čtvrtek 15–16 h (tělocvična).“ Chodíš na šachy. Kam půjdeš?", "do učebny 5", [
    { value: "do učebny 12", why: "Tam je keramika." },
    { value: "do tělocvičny", why: "Tam je florbal." },
    { value: "do učebny 14", why: "Číslo 14 je čas začátku, ne učebna." },
  ], { hints: ["Najdi v přehledu řádek, kde je hra s figurkami na šachovnici.", "U každého kroužku je den, čas a v závorce, kde se koná."], explanation: "U šachů je v závorce učebna 5." }),
  choice("Text: „Krmení rybiček: 2× denně malou špetku. Když jste pryč, lze krmení vynechat nejvýš 2 dny. Nekrmte víc, voda by se kalila.“ Rodina odjíždí na tři dny. Co z textu plyne?", "někdo musí rybičky aspoň jednou nakrmit", [
    { value: "rybičky vydrží bez jídla i týden", why: "Text dovoluje vynechat nejvýš 2 dny." },
    { value: "stačí před odjezdem nasypat hodně krmení", why: "Víc krmení kalí vodu." },
    { value: "rybičky se krmí jen jednou týdně", why: "Krmí se dvakrát denně." },
  ], { hints: ["Kolik dní text dovoluje krmení vynechat?", "Porovnej počet dní odjezdu s tím, kolik dní se smí vynechat."], explanation: "Tři dny jsou víc než povolené 2 dny, proto je musí někdo nakrmit." }),
  choice("Text: „Závod na 5 km: start v 9.00 u rybníka, trasa vede lesem, cíl je u školy. Přihlášky do středy u pana Novotného.“ Tatínek tě chce čekat v cíli. Kam má jít?", "ke škole", [
    { value: "k rybníku", why: "U rybníka je start." },
    { value: "do lesa", why: "Lesem trasa jen vede." },
    { value: "k panu Novotnému", why: "U něj se jen přihlašuje." },
  ], { hints: ["Najdi v textu, kudy trasa vede a kde končí.", "Start a konec jsou dvě různá místa — nepleť si je."], explanation: "Cíl závodu je u školy." }),
  choice("Text: „Teplota v týdnu: pondělí 12 °C, úterý 15 °C, středa 9 °C, čtvrtek 14 °C, pátek 11 °C.“ Který den bylo nejchladněji?", "ve středu", [
    { value: "v pondělí", why: "12 °C není nejméně." },
    { value: "v pátek", why: "11 °C je víc než 9 °C." },
    { value: "v úterý", why: "V úterý bylo nejtepleji." },
  ], { hints: ["Najdi nejnižší číslo.", "Porovnej všech pět teplot; nejchladnější den má nejmenší číslo."], explanation: "Nejnižší teplota 9 °C byla ve středu." }),
  choice("Text: „Jízdné: dítě do 6 let zdarma, dítě 6–15 let 10 Kč, dospělý 20 Kč. Jízdenku označ hned po nástupu.“ Kolik zaplatí desetiletý Jakub se čtyřletou sestrou?", "10 Kč", [
    { value: "20 Kč", why: "Sestra do 6 let jede zdarma." },
    { value: "0 Kč", why: "Jakub už zdarma nejede." },
    { value: "30 Kč", why: "Počítáš Jakuba jako dospělého." },
  ], { hints: ["Do které skupiny patří desetiletý a do které čtyřletá?", "Sečti jízdné obou dětí podle věkových skupin."], explanation: "Jakub 10 Kč, sestra zdarma, celkem 10 Kč." }),
  choice("Text: „Soutěž o nejhezčí kresbu zvířete: kresby odevzdej do 20. května paní učitelce Malé. Formát A4, na zadní stranu napiš jméno a třídu.“ Nakreslil jsi nebo nakreslila obrázek na menší papír A5. Splňuje podmínky soutěže?", "ne, musí mít velikost A4", [
    { value: "ano, na velikosti papíru nezáleží", why: "Text velikost papíru přesně určuje." },
    { value: "ano, stačí napsat jméno a třídu", why: "Podpis je jen jedna z podmínek." },
    { value: "ne, kresba musí být barevná", why: "O barvách text nic neříká." },
  ], { hints: ["Najdi v textu, jakou velikost papíru soutěž požaduje.", "Porovnej velikost svého papíru s tou, kterou text uvádí; když se liší, podmínka splněná není."], explanation: "Soutěž chce formát A4, papír A5 podmínku nesplňuje." }),
  choice("Text: „Hrad Kost: prohlídka trvá 45 minut a začíná každou celou hodinu od 10 do 16 hodin.“ Přijdeš ve 13.20. Kdy začne nejbližší prohlídka?", "ve 14 hodin", [
    { value: "ve 13.20", why: "Prohlídky začínají jen v celou hodinu." },
    { value: "ve 13 hodin", why: "Ta už probíhá." },
    { value: "v 16 hodin", why: "To je poslední, ne nejbližší." },
  ], { hints: ["Jak často prohlídky začínají?", "Najdi nejbližší začátek, který přijde po tvém příchodu."], explanation: "Po 13.20 přijde nejbližší celá hodina ve 14.00." }),
];

function gen(level: number): PracticeTask[] {
  if (level >= 3) return shuffle(L3);
  if (level === 2) return shuffle(L2);
  return urceni(SITUACE, DRUHY, 1, (p) => ({
    question: `Jak budeš číst v této situaci? ${p.veta}`,
    hints: [
      `Proč v situaci „${zac(p.veta)}“ čteš — chceš se učit, něco najít, bavit se, nebo jen zjistit, o čem text je?`,
      `Pomůže tohle: ${p.klic}.`,
    ],
  }), ["To, jak čteš, se řídí tím, co od textu chceš.", "Učení = pomalu a s poznámkami, jeden údaj = přeskakovat, radost = příběh, přehled = rychle proletět."]);
}

export const STUDIJNICTENIAVECNECTENI: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-studijni-cteni-a-vecne-cteni",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-studijni-cteni-a-vecne-cteni",
    title: "Studijní čtení a věcné čtení",
    studentTitle: "Jak číst texty",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení a naslouchání",
    briefDescription: "Naučíš se číst studijně i věcně – pro různé účely.",
    keywords: ["studijní čtení", "věcné čtení", "přehledové čtení", "vyhledávací čtení", "poznámky", "výpisky"],
    goals: [
      "Rozlišit studijní a věcné čtení",
      "Vybrat správný typ čtení pro situaci",
      "Použít techniky efektivního čtení (podtrhávání, výpisky)",
    ],
    boundaries: [
      "Bez pokročilé teorie čtenářských strategií",
      "Neprobíráme akademické citace",
      "Úroveň 3: vyhledání a použití údaje z krátkého věcného textu",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Studijní čtení = pomalu, podtrhávám, dělám poznámky – učím se. Věcné čtení = hledám konkrétní informaci, přeskočím zbytek.",
      steps: [
        "Zjisti, proč čteš – co potřebuješ vědět nebo najít.",
        "Učíš se? → studijní čtení (pomalu, poznámky).",
        "Hledáš konkrétní údaj? → věcné čtení (cíleně, rychleji).",
        "Chceš přehled? → přehledové čtení (prohlédni nadpisy).",
      ],
      commonMistake: "Žáci čtou vždy stejně – vždy studijně nebo vždy rychle. Správný typ čtení závisí na cíli.",
      example: "Příprava na test z dějepisu = studijní čtení. Hledání spoje v jízdním řádu = věcné čtení.",
    },
  },
];
