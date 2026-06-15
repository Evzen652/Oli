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
import { MERENI_HMOTNOSTI } from "./fyzika/mereniHmotnosti";
import { MERENI_OBJEMU } from "./fyzika/mereniObjemu";
import { HUSTOTA } from "./fyzika/hustota";
import { MERENI_TEPLOTY } from "./fyzika/mereniTeploty";
import { MERENI_CASU } from "./fyzika/mereniCasu";

// Dějepis (pilot — faktický vzor)
import { PERIODIZACE_LETOPOCET } from "./dejepis/periodizaceLetopocet";
import { DOBA_KAMENNA_PERIODIZACE } from "./dejepis/dobaKamennaPeriodizace";

export const GRADE_6_TOPICS: TopicMetadata[] = [
  // Fyzika — Měření fyzikálních veličin
  ...MERENI_DELKY,
  ...MERENI_HMOTNOSTI,
  ...MERENI_OBJEMU,
  ...HUSTOTA,
  ...MERENI_TEPLOTY,
  ...MERENI_CASU,
  // Dějepis — Úvod do dějepisu
  ...PERIODIZACE_LETOPOCET,
  // Dějepis — Pravěk
  ...DOBA_KAMENNA_PERIODIZACE,
];
