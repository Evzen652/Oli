export interface SubjectMeta {
  label: string;
  emoji: string;
  image: string;
  color: string;
  gradientClass: string;
  borderClass: string;
  hook?: string;
}

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
    label: "Matematika",
    emoji: "🔢",
    image: `${SUPABASE_STORAGE}/subject-matematika.png`,
    color: "text-blue-600",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--math-numbers-bg))]",
    borderClass: "border-[hsl(var(--math-numbers))]/40",
    hook: "Matematika tě naučí počítat, porovnávat a řešit úlohy — v obchodě, ve hře i v životě!",
  },
  čeština: {
    label: "Čeština",
    emoji: "📝",
    image: `${SUPABASE_STORAGE}/subject-cestina.png`,
    color: "text-purple-600",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--cz-vyjm-bg))]",
    borderClass: "border-[hsl(var(--cz-vyjm))]/40",
    hook: "Čeština je klíč ke správnému psaní, čtení a porozumění — ve škole i na internetu!",
  },
  prvouka: {
    label: "Prvouka",
    emoji: "🌍",
    image: `${SUPABASE_STORAGE}/subject-prvouka.png`,
    color: "text-green-600",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(142,64%,93%)]",
    borderClass: "border-[hsl(142,64%,42%)]/40",
    hook: "Prvouka ti ukáže, jak funguje příroda, lidské tělo i svět kolem tebe!",
  },
  přírodověda: {
    label: "Přírodověda",
    emoji: "🌿",
    image: `${SUPABASE_STORAGE}/subject-prirodoveda.png`,
    color: "text-emerald-600",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(152,60%,92%)]",
    borderClass: "border-[hsl(152,60%,42%)]/40",
    hook: "Přírodověda ti ukáže, jak fungují ekosystémy, koloběh vody i svět hornin!",
  },
  vlastivěda: {
    label: "Vlastivěda",
    emoji: "🗺️",
    image: `${SUPABASE_STORAGE}/subject-vlastiveda.png`,
    color: "text-amber-600",
    gradientClass: "bg-gradient-to-r from-white to-[hsl(38,70%,92%)]",
    borderClass: "border-[hsl(38,70%,45%)]/40",
    hook: "Vlastivěda tě provede kraji Česka, jeho historií a státními symboly!",
  },

  // ── 2. stupeň (6.–9.) ──
  dějepis: {
    label: "Dějepis",
    emoji: "🏛️",
    image: `${SUPABASE_STORAGE}/subject-dejepis.png`,
    color: "text-amber-700",
    gradientClass: "bg-gradient-to-r from-white to-amber-50",
    borderClass: "border-amber-300/50",
    hook: "Dějepis tě provede minulostí — od pravěku po moderní dějiny.",
  },
  fyzika: {
    label: "Fyzika",
    emoji: "⚛️",
    image: `${SUPABASE_STORAGE}/subject-fyzika.png`,
    color: "text-indigo-600",
    gradientClass: "bg-gradient-to-r from-white to-indigo-50",
    borderClass: "border-indigo-300/50",
    hook: "Fyzika vysvětluje, jak funguje svět — od pohybu po elektřinu.",
  },
  chemie: {
    label: "Chemie",
    emoji: "🧪",
    image: `${SUPABASE_STORAGE}/subject-chemie.png`,
    color: "text-teal-600",
    gradientClass: "bg-gradient-to-r from-white to-teal-50",
    borderClass: "border-teal-300/50",
    hook: "Chemie odhaluje, z čeho jsou věci kolem nás a jak spolu reagují.",
  },
  přírodopis: {
    label: "Přírodopis",
    emoji: "🌱",
    image: `${SUPABASE_STORAGE}/subject-prirodopis.png`,
    color: "text-green-600",
    gradientClass: "bg-gradient-to-r from-white to-green-50",
    borderClass: "border-green-300/50",
    hook: "Přírodopis tě zavede do světa rostlin, zvířat i lidského těla.",
  },
  zeměpis: {
    label: "Zeměpis",
    emoji: "🌍",
    image: `${SUPABASE_STORAGE}/subject-zemepis.png`,
    color: "text-cyan-600",
    gradientClass: "bg-gradient-to-r from-white to-cyan-50",
    borderClass: "border-cyan-300/50",
    hook: "Zeměpis ti ukáže Zemi — krajiny, státy i přírodní jevy.",
  },
  "výchova k občanství": {
    label: "Občanská výchova",
    emoji: "⚖️",
    image: `${SUPABASE_STORAGE}/subject-vychova-k-obcanstvi.png`,
    color: "text-rose-600",
    gradientClass: "bg-gradient-to-r from-white to-rose-50",
    borderClass: "border-rose-300/50",
    hook: "Občanská výchova tě připraví na život ve společnosti.",
  },
};

const FALLBACK_EMOJIS = ["📚", "🧪", "🎨", "🌐", "🔬", "🎵", "🏛️", "💡"];

// Předem definované gradienty + bordera — statické třídy, Tailwind je vidí
const FALLBACK_PALETTES = [
  { gradientClass: "bg-gradient-to-r from-white to-violet-50",  borderClass: "border-violet-200/60" },
  { gradientClass: "bg-gradient-to-r from-white to-blue-50",    borderClass: "border-blue-200/60" },
  { gradientClass: "bg-gradient-to-r from-white to-emerald-50", borderClass: "border-emerald-200/60" },
  { gradientClass: "bg-gradient-to-r from-white to-amber-50",   borderClass: "border-amber-200/60" },
  { gradientClass: "bg-gradient-to-r from-white to-rose-50",    borderClass: "border-rose-200/60" },
  { gradientClass: "bg-gradient-to-r from-white to-cyan-50",    borderClass: "border-cyan-200/60" },
  { gradientClass: "bg-gradient-to-r from-white to-orange-50",  borderClass: "border-orange-200/60" },
  { gradientClass: "bg-gradient-to-r from-white to-teal-50",    borderClass: "border-teal-200/60" },
  { gradientClass: "bg-gradient-to-r from-white to-pink-50",    borderClass: "border-pink-200/60" },
  { gradientClass: "bg-gradient-to-r from-white to-lime-50",    borderClass: "border-lime-200/60" },
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
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // diakritika
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return {
    label: subject.charAt(0).toUpperCase() + subject.slice(1),
    emoji,
    image: `${SUPABASE_STORAGE}/subject-${slug}.png`,
    color: "text-slate-600",
    gradientClass: palette.gradientClass,
    borderClass: palette.borderClass,
  };
}

/** Get subject-level metadata by subject key (e.g. "matematika"). */
export function getSubjectMeta(subject: unknown): SubjectMeta {
  // Guard proti non-string input (např. undefined z DB nebo session)
  const key = typeof subject === "string" && subject.length > 0 ? subject : "neznámý";
  return SUBJECTS[key] ?? buildFallback(key);
}
