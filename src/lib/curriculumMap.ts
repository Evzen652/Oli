/**
 * Curriculum mapping layer — most mezi UX (rodič) a engine (skills).
 *
 * Rodič přemýšlí v termínech "3. třída → násobilka".
 * Engine pracuje s atomickými skills.
 *
 * Tato vrstva mapuje:
 *   EducationLevel (ZŠ, SŠ, učňák) → Track (gymnázium, obor, …)
 *     → Year (1.-9. ročník)
 *       → ParentTopic (rodičovsky srozumitelné téma)
 *         → SkillId[] (atomické dovednosti z content registry)
 *
 * Pokrytí je řízené **daty** v této struktuře, ne kódem v UI.
 * Přidání nového oboru = přidání nového záznamu v EDUCATION_TRACKS.
 */

import type { Grade, TopicMetadata } from "./types";
import { getAllTopics } from "./contentRegistry";

export type EducationLevel = "preschool" | "elementary" | "secondary" | "vocational" | "highschool";

export interface EducationTrack {
  id: string;
  /** Ročníky v rámci tracku (1-9 pro ZŠ, 1-4 pro SŠ) */
  yearRange: [number, number];
  /** Lidsky srozumitelný název */
  label: string;
  level: EducationLevel;
  /** Volitelný obor (pro SŠ a učňáky) */
  fieldOfStudy?: string;
}

export interface ParentTopic {
  id: string;
  /** Předmět (matematika, čeština, ...) */
  subject: string;
  /** Lidsky srozumitelný název pro rodiče */
  label: string;
  /** Krátký popis */
  description: string;
  /** Doporučený ročník (pro UX filter) */
  recommendedGrade: number;
  /** Ročníky kdy se to může objevit (pro filtr) */
  gradeRange: [number, number];
  /** Skill IDs z content registry */
  skillIds: string[];
  /** RVP referenční kódy (pro audit pokrytí) */
  rvpReferences?: string[];
  /** Track ID — pro budoucí rozlišení gymnázium vs učňák */
  trackId?: string;
}

// ─── EDUCATION TRACKS ─────────────────────────────────────────────────
export const EDUCATION_TRACKS: EducationTrack[] = [
  {
    id: "zs",
    label: "Základní škola",
    level: "elementary",
    yearRange: [1, 9],
  },
  // Připraveno pro rozšíření
  {
    id: "gymnazium",
    label: "Gymnázium",
    level: "highschool",
    yearRange: [1, 4],
  },
  {
    id: "sou",
    label: "Střední odborné učiliště",
    level: "vocational",
    yearRange: [1, 3],
  },
];

/**
 * Hlavní mapa — rodičovské téma → skill IDs.
 *
 * Postupně se naplňuje. Pro skills které **nemají** parent topic
 * přiřazený fallback "Volné procvičování" v dané kategorii.
 */
export const PARENT_TOPICS: ParentTopic[] = [
  // ─── Matematika 1.-3. ročník ──────────────────────────────────────
  {
    id: "math-pocty-do-20",
    subject: "matematika",
    label: "Sčítání a odčítání do 20",
    description: "Základní operace s čísly do 20",
    recommendedGrade: 1,
    gradeRange: [1, 2],
    skillIds: ["math-add-sub-20", "addSub20"].filter(Boolean),
    rvpReferences: ["M-3-1-01"],
    trackId: "zs",
  },
  {
    id: "math-pocty-do-100",
    subject: "matematika",
    label: "Sčítání a odčítání do 100",
    description: "Operace s dvojcifernými čísly",
    recommendedGrade: 2,
    gradeRange: [2, 3],
    skillIds: ["math-add-sub-100", "addSub100"].filter(Boolean),
    rvpReferences: ["M-3-1-02"],
    trackId: "zs",
  },
  {
    id: "math-nasobilka",
    subject: "matematika",
    label: "Násobilka",
    description: "Malá a velká násobilka",
    recommendedGrade: 3,
    gradeRange: [3, 5],
    skillIds: ["math-multiply", "math-multiply-small", "math-multiply-full", "math-multiply-twodigit"].filter(Boolean),
    rvpReferences: ["M-3-1-04"],
    trackId: "zs",
  },
  {
    id: "math-deleni",
    subject: "matematika",
    label: "Dělení",
    description: "Dělení jednociferným číslem, se zbytkem",
    recommendedGrade: 3,
    gradeRange: [3, 5],
    skillIds: ["math-divide", "math-divide-simple", "math-divide-remainder", "divideOneDigit", "divideRemainder"].filter(Boolean),
    rvpReferences: ["M-3-1-05"],
    trackId: "zs",
  },
  {
    id: "math-porovnavani",
    subject: "matematika",
    label: "Porovnávání čísel",
    description: "Větší, menší, rovno",
    recommendedGrade: 1,
    gradeRange: [1, 5],
    skillIds: ["math-compare-natural-numbers-100", "math-compare-10", "math-compare-100", "compareNatural"].filter(Boolean),
    rvpReferences: ["M-3-1-03"],
    trackId: "zs",
  },

  // ─── Matematika 4.-6. ročník ──────────────────────────────────────
  {
    id: "math-zlomky-zaklad",
    subject: "matematika",
    label: "Zlomky — základ",
    description: "Co je zlomek, čitatel, jmenovatel",
    recommendedGrade: 4,
    gradeRange: [4, 6],
    skillIds: [
      "frac_compare_same_den",
      "frac_compare_diff_den",
      "frac_compare_whole",
      "frac-compare-same-den",
      "frac-compare-diff-den",
    ].filter(Boolean),
    rvpReferences: ["M-5-1-01"],
    trackId: "zs",
  },
  {
    id: "math-zlomky-operace",
    subject: "matematika",
    label: "Zlomky — operace",
    description: "Sčítání, odčítání, krácení, rozšiřování",
    recommendedGrade: 5,
    gradeRange: [5, 7],
    skillIds: [
      "frac_mixed_add",
      "frac_mixed_sub",
      "frac_mul_whole_basic",
      "frac_mul_whole_reduce",
      "frac-add-same-den",
      "frac-add-diff-den",
    ].filter(Boolean),
    rvpReferences: ["M-5-1-02"],
    trackId: "zs",
  },
  {
    id: "math-desetinna",
    subject: "matematika",
    label: "Desetinná čísla",
    description: "Čtení, zápis, operace s desetinnými čísly",
    recommendedGrade: 5,
    gradeRange: [5, 7],
    skillIds: ["decimalIntro", "decimalRead", "decimalOps", "decimalMulDiv"].filter(Boolean),
    rvpReferences: ["M-5-1-04"],
    trackId: "zs",
  },
  {
    id: "math-zaokrouhlovani",
    subject: "matematika",
    label: "Zaokrouhlování",
    description: "Zaokrouhlování na desítky, stovky, tisíce",
    recommendedGrade: 4,
    gradeRange: [3, 6],
    skillIds: ["math-rounding"].filter(Boolean),
    trackId: "zs",
  },
  {
    id: "math-jednotky",
    subject: "matematika",
    label: "Jednotky délky, hmotnosti, objemu",
    description: "Převody mezi jednotkami",
    recommendedGrade: 4,
    gradeRange: [3, 6],
    skillIds: [
      "math-length-convert-combined",
      "math-length-estimate-compare",
      "math-length-word-problems",
      "math-weight-units-basic",
      "math-volume-units-basic",
    ].filter(Boolean),
    trackId: "zs",
  },
  {
    id: "math-geometrie",
    subject: "matematika",
    label: "Geometrické tvary a obvody",
    description: "Tvary, obvod, jednoduché výpočty",
    recommendedGrade: 4,
    gradeRange: [3, 6],
    skillIds: ["math-shapes", "math-perimeter", "areaGrid"].filter(Boolean),
    trackId: "zs",
  },
  {
    id: "math-uhly",
    subject: "matematika",
    label: "Úhly a trojúhelníky",
    description: "Měření úhlů, druhy trojúhelníků",
    recommendedGrade: 6,
    gradeRange: [6, 7],
    skillIds: ["angles6"].filter(Boolean),
    trackId: "zs",
  },
  {
    id: "math-delitelnost",
    subject: "matematika",
    label: "Dělitelnost",
    description: "Násobky, dělitelé, prvočísla",
    recommendedGrade: 6,
    gradeRange: [6, 7],
    skillIds: ["divisibility"].filter(Boolean),
    trackId: "zs",
  },

  // ─── Čeština ──────────────────────────────────────────────────────
  {
    id: "cz-vyjmenovana",
    subject: "čeština",
    label: "Vyjmenovaná slova",
    description: "Pravopis y/i po obojetných souhláskách",
    recommendedGrade: 3,
    gradeRange: [2, 5],
    skillIds: [
      "cz-vyjmenovana-slova-b",
      "cz-vyjmenovana-slova-l",
      "cz-vyjmenovana-slova-m",
      "cz-vyjmenovana-slova-p",
      "cz-vyjmenovana-slova-s",
      "cz-vyjmenovana-slova-v",
      "cz-vyjmenovana-slova-z",
    ].filter(Boolean),
    rvpReferences: ["ČJ-3-2-04"],
    trackId: "zs",
  },
  {
    id: "cz-tvrde-mekke",
    subject: "čeština",
    label: "Tvrdé a měkké souhlásky",
    description: "Pravopis y/i po tvrdých a měkkých souhláskách",
    recommendedGrade: 2,
    gradeRange: [2, 4],
    skillIds: ["cz-tvrde-mekke"].filter(Boolean),
    rvpReferences: ["ČJ-3-2-03"],
    trackId: "zs",
  },
  {
    id: "cz-parove-souhlasky",
    subject: "čeština",
    label: "Párové souhlásky",
    description: "Rozlišování párových souhlásek (d/t, b/p, ...)",
    recommendedGrade: 3,
    gradeRange: [2, 5],
    skillIds: ["cz-parove-souhlasky"].filter(Boolean),
    rvpReferences: ["ČJ-3-2-02"],
    trackId: "zs",
  },
  {
    id: "cz-velka-pismena",
    subject: "čeština",
    label: "Velká písmena",
    description: "Kdy psát velké písmeno",
    recommendedGrade: 4,
    gradeRange: [3, 6],
    skillIds: ["cz-velka-pismena"].filter(Boolean),
    trackId: "zs",
  },
  {
    id: "cz-mluvnice",
    subject: "čeština",
    label: "Mluvnice (slovní druhy, slovesa)",
    description: "Slovní druhy, určování sloves, rod a číslo",
    recommendedGrade: 4,
    gradeRange: [3, 7],
    skillIds: ["cz-slovni-druhy", "cz-slovesa-urcovani", "cz-rod-cislo", "cz-zaklad-vety"].filter(Boolean),
    trackId: "zs",
  },
  {
    id: "cz-diktat",
    subject: "čeština",
    label: "Doplňovací diktát",
    description: "Procvičování pravopisu v souvislém textu",
    recommendedGrade: 4,
    gradeRange: [3, 7],
    skillIds: ["cz-diktat"].filter(Boolean),
    trackId: "zs",
  },

  // ─── Prvouka ──────────────────────────────────────────────────────
  {
    id: "prv-priroda",
    subject: "prvouka",
    label: "Příroda kolem nás",
    description: "Rostliny, zvířata, roční období",
    recommendedGrade: 2,
    gradeRange: [1, 3],
    skillIds: ["pr-plant-parts", "pr-plant-lifecycle", "pr-seasons", "pr-seasons-order"].filter(Boolean),
    trackId: "zs",
  },
  {
    id: "prv-telo",
    subject: "prvouka",
    label: "Lidské tělo a zdraví",
    description: "Části těla, smysly, zdraví",
    recommendedGrade: 2,
    gradeRange: [1, 3],
    skillIds: ["pr-body-parts", "pr-health", "pr-first-aid", "pr-digestion-order"].filter(Boolean),
    trackId: "zs",
  },
];

// ─── Helper API ────────────────────────────────────────────────────────

/** Vrátí parent topics pro daný ročník + předmět */
export function getParentTopicsForGrade(grade: Grade, subject?: string): ParentTopic[] {
  return PARENT_TOPICS.filter((pt) => {
    if (subject && pt.subject !== subject) return false;
    return grade >= pt.gradeRange[0] && grade <= pt.gradeRange[1];
  });
}

/** Vrátí parent topic podle ID */
export function getParentTopicById(id: string): ParentTopic | undefined {
  return PARENT_TOPICS.find((pt) => pt.id === id);
}

/** Vrátí skill IDs pro parent topic */
export function getSkillIdsForParentTopic(parentTopicId: string): string[] {
  return getParentTopicById(parentTopicId)?.skillIds ?? [];
}

/** Najde, do kterého parent topic patří daný skill */
export function getParentTopicForSkill(skillId: string): ParentTopic | undefined {
  return PARENT_TOPICS.find((pt) => pt.skillIds.includes(skillId));
}

/**
 * Audit pokrytí — které skills nemají parent topic.
 * Pro adminy: pomáhá najít "díry" v UX vrstvě.
 */
export function getOrphanedSkills(): TopicMetadata[] {
  const allTopics = getAllTopics();
  const mapped = new Set<string>();
  for (const pt of PARENT_TOPICS) for (const sid of pt.skillIds) mapped.add(sid);
  return allTopics.filter((t) => !mapped.has(t.id));
}

/**
 * Audit RVP pokrytí — které RVP referenční kódy už máme zmapované.
 */
export function getCoveredRvpRefs(): string[] {
  const refs = new Set<string>();
  for (const pt of PARENT_TOPICS) {
    for (const r of pt.rvpReferences ?? []) refs.add(r);
  }
  return [...refs].sort();
}

/** Vrátí všechny tracky filtrované podle úrovně */
export function getTracksByLevel(level: EducationLevel): EducationTrack[] {
  return EDUCATION_TRACKS.filter((t) => t.level === level);
}
