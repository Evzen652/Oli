import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
// Přiměřeno 2. ročníku (7–8 let) — bez měřítka, souřadnic a čtení mapy.
//   L1 = rozpoznání: izolovaná fakta o plánu obce a jeho prvcích
//        (co je plán, ulice, silnice, chodník, přechod, semafor,
//        zastávka, most, značka, hřiště, parkoviště, tramvaj, park).
//   L2 = aplikace: konkrétní situace bezpečné cesty do školy
//        (přechod, semafor, chodník vs. silnice, zastávka, reflexní
//        prvky, křižovatka, parkoviště, skupina chodců).
//   L3 = transfer (kombinace dvou faktů o bezpečnosti/orientaci,
//        „co uděláš, když…“ scénáře, rozlišení blízkých situací) —
//        stále bez aritmetiky a skutečného měřítka mapy.
// Každá úloha: 2 vlastní nápovědy (malá → velká), vysvětlení PROČ
// a optionFeedback ke každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Co je plán obce?",
    correctAnswer: "Nákres obce shora, na kterém vidíme ulice, domy a důležitá místa",
    options: [
      "Nákres obce shora, na kterém vidíme ulice, domy a důležitá místa",
      "Fotografie obce vyfocená z okna auta",
      "Seznam jmen všech obyvatel obce",
      "Kniha o historii obce",
    ],
    emoji: "🗺️",
    hints: [
      "Plán není fotka ani seznam jmen — je to nakreslený obrázek obce.",
      "Představ si, že letíš jako pták vysoko nad obcí a díváš se dolů. Jak by vypadal obrázek, který bys pak nakreslil?",
    ],
    explanation:
      "Plán obce je zjednodušený nákres, na kterém vidíme shora ulice, domy a důležitá místa v obci. Díky pohledu shora poznáme, kde co leží a jak se kam dostat.",
    optionFeedback: {
      "Fotografie obce vyfocená z okna auta":
        "Fotka z okna auta ukáže jen kousek ulice ze strany. Plán je nakreslený a ukazuje celou obec jakoby shora.",
      "Seznam jmen všech obyvatel obce":
        "Seznam jmen je jen text, podle něj cestu nenajdeš. Plán je obrázek, na kterém vidíš, kde co v obci leží.",
      "Kniha o historii obce":
        "Kniha o historii vypráví, co se v obci dělo dřív. Plán místo toho ukazuje, kde teď vedou ulice a stojí domy.",
    },
  },
  {
    question: "Jak se jmenují pojmenované cesty v obci, podél kterých stojí domy?",
    correctAnswer: "Ulice",
    options: ["Louky", "Ulice", "Zahrady", "Hřiště"],
    emoji: "🏘️",
    hints: [
      "Každý dům má adresu, ve které je napsaný název této cesty.",
      "Vzpomeň si na svou adresu: Hlavní ___, Školní ___. Jak se říká takové pojmenované cestě mezi domy?",
    ],
    explanation:
      "Cesty v obci, podél kterých stojí domy, se jmenují ulice. Každá ulice má své jméno, a proto ho píšeme do adresy.",
    optionFeedback: {
      Louky: "Louka je travnatá plocha za obcí, domy podél ní v řadě nestojí a do adresy ji nepíšeme.",
      Zahrady: "Zahrada patří k jednomu domu, není to cesta, po které se chodí mezi domy.",
      Hřiště: "Hřiště je místo na hraní, ne pojmenovaná cesta s domy po stranách.",
    },
  },
  {
    question: "Po čem jezdí auta?",
    correctAnswer: "Silnice",
    options: ["Chodník", "Tráva", "Silnice", "Hřiště"],
    emoji: "🛣️",
    hints: [
      "Auta nejezdí tam, kudy chodí lidé.",
      "Hledej širokou plochu z asfaltu, na které jsou namalované čáry a která je určená přímo pro vozidla.",
    ],
    explanation: "Auta jezdí po silnici. Silnice je určená pro vozidla, ne pro chodce, proto po ní nechodíme.",
    optionFeedback: {
      Chodník: "Chodník je určený pro chodce. Auto by tam lidi ohrožovalo.",
      Tráva: "Po trávě auta běžně nejezdí, zničila by ji. Pro auta je postavená zpevněná cesta.",
      Hřiště: "Hřiště je pro hrající si děti. Auto tam vůbec nesmí.",
    },
  },
  {
    question: "Po čem chodíme, když jdeme podél silnice?",
    correctAnswer: "Chodník",
    options: ["Silnice", "Parkoviště", "Koleje", "Chodník"],
    emoji: "🚶",
    hints: [
      "Chodci mají svou vlastní cestu, oddělenou od silnice.",
      "Tahle cesta vede vedle silnice, bývá o kousek vyšší a obrubník ji odděluje od projíždějících aut.",
    ],
    explanation: "Podél silnice chodíme po chodníku. Chodník odděluje chodce od projíždějících aut, a tím nás chrání.",
    optionFeedback: {
      Silnice: "Silnice patří autům. Kdybys šel po ní, auto by tě mohlo srazit.",
      Parkoviště: "Parkoviště je místo pro stojící auta, ne cesta pro chodce podél silnice.",
      Koleje: "Po kolejích jezdí vlak nebo tramvaj. Chodit po nich je nebezpečné.",
    },
  },
  {
    question: "Kde je bezpečné místo pro přecházení silnice, označené na vozovce bílými pruhy?",
    correctAnswer: "Přechod pro chodce",
    options: ["Přechod pro chodce", "Parkoviště", "Zastávka", "Křižovatka"],
    emoji: "🚸",
    hints: [
      "Toto místo poznáš podle bílých pruhů namalovaných na silnici.",
      "Bílé pruhy vypadají jako zebra. Řidiči na tom místě vědí, že tudy půjdou lidé na druhou stranu silnice.",
    ],
    explanation:
      "Bezpečné místo pro přecházení silnice se jmenuje přechod pro chodce. Poznáš ho podle bílých pruhů na vozovce a řidiči tam s chodci počítají.",
    optionFeedback: {
      Parkoviště: "Na parkovišti stojí auta. Bílé pruhy tam ukazují místa k parkování, ne cestu přes silnici.",
      Zastávka: "Na zastávce se čeká na autobus. Přes silnici se tam nepřechází.",
      Křižovatka: "Křižovatka je místo, kde se silnice kříží. Bílé pruhy pro chodce na ní být nemusí.",
    },
  },
  {
    question: "Co svítí na semaforu, když chodci nesmí přejít silnici?",
    correctAnswer: "Červená",
    options: ["Zelená", "Červená", "Modrá", "Žlutá"],
    emoji: "🚦",
    hints: [
      "Tato barva znamená stůj.",
      "Na semaforu pro chodce svítí jen dvě barvy. Horní panáček stojí a má stejnou barvu jako hasičské auto.",
    ],
    explanation: "Když na semaforu svítí červená, chodci musí zůstat stát a nesmí přejít silnici, protože právě jedou auta.",
    optionFeedback: {
      Zelená: "Zelená znamená opak: chodec smí jít. Při ní se přechází.",
      Modrá: "Modrá barva na semaforu vůbec není.",
      Žlutá: "Na semaforu pro chodce žlutá nesvítí. Ta je jen na semaforu pro auta.",
    },
  },
  {
    question: "Co svítí na semaforu, když chodci smí přejít silnici?",
    correctAnswer: "Zelená",
    options: ["Červená", "Modrá", "Zelená", "Oranžová"],
    emoji: "🚦",
    hints: [
      "Tato barva znamená jdi.",
      "Dolní panáček na semaforu pro chodce kráčí a svítí stejnou barvou, jakou má tráva nebo listí na stromech.",
    ],
    explanation: "Když na semaforu svítí zelená, chodci smí přejít silnici, protože auta mají v tu chvíli stát.",
    optionFeedback: {
      Červená: "Červená znamená stůj. Při ní na přechod nevstupujeme.",
      Modrá: "Modrá barva na semaforu vůbec není.",
      Oranžová: "Oranžová svítí jen na semaforu pro auta. Chodec se řídí svým semaforem se dvěma panáčky.",
    },
  },
  {
    question: "Kde čekáme na autobus?",
    correctAnswer: "Zastávka",
    options: ["Křižovatka", "Přechod", "Parkoviště", "Zastávka"],
    emoji: "🚏",
    hints: [
      "Autobus staví jen na jednom určeném a označeném místě.",
      "Hledej místo u silnice s cedulí, na které jsou čísla linek a jízdní řád. Často tam bývá i lavička nebo stříška.",
    ],
    explanation: "Na autobus čekáme na zastávce, protože jen tam autobus pravidelně staví a lidé mohou nastoupit.",
    optionFeedback: {
      Křižovatka: "Na křižovatce se kříží silnice a jezdí tam hodně aut. Autobus tam pro cestující nestaví.",
      Přechod: "Přechod slouží k přecházení silnice. Stát tam a čekat je nebezpečné.",
      Parkoviště: "Na parkovišti stojí osobní auta. Linkový autobus tam cestující nenabírá.",
    },
  },
  {
    question: "Co je postavené přes řeku, abychom se dostali na druhý břeh?",
    correctAnswer: "Most",
    options: ["Most", "Plot", "Lavička", "Cedule"],
    emoji: "🌉",
    hints: [
      "Přes vodu se dostaneme jen po pevné stavbě.",
      "Ta stavba vede z jednoho břehu na druhý nad vodou. Chodí po ní lidé a často po ní jezdí i auta.",
    ],
    explanation: "Přes řeku je postavený most, po kterém se dostaneme na druhý břeh suchou nohou.",
    optionFeedback: {
      Plot: "Plot něco ohrazuje, přes řeku po něm nepřejdeš.",
      Lavička: "Na lavičce se sedí. Z jednoho břehu na druhý nevede.",
      Cedule: "Cedule jen něco oznamuje. Přes vodu tě nepřevede.",
    },
  },
  {
    question: "Co u cesty ukazuje, kudy jít nebo jet a na co si dát pozor?",
    correctAnswer: "Dopravní značka",
    options: ["Lavička", "Dopravní značka", "Plot", "Strom"],
    emoji: "🪧",
    hints: [
      "Toto najdeš u silnice nebo chodníku — má obrázek nebo nápis.",
      "Visí na tyči u cesty, bývá kulatá, trojúhelníková nebo čtvercová a řidiči i chodci se podle ní řídí.",
    ],
    explanation: "Dopravní značka u cesty ukazuje, kudy jít nebo jet a na co si dát pozor. Obrázek na ní pochopí každý.",
    optionFeedback: {
      Lavička: "Lavička je na sezení, žádný pokyn ti nedává.",
      Plot: "Plot ohrazuje zahradu nebo dvůr. Neukazuje, kudy jet.",
      Strom: "Strom roste u cesty, ale nic neoznamuje ani nepřikazuje.",
    },
  },
  {
    question: "Kde si děti hrají venku na prolézačkách a houpačkách?",
    correctAnswer: "Hřiště",
    options: ["Parkoviště", "Zastávka", "Hřiště", "Křižovatka"],
    emoji: "🛝",
    hints: [
      "Toto místo má pískoviště, houpačky a prolézačky.",
      "Hledej místo, kam chodíš s kamarády za hrou. Nejezdí tam auta a bývá oplocené, aby děti nevyběhly do silnice.",
    ],
    explanation: "Děti si hrají na hřišti, kde jsou houpačky, prolézačky a pískoviště a kde nejezdí auta.",
    optionFeedback: {
      Parkoviště: "Na parkovišti se pohybují auta. Hrát si tam je nebezpečné.",
      Zastávka: "Zastávka je místo pro čekání na autobus, prolézačky tam nejsou.",
      Křižovatka: "Na křižovatce jezdí auta z několika stran, tam si hrát nesmíme.",
    },
  },
  {
    question: "Kde stojí zaparkovaná auta, když zrovna nikam nejedou?",
    correctAnswer: "Parkoviště",
    options: ["Chodník", "Hřiště", "Zastávka", "Parkoviště"],
    emoji: "🅿️",
    hints: [
      "Auta potřebují místo, kde mohou stát, aniž by komukoliv překážela.",
      "Na plánu obce se toto místo značí modrou tabulkou s bílým písmenem P. Auta tam stojí vedle sebe v řadách.",
    ],
    explanation: "Auta stojí na parkovišti. Je to plocha určená k parkování, takže auta nepřekážejí na silnici ani na chodníku.",
    optionFeedback: {
      Chodník: "Chodník patří chodcům. Auto zaparkované na chodníku by lidem překáželo.",
      Hřiště: "Hřiště je pro děti na hraní. Auta tam nesmí.",
      Zastávka: "Na zastávce staví autobus. Osobní auta tam parkovat nesmějí.",
    },
  },
  {
    question: "Jaká hromadná doprava jezdí po kolejích přímo v ulicích města?",
    correctAnswer: "Tramvaj",
    options: ["Tramvaj", "Loď", "Letadlo", "Dálkový vlak"],
    emoji: "🚊",
    hints: [
      "Tento dopravní prostředek jezdí po kolejích, ale ne mezi městy jako vlak.",
      "Jeho koleje vedou přímo ulicí mezi auty, nad ním jsou natažené dráty a před křižovatkou cinká zvonkem.",
    ],
    explanation: "Ulicemi města jezdí po kolejích tramvaj. Je to hromadná doprava pro cestování uvnitř města.",
    optionFeedback: {
      Loď: "Loď pluje po vodě, koleje nemá.",
      Letadlo: "Letadlo létá vzduchem a po ulicích nejezdí.",
      "Dálkový vlak": "Dálkový vlak jezdí po kolejích mezi městy, ne ulicemi mezi domy.",
    },
  },
  {
    question: "Co roste v parku a v létě dává stín?",
    correctAnswer: "Stromy",
    options: ["Auta", "Stromy", "Značky", "Lavičky"],
    emoji: "🌳",
    hints: [
      "V parku je hodně zeleně.",
      "Hledej něco, co v parku opravdu roste. Je to vysoké, má kmen a korunu z listů, pod kterou je v horku chládek.",
    ],
    explanation: "V parku rostou stromy. Jejich koruny z listů v létě dávají stín a dělají prostředí příjemnější.",
    optionFeedback: {
      Auta: "Auta nerostou a do parku ani nepatří.",
      Značky: "Značky jsou vyrobené a postavené lidmi, nerostou. Stín skoro nedávají.",
      Lavičky: "Lavičky v parku stojí, ale nerostou. Postavili je tam lidé.",
    },
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jdeš do školy a chceš přejít silnici. Co uděláš nejdřív?",
    correctAnswer: "Podívám se na obě strany, jestli nejede auto",
    options: [
      "Rozeběhnu se přes silnici",
      "Zavřu oči a přeběhnu",
      "Podívám se na obě strany, jestli nejede auto",
      "Počkám, až uvidím kamaráda na druhé straně",
    ],
    emoji: "🚸",
    hints: [
      "Než vstoupíš na silnici, musíš se ujistit, že je bezpečno.",
      "Přemýšlej, co dělá zkušený chodec ještě předtím, než udělá první krok na vozovku. Odkud všude může přijet auto?",
    ],
    explanation:
      "Před přecházením silnice se vždy nejdřív podíváme na obě strany, jestli nejede auto, a teprve pak přejdeme. Auto může přijet zleva i zprava.",
    optionFeedback: {
      "Rozeběhnu se přes silnici": "Když se rozeběhneš bez rozhlédnutí, nevíš, jestli zrovna nejede auto.",
      "Zavřu oči a přeběhnu": "Se zavřenýma očima blížící se auto vůbec neuvidíš.",
      "Počkám, až uvidím kamaráda na druhé straně": "Kamarád na druhé straně ti neřekne, jestli nejede auto. Musíš se podívat sám.",
    },
  },
  {
    question: "Na přechodu svítí semafor pro chodce červeně. Co uděláš?",
    correctAnswer: "Počkám, až se rozsvítí zelená",
    options: [
      "Rychle přeběhnu, dokud nejede žádné auto",
      "Přejdu, protože spěchám do školy",
      "Přejdu jen kousek a počkám uprostřed silnice",
      "Počkám, až se rozsvítí zelená",
    ],
    emoji: "🚦",
    hints: [
      "Červená na semaforu platí i pro chodce, ne jen pro auta.",
      "Červený panáček stojí. Zamysli se, co musí chodec udělat, dokud se panáček na semaforu nezmění a nevykročí.",
    ],
    explanation:
      "Když svítí červená, chodci musí počkat na zelenou. Platí to i tehdy, když se zdá, že žádné auto nejede, protože může rychle přijet.",
    optionFeedback: {
      "Rychle přeběhnu, dokud nejede žádné auto": "I když auto nevidíš, na červenou se nechodí. Auto se může objevit za chvilku.",
      "Přejdu, protože spěchám do školy": "Spěch pravidla nemění. Radši přijdeš o minutu později, ale v bezpečí.",
      "Přejdu jen kousek a počkám uprostřed silnice": "Uprostřed silnice kolem tebe jezdí auta z obou stran. To je velmi nebezpečné.",
    },
  },
  {
    question: "Jdeš po chodníku do školy. Kde je nejbezpečnější místo pro chůzi?",
    correctAnswer: "Dál od okraje silnice",
    options: ["Dál od okraje silnice", "Přímo u krajnice silnice", "Uprostřed silnice", "Zády k projíždějícím autům"],
    emoji: "🚶",
    hints: [
      "Čím dál od projíždějících aut jdeš, tím bezpečněji jdeš.",
      "Chodník bývá širší než jeden krok. Ve které jeho části tě projíždějící auto nemůže ani lehce zavadit?",
    ],
    explanation:
      "Na chodníku je nejbezpečnější jít dál od silnice, abychom měli od projíždějících aut co největší odstup.",
    optionFeedback: {
      "Přímo u krajnice silnice": "U krajnice jsi autům nejblíž. Stačí zakopnout a jsi na silnici.",
      "Uprostřed silnice": "Silnice patří autům, chodec na ni nepatří.",
      "Zády k projíždějícím autům": "Když jdeš zády k autům, nevidíš je. Důležité je držet se dál od silnice.",
    },
  },
  {
    question: "Chceš přejít silnici tam, kde není ani přechod, ani semafor. Co je nejbezpečnější?",
    correctAnswer: "Najít místo s dobrým výhledem na obě strany",
    options: [
      "Přejít okamžitě tam, kde stojím",
      "Najít místo s dobrým výhledem na obě strany",
      "Přeběhnout mezi stojícími auty",
      "Přejít, jen když jde přede mnou kamarád",
    ],
    emoji: "🚸",
    hints: [
      "I bez přechodu platí to samé pravidlo jako s přechodem — hledej bezpečné podmínky.",
      "Přemýšlej, co potřebuješ vidět, abys byl při přecházení jistý. Zatáčka nebo zaparkovaná auta ti mohou výhled zakrýt.",
    ],
    explanation:
      "I když poblíž není přechod ani semafor, nejbezpečnější je najít místo s dobrým výhledem na obě strany, případně dojít k nejbližšímu přechodu. Jen tak včas uvidíš blížící se auto.",
    optionFeedback: {
      "Přejít okamžitě tam, kde stojím": "Na místě, kde stojíš, může být zatáčka nebo překážka a auto neuvidíš včas.",
      "Přeběhnout mezi stojícími auty": "Stojící auta ti zakrývají výhled a řidič tě mezi nimi neuvidí.",
      "Přejít, jen když jde přede mnou kamarád": "Kamarád se může splést. Rozhlédnout se musíš vždycky sám.",
    },
  },
  {
    question: "Jedeš do školy autobusem. Kde na něj bezpečně počkáš?",
    correctAnswer: "Na zastávce, dál od okraje vozovky",
    options: ["Uprostřed silnice", "Na přechodu pro chodce", "Na zastávce, dál od okraje vozovky", "Na parkovišti"],
    emoji: "🚏",
    hints: [
      "Autobus staví jen na jednom označeném místě u silnice.",
      "I na tom označeném místě záleží, kde přesně stojíš. Přijíždějící autobus jede těsně podél obrubníku.",
    ],
    explanation:
      "Na autobus čekáme na zastávce a stojíme dál od okraje vozovky, aby nás projíždějící auta ani přijíždějící autobus neohrozily.",
    optionFeedback: {
      "Uprostřed silnice": "Uprostřed silnice jezdí auta. Tam se nikdy nečeká.",
      "Na přechodu pro chodce": "Přechod slouží jen k přecházení. Kdo na něm stojí, překáží a je v nebezpečí.",
      "Na parkovišti": "Na parkovišti autobus pro cestující nestaví a jezdí tam auta.",
    },
  },
  {
    question: "Za tmy nebo za špatného počasí jdeš do školy pěšky. Co ti pomůže, aby tě řidiči lépe viděli?",
    correctAnswer: "Reflexní prvky, třeba páska nebo přívěsek",
    options: [
      "Tmavé oblečení bez potisku",
      "Deštník zakrývající obličej",
      "Sluneční brýle s tmavými skly",
      "Reflexní prvky, třeba páska nebo přívěsek",
    ],
    emoji: "🦺",
    hints: [
      "Řidiči tě uvidí lépe, pokud na tobě něco zasvítí ve světle jejich reflektorů.",
      "Hledej doplněk, který je vyrobený speciálně tak, aby odrážel světlo. Když na něj posvítíš baterkou, jasně zazáří.",
    ],
    explanation:
      "Reflexní prvky odrážejí světlo aut, takže tě řidiči za snížené viditelnosti uvidí mnohem dřív a lépe.",
    optionFeedback: {
      "Tmavé oblečení bez potisku": "Tmavé oblečení za tmy splývá se silnicí a řidič tě uvidí pozdě.",
      "Deštník zakrývající obličej": "Deštník tě neosvítí a navíc ti zakryje výhled na auta.",
      "Sluneční brýle s tmavými skly": "Tmavé brýle za tmy zhorší tvůj výhled a řidiči tě kvůli nim neuvidí lépe.",
    },
  },
  {
    question: "Cesta ze školy domů vede podél silnice. Kudy půjdeš bezpečně?",
    correctAnswer: "Po chodníku",
    options: ["Po chodníku", "Po silnici, protože je to kratší", "Po silnici, když nejedou auta", "Tam, kde je zrovna volněji"],
    emoji: "🏫",
    hints: [
      "I na krátkém úseku platí obecné pravidlo, kde má chodit chodec a kde jezdí auta.",
      "Vzpomeň si, jaká cesta vedle silnice je určená jen pro lidi. Platí to vždy, ať je cesta domů jakkoli krátká.",
    ],
    explanation:
      "I na cestě domů platí, že bezpečná cesta vede po chodníku, nikdy po silnici, i kdyby se zdála prázdná.",
    optionFeedback: {
      "Po silnici, protože je to kratší": "Kratší cesta po silnici tě vystaví autům. Bezpečí je důležitější než pár kroků.",
      "Po silnici, když nejedou auta": "Auto se může objevit náhle. Silnice chodcům nepatří, ani když je prázdná.",
      "Tam, kde je zrovna volněji": "Volné místo může být klidně silnice. Chodec patří vždy na chodník.",
    },
  },
  {
    question: "Blíží se křižovatka bez semaforu. Co uděláš, než přejdeš?",
    correctAnswer: "Rozhlédnu se na obě strany a počkám, až bude volno",
    options: [
      "Přejdu, protože na křižovatce mají chodci vždy přednost",
      "Rozhlédnu se na obě strany a počkám, až bude volno",
      "Zavolám na řidiče, ať zastaví",
      "Přeběhnu rychle mezi projíždějícími auty",
    ],
    emoji: "🚧",
    hints: [
      "Bez semaforu si bezpečnost musíš ohlídat sám.",
      "Na křižovatce mohou auta přijet z více stran a některá zatáčejí. Co musíš udělat, než vstoupíš do vozovky?",
    ],
    explanation:
      "Na křižovatce bez semaforu se musíme pečlivě rozhlédnout na obě strany a přejít, až bude bezpečno, protože nás tu nic nechrání.",
    optionFeedback: {
      "Přejdu, protože na křižovatce mají chodci vždy přednost": "Chodci na křižovatce vždy přednost nemají. I tak se musíš rozhlédnout.",
      "Zavolám na řidiče, ať zastaví": "Řidič tě v autě neslyší. Počkej, až bude volno.",
      "Přeběhnu rychle mezi projíždějícími auty": "Běhat mezi jedoucími auty je velmi nebezpečné. Řidič nestihne zabrzdit.",
    },
  },
  {
    question: "Jdeš se skupinou spolužáků do školy. Co je bezpečnější?",
    correctAnswer: "Jít v řadě za sebou po chodníku",
    options: [
      "Jít v houfu přes celou šířku chodníku i silnici",
      "Běhat kolem sebe",
      "Jít v řadě za sebou po chodníku",
      "Jít po silnici vedle sebe",
    ],
    emoji: "👫",
    hints: [
      "Na chodníku je omezené místo.",
      "Přemýšlej, jak se má skupina seřadit, aby se všichni vešli na chodník a nikdo nemusel šlapat na silnici.",
    ],
    explanation:
      "Bezpečnější je jít v řadě za sebou po chodníku, aby skupina nezasahovala do silnice a nikomu nepřekážela.",
    optionFeedback: {
      "Jít v houfu přes celou šířku chodníku i silnici": "Kdo z houfu stojí na silnici, je v cestě autům.",
      "Běhat kolem sebe": "Při běhání kolem sebe může někdo zakopnout nebo vběhnout do silnice.",
      "Jít po silnici vedle sebe": "Silnice patří autům. Skupina na ní by byla ve velkém nebezpečí.",
    },
  },
  {
    question: "Vystupuješ z autobusu na zastávce a potřebuješ přejít silnici. Co uděláš?",
    correctAnswer: "Počkám, až autobus odjede, a pak se rozhlédnu",
    options: [
      "Přeběhnu hned před přijíždějícím autobusem",
      "Přeběhnu hned za odjíždějícím autobusem",
      "Přejdu, dokud autobus stojí, protože mě schová",
      "Počkám, až autobus odjede, a pak se rozhlédnu",
    ],
    emoji: "🚌",
    hints: [
      "Zamysli se, co ti stojící nebo odjíždějící autobus dočasně brání vidět.",
      "Velký autobus zakryje silnici i auta za ním. Kdy teprve uvidíš celou silnici a můžeš se pořádně rozhlédnout?",
    ],
    explanation:
      "Autobus zakrývá výhled na silnici, proto počkáme, až odjede, a teprve pak se rozhlédneme a přejdeme.",
    optionFeedback: {
      "Přeběhnu hned před přijíždějícím autobusem": "Před jedoucím autobusem tě řidič nemusí stihnout zabrzdit.",
      "Přeběhnu hned za odjíždějícím autobusem": "Za autobusem nevidíš auta, která ho právě předjíždějí.",
      "Přejdu, dokud autobus stojí, protože mě schová": "Autobus tě schová i před řidiči ostatních aut. Oni tě neuvidí a ty je taky ne.",
    },
  },
  {
    question: "Jdeš do školy a míjíš parkoviště plné aut. Na co si dáš pozor nejvíc?",
    correctAnswer: "Na auta, která se dávají do pohybu",
    options: ["Na auta, která se dávají do pohybu", "Na stromy v parku", "Na semafor na parkovišti", "Na chodce na chodníku"],
    emoji: "🅿️",
    hints: [
      "Na parkovišti auta nejen stojí, ale i vyjíždějí a zajíždějí.",
      "Přemýšlej, jaký pohyb auta je pro chodce nejméně čekaný. Řidič, který couvá, se dívá dozadu a malé dítě snadno přehlédne.",
    ],
    explanation:
      "Na parkovišti si dáváme pozor hlavně na couvající nebo vyjíždějící auta, protože řidič nemusí chodce hned vidět.",
    optionFeedback: {
      "Na stromy v parku": "Stromy se nehýbou a na parkovišti ti nehrozí. Nebezpečí jsou auta.",
      "Na semafor na parkovišti": "Na parkovišti semafor obvykle není. Hlídat musíš auta, která se rozjíždějí.",
      "Na chodce na chodníku": "Ostatní chodci tě neohrozí tolik jako auto, které vyjíždí z parkovacího místa.",
    },
  },
  {
    question: "Proč je nejbezpečnější přecházet silnici právě na přechodu pro chodce?",
    correctAnswer: "Protože tam řidiči počítají s chodci a musí je pustit",
    options: [
      "Protože je to vždy nejkratší cesta",
      "Protože tam řidiči počítají s chodci a musí je pustit",
      "Protože tam bývá nejméně aut",
      "Protože tam je hezčí výhled",
    ],
    emoji: "🚸",
    hints: [
      "Přechod je místo, kde auta počítají s tím, že přes silnici mohou jít lidé.",
      "Přemýšlej, co dělá toto místo jiným než zbytek silnice. Co musí řidič udělat, když u bílých pruhů uvidí chodce?",
    ],
    explanation:
      "Na přechodu pro chodce řidiči vědí, že tudy mohou přecházet lidé, a musí je pustit. Proto je to nejbezpečnější místo k přecházení.",
    optionFeedback: {
      "Protože je to vždy nejkratší cesta": "Přechod často nejkratší cesta není. Je ale nejbezpečnější.",
      "Protože tam bývá nejméně aut": "U přechodu může jezdit hodně aut. Bezpečný je proto, že tam řidiči musí dávat pozor na chodce.",
      "Protože tam je hezčí výhled": "Na výhledu do krajiny nezáleží. Důležité je, že řidiči chodce pustí.",
    },
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Blížíš se k přechodu, ale semafor pro chodce je rozbitý a nesvítí, i když bílé pruhy na silnici jsou vidět. Co je nejbezpečnější?",
    correctAnswer: "Rozhlédnout se na obě strany jako na přechodu bez semaforu a přejít, až bude bezpečno",
    options: [
      "Přejít bez rozhlížení, protože přechod chodce vždy ochrání",
      "Počkat, až semafor znovu začne svítit, i kdyby to trvalo dlouho",
      "Rozhlédnout se na obě strany jako na přechodu bez semaforu a přejít, až bude bezpečno",
      "Přejít jen tehdy, když tam bude dospělý",
    ],
    emoji: "🚦",
    hints: [
      "Spoj dva fakty: přechod ukazuje bezpečné místo k přecházení, ale nefunkční semafor ti nedá žádný pokyn.",
      "Vzpomeň si, jak se přechází na obyčejném přechodu, který semafor vůbec nemá. Když semafor nesvítí, je to pro tebe úplně stejná situace.",
    ],
    explanation:
      "I na přechodu s rozbitým semaforem platí stejné pravidlo jako na přechodu bez semaforu: rozhlédni se na obě strany a přejdi, až bude bezpečno.",
    optionFeedback: {
      "Přejít bez rozhlížení, protože přechod chodce vždy ochrání": "Bílé pruhy tě neochrání samy. Řidič tě musí vidět včas, a proto se rozhlížíš.",
      "Počkat, až semafor znovu začne svítit, i kdyby to trvalo dlouho": "Oprava může trvat dny. Přechod funguje i bez semaforu, jen se musíš sám rozhlédnout.",
      "Přejít jen tehdy, když tam bude dospělý": "Dospělý tam být nemusí. Pravidlo pro přechod bez semaforu zvládneš použít sám.",
    },
  },
  {
    question:
      "Máš na výběr dvě cesty do školy: kratší podél rušné silnice bez chodníku a o kousek delší po chodníku. Kterou zvolíš?",
    correctAnswer: "Delší cestu po chodníku",
    options: [
      "Kratší cestu podél silnice, protože ušetří čas",
      "Kratší cestu, protože po silnici se dá jít, když nejedou auta",
      "Je to jedno, hlavně abych nepřišel pozdě",
      "Delší cestu po chodníku",
    ],
    emoji: "🏫",
    hints: [
      "Porovnej dva fakty: kratší cesta nemá chodník, delší cesta ho má.",
      "Zvaž, co je při cestě do školy důležitější — ušetřený čas, nebo bezpečí. Kde budeš oddělený od aut na rušné silnici?",
    ],
    explanation:
      "I když je cesta po chodníku o kousek delší, bezpečnost je důležitější než ušetřený čas. Proto zvolíme cestu s chodníkem.",
    optionFeedback: {
      "Kratší cestu podél silnice, protože ušetří čas": "Pár ušetřených minut nestojí za to jít těsně vedle rušné silnice.",
      "Kratší cestu, protože po silnici se dá jít, když nejedou auta": "Na rušné silnici auta jezdí pořád. Bez chodníku tě nic neoddělí.",
      "Je to jedno, hlavně abych nepřišel pozdě": "Jedno to není. Jedna cesta je bezpečná a druhá nebezpečná.",
    },
  },
  {
    question:
      "Jdeš po chodníku a kousek před tebou se staví, takže musíš na chvíli sejít na silnici. Co uděláš?",
    correctAnswer: "Než sejdu na silnici, rozhlédnu se a co nejrychleji se vrátím zpátky na chodník",
    options: [
      "Než sejdu na silnici, rozhlédnu se a co nejrychleji se vrátím zpátky na chodník",
      "Projdu po silnici, aniž bych se rozhlédl, protože je to jen kousek",
      "Půjdu dál prostředkem silnice, i když už chodník zase pokračuje",
      "Přejdu na druhou stranu ulice bez rozhlédnutí",
    ],
    emoji: "🚧",
    hints: [
      "Kombinuj pravidlo pro vstup na silnici s pravidlem, jak dlouho na ní zůstat.",
      "Rozlož to na dva kroky: co musíš udělat ještě předtím, než na silnici vstoupíš, a kdy se z ní máš vrátit tam, kam chodec patří.",
    ],
    explanation:
      "Když musíme na chvíli sejít na silnici, platí stejné pravidlo jako při přecházení: nejdřív se rozhlédnout. Na silnici zůstaneme jen nutnou chvíli a hned se vrátíme na chodník.",
    optionFeedback: {
      "Projdu po silnici, aniž bych se rozhlédl, protože je to jen kousek": "I na krátkém kousku tě může auto zezadu nečekaně ohrozit. Rozhlédnout se musíš vždycky.",
      "Půjdu dál prostředkem silnice, i když už chodník zase pokračuje": "Jakmile chodník pokračuje, patříš zpátky na něj. Na silnici nezůstáváš déle, než musíš.",
      "Přejdu na druhou stranu ulice bez rozhlédnutí": "Přecházení bez rozhlédnutí je nebezpečné, ať jdeš kamkoli.",
    },
  },
  {
    question:
      "Na plánu obce vidíš dvě stejně dlouhé cesty do školy: jedna vede kolem parkoviště s auty, druhá kolem parku se stromy. Která je bezpečnější?",
    correctAnswer: "Cesta kolem parku",
    options: [
      "Cesta kolem parkoviště, protože auta tam stojí a nikam nejedou",
      "Cesta kolem parku",
      "Obě jsou stejně bezpečné, záleží jen na délce",
      "Cesta kolem parkoviště, protože je tam víc lidí",
    ],
    emoji: "🗺️",
    hints: [
      "Vzpomeň si, jaké nebezpečí hrozí na parkovišti, a porovnej ho s tím, co hrozí mezi stromy.",
      "Auta na parkovišti nejsou pořád v klidu: vyjíždějí, couvají a zajíždějí. Kde se naopak auta vůbec nepohybují?",
    ],
    explanation:
      "Cesta kolem parku je bezpečnější, protože se tam nepohybují auta, zatímco na parkovišti hrozí couvající nebo vyjíždějící vozidla.",
    optionFeedback: {
      "Cesta kolem parkoviště, protože auta tam stojí a nikam nejedou": "Auta na parkovišti se často rozjíždějí a couvají. Řidič tě přitom snadno přehlédne.",
      "Obě jsou stejně bezpečné, záleží jen na délce": "Cesty jsou stejně dlouhé, ale liší se tím, jestli kolem nich jezdí auta.",
      "Cesta kolem parkoviště, protože je tam víc lidí": "Víc lidí neznamená bezpečí. Rozhoduje, jestli se kolem pohybují auta.",
    },
  },
  {
    question:
      "Jdeš s kamarády k přechodu, kde svítí červená pro chodce. Kamarád navrhuje přeběhnout, že auto stihne zastavit. Co je správně?",
    correctAnswer: "Počkat na zelenou pro chodce",
    options: [
      "Poslechnout kamaráda a přeběhnout, protože je nás víc",
      "Přeběhnout, protože přechod chodce vždy ochrání",
      "Počkat na zelenou pro chodce",
      "Počkat jen já a nechat kamarády jít",
    ],
    emoji: "🚦",
    hints: [
      "Pravidlo o červené platí bez ohledu na to, co navrhují kamarádi.",
      "Rozhoduješ se za sebe. Spoj pravidlo semaforu s tím, že názor kamaráda na barvě semaforu nic nezmění, a mysli i na bezpečí ostatních.",
    ],
    explanation:
      "I když kamarád navrhne přeběhnout na červenou, správné je počkat na zelenou. Pravidla bezpečnosti platí vždy, bez ohledu na to, co říkají ostatní, a je dobré udržet u přechodu i kamarády.",
    optionFeedback: {
      "Poslechnout kamaráda a přeběhnout, protože je nás víc": "Skupina chodců auto nezastaví. Červená platí pro všechny.",
      "Přeběhnout, protože přechod chodce vždy ochrání": "Na červenou tě přechod nechrání, protože auta mají zelenou a jedou.",
      "Počkat jen já a nechat kamarády jít": "Sám se zachováš správně, ale kamarády bys měl zastavit, protože by byli v nebezpečí.",
    },
  },
  {
    question:
      "Ráno je hustá mlha a je špatně vidět do dálky. Jdeš do školy stejnou cestou jako obvykle. Co uděláš jinak než za jasného počasí?",
    correctAnswer: "Budu se rozhlížet déle a pečlivěji",
    options: [
      "Nebudu se rozhlížet vůbec, protože mlha auta stejně schová",
      "Půjdu rychleji, abych byl v mlze co nejkratší dobu na silnici",
      "Nebudu nic měnit, mlha na chůzi nemá vliv",
      "Budu se rozhlížet déle a pečlivěji",
    ],
    emoji: "🌫️",
    hints: [
      "Spoj dva fakty: za mlhy je vidět na kratší vzdálenost a auta se objeví později, než čekáš.",
      "Když auto vystoupí z mlhy až těsně před tebou, máš na rozhodnutí míň času. Co z toho plyne pro to, jak se máš před přecházením dívat?",
    ],
    explanation:
      "Za mlhy je vidět na kratší vzdálenost, proto se musíme rozhlížet déle a pečlivěji, abychom si byli jistí, že žádné auto nepřijíždí.",
    optionFeedback: {
      "Nebudu se rozhlížet vůbec, protože mlha auta stejně schová": "Právě proto, že mlha auta schovává, se musíš dívat ještě pozorněji.",
      "Půjdu rychleji, abych byl v mlze co nejkratší dobu na silnici": "Spěch v mlze pomáhá málo. Hlavní je dívat se déle, než vstoupíš na silnici.",
      "Nebudu nic měnit, mlha na chůzi nemá vliv": "Mlha zkracuje, jak daleko vidíš ty i řidiči. To je velký rozdíl.",
    },
  },
  {
    question:
      "U školy je vedle sebe přechod pro chodce i zastávka autobusu. Kudy je nejbezpečnější přejít silnici, právě když k zastávce přijíždí autobus?",
    correctAnswer: "Po přechodu, ale až autobus zastaví a odjede",
    options: [
      "Po přechodu, ale až autobus zastaví a odjede",
      "Hned před přijíždějícím autobusem, protože na přechodu mají chodci přednost",
      "Hned za stojícím autobusem",
      "Mimo přechod, aby to bylo rychlejší",
    ],
    emoji: "🚌",
    hints: [
      "Kombinuj dvě pravidla najednou: přechod je bezpečné místo, ale stojící nebo přijíždějící autobus ti může zakrýt výhled.",
      "Rozmysli zvlášť, kde přejít a kdy přejít. I na tom bezpečném místě s bílými pruhy potřebuješ mít volný výhled na celou silnici na obě strany. Může ti ho dát autobus, který u zastávky stojí nebo se k ní blíží?",
    ],
    explanation:
      "I na přechodu je třeba počkat, až autobus odjede a výhled na silnici bude volný. Teprve pak bezpečně přejdeme.",
    optionFeedback: {
      "Hned před přijíždějícím autobusem, protože na přechodu mají chodci přednost": "Velký autobus nezabrzdí hned, i když máš na přechodu přednost.",
      "Hned za stojícím autobusem": "Stojící autobus ti zakryje auta, která ho objíždějí.",
      "Mimo přechod, aby to bylo rychlejší": "Mimo přechod řidiči chodce nečekají. Rychlost za to nestojí.",
    },
  },
  {
    question: "Kamarád tvrdí, že dopravní značka s obrázkem funguje úplně stejně jako semafor. Má pravdu?",
    correctAnswer: "Ne, značka ukazuje pořád stejný pokyn, semafor mění barvy",
    options: [
      "Ano, obě věci dávají chodcům úplně stejný pokyn",
      "Ne, značka ukazuje pořád stejný pokyn, semafor mění barvy",
      "Ano, protože obě stojí u silnice",
      "Ne, protože značka je jen na plánu, ne ve skutečnosti",
    ],
    emoji: "🪧",
    hints: [
      "Porovnej, jak se chová značka a jak se chová semafor.",
      "Představ si, že se na obě věci díváš pět minut. Která z nich se během té doby změní a která zůstane pořád stejná?",
    ],
    explanation:
      "Dopravní značka a semafor nejsou totéž. Značka stále ukazuje stejný pokyn nebo informaci, zatímco semafor mění barvy a říká, kdy jít a kdy stát.",
    optionFeedback: {
      "Ano, obě věci dávají chodcům úplně stejný pokyn": "Semafor dává střídavě dva různé pokyny, stůj a jdi. Značka ukazuje pořád jeden.",
      "Ano, protože obě stojí u silnice": "U silnice stojí i lampa nebo strom. Místo neříká, jak věc funguje.",
      "Ne, protože značka je jen na plánu, ne ve skutečnosti": "Značky opravdu stojí u silnice. Rozdíl je v tom, že nemění barvy.",
    },
  },
  {
    question:
      "Cesta do školy vede kolem řeky s mostem a kolem hřiště. Na co si dáš pozor na obou těchto místech zároveň?",
    correctAnswer: "U mostu na okraj a hloubku vody, na hřišti na to, aby mě hraní nerozptýlilo od cesty",
    options: [
      "Na obou místech se můžu zastavit a hrát si, škola počká",
      "Řeka i hřiště jsou bezpečná místa, není třeba na nic dávat pozor",
      "U mostu na okraj a hloubku vody, na hřišti na to, aby mě hraní nerozptýlilo od cesty",
      "Stačí dávat pozor jen na hřišti, řeka žádné nebezpečí nemá",
    ],
    emoji: "🌉",
    hints: [
      "Spoj dvě různá nebezpečí — jedno u vody, druhé na hřišti — a mysli na obě zároveň.",
      "U vody přemýšlej, co by se stalo, kdybys uklouzl přes okraj. U hřiště přemýšlej, co tě láká a mohlo by tě zdržet nebo odvést z cesty.",
    ],
    explanation:
      "U řeky a mostu je třeba dávat pozor na okraj a hloubku vody, na hřišti zase na to, aby nás hraní nerozptýlilo od bezpečné cesty do školy.",
    optionFeedback: {
      "Na obou místech se můžu zastavit a hrát si, škola počká": "Hraní u vody je nebezpečné a cestou do školy se nezdržujeme.",
      "Řeka i hřiště jsou bezpečná místa, není třeba na nic dávat pozor": "U hluboké vody hrozí pád do řeky. Pozor je potřeba.",
      "Stačí dávat pozor jen na hřišti, řeka žádné nebezpečí nemá": "Řeka je nebezpečnější než hřiště, protože do vody můžeš spadnout.",
    },
  },
  {
    question:
      "Na plánu vidíš, že škola leží hned vedle rušné křižovatky bez přechodu, ale o kousek dál je přechod se semaforem. Kudy raději půjdeš?",
    correctAnswer: "O kousek dál k přechodu se semaforem",
    options: [
      "Rovnou přes křižovatku, protože je to nejblíž ke škole",
      "Rovnou přes křižovatku, protože tam bývá málo aut",
      "Je jedno kudy, hlavně přijít do školy včas",
      "O kousek dál k přechodu se semaforem",
    ],
    emoji: "🚧",
    hints: [
      "Porovnej, co je důležitější — pár kroků navíc, nebo bezpečnější přecházení.",
      "Na rušné křižovatce jezdí auta z několika stran a nic je nezastaví. Kde ti naopak barva světla řekne, kdy auta stojí?",
    ],
    explanation:
      "I když je to o kousek dál, přechod se semaforem je mnohem bezpečnější než přecházení rušné křižovatky bez přechodu.",
    optionFeedback: {
      "Rovnou přes křižovatku, protože je to nejblíž ke škole": "Blízko neznamená bezpečně. Na rušné křižovatce bez přechodu tě nic nechrání.",
      "Rovnou přes křižovatku, protože tam bývá málo aut": "Křižovatka je v zadání rušná, jezdí tam hodně aut.",
      "Je jedno kudy, hlavně přijít do školy včas": "Jedno to není. Semafor zastaví auta, křižovatka bez přechodu ne.",
    },
  },
  {
    question:
      "Kamarádka jde ráno do školy bez reflexních prvků, protože svítí slunce. Domů ale jde pozdě odpoledne v zimě, kdy se brzy stmívá. Má si je vzít?",
    correctAnswer: "Ano, protože v zimě se brzy stmívá i odpoledne",
    options: [
      "Ano, protože v zimě se brzy stmívá i odpoledne",
      "Ne, reflexní prvky jsou potřeba jen ráno",
      "Ne, ve městě je vždy dost pouličních lamp",
      "Ano, ale jen když prší, ne za jasného počasí",
    ],
    emoji: "🦺",
    hints: [
      "Spoj dva fakty: reflexní prvky pomáhají za snížené viditelnosti a v zimě se stmívá už brzy odpoledne.",
      "Nerozhoduje, jak bylo ráno, ale jaké světlo bude na cestě domů. Představ si zimní odpoledne kolem páté hodiny — je ještě světlo?",
    ],
    explanation:
      "V zimě se brzy stmívá, takže i cesta domů odpoledne může být za tmy. Reflexní prvky se proto hodí nejen ráno, ale i tehdy.",
    optionFeedback: {
      "Ne, reflexní prvky jsou potřeba jen ráno": "Reflexní prvky jsou potřeba vždycky, když je tma. V zimě to bývá i odpoledne.",
      "Ne, ve městě je vždy dost pouličních lamp": "Lampy nesvítí všude stejně a řidič tě s reflexním prvkem uvidí mnohem dřív.",
      "Ano, ale jen když prší, ne za jasného počasí": "I za jasného zimního odpoledne se brzy setmí. Rozhoduje tma, ne jen déšť.",
    },
  },
  {
    question:
      "Na chodníku před tebou jde dospělý s kočárkem, který zabírá skoro celou šířku chodníku, a vedle chodníku jede po silnici auto. Co uděláš?",
    correctAnswer: "Počkám za kočárkem na volnější místo chodníku",
    options: [
      "Seběhnu na silnici, abych kočárek objel co nejrychleji",
      "Počkám za kočárkem na volnější místo chodníku",
      "Protlačím se kolem kočárku těsně u okraje silnice",
      "Požádám dospělého, ať s kočárkem sjede na silnici a pustí mě",
    ],
    emoji: "🚶",
    hints: [
      "Přemýšlej, co ti hrozí, pokud kvůli objetí překážky vstoupíš na silnici, i jen na chvíli.",
      "Spoj pravidlo o chodníku a silnici s tím, že kočárek ti překáží jen chvilku. Je lepší ztratit pár vteřin, nebo riskovat u jedoucího auta?",
    ],
    explanation:
      "I když nás něco zpomalí, nikdy kvůli tomu nevstupujeme na silnici s projíždějícími auty. Počkáme na chodníku na vhodnější místo, kde kočárek bezpečně obejdeme.",
    optionFeedback: {
      "Seběhnu na silnici, abych kočárek objel co nejrychleji": "Na silnici právě jede auto. Seběhnout tam je velmi nebezpečné.",
      "Protlačím se kolem kočárku těsně u okraje silnice": "Těsně u okraje stačí zakopnout a jsi pod koly auta.",
      "Požádám dospělého, ať s kočárkem sjede na silnici a pustí mě": "Tím bys do nebezpečí poslal dospělého i miminko. Počkat je správné.",
    },
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const PLANOBCEOKOLISKOLY: TopicMetadata[] = [
  {
    id: "g2-prv-plan-obce",
    rvpNodeId: "g2-prvouka-misto-kde-zijeme-obec-a-okoli-plan-obce-okoli-skoly",
    title: "Plán obce a okolí školy",
    studentTitle: "Mapa naší obce",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Obec a okolí",
    briefDescription: "Poznáš, co je na plánu obce.",
    keywords: ["plán", "obec", "ulice", "silnice", "autobus", "semafor"],
    goals: [
      "Poznat, co je na plánu obce.",
      "Vědět, jak se dostat do školy.",
      "Znát dopravní prvky v obci.",
    ],
    boundaries: ["Pouze základní orientace.", "Bez čtení mapy."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na plánu obce jsou ulice, silnice a domy.",
      steps: ["Přečti otázku.", "Co venku v obci vidíš?"],
      commonMistake: "Záměna chodníku (pro lidi) a silnice (pro auta).",
      example: "Po silnici jezdí auta, po chodníku chodí lidé.",
    },
  },
];
