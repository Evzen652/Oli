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
const POOL: { q: string; a: string; opts: string[]; e: string }[] = [
  // po B
  { q: "Doplň správně: 'Koupili jsme nové b_dlení.'", a: "bydlení", opts: ["bydlení", "bidlení", "bydliny", "bidliny"], e: "Slovo 'bydlení' patří do rodiny vyjmenovaného slova 'být' — bydlet, bydliště, bydlení. Po souhlásce B u vyjmenovaných slov a jejich příbuzných píšeme vždy Y." },
  { q: "Doplň správně: 'Na louce se pásl b_k a krávy.'", a: "býk", opts: ["býk", "bík", "byk", "bik"], e: "Slovo 'býk' je vyjmenované slovo po B, proto píšeme Ý. Býk je samec krávy — pamatuj si ho jako jedno z vyjmenovaných slov." },
  { q: "Doplň správně: 'B_strý potok tekl přes kameny.'", a: "Bystrý", opts: ["Bystrý", "Bistrý", "Bystri", "Bistri"], e: "Slovo 'bystrý' je vyjmenované slovo po B — znamená rychlý nebo chytrý. Patří k němu i příbuzná 'bystřina' (rychlý potok)." },
  { q: "Příbuzné slovo k 'být' je:", a: "bydliště", opts: ["bydliště", "bidlo", "bičovat", "bílek"], e: "Slovo 'bydliště' patří do rodiny slova 'být' — bydlet, bydlení, bydliště. Všechna tato slova mají Y, protože jsou příbuzná s vyjmenovaným slovem 'být'." },
  // po L
  { q: "Doplň správně: 'Na l_žích jsme jeli z kopce.'", a: "lyžích", opts: ["lyžích", "ližích", "lyzích", "lizích"], e: "Slovo 'lyže' je vyjmenované slovo po L, takže 'lyžích' (míst. pád od lyže) se píše také s Y. Celá rodina lyže, lyžař, lyžování má Y." },
  { q: "Doplň správně: 'Kůra stromu se nazývá l_ko.'", a: "lýko", opts: ["lýko", "líko", "lyko", "liko"], e: "Slovo 'lýko' je vyjmenované slovo po L — je to tenká vrstva pod kůrou stromu. Vyjmenovaná slova po L se píší s Y nebo Ý." },
  { q: "Příbuzné slovo k 'lyže' je:", a: "lyžař", opts: ["lyžař", "ližař", "lyzař", "lizař"], e: "Slovo 'lyžař' je příbuzné k vyjmenovanému slovu 'lyže'. Patří do stejné rodiny: lyže → lyžař → lyžovat. Celá rodina píše Y." },
  // po M
  { q: "Doplň správně: 'M_dlo voní levandulí.'", a: "Mýdlo", opts: ["Mýdlo", "Mydlo", "Mídlo", "Midlo"], e: "Slovo 'mýdlo' je příbuzné k vyjmenovanému slovu 'mýt' — mýdlem se myjeme. Píšeme Ý, protože je to příbuzné s vyjmenovaným slovem." },
  { q: "Doplň správně: 'Musíme m_t nádobí po večeři.'", a: "mýt", opts: ["mýt", "mít", "myt", "mit"], e: "Slovo 'mýt' je přímo vyjmenované slovo po M. Pozor, nezaměňuj s 'mít' (vlastnit) — to je jiné slovo s krátkým I!" },
  { q: "Příbuzné slovo k 'myslet' je:", a: "myšlenka", opts: ["myšlenka", "mišlenka", "myšlinka", "mišlinka"], e: "Slovo 'myšlenka' patří do rodiny slova 'myslet', které je příbuzné s vyjmenovaným slovem 'mysl'. Proto celá rodina — myslet, myšlenka, myšlení — píše Y." },
  // po P
  { q: "Doplň správně: 'P_cha předchází pád.'", a: "Pýcha", opts: ["Pýcha", "Pícha", "Pycha", "Picha"], e: "Slovo 'pýcha' je vyjmenované slovo po P. Příbuzné je 'pyšný' — kdo je pyšný, má v sobě pýchu. Celá rodina se píše s Y/Ý." },
  { q: "Doplň správně: 'Brambory dáme do p_tele.'", a: "pytle", opts: ["pytle", "pitle", "pytlie", "pitlie"], e: "Slovo 'pytel' je vyjmenované slovo po P, proto jeho tvary — pytle, pytlích, pytlíku — se také píší s Y." },
  { q: "Příbuzné slovo k 'pyšný' je:", a: "pýcha", opts: ["pýcha", "pícha", "pycha", "pichla"], e: "Slova 'pyšný' a 'pýcha' patří do jedné rodiny vyjmenovaných slov po P. Kdo je pyšný, má pýchu — obě slova píšeme s Y." },
  // po S
  { q: "Doplň správně: 'S_r je výrobek z mléka.'", a: "Sýr", opts: ["Sýr", "Sír", "Syr", "Sir"], e: "Slovo 'sýr' je vyjmenované slovo po S, proto se píše s Ý. Pamatuj si ho zpaměti jako součást řady vyjmenovaných slov." },
  { q: "Byl s_tý, protože hodně snědl.", a: "sytý", opts: ["sytý", "sitý", "sytí", "sití"], e: "Slovo 'sytý' je vyjmenované slovo po S. Příbuzná slova (sytit, nasytit) se také píší s Y." },
  // po V
  { q: "Doplň správně: 'Vlk začal v_t na měsíc.'", a: "výt", opts: ["výt", "vít", "vyt", "vit"], e: "Slovo 'výt' je vyjmenované slovo po V — takto označujeme zvuk vlka. Píšeme Ý, protože je to vyjmenované slovo." },
  { q: "Příbuzné slovo k 'zvyk' je:", a: "zvyknout", opts: ["zvyknout", "zviknout", "zvíknout", "zvyknót"], e: "Slovo 'zvyknout' patří do rodiny vyjmenovaného slova 'zvykat' po V. Celá rodina — zvyk, zvyknout, zvyklý — se píše s Y." },
  // po Z
  { q: "Doplň správně: 'Přijď brz_.'", a: "brzy", opts: ["brzy", "brzi", "brzý", "brzí"], e: "Slovo 'brzy' je vyjmenované slovo po Z, proto píšeme Y. Brzy znamená za chvíli nebo co nejdříve." },
  { q: "Příbuzné slovo k 'jazyk' je:", a: "jazykový", opts: ["jazykový", "jazikový", "jazykovi", "jazikovi"], e: "Slovo 'jazykový' patří do rodiny vyjmenovaného slova 'jazyk'. Jazyk, jazykový, jazykověda — celá rodina píše Y, protože 'jazyk' je vyjmenované slovo po Z." },
  { q: "Doplň správně: 'Lékař zkoumal můj j_zyk.'", a: "jazyk", opts: ["jazyk", "jazik", "jázyk", "jázik"], e: "Slovo 'jazyk' je vyjmenované slovo po Z — jazykem mluvíme a ochutnáváme. Vyjmenovaná slova po Z píšeme s Y." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 10) : level === 2 ? POOL.slice(0, 15) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Příbuzná slova k vyjmenovaným se také píší s Y/Ý.", "Najdi vyjmenované slovo, ke kterému toto patří."],
    explanation: e,
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
