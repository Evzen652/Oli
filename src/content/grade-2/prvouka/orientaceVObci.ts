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
//   L3 = transfer (přiměřeně věku 7-8 let): kombinace dvou faktů
//        zároveň nebo rozlišení blízkých institucí podle závažnosti či
//        typu situace (lékař vs. nemocnice, hasiči vs. policie...).
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Co se dělá ve škole?",
    correctAnswer: "Děti se tam učí",
    options: [
      "Děti se tam učí",
      "Půjčují se tam knihy",
      "Cvičí se tam sportovci uvnitř budovy",
      "Modlí se tam lidé",
    ],
    emoji: "🏫",
    hints: ["Přemýšlej, kam chodíš každý všední den a co se tam naučíš."],
    solutionSteps: ["Ve škole se děti učí číst, psát a počítat — proto tam chodí každý den."],
  },
  {
    question: "Co se dělá v obchodě?",
    correctAnswer: "Nakupuje se tam jídlo a zboží",
    options: [
      "Nakupuje se tam jídlo a zboží",
      "Posílají se tam dopisy a balíky",
      "Cvičí se tam sportovci uvnitř budovy",
      "Modlí se tam lidé",
    ],
    emoji: "🏪",
    hints: ["Přemýšlej, kam jdete s rodiči, když doma dojde jídlo."],
    solutionSteps: ["V obchodě se nakupuje jídlo, pití a další věci na běžný den."],
  },
  {
    question: "Co se dělá na poště?",
    correctAnswer: "Posílají a vyzvedávají se tam dopisy a balíky",
    options: [
      "Posílají a vyzvedávají se tam dopisy a balíky",
      "Půjčují se tam knihy",
      "Vyřizují se tam záležitosti obce",
      "Nastupuje a vystupuje se tam z vlaku",
    ],
    emoji: "📮",
    hints: ["Přemýšlej, kam bys šel/šla, kdybys chtěl/a někomu poslat dopis."],
    solutionSteps: ["Na poště se odesílají a vyzvedávají dopisy a balíky."],
  },
  {
    question: "Co se dělá v knihovně?",
    correctAnswer: "Půjčují se tam knihy",
    options: [
      "Půjčují se tam knihy",
      "Posílají a vyzvedávají se tam dopisy a balíky",
      "Děti se tam učí",
      "Nakupuje se tam jídlo a zboží",
    ],
    emoji: "📚",
    hints: ["Přemýšlej, kam jít, když chceš knihu jen na chvíli a nechceš ji koupit."],
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
    hints: ["Přemýšlej, kam odvezou člověka, který je vážně nemocný nebo zraněný."],
    solutionSteps: ["V nemocnici léčí lékaři těžce nemocné nebo zraněné lidi, kteří tam často i zůstávají."],
  },
  {
    question: "Co se dělá v lékárně?",
    correctAnswer: "Vydávají se tam léky předepsané lékařem",
    options: [
      "Vydávají se tam léky předepsané lékařem",
      "Léčí se tam těžce nemocní lidé",
      "Nakupuje se tam jídlo a zboží",
      "Vyřizují se tam záležitosti obce",
    ],
    emoji: "💊",
    hints: ["Přemýšlej, kam jdeme, když nám lékař napíše recept na lék."],
    solutionSteps: ["V lékárně vydávají léky, které předepsal lékař."],
  },
  {
    question: "Co se dělá na hasičské stanici?",
    correctAnswer: "Připravují se tam hasiči na hašení požárů",
    options: [
      "Připravují se tam hasiči na hašení požárů",
      "Pracují tam policisté, kteří chrání pořádek",
      "Léčí se tam těžce nemocní lidé",
      "Vyřizují se tam záležitosti obce",
    ],
    emoji: "🚒",
    hints: ["Přemýšlej, odkud vyjíždí auto s hadicí, když někde hoří."],
    solutionSteps: ["Na hasičské stanici jsou připravení hasiči a hasičská auta pro případ požáru."],
  },
  {
    question: "Co se dělá na policejní stanici?",
    correctAnswer: "Pracují tam policisté, kteří chrání pořádek",
    options: [
      "Pracují tam policisté, kteří chrání pořádek",
      "Připravují se tam hasiči na hašení požárů",
      "Vyřizují se tam záležitosti obce",
      "Léčí se tam těžce nemocní lidé",
    ],
    emoji: "👮",
    hints: ["Přemýšlej, kde pracují lidé v uniformě, kteří hlídají bezpečnost."],
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
    hints: ["Přemýšlej, kam jdou rodiče, když potřebují vyřídit něco úředního pro celou obec."],
    solutionSteps: ["Na radnici úřaduje starosta a vyřizují se tam záležitosti obce."],
  },
  {
    question: "Co se dělá v kostele?",
    correctAnswer: "Lidé se tam modlí a scházejí na bohoslužby",
    options: [
      "Lidé se tam modlí a scházejí na bohoslužby",
      "Vyřizují se tam záležitosti obce",
      "Děti se tam učí",
      "Půjčují se tam knihy",
    ],
    emoji: "⛪",
    hints: ["Přemýšlej, kam chodí lidé, kteří věří v Boha, a jaká stavba má věž se zvony."],
    solutionSteps: ["V kostele se lidé modlí a scházejí na bohoslužby."],
  },
  {
    question: "Co se dělá na nádraží?",
    correctAnswer: "Nastupuje a vystupuje se tam z vlaku",
    options: [
      "Nastupuje a vystupuje se tam z vlaku",
      "Posílají a vyzvedávají se tam dopisy a balíky",
      "Děti si tam venku hrají",
      "Lidé se tam modlí a scházejí na bohoslužby",
    ],
    emoji: "🚉",
    hints: ["Přemýšlej, kam jdeš, když s rodinou jedete na výlet vlakem."],
    solutionSteps: ["Na nádraží vlaky přijíždějí a odjíždějí a cestující tam nastupují a vystupují."],
  },
  {
    question: "Co se dělá na hřišti?",
    correctAnswer: "Děti si tam venku hrají",
    options: [
      "Děti si tam venku hrají",
      "Cvičí se tam sportovci uvnitř budovy",
      "Naučíš se tam plavat",
      "Nastupuje a vystupuje se tam z vlaku",
    ],
    emoji: "🛝",
    hints: ["Přemýšlej, kam jdeš odpoledne ven na houpačky a prolézačky."],
    solutionSteps: ["Na hřišti si děti venku hrají, houpou se a lezou po prolézačkách."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Kam půjdeš, když si chceš ke snídani koupit chleba a mléko?",
    correctAnswer: "Obchod",
    options: ["Obchod", "Pekárna", "Lékárna", "Pošta"],
    emoji: "🏪",
    hints: ["Hledej místo, kde koupíš víc druhů potravin najednou, ne jen jeden druh pečiva."],
    solutionSteps: ["Chleba i mléko dohromady koupíš v obchodě — pekárna prodává jen pečivo."],
  },
  {
    question: "Kam půjdeš, když máš vysokou horečku a rodiče chtějí, aby tě vyšetřil lékař?",
    correctAnswer: "Lékař",
    options: ["Lékař", "Nemocnice", "Lékárna", "Škola"],
    emoji: "👩‍⚕️",
    hints: ["Hledej místo, kam jdeš na běžné vyšetření, když jsi nemocný, ale nezůstáváš tam přes noc."],
    solutionSteps: ["Na vyšetření kvůli horečce jdeš k lékaři — prohlédne tě a řekne, co dál."],
  },
  {
    question: "Kam půjdeš, když chceš poslat dopis babičce?",
    correctAnswer: "Pošta",
    options: ["Pošta", "Knihovna", "Radnice", "Nádraží"],
    emoji: "📮",
    hints: ["Hledej místo, které se stará o doručování dopisů a balíků."],
    solutionSteps: ["Dopis babičce pošleš na poště — tam dopisy přijímají a doručují dál."],
  },
  {
    question: "Kam půjdeš, když si chceš přečíst novou knihu, ale nechceš ji kupovat?",
    correctAnswer: "Knihovna",
    options: ["Knihovna", "Pošta", "Obchod", "Škola"],
    emoji: "📚",
    hints: ["Hledej místo, kde si knihu jen na čas půjčíš a pak ji vrátíš."],
    solutionSteps: ["Knihu si zdarma půjčíš v knihovně, koupit bys ji musel/a v obchodě s knihami."],
  },
  {
    question: "Kam půjdeš, když ti lékař předepsal lék a potřebuješ ho vyzvednout?",
    correctAnswer: "Lékárna",
    options: ["Lékárna", "Nemocnice", "Lékař", "Obchod"],
    emoji: "💊",
    hints: ["Hledej místo, kde na tebe čeká lék podle receptu od lékaře."],
    solutionSteps: ["Předepsaný lék vyzvedneš v lékárně."],
  },
  {
    question: "Odkud vyjedou hasiči, když v sousedním domě hoří?",
    correctAnswer: "Hasičská stanice",
    options: ["Hasičská stanice", "Policejní stanice", "Nemocnice", "Radnice"],
    emoji: "🚒",
    hints: ["Hledej místo, kde hasiči a jejich auta stále čekají připravená na výjezd."],
    solutionSteps: ["Hasiči vyjíždějí k požáru z hasičské stanice."],
  },
  {
    question: "Kam půjdeš nahlásit, že ti někdo ukradl kolo?",
    correctAnswer: "Policejní stanice",
    options: ["Policejní stanice", "Hasičská stanice", "Radnice", "Nemocnice"],
    emoji: "👮",
    hints: ["Hledej místo, kam se hlásí krádeže a jiné podobné případy."],
    solutionSteps: ["Krádež kola nahlásíš na policejní stanici — policisté ji budou vyšetřovat."],
  },
  {
    question: "Kam půjdou rodiče, když chtějí vyřídit nový občanský průkaz?",
    correctAnswer: "Radnice",
    options: ["Radnice", "Pošta", "Policejní stanice", "Škola"],
    emoji: "🏛️",
    hints: ["Hledej místo, kde se vyřizují úřední záležitosti obce."],
    solutionSteps: ["Úřední doklady jako občanský průkaz se vyřizují na radnici."],
  },
  {
    question: "Kam půjdeš v neděli, když se chceš zúčastnit bohoslužby?",
    correctAnswer: "Kostel",
    options: ["Kostel", "Radnice", "Škola", "Knihovna"],
    emoji: "⛪",
    hints: ["Hledej stavbu s věží a zvony, kam chodí lidé, kteří věří v Boha."],
    solutionSteps: ["Na bohoslužbu jdeš do kostela."],
  },
  {
    question: "Kam půjdeš, když se chceš naučit plavat?",
    correctAnswer: "Bazén",
    options: ["Bazén", "Hřiště", "Tělocvična", "Nemocnice"],
    emoji: "🏊",
    hints: ["Hledej místo s velkou nádrží plnou vody."],
    solutionSteps: ["Plavat se naučíš v bazénu — je tam voda a plavčík, který na děti dohlíží."],
  },
  {
    question: "Kam půjdeš, když chceš vidět nový film na velkém plátně?",
    correctAnswer: "Kino",
    options: ["Kino", "Škola", "Knihovna", "Restaurace"],
    emoji: "🎬",
    hints: ["Hledej sál s velkým plátnem, kde se promítají filmy."],
    solutionSteps: ["Nový film na velkém plátně uvidíš v kině."],
  },
  {
    question: "Kam půjdeš cvičit, když venku prší?",
    correctAnswer: "Tělocvična",
    options: ["Tělocvična", "Hřiště", "Bazén", "Kino"],
    emoji: "🤸",
    hints: ["Hledej místo pro sport, které je uvnitř budovy, takže tam déšť nevadí."],
    solutionSteps: ["Když prší, jde se cvičit do tělocvičny — je to sportoviště uvnitř budovy."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Lékař tě vyšetřil a napsal ti recept na lék proti kašli. Kam půjdeš, aby sis lék vyzvedl/a?",
    correctAnswer: "Lékárna",
    options: ["Lékárna", "Lékař", "Nemocnice", "Obchod"],
    emoji: "💊",
    hints: [
      "Recept je jen papír s předpisem — lék samotný dostaneš na jiném místě.",
      "Hledej místo, které lék vydává, ne to, které ho předepisuje.",
    ],
    solutionSteps: [
      "Recept napíše lékař, ale lék samotný vydá lékárna. U lékaře ani v nemocnici žádný lék rovnou nedostaneš.",
    ],
  },
  {
    question:
      "Kamarád spadl ze schodů, nemůže hýbat nohou a možná bude muset zůstat přes noc na pozorování. Kam ho rodiče odvezou?",
    correctAnswer: "Nemocnice",
    options: ["Nemocnice", "Lékárna", "Lékař", "Hasičská stanice"],
    emoji: "🏥",
    hints: [
      "Přemýšlej, které místo má lůžka pro pacienty, kteří tam musí zůstat déle.",
      "Vážné zranění s možností přespání patří na jiné místo než běžné vyšetření.",
    ],
    solutionSteps: [
      "Při vážném zranění s možností přespání jede kamarád do nemocnice — tam mají lůžka a starají se o pacienty i v noci.",
    ],
  },
  {
    question:
      "Bolí tě v krku a máš rýmu, ale nemusíš zůstat přes noc — stačí tě vyšetřit a poslat domů s receptem. Kam půjdeš?",
    correctAnswer: "Lékař",
    options: ["Lékař", "Nemocnice", "Lékárna", "Škola"],
    emoji: "👩‍⚕️",
    hints: [
      "Přemýšlej, kam se chodí na běžné vyšetření, když nejde o vážný případ s přespáním.",
      "Nemocnice je pro vážnější případy — tvůj problém stačí jen vyšetřit.",
    ],
    solutionSteps: [
      "Na běžné vyšetření bez nutnosti zůstat přes noc jdeš k lékaři. Do nemocnice se jezdí jen při vážnějších případech.",
    ],
  },
  {
    question:
      "Kamarád viděl souseda, jak si bez dovolení vzal cizí kolo a odjel s ním pryč. Nejde o požár ani o nemoc, ale o čin, který se má nahlásit. Kam se obrátí?",
    correctAnswer: "Policejní stanice",
    options: ["Policejní stanice", "Hasičská stanice", "Nemocnice", "Radnice"],
    emoji: "👮",
    hints: [
      "Nejdřív vylouči místa pro požár a pro nemoc — zbyde ti jen jedno vhodné místo.",
      "Hledej místo, kam se hlásí krádeže a podobné případy.",
    ],
    solutionSteps: [
      "Krádež se hlásí na policejní stanici. Hasičská stanice řeší požáry a nemocnice nemoci a zranění — sem krádež nepatří.",
    ],
  },
  {
    question:
      "Chceš si přečíst knihu o dinosaurech, ale rodiče nechtějí kupovat novou knihu z obchodu. Kam půjdeš, aby sis ji mohl/a přečíst zadarmo?",
    correctAnswer: "Knihovna",
    options: ["Knihovna", "Obchod", "Pošta", "Škola"],
    emoji: "📚",
    hints: [
      "Hledej místo, kde si knihu jen půjčíš a nemusíš za ni platit.",
      "V obchodě by sis knihu musel/a koupit — hledej jiné řešení.",
    ],
    solutionSteps: [
      "Knihu o dinosaurech si zdarma půjčíš v knihovně. V obchodě by sis ji musel/a koupit.",
    ],
  },
  {
    question:
      "Chceš poslat babičce dopis, ale nemáš doma známku a nevíš, kde si ji koupit. Kam půjdeš, abys vyřídil/a obojí najednou — koupil/a známku i odeslal/a dopis?",
    correctAnswer: "Pošta",
    options: ["Pošta", "Obchod", "Radnice", "Knihovna"],
    emoji: "📮",
    hints: [
      "Hledej jedno místo, kde koupíš známku i rovnou odešleš dopis.",
      "Není potřeba chodit na dvě různá místa — obě věci vyřídíš na jednom.",
    ],
    solutionSteps: [
      "Na poště koupíš známku i odešleš dopis na jednom místě — nemusíš nikam jinam.",
    ],
  },
  {
    question:
      "Rodiče potřebují potvrdit, že bydlíte v této obci, a zároveň se zeptat, kdy se opraví děravá silnice před domem. Kam se rodiče vydají vyřídit obě věci?",
    correctAnswer: "Radnice",
    options: ["Radnice", "Pošta", "Policejní stanice", "Škola"],
    emoji: "🏛️",
    hints: [
      "Hledej místo, kde se řeší úřední doklady i běžné záležitosti celé obce, jako jsou silnice.",
      "Obě věci spolu souvisí s obcí, ne s dopisy ani s bezpečností.",
    ],
    solutionSteps: [
      "Potvrzení o bydlišti i dotaz na opravu silnice vyřídí rodiče na radnici — tam se řeší záležitosti obce.",
    ],
  },
  {
    question:
      "V neděli ráno slyšíš zvonit zvony a vidíš, jak lidé z okolí společně míří na mši. Kam jdou?",
    correctAnswer: "Kostel",
    options: ["Kostel", "Radnice", "Škola", "Knihovna"],
    emoji: "⛪",
    hints: [
      "Přemýšlej, která stavba má věž se zvony a kam se chodí na mši.",
      "Zvony ani mše nepatří k žádné z ostatních nabízených možností.",
    ],
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
      "Hledej sál s velkým plátnem a sedadly určený přímo na filmy.",
    ],
    solutionSteps: [
      "Filmy na velkém plátně se promítají v kině, ne v knihovně — tam se jen půjčují knihy.",
    ],
  },
  {
    question:
      "Doma se dnes nevaří a chcete, aby vám hotové jídlo přinesla obsluha přímo ke stolu. Kam půjdete?",
    correctAnswer: "Restaurace",
    options: ["Restaurace", "Obchod", "Pekárna", "Škola"],
    emoji: "🍽️",
    hints: [
      "V obchodě by sis musel/a jídlo koupit syrové a doma ho uvařit — hledej místo, kde je jídlo hotové a přinesou ho.",
      "Hledej místo, kde obsluha přináší uvařené jídlo přímo ke stolu.",
    ],
    solutionSteps: [
      "Hotové jídlo přinesené ke stolu dostanete v restauraci. V obchodě byste si museli suroviny koupit a uvařit sami.",
    ],
  },
  {
    question:
      "Chceš si koupit rohlíky upečené přímo ten den ráno, ne balené v sáčku jako v obchodě. Kam půjdeš?",
    correctAnswer: "Pekárna",
    options: ["Pekárna", "Obchod", "Restaurace", "Škola"],
    emoji: "🥐",
    hints: [
      "Hledej místo, kde pečivo přímo pečou a hned prodávají čerstvé.",
      "V obchodě je pečivo často balené — hledej místo přímo od pekaře.",
    ],
    solutionSteps: [
      "Čerstvé, ráno upečené rohlíky koupíš v pekárně, kde je pekař rovnou peče.",
    ],
  },
  {
    question:
      "Chceš se naučit plavat, ale venku je zima a hřiště ani tělocvična vodu nemají. Kam půjdeš?",
    correctAnswer: "Bazén",
    options: ["Bazén", "Hřiště", "Tělocvična", "Nemocnice"],
    emoji: "🏊",
    hints: [
      "Vylouč místa, která vodu na plavání vůbec nemají.",
      "Hledej místo s velkou nádrží vody, kde je i v zimě teplo.",
    ],
    solutionSteps: [
      "Plavat se naučíš v bazénu — na hřišti ani v tělocvičně voda na plavání není.",
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
