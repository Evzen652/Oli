/**
 * Předmětový rejstřík — JEDINÁ mapa předmětů v aplikaci.
 *
 * Před sjednocením (design audit 2026-08-25) běželo paralelně **šest**
 * nezávislých map: `getSubjectColor` v `SessionView`, `SUBJECT_CARD_STYLES`
 * v `TopicBrowser`, `SUBJECT_META` v `SelfPracticeList`, `SUBJECT_DOT`
 * v admin sidebaru, `SUBJECT_COLORS` v RVP stromu a tenhle rejstřík.
 * Matematika se kvůli tomu vykreslovala ve třech různých odstínech modré
 * podle toho, na které obrazovce dítě zrovna bylo.
 *
 * Pravidlo pro barvu předmětu (viz `docs/DESIGN_SYSTEM.md`):
 * předmět se pozná podle **dlaždice ikony, 3px linky nebo chipu** —
 * NIKDY podle pozadí celé karty. Karta je vždy bílá, barvu nesou ilustrace.
 */

export interface SubjectPalette {
  /** Ink — text, ikona, číslo. Kontrast ≥4,5:1 na bílé i na vlastním tintu. */
  color: string;
  /** Tint — dlaždice ikony, chip, jemný podklad. Ne pozadí celé karty. */
  tintClass: string;
  /** Okraj karty / předmětová linka. */
  borderClass: string;
  /** Plná plocha — 3px proužek nad hlavičkou, tečka v průběhu sezení. */
  accentClass: string;
  /** Prstenec kolem aktivní tečky v ukazateli průběhu. */
  ringClass: string;
  /** Předmětová linka na levé hraně karty (barví JEN levý okraj). */
  edgeClass: string;
}

export interface SubjectMeta extends SubjectPalette {
  label: string;
  emoji: string;
  image: string;
  hook?: string;
}

/**
 * Schválená předmětová paleta. Hodnoty jsou statické literály, aby je
 * Tailwind našel při skenování (arbitrary values se negenerují dynamicky).
 *
 * Změřené kontrasty ink na bílé / ink na vlastním tintu:
 *   modrá   6,65 / 5,64   růžová  7,05 / 5,99   teal   5,50 / 4,75
 *   olivová 7,05 / 6,21   hnědá   7,13 / 6,0+   fialová 7,01 / 6,0+
 *   grafit 10,3 / 9,0+   zlatohnědá 6,85   zelená 7,11   petrolejová 7,28
 */
const PALETTE = {
  modra: {
    color: "text-[#1D4ED8]",
    tintClass: "bg-[#E3EDFD]",
    borderClass: "border-[#1D4ED8]/30",
    accentClass: "bg-[#1D4ED8]",
    ringClass: "ring-[#1D4ED8]/40",
    edgeClass: "border-l-[#1D4ED8]",
  },
  ruzova: {
    color: "text-[#A81E52]",
    tintClass: "bg-[#FDE7EF]",
    borderClass: "border-[#A81E52]/30",
    accentClass: "bg-[#A81E52]",
    ringClass: "ring-[#A81E52]/40",
    edgeClass: "border-l-[#A81E52]",
  },
  teal: {
    color: "text-[#0F766E]",
    tintClass: "bg-[#E0F2F0]",
    borderClass: "border-[#0F766E]/30",
    accentClass: "bg-[#0F766E]",
    ringClass: "ring-[#0F766E]/40",
    edgeClass: "border-l-[#0F766E]",
  },
  olivova: {
    color: "text-[#3F6212]",
    tintClass: "bg-[#EDF3E1]",
    borderClass: "border-[#3F6212]/30",
    accentClass: "bg-[#3F6212]",
    ringClass: "ring-[#3F6212]/40",
    edgeClass: "border-l-[#3F6212]",
  },
  hneda: {
    color: "text-[#92400E]",
    tintClass: "bg-[#FAEEE2]",
    borderClass: "border-[#92400E]/30",
    accentClass: "bg-[#92400E]",
    ringClass: "ring-[#92400E]/40",
    edgeClass: "border-l-[#92400E]",
  },
  fialova: {
    color: "text-[#7E22CE]",
    tintClass: "bg-[#F5E9FD]",
    borderClass: "border-[#7E22CE]/30",
    accentClass: "bg-[#7E22CE]",
    ringClass: "ring-[#7E22CE]/40",
    edgeClass: "border-l-[#7E22CE]",
  },
  /** Informatika — technický obor dostal záměrně neutrální grafit. */
  grafit: {
    color: "text-[#44403C]",
    tintClass: "bg-[#F0EEEA]",
    borderClass: "border-[#44403C]/30",
    accentClass: "bg-[#44403C]",
    ringClass: "ring-[#44403C]/40",
    edgeClass: "border-l-[#44403C]",
  },
  tmavemodra: {
    color: "text-[#1E3A8A]",
    tintClass: "bg-[#E4E9F7]",
    borderClass: "border-[#1E3A8A]/30",
    accentClass: "bg-[#1E3A8A]",
    ringClass: "ring-[#1E3A8A]/40",
    edgeClass: "border-l-[#1E3A8A]",
  },
  azurova: {
    color: "text-[#0E7490]",
    tintClass: "bg-[#E0F2F7]",
    borderClass: "border-[#0E7490]/30",
    accentClass: "bg-[#0E7490]",
    ringClass: "ring-[#0E7490]/40",
    edgeClass: "border-l-[#0E7490]",
  },
  vinova: {
    color: "text-[#9F1239]",
    tintClass: "bg-[#FCE7EC]",
    borderClass: "border-[#9F1239]/30",
    accentClass: "bg-[#9F1239]",
    ringClass: "ring-[#9F1239]/40",
    edgeClass: "border-l-[#9F1239]",
  },
  /**
   * Předměty 2. stupně dostávají vlastní odstíny, aby se v admin seznamu
   * (kde jsou VŠECHNY předměty vedle sebe) nekryly s 1. stupněm — dějepis
   * jinak vycházel na stejný hex jako vlastivěda.
   */
  zlatohneda: {
    color: "text-[#854D0E]",
    tintClass: "bg-[#F7EFE1]",
    borderClass: "border-[#854D0E]/30",
    accentClass: "bg-[#854D0E]",
    ringClass: "ring-[#854D0E]/40",
    edgeClass: "border-l-[#854D0E]",
  },
  zelena: {
    color: "text-[#166534]",
    tintClass: "bg-[#E4F0E7]",
    borderClass: "border-[#166534]/30",
    accentClass: "bg-[#166534]",
    ringClass: "ring-[#166534]/40",
    edgeClass: "border-l-[#166534]",
  },
  petrolejova: {
    color: "text-[#155E75]",
    tintClass: "bg-[#E2EFF4]",
    borderClass: "border-[#155E75]/30",
    accentClass: "bg-[#155E75]",
    ringClass: "ring-[#155E75]/40",
    edgeClass: "border-l-[#155E75]",
  },
} as const satisfies Record<string, SubjectPalette>;

/** Neutrální paleta pro neznámý předmět — tokeny, ne náhodná barva. */
export const NEUTRAL_PALETTE: SubjectPalette = {
  color: "text-muted-foreground",
  tintClass: "bg-muted",
  borderClass: "border-border",
  accentClass: "bg-primary",
  ringClass: "ring-primary/40",
  edgeClass: "border-l-border",
};

// Supabase storage URL pro dynamické ilustrace předmětů (subject-{slug}.png)
const SUPABASE_STORAGE = "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images";

// Klíč v SUBJECTS MUSÍ přesně odpovídat poli `subject` v TopicMetadata
// (malé písmeno, s diakritikou). VŠECHNY předměty čtou ilustraci ze Supabase
// storage (subject-{slug}.png) — STEJNÝ zdroj, kam je generuje admin panel
// (AdminGenerateIllustrations), takže žákovský pohled vždy ukáže aktuální
// admin ilustraci a regenerace se propíšou samy. Dokud soubor neexistuje,
// IllustrationImg zobrazí emoji fallback.
export const SUBJECTS: Record<string, SubjectMeta> = {
  matematika: {
    ...PALETTE.modra,
    label: "Matematika",
    emoji: "🔢",
    image: `${SUPABASE_STORAGE}/subject-matematika.png`,
    hook: "Matematika tě naučí počítat, porovnávat a řešit úlohy — v obchodě, ve hře i v životě!",
  },
  čeština: {
    ...PALETTE.ruzova,
    label: "Čeština",
    emoji: "📝",
    image: `${SUPABASE_STORAGE}/subject-cestina.png`,
    hook: "Čeština je klíč ke správnému psaní, čtení a porozumění — ve škole i na internetu!",
  },
  prvouka: {
    ...PALETTE.teal,
    label: "Prvouka",
    emoji: "🌍",
    image: `${SUPABASE_STORAGE}/subject-prvouka.png`,
    hook: "Prvouka ti ukáže, jak funguje příroda, lidské tělo i svět kolem tebe!",
  },
  přírodověda: {
    ...PALETTE.olivova,
    label: "Přírodověda",
    emoji: "🌿",
    image: `${SUPABASE_STORAGE}/subject-prirodoveda.png`,
    hook: "Přírodověda ti ukáže, jak fungují ekosystémy, koloběh vody i svět hornin!",
  },
  vlastivěda: {
    ...PALETTE.hneda,
    label: "Vlastivěda",
    emoji: "🗺️",
    image: `${SUPABASE_STORAGE}/subject-vlastiveda.png`,
    hook: "Vlastivěda tě provede kraji Česka, jeho historií a státními symboly!",
  },
  angličtina: {
    ...PALETTE.fialova,
    label: "Angličtina",
    emoji: "🇬🇧",
    image: `${SUPABASE_STORAGE}/subject-anglictina.png`,
    hook: "Angličtina ti otevře filmy, hry i kamarády po celém světě!",
  },
  informatika: {
    ...PALETTE.grafit,
    label: "Informatika",
    emoji: "💻",
    image: `${SUPABASE_STORAGE}/subject-informatika.png`,
    hook: "Informatika tě naučí, jak myslí počítač — a jak ho přimět dělat, co chceš.",
  },

  // ── 2. stupeň (6.–9.) ──
  dějepis: {
    ...PALETTE.zlatohneda,
    label: "Dějepis",
    emoji: "🏛️",
    image: `${SUPABASE_STORAGE}/subject-dejepis.png`,
    hook: "Dějepis tě provede minulostí — od pravěku po moderní dějiny.",
  },
  fyzika: {
    ...PALETTE.tmavemodra,
    label: "Fyzika",
    emoji: "⚛️",
    image: `${SUPABASE_STORAGE}/subject-fyzika.png`,
    hook: "Fyzika vysvětluje, jak funguje svět — od pohybu po elektřinu.",
  },
  chemie: {
    ...PALETTE.azurova,
    label: "Chemie",
    emoji: "🧪",
    image: `${SUPABASE_STORAGE}/subject-chemie.png`,
    hook: "Chemie odhaluje, z čeho jsou věci kolem nás a jak spolu reagují.",
  },
  přírodopis: {
    ...PALETTE.zelena,
    label: "Přírodopis",
    emoji: "🌱",
    image: `${SUPABASE_STORAGE}/subject-prirodopis.png`,
    hook: "Přírodopis tě zavede do světa rostlin, zvířat i lidského těla.",
  },
  zeměpis: {
    ...PALETTE.petrolejova,
    label: "Zeměpis",
    emoji: "🌍",
    image: `${SUPABASE_STORAGE}/subject-zemepis.png`,
    hook: "Zeměpis ti ukáže Zemi — krajiny, státy i přírodní jevy.",
  },
  "výchova k občanství": {
    ...PALETTE.vinova,
    label: "Občanská výchova",
    emoji: "⚖️",
    image: `${SUPABASE_STORAGE}/subject-vychova-k-obcanstvi.png`,
    hook: "Občanská výchova tě připraví na život ve společnosti.",
  },
};

/**
 * Aliasy — admin, RVP dataset a starší seed data píší předmět jinak než
 * `TopicMetadata.subject` (slug bez diakritiky, „cesky-jazyk", „biologie").
 * Bez překladu si každá obrazovka dělala vlastní mapu; tady se sjednotí.
 */
const SUBJECT_ALIASES: Record<string, keyof typeof SUBJECTS | string> = {
  math: "matematika",
  cestina: "čeština",
  cesky: "čeština",
  "cesky jazyk": "čeština",
  "cesky-jazyk": "čeština",
  "český jazyk": "čeština",
  cjl: "čeština",
  "cesky jazyk a literatura": "čeština",
  "český jazyk a literatura": "čeština",
  prirodoveda: "přírodověda",
  vlastiveda: "vlastivěda",
  anglictina: "angličtina",
  "anglicky jazyk": "angličtina",
  "anglický jazyk": "angličtina",
  dejepis: "dějepis",
  zemepis: "zeměpis",
  prirodopis: "přírodopis",
  biologie: "přírodopis",
  vko: "výchova k občanství",
  obcanska: "výchova k občanství",
  "obcanska vychova": "výchova k občanství",
  "občanská výchova": "výchova k občanství",
  "vychova k obcanstvi": "výchova k občanství",
};

/** Odstraní diakritiku a sjednotí oddělovače — pro dohledání aliasu. */
function deaccent(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[_-]+/g, " ").trim();
}

/**
 * Přeloží libovolný zápis předmětu na kanonický klíč v `SUBJECTS`,
 * nebo vrátí `null`, když předmět v rejstříku není.
 */
export function resolveSubjectKey(subject: unknown): string | null {
  if (typeof subject !== "string" || subject.length === 0) return null;
  const lower = subject.toLowerCase().trim();
  if (SUBJECTS[lower]) return lower;
  const plain = deaccent(lower);
  if (SUBJECTS[plain]) return plain;
  const alias = SUBJECT_ALIASES[lower] ?? SUBJECT_ALIASES[plain];
  return alias && SUBJECTS[alias] ? alias : null;
}

const FALLBACK_EMOJIS = ["📚", "🧪", "🎨", "🌐", "🔬", "🎵", "🏛️", "💡"];

/**
 * Fallback vybírá ze **schválené** palety, ne z náhodné Tailwind rampy.
 * Dřív tu bylo deset pestrých gradientů (`to-pink-50`, `to-lime-50`, …),
 * takže neznámý předmět dostal barvu mimo design systém.
 */
const FALLBACK_PALETTES: SubjectPalette[] = [
  PALETTE.modra,
  PALETTE.ruzova,
  PALETTE.teal,
  PALETTE.olivova,
  PALETTE.hneda,
  PALETTE.fialova,
  PALETTE.grafit,
  PALETTE.tmavemodra,
  PALETTE.azurova,
  PALETTE.vinova,
  PALETTE.zlatohneda,
  PALETTE.zelena,
  PALETTE.petrolejova,
];

/** Deterministic hash of a string to a number. */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Build a dynamic fallback SubjectMeta from the subject name.
 * Zkouší načíst ilustraci ze Supabase storage (subject-{slug}.png).
 * Pokud neexistuje, IllustrationImg automaticky zobrazí emoji fallback.
 */
function buildFallback(subject: string): SubjectMeta {
  const hash = hashString(subject);
  const emoji = FALLBACK_EMOJIS[hash % FALLBACK_EMOJIS.length];
  const palette = FALLBACK_PALETTES[hash % FALLBACK_PALETTES.length];
  const slug = subject.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // diakritika
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return {
    ...palette,
    label: subject.charAt(0).toUpperCase() + subject.slice(1),
    emoji,
    image: `${SUPABASE_STORAGE}/subject-${slug}.png`,
  };
}

/** Get subject-level metadata by subject key (e.g. "matematika"). */
export function getSubjectMeta(subject: unknown): SubjectMeta {
  // Guard proti non-string input (např. undefined z DB nebo session)
  const raw = typeof subject === "string" && subject.length > 0 ? subject : "neznámý";
  const key = resolveSubjectKey(raw);
  return key ? SUBJECTS[key] : buildFallback(raw);
}

/**
 * Jen barevná část rejstříku — pro místa, která nepotřebují ilustraci
 * ani hook (progres tečky, admin tečky u předmětu, chipy).
 * Neznámý předmět dostane neutrální paletu, ne náhodnou barvu.
 */
export function getSubjectPalette(subject: unknown): SubjectPalette {
  const key = resolveSubjectKey(subject);
  const known = key ? SUBJECTS[key] : undefined;
  if (!known) return NEUTRAL_PALETTE;
  return {
    color: known.color,
    tintClass: known.tintClass,
    borderClass: known.borderClass,
    accentClass: known.accentClass,
    ringClass: known.ringClass,
    edgeClass: known.edgeClass,
  };
}
