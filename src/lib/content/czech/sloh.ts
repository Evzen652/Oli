import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

// ── HELPERS ─────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── PROMPTY VYPRÁVĚNÍ (3.-5. třída) ─────────────────────────

const VYPRAVENI_3_5: { prompt: string; minWords: number }[] = [
  {
    prompt: "Napiš krátký vyprávěcí text o tom, co jsi zažil(a) o víkendu. Co bylo nejhezčí?",
    minWords: 40,
  },
  {
    prompt: "Vymysli příběh o tvém oblíbeném zvířeti. Kde žije, co rádo dělá a co s ním zažíváš?",
    minWords: 40,
  },
  {
    prompt: "Napiš o tom, jak jsi pomohl(a) někomu z rodiny nebo kamarádovi. Jak to dopadlo?",
    minWords: 40,
  },
  {
    prompt: "Popiš svůj nejhezčí výlet. Kdo s tebou byl, co jste viděli a co tě překvapilo?",
    minWords: 40,
  },
  {
    prompt: "Napiš krátký příběh o tom, jak jsi se svým kamarádem řešil(a) nějaký problém.",
    minWords: 40,
  },
  {
    prompt: "Představ si, že máš kouzelný předmět. Co s ním děláš a co tě s ním potkalo?",
    minWords: 40,
  },
  {
    prompt: "Vyprávěj, co se stalo ve škole, co tě potěšilo nebo naopak zarazilo.",
    minWords: 40,
  },
];

// ── PROMPTY POPIS (3.-5. třída) ─────────────────────────────

const POPIS_3_5: { prompt: string; minWords: number }[] = [
  {
    prompt: "Popiš svůj pokoj — co v něm máš, co tam děláš nejraději a co tam nesmí chybět.",
    minWords: 40,
  },
  {
    prompt: "Popiš zvíře, které máš doma nebo bys chtěl(a) mít. Jak vypadá a jakou má povahu?",
    minWords: 40,
  },
  {
    prompt: "Popiš místo, kam rád(a) chodíš (park, hřiště, babičku). Co je tam zvláštního?",
    minWords: 40,
  },
  {
    prompt: "Popiš kamaráda nebo kamarádku — jak vypadá, co má rád(a), proč si rozumíte.",
    minWords: 40,
  },
];

function genVypraveni(level: number): PracticeTask[] {
  const minWords = level >= 3 ? 60 : level >= 2 ? 45 : 35;
  // 1 task per session — sloh je drahá AI evaluace + chce čas na psaní
  const picked = shuffleArray(VYPRAVENI_3_5).slice(0, 1);
  return picked.map((p) => ({
    question: p.prompt,
    correctAnswer: "60",
    essay: { minWords, gradeMin: 4 },
    hints: [
      `Začni nějakým "Jednou…" nebo "Bylo to…".`,
      "Dej dohromady úvod (co se dělo), prostředek (co se stalo) a konec.",
      `Použij pestrá slova — ne pořád "pak" a "a".`,
    ],
  }));
}

function genPopis(level: number): PracticeTask[] {
  const minWords = level >= 3 ? 55 : level >= 2 ? 45 : 35;
  const picked = shuffleArray(POPIS_3_5).slice(0, 1);
  return picked.map((p) => ({
    question: p.prompt,
    correctAnswer: "60",
    essay: { minWords, gradeMin: 4 },
    hints: [
      "Začni od celku, postupně přidávej detaily (barva, velikost, pocit).",
      "Použij přídavná jména — co nejvíc různých.",
      "Na závěr připoj svůj názor: proč tě to baví / proč to máš rád(a).",
    ],
  }));
}

// ── HELP TEMPLATES ──────────────────────────────────────────

const HELP_VYPRAVENI: HelpData = {
  hint: "Sloh je o tom, vyprávět vlastními slovy. Není jediná správná odpověď — důležité je, ať to drží pohromadě a má začátek, prostředek a konec.",
  steps: [
    "Rozmysli si, co chceš vyprávět (1 zážitek, 1 příběh).",
    "Napiš úvod: kde a kdy se to stalo, kdo tam byl.",
    "Pak prostředek: co se dělo, co tě překvapilo.",
    "Nakonec závěr: jak to dopadlo, co si z toho odnášíš.",
    `Použij pestrá slova — ne pořád "pak", "a", "potom".`,
  ],
  commonMistake: `Jeden dlouhý odstavec bez začátku/konce. Nebo příliš krátké ("Bylo to fajn.") — málo detailů.`,
  example: `"Minulý víkend jsme byli s tátou v lese. Hledali jsme houby. Já jsem našla velký hřib a byla jsem na sebe pyšná. Pak jsme si u řeky dali svačinu a táta mi vyprávěl, jak chodil do lesa, když byl malý. Bylo to krásné odpoledne."`,
};

const HELP_POPIS: HelpData = {
  hint: `Popis říká "jak to vypadá / jaké to je". Postupuj od celku k detailům, používej přídavná jména a vlastní pocit.`,
  steps: [
    "Začni shrnutím — co vlastně popisuješ.",
    "Pokračuj od největších věcí k drobným detailům.",
    "Přidej barvy, velikosti, vůně, zvuky, pocity.",
    "Na závěr napiš svůj vztah — proč tě to baví / na co se těšíš.",
  ],
  commonMistake: "Suchý seznam vlastností bez emocí. Popis má být živý, ne jako z encyklopedie.",
  example: `"Náš kocour Mourek je velký šedý kocour s bílými tlapkami. Má zelené oči a dlouhé fousy. Nejraději spí na okně, ale když přijdu domů, hned na mě běží a mňouká. Mám ho moc ráda."`,
};

// ── TOPIC METADATA ──────────────────────────────────────────

export const SLOH_TOPICS: TopicMetadata[] = [
  {
    id: "cz-sloh-vypraveni",
    title: "Vyprávění",
    subject: "čeština",
    category: "Sloh",
    topic: "Vyprávění",
    briefDescription:
      "Napíšeš krátký vyprávěcí text — třeba o víkendu, výletu nebo zážitku. AI ti dá tipy, jak ho vylepšit.",
    keywords: ["sloh", "vyprávění", "napsat příběh", "vypravování", "co se stalo", "zážitek"],
    goals: [
      "Naučíš se napsat krátký souvislý text se začátkem, prostředkem a koncem.",
      "Procvičíš si používání pestrých slov a propojování vět.",
    ],
    boundaries: [
      "Není to diktát ani test pravopisu — drobné chyby nesráží skóre dolů",
      "Cílem je čtivost a struktura, ne perfektní gramatika",
    ],
    gradeRange: [3, 5],
    practiceType: "result_only",
    defaultLevel: 2,
    sessionTaskCount: 1,
    inputType: "essay",
    contentType: "conceptual",
    generator: genVypraveni,
    helpTemplate: HELP_VYPRAVENI,
  },
  {
    id: "cz-sloh-popis",
    title: "Popis",
    subject: "čeština",
    category: "Sloh",
    topic: "Popis",
    briefDescription:
      "Popíšeš zvíře, místo nebo kamaráda. AI zhodnotí, jak je popis živý a jestli máš pestrý slovník.",
    keywords: ["sloh", "popis", "popsat", "popis zvířete", "popis pokoje", "popis kamaráda"],
    goals: [
      "Naučíš se popsat věc, místo nebo osobu od celku k detailům.",
      "Procvičíš si použití přídavných jmen a vlastního názoru.",
    ],
    boundaries: [
      "Není to diktát — drobné chyby nesráží skóre",
      "Cílem je živý popis, ne suchý seznam vlastností",
    ],
    gradeRange: [3, 5],
    practiceType: "result_only",
    defaultLevel: 2,
    sessionTaskCount: 1,
    inputType: "essay",
    contentType: "conceptual",
    generator: genPopis,
    helpTemplate: HELP_POPIS,
  },
];
