import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[]; e: string }[] = [
  // B
  { q: "Doplň: 'Na farmě žil velký b_k.'", a: "býk", opts: ["býk", "bík", "byk", "bik"], e: "'Býk' je vyjmenované slovo po B, proto píšeme Ý. Býk je samec krávy — pamatuj si ho jako zvíře ze seznamu vyjmenovaných slov." },
  { q: "Doplň: 'Umřít — to znamená přestat b_t.'", a: "být", opts: ["být", "bít", "byt", "bit"], e: "'Být' je vyjmenované slovo po B, proto píšeme Ý. Pozor — 'bít' (bít holí) se píše s I, protože to je úplně jiné slovo s jiným významem!" },
  { q: "Doplň: 'V potoce žila velká b_lina.'", a: "bylina", opts: ["bylina", "bilina", "bylínas", "bilínas"], e: "'Bylina' je vyjmenované slovo po B, proto píšeme Y. Byliny jsou léčivé rostliny — třeba máta nebo heřmánek." },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po B?", a: "kobyla", opts: ["kobyla", "kabela", "kabel", "kabát"], e: "'Kobyla' je přímo v seznamu vyjmenovaných slov po B. Ostatní slova (kabela, kabel, kabát) vyjmenovaná nejsou." },
  { q: "Doplň: 'Kobyla je samice a b_k je samec.'", a: "býk", opts: ["býk", "bík", "byk", "bik"], e: "'Býk' je vyjmenované slovo po B — samec krávy. Proto píšeme Ý, ne Í." },
  // L
  { q: "Doplň: 'Na sněhu jsme jeli na l_žích.'", a: "lyžích", opts: ["lyžích", "ližích", "lyzích", "lizích"], e: "'Lyže' je vyjmenované slovo po L, proto píšeme Y. Všechna slova odvozená od 'lyže' (lyžích, lyžovat, lyžař) také píšeme s Y." },
  { q: "Doplň: 'Kůra stromu se jmenuje l_ko.'", a: "lýko", opts: ["lýko", "líko", "lyko", "liko"], e: "'Lýko' je vyjmenované slovo po L, proto píšeme Ý. Lýko je měkká část pod kůrou stromu." },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po L?", a: "lysý", opts: ["lysý", "lisý", "lísek", "lípa"], e: "'Lysý' je vyjmenované slovo po L — znamená to bez vlasů nebo bez srsti. 'Lípa' a 'lísek' jsou stromy, ale nejsou vyjmenovaná — píšeme je s I." },
  { q: "Doplň: 'Na obloze se bl_skalo.'", a: "blýskalo", opts: ["blýskalo", "blískalo", "blyskalo", "bliskalo"], e: "'Blýskat se' je vyjmenované slovo po L, proto píšeme Ý. Blýskání je záblesk světla — třeba při bouřce." },
  // M
  { q: "Doplň: 'M_dlo voní růžemi.'", a: "Mýdlo", opts: ["Mýdlo", "Mydlo", "Mídlo", "Midlo"], e: "'Mýdlo' je vyjmenované slovo po M, proto píšeme Ý. Mýdlem se myjeme — a myje se právě přes Y!" },
  { q: "Doplň: 'M_t nádobí je důležité.'", a: "Mýt", opts: ["Mýt", "Mít", "Myt", "Mit"], e: "'Mýt' (umývat) je vyjmenované slovo po M, proto píšeme Ý. Pozor — 'mít' (vlastnit něco) se píše s Í, protože to je jiné slovo!" },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po M?", a: "myslet", opts: ["myslet", "mislet", "mistr", "místy"], e: "'Myslet' je vyjmenované slovo po M. 'Mistr' a 'místy' nejsou vyjmenovaná a píší se s I." },
  { q: "Doplň: 'Celý den jsme se m_lili, kde je cesta.'", a: "mýlili", opts: ["mýlili", "milili", "mylili", "mílili"], e: "'Mýlit se' je vyjmenované slovo po M, proto píšeme Ý. Mýlit se znamená dělat chyby nebo se plést." },
  // P
  { q: "Doplň: 'P_cha předchází pád.'", a: "Pýcha", opts: ["Pýcha", "Pícha", "Pycha", "Picha"], e: "'Pýcha' je vyjmenované slovo po P, proto píšeme Ý. Pýcha znamená, když si někdo myslí, že je lepší než ostatní." },
  { q: "Doplň: 'Brambory jsou v p_tli.'", a: "pytli", opts: ["pytli", "pitli", "pytlí", "pitlí"], e: "'Pytel' je vyjmenované slovo po P, proto píšeme Y. Jeho tvary (v pytli, v pytlíku) píšeme také s Y, protože jde o stejné slovo." },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po P?", a: "pyl", opts: ["pyl", "pil", "pila", "pili"] , e: "'Pyl' je vyjmenované slovo po P — je to žlutý prášek z květin. 'Pila' (nástroj) a 'pili' (minulý čas od pít) jsou jiná slova a píšou se s I." },
  { q: "Doplň: 'Zločinec musí p_kat za svůj čin.'", a: "pykat", opts: ["pykat", "pikat", "pýkat", "pikat"], e: "'Pykat' je vyjmenované slovo po P, proto píšeme Y. Pykat za čin znamená nést trest nebo následky za špatný skutek." },
  // S
  { q: "Doplň: 'S_r je z mléka.'", a: "Sýr", opts: ["Sýr", "Sír", "Syr", "Sir"], e: "'Sýr' je vyjmenované slovo po S, proto píšeme Ý. Sýr se vyrábí z mléka — a hned si vzpomeneš na Ý jako v slově sýr!" },
  { q: "Doplň: 'Po obědě byl s_tý.'", a: "sytý", opts: ["sytý", "sitý", "sytí", "sití"], e: "'Sytý' je vyjmenované slovo po S, proto píšeme Y. Sytý znamená, že ses najedl a máš plné břicho." },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po S?", a: "syn", opts: ["syn", "sin", "sinec", "síň"], e: "'Syn' je vyjmenované slovo po S — je to chlapec v rodině. 'Síň' (chodba) se píše s Í, ale není vyjmenované po S." },
  { q: "Doplň: 'S_rový sýr není zralý.'", a: "Syrový", opts: ["Syrový", "Sirový", "Syrovi", "Sirovi"], e: "'Syrový' je vyjmenované slovo po S, proto píšeme Y. Syrový znamená čerstvý a nezpracovaný — jako syrové mléko." },
  // V
  { q: "Doplň: 'Vlk začal v_t na měsíc.'", a: "výt", opts: ["výt", "vít", "vyt", "vit"], e: "'Výt' je vyjmenované slovo po V, proto píšeme Ý. Výt znamená vydávat ten táhlý zvuk, jako vlci v noci." },
  { q: "Doplň: 'Má špatný zv_k vstávat pozdě.'", a: "zvyk", opts: ["zvyk", "zvik", "zvík", "zvýk"], e: "'Zvyk' patří do rodiny vyjmenovaného slova 'zvykat' po V, proto píšeme Y. Zvyk je něco, co děláme pravidelně a automaticky." },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po V?", a: "výskat", opts: ["výskat", "vískat", "vyskot", "viskot"], e: "'Výskat' je vyjmenované slovo po V — výskat znamená radostně křičet. Proto píšeme Ý, ne Í." },
  // Z
  { q: "Doplň: 'Přijď brz_, čekám na tebe.'", a: "brzy", opts: ["brzy", "brzi", "brzý", "brzí"], e: "'Brzy' je vyjmenované slovo po Z, proto píšeme Y. Brzy znamená za chvíli nebo co nejdříve." },
  { q: "Doplň: 'Plazí j_zyk je rozdvojený.'", a: "jazyk", opts: ["jazyk", "jazik", "jázyk", "jázik"], e: "'Jazyk' je vyjmenované slovo po Z, proto píšeme Y. Jazyk je orgán v ústech — a hadi mají rozdvojený jazyk!" },
  { q: "Které slovo PATŘÍ mezi vyjmenovaná po Z?", a: "nazývat", opts: ["nazývat", "nazívat", "nazvat", "naziivat"], e: "'Nazývat' je vyjmenované slovo po Z, proto píšeme Ý. Nazývat něco znamená pojmenovat to." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.filter((_, i) => i % 3 === 0).slice(0, 12)
    : level === 2 ? POOL.slice(0, 18) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Vzpomeň si na seznam vyjmenovaných slov pro tuto souhlásku.", "Po B, L, M, P, S, V, Z píšeme Y jen ve vyjmenovaných slovech a jejich příbuzných."],
    explanation: e,
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
