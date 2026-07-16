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
 * PED-1 refaktor: dva typy úloh mají teď různé možnosti.
 * - `fill`  — „Doplň: 'b_k'" → options jsou POUZE sporný grafém [y, ý, i, í].
 *   Dříve options obsahovaly celá chybná slova („bík", „byk", „bik") — dítě si je
 *   zapamatovalo.
 * - `which` — „Které slovo PATŘÍ mezi vyjmenovaná po B?" → options jsou 4 SPRÁVNĚ
 *   NAPSANÁ slova, jen jedno je vyjmenované. Dříve byly mezi distraktory
 *   překlepy („mislet", „sinec", „naziivat") — antipattern.
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
  // ── B ─────────────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'Na farmě žil velký b_k.'", correct: "ý", word: "býk", e: "'Býk' je vyjmenované slovo po B, proto píšeme Ý. Býk je samec krávy — pamatuj si ho jako zvíře ze seznamu vyjmenovaných slov." },
  { kind: "fill", q: "Doplň: 'Umřít — to znamená přestat b_t.'", correct: "ý", word: "být", e: "'Být' je vyjmenované slovo po B, proto píšeme Ý. Pozor — 'bít' (bít holí) se píše s Í, protože to je úplně jiné slovo s jiným významem!" },
  { kind: "fill", q: "Doplň: 'V potoce žila velká b_lina.'", correct: "y", word: "bylina", e: "'Bylina' je vyjmenované slovo po B, proto píšeme Y. Byliny jsou léčivé rostliny — třeba máta nebo heřmánek." },
  { kind: "which", q: "Které slovo PATŘÍ mezi vyjmenovaná po B?", correct: "kobyla", distractors: ["kabela", "kabel", "kabát"], e: "'Kobyla' je přímo v seznamu vyjmenovaných slov po B. Ostatní slova (kabela, kabel, kabát) vyjmenovaná nejsou." },
  { kind: "fill", q: "Doplň: 'Kobyla je samice a b_k je samec.'", correct: "ý", word: "býk", e: "'Býk' je vyjmenované slovo po B — samec krávy. Proto píšeme Ý, ne Í." },
  // ── L ─────────────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'Na sněhu jsme jeli na l_žích.'", correct: "y", word: "lyžích", e: "'Lyže' je vyjmenované slovo po L, proto píšeme Y. Všechna slova odvozená od 'lyže' (lyžích, lyžovat, lyžař) také píšeme s Y." },
  { kind: "fill", q: "Doplň: 'Kůra stromu se jmenuje l_ko.'", correct: "ý", word: "lýko", e: "'Lýko' je vyjmenované slovo po L, proto píšeme Ý. Lýko je měkká část pod kůrou stromu." },
  { kind: "which", q: "Které slovo PATŘÍ mezi vyjmenovaná po L?", correct: "lysý", distractors: ["liška", "lípa", "letadlo"], e: "'Lysý' je vyjmenované slovo po L — znamená bez vlasů nebo bez srsti. Liška, lípa ani letadlo mezi vyjmenovaná slova nepatří — po L v nich píšeme I." },
  { kind: "fill", q: "Doplň: 'Na obloze se bl_skalo.'", correct: "ý", word: "blýskalo", e: "'Blýskat se' je vyjmenované slovo po L, proto píšeme Ý. Blýskání je záblesk světla — třeba při bouřce." },
  // ── M ─────────────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'M_dlo voní růžemi.'", correct: "ý", word: "Mýdlo", e: "'Mýdlo' je vyjmenované slovo po M, proto píšeme Ý. Mýdlem se myjeme — a myje se právě přes Y!" },
  { kind: "fill", q: "Doplň: 'M_t nádobí je důležité.'", correct: "ý", word: "Mýt", e: "'Mýt' (umývat) je vyjmenované slovo po M, proto píšeme Ý. Pozor — 'mít' (vlastnit něco) se píše s Í, protože to je jiné slovo!" },
  { kind: "which", q: "Které slovo PATŘÍ mezi vyjmenovaná po M?", correct: "myslet", distractors: ["milovat", "mistr", "místy"], e: "'Myslet' je vyjmenované slovo po M. 'Milovat', 'mistr' i 'místy' vyjmenovaná nejsou — píší se s I." },
  { kind: "fill", q: "Doplň: 'Celý den jsme se m_lili, kde je cesta.'", correct: "ý", word: "mýlili", e: "'Mýlit se' je vyjmenované slovo po M, proto píšeme Ý. Mýlit se znamená dělat chyby nebo se plést." },
  // ── P ─────────────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'P_cha předchází pád.'", correct: "ý", word: "Pýcha", e: "'Pýcha' je vyjmenované slovo po P, proto píšeme Ý. Pýcha znamená, když si někdo myslí, že je lepší než ostatní." },
  { kind: "fill", q: "Doplň: 'Brambory jsou v p_tli.'", correct: "y", word: "pytli", e: "'Pytel' je vyjmenované slovo po P, proto píšeme Y. Jeho tvary (v pytli, v pytlíku) píšeme také s Y, protože jde o stejné slovo." },
  { kind: "which", q: "Které slovo PATŘÍ mezi vyjmenovaná po P?", correct: "pyl", distractors: ["pila", "pili", "pták"], e: "'Pyl' je vyjmenované slovo po P — je to žlutý prášek z květin. 'Pila' (nástroj), 'pili' (minulý čas od pít) a 'pták' vyjmenovaná nejsou — píší se s I." },
  { kind: "fill", q: "Doplň: 'Zločinec musí p_kat za svůj čin.'", correct: "y", word: "pykat", e: "'Pykat' je vyjmenované slovo po P, proto píšeme Y. Pykat za čin znamená nést trest nebo následky za špatný skutek." },
  // ── S ─────────────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'S_r je z mléka.'", correct: "ý", word: "Sýr", e: "'Sýr' je vyjmenované slovo po S, proto píšeme Ý. Sýr se vyrábí z mléka — a hned si vzpomeneš na Ý jako v slově sýr!" },
  { kind: "fill", q: "Doplň: 'Po obědě byl s_tý.'", correct: "y", word: "sytý", e: "'Sytý' je vyjmenované slovo po S, proto píšeme Y. Sytý znamená, že ses najedl a máš plné břicho." },
  { kind: "which", q: "Které slovo PATŘÍ mezi vyjmenovaná po S?", correct: "syn", distractors: ["sen", "silák", "síla"], e: "'Syn' je vyjmenované slovo po S — je to chlapec v rodině. 'Sen', 'silák' ani 'síla' vyjmenovaná nejsou — píší se s I nebo Í." },
  { kind: "fill", q: "Doplň: 'S_rový sýr není zralý.'", correct: "y", word: "Syrový", e: "'Syrový' je vyjmenované slovo po S, proto píšeme Y. Syrový znamená čerstvý a nezpracovaný — jako syrové mléko." },
  // ── V ─────────────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'Vlk začal v_t na měsíc.'", correct: "ý", word: "výt", e: "'Výt' je vyjmenované slovo po V, proto píšeme Ý. Výt znamená vydávat ten táhlý zvuk, jako vlci v noci." },
  { kind: "fill", q: "Doplň: 'Má špatný zv_k vstávat pozdě.'", correct: "y", word: "zvyk", e: "'Zvyk' patří do rodiny vyjmenovaného slova 'zvykat' po V, proto píšeme Y. Zvyk je něco, co děláme pravidelně a automaticky." },
  { kind: "which", q: "Které slovo PATŘÍ mezi vyjmenovaná po V?", correct: "výskat", distractors: ["vidět", "vítr", "vítat"], e: "'Výskat' je vyjmenované slovo po V — výskat znamená radostně křičet. 'Vidět', 'vítr' i 'vítat' mezi vyjmenovaná slova nepatří." },
  // ── Z ─────────────────────────────────────────────────────
  { kind: "fill", q: "Doplň: 'Přijď brz_, čekám na tebe.'", correct: "y", word: "brzy", e: "'Brzy' je vyjmenované slovo po Z, proto píšeme Y. Brzy znamená za chvíli nebo co nejdříve." },
  { kind: "fill", q: "Doplň: 'Plazí jaz_k je rozdvojený.'", correct: "y", word: "jazyk", e: "'Jazyk' je vyjmenované slovo po Z, proto píšeme Y. Jazyk je orgán v ústech — a hadi mají rozdvojený jazyk!" },
  { kind: "which", q: "Které slovo PATŘÍ mezi vyjmenovaná po Z?", correct: "nazývat", distractors: ["namočit", "napsat", "nakoupit"], e: "'Nazývat' je vyjmenované slovo po Z — nazývat něco znamená pojmenovat to. 'Namočit', 'napsat' ani 'nakoupit' vyjmenovaná nejsou." },
];

const GRAPHEMES: readonly Grapheme[] = ["y", "ý", "i", "í"] as const;

function makeTask(item: PoolItem): PracticeTask {
  if (item.kind === "fill") {
    return {
      question: item.q,
      correctAnswer: item.correct,
      // Sporný grafém — vždy stejná sada, dítě si nezapamatuje chybnou variantu slova.
      options: [...GRAPHEMES],
      hints: [
        "Je slovo v seznamu vyjmenovaných po dané souhlásce (nebo je jeho příbuzné)?",
        "Ano → tvrdé Y/Ý. Ne → měkké I/Í.",
      ],
      explanation: item.e,
    };
  }
  return {
    question: item.q,
    correctAnswer: item.correct,
    // Všechna 4 slova správně napsaná — jen 1 je vyjmenované. Test rozpoznání
    // příslušnosti, ne pravopisný trik.
    options: shuffle([item.correct, ...item.distractors]),
    hints: [
      "Vyjmenovaná slova = zvláštní seznam slov s Y/Ý po B, L, M, P, S, V, Z.",
      "Ostatní slova (i po stejné souhlásce) píšeme s I/Í.",
    ],
    explanation: item.e,
  };
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.filter((_, i) => i % 3 === 0).slice(0, 12)
    : level === 2 ? POOL.slice(0, 18) : POOL;
  return shuffle(pool).slice(0, 16).map(makeTask);
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
