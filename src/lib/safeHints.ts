import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { getHelpForTopic } from "@/lib/helpEngine";

/**
 * Vrátí nápovědy bezpečné pro zobrazení žákovi — nikdy neprozradí celou odpověď.
 * Vždy vrací alespoň 2 hinty (pokud jsou k dispozici podklady).
 *
 * Pro typy, kde per-task hints ze své podstaty obsahují celou správnou odpověď
 * (drag_order, match_pairs, categorize), se hinty generují ze struktury úlohy:
 *   H1 — obecná strategie (z helpTemplate nebo generická)
 *   H2 — kotva: první/poslední prvek (jen jeden, ne celá sekvence)
 *
 * Pro ostatní typy se vrátí per-task hints beze změny.
 */
export function getSafeHints(
  task: PracticeTask | null | undefined,
  topic: TopicMetadata | null | undefined
): string[] {
  if (!task) return [];

  const inputType = topic?.inputType;
  const help = getHelpForTopic(topic ?? null);

  if (inputType === "drag_order") {
    const items = task.items ?? [];
    // helpTemplate.hint pro ordering témata typicky obsahuje celou sekvenci — nepoužívat
    const h1 = "Přemýšlej, co přišlo jako první. Co je nejstarší, nejmenší nebo se stalo dřív?";
    const h2 = items.length > 0
      ? `Nápověda: první v pořadí je „${items[0]}".`
      : "Zkus začít od nejstaršího nebo nejmenšího.";
    return [h1, h2];
  }

  if (inputType === "match_pairs" || inputType === "categorize") {
    const h1 = help?.hint ?? "Přemýšlej, co k sobě patří.";
    const pairs = task.pairs ?? [];
    const h2 = pairs.length > 0
      ? `Příklad: „${pairs[0].left}" patří k „${pairs[0].right}".`
      : "Zkus začít párováním toho, co znáš nejlépe.";
    return [h1, h2];
  }

  return task.hints ?? [];
}
