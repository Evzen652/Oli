/**
 * Čeština 6. ročník — Zvuková stránka jazyka: přízvuk, intonace, frázování
 * (select_one). Žádné zvukové soubory — všechno se řeší jen z PSANÉHO textu
 * pomocí grafického značení: VELKÁ PÍSMENA = přízvučná/zdůrazněná slabika
 * nebo slovo, šipka ↘/↗ (slovně popsaná jako „klesavá“/„stoupavá“) = melodie
 * věty, svislá čára „|“ = pauza (frázování), lomítko „/“ = hranice
 * přízvukového taktu (bez pauzy).
 *
 *  L1 — rozpoznání pravidla (3 formáty, dohromady bance ≥12 úloh):
 *   (a) víceslabičné slovo: vyber zápis se správně vyznačenou PRVNÍ slabikou
 *       (distraktory: 2., předposlední/prostřední, poslední slabika — u slov
 *       s dlouhou samohláskou mimo první slabiku jde o záměnu délky za přízvuk).
 *   (b) krátká věta: jakou má melodii (klesavá u oznamovací/rozkazovací/
 *       zvolací věty, stoupavá u zjišťovací otázky). Doplňovací otázka se na
 *       L1 nepoužívá, patří až do L2.
 *   (c) pojmová otázka: na kterou slabiku padá v češtině hlavní přízvuk.
 *   (d) najdi chybu: ze čtyř vyznačených slov je právě jedno vyznačené
 *       ŠPATNĚ (klíč tedy NENÍ zápis s velkou první slabikou — žák nesmí
 *       jen klikat na „velká písmena na začátku“).
 *
 *  L2 — aplikace na spojení a celé věty:
 *   (a) jednoslabičná předložka + jméno: přízvuk přebírá předložka (spojení
 *       tvoří jeden přízvukový takt). Bank 12 spojení, jen SLABIČNÉ předložky
 *       (mají samohlásku) — neslabičné k/v/s/z ani vokalizované ve/se/ze se
 *       nepoužívají (u „k lesu“ je přízvučná slabika [kle], ne samotné „k“).
 *   (b) rozdělení věty na přízvukové takty (prototypy bez klitik). Hranice
 *       taktu se značí LOMÍTKEM „/“, ne svislou čárou — mezi takty se pauza
 *       nedělá, „|“ je vyhrazená pro pauzu (frázování, L3a).
 *   (c) melodie otázek: doplňovací s tázacím slovem (klesavá) × zjišťovací
 *       bez tázacího slova (stoupavá).
 *
 *  L3 — analýza a transfer (znění otázek L1 a L3 disjunktní):
 *   (a) pauza mění smysl věty: dvojice sloves s „ne“ („Jíst nečekat.“) a věta
 *       s vsuvkou („Petr řekl Pavel je líný.“ — kdo mluví?). Distraktory jsou
 *       blízké omyly (opačná pauza, dvojí pauza, žádná/jen jedna pauza).
 *   (b) větný důraz odpovídá na danou otázku (vyber zdůrazněné slovo).
 *   (c) obrácený směr: podle zdůrazněného slova pozná, na kterou otázku věta
 *       odpovídá; + čtyři úlohy na to, co mluvčí důrazem naznačuje.
 *   (d) volba melodie v situaci: otázka začínající zájmenem, které NENÍ
 *       tázací slovo (ty/vy/on/ten/váš…), má i tak stoupavou melodii — test
 *       přenosu pravidla, ne mechanického rozpoznání první slabiky otázky.
 *
 * Chybový model (viz errorModel ve specifikaci):
 *  • přízvuk posunutý na 2./prostřední/poslední slabiku, nebo záměna délky
 *    samohlásky za přízvuk;
 *  • u předložkového spojení opomenutí předložky (přízvuk na jméně), nebo
 *    dva takty místo jednoho;
 *  • klesavá/stoupavá melodie prohozená podle přítomnosti tázacího slova;
 *  • pauza podle délky/nahodile místo podle smyslu; důraz automaticky na
 *    první/poslední slovo místo na slovo, na které se ptá otázka.
 *
 * Sporné jevy (klitiky, vokalizované předložky, jemné odstíny polokadence)
 * se nepoužívají ani jako klíč, ani jako distraktor.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, type Distractor } from "./_shared";

// ── Sdílené texty pro úlohy o melodii věty (L1b, L2c, L3d) ──────────────────
const MELODY_OPTIONS = [
  "klesavá – hlas na konci klesá",
  "stoupavá – hlas na konci stoupá",
  "stejná po celou dobu – hlas se nemění",
  "podle délky – krátká věta stoupá, dlouhá klesá",
] as const;

const HINT_TYP_VETY =
  "Nejdřív rozhodni, jaký typ věty to je: oznamovací, rozkazovací nebo zvolací věta má klesavou melodii (hlas na konci klesá); zjišťovací otázka, na kterou se dá odpovědět ano/ne, má stoupavou melodii (hlas na konci stoupá).";

function melodyFillerDistractors(): Distractor[] {
  return [
    { value: MELODY_OPTIONS[2], why: "Hlas, který se po celou větu vůbec nemění, zní strojově. Každá dokončená věta má na konci zřetelný pohyb hlasu nahoru, nebo dolů – a ten má i tahle věta." },
    { value: MELODY_OPTIONS[3], why: "Melodii neurčuje délka věty, ale její TYP: oznamovací, rozkazovací a zvolací věta i otázka s tázacím slovem na konci klesají, zjišťovací otázka (odpověď ano/ne) stoupá – ať je krátká, nebo dlouhá." },
  ];
}

// ── L1a — víceslabičné slovo: správně vyznačená přízvučná slabika ───────────
// Jen slova o 4 slabikách, aby šly z první slabiky odlišit vždy TŘI různé
// špatné pozice (2., 3., poslední). U slova s dlouhou samohláskou mimo první
// slabiku popisuje feedback tu pozici jako záměnu DÉLKY za přízvuk.
interface SlovoL1a {
  syll: string[];
}
const SLOVA_L1A: SlovoL1a[] = [
  { syll: ["ka", "ma", "rád", "ka"] }, // kamarádka
  { syll: ["te", "le", "vi", "ze"] }, // televize
  { syll: ["po", "čí", "ta", "če"] }, // počítače
  { syll: ["ne", "da", "le", "ko"] }, // nedaleko
  { syll: ["ko", "lo", "to", "če"] }, // kolotoče
  { syll: ["čo", "ko", "lá", "da"] }, // čokoláda
  { syll: ["po", "me", "ran", "če"] }, // pomeranče
  { syll: ["kal", "ku", "lač", "ka"] }, // kalkulačka
  { syll: ["au", "to", "bu", "sy"] }, // autobusy
  { syll: ["za", "hrad", "ní", "ci"] }, // zahradníci
];

const DLOUHA_SAMOHLASKA = /[áéíóúůý]/i;

function markSyll(syll: string[], idx: number): string {
  return syll.map((s, i) => (i === idx ? s.toUpperCase() : s)).join("");
}

function ukolPrizvukSlova(item: SlovoL1a): PracticeTask | null {
  const { syll } = item;
  const plain = syll.join("");
  const correct = markSyll(syll, 0);
  const distractors: Distractor[] = [];
  for (let i = 1; i < syll.length; i++) {
    const forma = markSyll(syll, i);
    const posledni = i === syll.length - 1;
    let why: string;
    if (posledni) {
      why = `Přízvuk je tu na poslední slabice – v češtině tam nikdy není. Přízvuk je vždy na první slabice slova.`;
    } else if (DLOUHA_SAMOHLASKA.test(syll[i])) {
      why = `Slabika „${syll[i]}“ je sice dlouhá (má čárku), ale DÉLKA samohlásky s přízvukem nesouvisí. Přízvuk je v češtině vždy na první slabice.`;
    } else {
      why = `Přízvuk je tu posunutý na ${i + 1}. slabiku. V některých jazycích (třeba v angličtině) přízvuk pevné místo nemá, v češtině je ale vždy na první slabice slova.`;
    }
    distractors.push({ value: forma, why });
  }
  return buildChoiceTask(
    `Ve kterém zápisu slova „${plain}“ je VELKÝMI PÍSMENY správně vyznačená přízvučná (důrazem vyslovovaná) slabika?`,
    correct,
    distractors,
    {
      hints: [
        `Řekni si slovo „${plain}“ nahlas a poslechni si, která slabika zní nejdůrazněji.`,
        "Český slovní přízvuk má pevné místo – je vždy na první slabice slova, ať je slovo krátké nebo dlouhé, a ať je v něm dlouhá samohláska (čárka, kroužek) kdekoli.",
      ],
      explanation: `Český přízvuk je vždy na první slabice, proto „${correct}“. Ostatní zápisy vyznačují přízvuk jinde, kde v češtině nikdy není.`,
    },
  );
}

// ── L1b — krátká věta: jaká je její melodie (bez doplňovací otázky) ─────────
interface VetaMelodieL1 {
  sentence: string;
  druh: "klesava" | "stoupava";
  typLabel: string;
}
const VETY_L1B: VetaMelodieL1[] = [
  { sentence: "Venku prší.", druh: "klesava", typLabel: "oznamovací věta" },
  { sentence: "Zavři okno!", druh: "klesava", typLabel: "rozkazovací věta" },
  { sentence: "To je ale krásný dárek!", druh: "klesava", typLabel: "zvolací věta" },
  { sentence: "Ukliď si pokoj!", druh: "klesava", typLabel: "rozkazovací věta" },
  { sentence: "Umíš plavat?", druh: "stoupava", typLabel: "zjišťovací otázka" },
  { sentence: "Pojedeš s námi k moři?", druh: "stoupava", typLabel: "zjišťovací otázka" },
  { sentence: "Máš hotové domácí úkoly?", druh: "stoupava", typLabel: "zjišťovací otázka" },
  { sentence: "Bude dnes odpoledne pršet?", druh: "stoupava", typLabel: "zjišťovací otázka" },
];

function ukolMelodieVety(item: VetaMelodieL1): PracticeTask | null {
  const correct = item.druh === "klesava" ? MELODY_OPTIONS[0] : MELODY_OPTIONS[1];
  const wrongMain = item.druh === "klesava" ? MELODY_OPTIONS[1] : MELODY_OPTIONS[0];
  const whyMain =
    item.druh === "klesava"
      ? `Stoupavá melodie patří zjišťovací otázce (dá se na ni odpovědět ano/ne). Tahle věta je ${item.typLabel} – hlas na konci klesá.`
      : `Klesavá melodie patří oznamovací, rozkazovací nebo zvolací větě. Tahle věta je ${item.typLabel} bez tázacího slova – hlas na konci stoupá.`;
  return buildChoiceTask(
    `Jakou melodii (intonaci) má věta: „${item.sentence}“`,
    correct,
    [{ value: wrongMain, why: whyMain }, ...melodyFillerDistractors()],
    {
      hints: [
        `Řekni si větu „${item.sentence}“ nahlas a všimni si, jestli ti na konci hlas stoupá, nebo klesá.`,
        HINT_TYP_VETY,
      ],
      explanation: `„${item.sentence}“ je ${item.typLabel}, proto má melodii: ${correct}.`,
    },
  );
}

// ── L1c — pojmová otázka: na které slabice je český přízvuk ─────────────────
const L1C_VARIANTY = [
  "Na kterou slabiku padá v češtině hlavní slovní přízvuk?",
  "Kde je v českém slově vždy hlavní přízvuk, ať je slovo krátké, nebo dlouhé?",
  "Podle pravidla o českém přízvuku: na které slabice slova vždy leží?",
  "Čeština má pro přízvuk slova pevné pravidlo. Na které slabice přízvuk vždy je?",
];
const L1C_CORRECT = "na první slabice";
const L1C_DISTRAKTORY: Distractor[] = [
  { value: "na poslední slabice", why: "V češtině přízvuk na poslední slabice nikdy nebývá – to je pravidlo jiných jazyků (třeba francouzštiny)." },
  { value: "na předposlední slabice", why: "Tak je to třeba v polštině, ne v češtině. Český přízvuk je vždy na první slabice slova." },
  { value: "na dlouhé slabice (kde je čárka nebo kroužek)", why: "Délka samohlásky (čárka, kroužek) s přízvukem nesouvisí. Přízvuk je vždy na první slabice, ať je dlouhá, nebo ne." },
];

function ukolPojemPrizvuk(otazka: string): PracticeTask | null {
  return buildChoiceTask(otazka, L1C_CORRECT, L1C_DISTRAKTORY, {
    hints: [
      "Zkus si nahlas říct nějaké delší slovo, třeba „kamarádka“ nebo „televize“, a poslechni si, která slabika zní nejdůrazněji.",
      "Český slovní přízvuk má pevné místo v každém slově, bez ohledu na délku samohlásek nebo na to, kolik má slovo slabik.",
    ],
    explanation: `Český slovní přízvuk padá vždy ${L1C_CORRECT} slova, bez ohledu na jeho délku nebo počet slabik.`,
  });
}

// ── L1d — najdi chybu: jedno ze čtyř slov je vyznačené špatně ───────────────
// Klíčem je ŠPATNÝ zápis, takže správná odpověď nemá velkou první slabiku.
// Chybná pozice: u slova s dlouhou samohláskou mimo 1. slabiku právě ta
// (láká délka), jinak rotace 2./3./poslední slabika.
function chybnaPozice(syll: string[], i: number): number {
  const dlouha = syll.findIndex((s, k) => k > 0 && DLOUHA_SAMOHLASKA.test(s));
  if (dlouha > 0) return dlouha;
  return 1 + (i % (syll.length - 1));
}

function ukolNajdiChybu(i: number): PracticeTask | null {
  const n = SLOVA_L1A.length;
  const chybne = SLOVA_L1A[i].syll;
  const ostatni = [1, 2, 3].map((k) => SLOVA_L1A[(i + k * 3) % n].syll);
  const pos = chybnaPozice(chybne, i);
  const correct = markSyll(chybne, pos);
  const plainChybne = chybne.join("");
  // pořadí slov v zadání = abecední, aby nebylo vidět, které je „to chybné“
  const vypis = [chybne, ...ostatni]
    .map((s) => s.join(""))
    .sort((a, b) => a.localeCompare(b, "cs"))
    .join(", ");
  const distractors: Distractor[] = ostatni.map((s) => ({
    value: markSyll(s, 0),
    why: `Tenhle zápis je v pořádku: velká písmena jsou na první slabice („${s[0]}“), a tam český přízvuk vždy je.`,
  }));
  const dlouhaLakala = DLOUHA_SAMOHLASKA.test(chybne[pos]);
  return buildChoiceTask(
    `Spolužák vyznačoval VELKÝMI PÍSMENY přízvučnou slabiku ve slovech ${vypis}. U jednoho slova se spletl. Který zápis je vyznačený ŠPATNĚ?`,
    correct,
    distractors,
    {
      hints: [
        "U každého zápisu se podívej, KTERÁ slabika je napsaná velkými písmeny – je to ta, kde má přízvuk v češtině být?",
        "Český přízvuk je vždy na první slabice slova. Hledáš tedy zápis, kde velká písmena NEJSOU na začátku slova – pozor, délka samohlásky (čárka) s přízvukem nesouvisí.",
      ],
      explanation: dlouhaLakala
        ? `Ve slově „${plainChybne}“ spolužák vyznačil dlouhou slabiku „${chybne[pos]}“ – spletl si délku s přízvukem. Správně je „${markSyll(chybne, 0)}“, přízvuk je na první slabice.`
        : `Ve slově „${plainChybne}“ je vyznačená ${pos + 1}. slabika, ale český přízvuk je vždy na první slabice – správně „${markSyll(chybne, 0)}“.`,
    },
  );
}

// ── L2a — jednoslabičná předložka + jméno: jeden přízvukový takt ────────────
// Jen SLABIČNÉ předložky (se samohláskou). Neslabičné k/v/s/z sem nepatří:
// „k lesu“ se vyslovuje [kle-su], přízvučná slabika je „kle“, ne samotné „k“.
interface FrazePolozka {
  prep: string;
  syll: string[];
}
const FRAZE_L2A: FrazePolozka[] = [
  { prep: "do", syll: ["le", "sa"] }, // do lesa
  { prep: "na", syll: ["sto", "le"] }, // na stole
  { prep: "pod", syll: ["mos", "tem"] }, // pod mostem
  { prep: "za", syll: ["ško", "lou"] }, // za školou
  { prep: "u", syll: ["ba", "bič", "ky"] }, // u babičky
  { prep: "od", syll: ["ře", "ky"] }, // od řeky
  { prep: "o", syll: ["zví", "řa", "tech"] }, // o zvířatech
  { prep: "po", syll: ["ces", "tě"] }, // po cestě
  { prep: "před", syll: ["do", "mem"] }, // před domem
  { prep: "přes", syll: ["po", "le"] }, // přes pole
  { prep: "nad", syll: ["ryb", "ní", "kem"] }, // nad rybníkem
  { prep: "bez", syll: ["dešt", "ní", "ku"] }, // bez deštníku
];

function ukolPredlozkovyTakt(item: FrazePolozka): PracticeTask | null {
  const noun = item.syll.join("");
  const correct = `${item.prep.toUpperCase()} ${noun}`;
  const d1 = `${item.prep} ${markSyll(item.syll, 0)}`;
  const d2 = `${item.prep} ${markSyll(item.syll, item.syll.length - 1)}`;
  const d3 = `${item.prep.toUpperCase()} ${markSyll(item.syll, 0)}`;
  return buildChoiceTask(
    `Jak se přízvukuje spojení „${item.prep} ${noun}“? Vyber zápis, kde je VELKÝMI PÍSMENY vyznačená přízvučná slabika.`,
    correct,
    [
      { value: d1, why: `Jednoslabičná předložka „${item.prep}“ se slovem „${noun}“ tvoří jeden přízvukový takt a PŘEBÍRÁ přízvuk. Tenhle zápis předložku přeskakuje a dává přízvuk jen na jméno.` },
      { value: d2, why: `Přízvuk je tu na poslední slabice jména – v češtině tam nikdy není, a navíc předložka s jménem tvoří jeden takt, kde přízvuk nese ona.` },
      { value: d3, why: `Takhle by to vypadalo, kdyby „${item.prep} ${noun}“ byly dva samostatné přízvukové takty. Jednoslabičná předložka ale s jménem splývá v jeden takt – přízvuk je jen jeden, na předložce.` },
    ],
    {
      hints: [
        `Předložka „${item.prep}“ má jen jednu slabiku. Zkus říct spojení „${item.prep} ${noun}“ nahlas jako jedno slovo.`,
        "Přízvuk v češtině má pevné místo – je na první slabice slova. Jednoslabičná předložka s následujícím jménem tvoří jeden přízvukový takt (jedno „slovo“ pro účely přízvuku), takže přízvuk přebírá právě ona.",
      ],
      explanation: `Jednoslabičná předložka „${item.prep}“ a jméno „${noun}“ tvoří jeden přízvukový takt. Přízvuk padá na první slabiku celého taktu, a to je předložka – proto „${correct}“.`,
    },
  );
}

// ── L2b — rozdělení věty na přízvukové takty (prototypy, bez klitik) ────────
interface TaktRozdeleniPolozka {
  prep: string;
  noun: string;
  verb: string;
  subject: string;
}
const TAKTY_L2B: TaktRozdeleniPolozka[] = [
  { prep: "Po", noun: "obědě", verb: "odpočívali", subject: "turisté" },
  { prep: "Na", noun: "zahradě", verb: "rostou", subject: "jahody" },
  { prep: "Pod", noun: "mostem", verb: "plavaly", subject: "kachny" },
  { prep: "U", noun: "rybníka", verb: "stály", subject: "vrby" },
  { prep: "Za", noun: "domem", verb: "štěkal", subject: "pes" },
  { prep: "Před", noun: "školou", verb: "čekali", subject: "žáci" },
];

function ukolRozdeleniTaktu(item: TaktRozdeleniPolozka): PracticeTask | null {
  const { prep, noun, verb, subject } = item;
  const sentence = `${prep} ${noun} ${verb} ${subject}.`;
  const correct = `${prep} ${noun} / ${verb} / ${subject}`;
  const distrA = `${prep} / ${noun} / ${verb} / ${subject}`;
  const distrB = `${prep} ${noun} / ${verb} ${subject}`;
  const distrC = `${prep} ${noun} ${verb} / ${subject}`;
  return buildChoiceTask(
    `Věta „${sentence}“ se dělí na přízvukové takty (skupiny slov s jedním přízvukem). Lomítko „/“ ukazuje, kde končí jeden takt a začíná další – NENÍ to pauza, větu říkáš plynule. Které rozdělení je správné?`,
    correct,
    [
      { value: distrA, why: `Jednoslabičná předložka „${prep.toLowerCase()}“ netvoří samostatný takt – se jménem „${noun}“ patří do jednoho taktu a přízvuk nese ona.` },
      { value: distrB, why: `„${verb}“ a „${subject}“ jsou dvě samostatná plnovýznamová slova, každé má svůj vlastní přízvuk – netvoří jeden takt.` },
      { value: distrC, why: `„${prep.toLowerCase()} ${noun}“ je už sám o sobě jeden takt. Sloveso „${verb}“ k němu nepatří, má vlastní přízvuk.` },
    ],
    {
      hints: [
        "Přízvukový takt je skupina slov, která se vyslovují s jedním přízvukem – jednoslabičná předložka se do taktu spojuje s jménem, které za ní stojí.",
        "Každé další plnovýznamové slovo (sloveso, podstatné jméno) má svůj vlastní přízvuk a tvoří vlastní takt. Spočítej, kolik plnovýznamových slov (a předložek k nim) věta má.",
      ],
      explanation: `„${prep} ${noun}“ tvoří jeden takt (předložka splývá se jménem), „${verb}“ a „${subject}“ jsou každé svůj vlastní takt – proto „${correct}“.`,
    },
  );
}

// ── L2c — melodie otázek: doplňovací (s tázacím slovem) × zjišťovací ────────
interface OtazkaMelodiePolozka {
  q: string;
  druh: "doplnovaci" | "zjistovaci";
  tazaciSlovo?: string;
}
const OTAZKY_L2C: OtazkaMelodiePolozka[] = [
  { q: "Kdo přišel na oslavu?", druh: "doplnovaci", tazaciSlovo: "Kdo" },
  { q: "Kdy odjíždíš na tábor?", druh: "doplnovaci", tazaciSlovo: "Kdy" },
  { q: "Kam jedete o prázdninách?", druh: "doplnovaci", tazaciSlovo: "Kam" },
  { q: "Proč jsi dnes smutný?", druh: "doplnovaci", tazaciSlovo: "Proč" },
  { q: "Jak dlouho trvá ten film?", druh: "doplnovaci", tazaciSlovo: "Jak" },
  { q: "Co si dáš k obědu?", druh: "doplnovaci", tazaciSlovo: "Co" },
  { q: "Přišel Petr na oslavu?", druh: "zjistovaci" },
  { q: "Odjíždíš zítra na tábor?", druh: "zjistovaci" },
  { q: "Pojedete o prázdninách k moři?", druh: "zjistovaci" },
  { q: "Jsi dneska smutný?", druh: "zjistovaci" },
  { q: "Trvá ten film dlouho?", druh: "zjistovaci" },
  { q: "Dáš si k obědu polévku?", druh: "zjistovaci" },
];

function ukolMelodieOtazky(item: OtazkaMelodiePolozka): PracticeTask | null {
  const correct = item.druh === "doplnovaci" ? MELODY_OPTIONS[0] : MELODY_OPTIONS[1];
  const wrongMain = item.druh === "doplnovaci" ? MELODY_OPTIONS[1] : MELODY_OPTIONS[0];
  const whyMain =
    item.druh === "doplnovaci"
      ? `Stoupavou melodii má zjišťovací otázka BEZ tázacího slova. Tahle otázka ale začíná tázacím slovem „${item.tazaciSlovo}“, proto klesá.`
      : `Klesavou melodii má doplňovací otázka s tázacím slovem (kdo, kdy, kam…). Tahle otázka žádné tázací slovo nemá, jde jen o obrácený slovosled – proto stoupá.`;
  return buildChoiceTask(
    `Jakou melodii má tato otázka: „${item.q}“`,
    correct,
    [{ value: wrongMain, why: whyMain }, ...melodyFillerDistractors()],
    {
      hints: [
        `Podívej se, jestli otázka „${item.q}“ začíná tázacím slovem (kdo, co, kde, kam, kdy, proč, jak…), nebo ne.`,
        "Doplňovací otázka s tázacím slovem má klesavou melodii (jako oznamovací věta). Zjišťovací otázka bez tázacího slova, na kterou se dá odpovědět ano/ne, má stoupavou melodii.",
      ],
      explanation:
        item.druh === "doplnovaci"
          ? `Otázka začíná tázacím slovem „${item.tazaciSlovo}“, je to doplňovací otázka – ta má klesavou melodii.`
          : `Otázka nemá žádné tázací slovo, jen obrácený slovosled (sloveso na začátku) – je to zjišťovací otázka, ta má stoupavou melodii.`,
    },
  );
}

// ── L3a — pauza mění smysl věty ──────────────────────────────────────────────
// (1) Dvojice sloves s „ne“: „V1 | neV2.“ = dělej V1, nedělej V2;
//     „V1 ne | V2.“ = nedělej V1, dělej V2.
// (2) Věta s vsuvkou: „A řekl | B je líný.“ = mluví A, líný je B;
//     „A | řekl B | je líný.“ = mluví B, líný je A.
// Distraktory = blízké omyly: opačná pauza, dvojí/žádná/jen jedna pauza.
interface DvojiceSloves {
  v1: string; // sloveso 1 ve tvaru se začátečním velkým písmenem (věta začíná jím)
  v2: string; // sloveso 2, malými písmeny
}
const DVOJICE_SLOVES: DvojiceSloves[] = [
  { v1: "Jíst", v2: "čekat" },
  { v1: "Mluvit", v2: "poslouchat" },
  { v1: "Utíkat", v2: "křičet" },
  { v1: "Skákat", v2: "běhat" },
  { v1: "Psát", v2: "kreslit" },
  { v1: "Zpívat", v2: "tančit" },
];

function ukolPauzaVyznam(item: DvojiceSloves, ktera: "a" | "b"): PracticeTask | null {
  const v1l = item.v1.toLowerCase();
  const veta = `${item.v1} ne${item.v2}.`;
  const optA = `${item.v1} | ne${item.v2}.`;
  const optB = `${item.v1} ne | ${item.v2}.`;
  const dvoji = `${item.v1} | ne | ${item.v2}.`;
  const zadna = `${item.v1} ne${item.v2}. (bez pauzy)`;
  const meaningA = `máš ${v1l}, a ne ${item.v2}`;
  const meaningB = `máš ${item.v2}, a ne ${v1l}`;
  const correct = ktera === "a" ? optA : optB;
  const jiny = ktera === "a" ? optB : optA;
  const jinyWhy =
    ktera === "a"
      ? `„${optB}“ znamená přesný OPAK: „ne“ se připojí k „${v1l}“, takže ${meaningB}.`
      : `„${optA}“ znamená přesný OPAK: „ne“ se připojí k „${item.v2}“, takže ${meaningA}.`;
  return buildChoiceTask(
    `Věta „${veta}“ (bez čárky) se dá přečíst dvojím způsobem. Kam patří pauza, aby věta znamenala: ${ktera === "a" ? meaningA : meaningB}?`,
    correct,
    [
      { value: jiny, why: jinyWhy },
      { value: dvoji, why: `Se dvěma pauzami zůstane „ne“ viset samostatně uprostřed a posluchač nepozná, jestli patří k „${v1l}“, nebo k „${item.v2}“.` },
      { value: zadna, why: "Bez pauzy zůstane věta dvojznačná – teprve pauza rozhodne, ke kterému slovesu se „ne“ připojí." },
    ],
    {
      hints: [
        `Přečti si větu „${veta}“ nahlas dvakrát – jednou s krátkou pauzou hned po „${v1l}“, podruhé s pauzou až po „ne“.`,
        "Pauza (frázování) rozhoduje, ke kterému slovesu se „ne“ připojí. Sloveso, ke kterému se „ne“ připojí, se NEdělá; druhé sloveso dělat MÁŠ.",
      ],
      explanation: `Pauza „${correct}“ znamená: ${ktera === "a" ? meaningA : meaningB}. Podle toho, kde je pauza, se „ne“ váže k jinému slovesu.`,
    },
  );
}

interface VsuvkaPolozka {
  a: string; // první jméno (začátek věty)
  b: string; // druhé jméno
  rekl: string; // „řekl“ / „řekla“ (obě jména mají stejný rod)
  vlastnost: string; // přídavné jméno ve shodě s oběma jmény
}
const VSUVKA_POLOZKY: VsuvkaPolozka[] = [
  { a: "Petr", b: "Pavel", rekl: "řekl", vlastnost: "líný" },
  { a: "Jana", b: "Eva", rekl: "řekla", vlastnost: "unavená" },
  { a: "Tomáš", b: "Honza", rekl: "řekl", vlastnost: "nemocný" },
  { a: "Klára", b: "Lucie", rekl: "řekla", vlastnost: "smutná" },
];

function ukolPauzaVsuvka(item: VsuvkaPolozka, kdoMluvi: "a" | "b"): PracticeTask | null {
  const { a, b, rekl, vlastnost } = item;
  const veta = `${a} ${rekl} ${b} je ${vlastnost}.`;
  const optA = `${a} ${rekl} | ${b} je ${vlastnost}.`; // mluví A o B
  const optB = `${a} | ${rekl} ${b} | je ${vlastnost}.`; // mluví B o A
  const jednaPauza = `${a} | ${rekl} ${b} je ${vlastnost}.`;
  const spatnaPauza = `${a} ${rekl} ${b} | je ${vlastnost}.`;
  const mluvci = kdoMluvi === "a" ? a : b;
  const oKom = kdoMluvi === "a" ? b : a;
  const correct = kdoMluvi === "a" ? optA : optB;
  const jiny = kdoMluvi === "a" ? optB : optA;
  const jinyWhy =
    kdoMluvi === "a"
      ? `„${optB}“ dělá z „${rekl} ${b}“ vsuvku – mluví tedy ${b} a ${vlastnost} je ${a}. To je opačný smysl.`
      : `„${optA}“ znamená, že mluví ${a} a ${vlastnost} je ${b}. To je opačný smysl.`;
  return buildChoiceTask(
    `Věta „${veta}“ se bez čárek dá přečíst dvojím způsobem. Kam patří pauzy, aby věta znamenala: ${mluvci} říká, že ${oKom} je ${vlastnost}?`,
    correct,
    [
      { value: jiny, why: jinyWhy },
      { value: jednaPauza, why: `Jedna pauza tady nestačí. Když mluví ${b}, je „${rekl} ${b}“ vsuvka a musí být oddělená pauzou z OBOU stran. Když mluví ${a}, patří jediná pauza až za „${rekl}“.` },
      { value: spatnaPauza, why: `Pauza až za jménem „${b}“ spojí „${a} ${rekl} ${b}“ do jednoho celku – posluchač nepozná, kdo mluví a o kom je řeč.` },
    ],
    {
      hints: [
        `Zeptej se: kdo mluví? Přečti si větu nahlas s pauzou jen za „${rekl}“ a potom s pauzami kolem „${rekl} ${b}“ a porovnej smysl.`,
        "Když je „řekl/řekla + jméno“ uprostřed věty jako vsuvka (kdo to říká), odděluje se pauzou z obou stran. Když mluví první jméno, stačí jedna pauza za slovesem „řekl/řekla“.",
      ],
      explanation:
        kdoMluvi === "a"
          ? `„${correct}“ – mluví ${a} a říká: „${b} je ${vlastnost}.“ Proto stačí jedna pauza za „${rekl}“.`
          : `„${correct}“ – „${rekl} ${b}“ je vsuvka (mluví ${b}), proto je oddělená pauzou z obou stran. ${b} říká: „${a} je ${vlastnost}.“`,
    },
  );
}

// ── L3b/L3c — větný důraz odpovídá na otázku (a naopak) ──────────────────────
interface DurazPolozka {
  chunks: [string, string, string, string];
  otazky: [string, string, string, string];
}
const DURAZ_POLOZKY: DurazPolozka[] = [
  {
    chunks: ["Tomáš", "jede", "zítra", "do Brna"],
    otazky: ["Kdo jede zítra do Brna?", "Jede Tomáš zítra do Brna, nebo tam jde pěšky?", "Kdy Tomáš jede do Brna?", "Kam Tomáš zítra jede?"],
  },
  {
    chunks: ["Kamila", "zpívá", "každý večer", "v kuchyni"],
    otazky: ["Kdo zpívá každý večer v kuchyni?", "Co Kamila dělá každý večer v kuchyni?", "Kdy Kamila zpívá v kuchyni?", "Kde Kamila zpívá každý večer?"],
  },
  {
    chunks: ["Filip", "opravuje", "o víkendu", "kolo"],
    otazky: ["Kdo opravuje o víkendu kolo?", "Co Filip dělá o víkendu s kolem?", "Kdy Filip opravuje kolo?", "Co Filip o víkendu opravuje?"],
  },
  {
    chunks: ["Eliška", "kreslí", "ráno", "obrázek"],
    otazky: ["Kdo kreslí ráno obrázek?", "Co Eliška ráno dělá s obrázkem?", "Kdy Eliška kreslí obrázek?", "Co Eliška ráno kreslí?"],
  },
  {
    chunks: ["Jakub", "nese", "domů", "těžký batoh"],
    otazky: ["Kdo nese domů těžký batoh?", "Co Jakub dělá s těžkým batohem cestou domů?", "Kam Jakub nese těžký batoh?", "Co Jakub nese domů?"],
  },
  {
    chunks: ["Věra", "čte", "večer", "knihu"],
    otazky: ["Kdo čte večer knihu?", "Co Věra večer dělá s knihou?", "Kdy Věra čte knihu?", "Co Věra večer čte?"],
  },
];

function sentenceWithEmphasis(chunks: readonly string[], idx: number): string {
  return `${chunks.map((c, i) => (i === idx ? c.toUpperCase() : c)).join(" ")}.`;
}

function ukolDurazNaOtazku(item: DurazPolozka, idx: number): PracticeTask | null {
  const correct = sentenceWithEmphasis(item.chunks, idx);
  const distractors: Distractor[] = [0, 1, 2, 3]
    .filter((i) => i !== idx)
    .map((i) => ({
      value: sentenceWithEmphasis(item.chunks, i),
      why: `Tady je zdůrazněné jiné slovo („${item.chunks[i]}“), to odpovídá na otázku „${item.otazky[i]}“, ne na otázku ze zadání.`,
    }));
  return buildChoiceTask(
    `Věta zní: „${item.chunks.join(" ")}.“ Na otázku „${item.otazky[idx]}“ odpovíš tak, že ve větě zdůrazníš (větným přízvukem) správné slovo. Která varianta věty to je?`,
    correct,
    distractors,
    {
      hints: [
        "Zdůrazněné slovo nese NOVOU informaci – je to přesně to slovo, na které se otázka ptá.",
        "Přečti si otázku a zkus na ni odpovědět jedním slovem nebo slovním spojením z věty. Přesně to slovo má být ve variantě zdůrazněné (velkými písmeny).",
      ],
      explanation: `Otázka „${item.otazky[idx]}“ se ptá na „${item.chunks[idx]}“ – proto je zdůrazněné (větným přízvukem) právě tohle slovo: „${correct}“.`,
    },
  );
}

function ukolObracenySmer(item: DurazPolozka, idx: number): PracticeTask | null {
  const sentence = sentenceWithEmphasis(item.chunks, idx);
  const correct = item.otazky[idx];
  const distractors: Distractor[] = [0, 1, 2, 3]
    .filter((i) => i !== idx)
    .map((i) => ({
      value: item.otazky[i],
      why: `Na otázku „${item.otazky[i]}“ by muselo být zdůrazněné „${item.chunks[i]}“, ne „${item.chunks[idx]}“.`,
    }));
  return buildChoiceTask(
    `Věta „${sentence}“ má zdůrazněnou (větným přízvukem) jednu část. Na kterou otázku tahle věta odpovídá?`,
    correct,
    distractors,
    {
      hints: [
        "Najdi ve větě slovo napsané VELKÝMI PÍSMENY – to nese novou informaci, na kterou se otázka ptá.",
        "Zkus si na každou nabízenou otázku odpovědět tou samou větou a zjisti, ke kterému slovu se zdůraznění hodí.",
      ],
      explanation: `Zdůrazněné je slovo „${item.chunks[idx]}“ – to je přesně to, na co se ptá otázka „${correct}“.`,
    },
  );
}

// ── L3c (doplněk) — co mluvčí důrazem naznačuje ──────────────────────────────
interface NaznaceniPolozka {
  sentence: string;
  correct: string;
  distractors: Distractor[];
}
const NAZNACENI_POLOZKY: NaznaceniPolozka[] = [
  {
    sentence: "Petr koupil MLÉKO.",
    correct: "že Petr koupil mléko, ne něco jiného (třeba chleba)",
    distractors: [
      { value: "že mléko koupil Petr, ne někdo jiný", why: "To by platilo, kdyby bylo zdůrazněné slovo „Petr“ (PETR koupil mléko). Tady je ale zdůrazněné „mléko“." },
      { value: "že Petr mléko koupil, a ne třeba ukradl", why: "To by platilo, kdyby bylo zdůrazněné sloveso (Petr KOUPIL mléko). Tady je zdůrazněné „mléko“, ne sloveso." },
      { value: "že Petr koupil mléko včera, ne dnes", why: "Věta žádný čas neobsahuje. Zdůrazněné je slovo „mléko“, věta říká, CO Petr koupil." },
    ],
  },
  {
    sentence: "MARIE napsala dopis.",
    correct: "že dopis napsala Marie, ne někdo jiný",
    distractors: [
      { value: "že Marie napsala dopis, a ne třeba pohlednici", why: "To by platilo, kdyby bylo zdůrazněné slovo „dopis“ (Marie napsala DOPIS). Tady je zdůrazněné „Marie“." },
      { value: "že Marie dopis napsala, a ne jen chtěla napsat", why: "To by platilo, kdyby bylo zdůrazněné sloveso (Marie NAPSALA dopis). Tady je zdůrazněné „Marie“, ne sloveso." },
      { value: "že Marie napsala dopis ráno, ne večer", why: "Věta o žádném čase nemluví. Zdůrazněné je slovo „Marie“, věta říká, KDO dopis napsal." },
    ],
  },
  {
    sentence: "Táta OPRAVIL pračku.",
    correct: "že táta pračku opravdu opravil (dokončil to), a ne jen chtěl opravit",
    distractors: [
      { value: "že pračku opravil táta, ne někdo jiný", why: "To by platilo, kdyby bylo zdůrazněné slovo „táta“ (TÁTA opravil pračku). Tady je zdůrazněné sloveso „opravil“." },
      { value: "že táta opravil pračku, a ne třeba ledničku", why: "To by platilo, kdyby bylo zdůrazněné slovo „pračku“ (táta opravil PRAČKU). Tady je zdůrazněné sloveso „opravil“." },
      { value: "že táta pračku opravil včera, ne dnes", why: "Věta o žádném čase nemluví. Zdůrazněné je sloveso „opravil“, věta říká, že se oprava opravdu STALA." },
    ],
  },
  {
    sentence: "Bratr uklidil POKOJ.",
    correct: "že bratr uklidil pokoj, ne něco jiného (třeba kuchyni)",
    distractors: [
      { value: "že pokoj uklidil bratr, ne někdo jiný", why: "To by platilo, kdyby bylo zdůrazněné slovo „bratr“ (BRATR uklidil pokoj). Tady je zdůrazněné „pokoj“." },
      { value: "že bratr pokoj uklidil, a ne jen chtěl uklidit", why: "To by platilo, kdyby bylo zdůrazněné sloveso (bratr UKLIDIL pokoj). Tady je zdůrazněné „pokoj“, ne sloveso." },
      { value: "že bratr uklidil pokoj ráno, ne večer", why: "Věta o žádném čase nemluví. Zdůrazněné je slovo „pokoj“, věta říká, CO bratr uklidil." },
    ],
  },
];

function ukolNaznaceni(item: NaznaceniPolozka): PracticeTask | null {
  return buildChoiceTask(
    `Věta „${item.sentence}“ má zdůrazněné (VELKÝMI písmeny) jedno slovo. Co tím mluvčí naznačuje?`,
    item.correct,
    item.distractors,
    {
      hints: [
        "Najdi ve větě slovo napsané VELKÝMI PÍSMENY – to je to, na co mluvčí klade důraz.",
        "Zdůrazněné slovo říká, co PLATÍ, a nepřímo naznačuje, že jiná možnost na jeho místě neplatí (jiná věc, jiný člověk, nebo že se to opravdu stalo).",
      ],
      explanation: `Zdůrazněné slovo nese novou, klíčovou informaci – mluvčí tím naznačuje, že právě tohle platí, a ne jiná možnost.`,
    },
  );
}

// ── L3d — volba melodie v situaci: zájmeno na začátku NENÍ tázací slovo ─────
// Otevřený výčet („například“) — tázacích slov je víc (kudy, dokdy, nač…).
const TAZACI_SLOVA_PRIKLAD =
  "například kdo, co, kde, kam, kudy, kdy, proč, jak, jaký, který, čí, kolik, odkud";
const MELODIE_TRANSFER_VETY = [
  "Ty jsi to dopsal?",
  "Vy jste už jedli?",
  "On už odešel?",
  "My pojedeme taky?",
  "Ten pes je tvůj?",
  "Váš táta je doma?",
];

function ukolMelodieTransfer(q: string): PracticeTask | null {
  const prvniSlovo = q.split(" ")[0];
  return buildChoiceTask(
    `Jakou melodii má tato otázka: „${q}“`,
    MELODY_OPTIONS[1],
    [
      {
        value: MELODY_OPTIONS[0],
        why: `„${prvniSlovo}“ vypadá, jako by mohlo být tázací slovo, ale není – tázací slova jsou ${TAZACI_SLOVA_PRIKLAD}. Zájmena jako „ty“, „vy“, „on“, „ten“, „váš“ mezi ně nepatří – otázka bez tázacího slova má stoupavou melodii.`,
      },
      ...melodyFillerDistractors(),
    ],
    {
      hints: [
        `Podívej se pozorně na první slovo otázky „${q}“ – je to opravdu tázací slovo jako „kdo“ nebo „co“, nebo jen podobné slovo?`,
        `Tázací slova jsou ${TAZACI_SLOVA_PRIKLAD}. Zájmena jako „ty“, „vy“, „on“, „ten“, „váš“ mezi ně NEPATŘÍ – otázka bez tázacího slova má stoupavou melodii.`,
      ],
      explanation: `Slovo „${prvniSlovo}“ není tázací slovo (tázací jsou ${TAZACI_SLOVA_PRIKLAD}) – otázka tedy tázací slovo nemá a má stoupavou melodii.`,
    },
  );
}

// ── Generátor ────────────────────────────────────────────────────────────────
function notNull(t: PracticeTask | null): t is PracticeTask {
  return t !== null;
}

function poolL1(): PracticeTask[] {
  const a = SLOVA_L1A.map(ukolPrizvukSlova);
  const b = VETY_L1B.map(ukolMelodieVety);
  const c = L1C_VARIANTY.map(ukolPojemPrizvuk);
  const d = SLOVA_L1A.map((_, i) => ukolNajdiChybu(i));
  return [...a, ...b, ...c, ...d].filter(notNull);
}

function poolL2(): PracticeTask[] {
  const a = FRAZE_L2A.map(ukolPredlozkovyTakt);
  const b = TAKTY_L2B.map(ukolRozdeleniTaktu);
  const c = OTAZKY_L2C.map(ukolMelodieOtazky);
  return [...a, ...b, ...c].filter(notNull);
}

function poolL3(): PracticeTask[] {
  const a = [
    ...DVOJICE_SLOVES.flatMap((item) => [ukolPauzaVyznam(item, "a"), ukolPauzaVyznam(item, "b")]),
    ...VSUVKA_POLOZKY.flatMap((item) => [ukolPauzaVsuvka(item, "a"), ukolPauzaVsuvka(item, "b")]),
  ];
  const b = DURAZ_POLOZKY.flatMap((item, i) =>
    [0, 1, 2, 3].filter((idx) => idx !== i % 4).map((idx) => ukolDurazNaOtazku(item, idx)),
  );
  const c = DURAZ_POLOZKY.flatMap((item, i) =>
    [0, 1, 2, 3].filter((idx) => idx !== i % 4).map((idx) => ukolObracenySmer(item, idx)),
  );
  const d = NAZNACENI_POLOZKY.map(ukolNaznaceni);
  const e = MELODIE_TRANSFER_VETY.map(ukolMelodieTransfer);
  return [...a, ...b, ...c, ...d, ...e].filter(notNull);
}

/** Bez losování — bance stačí plný výčet; žádný stav mezi voláními. */
function gen(level: number): PracticeTask[] {
  return level <= 1 ? poolL1() : level === 2 ? poolL2() : poolL3();
}

// ── Topic ────────────────────────────────────────────────────────────────────
export const PRIZVUK_INTONACE_FRAZOVANI: TopicMetadata[] = [
  {
    id: "g6-cjl-prizvuk-intonace-frazovani-6",
    rvpNodeId: "g6-cjl-jazykova-vychova-zvukova-stranka-jazyka-prizvuk-intonace-frazovani",
    displayName: "Přízvuk, intonace, frázování",
    title: "Přízvuk, intonace, frázování",
    studentTitle: "Jak věta zní: přízvuk, melodie, pauzy",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Poznáš, kam padá přízvuk, jak věta zní a kde udělat pauzu.",
    keywords: ["přízvuk", "intonace", "melodie věty", "frázování", "pauza", "větný důraz", "přízvukový takt"],
    goals: [
      "Určit, na kterou slabiku padá slovní přízvuk, i ve spojení s jednoslabičnou předložkou.",
      "Rozpoznat melodii věty podle typu (oznamovací, rozkazovací, zvolací, zjišťovací a doplňovací otázka).",
      "Najít pauzu a větný důraz, které mění smysl věty, a poznat, na kterou otázku věta odpovídá.",
    ],
    boundaries: [
      "Bez zvukových nahrávek — všechno se řeší jen z psaného textu pomocí grafického značení (VELKÁ PÍSMENA, slovní popis melodie, svislá čára pro pauzu).",
      "Sporné jevy (klitiky jako se/jsem/mi, vokalizované předložky ve/se/ze, jemné odstíny polokadence) se nepoužívají ani jako klíč, ani jako distraktor.",
      "Bez fonetického přepisu ve hranatých závorkách (spodoba znělosti) — to je jiné podtéma zvukové stránky jazyka.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Český slovní přízvuk je vždy na první slabice (i s předložkou, která s jménem tvoří jeden takt). Klesavou melodii má oznamovací, rozkazovací, zvolací věta a doplňovací otázka s tázacím slovem; stoupavou má zjišťovací otázka bez tázacího slova.",
      steps: [
        "Řekni si větu nebo slovo nahlas a poslouchej, kde je nejdůraznější slabika, jestli hlas na konci stoupá nebo klesá, a kde přirozeně uděláš pauzu.",
        "U otázky zkontroluj, jestli začíná skutečným tázacím slovem (kdo, co, kde, kdy, proč, jak…) — to rozhoduje o melodii, ne otazník sám.",
        "U pauzy a důrazu si zkus větu přečíst s různým místem pauzy nebo s jiným zdůrazněným slovem a porovnej, který smysl odpovídá zadání.",
      ],
      commonMistake: "Posouvání přízvuku na jinou než první slabiku (i při zaměnění délky samohlásky za přízvuk), opomíjení předložky v přízvukovém taktu, a přiřazování stoupavé melodie i doplňovací otázce s tázacím slovem.",
      example: "„DO lesa“ — jednoslabičná předložka přebírá přízvuk. „Kdo přišel?“ — doplňovací otázka s tázacím slovem má klesavou melodii, i když je to otázka.",
    },
  },
];
