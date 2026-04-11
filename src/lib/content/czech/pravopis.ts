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

// ── PÁROVÉ SOUHLÁSKY ────────────────────────────────────────

const PAROVE_SOUHLASKY_WORDS = [
  { word: "le_", context: "v zimě na rybníce", options: ["d", "t"], answer: "d", hint: "ledy" },
  { word: "obra_", context: "visí na stěně", options: ["z", "s"], answer: "z", hint: "obrazy" },
  { word: "mra_", context: "v zimě venku", options: ["z", "s"], answer: "z", hint: "mrazy" },
  { word: "zu_", context: "bolí, jdu k zubaři", options: ["b", "p"], answer: "b", hint: "zuby" },
  { word: "chle_", context: "čerstvý z pekárny", options: ["b", "p"], answer: "b", hint: "chleby" },
  { word: "rybí_", context: "červené ovoce na keři", options: ["z", "s"], answer: "z", hint: "rybízy" },
  { word: "nů_", context: "krájíme jím", options: ["ž", "š"], answer: "ž", hint: "nože" },
  { word: "lo_ka", context: "pluje po rybníce", options: ["ď", "ť"], answer: "ď", hint: "lodě" },
  { word: "kou_", context: "v rohu místnosti", options: ["d", "t"], answer: "t", hint: "kouty" },
  { word: "hla_", context: "chce se mi jíst", options: ["d", "t"], answer: "d", hint: "hladový" },
  { word: "du_", context: "strom s žaludy", options: ["b", "p"], answer: "b", hint: "duby" },
  { word: "holu_", context: "bílý pták na střeše", options: ["b", "p"], answer: "b", hint: "holubi" },
  { word: "ha_", context: "plaz v trávě", options: ["d", "t"], answer: "d", hint: "hadi" },
  { word: "obě_", context: "jíme ho ve škole", options: ["d", "t"], answer: "d", hint: "obědy" },
  { word: "me_", context: "sladký od včel", options: ["d", "t"], answer: "d", hint: "medový" },
  { word: "vý_ka", context: "jak je vysoko", options: ["š", "ž"], answer: "š", hint: "výšky" },
  { word: "su_", context: "dřevěný ve sklepě", options: ["d", "t"], answer: "d", hint: "sudy" },
  { word: "pou_", context: "slavnost s kolotoči", options: ["ď", "ť"], answer: "ť", hint: "pouti" },
  { word: "pohá_ka", context: "čteme ji před spaním", options: ["d", "t"], answer: "d", hint: "pohádky" },
  { word: "hří_ek", context: "jedlý, roste v lese", options: ["b", "p"], answer: "b", hint: "hříbky" },
];

function genParoveSouhlasky(_level: number): PracticeTask[] {
  return shuffleArray(PAROVE_SOUHLASKY_WORDS).slice(0, PAROVE_SOUHLASKY_WORDS.length).map((w) => ({
    question: `Doplň: ${w.word}\n(${w.context})`,
    correctAnswer: w.answer,
    options: w.options,
    solutionSteps: [
      `Zkus si říct jiný tvar slova, kde tu souhlásku lépe slyšíš.`,
      `Pomocné slovo: „${w.hint}".`,
      `Správná odpověď je „${w.answer}".`,
    ],
    hints: [`Zkus si říct slovo „${w.word.replace(/_/, '…')}" v jiném tvaru — kde tu souhlásku lépe uslyšíš?`, `Zkus třeba: „${w.hint}" — slyšíš tam ${w.options[0]} nebo ${w.options[1]}?`],
  }));
}

// ── TVRDÉ A MĚKKÉ SOUHLÁSKY ─────────────────────────────────

const SOUHLASKY_TYPY: Record<string, string> = {
  h: "tvrdá", ch: "tvrdá", k: "tvrdá", r: "tvrdá", d: "tvrdá", t: "tvrdá", n: "tvrdá",
  ž: "měkká", š: "měkká", č: "měkká", ř: "měkká", c: "měkká", j: "měkká", ď: "měkká", ť: "měkká", ň: "měkká",
  b: "obojetná", f: "obojetná", l: "obojetná", m: "obojetná", p: "obojetná", s: "obojetná", v: "obojetná", z: "obojetná",
};

const TVRDE_MEKKE_SLOVA = [
  { word: "c_rkus", answer: "i", rule: 'Po měkké souhlásce "c" píšeme vždy "i".' },
  { word: "h_bát", answer: "ý", rule: 'Po tvrdé souhlásce "h" píšeme vždy "y".' },
  { word: "č_slo", answer: "í", rule: 'Po měkké souhlásce "č" píšeme vždy "i".' },
  { word: "k_snutí", answer: "y", rule: 'Po tvrdé souhlásce "k" píšeme vždy "y".' },
  { word: "ř_kat", answer: "í", rule: 'Po měkké souhlásce "ř" píšeme vždy "i".' },
  { word: "d_m", answer: "ý", rule: 'Po tvrdé souhlásce "d" píšeme vždy "y". Dým = kouř z komína.' },
  { word: "š_šky", answer: "i", rule: 'Po měkké souhlásce "š" píšeme vždy "i".' },
  { word: "r_ba", answer: "y", rule: 'Po tvrdé souhlásce "r" píšeme vždy "y".' },
  { word: "ž_dle", answer: "i", rule: 'Po měkké souhlásce "ž" píšeme vždy "i".' },
  { word: "ch_ba", answer: "y", rule: 'Po tvrdé souhlásce "ch" píšeme vždy "y".' },
  { word: "j_stý", answer: "i", rule: 'Po měkké souhlásce "j" píšeme vždy "i".' },
  { word: "t_gří", answer: "y", rule: 'Po tvrdé souhlásce "t" píšeme vždy "y".' },
  { word: "n_tě", answer: "i", rule: 'Po měkké souhlásce "ň" (ně → ňe) píšeme "i".' },
  { word: "k_tka", answer: "y", rule: 'Po tvrdé souhlásce "k" píšeme vždy "y".' },
  { word: "č_st", answer: "í", rule: 'Po měkké souhlásce "č" píšeme vždy "i".' },
  { word: "r_bník", answer: "y", rule: 'Po tvrdé souhlásce "r" píšeme vždy "y".' },
  { word: "š_pka", answer: "í", rule: 'Po měkké souhlásce "š" píšeme vždy "i".' },
  { word: "ř_dítko", answer: "í", rule: 'Po měkké souhlásce "ř" píšeme vždy "i".' },
  { word: "h_nout se", answer: "ý", rule: 'Po tvrdé souhlásce "h" píšeme vždy "y".' },
  { word: "ch_trý", answer: "y", rule: 'Po tvrdé souhlásce "ch" píšeme vždy "y".' },
];

function genTvrdeMekke(_level: number): PracticeTask[] {
  const items = shuffleArray(TVRDE_MEKKE_SLOVA).slice(0, TVRDE_MEKKE_SLOVA.length);
  const consonants = shuffleArray(Object.entries(SOUHLASKY_TYPY));

  const tasks: PracticeTask[] = [];

  for (const [cons, typ] of consonants) {
    tasks.push({
      question: `Jaká je souhláska „${cons}"?`,
      correctAnswer: typ,
      options: shuffleArray(["tvrdá", "měkká", "obojetná"]),
      solutionSteps: [
        `Tvrdé: h, ch, k, r, d, t, n.`,
        `Měkké: ž, š, č, ř, c, j, ď, ť, ň.`,
        `Obojetné: b, f, l, m, p, s, v, z.`,
        `„${cons}" je ${typ} souhláska.`,
      ],
      hints: [`Vzpomeň si na řadu tvrdých, měkkých a obojetných souhlásek — kam patří „${cons}"?`, `Tvrdé: h, ch, k, r, d, t, n. Měkké: ž, š, č, ř, c, j, ď, ť, ň. Obojetné: b, f, l, m, p, s, v, z.`],
    });
  }

  for (const item of items) {
    const normalizedAnswer = (item.answer === "y" || item.answer === "ý") ? "y/ý" : "i/í";
    tasks.push({
      question: `Doplň: ${item.word}`,
      correctAnswer: normalizedAnswer,
      options: ["y/ý", "i/í"],
      solutionSteps: [item.rule, `Správná odpověď: ${normalizedAnswer}.`],
      hints: [`Ve slově „${item.word}" — jaká je souhláska před vynechaným písmenem? Tvrdá, měkká, nebo obojetná?`, `Urči typ souhlásky a vzpomeň si: po tvrdé píšeme y, po měkké i. Podle toho se rozhodneš.`],
    });
  }

  return shuffleArray(tasks);
}

// ── PSANÍ VELKÝCH PÍSMEN ────────────────────────────────────

const VELKA_PISMENA_POOL = [
  { sentence: "Bydlím v _raze.", answer: "Praha", options: ["Praha", "praha"], rule: "Jméno města se píše s velkým písmenem." },
  { sentence: "Můj kamarád se jmenuje _etr.", answer: "Petr", options: ["Petr", "petr"], rule: "Vlastní jméno osoby se píše s velkým písmenem." },
  { sentence: "Řeka _ltava teče Prahou.", answer: "Vltava", options: ["Vltava", "vltava"], rule: "Jméno řeky se píše s velkým písmenem." },
  { sentence: "Jedeme na výlet na _umavu.", answer: "Šumavu", options: ["Šumavu", "šumavu"], rule: "Jméno pohoří se píše s velkým písmenem." },
  { sentence: "_es je plný hub.", answer: "les", options: ["Les", "les"], rule: "Obecné podstatné jméno (ne vlastní) se píše s malým písmenem." },
  { sentence: "Naše _očka má koťata.", answer: "kočka", options: ["Kočka", "kočka"], rule: "Obecné podstatné jméno se píše s malým písmenem." },
  { sentence: "_nes je hezky.", answer: "Dnes", options: ["Dnes", "dnes"], rule: "Slovo na začátku věty se píše s velkým písmenem." },
  { sentence: "Bydlíme v _rně.", answer: "Brně", options: ["Brně", "brně"], rule: "Jméno města se píše s velkým písmenem." },
  { sentence: "Moje sestra se jmenuje _va.", answer: "Eva", options: ["Eva", "eva"], rule: "Vlastní jméno osoby se píše s velkým písmenem." },
  { sentence: "Nejvyšší hora je _něžka.", answer: "Sněžka", options: ["Sněžka", "sněžka"], rule: "Vlastní jméno hory se píše s velkým písmenem." },
  { sentence: "Náš _es je milý.", answer: "pes", options: ["Pes", "pes"], rule: "Obecné podstatné jméno se píše s malým písmenem (uprostřed věty)." },
  { sentence: "_á ráda čokoládu.", answer: "Já", options: ["Já", "já"], rule: "Slovo na začátku věty se píše s velkým písmenem." },
  { sentence: "Jedeme k _abičce.", answer: "babičce", options: ["Babičce", "babičce"], rule: "Obecné podstatné jméno se píše s malým písmenem." },
  { sentence: "Letíme do _ondýna.", answer: "Londýna", options: ["Londýna", "londýna"], rule: "Jméno města se píše s velkým písmenem." },
  { sentence: "Náš _čitel je hodný.", answer: "učitel", options: ["Učitel", "učitel"], rule: "Obecné podstatné jméno se píše s malým písmenem." },
  { sentence: "Byli jsme na _oravě.", answer: "Moravě", options: ["Moravě", "moravě"], rule: "Vlastní zeměpisné jméno se píše s velkým písmenem." },
  { sentence: "Můj bratr se jmenuje _artin.", answer: "Martin", options: ["Martin", "martin"], rule: "Vlastní jméno osoby se píše s velkým písmenem." },
  { sentence: "_ůj dům je velký.", answer: "Můj", options: ["Můj", "můj"], rule: "Slovo na začátku věty se píše s velkým písmenem." },
  { sentence: "Jedeme do _stí nad Labem.", answer: "Ústí", options: ["Ústí", "ústí"], rule: "Jméno města se píše s velkým písmenem." },
  { sentence: "Na _ahradě rostou jahody.", answer: "zahradě", options: ["Zahradě", "zahradě"], rule: "Obecné podstatné jméno se píše s malým písmenem." },
];

function genVelkaPismena(_level: number): PracticeTask[] {
  return shuffleArray(VELKA_PISMENA_POOL).slice(0, VELKA_PISMENA_POOL.length).map((item) => ({
    question: `Doplň správně: ${item.sentence}`,
    correctAnswer: item.answer,
    options: shuffleArray([...item.options]),
    solutionSteps: [item.rule, `Správná odpověď: „${item.answer}".`],
    hints: [`Podívej se na slovo ve větě „${item.sentence}" — pojmenovává konkrétní osobu, město, řeku nebo horu?`, `Vlastní jména píšeme s velkým písmenem, obecná s malým. Je to slovo na začátku věty?`],
  }));
}

// ── HELP TEMPLATES ──────────────────────────────────────────

const HELP_PAROVE_SOUHLASKY: HelpData = {
  hint: "Když si nejsi jistý, jakou souhlásku napsat, zkus si říct jiný tvar slova — třeba množné číslo nebo zdrobnělinu.",
  steps: [
    "Řekni si slovo nahlas.",
    "Zkus jiný tvar: množné číslo, zdrobnělinu, nebo 2. pád.",
    "Ve změněném tvaru uslyšíš souhlásku lépe.",
    "Tu souhlásku napiš.",
  ],
  commonMistake: "Pozor — na konci slova zní párové souhlásky stejně! Třeba 'led' a 'let' zní podobně. Musíš si pomoct jiným tvarem: ledy → d, léta → t.",
  example: "le_ → ledy → slyšíš D, píšu D. zu_ → zuby → slyšíš B, píšu B.",
  visualExamples: [
    {
      label: "Jak poznat správnou souhlásku?",
      illustration: "le_ → změň tvar: ledy → slyšíš D ✅\n\nchle_ → změň tvar: chleba → slyšíš B ✅\n\nnů_ → změň tvar: nože → slyšíš Ž ✅\n\n💡 Tip: Řekni si slovo v jiném tvaru nahlas!",
    },
  ],
};

const HELP_TVRDE_MEKKE: HelpData = {
  hint: "Po tvrdých souhláskách piš vždy Y. Po měkkých souhláskách piš vždy I. Po obojetných — tam rozhodují vyjmenovaná slova!",
  steps: [
    "Zjisti, jaká je souhláska před y/i.",
    "Je tvrdá (h, ch, k, r, d, t, n)? → piš Y.",
    "Je měkká (ž, š, č, ř, c, j, ď, ť, ň)? → piš I.",
    "Je obojetná (b, f, l, m, p, s, v, z)? → záleží na vyjmenovaných slovech!",
  ],
  commonMistake: "Pozor — obojetné souhlásky se řídí jinými pravidly (vyjmenovaná slova). Tvrdé a měkké mají jasné pravidlo bez výjimek.",
  example: '"chyba" — ch je tvrdá → píšeme Y. "číst" — č je měkká → píšeme Í.',
  visualExamples: [
    {
      label: "Přehled souhlásek",
      illustration: "🟫 TVRDÉ → vždy Y:\n   h, ch, k, r, d, t, n\n\n🟦 MĚKKÉ → vždy I:\n   ž, š, č, ř, c, j, ď, ť, ň\n\n🟨 OBOJETNÉ → záleží na slově:\n   b, f, l, m, p, s, v, z",
    },
  ],
};

const HELP_VELKA_PISMENA: HelpData = {
  hint: "Velké písmeno píšeme na začátku věty a u vlastních jmen (jména osob, měst, řek, hor…). Obecná slova mají malé písmeno.",
  steps: [
    "Je slovo na začátku věty? → velké písmeno.",
    "Je to jméno osoby, města, řeky, hory nebo země? → velké písmeno.",
    "Je to obecné slovo (pes, dům, škola)? → malé písmeno.",
  ],
  commonMistake: 'Pozor — "Praha" je vždy s velkým P (jméno města), ale "město" je s malým m (obecné slovo).',
  example: '"Petr bydlí v Praze." — Petr = jméno (velké P), bydlí = obecné sloveso (malé b), Praze = jméno města (velké P).',
  visualExamples: [
    {
      label: "Kdy velké a kdy malé písmeno?",
      illustration: "✅ VELKÉ PÍSMENO:\n   Petr, Praha, Vltava, Sněžka, Česko\n   + začátek věty: Dnes je hezky.\n\n❌ MALÉ PÍSMENO:\n   pes, město, řeka, hora, škola",
    },
  ],
};

// ── TOPIC METADATA ──────────────────────────────────────────

export const PRAVOPIS_TOPICS: TopicMetadata[] = [
  {
    id: "cz-parove-souhlasky",
    title: "Párové souhlásky",
    subject: "čeština",
    category: "Pravopis",
    topic: "Párové souhlásky",
    briefDescription: "Procvičíš si, jakou souhlásku napsat na konci nebo uvnitř slova.",
    keywords: ["párové souhlásky", "souhlásky", "d t", "b p", "z s", "v f", "ž š"],
    goals: ["Naučíš se správně určit párovou souhlásku pomocí změny tvaru slova."],
    boundaries: ["Pouze párové souhlásky", "Žádná vyjmenovaná slova"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genParoveSouhlasky,
    helpTemplate: HELP_PAROVE_SOUHLASKY,
  },
  {
    id: "cz-tvrde-mekke",
    title: "Tvrdé a měkké souhlásky",
    subject: "čeština",
    category: "Pravopis",
    topic: "Tvrdé a měkké souhlásky",
    briefDescription: "Procvičíš si, které souhlásky jsou tvrdé, měkké a obojetné, a kdy psát y nebo i.",
    keywords: ["tvrdé souhlásky", "měkké souhlásky", "obojetné souhlásky", "tvrdé měkké", "y i po souhláskách"],
    goals: ["Naučíš se rozlišit tvrdé, měkké a obojetné souhlásky a správně psát y/i."],
    boundaries: ["Pouze tvrdé a měkké souhlásky", "Obojetné souhlásky jen jako rozpoznání typu"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genTvrdeMekke,
    helpTemplate: HELP_TVRDE_MEKKE,
  },
  {
    id: "cz-velka-pismena",
    title: "Psaní velkých písmen",
    subject: "čeština",
    category: "Pravopis",
    topic: "Psaní velkých písmen",
    briefDescription: "Procvičíš si, kdy psát velké písmeno — u jmen, měst a na začátku věty.",
    keywords: ["velká písmena", "velké písmeno", "malé písmeno", "vlastní jména", "začátek věty"],
    goals: ["Naučíš se správně rozhodnout, kdy psát velké a kdy malé písmeno."],
    boundaries: ["Pouze vlastní jména a začátky vět", "Žádné složité pravopisné jevy"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genVelkaPismena,
    helpTemplate: HELP_VELKA_PISMENA,
  },
];
