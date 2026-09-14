/**
 * Dějepis 6. ročník — Stěhování národů a pád Západořímské říše (476) (select_one).
 *
 * Faktický vzor (reckoPerskeValkyPeloponeskaValka): pevné banky úloh, každá
 * s vlastní malou i velkou nápovědou, vysvětlením PROČ a optionFeedback.
 * Generátor vrací celou banku zamíchanou, takže každá úroveň dá vždy ≥ 12
 * různých úloh (deterministicky, žádné losování a doufání).
 *
 * Chybový model — každý distraktor je jeden typický omyl:
 *  1. záměna letopočtů 395 (rozdělení) a 476 (zánik západní části);
 *  2. „roku 476 zanikla celá říše i s Konstantinopolí";
 *  3. záměna aktérů: Hunové (spouštěč z východu) × Germáni (stěhovali se do říše),
 *     Odoakar (sesadil císaře) × Attila (vůdce Hunů, Řím nedobyl);
 *  4. záměna příčiny a důsledku, anachronismus (Punské války); u počítání
 *     století jen počet stovek, u rozdílu let sčítání, zapomenuté půjčování
 *     a zbytečné „− 1 za rok 0".
 *
 *  • L1 — zapamatování: jeden fakt (rok, jméno, pojem).
 *  • L2 — použití: století a rozdíl let z letopočtů, pořadí událostí,
 *    událost → co z ní přímo plyne, rok → období dějin.
 *  • L3 — analýza: popis situace → příčina úpadku, kontrafakt a inverze,
 *    posouzení výroku historika, příčina × důsledek.
 *
 * Fakta jen ze shody učebnic 6. ročníku. Vpád Hunů je vždy „kolem roku 375",
 * plenění Říma Vandaly jen „v 5. století", konec Byzance (1453) jen ve vysvětlení.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { pickN, buildChoiceTask as choice } from "./_shared";

interface Uloha {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
  steps?: string[];
}

const build = (u: Uloha): PracticeTask =>
  choice(u.q, u.key, u.d.map(([value, why]) => ({ value, why })), {
    hints: u.hints,
    explanation: u.explanation,
    solutionSteps: u.steps,
  });

// ── L1 — zapamatování ──────────────────────────────────────────────────────
const L1: Uloha[] = [
  {
    q: "Kterého roku zanikla Západořímská říše?",
    key: "476",
    d: [
      ["395", `Roku 395 se říše rozdělila na dvě části. Západní část zanikla až o ${pad(81, "ROK")} později.`],
      ["375", "Kolem roku 375 vpadli do Evropy Hunové. Tím stěhování národů teprve začalo, říše trvala ještě sto let."],
      ["1453", "Roku 1453 padla Konstantinopol, tedy konec Východořímské (Byzantské) říše. Západ zanikl skoro o tisíc let dřív."],
    ],
    hints: [
      "Hledáš rok, kdy germánský vůdce sesadil posledního císaře na západě. Rozdělení říše to ještě nebylo.",
      "Rozdělení říše je starší a stalo se ještě ve 4. století. Rok, kdy padla Konstantinopol, patří až do středověku. Vyber rok z druhé poloviny 5. století.",
    ],
    explanation: "Roku 476 sesadil germánský vůdce Odoakar posledního západořímského císaře Romula Augustula. Tím Západořímská říše zanikla. Rozdělení říše bylo roku 395, vpád Hunů kolem roku 375 a Konstantinopol padla až roku 1453.",
  },
  {
    q: "Kterého roku se římská říše rozdělila na západní a východní část?",
    key: "395",
    d: [
      ["476", `Roku 476 západní část zanikla. Rozdělila se o ${pad(81, "ROK")} dřív.`],
      ["455", "V 5. století vyplenili Řím Vandalové. Říše byla v té době už rozdělená."],
      ["375", "Kolem roku 375 vpadli do Evropy Hunové. Rozdělení přišlo až o dvacet let později."],
    ],
    hints: [
      "Říše se rozdělila po smrti císaře Theodosia I. Stalo se to ještě ve 4. století.",
      "Zánik západní části i plenění Říma Vandaly patří do 5. století, takže je vyřaď. Vpád Hunů byl o dvacet let dřív než rozdělení. Vyber pozdější ze dvou letopočtů 4. století.",
    ],
    explanation: "Po smrti císaře Theodosia I. roku 395 se říše trvale rozdělila na západní a východní část s Konstantinopolí. Zanikla jen západní část, a to roku 476.",
  },
  {
    q: "Kteří kočovníci vpadli z východu do Evropy a dali tím do pohybu stěhování národů?",
    key: "Hunové",
    d: [
      ["Germáni", "Germáni se dali do pohybu až kvůli útoku z východu. Utíkali před ním na území říše."],
      ["Slované", "Slované se do střední Evropy stěhovali až později, asi v 6. století. Stěhování národů nezačali."],
      ["Keltové", "Keltové žili v Evropě dávno předtím a v 5. století už nebyli samostatnou silou."],
    ],
    hints: [
      "Hledej kočovné jezdce, kteří přišli z asijských stepí. Ostatní kmeny se před nimi daly na útěk.",
      "Kmeny, které utíkaly na území říše, to nebyly, ty byly pronásledované. Slované přišli až později a Keltové žili v Evropě dávno. Hledej národ, jehož nejslavnějším vůdcem byl Attila.",
    ],
    explanation: "Kolem roku 375 vpadli do Evropy kočovní Hunové z asijských stepí. Porazili germánské kmeny a ty se na útěku hnaly přes hranice římské říše. Tak začalo stěhování národů.",
  },
  {
    q: "Který germánský vůdce sesadil posledního západořímského císaře?",
    key: "Odoakar",
    d: [
      ["Attila", "Attila byl vůdce Hunů a zemřel dřív, než západní říše zanikla. Císaře nesesadil."],
      ["Theodosius I.", "Theodosius I. byl římský císař. Po jeho smrti roku 395 se říše rozdělila."],
      ["Romulus Augustulus", "Romulus Augustulus byl ten sesazený císař, ne ten, kdo ho sesadil."],
    ],
    hints: [
      "Hledej velitele germánských vojáků v Itálii, ne vůdce kočovníků ani římského panovníka.",
      "Vůdce Hunů to nebyl, ten zemřel dřív. Oba zbývající Římané byli císaři. Hledej Germána, který potom vládl Itálii jako král.",
    ],
    explanation: "Roku 476 sesadil germánský vůdce Odoakar mladého císaře Romula Augustula a nového císaře na západě už nedosadil. Attila vedl Huny, Theodosius I. byl císař, po jehož smrti se říše rozdělila.",
  },
  {
    q: "Jak se jmenoval poslední západořímský císař?",
    key: "Romulus Augustulus",
    d: [
      ["Octavianus Augustus", "Octavianus Augustus byl naopak první římský císař. Podobné jméno ale mate."],
      ["Theodosius I.", "Theodosius I. vládl celé říši naposledy před rozdělením roku 395, ne až na konci."],
      ["Odoakar", "Odoakar byl germánský vůdce, který posledního císaře sesadil. Sám císařem nebyl."],
    ],
    hints: [
      "Byl to ještě chlapec. Jeho jméno připomíná zakladatele Říma i prvního císaře.",
      "Germánský vůdce císařem nebyl a první císař žil o skoro pět set let dřív. Císař, po jehož smrti se říše rozdělila, také nebyl poslední. Jméno posledního je zdrobnělina.",
    ],
    explanation: "Posledním západořímským císařem byl chlapec Romulus Augustulus. Jeho jméno („malý Augustus“) připomíná zakladatele Říma Romula i prvního císaře Augusta. Roku 476 ho sesadil Odoakar.",
  },
  {
    q: "Které město bylo hlavním městem východní části římské říše?",
    key: "Konstantinopol",
    d: [
      ["Řím", "Řím patřil k západní části. Východ měl vlastní hlavní město."],
      ["Athény", "Athény byly slavné řecké město, ale sídlem císaře východní části nebyly."],
      ["Alexandrie", "Alexandrie byla velké a bohaté město v Egyptě, ale císař tam nesídlil."],
    ],
    hints: [
      "Leží na úžině Bospor mezi Evropou a Asií, dnes je to Istanbul.",
      "Řím patřil k západu. Athény a Alexandrie byly velká města, ale císař v nich nesídlil. Hledej město, které zůstalo sídlem císaře na východě ještě tisíc let po roce 476.",
    ],
    explanation: "Hlavním městem východní části byla Konstantinopol, kterou založil císař Konstantin (dnešní Istanbul). Řím byl centrem západu. Východořímská říše s Konstantinopolí trvala ještě téměř tisíc let po roce 476.",
  },
  {
    q: "Jak se později začalo říkat Východořímské říši?",
    key: "Byzantská říše",
    d: [
      ["Svatá říše římská", "Svatá říše římská vznikla až ve středověku na západě, v německých zemích."],
      ["Franská říše", "Franská říše byla germánské království na západě, které vzniklo po pádu západní části."],
      ["Perská říše", "Perská říše byla starší soused a nepřítel Říma, ne jeho východní část."],
    ],
    hints: [
      "Tak se říká řecky mluvícímu východu říše, který přečkal pád západu a trval až do roku 1453.",
      "Franská i Svatá říše římská vznikly na západě a Persie byla cizí stát, se kterým Řím válčil. Hledej název, který dostala sama východní část říše.",
    ],
    explanation: "Východořímské říši se později říká Byzantská říše podle řeckého města Byzantion, na jehož místě stála Konstantinopol. Franská a Svatá říše římská vznikly na západě, Persie byla samostatná říše.",
  },
  {
    q: "Kolem kterého roku vpadli Hunové do Evropy?",
    key: "375",
    d: [
      ["395", "Roku 395 se římská říše rozdělila. Hunové byli v Evropě už asi dvacet let."],
      ["476", "Roku 476 zanikla Západořímská říše. Stěhování národů tehdy dávno probíhalo, začalo asi o sto let dřív."],
      ["455", "V 5. století vyplenili Řím Vandalové. Hunové přišli o víc než sedmdesát let dřív."],
    ],
    hints: [
      "Vpád Hunů stojí na úplném začátku stěhování národů. Musí být dřív než rozdělení říše.",
      "Oba letopočty z 5. století vyřaď, to už stěhování národů dávno probíhalo. Rozdělení říše také nebylo první. Vyber nejstarší z nabídnutých letopočtů.",
    ],
    explanation: "Hunové vpadli do Evropy kolem roku 375 a vytlačili germánské kmeny na území říše. Teprve potom přišlo rozdělení říše (395), plenění Říma Vandaly (v 5. století) a zánik západní části (476).",
  },
  {
    q: "Jak se jmenoval vůdce Hunů, který v 5. století pustošil římské území?",
    key: "Attila",
    d: [
      ["Odoakar", "Odoakar byl germánský vůdce, který roku 476 sesadil posledního císaře. Huny nevedl."],
      ["Hannibal", "Hannibal byl kartáginský vojevůdce z Punských válek, o víc než šest set let dřív."],
      ["Theodosius I.", "Theodosius I. byl římský císař. Proti nepřátelům Říma naopak bojoval."],
    ],
    hints: [
      "Hledej vůdce kočovníků z východu, ne Germána ani Římana.",
      "Germán sesadil císaře, Říman byl sám císař a Kartáginec žil o staletí dřív. Zbývá obávaný jezdec, kterému se později začalo říkat „bič boží“.",
    ],
    explanation: "Hunům vládl v 5. století Attila, kterému se později začalo říkat „bič boží“. Pustošil římské území, ale Řím nedobyl a zemřel dřív, než západní říše zanikla. Odoakar byl Germán a Hannibal žil v době Punských válek.",
  },
  {
    q: "Koho Římané nazývali barbary?",
    key: "lidi, kteří nemluvili latinsky ani řecky",
    d: [
      ["lidi, kteří se chovali krutě a divoce", "Tak se slovo „barbar“ používá dnes. Římanům šlo hlavně o jazyk a kulturu."],
      ["lidi, kteří nevěřili v římské a řecké bohy", "Víra rozhodující nebyla. Za barbary považovali cizince podle řeči a zvyků."],
      ["lidi, kteří byli v Římě otroky a sluhy","Otroci mohli pocházet odkudkoli, i z Řecka. Barbar byl cizinec mimo řecko-římský svět."],
    ],
    hints: [
      "Slovo pochází z řečtiny a napodobuje nesrozumitelné „bar-bar“. Čím se tedy cizinec lišil?",
      "Dnešní význam „surovec“ vznikl až později a víra ani postavení otroka rozhodující nebyly. Mysli na to, co Římané slyšeli, když cizinci mluvili.",
    ],
    explanation: "Slovo barbar pochází z řečtiny a napodobuje nesrozumitelnou řeč. Barbaři byli pro Řeky a Římany cizinci, kteří nemluvili řecky ani latinsky a žili mimo jejich svět, třeba Germáni nebo Hunové. Význam „surovec“ je až pozdější.",
  },
  {
    q: "Který kmen v 5. století vyplenil Řím a podle jeho jména dnes nazýváme ničení cizího majetku?",
    key: "Vandalové",
    d: [
      ["Hunové", "Hunové pod Attilou pustošili říši, ale Řím nevyplenili a nic se po nich nejmenuje."],
      ["Galové", "Galové (Keltové) Řím opravdu vyplenili, ale už ve 4. století př. n. l., o osm set let dřív."],
      ["Slované", "Slované do Itálie nepřišli a Řím neplenili. Do střední Evropy dorazili až v 6. století."],
    ],
    hints: [
      "Jde o germánský kmen, který se usadil v severní Africe a odtamtud připlul do Itálie.",
      "Kočovníci z východu Řím nedobyli, Slované do Itálie nedošli a Galové ho plenili o staletí dřív. Mysli na slovo, kterým se dnes říká ničení laviček nebo sprejování zdí.",
    ],
    explanation: "V 5. století připluli germánští Vandalové ze severní Afriky a vyplenili Řím. Podle nich se ničení cizího majetku říká vandalismus. Galové plenili Řím mnohem dřív a Hunové ani Slované Řím nevyplenili.",
  },
  {
    q: "Po smrti kterého císaře se římská říše trvale rozdělila na dvě části?",
    key: "Theodosius I.",
    d: [
      ["Konstantin Veliký", "Konstantin Veliký založil Konstantinopol, ale vládl dřív. Po jeho smrti se říše trvale nerozdělila."],
      ["Octavianus Augustus", "Octavianus Augustus byl první císař. Říše se rozdělila o víc než čtyři sta let později."],
      ["Romulus Augustulus", "Romulus Augustulus byl poslední císař západu. V té době už říše rozdělená byla."],
    ],
    hints: [
      "Hledej císaře, který jako poslední vládl celé říši najednou, na konci 4. století.",
      "První císař žil na přelomu letopočtu a zakladatel Konstantinopole vládl dřív. Poslední císař západu už vládl jen jedné části. Po smrti hledaného císaře říši převzali jeho dva synové.",
    ],
    explanation: "Theodosius I. byl posledním císařem, který vládl celé říši. Po jeho smrti roku 395 ji převzali jeho dva synové: Honorius vládl západu, Arcadius východu. Od té doby už se říše nespojila.",
  },
  {
    q: "Odkud přišli Hunové, kteří rozpoutali stěhování národů?",
    key: "z asijských stepí",
    d: [
      ["ze severní Evropy", "Ze severu Evropy pocházeli Germáni. Hunové přišli z východu."],
      ["ze severní Afriky", "V severní Africe se později usadili Vandalové. Hunové přišli z opačné strany."],
      ["z Arabského poloostrova", "Z Arábie přišli až o staletí později Arabové. Hunové přišli z jiné oblasti."],
    ],
    hints: [
      "Hunové byli kočovní jezdci. Kde jsou rozlehlé travnaté pláně vhodné pro koně?",
      "Z Afriky ani z Arábie nepřišli a sever Evropy je pravlast Germánů. Vzpomeň si, ze které světové strany na říši tlačili.",
    ],
    explanation: "Hunové byli kočovníci z asijských stepí, kteří kolem roku 375 vpadli z východu do Evropy. Germáni pocházeli ze severu Evropy a Vandalové se až později usadili v severní Africe.",
  },
  {
    q: "Jak se nazývá velký přesun kmenů v Evropě ve 4. až 6. století?",
    key: "stěhování národů",
    d: [
      ["řecká kolonizace", "Řecká kolonizace znamenala zakládání osad Řeky u Středozemního moře, o víc než tisíc let dřív."],
      ["římská kolonizace", "Římská kolonizace znamenala zakládání římských osad v dobytých provinciích. Pohyb šel z Říma ven, ne od kmenů do říše."],
      ["vnitřní kolonizace", "Vnitřní kolonizace je osidlování lesů a pustin ve vrcholném středověku, ve 12. a 13. století."],
    ],
    hints: [
      "Celé kmeny i s rodinami opouštěly svá území. Jak se takovému pohybu obyvatel říká?",
      "Kolonizace znamená, že stát nebo národ zakládá nové osady: řecká a římská patří do starověku, vnitřní až do vrcholného středověku. Tady ale na útěku odcházely celé kmeny přes hranice říše, ve 4. až 6. století.",
    ],
    explanation: "Přesunu germánských, hunských a později slovanských kmenů ve 4. až 6. století se říká stěhování národů. Začal vpádem Hunů kolem roku 375 a přispěl k zániku Západořímské říše.",
  },
  {
    q: "Které kmeny se na útěku před Huny začaly hromadně stěhovat na území římské říše?",
    key: "germánské kmeny",
    d: [
      ["slovanské kmeny", "Slované se dali do pohybu až později, asi v 6. století, a na útěku před Huny do říše nepronikali."],
      ["keltské kmeny", "Keltové žili v západní Evropě dávno a mnozí z nich byli tou dobou už pod římskou vládou."],
      ["arabské kmeny", "Arabové žili daleko na jihovýchodě a do Evropy pronikli až o staletí později."],
    ],
    hints: [
      "Tyto kmeny sídlily za Rýnem a Dunajem, přímo za severní hranicí říše.",
      "Keltové už z velké části žili pod vládou Říma a Slované ani Arabové tehdy k římské hranici nedošli. Patřili k nim Gótové, Vandalové i Frankové.",
    ],
    explanation: "Hunové porazili germánské kmeny (například Góty) a ty se na útěku hnaly přes Dunaj a Rýn na území říše. Keltové z velké části žili pod římskou vládou, Slované a Arabové přišli až později.",
  },
];

// ── L2 — použití ───────────────────────────────────────────────────────────
const stoleti = (rok: number) => Math.floor((rok - 1) / 100) + 1;

function stoletiUloha(q: string, rok: number, souvislost: string): Uloha {
  const c = stoleti(rok);
  const stovky = Math.floor(rok / 100);
  return {
    q,
    key: `${c}. století`,
    d: [
      [`${stovky}. století`, `Vzal jsi jen počet celých stovek (${stovky}). Století je o jedno vyšší.`],
      [`${c + 1}. století`, `To je o jedno století víc. ${c}. století trvá od roku ${(c - 1) * 100 + 1} do roku ${c * 100}.`],
      [`${c}. století př. n. l.`, `Spletl sis éru. ${souvislost} se stalo v našem letopočtu, ne před ním.`],
    ],
    hints: [
      `Rok ${rok}: kolik celých stovek obsahuje? Z toho počtu pak století určíš.`,
      `Století je vždy o jedno vyšší než počet celých stovek, protože první století trvalo od roku 1 do roku 100. Spočítej stovky v roce ${rok} a přičti jedničku. Pozor také na éru.`,
    ],
    explanation: `Rok ${rok} obsahuje ${pad(stovky, "STOVKA")}. Století je o jedno vyšší, proto ${c}. století (trvá od roku ${(c - 1) * 100 + 1} do roku ${c * 100}). ${souvislost} se stalo v našem letopočtu.`,
    steps: [`V roce ${rok} jsou ${pad(stovky, "STOVKA")}.`, `${stovky} + 1 = ${c}. století.`],
  };
}

/** `chyby` = dva další distraktory [počet let, zpětná vazba]; první je vždy sčítání. */
function rozdilUloha(q: string, pozdejsi: number, drivejsi: number, chyby: [number, string][]): Uloha {
  const ans = pozdejsi - drivejsi;
  const d: [string, string][] = [
    [pad(pozdejsi + drivejsi, "ROK"), `Sčítal jsi. Obě události jsou v našem letopočtu, takže se odčítá: ${pozdejsi} − ${drivejsi}.`],
    ...chyby.map(([n, why]): [string, string] => [pad(n, "ROK"), why]),
  ];
  return {
    q,
    key: pad(ans, "ROK"),
    d,
    hints: [
      `Roky ${drivejsi} a ${pozdejsi} jsou oba v našem letopočtu. Máš je sčítat, nebo odčítat?`,
      `Ve stejné éře se doba mezi událostmi počítá odečtením: od roku ${pozdejsi} odečti rok ${drivejsi}. Rok 0 tu nehraje roli, protože se nepřechází přes přelom letopočtu. Počítej pozorně pod sebou a hlídej půjčování.`,
    ],
    explanation: `Obě události jsou v našem letopočtu, proto se roky odečítají: ${pozdejsi} − ${drivejsi} = ${ans}. Mezi nimi tedy uplynulo ${pad(ans, "ROK")}.`,
    steps: [`Pozdější rok minus dřívější: ${pozdejsi} − ${drivejsi}.`, `${pozdejsi} − ${drivejsi} = ${ans}.`],
  };
}

const L2: Uloha[] = [
  stoletiUloha("Římská říše se rozdělila roku 395. Ve kterém století to bylo?", 395, "Rozdělení říše"),
  stoletiUloha("Odoakar sesadil posledního západořímského císaře roku 476. Ve kterém století to bylo?", 476, "Sesazení císaře"),
  stoletiUloha("Hunové vpadli do Evropy kolem roku 375. Ve kterém století to bylo?", 375, "Vpád Hunů"),
  rozdilUloha(
    "Říše se rozdělila roku 395 a její západní část zanikla roku 476. Kolik let uplynulo mezi těmito událostmi?",
    476, 395, [
      [80, "Odečetl jsi jeden rok navíc, jako by šlo o přelom letopočtu. Tady jsou oba roky n. l., rok 0 nehraje roli."],
      [181, "Při odčítání pod sebou jsi zapomněl, že sis půjčil desítku, a nesnížil jsi stovky."],
    ],
  ),
  rozdilUloha(
    "Hunové vpadli do Evropy kolem roku 375 a Západořímská říše zanikla roku 476. Kolik let uplynulo, když počítáš s rokem 375?",
    476, 375, [
      [111, "Spletl ses v desítkách: 7 − 7 = 0, ne 1. Počítej pod sebou po řádech."],
      [81, "Použil jsi rok rozdělení říše (395) místo roku, kdy vpadli Hunové."],
    ],
  ),
  rozdilUloha(
    "Hunové vpadli do Evropy kolem roku 375 a říše se rozdělila roku 395. Kolik let uplynulo, když počítáš s rokem 375?",
    395, 375, [
      [30, "Spletl ses v desítkách: 9 − 7 = 2, ne 3. Počítej pod sebou po řádech."],
      [101, "Použil jsi rok zániku západní části (476) místo roku rozdělení říše."],
    ],
  ),
  {
    q: "Která z těchto událostí proběhla nejdříve?",
    key: "Hunové vpadli z východu do Evropy",
    d: [
      ["Římská říše se rozdělila na dvě části", "Rozdělení přišlo roku 395, asi dvacet let po vpádu Hunů."],
      ["Vandalové vyplenili město Řím", "Vandalové plenili Řím až v 5. století, kdy stěhování národů dávno probíhalo."],
      ["Odoakar sesadil posledního císaře", "Sesazení posledního císaře roku 476 je z nabídnutých událostí naopak nejpozdější."],
    ],
    hints: [
      "Přiřaď si ke každé události aspoň přibližný letopočet nebo století. Která stojí na začátku stěhování národů?",
      "Dvě z událostí patří do 5. století, ty vyřaď. Zbývají dvě ze 4. století: rozdělení říše po smrti Theodosia I. a událost, která dala kmeny do pohybu. Která z nich byla dřív?",
    ],
    explanation: "Pořadí je: vpád Hunů (kolem 375) → rozdělení říše (395) → Vandalové vyplenili Řím (5. století) → Odoakar sesadil posledního císaře (476). Nejdříve tedy vpadli Hunové.",
  },
  {
    q: "Která z těchto událostí proběhla jako poslední?",
    key: "Vandalové vyplenili město Řím",
    d: [
      ["Hunové vpadli z východu do Evropy", "Vpád Hunů kolem roku 375 stojí na úplném začátku stěhování národů."],
      ["Římská říše se rozdělila na dvě části", "Rozdělení roku 395 bylo dřív, Vandalové plenili Řím až v 5. století."],
      ["Konstantin povolil křesťanství", "Konstantin povolil křesťanství už roku 313, tedy nejdříve ze všech."],
    ],
    hints: [
      "Přiřaď si ke každé události letopočet nebo aspoň století. Hledáš tu nejpozdější.",
      "Povolení křesťanství, vpád Hunů i rozdělení říše patří do 4. století. Jen jedna událost se stala až v 5. století.",
    ],
    explanation: "Pořadí je: Konstantin povolil křesťanství (313) → vpád Hunů (kolem 375) → rozdělení říše (395) → Vandalové vyplenili Řím (5. století). Jako poslední tedy Vandalové vyplenili Řím.",
  },
  {
    q: "Co se stalo nejdříve po vpádu Hunů do Evropy?",
    key: "Římská říše se rozdělila na dvě části",
    d: [
      ["Konstantin povolil křesťanství", "Konstantin povolil křesťanství roku 313, tedy ještě před vpádem Hunů, ne po něm."],
      ["Vandalové vyplenili město Řím", "Vandalové plenili Řím až v 5. století. Mezi tím se stalo ještě něco jiného."],
      ["Odoakar sesadil posledního císaře", "Sesazení císaře roku 476 přišlo až sto let po vpádu Hunů."],
    ],
    hints: [
      "Nejdřív vyřaď událost, která byla ještě před vpádem Hunů. Ze zbylých hledej tu, která je vpádu nejblíž.",
      "Povolení křesťanství patří do začátku 4. století, Hunové přišli až v jeho poslední čtvrtině. Plenění Říma a sesazení císaře patří do 5. století. Co se stalo ještě na konci 4. století?",
    ],
    explanation: "Hunové vpadli do Evropy kolem roku 375. Hned potom, roku 395, se říše rozdělila. Vandalové plenili Řím až v 5. století a Odoakar sesadil císaře roku 476. Křesťanství povolil Konstantin už roku 313.",
  },
  {
    q: "Která událost přišla až po sesazení posledního západořímského císaře?",
    key: "Odoakar vládl Itálii jako germánský král",
    d: [
      ["Římská říše se rozdělila na dvě části", `Rozdělení roku 395 bylo o ${pad(81, "ROK")} dřív než sesazení císaře.`],
      ["Vandalové vyplenili město Řím", "Vandalové plenili Řím ještě za existence západní říše, v 5. století před rokem 476."],
      ["Hunové vpadli z východu do Evropy", "Hunové vpadli kolem roku 375, sto let před sesazením císaře."],
    ],
    hints: [
      "Sesazení posledního císaře je rok 476. Která z událostí nemohla nastat, dokud západní říše existovala?",
      "Vpád Hunů i rozdělení říše patří do 4. století a plenění Říma se stalo, když na západě ještě vládl císař. Která událost předpokládá, že v Itálii už žádný římský císař nebyl?",
    ],
    explanation: "Po roce 476 už na západě nevládl římský císař. Itálii ovládl Odoakar a vládl jí jako germánský král. Vpád Hunů (kolem 375), rozdělení říše (395) i plenění Říma Vandaly (5. století) byly dřív.",
  },
  {
    q: "Co udělaly germánské kmeny, když na ně z východu zaútočili Hunové?",
    key: "Utíkaly a pronikaly přes hranice na území říše",
    d: [
      ["Spojily se s Římany a Huny společně porazily", "Germáni a Římané Huny hned neporazili. Kmeny se naopak hrnuly do říše, která je nedokázala zastavit."],
      ["Odtáhly na sever a od říše se vzdálily", "Na severu už Germáni žili. Před útokem z východu se hnuly na jih a západ, přímo do říše."],
      ["Spojily se s Huny a společně táhly na Persii", "Na Persii Germáni netáhli. Před Huny se velké skupiny Germánů hnaly přes Dunaj a Rýn do říše."],
    ],
    hints: [
      "Útok přišel z východu a za Germány ležela na jihu a západě bohatá říše. Kam se asi dali?",
      "Právě tahle reakce Germánů je důvod, proč se celé období jmenuje stěhování národů. Pomysli, co to znamenalo pro římské hranice na Dunaji a Rýně.",
    ],
    explanation: "Hunové z východu porazili germánské kmeny a ty se na útěku stěhovaly na jih a západ. Pronikaly přes Dunaj a Rýn na území říše, která je nedokázala zastavit. Tak se rozběhlo stěhování národů.",
  },
  {
    q: "Co přímo plynulo z rozdělení říše roku 395?",
    key: "Západ i východ měly každý svého císaře",
    d: [
      ["Obě části ještě téhož roku zanikly", "Rozdělením žádná část nezanikla. Západ trval do roku 476, východ ještě mnohem déle."],
      ["Celou říši ovládl jeden císař v Římě", "Je to naopak: po rozdělení už říši neovládal jeden císař, ale dva."],
      ["Hlavním městem obou částí zůstal Řím", "Východ měl vlastní hlavní město, Konstantinopol. Západní císař sídlil v Miláně, později v Ravenně."],
    ],
    hints: [
      "Rozdělení znamená, že z jedné říše vznikly dvě části. Co potřebuje každá část, aby se dala řídit?",
      "Po smrti Theodosia I. převzali vládu jeho dva synové. Ověř si také, jestli po roce 395 měly obě části stejné hlavní město.",
    ],
    explanation: "Theodosius I. rozdělil říši mezi dva syny. Od roku 395 měl západ svého císaře (sídlil v Miláně, později v Ravenně) a východ svého císaře v Konstantinopoli. Obě části dál existovaly, západ do roku 476.",
  },
  {
    q: "Co se změnilo v Itálii poté, co Odoakar sesadil Romula Augustula?",
    key: "Na západě už nevládl žádný římský císař",
    d: [
      ["Na západě začal vládnout hunský vůdce Attila", "Attila zemřel dřív a Itálii nikdy neovládl. Po roce 476 vládl Itálii germánský vůdce."],
      ["Na západě hned zvolili jiného římského císaře", "Nového císaře Odoakar nedosadil. Právě proto se rok 476 bere jako konec západní říše."],
      ["Na západě začala vládnout Konstantinopol", "Východní císař byl daleko a skutečnou moc v Itálii měl germánský vůdce."],
    ],
    hints: [
      "Sesazený chlapec byl posledním císařem. Co znamená slovo „poslední“ pro další vládu na západě?",
      "Vůdce Hunů v té době už nežil a východní císař Itálii přímo neřídil. Odoakar vládl sám, ale jako král, ne jako císař.",
    ],
    explanation: "Odoakar sesadil Romula Augustula a nového císaře už nedosadil. Na západě tak skončila vláda římských císařů a Západořímská říše zanikla. Itálii vládl Odoakar jako germánský král.",
  },
  {
    q: "Kterou dobu rok 476 podle běžného dělení dějin ukončuje a kterou začíná?",
    key: "Končí starověk, začíná středověk",
    d: [
      ["Končí pravěk, začíná starověk", "Pravěk skončil vznikem písma a prvních států, tisíce let před rokem 476."],
      ["Končí středověk, začíná novověk", "Hranice středověku a novověku leží až kolem roku 1500 (objevení Ameriky)."],
      ["Končí starověk, začíná novověk", "Po starověku nepřichází rovnou novověk. Mezi nimi je celý středověk."],
    ],
    hints: [
      "Seřaď si hlavní období dějin: pravěk, starověk, středověk, novověk. Kam patří římská říše?",
      "Římská říše patří do období, které začalo prvními státy a písmem. Rok 476 je jeho konec. Které období po něm následuje hned, bez přeskočení?",
    ],
    explanation: "Římská říše patří do starověku. Zánik Západořímské říše roku 476 se běžně bere jako konec starověku a začátek středověku. Pravěk skončil mnohem dřív a novověk začal až kolem roku 1500.",
  },
  {
    q: "Rok 520 n. l. patří podle běžného dělení dějin do které doby?",
    key: "středověk",
    d: [
      ["starověk", "Starověk podle běžného dělení skončil roku 476. Rok 520 je už po této hranici."],
      ["novověk", "Novověk začíná až kolem roku 1500, skoro o tisíc let později."],
      ["pravěk", "Pravěk skončil vznikem písma, tisíce let před naším letopočtem."],
    ],
    hints: [
      "Porovnej rok 520 s rokem, kdy zanikla Západořímská říše. Leží před touto hranicí, nebo za ní?",
      "Jedno velké období dějin končí zánikem západní říše a jiné začíná až objevením Ameriky kolem roku 1500. Leží rok 520 před první hranicí, mezi oběma hranicemi, nebo za druhou?",
    ],
    explanation: "Starověk podle běžného dělení končí roku 476 a novověk začíná kolem roku 1500. Rok 520 leží mezi nimi, patří tedy do středověku.",
  },
  {
    q: "Rok 410 n. l. patří podle běžného dělení dějin do které doby?",
    key: "starověk",
    d: [
      ["středověk", "Středověk začíná až zánikem Západořímské říše roku 476. Rok 410 je dřív."],
      ["novověk", "Novověk začíná až kolem roku 1500, o víc než tisíc let později."],
      ["pravěk", "Pravěk skončil vznikem písma. V 5. století už existovala římská říše s psanými zákony."],
    ],
    hints: [
      "Porovnej rok 410 s rokem, kdy zanikla Západořímská říše. Je dřív, nebo později?",
      "Hranici mezi dvěma velkými obdobími dějin tvoří zánik Západořímské říše. Rok 410 patří do 5. století, ale existovala tehdy ještě západní říše? Do kterého období patří dějiny římské říše?",
    ],
    explanation: "Starověk podle běžného dělení končí roku 476, kdy zanikla Západořímská říše. Rok 410 je dřív a západní říše tehdy ještě existovala, proto patří do starověku.",
  },
];

// ── L3 — analýza ───────────────────────────────────────────────────────────
interface Pricina {
  label: string;
  /** Čím popis tuto příčinu NEukazuje — do zpětné vazby distraktoru. */
  neni: string;
  /** Signál v popisu, podle kterého se příčina pozná (1. pád mn. č.). */
  signal: string;
}

const PRICINY: Pricina[] = [
  { label: "Rozdělení říše, po němž západ zůstal sám", neni: "nemluví o dvou vládách, které si nepomáhaly", signal: "zmínky o dvou sídlech vlády a o pomoci, která nepřišla" },
  { label: "Nápor kmenů, které pronikaly přes hranice", neni: "nemluví o cizím národu, který by přicházel do říše", signal: "zmínky o cizím národu, který přešel řeku a v říši se vzbouřil" },
  { label: "Spoléhání na najaté vojáky bojující za žold", neni: "nemluví o vojácích, kteří by bojovali jen za peníze", signal: "zmínky o cizích vojácích, které Řím platil a kteří bez peněz odešli" },
  { label: "Drahota a vysoké daně, které ničily obyvatele", neni: "nemluví o cenách ani o daních, které platili obyvatelé", signal: "zmínky o tom, jak zdražovalo a kolik úředníci brali" },
  { label: "Boje vojevůdců o císařský trůn a vraždy císařů", neni: "nemluví o tom, jak rychle se střídali vládci", signal: "zmínky o mnoha vládcích, které dosazovali a odstraňovali generálové" },
  { label: "Příliš dlouhé hranice, které nešlo uhlídat", neni: "nemluví o tom, jak velké území musela obrana pokrýt", signal: "zmínky o obrovské čáře, kterou měla bránit hrstka mužů" },
];

/*
 * Popisy záměrně NEopakují slova z klíče (žold, daně, trůn, hranice, kmeny,
 * rozdělení). Žák musí situaci převést na pojem, ne hledat shodné slovo.
 * Reálie odpovídají pozdní říši: Gótové 376–378, západ v 5. století.
 */
const SITUACE: { text: string; hints: [string, string]; why: string }[] = [
  {
    text: "Z Ravenny odešli poslové do Konstantinopole se žádostí o vojsko proti nepřátelům. Tamní vládce měl vlastní starosti a vojáky do Itálie neposlal.",
    hints: [
      "Ravenna byla v 5. století sídlem vládce na západě. Kolik vlád tedy tehdy římský svět měl a kde sídlila ta druhá?",
      "Jedna vláda prosí o vojáky a druhá je nepošle, protože má vlastní starosti. Co se muselo s říší stát, aby měla dvě vlády, které si nemusely pomáhat?",
    ],
    why: "Popis ukazuje dvě vlády, v Ravenně a v Konstantinopoli. Po rozdělení říše měla každá část vlastního vládce a bohatší východ slabší západ nepodpořil. Západ pak musel čelit nepřátelům sám.",
  },
  {
    text: "Roku 376 dovolili Římané tisícům Gótů s rodinami, vozy a dobytkem přejít Dunaj. Se svými novými hosty ale zacházeli špatně, Gótové se vzbouřili a o dva roky později porazili římské vojsko u Adrianopole.",
    hints: [
      "Kdo v popisu přichází, odkud a jak to dopadlo, když byl už uvnitř?",
      "Gótové utíkali před Huny. Když se celý národ přesune přes řeku do říše a Římané ho pak nezvládnou, jaký tlak zvenčí to ukazuje?",
    ],
    why: "Popis ukazuje germánský národ, který na útěku před Huny přešel Dunaj do říše a Římané ho nezvládli. Nápor kmenů zvenčí byl jeden z hlavních vnějších důvodů pádu.",
  },
  {
    text: "Město bránil oddíl Gótů, kterému Řím platil. Když peníze dlouho nepřicházely, jejich velitel odvedl muže k nepříteli.",
    hints: [
      "Kdo v popisu brání město a proč to vůbec dělá?",
      "Ti muži nebránili svou vlast, bránili město jen za výplatu. Na koho tedy říše při obraně spoléhala?",
    ],
    why: "Popis ukazuje obránce, kteří byli cizinci a bojovali jen za peníze. Takoví vojáci nebránili říši jako svou vlast a bez výplaty odešli, dokonce k nepříteli.",
  },
  {
    text: "Rolník si postěžoval sousedovi, že za pytel obilí se dnes platí třikrát víc než za jeho otce. Úředníci mu přesto každý rok vzali větší díl úrody, a tak nakonec pole opustil.",
    hints: [
      "O čem si rolník stěžuje? Týká se to vojáků, cizích národů, nebo peněz a úrody?",
      "Obilí stojí stále víc a úředníci berou čím dál větší díl úrody. Kterou hospodářskou potíž to ukazuje?",
    ],
    why: "Popis ukazuje, že všechno zdražovalo a stát bral rolníkům stále víc. Kvůli drahotě a vysokým daním lidé opouštěli pole, říše chudla a měla méně peněz i na vojsko.",
  },
  {
    text: "V Itálii se za posledních dvacet let před rokem 476 vystřídalo devět vládců. Většinu z nich dosadili mocní generálové a ti je také dali odstranit, když se jim znelíbili.",
    hints: [
      "Kolik vládců se vystřídalo za dvacet let a kdo o nich rozhodoval?",
      "Když generálové jednoho vládce dosadí a brzy ho zase odstraní, nikdo nevládne dlouho. O co mezi sebou mocní muži soupeřili?",
    ],
    why: "Popis ukazuje, že o vládci rozhodovali generálové a nikdo nevládl dlouho. Boje o císařský trůn říši oslabovaly právě ve chvíli, kdy potřebovala pevné vedení.",
  },
  {
    text: "Římské posádky měly bránit celý tok Rýna a horního Dunaje. Mezi pevnostmi bylo i několik dní cesty a na každou připadala jen hrstka mužů.",
    hints: [
      "Jakou čáru měly posádky bránit a kolik mužů na ni připadalo?",
      "Rýn a Dunaj tečou napříč velkou částí Evropy. Když na tak obrovskou vzdálenost nestačí vojáci, kterou slabinu to ukazuje?",
    ],
    why: "Popis ukazuje, že obrana se táhla přes obrovské území a vojáků ani pevností na ni nebylo dost. Nepřítel pak mohl proniknout tam, kde zrovna nikdo nehlídal.",
  },
];

const priciny: Uloha[] = SITUACE.map((s, i) => {
  const k = PRICINY[i];
  const distr = [1, 2, 3].map((o) => PRICINY[(i + o) % PRICINY.length]);
  return {
    q: `Popis situace v pozdní římské říši: „${s.text}“ Kterou slabinu, jež přispěla k pádu Západořímské říše, tento popis ukazuje?`,
    key: k.label,
    d: distr.map((p): [string, string] => [
      p.label,
      `Tahle slabina říše opravdu existovala, ale popis ${p.neni}. Rozhodují ${k.signal}.`,
    ]),
    hints: s.hints,
    explanation: s.why,
  };
});

const L3: Uloha[] = [
  ...priciny,
  {
    q: "Proč rokem 476 nezaniklo celé římské impérium?",
    key: "Protože východní část s Konstantinopolí trvala dál",
    d: [
      ["Protože se Odoakar nechal korunovat římským císařem", "Odoakar se císařem nestal. Vládl Itálii jako germánský král a nového císaře nedosadil."],
      ["Protože Hunové Řím obsadili a vládli v něm dál", "Hunové Řím nikdy nedobyli. Attila zemřel dřív, než západní říše zanikla."],
      ["Protože se říše rozdělila až několik let po roce 476", "Rozdělení je starší, proběhlo roku 395. Rok 476 se týká jen západní části."],
    ],
    hints: [
      "Roku 476 zanikla Západořímská říše. Existovala tehdy ještě jiná část římské říše?",
      "Říše byla od konce 4. století rozdělená. Na západě nový císař nenastoupil, ale co se dělo v druhém hlavním městě? Ověř si i to, kdo tehdy vládl v Itálii.",
    ],
    explanation: "Od roku 395 byla říše rozdělená. Roku 476 zanikla jen západní část. Východořímská (Byzantská) říše s Konstantinopolí trvala dál, a to až do roku 1453, kdy město dobyli Turci.",
  },
  {
    q: "Představ si, že by se říše roku 395 nerozdělila. Která slabina západu by tím nejspíš zmizela?",
    key: "Západ by při obraně dostal pomoc z východu",
    d: [
      ["Hunové by kvůli tomu vůbec nevpadli do Evropy", "Hunové přišli z asijských stepí ještě před rozdělením. Jejich vpád na uspořádání říše nezávisel."],
      ["Vojsko by kvůli tomu přestalo najímat Germány", "Najímání žoldnéřů s rozdělením nesouvisí. Cizí vojáky najímala i nerozdělená říše."],
      ["Germáni by kvůli tomu nemuseli utíkat před Huny", "Germáni utíkali před Huny, ne kvůli uspořádání říše. Tlak z východu by trval dál."],
    ],
    hints: [
      "Uvažuj jen o tom, co se v představě mění: říše zůstane jedna s jednou vládou. Kdo by pak rozhodoval o vojácích a penězích z bohatšího východu?",
      "Vpád Hunů, útěk Germánů i najímání žoldnéřů na rozdělení říše nezávisely, ty by zůstaly. Co západ po roce 395 ztratil tím, že měl vlastní vládu oddělenou od východu?",
    ],
    explanation: "Kontrafakt mění jen jednu věc: říše by měla jednu vládu. Ta by mohla poslat vojáky a peníze z bohatšího východu na ohrožený západ. Zmizela by tedy jen slabina, že západ zůstal při obraně sám. Hunové, útěk Germánů i žoldnéři s rozdělením nesouvisí a zůstali by.",
  },
  {
    q: "Co by roku 480 nejspíš řekl obyvatel Konstantinopole o vládě ve svém městě?",
    key: "Ve městě dál vládne římský císař jako dřív",
    d: [
      ["Římská říše zanikla i s naším městem", "Zanikla jen západní část. Konstantinopol zůstala sídlem římského císaře."],
      ["Naše město teď ovládá germánský král Odoakar", "Odoakar vládl v Itálii. Konstantinopol měla vlastního císaře."],
      ["Hlavním městem je zase jen Řím", "Po roce 476 na západě žádný císař nevládl. Hlavním městem římské říše zůstala Konstantinopol."],
    ],
    hints: [
      "Rok 480 je čtyři roky po zániku západní říše. Které části se ten zánik týkal a kde leží Konstantinopol?",
      "Konstantinopol byla hlavním městem východní části. V Itálii vládl germánský král, ale jak to vypadalo na východě? Změnilo se tam vůbec něco?",
    ],
    explanation: "Roku 476 zanikla jen západní část. Konstantinopol byla hlavním městem Východořímské říše, kde dál vládl římský císař. Pro jejího obyvatele se roku 480 na vládě nic nezměnilo.",
  },
  {
    q: "Historik píše, že rok 476 byl spíš „tichý konec“ než velká katastrofa. Který fakt to nejlépe dokládá?",
    key: "Odoakar poslal císařské odznaky do Konstantinopole",
    d: [
      ["Hunové pod vedením Attily vypálili Řím do základů", "To se nestalo, Attila Řím nedobyl. A vypálení města by bylo katastrofou, ne tichým koncem."],
      ["Vandalové vyplenili Řím už dřív během 5. století", "Je to pravda, ale byl to hlučný útok. Nedokazuje, že samotný konec roku 476 proběhl tiše."],
      ["Obyvatelé Říma svedli s Germány velkou bitvu o město", "Velká bitva o Řím roku 476 nebyla. Kdyby byla, konec by nebyl tichý."],
    ],
    hints: [
      "„Tichý konec“ znamená, že se nebojovalo a nic se nebořilo. Hledej fakt, který ukazuje klidné předání moci.",
      "Útok na Řím, velká bitva nebo požár by byly hlasité. Jedna událost je pravdivá, ale nedokládá tvrzení. Co udělal Odoakar s císařskými odznaky, když už nechtěl na západě mít císaře?",
    ],
    explanation: "Odoakar mladého císaře jen sesadil, poslal odznaky císařské moci do Konstantinopole a nového císaře nedosadil. Žádná velká bitva ani zkáza města se nekonala. Plenění Vandaly je pravda, ale stalo se dřív a tichý konec nedokládá.",
  },
  {
    q: "Který z výroků popisuje DŮSLEDEK pádu Západořímské říše, ne jeho příčinu?",
    key: "Germánská království ovládla celý bývalý západ",
    d: [
      ["Vojsko tvořili hlavně najatí germánští vojáci", "Najatí vojáci byli příčinou slabosti říše, ne tím, co po pádu následovalo."],
      ["Hranice byly příliš dlouhé na účinnou obranu", "Dlouhé hranice oslabovaly říši ještě před pádem. Jsou příčinou, ne důsledkem."],
      ["Na trůnu se rychle střídali zavraždění císaři", "Boje o trůn říši oslabovaly před rokem 476. Jsou příčinou, ne důsledkem."],
    ],
    hints: [
      "Důsledek přichází až PO události. U každého výroku se ptej: platilo to před rokem 476, nebo až po něm?",
      "Tři výroky popisují, jak říše slábla ještě za existence císařů. Jen jeden popisuje, kdo ovládl její území, když už císař nevládl.",
    ],
    explanation: "Po zániku Západořímské říše zaujala na celém jejím území místo římské vlády germánská království, například Franská říše. Najatí vojáci, dlouhé hranice a boje o trůn jsou příčiny, které říši oslabovaly už před rokem 476.",
  },
  {
    q: "Který z výroků popisuje PŘÍČINU pádu Západořímské říše, ne jeho důsledek?",
    key: "Hunové vytlačili germánské kmeny na území říše",
    d: [
      ["Germánská království ovládla celý bývalý západ", "Celý západ ovládla germánská království až po pádu říše. To je důsledek, ne příčina."],
      ["Východní část s Konstantinopolí zůstala sama", "To, že zbyl jen východ, nastalo až po zániku západu. Je to důsledek."],
      ["V Evropě začalo období, kterému říkáme středověk", "Začátek středověku je pojmenování doby po roce 476, tedy důsledek pádu."],
    ],
    hints: [
      "Příčina musí přijít PŘED událostí. U každého výroku se ptej: stalo se to před rokem 476, nebo až po něm?",
      "Tři výroky popisují stav, který nastal teprve po sesazení posledního císaře. Jen jeden popisuje tlak, který na říši působil ještě ve 4. století.",
    ],
    explanation: "Vpád Hunů kolem roku 375 vytlačil Germány do říše a to ji oslabilo, je to tedy příčina. Vláda germánských království na celém západě, osamocený východ i začátek středověku přišly až po roce 476, jsou to důsledky.",
  },
  {
    q: "Kronikář zapsal: „Kmeny, které utíkaly před divokými jezdci z východu, překročily Dunaj.“ Kdy se to nejspíš stalo a kdo byli ti jezdci?",
    key: "Konec 4. století, jezdci byli Hunové",
    d: [
      ["Konec 4. století, jezdci byli Germáni", "Germáni jsou ty kmeny, které utíkaly a překročily Dunaj. Jezdci, před kterými utíkaly, byli někdo jiný."],
      ["Konec 5. století, jezdci byli Hunové", "Hunové přišli už kolem roku 375, tedy na konci 4. století. Na konci 5. století už západní říše neexistovala."],
      ["Konec 4. století, jezdci byli Slované", "Slované nebyli jezdci z východu, kteří by rozpoutali stěhování národů. Do střední Evropy přišli až v 6. století."],
    ],
    hints: [
      "Úloha má dva kroky. Nejdřív urči, kdo byli kočovní jezdci z východu, a pak, kdy do Evropy vpadli.",
      "Kmeny, které překročily Dunaj, byly pronásledované, ne pronásledovatelé. Jezdci z asijských stepí vpadli do Evropy kolem roku, který převeď na století.",
    ],
    explanation: "Kočovní Hunové vpadli do Evropy kolem roku 375, tedy na konci 4. století. Germánské kmeny před nimi utíkaly a překračovaly Dunaj. Slované přišli až v 6. století.",
    steps: ["Jezdci z východu, před kterými utíkaly kmeny = Hunové.", "Vpád kolem roku 375 → 3 celé stovky + 1 = 4. století (jeho konec)."],
  },
  {
    q: "Zpráva zní: „Mladý císař byl sesazen a poslán do vyhnanství, nového už nikdo nezvolil.“ Co z ní vyplývá pro dělení dějin?",
    key: "Tady historici kladou konec starověku",
    d: [
      ["Tady historici kladou konec pravěku", "Pravěk skončil vznikem písma a prvních států, tisíce let před sesazením posledního císaře."],
      ["Tady historici kladou začátek novověku", "Novověk začíná až kolem roku 1500. Po sesazení císaře přišel středověk."],
      ["Tady historici kladou konec středověku", "Středověk skončil až kolem roku 1500. Sesazením posledního císaře středověk naopak začal."],
    ],
    hints: [
      "Úloha má dva kroky. Nejdřív poznej, o které události zpráva mluví, pak si vzpomeň, jakou hranici období tvoří.",
      "Sesazený chlapec, po kterém už nikdo nenastoupil, byl poslední císař západu. Jaké období tím podle běžného dělení končí a jaké začíná?",
    ],
    explanation: "Zpráva popisuje, jak Odoakar roku 476 sesadil Romula Augustula a nový císař na západě už nenastoupil. Tento rok se běžně bere jako konec starověku a začátek středověku.",
    steps: ["Sesazený poslední císař bez nástupce → rok 476.", "Rok 476 = hranice starověk / středověk."],
  },
  {
    q: "Spolužák tvrdí: „Západořímská říše padla, protože prohrála Punské války.“ Proč jeho vysvětlení nesedí?",
    key: "Punské války Řím vyhrál, a to o víc než šest set let dřív",
    d: [
      ["Punské války Řím prohrál, ale až dlouho po roce 476", "Punské války proběhly ve 3. a 2. století př. n. l. a Řím v nich porazil Kartágo."],
      ["Punské války vedl Řím proti Hunům a Germánům", "Punské války vedl Řím proti Kartágu. S Huny a Germány se střetl až o staletí později."],
      ["Punské války jsou jen pověst, o které nemáme prameny", "O Punských válkách máme spoustu pramenů, například dílo dějepisců. Je to skutečná historie."],
    ],
    hints: [
      "Ověř dvě věci: kdy Punské války proběhly a kdo v nich zvítězil.",
      "Punské války vedl Řím proti Kartágu v době republiky, dávno před naším letopočtem. Zjisti, kdo z nich vyšel jako pán Středomoří, a spočítej, jak daleko ta doba leží od roku 476.",
    ],
    explanation: "Punské války proti Kartágu Řím vyhrál ve 3. a 2. století př. n. l. a stal se díky nim pánem Středomoří. Od nich uplynulo do roku 476 víc než šest set let, příčinou pádu tedy být nemohly.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? L1 : level === 2 ? L2 : L3;
  return pickN(pool, pool.length).map(build);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const STEHOVANI_NARODU_PAD_ZAPADORIMSKE_RISE: TopicMetadata[] = [
  {
    id: "g6-dej-stehovani-narodu-pad-zapadorimske-rise-6",
    rvpNodeId: "g6-dejepis-starovek-antika-rim-stehovani-narodu-pad-zapadorimske-rise-476",
    displayName: "Stěhování národů a pád Západořímské říše",
    title: "Stěhování národů, pád Západořímské říše (476)",
    studentTitle: "Jak padla Západořímská říše",
    subject: "dejepis",
    category: "Starověk",
    topic: "Antika - Řím",
    briefDescription: "Stěhování národů, rozdělení Říma a konec starověku roku 476.",
    keywords: [
      "stěhování národů", "Západořímská říše", "Východořímská říše", "Byzantská říše", "476", "395",
      "Hunové", "Attila", "Germáni", "Vandalové", "Odoakar", "Romulus Augustulus", "Theodosius I.",
      "Konstantinopol", "barbaři", "konec starověku", "příčiny pádu Říma",
    ],
    goals: [
      "Zařadit v čase vpád Hunů, rozdělení říše (395) a zánik západní části (476).",
      "Spočítat století a dobu mezi událostmi z letopočtů.",
      "Rozpoznat v popisu situace příčinu úpadku Západořímské říše.",
      "Odlišit příčiny pádu od jeho důsledků a vysvětlit, proč východ trval dál.",
    ],
    boundaries: [
      "Jen fakta, na kterých se shodují učebnice 6. ročníku; vpád Hunů jen „kolem roku 375“.",
      "Nejde o jedinou „hlavní příčinu“ pádu; příčina se čte z popisu situace v otázce.",
      "Dějiny Byzantské říše (do roku 1453) jen jako rozšiřující údaj ve vysvětlení.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Kolem roku 375 vpadli z východu Hunové a vytlačili Germány do říše. Roku 395 se říše rozdělila na západ a východ s Konstantinopolí. Roku 476 Odoakar sesadil Romula Augustula a západní říše zanikla, východ trval dál.",
      steps: [
        "Najdi v zadání letopočet, jméno nebo popis situace.",
        "U letopočtů urči století (stovky + 1), nebo od pozdějšího roku odečti dřívější.",
        "U příčin převeď popis na obecný problém: kdo bojuje a proč, kdo platí, kdo vládne, co se brání a odkud přichází nebezpečí.",
        "Příčina musí být před rokem 476, důsledek až po něm.",
      ],
      commonMistake: "Splést rok rozdělení říše (395) s rokem jejího zániku (476), nebo si myslet, že roku 476 zanikla i Konstantinopol.",
      example: "Od rozdělení říše (395) do zániku západu (476) uplynulo 476 − 395 = 81 let.",
    },
  },
];
