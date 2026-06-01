import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL_L1: QA[] = [
  { q: "Jaký čas má sloveso 'budu číst'?", a: "budoucí", opts: ["budoucí", "přítomný", "minulý", "neurčitý"] },
  { q: "Urči osobu a číslo: 'čteme'", a: "1. osoba množného čísla (my)", opts: ["1. osoba množného čísla (my)", "2. osoba množného čísla", "3. osoba množného čísla", "1. osoba jednotného čísla"] },
  { q: "Jaký čas má sloveso 'četl jsem'?", a: "minulý", opts: ["minulý", "přítomný", "budoucí", "neurčitý"] },
  { q: "Jaký čas má sloveso 'čtu'?", a: "přítomný", opts: ["přítomný", "minulý", "budoucí", "neurčitý"] },
  { q: "Urči osobu: 'ty čteš'", a: "2. osoba", opts: ["2. osoba", "1. osoba", "3. osoba", "neosobní"] },
  { q: "Urči číslo: 'oni čtou'", a: "množné číslo", opts: ["množné číslo", "jednotné číslo", "nelze určit", "duál"] },
  { q: "Jaký způsob má sloveso 'čti!'?", a: "rozkazovací", opts: ["rozkazovací", "oznamovací", "podmiňovací", "přací"] },
  { q: "Jaký způsob má sloveso 'četl bych'?", a: "podmiňovací", opts: ["podmiňovací", "oznamovací", "rozkazovací", "tázací"] },
  { q: "Urči osobu a číslo: 'piju'", a: "1. osoba jednotného čísla (já)", opts: ["1. osoba jednotného čísla (já)", "3. osoba jednotného čísla", "2. osoba jednotného čísla", "1. osoba množného čísla"] },
  { q: "Jaký čas má sloveso 'šla'?", a: "minulý", opts: ["minulý", "přítomný", "budoucí", "podmiňovací"] },
  { q: "Urči osobu a číslo: 'zpívají'", a: "3. osoba množného čísla", opts: ["3. osoba množného čísla", "1. osoba množného čísla", "2. osoba množného čísla", "3. osoba jednotného čísla"] },
  { q: "Jaký způsob má sloveso 'chodí'?", a: "oznamovací", opts: ["oznamovací", "rozkazovací", "podmiňovací", "přací"] },
  { q: "Urči čas: 'půjdeme'", a: "budoucí", opts: ["budoucí", "přítomný", "minulý", "neurčitý"] },
  { q: "Urči osobu a číslo: 'on čte'", a: "3. osoba jednotného čísla", opts: ["3. osoba jednotného čísla", "1. osoba", "2. osoba", "3. osoba množného čísla"] },
  { q: "Jaký způsob má 'pojď!' ?", a: "rozkazovací", opts: ["rozkazovací", "oznamovací", "podmiňovací", "neurčitý"] },
  { q: "Urči čas: 'zpívala jsem'", a: "minulý", opts: ["minulý", "přítomný", "budoucí", "podmiňovací"] },
];

const POOL_L2: QA[] = [
  { q: "Urči osobu, číslo, čas: 'nesli jsme'", a: "1. osoba množného čísla, minulý čas", opts: ["1. osoba množného čísla, minulý čas", "3. osoba množného čísla, minulý čas", "1. osoba j.č., minulý čas", "2. osoba mn.č., přítomný čas"] },
  { q: "Urči osobu, číslo, způsob: 'čtěte'", a: "2. osoba množného čísla, rozkazovací způsob", opts: ["2. osoba množného čísla, rozkazovací způsob", "2. osoba j.č., rozkazovací", "3. osoba mn.č., oznamovací", "1. osoba mn.č., rozkazovací"] },
  { q: "Jaký čas má: 'budu se učit'?", a: "budoucí (opisný)", opts: ["budoucí (opisný)", "přítomný", "minulý", "podmiňovací"] },
  { q: "Urči způsob: 'byl bych rád'", a: "podmiňovací", opts: ["podmiňovací", "oznamovací", "rozkazovací", "přací"] },
  { q: "Urči osobu a číslo: 'letíte'", a: "2. osoba množného čísla", opts: ["2. osoba množného čísla", "1. osoba množného čísla", "3. osoba množného čísla", "2. osoba jednotného čísla"] },
  { q: "Urči čas: 'chodila'", a: "minulý", opts: ["minulý", "přítomný", "budoucí", "podmiňovací"] },
  { q: "Urči osobu a číslo: 'prší'", a: "3. osoba jednotného čísla (neosobní)", opts: ["3. osoba jednotného čísla (neosobní)", "1. osoba j.č.", "2. osoba j.č.", "nelze určit"] },
  { q: "Urči způsob: 'přišel bys'", a: "podmiňovací", opts: ["podmiňovací", "oznamovací", "rozkazovací", "tázací"] },
  { q: "Urči osobu, číslo, čas: 'napsal jsem'", a: "1. osoba j.č., minulý čas", opts: ["1. osoba j.č., minulý čas", "3. osoba j.č., minulý čas", "1. osoba mn.č., minulý čas", "2. osoba j.č., minulý čas"] },
  { q: "Urči způsob: 'čti!'", a: "rozkazovací", opts: ["rozkazovací", "oznamovací", "podmiňovací", "přací"] },
  { q: "Urči čas: 'přijde'", a: "budoucí", opts: ["budoucí", "přítomný", "minulý", "podmiňovací"] },
  { q: "Urči osobu a číslo: 'nezapomeňte'", a: "2. osoba množného čísla", opts: ["2. osoba množného čísla", "1. osoba množného čísla", "2. osoba j.č.", "3. osoba mn.č."] },
  { q: "Co je neurčitek (infinitiv)?", a: "základní tvar slovesa — 'číst, psát, jít'", opts: ["základní tvar slovesa — 'číst, psát, jít'", "přítomný čas", "minulý čas", "rozkazovací způsob"] },
  { q: "Urči osobu a číslo: 'doběhla'", a: "3. osoba jednotného čísla (ona)", opts: ["3. osoba jednotného čísla (ona)", "1. osoba j.č.", "2. osoba j.č.", "3. osoba mn.č."] },
  { q: "Urči způsob: 'chodím'", a: "oznamovací", opts: ["oznamovací", "rozkazovací", "podmiňovací", "neurčitý"] },
  { q: "Urči čas: 'bude pít'", a: "budoucí (opisný)", opts: ["budoucí (opisný)", "přítomný", "minulý", "podmiňovací"] },
];

const POOL_L3: QA[] = [
  { q: "Urči osobu, číslo, čas, způsob: 'zpívali bychom'", a: "1. osoba mn.č., podmiňovací způsob", opts: ["1. osoba mn.č., podmiňovací způsob", "3. osoba mn.č., podmiňovací", "2. osoba mn.č., oznamovací", "1. osoba j.č., podmiňovací"] },
  { q: "Jaký je rozdíl mezi 'číst' a 'čtu'?", a: "číst = infinitiv (neurčitek), čtu = přítomný čas, 1. os. j.č.", opts: ["číst = infinitiv (neurčitek), čtu = přítomný čas, 1. os. j.č.", "obojí je přítomný čas", "obojí je neurčitek", "číst = minulý čas"] },
  { q: "Urči osobu, číslo, čas: 'psali jste'", a: "2. osoba mn.č., minulý čas", opts: ["2. osoba mn.č., minulý čas", "3. osoba mn.č., minulý čas", "2. osoba mn.č., přítomný čas", "1. osoba mn.č., minulý čas"] },
  { q: "Urči způsob: 'kdybychom přišli'", a: "podmiňovací (podmínková věta)", opts: ["podmiňovací (podmínková věta)", "oznamovací", "rozkazovací", "přací"] },
  { q: "Urči všechny mluvnické kategorie: 'nesl bys'", a: "2. os., j.č., podmiňovací způsob", opts: ["2. os., j.č., podmiňovací způsob", "1. os., j.č., podmiňovací", "3. os., j.č., oznamovací", "2. os., mn.č., podmiňovací"] },
  { q: "Urči čas: 'půjdeme si zaplavat'", a: "budoucí", opts: ["budoucí", "přítomný", "minulý", "podmiňovací"] },
  { q: "Urči osobu, číslo, způsob: 'pojďme'", a: "1. os., mn.č., rozkazovací způsob", opts: ["1. os., mn.č., rozkazovací způsob", "2. os., mn.č., rozkazovací", "3. os., mn.č., oznamovací", "1. os., j.č., rozkazovací"] },
  { q: "Co vyjadřuje podmiňovací způsob?", a: "možnost, přání, podmínku (bych, bys, by, bychom...)", opts: ["možnost, přání, podmínku (bych, bys, by, bychom...)", "rozkaz nebo prosbu", "skutečný děj v přítomnosti", "budoucí děj"] },
  { q: "Urči osobu, číslo, čas: 'odešly'", a: "3. os., mn.č., minulý čas (ony)", opts: ["3. os., mn.č., minulý čas (ony)", "1. os., mn.č., minulý čas", "3. os., j.č., minulý čas", "2. os., mn.č., minulý čas"] },
  { q: "Urči všechny kategorie: 'přinesli jste'", a: "2. os., mn.č., minulý čas, oznamovací způsob", opts: ["2. os., mn.č., minulý čas, oznamovací způsob", "3. os., mn.č., minulý čas", "1. os., mn.č., minulý čas", "2. os., mn.č., budoucí čas"] },
  { q: "Urči způsob: 'at' přijdou'", a: "přací / rozkazovací (ať + sloveso)", opts: ["přací / rozkazovací (ať + sloveso)", "oznamovací", "podmiňovací", "neurčitý"] },
  { q: "Urči čas: 'bývalo'", a: "minulý (opakovaný děj v minulosti)", opts: ["minulý (opakovaný děj v minulosti)", "přítomný", "budoucí", "podmiňovací"] },
  { q: "Urči osobu a číslo: 'sedí' (jako přísudek ve větě 'Děti sedí v kruhu.')", a: "3. os., mn.č. (děti sedí)", opts: ["3. os., mn.č. (děti sedí)", "3. os., j.č.", "1. os., mn.č.", "2. os., mn.č."] },
  { q: "Co jsou mluvnické kategorie slovesa?", a: "osoba, číslo, čas, způsob", opts: ["osoba, číslo, čas, způsob", "rod, číslo, pád, vzor", "čas, pád, osoba, vzor", "způsob, rod, vzor, pád"] },
  { q: "Urči osobu, číslo, čas: 'přineste' (rozkaz)", a: "2. os., mn.č., rozkazovací způsob", opts: ["2. os., mn.č., rozkazovací způsob", "3. os., mn.č., oznamovací", "1. os., mn.č., přítomný čas", "2. os., j.č., rozkazovací"] },
  { q: "Urči osobu, číslo, způsob: 'seděli bychom'", a: "1. os., mn.č., podmiňovací způsob", opts: ["1. os., mn.č., podmiňovací způsob", "2. os., mn.č., podmiňovací", "3. os., mn.č., podmiňovací", "1. os., j.č., podmiňovací"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Osoba: 1. já/my, 2. ty/vy, 3. on/ona/ono/oni/ony",
      "Číslo: jednotné (já, ty, on) nebo množné (my, vy, oni)",
      "Čas: minulý (byl), přítomný (je), budoucí (bude)",
      "Způsob: oznamovací (chodí), rozkazovací (choď!), podmiňovací (chodil by)",
    ],
    solutionSteps: [
      "Urči, kdo vykonává děj → osoba a číslo.",
      "Kdy se děj odehrává → čas.",
      "Jak je děj vyjádřen → způsob.",
    ],
  }));
}

export const SLOVESAMLUVNICKEKATEGORIECASOVANIVJEDNODUCHYCHCASECH: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-slovesa-mluvnicke-kategorie-casovani-v-jednoduchych-casech",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-slovesa-mluvnicke-kategorie-casovani-v-jednoduchych-casech",
    title: "Slovesa - mluvnické kategorie, časování v jednoduchých časech",
    studentTitle: "Slovesa a časy",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Naučíš se určovat osobu, číslo, čas a způsob sloves.",
    keywords: ["sloveso", "osoba", "číslo", "čas", "způsob", "časování", "mluvnické kategorie"],
    goals: [
      "Určit osobu, číslo, čas a způsob slovesa",
      "Časovat slovesa v přítomném, minulém a budoucím čase",
    ],
    boundaries: ["Bez préterita dokonavých sloves", "Bez kondicionálu minulého"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Osoba=kdo, Číslo=j.č./mn.č., Čas=minulý/přítomný/budoucí, Způsob=oznamovací/rozkazovací/podmiňovací",
      steps: [
        "Kdo vykonává děj? → osoba (1./2./3.) a číslo (j.č./mn.č.)",
        "Kdy se děj odehrává? → čas (minulý/přítomný/budoucí)",
        "Jak je děj vyjádřen? → způsob (oznamovací/rozkazovací/podmiňovací)",
      ],
      commonMistake: "Záměna přítomného a budoucího času: 'čtu' = přítomný; 'budu číst' = budoucí",
      example: "čteme: 1. os., mn.č., přítomný čas, oznamovací způsob",
    },
  },
];
