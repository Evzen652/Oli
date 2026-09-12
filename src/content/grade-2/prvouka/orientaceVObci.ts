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
//   L1 = rozpoznání: k dané instituci přiřadíme její hlavní, dobře
//        známou činnost (co se tam dělá) — izolovaný fakt.
//   L2 = aplikace: od konkrétní potřeby ("chci poslat dopis") odvodíme
//        instituci, kam je za tím účelem třeba jít.
//   L3 = transfer (přiměřeně věku 7-8 let): kombinace dvou potřeb
//        zároveň, rozlišení blízkých institucí podle závažnosti či
//        typu situace (lékař vs. nemocnice vs. lékárna, knihovna vs.
//        knihkupectví...), vyřazení toho, co nesouvisí.
// Každá úloha: dvě vlastní nápovědy, zpětná vazba u každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Co se dělá ve škole?",
    correctAnswer: "Děti se tam učí",
    options: [
      "Děti se tam učí",
      "Půjčují se tam knihy",
      "Vydávají se tam léky předepsané lékařem",
      "Modlí se tam lidé",
    ],
    emoji: "🏫",
    hints: [
      "Přemýšlej, kam chodíš každý všední den a co se tam naučíš.",
      "Ráno si vezmeš aktovku, sedneš do lavice, paní učitelka píše na tabuli a ty počítáš a čteš. Co se na tom místě tedy dělá?",
    ],
    optionFeedback: {
      "Půjčují se tam knihy": "Knihy se půjčují v knihovně.",
      "Vydávají se tam léky předepsané lékařem": "Léky na recept se vydávají v lékárně.",
      "Modlí se tam lidé": "Modlit se chodí lidé do kostela.",
    },
    solutionSteps: ["Ve škole se děti učí číst, psát a počítat — proto tam chodí každý den."],
  },
  {
    question: "Co se dělá v obchodě?",
    correctAnswer: "Nakupuje se tam jídlo a zboží",
    options: ["Posílají se tam dopisy a balíky", "Nakupuje se tam jídlo a zboží", "Cvičí se tam sportovci uvnitř budovy", "Modlí se tam lidé"],
    emoji: "🏪",
    hints: [
      "Přemýšlej, kam jdete s rodiči, když doma dojde jídlo.",
      "V košíku vezeš chleba, mléko a jablka a u pokladny za ně zaplatíš. Jak se říká tomu, co se tam s věcmi dělá?",
    ],
    optionFeedback: {
      "Posílají se tam dopisy a balíky": "Dopisy se posílají na poště.",
      "Cvičí se tam sportovci uvnitř budovy": "Cvičí se v tělocvičně.",
      "Modlí se tam lidé": "Modlí se v kostele.",
    },
    solutionSteps: ["V obchodě se nakupuje jídlo, pití a další věci na běžný den."],
  },
  {
    question: "Co se dělá na poště?",
    correctAnswer: "Posílají a vyzvedávají se tam dopisy a balíky",
    options: ["Půjčují se tam knihy", "Vyřizují se tam záležitosti obce", "Posílají a vyzvedávají se tam dopisy a balíky", "Nastupuje a vystupuje se tam z vlaku"],
    emoji: "📮",
    hints: [
      "Přemýšlej, kam bys šel, kdybys chtěl někomu poslat pohled.",
      "Na přepážce ti paní zváží balík, nalepí na obálku známku a řekne, kdy dorazí. Někdy si tam také vyzvedneš balíček, který ti někdo poslal.",
    ],
    optionFeedback: {
      "Půjčují se tam knihy": "Knihy se půjčují v knihovně.",
      "Vyřizují se tam záležitosti obce": "Záležitosti obce se vyřizují na radnici.",
      "Nastupuje a vystupuje se tam z vlaku": "Na vlak se jde na nádraží.",
    },
    solutionSteps: ["Na poště se odesílají a vyzvedávají dopisy a balíky."],
  },
  {
    question: "Co se dělá v knihovně?",
    correctAnswer: "Půjčují se tam knihy",
    options: ["Posílají a vyzvedávají se tam dopisy a balíky", "Děti se tam učí", "Nakupuje se tam jídlo a zboží", "Půjčují se tam knihy"],
    emoji: "📚",
    hints: [
      "Přemýšlej, kam jít, když chceš knihu jen na chvíli a nechceš ji koupit.",
      "Vybereš si pohádku z regálu, paní ji zapíše na tvou průkazku a za tři týdny ji zase vrátíš. Co se tedy s knihami na tom místě děje?",
    ],
    optionFeedback: {
      "Posílají a vyzvedávají se tam dopisy a balíky": "To se dělá na poště.",
      "Děti se tam učí": "Učí se ve škole; v knihovně si spíš čteš a vybíráš.",
      "Nakupuje se tam jídlo a zboží": "Nakupuje se v obchodě, v knihovně se za knihy neplatí.",
    },
    solutionSteps: ["V knihovně si lidé zdarma půjčují knihy a zase je vracejí."],
  },
  {
    question: "Co se dělá v nemocnici?",
    correctAnswer: "Léčí se tam těžce nemocní lidé",
    options: [
      "Léčí se tam těžce nemocní lidé",
      "Vydávají se tam léky předepsané lékařem",
      "Připravují se tam hasiči na hašení požárů",
      "Pracují tam policisté, kteří chrání pořádek",
    ],
    emoji: "🏥",
    hints: [
      "Přemýšlej, kam odvezou člověka, který je vážně nemocný nebo zraněný.",
      "Tam jezdí sanitka s houkačkou. Pacienti leží na pokojích v postelích, někdy i několik dní, a lékaři a sestry se o ně starají ve dne i v noci.",
    ],
    optionFeedback: {
      "Vydávají se tam léky předepsané lékařem": "Léky na recept se vydávají v lékárně.",
      "Připravují se tam hasiči na hašení požárů": "Hasiči jsou na hasičské stanici.",
      "Pracují tam policisté, kteří chrání pořádek": "Policisté jsou na policejní stanici.",
    },
    solutionSteps: ["V nemocnici léčí lékaři těžce nemocné nebo zraněné lidi, kteří tam často i zůstávají."],
  },
  {
    question: "Co se dělá v lékárně?",
    correctAnswer: "Vydávají se tam léky předepsané lékařem",
    options: ["Léčí se tam těžce nemocní lidé", "Vydávají se tam léky předepsané lékařem", "Nakupuje se tam jídlo a zboží", "Vyřizují se tam záležitosti obce"],
    emoji: "💊",
    hints: [
      "Přemýšlej, kam jdeme, když nám lékař napíše recept.",
      "Za pultem stojí paní v bílém plášti, vezme si od tebe recept a z regálu s krabičkami ti podá, co lékař napsal.",
    ],
    optionFeedback: {
      "Léčí se tam těžce nemocní lidé": "Těžce nemocní se léčí v nemocnici, v lékárně se neleží.",
      "Nakupuje se tam jídlo a zboží": "Jídlo se kupuje v obchodě.",
      "Vyřizují se tam záležitosti obce": "Záležitosti obce jsou na radnici.",
    },
    solutionSteps: ["V lékárně vydávají léky, které předepsal lékař."],
  },
  {
    question: "Co se dělá na hasičské stanici?",
    correctAnswer: "Připravují se tam hasiči na hašení požárů",
    options: ["Pracují tam policisté, kteří chrání pořádek", "Léčí se tam těžce nemocní lidé", "Připravují se tam hasiči na hašení požárů", "Vyřizují se tam záležitosti obce"],
    emoji: "🚒",
    hints: [
      "Přemýšlej, odkud vyjíždí auto s hadicí, když někde hoří.",
      "V garáži stojí červená auta s žebříky a hadicemi. Když zazvoní poplach, muži si rychle obléknou zásahové obleky a vyjedou.",
    ],
    optionFeedback: {
      "Pracují tam policisté, kteří chrání pořádek": "Policisté pracují na policejní stanici.",
      "Léčí se tam těžce nemocní lidé": "Nemocní se léčí v nemocnici.",
      "Vyřizují se tam záležitosti obce": "Záležitosti obce se vyřizují na radnici.",
    },
    solutionSteps: ["Na hasičské stanici jsou připravení hasiči a hasičská auta pro případ požáru."],
  },
  {
    question: "Co se dělá na policejní stanici?",
    correctAnswer: "Pracují tam policisté, kteří chrání pořádek",
    options: ["Připravují se tam hasiči na hašení požárů", "Vyřizují se tam záležitosti obce", "Léčí se tam těžce nemocní lidé", "Pracují tam policisté, kteří chrání pořádek"],
    emoji: "👮",
    hints: [
      "Přemýšlej, kde pracují lidé v uniformě, kteří hlídají bezpečnost.",
      "Před budovou parkují auta s modrými majáky a nápisem POLICIE. Sem přijdeš nahlásit, že ti někdo ukradl kolo.",
    ],
    optionFeedback: {
      "Připravují se tam hasiči na hašení požárů": "Hasiči mají svou hasičskou stanici.",
      "Vyřizují se tam záležitosti obce": "To se dělá na radnici.",
      "Léčí se tam těžce nemocní lidé": "To se dělá v nemocnici.",
    },
    solutionSteps: ["Na policejní stanici pracují policisté, kteří chrání lidi a pořádek v obci."],
  },
  {
    question: "Co se dělá na radnici?",
    correctAnswer: "Vyřizují se tam záležitosti obce",
    options: [
      "Vyřizují se tam záležitosti obce",
      "Pracují tam policisté, kteří chrání pořádek",
      "Posílají a vyzvedávají se tam dopisy a balíky",
      "Děti se tam učí",
    ],
    emoji: "🏛️",
    hints: [
      "Přemýšlej, kam jdou rodiče, když potřebují vyřídit něco úředního.",
      "Pracuje tam starosta a úředníci. Rodiče tam vyřizují doklady a lidé se tam ptají, kdy se opraví cesta nebo postaví nové hřiště.",
    ],
    optionFeedback: {
      "Pracují tam policisté, kteří chrání pořádek": "Policisté sídlí na policejní stanici.",
      "Posílají a vyzvedávají se tam dopisy a balíky": "To se dělá na poště.",
      "Děti se tam učí": "Děti se učí ve škole.",
    },
    solutionSteps: ["Na radnici úřaduje starosta a vyřizují se tam záležitosti obce."],
  },
  {
    question: "Co se dělá v kostele?",
    correctAnswer: "Lidé se tam modlí a scházejí na bohoslužby",
    options: ["Vyřizují se tam záležitosti obce", "Lidé se tam modlí a scházejí na bohoslužby", "Děti se tam učí", "Půjčují se tam knihy"],
    emoji: "⛪",
    hints: [
      "Přemýšlej, jaká stavba má vysokou věž se zvony.",
      "V neděli ráno tam zvoní zvony a lidé, kteří věří v Boha, přicházejí dovnitř, zpívají a poslouchají faráře.",
    ],
    optionFeedback: {
      "Vyřizují se tam záležitosti obce": "To se dělá na radnici.",
      "Děti se tam učí": "Učí se ve škole.",
      "Půjčují se tam knihy": "Knihy se půjčují v knihovně.",
    },
    solutionSteps: ["V kostele se lidé modlí a scházejí na bohoslužby."],
  },
  {
    question: "Co se dělá na nádraží?",
    correctAnswer: "Nastupuje a vystupuje se tam z vlaku",
    options: ["Posílají a vyzvedávají se tam dopisy a balíky", "Děti si tam venku hrají", "Nastupuje a vystupuje se tam z vlaku", "Lidé se tam modlí a scházejí na bohoslužby"],
    emoji: "🚉",
    hints: [
      "Přemýšlej, kam jdeš, když s rodinou jedete na výlet po kolejích.",
      "Na nástupišti čekáš s kufrem, z reproduktoru hlásí příjezd a po kolejích přijede dlouhá souprava vagonů.",
    ],
    optionFeedback: {
      "Posílají a vyzvedávají se tam dopisy a balíky": "To se dělá na poště.",
      "Děti si tam venku hrají": "Na hraní je hřiště, u kolejí je to nebezpečné.",
      "Lidé se tam modlí a scházejí na bohoslužby": "To se dělá v kostele.",
    },
    solutionSteps: ["Na nádraží vlaky přijíždějí a odjíždějí a cestující tam nastupují a vystupují."],
  },
  {
    question: "Co se dělá na hřišti?",
    correctAnswer: "Děti si tam venku hrají",
    options: ["Cvičí se tam sportovci uvnitř budovy", "Naučíš se tam plavat", "Nastupuje a vystupuje se tam z vlaku", "Děti si tam venku hrají"],
    emoji: "🛝",
    hints: [
      "Přemýšlej, kam jdeš odpoledne ven na houpačky a prolézačky.",
      "Je tam pískoviště, skluzavka, houpačky a průlezky. Nikdo tam nesedí v lavici — běháš a lezeš na čerstvém vzduchu.",
    ],
    optionFeedback: {
      "Cvičí se tam sportovci uvnitř budovy": "Uvnitř budovy se cvičí v tělocvičně, hřiště je venku.",
      "Naučíš se tam plavat": "Plavat se učí v bazénu.",
      "Nastupuje a vystupuje se tam z vlaku": "Z vlaku se vystupuje na nádraží.",
    },
    solutionSteps: ["Na hřišti si děti venku hrají, houpou se a lezou po prolézačkách."],
  },
  {
    question: "Co se dělá v muzeu?",
    correctAnswer: "Prohlížejí se tam staré a vzácné věci",
    options: ["Půjčují se tam knihy", "Nakupuje se tam jídlo a zboží", "Prohlížejí se tam staré a vzácné věci", "Promítají se tam filmy"],
    emoji: "🏺",
    hints: [
      "Přemýšlej, kam jdete na výlet podívat se na kostry dinosaurů nebo staré brnění.",
      "Věci tam leží ve vitrínách a na cedulkách je napsané, kolik je jim let. Nesmíš na ně sahat ani si je odnést domů — můžeš se jen dívat.",
    ],
    optionFeedback: {
      "Půjčují se tam knihy": "Knihy se půjčují v knihovně; věci z muzea si domů neodneseš.",
      "Nakupuje se tam jídlo a zboží": "Nakupuje se v obchodě.",
      "Promítají se tam filmy": "Filmy se promítají v kině.",
    },
    solutionSteps: ["V muzeu si lidé prohlížejí staré a vzácné věci, které jsou vystavené ve vitrínách."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Kam půjdeš, když si chceš ke snídani koupit chleba a mléko?",
    correctAnswer: "Obchod",
    options: ["Obchod", "Pekárna", "Lékárna", "Pošta"],
    emoji: "🏪",
    hints: [
      "Hledej místo, kde koupíš víc druhů potravin najednou, ne jen jeden druh pečiva.",
      "Pekárna prodává jen pečivo, mléko tam nedostaneš. Lékárna i pošta jsou na něco jiného. Kde najdeš v regálech chleba i mléko dohromady?",
    ],
    optionFeedback: {
      Pekárna: "V pekárně koupíš chleba, ale mléko ne.",
      Lékárna: "V lékárně jsou léky, ne potraviny.",
      Pošta: "Na poště se posílají dopisy.",
    },
    solutionSteps: ["Chleba i mléko dohromady koupíš v obchodě — pekárna prodává jen pečivo."],
  },
  {
    question: "Kam půjdeš, když máš vysokou horečku a potřebuješ, aby tě někdo prohlédl?",
    correctAnswer: "Ordinace lékaře",
    options: ["Nemocnice", "Ordinace lékaře", "Lékárna", "Škola"],
    emoji: "👩‍⚕️",
    hints: [
      "Hledej místo pro běžné vyšetření, kde nezůstáváš přes noc.",
      "Nemocnice je pro vážné případy, kdy se tam i zůstává. Lékárna jen vydává léky. Kde tě prohlédnou, poslechnou a řeknou, co dál?",
    ],
    optionFeedback: {
      Nemocnice: "Do nemocnice se jezdí při vážných potížích; na běžné vyšetření stačí ordinace.",
      Lékárna: "Lékárna léky vydává, ale nikoho nevyšetřuje.",
      Škola: "S horečkou do školy nejdeš, zůstaneš doma a jdeš k lékaři.",
    },
    solutionSteps: ["Na vyšetření kvůli horečce jdeš do ordinace lékaře — prohlédne tě a řekne, co dál."],
  },
  {
    question: "Kam půjdeš, když chceš poslat dopis babičce?",
    correctAnswer: "Pošta",
    options: ["Knihovna", "Radnice", "Pošta", "Nádraží"],
    emoji: "📮",
    hints: [
      "Hledej místo, které se stará o doručování dopisů a balíků.",
      "Dopis potřebuje známku a někoho, kdo ho doveze až k babičce. Kde si známku koupíš a obálku odevzdáš na přepážce?",
    ],
    optionFeedback: {
      Knihovna: "V knihovně se půjčují knihy.",
      Radnice: "Na radnici se vyřizují věci obce.",
      Nádraží: "Z nádraží odjíždějí vlaky, dopisy tam neodesíláš.",
    },
    solutionSteps: ["Dopis babičce pošleš na poště — tam dopisy přijímají a doručují dál."],
  },
  {
    question: "Kam půjdeš, když si chceš přečíst novou knihu, ale nechceš ji kupovat?",
    correctAnswer: "Knihovna",
    options: ["Pošta", "Obchod", "Škola", "Knihovna"],
    emoji: "📚",
    hints: [
      "Hledej místo, kde si knihu jen na čas půjčíš a pak ji vrátíš.",
      "V obchodě bys knihu musel zaplatit. Hledej místo s regály plnými knih, kde dostaneš průkazku a knihu po přečtení vrátíš.",
    ],
    optionFeedback: {
      Pošta: "Na poště se knihy nepůjčují.",
      Obchod: "V obchodě bys knihu musel koupit.",
      Škola: "Ve škole máš učebnice, ale na půjčování knih je jiné místo.",
    },
    solutionSteps: ["Knihu si zdarma půjčíš v knihovně, koupit bys ji musel v obchodě s knihami."],
  },
  {
    question: "Kam půjdeš, když ti lékař předepsal lék a potřebuješ ho vyzvednout?",
    correctAnswer: "Lékárna",
    options: ["Lékárna", "Nemocnice", "Ordinace lékaře", "Obchod"],
    emoji: "💊",
    hints: [
      "Hledej místo, kde na tebe čeká lék podle receptu od lékaře.",
      "Lékař ti lék jen napsal na recept, sám ho nevydává. Recept odneseš na místo se zeleným křížem, kde ti za pultem podají krabičku.",
    ],
    optionFeedback: {
      Nemocnice: "Nemocnice léčí pacienty, lék na recept si ale vyzvedneš jinde.",
      "Ordinace lékaře": "Lékař recept napsal, lék ti ale nedá.",
      Obchod: "V obchodě se léky na recept neprodávají.",
    },
    solutionSteps: ["Předepsaný lék vyzvedneš v lékárně."],
  },
  {
    question: "Odkud vyjedou hasiči, když v sousedním domě hoří?",
    correctAnswer: "Hasičská stanice",
    options: ["Policejní stanice", "Hasičská stanice", "Nemocnice", "Radnice"],
    emoji: "🚒",
    hints: [
      "Hledej místo, kde hasiči a jejich auta stále čekají připravení na výjezd.",
      "V budově s velkými vraty stojí červená auta s hadicemi a žebříky. Hasiči tam čekají, až zazvoní poplach, a pak rychle vyrazí.",
    ],
    optionFeedback: {
      "Policejní stanice": "Z policejní stanice vyjíždějí policisté, ne hasiči.",
      Nemocnice: "Z nemocnice vyjíždí sanitka.",
      Radnice: "Na radnici pracuje starosta.",
    },
    solutionSteps: ["Hasiči vyjíždějí k požáru z hasičské stanice."],
  },
  {
    question: "Kam půjdeš nahlásit, že ti někdo ukradl kolo?",
    correctAnswer: "Policejní stanice",
    options: ["Hasičská stanice", "Radnice", "Policejní stanice", "Nemocnice"],
    emoji: "👮",
    hints: [
      "Hledej místo, kam se hlásí krádeže a jiné podobné případy.",
      "Krádež není požár ani nemoc. Hledej místo, kde pracují lidé v uniformě, kteří pátrají po zlodějích.",
    ],
    optionFeedback: {
      "Hasičská stanice": "Hasiči hasí požáry, krádeže neřeší.",
      Radnice: "Radnice vyřizuje věci obce, krádeže nevyšetřuje.",
      Nemocnice: "Nemocnice léčí nemocné.",
    },
    solutionSteps: ["Krádež kola nahlásíš na policejní stanici — policisté ji budou vyšetřovat."],
  },
  {
    question: "Kam půjdou rodiče, když chtějí vyřídit nový občanský průkaz?",
    correctAnswer: "Radnice",
    options: ["Pošta", "Policejní stanice", "Škola", "Radnice"],
    emoji: "🏛️",
    hints: [
      "Hledej místo, kde se vyřizují úřední záležitosti.",
      "Doklady vydávají úředníci. Pracují ve stejné budově jako starosta, často s věží a hodinami na náměstí.",
    ],
    optionFeedback: {
      Pošta: "Na poště se posílají dopisy, doklady se tam nevydávají.",
      "Policejní stanice": "Policie doklady kontroluje, ale nový průkaz vyřídíš jinde.",
      Škola: "Ve škole se děti učí.",
    },
    solutionSteps: ["Úřední doklady jako občanský průkaz se vyřizují na radnici (úřadě)."],
  },
  {
    question: "Kam půjdeš v neděli, když se chceš zúčastnit bohoslužby?",
    correctAnswer: "Kostel",
    options: ["Kostel", "Radnice", "Škola", "Knihovna"],
    emoji: "⛪",
    hints: [
      "Hledej stavbu s věží a zvony, kam chodí lidé, kteří věří v Boha.",
      "V neděli dopoledne zvoní zvony a lidé jdou dovnitř stavby s vysokou věží, kde je oltář a hrají varhany.",
    ],
    optionFeedback: {
      Radnice: "Na radnici se vyřizují úřední věci, bohoslužby tam nejsou.",
      Škola: "Ve škole se učí, v neděli je zavřená.",
      Knihovna: "V knihovně se půjčují knihy.",
    },
    solutionSteps: ["Na bohoslužbu jdeš do kostela."],
  },
  {
    question: "Kam půjdeš, když se chceš naučit plavat?",
    correctAnswer: "Bazén",
    options: ["Hřiště", "Bazén", "Tělocvična", "Nemocnice"],
    emoji: "🏊",
    hints: [
      "Hledej místo s velkou nádrží plnou vody.",
      "Na hřišti ani v tělocvičně voda není. Hledej místo, kde jsou plavčíci, plavecké dráhy a voda po pás i hlubší.",
    ],
    optionFeedback: {
      Hřiště: "Na hřišti voda na plavání není.",
      Tělocvična: "V tělocvičně se cvičí na nářadí, ne plave.",
      Nemocnice: "V nemocnici se léčí, ne plave.",
    },
    solutionSteps: ["Plavat se naučíš v bazénu — je tam voda a plavčík, který na děti dohlíží."],
  },
  {
    question: "Kam půjdeš, když chceš vidět nový film na velkém plátně?",
    correctAnswer: "Kino",
    options: ["Škola", "Knihovna", "Kino", "Restaurace"],
    emoji: "🎬",
    hints: [
      "Hledej sál s velkým plátnem, kde se promítají filmy.",
      "Ve škole i v knihovně se učí a čte, v restauraci se jí. Hledej tmavý sál s měkkými sedačkami a obrovským plátnem.",
    ],
    optionFeedback: {
      Škola: "Ve škole se učí, filmy na velkém plátně se tam nepromítají.",
      Knihovna: "V knihovně se půjčují knihy.",
      Restaurace: "V restauraci se jí.",
    },
    solutionSteps: ["Nový film na velkém plátně uvidíš v kině."],
  },
  {
    question: "Kam půjdeš cvičit, když venku prší?",
    correctAnswer: "Tělocvična",
    options: ["Hřiště", "Bazén", "Kino", "Tělocvična"],
    emoji: "🤸",
    hints: [
      "Hledej místo pro sport, které je uvnitř budovy, takže tam déšť nevadí.",
      "Hřiště je venku a zmokl bys. Hledej sál se žebřinami, švédskou bednou a míči, kam chodíte na hodinu tělocviku.",
    ],
    optionFeedback: {
      Hřiště: "Hřiště je venku, v dešti bys zmokl.",
      Bazén: "V bazénu se plave, ne cvičí na nářadí.",
      Kino: "V kině se sedí a dívá na film.",
    },
    solutionSteps: ["Když prší, jde se cvičit do tělocvičny — je to sportoviště uvnitř budovy."],
  },
  {
    question: "Kam půjdeš, když chceš jet vlakem k babičce?",
    correctAnswer: "Nádraží",
    options: ["Nádraží", "Pošta", "Hřiště", "Radnice"],
    emoji: "🚆",
    hints: [
      "Vlak nejezdí po silnici — kde na něj nastoupíš?",
      "Na tom místě jsou nástupiště, koleje a pokladna s jízdenkami. Z reproduktoru hlásí, který vlak kam jede.",
    ],
    optionFeedback: {
      Pošta: "Na poště se posílají dopisy, vlaky tam nejezdí.",
      Hřiště: "Na hřišti si hraješ, vlak tam nejede.",
      Radnice: "Na radnici se vyřizují věci obce.",
    },
    solutionSteps: ["Na vlak se nastupuje na nádraží — tam vlaky přijíždějí a odjíždějí."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Lékař tě vyšetřil a napsal ti recept na lék proti kašli. Kam půjdeš pro lék?",
    correctAnswer: "Lékárna",
    options: ["Lékárna", "Ordinace lékaře", "Nemocnice", "Obchod"],
    emoji: "💊",
    hints: [
      "Recept je jen papír s předpisem — lék samotný dostaneš na jiném místě.",
      "Kdo lék napsal, ten ti ho nevydá. Hledej místo, kde za pultem podají krabičky s léky, když přineseš recept — nemocnice ani obchod to nejsou.",
    ],
    optionFeedback: {
      "Ordinace lékaře": "U lékaře jsi už byl — recept napsal, ale lék ti nevydá.",
      Nemocnice: "Nemocnice je pro vážné případy, pro lék na kašel tam nejdeš.",
      Obchod: "V obchodě se léky na recept neprodávají.",
    },
    solutionSteps: [
      "Recept napíše lékař, ale lék samotný vydá lékárna. U lékaře ani v nemocnici lék na recept rovnou nedostaneš.",
    ],
  },
  {
    question:
      "Kamarád spadl ze schodů, nemůže hýbat nohou a možná zůstane přes noc. Kam ho odvezou?",
    correctAnswer: "Nemocnice",
    options: ["Lékárna", "Nemocnice", "Ordinace lékaře", "Hasičská stanice"],
    emoji: "🏥",
    hints: [
      "Přemýšlej, které místo má lůžka pro pacienty, kteří tam musí zůstat déle.",
      "Kamarád možná potřebuje rentgen a zůstat přes noc na pokoji, kde na něj dohlédnou sestry. Obvyklá ordinace ani lékárna to nezvládnou — kam tedy?",
    ],
    optionFeedback: {
      Lékárna: "Lékárna jen vydává léky, zranění neošetří.",
      "Ordinace lékaře": "V běžné ordinaci se přes noc nezůstává a rentgen tam nemají.",
      "Hasičská stanice": "Hasiči pomáhají při požárech a nehodách, ale neléčí.",
    },
    solutionSteps: [
      "Při vážném zranění s možností přespání jede kamarád do nemocnice — tam mají lůžka a starají se o pacienty i v noci.",
    ],
  },
  {
    question:
      "Bolí tě v krku a máš rýmu, ale přes noc nikde zůstat nemusíš. Kam půjdeš?",
    correctAnswer: "Ordinace lékaře",
    options: ["Nemocnice", "Lékárna", "Ordinace lékaře", "Škola"],
    emoji: "👩‍⚕️",
    hints: [
      "Přemýšlej, kam se chodí na běžné vyšetření, když nejde o vážný případ.",
      "Tvoje nemoc není vážná a přes noc nikde zůstat nemusíš. Potřebuješ jen, aby tě někdo poslechl, podíval se ti do krku a napsal recept. Kde to proběhne?",
    ],
    optionFeedback: {
      Nemocnice: "Nemocnice je pro vážné případy, s rýmou tam nejdeš.",
      Lékárna: "Lékárna vydá lék, ale nevyšetří tě a recept nenapíše.",
      Škola: "Nemocný do školy nechodí.",
    },
    solutionSteps: [
      "Na běžné vyšetření bez nutnosti zůstat přes noc jdeš do ordinace lékaře. Do nemocnice se jezdí jen při vážnějších případech.",
    ],
  },
  {
    question: "Kamarád viděl, jak si někdo vzal cizí kolo a odjel s ním. Kam to má nahlásit?",
    correctAnswer: "Policejní stanice",
    options: ["Hasičská stanice", "Nemocnice", "Radnice", "Policejní stanice"],
    emoji: "👮",
    hints: [
      "Nejdřív vyluč místa pro požár a pro nemoc.",
      "Nikde nehoří a nikdo není zraněný. Jde o krádež — a krádeže vyšetřují lidé v uniformě s odznakem. Kde pracují?",
    ],
    optionFeedback: {
      "Hasičská stanice": "Hasiči řeší požáry, krádeže ne.",
      Nemocnice: "Nemocnice léčí nemoci a zranění.",
      Radnice: "Radnice vyřizuje věci obce, krádeže nevyšetřuje.",
    },
    solutionSteps: [
      "Krádež se hlásí na policejní stanici. Hasičská stanice řeší požáry a nemocnice nemoci a zranění — sem krádež nepatří.",
    ],
  },
  {
    question: "Chceš si půjčit knihu a zároveň odeslat pohled babičce. Která dvě místa navštívíš?",
    correctAnswer: "Knihovnu a poštu",
    options: ["Obchod a školu", "Knihovnu a radnici", "Poštu a nádraží", "Knihovnu a poštu"],
    emoji: "🗺️",
    hints: [
      "Rozděl úkol na dvě části a pro každou najdi jedno místo.",
      "Na půjčení knihy potřebuješ místo s regály plnými knih a průkazkou. Na odeslání pohledu místo, kde koupíš známku. Najdi dvojici, kde sedí obě.",
    ],
    optionFeedback: {
      "Obchod a školu": "V obchodě ani ve škole se knihy nepůjčují a pohledy neodesílají.",
      "Knihovnu a radnici": "Knihovna sedí, ale pohled se neodesílá na radnici.",
      "Poštu a nádraží": "Pošta sedí, ale knihu ti na nádraží nepůjčí.",
    },
    solutionSteps: [
      "Knihu si půjčíš v knihovně a pohled odešleš na poště — potřebuješ tedy knihovnu a poštu.",
    ],
  },
  {
    question: "Chceš poslat dopis, ale nemáš známku. Kam půjdeš, abys vyřídil obojí najednou?",
    correctAnswer: "Pošta",
    options: ["Obchod", "Pošta", "Radnice", "Knihovna"],
    emoji: "📮",
    hints: [
      "Hledej jedno místo, kde koupíš známku i rovnou odešleš dopis.",
      "Obchod ani knihovna dopisy neodesílají a radnice se stará o obec. Hledej jediné místo, kde ti na přepážce prodají známku a rovnou si od tebe dopis vezmou.",
    ],
    optionFeedback: {
      Obchod: "V obchodě dopis neodešleš.",
      Radnice: "Radnice dopisy nedoručuje.",
      Knihovna: "V knihovně se půjčují knihy.",
    },
    solutionSteps: [
      "Na poště koupíš známku i odešleš dopis na jednom místě — nemusíš nikam jinam.",
    ],
  },
  {
    question: "Rodiče potřebují potvrdit bydliště a zeptat se na opravu silnice. Kam půjdou?",
    correctAnswer: "Radnice",
    options: ["Pošta", "Policejní stanice", "Radnice", "Škola"],
    emoji: "🏛️",
    hints: [
      "Hledej místo, kde se řeší úřední doklady i běžné záležitosti celé obce, jako jsou silnice.",
      "Pošta doručuje dopisy, policie hlídá bezpečnost a škola učí děti. Hledej budovu, kde úřaduje starosta a kde se rozhoduje o všem, co patří celé obci — i o silnicích.",
    ],
    optionFeedback: {
      Pošta: "Pošta doručuje zásilky, o silnicích nerozhoduje.",
      "Policejní stanice": "Policie chrání pořádek, bydliště ani opravy silnic neřeší.",
      Škola: "Ve škole se děti učí.",
    },
    solutionSteps: [
      "Potvrzení o bydlišti i dotaz na opravu silnice vyřídí rodiče na radnici — tam se řeší záležitosti obce.",
    ],
  },
  {
    question:
      "V neděli ráno slyšíš zvonit zvony a vidíš, jak lidé z okolí společně míří na mši. Kam jdou?",
    correctAnswer: "Kostel",
    options: ["Radnice", "Škola", "Knihovna", "Kostel"],
    emoji: "⛪",
    hints: [
      "Přemýšlej, která stavba má věž se zvony a kam se chodí na mši.",
      "Radnice, škola ani knihovna na mši nezvou a v neděli ráno bývají zavřené. Hledej stavbu s vysokou věží, oltářem a varhanami.",
    ],
    optionFeedback: {
      Radnice: "Radnice sice může mít věž s hodinami, ale na mši se tam nechodí.",
      Škola: "Ve škole se v neděli neučí a mše tam nebývá.",
      Knihovna: "V knihovně se půjčují knihy, mše tam není.",
    },
    solutionSteps: [
      "Zvony a mše patří ke kostelu — tam se lidé v neděli scházejí k bohoslužbě.",
    ],
  },
  {
    question:
      "Kamarád si myslí, že nové filmy promítají v knihovně. Kam se doopravdy chodí dívat na filmy na velkém plátně?",
    correctAnswer: "Kino",
    options: ["Kino", "Knihovna", "Škola", "Tělocvična"],
    emoji: "🎬",
    hints: [
      "V knihovně si knihy jen půjčují — filmy se tam nepromítají.",
      "Knihovna je místo s regály a průkazkou. Filmy na obrovském plátně se promítají ve tmavém sále s řadami sedaček, kam si koupíš vstupenku.",
    ],
    optionFeedback: {
      Knihovna: "V knihovně se knihy půjčují, filmy na plátně se tam nepromítají.",
      Škola: "Ve škole se učí.",
      Tělocvična: "V tělocvičně se cvičí.",
    },
    solutionSteps: [
      "Filmy na velkém plátně se promítají v kině, ne v knihovně — tam se jen půjčují knihy.",
    ],
  },
  {
    question:
      "Doma se dnes nevaří a chcete, aby vám hotové jídlo přinesla obsluha přímo ke stolu. Kam půjdete?",
    correctAnswer: "Restaurace",
    options: ["Obchod", "Restaurace", "Pekárna", "Škola"],
    emoji: "🍽️",
    hints: [
      "Hledej místo, kde jídlo dostaneš už hotové a nemusíš nic vařit.",
      "V obchodě bys koupil suroviny a musel je doma uvařit, v pekárně je jen pečivo. Hledej místo, kde si sedneš ke stolu a obsluha ti přinese teplý oběd.",
    ],
    optionFeedback: {
      Obchod: "V obchodě koupíš suroviny, ale uvařit si je musíš sám.",
      Pekárna: "V pekárně je pečivo, ne teplý oběd ke stolu.",
      Škola: "Ve škole je jídelna jen pro žáky, ne pro celou rodinu.",
    },
    solutionSteps: [
      "Hotové jídlo přinesené ke stolu dostanete v restauraci. V obchodě byste si museli suroviny koupit a uvařit sami.",
    ],
  },
  {
    question:
      "Chceš si koupit rohlíky upečené přímo ten den ráno, ne balené v sáčku jako v obchodě. Kam půjdeš?",
    correctAnswer: "Pekárna",
    options: ["Obchod", "Restaurace", "Pekárna", "Škola"],
    emoji: "🥐",
    hints: [
      "Hledej místo, kde pečivo přímo pečou a hned prodávají čerstvé.",
      "V obchodě bývá pečivo přivezené odjinud a často zabalené. Hledej místo, kde je vzadu pec, peče se tam od rána a hned za pultem se čerstvé rohlíky prodávají.",
    ],
    optionFeedback: {
      Obchod: "V obchodě bývá pečivo přivezené, ne upečené přímo tam.",
      Restaurace: "Restaurace vaří obědy, rohlíky na prodej nepeče.",
      Škola: "Ve škole se pečivo neprodává.",
    },
    solutionSteps: [
      "Čerstvé, ráno upečené rohlíky koupíš v pekárně, kde je pekař rovnou peče.",
    ],
  },
  {
    question: "Kniha, kterou chceš, je v knihovně půjčená. Chceš ji mít navždy. Kde ji koupíš?",
    correctAnswer: "Knihkupectví",
    options: ["Knihkupectví", "Knihovna", "Radnice", "Lékárna"],
    emoji: "📖",
    hints: [
      "Knihovna knihy jen půjčuje — ty ji ale chceš mít doma pořád.",
      "Hledej obchod, kde jsou v regálech nové knihy s cenovkou a u pokladny za ně zaplatíš. Jmenuje se podle toho, co prodává.",
    ],
    optionFeedback: {
      Knihovna: "V knihovně je kniha zrovna půjčená, a koupit se tam nedá.",
      Radnice: "Na radnici se knihy neprodávají.",
      Lékárna: "V lékárně jsou léky, ne knihy.",
    },
    solutionSteps: [
      "Knihu, kterou chceš mít navždy, koupíš v knihkupectví. Knihovna knihy jen půjčuje a zase je chce zpátky.",
    ],
  },
  {
    question: "Které z těchto míst s léčením nemoci nesouvisí?",
    correctAnswer: "Knihovna",
    options: ["Ordinace lékaře", "Lékárna", "Nemocnice", "Knihovna"],
    emoji: "🤒",
    hints: [
      "Tři místa souvisejí se zdravím, jedno vůbec ne.",
      "V ordinaci tě vyšetří, lékárna vydá lék a v nemocnici léčí vážné případy. Které místo s nemocí vůbec nesouvisí a navíc bys tam mohl nakazit ostatní?",
    ],
    optionFeedback: {
      "Ordinace lékaře": "K lékaři jdeš právě, když jsi nemocný.",
      Lékárna: "V lékárně se vydávají léky, a ty k léčení patří.",
      Nemocnice: "V nemocnici se léčí vážné nemoci a zranění.",
    },
    solutionSteps: [
      "Ordinace lékaře, lékárna i nemocnice pomáhají s léčením. Knihovna slouží k půjčování knih, s nemocí nesouvisí.",
    ],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const ORIENTACEVOBCI: TopicMetadata[] = [
  {
    id: "g2-prv-orientace-obec",
    rvpNodeId: "g2-prvouka-misto-kde-zijeme-obec-a-okoli-orientace-v-obci-vyznamna-mista-instituce",
    title: "Orientace v obci, významná místa, instituce",
    studentTitle: "Místa v obci",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Obec a okolí",
    briefDescription: "Poznáš důležitá místa v obci.",
    keywords: ["obec", "škola", "obchod", "pošta", "lékař", "knihovna"],
    goals: [
      "Poznat důležitá místa v obci.",
      "Vědět, kam jít pro co.",
      "Orientovat se v okolí.",
    ],
    boundaries: ["Pouze běžné instituce.", "Bez map."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Pro každou věc je v obci jiné místo.",
      steps: ["Přečti otázku.", "Kam za tím jdeme?"],
      commonMistake: "Záměna podobných míst (pošta vs. obchod).",
      example: "Pro chleba jdeme do obchodu, učíme se ve škole.",
    },
  },
];
