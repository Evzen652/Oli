/**
 * Lidsky srozumitelné názvy skillů — pro rodičovský dashboard a notifikace.
 *
 * Strategie:
 *  1) Nejdřív zkus contentRegistry.getTopicById() (s aliasy přes normalizer)
 *  2) Pokud existuje topic — vrať `${topic.topic}: ${topic.title}` pokud se
 *     liší (kontext + detail), jinak jen title
 *  3) Pokud neexistuje — vrať mapped name z FALLBACK_NAMES (curated)
 *  4) Poslední záchrana: konvertuj kebab/snake_case → "Sentence case"
 */

import { getTopicById } from "./contentRegistry";
import { canonicalSkillId } from "./skillIdNormalizer";

/** Curated mapování pro skill IDs, které **neexistují** v registry. */
const FALLBACK_NAMES: Record<string, string> = {
  "math-multiply-full": "Násobilka",
  "math-multiply-small": "Malá násobilka",
  "math-multiply-twodigit": "Násobení dvojciferným",
  "math-add-sub-20": "Sčítání a odčítání do 20",
  "addSub20": "Sčítání a odčítání do 20",
  "addSub100": "Sčítání a odčítání do 100",
  "math-divide-simple": "Dělení",
  "math-divide-remainder": "Dělení se zbytkem",
  "divideOneDigit": "Písemné dělení",
  "divideRemainder": "Dělení se zbytkem",
  "math-compare-10": "Porovnávání do 10",
  "math-compare-100": "Porovnávání do 100",
  "compareNatural": "Porovnávání čísel",
  "frac-compare-same-den": "Porovnávání zlomků (stejný jmenovatel)",
  "frac-compare-diff-den": "Porovnávání zlomků (různý jmenovatel)",
  "frac-compare-whole": "Porovnávání zlomků s celým číslem",
};

/** Konvertuje kebab/snake_case ID na čitelný název jako poslední záchrana. */
function humanizeId(id: string): string {
  const cleaned = id
    .replace(/^math-/, "")
    .replace(/^pr-/, "")
    .replace(/^cz-/, "")
    .replace(/^frac[-_]/, "")
    .replace(/[-_]/g, " ")
    .trim();
  if (!cleaned) return id;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Vrátí lidsky srozumitelný název skillu pro UI.
 * @param skillId Skill ID (může obsahovat aliasy nebo i neexistující skill)
 * @param options.includeTopic Pokud true a topic se liší od title, vrátí "Topic: Title"
 */
export function getReadableSkillName(
  skillId: string,
  options: { includeTopic?: boolean } = {},
): string {
  if (!skillId) return "—";

  const { includeTopic = true } = options;

  // 1) Try direct lookup
  let topic = getTopicById(skillId);

  // 2) Try canonical ID (alias resolution)
  if (!topic) {
    const canonical = canonicalSkillId(skillId);
    if (canonical !== skillId) topic = getTopicById(canonical);
  }

  if (topic) {
    // Pokud je topic.topic shodný s title (nebo title obsahuje topic), vrať jen title
    if (!includeTopic || topic.topic === topic.title || topic.title.includes(topic.topic)) {
      return topic.title;
    }
    // Jinak prefix s topic pro kontext (např. "Sčítání zlomků: Se stejným jmenovatelem")
    return `${topic.topic}: ${topic.title}`;
  }

  // 3) Curated fallback
  if (FALLBACK_NAMES[skillId]) return FALLBACK_NAMES[skillId];
  const canonical = canonicalSkillId(skillId);
  if (FALLBACK_NAMES[canonical]) return FALLBACK_NAMES[canonical];

  // 4) Last resort: humanize
  return humanizeId(skillId);
}

/**
 * Vrátí jen krátký název (bez topic prefixu) — pro stísněné UI.
 */
export function getShortSkillName(skillId: string): string {
  return getReadableSkillName(skillId, { includeTopic: false });
}

/**
 * Vrátí předmět (subject) skillu pokud existuje v registry.
 * Užitečné pro řazení/grupování (matematika, čeština, ...).
 */
export function getSkillSubject(skillId: string): string | null {
  const topic = getTopicById(skillId) ?? getTopicById(canonicalSkillId(skillId));
  return topic?.subject ?? null;
}
