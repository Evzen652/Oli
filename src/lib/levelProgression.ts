/**
 * Level progression — pure funkce, žádný DB přístup.
 *
 * Rozhoduje, zda žák po sezení postoupí na vyšší/nižší level difficulty.
 * Adaptace probíhá MEZI sezeními, ne v reálném čase uvnitř sezení.
 *
 * Pravidla:
 *   - 2× za sebou score >= 0.8  → postup o 1 level nahoru (max 3)
 *   - 1× score <= 0.4            → okamžitý sestup o 1 level dolů (min 1)
 *   - Při změně levelu se resetují consecutive countery
 */

export interface SkillLevelState {
  level: number;            // 1–3
  consecutiveGood: number;  // sezení za sebou se score >= 0.8
  consecutiveBad: number;   // sezení za sebou se score <= 0.4
  lastScore: number;        // score z posledního sezení (0–1)
}

export interface LevelProgressionResult {
  newLevel: number;
  newConsecutiveGood: number;
  newConsecutiveBad: number;
  didChange: boolean;
  direction: "up" | "down" | "same";
}

const GOOD_THRESHOLD = 0.8;
const BAD_THRESHOLD = 0.4;
const SESSIONS_TO_ADVANCE = 2; // 2× za sebou dobré → postup

export function computeNextLevel(
  current: SkillLevelState,
  sessionScore: number
): LevelProgressionResult {
  const isGood = sessionScore >= GOOD_THRESHOLD;
  const isBad = sessionScore <= BAD_THRESHOLD;

  const newConsecutiveGood = isGood ? current.consecutiveGood + 1 : 0;
  const newConsecutiveBad = isBad ? current.consecutiveBad + 1 : 0;

  let newLevel = current.level;

  if (newConsecutiveGood >= SESSIONS_TO_ADVANCE && current.level < 3) {
    newLevel = current.level + 1;
  } else if (isBad && current.level > 1) {
    newLevel = current.level - 1; // okamžitý sestup, nepotřebuje streak
  }

  const didChange = newLevel !== current.level;

  return {
    newLevel,
    // resetuj countery pokud se level změnil
    newConsecutiveGood: didChange ? 0 : newConsecutiveGood,
    newConsecutiveBad: didChange ? 0 : newConsecutiveBad,
    direction: newLevel > current.level ? "up" : newLevel < current.level ? "down" : "same",
    didChange,
  };
}
