/**
 * Grade 4 — veřejný export.
 *
 * Vše, co grade-4 modul nabízí zbytku aplikace, prochází tudy.
 * Vnitřní soubory grade-4/ se NEimportují odjinud.
 *
 * Grade-4 session přidává topics postupně. Každý topic je `TopicMetadata`
 * (z `src/lib/types.ts`) s vyplněným `rvpNodeId` linkujícím na RVP dataset.
 */

import type { TopicMetadata } from "@/lib/types";

// Postupně přidává grade-4 session, jak vznikají topics.
// Pattern: jeden soubor per téma, exportuje pole TopicMetadata.
//
// import { ZLOMKY_INTRO } from "./matematika/zlomkyIntro";
// import { OBVOD_OBSAH } from "./matematika/obvodObsah";
// ...

export const GRADE_4_TOPICS: TopicMetadata[] = [
  // ...ZLOMKY_INTRO,
  // ...OBVOD_OBSAH,
];
