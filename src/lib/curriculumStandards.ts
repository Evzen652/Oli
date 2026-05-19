/**
 * Curriculum standards per country.
 * Each standard drives AI prompt language, grade range, and pedagogical framing.
 *
 * When expanding to a new country:
 * 1. Add entry here
 * 2. Create curriculum_programs row in DB with matching country code
 * 3. curriculum_subjects.program_id → FK to that program
 * 4. AdminDashboard reads program_id → picks standard automatically
 */

export interface CurriculumStandard {
  key: string;
  /** Short name shown in UI and cited in prompts: "RVP ZV" */
  name: string;
  /** Full official name */
  fullName: string;
  /** Issuing authority */
  authority: string;
  /** ISO 3166-1 alpha-2 */
  country: string;
  /** BCP-47 language tag for prompt generation */
  language: string;
  gradeMin: number;
  gradeMax: number;
  /** Word for school grade in target language: "ročník", "klasa" */
  gradeLabel: string;
  /**
   * Extra instructions appended to every AI prompt.
   * Should be in the target language and reference the standard precisely.
   */
  promptInstructions: string;
}

export const CURRICULUM_STANDARDS: Record<string, CurriculumStandard> = {
  CZ: {
    key: "CZ",
    name: "RVP ZV",
    fullName: "Rámcový vzdělávací program pro základní vzdělávání",
    authority: "MŠMT",
    country: "CZ",
    language: "cs",
    gradeMin: 1,
    gradeMax: 9,
    gradeLabel: "ročník",
    promptInstructions: `
Obsah musí odpovídat RVP ZV (MŠMT, aktuální verze).
Používej českou pedagogickou terminologii.
Zohledni stupeň vzdělávání: 1. stupeň (1.–5. ročník), 2. stupeň (6.–9. ročník).
Klíčové kompetence: komunikativní, k učení, k řešení problémů, sociální a personální, občanské, pracovní.`.trim(),
  },

  PL: {
    key: "PL",
    name: "Podstawa programowa",
    fullName: "Podstawa programowa kształcenia ogólnego dla szkół podstawowych",
    authority: "MEiN",
    country: "PL",
    language: "pl",
    gradeMin: 1,
    gradeMax: 8,
    gradeLabel: "klasa",
    promptInstructions: `
Treść musi być zgodna z Podstawą programową (MEiN, rozporządzenie 2017/2023).
Używaj polskiej terminologii pedagogicznej. Formułuj wyłącznie po polsku.
Uwzględnij etapy edukacyjne: I etap (kl. 1–3), II etap (kl. 4–8).
Odwołuj się do wymagań szczegółowych i ogólnych z Podstawy programowej.`.trim(),
  },

  SK: {
    key: "SK",
    name: "iŠVP",
    fullName: "Inovovaný štátny vzdelávací program",
    authority: "MŠVVaŠ SR",
    country: "SK",
    language: "sk",
    gradeMin: 1,
    gradeMax: 9,
    gradeLabel: "ročník",
    promptInstructions: `
Obsah musí zodpovedať iŠVP (MŠVVaŠ SR, aktuálna verzia).
Používaj slovenčinu a slovenskú pedagogickú terminológiu.
Zohľadni vzdelávacie štandardy: výkonový štandard a obsahový štandard pre daný ročník.`.trim(),
  },
};

/** Active standard for current deployment. Switch when expanding to new country. */
export const ACTIVE_STANDARD: CurriculumStandard = CURRICULUM_STANDARDS.CZ;
