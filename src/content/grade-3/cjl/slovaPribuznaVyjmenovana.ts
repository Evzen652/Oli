import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * PED-1: dvě šablony úloh
 *  - `fill`  — „Doplň: ..." → options = sporný grafém [y, ý, i, í].
 *  - `which` — „Příbuzné slovo k 'X' je:" → 4 správně napsaná slova, jen 1 je z rodiny.
 *
 * Předtím byly u obou typů distraktory tvořené záměnami písmen („bidlení",
 * „bystri", „ližař", „mišlenka") — dítě si takový chybný tvar zapamatuje.
 */

type Grapheme = "y" | "ý" | "i" | "í";

interface FillItem {
  kind: "fill";
  q: string;
  correct: Grapheme;
  word: string;
  e: string;
}

interface WhichItem {
  kind: "which";
  q: string;
  correct: string;
  distractors: [string, string, string];
  e: string;
}

type PoolItem = FillItem | WhichItem;

const POOL: PoolItem[] = [
  // ── po B ──────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'Koupili jsme nové b_dlení.'", correct: "y", word: "bydlení", e: "Slovo 'bydlení' patří do rodiny vyjmenovaného slova 'být' — bydlet, bydliště, bydlení. Po souhlásce B u vyjmenovaných a jejich příbuzných píšeme vždy Y." },
  { kind: "fill", q: "Doplň: 'Na louce se pásl b_k a krávy.'", correct: "ý", word: "býk", e: "Slovo 'býk' je vyjmenované slovo po B, proto píšeme Ý. Býk je samec krávy — pamatuj si ho jako jedno z vyjmenovaných slov." },
  { kind: "fill", q: "Doplň: 'B_strý potok tekl přes kameny.'", correct: "y", word: "Bystrý", e: "Slovo 'bystrý' je vyjmenované slovo po B — znamená rychlý nebo chytrý. Patří k němu i příbuzná 'bystřina' (rychlý potok)." },
  { kind: "which", q: "Příbuzné slovo k 'být' je:", correct: "bydliště", distractors: ["bidlo", "bičovat", "bílek"], e: "Slovo 'bydliště' patří do rodiny slova 'být' — bydlet, bydlení, bydliště. 'Bidlo' (tyč) a 'bičovat' jsou skutečná slova, ale s vyjmenovanými nesouvisí; 'bílek' je od 'bílý' (barva)." },
  // ── po L ──────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'Na l_žích jsme jeli z kopce.'", correct: "y", word: "lyžích", e: "Slovo 'lyže' je vyjmenované po L, takže 'lyžích' (6. pád od lyže) se píše také s Y. Celá rodina lyže, lyžař, lyžování má Y." },
  { kind: "fill", q: "Doplň: 'Kůra stromu se nazývá l_ko.'", correct: "ý", word: "lýko", e: "Slovo 'lýko' je vyjmenované po L — je to tenká vrstva pod kůrou stromu. Vyjmenovaná slova po L se píší s Y nebo Ý." },
  { kind: "which", q: "Příbuzné slovo k 'lyže' je:", correct: "lyžař", distractors: ["liška", "lípa", "letadlo"], e: "Slovo 'lyžař' patří do rodiny 'lyže' → lyžař → lyžovat. 'Liška', 'lípa' ani 'letadlo' mezi příbuzná vyjmenovaným po L nepatří." },
  // ── po M ──────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'M_dlo voní levandulí.'", correct: "ý", word: "Mýdlo", e: "Slovo 'mýdlo' je příbuzné k vyjmenovanému 'mýt' — mýdlem se myjeme. Píšeme Ý, protože je to příbuzné s vyjmenovaným slovem." },
  { kind: "fill", q: "Doplň: 'Musíme m_t nádobí po večeři.'", correct: "ý", word: "mýt", e: "Slovo 'mýt' je vyjmenované slovo po M. Pozor, nezaměňuj s 'mít' (vlastnit) — to je jiné slovo s krátkým Í!" },
  { kind: "which", q: "Příbuzné slovo k 'myslet' je:", correct: "myšlenka", distractors: ["milovat", "místo", "mistr"], e: "Slovo 'myšlenka' patří do rodiny 'mysl → myslet → myšlenka'. 'Milovat', 'místo' a 'mistr' vyjmenovaná ani příbuzná nejsou." },
  // ── po P ──────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'P_cha předchází pád.'", correct: "ý", word: "Pýcha", e: "Slovo 'pýcha' je vyjmenované po P. Příbuzné je 'pyšný' — kdo je pyšný, má v sobě pýchu. Celá rodina se píše s Y/Ý." },
  { kind: "fill", q: "Doplň: 'Brambory dáme do p_tle.'", correct: "y", word: "pytle", e: "Slovo 'pytel' je vyjmenované po P, proto jeho tvary — pytle, pytlích, pytlíku — se také píší s Y." },
  { kind: "which", q: "Příbuzné slovo k 'pyšný' je:", correct: "pýcha", distractors: ["pila", "pilný", "písek"], e: "'Pyšný' a 'pýcha' patří do jedné rodiny vyjmenovaných slov po P. 'Pila', 'pilný' a 'písek' s vyjmenovanými nesouvisí — píší se s I nebo Í." },
  // ── po S ──────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'S_r je výrobek z mléka.'", correct: "ý", word: "Sýr", e: "Slovo 'sýr' je vyjmenované po S, proto se píše s Ý. Pamatuj si ho zpaměti jako součást řady vyjmenovaných slov." },
  { kind: "fill", q: "Doplň: 'Byl s_tý, protože hodně snědl.'", correct: "y", word: "sytý", e: "Slovo 'sytý' je vyjmenované po S. Příbuzná slova (sytit, nasytit) se také píší s Y." },
  // ── po V ──────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'Vlk začal v_t na měsíc.'", correct: "ý", word: "výt", e: "Slovo 'výt' je vyjmenované po V — takto označujeme zvuk vlka. Píšeme Ý, protože je to vyjmenované slovo." },
  { kind: "which", q: "Příbuzné slovo k 'zvyk' je:", correct: "zvyknout", distractors: ["vlast", "vítr", "vítat"], e: "'Zvyknout' patří do rodiny vyjmenovaného 'zvykat' po V. 'Vlast', 'vítr' ani 'vítat' vyjmenovaná ani příbuzná nejsou." },
  // ── po Z ──────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'Přijď brz_.'", correct: "y", word: "brzy", e: "Slovo 'brzy' je vyjmenované po Z, proto píšeme Y. Brzy znamená za chvíli nebo co nejdříve." },
  { kind: "which", q: "Příbuzné slovo k 'jazyk' je:", correct: "jazykový", distractors: ["zima", "zítra", "zametat"], e: "'Jazykový' patří do rodiny 'jazyk → jazykový → jazykověda'. 'Zima', 'zítra' a 'zametat' vyjmenovaná nejsou — píší se s I nebo Í." },
  { kind: "fill", q: "Doplň: 'Lékař zkoumal můj jaz_k.'", correct: "y", word: "jazyk", e: "Slovo 'jazyk' je vyjmenované po Z — jazykem mluvíme a ochutnáváme. Vyjmenovaná slova po Z píšeme s Y." },
];

const GRAPHEMES: readonly Grapheme[] = ["y", "ý", "i", "í"] as const;

function makeTask(item: PoolItem): PracticeTask {
  if (item.kind === "fill") {
    return {
      question: item.q,
      correctAnswer: item.correct,
      options: [...GRAPHEMES],
      hints: [
        "Je slovo příbuzné s některým vyjmenovaným?",
        "Ano → Y/Ý. Ne → I/Í.",
      ],
      explanation: item.e,
    };
  }
  return {
    question: item.q,
    correctAnswer: item.correct,
    options: shuffle([item.correct, ...item.distractors]),
    hints: [
      "Rodina = mají stejný kořen a význam navazuje na vyjmenované slovo.",
      "Podobný začátek slova nestačí — musí sedět i význam.",
    ],
    explanation: item.e,
  };
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 10) : level === 2 ? POOL.slice(0, 15) : POOL;
  return shuffle(pool).slice(0, 16).map(makeTask);
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
