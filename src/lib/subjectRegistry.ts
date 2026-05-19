import imgMatematika from "@/assets/subjects/subject-matematika.png";
import imgCestina from "@/assets/subjects/subject-cestina.png";
import imgPrvouka from "@/assets/subjects/subject-prvouka.png";
import imgPrirodoveda from "@/assets/subjects/subject-prirodoveda.png";
import imgVlastiveda from "@/assets/subjects/subject-vlastiveda.png";

export interface SubjectMeta {
  label: string;
  emoji: string;
  image: string;
  gradientClass: string;
  borderClass: string;
  hook?: string;
}

export const SUBJECTS: Record<string, SubjectMeta> = {
  matematika: {
    label: "Matematika",
    emoji: "🔢",
    image: imgMatematika,
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--math-numbers-bg))]",
    borderClass: "border-[hsl(var(--math-numbers))]/40",
    hook: "Matematika tě naučí počítat, porovnávat a řešit úlohy — v obchodě, ve hře i v životě!",
  },
  čeština: {
    label: "Čeština",
    emoji: "📝",
    image: imgCestina,
    gradientClass: "bg-gradient-to-r from-white to-[hsl(var(--cz-vyjm-bg))]",
    borderClass: "border-[hsl(var(--cz-vyjm))]/40",
    hook: "Čeština je klíč ke správnému psaní, čtení a porozumění — ve škole i na internetu!",
  },
  prvouka: {
    label: "Prvouka",
    emoji: "🌍",
    image: imgPrvouka,
    gradientClass: "bg-gradient-to-r from-white to-[hsl(142,64%,93%)]",
    borderClass: "border-[hsl(142,64%,42%)]/40",
    hook: "Prvouka ti ukáže, jak funguje příroda, lidské tělo i svět kolem tebe!",
  },
  přírodověda: {
    label: "Přírodověda",
    emoji: "🌿",
    image: imgPrirodoveda,
    gradientClass: "bg-gradient-to-r from-white to-[hsl(152,60%,92%)]",
    borderClass: "border-[hsl(152,60%,42%)]/40",
    hook: "Přírodověda ti ukáže, jak fungují ekosystémy, koloběh vody i svět hornin!",
  },
  vlastivěda: {
    label: "Vlastivěda",
    emoji: "🗺️",
    image: imgVlastiveda,
    gradientClass: "bg-gradient-to-r from-white to-[hsl(38,70%,92%)]",
    borderClass: "border-[hsl(38,70%,45%)]/40",
    hook: "Vlastivěda tě provede kraji Česka, jeho historií a státními symboly!",
  },
};

const FALLBACK_EMOJIS = ["📚", "🧪", "🎨", "🌐", "🔬", "🎵", "🏛️", "💡"];

// Supabase storage URL pro dynamické ilustrace předmětů
const SUPABASE_STORAGE = "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images";

/** Deterministic hash of a string to a number. */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Generate a deterministic HSL hue from a subject name. */
function subjectHue(subject: string): number {
  return hashString(subject) % 360;
}

/**
 * Build a dynamic fallback SubjectMeta from the subject name.
 * Zkouší načíst ilustraci ze Supabase storage (subject-{slug}.png).
 * Pokud neexistuje, IllustrationImg automaticky zobrazí emoji fallback.
 */
function buildFallback(subject: string): SubjectMeta {
  const hue = subjectHue(subject);
  const emoji = FALLBACK_EMOJIS[hashString(subject) % FALLBACK_EMOJIS.length];
  const slug = subject.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // diakritika
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return {
    label: subject.charAt(0).toUpperCase() + subject.slice(1),
    emoji,
    image: `${SUPABASE_STORAGE}/subject-${slug}.png`,
    gradientClass: `bg-gradient-to-r from-white to-[hsl(${hue},60%,92%)]`,
    borderClass: `border-[hsl(${hue},60%,50%)]/40`,
  };
}

/** Get subject-level metadata by subject key (e.g. "matematika"). */
export function getSubjectMeta(subject: string): SubjectMeta {
  return SUBJECTS[subject] ?? buildFallback(subject);
}
