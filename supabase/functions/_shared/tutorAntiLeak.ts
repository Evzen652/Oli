/**
 * Tutor anti-leak filter (Fáze 7) — kontroluje, jestli AI odpověď
 * v phase=practice neprozrazuje correct_answer aktuální úlohy.
 *
 * Pure heuristic, žádné AI volání. Záměrně OBEZŘETNĚJŠÍ než liberální:
 * raději false positive (žák dostane "skoro jsem ti to prozradil") než
 * false negative (AI prozradí výsledek a zničí pedagogický efekt).
 *
 * Sdíleno mezi tutor-chat edge fn (Deno) a vitestem (Node) — pure TS,
 * žádné runtime-specific importy.
 *
 * Strategie:
 *   1) Rovnost s odpovědí: "= 36" (čísla, výrazy)
 *   2) Slovní obraty "odpověď je 36", "vyjde 36", "správně je…"
 *   3) Krátké numerické / nerovnostní odpovědi jako samostatný token
 *      (např. ans="36" → "36" v "Tady je 36 jablek" = leak)
 */

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Vrátí true pokud `reply` prozrazuje `correctAnswer`.
 * Volat POUZE v phase=practice (s known correct_answer).
 */
export function checkAnswerLeak(reply: string, correctAnswer: string): boolean {
  if (!correctAnswer) return false;
  const ans = correctAnswer.trim();
  if (ans.length < 1) return false;

  const replyLower = reply.toLowerCase();
  const ansLower = ans.toLowerCase();

  // Pattern 1: rovnost "= 36" / "=36"
  const eqPattern = new RegExp(`=\\s*${escapeRegex(ansLower)}(\\b|$)`);
  if (eqPattern.test(replyLower)) return true;

  // Pattern 2: typické slovní obraty prozrazující odpověď
  const phrasePatterns = [
    `odpověď\\s+je\\s+${escapeRegex(ansLower)}`,
    `odpověď\\s*:\\s*${escapeRegex(ansLower)}`,
    `výsledek\\s+je\\s+${escapeRegex(ansLower)}`,
    `vyjde\\s+${escapeRegex(ansLower)}`,
    `správně\\s+je\\s+${escapeRegex(ansLower)}`,
    `je\\s+to\\s+${escapeRegex(ansLower)}\\b`,
  ];
  for (const p of phrasePatterns) {
    if (new RegExp(p).test(replyLower)) return true;
  }

  // Pattern 3: krátké numerické/nerovnostní odpovědi jako samostatný token
  if (/^[<>=]$/.test(ans) || /^\d+([\.,]\d+)?$/.test(ans)) {
    if (ans.length <= 4) {
      const tokenPattern = new RegExp(`(^|[^\\w\\d])${escapeRegex(ansLower)}([^\\w\\d]|$)`);
      if (tokenPattern.test(replyLower)) return true;
    }
  }

  return false;
}
