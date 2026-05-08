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
  "math-add-sub-50": "Sčítání a odčítání do 50",
  "addSub20": "Sčítání a odčítání do 20",
  "addSub50": "Sčítání a odčítání do 50",
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
const SUBJECT_BY_PREFIX: Array<{ pattern: RegExp; subject: string }> = [
  { pattern: /^(math[-_]|addSub|divideO|divideR|compareN|frac[-_])/i, subject: "matematika" },
  { pattern: /^(cz[-_]|czech)/i, subject: "čeština" },
  { pattern: /^(pr[-_]|prvouka)/i, subject: "prvouka" },
];

export function getSkillSubject(skillId: string): string | null {
  const topic = getTopicById(skillId) ?? getTopicById(canonicalSkillId(skillId));
  if (topic?.subject) return topic.subject;
  for (const { pattern, subject } of SUBJECT_BY_PREFIX) {
    if (pattern.test(skillId)) return subject;
  }
  return null;
}

/**
 * Vrátí emoji ilustraci pro téma podle klíčových slov v názvu/ID.
 * Pokud žádný pattern neodpovídá, vrátí emoji předmětu (🔢/📝/🌍).
 *
 * Používá se na skill kartách v reportu a v list view.
 */
const TOPIC_ICON_PATTERNS: Array<{ test: RegExp; emoji: string }> = [
  // Matematika — operace
  { test: /(porovn[aá]v[aá]n[ií]|comparison|compare)/i, emoji: "⚖️" },
  { test: /(s[čc][ií]t[aá]n[ií].*od[čc][ií]t[aá]n[ií]|add.?sub|addsub)/i, emoji: "➕" },
  { test: /(s[čc][ií]t[aá]n[ií]|sum|add(?!sub))/i, emoji: "➕" },
  { test: /(od[čc][ií]t[aá]n[ií]|subtract|sub(?:tract)?)/i, emoji: "➖" },
  { test: /(n[aá]sob(?:ilka|en[ií])|multipl|násob)/i, emoji: "✖️" },
  { test: /(d[eě]len[ií]|divide|divid)/i, emoji: "➗" },
  { test: /(zaokrouhl|rounding)/i, emoji: "🎯" },
  // Matematika — geometrie
  { test: /(obvod|perimeter)/i, emoji: "📐" },
  { test: /(obsah|area)/i, emoji: "🟦" },
  { test: /(p[řr]evod|jednotk|units|length|d[eé]lk)/i, emoji: "📏" },
  { test: /(troj[uú]heln[ií]k|triangle)/i, emoji: "🔺" },
  { test: /([čc]tverec|square|obd[eé]ln[ií]k|rectangle)/i, emoji: "▢" },
  { test: /(kruh|circle|kru[žz]nice)/i, emoji: "⭕" },
  // Matematika — zlomky
  { test: /(zlomek|zlomk|frac|frakce)/i, emoji: "🍕" },
  { test: /(desetin|decimal)/i, emoji: "🔢" },
  { test: /(procent|percent)/i, emoji: "💯" },
  { test: /(z[aá]porn|negative|negativ)/i, emoji: "🌡️" },
  // Matematika — čísla obecně
  { test: /(milion|million|tis[ií]c|thousand)/i, emoji: "🔢" },
  // Čeština
  { test: /(diktat|diktát)/i, emoji: "✍️" },
  { test: /(vyjmenovan[aá]|vyjmen)/i, emoji: "📚" },
  { test: /(slovn[ií] druhy|slovn[ií]-druhy|word.?class)/i, emoji: "🏷️" },
  { test: /(p[áa]rov[eé]|párov)/i, emoji: "🔤" },
  { test: /(velk[áa] p[ií]smen|capital)/i, emoji: "🔠" },
  { test: /(pravopis|spell)/i, emoji: "📝" },
  { test: /(skloň|sklon|deklin)/i, emoji: "🔄" },
  { test: /([čc]asov[áa]n|[čc]asov|conjug)/i, emoji: "⏱️" },
  { test: /(synonym|antonym|protiklad)/i, emoji: "🔁" },
  { test: /([čc]ten[aá]?|reading)/i, emoji: "📖" },
  // Prvouka / přírodověda
  { test: /(rostlin|plant)/i, emoji: "🌱" },
  { test: /(zv[ií][řr]|animal)/i, emoji: "🐾" },
  { test: /(t[eě]lo|body|orgán|organ)/i, emoji: "🫀" },
  { test: /(po[čc]as[ií]|weather|teplot|temperature)/i, emoji: "🌤️" },
  { test: /(voda|water)/i, emoji: "💧" },
  { test: /(les|forest|strom|tree)/i, emoji: "🌳" },
  { test: /(hodin|time|[čc]as)/i, emoji: "🕐" },
  // Vlastivěda
  { test: /(d[eě]jin|history|histor)/i, emoji: "📜" },
  { test: /(geograf|země|země|map|stát)/i, emoji: "🗺️" },
];

const SUBJECT_FALLBACK_ICON: Record<string, string> = {
  matematika: "🔢",
  "čeština": "📝",
  prvouka: "🌍",
  "přírodověda": "🌿",
  "vlastivěda": "🗺️",
};

export function getSkillIcon(skillId: string): string {
  if (!skillId) return "📚";
  const name = getReadableSkillName(skillId).toLowerCase();
  // Hledáme v názvu (priorita) i v ID
  const haystack = `${name} ${skillId}`;
  for (const { test, emoji } of TOPIC_ICON_PATTERNS) {
    if (test.test(haystack)) return emoji;
  }
  // Fallback na předmět
  const subj = getSkillSubject(skillId);
  if (subj && SUBJECT_FALLBACK_ICON[subj]) return SUBJECT_FALLBACK_ICON[subj];
  // Heuristika podle prefixu
  if (skillId.startsWith("math") || skillId.startsWith("frac")) return "🔢";
  if (skillId.startsWith("cz-")) return "📝";
  if (skillId.startsWith("pr-") || skillId.startsWith("prv-")) return "🌍";
  return "📚";
}
