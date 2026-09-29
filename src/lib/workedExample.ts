import type { PracticeTask, TopicMetadata } from "@/lib/types";
import { taskKey } from "@/lib/levelCoverage";

/**
 * Vyřešený ukázkový příklad („Podívej, takhle se to řeší") — výklad, který
 * nestojí žádný nový obsah: vezme úlohu z generátoru a ukáže ji vyřešenou
 * (zadání → odpověď → kroky → proč ne ostatní možnosti). Funguje pro všech
 * 340 témat a pro každou úroveň, tedy i pro L3, která vlastní výklad nemá.
 *
 * Úloha NESMÍ být z rozdělané sady (`batch`), jinak by ukázka prozradila
 * odpověď na nadcházející úlohu. Porovnává se celá identita úlohy
 * (`taskKey`: zadání + dvojice/kategorie/položky), ne jen text zadání —
 * u „Spoj každé zvíře se skupinou…" mají všechny úlohy stejné zadání
 * a liší se dvojicemi. K tomu i nabídka možností: „Které z těchto slov se
 * píše s velkým písmenem?" je v poolu stále totéž zadání s jinými slovy
 * a ukázka s jinou nabídkou nic neprozradí. Když nic mimo sadu nezbývá,
 * vrací `null`: lepší žádná ukázka než prozrazená.
 */
// Možnosti SEŘAZENÉ: generátory je při každém volání míchají, takže by tatáž
// úloha ze sady vypadala jako jiná — a ukázka by ji prozradila.
const identity = (t: PracticeTask) => `${taskKey(t)}||${JSON.stringify([...(t.options ?? [])].sort())}`;

export function pickWorkedExample(topic: TopicMetadata, level: number, batch: readonly PracticeTask[]): PracticeTask | null {
  let tasks: PracticeTask[];
  try {
    tasks = topic.generator(level) ?? [];
  } catch {
    return null;
  }
  const used = new Set(batch.map(identity));
  // Náhodně, ne „první": některé pooly mají pevné pořadí a dítě by při každém
  // vstupu vidělo tutéž ukázku. Stabilitu v rámci sady drží memo volajícího.
  const candidates = tasks.filter((t) => t.question && !used.has(identity(t)));
  return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
}
