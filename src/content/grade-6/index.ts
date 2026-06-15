/**
 * Grade 6 — veřejný export (2. stupeň, pilot).
 *
 * Pravidla a tone-of-voice viz `src/content/grade-6/README.md`.
 * GRADE_6_TOPICS obsahuje JEN hotové topics (žádné skelety → žádný broken
 * obsah v běžící app). Témata se přidávají postupně, jak procházejí
 * Definition of Done (README sekce „Definition of Done").
 */

import type { TopicMetadata } from "@/lib/types";

// Fyzika (pilot — výpočetní vzor)
import { MERENI_DELKY } from "./fyzika/mereniDelky";

export const GRADE_6_TOPICS: TopicMetadata[] = [
  // Fyzika
  ...MERENI_DELKY,
];
