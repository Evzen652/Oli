import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív 6 textů, jedna sdílená malá
// nápověda u všech 36 úloh a chybné možnosti bez zpětné vazby. Teď 12 textů
// (4 na úroveň) a každá otázka má vlastní dvojici nápověd, vlastní vysvětlení
// a zpětnou vazbu ke každé chybné možnosti.
//
// Klíč je vždy PŘEFORMULOVANÝ — nikdy to není doslovný výsek z textu. Dítě tak
// musí obsahu rozumět, ne jen hledat shodu slov (a klíč se zároveň neobjeví ve
// znění úlohy).
//
//   L1 rozpoznání — jeden údaj z jedné věty (kdo, co, kam, kdy).
//   L2 aplikace   — spojení dvou vět: příčina a důsledek, pořadí dějů,
//                   kdo z dvojice dělá co.
//   L3 transfer   — hlavní myšlenka, ponaučení, závěr o postavě a odhad toho,
//                   co by se stalo jinak. V textu to doslova napsané není.

interface Otazka {
  q: string;
  a: string;
  /** Tři chybné možnosti: [text, proč je právě tahle špatně]. */
  d: [[string, string], [string, string], [string, string]];
  /** Malá nápověda — kam se v textu podívat. */
  h0: string;
  /** Velká nápověda — postup pro tuhle konkrétní otázku. */
  h1: string;
  e: string;
}

interface Ctení {
  text: string;
  otazky: Otazka[];
}

// ─── L1: jeden údaj z textu ─────────────────────────────────────────────────

const L1: Ctení[] = [
  {
    text:
      "Máša má doma psa. Jmenuje se Bobík a je to velký hnědý ovčák. Každý den ho Máša venčí v parku u řeky. Nejradši honí míč a plave. Večer usíná na koberci vedle Mášiny postele.",
    otazky: [
      {
        q: "Jakou barvu má Bobík?",
        a: "Hnědou",
        d: [
          ["Černou", "O černé barvě text nikde nemluví. Barva psa je ve druhé větě, hned vedle slova „velký“."],
          ["Bílou", "Bílá se v textu neobjevuje. Popis Bobíka najdeš ve větě, která říká, jaký je to pes."],
          ["Šedou", "Šedá barva v textu není. Druhá věta popisuje Bobíka třemi slovy a jedno z nich je barva."],
        ],
        h0: "Druhá věta textu popisuje, jaký Bobík je. Přečti si ji ještě jednou.",
        h1: "Ve větě „Jmenuje se Bobík a je to velký hnědý ovčák.“ jsou o psovi tři údaje: jak se jmenuje, jak je velký a jaký má kožich. Otázka se ptá jen na ten poslední z nich, ostatní dva můžeš pustit z hlavy.",
        e: "Text říká, že Bobík je „velký hnědý ovčák“. Slovo „hnědý“ popisuje barvu jeho srsti, a na barvu se otázka ptá.",
      },
      {
        q: "Kam chodí Máša s Bobíkem na procházku?",
        a: "Do parku",
        d: [
          ["Do lesa", "Les text vůbec nezmiňuje. Místo procházky je ve větě, která začíná slovy „Každý den“."],
          ["Na hřiště", "O hřišti v textu nic není. Bobík sice honí míč, ale text neříká, že by to bylo na hřišti."],
          ["Na louku", "Louka se v textu neobjevuje. Podívej se, kam Máša Bobíka vodí každý den."],
        ],
        h0: "Hledej větu, která začíná slovy „Každý den“ — říká, co Máša s Bobíkem dělá pravidelně.",
        h1: "Věta „Každý den ho Máša venčí v parku u řeky.“ obsahuje dva údaje o místě. Řeka je jen upřesnění, kde to místo leží, takže tou hlavní odpovědí je to druhé, větší místo, které je v té větě jmenované.",
        e: "Text říká, že Máša Bobíka venčí „v parku u řeky“. Park je to místo, kam spolu chodí; řeka jen upřesňuje, kde park leží.",
      },
      {
        q: "Co Bobík dělá nejraději?",
        a: "Běhá za míčem a plave",
        d: [
          ["Hlídá dům a štěká", "Hlídání ani štěkání text nezmiňuje. Věta o oblíbených činnostech začíná slovem „Nejradši“."],
          ["Spí a jí", "Spaní text sice zmiňuje, ale až večer — a o jídle neříká nic. Otázka se ptá na to, co má Bobík nejradši."],
          ["Hraje si s kočkou", "Žádná kočka se v textu neobjevuje. Obě oblíbené činnosti jsou v jedné krátké větě."],
        ],
        h0: "Jedna věta textu začíná slovem „Nejradši“ — právě ta odpovídá na otázku.",
        h1: "Ve větě „Nejradši honí míč a plave.“ jsou spojkou „a“ spojené dvě činnosti. Správná možnost musí obsahovat obě dvě, ne jen jednu z nich — proto si u každé možnosti ověř, jestli sedí celá.",
        e: "Text říká, že Bobík „nejradši honí míč a plave“. Obě činnosti jsou spojené spojkou „a“, takže patří k odpovědi dohromady.",
      },
      {
        q: "Kde Bobík přespává?",
        a: "V Mášině pokoji",
        d: [
          ["V boudě na zahradě", "Text říká, že Bobík je pes domácí — usíná uvnitř, vedle postele, ne venku."],
          ["V kuchyni pod stolem", "Kuchyň se v textu neobjevuje. Poslední věta prozrazuje, u čeho Bobík večer usíná."],
          ["V obýváku na gauči", "O gauči ani obýváku text nic neříká. Podle poslední věty spí Bobík na zemi, ne na nábytku."],
        ],
        h0: "Poslední věta textu říká, u čeho Bobík večer usíná. Podle toho poznáš, ve které místnosti je.",
        h1: "Text píše, že Bobík usíná na koberci vedle Mášiny postele. Rozmysli si, v jaké místnosti bývá postel a komu ta postel patří — z toho vyjde, kde pes v noci leží.",
        e: "Bobík usíná na koberci hned vedle Mášiny postele. Postel stojí v ložnici svého majitele, takže pes spí tam, kde spí i Máša.",
      },
    ],
  },
  {
    text:
      "Jednoho mrazivého rána přišla do zahrady liška. Měla rezavou srst a bílou špičku ocasu. Sháněla něco k jídlu, protože byla vyhladovělá. Uviděl ji muž, který se v zahradě staral o stromy, a hodil jí kůrku chleba. Liška ji popadla a zmizela mezi stromy v lese.",
    otazky: [
      {
        q: "V jakém ročním období se příběh odehrává?",
        a: "V zimě",
        d: [
          ["V létě", "V létě rána mrazivá nebývají. První věta textu popisuje počasí — a to k létu nesedí."],
          ["Na jaře", "Jaro už bývá teplé. Rozhodující je slovo, kterým text popisuje ráno hned v první větě."],
          ["Na podzim", "Podzimní rána bývají chladná, ale mráz patří k jinému, ještě studenějšímu období."],
        ],
        h0: "První věta popisuje, jaké bylo ráno. To slovo o počasí je celá odpověď.",
        h1: "Text neříká roční období přímo, ale popisuje ráno jako mrazivé. Projdi si v duchu roční období a rozmysli, ve kterém z nich mrzne pravidelně — právě to je hledaná odpověď.",
        e: "Text mluví o mrazivém ránu. Mráz patří k nejchladnějšímu ročnímu období, takže příběh se odehrává tehdy, kdy mrzne.",
      },
      {
        q: "Co liška v zahradě hledala?",
        a: "Něco k snědku",
        d: [
          ["Místo na spaní", "O spaní text nemluví. Třetí věta říká přímo, co liška sháněla a proč."],
          ["Kamaráda na hraní", "Liška si v textu s nikým nehraje. Důvod její návštěvy je ve větě se spojkou „protože“."],
          ["Vodu k napití", "Pití se v textu neobjevuje. Věta se spojkou „protože“ vysvětluje, co lišce chybělo."],
        ],
        h0: "Hledej větu se spojkou „protože“ — ta říká, co lišce chybělo.",
        h1: "Ve větě „Sháněla něco k jídlu, protože byla vyhladovělá.“ jsou dva údaje: co liška hledala a proč. Slovo „vyhladovělá“ ti potvrdí, že hledala právě to, co potřebuje hladový tvor.",
        e: "Liška byla vyhladovělá, a proto sháněla něco k jídlu. Hlad se zažene jedině jídlem, a to liška v zahradě hledala.",
      },
      {
        q: "Kdo lišce pomohl?",
        a: "Zahradník",
        d: [
          ["Sousedka", "Žádná žena se v textu neobjevuje. Pomohl lišce muž, a text říká, čím se v zahradě zabýval."],
          ["Myslivec", "Myslivec se stará o les a zvěř, ale text popisuje člověka, který pečoval o stromy na zahradě."],
          ["Školník", "Školník pracuje ve škole. Příběh se ale celý odehrává na zahradě u stromů."],
        ],
        h0: "Text neříká povolání přímo — popisuje, co ten muž v zahradě dělal.",
        h1: "Ve větě „Uviděl ji muž, který se v zahradě staral o stromy…“ je popis práce místo názvu povolání. Rozmysli si, jak se říká člověku, který se stará o zahradu a o stromy v ní.",
        e: "Text popisuje muže, který se v zahradě staral o stromy, a ten lišce hodil kůrku chleba. Člověku, jehož prací je péče o zahradu, se říká právě takhle.",
      },
      {
        q: "Kam liška s kůrkou zmizela?",
        a: "Do lesa",
        d: [
          ["Na pole", "Pole text nezmiňuje. Poslední věta říká, kam liška po získání kůrky odešla."],
          ["K rybníku", "Žádná voda se v textu neobjevuje. Odpověď najdeš v úplně poslední větě."],
          ["Do nory pod plotem", "O noře ani plotu text nic neříká. Liška odběhla někam, kde je hodně stromů."],
        ],
        h0: "Úplně poslední věta textu říká, kam liška s kůrkou odběhla.",
        h1: "Věta „Liška ji popadla a zmizela mezi stromy v lese.“ obsahuje dva údaje o místě: mezi čím liška běžela a kde to bylo. Otázka se ptá na to větší místo, kam liška zmizela celá.",
        e: "Text říká, že liška zmizela mezi stromy v lese. Stromy jsou jen upřesnění, hledaným místem je celý les.",
      },
    ],
  },
  {
    text:
      "Petr a Jana jsou sousedé. Škola je od jejich domu daleko, a tak pro ně každé ráno zastavuje autobus. Petr si v autobuse opakuje slovíčka a Jana si čte knihu. Na zastávce u školy vystoupí a spolu dojdou až ke dveřím třídy.",
    otazky: [
      {
        q: "Čím Petr a Jana jezdí do školy?",
        a: "Autobusem",
        d: [
          ["Autem", "O autě text nemluví. Druhá věta říká, co pro ně každé ráno zastavuje."],
          ["Na kole", "Kolo se v textu neobjevuje. Dopravní prostředek je jmenovaný na konci druhé věty."],
          ["Pěšky", "Pěšky jdou jen krátký kousek od zastávky ke třídě, ale celou cestu do školy ne — škola je daleko."],
        ],
        h0: "Druhá věta říká, proč nechodí pěšky, a hned jmenuje, co pro ně ráno zastavuje.",
        h1: "Věta „Škola je od jejich domu daleko, a tak pro ně každé ráno zastavuje autobus.“ má dvě části: první říká důvod, druhá řešení. Otázka míří na to řešení — na dopravní prostředek na konci věty.",
        e: "Škola je daleko, a tak pro Petra s Janou každé ráno zastavuje autobus. Právě jím se do školy dopravují.",
      },
      {
        q: "Co dělá Petr cestou do školy?",
        a: "Opakuje si slovíčka",
        d: [
          ["Čte si knihu", "Knihu si čte Jana, ne Petr. Věta o cestě jmenuje obě děti a každé přiřazuje jinou činnost."],
          ["Spí", "O spaní v autobuse text nic neříká. Petrova činnost je ve větě jmenovaná úplně jasně."],
          ["Poslouchá hudbu", "Hudba se v textu neobjevuje. Dej pozor, aby sis nespletl činnost Petra a Jany."],
        ],
        h0: "Třetí věta jmenuje obě děti. Najdi v ní tu část, která patří Petrovi.",
        h1: "Věta „Petr si v autobuse opakuje slovíčka a Jana si čte knihu.“ je souvětí ze dvou vět: každá mluví o někom jiném. Přikryj si prstem tu část za spojkou „a“ a zůstane ti jen to, co dělá Petr.",
        e: "Text říká, že si Petr v autobuse opakuje slovíčka. Druhá část věty patří Janě, proto se musí číst odděleně.",
      },
      {
        q: "Co dělá Jana cestou do školy?",
        a: "Čte si knihu",
        d: [
          ["Opakuje si slovíčka", "Slovíčka si opakuje Petr. Janina činnost stojí ve druhé části téže věty."],
          ["Dívá se z okna", "O koukání z okna text nic neříká. Janina činnost je ve větě jmenovaná přesně."],
          ["Píše úkoly", "Psaní úkolů se v textu neobjevuje. Otázka míří na to, co Jana v autobuse drží v ruce."],
        ],
        h0: "Ve třetí větě hledej tu část, která začíná jménem Jana.",
        h1: "Věta „Petr si v autobuse opakuje slovíčka a Jana si čte knihu.“ mluví o dvou dětech. Rozděl si ji u spojky „a“ na dvě půlky a všímej si jen té půlky, ve které je jméno té dívky.",
        e: "Podle textu si Jana v autobuse čte knihu. První část věty patří Petrovi, proto se odpovědi nesmí míchat dohromady.",
      },
      {
        q: "Co Petr a Jana udělají, když z autobusu vystoupí?",
        a: "Dojdou spolu ke třídě",
        d: [
          ["Rozejdou se každý jinam", "Text říká pravý opak — poslední věta obsahuje slovo, které mluví o společné cestě."],
          ["Počkají na rodiče", "O rodičích se v textu nic nepíše. Poslední věta popisuje, co obě děti udělají hned po vystoupení."],
          ["Koupí si svačinu", "Svačina se v textu neobjevuje. Podívej se, kam děti od zastávky zamíří."],
        ],
        h0: "Úplně poslední věta popisuje, co se stane po vystoupení z autobusu.",
        h1: "Ve větě „Na zastávce u školy vystoupí a spolu dojdou až ke dveřím třídy.“ je klíčové slovo „spolu“. Podle něj poznáš, jestli se děti u zastávky rozdělí, nebo pokračují společně — a kam až.",
        e: "Text říká, že Petr s Janou po vystoupení „spolu dojdou až ke dveřím třídy“. Slovo „spolu“ ukazuje, že cestu dokončí společně.",
      },
    ],
  },
  {
    text:
      "Kuba chodí každý čtvrtek na plavání. V bazénu ho učí Eva, která trénuje i starší děti. Nejdřív se všichni rozcvičí na kraji bazénu a potom skáčou do vody. Kuba už uplave dvacet metrů bez zastavení. Po tréninku má vždycky velký hlad.",
    otazky: [
      {
        q: "Ve který den chodí Kuba plavat?",
        a: "Ve čtvrtek",
        d: [
          ["V pondělí", "Pondělí text nezmiňuje. Den je jmenovaný hned v první větě."],
          ["V sobotu", "O sobotě se v textu nepíše. Plavání má Kuba ve všední den, který je v první větě."],
          ["Ve středu", "Středa se v textu neobjevuje. Pozorně si přečti první větu, den je v ní napsaný."],
        ],
        h0: "První věta textu jmenuje den v týdnu. Tam je celá odpověď.",
        h1: "Ve větě „Kuba chodí každý čtvrtek na plavání.“ je slovo „každý“ jen upozornění, že se to opakuje týden co týden. Hledaný údaj je to slovo hned za ním — název dne.",
        e: "Text říká, že Kuba chodí na plavání každý čtvrtek. Slovo „každý“ jen zdůrazňuje, že se trénink opakuje pravidelně.",
      },
      {
        q: "Kdo Kubu v bazénu učí?",
        a: "Trenérka Eva",
        d: [
          ["Jeho maminka", "O mamince text nic neříká. Ve druhé větě je jméno té, která Kubu učí, a také její práce."],
          ["Pan učitel", "V textu je jmenovaná žena, ne muž. Druhá věta prozrazuje i to, co dělá s dalšími dětmi."],
          ["Starší bratr", "Starší děti text sice zmiňuje, ale jako další svěřence — ne jako Kubova bratra."],
        ],
        h0: "Ve druhé větě je jméno i popis práce toho, kdo Kubu v bazénu vede.",
        h1: "Text píše, že Kubu učí Eva a že trénuje i starší děti. Z toho, koho a v čem trénuje, odvodíš její povolání — a k tomu povolání pak přidej její jméno.",
        e: "Kubu v bazénu učí Eva, která trénuje i starší děti. Kdo děti trénuje, je trenér nebo trenérka, a tady jde o ženu.",
      },
      {
        q: "Co děti udělají dřív, než skočí do vody?",
        a: "Rozcvičí se",
        d: [
          ["Osprchují se", "O sprchování text nemluví. Věta se slovem „Nejdřív“ říká, co je opravdu první."],
          ["Zaplavou si", "Plavat se dá až ve vodě, ale otázka míří na to, co je ještě před skokem."],
          ["Poslechnou si pravidla", "O pravidlech text nic neříká. Pořadí činností najdeš ve třetí větě."],
        ],
        h0: "Třetí věta říká pořadí — začíná slovem „Nejdřív“ a pokračuje slovem „potom“.",
        h1: "Věta „Nejdřív se všichni rozcvičí na kraji bazénu a potom skáčou do vody.“ popisuje dvě činnosti za sebou. Otázka se ptá na tu první, tedy na to, co stojí hned za slovem „Nejdřív“.",
        e: "Text říká, že se děti nejdřív rozcvičí na kraji bazénu a teprve potom skáčou do vody. Pořadí prozrazují slova „nejdřív“ a „potom“.",
      },
      {
        q: "Jakou vzdálenost Kuba uplave bez zastavení?",
        a: "20 metrů",
        d: [
          ["10 metrů", "Tolik je méně, než text uvádí. Údaj je ve větě napsaný slovem, ne číslicí."],
          ["50 metrů", "Tolik je víc, než text uvádí. Přečti si větu o Kubovi znovu a číslo si přelož do číslic."],
          ["100 metrů", "Takovou vzdálenost text nezmiňuje. Hledané číslo je v textu napsané slovy."],
        ],
        h0: "Věta o Kubově výkonu má číslo napsané slovem. Přelož si ho do číslic.",
        h1: "Text uvádí vzdálenost slovem, kdežto možnosti jsou napsané číslicemi. Přečti si větu „Kuba už uplave … metrů bez zastavení.“ a napiš si to číslo číslicemi — pak už jen najdeš stejnou možnost.",
        e: "Text uvádí, že Kuba uplave dvacet metrů bez zastavení. Slovo „dvacet“ zapsané číslicemi je stejná hodnota, jen v jiném zápisu.",
      },
    ],
  },
];

// ─── L2: spojení dvou informací ─────────────────────────────────────────────

const L2: Ctení[] = [
  {
    text:
      "Tomáš si o víkendu vyrobil s tátou papírového draka. V sobotu ráno vyšli na louku, jenže vzduch se ani nepohnul, a tak drak zůstal ležet v trávě. Odpoledne se zvedl vítr a drak vylétl vysoko nad stromy. Tomáš běhal po louce a smál se radostí.",
    otazky: [
      {
        q: "Proč drak ráno nelétal?",
        a: "Nefoukal vítr",
        d: [
          ["Byl moc těžký", "Drak je z papíru a odpoledne vylétl vysoko. Kdyby byl těžký, nevzlétl by ani potom."],
          ["Pršelo", "O dešti text nic neříká. Ranní překážka je popsaná slovy o vzduchu, ne o počasí shora."],
          ["Přetrhla se nit", "Žádná přetržená nit se v textu neobjevuje — drak zůstal celý a odpoledne létal."],
        ],
        h0: "Druhá věta popisuje ráno na louce. Co se v ní říká o vzduchu?",
        h1: "V textu stojí, že se vzduch ani nepohnul, a hned za tím následuje důsledek. Porovnej to s odpolednem: tam se něco změnilo a drak vylétl — právě ta změna ukazuje, co ráno chybělo.",
        e: "Ráno se vzduch ani nepohnul, a proto drak zůstal v trávě. Odpoledne se to změnilo a drak vylétl, takže chybějící proudění vzduchu bylo tou příčinou.",
      },
      {
        q: "Kdy se drak konečně dostal do vzduchu?",
        a: "Odpoledne, když se zvedl vítr",
        d: [
          ["Hned ráno na louce", "Ráno drak ležel v trávě. První pokus se nepovedl, což text říká hned ve druhé větě."],
          ["Až druhý den", "Celý příběh se odehraje během jediného dne — v sobotu ráno a odpoledne."],
          ["Večer po setmění", "O večeru text nic nepíše. Poslední popisovaná část dne je odpoledne."],
        ],
        h0: "Text popisuje dvě části jednoho dne. Ve které z nich se něco změnilo?",
        h1: "Porovnej ranní a odpolední pokus: ráno drak ležel v trávě, odpoledne vylétl nad stromy. Odpověď musí obsahovat obojí — správnou část dne i to, co se v ní změnilo.",
        e: "Odpoledne se zvedl vítr a drak vylétl vysoko nad stromy. Úspěch tedy nastal až v druhé části dne, a to díky změně počasí.",
      },
      {
        q: "Kdo Tomášovi s drakem pomáhal?",
        a: "Jeho tatínek",
        d: [
          ["Jeho sestra", "Žádná sestra se v textu neobjevuje. Pomocníka jmenuje hned první věta."],
          ["Soused", "O sousedovi text nic neříká. Draka vyráběl Tomáš s někým z rodiny."],
          ["Nikdo, dělal ho sám", "První věta výslovně říká, že Tomáš draka vyráběl ve dvou."],
        ],
        h0: "První věta říká, s kým Tomáš draka o víkendu vyráběl.",
        h1: "Ve větě „Tomáš si o víkendu vyrobil s tátou papírového draka.“ je slůvko „s“, za kterým stojí ten druhý. Text používá domácké oslovení, možnosti spisovnější — jde ale o stejného člověka.",
        e: "Podle první věty vyrobil Tomáš draka „s tátou“. Táta je domácké pojmenování otce, takže mu s drakem pomáhal on.",
      },
      {
        q: "Jak se Tomáš cítil, když drak vzlétl?",
        a: "Měl velkou radost",
        d: [
          ["Byl zklamaný", "Zklamání by patřilo k ránu, kdy drak nelétal. Po vzlétnutí text popisuje pravý opak."],
          ["Byl unavený", "O únavě text nic neříká. Poslední věta popisuje, co Tomáš na louce dělal a jak se u toho tvářil."],
          ["Dostal strach", "Strach se v textu neobjevuje. Poslední věta mluví o smíchu, ne o obavách."],
        ],
        h0: "Poslední věta popisuje, co Tomáš dělal na louce, když drak letěl.",
        h1: "Text neříká pocit přímo, ale popisuje chování: Tomáš běhal po louce a smál se. Rozmysli si, jaký pocit vede člověka k tomu, aby se smál a pobíhal kolem.",
        e: "Text píše, že Tomáš běhal po louce a smál se. Smích a poskakování jsou projevy radosti, takže se cítil velmi dobře.",
      },
    ],
  },
  {
    text:
      "Babička má na zahradě záhon jahod a hned vedle pěstuje rajčata. Na jaře záhony okope a zasadí nové sazenice. V létě bývá velké horko, a tak musí zahradu každý den zalévat. Na podzim otrhá poslední plody a záhony přikryje chvojím.",
    otazky: [
      {
        q: "Proč musí babička v létě zahradu zalévat každý den?",
        a: "Je velké horko",
        d: [
          ["Rostliny jsou nemocné", "O nemocech text nic nepíše. Důvod zalévání je v téže větě jako slovo „léto“."],
          ["Sousedka jí to poradila", "Žádná sousedka se v textu neobjevuje. Důvod je v počasí, ne v radě od někoho."],
          ["Na zahradě je málo místa", "Velikost zahrady s zaléváním nesouvisí. Rozhoduje to, jak je v létě teplo."],
        ],
        h0: "Ve větě o létě jsou dvě části spojené slovy „a tak“. Ta první říká důvod.",
        h1: "Věta „V létě bývá velké horko, a tak musí zahradu každý den zalévat.“ má příčinu na začátku a důsledek na konci. Otázka se ptá na příčinu, tedy na část před slovy „a tak“.",
        e: "Text říká, že v létě bývá velké horko, a proto se musí zalévat denně. Za horka se voda ze země rychle vypaří, a rostliny ji tak potřebují častěji.",
      },
      {
        q: "Co babička dělá na zahradě na jaře?",
        a: "Kypří půdu a sází rostliny",
        d: [
          ["Sklízí poslední plody", "Trhání plodů patří k podzimu. Jarní práce popisuje druhá věta textu."],
          ["Zalévá kvůli horku", "Zalévání kvůli horku patří k létu. Otázka se ptá na období, kdy se zakládají nové rostliny."],
          ["Přikrývá záhony chvojím", "Přikrývání chvojím je poslední prací roku, ne první. Text ho řadí k podzimu."],
        ],
        h0: "Najdi větu, která začíná slovy „Na jaře“ — popisuje dvě jarní práce.",
        h1: "Text prochází celý rok po obdobích: jaro, léto, podzim. Podívej se jen do té části, která patří jaru, a spočítej, kolik prací se v ní jmenuje — správná možnost musí obsahovat obě.",
        e: "Na jaře babička záhony okope a zasadí nové sazenice. Okopávání provzdušní zem a sazenice jsou budoucí rostliny, takže jde přesně o tyhle dvě práce.",
      },
      {
        q: "V jakém pořadí jdou babiččiny práce za sebou?",
        a: "Nejdřív sází, pak zalévá, nakonec sklízí",
        d: [
          ["Nejdřív zalévá, pak sází, nakonec sklízí", "Zalévat se dá až to, co je zasazené. Podle textu se sazenice dávají do země dřív."],
          ["Nejdřív sklízí, pak sází, nakonec zalévá", "Sklizeň nemůže být první — nejdřív musí být co sklízet. Text začíná jarem."],
          ["Nejdřív zalévá, pak sklízí, nakonec sází", "Sázení je v textu první prací roku, ne poslední. Zkontroluj, čím věta o jaře začíná."],
        ],
        h0: "Text jmenuje tři roční období za sebou. Přiřaď ke každému jeho práci.",
        h1: "Projdi text po větách a u každé si poznač období: jaro, léto, podzim. Pak jen k jednotlivým obdobím dopiš práci, kterou v nich babička dělá — a seřaď je tak, jak jdou v roce po sobě.",
        e: "Na jaře se zakládají nové rostliny, v létě se kvůli horku zalévá a na podzim se trhají plody. Práce tedy jdou přesně v tomhle pořadí roku.",
      },
      {
        q: "Které dvě plodiny babička pěstuje?",
        a: "Jahody a rajčata",
        d: [
          ["Brambory a mrkev", "Brambory ani mrkev text nezmiňuje. Obě plodiny jsou jmenované hned v první větě."],
          ["Jablka a hrušky", "Jablka a hrušky rostou na stromech, text ale mluví o záhonech."],
          ["Okurky a papriky", "Okurky ani papriky se v textu neobjevují. Přečti si znovu úvodní větu."],
        ],
        h0: "První věta jmenuje dva záhony vedle sebe. Každý patří jiné plodině.",
        h1: "Ve větě „Babička má na zahradě záhon jahod a hned vedle pěstuje rajčata.“ jsou dvě části spojené spojkou „a“. V každé části je jedna plodina, takže správná možnost musí jmenovat obě.",
        e: "Text říká, že babička má záhon jahod a hned vedle pěstuje rajčata. Jsou to tedy právě tyhle dvě plodiny, každá na svém záhonu.",
      },
    ],
  },
  {
    text:
      "Kryštof si chtěl přečíst něco o pravěkých ještěrech. Vypravil se proto do městské knihovny. Nejdřív prohledával regály sám, jenže mezi tisíci hřbety se ztrácel. Pak se obrátil na paní za pultem a ta mu správnou knihu podala během chvilky. Doma ji přečetl od soboty do neděle.",
    otazky: [
      {
        q: "Proč se Kryštof vydal do knihovny?",
        a: "Chtěl knihu o dinosaurech",
        d: [
          ["Chtěl vrátit vypůjčenou knihu", "O vracení text nic neříká — knihu si naopak teprve půjčoval."],
          ["Měl tam sraz s kamarádem", "Žádný kamarád se v textu neobjevuje. Důvod cesty je v první větě."],
          ["Chtěl si číst časopisy", "Časopisy text nezmiňuje. Kryštof hledal knihu o konkrétním tématu."],
        ],
        h0: "První dvě věty jsou spojené slovem „proto“. Ta první říká důvod cesty.",
        h1: "Text pojmenovává téma opisem „pravěcí ještěři“. Rozmysli si, jak se těmhle dávno vyhynulým zvířatům běžně říká — a pak hledej možnost, která to téma zmiňuje.",
        e: "Kryštof si chtěl přečíst o pravěkých ještěrech, a proto šel do knihovny. Pravěkým ještěrům se běžně říká jinak, ale jde o stejná zvířata.",
      },
      {
        q: "Kdo Kryštofovi knihu nakonec našel?",
        a: "Knihovnice",
        d: [
          ["Kamarád", "Žádný kamarád v příběhu není. Pomohla Kryštofovi paní, která v knihovně pracuje."],
          ["Tatínek", "O tatínkovi text nic nepíše. Kryštof byl v knihovně a požádal o pomoc tam."],
          ["Nikdo, našel ji sám", "Sám ji hledal marně — text výslovně říká, že se mezi regály ztrácel."],
        ],
        h0: "Čtvrtá věta říká, na koho se Kryštof obrátil, když sám neuspěl.",
        h1: "Text neuvádí povolání přímo, píše jen „paní za pultem“. Rozmysli si, jak se říká ženě, která pracuje v knihovně a půjčuje čtenářům knihy.",
        e: "Kryštof se obrátil na paní za pultem a ta mu knihu hned podala. Žena, která v knihovně pracuje a půjčuje knihy, má právě tohle povolání.",
      },
      {
        q: "Co Kryštof zkusil dřív, než požádal o pomoc?",
        a: "Hledal knihu sám v regálech",
        d: [
          ["Zeptal se hned paní za pultem", "Text říká opak — o pomoc požádal až jako druhou možnost, po neúspěchu."],
          ["Odešel domů s prázdnou", "Domů odešel až s knihou. Poslední věta říká, že si ji doma přečetl."],
          ["Zavolal kamarádovi", "Telefonování se v textu neobjevuje. Pořadí kroků prozrazují slova „Nejdřív“ a „Pak“."],
        ],
        h0: "V textu jsou slova „Nejdřív“ a „Pak“ — ukazují pořadí Kryštofových kroků.",
        h1: "Text popisuje dva pokusy za sebou: jeden neúspěšný a jeden úspěšný. Otázka míří na ten první, takže si přečti větu začínající slovem „Nejdřív“ a všímej si, co v ní Kryštof dělal.",
        e: "Nejdřív Kryštof prohledával regály sám, ale mezi tisíci hřbety se ztrácel. Teprve potom se obrátil na paní za pultem.",
      },
      {
        q: "Jak dlouho Kryštofovi čtení knihy trvalo?",
        a: "Jeden víkend",
        d: [
          ["Celý měsíc", "Tak dlouho to netrvalo. Poslední věta jmenuje dva konkrétní dny hned za sebou."],
          ["Jedno dopoledne ve škole", "Knihu četl doma, ne ve škole. A trvalo mu to víc než jedno dopoledne."],
          ["Knihu vůbec nedočetl", "Poslední věta výslovně říká, že knihu doma přečetl."],
        ],
        h0: "Poslední věta jmenuje dva dny. Jak se říká téhle dvojici dnů dohromady?",
        h1: "Text píše, že Kryštof četl od soboty do neděle. Vzpomeň si, jak se jedním slovem označují právě tyhle dva dny na konci týdne — a podle toho vyber možnost.",
        e: "Kryštof četl knihu od soboty do neděle. Sobota s nedělí tvoří dohromady konec týdne, kterému se říká právě takhle.",
      },
    ],
  },
  {
    text:
      "Eva se vracela z kroužku a u dveří zjistila, že nemá klíče. Vzpomněla si, že je nechala ležet na lavičce ve školní šatně. Zavolala proto mamince a ta pro ni přijela autem. Společně se vrátily do školy a klíče ležely přesně na tom místě.",
    otazky: [
      {
        q: "Proč se Eva nemohla dostat do bytu?",
        a: "Neměla u sebe klíče",
        d: [
          ["Zabouchla si dveře", "O zabouchnutí text nic neříká. Problém byl v tom, co Evě chybělo."],
          ["Nikdo nebyl doma", "Text neříká, kdo je nebo není doma. Překážka je jmenovaná hned v první větě."],
          ["Ztratila se cestou", "Eva cestu domů našla — stála přece u dveří. Problém nastal až tam."],
        ],
        h0: "První věta říká, co Eva zjistila, když došla ke dveřím.",
        h1: "Ve větě „Eva se vracela z kroužku a u dveří zjistila, že nemá klíče.“ jsou dva děje: návrat a zjištění. Otázka míří na to zjištění — na to, co Evě v tu chvíli scházelo.",
        e: "Eva u dveří zjistila, že nemá klíče. Bez klíčů se zamčené dveře otevřít nedají, a proto se domů nedostala.",
      },
      {
        q: "Kde Eva klíče našla?",
        a: "Na lavičce v šatně",
        d: [
          ["V batohu", "Batoh text nezmiňuje. Druhá věta říká, kam přesně si Eva klíče odložila."],
          ["V kapse bundy", "O kapse text nic nepíše. Klíče ležely na jednom konkrétním místě ve škole."],
          ["Na chodbě u třídy", "Chodba se v textu neobjevuje. Místo je popsané ve druhé větě."],
        ],
        h0: "Druhá věta říká, kam si Eva klíče odložila. Tam je taky našla.",
        h1: "Text spojuje dvě informace: kde si Eva myslela, že klíče nechala, a že „ležely přesně na tom místě“. Stačí tedy vzít místo z druhé věty a ověřit, že ho poslední věta potvrzuje.",
        e: "Eva si vzpomněla, že klíče nechala ležet na lavičce ve školní šatně, a poslední věta potvrzuje, že tam opravdu byly.",
      },
      {
        q: "Jak se Eva dostala zpátky ke škole?",
        a: "Autem s maminkou",
        d: [
          ["Pěšky sama", "Pro Evu někdo přijel. Text říká, že se do školy vrátily společně."],
          ["Autobusem", "Autobus se v textu neobjevuje. Třetí věta jmenuje dopravní prostředek přesně."],
          ["Na kole", "O kole text nic nepíše. Podívej se, čím pro Evu maminka přijela."],
        ],
        h0: "Třetí věta říká, kdo pro Evu přijel a čím.",
        h1: "Věta „Zavolala proto mamince a ta pro ni přijela autem.“ obsahuje dva údaje: kdo přijel a jakým dopravním prostředkem. Správná možnost musí sedět v obou, ne jen v jednom.",
        e: "Eva zavolala mamince a ta pro ni přijela autem. Do školy se pak podle textu vrátily společně, takže Eva jela autem s ní.",
      },
      {
        q: "Co Eva udělala hned potom, co u dveří klíče nenašla?",
        a: "Zatelefonovala mamince",
        d: [
          ["Rozbila okno", "Nic takového v textu není. Eva zvolila mnohem klidnější řešení."],
          ["Počkala na chodbě do večera", "O čekání text nic neříká. Třetí věta popisuje, co udělala vzápětí."],
          ["Šla ke kamarádce", "Žádná kamarádka se v textu neobjevuje. Eva se obrátila na někoho z rodiny."],
        ],
        h0: "Třetí věta začíná slovesem, které popisuje Evin první krok po zjištění.",
        h1: "Sleduj pořadí dějů: Eva zjistí, že nemá klíče, pak si vzpomene, kde jsou, a pak něco udělá. Otázka míří na ten třetí krok, tedy na začátek třetí věty.",
        e: "Text říká, že Eva „zavolala proto mamince“. Zavolat po telefonu a zatelefonovat znamená totéž, takže to byl její první krok.",
      },
    ],
  },
];

// ─── L3: hlavní myšlenka a odvozený závěr ───────────────────────────────────

const L3: Ctení[] = [
  {
    text:
      "Ondra se učí hrát na housle už půl roku. Ze začátku mu to vůbec nešlo a pouzdro s houslemi často zůstávalo celý týden zavřené. Paní učitelka mu jednou řekla, že i ona se jako malá dlouho trápila, než jí to začalo jít. Na ta slova si Ondra vzpomněl pokaždé, když ho cvičení přestalo bavit. Po několika měsících každodenního cvičení zahrál na školním koncertě celou skladbu bez jediné chyby.",
    otazky: [
      {
        q: "Které ponaučení z příběhu vyplývá?",
        a: "Kdo vytrvá, ten se to naučí",
        d: [
          ["Housle jsou pro děti nevhodné", "Ondra na housle nakonec zahrál celou skladbu, takže příběh říká pravý opak."],
          ["Talent je důležitější než cvičení", "O talentu text vůbec nemluví. Ondra uspěl díky tomu, co dělal každý den."],
          ["Kdo se trápí, měl by toho nechat", "Ondra se trápil, ale nepřestal — a právě proto to dopadlo dobře."],
        ],
        h0: "Ponaučení nehledej v jedné větě, ale v tom, jak celý Ondrův příběh dopadl.",
        h1: "Porovnej začátek a konec: nejdřív mu to vůbec nešlo, na konci zahrál skladbu bez chyby. Zeptej se, co se mezi tím stalo — a právě ta věc bude jádrem ponaučení.",
        e: "Ondrovi to zpočátku nešlo, ale cvičil dál a nakonec zahrál celou skladbu bez chyby. Příběh tak ukazuje, že vydržet u obtížné věci se vyplatí.",
      },
      {
        q: "Proč Ondra s cvičením nepřestal?",
        a: "Věděl, že potíže se dají překonat",
        d: [
          ["Rodiče mu za to platili", "O odměně ani penězích text nic neříká. Ondru povzbudilo něco, co slyšel."],
          ["Bál se paní učitelky", "Paní učitelka ho podpořila, nezastrašila. Text popisuje její slova jako povzbuzení."],
          ["Chtěl předběhnout spolužáky", "Žádné soupeření se v textu neobjevuje. Ondra srovnával jen sám se sebou."],
        ],
        h0: "Text říká, na co si Ondra vzpomněl pokaždé, když ho cvičení přestalo bavit.",
        h1: "Spoj dvě věty dohromady: co mu paní učitelka řekla o svém vlastním začátku a co si Ondra v těžkých chvílích připomínal. Z toho vyplyne, co mu dodávalo sílu pokračovat.",
        e: "Paní učitelka Ondrovi řekla, že se jako malá také dlouho trápila, než jí to začalo jít. Ondra si to připomínal, a proto věřil, že i jeho potíže jednou skončí.",
      },
      {
        q: "Co se o paní učitelce z jejích slov dozvíme?",
        a: "Také musela dlouho trénovat",
        d: [
          ["Hrát na housle nikdy neuměla", "Kdyby neuměla hrát, nemohla by Ondru učit. Text mluví o jejích vlastních začátcích."],
          ["Naučila se to hned napoprvé", "Text říká pravý opak — o svém začátku mluví jako o dlouhém trápení."],
          ["Ondrovi nevěřila", "Svými slovy ho naopak povzbudila, aby vydržel. Nedůvěru v textu nenajdeš."],
        ],
        h0: "Paní učitelka mluví o době, kdy byla malá. Co o té době říká?",
        h1: "Text její slova nepřevypráví celá, jen shrne, že se jako malá dlouho trápila, než jí to začalo jít. Přelož si tuhle informaci do věty o tom, co musela udělat, aby hrát uměla.",
        e: "Paní učitelka řekla, že se jako malá dlouho trápila, než jí hraní začalo jít. Znamená to, že cesta k jejímu umění byla také dlouhá a pracná.",
      },
      {
        q: "Jak dlouho se Ondra učil, než zahrál celou skladbu?",
        a: "Skoro rok",
        d: [
          ["Jeden týden", "Týden text zmiňuje jen u zavřeného pouzdra. Celé učení trvalo mnohem déle."],
          ["Přesně dva roky", "Tak dlouho to podle textu netrvalo. Sečti půl roku a několik dalších měsíců."],
          ["Celý svůj život", "Text uvádí konkrétní dobu učení, která je mnohem kratší než celý život."],
        ],
        h0: "V textu jsou dva údaje o čase: jeden na začátku a jeden v poslední větě.",
        h1: "Text říká, že se Ondra učí už půl roku, a pak přidává několik dalších měsíců cvičení. Sečti obě doby dohromady a porovnej součet s dvanácti měsíci — podle toho poznáš, které možnosti jsou moc krátké a které moc dlouhé.",
        e: "Ondra se učil půl roku a k tomu několik dalších měsíců každodenního cvičení. Šest měsíců plus několik dalších dává dobu jen o něco kratší než dvanáct měsíců.",
      },
    ],
  },
  {
    text:
      "Novákovi si na sobotu naplánovali celodenní výlet do hor. Ještě před odjezdem si táta všiml tmavých mraků a přibalil pláštěnky. Cestou nahoru začalo mrholit, a tak se všichni schovali pod skálu a počkali. Odpoledne se obloha vyjasnila a rodina došla až na vrchol, odkud bylo vidět celé údolí. Doma si večer hned začali plánovat další túru.",
    otazky: [
      {
        q: "Co nejlépe vystihuje celý příběh?",
        a: "Rodina si se špatným počasím poradila",
        d: [
          ["Výlet se kvůli dešti zrušil", "Výlet pokračoval dál a rodina došla až nahoru. Zrušený tedy nebyl."],
          ["Rodina v horách zabloudila", "O bloudění text nic neříká. Cestu na vrchol našli bez problémů."],
          ["Táta zapomněl pláštěnky doma", "Text říká opak — táta pláštěnky přibalil ještě před odjezdem."],
        ],
        h0: "Nehledej jednu větu. Projdi si, jak výlet začal, co ho zdrželo a jak skončil.",
        h1: "Sleduj celý oblouk příběhu: příprava, překážka, řešení, výsledek. Správná možnost musí zahrnout jak potíž, tak to, jak dopadla — možnosti, které mluví jen o potížích, jsou příliš úzké.",
        e: "Rodina se na déšť předem připravila, přečkala ho pod skálou a nakonec došla až na vrchol. Celý příběh je tedy o tom, jak si s překážkou poradila.",
      },
      {
        q: "Co nám o tátovi prozradí, že přibalil pláštěnky?",
        a: "Dokázal se připravit dopředu",
        d: [
          ["Nerad chodí do hor", "Kdyby nerad chodil do hor, výlet by neplánoval. Pláštěnky s tím nesouvisí."],
          ["Bojí se bouřky", "O strachu ani bouřce text nic neříká. Táta jen reagoval na to, co viděl na obloze."],
          ["Zapomíná na věci", "Pláštěnky naopak nezapomněl. Text ukazuje, že na ně pomyslel včas."],
        ],
        h0: "Všimni si, kdy táta pláštěnky přibalil a co těsně předtím uviděl.",
        h1: "Text spojuje dva okamžiky: táta si všiml tmavých mraků a hned potom přibalil pláštěnky. Zeptej se, co se o člověku dozvíš, když takhle zareaguje ještě před odjezdem, tedy dřív, než déšť vůbec začne.",
        e: "Táta si všiml tmavých mraků a pláštěnky přibalil ještě před odjezdem, tedy dřív, než začalo pršet. Odhadl tak dopředu, co se může stát.",
      },
      {
        q: "Proč rodina nakonec na vrchol došla?",
        a: "Počkali, až přestane pršet",
        d: [
          ["Vyjeli nahoru lanovkou", "O lanovce se v textu nic nepíše. Rodina šla celou cestu po svých."],
          ["Déšť vůbec nepřišel", "Text říká, že cestou nahoru mrholit začalo. Déšť tedy přišel."],
          ["Vzdali to a vrátili se", "Kdyby to vzdali, na vrchol by nedošli. Text ale říká, že tam došli."],
        ],
        h0: "Podívej se, co rodina udělala, když začalo mrholit, a co se stalo odpoledne.",
        h1: "Mezi deštěm a vrcholem je v textu jeden mezikrok. Najdi, co rodina dělala pod skálou, a spoj to s větou o odpoledni — teprve obojí dohromady vysvětluje, proč cesta dopadla dobře.",
        e: "Rodina se před mrholením schovala pod skálu a počkala. Odpoledne se obloha vyjasnila, a tak mohli pokračovat až na vrchol.",
      },
      {
        q: "Co naznačuje, že se rodině výlet líbil?",
        a: "Že hned plánovali další túru",
        d: [
          ["Že si vzali pláštěnky", "Pláštěnky si vzali ještě před výletem, takže o jeho průběhu nic neříkají."],
          ["Že je cestou zmoklo", "Déšť je nepříjemnost, ne známka spokojenosti. Hledej něco, co se stalo až po návratu."],
          ["Že přijeli domů až večer", "Dlouhý výlet ještě neznamená vydařený výlet. Rozhoduje to, co udělali doma."],
        ],
        h0: "Poslední věta popisuje, co rodina udělala hned po návratu domů.",
        h1: "Text nikde nenapíše, že se jim výlet líbil — musíš to poznat z chování. Zeptej se, co obvykle udělá člověk, kterého něco bavilo, a porovnej to s poslední větou textu.",
        e: "Rodina si doma večer hned začala plánovat další túru. Kdo si chce zážitek brzy zopakovat, tomu se zjevně líbil.",
      },
    ],
  },
  {
    text:
      "Do třídy přišla v pondělí nová holčička Lea. O přestávce stála sama u okna a nikdo si jí nevšímal. Matěj si vzpomněl, jak se sám loni cítil, když do téhle třídy přestoupil. Přisedl si k Lee a zeptal se jí, jestli si s nimi nechce zahrát vybíjenou. Do pátku už Lea chodila ven s celou partou.",
    otazky: [
      {
        q: "Proč Matěj Leu oslovil?",
        a: "Znal ten pocit z vlastní zkušenosti",
        d: [
          ["Nařídila mu to paní učitelka", "O paní učitelce text nic neříká. Matěj se rozhodl sám, kvůli vlastní vzpomínce."],
          ["Chtěl vyhrát vybíjenou", "Vybíjená byla jen nabídka, ne důvod. Text nikde nemluví o vítězství."],
          ["Lea ho o to poprosila", "Lea stála sama u okna a nikoho neoslovila. První krok udělal Matěj."],
        ],
        h0: "Před tím, než Matěj přisedl, si na něco vzpomněl. Na co?",
        h1: "Text řadí dvě věty hned za sebou: Matějovu vzpomínku na vlastní přestup a jeho krok k Lee. Spoj je dohromady a zeptej se, proč ho zrovna tahle vzpomínka postrčila jednat.",
        e: "Matěj si vzpomněl, jak se sám cítil, když loni do třídy přestoupil. Věděl tedy z vlastní zkušenosti, jaké to je být nový, a proto Leu oslovil.",
      },
      {
        q: "Co je hlavní myšlenkou příběhu?",
        a: "Stačí málo a nováček ve třídě zapadne",
        d: [
          ["Nováček si musí poradit úplně sám", "Lea si sama neporadila — stála u okna. Pomohl až Matějův krok."],
          ["Vybíjená je nejlepší hra o přestávce", "Vybíjená je v příběhu jen záminka k seznámení, ne jeho téma."],
          ["Nové děti do party nikdy nezapadnou", "Lea do party zapadla už do pátku, takže příběh tvrdí pravý opak."],
        ],
        h0: "Hlavní myšlenku hledej v tom, co se změnilo mezi pondělím a pátkem.",
        h1: "Porovnej začátek a konec: v pondělí stojí Lea sama u okna, v pátek chodí ven s celou partou. Pak se zeptej, jak velký krok tu změnu způsobil — a podle toho vyber možnost.",
        e: "Stačilo, že si k Lee jeden spolužák přisedl a pozval ji do hry, a do pátku patřila k partě. Příběh tak ukazuje, jak velkou změnu dokáže udělat jedna drobná vstřícnost.",
      },
      {
        q: "Co se o Matějovi z příběhu dozvíme?",
        a: "Také kdysi býval nový",
        d: [
          ["Chodí do školy od první třídy", "Text říká opak — do téhle třídy přestoupil odjinud, a to teprve loni."],
          ["Je nejlepší hráč vybíjené", "O jeho výkonech ve hře text nic nepíše. Vybíjenou jen nabídl."],
          ["S nikým se nebaví", "Matěj zve Leu do party, se kterou hraje. Kamarády tedy má."],
        ],
        h0: "Ve třetí větě je informace o Matějově vlastní minulosti ve škole.",
        h1: "Slovo „přestoupil“ znamená, že do téhle třídy přišel z jiné, a slovo „loni“ říká kdy. Spoj to dohromady a získáš informaci o tom, čím si Matěj sám prošel.",
        e: "Text říká, že Matěj loni do téhle třídy přestoupil. Kdo přestoupí, je ve třídě zpočátku nováčkem, stejně jako teď Lea.",
      },
      {
        q: "Co se změnilo v Leině postavení do konce týdne?",
        a: "Získala kamarády",
        d: [
          ["Přestoupila jinam", "O dalším přestupu text nic neříká. Lea ve třídě zůstala."],
          ["Zůstala pořád sama", "Poslední věta říká opak — chodila ven s celou partou."],
          ["Stala se nejlepší žákyní", "O známkách ani učení text nic nepíše. Změna se týkala vztahů se spolužáky."],
        ],
        h0: "Porovnej, co Lea dělala o pondělní přestávce a co dělala do pátku.",
        h1: "Text popisuje dva okamžiky téhož týdne: v pondělí stojí sama u okna, do pátku chodí ven s partou. Rozdíl mezi těmi dvěma obrázky je přesně to, na co se otázka ptá.",
        e: "V pondělí Lea stála o přestávce sama, do pátku už chodila ven s celou partou. Získala tedy ve třídě kamarády, se kterými trávila čas.",
      },
    ],
  },
  {
    text:
      "Klára dostala k narozeninám balíček se semínky slunečnic. Zasadila je do květináče a každý den je zalévala, jenže ze země nic nevykukovalo. Po týdnu ji to přestalo bavit a chtěla hlínu vysypat. Maminka jí poradila, ať počká ještě pár dnů. Desátý den se v hlíně objevil první zelený výhonek.",
    otazky: [
      {
        q: "Proč chtěla Klára hlínu vysypat?",
        a: "Dlouho nebylo nic vidět",
        d: [
          ["Zapomněla je zalévat", "Text říká opak — zalévala je každý den. Zalévání nebylo problémem."],
          ["Maminka jí to poradila", "Maminka poradila pravý opak, totiž aby ještě chvíli počkala."],
          ["Květináč se rozbil", "O rozbitém květináči text nic nepíše. Klára byla zklamaná z toho, co viděla v hlíně."],
        ],
        h0: "Druhá a třetí věta říkají, co Klára viděla v hlíně a jak dlouho už to trvalo.",
        h1: "Spoj dva údaje: co se ze země po celý týden neobjevovalo a jak dlouho Klára čekala. Právě spojení „nic se neděje“ a „už dlouho“ vysvětluje, proč ji to přestalo bavit.",
        e: "Klára zalévala každý den, ale ze země celý týden nic nevykukovalo. Když se tak dlouho nic neobjevilo, ztratila trpělivost.",
      },
      {
        q: "Co se z příběhu dá vyvodit?",
        a: "Některé věci potřebují čas",
        d: [
          ["Slunečnice se nedají pěstovat", "Výhonek se nakonec objevil, takže se pěstovat dají."],
          ["Zalévat se musí jen jednou týdně", "Klára zalévala každý den a semínko vyklíčilo. Text takové pravidlo nenabízí."],
          ["Dárky k narozeninám bývají nudné", "Z dárku nakonec vyrostla rostlina. Příběh o nudě vůbec není."],
        ],
        h0: "Ponaučení hledej v tom, co se stalo až desátý den, ne v jedné konkrétní větě.",
        h1: "Porovnej Klářino očekávání s tím, co se opravdu stalo: čekala výsledek hned, ale přišel až po deseti dnech. Zeptej se, co z toho plyne obecně, nejen o slunečnicích.",
        e: "Semínko vyklíčilo až desátý den, i když Klára chtěla výsledek mnohem dřív. Příběh tak ukazuje, že na některé věci se musí trpělivě počkat.",
      },
      {
        q: "Co by se stalo, kdyby Klára maminku neposlechla?",
        a: "O výhonek by přišla",
        d: [
          ["Semínka by vyklíčila dřív", "Vysypaná hlína klíčení neurychlí. Semínko potřebovalo svůj čas v květináči."],
          ["Nic by se nezměnilo", "Změnilo by se hodně — v květináči by nezbylo nic, z čeho by rostlina vyrostla."],
          ["Slunečnice by vyrostly větší", "Velikost rostliny s vysypáním hlíny nesouvisí. Bez hlíny by nevyrostla vůbec."],
        ],
        h0: "Rozmysli si, co Klára chtěla udělat s hlínou — a co v té hlíně bylo.",
        h1: "V textu jsou dvě informace vedle sebe: Klára chtěla hlínu vysypat a desátý den se právě v té hlíně něco objevilo. Představ si příběh bez maminčiny rady a domysli, co by z něj zmizelo.",
        e: "Desátý den se v hlíně objevil první zelený výhonek. Kdyby Klára hlínu vysypala, vyhodila by ho i se semínky dřív, než se stihl ukázat.",
      },
      {
        q: "Jakou roli hrála v příběhu maminka?",
        a: "Poradila Kláře, ať to nevzdá",
        d: [
          ["Semínka zasadila místo ní", "Semínka zasadila Klára sama. Maminka vstoupila do příběhu až později."],
          ["Květináč vyhodila", "Vyhodit hlínu chtěla Klára, a maminka jí to rozmluvila."],
          ["Klářin nápad podpořila hned na začátku", "Maminka se v textu objeví až ve chvíli, kdy to Klára chtěla vzdát."],
        ],
        h0: "Maminka se v textu objeví jen jednou. Co v tu chvíli Kláře řekla?",
        h1: "Najdi v textu jedinou větu, ve které maminka vystupuje, a porovnej ji s tím, co chtěla Klára udělat těsně předtím. Rozdíl mezi tím obojím ukazuje, jakou roli maminka sehrála.",
        e: "Maminka Kláře poradila, ať počká ještě pár dnů, právě když chtěla hlínu vysypat. Díky té radě Klára pokus nevzdala a dočkala se výhonku.",
      },
    ],
  },
];

function toTasks(ctení: Ctení[]): PracticeTask[] {
  return shuffle(
    ctení.flatMap((t) =>
      t.otazky.map((o) =>
        choice(
          `Přečti si text:\n\n${t.text}\n\n${o.q}`,
          o.a,
          o.d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor],
          { hints: [o.h0, o.h1], explanation: o.e },
        ),
      ),
    ),
  );
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return toTasks(L1);
  if (level === 2) return toTasks(L2);
  return toTasks(L3);
}

export const PLYNULECTENI: TopicMetadata[] = [
  {
    id: "g3-cjl-plynule-cteni-porozumeni",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-delsich-textu",
    title: "Plynulé čtení s porozuměním delších textů",
    studentTitle: "Čtu s porozuměním",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení",
    briefDescription: "Přečteš text a správně odpovíš na otázky o jeho obsahu.",
    keywords: ["čtení", "porozumění", "text", "otázky", "obsah", "odpovědi z textu"],
    goals: [
      "Přečíst text a porozumět mu.",
      "Najít v textu jeden konkrétní údaj.",
      "Spojit dvě informace z různých vět (příčina, pořadí, kdo co dělá).",
      "Odvodit hlavní myšlenku a závěr, které nejsou v textu doslova napsané.",
    ],
    boundaries: [
      "Texty přiměřené 3. ročníku.",
      "L1/L2 texty do 5 vět; L3 texty o něco delší — cíleně procvičují „delší text“ z názvu tématu.",
      "Odpověď je vždy přeformulovaná, ne doslovný výsek textu.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Přečti text 2×. Při hledání odpovědi se vrať k textu a hledej konkrétní informaci nebo si poskládej odpověď z více vět.",
      steps: [
        "Přečti celý text.",
        "Přečti otázku.",
        "Vrať se k textu a najdi odpověď (nebo spoj víc informací dohromady).",
        "Vyber správnou možnost.",
      ],
      commonMistake: "Odpovídání z hlavy bez opření o text — vždy se vrať k textu.",
      example: "Text: 'Bob je hnědý pes.' Otázka: Jakou barvu má Bob? → Hledám v textu: 'hnědý'.",
    },
  },
];
