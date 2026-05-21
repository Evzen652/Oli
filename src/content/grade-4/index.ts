/**
 * Grade 4 — veřejný export.
 *
 * Vše, co grade-4 modul nabízí zbytku aplikace, prochází tudy.
 * Vnitřní soubory grade-4/ se NEimportují odjinud.
 */

import type { TopicMetadata } from "../types";

// Pro lookup vlastních uzlů ve své práci použij:
//   import { getNodesByGradeSubject } from "../curriculum";
//   const nodes = getNodesByGradeSubject(4, "matematika"); // 14 uzlů

// Postupně přidává grade-4 session, jak vznikají topics:
// import { MATEMATIKA_GRADE_4 } from "./matematika";
// import { CESTINA_GRADE_4 } from "./cestina";
// import { VLASTIVEDA_GRADE_4 } from "./vlastiveda";
// import { PRIRODOVEDA_GRADE_4 } from "./prirodoveda";
// import { INFORMATIKA_GRADE_4 } from "./informatika";

export const GRADE_4_TOPICS: TopicMetadata[] = [
  // ...MATEMATIKA_GRADE_4,
  // ...CESTINA_GRADE_4,
  // ...VLASTIVEDA_GRADE_4,
  // ...PRIRODOVEDA_GRADE_4,
  // ...INFORMATIKA_GRADE_4,
];
