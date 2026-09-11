import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { urceni, type Kategorie, type Polozka } from "../_urceni";
const zac = (s: string) => s.replace(/[„“]/g, "").split(" ").slice(0, 5).join(" ") + "…";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem. Teď: L1 do které části vypravování věta
// patří (zřetelné věty) · L2 totéž v méně nápadných větách · L3 práce
// s osnovou, napětím a přímou řečí v konkrétním příběhu.

const CASTI: Kategorie[] = [
  { nazev: "úvod", znak: "představí, kdo, kde a kdy — příběh teprve začíná." },
  { nazev: "zápletka", znak: "objeví se problém nebo něco nečekaného." },
  { nazev: "vyvrcholení", znak: "napětí je největší, rozhoduje se, jak to dopadne." },
  { nazev: "závěr", znak: "vše se vyřeší a příběh končí." },
];
const U = "úvod", Z = "zápletka", V = "vyvrcholení", K = "závěr";
const C = (uroven: 1 | 2, veta: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo: veta, veta, kategorie, klic, proc });

const BANKA: Polozka[] = [
  C(1, "Byl jednou jeden mlynář, který žil s dcerou u potoka.", U, "představuje postavu a místo", "Postava a místo, nic se ještě neděje — úvod."),
  C(1, "Jednoho rána zjistil, že se mlýnské kolo zastavilo.", Z, "objevil se problém", "Zastavené kolo je problém — zápletka."),
  C(1, "V noci se u mlýna ozval rachot a z vody se vynořil vodník.", V, "je to nejnapínavější chvíle", "Největší napětí — vyvrcholení."),
  C(1, "Od té doby mlýn zase klapal a mlynář byl spokojený.", K, "vše se vyřešilo a příběh se uzavírá", "Vyřešení — závěr."),
  C(1, "Loni v létě jsme s tátou jeli pod stan k řece.", U, "říká, kdo, kdy a kam jel", "Kdo, kdy, kde — úvod."),
  C(1, "Druhý den ráno jsme zjistili, že nám zmizelo jídlo.", Z, "nastal problém", "Zmizelé jídlo je problém — zápletka."),
  C(1, "Najednou se ze křoví vyřítil medvídek a táhl náš batoh.", V, "nejnapínavější okamžik příběhu", "Největší napětí — vyvrcholení."),
  C(1, "Nakonec jsme se tomu smáli a jídlo si koupili ve vesnici.", K, "problém je vyřešený", "Vyřešení — závěr."),
  C(1, "Tomáš chodí do páté třídy a má psa Alíka.", U, "představuje postavy", "Představení postav — úvod."),
  C(1, "Jednou Alík utekl z vodítka a zmizel v parku.", Z, "stalo se něco nečekaného", "Útěk psa je problém — zápletka."),
  C(1, "Tomáš uslyšel štěkot přímo z rybníka a rozběhl se tam.", V, "napětí je nejvyšší, nevíme, co Tomáš najde", "Největší napětí — vyvrcholení."),
  C(1, "Doma pak Alíka osušil a slíbil si, že ho bude víc hlídat.", K, "vše dobře dopadlo", "Uzavření příběhu — závěr."),
  C(1, "Na kraji lesa stála malá chaloupka, kde bydlela babička.", U, "popisuje místo a postavu", "Místo a postava — úvod."),

  C(2, "Byl mrazivý prosincový večer a celé město se chystalo na Vánoce.", U, "popisuje čas a prostředí, nic se ještě nestalo", "Čas a prostředí — úvod."),
  C(2, "Když Eva otevřela dárek, místo knihy v něm našla starou mapu.", Z, "nečekaná věc rozjede děj", "Nečekaná mapa spustí příběh — zápletka."),
  C(2, "Srdce jí bušilo, když zatáhla za kliku zamčených dveří na půdě.", V, "napětí je nejvyšší a ještě nevíme, jak to dopadne", "Bušící srdce a zamčené dveře — vyvrcholení."),
  C(2, "Tu noc usínala s pocitem, že zažila nejkrásnější dobrodružství.", K, "děj je uzavřený, zbývá jen ohlédnutí", "Ohlédnutí za příběhem — závěr."),
  C(2, "Naše třída se na školní výlet těšila celý měsíc.", U, "uvádí, o kom a o čem příběh bude", "Uvedení do příběhu — úvod."),
  C(2, "V autobuse ale paní učitelka zjistila, že chybí Kuba.", Z, "objevil se problém", "Chybějící Kuba je problém — zápletka."),
  C(2, "Autobus už se rozjížděl, když Kuba s batohem vyběhl zpoza rohu a mával.", V, "rozhoduje se na poslední chvíli", "Poslední chvíle — vyvrcholení."),
  C(2, "Celou cestu zpátky jsme se Kubovi smáli a on s námi.", K, "příběh se uzavírá v klidu", "Uzavření — závěr."),
  C(2, "Honza byl nejmenší kluk ve fotbalovém týmu.", U, "představuje hlavní postavu", "Představení postavy — úvod."),
  C(2, "Před finále si hlavní brankář zlomil ruku a trenér se podíval na Honzu.", Z, "nastal nečekaný problém", "Zraněný brankář — zápletka."),
  C(2, "V poslední minutě letěl míč přímo k bráně a Honza skočil.", V, "je to nejnapínavější okamžik zápasu", "Rozhodující chvíle — vyvrcholení."),
  C(2, "Po zápase ho celý tým nesl na ramenou.", K, "je jasné, jak vše dopadlo", "Vyřešení — závěr."),
  C(2, "Světlo baterky zablikalo a zhaslo a ve tmě bylo slyšet kroky.", V, "tma a kroky vytvářejí největší napětí", "Největší napětí — vyvrcholení."),
];

const L3: PracticeTask[] = [
  choice("Příběh o nočním táboře má vyvrcholení. Která věta do něj přinese napětí?", "Najednou se ve tmě ozvalo zaskřípění dveří.", [
    { value: "Pak jsme šli spát a ráno bylo hezky.", why: "Klidný konec dne napětí nevytvoří." },
    { value: "Dveře chaty byly hnědé a dřevěné.", why: "Popis věci děj nepopožene." },
    { value: "Nakonec jsme se všichni zasmáli.", why: "To patří spíš do závěru." },
  ], {
    hints: ["Při které větě by ses bál nebo bála, co bude dál?", "Napětí vzniká, když se stane něco nečekaného a nevíme, jak to dopadne; zesílí ho slova, která ohlásí náhlou změnu."],
    explanation: "Nečekaný zvuk v noci vytváří napětí, proto se hodí do vyvrcholení.",
  }),
  choice("Jak nejlépe oživit vypravování přímou řečí?", "„Pomoc!“ vykřikl Petr a chytil se větve.", [
    { value: "Petr řekl, že potřebuje pomoc.", why: "To je nepřímá řeč — je méně živá." },
    { value: "Petr potřeboval pomoc.", why: "Chybí slova postavy." },
    { value: "Petr se chytil větve, protože padal.", why: "Postava tu nemluví." },
  ], {
    hints: ["Ve které možnosti slyšíš postavu mluvit jejími vlastními slovy?", "Přímá řeč cituje přesná slova postavy v uvozovkách; čtenář pak má pocit, že je u toho."],
    explanation: "Přímá řeč s výstižným slovesem vykřikl vypravování oživí.",
  }),
  choice("Která osnova vypravování je ve správném pořadí?", "příjezd na tábor, ztracený klíč, hledání v noci, klíč nalezen", [
    { value: "ztracený klíč, příjezd na tábor, klíč nalezen, hledání v noci", why: "Zápletka je před úvodem a závěr před vyvrcholením." },
    { value: "příjezd na tábor, klíč nalezen, ztracený klíč, hledání v noci", why: "Závěr nemůže přijít dřív než zápletka." },
    { value: "hledání v noci, příjezd na tábor, ztracený klíč, klíč nalezen", why: "Hledá se dřív, než je co hledat." },
  ], {
    hints: ["Co se v příběhu musí stát nejdřív, aby bylo co hledat?", "Pořadí částí: úvod (kdo, kde), zápletka (problém), vyvrcholení (největší napětí), závěr (vyřešení)."],
    explanation: "Úvod (příjezd), zápletka (ztracený klíč), vyvrcholení (hledání v noci), závěr (klíč nalezen).",
  }),
  choice("V osnově chybí zápletka: I. Jdeme k babičce. II. ___ III. Hledáme ho po celé vesnici. IV. Spí schovaný na půdě. Co doplníš?", "Babiččin kocour se ztratil.", [
    { value: "Babička nám upekla koláč.", why: "To není problém, kvůli kterému by se hledalo." },
    { value: "Jedeme domů autobusem.", why: "To patří spíš na konec." },
    { value: "Babička má zahradu.", why: "Popis, žádný problém." },
  ], {
    hints: ["Co se muselo stát, že celá vesnice pak někoho hledá?", "Zápletka je problém, který rozjede děj; další body osnovy na ni navazují."],
    explanation: "Ztracený kocour je problém, na který navazuje hledání i šťastný konec.",
  }),
  choice("Které slovo nejlépe nahradí opakované „a pak“ ve větě „Vstal jsem, a pak jsem se oblékl, a pak jsem snídal.“?", "potom", [
    { value: "a pak", why: "To je právě to opakované spojení." },
    { value: "protože", why: "Protože vyjadřuje příčinu, ne pořadí." },
    { value: "ale", why: "Ale vyjadřuje odpor, ne pořadí." },
  ], {
    hints: ["Které slovo vyjadřuje, co přišlo dál, a přitom se ve větě ještě neopakuje?", "Aby vypravování neznělo jednotvárně, střídáme slova pro časovou posloupnost: nejdřív, vzápětí, nakonec."],
    explanation: "Vstal jsem, potom jsem se oblékl… — slovo potom vyjádří pořadí a opakování zmizí.",
  }),
  choice("Který závěr vypravování o ztraceném psu je nejlepší?", "Alík se vrátil a Tomáš si slíbil, že ho bude lépe hlídat.", [
    { value: "Alík byl hnědý pes s bílou tlapkou a krátkým ocasem.", why: "To je popis, ne závěr." },
    { value: "Najednou se z lesa ozval štěkot a Tomáš se rozběhl tam.", why: "To je vyvrcholení — ještě nevíme, jak to dopadne." },
    { value: "Tomáš chodil do páté třídy a měl psa Alíka.", why: "To je úvod." },
  ], {
    hints: ["Která možnost uzavírá příběh a říká, jak vše dopadlo?", "Závěr vyřeší zápletku a často ukáže, co si postava z příběhu odnesla."],
    explanation: "Závěr říká, jak vše dopadlo, a uzavírá příběh.",
  }),
  choice("Jak zajímavěji napsat větu „Šel jsem po lese.“?", "Pomalu jsem se prodíral hustým lesem.", [
    { value: "Šel jsem po lese a pak zase po lese.", why: "Opakuje se a nic nového nepřidává." },
    { value: "Po lese jsem šel já.", why: "Jen přeházená slova, obraz se nezlepšil." },
    { value: "Šel jsem tam po tom lese.", why: "Hovorové a nic nepřidává." },
  ], {
    hints: ["Které sloveso a přídavné jméno by čtenáři pomohly les vidět?", "Přesnější sloveso (plížit se, brodit se) a přídavné jméno ukážou, jak to vypadalo a jak se postava cítila."],
    explanation: "Přesné sloveso a přídavné jméno dají větě obraz a náladu.",
  }),
  choice("Co patří do úvodu vypravování o výletu na hrad?", "kdo jel na výlet, kam a kdy", [
    { value: "jak výlet skončil", why: "To patří do závěru." },
    { value: "co se na hradě nečekaně stalo", why: "To je zápletka." },
    { value: "nejnapínavější chvíle výletu", why: "To je vyvrcholení." },
  ], {
    hints: ["Co musí čtenář vědět hned na začátku, aby se v příběhu vyznal?", "Úvod představí postavy, místo a čas; děj se v něm teprve rozbíhá."],
    explanation: "Úvod představí, kdo, kam a kdy jel.",
  }),
  choice("Proč si před psaním vypravování děláme osnovu?", "abychom nezapomněli na žádnou část a měli pořadí", [
    { value: "aby byl text co nejkratší", why: "Osnova neslouží ke zkracování." },
    { value: "protože ji učitel musí podepsat", why: "Osnova je pomůcka pro pisatele." },
    { value: "aby v textu nebyla přímá řeč", why: "Osnova přímou řeč nezakazuje." },
  ], {
    hints: ["Co by se mohlo stát, kdybys psal nebo psala bez plánu?", "Osnova je plán: body příběhu seřazené od úvodu po závěr, podle kterých pak píšeš."],
    explanation: "Osnova hlídá, aby příběh měl všechny části ve správném sledu.",
  }),
  choice("Která věta nejživěji ukáže, že se postava bojí?", "Kolena se mi třásla a nemohla jsem popadnout dech.", [
    { value: "Bála jsem se.", why: "Je to pravda, ale čtenář strach necítí — chybí, jak se projevil." },
    { value: "Byla tma a já jsem šla sama domů lesem.", why: "Popisuje situaci, ne pocit postavy." },
    { value: "Strach je nepříjemný pocit.", why: "Obecná věta, ne prožitek postavy." },
  ], {
    hints: ["Ve které větě strach skoro cítíš na vlastním těle?", "Pocit ukážeš nejlépe tím, jak se projevuje — co dělá tělo, dech, hlas."],
    explanation: "Třesoucí se kolena a ztracený dech strach ukážou, ne jen pojmenují.",
  }),
  choice("Který nadpis se nejlépe hodí k vypravování o tom, jak se ztratil pes Alík a děti ho našly v lese?", "Kde je Alík?", [
    { value: "Alík se našel v lese", why: "Prozradí konec a vezme napětí." },
    { value: "Můj pokoj", why: "S příběhem nesouvisí." },
    { value: "Jak se peče koláč", why: "S příběhem nesouvisí." },
  ], {
    hints: ["Který nadpis láká ke čtení a přitom neprozradí, jak to dopadne?", "Dobrý nadpis se týká příběhu, vzbudí zvědavost a nevyzradí konec předem."],
    explanation: "Otázka v nadpisu vzbudí zvědavost a konec neprozradí.",
  }),
  choice("Ve kterém čase se vypravování o zážitku obvykle píše?", "v minulém", [
    { value: "v budoucím", why: "Budoucí čas mluví o tom, co teprve bude." },
    { value: "jen v přítomném", why: "Přítomný čas se někdy použije pro oživení, ale ne výhradně." },
    { value: "v rozkazovacím způsobu", why: "Rozkazovací způsob patří do návodu." },
  ], {
    hints: ["Kdy se zážitek, o kterém vyprávíš, odehrál?", "Vyprávíme o tom, co už proběhlo, proto slovesa jako šli jsme, viděla jsem."],
    explanation: "Zážitek už proběhl, proto ho vyprávíme v minulém čase.",
  }),
  choice("Co udělá vypravování živějším?", "přímá řeč a přesná slovesa", [
    { value: "opakování slova pak", why: "Opakování text uspává." },
    { value: "samé krátké holé věty", why: "Text zní úsečně a jednotvárně." },
    { value: "věty bez sloves", why: "Bez sloves se nic neděje." },
  ], {
    hints: ["Díky čemu má čtenář pocit, že je přímo u toho?", "Když postavy mluví vlastními slovy v uvozovkách a místo obecného šel stojí třeba plížil se, text ožije."],
    explanation: "Přímá řeč a přesná slovesa dělají vypravování živým.",
  }),
];

function gen(level: number): PracticeTask[] {
  if (level >= 3) return shuffle(L3);
  return urceni(BANKA, CASTI, level, (p) => ({
    question: `Do které části vypravování patří věta „${p.veta}“?`,
    hints: [
      `Je věta „${zac(p.veta)}“ na začátku příběhu, u problému, v nejnapínavější chvíli, nebo na konci?`,
      `Pomůže tohle: věta ${p.klic}.`,
    ],
  }), ["Příběh jde od představení přes problém a největší napětí až k vyřešení.", "Zeptej se: už se něco stalo? Je napětí největší? Je už vyřešeno?"]);
}

export const VYPRAVOVANISROZVINUTOUOSNOVOU: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-rozvinutou-osnovou",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-rozvinutou-osnovou",
    title: "Vyprávění s rozvinutou osnovou",
    studentTitle: "Vypravování",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Sestavíš osnovu a napíšeš vypravování s napětím.",
    keywords: ["vyprávění", "osnova", "zápletka", "vyvrcholení", "závěr", "příběh"],
    goals: [
      "Sestavit rozvitou osnovu vyprávění",
      "Rozlišit části příběhu (úvod, zápletka, vyvrcholení, závěr)",
      "Napsat vyprávění s napětím a přímou řečí",
    ],
    boundaries: [
      "Bez složité naratologické analýzy",
      "Úroveň 3: osnova, napětí a přímá řeč v konkrétním příběhu; bez odborných pojmů naratologie",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Osnova vyprávění: I. Úvod (kdo, kde, kdy) → II. Zápletka (problém) → III. Vyvrcholení (vrchol napětí) → IV. Závěr (rozuzlení).",
      steps: [
        "Vymysli hlavní postavu a prostředí (úvod).",
        "Vytvoř problém nebo konflikt (zápletka).",
        "Stupňuj napětí k vrcholu (vyvrcholení).",
        "Vyřeš problém a zakonči příběh (závěr).",
        "Rozveď osnovu na podčásti (A, B, C).",
      ],
      commonMistake: "Žáci vynechávají vyvrcholení nebo zápletku. Příběh bez problému není napínavý.",
      example: "I. Pavel jde do lesa. II. Ztratí se. III. Napadne ho medvěd. IV. Záchranáři ho najdou.",
    },
  },
];
