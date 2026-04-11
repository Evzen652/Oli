import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

// ── WORD POOLS ──────────────────────────────────────────────

const VYJMENOVANA_B_WORDS = [
  { word: "b_t (bydlet)", answer: "y" },
  { word: "b_t (bít, tlouci)", answer: "í" },
  { word: "b_lina", answer: "i" },
  { word: "b_k (zvíře)", answer: "ý" },
  { word: "dob_tek", answer: "y" },
  { word: "ob_čej", answer: "y" },
  { word: "b_strý", answer: "y" },
  { word: "kob_la", answer: "y" },
  { word: "b_lý", answer: "í" },
  { word: "zb_tek", answer: "y" },
  { word: "ob_vatel", answer: "y" },
  { word: "b_linka (rostlina)", answer: "i" },
  { word: "náb_tek", answer: "y" },
  { word: "příb_tek", answer: "y" },
  { word: "sb_rat", answer: "í" },
  { word: "odb_t", answer: "y" },
  { word: "b_čí (kolo)", answer: "i" },
  { word: "b_dlo", answer: "y" },
  { word: "b_dlit", answer: "y" },
  { word: "b_tva", answer: "i" },
];

const VYJMENOVANA_L_WORDS = [
  { word: "l_že (lyžovat)", answer: "y" },
  { word: "l_ko (materiál)", answer: "ý" },
  { word: "l_sý", answer: "y" },
  { word: "l_tko", answer: "ý" },
  { word: "pol_kat", answer: "y" },
  { word: "pl_nout", answer: "y" },
  { word: "pl_tvat", answer: "ý" },
  { word: "vzl_kat", answer: "y" },
  { word: "sl_nout", answer: "y" },
  { word: "l_žovat", answer: "y" },
  { word: "l_pa (strom)", answer: "í" },
  { word: "l_stek (na kytku)", answer: "í" },
  { word: "l_ška (zvíře)", answer: "i" },
  { word: "l_žička (polévková)", answer: "í" },
  { word: "l_monáda", answer: "i" },
  { word: "l_nka (pravítko)", answer: "i" },
  { word: "pl_šový", answer: "y" },
  { word: "bl_ská se", answer: "ý" },
  { word: "ml_n", answer: "ý" },
  { word: "sl_šet", answer: "y" },
];

const VYJMENOVANA_M_WORDS = [
  { word: "m_t (mýt nádobí)", answer: "ý" },
  { word: "m_slet", answer: "y" },
  { word: "m_lit se", answer: "ý" },
  { word: "hm_z", answer: "y" },
  { word: "m_š", answer: "y" },
  { word: "hlem_žď", answer: "ý" },
  { word: "m_tit (kácet)", answer: "ý" },
  { word: "zam_kat", answer: "y" },
  { word: "sm_kat", answer: "ý" },
  { word: "chm_ří", answer: "ý" },
  { word: "m_r (klid)", answer: "í" },
  { word: "m_nce", answer: "i" },
  { word: "m_ska (nádoba)", answer: "í" },
  { word: "m_nuta", answer: "i" },
  { word: "m_lý", answer: "i" },
  { word: "zam_řit", answer: "í" },
  { word: "m_sto (místo, place)", answer: "í" },
  { word: "m_nout (minout)", answer: "i" },
  { word: "m_dlo", answer: "ý" },
  { word: "m_šlenka", answer: "y" },
];

const VYJMENOVANA_P_WORDS = [
  { word: "p_cha", answer: "ý" },
  { word: "p_tel", answer: "y" },
  { word: "p_sk (na rtu)", answer: "y" },
  { word: "netop_r", answer: "ý" },
  { word: "slep_š", answer: "ý" },
  { word: "p_l (květinový)", answer: "y" },
  { word: "kop_to", answer: "y" },
  { word: "klop_tat", answer: "ý" },
  { word: "třp_tit se", answer: "y" },
  { word: "zp_tovat", answer: "y" },
  { word: "p_la (nářadí)", answer: "i" },
  { word: "p_vo", answer: "i" },
  { word: "p_smeno", answer: "í" },
  { word: "p_šťalka", answer: "í" },
  { word: "kap_tán", answer: "i" },
  { word: "p_rát", answer: "í" },
  { word: "op_ce", answer: "i" },
  { word: "p_kat (pípat)", answer: "í" },
  { word: "p_lný (pilný)", answer: "i" },
  { word: "p_rko (pero)", answer: "í" },
];

const VYJMENOVANA_S_WORDS = [
  { word: "s_n (chlapec)", answer: "y" },
  { word: "s_r", answer: "ý" },
  { word: "s_rový", answer: "y" },
  { word: "s_chravý", answer: "y" },
  { word: "s_kora", answer: "ý" },
  { word: "s_ček", answer: "ý" },
  { word: "s_sel", answer: "y" },
  { word: "s_pat", answer: "y" },
  { word: "s_tý", answer: "y" },
  { word: "s_čet", answer: "í" },
  { word: "s_la", answer: "í" },
  { word: "s_dlo", answer: "í" },
  { word: "nos_t", answer: "i" },
  { word: "pros_t", answer: "i" },
  { word: "s_lnice", answer: "i" },
  { word: "s_to (na mouku)", answer: "í" },
  { word: "s_rka (zápalka)", answer: "i" },
  { word: "s_rečky (zápalkové)", answer: "i" },
  { word: "s_rup (lék)", answer: "i" },
  { word: "nas_tit se", answer: "y" },
];

const VYJMENOVANA_V_WORDS = [
  { word: "v_soký", answer: "y" },
  { word: "v_t (vlk vyje)", answer: "ý" },
  { word: "v_kat", answer: "y" },
  { word: "zv_k", answer: "y" },
  { word: "v_r (pták)", answer: "ý" },
  { word: "v_dra", answer: "y" },
  { word: "v_skot", answer: "ý" },
  { word: "pov_k", answer: "y" },
  { word: "v_živa", answer: "ý" },
  { word: "zv_šit", answer: "ý" },
  { word: "v_dět", answer: "i" },
  { word: "v_no", answer: "í" },
  { word: "v_tr (vzduch)", answer: "í" },
  { word: "v_deo", answer: "i" },
  { word: "v_la (příbor)", answer: "i" },
  { word: "v_těz", answer: "í" },
  { word: "zv_ře", answer: "í" },
  { word: "sv_čka", answer: "í" },
  { word: "ov_ce", answer: "i" },
  { word: "v_dlička", answer: "i" },
];

const VYJMENOVANA_Z_WORDS = [
  { word: "brz_", answer: "y" },
  { word: "jaz_k", answer: "y" },
  { word: "naz_vat", answer: "ý" },
  { word: "Ruz_ně", answer: "y" },
  { word: "brz_čko", answer: "y" },
  { word: "jaz_ček", answer: "ý" },
  { word: "z_ma", answer: "i" },
  { word: "z_tra", answer: "í" },
  { word: "z_sk (přínos)", answer: "í" },
  { word: "z_vat (zívat)", answer: "í" },
  { word: "koz_", answer: "i" },
  { word: "z_nek (zvuk)", answer: "i" },
  { word: "z_rka (zrcadlo)", answer: "i" },
  { word: "oz_vat se", answer: "ý" },
  { word: "z_mník", answer: "i" },
  { word: "z_skat", answer: "í" },
  { word: "voz_k", answer: "í" },
  { word: "z_dle (židle)", answer: "i" },
  { word: "hroz_nky", answer: "i" },
  { word: "z_račka", answer: "i" },
];

// ── HELPERS ─────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function genVyjmenovanaSlovaFromPool(pool: { word: string; answer: string }[]): (level: number) => PracticeTask[] {
  return (_level: number): PracticeTask[] => {
    return shuffleArray(pool).slice(0, pool.length).map((w) => {
      const normalizedAnswer = (w.answer === "y" || w.answer === "ý") ? "y/ý" : "i/í";
      const match = w.word.match(/^(.)_/);
      const letter = match ? match[1].toUpperCase() : "B";
      return {
        question: w.word,
        correctAnswer: normalizedAnswer,
        options: ["y/ý", "i/í"],
        hints: [`Slovo „${w.word}" — patří do řady vyjmenovaných slov po ${letter}?`, `Vzpomeň si na vyjmenovaná slova po ${letter}. Je tam, nebo je to slovo odvozené?`],
      };
    });
  };
}

// ── GENERATORS ──────────────────────────────────────────────

const genVyjmenovanaSlovaB = genVyjmenovanaSlovaFromPool(VYJMENOVANA_B_WORDS);
const genVyjmenovanaSlovaL = genVyjmenovanaSlovaFromPool(VYJMENOVANA_L_WORDS);
const genVyjmenovanaSlovaM = genVyjmenovanaSlovaFromPool(VYJMENOVANA_M_WORDS);
const genVyjmenovanaSlovaP = genVyjmenovanaSlovaFromPool(VYJMENOVANA_P_WORDS);
const genVyjmenovanaSlovaS = genVyjmenovanaSlovaFromPool(VYJMENOVANA_S_WORDS);
const genVyjmenovanaSlovaV = genVyjmenovanaSlovaFromPool(VYJMENOVANA_V_WORDS);
const genVyjmenovanaSlovaZ = genVyjmenovanaSlovaFromPool(VYJMENOVANA_Z_WORDS);

// ── HELP TEMPLATES ──────────────────────────────────────────

const HELP_VYJMENOVANA_B: HelpData = {
  hint: "Zkus si říct vyjmenovaná slova po B — znáš je z básničky nebo říkanky. Když je to slovo z řady nebo příbuzné, piš Y. Když ne, piš I.",
  steps: [
    "Přečti si slovo a řekni si ho nahlas.",
    "Je to vyjmenované slovo (být, bydlit, obyvatel, byt, příbytek, nábytek, dobytek, obyčej, bystrý, kobyla, aby, bylina) nebo slovo od něj odvozené? → piš Y/Ý.",
    "Není? → piš I/Í.",
  ],
  commonMistake: "Pozor na slova, která zní podobně, ale mají jiný význam! Třeba 'být' (žít, existovat) se píše s Y, ale 'bít' (tlouci, mlátit) se píše s I.",
  example: "'bydlet' je od slova 'být' → je to vyjmenované → píšeme Y. Ale 'bít' znamená tlouci → to NENÍ vyjmenované → píšeme Í.",
  visualExamples: [
    {
      label: "Jak poznat, jestli psát Y nebo I po B?",
      illustration: "Přečti slovo → Je vyjmenované nebo příbuzné?\n\n✅ ANO → piš Y/Ý:\n   být → bydlet, obyvatel, byt, příbytek\n   🏠 bYdlet (kde žiješ) → Y\n\n❌ NE → piš I/Í:\n   bít → bitva, bič\n   ⚔️ bÍtva (boj) → I\n\n💡 Klíč: najdi hlavní slovo z řady!",
    },
  ],
};

function helpVyjmenovana(letter: string, mainWords: string): HelpData {
  return {
    hint: `Zkus si říct vyjmenovaná slova po ${letter} — znáš je z básničky. Když je to slovo z řady nebo příbuzné, piš Y.`,
    steps: [
      "Přečti si slovo a řekni si ho nahlas.",
      `Je to vyjmenované slovo po ${letter} (${mainWords}) nebo slovo příbuzné? → piš Y/Ý.`,
      "Není? → piš I/Í.",
    ],
    commonMistake: `Pozor na příbuzná slova! Třeba vyjmenované slovo a slova od něj odvozená se všechna píší stejně.`,
    example: `Řekni si celou řadu po ${letter} a zkontroluj, jestli tam slovo je nebo je od některého odvozené.`,
    visualExamples: [
      {
        label: `Jak poznat, jestli psát Y nebo I po ${letter}?`,
        illustration: `Přečti slovo → Je vyjmenované nebo příbuzné?\n\n✅ ANO → piš Y/Ý\n❌ NE → piš I/Í\n\n💡 Klíč: nauč se řadu po ${letter} nazpaměť!`,
      },
    ],
  };
}

const HELP_VYJMENOVANA_L = helpVyjmenovana("L", "lyže, lýko, lysý, lýtko, polykat, plynout, plýtvat, vzlykat, slynout");
const HELP_VYJMENOVANA_M = helpVyjmenovana("M", "my, mýt, myslet, mýlit se, hmyz, myš, hlemýžď, mýtit, zamykat, smýkat");
const HELP_VYJMENOVANA_P = helpVyjmenovana("P", "pýcha, pytel, pysk, netopýr, slepýš, pyl, kopyto, klopýtat, třpytit se, zpytovat");
const HELP_VYJMENOVANA_S = helpVyjmenovana("S", "syn, sýr, syrový, sychravý, sýkora, sýček, sysel, sypat, sytý");
const HELP_VYJMENOVANA_V = helpVyjmenovana("V", "vy, vysoký, výt, vykat, zvyk, výr, vydra, výskot, povyk, výživa");
const HELP_VYJMENOVANA_Z = helpVyjmenovana("Z", "brzy, jazyk, nazývat, Ruzyně");

// ── TOPIC METADATA ──────────────────────────────────────────

export const VYJMENOVANA_TOPICS: TopicMetadata[] = [
  {
    id: "cz-vyjmenovana-slova-b",
    title: "Vyjmenovaná slova po B",
    subject: "čeština",
    category: "Vyjmenovaná slova",
    topic: "Vyjmenovaná slova po B",
    briefDescription: "Procvičíš si, kdy se po B píše y/ý a kdy i/í.",
    keywords: ["vyjmenovaná slova", "slova po b", "vyjmenovaná slova po b", "bý", "by", "vyjmenovaná"],
    goals: ["Naučíš se správně určit, jestli se po B píše y/ý nebo i/í."],
    boundaries: ["Pouze slova po B", "Žádná slova po jiných souhláskách", "Žádné pravopisné jevy mimo y/i po B"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genVyjmenovanaSlovaB,
    helpTemplate: HELP_VYJMENOVANA_B,
  },
  {
    id: "cz-vyjmenovana-slova-l",
    title: "Vyjmenovaná slova po L",
    subject: "čeština",
    category: "Vyjmenovaná slova",
    topic: "Vyjmenovaná slova po L",
    briefDescription: "Procvičíš si, kdy se po L píše y/ý a kdy i/í.",
    keywords: ["vyjmenovaná slova po l", "slova po l", "ly", "lý"],
    goals: ["Naučíš se správně určit, jestli se po L píše y/ý nebo i/í."],
    boundaries: ["Pouze slova po L", "Žádná slova po jiných souhláskách"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genVyjmenovanaSlovaL,
    helpTemplate: HELP_VYJMENOVANA_L,
  },
  {
    id: "cz-vyjmenovana-slova-m",
    title: "Vyjmenovaná slova po M",
    subject: "čeština",
    category: "Vyjmenovaná slova",
    topic: "Vyjmenovaná slova po M",
    briefDescription: "Procvičíš si, kdy se po M píše y/ý a kdy i/í.",
    keywords: ["vyjmenovaná slova po m", "slova po m", "my", "mý"],
    goals: ["Naučíš se správně určit, jestli se po M píše y/ý nebo i/í."],
    boundaries: ["Pouze slova po M", "Žádná slova po jiných souhláskách"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genVyjmenovanaSlovaM,
    helpTemplate: HELP_VYJMENOVANA_M,
  },
  {
    id: "cz-vyjmenovana-slova-p",
    title: "Vyjmenovaná slova po P",
    subject: "čeština",
    category: "Vyjmenovaná slova",
    topic: "Vyjmenovaná slova po P",
    briefDescription: "Procvičíš si, kdy se po P píše y/ý a kdy i/í.",
    keywords: ["vyjmenovaná slova po p", "slova po p", "py", "pý"],
    goals: ["Naučíš se správně určit, jestli se po P píše y/ý nebo i/í."],
    boundaries: ["Pouze slova po P", "Žádná slova po jiných souhláskách"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genVyjmenovanaSlovaP,
    helpTemplate: HELP_VYJMENOVANA_P,
  },
  {
    id: "cz-vyjmenovana-slova-s",
    title: "Vyjmenovaná slova po S",
    subject: "čeština",
    category: "Vyjmenovaná slova",
    topic: "Vyjmenovaná slova po S",
    briefDescription: "Procvičíš si, kdy se po S píše y/ý a kdy i/í.",
    keywords: ["vyjmenovaná slova po s", "slova po s", "sy", "sý"],
    goals: ["Naučíš se správně určit, jestli se po S píše y/ý nebo i/í."],
    boundaries: ["Pouze slova po S", "Žádná slova po jiných souhláskách"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genVyjmenovanaSlovaS,
    helpTemplate: HELP_VYJMENOVANA_S,
  },
  {
    id: "cz-vyjmenovana-slova-v",
    title: "Vyjmenovaná slova po V",
    subject: "čeština",
    category: "Vyjmenovaná slova",
    topic: "Vyjmenovaná slova po V",
    briefDescription: "Procvičíš si, kdy se po V píše y/ý a kdy i/í.",
    keywords: ["vyjmenovaná slova po v", "slova po v", "vy", "vý"],
    goals: ["Naučíš se správně určit, jestli se po V píše y/ý nebo i/í."],
    boundaries: ["Pouze slova po V", "Žádná slova po jiných souhláskách"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genVyjmenovanaSlovaV,
    helpTemplate: HELP_VYJMENOVANA_V,
  },
  {
    id: "cz-vyjmenovana-slova-z",
    title: "Vyjmenovaná slova po Z",
    subject: "čeština",
    category: "Vyjmenovaná slova",
    topic: "Vyjmenovaná slova po Z",
    briefDescription: "Procvičíš si, kdy se po Z píše y/ý a kdy i/í.",
    keywords: ["vyjmenovaná slova po z", "slova po z", "zy", "zý"],
    goals: ["Naučíš se správně určit, jestli se po Z píše y/ý nebo i/í."],
    boundaries: ["Pouze slova po Z", "Žádná slova po jiných souhláskách"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genVyjmenovanaSlovaZ,
    helpTemplate: HELP_VYJMENOVANA_Z,
  },
];
