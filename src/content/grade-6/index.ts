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

// Fyzika — Látky a tělesa (pojmový vzor)
import { LATKA_A_TELESO } from "./fyzika/latkaATeleso";
import { SKUPENSTVI_LATEK } from "./fyzika/skupenstviLatek";
import { ATOMY_MOLEKULY } from "./fyzika/atomyMolekuly";
import { POHYB_CASTIC } from "./fyzika/pohybCastic";
import { ELEKTRICKY_NABOJ } from "./fyzika/elektrickyNaboj";
import { ELEKTRICKY_OBVOD } from "./fyzika/elektrickyObvod";
import { MAGNETY } from "./fyzika/magnety";

// Dějepis (pilot — faktický vzor)
import { PERIODIZACE_LETOPOCET } from "./dejepis/periodizaceLetopocet";
import { DOBA_KAMENNA_PERIODIZACE } from "./dejepis/dobaKamennaPeriodizace";
import { HISTORICKE_PRAMENY } from "./dejepis/historickePrameny";
import { POMOCNE_VEDY_HISTORICKE } from "./dejepis/pomocneVedyHistoricke";
import { CO_JE_DEJEPIS } from "./dejepis/coJeDejepis";
import { HOMINIZACE } from "./dejepis/hominizace";
import { NEOLITICKA_REVOLUCE } from "./dejepis/neolitickaRevoluce";
import { DOBA_BRONZOVA_ZELEZNA } from "./dejepis/dobaBronzovaZelezna";
import { LOVCI_MAMUTU_VESTONICKA_VENUSE } from "./dejepis/lovciMamutuVestonickaVenuse";
import { KELTOVE_GERMANI_SLOVANE } from "./dejepis/keltoveGermaniSlovane";
import { MEZOPOTAMIE } from "./dejepis/mezopotamie";
import { STAROVEKY_EGYPT } from "./dejepis/starovekyEgypt";

export const GRADE_6_TOPICS: TopicMetadata[] = [
  // Fyzika — Měření fyzikálních veličin
  ...MERENI_DELKY,
  ...MERENI_HMOTNOSTI,
  ...MERENI_OBJEMU,
  ...HUSTOTA,
  ...MERENI_TEPLOTY,
  ...MERENI_CASU,
  // Fyzika — Látky a tělesa
  ...LATKA_A_TELESO,
  ...SKUPENSTVI_LATEK,
  ...ATOMY_MOLEKULY,
  ...POHYB_CASTIC,
  ...ELEKTRICKY_NABOJ,
  ...ELEKTRICKY_OBVOD,
  ...MAGNETY,
  // Dějepis — Úvod do dějepisu
  ...PERIODIZACE_LETOPOCET,
  // Dějepis — Pravěk
  ...DOBA_KAMENNA_PERIODIZACE,
  // Dějepis — Úvod do dějepisu
  ...CO_JE_DEJEPIS,
  ...HISTORICKE_PRAMENY,
  ...POMOCNE_VEDY_HISTORICKE,
  // Dějepis — Pravěk
  ...HOMINIZACE,
  ...NEOLITICKA_REVOLUCE,
  ...DOBA_BRONZOVA_ZELEZNA,
  ...LOVCI_MAMUTU_VESTONICKA_VENUSE,
  ...KELTOVE_GERMANI_SLOVANE,
  // Dějepis — Nejstarší státy
  ...MEZOPOTAMIE,
  ...STAROVEKY_EGYPT,
];
