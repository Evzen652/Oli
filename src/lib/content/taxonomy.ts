/**
 * CONTENT TAXONOMY — centralizované definice pro typologii obsahu Oli.
 *
 * Definuje:
 *   • ContentType — jak se generují/validují úlohy pro daný skill
 *   • QualityTier — úroveň ověření cvičení (kdy smí žák vidět)
 *   • AcademicSubject — akademické předměty ZŠ, které Oli podporuje
 *   • FactType — typ faktu v curriculum_facts KB
 *
 * Tento modul je zdrojem pravdy pro databázové enum hodnoty — musí být v souladu
 * s supabase/migrations/20260417120000_content_infrastructure.sql.
 */

// ══════════════════════════════════════════════════════════════════════════
// Content type — jak se obsah pro dovednost generuje a validuje
// ══════════════════════════════════════════════════════════════════════════
export const ContentType = {
  /** Pure funkce generuje úlohy, matematická/jazyková správnost konstrukcí. */
  ALGORITHMIC: "algorithmic",
  /** Úlohy se skládají z validovaných faktů v curriculum_facts KB. */
  FACTUAL: "factual",
  /** AI generuje úlohy, prochází 3-vrstvou validací + humanní review. */
  CONCEPTUAL: "conceptual",
  /** Kombinace — např. fyzika: výpočet (algo) nad faktem (F = m·a). */
  MIXED: "mixed",
} as const;

export type ContentTypeValue = typeof ContentType[keyof typeof ContentType];

export const CONTENT_TYPE_LABELS: Record<ContentTypeValue, string> = {
  algorithmic: "Algoritmický (deterministický)",
  factual: "Faktický (z knowledge base)",
  conceptual: "Konceptuální (AI + review)",
  mixed: "Smíšený",
};

export const CONTENT_TYPE_DESCRIPTIONS: Record<ContentTypeValue, string> = {
  algorithmic:
    "Úlohy generuje pure funkce v kódu. Matematická správnost zaručena konstrukcí a unit testy. Žádná AI, žádné halucinace.",
  factual:
    "Úlohy vznikají nad validovanou Knowledge Base. AI parafrázuje otázku, ale nikdy negeneruje fakta z paměti. Každý fakt má zdroj.",
  conceptual:
    "AI generuje úlohy pro témata bez deterministických pravidel (interpretace, občanka). Povinně 3-vrstvá validace + humanní review.",
  mixed:
    "Kombinuje algoritmický výpočet s faktickým kontextem (typicky fyzika, chemie).",
};

// ══════════════════════════════════════════════════════════════════════════
// Quality tier — kdy smí žák vidět cvičení
// ══════════════════════════════════════════════════════════════════════════
export const QualityTier = {
  /** 🟢 Humanně validované — kurátor schválil. */
  VALIDATED: "validated",
  /** 🟡 AI-validované — prošlo 3 vrstvami (format + grade + correctness). */
  AI_VALIDATED: "ai_validated",
  /** 🔴 Raw AI výstup — nezobrazovat žákovi. */
  AI_RAW: "ai_raw",
  /** ⚠️ Flag pro humanní review (chyby žáků apod.). */
  NEEDS_REVIEW: "needs_review",
} as const;

export type QualityTierValue = typeof QualityTier[keyof typeof QualityTier];

export const QUALITY_TIER_LABELS: Record<QualityTierValue, string> = {
  validated: "🟢 Ověřeno",
  ai_validated: "🟡 AI-validované",
  ai_raw: "🔴 AI raw",
  needs_review: "⚠️ K revizi",
};

/** Úrovně, které smí žák vidět. Ostatní zůstávají v admin frontě. */
export const VISIBLE_TO_STUDENT: readonly QualityTierValue[] = [
  QualityTier.VALIDATED,
  QualityTier.AI_VALIDATED,
];

export function isVisibleToStudent(tier: QualityTierValue): boolean {
  return VISIBLE_TO_STUDENT.includes(tier);
}

// ══════════════════════════════════════════════════════════════════════════
// Akademické předměty ZŠ (jen ty, které Oli cíleně podporuje)
// ══════════════════════════════════════════════════════════════════════════
export const AcademicSubject = {
  MATEMATIKA: "matematika",
  CESTINA: "cestina",
  PRVOUKA: "prvouka",       // 1.-5.
  PRIRODOPIS: "prirodopis", // 6.-9.
  DEJEPIS: "dejepis",       // 6.-9.
  ZEMEPIS: "zemepis",       // 6.-9.
  FYZIKA: "fyzika",         // 6.-9.
  CHEMIE: "chemie",         // 8.-9.
  OBCANSKA_VYCHOVA: "obcanska-vychova", // 6.-9.
} as const;

export type AcademicSubjectValue = typeof AcademicSubject[keyof typeof AcademicSubject];

/** Metadata o předmětu — typ obsahu, ročníky, ikona. */
export interface SubjectMeta {
  slug: AcademicSubjectValue;
  label: string;
  emoji: string;
  defaultContentType: ContentTypeValue;
  gradeRange: readonly [number, number];
  description: string;
}

export const SUBJECT_METADATA: Record<AcademicSubjectValue, SubjectMeta> = {
  matematika: {
    slug: "matematika",
    label: "Matematika",
    emoji: "🧮",
    defaultContentType: ContentType.ALGORITHMIC,
    gradeRange: [1, 9],
    description: "Čísla a operace, zlomky, procenta, geometrie, algebra, funkce.",
  },
  cestina: {
    slug: "cestina",
    label: "Český jazyk a literatura",
    emoji: "✏️",
    defaultContentType: ContentType.MIXED,
    gradeRange: [1, 9],
    description: "Pravopis, mluvnice, sloh, literatura.",
  },
  prvouka: {
    slug: "prvouka",
    label: "Prvouka",
    emoji: "🌱",
    defaultContentType: ContentType.MIXED,
    gradeRange: [1, 5],
    description: "Tělo, příroda, rodina a společnost — pro I. stupeň ZŠ.",
  },
  prirodopis: {
    slug: "prirodopis",
    label: "Přírodopis",
    emoji: "🌿",
    defaultContentType: ContentType.FACTUAL,
    gradeRange: [6, 9],
    description: "Biologie — zoologie, botanika, člověk, ekologie, geologie.",
  },
  dejepis: {
    slug: "dejepis",
    label: "Dějepis",
    emoji: "📜",
    defaultContentType: ContentType.FACTUAL,
    gradeRange: [6, 9],
    description: "České a světové dějiny od pravěku po současnost.",
  },
  zemepis: {
    slug: "zemepis",
    label: "Zeměpis",
    emoji: "🌍",
    defaultContentType: ContentType.FACTUAL,
    gradeRange: [6, 9],
    description: "Planetární geografie, světadíly, ČR, regionální geografie.",
  },
  fyzika: {
    slug: "fyzika",
    label: "Fyzika",
    emoji: "🔬",
    defaultContentType: ContentType.MIXED,
    gradeRange: [6, 9],
    description: "Mechanika, termika, elektřina, magnetismus, vlnění, jaderná fyzika.",
  },
  chemie: {
    slug: "chemie",
    label: "Chemie",
    emoji: "⚗️",
    defaultContentType: ContentType.MIXED,
    gradeRange: [8, 9],
    description: "Prvky, sloučeniny, chemické reakce, anorganická a organická chemie.",
  },
  "obcanska-vychova": {
    slug: "obcanska-vychova",
    label: "Občanská výchova",
    emoji: "🏛️",
    defaultContentType: ContentType.CONCEPTUAL,
    gradeRange: [6, 9],
    description: "Stát, právo, demokracie, finanční gramotnost, osobní rozvoj.",
  },
};

export function getSubjectMeta(slug: string): SubjectMeta | undefined {
  return SUBJECT_METADATA[slug as AcademicSubjectValue];
}

// ══════════════════════════════════════════════════════════════════════════
// Fact type — typologie položek v curriculum_facts
// ══════════════════════════════════════════════════════════════════════════
export const FactType = {
  /** Historická událost s datem/rokem. */
  DATE: "date",
  /** Entita — osoba, místo, organizace, druh. */
  ENTITY: "entity",
  /** Definice pojmu (koncept). */
  CONCEPT: "concept",
  /** Vztah mezi entitami ("A je hl. město B"). */
  RELATION: "relation",
  /** Proces / sled kroků (biologie, chemie). */
  PROCESS: "process",
  /** Fyzikální/matematická formule s kontextem. */
  FORMULA: "formula",
} as const;

export type FactTypeValue = typeof FactType[keyof typeof FactType];

export const FACT_TYPE_LABELS: Record<FactTypeValue, string> = {
  date: "📅 Datum / událost",
  entity: "🏷️ Entita",
  concept: "💡 Pojem",
  relation: "🔗 Vztah",
  process: "🔄 Proces",
  formula: "∑ Formule",
};

// ══════════════════════════════════════════════════════════════════════════
// Governance helpers
// ══════════════════════════════════════════════════════════════════════════

/** Zda je content_type povinný ke knowledge base (vyžaduje facts). */
export function requiresKnowledgeBase(contentType: ContentTypeValue): boolean {
  return contentType === ContentType.FACTUAL || contentType === ContentType.MIXED;
}

/** Zda je pro daný content_type povinný lidský review před zobrazením žákovi. */
export function requiresHumanReview(contentType: ContentTypeValue): boolean {
  // Algoritmický obsah má deterministickou kvalitu → nevyžaduje.
  // Faktický & konceptuální mohou AI halucinovat → vyžadují.
  return contentType !== ContentType.ALGORITHMIC;
}
