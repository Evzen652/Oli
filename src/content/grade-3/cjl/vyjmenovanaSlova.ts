import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[] }[] = [
  // B
  { q: "Doplň: 'Na farmě žil velký b_k.'", a: "byk", opts: ["byk", "bik", "býk", "bik"] },
  { q: "Doplň: 'Umřít — to znamená přestat b_t.'", a: "být", opts: ["být", "bít", "byt", "bit"] },
  { q: "Doplň: 'V potoce žila velká b_lina.'", a: "bylina", opts: ["bylina", "bilina", "bylínas", "bilínas"] },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po B?", a: "kobyla", opts: ["kobyla", "kabela", "kabel", "kabát"] },
  { q: "Doplň: 'Kůň nebo kobyla? Kobyla je samice a b_k je samec.'", a: "byk", opts: ["byk", "bik", "buc", "buc"] },
  // L
  { q: "Doplň: 'Na sněhu jsme jeli na l_žích.'", a: "lyžích", opts: ["lyžích", "ližích", "lyzích", "lizích"] },
  { q: "Doplň: 'Kůra stromu se jmenuje l_ko.'", a: "lýko", opts: ["lýko", "líko", "lyko", "liko"] },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po L?", a: "lysý", opts: ["lysý", "lisý", "lísek", "lípa"] },
  { q: "Doplň: 'Na obloze se bl_skalo.'", a: "blýskalo", opts: ["blýskalo", "bliskalo", "blyskalo", "bliskalo"] },
  // M
  { q: "Doplň: 'M_dlo voní růžemi.'", a: "Mýdlo", opts: ["Mýdlo", "Mydlo", "Mídlo", "Midlo"] },
  { q: "Doplň: 'M_t nádobí je důležité.'", a: "Mýt", opts: ["Mýt", "Mít", "Myt", "Mit"] },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po M?", a: "myslet", opts: ["myslet", "mislet", "mistr", "místy"] },
  { q: "Doplň: 'Celý den jsme se m_lili, kde je cesta.'", a: "mýlili", opts: ["mýlili", "milili", "mylili", "milili"] },
  // P
  { q: "Doplň: 'P_cha předchází pád.'", a: "Pýcha", opts: ["Pýcha", "Pícha", "Pycha", "Picha"] },
  { q: "Doplň: 'Brambory jsou v p_tli.'", a: "pytli", opts: ["pytli", "pitli", "pytlí", "pitlí"] },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po P?", a: "pyl", opts: ["pyl", "pil", "pila", "pili"] },
  { q: "Doplň: 'Zločinec musí p_kat za svůj čin.'", a: "pykat", opts: ["pykat", "pikat", "pýkat", "pikat"] },
  // S
  { q: "Doplň: 'S_r je z mléka.'", a: "Sýr", opts: ["Sýr", "Sír", "Syr", "Sir"] },
  { q: "Doplň: 'Po obědě byl s_tý.'", a: "sytý", opts: ["sytý", "sitý", "sytí", "sitý"] },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po S?", a: "syn", opts: ["syn", "sin", "sinec", "síň"] },
  { q: "Doplň: 'S_rový sýr není zralý.'", a: "Syrový", opts: ["Syrový", "Sirový", "Syrovi", "Sirovi"] },
  // V
  { q: "Doplň: 'Vlk začal v_t na měsíc.'", a: "výt", opts: ["výt", "vít", "vyt", "vit"] },
  { q: "Doplň: 'Má špatný zv_k vstávat pozdě.'", a: "zvyk", opts: ["zvyk", "zvik", "zvík", "zvik"] },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po V?", a: "výskat", opts: ["výskat", "vískat", "vyskot", "viskot"] },
  // Z
  { q: "Doplň: 'Přijď brz_, čekám na tebe.'", a: "brzy", opts: ["brzy", "brzi", "brzý", "brzí"] },
  { q: "Doplň: 'Plazí j_zyk je rozdvojený.'", a: "jazyk", opts: ["jazyk", "jazik", "jázyk", "jázik"] },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po Z?", a: "nazývat", opts: ["nazývat", "nazívat", "nazvat", "naziivat"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.filter((_, i) => i % 3 === 0).slice(0, 12)
    : level === 2 ? POOL.slice(0, 18) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Vzpomeň si na seznam vyjmenovaných slov pro tuto souhlásku.", "Po B, L, M, P, S, V, Z píšeme Y jen ve vyjmenovaných slovech a jejich příbuzných."],
    solutionSteps: ["Najdi souhlásku, po které píšu.", "Zkontroluj seznam vyjmenovaných slov.", a.includes("y") || a.includes("ý") ? "Patří tam → píšeme Y." : "Odpověď: " + a],
  }));
}

export const VYJMENOVANASLOVA: TopicMetadata[] = [
  {
    id: "g3-cjl-vyjmenovana-slova",
    rvpNodeId: "g3-cjl-jazykova-vychova-pravopis-vyjmenovana-slova-po-b-l-m-p-s-v-z",
    title: "Vyjmenovaná slova po B, L, M, P, S, V, Z",
    studentTitle: "Vyjmenovaná slova",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Naučíš se vyjmenovaná slova a správně doplníš i/y.",
    keywords: ["vyjmenovaná slova", "B L M P S V Z", "pravopis", "i/y", "bylina", "lyže", "mýdlo"],
    goals: ["Znát vyjmenovaná slova po B, L, M, P, S, V, Z.", "Správně doplnit i/y po obojetných souhláskách.", "Zdůvodnit pravopis vyjmenovaným slovem."],
    boundaries: ["Vyjmenovaná slova dle RVP pro 3. ročník.", "Bez složitých příbuzných odvozenin."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Po B, L, M, P, S, V, Z píšeme Y jen ve vyjmenovaných slovech a jejich příbuzných. Jinak I.",
      steps: ["Podívej se, po které souhlásce píšu.", "Vybavím si seznam vyjmenovaných slov pro tuto souhlásku.", "Je to vyjmenované (nebo příbuzné)? → Y. Není? → I."],
      commonMistake: "'být' (vyjmenované → Y) vs 'bít' (bít holí → I) — jsou to různá slova!",
      example: "mýdlo: po M, je vyjmenované → Y. milovat: po M, ale není vyjmenované → I.",
    },
  },
];
