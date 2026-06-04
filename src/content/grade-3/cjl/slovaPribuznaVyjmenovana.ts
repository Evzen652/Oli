import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Příbuzná slova k vyjmenovaným — doplň i/y
const POOL: { q: string; a: string; opts: string[] }[] = [
  // po B
  { q: "Doplň správně: 'Koupili jsme nové b_dlení.'", a: "bydlení", opts: ["bydlení", "bidlení", "bydliny", "bidliny"] },
  { q: "Doplň správně: 'Na louce pásla se b_k a krávy.'", a: "byk", opts: ["byk", "bik", "býk", "bíky"] },
  { q: "Doplň správně: 'B_strý potok tekl přes kameny.'", a: "Bystří / Bystrý", opts: ["Bystrý", "Bistrý", "Bystri", "Bistri"] },
  { q: "Příbuzné slovo k 'být' je:", a: "bydliště", opts: ["bydliště", "bidlo", "bičovat", "bílek"] },
  // po L
  { q: "Doplň správně: 'Na l_žích jsme jeli z kopce.'", a: "lyžích", opts: ["lyžích", "ližích", "lyzích", "lizích"] },
  { q: "Doplň správně: 'Kůra stromu se nazývá l_ko.'", a: "lýko", opts: ["lýko", "líko", "lyko", "liko"] },
  { q: "Příbuzné slovo k 'lyže' je:", a: "lyžař", opts: ["lyžař", "ližař", "lyzař", "lizař"] },
  // po M
  { q: "Doplň správně: 'M_dlo voní levandulí.'", a: "Mýdlo", opts: ["Mýdlo", "Mydlo", "Mídlo", "Midlo"] },
  { q: "Doplň správně: 'Musíme m_t nádobí po večeři.'", a: "mýt", opts: ["mýt", "mít", "myt", "mit"] },
  { q: "Příbuzné slovo k 'myslet' je:", a: "myšlenka", opts: ["myšlenka", "mišlenka", "myšlinka", "mišlinka"] },
  // po P
  { q: "Doplň správně: 'P_cha předchází pád.'", a: "Pýcha", opts: ["Pýcha", "Pícha", "Pycha", "Picha"] },
  { q: "Doplň správně: 'Brambory dáme do p_tele.'", a: "pytle", opts: ["pytle", "pitle", "pytlie", "pitlie"] },
  { q: "Příbuzné slovo k 'pyšný' je:", a: "pýcha", opts: ["pýcha", "pícha", "pycha", "pichla"] },
  // po S
  { q: "Doplň správně: 'S_r je výrobek z mléka.'", a: "Sýr", opts: ["Sýr", "Sír", "Syr", "Sir"] },
  { q: "Doplň správně: 'Byl s_tý, protože hodně snědl.'", a: "sytý", opts: ["sytý", "sitý", "sytí", "sitý"] },
  // po V
  { q: "Doplň správně: 'Vlk začal v_t na měsíc.'", a: "výt", opts: ["výt", "vít", "vyt", "vit"] },
  { q: "Příbuzné slovo k 'zvyk' je:", a: "zvyknout", opts: ["zvyknout", "zviknut", "zvyknout", "zvíknout"] },
  // po Z
  { q: "Doplň správně: 'Přijď brz_.'", a: "brzy", opts: ["brzy", "brzi", "brzy", "brzí"] },
  { q: "Příbuzné slovo k 'jazyk' je:", a: "jazykový", opts: ["jazykový", "jazikový", "jazykovi", "jazikovi"] },
  { q: "Doplň správně: 'Lékař zkoumal můj j_zyk.'", a: "jazyk", opts: ["jazyk", "jazik", "jázyk", "jázik"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 10) : level === 2 ? POOL.slice(0, 15) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Příbuzná slova k vyjmenovaným se také píší s Y/Ý.", "Najdi vyjmenované slovo, ke kterému toto patří."],
    solutionSteps: ["Rozeznám, po které souhlásce se píše.", `Slovo patří do rodiny vyjmenovaných — píšeme: ${a}`],
  }));
}

export const SLOVAPRIBYZNAVANJE: TopicMetadata[] = [
  {
    id: "g3-cjl-slova-pribuzna-vyjmenovana",
    rvpNodeId: "g3-cjl-jazykova-vychova-pravopis-slova-pribuzna-k-vyjmenovanym-slovum-psani-i-y-po-obojet-sou",
    title: "Slova příbuzná k vyjmenovaným slovům, psaní i/y po obojet. souhláskách",
    studentTitle: "Příbuzná vyjmenovaná",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Správně napíšeš i/y ve slovech příbuzných k vyjmenovaným.",
    keywords: ["vyjmenovaná slova", "příbuzná slova", "i/y", "pravopis", "obojetné souhlásky"],
    goals: ["Rozpoznat slova příbuzná k vyjmenovaným.", "Správně psát y/ý ve slovech příbuzných.", "Zdůvodnit pravopis odkazem na vyjmenované slovo."],
    boundaries: ["Základní příbuzná slova po B, L, M, P, S, V, Z."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Příbuzné slovo ke vyjmenovanému = také se píše s Y. Hledej, ke které rodině patří.",
      steps: ["Určím, po které souhlásce píšu (B, L, M, P, S, V, Z).", "Vzpomenu si na vyjmenovaná slova.", "Patří toto slovo do jejich rodiny? Pak Y.", "Nepatří? Pak I."],
      commonMistake: "'bydlet' — příbuzné k 'být' (vyjmenované) → píšeme Y.",
      example: "lyžař → příbuzné k 'lyže' (vyjmenované po L) → píšeme Y: lyžař.",
    },
  },
];
