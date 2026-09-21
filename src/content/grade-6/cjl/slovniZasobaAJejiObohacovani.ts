/**
 * Čeština 6. ročník — Slovní zásoba a její obohacování (select_one).
 *
 * Skill: rozpoznat způsob, jakým vzniklo nové slovo/pojmenování — odvozování
 * (předponou/příponou), skládání, zkracování (zkratka × zkratkové slovo),
 * přejímání z cizího jazyka, sousloví, změna významu.
 * Synonyma/antonyma/homonyma sem NEPATŘÍ (sesterské téma).
 *
 *  • L1 — rozcvička z 5. ročníku: výchozí slovo/slova jsou přímo v zadání,
 *    žák jen pojmenuje způsob. 4 šablony (a–d) rovnoměrně, banka 6 položek
 *    na způsob.
 *  • L2 — použití bez nápovědy: slovo je ve větě ze života šesťáka, výchozí
 *    slovo v zadání není. Zvlášť rozlišuje zkratku a zkratkové slovo a učí
 *    poznat sousloví jako jedno pojmenování.
 *  • L3 — analýza a přenos: pasti se zdánlivou stavbou (předpona/přípona
 *    vypadá jako druhé slovo; složenina vypadá jako jedno slovo), změna
 *    významu domácího slova, inverzní otázky (které NE-), dvoukrokové úlohy
 *    se dvěma jmenovanými slovy. Slova jsou jiná než v L1 a L2.
 *    Univerbizace (minerálka) je záměrně vynechaná — učebnice ji řadí různě.
 *
 * Chybový model (4 typické chyby šesťáka), napříč úrovněmi:
 *  1. Předponu bere jako druhé slovo (přepsat/nadzemní → "skládáním").
 *  2. Viditelný kořen (voda, zahrada) svádí ke skládání, i když jde o jeden
 *     kořen + přípona (vodník, zahrádkář); naopak složeninu psanou vcelku
 *     (velryba) nepozná.
 *  3. Plete zkratku (čte se po písmenech) a zkratkové slovo (čte se vcelku),
 *     sousloví se složeninou.
 *  4. Nový význam domácího slova (myš, noha stolu) považuje za přejaté slovo
 *     nebo za nové slovo vzniklé odvozením.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, type Distractor } from "./_shared";

// ── Odpovědní kategorie (jednotný tvar — instrumentál způsobu) ────────────
const ODVOZ = "odvozováním";
const SKLAD = "skládáním";
const ZKRAC = "zkracováním";
const PREJEM = "přejímáním z cizího jazyka";
const SOUSLOVI = "vytvořením sousloví";
const ZMENA = "změnou významu";

// ── Feedback šablony pro čtyři "obecné" distraktory (L1) ──────────────────
function fbOdvozWrong(word: string, note: string): string {
  return `„${word}“ nevzniklo příponou ani předponou z jednoho základu — ${note}`;
}
function fbSkladWrong(note: string): string {
  return `Skládání spojuje DVA slovní základy v jedno nové slovo. ${note}`;
}
function fbZkracWrong(note: string): string {
  return `Zkracování zkracuje delší víceslovný název na kratší podobu (třeba ZŠ = základní škola). ${note}`;
}
function fbPrejemWrong(note: string): string {
  return `Přejímání znamená, že slovo přišlo z cizího jazyka. ${note}`;
}

// ── L1(a) — odvozování: výchozí slovo v zadání ────────────────────────────
interface OdvozPolozka { word: string; base: string; note: string; zdrobnelina?: boolean; skladNote: string }
const ODVOZOVANI: OdvozPolozka[] = [
  { word: "zahradník", base: "zahrada", note: "přípona -ník", skladNote: "Přípona -ník není samostatné slovo, jen mění „zahrada“ na „ten, kdo se o ni stará“." },
  { word: "lesník", base: "les", note: "přípona -ník", skladNote: "Přípona -ník není samostatné slovo, jen mění „les“ na „ten, kdo o něj pečuje“." },
  { word: "učitel", base: "učit", note: "přípona -tel", skladNote: "Přípona -tel není samostatné slovo, jen mění sloveso „učit“ na osobu, která učí." },
  { word: "hráč", base: "hrát", note: "přípona -č", skladNote: "Přípona -č není samostatné slovo, jen mění sloveso „hrát“ na osobu, která hraje." },
  { word: "kočička", base: "kočka", note: "přípona -ička", zdrobnelina: true, skladNote: "Přípona -ička není samostatné slovo, jen dělá ze slova „kočka“ zdrobnělinu." },
  { word: "přepsat", base: "psát", note: "předpona pře-", skladNote: "„Pře-“ je předpona, ne samostatné slovo. Složenina potřebuje dva základy (třeba voda + pád), tady je jen jeden — základ slova „psát“." },
];

function odvozL1(p: OdvozPolozka): PracticeTask | null {
  const distraktory: Distractor[] = [
    { value: SKLAD, why: p.skladNote },
    { value: ZKRAC, why: fbZkracWrong(`Slovo „${p.word}“ nevzniklo zkrácením delšího názvu, ale odvozením ze slova „${p.base}“.`) },
    { value: PREJEM, why: fbPrejemWrong(`Slovo „${p.word}“ je domácí, odvozené ze slova „${p.base}“ — nepřišlo z ciziny.`) },
  ];
  const zdrob = p.zdrobnelina ? " Vznikla tak zdrobnělina." : "";
  return choice(
    `Slovo ${p.word} vzniklo ze slova ${p.base}. Jakým způsobem?`,
    ODVOZ,
    distraktory,
    {
      hints: [
        `Porovnej „${p.word}“ a „${p.base}“ — co ve slově navíc přibylo?`,
        `Ke slovu „${p.base}“ přibyla jen jedna přípona nebo předpona (${p.note}), základ zůstal jediný. Když slovo vznikne přidáním předpony nebo přípony k jednomu základu, jde vždy o tenhle způsob tvoření.`,
      ],
      explanation: `Slovo „${p.word}“ vzniklo ze slova „${p.base}“ tak, že se přidala ${p.note}.${zdrob} Je to jediný základ s příponou nebo předponou navíc, proto jde o odvozování.`,
    },
  );
}

// ── L1(b) — skládání: dvě slova spojená v jedno ───────────────────────────
interface SkladPolozka { word: string; a: string; b: string }
const SKLADANI: SkladPolozka[] = [
  { word: "vodopád", a: "voda", b: "padat" },
  { word: "zeměpis", a: "zem", b: "psát" },
  { word: "rychlovlak", a: "rychlý", b: "vlak" },
  { word: "velkoměsto", a: "velký", b: "město" },
  { word: "černobílý", a: "černý", b: "bílý" },
  { word: "hromosvod", a: "hrom", b: "svádět" },
];

function skladL1(p: SkladPolozka): PracticeTask | null {
  const distraktory: Distractor[] = [
    { value: ODVOZ, why: fbOdvozWrong(p.word, `slovo „${p.word}“ má DVA základy (${p.a} + ${p.b}), ne jeden základ s příponou.`) },
    { value: ZKRAC, why: fbZkracWrong(`Slovo „${p.word}“ nevzniklo zkrácením, ale spojením dvou celých slov (${p.a} a ${p.b}).`) },
    { value: PREJEM, why: fbPrejemWrong(`Slovo „${p.word}“ je domácí — vzniklo spojením českých slov „${p.a}“ a „${p.b}“.`) },
  ];
  return choice(
    `Slovo ${p.word} vzniklo spojením slov ${p.a} a ${p.b}. Jakým způsobem?`,
    SKLAD,
    distraktory,
    {
      hints: [
        `Kolik samostatných slov najdeš uvnitř slova „${p.word}“?`,
        `Ve slově „${p.word}“ jsou schované DVA celé základy — „${p.a}“ a „${p.b}“ — spojené v jedno nové slovo. Kdykoli slovo vzniká spojením dvou takových základů, jde o tenhle způsob tvoření.`,
      ],
      explanation: `Slovo „${p.word}“ vzniklo spojením dvou slovních základů: „${p.a}“ a „${p.b}“. Dva základy v jednom slově znamenají skládání.`,
    },
  );
}

// ── L1(c) — zkracování: zkratka ze slovního spojení ───────────────────────
interface ZkracPolozka { word: string; expansion: string }
const ZKRACOVANI: ZkracPolozka[] = [
  { word: "ZŠ", expansion: "základní škola" },
  { word: "ČR", expansion: "Česká republika" },
  { word: "ČT", expansion: "Česká televize" },
  { word: "atd.", expansion: "a tak dále" },
  { word: "apod.", expansion: "a podobně" },
  { word: "tj.", expansion: "to jest" },
];

function zkracL1(p: ZkracPolozka): PracticeTask | null {
  const distraktory: Distractor[] = [
    { value: ODVOZ, why: fbOdvozWrong(p.word, `„${p.word}“ nevzniklo příponou ani předponou, ale zkrácením spojení „${p.expansion}“.`) },
    { value: SKLAD, why: fbSkladWrong(`Zkratka ale nevzniká spojením základů v nové slovo, nýbrž zkrácením celého spojení „${p.expansion}“.`) },
    { value: PREJEM, why: fbPrejemWrong(`„${p.word}“ je zkratka českého spojení „${p.expansion}“, nepřišla z ciziny.`) },
  ];
  return choice(
    `Označení ${p.word} vzniklo ze slov ${p.expansion}. Jakým způsobem?`,
    ZKRAC,
    distraktory,
    {
      hints: [
        `Co je kratší — „${p.word}“, nebo „${p.expansion}“?`,
        `„${p.word}“ je jen stručnější zápis delšího spojení „${p.expansion}“ — nic se k němu nepřidalo ani nespojilo, jen se zapsalo kratčeji. Tenhle způsob tvoření se používá právě u takových zápisů.`,
      ],
      explanation: `„${p.word}“ je zkratka spojení „${p.expansion}“ — vznikla zkrácením delšího názvu na kratší podobu.`,
    },
  );
}

// ── L1(d) — přejímání z cizího jazyka ─────────────────────────────────────
interface PrejemPolozka { word: string; jazyk: string; puvod: string }
const PREJIMANI: PrejemPolozka[] = [
  { word: "fotbal", jazyk: "angličtiny", puvod: "football" },
  { word: "hokej", jazyk: "angličtiny", puvod: "hockey" },
  { word: "víkend", jazyk: "angličtiny", puvod: "weekend" },
  { word: "džus", jazyk: "angličtiny", puvod: "juice" },
  { word: "jogurt", jazyk: "turečtiny", puvod: "yoğurt" },
  { word: "pizza", jazyk: "italštiny", puvod: "pizza" },
];

// Delší varianty nálepek jen pro tuhle šablonu — PREJEM (klíč) je jinak
// nejdelší možnost ze všech čtyř a prozrazovala by se délkou (check:length).
const ODVOZ_DLOUZE = "odvozováním z jiného slova";
const SKLAD_DLOUZE = "skládáním dvou slov dohromady";
const ZKRAC_DLOUZE = "zkracováním delšího názvu";

function prejemL1(p: PrejemPolozka): PracticeTask | null {
  const distraktory: Distractor[] = [
    { value: ODVOZ_DLOUZE, why: fbOdvozWrong(p.word, `„${p.word}“ nevzniklo z jiného českého slova příponou ani předponou, ale přišlo z ${p.jazyk}.`) },
    { value: SKLAD_DLOUZE, why: fbSkladWrong(`„${p.word}“ v češtině nerozložíme na dva české základy — převzalo se z ${p.jazyk}.`) },
    { value: ZKRAC_DLOUZE, why: fbZkracWrong(`„${p.word}“ není zkratka žádného spojení, převzalo se z ${p.jazyk}.`) },
  ];
  return choice(
    `Slovo ${p.word} se do češtiny dostalo z ${p.jazyk}. Jakým způsobem obohatilo slovní zásobu?`,
    PREJEM,
    distraktory,
    {
      hints: [
        `Odkud slovo „${p.word}“ do češtiny přišlo?`,
        `Slovo „${p.word}“ nevzniklo z ničeho českého — převzalo se z jiného jazyka (z ${p.jazyk}) a začalo se používat i u nás. Tenhle způsob obohacování se týká slov, která si čeština takhle vypůjčila.`,
      ],
      explanation: `Slovo „${p.word}“ přišlo do češtiny z ${p.jazyk} (${p.puvod}). Čeština si ho vypůjčila a přizpůsobila své výslovnosti, často i pravopisu. Jde o přejímání z cizího jazyka.`,
    },
  );
}

function genL1(): PracticeTask[] {
  const out: PracticeTask[] = [];
  for (const p of ODVOZOVANI) { const t = odvozL1(p); if (t) out.push(t); }
  for (const p of SKLADANI) { const t = skladL1(p); if (t) out.push(t); }
  for (const p of ZKRACOVANI) { const t = zkracL1(p); if (t) out.push(t); }
  for (const p of PREJIMANI) { const t = prejemL1(p); if (t) out.push(t); }
  return out;
}

// ═══════════════════════════════════════════════════════════════════════
// L2 — použití bez nápovědy: slovo je ve větě, výchozí slovo v zadání není.
// ═══════════════════════════════════════════════════════════════════════

// ── L2(a) — odvozený název povolání/činnosti ve větě ──────────────────────
interface VetaOdvoz { word: string; base: string; sentence: string; suffix: string }
const VETY_ODVOZ: VetaOdvoz[] = [
  { word: "hasič", base: "hasit", sentence: "Tomáš chce být hasičem.", suffix: "-ič" },
  { word: "zpěvák", base: "zpěv", sentence: "Kamarád zpívá ve sboru a chce být zpěvákem.", suffix: "-ák" },
  { word: "plavec", base: "plavat", sentence: "Nejlepší plavec ve třídě je Marek.", suffix: "-ec" },
  { word: "řidič", base: "řídit", sentence: "Autobus nám dnes vezl jiný řidič.", suffix: "-ič" },
  { word: "prodavač", base: "prodávat", sentence: "V pekárně nám poradil milý prodavač.", suffix: "-ač" },
  { word: "malíř", base: "malovat", sentence: "Obrázek na chodbě namaloval malíř z devítky.", suffix: "-íř" },
];

function odvozL2(p: VetaOdvoz): PracticeTask | null {
  const distraktory: Distractor[] = [
    { value: SKLAD, why: fbSkladWrong(`„${p.word}“ ale vzniklo z jediného slova („${p.base}“) přidáním přípony ${p.suffix}, druhý základ v něm není.`) },
    { value: ZKRAC, why: fbZkracWrong(`„${p.word}“ nezkracuje žádné delší spojení, jen se odvodilo ze slova „${p.base}“.`) },
    { value: PREJEM, why: fbPrejemWrong(`„${p.word}“ je domácí slovo, odvozené od „${p.base}“ — nepřišlo z ciziny.`) },
  ];
  return choice(
    `${p.sentence} Jakým způsobem vzniklo slovo ${p.word}?`,
    ODVOZ,
    distraktory,
    {
      hints: [
        `Od jakého kratšího slova se dá „${p.word}“ odvodit? Hledej slovo, které pojmenovává tu samou činnost.`,
        `Pravidlo: když slovo vznikne přidáním předpony nebo přípony k JEDNOMU základu, jde o odvozování; když spojuje DVA úplná slova v jedno, jde o skládání. Zkus u „${p.word}“ najít, kolik samostatných slov je v něm schovaných.`,
      ],
      explanation: `„${p.word}“ vzniklo odvozením ze slova „${p.base}“ příponou ${p.suffix}. Je to jeden základ s příponou, proto odvozování.`,
    },
  );
}

// ── L2(b) — najdi mezi 4 slovy to, které vzniklo skládáním ────────────────
interface Rodina { compound: { word: string; a: string; b: string }; derived: string[]; obor: string }
const RODINY: Rodina[] = [
  { compound: { word: "vodopád", a: "voda", b: "padat" }, derived: ["vodník", "vodička", "vodní"], obor: "voda" },
  { compound: { word: "rychlovlak", a: "rychlý", b: "vlak" }, derived: ["vlakový", "vláček", "rychlík"], obor: "vlak" },
  { compound: { word: "černobílý", a: "černý", b: "bílý" }, derived: ["černavý", "bělavý", "černidlo"], obor: "barvy" },
  { compound: { word: "velkoměsto", a: "velký", b: "město" }, derived: ["městský", "velikán", "městečko"], obor: "město" },
];

function rodinaL2(r: Rodina): PracticeTask | null {
  const distraktory: Distractor[] = r.derived.map((d) => ({
    value: d,
    why: `„${d}“ má jen jeden kořen a příponu — je odvozené, ne složené ze dvou základů jako „${r.compound.word}“.`,
  }));
  const moznosti = [r.compound.word, ...r.derived];
  return choice(
    `Které z těchto čtyř slov vzniklo skládáním (spojením dvou slovních základů)? ${moznosti.join(", ")}`,
    r.compound.word,
    distraktory,
    {
      hints: [
        `„${r.derived[0]}“, „${r.derived[1]}“ a „${r.derived[2]}“ mají jen jeden základ s příponou. Jedna ze čtyř možností je jiná — má DVĚ celá slova vedle sebe. Která to je?`,
        `Tři ze čtyř slov vznikly odvozením — mají jeden základ a příponu. Jen jedno z nich spojuje dva úplné slovní základy v jedno nové slovo (u ${r.obor === "voda" ? "vody" : r.obor === "vlak" ? "vlaku" : r.obor === "barvy" ? "barev" : "města"} to bývá vidět na dvou kořenech vedle sebe). Porovnej všechny čtyři možnosti a hledej tu se dvěma kořeny.`,
      ],
      explanation: `„${r.compound.word}“ vzniklo spojením dvou slovních základů (${r.compound.a} + ${r.compound.b}). Ostatní tři slova mají jen jeden základ s příponou — jsou odvozená.`,
    },
  );
}

// ── L2(c) — rozlišit zkratku a zkratkové slovo ────────────────────────────
const ZKRATKA_ZKRATKOVE = "zkratka (čte se po písmenech)";
const ZKRATKOVE_SLOVO = "zkratkové slovo (čte se jako celé slovo)";
const ZKR_SOUSLOVI = "sousloví (víceslovné pojmenování)";
const ZKR_ODVOZ = "slovo vzniklé odvozováním";

interface ZkrPolozka { word: string; kind: "zkratka" | "zkratkove"; expansion: string; ctenii: string }
const ZKRATKY_L2: ZkrPolozka[] = [
  { word: "ZŠ", kind: "zkratka", expansion: "základní škola", ctenii: "zet-eš, písmeno po písmenu" },
  { word: "ČR", kind: "zkratka", expansion: "Česká republika", ctenii: "čé-er, písmeno po písmenu" },
  { word: "ČT", kind: "zkratka", expansion: "Česká televize", ctenii: "čé-té, písmeno po písmenu" },
  { word: "Čedok", kind: "zkratkove", expansion: "Československá dopravní kancelář", ctenii: "vcelku jako obyčejné slovo" },
  { word: "Jawa", kind: "zkratkove", expansion: "Janeček a Wanderer (jména výrobců)", ctenii: "vcelku jako obyčejné slovo" },
  { word: "Sazka", kind: "zkratkove", expansion: "sázková kancelář", ctenii: "vcelku jako obyčejné slovo" },
];

/** Kontrastní příklad OPAČNÉHO druhu než aktuální položka — pro nápovědu bez leaku. */
function ukazkaOpacna(p: ZkrPolozka): ZkrPolozka {
  const opacne = ZKRATKY_L2.filter((z) => z.kind !== p.kind);
  return opacne[ZKRATKY_L2.indexOf(p) % opacne.length];
}

function zkratkaL2(p: ZkrPolozka): PracticeTask | null {
  const isZkratka = p.kind === "zkratka";
  const correct = isZkratka ? ZKRATKA_ZKRATKOVE : ZKRATKOVE_SLOVO;
  const u = ukazkaOpacna(p);
  const distraktory: Distractor[] = [
    {
      value: isZkratka ? ZKRATKOVE_SLOVO : ZKRATKA_ZKRATKOVE,
      why: isZkratka
        ? `„${p.word}“ se čte ${p.ctenii}, ne jako jedno slovo — je to zkratka, ne zkratkové slovo.`
        : `„${p.word}“ se čte ${p.ctenii}, ne písmeno po písmenu — je to zkratkové slovo, ne zkratka.`,
    },
    { value: ZKR_SOUSLOVI, why: `„${p.word}“ je jedno zkrácené slovo, ne spojení dvou samostatných slov vedle sebe.` },
    { value: ZKR_ODVOZ, why: `„${p.word}“ nevzniklo příponou ani předponou z jiného slova, ale zkrácením spojení „${p.expansion}“.` },
  ];
  return choice(
    `Slovo ${p.word} vzniklo zkrácením spojení ${p.expansion}. Čím ${p.word} je?`,
    correct,
    distraktory,
    {
      hints: [
        `Zkus si „${p.word}“ přečíst nahlas, tak jak ho lidi běžně říkají — vyslovují ho jako jedno slovo, nebo hláskují písmeno po písmenu?`,
        `Pravidlo: zkrácenina, která se čte písmeno po písmenu (třeba „${u.word}“ jako ${u.ctenii}), se řadí mezi zkratky. Zkrácenina, kterou jde vyslovit vcelku jako obyčejné slovo, se řadí jinam. Zkus si podle toho přečíst i „${p.word}“.`,
      ],
      explanation: isZkratka
        ? `„${p.word}“ je zkratka spojení „${p.expansion}“ — čte se ${p.ctenii}.`
        : `„${p.word}“ je zkratkové slovo utvořené ze spojení „${p.expansion}“ — čte se ${p.ctenii}, proto ho vyslovujeme jako obyčejné slovo.`,
    },
  );
}

// ── L2(d) — poznat sousloví jako jedno pojmenování ────────────────────────
interface SousloviPolozka { spojeni: string; sentence: string }
const SOUSLOVI_L2: SousloviPolozka[] = [
  { spojeni: "mateřská škola", sentence: "Sourozenec chodí do mateřské školy." },
  { spojeni: "hlavní město", sentence: "Praha je hlavní město naší republiky." },
  { spojeni: "lesní roh", sentence: "V orchestru hrál na lesní roh." },
  { spojeni: "železná dráha", sentence: "Kolem vesnice vede stará železná dráha." },
];

function sousloviL2(p: SousloviPolozka): PracticeTask | null {
  const distraktory: Distractor[] = [
    { value: SKLAD, why: `Skládání by spojilo obě slova v JEDNO nové slovo. Ve spojení „${p.spojeni}“ zůstávají dvě samostatná slova vedle sebe.` },
    { value: ODVOZ, why: `Odvozování mění JEDNO slovo příponou nebo předponou. „${p.spojeni}“ jsou pořád dvě samostatná slova, ne jedno odvozené.` },
    { value: ZKRAC, why: `„${p.spojeni}“ se nezkrátilo na kratší podobu, zůstává celé jako spojení dvou slov.` },
  ];
  return choice(
    `${p.sentence} Jakým způsobem vzniklo pojmenování „${p.spojeni}“?`,
    SOUSLOVI,
    distraktory,
    {
      hints: [
        `Kolik samostatných slov je ve spojení „${p.spojeni}“ a zůstávají obě zvlášť, nebo splynula v jedno?`,
        `Pravidlo: když dvě slova zůstanou zapsaná ZVLÁŠŤ, ale spolu vždycky pojmenovávají jednu konkrétní věc, je to samostatný způsob pojmenování. Kdyby splynula v jedno slovo se dvěma kořeny, bylo by to skládání; kdyby k jednomu z nich přibyla jen přípona, bylo by to odvozování. Zkus „${p.spojeni}“ rozdělit na dvě slova a podívej se, jestli obě zůstávají samostatná.`,
      ],
      explanation: `„${p.spojeni}“ je sousloví — dvě samostatná slova, která dohromady pojmenovávají jednu věc, ale zůstávají zapsaná zvlášť.`,
    },
  );
}

function genL2(): PracticeTask[] {
  const out: PracticeTask[] = [];
  for (const p of VETY_ODVOZ) { const t = odvozL2(p); if (t) out.push(t); }
  for (const r of RODINY) { const t = rodinaL2(r); if (t) out.push(t); }
  for (const p of ZKRATKY_L2) { const t = zkratkaL2(p); if (t) out.push(t); }
  for (const p of SOUSLOVI_L2) { const t = sousloviL2(p); if (t) out.push(t); }
  return out;
}

// ═══════════════════════════════════════════════════════════════════════
// L3 — analýza a přenos. Žádné dvojice, žádná slova z L1 ani L2. Pasti se
// zdánlivou stavbou, změna významu, inverze, dvoukrokové úlohy.
// ═══════════════════════════════════════════════════════════════════════

// ── L3(a) — past: předpona/přípona vypadá jako druhé slovo ────────────────
interface PastPolozka { word: string; note: string; distraktorSklad: string }
const PASTI_ODVOZ: PastPolozka[] = [
  {
    word: "nadzemní",
    note: "„Nadzemní“ vzniklo ze spojení „nad zemí“ přidáním přípony -ní. „Nad“ je předložka, ne plnovýznamový slovní základ.",
    distraktorSklad: "„Nad“ je jen předložka, ne plnovýznamový slovní základ. Složenina potřebuje dva plnovýznamové základy (třeba voda + pád) — tady je jen jeden (zem) a k němu předložka a přípona.",
  },
  {
    word: "vodník",
    note: "Přípona -ník je přidaná k jednomu základu „voda“, není to druhé slovo.",
    distraktorSklad: "Přípona -ník není samostatné slovo. Ve slově „vodník“ je jen jeden kořen (voda) s příponou -ník, ne dva kořeny jako u vodopádu (voda + pád).",
  },
  {
    word: "zahrádkář",
    note: "Přípona -ář je přidaná k základu „zahrádka“, není to druhé slovo.",
    distraktorSklad: "Přípona -ář není samostatné slovo. Ve slově „zahrádkář“ je jediný kořen (zahrad-) s příponou -ář, ne dva kořeny.",
  },
  {
    word: "hřiště",
    note: "Přípona -iště (místo pro činnost) je přidaná ke slovu „hra“, není to druhé slovo.",
    distraktorSklad: "Přípona -iště není samostatné slovo, označuje místo (podobně kluziště, letiště). Ve slově „hřiště“ je jen jeden základ (hra) s příponou -iště.",
  },
];

function pastOdvozL3(p: PastPolozka): PracticeTask | null {
  const distraktory: Distractor[] = [
    { value: SKLAD, why: p.distraktorSklad },
    { value: ZKRAC, why: `„${p.word}“ nevzniklo zkrácením žádného delšího spojení, ale odvozením — ${p.note.charAt(0).toLowerCase()}${p.note.slice(1)}` },
    { value: PREJEM, why: `„${p.word}“ je domácí, odvozené slovo — nepřišlo z cizího jazyka.` },
  ];
  return choice(
    `Jakým způsobem vzniklo slovo ${p.word}?`,
    ODVOZ,
    distraktory,
    {
      hints: [
        `Podívej se pozorně na začátek nebo konec slova „${p.word}“ — je to opravdu plnovýznamové slovo, nebo jen kousek (předpona, přípona, předložka), který sám nic nepojmenovává?`,
        `Past: slovo může VYPADAT jako spojení dvou slov, ale skládání potřebuje DVA plnovýznamové základy, které něco pojmenovávají. Předpony a předložky (nad-, pod-, pře-…) ani přípony (-ník, -ář, -iště…) takovým základem nejsou. Zkontroluj, jestli u „${p.word}“ jde opravdu o dva plnohodnotné základy.`,
      ],
      explanation: `${p.note} Jde tedy o odvozování — jeden plnovýznamový základ s předponou nebo příponou, ne dva samostatné základy.`,
    },
  );
}

// ── L3(b) — past: složenina psaná vcelku vypadá jako jedno obyčejné slovo ──
interface SkladPast { word: string; a: string; b: string; odvozWhy: string }
const PASTI_SKLAD: SkladPast[] = [
  { word: "velryba", a: "velký", b: "ryba", odvozWhy: "„Vel-“ tu není předpona, ale zkrácený základ slova „velký“. Ve slově „velryba“ jsou dva základy: velký + ryba." },
  { word: "zeměkoule", a: "země", b: "koule", odvozWhy: "„Země-“ není předpona, je to celé slovo „země“. „Zeměkoule“ spojuje dva základy: země + koule." },
  { word: "dalekohled", a: "daleko", b: "hledět", odvozWhy: "„Daleko-“ není předpona, je to samostatné slovo „daleko“. „Dalekohled“ spojuje dva základy: daleko + hledět." },
  { word: "listonoš", a: "list", b: "nosit", odvozWhy: "„-noš“ není přípona, je to základ slovesa „nosit“. „Listonoš“ spojuje dva základy: list + nosit." },
];

function pastSkladL3(p: SkladPast): PracticeTask | null {
  const distraktory: Distractor[] = [
    { value: ODVOZ, why: p.odvozWhy },
    { value: SOUSLOVI, why: `Sousloví by zůstalo jako dvě samostatná slova vedle sebe. „${p.word}“ se píše vcelku jako jedno slovo.` },
    { value: PREJEM, why: `„${p.word}“ je domácí slovo složené z českých slov „${p.a}“ a „${p.b}“ — nepřišlo z ciziny.` },
  ];
  return choice(
    `Jakým způsobem vzniklo slovo ${p.word}?`,
    SKLAD,
    distraktory,
    {
      hints: [
        `Zkus slovo „${p.word}“ rozdělit na dvě části. Dá se každá z nich poznat jako samostatné slovo, které něco pojmenovává?`,
        `Past: „${p.word}“ vypadá jako jedno obyčejné slovo a některá jeho část může připomínat předponu nebo příponu. Zkontroluj, jestli je to jen kousek bez vlastního významu, nebo celé slovo. Dva plnovýznamové základy v jednom slově znamenají jiný způsob tvoření než jeden základ s předponou či příponou.`,
      ],
      explanation: `„${p.word}“ vzniklo spojením dvou slovních základů: „${p.a}“ a „${p.b}“. Dva plnovýznamové základy v jednom slově znamenají skládání.`,
    },
  );
}

// ── L3(c) — změna významu domácího slova ──────────────────────────────────
interface ZmenaPolozka { sentence: string; word: string; nove: string; puvodni: string }
const ZMENA_VYZNAMU: ZmenaPolozka[] = [
  { sentence: "Jana si k počítači koupila novou bezdrátovou myš.", word: "myš", nove: "ovladač počítače", puvodni: "malého hlodavce" },
  { sentence: "Když klikneš na ikonu, na obrazovce se otevře nové okno.", word: "okno", nove: "rámeček programu na obrazovce", puvodni: "otvor ve zdi, kterým je vidět ven" },
  { sentence: "Stůl se viklá, protože má jednu nohu kratší.", word: "noha", nove: "podpěru stolu", puvodni: "končetinu, na které člověk nebo zvíře stojí" },
  { sentence: "Táta si koupil novou pilu, protože stará měla tupé zuby.", word: "zub", nove: "hrot na ostří pily", puvodni: "tvrdou kost v ústech" },
  { sentence: "Dědeček byl dlouho hlavou celé rodiny.", word: "hlava", nove: "člověka, který vede rodinu", puvodni: "část těla nad krkem" },
  { sentence: "Na povrchu polévky plavala velká mastná oka.", word: "oko", nove: "kapku tuku na polévce", puvodni: "orgán, kterým vidíme" },
];

function zmenaL3(p: ZmenaPolozka): PracticeTask | null {
  const distraktory: Distractor[] = [
    { value: PREJEM, why: `„${p.word}“ je staré domácí slovo, v češtině ho máme odedávna — nepřišlo z cizího jazyka.` },
    { value: ODVOZ, why: `Ke slovu „${p.word}“ nepřibyla žádná přípona ani předpona — zůstalo úplně stejné, jen dostalo nový význam.` },
    { value: ZKRAC, why: `„${p.word}“ není zkrácenina delšího názvu — je to celé původní slovo, jen použité pro novou věc.` },
  ];
  return choice(
    `${p.sentence} Jakým způsobem vzniklo pojmenování „${p.word}“ pro ${p.nove}?`,
    ZMENA,
    distraktory,
    {
      hints: [
        `Slovo „${p.word}“ odjakživa znamenalo ${p.puvodni}. Až později se začalo používat i pro ${p.nove}. Vzniklo kvůli tomu nové slovo, nebo se použilo to staré?`,
        `Nevzniklo žádné nové slovo: k „${p.word}“ nic nepřibylo, nic se nezkrátilo a nic se nepřevzalo z ciziny. Staré slovo jen dostalo další smysl podle podobnosti. Který z nabízených způsobů tomu odpovídá?`,
      ],
      explanation: `Slovo „${p.word}“ v češtině odedávna znamenalo ${p.puvodni}. Pro ${p.nove} se začalo používat kvůli podobnosti (tvaru, polohy nebo úlohy) — nevzniklo nové slovo, jen staré dostalo další význam. Jde o změnu významu.`,
    },
  );
}

// ── L3(d) — inverze: které z těchto slov NEvzniklo daným způsobem ─────────
interface InverzniPolozka { skupina: string[]; odlisne: string; zpusob: typeof SKLAD | typeof PREJEM; vysvetleniOdlisne: string }
const INVERZNI: InverzniPolozka[] = [
  { skupina: ["listopad", "světlomet", "kolotoč"], odlisne: "kovář", zpusob: SKLAD, vysvetleniOdlisne: "„kovář“ má jen jeden základ (kov) s příponou -ář — je odvozené, ne složené." },
  { skupina: ["vodovod", "sněhobílý", "samoobsluha"], odlisne: "pekař", zpusob: SKLAD, vysvetleniOdlisne: "„pekař“ má jen jeden základ (pek-, jako v péct) s příponou -ař — je odvozené, ne složené." },
  { skupina: ["tablet", "sendvič", "šampon"], odlisne: "rohlík", zpusob: PREJEM, vysvetleniOdlisne: "„rohlík“ je domácí slovo odvozené od „roh“ (podle tvaru), nepřišlo z ciziny." },
  { skupina: ["špagety", "banán", "čokoláda"], odlisne: "koláč", zpusob: PREJEM, vysvetleniOdlisne: "„koláč“ je domácí slovo odvozené od „kolo“ (podle kulatého tvaru), nepřišlo z ciziny." },
];

function inverzniL3(p: InverzniPolozka): PracticeTask | null {
  const otazka = p.zpusob === SKLAD
    ? `Které z těchto čtyř slov NEvzniklo skládáním? ${[...p.skupina, p.odlisne].join(", ")}`
    : `Které z těchto čtyř slov NENÍ přejaté z cizího jazyka? ${[...p.skupina, p.odlisne].join(", ")}`;
  const distraktory: Distractor[] = p.skupina.map((s) => ({
    value: s,
    why: p.zpusob === SKLAD
      ? `„${s}“ vzniklo skládáním (má dva slovní základy) — hledáš ale to, které vzniklo JINAK.`
      : `„${s}“ je přejaté z cizího jazyka — hledáš ale to, které NENÍ přejaté.`,
  }));
  return choice(
    otazka,
    p.odlisne,
    distraktory,
    {
      hints: [
        `Slova „${p.skupina.join("“, „")}“ vznikla stejným způsobem. Jedna ze čtyř možností je jiná — zkus u každé najít, kolik má základů, nebo jestli je domácí, nebo cizí.`,
        `Slova „${p.skupina.join("“, „")}“ mají mezi sebou něco společného (${p.zpusob === SKLAD ? "dva slovní základy" : "původ v cizím jazyce"}) — ty vyřaď. Zbyde ti to slovo ze čtyř možností, které je odlišné, a to je odpověď.`,
      ],
      explanation: `Tři možnosti ${p.zpusob === SKLAD ? "vznikly skládáním" : "jsou přejaté z cizího jazyka"}. „${p.odlisne}“ je jiné: ${p.vysvetleniOdlisne}`,
    },
  );
}

// ── L3(e) — dvoukrokové: 2 jmenovaná slova v 1 větě, tvrzení platné pro obě ─
interface DvoukrokovaPolozka {
  sentence: string;
  nazev: "slova" | "pojmenování";
  a: string;
  b: string;
  spravneTvrzeni: string;
  nespravna: string[];
  vysvetleni: string;
}
const DVOUKROKOVE: DvoukrokovaPolozka[] = [
  {
    sentence: "Rybář a houbař se potkali cestou k rybníku.",
    nazev: "slova", a: "rybář", b: "houbař",
    spravneTvrzeni: "Obě vznikla odvozováním, mají jeden základ a příponu.",
    nespravna: [
      "Obě vznikla skládáním, mají dva slovní základy.",
      "Obě jsou přejatá, do češtiny přišla z ciziny.",
      "Obě vznikla zkrácením delšího spojení slov.",
    ],
    vysvetleni: "„rybář“ = ryba + přípona -ář, „houbař“ = houba + přípona -ař. Každé má jeden základ a příponu, obě jsou tedy odvozená.",
  },
  {
    sentence: "Do dějepisu jsme si přinesli starý časopis.",
    nazev: "slova", a: "dějepis", b: "časopis",
    spravneTvrzeni: "Obě vznikla skládáním, mají dva slovní základy.",
    nespravna: [
      "Obě vznikla odvozováním, mají jeden základ a příponu.",
      "Obě jsou přejatá, do češtiny přišla z ciziny.",
      "Obě jsou sousloví, píšou se jako dvě slova.",
    ],
    vysvetleni: "„dějepis“ = děj + psát, „časopis“ = čas + psát. Každé spojuje dva slovní základy, obě vznikla skládáním.",
  },
  {
    sentence: "Na oslavě jsme jedli hamburgery s kečupem.",
    nazev: "slova", a: "hamburger", b: "kečup",
    spravneTvrzeni: "Obě jsou přejatá, do češtiny přišla z ciziny.",
    nespravna: [
      "Obě vznikla odvozováním, mají jeden základ a příponu.",
      "Obě vznikla skládáním, mají dva slovní základy.",
      "Obě vznikla změnou významu staršího českého slova.",
    ],
    vysvetleni: "„hamburger“ i „kečup“ přišly do češtiny z angličtiny (hamburger, ketchup). Obě jsou tedy přejatá.",
  },
  {
    sentence: "Na zubním kartáčku mám obrázek ledního medvěda.",
    nazev: "pojmenování", a: "zubní kartáček", b: "lední medvěd",
    spravneTvrzeni: "Obě jsou sousloví, píšou se jako dvě slova.",
    nespravna: [
      "Obě vznikla skládáním, mají dva slovní základy.",
      "Obě vznikla odvozováním, mají jeden základ a příponu.",
      "Obě jsou zkratky, vznikla zkrácením názvu.",
    ],
    vysvetleni: "„zubní kartáček“ i „lední medvěd“ jsou dvě samostatná slova, která dohromady pojmenovávají jednu věc. Nesplynula v jedno slovo, proto jde o sousloví, ne o skládání.",
  },
];

function dvoukrokovaL3(p: DvoukrokovaPolozka): PracticeTask | null {
  const distraktory: Distractor[] = p.nespravna.map((n) => ({
    value: n,
    why: `Tohle tvrzení na „${p.a}“ a „${p.b}“ nesedí — zkontroluj znovu, jak každé z nich skutečně vzniklo.`,
  }));
  return choice(
    `${p.sentence} Které tvrzení platí pro ${p.nazev} ${p.a} a ${p.b}?`,
    p.spravneTvrzeni,
    distraktory,
    {
      hints: [
        `Nejdřív rozhodni, jak vzniklo „${p.a}“ a jak „${p.b}“ — každé zvlášť. Teprve pak hledej tvrzení, které sedí na obě najednou.`,
        `Tvrzení musí platit pro „${p.a}“ i „${p.b}“ zároveň, ne jen pro jedno z nich. U každého zkontroluj, kolik má základů, jestli je domácí, nebo cizí, a jestli se píše vcelku, nebo odděleně.`,
      ],
      explanation: p.vysvetleni,
    },
  );
}

function genL3(): PracticeTask[] {
  const out: PracticeTask[] = [];
  for (const p of PASTI_ODVOZ) { const t = pastOdvozL3(p); if (t) out.push(t); }
  for (const p of PASTI_SKLAD) { const t = pastSkladL3(p); if (t) out.push(t); }
  for (const p of ZMENA_VYZNAMU) { const t = zmenaL3(p); if (t) out.push(t); }
  for (const p of INVERZNI) { const t = inverzniL3(p); if (t) out.push(t); }
  for (const p of DVOUKROKOVE) { const t = dvoukrokovaL3(p); if (t) out.push(t); }
  return out;
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return genL1();
  if (level === 2) return genL2();
  return genL3();
}

// ── Topic ────────────────────────────────────────────────────────────────
export const SLOVNI_ZASOBA_A_JEJI_OBOHACOVANI: TopicMetadata[] = [
  {
    id: "g6-cjl-slovni-zasoba-a-jeji-obohacovani-6",
    rvpNodeId: "g6-cjl-jazykova-vychova-nauka-o-slovni-zasobe-slovni-zasoba-a-jeji-obohacovani",
    displayName: "Jak vznikají nová slova",
    title: "Slovní zásoba a její obohacování",
    studentTitle: "Odkud se berou nová slova",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slovní zásobě",
    briefDescription: "Poznáš, jakým způsobem v češtině vznikají nová slova.",
    keywords: [
      "obohacování slovní zásoby", "odvozování", "skládání", "zkracování",
      "zkratka", "zkratkové slovo", "přejímání", "sousloví", "změna významu",
      "předpona", "přípona", "cizí slova",
    ],
    goals: [
      "Rozpoznat způsob vzniku slova: odvozování, skládání, zkracování, přejímání, sousloví, změna významu.",
      "Rozlišit zkratku (čte se po písmenech) od zkratkového slova (čte se vcelku).",
      "Odhalit zdánlivě složená slova, která ve skutečnosti vznikla odvozením, i složeniny, které vypadají jako jedno obyčejné slovo.",
      "Rozlišit změnu významu domácího slova od přejímání z cizího jazyka.",
    ],
    boundaries: [
      "Synonyma, antonyma a homonyma se tu neprobírají (mají vlastní téma).",
      "Jen vybírání ze čtyř možností — žádný volný text.",
      "Slovo robot se nepoužívá (sporný domácí/cizí původ).",
      "Univerbizace (minerálka, tramvajenka) se nepoužívá — učebnice ji řadí různě.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Odvozování přidá k jednomu základu předponu nebo příponu. Skládání spojí dva celé základy v jedno slovo. Zkracování zkrátí delší název (zkratka se čte po písmenech, zkratkové slovo vcelku). Přejímání vezme slovo z cizího jazyka. Sousloví jsou dvě slova, která zůstávají zvlášť, ale pojmenovávají jednu věc. Změna významu dá starému slovu nový smysl.",
      steps: [
        "Zjisti, kolik samostatných slovních základů ve slově je — jeden (odvozování), nebo dva (skládání).",
        "U zkratky rozliš, jestli se čte po písmenech, nebo vcelku jako slovo.",
        "Zvaž, jestli slovo mohlo existovat v češtině už dřív jen s jiným významem.",
      ],
      commonMistake: "Předponu (pře-, nad-) nebo příponu (-ník, -ář) považovat za druhé samostatné slovo, a tedy za skládání.",
      example: "Slovo vodopád vzniklo spojením slov voda a padat (skládání). Slovo vodník vzniklo příponou -ník ze slova voda (odvozování) — má jen jeden kořen.",
    },
  },
];
