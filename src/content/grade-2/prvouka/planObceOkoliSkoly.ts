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
      "Na plán se díváme, jako bychom se dívali na obec shora, z ptačí perspektivy.",
    ],
    explanation:
      "Plán obce je zjednodušený nákres, na kterém vidíme shora ulice, domy a důležitá místa v obci.",
  },
  {
    question: "Jak se jmenují pojmenované cesty v obci, podél kterých stojí domy?",
    correctAnswer: "Ulice",
    options: ["Louky", "Ulice", "Zahrady", "Hřiště"],
    emoji: "🏘️",
    hints: [
      "Každý dům má adresu, ve které je napsaný název této cesty.",
      "Například Hlavní ___, Školní ___ — takhle se jmenují jednotlivé cesty v obci.",
    ],
    explanation:
      "Cesty v obci, podél kterých stojí domy, se jmenují ulice. Každá ulice má své vlastní jméno.",
  },
  {
    question: "Po čem jezdí auta?",
    correctAnswer: "Silnice",
    options: ["Chodník", "Tráva", "Silnice", "Hřiště"],
    emoji: "🛣️",
    hints: [
      "Auta nejezdí tam, kudy chodí lidé.",
      "Hledej plochu určenou přímo pro vozidla.",
    ],
    explanation: "Auta jezdí po silnici. Silnice je určená pro vozidla, ne pro chodce.",
  },
  {
    question: "Po čem chodíme, když jdeme podél silnice?",
    correctAnswer: "Chodník",
    options: ["Silnice", "Parkoviště", "Koleje", "Chodník"],
    emoji: "🚶",
    hints: [
      "Chodci mají svou vlastní cestu, oddělenou od silnice.",
      "Tato cesta je určená jen pro lidi, ne pro auta.",
    ],
    explanation: "Podél silnice chodíme po chodníku. Chodník odděluje chodce od projíždějících aut.",
  },
  {
    question: "Kde je bezpečné místo pro přecházení silnice, označené na vozovce bílými pruhy?",
    correctAnswer: "Přechod pro chodce",
    options: ["Přechod pro chodce", "Parkoviště", "Zastávka", "Křižovatka"],
    emoji: "🚸",
    hints: [
      "Toto místo poznáš podle bílých pruhů namalovaných na silnici.",
      "Je určené přesně pro to, aby tam chodci mohli bezpečně přejít na druhou stranu.",
    ],
    explanation:
      "Bezpečné místo pro přecházení silnice se jmenuje přechod pro chodce. Poznáš ho podle bílých pruhů na vozovce.",
  },
  {
    question: "Co svítí na semaforu, když chodci nesmí přejít silnici?",
    correctAnswer: "Červená",
    options: ["Zelená", "Červená", "Modrá", "Žlutá"],
    emoji: "🚦",
    hints: [
      "Tato barva znamená stůj.",
      "Je to stejná barva, jakou má i hasičské auto.",
    ],
    explanation: "Když na semaforu svítí červená, chodci musí zůstat stát a nesmí přejít silnici.",
  },
  {
    question: "Co svítí na semaforu, když chodci smí přejít silnici?",
    correctAnswer: "Zelená",
    options: ["Červená", "Modrá", "Zelená", "Oranžová"],
    emoji: "🚦",
    hints: [
      "Tato barva znamená jdi.",
      "Je to barva trávy a listí na stromech.",
    ],
    explanation: "Když na semaforu svítí zelená, chodci smí bezpečně přejít silnici.",
  },
  {
    question: "Kde čekáme na autobus?",
    correctAnswer: "Zastávka",
    options: ["Křižovatka", "Přechod", "Parkoviště", "Zastávka"],
    emoji: "🚏",
    hints: [
      "Autobus staví jen na jednom určeném a označeném místě.",
      "Toto místo bývá označené tabulí s čísly linek.",
    ],
    explanation: "Na autobus čekáme na zastávce — je to místo, kde autobus pravidelně staví.",
  },
  {
    question: "Co je postavené přes řeku, abychom se dostali na druhý břeh?",
    correctAnswer: "Most",
    options: ["Most", "Plot", "Lavička", "Cedule"],
    emoji: "🌉",
    hints: [
      "Přes vodu se dostaneme jen po pevné stavbě.",
      "Chodí i jezdí po něm auta i lidé nad vodní hladinou.",
    ],
    explanation: "Přes řeku je postavený most, po kterém se dostaneme na druhý břeh.",
  },
  {
    question: "Co u cesty ukazuje, kudy máme jít nebo jet, případně na co si dát pozor?",
    correctAnswer: "Dopravní značka",
    options: ["Lavička", "Dopravní značka", "Plot", "Strom"],
    emoji: "🪧",
    hints: [
      "Toto najdeš u silnice nebo chodníku — má obrázek nebo nápis.",
      "Řidiči i chodci se podle toho řídí.",
    ],
    explanation: "Dopravní značka u cesty ukazuje, kudy jít nebo jet, případně na co si dát pozor.",
  },
  {
    question: "Kde si děti hrají venku na prolézačkách a houpačkách?",
    correctAnswer: "Hřiště",
    options: ["Parkoviště", "Zastávka", "Hřiště", "Křižovatka"],
    emoji: "🛝",
    hints: [
      "Toto místo má pískoviště, houpačky a prolézačky.",
      "Chodí tam děti hlavně za hrou, ne za dopravou.",
    ],
    explanation: "Děti si hrají na hřišti, kde jsou houpačky, prolézačky a pískoviště.",
  },
  {
    question: "Kde stojí zaparkovaná auta, když zrovna nikam nejedou?",
    correctAnswer: "Parkoviště",
    options: ["Chodník", "Hřiště", "Zastávka", "Parkoviště"],
    emoji: "🅿️",
    hints: [
      "Auta potřebují místo, kde mohou stát, aniž by komukoliv překážela.",
      "Toto místo bývá vyznačené na plánu obce zvláštní značkou s písmenem P.",
    ],
    explanation: "Auta stojí na parkovišti — je to plocha určená k parkování vozidel.",
  },
  {
    question: "Jaká hromadná doprava jezdí po kolejích přímo v ulicích města?",
    correctAnswer: "Tramvaj",
    options: ["Tramvaj", "Loď", "Letadlo", "Dálkový vlak"],
    emoji: "🚊",
    hints: [
      "Tento dopravní prostředek jezdí po kolejích, ale ne mezi městy jako vlak.",
      "Má vodiče nahoře a zvoní, když se blíží ke křižovatce.",
    ],
    explanation: "Ulicemi města jezdí po kolejích tramvaj — je to hromadná doprava pro cestování ve městě.",
  },
  {
    question: "Co roste v parku a v létě dává stín?",
    correctAnswer: "Stromy",
    options: ["Auta", "Stromy", "Značky", "Lavičky"],
    emoji: "🌳",
    hints: [
      "V parku je hodně zeleně.",
      "Co v parku roste do výšky a má listy nebo jehličí?",
    ],
    explanation: "V parku rostou stromy, které dávají stín a dělají prostředí příjemnější.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jdeš do školy a chceš přejít silnici. Co uděláš nejdřív?",
    correctAnswer: "Podívám se na obě strany, jestli nejede auto",
    options: ["Rozeběhnu se přes silnici", "Zavřu oči a přeběhnu", "Podívám se na obě strany, jestli nejede auto", "Počkám, až uvidím kamaráda na druhé straně"],
    emoji: "🚸",
    hints: [
      "Než vstoupíš na silnici, musíš se ujistit, že je bezpečno.",
      "Přemýšlej, co dělá zkušený chodec ještě předtím, než udělá první krok na vozovku.",
    ],
    explanation:
      "Před přechodem silnice se vždy nejdřív podíváme na obě strany, jestli nejede auto, a teprve pak přejdeme.",
  },
  {
    question: "Na přechodu svítí semafor pro chodce červeně. Co uděláš?",
    correctAnswer: "Počkám, až se rozsvítí zelená",
    options: ["Rychle přeběhnu, dokud nejede žádné auto", "Přejdu, protože spěchám do školy", "Přejdu jen kousek a počkám uprostřed silnice", "Počkám, až se rozsvítí zelená"],
    emoji: "🚦",
    hints: [
      "Červená na semaforu platí i pro chodce, ne jen pro auta.",
      "Zamysli se, jakou barvu semafor ukazuje, když je bezpečno jít.",
    ],
    explanation:
      "Když svítí červená, chodci musí počkat na zelenou — i když se zdá, že žádné auto nejede.",
  },
  {
    question: "Jdeš po chodníku do školy. Kde je nejbezpečnější místo pro chůzi?",
    correctAnswer: "Dál od okraje silnice",
    options: ["Dál od okraje silnice", "Přímo u krajnice silnice", "Uprostřed silnice", "Zády k projíždějícím autům"],
    emoji: "🚶",
    hints: [
      "Čím dál od projíždějících aut jdeš, tím bezpečněji jdeš.",
      "Chodník bývá širší než jen jeden krok — kde je na něm nejvíc bezpečno?",
    ],
    explanation:
      "Na chodníku je nejbezpečnější jít dál od silnice, abychom měli od projíždějících aut co největší odstup.",
  },
  {
    question: "Chceš přejít silnici tam, kde není ani přechod, ani semafor. Co je nejbezpečnější?",
    correctAnswer: "Najít místo s dobrým výhledem na obě strany",
    options: ["Přejít okamžitě tam, kde stojím", "Najít místo s dobrým výhledem na obě strany", "Přeběhnout mezi stojícími auty", "Přejít, jen když jde přede mnou kamarád"],
    emoji: "🚸",
    hints: [
      "I bez přechodu platí to samé pravidlo jako s přechodem — hledej bezpečné podmínky.",
      "Přemýšlej, co potřebuješ vidět, abys byl v přecházení jistý.",
    ],
    explanation:
      "I když poblíž není přechod ani semafor, nejbezpečnější je najít místo s dobrým výhledem na obě strany, případně dojít k nejbližšímu přechodu.",
  },
  {
    question: "Jedeš do školy autobusem. Kde na něj bezpečně počkáš?",
    correctAnswer: "Na zastávce, dál od okraje vozovky",
    options: ["Uprostřed silnice", "Na přechodu pro chodce", "Na zastávce, dál od okraje vozovky", "Na parkovišti"],
    emoji: "🚏",
    hints: [
      "Autobus staví jen na jednom označeném místě u silnice.",
      "I na zastávce je potřeba stát dostatečně daleko od projíždějících vozidel.",
    ],
    explanation:
      "Na autobus čekáme na zastávce a stojíme dál od okraje vozovky, aby nás projíždějící auta ani přijíždějící autobus neohrozily.",
  },
  {
    question: "Za tmy nebo za špatného počasí jdeš do školy pěšky. Co ti pomůže, aby tě řidiči lépe viděli?",
    correctAnswer: "Reflexní prvky, třeba páska nebo přívěsek",
    options: ["Tmavé oblečení bez potisku", "Deštník zakrývající obličej", "Sluneční brýle s tmavými skly", "Reflexní prvky, třeba páska nebo přívěsek"],
    emoji: "🦺",
    hints: [
      "Řidiči tě uvidí lépe, pokud na tobě něco zasvítí ve světle jejich reflektorů.",
      "Hledej doplněk, který je speciálně vyrobený tak, aby odrážel světlo.",
    ],
    explanation:
      "Reflexní prvky odrážejí světlo aut, takže tě řidiči za snížené viditelnosti uvidí mnohem dřív a lépe.",
  },
  {
    question: "Kudy vede bezpečná cesta ze školy domů, pokud vede podél silnice?",
    correctAnswer: "Po chodníku",
    options: ["Po chodníku", "Po silnici, protože je to kratší", "Po silnici, když nejedou auta", "Po chodníku i po silnici, jak se to hodí"],
    emoji: "🏫",
    hints: [
      "I na krátkém úseku platí obecné pravidlo, kde má chodit chodec a kde jezdí auta.",
      "Vzpomeň si, jaké místo je pro chodce vždy určené, ať je cesta jakkoli krátká.",
    ],
    explanation:
      "I na cestě domů platí, že bezpečná cesta vede po chodníku, nikdy po silnici, i kdyby se zdála prázdná.",
  },
  {
    question: "Blíží se křižovatka bez semaforu. Co uděláš, než přejdeš?",
    correctAnswer: "Rozhlédnu se na obě strany a počkám, až bude volno",
    options: ["Přejdu, protože na křižovatce mají chodci vždy přednost", "Rozhlédnu se na obě strany a počkám, až bude volno", "Zavolám na řidiče, ať zastaví", "Přeběhnu rychle mezi projíždějícími auty"],
    emoji: "🚧",
    hints: [
      "Bez semaforu si bezpečnost musíš ohlídat sám.",
      "Přemýšlej, co dělá chodec vždy předtím, než vstoupí na silnici bez pomoci semaforu.",
    ],
    explanation:
      "Na křižovatce bez semaforu se musíme pečlivě rozhlédnout na obě strany a přejít, až bude bezpečno.",
  },
  {
    question: "Jdeš skupinou spolužáků do školy. Co je bezpečnější?",
    correctAnswer: "Jít v řadě za sebou po chodníku",
    options: ["Jít v houfu přes celou šířku chodníku i silnici", "Běhat kolem sebe", "Jít v řadě za sebou po chodníku", "Jít po silnici vedle sebe"],
    emoji: "👫",
    hints: [
      "Na chodníku je omezené místo.",
      "Přemýšlej, jak jít, aby skupina nezasahovala na silnici.",
    ],
    explanation:
      "Bezpečnější je jít v řadě za sebou po chodníku, aby skupina nezasahovala do silnice a nikomu nepřekážela.",
  },
  {
    question: "Vystupuješ z autobusu na zastávce a potřebuješ přejít silnici. Co uděláš?",
    correctAnswer: "Počkám, až autobus odjede, a pak se rozhlédnu",
    options: ["Přeběhnu hned před přijíždějícím autobusem", "Přeběhnu hned za odjíždějícím autobusem", "Přejdu, dokud autobus stojí, protože mě schová", "Počkám, až autobus odjede, a pak se rozhlédnu"],
    emoji: "🚌",
    hints: [
      "Zamysli se, co ti stojící nebo odjíždějící autobus dočasně brání vidět.",
      "Teprve když je výhled na silnici volný, je bezpečné se rozhlédnout a přejít.",
    ],
    explanation:
      "Autobus zakrývá výhled na silnici, proto počkáme, až odjede, a teprve pak se rozhlédneme a přejdeme.",
  },
  {
    question: "Jdeš do školy a míjíš parkoviště plné aut. Na co si dáš pozor nejvíc?",
    correctAnswer: "Na auta, která se dávají do pohybu",
    options: [
      "Na auta, která se dávají do pohybu",
      "Na stromy v parku",
      "Na semafor na parkovišti",
      "Na chodce na chodníku",
    ],
    emoji: "🅿️",
    hints: [
      "Na parkovišti se auta nejen parkují, ale i pohybují.",
      "Přemýšlej, jaký pohyb auta je pro chodce nejméně čekaný a nejhůř viditelný.",
    ],
    explanation:
      "Na parkovišti si dáváme pozor hlavně na couvající nebo vyjíždějící auta, protože řidič nemusí chodce hned vidět.",
  },
  {
    question: "Proč je nejbezpečnější přecházet silnici právě na přechodu pro chodce?",
    correctAnswer: "Protože tam řidiči počítají s chodci a musí je pustit",
    options: ["Protože je to vždy nejkratší cesta", "Protože tam řidiči počítají s chodci a musí je pustit", "Protože tam bývá nejméně aut", "Protože tam je hezčí výhled"],
    emoji: "🚸",
    hints: [
      "Přechod je místo, kde auta počítají s tím, že přes silnici mohou jít lidé.",
      "Přemýšlej, co dělá toto místo jiným než zbytek silnice.",
    ],
    explanation:
      "Na přechodu pro chodce řidiči vědí, že tudy mohou přecházet lidé, a musí je pustit — proto je to nejbezpečnější místo k přecházení.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Blížíš se k přechodu, ale semafor pro chodce je rozbitý a nesvítí, i když bílé pruhy na silnici jsou vidět. Co je nejbezpečnější?",
    correctAnswer: "Rozhlédnout se na obě strany jako na přechodu bez semaforu a přejít, až bude bezpečno",
    options: ["Přejít bez rozhlížení, protože přechod chodce vždy ochrání", "Počkat, až semafor znovu začne svítit, i kdyby to trvalo dlouho", "Rozhlédnout se na obě strany jako na přechodu bez semaforu a přejít, až bude bezpečno", "Přejít jen tehdy, když tam bude dospělý"],
    emoji: "🚦",
    hints: [
      "Spoj dva fakty: přechod ukazuje bezpečné místo k přecházení, ale nefunkční semafor ti nedá žádný pokyn.",
      "Přemýšlej, jak přecházíš na přechodu, který semafor vůbec nemá — a použij stejné pravidlo.",
    ],
    explanation:
      "I na přechodu se rozbitým semaforem platí stejné pravidlo jako na přechodu bez semaforu: rozhlédni se na obě strany a přejdi, až bude bezpečno.",
  },
  {
    question:
      "Máš na výběr dvě cesty do školy: kratší podél rušné silnice bez chodníku a o kousek delší po chodníku. Kterou zvolíš?",
    correctAnswer: "Delší cestu po chodníku",
    options: ["Kratší cestu podél silnice, protože ušetří čas", "Kratší cestu, protože po silnici se dá jít, když nejedou auta", "Je to jedno, hlavně abych nepřišel pozdě", "Delší cestu po chodníku"],
    emoji: "🏫",
    hints: [
      "Porovnej dva fakty: kratší cesta nemá chodník, delší cesta ho má.",
      "Zvaž, co je při cestě do školy důležitější — ušetřený čas, nebo bezpečí.",
    ],
    explanation:
      "I když je cesta po chodníku o kousek delší, bezpečnost je důležitější než ušetřený čas — proto zvolíme cestu s chodníkem.",
  },
  {
    question:
      "Jdeš po chodníku a kousek před tebou se staví, takže musíš na chvíli sejít na silnici. Co uděláš?",
    correctAnswer: "Než sejdu na silnici, rozhlédnu se, a co nejrychleji se vrátím zpátky na chodník",
    options: [
      "Než sejdu na silnici, rozhlédnu se, a co nejrychleji se vrátím zpátky na chodník",
      "Projdu po silnici, aniž bych se rozhlédl, protože je to jen kousek",
      "Počkám na chodníku, dokud stavba nezmizí",
      "Přejdu na druhou stranu ulice bez rozhlédnutí",
    ],
    emoji: "🚧",
    hints: [
      "Kombinuj pravidlo pro vstup na silnici s pravidlem, jak dlouho na ní zůstat.",
      "Přemýšlej, co musíš udělat, než na silnici vstoupíš, a co hned potom, jakmile na ni musíš dočasně vejít.",
    ],
    explanation:
      "Když musíme na chvíli sejít na silnici, platí stejné pravidlo jako při přecházení — nejdřív se rozhlédnout — a co nejrychleji se vrátit zpátky na chodník.",
  },
  {
    question:
      "Na plánu obce vidíš dvě stejně dlouhé cesty do školy: jedna vede kolem parkoviště s auty, druhá kolem parku se stromy. Která je bezpečnější?",
    correctAnswer: "Cesta kolem parku",
    options: ["Cesta kolem parkoviště, protože auta tam stojí a nikam nejedou", "Cesta kolem parku", "Obě jsou stejně bezpečné, záleží jen na délce", "Cesta kolem parkoviště, protože je tam víc lidí"],
    emoji: "🗺️",
    hints: [
      "Vzpomeň si, jaké nebezpečí hrozí na parkovišti, a porovnej ho s tím, co hrozí v parku.",
      "Auta na parkovišti nejsou vždy v klidu — mohou se dát do pohybu.",
    ],
    explanation:
      "Cesta kolem parku je bezpečnější, protože se tam nepohybují auta, zatímco na parkovišti hrozí couvající nebo vyjíždějící vozidla.",
  },
  {
    question:
      "Jdeš se skupinou kamarádů k přechodu, kde právě svítí zelená pro auta (červená pro chodce). Kamarád navrhuje přeběhnout, že prý auto stihne zastavit. Co je správně?",
    correctAnswer: "Počkat na zelenou pro chodce",
    options: ["Poslechnout kamaráda a přeběhnout, protože je jich víc", "Přeběhnout, protože přechod chodce vždy ochrání", "Počkat na zelenou pro chodce", "Počkat jen já a nechat kamarády jít"],
    emoji: "🚦",
    hints: [
      "Pravidlo o červené platí bez ohledu na to, co navrhují kamarádi.",
      "Rozhoduješ se sám za sebe — spoj pravidlo semaforu s tím, že názor kamaráda ho nemění.",
    ],
    explanation:
      "I když kamarád navrhne přeběhnout na červenou, správné je počkat na zelenou — pravidla bezpečnosti platí vždy, bez ohledu na to, co říkají ostatní.",
  },
  {
    question:
      "Ráno je hustá mlha a je špatně vidět do dálky. Jdeš do školy stejnou cestou jako obvykle. Co uděláš jinak než za jasného počasí?",
    correctAnswer: "Budu se rozhlížet déle a pečlivěji",
    options: ["Nebudu se rozhlížet vůbec, protože mlha auta stejně schová", "Půjdu rychleji, abych byl v mlze co nejkratší dobu na silnici", "Nebudu nic měnit, mlha na chůzi nemá vliv", "Budu se rozhlížet déle a pečlivěji"],
    emoji: "🌫️",
    hints: [
      "Spoj dva fakty: za mlhy je vidět na kratší vzdálenost a auta se objeví později, než čekáš.",
      "Co z toho plyne pro to, jak dlouho se máš před přecházením dívat?",
    ],
    explanation:
      "Za mlhy je vidět na kratší vzdálenost, proto se musíme rozhlížet déle a pečlivěji, abychom si byli jistí, že žádné auto nepřijíždí.",
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
      "I na přechodu je nejdřív potřeba mít volný výhled na silnici.",
    ],
    explanation:
      "I na přechodu je třeba počkat, až autobus odjede a výhled na silnici bude volný — teprve pak bezpečně přejít.",
  },
  {
    question:
      "Kamarád tvrdí, že dopravní značka s obrázkem znamená úplně totéž co semafor. Má pravdu?",
    correctAnswer: "Ne, značka stále ukazuje stejný pokyn, ale nesvítí střídavě jako semafor",
    options: ["Ano, obě věci dávají chodcům úplně stejný pokyn", "Ne, značka stále ukazuje stejný pokyn, ale nesvítí střídavě jako semafor", "Ano, protože obě jsou u silnice", "Ne, protože značka je jen na plánu, ne ve skutečnosti"],
    emoji: "🪧",
    hints: [
      "Porovnej, jak se chová značka a jak se chová semafor.",
      "Jedna z těchto věcí se v čase mění, druhá zůstává stále stejná.",
    ],
    explanation:
      "Dopravní značka a semafor nejsou totéž — značka stále ukazuje stejný pokyn nebo informaci, zatímco semafor mění barvy a říká, kdy jít a kdy stát.",
  },
  {
    question:
      "Cesta do školy vede kolem řeky s mostem a kolem hřiště. Na co si dáš pozor na obou těchto místech zároveň?",
    correctAnswer: "U mostu na okraj a hloubku vody, na hřišti na to, aby mě hraní nerozptýlilo od cesty",
    options: ["Na obou místech se můžu zastavit a hrát si, škola počká", "Řeka i hřiště jsou bezpečná místa, není třeba na nic dávat pozor", "U mostu na okraj a hloubku vody, na hřišti na to, aby mě hraní nerozptýlilo od cesty", "Stačí dávat pozor jen na hřišti, řeka žádné nebezpečí nemá"],
    emoji: "🌉",
    hints: [
      "Spoj dvě různá nebezpečí — jedno u vody, druhé na hřišti — a mysli na obě zároveň.",
      "Přemýšlej, co by tě mohlo na každém z těchto míst rozptýlit nebo ohrozit.",
    ],
    explanation:
      "U řeky a mostu je třeba dávat pozor na okraj a hloubku vody, na hřišti zase na to, aby nás hraní nerozptýlilo od bezpečné cesty do školy.",
  },
  {
    question:
      "Na plánu vidíš, že škola leží hned vedle rušné křižovatky bez přechodu, ale o kousek dál je přechod se semaforem. Kudy raději půjdeš?",
    correctAnswer: "O kousek dál k přechodu se semaforem",
    options: ["Rovnou přes křižovatku, protože je to nejblíž ke škole", "Rovnou přes křižovatku, protože tam bývá málo aut", "Je jedno kudy, hlavně přijít do školy včas", "O kousek dál k přechodu se semaforem"],
    emoji: "🚧",
    hints: [
      "Porovnej, co je důležitější — pár kroků navíc, nebo bezpečnější přecházení.",
      "Vzpomeň si, čím se liší přecházení na křižovatce bez přechodu od přecházení na přechodu se semaforem.",
    ],
    explanation:
      "I když je to o kousek dál, přechod se semaforem je mnohem bezpečnější než přecházení rušné křižovatky bez přechodu.",
  },
  {
    question:
      "Kamarádka jde ráno do školy bez reflexních prvků, protože prý svítí slunce. Cesta domů ale vede pozdě odpoledne v zimě, kdy se brzy stmívá. Máš jí poradit, ať si je vezme i na cestu domů?",
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
      "Ráno a odpoledne se mohou v zimě podobat víc, než si kamarádka myslí.",
    ],
    explanation:
      "V zimě se brzy stmívá, takže i cesta domů odpoledne může být za snížené viditelnosti — reflexní prvky se proto hodí nejen ráno, ale i tehdy.",
  },
  {
    question:
      "Na chodníku před tebou jde dospělý s kočárkem, který zabírá skoro celou šířku chodníku, a vedle chodníku jede po silnici auto. Co uděláš?",
    correctAnswer: "Počkám za kočárkem na volnější místo chodníku",
    options: ["Seběhnu na silnici, abych kočárek objel co nejrychleji", "Počkám za kočárkem na volnější místo chodníku", "Protlačím se kolem kočárku těsně u okraje silnice", "Zůstanu stát a nepůjdu dál, dokud kočárek nezmizí"],
    emoji: "🚶",
    hints: [
      "Přemýšlej, co ti hrozí, pokud kvůli objetí překážky vstoupíš na silnici, i jen na chvíli.",
      "Spoj pravidlo o chodníku a silnici s tím, že kočárek ti jen dočasně brání v cestě.",
    ],
    explanation:
      "I když nás něco zpomalí, nikdy kvůli tomu nevstupujeme na silnici s projíždějícími auty — počkáme na chodníku na vhodnější místo k obejití.",
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
