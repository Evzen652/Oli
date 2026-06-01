import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Kdy komunisté převzali moc v Československu?",
    correctAnswer: "Únor 1948",
    options: ["Únor 1948", "Leden 1945", "Srpen 1968", "Listopad 1989"],
    hints: ["Říká se tomu 'Vítězný únor' nebo 'Únorový převrat'."],
    solutionSteps: ["V únoru 1948 komunisté ovládli vládu a nastolili totalitní režim."],
  },
  {
    question: "Kdo byl vedoucí komunista, který převzal moc roku 1948?",
    correctAnswer: "Klement Gottwald",
    options: ["Klement Gottwald", "Alexander Dubček", "Gustáv Husák", "Václav Havel"],
    hints: ["Je to příjmení — říkalo se mu 'Gottwaldovi'."],
    solutionSteps: ["Klement Gottwald vedl KSČ a stal se prvním komunistickým prezidentem."],
  },
  {
    question: "Co byl 'Pražské jaro' v roce 1968?",
    correctAnswer: "Pokus o reformu komunismu — 'socialismus s lidskou tváří'",
    options: [
      "Pokus o reformu komunismu — 'socialismus s lidskou tváří'",
      "Jarní vojenské cvičení",
      "Vznik Václavského náměstí",
      "Konec komunistického režimu",
    ],
    hints: ["Spojeno s Alexandrem Dubčekem."],
    solutionSteps: ["Pražské jaro 1968 = Dubčekovy reformy — svobodnější komunismus, ale SSSR to zastavil."],
  },
  {
    question: "Kdo vedl reformy Pražského jara?",
    correctAnswer: "Alexander Dubček",
    options: ["Alexander Dubček", "Klement Gottwald", "Gustáv Husák", "Václav Havel"],
    hints: ["Říká se mu 'tvář s úsměvem'."],
    solutionSteps: ["Alexander Dubček byl 1. tajemník KSČ a iniciátor reforem Pražského jara."],
  },
  {
    question: "Co se stalo v srpnu 1968 v Československu?",
    correctAnswer: "Vojska Varšavské smlouvy (SSSR) obsadila ČSR a ukončila Pražské jaro",
    options: [
      "Vojska Varšavské smlouvy (SSSR) obsadila ČSR a ukončila Pražské jaro",
      "ČSR vstoupila do NATO",
      "Komunisté padli a přišla demokracie",
      "Sametová revoluce skončila",
    ],
    hints: ["Srpnová invaze — tanky z Moskvy."],
    solutionSteps: ["21. 8. 1968 vojska SSSR a pěti dalších států Varšavské smlouvy obsadila ČSR."],
  },
  {
    question: "Kdy začala Sametová revoluce?",
    correctAnswer: "17. listopadu 1989",
    options: ["17. listopadu 1989", "28. října 1989", "1. ledna 1993", "Únor 1948"],
    hints: ["Je to datum státního svátku Dne boje za svobodu a demokracii."],
    solutionSteps: ["Sametová revoluce začala 17. 11. 1989 demonstrací studentů na Národní třídě."],
  },
  {
    question: "Kdo se stal prezidentem po Sametové revoluci?",
    correctAnswer: "Václav Havel",
    options: ["Václav Havel", "Gustáv Husák", "Alexander Dubček", "Václav Klaus"],
    hints: ["Byl to dramatik a disident."],
    solutionSteps: ["Václav Havel byl zvolen prezidentem 29. 12. 1989."],
  },
  {
    question: "Co bylo JZD (jednotné zemědělské družstvo)?",
    correctAnswer: "Kolektivní státní zemědělství, kde rolníci odevzdali půdu státu",
    options: [
      "Kolektivní státní zemědělství, kde rolníci odevzdali půdu státu",
      "Soukromá farma",
      "Typ průmyslové továrny",
      "Škola pro rolnické děti",
    ],
    hints: ["Kolektivizace = znárodňování zemědělské půdy."],
    solutionSteps: ["Komunisté zavedli JZD, kde rolníci ztratili soukromou půdu a pracovali pro stát."],
  },
  {
    question: "Co byla StB?",
    correctAnswer: "Státní bezpečnost — tajná policie komunistického Československa",
    options: [
      "Státní bezpečnost — tajná policie komunistického Československa",
      "Škola pro bezpečnostní studia",
      "Státní banka",
      "Slovenská televize a bezpečnost",
    ],
    hints: ["Podobná KGB v SSSR."],
    solutionSteps: ["StB (Státní bezpečnost) špehovala občany a potlačovala odpor vůči komunistickému režimu."],
  },
  {
    question: "Co je 'normalizace' v kontextu Československa?",
    correctAnswer: "Období po 1968, kdy byly zrušeny Dubčekovy reformy a obnovena tvrdá kontrola",
    options: [
      "Období po 1968, kdy byly zrušeny Dubčekovy reformy a obnovena tvrdá kontrola",
      "Normální každodenní život za komunismu",
      "Doba před rokem 1948",
      "Přechod k demokracii",
    ],
    hints: ["'Normalizace' = návrat k 'normálnímu' komunismu = potlačení svobod."],
    solutionSteps: ["Normalizace (1969–1989) = Husákova éra — censura, zákaz cestování, represe."],
  },
  {
    question: "Proč se říká, že revoluce 1989 byla 'sametová'?",
    correctAnswer: "Proběhla bez násilí — pokojně, jako jemný samet",
    options: [
      "Proběhla bez násilí — pokojně, jako jemný samet",
      "Demonstranti nosili sametové oblečení",
      "Název vymyslel Husák",
      "Revoluce trvala jen jeden den",
    ],
    hints: ["Samet = měkká látka bez hrubosti."],
    solutionSteps: ["Revoluce 1989 proběhla pokojně, bez krveprolití — proto dostala přívlastek 'sametová'."],
  },
  {
    question: "Kdo byl Gustáv Husák?",
    correctAnswer: "Komunistický vůdce v době normalizace (1969–1989)",
    options: [
      "Komunistický vůdce v době normalizace (1969–1989)",
      "Iniciátor Pražského jara",
      "První prezident ČSR",
      "Vůdce Sametové revoluce",
    ],
    hints: ["Nahradil Dubčeka po invazi 1968."],
    solutionSteps: ["Husák nahradil Dubčeka a vedl ČSR v době normalizace 1969–1987."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč komunisté zestátnili soukromé podniky a zemědělství?",
    correctAnswer: "Ideologicky odmítali soukromé vlastnictví — vše mělo patřit státu (lidu)",
    options: [
      "Ideologicky odmítali soukromé vlastnictví — vše mělo patřit státu (lidu)",
      "Chtěli obohatit rolníky",
      "Soukromé podniky nefungovaly",
      "Bylo to nařízení USA",
    ],
    hints: ["Komunistická ideologie = kolektivní vlastnictví."],
    solutionSteps: ["Marxistická ideologie odmítá soukromé vlastnictví → znárodnění, JZD."],
  },
  {
    question: "Proč měl SSSR zájem potlačit Pražské jaro?",
    correctAnswer: "Obával se, že reformy by mohly ovlivnit jiné komunistické státy a ohrozit sovětský blok",
    options: [
      "Obával se, že reformy by mohly ovlivnit jiné komunistické státy a ohrozit sovětský blok",
      "Chtěl ČSR připojit k SSSR",
      "Dubček byl osobní nepřítel Brežněva",
      "ČSR plánovala vstoupit do NATO",
    ],
    hints: ["Domino efekt — jedna svobodná země → revoluce v bloku."],
    solutionSteps: ["SSSR se bál, že svobodnější komunismus v ČSR inspiruje revoluce v NDR, Polsku, Maďarsku."],
  },
  {
    question: "Jak se lišil život za komunismu od demokratické doby?",
    correctAnswer: "Cenzura, nedostatek zboží, zákaz cestování na západ, politické pronásledování",
    options: [
      "Cenzura, nedostatek zboží, zákaz cestování na západ, politické pronásledování",
      "Větší svoboda a blahobyt",
      "Stejné jako dnes jen s jinými stranami",
      "Lepší přístup k hudbě a kultuře",
    ],
    hints: ["Uvažuj o svobodě slova, cestování a obchodu."],
    solutionSteps: ["Komunistický režim = cenzura médií, štěkáš politika, nedostatkové zboží, nemožnost cestovat."],
  },
  {
    question: "Proč Sametová revoluce začala právě 17. listopadu 1989?",
    correctAnswer: "Studenti protestovali při výročí Jana Opletala — policie je brutálně napadla → protesty eskalovaly",
    options: [
      "Studenti protestovali při výročí Jana Opletala — policie je brutálně napadla → protesty eskalovaly",
      "Komunisté sami pozvali lidi na náměstí",
      "Náhodou se sešel velký dav",
      "Václav Havel naplánoval toto datum",
    ],
    hints: ["17. 11. je výročí Jana Opletala — studenta zabitého nacisty 1939."],
    solutionSteps: ["Studentská demonstrace k 50. výročí Opletala → policie bijí demonstranty → vlna protestů."],
  },
  {
    question: "Co společného měly emigrace Milana Kundery, Miloše Formana a Martiny Navrátilové?",
    correctAnswer: "Všichni opustili ČSR kvůli komunistickému režimu",
    options: [
      "Všichni opustili ČSR kvůli komunistickému režimu",
      "Odešli za lepší prací",
      "Byli pozváni zahraničními firmami",
      "Emigrovali kvůli zdravotním důvodům",
    ],
    hints: ["Komunistický režim neumožňoval svobodnou tvorbu ani sport."],
    solutionSteps: ["Kundera (spisovatel), Forman (filmař), Navrátilová (tenistka) — all emigranti z důvodu komunismu."],
  },
  {
    question: "Co znamenalo, že komunistická ekonomika byla 'plánovaná'?",
    correctAnswer: "Stát rozhodoval co, kolik a za kolik se vyrábí — ne trh",
    options: [
      "Stát rozhodoval co, kolik a za kolik se vyrábí — ne trh",
      "Podniky si plánoval produkci samy",
      "Plánování se týkalo jen armády",
      "Ekonomika fungovala jako dnes",
    ],
    hints: ["Opak tržní ekonomiky."],
    solutionSteps: ["Plánovaná (centrálně řízená) ekonomika = stát určuje výrobu → nedostatek zboží, nízká kvalita."],
  },
  {
    question: "Jak byl Dubček potrestán po invazi 1968?",
    correctAnswer: "Byl sesazen z funkce a degradován — pracoval jako lesník v Bratislavě",
    options: [
      "Byl sesazen z funkce a degradován — pracoval jako lesník v Bratislavě",
      "Byl popraven jako odpůrce SSSR",
      "Odešel dobrovolně do exilu",
      "Byl jmenován prezidentem",
    ],
    hints: ["Normalizace ho zcela vyřadila z politiky."],
    solutionSteps: ["Dubček byl sesazen, vyloučen z KSČ a pracoval jako lesní dělník — symbol normalizačních čistek."],
  },
  {
    question: "Co byl Charta 77?",
    correctAnswer: "Petice a hnutí disidentů (včetně Havla) kritizující porušování lidských práv",
    options: [
      "Petice a hnutí disidentů (včetně Havla) kritizující porušování lidských práv",
      "Zákon o nové ústavě",
      "Komunistický dokument o reformách",
      "Plán Sametové revoluce",
    ],
    hints: ["Název odkazuje na rok 1977."],
    solutionSteps: ["Charta 77 (1977) byla peticí, kterou podepsali disidenti jako Havel a žádali dodržování lidských práv."],
  },
  {
    question: "Co se stalo se svobodou tisku za komunismu?",
    correctAnswer: "Všechna média byla státní a cenzurovaná — kritika režimu nebyla možná",
    options: [
      "Všechna média byla státní a cenzurovaná — kritika režimu nebyla možná",
      "Tisková svoboda existovala jako dnes",
      "Existovaly soukromé noviny",
      "Noviny mohly kritizovat SSSR",
    ],
    hints: ["Cenzura = kontrola obsahu před publikací."],
    solutionSteps: ["Komunistická cenzura kontrolovala veškerá média — jen povolené zprávy se směly tisknout."],
  },
  {
    question: "Proč padl komunistický režim právě roku 1989?",
    correctAnswer: "Ekonomická krize + Gorbačovovy reformy v SSSR + vlna revolucí po celé východní Evropě",
    options: [
      "Ekonomická krize + Gorbačovovy reformy v SSSR + vlna revolucí po celé Evropě",
      "Komunisté se sami rozhodli demokratizovat",
      "USA vojensky zasáhly",
      "ČSR přijala novou ústavu bez protestů",
    ],
    hints: ["Perestrojka + glasnosť + pád Berlínské zdi."],
    solutionSteps: ["Gorbačovovy reformy oslabily SSSR → vlna revolucí 1989 po celém bloku → pád komunismu."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď klíčové události komunistické éry chronologicky.",
    correctAnswer: "Únorový převrat → Pražské jaro → Srpnová invaze → Normalizace → Sametová revoluce",
    items: [
      "Únorový převrat – komunisté převzali moc (1948)",
      "Pražské jaro – Dubčekovy reformy (1968)",
      "Srpnová invaze vojsk Varšavské smlouvy (21. 8. 1968)",
      "Normalizace – Husákova éra (1969–1989)",
      "Sametová revoluce (17. 11. 1989)",
    ],
    hints: ["Začni rokem 1948."],
    solutionSteps: ["1948 → 1968 jaro → 1968 invaze → 1969 normalizace → 1989 revoluce."],
  },
  {
    question: "Spoj pojmy s jejich popisem.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "Gottwald", right: "První komunistický prezident (1948)" },
      { left: "Pražské jaro", right: "Dubčekovy reformy, 1968" },
      { left: "Srpnová invaze", right: "Vojska SSSR obsadila ČSR (1968)" },
      { left: "Normalizace", right: "Husákova éra po 1968" },
      { left: "Sametová revoluce", right: "17. listopadu 1989 — konec komunismu" },
    ],
    hints: ["Gottwald = 1948."],
    solutionSteps: ["Každý pojem má svou klíčovou osobu nebo datum v komunistické éře."],
  },
  {
    question: "Proč Sametová revoluce uspěla tam, kde Pražské jaro neuspělo?",
    correctAnswer: "V 1989 SSSR oslaben Gorbačovem a ekonomicky nestabilní — neinvadoval",
    options: [
      "V 1989 SSSR oslaben Gorbačovem a ekonomicky nestabilní — neinvadoval",
      "ČSR měla silnější armádu než v 1968",
      "Západ vojensky chránil ČSR v 1989",
      "Husák dobrovolně předal moc",
    ],
    hints: ["Gorbačov odmítl posílat tanky v 1989."],
    solutionSteps: ["1968 SSSR silný → invaze; 1989 Gorbačov + ekonomická krize → SSSR zasáhnout nemohl/nechtěl."],
  },
  {
    question: "Jak by ti jako disidentovi hrozilo, kdyby ses v 70. letech postavil komunismu?",
    correctAnswer: "Ztráta práce, zákaz studia, sledování StB, vězení — disidenti byli systematicky pronásledováni",
    options: [
      "Ztráta práce, zákaz studia, sledování StB, vězení — disidenti byli systematicky pronásledováni",
      "Mohl bych protestovat svobodně jako dnes",
      "Dostal bych pokutu, nic víc",
      "Komunisté by mne ignorovali",
    ],
    hints: ["Charta 77 signatáři ztratili zaměstnání a byli sledováni."],
    solutionSteps: ["Disidenti za normalizace čelili ztrátě práce, zákazům cestování, sledování a věznění."],
  },
  {
    question: "Jak byl pád komunismu v ČSR součástí celoevropského dění roku 1989?",
    correctAnswer: "Revolucím předcházel pád Berlínské zdi a reformy Gorbačova — ČSR byl součást dominového efektu",
    options: [
      "Revolucím předcházel pád Berlínské zdi a reformy Gorbačova — ČSR byl součást dominového efektu",
      "ČSR byla jediná zemí, kde komunismus padl",
      "Pád komunismu v ČSR byl zcela náhodný",
      "Jen ČSR reagovala na Gorbačovovy reformy",
    ],
    hints: ["Polsko, Maďarsko, NDR, ČSR — celá vlna roku 1989."],
    solutionSteps: ["1989 = pád komunistických režimů v celém sovětském bloku: Polsko → Maďarsko → NDR → ČSR → Rumunsko."],
  },
  {
    question: "Který výrok o komunistickém ČSR je NEPRAVDIVÝ?",
    correctAnswer: "Za komunismu existovala svobodná demokratická volby každé 4 roky",
    options: [
      "Za komunismu existovala svobodná demokratická volby každé 4 roky",
      "StB sledovala a pronásledovala odpůrce režimu",
      "Média byla cenzurována státem",
      "Soukromé podniky byly znárodněny",
    ],
    hints: ["Ve volbách komunistické éry byl jen jeden povolený výsledek."],
    solutionSteps: ["Komunistické 'volby' byly fraškou — vítěz byl předem dán. Svobodné volby neexistovaly."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const KOMUNISTICKYREZIMSAMETOVAREVOLUCE1989: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-komunisticky-rezim-sametova-revoluce-1989",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-komunisticky-rezim-sametova-revoluce-1989",
    title: "Komunistický režim, sametová revoluce 1989",
    studentTitle: "Komunismus a revoluce",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Poznáš, jak fungoval komunismus a jak padl v roce 1989.",
    keywords: ["komunismus", "gottwald", "pražské jaro", "dubček", "normalizace", "sametová revoluce", "havel"],
    goals: [
      "Žák vysvětlí, co byl komunistický režim v ČSR",
      "Žák popíše Pražské jaro a srpnovou invazi",
      "Žák zná datum a průběh Sametové revoluce",
    ],
    boundaries: ["Marxistická ekonomická teorie", "Detailní geopolitika studené války"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová data: 1948 (převrat), 1968 (Pražské jaro + invaze), 1989 (Sametová revoluce).",
      steps: [
        "Únor 1948: komunistický převrat — Gottwald",
        "1968: Pražské jaro (Dubček) → invaze SSSR",
        "1969–1989: normalizace — Husák",
        "17. 11. 1989: Sametová revoluce",
        "1989: Václav Havel — prezident",
      ],
      commonMistake: "Zaměňování Dubčeka (Pražské jaro) a Husáka (normalizace).",
      example: "Sametová revoluce se nazývá sametová, protože proběhla bez násilí.",
    },
  },
];
